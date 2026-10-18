const { Icon } = window.TundraHealthDesignSystem_1734d4;

/* Shared site furniture: the numbered section rule and the slash-framed
   headline. Both come straight from the brand's technical-drawing register. */

function SectionMarker({ n, total = 5, label, tone = 'default' }) {
  const dim = tone === 'inverse';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, width:'100%' }}>
      <span style={{ font:'10.5px/1 var(--font-mono)', color: dim ? 'var(--cobalt-300)' : 'var(--text-muted)', whiteSpace:'nowrap' }}>
        [ N.{String(n).padStart(2,'0')}/{String(total).padStart(2,'0')} ]
      </span>
      <span style={{ width:26, height:1, background: dim ? 'var(--border-inverse)' : 'var(--border-default)', flex:'0 0 auto' }} />
      <span style={{ font:'var(--weight-medium) 10.5px/1 var(--font-sans)', letterSpacing:'.14em', textTransform:'uppercase', color: dim ? 'var(--cream-100)' : 'var(--text-secondary)', whiteSpace:'nowrap' }}>
        &gt; {label}
      </span>
    </div>
  );
}

function SlashHeading({ children, tone = 'default', size = 'var(--text-display-2)' }) {
  const dim = tone === 'inverse';
  return (
    <h2 style={{
      display:'flex', alignItems:'flex-start', gap:14,
      font:`var(--weight-regular) ${size}/var(--lh-display-2) var(--font-sans)`,
      letterSpacing:'var(--ls-display-2)', color: dim ? 'var(--cream-100)' : 'var(--text-display)',
    }}>
      <span style={{ color:'var(--ink-300)', flex:'0 0 auto' }}>/</span>
      <span>{children}</span>
      <span style={{ color:'var(--ink-300)', flex:'0 0 auto' }}>/</span>
    </h2>
  );
}

/* Isometric layer stack — the four source systems collapsing onto one device
   record. Drawn as CSS-transformed planes, not an illustration file. */
function IsoStack({ layers = [], accentIndex = 0 }) {
  return (
    <div style={{ position:'relative', height: 60 + layers.length * 62, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'relative', width:340, height: layers.length * 62, transformStyle:'preserve-3d' }}>
        {layers.map((l, i) => {
          const hot = i === accentIndex;
          return (
            <div key={l.label} style={{
              position:'absolute', left:0, right:0, top: i * 62,
              height:96, transform:'rotateX(56deg) rotateZ(-45deg)', transformOrigin:'50% 50%',
              background: hot ? 'var(--cobalt-050)' : 'var(--paper-000)',
              border:'1px solid ' + (hot ? 'var(--cobalt-500)' : 'var(--line-200)'),
              borderRadius:6,
              boxShadow: hot ? '0 12px 28px rgba(66,82,124,.16)' : '0 8px 20px rgba(53,52,46,.07)',
            }}>
              <div style={{ display:'flex', flexDirection:'column', gap:5, padding:'10px 12px' }}>
                <span style={{ width: hot ? '58%' : '42%', height:5, borderRadius:2, background: hot ? 'var(--cobalt-300)' : 'var(--paper-200)' }} />
                <span style={{ width:'76%', height:4, borderRadius:2, background:'var(--paper-200)' }} />
                <span style={{ width:'64%', height:4, borderRadius:2, background:'var(--paper-200)' }} />
              </div>
            </div>
          );
        })}
        {layers.map((l, i) => (
          <div key={'lbl' + l.label} style={{
            position:'absolute', left:-176, top: i * 62 + 34,
            display:'flex', alignItems:'center', gap:8, width:176,
          }}>
            <span style={{
              flex:1, textAlign:'right',
              font:'10px/1 var(--font-mono)', letterSpacing:'.06em', textTransform:'uppercase',
              color: i === accentIndex ? 'var(--cobalt-700)' : 'var(--text-muted)',
            }}>{l.label}</span>
            <span style={{ width:34, height:1, background: i === accentIndex ? 'var(--cobalt-500)' : 'var(--border-default)' }} />
          </div>
        ))}
        {layers.map((l, i) => (
          <div key={'v' + l.label} style={{
            position:'absolute', right:-150, top: i * 62 + 34, width:150,
            font:'10px/1 var(--font-mono)', letterSpacing:'.05em', textTransform:'uppercase', color:'var(--text-muted)',
          }}>{l.note}</div>
        ))}
      </div>
    </div>
  );
}

/* Resilience: a kit must degrade, never white-screen. DSFallback stands in for an
   export the loaded bundle does not have yet; SectionBoundary keeps one failing
   section from unmounting the whole page. */
function DSFallback({ children }) {
  return (
    <div style={{ padding:'10px 12px', border:'1px dashed var(--line-300)', borderRadius:'var(--radius-md)', background:'var(--paper-100)', font:'11px/1.5 var(--font-mono)', color:'var(--text-secondary)' }}>
      {children || 'Component unavailable in this build.'}
    </div>
  );
}

class SectionBoundary extends React.Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { console.error('Section failed to render:', e); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section style={{ padding:'var(--space-12) var(--gutter-page-lg)', borderTop:'1px solid var(--border-hairline)' }}>
        <div style={{ maxWidth:'var(--width-content)', margin:'0 auto' }}>
          <DSFallback>This section could not render. The rest of the page is unaffected.</DSFallback>
        </div>
      </section>
    );
  }
}

Object.assign(window, { SectionMarker, SlashHeading, IsoStack, DSFallback, SectionBoundary });
