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
            html += '☆';
        } else {
            html += '☆';
        }
    }

    return html;
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('detalle.html')) {
        mostrarDetalleProducto();
    } else {
        fetchProductos();
    }
});

function fetchProductos() {
    fetch('../BackEnd/visualizar.php')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('menu-listado');
            contenedor.innerHTML = '';

            // Agrupar productos por categoría
            const categorias = {};
            data.forEach(producto => {
                const cat = producto.producto_categoria || 'Sin categoría';
                if (!categorias[cat]) categorias[cat] = [];
                categorias[cat].push(producto);
            });

            Object.keys(categorias).forEach(cat => {
                const titulo = document.createElement('h2');
                titulo.textContent = cat;
                titulo.className = 'categoria-titulo';
                contenedor.appendChild(titulo);

                const divCategoria = document.createElement('div');
                divCategoria.className = 'categoria-contenedor';

                categorias[cat].forEach(producto => {
                    const div = document.createElement('div');
                    div.className = 'producto-item';
                    
                    // Crear contenedor de imagen con imagen por defecto si no hay imagen
                    const defaultImage = '/ARJE-CodigoBase/App/Recursos/productos/logo.png'; // Ruta a una imagen por defecto
                    const imageUrl = producto.imagen_url || defaultImage;
                    
                    div.innerHTML = `
                        <div class="producto-imagen" style="background-image: url('${imageUrl}');"></div>
                        <div class="producto-info">
                            <strong class="producto-nombre">${producto.producto_nombre}</strong>
                            <span class="producto-precio">$${producto.producto_precio}</span>
                            ${producto.promedio_calificacion ? `
                                <div class="producto-calificacion">
                                    <div class="estrellas">
                                        ${getEstrellasCalificacion(producto.promedio_calificacion)}
                                    </div>
                                    <span class="calificacion-numero">${parseFloat(producto.promedio_calificacion).toFixed(1)}</span>
                                    ${producto.total_comentarios ? `<span class="total-comentarios">(${producto.total_comentarios} comentarios)</span>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    `;
                    div.onclick = () => {
                        window.location.href = `detalle.html?id=${producto.producto_id}`;
                    };
                    divCategoria.appendChild(div);
                });

                contenedor.appendChild(divCategoria);
            });
        })
        .catch(error => {
            console.error('Error fetching productos:', error);
        });
}

function mostrarDetalleProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        document.getElementById('detalle-producto').textContent = 'ID de producto no especificado.';
        return;
    }
    fetch(`../BackEnd/visualizar.php?id=${encodeURIComponent(id)}`)
        .then(res => res.json())
        .then(producto => {
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
                        ${producto.promedio_calificacion ? `
                            <div class="producto-calificacion">
                                <h3>Calificación</h3>
                                <div class="estrellas">
                                    ${getEstrellasCalificacion(producto.promedio_calificacion)}
                                </div>
                                <span class="calificacion-numero">${parseFloat(producto.promedio_calificacion).toFixed(1)}/10</span>
                                ${producto.total_comentarios ? `<span class="total-comentarios">(${producto.total_comentarios} comentarios)</span>` : ''}
                            </div>
                        ` : ''}
                        ${producto.producto_receta ? `<div class="receta"><h3>Receta:</h3><p>${producto.producto_receta.replace(/\n/g, '<br>')}</p></div>` : ''}
                    </div>
                </div>
                <div class="comentarios-seccion">
                    <h3>Comentarios y Reseñas</h3>
                    <div id="formulario-comentario" class="formulario-comentario">
                        <!-- El formulario se cargará dinámicamente si el usuario está autenticado -->
                    </div>
                    <div id="lista-comentarios" class="lista-comentarios">
                        <!-- Los comentarios se cargarán aquí -->
                    </div>
                </div>
                <style>
                    .detalle-contenedor {
                        display: flex;
                        gap: 2rem;
                        max-width: 900px;
                        margin: 0 auto;
                    }
                    .detalle-imagen {
                        width: 300px;
                        height: 300px;
                        background-size: cover;
                        background-position: center;
                        border-radius: 8px;
                        flex-shrink: 0;
                    }
                    .detalle-info {
                        flex-grow: 1;
                    }
                    .precio {
                        font-size: 1.5rem;
                        color: #d32f2f;
                        font-weight: bold;
                        margin: 1rem 0;
                    }
                    .receta {
                        margin-top: 2rem;
                        padding-top: 1rem;
                        border-top: 1px solid #eee;
                    }
                    @media (max-width: 768px) {
                        .detalle-contenedor {
                            flex-direction: column;
                        }
                        .detalle-imagen {
                            width: 100%;
                            height: 250px;
                        }
                    }
                </style>
            `;

            // Cargar comentarios y formulario después de mostrar el producto
            cargarComentarios(producto.producto_id);
            mostrarFormularioComentario(producto.producto_id);
        })
        .catch(() => {
            document.getElementById('detalle-producto').textContent = 'Error al cargar el producto.';
        });
}

function cargarComentarios(productoId) {
    fetch(`../BackEnd/obtener_comentarios.php?producto_id=${productoId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarComentarios(data.comentarios);
                if (data.producto) {
                    actualizarPromedio(data.producto);
                }
            }
        })
        .catch(error => {
            console.error('Error cargando comentarios:', error);
        });
}

function mostrarComentarios(comentarios) {
    const contenedor = document.getElementById('lista-comentarios');
    if (!contenedor) return;

    if (comentarios.length === 0) {
        contenedor.innerHTML = '<p class="sin-comentarios">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
        return;
    }

    const comentariosHTML = comentarios.map(comentario => `
        <div class="comentario-item">
            <div class="comentario-header">
                <strong>${comentario.cliente_nombre} ${comentario.cliente_apellido}</strong>
                <div class="comentario-calificacion">
                    <span class="estrellas">${getEstrellasCalificacion(comentario.comentario_calificacion)}</span>
                    <span class="calificacion-numero">${comentario.comentario_calificacion}/10</span>
                </div>
            </div>
            ${comentario.comentario_contenido ? `<p class="comentario-contenido">${comentario.comentario_contenido}</p>` : ''}
        </div>
    `).join('');

    contenedor.innerHTML = comentariosHTML;
}

function actualizarPromedio(producto) {
    const calificacionDiv = document.querySelector('.producto-calificacion');
    if (calificacionDiv && producto.promedio_calificacion) {
        const promedioSpan = calificacionDiv.querySelector('.calificacion-numero');
        const comentariosSpan = calificacionDiv.querySelector('.total-comentarios');

        if (promedioSpan) {
            promedioSpan.textContent = `${parseFloat(producto.promedio_calificacion).toFixed(1)}/10`;
        }
        if (comentariosSpan) {
            comentariosSpan.textContent = `(${producto.total_comentarios} comentarios)`;
        }
    }
}

function mostrarFormularioComentario(productoId) {
    const contenedor = document.getElementById('formulario-comentario');
    if (!contenedor) return;

    // Verificar si el usuario está autenticado (esto es un ejemplo simplificado)
    // En una implementación real, deberías verificar la sesión del usuario
    const usuarioAutenticado = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');

    if (!usuarioAutenticado) {
        contenedor.innerHTML = `
            <div class="login-prompt">
                <p>Debes <a href="#" onclick="mostrarLogin()">iniciar sesión</a> para comentar.</p>
            </div>
        `;
        return;
    }

    const usuario = JSON.parse(usuarioAutenticado);

    contenedor.innerHTML = `
        <form id="form-comentario" class="form-comentario">
            <div class="form-group">
                <label for="calificacion">Calificación:</label>
                <select id="calificacion" name="calificacion" required>
                    <option value="">Seleccionar calificación</option>
                    <option value="10">10 - Excelente</option>
                    <option value="9">9 - Muy Bueno</option>
                    <option value="8">8 - Bueno</option>
                    <option value="7">7 - Regular</option>
                    <option value="6">6 - Aceptable</option>
                    <option value="5">5 - Normal</option>
                    <option value="4">4 - Por debajo del promedio</option>
                    <option value="3">3 - Malo</option>
                    <option value="2">2 - Muy Malo</option>
                    <option value="1">1 - Pésimo</option>
                </select>
            </div>
            <div class="form-group">
                <label for="comentario">Comentario (opcional):</label>
                <textarea id="comentario" name="comentario" rows="3" maxlength="250"
                          placeholder="Comparte tu experiencia con este producto..."></textarea>
            </div>
            <button type="submit" class="btn-comentar">Publicar Comentario</button>
        </form>
    `;

    // Agregar event listener al formulario
    const form = document.getElementById('form-comentario');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarComentario(productoId, usuario);
    });
}

function enviarComentario(productoId, usuario) {
    const form = document.getElementById('form-comentario');
    const formData = new FormData(form);

    const comentarioData = {
        producto_id: productoId,
        cliente_id: usuario.email || usuario.usuario_id,
        comentario_contenido: formData.get('comentario') || '',
        comentario_calificacion: parseInt(formData.get('calificacion'))
    };

    fetch('../BackEnd/comentarios.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('¡Comentario publicado exitosamente!');
            form.reset();
            // Recargar comentarios y actualizar promedio
            cargarComentarios(productoId);
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