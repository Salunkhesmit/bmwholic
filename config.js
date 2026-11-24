/* Drive mode applied */
(()=>{let m=null;try{m=localStorage.getItem('bmw-mode')}catch(e){}document.documentElement.dataset.mode=/^(comfort|sport|track)$/.test(m)?m:'sport'})();
window.SITE_CONFIG={
 MASCOT_SRC:"",
 ENGINE_SOUND:"bmw-engine.mp3",
 CHAT_ENDPOINT:""
};
