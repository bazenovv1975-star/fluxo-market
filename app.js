const ASSETS={"gift": "assets/gift.svg", "bolt": "assets/bolt.svg", "🎇": "assets/sparkler.svg", "💎": "assets/crystal.svg", "🍭": "assets/candy.svg", "🐤": "assets/duck.svg", "👑": "assets/crown.svg", "🌟": "assets/star.svg", "🧸": "assets/bear.svg", "frog": "assets/pepe-pool.png", "logo": "assets/logo-markt.png", "bluefrog": "assets/pepe-heart.png", "rocket": "assets/rocket.svg"};
const paths={
 star:'<path fill="currentColor" stroke="none" d="M12 1.8 15 8.3 22 9.1 16.9 14l1.4 7L12 17.5 5.7 21 7.1 14 2 9.1l7-.8z"/>',
 spark:'<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z"/>',
 gift:'<rect x="3" y="8" width="18" height="4" rx="1.4" fill="currentColor" stroke="none"/><path fill="currentColor" stroke="none" d="M4 13h7v9H6a2 2 0 0 1-2-2zm9 0h7v7a2 2 0 0 1-2 2h-5z"/><path d="M12 8c-5 0-7-1-6-4 1-2 4-1 6 4 2-5 5-6 6-4 1 3-1 4-6 4z"/>',
 game:'<path fill="currentColor" stroke="none" d="M7.2 5h9.6c3 0 4.5 2.3 5 5l1 5.8c.8 4.5-3.5 5.1-5.5 2.5L15 15H9l-2.3 3.3C4.7 21 0 20.3 1 15.8L2 10c.5-2.7 2-5 5.2-5z"/><path d="M7 8.7v5.4M4.3 11.4h5.4" stroke="#191919"/><circle cx="16" cy="10" r="1.3" fill="#191919" stroke="none"/><circle cx="19" cy="12.5" r="1.3" fill="#191919" stroke="none"/>',
 user:'<circle cx="12" cy="7" r="4.5" fill="currentColor" stroke="none"/><path fill="currentColor" stroke="none" d="M3 22v-2a9 9 0 0 1 18 0v2z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 sort:'<path d="M7 4v16m-4-4 4 4 4-4M17 20V4m-4 4 4-4 4 4"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor"/><rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor"/>',
 chevron:'<path d="m9 6 6 6-6 6"/>',x:'<path d="m6 6 12 12M18 6 6 18"/>',reset:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>'};
paths.arena='<path d="M4 3l6 2 11 13-3 3L5 8 4 3zm16 0-6 2-3 4m-3 3-5 6 3 3 5-5"/>';paths.market='<path fill="currentColor" stroke="none" d="M4 8h16l1 13H3L4 8Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor"/><path d="M9 13h6" stroke="#181818" stroke-width="1.8"/>';
paths.expand='<path d="M8 3H3v5m13-5h5v5m0 8v5h-5M3 16v5h5"/>';
function icon(n){return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[n]||''}</svg>`}


const $=id=>document.getElementById(id);
paths.settings='<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="m10 2 4 0 1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1z"/>';
paths.plus='<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>';paths.down='<path d="m6 9 6 6 6-6"/>';
function art(k){return `<img class="art" src="${ASSETS[k]||ASSETS.gift}" alt="" draggable="false">`}
document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));document.querySelectorAll('[data-art]').forEach(e=>{e.innerHTML=art(e.dataset.art)});$('logo').src=ASSETS.logo;

// Profile display only. Launch data is not an authenticated server session.
let shownProfileKey = '';
function getBridge(){
  return window.Fluxogram?.WebApp || window.FluxoGram?.WebApp || window.Telegram?.WebApp || null;
}
function getLaunchUser(){
  const bridge=getBridge();
  let u=bridge?.initDataUnsafe?.user;
  if(!u){
    try{
      const params=new URLSearchParams(location.hash.slice(1));
      const data=bridge?.initData || params.get('tgWebAppData') || new URLSearchParams(location.search).get('tgWebAppData');
      if(data) u=JSON.parse(new URLSearchParams(data).get('user')||'null');
    }catch{}
  }
  if(!u || typeof u!=='object' || !/^\d+$/.test(String(u.id))) return null;
  const text=v=>typeof v==='string'?v.trim().slice(0,128):'';
  const name=[text(u.first_name),text(u.last_name)].filter(Boolean).join(' ')||text(u.username)||'Пользователь';
  let photo='';
  try{const url=new URL(u.photo_url);if(url.protocol==='https:' && !url.username && !url.password)photo=url.href}catch{}
  return {name,handle:text(u.username),photo};
}
function renderProfile(){
  const u=getLaunchUser();
  const key=JSON.stringify(u);
  if(key===shownProfileKey)return;
  shownProfileKey=key;
  $('nickname').textContent=u?.name||'Гость';
  $('profileStatus').textContent=u?(u.handle?'@'+u.handle:'Профиль FluxoGram'):'Открой через бота';
  document.querySelector('#profile .head p').textContent=u?'Профиль из Mini App · данные не проверены сервером':'Данные аккаунта пока недоступны';
  const label=Array.from(u?.name||'MARKT')[0].toUpperCase();
  for(const id of ['avatar','navAvatar']){
    const el=$(id);el.replaceChildren(document.createTextNode(label));
    if(u?.photo){
      const pic=document.createElement('img');
      pic.alt='';pic.className='profile-photo';pic.referrerPolicy='no-referrer';
      pic.addEventListener('load',()=>{if(el.contains(pic))el.replaceChildren(pic)},{once:true});
      pic.addEventListener('error',()=>pic.remove(),{once:true});
      el.append(pic);pic.src=u.photo;
    }
  }
}
// Fullscreen is a native host capability; never simulate or hide the host controls.
let screenBridge=null, fullscreenAttempted=false, screenStatus='';
const screenEvents=['fullscreenChanged','safeAreaChanged','contentSafeAreaChanged','viewportChanged'];
function launchedInApp(b){
  if(!b)return false;
  return b===window.Fluxogram?.WebApp || b===window.FluxoGram?.WebApp ||
    !!b.initData || (!!b.platform && b.platform!=='unknown') ||
    new URLSearchParams(location.hash.slice(1)).has('tgWebAppVersion');
}
function fullscreenSupported(b){
  try{return typeof b?.requestFullscreen==='function' &&
    (typeof b.isVersionAtLeast!=='function'||b.isVersionAtLeast('8.0'))}
  catch{return false}
}
function screenLayout(){
  const b=screenBridge, full=b?.isFullscreen===true;
  document.documentElement.classList.toggle('native-fullscreen',full);
  const root=document.documentElement;
  for(const edge of ['top','right','bottom','left']){
    const px=v=>Number.isFinite(Number(v))?Math.max(0,Math.min(200,Number(v))):0;
    root.style.setProperty('--markt-device-'+edge,px(b?.safeAreaInset?.[edge])+'px');
    root.style.setProperty('--markt-content-'+edge,px(b?.contentSafeAreaInset?.[edge])+'px');
  }
  const label=$('fullscreenStatus');
  if(label)label.textContent=full?'Полноэкранный режим активен':screenStatus||
    (fullscreenSupported(b)?'Доступен в этом клиенте':'Обычный режим');
  const button=$('fullscreenAction');
  if(button)button.textContent=full?'Выйти из полноэкранного режима':'На весь экран';
}
function requestNativeFullscreen(manual=false){
  const b=screenBridge;
  if(!b){screenStatus='Открой приложение внутри FluxoGram';screenLayout();return}
  if(b.isFullscreen===true){
    if(manual&&typeof b.exitFullscreen==='function'){
      try{b.exitFullscreen()}catch{}
    }
    screenLayout();return;
  }
  if(!fullscreenSupported(b)){
    screenStatus='Клиент не поддерживает fullscreen API';
    try{b.expand?.()}catch{}
    screenLayout();return;
  }
  if(!manual&&fullscreenAttempted)return;
  fullscreenAttempted=true;
  screenStatus='Запрошен полноэкранный режим';
  try{b.requestFullscreen()}catch{
    screenStatus='Клиент отклонил полноэкранный режим';
    try{b.expand?.()}catch{}
  }
  screenLayout();
}
function screenFailed(event){
  if(event?.error==='ALREADY_FULLSCREEN'){screenLayout();return}
  screenStatus=event?.error==='UNSUPPORTED'?'Клиент не поддерживает fullscreen':'Не удалось открыть на весь экран';
  try{screenBridge?.expand?.()}catch{}
  screenLayout();
}
function initMiniApp(){
  const b=getBridge();
  if(launchedInApp(b)&&b!==screenBridge){
    if(screenBridge){
      for(const event of screenEvents)try{screenBridge.offEvent?.(event,screenLayout)}catch{}
      try{screenBridge.offEvent?.('fullscreenFailed',screenFailed)}catch{}
    }
    screenBridge=b;fullscreenAttempted=false;screenStatus='';
    for(const event of screenEvents)try{b.onEvent?.(event,screenLayout)}catch{}
    try{b.onEvent?.('fullscreenFailed',screenFailed)}catch{}
    for(const [method,args] of [['ready',[]],['setHeaderColor',['#151515']],['setBackgroundColor',['#151515']],['setBottomBarColor',['#151515']],['expand',[]]]){
      try{if(typeof b[method]==='function')b[method](...args)}catch{}
    }
    requestNativeFullscreen();
  }
  screenLayout();
  renderProfile();
}

const defaults=()=>({stars:0,day:'',saved:[],owned:[],best:0,played:0,history:[],motion:true,giftMotion:true,respectSystemMotion:false,vibration:false,rounded:false});
let state=defaults();try{let v=JSON.parse(localStorage.getItem('markt-v11')||localStorage.getItem('fluxomarket-v2')||'null');if(v&&typeof v==='object')state={...state,...v};for(const k of ['saved','owned','history'])if(!Array.isArray(state[k]))state[k]=[];for(const k of ['stars','best','played'])if(!Number.isFinite(state[k])||state[k]<0)state[k]=0;delete state.name}catch{}
if(state.motionVersion!==10){state.motion=true;state.giftMotion=true;state.motionVersion=10;try{localStorage.setItem('markt-v11',JSON.stringify(state))}catch{}}
const systemMotion=matchMedia('(prefers-reduced-motion: reduce)');
function motionEnabled(){return Boolean(state.motion)&&!(state.respectSystemMotion&&systemMotion.matches)}
function motionStatus(){return !state.motion?'Выключены в меню сайта':state.respectSystemMotion&&systemMotion.matches?'Выключены системной настройкой':systemMotion.matches?'Включены на сайте · системное ограничение не применяется':'Включены'}
function refreshMotion(){document.body.classList.toggle('noMotion',!motionEnabled());const label=document.getElementById('motionStatus');if(label)label.textContent=motionStatus()}
systemMotion.addEventListener('change',refreshMotion);
const today=()=>{let d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};let current='',view='catalog',mine='owned',sort=false,grid=false;
const gifts=[{id:9,name:'Blue Pepe',cat:'Персонажи',emoji:'bluefrog',tone:'#366ca2',model:'Classic',background:'Ночь',symbol:'Сердце'},{id:1,name:'Pool Pepe',cat:'Персонажи',emoji:'frog',tone:'#559963',model:'Pool',background:'Изумруд',symbol:'Звезда'},{id:2,name:'Party Sparkler',cat:'Праздник',emoji:'🎇',tone:'#a46576',model:'Классика',background:'Роза',symbol:'Искра'},{id:3,name:'Crystal Heart',cat:'Коллекционные',emoji:'💎',tone:'#587fab',model:'Deluxe',background:'Ночь',symbol:'Сердце'},{id:4,name:'Candy Pop',cat:'Праздник',emoji:'🍭',tone:'#ad75a6',model:'Studio',background:'Роза',symbol:'Искра'},{id:5,name:'Lucky Duck',cat:'Персонажи',emoji:'🐤',tone:'#b5a349',model:'Классика',background:'Золото',symbol:'Звезда'},{id:6,name:'Golden Crown',cat:'Коллекционные',emoji:'👑',tone:'#a17c3e',model:'Deluxe',background:'Золото',symbol:'Звезда'},{id:7,name:'Magic Star',cat:'Коллекционные',emoji:'🌟',tone:'#8676b2',model:'Studio',background:'Ночь',symbol:'Искра'},{id:8,name:'Teddy Bear',cat:'Персонажи',emoji:'🧸',tone:'#a68060',model:'Классика',background:'Золото',symbol:'Сердце'}];
const labels={cat:'Коллекция',model:'Модель',background:'Фон',symbol:'Символ'};const blankFilters=()=>({cat:'',model:'',background:'',symbol:''});
let filters=blankFilters();
const catalogPrefs={market:{filters:blankFilters(),query:'',sort:false,grid:false},gifts:{filters:blankFilters(),query:'',sort:false,grid:false}};
try{const p=JSON.parse(localStorage.getItem('fluxo-v9-catalog')||'null');for(const k of ['market','gifts'])if(p?.[k])catalogPrefs[k]={...catalogPrefs[k],...p[k],filters:{...blankFilters(),...p[k].filters}}}catch{}
function storeCatalog(){if(!['market','gifts'].includes(current))return;catalogPrefs[current]={filters:{...filters},query:$('search').value,sort,grid};try{localStorage.setItem('fluxo-v9-catalog',JSON.stringify(catalogPrefs))}catch{}}
function restoreCatalog(id){let p=catalogPrefs[id];filters={...p.filters};$('search').value=p.query;sort=!!p.sort;grid=!!p.grid;$('sort').setAttribute('aria-pressed',String(sort));$('layout').setAttribute('aria-pressed',String(grid));updateCategories()}

function save(){try{localStorage.setItem('markt-v11',JSON.stringify(state))}catch{}sync()}
function sync(){document.body.classList.toggle('rounded-ui',state.rounded===true);$('topOwned').textContent=state.owned.length;let n=state.stars.toLocaleString('ru-RU');['balance','seasonSum','seasonBonus','profileStars'].forEach(x=>$(x).textContent=n);['played','seasonRounds','profileRounds'].forEach(x=>$(x).textContent=state.played);['best','profileBest'].forEach(x=>$(x).textContent=state.best);['profileOwned','ownCount'].forEach(x=>$(x).textContent=state.owned.length);['profileSaved','favCount'].forEach(x=>$(x).textContent=state.saved.length);renderProfile();let done=state.day===today();$('claim').disabled=$('taskClaim').disabled=done;$('claim').textContent=done?'Бонус получен ✓':'Получить 25 баллов';$('taskClaim').textContent=done?'Получено ✓':'Забрать';$('taskClaim').classList.toggle('done',done);let p=state.played%5*20;$('level').textContent=1+Math.floor(state.played/5);$('percent').textContent=p+'%';$('progress').style.width=p+'%';refreshMotion();document.body.classList.toggle('noGiftMotion',!state.giftMotion)}
let toastT;function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>$('toast').classList.remove('show'),2500)}
function claim(){if(state.day===today())return;state.day=today();state.stars+=25;save();toast('Бонус получен · +25 баллов');bonusEffect()}
$('claim').onclick=$('taskClaim').onclick=claim;
function bonusEffect(){if(!motionEnabled())return;let r=$('balanceBtn').getBoundingClientRect();let pop=document.createElement('span');pop.className='bonusPop';pop.textContent='+25 ✦';pop.style.left=(r.left+r.width/2)+'px';pop.style.top=(r.bottom+4)+'px';document.body.append(pop);pop.addEventListener('animationend',()=>pop.remove(),{once:true});setTimeout(()=>pop.remove(),1300)}

function go(id){
 if(id===current)return;
 storeCatalog();
 if(current==='arena'&&running)finish(false);
 current=id;
 document.querySelectorAll('.page').forEach(el=>{el.hidden=el.id!==id;el.classList.remove('in')});
 $(id).classList.add('in');
 document.querySelectorAll('[data-page]').forEach(b=>{let yes=b.dataset.page===id;b.classList.toggle('active',yes);if(yes)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 $('dock').classList.toggle('profileActive',id==='profile');
 $('dock').classList.toggle('freeActive',id==='free');let pos=['arena','market','gifts'].indexOf(id);
 if(pos>=0){$('nav').style.setProperty('--pos',pos);$('nav').style.setProperty('--tint',['#c98aff2b','#2098ff2b','#2098ff2b'][pos])}
 if(id==='market'||id==='gifts'){
   $(id==='market'?'marketSlot':'mineSlot').append($('sharedCatalog'));
   restoreCatalog(id);selectView(id==='market'?'catalog':'mine');
 }
 window.scrollTo({top:0,behavior:'instant'});sync()
}
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>go(b.dataset.page));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
let closeT,openFrame,previousFocus,drag=null,closeComplete=null;const overlay=$('overlay'),sheet=$('sheet');
function showSheet(title,content,foot=''){clearTimeout(closeT);closeComplete=null;cancelAnimationFrame(openFrame);drag=null;sheet.classList.remove('dragging');sheet.style.transform='';overlay.style.backgroundColor='';overlay.classList.remove('closing');previousFocus=overlay.hidden?document.activeElement:previousFocus;$('sheetTitle').textContent=title;$('sheetBody').innerHTML=content;$('sheetFoot').innerHTML=foot;$('sheetFoot').hidden=!foot;$('sheetBody').scrollTop=0;overlay.hidden=false;document.body.style.overflow='hidden';if(!overlay.classList.contains('open')){void overlay.offsetHeight;overlay.classList.add('open')}openFrame=requestAnimationFrame(()=>$('closeSheet').focus({preventScroll:true}))}
function closeSheet(){if(overlay.hidden||overlay.classList.contains('closing'))return;
 drag=null;sheet.classList.remove('dragging');void sheet.offsetHeight;
 overlay.classList.add('closing');overlay.classList.remove('open');sheet.style.transform='translate3d(0,110%,0)';overlay.style.backgroundColor='';
 const complete=()=>{if(!overlay.classList.contains('closing'))return;closeComplete=null;clearTimeout(closeT);overlay.hidden=true;overlay.classList.remove('closing');sheet.style.transform='';document.body.style.overflow='';if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true})};closeComplete=complete;closeT=setTimeout(complete,motionEnabled()?510:0)
}
sheet.addEventListener('transitionend',e=>{if(e.target===sheet&&e.propertyName==='transform'&&closeComplete)closeComplete()});$('closeSheet').onclick=closeSheet;overlay.addEventListener('pointerdown',e=>{if(e.target===overlay)closeSheet()});document.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape'){e.preventDefault();closeSheet()}if(e.key==='Tab'){let f=[...sheet.querySelectorAll('button:not(:disabled),input:not(:disabled),[tabindex="0"]')].filter(x=>x.getClientRects().length);if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus()}}});
function beginDrag(e){if(e.button!==0||e.target.closest('button')||overlay.classList.contains('closing'))return;drag={id:e.pointerId,y:e.clientY,lastY:e.clientY,lastT:performance.now(),velocity:0,dist:0};e.currentTarget.setPointerCapture(e.pointerId);sheet.classList.add('dragging');e.preventDefault()}
function moveDrag(e){if(!drag||e.pointerId!==drag.id)return;let now=performance.now();if(now>drag.lastT){drag.velocity=(e.clientY-drag.lastY)/(now-drag.lastT);drag.lastY=e.clientY;drag.lastT=now}let d=Math.max(0,e.clientY-drag.y);drag.dist=d;sheet.style.transform=`translate3d(0,${d}px,0)`;overlay.style.backgroundColor=`rgba(0,0,0,${Math.max(.12,.60-d/650)})`}
function endDrag(e){if(!drag||e.pointerId!==drag.id)return;let d=drag.dist,v=performance.now()-drag.lastT<100?drag.velocity:0;drag=null;sheet.classList.remove('dragging');if(e.type!=='pointercancel'&&(d>Math.min(140,sheet.clientHeight*.32)||(d>45&&v>.65)))closeSheet();else{sheet.style.transform='';overlay.style.backgroundColor=''}}
[$('grab'),$('sheetHead')].forEach(el=>{el.addEventListener('pointerdown',beginDrag);el.addEventListener('pointermove',moveDrag);el.addEventListener('pointerup',endDrag);el.addEventListener('pointercancel',endDrag);el.addEventListener('lostpointercapture',endDrag)});
function selectView(v){view=v;document.querySelectorAll('[data-view]').forEach(b=>(b.classList.toggle('active',b.dataset.view===v),b.setAttribute('aria-pressed',String(b.dataset.view===v))));$('catalogBanners').hidden=v!=='catalog';$('categories').hidden=v!=='catalog';$('mineTools').hidden=v!=='mine';$('giftControls').hidden=v==='history'||v==='offers';render()}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>selectView(b.dataset.view));document.querySelectorAll('[data-mine]').forEach(b=>b.onclick=()=>{mine=b.dataset.mine;$('mineSeg').style.setProperty('--seg',mine==='owned'?0:1);document.querySelectorAll('[data-mine]').forEach(x=>x.classList.toggle('active',x===b));render()});
$('inventory').onclick=()=>{go('gifts');selectView('mine')};$('toCatalog').onclick=()=>go('market');
function thumb(g){return `<div class="thumb" style="--tone:${g.tone}">${art(g.emoji)}</div>`}
function empty(t,p,btn=''){return `<div class="empty">${art('bluefrog')}<h3>${t}</h3><p>${p}</p>${btn}</div>`}
function render(){let list=$('giftlist');$('resultCount').textContent='';$('resetVisible').hidden=true;list.classList.toggle('grid',grid&&view!=='history');if(view==='offers'){list.classList.remove('grid');list.innerHTML=empty('Пока нет предложений','В локальной версии нет сделок. Здесь будет список предложений.','<button class="white" id="offerCatalog">Открыть каталог</button>');$('offerCatalog').onclick=()=>go('market');return}if(view==='history'){list.innerHTML=state.history.length?state.history.slice().reverse().map(id=>{let g=gifts.find(x=>x.id===id);return g?`<div class="giftrow">${thumb(g)}<div class="giftname"><strong>${g.name}</strong><span>Добавлено в личную коллекцию</span></div><span class="muted">✓</span></div>`:''}).join(''):empty('История пока пуста','Здесь появятся действия с личной коллекцией.');return}
let q=$('search').value.trim().toLowerCase();let items=gifts.filter(g=>(view==='catalog'||(mine==='owned'?state.owned:state.saved).includes(g.id))&&(g.name.toLowerCase().includes(q)||String(g.id).padStart(5,'0').includes(q.replace('#','')))&&Object.keys(filters).every(k=>!filters[k]||filters[k]===g[k]));if(sort)items.sort((a,b)=>a.name.localeCompare(b.name));$('resultCount').textContent=items.length+' '+(items.length===1?'подарок':items.length>1&&items.length<5?'подарка':'подарков');$('resetVisible').hidden=!(q||Object.values(filters).some(Boolean));storeCatalog();list.innerHTML=items.length?items.map(g=>`<article class="giftrow">${thumb(g)}<button class="giftname" data-detail="${g.id}"><strong>${g.name}</strong><span>#${String(g.id).padStart(5,'0')} · ${g.model}</span></button><button class="blue" data-detail="${g.id}">Подробнее</button><button class="heart ${state.saved.includes(g.id)?'on':''}" data-save="${g.id}" aria-label="Избранное" aria-pressed="${state.saved.includes(g.id)}">${state.saved.includes(g.id)?'♥':'♡'}</button></article>`).join(''):empty(view==='mine'&&!q?'Подарков пока нет':'Ничего не найдено',view==='mine'&&!q?'Добавь подарок каталога или открой каталог.':'Попробуй изменить запрос и фильтры.',view==='mine'?'<button class="white" id="emptyAdd">Перейти в маркет</button>':'');
list.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>detail(+b.dataset.detail));list.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{let id=+b.dataset.save;if(state.saved.includes(id))state.saved=state.saved.filter(x=>x!==id);else state.saved.push(id);save();if(view==='mine'&&mine==='saved')render();else{let on=state.saved.includes(id);b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.textContent=on?'♥':'♡'}});if($('emptyAdd'))$('emptyAdd').onclick=()=>go('market');document.querySelectorAll('[data-filter]').forEach(b=>{let k=b.dataset.filter;b.classList.toggle('on',!!filters[k]);b.innerHTML=(filters[k]||labels[k])+' '+icon('down')})}
function detail(id){let g=gifts.find(x=>x.id===id);showSheet(g.name,`<div class="sheethero" style="background:radial-gradient(ellipse at 40% 30%,${g.tone},#202020)">${art(g.emoji)}</div><p>Подарок каталога #${String(g.id).padStart(5,'0')}</p><div class="traits">${Object.keys(labels).map(k=>`<div><span>${labels[k]}</span><b>${g[k]}</b></div>`).join('')}</div>`,`<button class="white full" id="collect">${state.owned.includes(id)?'Уже в коллекции ✓':'Добавить в личную коллекцию'}</button>`);$('collect').disabled=state.owned.includes(id);$('collect').onclick=()=>{collect(id);closeSheet()}}
function collect(id){if(!state.owned.includes(id)){state.owned.push(id);state.history.push(id);save();render();toast('Подарок добавлен в коллекцию')}}
function addGift(){showSheet('Добавить подарок',`<div class="sheethero">${art('gift')}</div><div class="sheetrow"><div class="tile">${icon('gift')}</div><div><h3>Коллекция MARKT</h3><p>Выбери образ из каталога MARKT.</p></div></div><div class="sheetrow"><div class="tile">${icon('info')}</div><div><h3>Без переводов</h3><p>Ничего не отправляется в Telegram или FluxoGram.</p></div></div>`,`<button class="white full" id="pickGift">Выбрать подарок</button>`);$('pickGift').onclick=()=>showSheet('Выбери подарок',gifts.map(g=>`<button class="choice" data-pick="${g.id}" ${state.owned.includes(g.id)?'disabled':''}><span class="flex">${thumb(g)}<strong>${g.name}</strong></span><span>${state.owned.includes(g.id)?'✓':'+'}</span></button>`).join(''));}
// delegated to avoid duplicate handlers during sheet navigation
$('sheetBody').addEventListener('click',e=>{let b=e.target.closest('[data-pick]');if(b&&!b.disabled){collect(+b.dataset.pick);closeSheet()}});
$('addGift').onclick=addGift;$('aboutGifts').onclick=()=>{showSheet('О подарках','<p>Коллекция хранится на устройстве. Покупки, переводы и вывод недоступны.</p>','<button class="white full" id="okInfo">Понятно</button>');$('okInfo').onclick=closeSheet};$('collectionInfo').onclick=()=>showSheet('Коллекции MARKT',`<div class="sheethero">${art('bluefrog')}</div><p>Выбирай модели, сохраняй понравившиеся и добавляй подарки каталога в коллекцию MARKT.</p>`);
function filterSheet(k){
 let opts=['',...new Set(gifts.map(g=>g[k]))], selected=filters[k];
 showSheet(labels[k],`<label class="search filterSearch">${icon('search')}<input id="filterQuery" placeholder="Быстрый поиск"></label><div class="filterCaption"><span>${labels[k]}</span><span>Каталог MARKT</span></div><div id="filterOptions"></div>`,`<div class="dual"><button class="secondary" id="filterReset">Сбросить</button><button class="blue" id="filterApply">Применить</button></div>`);
 function draw(){let q=$('filterQuery').value.trim().toLowerCase();$('filterOptions').innerHTML=opts.map((v,i)=>({v,i})).filter(o=>(o.v||'Все').toLowerCase().includes(q)).map(({v,i})=>`<button class="filterChoice ${selected===v?'on':''}" data-option="${i}"><span class="checkMark">${selected===v?'✓':''}</span>${v&&k==='cat'?thumb(gifts.find(g=>g.cat===v)):''}<strong>${v||'Все'}</strong><span class="muted">${v?gifts.filter(g=>g[k]===v).length:''}</span></button>`).join('');$('filterOptions').querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=opts[+b.dataset.option];draw()})}
 $('filterQuery').oninput=draw;$('filterReset').onclick=()=>{selected='';$('filterQuery').value='';draw()};$('filterApply').onclick=()=>{filters[k]=selected;render();updateCategories();closeSheet()};draw()
}
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>filterSheet(b.dataset.filter));
$('clear').onclick=()=>{Object.keys(filters).forEach(k=>filters[k]='');$('search').value='';render();updateCategories()};$('sort').onclick=()=>{sort=!sort;$('sort').setAttribute('aria-pressed',String(sort));render();toast(sort?'По названию':'Исходный порядок')};$('layout').onclick=()=>{grid=!grid;$('layout').setAttribute('aria-pressed',grid);render()};$('search').oninput=render;$('resetVisible').onclick=()=>$('clear').click();
function settings(){showSheet('Меню',`<div class="sheetrow"><div style="flex:1"><h3>Скругления интерфейса</h3><p>Вернуть мягкие углы карточек, кнопок и меню.</p></div><input type="checkbox" class="switch" aria-label="Скругления интерфейса" id="roundedUI" ${state.rounded?'checked':''}></div><div class="sheetrow"><div style="flex:1"><h3>Анимации интерфейса</h3><p>Плавные переходы и стеклянная навигация.</p></div><input type="checkbox" class="switch" aria-label="Анимации интерфейса" id="motion" ${state.motion?'checked':''}></div><div class="sheetrow"><div style="flex:1"><h3>Учитывать настройки системы</h3><p>Ограничивать движение, если это выбрано в системе.</p></div><input type="checkbox" class="switch" aria-label="Учитывать настройки системы" id="respectMotion" ${state.respectSystemMotion?'checked':''}></div><div class="sheetrow"><div style="flex:1"><h3>Анимации подарков</h3><p>Мягкое движение иллюстраций.</p></div><input type="checkbox" class="switch" id="giftMotion" aria-label="Анимации подарков" ${state.giftMotion?'checked':''}></div><div class="sheetrow"><div style="flex:1"><h3>Вибрация</h3><p>При нажатии, если устройство поддерживает.</p></div><input type="checkbox" class="switch" id="vibration" aria-label="Вибрация" ${state.vibration?'checked':''}></div><div class="sheetrow"><div><h3>Язык</h3><p>Русский</p></div></div><button class="choice" id="resetState">Сбросить данные <span>›</span></button><button class="choice" id="motionPreview">Проверить анимацию <span>›</span></button><p id="motionStatus" role="status">${motionStatus()}</p><p>MARKT · версия 13</p>`);$('motionPreview').onclick=()=>{if(!motionEnabled()){toast(motionStatus());return}const el=$('motionPreview');el.animate([{transform:'translateX(0)',backgroundColor:'#242424'},{transform:'translateX(7px)',backgroundColor:'#214365'},{transform:'translateX(0)',backgroundColor:'#242424'}],{duration:720,easing:'cubic-bezier(.22,.8,.3,1)'});toast('Анимации включены')};$('roundedUI').onchange=e=>{state.rounded=e.target.checked;save()};$('motion').onchange=e=>{state.motion=e.target.checked;save()};$('respectMotion').onchange=e=>{state.respectSystemMotion=e.target.checked;save()};$('giftMotion').onchange=e=>{state.giftMotion=e.target.checked;save()};$('vibration').onchange=e=>{state.vibration=e.target.checked;save()};$('resetState').onclick=()=>{showSheet('Сбросить данные?','<p>Будут удалены только баллы MARKT, коллекция и локальная статистика.</p>','<button class="white full" id="confirmReset">Сбросить</button>');$('confirmReset').onclick=()=>{state=defaults();save();render();closeSheet();toast('Данные сброшены')}}}
$('settingsBtn').onclick=$('openSettings').onclick=settings;$('about').onclick=()=>showSheet('MARKT','<p>MARKT — каталог коллекционных подарков для FluxoGram.</p><p>Графика: собственные SVG и фрагменты присланных референсов. Коллекция, баллы и настройки хранятся в браузере.</p>');$('balanceBtn').onclick=()=>showSheet('Баллы MARKT',`<div class="sheethero" style="background:radial-gradient(ellipse,#6c4c17,#2b2318)">${art('🌟')}</div><h2>${state.stars} ✦</h2><p>Баллы MARKT не имеют денежной стоимости. Покупка, обмен и вывод не предусмотрены.</p>`);
let running=false,score=0,deadline=0,timer;
function move(){let w=$('field').clientWidth,h=$('field').clientHeight;$('target').style.left=36+Math.random()*Math.max(1,w-72)+'px';$('target').style.top=36+Math.random()*Math.max(1,h-72)+'px'}
function finish(count){clearInterval(timer);running=false;$('target').hidden=true;$('intro').hidden=false;$('start').disabled=false;$('stop').disabled=true;$('start').textContent='Играть снова';$('gameTitle').textContent=count?'Раунд завершён':'Раунд остановлен';$('gameText').textContent=count?`Результат: ${score} очков.`:'Можно начать заново.';if(count){state.best=Math.max(state.best,score);state.played++;save();toast('Результат сохранён')}}
function tick(){let n=Math.max(0,Math.ceil((deadline-performance.now())/1000));$('time').textContent='00:'+String(n).padStart(2,'0');if(!n)finish(true)}
$('start').onclick=()=>{if(running)return;running=true;score=0;$('score').textContent='0';$('intro').hidden=true;$('target').hidden=false;$('start').disabled=true;$('stop').disabled=false;deadline=performance.now()+15000;move();tick();timer=setInterval(tick,100)};$('stop').onclick=()=>finish(false);$('target').onclick=()=>{if(!running)return;if(performance.now()>=deadline)return finish(true);score++;$('score').textContent=score;move()};$('rules').onclick=()=>showSheet('Правила арены','<p>Нажимай на синие цели в течение 15 секунд. Каждое попадание приносит одно очко.</p><p>Участие бесплатно, результат не влияет на баллы MARKT.</p>');
sync();render();


function updateCategories(){document.querySelectorAll('[data-category]').forEach(b=>(b.classList.toggle('active',b.dataset.category===filters.cat),b.setAttribute('aria-pressed',String(b.dataset.category===filters.cat))))}
document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{filters.cat=b.dataset.category;updateCategories();render()});
$('collectionBtn').onclick=()=>go('gifts');
$('previewGift').onclick=()=>{if(state.owned.length)detail(state.owned[0]);else showSheet('Просмотр',empty('Список подарков пуст','Добавь подарок каталога, чтобы открыть его карточку.'))};
document.addEventListener('click',e=>{if(state.vibration&&e.target.closest('button:not(:disabled)')&&navigator.vibrate)navigator.vibrate(12)});
const track=$('bannerTrack');let bannerIndex=0;
const dots=$('bannerDots');dots.innerHTML=[...track.children].map((_,i)=>`<button aria-label="Баннер ${i+1}" data-banner="${i}"></button>`).join('');
function banner(i){bannerIndex=(i+track.children.length)%track.children.length;track.style.setProperty('--banner',bannerIndex);dots.querySelectorAll('button').forEach((b,j)=>{b.classList.toggle('active',j===bannerIndex);b.setAttribute('aria-pressed',j===bannerIndex)})}
dots.querySelectorAll('button').forEach(b=>b.onclick=()=>banner(+b.dataset.banner));banner(0);
let gesture=null,suppressClickUntil=0;
track.addEventListener('pointerdown',e=>{if(!matchMedia('(max-width: 760px)').matches||e.button!==0)return;gesture={id:e.pointerId,x:e.clientX,y:e.clientY,swipe:false}});
track.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;let dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(!gesture.swipe&&Math.abs(dy)>20&&Math.abs(dy)>Math.abs(dx)){gesture=null;return}if(!gesture.swipe&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)){gesture.swipe=true;track.setPointerCapture(e.pointerId);track.classList.add('sliding')}if(gesture.swipe)track.style.setProperty('--drag',Math.max(-120,Math.min(120,dx))+'px')});
function finishBanner(e){if(!gesture||gesture.id!==e.pointerId)return;let dx=e.clientX-gesture.x,swipe=gesture.swipe;gesture=null;track.classList.remove('sliding');track.style.setProperty('--drag','0px');if(swipe){suppressClickUntil=performance.now()+400;if(e.type==='pointerup'&&Math.abs(dx)>35)banner(bannerIndex+(dx<0?1:-1))}}
track.addEventListener('pointerup',finishBanner);track.addEventListener('pointercancel',finishBanner);track.addEventListener('lostpointercapture',finishBanner);track.addEventListener('click',e=>{if(performance.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
setInterval(()=>{if(current==='market'&&overlay.hidden&&motionEnabled()&&!gesture&&matchMedia('(max-width: 760px)').matches&&!track.matches(':hover')&&!track.contains(document.activeElement))banner(bannerIndex+1)},8000);
go('market');

document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)finish(false)});


$('fullscreenToggle').onclick=()=>{initMiniApp();requestNativeFullscreen(true)};
initMiniApp();
window.addEventListener('resize',screenLayout);
window.addEventListener("focus",renderProfile);
window.addEventListener("hashchange",renderProfile);
window.addEventListener("load",initMiniApp,{once:true});
