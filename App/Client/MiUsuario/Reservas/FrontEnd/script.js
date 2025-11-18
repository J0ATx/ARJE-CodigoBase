function formatearFecha(fecha) { const d = new Date(fecha); return d.toLocaleDateString('es-UY', { year: 'numeric', month: '2-digit', day: '2-digit' }) }
function formatearHora(hora) { return String(hora || '').slice(0, 5) }
function sumarHoras(hora, horas) { const [hh, mm, ss] = String(hora || '00:00:00').split(':').map(x => parseInt(x, 10) || 0); const date = new Date(0, 0, 0, hh, mm, ss || 0); date.setHours(date.getHours() + parseInt(horas || 0, 10)); const hh2 = String(date.getHours()).padStart(2, '0'); const mm2 = String(date.getMinutes()).padStart(2, '0'); return `${hh2}:${mm2}` }

function chipMesa(mesa) { return `<span class="chip">Mesa: ${mesa ? mesa : '—'}</span>` }
function chipPersonas(n) { return `<span class="chip">Personas: ${n || '-'}</span>` }
function chipDuracion(h) { return `<span class="chip">Duración: ${h}h</span>` }

async function cargarReservas() {
  const r = await fetch('../BackEnd/listar.php')
  const data = await r.json()
  if (!data.success) return
  renderReservas(data.reservas || [])
}

function renderReservas(reservas) {
  const cont = document.getElementById('reservas-listado')
  cont.innerHTML = ''
  if (!reservas.length) { cont.innerHTML = `<div class="reserva-card empty-card">No tienes reservas aún.</div>`; return }
  reservas.forEach((r) => {
    const div = document.createElement('div')
    div.className = 'reserva-card'
    const fechaTitulo = `${formatearFecha(r.reserva_fecha)} ${formatearHora(r.reserva_inicio)} - ${sumarHoras(r.reserva_inicio, r.reserva_duracion)}`
    const chips = `${chipMesa(r.mesa_id)} ${chipPersonas(r.reserva_cantidad_personas)} ${chipDuracion(r.reserva_duracion)}`
    div.innerHTML = `
      <div class="reserva-header"><strong class="reserva-title">${fechaTitulo}</strong></div>
      <div class="chips">${chips}</div>
      <div class="reserva-body">
        <div class="reserva-row"><span>Fecha</span><span>${formatearFecha(r.reserva_fecha)}</span></div>
        <div class="reserva-row"><span>Hora</span><span>${formatearHora(r.reserva_inicio)}</span></div>
        <div class="reserva-row"><span>Mesa</span><span>${r.mesa_id || '—'}</span></div>
        <div class="reserva-row"><span>Personas</span><span>${r.reserva_cantidad_personas || '-'}</span></div>
      </div>
      <div class="reserva-actions">
        <button class="btn" data-cancel="${r.reserva_id}">Eliminar</button>
      </div>
    `
    cont.appendChild(div)
  })

  const modal = document.getElementById('modalConfirmar')
  const btnCerrar = document.getElementById('cerrarModalConfirmar')
  const btnCancelar = document.getElementById('cancelarCancelar')
  const btnConfirmar = document.getElementById('confirmarCancelar')
  let targetId = null
  function abrirConfirmar(id) { targetId = id; modal.classList.add('active') }
  function cerrarConfirmar() { targetId = null; modal.classList.remove('active') }
  if (btnCerrar) btnCerrar.onclick = cerrarConfirmar
  if (btnCancelar) btnCancelar.onclick = cerrarConfirmar
  if (btnConfirmar) btnConfirmar.onclick = async function () {
    if (!targetId) return
    const res = await fetch('../BackEnd/cancelar.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reserva_id: targetId }) })
    const data = await res.json()
    if (data && data.success) { cerrarConfirmar(); cargarReservas() } else { alert(data.message || 'No se pudo eliminar la reserva') }
  }
  document.querySelectorAll('[data-cancel]').forEach(b => {
    b.addEventListener('click', () => { const id = parseInt(b.dataset.cancel, 10); abrirConfirmar(id) })
  })
}

document.addEventListener('DOMContentLoaded', cargarReservas)