document.addEventListener('DOMContentLoaded', async () => {
    await cargarUsuarios();

    // Botón para abrir modal de crear usuario
    document.getElementById('addUserBtn').addEventListener('click', () => {
        document.getElementById('formUsuario').reset();
        document.getElementById('modalCrear').style.display = 'flex';
    });

    document.getElementById('formUsuario').addEventListener('submit', async function (e) {
        e.preventDefault();
        await crearUsuario();
    });

    document.getElementById('formEditar').addEventListener('submit', async function (e) {
        e.preventDefault();
        await guardarCambiosUsuario();
    });
});

window.cerrarModalCrear = function () {
    document.getElementById('modalCrear').style.display = 'none';
};

async function cargarUsuarios() {
    const tabla = document.getElementById('tablaUsuarios');
    tabla.innerHTML = '';
    try {
        const res = await fetch('../BackEnd/visualizar.php');
        const data = await res.json();

        if (!data.success) {
            throw new Error(data.error || 'Error al cargar usuarios');
        }
        // Clear the table first
        tabla.innerHTML = '';

        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();

        data.usuarios.forEach(u => {
            const tr = document.createElement('tr');
            let telefonoHtml = '<td></td>';
            let telefono = '';
            if (u.usuario_telefono != null && u.usuario_telefono != '0') {
                telefonoHtml = `<td>${u.usuario_telefono}</td>`;
                telefono = u.usuario_telefono;
            }
            
            tr.innerHTML = `
                <td>${u.usuario_id}</td>
                <td>${u.usuario_nombre}</td>
                <td>${u.usuario_apellido}</td>
                ${telefonoHtml}
                <td>${u.usuario_rol}</td>
                <td class="acciones">
                    <button class="btn-menu">⋮</button>
                    <div class="menu-opciones">
                        <div class="opcion" data-action="editar" data-id="${u.usuario_id}" data-nombre="${u.usuario_nombre}" data-apellido="${u.usuario_apellido}" data-telefono="${telefono}" data-rol="${u.usuario_rol}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                            </svg>
                            Editar
                        </div>
                        <div class="opcion eliminar" data-action="eliminar" data-id="${u.usuario_id}" data-rol="${u.usuario_rol}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                            </svg>
                            Eliminar
                        </div>
                    </div>
                </td>
            `;
            
            // Add event listeners to the buttons
            const btnMenu = tr.querySelector('.btn-menu');
            const menuOpciones = tr.querySelector('.menu-opciones');
            
            btnMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                // Hide all other open menus
                document.querySelectorAll('.menu-opciones').forEach(menu => {
                    if (menu !== menuOpciones) menu.style.display = 'none';
                });
                // Toggle current menu
                menuOpciones.style.display = menuOpciones.style.display === 'block' ? 'none' : 'block';
            });
            
            // Add click handler for edit/delete options
            tr.querySelectorAll('.opcion').forEach(opcion => {
                opcion.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = opcion.getAttribute('data-action');
                    if (action === 'editar') {
                        editarUsuario(
                            opcion.getAttribute('data-id'),
                            opcion.getAttribute('data-nombre'),
                            opcion.getAttribute('data-apellido'),
                            opcion.getAttribute('data-telefono'),
                            opcion.getAttribute('data-rol')
                        );
                    } else if (action === 'eliminar') {
                        eliminarUsuario(
                            opcion.getAttribute('data-id'),
                            opcion.getAttribute('data-rol')
                        );
                    }
                    menuOpciones.style.display = 'none';
                });
            });
            
            fragment.appendChild(tr);
        });

        tabla.appendChild(fragment);

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.menu-opciones').forEach(menu => {
                menu.style.display = 'none';
            });
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
        const telefonoElement = document.getElementById('telefono');
        const telefono = telefonoElement.value == null || telefonoElement.value == '0' ? null : telefonoElement.value;
        const contrasenia = document.getElementById('contrasenia').value;
        const tipoUsuario = document.getElementById('tipoUsuario').value;

        if (telefono && telefono.length > 9) {
            throw new Error('El teléfono debe tener máximo 9 dígitos');
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
            document.getElementById('modalCrear').style.display = 'none';
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
        const telefonoElement = document.getElementById('edit_telefono');
        const telefono = telefonoElement.value.trim() === '' || telefonoElement.value.trim() === '0' ? '' : telefonoElement.value;
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
        console.log(data);
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

// Función para manejar el menú de tres puntos
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
