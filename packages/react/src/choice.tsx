'use client';
import { CheckboxButton, CheckboxField } from 'react-aria-components/Checkbox';
import type { CheckboxFieldProps } from 'react-aria-components/Checkbox';
import { CheckboxGroup as AriaCheckboxGroup } from 'react-aria-components/CheckboxGroup';
import type { CheckboxGroupProps as AriaCheckboxGroupProps } from 'react-aria-components/CheckboxGroup';
import {
  RadioGroup as AriaRadioGroup,
  RadioButton,
  RadioField,
} from 'react-aria-components/RadioGroup';
import type {
  RadioGroupProps as AriaRadioGroupProps,
  RadioFieldProps,
} from 'react-aria-components/RadioGroup';
import { SwitchButton, SwitchField } from 'react-aria-components/Switch';
import type { SwitchFieldProps } from 'react-aria-components/Switch';
import type { ReactNode, Ref } from 'react';
import { Description, FieldError, Label } from './fields.js';
import type { FieldProps } from './fields.js';
import { withClass } from './internal/class-names.js';
import { Check, Minus } from './internal/icons.js';

interface ChoiceProps {
  /** The label, shown beside the control. */
  children?: ReactNode;
  /** Help text below the label, announced with the control. */
  description?: ReactNode;
}

export interface CheckboxProps
  extends Omit<CheckboxFieldProps, 'children'>, ChoiceProps, Pick<FieldProps, 'errorMessage'> {
  ref?: Ref<HTMLDivElement>;
}

/** A carved socket that fills with the accent when checked. */
export function Checkbox({
  children,
  description,
  errorMessage,
  className,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxField {...props} className={withClass('carved-choice carved-checkbox', className)}>
      <CheckboxButton className="carved-choice-label">
        {({ isIndeterminate }) => (
          <>
            <span className="carved-checkbox-box carved-carve" aria-hidden="true">
              {isIndeterminate ? <Minus /> : <Check />}
            </span>
            <span className="carved-choice-text">{children}</span>
          </>
        )}
      </CheckboxButton>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </CheckboxField>
  );
}

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, 'children'>, FieldProps {
  /** The `Checkbox`es of the group. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** A labelled set of checkboxes, validated together. */
export function CheckboxGroup({
  label,
  description,
  errorMessage,
  children,
  className,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup {...props} className={withClass('carved-choice-group', className)}>
      {label && <Label>{label}</Label>}
      <div className="carved-choice-list">{children}</div>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  );
}

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children'>, FieldProps {
  /** The `Radio`s of the group. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** A labelled set of mutually exclusive options. */
export function RadioGroup({
  label,
  description,
  errorMessage,
  children,
  className,
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup {...props} className={withClass('carved-choice-group', className)}>
      {label && <Label>{label}</Label>}
      <div className="carved-choice-list">{children}</div>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

export interface RadioProps extends Omit<RadioFieldProps, 'children'>, ChoiceProps {
  ref?: Ref<HTMLDivElement>;
}

/** One option in a `RadioGroup`: a round socket holding an inlaid dot when chosen. */
export function Radio({ children, description, className, ...props }: RadioProps) {
  return (
    <RadioField {...props} className={withClass('carved-choice carved-radio', className)}>
      <RadioButton className="carved-choice-label">
        <span className="carved-radio-socket carved-carve" aria-hidden="true" />
        <span className="carved-choice-text">{children}</span>
      </RadioButton>
      {description && <Description>{description}</Description>}
    </RadioField>
  );
}

export interface SwitchProps
  extends Omit<SwitchFieldProps, 'children'>, ChoiceProps, Pick<FieldProps, 'errorMessage'> {
  ref?: Ref<HTMLDivElement>;
}

/** An on/off control: a raised knob sliding along a carved track. */
export function Switch({ children, description, errorMessage, className, ...props }: SwitchProps) {
  return (
    <SwitchField {...props} className={withClass('carved-choice carved-switch', className)}>
      <SwitchButton className="carved-choice-label">
        <span className="carved-switch-track carved-carve" aria-hidden="true">
          <span className="carved-switch-knob carved-raise" />
        </span>
        <span className="carved-choice-text">{children}</span>
      </SwitchButton>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </SwitchField>
  );
}
