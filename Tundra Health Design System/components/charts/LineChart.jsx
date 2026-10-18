import React from 'react';

const PALETTE = ['var(--stone-600)', 'var(--cobalt-500)', 'var(--amber-500)', 'var(--moss-500)'];

function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

export function LineChart({ series = [], labels = [], height = 200, area = true, curve = true, yTicks = 4, reference, referenceLabel, markers = false, valueFormat, style, ...rest }) {
  const [hover, setHover] = React.useState(null);
  const ref = React.useRef(null);
  const [w, setW] = React.useState(640);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const padL = 46, padR = 12, padT = 12, padB = 26;
  const all = series.flatMap(s => s.data);
  const rawMax = Math.max(...all, 0), rawMin = Math.min(...all, 0);
  const headroom = (rawMax - rawMin || 1) * 0.12;
  const max = rawMax + headroom, min = Math.max(0, rawMin - headroom);
  const span = max - min || 1;
  const n = Math.max(...series.map(s => s.data.length), 1);
  const x = i => padL + (i / (n - 1 || 1)) * (w - padL - padR);
  const y = v => padT + (1 - (v - min) / span) * (height - padT - padB);
  const fmt = valueFormat || (v => String(Math.round(v)));
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => min + (span * i) / yTicks);
  const id = React.useId().replace(/:/g, '');
  const every = Math.ceil(n / 8);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', ...style }} {...rest}>
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * w;
          const i = Math.round(((px - padL) / (w - padL - padR)) * (n - 1));
          setHover(i >= 0 && i < n ? i : null);
        }}
        style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {series.map((s, si) => (
            <linearGradient key={si} id={`lc${id}${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color || PALETTE[si % PALETTE.length]} stopOpacity="0.22" />
              <stop offset="70%" stopColor={s.color || PALETTE[si % PALETTE.length]} stopOpacity="0.04" />
              <stop offset="100%" stopColor={s.color || PALETTE[si % PALETTE.length]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} stroke={i === 0 ? 'var(--border-default)' : 'var(--border-hairline)'} strokeWidth="1" strokeDasharray={i === 0 ? undefined : '1 5'} strokeLinecap="round" />
            <text x={padL - 10} y={y(t) + 3.5} textAnchor="end" style={{ font: '10px var(--font-mono)', fill: 'var(--ink-400)' }}>{fmt(t)}</text>
          </g>
        ))}
        {series.map((s, si) => {
          const col = s.color || PALETTE[si % PALETTE.length];
          const pts = s.data.map((v, i) => [x(i), y(v)]);
          const line = curve ? smoothPath(pts) : pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
          return (
            <g key={si}>
              {area && !s.dashed && <path d={`${line} L${x(s.data.length - 1)},${height - padB} L${x(0)},${height - padB} Z`} fill={`url(#lc${id}${si})`} style={{ animation: 'tundra-fade var(--dur-slow) var(--ease-out)' }} />}
              <path d={line} fill="none" stroke={col} strokeWidth={s.dashed ? 1.5 : 2}
                strokeDasharray={s.dashed ? '4 4' : undefined}
                strokeLinecap="round" strokeLinejoin="round" opacity={s.dashed ? 0.6 : 1}
                style={s.dashed ? undefined : { strokeDasharray: 2400, animation: 'tundra-draw 900ms var(--ease-out) forwards', ['--draw-len']: 2400 }} />
              {hover !== null && s.data[hover] !== undefined && (
                <circle cx={x(hover)} cy={y(s.data[hover])} r="4" fill="var(--paper-000)" stroke={col} strokeWidth="2" />
              )}
            </g>
          );
        })}
        {reference !== undefined && (
          <g>
            <line x1={padL} x2={w - padR} y1={y(reference)} y2={y(reference)} stroke="var(--ink-500)" strokeWidth="1" strokeDasharray="5 4" />
            {referenceLabel && <text x={w - padR} y={y(reference) - 6} textAnchor="end" style={{ font: '9.5px var(--font-mono)', letterSpacing: '.06em', textTransform: 'uppercase', fill: 'var(--text-muted)' }}>{referenceLabel}</text>}
          </g>
        )}
        {markers && series.map((s, si) => (
          <g key={'m' + si}>
            {s.data.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="var(--surface-card)" stroke={s.color || PALETTE[si % PALETTE.length]} strokeWidth="1.5" />
            ))}
          </g>
        ))}
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={padT} y2={height - padB} stroke="var(--ink-400)" strokeWidth="1" strokeDasharray="2 3" />}
        {labels.map((l, i) => (
          i % every === 0 &&
          <text key={i} x={x(i)} y={height - 7} textAnchor="middle" style={{ font: '10px var(--font-mono)', fill: hover === i ? 'var(--text-body)' : 'var(--ink-400)' }}>{l}</text>
        ))}
      </svg>
      {hover !== null && (
        <div style={{
          position: 'absolute', top: 2, left: Math.min(Math.max(x(hover) - 66, 0), Math.max(w - 140, 0)),
          padding: '8px 10px', background: 'var(--paper-000)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', pointerEvents: 'none', minWidth: 128,
          animation: 'tundra-fade var(--dur-fast) var(--ease-out)',
        }}>
          <div style={{ font: 'var(--weight-medium) 10px/1.2 var(--font-mono)', color: 'var(--text-muted)', marginBottom: 5 }}>{labels[hover]}</div>
          {series.map((s, si) => (
            <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 7, font: '11.5px/1.6 var(--font-sans)', color: 'var(--text-body)' }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, background: s.color || PALETTE[si % PALETTE.length] }} />
              <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{s.name}</span>
              <span style={{ font: 'var(--weight-medium) 11.5px var(--font-mono)' }}>{fmt(s.data[hover])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
