One-line: The workhorse for work orders, devices, contracts and invoices — hairline rows, uppercase micro headers, mono for anything numeric.

```jsx
<Table dense onRowClick={openDevice} columns={[
  { key:'tag', header:'Asset tag', mono: true, width: 130 },
  { key:'name', header:'Device' },
  { key:'state', header:'State', render: r => <Badge tone={r.tone} dot>{r.state}</Badge> },
  { key:'cost', header:'YTD cost', mono: true, align: 'right' },
]} rows={rows} />
```

Wrap in `<Card padded={false}>`. Never add zebra striping — hairlines carry the rhythm.
