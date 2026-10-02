import { useEffect, useRef } from 'react';
import { presetNames } from '@plurid/carved-ui-core';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CarvedProvider,
  Heading,
  Link,
  ProgressBar,
  Select,
  SelectItem,
  Surface,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
} from '@plurid/carved-ui-react';
import { Command } from '../components/code-block';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { titleFor } from '../routes';
import { setSiteTheme, useSiteTheme } from '../theme';

/**
 * The light follows the pointer: every shadow, lip and engraving inside the hero is cast
 * away from it. Without a fine pointer, or with reduced motion, the light stays above.
 */
function useFollowingLight() {
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = scope.current;
    const still = matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    if (!element || still.matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = element.getBoundingClientRect();
        const x = box.left + box.width / 2 - event.clientX;
        const y = box.top + box.height / 3 - event.clientY;
        const length = Math.hypot(x, y) || 1;
        element.style.setProperty('--carved-light-x', (x / length).toFixed(3));
        element.style.setProperty('--carved-light-y', (y / length).toFixed(3));
        // Polished inlays turn their sheen to the same light.
        element.style.setProperty('--carved-light-angle', `${Math.atan2(y, x)}rad`);
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
    };
  }, []);
  return scope;
}

function Hero() {
  const scope = useFollowingLight();
  return (
    <div className="hero" ref={scope}>
      <p className="eyebrow">React components · version 1 preview</p>
      <Heading level={1} variant="engraved" className="hero-title">
        Carved
      </Heading>
      <p className="hero-lede">
        Accessible React components cut into one material and lit by one light. Six levels of depth,
        seven themes, and a theme engine that keeps every colour readable.
      </p>
      <div className="hero-actions">
        <Link href="/start" variant="primary" size="lg">
          Get started
        </Link>
        <Link href="/themes" variant="secondary" size="lg">
          Make a theme
        </Link>
      </div>
      <Command>pnpm add @plurid/carved-ui-react@next</Command>
      <p className="hero-hint" aria-hidden="true">
        Move the pointer. The light follows.
      </p>
    </div>
  );
}

function Board() {
  return (
    <div className="board" aria-label="A sample interface" role="group">
      <Card>
        <CardHeader>
          <CardTitle>New project</CardTitle>
          <CardDescription>Everything here can be changed later.</CardDescription>
        </CardHeader>
        <CardContent>
          <TextField label="Name" defaultValue="Quarry" />
          <Select label="Region" defaultValue="fra">
            <SelectItem id="fra">Frankfurt</SelectItem>
            <SelectItem id="iad">Virginia</SelectItem>
            <SelectItem id="gru">São Paulo</SelectItem>
          </Select>
          <Switch defaultSelected>Deploy on every push</Switch>
          <div className="row">
            <Button>Create project</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Six levels, one material</CardTitle>
          <CardDescription>Each surface is cut one level deeper than its parent.</CardDescription>
        </CardHeader>
        <Surface className="board-depth">
          2
          <Surface className="board-depth">
            3
            <Surface className="board-depth">
              4<Surface className="board-depth">5</Surface>
            </Surface>
          </Surface>
        </Surface>
      </Card>
      <Card>
        <Tabs>
          <TabList aria-label="Quarry">
            <Tab id="usage">Usage</Tab>
            <Tab id="deploys">Deploys</Tab>
          </TabList>
          <TabPanel id="usage" className="board-panel">
            <ProgressBar label="Storage" value={72} />
            <ProgressBar label="Build minutes" value={38} />
          </TabPanel>
          <TabPanel id="deploys" className="board-panel">
            <p className="row">
              <Badge tone="success">Live</Badge> a41f · 48 seconds
            </p>
            <p className="row">
              <Badge tone="danger">Failed</Badge> 77e1 · exit code 1
            </p>
          </TabPanel>
        </Tabs>
      </Card>
    </div>
  );
}

const rules = [
  ['Depth is shade', 'Every surface is a recess, one level darker than the one around it.'],
  ['Touch cuts deeper', 'Hover deepens a control’s cut; pressing deepens it again.'],
  ['Meaning is inlaid', 'Accent, success, warning and danger fill the cut instead of glowing.'],
  ['One light', 'One angle places every shadow, lip and engraving, so they always agree.'],
] as const;

function Materials() {
  const current = useSiteTheme();
  return (
    <div className="materials">
      {presetNames.map((name) => (
        <CarvedProvider key={name} theme={name} className="material">
          <p className="material-name">{name}</p>
          <div className="row">
            <Badge tone="accent">accent</Badge>
            <Badge tone="success">success</Badge>
          </div>
          {/* Choosing the theme in use does nothing; the button stays, so focus is not lost. */}
          <Button
            size="sm"
            variant={current === name ? 'primary' : 'secondary'}
            onPress={() => setSiteTheme(name)}
          >
            {current === name ? 'In use' : `Use ${name}`}
          </Button>
        </CarvedProvider>
      ))}
    </div>
  );
}

export function Landing() {
  useEffect(() => {
    document.title = titleFor('/');
  }, []);
  return (
    <div className="landing">
      <Header />
      <main id="main">
        <Hero />
        <Board />
        <section className="landing-section" aria-labelledby="rules">
          <Heading level={2} id="rules">
            The material
          </Heading>
          <div className="rules">
            {rules.map(([title, text]) => (
              <Surface key={title} className="rule">
                <Heading level={3}>{title}</Heading>
                <p>{text}</p>
              </Surface>
            ))}
          </div>
          <Link href="/material">Read how the material works</Link>
        </section>
        <section className="landing-section" aria-labelledby="themes">
          <Heading level={2} id="themes">
            Seven materials, or your own
          </Heading>
          <p className="section-lede">
            Each preset is generated from one colour and an accent chosen for it. Give{' '}
            <code>createTheme</code> any colour and it builds the same six depths, with text and
            inlays that stay readable on every one.
          </p>
          <Materials />
        </section>
        <section className="landing-section" aria-labelledby="start">
          <Heading level={2} id="start">
            Start in three steps
          </Heading>
          <ol className="steps">
            <li className="step">
              <span>Install the package.</span>
              <Command>pnpm add @plurid/carved-ui-react@next</Command>
            </li>
            <li className="step">
              <span>Import the stylesheet once.</span>
              <Command>import '@plurid/carved-ui-react/styles.css';</Command>
            </li>
            <li className="step">
              <span>Wrap your app in a provider and pick a theme.</span>
              <Command>{'<CarvedProvider theme="ponton">…</CarvedProvider>'}</Command>
            </li>
          </ol>
          <Link href="/start" variant="primary">
            Read the guide
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
