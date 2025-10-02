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
                contenedor.appendChild(titulo);

                const divCategoria = document.createElement('div');
                divCategoria.style.display = 'flex';
                divCategoria.style.flexWrap = 'wrap';
                divCategoria.style.gap = '10px';

                categorias[cat].forEach(producto => {
                    const div = document.createElement('div');
                    div.className = 'producto-item';
                    div.style.border = '1px solid #ccc';
                    div.style.margin = '10px 0';
                    div.style.padding = '10px';
                    div.style.cursor = 'pointer';
                    div.style.width = 'fit-content';
                    div.innerHTML = `
                        <strong>${producto.producto_nombre}</strong><br>
                        <span>Precio: $${producto.producto_precio}</span>
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
                    <li><strong>Nombre:</strong> ${producto.producto_nombre}</li>
                    <li><strong>Precio:</strong> $${producto.producto_precio}</li>
                    <li><strong>Tiempo de preparación:</strong> ${producto.producto_tiempo_preparacion}</li>
                    <li><strong>Categoría:</strong> ${producto.producto_categoria}</li>
                </ul>
            `;
        })
        .catch(() => {
            document.getElementById('detalle-producto').textContent = 'Error al cargar el producto.';
        });
}