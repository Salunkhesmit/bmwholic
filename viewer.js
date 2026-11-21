/* Real Three.js viewer (ES module, loaded only when a model has `model3d` set). Mouse wheel is NOT captured so the page keeps scrolling. */
import*as THREE from'three';import{GLTFLoader}from'three/addons/loaders/GLTFLoader.js';import{OrbitControls}from'three/addons/controls/OrbitControls.js';
export function mountViewer(host,url,onErr){
 const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));host.replaceChildren(r.domElement);
 const s=new THREE.Scene(),c=new THREE.PerspectiveCamera(40,1,.1,200);s.add(new THREE.HemisphereLight(0xffffff,0x202030,1.6));const d=new THREE.DirectionalLight(0xffffff,2);d.position.set(5,8,5);s.add(d);
 const k=new OrbitControls(c,r.domElement);k.enableDamping=true;k.enableZoom=false;k.enablePan=false;r.domElement.style.touchAction='pan-y';
 new GLTFLoader().load(url,g=>{const b=new THREE.Box3().setFromObject(g.scene),z=b.getSize(new THREE.Vector3()).length(),ctr=b.getCenter(new THREE.Vector3());g.scene.position.sub(ctr);s.add(g.scene);c.position.set(z*.8,z*.35,z*.8);k.update()},undefined,onErr);
 const fit=()=>{const w=host.clientWidth,h=host.clientHeight||w*.56;r.setSize(w,h);c.aspect=w/h;c.updateProjectionMatrix()};new ResizeObserver(fit).observe(host);fit();
 r.setAnimationLoop(()=>{k.update();r.render(s,c)})}
