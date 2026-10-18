One-line: Switches between views of the same object — device record sections, inbox queues.

```jsx
<Tabs value={tab} onChange={setTab} items={[{value:'history',label:'Service history',count:42},{value:'contract',label:'Contract'},{value:'docs',label:'Documents',count:7}]} />
```

Counts render in mono. Never more than six tabs — move the rest behind an overflow.
