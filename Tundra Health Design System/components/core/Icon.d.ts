import * as React from 'react';
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Lucide icon name in kebab-case, e.g. "activity", "wrench", "file-text". */
  name: string;
  /** Pixel size of the square glyph. Default 16. */
  size?: number;
  /** Stroke weight. Tundra default is 1.5. */
  strokeWidth?: number;
  /** Stroke colour. Defaults to currentColor. */
  color?: string;
}
export declare function Icon(props: IconProps): JSX.Element;
