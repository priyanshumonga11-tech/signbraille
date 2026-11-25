import {createContext,useContext,useState,useEffect,useCallback} from 'react';
import {LESSONS,SIGNS,BADGES,today} from './data';
const Ctx=createContext();export const useApp=()=>useContext(Ctx);
export function useLS(k,d){const[v,s]=useState(()=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}});useEffect(()=>{localStorage.setItem(k,JSON.stringify(v))},[k,v]);return[v,s]}
export function Provider({children}){
 const[user,setUser]=useLS('sb_user',null);
 const[settings,setSettings]=useLS('sb_settings',{theme:'light',font:16,contrast:false,motion:false,large:false,sound:true});
 const[p,setP]=useLS('sb_progress',{xp:0,done:[],favs:[],hist:[],tests:[],badges:[],streak:1,last:today(),plan:null});
 const[lessons,setLessons]=useLS('sb_lessons',LESSONS);
 const[signs,setSigns]=useLS('sb_signs',SIGNS);
 const[toasts,setToasts]=useState([]);const[notifs,setNotifs]=useLS('sb_notifs',[]);
 const toast=useCallback(msg=>{const id=Date.now()+Math.random();setToasts(t=>[...t,{id,msg}]);setNotifs(n=>[{m:msg,t:Date.now()},...n].slice(0,60));setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200)},[]);
 useEffect(()=>{const d=document.documentElement;d.dataset.theme=settings.theme;d.dataset.contrast=settings.contrast;d.dataset.motion=settings.motion;d.dataset.large=settings.large;d.style.fontSize=settings.font+'px'},[settings]);
 useEffect(()=>{const t=today();if(p.last!==t){const y=new Date(Date.now()-864e5).toISOString().slice(0,10);setP(x=>({...x,streak:x.last===y?x.streak+1:1,last:t}))}},[]);
 useEffect(()=>{const got=BADGES.filter(b=>b.ok(p)).map(b=>b.id),nw=got.filter(id=>!(p.badges||[]).includes(id));if(nw.length){setP(x=>({...x,badges:got}));nw.forEach(id=>toast('🏅 Achievement unlocked: '+BADGES.find(b=>b.id===id).n))}},[p.done,p.xp,p.tests,p.streak]);
 const upd=f=>setP(x=>({...x,...f(x)}));
 const log=(type,text)=>({hist:x=>[{type,text,t:Date.now()},...x.hist].slice(0,60)});
 const addHist=(x,type,text)=>[{type,text,t:Date.now()},...x.hist].slice(0,60);
 const complete=l=>{if(p.done.includes(l.id))return;upd(x=>({done:[...x.done,l.id],xp:x.xp+20,hist:addHist(x,'Lesson','Completed '+l.title)}));toast('✅ Lesson completed +20 XP')};
 const toggleFav=(k,label)=>{const has=p.favs.some(f=>f.k===k);upd(x=>({favs:has?x.favs.filter(f=>f.k!==k):[...x.favs,{k,label}]}));toast(has?'Removed from favorites':'⭐ Favorite added')};
 const isFav=k=>p.favs.some(f=>f.k===k);
 const recordTest=r=>{upd(x=>({tests:[...x.tests,r],xp:x.xp+r.score*5+10,hist:addHist(x,'Test',`Daily test ${r.score}/${r.total}`)}));toast('📝 Test completed +'+(r.score*5+10)+' XP')};
 const practiceDone=(c,n,mode)=>{upd(x=>({xp:x.xp+c*2,hist:addHist(x,'Practice',`${mode}: ${c}/${n}`)}));toast('Practice done +'+c*2+' XP')};
 const addHistory=(type,text)=>upd(x=>({hist:addHist(x,type,text)}));
 const speak=t=>{if(!settings.sound)return toast('Sound is turned off in Settings');if(!('speechSynthesis' in window))return toast('Text-to-speech is not supported in this browser');speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(t))};
 const logout=()=>setUser(null);
 return <Ctx.Provider value={{notifs,user,setUser,logout,settings,setSettings,p,setP,upd,lessons,setLessons,signs,setSigns,toast,complete,toggleFav,isFav,recordTest,practiceDone,addHistory,speak}}>
  {children}
  <div className="toasts" role="status" aria-live="polite">{toasts.map(t=><div key={t.id} className="toast">{t.msg}</div>)}</div>
 </Ctx.Provider>}
