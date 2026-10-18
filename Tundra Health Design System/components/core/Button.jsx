import React from 'react';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: { height: 'var(--control-height-sm)', padding: '0 12px', font: '13px', gap: 6, icon: 14 },
  md: { height: 'var(--control-height)', padding: '0 16px', font: '14px', gap: 7, icon: 15 },
  lg: { height: 'var(--control-height-lg)', padding: '0 22px', font: '14px', gap: 8, icon: 16 },
};

const VARIANTS = {
  primary: { background: 'var(--surface-primary)', color: 'var(--cream-050)', border: '1px solid transparent', boxShadow: 'var(--shadow-xs)', hover: 'var(--surface-primary-hover)', active: 'var(--surface-primary-active)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)', hover: 'var(--paper-100)', active: 'var(--paper-200)' },
  ghost: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent', boxShadow: 'none', hover: 'var(--surface-hover)', active: 'var(--surface-active)' },
  accent: { background: 'var(--surface-accent)', color: 'var(--cobalt-700)', border: '1px solid var(--cobalt-100)', boxShadow: 'none', hover: 'var(--surface-accent-hover)', active: 'var(--cobalt-100)' },
  danger: { background: 'var(--rust-050)', color: 'var(--rust-700)', border: '1px solid rgba(160,90,70,.22)', boxShadow: 'none', hover: '#F0E0D9', active: '#EAD6CE' },
};

export function Button({ children, variant = 'secondary', size = 'md', iconLeft, iconRight, disabled, fullWidth, type = 'button', style, ...rest }) {
  const [h, setH] = React.useState(false);
  const [a, setA] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.secondary;
  return (
    <button
      type={type} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setA(false); }}
      onMouseDown={() => setA(true)} onMouseUp={() => setA(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
        alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.height, padding: s.padding,
        font: `var(--weight-medium) ${s.font}/1 var(--font-sans)`, letterSpacing: '-.008em',
        background: a ? v.active : h ? v.hover : v.background,
        color: v.color, border: v.border, borderRadius: 'var(--radius-md)',
        boxShadow: v.boxShadow, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined,
        transition: 'var(--transition-control)', whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      {iconLeft && <Icon name={iconLeft} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </button>
  );
}
