const { Card, ProgressBar, StatTile, Table, Badge, Icon, SplitBarChart } = window.TundraHealthDesignSystem_1734d4;

/* Deterministic series: flat noise while nobody enforces, then a real climb. */
const SERIES = Array.from({ length: 96 }, (_, i) => {
  const noise = (Math.sin(i * 12.9898) * 43758.5453) % 1;
  const n = Math.abs(noise);
  if (i < 44) return 4 + n * 9;
  const t = (i - 44) / 52;
  return 8 + t * 74 + n * 22;
});

function AnalysisSection() {
  return (
    <section style={{ padding:'var(--space-16) var(--gutter-page-lg) var(--space-20)', borderTop:'1px solid var(--border-hairline)' }}>
      <div style={{ maxWidth:'var(--width-content)', margin:'0 auto', display:'flex', flexDirection:'column', gap:'var(--space-8)' }}>
        <SectionMarker n={5} total={5} label="Contract recovery" />
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 420px', gap:'var(--space-10)', alignItems:'end' }}>
          <SlashHeading>Penalties owed. Now actually collected.</SlashHeading>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
            {[
              { v:'$280,600', k:'Recovered this FY' },
              { v:'8', k:'Verified SLA breaches' },
              { v:'82%', k:'Claims settled' },
              { v:'—2.4 pts', k:'Availability shortfall' },
            ].map((s, i) => (
              <div key={s.k} style={{
                display:'flex', flexDirection:'column', gap:3, padding:'14px var(--space-4)',
                background:'var(--surface-card)',
                borderLeft: i % 2 ? '1px solid var(--border-hairline)' : 'none',
                borderTop: i > 1 ? '1px solid var(--border-hairline)' : 'none',
              }}>
                <span style={{ font:'var(--weight-medium) var(--text-title-2)/1 var(--font-sans)', letterSpacing:'var(--ls-title-2)', color:'var(--text-display)', fontVariantNumeric:'tabular-nums' }}>{s.v}</span>
                <span style={{ font:'11px/1.3 var(--font-sans)', color:'var(--text-muted)' }}>{s.k}</span>
              </div>
            ))}
          </div>
        </div>

        <SplitBarChart data={SERIES} split={44} height={210}
          leftLabel="Unenforced" rightLabel="With Tundra"
          ticks={['Q1 24','Q3 24','Q1 25','Q3 25','Q1 26','Q2 26']}
          valueFormat={v => '$' + Math.round(v) + 'k'} />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'var(--space-4)' }}>
          <Card>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <span style={{ font:'var(--weight-medium) 10.5px/1 var(--font-sans)', letterSpacing:'.085em', textTransform:'uppercase', color:'var(--text-secondary)' }}>Audit trail</span>
              {[
                { i:'file-text', k:'Clause parsed', v:'§6.2 — 96% quarterly' },
                { i:'activity', k:'Downtime measured', v:'214 h across 14 devices' },
                { i:'gavel', k:'Claim accepted', v:'$184,200 · 12 Jun 2026' },
              ].map(r => (
                <div key={r.k} style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
                  <Icon name={r.i} size={13} color="var(--cobalt-700)" style={{ marginTop:2 }} />
                  <div style={{ display:'flex', flexDirection:'column', gap:1, minWidth:0 }}>
                    <span style={{ font:'var(--weight-medium) 12.5px/1.3 var(--font-sans)', color:'var(--text-display)' }}>{r.k}</span>
                    <span style={{ font:'10.5px/1.4 var(--font-mono)', color:'var(--text-secondary)' }}>{r.v}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card padded={false} style={{ gridColumn:'span 2' }}>
            <Table dense columns={[
              { key:'vendor', header:'Counterparty' },
              { key:'sla', header:'Bought', muted:true, width:80 },
              { key:'bar', header:'Delivered', width:140, render: r => <ProgressBar value={r.pct} tone={r.pct >= r.target ? 'ok' : r.pct > r.target - 5 ? 'warn' : 'down'} height={6} /> },
              { key:'pct', header:'', mono:true, align:'right', width:48, render: r => r.pct + '%' },
              { key:'owed', header:'Owed', mono:true, align:'right', width:88 },
            ]} rows={[
              { vendor:'Philips', sla:'95%', target:95, pct:96, owed:'—' },
              { vendor:'Siemens Healthineers', sla:'96%', target:96, pct:93, owed:'$184,200' },
              { vendor:'Getinge', sla:'92%', target:92, pct:88, owed:'$96,400' },
              { vendor:'Steris', sla:'90%', target:90, pct:90, owed:'—' },
            ]} />
          </Card>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { AnalysisSection });
