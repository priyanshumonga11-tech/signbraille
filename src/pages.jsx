import {useState,useMemo,useEffect} from 'react';
import {Link,NavLink,Outlet,useNavigate,useParams,useLocation,Navigate} from 'react-router-dom';
import {useApp} from './ctx.jsx';
import {Braille,Ring,Bar,Counter,Reveal,Modal,Empty,Loading,ErrorState,useFetch,Stat,Diff,SignArt,OnlineDef,useDebounce} from './ui.jsx';
import {toBraille,fromBraille,gen,SCENARIOS,EMERGENCY,PHRASES,BADGES,topicStats,levelOf,today} from './data';

/* ---------- layouts ---------- */
export function PublicLayout(){const{user}=useApp();return <>
 <a className="skip" href="#main">Skip to content</a>
 <header className="top"><Link to="/" className="logo">⠃ SignBridge</Link>
  <nav aria-label="Public">{[['/about','About'],['/awareness','Awareness'],['/resources','Resources'],['/faq','FAQ'],['/contact','Contact']].map(([t,l])=><NavLink key={t} to={t}>{l}</NavLink>)}</nav>
  <div>{user?<Link className="btn" to="/app">Dashboard</Link>:<><Link className="btn ghost" to="/login">Log in</Link> <Link className="btn" to="/register">Register</Link></>}</div></header>
 <main id="main"><Outlet/></main>
 <footer className="foot"><div><b>⠃ SignBridge</b><p>Learn · Practice · Test · Analyze · Revise · Improve</p></div><p>Built with React, Vite, React Router &amp; CSS. A communication aid — not an emergency service.</p></footer></>}
const NAV=[['/app','🏠','Dashboard',1],['/app/learn','📚','Learn'],['/app/translator','⠃','Translator'],['/app/dictionary','🔎','Dictionary'],['/app/communicate','💬','Communicate'],['/app/emergency','🚨','Emergency'],['/app/scenarios','🎭','Scenarios'],['/app/practice','🎯','Practice'],['/app/test','📝','Daily Test'],['/app/revision','🔁','Revision'],['/app/progress','📈','Progress'],['/app/planner','🗓️','Planner'],['/app/explore','✨','Explore'],['/app/library','⭐','Library'],['/app/profile','👤','Profile'],['/app/stats/achievements','🏅','Achievements'],['/app/notifications','🔔','Notifications'],['/app/settings','⚙️','Settings']];
import Popups from './popups.jsx';
export function AppLayout(){const{user,logout}=useApp();const[open,setOpen]=useState(false);const loc=useLocation();useEffect(()=>setOpen(false),[loc.pathname]);
 return <div className="app"><a className="skip" href="#main">Skip to content</a>
  <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={()=>setOpen(!open)}>☰</button>
  <nav className={'side'+(open?' open':'')} aria-label="Learner"><Link to="/" className="logo">⠃ SignBridge</Link>
   {NAV.map(([t,e,l,end])=><NavLink key={t} to={t} end={!!end}><i className="nd"/>{l}</NavLink>)}
   {user?.role==='admin'&&<NavLink to="/admin"><span>🛠️</span>Admin</NavLink>}
   <button className="btn ghost" onClick={logout}>Log out</button></nav>
  <main id="main" className="main"><div key={loc.pathname} className="page"><Outlet/></div></main></div>}
export const Guard=({role,children})=>{const{user}=useApp();return !user?<Navigate to="/login" replace/>:role&&user.role!==role?<Navigate to="/app" replace/>:children};

/* ---------- public ---------- */
function Helix(){const d=[];for(let i=0;i<44;i++){const y=Math.sin(i*.33)*95,x=10+i*13;d.push(<g key={i}><line x1={x} y1={200+y} x2={x} y2={200-y} className="hl"/><circle cx={x} cy={200+y} r="5" className="hd a" style={{animationDelay:i*90+'ms'}}/><circle cx={x} cy={200-y} r="5" className="hd b" style={{animationDelay:i*90+'ms'}}/></g>)}return <svg className="helix" viewBox="0 0 590 400" aria-hidden="true">{d}</svg>}
export function Home(){const[s,retry]=useFetch('/data/stats.json');const{lessons}=useApp();
 return <><Popups/>
 <section className="hero2"><Helix/>
  <div className="h-left"><span className="tag">Accessibility learning platform</span><h1>Break Communication Barriers.</h1>
   <p>SignBridge helps people learn Braille and Sign Language while building practical communication skills for school, hospitals, travel and everyday life.</p>
   <div className="row"><Link className="btn big" to="/register">Start Learning</Link><Link className="btn ghost big" to="/app/communicate">Explore Communication Tools</Link></div>
   <div className="orb"><small>Braille letters to master</small><b><Counter to={26}/></b></div></div>
  <div className="h-right"><Link className="hcard dark" to="/app/test"><h3>Daily Test</h3><small>10 questions · 15 min</small><span className="go">→</span></Link><Link className="hcard rose" to="/app/revision"><h3>Your Insights</h3><span className="pillw">Find weak topics →</span></Link><Link className="hcard tea" to="/app/planner"><h3>Action Plan</h3><small>Daily goals</small></Link></div></section>
 <section className="sec"><Reveal className="stats">{s.st==='loading'?<Loading/>:s.st==='err'?<ErrorState msg={s.e} retry={retry}/>:<>
  <Stat e="🎓" n={<Counter to={s.d.learners}/>} l="Learners"/><Stat e="📚" n={<Counter to={s.d.lessons}/>} l="Lessons"/><Stat e="🤟" n={<Counter to={s.d.signs}/>} l="Signs"/><Stat e="📝" n={<Counter to={s.d.tests}/>} l="Tests taken"/></>}</Reveal></section>
 <section className="sec split"><Reveal><h2>Why accessibility matters</h2><p className="lead">Millions of people rely on Braille or sign language every day. When a hospital, school or station cannot communicate with them, they lose independence and safety.</p></Reveal>
  <Reveal className="stack"><div className="glass">👁️ Braille gives independence in reading</div><div className="glass">👂 Sign language gives a voice to the Deaf</div><div className="glass">🤝 Small skills build inclusive communities</div></Reveal></section>
 <section className="sec"><h2>Learning paths</h2><div className="grid2"><Reveal><Link to="/app/learn" className="path p1"><Braille text="braille"/><h3>Braille</h3><p>Alphabet → Numbers → Punctuation → Words → Sentences</p></Link></Reveal>
  <Reveal><Link to="/app/learn" className="path p2"><span className="emo">🤟</span><h3>Sign Language</h3><p>Alphabet · Greetings · Family · Hospital · Emergency</p></Link></Reveal></div></section>
 <section className="sec dark"><h2>Real-life communication problems</h2><div className="grid3">{[['🏥','Explaining pain to a doctor'],['🚆','Finding the right platform'],['🍽️','Ordering water or food'],['🚑','Asking for an ambulance']].map(([e,t])=><Reveal key={t}><div className="glass">{e}<p>{t}</p></div></Reveal>)}</div><Link className="btn coral" to="/app/scenarios">Try a scenario</Link></section>
 <section className="sec"><h2>How SignBridge works</h2><div className="journey">{['Learn','Practice','Test','Analyze','Revise','Improve'].map((t,i)=><Reveal key={t}><div className="step"><b>{i+1}</b>{t}</div></Reveal>)}</div></section>
 <section className="sec"><h2>Featured lessons</h2><div className="grid3">{lessons.slice(0,3).map(l=><Reveal key={l.id}><Link to="/login" className="card lift"><div className="vis"><Vis l={l}/></div><h3>{l.title}</h3><Diff d={l.diff}/></Link></Reveal>)}</div></section>
 <section className="sec split"><Reveal><h2>Interactive preview</h2><p className="lead">Type a word and see it in Braille instantly.</p><Preview/></Reveal>
  <Reveal className="stack"><div className="glass">⚡ Earn XP for lessons, practice and tests</div><div className="glass">🏅 Unlock badges and level up</div><div className="glass">📈 See weak topics with clear rules</div></Reveal></section>
 <section className="sec"><h2>What learners say</h2><div className="grid3">{[['Priya','Practising hospital phrases made me confident.'],['Arjun','The daily test shows exactly what to revise.'],['Meera','Finally a simple way to learn Braille.']].map(([n,t])=><Reveal key={n}><div className="card"><p>“{t}”</p><b>— {n}, demo testimonial</b></div></Reveal>)}</div></section>
 <section className="sec faq"><h2>FAQ</h2>{[['Is it free?','Yes, this demo runs fully in your browser.'],['Does it contact emergency services?','No. Emergency cards are a communication aid only.'],['Where is my progress saved?','In your browser’s localStorage.']].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
 <section className="cta"><h2>Ready to bridge the gap?</h2><Link className="btn big coral" to="/register">Create free account</Link></section></>}
function Preview(){const[t,setT]=useState('hello');return <div className="glass"><label>Your word<input value={t} maxLength={12} onChange={e=>setT(e.target.value)}/></label><Braille text={t||' '}/></div>}
export const About=()=><section className="sec narrow"><h1>About SignBridge</h1><p className="lead">SignBridge turns a Braille and Sign Language project into a full learning journey: Discover → Learn → Practice → Test → Analyze → Revise → Improve → Communicate.</p><p>It uses only HTML, CSS, JavaScript and React, so every feature can be explained line by line.</p></section>;
export function Resources(){const[s,retry]=useFetch('/data/resources.json');return <section className="sec"><h1>Awareness &amp; Resources</h1>{s.st==='loading'?<Loading/>:s.st==='err'?<ErrorState msg={s.e} retry={retry}/>:<div className="grid3">{s.d.map(r=><Reveal key={r.t}><article className="card lift"><div className="emo">{r.e}</div><h3>{r.t}</h3><p>{r.d}</p></article></Reveal>)}</div>}</section>}
function AuthForm({reg}){const{setUser}=useApp();const nav=useNavigate();const[f,setF]=useState({name:'',email:'',pw:''});const[er,setEr]=useState({});
 const go=e=>{e.preventDefault();const x={};if(reg&&f.name.trim().length<2)x.name='Enter your name (2+ letters).';if(!/^\S+@\S+\.\S+$/.test(f.email))x.email='Enter a valid email.';if(f.pw.length<6)x.pw='Password needs 6+ characters.';setEr(x);if(Object.keys(x).length)return;
  setUser({name:f.name.trim()||f.email.split('@')[0],email:f.email,role:f.email.startsWith('admin')?'admin':'learner',bio:'',interest:'Braille'});nav('/app')};
 return <section className="sec narrow"><form className="glass form" onSubmit={go} noValidate><h1>{reg?'Create account':'Welcome back'}</h1>
  {reg&&<label>Name<input value={f.name} onChange={e=>setF({...f,name:e.target.value})}/><em>{er.name}</em></label>}
  <label>Email<input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/><em>{er.email}</em></label>
  <label>Password<input type="password" value={f.pw} onChange={e=>setF({...f,pw:e.target.value})}/><em>{er.pw}</em></label>
  <button className="btn big">{reg?'Register':'Log in'}</button><small>Demo only: data stays in your browser. Emails starting with “admin” get the admin panel.</small></form></section>}
export const Login=()=><AuthForm/>;export const Register=()=><AuthForm reg/>;
export const NotFound=()=><Empty e="🧭" t="404 — Page not found" d="This page does not exist."><Link className="btn" to="/">Go home</Link></Empty>;

/* ---------- learner ---------- */
export function Dashboard(){const{user,p,lessons}=useApp();const lv=levelOf(p.xp),pct=Math.round(p.done.length/lessons.length*100),h=new Date().getHours(),g=h<12?'morning':h<18?'afternoon':'evening';
 const weak=topicStats(p.tests).filter(t=>t.pct<70).slice(0,3),next=lessons.find(l=>!p.done.includes(l.id));
 return <><h1>Good {g}, {user.name} 👋</h1>
 <div className="journey">{[['Learn','/app/learn','📚'],['Practice','/app/practice','🎯'],['Test','/app/test','📝'],['Review','/app/revision','🔁']].map(([t,l,e],i)=><Link key={t} to={l} className="step"><b>{e}</b>{t}</Link>)}</div>
 <div className="bento"><div className="card wide"><h3>Overall progress</h3><div className="row"><Ring v={pct} label="Overall"/><div><p>{p.done.length}/{lessons.length} lessons</p><p>Level: <b>{lv.name}</b></p><Bar v={lv.pct} label="Level progress"/></div></div></div>
  <Stat e="🔥" n={p.streak} l="Day streak"/><Stat e="⚡" n={p.xp} l="XP"/>
  <div className="card"><h3>Recommended lesson</h3>{next?<><p>{next.title}</p><Link className="btn" to={'/app/learn/'+next.id}>Start</Link></>:<p>All done! 🎉</p>}</div>
  <div className="card"><h3>Daily test</h3><p>10 questions · 15 minutes</p><Link className="btn coral" to="/app/test">Take test</Link></div>
  <div className="card"><h3>Weak topics</h3>{weak.length?weak.map(w=><p key={w.topic}>{w.topic} — {w.pct}%</p>):<p>Take a test to find them.</p>}</div>
  <div className="card wide"><h3>Recent activity</h3>{p.hist.length?p.hist.slice(0,4).map((h,i)=><p key={i}><Diff d={h.type==='Test'?'Hard':'Easy'}/> {h.text}</p>):<p>Nothing yet — start a lesson!</p>}</div>
  <div className="card"><h3>Achievements</h3><p className="badges">{BADGES.filter(b=>p.badges.includes(b.id)).map(b=><span key={b.id} title={b.n}>{b.e}</span>)||''}</p><p>{p.badges.length}/{BADGES.length} unlocked</p></div>
  <div className="card"><h3>Favorites</h3><p>{p.favs.length} saved</p><Link to="/app/library">Open library →</Link></div></div></>}
export const Vis=({l})=>l.track==='braille'?<Braille text={l.sample}/>:<span className="row">{l.sample.split(' ').map(w=><SignArt key={w} word={w} size={72}/>)}</span>;
export function Learn(){const{lessons,p,toggleFav,isFav}=useApp();const[tab,setTab]=useState('braille');const list=lessons.filter(l=>l.track===tab);
 return <><h1>Learning Center</h1><div className="tabs" role="tablist">{['braille','sign'].map(t=><button key={t} role="tab" aria-selected={tab===t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t==='braille'?'⠃ Braille':'🤟 Sign Language'}</button>)}</div>
 {list.length?<div className="grid3">{list.map(l=><article key={l.id} className="card lift"><div className="vis"><Vis l={l}/></div><h3>{l.title}</h3><p>{l.meaning}</p><div className="row"><Diff d={l.diff}/><span>{p.done.includes(l.id)?'✅ Done':'○ Not done'}</span></div>
  <div className="row"><Link className="btn" to={'/app/learn/'+l.id}>Open</Link><Link className="btn ghost" to="/app/practice">Practice</Link><button className="icon" aria-pressed={isFav('lesson:'+l.id)} aria-label="Favorite" onClick={()=>toggleFav('lesson:'+l.id,l.title)}>{isFav('lesson:'+l.id)?'★':'☆'}</button></div></article>)}</div>:<Empty t="No lessons" d="Add some in the admin panel."/>}</>}
export function Lesson(){const{id}=useParams();const{lessons,p,complete,toggleFav,isFav}=useApp();const l=lessons.find(x=>x.id===id);
 if(!l)return <Empty e="🔍" t="Lesson not found" d="Check the link."><Link className="btn" to="/app/learn">Back</Link></Empty>;
 return <article className="lesson"><Link to="/app/learn">← Back</Link><div className="vis big"><Vis l={l}/></div><h1>{l.title}</h1><Diff d={l.diff}/><h3>Meaning</h3><p>{l.meaning}</p><h3>Explanation</h3><p>{l.explain}</p><h3>Example</h3><p>{l.ex}</p>
  <div className="row"><button className="btn" disabled={p.done.includes(l.id)} onClick={()=>complete(l)}>{p.done.includes(l.id)?'Completed ✅':'Mark complete'}</button><Link className="btn ghost" to="/app/practice">Practice</Link><button className="btn ghost" onClick={()=>toggleFav('lesson:'+l.id,l.title)}>{isFav('lesson:'+l.id)?'★ Saved':'☆ Favorite'}</button></div></article>}
export function Translator({start='t2b'}){const{toggleFav,toast,addHistory}=useApp();const[mode,setMode]=useState(start);const[inp,setInp]=useState('');const[hist,setHist]=useState(()=>JSON.parse(localStorage.getItem('sb_trans')||'[]'));
 useEffect(()=>{localStorage.setItem('sb_trans',JSON.stringify(hist))},[hist]);
 const out=useMemo(()=>{if(!inp)return{v:''};try{return{v:mode==='t2b'?toBraille(inp):fromBraille(inp)}}catch(e){return{err:e.message}}},[inp,mode]);
 const save=()=>{if(inp&&out.v){setHist(h=>[{i:inp,o:out.v,m:mode},...h.filter(x=>x.i!==inp)].slice(0,8));addHistory('Translation',inp)}};
 const ex=mode==='t2b'?['hello','I need water','room 12']:[toBraille('help'),toBraille('thank you')];
 return <><h1>Braille Translator</h1><div className="tabs"><button className={mode==='t2b'?'on':''} onClick={()=>{setMode('t2b');setInp('')}}>Text → Braille</button><button className={mode==='b2t'?'on':''} onClick={()=>{setMode('b2t');setInp('')}}>Braille → Text</button></div>
 <div className="grid2"><label className="glass">Input<textarea rows="5" value={inp} onChange={e=>setInp(e.target.value)} onBlur={save} placeholder={mode==='t2b'?'Type text…':'Paste Unicode Braille…'}/></label>
  <div className="glass" aria-live="polite"><b>Output</b>{out.err?<p className="err">{out.err}</p>:mode==='t2b'?<Braille text={inp||' '}/>:<p className="big">{out.v||'—'}</p>}</div></div>
 <div className="row"><button className="btn" onClick={()=>{navigator.clipboard?.writeText(out.v||'');toast('Copied');save()}}>Copy</button><button className="btn ghost" onClick={()=>setInp('')}>Clear</button><button className="btn ghost" onClick={()=>{setMode(mode==='t2b'?'b2t':'t2b');setInp(out.v||'')}}>⇄ Swap</button><button className="btn ghost" onClick={()=>inp&&toggleFav('tr:'+inp,'Translation: '+inp)}>☆ Favorite</button></div>
 <h3>Examples</h3><div className="row">{ex.map(e=><button key={e} className="chip" onClick={()=>setInp(e)}>{e}</button>)}</div>
 <h3>History</h3>{hist.length?hist.map((h,i)=><p key={i}><button className="chip" onClick={()=>{setMode(h.m);setInp(h.i)}}>{h.i}</button> → {h.o}</p>):<Empty t="No translations yet" d="Type something and click away to save."/>}</>}
const DIFFS=['Easy','Medium','Hard'];
export function Dictionary(){const{signs,lessons,toggleFav,isFav}=useApp();const nav=useNavigate();const[q,setQ]=useState('');const[cat,setCat]=useState('All');const[df,setDf]=useState('All');const[sort,setSort]=useState('az');const[pg,setPg]=useState(1);const[sel,setSel]=useState(null);const[busy,setBusy]=useState(false);const dq=useDebounce(q);
 useEffect(()=>{setBusy(true);const t=setTimeout(()=>setBusy(false),250);return()=>clearTimeout(t)},[dq,cat,df,sort]);
 const cats=['All',...new Set(signs.map(s=>s.cat))];
 const list=useMemo(()=>signs.filter(s=>(cat==='All'||s.cat===cat)&&(df==='All'||s.diff===df)&&(s.word+s.meaning+s.cat).toLowerCase().includes(dq.toLowerCase())).sort((a,b)=>sort==='az'?a.word.localeCompare(b.word):DIFFS.indexOf(a.diff)-DIFFS.indexOf(b.diff)),[signs,dq,cat,df,sort]);
 const pages=Math.max(1,Math.ceil(list.length/6)),cur=Math.min(pg,pages),rel=s=>lessons.filter(l=>l.title.toLowerCase().includes(s.cat.toLowerCase())||l.topic.toLowerCase().includes(s.cat.toLowerCase()));
 return <><h1>Accessibility Dictionary</h1><p>Search a word to see meaning, Braille and sign together.</p>
 <div className="filters"><input type="search" aria-label="Search" placeholder="Search e.g. hospital" value={q} onChange={e=>{setQ(e.target.value);setPg(1)}} list="sug"/><datalist id="sug">{signs.map(s=><option key={s.id} value={s.word}/>)}</datalist>
  <select aria-label="Category" value={cat} onChange={e=>{setCat(e.target.value);setPg(1)}}>{cats.map(c=><option key={c}>{c}</option>)}</select>
  <select aria-label="Difficulty" value={df} onChange={e=>{setDf(e.target.value);setPg(1)}}>{['All',...DIFFS].map(c=><option key={c}>{c}</option>)}</select>
  <select aria-label="Sort" value={sort} onChange={e=>setSort(e.target.value)}><option value="az">A–Z</option><option value="diff">Difficulty</option></select></div>
 {busy?<Loading/>:list.length?<><div className="grid3">{list.slice((cur-1)*6,cur*6).map(s=><article key={s.id} className="card lift"><div className="vis"><SignArt word={s.word}/></div><h3>{s.word}</h3><Braille text={s.word}/><p>{s.meaning}</p><div className="row"><span className="pill">{s.cat}</span><Diff d={s.diff}/></div>
  <div className="row"><button className="btn" onClick={()=>setSel(s)}>Details</button><button className="icon" aria-label="Favorite" aria-pressed={isFav('sign:'+s.id)} onClick={()=>toggleFav('sign:'+s.id,s.word)}>{isFav('sign:'+s.id)?'★':'☆'}</button></div></article>)}</div>
  <div className="row pager"><button className="btn ghost" disabled={cur===1} onClick={()=>setPg(cur-1)}>← Prev</button><span>Page {cur} / {pages}</span><button className="btn ghost" disabled={cur===pages} onClick={()=>setPg(cur+1)}>Next →</button></div></>:<Empty e="🔍" t="No results" d="Try another word or clear the filters."/>}
 {sel&&<Modal title={sel.word} onClose={()=>setSel(null)}><div className="vis"><SignArt word={sel.word} size={120}/></div><Braille text={sel.word}/><p><b>Meaning:</b> {sel.meaning}</p><p><b>Useful phrase:</b> “{sel.ex}”</p><Braille text={sel.ex}/><p><b>Related:</b> {sel.rel.join(', ')}</p><p><b>Lessons:</b> {rel(sel).map(l=>l.title).join(', ')||'—'}</p><OnlineDef word={sel.word}/> <button className="btn" onClick={()=>nav('/app/practice')}>Practice</button></Modal>}</>}
export function Communicate(){const{speak}=useApp();const[t,setT]=useState('');
 return <><h1>Communication Center</h1><label className="glass">Type a message<textarea rows="3" value={t} onChange={e=>setT(e.target.value)}/></label>
 <div className="grid2"><div className="glass"><b>Braille</b><br/><Braille text={t||' '}/></div><div className="glass"><b>Text</b><p className="big">{t||'—'}</p></div></div>
 <div className="row"><button className="btn big" onClick={()=>t&&speak(t)}>🔊 Speak</button><button className="btn ghost big" onClick={()=>setT('')}>Clear</button></div>
 <h3>Useful phrases</h3><div className="row">{PHRASES.map(x=><button key={x} className="chip big" onClick={()=>setT(x)}>{x}</button>)}</div></>}
export function Emergency(){const{speak}=useApp();
 return <><h1>Emergency Communication</h1><p className="notice">⚠️ Communication aid only. This website does <b>not</b> contact emergency services — call your local emergency number.</p>
 <div className="grid2">{EMERGENCY.map(([t,e,d])=><article key={t} className="card sos"><h2>{t}</h2><Braille text={t}/><div className="row"><SignArt word={e} size={70}/><p><b>Sign reference:</b> learn “{t.toLowerCase()}” in the Dictionary.<br/>{d}</p></div><button className="btn big" onClick={()=>speak(t.toLowerCase())}>🔊 Say it</button></article>)}</div></>}
export function Scenarios(){return <><h1>Real-Life Scenarios</h1><div className="grid3">{SCENARIOS.map(s=><Link key={s.id} to={'/app/scenarios/'+s.id} className="card lift"><SignArt word={s.sign}/><h3>{s.name}</h3><p>{s.sit}</p></Link>)}</div></>}
export function Scenario(){const{id}=useParams();const{signs,upd,toast}=useApp();const s=SCENARIOS.find(x=>x.id===id);const[pick,setPick]=useState(null);
 const opts=useMemo(()=>s?[s.ok,...s.bad].sort(()=>Math.random()-.5):[],[id]);
 if(!s)return <Empty t="Scenario not found" d="Pick one from the list."><Link className="btn" to="/app/scenarios">Back</Link></Empty>;
 const sg=signs.find(x=>x.word===s.sign);
 return <><Link to="/app/scenarios">← All scenarios</Link><h1>{s.name}</h1><div className="glass"><b>Situation:</b> {s.sit}</div><h3>Choose the best response</h3>
 <div className="opts">{opts.map(o=><button key={o} disabled={pick} className={'opt'+(pick&&o===s.ok?' good':pick===o?' bad':'')} onClick={()=>{setPick(o);if(o===s.ok){upd(x=>({xp:x.xp+5}));toast('Correct! +5 XP')}}}>{o}</button>)}</div>
 {pick&&<div className="glass" role="status"><p>{pick===s.ok?'✅ Correct!':'❌ Not quite — the best phrase is “'+s.ok+'”.'}</p><p>Braille:</p><Braille text={s.ok}/>{sg&&<p>Sign reference: <SignArt word={sg.word} size={70}/> {sg.word}</p>}<div className="row"><button className="btn" onClick={()=>setPick(null)}>Retry</button><Link className="btn ghost" to="/app/practice">Practice</Link></div></div>}</>}

/* ---------- quiz engine (practice + test) ---------- */
export function Quiz({qs,limit,instant,onDone}){const[i,setI]=useState(0);const[ans,setAns]=useState({});const[hint,setHint]=useState(false);const[ask,setAsk]=useState(false);const[left,setLeft]=useState(limit||0);
 const finish=()=>onDone(qs.map((x,k)=>[x.topic,ans[k]===x.a]),limit?limit-left:0,qs.map((x,k)=>({q:x.q,you:ans[k]!=null?x.opts[ans[k]]:null,right:x.opts[x.a],ob:x.ob})));
 useEffect(()=>{if(!limit)return;const t=setInterval(()=>setLeft(l=>l-1),1000);return()=>clearInterval(t)},[limit]);
 useEffect(()=>{if(limit&&left<=0)finish()},[left]);
 const q=qs[i],sel=ans[i],score=qs.filter((x,k)=>ans[k]===x.a).length;
 const pick=k=>{if(instant&&sel!=null)return;setAns({...ans,[i]:k})};
 return <div className="quiz"><div className="row between"><span>Question {i+1}/{qs.length}</span>{limit>0&&<b className={'timer'+(left<60?' low':'')}>{String(Math.floor(left/60)).padStart(2,'0')}:{String(left%60).padStart(2,'0')}</b>}{instant&&<span>Score {score}</span>}</div>
  <Bar v={(Object.keys(ans).length/qs.length)*100} label="Answered"/><h2>{q.q}</h2>
  {q.br&&<div className="vis"><Braille raw text={q.br}/></div>}{q.sg&&<div className="vis"><SignArt word={q.sg} size={120}/></div>}
  <div className="opts">{q.opts.map((o,k)=><button key={k} className={'opt'+(instant&&sel!=null?(k===q.a?' good':k===sel?' bad':''):sel===k?' sel':'')} onClick={()=>pick(k)}>{q.ob?<Braille raw text={o}/>:q.oe?<SignArt word={o} size={64}/>:o}</button>)}</div>
  {instant&&sel!=null&&<p role="status">{sel===q.a?'✅ Correct!':'❌ Incorrect'}</p>}{hint&&<p className="notice">💡 {q.hint}</p>}
  <div className="row"><button className="btn ghost" disabled={i===0} onClick={()=>{setI(i-1);setHint(false)}}>← Prev</button><button className="btn ghost" onClick={()=>setHint(true)}>Hint</button>
   {i<qs.length-1?<button className="btn" onClick={()=>{setI(i+1);setHint(false)}}>Next →</button>:<button className="btn coral" onClick={()=>instant?finish():setAsk(true)}>Submit</button>}</div>
  {!instant&&<div className="qnav" aria-label="Question navigation">{qs.map((_,k)=><button key={k} className={(k===i?'cur ':'')+(ans[k]!=null?'done':'')} onClick={()=>{setI(k);setHint(false)}}>{k+1}</button>)}</div>}
  {ask&&<Modal title="Submit test?" onClose={()=>setAsk(false)}><p>You answered {Object.keys(ans).length} of {qs.length} questions.</p><div className="row"><button className="btn coral" onClick={finish}>Yes, submit</button><button className="btn ghost" onClick={()=>setAsk(false)}>Keep going</button></div></Modal>}</div>}
const MODES=[['b2t','Braille → Text'],['t2b','Text → Braille'],['s2m','Sign → Meaning'],['m2s','Meaning → Sign'],['num','Fill: Numbers'],['sc','Scenario'],['tf','True / False'],['braille','Braille Practice'],['sign','Sign Practice'],['phr','Phrase Practice'],['mix','Mixed']];
export function Practice(){const{signs,practiceDone}=useApp();const[mode,setMode]=useState(null);const[df,setDf]=useState(5);const[qs,setQs]=useState(null);const[res,setRes]=useState(null);
 const start=m=>{setMode(m);setRes(null);setQs(gen(m,df,signs))};const{mode:pm}=useParams();useEffect(()=>{if(pm&&!qs&&!res)start(pm)},[pm]);
 if(res)return <div className="glass center"><h1>Score {res.c}/{res.n}</h1><div className="row"><button className="btn" onClick={()=>start(mode)}>Retry</button><button className="btn ghost" onClick={()=>{setQs(null);setRes(null)}}>Change mode</button></div></div>;
 if(qs)return <Quiz qs={qs} instant onDone={items=>{const c=items.filter(x=>x[1]).length;practiceDone(c,items.length,mode);setRes({c,n:items.length})}}/>;
 return <><h1>Practice Zone</h1><label>Difficulty <select value={df} onChange={e=>setDf(+e.target.value)}><option value={5}>Easy (5)</option><option value={8}>Medium (8)</option><option value={12}>Hard (12)</option></select></label><div className="grid3">{MODES.map(([m,l])=><button key={m} className="card lift" onClick={()=>start(m)}><h3>{l}</h3></button>)}</div></>}
export function DailyTest(){const{recordTest,signs}=useApp();const nav=useNavigate();const[qs,setQs]=useState(null);
 if(!qs)return <div className="glass center"><h1>Daily Test</h1><p className="big">10 Questions · 15 Minutes</p><button className="btn big" onClick={()=>setQs(gen('mix',10,signs))}>Start test</button></div>;
 return <Quiz qs={qs} limit={900} onDone={(items,secs,detail)=>{recordTest({date:today(),score:items.filter(x=>x[1]).length,total:items.length,secs,items,detail});nav('/app/result')}}/>}
export function Result(){const{p}=useApp();const r=p.tests[p.tests.length-1];
 if(!r)return <Empty t="No test yet" d="Take the daily test first."><Link className="btn" to="/app/test">Take test</Link></Empty>;
 const ts=topicStats([r]),weak=topicStats(p.tests).find(t=>t.pct<100),acc=Math.round(r.score/r.total*100);
 return <><h1>Test Result</h1><div className="bento"><div className="card"><Ring v={acc} label="Score"/><h3>{r.score}/{r.total}</h3></div><Stat e="🎯" n={acc+'%'} l="Accuracy"/><Stat e="⏱️" n={Math.floor(r.secs/60)+'m '+r.secs%60+'s'} l="Time"/><Stat e="✅" n={r.score} l="Correct"/><Stat e="❌" n={r.total-r.score} l="Incorrect"/></div>
 <h3>Topic performance</h3>{ts.map(t=><div key={t.topic}><p>{t.topic} — {t.c}/{t.n}</p><Bar v={t.pct}/></div>)}
 <div className="row"><div className="glass">💪 Strong: {ts.filter(t=>t.pct>=70).map(t=>t.topic).join(', ')||'—'}</div><div className="glass">📉 Weak: {ts.filter(t=>t.pct<70).map(t=>t.topic).join(', ')||'—'}</div></div>
 {weak&&<div className="notice big">You should revise <b>{weak.topic}</b>.</div>}<div className="row"><Link className="btn" to="/app/revision">Revision Center</Link><Link className="btn ghost" to="/app/review">Answer Review</Link><Link className="btn ghost" to="/app/test">Retake</Link></div></>}
export function Revision(){const{p}=useApp();const nav=useNavigate();const st=topicStats(p.tests);
 if(!st.length)return <Empty t="No data yet" d="Take a daily test and we will recommend topics."><Link className="btn" to="/app/test">Take test</Link></Empty>;
 const G=[['🚨 Needs Revision',t=>t.pct<50],['🔧 Practice More',t=>t.pct>=50&&t.pct<70],['🌗 Almost Mastered',t=>t.pct>=70&&t.pct<90],['💪 Strong Topics',t=>t.pct>=90]];
 return <><h1>Recommended for You</h1><p>Rules: under 50% needs revision, 50–69% practice more, 70–89% almost mastered, 90%+ strong (based on all your test answers).</p>
 {G.map(([h,f])=>{const l=st.filter(f);return <section key={h}><h3>{h}</h3>{l.length?<div className="grid3">{l.map(t=><div key={t.topic} className="card"><b>{t.topic}</b><p>Reason: {t.n-t.c} wrong out of {t.n} answers.</p><Bar v={t.pct}/><button className="btn" onClick={()=>nav('/app/learn')}>Start Revision</button></div>)}</div>:<p>—</p>}</section>})}</>}
export function Progress(){const{p,lessons}=useApp();const lv=levelOf(p.xp),avg=p.tests.length?Math.round(p.tests.reduce((s,t)=>s+t.score/t.total,0)/p.tests.length*100):0,tot=p.tests.reduce((s,t)=>s+t.total,0),cor=p.tests.reduce((s,t)=>s+t.score,0);
 return <><h1>Progress</h1><div className="bento"><div className="card"><Ring v={Math.round(p.done.length/lessons.length*100)} label="Learning"/><h3>Learning</h3></div><div className="card"><Ring v={avg} label="Test average"/><h3>Test average</h3></div><div className="card"><Ring v={tot?Math.round(cor/tot*100):0} label="Accuracy"/><h3>Accuracy</h3></div><Stat e="🔥" n={p.streak} l="Streak"/><Stat e="⚡" n={p.xp} l="XP"/><Stat e="🎖️" n={lv.name} l="Level"/></div>
 <h3>Recent tests</h3>{p.tests.length?<div className="chart">{p.tests.slice(-8).map((t,i)=><div key={i} title={`${t.score}/${t.total}`}><span style={{height:t.score/t.total*100+'%'}}/><small>{t.score}</small></div>)}</div>:<Empty t="No tests yet" d="Your chart appears here."/>}
 <h3>Topic performance</h3>{topicStats(p.tests).map(t=><div key={t.topic}><p>{t.topic} — {t.pct}%</p><Bar v={t.pct}/></div>)}
 <h3>Badges</h3><div className="grid3">{BADGES.map(b=><div key={b.id} className={'card ach'+(p.badges.includes(b.id)?'':' locked')}><span className="emo">{b.e}</span><b>{b.n}</b></div>)}</div></>}
const DEF=['Complete a Braille lesson','Practice 10 signs','Take the Daily Test','Revise a weak topic'];
export function Planner(){const{p,upd,toast}=useApp();const[n,setN]=useState('');const items=p.plan?.date===today()?p.plan.items:DEF.map(t=>({t,done:false}));const save=it=>upd(()=>({plan:{date:today(),items:it}}));
 return <><h1>Learning Planner</h1><h3>Today</h3><ul className="plan">{items.map((x,i)=><li key={i}><label><input type="checkbox" checked={x.done} onChange={()=>{save(items.map((y,k)=>k===i?{...y,done:!y.done}:y));if(!x.done)toast('✓ Task done')}}/> <span className={x.done?'strike':''}>{x.t}</span></label><button className="icon" aria-label="Delete task" onClick={()=>save(items.filter((_,k)=>k!==i))}>✕</button></li>)}</ul>
 <Bar v={items.length?items.filter(x=>x.done).length/items.length*100:0} label="Plan progress"/>
 <form className="row" onSubmit={e=>{e.preventDefault();if(n.trim()){save([...items,{t:n.trim(),done:false}]);setN('')}}}><input aria-label="New task" value={n} onChange={e=>setN(e.target.value)} placeholder="Add a task"/><button className="btn">Add</button></form></>}
export function Library({start='Favorites'}){const{p,toggleFav}=useApp();const[tab,setTab]=useState(start);
 return <><h1>Library</h1><div className="tabs">{['Favorites','History','Achievements'].map(t=><button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
 {tab==='Favorites'&&(p.favs.length?p.favs.map(f=><p key={f.k} className="card row between">{f.label}<button className="icon" onClick={()=>toggleFav(f.k,f.label)} aria-label="Remove">★</button></p>):<Empty t="No favorites" d="Tap ☆ on lessons, signs or translations."/>)}
 {tab==='History'&&(p.hist.length?p.hist.map((h,i)=><p key={i} className="card"><b>{h.type}</b> · {h.text} <small>{new Date(h.t).toLocaleString()}</small></p>):<Empty t="No history" d="Your activity will appear here."/>)}
 {tab==='Achievements'&&<div className="grid3">{BADGES.map(b=><div key={b.id} className={'card ach'+(p.badges.includes(b.id)?'':' locked')}><span className="emo">{b.e}</span><b>{b.n}</b></div>)}</div>}</>}
export function Profile(){const{user,setUser,p,toast}=useApp();const[f,setF]=useState(user);const[er,setEr]=useState('');const lv=levelOf(p.xp);
 const save=e=>{e.preventDefault();if(f.name.trim().length<2)return setEr('Name must be at least 2 characters.');if(f.bio.length>120)return setEr('Bio max 120 characters.');setEr('');setUser(f);toast('Profile updated')};
 return <><h1>Profile</h1><div className="bento"><div className="card wide"><div className="avatar">{user.name[0].toUpperCase()}</div><h3>{user.name}</h3><p>{lv.name} · {p.xp} XP · 🔥 {p.streak} · {p.done.length} lessons · {p.badges.length} badges</p></div></div>
 <form className="glass form" onSubmit={save}><label>Name<input value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></label><label>Bio<textarea value={f.bio} onChange={e=>setF({...f,bio:e.target.value})}/></label><label>Favorite topic<select value={f.interest} onChange={e=>setF({...f,interest:e.target.value})}><option>Braille</option><option>Sign Language</option></select></label>{er&&<em>{er}</em>}<button className="btn">Save</button></form></>}
export function Settings(){const{settings:s,setSettings,toast}=useApp();const set=(k,v)=>{setSettings({...s,[k]:v});toast('Settings changed')};
 return <><h1>Accessibility Settings</h1><div className="glass form"><fieldset><legend>Theme</legend>{['light','dark'].map(t=><label key={t}><input type="radio" name="th" checked={s.theme===t} onChange={()=>set('theme',t)}/> {t}</label>)}</fieldset>
 <label>Font size: {s.font}px<input type="range" min="14" max="22" value={s.font} onChange={e=>set('font',+e.target.value)}/></label>
 {[['contrast','High contrast'],['motion','Reduced motion'],['large','Large buttons'],['sound','Sound / text-to-speech'],['popups','Reminder & motivation pop-ups']].map(([k,l])=><label key={k}><input type="checkbox" checked={k==='popups'?s[k]!==false:s[k]} onChange={e=>set(k,e.target.checked)}/> {l}</label>)}</div></>}
