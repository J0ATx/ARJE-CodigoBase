function formatearFechaHora(fecha){ const d=new Date(fecha); return d.toLocaleString('es-UY',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}) }
function formatearPrecio(n){ const v=parseFloat(n)||0; return `$${v.toFixed(2)}` }
function isPedidoCompletado(estado){ const e=String(estado||'').toLowerCase(); return ['entregado','completado','finalizado','pagado'].some(s=>e.includes(s)) }
function chipEstado(estado){
  const e=String(estado||'').toLowerCase()
  let cls='chip--estado-neutro'
  if (e.includes('pend')) cls='chip--estado-pendiente'
  else if (e.includes('prepar')) cls='chip--estado-preparacion'
  else if (e.includes('entreg')||e.includes('complet')||e.includes('final')) cls='chip--estado-completado'
  return `<span class="chip chip--estado ${cls}">Estado: ${estado||'-'}</span>`
}
function chipTipo(esTA){ return `<span class="chip chip--tipo">${esTA?'Tipo: TAKE AWAY':'Tipo: En mesa'}</span>` }
function chipMesa(mesa){ return `<span class="chip chip--mesa">Mesa: ${mesa?mesa:'—'}</span>` }
function chipPago(metodo){ return `<span class="chip chip--pago">Pago: ${metodo||'-'}</span>` }

async function cargarPedidos(){
  const r = await fetch('../BackEnd/listar.php')
  const data = await r.json()
  if (!data.success) return
  renderPedidos(data.pedidos||[])
}

function renderPedidos(pedidos){
  const cont = document.getElementById('menu-listado')
  cont.innerHTML = ''
  if (!pedidos.length){
    cont.innerHTML = `<div class="pedido-card empty-card">No tienes pedidos aún.</div>`
    return
  }
  pedidos.forEach((p)=>{
    const div=document.createElement('div')
    const esTA = !p.mesa_id
    const productosHTML = (Array.isArray(p.items)?p.items:[]).map(it=>`<li class="producto-item-row"><span>${it.nombre} x${it.cantidad}</span><span>${formatearPrecio(it.precio)}</span></li>`).join('')
    div.className='pedido-card'
    const fechaTitulo = formatearFechaHora(p.pedido_fecha)
    const estadoLine = `${chipEstado(p.pedido_estado)} ${chipTipo(esTA)} ${(!esTA && p.mesa_id ? chipMesa(p.mesa_id) : '')} ${isPedidoCompletado(p.pedido_estado)&&p.pedido_pago?chipPago(p.pedido_pago):''}`
    div.innerHTML = `
      <div class="pedido-header"><strong class="pedido-title">${fechaTitulo}</strong><span class="pedido-total"><strong>${formatearPrecio(p.pedido_monto)}</strong></span></div>
      <div class="chips">${estadoLine}</div>
      <ul class="productos-list">${productosHTML}</ul>
      ${esTA ? `<div class="pedido-actions"><button class="btn" data-repeat="${p.pedido_id}">Repetir pedido</button></div>`:''}
    `
    cont.appendChild(div)
  })
  const modal=document.getElementById('modalRepetir')
  const form=document.getElementById('formRepetir')
  const cerrar=document.getElementById('cerrarModalRepetir')
  const cancelar=document.getElementById('cancelarRepetir')
  let targetPedido=null
  function abrir(id){ targetPedido=id; modal.classList.add('active') }
  function cerrarModal(){ targetPedido=null; modal.classList.remove('active') }
  cont.querySelectorAll('[data-repeat]').forEach(b=>b.addEventListener('click',()=>abrir(parseInt(b.dataset.repeat,10))))
  if (cerrar) cerrar.addEventListener('click',cerrarModal)
  if (cancelar) cancelar.addEventListener('click',cerrarModal)
  if (form) form.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const metodo=document.getElementById('metodoRepetir').value
    if (!metodo) return
    const r = await fetch('../BackEnd/repetir.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pedido_id:targetPedido,metodo})})
    const data = await r.json()
    if (data && data.success){ alert(`Pedido repetido correctamente`); cerrarModal() } else { alert(data.message||'Error al repetir pedido') }
  })
}

async function repetirPedido(pedidoId){
  const metodo = prompt('Método de pago (Efectivo/Tarjeta):','Efectivo')
  if (!metodo || !['Efectivo','Tarjeta'].includes(metodo)) return
  const r = await fetch('../BackEnd/repetir.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pedido_id:pedidoId,metodo})})
  const data = await r.json()
  if (data && data.success){ alert(`Pedido repetido correctamente`) } else { alert(data.message||'Error al repetir pedido') }
}

document.addEventListener('DOMContentLoaded', cargarPedidos)