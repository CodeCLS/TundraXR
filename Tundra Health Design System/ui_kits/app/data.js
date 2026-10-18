window.TUNDRA_DATA = {
  devices: [
    { id:'AST-441902', name:'Somatom X.cite CT', mfr:'Siemens Healthineers', dept:'Radiology', room:'2B', state:'In service', tone:'ok', ytd:'$18,420', wo:42, contract:'Full service', serial:'SN-88213-C', installed:'11 Mar 2019' },
    { id:'AST-330218', name:'Alaris 8100 infusion pump', mfr:'BD', dept:'Med/Surg 4', room:'412', state:'PM overdue', tone:'warn', ytd:'$2,110', wo:9, contract:'Parts only', serial:'SN-11902-A', installed:'04 Aug 2021' },
    { id:'AST-118740', name:'Servo-u ventilator', mfr:'Getinge', dept:'ICU', room:'ICU-7', state:'Down', tone:'down', ytd:'$9,880', wo:23, contract:'Full service', serial:'SN-44710-J', installed:'22 Jan 2020' },
    { id:'AST-509311', name:'Lumify ultrasound', mfr:'Philips', dept:'Emergency', room:'ED-3', state:'In service', tone:'ok', ytd:'$740', wo:4, contract:'Warranty', serial:'SN-77120-Q', installed:'18 Sep 2024' },
    { id:'AST-220845', name:'Ingenia 3.0T MRI', mfr:'Philips', dept:'Radiology', room:'1A', state:'In service', tone:'ok', ytd:'$64,300', wo:31, contract:'Full service', serial:'SN-20114-M', installed:'07 Feb 2017' },
    { id:'AST-771044', name:'Steris Amsco 400 sterilizer', mfr:'Steris', dept:'Sterile Processing', room:'SPD-2', state:'PM overdue', tone:'warn', ytd:'$5,260', wo:16, contract:'Full service', serial:'SN-63028-S', installed:'30 Nov 2018' },
  ],
  inbox: [
    { id:'CALL-2291', device:'AST-118740', title:'Ventilator alarming on self-test', dept:'ICU', age:'6m ago', tone:'down', verdict:'Likely operator error', conf:'0.82' },
    { id:'CALL-2288', device:'AST-330218', title:'Pump display intermittent', dept:'Med/Surg 4', age:'41m ago', tone:'warn', verdict:'Dispatch tech', conf:'0.71' },
    { id:'CALL-2284', device:'AST-441902', title:'Table drift during scan', dept:'Radiology', age:'2h ago', tone:'warn', verdict:'Under contract — call vendor', conf:'0.90' },
  ],
  events: [
    { title:'Corrective repair', date:'14 Feb 2026', tone:'down', icon:'wrench', description:'Gantry drive belt replaced. 6.5 labour hours, part 08812-C.', source:'CMMS · WO-88412' },
    { title:'Invoice reconciled', date:'20 Feb 2026', tone:'info', icon:'receipt', description:'$4,180 billed against full-service contract — flagged as covered.', source:'AP export · INV-55219' },
    { title:'PM completed', date:'02 Jan 2026', tone:'ok', icon:'check', description:'Annual preventive maintenance, all tolerances in range.', source:'Vendor report · SIE-2201' },
    { title:'Operator error closed', date:'11 Dec 2025', tone:'ok', icon:'user', description:'Call closed at triage — coil not seated.', source:'Tundra triage · CALL-1904' },
  ],
  contracts: [
    { vendor:'Siemens Healthineers', type:'Full service', devices:14, annual:'$412,000', ends:'30 Jun 2027', sla:'4h response', health:'2 breaches', tone:'warn' },
    { vendor:'Philips', type:'Full service', devices:9, annual:'$288,500', ends:'31 Dec 2026', sla:'Next business day', health:'Met', tone:'ok' },
    { vendor:'Getinge', type:'Parts + labour', devices:22, annual:'$96,200', ends:'14 Mar 2027', sla:'8h response', health:'6 breaches', tone:'down' },
    { vendor:'BD', type:'Parts only', devices:340, annual:'$54,000', ends:'01 Sep 2026', sla:'—', health:'Met', tone:'ok' },
  ],
  graph: {
    nodes: [
      { id:'wo',  col:0, order:0, type:'record', label:'Work orders', rows:[{id:'a',label:'WO-88412',value:'6.5 h',pill:true},{id:'b',label:'WO-71120',value:'2.0 h',pill:true},{id:'c',label:'+40 more',value:'214 h'}], footer:{label:'Source · CMMS',value:'42 records'} },
      { id:'inv', col:0, order:1, type:'record', label:'Invoices', rows:[{id:'a',label:'INV-55219',value:'$4,180',pill:true,tone:'down'},{id:'b',label:'INV-51884',value:'$1,940',pill:true}], footer:{label:'Source · Finance / AP',value:'$18,420'} },
      { id:'ct',  col:0, order:2, type:'contract', label:'Service contract', badge:'2 breaches', rows:[{id:'sla',label:'Availability',value:'96.0%',pill:true},{id:'resp',label:'Response',value:'4 h',pill:true},{id:'term',label:'Expires',value:'30 Jun 2027'}] },
      { id:'dev', col:1, type:'device', label:'Somatom X.cite CT', rows:[{id:'tag',label:'Asset tag',value:'AST-441902'},{id:'hist',label:'Service history',value:'42 records'},{id:'cost',label:'Cost YTD',value:'$18,420'},{id:'avail',label:'Availability',value:'93.4%',tone:'down'},{id:'site',label:'Location',value:'Radiology 2B'}] },
      { id:'room',col:2, order:0, type:'location', label:'Radiology 2B', rows:[{id:'load',label:'Throughput',value:'38 scans/day'},{id:'alt',label:'Backup scanner',value:'None',tone:'down'}] },
      { id:'risk',col:2, order:1, type:'risk', label:'Exposure', rows:[{id:'r1',label:'Rooms blocked',value:'2',tone:'down'},{id:'r2',label:'Scans at risk',value:'38/day',tone:'down'}], footer:{label:'If down > 4h',value:'$61,400',tone:'down'} },
      { id:'claim',col:2, order:2, type:'contract', label:'Penalty claim', rows:[{id:'owed',label:'Owed under §6.2',value:'$184,200'},{id:'st',label:'Status',value:'Accepted',pill:true,tone:'ok'}], footer:{label:'Filed 12 Jun 2026',value:'$184,200'} },
    ],
    edges: [
      { from:'wo', to:'dev', fromRow:'a', toRow:'hist' },
      { from:'inv', to:'dev', fromRow:'a', toRow:'cost' },
      { from:'ct', to:'dev', fromRow:'sla', toRow:'avail' },
      { from:'dev', to:'room', fromRow:'site', toRow:'load' },
      { from:'dev', to:'claim', fromRow:'avail', toRow:'owed' },
      { from:'ct', to:'claim', fromRow:'resp', toRow:'owed', dashed:true },
      { from:'room', to:'risk', fromRow:'alt', toRow:'r1', tone:'risk' },
    ],
  },
};
