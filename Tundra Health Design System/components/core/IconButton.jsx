import React from 'react';
import { Icon } from './Icon.jsx';

const BOX = { sm: 30, md: 36, lg: 40 };

export function IconButton({ icon, label, size = 'md', variant = 'ghost', disabled, active, style, ...rest }) {
  const [h, setH] = React.useState(false);
  const box = BOX[size] || BOX.md;
  const base = variant === 'secondary'
    ? { background: 'var(--surface-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }
    : { background: active ? 'var(--surface-active)' : 'transparent', border: '1px solid transparent', boxShadow: 'none' };
  return (
    <button
      type="button" aria-label={label} title={label} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: box, height: box, borderRadius: 'var(--radius-md)',
        color: active ? 'var(--text-body)' : 'var(--text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.42 : 1,
        transition: 'var(--transition-control)', ...base,
        ...(h && !disabled ? { background: variant === 'secondary' ? 'var(--paper-050)' : 'var(--surface-hover)', color: 'var(--text-body)' } : null),
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 14 : 16} />
    </button>
  );
}
