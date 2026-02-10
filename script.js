/*******************************************************
 * LECTU-TRACK (StackBlitz) - Lógica principal
 * HTML5 + CSS3 + JavaScript
 *
 * Funcionalidad:
 * - CRUD de lecturas (manga/libro/comic)
 * - Progreso dinámico por tipo
 * - Nota de contexto
 * - Filtros + buscador
 * - Persistencia LocalStorage
 *
 * IMPORTANTE:
 * - Este archivo asume que en tu index.html existen
 *   elementos con los IDs indicados abajo.
 *
 * TAREA PENDIENTE PARA ARATH:
 * - Implementar exportación/importación JSON (opcional)
 *   -> Ver función TODO al final.
 *******************************************************/

/* ==========================
   1) SELECTORES (IDs esperados)
   ========================== */

// Form y campos base
const form = document.getElementById("formLectura");
const inputTitulo = document.getElementById("titulo");
const selectTipo = document.getElementById("tipo");
const selectEstado = document.getElementById("estado");
const inputNota = document.getElementById("nota");

// Controles extra (buscar/filtros)
const inputBuscar = document.getElementById("buscar");
const filtroEstado = document.getElementById("filtroEstado");
const filtroTipo = document.getElementById("filtroTipo");

// Zona de lista
const lista = document.getElementById("listaLecturas");

// Botones del form
const btnSubmit = document.getElementById("btnGuardar");
const btnCancelarEdicion = document.getElementById("btnCancelar");

// Contadores (opcionales pero recomendados)
const contadorTotal = document.getElementById("countTotal");
const contadorPendiente = document.getElementById("countPendiente");
const contadorLeyendo = document.getElementById("countLeyendo");
const contadorTerminado = document.getElementById("countTerminado");

// Secciones dinámicas de progreso (contenedores)
const boxManga = document.getElementById("boxManga");
const boxLibro = document.getElementById("boxLibro");
const boxComic = document.getElementById("boxComic");

// Inputs dinámicos (progreso)
const mangaTomo = document.getElementById("mangaTomo");
const mangaPagina = document.getElementById("mangaPagina");

const libroCapitulo = document.getElementById("libroCapitulo");
const libroPagina = document.getElementById("libroPagina"); // opcional

const comicVolumen = document.getElementById("comicVolumen");
const comicPagina = document.getElementById("comicPagina");


/* ==========================
   2) ESTADO GLOBAL (en memoria)
   ========================== */

const STORAGE_KEY = "lecturas_app_v1";

// Array principal de lecturas
let lecturas = [];

// Cuando editamos, guardamos el id aquí
let editId = null;


/* ==========================
   3) HELPERS (utilidad)
   ========================== */

// Genera id simple
function makeId() {
  return String(Date.now()) + "_" + Math.random().toString(16).slice(2);
}

// Guardar en LocalStorage
function saveStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lecturas));
}

// Cargar desde LocalStorage
function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    lecturas = raw ? JSON.parse(raw) : [];
  } catch (e) {
    lecturas = [];
  }
}

// Limpia inputs del formulario
function resetForm() {
  form.reset();
  editId = null;

  // Re-activar modo "Agregar"
  btnSubmit.textContent = "Agregar";
  btnCancelarEdicion.classList.add("hidden");

  // Restaurar campos dinámicos segun tipo actual (o default)
  updateDynamicFields(selectTipo.value);

  // Limpiar valores de inputs dinámicos (por si el navegador no resetea bien)
  mangaTomo.value = "";
  mangaPagina.value = "";
  libroCapitulo.value = "";
  libroPagina.value = "";
  comicVolumen.value = "";
  comicPagina.value = "";
  inputNota.value = "";
}

// Aplica show/hide según tipo
function updateDynamicFields(tipo) {
  // Ocultamos todo
  boxManga.classList.add("hidden");
  boxLibro.classList.add("hidden");
  boxComic.classList.add("hidden");

  // Mostramos solo lo que aplica
  if (tipo === "Manga") boxManga.classList.remove("hidden");
  if (tipo === "Libro") boxLibro.classList.remove("hidden");
  if (tipo === "Comic") boxComic.classList.remove("hidden");
}

// Formatea texto del progreso para mostrar en tarjeta
function formatProgreso(item) {
  const t = item.tipo;
  const p = item.progreso || {};

  if (t === "Manga") {
    const tomo = p.tomo ?? "-";
    const pag = p.pagina ?? "-";
    return `Tomo ${tomo} • Página ${pag}`;
  }
  if (t === "Libro") {
    const cap = p.capitulo ?? "-";
    const pag = p.pagina ?? null; // opcional
    return pag ? `Capítulo ${cap} • Página ${pag}` : `Capítulo ${cap}`;
  }
  if (t === "Comic") {
    const vol = p.volumen ?? "-";
    const pag = p.pagina ?? "-";
    return `Volumen ${vol} • Página ${pag}`;
  }
  return "";
}

// Devuelve una "clase" (para CSS) según estado
function estadoClass(estado) {
  if (estado === "Pendiente") return "badge-pendiente";
  if (estado === "Leyendo") return "badge-leyendo";
  if (estado === "Terminado") return "badge-terminado";
  return "";
}

// Contadores (opcional)
function updateCounters(items) {
  if (!contadorTotal) return; // si no existen, no truena

  const total = items.length;
  const p = items.filter(x => x.estado === "Pendiente").length;
  const l = items.filter(x => x.estado === "Leyendo").length;
  const t = items.filter(x => x.estado === "Terminado").length;

  contadorTotal.textContent = total;
  contadorPendiente.textContent = p;
  contadorLeyendo.textContent = l;
  contadorTerminado.textContent = t;
}


/* ==========================
   4) CRUD (crear, editar, eliminar)
   ========================== */

// Construye un objeto lectura desde el formulario
function buildLecturaFromForm() {
  const titulo = inputTitulo.value.trim();
  const tipo = selectTipo.value;
  const estado = selectEstado.value;
  const nota = inputNota.value.trim();

  // Validación mínima
  if (!titulo) {
    alert("Pon un título, bro 😅");
    return null;
  }

  // Progreso dinámico por tipo
  let progreso = {
    tomo: null,
    capitulo: null,
    volumen: null,
    pagina: null
  };

  if (tipo === "Manga") {
    progreso.tomo = mangaTomo.value ? Number(mangaTomo.value) : null;
    progreso.pagina = mangaPagina.value ? Number(mangaPagina.value) : null;
  }

  if (tipo === "Libro") {
    progreso.capitulo = libroCapitulo.value ? Number(libroCapitulo.value) : null;
    // Página opcional en libros
    progreso.pagina = libroPagina.value ? Number(libroPagina.value) : null;
  }

  if (tipo === "Comic") {
    progreso.volumen = comicVolumen.value ? Number(comicVolumen.value) : null;
    progreso.pagina = comicPagina.value ? Number(comicPagina.value) : null;
  }

  return {
    id: editId ? editId : makeId(),
    titulo,
    tipo,
    estado,
    progreso,
    nota,
    updatedAt: new Date().toISOString(),
    createdAt: editId ? undefined : new Date().toISOString()
  };
}

// Crear o actualizar según editId
function upsertLectura() {
  const obj = buildLecturaFromForm();
  if (!obj) return;

  if (!editId) {
    // CREATE
    lecturas.unshift(obj); // lo mete al inicio
  } else {
    // UPDATE
    lecturas = lecturas.map(x => (x.id === editId ? { ...x, ...obj } : x));
  }

  saveStorage();
  render();
  resetForm();
}

// Cargar datos de una lectura al formulario (modo edición)
function setEditMode(id) {
  const item = lecturas.find(x => x.id === id);
  if (!item) return;

  editId = id;

  // Cambiar UI a modo edición
  btnSubmit.textContent = "Guardar cambios";
  btnCancelarEdicion.classList.remove("hidden");

  // Llenar campos
  inputTitulo.value = item.titulo;
  selectTipo.value = item.tipo;
  selectEstado.value = item.estado;
  inputNota.value = item.nota || "";

  // Mostrar campos correctos
  updateDynamicFields(item.tipo);

  // Llenar progreso
  const p = item.progreso || {};
  if (item.tipo === "Manga") {
    mangaTomo.value = p.tomo ?? "";
    mangaPagina.value = p.pagina ?? "";
  }
  if (item.tipo === "Libro") {
    libroCapitulo.value = p.capitulo ?? "";
    libroPagina.value = p.pagina ?? "";
  }
  if (item.tipo === "Comic") {
    comicVolumen.value = p.volumen ?? "";
    comicPagina.value = p.pagina ?? "";
  }

  // Llevar al top (mobile friendly)
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Eliminar con confirmación
function deleteLectura(id) {
  const item = lecturas.find(x => x.id === id);
  if (!item) return;

  const ok = confirm(`¿Seguro que quieres borrar "${item.titulo}"?`);
  if (!ok) return;

  lecturas = lecturas.filter(x => x.id !== id);
  saveStorage();
  render();

  // Si justo estaba editando esa lectura, cancelamos edición
  if (editId === id) resetForm();
}

// Cambiar estado rápido (ciclo)
function cycleEstado(id) {
  const order = ["Pendiente", "Leyendo", "Terminado"];

  lecturas = lecturas.map(x => {
    if (x.id !== id) return x;

    const idx = order.indexOf(x.estado);
    const next = order[(idx + 1) % order.length];
    return { ...x, estado: next, updatedAt: new Date().toISOString() };
  });

  saveStorage();
  render();
}


/* ==========================
   5) FILTROS + BÚSQUEDA
   ========================== */

function getFilteredList() {
  const q = (inputBuscar?.value || "").trim().toLowerCase();
  const fEstado = (filtroEstado?.value || "Todos");
  const fTipo = (filtroTipo?.value || "Todos");

  return lecturas.filter(item => {
    const matchQ = !q || item.titulo.toLowerCase().includes(q);
    const matchEstado = fEstado === "Todos" || item.estado === fEstado;
    const matchTipo = fTipo === "Todos" || item.tipo === fTipo;
    return matchQ && matchEstado && matchTipo;
  });
}


/* ==========================
   6) RENDER (pinta tarjetas)
   ========================== */

function render() {
  const items = getFilteredList();

  // contadores (mejor que sea sobre el total real, no el filtrado)
  updateCounters(lecturas);

  if (!lista) return;

  if (items.length === 0) {
    lista.innerHTML = `
      <div class="empty">
        <p>No hay lecturas con esos filtros 👀</p>
        <small>Tip: prueba “Todos” o agrega una nueva lectura arriba.</small>
      </div>
    `;
    return;
  }

  lista.innerHTML = items
    .map(item => {
      const progresoText = formatProgreso(item);

      return `
        <article class="card">
          <div class="card-top">
            <h3 class="title">${escapeHtml(item.titulo)}</h3>
            <div class="badges">
              <span class="badge badge-tipo">${escapeHtml(item.tipo)}</span>
              <span class="badge ${estadoClass(item.estado)}">${escapeHtml(item.estado)}</span>
            </div>
          </div>

          <div class="card-body">
            <p class="progreso"><strong>Progreso:</strong> ${escapeHtml(progresoText)}</p>
            ${
              item.nota
                ? `<p class="nota"><strong>Nota:</strong> ${escapeHtml(item.nota)}</p>`
                : `<p class="nota muted">Sin nota de contexto.</p>`
            }
          </div>

          <div class="card-actions">
            <button class="btn" data-action="estado" data-id="${item.id}">
              Cambiar estado
            </button>

            <button class="btn btn-secondary" data-action="edit" data-id="${item.id}">
              Editar
            </button>

            <button class="btn btn-danger" data-action="delete" data-id="${item.id}">
              Eliminar
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

// Evitar inyección en innerHTML
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* ==========================
   7) EVENTOS (interacción)
   ========================== */

function bindEvents() {
  // Tipo -> mostrar/ocultar campos dinámicos
  selectTipo.addEventListener("change", e => {
    updateDynamicFields(e.target.value);
  });

  // Form submit -> crear/editar
  form.addEventListener("submit", e => {
    e.preventDefault();
    upsertLectura();
  });

  // Cancelar edición
  btnCancelarEdicion.addEventListener("click", () => {
    resetForm();
  });

  // Delegación de eventos en lista (edit/delete/estado)
  lista.addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "edit") setEditMode(id);
    if (action === "delete") deleteLectura(id);
    if (action === "estado") cycleEstado(id);
  });

  // Buscador en vivo
  if (inputBuscar) {
    inputBuscar.addEventListener("input", () => render());
  }

  // Filtros
  if (filtroEstado) {
    filtroEstado.addEventListener("change", () => render());
  }
  if (filtroTipo) {
    filtroTipo.addEventListener("change", () => render());
  }
}


/* ==========================
   8) INIT (arranque)
   ========================== */

function init() {
  loadStorage();
  updateDynamicFields(selectTipo.value); // por si default es Manga/Libro/Comic
  bindEvents();
  render();
}


/*  Toggle de tema  */
const themeSwitch = document.getElementById('theme-switch');
const themeLabel = document.querySelector('.theme-label');
const body = document.body;

if (themeSwitch) {
  themeSwitch.addEventListener('change', function() {
    if (this.checked) {
      body.classList.add('light-mode');
      themeLabel.textContent = '☀️ Modo claro';
    } else {
      body.classList.remove('light-mode');
      themeLabel.textContent = '🌙 Modo oscuro';
    }
  });
}
// Arrancar
init();


/* ==========================
   9) FUNCIÓN PENDIENTE (ARATH)
   ========================== */

/**
 * TODO (ARATH): Exportar e importar lecturas a JSON
 *
 * Idea:
 * - export: tomar lecturas[], convertir a JSON bonito,
 *           y descargar un archivo .json
 * - import: seleccionar un archivo .json, parsearlo,
 *           validar estructura, reemplazar o mezclar
 *           con lecturas actuales, guardar y renderizar
 *
 * Firma sugerida:
 *   exportLecturasJSON()
 *   importLecturasJSON(file)
 *
 * NOTA: No romper el flujo. Solo agregar botones
 * en UI y llamar estas funciones.
 */
function exportLecturasJSON() {
  // TODO: Arath implementa esto
}

function importLecturasJSON(file) {
  // TODO: Arath implementa esto
}