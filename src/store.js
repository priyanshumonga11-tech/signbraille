// Redux Toolkit store: popups slice + leaderboard slice
import {configureStore,createSlice,nanoid} from '@reduxjs/toolkit';
const popups=createSlice({name:'popups',initialState:{list:[]},reducers:{
 push:{reducer(s,a){if(!s.list.some(x=>x.kind===a.payload.kind))s.list.push(a.payload)},prepare:p=>({payload:{id:nanoid(),...p}})},
 dismiss(s,a){s.list=s.list.filter(x=>x.id!==a.payload)}}});
const DEMO=[{n:'Priya',w:180,a:920,s:12},{n:'Arjun',w:150,a:760,s:9},{n:'Meera',w:120,a:640,s:7},{n:'Kabir',w:90,a:410,s:5},{n:'Isha',w:60,a:280,s:4},{n:'Rohan',w:30,a:150,s:2}];
const board=createSlice({name:'board',initialState:{rows:DEMO,range:'weekly',sort:'xp'},reducers:{
 setRange(s,a){s.range=a.payload},setSort(s,a){s.sort=a.payload}}});
export const {push,dismiss}=popups.actions;
export const {setRange,setSort}=board.actions;
export const store=configureStore({reducer:{popups:popups.reducer,board:board.reducer}});
