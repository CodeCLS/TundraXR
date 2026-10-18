import * as React from 'react';
/**
 * A hairline-bordered surface.
 * @startingPoint section="Core" subtitle="Card surface with header, meta and actions" viewport="700x260"
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  title?: React.ReactNode;
  /** Secondary line under the title. */
  meta?: React.ReactNode;
  /** Right-aligned header controls. */
  actions?: React.ReactNode;
  /** Set false when the body owns its own padding (tables, lists). */
  padded?: boolean;
  /** Extra styles for the body wrapper — e.g. `{height:'100%'}` so content can
   *  stretch when the card is a flex/grid item of equal height. */
  bodyStyle?: React.CSSProperties;
  tone?: 'paper' | 'sunken' | 'brand';
  /** Lay the dotted survey grid behind the card body. */
  dotted?: boolean;
}
export declare function Card(props: CardProps): JSX.Element;
