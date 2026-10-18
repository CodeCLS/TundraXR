import * as React from 'react';
export interface TimelineEvent {
  id?: string;
  title: React.ReactNode;
  /** Short date string, rendered in mono. */
  date?: string;
  description?: React.ReactNode;
  /** Provenance line, e.g. "CMMS · WO-88412". Tundra always shows where a fact came from. */
  source?: string;
  tone?: 'neutral' | 'ok' | 'warn' | 'down' | 'info';
  /** Lucide icon name — renders a bordered node instead of a plain dot. */
  icon?: string;
}
export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  events: TimelineEvent[];
}
export declare function Timeline(props: TimelineProps): JSX.Element;
