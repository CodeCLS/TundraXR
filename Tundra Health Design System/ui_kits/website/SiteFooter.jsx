const { Logo, Button, Surface, Input } = window.TundraHealthDesignSystem_1734d4;

function SiteFooter() {
  const cols = [
    { h:'Platform', items:['Device graph','Ask a device','Routines & MCP','Contract recovery'] },
    { h:'Company', items:['About','Careers','Security','Contact'] },
    { h:'Resources', items:['Docs','Integrations','Methodology','Status'] },
  ];
  return (
    <>
      <Surface tone="cream" style={{ padding:'var(--space-20) var(--gutter-page-lg)', borderTop:'1px solid var(--border-hairline)' }}>
        <div style={{ maxWidth:'var(--width-narrow)', margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'var(--space-5)' }}>
          <h2 style={{ font:'var(--weight-medium) var(--text-display-2)/var(--lh-display-2) var(--font-sans)', letterSpacing:'var(--ls-display-2)', color:'var(--ink-900)' }}>Find out what your vendors already owe you</h2>
          <p style={{ font:'var(--weight-regular) var(--text-body-lg)/var(--lh-body-lg) var(--font-sans)', color:'var(--ink-700)', maxWidth:'52ch' }}>Send us a CMMS export and your service contracts. We will come back with an audited number — and we only get paid out of what we recover.</p>
          <div style={{ display:'flex', gap:'var(--space-2)', alignItems:'flex-end' }}>
            <Input size="lg" placeholder="you@hospital.org" style={{ width:280 }} />
            <Button size="lg" variant="primary">Audit my contracts</Button>
          </div>
        </div>
      </Surface>
      <footer style={{ padding:'var(--space-12) var(--gutter-page-lg)', borderTop:'1px solid var(--border-hairline)', background:'var(--bg-page)' }}>
        <div style={{ maxWidth:'var(--width-content)', margin:'0 auto', display:'grid', gridTemplateColumns:'1.4fr repeat(3,1fr)', gap:'var(--space-8)' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
            <Logo size={19} />
            <span style={{ font:'var(--weight-regular) var(--text-caption)/1.5 var(--font-sans)', color:'var(--text-muted)', maxWidth:'32ch' }}>Asset management for physical capital. Hospitals first.</span>
          </div>
          {cols.map(c => (
            <div key={c.h} style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
              <span style={{ font:'var(--weight-medium) var(--text-label)/1 var(--font-sans)', letterSpacing:'var(--ls-label)', textTransform:'uppercase', color:'var(--text-muted)' }}>{c.h}</span>
              {c.items.map(i => <a key={i} href="#" style={{ font:'var(--weight-regular) var(--text-body-sm)/1.6 var(--font-sans)', color:'var(--text-secondary)', borderBottom:0 }}>{i}</a>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth:'var(--width-content)', margin:'var(--space-10) auto 0', paddingTop:'var(--space-5)', borderTop:'1px solid var(--border-hairline)', display:'flex', justifyContent:'space-between', font:'var(--weight-regular) var(--text-caption)/1 var(--font-sans)', color:'var(--text-muted)' }}>
          <span>© 2026 Tundra</span><span>Privacy · Terms · HIPAA</span>
        </div>
      </footer>
    </>
  );
}
Object.assign(window, { SiteFooter });
