/**
 * Chart Utilities - Funciones para crear y gestionar gráficas con CanvasJS
 * Módulo funcional para el sistema de estadísticas
 */

// Registro de gráficas activas
const activeCharts = new Map();

/**
 * Inicializa todas las gráficas del dashboard
 * @param {Object} data - Datos del backend
 */
function initializeCharts(data) {
    // Esta función será implementada en tareas posteriores
    console.log('Inicializando gráficas con datos:', data);
}

/**
 * Crea tarjetas de métricas individuales
 * @param {Object} data - Datos de métricas
 */
function createMetricCards(data) {
    const metricsContainer = getOrCreateMetricsContainer();
    
    // Crear tarjeta de ingresos totales
    if (data.ingresosTotales && data.ingresosTotales.length > 0) {
        const ingresosCard = createMetricCard(
            'ingresos-totales-card',
            formatCurrency(data.ingresosTotales[0].total_ingresos),
            'Ingresos Totales',
            'success'
        );
        metricsContainer.appendChild(ingresosCard);
    }
    
    // Crear tarjeta de clientes totales
    if (data.cantidadClientes && data.cantidadClientes.length > 0) {
        const clientesCard = createMetricCard(
            'clientes-totales-card',
            formatNumber(data.cantidadClientes[0].total_clientes),
            'Clientes Registrados',
            'info'
        );
        metricsContainer.appendChild(clientesCard);
    }
    
    // Crear tarjeta de personal total
    if (data.cantidadPersonal && data.cantidadPersonal.length > 0) {
        const personalCard = createMetricCard(
            'personal-total-card',
            formatNumber(data.cantidadPersonal[0].total_personal),
            'Personal Registrado',
            'primary'
        );
        metricsContainer.appendChild(personalCard);
    }
}

/**
 * Crea una tarjeta de métrica individual
 * @param {string} id - ID único de la tarjeta
 * @param {string} value - Valor a mostrar
 * @param {string} label - Etiqueta descriptiva
 * @param {string} type - Tipo de métrica (success, info, primary, warning, danger)
 * @returns {HTMLElement} Elemento de la tarjeta
 */
function createMetricCard(id, value, label, type = 'primary') {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.id = id;
    
    // Agregar clase de tipo para colores específicos
    card.classList.add(`metric-card--${type}`);
    
    const valueElement = document.createElement('div');
    valueElement.className = 'metric-value';
    valueElement.textContent = value;
    
    const labelElement = document.createElement('div');
    labelElement.className = 'metric-label';
    labelElement.textContent = label;
    
    // Agregar indicador de carga
    const loadingElement = document.createElement('div');
    loadingElement.className = 'metric-loading';
    loadingElement.innerHTML = '<div class="loading-spinner"></div>';
    loadingElement.style.display = 'none';
    
    card.appendChild(valueElement);
    card.appendChild(labelElement);
    card.appendChild(loadingElement);
    
    return card;
}

/**
 * Obtiene o crea el contenedor de métricas
 * @returns {HTMLElement} Contenedor de métricas
 */
function getOrCreateMetricsContainer() {
    let container = document.querySelector('.metrics-section');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'metrics-section';
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (dashboardContainer) {
            dashboardContainer.prepend(container);
        } else {
            const informesDiv = document.getElementById('informes');
            if (informesDiv && informesDiv.parentNode) {
                informesDiv.parentNode.insertBefore(container, informesDiv);
            } else {
                const mainContainer = document.querySelector('.contenedor');
                if (mainContainer) {
                    mainContainer.appendChild(container);
                }
            }
        }
    }
    
    return container;
}

/**
 * Formatea un valor monetario
 * @param {string|number} value - Valor a formatear
 * @returns {string} Valor formateado como moneda
 */
function formatCurrency(value) {
    const numValue = parseFloat(value) || 0;
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numValue);
}

/**
 * Formatea un número grande con separadores de miles
 * @param {string|number} value - Valor a formatear
 * @returns {string} Número formateado
 */
function formatNumber(value) {
    const numValue = parseInt(value) || 0;
    return new Intl.NumberFormat('es-AR').format(numValue);
}

/**
 * Obtiene configuración responsiva basada en el tamaño de pantalla
 * @param {string} chartType - Tipo de gráfica (opcional)
 * @returns {Object} Configuración responsiva
 */
function getResponsiveConfig(chartType = 'default') {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 767) {
        // Móvil
        const baseConfig = {
            height: 250,
            title: { fontSize: 14 },
            axisX: { 
                labelFontSize: 10,
                labelAngle: -45,
                interval: 2 // Mostrar menos etiquetas en móvil
            },
            axisY: { 
                labelFontSize: 10,
                valueFormatString: "#,##0.0,,M" // Formato más compacto
            },
            data: [{
                markerSize: 4,
                lineThickness: 2
            }]
        };
        
        // Configuraciones específicas para columnas dobles en móvil
        if (chartType === 'doubleColumn') {
            return {
                ...baseConfig,
                height: 280, // Altura ligeramente mayor para acomodar dos series
                axisX: {
                    ...baseConfig.axisX,
                    labelAngle: -30, // Ángulo menos pronunciado para mejor legibilidad
                    labelFontSize: 9,
                    interval: 1 // Mostrar todas las etiquetas pero más pequeñas
                },
                axisY: [
                    {
                        labelFontSize: 9,
                        valueFormatString: "#,##0.0,K", // Formato compacto para montos
                        titleFontSize: 10
                    },
                    {
                        labelFontSize: 9,
                        titleFontSize: 10
                    }
                ],
                legend: {
                    fontSize: 10,
                    horizontalAlign: "center",
                    verticalAlign: "bottom"
                },
                data: [
                    { columnWidth: 60 }, // Columnas más estrechas en móvil
                    { columnWidth: 60 }
                ]
            };
        }
        
        return baseConfig;
    } else if (screenWidth <= 1199) {
        // Tablet
        const baseConfig = {
            height: 300,
            title: { fontSize: 16 },
            axisX: { 
                labelFontSize: 11,
                interval: 1
            },
            axisY: { 
                labelFontSize: 11,
                valueFormatString: "#,##0.0,K"
            },
            data: [{
                markerSize: 5,
                lineThickness: 2.5
            }]
        };
        
        // Configuraciones específicas para columnas dobles en tablet
        if (chartType === 'doubleColumn') {
            return {
                ...baseConfig,
                height: 320,
                axisY: [
                    {
                        labelFontSize: 11,
                        valueFormatString: "#,##0.0,K",
                        titleFontSize: 12
                    },
                    {
                        labelFontSize: 11,
                        titleFontSize: 12
                    }
                ],
                legend: {
                    fontSize: 11,
                    horizontalAlign: "center",
                    verticalAlign: "bottom"
                },
                data: [
                    { columnWidth: 70 },
                    { columnWidth: 70 }
                ]
            };
        }
        
        return baseConfig;
    } else {
        // Desktop
        const baseConfig = {
            height: 350,
            title: { fontSize: 18 },
            axisX: { 
                labelFontSize: 12,
                interval: 1
            },
            axisY: { 
                labelFontSize: 12,
                valueFormatString: "#,##0"
            },
            data: [{
                markerSize: 6,
                lineThickness: 3
            }]
        };
        
        // Configuraciones específicas para columnas dobles en desktop
        if (chartType === 'doubleColumn') {
            return {
                ...baseConfig,
                height: 380,
                axisY: [
                    {
                        labelFontSize: 12,
                        valueFormatString: "#,##0",
                        titleFontSize: 14
                    },
                    {
                        labelFontSize: 12,
                        titleFontSize: 14
                    }
                ],
                legend: {
                    fontSize: 12,
                    horizontalAlign: "center",
                    verticalAlign: "bottom"
                },
                data: [
                    { columnWidth: 80 },
                    { columnWidth: 80 }
                ]
            };
        }
        
        return baseConfig;
    }
}

/**
 * Crea una gráfica de área
 * @param {string} containerId - ID del contenedor
 * @param {Array} data - Datos para la gráfica
 * @param {Object} config - Configuración de la gráfica
 */
function createAreaChart(containerId, data, config) {
    try {
        // Destruir gráfica existente si existe
        destroyChart(containerId);
        
        // Obtener configuración responsiva
        const responsiveConfig = getResponsiveConfig();
        
        // Configuración por defecto para gráfica de área
        const defaultConfig = {
            animationEnabled: true,
            theme: "light2",
            zoomEnabled: true,
            height: responsiveConfig.height,
            title: { 
                text: "Ingresos por Fecha",
                fontFamily: "Poppins",
                fontSize: responsiveConfig.title.fontSize,
                fontColor: "#1c1c1c"
            },
            axisX: { 
                valueFormatString: "DD MMM",
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontSize: responsiveConfig.axisX.labelFontSize,
                labelFontColor: "#363636",
                labelAngle: responsiveConfig.axisX.labelAngle || 0,
                interval: responsiveConfig.axisX.interval
            },
            axisY: { 
                prefix: "$",
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontSize: responsiveConfig.axisY.labelFontSize,
                labelFontColor: "#363636",
                valueFormatString: responsiveConfig.axisY.valueFormatString
            },
            data: [{
                type: "area",
                color: "#363636",
                fillOpacity: 0.3,
                markerColor: "#1c1c1c",
                markerSize: responsiveConfig.data[0].markerSize,
                lineThickness: responsiveConfig.data[0].lineThickness,
                dataPoints: data || []
            }]
        };
        
        // Combinar configuración por defecto con la personalizada
        const finalConfig = { ...defaultConfig, ...config };
        if (config && config.data && config.data[0]) {
            finalConfig.data[0] = { ...defaultConfig.data[0], ...config.data[0] };
        }
        
        const containerEl = document.getElementById(containerId);
        if (containerEl) {
            containerEl.style.width = '100%';
            containerEl.style.display = 'block';
            containerEl.style.boxSizing = 'border-box';
        }
        const chart = new CanvasJS.Chart(containerId, finalConfig);
        chart.render();
        
        // Registrar la gráfica
        activeCharts.set(containerId, chart);
        
        // Agregar listener para redimensionamiento
        const resizeHandler = () => {
            if (chart && chart.render) {
                // Actualizar configuración responsiva
                const newResponsiveConfig = getResponsiveConfig();
                chart.options.height = newResponsiveConfig.height;
                chart.options.title.fontSize = newResponsiveConfig.title.fontSize;
                chart.options.axisX.labelFontSize = newResponsiveConfig.axisX.labelFontSize;
                chart.options.axisX.labelAngle = newResponsiveConfig.axisX.labelAngle || 0;
                chart.options.axisX.interval = newResponsiveConfig.axisX.interval;
                chart.options.axisY.labelFontSize = newResponsiveConfig.axisY.labelFontSize;
                chart.options.axisY.valueFormatString = newResponsiveConfig.axisY.valueFormatString;
                chart.options.data[0].markerSize = newResponsiveConfig.data[0].markerSize;
                chart.options.data[0].lineThickness = newResponsiveConfig.data[0].lineThickness;
                
                chart.render();
            }
        };
        
        // Debounce para evitar múltiples renders
        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeHandler, 250);
        };
        
        window.addEventListener('resize', debouncedResize);
        
        // Guardar referencia al handler para limpieza posterior
        chart._resizeHandler = debouncedResize;
        
        return chart;
    } catch (error) {
        console.error('Error creando gráfica de área:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea una gráfica de barras
 * @param {string} containerId - ID del contenedor
 * @param {Array} data - Datos para la gráfica
 * @param {Object} config - Configuración de la gráfica
 */
function createBarChart(containerId, data, config) {
    try {
        // Destruir gráfica existente si existe
        destroyChart(containerId);
        
        // Obtener configuración responsiva
        const responsiveConfig = getResponsiveConfig();
        
        // Configuración por defecto para gráfica de barras horizontales
        const defaultConfig = {
            animationEnabled: true,
            theme: "light2",
            height: responsiveConfig.height,
            title: { 
                text: "Gráfica de Barras",
                fontFamily: "Poppins",
                fontSize: responsiveConfig.title.fontSize,
                fontColor: "#1c1c1c"
            },
            axisX: { 
                prefix: "$",
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontSize: responsiveConfig.axisX.labelFontSize,
                labelFontColor: "#363636",
                valueFormatString: responsiveConfig.axisY.valueFormatString
            },
            axisY: { 
                interval: 1,
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontSize: responsiveConfig.axisY.labelFontSize,
                labelFontColor: "#363636"
            },
            data: [{
                type: "bar",
                color: "#363636",
                dataPoints: data || []
            }]
        };
        
        // Combinar configuración por defecto con la personalizada
        const finalConfig = { ...defaultConfig, ...config };
        if (config && config.data && config.data[0]) {
            finalConfig.data[0] = { ...defaultConfig.data[0], ...config.data[0] };
        }
        
        const containerEl = document.getElementById(containerId);
        if (containerEl) {
            containerEl.style.width = '100%';
            containerEl.style.display = 'block';
            containerEl.style.boxSizing = 'border-box';
        }
        const chart = new CanvasJS.Chart(containerId, finalConfig);
        chart.render();
        
        // Registrar la gráfica
        activeCharts.set(containerId, chart);
        
        // Agregar listener para redimensionamiento
        const resizeHandler = () => {
            if (chart && chart.render) {
                // Actualizar configuración responsiva
                const newResponsiveConfig = getResponsiveConfig();
                chart.options.height = newResponsiveConfig.height;
                chart.options.title.fontSize = newResponsiveConfig.title.fontSize;
                chart.options.axisX.labelFontSize = newResponsiveConfig.axisX.labelFontSize;
                chart.options.axisX.valueFormatString = newResponsiveConfig.axisY.valueFormatString;
                chart.options.axisY.labelFontSize = newResponsiveConfig.axisY.labelFontSize;
                
                chart.render();
            }
        };
        
        // Debounce para evitar múltiples renders
        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeHandler, 250);
        };
        
        window.addEventListener('resize', debouncedResize);
        
        // Guardar referencia al handler para limpieza posterior
        chart._resizeHandler = debouncedResize;
        
        return chart;
    } catch (error) {
        console.error('Error creando gráfica de barras:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea una gráfica de columnas
 * @param {string} containerId - ID del contenedor
 * @param {Array} data - Datos para la gráfica
 * @param {Object} config - Configuración de la gráfica
 */
function createColumnChart(containerId, data, config) {
    try {
        // Destruir gráfica existente si existe
        destroyChart(containerId);
        
        // Obtener configuración responsiva
        const responsiveConfig = getResponsiveConfig();
        
        // Configuración por defecto para gráfica de columnas verticales
        const defaultConfig = {
            animationEnabled: true,
            theme: "light2",
            height: responsiveConfig.height,
            title: { 
                text: "Gráfica de Columnas",
                fontFamily: "Poppins",
                fontSize: responsiveConfig.title.fontSize,
                fontColor: "#1c1c1c"
            },
            axisX: { 
                interval: 1,
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontSize: responsiveConfig.axisX.labelFontSize,
                labelFontColor: "#363636",
                labelAngle: responsiveConfig.axisX.labelAngle || 0
            },
            axisY: { 
                prefix: "$",
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontSize: responsiveConfig.axisY.labelFontSize,
                labelFontColor: "#363636",
                valueFormatString: responsiveConfig.axisY.valueFormatString
            },
            data: [{
                type: "column",
                color: "#363636",
                dataPoints: data || []
            }]
        };
        
        // Combinar configuración por defecto con la personalizada (merge profundo en claves comunes)
        const finalConfig = { ...defaultConfig, ...config };
        finalConfig.title = { ...defaultConfig.title, ...(config && config.title ? config.title : {}) };
        finalConfig.axisX = { ...defaultConfig.axisX, ...(config && config.axisX ? config.axisX : {}) };
        finalConfig.axisY = { ...defaultConfig.axisY, ...(config && config.axisY ? config.axisY : {}) };
        if (config && config.data && config.data[0]) {
            finalConfig.data[0] = { ...defaultConfig.data[0], ...config.data[0] };
        }
        
        // Crear la gráfica
        const chart = new CanvasJS.Chart(containerId, finalConfig);
        chart.render();
        
        // Registrar la gráfica
        activeCharts.set(containerId, chart);
        
        // Observer de cambios de tamaño del contenedor para re-render sin depender de window.resize
        const containerNode = document.getElementById(containerId);
        if (containerNode && typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(() => {
                try {
                    chart.render();
                } catch (e) {}
            });
            resizeObserver.observe(containerNode);
            chart._resizeObserver = resizeObserver;
        }

        // Agregar listener para redimensionamiento
        const resizeHandler = () => {
            if (chart && chart.render) {
                // Actualizar configuración responsiva
                const newResponsiveConfig = getResponsiveConfig();
                chart.options.height = newResponsiveConfig.height;
                chart.options.title.fontSize = newResponsiveConfig.title.fontSize;
                chart.options.axisX.labelFontSize = newResponsiveConfig.axisX.labelFontSize;
                chart.options.axisX.labelAngle = newResponsiveConfig.axisX.labelAngle || 0;
                chart.options.axisY.labelFontSize = newResponsiveConfig.axisY.labelFontSize;
                chart.options.axisY.valueFormatString = newResponsiveConfig.axisY.valueFormatString;
                
                chart.render();
            }
        };
        
        // Debounce para evitar múltiples renders
        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeHandler, 250);
        };
        
        window.addEventListener('resize', debouncedResize);
        
        // Guardar referencia al handler para limpieza posterior
        chart._resizeHandler = debouncedResize;
        
        return chart;
    } catch (error) {
        console.error('Error creando gráfica de columnas:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea una gráfica de columnas dobles
 * @param {string} containerId - ID del contenedor
 * @param {Object} data - Datos con series de monto y porcentaje
 * @param {Object} config - Configuración de la gráfica
 */
function createDoubleColumnChart(containerId, data, config) {
    try {
        // Destruir gráfica existente si existe
        destroyChart(containerId);
        
        // Obtener configuración responsiva específica para columnas dobles
        const responsiveConfig = getResponsiveConfig('doubleColumn');
        
        // Configuración por defecto para gráfica de columnas dobles
        const defaultConfig = {
            animationEnabled: true,
            theme: "light2",
            height: responsiveConfig.height,
            title: { 
                text: "Distribución de Métodos de Pago",
                fontFamily: "Poppins",
                fontSize: responsiveConfig.title.fontSize,
                fontColor: "#1c1c1c"
            },
            axisX: { 
                interval: responsiveConfig.axisX.interval,
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontSize: responsiveConfig.axisX.labelFontSize,
                labelFontColor: "#363636",
                labelAngle: responsiveConfig.axisX.labelAngle || 0
            },
            axisY: [
                {
                    title: "Monto ($)",
                    titleFontSize: responsiveConfig.axisY[0].titleFontSize,
                    prefix: "$",
                    gridColor: "#f1f1f1",
                    labelFontFamily: "Poppins",
                    labelFontSize: responsiveConfig.axisY[0].labelFontSize,
                    labelFontColor: "#363636",
                    valueFormatString: responsiveConfig.axisY[0].valueFormatString
                },
                {
                    title: "Porcentaje (%)",
                    titleFontSize: responsiveConfig.axisY[1].titleFontSize,
                    suffix: "%",
                    gridColor: "#f1f1f1",
                    labelFontFamily: "Poppins",
                    labelFontSize: responsiveConfig.axisY[1].labelFontSize,
                    labelFontColor: "#363636"
                }
            ],
            legend: {
                fontFamily: "Poppins",
                fontSize: responsiveConfig.legend.fontSize,
                horizontalAlign: responsiveConfig.legend.horizontalAlign,
                verticalAlign: responsiveConfig.legend.verticalAlign
            },
            data: [
                {
                    type: "column",
                    name: "Monto",
                    color: "#363636",
                    showInLegend: true,
                    columnWidth: responsiveConfig.data[0].columnWidth,
                    dataPoints: data.montoData || []
                },
                {
                    type: "column",
                    name: "Porcentaje",
                    axisYType: "secondary",
                    color: "#1c1c1c",
                    showInLegend: true,
                    columnWidth: responsiveConfig.data[1].columnWidth,
                    dataPoints: data.porcentajeData || []
                }
            ]
        };
        
        // Combinar configuración por defecto con la personalizada
        const finalConfig = { ...defaultConfig, ...config };
        if (config && config.data) {
            if (config.data[0]) {
                finalConfig.data[0] = { ...defaultConfig.data[0], ...config.data[0] };
            }
            if (config.data[1]) {
                finalConfig.data[1] = { ...defaultConfig.data[1], ...config.data[1] };
            }
        }
        
        // Crear la gráfica
        const chart = new CanvasJS.Chart(containerId, finalConfig);
        chart.render();
        
        // Registrar la gráfica
        activeCharts.set(containerId, chart);
        
        // Agregar listener para redimensionamiento
        const resizeHandler = () => {
            if (chart && chart.render) {
                // Actualizar configuración responsiva específica para columnas dobles
                const newResponsiveConfig = getResponsiveConfig('doubleColumn');
                chart.options.height = newResponsiveConfig.height;
                chart.options.title.fontSize = newResponsiveConfig.title.fontSize;
                chart.options.axisX.labelFontSize = newResponsiveConfig.axisX.labelFontSize;
                chart.options.axisX.labelAngle = newResponsiveConfig.axisX.labelAngle || 0;
                chart.options.axisX.interval = newResponsiveConfig.axisX.interval;
                chart.options.axisY[0].labelFontSize = newResponsiveConfig.axisY[0].labelFontSize;
                chart.options.axisY[0].valueFormatString = newResponsiveConfig.axisY[0].valueFormatString;
                chart.options.axisY[0].titleFontSize = newResponsiveConfig.axisY[0].titleFontSize;
                chart.options.axisY[1].labelFontSize = newResponsiveConfig.axisY[1].labelFontSize;
                chart.options.axisY[1].titleFontSize = newResponsiveConfig.axisY[1].titleFontSize;
                chart.options.legend.fontSize = newResponsiveConfig.legend.fontSize;
                chart.options.data[0].columnWidth = newResponsiveConfig.data[0].columnWidth;
                chart.options.data[1].columnWidth = newResponsiveConfig.data[1].columnWidth;
                
                chart.render();
            }
        };
        
        // Debounce para evitar múltiples renders
        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeHandler, 250);
        };
        
        window.addEventListener('resize', debouncedResize);
        
        // Guardar referencia al handler para limpieza posterior
        chart._resizeHandler = debouncedResize;
        
        return chart;
    } catch (error) {
        console.error('Error creando gráfica de columnas dobles:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea una gráfica de línea
 * @param {string} containerId - ID del contenedor
 * @param {Array} data - Datos para la gráfica
 * @param {Object} config - Configuración de la gráfica
 */
function createLineChart(containerId, data, config) {
    try {
        // Destruir gráfica existente si existe
        destroyChart(containerId);
        
        // Obtener configuración responsiva
        const responsiveConfig = getResponsiveConfig();
        
        // Configuración por defecto para gráfica de línea
        const defaultConfig = {
            animationEnabled: true,
            theme: "light2",
            zoomEnabled: true,
            height: responsiveConfig.height,
            title: { 
                text: "Gráfica de Línea",
                fontFamily: "Poppins",
                fontSize: responsiveConfig.title.fontSize,
                fontColor: "#1c1c1c"
            },
            axisX: { 
                valueFormatString: "DD MMM",
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontSize: responsiveConfig.axisX.labelFontSize,
                labelFontColor: "#363636",
                labelAngle: responsiveConfig.axisX.labelAngle || 0,
                interval: responsiveConfig.axisX.interval
            },
            axisY: { 
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontSize: responsiveConfig.axisY.labelFontSize,
                labelFontColor: "#363636",
                valueFormatString: "#,##0"
            },
            data: [{
                type: "line",
                color: "#363636",
                markerColor: "#363636",
                markerSize: responsiveConfig.data[0].markerSize,
                lineThickness: responsiveConfig.data[0].lineThickness,
                dataPoints: data || []
            }]
        };
        
        // Combinar configuración por defecto con la personalizada
        const finalConfig = { ...defaultConfig, ...config };
        if (config && config.data && config.data[0]) {
            finalConfig.data[0] = { ...defaultConfig.data[0], ...config.data[0] };
        }
        
        // Crear la gráfica
        const chart = new CanvasJS.Chart(containerId, finalConfig);
        chart.render();
        
        // Registrar la gráfica
        activeCharts.set(containerId, chart);
        
        // Observer de cambios de tamaño del contenedor para re-render sin depender de window.resize
        const containerNode = document.getElementById(containerId);
        if (containerNode && typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(() => {
                try {
                    chart.render();
                } catch (e) {}
            });
            resizeObserver.observe(containerNode);
            chart._resizeObserver = resizeObserver;
        }

        // Agregar listener para redimensionamiento
        const resizeHandler = () => {
            if (chart && chart.render) {
                // Actualizar configuración responsiva
                const newResponsiveConfig = getResponsiveConfig();
                chart.options.height = newResponsiveConfig.height;
                chart.options.title.fontSize = newResponsiveConfig.title.fontSize;
                chart.options.axisX.labelFontSize = newResponsiveConfig.axisX.labelFontSize;
                chart.options.axisX.labelAngle = newResponsiveConfig.axisX.labelAngle || 0;
                chart.options.axisX.interval = newResponsiveConfig.axisX.interval;
                chart.options.axisY.labelFontSize = newResponsiveConfig.axisY.labelFontSize;
                chart.options.data[0].markerSize = newResponsiveConfig.data[0].markerSize;
                chart.options.data[0].lineThickness = newResponsiveConfig.data[0].lineThickness;
                
                chart.render();
            }
        };
        
        // Debounce para evitar múltiples renders
        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeHandler, 250);
        };
        
        window.addEventListener('resize', debouncedResize);
        
        // Guardar referencia al handler para limpieza posterior
        chart._resizeHandler = debouncedResize;
        
        return chart;
    } catch (error) {
        console.error('Error creando gráfica de línea:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Actualiza una gráfica existente
 * @param {string} chartId - ID de la gráfica
 * @param {Array} newData - Nuevos datos
 */
function updateChart(chartId, newData) {
    // Esta función será implementada en tareas posteriores
    console.log('Actualizando gráfica:', chartId);
}

/**
 * Destruye una gráfica
 * @param {string} chartId - ID de la gráfica
 */
function destroyChart(chartId) {
    if (activeCharts.has(chartId)) {
        const chart = activeCharts.get(chartId);
        if (chart) {
            // Limpiar listener de resize si existe
            if (chart._resizeHandler) {
                window.removeEventListener('resize', chart._resizeHandler);
            }
            // Desconectar observer de tamaño si existe
            if (chart._resizeObserver && chart._resizeObserver.disconnect) {
                chart._resizeObserver.disconnect();
            }
            
            // Destruir la gráfica
            if (chart.destroy) {
                chart.destroy();
            }
        }
        activeCharts.delete(chartId);
    }
}

/**
 * Actualiza el valor de una tarjeta de métrica con animación
 * @param {string} cardId - ID de la tarjeta
 * @param {string} newValue - Nuevo valor a mostrar
 * @param {string} newLabel - Nueva etiqueta (opcional)
 */
function updateMetricCard(cardId, newValue, newLabel = null) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    const valueElement = card.querySelector('.metric-value');
    const labelElement = card.querySelector('.metric-label');
    
    if (valueElement) {
        // Agregar clase de actualización
        valueElement.classList.add('updating');
        
        // Actualizar valor después de la animación
        setTimeout(() => {
            valueElement.textContent = newValue;
            valueElement.classList.remove('updating');
            valueElement.classList.add('updated');
            
            // Remover clase de actualización después de la animación
            setTimeout(() => {
                valueElement.classList.remove('updated');
            }, 500);
        }, 150);
    }
    
    if (newLabel && labelElement) {
        labelElement.textContent = newLabel;
    }
}

/**
 * Actualiza todas las tarjetas de métricas con nuevos datos
 * @param {Object} data - Nuevos datos de métricas
 */
function updateAllMetricCards(data) {
    // Actualizar ingresos totales
    if (data.ingresosTotales && data.ingresosTotales.length > 0) {
        updateMetricCard(
            'ingresos-totales-card',
            formatCurrency(data.ingresosTotales[0].total_ingresos)
        );
    }
    
    // Actualizar clientes totales
    if (data.cantidadClientes && data.cantidadClientes.length > 0) {
        updateMetricCard(
            'clientes-totales-card',
            formatNumber(data.cantidadClientes[0].total_clientes)
        );
    }
    
    // Actualizar personal total
    if (data.cantidadPersonal && data.cantidadPersonal.length > 0) {
        updateMetricCard(
            'personal-total-card',
            formatNumber(data.cantidadPersonal[0].total_personal)
        );
    }
}

/**
 * Muestra indicador de carga en una tarjeta de métrica
 * @param {string} cardId - ID de la tarjeta
 */
function showMetricLoading(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    const loadingElement = card.querySelector('.metric-loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
}

/**
 * Oculta indicador de carga en una tarjeta de métrica
 * @param {string} cardId - ID de la tarjeta
 */
function hideMetricLoading(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    const loadingElement = card.querySelector('.metric-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

/**
 * Muestra indicadores de carga en todas las tarjetas de métricas
 */
function showAllMetricsLoading() {
    const metricCards = ['ingresos-totales-card', 'clientes-totales-card', 'personal-total-card'];
    metricCards.forEach(cardId => showMetricLoading(cardId));
}

/**
 * Oculta indicadores de carga en todas las tarjetas de métricas
 */
function hideAllMetricsLoading() {
    const metricCards = ['ingresos-totales-card', 'clientes-totales-card', 'personal-total-card'];
    metricCards.forEach(cardId => hideMetricLoading(cardId));
}

/**
 * Actualiza métricas con indicadores de carga
 * @param {Function} dataFetchFunction - Función que obtiene los datos
 * @returns {Promise} Promesa que resuelve cuando se completa la actualización
 */
async function refreshMetricsWithLoading(dataFetchFunction) {
    try {
        // Mostrar indicadores de carga
        showAllMetricsLoading();
        
        // Obtener nuevos datos
        const data = await dataFetchFunction();
        
        // Actualizar tarjetas
        updateAllMetricCards(data);
        
        // Ocultar indicadores de carga
        setTimeout(() => {
            hideAllMetricsLoading();
        }, 300);
        
        return data;
    } catch (error) {
        console.error('Error al actualizar métricas:', error);
        hideAllMetricsLoading();
        throw error;
    }
}

/**
 * Maneja errores en la creación de gráficas
 * @param {string} containerId - ID del contenedor
 * @param {Error} error - Error ocurrido
 */
function handleChartError(containerId, error) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="chart-error">
            <div class="error-icon">⚠️</div>
            <p class="error-message">Error al cargar la gráfica</p>
            <p class="error-details">${error.message || 'Error desconocido'}</p>
            <button class="retry-button" onclick="retryChart('${containerId}')">Reintentar</button>
        </div>
    `;
}

/**
 * Maneja casos de datos vacíos
 * @param {string} containerId - ID del contenedor
 * @param {string} message - Mensaje a mostrar
 */
function handleEmptyData(containerId, message = 'Sin datos disponibles') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="chart-empty">
            <div class="empty-icon">📊</div>
            <p class="empty-message">${message}</p>
        </div>
    `;
}

/**
 * Crea una gráfica temporal de ingresos por fecha
 * @param {string} containerId - ID del contenedor
 * @param {Array} rawData - Datos crudos del backend
 * @param {Object} customConfig - Configuración personalizada opcional
 */
function createIngresosFechaChart(containerId, rawData, customConfig = {}) {
    try {
        // Procesar datos
        const processedData = window.DataProcessor.processIngresosPorFecha(rawData);
        
        if (!processedData || processedData.length === 0) {
            handleEmptyData(containerId, 'No hay datos de ingresos por fecha disponibles');
            return null;
        }
        
        // Configuración específica para ingresos por fecha
        const config = {
            title: { text: "Ingresos por Fecha" },
            ...customConfig
        };
        
        return createAreaChart(containerId, processedData, config);
    } catch (error) {
        console.error('Error creando gráfica de ingresos por fecha:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea una gráfica de barras horizontales para ingresos por camarero
 * @param {string} containerId - ID del contenedor
 * @param {Array} rawData - Datos crudos del backend
 * @param {Object} customConfig - Configuración personalizada opcional
 */
function createIngresosCamareroChart(containerId, rawData, customConfig = {}) {
    try {
        // Procesar datos
        const processedData = window.DataProcessor.processIngresosPorCamarero(rawData);
        
        if (!processedData || processedData.length === 0) {
            handleEmptyData(containerId, 'No hay datos de ingresos por camarero disponibles');
            return null;
        }
        
        // Configuración específica para ingresos por camarero
        const config = {
            title: { text: "Ingresos por Camarero" },
            ...customConfig
        };
        
        return createBarChart(containerId, processedData, config);
    } catch (error) {
        console.error('Error creando gráfica de ingresos por camarero:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea una gráfica de barras horizontales para ingresos por cliente con controles
 * @param {string} containerId - ID del contenedor
 * @param {Array} rawData - Datos crudos del backend
 * @param {Object} filterOptions - Opciones de filtrado
 * @param {Object} customConfig - Configuración personalizada opcional
 */
function createIngresosClienteChart(containerId, rawData, filterOptions = {}, customConfig = {}) {
    try {
        // Procesar datos con filtros
        const processedData = window.DataProcessor.processIngresosPorCliente(rawData, filterOptions);
        
        if (!processedData || processedData.length === 0) {
            const filterText = filterOptions.topN && filterOptions.topN !== 'all' 
                ? `Top ${filterOptions.topN} clientes` 
                : 'todos los clientes';
            handleEmptyData(containerId, `No hay datos de ingresos para ${filterText}`);
            return null;
        }
        
        // Configuración específica para ingresos por cliente
        const titleText = filterOptions.topN && filterOptions.topN !== 'all' 
            ? `Ingresos por Cliente (Top ${filterOptions.topN})` 
            : "Ingresos por Cliente";
            
        const config = {
            title: { text: titleText },
            ...customConfig
        };
        
        return createBarChart(containerId, processedData, config);
    } catch (error) {
        console.error('Error creando gráfica de ingresos por cliente:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea el contenedor de controles para la gráfica de clientes
 * @param {string} containerId - ID del contenedor de la gráfica
 * @returns {HTMLElement} Elemento de controles
 */
function createClienteControls(containerId) {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'chart-controls';
    controlsDiv.innerHTML = `
        <label for="${containerId}-filter">Mostrar:</label>
        <select id="${containerId}-filter">
            <option value="5">Top 5 Clientes</option>
            <option value="10">Top 10 Clientes</option>
            <option value="15">Top 15 Clientes</option>
            <option value="all">Todos los Clientes</option>
        </select>
    `;
    
    return controlsDiv;
}

/**
 * Crea una gráfica de barras verticales para ingresos por producto con controles
 * @param {string} containerId - ID del contenedor
 * @param {Array} rawData - Datos crudos del backend
 * @param {Object} filterOptions - Opciones de filtrado
 * @param {Object} customConfig - Configuración personalizada opcional
 */
function createIngresosProductoChart(containerId, rawData, filterOptions = {}, customConfig = {}) {
    try {
        // Procesar datos con filtros
        const processedData = window.DataProcessor.processIngresosPorProducto(rawData, filterOptions);
        
        if (!processedData || processedData.length === 0) {
            let filterText = 'productos';
            if (filterOptions.rangeType === 'top') filterText = 'productos más vendidos';
            else if (filterOptions.rangeType === 'bottom') filterText = 'productos menos vendidos';
            if (filterOptions.count && filterOptions.count !== 'all') {
                filterText = `${filterOptions.count} ${filterText}`;
            }
            handleEmptyData(containerId, `No hay datos de ingresos para ${filterText}`);
            return null;
        }
        
        // Configuración específica para ingresos por producto (barras verticales)
        let titleText = "Ingresos por Producto";
        if (filterOptions.rangeType === 'top') titleText += " (Más Vendidos)";
        else if (filterOptions.rangeType === 'bottom') titleText += " (Menos Vendidos)";
        if (filterOptions.count && filterOptions.count !== 'all') {
            titleText += ` - ${filterOptions.count} productos`;
        }
        
        const config = {
            title: { text: titleText },
            data: [{
                type: "column", // Barras verticales para productos
                color: "#363636",
                dataPoints: processedData
            }],
            ...customConfig
        };
        
        return createColumnChart(containerId, processedData, config);
    } catch (error) {
        console.error('Error creando gráfica de ingresos por producto:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea el contenedor de controles para la gráfica de productos
 * @param {string} containerId - ID del contenedor de la gráfica
 * @returns {HTMLElement} Elemento de controles
 */
function createProductoControls(containerId) {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'chart-controls';
    controlsDiv.innerHTML = `
        <label>Filtrar productos:</label>
        <div class="radio-group">
            <label><input type="radio" name="${containerId}-filter" value="all" checked> Todos</label>
            <label><input type="radio" name="${containerId}-filter" value="top"> Más vendidos</label>
            <label><input type="radio" name="${containerId}-filter" value="bottom"> Menos vendidos</label>
        </div>
        <label for="${containerId}-count">Cantidad:</label>
        <select id="${containerId}-count">
            <option value="5">5 productos</option>
            <option value="10" selected>10 productos</option>
            <option value="15">15 productos</option>
            <option value="all">Todos</option>
        </select>
    `;
    
    return controlsDiv;
}

function createVentasProductoChart(containerId, rawData, filterOptions = {}, customConfig = {}) {
    try {
        // Procesar datos con filtros
        const processedData = window.DataProcessor.processVentasPorProducto(rawData, filterOptions);
        
        if (!processedData || processedData.length === 0) {
            let filterText = 'productos';
            if (filterOptions.rangeType === 'top') filterText = 'productos más vendidos';
            else if (filterOptions.rangeType === 'bottom') filterText = 'productos menos vendidos';
            if (filterOptions.count && filterOptions.count !== 'all') {
                filterText = `${filterOptions.count} ${filterText}`;
            }
            handleEmptyData(containerId, `No hay datos de ventas para ${filterText}`);
            return null;
        }
        
        // Configuración específica para ventas por producto (barras verticales)
        let titleText = "Ventas por Producto";
        if (filterOptions.rangeType === 'top') titleText += " (Más Vendidos)";
        else if (filterOptions.rangeType === 'bottom') titleText += " (Menos Vendidos)";
        if (filterOptions.count && filterOptions.count !== 'all') {
            titleText += ` - ${filterOptions.count} productos`;
        }
        
        const config = {
            title: { text: titleText },
            axisX: {
                labelWrap: false
            },
            axisY: { 
                title: "Cantidad de Ventas",
                gridColor: "#f1f1f1",
                labelFontFamily: "Poppins",
                labelFontColor: "#363636",
                valueFormatString: "#,##0"
            },
            data: [{
                type: "column", // Barras verticales para ventas
                color: "#28a745", // Color verde para diferenciarlo de ingresos
                dataPoints: processedData
            }],
            ...customConfig
        };
        
        return createColumnChart(containerId, processedData, config);
    } catch (error) {
        console.error('Error creando gráfica de ventas por producto:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea el contenedor de controles para la gráfica de ventas
 * @param {string} containerId - ID del contenedor de la gráfica
 * @returns {HTMLElement} Elemento de controles
 */
function createVentasControls(containerId) {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'chart-controls';
    controlsDiv.innerHTML = `
        <label>Filtrar ventas:</label>
        <div class="radio-group">
            <label><input type="radio" name="${containerId}-filter" value="all" checked> Todos</label>
            <label><input type="radio" name="${containerId}-filter" value="top"> Más vendidos</label>
            <label><input type="radio" name="${containerId}-filter" value="bottom"> Menos vendidos</label>
        </div>
        <label for="${containerId}-count">Cantidad:</label>
        <select id="${containerId}-count">
            <option value="5">5 productos</option>
            <option value="10" selected>10 productos</option>
            <option value="15">15 productos</option>
            <option value="all">Todos</option>
        </select>
    `;
    
    return controlsDiv;
}

/**
 * Optimiza interacciones táctiles para gráficas de columnas dobles
 * @param {string} containerId - ID del contenedor de la gráfica
 * @param {Object} chart - Instancia de la gráfica CanvasJS
 */
function optimizeTouchInteractions(containerId, chart) {
    const container = document.getElementById(containerId);
    if (!container || !chart) return;
    
    // Detectar si es un dispositivo táctil
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Optimizar tooltips para touch
        chart.options.toolTip = {
            ...chart.options.toolTip,
            enabled: true,
            animationEnabled: false, // Desactivar animación para mejor rendimiento táctil
            cornerRadius: 6,
            fontSize: window.innerWidth <= 767 ? 11 : 12,
            fontFamily: "Poppins",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            fontColor: "white",
            borderThickness: 0
        };
        
        // Configurar interactividad táctil
        chart.options.interactivityEnabled = true;
        chart.options.zoomEnabled = window.innerWidth > 767; // Solo zoom en tablets y desktop
        
        // Optimizar rendimiento en móviles
        if (window.innerWidth <= 767) {
            chart.options.animationEnabled = false; // Desactivar animaciones en móviles para mejor rendimiento
        }
        
        // Re-renderizar con las nuevas configuraciones
        chart.render();
        
        // Agregar eventos táctiles personalizados si es necesario
        const chartCanvas = container.querySelector('.canvasjs-chart-canvas');
        if (chartCanvas) {
            chartCanvas.style.touchAction = 'pan-x pan-y';
        }
    }
}

/**
 * Crea una gráfica de columnas dobles para métodos de pago
 * @param {string} containerId - ID del contenedor
 * @param {Array} rawData - Datos crudos del backend
 * @param {Object} customConfig - Configuración personalizada opcional
 */
function createIngresosPagoChart(containerId, rawData, customConfig = {}) {
    try {
        // Procesar datos
        const processedData = window.DataProcessor.processIngresosPorPago(rawData);
        
        if (!processedData.montoData || processedData.montoData.length === 0) {
            handleEmptyData(containerId, 'No hay datos de ingresos por método de pago disponibles');
            return null;
        }
        
        // Configuración específica para métodos de pago
        const config = {
            title: { text: "Distribución de Métodos de Pago" },
            ...customConfig
        };
        
        const chart = createDoubleColumnChart(containerId, processedData, config);
        
        // Optimizar para interacciones táctiles
        if (chart) {
            optimizeTouchInteractions(containerId, chart);
        }
        
        return chart;
    } catch (error) {
        console.error('Error creando gráfica de métodos de pago:', error);
        handleChartError(containerId, error);
        return null;
    }
}

/**
 * Crea una tabla numérica para mostrar clientes con no shows
 * @param {string} containerId - ID del contenedor
 * @param {Array} rawData - Datos crudos del backend
 * @returns {HTMLElement} Elemento de la tabla
 */
function createNoShowTable(containerId, rawData) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            return null;
        }
        const processedData = window.DataProcessor.processNoShowTableData(rawData) || [];
        container.innerHTML = `
        <h2 class="tabla-titulo">Clientes con No Shows</h2>
            <div class="tabla-contenedor">
                <div class="encabezado-tabla">
                    <div class="buscador-con-icono">
                        <input type="text" id="${containerId}-search" class="buscador" placeholder="Buscar" />
                        <span class="icono-lupa">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#A4A4A4" />
                            </svg>
                        </span>
                    </div>
                </div>
                <table id="${containerId}-table">
                    <thead>
                        <tr>
                            <th>Cliente (ID)</th>
                            <th>No Shows</th>
                        </tr>
                    </thead>
                    <tbody id="${containerId}-tbody"></tbody>
                </table>
            </div>
        `;
        updateNoShowTableRows(containerId, processedData);
        setupNoShowSearch(containerId, processedData);
        return container;
    } catch (error) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="tabla-contenedor">
                    <div class="encabezado-tabla">
                        <div class="buscador-con-icono">
                            <input type="text" id="${containerId}-search" class="buscador" placeholder="Buscar" />
                            <span class="icono-lupa">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#A4A4A4" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <table id="${containerId}-table">
                        <thead>
                            <tr>
                                <th>Cliente (ID)</th>
                                <th>No Shows</th>
                            </tr>
                        </thead>
                        <tbody id="${containerId}-tbody">
                            <tr>
                                <td colspan="4" style="text-align:center; padding:20px; color:#666;">Error al cargar los datos</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }
        return null;
    }
}

/**
 * Actualiza las filas de la tabla de no shows
 * @param {string} containerId - ID del contenedor
 * @param {Array} data - Datos procesados
 */
function updateNoShowTableRows(containerId, data) {
    const tbody = document.getElementById(`${containerId}-tbody`);
    if (!tbody) {
        console.error('No se encontró tbody para:', containerId);
        return;
    }
    
    console.log('Actualizando filas de tabla con datos:', data);
    
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: #666;">
                    No hay datos para mostrar
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.map((item, index) => {
        const clienteDisplay = `${item.clienteId}`
        
        return `
            <tr class="no-show-row ${item.noShows >= 3 ? 'high-risk' : item.noShows >= 2 ? 'medium-risk' : 'low-risk'}">
                <td class="client-name">${clienteDisplay}</td>
                <td class="no-show-count">
                    <span class="count-badge">${item.noShows || 0}</span>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Configura la funcionalidad de búsqueda para la tabla de no shows
 * @param {string} containerId - ID del contenedor
 * @param {Array} originalData - Datos originales
 */
function setupNoShowSearch(containerId, originalData) {
    const searchInput = document.getElementById(`${containerId}-search`);
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Mostrar todos los datos
            updateNoShowTableRows(containerId, originalData);
        } else {
            // Filtrar datos
            const filteredData = originalData.filter(item => 
                item.clienteNombre.toLowerCase().includes(searchTerm) ||
                item.clienteTelefono.toLowerCase().includes(searchTerm) ||
                (item.clienteId && item.clienteId.toString().toLowerCase().includes(searchTerm))
            );
            updateNoShowTableRows(containerId, filteredData);
        }
    });
    
    // También permitir búsqueda con Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
}

// Exportar funciones para uso global
window.ChartUtils = {
    initializeCharts,
    createMetricCards,
    createMetricCard,
    getOrCreateMetricsContainer,
    formatCurrency,
    formatNumber,
    updateMetricCard,
    updateAllMetricCards,
    showMetricLoading,
    hideMetricLoading,
    showAllMetricsLoading,
    hideAllMetricsLoading,
    refreshMetricsWithLoading,
    getResponsiveConfig,
    createAreaChart,
    createBarChart,
    createColumnChart,
    createDoubleColumnChart,
    createLineChart,
    createIngresosFechaChart,
    createIngresosCamareroChart,
    createIngresosClienteChart,
    createIngresosProductoChart,
    createIngresosPagoChart,
    createVentasProductoChart,
    createNoShowTable,
    updateNoShowTableRows,
    setupNoShowSearch,
    createClienteControls,
    createProductoControls,
    createVentasControls,
    optimizeTouchInteractions,
    updateChart,
    destroyChart,
    handleChartError,
    handleEmptyData,
    activeCharts
};