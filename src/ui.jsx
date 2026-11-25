import {useState,useEffect,useRef} from 'react';
import {toBraille} from './data';
export function Cell({d}){const b=d.charCodeAt(0)-0x2800;return <span className="cell" aria-hidden="true">{[0,3,1,4,2,5].map(i=><i key={i} className={(b>>i)&1?'on':''}/>)}</span>}
export function Braille({text,raw}){const s=raw?text:toBraille(text);return <span className="bw" role="img" aria-label={'Braille for '+(raw?'symbol':text)}>{[...s].map((c,i)=>c===' '?<span key={i} className="gap"/>:c==='\n'?<br key={i}/>:<Cell key={i} d={c}/>)}</span>}
export function Ring({v,size=110,label}){const r=size/2-9,c=2*Math.PI*r,[o,setO]=useState(0);useEffect(()=>{const t=setTimeout(()=>setO(v),80);return()=>clearTimeout(t)},[v]);
 return <div className="ring" style={{width:size,height:size}} role="img" aria-label={`${label||'Progress'} ${v}%`}><svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} className="rb"/><circle cx={size/2} cy={size/2} r={r} className="rf" strokeDasharray={c} strokeDashoffset={c-(c*Math.min(o,100))/100} transform={`rotate(-90 ${size/2} ${size/2})`}/></svg><b>{v}%</b></div>}
export function Bar({v,label}){const[o,setO]=useState(0);useEffect(()=>{const t=setTimeout(()=>setO(v),80);return()=>clearTimeout(t)},[v]);return <div className="bar" role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin="0" aria-valuemax="100" aria-label={label||'progress'}><span style={{width:o+'%'}}/></div>}
export function Counter({to}){const[n,setN]=useState(0);useEffect(()=>{let f,s;const step=t=>{s=s||t;const k=Math.min((t-s)/1200,1);setN(Math.round(to*k));if(k<1)f=requestAnimationFrame(step)};f=requestAnimationFrame(step);return()=>cancelAnimationFrame(f)},[to]);return <>{n.toLocaleString()}</>}
export function Reveal({children,className=''}){const r=useRef();const[on,setOn]=useState(false);useEffect(()=>{const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setOn(true);io.disconnect()}},{threshold:.15});io.observe(r.current);return()=>io.disconnect()},[]);return <div ref={r} className={'reveal '+(on?'in ':'')+className}>{children}</div>}
export function Modal({title,onClose,children}){useEffect(()=>{const k=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[onClose]);
 return <div className="overlay" onClick={onClose}><div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={e=>e.stopPropagation()}><button className="x" aria-label="Close" onClick={onClose}>✕</button><h2>{title}</h2>{children}</div></div>}
export const Empty=({e='🫧',t,d,children})=><div className="state"><div className="emo">{e}</div><h3>{t}</h3><p>{d}</p>{children}</div>;
export const Loading=()=><div className="state" role="status"><div className="spin"/><p>Loading…</p></div>;
export const ErrorState=({msg,retry})=><div className="state" role="alert"><div className="emo">⚠️</div><h3>Something went wrong</h3><p>{msg}</p><button className="btn" onClick={retry}>Retry</button></div>;
export function useFetch(url){const[s,set]=useState({st:'loading'});const[n,setN]=useState(0);
 useEffect(()=>{let ok=true;set({st:'loading'});fetch(url).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(d=>ok&&set({st:'ok',d})).catch(e=>ok&&set({st:'err',e:e.message}));return()=>{ok=false}},[url,n]);return[s,()=>setN(x=>x+1)]}
export const Stat=({e,n,l})=><div className="stat"><span>{e}</span><b>{n}</b><small>{l}</small></div>;
export const Diff=({d})=><span className={'pill '+d}>{d}</span>;
export function SignArt({word,size=90}){let h=0;for(const c of String(word))h=(h*31+c.charCodeAt(0))>>>0;
 const up=[0,1,2,3,4].map(i=>((h>>i)&1)===1||i===(h>>5)%5),rot=((h>>7)%40)-20,col=['#aa7f66','#ec9c9d','#7f5836'][h%3];
 return <svg className="sign" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={'Sign illustration for '+word} style={{'--sg':col}}><g transform={`rotate(${rot} 50 62)`}><rect x="26" y="52" width="44" height="36" rx="16"/>{up.map((u,i)=><rect key={i} x={28+i*10} y={u?14+Math.abs(i-2)*7:42} width="8" height={u?42:14} rx="4"/>)}<rect x="16" y="54" width="9" height="24" rx="4" transform="rotate(-35 20 60)"/></g></svg>}
export function useDebounce(v,ms=350){const[d,setD]=useState(v);useEffect(()=>{const t=setTimeout(()=>setD(v),ms);return()=>clearTimeout(t)},[v,ms]);return d}
function Def({word}){const[s,retry]=useFetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+word);
 if(s.st==='loading')return <Loading/>;if(s.st==='err')return <ErrorState msg={'Could not reach the online dictionary ('+s.e+').'} retry={retry}/>;
 const m=s.d?.[0]?.meanings?.[0];return <p><b>{m?.partOfSpeech}:</b> {m?.definitions?.[0]?.definition||'No definition found.'}</p>}
export function OnlineDef({word}){const[go,setGo]=useState(false);return go?<Def word={word}/>:<button className="btn ghost" onClick={()=>setGo(true)}>🌐 Online definition (free API)</button>}
