import React from 'react';
import { GLYPHS } from './lucide-glyphs.js';

/* Tundra uses Lucide (1.5px stroke) as its icon set. Glyphs are VENDORED in
   lucide-glyphs.js rather than fetched from a CDN — a network round trip per
   icon means blank icons wherever the page is published offline or bundled as a
   self-contained file. */

export function Icon({ name, size = 16, strokeWidth = 1.5, color = 'currentColor', style, ...rest }) {
  const markup = GLYPHS[name];
  if (!markup && name) console.warn('[Tundra Icon] no vendored glyph named "' + name + '" — add it to components/core/lucide-glyphs.js');
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      style={{ flex: '0 0 auto', display: 'block', ...style }}
      dangerouslySetInnerHTML={{ __html: markup || '' }}
      {...rest}
    />
  );
}
