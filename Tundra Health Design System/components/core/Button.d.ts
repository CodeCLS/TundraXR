import * as React from 'react';
/**
 * Tundra's action control.
 * @startingPoint section="Core" subtitle="Buttons, icon buttons, badges and tags" viewport="700x220"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered before the label. */
  iconLeft?: string;
  /** Lucide icon name rendered after the label. */
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}
export declare function Button(props: ButtonProps): JSX.Element;
