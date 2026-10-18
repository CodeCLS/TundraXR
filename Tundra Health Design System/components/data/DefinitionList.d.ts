import * as React from 'react';
export interface DefinitionItem { label: string; value: React.ReactNode; mono?: boolean }
export interface DefinitionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DefinitionItem[];
  /** Number of grid columns. Default 1. */
  columns?: number;
}
export declare function DefinitionList(props: DefinitionListProps): JSX.Element;
