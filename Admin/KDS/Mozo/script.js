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

  document.getElementById('agregarProductoEditar').addEventListener('click', e => {
    e.preventDefault();
    agregarProductoInput('editarProductosContainer', productosDisponibles, true);
  });
  document.getElementById('formEditarPedido').addEventListener('submit', editarPedidoSubmit);
});

function cargarMesas() {
  fetch('BackEnd/listarMesas.php')
    .then(r => r.json())
    .then(data => {
      const select = document.getElementById('selectMesa');
      select.innerHTML = '';
      data.forEach(mesa => {
        const opt = document.createElement('option');
        opt.value = mesa.idMesa;
        opt.textContent = mesa.nombre || `Mesa ${mesa.idMesa}`;
        select.appendChild(opt);
      });
    });
}

function cargarProductos() {
  fetch('BackEnd/listarProductos.php')
    .then(r => r.json())
    .then(data => {
      productosDisponibles = data;
      document.getElementById('productosContainer').innerHTML = '';
      agregarProductoInput('productosContainer', productosDisponibles);
    });
}

function cargarMozos() {
  return fetch('BackEnd/listarMozos.php')
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
        optNuevo.value = mozo.idUsuario;
        optNuevo.textContent = `${mozo.apellido}, ${mozo.nombre}`;
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

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Buscar producto...';
  input.setAttribute('autocomplete', 'off');
  input.className = 'autocomplete-producto';
  if (valor) input.value = valor;

  const datalist = document.createElement('datalist');
  datalist.id = `datalist-${editar ? 'edit-' : ''}${Math.random().toString(36).substr(2, 9)}`;
  input.setAttribute('list', datalist.id);

  productos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.nombre;
    datalist.appendChild(opt);
  });

  const btnQuitar = document.createElement('button');
  btnQuitar.type = 'button';
  btnQuitar.textContent = 'Quitar';
  btnQuitar.onclick = () => div.remove();

  div.appendChild(input);
  div.appendChild(datalist);
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

  fetch('BackEnd/crearPedido.php', { method: 'POST', body: formData })
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
  return Array.from(document.querySelectorAll(selector)).map(div => {
    const input = div.querySelector('.autocomplete-producto');
    const prod = productos.find((p) => p.nombre === input.value);
    return prod ? { idProducto: prod.idProducto, nombre: prod.nombre } : null;
  }).filter(Boolean);
}

function sendReload() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ action: 'reload' }));
  }
}

function cargarPedidos() {
  fetch('BackEnd/listarPedidos.php')
    .then(r => r.json())
    .then(data => {
      if (!data.success) return;
      pedidos = data.data;
      const pedidosContainer = document.getElementById('pedidosList');
      pedidosContainer.innerHTML = '';

      pedidos.forEach(pedido => {
        // Agrupar productos repetidos
        const productosAgrupados = pedido.productos ? agruparProductos(pedido.productos) : [];

        // Determinar la clase de estado para la tarjeta
        const estadoClase = pedido.estado.toLowerCase().replace(/ /g, '_');

        // Crear la tarjeta de pedido
        const card = document.createElement('div');
        card.className = `pedido-card ${estadoClase}`;

        // Crear el HTML de la tarjeta
        card.innerHTML = `
          <div class="pedido-header">
            <div class="pedido-info">
              <h3 class="pedido-titulo">Pedido #${pedido.idPedido}</h3>
              <div class="pedido-meta">
                <span title="Mesa">
                  Mesa ${pedido.idMesa}
                </span>
                <span title="Hora">
                  ${formatearFechaHora(pedido.horaIngreso).split(', ')[1]}
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
            </div>
          </div>
          
          <div class="pedido-body">
            <ul class="lista-productos">
              ${productosAgrupados.map(producto => `
                <li class="producto-item">
                  <span class="producto-nombre">${producto.nombre}</span>
                  ${producto.cantidad > 1 ? `<span class="producto-cantidad">x${producto.cantidad}</span>` : ''}
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
              ${pedido.estado === 'pendiente' ? 'Pendiente' :
            pedido.estado === 'en_preparacion' ? 'En preparacion' :
              pedido.estado === 'listo' ? 'Listo' :
                pedido.estado === 'entregado' ? 'Entregado' : 'Cancelado'}
            </span>
            <span class="tiempo-transcurrido" title="${formatearFechaHora(pedido.horaIngreso)}">
              ${calcularTiempoTranscurrido(pedido.horaIngreso)}
            </span>
          </div>
        `;
        pedidosContainer.appendChild(card);
        console.log(pedido);

      });
      inicializarFiltros();
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

function agruparProductos(productos) {
  const agrupados = {};
  productos.forEach(producto => {
    if (agrupados[producto.nombre]) {
      agrupados[producto.nombre].cantidad += 1;
    } else {
      agrupados[producto.nombre] = {
        ...producto,
        cantidad: 1
      };
    }
  });

  return Object.values(agrupados);
}

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
  fetch('BackEnd/cancelarPedido.php', {
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
  if (!pedido) return;

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
      agregarProductoInput('editarProductosContainer', productosDisponibles, true, prod.nombre);
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
  const productos = obtenerProductosSeleccionados('div >.producto-item-editar', productosDisponibles);

  // Validar que se haya seleccionado un mozo
  if (!idMozo) {
    alert('Por favor, seleccione un mozo.');
    return;
  }

  if (!productos.length) {
    alert('Debe seleccionar al menos un producto.');
    return;
  }

  fetch('BackEnd/editarPedido.php', {
    method: 'POST',
    body: new URLSearchParams({
      idPedido,
      idMozo,
      especificacion,
      productos: JSON.stringify(productos)
    })
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
