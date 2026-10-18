import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* The device speaking for itself. Tundra's distinctive move: an answer is
   voiced by the asset, in the first person, and always carries the records it
   is drawing on. `speaker: 'you'` renders the human side of the exchange. */
export function DeviceMessage({
  speaker = 'device', name, tag, children, citations = [], confidence, style, ...rest
}) {
  const you = speaker === 'you';
  return (
    <div style={{
      display: 'flex', gap: 11, flexDirection: you ? 'row-reverse' : 'row',
      alignItems: 'flex-start', ...style,
    }} {...rest}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, borderRadius: you ? '50%' : 'var(--radius-sm)', flex: '0 0 auto',
        background: you ? 'var(--paper-100)' : 'var(--surface-primary)',
        border: you ? '1px solid var(--line-200)' : 'none',
      }}>
        <Icon name={you ? 'user' : 'activity'} size={13} color={you ? 'var(--text-secondary)' : 'var(--cream-100)'} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, maxWidth: '82%', alignItems: you ? 'flex-end' : 'flex-start' }}>
        {(name || tag) && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
            {name && <span style={{ font: 'var(--weight-medium) 12px/1 var(--font-sans)', color: 'var(--text-display)' }}>{name}</span>}
            {tag && <span style={{ font: '10.5px/1 var(--font-mono)', color: 'var(--text-secondary)' }}>{tag}</span>}
          </div>
        )}
        <div style={{
          padding: '11px 13px', borderRadius: 'var(--radius-lg)',
          background: you ? 'var(--paper-100)' : 'var(--surface-card)',
          border: '1px solid ' + (you ? 'var(--line-200)' : 'var(--border-hairline)'),
          boxShadow: you ? 'none' : 'var(--shadow-xs)',
          font: '13.5px/1.6 var(--font-sans)', color: 'var(--text-body)',
          textAlign: 'left',
        }}>{children}</div>
        {(citations.length > 0 || confidence) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5, justifyContent: you ? 'flex-end' : 'flex-start' }}>
            {citations.map(c => (
              <span key={c} style={{
                padding: '2.5px 7px', borderRadius: 'var(--radius-xs)',
                background: 'var(--cobalt-050)', border: '1px solid var(--cobalt-200)',
                font: '10.5px/1.3 var(--font-mono)', color: 'var(--cobalt-900)', whiteSpace: 'nowrap',
              }}>{c}</span>
            ))}
            {confidence && (
              <span style={{ font: '10.5px/1 var(--font-mono)', color: 'var(--text-secondary)' }}>confidence {confidence}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
