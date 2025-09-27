document.addEventListener('DOMContentLoaded', () => {
    cargarMesas();

    document.getElementById('formMesa').addEventListener('submit', async function (e) {
        e.preventDefault();
        await crearMesa();
    });

});

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
            <td>${m.ubicacion}</td>
            <td>${m.tiempoUso || ''}</td>
            <td>${reservasHtml}</td>
            <td>
                <button onclick="editarMesa(${m.idMesa}, ${m.capacidad}, '${m.estadoActual}', '${m.ubicacion}')">Editar</button>
                <button onclick="eliminarMesa(${m.idMesa})">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

window.editarMesa = function (idMesa, capacidad, estadoActual, ubicacion) {
    document.getElementById('edit_idMesa').value = idMesa;
    document.getElementById('edit_capacidad').value = capacidad;
    document.getElementById('edit_estadoActual').value = estadoActual;
    document.getElementById('edit_ubicacion').value = ubicacion;
    document.getElementById('modalEditar').style.display = 'flex';
};

window.cerrarModalEditar = function () {
    document.getElementById('modalEditar').style.display = 'none';
};

async function guardarCambiosMesa() {
    const idMesa = document.getElementById('edit_idMesa').value;
    const capacidad = document.getElementById('edit_capacidad').value;
    const estadoActual = document.getElementById('edit_estadoActual').value;
    const ubicacion = document.getElementById('edit_ubicacion').value;

    const res = await fetch('../BackEnd/Modificar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idMesa, capacidad, estadoActual, ubicacion })
    });
    if (res.ok) {
        cargarMesas();
        cerrarModalEditar();
    } else {
        const error = await res.json();
        alert(error.error || "Error al editar mesa");
    }
}

async function crearMesa() {
    const capacidad = document.getElementById('capacidad').value;
    const estadoActual = document.getElementById('estadoActual').value;
    const ubicacion = document.getElementById('ubicacion').value;

    const res = await fetch('../BackEnd/Crear.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacidad, estadoActual, ubicacion })
    });
    if (res.ok) {
        cargarMesas();
        document.getElementById('formMesa').reset();
    } else {
        const error = await res.json();
        alert(error.error || "Error al crear mesa");
    }
}

async function eliminarMesa(idMesa) {
    if (!confirm('¿Seguro que deseas eliminar esta mesa?')) return;

    const res = await fetch('../BackEnd/Eliminar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idMesa })
    });
    if (res.ok) {
        cargarMesas();
    } else {
        const error = await res.json();
        alert(error.error || "Error al eliminar mesa");
    }
}