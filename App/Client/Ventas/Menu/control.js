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
                    div.innerHTML = `
                        <strong class="producto-nombre">${producto.producto_nombre}</strong><br>
                        <span class="producto-precio">$${producto.producto_precio}</span>
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
            cont.innerHTML = `
                <ul>
                    <li><strong class="producto-nombre">Nombre:</strong> ${producto.producto_nombre}</li>
                    <li><strong class="producto-precio">Precio:</strong> $${producto.producto_precio}</li>
                    <li><strong>Tiempo de preparación:</strong> ${producto.producto_tiempo_preparacion}</li>
                    <li><strong>Categoría:</strong> ${producto.producto_categoria}</li>
                </ul>
            `;
        })
        .catch(() => {
            document.getElementById('detalle-producto').textContent = 'Error al cargar el producto.';
        });
}