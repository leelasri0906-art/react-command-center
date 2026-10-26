import { useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Boxes, Check,
  CheckCircle2, ChevronDown, CircleHelp, Clock3, Command, Download, Filter,
  Gauge, Handshake, LayoutDashboard, MapPin, Menu, Package, Plus, Radio,
  Search, Settings, ShieldCheck, Sparkles, Target, Truck, Users, X, Zap
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { activitySeed, initialRequests, initialResources } from './data/mockData'

const demandData = [
  { day: '09 AM', needed: 32, fulfilled: 18 },
  { day: '10 AM', needed: 46, fulfilled: 29 },
  { day: '11 AM', needed: 41, fulfilled: 34 },
  { day: '12 PM', needed: 68, fulfilled: 43 },
  { day: '01 PM', needed: 56, fulfilled: 48 },
  { day: '02 PM', needed: 82, fulfilled: 62 },
  { day: '03 PM', needed: 71, fulfilled: 67 },
]

const navItems = [
  { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'Requests', label: 'Resource requests', icon: Radio, count: '4' },
  { id: 'Inventory', label: 'Inventory', icon: Boxes },
  { id: 'Rescue Engine', label: 'Rescue Engine', icon: Target, tag: 'LIVE' },
  { id: 'Dispatch', label: 'Dispatch tracker', icon: Truck },
  { id: 'Analytics', label: 'Impact analytics', icon: Gauge },
]

function IconBubble({ children, tone = 'blue', size = 'normal' }) {
  return <span className={`icon-bubble ${tone} ${size}`}>{children}</span>
}

function StatusBadge({ value }) {
  const cls = value.toLowerCase().replaceAll(' ', '-')
  return <span className={`status-badge ${cls}`}><i />{value}</span>
}

function Header({ page, onMenu, onNewRequest }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={19} /></button>
      <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{page}</strong></div>
      <div className="topbar-actions">
        <div className="system-live"><span className="live-dot" /> All systems operational</div>
        <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button>
        <button className="new-request-button" onClick={onNewRequest}><Plus size={17} /> New request</button>
        <div className="avatar">LS</div>
      </div>
    </header>
  )
}

function Sidebar({ active, setActive, mobileOpen, closeMobile }) {
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" onClick={closeMobile} aria-label="Close menu" />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Command size={22} strokeWidth={2.5} /></div>
          <div className="brand-name">RE:<b>ACT</b><span>RESOURCE NETWORK</span></div>
          <button className="icon-button sidebar-close" onClick={closeMobile} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="workspace-select">
          <div className="workspace-icon"><span>PV</span></div>
          <div className="workspace-text"><strong>PVPSIT Campus</strong><small>Campus operations</small></div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({ id, label, icon: Icon, count, tag }) => (
            <button key={id} className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => { setActive(id); closeMobile() }}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {count && <em>{count}</em>}
              {tag && <small>{tag}</small>}
            </button>
          ))}
        </nav>
        <div className="nav-label tools-label">MANAGEMENT</div>
        <nav className="nav-list">
          <button className={`nav-item ${active === 'Donors' ? 'active' : ''}`} onClick={() => { setActive('Donors'); closeMobile() }}><Users size={18} /><span>Donor directory</span></button>
          <button className={`nav-item ${active === 'Activity log' ? 'active' : ''}`} onClick={() => { setActive('Activity log'); closeMobile() }}><Activity size={18} /><span>Activity log</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Need a hand?</strong><p>Explore the quick guide to get started.</p><button onClick={() => window.alert('RE:ACT demo guide: create a request, run Rescue Engine, reserve stock, and track dispatch.')}>Open quick guide <span>↗</span></button></div>
          <button className="nav-item settings-item" onClick={() => setActive('Settings')}><Settings size={18} /><span>Settings</span></button>
          <div className="profile-row"><div className="avatar profile-avatar">LS</div><div className="profile-info"><strong>Leela Sri</strong><small>Coordinator</small></div><button className="icon-button profile-more" aria-label="Profile options"><ChevronDown size={16} /></button></div>
        </div>
      </aside>
    </>
  )
}

function MetricCard({ label, value, change, icon, tone, trend = 'up', sub }) {
  const Icon = icon
  return <div className="metric-card">
    <div className="metric-top"><span>{label}</span><IconBubble tone={tone}><Icon size={18} /></IconBubble></div>
    <div className="metric-value-row"><strong>{value}</strong><span className={`metric-change ${trend}`}><ArrowUpRight size={14} />{change}</span></div>
    <div className="metric-sub">{sub}</div>
  </div>
}

function Overview({ requests, resources, onNavigate, onRunEngine, onNewRequest }) {
  const openCount = requests.filter(r => ['Open', 'Matched'].includes(r.status)).length
  const availableUnits = resources.reduce((sum, r) => sum + Math.max(0, r.quantity - r.reserved), 0)
  const fulfilled = requests.filter(r => r.status === 'Fulfilled').length
  return <>
    <div className="page-heading">
      <div><div className="eyebrow"><span className="eyebrow-dot" /> MONDAY, CAMPUS OPERATIONS</div><h1>Good evening, Leela <span className="wave">✳</span></h1><p>Here’s what’s happening across your resource network today.</p></div>
      <div className="heading-actions"><button className="secondary-button" onClick={() => onNavigate('Analytics')}><Download size={16} /> Export report</button><button className="primary-button" onClick={onNewRequest}><Plus size={17} /> Create request</button></div>
    </div>
    <div className="metric-grid">
      <MetricCard label="Active requests" value={String(openCount).padStart(2, '0')} change="+2 today" icon={Radio} tone="orange" sub="Across 4 campus zones" />
      <MetricCard label="Available resources" value={availableUnits.toLocaleString()} change="+12.8%" icon={Package} tone="blue" sub="Units ready to allocate" />
      <MetricCard label="Fulfilment rate" value="87.4%" change="+5.2%" icon={CheckCircle2} tone="green" sub="Compared to last event" />
      <MetricCard label="Avg. response time" value="12.6m" change="-18.2%" icon={Clock3} tone="purple" trend="up" sub="From request to match" />
    </div>
    <div className="main-grid">
      <section className="panel demand-panel">
        <div className="panel-heading"><div><h2>Resource demand overview</h2><p>Requests vs. fulfilled units throughout today</p></div><button className="select-button">Today <ChevronDown size={14} /></button></div>
        <div className="chart-legend"><span><i className="legend-needed" /> Requested</span><span><i className="legend-fulfilled" /> Fulfilled</span><span className="chart-note">Live demo data</span></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={demandData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}><defs><linearGradient id="neededFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6d8bff" stopOpacity={0.22} /><stop offset="95%" stopColor="#6d8bff" stopOpacity={0} /></linearGradient><linearGradient id="fulfilledFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20c7a0" stopOpacity={0.18} /><stop offset="95%" stopColor="#20c7a0" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 5" stroke="#263145" vertical={false} /><XAxis dataKey="day" tick={{ fill: '#8390a7', fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#8390a7', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: '#111b2c', border: '1px solid #2a3850', borderRadius: 10, color: '#edf2ff' }} /><Area type="monotone" dataKey="needed" name="Requested" stroke="#7c92ff" strokeWidth={2.3} fill="url(#neededFill)" /><Area type="monotone" dataKey="fulfilled" name="Fulfilled" stroke="#27c9a2" strokeWidth={2.3} fill="url(#fulfilledFill)" /></AreaChart></ResponsiveContainer></div>
        <div className="chart-footer"><span><span className="tiny-live" /> Updated just now</span><button onClick={() => onNavigate('Analytics')}>View analytics <span>→</span></button></div>
      </section>
      <section className="panel engine-panel">
        <div className="panel-heading"><div><div className="panel-title-icon"><Sparkles size={16} /><span>CORE FEATURE</span></div><h2>Rescue Engine</h2><p>Find the best match for an urgent need.</p></div><span className="engine-orb"><Zap size={20} /></span></div>
        <div className="engine-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="engine-center"><Target size={30} /></div><span className="node node-a"><Package size={15} /></span><span className="node node-b"><MapPin size={15} /></span><span className="node node-c"><Handshake size={15} /></span></div>
        <div className="engine-stats"><div><strong>08</strong><span>Eligible donors</span></div><div><strong>94<span className="score-unit">/100</span></strong><span>Top match score</span></div><div><strong>3.2<span className="score-unit">km</span></strong><span>Nearest donor</span></div></div>
        <button className="engine-button" onClick={onRunEngine}><Zap size={16} /> Run Rescue Engine <span>→</span></button>
        <div className="engine-foot"><ShieldCheck size={14} /> Rule-based matching · No AI API</div>
      </section>
    </div>
    <div className="lower-grid">
      <section className="panel requests-panel">
        <div className="panel-heading"><div><h2>Priority requests</h2><p>Needs that may require attention</p></div><button className="text-button" onClick={() => onNavigate('Requests')}>View all <span>→</span></button></div>
        <RequestTable requests={requests.slice(0, 4)} compact />
      </section>
      <ActivityPanel />
    </div>
  </>
}

function RequestTable({ requests, compact = false, onSelect }) {
  return <div className={`table-scroll ${compact ? 'compact-table' : ''}`}><table><thead><tr><th>REQUEST</th><th>URGENCY</th><th>QUANTITY</th><th>STATUS</th>{!compact && <th>LOCATION</th>}</tr></thead><tbody>{requests.map(r => <tr key={r.id} onClick={() => onSelect?.(r)}><td><div className="request-cell"><span className={`request-icon ${r.category.toLowerCase()}`}>{r.category === 'Water' ? <Package size={16} /> : r.category === 'Medical' ? <ShieldCheck size={16} /> : r.category === 'Food' ? <Boxes size={16} /> : <Zap size={16} />}</span><div><strong>{r.title}</strong><small>{r.id} · {r.time}</small></div></div></td><td><span className={`urgency ${r.urgency.toLowerCase()}`}><i />{r.urgency}</span></td><td><strong className="quantity-text">{r.quantity}</strong> <span className="muted">{r.unit}</span></td><td><StatusBadge value={r.status} /></td>{!compact && <td><span className="location-text"><MapPin size={13} />{r.location}</span></td>}</tr>)}</tbody></table>{requests.length === 0 && <div className="empty-state"><Package size={22} /><strong>No requests found</strong><span>Try changing your filters.</span></div>}</div>
}

function ActivityPanel() {
  return <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest network updates</p></div><button className="icon-button"><span className="more-dots">•••</span></button></div><div className="activity-list">{activitySeed.map(a => { const Icon = a.icon === 'check' ? Check : a.icon === 'truck' ? Truck : Target; return <div className="activity-item" key={a.id}><IconBubble tone={a.tone}><Icon size={16} /></IconBubble><div className="activity-copy"><strong>{a.title}</strong><span>{a.detail}</span><small>{a.time}</small></div></div> })}</div><button className="activity-link">View activity log <span>→</span></button></section>
}

function RequestsPage({ requests, setRequests, onNewRequest, onRunEngine }) {
  const [filter, setFilter] = useState('All requests')
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => requests.filter(r => (filter === 'All requests' || r.status === filter) && `${r.title} ${r.id} ${r.location} ${r.category}`.toLowerCase().includes(search.toLowerCase())), [requests, filter, search])
  return <>
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> OPERATIONS / INTAKE</div><h1>Resource requests</h1><p>Review needs, prioritize requests, and coordinate fulfilment.</p></div><button className="primary-button" onClick={onNewRequest}><Plus size={17} /> New request</button></div>
    <section className="panel full-panel"><div className="list-toolbar"><div className="search-box"><Search size={16} /><input placeholder="Search requests, IDs, locations..." value={search} onChange={e => setSearch(e.target.value)} /></div><div className="toolbar-right"><button className="select-button"><Filter size={15} /> Filter</button><select className="native-select" value={filter} onChange={e => setFilter(e.target.value)}><option>All requests</option><option>Open</option><option>Matched</option><option>Dispatched</option><option>Fulfilled</option></select></div></div><RequestTable requests={filtered} /><div className="table-bottom"><span>Showing <b>{filtered.length}</b> of {requests.length} requests</span><button className="secondary-button" onClick={onRunEngine}><Zap size={15} /> Find matches</button></div></section>
  </>
}

function InventoryPage({ resources, setResources }) {
  const [category, setCategory] = useState('All categories')
  const shown = resources.filter(r => category === 'All categories' || r.category === category)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [qty, setQty] = useState('25')
  const [cat, setCat] = useState('Water')
  const [donor, setDonor] = useState('Campus Store')
  const addResource = e => {
    e.preventDefault()
    if (!name.trim() || Number(qty) < 1) return
    setResources(prev => [...prev, { id: `RES-${Math.floor(200 + Math.random() * 800)}`, name, category: cat, donor, quantity: Number(qty), reserved: 0, unit: cat === 'Water' ? 'bottles' : cat === 'Food' ? 'boxes' : cat === 'Medical' ? 'kits' : 'units', location: 'Campus Store', reliability: 90, color: 'blue' }])
    setName(''); setQty('25'); setShowForm(false)
  }
  return <>
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> OPERATIONS / STOCK</div><h1>Resource inventory</h1><p>Keep track of available, reserved, and ready-to-share resources.</p></div><button className="primary-button" onClick={() => setShowForm(v => !v)}><Plus size={17} /> Add resource</button></div>
    {showForm && <form className="panel add-resource-form" onSubmit={addResource}><div className="panel-heading"><div><h2>Add inventory item</h2><p>This creates a local demo record.</p></div><button type="button" className="icon-button" onClick={() => setShowForm(false)}><X size={17}/></button></div><div className="form-grid"><label>Resource name<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bottled water" /></label><label>Category<select value={cat} onChange={e => setCat(e.target.value)}><option>Water</option><option>Food</option><option>Medical</option><option>Equipment</option></select></label><label>Quantity<input required type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} /></label><label>Donor / source<input value={donor} onChange={e => setDonor(e.target.value)} /></label></div><button className="primary-button" type="submit"><Check size={16}/> Save resource</button></form>}
    <div className="inventory-toolbar"><div><strong>{resources.length} inventory items</strong><span> · {resources.reduce((s,r)=>s+Math.max(0,r.quantity-r.reserved),0)} available units</span></div><select className="native-select" value={category} onChange={e=>setCategory(e.target.value)}><option>All categories</option><option>Water</option><option>Food</option><option>Medical</option><option>Equipment</option></select></div>
    <div className="inventory-grid">{shown.map(r => {const available=Math.max(0,r.quantity-r.reserved);const pct=Math.min(100,Math.round(available/Math.max(r.quantity,1)*100));return <div className="panel inventory-card" key={r.id}><div className="inventory-card-top"><IconBubble tone={r.color || 'blue'}><Package size={19}/></IconBubble><span className="resource-id">{r.id}</span><button className="icon-button"><span className="more-dots">•••</span></button></div><h3>{r.name}</h3><p className="inventory-donor">{r.donor} <span>·</span> <MapPin size={12}/> {r.location}</p><div className="stock-numbers"><div><strong>{available}</strong><span>Available</span></div><div><strong>{r.reserved}</strong><span>Reserved</span></div><div><strong>{r.quantity}</strong><span>Total</span></div></div><div className="stock-track"><span style={{width:`${pct}%`}}/></div><div className="stock-foot"><span>{pct}% available</span><span>{r.unit}</span></div><div className="inventory-card-bottom"><span><ShieldCheck size={14}/> {r.reliability}% reliability</span><StatusBadge value={available > 0 ? 'Available' : 'Reserved'} /></div></div>})}</div>
  </>
}

function RescueEngine({ requests, resources, onAllocate }) {
  const [selectedRequest, setSelectedRequest] = useState(requests.find(r=>r.status==='Open')?.id || requests[0]?.id || '')
  const [hasRun, setHasRun] = useState(false)
  const request = requests.find(r=>r.id===selectedRequest)
  const candidates = useMemo(() => {
    if (!request) return []
    const urgencyPoints = { Critical: 100, High: 85, Medium: 65, Low: 45 }
    return resources.filter(r => r.category === request.category && r.quantity-r.reserved > 0)
      .map((r,i) => {
        const available = r.quantity-r.reserved
        const proximity = Math.max(35, 100 - (i+1)*13)
        const quantityScore = Math.min(100, Math.round(available / Math.max(request.quantity,1) * 100))
        const score = Math.round(proximity*.35 + (urgencyPoints[request.urgency] || 60)*.30 + quantityScore*.20 + r.reliability*.15)
        return {...r, available, score, proximity}
      }).sort((a,b)=>b.score-a.score)
  }, [request, resources])
  const totalAvailable = candidates.reduce((s,c)=>s+c.available,0)
  const allocate = () => {
    if (!request || !candidates.length) return
    let remaining = request.quantity
    const plan = []
    candidates.forEach(c => { const take = Math.min(c.available, remaining); if (take > 0) plan.push({ resourceId: c.id, donor: c.donor, quantity: take }); remaining -= take })
    onAllocate(request.id, plan, request.quantity-remaining)
    setHasRun(true)
  }
  return <>
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> MATCHING / OPTIMIZATION</div><h1>Rescue Engine <span className="live-pill"><span className="live-dot"/> LIVE DEMO</span></h1><p>A transparent rule-based engine that ranks donors against urgent needs.</p></div></div>
    <div className="engine-page-grid">
      <section className="panel engine-config"><div className="panel-heading"><div><h2>Matching scenario</h2><p>Choose a request to evaluate eligible inventory.</p></div><IconBubble tone="purple"><Target size={18}/></IconBubble></div><label className="field-label">Resource request<select value={selectedRequest} onChange={e=>{setSelectedRequest(e.target.value);setHasRun(false)}}>{requests.map(r=><option value={r.id} key={r.id}>{r.id} — {r.title}</option>)}</select></label>{request && <div className="scenario-box"><div className="scenario-top"><span className={`urgency ${request.urgency.toLowerCase()}`}><i/>{request.urgency} priority</span><span className="muted">{request.id}</span></div><h3>{request.title}</h3><div className="scenario-details"><span><Package size={14}/> {request.quantity} {request.unit}</span><span><MapPin size={14}/> {request.location}</span><span><Clock3 size={14}/> {request.time}</span></div></div>}<div className="formula-box"><div><Sparkles size={16}/><strong>Scoring formula</strong></div><p>35% proximity + 30% urgency compatibility + 20% stock availability + 15% donor reliability</p><small>Transparent deterministic scoring · no AI service used</small></div><button className="primary-button full-width" onClick={()=>setHasRun(true)}><Zap size={16}/> Calculate best matches</button><button className="secondary-button full-width" onClick={allocate} disabled={!candidates.length}><CheckCircle2 size={16}/> Simulate allocation</button>{hasRun && <div className="engine-result-note"><CheckCircle2 size={16}/><span>Analysis complete. {candidates.length} eligible donor(s), {totalAvailable} total available {request?.unit || 'units'}.</span></div>}</section>
      <section className="panel matches-panel"><div className="panel-heading"><div><h2>Recommended donors</h2><p>Ranked by matching score</p></div><span className="match-count">{candidates.length} candidates</span></div>{candidates.length ? <div className="match-list">{candidates.map((c,i)=><div className={`match-card ${i===0?'top-match':''}`} key={c.id}><div className="rank-number">{String(i+1).padStart(2,'0')}</div><div className="match-main"><div className="match-title-row"><strong>{c.donor}</strong>{i===0&&<span className="best-match"><Sparkles size={11}/> BEST MATCH</span>}</div><span className="match-location"><MapPin size={13}/>{c.location} · {c.available} {c.unit} available</span><div className="match-progress"><span style={{width:`${c.score}%`}}/></div><small>Stock {c.available} · Reliability {c.reliability}%</small></div><div className="match-score"><strong>{c.score}</strong><span>/100</span></div></div>)}</div> : <div className="empty-state"><Package size={25}/><strong>No eligible donors</strong><span>Add matching inventory or choose another request.</span></div>}<div className="matching-legend"><span><i className="legend-strong"/> 85–100 Excellent</span><span><i className="legend-mid"/> 65–84 Good</span><span><i className="legend-low"/> Below 65 Fair</span></div>{hasRun&&<div className="allocation-preview"><div><strong>Allocation preview</strong><span>Estimated coverage based on current demo stock</span></div><strong>{Math.min(request?.quantity||0,totalAvailable)} / {request?.quantity||0} {request?.unit||'units'}</strong></div>}</section>
    </div>
  </>
}

function DispatchPage({ requests }) {
  const items = requests.filter(r => ['Matched','Dispatched','Fulfilled'].includes(r.status))
  return <>
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> OPERATIONS / DELIVERY</div><h1>Dispatch tracker</h1><p>Follow resource allocations from reservation through receipt.</p></div></div>
    <div className="dispatch-summary"><div className="panel"><span>In progress</span><strong>{items.filter(r=>r.status==='Dispatched').length.toString().padStart(2,'0')}</strong><small>Currently moving through workflow</small></div><div className="panel"><span>Awaiting dispatch</span><strong>{items.filter(r=>r.status==='Matched').length.toString().padStart(2,'0')}</strong><small>Matched and ready to move</small></div><div className="panel"><span>Completed</span><strong>{items.filter(r=>r.status==='Fulfilled').length.toString().padStart(2,'0')}</strong><small>Successfully received</small></div></div>
    <section className="panel full-panel"><div className="panel-heading"><div><h2>Active allocations</h2><p>Current request status and destination</p></div><span className="live-pill"><span className="live-dot"/> DEMO FEED</span></div>{items.length===0?<div className="empty-state">No active allocations yet. Run the Rescue Engine to start.</div>:<div className="dispatch-list">{items.map(r=><div className="dispatch-item" key={r.id}><div className="dispatch-icon"><Truck size={19}/></div><div className="dispatch-main"><strong>{r.title}</strong><span>{r.id} · {r.quantity} {r.unit} · {r.location}</span><div className="timeline-steps">{['Matched','Dispatched','Fulfilled'].map((s,i)=><div className={`timeline-step ${['Matched','Dispatched','Fulfilled'].indexOf(r.status)>=i?'complete':''}`} key={s}><i/>{s}</div>)}</div></div><StatusBadge value={r.status}/></div>)}</div>}</section>
  </>
}

function AnalyticsPage({ requests, resources }) {
  const fulfilled = requests.filter(r=>r.status==='Fulfilled').length
  const total = requests.length
  const units = requests.filter(r=>r.status==='Fulfilled').reduce((s,r)=>s+r.quantity,0)
  const stats = [{label:'Requests fulfilled',value:`${total?Math.round(fulfilled/total*100):0}%`,desc:`${fulfilled} of ${total} requests`,icon:CheckCircle2,tone:'green'},{label:'Units delivered',value:units.toLocaleString(),desc:'From completed requests',icon:Package,tone:'blue'},{label:'Resource categories',value:new Set(resources.map(r=>r.category)).size,desc:'Currently represented',icon:Boxes,tone:'purple'}]
  return <>
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> INSIGHTS / IMPACT</div><h1>Impact analytics</h1><p>Understand resource fulfilment and the network's operational impact.</p></div><button className="secondary-button" onClick={()=>window.print()}><Download size={16}/> Print report</button></div>
    <div className="metric-grid analytics-metrics">{stats.map(s=><MetricCard key={s.label} label={s.label} value={s.value} change="Demo" icon={s.icon} tone={s.tone} sub={s.desc}/>)}</div>
    <div className="main-grid"><section className="panel demand-panel"><div className="panel-heading"><div><h2>Demand and fulfilment</h2><p>Hourly resource movement</p></div></div><div className="chart-wrap tall-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={demandData}><CartesianGrid strokeDasharray="3 5" stroke="#263145" vertical={false}/><XAxis dataKey="day" tick={{fill:'#8390a7',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#8390a7',fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#111b2c',border:'1px solid #2a3850',borderRadius:10,color:'#edf2ff'}}/><Area type="monotone" dataKey="needed" name="Requested" stroke="#7c92ff" fill="#7c92ff" fillOpacity={0.12}/><Area type="monotone" dataKey="fulfilled" name="Fulfilled" stroke="#27c9a2" fill="#27c9a2" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div></section><section className="panel impact-card"><div className="impact-emblem"><Activity size={25}/></div><h2>Every resource counts.</h2><p>RE:ACT helps teams coordinate supplies and reduce avoidable shortages through transparent allocation workflows.</p><div className="impact-mini"><div><strong>{resources.length}</strong><span>Inventory records</span></div><div><strong>{requests.length}</strong><span>Tracked requests</span></div></div></section></div>
  </>
}

function GenericPage({ page }) {
  const details = {
    Donors: ['Donor directory','Browse participating donors, their resource categories, and fulfilment reliability.'],
    'Activity log': ['Activity log','Review important actions across requests, inventory, and dispatch.'],
    Settings: ['Workspace settings','Manage your workspace preferences and notification options.'],
  }
  const [title, desc] = details[page] || [page, 'Manage your resource network workspace.']
  return <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> WORKSPACE / MANAGEMENT</div><h1>{title}</h1><p>{desc}</p></div></div>
}

function NewRequestModal({ onClose, onCreate }) {
  const [title,setTitle]=useState('')
  const [category,setCategory]=useState('Water')
  const [quantity,setQuantity]=useState('100')
  const [unit,setUnit]=useState('bottles')
  const [urgency,setUrgency]=useState('High')
  const [location,setLocation]=useState('Main Event Ground')
  const [description,setDescription]=useState('')
  const submit=e=>{e.preventDefault();if(!title.trim()||Number(quantity)<1)return;onCreate({title,category,quantity:Number(quantity),unit,urgency,location,description});onClose()}
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><form className="modal-card" onSubmit={submit}><div className="modal-heading"><div><div className="eyebrow">RESOURCE INTAKE</div><h2>Create a request</h2><p>Describe what your team needs.</p></div><button type="button" className="icon-button" onClick={onClose}><X size={19}/></button></div><div className="form-grid"><label>Request title<input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Drinking water bottles"/></label><label>Category<select value={category} onChange={e=>{setCategory(e.target.value);setUnit(e.target.value==='Water'?'bottles':e.target.value==='Food'?'boxes':e.target.value==='Medical'?'kits':'units')}}><option>Water</option><option>Food</option><option>Medical</option><option>Equipment</option></select></label><label>Quantity needed<input required type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label><label>Unit<input value={unit} onChange={e=>setUnit(e.target.value)} required/></label><label>Urgency<select value={urgency} onChange={e=>setUrgency(e.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label><label>Delivery location<input required value={location} onChange={e=>setLocation(e.target.value)} placeholder="Campus location"/></label><label className="span-two">Additional details<textarea rows="3" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Any special instructions..."/></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit"><Plus size={16}/> Create request</button></div></form></div>
}

export default function App() {
  const [active,setActive]=useState('Overview')
  const [requests,setRequests]=useState(initialRequests)
  const [resources,setResources]=useState(initialResources)
  const [modalOpen,setModalOpen]=useState(false)
  const [mobileOpen,setMobileOpen]=useState(false)
  const [toast,setToast]=useState('')
  const [toastKey,setToastKey]=useState(0)

  const notify = message => { setToast(message); setToastKey(k=>k+1); window.setTimeout(()=>setToast(''),3200) }
  const createRequest = data => {
    const item={...data,id:`REQ-${Math.floor(1000+Math.random()*8999)}`,status:'Open',time:'just now'}
    setRequests(prev=>[item,...prev]);setActive('Requests');notify('Request created in demo workspace.')
  }
  const allocate = (requestId,plan,covered) => {
    if(!plan.length){notify('No eligible stock available for this request.');return}
    setResources(prev=>prev.map(r=>{const p=plan.find(x=>x.resourceId===r.id);return p?{...r,reserved:r.reserved+p.quantity}:r}))
    setRequests(prev=>prev.map(r=>r.id===requestId?{...r,status:covered>=r.quantity?'Matched':'Matched'}:r))
    notify(`Demo allocation prepared: ${covered} units reserved across ${plan.length} donor(s).`)
    setActive('Dispatch')
  }
  const runEngine = () => {setActive('Rescue Engine');notify('Rescue Engine is ready. Select a request to calculate matches.')}
  const renderPage = () => {
    if(active==='Overview') return <Overview requests={requests} resources={resources} onNavigate={setActive} onRunEngine={runEngine} onNewRequest={()=>setModalOpen(true)}/>
    if(active==='Requests') return <RequestsPage requests={requests} setRequests={setRequests} onNewRequest={()=>setModalOpen(true)} onRunEngine={runEngine}/>
    if(active==='Inventory') return <InventoryPage resources={resources} setResources={setResources}/>
    if(active==='Rescue Engine') return <RescueEngine requests={requests} resources={resources} onAllocate={allocate}/>
    if(active==='Dispatch') return <DispatchPage requests={requests}/>
    if(active==='Analytics') return <AnalyticsPage requests={requests} resources={resources}/>
    return <GenericPage page={active}/>
  }
  return <div className="app-shell">
    <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} closeMobile={()=>setMobileOpen(false)}/>
    <main className="main-area"><Header page={active} onMenu={()=>setMobileOpen(true)} onNewRequest={()=>setModalOpen(true)}/><div className="content-area" key={active}>{renderPage()}<footer className="app-footer"><span>© 2026 RE:ACT Resource Network</span><span><i className="live-dot"/> Demo environment · Built for campus coordination</span></footer></div></main>
    {modalOpen&&<NewRequestModal onClose={()=>setModalOpen(false)} onCreate={createRequest}/>}
    {toast&&<div className="toast" key={toastKey}><CheckCircle2 size={18}/>{toast}<button onClick={()=>setToast('')}><X size={15}/></button></div>}
  </div>
}