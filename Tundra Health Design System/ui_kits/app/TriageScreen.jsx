const { Card, Badge, Button, Table, Icon, Textarea, Toast } = window.TundraHealthDesignSystem_1734d4;

function TriageScreen({ onOpenDevice }) {
  const [sent, setSent] = React.useState(false);
  const ref = React.useRef(null);
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 1040));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const call = window.TUNDRA_DATA.inbox[0];
  return (
    <div ref={ref} style={{ display:'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(520px,1fr) minmax(340px,420px)', gap:'var(--space-5)', alignItems:'start', maxWidth:'var(--width-content)' }}>
      <Card padded={false} title="Open calls" meta="Routed from the service desk">
        <Table columns={[
          { key:'id', header:'Call', mono:true, width:100 },
          { key:'title', header:'Reported issue', wrap:true },
          { key:'device', header:'Device', mono:true, width:110 },
          { key:'verdict', header:'Tundra verdict', render: r => <Badge tone={r.tone === 'down' ? 'info' : 'neutral'}>{r.verdict}</Badge> },
          { key:'age', header:'Age', mono:true, align:'right', width:80 },
        ]} rows={window.TUNDRA_DATA.inbox} onRowClick={() => {}} />
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
        <Card title={call.id} meta={call.title + ' · ' + call.dept}
          actions={<Button size="sm" variant="ghost" iconRight="arrow-up-right" onClick={onOpenDevice}>Device</Button>}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'12px 13px', background:'var(--surface-accent-soft)', borderRadius:'var(--radius-md)' }}>
              <Icon name="sparkles" size={15} color="var(--cobalt-700)" style={{ marginTop:2 }} />
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <span style={{ font:'var(--weight-medium) var(--text-body-sm)/1.4 var(--font-sans)', color:'var(--cobalt-900)' }}>Likely operator error · confidence {call.conf}</span>
                <span style={{ font:'var(--weight-regular) var(--text-caption)/1.55 var(--font-sans)', color:'var(--cobalt-900)', opacity:.85 }}>Self-test alarm 17 matches the expiratory cassette seating fault. Four prior calls on this model closed without a part. Ask the operator to reseat the cassette and re-run the self-test.</span>
                <span style={{ font:'var(--weight-regular) var(--text-mono-sm)/1.4 var(--font-mono)', color:'var(--cobalt-700)' }}>Manual §4.2 · WO-71120 · WO-64887</span>
              </div>
            </div>
            <Textarea label="Response to the requester" rows={3} defaultValue="Before we dispatch: please reseat the expiratory cassette and re-run the self-test, then reply with the result." />
            <div style={{ display:'flex', gap:8 }}>
              <Button variant="primary" iconLeft="send" onClick={() => setSent(true)}>Send and hold call</Button>
              <Button variant="secondary">Dispatch tech</Button>
            </div>
          </div>
        </Card>
        {sent && <Toast tone="ok" title="Response sent" description="Call held for 2 hours pending operator reply." onDismiss={() => setSent(false)} style={{ width:'100%' }} />}
      </div>
    </div>
  );
}
Object.assign(window, { TriageScreen });
