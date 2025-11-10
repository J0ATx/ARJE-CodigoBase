let ws;
let productosDisponibles = [];
let pedidos = [];
let confirmacionCallback = null;

let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let isDragging = false;
let draggedItem = null;
let ghostElement = null;
let initialX = 0;
let initialY = 0;
let xOffset = 0;
let yOffset = 0;

window.cerrarModalNotificacion = function() {
  document.getElementById('modalNotificacion').classList.remove('active');
  document.getElementById('modalNotificacion').style.display = 'none';
}

window.cancelarConfirmacion = function() {
  document.getElementById('modalConfirmacion').classList.remove('active');
  document.getElementById('modalConfirmacion').style.display = 'none';
  confirmacionCallback = null;
}

window.confirmarAccion = function() {
  if (confirmacionCallback) {
    confirmacionCallback();
    confirmacionCallback = null;
  }
  cancelarConfirmacion();
}

function mostrarNotificacion(tipo, titulo, mensaje) {
  const iconContainer = document.getElementById('notificationIcon');
  const titleElement = document.getElementById('notificationTitle');
  const messageElement = document.getElementById('notificationMessage');

  iconContainer.className = 'notification-icon';
  iconContainer.classList.add(tipo);

  const svgs = {
    success: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>',
    error: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>',
    warning: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>'
  };

  iconContainer.innerHTML = svgs[tipo] || svgs.success;
  titleElement.textContent = titulo;
  messageElement.textContent = mensaje;

  const modal = document.getElementById('modalNotificacion');
  modal.classList.add('active');
  modal.style.display = 'flex';
}

function mostrarConfirmacion(titulo, mensaje, callback) {
  document.getElementById('confirmacionTitle').textContent = titulo;
  document.getElementById('confirmacionMessage').textContent = mensaje;
  confirmacionCallback = callback;
  
  const btnConfirmar = document.getElementById('btnConfirmar');
  btnConfirmar.onclick = confirmarAccion;
  
  const modal = document.getElementById('modalConfirmacion');
  modal.classList.add('active');
  modal.style.display = 'flex';
}

window.addEventListener('click', function(e) {
  const modalNotificacion = document.getElementById('modalNotificacion');
  const modalConfirmacion = document.getElementById('modalConfirmacion');
  
  if (e.target === modalNotificacion) cerrarModalNotificacion();
  if (e.target === modalConfirmacion) cancelarConfirmacion();
});

document.addEventListener('DOMContentLoaded', () => {
  cargarPedidos();
  
  const togglePagados = document.getElementById('togglePagados');
  if (togglePagados) {
    togglePagados.addEventListener('change', () => {
      cargarPedidos();
    });
  }
});

function sendReload() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ action: 'reload' }));
  }
}

function cargarPedidos() {
  const togglePagados = document.getElementById('togglePagados');
  const incluirPagados = togglePagados ? togglePagados.checked : false;
  
  fetch(`../BackEnd/listarPedidos.php?incluirPagados=${incluirPagados}`)
    .then(r => r.json())
    .then(data => {
      if (!data.success) return;
      pedidos = data.data;
      const togglePagados = document.getElementById('togglePagados');
      const incluirPagados = togglePagados ? togglePagados.checked : false;
      const estadosOrden = incluirPagados ? 
        ['Pendiente', 'En-Preparacion', 'Listo', 'Entregado', 'Pagado'] : 
        ['Pendiente', 'En-Preparacion', 'Listo', 'Entregado'];
      const pedidosContainer = document.getElementById('pedidosList');
      pedidosContainer.innerHTML = '';

      const rowsWrapper = document.createElement('div');
      rowsWrapper.className = 'kds-rows';

      const TRANSICIONES_COCINA = {
        'Pendiente': ['En-Preparacion'],
        'En-Preparacion': ['Listo'],
        'Listo': []
      };

      const descripcionesEstados = {
        'Pendiente': 'Un <strong>mozo</strong> ingresa un pedido',
        'En-Preparacion': 'El <strong>cocinero</strong> está preparando el plato',
        'Listo': 'El <strong>cocinero</strong> tiene listo el plato',
        'Entregado': 'El <strong>mozo</strong> entrega el plato al cliente',
        'Pagado': 'El <strong>mozo</strong> anota el pago del cliente'
      };

      estadosOrden.forEach(estado => {
        const row = document.createElement('div');
        row.className = 'kds-row';
        row.dataset.estado = estado;

        const header = document.createElement('div');
        header.className = 'kds-row-header';
        header.innerHTML = `
          <div class="header-content">
            <h3>${estado.replace('_', ' ').replace('-', ' ')}</h3>
            <small class="kds-row-count">(0)</small>
          </div>
          <div class="info-tooltip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="tooltip-text">${descripcionesEstados[estado] || 'Descripción no disponible'}</span>
          </div>`;

        const dropzone = document.createElement('div');
        dropzone.className = 'kds-dropzone';
        dropzone.dataset.estado = estado;

        dropzone.addEventListener('dragover', e => {
          e.preventDefault();
          dropzone.classList.add('drag-over');
        });
        dropzone.addEventListener('dragleave', e => {
          dropzone.classList.remove('drag-over');
        });
        dropzone.addEventListener('drop', async (e) => {
          e.preventDefault();
          dropzone.classList.remove('drag-over');
          const idPedido = e.dataTransfer.getData('text/plain');
          if (!idPedido) return;
          const nuevoEstado = dropzone.dataset.estado;
          const pedidoObj = pedidos.find(p => String(p.idPedido) === String(idPedido));
          if (!pedidoObj) return;
          if (pedidoObj.estado === nuevoEstado) return;

          const permitido = Array.isArray(TRANSICIONES_COCINA[pedidoObj.estado]) && TRANSICIONES_COCINA[pedidoObj.estado].includes(nuevoEstado);
          if (!permitido) {
            mostrarNotificacion('warning', 'Advertencia', 'No tiene permiso para mover este pedido a ese estado. El flujo para cocina es: Pendiente -> En-Preparacion -> Listo.');
            return;
          }

          mostrarConfirmacion(
            'Cambiar Estado',
            `Mover pedido #${idPedido} a "${nuevoEstado.replace('_', ' ')}"?`,
            async function() {
              try {
                const resp = await fetch('../BackEnd/cambiarEstado.php', {
                  method: 'POST',
                  body: new URLSearchParams({ idPedido, nuevoEstado })
                });
                const res = await resp.json();
                if (res.success) {
                  sendReload();
                  cargarPedidos();
                } else {
                  mostrarNotificacion('error', 'Error', res.message || 'Error al cambiar estado');
                }
              } catch (err) {
                console.error(err);
                mostrarNotificacion('error', 'Error', 'Error al cambiar estado');
              }
            }
          );
        });

        row.appendChild(header);
        row.appendChild(dropzone);
        rowsWrapper.appendChild(row);
      });

      pedidos.forEach(pedido => {
        const productosLista = Array.isArray(pedido.productos) ? pedido.productos : [];
        const estadoClase = pedido.estado.toLowerCase().replace(/-/g, '_');
        const card = document.createElement('div');
        card.className = `pedido-card ${estadoClase}`;
        card.setAttribute('draggable', 'true');
        card.dataset.idPedido = pedido.idPedido;

        let btnEstado = '';

        card.innerHTML = `
          <div class="pedido-header">
            <div class="pedido-info">
              <h3 class="pedido-titulo">Pedido #${pedido.idPedido}</h3>
              <div class="pedido-meta">
                <span title="Mesa">Mesa ${pedido.idMesa}</span>
                <span title="Mozo">${pedido.nombreMozo || 'Sin asignar'}</span>
                <span title="Fecha">${formatearFechaHora(pedido.fecha)}</span>
              </div>
            </div>
            <div class="pedido-acciones">
              ${btnEstado}
            </div>
          </div>
          <div class="pedido-body">
            <ul class="lista-productos">
              ${productosLista.map(producto => `
                <li class="producto-item">
                  <span class="producto-nombre">${producto.nombre}</span>
                  <span class="producto-cantidad">x${producto.contiene_cantidad || 1}</span>
                </li>
              `).join('')}
            </ul>
            ${pedido.especificacion ? `
              <div class="pedido-comentarios">
                <h4>Notas:</h4>
                <p>${pedido.especificacion}</p>
              </div>
            ` : ''}
          </div>
          <div class="pedido-footer">
            <span class="estado-actual estado-${estadoClase}">
              ${pedido.estado === 'Pendiente' ? 'Pendiente' :
            pedido.estado === 'En-Preparacion' ? 'En Preparacion' :
              pedido.estado === 'Listo' ? 'Listo' :
                pedido.estado === 'Entregado' ? 'Entregado' : pedido.estado === 'Pagado' ? 'Pagado' : 'Pagado'}
            </span>
            <span class="tiempo-transcurrido" title="${formatearFechaHora(pedido.fecha)}">
              ${calcularTiempoTranscurrido(pedido.fecha)}
            </span>
          </div>
        `;

        card.addEventListener('dragstart', (ev) => {
          ev.dataTransfer.setData('text/plain', String(pedido.idPedido));
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));

        const targetDropzone = rowsWrapper.querySelector(`.kds-dropzone[data-estado="${pedido.estado}"]`);
        if (targetDropzone) targetDropzone.appendChild(card);
      });

      rowsWrapper.querySelectorAll('.kds-row').forEach(row => {
        const count = row.querySelectorAll('.kds-dropzone > .pedido-card').length;
        const c = row.querySelector('.kds-row-count');
        if (c) c.textContent = `(${count})`;
      });

      pedidosContainer.appendChild(rowsWrapper);


      window.cambiarEstadoPedido = function (idPedido, nuevoEstado) {
        fetch('../BackEnd/cambiarEstado.php', {
          method: 'POST',
          body: new URLSearchParams({ idPedido, nuevoEstado })
        })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              sendReload();
              cargarPedidos();
            } else {
              mostrarNotificacion('error', 'Error', data.message || 'Error al cambiar estado');
            }
          });
      }


    });
}

window.onload = function () {
  ws = new WebSocket('ws://localhost:8080/App/Admin/KDS/Cocina/index');
  ws.onopen = () => console.log('Sistema conectado a cocina');
  ws.onmessage = event => {
    try {
      const obj = JSON.parse(event.data);
      if (obj.action === 'reload') cargarPedidos();
      else if (obj.error) console.log(obj.error);
    } catch {
      console.log('Desconocido ', event.data);
    }
  };
  ws.onclose = () => console.log('Sistema desconectado');
};

function formatearFechaHora(fechaHora) {
  const opciones = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return new Date(fechaHora).toLocaleString('es-UY', opciones);
}

function calcularTiempoTranscurrido(fechaHora) {
  const ahora = new Date();
  const fechaPedido = new Date(fechaHora);
  const diferencia = Math.floor((ahora - fechaPedido) / 1000); // en segundos
  if (diferencia < 60) return 'Hace unos segundos';
  if (diferencia < 3600) return `Hace ${Math.floor(diferencia / 60)} min`;
  if (diferencia < 86400) return `Hace ${Math.floor(diferencia / 3600)} h`;
  return `Hace ${Math.floor(diferencia / 86400)} días`;
}







function emailValido(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}





function pInt(v) { return parseInt(v, 10) || 0; }

function handleTouchStart(e) {
  if (e.touches.length !== 1) return;

  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const card = target.closest('.pedido-card');

  if (!card) return;

  if (target.closest('button, a, input, select')) {
    return;
  }

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchStartTime = Date.now();
  draggedItem = card;

  ghostElement = card.cloneNode(true);
  ghostElement.classList.add('ghost-element');
  ghostElement.style.width = `${card.offsetWidth}px`;
  ghostElement.style.height = `${card.offsetHeight}px`;

  const rect = card.getBoundingClientRect();
  initialX = touch.clientX - rect.left;
  initialY = touch.clientY - rect.top;

  ghostElement.style.left = `${rect.left}px`;
  ghostElement.style.top = `${rect.top}px`;

  document.body.appendChild(ghostElement);
  document.body.style.overflow = 'hidden';

  document.addEventListener('touchmove', preventScroll, { passive: false });

  card.classList.add('dragging');

  isDragging = false;
}

function handleTouchMove(e) {
  if (!draggedItem || !ghostElement) return;

  const isCancelable = e.cancelable && !e.defaultPrevented;
  
  const touch = e.touches[0];
  const deltaX = Math.abs(touch.clientX - touchStartX);
  const deltaY = Math.abs(touch.clientY - touchStartY);

  if (!isDragging && (deltaX > 10 || deltaY > 10)) {
    isDragging = true;
    if (isCancelable) {
      e.preventDefault();
    }
    return;
  }

  if (!isDragging) return;

  if (isCancelable) {
    e.preventDefault();
  }

  try {
    ghostElement.style.left = `${touch.clientX - initialX}px`;
    ghostElement.style.top = `${touch.clientY - initialY}px`;

    const touchElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropzone = touchElement?.closest('.kds-dropzone');

    document.querySelectorAll('.kds-dropzone').forEach(dz => {
      dz.classList.remove('drag-over');
    });

    if (dropzone) {
      dropzone.classList.add('drag-over');
    }
  } catch (err) {
    console.warn('Error en handleTouchMove:', err);
  }
}

function handleTouchEnd(e) {
  if (!draggedItem) return;

  const wasDragging = isDragging;
  isDragging = false;

  if (ghostElement) {
    ghostElement.remove();
    ghostElement = null;
  }

  document.body.style.overflow = '';
  document.removeEventListener('touchmove', preventScroll);

  draggedItem.classList.remove('dragging');

  if (!wasDragging) {
    draggedItem = null;
    return;
  }

  const touch = e.changedTouches[0];
  const touchElement = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropzone = touchElement?.closest('.kds-dropzone');

  document.querySelectorAll('.kds-dropzone').forEach(dz => {
    dz.classList.remove('drag-over');
  });

  if (dropzone && draggedItem) {
    const idPedido = draggedItem.dataset.idPedido;
    const nuevoEstado = dropzone.dataset.estado;
    const pedidoObj = pedidos.find(p => String(p.idPedido) === String(idPedido));

    if (pedidoObj && pedidoObj.estado !== nuevoEstado) {
      const TRANSICIONES_COCINA = {
        'Pendiente': ['En-Preparacion'],
        'En-Preparacion': ['Listo'],
        'Listo': []
      };

      const permitido = Array.isArray(TRANSICIONES_COCINA[pedidoObj.estado]) &&
        TRANSICIONES_COCINA[pedidoObj.estado].includes(nuevoEstado);

      if (permitido) {
        mostrarConfirmacion(
          'Cambiar Estado',
          `Mover pedido #${idPedido} a "${nuevoEstado.replace('_', ' ')}"?`,
          function() {
            cambiarEstadoPedido(idPedido, nuevoEstado);
          }
        );
      } else {
        mostrarNotificacion('warning', 'Advertencia', 'No tiene permiso para mover este pedido a ese estado. El flujo para cocina es: Pendiente -> En-Preparacion -> Listo.');
      }
    }
  }

  draggedItem = null;
}

function preventScroll(e) {
  if (isDragging && e.cancelable && !e.defaultPrevented) {
    try {
      e.preventDefault();
      e.stopPropagation();
      return false;
    } catch (err) {
      console.warn('No se pudo prevenir el scroll:', err);
    }
  }
  return true;
}

function setupTouchEvents() {
  const options = { passive: false };
  document.addEventListener('touchstart', handleTouchStart, options);
  document.addEventListener('touchmove', handleTouchMove, options);
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  document.addEventListener('touchcancel', handleTouchEnd, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupTouchEvents);
} else {
  setupTouchEvents();
}