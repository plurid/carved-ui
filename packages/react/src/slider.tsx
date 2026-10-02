'use client';
import {
  Slider as AriaSlider,
  SliderFill as AriaSliderFill,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
} from 'react-aria-components/Slider';
import type {
  SliderFillProps,
  SliderOutputProps,
  SliderProps as AriaSliderProps,
  SliderThumbProps,
  SliderTrackProps,
} from 'react-aria-components/Slider';
import type { ReactNode, Ref } from 'react';
import { Label } from './fields.js';
import { withClass } from './internal/class-names.js';

export interface SliderRootProps<T extends number | number[]> extends AriaSliderProps<T> {
  ref?: Ref<HTMLDivElement>;
}

/** The bare slider, for arranging label, output, track and thumbs yourself. */
export function SliderRoot<T extends number | number[]>({
  className,
  ...props
}: SliderRootProps<T>) {
  return <AriaSlider {...props} className={withClass('carved-slider', className)} />;
}

/** The rail the thumbs' centres travel along, inside the carved slot it draws. */
export function SliderTrack({ className, ...props }: SliderTrackProps) {
  return (
    <AriaSliderTrack
      {...props}
      className={withClass('carved-slider-track carved-carve', className)}
    />
  );
}

/** The inlaid fill, from the start (or the first thumb) to a thumb, wrapping each thumb. */
export function SliderFill({ className, ...props }: SliderFillProps) {
  return <AriaSliderFill {...props} className={withClass('carved-slider-fill', className)} />;
}

/** A raised knob, sitting in the fill. */
export function SliderThumb({ className, ...props }: SliderThumbProps) {
  return (
    <AriaSliderThumb
      {...props}
      className={withClass('carved-slider-thumb carved-raise', className)}
    />
  );
}

export function SliderOutput({ className, ...props }: SliderOutputProps) {
  return <AriaSliderOutput {...props} className={withClass('carved-slider-output', className)} />;
}

export interface SliderProps<T extends number | number[]> extends Omit<
  SliderRootProps<T>,
  'children'
> {
  /** The visible label. */
  label?: ReactNode;
  /** Show the formatted value beside the label. @default true */
  showOutput?: boolean;
  /** Accessible names for each thumb of a range slider, such as `['Minimum', 'Maximum']`. */
  thumbLabels?: string[];
}

/** A labelled slider. Pass an array value for a range with one thumb per value. */
export function Slider<T extends number | number[]>({
  label,
  showOutput = true,
  thumbLabels,
  ...props
}: SliderProps<T>) {
  return (
    <SliderRoot {...props}>
      {label && <Label>{label}</Label>}
      {showOutput && <SliderOutput />}
      <SliderTrack>
        {({ state }) => (
          <>
            <SliderFill />
            {state.values.map((_, index) => (
              <SliderThumb key={index} index={index} aria-label={thumbLabels?.[index]} />
            ))}
          </>
        )}
      </SliderTrack>
    </SliderRoot>
  );
}
