'use client';
import { Form as AriaForm } from 'react-aria-components/Form';
import type { FormProps as AriaFormProps } from 'react-aria-components/Form';
import { FieldError as AriaFieldError, FieldErrorContext } from 'react-aria-components/FieldError';
import type {
  FieldErrorProps as AriaFieldErrorProps,
  ValidationResult,
} from 'react-aria-components/FieldError';
import { Label as AriaLabel } from 'react-aria-components/Label';
import type { LabelProps as AriaLabelProps } from 'react-aria-components/Label';
import { Text } from 'react-aria-components/Text';
import type { TextProps } from 'react-aria-components/Text';
import { Input as AriaInput } from 'react-aria-components/Input';
import type { InputProps as AriaInputProps } from 'react-aria-components/Input';
import { TextArea as AriaTextArea } from 'react-aria-components/TextArea';
import type { TextAreaProps as AriaTextAreaProps } from 'react-aria-components/TextArea';
import { Group } from 'react-aria-components/Group';
import type { GroupProps } from 'react-aria-components/Group';
import { TextField as AriaTextField } from 'react-aria-components/TextField';
import type { TextFieldProps as AriaTextFieldProps } from 'react-aria-components/TextField';
import { SearchField as AriaSearchField } from 'react-aria-components/SearchField';
import type { SearchFieldProps as AriaSearchFieldProps } from 'react-aria-components/SearchField';
import { NumberField as AriaNumberField } from 'react-aria-components/NumberField';
import type { NumberFieldProps as AriaNumberFieldProps } from 'react-aria-components/NumberField';
import { useContext } from 'react';
import type { ReactNode, Ref } from 'react';
import { Button } from './actions.js';
import type { ButtonProps } from './actions.js';
import { cx, withClass } from './internal/class-names.js';
import { useHeldDuringPress } from './internal/hold.js';
import { Close, Minus, Plus, Search } from './internal/icons.js';

/** Props shared by every composed field. */
export interface FieldProps {
  /** The visible label. */
  label?: ReactNode;
  /** Help text shown below the field and announced with it. */
  description?: ReactNode;
  /**
   * Shown when the field is invalid. Defaults to the browser's validation message; a function
   * receives the validation state.
   */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
}

export function Form({ className, ...props }: AriaFormProps & { ref?: Ref<HTMLFormElement> }) {
  return <AriaForm {...props} className={cx('carved-form', className)} />;
}

export function Label({ className, ...props }: AriaLabelProps & { ref?: Ref<HTMLLabelElement> }) {
  return <AriaLabel {...props} className={cx('carved-label', className)} />;
}

/** Help text for the enclosing field, linked to it with `aria-describedby`. */
export function Description({ className, ...props }: TextProps) {
  return <Text {...props} slot="description" className={cx('carved-description', className)} />;
}

/**
 * The enclosing field's validation message. It holds still while a pointer is pressed, so a
 * field revalidating on blur never moves the button being clicked.
 */
export function FieldError({ className, ...props }: AriaFieldErrorProps) {
  const validation = useHeldDuringPress(useContext(FieldErrorContext));
  return (
    <FieldErrorContext value={validation}>
      <AriaFieldError {...props} className={withClass('carved-field-error', className)} />
    </FieldErrorContext>
  );
}

/** A carved text well. Use inside a field root, or alone with an `aria-label`. */
export function Input({ className, ...props }: AriaInputProps & { ref?: Ref<HTMLInputElement> }) {
  return <AriaInput {...props} className={withClass('carved-input carved-carve', className)} />;
}

export function TextArea({
  className,
  ...props
}: AriaTextAreaProps & { ref?: Ref<HTMLTextAreaElement> }) {
  return (
    <AriaTextArea
      {...props}
      className={withClass('carved-input carved-textarea carved-carve', className)}
    />
  );
}

/** One carved well holding an input together with buttons or icons. */
export function InputGroup({ className, ...props }: GroupProps & { ref?: Ref<HTMLDivElement> }) {
  return <Group {...props} className={withClass('carved-input-group carved-carve', className)} />;
}

/** A small icon button that lives inside an input group. */
export function FieldButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      {...props}
      className={withClass('carved-field-button', className)}
    />
  );
}

/** A field's help text and validation message, in the order every field shows them. */
export function FieldFooter({ description, errorMessage }: FieldProps) {
  return (
    <>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </>
  );
}

export interface TextFieldRootProps extends AriaTextFieldProps {
  ref?: Ref<HTMLDivElement>;
}

/** The bare text field, for arranging label, input and messages yourself. */
export function TextFieldRoot({ className, ...props }: TextFieldRootProps) {
  return <AriaTextField {...props} className={withClass('carved-field', className)} />;
}

export interface TextFieldProps extends Omit<TextFieldRootProps, 'children'>, FieldProps {
  placeholder?: string;
  /** Render a growing multi-line text area instead of an input. */
  multiline?: boolean;
  /** Visible lines of a multi-line field. @default 4 */
  rows?: number;
}

/** A labelled text input with optional help text and validation. */
export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  multiline = false,
  rows = 4,
  ...props
}: TextFieldProps) {
  return (
    <TextFieldRoot {...props}>
      {label && <Label>{label}</Label>}
      {multiline ? (
        <TextArea placeholder={placeholder} rows={rows} />
      ) : (
        <Input placeholder={placeholder} />
      )}
      <FieldFooter description={description} errorMessage={errorMessage} />
    </TextFieldRoot>
  );
}

export interface SearchFieldProps extends Omit<AriaSearchFieldProps, 'children'>, FieldProps {
  placeholder?: string;
  ref?: Ref<HTMLDivElement>;
}

/** A text field for queries, with a search icon and a button to clear it. */
export function SearchField({
  label,
  description,
  errorMessage,
  placeholder,
  className,
  ...props
}: SearchFieldProps) {
  return (
    <AriaSearchField {...props} className={withClass('carved-field carved-search', className)}>
      {label && <Label>{label}</Label>}
      <InputGroup>
        <Search className="carved-search-icon" />
        <AriaInput placeholder={placeholder} className="carved-group-input" />
        <FieldButton className="carved-search-clear">
          <Close />
        </FieldButton>
      </InputGroup>
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaSearchField>
  );
}

export interface NumberFieldProps extends Omit<AriaNumberFieldProps, 'children'>, FieldProps {
  placeholder?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A field for numbers, formatted for the locale. Arrow keys, the wheel and the step buttons
 * change the value by `step`; `formatOptions` show it as a percentage, currency or unit.
 */
export function NumberField({
  label,
  description,
  errorMessage,
  placeholder,
  className,
  ...props
}: NumberFieldProps) {
  return (
    <AriaNumberField {...props} className={withClass('carved-field carved-number', className)}>
      {label && <Label>{label}</Label>}
      <InputGroup>
        <AriaInput placeholder={placeholder} className="carved-group-input" />
        <FieldButton slot="decrement">
          <Minus />
        </FieldButton>
        <FieldButton slot="increment">
          <Plus />
        </FieldButton>
      </InputGroup>
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaNumberField>
  );
}
