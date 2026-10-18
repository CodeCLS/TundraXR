import * as React from 'react';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic tone. Device state maps to ok / warn / down. */
  tone?: 'neutral' | 'ok' | 'warn' | 'down' | 'info' | 'brand';
  /** Show a leading status dot. */
  dot?: boolean;
}
export declare function Badge(props: BadgeProps): JSX.Element;
