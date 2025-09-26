// ====== DATOS DE SALAS ======
const SALAS = [
  {
    id: "intro",
    nombre: "Sala: Introductoria",
    tiempo: "15 minutos",
    imagen: "images/introductoria.jpg",
    temas: ["Bienvenida al museo","Contexto histórico","Objetos destacados","Cómo navegar la exhibición"]
  },
  {
    id: "arqueo",
    nombre: "Sala: Arqueológica",
    tiempo: "15 minutos",
    imagen: "images/arqueologica.jpg",
    temas: ["Culturas prehispánicas","Cerámica","Herramientas","Rituales y cosmovisión"]
  },
  {
    id: "etno",
    nombre: "Sala: Etnohistoria",
    tiempo: "12 minutos",
    imagen: "images/Etnohistoria.jpg",
    temas: ["Pueblos originarios","Vestimenta","Música y danza","Arte popular"]
  }
];

// ====== REFERENCIAS ======
const btnRecorrido     = document.getElementById('btn-recorrido');
const hero             = document.getElementById('hero');
const brandTop         = document.getElementById('brandTop');
const screenRecorrido  = document.getElementById('screen-recorrido');
const seccionSalas     = document.getElementById('seccion-salas');
const cards            = document.getElementById('cards');

const modal       = document.getElementById('salaModal');
const modalImg    = document.getElementById('modalImg');
const modalTitle  = document.getElementById('modalTitle');
const modalMeta   = document.getElementById('modalMeta');
const temas       = document.getElementById('temas');
const openSala    = document.getElementById('openSala');
const prevSala    = document.getElementById('prevSala');
const nextSala    = document.getElementById('nextSala');

// GUIABot refs
const gbDialog = document.getElementById('guiabotDialog');
const gbBox    = gbDialog.querySelector('.modal.guiabot-style'); // cuadro del modal
const gbTitle  = document.getElementById('gbTitle');
const gbStart  = document.getElementById('gbStart');

let currentIndex = 0;

// ====== RENDER TARJETAS ======
function renderCards(){
  if (cards.children.length) return; // evita duplicar
  cards.innerHTML = '';
  SALAS.forEach((s, idx)=>{
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
      <img src="${s.imagen}" alt="${s.nombre}">
      <div class="card-info">
        <h3>${s.nombre}</h3>
        <p>Tiempo estimado: ${s.tiempo}</p>
      </div>
    `;
    article.addEventListener('click', ()=> openModal(idx));
    article.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openModal(idx); }});
    article.tabIndex = 0;
    article.setAttribute('role','button');
    cards.appendChild(article);
  });
}

// ====== MODAL PRINCIPAL ======
function openModal(index){
  currentIndex = index;
  renderModal();
  if(typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open','');
}
function renderModal(){
  const s = SALAS[currentIndex];
  modalImg.src = s.imagen;
  modalImg.alt = s.nombre;
  modalTitle.textContent = s.nombre;
  modalMeta.textContent = `Tiempo estimado: ${s.tiempo}`;
  temas.innerHTML = '';
  s.temas.forEach(t =>{
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = t;
    temas.appendChild(span);
  });
  openSala.onclick = ()=> openGUIABot(s);
}
prevSala.addEventListener('click', ()=> { currentIndex = (currentIndex - 1 + SALAS.length) % SALAS.length; renderModal(); });
nextSala.addEventListener('click', ()=> { currentIndex = (currentIndex + 1) % SALAS.length; renderModal(); });
window.addEventListener('keydown', (e)=>{
  if(modal.open){
    if(e.key === 'ArrowLeft') prevSala.click();
    if(e.key === 'ArrowRight') nextSala.click();
    if(e.key === 'Escape') modal.close();
  }
});

// ====== PANTALLA INDEPENDIENTE: mostrar/ocultar ======
function showRecorrido(){
  // Oculta home
  hero.classList.add('hidden');
  if (brandTop) brandTop.classList.add('hidden');

  // Muestra pantalla
  screenRecorrido.classList.remove('hidden');
  screenRecorrido.setAttribute('aria-hidden','false');

  // Render cards si hace falta
  renderCards();

  // Historial para botón Atrás
  history.pushState({view:'recorrido'}, '', '#recorrido');

  // Enfocar el título
  document.getElementById('recorrido-titulo')?.focus?.();
}
function showHome(replaceHash = true){
  screenRecorrido.classList.add('hidden');
  screenRecorrido.setAttribute('aria-hidden','true');

  hero.classList.remove('hidden');
  if (brandTop) brandTop.classList.remove('hidden');

  if (replaceHash && location.hash === '#recorrido'){
    history.replaceState({}, '', location.pathname + location.search);
  }
}

btnRecorrido.addEventListener('click', (e)=>{
  e.preventDefault();
  showRecorrido();
});
window.addEventListener('popstate', (e)=>{
  if (e.state?.view === 'recorrido') showRecorrido();
  else showHome(false);
});
if (location.hash === '#recorrido') showRecorrido();

// ====== MODAL GUIABot (estilo propio con fondo de la sala) ======
function openGUIABot(sala){
  if(modal.open) modal.close(); // cierra el modal principal

  // Fondo del cuadro del modal GUIABot
  gbBox.style.setProperty('--gb-panel-image', `url('${sala.imagen}')`);

  // Título dinámico
  gbTitle.textContent = `¿Deseas que el GUIABot te guíe a la ${sala.nombre}?`;

  if(typeof gbDialog.showModal === 'function') gbDialog.showModal();
  else gbDialog.setAttribute('open','');
}

// Acción del botón iniciar (ajusta aquí la navegación real)
gbStart.addEventListener('click', ()=>{
  const sala = SALAS[currentIndex];
  // Ejemplo: redirigir a una página de la sala
  // window.location.href = `salas/${sala.id}.html`;
  alert(`Iniciando recorrido con GUIABot en ${sala.nombre}`);
  gbDialog.close();
});

// Limpieza cuando se cierre el GUIABot
gbDialog.addEventListener('close', ()=>{
  gbBox.style.removeProperty('--gb-panel-image');
});

// API pública mínima (si la necesitas en consola)
window.GUIABotModal = { open: openGUIABot, close: ()=> gbDialog.close() };
