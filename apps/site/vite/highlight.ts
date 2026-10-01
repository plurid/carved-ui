import { createCssVariablesTheme, createHighlighter } from 'shiki';

/** Code is coloured by CSS variables, which the site maps to the theme's inks. */
export const carvedTheme = createCssVariablesTheme({
  name: 'carved',
  variablePrefix: '--shiki-',
  fontStyle: true,
});

let highlighter: ReturnType<typeof createHighlighter> | undefined;

export async function highlight(code: string, lang: 'tsx' | 'css' | 'sh' = 'tsx'): Promise<string> {
  highlighter ??= createHighlighter({ themes: [carvedTheme], langs: ['tsx', 'css', 'sh'] });
  return (await highlighter).codeToHtml(code.trim(), { lang, theme: 'carved' });
}
