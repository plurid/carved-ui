import { useId } from 'react';
import type { ComponentType } from 'react';
import { Surface } from '@plurid/carved-ui-react';
import { CodeBlock } from './code-block';

/** A module imported with `?example`: a demo and its source. */
export interface ExampleModule {
  default: ComponentType;
  code: string;
  source: string;
}

interface SpecimenProps {
  title: string;
  description?: string;
  module: ExampleModule;
}

/**
 * One example in one carved frame: the live component on its stage, and the code that makes
 * it in a well cut into the same frame. Long code folds until it is asked for.
 */
export function Specimen({ title, description, module }: SpecimenProps) {
  const id = useId();
  const { default: Demo, code, source } = module;
  return (
    <section className="specimen" aria-labelledby={id}>
      <header className="specimen-header">
        <h2 id={id}>{title}</h2>
        {description && <p>{description}</p>}
      </header>
      <Surface className="specimen-frame">
        <div className="specimen-stage">
          <Demo />
        </div>
        <CodeBlock html={code} source={source} foldAfter={16} />
      </Surface>
    </section>
  );
}
