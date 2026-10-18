import React from 'react';
import { Icon } from '../core/Icon.jsx';

const ICONS = { info: 'info', ok: 'circle-check-big', warn: 'triangle-alert', down: 'octagon-alert' };
const FG = { info: 'var(--cobalt-500)', ok: 'var(--moss-500)', warn: 'var(--amber-500)', down: 'var(--rust-500)' };

export function Toast({ title, description, tone = 'info', action, onDismiss, style, ...rest }) {
  return (
    <div role="status" style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, width: 360, padding: '12px 12px 12px 13px',
      background: 'var(--paper-000)', border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', animation: 'tundra-fade-up var(--dur-base) var(--ease-out)', ...style,
    }} {...rest}>
      <Icon name={ICONS[tone]} size={16} color={FG[tone]} style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ font: 'var(--weight-medium) var(--text-body-sm)/1.35 var(--font-sans)', color: 'var(--text-display)' }}>{title}</span>
        {description && <span style={{ font: 'var(--weight-regular) var(--text-caption)/1.45 var(--font-sans)', color: 'var(--text-secondary)' }}>{description}</span>}
        {action && <span style={{ marginTop: 4 }}>{action}</span>}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss"
          style={{ border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, lineHeight: 0 }}>
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
