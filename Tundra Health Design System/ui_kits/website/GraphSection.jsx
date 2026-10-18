const { Card, Table, Badge, NetworkGraph, Icon } = window.TundraHealthDesignSystem_1734d4;

const NODES = [
  { id:'wo',  col:0, order:0, type:'record', label:'Work orders', rows:[{id:'a',label:'WO-88412',value:'6.5 h',pill:true},{id:'b',label:'WO-71120',value:'2.0 h',pill:true},{id:'c',label:'+40 more',value:'214 h'}], footer:{label:'Source · CMMS',value:'42 records'} },
  { id:'inv', col:0, order:1, type:'record', label:'Invoices', rows:[{id:'a',label:'INV-55219',value:'$4,180',pill:true,tone:'down'},{id:'b',label:'INV-51884',value:'$1,940',pill:true}], footer:{label:'Source · Finance / AP',value:'$18,420'} },
  { id:'ct',  col:0, order:2, type:'contract', label:'Service contract', badge:'2 breaches', rows:[{id:'sla',label:'Availability',value:'96.0%',pill:true},{id:'resp',label:'Response',value:'4 h',pill:true},{id:'term',label:'Expires',value:'30 Jun 2027'}] },
  { id:'dev', col:1, type:'device', label:'Somatom X.cite CT', rows:[{id:'tag',label:'Asset tag',value:'AST-441902'},{id:'hist',label:'Service history',value:'42 records'},{id:'cost',label:'Cost YTD',value:'$18,420'},{id:'avail',label:'Availability',value:'93.4%',tone:'down'},{id:'site',label:'Location',value:'Radiology 2B'}] },
  { id:'room',col:2, order:0, type:'location', label:'Radiology 2B', rows:[{id:'load',label:'Throughput',value:'38 scans/day'},{id:'alt',label:'Backup scanner',value:'None',tone:'down'}] },
  { id:'risk',col:2, order:1, type:'risk', label:'Exposure', rows:[{id:'r1',label:'Rooms blocked',value:'2',tone:'down'},{id:'r2',label:'Scans at risk',value:'38/day',tone:'down'}], footer:{label:'If down > 4h',value:'$61,400',tone:'down'} },
  { id:'claim',col:2, order:2, type:'contract', label:'Penalty claim', rows:[{id:'owed',label:'Owed under §6.2',value:'$184,200'},{id:'st',label:'Status',value:'Accepted',pill:true,tone:'ok'}], footer:{label:'Filed 12 Jun 2026',value:'$184,200'} },
];
const EDGES = [
  { from:'wo', to:'dev', fromRow:'a', toRow:'hist' },
  { from:'inv', to:'dev', fromRow:'a', toRow:'cost' },
  { from:'ct', to:'dev', fromRow:'sla', toRow:'avail' },
  { from:'dev', to:'room', fromRow:'site', toRow:'load' },
  { from:'dev', to:'claim', fromRow:'avail', toRow:'owed' },
  { from:'ct', to:'claim', fromRow:'resp', toRow:'owed', dashed:true },
  { from:'room', to:'risk', fromRow:'alt', toRow:'r1', tone:'risk' },
];

const PROVENANCE = [
  { src:'CMMS', rec:'WO-88412', fact:'Corrective repair, 6.5 hrs', st:'Matched', tone:'ok' },
  { src:'Finance / AP', rec:'INV-55219', fact:'$4,180 billed', st:'Covered', tone:'ok' },
  { src:'Contract PDF', rec:'SIE-FS-2027', fact:'4h response clause', st:'Parsed', tone:'info' },
  { src:'Vendor email', rec:'RE: gantry belt', fact:'Part 08812-C lead time', st:'Linked', tone:'info' },
  { src:'OEM bulletin', rec:'SB-2024-11', fact:'Belt tension revision', st:'Applied', tone:'ok' },
];

function GraphSection() {
  const [pinned, setPinned] = React.useState(null);
  return (
    <section style={{ padding:'var(--space-16) var(--gutter-page-lg) var(--space-20)', borderTop:'1px solid var(--border-hairline)', background:'var(--surface-header)' }}>
      <div style={{ maxWidth:'var(--width-content)', margin:'0 auto', display:'flex', flexDirection:'column', gap:'var(--space-8)' }}>
        <SectionMarker n={1} total={5} label="The device graph" />
        <div style={{ display:'flex', alignItems:'flex-end' }}>
          <SlashHeading>Every record exists. None of it is connected.</SlashHeading>
        </div>
      </div>

      <div style={{ maxWidth:'var(--width-content)', margin:'var(--space-10) auto 0' }}>
        <Card padded={false} style={{ boxShadow:'var(--shadow-md)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px var(--space-5)', borderBottom:'1px solid var(--border-hairline)' }}>
            <span style={{ font:'var(--weight-medium) 13px/1.3 var(--font-sans)', color:'var(--text-display)' }}>AST-441902 · Somatom X.cite</span>
            <span style={{ font:'11px/1 var(--font-mono)', color:'var(--text-muted)' }}>7 resolved records</span>
            <Badge tone="info" style={{ marginLeft:'auto' }}>Every cable lands on the field it feeds</Badge>
          </div>
          <div style={{ padding:'var(--space-5)' }}>
            <NetworkGraph nodes={NODES} edges={EDGES} rootId="dev" width={1000} legend={false}
              selected={pinned} onSelect={n => setPinned(p => p === n.id ? null : n.id)} />
          </div>
          <div style={{ borderTop:'1px solid var(--border-hairline)', background:'var(--surface-header)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'11px var(--space-5) 0' }}>
              <Icon name="git-branch" size={13} color="var(--text-secondary)" />
              <span style={{ font:'var(--weight-medium) 10.5px/1 var(--font-sans)', letterSpacing:'.085em', textTransform:'uppercase', color:'var(--text-secondary)' }}>Where each node came from</span>
            </div>
            <Table dense columns={[
              { key:'src', header:'Source', muted:true, width:150 },
              { key:'rec', header:'Record', mono:true, width:170 },
              { key:'fact', header:'Contributes', wrap:true },
              { key:'st', header:'', align:'right', width:110, render: r => <Badge tone={r.tone} dot>{r.st}</Badge> },
            ]} rows={PROVENANCE} />
          </div>
        </Card>
      </div>
    </section>
  );
}
Object.assign(window, { GraphSection });
