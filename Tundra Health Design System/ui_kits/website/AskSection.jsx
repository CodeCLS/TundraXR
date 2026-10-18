const _ns = window.TundraHealthDesignSystem_1734d4;
const { Card, Badge, Icon, Button } = _ns;
/* Defaults keep the page alive if the bundle predates the agent group. */
const DeviceMessage = _ns.DeviceMessage || (p => <window.DSFallback>{p.children}</window.DSFallback>);
const ToolCall = _ns.ToolCall || (p => <window.DSFallback>{p.name}</window.DSFallback>);

function AskSection() {
  return (
    <section style={{ padding:'var(--space-16) var(--gutter-page-lg) var(--space-20)', borderTop:'1px solid var(--border-hairline)' }}>
      <div style={{ maxWidth:'var(--width-content)', margin:'0 auto', display:'flex', flexDirection:'column', gap:'var(--space-8)' }}>
        <SectionMarker n={2} total={5} label="The device answers" />
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 320px', gap:'var(--space-10)', alignItems:'end' }}>
          <SlashHeading>Ask the machine. It has the manual and the scar tissue.</SlashHeading>
          <span style={{ font:'12.5px/1.5 var(--font-sans)', color:'var(--text-secondary)' }}>
            Every answer cites the page and the work orders behind it.
          </span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 330px', gap:'var(--space-4)', alignItems:'stretch' }}>
          <Card bodyStyle={{ display:'flex', flexDirection:'column', height:'100%' }}
            title="Somatom X.cite CT" meta="AST-441902 · Radiology 2B"
            actions={<Badge tone="down" dot>Alarming</Badge>}>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)', flex:1 }}>
              <DeviceMessage speaker="you">Alarming on self-test. What do I check first?</DeviceMessage>
              <DeviceMessage name="Somatom X.cite CT" tag="AST-441902"
                citations={['Manual §4.2','WO-88412','WO-71120']} confidence="0.82">
                I have thrown this alarm four times. Three were the expiratory cassette not
                seated — reseat it and re-run the self-test before anyone drives out.
              </DeviceMessage>
              <DeviceMessage speaker="you">And if that doesn't clear it?</DeviceMessage>
              <DeviceMessage name="Somatom X.cite CT" tag="AST-441902"
                citations={['Manual §4.6','Bulletin SB-2024-11']} confidence="0.74">
                Then it is the gantry drive belt. I had it replaced in February; the bulletin
                revised its tension spec, so the torque figure in your printed copy is stale.
              </DeviceMessage>
              <div style={{ marginTop:'auto', display:'flex', alignItems:'center', gap:9, paddingTop:'var(--space-4)', borderTop:'1px solid var(--border-hairline)' }}>
                <Icon name="message-square" size={14} color="var(--text-secondary)" />
                <span style={{ flex:1, font:'12.5px/1 var(--font-sans)', color:'var(--text-muted)' }}>Ask this device…</span>
                <Button size="sm" variant="secondary" iconRight="corner-down-left">Send</Button>
              </div>
            </div>
          </Card>

          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
            <Card title="No manual on file?" bodyStyle={{ display:'flex' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <span style={{ font:'13px/1.55 var(--font-sans)', color:'var(--text-secondary)' }}>
                  Roughly a third of a fleet never shipped documentation. Tundra drafts one from
                  service bulletins, prior work orders and the vendor's own PM checklist.
                </span>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, padding:'10px 11px', background:'var(--cobalt-050)', border:'1px solid var(--cobalt-200)', borderRadius:'var(--radius-md)' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:7, font:'12px/1 var(--font-sans)', color:'var(--cobalt-900)' }}>
                    <Icon name="file-text" size={13} color="var(--cobalt-700)" /> Manual generated
                  </span>
                  <span style={{ font:'var(--weight-medium) 11.5px/1 var(--font-mono)', color:'var(--cobalt-900)' }}>12 pp</span>
                </div>
              </div>
            </Card>
            <Card title="What it called" meta="Every answer is auditable" bodyStyle={{ flex:1 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <ToolCall name="tundra.manual.lookup" duration="180ms" args={{ section:'4.2' }} result="Alarm 17 · cassette seating" />
                <ToolCall name="tundra.device.history" duration="240ms" args={{ code:'ST-17' }} result="4 prior events, 3 closed at triage" />
                <ToolCall name="tundra.bulletin.diff" duration="310ms" args={{ id:'SB-2024-11' }} result="Torque spec revised" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { AskSection });
