// `virtual:carved-api`: the props each component declares itself, with their documentation,
// read from the React package's types. Props inherited from React Aria link to its docs.
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import type { Plugin } from 'vite';

export interface Prop {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}
export interface ComponentApi {
  description: string;
  props: Prop[];
}

function describe(checker: ts.TypeChecker, type: ts.Type): string {
  const named = checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation);
  if (
    type.isUnion() &&
    type.types.every((member) => member.isLiteral() || member.flags & ts.TypeFlags.BooleanLiteral)
  ) {
    const literals = type.types.map((member) => checker.typeToString(member));
    if (literals.length <= 8)
      return [
        ...new Set(
          literals.map((value) => (value === 'false' || value === 'true' ? 'boolean' : value)),
        ),
      ].join(' | ');
  }
  return named.replace(/import\("[^"]+"\)\./g, '');
}

const source = fileURLToPath(new URL('../../../packages/react/src/', import.meta.url));
const id = 'virtual:carved-api';

/**
 * The props each exported component declares itself, with their documentation. An alias such
 * as `export const CommandItem = MenuItem` takes the props of the component it names and its
 * own description; an alias of another package's component has a description only.
 */
export function extract(): Record<string, ComponentApi> {
  const program = ts.createProgram([`${source}index.ts`], {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    strict: true,
    skipLibCheck: true,
  });
  const checker = program.getTypeChecker();
  const index = program.getSourceFile(`${source}index.ts`)!;
  const resolve = (symbol: ts.Symbol) =>
    symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  const documentation = (symbol: ts.Symbol) =>
    ts.displayPartsToString(symbol.getDocumentationComment(checker));

  const props = (declaration: ts.FunctionDeclaration): Prop[] => {
    const parameter = checker.getSignatureFromDeclaration(declaration)?.getParameters()[0];
    if (!parameter) return [];
    return checker
      .getTypeOfSymbolAtLocation(parameter, declaration)
      .getProperties()
      .filter((prop) =>
        prop.declarations?.some((node) => node.getSourceFile().fileName.startsWith(source)),
      )
      .map((prop) => {
        const defaultValue = prop.getJsDocTags(checker).find((tag) => tag.name === 'default');
        const type = checker.getTypeOfSymbolAtLocation(prop, declaration);
        return {
          name: prop.getName(),
          // Spell out short unions such as variants; keep long or structural types by name.
          type: describe(checker, checker.getNonNullableType(type)),
          required: !(prop.flags & ts.SymbolFlags.Optional),
          ...(defaultValue ? { defaultValue: ts.displayPartsToString(defaultValue.text) } : {}),
          description: ts.displayPartsToString(prop.getDocumentationComment(checker)),
        };
      })
      .filter((prop) => prop.name !== 'ref');
  };

  const api: Record<string, ComponentApi> = {};
  for (const exported of checker.getExportsOfModule(checker.getSymbolAtLocation(index)!)) {
    const symbol = resolve(exported);
    const declaration = symbol.valueDeclaration;
    if (!declaration) continue;
    if (ts.isFunctionDeclaration(declaration)) {
      api[exported.getName()] = { description: documentation(symbol), props: props(declaration) };
    } else if (
      ts.isVariableDeclaration(declaration) &&
      declaration.initializer &&
      ts.isIdentifier(declaration.initializer)
    ) {
      const named = checker.getSymbolAtLocation(declaration.initializer);
      const target = named && resolve(named).valueDeclaration;
      const own = documentation(symbol);
      api[exported.getName()] =
        target && ts.isFunctionDeclaration(target)
          ? {
              description: own || documentation(resolve(named!)),
              props: props(target),
            }
          : { description: own, props: [] };
    }
  }
  return api;
}

export function api(): Plugin {
  return {
    name: 'carved-api',
    resolveId: (source) => (source === id ? `\0${id}` : null),
    load(module) {
      if (module !== `\0${id}`) return null;
      return `export default ${JSON.stringify(extract())};`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(source)) return;
      const module = server.moduleGraph.getModuleById(`\0${id}`);
      if (module) server.moduleGraph.invalidateModule(module);
    },
  };
}
