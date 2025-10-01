const tabla = document.getElementById('reservasTable');

document.addEventListener('DOMContentLoaded', () => {
    fetchReservas();
});

function fetchReservas() {
    // Clear existing rows except the header
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }
    
    fetch('../BackEnd/visualizar.php')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data.forEach(reserva => {
                const row = tabla.insertRow();
                row.insertCell(0).innerText = reserva.cliente_id + ' ' + reserva.apellido;
                row.insertCell(1).innerText = reserva.mesa_id;
                row.insertCell(2).innerText = reserva.reserva_fecha + ' ' + reserva.reserva_inicio;
                row.insertCell(3).innerText = reserva.reserva_cantidad_personas;
                const actionsCell = row.insertCell(4);
                
                // Create actions container
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'acciones';
                
                // Create button to toggle menu
                const menuButton = document.createElement('button');
                menuButton.className = 'btn-menu';
                menuButton.innerHTML = '<i class="bx bx-dots-vertical-rounded"></i>';
                menuButton.onclick = () => toggleMenu(menuButton);
                
                // Create menu options
                const menuDiv = document.createElement('div');
                menuDiv.className = 'menu-opciones';
                
                // Edit option
                const editOption = document.createElement('button');
                editOption.className = 'opcion';
                editOption.innerHTML = '<i class="bx bx-edit"></i> Editar';
                editOption.onclick = () => editarReserva(reserva.reserva_id);
                
                // Delete option
                const deleteOption = document.createElement('button');
                deleteOption.className = 'opcion eliminar';
                deleteOption.innerHTML = '<i class="bx bx-trash"></i> Eliminar';
                deleteOption.onclick = () => eliminarReserva(reserva.reserva_id);
                
                // Add options to menu
                menuDiv.appendChild(editOption);
                menuDiv.appendChild(deleteOption);
                
                // Add menu button and menu to actions container
                actionsDiv.appendChild(menuButton);
                actionsDiv.appendChild(menuDiv);
                
                // Add actions container to cell
                actionsCell.appendChild(actionsDiv);
            });
        })
        .catch(error => {
            return console.error('Error fetching reservas:', error);
        });
};

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
};

function editarReserva(idReserva) {
    fetch('../BackEnd/visualizar.php')
        .then(response => response.json())
        .then(data => {
            const reserva = data.find(r => r.reserva_id == idReserva);
            if (!reserva) return alert('Reserva no encontrada');
            document.getElementById('edit_idReserva').value = reserva.reserva_id;
            document.getElementById('edit_reserva_cantidad_personas').value = reserva.reserva_cantidad_personas;
            document.getElementById('edit_reserva_duracion').value = reserva.reserva_duracion;
            let fecha = reserva.reserva_fecha;
            if (fecha && fecha.length > 16) fecha = fecha.substring(0, 16);
            document.getElementById('edit_reserva_fecha').value = fecha.replace(' ', 'T');
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