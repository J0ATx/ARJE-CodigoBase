const RATING = {
    MIN: 1,
    MAX: 5,
    STAR: '★',
    EMPTY: '☆',
    
    getStars: function(rating) {
        if (!rating) return this.EMPTY.repeat(this.MAX);
        const stars = Math.min(this.MAX, Math.max(this.MIN, Math.round(rating)));
        return this.STAR.repeat(stars) + this.EMPTY.repeat(this.MAX - stars);
    },
    
    format: function(rating) {
        return rating ? `${Math.round(rating)}/${this.MAX}` : '';
    },
    
    isValid: function(rating) {
        const num = Number(rating);
        return !isNaN(num) && num >= this.MIN && num <= this.MAX;
    }
};

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
                                ${RATING.getStars(producto.producto_calificacion)}
                            </div>
                            <span class="calificacion-numero">${RATING.format(producto.producto_calificacion)}</span>
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

        cargarComentarios(producto.producto_id);

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
                        <span class="estrellas">${RATING.getStars(comentario.comentario_calificacion)}</span>
                        <span class="calificacion-numero">${RATING.format(comentario.comentario_calificacion)}</span>
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
                            ${esGerenteGeneral ? 'Destruir' : 'Eliminar'}
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
            promedioSpan.textContent = `${parseInt(producto.producto_calificacion)}/5`;
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

    const form = document.getElementById('form-comentario');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarComentario(productoId, data.user);
    });
}

function configurarEstrellas() {
    const estrellasInput = document.getElementById('estrellas-input-modal');
    console.log(estrellasInput)
    const calificacionHidden = document.getElementById('calificacion');
    const calificacionTexto = document.getElementById('calificacion-texto');
    const estrellas = estrellasInput.querySelectorAll('.estrella');
    let calificacionSeleccionada = 0;


    estrellasInput.setAttribute('aria-valuemin', '1');
    estrellasInput.setAttribute('aria-valuemax', '5');
    estrellasInput.setAttribute('aria-valuenow', '0');
    estrellasInput.setAttribute('aria-valuetext', 'Sin calificación');

    function actualizarEstrellas(valor, esHover = false) {
        estrellas.forEach((estrella, index) => {
            const valorEstrella = parseInt(estrella.getAttribute('data-value'));
            if (valorEstrella <= valor) {
                estrella.textContent = '★';
                if (!esHover) {
                    estrella.classList.add('seleccionada');
                    estrella.setAttribute('aria-checked', 'true');
                } else {
                    estrella.classList.add('preview');
                }
            } else {
                estrella.textContent = '☆';
                if (!esHover) {
                    estrella.classList.remove('seleccionada');
                    estrella.setAttribute('aria-checked', 'false');
                } else {
                    estrella.classList.remove('preview');
                }
            }
        });

        if (!esHover && valor > 0) {
            calificacionSeleccionada = valor;
            calificacionHidden.value = valor;
            calificacionTexto.textContent = `Calificación: ${valor}/5`;
            estrellasInput.setAttribute('aria-valuenow', valor.toString());
            estrellasInput.setAttribute('aria-valuetext', `${valor} de 5`);
        } else if (valor === 0) {
            calificacionTexto.textContent = 'Selecciona una calificación';
            estrellasInput.setAttribute('aria-valuenow', '0');
            estrellasInput.setAttribute('aria-valuetext', 'Sin calificación');
        }
    }

    estrellas.forEach((estrella, index) => {
        const valor = index + 1;

        estrella.addEventListener('click', () => {
            actualizarEstrellas(valor);
        });

        estrella.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                actualizarEstrellas(valor);
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
                const calificacionTexto = document.getElementById('calificacion-texto');
                calificacionTexto.textContent = 'Selecciona una calificación';
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

    fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php', {
        method: 'GET',
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(data => {
            if (data.logged_in && data.user) {
                loginPrompt.style.display = 'none';
                formComentario.style.display = 'block';
            } else {
                loginPrompt.style.display = 'block';
                formComentario.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error verificando sesión:', error);
            loginPrompt.style.display = 'block';
            formComentario.style.display = 'none';
        });

    btnAbrirModal.addEventListener('click', () => {
        modalComentarios.classList.add('active');
        configurarEstrellasModal();

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

    modalComentarios.addEventListener('click', (e) => {
        if (e.target === modalComentarios) {
            modalComentarios.classList.remove('active');
            resetModalForm();
        }
    });

    formModal.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarComentarioModal(productoId);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalComentarios.classList.contains('active')) {
            modalComentarios.classList.remove('active');
            resetModalForm();
        }
    });
}

function configurarEstrellasModal() {
    const container = document.getElementById('estrellas-input-modal');
    const stars = Array.from(container.querySelectorAll('.estrella'));
    const ratingInput = document.getElementById('calificacion-modal');
    const ratingText = document.getElementById('calificacion-texto-modal');
    
    let selectedRating = 0;
    let hoverRating = 0;

    const updateStars = () => {
        const displayRating = hoverRating || selectedRating;
        
        stars.forEach((star, index) => {
            const starValue = index + 1;
            star.textContent = starValue <= displayRating ? RATING.STAR : RATING.EMPTY;
            star.classList.toggle('seleccionada', starValue <= selectedRating);
            star.classList.toggle('preview', hoverRating > 0 && starValue <= hoverRating);
        });

        if (selectedRating > 0) {
            ratingText.textContent = `Calificación: ${selectedRating} estrella${selectedRating !== 1 ? 's' : ''}`;
        } else if (hoverRating > 0) {
            ratingText.textContent = `${hoverRating} estrella${hoverRating !== 1 ? 's' : ''}`;
        } else {
            ratingText.textContent = 'Selecciona una calificación';
        }

        container.setAttribute('aria-valuenow', selectedRating);
        container.setAttribute('aria-valuetext', 
            selectedRating ? `${selectedRating} estrella${selectedRating !== 1 ? 's' : ''}` : 'Sin calificación'
        );
    };

    stars.forEach((star, index) => {
        const starValue = index + 1;
        
        star.addEventListener('click', () => {
            selectedRating = selectedRating === starValue ? 0 : starValue;
            ratingInput.value = selectedRating;
            updateStars();
        });

        star.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectedRating = selectedRating === starValue ? 0 : starValue;
                ratingInput.value = selectedRating;
                updateStars();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                const nextIndex = (index + 1) % stars.length;
                stars[nextIndex].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                const prevIndex = (index - 1 + stars.length) % stars.length;
                stars[prevIndex].focus();
            }
        });

        star.addEventListener('mouseenter', () => {
            hoverRating = starValue;
            updateStars();
        });

        star.addEventListener('mouseleave', () => {
            hoverRating = 0;
            updateStars();
        });
    });

    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-label', 'Calificación del producto');
    updateStars();
}

function resetModalForm() {
    const form = document.getElementById('form-comentario-modal');
    const ratingText = document.getElementById('calificacion-texto-modal');
    const stars = document.querySelectorAll('#estrellas-input-modal .estrella');

    form.reset();

    stars.forEach(star => {
        star.textContent = RATING.EMPTY;
        star.classList.remove('seleccionada', 'preview');
    });

    ratingText.textContent = 'Selecciona una calificación';

    const container = document.getElementById('estrellas-input-modal');
    container.setAttribute('aria-valuenow', '0');
    container.setAttribute('aria-valuetext', 'Sin calificación');
}

function enviarComentarioModal(productoId) {
    const form = document.getElementById('form-comentario-modal');
    const formData = new FormData(form);

    const calificacion = parseFloat(formData.get('calificacion'));

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
                const modal = document.getElementById('modal-comentarios');
                modal.classList.remove('active');
                resetModalForm();
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

    const calificacionMostrada = parseInt(calificacionActual);
    
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
            </div>
            <input type="hidden" id="calificacion-editar-${comentarioId}" value="${calificacionActual}">
            <div class="calificacion-texto">Calificación actual: ${calificacionMostrada}/5</div>
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

    let calificacionMostrada = parseInt(calificacionActual);
    calificacionMostrada = Math.min(5, Math.max(1, calificacionMostrada));
    
    calificacionHidden.value = calificacionActual;
    
    calificacionTexto.textContent = `Calificación actual: ${calificacionMostrada}/5`;

    let hoverPreview = 0;

    actualizarEstrellasEdicion(calificacionMostrada);

    estrellas.forEach((estrella, index) => {
        const valor = index + 1;

        estrella.addEventListener('click', () => {
            calificacionMostrada = valor;
            calificacionActual = valor;
            calificacionHidden.value = calificacionActual;
            calificacionTexto.textContent = `Nueva calificación: ${valor}/5`;
            actualizarEstrellasEdicion(valor);
            hoverPreview = 0;
        });

        estrella.addEventListener('mouseenter', () => {
            hoverPreview = valor;
            actualizarEstrellasEdicion(valor, true);
            calificacionTexto.textContent = `${valor}/5 estrellas`;
        });

        estrella.addEventListener('mouseleave', () => {
            hoverPreview = 0;
            actualizarEstrellasEdicion(calificacionMostrada);
            calificacionTexto.textContent = `Calificación actual: ${calificacionMostrada}/5`;
        });
    });

    function actualizarEstrellasEdicion(calificacion, isPreview = false) {
        estrellas.forEach((estrella, index) => {
            const valor = index + 1;
            const estaSeleccionada = valor <= calificacion;
            const esPreview = isPreview && valor <= calificacion;

            estrella.textContent = estaSeleccionada ? '★' : '☆';
            
            if (isPreview) {
                if (esPreview) {
                    estrella.classList.add('preview');
                    estrella.classList.remove('seleccionada');
                } else {
                    estrella.classList.remove('preview');
                    estrella.classList.toggle('seleccionada', valor <= calificacionMostrada);
                }
            } else {
                estrella.classList.remove('preview');
                estrella.classList.toggle('seleccionada', estaSeleccionada);
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

async function guardarComentario(comentarioId) {
    const comentarioItem = document.querySelector(`[data-comentario-id="${comentarioId}"]`);
    const nuevoContenido = comentarioItem.querySelector('.comentario-editar').value;
    const nuevaCalificacion = parseFloat(document.getElementById(`calificacion-editar-${comentarioId}`).value);


    let usuarioActual = null;
    try {
        const response = await fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const sessionData = await response.json();

        if (sessionData.logged_in && sessionData.user) {
            usuarioActual = sessionData.user;
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
    }

    const comentarioData = {
        comentario_id: comentarioId,
        cliente_id: usuarioActual.id,
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
