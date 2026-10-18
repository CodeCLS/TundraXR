import React from 'react';

export function Textarea({ label, hint, error, rows = 4, style, id, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label htmlFor={uid} style={{ font: 'var(--weight-medium) 14px/1.2 var(--font-sans)', color: 'var(--text-body)' }}>{label}</label>}
      <textarea id={uid} rows={rows} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          resize: 'vertical', padding: '9px 11px', background: 'var(--surface-card)',
          border: '1px solid ' + (error ? 'var(--rust-500)' : focus ? 'var(--border-focus)' : 'var(--border-default)'),
          borderRadius: 'var(--radius-md)', outline: 'none',
          boxShadow: focus ? 'var(--ring-focus)' : 'var(--shadow-xs)',
          font: 'var(--weight-regular) 14px/1.55 var(--font-sans)', color: 'var(--text-body)',
          transition: 'var(--transition-control)',
        }}
        {...rest} />
      {(hint || error) && <span style={{ font: 'var(--weight-regular) var(--text-caption)/1.35 var(--font-sans)', color: error ? 'var(--rust-700)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </div>
  );
}
