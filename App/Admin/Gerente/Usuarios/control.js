document.addEventListener('DOMContentLoaded', async () => {
    await cargarUsuarios();

    document.getElementById('formUsuario').addEventListener('submit', async function (e) {
        e.preventDefault();
        await crearUsuario();
    });

    document.getElementById('formEditar').addEventListener('submit', async function (e) {
        e.preventDefault();
        await guardarCambiosUsuario();
    });
});

async function cargarUsuarios() {
    const tabla = document.getElementById('tablaUsuarios');
    tabla.innerHTML = '';
    try {
        const res = await fetch('../BackEnd/visualizar.php');
        const data = await res.json();

        if (!data.success) {
            throw new Error(data.error || 'Error al cargar usuarios');
        }

        data.usuarios.forEach(u => {
            tabla.innerHTML += `
            <tr>
                <td>${u.email}</td>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.telefono}</td>
                <td>${u.tipoUsuario}</td>
                <td>
                    <button onclick="editarUsuario('${u.email}', '${u.nombre}', '${u.apellido}', '${u.telefono}', '${u.tipoUsuario}')">Editar</button>
                    <button onclick="eliminarUsuario('${u.email}', '${u.tipoUsuario}')">Eliminar</button>
                </td>
            </tr>
            `;
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar usuarios: ' + error.message);
    }
}

async function crearUsuario() {
    try {
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const contrasenia = document.getElementById('contrasenia').value;
        const tipoUsuario = document.getElementById('tipoUsuario').value;

        if (telefono.length > 8) {
            throw new Error('El teléfono debe tener máximo 8 dígitos');
        }

        const response = await fetch('../BackEnd/crear.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                apellido,
                email,
                telefono,
                contrasenia,
                tipoUsuario
            })
        });

        const data = await response.json();
        if (data.success) {
            alert(data.mensaje || 'Usuario creado correctamente');
            document.getElementById('formUsuario').reset();
            await cargarUsuarios();
        } else {
            throw new Error(data.error || 'Error al crear usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear usuario: ' + error.message);
    }
}

window.editarUsuario = async function (email, nombre, apellido, telefono, tipoUsuario) {
    try {
        document.getElementById('edit_email').value = email;
        document.getElementById('edit_nombre').value = nombre;
        document.getElementById('edit_apellido').value = apellido;
        document.getElementById('edit_telefono').value = telefono;
        document.getElementById('edit_tipoUsuario').value = tipoUsuario;
        document.getElementById('modalEditar').style.display = 'flex';
    } catch (error) {
        console.error('Error al abrir el modal de edición:', error);
        alert('Error al abrir el formulario de edición');
    }
};

window.eliminarUsuario = async function (email, tipoUsuario) {
    try {
        const response = await fetch('../BackEnd/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();
        if (data.user.id === email) {
            alert('No puedes eliminar tu propia cuenta.');
            return false;
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        try {
            const res = await fetch('../BackEnd/eliminar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, tipoUsuario })
            });

            const data = await res.json();
            if (data.success) {
                alert(data.mensaje);
                await cargarUsuarios();
            } else {
                throw new Error(data.error || 'Error al eliminar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar usuario: ' + error.message);
        }
    }
};

window.cerrarModalEditar = async function () {
    try {
        document.getElementById('modalEditar').style.display = 'none';
    } catch (error) {
        console.error('Error al cerrar el modal:', error);
        alert('Error al cerrar el formulario');
    }
};

async function guardarCambiosUsuario() {
    try {
        const email = document.getElementById('edit_email').value;
        const nombre = document.getElementById('edit_nombre').value;
        const apellido = document.getElementById('edit_apellido').value;
        const telefono = document.getElementById('edit_telefono').value;
        const tipoUsuario = document.getElementById('edit_tipoUsuario').value;

        try {
            const response = await fetch('../BackEnd/checkSession.php', {
                method: 'GET',
                credentials: 'same-origin'
            });
            const data = await response.json();
            if (data.user.id == email && data.user.rol !== tipoUsuario) {
                alert('No puedes cambiar el rol tu propia cuenta.');
                return false;
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
        if (telefono.length > 8) {
            throw new Error('El teléfono debe tener máximo 8 dígitos');
        }

        const response = await fetch('../BackEnd/modificar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                nombre,
                apellido,
                telefono,
                tipoUsuario
            })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.mensaje || 'Usuario actualizado correctamente');
            document.getElementById('modalEditar').style.display = 'none';
            await cargarUsuarios();
        } else {
            throw new Error(data.error || 'Error al actualizar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar cambios: ' + error.message);
    }
}
