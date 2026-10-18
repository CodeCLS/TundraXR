import * as React from 'react';
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned footer actions. */
  footer?: React.ReactNode;
  onClose?: () => void;
  /** Pixel width of the panel. Default 480. */
  width?: number;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
