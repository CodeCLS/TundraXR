One-line: A long run of thin bars split by a labelled divider — muted before, accented after; use it when the claim is a step change and the evidence is a time series.

```jsx
<SplitBarChart
  data={series}            // 60–200 values
  split={44}               // where "after" begins
  leftLabel="Without Tundra" rightLabel="With Tundra"
  ticks={[0, 100, 200, 300, 400]}
  valueFormat={v => '$' + Math.round(v) + 'k'}
/>
```

The divider is a full-height rule with both state labels straddling it, so the comparison is legible without a legend. Hovering a bar shows its value on an ink chip. Keep the "before" side genuinely noisy and the "after" side genuinely trending — this component makes a claim, so the data behind it must be real.
