(()=>{
 const THREE_URL='https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
 const SPOT={home:'Go deeper',m:'Motorsport connections'};      /* the band goes right before this heading */
 const page=document.body.dataset.page;if(!SPOT[page])return;
 const hasGL=(()=>{try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}})();
 if(!hasGL||!('IntersectionObserver' in window))return;
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const modeNow=()=>document.documentElement.dataset.mode||'sport';

 document.addEventListener('DOMContentLoaded',()=>{
  const h=[...document.querySelectorAll('main h3')].find(n=>n.textContent.trim()===SPOT[page]);if(!h)return;
  const band=document.createElement('div');band.className='fx-band';band.setAttribute('aria-hidden','true');h.parentNode.insertBefore(band,h);
  let started=false,vis=false,kick=()=>{};
  const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!started){started=true;load()}if(vis)kick()},{rootMargin:'300px 0px'});io.observe(band);

  function load(){import(THREE_URL).then(build).catch(()=>band.remove())}

  function build(THREE){
   const small=matchMedia('(pointer:coarse)').matches||innerWidth<768;
   let r;try{r=new THREE.WebGLRenderer({antialias:!small,alpha:true,powerPreference:'low-power'})}catch(e){band.remove();return}
   r.setPixelRatio(Math.min(devicePixelRatio||1,small?1.25:1.75));r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
   r.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();band.remove()});
   band.append(r.domElement);

   const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(26,2,.1,50);cam.position.set(0,0,9);

   /* tiny studio for reflections */
   const pm=new THREE.PMREMGenerator(r),env=new THREE.Scene();
   env.add(new THREE.Mesh(new THREE.SphereGeometry(10,24,12),new THREE.MeshBasicMaterial({color:0x0b0e14,side:THREE.BackSide})));
   const panel=(w,hh,px,py,pz,c)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,hh),new THREE.MeshBasicMaterial({color:new THREE.Color(c,c,c),side:THREE.DoubleSide}));m.position.set(px,py,pz);m.lookAt(0,0,0);env.add(m)};
   panel(8,2,0,6,2,6);panel(2,6,-6,0,3,4);panel(2,6,6,0,3,3);panel(6,1.5,0,-5,4,1.5);
   scene.environment=pm.fromScene(env,.03).texture;pm.dispose();

   const key=new THREE.DirectionalLight(0xffffff,2),edge=new THREE.DirectionalLight(0x2f8cff,1.5);key.position.set(3,4,6);edge.position.set(-5,1,-2);scene.add(key,edge,new THREE.AmbientLight(0xffffff,.2));

   const std=(c,m,ro,ei)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:ro,envMapIntensity:ei==null?1.2:ei});
   const mat={tyre:std(0x0d0d0f,0,.9,.35),rim:std(0xcfd8e3,.95,.28),disc:std(0x6a707a,.85,.45),cal:std(0x0066B1,.3,.4),acc:std(0x0066B1,.2,.4),hub:std(0x9aa4b0,.9,.3),
    ring:new THREE.MeshBasicMaterial({color:0xE51A24,transparent:true,opacity:0})};

   const pivot=new THREE.Group(),wheel=new THREE.Group();pivot.add(wheel);scene.add(pivot);pivot.rotation.set(.06,-.62,0);
   const add=(g,m,fn)=>{const o=new THREE.Mesh(g,m);fn&&fn(o);wheel.add(o);return o};
   add(new THREE.TorusGeometry(1.18,.34,18,64),mat.tyre,o=>o.scale.z=1.25);                                  /* tyre */
   add(new THREE.TorusGeometry(.86,.06,12,64),mat.rim,o=>o.position.z=.22);                                 /* rim lip */
   add(new THREE.CylinderGeometry(.84,.84,.5,48,1,true),mat.rim,o=>{o.rotation.x=Math.PI/2;o.material.side=THREE.DoubleSide});   /* barrel */
   add(new THREE.CylinderGeometry(.52,.52,.06,40),mat.rim,o=>{o.rotation.x=Math.PI/2;o.position.z=.06});     /* dish behind the spokes */
   for(let i=0;i<10;i++){const a=i/10*Math.PI*2;add(new THREE.BoxGeometry(.13,.76,.07),mat.rim,o=>{o.position.set(Math.cos(a)*.5,Math.sin(a)*.5,.16);o.rotation.z=a-Math.PI/2})}   /* ten spokes */
   add(new THREE.CylinderGeometry(.17,.17,.12,32),mat.hub,o=>{o.rotation.x=Math.PI/2;o.position.z=.2});      /* hub cap */
   add(new THREE.TorusGeometry(.12,.018,8,32),mat.acc,o=>o.position.z=.27);                                  /* accent ring */
   add(new THREE.CylinderGeometry(.74,.74,.05,64),mat.disc,o=>{o.rotation.x=Math.PI/2;o.position.z=-.08});   /* brake disc */
   const cal=new THREE.Mesh(new THREE.BoxGeometry(.34,.56,.2),mat.cal);cal.position.set(.62,-.16,-.02);pivot.add(cal);   /* caliper (does not spin) */
   const ring=new THREE.Mesh(new THREE.TorusGeometry(1.85,.012,6,96),mat.ring),ring2=new THREE.Mesh(new THREE.TorusGeometry(1.7,.008,6,96),mat.ring);
   ring.rotation.x=ring2.rotation.x=.0;pivot.add(ring,ring2);                                               /* telemetry rings (track only) */

   /* per-mode look and feel */
   const LOOK={
    comfort:{rim:0xcfd8e3,ro:.26,cal:0xaab6c4,acc:0x9fd3f5,edge:0xbfd6ee,ei:1,key:1.9,spin:.0022,ent:2,ring:0},
    sport:{rim:0x2c3138,ro:.34,cal:0x0a6fc0,acc:0xE51A24,edge:0x2f8cff,ei:2.2,key:2.4,spin:.0042,ent:1.3,ring:0},
    track:{rim:0x111114,ro:.5,cal:0xE51A24,acc:0xE51A24,edge:0xff2a35,ei:2.6,key:2,spin:.0068,ent:.9,ring:.9}};
   let L=LOOK[modeNow()]||LOOK.sport;
   const applyLook=()=>{L=LOOK[modeNow()]||LOOK.sport;mat.rim.color.setHex(L.rim);mat.rim.roughness=L.ro;mat.cal.color.setHex(L.cal);mat.acc.color.setHex(L.acc);
    edge.color.setHex(L.edge);edge.intensity=L.ei;key.intensity=L.key;mat.ring.opacity=L.ring;ring.visible=ring2.visible=L.ring>0};
   applyLook();

   const fit=()=>{const w=band.clientWidth,hh=band.clientHeight;if(!w||!hh)return;r.setSize(w,hh,false);cam.aspect=w/hh;cam.updateProjectionMatrix();draw()};
   /* state */
   let rot=0,ent=still?1:0,t0=0,raf=0;
   const easeOut=t=>1-Math.pow(1-t,3);
   const draw=()=>{wheel.rotation.z=rot;ring.rotation.z=-rot*.35;ring2.rotation.z=rot*.2;const e=easeOut(ent);pivot.scale.setScalar(.86+.14*e);r.render(scene,cam)};
   const loop=now=>{raf=0;if(!vis||document.hidden)return;
    if(ent<1){if(!t0)t0=now;ent=Math.min(1,(now-t0)/1000/L.ent)}
    const want=still?0:(-scrollY*L.spin-(1-easeOut(ent))*9);rot+=(want-rot)*.16;draw();
    if(ent<1||Math.abs(want-rot)>.0008)raf=requestAnimationFrame(loop)};
   kick=()=>{band.classList.add('in');if(!raf)raf=requestAnimationFrame(loop)};
   addEventListener('scroll',()=>{if(vis&&!still)kick()},{passive:true});
   document.addEventListener('visibilitychange',()=>{if(!document.hidden&&vis)kick()});
   document.addEventListener('bmw:mode',()=>{applyLook();if(vis){if(!raf)raf=requestAnimationFrame(loop)}else draw()});
   new ResizeObserver(fit).observe(band);fit();if(vis)kick()}
 });
})();
