let usuarioActual = null;

document.addEventListener('DOMContentLoaded', function () {
    fetch('../BackEnd/checkSession.php')
        .then(response => response.json())
        .then(data => {
            console.log(data.user);
            usuarioActual = data.user;
            mostrarDatosUsuario(data.user);
        });

    // Modal logic
    document.getElementById('btnModificar').addEventListener('click', function () {
        if (!usuarioActual) return;
        document.getElementById('editId').value = usuarioActual.id || '';
        document.getElementById('editNombre').value = usuarioActual.nombre || '';
        document.getElementById('editApellido').value = usuarioActual.apellido || '';
        document.getElementById('editTelefono').value = usuarioActual.telefono || '';
        document.getElementById('editPlatillofav').value = usuarioActual.platillofav || '';
        document.getElementById('editContrasenia').value = '';
        document.getElementById('msgEditar').innerText = '';
        document.getElementById('modalEditar').style.display = 'block';
    });

    document.getElementById('cerrarModal').onclick = function () {
        document.getElementById('modalEditar').style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == document.getElementById('modalEditar')) {
            document.getElementById('modalEditar').style.display = 'none';
        }
    };

    document.getElementById('formEditar').addEventListener('submit', function (e) {
        e.preventDefault();
        const datos = {
            id: document.getElementById('editId').value,
            nombre: document.getElementById('editNombre').value,
            apellido: document.getElementById('editApellido').value,
            telefono: document.getElementById('editTelefono').value,
            platillofav: document.getElementById('editPlatillofav').value,
            contrasenia: document.getElementById('editContrasenia').value
        };
        fetch('../BackEnd/modificar.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(resp => {
            if (resp.success) {
                document.getElementById('msgEditar').innerText = 'Datos actualizados correctamente.';
                // Actualizar datos en pantalla
                usuarioActual.id = datos.id;
                usuarioActual.nombre = datos.nombre;
                usuarioActual.apellido = datos.apellido;
                usuarioActual.telefono = datos.telefono;
                usuarioActual.platillofav = datos.platillofav;
                mostrarDatosUsuario(usuarioActual);
                setTimeout(() => {
                    document.getElementById('modalEditar').style.display = 'none';
                }, 1000);
            } else {
                document.getElementById('msgEditar').innerText = resp.error || 'Error al actualizar.';
                document.getElementById('msgEditar').style.color = 'red';
            }
        })
        .catch(() => {
            document.getElementById('msgEditar').innerText = 'Error de conexión.';
            document.getElementById('msgEditar').style.color = 'red';
        });
    });
});

function mostrarDatosUsuario(usuario) {
    const fidelizado = usuario.cliente_fidelizado ? 'Sí' : 'No';
    document.getElementById('datosUsuario').innerHTML = `
        <ul>
            <li>Gmail: ${usuario.id}</li>
            <li>Nombre: ${usuario.nombre}</li>
            <li>Apellido: ${usuario.apellido}</li>
            <li>Teléfono: ${usuario.telefono}</li>
            <li>Calificación: 0</li>
            <li>Platillo Favorito: ${usuario.platillofav}</li>
            <li>Rol: ${usuario.rol}</li>
            <li>Fidelizado: ${fidelizado}</li>
        </ul>
    `;
}