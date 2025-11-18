document.addEventListener('DOMContentLoaded', async () => {
  await checkSession();
  initUI();
  await cargarSolicitudes();
});

function debounce(fn, delay){
  let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), delay); };
}

function initUI(){
  const searchInput = document.getElementById('searchInput');
  const refreshBtn = document.getElementById('refreshBtn');
  if (searchInput) searchInput.addEventListener('input', debounce(()=>cargarSolicitudes(searchInput.value), 300));
  if (refreshBtn) refreshBtn.addEventListener('click', ()=>cargarSolicitudes(searchInput?.value||''));
}

async function cargarSolicitudes(searchTerm = ''){
  const cont = document.getElementById('listado');
  cont.innerHTML = '';
  try{
    const formData = new FormData();
    if (searchTerm) formData.append('search', searchTerm);
    const res = await fetch('../BackEnd/listar.php', { method: 'POST', credentials: 'same-origin', body: formData });
    const data = await res.json();
    if(!data.success){
      cont.innerHTML = `<p>${data.message||'Error al listar'}</p>`;
      return;
    }
    renderSolicitudes(data.solicitudes||[]);
  }catch(e){
    cont.innerHTML = '<p>Error al listar</p>';
  }
}

function renderSolicitudes(rows){
  const cont = document.getElementById('listado');
  const html = [`<table><thead><tr>
    <th>Cliente</th><th>Email</th><th>Teléfono</th><th>Pedidos</th><th>Fidelizado</th><th>Estado</th><th>Acciones</th>
  </tr></thead><tbody>`];
  for(const s of rows){
    const estadoCls = s.solicitud_estado === 'Pendiente' ? 'estado-pendiente' : s.solicitud_estado === 'Aprobada' ? 'estado-aprobada' : 'estado-rechazada';
    html.push(`<tr>
      <td>
        <div class="solicitud-info">
          <span class="solicitud-nombre">${s.cliente_nombre} ${s.cliente_apellido}</span>
        </div>
      </td>
      <td>${s.cliente_id}</td>
      <td>${s.cliente_telefono||''}</td>
      <td>${s.pedidos_count}</td>
      <td>${s.cliente_fidelizado ? 'Sí' : 'No'}</td>
      <td class="${estadoCls}">${s.solicitud_estado}</td>
      <td class="acciones">
        <button class="btn-menu" onclick="toggleMenu(this)">⋮</button>
        <div class="menu-opciones">
          <div class="opcion" onclick="verDetalles(${s.solicitud_id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/></svg>
            Ver detalles
          </div>
          <div class="opcion" onclick="accionSolicitud('aprobar', ${s.solicitud_id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17l-3.59-3.58L4 14l5 5 12-12-1.41-1.42z" fill="currentColor"/></svg>
            Aprobar
          </div>
          <div class="opcion" onclick="accionSolicitud('rechazar', ${s.solicitud_id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>
            Rechazar
          </div>
          <div class="opcion" onclick="editarEstado(${s.solicitud_id}, '${s.solicitud_estado}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
            Editar estado
          </div>
        </div>
      </td>
    </tr>`);
  }
  html.push('</tbody></table>');
  cont.innerHTML = html.join('');
}

function toggleMenu(btn){
  document.querySelectorAll('.menu-opciones').forEach(menu => {
    if (menu !== btn.nextElementSibling) menu.style.display = 'none';
  });
  const menu = btn.nextElementSibling;
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

async function accionSolicitud(tipo, solicitudId){
  const url = tipo==='aprobar' ? '../BackEnd/aprobar.php' : '../BackEnd/rechazar.php';
  try{
    const res = await fetch(url, { method: 'POST', credentials: 'same-origin', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ solicitud_id: Number(solicitudId) }) });
    const data = await res.json();
    if(data && data.success){
      await cargarSolicitudes(document.getElementById('searchInput')?.value||'');
    }else{
      alert(data.message||'Error en la acción');
    }
  }catch(e){
    alert('Error en la acción');
  }
}

function verDetalles(solicitudId){
  const fila = [...document.querySelectorAll('#listado tbody tr')].find(tr => tr.querySelector('.btn-menu')?.nextElementSibling?.querySelector(`.opcion[onclick*="${solicitudId}"]`));
  if(!fila) return;
  const cells = fila.querySelectorAll('td');
  const nombre = cells[0].querySelector('.solicitud-nombre').textContent;
  const email = cells[1].textContent;
  const telefono = cells[2].textContent;
  const pedidos = cells[3].textContent;
  const fidelizado = cells[4].textContent;
  const estado = cells[5].textContent;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Detalles de la solicitud</h2>
      <div class="solicitud-details">
        <div class="detail-section">
          <h3>Cliente</h3>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${telefono || '—'}</p>
        </div>
        <div class="detail-section">
          <h3>Estado</h3>
          <p><strong>Pedidos:</strong> ${pedidos}</p>
          <p><strong>Fidelizado:</strong> ${fidelizado}</p>
          <p><strong>Solicitud:</strong> ${estado}</p>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.style.display='flex';
  modal.querySelector('.close').onclick=()=>modal.remove();
  window.addEventListener('click',(e)=>{ if(e.target===modal) modal.remove(); });
}

function editarEstado(solicitudId, estadoActual){
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Editar estado</h2>
      <div class="form-group">
        <label for="nuevoEstado">Nuevo estado</label>
        <select id="nuevoEstado">
          <option value="Pendiente" ${estadoActual==='Pendiente'?'selected':''}>Pendiente</option>
          <option value="Aprobada" ${estadoActual==='Aprobada'?'selected':''}>Aprobada</option>
          <option value="Rechazada" ${estadoActual==='Rechazada'?'selected':''}>Rechazada</option>
        </select>
      </div>
      <button class="submit-button" id="guardarEstado">Guardar</button>
    </div>`;
  document.body.appendChild(modal);
  modal.style.display='flex';
  const closeBtn = modal.querySelector('.close');
  closeBtn.onclick=()=>modal.remove();
  window.addEventListener('click',(e)=>{ if(e.target===modal) modal.remove(); });
  modal.querySelector('#guardarEstado').onclick = async ()=>{
    const nuevoEstado = document.getElementById('nuevoEstado').value;
    try{
      const res = await fetch('../BackEnd/editar.php', { method: 'POST', credentials: 'same-origin', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ solicitud_id: Number(solicitudId), estado: nuevoEstado }) });
      const data = await res.json();
      if (data.success){
        modal.remove();
        await cargarSolicitudes(document.getElementById('searchInput')?.value||'');
      } else {
        alert(data.message||'Error al editar');
      }
    }catch(e){ alert('Error al editar'); }
  };
}