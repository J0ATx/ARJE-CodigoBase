// script.js - KDS Cocina

document.addEventListener('DOMContentLoaded', () => {
  cargarComandas();
  setInterval(cargarComandas, 5000); // Actualiza cada 5 segundos
});

function cargarComandas() {
  fetch('BackEnd/listarPedidos.php')
    .then(r => r.json())
    .then(data => {
      const cont = document.getElementById('comandasList');
      cont.innerHTML = '';
      if (!data.success) return;
      data.data.forEach(ped => {
        const div = document.createElement('div');
        div.className = 'comanda-cocina';
        div.innerHTML = `
          <b>Pedido #${ped.idPedido}</b> | Mesa: ${ped.idMesa} | Estado: ${ped.estado}<br>
          Productos: ${ped.productos || ''}<br>
          Comentarios: ${ped.comentarios || ''}<br>
          <button onclick="cambiarEstado(${ped.idPedido}, '${ped.estado}')">Cambiar Estado</button>
        `;
        cont.appendChild(div);
      });
    });
}

function cambiarEstado(idPedido, estadoActual) {
  let nuevoEstado = '';
  if (estadoActual === 'pendiente') nuevoEstado = 'en_preparacion';
  else if (estadoActual === 'en_preparacion') nuevoEstado = 'listo';
  else if (estadoActual === 'listo') nuevoEstado = 'entregado';
  else return;
  fetch('BackEnd/cambiarEstado.php', {
    method: 'POST',
    body: new URLSearchParams({idPedido, nuevoEstado})
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) cargarComandas();
      else alert(data.message || 'Error');
    });
}
