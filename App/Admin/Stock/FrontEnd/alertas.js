class SistemaAlertas {
    constructor() {
        this.alertasActivas = {
            caducidad: [],
            stock_bajo: []
        };
        this.alertasVistas = new Set();
        this.intervalId = null;
        this.modalResumen = null;

        this.init();
    }

    init() {
        this.crearModalResumen();
        this.iniciarVerificacionPeriodica();
        this.verificarAlertasInicial();
    }

    crearModalResumen() {
        this.modalResumen = document.createElement('div');
        this.modalResumen.className = 'alerta-resumen-modal';
        this.modalResumen.id = 'alerta-resumen-modal';
        this.modalResumen.style.display = 'none';

        this.modalResumen.innerHTML = `
            <div class="alerta-resumen-content">
                <div class="alerta-resumen-header">
                    <h3>Resumen de Alertas</h3>
                    <button class="alerta-resumen-close">&times;</button>
                </div>
                <div class="alerta-resumen-body" id="alerta-resumen-body">
                </div>
                <div class="alerta-resumen-footer">
                </div>
            </div>
        `;

        const closeBtn = this.modalResumen.querySelector('.alerta-resumen-close');
        closeBtn.addEventListener('click', () => this.cerrarModalResumen());

        this.modalResumen.addEventListener('click', (e) => {
            if (e.target === this.modalResumen) {
                this.cerrarModalResumen();
            }
        });

        document.body.appendChild(this.modalResumen);
    }

    async verificarAlertas() {
        try {
            const response = await fetch('../BackEnd/verificarAlertas.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                this.procesarAlertas(data);
            } else {
                console.error('Error al verificar alertas:', data.message);
            }
        } catch (error) {
            console.error('Error de red al verificar alertas:', error);
        }
    }

    procesarAlertas(data) {
        this.alertasActivas.caducidad = data.alertas_caducidad || [];
        this.alertasActivas.stock_bajo = data.alertas_stock_bajo || [];
    }

    getClaseAlerta(alerta, tipo) {
        if (tipo === 'caducidad') {
            return alerta.dias_restantes <= 0 ? 'vencida' : 'activa';
        }
        return 'activa';
    }

    getIconoAlerta(tipo) {
        if (tipo === 'caducidad') {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>`;
        } else {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9h1a1 1 0 0 0 0-2zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 15a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9h10v12z" fill="currentColor"/>
            </svg>`;
        }
    }

    getContenidoAlerta(alerta, tipo) {
        if (tipo === 'caducidad') {
            const diasTexto = alerta.dias_restantes === 0 ? 'hoy' :
                alerta.dias_restantes === 1 ? 'mañana' :
                    alerta.dias_restantes < 0 ? `hace ${Math.abs(alerta.dias_restantes)} día(s)` :
                        `en ${alerta.dias_restantes} día(s)`;

            return `
                <div class="alerta-title">Alerta de Caducidad</div>
                <div class="alerta-message"><strong>${alerta.nombre}</strong> caduca ${diasTexto}</div>
                <div class="alerta-details">Fecha: ${this.formatearFecha(alerta.caducidad)}</div>
            `;
        } else {
            return `
                <div class="alerta-title">Stock Bajo</div>
                <div class="alerta-message"><strong>${alerta.nombre}</strong> tiene stock insuficiente</div>
                <div class="alerta-details">Actual: ${alerta.cantidad_actual} ${alerta.medida} | Mínimo: ${alerta.cantidad_minima} ${alerta.medida}</div>
            `;
        }
    }

    mostrarResumenAlertas() {
        const body = this.modalResumen.querySelector('#alerta-resumen-body');
        body.innerHTML = '';

        const caducidadVencidas = this.alertasActivas.caducidad.filter(a => a.dias_restantes <= 0);
        if (caducidadVencidas.length > 0) {
            this.agregarGrupoAlertas(body, 'Ingredientes Vencidos', caducidadVencidas, 'vencida', 'caducidad');
        }

        const caducidadProximas = this.alertasActivas.caducidad.filter(a => a.dias_restantes > 0);
        if (caducidadProximas.length > 0) {
            this.agregarGrupoAlertas(body, 'Próximos a Vencer', caducidadProximas, 'activa', 'caducidad');
        }

        if (this.alertasActivas.stock_bajo.length > 0) {
            this.agregarGrupoAlertas(body, 'Stock Bajo', this.alertasActivas.stock_bajo, 'pendiente', 'stock_bajo');
        }

        if (this.alertasActivas.caducidad.length === 0 && this.alertasActivas.stock_bajo.length === 0) {
            body.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay alertas activas en este momento.</p>';
        }

        this.modalResumen.style.display = 'flex';
    }

    agregarGrupoAlertas(contenedor, titulo, alertas, clase, tipo) {
        const grupo = document.createElement('div');
        grupo.className = `grupo-alertas ${clase}`;

        const tituloElement = document.createElement('h4');
        tituloElement.textContent = `${titulo} (${alertas.length})`;
        grupo.appendChild(tituloElement);

        const lista = document.createElement('ul');

        alertas.forEach(alerta => {
            const item = document.createElement('li');
            item.className = 'item-alerta';

            let contenidoItem = '';
            if (tipo === 'caducidad') {
                const diasTexto = alerta.dias_restantes === 0 ? 'Caduca hoy' :
                    alerta.dias_restantes === 1 ? 'Caduca mañana' :
                        alerta.dias_restantes < 0 ? `Venció hace ${Math.abs(alerta.dias_restantes)} día(s)` :
                            `Caduca en ${alerta.dias_restantes} día(s)`;

                contenidoItem = `
                    <div class="alerta-info">
                        <strong>${alerta.nombre}</strong>
                        <div class="alerta-fechas">${diasTexto} - ${this.formatearFecha(alerta.caducidad)}</div>
                    </div>
                `;
            } else {
                contenidoItem = `
                    <div class="alerta-info">
                        <strong>${alerta.nombre}</strong>
                        <div class="alerta-stock">Actual: ${alerta.cantidad_actual} ${alerta.medida} | Mínimo: ${alerta.cantidad_minima} ${alerta.medida}</div>
                    </div>
                `;
            }

            item.innerHTML = contenidoItem;
            lista.appendChild(item);
        });

        grupo.appendChild(lista);
        contenedor.appendChild(grupo);
    }

    cerrarModalResumen() {
        this.modalResumen.style.display = 'none';
    }

    iniciarVerificacionPeriodica() {
        this.intervalId = setInterval(() => {
            this.verificarAlertas();
        }, 5 * 60 * 1000);
    }

    verificarAlertasInicial() {
        this.verificarAlertas();
    }

    formatearFecha(fechaString) {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    reinicializar() {
        this.alertasVistas.clear();
        this.verificarAlertas();
    }

    reinicializarSeguro() {
        if (this.verificarAlertas) {
            this.verificarAlertas();
        }
    }

    destruir() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        if (this.modalResumen) {
            this.modalResumen.remove();
        }
    }
}

let sistemaAlertas = null;

function asegurarSistemaAlertas() {
    if (!sistemaAlertas) {
        sistemaAlertas = new SistemaAlertas();
    }
    return sistemaAlertas;
}

function reinicializarAlertas() {
    if (sistemaAlertas) {
        sistemaAlertas.reinicializar();
    }
}

function reinicializarAlertasSeguro() {
    if (sistemaAlertas) {
        sistemaAlertas.reinicializarSeguro();
    }
}

function mostrarResumenAlertas() {
    if (sistemaAlertas) {
        sistemaAlertas.mostrarResumenAlertas();
    } else {
        asegurarSistemaAlertas();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        asegurarSistemaAlertas();
    }, 1000);
});

window.addEventListener('beforeunload', () => {
    if (sistemaAlertas) {
        sistemaAlertas.destruir();
    }
});