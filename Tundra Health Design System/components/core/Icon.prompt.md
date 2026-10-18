One-line: Renders a Lucide glyph at Tundra's 1.5px stroke weight; use it anywhere an icon is needed instead of inlining SVG paths.

```jsx
<Icon name="wrench" size={16} />
<Icon name="chevron-right" size={14} color="var(--text-muted)" />
```

Notes: names are Lucide kebab-case. Sizes in practice are 14 (dense tables), 16 (default UI), 20 (nav), 24 (feature). Never change strokeWidth above 2 — the brand reads thin.

**Glyphs are vendored**, not fetched. `components/core/lucide-glyphs.js` holds the inner
markup for every icon the system uses (Lucide 0.446.0, ISC). Rendering is synchronous, works
offline, and survives being bundled into a single self-contained file. Introducing a new icon
means adding its entry to that file — never point `Icon` back at a CDN.
