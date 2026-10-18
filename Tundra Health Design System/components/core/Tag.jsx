import React from 'react';
import { Icon } from './Icon.jsx';

export function Tag({ children, onRemove, mono = false, style, ...rest }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 25, padding: onRemove ? '0 5px 0 11px' : '0 11px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        color: 'var(--text-body)',
        font: mono
          ? `var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)`
          : `var(--weight-regular) var(--text-caption)/1 var(--font-sans)`,
        whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="Remove"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, padding: 0, border: 0, borderRadius: '50%', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <Icon name="x" size={11} />
        </button>
      )}
    </span>
  );
}
