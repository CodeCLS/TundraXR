One-line: Immediate on/off for a setting that takes effect without a save step.

```jsx
<Switch checked={on} onChange={e => setOn(e.target.checked)} label="Auto-triage inbound calls" description="Agent drafts a first response within 60s." />
```

If the change needs a Save button, use a Checkbox instead.
