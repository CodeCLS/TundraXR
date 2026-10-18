import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Breadcrumbs({ items = [], style, ...rest }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', ...style }} {...rest}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        const label = typeof it === 'string' ? it : it.label;
        const href = typeof it === 'string' ? undefined : it.href;
        return (
          <React.Fragment key={label + i}>
            {i > 0 && <Icon name="chevron-right" size={13} color="var(--ink-300)" />}
            {last || !href
              ? <span aria-current={last ? 'page' : undefined} style={{ font: `var(--weight-${last ? 'medium' : 'regular'}) var(--text-body-sm)/1.2 var(--font-sans)`, color: last ? 'var(--text-body)' : 'var(--text-secondary)' }}>{label}</span>
              : <a href={href} style={{ font: 'var(--weight-regular) var(--text-body-sm)/1.2 var(--font-sans)', color: 'var(--text-secondary)', borderBottom: 0 }}>{label}</a>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
