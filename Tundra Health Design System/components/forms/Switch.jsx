import React from 'react';

export function Switch({ checked, onChange, label, description, disabled, style, ...rest }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: description ? 'flex-start' : 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      <input type="checkbox" role="switch" checked={!!checked} onChange={onChange} disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{
        position: 'relative', width: 34, height: 20, flex: '0 0 auto', marginTop: description ? 1 : 0,
        borderRadius: 'var(--radius-pill)',
        background: checked ? 'var(--stone-700)' : 'var(--paper-200)',
        border: '1px solid ' + (checked ? 'var(--stone-700)' : 'var(--border-strong)'),
        transition: 'background-color var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard)',
      }}>
        <span style={{
          position: 'absolute', top: 1.5, left: checked ? 15.5 : 1.5, width: 15, height: 15, borderRadius: '50%',
          background: checked ? 'var(--cream-100)' : 'var(--surface-card)', boxShadow: 'var(--shadow-sm)',
          transition: 'left var(--dur-base) var(--ease-out)',
        }} />
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
