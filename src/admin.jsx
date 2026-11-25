import {useState} from 'react';
import {NavLink,Outlet,useParams} from 'react-router-dom';
import {useApp,useLS} from './ctx.jsx';
import {Modal,Empty,Stat,Diff} from './ui.jsx';
const D=['Easy','Medium','Hard'];
const CFG={
 lessons:{label:'Lessons',cols:['title','track','diff'],blank:{title:'',track:'braille',topic:'',diff:'Easy',sample:'',meaning:'',explain:'',ex:''},fields:[['title','Title'],['track','Track',['braille','sign']],['topic','Topic'],['diff','Difficulty',D],['sample','Sample'],['meaning','Meaning']]},
 signs:{label:'Signs',cols:['word','cat','diff'],blank:{word:'',cat:'',diff:'Easy',emoji:'',meaning:'',ex:'',rel:[]},fields:[['word','Word'],['cat','Category'],['diff','Difficulty',D],['emoji','Emoji'],['meaning','Meaning'],['ex','Example']]}};
export function AdminLayout(){return <div className="admin"><header className="top"><b>🛠️ SignBridge Admin</b><nav>{[['/admin','Dashboard',1],['/admin/users','Users'],['/admin/lessons','Lessons'],['/admin/braille','Braille'],['/admin/signs','Signs'],['/admin/categories','Categories'],['/admin/questions','Questions'],['/admin/tests','Daily Tests'],['/admin/resources','Resources'],['/admin/activities','Activities'],['/admin/reports','Reports'],['/admin/settings','Settings']].map(([t,l,e])=><NavLink key={t} to={t} end={!!e}>{l}</NavLink>)}<NavLink to="/app">← Learner app</NavLink></nav></header><main className="main page"><Outlet/></main></div>}
export function AdminHome(){const{lessons,signs}=useApp();return <><h1>Admin Dashboard</h1><div className="bento"><Stat e="📚" n={lessons.length} l="Lessons"/><Stat e="🤟" n={signs.length} l="Signs"/><Stat e="🗂️" n={new Set(signs.map(s=>s.cat)).size} l="Categories"/></div><p>Use the tabs above to create, edit and delete content. Data is saved in localStorage.</p></>}
const X=(cols,fields,blank)=>({cols,fields:[...fields,['diff','Difficulty',D]],blank:{...blank,diff:'Easy'}});
const LSC={braille:['Braille Content',[{id:'bc1',title:'Hello',text:'hello',diff:'Easy'},{id:'bc2',title:'Water',text:'water',diff:'Easy'}],X(['title','text','diff'],[['title','Title'],['text','Text']],{title:'',text:''})],
 questions:['Questions',[{id:'q1',q:'Which letter is the first Braille cell?',answer:'a',topic:'Braille Alphabet',diff:'Easy'}],X(['q','answer','topic'],[['q','Question'],['answer','Answer'],['topic','Topic']],{q:'',answer:'',topic:''})],
 tests:['Daily Tests',[{id:'t1',name:'Daily Mixed Test',count:'10',minutes:'15',diff:'Medium'}],X(['name','count','minutes'],[['name','Name'],['count','Questions'],['minutes','Minutes']],{name:'',count:'10',minutes:'15'})],
 resources:['Resources',[{id:'r1',title:'What is Braille?',category:'Awareness',diff:'Easy'}],X(['title','category'],[['title','Title'],['category','Category']],{title:'',category:''})],
 activities:['Activities',[{id:'a1',name:'Learn Braille Numbers',type:'Lesson',diff:'Easy'}],X(['name','type'],[['name','Name'],['type','Type']],{name:'',type:''})]};
function LS({k,title,init,cfg,pre}){const[rows,setRows]=useLS(k,init);return <Crud title={title} rows={rows} setRows={setRows} cfg={cfg} pre={pre}/>}
function AdminSettings(){const{toast}=useApp();const[s,setS]=useLS('sb_admin',{name:'SignBridge',reg:true});return <><h1>Admin Settings</h1><div className="glass form"><label>Site name<input value={s.name} onChange={e=>setS({...s,name:e.target.value})}/></label><label><input type="checkbox" checked={s.reg} onChange={e=>{setS({...s,reg:e.target.checked});toast('Settings changed')}}/> Allow new registrations</label></div></>}
export function AdminSection(){const{section}=useParams();const a=useApp();
 if(section==='lessons')return <Crud key="l" title="Lessons" rows={a.lessons} setRows={a.setLessons} cfg={CFG.lessons} pre="l"/>;
 if(section==='signs')return <Crud key="s" title="Signs" rows={a.signs} setRows={a.setSigns} cfg={CFG.signs} pre="s"/>;
 if(LSC[section]){const[t,init,cfg]=LSC[section];return <LS key={section} k={'sb_a_'+section} title={t} init={init} cfg={cfg} pre={section[0]}/>}
 if(section==='settings')return <AdminSettings/>;
 if(section==='categories'){const c={};a.signs.forEach(s=>c[s.cat]=(c[s.cat]||0)+1);return <><h1>Categories</h1>{Object.entries(c).map(([k,v])=><p key={k} className="card row between">{k}<b>{v} signs</b></p>)}</>}
 if(section==='users')return <Users/>;
 if(section==='reports'){const{p}=a;return <><h1>Reports</h1><div className="bento"><Stat e="📝" n={p.tests.length} l="Tests taken"/><Stat e="✅" n={p.done.length} l="Lessons completed"/><Stat e="⚡" n={p.xp} l="XP earned"/></div></>}
 return <Empty t="Section not found" d="Choose a tab above."/>}
function Users(){const{user,toast}=useApp();const[u,setU]=useState([{id:1,name:user.name,email:user.email,role:user.role},{id:2,name:'Priya',email:'priya@demo.com',role:'learner'},{id:3,name:'Arjun',email:'arjun@demo.com',role:'learner'}]);
 return <><h1>Users (demo)</h1>{u.map(x=><p key={x.id} className="card row between">{x.name} · {x.email} · <Diff d={x.role==='admin'?'Hard':'Easy'}/>{x.id!==1&&<button className="btn ghost" onClick={()=>{setU(u.filter(y=>y.id!==x.id));toast('User deleted')}}>Delete</button>}</p>)}</>}
function Crud({title,rows,setRows,cfg,pre}){const{toast}=useApp();const[q,setQ]=useState('');const[fd,setFd]=useState('All');const[ed,setEd]=useState(null);const[del,setDel]=useState(null);const[er,setEr]=useState({});
 const shown=rows.filter(r=>(fd==='All'||r.diff===fd)&&JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
 const save=e=>{e.preventDefault();const x={};cfg.fields.forEach(([k,l])=>{if(!String(ed[k]||'').trim())x[k]=l+' is required'});setEr(x);if(Object.keys(x).length)return toast('❌ Fix the errors');
  if(ed.id){setRows(rows.map(r=>r.id===ed.id?ed:r));toast('✅ Updated')}else{setRows([...rows,{...ed,id:pre+Date.now()}]);toast('✅ Created')}setEd(null)};
 return <><div className="row between"><h1>{title}</h1><button className="btn" onClick={()=>{setEr({});setEd({...cfg.blank})}}>+ Add</button></div>
 <div className="filters"><input type="search" aria-label="Search" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/><select aria-label="Filter" value={fd} onChange={e=>setFd(e.target.value)}>{['All',...D].map(d=><option key={d}>{d}</option>)}</select></div>
 {shown.length?<div className="scroll"><table><thead><tr>{cfg.cols.map(c=><th key={c}>{c}</th>)}<th>Actions</th></tr></thead><tbody>{shown.map(r=><tr key={r.id}>{cfg.cols.map(c=><td key={c}>{r[c]}</td>)}<td><button className="btn ghost" onClick={()=>{setEr({});setEd(r)}}>Edit</button> <button className="btn ghost" onClick={()=>setDel(r)}>Delete</button></td></tr>)}</tbody></table></div>:<Empty t="Nothing found" d="Try different filters or add an item."/>}
 {ed&&<Modal title={ed.id?'Edit':'Add'} onClose={()=>setEd(null)}><form className="form" onSubmit={save} noValidate>{cfg.fields.map(([k,l,o])=><label key={k}>{l}{o?<select value={ed[k]} onChange={e=>setEd({...ed,[k]:e.target.value})}>{o.map(v=><option key={v}>{v}</option>)}</select>:<input value={ed[k]||''} onChange={e=>setEd({...ed,[k]:e.target.value})}/>}<em>{er[k]}</em></label>)}<button className="btn">Save</button></form></Modal>}
 {del&&<Modal title="Delete item?" onClose={()=>setDel(null)}><p>This cannot be undone.</p><div className="row"><button className="btn coral" onClick={()=>{setRows(rows.filter(r=>r.id!==del.id));setDel(null);toast('🗑️ Deleted')}}>Delete</button><button className="btn ghost" onClick={()=>setDel(null)}>Cancel</button></div></Modal>}</>}
