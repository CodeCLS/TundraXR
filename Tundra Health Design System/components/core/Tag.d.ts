import * as React from 'react';
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Renders the label in Geist Mono — use for asset tags, model numbers, CMMS ids. */
  mono?: boolean;
  /** When provided, renders a dismiss affordance. */
  onRemove?: () => void;
}
export declare function Tag(props: TagProps): JSX.Element;
