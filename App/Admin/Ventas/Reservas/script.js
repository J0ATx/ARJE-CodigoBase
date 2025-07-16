const tabla = document.getElementById('reservasTable');

document.addEventListener('DOMContentLoaded', () => {
    fetchReservas();
});

function fetchReservas() {
    fetch('visualizar.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(reserva => {
                const row = tabla.insertRow();
                row.insertCell(0).innerText = reserva.nombre;
                row.insertCell(1).innerText = reserva.idMesa;
                row.insertCell(2).innerText = reserva.fecha;
                row.insertCell(3).innerText = reserva.horaInicio;
                const editCell = row.insertCell(4);
                const deleteCell = row.insertCell(5);
                const editButton = document.createElement('button');
                editButton.innerText = 'Editar';
                // editButton.onclick = () => editarReserva(reserva.id);
                editCell.appendChild(editButton);
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Eliminar';
                deleteButton.onclick = () => eliminarReserva(reserva.idPedido);
                deleteCell.appendChild(deleteButton);
            });
        })
        .catch(error => {
            return console.error('Error fetching reservas:', error);
        });
};

function eliminarReserva(idReserva) {
    const datos = new FormData();
    datos.append('idReserva', idReserva);

    fetch('eliminar.php', {
        method: 'POST',
        body: datos
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    }).catch(error => {
        console.error('Error:', error);
    });
};