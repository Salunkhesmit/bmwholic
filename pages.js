/* Page logic, selected by <body data-page="...">. */
document.addEventListener('DOMContentLoaded',()=>{const P={home:homePage,models:modelsPage,model:modelPage,history:historyPage,m:mPage,'3d':threePage,gallery:galleryPage,compare:comparePage,quiz:quizPage};(P[document.body.dataset.page]||(()=>{}))()});
function homePage(){const f=$('#featured');if(f)f.innerHTML=['m4-competition','e30-m3','3-0-csl','i8-roadster'].map(s=>modelCard(bySlug(s))).join('')}
function modelsPage(){const g=$('#modelGrid'),p=new URLSearchParams(location.search).get('cat'),L=['All',...CATS],st=Math.max(0,L.indexOf(p));
 const show=c=>{const l=MODELS.filter(x=>c==='All'||x.cat===c);g.innerHTML=l.map(modelCard).join('');$('#modelEmpty').classList.toggle('d-none',l.length>0)};
 chips($('#modelChips'),L,show,st);show(L[st])}
function modelPage(){const root=$('#modelRoot'),m=bySlug(new URLSearchParams(location.search).get('model'));
 if(!m){root.innerHTML='<h1>Model not found</h1><p class="lead">That model is not in the catalogue.</p><a class="btn btn-m" href="models.html">Back to models</a>';return}
 document.title=m.name+' | BMWorld';
 const grp=(t,rows)=>`<section class="sg"><h3>${t}</h3><dl>${rows.map(r=>`<div><dt>${r[0]}</dt><dd>${spec(r[1])}</dd></div>`).join('')}</dl></section>`;
 const li=a=>a&&a.length?`<ul class="bul">${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
 const rel=(m.rel||[]).map(bySlug).filter(Boolean);
 root.innerHTML=`<nav class="crumb"><a href="models.html">Models</a> / <a href="models.html?cat=${encodeURIComponent(m.cat)}">${esc(m.cat)}</a> / ${esc(m.name)}</nav>
 <div class="row g-4 g-xl-5"><div class="col-lg-6 col-xl-7"><div class="cr" id="cr" aria-roledescription="carousel" aria-label="${esc(m.name)} photos"></div></div>
 <div class="col-lg-6 col-xl-5"><small class="tag">${esc(m.cat)} · ${esc(m.gen)} · ${esc(m.years)}</small><h1>${esc(m.name)}</h1><p class="lead">${esc(m.intro)}</p>
 <div class="d-flex gap-2 flex-wrap mb-3">${m.model3d?`<a class="btn btn-m" href="3d-experience.html?model=${m.slug}">View in 3D</a>`:''}<a class="btn btn-glass" href="compare.html?a=${m.slug}">Compare</a></div>
 ${grp('Identity',[['Generation',m.gen],['Chassis code',m.chassis],['Production',m.years]])}
 ${grp('Engine',[['Configuration',m.e],['Engine code',m.ec],['Displacement',m.dp]])}
 ${grp('Performance',[['Power',m.pw],['Torque',m.tq],['Top speed',m.ts],['Acceleration',m.ac]])}
 ${grp('Drivetrain',[['Transmission',m.tr],['Drive',m.dr]])}
 ${m.o&&m.o.length?grp('Other',m.o):''}</div></div>
 <div class="row g-4 mt-2"><div class="col-lg-6"><h3>Historical background</h3><p>${esc(m.hist)}</p></div><div class="col-lg-3"><h3>Interesting facts</h3>${li(m.facts)}</div><div class="col-lg-3"><h3>Engineering features</h3>${li(m.feat)}</div></div>
 <p class="note mt-3">"To be added" means the figure has not been verified yet. Edit it in models.js.</p>
 ${rel.length?`<h3 class="mt-5 mb-3">Related models</h3><div class="row g-3">${rel.map(modelCard).join('')}</div>`:''}`;
 let s=modelImgs(m);while(s.length<4)s.push({src:'',alt:`${m.name}, photo ${s.length+1}`});carousel($('#cr'),s.slice(0,5))}
function historyPage(){$('#tl').innerHTML=TIMELINE.map((t,i)=>`<button role="tab" data-i="${i}">${t.y}</button>`).join('');
 const tp=i=>{const t=TIMELINE[i];$('#tlPanel').innerHTML=`<h3>${t.y}: ${t.t}</h3><p>${t.x}</p>`;$$('#tl button').forEach((b,j)=>{b.classList.toggle('on',i===j);b.setAttribute('aria-selected',i===j)})};
 $('#tl').onclick=e=>{const b=e.target.closest('button');if(b)tp(+b.dataset.i)};tp(0);$('#logos').innerHTML=LOGOS.map(l=>`<li><b>${l[0]}</b><span>${l[1]}</span></li>`).join('')}
function mPage(){$('#m4gens').innerHTML=M4_GENS.map(g=>`<div class="col-md-4"><div class="card-m"><div class="tx"><small>${g[1]}</small><h4>${g[0]}</h4><p>${g[2]}</p></div></div></div>`).join('');
 $('#m4imgs').innerHTML=[['m4-studio','M4 studio'],['carbon','Carbon roof'],['brakes','Carbon-ceramic brakes'],['m4-gt3','M4 GT3']].map(a=>`<div class="col-6 col-md-3"><div class="frame">${img(a[0],a[1])}</div></div>`).join('')}
async function threePage(){const L=MODELS.filter(x=>x.model3d),list=$('#threeList'),v=$('#viewer');
 if(!L.length){v.hidden=false;list.innerHTML='';return}
 v.hidden=true;list.innerHTML=L.map(x=>`<div class="col-md-4"><button class="card-m" data-s="${x.slug}"><div class="tx"><small>${esc(x.gen)}</small><h4>${esc(x.name)}</h4><p>Open 3D viewer</p></div></button></div>`).join('');
 const open=async s=>{const x=bySlug(s);if(!x)return;const host=$('#stage');host.hidden=false;host.textContent='Loading 3D model...';$('#stageTitle').textContent=x.name;
  try{const {mountViewer}=await import('./viewer.js');mountViewer(host,x.model3d,()=>{host.textContent='This model file could not be loaded. Check the path in models.js.'})}catch(e){host.textContent='The 3D viewer needs a web server and an internet connection for Three.js.'}host.scrollIntoView({behavior:'smooth',block:'nearest'})};
 list.onclick=e=>{const b=e.target.closest('[data-s]');if(b)open(b.dataset.s)};const q=new URLSearchParams(location.search).get('model');if(q&&L.some(x=>x.slug===q))open(q)}
function galleryPage(){let cur=[],gi=0;const lb=new bootstrap.Modal('#lightbox'),show=c=>{cur=GALLERY.filter(g=>c==='All'||g.c.includes(c));$('#galGrid').innerHTML=cur.map((g,i)=>`<div class="col-6 col-lg-3"><button class="gal" data-g="${i}" aria-label="Open ${esc(g.t)}">${img(g.k,g.t)}<span>${esc(g.t)}</span></button></div>`).join('')};
 chips($('#galChips'),GAL_CATS,show);show('All');
 const ls=i=>{gi=(i+cur.length)%cur.length;const g=cur[gi],s=imgSrc(g.k);$('#lbImg').src=s;$('#lbImg').alt=g.t;$('#lbCap').textContent=`${g.t} (${gi+1}/${cur.length})`};
 $('#galGrid').onclick=e=>{const b=e.target.closest('.gal');if(b&&imgSrc(cur[+b.dataset.g].k)){ls(+b.dataset.g);lb.show()}};$('#lbPrev').onclick=()=>ls(gi-1);$('#lbNext').onclick=()=>ls(gi+1);
 addEventListener('keydown',e=>{if(!$('#lightbox').classList.contains('show'))return;if(e.key==='ArrowLeft')ls(gi-1);if(e.key==='ArrowRight')ls(gi+1)})}
