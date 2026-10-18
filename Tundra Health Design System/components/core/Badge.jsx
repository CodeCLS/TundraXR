import React from 'react';

/* Every badge carries a hairline so the chip has an edge on both the bone page
   and the lighter card — tints alone are too close in value to read. */
const TONES = {
  neutral: { bg: 'var(--paper-100)', fg: 'var(--text-secondary)', dot: 'var(--ink-400)', border: '1px solid var(--line-200)' },
  ok: { bg: 'var(--status-ok-bg)', fg: 'var(--status-ok-fg)', dot: 'var(--moss-500)', border: '1px solid rgba(91,122,99,.24)' },
  warn: { bg: 'var(--status-warn-bg)', fg: 'var(--status-warn-fg)', dot: 'var(--amber-500)', border: '1px solid rgba(168,127,60,.24)' },
  down: { bg: 'var(--status-down-bg)', fg: 'var(--status-down-fg)', dot: 'var(--rust-500)', border: '1px solid rgba(160,90,70,.24)' },
  info: { bg: 'var(--status-info-bg)', fg: 'var(--status-info-fg)', dot: 'var(--cobalt-500)', border: '1px solid rgba(93,106,140,.24)' },
  brand: { bg: 'var(--cream-surface)', fg: 'var(--ink-800)', dot: 'var(--cream-300)', border: '1px solid var(--cream-300)' },
};

export function Badge({ children, tone = 'neutral', dot = false, style, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 21, padding: '0 9px', borderRadius: 'var(--radius-pill)',
        background: t.bg, color: t.fg, border: t.border || '1px solid transparent',
        font: `var(--weight-medium) 11.5px/1 var(--font-sans)`,
        letterSpacing: '-.002em', whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, flex: '0 0 auto' }} />}
      {children}
    </span>
  );
}
