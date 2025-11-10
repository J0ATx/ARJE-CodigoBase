document.addEventListener('DOMContentLoaded', () => {
    cargarMesas();
    document.getElementById('addMesaBtn').addEventListener('click', () => {
        document.getElementById('formMesa').reset();
        document.getElementById('modalCrear').style.display = 'flex';
    });
    document.getElementById('formMesa').addEventListener('submit', async function (e) {
        e.preventDefault();
        await crearMesa();
    });
});

let confirmacionCallback = null;

window.cerrarModalNotificacion = function() {
    document.getElementById('modalNotificacion').classList.remove('active');
    document.getElementById('modalNotificacion').style.display = 'none';
}

window.cancelarConfirmacion = function() {
    document.getElementById('modalConfirmacion').classList.remove('active');
    document.getElementById('modalConfirmacion').style.display = 'none';
    confirmacionCallback = null;
}

window.confirmarAccion = function() {
    if (confirmacionCallback) {
        confirmacionCallback();
        confirmacionCallback = null;
    }
    cancelarConfirmacion();
}

function mostrarNotificacion(tipo, titulo, mensaje) {
    const iconContainer = document.getElementById('notificationIcon');
    const titleElement = document.getElementById('notificationTitle');
    const messageElement = document.getElementById('notificationMessage');

    iconContainer.className = 'notification-icon';
    iconContainer.classList.add(tipo);

    const svgs = {
        success: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>',
        error: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>',
        warning: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>'
    };

    iconContainer.innerHTML = svgs[tipo] || svgs.success;
    titleElement.textContent = titulo;
    messageElement.textContent = mensaje;

    const modal = document.getElementById('modalNotificacion');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function mostrarConfirmacion(titulo, mensaje, callback) {
    document.getElementById('confirmacionTitle').textContent = titulo;
    document.getElementById('confirmacionMessage').textContent = mensaje;
    confirmacionCallback = callback;
    
    const btnConfirmar = document.getElementById('btnConfirmar');
    btnConfirmar.onclick = confirmarAccion;
    
    const modal = document.getElementById('modalConfirmacion');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

window.addEventListener('click', function(e) {
    const modalNotificacion = document.getElementById('modalNotificacion');
    const modalConfirmacion = document.getElementById('modalConfirmacion');
    
    if (e.target === modalNotificacion) cerrarModalNotificacion();
    if (e.target === modalConfirmacion) cancelarConfirmacion();
});
window.cerrarModalCrear = function () {
    document.getElementById('modalCrear').style.display = 'none';
};
async function cargarMesas() {
    const tabla = document.getElementById('tablaMesas');
    tabla.innerHTML = '';
    const res = await fetch('../BackEnd/Visualizar.php');
    const data = await res.json();
    data.forEach(m => {
        let reservasHtml = '';
        if (Array.isArray(m.reservas) && m.reservas.length > 0) {
            const options = m.reservas.map(r => {
                const fecha = r.fecha || '';
                const hora = r.hora || '';
                const email = r.email || '';
                const label = `${fecha} ${hora} - ${email}`;
                return `<option value="${r.reserva_id}">${label}</option>`;
            }).join('');
            reservasHtml = `<select>${options}</select>`;
        }
        tabla.innerHTML += `
        <tr>
            <td>${m.idMesa}</td>
            <td>${m.capacidad}</td>
            <td>${m.estadoActual}</td>
            <td><span class="badge ${m.reservable === 'Si' ? 'reservable-si' : 'reservable-no'}">${m.reservable}</span></td>
            <td>${m.tiempoUso || ''}</td>
            <td>${reservasHtml}</td>
            <td class="acciones">
                <button class="btn-menu" onclick="toggleMenu(this)">⋮</button>
                <div class="menu-opciones">
                    <div class="opcion" onclick="verDetallesMesa(${m.idMesa})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                        </svg>
                        Ver Detalles
                    </div>
                    <div class="opcion" onclick="editarMesa(${m.idMesa}, ${m.capacidad}, '${m.estadoActual}', '${m.reservable}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                        Editar
                    </div>
                    <div class="opcion eliminar" onclick="eliminarMesa(${m.idMesa})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                        Eliminar
                    </div>
                </div>
            </td>
        </tr>
        `;
    });
}
window.editarMesa = function (idMesa, capacidad, estadoActual, reservable) {
    document.getElementById('edit_idMesa').value = idMesa;
    document.getElementById('edit_capacidad').value = capacidad;
    document.getElementById('edit_estadoActual').value = estadoActual;
    document.getElementById('edit_reservable').value = reservable;
    document.getElementById('modalEditar').style.display = 'flex';
};
window.cerrarModalEditar = function () {
    document.getElementById('modalEditar').style.display = 'none';
};
async function guardarCambiosMesa() {
    const idMesa = document.getElementById('edit_idMesa').value;
    const capacidad = document.getElementById('edit_capacidad').value;
    const estadoActual = document.getElementById('edit_estadoActual').value;
    const reservable = document.getElementById('edit_reservable').value;
    const res = await fetch('../BackEnd/Modificar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idMesa, capacidad, estadoActual, reservable })
    });
    if (res.ok) {
        cargarMesas();
        cerrarModalEditar();
        mostrarNotificacion('success', '¡Éxito!', 'La mesa se ha actualizado correctamente.');
    } else {
        const error = await res.json();
        mostrarNotificacion('error', 'Error', error.error || "Error al editar mesa");
    }
}
async function crearMesa() {
    const capacidad = document.getElementById('capacidad').value;
    const estadoActual = document.getElementById('estadoActual').value;
    const reservable = document.getElementById('reservable').value;
    const res = await fetch('../BackEnd/Crear.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacidad, estadoActual, reservable })
    });
    if (res.ok) {
        cargarMesas();
        document.getElementById('formMesa').reset();
        document.getElementById('modalCrear').style.display = 'none';
        mostrarNotificacion('success', '¡Éxito!', 'La mesa se ha creado correctamente.');
    } else {
        const error = await res.json();
        mostrarNotificacion('error', 'Error', error.error || "Error al crear mesa");
    }
}
async function eliminarMesa(idMesa) {
    mostrarConfirmacion(
        'Eliminar Mesa',
        '¿Seguro que deseas eliminar esta mesa?',
        async function() {
            const res = await fetch('../BackEnd/Eliminar.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idMesa })
            });
            if (res.ok) {
                cargarMesas();
                mostrarNotificacion('success', '¡Éxito!', 'La mesa se ha eliminado correctamente.');
            } else {
                const error = await res.json();
                mostrarNotificacion('error', 'Error', error.error || "Error al eliminar mesa");
            }
        }
    );
}
function toggleMenu(btn) {
    document.querySelectorAll('.menu-opciones').forEach(menu => {
        if (menu !== btn.nextElementSibling) menu.style.display = 'none';
    });
    const menu = btn.nextElementSibling;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}
document.addEventListener('click', function (e) {
    if (!e.target.closest('.acciones')) {
        document.querySelectorAll('.menu-opciones').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});
async function verDetallesMesa(idMesa) {
    try {
        const response = await fetch('../BackEnd/Visualizar.php');
        const data = await response.json();
        const mesa = data.find(m => m.idMesa == idMesa);
        if (!mesa) {
            mostrarNotificacion('error', 'Error', 'Mesa no encontrada');
            return;
        }
        function getEstadoColor(estado) {
            switch(estado) {
                case 'Disponible': return '#28a745';
                case 'Ocupada': return '#dc3545';
                case 'Reservada': return '#ffc107';
                case 'Mantenimiento': return '#6c757d';
                default: return '#6c757d';
            }
        }
        const detailsModal = document.createElement('div');
        detailsModal.className = 'modal';
        detailsModal.id = 'detailsModal';
        detailsModal.style.display = 'flex';
        const content = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Detalles de la Mesa</h2>
                <div class="reservation-details">
                    <div class="detail-section">
                        <h3>Información General</h3>
                        <p><strong>Número de Mesa:</strong> #${mesa.idMesa}</p>
                        <p><strong>Capacidad:</strong> ${mesa.capacidad} persona(s)</p>
                        <p><strong>Ubicación:</strong> ${mesa.ubicacion || 'No especificada'}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Estado</h3>
                        <p><strong>Estado actual:</strong> 
                            <span style="background-color: ${getEstadoColor(mesa.estadoActual)}; color: white; padding: 6px 12px; border-radius: 4px; font-weight: 600; display: inline-block; margin-top: 5px;">
                                ${mesa.estadoActual}
                            </span>
                        </p>
                        <p><strong>Reservable:</strong> ${mesa.reservable === 'Si' ? 'Sí' : 'No'}</p>
                    </div>
                    ${mesa.descripcion ? `
                    <div class="detail-section">
                        <h3>Descripción</h3>
                        <p>${mesa.descripcion}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        detailsModal.innerHTML = content;
        document.body.appendChild(detailsModal);
        const closeBtn = detailsModal.querySelector('.close');
        closeBtn.onclick = function () {
            detailsModal.remove();
        }
        window.onclick = function (event) {
            if (event.target == detailsModal) {
                detailsModal.remove();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('error', 'Error', 'Error al cargar detalles de la mesa');
    }
}