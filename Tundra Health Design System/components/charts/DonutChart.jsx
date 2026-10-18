import React from 'react';

const PALETTE = ['var(--stone-600)', 'var(--cobalt-500)', 'var(--amber-500)', 'var(--moss-500)', 'var(--rust-500)'];

export function DonutChart({ data = [], size = 132, thickness = 11, centerLabel, centerValue, legend = true, style, ...rest }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', ...style }} {...rest}>
      <div style={{ position: 'relative', width: size, height: size, flex: '0 0 auto' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--paper-100)" strokeWidth={thickness} />
          {data.map((d, i) => {
            const len = (d.value / total) * c;
            const gap = 3;
            const cap = len > thickness * 2.2 ? 'round' : 'butt';
            const draw = Math.max(len - gap - (cap === 'round' ? thickness : 0), 0.5);
            const el = (
              <circle key={d.label} cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={d.color || PALETTE[i % PALETTE.length]} strokeWidth={thickness}
                strokeDasharray={`${draw} ${c - draw}`}
                strokeDashoffset={-(offset + (cap === 'round' ? thickness / 2 : 0))} strokeLinecap={cap}
                style={{ animation: `tundra-fade var(--dur-slow) var(--ease-out) ${i * 70}ms both` }} />
            );
            offset += len;
            return el;
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <span style={{ font: 'var(--weight-medium) 25px/1 var(--font-sans)', letterSpacing: '-.03em', color: 'var(--text-display)', fontVariantNumeric: 'tabular-nums' }}>{centerValue}</span>
            <span style={{ font: 'var(--weight-medium) 11px/1 var(--font-sans)', color: 'var(--text-muted)' }}>{centerLabel}</span>
          </div>
        )}
      </div>
      {legend && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
          {data.map((d, i) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, font: '12px/1.3 var(--font-sans)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: d.color || PALETTE[i % PALETTE.length], flex: '0 0 auto' }} />
              <span style={{ flex: 1, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{d.label}</span>
              <span style={{ font: 'var(--weight-medium) 11.5px var(--font-mono)', color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>{Math.round((d.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
