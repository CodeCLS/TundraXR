import * as React from 'react';

export interface GraphRow {
  /** Stable id — edges attach to a row by this. */
  id?: string;
  label: string;
  /** Right-aligned value. Mono by default. */
  value?: React.ReactNode;
  /** Render the value as a bordered pill (the reference's control chips). */
  pill?: boolean;
  /** Set false to render the value in the sans face instead of mono. */
  mono?: boolean;
  tone?: 'default' | 'ok' | 'down';
}

export interface GraphNode {
  id: string;
  /** Titlebar text. */
  label: string;
  /** Labelled input/output rows. Ports attach to these. */
  rows?: GraphRow[];
  /** Footer strip: one caption + one figure. */
  footer?: { label: string; value: string; tone?: 'default' | 'down' };
  /** Short uppercase flag in the titlebar, e.g. "2 BREACHES". */
  badge?: string;
  type?: 'device' | 'contract' | 'record' | 'location' | 'vendor' | 'risk';
  /** Explicit column. Omit to derive from BFS depth off the root. */
  col?: number;
  /** Sort key within a column. */
  order?: number;
  /** Override the card width. */
  width?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  /** Row id on the source card the cable leaves from. Defaults to the titlebar. */
  fromRow?: string;
  /** Row id on the target card the cable lands in. */
  toRow?: string;
  /** `risk` draws the cable in rust — an outage or blocking dependency. */
  tone?: 'default' | 'risk';
  /** Dashed cable for an inferred rather than recorded relationship. */
  dashed?: boolean;
}

/**
 * Node-editor view of the device graph.
 * @startingPoint section="Charts" subtitle="Device graph, charts, sparklines and progress" viewport="700x420"
 */
export interface NetworkGraphProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Column 0 of the layout. Defaults to the first node of type `device`. */
  rootId?: string;
  /** Canvas width; the whole graph scales to its container. Height is derived. */
  width?: number;
  /** Id of the pinned card — outlined in cobalt, dims everything unconnected. */
  selected?: string;
  onSelect?: (node: GraphNode) => void;
  legend?: boolean;
}
export declare function NetworkGraph(props: NetworkGraphProps): JSX.Element;
