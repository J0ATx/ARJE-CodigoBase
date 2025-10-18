const tabla = document.getElementById('reservasTable');
const searchInput = document.getElementById('searchInput');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
const estadoFiltro = document.getElementById('estadoFiltro');
const btnCrearReserva = document.getElementById('btnCrearReserva');

document.addEventListener('DOMContentLoaded', () => {
    fetchReservas();

    // Agregar event listeners a los checkboxes de filtro
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Event listener para filtro de estado
    if (estadoFiltro) {
        estadoFiltro.addEventListener('change', () => {
            fetchReservas();
        });
    }

    // Event listener para botón crear reserva
    if (btnCrearReserva) {
        btnCrearReserva.addEventListener('click', abrirModalCrearReserva);
    }

    // Event listener para radio buttons de asignación en modal crear
    const radiosTipoAsignacion = document.querySelectorAll('input[name="tipoAsignacion"]');
    radiosTipoAsignacion.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const mesaContainer = document.getElementById('crear_mesa_container');
            const mesaInput = document.getElementById('crear_mesa_id');
            if (e.target.value === 'manual') {
                mesaContainer.style.display = 'block';
                mesaInput.required = true;
            } else {
                mesaContainer.style.display = 'none';
                mesaInput.required = false;
                mesaInput.value = '';
            }
        });
    });
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
    // Deseleccionar otros checkboxes cuando uno se selecciona
    filterCheckboxes.forEach(checkbox => {
        if (checkbox !== this) {
            checkbox.checked = false;
        }
    });

    // Hacer fetch con el nuevo orden
    fetchReservas();
}

function fetchReservas() {
    const search = searchInput ? searchInput.value : '';
    const estado = estadoFiltro ? estadoFiltro.value : '';

    // Obtener el orden seleccionado
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
    if (estado) {
        formData.append('estado', estado);
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

        // Limpiar tabla excepto el encabezado
        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }

        // Agregar nuevas filas
        data.forEach(reserva => {
            const fila = tabla.insertRow();
            
            // Determinar clase de estado
            const estadoClass = reserva.reserva_estado === 'Pendiente' ? 'estado-pendiente' : 'estado-confirmada';
            const mesaDisplay = reserva.mesa_id || '<span style="color: #999;">Sin asignar</span>';
            
            // Construir opciones del menú según el estado
            let opcionesMenu = '';
            
            if (reserva.reserva_estado === 'Pendiente') {
                opcionesMenu += `
                    <div class="opcion confirmar" onclick="abrirModalConfirmarReserva(${reserva.reserva_id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                        </svg>
                        Confirmar
                    </div>
                `;
            }
            
            opcionesMenu += `
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
                    ${reserva.reserva_estado === 'Pendiente' ? 'Rechazar' : 'Eliminar'}
                </div>
            `;
            
            // Mostrar comentario si existe
            const comentarioInfo = reserva.reserva_comentario 
                ? `<br><small style="color: #666;">${reserva.reserva_comentario}</small>` 
                : '';
            
            fila.innerHTML = `
                <td><span class="badge ${estadoClass}">${reserva.reserva_estado}</span></td>
                <td>${reserva.cliente_id || 'N/A'}${comentarioInfo}</td>
                <td>${mesaDisplay}</td>
                <td>${reserva.reserva_fecha + ' ' + reserva.reserva_inicio|| 'N/A'}</td>
                <td>${reserva.reserva_cantidad_personas || 'N/A'}</td>
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
            abrirModalEditarReserva();
        });
}

function abrirModalEditarReserva() {
    document.getElementById('modalEditarReserva').style.display = 'flex';
}

function cerrarModalEditarReserva() {
    document.getElementById('modalEditarReserva').style.display = 'none';
}

// Funciones para modal crear reserva
function abrirModalCrearReserva() {
    document.getElementById('modalCrearReserva').style.display = 'flex';
}

function cerrarModalCrearReserva() {
    document.getElementById('modalCrearReserva').style.display = 'none';
    document.getElementById('formCrearReserva').reset();
    document.getElementById('crear_mesa_container').style.display = 'none';
}

// Funciones para modal confirmar reserva
function abrirModalConfirmarReserva(idReserva) {
    fetch('../BackEnd/visualizar.php')
        .then(response => response.json())
        .then(data => {
            const reserva = data.find(r => r.reserva_id == idReserva);
            if (!reserva) return alert('Reserva no encontrada');
            
            document.getElementById('confirmar_idReserva').value = reserva.reserva_id;
            
            let infoHTML = `
                <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p><strong>Cliente:</strong> ${reserva.cliente_id}</p>
                    <p><strong>Fecha:</strong> ${reserva.reserva_fecha} ${reserva.reserva_inicio}</p>
                    <p><strong>Personas:</strong> ${reserva.reserva_cantidad_personas}</p>
                    <p><strong>Duración:</strong> ${reserva.reserva_duracion} horas</p>
            `;
            
            if (reserva.reserva_comentario) {
                infoHTML += `<p><strong>Comentario:</strong> ${reserva.reserva_comentario}</p>`;
            }
            
            infoHTML += `</div>`;
            
            document.getElementById('confirmarReservaInfo').innerHTML = infoHTML;
            
            // Si ya tiene mesa asignada, pre-llenar el campo
            const mesaContainer = document.getElementById('confirmar_mesa_container');
            const mesaInput = document.getElementById('confirmar_mesa_id');
            
            if (reserva.mesa_id) {
                mesaInput.value = reserva.mesa_id;
                mesaInput.required = false;
                mesaContainer.querySelector('small').textContent = 'Mesa ya asignada. Puedes cambiarla si lo deseas.';
            } else {
                mesaInput.value = '';
                mesaInput.required = true;
                mesaContainer.querySelector('small').textContent = 'Ingresa el ID de la mesa a asignar';
            }
            
            document.getElementById('modalConfirmarReserva').style.display = 'flex';
        });
}

function cerrarModalConfirmarReserva() {
    document.getElementById('modalConfirmarReserva').style.display = 'none';
    document.getElementById('formConfirmarReserva').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    // Form crear reserva
    const formCrear = document.getElementById('formCrearReserva');
    const fechaInput = document.getElementById('crear_fecha');
    const minDate = new Date().toISOString().split("T")[0];
    fechaInput.setAttribute('min', minDate);
    if (formCrear) {
        formCrear.onsubmit = function(e) {
            e.preventDefault();
            const datos = new FormData(formCrear);
            fetch('../BackEnd/crear.php', {
                method: 'POST',
                body: datos
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    alert('Error: ' + data.error);
                } else {
                    alert(data.message || 'Reserva creada exitosamente');
                    cerrarModalCrearReserva();
                    fetchReservas();
                }
            })
            .catch(error => {
                alert('Error al crear la reserva');
                console.error(error);
            });
        };
    }

    // Form confirmar reserva
    const formConfirmar = document.getElementById('formConfirmarReserva');
    if (formConfirmar) {
        formConfirmar.onsubmit = function(e) {
            e.preventDefault();
            const datos = new FormData(formConfirmar);
            datos.append('idReserva', document.getElementById('confirmar_idReserva').value);
            
            fetch('../BackEnd/confirmar.php', {
                method: 'POST',
                body: datos
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Error: ' + data.error);
                } else {
                    alert(data.message || 'Reserva confirmada exitosamente');
                    cerrarModalConfirmarReserva();
                    fetchReservas();
                }
            })
            .catch(error => {
                alert('Error al confirmar la reserva');
                console.error(error);
            });
        };
    }

    // Form editar reserva
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
