(()=>{
 const URL3='https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',page=document.body.dataset.page;
 if(page==='3d')return;
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,conn=navigator.connection||{};
 if(reduce||conn.saveData)return;
 const gl=(()=>{try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}})();
 if(!gl||(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2))return;
 const small=matchMedia('(pointer:coarse)').matches||innerWidth<768,KEY='bmw-fx',NEXT='bmw-fx-next',LAST='bmw-fx-last';
 const rd=k=>{try{return localStorage.getItem(k)}catch(e){return null}},wr=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
 let enabled=rd(KEY)!=='off',T=null,R=null,canvas=null,env=null,cap=null,scene=null,cam=null,cur=null,raf=0,running=false,dead=false,count=0,acc=0,ly=0,endAt=0,t0=0,lt=0;
 const mode=()=>document.documentElement.dataset.mode||'sport';
 const PAL={comfort:{a:0x9fd3f5,b:0xcfd8e3,r:0x9aa9bb},sport:{a:0x2f8cff,b:0x00A3E0,r:0xE51A24},track:{a:0xE51A24,b:0x2f8cff,r:0xff2a35}};
 const cl=(x,a,b)=>Math.min(b,Math.max(a,x)),lerp=(a,b,k)=>a+(b-a)*k,sm=k=>k*k*(3-2*k),eo=k=>1-Math.pow(1-k,3),ss=(t,a,b)=>sm(cl((t-a)/(b-a),0,1));
 const std=(c,m,r,e)=>new T.MeshStandardMaterial({color:c,metalness:m,roughness:r,envMapIntensity:e==null?1.3:e});
 const basic=(c,o)=>new T.MeshBasicMaterial(Object.assign({color:c},o||{}));
 const add=(o)=>({transparent:true,blending:T.AdditiveBlending,depthWrite:false,...(o||{})});
 const tex=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t};
 const glowTex=()=>tex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
 const streakTex=()=>tex(256,8,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h)});
 const sprite=(t,c,s)=>{const m=new T.Sprite(new T.SpriteMaterial({map:t,color:c,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));m.scale.set(s,s,1);return m};
 const vis=(d)=>{const h=2*d*Math.tan(cam.fov*Math.PI/360);return{w:h*cam.aspect,h}};
 const lights=(pal,k,r)=>{const a=new T.DirectionalLight(0xffffff,k||2.2),b=new T.DirectionalLight(pal.a,r||2.4);a.position.set(4,6,6);b.position.set(-6,2,-4);scene.add(a,b,new T.AmbientLight(0xffffff,.25))};
 const carbon=(x,w,h)=>{x.fillStyle='#07080b';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=8)for(let j=0;j<h;j+=8){x.fillStyle=((i+j)/8)%2?'rgba(255,255,255,.035)':'rgba(255,255,255,.012)';x.fillRect(i,j,8,8)}};

 /* scene 1: a coupe passing with speed trails */
 function carScene(pal){cam.fov=26;const por=cam.aspect<1;cam.position.set(0,1.3,por?19:11.5);cam.lookAt(0,por?2.7:2.2,0);lights(pal);
  const car=new T.Group(),body=new T.MeshPhysicalMaterial({color:0x0d2036,metalness:.85,roughness:.3,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.6}),glass=std(0x04070b,.9,.06,2.2),chrome=std(0xd5dde8,1,.12,1.6),dark=basic(0x020203);
  const sh=new T.Shape();sh.moveTo(-2.28,.34);sh.lineTo(-2.3,.62);sh.quadraticCurveTo(-2.3,.82,-2.1,.86);sh.lineTo(-1.2,.9);sh.lineTo(1.0,.92);sh.bezierCurveTo(1.4,.93,1.8,.9,2.05,.8);sh.bezierCurveTo(2.25,.76,2.32,.62,2.32,.5);sh.lineTo(2.28,.34);
  sh.lineTo(1.85,.34);sh.absarc(1.45,.34,.4,0,Math.PI,false);sh.lineTo(-1.0,.34);sh.absarc(-1.4,.34,.4,0,Math.PI,false);sh.lineTo(-2.28,.34);
  const bg=new T.ExtrudeGeometry(sh,{depth:1.6,bevelEnabled:true,bevelThickness:.07,bevelSize:.06,bevelSegments:3,curveSegments:20});bg.translate(0,0,-.8);car.add(new T.Mesh(bg,body));
  const gh=new T.Shape();gh.moveTo(-1.55,.9);gh.bezierCurveTo(-1.25,.97,-1.0,1.22,-.7,1.3);gh.bezierCurveTo(-.3,1.35,0,1.35,.25,1.31);gh.bezierCurveTo(.55,1.26,.8,1.05,.98,.92);gh.lineTo(-1.55,.9);
  const gg=new T.ExtrudeGeometry(gh,{depth:1.34,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:2,curveSegments:16});gg.translate(0,0,-.67);car.add(new T.Mesh(gg,body));
  const win=new T.Shape();win.moveTo(-1.4,.94);win.bezierCurveTo(-1.15,1.0,-.95,1.2,-.72,1.26);win.lineTo(.2,1.28);win.bezierCurveTo(.5,1.2,.72,1.02,.86,.95);win.lineTo(-1.4,.94);
  [1,-1].forEach(s=>{const w=new T.Mesh(new T.ShapeGeometry(win,12),glass);w.position.z=s*.745;w.material.side=T.DoubleSide;car.add(w);
   const tr=new T.Line(new T.BufferGeometry().setFromPoints(win.getPoints(20).map(p=>new T.Vector3(p.x,p.y,s*.75))),new T.LineBasicMaterial({color:0xd5dde8}));car.add(tr);
   [[.5,0x4aa8ff],[.512,0x14287a],[.524,0xE51A24]].forEach(([y,c])=>{const m=new T.Mesh(new T.PlaneGeometry(2.0,.011),basic(c));m.position.set(.02,y,s*.915);m.material.side=T.DoubleSide;car.add(m)})});   /* M tri-colour accent */
  const wheels=[];[[1.45,.8],[1.45,-.8],[-1.4,.8],[-1.4,-.8]].forEach(([x,z])=>{const g=new T.Group();g.position.set(x,.36,z);
   g.add(new T.Mesh(new T.TorusGeometry(.3,.11,14,36),std(0x0b0b0d,0,.9,.3)));const rim=new T.Mesh(new T.CylinderGeometry(.3,.3,.12,32),std(0xcfd8e3,.95,.25,1.6));rim.rotation.x=Math.PI/2;g.add(rim);
   for(let i=0;i<5;i++){const sp=new T.Mesh(new T.BoxGeometry(.05,.54,.05),std(0x9aa4b0,1,.2,1.6));sp.rotation.z=i/5*Math.PI*2;sp.position.z=z>0?.04:-.04;g.add(sp)}
   const hub=new T.Mesh(new T.CylinderGeometry(.07,.07,.14,16),chrome);hub.rotation.x=Math.PI/2;g.add(hub);car.add(g);wheels.push(g)});
  [1.45,-1.4].forEach(x=>{const w=new T.Mesh(new T.CylinderGeometry(.43,.43,1.5,24),dark);w.rotation.x=Math.PI/2;w.position.set(x,.36,0);car.add(w)});   /* dark wheel wells */
  const gt=glowTex();[1,-1].forEach(s=>{const r=new T.Mesh(new T.TorusGeometry(.075,.014,8,28),basic(0xdff1ff));r.rotation.y=Math.PI/2;r.position.set(2.27,.64,s*.55);car.add(r);
   const r2=r.clone();r2.position.y=.72;r2.scale.setScalar(.8);car.add(r2);const h=sprite(gt,0xbfe0ff,.55);h.position.set(2.32,.66,s*.55);car.add(h);
   const t=new T.Mesh(new T.BoxGeometry(.03,.07,.34),basic(0xff1020));t.position.set(-2.34,.7,s*.5);car.add(t);const tg=sprite(gt,0xff2030,.6);tg.position.set(-2.4,.7,s*.5);car.add(tg);
   const k=new T.Mesh(new T.BoxGeometry(.03,.17,.15),dark);k.position.set(2.345,.55,s*.1);car.add(k);const kf=new T.LineSegments(new T.EdgesGeometry(k.geometry),new T.LineBasicMaterial({color:0xd5dde8}));kf.position.copy(k.position);car.add(kf)});
  const beam=new T.Mesh(new T.ConeGeometry(.7,4,24,1,true),new T.MeshBasicMaterial(add({color:pal.b,opacity:.05,side:T.DoubleSide})));beam.rotation.z=-Math.PI/2;beam.position.set(4.3,.62,0);car.add(beam);
  const st=streakTex(),m1=new T.MeshBasicMaterial(add({map:st,color:pal.a,opacity:.9})),m2=new T.MeshBasicMaterial(add({map:st,color:0xffffff,opacity:.6})),trail=new T.Group(),pg=new T.PlaneGeometry(1,1);pg.translate(-.5,0,0);
  for(let i=0;i<(small?18:34);i++){const s=new T.Mesh(pg,i%3?m1:m2);s.scale.set(2+Math.random()*8,.012+Math.random()*.03,1);s.position.set(-2.4-Math.random()*.4,.2+Math.random()*1.0,(Math.random()-.5)*1.7);s.userData.k=.6+Math.random()*.8;trail.add(s)}
  car.add(trail);   /* the streaks stay attached behind the car */
  const blob=new T.Mesh(new T.PlaneGeometry(6,1.5),new T.MeshBasicMaterial({map:gt,color:0x000000,transparent:true,opacity:.6,depthWrite:false}));blob.rotation.x=-Math.PI/2;blob.position.y=.01;car.add(blob);
  car.rotation.y=-.17;scene.add(car);let px=-12;
  return{dur:small?3.6:3.2,update(t,p,dt){const x=-12+24*(.3*p+.7*sm(p)),v=(x-px)/Math.max(dt,.001);px=x;car.position.x=x;car.position.y=Math.sin(t*38)*.004;
   wheels.forEach(w=>w.rotation.z-=v*dt/.41);trail.children.forEach(s=>{s.scale.x*=1+(Math.random()-.5)*.08;s.material.opacity=.5+.5*Math.sin(t*9*s.userData.k)});cam.position.x=lerp(-.4,.4,p)}}}

 /* scene 2: speedometer + tachometer */
 function gauge(o){const g=new T.Group(),S=768,face=tex(S,S,(x)=>{const c=S/2,R=S*.47;carbon(x,S,S);const rg=x.createRadialGradient(c,c,0,c,c,c);rg.addColorStop(0,'rgba(20,26,36,.9)');rg.addColorStop(1,'rgba(0,0,0,.55)');x.fillStyle=rg;x.fillRect(0,0,S,S);
   const A=v=>(225-270*(v/o.max))*Math.PI/180;x.lineCap='round';
   for(let v=0;v<=o.max+1e-6;v+=o.minor){const a=A(v),maj=Math.abs(v/o.major-Math.round(v/o.major))<1e-6,red=v>=o.red;x.strokeStyle=red?'#ff2a35':(maj?'#e8f2ff':'#7f93a8');x.lineWidth=maj?7:3;const r1=R*(maj?.80:.86);x.beginPath();x.moveTo(c+Math.cos(a)*R*.94,c-Math.sin(a)*R*.94);x.lineTo(c+Math.cos(a)*r1,c-Math.sin(a)*r1);x.stroke();
    if(maj){x.fillStyle=red?'#ff5560':'#e8f0f8';x.font='600 '+Math.round(S*.058)+'px Outfit,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(Math.round(v/o.div)),c+Math.cos(a)*R*.64,c-Math.sin(a)*R*.64)}}
   x.fillStyle='#8fa3b8';x.font='500 '+Math.round(S*.04)+'px "JetBrains Mono",monospace';x.fillText(o.unit,c,c+R*.42);x.fillText(o.sub,c,c+R*.52);
   [['#4aa8ff',-1],['#14287a',0],['#E51A24',1]].forEach(([col,i])=>{x.fillStyle=col;x.fillRect(c+i*S*.045-S*.021,c+R*.66,S*.042,S*.012)})}),
  disc=new T.Mesh(new T.CircleGeometry(1,64),new T.MeshBasicMaterial({map:face}));g.add(disc);
  const bez=new T.Mesh(new T.TorusGeometry(1.0,.045,20,96),std(0xd5dde8,1,.18,1.8));g.add(bez);const in2=new T.Mesh(new T.TorusGeometry(.94,.012,8,96),new T.MeshBasicMaterial(add({color:o.pal.a,opacity:.8})));g.add(in2);
  const gl=new T.Mesh(new T.CircleGeometry(.97,48),new T.MeshStandardMaterial({color:0xffffff,metalness:1,roughness:.04,transparent:true,opacity:.07,envMapIntensity:2}));gl.position.z=.06;g.add(gl);
  const nd=new T.Group(),nb=new T.Mesh(new T.BoxGeometry(.035,.78,.012),basic(0xff5a1f));nb.position.y=.31;const tail=new T.Mesh(new T.BoxGeometry(.05,.16,.012),basic(0xff5a1f));tail.position.y=-.1;nd.add(nb,tail);nd.position.z=.04;g.add(nd);
  const cap2=new T.Mesh(new T.CylinderGeometry(.09,.09,.06,24),std(0xcfd8e3,1,.15,1.6));cap2.rotation.x=Math.PI/2;cap2.position.z=.06;g.add(cap2);
  g.userData.set=v=>{nd.rotation.z=(225-270*cl(v/o.max,0,1))*Math.PI/180-Math.PI/2};g.userData.set(0);return g}
 function gaugeScene(pal){cam.fov=30;cam.position.set(0,0,9);cam.lookAt(0,0,0);lights(pal,1.6,1.8);const V=vis(9),both=cam.aspect>1.1;
  const sp=gauge({max:300,minor:10,major:50,red:260,div:1,unit:'KM/H',sub:'',pal}),tc=gauge({max:8000,minor:500,major:1000,red:6500,div:1000,unit:'RPM',sub:'x 1000',pal}),grp=new T.Group();
  const sc=Math.min(V.h*.34,V.w*(both?.2:.34));sp.scale.setScalar(sc);tc.scale.setScalar(sc);
  if(both){sp.position.x=-sc*1.05;tc.position.x=sc*1.05;sp.rotation.y=.22;tc.rotation.y=-.22;grp.add(sp,tc)}else grp.add(tc);
  grp.position.set(both?V.w*.2:0,-V.h*.2,0);scene.add(grp);
  const rpm=t=>{const k=t-.9;if(k<0)return .0;if(k<.8)return 6.8*eo(k/.8);if(k<1.05)return lerp(6.8,4.6,sm((k-.8)/.25));if(k<2)return lerp(4.6,7,sm((k-1.05)/.95));if(k<2.25)return lerp(7,5,sm((k-2)/.25));if(k<3.3)return lerp(5,7.2,sm((k-2.25)/1.05));if(k<3.6)return lerp(7.2,3.2,sm((k-3.3)/.3));if(k<4.9)return 3.2+Math.sin(t*3)*.05;return lerp(3.2,.9,sm((k-4.9)/1))};
  return{dur:6.2,update(t,p){const a=eo(cl(t/.9,0,1));grp.scale.setScalar(.7+.3*a);grp.rotation.y=(1-a)*-.6+Math.sin(t*.6)*.05;grp.rotation.x=Math.sin(t*.5)*.03;
   let s=245*sm(cl((t-.9)/3.5,0,1));if(t>4.8)s=lerp(245,120,sm((t-4.8)/1.4));tc.userData.set(rpm(t)*1000+Math.sin(t*40)*30*(t>.9?1:0));sp.userData.set(s)}}}

 /* scene 3: inline-six crank and pistons */
 function engineScene(pal){cam.fov=28;cam.position.set(0,0,12);cam.lookAt(0,0,0);lights(pal,2,2.6);const V=vis(12),grp=new T.Group(),inner=new T.Group();grp.add(inner);
  const chrome=std(0xdfe6ee,1,.16,1.6),steel=std(0x8a929e,.95,.3,1.3),wire=new T.LineBasicMaterial({color:pal.a,transparent:true,opacity:.35}),gt=glowTex();
  const r=.42,L=1.5,sp=.82,phi=[0,240,120,120,240,0].map(d=>d*Math.PI/180),X=i=>(i-2.5)*sp;
  const shaft=new T.Mesh(new T.CylinderGeometry(.13,.13,6,20),steel);shaft.rotation.z=Math.PI/2;inner.add(shaft);
  const box=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(5.5,3.3,1.5)),wire);box.position.y=.55;inner.add(box);
  const cams=new T.LineSegments(new T.EdgesGeometry(new T.CylinderGeometry(.09,.09,5.2,10)),wire);cams.rotation.z=Math.PI/2;cams.position.y=2.55;inner.add(cams);
  const cyl=[];for(let i=0;i<6;i++){const x=X(i),bore=new T.LineSegments(new T.EdgesGeometry(new T.CylinderGeometry(.34,.34,1.9,18,1,true)),wire);bore.position.set(x,.9,0);inner.add(bore);
   const pis=new T.Mesh(new T.CylinderGeometry(.3,.3,.34,24),chrome),rod=new T.Mesh(new T.BoxGeometry(.07,1,.07),steel),pin=new T.Mesh(new T.CylinderGeometry(.14,.14,.1,16),steel),fl=sprite(gt,0xffb070,1.1);
   pin.rotation.z=Math.PI/2;fl.material.opacity=0;inner.add(pis,rod,pin,fl);
   const web1=new T.Mesh(new T.CylinderGeometry(.34,.34,.07,20),steel);web1.rotation.z=Math.PI/2;web1.position.x=x-.2;const web2=web1.clone();web2.position.x=x+.2;inner.add(web1,web2);
   cyl.push({x,pis,rod,pin,fl,i,web1,web2})}
  grp.scale.setScalar(Math.min(1,V.w*.5/5.6,V.h*.55/3.6));grp.position.set(V.w*.2,-V.h*.12,0);scene.add(grp);let th=0;
  return{dur:6,update(t,p,dt){const a=eo(cl(t/.8,0,1));const w=lerp(4,24,ss(t,.5,3.4))*(1-.55*ss(t,4.6,6));th+=w*dt;inner.rotation.y=lerp(.5,-.25,sm(p));inner.rotation.x=.3;inner.position.y=(1-a)*-1;
   cyl.forEach(c=>{const ang=th+phi[c.i],yc=r*Math.cos(ang),zc=r*Math.sin(ang),yp=yc+Math.sqrt(L*L-zc*zc);
    c.pis.position.set(c.x,yp+.17,0);c.pin.position.set(c.x,yp,0);c.rod.scale.y=L;c.rod.position.set(c.x,(yc+yp)/2,zc/2);c.rod.rotation.x=Math.atan2(-zc,yp-yc);
    const ph=((ang%(4*Math.PI))+4*Math.PI)%(4*Math.PI);c.fl.position.set(c.x,yp+.55,0);c.fl.material.opacity=ph<.9?(1-ph/.9)*.9*cl(w/12,0,1):0;
    c.web1.position.y=yc*.5;c.web2.position.y=yc*.5;c.web1.position.z=zc*.5;c.web2.position.z=zc*.5})}}}

 /* scene 4: illustrative circuit lap */
 function circuitScene(pal){cam.fov=32;cam.position.set(0,6.4,6.4);cam.lookAt(0,0,.2);lights(pal,1.6,2);const V=vis(9);
  const P=[[-3.4,-1],[-2,-1.6],[.2,-1.55],[1.8,-1.2],[2.6,-1.7],[3.6,-1],[3.7,.2],[2.9,.8],[1.7,.5],[1,1.2],[1.9,1.9],[.6,2],[-.8,1.5],[-1.2,.5],[-2.4,.9],[-3.5,.4]].map(p=>new T.Vector3(p[0],0,p[1])),curve=new T.CatmullRomCurve3(P,true,'centripetal');
  const grp=new T.Group(),tube=new T.TubeGeometry(curve,260,.06,6,true),tm=new T.Mesh(tube,std(0x232830,.7,.4,1.2)),total=tube.index.count;grp.add(tm);
  const line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(400)),new T.LineBasicMaterial(add({color:pal.a,opacity:.85})));line.position.y=.07;grp.add(line);
  const sf=new T.Mesh(new T.BoxGeometry(.04,.02,.34),basic(0xffffff));const p0=curve.getPointAt(0),tg=curve.getTangentAt(0);sf.position.copy(p0);sf.position.y=.07;sf.rotation.y=Math.atan2(-tg.z,tg.x);grp.add(sf);
  const gt=glowTex(),car=sprite(gt,0xffffff,.55),head=new T.Mesh(new T.SphereGeometry(.07,16,12),basic(0xffffff)),N=70,tp=new Float32Array(N*3),tc=new Float32Array(N*3),tgm=new T.BufferGeometry();
  tgm.setAttribute('position',new T.BufferAttribute(tp,3));tgm.setAttribute('color',new T.BufferAttribute(tc,3));const trail=new T.Line(tgm,new T.LineBasicMaterial({vertexColors:true,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));
  grp.add(car,head,trail);const sc=Math.min(1.25,V.w*(cam.aspect>1?.5:.95)/8);grp.scale.setScalar(sc);grp.position.set(V.w*(cam.aspect>1?.18:0),0,-V.h*.05);scene.add(grp);
  const col=new T.Color(pal.a),hist=[];tube.setDrawRange(0,0);line.geometry.setDrawRange(0,0);
  if(cap)cap.textContent='Illustrative circuit';
  return{dur:6.6,caption:true,update(t,p){const d=eo(cl(t/1.4,0,1));tube.setDrawRange(0,Math.floor(total*d));line.geometry.setDrawRange(0,Math.floor(401*d));grp.rotation.y=lerp(-.35,.25,sm(p));
   const lap=cl((t-1.1)/4.4,0,1),u=lap<1?(lap+.025*Math.sin(lap*Math.PI*6))%1:0,pt=curve.getPointAt(cl(u,0,.9999));pt.y=.1;head.position.copy(pt);car.position.copy(pt);head.visible=car.visible=t>1.1&&lap<1;
   if(lap>0&&lap<1){hist.unshift(pt.clone());if(hist.length>N)hist.pop()}
   for(let i=0;i<N;i++){const h=hist[Math.min(i,hist.length-1)]||pt,f=hist.length?1-i/N:0;tp[i*3]=h.x;tp[i*3+1]=h.y;tp[i*3+2]=h.z;tc[i*3]=col.r*f;tc[i*3+1]=col.g*f;tc[i*3+2]=col.b*f}
   tgm.attributes.position.needsUpdate=tgm.attributes.color.needsUpdate=true}}}

 /* scene 5: turbocharger compressor wheel */
 function turboScene(pal){cam.fov=30;cam.position.set(0,0,9);cam.lookAt(0,0,0);lights(pal,2.2,2.6);const V=vis(9),grp=new T.Group(),wheel=new T.Group(),chrome=std(0xdfe6ee,1,.14,1.8),gt=glowTex();
  const hub=new T.Mesh(new T.CylinderGeometry(.2,.24,.5,32),chrome);hub.rotation.x=Math.PI/2;wheel.add(hub);const nose=new T.Mesh(new T.ConeGeometry(.2,.35,32),chrome);nose.rotation.x=Math.PI/2;nose.position.z=.4;wheel.add(nose);
  for(let i=0;i<11;i++){const a=i/11*Math.PI*2,b=new T.Group(),bl=new T.Mesh(new T.BoxGeometry(.56,.012,.2),std(0xc3ccd8,1,.22,1.6));bl.position.x=.5;bl.rotation.x=.75;bl.rotation.z=.12;b.add(bl);b.rotation.z=a;wheel.add(b)}
  const ring=new T.Mesh(new T.TorusGeometry(.86,.04,16,80),chrome),out=new T.Mesh(new T.TorusGeometry(1.05,.07,16,80),std(0x23272f,.9,.35,1.2)),acc=new T.Mesh(new T.TorusGeometry(1.0,.012,8,96),new T.MeshBasicMaterial(add({color:pal.a,opacity:.9})));
  const halo=sprite(gt,pal.a,4.2);halo.position.z=-.3;grp.add(wheel,ring,out,acc,halo);
  const st=streakTex(),sm1=new T.MeshBasicMaterial(add({map:st,color:pal.b,opacity:.7})),pg=new T.PlaneGeometry(1,1);pg.translate(-.5,0,0);const air=[];
  for(let i=0;i<(small?10:18);i++){const s=new T.Mesh(pg,sm1);s.userData={a:Math.random()*6.28,r:1.15+Math.random()*.5,v:.8+Math.random()*.6};s.scale.set(.5+Math.random()*.6,.012,1);grp.add(s);air.push(s)}
  const sc=Math.min(V.h*.3,V.w*(cam.aspect>1?.18:.34));grp.scale.setScalar(sc);grp.position.set(cam.aspect>1?V.w*.2:0,-V.h*.14,0);grp.rotation.x=-.5;grp.rotation.y=.55;scene.add(grp);let th=0;
  return{dur:5,update(t,p,dt){const w=lerp(2,38,ss(t,.2,2.8))*(1-.6*ss(t,3.8,5));th+=w*dt;wheel.rotation.z=-th;const a=eo(cl(t/.7,0,1));grp.scale.setScalar(sc*(.8+.2*a));halo.material.opacity=cl(w/38,0,1)*.9;acc.material.opacity=.3+.6*cl(w/38,0,1);
   air.forEach(s=>{const u=s.userData;u.a-=w*.02*u.v*dt*10;const rr=u.r-(w/38)*.18;s.position.set(Math.cos(u.a)*rr,Math.sin(u.a)*rr,.1);s.rotation.z=u.a-Math.PI/2*-1+Math.PI/2*0})}}}

 const SCENES={car:carScene,gauge:gaugeScene,engine:engineScene,circuit:circuitScene,turbo:turboScene},ORDER=['car','gauge','engine','circuit','turbo'];
 if(window.__FXTEST)window.__FXTEST({SCENES,set:o=>{if(o.T)T=o.T;if(o.cam)cam=o.cam;if(o.scene)scene=o.scene},pal:PAL});
 /* renderer + director */
 function init(){canvas=document.createElement('canvas');canvas.className='fx-bg';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
  try{R=new T.WebGLRenderer({canvas,antialias:!small,alpha:true,powerPreference:'low-power'})}catch(e){dead=true;return false}
  R.setClearColor(0x000000,0);R.setPixelRatio(Math.min(devicePixelRatio||1,small?1:1.5));R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.1;
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();dead=true;finish(true)});
  const pm=new T.PMREMGenerator(R),es=new T.Scene();es.add(new T.Mesh(new T.SphereGeometry(10,24,12),new T.MeshBasicMaterial({color:0x0b0e14,side:T.BackSide})));
  const pn=(w,h,x,y,z,c)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(c,c,c),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);es.add(m)};
  pn(8,2,0,6,2,6);pn(2,6,-6,0,3,4);pn(2,6,6,0,3,3);pn(6,1.5,0,-5,4,1.5);env=pm.fromScene(es,.03).texture;pm.dispose();
  cap=document.createElement('div');cap.className='fx-cap';cap.setAttribute('aria-hidden','true');document.body.append(cap);
  addEventListener('resize',()=>{if(running)fit()});return true}
 function fit(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);if(cam){cam.aspect=w/h;cam.updateProjectionMatrix()}}
 function dispose(){if(!scene)return;scene.traverse(o=>{if(o.geometry)o.geometry.dispose();const m=o.material;(Array.isArray(m)?m:m?[m]:[]).forEach(x=>{if(x.map)x.map.dispose();x.dispose()})});scene=null;cam=null}
 function loop(now){raf=0;if(!running)return;if(document.hidden||dead){finish(true);return}if(!t0){t0=now;lt=now}const dt=Math.min(.05,(now-lt)/1000||.016);lt=now;const t=(now-t0)/1000,p=cl(t/cur.dur,0,1);
  try{cur.update(t,p,dt);R.render(scene,cam)}catch(e){console.warn('[BMWorld 3D] scene stopped:',e);dead=true;finish(true);return}
  if(p>=1&&!endAt){endAt=now+800;canvas.classList.remove('on');cap&&cap.classList.remove('on')}
  if(endAt&&now>=endAt){finish();return}raf=requestAnimationFrame(loop)}
 function finish(now){cancelAnimationFrame(raf);raf=0;running=false;canvas&&canvas.classList.remove('on');cap&&cap.classList.remove('on');const d=()=>{dispose();cur=null;endAt=0;t0=0;if(canvas)canvas.style.visibility='hidden'};now?d():setTimeout(d,0)}
 async function play(name){if(running||dead||!enabled)return;running=true;
  try{if(!T)T=await import(URL3);if(!R&&!init()){running=false;return}}catch(e){dead=true;running=false;return}
  if(document.hidden){running=false;return}
  scene=new T.Scene();scene.environment=env;cam=new T.PerspectiveCamera(30,innerWidth/innerHeight,.1,100);fit();canvas.style.visibility='visible';cap.className='fx-cap';
  try{cur=SCENES[name](PAL[mode()]||PAL.sport);cam.updateProjectionMatrix()}catch(e){console.warn('[BMWorld 3D] could not build',name,e);dead=true;finish(true);return}
  if(cur.caption)cap.classList.add('on');else cap.textContent='';
  endAt=0;t0=0;canvas.classList.add('on');wr(LAST,name);raf=requestAnimationFrame(loop)}
 const rnd=(a,b)=>a+Math.random()*(b-a),blocked=()=>document.body.classList.contains('has-intro')&&!document.body.classList.contains('ended')||document.querySelector('.modal.show')||(document.querySelector('.chat')&&!document.querySelector('.chat').hidden);
 function pick(){const last=rd(LAST),pool=ORDER.filter(n=>n!==last&&!(small&&n==='engine'&&false));return pool[Math.floor(Math.random()*pool.length)]}
 let nextAt=Math.max(+rd(NEXT)||0,Date.now()+rnd(15000,20000));
 function tick(){if(!enabled||dead||running||document.hidden||count>=5||blocked())return;if(Date.now()<nextAt||acc<400)return;acc=0;count++;nextAt=Date.now()+rnd(20000,30000);wr(NEXT,String(nextAt));play(pick())}
 document.addEventListener('DOMContentLoaded',()=>{
  ly=scrollY;addEventListener('scroll',()=>{acc+=Math.abs(scrollY-ly);ly=scrollY;tick()},{passive:true});setInterval(tick,3000);
  const dock=document.querySelector('.dock');if(dock){const b=document.createElement('button');b.id='dkFx';b.type='button';b.textContent='3D FX';b.setAttribute('aria-pressed',String(enabled));b.title='Occasional 3D animations: on/off';
   b.onclick=()=>{enabled=!enabled;wr(KEY,enabled?'on':'off');b.setAttribute('aria-pressed',String(enabled));if(!enabled&&running)finish(true)};dock.insertBefore(b,dock.querySelector('.ask')||null)}
  const q=new URLSearchParams(location.search).get('fx');    /* preview: ?fx=car|gauge|engine|circuit|turbo|all */
  if(q&&(q==='all'||SCENES[q])){enabled=true;const go=()=>{let i=0;const next=()=>{const n=q==='all'?ORDER[i++%ORDER.length]:q;play(n).then(()=>{if(q==='all')setTimeout(next,9000)})};setTimeout(next,1200)};
   if(blocked())document.addEventListener('bmw:intro-end',go,{once:true});else go()}});
})();
