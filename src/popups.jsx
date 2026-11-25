import {useEffect,useRef} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import {useApp,useLS} from './ctx.jsx';
import {push,dismiss} from './store.js';
import {today,levelOf} from './data';
const QUOTES=['Small steps every day build big skills. 🌱','Every sign you learn opens a new conversation. 🤟','Every Braille dot you learn is a bridge to someone. ⠃','Progress, not perfection. Keep going! 💪','Mistakes are proof that you are learning. ✨','Your effort today makes communication easier for someone tomorrow. 💜','Consistency beats intensity. Even 10 minutes counts! 🔥','You are closer to your goal than yesterday. 🎯','Learning to communicate is learning to include. 🌍','Be proud of every lesson you finish today. 🏅','Great things start with one practice session. 🚀','Patience and practice make every sign easier. 🤲'];
const HOUR=3600000,COL=['#ec9c9d','#aa7f66','#f6dcd8','#7f5836','#e8a33d'];

/* Scheduler: runs on the Home page and pushes pop-ups into the Redux store */
export default function Popups(){
 const{p,settings,user,lessons,signs}=useApp();const d=useDispatch();
 const[q,setQ]=useLS('sb_quote',{t:0,i:-1});const lastI=useRef(q.i);
 const[wb,setWb]=useLS('sb_wb','');const[sod,setSod]=useLS('sb_sod','');
 const done=p.tests.some(t=>t.date===today()),on=settings.popups!==false;
 // 1. daily test reminder (never after today's test is done)
 useEffect(()=>{if(!on||done)return;
  const a=setTimeout(()=>d(push({kind:'test',icon:'📝',title:'Daily test time!',text:`10 questions · 15 minutes. Keep your 🔥 ${p.streak}-day streak going.`,to:'/app/test/instructions',cta:'Take test'})),2000);
  return()=>clearTimeout(a)},[on,done]);
 // 2. welcome back (once a day, only if the learner has started lessons)
 useEffect(()=>{if(!on||!user||wb===today())return;
  const next=lessons.find(l=>!p.done.includes(l.id));if(!p.done.length||!next)return;
  const last=lessons.find(l=>l.id===p.done[p.done.length-1]);
  const a=setTimeout(()=>{setWb(today());d(push({kind:'welcome',icon:'👋',title:'Welcome back!',text:`You left at "${last?last.title:'your last lesson'}". Continue with "${next.title}"?`,to:'/app/learn/'+next.id,cta:'Continue'}))},4500);
  return()=>clearTimeout(a)},[on,user]);
 // 3. sign of the day (once a day)
 useEffect(()=>{if(!on||sod===today()||!signs.length)return;
  const s=signs[Math.floor(Date.now()/864e5)%signs.length];
  const a=setTimeout(()=>{setSod(today());d(push({kind:'sign',icon:s.emoji,title:'Sign of the day',text:`${s.word} — ${s.meaning}`,to:'/app/flashcards',cta:'Practice it'}))},9000);
  return()=>clearTimeout(a)},[on]);
 // 4. motivation every hour, a different thought each time (time saved in localStorage)
 useEffect(()=>{if(!on)return;let a;
  const show=()=>{let i;do{i=Math.floor(Math.random()*QUOTES.length)}while(i===lastI.current);lastI.current=i;setQ({t:Date.now(),i});d(push({kind:'quote',icon:'💜',title:'Keep going!',text:QUOTES[i]}));a=setTimeout(show,HOUR)};
  a=setTimeout(show,Math.max(15000,q.t+HOUR-Date.now()));
  return()=>clearTimeout(a)},[on]);
 return null}

/* Milestones: streak celebration + level-up (work on any page) */
function Milestones(){
 const{p,settings}=useApp();const d=useDispatch();const[seen,setSeen]=useLS('sb_seen',{streak:0,level:-1});
 const lv=levelOf(p.xp),on=settings.popups!==false;
 useEffect(()=>{if(!on||![3,7,30].includes(p.streak)||seen.streak===p.streak)return;
  setSeen(s=>({...s,streak:p.streak}));
  d(push({kind:'celebrate',icon:'🔥',title:p.streak+'-day streak!',text:{3:'Three days in a row — a habit is forming!',7:'A full week! Your 7 Day Streak badge is unlocked.',30:'A whole month of learning. Incredible dedication!'}[p.streak]}))},[p.streak]);
 useEffect(()=>{if(seen.level<0){setSeen(s=>({...s,level:lv.i}));return}
  if(lv.i>seen.level){setSeen(s=>({...s,level:lv.i}));if(on)d(push({kind:'levelup',icon:'🎖️',title:'Level up!',text:`You are now a ${lv.name} with ${p.xp} XP. Keep climbing!`}))}},[lv.i]);
 return null}

/* Host: renders whatever is in the Redux popup queue */
export function PopupHost(){
 const list=useSelector(s=>s.popups.list),d=useDispatch(),nav=useNavigate(),loc=useLocation(),{p}=useApp();
 const hide=loc.pathname.startsWith('/app/test'),done=p.tests.some(t=>t.date===today());
 const left=hide?[]:list.filter(i=>['test','welcome','sign'].includes(i.kind)&&!(i.kind==='test'&&done));
 const quote=hide?null:list.find(i=>i.kind==='quote'),modal=list.find(i=>i.kind==='celebrate'||i.kind==='levelup');
 const x=id=>d(dismiss(id));
 useEffect(()=>{if(!quote)return;const t=setTimeout(()=>x(quote.id),15000);return()=>clearTimeout(t)},[quote&&quote.id]);
 useEffect(()=>{if(!modal)return;const k=e=>e.key==='Escape'&&x(modal.id);window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[modal&&modal.id]);
 return <><Milestones/>
  {left.length>0&&<div className="pc-stack">{left.map(it=><aside key={it.id} className={'pc pc-s pc-'+it.kind} role="dialog" aria-label={it.title}>
   <button className="pc-x" aria-label="Close" onClick={()=>x(it.id)}>✕</button><span className="pc-ic">{it.icon}</span>
   <div><h3>{it.title}</h3><p>{it.text}</p><div className="pc-row"><button className="btn coral" onClick={()=>{x(it.id);nav(it.to)}}>{it.cta}</button><button className="btn ghost" onClick={()=>x(it.id)}>Later</button></div></div></aside>)}</div>}
  {quote&&<aside className="pc pc-quote" role="status" aria-live="polite"><button className="pc-x" aria-label="Close" onClick={()=>x(quote.id)}>✕</button><span className="pc-ic">{quote.icon}</span><div><h3>{quote.title}</h3><p>{quote.text}</p></div><i className="pc-bar"/></aside>}
  {modal&&<div className="overlay" onClick={()=>x(modal.id)}><div className="pc-big" role="dialog" aria-modal="true" aria-label={modal.title} onClick={e=>e.stopPropagation()}>
   <div className="cf" aria-hidden="true">{Array.from({length:28},(_,k)=><i key={k} style={{left:(k*3.7+2)%100+'%',background:COL[k%5],animationDelay:(k%7)*.35+'s',animationDuration:2.6+(k%4)*.5+'s'}}/>)}</div>
   <span className="big-ic">{modal.icon}</span><h2>{modal.title}</h2><p>{modal.text}</p><button className="btn coral big" autoFocus onClick={()=>x(modal.id)}>Awesome!</button></div></div>}
 </>}
