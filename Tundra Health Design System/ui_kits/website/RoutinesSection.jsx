const _nsR = window.TundraHealthDesignSystem_1734d4;
const { Card, Badge, Icon, Button, Tag } = _nsR;
const ToolCall = _nsR.ToolCall || (p => <window.DSFallback>{p.name}</window.DSFallback>);

function RoutinesSection() {
  return (
    <section style={{ padding:'var(--space-16) var(--gutter-page-lg) var(--space-20)', borderTop:'1px solid var(--border-hairline)', background:'var(--surface-header)' }}>
      <div style={{ maxWidth:'var(--width-content)', margin:'0 auto', display:'flex', flexDirection:'column', gap:'var(--space-8)' }}>
        <SectionMarker n={3} total={5} label="Routines and integration" />
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 340px', gap:'var(--space-10)', alignItems:'end' }}>
          <SlashHeading>It lives in the software you already use</SlashHeading>
          <span style={{ font:'12.5px/1.5 var(--font-sans)', color:'var(--text-secondary)' }}>
            Tundra ships as an MCP server. Your tools call it; it reads and writes the graph.
          </span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'320px minmax(0,1fr)', gap:'var(--space-4)', alignItems:'stretch' }}>
          <Card title="Custom routine" meta="Logged from your own software" bodyStyle={{ display:'flex', flexDirection:'column', height:'100%' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:9, flex:1 }}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:2 }}>
                <Tag mono>on: alarm</Tag><Tag mono>every: 24h</Tag>
              </div>
              <ToolCall name="tundra.device.log_event" duration="240ms"
                args={{ asset:'AST-441902', type:'alarm', code:'ST-17' }}
                result="Written · linked to WO-88412" />
              <ToolCall name="tundra.device.analyze" duration="1.2s"
                args={{ window:'90d' }}
                result="Recurring · 4 events, 3 operator error" />
              <ToolCall name="tundra.personnel.draft_email" duration="620ms"
                args={{ to:'radiology-leads', about:'AST-441902' }}
                result="Draft ready for review" />
              <ToolCall name="tundra.report.append" status="queued"
                args={{ report:'monthly-htm' }} />
              <span style={{ marginTop:'auto', paddingTop:'var(--space-3)', borderTop:'1px solid var(--border-hairline)', font:'11px/1.5 var(--font-mono)', color:'var(--text-secondary)' }}>
                4 steps · no human in the loop until the draft
              </span>
            </div>
          </Card>

          <Card padded={false} bodyStyle={{ display:'flex', flexDirection:'column', height:'100%' }}
            title="The device writes to the people who know" meta="Drafted, never sent without you">
            <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
              <div style={{ display:'grid', gridTemplateColumns:'74px minmax(0,1fr)', gap:'8px 12px', padding:'var(--space-4) var(--space-5)', borderBottom:'1px solid var(--border-hairline)' }}>
                {[
                  ['To','Priya N. · Lead radiographer, 2B'],
                  ['Cc','BioMed on-call'],
                  ['Subject','AST-441902 — self-test alarm 17, four times since May'],
                ].map(([k,v]) => (
                  <React.Fragment key={k}>
                    <span style={{ font:'10.5px/1.5 var(--font-mono)', letterSpacing:'.05em', textTransform:'uppercase', color:'var(--text-secondary)' }}>{k}</span>
                    <span style={{ font:'13px/1.5 var(--font-sans)', color:'var(--text-body)' }}>{v}</span>
                  </React.Fragment>
                ))}
              </div>
              <div style={{ padding:'var(--space-5)', display:'flex', flexDirection:'column', gap:'var(--space-4)', flex:1 }}>
                <p style={{ font:'13.5px/1.65 var(--font-sans)', color:'var(--text-body)', maxWidth:'62ch' }}>
                  Hello Priya — this is the CT in 2B. I have raised self-test alarm 17 four times
                  since May, and three of those closed without a part. The pattern points at how
                  the cassette is being seated after a cleaning cycle.
                </p>
                <p style={{ font:'13.5px/1.65 var(--font-sans)', color:'var(--text-body)', maxWidth:'62ch' }}>
                  Two questions, so I can stop wasting your morning: who reseats the cassette on
                  the late shift, and has the cleaning routine changed since April? If it has, I
                  will flag it to BioMed and update my own notes.
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                  {['Manual §4.2','WO-88412','WO-71120','WO-64887'].map(c => (
                    <span key={c} style={{ padding:'2.5px 7px', borderRadius:'var(--radius-xs)', background:'var(--cobalt-050)', border:'1px solid var(--cobalt-200)', font:'10.5px/1.3 var(--font-mono)', color:'var(--cobalt-900)', whiteSpace:'nowrap' }}>{c}</span>
                  ))}
                </div>
                <div style={{ marginTop:'auto', display:'flex', alignItems:'center', gap:'var(--space-2)', paddingTop:'var(--space-4)', borderTop:'1px solid var(--border-hairline)' }}>
                  <Button size="sm" variant="primary" iconLeft="send">Send as the device</Button>
                  <Button size="sm" variant="ghost">Edit draft</Button>
                  <span style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:6, font:'11px/1 var(--font-mono)', color:'var(--text-secondary)' }}>
                    <Icon name="shield-check" size={13} color="var(--text-secondary)" /> Nothing leaves without approval
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { RoutinesSection });
