document.addEventListener('DOMContentLoaded', async () => {
  await cargarEstado();
  const btn = document.getElementById('btnSolicitar');
  btn.addEventListener('click', solicitarFidelizacion);
});

async function cargarEstado(){
  const cont = document.getElementById('fidelizacion-info');
  const msg = document.getElementById('msgFidelizacion');
  cont.innerHTML = '';
  msg.textContent = '';
  try{
    const res = await fetch('../BackEnd/estado.php', { method: 'GET', credentials: 'same-origin' });
    const data = await res.json();
    if(!data.success){
      msg.textContent = data.message || 'Error al cargar estado';
      return;
    }
    const estado = data.fidelizado ? 'Sí' : 'No';
    const pedidos = data.pedidos_count || 0;
    const solicitudEstado = data.solicitud_estado || 'Sin solicitud';
    cont.innerHTML = `
      <div class="dato"><strong>Cliente fidelizado:</strong> ${estado}</div>
      <div class="dato"><strong>Pedidos registrados:</strong> ${pedidos}</div>
      <div class="dato"><strong>Estado de solicitud:</strong> ${solicitudEstado}</div>
      <div class="nota">Se fideliza automáticamente al alcanzar 15 pedidos.</div>
    `;
    const btn = document.getElementById('btnSolicitar');
    btn.disabled = solicitudEstado === 'Pendiente' || data.fidelizado === true;
  }catch(e){
    msg.textContent = 'Error al cargar estado';
  }
}

async function solicitarFidelizacion(){
  const msg = document.getElementById('msgFidelizacion');
  msg.textContent = '';
  const btn = document.getElementById('btnSolicitar');
  btn.disabled = true;
  try{
    const res = await fetch('../BackEnd/solicitar.php', { method: 'POST', credentials: 'same-origin' });
    const data = await res.json();
    if(data && data.success){
      msg.textContent = 'Solicitud enviada correctamente';
    }else{
      msg.textContent = data.message || 'Error al solicitar fidelización';
    }
  }catch(e){
    msg.textContent = 'Error al solicitar fidelización';
  }finally{
    await cargarEstado();
  }
}