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

document.addEventListener('DOMContentLoaded', () => {
    fetchProductos();
});

function fetchProductos() {
    fetch('../BackEnd/visualizar.php')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('menu-listado');
            contenedor.innerHTML = '';

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
                                    <span class="calificacion-numero">${parseFloat(producto.promedio_calificacion).toFixed(1)}/5</span>
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
