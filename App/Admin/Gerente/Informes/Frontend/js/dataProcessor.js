/**
 * Data Processor - Funciones para transformar y filtrar datos del backend
 * Módulo funcional para el sistema de estadísticas
 */

console.log('Loading DataProcessor...');

// Funciones de utilidad
function safeParseFloat(value) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
}

function safeFormatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Fecha inválida';
    }
}

/**
 * Procesa datos de ingresos por fecha
 */
function processIngresosPorFecha(rawData) {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return [];
    }
    
    try {
        return rawData.map(item => {
            const fecha = new Date(item.fecha);
            return {
                x: fecha,
                y: safeParseFloat(item.total),
                label: safeFormatDate(item.fecha)
            };
        }).sort((a, b) => a.x - b.x);
    } catch (error) {
        console.error('Error in processIngresosPorFecha:', error);
        return [];
    }
}

/**
 * Procesa datos de ingresos por método de pago - TASK 6 IMPLEMENTATION
 */
function processIngresosPorPago(rawData) {
    console.log('processIngresosPorPago called with:', rawData);
    
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return { montoData: [], porcentajeData: [] };
    }
    
    try {
        const totalIngresos = rawData.reduce((sum, item) => sum + safeParseFloat(item.total), 0);
        
        if (totalIngresos === 0) {
            return { montoData: [], porcentajeData: [] };
        }
        
        const processedData = rawData.map(item => {
            const monto = safeParseFloat(item.total);
            const porcentaje = (monto / totalIngresos) * 100;
            return {
                label: item.pedido_pago || 'Sin especificar',
                monto: monto,
                porcentaje: porcentaje
            };
        }).sort((a, b) => b.monto - a.monto);
        
        const montoData = processedData.map(item => ({
            label: item.label,
            y: item.monto
        }));
        
        const porcentajeData = processedData.map(item => ({
            label: item.label,
            y: parseFloat(item.porcentaje.toFixed(1))
        }));
        
        console.log('processIngresosPorPago result:', { montoData, porcentajeData });
        return { montoData, porcentajeData };
    } catch (error) {
        console.error('Error in processIngresosPorPago:', error);
        return { montoData: [], porcentajeData: [] };
    }
}

/**
 * Procesa datos de ingresos por camarero
 */
function processIngresosPorCamarero(rawData) {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return [];
    }
    
    try {
        return rawData.map(item => ({
            label: item.personal_nombre || 'Sin nombre',
            y: safeParseFloat(item.total)
        })).sort((a, b) => b.y - a.y);
    } catch (error) {
        console.error('Error in processIngresosPorCamarero:', error);
        return [];
    }
}

/**
 * Procesa datos de ingresos por cliente
 */
function processIngresosPorCliente(rawData, filterOptions = {}) {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return [];
    }
    
    try {
        let processedData = rawData.map(item => ({
            label: item.cliente_nombre || 'Sin nombre',
            y: safeParseFloat(item.total)
        })).sort((a, b) => b.y - a.y);
        
        if (filterOptions.topN && filterOptions.topN !== 'all') {
            const n = parseInt(filterOptions.topN);
            processedData = processedData.slice(0, n);
        }
        
        return processedData;
    } catch (error) {
        console.error('Error in processIngresosPorCliente:', error);
        return [];
    }
}

/**
 * Procesa datos de ingresos por producto
 */
function processIngresosPorProducto(rawData, filterOptions = {}) {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return [];
    }
    
    try {
        let processedData = rawData.map(item => ({
            label: item.producto_nombre || 'Sin nombre',
            y: safeParseFloat(item.total)
        }));
        
        if (filterOptions.rangeType === 'top') {
            processedData = processedData.sort((a, b) => b.y - a.y);
        } else if (filterOptions.rangeType === 'bottom') {
            processedData = processedData.sort((a, b) => a.y - b.y);
        } else {
            processedData = processedData.sort((a, b) => b.y - a.y);
        }
        
        if (filterOptions.count && filterOptions.count !== 'all') {
            const n = parseInt(filterOptions.count);
            processedData = processedData.slice(0, n);
        }
        
        return processedData;
    } catch (error) {
        console.error('Error in processIngresosPorProducto:', error);
        return [];
    }
}

/**
 * Procesa datos de ventas por producto
 */
function processVentasPorProducto(rawData, filterOptions = {}) {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return [];
    }
    
    try {
        let processedData = rawData.map(item => ({
            label: item.producto_nombre || 'Sin nombre',
            y: parseInt(item.total) || 0
        }));
        
        if (filterOptions.rangeType === 'top') {
            processedData = processedData.sort((a, b) => b.y - a.y);
        } else if (filterOptions.rangeType === 'bottom') {
            processedData = processedData.sort((a, b) => a.y - b.y);
        } else {
            processedData = processedData.sort((a, b) => b.y - a.y);
        }
        
        if (filterOptions.count && filterOptions.count !== 'all') {
            const n = parseInt(filterOptions.count);
            processedData = processedData.slice(0, n);
        }
        
        return processedData;
    } catch (error) {
        console.error('Error in processVentasPorProducto:', error);
        return [];
    }
}

/**
 * Procesa datos de no shows para tabla numérica
 */
function processNoShowTableData(rawData) {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        console.log('No hay datos de no shows o datos vacíos');
        return [];
    }
    
    console.log('Datos de no shows recibidos:', rawData);
    
    try {
        return rawData.map((item, index) => {
            console.log(`Procesando item ${index}:`, item);
            
            // Intentar diferentes nombres de campos que podrían venir del backend
            const clienteNombre = item.cliente_nombre || item.nombre || item.name || `Cliente ${item.cliente_id || index + 1}`;
            const clienteEmail = item.cliente_email || item.email || item.correo || 'No disponible';
            const clienteTelefono = item.cliente_telefono || item.telefono || item.phone || 'No disponible';
            const noShows = parseInt(item.no_shows || item.noShows || item.cantidad || 0);
            const ultimoNoShow = item.ultimo_no_show || item.ultimoNoShow || item.fecha || null;
            
            return {
                clienteId: item.cliente_id || item.id || index + 1,
                clienteNombre: clienteNombre,
                clienteEmail: clienteEmail,
                clienteTelefono: clienteTelefono,
                noShows: noShows,
                ultimoNoShow: ultimoNoShow ? safeFormatDate(ultimoNoShow) : 'No disponible'
            };
        }).sort((a, b) => b.noShows - a.noShows);
    } catch (error) {
        console.error('Error in processNoShowTableData:', error);
        console.error('Datos que causaron el error:', rawData);
        return [];
    }
}

function filterTopN(data, n, sortBy = 'value') {
    if (n === 'all') return data;
    try {
        return data.sort((a, b) => safeParseFloat(b[sortBy]) - safeParseFloat(a[sortBy])).slice(0, parseInt(n));
    } catch (error) {
        console.error('Error in filterTopN:', error);
        return data;
    }
}

function filterByRange(data, type = 'all') {
    if (type === 'all') return data;
    try {
        return [...data].sort((a, b) => {
            const aVal = safeParseFloat(a.value || a.total);
            const bVal = safeParseFloat(b.value || b.total);
            return type === 'top' ? bVal - aVal : aVal - bVal;
        });
    } catch (error) {
        console.error('Error in filterByRange:', error);
        return data;
    }
}

function filterByDateRange(data, startDate, endDate) {
    if (!startDate || !endDate) return data;
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return data.filter(item => {
            const itemDate = new Date(item.fecha || item.date);
            return itemDate >= start && itemDate <= end;
        });
    } catch (error) {
        console.error('Error in filterByDateRange:', error);
        return data;
    }
}

function formatCurrency(value) {
    try {
        const numValue = safeParseFloat(value);
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(numValue);
    } catch (error) {
        console.error('Error in formatCurrency:', error);
        return '$0.00';
    }
}

function formatDate(dateString) {
    return safeFormatDate(dateString);
}

function sortDataByValue(data, ascending = false) {
    try {
        return [...data].sort((a, b) => {
            const aVal = safeParseFloat(a.value || a.total);
            const bVal = safeParseFloat(b.value || b.total);
            return ascending ? aVal - bVal : bVal - aVal;
        });
    } catch (error) {
        console.error('Error in sortDataByValue:', error);
        return data;
    }
}

// Exportar funciones para uso global
try {
    window.DataProcessor = {
        processIngresosPorFecha,
        processIngresosPorPago,
        processIngresosPorCamarero,
        processIngresosPorCliente,
        processIngresosPorProducto,
        processVentasPorProducto,
        processNoShowTableData,
        filterTopN,
        filterByRange,
        filterByDateRange,
        formatCurrency,
        formatDate,
        sortDataByValue
    };
    console.log('DataProcessor loaded successfully');
} catch (error) {
    console.error('Error exporting DataProcessor:', error);
}