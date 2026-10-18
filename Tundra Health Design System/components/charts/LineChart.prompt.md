One-line: Trend over time — maintenance spend, downtime hours, call volume — with a crosshair tooltip.

```jsx
<LineChart height={220} labels={months}
  series={[{ name:'Contract spend', data:spend }, { name:'Out-of-contract', data:oop, color:'var(--rust-500)' }]}
  valueFormat={v => '$' + Math.round(v/1000) + 'k'} />
```

Two series maximum in the product; three only in reports. Add `dashed: true` to a series for the prior-period comparison. Gridlines are dashed hairlines, axis labels mono 10px, and lines draw in over 900ms on mount.
