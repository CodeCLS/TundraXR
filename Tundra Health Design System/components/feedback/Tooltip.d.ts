import * as React from 'react';
/**
 * Hover explainer.
 * @startingPoint section="Feedback" subtitle="Dialog, toast, tooltip and empty states" viewport="700x320"
 */
export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
