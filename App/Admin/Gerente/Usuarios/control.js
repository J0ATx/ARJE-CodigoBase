document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();

    document.getElementById('formUsuario').addEventListener('submit', async function (e) {
        e.preventDefault();
        await crearUsuario();
    });
});

async function cargarUsuarios() {
    const tabla = document.getElementById('tablaUsuarios');
    tabla.innerHTML = '';
    const res = await fetch('../BackEnd/visualizar.php');
    const data = await res.json();
    console.log(data);
    data.forEach(u => {
        //const row = document.createElement('tr');
        tabla.innerHTML += ``
        tabla.innerHTML += `
        <tr>
            <td>${u.idUsuario}</td>
            <td>${u.nombre}</td>
            <td>${u.apellido}</td>
            <td>${u.gmail}</td>
            <td>${u.tipoUsuario}</td>
            <td>
                <button onclick="editarUsuario(${u.idUsuario}, '${u.nombre}', '${u.apellido}', '${u.gmail}', '${u.calificacion || ''}', '${u.numTel || ''}', '${u.tipoUsuario}')">Editar</button>
                <button onclick="eliminarUsuario(${u.idUsuario})">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

window.editarUsuario = function (idUsuario, nombre, apellido, gmail, calificacion, numTel, tipoUsuario) {
    document.getElementById('edit_idUsuario').value = idUsuario;
    document.getElementById('edit_nombre').value = nombre;
    document.getElementById('edit_apellido').value = apellido;
    document.getElementById('edit_gmail').value = gmail;
    document.getElementById('edit_calificacion').value = calificacion;
    document.getElementById('edit_numtel').value = numTel;
    document.getElementById('edit_tipoUsuario').value = tipoUsuario;
    document.getElementById('modalEditar').style.display = 'flex';
};

window.cerrarModalEditar = function () {
    document.getElementById('modalEditar').style.display = 'none';
};

document.getElementById('formEditar').addEventListener('submit', async function (e) {
    e.preventDefault();
    await guardarCambiosUsuario();
});

async function guardarCambiosUsuario() {
    const idUsuario = document.getElementById('edit_idUsuario').value;
    const nombre = document.getElementById('edit_nombre').value;
    const apellido = document.getElementById('edit_apellido').value;
    const gmail = document.getElementById('edit_gmail').value;
    const calificacion = document.getElementById('edit_calificacion').value;
    const numTelRaw = document.getElementById('edit_numtel').value;
    const numTel = numTelRaw === '' ? null : numTelRaw;
    const tipoUsuario = document.getElementById('edit_tipoUsuario').value;

    try {
        const response = await fetch('../BackEnd/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();
        if (data.user.id == idUsuario && data.user.rol !== tipoUsuario) {
            alert('No puedes cambiar el rol tu propia cuenta.');
            return false;
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
    const res = await fetch('../BackEnd/modificar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario, nombre, apellido, gmail, calificacion, numTel, tipoUsuario })
    });
    if (res.ok) {
        cargarUsuarios();
        cerrarModalEditar();
    } else {
        const error = await res.json();
        alert(error.error || "Error al editar usuario");
    }
}

async function crearUsuario() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const gmail = document.getElementById('gmail').value;
    const contrasenia = document.getElementById('contrasenia').value;
    const tipoUsuario = document.getElementById('tipoUsuario').value;

    const res = await fetch('../BackEnd/crear.php', {
        method: 'POST',
        body: JSON.stringify({ nombre, apellido, gmail, contrasenia, tipoUsuario })
    });
    if (res.ok) {
        cargarUsuarios();
        document.getElementById('formUsuario').reset();
    } else {
        const error = await res.json();
        alert(error.error || "Error al crear usuario");
    }
}

async function eliminarUsuario(idUsuario) {
    try {
        const response = await fetch('../BackEnd/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();
        if (data.user.id === idUsuario) {
            alert('No puedes eliminar tu propia cuenta.');
            return false;
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }

    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    const res = await fetch('../BackEnd/eliminar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario })
    });
    if (res.ok) {
        cargarUsuarios();
    } else {
        const error = await res.json();
        alert(error.error || "Error al eliminar usuario");
    }
}