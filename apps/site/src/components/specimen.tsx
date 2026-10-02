import { useId } from 'react';
import type { ComponentType } from 'react';
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

/** One example: the live component on its own stage, and the code that makes it. */
export function Specimen({ title, description, module }: SpecimenProps) {
  const id = useId();
  const { default: Demo, code, source } = module;
  return (
    <section className="specimen" aria-labelledby={id}>
      <header className="specimen-header">
        <h3 id={id}>{title}</h3>
        {description && <p>{description}</p>}
      </header>
      <div className="specimen-stage">
        <Demo />
      </div>
      <CodeBlock html={code} source={source} />
    </section>
  );
}
