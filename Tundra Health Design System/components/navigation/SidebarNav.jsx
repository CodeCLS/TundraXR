import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function SidebarNav({ sections = [], value, onChange, style, ...rest }) {
  const [hover, setHover] = React.useState(null);
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', ...style }} {...rest}>
      {sections.map((sec, si) => (
        <div key={sec.label || si} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sec.label && (
            <div style={{ padding: '0 8px 7px', font: 'var(--weight-medium) 10.5px/1 var(--font-sans)', letterSpacing: '.085em', textTransform: 'uppercase', color: 'var(--ink-600)' }}>{sec.label}</div>
          )}
          {(sec.items || []).map(it => {
            const active = it.value === value;
            const hot = hover === it.value;
            return (
              <button key={it.value} type="button" onClick={() => onChange && onChange(it.value)}
                onMouseEnter={() => setHover(it.value)} onMouseLeave={() => setHover(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, width: '100%',
                  height: 28, padding: '0 8px', border: 0, borderRadius: 'var(--radius-sm)',
                  background: active ? 'var(--surface-selected)' : hot ? 'var(--surface-hover)' : 'transparent',
                  boxShadow: active ? 'inset 0 0 0 1px var(--border-accent)' : 'none',
                  color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
                  font: `var(--weight-${active ? 'medium' : 'regular'}) 13px/1 var(--font-sans)`,
                  cursor: 'pointer', textAlign: 'left', transition: 'var(--transition-control)',
                }}>
                {it.icon && <Icon name={it.icon} size={15} />}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
                {it.count !== undefined && (
                  <span style={{ font: 'var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)', color: 'var(--text-muted)' }}>{it.count}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
