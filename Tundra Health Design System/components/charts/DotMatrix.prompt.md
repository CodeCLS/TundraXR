One-line: The signature Tundra chart — columns built from small squares, so a bar chart reads as the brand's dotted survey grid.

```jsx
<DotMatrix rows={14} data={months.map((m,i) => ({ label:m, value:calls[i] }))} valueFormat={v => v + ' calls'} />
<DotMatrix rows={8} cell={4} labels={false} data={[3,5,4,8,7,9]} color="var(--cobalt-500)" />
```

Prefer this over a solid `BarChart` for time buckets — solid bars are for ranked
"top N" comparisons. Unfilled cells stay visible (`--paper-300`) so the grid reads
even where the data is low.
