import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createTheme, presets } from '@plurid/carved-ui-core';
import {
  Badge,
  Button,
  CarvedProvider,
  Heading,
  Select,
  SelectItem,
  Separator,
  Slider,
  Surface,
  Switch,
} from '@plurid/carved-ui-react';
import { useSiteTheme } from '../theme';

function Principle({
  title,
  children,
  demo,
}: {
  title: string;
  children: ReactNode;
  demo: ReactNode;
}) {
  return (
    <section className="principle" aria-label={title}>
      <div className="principle-text">
        <Heading level={2}>{title}</Heading>
        {children}
      </div>
      <div className="principle-demo">{demo}</div>
    </section>
  );
}

function Light() {
  const theme = useSiteTheme();
  const [angle, setAngle] = useState(90);
  const [distance, setDistance] = useState(5);
  const lit = useMemo(
    () => createTheme({ ...presets[theme], shadowAngle: angle, shadowDistance: distance }),
    [theme, angle, distance],
  );
  return (
    <div className="stack">
      <CarvedProvider theme={lit} className="light-stage">
        <Heading level={2} variant="engraved" className="light-word">
          Lit
        </Heading>
        <Surface className="pad">
          <Button variant="secondary">A carved button</Button>
        </Surface>
      </CarvedProvider>
      <Slider
        label="Light angle"
        value={angle}
        onChange={setAngle}
        maxValue={360}
        formatOptions={{ style: 'unit', unit: 'degree' }}
      />
      <Slider
        label="Shadow distance in pixels"
        value={distance}
        onChange={setDistance}
        maxValue={24}
      />
    </div>
  );
}

const plate = (k: number) => ({ '--carved-carve-k': k }) as CSSProperties;

export function Material() {
  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Guide</p>
        <Heading level={1}>The material</Heading>
        <p className="page-lede">
          Carved has one idea: every surface is cut into a single material, lit by a single light.
          These rules follow from it, and every component keeps them.
        </p>
      </header>

      <Principle
        title="Depth is shade"
        demo={
          <Surface className="pad">
            1
            <Surface className="pad">
              2
              <Surface className="pad">
                3<Surface className="pad">4</Surface>
              </Surface>
            </Surface>
          </Surface>
        }
      >
        <p>
          The page is the slab, depth 0. A <code>Surface</code> is a recess one level deeper and
          darker than its parent, through any number of wrappers, down to depth 5. Text, borders and
          muted text are generated for each depth, so they stay readable at all six.
        </p>
      </Principle>

      <Principle title="One light" demo={<Light />}>
        <p>
          One angle and one distance place every shadow, every lit edge and every engraving. Change
          them and the whole material is relit together. Themes set them with{' '}
          <code>shadowAngle</code> and <code>shadowDistance</code>.
        </p>
      </Principle>

      <Principle
        title="Touch cuts deeper"
        demo={
          <div className="row">
            {[
              ['Rest', 1],
              ['Hover', 2],
              ['Press', 4],
            ].map(([label, k]) => (
              <div key={label} className="carved-carve plate" style={plate(Number(k))}>
                {label}
              </div>
            ))}
          </div>
        }
      >
        <p>
          A control at rest is a shallow cut. Hovering doubles the depth of its shadow and pressing
          doubles it again, so a button gives way under the pointer like a key. Text never fades to
          show it: it keeps full contrast.
        </p>
      </Principle>

      <Principle
        title="Meaning is inlaid"
        demo={
          <div className="stack">
            <div className="row">
              <Badge>neutral</Badge>
              <Badge tone="accent">accent</Badge>
              <Badge tone="success">success</Badge>
              <Badge tone="warning">warning</Badge>
              <Badge tone="danger">danger</Badge>
            </div>
            <div className="row">
              <Button>Inlaid with the accent</Button>
              <Button variant="danger">With danger</Button>
            </div>
          </div>
        }
      >
        <p>
          Colour carries meaning, so it is set into the cut rather than glowing above it, as
          polished mineral: a sheen on the side that faces the light. The accent, success and danger
          fills reach 3:1 against every depth, the text on every fill reaches 4.5:1, and each tone
          has an ink for text and icons that reaches 4.5:1 everywhere.
        </p>
      </Principle>

      <Principle
        title="Only moving pieces rise"
        demo={
          <div className="stack">
            <Switch defaultSelected>A raised knob in a carved track</Switch>
            <Slider label="A raised knob in its fill" defaultValue={60} />
          </div>
        }
      >
        <p>
          Nothing stands above the material except the pieces that move along it: a switch’s knob
          and a slider’s thumb. They cast a short shadow in the direction of the light.
        </p>
      </Principle>

      <Principle
        title="Overlays are cut too"
        demo={
          <Select label="Region" defaultValue="fra" className="narrow">
            <SelectItem id="fra">Frankfurt</SelectItem>
            <SelectItem id="iad">Virginia</SelectItem>
          </Select>
        }
      >
        <p>
          A list, menu or popover opens as a well one level deeper than the surface it came from,
          edged so it reads over whatever it covers. Dialogs are cut into the dimmed page. They
          render inside their provider, so they keep its theme, locale and direction.
        </p>
      </Principle>

      <Principle
        title="Type can be engraved"
        demo={
          <div className="stack">
            <Heading level={2} variant="engraved" className="engraved-sample">
              Basalt
            </Heading>
            <Separator variant="trench" />
          </div>
        }
      >
        <p>
          Display headings can be cut into the surface, as the original Carved headings were. The
          letters keep text contrast; the chisel is drawn by the light. A trench, the original
          divider, separates regions.
        </p>
      </Principle>

      <section className="principle-code" aria-labelledby="yourself">
        <Heading level={2} id="yourself">
          Carving your own elements
        </Heading>
        <p>
          The material is plain CSS, so your own elements can use it. Add a class, and tune it with
          custom properties.
        </p>
        <MaterialClasses />
      </section>
    </div>
  );
}

function MaterialClasses() {
  const rows = [
    ['carved-carve', 'A recess. Tune it with --carved-carve-scale; hover and press deepen it.'],
    ['carved-inlay', 'A fill in the accent, or in the tone named by data-tone.'],
    ['carved-raise', 'A moving piece standing above its track.'],
    ['carved-engrave', 'Letters cut into the surface.'],
    ['carved-trench', 'A wide channel between regions.'],
  ];
  return (
    <dl className="definitions">
      {rows.map(([name, text]) => (
        <div key={name}>
          <dt>
            <code>.{name}</code>
          </dt>
          <dd>{text}</dd>
        </div>
      ))}
    </dl>
  );
}
