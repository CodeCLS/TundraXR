import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Select({ label, hint, options = [], size = 'md', style, id, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  const height = size === 'sm' ? 'var(--control-height-sm)' : 'var(--control-height)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label htmlFor={uid} style={{ font: 'var(--weight-medium) 14px/1.2 var(--font-sans)', color: 'var(--text-body)' }}>{label}</label>}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', height,
        background: 'var(--surface-card)', border: '1px solid ' + (focus ? 'var(--border-focus)' : 'var(--border-default)'),
        borderRadius: 'var(--radius-md)', boxShadow: focus ? 'var(--ring-focus)' : 'var(--shadow-xs)',
        transition: 'var(--transition-control)',
      }}>
        <select id={uid} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            appearance: 'none', width: '100%', height: '100%', padding: '0 30px 0 10px',
            border: 0, outline: 'none', background: 'transparent', color: 'var(--text-body)',
            font: 'var(--weight-regular) 14px/1 var(--font-sans)', cursor: 'pointer',
          }}
          {...rest}>
          {options.map(o => {
            const v = typeof o === 'string' ? o : o.value;
            const l = typeof o === 'string' ? o : o.label;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
        <Icon name="chevron-down" size={14} color="var(--text-muted)" style={{ position: 'absolute', right: 9, pointerEvents: 'none' }} />
      </div>
      {hint && <span style={{ font: 'var(--weight-regular) var(--text-caption)/1.35 var(--font-sans)', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
}
