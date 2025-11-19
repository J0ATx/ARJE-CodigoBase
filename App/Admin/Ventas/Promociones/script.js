let promocionesGlobal = [];
let productosGlobal = [];
let confirmacionCallback = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
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
    const closeCrear = document.getElementById('closeCrear');
    const closeEditar = document.getElementById('closeEditar');
    if (closeCrear) closeCrear.addEventListener('click', () => cerrarModal('modalCrear'));
    if (closeEditar) closeEditar.addEventListener('click', () => cerrarModal('modalEditar'));
    const modalCrear = document.getElementById('modalCrear');
    const modalEditar = document.getElementById('modalEditar');
    window.addEventListener('click', function(e) {
        if (e.target === modalCrear) cerrarModal('modalCrear');
        if (e.target === modalEditar) cerrarModal('modalEditar');
        const modalNotificacion = document.getElementById('modalNotificacion');
        const modalConfirmacion = document.getElementById('modalConfirmacion');
        if (e.target === modalNotificacion) cerrarModalNotificacion();
        if (e.target === modalConfirmacion) cancelarConfirmacion();
    });
    const btnNotifAceptar = document.getElementById('btnModalNotificacionAceptar');
    if (btnNotifAceptar) btnNotifAceptar.addEventListener('click', cerrarModalNotificacion);
    const btnCancelarConf = document.getElementById('btnCancelarConfirmacion');
    if (btnCancelarConf) btnCancelarConf.addEventListener('click', cancelarConfirmacion);
});

// Funciones de carga de datos
function cargarDatos() {
    fetch('../Backend/visualizar.php', { method: 'POST' })
    .then(response => {
        if (!response.ok) throw new Error('Error en la respuesta del servidor: ' + response.status);
        return response.json();
    })
    .then(data => {
        if (!data.success) {
            mostrarNotificacion('error', 'Error', data.message || 'Error al cargar datos');
            return;
        }
        productosGlobal = data.data.productosExistentes || [];
        promocionesGlobal = data.data.promociones || [];
        mostrarPromociones(promocionesGlobal);
    })
    .catch(error => {
        console.error('Error al cargar datos:', error);
        mostrarNotificacion('error', 'Error', 'Error al cargar los datos: ' + error.message);
    });
}

function mostrarNotificacion(tipo, titulo, mensaje) {
    const iconContainer = document.getElementById('notificationIcon');
    const titleElement = document.getElementById('notificationTitle');
    const messageElement = document.getElementById('notificationMessage');
    iconContainer.className = 'notification-icon';
    iconContainer.classList.add(tipo);
    const svgs = {
        success: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>',
        error: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>',
        warning: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>'
    };
    iconContainer.innerHTML = svgs[tipo] || svgs.success;
    titleElement.textContent = titulo;
    messageElement.textContent = mensaje;
    const modal = document.getElementById('modalNotificacion');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function cerrarModalNotificacion() {
    const modal = document.getElementById('modalNotificacion');
    modal.classList.remove('active');
    modal.style.display = 'none';
}

function mostrarConfirmacion(titulo, mensaje, callback) {
    document.getElementById('confirmacionTitle').textContent = titulo;
    document.getElementById('confirmacionMessage').textContent = mensaje;
    confirmacionCallback = callback;
    const btnConfirmar = document.getElementById('btnConfirmar');
    btnConfirmar.onclick = confirmarAccion;
    const modal = document.getElementById('modalConfirmacion');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function cancelarConfirmacion() {
    const modal = document.getElementById('modalConfirmacion');
    modal.classList.remove('active');
    modal.style.display = 'none';
    confirmacionCallback = null;
}

function confirmarAccion() {
    if (confirmacionCallback) {
        confirmacionCallback();
        confirmacionCallback = null;
    }
    cancelarConfirmacion();
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

// Mostrar promociones
function mostrarPromociones(promociones) {
    const tbody = document.getElementById('tablaPromociones');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!Array.isArray(promociones) || promociones.length === 0) return;
    promociones.forEach(promo => {
        const nombre = escapeHtml(promo.promocion_nombre || 'N/A');
        const descripcion = escapeHtml(promo.promocion_descripcion || 'N/A');
        const descuento = parseFloat(promo.promocion_descuento || 0).toFixed(2);
        const fidelizada = promo.promocion_fidelizada ? 'Sí' : 'No';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nombre}</td>
            <td>${descripcion}</td>
            <td>${descuento}%</td>
            <td>${fidelizada}</td>
            <td class="acciones">
                <button class="btn-menu" onclick="toggleMenu(this)">⋮</button>
                <div class="menu-opciones">
                    <div class="opcion" onclick="abrirDetallesPromocion(${promo.promocion_id})">Ver Detalles</div>
                    <div class="opcion" onclick="editarPromocion(${promo.promocion_id})">Editar</div>
                    <div class="opcion eliminar" onclick="eliminarPromocion(${promo.promocion_id})">Eliminar</div>
                </div>
            </td>`;
        tbody.appendChild(tr);
    });
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
    if (!Array.isArray(productosGlobal) || productosGlobal.length === 0) {
        mostrarNotificacion('error', 'Error', 'No hay productos disponibles para asociar a la promoción');
        return;
    }
    const lista = document.getElementById('listaProductosCrear');
    if (lista) {
        lista.innerHTML = '';
        productosGlobal.forEach(prod => {
            const id = prod.producto_id;
            const nombre = escapeHtml(prod.producto_nombre || 'Sin nombre');
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '6px';
            label.innerHTML = `<input type="checkbox" name="productos[]" value="${id}"> ${nombre}`;
            lista.appendChild(label);
        });
    }
    const modal = document.getElementById('modalCrear');
    if (modal) modal.style.display = 'flex';
    const form = document.getElementById('formCrearPromocion');
    if (form) {
        form.onsubmit = function(e) { submitCrearPromocion(e); };
    }
}

function submitCrearPromocion(e) {
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

    if (!nombre) { mostrarNotificacion('error', 'Error', 'El nombre es requerido'); return; }
    if (!descripcion) { mostrarNotificacion('error', 'Error', 'La descripción es requerida'); return; }
    if (!descuentoRaw && descuentoRaw !== '0') { mostrarNotificacion('error', 'Error', 'El descuento es requerido'); return; }
    const descuento = parseFloat(descuentoRaw);
    if (isNaN(descuento) || descuento < 0 || descuento > 100) { mostrarNotificacion('error', 'Error', 'Descuento inválido (0-100)'); return; }
    if (!Array.isArray(productosChecked) || productosChecked.length === 0) { mostrarNotificacion('error', 'Error', 'Seleccione al menos un producto'); return; }
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
            mostrarNotificacion('success', 'Éxito', data.message || 'Promoción creada correctamente');
            cerrarModal('modalCrear');
            cargarDatos();
        } else {
            mostrarNotificacion('error', 'Error', 'Error al crear: ' + (data.message || 'Respuesta no exitosa'));
        }
    })
    .catch(err => {
        console.error('Error al crear promoción:', err);
        mostrarNotificacion('error', 'Error', 'Error al crear la promoción: ' + err.message);
    });
}

function editarPromocion(promocionId) {
    const promocion = promocionesGlobal.find(p => p.promocion_id === promocionId);
    if (!promocion) {
        mostrarNotificacion('error', 'Error', 'Promoción no encontrada');
        return;
    }
    const productosActuales = Array.isArray(promocion.productos) ? promocion.productos.map(p => p.producto_id) : [];
    const lista = document.getElementById('listaProductosEditar');
    if (lista) {
        lista.innerHTML = '';
        productosGlobal.forEach(prod => {
            const id = prod.producto_id;
            const nombre = escapeHtml(prod.producto_nombre || 'Sin nombre');
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '6px';
            label.innerHTML = `<input type="checkbox" name="productos[]" value="${id}" ${productosActuales.includes(id) ? 'checked' : ''}> ${nombre}`;
            lista.appendChild(label);
        });
    }
    document.getElementById('editar_id').value = promocionId;
    document.getElementById('editar_nombre').value = promocion.promocion_nombre || '';
    document.getElementById('editar_descripcion').value = promocion.promocion_descripcion || '';
    document.getElementById('editar_descuento').value = parseFloat(promocion.promocion_descuento || 0).toFixed(2);
    document.getElementById('editar_fidelizada').checked = !!promocion.promocion_fidelizada;
    const modal = document.getElementById('modalEditar');
    if (modal) modal.style.display = 'flex';
    const form = document.getElementById('formEditarPromocion');
    if (form) {
        form.onsubmit = function(e) { submitEditarPromocion(e); };
    }
}

function submitEditarPromocion(e) {
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

    if (!nombre) { mostrarNotificacion('error', 'Error', 'El nombre es requerido'); return; }
    if (!descripcion) { mostrarNotificacion('error', 'Error', 'La descripción es requerida'); return; }
    if (!descuentoRaw && descuentoRaw !== '0') { mostrarNotificacion('error', 'Error', 'El descuento es requerido'); return; }
    const descuento = parseFloat(descuentoRaw);
    if (isNaN(descuento) || descuento < 0 || descuento > 100) { mostrarNotificacion('error', 'Error', 'Descuento inválido (0-100)'); return; }
    if (!Array.isArray(productosChecked) || productosChecked.length === 0) { mostrarNotificacion('error', 'Error', 'Seleccione al menos un producto'); return; }
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
            mostrarNotificacion('success', 'Éxito', data.message || 'Promoción actualizada correctamente');
            cerrarModal('modalEditar');
            cargarDatos();
        } else {
            mostrarNotificacion('error', 'Error', 'Error al actualizar: ' + (data.message || 'Respuesta no exitosa'));
        }
    })
    .catch(err => {
        console.error('Error al actualizar promoción:', err);
        mostrarNotificacion('error', 'Error', 'Error al actualizar la promoción: ' + err.message);
    });
}

function abrirDetallesPromocion(promocionId) {
    const promocion = promocionesGlobal.find(p => p.promocion_id === promocionId);
    if (!promocion) {
        mostrarNotificacion('error', 'Error', 'Promoción no encontrada');
        return;
    }
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
    const detailsModal = document.createElement('div');
    detailsModal.className = 'modal';
    detailsModal.id = 'detailsModal';
    detailsModal.style.display = 'flex';
    const content = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Detalles de la Promoción</h2>
            <div class="reservation-details">
                <div class="detail-section">
                    <p><strong>Nombre:</strong> ${escapeHtml(promocion.promocion_nombre || 'N/A')}</p>
                    <p><strong>Descripción:</strong> ${escapeHtml(promocion.promocion_descripcion || 'N/A')}</p>
                    <p><strong>Descuento:</strong> ${parseFloat(promocion.promocion_descuento || 0).toFixed(2)}%</p>
                    <p><strong>Fidelizada:</strong> ${promocion.promocion_fidelizada ? 'Sí' : 'No'}</p>
                </div>
                <div class="detail-section">
                    <h3>Productos Vinculados</h3>
                    ${productosHtml}
                </div>
            </div>
        </div>
    `;
    detailsModal.innerHTML = content;
    document.body.appendChild(detailsModal);
    const closeBtn = detailsModal.querySelector('.close');
    closeBtn.onclick = function () { detailsModal.remove(); }
    window.onclick = function (event) { if (event.target == detailsModal) { detailsModal.remove(); } }
}

function eliminarPromocion(promocionId) {
    const promocion = promocionesGlobal.find(p => p.promocion_id === promocionId);
    if (!promocion) {
        mostrarNotificacion('error', 'Error', 'Promoción no encontrada');
        return;
    }
    mostrarConfirmacion(
        'Eliminar Promoción',
        `¿Seguro que deseas eliminar la promoción "${promocion.promocion_nombre}"?`,
        function() {
            fetch('../Backend/eliminar.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ promocion_id: promocionId })
            })
            .then(response => {
                if (!response.ok) throw new Error('Error en la respuesta del servidor');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    mostrarNotificacion('success', 'Éxito', 'Promoción eliminada exitosamente');
                    cargarDatos();
                } else {
                    mostrarNotificacion('error', 'Error', 'Error al eliminar: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarNotificacion('error', 'Error', 'Error al eliminar la promoción: ' + error.message);
            });
        }
    );
}

function toggleMenu(btn) {
    document.querySelectorAll('.menu-opciones').forEach(menu => {
        if (menu !== btn.nextElementSibling) menu.style.display = 'none';
    });
    const menu = btn.nextElementSibling;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}