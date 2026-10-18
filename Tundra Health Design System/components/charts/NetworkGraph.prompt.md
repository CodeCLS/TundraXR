One-line: The device graph as a node-editor canvas — source records on the left, the device resolved in the middle, exposure and claims on the right; use it wherever the product's "everything is connected" claim needs to be shown rather than asserted.

```jsx
<NetworkGraph
  rootId="dev"
  selected={pinned}
  onSelect={n => setPinned(p => p === n.id ? null : n.id)}
  nodes={[
    { id:'ct', col:0, type:'contract', label:'Service contract', badge:'2 breaches',
      rows:[{ id:'sla', label:'Availability', value:'96.0%', pill:true },
            { id:'resp', label:'Response', value:'4 h', pill:true }] },
    { id:'dev', col:1, type:'device', label:'Somatom X.cite CT',
      rows:[{ id:'tag', label:'Asset tag', value:'AST-441902' },
            { id:'avail', label:'Availability', value:'93.4%', tone:'down' }] },
    { id:'risk', col:2, type:'risk', label:'Exposure',
      rows:[{ id:'r1', label:'Rooms blocked', value:'2', tone:'down' }],
      footer:{ label:'If down > 4h', value:'$61,400', tone:'down' } },
  ]}
  edges={[
    { from:'ct', to:'dev', fromRow:'sla', toRow:'avail' },
    { from:'dev', to:'risk', toRow:'r1', tone:'risk' },
  ]}
/>
```

Nodes are **node-editor cards**: a titlebar (type glyph, name, optional uppercase badge, minimise dash), then labelled rows, then an optional footer strip. Edges attach to a specific row via `fromRow`/`toRow`, and a coloured port is drawn on the card edge exactly where the cable lands — so a reader can see *which field* the connection feeds.

Layout is layered left-to-right: `col` sets the column explicitly, otherwise it is BFS depth from the root. Signal flows one way — put source systems in column 0, the device in 1, consequences in 2. Stacked siblings connect bottom-to-top instead of bowing outside the canvas. Deterministic, no physics, no animation loop; the canvas grows to fit the graph and scales to its container via a measured (not container-query) scale.

Use `tone:'risk'` for a blocking path — it stays rust even when dimmed. Use `dashed` for a relationship Tundra inferred rather than read from a source system. Keep a view under ~8 cards.
