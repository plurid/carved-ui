import { useId } from 'react';
import type { Example } from '../catalog';
import { CodeBlock } from './code-block';

/** One example: the live component on its own stage, and the code that makes it. */
export function Specimen({ title, description, module }: Example) {
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
