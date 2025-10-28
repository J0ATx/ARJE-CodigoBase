const MainContent = document.querySelector("#main-content")
document.addEventListener('DOMContentLoaded', () => {
    cargarComandas();
});

let ws;

window.onload = function () {
    ws = new WebSocket('ws://localhost:8080/App/Admin/KDS/Cocina/index');
    ws.onopen = function () {
        console.log('Sistema conectado a cocina');
    };

    ws.onmessage = function (event) {
        try {
            const data = JSON.parse(event.data);
            if (data.action === 'reload') {
                cargarComandas();
            }
        } catch (error) {
            console.error('Error al procesar mensaje WebSocket:', error);
        }
    };

    ws.onclose = function () {
        console.log('Conexión WebSocket cerrada');
    };
};

const ESTADOS = {
    Pendiente: { clase: 'bg-warning', texto: 'Pendiente' },
    'En-Preparacion': { clase: 'bg-info', texto: 'En preparación' },
    Listo: { clase: 'bg-success', texto: 'Listo para entregar' },
    Entregado: { clase: 'bg-secondary', texto: 'Entregado' }
};

const TRANSICIONES = {
    Pendiente: ['En-Preparacion'],
    'En-Preparacion': ['Listo'],
    Listo: []
};

/**
 * Carga las comandas desde el servidor
 */
async function cargarComandas() {
    try {
        const response = await fetch('../BackEnd/listarPedidos.php');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al cargar comandas');
        }

        const contenedor = document.getElementById('comandasList');
        if (!contenedor) return;

        contenedor.innerHTML = '';

        data.data.sort((a, b) => {
            const ordenEstados = { 'Pendiente': 1, 'En_Preparacion': 2, 'Listo': 3 };
            const ordenA = ordenEstados[a.estado] || 4;
            const ordenB = ordenEstados[b.estado] || 4;

            if (ordenA !== ordenB) return ordenA - ordenB;

            return new Date(a.fecha) - new Date(b.fecha);
        });

        data.data.forEach(pedido => {
            contenedor.appendChild(crearTarjetaPedido(pedido));
        });

    } catch (error) {
        console.error('Error al cargar comandas:', error);
    }
}

/**
 * Crea una tarjeta HTML para un pedido
 */
function crearTarjetaPedido(pedido) {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.dataset.estado = pedido.estado;

    const productos = pedido.nombres_productos
        ? [...new Set(pedido.nombres_productos.split(',').map(p => p.trim()))]
        : [];

    card.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                <h5 class="mb-0">Pedido #${pedido.idPedido}</h5>
                <small class="text-muted">Mesa: ${pedido.idMesa || 'N/A'}</small>
            </div>
            <span class="badge ${ESTADOS[pedido.estado]?.clase || 'bg-secondary'}">
                ${ESTADOS[pedido.estado]?.texto || pedido.estado}
            </span>
        </div>
        <div class="card-body">
            <h6>Productos:</h6>
            <ul class="mb-3">
                ${productos.map(p => `<li>${p}</li>`).join('')}
            </ul>
            ${pedido.comentarios ? `<p class="mb-2"><strong>Notas:</strong> ${pedido.comentarios}</p>` : ''}
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">${new Date(pedido.fecha).toLocaleString()}</small>
                <div class="estado-container" data-pedido="${pedido.idPedido}">
                    ${crearSelectEstado(pedido.idPedido, pedido.estado)}
                </div>
            </div>
        </div>
    `;

    return card;
}

/**
 * Crea el selector de estados para un pedido
 */
function crearSelectEstado(idPedido, estadoActual) {
    if (!TRANSICIONES[estadoActual]?.length) {
        return `<div class="form-control">${ESTADOS[estadoActual]?.texto || estadoActual}</div>`;
    }

    let opcionesHTML = '<option value="" selected disabled>Cambiar estado...</option>';

    TRANSICIONES[estadoActual].forEach(estado => {
        opcionesHTML += `<option value="${estado}">${ESTADOS[estado]?.texto || estado}</option>`;
    });

    return `
        <select class="form-select" 
                onchange="actualizarEstadoPedido('${idPedido}', '${estadoActual}', this.value)"
                data-pedido="${idPedido}">
            ${opcionesHTML}
        </select>
    `;
}

/**
 * Actualiza el estado de un pedido
 */
async function actualizarEstadoPedido(idPedido, estadoActual, nuevoEstado) {

    if (!idPedido || !nuevoEstado) {
        console.error('Faltan parámetros requeridos');
        return;
    }

    if (estadoActual === nuevoEstado) {
        console.warn('El pedido ya está en el estado solicitado');
        return;
    }

    const mensaje = `¿Cambiar estado del pedido #${idPedido} a "${ESTADOS[nuevoEstado]?.texto || nuevoEstado}"?`;
    const confirmado = await mostrarConfirmacion(mensaje);
    if (!confirmado) {
        const select = document.querySelector(`.estado-container[data-pedido="${idPedido}"] select`);
        if (select) select.value = '';
        return;
    }

    try {
        const formData = new FormData();
        formData.append('idPedido', idPedido);
        formData.append('nuevoEstado', nuevoEstado);

        const response = await fetch('../BackEnd/cambiarEstado.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            cargarComandas();
        } else {
            throw new Error(data.message || 'Error al actualizar el estado');
        }

    } catch (error) {
        console.error('Error al actualizar estado:', error);


        if (contenedor) {
            contenedor.innerHTML = crearSelectEstado(idPedido, estadoActual);
        }
    }
}


/**
 * Muestra un diálogo de confirmación
 */
function mostrarConfirmacion(mensaje) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal-dialog';

        modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar acción</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p>${mensaje}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="confirmarNo">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="confirmarSi">Aceptar</button>
                    </div>
                </div>
        `;

        document.body.appendChild(modal);
        console.log(modal)

        modal.querySelector('#confirmarSi').addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(true);
        });

        modal.querySelector('#confirmarNo').addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(false);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                resolve(false);
            }
        });

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleKeyDown);
                resolve(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
    });
}

function sendReload() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'reload' }));
    }
}
