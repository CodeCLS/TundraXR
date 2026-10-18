import React from 'react';
import { Icon } from '../core/Icon.jsx';

const STATE = {
  ok:      { icon: 'check',           fg: 'var(--status-ok-fg)',   bg: 'var(--status-ok-bg)' },
  running: { icon: 'loader',          fg: 'var(--cobalt-700)',     bg: 'var(--cobalt-050)' },
  failed:  { icon: 'x',               fg: 'var(--status-down-fg)', bg: 'var(--status-down-bg)' },
  queued:  { icon: 'clock',           fg: 'var(--text-secondary)', bg: 'var(--paper-100)' },
};

/* One invocation of a Tundra tool — the unit of an agent's audit trail.
   Rendered as a mono row so a reader can see exactly what was called. */
export function ToolCall({ name, args = {}, result, status = 'ok', duration, style, ...rest }) {
  const s = STATE[status] || STATE.ok;
  const entries = Object.entries(args);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 7,
      padding: '10px 12px', background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-xs)', ...style,
    }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 17, height: 17, borderRadius: 'var(--radius-xs)', flex: '0 0 auto',
          background: s.bg, marginTop: 0.5,
        }}>
          <Icon name={s.icon} size={11} color={s.fg} />
        </span>
        <span style={{
          font: 'var(--weight-medium) 12px/1.35 var(--font-mono)', color: 'var(--text-display)',
          /* Tool names are a real API surface — never ellipsise one. Long dotted
             names wrap at any character instead of losing their tail. */
          minWidth: 0, whiteSpace: 'normal', overflowWrap: 'anywhere',
        }}>{name}</span>
        {duration && (
          <span style={{ marginLeft: 'auto', flex: '0 0 auto', font: '10.5px/1.35 var(--font-mono)', color: 'var(--text-secondary)' }}>{duration}</span>
        )}
      </div>
      {entries.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, paddingLeft: 25 }}>
          {entries.map(([k, v]) => (
            <span key={k} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2.5px 6px', borderRadius: 'var(--radius-xs)',
              background: 'var(--paper-100)', border: '1px solid var(--line-200)',
              font: '10.5px/1 var(--font-mono)', whiteSpace: 'nowrap',
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
              <span style={{ color: 'var(--text-display)' }}>{String(v)}</span>
            </span>
          ))}
        </div>
      )}
      {result && (
        <span style={{
          paddingLeft: 25, font: '11px/1.45 var(--font-mono)', color: 'var(--text-secondary)',
        }}>→ {result}</span>
      )}
    </div>
  );
}
