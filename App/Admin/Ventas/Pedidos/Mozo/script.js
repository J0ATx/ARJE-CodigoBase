// script.js - KDS Mozo

let ws;
let productosDisponibles = [];
let pedidos = [];

document.addEventListener('DOMContentLoaded', () => {
  cargarMesas();
  cargarMozos();
  cargarProductos();
  cargarPedidos();

  document.getElementById('btnAbrirNuevoPedido').addEventListener('click', abrirModalNuevoPedido);
  document.getElementById('agregarProducto').addEventListener('click', e => {
    e.preventDefault();
    agregarProductoInput('productosContainer', productosDisponibles);
  });
  document.getElementById('formPedido').addEventListener('submit', crearPedido);
  // chips: agregar clientes (crear)
  const btnAgregarCliente = document.getElementById('agregarCliente');
  if (btnAgregarCliente) {
    btnAgregarCliente.addEventListener('click', () => agregarClienteChip('clienteEmail', 'clientesChips'));
  }

  document.getElementById('agregarProductoEditar').addEventListener('click', e => {
    e.preventDefault();
    agregarProductoInput('editarProductosContainer', productosDisponibles, true);
  });
  document.getElementById('formEditarPedido').addEventListener('submit', editarPedidoSubmit);
  // chips: agregar clientes (editar)
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
      // Actualizar select de nuevo pedido
      const selectNuevo = document.getElementById('selectMozo');
      selectNuevo.innerHTML = '';
      
      // Agregar opción por defecto al select de nuevo pedido
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Seleccione un mozo';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      selectNuevo.appendChild(defaultOption);
      
      // Actualizar select de edición
      const selectEditar = document.getElementById('editarSelectMozo');
      selectEditar.innerHTML = '';
      
      // Agregar opción por defecto al select de edición
      const defaultOptionEditar = defaultOption.cloneNode(true);
      selectEditar.appendChild(defaultOptionEditar);
      
      // Agregar mozos a ambos selects
      data.forEach(mozo => {
        // Para nuevo pedido
        const optNuevo = document.createElement('option');
        optNuevo.value = mozo.personal_id;
        optNuevo.textContent = `${mozo.personal_apellido}, ${mozo.personal_nombre}`;
        selectNuevo.appendChild(optNuevo);
        
        // Para edición
        const optEditar = optNuevo.cloneNode(true);
        selectEditar.appendChild(optEditar);
      });
      
      return data; // Devolver los datos para usar en la cadena de promesas
    })
    .catch(error => {
      console.error('Error al cargar los mozos:', error);
      throw error; // Propagar el error para manejarlo en las llamadas posteriores
    });
}

function agregarProductoInput(containerId, productos, editar = false, valor = '') {
  const cont = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = editar ? 'producto-item-editar' : 'producto-item';

  // Selector de producto
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

  // Input cantidad
  const inputCantidad = document.createElement('input');
  inputCantidad.type = 'number';
  inputCantidad.min = 1;
  inputCantidad.value = 1;
  inputCantidad.className = 'input-cantidad';
  inputCantidad.style.width = '60px';

  // Si valor viene de edición, buscar cantidad
  if (editar && valor) {
    // Buscar el producto en productosDisponibles y setear cantidad si existe
    const prod = productos.find(p => p.producto_nombre === valor);
    if (prod && prod.contiene_cantidad) inputCantidad.value = prod.contiene_cantidad;
  }

  // Botón quitar
  const btnQuitar = document.createElement('button');
  btnQuitar.type = 'button';
  btnQuitar.textContent = 'Quitar';
  btnQuitar.onclick = () => div.remove();

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
  
  // Validar que se haya seleccionado un mozo
  if (!idMozo) {
    alert('Por favor, seleccione un mozo.');
    return;
  }

  const productos = obtenerProductosSeleccionados('div > .producto-item', productosDisponibles);
  if (!productos.length) {
    alert('Debe seleccionar al menos un producto.');
    return;
  }

  const formData = new FormData();
  formData.append('idMesa', idMesa);
  formData.append('idMozo', idMozo);
  formData.append('especificacion', especificacion);
  formData.append('productos', JSON.stringify(productos));
  // Adjuntar clientes si hay chips
  const clientes = obtenerClientesDesdeChips('clientesChips');
  if (clientes.length) {
    formData.append('clientes', JSON.stringify(clientes));
  }

  fetch('../BackEnd/crearPedido.php', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        alert('Pedido creado');
        document.getElementById('formPedido').reset();
        document.getElementById('productosContainer').innerHTML = '';
        sendReload();
        cargarPedidos();
      } else {
        alert(data.message || 'Error');
      }
    });
}

function obtenerProductosSeleccionados(selector, productos) {
  // Obtener productos y cantidades del formulario
  return Array.from(document.querySelectorAll(selector))
    .map(div => {
      const select = div.querySelector('.select-producto');
      const inputCantidad = div.querySelector('.input-cantidad');
      if (!select || !inputCantidad) return null;
      
      const productoId = select.value;
      const cantidad = Math.max(1, parseInt(inputCantidad.value) || 1);
      
      // Si el producto está en productosDisponibles, usar esa información
      const prodDisponible = productos.find(p => String(p.producto_id) === String(productoId));
      if (prodDisponible) {
        return {
          idProducto: parseInt(productoId),
          cantidad: cantidad,
          nombre: prodDisponible.producto_nombre
        };
      }
      
      // Si no está en productos disponibles pero tiene un valor válido, usar los datos del select
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
  fetch('../BackEnd/listarPedidos.php')
    .then(r => r.json())
    .then(data => {
      if (!data.success) return;
      pedidos = data.data;
      const pedidosContainer = document.getElementById('pedidosList');
      pedidosContainer.innerHTML = '';

      pedidos.forEach(pedido => {
        const productosLista = Array.isArray(pedido.productos) ? pedido.productos : [];
        const estadoClase = pedido.estado.toLowerCase().replace(/-/g, '_');
        const card = document.createElement('div');
        card.className = `pedido-card ${estadoClase}`;

        // Botones de cambio de estado
        let btnEstado = '';
        if (pedido.estado === 'Listo') {
          btnEstado = `<button class="btn-accion" onclick="cambiarEstadoPedido(${pedido.idPedido}, 'Entregado')">Entregar</button>`;
        } else if (pedido.estado === 'Entregado') {
          btnEstado = `<button class="btn-accion" onclick="abrirModalPago(${pedido.idPedido})">Pagar</button>`;
        }

        card.innerHTML = `
          <div class="pedido-header">
            <div class="pedido-info">
              <h3 class="pedido-titulo">Pedido #${pedido.idPedido}</h3>
              <div class="pedido-meta">
                <span title="Mesa">
                  <i class="fas fa-table"></i> Mesa ${pedido.idMesa}
                </span>
                <span title="Mozo">
                  <i class="fas fa-user-tie"></i> ${pedido.nombreMozo || 'Sin asignar'}
                </span>
                <span title="Fecha">
                  <i class="far fa-calendar-alt"></i> ${formatearFechaHora(pedido.fecha)}
                </span>
              </div>
            </div>
            <div class="pedido-acciones">
              <button class="btn-accion" title="Editar pedido" onclick="abrirModalEditarPedido(${pedido.idPedido})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-accion" title="Cancelar pedido" onclick="cancelarPedido(${pedido.idPedido})">
                <i class="fas fa-times"></i>
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
                pedido.estado === 'Entregado' ? 'Entregado' : pedido.estado === 'Pagado' ? 'Pagado' : 'Cancelado'}
            </span>
            <span class="tiempo-transcurrido" title="${formatearFechaHora(pedido.fecha)}">
              ${calcularTiempoTranscurrido(pedido.fecha)}
            </span>
          </div>
        `;
        pedidosContainer.appendChild(card);
      });
      inicializarFiltros();


window.cambiarEstadoPedido = function(idPedido, nuevoEstado) {
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

window.abrirModalPago = function(idPedido) {
  const pedido = pedidos.find(p => p.idPedido == idPedido);
  if (!pedido) return;
  console.log(pedido)
  const modal = document.getElementById('modalPago');
  document.getElementById('modalPagoMonto').textContent = pedido.monto;
  modal.setAttribute('data-idPedido', idPedido);
  modal.showModal();
}

window.confirmarPago = function() {
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

function inicializarFiltros() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover clase active de todos los botones
      filterBtns.forEach(b => b.classList.remove('active'));
      // Agregar clase active al botón clickeado
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const cards = document.querySelectorAll('.pedido-card');

      cards.forEach(card => {
        if (filter === 'all' || card.classList.contains(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// (Se elimina la agrupación en front: las cantidades vienen desde Contiene)

// Función para formatear la fecha y hora
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

function cancelarPedido(idPedido) {
  if (!confirm('¿Cancelar este pedido?')) return;
  fetch('../BackEnd/cancelarPedido.php', {
    method: 'POST',
    body: new URLSearchParams({ idPedido })
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) cargarPedidos();
      else alert(data.message || 'Error');
    });
}

function abrirModalEditarPedido(idPedido) {
  const pedido = pedidos.find(p => p.idPedido == idPedido);
  if (!pedido) {
    console.error('Pedido no encontrado:', idPedido);
    return;
  }

  // Cargar mozos si no están ya cargados
  cargarMozos().then(() => {
    // Establecer el valor del mozo seleccionado
    const selectMozo = document.getElementById('editarSelectMozo');
    if (pedido.idMozo) {
      selectMozo.value = pedido.idMozo;
    }
    
    // Configurar el resto del formulario
    document.getElementById('editarIdPedido').value = idPedido;
    document.getElementById('especificacionPedidoEditar').value = pedido.especificacion || '';
    
    // Limpiar y cargar productos
    const cont = document.getElementById('editarProductosContainer');
    cont.innerHTML = '';
    
    (pedido.productos || []).forEach(prod => {
      const div = document.createElement('div');
      div.className = 'producto-item-editar';
      // Selector de producto
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
      // Input cantidad
      const inputCantidad = document.createElement('input');
      inputCantidad.type = 'number';
      inputCantidad.min = '1';
      inputCantidad.className = 'input-cantidad';
      inputCantidad.style.width = '60px';
      inputCantidad.value = prod.contiene_cantidad || prod.cantidad || 1;
      // Botón quitar
      const btnQuitar = document.createElement('button');
      btnQuitar.type = 'button';
      btnQuitar.textContent = 'Quitar';
      btnQuitar.onclick = () => div.remove();
      div.appendChild(select);
      div.appendChild(inputCantidad);
      div.appendChild(btnQuitar);
      cont.appendChild(div);
    });
    
    // Limpiar y cargar clientes
    const chipsContainer = document.getElementById('clientesChipsEditar');
    chipsContainer.innerHTML = '';
    (pedido.clientes || []).forEach(email => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.innerHTML = `<span>${email}</span> <button type="button" class="chip-remove">×</button>`;
      chip.querySelector('.chip-remove').onclick = () => chip.remove();
      chipsContainer.appendChild(chip);
    });
    
    // Mostrar el modal
    document.getElementById('modalEditar').showModal();
  });
}

function editarPedidoSubmit(e) {
  e.preventDefault();
  const idPedido = document.getElementById('editarIdPedido').value;
  const idMozo = document.getElementById('editarSelectMozo').value;
  const especificacion = document.getElementById('especificacionPedidoEditar').value || '';
  
  // Obtener productos seleccionados
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

  // Validar que se haya seleccionado un mozo
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

// Helpers chips clientes
function emailValido(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function agregarClienteChip(inputId, chipsContainerId) {
  const input = document.getElementById(inputId);
  const cont = document.getElementById(chipsContainerId);
  const email = (input.value || '').trim().toLowerCase();
  if (!email) return;
  if (!emailValido(email)) { alert('Email inválido'); return; }
  // evitar duplicados
  const existentes = Array.from(cont.querySelectorAll('.chip span')).map(s => s.textContent.toLowerCase());
  if (existentes.includes(email)) { input.value=''; return; }

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

function pInt(v){ return parseInt(v, 10) || 0; }
