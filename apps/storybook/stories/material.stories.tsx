import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { presetNames } from '@plurid/carved-ui-core';
import {
  Badge,
  Button,
  CarvedProvider,
  Heading,
  Separator,
  Slider,
  Surface,
  Switch,
  TextField,
} from '@plurid/carved-ui-react';

const meta = {
  title: 'Material/Principles',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/** Each nested surface is cut one level deeper. Levels stop at five. */
export const Depth: Story = {
  render: () => (
    <Surface className="lab-pad" style={{ maxInlineSize: '40rem' }}>
      <p className="lab-caption">Depth 1</p>
      <Surface className="lab-pad">
        <p className="lab-caption">Depth 2</p>
        <Surface className="lab-pad">
          <p className="lab-caption">Depth 3</p>
          <Surface className="lab-pad">
            <p className="lab-caption">Depth 4</p>
            <Surface className="lab-pad">
              <p className="lab-caption">Depth 5</p>
            </Surface>
          </Surface>
        </Surface>
      </Surface>
    </Surface>
  ),
};

/**
 * Touch cuts deeper: hover doubles the shadow and press doubles it again. The material
 * classes are public, so application elements can be carved the same way.
 */
export const TouchCutsDeeper: Story = {
  render: () => (
    <div className="lab-row">
      {[
        ['Rest', 1],
        ['Hover', 2],
        ['Press', 4],
      ].map(([label, k]) => (
        <div
          key={label}
          className="carved-carve lab-plate"
          style={{ '--carved-carve-k': k } as CSSProperties}
        >
          {label}
        </div>
      ))}
      <Button variant="secondary">Try me</Button>
      <Button>Inlaid</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [rest, hover, press] = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('.lab-plate'),
    );
    const offset = (element: HTMLElement) =>
      Number(getComputedStyle(element).boxShadow.match(/(-?[\d.]+)px (-?[\d.]+)px/)?.[2]);
    await expect(offset(hover!)).toBeGreaterThan(offset(rest!));
    await expect(offset(press!)).toBeGreaterThan(offset(hover!));
  },
};

/** Meaning is inlaid: tones fill the cut. */
export const Inlays: Story = {
  render: () => (
    <div className="lab-row">
      {(['neutral', 'accent', 'success', 'warning', 'danger'] as const).map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};

/** Only loose pieces rise: switch knobs and slider thumbs. */
export const LoosePieces: Story = {
  render: () => (
    <div className="lab-stack lab-narrow">
      <Switch defaultSelected>Raised knob, carved track</Switch>
      <Slider label="Raised thumb" defaultValue={60} />
    </div>
  ),
};

/** Engraved type: uppercase letters cut into the surface, in full-contrast ink. */
export const Engraving: Story = {
  render: () => (
    <div className="lab-stack">
      <Heading level={1} variant="engraved">
        Carved
      </Heading>
      <Separator variant="trench" />
      <Heading level={2} variant="display">
        Depth, without weight.
      </Heading>
    </div>
  ),
};

/** The seven presets side by side. Every guarantee holds in each. */
export const Presets: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="lab-grid" style={{ gap: 0 }}>
      {presetNames.map((name) => (
        <CarvedProvider key={name} theme={name} className="lab-swatch">
          <p className="lab-caption">{name}</p>
          <Surface className="lab-pad">
            <TextField label="Project" defaultValue="Quarry" />
          </Surface>
          <div className="lab-row">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="secondary">
              Cancel
            </Button>
            <Badge tone="success">Live</Badge>
          </div>
        </CarvedProvider>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fields = within(canvasElement).getAllByRole('textbox', { name: 'Project' });
    await expect(fields).toHaveLength(presetNames.length);
    await userEvent.click(fields[0]!);
    await expect(fields[0]).toHaveFocus();
  },
};
