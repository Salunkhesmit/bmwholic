(()=>{const $=s=>document.querySelector(s),root=document.documentElement,body=document.body,v=$('#introVideo'),credit=$('#credit'),cover=$('#cover'),intro=$('#home');
 /* Skip only for in-site navigation (link/back from another BMWorld page). Reload, hard refresh, typed URL, bookmark or new tab always replay. */
 let seen=false;try{const nav=(performance.getEntriesByType('navigation')[0]||{}).type;let ref=false;try{ref=!!document.referrer&&new URL(document.referrer).origin===location.origin}catch(e){}
  seen=nav==='back_forward'||(nav==='navigate'&&ref)}catch(e){}
 let unlocked=false,started=false,playing=false;
 /* ---- responsive sources ---- */
 const SRC={land:{video:'bmworld-intro.mp4',poster:'intro-final-frame.jpg'},port:{video:'bmworld-intro-mobile.mp4',poster:'intro-final-frame-mobile.jpg'}};
 const mqPortrait=matchMedia('(orientation:portrait)');let mode=mqPortrait.matches?'port':'land',portOK=true;   /* portOK=false once the mobile file failed */
 const cur=()=>portOK?SRC[mode]:SRC.land,poster=()=>cur().poster;
 const still=img=>{img.onerror=()=>{if(img.getAttribute('src')!==SRC.land.poster){img.onerror=null;intro.classList.remove('vid-port');img.src=SRC.land.poster}}};
 function unlock(){if(unlocked)return;unlocked=true;
  if(!v.ended){v.pause();v.poster=poster()}                 /* failure path: show the final frame */
  credit.remove();cover.remove();body.classList.add('ended');root.classList.remove('locked');
  document.dispatchEvent(new Event('bmw:intro-end'))}       /* the mascot waits for this before it starts */
 if(seen){intro.classList.toggle('vid-port',mode==='port');const i=new Image();still(i);i.src=poster();i.alt='';i.className='intro-still';v.replaceWith(i);unlocked=false;v.ended=true;unlock();return}
 const block=e=>{if(!unlocked)e.preventDefault()},KEYS=['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Spacebar'];
 addEventListener('wheel',block,{passive:false});addEventListener('touchmove',block,{passive:false});
 addEventListener('keydown',e=>{if(!unlocked&&KEYS.includes(e.key))e.preventDefault()});
 root.classList.add('locked');try{history.scrollRestoration='manual'}catch(e){}scrollTo(0,0);
 const setVideo=(keepTime)=>{const t=keepTime?v.currentTime:0,was=keepTime&&!v.paused;intro.classList.toggle('vid-port',portOK&&mode==='port');
  v.src=cur().video;v.load();if(keepTime)v.addEventListener('loadedmetadata',()=>{try{v.currentTime=t}catch(e){}if(was){const p=v.play();if(p&&p.catch)p.catch(()=>{})}},{once:true})};
 v.addEventListener('playing',()=>{started=true},{once:true});v.addEventListener('ended',unlock);
 v.addEventListener('error',()=>{if(mode==='port'&&portOK&&!unlocked){portOK=false;setVideo(false);if(playing)v.play().catch(unlock);return}unlock()});   /* mobile file missing -> landscape video */
 const swap=()=>{const m=mqPortrait.matches?'port':'land';if(m===mode||unlocked)return;mode=m;setVideo(started)};   /* orientation / viewport change */
 (mqPortrait.addEventListener?mqPortrait.addEventListener('change',swap):mqPortrait.addListener(swap));
 setVideo(false);
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 /* Opening: the developer credit fades in, stays fully visible for ~1s, glides away, then the intro video starts (always muted: no engine audio autoplays). */
 async function run(){
  v.muted=true;
  await wait(250);credit.classList.add('show');          /* fade in (0.5s) */
  await wait(500+1000);credit.classList.add('out');      /* ~1s fully visible, then the exit transition */
  await wait(700);                                       /* exit finishes before the video appears */
  cover.classList.add('gone');playing=true;
  const p=v.play();if(p&&p.catch)p.catch(unlock);        /* autoplay refused -> show the final frame instead of a stuck screen */
  setTimeout(()=>{if(!started)unlock()},6000)}
 run()})();
