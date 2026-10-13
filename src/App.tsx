import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArrayExplorer, CodeSamples, LanguageExplorer, LinearSearchLab, catalog } from './LearningPages'

type Kind = 'random' | 'even' | 'odd' | 'sequence'
type Order = 'ascending' | 'descending'
type Tab = 'visualization' | 'underhood' | 'languages'
type Page = 'home' | 'binary' | 'linear' | 'arrays' | 'languages' | 'catalog'
type Step = {
  low: number; high: number; mid: number; guess: number; target: number
  comparison: 'found' | 'too-high' | 'too-low'; nextLow: number; nextHigh: number; message: string
}

function makeList(count: number, min: number, max: number, kind: Kind, order: Order): number[] {
  const first = Math.ceil(min), last = Math.floor(max)
  const candidates: number[] = []
  for (let value = first; value <= last; value++) {
    if (kind === 'even' && value % 2 !== 0) continue
    if (kind === 'odd' && Math.abs(value % 2) !== 1) continue
    candidates.push(value)
  }
  if (candidates.length < count) throw new Error(`This range contains only ${candidates.length} eligible ${kind} values. Widen the range or reduce the list size.`)
  if (kind !== 'sequence') {
    for (let i = 0; i < count; i++) {
      const j = i + Math.floor(Math.random() * (candidates.length - i))
      ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
    }
  }
  const selected = kind === 'sequence' && order === 'descending' ? candidates.slice(-count) : candidates.slice(0, count)
  const result = selected.sort((a, b) => a - b)
  return order === 'ascending' ? result : result.reverse()
}

function traceSearch(values: number[], target: number, order: Order): Step[] {
  const steps: Step[] = []
  let low = 0, high = values.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2), guess = values[mid]
    if (guess === target) {
      steps.push({ low, high, mid, guess, target, comparison: 'found', nextLow: low, nextHigh: high, message: `Found ${target} at index ${mid}. The search is complete.` })
      break
    }
    const targetIsAfterMid = order === 'ascending' ? target > guess : target < guess
    const nextLow = targetIsAfterMid ? mid + 1 : low
    const nextHigh = targetIsAfterMid ? high : mid - 1
    steps.push({ low, high, mid, guess, target, comparison: targetIsAfterMid ? 'too-low' : 'too-high', nextLow, nextHigh,
      message: targetIsAfterMid
        ? `${guess} is ${order === 'ascending' ? 'less' : 'greater'} than ${target}. Discard the ${order === 'ascending' ? 'left' : 'right'} side through index ${mid}.`
        : `${guess} is ${order === 'ascending' ? 'greater' : 'less'} than ${target}. Discard the ${order === 'ascending' ? 'right' : 'left'} side from index ${mid}.` })
    low = nextLow; high = nextHigh
  }
  if (steps.length === 0 || steps[steps.length - 1].comparison !== 'found') steps.push({ low, high, mid: -1, guess: Number.NaN, target, comparison: 'too-high', nextLow: low, nextHigh: high, message: `${target} is not in this list. The search range is empty, so the algorithm stops.` })
  return steps
}

const pseudocode = [
  'low  ← 0', 'high ← LENGTH(A) − 1', 'WHILE low ≤ high', '  mid ← FLOOR((low + high) / 2)',
  '  guess ← A[mid]', '  IF guess = target → FOUND', '  IF target is in the other half', '    update low OR high', 'RETURN NOT_FOUND',
]

function ExplanationPanel({ steps, stepIndex, target, order }: { steps: Step[]; stepIndex: number; target: number; order: Order }) {
  const history = stepIndex < 0 ? [] : steps.slice(0, stepIndex + 1)
  return <section className="panel explanation-panel"><div className="panel-heading"><div><span className="section-kicker">03 / WHAT'S HAPPENING?</span><h2>Step explanation</h2></div><span className="heading-icon">✳</span></div>
    {history.length === 0 ? <div className="empty-state"><div className="empty-icon">◎</div><h3>Ready when you are</h3><p>Choose a target and click <b>Find value</b>. Each comparison will be added below.</p></div> : <div className="step-history" aria-live="polite">{history.map((step, i) => <article key={`${i}-${step.mid}`} className={`history-step ${i === stepIndex ? 'history-current' : ''}`}><div className="history-step-head"><span className="history-number">{String(i + 1).padStart(2, '0')}</span><strong>{step.mid < 0 ? 'Search complete' : step.comparison === 'found' ? 'Target found' : `Compare ${step.guess} with ${target}`}</strong>{i === stepIndex && <span className="current-pill">CURRENT</span>}</div><p>{step.message}</p>{step.mid >= 0 && <div className="history-math"><code>⌊({step.low} + {step.high}) / 2⌋ = {step.mid}</code><span>{step.guess} {step.comparison === 'found' ? '=' : step.comparison === 'too-low' ? (order === 'ascending' ? '<' : '>') : (order === 'ascending' ? '>' : '<')} {target}</span></div>}</article>)}</div>}
  </section>
}

function StatsPanel({ values, steps, stepIndex }: { values: number[]; steps: Step[]; stepIndex: number }) {
  const current = stepIndex >= 0 ? steps[Math.min(stepIndex, steps.length - 1)] : undefined
  return <section className="panel stats-panel"><div className="panel-heading"><div><span className="section-kicker">04 / SEARCH STATS</span><h2>Stats</h2></div><span className="heading-icon">▥</span></div><div className="stat-card"><span>Comparisons made</span><strong>{stepIndex < 0 ? 0 : Math.min(stepIndex + 1, steps.length)}</strong><small>Midpoint checks</small></div><div className="stat-card"><span>Remaining</span><strong>{current ? Math.max(0, current.high - current.low + 1) : values.length}</strong><small>Active candidates</small></div><div className="complexity-card"><span>TIME COMPLEXITY</span><strong>O(log n)</strong><p>Each comparison removes roughly half the search space.</p></div></section>
}

function PseudocodePanel({ current, isPlaying, finished, stepIndex, stepsLength, onPlay, onPause, onNext, onPrevious, onReset }: {
  current?: Step; isPlaying: boolean; finished: boolean; stepIndex: number; stepsLength: number
  onPlay: () => void; onPause: () => void; onNext: () => void; onPrevious: () => void; onReset: () => void
}) {
  return <section className="panel pseudocode-panel"><div className="panel-heading"><div><span className="section-kicker">05 / UNDER THE HOOD</span><h2>Binary search pseudocode</h2></div><span className="language-pill">PSEUDOCODE</span></div>
    <div className="code-controls"><button className="icon-button" aria-label="Previous pseudocode step" disabled={stepIndex <= 0} onClick={onPrevious}>‹</button><button className="button button-play" disabled={finished || stepsLength === 0} onClick={isPlaying ? onPause : onPlay}>{isPlaying ? 'Ⅱ Pause' : '▶ Play'}</button><button className="icon-button" aria-label="Next pseudocode step" disabled={stepIndex >= stepsLength - 1} onClick={onNext}>›</button><button className="icon-button" aria-label="Reset pseudocode playback" onClick={onReset}>↺</button></div>
    <div className="code-block">{pseudocode.map((line, index) => <div key={line} className={`code-line ${current && ((current.mid < 0 && index === 8) || (current.mid >= 0 && index === 3) || (current.comparison === 'found' && index === 5) || (current.comparison !== 'found' && current.mid >= 0 && index >= 6 && index <= 7)) ? 'code-active' : ''}`}><span className="line-number">{String(index + 1).padStart(2, '0')}</span><code>{line}</code></div>)}</div><p className="code-note"><span>ⓘ</span> The array must be sorted. For descending order, the algorithm reverses the comparison direction.</p>
  </section>
}

function LandingPage({ onStart, onArrays, onLanguages, onLinear, onCatalog }: { onStart: () => void; onArrays: () => void; onLanguages: () => void; onLinear: () => void; onCatalog: () => void }) {
  const demoValues = [4, 9, 13, 21, 28, 36, 42]
  return <div className="landing-page">
    <section className="landing-hero">
      <div className="landing-copy">
        <div className="landing-eyebrow"><span className="eyebrow-pulse"/> THE PLAYGROUND FOR COMPUTER SCIENCE</div>
        <h1>Understand the logic.<br/><span>See the magic.</span></h1>
        <p className="landing-lede">Algorithms stop being abstract when you can watch them work. Explore data structures, trace every decision, and compare how ten programming languages bring ideas to life.</p>
        <div className="landing-actions"><button className="landing-primary" onClick={onStart}>Start exploring <span>↗</span></button><button className="landing-secondary" onClick={onCatalog}>Browse the catalog <span>↓</span></button></div>
        <div className="landing-proof"><div className="avatar-stack"><span>C#</span><span>Py</span><span>JS</span><span>++</span></div><div><strong>One concept. Ten languages.</strong><small>Learn the idea, then see how each language thinks.</small></div></div>
      </div>
      <div className="landing-art" aria-label="Animated illustration of an algorithm narrowing a search across an array">
        <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✦</div>
        <div className="art-window">
          <div className="art-window-bar"><div className="window-dots"><i/><i/><i/></div><span>binary-search.ts</span><span className="live-label"><i/> LIVE TRACE</span></div>
          <div className="art-code"><div><b>01</b><code><em>const</em> target = <strong>28</strong>;</code></div><div><b>02</b><code><em>let</em> low = <strong>0</strong>, high = <strong>6</strong>;</code></div><div className="code-focus"><b>03</b><code><em>const</em> mid = <strong>3</strong>;</code></div><div><b>04</b><code><em>if</em> (values[mid] === target)</code></div><div><b>05</b><code>  <span>// found in logarithmic time</span></code></div></div>
          <div className="art-array-label"><span>SEARCH SPACE</span><span>7 elements</span></div>
          <div className="art-array">{demoValues.map((value,index)=><div key={value} className={`art-cell ${index===3?'art-mid':index<3?'art-faded':''}`} style={{'--delay':`${index*110}ms`} as CSSProperties}><small>{index}</small><strong>{value}</strong>{index===3&&<span>MID</span>}</div>)}</div>
          <div className="art-result"><span className="result-check">✓</span><div><strong>Target found</strong><small>Index 3 · Only 1 comparison shown</small></div><span className="result-complexity">O(log n)</span></div>
        </div>
        <div className="floating-chip chip-memory"><span className="chip-icon">▦</span><div><strong>Memory view</strong><small>Peek under the hood</small></div><span className="chip-dot"/></div>
        <div className="floating-chip chip-languages"><span className="language-glyph">{'{ }'}</span><div><strong>10 languages</strong><small>C# · Python · Rust +7</small></div></div>
      </div>
      <div className="hero-scroll-cue"><span/> SCROLL TO EXPLORE</div>
    </section>

    <section className="landing-section learning-section"><div className="section-intro"><div className="landing-eyebrow">YOUR LEARNING PLAYGROUND</div><h2>From “what is that?”<br/><span>to “oh, I get it.”</span></h2><p>Learn by doing, not just reading. Every topic gives you a different way to explore the same core idea.</p></div>
      <div className="learning-cards">
        <button className="learning-card card-algorithms" onClick={onStart}><div className="card-topline"><span className="card-number">01</span><span className="card-arrow">↗</span></div><div className="mini-visual mini-search"><span/><span/><span/><span/><span/><i/></div><h3>Algorithms</h3><p>Watch searching and sorting strategies make decisions one step at a time.</p><div className="card-tags"><span>Binary Search</span><span>Linear Search</span><span>Sorting soon</span></div></button>
        <button className="learning-card card-structures" onClick={onArrays}><div className="card-topline"><span className="card-number">02</span><span className="card-arrow">↗</span></div><div className="mini-visual mini-array"><span>12</span><span>25</span><span className="selected-cell">7</span><span>41</span><span>18</span></div><h3>Data Structures</h3><p>Explore how data is arranged, changed, and represented in memory.</p><div className="card-tags"><span>Arrays</span><span>Memory models</span><span>More soon</span></div></button>
        <button className="learning-card card-languages" onClick={onLanguages}><div className="card-topline"><span className="card-number">03</span><span className="card-arrow">↗</span></div><div className="mini-visual mini-code"><span><i>const</i> values = [</span><span className="indent-code">12, 25, 7, 41</span><span>];</span><span className="code-cursor"/></div><h3>Language Explorer</h3><p>Compare the same concept across ten languages and learn their differences.</p><div className="card-tags"><span>C#</span><span>Java</span><span>PHP</span><span>+7</span></div></button>
      </div>
    </section>

    <section className="landing-section journey-section"><div className="journey-heading"><div><div className="landing-eyebrow">BUILT FOR CURIOSITY</div><h2>Go beyond the <span>code.</span></h2></div><p>Not just what to type. Understand what happens, why it works, and what the computer is doing behind the scenes.</p></div>
      <div className="journey-grid"><article className="journey-item"><div className="journey-icon icon-visual">◉</div><span>01 / WATCH</span><h3>Visualize every step</h3><p>Follow comparisons, pointers, and changing values as an algorithm runs.</p><div className="journey-bars"><i/><i/><i/><i/><i/><i/><i/></div></article><article className="journey-item"><div className="journey-icon icon-memory">⌘</div><span>02 / UNDERSTAND</span><h3>Explore memory</h3><p>See how values, references, objects, and collections are represented.</p><div className="memory-stack"><i/><i/><i/></div></article><article className="journey-item"><div className="journey-icon icon-code">{'{ }'}</div><span>03 / COMPARE</span><h3>Think in ten languages</h3><p>Compare idioms and runtime behavior without losing sight of the core concept.</p><div className="language-mini-list"><b>C#</b><b>C++</b><b>PY</b><b>RS</b><b>GO</b><b>JS</b><b>TS</b><b>JAVA</b><b>PHP</b><b>C</b></div></article></div>
    </section>

    <section className="landing-cta"><div className="cta-glow"/><div className="cta-content"><div className="landing-eyebrow">YOUR NEXT “AHA!” MOMENT STARTS HERE</div><h2>Curiosity is the<br/><span>best debugging tool.</span></h2><p>Pick a concept. Press play. Follow the logic.</p><div className="landing-actions"><button className="landing-primary" onClick={onStart}>Try Binary Search <span>↗</span></button><button className="landing-secondary" onClick={onLinear}>Try Linear Search <span>→</span></button></div></div><div className="cta-graphic" aria-hidden="true"><div className="cta-node node-a">A</div><div className="cta-node node-b">B</div><div className="cta-node node-c">C</div><div className="cta-edge edge-a"/><div className="cta-edge edge-b"/><div className="cta-edge edge-c"/><span className="cta-graphic-label">IDEA → VISUALIZE → UNDERSTAND</span></div></section>
    <div className="landing-footnote"><span>ALGORITHM LAB</span><span>Built for curious minds, one step at a time.</span><button onClick={onArrays}>Explore Arrays ↗</button></div>
  </div>
}

export default function App() {
  const [count, setCount] = useState(15)
  const [kind, setKind] = useState<Kind>('random')
  const [order, setOrder] = useState<Order>('ascending')
  const [minText, setMinText] = useState('-20')
  const [maxText, setMaxText] = useState('60')
  const [targetText, setTargetText] = useState('17')
  const [customText, setCustomText] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [values, setValues] = useState<number[]>(() => makeList(15, -20, 60, 'random', 'ascending'))
  const [stepIndex, setStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(900)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('binary-search-theme') as 'dark' | 'light') || 'dark')
  const [configOpen, setConfigOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('visualization')
  const [page, setPage] = useState<Page>('home')
  const [catalogOpen, setCatalogOpen] = useState(false)
  const target = Number(targetText)
  const steps = useMemo(() => Number.isInteger(target) ? traceSearch(values, target, order) : [], [values, target, order])
  const current = stepIndex >= 0 ? steps[Math.min(stepIndex, steps.length - 1)] : undefined
  const finished = !!current && stepIndex === steps.length - 1

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('binary-search-theme', theme)
  }, [theme])
  useEffect(() => {
    if (!isPlaying) return
    if (stepIndex >= steps.length - 1) { setIsPlaying(false); return }
    const timer = window.setTimeout(() => setStepIndex((index) => Math.min(index + 1, steps.length - 1)), speed)
    return () => window.clearTimeout(timer)
  }, [isPlaying, stepIndex, steps.length, speed])

  function resetSearch() { setIsPlaying(false); setStepIndex(-1); setError('') }
  function generateList() {
    try {
      const min = Number(minText), max = Number(maxText)
      if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) throw new Error('Enter whole-number minimum and maximum values, with minimum ≤ maximum.')
      setValues(makeList(count, min, max, kind, order)); setUseCustom(false); setCustomText(''); resetSearch()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not generate the list.') }
  }
  function applyCustomList() {
    try {
      const parsed = customText.split(/[\s,;]+/).filter(Boolean).map(Number)
      if (parsed.length < 2 || parsed.some((n) => !Number.isInteger(n))) throw new Error('Enter at least two integers separated by commas or spaces.')
      const sorted = [...new Set(parsed)].sort((a, b) => a - b)
      if (sorted.length !== parsed.length) throw new Error('Please remove duplicate values for this beginner-friendly version.')
      setValues(order === 'ascending' ? sorted : sorted.reverse()); setCount(sorted.length); setUseCustom(true); resetSearch()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not use that list.') }
  }
  function changeOrder(next: Order) { setOrder(next); setValues((arr) => [...arr].sort((a, b) => next === 'ascending' ? a - b : b - a)); resetSearch() }
  function startSearch() {
    if (!Number.isInteger(target)) { setError('The target must be a whole number.'); return }
    setError(''); setStepIndex(0); setIsPlaying(false)
  }
  const visibleLow = current ? current.low : 0
  const visibleHigh = current ? current.high : values.length - 1
  const play = () => { if (stepIndex < 0) setStepIndex(0); setIsPlaying(true) }
  const next = () => { setIsPlaying(false); setStepIndex((i) => i < 0 ? 0 : Math.min(steps.length - 1, i + 1)) }
  const previous = () => { setIsPlaying(false); setStepIndex((i) => Math.max(0, i - 1)) }

  const header = <header className="topbar"><a className="brand" href="#top" onClick={(e) => { e.preventDefault(); setPage('home'); setCatalogOpen(false) }} aria-label="Algorithm Lab home"><span className="brand-mark">⌘</span><span>algorithm<span className="brand-light">lab</span></span></a><nav className="main-nav" aria-label="Main navigation"><button className={page==='home'?'active':''} onClick={()=>{setPage('home');setCatalogOpen(false)}}>Home</button><button className={page==='binary'||page==='linear'?'active':''} onClick={()=>setCatalogOpen(v=>!v)}>Explore Catalog ▾</button><button className={page==='arrays'?'active':''} onClick={()=>{setPage('arrays');setCatalogOpen(false)}}>Data Structures</button><button className={page==='languages'?'active':''} onClick={()=>{setPage('languages');setCatalogOpen(false)}}>Language Explorer</button></nav><div className="topbar-actions"><div className="topbar-right"><span className="status-dot"/> Interactive learning tool <span className="topbar-divider">·</span> v2.1</div><button className="theme-toggle" onClick={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}</button></div>{catalogOpen&&<div className="catalog-menu">{catalog.map(group=><div className="catalog-group" key={group.title}><strong>{group.title}</strong>{group.entries.map(entry=><button key={entry.name} disabled={entry.status!=='Available'} onClick={()=>{setPage(entry.name==='Binary Search'?'binary':entry.name==='Linear Search'?'linear':'arrays');setCatalogOpen(false)}}><span>{entry.name}</span><small className={entry.status==='Available'?'available':''}>{entry.status}</small></button>)}</div>)}</div>}</header>
  if (page !== 'binary') return <div className="app-shell" data-theme={theme}>{header}<main id="top" className={`page-wrap ${page==='home'?'landing-wrap':''}`}>{page==='home'?<LandingPage onStart={()=>{setPage('binary');setCatalogOpen(false)}} onArrays={()=>{setPage('arrays');setCatalogOpen(false)}} onLanguages={()=>{setPage('languages');setCatalogOpen(false)}} onLinear={()=>{setPage('linear');setCatalogOpen(false)}} onCatalog={()=>setCatalogOpen(true)}/>:page==='arrays'?<ArrayExplorer/>:page==='linear'?<LinearSearchLab/>:page==='languages'?<LanguageExplorer/>:<section className="hero"><h1>Algorithm <span>Catalog</span></h1></section>}<footer><span>Built for curious minds.</span><span>Algorithm Lab · Learn by visualizing</span></footer></main></div>

  return <div className="app-shell" data-theme={theme}>{header}
    <main id="top" className="page-wrap">
      <section className="hero"><div className="eyebrow"><span className="eyebrow-line"/> SEARCH ALGORITHMS / 01</div><h1>Binary Search <span>Visualizer</span></h1><p className="hero-copy">See how an algorithm cuts the search space in half. Change the data, follow each comparison, and learn by doing.</p><div className="hero-tags"><span>O(log n) time</span><span>Sorted arrays</span><span>Step-by-step</span></div></section>

      <section className={`panel config-panel config-top ${configOpen ? '' : 'is-collapsed'}`}><button className="config-heading-button" onClick={() => setConfigOpen((v) => !v)} aria-expanded={configOpen}><span className="panel-heading config-title"><span><span className="section-kicker">01 / SETUP</span><h2>Configure your data</h2></span><span className="heading-icon">⚙</span></span><span className="collapse-indicator">{configOpen ? '⌃ Collapse settings' : '⌄ Expand settings'}</span></button>
        {configOpen && <div className="config-content"><div className="field"><div className="field-label"><label htmlFor="count">Number of elements</label><strong>{count}</strong></div><input id="count" type="range" min="5" max="50" value={count} disabled={useCustom} onChange={(e) => setCount(Number(e.target.value))}/><div className="range-hints"><span>5</span><span>50 items</span></div></div>
          <div className="field"><label htmlFor="kind">Integer type</label><select id="kind" value={kind} disabled={useCustom} onChange={(e) => setKind(e.target.value as Kind)}><option value="random">Random integers</option><option value="even">Even integers only</option><option value="odd">Odd integers only</option><option value="sequence">Sequence numbers (from range)</option></select></div>
          <div className="field"><label>Sort order</label><div className="segmented"><button className={order === 'ascending' ? 'selected' : ''} onClick={() => changeOrder('ascending')}>↗ Ascending</button><button className={order === 'descending' ? 'selected' : ''} onClick={() => changeOrder('descending')}>↘ Descending</button></div></div>
          <div className="field"><label>Value range</label><div className="range-fields"><input aria-label="Minimum value" type="number" value={minText} disabled={useCustom} onChange={(e) => setMinText(e.target.value)}/><span>to</span><input aria-label="Maximum value" type="number" value={maxText} disabled={useCustom} onChange={(e) => setMaxText(e.target.value)}/></div></div>
          <div className="config-actions"><button className="button button-primary" onClick={generateList} disabled={useCustom}>↻ Generate new list</button><label className="check-row"><input type="checkbox" checked={useCustom} onChange={(e) => {setUseCustom(e.target.checked);setError('')}}/> Use my own list</label></div>
          {useCustom && <div className="field custom-field"><label htmlFor="custom">Enter integers (comma or space separated)</label><textarea id="custom" rows={2} value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="12, 3, 25, 8, 17"/><button className="button button-secondary" onClick={applyCustomList}>Apply and sort list</button></div>}
          <div className="target-field"><div className="field"><label htmlFor="target">Value to find</label><div className="target-row"><input id="target" type="number" value={targetText} onChange={(e) => setTargetText(e.target.value)} onKeyDown={(e) => {if(e.key === 'Enter') startSearch()}}/><button className="button button-primary" onClick={startSearch}>Find value <span>→</span></button></div></div><p className="helper-text">Tip: try a value that isn't in the list to see how the algorithm concludes it is missing.</p></div>
          {error && <div className="error-message" role="alert">{error}</div>}
        </div>}
      </section>

      <nav className="workspace-tabs" aria-label="Visualizer sections"><button className={activeTab === 'visualization' ? 'active' : ''} onClick={() => setActiveTab('visualization')}><span>02</span> LIVE VISUALIZATION</button><button className={activeTab === 'underhood' ? 'active' : ''} onClick={() => setActiveTab('underhood')}><span>05</span> UNDER THE HOOD</button><button className={activeTab === 'languages' ? 'active' : ''} onClick={() => setActiveTab('languages')}><span>06</span> LANGUAGE SAMPLES</button></nav>
      {activeTab === 'languages' ? <CodeSamples topic="Binary Search"/> : activeTab === 'visualization' ? <div className="learning-layout live-layout"><section className="panel visualization-panel"><div className="panel-heading visual-heading"><div><span className="section-kicker">02 / LIVE VISUALIZATION</span><h2>The search space</h2></div><span className="array-count">{values.length} <small>elements</small></span></div>
          <div className="legend"><span><i className="legend-dot active-dot"/> Middle element</span><span><i className="legend-dot range-dot"/> Active range</span><span><i className="legend-dot discarded-dot"/> Discarded</span><span><i className="legend-dot found-dot"/> Found</span></div>
          <div className="array-grid" style={{gridTemplateColumns:`repeat(${values.length > 30 ? 10 : values.length > 20 ? 8 : values.length > 12 ? 6 : Math.max(5, values.length)}, minmax(0, 1fr))`}}>{values.map((value,index) => {const inRange = !current || (index >= visibleLow && index <= visibleHigh);const isMid = current?.mid === index;const isFound = current?.comparison === 'found' && isMid;const isDiscarded = !!current && !inRange && !isFound;return <div key={`${index}-${value}`} className={`array-cell ${isMid?'is-mid':''} ${isFound?'is-found':''} ${isDiscarded?'is-discarded':''} ${inRange&&current&&!isMid?'is-in-range':''}`}><span className="cell-index">{index}</span><span className="cell-value">{value}</span>{isMid&&<span className="mid-label">MID</span>}</div>})}</div>
          <div className="pointer-summary"><span><b className="pointer-low">L</b> low <strong>{current ? current.low : '—'}</strong></span><span><b className="pointer-mid">M</b> mid <strong>{current&&current.mid>=0?current.mid:'—'}</strong></span><span><b className="pointer-high">H</b> high <strong>{current?current.high:'—'}</strong></span></div>
          <div className="playback"><div className="playback-buttons"><button className="icon-button" aria-label="Previous step" title="Previous step" disabled={stepIndex<=0} onClick={previous}>‹</button><button className="button button-play" disabled={steps.length===0||finished} onClick={play}>{isPlaying?'Playing…':'▶ Play'}</button><button className="icon-button" aria-label="Pause" title="Pause" disabled={!isPlaying} onClick={() => setIsPlaying(false)}>Ⅱ</button><button className="icon-button" aria-label="Next step" title="Next step" disabled={stepIndex>=steps.length-1} onClick={next}>›</button><button className="icon-button" aria-label="Reset search" title="Reset search" onClick={resetSearch}>↺</button></div><label className="speed-control" htmlFor="speed">Speed <select id="speed" value={speed} onChange={(e)=>setSpeed(Number(e.target.value))}><option value={1500}>Slow</option><option value={900}>Normal</option><option value={400}>Fast</option></select></label></div>
          <div className="step-progress"><div className="progress-track"><div className="progress-fill" style={{width:stepIndex<0?'0%':`${((stepIndex+1)/Math.max(steps.length,1))*100}%`}}/></div><span>{stepIndex<0?'Ready to search':`Step ${stepIndex+1} of ${steps.length}`}</span></div>
        </section><ExplanationPanel steps={steps} stepIndex={stepIndex} target={target} order={order}/><StatsPanel values={values} steps={steps} stepIndex={stepIndex}/></div> : <div className="learning-layout hood-layout"><PseudocodePanel current={current} isPlaying={isPlaying} finished={finished} stepIndex={stepIndex} stepsLength={steps.length} onPlay={play} onPause={()=>setIsPlaying(false)} onNext={next} onPrevious={previous} onReset={resetSearch}/><ExplanationPanel steps={steps} stepIndex={stepIndex} target={target} order={order}/><StatsPanel values={values} steps={steps} stepIndex={stepIndex}/></div>}
      <footer><span>Built for curious minds.</span><span>Algorithm Lab <b>·</b> Learn by visualizing</span></footer>
    </main>
  </div>
}
