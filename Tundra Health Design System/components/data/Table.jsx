import React from 'react';

export function Table({ columns = [], rows = [], onRowClick, dense = false, style, ...rest }) {
  const [hover, setHover] = React.useState(null);
  const rowH = dense ? 34 : 42;
  return (
    <div style={{ width: '100%', overflowX: 'auto', ...style }} {...rest}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
        <thead style={{ background: 'var(--surface-header)' }}>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{
                textAlign: c.align || 'left', padding: '0 var(--space-4)', height: 34,
                borderBottom: '1px solid var(--border-hairline)',
                font: 'var(--weight-medium) 10.5px/1 var(--font-sans)', letterSpacing: '.085em', textTransform: 'uppercase',
                color: 'var(--text-secondary)', whiteSpace: 'nowrap', width: c.width,
              }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              onClick={() => onRowClick && onRowClick(r, i)}
              style={{
                background: hover === i ? 'var(--surface-hover)' : 'transparent',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color var(--dur-fast) var(--ease-standard)',
              }}>
              {columns.map(c => (
                <td key={c.key} style={{
                  textAlign: c.align || 'left', padding: '0 var(--space-4)', height: rowH,
                  borderBottom: '1px solid var(--border-hairline)',
                  font: c.mono
                    ? 'var(--weight-regular) var(--text-mono-sm)/1.4 var(--font-mono)'
                    : 'var(--weight-regular) var(--text-body-sm)/1.4 var(--font-sans)',
                  color: c.muted ? 'var(--text-secondary)' : 'var(--text-body)',
                  whiteSpace: c.wrap ? 'normal' : 'nowrap',
                }}>{c.render ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
