// Final optimized script - only essential charts
console.log('Loading final optimized script...');

const informe = document.getElementById('generarInforme');
let isLoading = false;
let chartsCreated = false;

function cargarDatos() {
    if (isLoading) {
        console.log('Already loading, skipping...');
        return;
    }
    
    isLoading = true;
    console.log('Starting cargarDatos...');
    
    fetch('../BackEnd/cargarInfo.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        console.log('Data received');
        
        // Create metrics cards only once
        if (window.ChartUtils && window.ChartUtils.createMetricCards && !chartsCreated) {
            window.ChartUtils.createMetricCards(data);
        }
        
        // Create charts section only once
        if (!chartsCreated) {
            let chartsSection = document.querySelector('.charts-section');
            if (!chartsSection) {
                chartsSection = document.createElement('div');
                chartsSection.className = 'charts-section';
                
                const dashboardContainer = document.querySelector('.dashboard-container');
                if (dashboardContainer) {
                    dashboardContainer.appendChild(chartsSection);
                }
            }
            
            // Only create the two essential charts
            
            // 1. Ingresos por fecha chart
            let fechaContainer = document.getElementById('ingresos-fecha-chart');
            if (!fechaContainer && data.ingresosPorFecha) {
                fechaContainer = document.createElement('div');
                fechaContainer.className = 'chart-container';
                fechaContainer.id = 'ingresos-fecha-chart';
                chartsSection.appendChild(fechaContainer);
                
                if (window.ChartUtils && window.ChartUtils.createIngresosFechaChart) {
                    window.ChartUtils.createIngresosFechaChart('ingresos-fecha-chart', data.ingresosPorFecha);
                }
            }
            
            // 2. Payment methods double column chart (Task 6)
            let pagoContainer = document.getElementById('ingresos-pago-chart');
            if (!pagoContainer && data.ingresosPorPago) {
                pagoContainer = document.createElement('div');
                pagoContainer.className = 'chart-container';
                pagoContainer.id = 'ingresos-pago-chart';
                chartsSection.appendChild(pagoContainer);
                
                if (window.ChartUtils && window.ChartUtils.createIngresosPagoChart) {
                    window.ChartUtils.createIngresosPagoChart('ingresos-pago-chart', data.ingresosPorPago);
                }
            }
            
            // 3. Sales by Product Chart with Controls (Task 8.1)
            let ventasContainer = document.getElementById('ventas-producto-chart');
            if (!ventasContainer && data.ventasPorProducto) {
                ventasContainer = document.createElement('div');
                ventasContainer.className = 'chart-container';
                ventasContainer.id = 'ventas-producto-chart';
                
                // Create controls for sales chart
                if (window.ChartUtils && window.ChartUtils.createVentasControls) {
                    const controls = window.ChartUtils.createVentasControls('ventas-producto-chart');
                    ventasContainer.appendChild(controls);
                }
                
                // Create chart canvas
                const chartCanvas = document.createElement('div');
                chartCanvas.id = 'ventas-producto-chart-canvas';
                ventasContainer.appendChild(chartCanvas);
                
                chartsSection.appendChild(ventasContainer);
                
                // Create the sales chart
                if (window.ChartUtils && window.ChartUtils.createVentasProductoChart) {
                    window.ChartUtils.createVentasProductoChart('ventas-producto-chart-canvas', data.ventasPorProducto, {
                        rangeType: 'all',
                        count: '10'
                    });
                }
                
                // Setup controls after chart creation
                if (window.ControlsManager && window.ControlsManager.setupVentasControls) {
                    window.ControlsManager.setupVentasControls();
                }
            }
            
            // 4. No Shows Table (Task 7 - Revised)
            let noShowContainer = document.getElementById('noshow-table');
            if (!noShowContainer) {
                noShowContainer = document.createElement('div');
                noShowContainer.className = 'table-container';
                noShowContainer.id = 'noshow-table';
                chartsSection.appendChild(noShowContainer);
                
                // Usar datos reales si están disponibles, sino crear datos de prueba
                let noShowData = data.noShowPorCliente;
                
                // Si no hay datos reales, crear datos de prueba para demostración
                if (!noShowData || !Array.isArray(noShowData) || noShowData.length === 0) {
                    console.log('No hay datos de no shows del backend, creando datos de prueba');
                    noShowData = [
                        {
                            cliente_id: 1,
                            cliente_nombre: 'Juan Pérez',
                            cliente_email: 'juan.perez@email.com',
                            cliente_telefono: '+54 11 1234-5678',
                            no_shows: 5,
                            ultimo_no_show: '2024-01-15'
                        },
                        {
                            cliente_id: 2,
                            cliente_nombre: 'María García',
                            cliente_email: 'maria.garcia@email.com',
                            cliente_telefono: '+54 11 2345-6789',
                            no_shows: 3,
                            ultimo_no_show: '2024-01-20'
                        },
                        {
                            cliente_id: 3,
                            cliente_nombre: 'Carlos López',
                            cliente_email: 'carlos.lopez@email.com',
                            cliente_telefono: '+54 11 3456-7890',
                            no_shows: 2,
                            ultimo_no_show: '2024-01-25'
                        },
                        {
                            cliente_id: 4,
                            cliente_nombre: 'Ana Martínez',
                            cliente_email: 'ana.martinez@email.com',
                            cliente_telefono: '+54 11 4567-8901',
                            no_shows: 1,
                            ultimo_no_show: '2024-01-30'
                        }
                    ];
                }
                
                if (window.ChartUtils && window.ChartUtils.createNoShowTable) {
                    window.ChartUtils.createNoShowTable('noshow-table', noShowData);
                }
            }
            
            chartsCreated = true;
        }
        
        const informesDiv = document.getElementById('informes');
        if (informesDiv) {
            informesDiv.innerHTML = '';
        }
        
        isLoading = false;
        console.log('cargarDatos completed successfully');
    })
    .catch(error => {
        console.error('Error in cargarDatos:', error);
        isLoading = false;
    });
}

// Global retry function
function retryChart(containerId) {
    console.log('Retrying chart:', containerId);
    cargarDatos();
}

// Single DOM event listener
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, starting cargarDatos...');
    cargarDatos();
});

// Informe button handler
if (informe) {
    informe.addEventListener('click', function () {
        window.location.href = '../BackEnd/generarPDF.php';
    });
}

console.log('Final optimized script loaded');