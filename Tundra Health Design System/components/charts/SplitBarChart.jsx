import React from 'react';

/* A dense two-state bar comparison — the "before / after" specimen: a long run
   of thin bars split by a labelled divider, muted on the left, accented on the
   right. Reads as evidence rather than decoration, so use it when the claim is
   a step change (recovery before/after Tundra, downtime before/after triage). */

export function SplitBarChart({
  data = [], split, height = 180, barGap = 1,
  leftLabel = 'Before', rightLabel = 'After',
  leftColor = 'var(--ink-200)', rightColor = 'var(--cobalt-500)',
  ticks = [], valueFormat, style, ...rest
}) {
  const [hover, setHover] = React.useState(null);
  const n = data.length || 1;
  const cut = split === undefined ? Math.floor(n / 2) : split;
  const max = Math.max(...data, 1);
  const fmt = valueFormat || (v => String(Math.round(v)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...style }} {...rest}>
      <div style={{ position: 'relative', height, display: 'flex', alignItems: 'flex-end', gap: barGap }}>
        {data.map((v, i) => {
          const on = i >= cut;
          const isHover = hover === i;
          return (
            <span key={i}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{
                flex: 1, minWidth: 0, height: `${Math.max(1.5, (v / max) * 100)}%`,
                background: on ? rightColor : leftColor,
                opacity: isHover ? 1 : on ? 0.92 : 0.75,
                transition: 'opacity var(--dur-fast) var(--ease-standard)',
              }} />
          );
        })}
        {/* Divider: a full-height rule with the two state labels straddling it. */}
        <span style={{
          position: 'absolute', top: 0, bottom: 0, left: `${(cut / n) * 100}%`,
          width: 1, background: rightColor, pointerEvents: 'none',
        }} />
        <span style={{
          position: 'absolute', bottom: '18%', left: `${(cut / n) * 100}%`,
          transform: 'translateX(-50%)', display: 'flex', alignItems: 'stretch',
          borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 8px',
            background: 'var(--paper-000)', border: '1px solid var(--line-200)', borderRight: 'none',
            font: 'var(--weight-medium) 9.5px/1 var(--font-sans)', letterSpacing: '.085em',
            textTransform: 'uppercase', color: 'var(--text-secondary)',
          }}>{leftLabel}<span style={{ color: 'var(--text-secondary)' }}>‹</span></span>
          <span style={{ width: 7, background: rightColor }} />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 8px',
            background: rightColor, border: `1px solid ${rightColor}`, borderLeft: 'none',
            font: 'var(--weight-medium) 9.5px/1 var(--font-sans)', letterSpacing: '.085em',
            textTransform: 'uppercase', color: 'var(--cream-050)',
          }}><span style={{ opacity: .7 }}>›</span>{rightLabel}</span>
        </span>
        {hover !== null && (
          <span style={{
            position: 'absolute', top: 0, left: `${((hover + 0.5) / n) * 100}%`,
            transform: 'translateX(-50%)', padding: '3px 7px', borderRadius: 'var(--radius-xs)',
            background: 'var(--surface-primary)', color: 'var(--cream-100)',
            font: '10px/1 var(--font-mono)', whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>{fmt(data[hover])}</span>
        )}
      </div>
      {ticks.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-hairline)', paddingTop: 6 }}>
          {ticks.map(t => (
            <span key={t} style={{ font: '10px/1 var(--font-mono)', color: 'var(--text-muted)' }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
