function getEstrellasCalificacion(calificacion) {
    if (!calificacion) return '';

    const calif = parseFloat(calificacion);
    const estrellasLlenas = Math.floor(calif);
    const mediaEstrella = calif % 1 >= 0.5;
    const estrellasTotales = 5;

    let html = '';

    for (let i = 0; i < estrellasTotales; i++) {
        if (i < estrellasLlenas) {
            html += '★';
        } else if (i === estrellasLlenas && mediaEstrella) {
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
                    ${producto.producto_tiempo_preparacion ? `<p><strong>Tiempo de preparación:</strong> ${producto.producto_tiempo_preparacion}</p>` : ''}
                    ${producto.producto_categoria ? `<p><strong>Categoría:</strong> ${producto.producto_categoria}</p>` : ''}
                    ${producto.producto_calificacion ? `
                        <div class="producto-calificacion">
                            <h3>Calificación</h3>
                            <div class="estrellas">
                                ${getEstrellasCalificacion(producto.producto_calificacion)}
                            </div>
                            <span class="calificacion-numero">${producto.producto_calificacion}/5</span>
                            ${producto.total_comentarios ? `<span class="total-comentarios">(${producto.total_comentarios} comentarios)</span>` : ''}
                        </div>
                    ` : ''}
                    ${producto.producto_receta ? `<div class="receta"><h3>Receta:</h3><p>${producto.producto_receta.replace(/\n/g, '<br>')}</p></div>` : ''}
                </div>
            </div>
            <div class="comentarios-seccion">
                <h3>Comentarios y Reseñas</h3>
                <div id="formulario-comentario" class="formulario-comentario">
                </div>
                <div id="lista-comentarios" class="lista-comentarios">
                </div>
            </div>
        `;

        // Cargar comentarios y formulario después de mostrar el producto
        cargarComentarios(producto.producto_id);
        await mostrarFormularioComentario(producto.producto_id);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('detalle-producto').textContent = 'Error al cargar el producto.';
    }
}

function cargarComentarios(productoId) {
    fetch(`../BackEnd/obtener_comentarios.php?producto_id=${productoId}`)
        .then(response => response.json())
        .then(async data => {
            console.log(data);
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
        contenedor.innerHTML = '<p class="sin-comentarios">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
        return;
    }

    // Obtener información del usuario actual desde la sesión
    let usuarioActual = null;

    try {
        const response = await fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const sessionData = await response.json();

        if (sessionData.logged_in && sessionData.user) {
            usuarioActual = sessionData.user;
            // También actualizar sessionStorage para mantener consistencia
            sessionStorage.setItem('usuario', JSON.stringify(sessionData.user));
        } else {
            // Si no hay sesión, verificar localStorage como respaldo
            const usuarioAutenticado = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
            if (usuarioAutenticado) {
                usuarioActual = JSON.parse(usuarioAutenticado);
            }
        }
    } catch (error) {
        console.error('Error verificando sesión:', error);
        // Fallback a localStorage/sessionStorage
        const usuarioAutenticado = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
        if (usuarioAutenticado) {
            try {
                usuarioActual = JSON.parse(usuarioAutenticado);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }

    const comentariosHTML = comentarios.map(comentario => {
        const esComentarioPropio = usuarioActual && usuarioActual.id === comentario.cliente_id;
        const esGerenteGeneral = usuarioActual && usuarioActual.rol === 'Gerente-General';
        const puedeEliminar = esComentarioPropio || esGerenteGeneral;

        return `
            <div class="comentario-item" data-comentario-id="${comentario.comentario_id}">
                <div class="comentario-header">
                    <strong>${comentario.cliente_nombre} ${comentario.cliente_apellido}</strong>
                    <div class="comentario-calificacion">
                        <span class="estrellas">${getEstrellasCalificacion(comentario.comentario_calificacion)}</span>
                        <span class="calificacion-numero">${parseFloat(comentario.comentario_calificacion).toFixed(1)}/5</span>
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
            promedioSpan.textContent = `${parseFloat(producto.producto_calificacion).toFixed(1)}/5`;
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
                <div class="estrellas-input" id="estrellas-input">
                    <span class="estrella" data-value="1">☆</span>
                    <span class="estrella" data-value="2">☆</span>
                    <span class="estrella" data-value="3">☆</span>
                    <span class="estrella" data-value="4">☆</span>
                    <span class="estrella" data-value="5">☆</span>
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
    let hoverPreview = 0;

    estrellas.forEach((estrella, index) => {
        // Click para seleccionar estrellas completas
        estrella.addEventListener('click', (e) => {
            const rect = estrella.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const isLeftHalf = clickX < rect.width / 2;

            if (calificacionSeleccionada === index + 1) {
                // Si ya está seleccionada, alternar entre completa y media
                if (isLeftHalf) {
                    calificacionSeleccionada = index + 0.5;
                    calificacionTexto.textContent = `${calificacionSeleccionada} estrella${calificacionSeleccionada !== 1 ? 's' : ''}`;
                } else {
                    calificacionSeleccionada = index + 1;
                    calificacionTexto.textContent = `${calificacionSeleccionada} estrella${calificacionSeleccionada !== 1 ? 's' : ''}`;
                }
            } else if (calificacionSeleccionada === index + 0.5) {
                // Si está en media, convertir a completa
                calificacionSeleccionada = index + 1;
                calificacionTexto.textContent = `${calificacionSeleccionada} estrella${calificacionSeleccionada !== 1 ? 's' : ''}`;
            } else {
                // Seleccionar nueva estrella
                calificacionSeleccionada = index + 1;
                calificacionTexto.textContent = `${calificacionSeleccionada} estrella${calificacionSeleccionada !== 1 ? 's' : ''}`;
            }

            actualizarEstrellas(calificacionSeleccionada);
            calificacionHidden.value = calificacionSeleccionada;
            hoverPreview = 0; // Limpiar preview después del click
        });

        // Hover para preview mejorado
        estrella.addEventListener('mouseenter', (e) => {
            const rect = estrella.getBoundingClientRect();
            const hoverX = e.clientX - rect.left;
            const isLeftHalf = hoverX < rect.width / 2;

            // Solo mostrar preview si no hay selección actual
            if (calificacionSeleccionada === 0) {
                hoverPreview = isLeftHalf ? index + 0.5 : index + 1;
                actualizarEstrellas(hoverPreview, true);
                calificacionTexto.textContent = `${hoverPreview} estrella${hoverPreview !== 1 ? 's' : ''}`;

                // Actualizar tooltip según la posición
                estrella.setAttribute('data-tooltip', `${hoverPreview} estrella${hoverPreview !== 1 ? 's' : ''}`);
            }
        });

        // Mouse leave para restaurar
        estrella.addEventListener('mouseleave', () => {
            if (calificacionSeleccionada === 0) {
                hoverPreview = 0;
                actualizarEstrellas(0, true);
                calificacionTexto.textContent = 'Selecciona una calificación';

                // Limpiar tooltip
                estrella.removeAttribute('data-tooltip');
            }
        });

        // Mousemove para actualizar preview en tiempo real
        estrella.addEventListener('mousemove', (e) => {
            if (calificacionSeleccionada === 0) {
                const rect = estrella.getBoundingClientRect();
                const hoverX = e.clientX - rect.left;
                const isLeftHalf = hoverX < rect.width / 2;
                const newPreview = isLeftHalf ? index + 0.5 : index + 1;

                if (newPreview !== hoverPreview) {
                    hoverPreview = newPreview;
                    actualizarEstrellas(hoverPreview, true);
                    calificacionTexto.textContent = `${hoverPreview} estrella${hoverPreview !== 1 ? 's' : ''}`;

                    // Actualizar tooltip en tiempo real
                    estrella.setAttribute('data-tooltip', `${hoverPreview} estrella${hoverPreview !== 1 ? 's' : ''}`);
                }
            }
        });
    });

    function actualizarEstrellas(calificacion, isPreview = false) {
        estrellas.forEach((estrella, index) => {
            const estrellaValue = index + 1;

            if (calificacion >= estrellaValue) {
                estrella.textContent = '★';
                estrella.classList.add('seleccionada');
                estrella.classList.remove('media');
            } else if (calificacion >= index + 0.5) {
                estrella.textContent = '★';
                estrella.classList.add('media');
                estrella.classList.remove('seleccionada');
            } else {
                estrella.textContent = '☆';
                estrella.classList.remove('seleccionada', 'media');
            }

            if (isPreview) {
                estrella.classList.add('preview');
            } else {
                estrella.classList.remove('preview');
            }
        });
    }
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

function mostrarLogin() {
    // Esta función debería redirigir al login o mostrar un modal de login
    alert('Redirigiendo al login...');
}

function editarComentario(comentarioId, contenidoActual, calificacionActual) {
    const comentarioItem = document.querySelector(`[data-comentario-id="${comentarioId}"]`);
    const comentarioContenido = comentarioItem.querySelector('.comentario-contenido');
    const comentarioAcciones = comentarioItem.querySelector('.comentario-acciones');

    // Crear formulario de edición
    const formEdicion = document.createElement('div');
    formEdicion.className = 'form-edicion-comentario';
    formEdicion.innerHTML = `
        <div class="form-group">
            <label>Calificación:</label>
            <div class="estrellas-input-edicion" id="estrellas-editar-${comentarioId}">
                <span class="estrella" data-value="1">★</span>
                <span class="estrella" data-value="2">★</span>
                <span class="estrella" data-value="3">★</span>
                <span class="estrella" data-value="4">★</span>
                <span class="estrella" data-value="5">★</span>
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

    // Reemplazar contenido y acciones con formulario de edición
    if (comentarioContenido) {
        comentarioContenido.style.display = 'none';
    }
    comentarioAcciones.style.display = 'none';

    // Insertar formulario después del header
    const comentarioHeader = comentarioItem.querySelector('.comentario-header');
    comentarioHeader.insertAdjacentElement('afterend', formEdicion);

    // Configurar estrellas para edición
    configurarEstrellasEdicion(comentarioId, calificacionActual);
}

function configurarEstrellasEdicion(comentarioId, calificacionActual) {
    const estrellasInput = document.getElementById(`estrellas-editar-${comentarioId}`);
    const calificacionHidden = document.getElementById(`calificacion-editar-${comentarioId}`);
    const calificacionTexto = estrellasInput.parentNode.querySelector('.calificacion-texto');
    const estrellas = estrellasInput.querySelectorAll('.estrella');

    let hoverPreview = 0;

    // Establecer estado inicial
    actualizarEstrellasEdicion(calificacionActual);

    estrellas.forEach((estrella, index) => {
        estrella.addEventListener('click', (e) => {
            const rect = estrella.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const isLeftHalf = clickX < rect.width / 2;

            let nuevaCalificacion;
            if (calificacionActual === index + 1) {
                // Si ya está seleccionada, alternar entre completa y media
                nuevaCalificacion = isLeftHalf ? index + 0.5 : index + 1;
            } else if (calificacionActual === index + 0.5) {
                // Si está en media, convertir a completa
                nuevaCalificacion = index + 1;
            } else {
                // Seleccionar nueva estrella
                nuevaCalificacion = index + 1;
            }

            calificacionActual = nuevaCalificacion;
            calificacionHidden.value = nuevaCalificacion;
            calificacionTexto.textContent = `Nueva calificación: ${nuevaCalificacion}`;
            actualizarEstrellasEdicion(nuevaCalificacion);
            hoverPreview = 0; // Limpiar preview después del click
        });

        // Hover para preview mejorado
        estrella.addEventListener('mouseenter', (e) => {
            const rect = estrella.getBoundingClientRect();
            const hoverX = e.clientX - rect.left;
            const isLeftHalf = hoverX < rect.width / 2;

            hoverPreview = isLeftHalf ? index + 0.5 : index + 1;
            actualizarEstrellasEdicion(hoverPreview, true);
            calificacionTexto.textContent = `Preview: ${hoverPreview} estrella${hoverPreview !== 1 ? 's' : ''}`;

            // Actualizar tooltip según la posición
            estrella.setAttribute('data-tooltip', `${hoverPreview} estrella${hoverPreview !== 1 ? 's' : ''}`);
        });

        // Mouse leave para restaurar
        estrella.addEventListener('mouseleave', () => {
            hoverPreview = 0;
            actualizarEstrellasEdicion(calificacionActual, true);
            calificacionTexto.textContent = `Calificación actual: ${calificacionActual}`;

            // Limpiar tooltip
            estrella.removeAttribute('data-tooltip');
        });

        // Mousemove para actualizar preview en tiempo real
        estrella.addEventListener('mousemove', (e) => {
            const rect = estrella.getBoundingClientRect();
            const hoverX = e.clientX - rect.left;
            const isLeftHalf = hoverX < rect.width / 2;
            const newPreview = isLeftHalf ? index + 0.5 : index + 1;

            if (newPreview !== hoverPreview) {
                hoverPreview = newPreview;
                actualizarEstrellasEdicion(hoverPreview, true);
                calificacionTexto.textContent = `Preview: ${hoverPreview} estrella${hoverPreview !== 1 ? 's' : ''}`;

                // Actualizar tooltip en tiempo real
                estrella.setAttribute('data-tooltip', `${hoverPreview} estrella${hoverPreview !== 1 ? 's' : ''}`);
            }
        });
    });

    function actualizarEstrellasEdicion(calificacion, isPreview = false) {
        estrellas.forEach((estrella, index) => {
            const estrellaValue = index + 1;

            if (calificacion >= estrellaValue) {
                estrella.textContent = '★';
                estrella.classList.add('seleccionada');
                estrella.classList.remove('media');
            } else if (calificacion >= index + 0.5) {
                estrella.textContent = '★';
                estrella.classList.add('media');
                estrella.classList.remove('seleccionada');
            } else {
                estrella.textContent = '☆';
                estrella.classList.remove('seleccionada', 'media');
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

    // Remover formulario de edición
    if (formEdicion) {
        formEdicion.remove();
    }

    // Restaurar visibilidad del contenido y acciones
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
        alert('Error al actualizar el comentario');
    });
}

function eliminarComentario(comentarioId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.')) {
        return;
    }

    // Obtener información del usuario actual
    const usuarioAutenticado = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (!usuarioAutenticado) {
        alert('Debes iniciar sesión para eliminar comentarios');
        return;
    }

    const usuario = JSON.parse(usuarioAutenticado);

    const comentarioData = {
        comentario_id: comentarioId,
        cliente_id: usuario.id
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
