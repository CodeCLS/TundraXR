const { Card, Table, Badge, Button, StatTile, Dialog } = window.TundraHealthDesignSystem_1734d4;

function ContractsScreen() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)', maxWidth:'var(--width-content)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-3)' }}>
        <StatTile label="Annual contract spend" value="$850,700" hint="4 vendors" />
        <StatTile label="Verified SLA breaches" value="8" hint="rolling 12 months" deltaTone="down" deltaDirection="up" delta="3" />
        <StatTile label="Recoverable" value="$61,400" delta="18.4%" deltaDirection="up" deltaTone="ok" hint="billed against covered work" />
      </div>
      <Card padded={false} title="Service contracts" meta="Terms parsed from PDFs, checked against real maintenance records"
        actions={<Button size="sm" variant="secondary" iconLeft="upload">Add contract</Button>}>
        <Table onRowClick={() => setOpen(true)} columns={[
          { key:'vendor', header:'Vendor' },
          { key:'type', header:'Type', muted:true },
          { key:'devices', header:'Devices', mono:true, align:'right', width:80 },
          { key:'annual', header:'Annual', mono:true, align:'right', width:110 },
          { key:'sla', header:'SLA', muted:true },
          { key:'health', header:'Observed', render: r => <Badge tone={r.tone} dot>{r.health}</Badge> },
          { key:'ends', header:'Ends', mono:true, align:'right', width:110 },
        ]} rows={window.TUNDRA_DATA.contracts} />
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} width={520}
        title="Dispute 2 covered call-outs?"
        description="Tundra matched two invoices to work already covered under the full-service clause. Disputing drafts a vendor email with the work order references attached."
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => setOpen(false)}>Draft dispute</Button></>} />
    </div>
  );
}
Object.assign(window, { ContractsScreen });
