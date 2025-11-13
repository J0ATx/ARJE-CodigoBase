// Variables globales
let promocionesGlobal = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    setupEventListeners();
});

function setupEventListeners() {
    const btnCrear = document.getElementById('btnCrearPromocion');
    if (btnCrear) {
        btnCrear.addEventListener('click', abrirFormularioCrear);
    }
}

// Funciones de carga de datos
function cargarDatos() {
    mostrarCargando(true);
    
    fetch('../Backend/visualizar.php', {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (!data.success) {
            mostrarError('Error al cargar datos: ' + data.message);
            return;
        }

        promocionesGlobal = data.data.promociones || [];

        mostrarPromociones(promocionesGlobal);
        mostrarError(''); // Limpiar errores
    })
    .catch(error => {
        console.error('Error al cargar datos:', error);
        mostrarError('Error al cargar los datos: ' + error.message);
    })
    .finally(() => {
        mostrarCargando(false);
    });
}

function mostrarCargando(mostrar) {
    const cargando = document.getElementById('cargandoIndicador');
    if (cargando) {
        cargando.style.display = mostrar ? 'block' : 'none';
    }
}

function mostrarError(mensaje) {
    const contenedor = document.getElementById('mensajeError');
    if (!contenedor) return;

    if (mensaje) {
        contenedor.innerHTML = `
            <div class="alert alert-error">
                <button class="close-alert" onclick="this.parentElement.style.display='none';">&times;</button>
                ${mensaje}
            </div>
        `;
        contenedor.style.display = 'block';
    } else {
        contenedor.style.display = 'none';
    }
}

function mostrarExito(mensaje) {
    const contenedor = document.getElementById('mensajeError');
    if (!contenedor) return;

    if (mensaje) {
        contenedor.innerHTML = `
            <div class="alert alert-success">
                <button class="close-alert" onclick="this.parentElement.style.display='none';">&times;</button>
                ${mensaje}
            </div>
        `;
        contenedor.style.display = 'block';

        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            contenedor.style.display = 'none';
        }, 5000);
    }
}

// Mostrar productos
// El listado de productos fue removido del frontend. Si más adelante se vuelve a necesitar,
// reimplementar la función mostrarProductos y el contenedor correspondiente en el HTML.

// Mostrar promociones
function mostrarPromociones(promociones) {
    const contenedor = document.getElementById('promocionesContainer');
    if (!contenedor) return;

    if (!Array.isArray(promociones) || promociones.length === 0) {
        contenedor.innerHTML = '<div class="no-data"><h2>Promociones</h2><p>No hay promociones disponibles</p></div>';
        return;
    }

    let html = '<h2>Promociones Activas</h2>';
    html += '<div class="promociones-tabla">';
    html += `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Descuento</th>
                    <th>Fidelizada</th>
                    <th>Productos</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    promociones.forEach(promo => {
        const nombre = escapeHtml(promo.promocion_nombre || 'N/A');
        const descripcion = escapeHtml(promo.promocion_descripcion || 'N/A');
        const descuento = parseFloat(promo.promocion_descuento || 0).toFixed(2);
        const fidelizada = promo.promocion_fidelizada ? 'Sí' : 'No';
        const productosCount = Array.isArray(promo.productos) ? promo.productos.length : 0;
        const promoId = promo.promocion_id;

        html += `
            <tr>
                <td>${nombre}</td>
                <td>${descripcion}</td>
                <td>${descuento}%</td>
                <td>${fidelizada}</td>
                <td>${productosCount} producto(s)</td>
                <td class="acciones">
                    <button class="btn-datos" onclick="datosPromocion(${promoId})">Ver Detalles</button>
                    <button class="btn-editar" onclick="editarPromocion(${promoId})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarPromocion(${promoId})">Eliminar</button>
                </td>
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

// Función de utilidad para escapar HTML
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Funciones CRUD
function abrirFormularioCrear() {
    alert('Formulario de crear promoción - Próxima implementación');
}

function editarPromocion(promocionId) {
    const promocion = promocionesGlobal.find(p => p.promocion_id === promocionId);
    if (!promocion) {
        mostrarError('Promoción no encontrada');
        return;
    }
    alert('Editar promoción: ' + promocion.promocion_nombre + ' - Próxima implementación');
}

function eliminarPromocion(promocionId) {
    const promocion = promocionesGlobal.find(p => p.promocion_id === promocionId);
    if (!promocion) {
        mostrarError('Promoción no encontrada');
        return;
    }

    if (!confirm(`¿Está seguro de que desea eliminar la promoción "${promocion.promocion_nombre}"?`)) {
        return;
    }

    fetch('../Backend/eliminar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            promocion_id: promocionId
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            mostrarExito('Promoción eliminada exitosamente');
            cargarDatos();
        } else {
            mostrarError('Error al eliminar: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarError('Error al eliminar la promoción: ' + error.message);
    });
}