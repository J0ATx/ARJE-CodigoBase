const subFavicon = document.getElementById('subir_favicon');
const subLogo = document.getElementById('subir_logo');
const addHorario = document.getElementById('agregar_horario');
const addTel = document.getElementById('agregar_telefono');

const modalHorario = document.getElementById('modalHorario');
const modalTelefono = document.getElementById('modalTelefono');
const modalNotificacion = document.getElementById('modalNotificacion');
const modalConfirmacion = document.getElementById('modalConfirmacion');
const modalEditar = document.getElementById('modalEditar');

let confirmacionCallback = null;
let editarCallback = null;

function abrirModalHorario() {
    modalHorario.classList.add('active');
}

window.cerrarModalHorario = function() {
    modalHorario.classList.remove('active');
    document.getElementById('formHorario').reset();
}

function abrirModalTelefono() {
    modalTelefono.classList.add('active');
}

window.cerrarModalTelefono = function() {
    modalTelefono.classList.remove('active');
    document.getElementById('formTelefono').reset();
}

window.cerrarModalNotificacion = function() {
    modalNotificacion.classList.remove('active');
}

window.cerrarModalEditar = function() {
    modalEditar.classList.remove('active');
    document.getElementById('formEditar').reset();
    document.getElementById('editarCampo').style.display = 'block';
    document.getElementById('editarHoraInicio').style.display = 'none';
    document.getElementById('editarHoraFin').style.display = 'none';
    editarCallback = null;
}

window.cancelarConfirmacion = function() {
    modalConfirmacion.classList.remove('active');
    confirmacionCallback = null;
}

window.confirmarAccion = function() {
    if (confirmacionCallback) {
        confirmacionCallback();
        confirmacionCallback = null;
    }
    modalConfirmacion.classList.remove('active');
}

function mostrarConfirmacion(titulo, mensaje, callback) {
    document.getElementById('confirmacionTitle').textContent = titulo;
    document.getElementById('confirmacionMessage').textContent = mensaje;
    confirmacionCallback = callback;
    
    const btnConfirmar = document.getElementById('btnConfirmar');
    btnConfirmar.onclick = confirmarAccion;
    
    modalConfirmacion.classList.add('active');
}

function mostrarEditar(titulo, label, valorActual, callback, esHorario = false) {
    document.getElementById('editarTitle').textContent = titulo;
    document.getElementById('editarLabel').textContent = label;
    
    if (esHorario) {
        document.getElementById('editarCampo').style.display = 'none';
        document.getElementById('editarHoraInicio').style.display = 'block';
        document.getElementById('editarHoraFin').style.display = 'block';
        
        const partes = valorActual.split('-');
        if (partes.length === 2) {
            document.getElementById('editarHoraInicio').value = partes[0].trim();
            document.getElementById('editarHoraFin').value = partes[1].trim();
        }
    } else {
        document.getElementById('editarCampo').style.display = 'block';
        document.getElementById('editarHoraInicio').style.display = 'none';
        document.getElementById('editarHoraFin').style.display = 'none';
        document.getElementById('editarCampo').value = valorActual;
    }
    
    editarCallback = callback;
    modalEditar.classList.add('active');
}

document.getElementById('formEditar').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let nuevoValor;
    if (document.getElementById('editarHoraInicio').style.display !== 'none') {
        const inicio = document.getElementById('editarHoraInicio').value;
        const fin = document.getElementById('editarHoraFin').value;
        nuevoValor = `${inicio} - ${fin}`;
    } else {
        nuevoValor = document.getElementById('editarCampo').value;
    }
    
    if (nuevoValor && nuevoValor.trim() !== '' && editarCallback) {
        editarCallback(nuevoValor.trim());
    }
    
    cerrarModalEditar();
});

function mostrarNotificacion(tipo, titulo, mensaje) {
    const iconContainer = document.getElementById('notificationIcon');
    const titleElement = document.getElementById('notificationTitle');
    const messageElement = document.getElementById('notificationMessage');

    iconContainer.className = 'notification-icon';
    iconContainer.classList.add(tipo);

    const svgs = {
        success: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>',
        error: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>',
        warning: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>'
    };

    iconContainer.innerHTML = svgs[tipo] || svgs.success;
    titleElement.textContent = titulo;
    messageElement.textContent = mensaje;

    modalNotificacion.classList.add('active');
}

addHorario.addEventListener('click', abrirModalHorario);
addTel.addEventListener('click', abrirModalTelefono);

window.addEventListener('click', function(e) {
    if (e.target === modalHorario) cerrarModalHorario();
    if (e.target === modalTelefono) cerrarModalTelefono();
    if (e.target === modalNotificacion) cerrarModalNotificacion();
    if (e.target === modalConfirmacion) cancelarConfirmacion();
    if (e.target === modalEditar) cerrarModalEditar();
});

// Mapeo de nombres de campos a etiquetas legibles
const nombresLegibles = {
    'empresa_nombre': 'Nombre de la Empresa',
    'empresa_mision': 'Misión',
    'empresa_vision': 'Visión',
    'empresa_valores': 'Valores',
    'empresa_whatsapp': 'WhatsApp',
    'empresa_instagram': 'Instagram',
    'empresa_facebook': 'Facebook',
    'empresa_ciudad': 'Ciudad',
    'empresa_calle': 'Calle/Dirección'
};

function cargarDatos() {
    fetch('../BackEnd/cargarDatos.php', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('info').innerHTML = '';
        document.getElementById('ubicacion').innerHTML = '';
        document.getElementById('horarios').innerHTML = '';
        document.getElementById('telefonos').innerHTML = '';

        // Cargar Datos Empresariales
        for (const [clave, valor] of Object.entries(data.info)) {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';

            const tituloDiv = document.createElement('div');
            tituloDiv.className = 'info-item-header';
            
            const titulo = document.createElement('h4');
            titulo.className = 'info-item-title';
            titulo.textContent = nombresLegibles[clave] || clave.replace('empresa_', '').toUpperCase();
            
            tituloDiv.appendChild(titulo);
            
            const contentDiv = document.createElement('div');
            contentDiv.style.display = 'flex';
            contentDiv.style.alignItems = 'center';
            contentDiv.style.gap = '10px';
            
            const input = document.createElement('input');
            input.type = clave.includes('valores') || clave.includes('mision') || clave.includes('vision') ? 'text' : 'text';
            input.id = clave;
            input.value = valor;
            input.disabled = true;
            input.style.flex = '1';

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'info-item-actions';

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', function() {
                mostrarEditar(
                    'Editar ' + (nombresLegibles[clave] || clave),
                    nombresLegibles[clave] || clave,
                    input.value,
                    function(nuevoValor) {
                        const formdata = new FormData();
                        Object.keys(data.info).forEach(key => {
                            const inputField = document.getElementById(key);
                            formdata.append(key.replace('empresa_', ''), inputField ? inputField.value : data.info[key]);
                        });
                        formdata.set(clave.replace('empresa_', ''), nuevoValor);

                        fetch('../BackEnd/cambiarInfo.php', {
                            method: 'POST',
                            body: formdata
                        })
                        .then(res => res.text())
                        .then(data => {
                            console.log(data);
                            cargarDatos();
                            mostrarNotificacion('success', '¡Éxito!', `${nombresLegibles[clave] || clave} se ha actualizado correctamente.`);
                        })
                        .catch(err => {
                            mostrarNotificacion('error', 'Error', 'Hubo un problema al actualizar el dato.');
                        });
                    }
                );
            });

            actionsDiv.appendChild(btnEditar);

            contentDiv.appendChild(input);
            contentDiv.appendChild(actionsDiv);

            infoItem.appendChild(tituloDiv);
            infoItem.appendChild(contentDiv);
            document.getElementById('info').appendChild(infoItem);
        }

        // Cargar Ubicación
        for (const [clave, valor] of Object.entries(data.ubicacion)) {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';

            const tituloDiv = document.createElement('div');
            tituloDiv.className = 'info-item-header';
            
            const titulo = document.createElement('h4');
            titulo.className = 'info-item-title';
            titulo.textContent = nombresLegibles[clave] || clave.replace('empresa_', '').toUpperCase();
            
            tituloDiv.appendChild(titulo);
            
            const contentDiv = document.createElement('div');
            contentDiv.style.display = 'flex';
            contentDiv.style.alignItems = 'center';
            contentDiv.style.gap = '10px';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = clave;
            input.value = valor;
            input.disabled = true;
            input.style.flex = '1';

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'info-item-actions';

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', function() {
                mostrarEditar(
                    'Editar ' + (nombresLegibles[clave] || clave),
                    nombresLegibles[clave] || clave,
                    input.value,
                    function(nuevoValor) {
                        const formdata = new FormData();
                        // Preparar todos los campos de ubicación
                        Object.keys(data.ubicacion).forEach(key => {
                            const inputField = document.getElementById(key);
                            formdata.append(key.replace('empresa_', ''), inputField ? inputField.value : data.ubicacion[key]);
                        });
                        // Actualizar el campo editado
                        formdata.set(clave.replace('empresa_', ''), nuevoValor);

                        fetch('../BackEnd/cambiarUbicacion.php', {
                            method: 'POST',
                            body: formdata
                        })
                        .then(res => res.text())
                        .then(data => {
                            console.log(data);
                            cargarDatos();
                            mostrarNotificacion('success', '¡Éxito!', `${nombresLegibles[clave] || clave} se ha actualizado correctamente.`);
                        })
                        .catch(err => {
                            mostrarNotificacion('error', 'Error', 'Hubo un problema al actualizar la ubicación.');
                        });
                    }
                );
            });

            actionsDiv.appendChild(btnEditar);

            contentDiv.appendChild(input);
            contentDiv.appendChild(actionsDiv);

            infoItem.appendChild(tituloDiv);
            infoItem.appendChild(contentDiv);
            document.getElementById('ubicacion').appendChild(infoItem);
        }

        // Cargar Horarios
        data.horarios.forEach(element => {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';

            const tituloDiv = document.createElement('div');
            tituloDiv.className = 'info-item-header';
            
            const titulo = document.createElement('h4');
            titulo.className = 'info-item-title';
            titulo.textContent = element.empresa_dia;
            
            tituloDiv.appendChild(titulo);

            const contentDiv = document.createElement('div');
            contentDiv.style.display = 'flex';
            contentDiv.style.alignItems = 'center';
            contentDiv.style.gap = '10px';

            const hora = document.createElement('input');
            hora.type = 'text';
            hora.value = element.empresa_hora;
            hora.disabled = true;
            hora.style.flex = '1';

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'info-item-actions';

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.id = 'editar_horario';
            btnEditar.addEventListener('click', function() {
                mostrarEditar(
                    'Editar Horario',
                    'Horario',
                    hora.value,
                    function(nuevoHorario) {
                        const formdata = new FormData();
                        formdata.append('dia', element.empresa_dia);
                        formdata.append('hora', nuevoHorario);
                        formdata.append('anterior_horario', element.empresa_hora);

                        fetch('../BackEnd/editHorario.php', {
                            method: 'POST',
                            body: formdata
                        })
                        .then(res => res.text())
                        .then(data => {
                            console.log(data);
                            cargarDatos();
                            mostrarNotificacion('success', '¡Éxito!', 'El horario se ha actualizado correctamente.');
                        })
                        .catch(err => {
                            mostrarNotificacion('error', 'Error', 'Hubo un problema al actualizar el horario.');
                        });
                    },
                    true
                );
            });

            const btnQuitar = document.createElement('button');
            btnQuitar.textContent = 'Quitar';
            btnQuitar.id = 'quitar_horario';
            btnQuitar.addEventListener('click', function() {
                mostrarConfirmacion(
                    'Eliminar Horario',
                    `¿Estás seguro de que deseas eliminar el horario "${element.empresa_dia}: ${element.empresa_hora}"?`,
                    function() {
                        const formdata = new FormData();
                        formdata.append('dia', element.empresa_dia);
                        formdata.append('hora', element.empresa_hora);

                        fetch('../BackEnd/delHorario.php', {
                            method: 'POST',
                            body: formdata
                        })
                        .then(res => res.text())
                        .then(data => {
                            console.log(data);
                            cargarDatos();
                            mostrarNotificacion('success', '¡Éxito!', 'El horario se ha eliminado correctamente.');
                        })
                        .catch(err => {
                            mostrarNotificacion('error', 'Error', 'Hubo un problema al eliminar el horario.');
                        });
                    }
                );
            });

            actionsDiv.appendChild(btnEditar);
            actionsDiv.appendChild(btnQuitar);

            contentDiv.appendChild(hora);
            contentDiv.appendChild(actionsDiv);

            infoItem.appendChild(tituloDiv);
            infoItem.appendChild(contentDiv);
            document.getElementById('horarios').appendChild(infoItem);
        });

        data.telefonos.forEach(element => {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';

            // Extraer tipo y número si está en formato "Tipo: Número"
            const telefonoCompleto = String(element.empresa_telefono || '');
            let tipo = 'Teléfono';
            let numero = telefonoCompleto;
            
            if (telefonoCompleto && telefonoCompleto.includes(':')) {
                const partes = telefonoCompleto.split(':');
                tipo = partes[0].trim();
                numero = partes[1].trim();
            }

            const tituloDiv = document.createElement('div');
            tituloDiv.className = 'info-item-header';
            
            const titulo = document.createElement('h4');
            titulo.className = 'info-item-title';
            titulo.textContent = tipo;
            
            tituloDiv.appendChild(titulo);

            const contentDiv = document.createElement('div');
            contentDiv.style.display = 'flex';
            contentDiv.style.alignItems = 'center';
            contentDiv.style.gap = '10px';

            const tel = document.createElement('input');
            tel.type = 'text';
            tel.value = numero;
            tel.disabled = true;
            tel.style.flex = '1';

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'info-item-actions';

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', function() {
                mostrarEditar(
                    'Editar Teléfono',
                    'Número de Teléfono',
                    tel.value,
                    function(nuevoTel) {
                        const formdata = new FormData();
                        formdata.append('nuevo_telefono', nuevoTel);
                        formdata.append('anterior_telefono', element.empresa_telefono);

                        fetch('../BackEnd/editTel.php', {
                            method: 'POST',
                            body: formdata
                        })
                        .then(res => res.text())
                        .then(data => {
                            console.log(data);
                            cargarDatos();
                            mostrarNotificacion('success', '¡Éxito!', 'El teléfono se ha actualizado correctamente.');
                        })
                        .catch(err => {
                            mostrarNotificacion('error', 'Error', 'Hubo un problema al actualizar el teléfono.');
                        });
                    }
                );
            });

            const btnQuitar = document.createElement('button');
            btnQuitar.textContent = 'Quitar';
            btnQuitar.id = 'quitar_horario';
            btnQuitar.addEventListener('click', function() {
                mostrarConfirmacion(
                    'Eliminar Teléfono',
                    `¿Estás seguro de que deseas eliminar el teléfono "${element.empresa_telefono}"?`,
                    function() {
                        const formdata = new FormData();
                        formdata.append('telefono', element.empresa_telefono);

                        fetch('../BackEnd/delTel.php', {
                            method: 'POST',
                            body: formdata
                        })
                        .then(res => res.text())
                        .then(data => {
                            console.log(data);
                            cargarDatos();
                            mostrarNotificacion('success', '¡Éxito!', 'El teléfono se ha eliminado correctamente.');
                        })
                        .catch(err => {
                            mostrarNotificacion('error', 'Error', 'Hubo un problema al eliminar el teléfono.');
                        });
                    }
                );
            });

            actionsDiv.appendChild(btnEditar);
            actionsDiv.appendChild(btnQuitar);

            contentDiv.appendChild(tel);
            contentDiv.appendChild(actionsDiv);

            infoItem.appendChild(tituloDiv);
            infoItem.appendChild(contentDiv);
            document.getElementById('telefonos').appendChild(infoItem);
        });
    })
    .catch(err => {
        console.error('Error al cargar datos:', err);
        mostrarNotificacion('error', 'Error', 'No se pudieron cargar los datos empresariales.');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    cargarDatos();
});

subFavicon.addEventListener('click', function (e) {
    const favicon = document.getElementById('favicon');
    const archivo = favicon.files[0];

    if (!archivo) {
        mostrarNotificacion('warning', 'Advertencia', 'Por favor, selecciona un archivo.');
        return;
    }

    const nomFavicon = archivo.name;
    const extFavicon = nomFavicon.split('.').pop().toLowerCase();

    if (extFavicon !== 'ico') {
        mostrarNotificacion('error', 'Error', 'Por favor, selecciona un archivo de imagen válido para el favicon (.ico).');
        return;
    }

    const archivoFavicon = new FormData();
    archivoFavicon.append('favicon', archivo);

    fetch('../BackEnd/archivo.php', {
        method: 'POST',
        body: archivoFavicon
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);
        document.getElementById('favicon_img').innerHTML = `<img src="${data}" alt="Favicon">`;
        mostrarNotificacion('success', '¡Éxito!', 'El favicon se ha subido correctamente.');
        favicon.value = '';
    })
    .catch(err => {
        console.log(err);
        mostrarNotificacion('error', 'Error', 'Hubo un problema al subir el favicon. Inténtalo nuevamente.');
    });
});

subLogo.addEventListener('click', function (e) {
    const logo = document.getElementById('logo');
    const archivo = logo.files[0];

    if (!archivo) {
        mostrarNotificacion('warning', 'Advertencia', 'Por favor, selecciona un archivo.');
        return;
    }

    const nomLogo = archivo.name;
    const extLogo = nomLogo.split('.').pop().toLowerCase();

    if (extLogo !== 'svg') {
        mostrarNotificacion('error', 'Error', 'Por favor, selecciona un archivo de imagen válido para el logo (.svg).');
        return;
    }

    const archivoLogo = new FormData();
    archivoLogo.append('logo', archivo);

    fetch('../BackEnd/archivo.php', {
        method: 'POST',
        body: archivoLogo
    })
    .then(res => res.text())
    .then(data => {
        document.getElementById('logo_img').innerHTML = `<img src="${data}" alt="Logo">`;
        mostrarNotificacion('success', '¡Éxito!', 'El logo se ha subido correctamente.');
        logo.value = '';
    })
    .catch(err => {
        console.log(err);
        mostrarNotificacion('error', 'Error', 'Hubo un problema al subir el logo. Inténtalo nuevamente.');
    });
});

document.getElementById('formHorario').addEventListener('submit', function(e) {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('dia', document.getElementById('dia').value);
    formdata.append('hora', document.getElementById('hora').value);

    fetch('../BackEnd/addHorario.php', {
        method: 'POST',
        body: formdata
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);
        cargarDatos();
        cerrarModalHorario();
        mostrarNotificacion('success', '¡Éxito!', 'El horario se ha agregado correctamente.');
    })
    .catch(err => {
        mostrarNotificacion('error', 'Error', 'Hubo un problema al agregar el horario.');
    });
});

document.getElementById('formTelefono').addEventListener('submit', function(e) {
    e.preventDefault();
    const tipo = document.getElementById('telefono_tipo').value;
    const telefono = document.getElementById('tel').value;
    const telefonoCompleto = tipo ? `${tipo}: ${telefono}` : telefono;

    const formdata = new FormData();
    formdata.append('telefono', telefonoCompleto);

    fetch('../BackEnd/addTel.php', {
        method: 'POST',
        body: formdata
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);
        cargarDatos();
        cerrarModalTelefono();
        mostrarNotificacion('success', '¡Éxito!', 'El teléfono se ha agregado correctamente.');
    })
    .catch(err => {
        mostrarNotificacion('error', 'Error', 'Hubo un problema al agregar el teléfono.');
    });
});
