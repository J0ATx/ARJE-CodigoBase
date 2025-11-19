/**
 * Controls Manager - Funciones para manejar controles de personalización
 * Módulo funcional para el sistema de estadísticas
 */

// Cache global para datos del backend
let dataCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

/**
 * Obtiene datos del backend con cache
 * @returns {Promise<Object>} Datos del backend
 */
async function getCachedData() {
    const now = Date.now();
    
    // Verificar si el cache es válido
    if (dataCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        return Promise.resolve(dataCache);
    }
    
    
    try {
        const response = await fetch('../BackEnd/cargarInfo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Actualizar cache
        dataCache = data;
        cacheTimestamp = now;
        
        return data;
    } catch (error) {
        console.error('Error obteniendo datos del backend:', error);
        throw error;
    }
}

/**
 * Limpia el cache de datos
 */
function clearDataCache() {
    dataCache = null;
    cacheTimestamp = null;
}

/**
 * Inicializa el sistema completo de controles después de que se crean las gráficas
 * Esta función debe ser llamada después de que todas las gráficas estén creadas
 */
function initializeControlSystem() {
    
    // Esperar un poco para asegurar que todos los elementos DOM estén creados
    setTimeout(() => {
        try {
            // Verificar que los contenedores de gráficas existan
            const containers = [
                'ingresos-cliente-chart',
                'ingresos-producto-chart', 
                'ventas-producto-chart',
                'noshow-table'
            ];
            
            let foundContainers = 0;
            containers.forEach(containerId => {
                const container = document.getElementById(containerId);
                if (container) {
                    foundContainers++;
                } else {
                    console.warn(`Contenedor no encontrado: ${containerId}`);
                }
            });
            
            // Inicializar controles
            initializeControls();
        } catch (error) {
            console.error('Error inicializando sistema de controles:', error);
        }
    }, 500); // Esperar 500ms para que se creen todos los elementos
}

/**
 * Función de utilidad para crear controles dinámicamente si no existen
 * @param {string} chartContainerId - ID del contenedor de la gráfica
 * @param {string} chartType - Tipo de gráfica (cliente, producto, ventas)
 */
function ensureControlsExist(chartContainerId, chartType) {
    const container = document.getElementById(chartContainerId);
    if (!container) {
        console.warn(`Contenedor no encontrado: ${chartContainerId}`);
        return false;
    }
    
    // Verificar si ya existen controles
    const existingControls = container.querySelector('.chart-controls');
    if (existingControls) {
        return true;
    }
    
    // Crear controles según el tipo
    let controlsElement = null;
    
    switch (chartType) {
        case 'cliente':
            if (window.ChartUtils && window.ChartUtils.createClienteControls) {
                controlsElement = window.ChartUtils.createClienteControls(chartContainerId);
            }
            break;
        case 'producto':
            if (window.ChartUtils && window.ChartUtils.createProductoControls) {
                controlsElement = window.ChartUtils.createProductoControls(chartContainerId);
            }
            break;
        case 'ventas':
            if (window.ChartUtils && window.ChartUtils.createVentasControls) {
                controlsElement = window.ChartUtils.createVentasControls(chartContainerId);
            }
            break;
        default:
            console.warn(`Tipo de gráfica no reconocido: ${chartType}`);
            return false;
    }
    
    if (controlsElement) {
        // Insertar controles al principio del contenedor
        container.insertBefore(controlsElement, container.firstChild);
        return true;
    } else {
        console.warn(`No se pudieron crear controles para: ${chartContainerId}`);
        return false;
    }
}

/**
 * Inicializa todos los controles de personalización
 */
function initializeControls() {
    
    try {
        // Configurar controles para cada tipo de gráfica
        setupClienteControls();
        setupProductoControls();
        setupVentasControls();
        setupNoShowControls();
    } catch (error) {
        console.error('Error inicializando controles:', error);
    }
}

/**
 * Configura controles para filtros de cliente
 */
function setupClienteControls() {
    
    // Buscar el control de filtro de cliente
    const clienteFilter = document.getElementById('ingresos-cliente-chart-filter');
    if (clienteFilter) {
        // Limpiar listeners existentes
        clienteFilter.removeEventListener('change', onClienteFilterChange);
        // Agregar nuevo listener
        clienteFilter.addEventListener('change', onClienteFilterChange);
        
    } else {
        console.warn('Control de filtro de cliente no encontrado: ingresos-cliente-chart-filter');
    }
}

/**
 * Configura controles para filtros de producto
 */
function setupProductoControls() {
    
    // Configurar radio buttons para tipo de filtro
    const productoRadios = document.querySelectorAll('input[name="ingresos-producto-chart-filter"]');
    if (productoRadios.length > 0) {
        productoRadios.forEach(radio => {
            // Limpiar listeners existentes
            radio.removeEventListener('change', onProductoFilterChange);
            // Agregar nuevo listener
            radio.addEventListener('change', onProductoFilterChange);
        });
        
    } else {
        console.warn('Radio buttons de producto no encontrados: input[name="ingresos-producto-chart-filter"]');
    }
    
    // Configurar selector de cantidad
    const productoCount = document.getElementById('ingresos-producto-chart-count');
    if (productoCount) {
        // Limpiar listeners existentes
        productoCount.removeEventListener('change', onProductoFilterChange);
        // Agregar nuevo listener
        productoCount.addEventListener('change', onProductoFilterChange);
        
    } else {
        console.warn('Selector de cantidad de productos no encontrado: ingresos-producto-chart-count');
    }
}

/**
 * Configura controles para filtros de ventas
 */
function setupVentasControls() {
    
    // Configurar radio buttons para tipo de filtro de ventas
    const ventasRadios = document.querySelectorAll('input[name="ventas-producto-chart-filter"]');
    if (ventasRadios.length > 0) {
        ventasRadios.forEach(radio => {
            // Limpiar listeners existentes
            radio.removeEventListener('change', onVentasFilterChange);
            // Agregar nuevo listener
            radio.addEventListener('change', onVentasFilterChange);
        });
    } else {
        console.warn('Radio buttons de ventas no encontrados: input[name="ventas-producto-chart-filter"]');
    }
    
    // Configurar selector de cantidad de ventas
    const ventasCount = document.getElementById('ventas-producto-chart-count');
    if (ventasCount) {
        // Limpiar listeners existentes
        ventasCount.removeEventListener('change', onVentasFilterChange);
        // Agregar nuevo listener
        ventasCount.addEventListener('change', onVentasFilterChange);
    } else {
        console.warn('Selector de cantidad de ventas no encontrado: ventas-producto-chart-count');
    }
}

/**
 * Configura controles para filtros de no shows
 */
function setupNoShowControls() {
    
    // Los no shows ahora usan tabla con buscador integrado
    // El buscador se configura automáticamente cuando se crea la tabla
    // No necesitamos configurar controles adicionales aquí
    
    // Verificar si existe el contenedor de la tabla de no shows
    const noShowContainer = document.getElementById('noshow-table');
    if (noShowContainer) {
    } else {
        console.warn('Contenedor de tabla de no shows no encontrado: noshow-table');
    }
}

/**
 * Maneja cambios en filtros de cliente
 * @param {Event} event - Evento del control
 */
function onClienteFilterChange(event) {
    const filterValue = event.target.value;
    updateClienteChart(filterValue);
}

/**
 * Maneja cambios en filtros de producto
 * @param {Event} event - Evento del control
 */
function onProductoFilterChange(event) {
    // Obtener valores actuales de los controles
    const rangeType = document.querySelector('input[name="ingresos-producto-chart-filter"]:checked')?.value || 'all';
    const count = document.getElementById('ingresos-producto-chart-count')?.value || '10';
    
    updateProductoChart(rangeType, count);
}

/**
 * Maneja cambios en filtros de ventas
 * @param {Event} event - Evento del control
 */
function onVentasFilterChange(event) {
    // Obtener valores actuales de los controles
    const rangeType = document.querySelector('input[name="ventas-producto-chart-filter"]:checked')?.value || 'all';
    const count = document.getElementById('ventas-producto-chart-count')?.value || '10';
    
    updateVentasChart(rangeType, count);
}

/**
 * Maneja cambios en filtros de no shows (función de compatibilidad)
 * @param {Event} event - Evento del control
 */
function onNoShowFilterChange(event) {

}

/**
 * Maneja cambios en rangos de fecha
 * @param {string} startDate - Fecha de inicio
 * @param {string} endDate - Fecha de fin
 */
function onDateRangeChange(startDate, endDate) {

}

/**
 * Actualiza gráfica de clientes
 * @param {string} filterValue - Valor del filtro
 */
function updateClienteChart(filterValue) {
    
    // Mostrar indicador de carga si existe
    const container = document.getElementById('ingresos-cliente-chart');
    let overlay = null;
    if (container) {
        overlay = document.createElement('div');
        overlay.className = 'chart-loading';
        overlay.textContent = 'Actualizando gráfica...';
        container.appendChild(overlay);
    }
    
    // Obtener datos del backend (con cache)
    getCachedData()
    .then(data => {
        
        const filterOptions = { topN: filterValue };
        
        // Verificar que existen las funciones necesarias
        if (window.ChartUtils && window.ChartUtils.createIngresosClienteChart) {
            const chart = window.ChartUtils.createIngresosClienteChart(
                'ingresos-cliente-chart', 
                data.ingresosPorCliente, 
                filterOptions
            );
            
            if (chart) {
            } else {
                console.warn('No se pudo crear la gráfica de clientes');
            }
            if (overlay && container) {
                container.removeChild(overlay);
            }
        } else {
            console.error('ChartUtils.createIngresosClienteChart no está disponible');
        }
    })
    .catch(error => {
        console.error('Error actualizando gráfica de clientes:', error);
        
        // Mostrar mensaje de error en el contenedor
        if (overlay && container) {
            container.removeChild(overlay);
        }
        if (container) {
            const errorBox = document.createElement('div');
            errorBox.className = 'chart-error';
            errorBox.innerHTML = '<p>Error al actualizar la gráfica</p><button onclick="updateClienteChart(\'' + filterValue + '\')">Reintentar</button>';
            container.appendChild(errorBox);
        }
    });
}

/**
 * Actualiza gráfica de productos
 * @param {string} filterType - Tipo de filtro
 * @param {string} count - Cantidad de elementos
 */
function updateProductoChart(filterType, count) {
    
    // Mostrar indicador de carga si existe
    const container = document.getElementById('ingresos-producto-chart');
    let overlay = null;
    if (container) {
        overlay = document.createElement('div');
        overlay.className = 'chart-loading';
        overlay.textContent = 'Actualizando gráfica...';
        container.appendChild(overlay);
    }
    
    // Obtener datos del backend (con cache)
    getCachedData()
    .then(data => {
        
        const filterOptions = { 
            rangeType: filterType,
            count: count
        };
        
        // Verificar que existen las funciones necesarias
        if (window.ChartUtils && window.ChartUtils.createIngresosProductoChart) {
            const chart = window.ChartUtils.createIngresosProductoChart(
                'ingresos-producto-chart', 
                data.ingresosPorProducto, 
                filterOptions
            );
            
            if (chart) {
            } else {
                console.warn('No se pudo crear la gráfica de productos');
            }
            if (overlay && container) {
                container.removeChild(overlay);
            }
        } else {
            console.error('ChartUtils.createIngresosProductoChart no está disponible');
        }
    })
    .catch(error => {
        console.error('Error actualizando gráfica de productos:', error);
        
        // Mostrar mensaje de error en el contenedor
        if (overlay && container) {
            container.removeChild(overlay);
        }
        if (container) {
            const errorBox = document.createElement('div');
            errorBox.className = 'chart-error';
            errorBox.innerHTML = '<p>Error al actualizar la gráfica</p><button onclick="updateProductoChart(\'' + filterType + '\', \'' + count + '\')">Reintentar</button>';
            container.appendChild(errorBox);
        }
    });
}

/**
 * Actualiza gráfica de ventas
 * @param {string} filterType - Tipo de filtro
 * @param {string} count - Cantidad de elementos
 */
function updateVentasChart(filterType, count) {
    
    // Mostrar indicador de carga si existe
    const container = document.getElementById('ventas-producto-chart');
    let overlay = null;
    if (container) {
        overlay = document.createElement('div');
        overlay.className = 'chart-loading';
        overlay.textContent = 'Actualizando gráfica...';
        container.appendChild(overlay);
    }
    
    // Obtener datos del backend (con cache)
    getCachedData()
    .then(data => {
        
        const filterOptions = { 
            rangeType: filterType,
            count: count
        };
        
        // Verificar que existen las funciones necesarias
        if (window.ChartUtils && window.ChartUtils.createVentasProductoChart) {
            const canvas = document.getElementById('ventas-producto-chart-canvas');
            const targetId = canvas ? 'ventas-producto-chart-canvas' : 'ventas-producto-chart';
            const chart = window.ChartUtils.createVentasProductoChart(
                targetId,
                data.ventasPorProducto,
                filterOptions
            );
            
            if (chart) {
            } else {
                console.warn('No se pudo crear la gráfica de ventas');
            }
            if (overlay && container) {
                container.removeChild(overlay);
            }
        } else {
            console.error('ChartUtils.createVentasProductoChart no está disponible');
        }
    })
    .catch(error => {
        console.error('Error actualizando gráfica de ventas:', error);
        
        // Mostrar mensaje de error en el contenedor
        if (overlay && container) {
            container.removeChild(overlay);
        }
        if (container) {
            const errorBox = document.createElement('div');
            errorBox.className = 'chart-error';
            errorBox.innerHTML = '<p>Error al actualizar la gráfica</p><button onclick="updateVentasChart(\'' + filterType + '\', \'' + count + '\')">Reintentar</button>';
            container.appendChild(errorBox);
        }
    });
}

/**
 * Actualiza tabla de no shows
 * @param {string} containerId - ID del contenedor de la tabla
 */
function updateNoShowTable(containerId = 'noshow-table') {
    
    // Mostrar indicador de carga si existe
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="chart-loading">Actualizando tabla...</div>';
    }
    
    // Obtener datos del backend (con cache)
    getCachedData()
    .then(data => {
        
        // Verificar que existen las funciones necesarias
        if (window.ChartUtils && window.ChartUtils.createNoShowTable) {
            const table = window.ChartUtils.createNoShowTable(containerId, data.noShowPorCliente);
            
            if (table) {
            } else {
                console.warn('No se pudo crear la tabla de no shows');
            }
        } else {
            console.error('ChartUtils.createNoShowTable no está disponible');
        }
    })
    .catch(error => {
        console.error('Error actualizando tabla de no shows:', error);
        
        // Mostrar mensaje de error en el contenedor
        if (container) {
            container.innerHTML = `
                <div class="chart-error">
                    <p>Error al actualizar la tabla</p>
                    <button onclick="updateNoShowTable('${containerId}')">Reintentar</button>
                </div>
            `;
        }
    });
}

/**
 * Actualiza gráfica de no shows (función de compatibilidad)
 * @param {string} filterValue - Valor del filtro
 */
function updateNoShowChart(filterValue) {
    
    // Función de compatibilidad - ahora actualiza la tabla
    updateNoShowTable('noshow-table');
}

// Exportar funciones para uso global
window.ControlsManager = {
    // Funciones de inicialización
    initializeControls,
    initializeControlSystem,
    setupClienteControls,
    setupProductoControls,
    setupVentasControls,
    setupNoShowControls,
    
    // Event handlers
    onClienteFilterChange,
    onProductoFilterChange,
    onVentasFilterChange,
    onNoShowFilterChange,
    onDateRangeChange,
    
    // Funciones de actualización de gráficas
    updateClienteChart,
    updateProductoChart,
    updateVentasChart,
    updateNoShowChart,
    updateNoShowTable,
    
    // Funciones de cache
    getCachedData,
    clearDataCache,
    
    // Funciones de utilidad
    ensureControlsExist
};