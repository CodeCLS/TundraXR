One-line: Modal for a decision that must be made before continuing — confirmations, short forms.

```jsx
<Dialog open={open} onClose={close} title="Flag as operator error?"
  description="This closes the call and notifies the requesting department."
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button variant="primary">Flag and close</Button></>} />
```
