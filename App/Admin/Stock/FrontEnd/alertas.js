class SistemaAlertas {
    constructor() {
        this.alertasActivas = [];
        this.alertasVistas = new Set();
        this.intervalId = null;
        this.notificationContainer = null;
        this.alertIndicator = null;
        this.isInitialized = false;
        
        this.config = {
            intervaloVerificacion: 60000,
            mostrarNotificacionesPor: 5000,
            maxNotificacionesVisibles: 3
        };
    }

    async inicializar() {
        if (this.isInitialized) return;
        
        try {
            this.crearElementosUI();
            await this.verificarAlertas();
            this.iniciarVerificacionPeriodica();
            this.isInitialized = true;
        } catch (error) {
            console.error('Error al inicializar sistema de alertas:', error);
        }
    }

    crearElementosUI() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.id = 'alertas-container';
        this.notificationContainer.className = 'alertas-container';
        document.body.appendChild(this.notificationContainer);

        this.crearIndicadorAlertas();
    }

    crearIndicadorAlertas() {
        let navElement = document.querySelector('nav-admin');
        
        if (!navElement) {
            navElement = document.querySelector('nav');
        }
        if (!navElement) {
            navElement = document.querySelector('.navigation');
        }
        if (!navElement) {
            navElement = document.querySelector('.nav');
        }
        
        if (!navElement) {
            console.warn('No se encontró elemento de navegación, creando indicador en body');
            navElement = document.body;
        }
        
        this.alertIndicator = document.createElement('div');
        this.alertIndicator.id = 'alerta-indicator';
        this.alertIndicator.className = 'alerta-indicator hidden';
        this.alertIndicator.innerHTML = `
            <div class="alerta-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
                </svg>
                <span class="alerta-count">0</span>
            </div>
        `;
        
        this.alertIndicator.addEventListener('click', () => {
            this.mostrarResumenAlertas();
        });
        
        navElement.appendChild(this.alertIndicator);
    }

    async verificarAlertas() {
        try {
            const response = await fetch('../BackEnd/verificarAlertas.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.procesarAlertas(data.alertas, data.estadisticas);
            } else {
                console.error('Error al verificar alertas:', data.message);
            }
        } catch (error) {
            console.error('Error de red al verificar alertas:', error);
        }
    }

    procesarAlertas(alertas, estadisticas) {
        this.alertasActivas = alertas;
        
        this.actualizarIndicadorAlertas(estadisticas);
        
        const alertasNuevas = alertas.filter(alerta => 
            !this.alertasVistas.has(alerta.stock_id) && 
            (alerta.estado === 'activa' || alerta.estado === 'vencida')
        );
        
        if (alertasNuevas.length > 0) {
            this.mostrarNotificaciones(alertasNuevas);
        }
    }

    actualizarIndicadorAlertas(estadisticas) {
        if (!this.alertIndicator) return;
        
        const totalAlertas = estadisticas.activas + estadisticas.vencidas;
        const countElement = this.alertIndicator.querySelector('.alerta-count');
        
        if (totalAlertas > 0) {
            this.alertIndicator.classList.remove('hidden');
            countElement.textContent = totalAlertas;
            
            if (estadisticas.vencidas > 0) {
                this.alertIndicator.classList.add('critica');
                this.alertIndicator.classList.remove('advertencia');
            } else if (estadisticas.activas > 0) {
                this.alertIndicator.classList.add('advertencia');
                this.alertIndicator.classList.remove('critica');
            }
        } else {
            this.alertIndicator.classList.add('hidden');
        }
    }

    mostrarNotificaciones(alertas) {
        const alertasAMostrar = alertas.slice(0, this.config.maxNotificacionesVisibles);
        
        alertasAMostrar.forEach((alerta, index) => {
            setTimeout(() => {
                this.crearNotificacion(alerta);
            }, index * 500);
        });
    }

    crearNotificacion(alerta) {
        const notification = document.createElement('div');
        notification.className = `alerta-notification ${alerta.estado}`;
        notification.dataset.stockId = alerta.stock_id;
        
        const iconoSvg = alerta.estado === 'vencida' 
            ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
               </svg>`
            : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
               </svg>`;
        
        const mensaje = alerta.estado === 'vencida' 
            ? `¡Alerta vencida! ${alerta.nombre} debía ser revisado el ${this.formatearFecha(alerta.alerta)}`
            : `¡Alerta activa! ${alerta.nombre} debe ser revisado hoy (${this.formatearFecha(alerta.alerta)})`;
        
        notification.innerHTML = `
            <div class="alerta-icon">${iconoSvg}</div>
            <div class="alerta-content">
                <div class="alerta-title">${alerta.estado === 'vencida' ? 'Alerta Vencida' : 'Alerta Activa'}</div>
                <div class="alerta-message">${mensaje}</div>
                <div class="alerta-details">Caduca: ${this.formatearFecha(alerta.caducidad)}</div>
            </div>
            <button class="alerta-close" onclick="sistemaAlertas.cerrarNotificacion(${alerta.stock_id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
            </button>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            this.cerrarNotificacion(alerta.stock_id);
        }, this.config.mostrarNotificacionesPor);
    }

    cerrarNotificacion(stockId) {
        const notification = this.notificationContainer.querySelector(`[data-stock-id="${stockId}"]`);
        if (notification) {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        
        this.marcarAlertaComoVista(stockId);
    }

    marcarAlertaComoVista(stockId) {
        this.alertasVistas.add(stockId);
        
        const alertasVistasArray = Array.from(this.alertasVistas);
        localStorage.setItem('alertasVistas', JSON.stringify(alertasVistasArray));
    }

    cargarAlertasVistas() {
        try {
            const alertasVistasArray = JSON.parse(localStorage.getItem('alertasVistas') || '[]');
            this.alertasVistas = new Set(alertasVistasArray);
        } catch (error) {
            console.error('Error al cargar alertas vistas:', error);
            this.alertasVistas = new Set();
        }
    }

    mostrarResumenAlertas() {
        if (this.alertasActivas.length === 0) {
            this.mostrarMensaje('No hay alertas activas en este momento', 'info');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'alerta-resumen-modal';
        modal.innerHTML = `
            <div class="alerta-resumen-content">
                <div class="alerta-resumen-header">
                    <h3>Resumen de Alertas de Caducidad</h3>
                    <button class="alerta-resumen-close">&times;</button>
                </div>
                <div class="alerta-resumen-body">
                    ${this.generarHTMLResumen()}
                </div>
                <div class="alerta-resumen-footer">
                    <button class="btn-marcar-vistas">Marcar Todas como Vistas</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.alerta-resumen-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.btn-marcar-vistas').addEventListener('click', () => {
            this.marcarTodasComoVistas();
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    generarHTMLResumen() {
        let html = '<div class="alertas-lista">';
        
        const alertasPorEstado = {
            vencida: this.alertasActivas.filter(a => a.estado === 'vencida'),
            activa: this.alertasActivas.filter(a => a.estado === 'activa'),
            pendiente: this.alertasActivas.filter(a => a.estado === 'pendiente')
        };
        
        Object.entries(alertasPorEstado).forEach(([estado, alertas]) => {
            if (alertas.length > 0) {
                const titulo = estado === 'vencida' ? 'Alertas Vencidas' : 
                              estado === 'activa' ? 'Alertas Activas' : 'Alertas Próximas';
                
                html += `<div class="grupo-alertas ${estado}">
                    <h4>${titulo} (${alertas.length})</h4>
                    <ul>`;
                
                alertas.forEach(alerta => {
                    html += `
                        <li class="item-alerta">
                            <div class="alerta-info">
                                <strong>${alerta.nombre}</strong>
                                <span class="alerta-fechas">
                                    Alerta: ${this.formatearFecha(alerta.alerta)} | 
                                    Caduca: ${this.formatearFecha(alerta.caducidad)}
                                </span>
                            </div>
                            <div class="alerta-stock">${alerta.stock} ${alerta.medida}</div>
                        </li>
                    `;
                });
                
                html += '</ul></div>';
            }
        });
        
        html += '</div>';
        return html;
    }

    marcarTodasComoVistas() {
        this.alertasActivas.forEach(alerta => {
            this.alertasVistas.add(alerta.stock_id);
        });
        
        const alertasVistasArray = Array.from(this.alertasVistas);
        localStorage.setItem('alertasVistas', JSON.stringify(alertasVistasArray));
        
        this.actualizarIndicadorAlertas({ activas: 0, vencidas: 0, pendientes: 0 });
        
        this.mostrarMensaje('Todas las alertas han sido marcadas como vistas', 'success');
    }

    iniciarVerificacionPeriodica() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        this.intervalId = setInterval(() => {
            this.verificarAlertas();
        }, this.config.intervaloVerificacion);
    }

    detenerVerificacionPeriodica() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    mostrarMensaje(mensaje, tipo = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `alerta-mensaje ${tipo}`;
        messageElement.textContent = mensaje;
        
        this.notificationContainer.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            messageElement.classList.add('hide');
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 3000);
    }

    formatearFecha(fechaString) {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    destruir() {
        this.detenerVerificacionPeriodica();
        
        if (this.notificationContainer && this.notificationContainer.parentNode) {
            this.notificationContainer.parentNode.removeChild(this.notificationContainer);
        }
        
        if (this.alertIndicator && this.alertIndicator.parentNode) {
            this.alertIndicator.parentNode.removeChild(this.alertIndicator);
        }
        
        this.isInitialized = false;
    }
}

const sistemaAlertas = new SistemaAlertas();

window.verificarAlertasManual = function() {
    if (sistemaAlertas.isInitialized) {
        sistemaAlertas.verificarAlertas();
    } else {
        console.warn('Sistema de alertas no inicializado');
    }
};

window.mostrarResumenAlertasGlobal = function() {
    if (sistemaAlertas.isInitialized) {
        sistemaAlertas.mostrarResumenAlertas();
    } else {
        console.warn('Sistema de alertas no inicializado');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    sistemaAlertas.cargarAlertasVistas();
    
    setTimeout(() => {
        sistemaAlertas.inicializar();
    }, 1000);
});

window.addEventListener('beforeunload', () => {
    sistemaAlertas.destruir();
});