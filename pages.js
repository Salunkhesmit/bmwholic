document.addEventListener('DOMContentLoaded',()=>{const P={home:homePage,models:modelsPage,model:modelPage,history:historyPage,m:mPage,'3d':threePage,gallery:galleryPage,compare:comparePage,quiz:quizPage};(P[document.body.dataset.page]||(()=>{}))()});
function homePage(){const f=$('#featured');if(f)f.innerHTML=['m4','m3','3-0-cs','i8'].map(s=>modelCard(bySlug(s))).join('')}
function modelsPage(){const g=$('#modelGrid'),qs=new URLSearchParams(location.search),sIn=$('#modelSearch'),cnt=$('#modelCount');
 const EL=[['all','All eras'],...ERAS.map(e=>[e.id,e.range])],FL=['All families',...CATS];
 let era=EL.some(x=>x[0]===qs.get('era'))?qs.get('era'):'all',fam=FL.includes(qs.get('cat'))?qs.get('cat'):'All families',q=(qs.get('q')||'').slice(0,60);
 const flat=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),hay=m=>flat([m.n,m.name,m.slug,m.cat,m.gen,m.chassis,m.years,m.body,m.e,m.ec,(m.gens||[]).map(x=>x.join(' ')).join(' ')].join(' '));
 const H=new Map(MODELS.map(m=>[m.slug,hay(m)]));
 const match=m=>(era==='all'||m.era===era)&&(fam==='All families'||m.cat===fam)&&flat(q).split(' ').filter(Boolean).every(t=>H.get(m.slug).includes(t));
 const draw=()=>{const l=MODELS.filter(match);let h='';
  ERAS.forEach(e=>{const r=l.filter(m=>m.era===e.id);if(r.length)h+=`<div class="col-12 era-h"><span>${e.range}</span><h2>${esc(e.name)}</h2><small>${r.length} of ${e.to-e.from+1} entries</small></div>`+r.map(modelCard).join('')});
  g.innerHTML=h;cnt.textContent=`${l.length} of ${MODELS.length} models`;$('#modelEmpty').classList.toggle('d-none',l.length>0);
  const u=new URLSearchParams();if(era!=='all')u.set('era',era);if(fam!=='All families')u.set('cat',fam);if(q)u.set('q',q);history.replaceState(null,'','models.html'+(u.toString()?'?'+u:''))};
 sIn.value=q;let t=0;sIn.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{q=sIn.value.trim();draw()},120)};
 chips($('#eraChips'),EL.map(x=>x[1]),l=>{era=EL.find(x=>x[1]===l)[0];draw()},Math.max(0,EL.findIndex(x=>x[0]===era)));
 chips($('#modelChips'),FL,l=>{fam=l;draw()},Math.max(0,FL.indexOf(fam)));draw()}
function modelPage(){const root=$('#modelRoot'),m=bySlug(new URLSearchParams(location.search).get('model'));
 if(!m){root.innerHTML='<h1>Model not found</h1><p class="lead">That model is not in the catalogue.</p><a class="btn btn-m" href="models.html">Back to models</a>';return}
 document.title=m.name+' | BMWorld';
 const grp=(t,rows)=>`<section class="sg"><h3>${t}</h3><dl>${rows.map(r=>`<div><dt>${r[0]}</dt><dd>${spec(r[1])}</dd></div>`).join('')}</dl></section>`;
 const li=a=>a&&a.length?`<ul class="bul">${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
 const rel=(m.rel||[]).map(bySlug).filter(Boolean),era=eraOf(m.n),pv=MODELS[m.n-2],nx=MODELS[m.n];
 root.innerHTML=`<nav class="crumb"><a href="models.html">Models</a> / <a href="models.html?cat=${encodeURIComponent(m.cat)}">${esc(m.cat)}</a> / ${esc(m.name)}</nav>
 <div class="row g-4 g-xl-5"><div class="col-lg-6 col-xl-7"><div class="cr" id="cr" aria-roledescription="carousel" aria-label="${esc(m.name)} photos"></div></div>
 <div class="col-lg-6 col-xl-5"><small class="tag">#${m.n} of ${MODELS.length} · ${esc(era.range)} · ${esc(m.cat)} · ${esc(m.gen)} · ${esc(m.years)}</small><h1>${esc(m.name)}</h1><p class="lead">${esc(m.intro)}</p>${m.flag?`<div class="flagbox" role="note"><b>${esc(m.flag.t)}</b><span>${esc(m.flag.x)}</span></div>`:''}
 <div class="d-flex gap-2 flex-wrap mb-3">${m.model3d?`<a class="btn btn-m" href="3d-experience.html?model=${m.slug}">View in 3D</a>`:''}<a class="btn btn-glass" href="compare.html?a=${m.slug}">Compare</a></div>
 ${grp('Identity',[['Generation',m.gen],['Chassis code',m.chassis],['Production',m.years]])}
 ${grp('Engine',[['Configuration',m.e],['Engine code',m.ec],['Displacement',m.dp]])}
 ${grp('Performance',[['Power',m.pw],['Torque',m.tq],['Top speed',m.ts],['Acceleration',m.ac]])}
 ${grp('Drivetrain',[['Transmission',m.tr],['Drive',m.dr]])}
 ${m.rep?`<p class="note mb-0">${esc(m.rep)}.</p>`:''}${m.o&&m.o.length?grp('Other',m.o):''}</div></div>
 ${m.gens&&m.gens.length?`<h3 class="mt-4">Generations and variants</h3><div class="table-responsive"><table class="cmp gens"><tbody>${m.gens.map(x=>`<tr><th>${esc(x[0])}</th><td>${esc(x[1])}</td><td>${esc(x[2]||'')}</td></tr>`).join('')}</tbody></table></div>`:''}
 <div class="row g-4 mt-2"><div class="col-12 col-lg-6"><h3>Historical background</h3><p>${esc(m.hist)}</p></div><div class="col-md-6 col-lg-3"><h3>Interesting facts</h3>${li(m.facts)}</div><div class="col-md-6 col-lg-3"><h3>Engineering features</h3>${li(m.feat)}</div></div>
 <p class="note mt-3">"To be added" means the figure has not been verified yet. Edit it in models.js.</p>
 <nav class="pn" aria-label="Catalogue order">${pv?`<a href="model.html?model=${pv.slug}">&#8249; #${pv.n} ${esc(pv.name)}</a>`:'<span></span>'}${nx?`<a href="model.html?model=${nx.slug}">#${nx.n} ${esc(nx.name)} &#8250;</a>`:''}</nav>
 ${rel.length?`<h3 class="mt-5 mb-3">Related models</h3><div class="row g-3">${rel.map(modelCard).join('')}</div>`:''}`;
 let s=modelImgs(m);while(s.length<4)s.push({src:'',alt:`${m.name}, photo ${s.length+1}`});carousel($('#cr'),s.slice(0,5))}
function historyPage(){$('#tl').innerHTML=TIMELINE.map((t,i)=>`<button role="tab" data-i="${i}">${t.y}</button>`).join('');
 const tp=i=>{const t=TIMELINE[i];$('#tlPanel').innerHTML=`<h3>${t.y}: ${t.t}</h3><p>${t.x}</p>`;$$('#tl button').forEach((b,j)=>{b.classList.toggle('on',i===j);b.setAttribute('aria-selected',i===j)})};
 const tl=$('#tl'),pn=$('#tlPanel'),mq=matchMedia('(max-width:767.98px)');let at=0;
 const place=()=>{const b=$$('#tl button')[at];if(mq.matches&&b)b.after(pn);else tl.after(pn)};
 const go=i=>{at=i;tp(i);place()};
 tl.onclick=e=>{const b=e.target.closest('button');if(b)go(+b.dataset.i)};(mq.addEventListener?mq.addEventListener('change',place):mq.addListener(place));go(0);$('#logos').innerHTML=LOGOS.map(l=>`<li><b>${l[0]}</b><span>${l[1]}</span></li>`).join('')}
function mPage(){$('#m4gens').innerHTML=M4_GENS.map(g=>`<div class="col-md-4"><div class="card-m"><div class="tx"><small>${g[1]}</small><h4>${g[0]}</h4><p>${g[2]}</p></div></div></div>`).join('');
 $('#m4imgs').innerHTML=[['m4-studio','M4 studio'],['carbon','Carbon roof'],['brakes','Carbon-ceramic brakes'],['m4-gt3','M4 GT3']].map(a=>`<div class="col-6 col-md-3"><div class="frame">${img(a[0],a[1])}</div></div>`).join('')}
async function threePage(){const L=MODELS.filter(x=>x.model3d),list=$('#threeList'),v=$('#viewer');
 if(!L.length){v.hidden=false;list.innerHTML='';return}
 v.hidden=true;list.innerHTML=L.map(x=>`<div class="col-md-4"><button class="card-m" data-s="${x.slug}"><div class="tx"><small>${esc(x.gen)}</small><h4>${esc(x.name)}</h4><p>Open 3D viewer</p></div></button></div>`).join('');
 const open=async s=>{const x=bySlug(s);if(!x)return;const host=$('#stage');host.hidden=false;host.textContent='Loading 3D model...';$('#stageTitle').textContent=x.name;
  const gl=(()=>{try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}})();
  if(!gl){host.textContent='3D needs WebGL, which this browser or device does not provide. The model details pages still work.';return}
  try{const {mountViewer}=await import('./viewer.js');mountViewer(host,x.model3d,()=>{host.textContent='This model file could not be loaded. Check the path in models.js.'})}catch(e){host.textContent='The 3D viewer needs a web server and an internet connection for Three.js.'}host.scrollIntoView({behavior:'smooth',block:'nearest'})};
 list.onclick=e=>{const b=e.target.closest('[data-s]');if(b)open(b.dataset.s)};const q=new URLSearchParams(location.search).get('model');if(q&&L.some(x=>x.slug===q))open(q)}
function galleryPage(){let cur=[],gi=0;const lb=new bootstrap.Modal('#lightbox'),show=c=>{cur=GALLERY.filter(g=>c==='All'||g.c.includes(c));$('#galGrid').innerHTML=cur.map((g,i)=>`<div class="col-6 col-md-4 col-lg-3"><button class="gal" data-g="${i}" aria-label="Open ${esc(g.t)}">${img(g.k,g.t)}<span>${esc(g.t)}</span></button></div>`).join('')};
 chips($('#galChips'),GAL_CATS,show);show('All');
 const ls=i=>{gi=(i+cur.length)%cur.length;const g=cur[gi],s=imgSrc(g.k);$('#lbImg').src=s;$('#lbImg').alt=g.t;$('#lbCap').textContent=`${g.t} (${gi+1}/${cur.length})`};
 $('#galGrid').onclick=e=>{const b=e.target.closest('.gal');if(b&&imgSrc(cur[+b.dataset.g].k)){ls(+b.dataset.g);lb.show()}};$('#lbPrev').onclick=()=>ls(gi-1);$('#lbNext').onclick=()=>ls(gi+1);
 let sx=null;const lbx=$('#lightbox');lbx.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});lbx.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)ls(gi+(dx<0?1:-1))},{passive:true});
 addEventListener('keydown',e=>{if(!$('#lightbox').classList.contains('show'))return;if(e.key==='ArrowLeft')ls(gi-1);if(e.key==='ArrowRight')ls(gi+1)})}
