import * as React from 'react';
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  /** Mixed state for "select all" headers. */
  indeterminate?: boolean;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
