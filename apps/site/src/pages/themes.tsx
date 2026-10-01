import { useMemo, useState } from 'react';
import { createTheme, presetNames, presets, themeToCss, tones } from '@plurid/carved-ui-core';
import type { Theme, ThemeOptions, ThemePreset } from '@plurid/carved-ui-core';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CarvedProvider,
  Checkbox,
  Disclosure,
  Heading,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider,
  Surface,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextField,
} from '@plurid/carved-ui-react';
import { CodeBlock } from '../components/code-block';

type Tones = 'preset' | 'standard' | 'themed';

function toHex(color: string): string {
  return createTheme({ color, depthDifference: 0 }).variables['--carved-surface-0']!;
}

function Preview({ theme }: { theme: Theme }) {
  return (
    <CarvedProvider theme={theme} className="lab-preview">
      <Card>
        <CardHeader>
          <CardTitle>
            Quarry <Badge tone="success">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TextField
            label="Project name"
            defaultValue="Quarry"
            description="Shown to the whole team."
          />
          <Switch defaultSelected>Deploy on every push</Switch>
          <Checkbox>Email me when a deploy fails</Checkbox>
          <div className="row">
            <Button>Save</Button>
            <Button variant="secondary">Preview</Button>
            <Button variant="danger">Delete</Button>
          </div>
        </CardContent>
      </Card>
      <Surface className="pad">
        2
        <Surface className="pad">
          3
          <Surface className="pad">
            4<Surface className="pad">5</Surface>
          </Surface>
        </Surface>
      </Surface>
      <div className="stack">
        <Alert tone="warning" title="Storage at 80%">
          At this rate it fills in about nine days.
        </Alert>
        <div className="row">
          {tones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      </div>
    </CarvedProvider>
  );
}

function Report({ theme }: { theme: Theme }) {
  const { report } = theme;
  return (
    <div className="stack">
      <p>
        A <strong>{report.polarity}</strong> material, {report.step.toFixed(3)} lighter or darker
        per level in OKLCH.
        {report.shift !== 0 && ` Surface 0 moved ${report.shift.toFixed(3)} to fit six levels.`}
      </p>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Tone</TableHeader>
            <TableHeader>Fill on every depth</TableHeader>
            <TableHeader>Text on the fill</TableHeader>
            <TableHeader>Ink on every depth</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {tones.map((tone) => {
            const contrast = report.contrast[tone];
            return (
              <TableRow key={tone}>
                <TableHeader scope="row">
                  <span
                    className="tone-chip"
                    style={{ background: theme.variables[`--carved-${tone}`] }}
                    aria-hidden="true"
                  />
                  {tone}
                </TableHeader>
                <TableCell>{contrast.fill.toFixed(2)}:1</TableCell>
                <TableCell>{contrast.on.toFixed(2)}:1</TableCell>
                <TableCell>{contrast.ink.toFixed(2)}:1</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {report.warnings.map((warning) => (
        <p key={warning} className="muted">
          {warning}
        </p>
      ))}
    </div>
  );
}

export function ThemeLab() {
  const [color, setColor] = useState('#394d60');
  const [depthDifference, setDepth] = useState(0.06);
  const [shadowAngle, setAngle] = useState(90);
  const [shadowDistance, setDistance] = useState(5);
  const [preset, setPreset] = useState<ThemePreset>('ponton');
  const [tonesMode, setTones] = useState<Tones>('preset');

  // Keep the last valid colour while the field holds something unfinished.
  const [valid, error] = useMemo((): [string | null, string | null] => {
    try {
      return [toHex(color), null];
    } catch {
      return [
        null,
        'Use a CSS colour without transparency, such as #284c42 or oklch(45% .08 160).',
      ];
    }
  }, [color]);
  const [lastValid, setLastValid] = useState('#394d60');
  if (valid && valid !== lastValid) setLastValid(valid);

  const options: ThemeOptions = {
    color: valid ?? lastValid,
    depthDifference,
    shadowAngle,
    shadowDistance,
    tones: tonesMode === 'preset' ? (presets[preset].tones ?? 'standard') : tonesMode,
  };
  // Generating a theme takes a couple of milliseconds, so it simply runs on every change.
  const theme = createTheme(options);
  const call = `createTheme(${JSON.stringify(options, null, 2)
    .replace(/"(\w+)":/g, '$1:')
    .replace(/"/g, "'")})`;
  const css = themeToCss(theme, '.my-theme');

  const start = (name: ThemePreset) => {
    setPreset(name);
    setColor(toHex(presets[name].color));
    setTones('preset');
  };

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">Guide</p>
        <Heading level={1}>Themes</Heading>
        <p className="page-lede">
          Every theme comes from one colour. Pick yours and Carved builds six depths, text for each,
          and four inlays, then checks that all of it stays readable.
        </p>
      </header>
      <div className="lab">
        <Surface as="section" aria-label="Theme settings" className="lab-controls">
          <Select
            label="Start from a preset"
            value={preset}
            onChange={(key) => key && start(key as ThemePreset)}
          >
            {presetNames.map((name) => (
              <SelectItem key={name} id={name}>
                {name}
              </SelectItem>
            ))}
          </Select>
          <div className="color-field">
            <TextField
              label="Colour"
              value={color}
              onChange={setColor}
              isInvalid={!!error}
              errorMessage={error}
              description="Any CSS colour: hex, rgb, hsl, oklch or a name."
            />
            <input
              type="color"
              aria-label="Pick a colour"
              className="color-well carved-carve"
              value={valid ?? lastValid}
              onChange={(event) => setColor(event.target.value)}
            />
          </div>
          <Slider
            label="Depth difference"
            value={depthDifference}
            onChange={setDepth}
            maxValue={0.12}
            step={0.005}
            formatOptions={{ maximumFractionDigits: 3 }}
          />
          <Slider
            label="Light angle"
            value={shadowAngle}
            onChange={setAngle}
            maxValue={360}
            formatOptions={{ style: 'unit', unit: 'degree' }}
          />
          <Slider
            label="Shadow distance in pixels"
            value={shadowDistance}
            onChange={setDistance}
            maxValue={24}
          />
          <RadioGroup
            label="Inlays"
            value={tonesMode}
            onChange={(value) => setTones(value as Tones)}
          >
            <Radio value="preset" description={`The accent chosen for ${preset}.`}>
              From {preset}
            </Radio>
            <Radio
              value="standard"
              description="Blue, green, amber and red, whatever the material."
            >
              Standard
            </Radio>
            <Radio
              value="themed"
              description="Hues turned from the material’s own, as the original themes did."
            >
              Themed
            </Radio>
          </RadioGroup>
        </Surface>
        <Preview theme={theme} />
      </div>
      <section className="lab-output" aria-labelledby="report">
        <Heading level={2} id="report">
          Contrast
        </Heading>
        <Report theme={theme} />
      </section>
      <section className="lab-output" aria-labelledby="use">
        <Heading level={2} id="use">
          Use it
        </Heading>
        <p>Generate the theme at runtime and pass it to a provider:</p>
        <CodeBlock source={call} />
        <Disclosure title="Or ship it as CSS">
          <p>
            <code>themeToCss</code> writes the same theme as one rule. Put it in your stylesheet and
            add <code>data-carved-theme</code> and the class to the element it should theme.
          </p>
          <CodeBlock source={css} />
        </Disclosure>
      </section>
    </div>
  );
}
