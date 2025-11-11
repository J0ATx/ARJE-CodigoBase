document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
});

function cargarDatos() {
    fetch('../Backend/visualizar.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        mostrarProductos(data.productosExistentes);
        mostrarPromociones(data.promociones);
    })
    .catch(error => console.error('Error al cargar datos:', error));
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById('productosContainer');
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos disponibles</p>';
        return;
    }

    let html = '<h2>Productos Existentes</h2>';
    html += '<div class="productos-grid">';
    
    productos.forEach(producto => {
        html += `
            <div class="producto-card">
                <h3>${producto.producto_nombre}</h3>
                <p><strong>Precio:</strong> $${producto.producto_precio}</p>
                <p><strong>Descripción:</strong> ${producto.producto_descripcion}</p>
                <p><strong>Categoría:</strong> ${producto.producto_categoria}</p>
            </div>
        `;
    });
    
    html += '</div>';
    contenedor.innerHTML = html;
}

function mostrarPromociones(promociones) {
    const contenedor = document.getElementById('promocionesContainer');
    if (!contenedor) return;

    if (promociones.length === 0) {
        contenedor.innerHTML = '<p>No hay promociones disponibles</p>';
        return;
    }

    let html = '<h2>Promociones Activas</h2>';
    html += '<div class="promociones-tabla">';
    html += `
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Promoción</th>
                    <th>Descripción</th>
                    <th>Descuento</th>
                    <th>Fidelizada</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    promociones.forEach(promo => {
        const fidelizada = promo.promocion_fidelizada ? 'Sí' : 'No';
        html += `
            <tr>
                <td>${promo.producto_nombre}</td>
                <td>${promo.promocion_nombre}</td>
                <td>${promo.promocion_descripcion}</td>
                <td>${promo.promocion_descuento}%</td>
                <td>${fidelizada}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    </div>
    `;
    
    contenedor.innerHTML = html;
}
