/* Transportes Esmar - interacciones */
(function(){
  'use strict';

  const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  const JS_DAY_NAMES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  // minutos desde medianoche
  const M = (h,m)=>h*60+(m||0);

  // --- Datos de horarios ---
  const corridors = {
    'morelia-a': { label:'Apatzingán → Morelia',
      note:'Salidas desde Apatzingán hacia Morelia.',
      days:{
        'Lunes':   [M(4,30),M(5),M(6),M(7),M(8,30),M(9,30),M(10,30),M(12),M(13),M(14),M(15,30),M(16),M(17),M(18,30),M(20,30)],
        'Martes':  [M(4,30),M(5),M(6),M(7),M(8,30),M(9,30),M(10,30),M(12),M(13),M(14),M(15,30),M(16),M(17),M(18,30),M(19,30),M(20,30)],
        'Miércoles':[M(4,30),M(5),M(6),M(7),M(8,30),M(9,30),M(10,30),M(12),M(13),M(14),M(15,30),M(16),M(17),M(18,30),M(19,30),M(20,30)],
        'Jueves':  [M(4,30),M(5),M(6),M(7),M(8,30),M(9,30),M(10,30),M(12),M(13),M(14),M(15,30),M(16),M(17),M(18,30),M(19,30),M(20,30)],
        'Viernes': [M(4,30),M(5),M(6),M(7),M(8,30),M(9,30),M(10,30),M(12),M(13),M(14),M(15,30),M(16),M(17),M(18,30),M(20,30)],
        'Sábado':  [M(4,30),M(5),M(6),M(7),M(8,30),M(9,30),M(10,30),M(12),M(13),M(14),M(15,30),M(16),M(17),M(18,30),M(20,30)],
        'Domingo': [M(6),M(7,30),M(8,30),M(9),M(10,30),M(12),M(14),M(15,30),M(16),M(17),M(18,30),M(20,30)]
      }
    },
    'morelia-b': { label:'Morelia → Apatzingán',
      note:'Salidas desde Morelia hacia Apatzingán.',
      days:{
        'Lunes':   [M(5),M(6),M(7),M(8),M(9),M(10),M(11),M(12),M(13),M(14),M(15,30),M(16,30),M(17,30),M(18,30),M(19),M(20),M(21)],
        'Martes':  [M(6),M(7),M(8),M(9),M(10),M(11),M(12),M(13),M(14),M(15,30),M(16,30),M(17,30),M(18,30),M(19),M(20),M(21,20)],
        'Miércoles':[M(6),M(7),M(8),M(9),M(10),M(11),M(12),M(13),M(14),M(15,30),M(16,30),M(17,30),M(18,30),M(19),M(20),M(21,20)],
        'Jueves':  [M(6),M(7),M(8),M(9),M(10),M(11),M(12),M(13),M(14),M(15,30),M(16,30),M(17,30),M(18,30),M(19),M(20),M(21,20)],
        'Viernes': [M(6),M(7),M(8),M(9),M(10),M(11),M(12),M(13),M(14),M(15,30),M(16,30),M(17,30),M(18,30),M(19),M(20),M(21,20)],
        'Sábado':  [M(6),M(7),M(8),M(9),M(10),M(11),M(12),M(13),M(14),M(15,30),M(16,30),M(17,30),M(18,30),M(19),M(20),M(21,20)],
        'Domingo': [M(7),M(8),M(9),M(10),M(11),M(12,30),M(14),M(15,30),M(17,30),M(18,30),M(19),M(20),M(21,20)]
      }
    },
    'gdl': { label:'Guadalajara · Uruapan · Apatzingán',
      note:'Salidas diarias. También servimos la ruta Apatzingán/Uruapan ⇄ Hotel RIU y Aeropuerto GDL.',
      days:{
        'Lunes':   [M(10),M(12),M(16)],
        'Martes':  [M(10),M(12),M(16)],
        'Miércoles':[M(10),M(16)],
        'Jueves':  [M(10),M(12),M(16)],
        'Viernes': [M(10),M(12),M(16)],
        'Sábado':  [M(10),M(12),M(16)],
        'Domingo': [M(10),M(12),M(16)]
      }
    },
    'morelia-leon': { label:'Morelia → León',
      note:'Salidas de Morelia hacia León.',
      days:{
        'Lunes':   [M(10,30),M(19,30)],
        'Martes':  [],
        'Miércoles':[],
        'Jueves':  [],
        'Viernes': [M(12),M(19,30)],
        'Sábado':  [M(10,30),M(19,30)],
        'Domingo': [M(12),M(19,30)]
      }
    },
    'leon-morelia': { label:'León → Morelia',
      note:'Salidas de León hacia Morelia.',
      days:{
        'Lunes':   [M(6),M(16)],
        'Martes':  [M(7)],
        'Miércoles':[],
        'Jueves':  [],
        'Viernes': [M(16)],
        'Sábado':  [M(7),M(16)],
        'Domingo': [M(7),M(16)]
      }
    }
  };

  const fmt = (min)=>{
    let h = Math.floor(min/60), m = min%60;
    const ap = h>=12?'PM':'AM';
    let h12 = h%12; if(h12===0)h12=12;
    return h12 + (m?':'+String(m).padStart(2,'0'):':00') + ' ' + ap;
  };

  const todayKey = ()=> JS_DAY_NAMES[new Date().getDay()];

  let state = { route:'morelia', dir:'morelia-a', day: todayKey() };

  const hrRoutes = document.getElementById('hrRoutes');
  const hrDir = document.getElementById('hrDir');
  const hrDays = document.getElementById('hrDays');
  const hrChips = document.getElementById('hrChips');
  const hrPanelHead = document.getElementById('hrPanelHead');
  const nextDir = document.getElementById('nextDirection');
  const nextTime = document.getElementById('nextTime');
  const nextWhen = document.getElementById('nextWhen');
  const gdlinfo = document.getElementById('gdlinfo');

  const SCHEDULE_ROUTES = {
    morelia: { name:'Apatzingán ⇄ Morelia', dirs:[ {key:'morelia-a', label:'Apatzingán → Morelia'}, {key:'morelia-b', label:'Morelia → Apatzingán'} ] },
    gdl: { name:'Guadalajara', dirs:[ {key:'gdl', label:'Guadalajara · Uruapan · Apatzingán'} ] },
    leon: { name:'Morelia ⇄ León', dirs:[ {key:'morelia-leon', label:'Morelia → León'}, {key:'leon-morelia', label:'León → Morelia'} ] }
  };
  const DIRTOROUTE = { 'morelia-a':'morelia','morelia-b':'morelia','gdl':'gdl','morelia-leon':'leon','leon-morelia':'leon' };
  const to24h = (label)=>{
    const m = label.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
    if(!m) return '';
    let h = parseInt(m[1],10)%12; if(m[3] && m[3].toUpperCase()==='PM') h+=12;
    return String(h).padStart(2,'0') + ':' + (m[2]||'00');
  };

  function updateGdlInfo(){ gdlinfo.classList.toggle('show', state.route === 'gdl'); }

  function renderHrDir(){
    const route = SCHEDULE_ROUTES[state.route];
    hrDir.innerHTML = '';
    route.dirs.forEach(d=>{
      const b = document.createElement('button');
      b.className = 'hr-dir-btn' + (d.key===state.dir ? ' is-active':'');
      b.textContent = d.label;
      b.addEventListener('click', ()=>{ state.dir = d.key; renderHrDir(); renderHrChips(); renderNext(); });
      hrDir.appendChild(b);
    });
    hrDir.style.display = route.dirs.length>1 ? 'flex' : 'none';
  }

  function renderHrDays(){
    hrDays.innerHTML = '';
    DAYS.forEach(d=>{
      const b = document.createElement('button');
      b.className = 'hr-day-btn' + (d===state.day ? ' is-active':'');
      b.textContent = d;
      b.addEventListener('click', ()=>{ state.day = d; renderHrDays(); renderHrChips(); renderNext(); });
      hrDays.appendChild(b);
    });
  }

  function reserveFromTime(dirKey, label){
    const rk = DIRTOROUTE[dirKey] || 'morelia';
    populateOd(rk);
    rutaSelect.value = rk;
    const hora = document.getElementById('horaInput');
    if(hora) hora.value = to24h(label);
    // iniciar fecha en hoy
    const now = new Date();
    const mesS = document.getElementById('mesSelect');
    const diaS = document.getElementById('diaSelect');
    if(mesS && diaS){ fillMes(); mesS.value = now.getMonth(); fillDia(); diaS.value = now.getDate(); }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function renderHrChips(){
    const c = corridors[state.dir];
    const times = c.days[state.day] || [];
    hrPanelHead.textContent = c.label + ' · ' + state.day;
    hrChips.innerHTML = '';
    if(!times.length){
      hrChips.innerHTML = '<span class="hr-empty">No hay salidas este día.</span>';
      return;
    }
    times.forEach(t=>{
      const label = fmt(t);
      const b = document.createElement('button');
      b.className = 'hr-chip'; b.type = 'button'; b.textContent = label;
      b.addEventListener('click', ()=>reserveFromTime(state.dir, label));
      hrChips.appendChild(b);
    });
  }

  function renderNext(){
    const c = corridors[state.dir];
    nextDir.textContent = c.label;
    const now = new Date();
    const cur = now.getHours()*60 + now.getMinutes();
    const DAY_ORDER = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
    const today = todayKey();
    const idx = DAY_ORDER.indexOf(today);
    const timesToday = c.days[today] || [];
    const nxt = timesToday.find(t=>t>cur);
    if(nxt !== undefined){ nextWhen.textContent = '· hoy'; nextTime.textContent = fmt(nxt); return; }
    for(let k=1;k<=7;k++){
      const day = DAY_ORDER[(idx+k)%7];
      const t = (c.days[day] || [])[0];
      if(t !== undefined){ nextWhen.textContent = '· ' + (k===1 ? 'mañana' : day.toLowerCase()); nextTime.textContent = fmt(t); return; }
    }
    nextWhen.textContent = ''; nextTime.textContent = '—';
  }

  function selectRoute(key){
    state.route = key;
    const route = SCHEDULE_ROUTES[key];
    state.dir = route.dirs[0].key;
    hrRoutes.querySelectorAll('.hr-route-btn').forEach(b=>b.classList.toggle('is-active', b.dataset.route===key));
    renderHrDir(); renderHrDays(); renderHrChips(); renderNext(); updateGdlInfo();
  }
  hrRoutes.addEventListener('click', e=>{
    const b = e.target.closest('.hr-route-btn'); if(!b) return;
    selectRoute(b.dataset.route);
  });

  // nav toggle
  const navtoggle = document.getElementById('navtoggle');
  const nav = document.getElementById('nav');
  navtoggle.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    navtoggle.classList.toggle('open', open);
    navtoggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    nav.classList.remove('open'); navtoggle.classList.remove('open');
  }));

  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // init
  selectRoute('morelia');

  // ---- Modal de reserva (armar mensaje de WhatsApp) ----
  const WA = '524531314437';
  const modal = document.getElementById('reserveModal');
  const rmForm = document.getElementById('reserveForm');
  const rutaSelect = document.getElementById('rutaSelect');
  const origenSelect = document.getElementById('origenSelect');
  const destinoSelect = document.getElementById('destinoSelect');
  const invertBtn = document.getElementById('invertBtn');
  const diaSelect = document.getElementById('diaSelect');
  const mesSelect = document.getElementById('mesSelect');
  const priceLine = document.getElementById('priceLine');
  const pasajerosInput = document.getElementById('pasajerosInput');
  const horaInput = document.getElementById('horaInput');
  const reserveError = document.getElementById('reserveError');

  // Puntos (paradas) disponibles por ruta
  const ROUTE_MAP = {
    'Apatzingán ⇄ Morelia': 'morelia',
    'Apatzingán / Uruapan ⇄ Guadalajara': 'gdl',
    'Morelia ⇄ León': 'leon'
  };
  const routePoints = {
    morelia: { label:'Apatzingán ⇄ Morelia', defaultDest:'Morelia Centro', points:['Apatzingán','San Antonio','Parácuaro','Uspéro','Antúnez','Cénidor','4 Caminos','Morelia Centro','Niño / INAPAM'] },
    gdl: { label:'Apatzingán / Uruapan ⇄ Guadalajara', defaultDest:'Guadalajara', points:['Apatzingán','Uruapan','Guadalajara','Aeropuerto GDL','Hotel RIU'] },
    leon: { label:'Morelia ⇄ León', defaultDest:'León (Centro Max)', points:['Morelia','Xangari','Salamanca','Irapuato','Silao','León (Centro Max)'] }
  };

  // --- Precios por ruta/parada ---
  const fares = {
    morelia: function(dest){
      if(dest==='Niño / INAPAM') return 230;
      if(dest==='4 Caminos') return 260;
      if(['Morelia Centro','Cénidor','Apatzingán'].indexOf(dest)>-1) return 280;
      return null; // paradas intermedias sin tarifa publicada
    },
    gdl: function(o,d){
      const pair = (x,y)=> (o===x&&d===y)||(o===y&&d===x);
      if(pair('Apatzingán','Guadalajara')) return 700;
      if(pair('Apatzingán','Aeropuerto GDL')||pair('Apatzingán','Hotel RIU')) return 900;
      if(pair('Uruapan','Guadalajara')) return 350;
      if(pair('Uruapan','Aeropuerto GDL')||pair('Uruapan','Hotel RIU')) return 600;
      return null;
    },
    leon: function(){ return null; } // precios por confirmar
  };
  function getPrice(key,o,d){
    if(key==='morelia') return fares.morelia(d);
    if(key==='gdl') return fares.gdl(o,d);
    return null;
  }
  function updatePrice(){
    const p = getPrice(rutaSelect.value, origenSelect.value, destinoSelect.value);
    priceLine.innerHTML = '💳 Precio del boleto: <strong>' + (p!=null ? '$'+p : 'a confirmar') + '</strong>';
  }

  function populateOd(key){
    const data = routePoints[key] || routePoints.morelia;
    rutaSelect.value = key;
    origenSelect.innerHTML = '';
    destinoSelect.innerHTML = '';
    data.points.forEach(p=>{
      origenSelect.add(new Option(p, p));
      destinoSelect.add(new Option(p, p));
    });
    origenSelect.value = data.points[0];
    destinoSelect.value = data.defaultDest || data.points[data.points.length-1];
    updatePrice();
  }

  // --- Fecha Día / Mes ---
  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  function fillMes(){
    mesSelect.innerHTML = '';
    MESES.forEach((m,i)=> mesSelect.add(new Option(m, i)));
  }
  function fillDia(){
    const y = new Date().getFullYear();
    const m = parseInt(mesSelect.value,10);
    const dim = new Date(y, m+1, 0).getDate();
    const cur = parseInt(diaSelect.value,10) || 1;
    diaSelect.innerHTML = '';
    for(let dd=1; dd<=dim; dd++) diaSelect.add(new Option(dd, dd));
    if(diaSelect.options.length>=cur) diaSelect.value = cur;
  }
  function resolveFecha(){
    const y0 = new Date().getFullYear();
    const m = parseInt(mesSelect.value,10);
    const dd = parseInt(diaSelect.value,10);
    let dt = new Date(y0, m, dd);
    const today = new Date(); today.setHours(0,0,0,0);
    if(dt < today) dt = new Date(y0+1, m, dd);
    return dt;
  }

  function openModal(route){
    const key = ROUTE_MAP[route] || rutaSelect.value || 'morelia';
    populateOd(key);
    fillMes();
    const now = new Date();
    mesSelect.value = now.getMonth();
    fillDia(); diaSelect.value = now.getDate();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.j-reserve').forEach(b=>{
    b.addEventListener('click', ()=>openModal(b.getAttribute('data-route') || ''));
  });
  modal.addEventListener('click', e=>{ if(e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

  rutaSelect.addEventListener('change', ()=>populateOd(rutaSelect.value));
  origenSelect.addEventListener('change', updatePrice);
  destinoSelect.addEventListener('change', updatePrice);
  mesSelect.addEventListener('change', fillDia);
  invertBtn.addEventListener('click', ()=>{
    const t = origenSelect.value;
    origenSelect.value = destinoSelect.value;
    destinoSelect.value = t;
    updatePrice();
  });

  rmForm.addEventListener('submit', e=>{
    e.preventDefault();
    const key = rutaSelect.value;
    const label = routePoints[key] ? routePoints[key].label : rutaSelect.value;
    const origen = origenSelect.value;
    const destino = destinoSelect.value;
    const dt = resolveFecha();
    const pas = pasajerosInput.value;
    const hora = horaInput.value;
    reserveError.hidden = true;
    const f = dt.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    let msg = 'Hola Transportes Esmar 👋\nQuiero reservar:\n';
    msg += '• Ruta: ' + label + '\n';
    msg += '• Origen: ' + origen + '\n';
    msg += '• Destino: ' + destino + '\n';
    msg += '• Fecha: ' + f + '\n';
    if(hora) msg += '• Horario: ' + hora + '\n';
    msg += '• Pasajeros: ' + pas + '\n';
    const p = getPrice(key, origen, destino);
    if(p!=null) msg += '• Precio: $' + p + '\n';
    msg += '\n¿Está disponible? Gracias.';
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank');
    closeModal();
  });

  // init modal
  populateOd(rutaSelect.value);
  fillMes();

  // ---- Rotación de la foto principal ----
  const slides = document.querySelectorAll('.hero__slide');
  if(slides.length > 1){
    let idx = 0;
    setInterval(()=>{
      slides[idx].classList.remove('is-active');
      idx = (idx+1) % slides.length;
      slides[idx].classList.add('is-active');
    }, 5200);
  }

  // PWA: registrar service worker (solo https/localhost)
  if('serviceWorker' in navigator && (location.protocol==='https:' || ['localhost','127.0.0.1'].includes(location.hostname))){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('sw.js').catch(()=>{});
    });
  }
})();
