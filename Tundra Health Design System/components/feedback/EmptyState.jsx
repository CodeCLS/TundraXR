import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function EmptyState({ icon = 'inbox', title, description, action, style, ...rest }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 10, padding: 'var(--space-12) var(--space-6)', textAlign: 'center',
      backgroundImage: 'var(--pattern-dots-soft)', backgroundSize: 'var(--dot-gap) var(--dot-gap)', ...style,
    }} {...rest}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36,
        borderRadius: 'var(--radius-md)', background: 'var(--paper-000)', border: '1px solid var(--border-hairline)', boxShadow: 'var(--shadow-sm)',
      }}>
        <Icon name={icon} size={17} color="var(--text-muted)" />
      </span>
      <span style={{ font: 'var(--weight-medium) var(--text-size-body)/1.3 var(--font-sans)', color: 'var(--text-display)' }}>{title}</span>
      {description && <span style={{ maxWidth: 380, font: 'var(--weight-regular) var(--text-body-sm)/1.5 var(--font-sans)', color: 'var(--text-secondary)' }}>{description}</span>}
      {action && <span style={{ marginTop: 6 }}>{action}</span>}
    </div>
  );
}
