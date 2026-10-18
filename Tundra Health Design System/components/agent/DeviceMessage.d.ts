import * as React from 'react';
export interface DeviceMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `device` = the asset answering in the first person; `you` = the human asking. */
  speaker?: 'device' | 'you';
  /** Display name, e.g. "Somatom X.cite CT". */
  name?: string;
  /** Mono qualifier beside the name — asset tag, room, timestamp. */
  tag?: string;
  /** Records the answer draws on, e.g. ["Manual §4.2", "WO-88412"]. */
  citations?: string[];
  /** Model confidence, e.g. "0.82". Shown verbatim, never rounded up. */
  confidence?: string;
}
export declare function DeviceMessage(props: DeviceMessageProps): JSX.Element;
