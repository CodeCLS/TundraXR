import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Dialog({ open, title, description, children, footer, onClose, width = 480, style, ...rest }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(59,58,53,.30)', backdropFilter: 'blur(2px)', animation: 'tundra-fade var(--dur-base) var(--ease-standard)' }} />
      <div style={{
        position: 'relative', width, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto',
        background: 'var(--paper-000)', border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)',
        animation: 'tundra-scale-in var(--dur-base) var(--ease-out)', ...style,
      }} {...rest}>
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-5) 0' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ font: 'var(--weight-medium) var(--text-title-2)/1.2 var(--font-sans)', letterSpacing: 'var(--ls-title-2)', color: 'var(--text-display)' }}>{title}</h2>
            {description && <p style={{ marginTop: 6, font: 'var(--weight-regular) var(--text-body-sm)/1.5 var(--font-sans)', color: 'var(--text-secondary)' }}>{description}</p>}
          </div>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Close"
              style={{ border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, lineHeight: 0, marginTop: -2 }}>
              <Icon name="x" size={16} />
            </button>
          )}
        </header>
        {children && <div style={{ padding: 'var(--space-5)' }}>{children}</div>}
        {footer && (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--border-hairline)', background: 'var(--paper-050)' }}>{footer}</footer>
        )}
      </div>
    </div>
  );
}
