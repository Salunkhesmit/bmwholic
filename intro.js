/* Homepage intro: black gate (click enables sound) -> credit fades in, 2s hold, drops away -> 0.5s black -> video.
   Scrolling stays locked until the video's real `ended` event. Replays on every fresh load / refresh / hard refresh (no stored state). Only skipped when you come back from another page of this site (in-site link or back button). */
(()=>{const $=s=>document.querySelector(s),root=document.documentElement,body=document.body,v=$('#introVideo'),gate=$('#gate'),credit=$('#credit'),cover=$('#cover');
 /* Skip only for in-site navigation (link/back from another BMWorld page). Reload, hard refresh, typed URL, bookmark or new tab always replay. */
 let seen=false;try{const nav=(performance.getEntriesByType('navigation')[0]||{}).type;let ref=false;try{ref=!!document.referrer&&new URL(document.referrer).origin===location.origin}catch(e){}
  seen=nav==='back_forward'||(nav==='navigate'&&ref)}catch(e){}
 let unlocked=false,started=false;
 const poster='intro-final-frame.jpg';
 function unlock(){if(unlocked)return;unlocked=true;
  if(!v.ended){v.pause();v.poster=poster}                 /* failure path: show the final frame */
  gate.remove();credit.remove();cover.remove();body.classList.add('ended');root.classList.remove('locked')}
 if(seen){const i=new Image();i.src=poster;i.alt='';i.className='intro-still';v.replaceWith(i);unlocked=false;v.ended=true;unlock();return}
 const block=e=>{if(!unlocked)e.preventDefault()},KEYS=['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Spacebar'];
 addEventListener('wheel',block,{passive:false});addEventListener('touchmove',block,{passive:false});
 addEventListener('keydown',e=>{if(!unlocked&&KEYS.includes(e.key))e.preventDefault()});
 root.classList.add('locked');try{history.scrollRestoration='manual'}catch(e){}scrollTo(0,0);
 v.addEventListener('playing',()=>{started=true},{once:true});v.addEventListener('ended',unlock);v.addEventListener('error',unlock);
 const src=v.querySelector('source');if(src)src.addEventListener('error',unlock);
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 async function run(sound){
  gate.classList.add('gone');
  v.muted=true;try{await v.play();v.pause();v.currentTime=0}catch(e){}   /* inside the click: unlocks audio playback */
  v.muted=!sound;
  await wait(500);credit.classList.add('show');          /* fade in */
  await wait(1600+2000);credit.classList.add('out');     /* hold ~2s, then it drops away */
  await wait(900+500);                                   /* ~0.5s of pure black */
  cover.classList.add('gone');
  const p=v.play();if(p&&p.catch)p.catch(unlock);
  setTimeout(()=>{if(!started)unlock()},6000)}
 $('#enterSound').onclick=()=>run(true);$('#enterMuted').onclick=()=>run(false);$('#enterSound').focus();})();
