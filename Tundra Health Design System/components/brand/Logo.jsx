import React from 'react';

/* assets/tundra-mark.svg, inlined so the mark can be masked to currentColor. */
const MARK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='241' height='160' viewBox='0 0 241 160'%3E%3Cpath d='M13 153.978L235.182 154.361' stroke='%23000' stroke-width='10' stroke-linecap='round'/%3E%3Cpath d='M63.7491 105.417C65.7128 108.341 70.003 108.372 72.0092 105.477L141.011 5.92177C142.998 3.05478 147.236 3.05231 149.226 5.91699L235.544 130.147C237.847 133.462 235.475 138 231.437 138H9.34023C5.34723 138 2.96517 133.55 5.1794 130.227L38.5029 80.2193C40.4776 77.2561 44.8289 77.2481 46.8144 80.2041L63.7491 105.417Z' fill='%23000'/%3E%3C/svg%3E";

/* The mark is the supplied Tundra ridge glyph. The wordmark is the brand name
   set in Geist Medium — no bespoke lettering exists in the supplied assets. */
export function Logo({ size = 22, color = 'var(--ink-900)', wordmark = true, style, ...rest }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.42, color, ...style }} {...rest}>
      <span
        aria-hidden="true"
        style={{
          display: 'block', width: size * 1.5, height: size,
          background: 'currentColor',
          WebkitMaskImage: `url("${MARK}")`, maskImage: `url("${MARK}")`,
          WebkitMaskSize: 'contain', maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center', maskPosition: 'center',
        }}
      />
      {wordmark && (
        <span style={{ font: `var(--weight-medium) ${size * 0.86}px/1 var(--font-sans)`, letterSpacing: '-.03em' }}>Tundra</span>
      )}
    </span>
  );
}
