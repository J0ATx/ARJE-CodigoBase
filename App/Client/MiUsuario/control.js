let usuarioActual = null;

document.addEventListener('DOMContentLoaded', function () {
    cargarDatosUsuario();
    inicializarEventos();
});

function cargarDatosUsuario() {
    fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar los datos del usuario');
            return response.json();
        })
        .then(data => {
            if (data.user) {
                usuarioActual = data.user;
                mostrarDatosUsuario(usuarioActual);
            } else {
                console.error('No se encontraron datos de usuario');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al cargar los datos del usuario', 'error');
        });
}

function inicializarEventos() {
    document.getElementById('btnModificar')?.addEventListener('click', abrirModalEdicion);
    document.getElementById('btnCambiarFoto')?.addEventListener('click', abrirModalFoto);
    document.getElementById('cerrarModal')?.addEventListener('click', cerrarModal);

    window.addEventListener('click', function (event) {
        const modalEdit = document.getElementById('modalEditar');
        if (event.target === modalEdit) {
            cerrarModal();
        }
        const modalFoto = document.getElementById('modalFoto');
        if (event.target === modalFoto) {
            cerrarModal();
        }
    });

    const formEditar = document.getElementById('formEditar');
    if (formEditar) {
        formEditar.addEventListener('submit', enviarDatosUsuario);
    }

    const formFoto = document.getElementById('formFotoPerfil');
    if (formFoto) {
        formFoto.addEventListener('submit', enviarFotoPerfil);
    }
}

function abrirModalEdicion() {
    if (!usuarioActual) return;

    document.getElementById('editId').value = usuarioActual.id || '';
    document.getElementById('editNombre').value = usuarioActual.nombre || '';
    document.getElementById('editApellido').value = usuarioActual.apellido || '';
    document.getElementById('editTelefono').value = usuarioActual.telefono || '';
    document.getElementById('editPlatillofav').value = usuarioActual.platillofav || '';
    document.getElementById('editContrasenia').value = '';

    document.getElementById('msgEditar').innerText = '';
    document.getElementById('msgEditar').style.color = '';

    document.getElementById('modalEditar').style.display = 'block';
}
function abrirModalFoto() {
    document.getElementById('modalFoto').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modalEditar').style.display = 'none';
    document.getElementById('modalFoto').style.display = 'none';
    document.getElementById('fotoPerfil').value = '';
}

function enviarDatosUsuario(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append('nombre', document.getElementById('editNombre').value.trim());
    formData.append('apellido', document.getElementById('editApellido').value.trim());
    formData.append('telefono', document.getElementById('editTelefono').value.trim());

    const platillofav = document.getElementById('editPlatillofav')?.value.trim();
    if (platillofav) {
        formData.append('platillofav', platillofav);
    }

    const contrasenia = document.getElementById('editContrasenia').value;
    if (contrasenia) {
        formData.append('contrasenia', contrasenia);
    }

    const btnSubmit = document.querySelector('#formEditar button[type="submit"]');
    const btnText = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Guardando...';

    fetch('../BackEnd/modificar.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(resp => {
            if (resp.success) {
                mostrarMensaje('Datos actualizados correctamente', 'success');
                if (resp.user) {
                    usuarioActual = { ...usuarioActual, ...resp.user };
                    mostrarDatosUsuario(usuarioActual);
                }
                setTimeout(cerrarModal, 1000);
            } else {
                throw new Error(resp.error || 'Error al actualizar los datos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje(error.message || 'Error al actualizar los datos', 'error');
        })
        .finally(() => {
            btnSubmit.disabled = false;
            btnSubmit.textContent = btnText;
        });
}



function enviarFotoPerfil(e) {
    e.preventDefault();

    const formData = new FormData();
    const fotoPerfil = document.getElementById('fotoPerfil').files[0];

    if (!fotoPerfil) {
        mostrarMensaje('Por favor, selecciona una imagen', 'error');
        return;
    }

    formData.append('fotoPerfil', fotoPerfil);

    const btnSubmit = e.target.querySelector('button[type="submit"]');
    const btnText = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Subiendo...';

    fetch('../BackEnd/actualizar_foto.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
        })
        .then(resp => {
            if (resp.success) {
                mostrarMensaje('Foto de perfil actualizada correctamente', 'success');
                cargarDatosUsuario();
                const modal = document.getElementById('modalEditar');
                if (modal) {
                    modal.style.display = 'none';
                }
            } else {
                throw new Error(resp);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje(error.message || 'Error al actualizar la foto de perfil', 'error');
        })
        .finally(() => {
            btnSubmit.disabled = false;
            btnSubmit.textContent = btnText;
        });
}

function mostrarMensaje(mensaje, tipo = 'info') {
    const msgElement = document.getElementById('msgEditar');
    if (!msgElement) return;

    msgElement.innerText = mensaje;
    msgElement.style.color = tipo === 'error' ? '#dc3545' :
        tipo === 'success' ? '#28a745' :
            '#17a2b8';
}

async function mostrarDatosUsuario(usuario) {

    if (!usuario) return;

    const contenedor = document.getElementById('datosUsuario');
    if (!contenedor) return;

    const fidelizado = usuario.cliente_fidelizado ? 'Sí' : 'No';

    const res = await fetch('/ARJE-CodigoBase/App/Control/Session/avatar.php', {
        method: 'GET',
        credentials: 'same-origin'
    });
    const avatar = await res.json();

    contenedor.innerHTML = `
        <div class="perfil-container">
            <div class="avatar-container">
                <img src="/ARJE-CodigoBase/App/Recursos/avatars/${avatar.avatar}" alt="Foto de perfil" class="avatar" id="avatar">
            </div>
            <div class="datos-container">
                <ul class="datos-lista">
                    <li><strong>Gmail:</strong> ${usuario.id || 'No disponible'}</li>
                    <li><strong>Nombre:</strong> ${usuario.nombre || 'No especificado'}</li>
                    <li><strong>Apellido:</strong> ${usuario.apellido || 'No especificado'}</li>
                    <li><strong>Teléfono:</strong> ${usuario.telefono || 'No especificado'}</li>
                    ${usuario.platillofav ? `<li><strong>Platillo Favorito:</strong> ${usuario.platillofav}</li>` : ''}
                    <li><strong>Rol:</strong> ${usuario.rol || 'Usuario'}</li>
                    ${usuario.cliente_fidelizado !== undefined ? `<li><strong>Fidelizado:</strong> ${fidelizado}</li>` : ''}
                </ul>
            </div>
        </div>
    `;
}
