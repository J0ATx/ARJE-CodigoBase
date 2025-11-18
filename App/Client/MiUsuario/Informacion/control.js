let usuarioActual = null;
let alergias = [];
let platosFavoritos = [];

document.addEventListener('DOMContentLoaded', function () {
    cargarDatosUsuario();
    inicializarEventos();
});

function cargarDatosUsuario() {
    fetch('/App/Control/Session/checkSession.php')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar los datos del usuario');
            return response.json();
        })
        .then(data => {
            if (data.user) {
                usuarioActual = data.user;
                mostrarDatosUsuario(usuarioActual);
                // Cargar alergias y platos favoritos después de cargar datos del usuario
                cargarAlergias();
                cargarPlatosFavoritos();
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
    const btnModificar = document.getElementById('btnModificar');
    if (btnModificar) btnModificar.addEventListener('click', abrirModalEdicion);
    const btnCambiarFoto = document.getElementById('btnCambiarFoto');
    if (btnCambiarFoto) btnCambiarFoto.addEventListener('click', abrirModalFoto);
    const cerrarModalBtn = document.getElementById('cerrarModal');
    if (cerrarModalBtn) cerrarModalBtn.addEventListener('click', cerrarModal);
    
    // Eventos para alergias
    document.getElementById('btnAgregarAlergia')?.addEventListener('click', agregarAlergia);
    
    // Eventos para platos favoritos
    document.getElementById('btnAgregarPlato')?.addEventListener('click', agregarPlatoFavorito);

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

    const modal = document.getElementById('modalEditar');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function abrirModalFoto() {
    const modal = document.getElementById('modalFoto');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    document.querySelectorAll('#modalEditar, #modalFoto').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
    document.getElementById('fotoPerfil').value = '';
}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        cerrarModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarModal();
    }
});

const fileInput = document.getElementById('fotoPerfil');
const fileNameDisplay = document.getElementById('fileName');
const fileUploadLabel = document.getElementById('fileUploadLabel');

if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                mostrarMensaje('El archivo es demasiado grande. El tamaño máximo permitido es 2MB.', 'error');
                fileInput.value = '';
                fileNameDisplay.textContent = 'Ningún archivo seleccionado';
                fileUploadLabel.classList.remove('has-file');
                return;
            }
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                mostrarMensaje('Formato de archivo no válido. Solo se permiten imágenes JPG y PNG.', 'error');
                fileInput.value = '';
                fileNameDisplay.textContent = 'Ningún archivo seleccionado';
                fileUploadLabel.classList.remove('has-file');
                return;
            }
            fileNameDisplay.textContent = file.name;
            fileUploadLabel.classList.add('has-file');
            const reader = new FileReader();
            reader.onload = function(e) {
                // if (preview) {
                //     preview.src = e.target.result;
                //     preview.style.display = 'block';
                // }
            };
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = 'Ningún archivo seleccionado';
            fileUploadLabel.classList.remove('has-file');
        }
    });
}

function mostrarMensaje(mensaje, tipo = 'error') {
    const msgElement = document.getElementById('msgEditar');
    if (!msgElement) return;

    msgElement.innerText = mensaje;
    msgElement.style.color = tipo === 'error' ? '#dc3545' :
        tipo === 'success' ? '#28a745' :
            '#17a2b8';
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
                cerrarModal();
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

async function mostrarDatosUsuario(usuario) {
    if (!usuario) return;

    const contenedor = document.getElementById('datosUsuario');
    if (!contenedor) return;

    const fidelizado = usuario.cliente_fidelizado ? 'Sí' : 'No';

    const res = await fetch('/App/Control/Session/avatar.php', {
        method: 'GET',
        credentials: 'same-origin'
    });
    const avatar = await res.json();

    contenedor.innerHTML = `
        <div class="perfil-container">
            <div class="avatar-container">
                <div class="avatar-wrapper" id="subir-avatar">
                    <img src="/App/Recursos/avatars/${avatar.avatar}" alt="Foto de perfil" class="avatar" id="avatar">
                </div>
            </div>
            <div class="datos-container">
                <div class="login-inputs">
                    <label for="userNombre">
                        Nombre completo
                        <div class="input-wrapper">
                            <input id="userNombre" class="nombre-input" type="text" 
                                value="${usuario.nombre || ''}" data-original="${usuario.nombre || ''}" readonly disabled>
                            <input id="userApellido" class="apellido-input" type="text" 
                                value="${usuario.apellido || ''}" data-original="${usuario.apellido || ''}" readonly disabled>
                            <button class="edit-btn" data-field="nombre">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4V20H20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.278 1.87866 20.554 1.93348 20.8123 2.04014C21.0705 2.1468 21.3059 2.30356 21.5041 2.5018C21.7023 2.70005 21.8594 2.93599 21.9662 3.19477C22.073 3.45355 22.1275 3.73003 22.1268 4.00891C22.1261 4.28779 22.0702 4.56399 21.9625 4.82218C21.8548 5.08037 21.6973 5.31562 21.5 5.51391L12 15.0009L8 16.0009L9.5 12.5009L18.5 2.49998Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </label>
                    
                    <label for="userEmail">
                        Email
                        <div class="input-wrapper">
                            <input type="email" id="userEmail" class="email-input" 
                                value="${usuario.id || ''}" readonly disabled>
                        </div>
                    </label>
                    
                    <label for="userTelefono">
                        Teléfono
                        <div class="input-wrapper">
                            <input type="tel" id="userTelefono" 
                                value="${usuario.telefono || ''}" 
                                class="telefono-input" 
                                data-original="${usuario.telefono || ''}" 
                                pattern="[0-9]{9}" 
                                title="El teléfono debe tener 9 dígitos numéricos"
                                placeholder="Ej: 912345678"
                                oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 9)"
                                readonly disabled>
                            <button class="edit-btn" data-field="telefono">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4V20H20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.278 1.87866 20.554 1.93348 20.8123 2.04014C21.0705 2.1468 21.3059 2.30356 21.5041 2.5018C21.7023 2.70005 21.8594 2.93599 21.9662 3.19477C22.073 3.45355 22.1275 3.73003 22.1268 4.00891C22.1261 4.28779 22.0702 4.56399 21.9625 4.82218C21.8548 5.08037 21.6973 5.31562 21.5 5.51391L12 15.0009L8 16.0009L9.5 12.5009L18.5 2.49998Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="tooltip-content" role="tooltip">
                                <div>El teléfono debe tener exactamente 9 dígitos numéricos.</div>
                            </div>
                        </div>
                    </label>
                    
                    <label for="userPassword">
                        Contraseña
                        <div class="input-wrapper">
                            <input type="password" id="userPassword" class="password-input" 
                                value="••••••••" readonly disabled>
                            <button type="button" class="edit-btn"
                                onclick="window.location.href='/ContraseñaOlvidada'">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4V20H20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.278 1.87866 20.554 1.93348 20.8123 2.04014C21.0705 2.1468 21.3059 2.30356 21.5041 2.5018C21.7023 2.70005 21.8594 2.93599 21.9662 3.19477C22.073 3.45355 22.1275 3.73003 22.1268 4.00891C22.1261 4.28779 22.0702 4.56399 21.9625 4.82218C21.8548 5.08037 21.6973 5.31562 21.5 5.51391L12 15.0009L8 16.0009L9.5 12.5009L18.5 2.49998Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </label>
                    
                    <div class="save-btn-container" id="saveBtnContainer">
                        <button type="button" class="save-btn" id="saveChangesBtn">Guardar cambios</button>
                    </div>
                </div>
            </div>
        </div>`;
        
    const avatarImage = document.getElementById('subir-avatar');
    if (avatarImage) {
        avatarImage.style.cursor = 'pointer';
        avatarImage.addEventListener('click', abrirModalFoto);
    }
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const field = this.getAttribute('data-field');
            if (field) {
                toggleEditField(field);
            }
        });
    });
    
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    if (saveChangesBtn) saveChangesBtn.addEventListener('click', saveChanges);
}

function toggleEditField(field) {
    let input, otherInput = null;

    if (field === 'nombre') {
        input = document.getElementById('userNombre');
        otherInput = document.getElementById('userApellido');
    } else {
        input = document.getElementById('user' + field.charAt(0).toUpperCase() + field.slice(1));
    }

    if (!input.readOnly) {

        input.value = input.getAttribute('data-original');
        input.readOnly = true;
        input.disabled = true;
        if (otherInput) {
            otherInput.value = otherInput.getAttribute('data-original');
            otherInput.readOnly = true;
            otherInput.disabled = true;
        }
        document.getElementById('saveBtnContainer').style.display = 'none';
    } else {

        input.readOnly = false;
        input.disabled = false;
        if (otherInput) {
            otherInput.readOnly = false;
            otherInput.disabled = false;
        }
        document.getElementById('saveBtnContainer').style.display = 'block';
        input.focus();
    }
}

function saveChanges() {
    const nombreInput = document.getElementById('userNombre');
    const apellidoInput = document.getElementById('userApellido');
    const telefonoInput = document.getElementById('userTelefono');

    const nombre = (nombreInput?.value || '').trim();
    const apellido = (apellidoInput?.value || '').trim();
    const telefono = (telefonoInput?.value || '').trim();

    if (!nombre || !apellido) {
        mostrarMensaje('Nombre y apellido son obligatorios', 'error');
        return;
    }
    if (telefono && !/^\d{9}$/.test(telefono)) {
        mostrarMensaje('El teléfono debe tener 9 dígitos numéricos', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    if (telefono) formData.append('telefono', telefono);

    const saveBtn = document.getElementById('saveChangesBtn');
    const prevText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';

    fetch('../BackEnd/modificar.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
        .then(r => r.json())
        .then(resp => {
            if (resp && resp.success) {
                mostrarMensaje('Datos actualizados correctamente', 'success');
                if (resp.user) {
                    usuarioActual = { ...usuarioActual, ...resp.user };
                }
                if (nombreInput) {
                    nombreInput.readOnly = true; nombreInput.disabled = true;
                    nombreInput.setAttribute('data-original', nombre);
                }
                if (apellidoInput) {
                    apellidoInput.readOnly = true; apellidoInput.disabled = true;
                    apellidoInput.setAttribute('data-original', apellido);
                }
                if (telefonoInput) {
                    telefonoInput.readOnly = true; telefonoInput.disabled = true;
                    telefonoInput.setAttribute('data-original', telefono);
                }
                const cont = document.getElementById('saveBtnContainer');
                if (cont) cont.style.display = 'none';
            } else {
                throw new Error(resp.error || 'Error al actualizar los datos');
            }
        })
        .catch(err => {
            console.error(err);
            mostrarMensaje(err.message || 'Error al actualizar los datos', 'error');
        })
        .finally(() => {
            saveBtn.disabled = false;
            saveBtn.textContent = prevText;
        });
}

// Funciones para Alergias
function cargarAlergias() {
    fetch('../BackEnd/listar_alergias.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alergias = data.alergias;
                mostrarAlergias();
            } else {
                mostrarMensajeAlergia(data.error || 'Error al cargar alergias', 'error');
            }
        })
        .catch(error => {
            console.error('Error al cargar alergias:', error);
            mostrarMensajeAlergia('Error al cargar alergias', 'error');
        });
}

function mostrarAlergias() {
    const contenedor = document.getElementById('listaAlergias');
    if (!contenedor) return;

    if (alergias.length === 0) {
        contenedor.innerHTML = '';
    } else {
        contenedor.innerHTML = alergias.map(alergia => `
            <div class="item-lista" data-id="${alergia.id}">
                <input type="text" class="item-input" value="${alergia.alergia || ''}" placeholder="Escribe tu alergia" data-id="${alergia.id}" data-original="${alergia.alergia || ''}" />
                <div class="item-acciones">
                    <button type="button" class="btn-eliminar" onclick='eliminarAlergia("${alergia.id}")' title="Eliminar">
                        ×
                    </button>
                </div>
            </div>
        `).join('');
        const inputs = contenedor.querySelectorAll('.item-input');
        inputs.forEach(input => {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur();
                }
            });
            input.addEventListener('blur', function() {
                guardarAlergiaInput(this);
            });
        });
    }
}

function agregarAlergia() {
    const tempId = 'temp-' + Date.now();
    alergias.push({ id: tempId, alergia: '' });
    mostrarAlergias();
    const contenedor = document.getElementById('listaAlergias');
    const input = contenedor?.querySelector(`.item-input[data-id="${tempId}"]`);
    if (input) input.focus();
}

function guardarAlergiaInput(inputEl) {
    const id = inputEl.getAttribute('data-id');
    const original = inputEl.getAttribute('data-original') || '';
    const nombre = inputEl.value.trim();
    if (!nombre) return;

    if (id && id.startsWith('temp-')) {
        const formData = new FormData();
        formData.append('alergia', nombre);
        fetch('../BackEnd/agregar_alergia.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    const idx = alergias.findIndex(a => a.id === id);
                    if (idx !== -1) alergias[idx] = { id: data.alergia_id, alergia: data.alergia };
                    mostrarAlergias();
                    mostrarMensajeAlergia('Alergia guardada', 'success');
                } else {
                    mostrarMensajeAlergia(data.error || 'Error al guardar alergia', 'error');
                }
            })
            .catch(() => {
                mostrarMensajeAlergia('Error al guardar alergia', 'error');
            });
    } else if (id && nombre !== original) {
        const formDataDel = new FormData();
        formDataDel.append('alergia_id', id);
        fetch('../BackEnd/eliminar_alergia.php', {
            method: 'POST',
            body: formDataDel,
            credentials: 'same-origin'
        })
            .then(r => r.json())
            .then(() => {
                const formDataAdd = new FormData();
                formDataAdd.append('alergia', nombre);
                return fetch('../BackEnd/agregar_alergia.php', {
                    method: 'POST',
                    body: formDataAdd,
                    credentials: 'same-origin'
                });
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    const idx = alergias.findIndex(a => a.id == id);
                    if (idx !== -1) alergias[idx] = { id: data.alergia_id, alergia: data.alergia };
                    mostrarAlergias();
                    mostrarMensajeAlergia('Alergia actualizada', 'success');
                } else {
                    mostrarMensajeAlergia(data.error || 'Error al actualizar alergia', 'error');
                    cargarAlergias();
                }
            })
            .catch(() => {
                mostrarMensajeAlergia('Error al actualizar alergia', 'error');
                cargarAlergias();
            });
    }
}

function editarAlergia(id) {
    const alergia = alergias.find(a => a.id === id);
    if (!alergia) return;

    const nombre = prompt('Editar alergia:', alergia.alergia);
    if (!nombre || !nombre.trim() || nombre.trim() === alergia.alergia) return;

    // Primero eliminar la alergia existente
    eliminarAlergiaDeLista(id, () => {
        // Luego agregar la nueva
        const formData = new FormData();
        formData.append('alergia', nombre.trim());

        fetch('../BackEnd/agregar_alergia.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alergias.push({ id: data.alergia_id, alergia: data.alergia });
                    mostrarAlergias();
                    mostrarMensajeAlergia('Alergia actualizada correctamente', 'success');
                } else {
                    mostrarMensajeAlergia(data.error || 'Error al actualizar alergia', 'error');
                    // Recargar la lista original si hay error
                    cargarAlergias();
                }
            })
            .catch(error => {
                console.error('Error al actualizar alergia:', error);
                mostrarMensajeAlergia('Error al actualizar alergia', 'error');
                // Recargar la lista original si hay error
                cargarAlergias();
            });
    });
}

function eliminarAlergia(id) {
    const formData = new FormData();
    const isNumericId = /^[0-9]+$/.test(String(id));
    if (isNumericId) {
        formData.append('alergia_id', id);
    } else {
        const item = alergias.find(a => String(a.id) === String(id));
        if (item && item.alergia) formData.append('alergia_nombre', item.alergia);
    }
    fetch('../BackEnd/eliminar_alergia.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                eliminarAlergiaDeLista(id);
                mostrarMensajeAlergia('Alergia eliminada correctamente', 'success');
            } else {
                mostrarMensajeAlergia(data.error || 'Error al eliminar alergia', 'error');
            }
        })
        .catch(error => {
            console.error('Error al eliminar alergia:', error);
            mostrarMensajeAlergia('Error al eliminar alergia', 'error');
        });
}

function eliminarAlergiaDeLista(id, callback) {
    const elemento = document.querySelector(`[data-id="${id}"]`);
    if (elemento) {
        elemento.classList.add('item-eliminando');
        setTimeout(() => {
            alergias = alergias.filter(a => a.id !== id);
            mostrarAlergias();
            if (callback) callback();
        }, 300);
    } else {
        alergias = alergias.filter(a => a.id !== id);
        mostrarAlergias();
        if (callback) callback();
    }
}

function mostrarMensajeAlergia(mensaje, tipo) {
    const contenedor = document.getElementById('alergias');
    if (!contenedor) return;

    let mensajeDiv = contenedor.querySelector('.mensaje-estado');
    if (!mensajeDiv) {
        mensajeDiv = document.createElement('div');
        const primerElemento = contenedor.firstChild;
        if (primerElemento) {
            contenedor.appendChild(mensajeDiv);
        } else {
            contenedor.appendChild(mensajeDiv);
        }
    }
    mensajeDiv.className = `mensaje-estado ${tipo}`;
    mensajeDiv.textContent = mensaje;

    setTimeout(() => {
        if (mensajeDiv && mensajeDiv.parentNode) {
            mensajeDiv.parentNode.removeChild(mensajeDiv);
        }
    }, 3000);
}

// Funciones para Platos Favoritos
function cargarPlatosFavoritos() {
    fetch('../BackEnd/listar_platos_favoritos.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                platosFavoritos = data.platos;
                mostrarPlatosFavoritos();
            } else {
                mostrarMensajePlato(data.error || 'Error al cargar platos favoritos', 'error');
            }
        })
        .catch(error => {
            console.error('Error al cargar platos favoritos:', error);
            mostrarMensajePlato('Error al cargar platos favoritos', 'error');
        });
}

function mostrarPlatosFavoritos() {
    const contenedor = document.getElementById('listaPlatosFavoritos');
    if (!contenedor) return;

    if (platosFavoritos.length === 0) {
        contenedor.innerHTML = '';
    } else {
        contenedor.innerHTML = platosFavoritos.map(plato => `
            <div class="item-lista" data-id="${plato.id}">
                <input type="text" class="item-input" value="${plato.plato || ''}" placeholder="Escribe tu plato favorito" data-id="${plato.id}" data-original="${plato.plato || ''}" />
                <div class="item-acciones">
                    <button type="button" class="btn-eliminar" onclick='eliminarPlatoFavorito("${plato.id}")' title="Eliminar">
                        ×
                    </button>
                </div>
            </div>
        `).join('');
        const inputs = contenedor.querySelectorAll('.item-input');
        inputs.forEach(input => {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur();
                }
            });
            input.addEventListener('blur', function() {
                guardarPlatoFavoritoInput(this);
            });
        });
    }
}

function agregarPlatoFavorito() {
    const tempId = 'temp-' + Date.now();
    platosFavoritos.push({ id: tempId, plato: '' });
    mostrarPlatosFavoritos();
    const contenedor = document.getElementById('listaPlatosFavoritos');
    const input = contenedor?.querySelector(`.item-input[data-id="${tempId}"]`);
    if (input) input.focus();
}

function guardarPlatoFavoritoInput(inputEl) {
    const id = inputEl.getAttribute('data-id');
    const original = inputEl.getAttribute('data-original') || '';
    const nombre = inputEl.value.trim();
    if (!nombre) return;

    if (id && id.startsWith('temp-')) {
        const formData = new FormData();
        formData.append('plato', nombre);
        fetch('../BackEnd/agregar_plato_favorito.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    const idx = platosFavoritos.findIndex(p => p.id === id);
                    if (idx !== -1) platosFavoritos[idx] = { id: data.plato_id, plato: data.plato };
                    mostrarPlatosFavoritos();
                    mostrarMensajePlato('Plato favorito guardado', 'success');
                } else {
                    mostrarMensajePlato(data.error || 'Error al guardar plato favorito', 'error');
                }
            })
            .catch(() => {
                mostrarMensajePlato('Error al guardar plato favorito', 'error');
            });
    } else if (id && nombre !== original) {
        const formDataDel = new FormData();
        const isNumericId = /^[0-9]+$/.test(String(id));
        if (isNumericId) {
            formDataDel.append('plato_id', id);
        } else {
            formDataDel.append('plato_nombre', original);
        }
        fetch('../BackEnd/eliminar_plato_favorito.php', {
            method: 'POST',
            body: formDataDel,
            credentials: 'same-origin'
        })
            .then(r => r.json())
            .then(() => {
                const formDataAdd = new FormData();
                formDataAdd.append('plato', nombre);
                return fetch('../BackEnd/agregar_plato_favorito.php', {
                    method: 'POST',
                    body: formDataAdd,
                    credentials: 'same-origin'
                });
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    const idx = platosFavoritos.findIndex(p => p.id == id);
                    if (idx !== -1) platosFavoritos[idx] = { id: data.plato_id, plato: data.plato };
                    mostrarPlatosFavoritos();
                    mostrarMensajePlato('Plato favorito actualizado', 'success');
                } else {
                    mostrarMensajePlato(data.error || 'Error al actualizar plato favorito', 'error');
                    cargarPlatosFavoritos();
                }
            })
            .catch(() => {
                mostrarMensajePlato('Error al actualizar plato favorito', 'error');
                cargarPlatosFavoritos();
            });
    }
}

function editarPlatoFavorito(id) {
    const plato = platosFavoritos.find(p => p.id === id);
    if (!plato) return;

    const nombre = prompt('Editar plato favorito:', plato.plato);
    if (!nombre || !nombre.trim() || nombre.trim() === plato.plato) return;

    // Primero eliminar el plato existente
    eliminarPlatoDeLista(id, () => {
        // Luego agregar el nuevo
        const formData = new FormData();
        formData.append('plato', nombre.trim());

        fetch('../BackEnd/agregar_plato_favorito.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    platosFavoritos.push({ id: data.plato_id, plato: data.plato });
                    mostrarPlatosFavoritos();
                    mostrarMensajePlato('Plato favorito actualizado correctamente', 'success');
                } else {
                    mostrarMensajePlato(data.error || 'Error al actualizar plato favorito', 'error');
                    // Recargar la lista original si hay error
                    cargarPlatosFavoritos();
                }
            })
            .catch(error => {
                console.error('Error al actualizar plato favorito:', error);
                mostrarMensajePlato('Error al actualizar plato favorito', 'error');
                // Recargar la lista original si hay error
                cargarPlatosFavoritos();
            });
    });
}

function eliminarPlatoFavorito(id) {
    const formData = new FormData();
    const isNumericId = /^[0-9]+$/.test(String(id));
    if (isNumericId) {
        formData.append('plato_id', id);
    } else {
        const item = platosFavoritos.find(p => String(p.id) === String(id));
        if (item && item.plato) formData.append('plato_nombre', item.plato);
    }
    fetch('../BackEnd/eliminar_plato_favorito.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                eliminarPlatoDeLista(id);
                mostrarMensajePlato('Plato favorito eliminado correctamente', 'success');
            } else {
                mostrarMensajePlato(data.error || 'Error al eliminar plato favorito', 'error');
            }
        })
        .catch(error => {
            console.error('Error al eliminar plato favorito:', error);
            mostrarMensajePlato('Error al eliminar plato favorito', 'error');
        });
}

function eliminarPlatoDeLista(id, callback) {
    const elemento = document.querySelector(`#listaPlatosFavoritos [data-id="${id}"]`);
    if (elemento) {
        elemento.classList.add('item-eliminando');
        setTimeout(() => {
            platosFavoritos = platosFavoritos.filter(p => p.id !== id);
            mostrarPlatosFavoritos();
            if (callback) callback();
        }, 300);
    } else {
        platosFavoritos = platosFavoritos.filter(p => p.id !== id);
        mostrarPlatosFavoritos();
        if (callback) callback();
    }
}

function mostrarMensajePlato(mensaje, tipo) {
    const contenedor = document.getElementById('platosFavoritos');
    if (!contenedor) return;

    let mensajeDiv = contenedor.querySelector('.mensaje-estado');
    if (!mensajeDiv) {
        mensajeDiv = document.createElement('div');
        const primerElemento = contenedor.firstChild;
        if (primerElemento) {
            contenedor.appendChild(mensajeDiv);
        } else {
            contenedor.appendChild(mensajeDiv);
        }
    }
    mensajeDiv.className = `mensaje-estado ${tipo}`;
    mensajeDiv.textContent = mensaje;

    setTimeout(() => {
        if (mensajeDiv && mensajeDiv.parentNode) {
            mensajeDiv.parentNode.removeChild(mensajeDiv);
        }
    }, 3000);
}