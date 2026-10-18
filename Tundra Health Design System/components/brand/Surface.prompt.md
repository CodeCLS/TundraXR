One-line: The branded background block — dotted survey grid plus paper grain; use it for heroes, section bands and empty canvases.

```jsx
<Surface tone="paper" style={{ padding: '96px 64px' }}>…</Surface>
<Surface tone="ink" dotGap="12px" style={{ padding: '80px 64px' }}>…</Surface>
```

One Surface per section maximum; never nest them. In dense app views turn `grain` off — it is a marketing and empty-state texture.
