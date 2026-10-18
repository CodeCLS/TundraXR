import * as React from 'react';
export interface TabItem { value: string; label: string; count?: number }
/**
 * Underlined section switcher.
 * @startingPoint section="Navigation" subtitle="Tabs, breadcrumbs and sidebar navigation" viewport="700x300"
 */
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: Array<string | TabItem>;
  value: string;
  onChange?: (value: string) => void;
}
export declare function Tabs(props: TabsProps): JSX.Element;
