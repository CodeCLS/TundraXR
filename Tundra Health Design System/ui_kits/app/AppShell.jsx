const { Logo, SidebarNav, IconButton, Icon, Badge } = window.TundraHealthDesignSystem_1734d4;

function AppShell({ view, setView, children, title, subtitle, actions, breadcrumb }) {
  return (
    <div style={{ display:'flex', height:'100%', background:'var(--bg-page)' }}>
      <aside style={{ width:'var(--sidebar-width)', flex:'0 0 auto', display:'flex', flexDirection:'column', gap:'var(--space-6)', padding:'14px 10px', borderRight:'1px solid var(--border-hairline)', background:'var(--surface-rail)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 6px' }}>
          <Logo size={19} />
          <IconButton icon="chevrons-left" label="Collapse" size="sm" />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7, height:30, padding:'0 8px', margin:'0 0 -8px', background:'var(--surface-card)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', boxShadow:'var(--shadow-xs)' }}>
          <Icon name="search" size={14} color="var(--text-muted)" />
          <span style={{ flex:1, font:'var(--weight-regular) var(--text-body-sm)/1 var(--font-sans)', color:'var(--text-muted)' }}>Ask or search…</span>
          <span style={{ font:'var(--weight-regular) 10px/1 var(--font-mono)', color:'var(--ink-300)' }}>⌘K</span>
        </div>
        <SidebarNav value={view} onChange={setView} sections={[
          { items:[
            { value:'inbox', label:'Triage inbox', icon:'inbox', count:3 },
            { value:'fleet', label:'Fleet', icon:'layout-grid', count:6 },
          ]},
          { label:'Workflows', items:[
            { value:'contracts', label:'Contracts & SLAs', icon:'file-text' },
            { value:'reports', label:'Analytics', icon:'chart-column' },
          ]},
          { label:'Sources', items:[
            { value:'cmms', label:'CMMS', icon:'database' },
            { value:'invoices', label:'Invoices', icon:'receipt' },
            { value:'email', label:'Vendor email', icon:'mail' },
          ]},
        ]} />
        <div style={{ marginTop:'auto', display:'flex', alignItems:'center', gap:8, padding:'8px 8px', borderTop:'1px solid var(--border-hairline)' }}>
          <span style={{ width:22, height:22, borderRadius:'50%', background:'var(--cobalt-700)', color:'var(--cream-050)', display:'inline-flex', alignItems:'center', justifyContent:'center', font:'var(--weight-medium) 10px/1 var(--font-sans)' }}>RM</span>
          <span style={{ flex:1, font:'var(--weight-regular) var(--text-caption)/1.3 var(--font-sans)', color:'var(--text-secondary)' }}>Riverbend Medical</span>
          <Icon name="chevrons-up-down" size={13} color="var(--text-muted)" />
        </div>
      </aside>
      <main style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <header style={{ display:'flex', alignItems:'center', gap:'var(--space-4)', minHeight:'var(--topbar-height)', padding:'10px var(--space-6)', borderBottom:'1px solid var(--border-hairline)', background:'var(--surface-header)' }}>
          <div style={{ flex:1, minWidth:0 }}>
            {breadcrumb}
            <h1 style={{ font:'var(--weight-medium) var(--text-title-2)/1.2 var(--font-sans)', letterSpacing:'var(--ls-title-2)', color:'var(--text-display)' }}>{title}</h1>
            {subtitle && <p style={{ marginTop:2, font:'var(--weight-regular) var(--text-body-sm)/1.4 var(--font-sans)', color:'var(--text-secondary)' }}>{subtitle}</p>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>{actions}</div>
        </header>
        <div style={{ flex:1, overflow:'auto', padding:'var(--space-6)' }}>{children}</div>
      </main>
    </div>
  );
}
Object.assign(window, { AppShell });
