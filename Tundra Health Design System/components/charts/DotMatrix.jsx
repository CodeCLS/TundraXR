import React from 'react';

/* Columns rendered as stacks of small squares — the dot-matrix bar chart from the
   Tundra mood board. Reads as data AND as the brand's dotted survey grid. */
export function DotMatrix({ data = [], rows = 12, cell = 5, gap = 2, columnGap = 3, color = 'var(--stone-600)', emptyColor = 'var(--paper-300)', labels = true, valueFormat, style, ...rest }) {
  const [hover, setHover] = React.useState(null);
  const values = data.map(d => (typeof d === 'number' ? d : d.value));
  const max = Math.max(...values, 0) || 1;
  const fmt = valueFormat || (v => v.toLocaleString());
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: columnGap, height: rows * (cell + gap) }}>
        {data.map((d, i) => {
          const v = values[i];
          const filled = Math.max(1, Math.round((v / max) * rows));
          const col = (typeof d === 'object' && d.color) || color;
          const on = hover === null || hover === i;
          return (
            <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap, cursor: 'default', opacity: on ? 1 : 0.42, transition: 'opacity var(--dur-fast) var(--ease-standard)' }}>
              {Array.from({ length: rows }, (_, rIdx) => (
                <span key={rIdx} style={{
                  width: cell, height: cell, borderRadius: 1, flex: '0 0 auto',
                  background: rIdx < filled ? col : emptyColor,
                  animation: rIdx < filled ? `tundra-fade var(--dur-base) var(--ease-out) ${i * 18 + rIdx * 6}ms both` : undefined,
                }} />
              ))}
            </div>
          );
        })}
      </div>
      {labels && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: columnGap }}>
          {data.map((d, i) => (
            <span key={i} style={{ flex: 1, textAlign: 'center', font: '9.5px/1 var(--font-mono)', letterSpacing: '.06em', textTransform: 'uppercase', color: hover === i ? 'var(--text-body)' : 'var(--ink-400)', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {hover === i ? fmt(values[i]) : (typeof d === 'object' ? d.label : '')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
