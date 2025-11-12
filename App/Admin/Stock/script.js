document.addEventListener('DOMContentLoaded', async () => {
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const verAlertasBtn = document.getElementById('verAlertasBtn');
    const modal = document.getElementById('ingredientModal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('ingredientForm');
    const searchInput = document.getElementById('searchInput');
    const nombreInput = document.getElementById('nombre');
    const medidaSelect = document.getElementById('medida');
    const medidaInfo = document.getElementById('medidaInfo');
    const medidaInfoText = document.getElementById('medidaInfoText');
    const cantidadMinimaInput = document.getElementById('cantidadMinima');
    let ingredientesExistentes = [];
    let confirmacionCallback = null;

    if (typeof window.canWriteInventory !== 'undefined' && !window.canWriteInventory) {
        if (addIngredientBtn) addIngredientBtn.style.display = 'none';
    }

    window.cerrarModalNotificacion = function() {
        document.getElementById('modalNotificacion').classList.remove('active');
        document.getElementById('modalNotificacion').style.display = 'none';
    }

    window.cancelarConfirmacion = function() {
        document.getElementById('modalConfirmacion').classList.remove('active');
        document.getElementById('modalConfirmacion').style.display = 'none';
        confirmacionCallback = null;
    }

    window.confirmarAccion = function() {
        if (confirmacionCallback) {
            confirmacionCallback();
            confirmacionCallback = null;
        }
        cancelarConfirmacion();
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

    window.addEventListener('click', function(e) {
        const modalNotificacion = document.getElementById('modalNotificacion');
        const modalConfirmacion = document.getElementById('modalConfirmacion');
        
        if (e.target === modalNotificacion) cerrarModalNotificacion();
        if (e.target === modalConfirmacion) cancelarConfirmacion();
    });

    window.mostrarNotificacion = mostrarNotificacion;
    window.mostrarConfirmacion = mostrarConfirmacion;

    loadIngredients();
    loadIngredientesUnicos();
    checkForEditParameter();
    setTimeout(() => {
        if (typeof asegurarSistemaAlertas === 'function') {
            asegurarSistemaAlertas();
        } else if (typeof inicializarSistemaAlertas === 'function') {
            inicializarSistemaAlertas();
        }
        setTimeout(() => {
            if (typeof conectarAlertasConNavegacion === 'function') {
                conectarAlertasConNavegacion();
            }
        }, 500);
    }, 2000);
    function validateCantidadMinima() {
        const cantidadMinima = cantidadMinimaInput.value;
        if (cantidadMinima !== '' && cantidadMinima !== null) {
            const cantidad = parseFloat(cantidadMinima);
            if (isNaN(cantidad) || cantidad < 0) {
                cantidadMinimaInput.classList.add('cantidad-minima-error');
                showCantidadMinimaError('La cantidad mínima debe ser un número positivo o cero');
                return false;
            } else {
                cantidadMinimaInput.classList.remove('cantidad-minima-error');
                hideCantidadMinimaError();
                return true;
            }
        } else {
            cantidadMinimaInput.classList.remove('cantidad-minima-error');
            hideCantidadMinimaError();
            return true;
        }
    }
    function showCantidadMinimaError(message) {
        let errorMsg = document.querySelector('.cantidad-minima-error-msg');
        if (!errorMsg) {
            errorMsg = document.createElement('small');
            errorMsg.className = 'cantidad-minima-error-msg';
            cantidadMinimaInput.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }
    function hideCantidadMinimaError() {
        const errorMsg = document.querySelector('.cantidad-minima-error-msg');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    cantidadMinimaInput.addEventListener('input', validateCantidadMinima);
    cantidadMinimaInput.addEventListener('change', validateCantidadMinima);
    function checkForEditParameter() {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        if (editId) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            setTimeout(() => {
                editIngredient(editId);
            }, 1000);
        }
    }
    nombreInput.addEventListener('input', () => {
        const nombreIngresado = nombreInput.value.trim();
        const ingredienteExistente = ingredientesExistentes.find(
            ing => ing.nombre.toLowerCase() === nombreIngresado.toLowerCase()
        );
        if (ingredienteExistente) {
            medidaSelect.value = ingredienteExistente.medida;
            medidaSelect.disabled = true;
            medidaInfo.style.display = 'block';
            medidaInfoText.textContent = `Este ingrediente ya existe y usa la medida: ${getMedidaNombre(ingredienteExistente.medida)}`;
        } else {
            if (!document.getElementById('ingredientId').value) {
                medidaSelect.disabled = false;
            }
            medidaInfo.style.display = 'none';
        }
    });
    addIngredientBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Agregar Lote';
        form.reset();
        medidaSelect.disabled = false;
        medidaInfo.style.display = 'none';
        loadIngredientesUnicos();
        modal.style.display = 'flex';
    });
    verAlertasBtn.addEventListener('click', () => {
        if (typeof mostrarResumenAlertas === 'function') {
            mostrarResumenAlertas();
        } else {
            mostrarNotificacion('warning', 'Advertencia', 'Sistema de alertas no disponible. Recargue la página.');
        }
    });
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resetModalState();
    });
    const cancelBtn = document.querySelector('.cancel-button');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            resetModalState();
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetModalState();
        }
    });
    function resetModalState() {
        document.getElementById('nombre').disabled = false;
        document.getElementById('medida').disabled = false;
        medidaInfo.style.display = 'none';
        cantidadMinimaInput.classList.remove('cantidad-minima-error');
        hideCantidadMinimaError();
    }
    searchInput.addEventListener('input', debounce(() => {
        loadIngredients(searchInput.value);
    }, 300));
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateCantidadMinima()) {
            return;
        }
        const nombreInput = document.getElementById('nombre');
        const medidaSelect = document.getElementById('medida');
        const nombreDisabled = nombreInput.disabled;
        const medidaDisabled = medidaSelect.disabled;
        nombreInput.disabled = false;
        medidaSelect.disabled = false;
        const formData = new FormData();
        const id = document.getElementById('ingredientId').value;
        const cantidadMinima = cantidadMinimaInput.value || '0';
        formData.append('nombre', nombreInput.value);
        formData.append('stock', document.getElementById('stock').value);
        formData.append('medida', medidaSelect.value);
        formData.append('stock_alerta', cantidadMinima);
        formData.append('caducidad', document.getElementById('caducidad').value);
        let endpoint = '';
        if (id) {
            formData.append('id', id);
            endpoint = '../BackEnd/editar.php';
        } else {
            endpoint = '../BackEnd/crear.php';
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                modal.style.display = 'none';
                resetModalState();
                loadIngredients();
                loadIngredientesUnicos();
                if (typeof reinicializarAlertasSeguro === 'function') {
                    setTimeout(() => {
                        reinicializarAlertasSeguro();
                    }, 500);
                } else if (typeof reinicializarAlertas === 'function') {
                    setTimeout(() => {
                        reinicializarAlertas();
                    }, 500);
                }
                mostrarNotificacion('success', '¡Éxito!', id ? 'Lote actualizado con éxito' : 'Lote agregado con éxito');
            } else {
                mostrarNotificacion('error', 'Error', data.message || 'Error al procesar la solicitud');
                nombreInput.disabled = nombreDisabled;
                medidaSelect.disabled = medidaDisabled;
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('error', 'Error', 'Error al procesar la solicitud');
            nombreInput.disabled = nombreDisabled;
            medidaSelect.disabled = medidaDisabled;
        }
    });
    async function loadIngredientesUnicos() {
        try {
            const response = await fetch('../BackEnd/obtenerIngredientesUnicos.php');
            const data = await response.json();
            if (data.success) {
                ingredientesExistentes = data.ingredientes;
                const datalist = document.getElementById('ingredientesExistentes');
                datalist.innerHTML = '';
                data.ingredientes.forEach(ing => {
                    const option = document.createElement('option');
                    option.value = ing.nombre;
                    option.textContent = `${ing.nombre} (${getMedidaNombre(ing.medida)})`;
                    datalist.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar ingredientes únicos:', error);
        }
    }
    function getMedidaNombre(medida) {
        const medidas = {
            'g': 'Gramos',
            'kg': 'Kilogramos',
            'ml': 'Mililitros',
            'L': 'Litros',
            'u': 'Unidades'
        };
        return medidas[medida] || medida;
    }
});
async function loadIngredients(searchTerm = '') {
    const formData = new FormData();
    if (searchTerm) {
        formData.append('search', searchTerm);
    }
    try {
        const response = await fetch('../BackEnd/leer.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            renderIngredients(data.ingredientes);
        } else {
            console.error('Error al cargar Lote:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function renderIngredients(ingredientes) {
    const tableBody = document.getElementById('ingredientsTableBody');
    tableBody.innerHTML = '';
    ingredientes.forEach(ingrediente => {
        const row = document.createElement('tr');
        let alertaClass = '';
        let fechaCaducidadClass = '';
        if (ingrediente.caducidad) {
            const hoy = new Date();
            const fechaCaducidad = new Date(ingrediente.caducidad);
            const diasHastaCaducidad = Math.ceil((fechaCaducidad.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
            if (diasHastaCaducidad <= 0) {
                alertaClass = 'alerta-vencida';
                fechaCaducidadClass = 'fecha-vencida';
            } else if (diasHastaCaducidad <= 15) {
                alertaClass = 'alerta-activa';
                fechaCaducidadClass = 'fecha-proxima-vencer';
            }
        }
        const cantidadMinima = ingrediente.alerta || ingrediente.stock_alerta || 0;
        const cantidadActual = parseFloat(ingrediente.stock) || 0;
        const tieneStockBajo = cantidadMinima > 0 && cantidadActual <= cantidadMinima;
        if (tieneStockBajo && !alertaClass) {
            alertaClass = 'stock-bajo';
        } else if (tieneStockBajo && alertaClass) {
            alertaClass += ' stock-bajo';
        }
        row.className = alertaClass;
        const cantidadMinimaDisplay = tieneStockBajo ? 
            `<span class="cantidad-minima-alerta">${cantidadMinima.toString().replace(/\./g, ',')} ${ingrediente.medida}</span>` :
            (cantidadMinima > 0 ? `${cantidadMinima.toString().replace(/\./g, ',')} ${ingrediente.medida}` : '<span class="no-configurada">No configurada</span>');
        const canWrite = window.canWriteInventory !== false;
        
        const accionesHTML = canWrite ? `
            <td class="acciones">
                <button class="btn-menu" onclick="toggleMenu(this)">⋮</button>
                <div class="menu-opciones">
                    <div class="opcion" onclick="verDetallesIngrediente(${ingrediente.idIngrediente})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                        </svg>
                        Ver Detalles
                    </div>
                    <div class="opcion" onclick="editIngredient(${ingrediente.idIngrediente})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                        Editar
                    </div>
                    <div class="opcion eliminar" onclick="deleteIngredient(${ingrediente.idIngrediente})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                        Eliminar
                    </div>
                </div>
            </td>
        ` : `
            <td class="acciones">
                <button class="btn-menu" onclick="toggleMenu(this)">⋮</button>
                <div class="menu-opciones">
                    <div class="opcion" onclick="verDetallesIngrediente(${ingrediente.idIngrediente})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                        </svg>
                        Ver Detalles
                    </div>
                </div>
            </td>
        `;
        
        row.innerHTML = `
            <td>${ingrediente.nombre}</td>
            <td>${ingrediente.stock.toString().replace(/\./g, ',')} ${ingrediente.medida}</td>
            <td>${cantidadMinimaDisplay}</td>
            <td class="${fechaCaducidadClass}">${formatDate(ingrediente.caducidad)}</td>
            ${accionesHTML}
        `;
        tableBody.appendChild(row);
    });
    setTimeout(() => {
        if (typeof reconectarAlertasDespuesDeActualizacion === 'function') {
            reconectarAlertasDespuesDeActualizacion();
        } else if (typeof reinicializarAlertasSeguro === 'function') {
            reinicializarAlertasSeguro();
        } else if (typeof reinicializarAlertas === 'function') {
            reinicializarAlertas();
        }
    }, 300);
}
async function editIngredient(id) {
    const formData = new FormData();
    formData.append('id', id);
    try {
        const response = await fetch('../BackEnd/obtener.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            const ingrediente = data.ingrediente;
            document.getElementById('modalTitle').textContent = 'Editar Lote';
            document.getElementById('ingredientId').value = ingrediente.idIngrediente;
            document.getElementById('nombre').value = ingrediente.nombre;
            document.getElementById('stock').value = ingrediente.stock;
            document.getElementById('medida').value = ingrediente.medida;
            document.getElementById('cantidadMinima').value = ingrediente.alerta || ingrediente.stock_alerta || 0;
            document.getElementById('caducidad').value = ingrediente.caducidad;
            document.getElementById('nombre').disabled = true;
            document.getElementById('medida').disabled = true;
            const medidaInfo = document.getElementById('medidaInfo');
            const medidaInfoText = document.getElementById('medidaInfoText');
            medidaInfo.style.display = 'block';
            medidaInfoText.textContent = 'Al editar un lote, no se puede cambiar el nombre ni la medida.';
            document.getElementById('ingredientModal').style.display = 'flex';
        } else {
            mostrarNotificacion('error', 'Error', data.message || 'Error al cargar el Lote');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('error', 'Error', 'Error al cargar el Lote');
    }
}
async function deleteIngredient(id) {
    mostrarConfirmacion(
        'Eliminar Lote',
        '¿Estás seguro de que deseas eliminar este Lote?',
        async function() {
            const formData = new FormData();
            formData.append('id', id);
            try {
                const response = await fetch('../BackEnd/eliminar.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    loadIngredients();
                    if (typeof reinicializarAlertasSeguro === 'function') {
                        setTimeout(() => {
                            reinicializarAlertasSeguro();
                        }, 500);
                    } else if (typeof reinicializarAlertas === 'function') {
                        setTimeout(() => {
                            reinicializarAlertas();
                        }, 500);
                    }
                    mostrarNotificacion('success', '¡Éxito!', 'Lote eliminado con éxito');
                } else {
                    mostrarNotificacion('error', 'Error', data.message || 'Error al eliminar el Lote');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarNotificacion('error', 'Error', 'Error al eliminar el Lote');
            }
        }
    );
}
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
function toggleMenu(btn) {
    document.querySelectorAll('.menu-opciones').forEach(menu => {
        if (menu !== btn.nextElementSibling) menu.style.display = 'none';
    });
    const menu = btn.nextElementSibling;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}
document.addEventListener('click', function (e) {
    if (!e.target.closest('.acciones')) {
        document.querySelectorAll('.menu-opciones').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});
async function verDetallesIngrediente(idIngrediente) {
    try {
        const response = await fetch('../BackEnd/visualizar.php');
        const data = await response.json();
        if (data.error) {
            mostrarNotificacion('error', 'Error', 'Error al cargar detalles: ' + data.error);
            return;
        }
        const ingrediente = data.find(i => i.idIngrediente == idIngrediente);
        if (!ingrediente) {
            mostrarNotificacion('error', 'Error', 'Ingrediente no encontrado');
            return;
        }
        function formatDate(dateString) {
            if (!dateString) return 'No especificada';
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        function getStockEstado(cantidad, minima) {
            if (!minima) return { texto: 'Normal', color: '#28a745' };
            if (cantidad <= minima * 0.5) return { texto: 'Crítico', color: '#dc3545' };
            if (cantidad <= minima) return { texto: 'Bajo', color: '#ffc107' };
            return { texto: 'Normal', color: '#28a745' };
        }
        function getCaducidadEstado(fecha) {
            if (!fecha) return { texto: 'Sin fecha', color: '#6c757d' };
            const hoy = new Date();
            const caducidad = new Date(fecha);
            const diasRestantes = Math.ceil((caducidad - hoy) / (1000 * 60 * 60 * 24));
            if (diasRestantes < 0) return { texto: 'Vencido', color: '#dc3545' };
            if (diasRestantes <= 7) return { texto: 'Próximo a vencer', color: '#ffc107' };
            return { texto: 'Vigente', color: '#28a745' };
        }
        const stockEstado = getStockEstado(ingrediente.cantidad, ingrediente.cantidadMinima);
        const caducidadEstado = getCaducidadEstado(ingrediente.caducidad);
        const detailsModal = document.createElement('div');
        detailsModal.className = 'modal';
        detailsModal.id = 'detailsModal';
        detailsModal.style.display = 'flex';
        const content = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Detalles del Ingrediente</h2>
                <div class="reservation-details">
                    <div class="detail-section">
                        <h3>Información General</h3>
                        <p><strong>ID:</strong> #${ingrediente.idIngrediente}</p>
                        <p><strong>Nombre:</strong> ${ingrediente.nombre}</p>
                        <p><strong>Categoría:</strong> ${ingrediente.categoria || 'Sin categoría'}</p>
                        <p><strong>Unidad de medida:</strong> ${ingrediente.unidadMedida || 'No especificada'}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Stock</h3>
                        <p><strong>Cantidad actual:</strong> ${ingrediente.cantidad} ${ingrediente.unidadMedida || ''}</p>
                        <p><strong>Cantidad mínima:</strong> ${ingrediente.cantidadMinima || 'No configurada'} ${ingrediente.unidadMedida || ''}</p>
                        <p><strong>Estado del stock:</strong> 
                            <span style="background-color: ${stockEstado.color}; color: white; padding: 6px 12px; border-radius: 4px; font-weight: 600; display: inline-block; margin-top: 5px;">
                                ${stockEstado.texto}
                            </span>
                        </p>
                    </div>
                    <div class="detail-section">
                        <h3>Caducidad</h3>
                        <p><strong>Fecha de caducidad:</strong> ${formatDate(ingrediente.caducidad)}</p>
                        <p><strong>Estado:</strong> 
                            <span style="background-color: ${caducidadEstado.color}; color: white; padding: 6px 12px; border-radius: 4px; font-weight: 600; display: inline-block; margin-top: 5px;">
                                ${caducidadEstado.texto}
                            </span>
                        </p>
                    </div>
                    ${ingrediente.proveedor ? `
                    <div class="detail-section">
                        <h3>Proveedor</h3>
                        <p><strong>Nombre:</strong> ${ingrediente.proveedor}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        detailsModal.innerHTML = content;
        document.body.appendChild(detailsModal);
        const closeBtn = detailsModal.querySelector('.close');
        closeBtn.onclick = function () {
            detailsModal.remove();
        }
        window.onclick = function (event) {
            if (event.target == detailsModal) {
                detailsModal.remove();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('error', 'Error', 'Error al cargar detalles del ingrediente');
    }
}