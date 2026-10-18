One-line: Categorical comparison — spend by vendor, work orders by department, cost by modality.

```jsx
<BarChart horizontal valueFormat={v => '$' + v.toLocaleString()} data={[
  { label:'Siemens', value:412000 }, { label:'Philips', value:288500 },
]} />
<BarChart height={180} data={months} stacked />
```

Use `horizontal` whenever labels are words; vertical only for time buckets.
