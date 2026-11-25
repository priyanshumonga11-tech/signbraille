import {useState,useEffect,useMemo} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import {useApp,useLS} from './ctx.jsx';
import {Braille,Bar,Ring,Empty,SignArt} from './ui.jsx';
import {B,toBraille,levelOf,today,sh} from './data';
import {setRange,setSort} from './store.js';
const addH=(x,type,text)=>[{type,text,t:Date.now()},...x.hist].slice(0,60);

/* ---------- Explore hub ---------- */
const TILES=[['/app/challenge','⚡','Daily Challenge','60-second Braille speed round'],['/app/stories','📖','Story Mode','Real-life conversations'],['/app/flashcards','🗂️','Flashcards','Flip, learn, remember'],['/app/leaderboard','🏆','Leaderboard','Climb the ranks'],['/app/checkin','🌤️','Daily Check-in','Mood and goal for today'],['/app/feedback','💌','Feedback','Rate your experience'],['/app/certificate','🎓','Certificate','Earn your certificate']];
export const Explore=()=><><h1>Explore</h1><p className="lead">Extra ways to learn, play and stay motivated.</p>
 <div className="grid3">{TILES.map(([to,e,t,d])=><Link key={to} to={to} className="card xt"><span className="emo">{e}</span><h3>{t}</h3><p>{d}</p></Link>)}</div></>;

/* ---------- Daily Challenge ---------- */
const WORDS=['cab','bad','face','head','dad','bee','age','fig','hi','jade','deaf','bead','hand','sign','love','dig','ice','hid','fed','ache','beach','chef','bike'];
export function Challenge(){
 const{upd,toast}=useApp();const[best,setBest]=useLS('sb_best',0);
 const[st,setSt]=useState('idle'),[left,setLeft]=useState(60),[score,setScore]=useState(0),[w,setW]=useState(''),[v,setV]=useState(''),[bad,setBad]=useState(false);
 const pick=()=>{let n;do{n=WORDS[Math.floor(Math.random()*WORDS.length)]}while(n===w);setW(n);setV('')};
 const start=()=>{setScore(0);setLeft(60);pick();setSt('play')};
 useEffect(()=>{if(st!=='play')return;const t=setInterval(()=>setLeft(l=>l-1),1000);return()=>clearInterval(t)},[st]);
 useEffect(()=>{if(st==='play'&&left<=0){const xp=score*3;setSt('over');if(score>best)setBest(score);upd(x=>({xp:x.xp+xp,hist:addH(x,'Practice','Daily Challenge: '+score+' words')}));toast('⚡ Challenge done +'+xp+' XP')}},[left,st]);
 const go=e=>{e.preventDefault();if(v.trim().toLowerCase()===w){setScore(score+1);pick()}else{setBad(true);setTimeout(()=>setBad(false),400)}};
 return <><h1>Daily Challenge</h1>
  {st==='idle'&&<div className="glass center"><span className="emo">⚡</span><h2>60-second Braille speed round</h2><p>Read the Braille word and type it. Each correct word gives +3 XP.</p><p>Best score: <b>{best}</b></p><button className="btn big" onClick={start}>Start challenge</button></div>}
  {st==='play'&&<div className="glass center"><div className="row between"><b>Score {score}</b><b className={'timer'+(left<10?' low':'')}>{left}s</b></div><Bar v={left/60*100} label="Time left"/>
   <div className="ch-word"><Braille raw text={toBraille(w)}/></div>
   <form className={'ch-in'+(bad?' shake':'')} onSubmit={go}><input autoFocus aria-label="Type the word" value={v} onChange={e=>setV(e.target.value)} placeholder="Type the word…" autoComplete="off"/><button className="btn">Check</button></form></div>}
  {st==='over'&&<div className="glass center"><span className="emo">🏁</span><h2>Time is up!</h2><p className="big">{score} words · +{score*3} XP</p><p>Best score: <b>{Math.max(best,score)}</b></p><div className="row" style={{justifyContent:'center'}}><button className="btn big" onClick={start}>Play again</button><Link className="btn ghost" to="/app/explore">Explore</Link></div></div>}</>}

/* ---------- Leaderboard (Redux Toolkit slice) ---------- */
export function Leaderboard(){
 const{p,user}=useApp();const{rows,range,sort}=useSelector(s=>s.board),d=useDispatch();
 const list=useMemo(()=>{const all=[...rows,{n:(user?user.name:'You')+' (you)',w:p.xp,a:p.xp,s:p.streak,me:1}].map(r=>({...r,xp:range==='weekly'?r.w:r.a}));
  return all.sort((a,b)=>sort==='name'?a.n.localeCompare(b.n):sort==='streak'?b.s-a.s:b.xp-a.xp)},[rows,range,sort,p.xp,p.streak,user]);
 const max=Math.max(...list.map(r=>r.xp),1),top=list.slice(0,3),medal=['🥇','🥈','🥉'];
 return <><h1>Leaderboard</h1><div className="row">{[['weekly','This week'],['all','All time']].map(([k,l])=><button key={k} className={'chip'+(range===k?' on':'')} aria-pressed={range===k} onClick={()=>d(setRange(k))}>{l}</button>)}
  <select aria-label="Sort by" style={{width:'auto'}} value={sort} onChange={e=>d(setSort(e.target.value))}><option value="xp">Sort: XP</option><option value="streak">Sort: Streak</option><option value="name">Sort: Name</option></select></div>
  {sort!=='name'&&<div className="podium">{[1,0,2].map(k=>top[k]&&<div key={k} className={'card pod p'+(k+1)+(top[k].me?' me':'')}><span className="emo">{medal[k]}</span><b>{top[k].n}</b><small>{sort==='xp'?top[k].xp+' XP':'🔥 '+top[k].s+' days'}</small></div>)}</div>}
  {list.map((r,i)=><div key={r.n} className={'lb-row'+(r.me?' me':'')}><span className="lb-rank">{i+1}</span><div><b>{r.n}</b><Bar v={r.xp/max*100} label={r.n+' XP'}/></div><span>{r.xp} XP · 🔥{r.s}</span></div>)}
  <p><small>Other learners are demo data. Your row uses your real XP and streak.</small></p></>}

/* ---------- Flashcards ---------- */
export function Flashcards(){
 const{p,upd,signs}=useApp();const[deck,setDeck]=useState('braille'),[only,setOnly]=useState(false),[i,setI]=useState(0),[flip,setFlip]=useState(false);
 const known=p.cards||[];
 const all=useMemo(()=>deck==='braille'?[...'abcdefghijklmnopqrstuvwxyz'].map(l=>({id:'b-'+l,k:l})):signs.map(s=>({id:'s-'+s.id,s})),[deck,signs]);
 const cards=only?all.filter(c=>!known.includes(c.id)):all,c=cards.length?cards[i%cards.length]:null,kn=all.filter(x=>known.includes(x.id)).length;
 const move=ok=>{const id=c.id;upd(x=>{const cur=x.cards||[];return{cards:ok?(cur.includes(id)?cur:[...cur,id]):cur.filter(k=>k!==id)}});setFlip(false);setI(only&&ok?i:i+1)};
 const sw=k=>{setDeck(k);setI(0);setFlip(false)};
 return <><h1>Flashcards</h1><div className="row">{[['braille','⠃ Braille'],['signs','🤟 Signs']].map(([k,l])=><button key={k} className={'chip'+(deck===k?' on':'')} aria-pressed={deck===k} onClick={()=>sw(k)}>{l}</button>)}
  <label><input type="checkbox" checked={only} onChange={e=>{setOnly(e.target.checked);setI(0);setFlip(false)}}/> Review only</label></div>
  <p>{kn}/{all.length} cards known</p><Bar v={kn/all.length*100} label="Cards known"/>
  {!c?<Empty e="🎉" t="All cards known!" d="Switch off “Review only” to see them again."/>:<>
   <button className={'fc-btn'+(flip?' on':'')} onClick={()=>setFlip(!flip)} aria-label="Flip card"><span className="fc-in">
    <span className="fc-f">{c.k?<Braille raw text={toBraille(c.k)}/>:<><span className="emo">{c.s.emoji}</span><SignArt word={c.s.word} size={110}/></>}<small>Tap to flip</small></span>
    <span className="fc-b">{c.k?<><b className="big">{c.k.toUpperCase()}</b><span>Dots {B[c.k].split('').join(' · ')}</span></>:<><b className="big">{c.s.word}</b><span>{c.s.meaning}</span><small>{c.s.ex}</small></>}</span></span></button>
   <p className="center">Card {i%cards.length+1} of {cards.length}</p>
   <div className="row" style={{justifyContent:'center'}}><button className="btn ghost" onClick={()=>move(false)}>🔁 Review again</button><button className="btn coral" onClick={()=>move(true)}>✅ I knew it</button></div></>}</>}

/* ---------- Feedback ---------- */
export function Feedback(){
 const{user,toast}=useApp();const[all,setAll]=useLS('sb_feedback',[]);const[f,setF]=useState({r:0,c:'General',m:''}),[hv,setHv]=useState(0),[er,setEr]=useState({}),[sent,setSent]=useState(false);
 const go=e=>{e.preventDefault();const x={};if(!f.r)x.r='Please choose a star rating.';if(f.m.trim().length<10)x.m='Message needs 10+ characters.';setEr(x);if(Object.keys(x).length)return;
  setAll([{...f,n:user?user.name:'Guest',t:Date.now()},...all].slice(0,20));setSent(true);toast('💌 Thanks for your feedback!')};
 if(sent)return <div className="glass center"><span className="emo">💌</span><h2>Thank you!</h2><p>Your feedback helps SignBridge grow.</p><button className="btn" onClick={()=>{setSent(false);setF({r:0,c:'General',m:''})}}>Send another</button></div>;
 return <><h1>Feedback</h1><form className="glass form" onSubmit={go} noValidate>
  <fieldset><legend>Your rating</legend><div role="radiogroup" aria-label="Star rating">{[1,2,3,4,5].map(n=><button type="button" key={n} role="radio" aria-checked={f.r===n} aria-label={n+' star'+(n>1?'s':'')} className={'star'+(n<=(hv||f.r)?' on':'')} onMouseEnter={()=>setHv(n)} onMouseLeave={()=>setHv(0)} onClick={()=>setF({...f,r:n})}>★</button>)}</div>{er.r&&<em role="alert">{er.r}</em>}</fieldset>
  <label>Category<select value={f.c} onChange={e=>setF({...f,c:e.target.value})}>{['General','Lessons','Braille Translator','Sign Language','Daily Test','Design','Bug report'].map(c=><option key={c}>{c}</option>)}</select></label>
  <label>Message<textarea rows="4" maxLength="300" value={f.m} onChange={e=>setF({...f,m:e.target.value})} placeholder="Tell us what you liked or what to improve…"/><small>{f.m.length}/300</small>{er.m&&<em role="alert">{er.m}</em>}</label>
  <button className="btn">Send feedback</button></form>
  {all.length>0&&<><h3>Your recent feedback</h3>{all.slice(0,3).map(a=><div key={a.t} className="card"><b>{'★'.repeat(a.r)}{'☆'.repeat(5-a.r)}</b> · {a.c}<p>{a.m}</p></div>)}</>}</>}

/* ---------- Daily Check-in ---------- */
const MOODS=[['😞','Low'],['😕','Meh'],['🙂','Okay'],['😄','Good'],['🤩','Great']];
export function Checkin(){
 const{p,toast}=useApp();const[c,setC]=useLS('sb_checkin',{}),[moods,setMoods]=useLS('sb_moods',[]);const saved=c.d===today();
 const[f,setF]=useState({m:saved?c.m:'',g:saved?c.g:3});
 const n=p.hist.filter(h=>new Date(h.t).toISOString().slice(0,10)===today()).length,pct=saved?Math.min(100,Math.round(n/c.g*100)):0;
 const save=e=>{e.preventDefault();if(!f.m)return toast('Pick how you feel first 🙂');setC({d:today(),m:f.m,g:f.g});setMoods([{d:today(),m:f.m},...moods.filter(x=>x.d!==today())].slice(0,7));toast('🌤️ Check-in saved')};
 return <><h1>Daily Check-in</h1><form className="glass form" onSubmit={save}>
  <fieldset><legend>How are you feeling?</legend><div className="moods" role="radiogroup" aria-label="Mood">{MOODS.map(([e,l])=><button type="button" key={e} role="radio" aria-checked={f.m===e} aria-label={l} title={l} className={'mood'+(f.m===e?' on':'')} onClick={()=>setF({...f,m:e})}>{e}</button>)}</div></fieldset>
  <label>Today’s goal: <b>{f.g}</b> {f.g===1?'activity':'activities'}<input type="range" min="1" max="5" value={f.g} onChange={e=>setF({...f,g:+e.target.value})}/></label>
  <small>Lessons, practice and tests all count as activities.</small><button className="btn">{saved?'Update check-in':'Save check-in'}</button></form>
  {saved&&<div className="card center" style={{margin:'1rem 0'}}><Ring v={pct} label="Goal progress"/><h3>{n}/{c.g} activities today</h3><p>{pct>=100?'Goal reached — amazing work! 🎉':'Keep going, you are getting there.'}</p>{pct<100&&<Link className="btn" to="/app/learn">Start learning</Link>}</div>}
  {moods.length>0&&<><h3>Your last check-ins</h3><div className="row">{moods.map(m=><div key={m.d} className="card center" style={{padding:'.7rem 1rem'}}><span className="emo">{m.m}</span><small>{new Date(m.d).toLocaleDateString('en',{weekday:'short'})}</small></div>)}</div></>}</>}

/* ---------- Certificate ---------- */
export function Certificate(){
 const{p,lessons,user}=useApp();const[pre,setPre]=useState(false);const ok=lessons.length>0&&p.done.length>=lessons.length,name=user?user.name:'Learner';
 if(!ok&&!pre)return <Empty e="🎓" t="Certificate locked" d={`Complete all lessons to earn it (${p.done.length}/${lessons.length}).`}><Bar v={lessons.length?p.done.length/lessons.length*100:0} label="Lessons completed"/><br/><button className="btn ghost" onClick={()=>setPre(true)}>Preview design</button></Empty>;
 return <><div className="row noprint"><h1 style={{margin:0}}>Certificate</h1>{ok?<button className="btn" onClick={()=>window.print()}>🖨️ Print / Save as PDF</button>:<button className="btn ghost" onClick={()=>setPre(false)}>Close preview</button>}</div>
  <div className="cert">{!ok&&<div className="wm" aria-hidden="true">PREVIEW</div>}<b className="logo2">⠃ SignBridge</b><h2>Certificate of Completion</h2><p>This certificate is proudly presented to</p><h1>{name}</h1><div><Braille text={name}/></div>
   <p>for completing the Braille &amp; Sign Language learning path with <b>{p.xp} XP</b> as a <b>{levelOf(p.xp).name}</b>.</p>
   <div className="cert-foot"><span>{new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}<small>Date</small></span><span>SignBridge Team<small>Issued by</small></span></div></div></>}

/* ---------- Story Mode ---------- */
const STORIES=[
{id:'hospital',e:'🏥',t:'At the Hospital',steps:[
 {s:'The receptionist asks: "How can I help you?"',o:['I need to see a doctor.','Where is the school?','I want a book.'],a:0,tip:'Use the sign for "doctor".'},
 {s:'The nurse asks: "Where does it hurt?"',o:['I have pain in my head.','I am lost.','Goodbye, see you tomorrow.'],a:0,tip:'Show "pain" and point to the spot.'},
 {s:'The doctor gives you medicine. What do you say?',o:['Thank you very much.','Call an ambulance.','I want some food.'],a:0,tip:'"Thanks" is a polite closing sign.'}]},
{id:'shop',e:'🛒',t:'At the Shop',steps:[
 {s:'The shopkeeper smiles and waves at you.',o:['Hello, nice to meet you.','I have pain.','Call the doctor.'],a:0,tip:'Start with a friendly greeting.'},
 {s:'You are thirsty. What do you ask for?',o:['I need water, please.','Where is the hospital?','Open the book.'],a:0,tip:'Combine "water" and "please".'},
 {s:'You have paid. How do you finish?',o:['Thank you, goodbye.','I am lost.','Please help me.'],a:0,tip:'Thank them, then say goodbye.'}]},
{id:'school',e:'🏫',t:'First Day at School',steps:[
 {s:'The teacher says: "Welcome! Please sit down."',o:['Thank you.','Call an ambulance.','I want to go home.'],a:0,tip:'A polite reply is best.'},
 {s:'You did not understand the lesson.',o:['Sorry, I did not understand.','Goodbye.','I need my medicine.'],a:0,tip:'Use "sorry" and ask again.'},
 {s:'The teacher asks you to open the book.',o:['Okay, I will open the book.','Where is the station?','I am hungry.'],a:0,tip:'Follow the request calmly.'}]}];
function Play({s,onExit}){
 const{upd,toast}=useApp();const[i,setI]=useState(0),[pick,setPick]=useState(null),[score,setScore]=useState(0),[end,setEnd]=useState(false);
 const st=s.steps[i],opts=useMemo(()=>sh(st.o.map((t,k)=>({t,ok:k===st.a}))),[s,i]);
 const choose=o=>{if(pick)return;setPick(o);if(o.ok)setScore(x=>x+1)};
 const next=()=>{if(i+1<s.steps.length){setI(i+1);setPick(null);return}const xp=score*5;upd(x=>({xp:x.xp+xp,hist:addH(x,'Practice','Story: '+s.t+' ('+score+'/'+s.steps.length+')')}));toast('📖 Story finished +'+xp+' XP');setEnd(true)};
 if(end)return <div className="glass center"><span className="emo">{s.e}</span><h2>Story complete!</h2><p className="big">{score}/{s.steps.length} correct · +{score*5} XP</p><div className="row" style={{justifyContent:'center'}}><button className="btn" onClick={onExit}>More stories</button></div></div>;
 return <div className="glass"><div className="row between"><b>{s.e} {s.t}</b><span className="dots" aria-label={`Step ${i+1} of ${s.steps.length}`}>{s.steps.map((_,k)=><i key={k} className={k<=i?'on':''}/>)}</span></div>
  <div className="speech">{st.s}</div><p>How do you reply?</p>
  {opts.map(o=><button key={o.t} className={'story-opt'+(pick?(o.ok?' ok':pick===o?' no':''):'')} disabled={!!pick} onClick={()=>choose(o)}>{o.t}</button>)}
  {pick&&<div className="notice" role="status">{pick.ok?'✅ Great choice! ':'❌ Not quite. '}{st.tip}</div>}
  {pick&&<button className="btn coral" onClick={next}>{i+1<s.steps.length?'Next →':'Finish'}</button>}</div>}
export function Stories(){
 const[s,setS]=useState(null);
 return <><h1>Story Mode</h1>{s?<Play s={s} onExit={()=>setS(null)}/>:<><p className="lead">Pick a real-life situation and choose the best reply.</p><div className="grid3">{STORIES.map(x=><button key={x.id} className="card xt" onClick={()=>setS(x)}><span className="emo">{x.e}</span><h3>{x.t}</h3><p>{x.steps.length} steps · up to +{x.steps.length*5} XP</p></button>)}</div></>}</>}
