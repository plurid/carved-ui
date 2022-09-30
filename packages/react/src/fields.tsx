'use client';
import { Form as AriaForm } from 'react-aria-components/Form';
import {
  TextField as AriaTextField,
  Input as AriaInput,
  TextArea as AriaTextArea,
  Label as AriaLabel,
  FieldError as AriaFieldError,
  Text,
} from 'react-aria-components/TextField';
import { Checkbox as AriaCheckbox } from 'react-aria-components/Checkbox';
import { RadioGroup as AriaRadioGroup, Radio as AriaRadio } from 'react-aria-components/RadioGroup';
import { Switch as AriaSwitch } from 'react-aria-components/Switch';
import {
  Slider as AriaSlider,
  SliderTrack as AriaSliderTrack,
  SliderThumb as AriaSliderThumb,
  SliderOutput as AriaSliderOutput,
} from 'react-aria-components/Slider';
import type { ComponentProps } from 'react';
import { cx } from './internal/utils.js';
import { Check } from './internal/icons.js';

export function Form({ className, ...props }: ComponentProps<typeof AriaForm>) {
  return <AriaForm {...props} className={cx('carved-form', className)} />;
}
export function TextField({ className, ...props }: ComponentProps<typeof AriaTextField>) {
  return (
    <AriaTextField
      {...props}
      className={(state) =>
        cx('carved-field', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function Input({ className, ...props }: ComponentProps<typeof AriaInput>) {
  return (
    <AriaInput
      {...props}
      className={(state) =>
        cx('carved-input', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function Textarea({ className, ...props }: ComponentProps<typeof AriaTextArea>) {
  return (
    <AriaTextArea
      {...props}
      className={(state) =>
        cx(
          'carved-input',
          'carved-textarea',
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
}
export function Label({ className, ...props }: ComponentProps<typeof AriaLabel>) {
  return <AriaLabel {...props} className={cx('carved-label', className)} />;
}
export function FieldDescription({ className, ...props }: ComponentProps<typeof Text>) {
  return <Text {...props} slot="description" className={cx('carved-description', className)} />;
}
export function FieldError({ className, ...props }: ComponentProps<typeof AriaFieldError>) {
  return (
    <AriaFieldError
      {...props}
      className={(state) =>
        cx('carved-field-error', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function Checkbox({ children, className, ...props }: ComponentProps<typeof AriaCheckbox>) {
  return (
    <AriaCheckbox
      {...props}
      className={(state) =>
        cx('carved-checkbox', typeof className === 'function' ? className(state) : className)
      }
    >
      {(state) => (
        <>
          <span className="carved-checkbox-box">
            <Check />
          </span>
          {typeof children === 'function' ? children(state) : children}
        </>
      )}
    </AriaCheckbox>
  );
}
export function RadioGroup({ className, ...props }: ComponentProps<typeof AriaRadioGroup>) {
  return (
    <AriaRadioGroup
      {...props}
      className={(state) =>
        cx('carved-radio-group', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function Radio({ children, className, ...props }: ComponentProps<typeof AriaRadio>) {
  return (
    <AriaRadio
      {...props}
      className={(state) =>
        cx('carved-radio', typeof className === 'function' ? className(state) : className)
      }
    >
      {(state) => (
        <>
          <span className="carved-radio-dot" />
          {typeof children === 'function' ? children(state) : children}
        </>
      )}
    </AriaRadio>
  );
}
export function Switch({ children, className, ...props }: ComponentProps<typeof AriaSwitch>) {
  return (
    <AriaSwitch
      {...props}
      className={(state) =>
        cx('carved-switch', typeof className === 'function' ? className(state) : className)
      }
    >
      {(state) => (
        <>
          <span className="carved-switch-track">
            <span />
          </span>
          {typeof children === 'function' ? children(state) : children}
        </>
      )}
    </AriaSwitch>
  );
}
export function Slider({ className, ...props }: ComponentProps<typeof AriaSlider>) {
  return (
    <AriaSlider
      {...props}
      className={(state) =>
        cx('carved-slider', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function SliderTrack({ className, ...props }: ComponentProps<typeof AriaSliderTrack>) {
  return (
    <AriaSliderTrack
      {...props}
      className={(state) =>
        cx('carved-slider-track', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function SliderThumb({ className, ...props }: ComponentProps<typeof AriaSliderThumb>) {
  return (
    <AriaSliderThumb
      {...props}
      className={(state) =>
        cx('carved-slider-thumb', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
export function SliderOutput({ className, ...props }: ComponentProps<typeof AriaSliderOutput>) {
  return (
    <AriaSliderOutput
      {...props}
      className={(state) =>
        cx('carved-slider-output', typeof className === 'function' ? className(state) : className)
      }
    />
  );
}
