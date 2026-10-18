/* @ds-bundle: {"format":4,"namespace":"TundraHealthDesignSystem_1734d4","components":[{"name":"DeviceMessage","sourcePath":"components/agent/DeviceMessage.jsx"},{"name":"ToolCall","sourcePath":"components/agent/ToolCall.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Surface","sourcePath":"components/brand/Surface.jsx"},{"name":"BarChart","sourcePath":"components/charts/BarChart.jsx"},{"name":"DonutChart","sourcePath":"components/charts/DonutChart.jsx"},{"name":"DotMatrix","sourcePath":"components/charts/DotMatrix.jsx"},{"name":"LineChart","sourcePath":"components/charts/LineChart.jsx"},{"name":"NetworkGraph","sourcePath":"components/charts/NetworkGraph.jsx"},{"name":"ProgressBar","sourcePath":"components/charts/ProgressBar.jsx"},{"name":"Sparkline","sourcePath":"components/charts/Sparkline.jsx"},{"name":"SplitBarChart","sourcePath":"components/charts/SplitBarChart.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"GLYPHS","sourcePath":"components/core/lucide-glyphs.js"},{"name":"DefinitionList","sourcePath":"components/data/DefinitionList.jsx"},{"name":"StatTile","sourcePath":"components/data/StatTile.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Timeline","sourcePath":"components/data/Timeline.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Breadcrumbs","sourcePath":"components/navigation/Breadcrumbs.jsx"},{"name":"SidebarNav","sourcePath":"components/navigation/SidebarNav.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/agent/DeviceMessage.jsx":"838ae9faf76b","components/agent/ToolCall.jsx":"797c668a297e","components/brand/Logo.jsx":"4942f3300409","components/brand/Surface.jsx":"5f9da5024c8f","components/charts/BarChart.jsx":"2b3e9be78c87","components/charts/DonutChart.jsx":"8ed4c8b4f55f","components/charts/DotMatrix.jsx":"2248a7860b38","components/charts/LineChart.jsx":"a11d344ce86f","components/charts/NetworkGraph.jsx":"0d72ef6d2379","components/charts/ProgressBar.jsx":"f01e776463c5","components/charts/Sparkline.jsx":"add866d07a78","components/charts/SplitBarChart.jsx":"752367b556af","components/core/Badge.jsx":"35ed8be09ed2","components/core/Button.jsx":"2a4331d3fa17","components/core/Card.jsx":"7d628cfc292d","components/core/Icon.jsx":"25bf78d0e0ab","components/core/IconButton.jsx":"ec7a2a3a105b","components/core/Tag.jsx":"d9da90e00b77","components/core/lucide-glyphs.js":"422096b7a645","components/data/DefinitionList.jsx":"07c969fb002b","components/data/StatTile.jsx":"642c2e18a198","components/data/Table.jsx":"03ed25414c71","components/data/Timeline.jsx":"b2dc579473a0","components/feedback/Dialog.jsx":"def7c6835116","components/feedback/EmptyState.jsx":"28f731546f77","components/feedback/Toast.jsx":"cae4869622c5","components/feedback/Tooltip.jsx":"40d419bdc187","components/forms/Checkbox.jsx":"da4fe117b80a","components/forms/Input.jsx":"e37db7b87911","components/forms/Radio.jsx":"baa31eb2bc10","components/forms/Select.jsx":"40ad9375da90","components/forms/Switch.jsx":"50d52ac93f6a","components/forms/Textarea.jsx":"86e2f68da2c5","components/navigation/Breadcrumbs.jsx":"d96dd18e1998","components/navigation/SidebarNav.jsx":"bf5c3179264d","components/navigation/Tabs.jsx":"dcbf75834229","ui_kits/app/AnalyticsScreen.jsx":"a004f7bc6209","ui_kits/app/AppShell.jsx":"957ab48a5afe","ui_kits/app/ContractsScreen.jsx":"e185be0240f2","ui_kits/app/DeviceScreen.jsx":"f29d3baffb30","ui_kits/app/FleetScreen.jsx":"a7d3624d2881","ui_kits/app/TriageScreen.jsx":"922f0bf512b6","ui_kits/app/data.js":"033847363b89","ui_kits/website/AnalysisSection.jsx":"69c8787df668","ui_kits/website/AskSection.jsx":"05f7a139d383","ui_kits/website/GraphSection.jsx":"451fb2a420c4","ui_kits/website/Hero.jsx":"039373967a9b","ui_kits/website/RoutinesSection.jsx":"e1ac491f5fb9","ui_kits/website/SiteBits.jsx":"6ac4425a0eae","ui_kits/website/SiteFooter.jsx":"083a9e620872","ui_kits/website/SiteHeader.jsx":"56b20b2132f2","ui_kits/website/UseCases.jsx":"33b615e73799"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TundraHealthDesignSystem_1734d4 = window.TundraHealthDesignSystem_1734d4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* assets/tundra-mark.svg, inlined so the mark can be masked to currentColor. */
const MARK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='241' height='160' viewBox='0 0 241 160'%3E%3Cpath d='M13 153.978L235.182 154.361' stroke='%23000' stroke-width='10' stroke-linecap='round'/%3E%3Cpath d='M63.7491 105.417C65.7128 108.341 70.003 108.372 72.0092 105.477L141.011 5.92177C142.998 3.05478 147.236 3.05231 149.226 5.91699L235.544 130.147C237.847 133.462 235.475 138 231.437 138H9.34023C5.34723 138 2.96517 133.55 5.1794 130.227L38.5029 80.2193C40.4776 77.2561 44.8289 77.2481 46.8144 80.2041L63.7491 105.417Z' fill='%23000'/%3E%3C/svg%3E";

/* The mark is the supplied Tundra ridge glyph. The wordmark is the brand name
   set in Geist Medium — no bespoke lettering exists in the supplied assets. */
function Logo({
  size = 22,
  color = 'var(--ink-900)',
  wordmark = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.42,
      color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'block',
      width: size * 1.5,
      height: size,
      background: 'currentColor',
      WebkitMaskImage: `url("${MARK}")`,
      maskImage: `url("${MARK}")`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center'
    }
  }), wordmark && /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--weight-medium) ${size * 0.86}px/1 var(--font-sans)`,
      letterSpacing: '-.03em'
    }
  }, "Tundra"));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/Surface.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Surface({
  children,
  tone = 'paper',
  dots = true,
  grain = true,
  dotGap,
  style,
  ...rest
}) {
  const inverse = tone === 'ink';
  const bg = inverse ? 'var(--surface-contrast)' : tone === 'cream' ? 'var(--cream-surface)' : 'var(--bg-page)';
  const dotColor = inverse ? 'var(--pattern-dots-inverse)' : tone === 'cream' ? 'var(--pattern-dots-soft)' : 'var(--pattern-dots)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      background: bg,
      color: inverse ? 'var(--cream-100)' : 'var(--text-body)',
      overflow: 'hidden',
      ...style
    }
  }, rest), dots && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage: dotColor,
      backgroundSize: `${dotGap || 'var(--dot-gap)'} ${dotGap || 'var(--dot-gap)'}`,
      maskImage: 'radial-gradient(ellipse at 50% 30%,#000 20%,transparent 78%)',
      WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%,#000 20%,transparent 78%)'
    }
  }), grain && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage: 'var(--grain-url)',
      opacity: inverse ? 0.5 : 'var(--grain-opacity)',
      mixBlendMode: inverse ? 'overlay' : 'multiply'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, children));
}
Object.assign(__ds_scope, { Surface });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Surface.jsx", error: String((e && e.message) || e) }); }

// components/charts/BarChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PALETTE = ['var(--stone-600)', 'var(--cobalt-500)', 'var(--amber-500)', 'var(--moss-500)'];
function BarChart({
  data = [],
  height = 200,
  color = 'var(--stone-600)',
  horizontal = false,
  valueFormat,
  stacked = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  const fmt = valueFormat || (v => v.toLocaleString());
  const totals = data.map(d => stacked && Array.isArray(d.value) ? d.value.reduce((a, b) => a + b, 0) : d.value);
  const max = Math.max(...totals, 0) || 1;
  if (horizontal) {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        ...style
      }
    }, rest), data.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: d.label,
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(null),
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(56px,120px) minmax(48px,1fr) auto',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '12.5px/1.3 var(--font-sans)',
        color: hover === i ? 'var(--text-body)' : 'var(--text-secondary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        transition: 'color var(--dur-fast) var(--ease-standard)'
      }
    }, d.label), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0,
        height: 9,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--paper-200)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        width: `${totals[i] / max * 100}%`,
        height: '100%',
        borderRadius: 'var(--radius-pill)',
        background: d.color || color,
        opacity: hover === null || hover === i ? 1 : 0.4,
        transition: 'opacity var(--dur-fast) var(--ease-standard),width var(--dur-slow) var(--ease-out)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 11.5px var(--font-mono)',
        color: 'var(--text-body)',
        textAlign: 'right',
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmt(totals[i])))));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 8,
      height
    }
  }, data.map((d, i) => {
    const parts = stacked && Array.isArray(d.value) ? d.value : [totals[i]];
    return /*#__PURE__*/React.createElement("div", {
      key: d.label,
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(null),
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7,
        height: '100%',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 10.5px/1 var(--font-mono)',
        color: hover === i ? 'var(--text-body)' : 'var(--ink-400)',
        opacity: hover === null || hover === i ? 1 : 0.4,
        transition: 'var(--transition-control)'
      }
    }, fmt(totals[i])), /*#__PURE__*/React.createElement("span", {
      style: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column-reverse',
        height: `${totals[i] / max * 100}%`,
        borderRadius: '5px 5px 2px 2px',
        overflow: 'hidden',
        opacity: hover === null || hover === i ? 1 : 0.45,
        transformOrigin: 'bottom',
        animation: 'tundra-rise var(--dur-slow) var(--ease-out)',
        transition: 'opacity var(--dur-fast) var(--ease-standard)'
      }
    }, parts.map((p, pi) => /*#__PURE__*/React.createElement("span", {
      key: pi,
      style: {
        height: `${p / (totals[i] || 1) * 100}%`,
        background: pi === 0 ? d.color || color : PALETTE[(pi + 1) % PALETTE.length]
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '10px/1 var(--font-mono)',
        color: 'var(--ink-400)',
        whiteSpace: 'nowrap'
      }
    }, d.label));
  })));
}
Object.assign(__ds_scope, { BarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/charts/DonutChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PALETTE = ['var(--stone-600)', 'var(--cobalt-500)', 'var(--amber-500)', 'var(--moss-500)', 'var(--rust-500)'];
function DonutChart({
  data = [],
  size = 132,
  thickness = 11,
  centerLabel,
  centerValue,
  legend = true,
  style,
  ...rest
}) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--paper-100)",
    strokeWidth: thickness
  }), data.map((d, i) => {
    const len = d.value / total * c;
    const gap = 3;
    const cap = len > thickness * 2.2 ? 'round' : 'butt';
    const draw = Math.max(len - gap - (cap === 'round' ? thickness : 0), 0.5);
    const el = /*#__PURE__*/React.createElement("circle", {
      key: d.label,
      cx: size / 2,
      cy: size / 2,
      r: r,
      fill: "none",
      stroke: d.color || PALETTE[i % PALETTE.length],
      strokeWidth: thickness,
      strokeDasharray: `${draw} ${c - draw}`,
      strokeDashoffset: -(offset + (cap === 'round' ? thickness / 2 : 0)),
      strokeLinecap: cap,
      style: {
        animation: `tundra-fade var(--dur-slow) var(--ease-out) ${i * 70}ms both`
      }
    });
    offset += len;
    return el;
  })), (centerValue || centerLabel) && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 25px/1 var(--font-sans)',
      letterSpacing: '-.03em',
      color: 'var(--text-display)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, centerValue), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 11px/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, centerLabel))), legend && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      minWidth: 0
    }
  }, data.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d.label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      font: '12px/1.3 var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 3,
      background: d.color || PALETTE[i % PALETTE.length],
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap'
    }
  }, d.label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 11.5px var(--font-mono)',
      color: 'var(--text-body)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, Math.round(d.value / total * 100), "%")))));
}
Object.assign(__ds_scope, { DonutChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/DonutChart.jsx", error: String((e && e.message) || e) }); }

// components/charts/DotMatrix.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Columns rendered as stacks of small squares — the dot-matrix bar chart from the
   Tundra mood board. Reads as data AND as the brand's dotted survey grid. */
function DotMatrix({
  data = [],
  rows = 12,
  cell = 5,
  gap = 2,
  columnGap = 3,
  color = 'var(--stone-600)',
  emptyColor = 'var(--paper-300)',
  labels = true,
  valueFormat,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  const values = data.map(d => typeof d === 'number' ? d : d.value);
  const max = Math.max(...values, 0) || 1;
  const fmt = valueFormat || (v => v.toLocaleString());
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: columnGap,
      height: rows * (cell + gap)
    }
  }, data.map((d, i) => {
    const v = values[i];
    const filled = Math.max(1, Math.round(v / max * rows));
    const col = typeof d === 'object' && d.color || color;
    const on = hover === null || hover === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(null),
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        gap,
        cursor: 'default',
        opacity: on ? 1 : 0.42,
        transition: 'opacity var(--dur-fast) var(--ease-standard)'
      }
    }, Array.from({
      length: rows
    }, (_, rIdx) => /*#__PURE__*/React.createElement("span", {
      key: rIdx,
      style: {
        width: cell,
        height: cell,
        borderRadius: 1,
        flex: '0 0 auto',
        background: rIdx < filled ? col : emptyColor,
        animation: rIdx < filled ? `tundra-fade var(--dur-base) var(--ease-out) ${i * 18 + rIdx * 6}ms both` : undefined
      }
    })));
  })), labels && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: columnGap
    }
  }, data.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      textAlign: 'center',
      font: '9.5px/1 var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: hover === i ? 'var(--text-body)' : 'var(--ink-400)',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  }, hover === i ? fmt(values[i]) : typeof d === 'object' ? d.label : ''))));
}
Object.assign(__ds_scope, { DotMatrix });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/DotMatrix.jsx", error: String((e && e.message) || e) }); }

// components/charts/LineChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PALETTE = ['var(--stone-600)', 'var(--cobalt-500)', 'var(--amber-500)', 'var(--moss-500)'];
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i],
      p1 = pts[i],
      p2 = pts[i + 1],
      p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6,
      c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6,
      c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}
function LineChart({
  series = [],
  labels = [],
  height = 200,
  area = true,
  curve = true,
  yTicks = 4,
  reference,
  referenceLabel,
  markers = false,
  valueFormat,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  const ref = React.useRef(null);
  const [w, setW] = React.useState(640);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const padL = 46,
    padR = 12,
    padT = 12,
    padB = 26;
  const all = series.flatMap(s => s.data);
  const rawMax = Math.max(...all, 0),
    rawMin = Math.min(...all, 0);
  const headroom = (rawMax - rawMin || 1) * 0.12;
  const max = rawMax + headroom,
    min = Math.max(0, rawMin - headroom);
  const span = max - min || 1;
  const n = Math.max(...series.map(s => s.data.length), 1);
  const x = i => padL + i / (n - 1 || 1) * (w - padL - padR);
  const y = v => padT + (1 - (v - min) / span) * (height - padT - padB);
  const fmt = valueFormat || (v => String(Math.round(v)));
  const ticks = Array.from({
    length: yTicks + 1
  }, (_, i) => min + span * i / yTicks);
  const id = React.useId().replace(/:/g, '');
  const every = Math.ceil(n / 8);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    style: {
      position: 'relative',
      width: '100%',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: height,
    viewBox: `0 0 ${w} ${height}`,
    onMouseLeave: () => setHover(null),
    onMouseMove: e => {
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width * w;
      const i = Math.round((px - padL) / (w - padL - padR) * (n - 1));
      setHover(i >= 0 && i < n ? i : null);
    },
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("defs", null, series.map((s, si) => /*#__PURE__*/React.createElement("linearGradient", {
    key: si,
    id: `lc${id}${si}`,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: s.color || PALETTE[si % PALETTE.length],
    stopOpacity: "0.22"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "70%",
    stopColor: s.color || PALETTE[si % PALETTE.length],
    stopOpacity: "0.04"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: s.color || PALETTE[si % PALETTE.length],
    stopOpacity: "0"
  })))), ticks.map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: w - padR,
    y1: y(t),
    y2: y(t),
    stroke: i === 0 ? 'var(--border-default)' : 'var(--border-hairline)',
    strokeWidth: "1",
    strokeDasharray: i === 0 ? undefined : '1 5',
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 10,
    y: y(t) + 3.5,
    textAnchor: "end",
    style: {
      font: '10px var(--font-mono)',
      fill: 'var(--ink-400)'
    }
  }, fmt(t)))), series.map((s, si) => {
    const col = s.color || PALETTE[si % PALETTE.length];
    const pts = s.data.map((v, i) => [x(i), y(v)]);
    const line = curve ? smoothPath(pts) : pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
    return /*#__PURE__*/React.createElement("g", {
      key: si
    }, area && !s.dashed && /*#__PURE__*/React.createElement("path", {
      d: `${line} L${x(s.data.length - 1)},${height - padB} L${x(0)},${height - padB} Z`,
      fill: `url(#lc${id}${si})`,
      style: {
        animation: 'tundra-fade var(--dur-slow) var(--ease-out)'
      }
    }), /*#__PURE__*/React.createElement("path", {
      d: line,
      fill: "none",
      stroke: col,
      strokeWidth: s.dashed ? 1.5 : 2,
      strokeDasharray: s.dashed ? '4 4' : undefined,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: s.dashed ? 0.6 : 1,
      style: s.dashed ? undefined : {
        strokeDasharray: 2400,
        animation: 'tundra-draw 900ms var(--ease-out) forwards',
        ['--draw-len']: 2400
      }
    }), hover !== null && s.data[hover] !== undefined && /*#__PURE__*/React.createElement("circle", {
      cx: x(hover),
      cy: y(s.data[hover]),
      r: "4",
      fill: "var(--paper-000)",
      stroke: col,
      strokeWidth: "2"
    }));
  }), reference !== undefined && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    x2: w - padR,
    y1: y(reference),
    y2: y(reference),
    stroke: "var(--ink-500)",
    strokeWidth: "1",
    strokeDasharray: "5 4"
  }), referenceLabel && /*#__PURE__*/React.createElement("text", {
    x: w - padR,
    y: y(reference) - 6,
    textAnchor: "end",
    style: {
      font: '9.5px var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      fill: 'var(--text-muted)'
    }
  }, referenceLabel)), markers && series.map((s, si) => /*#__PURE__*/React.createElement("g", {
    key: 'm' + si
  }, s.data.map((v, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x(i),
    cy: y(v),
    r: "2.5",
    fill: "var(--surface-card)",
    stroke: s.color || PALETTE[si % PALETTE.length],
    strokeWidth: "1.5"
  })))), hover !== null && /*#__PURE__*/React.createElement("line", {
    x1: x(hover),
    x2: x(hover),
    y1: padT,
    y2: height - padB,
    stroke: "var(--ink-400)",
    strokeWidth: "1",
    strokeDasharray: "2 3"
  }), labels.map((l, i) => i % every === 0 && /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x(i),
    y: height - 7,
    textAnchor: "middle",
    style: {
      font: '10px var(--font-mono)',
      fill: hover === i ? 'var(--text-body)' : 'var(--ink-400)'
    }
  }, l))), hover !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 2,
      left: Math.min(Math.max(x(hover) - 66, 0), Math.max(w - 140, 0)),
      padding: '8px 10px',
      background: 'var(--paper-000)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-md)',
      pointerEvents: 'none',
      minWidth: 128,
      animation: 'tundra-fade var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-medium) 10px/1.2 var(--font-mono)',
      color: 'var(--text-muted)',
      marginBottom: 5
    }
  }, labels[hover]), series.map((s, si) => /*#__PURE__*/React.createElement("div", {
    key: si,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      font: '11.5px/1.6 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 2,
      background: s.color || PALETTE[si % PALETTE.length]
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--text-secondary)'
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 11.5px var(--font-mono)'
    }
  }, fmt(s.data[hover]))))));
}
Object.assign(__ds_scope, { LineChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/LineChart.jsx", error: String((e && e.message) || e) }); }

// components/charts/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProgressBar({
  value = 0,
  max = 100,
  label,
  valueLabel,
  tone = 'accent',
  segments,
  height = 8,
  style,
  ...rest
}) {
  const TONE = {
    accent: 'var(--cobalt-500)',
    ok: 'var(--moss-500)',
    warn: 'var(--amber-500)',
    down: 'var(--rust-500)',
    ink: 'var(--ink-800)'
  };
  const parts = segments || [{
    value,
    color: TONE[tone] || TONE.accent
  }];
  const total = parts.reduce((a, p) => a + p.value, 0);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, rest), (label || valueLabel) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 10
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '12px/1.3 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, label), valueLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 11.5px/1 var(--font-mono)',
      color: 'var(--text-body)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, valueLabel)), /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": total,
    "aria-valuemax": max,
    style: {
      display: 'flex',
      height,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--paper-200)',
      boxShadow: 'inset 0 0 0 1px var(--border-hairline)',
      overflow: 'hidden'
    }
  }, parts.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: `${p.value / max * 100}%`,
      background: p.color || TONE.accent,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  }))));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/charts/Sparkline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Sparkline({
  data = [],
  width = 96,
  height = 28,
  color = 'var(--stone-600)',
  area = true,
  strokeWidth = 1.75,
  style,
  ...rest
}) {
  if (!data.length) return null;
  const min = Math.min(...data),
    max = Math.max(...data),
    span = max - min || 1;
  const pad = strokeWidth;
  const x = i => i / (data.length - 1 || 1) * (width - pad * 2) + pad;
  const y = v => height - pad - (v - min) / span * (height - pad * 2);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
  const id = React.useId().replace(/:/g, '');
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: width,
    height: height,
    viewBox: `0 0 ${width} ${height}`,
    style: {
      display: 'block',
      overflow: 'visible',
      ...style
    }
  }, rest), area && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: 'sp' + id,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.24"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: `${line} L${x(data.length - 1)},${height} L${x(0)},${height} Z`,
    fill: 'url(#sp' + id + ')'
  })), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: x(data.length - 1),
    cy: y(data[data.length - 1]),
    r: strokeWidth + 0.5,
    fill: color
  }));
}
Object.assign(__ds_scope, { Sparkline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/Sparkline.jsx", error: String((e && e.message) || e) }); }

// components/charts/SplitBarChart.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* A dense two-state bar comparison — the "before / after" specimen: a long run
   of thin bars split by a labelled divider, muted on the left, accented on the
   right. Reads as evidence rather than decoration, so use it when the claim is
   a step change (recovery before/after Tundra, downtime before/after triage). */

function SplitBarChart({
  data = [],
  split,
  height = 180,
  barGap = 1,
  leftLabel = 'Before',
  rightLabel = 'After',
  leftColor = 'var(--ink-200)',
  rightColor = 'var(--cobalt-500)',
  ticks = [],
  valueFormat,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  const n = data.length || 1;
  const cut = split === undefined ? Math.floor(n / 2) : split;
  const max = Math.max(...data, 1);
  const fmt = valueFormat || (v => String(Math.round(v)));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height,
      display: 'flex',
      alignItems: 'flex-end',
      gap: barGap
    }
  }, data.map((v, i) => {
    const on = i >= cut;
    const isHover = hover === i;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(null),
      style: {
        flex: 1,
        minWidth: 0,
        height: `${Math.max(1.5, v / max * 100)}%`,
        background: on ? rightColor : leftColor,
        opacity: isHover ? 1 : on ? 0.92 : 0.75,
        transition: 'opacity var(--dur-fast) var(--ease-standard)'
      }
    });
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: `${cut / n * 100}%`,
      width: 1,
      background: rightColor,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: '18%',
      left: `${cut / n * 100}%`,
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'stretch',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      pointerEvents: 'none',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '5px 8px',
      background: 'var(--paper-000)',
      border: '1px solid var(--line-200)',
      borderRight: 'none',
      font: 'var(--weight-medium) 9.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, leftLabel, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "\u2039")), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      background: rightColor
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '5px 8px',
      background: rightColor,
      border: `1px solid ${rightColor}`,
      borderLeft: 'none',
      font: 'var(--weight-medium) 9.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--cream-050)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .7
    }
  }, "\u203A"), rightLabel)), hover !== null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: `${(hover + 0.5) / n * 100}%`,
      transform: 'translateX(-50%)',
      padding: '3px 7px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--surface-primary)',
      color: 'var(--cream-100)',
      font: '10px/1 var(--font-mono)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none'
    }
  }, fmt(data[hover]))), ticks.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px solid var(--border-hairline)',
      paddingTop: 6
    }
  }, ticks.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      font: '10px/1 var(--font-mono)',
      color: 'var(--text-muted)'
    }
  }, t))));
}
Object.assign(__ds_scope, { SplitBarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/SplitBarChart.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Every badge carries a hairline so the chip has an edge on both the bone page
   and the lighter card — tints alone are too close in value to read. */
const TONES = {
  neutral: {
    bg: 'var(--paper-100)',
    fg: 'var(--text-secondary)',
    dot: 'var(--ink-400)',
    border: '1px solid var(--line-200)'
  },
  ok: {
    bg: 'var(--status-ok-bg)',
    fg: 'var(--status-ok-fg)',
    dot: 'var(--moss-500)',
    border: '1px solid rgba(91,122,99,.24)'
  },
  warn: {
    bg: 'var(--status-warn-bg)',
    fg: 'var(--status-warn-fg)',
    dot: 'var(--amber-500)',
    border: '1px solid rgba(168,127,60,.24)'
  },
  down: {
    bg: 'var(--status-down-bg)',
    fg: 'var(--status-down-fg)',
    dot: 'var(--rust-500)',
    border: '1px solid rgba(160,90,70,.24)'
  },
  info: {
    bg: 'var(--status-info-bg)',
    fg: 'var(--status-info-fg)',
    dot: 'var(--cobalt-500)',
    border: '1px solid rgba(93,106,140,.24)'
  },
  brand: {
    bg: 'var(--cream-surface)',
    fg: 'var(--ink-800)',
    dot: 'var(--cream-300)',
    border: '1px solid var(--cream-300)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  dot = false,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 21,
      padding: '0 9px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      color: t.fg,
      border: t.border || '1px solid transparent',
      font: `var(--weight-medium) 11.5px/1 var(--font-sans)`,
      letterSpacing: '-.002em',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: t.dot,
      flex: '0 0 auto'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  title,
  meta,
  actions,
  padded = true,
  tone = 'paper',
  dotted = false,
  bodyStyle,
  style,
  ...rest
}) {
  const bg = tone === 'brand' ? 'var(--surface-brand)' : tone === 'sunken' ? 'var(--surface-sunken)' : 'var(--surface-card)';
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      position: 'relative',
      background: bg,
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'none',
      overflow: 'hidden',
      backgroundImage: dotted ? 'var(--pattern-dots-soft)' : undefined,
      backgroundSize: dotted ? 'var(--dot-gap) var(--dot-gap)' : undefined,
      ...style
    }
  }, rest), (title || actions) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      padding: '14px var(--space-5)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--weight-medium) var(--text-title-3)/1.25 var(--font-sans)',
      letterSpacing: 'var(--ls-title-3)',
      color: 'var(--text-display)'
    }
  }, title), meta && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 3,
      font: 'var(--weight-regular) var(--text-body-sm)/1.4 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, meta)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      flex: '0 0 auto'
    }
  }, actions)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: padded ? 'var(--space-5)' : 0,
      ...bodyStyle
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/lucide-glyphs.js
try { (() => {
/* Lucide 0.446.0 glyph paths, vendored so no network fetch is needed at runtime.
   Lucide is ISC-licensed: https://github.com/lucide-icons/lucide/blob/main/LICENSE
   Contains only the glyphs this design system actually uses. Add a name here when
   you introduce a new one — never reach back out to a CDN. */
const GLYPHS = {
  'activity': '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  'calculator': '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
  'calendar-x': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m14 14-4 4"/><path d="m10 14 4 4"/>',
  'chart-column': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevrons-left': '<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>',
  'chevrons-up-down': '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'corner-down-left': '<polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>',
  'database': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  'door-closed': '<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><path d="M14 12v.01"/>',
  'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  'ellipsis': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  'file-search': '<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><path d="m9 18-1.5-1.5"/><circle cx="5" cy="14" r="3"/>',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  'filter': '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  'gavel': '<path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>',
  'git-branch': '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  'git-compare': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/>',
  'hash': '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
  'inbox': '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  'loader': '<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',
  'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'maximize-2': '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/>',
  'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  'receipt': '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'send': '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  'share': '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'shuffle': '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
  'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  'triangle-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'wand-sparkles': '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>',
  'wrench': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};
Object.assign(__ds_scope, { GLYPHS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/lucide-glyphs.js", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Tundra uses Lucide (1.5px stroke) as its icon set. Glyphs are VENDORED in
   lucide-glyphs.js rather than fetched from a CDN — a network round trip per
   icon means blank icons wherever the page is published offline or bundled as a
   self-contained file. */

function Icon({
  name,
  size = 16,
  strokeWidth = 1.5,
  color = 'currentColor',
  style,
  ...rest
}) {
  const markup = __ds_scope.GLYPHS[name];
  if (!markup && name) console.warn('[Tundra Icon] no vendored glyph named "' + name + '" — add it to components/core/lucide-glyphs.js');
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      flex: '0 0 auto',
      display: 'block',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: markup || ''
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/agent/DeviceMessage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The device speaking for itself. Tundra's distinctive move: an answer is
   voiced by the asset, in the first person, and always carries the records it
   is drawing on. `speaker: 'you'` renders the human side of the exchange. */
function DeviceMessage({
  speaker = 'device',
  name,
  tag,
  children,
  citations = [],
  confidence,
  style,
  ...rest
}) {
  const you = speaker === 'you';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 11,
      flexDirection: you ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 26,
      height: 26,
      borderRadius: you ? '50%' : 'var(--radius-sm)',
      flex: '0 0 auto',
      background: you ? 'var(--paper-100)' : 'var(--surface-primary)',
      border: you ? '1px solid var(--line-200)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: you ? 'user' : 'activity',
    size: 13,
    color: you ? 'var(--text-secondary)' : 'var(--cream-100)'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      minWidth: 0,
      maxWidth: '82%',
      alignItems: you ? 'flex-end' : 'flex-start'
    }
  }, (name || tag) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 7
    }
  }, name && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 12px/1 var(--font-sans)',
      color: 'var(--text-display)'
    }
  }, name), tag && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '10.5px/1 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 13px',
      borderRadius: 'var(--radius-lg)',
      background: you ? 'var(--paper-100)' : 'var(--surface-card)',
      border: '1px solid ' + (you ? 'var(--line-200)' : 'var(--border-hairline)'),
      boxShadow: you ? 'none' : 'var(--shadow-xs)',
      font: '13.5px/1.6 var(--font-sans)',
      color: 'var(--text-body)',
      textAlign: 'left'
    }
  }, children), (citations.length > 0 || confidence) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 5,
      justifyContent: you ? 'flex-end' : 'flex-start'
    }
  }, citations.map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      padding: '2.5px 7px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--cobalt-050)',
      border: '1px solid var(--cobalt-200)',
      font: '10.5px/1.3 var(--font-mono)',
      color: 'var(--cobalt-900)',
      whiteSpace: 'nowrap'
    }
  }, c)), confidence && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '10.5px/1 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, "confidence ", confidence))));
}
Object.assign(__ds_scope, { DeviceMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/DeviceMessage.jsx", error: String((e && e.message) || e) }); }

// components/agent/ToolCall.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STATE = {
  ok: {
    icon: 'check',
    fg: 'var(--status-ok-fg)',
    bg: 'var(--status-ok-bg)'
  },
  running: {
    icon: 'loader',
    fg: 'var(--cobalt-700)',
    bg: 'var(--cobalt-050)'
  },
  failed: {
    icon: 'x',
    fg: 'var(--status-down-fg)',
    bg: 'var(--status-down-bg)'
  },
  queued: {
    icon: 'clock',
    fg: 'var(--text-secondary)',
    bg: 'var(--paper-100)'
  }
};

/* One invocation of a Tundra tool — the unit of an agent's audit trail.
   Rendered as a mono row so a reader can see exactly what was called. */
function ToolCall({
  name,
  args = {},
  result,
  status = 'ok',
  duration,
  style,
  ...rest
}) {
  const s = STATE[status] || STATE.ok;
  const entries = Object.entries(args);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      padding: '10px 12px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-xs)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 17,
      height: 17,
      borderRadius: 'var(--radius-xs)',
      flex: '0 0 auto',
      background: s.bg,
      marginTop: 0.5
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: 11,
    color: s.fg
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 12px/1.35 var(--font-mono)',
      color: 'var(--text-display)',
      /* Tool names are a real API surface — never ellipsise one. Long dotted
         names wrap at any character instead of losing their tail. */
      minWidth: 0,
      whiteSpace: 'normal',
      overflowWrap: 'anywhere'
    }
  }, name), duration && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      flex: '0 0 auto',
      font: '10.5px/1.35 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, duration)), entries.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 5,
      paddingLeft: 25
    }
  }, entries.map(([k, v]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2.5px 6px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--paper-100)',
      border: '1px solid var(--line-200)',
      font: '10.5px/1 var(--font-mono)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-display)'
    }
  }, String(v))))), result && /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 25,
      font: '11px/1.45 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, "\u2192 ", result));
}
Object.assign(__ds_scope, { ToolCall });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/ToolCall.jsx", error: String((e && e.message) || e) }); }

// components/charts/NetworkGraph.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  neutral: 'var(--ink-300)'
};
const TYPE = {
  device: {
    label: 'Device',
    icon: 'activity',
    accent: 'var(--stone-600)',
    port: 'source'
  },
  contract: {
    label: 'Contract',
    icon: 'file-text',
    accent: 'var(--cobalt-500)',
    port: 'contract'
  },
  record: {
    label: 'Record',
    icon: 'receipt',
    accent: 'var(--stone-400)',
    port: 'record'
  },
  location: {
    label: 'Location',
    icon: 'map-pin',
    accent: 'var(--amber-500)',
    dot: 'var(--cream-300)',
    port: 'neutral'
  },
  vendor: {
    label: 'Vendor',
    icon: 'building-2',
    accent: 'var(--stone-400)',
    port: 'neutral'
  },
  risk: {
    label: 'Exposure',
    icon: 'triangle-alert',
    accent: 'var(--rust-500)',
    port: 'risk'
  }
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
  const col = n => n.col !== undefined ? n.col : depth.get(n.id) ?? 1;
  const placed = nodes.map(n => ({
    ...n,
    _col: col(n),
    cw: cardW(n, n.id === rootId),
    ch: cardH(n)
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
  return {
    ns: placed,
    byId: new Map(placed.map(n => [n.id, n])),
    width: canvasW,
    height
  };
}

/* A port sits on the card edge, vertically centred on its row (or on the
   titlebar when the edge names no row) — the same rule the reference uses. */
function portY(node, rowId) {
  const rows = rowsOf(node);
  const i = rowId ? rows.findIndex(r => r.id === rowId) : -1;
  if (i < 0) return node.y + HEAD_H / 2 + 3;
  return node.y + HEAD_H + i * ROW_H + ROW_H / 2;
}
function NetworkGraph({
  nodes = [],
  edges = [],
  rootId,
  width = 1000,
  selected,
  onSelect,
  legend = true,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  const root = (nodes.find(n => n.id === rootId) || nodes.find(n => n.type === 'device') || nodes[0] || {}).id;
  const laid = React.useMemo(() => nodes.length ? layout(nodes, edges, root, width) : null, [nodes, edges, root, width]);
  const focus = hover || selected;
  const near = React.useMemo(() => {
    if (!focus) return null;
    const s = new Set([focus]);
    edges.forEach(e => {
      if (e.from === focus) s.add(e.to);
      if (e.to === focus) s.add(e.from);
    });
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
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    style: {
      position: 'relative',
      width: '100%',
      height: height * scale,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--paper-100)',
      backgroundImage: 'var(--pattern-dots-soft)',
      backgroundSize: 'var(--dot-gap) var(--dot-gap)',
      border: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: canvasW,
      height,
      transformOrigin: '0 0',
      transform: `scale(${scale})`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: canvasW,
    height: height,
    style: {
      position: 'absolute',
      inset: 0,
      display: 'block',
      overflow: 'visible'
    }
  }, laid && edges.map((e, i) => {
    const a = laid.byId.get(e.from),
      b = laid.byId.get(e.to);
    if (!a || !b) return null;
    const sameCol = a._col === b._col;
    const forward = a.x < b.x;
    const ay0 = portY(a, e.fromRow),
      by0 = portY(b, e.toRow);
    // Stacked siblings connect bottom-to-top: a right-edge bow would
    // swing outside the canvas and read as a cable leaving the frame.
    const down = a.y < b.y;
    const ax = sameCol ? a.x + a.cw / 2 : forward ? a.x + a.cw : a.x;
    const ay = sameCol ? down ? a.y + a.ch : a.y : ay0;
    const bx = sameCol ? b.x + b.cw / 2 : forward ? b.x : b.x + b.cw;
    const by = sameCol ? down ? b.y : b.y + b.ch : by0;
    const vbow = Math.max(18, Math.abs(by - ay) * 0.5) * (down ? 1 : -1);
    const hbow = Math.max(48, Math.abs(bx - ax) * 0.55) * (forward ? 1 : -1);
    const c1 = sameCol ? `${ax},${ay + vbow}` : `${ax + hbow},${ay}`;
    const c2 = sameCol ? `${bx},${by - vbow}` : `${bx - hbow},${by}`;
    const on = !near || near.has(e.from) && near.has(e.to);
    const danger = e.tone === 'risk';
    const stroke = danger ? 'var(--rust-500)' : on && focus ? 'var(--cobalt-500)' : 'var(--ink-300)';
    return /*#__PURE__*/React.createElement("path", {
      key: i,
      d: `M${ax},${ay} C${c1} ${c2} ${bx},${by}`,
      fill: "none",
      stroke: stroke,
      strokeWidth: danger || on && focus ? 1.5 : 1.1,
      strokeDasharray: e.dashed ? '3 4' : undefined,
      strokeLinecap: "round",
      opacity: on ? danger ? 0.9 : 0.7 : 0.1,
      style: {
        transition: 'opacity var(--dur-base) var(--ease-standard),stroke var(--dur-fast) var(--ease-standard)'
      }
    });
  }), laid && edges.map((e, i) => {
    const a = laid.byId.get(e.from),
      b = laid.byId.get(e.to);
    if (!a || !b) return null;
    const sameCol = a._col === b._col;
    const forward = a.x < b.x;
    const down = a.y < b.y;
    const on = !near || near.has(e.from) && near.has(e.to);
    const c = e.tone === 'risk' ? PORT.risk : PORT[(TYPE[b.type] || TYPE.record).port];
    const co = PORT[(TYPE[a.type] || TYPE.record).port];
    return /*#__PURE__*/React.createElement("g", {
      key: 'p' + i,
      opacity: on ? 1 : 0.15,
      style: {
        transition: 'opacity var(--dur-base) var(--ease-standard)'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: sameCol ? a.x + a.cw / 2 : forward ? a.x + a.cw : a.x,
      cy: sameCol ? down ? a.y + a.ch : a.y : portY(a, e.fromRow),
      r: 4,
      fill: "var(--paper-000)",
      stroke: co,
      strokeWidth: 2.5
    }), /*#__PURE__*/React.createElement("circle", {
      cx: sameCol ? b.x + b.cw / 2 : forward ? b.x : b.x + b.cw,
      cy: sameCol ? down ? b.y : b.y + b.ch : portY(b, e.toRow),
      r: 4,
      fill: "var(--paper-000)",
      stroke: c,
      strokeWidth: 2.5
    }));
  })), laid && laid.ns.map(n => {
    const t = TYPE[n.type] || TYPE.record;
    const isRoot = n.id === root;
    const on = !near || near.has(n.id);
    const sel = selected === n.id;
    return /*#__PURE__*/React.createElement("div", {
      key: n.id,
      onMouseEnter: () => setHover(n.id),
      onMouseLeave: () => setHover(null),
      onClick: () => onSelect && onSelect(n),
      style: {
        position: 'absolute',
        left: n.x,
        top: n.y,
        width: n.cw,
        minHeight: n.ch,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--paper-000)',
        border: `1px solid ${sel ? 'var(--cobalt-500)' : 'var(--line-200)'}`,
        borderRadius: 12,
        boxShadow: sel ? '0 0 0 3px var(--cobalt-100),0 8px 24px rgba(53,52,46,.10)' : '0 1px 2px rgba(53,52,46,.05),0 6px 18px rgba(53,52,46,.07)',
        opacity: on ? 1 : 0.24,
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'opacity var(--dur-base) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: HEAD_H,
        padding: '0 11px',
        borderBottom: rowsOf(n).length || n.footer ? '1px solid var(--border-hairline)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        borderRadius: 4,
        flex: '0 0 auto',
        background: isRoot ? 'var(--surface-primary)' : 'var(--paper-100)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 11,
      color: isRoot ? 'var(--cream-100)' : t.accent
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: `var(--weight-medium) ${isRoot ? 13 : 12.5}px/1 var(--font-sans)`,
        letterSpacing: '-.011em',
        color: 'var(--text-display)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, n.label), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        flex: '0 0 auto'
      }
    }, n.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 9px/1 var(--font-sans)',
        letterSpacing: '.05em',
        textTransform: 'uppercase',
        color: n.type === 'risk' ? 'var(--status-down-fg)' : 'var(--text-secondary)'
      }
    }, n.badge), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 1,
        background: 'var(--ink-300)'
      }
    }))), rowsOf(n).map(r => /*#__PURE__*/React.createElement("div", {
      key: r.id || r.label,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: ROW_H,
        padding: '0 11px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: '1 1 auto',
        minWidth: 0,
        font: '11.5px/1 var(--font-sans)',
        color: 'var(--text-secondary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, r.label), r.value !== undefined && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        flex: '0 0 auto',
        padding: r.pill ? '3px 7px' : 0,
        borderRadius: r.pill ? 5 : 0,
        background: r.pill ? 'var(--paper-100)' : 'transparent',
        border: r.pill ? '1px solid var(--line-200)' : 'none',
        font: `var(--weight-medium) 11px/1.2 ${r.mono === false ? 'var(--font-sans)' : 'var(--font-mono)'}`,
        color: r.tone === 'down' ? 'var(--status-down-fg)' : r.tone === 'ok' ? 'var(--status-ok-fg)' : 'var(--text-display)',
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums'
      }
    }, r.value))), n.footer && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        margin: '4px 11px 0',
        padding: '8px 0 0',
        borderTop: '1px solid var(--border-hairline)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '10.5px/1 var(--font-sans)',
        color: 'var(--text-secondary)'
      }
    }, n.footer.label), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 11.5px/1 var(--font-mono)',
        fontVariantNumeric: 'tabular-nums',
        color: n.footer.tone === 'down' ? 'var(--status-down-fg)' : 'var(--text-display)'
      }
    }, n.footer.value)));
  }))), legend && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-4)'
    }
  }, types.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: '11.5px/1 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: (TYPE[t] || TYPE.record).dot || 'var(--paper-000)',
      border: `2px solid ${PORT[(TYPE[t] || TYPE.record).port]}`
    }
  }), (TYPE[t] || TYPE.record).label))));
}
Object.assign(__ds_scope, { NetworkGraph });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/NetworkGraph.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 'var(--control-height-sm)',
    padding: '0 12px',
    font: '13px',
    gap: 6,
    icon: 14
  },
  md: {
    height: 'var(--control-height)',
    padding: '0 16px',
    font: '14px',
    gap: 7,
    icon: 15
  },
  lg: {
    height: 'var(--control-height-lg)',
    padding: '0 22px',
    font: '14px',
    gap: 8,
    icon: 16
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--surface-primary)',
    color: 'var(--cream-050)',
    border: '1px solid transparent',
    boxShadow: 'var(--shadow-xs)',
    hover: 'var(--surface-primary-hover)',
    active: 'var(--surface-primary-active)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-xs)',
    hover: 'var(--paper-100)',
    active: 'var(--paper-200)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
    boxShadow: 'none',
    hover: 'var(--surface-hover)',
    active: 'var(--surface-active)'
  },
  accent: {
    background: 'var(--surface-accent)',
    color: 'var(--cobalt-700)',
    border: '1px solid var(--cobalt-100)',
    boxShadow: 'none',
    hover: 'var(--surface-accent-hover)',
    active: 'var(--cobalt-100)'
  },
  danger: {
    background: 'var(--rust-050)',
    color: 'var(--rust-700)',
    border: '1px solid rgba(160,90,70,.22)',
    boxShadow: 'none',
    hover: '#F0E0D9',
    active: '#EAD6CE'
  }
};
function Button({
  children,
  variant = 'secondary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled,
  fullWidth,
  type = 'button',
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [a, setA] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.secondary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setA(false);
    },
    onMouseDown: () => setA(true),
    onMouseUp: () => setA(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      font: `var(--weight-medium) ${s.font}/1 var(--font-sans)`,
      letterSpacing: '-.008em',
      background: a ? v.active : h ? v.hover : v.background,
      color: v.color,
      border: v.border,
      borderRadius: 'var(--radius-md)',
      boxShadow: v.boxShadow,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : undefined,
      transition: 'var(--transition-control)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BOX = {
  sm: 30,
  md: 36,
  lg: 40
};
function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  disabled,
  active,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const box = BOX[size] || BOX.md;
  const base = variant === 'secondary' ? {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-xs)'
  } : {
    background: active ? 'var(--surface-active)' : 'transparent',
    border: '1px solid transparent',
    boxShadow: 'none'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: box,
      height: box,
      borderRadius: 'var(--radius-md)',
      color: active ? 'var(--text-body)' : 'var(--text-secondary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.42 : 1,
      transition: 'var(--transition-control)',
      ...base,
      ...(h && !disabled ? {
        background: variant === 'secondary' ? 'var(--paper-050)' : 'var(--surface-hover)',
        color: 'var(--text-body)'
      } : null),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 14 : 16
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  children,
  onRemove,
  mono = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 25,
      padding: onRemove ? '0 5px 0 11px' : '0 11px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      color: 'var(--text-body)',
      font: mono ? `var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)` : `var(--weight-regular) var(--text-caption)/1 var(--font-sans)`,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      padding: 0,
      border: 0,
      borderRadius: '50%',
      background: 'transparent',
      color: 'var(--text-muted)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 11
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/DefinitionList.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DefinitionList({
  items = [],
  columns = 1,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("dl", _extends({
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`,
      gap: 'var(--space-4) var(--space-8)',
      margin: 0,
      ...style
    }
  }, rest), items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.label + i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      font: 'var(--weight-medium) 10.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, it.label), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      minWidth: 0,
      font: it.mono ? 'var(--weight-regular) var(--text-mono)/1.4 var(--font-mono)' : 'var(--weight-regular) var(--text-body-sm)/1.45 var(--font-sans)',
      color: 'var(--text-body)',
      overflowWrap: 'anywhere'
    }
  }, it.value))));
}
Object.assign(__ds_scope, { DefinitionList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DefinitionList.jsx", error: String((e && e.message) || e) }); }

// components/data/StatTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 'var(--text-stat-sm)',
  md: 'var(--text-stat)',
  lg: 'var(--text-stat-lg)'
};
function StatTile({
  label,
  value,
  unit,
  delta,
  deltaTone = 'neutral',
  deltaDirection,
  hint,
  chart,
  size = 'md',
  bare = false,
  tone = 'default',
  style,
  ...rest
}) {
  const inverse = tone === 'inverse';
  const color = tone === 'inverse' ? 'rgba(248,242,220,.72)' : deltaTone === 'ok' ? 'var(--moss-700)' : deltaTone === 'down' ? 'var(--rust-700)' : 'var(--text-muted)';
  const dir = deltaDirection || (deltaTone === 'down' ? 'up' : 'down');
  const labelColor = inverse ? 'var(--cobalt-300)' : 'var(--text-secondary)';
  const valueColor = inverse ? 'var(--cream-100)' : 'var(--text-display)';
  const mutedColor = inverse ? 'rgba(248,242,220,.62)' : 'var(--text-muted)';
  const surface = bare ? {} : {
    padding: 'var(--space-4) var(--space-5) var(--space-5)',
    background: inverse ? 'rgba(248,242,220,.06)' : 'var(--surface-card)',
    border: inverse ? '1px solid var(--border-inverse)' : '1px solid var(--border-hairline)',
    borderRadius: 'var(--radius-lg)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      ...surface,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 10.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: labelColor
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--weight-regular) ${SIZES[size] || SIZES.md}/1 var(--font-sans)`,
      letterSpacing: 'var(--ls-stat)',
      color: valueColor,
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-body-sm)/1 var(--font-sans)',
      color: mutedColor
    }
  }, unit)), chart, (delta || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 'auto',
      paddingTop: 2
    }
  }, delta && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      color,
      font: 'var(--weight-medium) var(--text-caption)/1 var(--font-mono)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: dir === 'up' ? 'arrow-up-right' : 'arrow-down-right',
    size: 12,
    color: color
  }), delta), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1 var(--font-sans)',
      color: mutedColor
    }
  }, hint)));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Table({
  columns = [],
  rows = [],
  onRowClick,
  dense = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  const rowH = dense ? 34 : 42;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: '100%',
      overflowX: 'auto',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'auto'
    }
  }, /*#__PURE__*/React.createElement("thead", {
    style: {
      background: 'var(--surface-header)'
    }
  }, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: '0 var(--space-4)',
      height: 34,
      borderBottom: '1px solid var(--border-hairline)',
      font: 'var(--weight-medium) 10.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      width: c.width
    }
  }, c.header)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id || i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(null),
    onClick: () => onRowClick && onRowClick(r, i),
    style: {
      background: hover === i ? 'var(--surface-hover)' : 'transparent',
      cursor: onRowClick ? 'pointer' : 'default',
      transition: 'background-color var(--dur-fast) var(--ease-standard)'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: '0 var(--space-4)',
      height: rowH,
      borderBottom: '1px solid var(--border-hairline)',
      font: c.mono ? 'var(--weight-regular) var(--text-mono-sm)/1.4 var(--font-mono)' : 'var(--weight-regular) var(--text-body-sm)/1.4 var(--font-sans)',
      color: c.muted ? 'var(--text-secondary)' : 'var(--text-body)',
      whiteSpace: c.wrap ? 'normal' : 'nowrap'
    }
  }, c.render ? c.render(r) : r[c.key])))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/data/Timeline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONE = {
  neutral: 'var(--ink-300)',
  ok: 'var(--moss-500)',
  warn: 'var(--amber-500)',
  down: 'var(--rust-500)',
  info: 'var(--cobalt-500)'
};
function Timeline({
  events = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("ol", _extends({
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, rest), events.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: e.id || i,
    style: {
      display: 'grid',
      gridTemplateColumns: '18px 1fr',
      gap: 12,
      position: 'relative',
      paddingBottom: i === events.length - 1 ? 0 : 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      zIndex: 1,
      marginTop: 4,
      width: e.icon ? 18 : 8,
      height: e.icon ? 18 : 8,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: e.icon ? 'var(--paper-000)' : TONE[e.tone] || TONE.neutral,
      border: e.icon ? '1px solid var(--border-default)' : 'none'
    }
  }, e.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: e.icon,
    size: 10,
    color: TONE[e.tone] || 'var(--text-muted)'
  })), i !== events.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      bottom: -6,
      left: '50%',
      width: 1,
      background: 'var(--border-default)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-body-sm)/1.35 var(--font-sans)',
      color: 'var(--text-display)'
    }
  }, e.title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)',
      color: 'var(--text-muted)'
    }
  }, e.date)), e.description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.5 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, e.description), e.source && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 3,
      font: 'var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)',
      color: 'var(--text-muted)'
    }
  }, e.source)))));
}
Object.assign(__ds_scope, { Timeline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Timeline.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Dialog({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  width = 480,
  style,
  ...rest
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": typeof title === 'string' ? title : undefined,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(59,58,53,.30)',
      backdropFilter: 'blur(2px)',
      animation: 'tundra-fade var(--dur-base) var(--ease-standard)'
    }
  }), /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      width,
      maxWidth: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      background: 'var(--paper-000)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      animation: 'tundra-scale-in var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)',
      padding: 'var(--space-5) var(--space-5) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--weight-medium) var(--text-title-2)/1.2 var(--font-sans)',
      letterSpacing: 'var(--ls-title-2)',
      color: 'var(--text-display)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 6,
      font: 'var(--weight-regular) var(--text-body-sm)/1.5 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, description)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    style: {
      border: 0,
      background: 'transparent',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      padding: 4,
      lineHeight: 0,
      marginTop: -2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  }))), children && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-2)',
      padding: 'var(--space-4) var(--space-5)',
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--paper-050)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: 'var(--space-12) var(--space-6)',
      textAlign: 'center',
      backgroundImage: 'var(--pattern-dots-soft)',
      backgroundSize: 'var(--dot-gap) var(--dot-gap)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      background: 'var(--paper-000)',
      border: '1px solid var(--border-hairline)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 17,
    color: "var(--text-muted)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-size-body)/1.3 var(--font-sans)',
      color: 'var(--text-display)'
    }
  }, title), description && /*#__PURE__*/React.createElement("span", {
    style: {
      maxWidth: 380,
      font: 'var(--weight-regular) var(--text-body-sm)/1.5 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, description), action && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 6
    }
  }, action));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ICONS = {
  info: 'info',
  ok: 'circle-check-big',
  warn: 'triangle-alert',
  down: 'octagon-alert'
};
const FG = {
  info: 'var(--cobalt-500)',
  ok: 'var(--moss-500)',
  warn: 'var(--amber-500)',
  down: 'var(--rust-500)'
};
function Toast({
  title,
  description,
  tone = 'info',
  action,
  onDismiss,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      width: 360,
      padding: '12px 12px 12px 13px',
      background: 'var(--paper-000)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      animation: 'tundra-fade-up var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ICONS[tone],
    size: 16,
    color: FG[tone],
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-body-sm)/1.35 var(--font-sans)',
      color: 'var(--text-display)'
    }
  }, title), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.45 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, description), action && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 4
    }
  }, action)), onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      border: 0,
      background: 'transparent',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      padding: 2,
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tooltip({
  label,
  children,
  placement = 'top',
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 6px)',
    left: '50%',
    transform: 'translateX(-50%)'
  } : placement === 'left' ? {
    right: 'calc(100% + 6px)',
    top: '50%',
    transform: 'translateY(-50%)'
  } : placement === 'right' ? {
    left: 'calc(100% + 6px)',
    top: '50%',
    transform: 'translateY(-50%)'
  } : {
    bottom: 'calc(100% + 6px)',
    left: '50%',
    transform: 'translateX(-50%)'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, rest), children, open && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      zIndex: 40,
      ...pos,
      padding: '5px 9px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-contrast)',
      color: 'var(--cream-100)',
      font: 'var(--weight-regular) var(--text-caption)/1.3 var(--font-sans)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-md)',
      pointerEvents: 'none',
      animation: 'tundra-fade-up var(--dur-fast) var(--ease-out)'
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  description,
  checked,
  indeterminate,
  onChange,
  disabled,
  style,
  ...rest
}) {
  const on = checked || indeterminate;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: description ? 'flex-start' : 'center',
      gap: 9,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: !!checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      flex: '0 0 auto',
      marginTop: description ? 2 : 0,
      borderRadius: 'var(--radius-xs)',
      background: on ? 'var(--stone-700)' : 'var(--surface-card)',
      border: '1px solid ' + (on ? 'var(--stone-700)' : 'var(--border-strong)'),
      boxShadow: 'var(--shadow-xs)',
      transition: 'var(--transition-control)'
    }
  }, indeterminate ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 1.5,
      background: 'var(--cream-100)'
    }
  }) : checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 11,
    color: "var(--cream-100)",
    strokeWidth: 2.5
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-body-sm)/1.35 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.4 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  iconLeft,
  suffix,
  size = 'md',
  mono = false,
  style,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  const height = size === 'sm' ? 'var(--control-height-sm)' : size === 'lg' ? 'var(--control-height-lg)' : 'var(--control-height)';
  const borderColor = error ? 'var(--rust-500)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: uid,
    style: {
      font: 'var(--weight-medium) 14px/1.2 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height,
      padding: '0 10px',
      background: 'var(--surface-card)',
      border: '1px solid ' + borderColor,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? error ? 'var(--ring-danger)' : 'var(--ring-focus)' : 'var(--shadow-xs)',
      transition: 'var(--transition-control)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: 15,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("input", _extends({
    id: uid,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 'none',
      background: 'transparent',
      padding: 0,
      color: 'var(--text-body)',
      font: mono ? 'var(--weight-regular) var(--text-mono)/1.2 var(--font-mono)' : 'var(--weight-regular) 14px/1.2 var(--font-sans)'
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1 var(--font-mono)',
      color: 'var(--text-muted)'
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.35 var(--font-sans)',
      color: error ? 'var(--rust-700)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  label,
  description,
  checked,
  onChange,
  name,
  value,
  disabled,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: description ? 'flex-start' : 'center',
      gap: 9,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    name: name,
    value: value,
    checked: !!checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      flex: '0 0 auto',
      marginTop: description ? 2 : 0,
      borderRadius: '50%',
      background: 'var(--surface-card)',
      border: '1px solid ' + (checked ? 'var(--stone-700)' : 'var(--border-strong)'),
      boxShadow: 'var(--shadow-xs)',
      transition: 'var(--transition-control)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--stone-700)'
    }
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-body-sm)/1.35 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.4 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  options = [],
  size = 'md',
  style,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  const height = size === 'sm' ? 'var(--control-height-sm)' : 'var(--control-height)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: uid,
    style: {
      font: 'var(--weight-medium) 14px/1.2 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height,
      background: 'var(--surface-card)',
      border: '1px solid ' + (focus ? 'var(--border-focus)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? 'var(--ring-focus)' : 'var(--shadow-xs)',
      transition: 'var(--transition-control)'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: uid,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      width: '100%',
      height: '100%',
      padding: '0 30px 0 10px',
      border: 0,
      outline: 'none',
      background: 'transparent',
      color: 'var(--text-body)',
      font: 'var(--weight-regular) 14px/1 var(--font-sans)',
      cursor: 'pointer'
    }
  }, rest), options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 14,
    color: "var(--text-muted)",
    style: {
      position: 'absolute',
      right: 9,
      pointerEvents: 'none'
    }
  })), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.35 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: description ? 'flex-start' : 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: !!checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 34,
      height: 20,
      flex: '0 0 auto',
      marginTop: description ? 1 : 0,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--stone-700)' : 'var(--paper-200)',
      border: '1px solid ' + (checked ? 'var(--stone-700)' : 'var(--border-strong)'),
      transition: 'background-color var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 1.5,
      left: checked ? 15.5 : 1.5,
      width: 15,
      height: 15,
      borderRadius: '50%',
      background: checked ? 'var(--cream-100)' : 'var(--surface-card)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-body-sm)/1.35 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.4 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  label,
  hint,
  error,
  rows = 4,
  style,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: uid,
    style: {
      font: 'var(--weight-medium) 14px/1.2 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: uid,
    rows: rows,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      resize: 'vertical',
      padding: '9px 11px',
      background: 'var(--surface-card)',
      border: '1px solid ' + (error ? 'var(--rust-500)' : focus ? 'var(--border-focus)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focus ? 'var(--ring-focus)' : 'var(--shadow-xs)',
      font: 'var(--weight-regular) 14px/1.55 var(--font-sans)',
      color: 'var(--text-body)',
      transition: 'var(--transition-control)'
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.35 var(--font-sans)',
      color: error ? 'var(--rust-700)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumbs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Breadcrumbs({
  items = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    "aria-label": "Breadcrumb",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
      ...style
    }
  }, rest), items.map((it, i) => {
    const last = i === items.length - 1;
    const label = typeof it === 'string' ? it : it.label;
    const href = typeof it === 'string' ? undefined : it.href;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: label + i
    }, i > 0 && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-right",
      size: 13,
      color: "var(--ink-300)"
    }), last || !href ? /*#__PURE__*/React.createElement("span", {
      "aria-current": last ? 'page' : undefined,
      style: {
        font: `var(--weight-${last ? 'medium' : 'regular'}) var(--text-body-sm)/1.2 var(--font-sans)`,
        color: last ? 'var(--text-body)' : 'var(--text-secondary)'
      }
    }, label) : /*#__PURE__*/React.createElement("a", {
      href: href,
      style: {
        font: 'var(--weight-regular) var(--text-body-sm)/1.2 var(--font-sans)',
        color: 'var(--text-secondary)',
        borderBottom: 0
      }
    }, label));
  }));
}
Object.assign(__ds_scope, { Breadcrumbs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumbs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SidebarNav({
  sections = [],
  value,
  onChange,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      ...style
    }
  }, rest), sections.map((sec, si) => /*#__PURE__*/React.createElement("div", {
    key: sec.label || si,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, sec.label && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 8px 7px',
      font: 'var(--weight-medium) 10.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--ink-600)'
    }
  }, sec.label), (sec.items || []).map(it => {
    const active = it.value === value;
    const hot = hover === it.value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      onClick: () => onChange && onChange(it.value),
      onMouseEnter: () => setHover(it.value),
      onMouseLeave: () => setHover(null),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        width: '100%',
        height: 28,
        padding: '0 8px',
        border: 0,
        borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--surface-selected)' : hot ? 'var(--surface-hover)' : 'transparent',
        boxShadow: active ? 'inset 0 0 0 1px var(--border-accent)' : 'none',
        color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
        font: `var(--weight-${active ? 'medium' : 'regular'}) 13px/1 var(--font-sans)`,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'var(--transition-control)'
      }
    }, it.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 15
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, it.label), it.count !== undefined && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)',
        color: 'var(--text-muted)'
      }
    }, it.count));
  }))));
}
Object.assign(__ds_scope, { SidebarNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  items = [],
  value,
  onChange,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      borderBottom: '1px solid var(--border-hairline)',
      ...style
    }
  }, rest), items.map(it => {
    const id = typeof it === 'string' ? it : it.value;
    const label = typeof it === 'string' ? it : it.label;
    const count = typeof it === 'string' ? undefined : it.count;
    const active = id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      role: "tab",
      "aria-selected": active,
      type: "button",
      onClick: () => onChange && onChange(id),
      onMouseEnter: () => setHover(id),
      onMouseLeave: () => setHover(null),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '0 0 10px',
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        color: active ? 'var(--text-display)' : hover === id ? 'var(--text-body)' : 'var(--text-secondary)',
        font: `var(--weight-${active ? 'medium' : 'regular'}) 14px/1 var(--font-sans)`,
        boxShadow: active ? 'inset 0 -1.5px 0 var(--cobalt-500)' : 'none',
        transition: 'var(--transition-control)'
      }
    }, label, count !== undefined && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-regular) var(--text-mono-sm)/1 var(--font-mono)',
        color: 'var(--text-muted)'
      }
    }, count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AnalyticsScreen.jsx
try { (() => {
const {
  Card,
  StatTile,
  LineChart,
  BarChart,
  DonutChart,
  DotMatrix,
  ProgressBar,
  Sparkline,
  Table,
  Badge,
  Button,
  Tabs
} = window.TundraHealthDesignSystem_1734d4;
const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
const SPEND = [38, 41, 37, 44, 49, 46, 52, 48, 55, 51, 58, 54];
const OOP = [12, 15, 11, 18, 14, 19, 13, 16, 12, 15, 10, 9];
const CALLS = [64, 71, 66, 80, 77, 84, 79, 88, 92, 86, 95, 91];
const PRIOR = [44, 46, 43, 48, 52, 50, 55, 53, 58, 56, 60, 58];
function AnalyticsScreen() {
  const [range, setRange] = React.useState('12m');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      maxWidth: 'var(--width-content)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: range,
    onChange: setRange,
    items: [{
      value: '30d',
      label: '30 days'
    }, {
      value: '90d',
      label: '90 days'
    }, {
      value: '12m',
      label: '12 months'
    }, {
      value: 'fy',
      label: 'Fiscal year'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, [{
    label: 'Maintenance spend',
    value: '$54k',
    delta: '6.1%',
    dir: 'up',
    tone: 'down',
    hint: 'this month',
    chart: /*#__PURE__*/React.createElement(Sparkline, {
      data: SPEND,
      width: 150,
      height: 24
    })
  }, {
    label: 'Out of contract',
    value: '$9k',
    delta: '18%',
    dir: 'down',
    tone: 'ok',
    hint: 'recoverable $61k',
    chart: /*#__PURE__*/React.createElement(Sparkline, {
      data: OOP,
      width: 150,
      height: 24,
      color: "var(--rust-500)"
    })
  }, {
    label: 'Calls triaged',
    value: '91',
    delta: '7%',
    dir: 'up',
    tone: 'ok',
    hint: '57% closed at triage',
    chart: /*#__PURE__*/React.createElement(Sparkline, {
      data: CALLS,
      width: 150,
      height: 24,
      color: "var(--cobalt-500)"
    })
  }, {
    label: 'PM completion',
    value: '82',
    unit: '%',
    hint: '41 of 50 due',
    chart: /*#__PURE__*/React.createElement(ProgressBar, {
      value: 82,
      tone: "ok",
      height: 5,
      style: {
        marginTop: 6
      }
    })
  }].map((s, i) => /*#__PURE__*/React.createElement(StatTile, {
    key: s.label,
    bare: true,
    label: s.label,
    value: s.value,
    unit: s.unit,
    delta: s.delta,
    deltaDirection: s.dir,
    deltaTone: s.tone,
    hint: s.hint,
    chart: s.chart,
    style: {
      padding: 'var(--space-4) var(--space-5)',
      borderLeft: i ? '1px solid var(--border-hairline)' : 'none'
    }
  }))), /*#__PURE__*/React.createElement(Card, {
    title: "Maintenance spend",
    meta: "Contract vs. out-of-contract, $000s \xB7 sourced from AP invoices",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconLeft: "download"
    }, "Export")
  }, /*#__PURE__*/React.createElement(LineChart, {
    height: 210,
    labels: MONTHS,
    markers: true,
    reference: 45,
    referenceLabel: "Budget",
    valueFormat: v => '$' + Math.round(v) + 'k',
    series: [{
      name: 'Contract',
      data: SPEND
    }, {
      name: 'Out of contract',
      data: OOP,
      color: 'var(--rust-500)'
    }, {
      name: 'Prior year',
      data: PRIOR,
      color: 'var(--ink-400)',
      dashed: true
    }]
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Repair calls by month",
    meta: "Volume against the 12-month median"
  }, /*#__PURE__*/React.createElement(DotMatrix, {
    rows: 14,
    valueFormat: v => v + ' calls',
    data: MONTHS.map((m, i) => ({
      label: m,
      value: CALLS[i]
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Spend by vendor",
    meta: "Rolling 12 months"
  }, /*#__PURE__*/React.createElement(BarChart, {
    horizontal: true,
    valueFormat: v => '$' + Math.round(v / 1000) + 'k',
    data: [{
      label: 'Siemens Healthineers',
      value: 412000
    }, {
      label: 'Philips',
      value: 288500
    }, {
      label: 'Getinge',
      value: 96200
    }, {
      label: 'Steris',
      value: 71400
    }, {
      label: 'BD',
      value: 54000
    }]
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Fleet state"
  }, /*#__PURE__*/React.createElement(DonutChart, {
    size: 124,
    centerValue: "6,412",
    centerLabel: "devices",
    data: [{
      label: 'In service',
      value: 5880,
      color: 'var(--moss-500)'
    }, {
      label: 'PM overdue',
      value: 412,
      color: 'var(--amber-500)'
    }, {
      label: 'Down',
      value: 120,
      color: 'var(--rust-500)'
    }]
  }))), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    title: "SLA attainment by vendor",
    meta: "Observed against parsed contract terms"
  }, /*#__PURE__*/React.createElement(Table, {
    dense: true,
    columns: [{
      key: 'vendor',
      header: 'Vendor'
    }, {
      key: 'sla',
      header: 'Committed',
      muted: true
    }, {
      key: 'bar',
      header: 'Attainment',
      width: 220,
      render: r => /*#__PURE__*/React.createElement(ProgressBar, {
        value: r.pct,
        tone: r.pct > 95 ? 'ok' : r.pct > 88 ? 'warn' : 'down',
        height: 6
      })
    }, {
      key: 'pct',
      header: '',
      mono: true,
      align: 'right',
      width: 60,
      render: r => r.pct + '%'
    }, {
      key: 'breach',
      header: 'Breaches',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        dot: true
      }, r.breach)
    }],
    rows: [{
      vendor: 'Philips',
      sla: 'Next business day',
      pct: 98,
      breach: 'None',
      tone: 'ok'
    }, {
      vendor: 'Siemens Healthineers',
      sla: '4h response',
      pct: 91,
      breach: '2 in 12 mo',
      tone: 'warn'
    }, {
      vendor: 'Getinge',
      sla: '8h response',
      pct: 84,
      breach: '6 in 12 mo',
      tone: 'down'
    }]
  })));
}
Object.assign(window, {
  AnalyticsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AnalyticsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
const {
  Logo,
  SidebarNav,
  IconButton,
  Icon,
  Badge
} = window.TundraHealthDesignSystem_1734d4;
function AppShell({
  view,
  setView,
  children,
  title,
  subtitle,
  actions,
  breadcrumb
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      background: 'var(--bg-page)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-width)',
      flex: '0 0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      padding: '14px 10px',
      borderRight: '1px solid var(--border-hairline)',
      background: 'var(--surface-rail)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 6px'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 19
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevrons-left",
    label: "Collapse",
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      height: 30,
      padding: '0 8px',
      margin: '0 0 -8px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--weight-regular) var(--text-body-sm)/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, "Ask or search\u2026"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) 10px/1 var(--font-mono)',
      color: 'var(--ink-300)'
    }
  }, "\u2318K")), /*#__PURE__*/React.createElement(SidebarNav, {
    value: view,
    onChange: setView,
    sections: [{
      items: [{
        value: 'inbox',
        label: 'Triage inbox',
        icon: 'inbox',
        count: 3
      }, {
        value: 'fleet',
        label: 'Fleet',
        icon: 'layout-grid',
        count: 6
      }]
    }, {
      label: 'Workflows',
      items: [{
        value: 'contracts',
        label: 'Contracts & SLAs',
        icon: 'file-text'
      }, {
        value: 'reports',
        label: 'Analytics',
        icon: 'chart-column'
      }]
    }, {
      label: 'Sources',
      items: [{
        value: 'cmms',
        label: 'CMMS',
        icon: 'database'
      }, {
        value: 'invoices',
        label: 'Invoices',
        icon: 'receipt'
      }, {
        value: 'email',
        label: 'Vendor email',
        icon: 'mail'
      }]
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 8px',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: 'var(--cobalt-700)',
      color: 'var(--cream-050)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: 'var(--weight-medium) 10px/1 var(--font-sans)'
    }
  }, "RM"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--weight-regular) var(--text-caption)/1.3 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, "Riverbend Medical"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevrons-up-down",
    size: 13,
    color: "var(--text-muted)"
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      minHeight: 'var(--topbar-height)',
      padding: '10px var(--space-6)',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'var(--surface-header)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, breadcrumb, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--weight-medium) var(--text-title-2)/1.2 var(--font-sans)',
      letterSpacing: 'var(--ls-title-2)',
      color: 'var(--text-display)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 2,
      font: 'var(--weight-regular) var(--text-body-sm)/1.4 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, actions)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 'var(--space-6)'
    }
  }, children)));
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ContractsScreen.jsx
try { (() => {
const {
  Card,
  Table,
  Badge,
  Button,
  StatTile,
  Dialog
} = window.TundraHealthDesignSystem_1734d4;
function ContractsScreen() {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      maxWidth: 'var(--width-content)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "Annual contract spend",
    value: "$850,700",
    hint: "4 vendors"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Verified SLA breaches",
    value: "8",
    hint: "rolling 12 months",
    deltaTone: "down",
    deltaDirection: "up",
    delta: "3"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Recoverable",
    value: "$61,400",
    delta: "18.4%",
    deltaDirection: "up",
    deltaTone: "ok",
    hint: "billed against covered work"
  })), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    title: "Service contracts",
    meta: "Terms parsed from PDFs, checked against real maintenance records",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      iconLeft: "upload"
    }, "Add contract")
  }, /*#__PURE__*/React.createElement(Table, {
    onRowClick: () => setOpen(true),
    columns: [{
      key: 'vendor',
      header: 'Vendor'
    }, {
      key: 'type',
      header: 'Type',
      muted: true
    }, {
      key: 'devices',
      header: 'Devices',
      mono: true,
      align: 'right',
      width: 80
    }, {
      key: 'annual',
      header: 'Annual',
      mono: true,
      align: 'right',
      width: 110
    }, {
      key: 'sla',
      header: 'SLA',
      muted: true
    }, {
      key: 'health',
      header: 'Observed',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        dot: true
      }, r.health)
    }, {
      key: 'ends',
      header: 'Ends',
      mono: true,
      align: 'right',
      width: 110
    }],
    rows: window.TUNDRA_DATA.contracts
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: () => setOpen(false),
    width: 520,
    title: "Dispute 2 covered call-outs?",
    description: "Tundra matched two invoices to work already covered under the full-service clause. Disputing drafts a vendor email with the work order references attached.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => setOpen(false)
    }, "Draft dispute"))
  }));
}
Object.assign(window, {
  ContractsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ContractsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/DeviceScreen.jsx
try { (() => {
const _nsD = window.TundraHealthDesignSystem_1734d4;
const {
  Card,
  Tabs,
  Badge,
  Button,
  Breadcrumbs,
  DefinitionList,
  Timeline,
  Table,
  EmptyState,
  Tooltip,
  Icon,
  NetworkGraph
} = _nsD;
const _Fb = p => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: '10px 12px',
    border: '1px dashed var(--line-300)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--paper-100)',
    font: '11px/1.5 var(--font-mono)',
    color: 'var(--text-secondary)'
  }
}, p.children || p.name || 'Component unavailable in this build.');
const DeviceMessage = _nsD.DeviceMessage || _Fb;
const ToolCall = _nsD.ToolCall || _Fb;
function DeviceScreen({
  device,
  onBack
}) {
  const [tab, setTab] = React.useState('history');
  const [pinned, setPinned] = React.useState(null);
  const d = device || window.TUNDRA_DATA.devices[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      maxWidth: 'var(--width-content)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(DefinitionList, {
    columns: 4,
    items: [{
      label: 'Manufacturer',
      value: d.mfr
    }, {
      label: 'Serial',
      value: d.serial,
      mono: true
    }, {
      label: 'Installed',
      value: d.installed,
      mono: true
    }, {
      label: 'Location',
      value: d.dept + ' · ' + d.room
    }, {
      label: 'Contract',
      value: d.contract
    }, {
      label: 'State',
      value: /*#__PURE__*/React.createElement(Badge, {
        tone: d.tone,
        dot: true
      }, d.state)
    }, {
      label: 'YTD cost',
      value: d.ytd,
      mono: true
    }, {
      label: 'Work orders',
      value: String(d.wo),
      mono: true
    }]
  })), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'ask',
      label: 'Ask',
      count: 96
    }, {
      value: 'graph',
      label: 'Connections',
      count: 7
    }, {
      value: 'history',
      label: 'Service history',
      count: d.wo
    }, {
      value: 'contract',
      label: 'Contract'
    }, {
      value: 'docs',
      label: 'Documents'
    }, {
      value: 'disposition',
      label: 'Repair vs replace'
    }]
  }), tab === 'ask' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 320px',
      gap: 'var(--space-5)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Ask this device",
    meta: "Answers cite the manual and its own history"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(DeviceMessage, {
    speaker: "you"
  }, "Alarming on self-test. What do I check first?"), /*#__PURE__*/React.createElement(DeviceMessage, {
    name: d.name,
    tag: d.id,
    citations: ['Manual §4.2', 'WO-88412', 'WO-71120'],
    confidence: "0.82"
  }, "I have thrown this alarm four times. Three were the expiratory cassette not seated \u2014 reseat it and re-run the self-test before anyone drives out."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-square",
    size: 14,
    color: "var(--text-secondary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: '12.5px/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, "Ask this device\u2026"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    iconRight: "corner-down-left"
  }, "Send")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Routine",
    meta: "Runs on every alarm"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.device.log_event",
    duration: "240ms",
    args: {
      code: 'ST-17'
    },
    result: "Linked to WO-88412"
  }), /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.device.analyze",
    duration: "1.2s",
    args: {
      window: '90d'
    },
    result: "4 events, 3 operator error"
  }), /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.personnel.draft_email",
    status: "running",
    args: {
      to: 'radiology-leads'
    }
  }))))), tab === 'graph' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Device graph",
    meta: "Every record Tundra resolved onto this device \u2014 click a node to isolate it",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconLeft: "maximize-2"
    }, "Expand")
  }, /*#__PURE__*/React.createElement(NetworkGraph, {
    nodes: window.TUNDRA_DATA.graph.nodes,
    edges: window.TUNDRA_DATA.graph.edges,
    rootId: "dev",
    width: 1000,
    selected: pinned,
    onSelect: n => setPinned(p => p === n.id ? null : n.id)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "If this device goes down",
    meta: "Traced through the graph"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, [{
    icon: 'door-closed',
    k: '2 rooms blocked',
    v: 'Radiology 2B and the shared prep bay share the injector line.'
  }, {
    icon: 'calendar-x',
    k: '38 scans/day rerouted',
    v: 'Outpatient CT list has no second scanner on site.'
  }, {
    icon: 'clock',
    k: '4h contract response',
    v: 'Breached twice in the last 12 months.'
  }].map(r => /*#__PURE__*/React.createElement("div", {
    key: r.k,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: r.icon,
    size: 15,
    color: "var(--rust-500)",
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-body-sm)/1.35 var(--font-sans)',
      color: 'var(--text-display)'
    }
  }, r.k), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.5 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, r.v)))))), /*#__PURE__*/React.createElement(Card, {
    title: "Provenance",
    meta: "Nodes by source system",
    padded: false
  }, /*#__PURE__*/React.createElement(Table, {
    dense: true,
    columns: [{
      key: 'src',
      header: 'Source',
      muted: true
    }, {
      key: 'n',
      header: 'Nodes',
      mono: true,
      align: 'right',
      width: 70
    }],
    rows: [{
      src: 'CMMS',
      n: '4'
    }, {
      src: 'AP invoices',
      n: '2'
    }, {
      src: 'Contract PDFs',
      n: '2'
    }, {
      src: 'Scheduling',
      n: '1'
    }, {
      src: 'Inferred',
      n: '1'
    }]
  })))), tab === 'history' && /*#__PURE__*/React.createElement(Card, {
    title: "Unified history",
    meta: "Merged from 4 source systems \u2014 every event keeps its provenance"
  }, /*#__PURE__*/React.createElement(Timeline, {
    events: window.TUNDRA_DATA.events
  })), tab === 'contract' && /*#__PURE__*/React.createElement(Card, {
    padded: false,
    title: "Coverage",
    meta: "Full service \xB7 Siemens Healthineers \xB7 expires 30 Jun 2027"
  }, /*#__PURE__*/React.createElement(Table, {
    columns: [{
      key: 'k',
      header: 'Clause'
    }, {
      key: 'v',
      header: 'Terms'
    }, {
      key: 's',
      header: 'Observed',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        dot: true
      }, r.s)
    }],
    rows: [{
      k: 'Response time',
      v: '4 business hours',
      s: '2 breaches in 12 mo',
      tone: 'warn'
    }, {
      k: 'Uptime commitment',
      v: '97%',
      s: '98.4%',
      tone: 'ok'
    }, {
      k: 'Parts coverage',
      v: 'All, excl. consumables',
      s: '1 disputed invoice',
      tone: 'warn'
    }, {
      k: 'PM cadence',
      v: '2× annually',
      s: 'On schedule',
      tone: 'ok'
    }]
  })), tab === 'docs' && /*#__PURE__*/React.createElement(Card, {
    padded: false
  }, /*#__PURE__*/React.createElement(EmptyState, {
    icon: "file-search",
    title: "No service manual on file",
    description: "Tundra can draft one from 3 service bulletins, 42 work orders and the vendor PM checklist.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "sm",
      iconLeft: "sparkles"
    }, "Generate manual")
  })), tab === 'disposition' && /*#__PURE__*/React.createElement(Card, {
    title: "Repair vs replace",
    meta: "Modelled on full device history",
    actions: /*#__PURE__*/React.createElement(Tooltip, {
      label: "Derived from 42 work orders and 6 invoices"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 14,
      color: "var(--text-muted)"
    }))
  }, /*#__PURE__*/React.createElement(Table, {
    columns: [{
      key: 'k',
      header: ''
    }, {
      key: 'repair',
      header: 'Repair',
      align: 'right',
      mono: true
    }, {
      key: 'replace',
      header: 'Replace',
      align: 'right',
      mono: true
    }],
    rows: [{
      k: '5-year cost of ownership',
      repair: '$214,800',
      replace: '$189,400'
    }, {
      k: 'Expected downtime',
      repair: '6 days',
      replace: '21 days'
    }, {
      k: 'Remaining useful life',
      repair: '2.4 yrs',
      replace: '10 yrs'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 14px',
      background: 'var(--surface-accent-soft)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 15,
    color: "var(--cobalt-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-body-sm)/1.5 var(--font-sans)',
      color: 'var(--cobalt-900)'
    }
  }, "Replace at next capital cycle. Repair cost crosses 60% of replacement value in Q3."))));
}
Object.assign(window, {
  DeviceScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/DeviceScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/FleetScreen.jsx
try { (() => {
const {
  Card,
  Table,
  Badge,
  Button,
  Tag,
  StatTile,
  Input
} = window.TundraHealthDesignSystem_1734d4;
function FleetScreen({
  onOpen
}) {
  const d = window.TUNDRA_DATA.devices;
  const [q, setQ] = React.useState('');
  const rows = d.filter(r => (r.name + r.id + r.dept).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      maxWidth: 'var(--width-content)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, [{
    label: 'Devices tracked',
    value: '6,412',
    hint: '4 source systems'
  }, {
    label: 'Contract spend saved',
    value: '18.4',
    unit: '%',
    delta: '4.2%',
    dir: 'up',
    tone: 'ok',
    hint: 'vs. last FY'
  }, {
    label: 'Calls closed at triage',
    value: '57',
    unit: '%',
    hint: 'last 90 days'
  }, {
    label: 'Mean time to repair',
    value: '3.2',
    unit: 'days',
    delta: '0.6',
    dir: 'down',
    tone: 'ok'
  }].map((s, i) => /*#__PURE__*/React.createElement(StatTile, {
    key: s.label,
    bare: true,
    label: s.label,
    value: s.value,
    unit: s.unit,
    delta: s.delta,
    deltaDirection: s.dir,
    deltaTone: s.tone,
    hint: s.hint,
    style: {
      padding: 'var(--space-4) var(--space-5)',
      borderLeft: i ? '1px solid var(--border-hairline)' : 'none'
    }
  }))), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    title: "Fleet",
    meta: "Ingested from CMMS, AP invoices and vendor email",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconLeft: "filter"
    }, "Filter"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      iconLeft: "download"
    }, "Export"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px var(--space-5)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    iconLeft: "search",
    placeholder: "Search 6,412 devices\u2026",
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      width: 280
    }
  }), /*#__PURE__*/React.createElement(Tag, {
    onRemove: () => {}
  }, "Site: Riverbend Main"), /*#__PURE__*/React.createElement(Tag, {
    onRemove: () => {}
  }, "Status: any")), /*#__PURE__*/React.createElement(Table, {
    dense: true,
    onRowClick: onOpen,
    columns: [{
      key: 'id',
      header: 'Asset tag',
      mono: true,
      width: 120
    }, {
      key: 'name',
      header: 'Device'
    }, {
      key: 'mfr',
      header: 'Manufacturer',
      muted: true
    }, {
      key: 'dept',
      header: 'Department',
      muted: true
    }, {
      key: 'state',
      header: 'State',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        dot: true
      }, r.state)
    }, {
      key: 'wo',
      header: 'WOs',
      mono: true,
      align: 'right',
      width: 60
    }, {
      key: 'ytd',
      header: 'YTD cost',
      mono: true,
      align: 'right',
      width: 100
    }],
    rows: rows
  })));
}
Object.assign(window, {
  FleetScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/FleetScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/TriageScreen.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Table,
  Icon,
  Textarea,
  Toast
} = window.TundraHealthDesignSystem_1734d4;
function TriageScreen({
  onOpenDevice
}) {
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
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'grid',
      gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(520px,1fr) minmax(340px,420px)',
      gap: 'var(--space-5)',
      alignItems: 'start',
      maxWidth: 'var(--width-content)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padded: false,
    title: "Open calls",
    meta: "Routed from the service desk"
  }, /*#__PURE__*/React.createElement(Table, {
    columns: [{
      key: 'id',
      header: 'Call',
      mono: true,
      width: 100
    }, {
      key: 'title',
      header: 'Reported issue',
      wrap: true
    }, {
      key: 'device',
      header: 'Device',
      mono: true,
      width: 110
    }, {
      key: 'verdict',
      header: 'Tundra verdict',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone === 'down' ? 'info' : 'neutral'
      }, r.verdict)
    }, {
      key: 'age',
      header: 'Age',
      mono: true,
      align: 'right',
      width: 80
    }],
    rows: window.TUNDRA_DATA.inbox,
    onRowClick: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: call.id,
    meta: call.title + ' · ' + call.dept,
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconRight: "arrow-up-right",
      onClick: onOpenDevice
    }, "Device")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '12px 13px',
      background: 'var(--surface-accent-soft)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 15,
    color: "var(--cobalt-700)",
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-body-sm)/1.4 var(--font-sans)',
      color: 'var(--cobalt-900)'
    }
  }, "Likely operator error \xB7 confidence ", call.conf), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.55 var(--font-sans)',
      color: 'var(--cobalt-900)',
      opacity: .85
    }
  }, "Self-test alarm 17 matches the expiratory cassette seating fault. Four prior calls on this model closed without a part. Ask the operator to reseat the cassette and re-run the self-test."), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-mono-sm)/1.4 var(--font-mono)',
      color: 'var(--cobalt-700)'
    }
  }, "Manual \xA74.2 \xB7 WO-71120 \xB7 WO-64887"))), /*#__PURE__*/React.createElement(Textarea, {
    label: "Response to the requester",
    rows: 3,
    defaultValue: "Before we dispatch: please reseat the expiratory cassette and re-run the self-test, then reply with the result."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: "send",
    onClick: () => setSent(true)
  }, "Send and hold call"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Dispatch tech")))), sent && /*#__PURE__*/React.createElement(Toast, {
    tone: "ok",
    title: "Response sent",
    description: "Call held for 2 hours pending operator reply.",
    onDismiss: () => setSent(false),
    style: {
      width: '100%'
    }
  })));
}
Object.assign(window, {
  TriageScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/TriageScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
window.TUNDRA_DATA = {
  devices: [{
    id: 'AST-441902',
    name: 'Somatom X.cite CT',
    mfr: 'Siemens Healthineers',
    dept: 'Radiology',
    room: '2B',
    state: 'In service',
    tone: 'ok',
    ytd: '$18,420',
    wo: 42,
    contract: 'Full service',
    serial: 'SN-88213-C',
    installed: '11 Mar 2019'
  }, {
    id: 'AST-330218',
    name: 'Alaris 8100 infusion pump',
    mfr: 'BD',
    dept: 'Med/Surg 4',
    room: '412',
    state: 'PM overdue',
    tone: 'warn',
    ytd: '$2,110',
    wo: 9,
    contract: 'Parts only',
    serial: 'SN-11902-A',
    installed: '04 Aug 2021'
  }, {
    id: 'AST-118740',
    name: 'Servo-u ventilator',
    mfr: 'Getinge',
    dept: 'ICU',
    room: 'ICU-7',
    state: 'Down',
    tone: 'down',
    ytd: '$9,880',
    wo: 23,
    contract: 'Full service',
    serial: 'SN-44710-J',
    installed: '22 Jan 2020'
  }, {
    id: 'AST-509311',
    name: 'Lumify ultrasound',
    mfr: 'Philips',
    dept: 'Emergency',
    room: 'ED-3',
    state: 'In service',
    tone: 'ok',
    ytd: '$740',
    wo: 4,
    contract: 'Warranty',
    serial: 'SN-77120-Q',
    installed: '18 Sep 2024'
  }, {
    id: 'AST-220845',
    name: 'Ingenia 3.0T MRI',
    mfr: 'Philips',
    dept: 'Radiology',
    room: '1A',
    state: 'In service',
    tone: 'ok',
    ytd: '$64,300',
    wo: 31,
    contract: 'Full service',
    serial: 'SN-20114-M',
    installed: '07 Feb 2017'
  }, {
    id: 'AST-771044',
    name: 'Steris Amsco 400 sterilizer',
    mfr: 'Steris',
    dept: 'Sterile Processing',
    room: 'SPD-2',
    state: 'PM overdue',
    tone: 'warn',
    ytd: '$5,260',
    wo: 16,
    contract: 'Full service',
    serial: 'SN-63028-S',
    installed: '30 Nov 2018'
  }],
  inbox: [{
    id: 'CALL-2291',
    device: 'AST-118740',
    title: 'Ventilator alarming on self-test',
    dept: 'ICU',
    age: '6m ago',
    tone: 'down',
    verdict: 'Likely operator error',
    conf: '0.82'
  }, {
    id: 'CALL-2288',
    device: 'AST-330218',
    title: 'Pump display intermittent',
    dept: 'Med/Surg 4',
    age: '41m ago',
    tone: 'warn',
    verdict: 'Dispatch tech',
    conf: '0.71'
  }, {
    id: 'CALL-2284',
    device: 'AST-441902',
    title: 'Table drift during scan',
    dept: 'Radiology',
    age: '2h ago',
    tone: 'warn',
    verdict: 'Under contract — call vendor',
    conf: '0.90'
  }],
  events: [{
    title: 'Corrective repair',
    date: '14 Feb 2026',
    tone: 'down',
    icon: 'wrench',
    description: 'Gantry drive belt replaced. 6.5 labour hours, part 08812-C.',
    source: 'CMMS · WO-88412'
  }, {
    title: 'Invoice reconciled',
    date: '20 Feb 2026',
    tone: 'info',
    icon: 'receipt',
    description: '$4,180 billed against full-service contract — flagged as covered.',
    source: 'AP export · INV-55219'
  }, {
    title: 'PM completed',
    date: '02 Jan 2026',
    tone: 'ok',
    icon: 'check',
    description: 'Annual preventive maintenance, all tolerances in range.',
    source: 'Vendor report · SIE-2201'
  }, {
    title: 'Operator error closed',
    date: '11 Dec 2025',
    tone: 'ok',
    icon: 'user',
    description: 'Call closed at triage — coil not seated.',
    source: 'Tundra triage · CALL-1904'
  }],
  contracts: [{
    vendor: 'Siemens Healthineers',
    type: 'Full service',
    devices: 14,
    annual: '$412,000',
    ends: '30 Jun 2027',
    sla: '4h response',
    health: '2 breaches',
    tone: 'warn'
  }, {
    vendor: 'Philips',
    type: 'Full service',
    devices: 9,
    annual: '$288,500',
    ends: '31 Dec 2026',
    sla: 'Next business day',
    health: 'Met',
    tone: 'ok'
  }, {
    vendor: 'Getinge',
    type: 'Parts + labour',
    devices: 22,
    annual: '$96,200',
    ends: '14 Mar 2027',
    sla: '8h response',
    health: '6 breaches',
    tone: 'down'
  }, {
    vendor: 'BD',
    type: 'Parts only',
    devices: 340,
    annual: '$54,000',
    ends: '01 Sep 2026',
    sla: '—',
    health: 'Met',
    tone: 'ok'
  }],
  graph: {
    nodes: [{
      id: 'wo',
      col: 0,
      order: 0,
      type: 'record',
      label: 'Work orders',
      rows: [{
        id: 'a',
        label: 'WO-88412',
        value: '6.5 h',
        pill: true
      }, {
        id: 'b',
        label: 'WO-71120',
        value: '2.0 h',
        pill: true
      }, {
        id: 'c',
        label: '+40 more',
        value: '214 h'
      }],
      footer: {
        label: 'Source · CMMS',
        value: '42 records'
      }
    }, {
      id: 'inv',
      col: 0,
      order: 1,
      type: 'record',
      label: 'Invoices',
      rows: [{
        id: 'a',
        label: 'INV-55219',
        value: '$4,180',
        pill: true,
        tone: 'down'
      }, {
        id: 'b',
        label: 'INV-51884',
        value: '$1,940',
        pill: true
      }],
      footer: {
        label: 'Source · Finance / AP',
        value: '$18,420'
      }
    }, {
      id: 'ct',
      col: 0,
      order: 2,
      type: 'contract',
      label: 'Service contract',
      badge: '2 breaches',
      rows: [{
        id: 'sla',
        label: 'Availability',
        value: '96.0%',
        pill: true
      }, {
        id: 'resp',
        label: 'Response',
        value: '4 h',
        pill: true
      }, {
        id: 'term',
        label: 'Expires',
        value: '30 Jun 2027'
      }]
    }, {
      id: 'dev',
      col: 1,
      type: 'device',
      label: 'Somatom X.cite CT',
      rows: [{
        id: 'tag',
        label: 'Asset tag',
        value: 'AST-441902'
      }, {
        id: 'hist',
        label: 'Service history',
        value: '42 records'
      }, {
        id: 'cost',
        label: 'Cost YTD',
        value: '$18,420'
      }, {
        id: 'avail',
        label: 'Availability',
        value: '93.4%',
        tone: 'down'
      }, {
        id: 'site',
        label: 'Location',
        value: 'Radiology 2B'
      }]
    }, {
      id: 'room',
      col: 2,
      order: 0,
      type: 'location',
      label: 'Radiology 2B',
      rows: [{
        id: 'load',
        label: 'Throughput',
        value: '38 scans/day'
      }, {
        id: 'alt',
        label: 'Backup scanner',
        value: 'None',
        tone: 'down'
      }]
    }, {
      id: 'risk',
      col: 2,
      order: 1,
      type: 'risk',
      label: 'Exposure',
      rows: [{
        id: 'r1',
        label: 'Rooms blocked',
        value: '2',
        tone: 'down'
      }, {
        id: 'r2',
        label: 'Scans at risk',
        value: '38/day',
        tone: 'down'
      }],
      footer: {
        label: 'If down > 4h',
        value: '$61,400',
        tone: 'down'
      }
    }, {
      id: 'claim',
      col: 2,
      order: 2,
      type: 'contract',
      label: 'Penalty claim',
      rows: [{
        id: 'owed',
        label: 'Owed under §6.2',
        value: '$184,200'
      }, {
        id: 'st',
        label: 'Status',
        value: 'Accepted',
        pill: true,
        tone: 'ok'
      }],
      footer: {
        label: 'Filed 12 Jun 2026',
        value: '$184,200'
      }
    }],
    edges: [{
      from: 'wo',
      to: 'dev',
      fromRow: 'a',
      toRow: 'hist'
    }, {
      from: 'inv',
      to: 'dev',
      fromRow: 'a',
      toRow: 'cost'
    }, {
      from: 'ct',
      to: 'dev',
      fromRow: 'sla',
      toRow: 'avail'
    }, {
      from: 'dev',
      to: 'room',
      fromRow: 'site',
      toRow: 'load'
    }, {
      from: 'dev',
      to: 'claim',
      fromRow: 'avail',
      toRow: 'owed'
    }, {
      from: 'ct',
      to: 'claim',
      fromRow: 'resp',
      toRow: 'owed',
      dashed: true
    }, {
      from: 'room',
      to: 'risk',
      fromRow: 'alt',
      toRow: 'r1',
      tone: 'risk'
    }]
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/AnalysisSection.jsx
try { (() => {
const {
  Card,
  ProgressBar,
  StatTile,
  Table,
  Badge,
  Icon,
  SplitBarChart
} = window.TundraHealthDesignSystem_1734d4;

/* Deterministic series: flat noise while nobody enforces, then a real climb. */
const SERIES = Array.from({
  length: 96
}, (_, i) => {
  const noise = Math.sin(i * 12.9898) * 43758.5453 % 1;
  const n = Math.abs(noise);
  if (i < 44) return 4 + n * 9;
  const t = (i - 44) / 52;
  return 8 + t * 74 + n * 22;
});
function AnalysisSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-lg) var(--space-20)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    n: 5,
    total: 5,
    label: "Contract recovery"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 420px',
      gap: 'var(--space-10)',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement(SlashHeading, null, "Penalties owed. Now actually collected."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, [{
    v: '$280,600',
    k: 'Recovered this FY'
  }, {
    v: '8',
    k: 'Verified SLA breaches'
  }, {
    v: '82%',
    k: 'Claims settled'
  }, {
    v: '—2.4 pts',
    k: 'Availability shortfall'
  }].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.k,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      padding: '14px var(--space-4)',
      background: 'var(--surface-card)',
      borderLeft: i % 2 ? '1px solid var(--border-hairline)' : 'none',
      borderTop: i > 1 ? '1px solid var(--border-hairline)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-title-2)/1 var(--font-sans)',
      letterSpacing: 'var(--ls-title-2)',
      color: 'var(--text-display)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.v), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '11px/1.3 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, s.k))))), /*#__PURE__*/React.createElement(SplitBarChart, {
    data: SERIES,
    split: 44,
    height: 210,
    leftLabel: "Unenforced",
    rightLabel: "With Tundra",
    ticks: ['Q1 24', 'Q3 24', 'Q1 25', 'Q3 25', 'Q1 26', 'Q2 26'],
    valueFormat: v => '$' + Math.round(v) + 'k'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 10.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, "Audit trail"), [{
    i: 'file-text',
    k: 'Clause parsed',
    v: '§6.2 — 96% quarterly'
  }, {
    i: 'activity',
    k: 'Downtime measured',
    v: '214 h across 14 devices'
  }, {
    i: 'gavel',
    k: 'Claim accepted',
    v: '$184,200 · 12 Jun 2026'
  }].map(r => /*#__PURE__*/React.createElement("div", {
    key: r.k,
    style: {
      display: 'flex',
      gap: 9,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: r.i,
    size: 13,
    color: "var(--cobalt-700)",
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 12.5px/1.3 var(--font-sans)',
      color: 'var(--text-display)'
    }
  }, r.k), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '10.5px/1.4 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, r.v)))))), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    style: {
      gridColumn: 'span 2'
    }
  }, /*#__PURE__*/React.createElement(Table, {
    dense: true,
    columns: [{
      key: 'vendor',
      header: 'Counterparty'
    }, {
      key: 'sla',
      header: 'Bought',
      muted: true,
      width: 80
    }, {
      key: 'bar',
      header: 'Delivered',
      width: 140,
      render: r => /*#__PURE__*/React.createElement(ProgressBar, {
        value: r.pct,
        tone: r.pct >= r.target ? 'ok' : r.pct > r.target - 5 ? 'warn' : 'down',
        height: 6
      })
    }, {
      key: 'pct',
      header: '',
      mono: true,
      align: 'right',
      width: 48,
      render: r => r.pct + '%'
    }, {
      key: 'owed',
      header: 'Owed',
      mono: true,
      align: 'right',
      width: 88
    }],
    rows: [{
      vendor: 'Philips',
      sla: '95%',
      target: 95,
      pct: 96,
      owed: '—'
    }, {
      vendor: 'Siemens Healthineers',
      sla: '96%',
      target: 96,
      pct: 93,
      owed: '$184,200'
    }, {
      vendor: 'Getinge',
      sla: '92%',
      target: 92,
      pct: 88,
      owed: '$96,400'
    }, {
      vendor: 'Steris',
      sla: '90%',
      target: 90,
      pct: 90,
      owed: '—'
    }]
  })))));
}
Object.assign(window, {
  AnalysisSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/AnalysisSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/AskSection.jsx
try { (() => {
const _ns = window.TundraHealthDesignSystem_1734d4;
const {
  Card,
  Badge,
  Icon,
  Button
} = _ns;
/* Defaults keep the page alive if the bundle predates the agent group. */
const DeviceMessage = _ns.DeviceMessage || (p => /*#__PURE__*/React.createElement(window.DSFallback, null, p.children));
const ToolCall = _ns.ToolCall || (p => /*#__PURE__*/React.createElement(window.DSFallback, null, p.name));
function AskSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-lg) var(--space-20)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    n: 2,
    total: 5,
    label: "The device answers"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 320px',
      gap: 'var(--space-10)',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement(SlashHeading, null, "Ask the machine. It has the manual and the scar tissue."), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '12.5px/1.5 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, "Every answer cites the page and the work orders behind it.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 330px',
      gap: 'var(--space-4)',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    bodyStyle: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    title: "Somatom X.cite CT",
    meta: "AST-441902 \xB7 Radiology 2B",
    actions: /*#__PURE__*/React.createElement(Badge, {
      tone: "down",
      dot: true
    }, "Alarming")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(DeviceMessage, {
    speaker: "you"
  }, "Alarming on self-test. What do I check first?"), /*#__PURE__*/React.createElement(DeviceMessage, {
    name: "Somatom X.cite CT",
    tag: "AST-441902",
    citations: ['Manual §4.2', 'WO-88412', 'WO-71120'],
    confidence: "0.82"
  }, "I have thrown this alarm four times. Three were the expiratory cassette not seated \u2014 reseat it and re-run the self-test before anyone drives out."), /*#__PURE__*/React.createElement(DeviceMessage, {
    speaker: "you"
  }, "And if that doesn't clear it?"), /*#__PURE__*/React.createElement(DeviceMessage, {
    name: "Somatom X.cite CT",
    tag: "AST-441902",
    citations: ['Manual §4.6', 'Bulletin SB-2024-11'],
    confidence: "0.74"
  }, "Then it is the gantry drive belt. I had it replaced in February; the bulletin revised its tension spec, so the torque figure in your printed copy is stale."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-square",
    size: 14,
    color: "var(--text-secondary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: '12.5px/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, "Ask this device\u2026"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    iconRight: "corner-down-left"
  }, "Send")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "No manual on file?",
    bodyStyle: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '13px/1.55 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, "Roughly a third of a fleet never shipped documentation. Tundra drafts one from service bulletins, prior work orders and the vendor's own PM checklist."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      padding: '10px 11px',
      background: 'var(--cobalt-050)',
      border: '1px solid var(--cobalt-200)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      font: '12px/1 var(--font-sans)',
      color: 'var(--cobalt-900)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 13,
    color: "var(--cobalt-700)"
  }), " Manual generated"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 11.5px/1 var(--font-mono)',
      color: 'var(--cobalt-900)'
    }
  }, "12 pp")))), /*#__PURE__*/React.createElement(Card, {
    title: "What it called",
    meta: "Every answer is auditable",
    bodyStyle: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.manual.lookup",
    duration: "180ms",
    args: {
      section: '4.2'
    },
    result: "Alarm 17 \xB7 cassette seating"
  }), /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.device.history",
    duration: "240ms",
    args: {
      code: 'ST-17'
    },
    result: "4 prior events, 3 closed at triage"
  }), /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.bulletin.diff",
    duration: "310ms",
    args: {
      id: 'SB-2024-11'
    },
    result: "Torque spec revised"
  })))))));
}
Object.assign(window, {
  AskSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/AskSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/GraphSection.jsx
try { (() => {
const {
  Card,
  Table,
  Badge,
  NetworkGraph,
  Icon
} = window.TundraHealthDesignSystem_1734d4;
const NODES = [{
  id: 'wo',
  col: 0,
  order: 0,
  type: 'record',
  label: 'Work orders',
  rows: [{
    id: 'a',
    label: 'WO-88412',
    value: '6.5 h',
    pill: true
  }, {
    id: 'b',
    label: 'WO-71120',
    value: '2.0 h',
    pill: true
  }, {
    id: 'c',
    label: '+40 more',
    value: '214 h'
  }],
  footer: {
    label: 'Source · CMMS',
    value: '42 records'
  }
}, {
  id: 'inv',
  col: 0,
  order: 1,
  type: 'record',
  label: 'Invoices',
  rows: [{
    id: 'a',
    label: 'INV-55219',
    value: '$4,180',
    pill: true,
    tone: 'down'
  }, {
    id: 'b',
    label: 'INV-51884',
    value: '$1,940',
    pill: true
  }],
  footer: {
    label: 'Source · Finance / AP',
    value: '$18,420'
  }
}, {
  id: 'ct',
  col: 0,
  order: 2,
  type: 'contract',
  label: 'Service contract',
  badge: '2 breaches',
  rows: [{
    id: 'sla',
    label: 'Availability',
    value: '96.0%',
    pill: true
  }, {
    id: 'resp',
    label: 'Response',
    value: '4 h',
    pill: true
  }, {
    id: 'term',
    label: 'Expires',
    value: '30 Jun 2027'
  }]
}, {
  id: 'dev',
  col: 1,
  type: 'device',
  label: 'Somatom X.cite CT',
  rows: [{
    id: 'tag',
    label: 'Asset tag',
    value: 'AST-441902'
  }, {
    id: 'hist',
    label: 'Service history',
    value: '42 records'
  }, {
    id: 'cost',
    label: 'Cost YTD',
    value: '$18,420'
  }, {
    id: 'avail',
    label: 'Availability',
    value: '93.4%',
    tone: 'down'
  }, {
    id: 'site',
    label: 'Location',
    value: 'Radiology 2B'
  }]
}, {
  id: 'room',
  col: 2,
  order: 0,
  type: 'location',
  label: 'Radiology 2B',
  rows: [{
    id: 'load',
    label: 'Throughput',
    value: '38 scans/day'
  }, {
    id: 'alt',
    label: 'Backup scanner',
    value: 'None',
    tone: 'down'
  }]
}, {
  id: 'risk',
  col: 2,
  order: 1,
  type: 'risk',
  label: 'Exposure',
  rows: [{
    id: 'r1',
    label: 'Rooms blocked',
    value: '2',
    tone: 'down'
  }, {
    id: 'r2',
    label: 'Scans at risk',
    value: '38/day',
    tone: 'down'
  }],
  footer: {
    label: 'If down > 4h',
    value: '$61,400',
    tone: 'down'
  }
}, {
  id: 'claim',
  col: 2,
  order: 2,
  type: 'contract',
  label: 'Penalty claim',
  rows: [{
    id: 'owed',
    label: 'Owed under §6.2',
    value: '$184,200'
  }, {
    id: 'st',
    label: 'Status',
    value: 'Accepted',
    pill: true,
    tone: 'ok'
  }],
  footer: {
    label: 'Filed 12 Jun 2026',
    value: '$184,200'
  }
}];
const EDGES = [{
  from: 'wo',
  to: 'dev',
  fromRow: 'a',
  toRow: 'hist'
}, {
  from: 'inv',
  to: 'dev',
  fromRow: 'a',
  toRow: 'cost'
}, {
  from: 'ct',
  to: 'dev',
  fromRow: 'sla',
  toRow: 'avail'
}, {
  from: 'dev',
  to: 'room',
  fromRow: 'site',
  toRow: 'load'
}, {
  from: 'dev',
  to: 'claim',
  fromRow: 'avail',
  toRow: 'owed'
}, {
  from: 'ct',
  to: 'claim',
  fromRow: 'resp',
  toRow: 'owed',
  dashed: true
}, {
  from: 'room',
  to: 'risk',
  fromRow: 'alt',
  toRow: 'r1',
  tone: 'risk'
}];
const PROVENANCE = [{
  src: 'CMMS',
  rec: 'WO-88412',
  fact: 'Corrective repair, 6.5 hrs',
  st: 'Matched',
  tone: 'ok'
}, {
  src: 'Finance / AP',
  rec: 'INV-55219',
  fact: '$4,180 billed',
  st: 'Covered',
  tone: 'ok'
}, {
  src: 'Contract PDF',
  rec: 'SIE-FS-2027',
  fact: '4h response clause',
  st: 'Parsed',
  tone: 'info'
}, {
  src: 'Vendor email',
  rec: 'RE: gantry belt',
  fact: 'Part 08812-C lead time',
  st: 'Linked',
  tone: 'info'
}, {
  src: 'OEM bulletin',
  rec: 'SB-2024-11',
  fact: 'Belt tension revision',
  st: 'Applied',
  tone: 'ok'
}];
function GraphSection() {
  const [pinned, setPinned] = React.useState(null);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-lg) var(--space-20)',
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--surface-header)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    n: 1,
    total: 5,
    label: "The device graph"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(SlashHeading, null, "Every record exists. None of it is connected."))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: 'var(--space-10) auto 0'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padded: false,
    style: {
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px var(--space-5)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 13px/1.3 var(--font-sans)',
      color: 'var(--text-display)'
    }
  }, "AST-441902 \xB7 Somatom X.cite"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '11px/1 var(--font-mono)',
      color: 'var(--text-muted)'
    }
  }, "7 resolved records"), /*#__PURE__*/React.createElement(Badge, {
    tone: "info",
    style: {
      marginLeft: 'auto'
    }
  }, "Every cable lands on the field it feeds")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(NetworkGraph, {
    nodes: NODES,
    edges: EDGES,
    rootId: "dev",
    width: 1000,
    legend: false,
    selected: pinned,
    onSelect: n => setPinned(p => p === n.id ? null : n.id)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--surface-header)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px var(--space-5) 0'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "git-branch",
    size: 13,
    color: "var(--text-secondary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 10.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, "Where each node came from")), /*#__PURE__*/React.createElement(Table, {
    dense: true,
    columns: [{
      key: 'src',
      header: 'Source',
      muted: true,
      width: 150
    }, {
      key: 'rec',
      header: 'Record',
      mono: true,
      width: 170
    }, {
      key: 'fact',
      header: 'Contributes',
      wrap: true
    }, {
      key: 'st',
      header: '',
      align: 'right',
      width: 110,
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        dot: true
      }, r.st)
    }],
    rows: PROVENANCE
  })))));
}
Object.assign(window, {
  GraphSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/GraphSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
const {
  Surface,
  Button,
  Badge,
  Tag,
  Card,
  StatTile,
  Sparkline
} = window.TundraHealthDesignSystem_1734d4;
const VENDORS = [{
  v: 'Siemens Healthineers',
  promised: '96.0%',
  actual: '93.4%',
  owed: '$184,200',
  tone: 'down',
  trend: [96, 95, 94, 93, 94, 92, 93, 93]
}, {
  v: 'Philips',
  promised: '95.0%',
  actual: '95.8%',
  owed: '—',
  tone: 'ok',
  trend: [94, 95, 96, 95, 96, 96, 95, 96]
}, {
  v: 'Getinge',
  promised: '92.0%',
  actual: '88.1%',
  owed: '$96,400',
  tone: 'down',
  trend: [91, 90, 89, 88, 87, 88, 89, 88]
}, {
  v: 'Steris',
  promised: '90.0%',
  actual: '90.4%',
  owed: '—',
  tone: 'ok',
  trend: [90, 89, 91, 90, 91, 90, 90, 91]
}];
function Hero() {
  return /*#__PURE__*/React.createElement(Surface, {
    tone: "paper",
    style: {
      padding: 'var(--space-20) var(--gutter-page-lg) var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand"
  }, "An intelligence layer for medical equipment"), /*#__PURE__*/React.createElement("h1", {
    style: {
      maxWidth: 940,
      font: 'var(--weight-regular) var(--text-display-1)/var(--lh-display-1) var(--font-sans)',
      letterSpacing: 'var(--ls-display-1)',
      color: 'var(--text-display)'
    }
  }, "Every machine, finally able to answer"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 640,
      font: 'var(--weight-regular) var(--text-body-lg)/var(--lh-body-lg) var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, "A device's whole life is already written down \u2014 work orders, repair logs, contracts, invoices, vendor email \u2014 just never in one place. Tundra resolves it into a device-centric graph, so the asset itself becomes the thing you query, hold vendors against, and make decisions from."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary"
  }, "Ask your fleet a question"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    iconRight: "arrow-right"
  }, "See the platform"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: 'var(--space-12) auto 0'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padded: false,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px var(--space-5)',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'var(--surface-header)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 10.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, "Fleet position"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '11px/1 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, "Riverbend Medical \xB7 6,412 devices \xB7 FY26"), /*#__PURE__*/React.createElement(Badge, {
    tone: "ok",
    dot: true,
    style: {
      marginLeft: 'auto'
    }
  }, "Live")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, [{
    label: 'Book value under management',
    value: '$412M',
    hint: '6,412 devices'
  }, {
    label: 'Penalties recovered',
    value: '$280,600',
    delta: 'FY26',
    dir: 'up',
    tone: 'ok'
  }, {
    label: 'Availability owed vs delivered',
    value: '−2.4',
    unit: 'pts',
    delta: '2 vendors',
    dir: 'down',
    tone: 'down'
  }, {
    label: 'True cost per device-year',
    value: '$1,840',
    hint: 'measured, not quoted'
  }].map((s, i) => /*#__PURE__*/React.createElement(StatTile, {
    key: s.label,
    bare: true,
    size: "sm",
    label: s.label,
    value: s.value,
    unit: s.unit,
    delta: s.delta,
    deltaDirection: s.dir,
    deltaTone: s.tone,
    hint: s.hint,
    style: {
      padding: 'var(--space-5)',
      borderLeft: i ? '1px solid var(--border-hairline)' : 'none'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5) var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 10.5px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, "Counterparty performance"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '11px/1 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, "Guarantee vs measured availability \xB7 8 quarters")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 90px 90px 110px 96px',
      gap: '0 var(--space-4)',
      alignItems: 'center'
    }
  }, ['Vendor', 'Promised', 'Delivered', 'Penalty owed', ''].map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: h + i,
    style: {
      font: 'var(--weight-medium) 10px/1 var(--font-sans)',
      letterSpacing: '.085em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      textAlign: i > 0 && i < 4 ? 'right' : 'left',
      paddingBottom: 8
    }
  }, h)), VENDORS.map(r => /*#__PURE__*/React.createElement(React.Fragment, {
    key: r.v
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '13px/1 var(--font-sans)',
      color: 'var(--text-body)',
      padding: '11px 0',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, r.v), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '12px/1 var(--font-mono)',
      color: 'var(--text-secondary)',
      textAlign: 'right',
      padding: '11px 0',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, r.promised), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 12px/1 var(--font-mono)',
      color: r.tone === 'down' ? 'var(--status-down-fg)' : 'var(--status-ok-fg)',
      textAlign: 'right',
      padding: '11px 0',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, r.actual), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 12px/1 var(--font-mono)',
      color: r.owed === '—' ? 'var(--text-secondary)' : 'var(--text-display)',
      textAlign: 'right',
      padding: '11px 0',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, r.owed), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '8px 0 8px var(--space-4)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Sparkline, {
    data: r.trend,
    width: 80,
    height: 20,
    color: r.tone === 'down' ? 'var(--rust-500)' : 'var(--moss-500)'
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-5)',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, ['CMMS', 'Procurement', 'Finance / AP', 'Service contracts', 'Vendor email', 'MCP'].map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    mono: true
  }, s)))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/RoutinesSection.jsx
try { (() => {
const _nsR = window.TundraHealthDesignSystem_1734d4;
const {
  Card,
  Badge,
  Icon,
  Button,
  Tag
} = _nsR;
const ToolCall = _nsR.ToolCall || (p => /*#__PURE__*/React.createElement(window.DSFallback, null, p.name));
function RoutinesSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-lg) var(--space-20)',
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--surface-header)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    n: 3,
    total: 5,
    label: "Routines and integration"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 340px',
      gap: 'var(--space-10)',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement(SlashHeading, null, "It lives in the software you already use"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '12.5px/1.5 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, "Tundra ships as an MCP server. Your tools call it; it reads and writes the graph.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '320px minmax(0,1fr)',
      gap: 'var(--space-4)',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Custom routine",
    meta: "Logged from your own software",
    bodyStyle: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 5,
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    mono: true
  }, "on: alarm"), /*#__PURE__*/React.createElement(Tag, {
    mono: true
  }, "every: 24h")), /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.device.log_event",
    duration: "240ms",
    args: {
      asset: 'AST-441902',
      type: 'alarm',
      code: 'ST-17'
    },
    result: "Written \xB7 linked to WO-88412"
  }), /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.device.analyze",
    duration: "1.2s",
    args: {
      window: '90d'
    },
    result: "Recurring \xB7 4 events, 3 operator error"
  }), /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.personnel.draft_email",
    duration: "620ms",
    args: {
      to: 'radiology-leads',
      about: 'AST-441902'
    },
    result: "Draft ready for review"
  }), /*#__PURE__*/React.createElement(ToolCall, {
    name: "tundra.report.append",
    status: "queued",
    args: {
      report: 'monthly-htm'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 'auto',
      paddingTop: 'var(--space-3)',
      borderTop: '1px solid var(--border-hairline)',
      font: '11px/1.5 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, "4 steps \xB7 no human in the loop until the draft"))), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    bodyStyle: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    title: "The device writes to the people who know",
    meta: "Drafted, never sent without you"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '74px minmax(0,1fr)',
      gap: '8px 12px',
      padding: 'var(--space-4) var(--space-5)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, [['To', 'Priya N. · Lead radiographer, 2B'], ['Cc', 'BioMed on-call'], ['Subject', 'AST-441902 — self-test alarm 17, four times since May']].map(([k, v]) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: k
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '10.5px/1.5 var(--font-mono)',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '13px/1.5 var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: '13.5px/1.65 var(--font-sans)',
      color: 'var(--text-body)',
      maxWidth: '62ch'
    }
  }, "Hello Priya \u2014 this is the CT in 2B. I have raised self-test alarm 17 four times since May, and three of those closed without a part. The pattern points at how the cassette is being seated after a cleaning cycle."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '13.5px/1.65 var(--font-sans)',
      color: 'var(--text-body)',
      maxWidth: '62ch'
    }
  }, "Two questions, so I can stop wasting your morning: who reseats the cassette on the late shift, and has the cleaning routine changed since April? If it has, I will flag it to BioMed and update my own notes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 5
    }
  }, ['Manual §4.2', 'WO-88412', 'WO-71120', 'WO-64887'].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      padding: '2.5px 7px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--cobalt-050)',
      border: '1px solid var(--cobalt-200)',
      font: '10.5px/1.3 var(--font-mono)',
      color: 'var(--cobalt-900)',
      whiteSpace: 'nowrap'
    }
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary",
    iconLeft: "send"
  }, "Send as the device"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost"
  }, "Edit draft"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: '11px/1 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 13,
    color: "var(--text-secondary)"
  }), " Nothing leaves without approval"))))))));
}
Object.assign(window, {
  RoutinesSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/RoutinesSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteBits.jsx
try { (() => {
const {
  Icon
} = window.TundraHealthDesignSystem_1734d4;

/* Shared site furniture: the numbered section rule and the slash-framed
   headline. Both come straight from the brand's technical-drawing register. */

function SectionMarker({
  n,
  total = 5,
  label,
  tone = 'default'
}) {
  const dim = tone === 'inverse';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '10.5px/1 var(--font-mono)',
      color: dim ? 'var(--cobalt-300)' : 'var(--text-muted)',
      whiteSpace: 'nowrap'
    }
  }, "[ N.", String(n).padStart(2, '0'), "/", String(total).padStart(2, '0'), " ]"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 1,
      background: dim ? 'var(--border-inverse)' : 'var(--border-default)',
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 10.5px/1 var(--font-sans)',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: dim ? 'var(--cream-100)' : 'var(--text-secondary)',
      whiteSpace: 'nowrap'
    }
  }, "> ", label));
}
function SlashHeading({
  children,
  tone = 'default',
  size = 'var(--text-display-2)'
}) {
  const dim = tone === 'inverse';
  return /*#__PURE__*/React.createElement("h2", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      font: `var(--weight-regular) ${size}/var(--lh-display-2) var(--font-sans)`,
      letterSpacing: 'var(--ls-display-2)',
      color: dim ? 'var(--cream-100)' : 'var(--text-display)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-300)',
      flex: '0 0 auto'
    }
  }, "/"), /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-300)',
      flex: '0 0 auto'
    }
  }, "/"));
}

/* Isometric layer stack — the four source systems collapsing onto one device
   record. Drawn as CSS-transformed planes, not an illustration file. */
function IsoStack({
  layers = [],
  accentIndex = 0
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 60 + layers.length * 62,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 340,
      height: layers.length * 62,
      transformStyle: 'preserve-3d'
    }
  }, layers.map((l, i) => {
    const hot = i === accentIndex;
    return /*#__PURE__*/React.createElement("div", {
      key: l.label,
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: i * 62,
        height: 96,
        transform: 'rotateX(56deg) rotateZ(-45deg)',
        transformOrigin: '50% 50%',
        background: hot ? 'var(--cobalt-050)' : 'var(--paper-000)',
        border: '1px solid ' + (hot ? 'var(--cobalt-500)' : 'var(--line-200)'),
        borderRadius: 6,
        boxShadow: hot ? '0 12px 28px rgba(66,82,124,.16)' : '0 8px 20px rgba(53,52,46,.07)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: hot ? '58%' : '42%',
        height: 5,
        borderRadius: 2,
        background: hot ? 'var(--cobalt-300)' : 'var(--paper-200)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: '76%',
        height: 4,
        borderRadius: 2,
        background: 'var(--paper-200)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: '64%',
        height: 4,
        borderRadius: 2,
        background: 'var(--paper-200)'
      }
    })));
  }), layers.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: 'lbl' + l.label,
    style: {
      position: 'absolute',
      left: -176,
      top: i * 62 + 34,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: 176
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'right',
      font: '10px/1 var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: i === accentIndex ? 'var(--cobalt-700)' : 'var(--text-muted)'
    }
  }, l.label), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 1,
      background: i === accentIndex ? 'var(--cobalt-500)' : 'var(--border-default)'
    }
  }))), layers.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: 'v' + l.label,
    style: {
      position: 'absolute',
      right: -150,
      top: i * 62 + 34,
      width: 150,
      font: '10px/1 var(--font-mono)',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, l.note))));
}

/* Resilience: a kit must degrade, never white-screen. DSFallback stands in for an
   export the loaded bundle does not have yet; SectionBoundary keeps one failing
   section from unmounting the whole page. */
function DSFallback({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px',
      border: '1px dashed var(--line-300)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--paper-100)',
      font: '11px/1.5 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, children || 'Component unavailable in this build.');
}
class SectionBoundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = {
      failed: false
    };
  }
  static getDerivedStateFromError() {
    return {
      failed: true
    };
  }
  componentDidCatch(e) {
    console.error('Section failed to render:', e);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: 'var(--space-12) var(--gutter-page-lg)',
        borderTop: '1px solid var(--border-hairline)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--width-content)',
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement(DSFallback, null, "This section could not render. The rest of the page is unaffected.")));
  }
}
Object.assign(window, {
  SectionMarker,
  SlashHeading,
  IsoStack,
  DSFallback,
  SectionBoundary
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteBits.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteFooter.jsx
try { (() => {
const {
  Logo,
  Button,
  Surface,
  Input
} = window.TundraHealthDesignSystem_1734d4;
function SiteFooter() {
  const cols = [{
    h: 'Platform',
    items: ['Device graph', 'Ask a device', 'Routines & MCP', 'Contract recovery']
  }, {
    h: 'Company',
    items: ['About', 'Careers', 'Security', 'Contact']
  }, {
    h: 'Resources',
    items: ['Docs', 'Integrations', 'Methodology', 'Status']
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Surface, {
    tone: "cream",
    style: {
      padding: 'var(--space-20) var(--gutter-page-lg)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-narrow)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--weight-medium) var(--text-display-2)/var(--lh-display-2) var(--font-sans)',
      letterSpacing: 'var(--ls-display-2)',
      color: 'var(--ink-900)'
    }
  }, "Find out what your vendors already owe you"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--weight-regular) var(--text-body-lg)/var(--lh-body-lg) var(--font-sans)',
      color: 'var(--ink-700)',
      maxWidth: '52ch'
    }
  }, "Send us a CMMS export and your service contracts. We will come back with an audited number \u2014 and we only get paid out of what we recover."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "lg",
    placeholder: "you@hospital.org",
    style: {
      width: 280
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary"
  }, "Audit my contracts")))), /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: 'var(--space-12) var(--gutter-page-lg)',
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--bg-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(3,1fr)',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 19
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) var(--text-caption)/1.5 var(--font-sans)',
      color: 'var(--text-muted)',
      maxWidth: '32ch'
    }
  }, "Asset management for physical capital. Hospitals first.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-label)/1 var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, c.h), c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      font: 'var(--weight-regular) var(--text-body-sm)/1.6 var(--font-sans)',
      color: 'var(--text-secondary)',
      borderBottom: 0
    }
  }, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: 'var(--space-10) auto 0',
      paddingTop: 'var(--space-5)',
      borderTop: '1px solid var(--border-hairline)',
      display: 'flex',
      justifyContent: 'space-between',
      font: 'var(--weight-regular) var(--text-caption)/1 var(--font-sans)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Tundra"), /*#__PURE__*/React.createElement("span", null, "Privacy \xB7 Terms \xB7 HIPAA"))));
}
Object.assign(window, {
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteHeader.jsx
try { (() => {
const {
  Logo,
  Button
} = window.TundraHealthDesignSystem_1734d4;
function SiteHeader() {
  const links = ['Platform', 'Ask a device', 'Routines', 'Contract recovery'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      height: 60,
      padding: '0 var(--gutter-page-lg)',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'rgba(242,241,237,.82)',
      backdropFilter: 'blur(10px)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 20
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)'
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      font: 'var(--weight-regular) var(--text-body-sm)/1 var(--font-sans)',
      color: 'var(--text-secondary)',
      borderBottom: 0
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      font: 'var(--weight-regular) var(--text-body-sm)/1 var(--font-sans)',
      color: 'var(--text-secondary)',
      borderBottom: 0
    }
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary"
  }, "Audit my contracts")));
}
Object.assign(window, {
  SiteHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/UseCases.jsx
try { (() => {
const {
  Card,
  Icon,
  Sparkline,
  ProgressBar
} = window.TundraHealthDesignSystem_1734d4;
function Visual({
  kind
}) {
  if (kind === 'cost') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, [{
      k: 'Parts',
      v: 38
    }, {
      k: 'Labour',
      v: 64
    }, {
      k: 'Downtime',
      v: 82
    }, {
      k: 'Contract',
      v: 47
    }].map(r => /*#__PURE__*/React.createElement("div", {
      key: r.k,
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,62px) 1fr',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '10.5px/1 var(--font-sans)',
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, r.k), /*#__PURE__*/React.createElement(ProgressBar, {
      value: r.v,
      height: 6
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 3,
        paddingTop: 8,
        borderTop: '1px solid var(--border-hairline)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '10.5px/1 var(--font-sans)',
        color: 'var(--text-secondary)'
      }
    }, "True cost per device-year"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 12px/1 var(--font-mono)',
        color: 'var(--text-display)'
      }
    }, "$1,840")));
  }
  if (kind === 'enforce') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }
    }, [{
      k: 'Guaranteed',
      v: '96.0%',
      tone: 'var(--text-secondary)'
    }, {
      k: 'Delivered',
      v: '93.4%',
      tone: 'var(--status-down-fg)'
    }].map(r => /*#__PURE__*/React.createElement("div", {
      key: r.k,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '11px/1 var(--font-sans)',
        color: 'var(--text-secondary)'
      }
    }, r.k), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 15px/1 var(--font-mono)',
        color: r.tone,
        fontVariantNumeric: 'tabular-nums'
      }
    }, r.v))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 3,
        padding: '9px 10px',
        background: 'var(--status-ok-bg)',
        border: '1px solid rgba(79,122,92,.24)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: '11px/1 var(--font-sans)',
        color: 'var(--status-ok-fg)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "gavel",
      size: 13,
      color: "var(--status-ok-fg)"
    }), " Claim accepted"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 12px/1 var(--font-mono)',
        color: 'var(--status-ok-fg)'
      }
    }, "$184,200")));
  }
  if (kind === 'decide') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, [{
      k: 'Repair',
      v: '$214,800',
      sub: '2.4 yrs left',
      win: false
    }, {
      k: 'Replace',
      v: '$189,400',
      sub: '10 yrs left',
      win: true
    }].map(r => /*#__PURE__*/React.createElement("div", {
      key: r.k,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: '10px 11px',
        background: r.win ? 'var(--cobalt-050)' : 'var(--paper-100)',
        border: '1px solid ' + (r.win ? 'var(--cobalt-200)' : 'var(--border-hairline)'),
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 12px/1 var(--font-sans)',
        color: 'var(--text-display)'
      }
    }, r.k), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '10px/1 var(--font-sans)',
        color: 'var(--text-secondary)'
      }
    }, r.sub)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 13px/1 var(--font-mono)',
        color: 'var(--text-display)'
      }
    }, r.v), r.win && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14,
      color: "var(--cobalt-700)"
    })))));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, [{
    k: 'Radiology 2B',
    v: 94,
    tone: 'down',
    s: [88, 90, 93, 95, 94, 96, 95, 94]
  }, {
    k: 'Radiology 1A',
    v: 41,
    tone: 'ok',
    s: [62, 58, 52, 49, 45, 43, 42, 41]
  }, {
    k: 'Emergency',
    v: 77,
    tone: 'default',
    s: [70, 72, 74, 76, 75, 77, 78, 77]
  }].map(r => /*#__PURE__*/React.createElement("div", {
    key: r.k,
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 56px 38px',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '11px/1 var(--font-sans)',
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, r.k), /*#__PURE__*/React.createElement(Sparkline, {
    data: r.s,
    width: 56,
    height: 18,
    color: r.tone === 'down' ? 'var(--rust-500)' : r.tone === 'ok' ? 'var(--moss-500)' : 'var(--stone-400)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) 11.5px/1 var(--font-mono)',
      textAlign: 'right',
      color: r.tone === 'down' ? 'var(--status-down-fg)' : 'var(--text-display)'
    }
  }, r.v, "%"))), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 3,
      paddingTop: 8,
      borderTop: '1px solid var(--border-hairline)',
      font: '10.5px/1.4 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, "Utilisation across the fleet \u2014 one scanner is stranded."));
}
const DISCIPLINES = [{
  n: '01',
  icon: 'calculator',
  kind: 'cost',
  title: 'Know what it costs',
  body: 'Every work order, part, hour and invoice on one device.'
}, {
  n: '02',
  icon: 'gavel',
  kind: 'enforce',
  title: 'Enforce what it owes',
  body: 'Guarantees audited against the maintenance record.'
}, {
  n: '03',
  icon: 'git-compare',
  kind: 'decide',
  title: 'Repair, replace or re-procure',
  body: 'Against the full record, not a renewal proposal.'
}, {
  n: '04',
  icon: 'shuffle',
  kind: 'reallocate',
  title: 'Reallocate what is stranded',
  body: 'Utilisation and failure curves across the fleet.'
}];
function UseCases() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--space-16) var(--gutter-page-lg) var(--space-20)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--width-content)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    n: 4,
    total: 5,
    label: "Portfolio discipline"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-8)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SlashHeading, null, "Operated for decades. Never managed."), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '12.5px/1.5 var(--font-sans)',
      color: 'var(--text-secondary)',
      maxWidth: '30ch'
    }
  }, "Four disciplines, none of which existed for equipment.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--space-4)',
      alignItems: 'stretch'
    }
  }, DISCIPLINES.map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.n,
    style: {
      display: 'flex',
      flexDirection: 'column'
    },
    bodyStyle: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.icon,
    size: 16,
    color: "var(--cobalt-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: '10.5px/1 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, c.n)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--weight-medium) var(--text-title-3)/1.25 var(--font-sans)',
      letterSpacing: 'var(--ls-title-3)',
      color: 'var(--text-display)'
    }
  }, c.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '12.5px/1.5 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, c.body)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 'var(--space-3)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Visual, {
    kind: c.kind
  }))))))));
}
Object.assign(window, {
  UseCases
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/UseCases.jsx", error: String((e && e.message) || e) }); }

__ds_ns.DeviceMessage = __ds_scope.DeviceMessage;

__ds_ns.ToolCall = __ds_scope.ToolCall;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Surface = __ds_scope.Surface;

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.DonutChart = __ds_scope.DonutChart;

__ds_ns.DotMatrix = __ds_scope.DotMatrix;

__ds_ns.LineChart = __ds_scope.LineChart;

__ds_ns.NetworkGraph = __ds_scope.NetworkGraph;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Sparkline = __ds_scope.Sparkline;

__ds_ns.SplitBarChart = __ds_scope.SplitBarChart;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.GLYPHS = __ds_scope.GLYPHS;

__ds_ns.DefinitionList = __ds_scope.DefinitionList;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Timeline = __ds_scope.Timeline;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Breadcrumbs = __ds_scope.Breadcrumbs;

__ds_ns.SidebarNav = __ds_scope.SidebarNav;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
