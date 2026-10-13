import { useMemo, useState } from 'react'

type Language = 'C#' | 'C' | 'C++' | 'Python' | 'Rust' | 'Go' | 'JavaScript' | 'TypeScript' | 'Java' | 'PHP'
type Topic = 'Array operations' | 'Linear Search' | 'Binary Search'

const languages: Language[] = ['C#', 'C', 'C++', 'Python', 'Rust', 'Go', 'JavaScript', 'TypeScript', 'Java', 'PHP']
const samples: Record<Topic, Record<Language, string>> = {
  'Array operations': {
    'C#': 'int[] numbers = { 12, 25, 7, 41, 18 };\nint value = numbers[2]; // 7\nnumbers[2] = 9;\n// Arrays have a fixed length.',
    C: '#include <stdio.h>\n\nint main(void) {\n    int numbers[] = {12, 25, 7, 41, 18};\n    int value = numbers[2];\n    numbers[2] = 9;\n    return 0;\n}',
    'C++': '#include <vector>\n\nstd::vector<int> numbers{12, 25, 7, 41, 18};\nint value = numbers[2];\nnumbers[2] = 9;\nnumbers.push_back(33);',
    Python: 'numbers = [12, 25, 7, 41, 18]\nvalue = numbers[2]  # 7\nnumbers[2] = 9\nnumbers.append(33)',
    Rust: 'let mut numbers = vec![12, 25, 7, 41, 18];\nlet value = numbers[2];\nnumbers[2] = 9;\nnumbers.push(33);',
    Go: 'numbers := []int{12, 25, 7, 41, 18}\nvalue := numbers[2]\nnumbers[2] = 9\nnumbers = append(numbers, 33)',
    JavaScript: 'const numbers = [12, 25, 7, 41, 18];\nconst value = numbers[2];\nnumbers[2] = 9;\nnumbers.push(33);',
    TypeScript: 'const numbers: number[] = [12, 25, 7, 41, 18];\nconst value: number = numbers[2];\nnumbers[2] = 9;\nnumbers.push(33);',
    Java: 'int[] numbers = {12, 25, 7, 41, 18};\nint value = numbers[2];\nnumbers[2] = 9;\n// Arrays have a fixed length.',
    PHP: '$numbers = [12, 25, 7, 41, 18];\n$value = $numbers[2]; // 7\n$numbers[2] = 9;\n$numbers[] = 33;'
  },
  'Linear Search': {
    'C#': 'static int LinearSearch(int[] items, int target) {\n    for (int i = 0; i < items.Length; i++)\n        if (items[i] == target) return i;\n    return -1;\n}',
    C: 'int linear_search(const int a[], int n, int target) {\n    for (int i = 0; i < n; i++)\n        if (a[i] == target) return i;\n    return -1;\n}',
    'C++': 'int linearSearch(const std::vector<int>& a, int target) {\n    for (int i = 0; i < static_cast<int>(a.size()); ++i)\n        if (a[i] == target) return i;\n    return -1;\n}',
    Python: 'def linear_search(items, target):\n    for index, value in enumerate(items):\n        if value == target:\n            return index\n    return -1',
    Rust: 'fn linear_search(items: &[i32], target: i32) -> Option<usize> {\n    items.iter().position(|&value| value == target)\n}',
    Go: 'func linearSearch(items []int, target int) int {\n    for i, value := range items {\n        if value == target { return i }\n    }\n    return -1\n}',
    JavaScript: 'function linearSearch(items, target) {\n  for (let i = 0; i < items.length; i++) {\n    if (items[i] === target) return i;\n  }\n  return -1;\n}',
    TypeScript: 'function linearSearch(items: number[], target: number): number {\n  for (let i = 0; i < items.length; i++) {\n    if (items[i] === target) return i;\n  }\n  return -1;\n}',
    Java: 'static int linearSearch(int[] items, int target) {\n    for (int i = 0; i < items.length; i++)\n        if (items[i] == target) return i;\n    return -1;\n}',
    PHP: 'function linearSearch(array $items, int $target): int {\n    foreach ($items as $index => $value) {\n        if ($value === $target) return $index;\n    }\n    return -1;\n}'
  },
  'Binary Search': {
    'C#': 'static int BinarySearch(int[] a, int target) {\n    int low = 0, high = a.Length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}',
    C: 'int binary_search(const int a[], int n, int target) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}',
    'C++': 'int binarySearch(const std::vector<int>& a, int target) {\n    int low = 0, high = static_cast<int>(a.size()) - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}',
    Python: 'def binary_search(items, target):\n    low, high = 0, len(items) - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if items[mid] == target:\n            return mid\n        if items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1',
    Rust: 'fn binary_search(a: &[i32], target: i32) -> Option<usize> {\n    a.binary_search(&target).ok()\n}',
    Go: 'func binarySearch(a []int, target int) int {\n    low, high := 0, len(a)-1\n    for low <= high {\n        mid := low + (high-low)/2\n        if a[mid] == target { return mid }\n        if a[mid] < target { low = mid+1 } else { high = mid-1 }\n    }\n    return -1\n}',
    JavaScript: 'function binarySearch(a, target) {\n  let low = 0, high = a.length - 1;\n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (a[mid] === target) return mid;\n    if (a[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}',
    TypeScript: 'function binarySearch(a: number[], target: number): number {\n  let low = 0, high = a.length - 1;\n  while (low <= high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (a[mid] === target) return mid;\n    if (a[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}',
    Java: 'static int binarySearch(int[] a, int target) {\n    int low = 0, high = a.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}',
    PHP: 'function binarySearch(array $a, int $target): int {\n    $low = 0; $high = count($a) - 1;\n    while ($low <= $high) {\n        $mid = $low + intdiv($high - $low, 2);\n        if ($a[$mid] === $target) return $mid;\n        if ($a[$mid] < $target) $low = $mid + 1;\n        else $high = $mid - 1;\n    }\n    return -1;\n}'
  }
}

const memoryNotes: Record<Language, string> = {
  'C#': 'In typical .NET implementations, an array is a managed array object on the heap. Value-type elements such as int are stored in its element area; reference-type elements are references to other objects. The variable holds a reference. The garbage collector reclaims unreachable objects.',
  C: 'Storage depends on declaration and allocation: an automatic local array has automatic storage duration, a static array has static storage duration, and malloc allocates dynamic storage. Array elements are contiguous; C does not provide automatic garbage collection.',
  'C++': 'A built-in array stores elements contiguously and its storage duration depends on where it is declared. std::vector owns a contiguous dynamic buffer and can reallocate it when capacity is exceeded. Object lifetime and RAII govern cleanup.',
  Python: 'A Python list is a dynamic container of object references, not a packed array of integer values. Integers are separate Python objects in common implementations. The language specifies behavior; exact object layout and allocator details are implementation-specific.',
  Rust: 'A fixed-size array contains its elements inline; Vec<T> owns a heap buffer and tracks length and capacity. Ownership controls lifetime, and growth may allocate a larger buffer and move elements. Exact placement can depend on context and optimization.',
  Go: 'An array is a value containing a fixed number of elements. A slice is a descriptor referring to a backing array with length and capacity; append may allocate a new backing array. Escape analysis influences stack or heap placement.',
  JavaScript: 'Arrays are objects managed by the JavaScript runtime and variables hold references. Engines may use specialized internal representations for performance; the ECMAScript specification does not mandate a particular heap layout or garbage collector.',
  TypeScript: 'Type annotations such as number[] are erased during ordinary compilation. Runtime array representation and memory management are JavaScript behavior, generally engine-managed and implementation-dependent.',
  Java: 'A Java array is an object with a fixed length. Primitive arrays store primitive values; reference arrays store references to objects. The variable contains a reference, and garbage collection handles unreachable arrays. Exact layout is JVM-specific.',
  PHP: 'PHP arrays are ordered maps that support integer or string keys, not conventional fixed-size C arrays. Implementations commonly use hash-table-like structures and copy-on-write optimizations. Exact layout and allocation details depend on the PHP runtime.'
}

export function CodeSamples({ topic, initialLanguage = 'C#' }: { topic: Topic; initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [copied, setCopied] = useState(false)
  const code = samples[topic][language]
  async function copyCode() {
    try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1600) }
    catch { setCopied(false) }
  }
  return <section className="panel new-panel"><div className="panel-heading"><div><span className="section-kicker">LANGUAGE EXPLORER</span><h2>{topic}</h2></div><span className="language-pill">10 LANGUAGES</span></div><div className="language-picker">{languages.map((lang) => <button key={lang} className={language === lang ? 'selected' : ''} onClick={() => setLanguage(lang)}>{lang}</button>)}</div><div className="new-code-header"><span>{language} · curated example</span><button className="button button-secondary" onClick={copyCode}>{copied ? 'Copied!' : 'Copy code'}</button></div><pre className="sample-code"><code>{code}</code></pre><p className="helper-text">Search examples return an index when found and -1 when absent, except Rust's idiomatic Option&lt;usize&gt; result. Binary Search requires ascending, sorted input.</p></section>
}

export function ArrayExplorer() {
  const [items, setItems] = useState([12, 25, 7, 41, 18])
  const [selected, setSelected] = useState(2)
  const [operation, setOperation] = useState('access')
  const [input, setInput] = useState('33')
  const [indexInput, setIndexInput] = useState('2')
  const [result, setResult] = useState('Select an operation and run it to see what changes.')
  const [language, setLanguage] = useState<Language>('C#')
  const [tab, setTab] = useState<'visual' | 'memory' | 'code'>('visual')
  const value = Number(input), index = Number(indexInput)
  function runOperation() {
    if (!Number.isInteger(value) && ['search','update','insert'].includes(operation)) { setResult('Enter a whole-number value.'); return }
    if (operation === 'access') { if (!Number.isInteger(index) || index < 0 || index >= items.length) setResult('Enter a whole-number index within the array bounds.'); else { setSelected(index); setResult(`numbers[${index}] is ${items[index]}. Indexed access is O(1).`) } }
    if (operation === 'search') { const found = items.indexOf(value); setSelected(found < 0 ? 0 : found); setResult(found < 0 ? `${value} was not found after checking ${items.length} elements. O(n) worst case.` : `Found ${value} at index ${found}. O(n) worst case.`) }
    if (operation === 'update') { if (!Number.isInteger(index) || index < 0 || index >= items.length) setResult('Enter a valid existing index.'); else { const next = [...items]; next[index] = value; setItems(next); setSelected(index); setResult(`Updated index ${index} to ${value}. Indexed update is O(1).`) } }
    if (operation === 'insert') { if (items.length >= 12) setResult('Demo limit is 12 elements. Remove an item before inserting.'); else { const next = [...items]; const at = Math.max(0, Math.min(items.length, Number.isInteger(index) ? index : items.length)); next.splice(at, 0, value); setItems(next); setSelected(at); setResult(`Inserted ${value} at index ${at}. Following items shifted; O(n).`) } }
    if (operation === 'delete') { if (!Number.isInteger(index) || index < 0 || index >= items.length) setResult('Enter a valid existing index.'); else if (items.length === 1) setResult('Keep at least one item in this demo.'); else { const next = [...items]; const removed = next.splice(index, 1)[0]; setItems(next); setSelected(Math.min(index, next.length - 1)); setResult(`Removed ${removed} from index ${index}. Following items shifted; O(n).`) } }
  }
  const memory = memoryNotes[language]
  const code = samples['Array operations'][language]
  const visible = useMemo(() => items.map((item, i) => ({ item, i })), [items])
  return <>
    <section className="hero"><div className="eyebrow"><span className="eyebrow-line"/> DATA STRUCTURES / 01</div><h1>Array <span>Explorer</span></h1><p className="hero-copy">Explore indexed storage, perform operations, and discover how ten languages represent arrays and array-like collections.</p><div className="hero-tags"><span>Indexed access O(1)</span><span>Insertion O(n)</span><span>Memory explained</span></div></section>
    <nav className="workspace-tabs"><button className={tab==='visual'?'active':''} onClick={()=>setTab('visual')}>LIVE OPERATIONS</button><button className={tab==='memory'?'active':''} onClick={()=>setTab('memory')}>UNDER THE HOOD</button><button className={tab==='code'?'active':''} onClick={()=>setTab('code')}>LANGUAGE SAMPLES</button></nav>
    {tab === 'visual' && <div className="new-layout"><section className="panel new-panel"><div className="panel-heading"><div><span className="section-kicker">INTERACTIVE ARRAY</span><h2>Array elements</h2></div><span className="array-count">{items.length} elements</span></div><div className="explorer-array">{visible.map(({item,i})=><button key={`${i}-${item}`} className={`explorer-cell ${selected===i?'chosen':''}`} onClick={()=>{setSelected(i);setIndexInput(String(i))}}><small>index {i}</small><strong>{item}</strong></button>)}</div><div className="field"><label htmlFor="array-op">Operation</label><select id="array-op" value={operation} onChange={e=>setOperation(e.target.value)}><option value="access">Access by index</option><option value="search">Search for value</option><option value="update">Update at index</option><option value="insert">Insert at index</option><option value="delete">Delete at index</option></select></div><div className="new-form-grid"><div className="field"><label htmlFor="array-value">Value</label><input id="array-value" type="number" value={input} onChange={e=>setInput(e.target.value)} disabled={operation==='access'||operation==='delete'}/></div><div className="field"><label htmlFor="array-index">Index</label><input id="array-index" type="number" min="0" max={items.length} value={indexInput} onChange={e=>setIndexInput(e.target.value)} disabled={operation==='search'}/></div></div><div className="config-actions"><button className="button button-primary" onClick={runOperation}>Run operation →</button><button className="button button-secondary" onClick={()=>{setItems([12,25,7,41,18]);setSelected(2);setIndexInput('2');setInput('33');setResult('Array reset to its original values.')}}>Reset array</button></div><div className="result-banner"><strong>Operation result</strong><p>{result}</p></div></section><section className="panel new-panel"><div className="panel-heading"><div><span className="section-kicker">COMPLEXITY GUIDE</span><h2>What does it cost?</h2></div></div><div className="operation-row"><span>Access / update by index</span><strong>O(1)</strong></div><div className="operation-row"><span>Search (unsorted)</span><strong>O(n)</strong></div><div className="operation-row"><span>Insert / delete in middle</span><strong>O(n)</strong></div><div className="operation-row"><span>Space for n elements</span><strong>O(n)</strong></div><p className="helper-text">These are typical costs. Resizing, collection type, and language runtime can affect practical performance.</p><div className="memory-callout"><strong>Key idea</strong><p>Arrays provide fast indexed access. Inserting or removing in the middle usually requires shifting later elements.</p></div></section></div>}
    {tab === 'memory' && <div className="new-layout"><section className="panel new-panel"><div className="panel-heading"><div><span className="section-kicker">MEMORY MODEL</span><h2>How {language} handles arrays</h2></div></div><div className="field"><label htmlFor="memory-language">Programming language</label><select id="memory-language" value={language} onChange={e=>setLanguage(e.target.value as Language)}>{languages.map(l=><option key={l}>{l}</option>)}</select></div><p className="memory-copy">{memory}</p><div className="memory-diagram"><div className="memory-variable"><small>Variable</small><strong>{language==='C'?'numbers':'numbers'}</strong><span>reference or value depends on language and context</span></div><div className="memory-arrow">↓</div><div className="memory-storage"><small>Illustrative element storage</small><div className="memory-cells">{items.slice(0,8).map((v,i)=><div key={i}><small>{i}</small><strong>{v}</strong></div>)}</div><span>Conceptual diagram; exact physical layout is runtime-dependent.</span></div></div></section><section className="panel new-panel"><div className="panel-heading"><div><span className="section-kicker">IMPORTANT DISTINCTIONS</span><h2>What to remember</h2></div></div><ul className="learning-list"><li>Array indexing is typically constant time.</li><li>Fixed-size arrays and resizable collections are different abstractions.</li><li>A reference to a collection is not the same as the collection's element storage.</li><li>Stack versus heap placement depends on language rules, runtime, and context; avoid universal assumptions.</li><li>Garbage-collected languages reclaim unreachable objects; C and C++ have different lifetime and resource-management models.</li></ul></section></div>}
    {tab === 'code' && <CodeSamples topic="Array operations" initialLanguage={language}/>}
  </>
}

export function LinearSearchLab() {
  const [items, setItems] = useState([4, 17, 9, 23, 11, 32, 17])
  const [target, setTarget] = useState('23')
  const [step, setStep] = useState(-1)
  const targetValue = Number(target)
  const foundIndex = items.indexOf(targetValue)
  const steps = items.map((value, index) => ({ value, index })).filter(x => foundIndex < 0 || x.index <= foundIndex)
  const current = steps[Math.min(step, steps.length - 1)]
  return <><section className="hero"><div className="eyebrow"><span className="eyebrow-line"/> SEARCH ALGORITHMS / 02</div><h1>Linear Search <span>Visualizer</span></h1><p className="hero-copy">Check each element in order until the target is found or the collection ends. No sorting is required.</p><div className="hero-tags"><span>O(n) time</span><span>Unsorted input allowed</span><span>Step-by-step</span></div></section><div className="new-layout"><section className="panel new-panel"><div className="panel-heading"><div><span className="section-kicker">LIVE VISUALIZATION</span><h2>Inspect each element</h2></div></div><div className="explorer-array">{items.map((value,i)=><div key={i} className={`explorer-cell ${step>=0&&i===current?.index?'chosen':''} ${step>=0&&i<=(current?.index??-1)&&value===targetValue?'found':''}`}><small>index {i}</small><strong>{value}</strong></div>)}</div><div className="field"><label htmlFor="linear-target">Target value</label><input id="linear-target" type="number" value={target} onChange={e=>{setTarget(e.target.value);setStep(-1)}}/></div><div className="config-actions"><button className="button button-primary" onClick={()=>setStep(0)}>Start / restart</button><button className="button button-secondary" onClick={()=>setStep(i=>Math.min(steps.length-1,i+1))} disabled={step<0||step>=steps.length-1}>Next comparison →</button><button className="button button-secondary" onClick={()=>setStep(-1)}>Reset</button></div><div className="result-banner"><strong>{step<0?'Ready':current?.value===targetValue?`Found at index ${current.index}`:step===steps.length-1&&foundIndex<0?'Target not found':`Comparing index ${current?.index}`}</strong><p>{step<0?'Start to inspect values from left to right.':current?.value===targetValue?`The current value ${current.value} equals ${targetValue}; the search stops.`:step===steps.length-1&&foundIndex<0?'Every element was checked and the target is absent.':'The current value does not match, so move to the next index.'}</p></div></section><section className="panel new-panel"><div className="panel-heading"><div><span className="section-kicker">UNDER THE HOOD</span><h2>Linear Search</h2></div></div><div className="operation-row"><span>Best case</span><strong>O(1)</strong></div><div className="operation-row"><span>Average / worst time</span><strong>O(n)</strong></div><div className="operation-row"><span>Auxiliary space</span><strong>O(1)</strong></div><p className="memory-copy">Linear Search reads values in sequence. It works with unsorted data, but may inspect every element. The implementation returns the first matching index, or -1 when absent (Rust uses Option&lt;usize&gt; idiomatically).</p></section></div><CodeSamples topic="Linear Search"/></>
}

export function LanguageExplorer() {
  const [topic, setTopic] = useState<Topic>('Array operations')
  return <><section className="hero"><div className="eyebrow"><span className="eyebrow-line"/> LANGUAGE EXPLORER / 01</div><h1>One concept. <span>Ten languages.</span></h1><p className="hero-copy">Compare curated implementations and learn why memory, collections, and idioms differ between languages.</p></section><div className="panel new-panel"><div className="field"><label htmlFor="explorer-topic">Choose a concept</label><select id="explorer-topic" value={topic} onChange={e=>setTopic(e.target.value as Topic)}><option>Array operations</option><option>Linear Search</option><option>Binary Search</option></select></div><CodeSamples topic={topic}/>{topic==='Array operations'&&<><div className="panel-heading"><div><span className="section-kicker">MEMORY COMPARISON</span><h2>Memory in each language</h2></div></div><div className="memory-language-grid">{languages.map(l=><article key={l} className="memory-language-card"><strong>{l}</strong><p>{memoryNotes[l]}</p></article>)}</div></>}</div></>
}

export const catalog = [
  { title: 'Searching', entries: [{ name: 'Binary Search', status: 'Available' }, { name: 'Linear Search', status: 'Available' }] },
  { title: 'Sorting', entries: [{ name: 'Bubble Sort', status: 'Coming Soon' }, { name: 'Selection Sort', status: 'Coming Soon' }, { name: 'Insertion Sort', status: 'Coming Soon' }, { name: 'Merge Sort', status: 'Coming Soon' }, { name: 'Quick Sort', status: 'Coming Soon' }] },
  { title: 'Graph Algorithms', entries: [{ name: 'BFS', status: 'Coming Soon' }, { name: 'DFS', status: 'Coming Soon' }, { name: "Dijkstra's Algorithm", status: 'Coming Soon' }] },
  { title: 'Data Structures', entries: [{ name: 'Arrays', status: 'Available' }, { name: 'Linked Lists', status: 'Coming Soon' }, { name: 'Stacks', status: 'Coming Soon' }, { name: 'Queues', status: 'Coming Soon' }, { name: 'Hash Tables', status: 'Coming Soon' }, { name: 'Trees', status: 'Coming Soon' }, { name: 'Graphs', status: 'Coming Soon' }] },
  { title: 'Recursion', entries: [{ name: 'Recursion Fundamentals', status: 'Coming Soon' }] }
]
