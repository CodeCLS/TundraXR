const _nsD = window.TundraHealthDesignSystem_1734d4;
const { Card, Tabs, Badge, Button, Breadcrumbs, DefinitionList, Timeline, Table, EmptyState, Tooltip, Icon, NetworkGraph } = _nsD;
const _Fb = p => (
  <div style={{ padding:'10px 12px', border:'1px dashed var(--line-300)', borderRadius:'var(--radius-md)', background:'var(--paper-100)', font:'11px/1.5 var(--font-mono)', color:'var(--text-secondary)' }}>
    {p.children || p.name || 'Component unavailable in this build.'}
  </div>
);
const DeviceMessage = _nsD.DeviceMessage || _Fb;
const ToolCall = _nsD.ToolCall || _Fb;

function DeviceScreen({ device, onBack }) {
  const [tab, setTab] = React.useState('history');
  const [pinned, setPinned] = React.useState(null);
  const d = device || window.TUNDRA_DATA.devices[0];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)', maxWidth:'var(--width-content)' }}>
      <Card>
        <DefinitionList columns={4} items={[
          { label:'Manufacturer', value:d.mfr },
          { label:'Serial', value:d.serial, mono:true },
          { label:'Installed', value:d.installed, mono:true },
          { label:'Location', value:d.dept + ' · ' + d.room },
          { label:'Contract', value:d.contract },
          { label:'State', value:<Badge tone={d.tone} dot>{d.state}</Badge> },
          { label:'YTD cost', value:d.ytd, mono:true },
          { label:'Work orders', value:String(d.wo), mono:true },
        ]} />
      </Card>
      <Tabs value={tab} onChange={setTab} items={[
        { value:'ask', label:'Ask', count:96 },
        { value:'graph', label:'Connections', count:7 },
        { value:'history', label:'Service history', count:d.wo },
        { value:'contract', label:'Contract' },
        { value:'docs', label:'Documents' },
        { value:'disposition', label:'Repair vs replace' },
      ]} />
      {tab === 'ask' && (
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 320px', gap:'var(--space-5)', alignItems:'start' }}>
          <Card title="Ask this device" meta="Answers cite the manual and its own history">
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
              <DeviceMessage speaker="you">Alarming on self-test. What do I check first?</DeviceMessage>
              <DeviceMessage name={d.name} tag={d.id} citations={['Manual §4.2','WO-88412','WO-71120']} confidence="0.82">
                I have thrown this alarm four times. Three were the expiratory cassette not
                seated — reseat it and re-run the self-test before anyone drives out.
              </DeviceMessage>
              <div style={{ display:'flex', alignItems:'center', gap:9, paddingTop:'var(--space-4)', borderTop:'1px solid var(--border-hairline)' }}>
                <Icon name="message-square" size={14} color="var(--text-secondary)" />
                <span style={{ flex:1, font:'12.5px/1 var(--font-sans)', color:'var(--text-muted)' }}>Ask this device…</span>
                <Button size="sm" variant="secondary" iconRight="corner-down-left">Send</Button>
              </div>
            </div>
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
            <Card title="Routine" meta="Runs on every alarm">
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <ToolCall name="tundra.device.log_event" duration="240ms" args={{ code:'ST-17' }} result="Linked to WO-88412" />
                <ToolCall name="tundra.device.analyze" duration="1.2s" args={{ window:'90d' }} result="4 events, 3 operator error" />
                <ToolCall name="tundra.personnel.draft_email" status="running" args={{ to:'radiology-leads' }} />
              </div>
            </Card>
          </div>
        </div>
      )}
      {tab === 'graph' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)' }}>
          <Card title="Device graph" meta="Every record Tundra resolved onto this device — click a node to isolate it"
            actions={<Button size="sm" variant="ghost" iconLeft="maximize-2">Expand</Button>}>
            <NetworkGraph
              nodes={window.TUNDRA_DATA.graph.nodes} edges={window.TUNDRA_DATA.graph.edges}
              rootId="dev" width={1000}
              selected={pinned} onSelect={n => setPinned(p => p === n.id ? null : n.id)} />
          </Card>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)', alignItems:'start' }}>
            <Card title="If this device goes down" meta="Traced through the graph">
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
                {[
                  { icon:'door-closed', k:'2 rooms blocked', v:'Radiology 2B and the shared prep bay share the injector line.' },
                  { icon:'calendar-x', k:'38 scans/day rerouted', v:'Outpatient CT list has no second scanner on site.' },
                  { icon:'clock', k:'4h contract response', v:'Breached twice in the last 12 months.' },
                ].map(r => (
                  <div key={r.k} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <Icon name={r.icon} size={15} color="var(--rust-500)" style={{ marginTop:2 }} />
                    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                      <span style={{ font:'var(--weight-medium) var(--text-body-sm)/1.35 var(--font-sans)', color:'var(--text-display)' }}>{r.k}</span>
                      <span style={{ font:'var(--weight-regular) var(--text-caption)/1.5 var(--font-sans)', color:'var(--text-secondary)' }}>{r.v}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Provenance" meta="Nodes by source system" padded={false}>
              <Table dense columns={[
                { key:'src', header:'Source', muted:true },
                { key:'n', header:'Nodes', mono:true, align:'right', width:70 },
              ]} rows={[
                { src:'CMMS', n:'4' }, { src:'AP invoices', n:'2' },
                { src:'Contract PDFs', n:'2' }, { src:'Scheduling', n:'1' }, { src:'Inferred', n:'1' },
              ]} />
            </Card>
          </div>
        </div>
      )}
      {tab === 'history' && (
        <Card title="Unified history" meta="Merged from 4 source systems — every event keeps its provenance">
          <Timeline events={window.TUNDRA_DATA.events} />
        </Card>
      )}
      {tab === 'contract' && (
        <Card padded={false} title="Coverage" meta="Full service · Siemens Healthineers · expires 30 Jun 2027">
          <Table columns={[
            { key:'k', header:'Clause' }, { key:'v', header:'Terms' },
            { key:'s', header:'Observed', render: r => <Badge tone={r.tone} dot>{r.s}</Badge> },
          ]} rows={[
            { k:'Response time', v:'4 business hours', s:'2 breaches in 12 mo', tone:'warn' },
            { k:'Uptime commitment', v:'97%', s:'98.4%', tone:'ok' },
            { k:'Parts coverage', v:'All, excl. consumables', s:'1 disputed invoice', tone:'warn' },
            { k:'PM cadence', v:'2× annually', s:'On schedule', tone:'ok' },
          ]} />
        </Card>
      )}
      {tab === 'docs' && (
        <Card padded={false}>
          <EmptyState icon="file-search" title="No service manual on file"
            description="Tundra can draft one from 3 service bulletins, 42 work orders and the vendor PM checklist."
            action={<Button variant="accent" size="sm" iconLeft="sparkles">Generate manual</Button>} />
        </Card>
      )}
      {tab === 'disposition' && (
        <Card title="Repair vs replace" meta="Modelled on full device history" actions={<Tooltip label="Derived from 42 work orders and 6 invoices"><Icon name="info" size={14} color="var(--text-muted)" /></Tooltip>}>
          <Table columns={[
            { key:'k', header:'' }, { key:'repair', header:'Repair', align:'right', mono:true }, { key:'replace', header:'Replace', align:'right', mono:true },
          ]} rows={[
            { k:'5-year cost of ownership', repair:'$214,800', replace:'$189,400' },
            { k:'Expected downtime', repair:'6 days', replace:'21 days' },
            { k:'Remaining useful life', repair:'2.4 yrs', replace:'10 yrs' },
          ]} />
          <div style={{ marginTop:'var(--space-4)', display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'var(--surface-accent-soft)', borderRadius:'var(--radius-md)' }}>
            <Icon name="sparkles" size={15} color="var(--cobalt-700)" />
            <span style={{ font:'var(--weight-regular) var(--text-body-sm)/1.5 var(--font-sans)', color:'var(--cobalt-900)' }}>Replace at next capital cycle. Repair cost crosses 60% of replacement value in Q3.</span>
          </div>
        </Card>
      )}
    </div>
  );
}
Object.assign(window, { DeviceScreen });
