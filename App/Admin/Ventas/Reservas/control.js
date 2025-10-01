const tabla = document.getElementById('reservasTable');
const searchInput = document.getElementById('searchInput');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');

document.addEventListener('DOMContentLoaded', () => {
    fetchReservas();

    // Agregar event listeners a los checkboxes de filtro
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
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
            fila.innerHTML = `
                <td>${reserva.cliente_id || 'N/A'}</td>
                <td>${reserva.mesa_id || 'N/A'}</td>
                <td>${reserva.reserva_fecha + ' ' + reserva.reserva_inicio|| 'N/A'}</td>
                <td>${reserva.reserva_cantidad_personas || 'N/A'}</td>
                <td class="acciones">
                    <button class="btn-menu" onclick="editarReserva(${reserva.reserva_id})">⋮</button>
                    <div class="menu-opciones">
                        <div class="opcion" onclick="editarReserva(${reserva.reserva_id})">Editar</div>
                        <div class="opcion eliminar" onclick="eliminarReserva(${reserva.reserva_id})">Eliminar</div>
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
                cerrarModalEditarReserva();
                fetchReservas();
            })
            .catch(error => {
                alert('Error al modificar la reserva');
            });
        };
    }
});
