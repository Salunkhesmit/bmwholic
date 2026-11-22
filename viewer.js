import*as THREE from'three';import{GLTFLoader}from'three/addons/loaders/GLTFLoader.js';import{OrbitControls}from'three/addons/controls/OrbitControls.js';
export function mountViewer(host,url,onErr){
 if(host._dispose)host._dispose();
 const small=matchMedia('(pointer:coarse)').matches||innerWidth<768,maxDpr=small?1.5:2;
 let r;try{r=new THREE.WebGLRenderer({antialias:!small,alpha:true,powerPreference:small?'low-power':'default'})}catch(e){onErr&&onErr(e);return}
 r.setPixelRatio(Math.min(devicePixelRatio||1,maxDpr));host.replaceChildren(r.domElement);
 const s=new THREE.Scene(),c=new THREE.PerspectiveCamera(40,1,.1,500);s.add(new THREE.HemisphereLight(0xffffff,0x202030,1.6));const d=new THREE.DirectionalLight(0xffffff,2);d.position.set(5,8,5);s.add(d);
 const k=new OrbitControls(c,r.domElement);k.enableDamping=true;k.enableZoom=false;k.enablePan=false;r.domElement.style.touchAction='pan-y';   /* horizontal drag rotates, vertical drag still scrolls the page */
 let size=1,loaded=false,dir=new THREE.Vector3(.8,.35,.8).normalize();
 const place=()=>{const a=c.aspect||1;c.fov=a<1?Math.min(75,40/Math.max(.55,a)):40;c.updateProjectionMatrix();const dist=size*(a<1?.95:.9)/Math.tan(c.fov*Math.PI/360)*.55;c.position.copy(dir).multiplyScalar(dist);k.update()};
 new GLTFLoader().load(url,g=>{const b=new THREE.Box3().setFromObject(g.scene),ctr=b.getCenter(new THREE.Vector3());size=b.getSize(new THREE.Vector3()).length()||1;g.scene.position.sub(ctr);s.add(g.scene);loaded=true;place()},undefined,onErr);
 let vis=true;const io='IntersectionObserver'in window?new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis&&!r.xr.isPresenting)loop()}):null;io&&io.observe(host);
 const fit=()=>{const w=host.clientWidth,h=host.clientHeight||w*.56;if(!w)return;r.setSize(w,h);c.aspect=w/h;if(loaded)place();else c.updateProjectionMatrix()};
 const ro=new ResizeObserver(fit);ro.observe(host);addEventListener('orientationchange',fit);fit();
 let raf=0;const loop=()=>{cancelAnimationFrame(raf);if(!vis||document.hidden)return;k.update();r.render(s,c);raf=requestAnimationFrame(loop)};
 const vc=()=>{if(!document.hidden)loop()};document.addEventListener('visibilitychange',vc);loop();
 host._dispose=()=>{cancelAnimationFrame(raf);vis=false;ro.disconnect();io&&io.disconnect();removeEventListener('orientationchange',fit);document.removeEventListener('visibilitychange',vc);k.dispose();r.dispose();host._dispose=null}}
