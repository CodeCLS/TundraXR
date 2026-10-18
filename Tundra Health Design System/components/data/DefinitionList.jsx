import React from 'react';

export function DefinitionList({ items = [], columns = 1, style, ...rest }) {
  return (
    <dl style={{
      display: 'grid', gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`,
      gap: 'var(--space-4) var(--space-8)', margin: 0, ...style,
    }} {...rest}>
      {items.map((it, i) => (
        <div key={it.label + i} style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <dt style={{ font: 'var(--weight-medium) 10.5px/1 var(--font-sans)', letterSpacing: '.085em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{it.label}</dt>
          <dd style={{
            margin: 0, minWidth: 0,
            font: it.mono ? 'var(--weight-regular) var(--text-mono)/1.4 var(--font-mono)' : 'var(--weight-regular) var(--text-body-sm)/1.45 var(--font-sans)',
            color: 'var(--text-body)', overflowWrap: 'anywhere',
          }}>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
