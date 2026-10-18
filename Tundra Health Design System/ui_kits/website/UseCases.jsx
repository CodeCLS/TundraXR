const { Card, Icon, Sparkline, ProgressBar } = window.TundraHealthDesignSystem_1734d4;

function Visual({ kind }) {
  if (kind === 'cost') {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {[{ k:'Parts', v:38 },{ k:'Labour', v:64 },{ k:'Downtime', v:82 },{ k:'Contract', v:47 }].map(r => (
          <div key={r.k} style={{ display:'grid', gridTemplateColumns:'minmax(0,62px) 1fr', alignItems:'center', gap:8 }}>
            <span style={{ font:'10.5px/1 var(--font-sans)', color:'var(--text-secondary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.k}</span>
            <ProgressBar value={r.v} height={6} />
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:3, paddingTop:8, borderTop:'1px solid var(--border-hairline)' }}>
          <span style={{ font:'10.5px/1 var(--font-sans)', color:'var(--text-secondary)' }}>True cost per device-year</span>
          <span style={{ font:'var(--weight-medium) 12px/1 var(--font-mono)', color:'var(--text-display)' }}>$1,840</span>
        </div>
      </div>
    );
  }
  if (kind === 'enforce') {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {[{ k:'Guaranteed', v:'96.0%', tone:'var(--text-secondary)' },{ k:'Delivered', v:'93.4%', tone:'var(--status-down-fg)' }].map(r => (
          <div key={r.k} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <span style={{ font:'11px/1 var(--font-sans)', color:'var(--text-secondary)' }}>{r.k}</span>
            <span style={{ font:'var(--weight-medium) 15px/1 var(--font-mono)', color:r.tone, fontVariantNumeric:'tabular-nums' }}>{r.v}</span>
          </div>
        ))}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginTop:3, padding:'9px 10px', background:'var(--status-ok-bg)', border:'1px solid rgba(79,122,92,.24)', borderRadius:'var(--radius-md)' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, font:'11px/1 var(--font-sans)', color:'var(--status-ok-fg)' }}>
            <Icon name="gavel" size={13} color="var(--status-ok-fg)" /> Claim accepted
          </span>
          <span style={{ font:'var(--weight-medium) 12px/1 var(--font-mono)', color:'var(--status-ok-fg)' }}>$184,200</span>
        </div>
      </div>
    );
  }
  if (kind === 'decide') {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {[{ k:'Repair', v:'$214,800', sub:'2.4 yrs left', win:false },{ k:'Replace', v:'$189,400', sub:'10 yrs left', win:true }].map(r => (
          <div key={r.k} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'10px 11px',
            background: r.win ? 'var(--cobalt-050)' : 'var(--paper-100)',
            border:'1px solid ' + (r.win ? 'var(--cobalt-200)' : 'var(--border-hairline)'),
            borderRadius:'var(--radius-md)',
          }}>
            <span style={{ display:'flex', flexDirection:'column', gap:2 }}>
              <span style={{ font:'var(--weight-medium) 12px/1 var(--font-sans)', color:'var(--text-display)' }}>{r.k}</span>
              <span style={{ font:'10px/1 var(--font-sans)', color:'var(--text-secondary)' }}>{r.sub}</span>
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ font:'var(--weight-medium) 13px/1 var(--font-mono)', color:'var(--text-display)' }}>{r.v}</span>
              {r.win && <Icon name="check" size={14} color="var(--cobalt-700)" />}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {[
        { k:'Radiology 2B', v:94, tone:'down', s:[88,90,93,95,94,96,95,94] },
        { k:'Radiology 1A', v:41, tone:'ok', s:[62,58,52,49,45,43,42,41] },
        { k:'Emergency', v:77, tone:'default', s:[70,72,74,76,75,77,78,77] },
      ].map(r => (
        <div key={r.k} style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 56px 38px', alignItems:'center', gap:6 }}>
          <span style={{ font:'11px/1 var(--font-sans)', color:'var(--text-secondary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.k}</span>
          <Sparkline data={r.s} width={56} height={18} color={r.tone === 'down' ? 'var(--rust-500)' : r.tone === 'ok' ? 'var(--moss-500)' : 'var(--stone-400)'} />
          <span style={{ font:'var(--weight-medium) 11.5px/1 var(--font-mono)', textAlign:'right', color: r.tone === 'down' ? 'var(--status-down-fg)' : 'var(--text-display)' }}>{r.v}%</span>
        </div>
      ))}
      <span style={{ marginTop:3, paddingTop:8, borderTop:'1px solid var(--border-hairline)', font:'10.5px/1.4 var(--font-sans)', color:'var(--text-secondary)' }}>
        Utilisation across the fleet — one scanner is stranded.
      </span>
    </div>
  );
}

const DISCIPLINES = [
  { n:'01', icon:'calculator', kind:'cost', title:'Know what it costs', body:'Every work order, part, hour and invoice on one device.' },
  { n:'02', icon:'gavel', kind:'enforce', title:'Enforce what it owes', body:'Guarantees audited against the maintenance record.' },
  { n:'03', icon:'git-compare', kind:'decide', title:'Repair, replace or re-procure', body:'Against the full record, not a renewal proposal.' },
  { n:'04', icon:'shuffle', kind:'reallocate', title:'Reallocate what is stranded', body:'Utilisation and failure curves across the fleet.' },
];

function UseCases() {
  return (
    <section style={{ padding:'var(--space-16) var(--gutter-page-lg) var(--space-20)', borderTop:'1px solid var(--border-hairline)' }}>
      <div style={{ maxWidth:'var(--width-content)', margin:'0 auto', display:'flex', flexDirection:'column', gap:'var(--space-8)' }}>
        <SectionMarker n={4} total={5} label="Portfolio discipline" />
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'var(--space-8)', flexWrap:'wrap' }}>
          <SlashHeading>Operated for decades. Never managed.</SlashHeading>
          <span style={{ font:'12.5px/1.5 var(--font-sans)', color:'var(--text-secondary)', maxWidth:'30ch' }}>
            Four disciplines, none of which existed for equipment.
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--space-4)', alignItems:'stretch' }}>
          {DISCIPLINES.map(c => (
            <Card key={c.n} style={{ display:'flex', flexDirection:'column' }} bodyStyle={{ flex:1, display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)', flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <Icon name={c.icon} size={16} color="var(--cobalt-700)" />
                  <span style={{ marginLeft:'auto', font:'10.5px/1 var(--font-mono)', color:'var(--text-secondary)' }}>{c.n}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  <h3 style={{ font:'var(--weight-medium) var(--text-title-3)/1.25 var(--font-sans)', letterSpacing:'var(--ls-title-3)', color:'var(--text-display)' }}>{c.title}</h3>
                  <p style={{ font:'12.5px/1.5 var(--font-sans)', color:'var(--text-secondary)' }}>{c.body}</p>
                </div>
                <div style={{ marginTop:'auto', paddingTop:'var(--space-3)', borderTop:'1px solid var(--border-hairline)' }}>
                  <Visual kind={c.kind} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { UseCases });
