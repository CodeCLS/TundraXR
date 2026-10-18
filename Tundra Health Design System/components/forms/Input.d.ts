import * as React from 'react';
/**
 * Single-line text field.
 * @startingPoint section="Forms" subtitle="Inputs, selects, toggles and choices" viewport="700x300"
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  /** Helper text under the field. */
  hint?: React.ReactNode;
  /** Error message — replaces hint and turns the field rust. */
  error?: React.ReactNode;
  /** Lucide icon name rendered inside the field, left of the value. */
  iconLeft?: string;
  /** Trailing unit or affordance text, e.g. "hrs". */
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Render the value in Geist Mono — for serials, asset tags, model numbers. */
  mono?: boolean;
}
export declare function Input(props: InputProps): JSX.Element;
