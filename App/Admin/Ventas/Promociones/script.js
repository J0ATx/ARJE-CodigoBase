// Variables globales
let promocionesGlobal = [];
let productosGlobal = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    setupEventListeners();
});

function setupEventListeners() {
    const btnCrear = document.getElementById('btnCrearPromocion');
    if (btnCrear) {
        btnCrear.addEventListener('click', abrirFormularioCrear);
    }
    const search = document.getElementById('searchInput');
    if (search) {
        search.addEventListener('input', (e) => {
            const q = e.target.value.trim().toLowerCase();
            const filtered = promocionesGlobal.filter(p => {
                return (p.promocion_nombre || '').toString().toLowerCase().includes(q)
                    || (p.promocion_descripcion || '').toString().toLowerCase().includes(q);
            });
            mostrarPromociones(filtered);
        });
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

        productosGlobal = data.data.productosExistentes || [];
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

// Mostrar promociones
function mostrarPromociones(promociones) {
    const contenedor = document.getElementById('promocionesContainer');
    if (!contenedor) return;

    if (!Array.isArray(promociones) || promociones.length === 0) {
        contenedor.innerHTML = '<div class="no-data"><h2>Promociones</h2><p>No hay promociones disponibles</p></div>';
        return;
    }

    let html = '';
    html += '<div class="promociones-tabla">';
    html += `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Descuento</th>
                    <th>Fidelizada</th>
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
        const promoId = promo.promocion_id;

        html += `
            <tr>
                <td>${nombre}</td>
                <td>${descripcion}</td>
                <td>${descuento}%</td>
                <td>${fidelizada}</td>
                <td class="acciones">
                    <button class="btn-editar" onclick="abrirDetallesPromocion(${promoId})">Ver Detalles</button>
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
    // Render the form in the modal container
    const modalRoot = document.getElementById('modalContainer');
    if (!modalRoot) return;

    if (!Array.isArray(productosGlobal) || productosGlobal.length === 0) {
        mostrarError('No hay productos disponibles para asociar a la promoción');
        return;
    }

    let productosHtml = '';
    productosGlobal.forEach(prod => {
        const id = prod.producto_id;
        const nombre = escapeHtml(prod.producto_nombre || 'Sin nombre');
        productosHtml += `\n            <label style="display:block; margin-bottom:6px;"><input type="checkbox" name="productos[]" value="${id}"> ${nombre}</label>`;
    });

    const modalHtml = `
        <div class="modal-overlay" id="modalOverlay"></div>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div class="modal-header">
                <div class="modal-title" id="modalTitle">Crear Promoción</div>
                <button class="modal-close" id="modalClose">&times;</button>
            </div>
            <div class="modal-body">
                <form id="formCrearPromocion">
                    <div style="margin-bottom:10px;">
                        <label>Nombre:<input type="text" name="promocion_nombre" required maxlength="100"></label>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label>Descripción:<input type="text" name="promocion_descripcion" required maxlength="100"></label>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label>Descuento (%):<input type="number" name="promocion_descuento" required min="0" max="100" step="0.01"></label>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label><input type="checkbox" name="promocion_fidelizada"> Promoción fidelizada</label>
                    </div>
                    <div style="margin-bottom:10px; max-height:240px; overflow:auto; border:1px solid #eee; padding:10px;">
                        <strong>Productos (seleccione al menos 1):</strong>
                        ${productosHtml}
                    </div>
                    <div class="modal-actions">
                        <button type="button" id="btnCancelModal" class="btn-eliminar">Cancelar</button>
                        <button type="submit" class="btn-primary">Crear</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    modalRoot.innerHTML = modalHtml;
    modalRoot.style.display = 'flex';

    // Small timeout for CSS transitions
    requestAnimationFrame(() => {
        const modal = modalRoot.querySelector('.modal');
        const overlay = modalRoot.querySelector('.modal-overlay');
        if (modal) modal.classList.add('show');
        if (overlay) overlay.classList.add('show');
        // focus first input for accessibility
        const firstInput = modal ? modal.querySelector('input[type="text"], input[type="number"], textarea, select') : null;
        if (firstInput) {
            setTimeout(() => { firstInput.focus(); }, 120);
        }
    });

    const closeModal = () => {
        const modal = modalRoot.querySelector('.modal');
        const overlay = modalRoot.querySelector('.modal-overlay');
        if (modal) modal.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
        // wait for transition
        setTimeout(() => { modalRoot.style.display = 'none'; modalRoot.innerHTML = ''; }, 220);
        document.removeEventListener('keydown', escHandler);
    };

    const escHandler = (ev) => { if (ev.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', escHandler);

    const overlayEl = document.getElementById('modalOverlay');
    if (overlayEl) overlayEl.addEventListener('click', closeModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('btnCancelModal').addEventListener('click', closeModal);

    const form = document.getElementById('formCrearPromocion');
    form.addEventListener('submit', function(e) { submitCrearPromocion(e, closeModal); });
}

function submitCrearPromocion(e, onSuccessClose) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const nombre = (formData.get('promocion_nombre') || '').toString().trim();
    const descripcion = (formData.get('promocion_descripcion') || '').toString().trim();
    const descuentoRaw = formData.get('promocion_descuento');
    const fidelizada = formData.get('promocion_fidelizada') !== null;
    const productosChecked = [];

    for (const pair of formData.entries()) {
        if (pair[0] === 'productos[]') {
            productosChecked.push(parseInt(pair[1], 10));
        }
    }

    if (!nombre) { mostrarError('El nombre es requerido'); return; }
    if (!descripcion) { mostrarError('La descripción es requerida'); return; }
    if (!descuentoRaw && descuentoRaw !== '0') { mostrarError('El descuento es requerido'); return; }
    const descuento = parseFloat(descuentoRaw);
    if (isNaN(descuento) || descuento < 0 || descuento > 100) { mostrarError('Descuento inválido (0-100)'); return; }
    if (!Array.isArray(productosChecked) || productosChecked.length === 0) { mostrarError('Seleccione al menos un producto'); return; }

    mostrarCargando(true);
    fetch('../Backend/crear.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            promocion_nombre: nombre,
            promocion_descripcion: descripcion,
            promocion_descuento: descuento,
            promocion_fidelizada: fidelizada,
            productos: productosChecked
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarExito(data.message || 'Promoción creada correctamente');
            if (typeof onSuccessClose === 'function') onSuccessClose();
            cargarDatos();
        } else {
            mostrarError('Error al crear: ' + (data.message || 'Respuesta no exitosa'));
        }
    })
    .catch(err => {
        console.error('Error al crear promoción:', err);
        mostrarError('Error al crear la promoción: ' + err.message);
    })
    .finally(() => mostrarCargando(false));
}

function editarPromocion(promocionId) {
    const promocion = promocionesGlobal.find(p => p.promocion_id === promocionId);
    if (!promocion) {
        mostrarError('Promoción no encontrada');
        return;
    }

    const modalRoot = document.getElementById('modalContainer');
    if (!modalRoot) return;

    if (!Array.isArray(productosGlobal) || productosGlobal.length === 0) {
        mostrarError('No hay productos disponibles');
        return;
    }

    // Obtener IDs de productos actuales
    const productosActuales = Array.isArray(promocion.productos) ? promocion.productos.map(p => p.producto_id) : [];

    let productosHtml = '';
    productosGlobal.forEach(prod => {
        const id = prod.producto_id;
        const nombre = escapeHtml(prod.producto_nombre || 'Sin nombre');
        const checked = productosActuales.includes(id) ? 'checked' : '';
        productosHtml += `\n            <label style="display:block; margin-bottom:6px;"><input type="checkbox" name="productos[]" value="${id}" ${checked}> ${nombre}</label>`;
    });

    const modalHtml = `
        <div class="modal-overlay" id="modalOverlay"></div>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div class="modal-header">
                <div class="modal-title" id="modalTitle">Editar Promoción</div>
                <button class="modal-close" id="modalClose">&times;</button>
            </div>
            <div class="modal-body">
                <form id="formEditarPromocion">
                    <input type="hidden" name="promocion_id" value="${promocionId}">
                    <div style="margin-bottom:10px;">
                        <label>Nombre:<input type="text" name="promocion_nombre" required maxlength="100" value="${escapeHtml(promocion.promocion_nombre || '')}"></label>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label>Descripción:<input type="text" name="promocion_descripcion" required maxlength="100" value="${escapeHtml(promocion.promocion_descripcion || '')}"></label>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label>Descuento (%):<input type="number" name="promocion_descuento" required min="0" max="100" step="0.01" value="${parseFloat(promocion.promocion_descuento || 0).toFixed(2)}"></label>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label><input type="checkbox" name="promocion_fidelizada" ${promocion.promocion_fidelizada ? 'checked' : ''}> Promoción fidelizada</label>
                    </div>
                    <div style="margin-bottom:10px; max-height:240px; overflow:auto; border:1px solid #eee; padding:10px;">
                        <strong>Productos (seleccione al menos 1):</strong>
                        ${productosHtml}
                    </div>
                    <div class="modal-actions">
                        <button type="button" id="btnCancelModal" class="btn-eliminar">Cancelar</button>
                        <button type="submit" class="btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    modalRoot.innerHTML = modalHtml;
    modalRoot.style.display = 'flex';

    requestAnimationFrame(() => {
        const modal = modalRoot.querySelector('.modal');
        const overlay = modalRoot.querySelector('.modal-overlay');
        if (modal) modal.classList.add('show');
        if (overlay) overlay.classList.add('show');
        const firstInput = modal ? modal.querySelector('input[type="text"]') : null;
        if (firstInput) {
            setTimeout(() => { firstInput.focus(); }, 120);
        }
    });

    const closeModal = () => {
        const modal = modalRoot.querySelector('.modal');
        const overlay = modalRoot.querySelector('.modal-overlay');
        if (modal) modal.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
        setTimeout(() => { modalRoot.style.display = 'none'; modalRoot.innerHTML = ''; }, 220);
        document.removeEventListener('keydown', escHandler);
    };

    const escHandler = (ev) => { if (ev.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', escHandler);

    const overlayEl = document.getElementById('modalOverlay');
    if (overlayEl) overlayEl.addEventListener('click', closeModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('btnCancelModal').addEventListener('click', closeModal);

    const form = document.getElementById('formEditarPromocion');
    form.addEventListener('submit', function(e) { submitEditarPromocion(e, closeModal); });
}

function submitEditarPromocion(e, onSuccessClose) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const promocionId = formData.get('promocion_id');
    const nombre = (formData.get('promocion_nombre') || '').toString().trim();
    const descripcion = (formData.get('promocion_descripcion') || '').toString().trim();
    const descuentoRaw = formData.get('promocion_descuento');
    const fidelizada = formData.get('promocion_fidelizada') !== null;
    const productosChecked = [];

    for (const pair of formData.entries()) {
        if (pair[0] === 'productos[]') {
            productosChecked.push(parseInt(pair[1], 10));
        }
    }

    if (!nombre) { mostrarError('El nombre es requerido'); return; }
    if (!descripcion) { mostrarError('La descripción es requerida'); return; }
    if (!descuentoRaw && descuentoRaw !== '0') { mostrarError('El descuento es requerido'); return; }
    const descuento = parseFloat(descuentoRaw);
    if (isNaN(descuento) || descuento < 0 || descuento > 100) { mostrarError('Descuento inválido (0-100)'); return; }
    if (!Array.isArray(productosChecked) || productosChecked.length === 0) { mostrarError('Seleccione al menos un producto'); return; }

    mostrarCargando(true);
    fetch('../Backend/modificar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            promocion_id: parseInt(promocionId),
            promocion_nombre: nombre,
            promocion_descripcion: descripcion,
            promocion_descuento: descuento,
            promocion_fidelizada: fidelizada,
            productos: productosChecked
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarExito(data.message || 'Promoción actualizada correctamente');
            if (typeof onSuccessClose === 'function') onSuccessClose();
            cargarDatos();
        } else {
            mostrarError('Error al actualizar: ' + (data.message || 'Respuesta no exitosa'));
        }
    })
    .catch(err => {
        console.error('Error al actualizar promoción:', err);
        mostrarError('Error al actualizar la promoción: ' + err.message);
    })
    .finally(() => mostrarCargando(false));
}

function abrirDetallesPromocion(promocionId) {
    const promocion = promocionesGlobal.find(p => p.promocion_id === promocionId);
    if (!promocion) {
        mostrarError('Promoción no encontrada');
        return;
    }

    const modalRoot = document.getElementById('modalContainer');
    if (!modalRoot) return;

    const productos = Array.isArray(promocion.productos) ? promocion.productos : [];
    let productosHtml = '';
    
    if (productos.length === 0) {
        productosHtml = '<p style="color:#999;">No hay productos asociados</p>';
    } else {
        productosHtml = '<ul style="list-style:none; padding:0;">';
        productos.forEach(prod => {
            const nombre = escapeHtml(prod.producto_nombre || 'Sin nombre');
            productosHtml += `<li style="padding:8px; background:#f8f8f8; margin-bottom:6px; border-radius:4px;">${nombre}</li>`;
        });
        productosHtml += '</ul>';
    }

    const modalHtml = `
        <div class="modal-overlay" id="modalOverlay"></div>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div class="modal-header">
                <div class="modal-title" id="modalTitle">Detalles de Promoción</div>
                <button class="modal-close" id="modalClose">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom:15px;">
                    <strong style="color:#1c1c1c;">Nombre:</strong> ${escapeHtml(promocion.promocion_nombre || 'N/A')}
                </div>
                <div style="margin-bottom:15px;">
                    <strong style="color:#1c1c1c;">Descripción:</strong> ${escapeHtml(promocion.promocion_descripcion || 'N/A')}
                </div>
                <div style="margin-bottom:15px;">
                    <strong style="color:#1c1c1c;">Descuento:</strong> ${parseFloat(promocion.promocion_descuento || 0).toFixed(2)}%
                </div>
                <div style="margin-bottom:15px;">
                    <strong style="color:#1c1c1c;">Fidelizada:</strong> ${promocion.promocion_fidelizada ? 'Sí' : 'No'}
                </div>
                <div style="margin-bottom:15px;">
                    <strong style="color:#1c1c1c;">Productos Vinculados:</strong>
                    ${productosHtml}
                </div>
                <div class="modal-actions">
                    <button type="button" id="btnCloseDetalles" class="btn-primary">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    modalRoot.innerHTML = modalHtml;
    modalRoot.style.display = 'flex';

    requestAnimationFrame(() => {
        const modal = modalRoot.querySelector('.modal');
        const overlay = modalRoot.querySelector('.modal-overlay');
        if (modal) modal.classList.add('show');
        if (overlay) overlay.classList.add('show');
    });

    const closeModal = () => {
        const modal = modalRoot.querySelector('.modal');
        const overlay = modalRoot.querySelector('.modal-overlay');
        if (modal) modal.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
        setTimeout(() => { modalRoot.style.display = 'none'; modalRoot.innerHTML = ''; }, 220);
        document.removeEventListener('keydown', escHandler);
    };

    const escHandler = (ev) => { if (ev.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', escHandler);

    const overlayEl = document.getElementById('modalOverlay');
    if (overlayEl) overlayEl.addEventListener('click', closeModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('btnCloseDetalles').addEventListener('click', closeModal);
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