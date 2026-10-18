import React from 'react';

export function ProgressBar({ value = 0, max = 100, label, valueLabel, tone = 'accent', segments, height = 8, style, ...rest }) {
  const TONE = { accent: 'var(--cobalt-500)', ok: 'var(--moss-500)', warn: 'var(--amber-500)', down: 'var(--rust-500)', ink: 'var(--ink-800)' };
  const parts = segments || [{ value, color: TONE[tone] || TONE.accent }];
  const total = parts.reduce((a, p) => a + p.value, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }} {...rest}>
      {(label || valueLabel) && (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          {label && <span style={{ font: '12px/1.3 var(--font-sans)', color: 'var(--text-secondary)' }}>{label}</span>}
          {valueLabel && <span style={{ font: 'var(--weight-medium) 11.5px/1 var(--font-mono)', color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>{valueLabel}</span>}
        </div>
      )}
      <div role="progressbar" aria-valuenow={total} aria-valuemax={max}
        style={{ display: 'flex', height, borderRadius: 'var(--radius-pill)', background: 'var(--paper-200)', boxShadow: 'inset 0 0 0 1px var(--border-hairline)', overflow: 'hidden' }}>
        {parts.map((p, i) => (
          <span key={i} style={{ width: `${(p.value / max) * 100}%`, background: p.color || TONE.accent, transition: 'width var(--dur-slow) var(--ease-out)' }} />
        ))}
      </div>
    </div>
  );
}
