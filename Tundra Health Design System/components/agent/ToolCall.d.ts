import * as React from 'react';
/**
 * One invocation of a Tundra tool.
 * @startingPoint section="Agent" subtitle="Tool calls and the device's own voice" viewport="700x320"
 */
export interface ToolCallProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fully-qualified tool name, e.g. "tundra.device.log_event". */
  name: string;
  /** Arguments, rendered as key=value chips in call order. */
  args?: Record<string, string | number | boolean>;
  /** One-line summary of what came back. */
  result?: React.ReactNode;
  status?: 'ok' | 'running' | 'failed' | 'queued';
  /** Elapsed time, e.g. "240ms". */
  duration?: string;
}
export declare function ToolCall(props: ToolCallProps): JSX.Element;
