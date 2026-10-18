import React from 'react';
import { Icon } from '../core/Icon.jsx';

const SIZES = { sm: 'var(--text-stat-sm)', md: 'var(--text-stat)', lg: 'var(--text-stat-lg)' };

export function StatTile({ label, value, unit, delta, deltaTone = 'neutral', deltaDirection, hint, chart, size = 'md', bare = false, tone = 'default', style, ...rest }) {
  const inverse = tone === 'inverse';
  const color = tone === 'inverse'
    ? 'rgba(248,242,220,.72)'
    : deltaTone === 'ok' ? 'var(--moss-700)' : deltaTone === 'down' ? 'var(--rust-700)' : 'var(--text-muted)';
  const dir = deltaDirection || (deltaTone === 'down' ? 'up' : 'down');
  const labelColor = inverse ? 'var(--cobalt-300)' : 'var(--text-secondary)';
  const valueColor = inverse ? 'var(--cream-100)' : 'var(--text-display)';
  const mutedColor = inverse ? 'rgba(248,242,220,.62)' : 'var(--text-muted)';
  const surface = bare ? {} : {
    padding: 'var(--space-4) var(--space-5) var(--space-5)',
    background: inverse ? 'rgba(248,242,220,.06)' : 'var(--surface-card)',
    border: inverse ? '1px solid var(--border-inverse)' : '1px solid var(--border-hairline)',
    borderRadius: 'var(--radius-lg)',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', ...surface, ...style }} {...rest}>
      <span style={{ font: 'var(--weight-medium) 10.5px/1 var(--font-sans)', letterSpacing: '.085em', textTransform: 'uppercase', color: labelColor }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ font: `var(--weight-regular) ${SIZES[size] || SIZES.md}/1 var(--font-sans)`, letterSpacing: 'var(--ls-stat)', color: valueColor, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {unit && <span style={{ font: 'var(--weight-regular) var(--text-body-sm)/1 var(--font-sans)', color: mutedColor }}>{unit}</span>}
      </span>
      {chart}
      {(delta || hint) && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 2 }}>
          {delta && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color, font: 'var(--weight-medium) var(--text-caption)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
              <Icon name={dir === 'up' ? 'arrow-up-right' : 'arrow-down-right'} size={12} color={color} />
              {delta}
            </span>
          )}
          {hint && <span style={{ font: 'var(--weight-regular) var(--text-caption)/1 var(--font-sans)', color: mutedColor }}>{hint}</span>}
        </span>
      )}
    </div>
  );
}
