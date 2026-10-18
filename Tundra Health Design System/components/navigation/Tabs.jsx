import React from 'react';

export function Tabs({ items = [], value, onChange, style, ...rest }) {
  const [hover, setHover] = React.useState(null);
  return (
    <div role="tablist" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', borderBottom: '1px solid var(--border-hairline)', ...style }} {...rest}>
      {items.map(it => {
        const id = typeof it === 'string' ? it : it.value;
        const label = typeof it === 'string' ? it : it.label;
        const count = typeof it === 'string' ? undefined : it.count;
        const active = id === value;
        return (
          <button key={id} role="tab" aria-selected={active} type="button"
            onClick={() => onChange && onChange(id)}
            onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '0 0 10px', border: 0, background: 'transparent', cursor: 'pointer',
              color: active ? 'var(--text-display)' : hover === id ? 'var(--text-body)' : 'var(--text-secondary)',
              font: `var(--weight-${active ? 'medium' : 'regular'}) 14px/1 var(--font-sans)`,
              boxShadow: active ? 'inset 0 -1.5px 0 var(--cobalt-500)' : 'none',
              transition: 'var(--transition-control)',
            }}>
            {label}
            {count !== undefined && (
              <span style={{ font: 'var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)', color: 'var(--text-muted)' }}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
