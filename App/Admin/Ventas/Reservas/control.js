const tabla = document.getElementById('reservasTable');
const searchInput = document.getElementById('searchInput');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
const modalNuevaReserva = document.getElementById('modalNuevaReserva');
const formNuevaReserva = document.getElementById('formNuevaReserva');
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
document.addEventListener('DOMContentLoaded', () => {
    const btnNuevaReserva = document.getElementById('btnNuevaReserva');
    
    if (typeof window.canWriteReservas !== 'undefined' && !window.canWriteReservas) {
        if (btnNuevaReserva) btnNuevaReserva.style.display = 'none';
    }
    
    fetchReservas();
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
    const today = new Date().toISOString().split('T')[0];
    const fechaInput = document.getElementById('reserva_fecha');
    if (fechaInput) {
        fechaInput.min = today;
        fechaInput.value = today;
    }
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    const horaInput = document.getElementById('reserva_inicio');
    if (horaInput) {
        horaInput.value = now.toTimeString().substring(0, 5);
    }
    if (modalNuevaReserva) {
        window.onclick = function(event) {
            if (event.target === modalNuevaReserva) {
                cerrarModalNuevaReserva();
            }
        }
    }
    if (btnNuevaReserva) {
        btnNuevaReserva.addEventListener('click', abrirModalNuevaReserva);
    }
    if (formNuevaReserva) {
        formNuevaReserva.addEventListener('submit', handleNuevaReservaSubmit);
    }
});
searchInput.addEventListener('input', debounce(() => {
    fetchReservas();
}, 300));
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
function handleFilterChange() {
    filterCheckboxes.forEach(checkbox => {
        if (checkbox !== this) {
            checkbox.checked = false;
        }
    });
    fetchReservas();
}
function fetchReservas() {
    const search = searchInput ? searchInput.value : '';
    let orden = '';
    filterCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            orden = checkbox.value;
        }
    });
    const formData = new FormData();
    if (search) {
        formData.append('search', search);
    }
    if (orden) {
        formData.append('orden', orden);
    }
    fetch('../BackEnd/visualizar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            return;
        }
        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }
        data.forEach(reserva => {
            const fila = tabla.insertRow();
            const mesaDisplay = reserva.mesa_id || '<span style="color: #999;">Sin asignar</span>';
            function getEstadoInfo(estado) {
                switch(estado) {
                    case 'Pendiente':
                        return { color: '#ffc107', texto: 'Pendiente' };
                    case 'Confirmada':
                        return { color: '#28a745', texto: 'Confirmada' };
                    case 'Finalizada':
                        return { color: '#17a2b8', texto: 'Finalizada' };
                    case 'Cancelada':
                        return { color: '#dc3545', texto: 'Cancelada' };
                    case 'No-Show':
                        return { color: '#6c757d', texto: 'No Show' };
                    default:
                        return { color: '#6c757d', texto: 'Sin estado' };
                }
            }
            const estadoInfo = getEstadoInfo(reserva.reserva_estado);
            const estadoDisplay = `<span style="background-color: ${estadoInfo.color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: 600;">${estadoInfo.texto}</span>`;
            
            const canWrite = window.canWriteReservas !== false;
            
            let opcionesMenu = canWrite ? `
                <div class="opcion" onclick="verDetallesReserva(${reserva.reserva_id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                    </svg>
                    Ver Detalles
                </div>
                <div class="opcion" onclick="editarReserva(${reserva.reserva_id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                    </svg>
                    Editar
                </div>
                <div class="opcion eliminar" onclick="eliminarReserva(${reserva.reserva_id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                    </svg>
                    Eliminar
                </div>
            ` : `
                <div class="opcion" onclick="verDetallesReserva(${reserva.reserva_id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                    </svg>
                    Ver Detalles
                </div>
            `;
            fila.innerHTML = `
                <td>${reserva.cliente_id || 'N/A'}</td>
                <td>${mesaDisplay}</td>
                <td>${reserva.reserva_fecha + ' ' + reserva.reserva_inicio|| 'N/A'}</td>
                <td>${reserva.reserva_cantidad_personas || 'N/A'}</td>
                <td>${estadoDisplay}</td>
                <td class="acciones">
                    <button class="btn-menu" onclick="toggleMenu(this)">⋮</button>
                    <div class="menu-opciones">
                        ${opcionesMenu}
                    </div>
                </td>
            `;
        });
    })
    .catch(error => {
        console.error('Error al obtener reservas:', error);
    });
}
function eliminarReserva(idReserva) {
    mostrarConfirmacion(
        'Eliminar Reserva',
        '¿Estás seguro de que deseas eliminar esta reserva?',
        function() {
            const datos = new FormData();
            datos.append('idReserva', idReserva);
            fetch('../BackEnd/eliminar.php', {
                method: 'POST',
                body: datos
            })
            .then(response => response.json())
            .then(data => {
                fetchReservas();
                mostrarNotificacion('success', '¡Éxito!', 'Reserva eliminada correctamente.');
            }).catch(error => {
                console.error('Error:', error);
                mostrarNotificacion('error', 'Error', 'Error al eliminar la reserva.');
            });
        }
    );
}
function editarReserva(idReserva) {
    fetch('../BackEnd/visualizar.php')
        .then(response => response.json())
        .then(data => {
            const reserva = data.find(r => r.reserva_id == idReserva);
            if (!reserva) {
                mostrarNotificacion('error', 'Error', 'Reserva no encontrada');
                return;
            }
            document.getElementById('edit_idReserva').value = reserva.reserva_id;
            document.getElementById('edit_reserva_cantidad_personas').value = reserva.reserva_cantidad_personas;
            document.getElementById('edit_reserva_duracion').value = reserva.reserva_duracion;
            document.getElementById('edit_reserva_fecha').value = reserva.reserva_fecha;
            document.getElementById('edit_reserva_inicio').value = reserva.reserva_inicio;
            document.getElementById('edit_cliente_id').value = reserva.cliente_id;
            document.getElementById('edit_mesa_id').value = reserva.mesa_id;
            document.getElementById('edit_reserva_estado').value = reserva.reserva_estado || 'Pendiente';
            abrirModalEditarReserva();
        });
}
function abrirModalEditarReserva() {
    document.getElementById('modalEditarReserva').style.display = 'flex';
}
function cerrarModalEditarReserva() {
    document.getElementById('modalEditarReserva').style.display = 'none';
}
function abrirModalNuevaReserva() {
    if (modalNuevaReserva) {
        modalNuevaReserva.style.display = 'flex';
        const clienteInput = document.getElementById('cliente_id');
        if (clienteInput) clienteInput.focus();
    }
}
function cerrarModalNuevaReserva() {
    if (modalNuevaReserva) {
        modalNuevaReserva.style.display = 'none';
        if (formNuevaReserva) {
            formNuevaReserva.reset();
            const today = new Date().toISOString().split('T')[0];
            const now = new Date();
            now.setHours(now.getHours() + 1, 0, 0, 0);
            const fechaInput = document.getElementById('reserva_fecha');
            const horaInput = document.getElementById('reserva_inicio');
            if (fechaInput) fechaInput.value = today;
            if (horaInput) horaInput.value = now.toTimeString().substring(0, 5);
        }
    }
}
function handleNuevaReservaSubmit(e) {
    e.preventDefault();
    if (!formNuevaReserva) return;
    const submitBtn = formNuevaReserva.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Creando...';
    let loadingMessage = formNuevaReserva.querySelector('.loading-message');
    if (!loadingMessage) {
        loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';
        formNuevaReserva.appendChild(loadingMessage);
    }
    loadingMessage.textContent = 'Procesando la reserva...';
    loadingMessage.style.display = 'block';
    const formData = new FormData(formNuevaReserva);
    fetch('../BackEnd/crear.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        mostrarNotificacion('success', '¡Éxito!', 'Reserva creada exitosamente con ID: ' + data.reserva_id);
        cerrarModalNuevaReserva();
        fetchReservas();
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarNotificacion('error', 'Error', 'Error al crear la reserva: ' + (error.message || 'Error desconocido'));
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const formEditar = document.getElementById('formEditarReserva');
    if (formEditar) {
        formEditar.onsubmit = function(e) {
            e.preventDefault();
            const datos = new FormData(formEditar);
            fetch('../BackEnd/modificar.php', {
                method: 'POST',
                body: datos
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    mostrarNotificacion('error', 'Error', 'Error: ' + data.error);
                } else {
                    mostrarNotificacion('success', '¡Éxito!', data.message || 'Reserva modificada exitosamente');
                    cerrarModalEditarReserva();
                    fetchReservas();
                }
            })
            .catch(error => {
                mostrarNotificacion('error', 'Error', 'Error al modificar la reserva');
            });
        };
    }
});
async function verDetallesReserva(reservaId) {
    try {
        const response = await fetch('../BackEnd/visualizar.php', {
            method: 'POST'
        });
        const data = await response.json();
        if (data.error) {
            mostrarNotificacion('error', 'Error', 'Error al cargar detalles: ' + data.error);
            return;
        }
        const reserva = data.find(r => r.reserva_id == reservaId);
        if (!reserva) {
            mostrarNotificacion('error', 'Error', 'Reserva no encontrada');
            return;
        }
        const fechaHora = new Date(reserva.reserva_fecha + ' ' + reserva.reserva_inicio);
        const fechaFormateada = fechaHora.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const horaFormateada = fechaHora.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const fechaFin = new Date(fechaHora);
        fechaFin.setHours(fechaFin.getHours() + parseInt(reserva.reserva_duracion || 2));
        const horaFinFormateada = fechaFin.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        function getEstadoColor(estado) {
            switch(estado) {
                case 'Pendiente': return '#ffc107';
                case 'Confirmada': return '#28a745';
                case 'Finalizada': return '#17a2b8';
                case 'Cancelada': return '#dc3545';
                case 'No-Show': return '#6c757d';
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
                <h2>Detalles de la Reserva</h2>
                <div class="reservation-details">
                    <div class="detail-section">
                        <h3>Información del Cliente</h3>
                        <p><strong>Email:</strong> ${reserva.cliente_id || 'No especificado'}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Detalles de la Reserva</h3>
                        <p><strong>ID de Reserva:</strong> #${reserva.reserva_id}</p>
                        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                        <p><strong>Hora de inicio:</strong> ${horaFormateada}</p>
                        <p><strong>Hora de fin estimada:</strong> ${horaFinFormateada}</p>
                        <p><strong>Duración:</strong> ${reserva.reserva_duracion || 2} hora(s)</p>
                        <p><strong>Cantidad de personas:</strong> ${reserva.reserva_cantidad_personas}</p>
                        <p><strong>Mesa asignada:</strong> ${reserva.mesa_id ? 'Mesa #' + reserva.mesa_id : 'Sin asignar'}</p>
                        <p><strong>Estado:</strong> 
                            <span style="background-color: ${getEstadoColor(reserva.reserva_estado)}; color: white; padding: 6px 12px; border-radius: 4px; font-weight: 600; display: inline-block; margin-top: 5px;">
                                ${reserva.reserva_estado}
                            </span>
                        </p>
                    </div>
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
        mostrarNotificacion('error', 'Error', 'Error al cargar detalles de la reserva');
    }
}