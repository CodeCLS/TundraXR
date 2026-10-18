import React from 'react';
import { Icon } from '../core/Icon.jsx';

const TONE = { neutral: 'var(--ink-300)', ok: 'var(--moss-500)', warn: 'var(--amber-500)', down: 'var(--rust-500)', info: 'var(--cobalt-500)' };

export function Timeline({ events = [], style, ...rest }) {
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', ...style }} {...rest}>
      {events.map((e, i) => (
        <li key={e.id || i} style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 12, position: 'relative', paddingBottom: i === events.length - 1 ? 0 : 'var(--space-5)' }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <span style={{
              zIndex: 1, marginTop: 4, width: e.icon ? 18 : 8, height: e.icon ? 18 : 8, borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: e.icon ? 'var(--paper-000)' : (TONE[e.tone] || TONE.neutral),
              border: e.icon ? '1px solid var(--border-default)' : 'none',
            }}>
              {e.icon && <Icon name={e.icon} size={10} color={TONE[e.tone] || 'var(--text-muted)'} />}
            </span>
            {i !== events.length - 1 && (
              <span style={{ position: 'absolute', top: 14, bottom: -6, left: '50%', width: 1, background: 'var(--border-default)' }} />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ font: 'var(--weight-medium) var(--text-body-sm)/1.35 var(--font-sans)', color: 'var(--text-display)' }}>{e.title}</span>
              <span style={{ font: 'var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)', color: 'var(--text-muted)' }}>{e.date}</span>
            </div>
            {e.description && <span style={{ font: 'var(--weight-regular) var(--text-caption)/1.5 var(--font-sans)', color: 'var(--text-secondary)' }}>{e.description}</span>}
            {e.source && (
              <span style={{ marginTop: 3, font: 'var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)', color: 'var(--text-muted)' }}>{e.source}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
