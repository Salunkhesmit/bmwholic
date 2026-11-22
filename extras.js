const CFG=window.SITE_CONFIG||{};
document.addEventListener('DOMContentLoaded',()=>{
 /* drive mode */
 const setMode=m=>{document.documentElement.dataset.mode=m;try{localStorage.setItem('bmw-mode',m)}catch(e){}$$('.dock [data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m))};
 let mode='sport';try{mode=localStorage.getItem('bmw-mode')||'sport'}catch(e){}
 const dock=document.createElement('div');dock.className='dock';
 dock.innerHTML=`<div class="modes" role="group" aria-label="Drive mode">${['comfort','sport','track'].map(m=>`<button data-mode="${m}" aria-pressed="false">${m}</button>`).join('')}</div><button id="dkMas" aria-pressed="true">Mascot</button><button class="ask" id="dkChat">Ask BMWorld</button>`;
 document.body.append(dock);setMode(mode);
 dock.querySelector('.modes').onclick=e=>{const b=e.target.closest('[data-mode]');if(b)setMode(b.dataset.mode)};
 /* mascot */
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(!still){
  const svg='<svg viewBox="0 0 160 60" aria-label="Mascot car"><path d="M6 40 L10 30 Q18 26 40 24 L62 10 Q70 7 88 7 L112 9 Q124 12 134 26 L150 30 Q156 34 155 42 L150 46 H6Z" fill="#0066B1"/><path d="M66 13 L88 11 L108 12 Q116 14 122 24 H60Z" fill="#0b1b2b"/><rect x="6" y="40" width="148" height="4" fill="#E51A24"/><circle cx="38" cy="46" r="10" fill="#08080A" stroke="#8E929E" stroke-width="3"/><circle cx="124" cy="46" r="10" fill="#08080A" stroke="#8E929E" stroke-width="3"/><rect x="146" y="32" width="8" height="4" fill="#fff"/></svg>';
  const el=document.createElement('div');el.className='mascot';el.innerHTML=`<div class="car" id="mcar" role="img" aria-label="Mascot car, click to drift"></div>`;document.body.append(el);
  const car=$('#mcar',el);car.innerHTML=CFG.MASCOT_SRC?`<img src="${esc(CFG.MASCOT_SRC)}" alt="" onerror="this.outerHTML=''">`:svg;
  let x=60,dir=1,speed=130,state='cruise',t=0,ang=0,spin=0,last=performance.now(),on=true,puffT=0,lastY=scrollY,flip=0;
  const W=()=>car.offsetWidth||110;
  const puff=(px)=>{if($$('.puff').length>14)return;const p=document.createElement('i');p.className='puff';p.style.left=px+'px';p.style.bottom='10px';p.style.setProperty('--dx',(-dir*(10+Math.random()*24))+'px');document.body.append(p);setTimeout(()=>p.remove(),800)};
  const drift=(turn)=>{if(state!=='cruise')return;state=turn?'turn':'drift';t=0};
  car.onclick=()=>{if(state==='cruise'){state='donut';t=0}};
  $('#dkMas').onclick=e=>{on=!on;el.style.display=on?'':'none';e.currentTarget.setAttribute('aria-pressed',on)};
  addEventListener('scroll',()=>{const d=Math.abs(scrollY-lastY);lastY=scrollY;if(d>140&&Math.random()<.5)drift(false)},{passive:true});
  const loop=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;
   if(on){const w=W(),max=innerWidth-w;
    if(state==='cruise'){x+=dir*speed*dt;ang*=.85;if(Math.random()<.004)drift(false);if(x>max||x<0){x=Math.max(0,Math.min(max,x));drift(true)}}
    else{t+=dt;const k=Math.min(1,t/(state==='donut'?1:.9));
     if(state==='drift'){ang=-dir*26*Math.sin(k*Math.PI);x+=dir*speed*1.7*dt}
     else if(state==='turn'){flip=k;ang=dir*-26*Math.sin(k*Math.PI);x+=dir*speed*.5*dt*(1-k)}
     else{ang=360*k*dir}
     puffT+=dt;if(puffT>.06){puffT=0;puff(x+(dir>0?8:w-8))}
     if(k>=1){if(state==='turn')dir*=-1;state='cruise';ang=0;flip=0}}
    const s=state==='turn'&&flip<.5?dir:(state==='turn'?-dir:dir);
    el.style.transform=`translateX(${x}px)`;car.style.transform=`scaleX(${s}) rotate(${ang*s}deg)`}
   requestAnimationFrame(loop)};requestAnimationFrame(loop)}
 else $('#dkMas').remove();
 /* chat guide */
 const chat=document.createElement('div');chat.className='chat';chat.hidden=true;
 chat.innerHTML=`<header><span>BMWorld guide</span><button aria-label="Close chat">&times;</button></header><div class="msgs" id="msgs" aria-live="polite"></div><div class="sug" id="sug"></div><form id="cform"><input id="cin" placeholder="Ask about a model..." autocomplete="off" aria-label="Your question"><button class="btn btn-m" type="submit">Send</button></form>`;
 document.body.append(chat);
 const msgs=$('#msgs',chat),say=(h,me)=>{const d=document.createElement('div');d.className='msg'+(me?' me':'');d.innerHTML=h;msgs.append(d);msgs.scrollTop=msgs.scrollHeight;return d};
 const SUG=['How much power does the M4 have?','Tell me about the E30 M3','Which are the classic BMWs?','Compare M4 and M5 CS','When was BMW founded?'];
 $('#sug',chat).innerHTML=SUG.map(s=>`<button>${s}</button>`).join('');
 const open=()=>{chat.hidden=false;if(!msgs.children.length)say('Hi! I answer from the cars and timeline on this site. Ask about power, torque, history or a series.');$('#cin').focus()};
 $('#dkChat').onclick=()=>chat.hidden?open():chat.hidden=true;$('button',chat.firstChild).onclick=()=>chat.hidden=true;
 $('#sug',chat).onclick=e=>{const b=e.target.closest('button');if(b)ask(b.textContent)};
 $('#cform').onsubmit=e=>{e.preventDefault();const v=$('#cin').value.trim();if(v){$('#cin').value='';ask(v)}};
 let last=null;
 const AL={'m4-competition':['m4','m4 competition','g82'],'e30-m3':['e30 m3','e30','m3'],'2002-turbo':['2002 turbo','2002'],'3-0-csl':['csl','3.0 csl','batmobile'],'1m-coupe':['1m','1 series m'],'m2':['m2','g87'],'m5-cs':['m5 cs','m5','f90'],'m635csi':['m635csi','m635','e24'],'760i-xdrive':['760i','760','g70'],'m8-competition':['m8','f92'],'xm':['xm','g09'],'z8':['z8','e52'],'m1':['m1','e26'],'i8-roadster':['i8','i15']};
 const norm=s=>s.toLowerCase().replace(/[^a-z0-9. ]/g,' ').replace(/\s+/g,' ').trim();
 const findModel=t=>{let best=null,bl=0;MODELS.forEach(m=>{(AL[m.slug]||[norm(m.name),m.slug.replace(/-/g,' ')]).forEach(a=>{if(a.length>bl&&new RegExp('(^| )'+a.replace(/\./g,'\\.')+'( |$)').test(t)){best=m;bl=a.length}})});return best};
 const link=m=>`<a href="model.html?model=${m.slug}">${esc(m.name)}</a>`;
 const FIELDS=[['hist',/history|story|background/,'History'],['facts',/fact|trivia/,'Facts'],['feat',/feature|special|engineering/,'Features'],['ec',/engine code|code/,'Engine code'],['tq',/torque|lb ft|nm/,'Torque'],['pw',/power|horsepower|hp|bhp/,'Power'],['ts',/top speed|fastest|vmax/,'Top speed'],['ac',/0 60|acceler|quick/,'0-60'],['tr',/gearbox|transmission|manual|automatic/,'Transmission'],['dr',/drive|awd|rwd|xdrive|wheel drive/,'Drive'],['dp',/displacement|litre|liter|cc/,'Displacement'],['e',/engine|motor/,'Engine'],['years',/year|when|production|built|made/,'Production'],['gen',/generation|chassis/,'Chassis']];
 const val=(m,k)=>{const v=k==='years'?m.years:m[k];return Array.isArray(v)?v.join(' ').replace(/\s+/g,' '):v};
 function local(q){const t=norm(q);if(/^(hi|hello|hey)\b/.test(t))return'Hello! Ask me about any model, for example "torque of the M5 CS".';
  const cmp=t.match(/compare (.+?) (?:and|vs|with|to) (.+)/);if(cmp){const a=findModel(norm(cmp[1])),b=findModel(norm(cmp[2]));if(a&&b)return`Here you go: <a href="compare.html?a=${a.slug}&b=${b.slug}">${esc(a.name)} vs ${esc(b.name)}</a>.`}
  if(/who (made|built|developed)|smit|developer/.test(t))return'This fan site was developed by Smit Salunkhe. It is not affiliated with BMW AG.';
  const m=findModel(t)||(/\b(it|its|that|this)\b/.test(t)?last:null);
  if(m){last=m;const hits=FIELDS.filter(f=>f[1].test(t));
   if(hits.length){return`<b>${esc(m.name)}</b><br>`+hits.slice(0,3).map(f=>{const v=val(m,f[0]);return`${f[2]}: ${v==='TBD'||!v?'not verified yet (to be added)':esc(v)}`}).join('<br>')+`<br>${link(m)}`}
   return`<b>${esc(m.name)}</b> (${esc(m.gen)}, ${esc(m.years)}): ${esc(m.intro)}<br>Power: ${esc(m.pw==='TBD'?'to be added':m.pw)}.<br>${link(m)}`}
  const yr=t.match(/\b(1[89]\d\d|20\d\d)\b/);if(yr){const e=TIMELINE.find(x=>x.y===yr[1]);if(e)return`<b>${e.y}: ${esc(e.t)}</b><br>${esc(e.x)}`}
  if(/found|origin|begin|start of bmw|history of bmw/.test(t))return`<b>${TIMELINE[0].y}: ${esc(TIMELINE[0].t)}</b><br>${esc(TIMELINE[0].x)}<br><a href="history.html">Full timeline</a>`;
  const cat=CATS.find(c=>t.includes(norm(c)))||(/classic|old|vintage/.test(t)?'Classic':/\bm (series|cars?)\b|m division/.test(t)?'M Series':null);
  if(cat){const l=MODELS.filter(x=>x.cat===cat);return l.length?`${esc(cat)}: ${l.map(link).join(', ')}.`:`No ${esc(cat)} models in the catalogue yet.`}
  if(/3d/.test(t))return'See the <a href="3d-experience.html">3D page</a>. Models appear there once a 3D file is added.';
  if(/quiz|which bmw/.test(t))return'Try <a href="quiz.html">Which BMW are you?</a>';
  return'I could not match that. Try a model name ("M4", "E30 M3", "Z8"), a series ("5 Series") or a topic like "classic BMWs".'}
 async function ask(q){say(esc(q),true);const w=say('...');
  if(CFG.CHAT_ENDPOINT){try{const m=findModel(norm(q))||last,r=await fetch(CFG.CHAT_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:q,context:m||{}})});const d=await r.json();if(d.reply){if(m)last=m;w.textContent=d.reply;return}}catch(e){}}
  w.innerHTML=local(q);msgs.scrollTop=msgs.scrollHeight}
});
/* compare page */
function comparePage(){const q=new URLSearchParams(location.search),A=$('#cmpA'),B=$('#cmpB'),opts=MODELS.map(m=>`<option value="${m.slug}">${esc(m.name)}</option>`).join('');A.innerHTML=opts;B.innerHTML=opts;
 A.value=bySlug(q.get('a'))?q.get('a'):'m4-competition';B.value=bySlug(q.get('b'))?q.get('b'):(A.value==='e30-m3'?'m4-competition':'e30-m3');
 const rows=[['Generation','gen'],['Production','years'],['Engine','e'],['Engine code','ec'],['Displacement','dp'],['Power','pw'],['Torque','tq'],['Top speed','ts'],['Acceleration','ac'],['Transmission','tr'],['Drive','dr']];
 const draw=()=>{const a=bySlug(A.value),b=bySlug(B.value);history.replaceState(null,'',`compare.html?a=${a.slug}&b=${b.slug}`);
  $('#cmpOut').innerHTML=`<div class="cmp-h"><div></div>${[a,b].map(m=>`<div><div class="im">${cover(m)}</div><h4><a href="model.html?model=${m.slug}">${esc(m.name)}</a></h4></div>`).join('')}</div><table class="cmp">${rows.map(r=>`<tr><th>${r[0]}</th><td>${spec(a[r[1]])}</td><td>${spec(b[r[1]])}</td></tr>`).join('')}</table>`};
 A.onchange=draw;B.onchange=draw;draw()}
/* quiz page */
const QUIZ=[
{q:"Pick your ideal road.",a:[["A winding mountain pass",{"m2":2,"m4-competition":2,"1m-coupe":1,"e30-m3":1}],["The autobahn at night",{"m5-cs":2,"m8-competition":2,"760i-xdrive":1}],["An empty coast road, roof down",{"z8":2,"i8-roadster":1,"3-0-csl":1}]]},
{q:"Which era is yours?",a:[["The 70s and 80s",{"3-0-csl":2,"2002-turbo":2,"m1":2,"e30-m3":2,"m635csi":2}],["The 2000s",{"z8":2,"1m-coupe":2}],["Today and tomorrow",{"m4-competition":2,"i8-roadster":1,"xm":2,"m2":2,"760i-xdrive":1}]]},
{q:"What matters most?",a:[["Raw speed",{"m5-cs":2,"m4-competition":2,"m8-competition":1}],["Style and rarity",{"m1":2,"z8":2,"3-0-csl":2}],["Comfort and presence",{"760i-xdrive":2,"xm":2,"m8-competition":1}],["Clever technology",{"i8-roadster":2,"xm":1,"2002-turbo":1}]]},
{q:"Your weekend plan?",a:[["A track day",{"m4-competition":2,"m2":2,"e30-m3":2,"1m-coupe":1}],["A long road trip",{"m8-competition":2,"760i-xdrive":2,"m635csi":2}],["A classic car show",{"m1":2,"3-0-csl":2,"z8":1,"2002-turbo":2}]]},
{q:"Which engine note?",a:[["A smooth straight-six",{"m4-competition":2,"1m-coupe":2,"m1":1,"m635csi":2,"3-0-csl":2,"m2":2}],["V8 thunder",{"m5-cs":2,"m8-competition":2,"z8":2,"760i-xdrive":1,"xm":1}],["Turbo whoosh or electric hum",{"2002-turbo":2,"i8-roadster":2,"xm":1}]]}];
function quizPage(){const R=$('#quizRoot');let n=0,sc={};
 const show=()=>{if(n>=QUIZ.length){const top=Object.entries(sc).sort((a,b)=>b[1]-a[1])[0],m=bySlug(top&&top[0])||MODELS[0];
   R.innerHTML=`<div class="q"><small class="tag">Your match</small><h2>${esc(m.name)}</h2><div class="frame mb-3">${cover(m)}</div><p class="lead">${esc(m.intro)}</p><a class="btn btn-m" href="model.html?model=${m.slug}">See the details</a> <button class="btn btn-glass" id="again">Retake the quiz</button></div>`;$('#again').onclick=()=>{n=0;sc={};show()};return}
  const Q=QUIZ[n];R.innerHTML=`<div class="q"><div class="prog">Question ${n+1} of ${QUIZ.length}</div><h3 class="mt-2">${esc(Q.q)}</h3>${Q.a.map((a,i)=>`<button class="opt" data-i="${i}">${esc(a[0])}</button>`).join('')}</div>`;
  $$('.opt',R).forEach(b=>b.onclick=()=>{const w=Q.a[+b.dataset.i][1];for(const k in w)sc[k]=(sc[k]||0)+w[k];n++;show()})};show()}
