const CFG=window.SITE_CONFIG||{};
document.addEventListener('DOMContentLoaded',()=>{
 const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 /* drive modes */
 const MODES=['comfort','sport','track'],modeNow=()=>MODES.includes(root.dataset.mode)?root.dataset.mode:'sport';
 const dock=document.createElement('div');dock.className='dock';
  dock.innerHTML=`<div class="modes" role="group" aria-label="Drive mode">${MODES.map(m=>`<button data-mode="${m}" aria-pressed="false">${m}</button>`).join('')}</div><button id="dkMas" aria-pressed="true">Mascot</button><button class="ask" id="dkChat" aria-label="Ask BMWorld">Ask<span class="ask-x"> BMWorld</span></button>`;
 const wipe=document.createElement('div');wipe.className='mwipe';wipe.setAttribute('aria-hidden','true');
 document.body.append(dock,wipe);
 wipe.addEventListener('animationend',()=>wipe.classList.remove('go'));
 const setMode=(m,animate)=>{if(!MODES.includes(m))m='sport';const changed=root.dataset.mode!==m;
  if(animate&&changed&&!reduce){wipe.dataset.m=m;wipe.classList.remove('go');void wipe.offsetWidth;wipe.classList.add('go')}
  root.dataset.mode=m;try{localStorage.setItem('bmw-mode',m)}catch(e){}
  $$('.dock [data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m));
  if(changed)document.dispatchEvent(new CustomEvent('bmw:mode',{detail:m}))};
 setMode(modeNow(),false);
 dock.querySelector('.modes').onclick=e=>{const b=e.target.closest('[data-mode]');if(b)setMode(b.dataset.mode,true)};
 addEventListener('storage',e=>{if(e.key==='bmw-mode'&&MODES.includes(e.newValue))setMode(e.newValue,false)});   /* another tab changed it */

 /* scroll progress (sport, track) and telemetry HUD (track) */
 const prog=document.createElement('div');prog.className='prog';prog.setAttribute('aria-hidden','true');
 const hud=document.createElement('div');hud.className='hud';hud.setAttribute('aria-hidden','true');
 hud.innerHTML='<span class="rev">'+'<i></i>'.repeat(10)+'</span><span>SPD <b id="hSpd">0</b></span><span>LAP <b id="hLap">0</b>%</span><span>G <b id="hG">N</b></span>';
 document.body.append(prog,hud);
 {const revs=$$('.rev i',hud),hS=$('#hSpd',hud),hL=$('#hLap',hud),hG=$('#hG',hud);let ly=scrollY,lt=performance.now(),sv=0,raf=0;
  const frame=now=>{raf=0;const dt=Math.max(.001,(now-lt)/1000),dy=Math.abs(scrollY-ly);ly=scrollY;lt=now;sv+=(dy/dt-sv)*Math.min(1,dt*6);
   const max=root.scrollHeight-innerHeight,p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;prog.style.transform=`scaleX(${p.toFixed(4)})`;
   if(modeNow()==='track'){const kmh=Math.min(299,Math.round(sv/14)),lit=Math.round(kmh/30);hS.textContent=kmh;hL.textContent=Math.round(p*100);hG.textContent=kmh<2?'N':Math.min(8,1+Math.floor(kmh/38));
    revs.forEach((r,i)=>{r.className=i<lit?'on'+(i>7?' r':i>4?' y':''):''})}
   if(sv>1||dy>0)raf=requestAnimationFrame(frame)};
  const kick=()=>{if(!raf){lt=performance.now();raf=requestAnimationFrame(frame)}};
  addEventListener('scroll',kick,{passive:true});addEventListener('resize',kick);document.addEventListener('bmw:mode',kick);kick()}

 /* scroll reveal (slow rise / sharp slide / quick snap) */
 if(!reduce&&'IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;io.unobserve(t);t.classList.add('rv-in');setTimeout(()=>t.classList.remove('rv','rv-in'),1400)}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $$('.page-top h1,.page-top .lead,.sec h2,.sec .lead,.sec .frame,#featured .card-m,.portal,.about>div,.specs,.tl,.q').forEach(t=>{t.classList.add('rv');io.observe(t)})}

 /* gentle 3D card tilt */
 if(!reduce&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  const TILT={comfort:3,sport:6,track:8};let cur=null,raf=0,ev=null;
  const reset=()=>{if(cur){cur.style.transform='';cur=null}};
  const apply=()=>{raf=0;if(!ev)return;const c=ev.target.closest&&ev.target.closest('.card-m');if(c!==cur){reset();cur=c}if(!c)return;
   const r=c.getBoundingClientRect(),px=(ev.clientX-r.left)/r.width-.5,py=(ev.clientY-r.top)/r.height-.5,a=TILT[modeNow()]||5;
   c.style.transform=`perspective(900px) rotateX(${(-py*a).toFixed(2)}deg) rotateY(${(px*a).toFixed(2)}deg) translateY(-3px)`};
  document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;ev=e;if(!raf)raf=requestAnimationFrame(apply)},{passive:true});
  root.addEventListener('mouseleave',reset);addEventListener('scroll',reset,{passive:true})}

 /* mascot car */
 const dkMas=$('#dkMas');
 if(reduce)dkMas.remove();else mascot();
 function mascot(){
  const SVG='<svg viewBox="0 0 160 60" aria-hidden="true"><path class="cb" d="M6 40 L10 30 Q18 26 40 24 L62 10 Q70 7 88 7 L112 9 Q124 12 134 26 L150 30 Q156 34 155 42 L150 46 H6Z"/><path class="cg" d="M66 13 L88 11 L108 12 Q116 14 122 24 H60Z"/><rect class="c1" x="6" y="40" width="148" height="1.4"/><rect class="c2" x="6" y="41.3" width="148" height="1.4"/><rect class="c3" x="6" y="42.6" width="148" height="1.4"/><path class="trk wing" d="M3 24H21V27H3ZM10 27H14V33H10Z"/><circle class="trk" cx="97" cy="31" r="6.5" fill="#fff"/><text class="trk" x="97" y="33.6" text-anchor="middle" font-family="Outfit,sans-serif" font-size="7.5" font-weight="700" fill="#111">M</text><circle cx="38" cy="46" r="10" fill="#08080A" stroke="#8E929E" stroke-width="3"/><circle cx="124" cy="46" r="10" fill="#08080A" stroke="#8E929E" stroke-width="3"/><rect x="146" y="32" width="8" height="4" fill="#fff"/></svg>';
  const el=document.createElement('div');el.className='mascot';el.setAttribute('aria-hidden','true');
  el.innerHTML='<div class="car"><i class="trl"></i><div class="bd"></div><i class="sh"></i></div>';document.body.append(el);
  const car=$('.car',el),bd=$('.bd',el),tl=$('.trl',el);
  bd.innerHTML=CFG.MASCOT_SRC?`<img src="${esc(CFG.MASCOT_SRC)}" alt="" onerror="this.outerHTML=''">`:SVG;

  const MC={comfort:{t:1.3,lean:5,rate:20,life:[1.3,2],a:.5,trail:0},sport:{t:1,lean:9,rate:34,life:[.9,1.5],a:.62,trail:.8},track:{t:.8,lean:13,rate:50,life:[1,1.7],a:.78,trail:1}};
  const TR=96,WAIT=10000,cl=(a,lo,hi)=>Math.min(hi,Math.max(lo,a)),ss=k=>k*k*(3-2*k);
  const bez=(x1,y1,x2,y2)=>{const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by,X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,D=t=>(3*ax*t+2*bx)*t+cx;
   return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const d=X(t)-x,s=D(t);if(Math.abs(d)<1e-4||Math.abs(s)<1e-6)break;t-=d/s}return Y(cl(t,0,1))}};
  const E1=bez(.32,0,.18,1);   /* slow start, strong middle, long gentle stop */
  const VW=()=>root.clientWidth||innerWidth,W=()=>car.offsetWidth||110,parkX=vw=>Math.round(cl(vw*.04,10,64));
  /* smoke */
  const pool=Array.from({length:40},()=>{const e=document.createElement('i');e.className='puff';document.body.append(e);return{e,on:false,x:0,y:0,vx:0,vy:0,age:0,life:1,s:.5}});
  let live=0,acc=0,cfg=MC.sport,T12=3,Td=2,SET=.7;
  let phase='off',pt=0,x=0,yaw=180,lean=0,raf=0,last=0,wake=0,trailCls='';
  const setPhase=p=>{phase=p;pt=0;el.dataset.phase=p};
  const emit=(dt,f)=>{acc+=dt*cfg.rate*(f==null?1:f);if(acc<1)return;const r=car.getBoundingClientRect();
   while(acc>=1){acc--;const p=pool.find(q=>!q.on);if(!p)break;p.on=true;live++;p.age=0;p.life=cfg.life[0]+Math.random()*(cfg.life[1]-cfg.life[0]);
    p.x=r.left+r.width*(.18+Math.random()*.64);p.y=r.bottom-4-Math.random()*6;p.vx=(Math.random()-.5)*46;p.vy=-(10+Math.random()*26);p.s=.45+Math.random()*.3}};
  const smoke=dt=>{for(const p of pool){if(!p.on)continue;p.age+=dt;const k=p.age/p.life;
   if(k>=1){p.on=false;live--;p.e.style.opacity=0;continue}
   p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy*=.985;p.vx*=.99;
   p.e.style.opacity=(cfg.a*(k<.14?k/.14:Math.pow(1-(k-.14)/.86,1.7))).toFixed(3);
   p.e.style.transform=`translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0) scale(${(p.s+2.6*Math.pow(k,.6)).toFixed(2)})`}};
  const plan=()=>{const vw=VW();cfg=MC[modeNow()];T12=cl(1.9+vw/650,2.7,4.2)*cfg.t;Td=cl(1.1+vw/1000,1.5,2.4)*cfg.t;SET=.7*cfg.t};
  const draw=(vx)=>{el.style.transform=`translate3d(${x.toFixed(1)}px,0,0)`;bd.style.transform=`rotate(${lean.toFixed(2)}deg) rotateY(${yaw.toFixed(1)}deg)`;
   const sp=Math.abs(vx||0),cls='trl '+(vx<0?'rt':'lt');if(cls!==trailCls){tl.className=cls;trailCls=cls}tl.style.opacity=(cfg.trail*cl(sp/700,0,1)).toFixed(2)};
  const step=dt=>{const vw=VW(),PK=parkX(vw),X0=vw+10,XE=vw+TR+12,px=x;cfg=MC[modeNow()];pt+=dt;
   if(phase==='entry'){                                   /* Phases 1+2: drive in, drift 360, settle */
    if(pt<T12){const u=pt/T12,k=cl((u-.32)/.4,0,1);x=X0+(PK-X0)*E1(u);yaw=180+360*ss(k);lean=-cfg.lean*Math.sin(Math.PI*k);if(k>0&&k<1)emit(dt)}
    else{const s=cl((pt-T12)/SET,0,1);x=PK;yaw=540;lean=cfg.lean*.5*Math.exp(-4*s)*Math.sin(s*15);if(s<.3)emit(dt,1-s/.3);if(s>=1){lean=0;setPhase('smoke')}}}
   else if(phase==='smoke'){x=PK;if(!live){setPhase('park');wake=setTimeout(()=>{setPhase('depart');kick()},WAIT)}}   /* Phases 3+4: the 10s wait starts only once the smoke has fully faded */
   else if(phase==='depart'){                             /* Phase 5: turn around while pulling away, then accelerate off to the right */
    const u=cl(pt/Td,0,1),Tt=Math.min(Td*.45,.65*cfg.t),k2=cl(pt/Tt,0,1);x=PK+(XE-PK)*Math.pow(u,2.3);yaw=540+180*ss(k2);lean=-cfg.lean*.4*Math.sin(Math.PI*Math.min(1,u*1.25));if(u>=1)setPhase('gap')}
   else if(phase==='gap'){x=XE;lean=0;if(pt>.7){plan();x=X0;yaw=180;setPhase('entry')}}   /* Phase 6: re-enter from the right; the flip happens while fully off-screen */
   draw(dt>0?(x-px)/dt:0)};
  const frame=now=>{raf=0;const dt=cl((now-last)/1000,0,.05);last=now;step(dt);smoke(dt);if(phase!=='park'&&phase!=='off')raf=requestAnimationFrame(frame)};
  const kick=()=>{if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}};
  const halt=()=>{cancelAnimationFrame(raf);raf=0;clearTimeout(wake);phase='off';el.dataset.phase='off';pool.forEach(p=>{p.on=false;p.e.style.opacity=0});live=0;acc=0;el.style.display='none'};
  const start=()=>{plan();el.style.display='';x=VW()+10;yaw=180;lean=0;setPhase('entry');draw(0);kick()};

  const lsPhone=matchMedia('(max-height:480px) and (orientation:landscape)');
  let want=true,introOk=!document.body.classList.contains('has-intro')||document.body.classList.contains('ended');
  const sync=()=>{if(want&&introOk&&!lsPhone.matches){if(phase==='off')start()}else halt()};
  if(!introOk)document.addEventListener('bmw:intro-end',()=>{introOk=true;sync()},{once:true});
  dkMas.onclick=()=>{want=!want;dkMas.setAttribute('aria-pressed',want);sync()};
  (lsPhone.addEventListener?lsPhone.addEventListener('change',sync):lsPhone.addListener(sync));
  addEventListener('resize',()=>{if(phase==='park'){x=parkX(VW());draw(0)}});
  halt();sync()}

 /* chat guide */
 BMWChat.init({models:MODELS,eras:ERAS,cats:CATS,timeline:TIMELINE,kb:BMW_KB});
 const AI=!!CFG.CHAT_ENDPOINT;let st=BMWChat.newState(),hist=[],busy=false;
 const chat=document.createElement('div');chat.className='chat';chat.hidden=true;chat.setAttribute('role','dialog');chat.setAttribute('aria-label','BMWorld guide');
 chat.innerHTML=`<header><span>BMWorld guide<small id="cmode">${AI?'AI guide':'Offline guide: site data only'}</small></span><span class="hb"><button id="cnew" aria-label="Start a new chat" title="New chat">&#8635;</button><button id="cx" aria-label="Close chat">&times;</button></span></header><div class="msgs" id="msgs" aria-live="polite"></div><div class="sug" id="sug"></div><form id="cform"><input id="cin" placeholder="Ask about any BMW, a term or a comparison..." autocomplete="off" maxlength="400" aria-label="Your question"><button class="btn btn-m" type="submit">Send</button></form>`;
 document.body.append(chat);
 const msgs=$('#msgs',chat),sug=$('#sug',chat);
 const say=(h,me,cf)=>{const d=document.createElement('div');d.className='msg'+(me?' me':'');d.innerHTML=h+(cf?`<span class="cf">${cf}</span>`:'');msgs.append(d);msgs.scrollTop=msgs.scrollHeight;return d};
 const fmt=t=>BMWChat.linkify(esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/^\s*[-*]\s+/gm,'&bull; ').replace(/\n/g,'<br>'));
 const STARTERS=(BMW_KB.starters||[]);const showSug=()=>{sug.innerHTML=STARTERS.slice(0,4).map(s=>`<button type="button">${esc(s)}</button>`).join('')};
 const hello=()=>say(AI?'Hi! I am the BMWorld guide. Ask me anything about BMW: the 79 models in the catalogue, engines, technology, motorsport, electric cars, comparisons or which model suits you.':'Hi! I am the BMWorld guide (offline mode). I answer from the 79-model catalogue and a BMW knowledge base, and I tell you when a figure is not on file. Try a model, a comparison or "recommend a family BMW".');
 const open=()=>{chat.hidden=false;if(!msgs.children.length){hello();showSug()}$('#cin').focus()};
 $('#dkChat').onclick=()=>chat.hidden?open():chat.hidden=true;$('#cx',chat).onclick=()=>chat.hidden=true;
 $('#cnew',chat).onclick=()=>{st=BMWChat.newState();hist=[];msgs.innerHTML='';hello();showSug()};
 addEventListener('keydown',e=>{if(e.key==='Escape'&&!chat.hidden)chat.hidden=true});
 sug.onclick=e=>{const b=e.target.closest('button');if(b)ask(b.textContent)};
 $('#cform').onsubmit=e=>{e.preventDefault();const v=$('#cin').value.trim();if(v&&!busy){$('#cin').value='';ask(v)}};
 async function ask(q){busy=true;sug.innerHTML='';say(esc(q),true);const w=say('<span class="dots"><i></i><i></i><i></i></span>');
  const ctx=AI?BMWChat.context(q,st):null,local=BMWChat.answer(q,st,{ai:AI});   /* the local pass also keeps the follow-up memory (model, pair, field) up to date */
  let done=false;
  if(AI){try{const ac=new AbortController(),to=setTimeout(()=>ac.abort(),30000);
    const r=await fetch(CFG.CHAT_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},signal:ac.signal,body:JSON.stringify({message:q,history:hist.slice(-8),context:ctx})});clearTimeout(to);
    const d=await r.json();if(r.ok&&d.reply){w.innerHTML=fmt(d.reply)+'<span class="cf">AI answer. Check exact figures on the model pages.</span>';hist.push({role:'user',content:q},{role:'assistant',content:d.reply});done=true}}catch(e){}}
  if(!done){w.innerHTML=local.html+(local.cf?`<span class="cf">${esc(local.cf)}</span>`:'')+(AI?'<span class="cf">The AI service did not respond, so this answer came from the offline guide.</span>':'');hist.push({role:'user',content:q},{role:'assistant',content:local.plain||local.html.replace(/<[^>]+>/g,' ')})}
  msgs.scrollTop=msgs.scrollHeight;busy=false;$('#cin').focus()}
});
/* compare page */
function comparePage(){const q=new URLSearchParams(location.search),A=$('#cmpA'),B=$('#cmpB'),opts=ERAS.map(e=>`<optgroup label="${e.range} | ${esc(e.name)}">${MODELS.filter(m=>m.era===e.id).map(m=>`<option value="${m.slug}">${m.n}. ${esc(m.name)}</option>`).join('')}</optgroup>`).join('');A.innerHTML=opts;B.innerHTML=opts;
 A.value=bySlug(q.get('a'))?q.get('a'):'m4';B.value=bySlug(q.get('b'))?q.get('b'):(A.value==='m3'?'m4':'m3');
 const rows=[['Catalogue','n'],['Generation','gen'],['Body','body'],['Production','years'],['Engine','e'],['Engine code','ec'],['Displacement','dp'],['Power','pw'],['Torque','tq'],['Top speed','ts'],['Acceleration','ac'],['Transmission','tr'],['Drive','dr']];
 const draw=()=>{const a=bySlug(A.value),b=bySlug(B.value);history.replaceState(null,'',`compare.html?a=${a.slug}&b=${b.slug}`);
  $('#cmpOut').innerHTML=`<div class="cmp-h"><div></div>${[a,b].map(m=>`<div><div class="im">${cover(m)}</div><h4><a href="model.html?model=${m.slug}">${esc(m.name)}</a></h4></div>`).join('')}</div><table class="cmp">${rows.map(r=>`<tr><th>${r[0]}</th><td>${spec(a[r[1]])}</td><td>${spec(b[r[1]])}</td></tr>`).join('')}</table>${[a,b].some(m=>m.rep)?`<p class="note mt-2">${[a,b].filter(m=>m.rep).map(m=>esc(m.name)+': '+esc(m.rep)).join(' | ')}.</p>`:''}`};
 A.onchange=draw;B.onchange=draw;draw()}
/* quiz page */
const QUIZ=[
{q:"Pick your ideal road.",a:[["A winding mountain pass",{"m2":2,"m4":2,"1m-coupe":1,"m3":1}],["The autobahn at night",{"m5":2,"m8":2,"7-series":1}],["An empty coast road, roof down",{"z8":2,"i8":1,"3-0-cs":1}]]},
{q:"Which era is yours?",a:[["The 70s and 80s",{"3-0-cs":2,"2002":2,"m1":2,"m3":2,"m635csi":2}],["The 2000s",{"z8":2,"1m-coupe":2}],["Today and tomorrow",{"m4":2,"i8":1,"xm":2,"m2":2,"7-series":1}]]},
{q:"What matters most?",a:[["Raw speed",{"m5":2,"m4":2,"m8":1}],["Style and rarity",{"m1":2,"z8":2,"3-0-cs":2}],["Comfort and presence",{"7-series":2,"xm":2,"m8":1}],["Clever technology",{"i8":2,"xm":1,"2002":1}]]},
{q:"Your weekend plan?",a:[["A track day",{"m4":2,"m2":2,"m3":2,"1m-coupe":1}],["A long road trip",{"m8":2,"7-series":2,"m635csi":2}],["A classic car show",{"m1":2,"3-0-cs":2,"z8":1,"2002":2}]]},
{q:"Which engine note?",a:[["A smooth straight-six",{"m4":2,"1m-coupe":2,"m1":1,"m635csi":2,"3-0-cs":2,"m2":2}],["V8 thunder",{"m5":2,"m8":2,"z8":2,"7-series":1,"xm":1}],["Turbo whoosh or electric hum",{"2002":2,"i8":2,"xm":1}]]}];
function quizPage(){const R=$('#quizRoot');let n=0,sc={};
 const show=()=>{if(n>=QUIZ.length){const top=Object.entries(sc).sort((a,b)=>b[1]-a[1])[0],m=bySlug(top&&top[0])||MODELS[0];
   R.innerHTML=`<div class="q"><small class="tag">Your match</small><h2>${esc(m.name)}</h2><div class="frame mb-3">${cover(m)}</div><p class="lead">${esc(m.intro)}</p><a class="btn btn-m" href="model.html?model=${m.slug}">See the details</a> <button class="btn btn-glass" id="again">Retake the quiz</button></div>`;$('#again').onclick=()=>{n=0;sc={};show()};return}
  const Q=QUIZ[n];R.innerHTML=`<div class="q"><div class="prog">Question ${n+1} of ${QUIZ.length}</div><h3 class="mt-2">${esc(Q.q)}</h3>${Q.a.map((a,i)=>`<button class="opt" data-i="${i}">${esc(a[0])}</button>`).join('')}</div>`;
  $$('.opt',R).forEach(b=>b.onclick=()=>{const w=Q.a[+b.dataset.i][1];for(const k in w)sc[k]=(sc[k]||0)+w[k];n++;show()})};show()}
