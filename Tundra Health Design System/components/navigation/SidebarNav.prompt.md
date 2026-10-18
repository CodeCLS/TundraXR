One-line: The app's left rail — grouped, quiet, uppercase micro-labels over 30px rows.

```jsx
<SidebarNav value={view} onChange={setView} sections={[
  { items: [{value:'inbox',label:'Inbox',icon:'inbox',count:12},{value:'fleet',label:'Fleet',icon:'layout-grid'}] },
  { label: 'Workflows', items: [{value:'contracts',label:'Contracts',icon:'file-text'}] },
]} />
```
