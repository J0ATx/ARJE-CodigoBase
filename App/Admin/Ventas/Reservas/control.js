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
            data.forEach(reserva => {
                const row = tabla.insertRow();
                row.insertCell(0).innerText = reserva.nombre;
                row.insertCell(1).innerText = reserva.idMesa;
                row.insertCell(2).innerText = reserva.fecha;
                row.insertCell(3).innerText = reserva.horaInicio;
                // Create actions cell with dropdown menu
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
                // editOption.onclick = () => editarReserva(reserva.id);
                
                // Delete option
                const deleteOption = document.createElement('button');
                deleteOption.className = 'opcion eliminar';
                deleteOption.innerHTML = '<i class="bx bx-trash"></i> Eliminar';
                deleteOption.onclick = () => eliminarReserva(reserva.idPedido);
                
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
    .then(response => response.text())
    .then(data => {
        fetchReservas();
        console.log(data);
    }).catch(error => {
        console.error('Error:', error);
    });
};