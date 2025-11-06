const RATING = {
    MIN: 1,
    MAX: 5,
    STAR_FILLED: '★',
    STAR_EMPTY: '☆'
};

function getStarRating(calificacion) {
    if (!calificacion) return '';
    const normalizedRating = Math.min(RATING.MAX, Math.max(RATING.MIN, Math.round(parseFloat(calificacion))));
    return RATING.STAR_FILLED.repeat(normalizedRating) +
        RATING.STAR_EMPTY.repeat(RATING.MAX - normalizedRating);
}

function getRatingText(calificacion) {
    if (!calificacion) return '';
    return `${Math.round(parseFloat(calificacion))}/${RATING.MAX}`;
}

function validateRating(calificacion) {
    const rating = parseFloat(calificacion);
    return !isNaN(rating) && rating >= RATING.MIN && rating <= RATING.MAX;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProductos();
    configurarEventListeners();
    configurarBotonDescarga();
});

function configurarEventListeners() {
    const inputBusqueda = document.getElementById('busqueda-texto');
    const btnLimpiar = document.getElementById('btn-limpiar-busqueda');
    const btnAbrirFiltros = document.getElementById('btn-abrir-filtros');
    const modalFiltros = document.getElementById('modal-filtros');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnLimpiarTodosModal = document.getElementById('btn-limpiar-todos-modal');
    const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');

    inputBusqueda.addEventListener('input', aplicarFiltros);
    btnLimpiar.addEventListener('click', () => {
        inputBusqueda.value = '';
        aplicarFiltros();
    });

    btnAbrirFiltros.addEventListener('click', abrirModalFiltros);
    btnCerrarModal.addEventListener('click', cerrarModalFiltros);
    btnLimpiarTodosModal.addEventListener('click', limpiarTodosFiltrosModal);
    btnAplicarFiltros.addEventListener('click', aplicarFiltrosModal);

    modalFiltros.addEventListener('click', (e) => {
        if (e.target === modalFiltros) {
            cerrarModalFiltros();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalFiltros.classList.contains('active')) {
            cerrarModalFiltros();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            inputBusqueda.focus();
            inputBusqueda.select();
        }

        if (e.key === 'Escape' && document.activeElement === inputBusqueda) {
            inputBusqueda.value = '';
            aplicarFiltros();
        }
    });
}

function limpiarTodosFiltros() {
    document.getElementById('busqueda-texto').value = '';
    document.getElementById('modal-filtro-categoria').value = '';
    document.getElementById('modal-filtro-precio').value = '';
    document.getElementById('modal-filtro-calificacion').value = '';
    document.getElementById('modal-ordenar').value = 'nombre';

    productosFiltrados = [...productosOriginales];
    mostrarProductos(productosFiltrados);
}

function abrirModalFiltros() {
    const modalFiltros = document.getElementById('modal-filtros');
    modalFiltros.classList.add('active');
}

function cerrarModalFiltros() {
    const modalFiltros = document.getElementById('modal-filtros');
    modalFiltros.classList.remove('active');
}

function limpiarTodosFiltrosModal() {
    limpiarTodosFiltros();
    cerrarModalFiltros();
}

function aplicarFiltrosModal() {
    aplicarFiltrosCompletos();
    cerrarModalFiltros();
}

let productosOriginales = [];
let productosFiltrados = [];

function configurarBotonDescarga() {
    const btnDescargar = document.getElementById('descargar-menu');
    if (btnDescargar) {
        btnDescargar.addEventListener('click', descargarMenuPDF);
    }
}

function descargarMenuPDF() {
    fetch('../BackEnd/descargar.php', {
        method: 'GET',
        headers: {
            'Accept': 'application/pdf'
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err.error);
                });
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `los3tanos_menu_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        })
        .catch(error => {
            console.error('Error al descargar el menú:', error);
        })
}

function fetchProductos() {
    fetch('../BackEnd/visualizar.php')
        .then(response => response.json())
        .then(data => {
            productosOriginales = data;
            productosFiltrados = [...data];
            inicializarFiltros();
            mostrarProductos(productosFiltrados);
        })
        .catch(error => {
            console.error('Error fetching productos:', error);
            document.getElementById('contador-resultados').textContent = 'Error al cargar productos';
        });
}

function inicializarFiltros() {
    const categorias = [...new Set(productosOriginales.map(p => p.producto_categoria).filter(Boolean))];
    const selectCategoria = document.getElementById('modal-filtro-categoria');

    categorias.sort().forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });
}

function aplicarFiltros() {
    const textoBusqueda = document.getElementById('busqueda-texto').value.toLowerCase().trim();

    if (textoBusqueda) {
        productosFiltrados = productosOriginales.filter(producto => {
            return producto.producto_nombre.toLowerCase().includes(textoBusqueda) ||
                (producto.producto_categoria && producto.producto_categoria.toLowerCase().includes(textoBusqueda)) ||
                (producto.producto_receta && producto.producto_receta.toLowerCase().includes(textoBusqueda));
        });
    } else {
        productosFiltrados = [...productosOriginales];
    }

    mostrarProductos(productosFiltrados);
}

function aplicarFiltrosCompletos() {
    const textoBusqueda = document.getElementById('busqueda-texto').value.toLowerCase().trim();
    const categoriaFiltro = document.getElementById('modal-filtro-categoria').value;
    const precioFiltro = parseFloat(document.getElementById('modal-filtro-precio').value) || '';
    const calificacionFiltro = parseFloat(document.getElementById('modal-filtro-calificacion').value) || '';
    const orden = document.getElementById('modal-ordenar').value;

    if (!textoBusqueda && !categoriaFiltro && !precioFiltro && !calificacionFiltro) {
        productosFiltrados = [...productosOriginales];
        ordenarProductos(orden);
        mostrarProductos(productosFiltrados);
        return;
    }

    const params = new URLSearchParams();
    if (textoBusqueda) params.append('busqueda', textoBusqueda);
    if (categoriaFiltro) params.append('categoria', categoriaFiltro);
    if (precioFiltro) params.append('precio_max', precioFiltro);
    if (calificacionFiltro) params.append('calificacion_min', calificacionFiltro);
    params.append('orden', orden);

    fetch(`../BackEnd/buscar.php?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            productosFiltrados = data;
            mostrarProductos(productosFiltrados);
        })
        .catch(error => {
            console.error('Error en búsqueda:', error);
            productosFiltrados = productosOriginales.filter(producto => {
                const coincideTexto = !textoBusqueda ||
                    producto.producto_nombre.toLowerCase().includes(textoBusqueda) ||
                    (producto.producto_categoria && producto.producto_categoria.toLowerCase().includes(textoBusqueda)) ||
                    (producto.producto_receta && producto.producto_receta.toLowerCase().includes(textoBusqueda));

                const coincideCategoria = !categoriaFiltro || producto.producto_categoria === categoriaFiltro;
                const precioProducto = parseFloat(producto.producto_precio) || 0;
                const coincidePrecio = !precioFiltro || precioProducto <= precioFiltro;
                const calificacionProducto = parseFloat(producto.producto_calificacion) || 0;
                const coincideCalificacion = !calificacionFiltro || calificacionProducto >= calificacionFiltro;

                return coincideTexto && coincideCategoria && coincidePrecio && coincideCalificacion;
            });

            ordenarProductos(orden);
            mostrarProductos(productosFiltrados);
        });
}

function ordenarProductos(criterio) {
    productosFiltrados.sort((a, b) => {
        switch (criterio) {
            case 'precio-asc':
                return (parseFloat(a.producto_precio) || 0) - (parseFloat(b.producto_precio) || 0);
            case 'precio-desc':
                return (parseFloat(b.producto_precio) || 0) - (parseFloat(a.producto_precio) || 0);
            case 'calificacion':
                return (parseFloat(b.producto_calificacion) || 0) - (parseFloat(a.producto_calificacion) || 0);
            case 'categoria':
                return (a.producto_categoria || '').localeCompare(b.producto_categoria || '');
            case 'nombre':
            default:
                return a.producto_nombre.localeCompare(b.producto_nombre);
        }
    });
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById('menu-listado');
    contenedor.innerHTML = '';

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-resultados">
                <p>No se encontraron productos que coincidan con los filtros seleccionados.</p>
                <p>Intenta ajustar los filtros o la búsqueda.</p>
            </div>
        `;
        return;
    }

    const categorias = {};
    const terminoBusqueda = document.getElementById('busqueda-texto').value.toLowerCase().trim();

    productos.forEach(producto => {
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

        categorias[cat].forEach((producto, index) => {
            const div = document.createElement('div');
            div.className = 'producto-item nuevo';
            div.dataset.productoId = producto.producto_id;
            div.style.animationDelay = `${index * 50}ms`;

            const defaultImage = '/App/Recursos/productos/logo.png';
            const imageUrl = producto.imagen_url || defaultImage;

            div.innerHTML = `
                <div class="producto-header">
                    <img class="producto-imagen" src="${imageUrl}" alt="${producto.producto_nombre}">
                    <strong class="producto-nombre">${producto.producto_nombre}</strong>
                    <span class="producto-precio">$${producto.producto_precio}</span>
                </div>
                <div class="producto-info">
                    ${producto.producto_descripcion ? `<div class="producto-descripcion"><p>${producto.producto_descripcion.replace(/\n/g, '<br>')}</p></div>` : ''}
                    ${producto.producto_calificacion ? `
                        <div class="producto-calificacion">
                            <div class="estrellas-display">
                                ${getStarRating(producto.producto_calificacion)}
                            </div>
                            <span class="calificacion-numero">${getRatingText(producto.producto_calificacion)}</span>
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

    setTimeout(() => {
        document.querySelectorAll('.producto-item.nuevo').forEach(item => {
            item.classList.remove('nuevo');
        });
    }, 600);
}
