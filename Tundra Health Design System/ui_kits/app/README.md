# Tundra app — UI kit

Four interactive surfaces of the Tundra product, composed entirely from the design
system's components (`window.TundraHealthDesignSystem_1734d4`). Nothing is re-implemented locally.

| File | Surface |
| --- | --- |
| `AppShell.jsx` | Left rail (Logo, SidebarNav, workspace switcher), page header, scroll body |
| `TriageScreen.jsx` | Open-call inbox + agent triage panel with citations and provenance |
| `FleetScreen.jsx` | Stat row, filter bar and the dense device table |
| `DeviceScreen.jsx` | Device record: nameplate, unified history timeline, contract clauses, repair-vs-replace |
| `AnalyticsScreen.jsx` | Spend trend, vendor breakdown, fleet-state donut and SLA attainment table |
| `ContractsScreen.jsx` | Contract portfolio, observed SLA health, dispute dialog |
| `data.js` | Fixture data on `window.TUNDRA_DATA` |

Open `index.html`. The sidebar switches views; rows in Fleet open a device record;
"Send and hold call" fires a Toast; a contract row opens the dispute Dialog.

Fixture content is invented for demonstration — device models and vendors are real
products but the records, costs and SLA figures are not.
