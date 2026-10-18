import * as React from 'react';
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'info' | 'ok' | 'warn' | 'down';
  /** Optional inline action, usually a ghost Button. */
  action?: React.ReactNode;
  onDismiss?: () => void;
}
export declare function Toast(props: ToastProps): JSX.Element;
