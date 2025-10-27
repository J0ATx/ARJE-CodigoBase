function getEstrellasCalificacion(calificacion) {
    if (!calificacion) return '';

    const calif = parseFloat(calificacion);
    const estrellasLlenas = Math.round(calif);
    const estrellasTotales = 10;

    let html = '';

    for (let i = 0; i < estrellasTotales; i++) {
        if (i < estrellasLlenas) {
            html += '★';
        } else {
            html += '☆';
        }
    }

    return html;
}

document.addEventListener('DOMContentLoaded', async () => {
    await mostrarDetalleProducto();
});

async function mostrarDetalleProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        document.getElementById('detalle-producto').textContent = 'ID de producto no especificado.';
        return;
    }
    try {
        const response = await fetch(`../BackEnd/visualizar.php?id=${encodeURIComponent(id)}`);
        const producto = await response.json();

        if (producto.error) {
            document.getElementById('detalle-producto').textContent = producto.error;
            return;
        }
        const cont = document.getElementById('detalle-producto');
        const imageUrl = producto.imagen_url || '';

        cont.innerHTML = `
            <div class="detalle-contenedor">
                <div class="detalle-imagen" style="background-image: url('${imageUrl}');"></div>
                <div class="detalle-info">
                    <h2>${producto.producto_nombre}</h2>
                    <p class="precio">$${producto.producto_precio}</p>
                    ${producto.producto_calificacion ? `
                        <div class="producto-calificacion">
                            <div class="estrellas-display">
                                ${getEstrellasCalificacion(producto.producto_calificacion)}
                            </div>
                            <span class="calificacion-numero">${producto.producto_calificacion}/10</span>
                            ${producto.total_comentarios ? `<span class="total-comentarios">(${producto.total_comentarios} comentarios)</span>` : ''}
                        </div>
                    ` : ''}
                    ${producto.producto_descripcion ? `<div class="descripcion-detalle"><h3>Descripción:</h3><p>${producto.producto_descripcion.replace(/\n/g, '<br>')}</p></div>` : ''}
                </div>
            </div>
            <div class="comentarios-seccion">
                <div class="comentarios-header">
                    <h3>Comentarios y Reseñas</h3>
                    <button id="btn-abrir-comentarios" class="btn-comentar-principal">Comentar</button>
                </div>
                <div id="lista-comentarios" class="lista-comentarios">
                </div>
            </div>
        `;

        // Cargar comentarios después de mostrar el producto
        cargarComentarios(producto.producto_id);

        // Configurar funcionalidad del modal de comentarios
        configurarModalComentarios(producto.producto_id);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('detalle-producto').textContent = 'Error al cargar el producto.';
    }
}

function cargarComentarios(productoId) {
    fetch(`../BackEnd/obtener_comentarios.php?producto_id=${productoId}`)
        .then(response => response.json())
        .then(async data => {
            if (data.success) {
                await mostrarComentarios(data.comentarios);
                if (data.producto) {
                    actualizarPromedio(data.producto);
                }
            }
        })
        .catch(error => {
            console.error('Error cargando comentarios:', error);
        });
}

async function mostrarComentarios(comentarios) {
    const contenedor = document.getElementById('lista-comentarios');
    if (!contenedor) return;

    if (comentarios.length === 0) {
        contenedor.innerHTML = '<p class="sin-comentarios">No hay comentarios aún.</p>';
        return;
    }

    let usuarioActual = null;
    let avatar = null;
    try {
        const response = await fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const sessionData = await response.json();

        if (sessionData.logged_in && sessionData.user) {
            usuarioActual = sessionData.user;
            const responseAvatar = await fetch('/ARJE-CodigoBase/App/Control/Session/avatar.php', {
                method: 'GET',
                credentials: 'same-origin'
            });
            avatar = await responseAvatar.json();
        }
    } catch (error) {
        console.error('Error verificando sesión:', error);
        avatar = { avatar: 'default.png' };
    }

    const comentariosHTML = comentarios.map(comentario => {
        const esComentarioPropio = usuarioActual && usuarioActual.id === comentario.cliente_id;
        const esGerenteGeneral = usuarioActual && usuarioActual.rol === 'Gerente-General';
        const puedeEliminar = esComentarioPropio || esGerenteGeneral;

        return `
            <div class="comentario-item" data-comentario-id="${comentario.comentario_id}">
                <div class="comentario-header">
                <div class="comentario-user">    
                <img src="/ARJE-CodigoBase/App/Recursos/avatars/${avatar?.avatar || 'default.png'}" id="avatar" class="logged" alt="Foto de perfíl">
                    <strong>${comentario.cliente_nombre} ${comentario.cliente_apellido}</strong>
                </div>
                    <div class="comentario-calificacion">
                        <span class="estrellas">${getEstrellasCalificacion(comentario.comentario_calificacion)}</span>
                        <span class="calificacion-numero">${parseFloat(comentario.comentario_calificacion).toFixed(1)}/10</span>
                    </div>
                </div>
                ${comentario.comentario_contenido ? `<p class="comentario-contenido">${comentario.comentario_contenido}</p>` : ''}
                ${puedeEliminar ? `
                    <div class="comentario-acciones">
                        ${esComentarioPropio ? `
                            <button class="btn-editar-comentario" onclick="editarComentario(${comentario.comentario_id}, '${comentario.comentario_contenido}', ${comentario.comentario_calificacion})">
                                Editar
                            </button>
                        ` : ''}
                        <button class="btn-eliminar-comentario" onclick="eliminarComentario(${comentario.comentario_id})">
                            ${esGerenteGeneral ? 'Eliminar' : 'Eliminar'}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    contenedor.innerHTML = comentariosHTML;
}

function actualizarPromedio(producto) {
    const calificacionDiv = document.querySelector('.producto-calificacion');
    if (calificacionDiv && producto.producto_calificacion) {
        const promedioSpan = calificacionDiv.querySelector('.calificacion-numero');
        const comentariosSpan = calificacionDiv.querySelector('.total-comentarios');

        if (promedioSpan) {
            promedioSpan.textContent = `${parseFloat(producto.producto_calificacion).toFixed(1)}/10`;
        }
        if (comentariosSpan) {
            comentariosSpan.textContent = `(${producto.total_comentarios} comentarios)`;
        }
    }
}

async function mostrarFormularioComentario(productoId) {
    const contenedor = document.getElementById('formulario-comentario');
    if (!contenedor) return;
    const response = await fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php', {
        method: 'GET',
        credentials: 'same-origin'
    });
    const data = await response.json();

    if (!data.logged_in) {
        contenedor.innerHTML = `
            <div class="login-prompt">
                <p>Debes <a href="#" onclick="mostrarLogin()">iniciar sesión</a> para comentar.</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = `
        <form id="form-comentario" class="form-comentario">
            <div class="form-group">
                <label for="calificacion">Calificación:</label>
                <div class="estrellas-input" id="estrellas-input" role="radiogroup" aria-label="Calificación del producto">
                    <span class="estrella" data-value="1" role="radio" aria-label="1 estrella" tabindex="0">☆</span>
                    <span class="estrella" data-value="2" role="radio" aria-label="2 estrellas" tabindex="0">☆</span>
                    <span class="estrella" data-value="3" role="radio" aria-label="3 estrellas" tabindex="0">☆</span>
                    <span class="estrella" data-value="4" role="radio" aria-label="4 estrellas" tabindex="0">☆</span>
                    <span class="estrella" data-value="5" role="radio" aria-label="5 estrellas" tabindex="0">☆</span>
                    <span class="estrella" data-value="6" role="radio" aria-label="6 estrellas" tabindex="0">☆</span>
                    <span class="estrella" data-value="7" role="radio" aria-label="7 estrellas" tabindex="0">☆</span>
                    <span class="estrella" data-value="8" role="radio" aria-label="8 estrellas" tabindex="0">☆</span>
                    <span class="estrella" data-value="9" role="radio" aria-label="9 estrellas" tabindex="0">☆</span>
                    <span class="estrella" data-value="10" role="radio" aria-label="10 estrellas" tabindex="0">☆</span>
                </div>
                <input type="hidden" id="calificacion" name="calificacion" required>
                <div class="calificacion-texto" id="calificacion-texto">Selecciona una calificación</div>
            </div>
            <div class="form-group">
                <label for="comentario">Comentario (opcional):</label>
                <textarea id="comentario" name="comentario" rows="3" maxlength="250"
                          placeholder="Comparte tu experiencia con este producto..."></textarea>
            </div>
            <button type="submit" class="btn-comentar">Publicar Comentario</button>
        </form>
    `;

    configurarEstrellas();

    // Agregar event listener al formulario
    const form = document.getElementById('form-comentario');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarComentario(productoId, data.user);
    });
}

function configurarEstrellas() {
    const estrellasInput = document.getElementById('estrellas-input');
    const calificacionHidden = document.getElementById('calificacion');
    const calificacionTexto = document.getElementById('calificacion-texto');
    const estrellas = estrellasInput.querySelectorAll('.estrella');

    let calificacionSeleccionada = 0;

    // Configurar navegación por teclado
    estrellas.forEach((estrella, index) => {
        const valor = index + 1;

        // Click para seleccionar
        estrella.addEventListener('click', () => {
            seleccionarCalificacion(valor);
        });

        // Navegación por teclado
        estrella.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                seleccionarCalificacion(valor);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                const siguienteIndex = (index + 1) % estrellas.length;
                estrellas[siguienteIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                const anteriorIndex = (index - 1 + estrellas.length) % estrellas.length;
                estrellas[anteriorIndex].focus();
            }
        });

        // Hover para preview visual
        estrella.addEventListener('mouseenter', () => {
            if (calificacionSeleccionada === 0) {
                actualizarEstrellas(valor, true);
                calificacionTexto.textContent = `${valor} estrella${valor !== 1 ? 's' : ''}`;
            }
        });

        estrella.addEventListener('mouseleave', () => {
            if (calificacionSeleccionada === 0) {
                actualizarEstrellas(0, true);
                calificacionTexto.textContent = 'Selecciona una calificación';
            }
        });
    });

    function seleccionarCalificacion(valor) {
        calificacionSeleccionada = valor;
        calificacionHidden.value = valor;
        calificacionTexto.textContent = `Calificación: ${valor} estrella${valor !== 1 ? 's' : ''}`;
        actualizarEstrellas(valor, false);

        // Anunciar a lectores de pantalla
        estrellasInput.setAttribute('aria-valuenow', valor);
        estrellasInput.setAttribute('aria-valuetext', `${valor} estrella${valor !== 1 ? 's' : ''}`);
    }

    function actualizarEstrellas(calificacion, isPreview = false) {
        estrellas.forEach((estrella, index) => {
            const valor = index + 1;

            if (calificacion >= valor) {
                estrella.textContent = '★';
                estrella.classList.add('seleccionada');
                estrella.classList.remove('preview');
            } else {
                estrella.textContent = '☆';
                estrella.classList.remove('seleccionada', 'preview');
            }

            if (isPreview) {
                estrella.classList.add('preview');
            }
        });
    }

    // Configurar atributos ARIA iniciales
    estrellasInput.setAttribute('aria-valuemin', '1');
    estrellasInput.setAttribute('aria-valuemax', '10');
    estrellasInput.setAttribute('aria-valuenow', '0');
    estrellasInput.setAttribute('aria-valuetext', 'Sin calificación');
}

function enviarComentario(productoId, usuario) {
    const form = document.getElementById('form-comentario');
    const formData = new FormData(form);

    const comentarioData = {
        producto_id: productoId,
        cliente_id: usuario.id,
        comentario_contenido: formData.get('comentario') || '',
        comentario_calificacion: parseFloat(formData.get('calificacion')) || 1
    };

    fetch('../BackEnd/comentarios.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData)
    })
        .then(response => response.json())
        .then(async data => {
            if (data.success) {
                alert('¡Comentario publicado exitosamente!');
                form.reset();
                // Resetear estrellas
                const calificacionTexto = document.getElementById('calificacion-texto');
                calificacionTexto.textContent = 'Selecciona una calificación';
                // Recargar comentarios y actualizar promedio
                await cargarComentarios(productoId);
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al publicar el comentario');
        });
}

function configurarModalComentarios(productoId) {
    const btnAbrirModal = document.getElementById('btn-abrir-comentarios');
    const modalComentarios = document.getElementById('modal-comentarios');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal-comentarios');
    const btnCancelar = document.getElementById('btn-cancelar-comentario');
    const formModal = document.getElementById('form-comentario-modal');
    const loginPrompt = document.getElementById('login-prompt-modal');
    const formComentario = document.getElementById('form-comentario-modal');

    // Verificar si el usuario está logueado
    fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php', {
        method: 'GET',
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(data => {
            if (data.logged_in && data.user) {
                // Usuario logueado - mostrar formulario
                loginPrompt.style.display = 'none';
                formComentario.style.display = 'block';
            } else {
                // Usuario no logueado - mostrar prompt de login
                loginPrompt.style.display = 'block';
                formComentario.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error verificando sesión:', error);
            loginPrompt.style.display = 'block';
            formComentario.style.display = 'none';
        });

    // Event listeners para el modal
    btnAbrirModal.addEventListener('click', () => {
        modalComentarios.classList.add('active');
        configurarEstrellasModal();

        // Enfocar el primer elemento del formulario si está disponible
        setTimeout(() => {
            const firstEstrella = document.querySelector('#estrellas-input-modal .estrella');
            if (firstEstrella) {
                firstEstrella.focus();
            }
        }, 100);
    });

    btnCerrarModal.addEventListener('click', () => {
        modalComentarios.classList.remove('active');
        resetModalForm();
    });

    btnCancelar.addEventListener('click', () => {
        modalComentarios.classList.remove('active');
        resetModalForm();
    });

    // Cerrar modal al hacer click fuera
    modalComentarios.addEventListener('click', (e) => {
        if (e.target === modalComentarios) {
            modalComentarios.classList.remove('active');
            resetModalForm();
        }
    });

    // Enviar formulario del modal
    formModal.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarComentarioModal(productoId);
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalComentarios.classList.contains('active')) {
            modalComentarios.classList.remove('active');
            resetModalForm();
        }
    });
}

function configurarEstrellasModal() {
    const estrellasInput = document.getElementById('estrellas-input-modal');
    const calificacionHidden = document.getElementById('calificacion-modal');
    const calificacionTexto = document.getElementById('calificacion-texto-modal');
    const estrellas = estrellasInput.querySelectorAll('.estrella');

    let calificacionSeleccionada = 0;

    // Configurar navegación por teclado
    estrellas.forEach((estrella, index) => {
        const valor = index + 1;

        // Click para seleccionar
        estrella.addEventListener('click', () => {
            seleccionarCalificacionModal(valor);
        });

        // Navegación por teclado
        estrella.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                seleccionarCalificacionModal(valor);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                const siguienteIndex = (index + 1) % estrellas.length;
                estrellas[siguienteIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                const anteriorIndex = (index - 1 + estrellas.length) % estrellas.length;
                estrellas[anteriorIndex].focus();
            }
        });

        // Hover para preview visual
        estrella.addEventListener('mouseenter', () => {
            if (calificacionSeleccionada === 0) {
                actualizarEstrellasModal(valor, true);
                calificacionTexto.textContent = `${valor} estrella${valor !== 1 ? 's' : ''}`;
            }
        });

        estrella.addEventListener('mouseleave', () => {
            if (calificacionSeleccionada === 0) {
                actualizarEstrellasModal(0, true);
                calificacionTexto.textContent = 'Selecciona una calificación';
            }
        });
    });

    function seleccionarCalificacionModal(valor) {
        calificacionSeleccionada = valor;
        calificacionHidden.value = valor;
        calificacionTexto.textContent = `Calificación: ${valor} estrella${valor !== 1 ? 's' : ''}`;
        actualizarEstrellasModal(valor, false);

        // Anunciar a lectores de pantalla
        estrellasInput.setAttribute('aria-valuenow', valor);
        estrellasInput.setAttribute('aria-valuetext', `${valor} estrella${valor !== 1 ? 's' : ''}`);
    }

    function actualizarEstrellasModal(calificacion, isPreview = false) {
        estrellas.forEach((estrella, index) => {
            const valor = index + 1;

            if (calificacion >= valor) {
                estrella.textContent = '★';
                estrella.classList.add('seleccionada');
                estrella.classList.remove('preview');
            } else {
                estrella.textContent = '☆';
                estrella.classList.remove('seleccionada', 'preview');
            }

            if (isPreview) {
                estrella.classList.add('preview');
            }
        });
    }

    estrellasInput.setAttribute('aria-valuemin', '1');
    estrellasInput.setAttribute('aria-valuemax', '10');
    estrellasInput.setAttribute('aria-valuenow', '0');
    estrellasInput.setAttribute('aria-valuetext', 'Sin calificación');
}

function resetModalForm() {
    const form = document.getElementById('form-comentario-modal');
    const calificacionTexto = document.getElementById('calificacion-texto-modal');
    const estrellas = document.querySelectorAll('#estrellas-input-modal .estrella');

    // Resetear formulario
    form.reset();

    // Resetear estrellas
    estrellas.forEach(estrella => {
        estrella.textContent = '☆';
        estrella.classList.remove('seleccionada', 'preview');
    });

    // Resetear texto de calificación
    calificacionTexto.textContent = 'Selecciona una calificación';

    // Resetear ARIA
    const estrellasInput = document.getElementById('estrellas-input-modal');
    estrellasInput.setAttribute('aria-valuenow', '0');
    estrellasInput.setAttribute('aria-valuetext', 'Sin calificación');
}

function enviarComentarioModal(productoId) {
    const form = document.getElementById('form-comentario-modal');
    const formData = new FormData(form);

    // Verificar que se haya seleccionado una calificación
    const calificacion = parseFloat(formData.get('calificacion'));
    if (!calificacion || calificacion < 1 || calificacion > 10) {
        alert('Por favor selecciona una calificación antes de enviar el comentario.');
        return;
    }

    // Obtener información del usuario actual
    fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php', {
        method: 'GET',
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in || !data.user) {
                alert('Debes iniciar sesión para comentar.');
                return;
            }

            const comentarioData = {
                producto_id: productoId,
                cliente_id: data.user.id,
                comentario_contenido: formData.get('comentario') || '',
                comentario_calificacion: calificacion
            };

            return fetch('../BackEnd/comentarios.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(comentarioData)
            });
        })
        .then(response => response ? response.json() : null)
        .then(data => {
            if (data && data.success) {
                alert('¡Comentario publicado exitosamente!');
                // Cerrar modal y resetear
                const modal = document.getElementById('modal-comentarios');
                modal.classList.remove('active');
                resetModalForm();
                // Recargar comentarios
                cargarComentarios(productoId);
            } else if (data) {
                alert('Error: ' + (data.error || 'Error desconocido'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al publicar el comentario');
        });
}

function editarComentario(comentarioId, contenidoActual, calificacionActual) {
    const comentarioItem = document.querySelector(`[data-comentario-id="${comentarioId}"]`);
    const comentarioContenido = comentarioItem.querySelector('.comentario-contenido');
    const comentarioAcciones = comentarioItem.querySelector('.comentario-acciones');

    const formEdicion = document.createElement('div');
    formEdicion.className = 'form-edicion-comentario';
    formEdicion.innerHTML = `
        <div class="form-group">
            <label>Calificación:</label>
            <div class="estrellas-input-edicion" id="estrellas-editar-${comentarioId}" role="radiogroup" aria-label="Calificación del producto">
                <span class="estrella" data-value="1" role="radio" aria-label="1 estrella" tabindex="0">★</span>
                <span class="estrella" data-value="2" role="radio" aria-label="2 estrellas" tabindex="0">★</span>
                <span class="estrella" data-value="3" role="radio" aria-label="3 estrellas" tabindex="0">★</span>
                <span class="estrella" data-value="4" role="radio" aria-label="4 estrellas" tabindex="0">★</span>
                <span class="estrella" data-value="5" role="radio" aria-label="5 estrellas" tabindex="0">★</span>
                <span class="estrella" data-value="6" role="radio" aria-label="6 estrellas" tabindex="0">★</span>
                <span class="estrella" data-value="7" role="radio" aria-label="7 estrellas" tabindex="0">★</span>
                <span class="estrella" data-value="8" role="radio" aria-label="8 estrellas" tabindex="0">★</span>
                <span class="estrella" data-value="9" role="radio" aria-label="9 estrellas" tabindex="0">★</span>
                <span class="estrella" data-value="10" role="radio" aria-label="10 estrellas" tabindex="0">★</span>
            </div>
            <input type="hidden" id="calificacion-editar-${comentarioId}" value="${calificacionActual}">
            <div class="calificacion-texto">Calificación actual: ${calificacionActual}</div>
        </div>
        <div class="form-group">
            <label>Comentario:</label>
            <textarea class="comentario-editar" rows="3" maxlength="250">${contenidoActual || ''}</textarea>
        </div>
        <div class="botones-edicion">
            <button class="btn-guardar" onclick="guardarComentario(${comentarioId})">Guardar</button>
            <button class="btn-cancelar" onclick="cancelarEdicion(${comentarioId}, '${contenidoActual || ''}', ${calificacionActual})">Cancelar</button>
        </div>
    `;

    if (comentarioContenido) {
        comentarioContenido.style.display = 'none';
    }
    comentarioAcciones.style.display = 'none';

    const comentarioHeader = comentarioItem.querySelector('.comentario-header');
    comentarioHeader.insertAdjacentElement('afterend', formEdicion);

    configurarEstrellasEdicion(comentarioId, calificacionActual);
}

function configurarEstrellasEdicion(comentarioId, calificacionActual) {
    const estrellasInput = document.getElementById(`estrellas-editar-${comentarioId}`);
    const calificacionHidden = document.getElementById(`calificacion-editar-${comentarioId}`);
    const calificacionTexto = estrellasInput.parentNode.querySelector('.calificacion-texto');
    const estrellas = estrellasInput.querySelectorAll('.estrella');

    let hoverPreview = 0;

    actualizarEstrellasEdicion(calificacionActual);

    estrellas.forEach((estrella, index) => {
        const valor = index + 1;

        estrella.addEventListener('click', () => {
            calificacionActual = valor;
            calificacionHidden.value = valor;
            calificacionTexto.textContent = `Nueva calificación: ${valor} estrella${valor !== 1 ? 's' : ''}`;
            actualizarEstrellasEdicion(valor);
            hoverPreview = 0;
        });

        estrella.addEventListener('mouseenter', () => {
            hoverPreview = valor;
            actualizarEstrellasEdicion(valor, true);
            calificacionTexto.textContent = `Preview: ${valor} estrella${valor !== 1 ? 's' : ''}`;
        });

        estrella.addEventListener('mouseleave', () => {
            hoverPreview = 0;
            actualizarEstrellasEdicion(calificacionActual, true);
            calificacionTexto.textContent = `Calificación actual: ${calificacionActual}`;
        });
    });

    function actualizarEstrellasEdicion(calificacion, isPreview = false) {
        estrellas.forEach((estrella, index) => {
            const valor = index + 1;

            if (calificacion >= valor) {
                estrella.textContent = '★';
                estrella.classList.add('seleccionada');
            } else {
                estrella.textContent = '☆';
                estrella.classList.remove('seleccionada');
            }

            if (isPreview) {
                estrella.classList.add('preview');
            } else {
                estrella.classList.remove('preview');
            }
        });
    }
}

function cancelarEdicion(comentarioId, contenidoOriginal, calificacionOriginal) {
    const comentarioItem = document.querySelector(`[data-comentario-id="${comentarioId}"]`);
    const formEdicion = comentarioItem.querySelector('.form-edicion-comentario');

    if (formEdicion) {
        formEdicion.remove();
    }
    const comentarioContenido = comentarioItem.querySelector('.comentario-contenido');
    const comentarioAcciones = comentarioItem.querySelector('.comentario-acciones');

    if (comentarioContenido) {
        comentarioContenido.style.display = 'block';
    }
    if (comentarioAcciones) {
        comentarioAcciones.style.display = 'block';
    }
}

function guardarComentario(comentarioId) {
    const comentarioItem = document.querySelector(`[data-comentario-id="${comentarioId}"]`);
    const nuevoContenido = comentarioItem.querySelector('.comentario-editar').value;
    const nuevaCalificacion = parseFloat(document.getElementById(`calificacion-editar-${comentarioId}`).value);

    // Obtener información del usuario actual
    const usuarioAutenticado = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (!usuarioAutenticado) {
        alert('Debes iniciar sesión para editar comentarios');
        return;
    }

    const usuario = JSON.parse(usuarioAutenticado);

    const comentarioData = {
        comentario_id: comentarioId,
        cliente_id: usuario.id,
        comentario_contenido: nuevoContenido,
        comentario_calificacion: nuevaCalificacion
    };

    fetch('../BackEnd/actualizar_comentario.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData)
    })
        .then(response => response.json())
        .then(async data => {
            if (data.success) {
                alert('¡Comentario actualizado exitosamente!');
                const urlParams = new URLSearchParams(window.location.search);
                const productoId = urlParams.get('id');
                await cargarComentarios(productoId);
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el comentario');
        });
}

async function eliminarComentario(comentarioId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.')) {
        return;
    }
    const response = await fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php', {
        method: 'GET',
        credentials: 'same-origin'
    });
    const sessionData = await response.json();

    if (sessionData.logged_in && sessionData.user) {
        usuarioActual = sessionData.user;
    }
    if (!usuarioActual) {
        alert('Debes iniciar sesión para eliminar comentarios');
        return;
    }

    const comentarioData = {
        comentario_id: comentarioId,
        cliente_id: usuarioActual.id
    };

    fetch('../BackEnd/eliminar_comentario.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData)
    })
        .then(response => response.json())
        .then(async data => {
            if (data.success) {
                alert('¡Comentario eliminado exitosamente!');
                // Recargar comentarios para ver los cambios
                const urlParams = new URLSearchParams(window.location.search);
                const productoId = urlParams.get('id');
                await cargarComentarios(productoId);
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar el comentario');
        });
}
