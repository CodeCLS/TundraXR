import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Input({ label, hint, error, iconLeft, suffix, size = 'md', mono = false, style, id, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  const height = size === 'sm' ? 'var(--control-height-sm)' : size === 'lg' ? 'var(--control-height-lg)' : 'var(--control-height)';
  const borderColor = error ? 'var(--rust-500)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label htmlFor={uid} style={{ font: 'var(--weight-medium) 14px/1.2 var(--font-sans)', color: 'var(--text-body)' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, height, padding: '0 10px',
        background: 'var(--surface-card)', border: '1px solid ' + borderColor, borderRadius: 'var(--radius-md)',
        boxShadow: focus ? (error ? 'var(--ring-danger)' : 'var(--ring-focus)') : 'var(--shadow-xs)',
        transition: 'var(--transition-control)',
      }}>
        {iconLeft && <Icon name={iconLeft} size={15} color="var(--text-muted)" />}
        <input id={uid} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', padding: 0,
            color: 'var(--text-body)',
            font: mono ? 'var(--weight-regular) var(--text-mono)/1.2 var(--font-mono)' : 'var(--weight-regular) 14px/1.2 var(--font-sans)',
          }}
          {...rest} />
        {suffix && <span style={{ font: 'var(--weight-regular) var(--text-caption)/1 var(--font-mono)', color: 'var(--text-muted)' }}>{suffix}</span>}
      </div>
      {(hint || error) && <span style={{ font: 'var(--weight-regular) var(--text-caption)/1.35 var(--font-sans)', color: error ? 'var(--rust-700)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </div>
  );
}
