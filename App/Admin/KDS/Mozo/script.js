// script.js - KDS Mozo

let ws;
let productosDisponibles = [];
let pedidos = [];

document.addEventListener('DOMContentLoaded', () => {
  cargarMesas();
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
  const idMozo = 7; // Simulación
  const especificacion = document.getElementById('especificacionPedido').value || '';

  const productos = obtenerProductosSeleccionados('.producto-item', productosDisponibles);
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
        console.log(data);
      }
    });
}

function obtenerProductosSeleccionados(selector, productos) {
  return Array.from(document.querySelectorAll(selector)).map(div => {
    const input = div.querySelector('.autocomplete-producto');
    const prod = productos.find(p => p.nombre === input.value);
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
      const tbody = document.querySelector('#pedidosList tbody');
      tbody.innerHTML = '';
      pedidos.forEach(pedido => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${pedido.idPedido}</td>
          <td>Mesa ${pedido.idMesa}</td>
          <td>${pedido.productos.map(p => p.nombre).join(', ')}</td>
          <td>${pedido.especificacion || 'Sin especificaciones'}</td>
          <td>${new Date(pedido.horaIngreso).toLocaleTimeString()}</td>
          <td>${pedido.estado}</td>
          <td>
            <button onclick="abrirModalEditarPedido(${pedido.idPedido})" class="btn-editar">Editar</button>
            <button onclick="cancelarPedido(${pedido.idPedido})" class="btn-eliminar">Cancelar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

window.onload = function() {
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

  document.getElementById('editarIdPedido').value = idPedido;
  document.getElementById('especificacionPedidoEditar').value = pedido.especificacion || '';
  const cont = document.getElementById('editarProductosContainer');
  cont.innerHTML = '';
  (pedido.productos || []).forEach(prod => {
    agregarProductoInput('editarProductosContainer', productosDisponibles, true, prod.nombre);
  });
  document.getElementById('modalEditar').showModal();
}

function editarPedidoSubmit(e) {
  e.preventDefault();
  const idPedido = document.getElementById('editarIdPedido').value;
  const especificacion = document.getElementById('especificacionPedidoEditar').value || '';
  const productos = obtenerProductosSeleccionados('.producto-item-editar', productosDisponibles);

  if (!productos.length) {
    alert('Debe seleccionar al menos un producto.');
    return;
  }

  fetch('BackEnd/editarPedido.php', {
    method: 'POST',
    body: new URLSearchParams({
      idPedido,
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
        console.log(data);
      }
    });
}
