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
let reservaIgnoradaId = null;

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
  cargarMesas();
  cargarMozos();
  cargarProductos();
  cargarPedidos();
  
  // Manejar el toggle de pedidos pagados
  const togglePagados = document.getElementById('togglePagados');
  if (togglePagados) {
    togglePagados.addEventListener('change', () => {
      cargarPedidos();
    });
  }

  document.getElementById('btnAbrirNuevoPedido').addEventListener('click', abrirModalNuevoPedido);
  document.getElementById('agregarProducto').addEventListener('click', e => {
    e.preventDefault();
    agregarProductoInput('productosContainer', productosDisponibles);
  });
  document.getElementById('formPedido').addEventListener('submit', crearPedido);
  const btnAgregarCliente = document.getElementById('agregarCliente');
  if (btnAgregarCliente) {
    btnAgregarCliente.addEventListener('click', () => agregarClienteChip('clienteEmail', 'clientesChips'));
  }

  document.getElementById('agregarProductoEditar').addEventListener('click', e => {
    e.preventDefault();
    agregarProductoInput('editarProductosContainer', productosDisponibles, true);
  });
  document.getElementById('formEditarPedido').addEventListener('submit', editarPedidoSubmit);
  const btnAgregarClienteEditar = document.getElementById('agregarClienteEditar');
  if (btnAgregarClienteEditar) {
    btnAgregarClienteEditar.addEventListener('click', () => agregarClienteChip('clienteEmailEditar', 'clientesChipsEditar'));
  }
});

function cargarMesas() {
  fetch('../BackEnd/listarMesas.php')
    .then(r => r.json())
    .then(data => {
      const select = document.getElementById('selectMesa');
      select.innerHTML = '';
      data.forEach(mesa => {
        const opt = document.createElement('option');
        opt.value = mesa.mesa_id;
        opt.textContent = `Mesa ${mesa.mesa_id}`;
        select.appendChild(opt);
      });
    });
}

function cargarProductos() {
  fetch('../BackEnd/listarProductos.php')
    .then(r => r.json())
    .then(data => {
      productosDisponibles = data;
      document.getElementById('productosContainer').innerHTML = '';
      agregarProductoInput('productosContainer', productosDisponibles);
    });
}

function cargarMozos() {
  return fetch('../BackEnd/listarMozos.php')
    .then(r => r.json())
    .then(data => {
      const selectNuevo = document.getElementById('selectMozo');
      selectNuevo.innerHTML = '';

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Seleccione un mozo';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      selectNuevo.appendChild(defaultOption);

      const selectEditar = document.getElementById('editarSelectMozo');
      selectEditar.innerHTML = '';

      const defaultOptionEditar = defaultOption.cloneNode(true);
      selectEditar.appendChild(defaultOptionEditar);

      data.forEach(mozo => {
        const optNuevo = document.createElement('option');
        optNuevo.value = mozo.personal_id;
        optNuevo.textContent = `${mozo.personal_apellido}, ${mozo.personal_nombre}`;
        selectNuevo.appendChild(optNuevo);

        const optEditar = optNuevo.cloneNode(true);
        selectEditar.appendChild(optEditar);
      });

      return data;
    })
    .catch(error => {
      console.error('Error al cargar los mozos:', error);
      throw error;
    });
}

function agregarProductoInput(containerId, productos, editar = false, valor = '') {
  const cont = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = editar ? 'producto-item-editar' : 'producto-item';

  const select = document.createElement('select');
  select.className = 'select-producto';
  select.innerHTML = '<option value="">Seleccionar producto...</option>';
  productos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.producto_id;
    opt.textContent = p.producto_nombre;
    if (valor && valor == p.producto_nombre) opt.selected = true;
    select.appendChild(opt);
  });

  // --- CAMBIO: Escuchar cambios para actualizar promos ---
  select.addEventListener('change', actualizarPromociones);
  // -----------------------------------------------------

  const inputCantidad = document.createElement('input');
  inputCantidad.type = 'number';
  inputCantidad.min = 1;
  inputCantidad.value = 1;
  inputCantidad.className = 'input-cantidad';
  inputCantidad.style.width = '60px';

  // --- CAMBIO: Si cambia la cantidad, podrías querer validar promos también ---
  inputCantidad.addEventListener('change', actualizarPromociones);

  if (editar && valor) {
    const prod = productos.find(p => p.producto_nombre === valor);
    if (prod && prod.contiene_cantidad) inputCantidad.value = prod.contiene_cantidad;
  }

  const btnQuitar = document.createElement('button');
  btnQuitar.type = 'button';
  btnQuitar.textContent = 'Quitar';
  
  // --- CAMBIO: Al quitar, actualizar promos ---
  btnQuitar.onclick = () => { 
      div.remove(); 
      actualizarPromociones(); 
  };
  // ------------------------------------------

  div.appendChild(select);
  div.appendChild(inputCantidad);
  div.appendChild(btnQuitar);
  cont.appendChild(div);
}

function abrirModalNuevoPedido() {
  cargarMesas();
  cargarProductos();
  document.getElementById('productosContainer').innerHTML = '';
  agregarProductoInput('productosContainer', productosDisponibles);
  document.getElementById('formPedido').reset();
  document.getElementById('modalNuevoPedido').showModal();
}

function crearPedido(e) {
  e.preventDefault();
  const idMesa = document.getElementById('selectMesa').value;
  const idMozo = document.getElementById('selectMozo').value;
  const especificacion = document.getElementById('especificacionPedido').value || '';

  if (!idMozo) {
    document.getElementById('modalNuevoPedido').close();
    mostrarNotificacion('warning', 'Advertencia', 'Por favor, seleccione un mozo.');
    return;
  }

  const productos = obtenerProductosSeleccionados('div > .producto-item', productosDisponibles);
  if (!productos.length) {
    document.getElementById('modalNuevoPedido').close();
    mostrarNotificacion('warning', 'Advertencia', 'Debe seleccionar al menos un producto.');
    return;
  }

  consultarReservaActiva(idMesa, idMozo, especificacion, productos);
}

let pedidoData = null;
let reservaActivaData = null;

function consultarReservaActiva(idMesa, idMozo, especificacion, productos) {
  const formData = new FormData();
  formData.append('mesa_id', idMesa);

  fetch('../BackEnd/consultarReservaActiva.php', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if (data.tiene_reserva) {
        if (reservaIgnoradaId && String(reservaIgnoradaId) === String(data.reserva.reserva_id)) {
          procederCrearPedido(idMesa, idMozo, especificacion, productos);
          return;
        }
        reservaActivaData = data.reserva;
        document.getElementById('reservaCliente').textContent = data.reserva.cliente_id;
        document.getElementById('reservaCantidad').textContent = data.reserva.reserva_cantidad_personas;
        document.getElementById('reservaHora').textContent = data.reserva.reserva_inicio;
        document.getElementById('modalReservaActiva').showModal();

        pedidoData = {
          idMesa, idMozo, especificacion, productos
        };
      } else {
        procederCrearPedido(idMesa, idMozo, especificacion, productos);
      }
    })
    .catch(error => {
      console.error('Error al consultar reserva:', error);
      alert('Error al verificar reserva. Continuando...');
      procederCrearPedido(idMesa, idMozo, especificacion, productos);
    });
}

function procederCrearPedido(idMesa, idMozo, especificacion, productos) {
  const formData = new FormData();
  formData.append('idMesa', idMesa);
  formData.append('idMozo', idMozo);
  formData.append('especificacion', especificacion);
  formData.append('productos', JSON.stringify(productos));

  // --- INICIO CÓDIGO NUEVO PROMOCIONES ---
  const promosSeleccionadas = [];
  const checkboxes = document.querySelectorAll('#seccionPromociones .promo-checkbox:checked');
  
  checkboxes.forEach(chk => {
    promosSeleccionadas.push({
      promocion_id: chk.value,
      producto_id: chk.getAttribute('data-producto-id'),
      descuento: chk.getAttribute('data-descuento')
    });
  });

  if (promosSeleccionadas.length > 0) {
      formData.append('promociones', JSON.stringify(promosSeleccionadas));
  }
  // --- FIN CÓDIGO NUEVO PROMOCIONES ---

  const clientes = obtenerClientesDesdeChips('clientesChips');
  if (clientes.length) {
    formData.append('clientes', JSON.stringify(clientes));
  }

  fetch('../BackEnd/crearPedido.php', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        mostrarNotificacion('success', '¡Éxito!', 'Pedido creado exitosamente.');
        document.getElementById('formPedido').reset();
        document.getElementById('productosContainer').innerHTML = '';
        
        // Limpiar sección de promos visualmente
        const seccionPromos = document.getElementById('seccionPromociones');
        if(seccionPromos) seccionPromos.style.display = 'none';
        
        sendReload();
        cargarPedidos();
        document.getElementById('modalNuevoPedido').close();
        reservaIgnoradaId = null;
      } else {
        document.getElementById('modalNuevoPedido').close();
        setTimeout(() => {
          mostrarNotificacion('error', 'Error', data.message || 'Error al crear el pedido.');
        }, 0);
      }
    })
    .catch(err => {
      console.error('Error al crear pedido:', err);
      document.getElementById('modalNuevoPedido').close();
      setTimeout(() => {
        mostrarNotificacion('error', 'Error', 'Error al crear el pedido.');
      }, 0);
    });
}

function confirmarReservaActiva() {
  const emailCliente = document.getElementById('emailReserva').value;

  if (!emailCliente) {
    document.getElementById('modalNuevoPedido').close();
    mostrarNotificacion('warning', 'Advertencia', 'Por favor ingrese el email del cliente para confirmar.');
    return;
  }

  const formData = new FormData();
  formData.append('reserva_id', reservaActivaData.reserva_id);
  formData.append('accion', 'confirmar');
  formData.append('email_cliente', emailCliente);

  fetch('../BackEnd/confirmarReserva.php', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      document.getElementById('modalReservaActiva').close();

      if (data.success) {
        mostrarNotificacion('success', '¡Éxito!', 'Reserva confirmada. Creando pedido...');
        procederCrearPedido(
          pedidoData.idMesa,
          pedidoData.idMozo,
          pedidoData.especificacion,
          pedidoData.productos
        );
      } else {
        mostrarNotificacion('error', 'Error', data.message || 'Error al confirmar reserva');
        pedidoData = null;
        reservaActivaData = null;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      mostrarNotificacion('error', 'Error', 'Error al confirmar reserva');
      pedidoData = null;
      reservaActivaData = null;
    });
}

function rechazarReservaActiva() {
  const formData = new FormData();
  formData.append('reserva_id', reservaActivaData.reserva_id);
  formData.append('accion', 'rechazar');

  fetch('../BackEnd/confirmarReserva.php', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      document.getElementById('modalReservaActiva').close();

      if (data.success) {
        mostrarNotificacion('success', 'Información', 'Continuando con el pedido. Esta no es una reserva.');
        reservaIgnoradaId = reservaActivaData && reservaActivaData.reserva_id ? reservaActivaData.reserva_id : null;
        procederCrearPedido(
          pedidoData.idMesa,
          pedidoData.idMozo,
          pedidoData.especificacion,
          pedidoData.productos
        );
      } else {
        mostrarNotificacion('error', 'Error', data.message || 'Error');
        pedidoData = null;
        reservaActivaData = null;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      mostrarNotificacion('error', 'Error', 'Error al procesar');
      pedidoData = null;
      reservaActivaData = null;
    });
}

function obtenerProductosSeleccionados(selector, productos) {
  return Array.from(document.querySelectorAll(selector))
    .map(div => {
      const select = div.querySelector('.select-producto');
      const inputCantidad = div.querySelector('.input-cantidad');
      if (!select || !inputCantidad) return null;

      const productoId = select.value;
      const cantidad = Math.max(1, parseInt(inputCantidad.value) || 1);

      const prodDisponible = productos.find(p => String(p.producto_id) === String(productoId));
      if (prodDisponible) {
        return {
          idProducto: parseInt(productoId),
          cantidad: cantidad,
          nombre: prodDisponible.producto_nombre
        };
      }
      if (productoId && select.selectedOptions[0]) {
        return {
          idProducto: parseInt(productoId),
          cantidad: cantidad,
          nombre: select.selectedOptions[0].textContent
        };
      }

      return null;
    })
    .filter(Boolean);
}

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
      const estadosOrden = ['Pendiente', 'En-Preparacion', 'Listo', 'Entregado', 'Pagado'];
      const pedidosContainer = document.getElementById('pedidosList');
      pedidosContainer.innerHTML = '';

      const rowsWrapper = document.createElement('div');
      rowsWrapper.className = 'kds-rows';

      const TRANSICIONES_MOZO = {
        'Listo': ['Entregado'],
        'Entregado': ['Pagado']
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

        // Drag & Drop handlers
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

          // Validar transiciones permitidas para mozo
          const permitido = Array.isArray(TRANSICIONES_MOZO[pedidoObj.estado]) && TRANSICIONES_MOZO[pedidoObj.estado].includes(nuevoEstado);
          if (!permitido) {
            mostrarNotificacion('warning', 'Advertencia', 'No tiene permiso para mover este pedido a ese estado. El flujo para mozos es: Pendiente -> (cocina) -> Listo -> Entregado -> Pagado.');
            return;
          }

          // Si es pasar de Entregado a Pagado, abrir modal de pago (el modal hará la petición)
          if (pedidoObj.estado === 'Entregado' && nuevoEstado === 'Pagado') {
            abrirModalPago(idPedido);
            return;
          }

          // En los demás casos permitidos (ej. Listo -> Entregado), pedir confirmación y llamar al backend
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
        if (!incluirPagados && pedido.estado === 'Pagado') return;
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
                <span title="Mesa">${pedido.idMesa ? `Mesa ${pedido.idMesa}` : 'TAKE AWAY'}</span>
                <span title="Mozo">${pedido.nombreMozo || 'Sin asignar'}</span>
                <span title="Fecha">${formatearFechaHora(pedido.fecha)}</span>
              </div>
            </div>
            <div class="pedido-acciones">
              <button class="btn-accion" title="Editar pedido" onclick="abrirModalEditarPedido(${pedido.idPedido})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"></path>
                        </svg>
              </button>
              <button class="btn-accion" title="Cancelar pedido" onclick="cancelarPedido(${pedido.idPedido})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"></path>
                        </svg>
              </button>
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

        // handlers drag
        card.addEventListener('dragstart', (ev) => {
          ev.dataTransfer.setData('text/plain', String(pedido.idPedido));
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));

        // colocar en la fila correspondiente
        const targetDropzone = rowsWrapper.querySelector(`.kds-dropzone[data-estado="${pedido.estado}"]`);
        if (targetDropzone) targetDropzone.appendChild(card);
      });

      // actualizar contadores
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
              alert(data.message || 'Error');
            }
          });
      }

      window.abrirModalPago = function (idPedido) {
        const pedido = pedidos.find(p => p.idPedido == idPedido);
        if (!pedido) return;
        const modal = document.getElementById('modalPago');
        document.getElementById('modalPagoMonto').textContent = pedido.monto;
        modal.setAttribute('data-idPedido', idPedido);
        modal.showModal();
      }

      window.confirmarPago = function () {
        const modal = document.getElementById('modalPago');
        const idPedido = modal.getAttribute('data-idPedido');
        const metodoPago = document.querySelector('input[name="metodoPago"]:checked')?.value;
        if (!metodoPago) {
          alert('Seleccione método de pago');
          return;
        }
        fetch('../BackEnd/cambiarEstado.php', {
          method: 'POST',
          body: new URLSearchParams({ idPedido, nuevoEstado: 'Pagado', metodoPago })
        })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              document.getElementById('modalPago').close();
              sendReload();
              cargarPedidos();
            } else {
              alert(data.message || 'Error');
            }
          });
      }
    });
}

window.onload = function () {
  ws = new WebSocket('ws://localhost:8080/App/Admin/KDS/Mozo/index');
  ws.onopen = () => console.log('Sistema conectado a mozo');
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
  if (diferencia < 86600) return `Hace ${Math.floor(diferencia / 3600)} h`;
  return `Hace ${Math.floor(diferencia / 86400)} días`;
}

function cancelarPedido(idPedido) {
  mostrarConfirmacion(
    'Cancelar Pedido',
    '¿Cancelar este pedido?',
    function() {
      fetch('../BackEnd/cancelarPedido.php', {
        method: 'POST',
        body: new URLSearchParams({ idPedido })
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            cargarPedidos();
            mostrarNotificacion('success', '¡Éxito!', 'Pedido cancelado exitosamente.');
          } else {
            mostrarNotificacion('error', 'Error', data.message || 'Error al cancelar el pedido.');
          }
        });
    }
  );
}

function abrirModalEditarPedido(idPedido) {
  const pedido = pedidos.find(p => p.idPedido == idPedido);
  if (!pedido) {
    console.error('Pedido no encontrado:', idPedido);
    return;
  }

  cargarMozos().then(() => {
    const selectMozo = document.getElementById('editarSelectMozo');
    if (pedido.idMozo) {
      selectMozo.value = pedido.idMozo;
    }

    document.getElementById('editarIdPedido').value = idPedido;
    document.getElementById('especificacionPedidoEditar').value = pedido.especificacion || '';

    const cont = document.getElementById('editarProductosContainer');
    cont.innerHTML = '';

    (pedido.productos || []).forEach(prod => {
      const div = document.createElement('div');
      div.className = 'producto-item-editar';
      const select = document.createElement('select');
      select.className = 'select-producto';
      select.innerHTML = '<option value="">Seleccionar producto...</option>';
      productosDisponibles.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.producto_id;
        opt.textContent = p.producto_nombre;
        if (String(prod.idProducto) === String(p.producto_id)) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });
      const inputCantidad = document.createElement('input');
      inputCantidad.type = 'number';
      inputCantidad.min = '1';
      inputCantidad.className = 'input-cantidad';
      inputCantidad.style.width = '60px';
      inputCantidad.value = prod.contiene_cantidad || prod.cantidad || 1;
      const btnQuitar = document.createElement('button');
      btnQuitar.type = 'button';
      btnQuitar.textContent = 'Quitar';
      btnQuitar.onclick = () => div.remove();
      div.appendChild(select);
      div.appendChild(inputCantidad);
      div.appendChild(btnQuitar);
      cont.appendChild(div);
    });

    const chipsContainer = document.getElementById('clientesChipsEditar');
    chipsContainer.innerHTML = '';
    (pedido.clientes || []).forEach(email => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.innerHTML = `<span>${email}</span> <button type="button" class="chip-remove">×</button>`;
      chip.querySelector('.chip-remove').onclick = () => chip.remove();
      chipsContainer.appendChild(chip);
    });

    document.getElementById('modalEditar').showModal();
  });
}

function editarPedidoSubmit(e) {
  e.preventDefault();
  const idPedido = document.getElementById('editarIdPedido').value;
  const idMozo = document.getElementById('editarSelectMozo').value;
  const especificacion = document.getElementById('especificacionPedidoEditar').value || '';

  const productos = Array.from(document.querySelectorAll('.producto-item-editar')).map(div => {
    const select = div.querySelector('.select-producto');
    const inputCantidad = div.querySelector('.input-cantidad');

    const productoId = select.value;
    const cantidad = parseInt(inputCantidad.value) || 1;

    return {
      idProducto: parseInt(productoId),
      cantidad: cantidad,
      nombre: select.selectedOptions[0]?.textContent || 'Producto desconocido'
    };
  }).filter(p => p.idProducto);

  if (!idMozo) {
    alert('Por favor, seleccione un mozo.');
    return;
  }
  if (!productos.length) {
    alert('Debe seleccionar al menos un producto.');
    return;
  }

  const params = new URLSearchParams({
    idPedido,
    idMozo,
    especificacion,
    productos: JSON.stringify(productos)
  });
  const clientesEdit = obtenerClientesDesdeChips('clientesChipsEditar');
  if (clientesEdit.length) {
    params.append('clientes', JSON.stringify(clientesEdit));
  }

  fetch('../BackEnd/editarPedido.php', {
    method: 'POST',
    body: params
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        alert('Pedido editado');
        document.getElementById('modalEditar').close();
        sendReload();
        cargarPedidos();
      } else {
        alert(data.message || 'Error');
      }
    });
}

function emailValido(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

async function agregarClienteChip(inputId, chipsContainerId) {
  const input = document.getElementById(inputId);
  const cont = document.getElementById(chipsContainerId);
  const email = (input.value || '').trim().toLowerCase();
  if (!email) return;
  if (!emailValido(email)) { alert('Email inválido'); return; }
  const existentes = Array.from(cont.querySelectorAll('.chip span')).map(s => s.textContent.toLowerCase());
  if (existentes.includes(email)) { input.value = ''; return; }

  try {
    const resp = await fetch('../BackEnd/validarCliente.php', {
      method: 'POST',
      body: new URLSearchParams({ email })
    });
    const data = await resp.json();
    if (!data.success) { alert(data.message || 'Error validando cliente'); return; }
    if (!data.exists) { alert('Cliente no registrado'); return; }
  } catch (err) {
    alert('Error validando cliente');
    return;
  }

  const chip = document.createElement('div');
  chip.className = 'chip';
  chip.innerHTML = `<span>${email}</span> <button type="button" class="chip-remove">×</button>`;
  chip.querySelector('.chip-remove').onclick = () => chip.remove();
  cont.appendChild(chip);
  input.value = '';
}

function obtenerClientesDesdeChips(chipsContainerId) {
  const cont = document.getElementById(chipsContainerId);
  if (!cont) return [];
  return Array.from(cont.querySelectorAll('.chip span')).map(s => s.textContent.trim().toLowerCase());
}

function pInt(v) { return parseInt(v, 10) || 0; }

// Funciones para el manejo de arrastre táctil
function handleTouchStart(e) {
  if (e.touches.length !== 1) return;

  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const card = target.closest('.pedido-card');

  if (!card) return;

  // Evitar arrastrar si se hace clic en un botón
  if (target.closest('button, a, input, select')) {
    return;
  }

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchStartTime = Date.now();
  draggedItem = card;

  // Crear elemento fantasma para el arrastre
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

  // Prevenir scroll durante el arrastre
  document.addEventListener('touchmove', preventScroll, { passive: false });

  // Agregar clase de arrastre
  card.classList.add('dragging');

  // Iniciar seguimiento del movimiento
  isDragging = false; // Se establecerá a true después de un umbral de movimiento
}

function handleTouchMove(e) {
  if (!draggedItem || !ghostElement) return;

  // Verificar si el evento es cancelable antes de intentar prevenirlo
  const isCancelable = e.cancelable && !e.defaultPrevented;
  
  const touch = e.touches[0];
  const deltaX = Math.abs(touch.clientX - touchStartX);
  const deltaY = Math.abs(touch.clientY - touchStartY);

  // Umbral para determinar si es un arrastre o un toque
  if (!isDragging && (deltaX > 10 || deltaY > 10)) {
    isDragging = true;
    if (isCancelable) {
      e.preventDefault();
    }
    return; // Salir temprano para el primer movimiento
  }

  if (!isDragging) return;

  // Solo prevenir el comportamiento por defecto si es seguro hacerlo
  if (isCancelable) {
    e.preventDefault();
  }

  try {
    // Actualizar posición del elemento fantasma
    ghostElement.style.left = `${touch.clientX - initialX}px`;
    ghostElement.style.top = `${touch.clientY - initialY}px`;

    // Resaltar la zona de destino
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

  // Limpiar el estado de arrastre
  const wasDragging = isDragging;
  isDragging = false;

  // Eliminar el elemento fantasma
  if (ghostElement) {
    ghostElement.remove();
    ghostElement = null;
  }

  // Restaurar el scroll
  document.body.style.overflow = '';
  document.removeEventListener('touchmove', preventScroll);

  // Quitar clase de arrastre
  draggedItem.classList.remove('dragging');

  // Si no fue un arrastre, salir
  if (!wasDragging) {
    draggedItem = null;
    return;
  }

  // Obtener la posición final del toque
  const touch = e.changedTouches[0];
  const touchElement = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropzone = touchElement?.closest('.kds-dropzone');

  // Limpiar resaltado de zonas
  document.querySelectorAll('.kds-dropzone').forEach(dz => {
    dz.classList.remove('drag-over');
  });

  // Si hay una zona de destino válida, procesar el cambio de estado
  if (dropzone && draggedItem) {
    const idPedido = draggedItem.dataset.idPedido;
    const nuevoEstado = dropzone.dataset.estado;
    const pedidoObj = pedidos.find(p => String(p.idPedido) === String(idPedido));

    if (pedidoObj && pedidoObj.estado !== nuevoEstado) {
      const TRANSICIONES_MOZO = {
        'Listo': ['Entregado'],
        'Entregado': ['Pagado']
      };

      const permitido = Array.isArray(TRANSICIONES_MOZO[pedidoObj.estado]) &&
        TRANSICIONES_MOZO[pedidoObj.estado].includes(nuevoEstado);

      if (permitido) {
        if (pedidoObj.estado === 'Entregado' && nuevoEstado === 'Pagado') {
          abrirModalPago(idPedido);
        } else {
          if (confirm(`Mover pedido #${idPedido} a "${nuevoEstado.replace('_', ' ')}"?`)) {
            cambiarEstadoPedido(idPedido, nuevoEstado);
          }
        }
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

// Inicializar eventos táctiles con manejo de compatibilidad
function setupTouchEvents() {
  const options = { passive: false };
  document.addEventListener('touchstart', handleTouchStart, options);
  document.addEventListener('touchmove', handleTouchMove, options);
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  document.addEventListener('touchcancel', handleTouchEnd, { passive: true });
}

// Inicializar eventos cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupTouchEvents);
} else {
  setupTouchEvents();
}

function actualizarPromociones() {
  // Usamos tu función existente para obtener los productos actuales del DOM
  const productos = obtenerProductosSeleccionados('div > .producto-item', productosDisponibles);
  const container = document.getElementById('seccionPromociones');
  const lista = document.getElementById('listaPromociones');

  // Si no existe el contenedor en el HTML (por si olvidaste agregarlo), no hacemos nada
  if (!container || !lista) return;

  if (productos.length === 0) {
    container.style.display = 'none';
    lista.innerHTML = '';
    return;
  }

  const formData = new FormData();
  formData.append('productos', JSON.stringify(productos));

  fetch('../BackEnd/buscarPromociones.php', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      lista.innerHTML = '';

      if (data.length > 0) {
        container.style.display = 'block';
        
        data.forEach(promo => {
          // Buscamos el nombre del producto para mostrarlo visualmente
          const prodObj = productosDisponibles.find(p => p.producto_id == promo.producto_id);
          const nombreProd = prodObj ? prodObj.producto_nombre : 'Producto';

          const div = document.createElement('div');
          div.style.cssText = 'margin-bottom: 8px; padding: 5px; border-bottom: 1px solid #eee;';
          div.innerHTML = `
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; width: 100%;">
                <input type="checkbox" class="promo-checkbox" 
                    value="${promo.promocion_id}" 
                    data-producto-id="${promo.producto_id}"
                    data-descuento="${promo.promocion_descuento}">
                <div style="font-size: 0.9rem;">
                    <strong style="color: #2c3e50;">${promo.promocion_nombre}</strong>
                    <br>
                    <span style="font-size: 0.8rem; color: #27ae60;">
                       ${promo.promocion_descuento}% OFF en ${nombreProd}
                    </span>
                </div>
            </label>
          `;
          lista.appendChild(div);
        });
      } else {
        container.style.display = 'none';
      }
    })
    .catch(err => console.error('Error buscando promos:', err));
}