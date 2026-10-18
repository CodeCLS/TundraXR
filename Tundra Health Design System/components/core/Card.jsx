import React from 'react';

export function Card({ children, title, meta, actions, padded = true, tone = 'paper', dotted = false, bodyStyle, style, ...rest }) {
  const bg = tone === 'brand' ? 'var(--surface-brand)' : tone === 'sunken' ? 'var(--surface-sunken)' : 'var(--surface-card)';
  return (
    <section
      style={{
        position: 'relative', background: bg,
        border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'none',
        overflow: 'hidden',
        backgroundImage: dotted ? 'var(--pattern-dots-soft)' : undefined,
        backgroundSize: dotted ? 'var(--dot-gap) var(--dot-gap)' : undefined,
        ...style,
      }}
      {...rest}
    >
      {(title || actions) && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: '14px var(--space-5)', borderBottom: '1px solid var(--border-hairline)' }}>
          <div style={{ minWidth: 0 }}>
            {title && <h3 style={{ font: 'var(--weight-medium) var(--text-title-3)/1.25 var(--font-sans)', letterSpacing: 'var(--ls-title-3)', color: 'var(--text-display)' }}>{title}</h3>}
            {meta && <p style={{ marginTop: 3, font: 'var(--weight-regular) var(--text-body-sm)/1.4 var(--font-sans)', color: 'var(--text-secondary)' }}>{meta}</p>}
          </div>
          {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: '0 0 auto' }}>{actions}</div>}
        </header>
      )}
      <div style={{ padding: padded ? 'var(--space-5)' : 0, ...bodyStyle }}>{children}</div>
    </section>
  );
}
