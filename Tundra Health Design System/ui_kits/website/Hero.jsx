const { Surface, Button, Badge, Tag, Card, StatTile, Sparkline } = window.TundraHealthDesignSystem_1734d4;

const VENDORS = [
  { v:'Siemens Healthineers', promised:'96.0%', actual:'93.4%', owed:'$184,200', tone:'down', trend:[96,95,94,93,94,92,93,93] },
  { v:'Philips', promised:'95.0%', actual:'95.8%', owed:'—', tone:'ok', trend:[94,95,96,95,96,96,95,96] },
  { v:'Getinge', promised:'92.0%', actual:'88.1%', owed:'$96,400', tone:'down', trend:[91,90,89,88,87,88,89,88] },
  { v:'Steris', promised:'90.0%', actual:'90.4%', owed:'—', tone:'ok', trend:[90,89,91,90,91,90,90,91] },
];

function Hero() {
  return (
    <Surface tone="paper" style={{ padding:'var(--space-20) var(--gutter-page-lg) var(--space-16)' }}>
      <div style={{ maxWidth:'var(--width-content)', margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'var(--space-5)' }}>
        <Badge tone="brand">An intelligence layer for medical equipment</Badge>
        <h1 style={{ maxWidth:940, font:'var(--weight-regular) var(--text-display-1)/var(--lh-display-1) var(--font-sans)', letterSpacing:'var(--ls-display-1)', color:'var(--text-display)' }}>
          Every machine, finally able to answer
        </h1>
        <p style={{ maxWidth:640, font:'var(--weight-regular) var(--text-body-lg)/var(--lh-body-lg) var(--font-sans)', color:'var(--text-secondary)' }}>
          A device's whole life is already written down — work orders, repair logs, contracts,
          invoices, vendor email — just never in one place. Tundra resolves it into a
          device-centric graph, so the asset itself becomes the thing you query, hold vendors
          against, and make decisions from.
        </p>
        <div style={{ display:'flex', gap:'var(--space-2)', marginTop:'var(--space-1)' }}>
          <Button size="lg" variant="primary">Ask your fleet a question</Button>
          <Button size="lg" variant="secondary" iconRight="arrow-right">See the platform</Button>
        </div>
      </div>

      <div style={{ maxWidth:'var(--width-content)', margin:'var(--space-12) auto 0' }}>
        <Card padded={false} style={{ overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px var(--space-5)', borderBottom:'1px solid var(--border-hairline)', background:'var(--surface-header)' }}>
            <span style={{ font:'var(--weight-medium) 10.5px/1 var(--font-sans)', letterSpacing:'.085em', textTransform:'uppercase', color:'var(--text-secondary)' }}>Fleet position</span>
            <span style={{ font:'11px/1 var(--font-mono)', color:'var(--text-secondary)' }}>Riverbend Medical · 6,412 devices · FY26</span>
            <Badge tone="ok" dot style={{ marginLeft:'auto' }}>Live</Badge>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderBottom:'1px solid var(--border-hairline)' }}>
            {[
              { label:'Book value under management', value:'$412M', hint:'6,412 devices' },
              { label:'Penalties recovered', value:'$280,600', delta:'FY26', dir:'up', tone:'ok' },
              { label:'Availability owed vs delivered', value:'−2.4', unit:'pts', delta:'2 vendors', dir:'down', tone:'down' },
              { label:'True cost per device-year', value:'$1,840', hint:'measured, not quoted' },
            ].map((s, i) => (
              <StatTile key={s.label} bare size="sm" label={s.label} value={s.value} unit={s.unit}
                delta={s.delta} deltaDirection={s.dir} deltaTone={s.tone} hint={s.hint}
                style={{ padding:'var(--space-5)', borderLeft: i ? '1px solid var(--border-hairline)' : 'none' }} />
            ))}
          </div>
          <div style={{ padding:'var(--space-5) var(--space-6)' }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:'var(--space-4)' }}>
              <span style={{ font:'var(--weight-medium) 10.5px/1 var(--font-sans)', letterSpacing:'.085em', textTransform:'uppercase', color:'var(--text-secondary)' }}>Counterparty performance</span>
              <span style={{ font:'11px/1 var(--font-mono)', color:'var(--text-secondary)' }}>Guarantee vs measured availability · 8 quarters</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1.4fr 90px 90px 110px 96px', gap:'0 var(--space-4)', alignItems:'center' }}>
              {['Vendor','Promised','Delivered','Penalty owed',''].map((h, i) => (
                <span key={h + i} style={{ font:'var(--weight-medium) 10px/1 var(--font-sans)', letterSpacing:'.085em', textTransform:'uppercase', color:'var(--text-secondary)', textAlign: i > 0 && i < 4 ? 'right' : 'left', paddingBottom:8 }}>{h}</span>
              ))}
              {VENDORS.map(r => (
                <React.Fragment key={r.v}>
                  <span style={{ font:'13px/1 var(--font-sans)', color:'var(--text-body)', padding:'11px 0', borderTop:'1px solid var(--border-hairline)' }}>{r.v}</span>
                  <span style={{ font:'12px/1 var(--font-mono)', color:'var(--text-secondary)', textAlign:'right', padding:'11px 0', borderTop:'1px solid var(--border-hairline)' }}>{r.promised}</span>
                  <span style={{ font:'var(--weight-medium) 12px/1 var(--font-mono)', color: r.tone === 'down' ? 'var(--status-down-fg)' : 'var(--status-ok-fg)', textAlign:'right', padding:'11px 0', borderTop:'1px solid var(--border-hairline)' }}>{r.actual}</span>
                  <span style={{ font:'var(--weight-medium) 12px/1 var(--font-mono)', color: r.owed === '—' ? 'var(--text-secondary)' : 'var(--text-display)', textAlign:'right', padding:'11px 0', borderTop:'1px solid var(--border-hairline)' }}>{r.owed}</span>
                  <span style={{ padding:'8px 0 8px var(--space-4)', borderTop:'1px solid var(--border-hairline)' }}>
                    <Sparkline data={r.trend} width={80} height={20} color={r.tone === 'down' ? 'var(--rust-500)' : 'var(--moss-500)'} />
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>
        <div style={{ display:'flex', gap:'var(--space-2)', marginTop:'var(--space-5)', flexWrap:'wrap', justifyContent:'center' }}>
          {['CMMS','Procurement','Finance / AP','Service contracts','Vendor email','MCP'].map(s => <Tag key={s} mono>{s}</Tag>)}
        </div>
      </div>
    </Surface>
  );
}
Object.assign(window, { Hero });
