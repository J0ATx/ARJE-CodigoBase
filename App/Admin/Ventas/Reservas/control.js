const tabla = document.getElementById('reservasTable');
const searchInput = document.getElementById('searchInput');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
const modalNuevaReserva = document.getElementById('modalNuevaReserva');
const formNuevaReserva = document.getElementById('formNuevaReserva');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    fetchReservas();

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Inicializar el formulario de nueva reserva
    const today = new Date().toISOString().split('T')[0];
    const fechaInput = document.getElementById('reserva_fecha');
    if (fechaInput) {
        fechaInput.min = today;
        fechaInput.value = today;
    }
    
    // Establecer hora actual + 1 hora redondeada
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    const horaInput = document.getElementById('reserva_inicio');
    if (horaInput) {
        horaInput.value = now.toTimeString().substring(0, 5);
    }
    
    // Inicializar el modal de nueva reserva
    if (modalNuevaReserva) {
        // Cerrar modal al hacer clic fuera del contenido
        window.onclick = function(event) {
            if (event.target === modalNuevaReserva) {
                cerrarModalNuevaReserva();
            }
        }
    }
    
    // Agregar evento al botón de nueva reserva
    const btnNuevaReserva = document.getElementById('btnNuevaReserva');
    if (btnNuevaReserva) {
        btnNuevaReserva.addEventListener('click', abrirModalNuevaReserva);
    }
    
    // Manejar el envío del formulario de nueva reserva
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
            
            let opcionesMenu = `
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
    const datos = new FormData();
    datos.append('idReserva', idReserva);
    fetch('../BackEnd/eliminar.php', {
        method: 'POST',
        body: datos
    })
    .then(response => response.json())
    .then(data => {
        fetchReservas();
    }).catch(error => {
        console.error('Error:', error);
    });
}

function editarReserva(idReserva) {
    fetch('../BackEnd/visualizar.php')
        .then(response => response.json())
        .then(data => {
            const reserva = data.find(r => r.reserva_id == idReserva);
            if (!reserva) return alert('Reserva no encontrada');
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

// Funciones para el modal de nueva reserva
function abrirModalNuevaReserva() {
    if (modalNuevaReserva) {
        modalNuevaReserva.style.display = 'flex';
        // Enfocar el primer campo
        const clienteInput = document.getElementById('cliente_id');
        if (clienteInput) clienteInput.focus();
    }
}

function cerrarModalNuevaReserva() {
    if (modalNuevaReserva) {
        modalNuevaReserva.style.display = 'none';
        // Limpiar el formulario
        if (formNuevaReserva) {
            formNuevaReserva.reset();
            // Restablecer valores por defecto
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
    
    // Mostrar indicador de carga
    const submitBtn = formNuevaReserva.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Creando...';
    
    // Mostrar mensaje de carga
    let loadingMessage = formNuevaReserva.querySelector('.loading-message');
    if (!loadingMessage) {
        loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';
        formNuevaReserva.appendChild(loadingMessage);
    }
    loadingMessage.textContent = 'Procesando la reserva...';
    loadingMessage.style.display = 'block';
    
    // Obtener los datos del formulario
    const formData = new FormData(formNuevaReserva);
    
    // Enviar la solicitud al servidor
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
        
        // Mostrar mensaje de éxito
        alert('Reserva creada exitosamente con ID: ' + data.reserva_id);
        
        // Cerrar el modal y actualizar la tabla
        cerrarModalNuevaReserva();
        fetchReservas();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al crear la reserva: ' + (error.message || 'Error desconocido'));
    })
    .finally(() => {
        // Restaurar el botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Ocultar mensaje de carga
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
                    alert('Error: ' + data.error);
                } else {
                    alert(data.message || 'Reserva modificada exitosamente');
                    cerrarModalEditarReserva();
                    fetchReservas();
                }
            })
            .catch(error => {
                alert('Error al modificar la reserva');
            });
        };
    }
});
