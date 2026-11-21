/* Shared helpers, header/footer, image fallback, chips, carousel. */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const NAV=[["index.html","Home","home"],["models.html","Models","models"],["history.html","History","history"],["m-performance.html","M Performance","m"],["3d-experience.html","3D","3d"],["gallery.html","Gallery","gallery"],["compare.html","Compare","compare"],["quiz.html","Which BMW?","quiz"],["about.html","About","about"]];
const ph=t=>`<div class="noimg">${esc(t)}</div>`;
function bmFail(i){i.replaceWith(Object.assign(document.createElement('div'),{className:'noimg',textContent:'Image unavailable: '+(i.alt||'')}))}
const img=(k,alt)=>{const s=imgSrc(k);return s?`<img src="${esc(s)}" alt="${esc(alt)}" loading="lazy" onerror="bmFail(this)">`:ph('Photo to be added: '+alt)};
const spec=v=>v==='TBD'||!v?'<em class="tbd">To be added</em>':esc(v);
function layout(){const pg=document.body.dataset.page;$$('[data-img]').forEach(e=>e.innerHTML=img(e.dataset.img,e.dataset.alt));
 $('#hdr').outerHTML=`<header class="site-nav"><nav class="navbar navbar-expand-xl"><div class="container"><a class="navbar-brand" href="index.html">BMWorld</a><button class="snd-btn" id="sndBtn" type="button" aria-pressed="false" aria-label="Play BMW engine sound" title="Play BMW engine sound"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="sp" d="M3 9.5h3.5L11 5.5v13l-4.5-4H3z"/><path class="w w1" d="M14.5 9a4 4 0 0 1 0 6"/><path class="w w2" d="M17.5 6.5a8 8 0 0 1 0 11"/></svg><span>Engine</span></button><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Menu"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="nav"><ul class="navbar-nav ms-auto">${NAV.map(n=>`<li><a class="nav-link${n[2]===(pg==='model'?'models':pg)?' active':''}" href="${n[0]}">${n[1]}</a></li>`).join('')}</ul></div></div></nav></header>`;
 $('#ftr').outerHTML=`<footer class="foot"><div class="container d-flex flex-wrap justify-content-between gap-3"><div><b>BMWorld</b><br><span>More Than a Machine. A Legacy.</span><br><span>Developed by Smit Salunkhe</span></div><div class="flinks">${NAV.map(n=>`<a href="${n[0]}">${n[1]}</a>`).join('')}</div><div><span>&copy; ${new Date().getFullYear()} BMWorld. Unofficial fan project, not affiliated with BMW AG.</span></div></div></footer>`}
function chips(el,list,cb,start=0){el.innerHTML=list.map((c,i)=>`<button class="chip${i===start?' on':''}" aria-pressed="${i===start}">${esc(c)}</button>`).join('');
 el.onclick=e=>{const b=e.target.closest('.chip');if(!b)return;$$('.chip',el).forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});b.classList.add('on');b.setAttribute('aria-pressed','true');cb(b.textContent)}}
const modelImgs=m=>(MODEL_IMAGES[m.slug]||[]).map((s,i)=>typeof s==='object'?s:{src:s,alt:`${m.name}, photo ${i+1}`});
const cover=m=>{const a=modelImgs(m)[0];return a&&a.src?img(a.src,a.alt):ph('Photo to be added')};
const modelCard=m=>`<div class="col-sm-6 col-lg-4"><a class="card-m" href="model.html?model=${m.slug}"><div class="im">${cover(m)}</div><div class="tx"><small>${esc(m.gen)} · ${esc(m.years)}</small><h4>${esc(m.name)}</h4><p>${esc(m.intro)}</p></div></a></div>`;
/* Carousel: auto-advance every 3s, arrows, dots, swipe. Vertical scrolling is never blocked (touch-action: pan-y, no wheel handlers). */
function carousel(el,slides,ms=3000){let i=0,t;
 el.innerHTML=`<div class="cr-track">${slides.map((s,n)=>{const u=imgSrc(s.src);return `<figure class="cr-s${n?'':' on'}">${u?`<img src="${esc(u)}" alt="${esc(s.alt)}" ${n?'loading="lazy"':''} onerror="bmFail(this)">`:ph('Photo slot '+(n+1)+': '+s.alt+'. Add a URL in images.js')}</figure>`}).join('')}</div><button class="cr-b prev" aria-label="Previous image">&#8249;</button><button class="cr-b next" aria-label="Next image">&#8250;</button><div class="cr-dots">${slides.map((s,n)=>`<button aria-label="Show image ${n+1}"></button>`).join('')}</div>`;
 const S=$$('.cr-s',el),D=$$('.cr-dots button',el);
 const go=n=>{i=(n+S.length)%S.length;S.forEach((s,k)=>s.classList.toggle('on',k===i));D.forEach((d,k)=>d.setAttribute('aria-current',k===i))};
 const run=()=>{clearInterval(t);if(S.length>1)t=setInterval(()=>{if(!document.hidden)go(i+1)},ms)};
 $('.prev',el).onclick=()=>{go(i-1);run()};$('.next',el).onclick=()=>{go(i+1);run()};D.forEach((d,k)=>d.onclick=()=>{go(k);run()});
 let x0=null;el.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});el.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));run()}x0=null},{passive:true});
 go(0);run()}
/* Engine sound: one centralized path (SITE_CONFIG.ENGINE_SOUND). Starts only on click; if it was playing when you navigate, the next page resumes it from the same point (when the browser allows). */
function engineSound(){const b=$('#sndBtn');if(!b)return;const SRC=(window.SITE_CONFIG||{}).ENGINE_SOUND,K='bmw-engine';let au=null,dead=false;
 const ui=(on)=>{b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);const l=on?'Pause BMW engine sound':'Play BMW engine sound';b.setAttribute('aria-label',l);b.title=l};
 const fail=()=>{dead=true;au=null;ui(false);b.classList.add('off');b.title='Engine sound file not found (bmw-engine.mp3)';b.setAttribute('aria-label',b.title)};
 const get=()=>{if(!au){au=new Audio();au.preload='auto';au.addEventListener('ended',()=>{ui(false);au.currentTime=0;save()});au.addEventListener('error',fail);au.src=SRC}return au};
 const save=()=>{try{sessionStorage.setItem(K,JSON.stringify({p:!!au&&!au.paused&&!au.ended,t:au?au.currentTime:0}))}catch(e){}};
 const play=(from)=>{const a=get();if(from!=null){try{a.currentTime=from}catch(e){}}const p=a.play();return p&&p.then?p.then(()=>ui(true)):(ui(true),0)};
 b.onclick=()=>{if(!SRC||dead)return;if(au&&!au.paused){au.pause();ui(false);save();return}
  const done=au&&au.ended||(au&&au.duration&&au.currentTime>=au.duration-.05);play(done?0:null).catch(()=>{if(!dead)ui(false)})};
 addEventListener('pagehide',save);
 try{const st=JSON.parse(sessionStorage.getItem(K)||'null');if(SRC&&st&&st.p){get();play(st.t).catch(()=>ui(false))}}catch(e){}}
document.addEventListener('DOMContentLoaded',()=>{layout();engineSound()});
