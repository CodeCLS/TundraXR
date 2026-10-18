const { Card, Table, Badge, Button, Tag, StatTile, Input } = window.TundraHealthDesignSystem_1734d4;

function FleetScreen({ onOpen }) {
  const d = window.TUNDRA_DATA.devices;
  const [q, setQ] = React.useState('');
  const rows = d.filter(r => (r.name + r.id + r.dept).toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)', maxWidth:'var(--width-content)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:'var(--surface-card)', border:'1px solid var(--border-hairline)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
        {[
          { label:'Devices tracked', value:'6,412', hint:'4 source systems' },
          { label:'Contract spend saved', value:'18.4', unit:'%', delta:'4.2%', dir:'up', tone:'ok', hint:'vs. last FY' },
          { label:'Calls closed at triage', value:'57', unit:'%', hint:'last 90 days' },
          { label:'Mean time to repair', value:'3.2', unit:'days', delta:'0.6', dir:'down', tone:'ok' },
        ].map((s, i) => (
          <StatTile key={s.label} bare label={s.label} value={s.value} unit={s.unit} delta={s.delta} deltaDirection={s.dir} deltaTone={s.tone} hint={s.hint}
            style={{ padding:'var(--space-4) var(--space-5)', borderLeft: i ? '1px solid var(--border-hairline)' : 'none' }} />
        ))}
      </div>
      <Card padded={false}
        title="Fleet"
        meta="Ingested from CMMS, AP invoices and vendor email"
        actions={<><Button size="sm" variant="ghost" iconLeft="filter">Filter</Button><Button size="sm" variant="secondary" iconLeft="download">Export</Button></>}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px var(--space-5)', borderBottom:'1px solid var(--border-hairline)' }}>
          <Input size="sm" iconLeft="search" placeholder="Search 6,412 devices…" value={q} onChange={e => setQ(e.target.value)} style={{ width:280 }} />
          <Tag onRemove={() => {}}>Site: Riverbend Main</Tag>
          <Tag onRemove={() => {}}>Status: any</Tag>
        </div>
        <Table dense onRowClick={onOpen} columns={[
          { key:'id', header:'Asset tag', mono:true, width:120 },
          { key:'name', header:'Device' },
          { key:'mfr', header:'Manufacturer', muted:true },
          { key:'dept', header:'Department', muted:true },
          { key:'state', header:'State', render: r => <Badge tone={r.tone} dot>{r.state}</Badge> },
          { key:'wo', header:'WOs', mono:true, align:'right', width:60 },
          { key:'ytd', header:'YTD cost', mono:true, align:'right', width:100 },
        ]} rows={rows} />
      </Card>
    </div>
  );
}
Object.assign(window, { FleetScreen });
