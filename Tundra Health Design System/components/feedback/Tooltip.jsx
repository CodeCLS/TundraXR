import React from 'react';

export function Tooltip({ label, children, placement = 'top', style, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const pos = placement === 'bottom'
    ? { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' }
    : placement === 'left'
      ? { right: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' }
      : placement === 'right'
        ? { left: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' }
        : { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' };
  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} {...rest}>
      {children}
      {open && (
        <span role="tooltip" style={{
          position: 'absolute', zIndex: 40, ...pos,
          padding: '5px 9px', borderRadius: 'var(--radius-md)',
          background: 'var(--surface-contrast)', color: 'var(--cream-100)',
          font: 'var(--weight-regular) var(--text-caption)/1.3 var(--font-sans)',
          whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)', pointerEvents: 'none', animation: 'tundra-fade-up var(--dur-fast) var(--ease-out)',
        }}>{label}</span>
      )}
    </span>
  );
}
