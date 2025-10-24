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
                        ${producto.producto_receta ? `<div class="receta"><h3>Receta:</h3><p>${producto.producto_receta.replace(/\n/g, '<br>')}</p></div>` : ''}
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
        })
        .catch(() => {
            document.getElementById('detalle-producto').textContent = 'Error al cargar el producto.';
        });
}