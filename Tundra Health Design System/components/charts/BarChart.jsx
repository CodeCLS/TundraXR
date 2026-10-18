import React from 'react';

const PALETTE = ['var(--stone-600)', 'var(--cobalt-500)', 'var(--amber-500)', 'var(--moss-500)'];

export function BarChart({ data = [], height = 200, color = 'var(--stone-600)', horizontal = false, valueFormat, stacked = false, style, ...rest }) {
  const [hover, setHover] = React.useState(null);
  const fmt = valueFormat || (v => v.toLocaleString());
  const totals = data.map(d => (stacked && Array.isArray(d.value) ? d.value.reduce((a, b) => a + b, 0) : d.value));
  const max = Math.max(...totals, 0) || 1;

  if (horizontal) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, ...style }} {...rest}>
        {data.map((d, i) => (
          <div key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(56px,120px) minmax(48px,1fr) auto', alignItems: 'center', gap: 10 }}>
            <span style={{ font: '12.5px/1.3 var(--font-sans)', color: hover === i ? 'var(--text-body)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color var(--dur-fast) var(--ease-standard)' }}>{d.label}</span>
            <span style={{ minWidth: 0, height: 9, borderRadius: 'var(--radius-pill)', background: 'var(--paper-200)', overflow: 'hidden' }}>
              <span style={{ display: 'block', width: `${(totals[i] / max) * 100}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: d.color || color, opacity: hover === null || hover === i ? 1 : 0.4, transition: 'opacity var(--dur-fast) var(--ease-standard),width var(--dur-slow) var(--ease-out)' }} />
            </span>
            <span style={{ font: 'var(--weight-medium) 11.5px var(--font-mono)', color: 'var(--text-body)', textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{fmt(totals[i])}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height }}>
        {data.map((d, i) => {
          const parts = stacked && Array.isArray(d.value) ? d.value : [totals[i]];
          return (
            <div key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ font: 'var(--weight-medium) 10.5px/1 var(--font-mono)', color: hover === i ? 'var(--text-body)' : 'var(--ink-400)', opacity: hover === null || hover === i ? 1 : 0.4, transition: 'var(--transition-control)' }}>{fmt(totals[i])}</span>
              <span style={{ width: '100%', display: 'flex', flexDirection: 'column-reverse', height: `${(totals[i] / max) * 100}%`, borderRadius: '5px 5px 2px 2px', overflow: 'hidden', opacity: hover === null || hover === i ? 1 : 0.45, transformOrigin: 'bottom', animation: 'tundra-rise var(--dur-slow) var(--ease-out)', transition: 'opacity var(--dur-fast) var(--ease-standard)' }}>
                {parts.map((p, pi) => (
                  <span key={pi} style={{ height: `${(p / (totals[i] || 1)) * 100}%`, background: pi === 0 ? (d.color || color) : PALETTE[(pi + 1) % PALETTE.length] }} />
                ))}
              </span>
              <span style={{ font: '10px/1 var(--font-mono)', color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
