import React from 'react';

export function Radio({ label, description, checked, onChange, name, value, disabled, style, ...rest }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: description ? 'flex-start' : 'center', gap: 9, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      <input type="radio" name={name} value={value} checked={!!checked} onChange={onChange} disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 16, height: 16, flex: '0 0 auto', marginTop: description ? 2 : 0, borderRadius: '50%',
        background: 'var(--surface-card)',
        border: '1px solid ' + (checked ? 'var(--stone-700)' : 'var(--border-strong)'),
        boxShadow: 'var(--shadow-xs)', transition: 'var(--transition-control)',
      }}>
        {checked && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--stone-700)' }} />}
      </span>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {label && <span style={{ font: 'var(--weight-regular) var(--text-body-sm)/1.35 var(--font-sans)', color: 'var(--text-body)' }}>{label}</span>}
          {description && <span style={{ font: 'var(--weight-regular) var(--text-caption)/1.4 var(--font-sans)', color: 'var(--text-muted)' }}>{description}</span>}
        </span>
      )}
    </label>
  );
}
