import React from 'react';

export function Surface({ children, tone = 'paper', dots = true, grain = true, dotGap, style, ...rest }) {
  const inverse = tone === 'ink';
  const bg = inverse ? 'var(--surface-contrast)' : tone === 'cream' ? 'var(--cream-surface)' : 'var(--bg-page)';
  const dotColor = inverse ? 'var(--pattern-dots-inverse)' : tone === 'cream' ? 'var(--pattern-dots-soft)' : 'var(--pattern-dots)';
  return (
    <div style={{ position: 'relative', background: bg, color: inverse ? 'var(--cream-100)' : 'var(--text-body)', overflow: 'hidden', ...style }} {...rest}>
      {dots && (
        <span aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: dotColor,
          backgroundSize: `${dotGap || 'var(--dot-gap)'} ${dotGap || 'var(--dot-gap)'}`,
          maskImage: 'radial-gradient(ellipse at 50% 30%,#000 20%,transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%,#000 20%,transparent 78%)',
        }} />
      )}
      {grain && (
        <span aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'var(--grain-url)',
          opacity: inverse ? 0.5 : 'var(--grain-opacity)',
          mixBlendMode: inverse ? 'overlay' : 'multiply',
        }} />
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}
