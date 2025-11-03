const informe = document.getElementById('generarInforme');
const filtrarPuntual = document.getElementById('filtrarPuntual');
const filtrarRango = document.getElementById('filtrarRango');
const quitarFiltro = document.getElementById('quitarFiltro');

function cargarDatos() {
    fetch('../BackEnd/cargarInfo.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('informes').innerHTML = '';
        document.getElementById('informes').innerHTML = `
            <div id="ingresosTotales">
                <h2>Ingresos Totales</h2>
            </div>
            <hr>
            <div id="cantidadClientes">
                <h2>Clientes Registrados</h2>
            </div>
            <hr>
            <div id="cantidadPersonal">
                <h2>Personal Regsitrado</h2>
            </div>
            <hr>
            <div id="ingresosCamarero">
                <h2>Ingresos Por Camarero</h2>
            </div>
            <hr>
            <div id="ingresosCliente">
                <h2>Ingresos Por Cliente</h2>
            </div>
            <hr>
            <div id="ingresosFecha">
                <h2>Ingresos Por Fecha</h2>
            </div>
            <hr>
            <div id="ingresosPago">
                <h2>Ingresos Por Pago</h2>
            </div>
            <hr>
            <div id="ingresosProducto">
                <h2>Ingresos Por Producto</h2>
            </div>
            <hr>
            <div id="noShowCliente">
                <h2>No Shows Por Cliente</h2>
            </div>
            <hr>
            <div id="noShowFecha">
                <h2>No Shows Por Fecha</h2>
            </div>
            <hr>
            <div id="ventasProducto">
                <h2>Ventas Por Producto</h2>
            </div>
            <hr>
            <div id="calificacionPromedio">
                <h2>Calififcación Promedio Por Producto</h2>
            </div>`;
            
        const ingresosTotales = document.createElement('p');
        ingresosTotales.textContent = `Ingresos Totales a la Fecha: $${data.ingresosTotales[0].total_ingresos}`;
        document.getElementById('ingresosTotales').appendChild(ingresosTotales);

        const cantidadClientes = document.createElement('p');
        cantidadClientes.textContent = `Clientes Registrados a la Fecha: ${data.cantidadClientes[0].total_clientes}`;
        document.getElementById('cantidadClientes').appendChild(cantidadClientes);

        const cantidadPersonal = document.createElement('p');
        cantidadPersonal.textContent = `Personal Registrado a la Fecha: ${data.cantidadPersonal[0].total_personal}`;
        document.getElementById('cantidadPersonal').appendChild(cantidadPersonal);
        
        data.ingresosPorCamarero.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.personal_nombre} : ${element.total}`;
            document.getElementById('ingresosCamarero').appendChild(venta);
        });

        data.ingresosPorCliente.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.cliente_nombre} : ${element.total}`;
            document.getElementById('ingresosCliente').appendChild(venta);
        });

        data.ingresosPorFecha.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.fecha} : ${element.total}`;
            document.getElementById('ingresosFecha').appendChild(venta);
        });

        data.ingresosPorPago.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.pedido_pago} : ${element.total}`;
            document.getElementById('ingresosPago').appendChild(venta);
        });

        data.ingresosPorProducto.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.producto_nombre} : ${element.total}`;
            document.getElementById('ingresosProducto').appendChild(venta);
        });

        data.noShowPorCliente.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.cliente_id} : ${element.no_shows}`;
            document.getElementById('noShowCliente').appendChild(venta);
        });

        data.noShowPorFecha.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.no_show_fecha} : ${element.no_shows}`;
            document.getElementById('noShowFecha').appendChild(venta);
        });

        data.ventasPorProducto.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.producto_nombre} : ${element.total}`;
            document.getElementById('ventasProducto').appendChild(venta);
        });

        data.calificacionPromedio.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.producto_nombre} : ${element.calificacion}`;
            document.getElementById('calificacionPromedio').appendChild(venta);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    cargarDatos();
});

informe.addEventListener('click', function () {
    // Navegar a la URL — el navegador pedirá descargar porque PHP envía Content-Disposition: attachment
    window.location.href = '../BackEnd/generarPDF.php';

    // O abrir en nueva pestaña:
    // window.open('../BackEnd/generarPDF.php', '_blank');
});

filtrarPuntual.addEventListener('click', function () {
    let puntualFecha = document.getElementById('fechaFiltroPuntual').value;
    const formData = new FormData();
    formData.append('puntual_fecha', puntualFecha);

    fetch('../BackEnd/filtroPuntual.php', {
        method: 'POST', 
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('informes').innerHTML = '';
        document.getElementById('informes').innerHTML = `
            <div id="ingresosTotales">
                <h2>Ingresos Totales</h2>
            </div>
            <hr>
            <div id="cantidadClientes">
                <h2>Clientes Registrados</h2>
            </div>
            <hr>
            <div id="cantidadPersonal">
                <h2>Personal Regsitrado</h2>
            </div>
            <hr>
            <div id="ingresosCamarero">
                <h2>Ingresos Por Camarero</h2>
            </div>
            <hr>
            <div id="ingresosCliente">
                <h2>Ingresos Por Cliente</h2>
            </div>
            <hr>
            <div id="ingresosFecha">
                <h2>Ingresos Por Fecha</h2>
            </div>
            <hr>
            <div id="ingresosPago">
                <h2>Ingresos Por Pago</h2>
            </div>
            <hr>
            <div id="ingresosProducto">
                <h2>Ingresos Por Producto</h2>
            </div>
            <hr>
            <div id="noShowCliente">
                <h2>No Shows Por Cliente</h2>
            </div>
            <hr>
            <div id="noShowFecha">
                <h2>No Shows Por Fecha</h2>
            </div>
            <hr>
            <div id="ventasProducto">
                <h2>Ventas Por Producto</h2>
            </div>
            <hr>
            <div id="calificacionPromedio">
                <h2>Calififcación Promedio Por Producto</h2>
            </div>`;
            
        const ingresosTotales = document.createElement('p');
        ingresosTotales.textContent = `Ingresos Totales a la Fecha: $${data.ingresosTotales[0].total_ingresos}`;
        document.getElementById('ingresosTotales').appendChild(ingresosTotales);

        const cantidadClientes = document.createElement('p');
        cantidadClientes.textContent = `Clientes Registrados a la Fecha: ${data.cantidadClientes[0].total_clientes}`;
        document.getElementById('cantidadClientes').appendChild(cantidadClientes);

        const cantidadPersonal = document.createElement('p');
        cantidadPersonal.textContent = `Personal Registrado a la Fecha: ${data.cantidadPersonal[0].total_personal}`;
        document.getElementById('cantidadPersonal').appendChild(cantidadPersonal);
        
        data.ingresosPorCamarero.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.personal_nombre} : ${element.total}`;
            document.getElementById('ingresosCamarero').appendChild(venta);
        });

        data.ingresosPorCliente.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.cliente_nombre} : ${element.total}`;
            document.getElementById('ingresosCliente').appendChild(venta);
        });

        data.ingresosPorFecha.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.fecha} : ${element.total}`;
            document.getElementById('ingresosFecha').appendChild(venta);
        });

        data.ingresosPorPago.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.pedido_pago} : ${element.total}`;
            document.getElementById('ingresosPago').appendChild(venta);
        });

        data.ingresosPorProducto.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.producto_nombre} : ${element.total}`;
            document.getElementById('ingresosProducto').appendChild(venta);
        });

        data.noShowPorCliente.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.cliente_id} : ${element.no_shows}`;
            document.getElementById('noShowCliente').appendChild(venta);
        });

        data.noShowPorFecha.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.no_show_fecha} : ${element.no_shows}`;
            document.getElementById('noShowFecha').appendChild(venta);
        });

        data.ventasPorProducto.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.producto_nombre} : ${element.total}`;
            document.getElementById('ventasProducto').appendChild(venta);
        });

        data.calificacionPromedio.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.producto_nombre} : ${element.calificacion}`;
            document.getElementById('calificacionPromedio').appendChild(venta);
        });
    });
});

quitarFiltro.addEventListener('click', function () {
    cargarDatos();
});