import * as React from 'react';
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon name. */
  icon: string;
  /** Accessible label — also used as the tooltip title. */
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary';
  /** Persistent pressed/selected state, e.g. an active filter. */
  active?: boolean;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
