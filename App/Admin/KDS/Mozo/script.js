// script.js - KDS Mozo

document.addEventListener('DOMContentLoaded', () => {
  cargarMesas();
  cargarProductos();
  cargarPedidos();

  // Botón para abrir modal de nuevo pedido
  document.getElementById('btnAbrirNuevoPedido').addEventListener('click', () => {
    cargarMesas();
    cargarProductos();
    document.getElementById('productosContainer').innerHTML = '';
    agregarProductoInput();
    document.getElementById('formPedido').reset();
    document.getElementById('modalNuevoPedido').showModal();
  });
  document.getElementById('agregarProducto').addEventListener('click', function (e) {
    e.preventDefault();
    agregarProductoInput();
  });
  document.getElementById('formPedido').addEventListener('submit', crearPedido);
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
        opt.textContent = mesa.nombre ? mesa.nombre : `Mesa ${mesa.idMesa}`;
        select.appendChild(opt);
      });
    });
}

function cargarProductos() {
  fetch('BackEnd/listarProductos.php')
    .then(r => r.json())
    .then(data => {
      window.productosDisponibles = data;
      document.getElementById('productosContainer').innerHTML = '';
      agregarProductoInput();
    });
}

function agregarProductoInput() {
  const cont = document.getElementById('productosContainer');
  const div = document.createElement('div');
  div.className = 'producto-item';

  // Autocompletado
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Buscar producto...';
  input.setAttribute('autocomplete', 'off');
  input.className = 'autocomplete-producto';

  const datalist = document.createElement('datalist');
  datalist.id = 'datalist-' + Math.random().toString(36).substr(2, 9);
  input.setAttribute('list', datalist.id);

  window.productosDisponibles.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.nombre;
    datalist.appendChild(opt);
  });

  // Para obtener el idProducto seleccionado
  let idProductoSeleccionado = null;
  input.addEventListener('input', function () {
    const prod = window.productosDisponibles.find(p => p.nombre === input.value);
    idProductoSeleccionado = prod ? prod.idProducto : null;
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

function agregarProductoInputEditar() {
  const cont = document.getElementById('editarProductosContainer');
  const div = document.createElement('div');
  div.className = 'producto-item-editar';

  // Autocompletado
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Buscar producto...';
  input.setAttribute('autocomplete', 'off');
  input.className = 'autocomplete-producto';

  const datalist = document.createElement('datalist');
  datalist.id = 'datalist-edit' + Math.random().toString(36).substr(2, 9);
  input.setAttribute('list', datalist.id);

  window.productosDisponibles.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.nombre;
    datalist.appendChild(opt);
  });

  // Para obtener el idProducto seleccionado
  let idProductoSeleccionado = null;
  input.addEventListener('input', function () {
    const prod = window.productosDisponibles.find(p => p.nombre === input.value);
    idProductoSeleccionado = prod ? prod.idProducto : null;
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

function crearPedido(e) {
  e.preventDefault();
  const idMesa = document.getElementById('selectMesa').value;
  const idMozo = 7; // Simulación
  const especificacion = document.getElementById('especificacionPedido').value || '';

  const productos = Array.from(document.querySelectorAll('.producto-item')).map(div => {
    const input = div.querySelector('.autocomplete-producto');
    const prod = window.productosDisponibles.find(p => p.nombre === input.value);
    return {
      idProducto: prod ? prod.idProducto : ''
    };
  }).filter(p => p.idProducto);
  const formData = new FormData();
  formData.append('idMesa', idMesa);
  formData.append('idMozo', idMozo);
  formData.append('especificacion', especificacion);
  formData.append('productos', JSON.stringify(productos));
  fetch('BackEnd/crearPedido.php', {
    method: 'POST',
    body: formData
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        alert('Pedido creado');
        document.getElementById('formPedido').reset();
        document.getElementById('productosContainer').innerHTML = '';
        cargarPedidos();
      } else {
        alert(data.message || 'Error');
        console.log(data)
      }
    });
}

function cargarPedidos() {
  fetch('BackEnd/listarPedidos.php')
    .then(r => r.json())
    .then(data => {
      window.pedidos = data.data;
      console.log(window.pedidos)
      const tbody = document.querySelector('#pedidosList tbody');
      tbody.innerHTML = '';
      if (!data.success) return;
      data.data.forEach(pedido => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${pedido.idPedido}</td>
          <td>Mesa ${pedido.idMesa}</td>
          <td>${pedido.productos.map(p => p.nombre).join(', ')}</td>
          <td>${pedido.especificacion || 'Sin especificaciones'}</td>
          <td>${new Date(pedido.horaIngreso).toLocaleTimeString()}</td>
          <td>${pedido.estado}</td>
          <td>
            <button onclick="abrirModalEditarPedido(${pedido.idPedido}, '${pedido.productos.map(p => p.nombre).join(', ') || ''}', '${pedido.especificacion || ''}')" class="btn-editar">Editar</button>
            <button onclick="cancelarPedido(${pedido.idPedido})" class="btn-eliminar">Cancelar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
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
  const pedido = window.pedidos.find(p => p.idPedido == idPedido);
  if (!pedido) return;

  // Configurar el modal de edición
  document.getElementById('editarIdPedido').value = idPedido;
  document.getElementById('especificacionPedidoEditar').value = pedido.especificacion || '';
  const cont = document.getElementById('editarProductosContainer');
  cont.innerHTML = '';
  (pedido.productos || []).forEach(prod => {
    console.log(pedido.productos)
    const div = document.createElement('div');
    div.className = 'producto-item-editar';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Buscar producto...';
    input.setAttribute('autocomplete', 'off');
    input.className = 'autocomplete-producto';
    input.value = prod.nombre;

    const datalist = document.createElement('datalist');
    datalist.id = 'datalist-edit-' + Math.random().toString(36).substr(2, 9);
    input.setAttribute('list', datalist.id);

    window.productosDisponibles.forEach(p => {
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
  });
  document.getElementById('modalEditar').showModal();
}

document.getElementById('agregarProductoEditar').addEventListener('click', function (e) {
  e.preventDefault();
  agregarProductoInputEditar();
});

document.getElementById('formEditarPedido').addEventListener('submit', function editarPedido(e) {
  e.preventDefault();
  const idPedido = document.getElementById('editarIdPedido').value;
  const especificacion = document.getElementById('especificacionPedidoEditar').value || '';

  const productos = Array.from(document.querySelectorAll('.producto-item-editar')).map(div => {
    const input = div.querySelector('.autocomplete-producto');
    const prod = window.productosDisponibles.find(p => p.nombre === input.value);
    if (!prod) return null;
    return {
      idProducto: prod.idProducto,
      nombre: prod.nombre
    };
  }).filter(Boolean);
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
        cargarPedidos();
      } else {
        alert(data.message || 'Error');
        console.log(data);
      }
    });
});

function editarPedido(e) {
  const idPedido = e;
  const productos = Array.from(document.querySelectorAll('#editarProductosContainer .producto-item')).map(div => {
    const input = div.querySelector('.autocomplete-producto');
    const prod = window.productosDisponibles.find(p => p.nombre === input.value);
    return {
      idProducto: prod ? prod.idProducto : ''
    };
  }).filter(p => p.idProducto);
  console.log(productos);
  fetch('BackEnd/editarPedido.php', {
    method: 'POST',
    body: new URLSearchParams({
      idPedido,
      productos: JSON.stringify(productos)
    })
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        alert('Pedido editado');
        document.getElementById('modalEditar').close();
        cargarPedidos();
      } else {
        alert(data.message || 'Error');
        console.log(data)
      }
    });
}
