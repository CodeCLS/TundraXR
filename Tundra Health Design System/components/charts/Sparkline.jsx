import React from 'react';

export function Sparkline({ data = [], width = 96, height = 28, color = 'var(--stone-600)', area = true, strokeWidth = 1.75, style, ...rest }) {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pad = strokeWidth;
  const x = i => (i / (data.length - 1 || 1)) * (width - pad * 2) + pad;
  const y = v => height - pad - ((v - min) / span) * (height - pad * 2);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
  const id = React.useId().replace(/:/g, '');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible', ...style }} {...rest}>
      {area && (
        <>
          <defs>
            <linearGradient id={'sp' + id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.24" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L${x(data.length - 1)},${height} L${x(0)},${height} Z`} fill={'url(#sp' + id + ')'} />
        </>
      )}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r={strokeWidth + 0.5} fill={color} />
    </svg>
  );
}
