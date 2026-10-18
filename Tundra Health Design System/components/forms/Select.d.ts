import * as React from 'react';
export interface SelectOption { value: string; label: string }
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Plain strings or {value,label} pairs. */
  options?: Array<string | SelectOption>;
  size?: 'sm' | 'md';
}
export declare function Select(props: SelectProps): JSX.Element;
