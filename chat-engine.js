(function(root){
 let M=[],ERAS=[],CATS=[],TL=[],KB={topics:[],tags:{},nick:{}},ALIAS=new Map(),CODES=new Map(),NAMES=[];
 const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 const has=v=>v&&v!=='TBD';
 function norm(s){s=String(s).toLowerCase().replace(/(\d)(o+)(?=\d)/g,(m,a,o)=>a+o.replace(/o/g,'0')).replace(/[\u2013\u2014]/g,'-').replace(/\bbmw\b/g,' ').replace(/['\u2019`]/g,'');
  s=s.replace(/\b(ix|[mxzi]|[efgu])\s?-?\s?(\d{1,2}[a-z]?)\b/g,'$1$2').replace(/\b(\d)\s?er\b/g,'$1 series').replace(/\bseries\s+(\d)\b/g,'$1 series');
  s=s.replace(/\bsedan\b/g,'saloon').replace(/\bliters?\b/g,'litre').replace(/[^a-z0-9. ]+/g,' ').replace(/\s+/g,' ').trim();return s}
 function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;const p=[];for(let j=0;j<=b.length;j++)p[j]=j;
  for(let i=1;i<=a.length;i++){let prev=p[0];p[0]=i;let best=p[0];for(let j=1;j<=b.length;j++){const t=p[j];p[j]=Math.min(p[j]+1,p[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=t;if(p[j]<best)best=p[j]}if(best>max)return max+1}return p[b.length]}
 function addAlias(a,m,w){a=norm(a);if(!a)return;if(!ALIAS.has(a))ALIAS.set(a,[]);const l=ALIAS.get(a);if(!l.some(x=>x.m===m))l.push({m,w:w||1})}
 function init(d){M=d.models;ERAS=d.eras;CATS=d.cats;TL=d.timeline||[];KB=d.kb||KB;ALIAS=new Map();CODES=new Map();
  M.forEach(m=>{const n=m.name.replace(/^BMW\s+/,'');addAlias(n,m,3);addAlias(n.replace(/\(.*?\)/g,''),m,2);addAlias(m.slug.replace(/-/g,' '),m,2);
   if(/dixi/i.test(n))addAlias('dixi',m);if(/Neue Klasse/.test(n)){addAlias('neue klasse i3',m,3);addAlias('new i3',m,1)}
   if(m.slug==='i3'){addAlias('original i3',m,2);addAlias('i3 2013',m,2)}
   const codes=[m.gen,...(m.gens||[]).map(g=>g[0])].join(' / ').replace(/\(.*?\)/g,' ').split(/[\/,]| to /).map(x=>norm(x)).filter(x=>/^[efgu]\d{1,3}[a-z]?$|^i\d{2}$|^na\d$|^ua\d$/.test(x));
   codes.forEach(c=>{if(!CODES.has(c))CODES.set(c,[]);if(!CODES.get(c).includes(m))CODES.get(c).push(m)})});
  Object.entries(KB.nick||{}).forEach(([k,s])=>{const m=M.find(x=>x.slug===s);if(m)addAlias(k,m,2)});
  /* the series pages answer to plain numbers only with the word "series" */
  NAMES=M.map(m=>m.name).sort((a,b)=>b.length-a.length)}
 const link=m=>`<a href="model.html?model=${m.slug}">${esc(m.name)}</a>`;
 const bySlug=s=>M.find(m=>m.slug===s);
 function findModels(t){t=norm(t);const w=t.split(' '),used=new Array(w.length).fill(false),out=[];
  const ctxYear=i=>i>0&&/^(in|from|since|year|during|before|after|until|to|of|around|circa)$/.test(w[i-1])||/^\d{4}s$/.test(w[i]||'');
  for(let n=4;n>=1;n--)for(let i=0;i+n<=w.length;i++){if(used.slice(i,i+n).some(Boolean))continue;const g=w.slice(i,i+n).join(' ');const hit=ALIAS.get(g);
   if(hit&&!(n===1&&/^\d{3,4}$/.test(g)&&ctxYear(i))){for(let k=i;k<i+n;k++)used[k]=true;out.push({i,m:hit.slice().sort((a,b)=>b.w-a.w)[0].m,len:g.length,how:'exact',amb:hit.length>1})}}
  for(let i=0;i<w.length;i++){if(used[i]||w[i].length<4||/^\d+$/.test(w[i]))continue;let best=null,bd=9;
   ALIAS.forEach((l,a)=>{if(a.length<4||a.indexOf(' ')>-1&&a.split(' ').length>2)return;if(a[0]!==w[i][0])return;const mx=a.length>=6?2:1,d=lev(w[i],a,mx);if(d<=mx&&d<bd){bd=d;best=l[0].m}});
   if(best&&bd>0){used[i]=true;out.push({i,m:best,len:w[i].length,how:'fuzzy'})}}
  out.sort((a,b)=>a.i-b.i);const seen=new Set();return out.filter(o=>!seen.has(o.m.slug)&&seen.add(o.m.slug))}
 function codeHit(t){t=norm(t);const r=[];t.split(' ').forEach(x=>{if(CODES.has(x))r.push([x,CODES.get(x)])});return r}
 /* numbers */
 const kw=s=>{const m=String(s||'').match(/([\d,.]+)\s*(hp|bhp|ps|kw)/i);if(!m)return null;const v=parseFloat(m[1].replace(/,/g,''));if(!isFinite(v))return null;const u=m[2].toLowerCase();return u==='kw'?v:u==='ps'?v*.7355:v*.7457};
 const sec=s=>{const m=String(s||'').match(/(\d+(?:\.\d+)?)\s*s\b/);return m?parseFloat(m[1]):null};
 const yrs=m=>{const a=String(m.years).match(/\d{4}/g)||[];if(!a.length)return null;const e=/present/.test(m.years)?2026:+a[a.length-1];return[+a[0],e]};
 /* fields */
 const FIELDS=[['gens',/generation|variants?|versions?|facelift|model years/,'Generations'],['range',/\brange\b|per charge|on a charge|battery/,'Range'],['ec',/engine code|\bcode\b/,'Engine code'],['tq',/torque|lb ft|\bnm\b/,'Torque'],
  ['pw',/power|horsepower|\bhp\b|bhp|\bps\b|\bkw\b|how strong|how powerful/,'Power'],['ts',/top speed|fastest|vmax|max speed/,'Top speed'],['ac',/0 ?-? ?60|0 ?-? ?100|acceler|how quick|how fast/,'Acceleration'],
  ['tr',/gearbox|transmission|manual|automatic/,'Transmission'],['dr',/drivetrain|\bdrive\b|awd|rwd|xdrive|wheel drive/,'Drive'],['dp',/displacement|litre|capacity|\bcc\b|engine size/,'Displacement'],
  ['e',/engine|motor|cylinder|v8|v10|v12|inline/,'Engine'],['body',/body ?style|body|coupe|saloon|convertible|estate|hatch/,'Body'],['years',/\bwhen\b|years?\b|production|built|made|launched|introduced|how long|how many years/,'Production'],
  ['facts',/\bfacts?\b|trivia|interesting|did you know/,'Facts'],['feat',/features?|technology|\btech\b|engineering|special/,'Features'],['hist',/history|story|background|origin/,'History']];
 const fieldsIn=t=>FIELDS.filter(f=>f[1].test(t)).map(f=>f[0]);
 function val(m,k){if(k==='years')return m.years;if(k==='range'){const r=(m.o||[]).find(x=>/range/i.test(x[0]));return r?r[1]:null}
  if(k==='gens')return(m.gens||[]).length?m.gens.map(g=>`${g[0]} (${g[1]}${g[2]?', '+g[2]:''})`).join('; '):null;
  const v=m[k];return Array.isArray(v)?v.join(' '):(has(v)?v:null)}
 const SPEC=['pw','tq','ts','ac','tr','dr','dp','e','ec'];
 const flagNote=m=>m.flag?`<br><i>Note (${esc(m.flag.t)}): ${esc(m.flag.x)}</i>`:'';
 function fieldAnswer(m,fs){const L=FIELDS.reduce((o,f)=>(o[f[0]]=f[2],o),{});let unk=[];
  const rows=fs.slice(0,4).map(k=>{const v=val(m,k);if(v==null){unk.push(L[k]);return null}return`${L[k]}: ${esc(v)}`}).filter(Boolean);
  let h=`<b>${esc(m.name)}</b> (#${m.n}, ${esc(m.gen)}, ${esc(m.years)})<br>`+(rows.length?rows.join('<br>'):'');
  if(unk.length)h+=(rows.length?'<br>':'')+`${unk.join(', ')}: not on file for this entry, and I will not guess it. The ${link(m)} page marks what is still to be added.`;
  if(m.rep&&fs.some(k=>SPEC.includes(k))&&rows.length)h+=`<br><i>${esc(m.rep)}.</i>`;
  return h+flagNote(m)+`<br>${link(m)}`}
 function overview(m){const eras=ERAS.find(e=>e.id===m.era),fig=['pw','tq','ac','ts'].map(k=>val(m,k)?{pw:'Power',tq:'Torque',ac:'Acceleration',ts:'Top speed'}[k]+': '+esc(val(m,k)):null).filter(Boolean);
  let h=`<b>${esc(m.name)}</b> (#${m.n} of ${M.length}, ${eras?esc(eras.range):''}; ${esc(m.gen)}, ${esc(m.years)})<br>${esc(m.intro)}<br>${esc(m.hist)}`;
  if(val(m,'e')||val(m,'dp'))h+=`<br>Engine: ${esc([val(m,'e'),val(m,'dp')].filter(Boolean).join(', '))}`;
  if(fig.length)h+='<br>'+fig.join(' | ');if(m.rep)h+=`<br><i>${esc(m.rep)}.</i>`;
  if((m.gens||[]).length)h+=`<br>Generations: ${m.gens.map(g=>esc(g[0])+' '+esc(g[1])).join(', ')}.`;
  return h+flagNote(m)+`<br>${link(m)} | <a href="compare.html?a=${m.slug}">Compare</a>`}
 function deeper(m){let h=`<b>More on ${esc(m.name)}</b><br>${esc(m.hist)}`;if((m.facts||[]).length)h+=`<br>Facts: ${m.facts.map(esc).join(' ')}`;if((m.feat||[]).length)h+=`<br>Notable: ${m.feat.map(esc).join('; ')}.`;
  if((m.gens||[]).length)h+=`<br>Generations: ${m.gens.map(g=>esc(g[0])+' ('+esc(g[1])+(g[2]?', '+esc(g[2]):'')+')').join('; ')}.`;
  const rel=(m.rel||[]).map(bySlug).filter(Boolean);if(rel.length)h+=`<br>Related: ${rel.map(link).join(', ')}.`;return h+flagNote(m)}
 /* compare */
 const isEV=m=>/electric/i.test(m.e||'')&&!/hybrid/i.test(m.e||'');
 function compare(a,b){const rows=[['Years','years'],['Engine','e'],['Power','pw'],['Torque','tq'],['0-60 / 0-100','ac'],['Top speed','ts'],['Transmission','tr'],['Drive','dr']];
  const t=rows.map(r=>`${r[0]}: ${esc(val(a,r[1])||'to be added')} <b>|</b> ${esc(val(b,r[1])||'to be added')}`);
  const ya=yrs(a),yb=yrs(b),why=[];
  if(ya&&yb&&Math.abs(ya[0]-yb[0])>=8)why.push(`${esc(a.name)} dates from ${ya[0]} and ${esc(b.name)} from ${yb[0]}, so they come from different engineering eras.`);
  if(isEV(a)!==isEV(b))why.push(`${esc(isEV(a)?a.name:b.name)} is fully electric; ${esc(isEV(a)?b.name:a.name)} is not.`);
  if(a.body!==b.body&&has(a.body)&&has(b.body))why.push(`Body: ${esc(a.body)} versus ${esc(b.body)}.`);
  const pa=kw(a.pw),pb=kw(b.pw);if(pa&&pb){const hi=pa>=pb?a:b,lo=pa>=pb?b:a,r=Math.max(pa,pb)/Math.min(pa,pb);why.push(`On the figures on file, ${esc(hi.name)} has about ${Math.round((r-1)*100)}% more power than ${esc(lo.name)} (${esc(hi.pw)} against ${esc(lo.pw)}; these may be different variants).`)}
  else why.push('At least one of the power figures is not on file, so I will not rank them on power.');
  const notes=[a,b].filter(m=>m.rep).map(m=>`${esc(m.name)}: ${esc(m.rep)}.`);
  return `<b>${esc(a.name)} vs ${esc(b.name)}</b><br>${t.join('<br>')}<br>${why.join(' ')}${notes.length?'<br><i>'+notes.join(' ')+'</i>':''}<br><a href="compare.html?a=${a.slug}&b=${b.slug}">Open the full comparison</a>`}
 function faster(a,b){const sa=sec(a.ac),sb=sec(b.ac);if(sa&&sb&&sa!==sb)return`On the quoted acceleration times, ${esc((sa<sb?a:b).name)} is quicker (${sa} s against ${sb} s). Times may use different units (0-60 mph or 0-100 km/h), so treat this as indicative.`;
  const pa=kw(a.pw),pb=kw(b.pw);if(pa&&pb)return`I do not have comparable acceleration times for both, so I looked at power: ${esc((pa>=pb?a:b).name)} makes more (${esc((pa>=pb?a:b).pw)}). Power alone does not decide a race.`;
  return`I do not have enough verified figures for both ${esc(a.name)} and ${esc(b.name)} to say which is faster.`}
 /* recommend / list */
 const CRIT=[[/family|kids?|children|practical|space|seven seat|7 seat|luggage|boot/,['family']],[/fast|quick|performance|sporty|power|track|race|speed/,['fast','track']],[/electric|\bev\b|zero emission|charge/,['electric']],[/hybrid|plug in/,['hybrid']],
  [/classic|vintage|old|heritage|collect|investment/,['classic','collectible']],[/luxur|comfort|chauffeur|limo|refined|flagship|executive/,['luxury','comfort']],[/\bsuv\b|crossover|sav\b|high riding/,['suv']],
  [/convertible|roadster|open top|roof down|cabrio/,['roadster']],[/coupe/,['coupe']],[/compact|small|city|parking|urban/,['compact','city']],[/daily|commut|everyday|all rounder|one car/,['daily']],[/rare|exclusive|unique/,['rare']],[/fun|playful|engaging|driver/,['fun']],[/tech|technology|gadget/,['tech']],[/quirky|unusual|weird|different/,['quirky']]];
 function recommend(t){const want=[];CRIT.forEach(c=>{if(c[0].test(t))want.push(...c[1])});if(!want.length)return null;
  const sc=M.filter(m=>m.years!=='Announced').map(m=>{const tg=KB.tags[m.slug]||[];let s=0;want.forEach(w=>{if(tg.includes(w))s+=1});if(/new|current|latest|modern/.test(t)&&yrs(m)&&yrs(m)[1]>=2025)s+=.5;if(!/classic|vintage|old/.test(t)&&yrs(m)&&yrs(m)[1]<1990&&!want.includes('classic'))s-=2;return{m,s}}).filter(x=>x.s>0).sort((a,b)=>b.s-a.s||a.m.n-b.m.n).slice(0,4);
  return{want:[...new Set(want)],top:sc.map(x=>x.m)}}
 function listBy(t){let l=null,label='';const yr=t.match(/\b(19[2-9]\d|20[0-2]\d)\b/g),dec=t.match(/\b(19[2-9]0|20[012]0)s\b|\b([2-9]0)s\b/);
  if(dec){let d=dec[1]?+dec[1].slice(0,4):(+dec[2]<30?2000+ +dec[2]:1900+ +dec[2]);l=M.filter(m=>{const y=yrs(m);return y&&y[0]<=d+9&&y[1]>=d});label=`the ${d}s`}
  else if(yr&&/built|made|produced|available|launched|from|in|during|between|released/.test(t)){const a=+yr[0],b=yr[1]?+yr[1]:a;l=M.filter(m=>{const y=yrs(m);return y&&y[0]<=Math.max(a,b)&&y[1]>=Math.min(a,b)});label=yr[1]?`${Math.min(a,b)}-${Math.max(a,b)}`:String(a)}
  else if(/electric|\bev\b|evs/.test(t)){l=M.filter(m=>(KB.tags[m.slug]||[]).includes('electric'));label='electric'}
  else if(/\bm cars|m models|m series|performance cars|m division/.test(t)){l=M.filter(m=>m.cat==='M Series');label='M'}
  else if(/\bsuvs?\b|x models|x series/.test(t)){l=M.filter(m=>m.cat==='X Series'||(KB.tags[m.slug]||[]).includes('suv'));label='SUV'}
  else if(/classic|vintage|pre war|prewar|early|oldest/.test(t)){l=M.filter(m=>m.cat==='Classic');label='classic'}
  else{const c=CATS.find(c=>t.includes(norm(c)));if(c){l=M.filter(m=>m.cat===c);label=c}}
  return l&&l.length?{l,label}:null}
 const listHtml=(L,label,st)=>{const shown=L.slice(0,14);st.listCtx={rest:L.slice(14),label};return`<b>${L.length} catalogue entries for ${esc(label)}</b><br>`+shown.map(m=>`#${m.n} ${link(m)} (${esc(m.years)})`).join('<br>')+(L.length>14?`<br>and ${L.length-14} more; say "more" to see them, or open <a href="models.html">the catalogue</a>.`:'')};
 /* topics */
 function topic(t){let best=null,bs=0;(KB.topics||[]).forEach(tp=>{let s=0;tp.k.forEach(k=>{const n=norm(k);if(!n)return;if((' '+t+' ').includes(' '+n+' '))s=Math.max(s,n.length+3);else if(n.length>=6&&t.split(' ').some(w=>w.length>=6&&lev(w,n,1)<=1))s=Math.max(s,n.length)});if(s>bs){bs=s;best=tp}});return bs>=4?best:null}
 const topicHtml=tp=>`<b>${esc(tp.t)}</b><br>${esc(tp.x)}`;
 const CF={site:'Source: this site\u2019s catalogue and data.',pub:'Source: general, publicly documented BMW knowledge; figures are not individually verified here.',calc:'Computed from catalogue figures on this site.',none:'Not on file: I will not guess.'};
 function newState(){return{model:null,models:[],field:[],pair:null,topic:null,pending:null,listCtx:null,turns:0}}
 const STOP=/^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/;
 function answer(q,st,opt){opt=opt||{};st=st||newState();const raw=String(q||'').slice(0,400),t=norm(raw);st.turns++;const R=(html,cf,extra)=>{return Object.assign({html,cf:CF[cf]||'',plain:html.replace(/<br>/g,'\n').replace(/<[^>]+>/g,'')},extra||{})};
  if(!t)return R('Ask me about any of the 79 models in the catalogue, an engine, a technology or BMW history.','site');
  if(STOP.test(t)&&t.split(' ').length<=4)return R('Hello! I am the BMWorld guide. Ask about any of the 79 catalogue models, compare two, or tell me what you want from a BMW and I will suggest some.','site');
  if(/^(thanks|thank you|thx|cheers|great|nice|cool)\b/.test(t))return R('You are welcome. Ask me another BMW question whenever you like.','site');
  if(/who (made|built|developed|created) (this|the) (site|website)|developer|smit/.test(t))return R('This fan site was developed by Smit Salunkhe. It is not affiliated with BMW AG.','site');
  if(/are you (an )?(ai|bot|real|human|chatgpt|claude)|how do you work|what are you/.test(t))return R(opt.ai?'I am an AI guide for this site. I answer from the 79-model catalogue and a BMW knowledge base, and I label what is confirmed on the site and what is general knowledge.':'I am the BMWorld guide running in offline mode: I answer from this site\u2019s 79-model catalogue and BMW knowledge base without an AI model. Connect the AI backend (see README) for free-form answers.','site');
  if(/^(help|what can you do|how can you help)/.test(t))return R('I can: explain any of the 79 models and their generations, compare two cars, recommend a BMW from what you need, list cars by era, family or electric, and explain terms like xDrive, M Sport or Neue Klasse. I will tell you when a figure is not on file.','site');
  if(st.pending==='recommend'&&!/bmws|models|cars|compare|vs/.test(t)){const r=recommend(t);st.pending=null;if(r)return recResp(r,st);}
  let found=findModels(raw);const fs=fieldsIn(t),pron=/\b(it|its|that|this one|that one|this|the same|the car|the model)\b/.test(t)&&!found.length;
  /* more / next / previous */
  if(/^(more|tell me more|go on|continue|and\??|what else|more details?)$/.test(t)){if(st.listCtx&&st.listCtx.rest.length){const L=st.listCtx.rest;st.listCtx.rest=[];return R(`<b>More: ${esc(st.listCtx.label)}</b><br>`+L.map(m=>`#${m.n} ${link(m)} (${esc(m.years)})`).join('<br>'),'site')}
   if(st.model)return R(deeper(st.model),'site')}
  if(/^(next|next one|the next one|next entry)$/.test(t)&&st.model&&M[st.model.n]){st.model=M[st.model.n];return R(overview(st.model),'site')}
  if(/\b(the one before|before it|predecessor|previous (one|model|generation)|older version)\b/.test(t)&&st.model&&!found.length){const m=st.model,g=m.gens||[];if(g.length>1){const p=g[g.length-2];return R(`<b>${esc(m.name)}</b>: the generation before the latest listed one is ${esc(p[0])} (${esc(p[1])}${p[2]?', '+esc(p[2]):''}).<br>${link(m)}`,'site')}const rel=(m.rel||[]).map(bySlug).filter(Boolean);return R(`The catalogue does not record a separate predecessor for ${esc(m.name)}.`+(rel.length?` Related entries: ${rel.map(link).join(', ')}.`:''),'site')}
  /* compare */
  const cmpWord=/\bcompare\b|\bvs\b|\bversus\b|difference between|differences? (between|of)|\bor\b.*\b(better|faster|quicker)|better than|faster than|quicker than|which is (faster|quicker|better|more powerful)|which one is/.test(t);
  if(cmpWord){let a=found[0]&&found[0].m,b=found[1]&&found[1].m;
   if(/which is (faster|quicker|more powerful)|faster|quicker/.test(t)&&!/compare|vs|versus/.test(t)){if(!a&&st.pair){a=st.pair[0];b=st.pair[1]}if(a&&b){st.pair=[a,b];st.model=b;return R(faster(a,b),'calc')}}
   if(a&&!b&&(pron||/\b(it|its)\b/.test(t))&&st.model&&st.model!==a){b=a;a=st.model}
   else if(a&&!b&&st.model&&st.model!==a&&/\b(with|to|against)\b/.test(t)){b=a;a=st.model}
   if(a&&b){st.pair=[a,b];st.model=b;st.models=[a,b];return R(/faster|quicker/.test(t)&&!/compare|difference/.test(t)?faster(a,b):compare(a,b),'calc')}
   if(a)return R(`Compare ${esc(a.name)} with which model? Name another one, for example "${esc(a.name)} vs M4".`,'site')}
  /* recommendation */
  if(/recommend|suggest|which (one |car |model )?(should|would|is best|is good|to)|what (car |model |one )?should i|best (car|one|model) for|should i (buy|get)|looking for|i want a|i need a|advice|good (car|one|model) for|(car|one|model) for (a|my)/.test(t)&&!found.length&&!/\b(19|20)\d0s\b|\b[2-9]0s\b|\b(19|20)\d\d\b/.test(t)){const r=recommend(t);if(r)return recResp(r,st);st.pending='recommend';return R('Happy to help. What matters most: family space, performance, going electric, a classic with history, luxury, or a small city car? You can name several.','site')}
  /* list questions */
  if(/\b(list|show|which|what|any|all)\b.*\b(bmws?|models|cars)\b|\b(built|made|from|in) (the )?(19|20)\d\d|\b(\d0s|(19|20)\d0s)\b|^(electric|classic|m) (bmws?|cars|models)/.test(t)&&!found.length){const l=listBy(t);if(l)return R(listHtml(l.l,l.label,st),'site')}
  /* chassis code */
  if(!found.length){const ch=codeHit(raw);if(ch.length){const [c,L]=ch[0];if(L.length===1){found=[{m:L[0],how:'code'}]}else{st.listCtx=null;return R(`<b>${c.toUpperCase()}</b> appears in ${L.length} catalogue entries:<br>`+L.map(m=>{const g=(m.gens||[]).find(x=>norm(x[0]).split(' ').concat(x[0].toLowerCase().split(/[\/ ]/)).includes(c));return`#${m.n} ${link(m)}${g?' ('+esc(g[1])+')':''}`}).join('<br>')+'<br>Ask for one of them, for example "the '+esc(L[0].name)+'".','site')}}}
  /* topics */
  const tp=topic(t),meaning=/stand for|\bmeans?\b|meaning|abbreviation|what does .{1,12}(stand|mean)/.test(t),asksWhat=/^(what|explain|tell me about|define|meaning|why|how|who)\b|\bwhat (is|are|does)\b|\bexplain\b/.test(t);
  if(tp&&(!found.length||meaning||(asksWhat&&!fs.length&&found.every(f=>f.how==='fuzzy')))){st.topic=tp;return R(topicHtml(tp),tp.c==='site'?'site':'pub')}
  /* model answers (incl. follow-ups) */
  let m=found[0]&&found[0].m,carried=false;
  if(!m&&(pron||(!found.length&&fs.length&&t.split(' ').length<=8))&&st.model){m=st.model;carried=true}
  if(!m&&st.model&&/^(what about|how about|and|what of)\b/.test(t)){}
  if(m){const prevFields=st.field;st.model=m;st.models=found.map(f=>f.m);
   let f=fs.slice();if(!f.length&&/^(what about|how about|and|what of)\b/.test(t)&&prevFields&&prevFields.length)f=prevFields.slice();
   const wantsAll=/^(tell me about|about|overview|what is|what was|who is)\b|^the\b/.test(t)||!f.length;
   const fuzzyNote=found[0]&&found[0].how==='fuzzy'?`<i>I read that as ${esc(m.name)}.</i><br>`:'';
   if(f.length&&!(wantsAll&&!fs.length)){st.field=f;if(f.includes('hist')&&f.length===1)return R(fuzzyNote+deeper(m),'site');if(f.includes('gens')&&!(m.gens||[]).length)return R(fuzzyNote+`${esc(m.name)} is a single catalogue entry with no separate generations recorded. ${link(m)}`,'site');return R(fuzzyNote+genNote(m,raw)+fieldAnswer(m,f),'site')}
   st.field=[];return R(fuzzyNote+genNote(m,raw)+overview(m),'site')}
  if(tp){st.topic=tp;return R(topicHtml(tp),tp.c==='site'?'site':'pub')}
  /* timeline by year */
  const y=t.match(/\b(1[89]\d\d|20\d\d)\b/);if(y){const e=TL.find(x=>x.y===y[1]);if(e)return R(`<b>${e.y}: ${esc(e.t)}</b><br>${esc(e.x)}<br><a href="history.html">Full timeline</a>`,'site');const l=listBy(t);if(l)return R(listHtml(l.l,l.label,st),'site')}
  const l=listBy(t);if(l)return R(listHtml(l.l,l.label,st),'site');
  /* close matches instead of a dead end */
  const words=t.split(' ').filter(w=>w.length>3),near=M.map(mm=>({mm,s:words.filter(w=>norm(mm.name+' '+mm.intro+' '+mm.cat).includes(w)).length})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,3);
  if(near.length)return R(`I could not pin that to one model or topic. The closest catalogue entries are: ${near.map(x=>link(x.mm)).join(', ')}. Try naming a model ("M4", "507", "iX3"), a term ("xDrive", "Neue Klasse") or ask me to compare two cars.`,'site');
  return R('I could not match that to a model, a technology or a period. Try a model name ("M4", "507", "iX3"), a term ("xDrive", "Neue Klasse"), "compare M3 and M4", "electric BMWs" or "recommend a family BMW".','site')}
 function genNote(m,raw){const c=codeHit(raw).find(x=>x[1].includes(m));if(!c)return'';const g=(m.gens||[]).find(x=>x[0].toLowerCase().split(/[\/ ,]+/).includes(c[0]));if(!g)return'';return`<i>You mentioned ${c[0].toUpperCase()}: the catalogue lists it as ${esc(g[0])} (${esc(g[1])}${g[2]?', '+esc(g[2]):''}). ${m.rep?'Specification figures below: '+esc(m.rep.replace(/^Figures are for /,'').replace(/^Specs shown for /,''))+'. Figures for '+c[0].toUpperCase()+' are not on file.':''}</i><br>`}
 function recResp(r,st){st.model=r.top[0]||st.model;st.models=r.top;const L={fast:'performance',track:'performance',family:'family use',electric:'electric power',hybrid:'hybrid',classic:'classic character',collectible:'collectability',luxury:'luxury',comfort:'comfort',suv:'an SUV body',roadster:'open-top',coupe:'a coupe',compact:'a compact size',city:'city use',daily:'daily use',rare:'rarity',fun:'driving fun',tech:'technology',quirky:'quirkiness'};
  const why=[...new Set(r.want.map(w=>L[w]||w))].join(', ');
  return{html:`<b>For ${esc(why)}, these catalogue models fit best:</b><br>`+r.top.map(m=>`#${m.n} ${link(m)} (${esc(m.years)}): ${esc(m.intro)}${m.flag&&m.flag.t==='Not on sale yet'?' <i>(not on sale until 2027)</i>':''}`).join('<br>')+'<br>I have no price or reliability data, so compare running costs separately. Say "compare" with two of them to dig deeper.',cf:'This is a ranking from catalogue attributes and general BMW knowledge, not a verified buying guide.',plain:''}}
 /* context for the AI backend */
 const slim=m=>{const o={n:m.n,name:m.name,years:m.years,gen:m.gen,cat:m.cat,body:m.body,intro:m.intro,hist:m.hist};['e','ec','dp','pw','tq','ts','ac','tr','dr','rep'].forEach(k=>{if(has(m[k]))o[k]=m[k]});if(m.gens&&m.gens.length)o.gens=m.gens.map(g=>g.join(' | '));if(m.facts&&m.facts.length)o.facts=m.facts;if(m.feat&&m.feat.length)o.feat=m.feat;if(m.o&&m.o.length)o.other=m.o.map(r=>r.join(': '));if(m.flag)o.flag=m.flag.t+': '+m.flag.x;return o};
 function context(q,st){const f=findModels(q).map(x=>x.m);const foc=[];[...f,...(st&&st.pair||[]),st&&st.model].filter(Boolean).forEach(m=>{if(!foc.includes(m))foc.push(m)});
  const codes=codeHit(q).flatMap(c=>c[1]).slice(0,4);codes.forEach(m=>{if(!foc.includes(m))foc.push(m)});
  const tp=[];const t=norm(q);(KB.topics||[]).forEach(x=>{if(x.k.some(k=>t.includes(norm(k))))tp.push({title:x.t,text:x.x,basis:x.c})});
  const rec=recommend(t);if(rec)rec.top.forEach(m=>{if(!foc.includes(m))foc.push(m)});
  return{catalogue:M.map(m=>`${m.n}. ${m.name} (${m.years}; ${m.gen}; ${m.cat})`),focus:foc.slice(0,6).map(slim),topics:tp.slice(0,4),timeline:TL.map(x=>`${x.y}: ${x.t}`)}}
 function linkify(html){let out=html;const done=new Set();NAMES.forEach(n=>{const e=esc(n).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),re=new RegExp('(^|[^\\w>"/=])('+e+')(?![\\w])','g'),m=M.find(x=>x.name===n);out=out.replace(re,(s,p,x)=>{if(done.has(n))return s;done.add(n);return p+`<a href="model.html?model=${m.slug}">${x}</a>`})});return out}
 const api={init,norm,newState,answer,context,findModels,linkify,lev};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;root.BMWChat=api;
})(typeof window!=='undefined'?window:globalThis);
