const { Logo, Button } = window.TundraHealthDesignSystem_1734d4;

function SiteHeader() {
  const links = ['Platform', 'Ask a device', 'Routines', 'Contract recovery'];
  return (
    <header style={{ position:'sticky', top:0, zIndex:20, display:'flex', alignItems:'center', gap:'var(--space-8)', height:60, padding:'0 var(--gutter-page-lg)', borderBottom:'1px solid var(--border-hairline)', background:'rgba(242,241,237,.82)', backdropFilter:'blur(10px)' }}>
      <Logo size={20} />
      <nav style={{ display:'flex', alignItems:'center', gap:'var(--space-6)' }}>
        {links.map(l => (
          <a key={l} href="#" style={{ font:'var(--weight-regular) var(--text-body-sm)/1 var(--font-sans)', color:'var(--text-secondary)', borderBottom:0 }}>{l}</a>
        ))}
      </nav>
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
        <a href="#" style={{ font:'var(--weight-regular) var(--text-body-sm)/1 var(--font-sans)', color:'var(--text-secondary)', borderBottom:0 }}>Sign in</a>
        <Button size="sm" variant="primary">Audit my contracts</Button>
      </div>
    </header>
  );
}
Object.assign(window, { SiteHeader });
