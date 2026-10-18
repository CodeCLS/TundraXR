const { Card, StatTile, LineChart, BarChart, DonutChart, DotMatrix, ProgressBar, Sparkline, Table, Badge, Button, Tabs } = window.TundraHealthDesignSystem_1734d4;

const MONTHS = ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'];
const SPEND = [38,41,37,44,49,46,52,48,55,51,58,54];
const OOP   = [12,15,11,18,14,19,13,16,12,15,10,9];
const CALLS = [64,71,66,80,77,84,79,88,92,86,95,91];
const PRIOR = [44,46,43,48,52,50,55,53,58,56,60,58];

function AnalyticsScreen() {
  const [range, setRange] = React.useState('12m');
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)', maxWidth:'var(--width-content)' }}>
      <Tabs value={range} onChange={setRange} items={[{value:'30d',label:'30 days'},{value:'90d',label:'90 days'},{value:'12m',label:'12 months'},{value:'fy',label:'Fiscal year'}]} />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:'var(--surface-card)', border:'1px solid var(--border-hairline)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
        {[
          { label:'Maintenance spend', value:'$54k', delta:'6.1%', dir:'up', tone:'down', hint:'this month', chart:<Sparkline data={SPEND} width={150} height={24} /> },
          { label:'Out of contract', value:'$9k', delta:'18%', dir:'down', tone:'ok', hint:'recoverable $61k', chart:<Sparkline data={OOP} width={150} height={24} color="var(--rust-500)" /> },
          { label:'Calls triaged', value:'91', delta:'7%', dir:'up', tone:'ok', hint:'57% closed at triage', chart:<Sparkline data={CALLS} width={150} height={24} color="var(--cobalt-500)" /> },
          { label:'PM completion', value:'82', unit:'%', hint:'41 of 50 due', chart:<ProgressBar value={82} tone="ok" height={5} style={{ marginTop:6 }} /> },
        ].map((s, i) => (
          <StatTile key={s.label} bare label={s.label} value={s.value} unit={s.unit} delta={s.delta} deltaDirection={s.dir} deltaTone={s.tone} hint={s.hint} chart={s.chart}
            style={{ padding:'var(--space-4) var(--space-5)', borderLeft: i ? '1px solid var(--border-hairline)' : 'none' }} />
        ))}
      </div>

      <Card title="Maintenance spend" meta="Contract vs. out-of-contract, $000s · sourced from AP invoices"
        actions={<Button size="sm" variant="ghost" iconLeft="download">Export</Button>}>
        <LineChart height={210} labels={MONTHS} markers reference={45} referenceLabel="Budget" valueFormat={v => '$' + Math.round(v) + 'k'}
          series={[{ name:'Contract', data:SPEND }, { name:'Out of contract', data:OOP, color:'var(--rust-500)' }, { name:'Prior year', data:PRIOR, color:'var(--ink-400)', dashed:true }]} />
      </Card>

      <Card title="Repair calls by month" meta="Volume against the 12-month median">
        <DotMatrix rows={14} valueFormat={v => v + ' calls'} data={MONTHS.map((m, i) => ({ label:m, value:CALLS[i] }))} />
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'var(--space-4)' }}>
        <Card title="Spend by vendor" meta="Rolling 12 months">
          <BarChart horizontal valueFormat={v => '$' + Math.round(v/1000) + 'k'} data={[
            { label:'Siemens Healthineers', value:412000 },
            { label:'Philips', value:288500 },
            { label:'Getinge', value:96200 },
            { label:'Steris', value:71400 },
            { label:'BD', value:54000 },
          ]} />
        </Card>
        <Card title="Fleet state">
          <DonutChart size={124} centerValue="6,412" centerLabel="devices" data={[
            { label:'In service', value:5880, color:'var(--moss-500)' },
            { label:'PM overdue', value:412, color:'var(--amber-500)' },
            { label:'Down', value:120, color:'var(--rust-500)' },
          ]} />
        </Card>
      </div>

      <Card padded={false} title="SLA attainment by vendor" meta="Observed against parsed contract terms">
        <Table dense columns={[
          { key:'vendor', header:'Vendor' },
          { key:'sla', header:'Committed', muted:true },
          { key:'bar', header:'Attainment', width:220, render: r => <ProgressBar value={r.pct} tone={r.pct > 95 ? 'ok' : r.pct > 88 ? 'warn' : 'down'} height={6} /> },
          { key:'pct', header:'', mono:true, align:'right', width:60, render: r => r.pct + '%' },
          { key:'breach', header:'Breaches', render: r => <Badge tone={r.tone} dot>{r.breach}</Badge> },
        ]} rows={[
          { vendor:'Philips', sla:'Next business day', pct:98, breach:'None', tone:'ok' },
          { vendor:'Siemens Healthineers', sla:'4h response', pct:91, breach:'2 in 12 mo', tone:'warn' },
          { vendor:'Getinge', sla:'8h response', pct:84, breach:'6 in 12 mo', tone:'down' },
        ]} />
      </Card>
    </div>
  );
}
Object.assign(window, { AnalyticsScreen });
