One-line: The device's life story — work orders, PMs, parts and contract events on one thread.

```jsx
<Timeline events={[
  { title:'Corrective repair', date:'14 Feb 2026', tone:'down', icon:'wrench', description:'Gantry drive belt replaced.', source:'CMMS · WO-88412' },
  { title:'PM completed', date:'02 Jan 2026', tone:'ok', icon:'check' },
]} />
```

Always populate `source` when the event came from an ingested system — provenance is a brand rule, not a nicety.
