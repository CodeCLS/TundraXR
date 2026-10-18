# Tundra — Design System

**Tundra is asset management for physical capital.** Machines — medical devices, industrial
machinery, elevators, fleets — are the last unmanaged asset class. Financial capital has
Bloomberg, Aladdin, ratings agencies and exchanges; physical capital has record-keeping
software from the nineties. Everyone on the *sell* side (OEMs, service providers) knows what
those machines cost, how often they fail and what their uptime is worth. Owners don't, and
that asymmetry is priced into every service contract, repair bill and replacement decision.

Tundra is the owner's side of the table: we manage your machines the way an asset manager
manages a portfolio.

**The four disciplines** — know what each asset truly costs and yields; enforce what its
counterparties owe; decide repair vs. replace vs. re-procure against what the market offers
now; reallocate when a better machine beats the one on the floor.

**Where we start: hospitals.** Equipment data is scattered across CMMS, procurement, finance
and vendor email. Tundra unifies it into one device-centric graph, puts agents on top, and
then does the thing no CMMS ever did — it touches the money. Hospitals buy 90–96% availability
guarantees with penalty clauses nobody has the manpower to enforce. Agents audit every contract
against actual maintenance history and recover the penalties owed; Tundra takes a share of the
recovery. The product pays for itself out of the vendor's pocket, which is exactly why no
vendor-owned platform can copy it.

**What compounds:** the first buyer-side dataset on physical equipment — true failure rates by
model, true cost per device-year, vendor performance measured rather than promised. No OEM will
assemble it, because it is evidence against them. With enough owners, Tundra becomes the
reference price. And the next asset class is being born rigged: robots arrive as
Robotics-as-a-Service, phoning home to their manufacturer, with the vendor defining "uptime"
and pricing renewals against a customer holding zero independent data.

*Audit the contracts. Manage the fleet. Own the benchmark. Set the price. Underwrite the risk.*

## Sources this system was built from

| Source | What it gave us |
| --- | --- |
| `uploads/Group 29 (3).svg` | The Tundra ridge mark (vector). Copied to `assets/tundra-mark.svg`; ink and currentColor variants derived. |
| `uploads/Group 29 (2).png` | Same mark, raster. Copied to `assets/tundra-mark.png`. |
| Founder's written brief | Product description, use cases, outcome figures, and the mood-board direction: "minimalistic, Notion, healthcare, tundrahealth.ai dotted/grained, OpenAI-similar". |
| Mood board (14 images, uploaded to `uploads/moodboard-*.jpg`) | The primary visual reference. Read directly. See "What the board says" below. |
| https://tundrahealth.ai | Public marketing copy was readable; the site's stylesheet, fonts and imagery were not. No colours, type or components were lifted from it. |

**There was no codebase, Figma file or deck.** Everything below the logo is an
original system built to the brief — not a recreation of an existing product UI.
Treat the component inventory and the UI kits as a proposal to react to, not as
documentation of software that already ships.

---

## Content fundamentals

Tundra writes like a senior biomed who has read the contract. Plain, specific,
unhurried. The product's credibility comes from provenance, so copy names its
sources rather than asserting confidence.

- **Voice:** knowledgeable peer, never vendor-cheerful. No exclamation marks. The register is *financial*, not IT: position, exposure, counterparty, recovery, mark, benchmark, book value — the vocabulary of an asset manager applied to machines.
- **Name the adversary plainly.** Tundra's copy says which side of the table it is on: "the sell side has the data", "out of the vendor's pocket", "evidence against them". Never soften this into partnership language.
- **Measured, not promised.** The single most repeated construction in the brand. Any vendor-supplied number is labelled as a claim; any Tundra number is labelled as measured. "96% guaranteed / 93.4% delivered" is the house pattern.
- **Person:** "you" for the reader; "Tundra" for the product; never "we" inside the product UI (marketing may use "we" sparingly, e.g. "Send us a CMMS export").
- **Casing:** sentence case for anything read as language — buttons, headings, badges, menu items. **Micro-labels are uppercase**: table column heads, stat labels, sidebar section labels and definition-list terms all set 10.5px medium at `.085em` in `--text-secondary` (4.68:1 on card — `--text-muted` fails AA at this size and is reserved for text 12px and above). Marketing eyebrows use the larger `--text-label` (11px / .09em).
- **Emoji:** never. Not in the product, not in marketing, not in status labels.
- **Numbers:** always concrete and always in mono. "42 work orders", "$18,420", "4h response". Hedge with "up to" when the figure is a range, never with vague adjectives.
- **Provenance is copy, not metadata.** Every derived fact carries its source line: `CMMS · WO-88412`, `Manual §4.2`, `Vendor report · SIE-2201`. Agent output always states confidence: "Likely operator error · confidence 0.82".
- **Verbs over nouns in actions:** "Generate manual", "Draft dispute", "Send and hold call" — not "Manual generation" or "Submit".
- **Empty states say what is missing and what Tundra can do:** "No manual on file. Tundra can draft one from service bulletins and prior work orders."
- **Marketing headlines** are one idea, ≤10 words, no colon-subtitle construction: "An AI-readable brain for every device in your hospital"; "Every record already exists. None of it is connected."
- **Avoid:** "seamless", "revolutionise", "unlock", "powerful", "leverage", "AI-powered" as a bare adjective.

## What the mood board says

Fourteen references, and they agree with each other:

1. **Warm bone-grey ground, not white.** Pages sit on `#F4F2EA`; cards are a shade *lighter* (`#FCFBF7`), separated by hairlines, not shadows.
2. **Near-monochrome with one electric blue.** Ink, bone and grey carry everything; a saturated cobalt appears only in links, one accent dot, or a single graphic element.
3. **Uppercase, wide-tracked micro-labels everywhere.** "TOTAL REVENUE", "90-DAY ACTIONS", "PROFILE", "ABOUT" — 10.5px, .085em, muted. This is the board's most consistent signal.
4. **Big numbers set light, not bold.** `$20,320`, `310`, `04`, `16.0` — large, regular weight, tight tracking, tabular.
5. **Dot-matrix data.** Two references render bar charts as stacks of small squares and trends as dot fields — data drawn from the same dot vocabulary as the brand's survey grid.
6. **Hairline-divided strips over card grids.** Stats sit in one bordered strip split by vertical rules, not in four floating cards.
7. **Grain and soft blue haze** as the only "imagery" — no photography, no illustration.

## Visual foundations

**Feel.** Cold subject, warm paper. The palette is a warm off-white sheet with cool
grey-blue ink on it — an engineering survey printed on good stock. Minimal, Notion-dense
in the app, OpenAI-quiet in marketing.

- **Colour.** One brand hue: the logo cream `--cream-100` `#F8F2DC`. The ground is warm bone grey `--paper-100` `#F4F2EA` with cards a shade lighter at `--paper-050` `#FCFBF7`. Ink is cool neutral. **Nothing in Tundra is black.** The darkest value in the system is `--stone-800` `#35342E` (body text only). Filled surfaces stop at `--stone-600` `#55524A` — a warm mid graphite used for the primary button, the contrast band and the tooltip. A pure or near-pure black anywhere is a bug. A single accent, a muted clinical blue `--cobalt-500/700` `#5A6E9E`, carries links, focus rings and everything the agent does; `--glacier-*` remains as an alias to it.

  **One family, no jumps.** This is the rule that governs every other colour decision. Ink is
  warm-neutral (`#191917`, not blue-black) so it belongs to the bone ground; cobalt is
  *desaturated* into that same warmth; status colours are earthy, not clinical. Filled colour
  is rationed: exactly one graphite primary button per view, and the accent/danger buttons are
  soft **tints** (`--surface-accent`, `--rust-050`) rather than saturated slabs. The logo cream
  `#F8F2DC` is artwork-only — large cream areas use `--cream-surface` `#F1ECDD`, which is close
  enough to bone that the band reads as a shift in tone, not a different palette. Status is moss / amber / rust — earthy, never neon. Maximum two background colours per screen; cream appears once per view at most.
- **Type.** Geist for everything, Geist Mono for anything countable. Display sizes are negatively tracked (−.032 to −.035em); body sits at −.006em. UI default is 13.5px for dense data and 14px for controls and tabs; prose 15px, marketing 17px. Stat numerals get their own scale — 44 / 32 / 26px at **regular weight** with −.03em tracking, never bold. Numerals are tabular everywhere.
- **Spacing.** 4px base. Page gutters 32 (app) / 64 (marketing). Controls are 32/36/40px tall (shadcn `h-8`/`h-9`/`h-10`) with 13–14px medium labels. Buttons are **flat** — a hairline plus `--shadow-xs`, never an inset highlight or gradient. Content maxes at 1160px, prose at 760px, sidebar is 248px.
- **Backgrounds.** Two motifs, always together on brand surfaces: a **dotted survey grid** (1px dots, 22px pitch, radially masked so it fades out) and a **paper grain** (fractal-noise SVG, multiply on light, overlay on ink, ~32% opacity). No photography is supplied; no illustration system exists. Gradients are used only as masks and fades — never as a decorative background, and never blue-to-purple.
- **Cards.** `--paper-050` fill on the bone-grey page, 1px `--line-100` hairline, 10px radius, **no shadow**. Structure comes from hairlines and from the page/card value step, never elevation. Related stats go in one bordered strip divided by vertical hairlines rather than four separate cards. No zebra striping in tables.
- **Shadows.** Five rungs, all restrained. `--shadow-xs` on resting controls and cards, `--shadow-md` on toasts, `--shadow-lg` only on modals and floating panels. No inner shadows except the optional `--shadow-inset-top` highlight.
- **Radii.** 4 (checkbox) · 6 · **8 (all controls, shadcn `rounded-md`)** · 12 (cards) · 16 (modals) · 24 (large brand blocks) · pill (badges, tags, switches).
- **Borders.** Warm hairlines so they don't go grey-blue against cream: `--line-100` for card and row edges, `--line-200` for controls, `--line-300` for checkbox/radio outlines.
- **Transparency & blur.** Exactly two uses: the sticky site header (`rgba(250,249,245,.82)` + 10px blur) and the dialog scrim (`rgba(15,17,19,.28)` + 2px blur). Nothing else is translucent.
- **Protection.** Text over the dotted grid relies on the radial mask fading the dots out, not on a capsule or scrim. On ink surfaces, cream text runs at 72–85% opacity for secondary lines.
- **Animation.** 140–200ms, `cubic-bezier(.2,0,0,1)`. Fades, 1–4px slides and colour changes only. No bounce, no spring, no scroll-jacking, no parallax. Five named keyframes live in `tokens/base.css`: `tundra-fade`, `tundra-fade-up` (toasts, tooltips), `tundra-scale-in` (dialogs, .97→1), `tundra-draw` (chart lines, 900ms), `tundra-rise` (bars grow from the baseline). Reduced motion is honoured globally.
- **Hover.** Solid fills lighten (`stone-700` → `stone-600`); paper surfaces take a 3.5% ink wash (`--surface-hover`); ghost controls gain that wash and darken their label from `--text-secondary` to `--text-body`. Table rows use the same wash.
- **Press.** A colour step only (`--surface-active`, 6% ink) — nothing scales or shifts. Tundra never bounces a button.
- **Focus.** 1px `--cobalt-500` border plus an offset ring: 2px of paper then 2px `rgba(76,99,182,.30)`. Danger fields use the rust ring.
- **Layout rules.** App: fixed 248px left rail, sticky page header, single scrolling body. Marketing: sticky 60px header, centred 1160px column, full-bleed section bands alternating bone / stone / cream.
- **Imagery.** None supplied. Where a photo would go, use a `Surface` with the dotted grid, or a real product table — never stock imagery, never an AI-generated illustration. If photography is ever added, it should be cool, desaturated, high-key clinical with visible grain.

### Text colour and contrast

The warm paper surfaces are light (`#F4F2EA` page, `#FCFBF7` card), which caps how
light text can go. Measured against the page:

| Token | Value | On page | Use |
| --- | --- | --- | --- |
| `--text-body` | `#35342E` | 11.14:1 | All running text |
| `--text-secondary` | `#696963` | 4.93:1 | Captions, labels, provenance, axis ticks |
| `--text-muted` | `#696963` | 4.93:1 | Same value — see below |
| `--ink-400` | `#94948C` | 2.73:1 | **Decoration only** — dots, rules, inactive marks. Never text. |

**There is no third legible text tier.** `#696963` is the AA floor on this palette. It
was solved, not chosen by eye: it clears 4.5:1 against *every* surface the system
defines — page, card, white, header, rail, the sticky header's flattened
`rgba(242,241,237,.82)`, all four status tints, cream, and `--paper-200`, which is the
tightest at 4.51:1. Anything lighter fails somewhere. `--text-muted` therefore resolves to the same
value as `--text-secondary` — the distinction is kept in the token names because it
carries intent, but separate the two tiers with **size and weight**, not lightness.
If you need a value lighter than `#696963`, it is decoration and must not carry words —
that includes `--ink-300`, which is for rules and inactive marks, never for text.
The one sanctioned exception is the oversized `/` framing glyph in `SlashHeading`, which
is brand ornament carrying no content.

### The device's own voice

Tundra's distinctive interaction is that **the asset answers in the first person**. A
device message says "I have thrown this alarm four times", never "The device has logged
four alarms" and never "we". It is not a chatbot persona — it is the record speaking, so:

- **Every device answer carries citations** (`Manual §4.2`, `WO-88412`) and a verbatim
  `confidence`. An uncited device answer breaks the brand's central promise.
- **The device may address people directly** — drafted emails open "Hello Priya — this is
  the CT in 2B" — but nothing is ever sent without human approval, and the UI says so.
- **No personality flourishes.** It does not joke, apologise, or use exclamation marks. Its
  register is a competent colleague reporting facts about itself.
- **Tool calls are visible.** Anything the agent did is shown as a `ToolCall` with a
  dotted lowercase tool name, its arguments and a result — `tundra.device.log_event`,
  `tundra.manual.lookup`, `tundra.personnel.draft_email`. Tundra ships as an MCP server,
  so those names are a real API surface, not decoration.

## Iconography

- **Set:** [Lucide](https://lucide.dev) at **1.5px stroke**, rendered by the `Icon` component from **vendored glyph data** in `components/core/lucide-glyphs.js` (Lucide 0.446.0, ISC-licensed). Nothing is fetched at runtime — icons render synchronously, work offline, and survive bundling to a single file. Adding an icon means adding its entry to that file. **This is a substitution** — the brand supplied no icon set, and Lucide's thin, geometric, open-terminal strokes are the closest match to the Notion/OpenAI-adjacent direction in the brief. Swap it if Tundra has its own set.
- **Sizes:** 14 in dense tables, 16 default, 18–20 in nav and marketing, 24 maximum.
- **Colour:** `currentColor` by default; `--text-muted` for decorative glyphs, `--cobalt-700` for anything the agent does (`sparkles`, `wand-sparkles`).
- **No emoji, no unicode symbols as icons, no icon font, no hand-rolled SVG paths.** The one bespoke vector in the system is the Tundra mark itself.
- **Common glyphs:** `inbox`, `layout-grid`, `wrench`, `file-text`, `receipt`, `database`, `mail`, `chart-column`, `sparkles`, `search`, `filter`, `chevron-right`, `triangle-alert`, `check`.

## Logo

`assets/tundra-mark.svg` is the supplied mark — a three-peak ridge over a baseline, cream
`#F8F2DC`. Variants: `-ink` (near-black) and `-mono` (currentColor). **No wordmark file was
supplied**, so the `Logo` component sets the word "Tundra" in Geist Medium at −.03em beside
the mark. Nothing about the mark was redrawn or reconstructed. Clear space equals the mark's
height; the mark may be ink, cream or glacier — never a status colour.

## Font substitution — please confirm

No font binaries were supplied. The system loads **Geist** and **Geist Mono** from Google
Fonts (`tokens/fonts.css`). If Tundra licenses a different typeface, send the files and this
is a one-file change.

---

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | Root entry — nothing but `@import` lines. Consumers link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `texture.css`, `base.css` |
| `assets/` | `tundra-mark.svg` (cream), `tundra-mark-ink.svg`, `tundra-mark-mono.svg`, `tundra-mark.png` |
| `guidelines/` | 22 specimen cards — colour, type, spacing, radii, elevation, dots, grain, logo, motion |
| `components/` | The component library (below) |
| `ui_kits/app/` | Tundra product recreation — triage inbox, fleet, device record, analytics, contracts |
| `ui_kits/website/` | Marketing homepage |
| `thumbnail.html` | Homepage tile |
| `SKILL.md` | Agent-skill wrapper for use outside this project |

### Components

**agent** — `DeviceMessage`, `ToolCall`
**core** — `Button`, `IconButton`, `Icon`, `Badge`, `Tag`, `Card`
**charts** — `NetworkGraph`, `SplitBarChart`, `DotMatrix`, `Sparkline`, `LineChart`, `BarChart`, `DonutChart`, `ProgressBar`
**forms** — `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`
**navigation** — `Tabs`, `Breadcrumbs`, `SidebarNav`
**feedback** — `Dialog`, `Toast`, `Tooltip`, `EmptyState`
**data** — `Table`, `DefinitionList`, `Timeline`, `StatTile`
**brand** — `Logo`, `Surface`

Each has a sibling `.d.ts` (props contract) and `.prompt.md` (when to use it, with an example).

### Intentional additions

No source defined a component inventory, so this is an authored standard set. Four
entries go beyond the generic list because the product cannot be shown without them:

- **`Icon`** — a wrapper for the substituted Lucide set, so no screen inlines SVG paths.
- **`Table`**, **`DefinitionList`**, **`Timeline`** — Tundra is a records product; work orders, nameplate data and unified device history are its primary content types.
- **`StatTile`** — the outcome figures appear on both the dashboard and the marketing page.
- **`Surface`** — packages the dotted-grid + grain motif so it is never re-implemented by hand.
- **`NetworkGraph`** — Tundra *is* a device-centric graph database; the product's core claim is unshowable without a node-link view, so it is a first-class component rather than a one-off illustration.
- **charts (`DotMatrix`, `Sparkline`, `LineChart`, `BarChart`, `DonutChart`, `ProgressBar`)** — Tundra's whole pitch is analysing device data; spend trends, vendor breakdowns and SLA attainment cannot be shown without them. All are dependency-free SVG.

### The device graph

`NetworkGraph` is the product's signature view. One device sits at the centre; contracts,
work orders, invoices, bulletins, rooms, schedules and vendors ring outward, and a rust
edge marks a **blocking path** — where an outage propagates into blocked rooms or a
stalled clinical list.

- **Layout is layered left-to-right** — `col` sets the column explicitly, otherwise it is BFS depth from the root. Signal flows one way: source systems in column 0, the device in column 1, consequences (locations, claims, exposure) in column 2. Deterministic, no physics, no animation loop.
- **Nodes are node-editor cards** — titlebar (Lucide type glyph via `Icon`: `activity` device, `file-text` contract, `receipt` record, `map-pin` location, `building-2` vendor, `triangle-alert` exposure; then name, optional uppercase badge, minimise dash), labelled rows, optional footer strip. Cables attach to a *specific row* via `fromRow`/`toRow`, with a coloured port drawn on the card edge exactly where the cable lands, so a reader can see which field a connection feeds.
- **Dashed edges** mark a relationship Tundra *inferred* rather than read from a source system — the same honesty rule as the provenance line on a Timeline event.
- **Hover isolates**: everything not connected to the hovered node drops to 28% opacity, but rust risk edges stay lit so a blocking path can never be hidden by an interaction.
- Keep a view under ~20 nodes. Beyond that, filter by relationship type rather than shrinking chips.

### Data visualisation

Series colours run **stone-600 → slate-500 → amber-500 → moss-500 → rust-500**, in that
order — data is ink-first, and colour only enters when a second series needs separating. Strokes are 1.75px, area fills are a 16%→0% gradient of the series colour,
**gridlines are dotted** (`1 5` dash) with a solid baseline, and axis labels are 10px Geist Mono. `DotMatrix` is the preferred chart for time buckets — columns built from 5px squares, the same dot vocabulary as the brand survey grid; solid `BarChart` is reserved for ranked "top N" comparisons. `LineChart` takes a dashed `reference` benchmark line and optional point `markers`. Two series max in
the product, three in reports; five slices max in a donut. Tooltips are a paper card with
`--shadow-md`, never a dark tooltip. Lines are 2px and Catmull-Rom smoothed with a 22%→0%
gradient beneath; bars have 5px top caps and grow from the baseline; donuts are an 11px ring
with rounded caps. A prior-period comparison is a muted dashed series (`dashed: true`),
never a second solid line. No 3D, no drop shadows on data, no gradient-filled bars.
