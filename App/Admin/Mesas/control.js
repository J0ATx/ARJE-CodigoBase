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
    } else {
        const error = await res.json();
        alert(error.error || "Error al editar mesa");
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
