const estado = { productos: [], carrito: JSON.parse(localStorage.getItem('takeaway_carrito') || '[]') }

function guardar() { localStorage.setItem('takeaway_carrito', JSON.stringify(estado.carrito)) }
function formatearPrecio(n) { const v = parseFloat(n) || 0; return `$${v.toFixed(2)}` }

const RATING = { MIN: 1, MAX: 5, STAR_FILLED: '★', STAR_EMPTY: '☆' }
function getStarRating(calificacion) { if (!calificacion) return ''; const r = Math.min(RATING.MAX, Math.max(RATING.MIN, Math.round(parseFloat(calificacion)))); return RATING.STAR_FILLED.repeat(r) + RATING.STAR_EMPTY.repeat(RATING.MAX - r) }
function getRatingText(calificacion) { if (!calificacion) return ''; return `${Math.round(parseInt(calificacion))}/${RATING.MAX}` }

async function cargarProductos() {
  const res = await fetch('/App/Client/Ventas/Menu/BackEnd/visualizar.php')
  const data = await res.json()
  estado.productos = Array.isArray(data) ? data : []
  inicializarFiltros()
  mostrarProductos(estado.productos)
}

function inicializarFiltros() {
  const categorias = [...new Set(estado.productos.map(p => p.producto_categoria).filter(Boolean))]

  // Llenar select del modal (para móvil)
  const selectCategoriaModal = document.getElementById('modal-filtro-categoria')
  if (selectCategoriaModal) {
    categorias.sort().forEach(cat => {
      const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat; selectCategoriaModal.appendChild(opt)
    })
  }

  // Llenar select de la barra lateral (para desktop)
  const selectCategoriaSidebar = document.getElementById('filtro-categoria')
  if (selectCategoriaSidebar) {
    selectCategoriaSidebar.innerHTML = '<option value="">Todas las categorías</option>' +
      categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('')
  }
}

function aplicarFiltros() {
  // Check if modal is open to use modal inputs, otherwise use sidebar inputs
  const modal = document.getElementById('modal-filtros');
  const isModalOpen = modal && modal.classList.contains('active');

  const texto = isModalOpen
    ? (document.getElementById('busqueda-texto-modal')?.value.toLowerCase().trim() || document.getElementById('busqueda-texto')?.value.toLowerCase().trim())
    : (document.getElementById('busqueda-texto-sidebar')?.value.toLowerCase().trim() || document.getElementById('busqueda-texto')?.value.toLowerCase().trim())

  const categoria = isModalOpen
    ? document.getElementById('modal-filtro-categoria')?.value || ''
    : document.getElementById('filtro-categoria')?.value || ''

  const precio = parseFloat(
    isModalOpen
      ? document.getElementById('modal-filtro-precio')?.value || ''
      : document.getElementById('filtro-precio')?.value || ''
  )

  const calificacion = parseFloat(
    isModalOpen
      ? document.getElementById('modal-filtro-calificacion')?.value || ''
      : document.getElementById('filtro-calificacion')?.value || ''
  )

  const orden = isModalOpen
    ? document.getElementById('modal-ordenar')?.value || 'nombre'
    : document.getElementById('filtro-ordenar')?.value || 'nombre'

  let filtrados = estado.productos.filter(p => {
    const coincideTexto = !texto || (p.producto_nombre || '').toLowerCase().includes(texto) || (p.producto_categoria || '').toLowerCase().includes(texto) || (p.producto_receta || '').toLowerCase().includes(texto)
    const coincideCat = !categoria || p.producto_categoria === categoria
    const precioProducto = parseFloat(p.producto_precio) || 0
    const coincidePrecio = !precio || precioProducto <= precio
    const calificacionProducto = parseFloat(p.producto_calificacion) || 0
    const coincideCalificacion = !calificacion || calificacionProducto >= calificacion
    return coincideTexto && coincideCat && coincidePrecio && coincideCalificacion
  })

  ordenarProductos(filtrados, orden)
  mostrarProductos(filtrados)
}

function ordenarProductos(arr, criterio) {
  arr.sort((a, b) => {
    switch (criterio) {
      case 'precio-asc': return (parseFloat(a.producto_precio) || 0) - (parseFloat(b.producto_precio) || 0)
      case 'precio-desc': return (parseFloat(b.producto_precio) || 0) - (parseFloat(a.producto_precio) || 0)
      case 'calificacion': return (parseFloat(b.producto_calificacion) || 0) - (parseFloat(a.producto_calificacion) || 0)
      case 'categoria': return (a.producto_categoria || '').localeCompare(b.producto_categoria || '')
      case 'nombre': default: return String(a.producto_nombre).localeCompare(String(b.producto_nombre))
    }
  })
}

function mostrarProductos(productos) {
  const cont = document.getElementById('menu-listado')
  cont.innerHTML = ''
  if (!productos.length) {
    cont.innerHTML = `<div class="sin-resultados"><p>No se encontraron productos.</p></div>`
    return
  }
  const categorias = {}
  productos.forEach(p => { const cat = p.producto_categoria || 'Sin categoría'; if (!categorias[cat]) categorias[cat] = []; categorias[cat].push(p) })
  Object.keys(categorias).forEach(cat => {
    const titulo = document.createElement('h2'); titulo.textContent = cat; titulo.className = 'categoria-titulo'; cont.appendChild(titulo)
    const divCat = document.createElement('div'); divCat.className = 'categoria-contenedor'
    categorias[cat].forEach((producto, index) => {
      const div = document.createElement('div');
      div.className = 'producto-item nuevo';
      div.addEventListener('click', () => agregarAlCarrito(parseInt(div.dataset.productoId, 10)))
      div.dataset.productoId = producto.producto_id;
      div.style.animationDelay = `${index * 50}ms`
      const defaultImage = '/App/Recursos/productos/logo.png'
      const imageUrl = producto.imagen_url || defaultImage
      div.innerHTML = `
        <div class="producto-header">
          <img class="producto-imagen" src="${imageUrl}" alt="${producto.producto_nombre}">
          <strong class="producto-nombre">${producto.producto_nombre}</strong>
          <span class="producto-precio">$${producto.producto_precio}</span>
        </div>
        <div class="producto-info">
          ${producto.producto_descripcion ? `<div class="producto-descripcion"><p>${String(producto.producto_descripcion).replace(/\n/g, '<br>')}</p></div>` : ''}
          ${producto.producto_calificacion ? `
            <div class="producto-calificacion">
              <div class="estrellas-display">${getStarRating(producto.producto_calificacion)}</div>
              <span class="calificacion-numero">${getRatingText(producto.producto_calificacion)}</span>
            </div>
          ` : ''}
        </div>
        <div style="display:flex;justify-content:center;margin-top:auto;padding-top:12px;">
          <button class="btn-comentar-principal">Agregar</button>
        </div>`
      divCat.appendChild(div)
    })
    cont.appendChild(divCat)
  })
  cont.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => agregarAlCarrito(parseInt(b.dataset.add, 10))))
  setTimeout(() => { document.querySelectorAll('.producto-item.nuevo').forEach(i => i.classList.remove('nuevo')) }, 600)
}

function mostrarToast(mensaje, tipo = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `
    <div class="toast-content">${mensaje}</div>
  `;
  
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => container.removeChild(toast), 300);
  }, 3000);
}

function agregarAlCarrito(prodId) {
  const idx = estado.carrito.findIndex(i => i.producto_id === prodId)
  if (idx >= 0) {
    estado.carrito[idx].cantidad += 1
    const producto = estado.carrito[idx];
    mostrarToast(`${producto.nombre} (${producto.cantidad} en el carrito)`);
  } else { 
    const p = estado.productos.find(x => x.producto_id === prodId); 
    if (!p) return; 
    estado.carrito.push({ 
      producto_id: p.producto_id, 
      nombre: p.producto_nombre, 
      precio: parseFloat(p.producto_precio) || 0, 
      cantidad: 1, 
      tiempo: p.producto_tiempo_preparacion || '' 
    });
    mostrarToast(`${p.producto_nombre} agregado al carrito`);
  }
  guardar();
  document.dispatchEvent(new CustomEvent('cart:changed'))
}

function totalCarrito() { return estado.carrito.reduce((s, i) => s + i.precio * i.cantidad, 0) }
function parseMin(t) { if (!t) return 10; const m = String(t).match(/(\d+)(?=\s*min|$)/i); return m ? parseInt(m[1], 10) : 10 }
function estimar() { const base = estado.carrito.reduce((s, i) => s + parseMin(i.tiempo) * i.cantidad, 0); return base + 5 }

function renderResumen() {
  const zona = document.getElementById('resumen'); const total = document.getElementById('total'); if (!zona || !total) return
  zona.innerHTML = estado.carrito.map(i => `
    <div class="producto-item" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-direction:row;">
      <span style="flex:1">${i.nombre}</span>
      <div style="display:flex;align-items:center;gap:8px">
        <input type="number" min="1" class="qty-input" data-id="${i.producto_id}" value="${i.cantidad}" />
        <button class="btn-remove" data-del="${i.producto_id}">Eliminar</button>
      </div>
      <span style="min-width:90px;text-align:right">${formatearPrecio(i.precio * i.cantidad)}</span>
    </div>`).join('')
  total.textContent = formatearPrecio(totalCarrito())
  zona.querySelectorAll('.qty-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const pid = parseInt(inp.dataset.id, 10)
      let val = parseInt(inp.value, 10)
      if (isNaN(val) || val <= 0) { estado.carrito = estado.carrito.filter(x => x.producto_id !== pid) }
      else {
        const item = estado.carrito.find(x => x.producto_id === pid)
        if (item) item.cantidad = val
      }
      guardar(); renderResumen(); cargarEta();
    })
  })
  zona.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = parseInt(btn.dataset.del, 10)
      estado.carrito = estado.carrito.filter(x => x.producto_id !== pid)
      guardar(); renderResumen(); cargarEta();
    })
  })
}

async function cargarEta() { const etaEl = document.getElementById('eta'); if (etaEl) etaEl.textContent = `${estimar()} min` }

let usuarioId = null
async function obtenerUsuarioId(){
  try {
    const r = await fetch('/App/Control/Session/checkSession.php', { credentials: 'same-origin' })
    const data = await r.json()
    if (data && data.logged_in && data.user && data.user.id) { usuarioId = data.user.id; return true }
    return false
  } catch { return false }
}

async function confirmarPedido(e) {
  e.preventDefault()
  if (!usuarioId) {
    const ok = await obtenerUsuarioId(); if (!ok) { alert('Debes iniciar sesión para confirmar el pedido'); return }
  }
  const metodo = document.getElementById('metodo').value
  const obs = document.getElementById('obs').value.trim()
  if (estado.carrito.length === 0) return
  const total = formatearPrecio(totalCarrito())
  const etaTxt = `${estimar()} min`
  const detalle = estado.carrito.map(i => `<div style="display:flex;justify-content:space-between"><span>${i.nombre} x${i.cantidad}</span><span>${formatearPrecio(i.precio * i.cantidad)}</span></div>`).join('')
  const cuerpo = `
    <p>¿Deseas confirmar tu pedido?</p>
    <div style="margin:10px 0;padding:10px;border:1px solid rgba(239,231,210,0.2);border-radius:8px">${detalle}</div>
    <div class="producto-calificacion" style="border-top:none;justify-content:space-between;margin-top:8px"><span>Total</span><strong>${total}</strong></div>
    <div class="producto-calificacion" style="border-top:none;justify-content:space-between;margin-top:8px"><span>Tiempo estimado</span><strong>${etaTxt}</strong></div>
    <div class="producto-calificacion" style="border-top:none;justify-content:space-between;margin-top:8px"><span>Método de pago</span><strong>${metodo}</strong></div>
    ${obs ? `<div style="margin-top:8px"><span>Observaciones:</span><p>${obs.replace(/</g,'&lt;')}</p></div>` : ''}
  `
  abrirModalConfirm(cuerpo, async () => {
    const payload = { email: usuarioId, metodo, obs, items: estado.carrito.map(i => ({ producto_id: i.producto_id, cantidad: i.cantidad })) }
    const res = await fetch('/App/Client/Ventas/TakeAway/BackEnd/crearPedidoTakeAway.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    if (data && data.success) {
      localStorage.removeItem('takeaway_carrito');
      abrirModalNotify('Pedido confirmado', `<p>Tu pedido fue creado correctamente.</p><p>Tiempo estimado: <strong>${data.eta} min</strong></p> <br><p style="color: #4CAF50; text-align: center;">Una vez tu pedido se encuentre listo, te notificaremos por correo electrónico.</p>`, () => { window.location.href = '/MisPedidos' });
    } else {
      abrirModalNotify('Error', `<p>Hubo un error al crear el pedido.</p><p>Por favor, contacta con el restaurante.</p>`, () => {})
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const vaciar = document.getElementById('vaciar'); if (vaciar) vaciar.addEventListener('click', () => { estado.carrito = []; guardar() })
  const esIndex = !!document.getElementById('menu-listado')
  const esCheckout = !!document.getElementById('form')
  if (esIndex) {
    // Event listeners para filtros del sidebar (solo para limpiar filtros, no aplican automáticamente)
    // document.getElementById('busqueda-texto-sidebar')?.addEventListener('input', aplicarFiltros)
    // document.getElementById('filtro-categoria')?.addEventListener('change', aplicarFiltros)
    // document.getElementById('filtro-precio')?.addEventListener('input', aplicarFiltros)
    // document.getElementById('filtro-calificacion')?.addEventListener('change', aplicarFiltros)
    // document.getElementById('filtro-ordenar')?.addEventListener('change', aplicarFiltros)

    // Botón limpiar filtros del sidebar
    document.getElementById('btn-limpiar-todos')?.addEventListener('click', () => {
      document.getElementById('busqueda-texto-sidebar').value = ''
      document.getElementById('filtro-categoria').value = ''
      document.getElementById('filtro-precio').value = ''
      document.getElementById('filtro-calificacion').value = ''
      document.getElementById('filtro-ordenar').value = 'nombre'
      mostrarProductos(estado.productos)
    })

    // Botón aplicar filtros del sidebar
    document.getElementById('btn-aplicar-filtros-sidebar')?.addEventListener('click', aplicarFiltros)

    // Mantener compatibilidad con búsqueda principal para móviles
    document.getElementById('busqueda-texto')?.addEventListener('input', aplicarFiltros)
    document.getElementById('btn-limpiar-busqueda')?.addEventListener('click', () => { document.getElementById('busqueda-texto').value = ''; aplicarFiltros() })

    // Mantener funcionalidad del modal para móviles
    const modal = document.getElementById('modal-filtros');
    document.getElementById('btn-abrir-filtros')?.addEventListener('click', () => modal.classList.add('active'))
    document.getElementById('btn-cerrar-modal')?.addEventListener('click', () => modal.classList.remove('active'))
    document.getElementById('btn-limpiar-todos-modal')?.addEventListener('click', () => {
      document.getElementById('busqueda-texto-modal').value = ''
      document.getElementById('busqueda-texto').value = ''
      document.getElementById('modal-filtro-categoria').value = ''
      document.getElementById('modal-filtro-precio').value = ''
      document.getElementById('modal-filtro-calificacion').value = ''
      document.getElementById('modal-ordenar').value = 'nombre'
      mostrarProductos(estado.productos)
    })
    document.getElementById('btn-aplicar-filtros')?.addEventListener('click', () => {
      const texto = document.getElementById('busqueda-texto-modal')?.value.toLowerCase().trim() || document.getElementById('busqueda-texto')?.value.toLowerCase().trim()
      const categoria = document.getElementById('modal-filtro-categoria').value
      const precio = parseFloat(document.getElementById('modal-filtro-precio').value) || ''
      const calificacion = parseFloat(document.getElementById('modal-filtro-calificacion').value) || ''
      const orden = document.getElementById('modal-ordenar').value
      let filtrados = estado.productos.filter(p => {
        const coincideTexto = !texto || (p.producto_nombre || '').toLowerCase().includes(texto) || (p.producto_categoria || '').toLowerCase().includes(texto) || (p.producto_receta || '').toLowerCase().includes(texto)
        const coincideCat = !categoria || p.producto_categoria === categoria
        const precioProducto = parseFloat(p.producto_precio) || 0
        const coincidePrecio = !precio || precioProducto <= precio
        const calificacionProducto = parseFloat(p.producto_calificacion) || 0
        const coincideCalificacion = !calificacion || calificacionProducto >= calificacion
        return coincideTexto && coincideCat && coincidePrecio && coincideCalificacion
      })
      ordenarProductos(filtrados, orden)
      mostrarProductos(filtrados)
      modal.classList.remove('active')
    })
    cargarProductos()
  }
  if (esCheckout) { obtenerUsuarioId(); renderResumen(); cargarEta(); const form = document.getElementById('form'); if (form) form.addEventListener('submit', confirmarPedido) }
})
function abrirModalNotify(titulo, mensajeHTML, onOk) {
  const modal = document.getElementById('modal-notify');
  const titleEl = document.getElementById('modal-notify-title');
  const msgEl = document.getElementById('modal-notify-msg');
  const okBtn = document.getElementById('modal-notify-ok');
  const closeBtn = document.getElementById('modal-notify-close');
  if (!modal || !titleEl || !msgEl || !okBtn || !closeBtn) return;
  titleEl.textContent = titulo;
  msgEl.innerHTML = mensajeHTML;
  modal.classList.add('active');
  const cerrar = () => { modal.classList.remove('active'); okBtn.onclick = null; closeBtn.onclick = null; };
  closeBtn.onclick = cerrar;
  okBtn.onclick = () => { try { if (typeof onOk === 'function') onOk(); } finally { cerrar(); } };
}

function abrirModalConfirm(mensajeHTML, onConfirm) {
  const modal = document.getElementById('modal-confirm');
  const msgEl = document.getElementById('modal-confirm-msg');
  const okBtn = document.getElementById('modal-confirm-ok');
  const closeBtn = document.getElementById('modal-confirm-close');
  const cancelBtn = document.getElementById('modal-confirm-cancel');
  if (!modal || !msgEl || !okBtn || !closeBtn || !cancelBtn) return;
  msgEl.innerHTML = mensajeHTML;
  modal.classList.add('active');
  const cerrar = () => { modal.classList.remove('active'); okBtn.onclick = null; closeBtn.onclick = null; cancelBtn.onclick = null; };
  closeBtn.onclick = cerrar;
  cancelBtn.onclick = cerrar;
  okBtn.onclick = async () => { try { if (typeof onConfirm === 'function') await onConfirm(); } finally { cerrar(); } };
}