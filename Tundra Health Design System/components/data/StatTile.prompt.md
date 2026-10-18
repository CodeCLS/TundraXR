One-line: A single headline number for dashboards and marketing proof points.

```jsx
<StatTile label="Contract spend saved" value="18.4" unit="%" delta="4.2%" deltaDirection="up" deltaTone="ok" hint="vs. last FY" />
```

`deltaTone` sets the colour (is this good or bad?), `deltaDirection` sets the arrow (which way did it move?) — they are independent. The value is set large and REGULAR weight (never bold) with -.03em tracking; the label above is the uppercase micro-label. Use `bare` inside a hairline-divided stat strip. Numbers are tabular. Never stack more than four tiles in a row.
