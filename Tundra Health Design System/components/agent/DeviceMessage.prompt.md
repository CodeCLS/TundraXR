One-line: The device answering in its own voice — Tundra's signature interaction; use it wherever a person asks an asset a question.

```jsx
<DeviceMessage speaker="you">Alarming on self-test. What do I check first?</DeviceMessage>
<DeviceMessage name="Somatom X.cite CT" tag="AST-441902"
  citations={['Manual §4.2', 'WO-88412', 'WO-71120']} confidence="0.82">
  I have thrown this alarm four times. Three were the expiratory cassette
  not seated — reseat it and re-run the self-test before anyone drives out.
</DeviceMessage>
```

**The device speaks in the first person** ("I have thrown this alarm four times"), never as a chatbot and never as "we". Every device answer carries `citations` — the manual section and the work orders behind it — and a verbatim `confidence`. An uncited device answer breaks the brand's central promise.
