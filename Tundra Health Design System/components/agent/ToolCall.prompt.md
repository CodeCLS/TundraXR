One-line: Shows a single Tundra tool invocation — the unit of an agent's audit trail; use it anywhere the product needs to prove what the agent actually did.

```jsx
<ToolCall name="tundra.device.log_event" duration="240ms"
  args={{ asset:'AST-441902', type:'alarm', code:'SELF-TEST-17' }}
  result="Event written · linked to WO-88412" />
<ToolCall name="tundra.manual.lookup" status="running" args={{ section:'4.2' }} />
```

Tool names are dotted and lowercase — they are a real API surface, not a label, so the component **wraps** long names rather than ellipsising them: a truncated tool name is a broken identifier. Always give a `result`: an unexplained call is the opposite of provenance. Stack several in a column to show a routine executing.
