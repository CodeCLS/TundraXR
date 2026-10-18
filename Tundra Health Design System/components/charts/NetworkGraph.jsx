import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Node-editor view of the device graph — the canvas idiom: white node cards with
   a titlebar, labelled input/output rows, coloured ports on the card edges, and
   bezier cables that leave each port horizontally.

   Layout is layered left-to-right (column = BFS depth from the root, or an
   explicit `col`), which is what makes a node graph readable: signal flows one
   way. Within a column, cards are packed vertically and the whole column is
   centred. Deterministic — no physics, no animation loop. */

const PORT = {
  source: 'var(--moss-500)',
  contract: 'var(--cobalt-500)',
  record: 'var(--amber-500)',
  risk: 'var(--rust-500)',
  neutral: 'var(--ink-300)',
};

const TYPE = {
  device:   { label: 'Device',    icon: 'activity', accent: 'var(--stone-600)', port: 'source' },
  contract: { label: 'Contract',  icon: 'file-text', accent: 'var(--cobalt-500)', port: 'contract' },
  record:   { label: 'Record',    icon: 'receipt', accent: 'var(--stone-400)', port: 'record' },
  location: { label: 'Location',  icon: 'map-pin', accent: 'var(--amber-500)', dot: 'var(--cream-300)', port: 'neutral' },
  vendor:   { label: 'Vendor',    icon: 'building-2', accent: 'var(--stone-400)', port: 'neutral' },
  risk:     { label: 'Exposure',  icon: 'triangle-alert', accent: 'var(--rust-500)', port: 'risk' },
};

const CARD_W = 236;
const ROOT_W = 268;
const HEAD_H = 34;
const ROW_H = 26;
const PAD_B = 10;
const COL_GAP = 96;
const ROW_GAP = 22;

const rowsOf = n => n.rows || [];
const cardH = n => HEAD_H + rowsOf(n).length * ROW_H + (n.footer ? 30 : 0) + PAD_B;
const cardW = (n, isRoot) => n.width || (isRoot ? ROOT_W : CARD_W);

function layout(nodes, edges, rootId, w) {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const depth = new Map();
  // Explicit columns win; otherwise BFS outward from the root.
  const q = [rootId];
  depth.set(rootId, 0);
  const adj = new Map(nodes.map(n => [n.id, []]));
  edges.forEach(e => {
    if (!adj.has(e.from) || !adj.has(e.to)) return;
    adj.get(e.from).push(e.to);
    adj.get(e.to).push(e.from);
  });
  for (let i = 0; i < q.length; i++) {
    for (const nb of adj.get(q[i]) || []) {
      if (depth.has(nb)) continue;
      depth.set(nb, depth.get(q[i]) + 1);
      q.push(nb);
    }
  }
  const col = n => (n.col !== undefined ? n.col : (depth.get(n.id) ?? 1));
  const placed = nodes.map(n => ({
    ...n,
    _col: col(n),
    cw: cardW(n, n.id === rootId),
    ch: cardH(n),
  }));

  const cols = [...new Set(placed.map(n => n._col))].sort((a, b) => a - b);
  const widest = cols.map(c => Math.max(...placed.filter(n => n._col === c).map(n => n.cw)));
  const totalW = widest.reduce((a, b) => a + b, 0) + COL_GAP * (cols.length - 1);
  // The canvas grows to fit the graph rather than cropping it; the wrapper
  // scales the whole thing down to the container.
  const canvasW = Math.max(w, totalW + 48);
  let x = Math.max(24, (canvasW - totalW) / 2);

  const colHeights = cols.map(c => {
    const ns = placed.filter(n => n._col === c);
    return ns.reduce((a, n) => a + n.ch, 0) + ROW_GAP * (ns.length - 1);
  });
  const tallest = Math.max(...colHeights);

  cols.forEach((c, ci) => {
    const ns = placed.filter(n => n._col === c).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    let y = 24 + (tallest - colHeights[ci]) / 2;
    ns.forEach(n => {
      n.x = x + (widest[ci] - n.cw) / 2;
      n.y = y;
      y += n.ch + ROW_GAP;
    });
    x += widest[ci] + COL_GAP;
  });

  // Height comes from where cards actually ended up, never from an estimate.
  const height = Math.max(...placed.map(n => n.y + n.ch)) + 24;
  return { ns: placed, byId: new Map(placed.map(n => [n.id, n])), width: canvasW, height };
}

/* A port sits on the card edge, vertically centred on its row (or on the
   titlebar when the edge names no row) — the same rule the reference uses. */
function portY(node, rowId) {
  const rows = rowsOf(node);
  const i = rowId ? rows.findIndex(r => r.id === rowId) : -1;
  if (i < 0) return node.y + HEAD_H / 2 + 3;
  return node.y + HEAD_H + i * ROW_H + ROW_H / 2;
}

export function NetworkGraph({
  nodes = [], edges = [], rootId, width = 1000,
  selected, onSelect, legend = true, style, ...rest
}) {
  const [hover, setHover] = React.useState(null);
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  const root = (nodes.find(n => n.id === rootId) || nodes.find(n => n.type === 'device') || nodes[0] || {}).id;
  const laid = React.useMemo(
    () => (nodes.length ? layout(nodes, edges, root, width) : null),
    [nodes, edges, root, width]
  );
  const focus = hover || selected;
  const near = React.useMemo(() => {
    if (!focus) return null;
    const s = new Set([focus]);
    edges.forEach(e => { if (e.from === focus) s.add(e.to); if (e.to === focus) s.add(e.from); });
    return s;
  }, [focus, edges]);

  const height = laid ? laid.height : 400;
  const canvasW = laid ? laid.width : width;
  const types = [...new Set(nodes.map(n => n.type).filter(Boolean))];

  /* The canvas is a fixed-size coordinate space scaled to the container. The
     scale is measured rather than expressed in container-query units, which
     several rendering paths (and static capture) do not resolve. */
  React.useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, (el.clientWidth || canvasW) / canvasW));
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasW]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', ...style }} {...rest}>
      <div ref={wrapRef} style={{
        position: 'relative', width: '100%', height: height * scale,
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        background: 'var(--paper-100)',
        backgroundImage: 'var(--pattern-dots-soft)', backgroundSize: 'var(--dot-gap) var(--dot-gap)',
        border: '1px solid var(--border-hairline)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: canvasW, height,
          transformOrigin: '0 0', transform: `scale(${scale})`,
        }}>
          <svg width={canvasW} height={height} style={{ position: 'absolute', inset: 0, display: 'block', overflow: 'visible' }}>
            {laid && edges.map((e, i) => {
              const a = laid.byId.get(e.from), b = laid.byId.get(e.to);
              if (!a || !b) return null;
              const sameCol = a._col === b._col;
              const forward = a.x < b.x;
              const ay0 = portY(a, e.fromRow), by0 = portY(b, e.toRow);
              // Stacked siblings connect bottom-to-top: a right-edge bow would
              // swing outside the canvas and read as a cable leaving the frame.
              const down = a.y < b.y;
              const ax = sameCol ? a.x + a.cw / 2 : forward ? a.x + a.cw : a.x;
              const ay = sameCol ? (down ? a.y + a.ch : a.y) : ay0;
              const bx = sameCol ? b.x + b.cw / 2 : forward ? b.x : b.x + b.cw;
              const by = sameCol ? (down ? b.y : b.y + b.ch) : by0;
              const vbow = Math.max(18, Math.abs(by - ay) * 0.5) * (down ? 1 : -1);
              const hbow = Math.max(48, Math.abs(bx - ax) * 0.55) * (forward ? 1 : -1);
              const c1 = sameCol ? `${ax},${ay + vbow}` : `${ax + hbow},${ay}`;
              const c2 = sameCol ? `${bx},${by - vbow}` : `${bx - hbow},${by}`;
              const on = !near || (near.has(e.from) && near.has(e.to));
              const danger = e.tone === 'risk';
              const stroke = danger ? 'var(--rust-500)' : on && focus ? 'var(--cobalt-500)' : 'var(--ink-300)';
              return (
                <path key={i} d={`M${ax},${ay} C${c1} ${c2} ${bx},${by}`}
                  fill="none" stroke={stroke} strokeWidth={danger || (on && focus) ? 1.5 : 1.1}
                  strokeDasharray={e.dashed ? '3 4' : undefined} strokeLinecap="round"
                  opacity={on ? (danger ? 0.9 : 0.7) : 0.1}
                  style={{ transition: 'opacity var(--dur-base) var(--ease-standard),stroke var(--dur-fast) var(--ease-standard)' }} />
              );
            })}
            {/* Ports draw above the cables so a cable always lands in a dot. */}
            {laid && edges.map((e, i) => {
              const a = laid.byId.get(e.from), b = laid.byId.get(e.to);
              if (!a || !b) return null;
              const sameCol = a._col === b._col;
              const forward = a.x < b.x;
              const down = a.y < b.y;
              const on = !near || (near.has(e.from) && near.has(e.to));
              const c = e.tone === 'risk' ? PORT.risk : PORT[(TYPE[b.type] || TYPE.record).port];
              const co = PORT[(TYPE[a.type] || TYPE.record).port];
              return (
                <g key={'p' + i} opacity={on ? 1 : 0.15} style={{ transition: 'opacity var(--dur-base) var(--ease-standard)' }}>
                  <circle cx={sameCol ? a.x + a.cw / 2 : forward ? a.x + a.cw : a.x}
                    cy={sameCol ? (down ? a.y + a.ch : a.y) : portY(a, e.fromRow)} r={4}
                    fill="var(--paper-000)" stroke={co} strokeWidth={2.5} />
                  <circle cx={sameCol ? b.x + b.cw / 2 : forward ? b.x : b.x + b.cw}
                    cy={sameCol ? (down ? b.y : b.y + b.ch) : portY(b, e.toRow)} r={4}
                    fill="var(--paper-000)" stroke={c} strokeWidth={2.5} />
                </g>
              );
            })}
          </svg>

          {laid && laid.ns.map(n => {
            const t = TYPE[n.type] || TYPE.record;
            const isRoot = n.id === root;
            const on = !near || near.has(n.id);
            const sel = selected === n.id;
            return (
              <div key={n.id}
                onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
                onClick={() => onSelect && onSelect(n)}
                style={{
                  position: 'absolute', left: n.x, top: n.y, width: n.cw, minHeight: n.ch,
                  boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
                  background: 'var(--paper-000)',
                  border: `1px solid ${sel ? 'var(--cobalt-500)' : 'var(--line-200)'}`,
                  borderRadius: 12,
                  boxShadow: sel
                    ? '0 0 0 3px var(--cobalt-100),0 8px 24px rgba(53,52,46,.10)'
                    : '0 1px 2px rgba(53,52,46,.05),0 6px 18px rgba(53,52,46,.07)',
                  opacity: on ? 1 : 0.24,
                  cursor: onSelect ? 'pointer' : 'default',
                  transition: 'opacity var(--dur-base) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)',
                }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, height: HEAD_H, padding: '0 11px',
                  borderBottom: rowsOf(n).length || n.footer ? '1px solid var(--border-hairline)' : 'none',
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 16, height: 16, borderRadius: 4, flex: '0 0 auto',
                    background: isRoot ? 'var(--surface-primary)' : 'var(--paper-100)',
                  }}>
                    <Icon name={t.icon} size={11} color={isRoot ? 'var(--cream-100)' : t.accent} />
                  </span>
                  <span style={{
                    font: `var(--weight-medium) ${isRoot ? 13 : 12.5}px/1 var(--font-sans)`, letterSpacing: '-.011em',
                    color: 'var(--text-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{n.label}</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, flex: '0 0 auto' }}>
                    {n.badge && (
                      <span style={{
                        font: 'var(--weight-medium) 9px/1 var(--font-sans)', letterSpacing: '.05em',
                        textTransform: 'uppercase', color: n.type === 'risk' ? 'var(--status-down-fg)' : 'var(--text-secondary)',
                      }}>{n.badge}</span>
                    )}
                    <span style={{ width: 8, height: 1, background: 'var(--ink-300)' }} />
                  </span>
                </div>
                {rowsOf(n).map(r => (
                  <div key={r.id || r.label} style={{
                    display: 'flex', alignItems: 'center', gap: 8, height: ROW_H, padding: '0 11px',
                  }}>
                    <span style={{
                      flex: '1 1 auto', minWidth: 0,
                      font: '11.5px/1 var(--font-sans)', color: 'var(--text-secondary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{r.label}</span>
                    {r.value !== undefined && (
                      <span style={{
                        marginLeft: 'auto', flex: '0 0 auto',
                        padding: r.pill ? '3px 7px' : 0,
                        borderRadius: r.pill ? 5 : 0,
                        background: r.pill ? 'var(--paper-100)' : 'transparent',
                        border: r.pill ? '1px solid var(--line-200)' : 'none',
                        font: `var(--weight-medium) 11px/1.2 ${r.mono === false ? 'var(--font-sans)' : 'var(--font-mono)'}`,
                        color: r.tone === 'down' ? 'var(--status-down-fg)' : r.tone === 'ok' ? 'var(--status-ok-fg)' : 'var(--text-display)',
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                      }}>{r.value}</span>
                    )}
                  </div>
                ))}
                {n.footer && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                    margin: '4px 11px 0', padding: '8px 0 0', borderTop: '1px solid var(--border-hairline)',
                  }}>
                    <span style={{ font: '10.5px/1 var(--font-sans)', color: 'var(--text-secondary)' }}>{n.footer.label}</span>
                    <span style={{
                      font: 'var(--weight-medium) 11.5px/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums',
                      color: n.footer.tone === 'down' ? 'var(--status-down-fg)' : 'var(--text-display)',
                    }}>{n.footer.value}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {legend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          {types.map(t => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '11.5px/1 var(--font-sans)', color: 'var(--text-secondary)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: (TYPE[t] || TYPE.record).dot || 'var(--paper-000)', border: `2px solid ${PORT[(TYPE[t] || TYPE.record).port]}` }} />
              {(TYPE[t] || TYPE.record).label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
