// All demo data lives here (plain JS objects). Replace emoji with an `img` URL later.
export const B={a:'1',b:'12',c:'14',d:'145',e:'15',f:'124',g:'1245',h:'125',i:'24',j:'245',k:'13',l:'123',m:'134',n:'1345',o:'135',p:'1234',q:'12345',r:'1235',s:'234',t:'2345',u:'136',v:'1236',w:'2456',x:'1346',y:'13456',z:'1356','.':'256',',':'2','?':'236','!':'235',';':'23',':':'25',"'":'3','-':'36'};
export const cell=d=>String.fromCharCode(0x2800+[...d].reduce((s,x)=>s+(1<<(x-1)),0));
const NUM=cell('3456'),R={};Object.keys(B).forEach(k=>R[cell(B[k])]=k);
export const toBraille=t=>{let o='',num=false;for(const ch of t.toLowerCase()){if(ch===' '){o+=' ';num=false}else if(/\d/.test(ch)){if(!num){o+=NUM;num=true}o+=cell(B['abcdefghij'['1234567890'.indexOf(ch)]])}else{num=false;o+=B[ch]?cell(B[ch]):cell('123456')}}return o};
export const fromBraille=s=>{let o='',num=false;for(const c of s){if(c===' '||c==='\n'){o+=c;num=false}else if(c===NUM)num=true;else if(R[c]){const k=R[c];if(num&&/[a-j]/.test(k))o+='1234567890'['abcdefghij'.indexOf(k)];else{num=false;o+=k}}else throw new Error('Unknown Braille symbol "'+c+'". Use Unicode Braille characters (⠁⠃⠉…).')}return o};
export const today=()=>new Date().toISOString().slice(0,10);
export const sh=a=>[...a].sort(()=>Math.random()-.5);
export const LEVELS=[[0,'Beginner'],[100,'Learner'],[300,'Communicator'],[600,'Accessibility Champion']];
export const levelOf=xp=>{let i=0;LEVELS.forEach((l,k)=>{if(xp>=l[0])i=k});const nx=LEVELS[i+1];return{name:LEVELS[i][1],i,pct:nx?Math.round((xp-LEVELS[i][0])/(nx[0]-LEVELS[i][0])*100):100}};
export const SIGNS=[
['hello','Greetings','Easy','👋','A friendly greeting.','Hello, nice to meet you.',['goodbye','thanks']],
['goodbye','Greetings','Easy','🤚','Said when leaving.','Goodbye, see you tomorrow.',['hello']],
['thanks','Greetings','Easy','🙏','Expressing gratitude.','Thank you for your help.',['please','sorry']],
['please','Greetings','Easy','🤲','A polite request.','Please write it down.',['thanks']],
['sorry','Greetings','Medium','🙇','An apology.','Sorry, I did not understand.',['please']],
['help','Emergency','Easy','🆘','Asking for urgent assistance.','Please help me.',['ambulance','doctor']],
['ambulance','Emergency','Medium','🚑','Vehicle for medical emergencies.','Call an ambulance now.',['help','hospital']],
['lost','Emergency','Medium','🧭','Not knowing where you are.','I am lost, please guide me.',['help','train']],
['hospital','Hospital','Medium','🏥','A place for medical care.','Where is the hospital?',['doctor','pain']],
['doctor','Hospital','Easy','🩺','A medical professional.','I need to see a doctor.',['hospital','medicine']],
['pain','Hospital','Medium','🤕','Physical discomfort.','I have pain in my head.',['doctor','medicine']],
['medicine','Hospital','Hard','💊','Something taken to treat illness.','I need my medicine.',['doctor','pain']],
['water','Food','Easy','💧','Drinking water.','I need water, please.',['food']],
['food','Food','Easy','🍽️','Something to eat.','I would like some food.',['water']],
['family','Family','Easy','👨‍👩‍👧','Parents and children.','Please contact my family.',['mother','home']],
['mother','Family','Easy','👩','A female parent.','My mother is coming.',['family']],
['home','Family','Easy','🏠','Where you live.','I want to go home.',['family']],
['school','Education','Easy','🏫','A place of learning.','I go to school every day.',['book']],
['book','Education','Easy','📖','Pages to read.','Please open the book.',['school']],
['train','Travel','Medium','🚆','Railway transport.','Which platform is the train?',['ticket','lost']],
['ticket','Travel','Medium','🎫','Permission to travel.','I need a ticket.',['train']],
['shop','Shopping','Easy','🛍️','A place to buy things.','Where is the shop?',['money']],
['work','Workplace','Hard','💼','Your job.','I go to work by bus.',['school']]
].map(([word,cat,diff,emoji,meaning,ex,rel])=>({id:word,word,cat,diff,emoji,meaning,ex,rel}));
export const LESSONS=[
['b1','braille','Alphabet A–J','Braille Alphabet','Easy','abcdefghij','The first ten letters use dots 1,2,4,5 only.','Each letter is a 6-dot cell. Letter a is dot 1; b is dots 1-2.','a = ⠁ , b = ⠃'],
['b2','braille','Alphabet K–T','Braille Alphabet','Easy','klmnopqrst','Add dot 3 to letters a–j to get k–t.','k is a plus dot 3. The pattern repeats across the alphabet.','k = ⠅ , l = ⠇'],
['b3','braille','Numbers','Braille Numbers','Medium','1234567890','Numbers use a number sign followed by letters a–j.','The number sign (dots 3456) tells the reader the next cells are digits.','12 = ⠼⠁⠃'],
['b4','braille','Punctuation','Braille Punctuation','Medium','.,?!','Punctuation marks use the lower dots.','Full stop is dots 2-5-6; question mark is dots 2-3-6.','Help! = ⠓⠑⠇⠏⠖'],
['b5','braille','Common Words','Braille Words','Medium','water help','Everyday words spelled letter by letter.','Learn short, useful words first to build reading speed.','water = ⠺⠁⠞⠑⠗'],
['b6','braille','Sentences','Braille Sentences','Hard','i need help','Words are separated by an empty cell.','Read left to right, cell by cell, then word by word.','i need help'],
['s1','sign','Alphabet','Sign Alphabet','Easy','a b c','Fingerspell names and unfamiliar words.','Each letter has its own handshape.','Spell your name'],
['s2','sign','Greetings','Signs: Greetings','Easy','hello thanks','Start every conversation with a greeting.','Use a friendly face and eye contact.','Hello, thank you'],
['s3','sign','Family','Signs: Family','Easy','family mother','Signs for people close to you.','Family signs often show the person’s role.','Mother, family'],
['s4','sign','Emergency','Signs: Emergency','Medium','help ambulance','Key signs for urgent situations.','Practice these until they are automatic.','Help, ambulance'],
['s5','sign','Hospital','Signs: Hospital','Medium','hospital doctor','Communicate with doctors and nurses.','Combine the sign for pain with the body part.','Doctor, pain'],
['s6','sign','Food & Water','Signs: Food','Easy','food water','Order food or ask for water.','Point and sign to be clear.','Water, food']
].map(([id,track,title,topic,diff,sample,meaning,explain,ex])=>({id,track,title,topic,diff,sample,meaning,explain,ex}));
export const EMERGENCY=[['I NEED HELP','help','Use when you are in danger or need urgent attention.'],['MEDICAL EMERGENCY','doctor','Tell people you need medical care right now.'],['CALL AN AMBULANCE','ambulance','Ask someone nearby to phone for an ambulance.'],['I NEED WATER','water','Ask for drinking water.'],['I AM LOST','lost','Ask for directions or a guide.'],['PLEASE CONTACT MY FAMILY','family','Ask someone to contact your family.'],['I CANNOT HEAR','ear','Let people know to write or face you.'],['I CANNOT SPEAK','mouth','Let people know you communicate by sign or writing.']];
export const PHRASES=['Hello, how are you?','Thank you very much','Please help me','Where is the hospital?','I need water','I cannot hear you','Please write it down','Nice to meet you'];
export const SCENARIOS=[
['hospital','Hospital','🏥','You need to tell a doctor that you have pain.','I have pain here.',['I want to buy a ticket.','Where is the train?'],'pain'],
['school','School','🏫','You did not understand the teacher.','Please explain again.',['I need a ticket.','Where is the ambulance?'],'school'],
['restaurant','Restaurant','🍽️','You want to ask for water.','Water, please.',['I am lost.','I need a doctor.'],'water'],
['station','Railway Station','🚆','You need to find your train.','Which platform is the train?',['I want some food.','Call my mother.'],'train'],
['shopping','Shopping','🛍️','You want to buy an item.','How much does this cost?',['I have pain.','Open the book.'],'shop'],
['emergency','Emergency','🚑','You see someone hurt and need an ambulance.','Please call an ambulance!',['Hello, nice weather.','I want a ticket.'],'ambulance'],
['workplace','Workplace','','You want to ask your manager for help.','Could you please help me?',['I need a ticket.','Where is the train?'],'work'],
['travel','Travel','','You need to ask where the station is.','Where is the station?',['I have pain.','I want some water.'],'train'],
['family','Family','','You want to reach your mother.','Please contact my mother.',['Where is the shop?','Open the book.'],'mother'],
['daily','Daily Life','','You want to thank someone.','Thank you very much.',['I am lost.','Call an ambulance.'],'thanks']
].map(([id,name,e,sit,ok,bad,sign])=>({id,name,e,sit,ok,bad,sign}));
const TF=[['Braille is read by touch.',1],['Braille cells have 6 dots.',1],['Sign language is the same in every country.',0],['You should grab a blind person’s cane to help them.',0],['Captions help deaf and hard-of-hearing people.',1],['This website contacts emergency services directly.',0]];
const PHR=[['I need ___, please.','water',['water','ticket','book','train']],['Where is the ___?','hospital',['hospital','water','mother','pain']],['Please call an ___.','ambulance',['ambulance','school','food','shop']],['I have ___ in my head.','pain',['pain','ticket','train','home']],['Thank you very ___.','much',['much','red','fast','left']]];
export function gen(mode,n=10,signs=SIGNS){
 const L='abcdefghij'.split(''),out=[];
 const mk=(right,pool)=>{const o=sh([right,...sh(pool.filter(x=>x!==right)).slice(0,3)]);return{opts:o,a:o.indexOf(right)}};
 for(let i=0;i<n;i++){
  const PL={mix:['b2t','t2b','s2m','m2s','tf','num','sc','phr'],braille:['b2t','t2b','num'],sign:['s2m','m2s'],scenario:['sc'],phrase:['phr']}[mode],m=PL?PL[i%PL.length]:mode,l=L[Math.floor(Math.random()*10)],s=sh(signs)[0],sc=sh(SCENARIOS)[0];
  if(m==='b2t')out.push({q:'Which letter is this Braille cell?',br:cell(B[l]),topic:'Braille Alphabet',hint:'Only dots 1, 2, 4 and 5 are used for a–j.',...mk(l,L)});
  else if(m==='t2b')out.push({q:`Which cell is the letter "${l}"?`,ob:1,topic:'Braille Alphabet',hint:'Start with a = dot 1.',...mk(cell(B[l]),L.map(x=>cell(B[x])))});
  else if(m==='num'){const d=(Math.floor(Math.random()*9)+1)+'';out.push({q:'Which number is this?',br:NUM+cell(B['abcdefghij'[d-1]]),topic:'Braille Numbers',hint:'The first cell is the number sign.',...mk(d,'123456789'.split(''))})}
  else if(m==='s2m')out.push({q:'What does this sign mean?',sg:s.word,topic:'Signs: '+s.cat,hint:'Category: '+s.cat,...mk(s.word,signs.map(x=>x.word))});
  else if(m==='m2s')out.push({q:`Which sign means "${s.word}"?`,oe:1,topic:'Signs: '+s.cat,hint:s.meaning,...mk(s.word,signs.map(x=>x.word))});
  else if(m==='phr'){const t=sh(PHR)[0];out.push({q:'Complete: '+t[0],topic:'Phrases',hint:'Think about the situation.',...mk(t[1],t[2])})}
  else if(m==='sc')out.push({q:sc.sit,topic:'Scenarios',hint:'Pick the most useful phrase.',...mk(sc.ok,[sc.ok,...sc.bad])});
  else{const t=TF[i%TF.length];out.push({q:'True or False: '+t[0],topic:'Awareness',hint:'Think about accessibility etiquette.',opts:['True','False'],a:t[1]?0:1})}
 }
 return out}
export const topicStats=tests=>{const t={};tests.forEach(r=>r.items.forEach(([tp,ok])=>{t[tp]=t[tp]||{c:0,n:0};t[tp].n++;if(ok)t[tp].c++}));return Object.entries(t).map(([topic,{c,n}])=>({topic,c,n,pct:Math.round(c/n*100)})).sort((a,b)=>a.pct-b.pct)};
export const BADGES=[
{id:'first',n:'First Lesson',e:'🌱',ok:p=>p.done.length>=1},
{id:'streak',n:'7 Day Streak',e:'🔥',ok:p=>p.streak>=7},
{id:'bb',n:'Braille Beginner',e:'⠃',ok:p=>p.done.filter(x=>x[0]==='b').length>=3},
{id:'se',n:'Sign Explorer',e:'🤟',ok:p=>p.done.filter(x=>x[0]==='s').length>=3},
{id:'perf',n:'Perfect Score',e:'💯',ok:p=>p.tests.some(t=>t.score===t.total)},
{id:'ten',n:'10 Lessons Completed',e:'📚',ok:p=>p.done.length>=10},
{id:'cc',n:'Communication Champion',e:'🏆',ok:p=>p.xp>=600}];
