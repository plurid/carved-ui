'use client';
import { ColorArea as AriaColorArea } from 'react-aria-components/ColorArea';
import type { ColorAreaProps as AriaColorAreaProps } from 'react-aria-components/ColorArea';
import { ColorField as AriaColorField } from 'react-aria-components/ColorField';
import type { ColorFieldProps as AriaColorFieldProps } from 'react-aria-components/ColorField';
import { ColorPicker as AriaColorPicker } from 'react-aria-components/ColorPicker';
import type {
  Color,
  ColorPickerProps as AriaColorPickerProps,
} from 'react-aria-components/ColorPicker';
import {
  ColorSlider as AriaColorSlider,
  SliderOutput,
  SliderTrack,
} from 'react-aria-components/ColorSlider';
import type { ColorSliderProps as AriaColorSliderProps } from 'react-aria-components/ColorSlider';
import { ColorSwatch as AriaColorSwatch } from 'react-aria-components/ColorSwatch';
import type { ColorSwatchProps as AriaColorSwatchProps } from 'react-aria-components/ColorSwatch';
import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
} from 'react-aria-components/ColorSwatchPicker';
import type {
  ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
  ColorSwatchPickerProps as AriaColorSwatchPickerProps,
} from 'react-aria-components/ColorSwatchPicker';
import { ColorThumb as AriaColorThumb } from 'react-aria-components/ColorThumb';
import { ColorWheel as AriaColorWheel, ColorWheelTrack } from 'react-aria-components/ColorWheel';
import type { ColorWheelProps as AriaColorWheelProps } from 'react-aria-components/ColorWheel';
import { DialogTrigger } from 'react-aria-components/Dialog';
import type { ReactNode, Ref } from 'react';
import { Button } from './actions.js';
import { FieldFooter, Input, Label } from './fields.js';
import type { FieldProps } from './fields.js';
import { Dialog, Popover } from './overlays.js';
import { withClass } from './internal/class-names.js';

export { parseColor } from 'react-aria-components/ColorPicker';
export type { Color };

/** The raised ring that marks the chosen colour on an area, slider or wheel. */
function ColorThumb() {
  return <AriaColorThumb className="carved-color-thumb carved-raise" />;
}

export interface ColorAreaProps extends Omit<AriaColorAreaProps, 'children'> {
  ref?: Ref<HTMLDivElement>;
}

/** Two channels at once, such as saturation and brightness, on a carved square. */
export function ColorArea({ className, ...props }: ColorAreaProps) {
  return (
    <AriaColorArea {...props} className={withClass('carved-color-area carved-carve', className)}>
      <ColorThumb />
    </AriaColorArea>
  );
}

export interface ColorSliderProps extends Omit<AriaColorSliderProps, 'children'> {
  /** The visible label. Defaults to the channel's name, such as "Hue". */
  label?: ReactNode;
  /** Show the channel's value beside the label. @default true */
  showOutput?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/** One channel of a colour, along a carved track of its gradient. */
export function ColorSlider({ label, showOutput = true, className, ...props }: ColorSliderProps) {
  return (
    <AriaColorSlider
      {...props}
      className={withClass('carved-slider carved-color-slider', className)}
    >
      <Label>{label}</Label>
      {showOutput && <SliderOutput className="carved-slider-output" />}
      <SliderTrack className="carved-color-track carved-carve">
        <ColorThumb />
      </SliderTrack>
    </AriaColorSlider>
  );
}

export interface ColorWheelProps extends Omit<
  AriaColorWheelProps,
  'children' | 'outerRadius' | 'innerRadius'
> {
  /** The wheel's outer radius in pixels. @default 96 */
  outerRadius?: number;
  /** The radius of the hole in the middle, in pixels. @default 68 */
  innerRadius?: number;
  ref?: Ref<HTMLDivElement>;
}

/** Hue around a carved ring. */
export function ColorWheel({
  outerRadius = 96,
  innerRadius = 68,
  className,
  ...props
}: ColorWheelProps) {
  return (
    <AriaColorWheel
      {...props}
      outerRadius={outerRadius}
      innerRadius={innerRadius}
      className={withClass('carved-color-wheel', className)}
    >
      <ColorWheelTrack className="carved-color-wheel-track" />
      <ColorThumb />
    </AriaColorWheel>
  );
}

export interface ColorFieldProps extends Omit<AriaColorFieldProps, 'children'>, FieldProps {
  /** Shown in the empty field. It is not a label: give the field a `label` too. */
  placeholder?: string;
  ref?: Ref<HTMLDivElement>;
}

/** A colour typed as hex, or one channel of it typed as a number when `channel` is set. */
export function ColorField({
  label,
  description,
  errorMessage,
  placeholder,
  className,
  ...props
}: ColorFieldProps) {
  return (
    <AriaColorField {...props} className={withClass('carved-field', className)}>
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaColorField>
  );
}

export interface ColorSwatchProps extends AriaColorSwatchProps {
  /** The swatch's size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  ref?: Ref<HTMLDivElement>;
}

/** A colour set into a small carved socket, named for assistive technology. */
export function ColorSwatch({ size = 'md', className, ...props }: ColorSwatchProps) {
  return (
    <AriaColorSwatch
      {...props}
      data-size={size}
      className={withClass('carved-color-swatch carved-carve', className)}
    />
  );
}

export interface ColorSwatchPickerProps extends AriaColorSwatchPickerProps {
  ref?: Ref<HTMLDivElement>;
}

/** A row of swatches to choose from. Arrow keys move between them. */
export function ColorSwatchPicker({ className, ...props }: ColorSwatchPickerProps) {
  return (
    <AriaColorSwatchPicker {...props} className={withClass('carved-swatch-picker', className)} />
  );
}

export interface ColorSwatchPickerItemProps extends Omit<
  AriaColorSwatchPickerItemProps,
  'children'
> {
  ref?: Ref<HTMLDivElement>;
}

/** One swatch of a `ColorSwatchPicker`. The chosen one is ringed in the accent. */
export function ColorSwatchPickerItem({ className, ...props }: ColorSwatchPickerItemProps) {
  return (
    <AriaColorSwatchPickerItem {...props} className={withClass('carved-swatch-item', className)}>
      <ColorSwatch />
    </AriaColorSwatchPickerItem>
  );
}

export interface ColorPickerProps extends Omit<AriaColorPickerProps, 'children'> {
  /** Shown beside the swatch on the button. Without it, the button is named by its colour. */
  label?: ReactNode;
  /** Colours offered as swatches below the editor. */
  swatches?: string[];
  /** Names the button when it shows only the swatch, such as "Pick a colour". */
  'aria-label'?: string;
}

/**
 * A swatch button that opens an editor: saturation and brightness on an area, hue on a
 * slider, the hex value in a field and, optionally, preset swatches.
 */
export function ColorPicker({
  label,
  swatches,
  'aria-label': ariaLabel,
  ...props
}: ColorPickerProps) {
  return (
    <AriaColorPicker {...props}>
      <DialogTrigger>
        <Button variant="secondary" aria-label={ariaLabel} className="carved-color-trigger">
          <ColorSwatch size="sm" />
          {label && <span>{label}</span>}
        </Button>
        <Popover placement="bottom start" className="carved-color-popover">
          <Dialog
            aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Colour')}
            className="carved-color-editor"
          >
            <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
            <ColorSlider colorSpace="hsb" channel="hue" />
            <ColorField label="Hex" />
            {swatches && (
              <ColorSwatchPicker>
                {swatches.map((color) => (
                  <ColorSwatchPickerItem key={color} color={color} />
                ))}
              </ColorSwatchPicker>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
    </AriaColorPicker>
  );
}
