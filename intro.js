(()=>{const $=s=>document.querySelector(s),root=document.documentElement,body=document.body,v=$('#introVideo'),credit=$('#credit'),cover=$('#cover'),intro=$('#home');

 let seen=false;try{const nav=(performance.getEntriesByType('navigation')[0]||{}).type;let ref=false;try{ref=!!document.referrer&&new URL(document.referrer).origin===location.origin}catch(e){}
  seen=nav==='back_forward'||(nav==='navigate'&&ref)}catch(e){}
 let unlocked=false,started=false,playing=false,soundOK=false,pill=null,gate=null;
 /* responsive sources */
 const SRC={land:{video:'bmworld-intro.mp4',poster:'intro-final-frame.jpg'},port:{video:'bmworld-intro-mobile.mp4',poster:'intro-final-frame-mobile.jpg'}};
 const mqPortrait=matchMedia('(orientation:portrait)');let mode=mqPortrait.matches?'port':'land',portOK=true;
 const cur=()=>portOK?SRC[mode]:SRC.land,poster=()=>cur().poster;
 const still=img=>{img.onerror=()=>{if(img.getAttribute('src')!==SRC.land.poster){img.onerror=null;intro.classList.remove('vid-port');img.src=SRC.land.poster}}};
 function unlock(){if(unlocked)return;unlocked=true;
  if(!v.ended){v.pause();v.poster=poster()}
  if(pill)pill.remove();if(gate)gate.remove();credit.remove();cover.remove();body.classList.add('ended');root.classList.remove('locked');
  document.dispatchEvent(new Event('bmw:intro-end'))}       /* the mascot waits for this before it starts */
 if(seen){intro.classList.toggle('vid-port',mode==='port');const i=new Image();still(i);i.src=poster();i.alt='';i.className='intro-still';v.replaceWith(i);unlocked=false;v.ended=true;unlock();return}
 const block=e=>{if(!unlocked)e.preventDefault()},KEYS=['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Spacebar'];
 addEventListener('wheel',block,{passive:false});addEventListener('touchmove',block,{passive:false});
 addEventListener('keydown',e=>{if(!unlocked&&KEYS.includes(e.key))e.preventDefault()});
 root.classList.add('locked');try{history.scrollRestoration='manual'}catch(e){}scrollTo(0,0);
 const setVideo=(keepTime)=>{const t=keepTime?v.currentTime:0,was=keepTime&&!v.paused;intro.classList.toggle('vid-port',portOK&&mode==='port');
  v.src=cur().video;v.load();if(keepTime)v.addEventListener('loadedmetadata',()=>{try{v.currentTime=t}catch(e){}if(was){const p=v.play();if(p&&p.catch)p.catch(()=>{})}},{once:true})};
 v.addEventListener('playing',()=>{if(playing)started=true});   /* the silent unlock inside the sound gate does not count as the real start */v.addEventListener('ended',unlock);
 v.addEventListener('error',()=>{if(mode==='port'&&portOK&&!unlocked){portOK=false;setVideo(false);if(playing)v.play().catch(unlock);return}unlock()});
 const swap=()=>{const m=mqPortrait.matches?'port':'land';if(m===mode||unlocked)return;mode=m;setVideo(started)};
 (mqPortrait.addEventListener?mqPortrait.addEventListener('change',swap):mqPortrait.addListener(swap));
 setVideo(false);
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 /* AUDIO */
 const canSound=()=>{try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;const c=new AC(),ok=c.state==='running';c.close&&c.close();return ok}catch(e){return false}};
 const ready=()=>new Promise(r=>{if(v.readyState>=3)return r();v.addEventListener('canplay',r,{once:true});setTimeout(r,2500)});   /* start picture and sound only once enough is buffered */
 const ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5h3.5L11 5.5v13l-4.5-4H3z" fill="currentColor"/><path class="w" d="M14.5 9a4 4 0 0 1 0 6M17.5 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path class="x" d="M15 9l6 6M21 9l-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
 function mountPill(){if(pill||unlocked)return;pill=document.createElement('button');pill.type='button';pill.className='intro-snd';
  const ui=()=>{pill.classList.toggle('off',v.muted);pill.setAttribute('aria-pressed',String(!v.muted));pill.innerHTML=ICON+'<span>'+(v.muted?'Tap for sound':'Sound on')+'</span>';pill.setAttribute('aria-label',v.muted?'Turn the intro sound on':'Mute the intro sound')};
  pill.onclick=()=>{v.muted=!v.muted;if(!v.muted){v.volume=1;if(v.paused&&playing&&!v.ended)v.play().catch(()=>{})}ui()};ui();intro.append(pill)}
 function showGate(){gate=document.createElement('div');gate.className='snd-gate';
  gate.innerHTML='<div><p class="sg-k">BMWorld</p><button type="button" class="btn btn-m sg-go">Enter with sound</button><button type="button" class="sg-no">Continue without sound</button></div>';intro.append(gate);
  const go=on=>{if(!gate)return;soundOK=on;
   if(on){v.muted=false;v.volume=0;const p=v.play();if(p&&p.then)p.then(()=>{v.pause();v.currentTime=0;v.volume=1}).catch(()=>{v.volume=1})}
   gate.classList.add('bye');const g=gate;gate=null;setTimeout(()=>g.remove(),500);run()};
  gate.querySelector('.sg-go').onclick=()=>go(true);gate.querySelector('.sg-no').onclick=()=>go(false);gate.querySelector('.sg-go').focus()}
 document.addEventListener('visibilitychange',()=>{if(unlocked||!playing||v.ended)return;if(document.hidden)v.pause();else v.play().catch(()=>{})});
 v.addEventListener('playing',()=>{if(playing)mountPill()});
 /* Opening */
 let running=false;
 async function run(){
  if(running)return;running=true;
  v.muted=!soundOK;v.volume=1;
  await wait(250);credit.classList.add('show');          /* fade in (0.5s) */
  await wait(500+1000);credit.classList.add('out');      /* ~1s fully visible, then the exit transition */
  await wait(700);                                       /* exit finishes before the video appears */
  await ready();
  cover.classList.add('gone');playing=true;
  const p=v.play();if(p&&p.catch)p.catch(()=>{
   if(!v.muted){v.muted=true;const q=v.play();if(q&&q.catch)q.catch(unlock)}else unlock()});
  setTimeout(()=>{if(!started)unlock()},6000)}
 if(canSound()){soundOK=true;run()}else showGate()})();
