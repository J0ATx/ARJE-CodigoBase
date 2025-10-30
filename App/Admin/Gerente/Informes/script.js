const informe = document.getElementById('generarInforme');

function cargarDatos() {
    fetch('../BackEnd/cargarInfo.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('informes').innerHTML = '';
        document.getElementById('informes').innerHTML = `
            <div id="ventasTotales">
                <h2>Ganancias Totales</h2>
            </div>
            <hr>
            <div id="ventasCamarero">
                <h2>Ganancias Por Camarero</h2>
            </div>
            <hr>
            <div id="ventasCliente">
                <h2>Ganancias Por Cliente</h2>
            </div>
            <hr>
            <div id="ventasFecha">
                <h2>Ganancias Por Fecha</h2>
            </div>
            <hr>
            <div id="ventasPago">
                <h2>Ganancias Por Pago</h2>
            </div>
            <hr>
            <div id="ventasProducto">
                <h2>Ganancias Por Producto</h2>
            </div>
            <hr>
            <div id="noShowCliente">
                <h2>No Shows Por Cliente</h2>
            </div>
            <hr>
            <div id="noShowFecha">
                <h2>No Shows Por Fecha</h2>
            </div>`;
            
        const ventasTotales = document.createElement('p');
        ventasTotales.textContent = `Ingresos Totales a la Fecha: $${data.ventasTotales[0].total_ventas}`;
        document.getElementById('ventasTotales').appendChild(ventasTotales);
        
        data.ventasPorCamarero.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.personal_nombre} : ${element.total}`;
            document.getElementById('ventasCamarero').appendChild(venta);
        });

        data.ventasPorCliente.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.cliente_nombre} : ${element.total}`;
            document.getElementById('ventasCliente').appendChild(venta);
        });

        data.ventasPorFecha.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.fecha} : ${element.total}`;
            document.getElementById('ventasFecha').appendChild(venta);
        });

        data.ventasPorPago.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.pedido_pago} : ${element.total}`;
            document.getElementById('ventasPago').appendChild(venta);
        });

        data.ventasPorProducto.forEach(element => {
            const venta = document.createElement('p');
            venta.textContent = `${element.producto_nombre} : ${element.total}`;
            document.getElementById('ventasProducto').appendChild(venta);
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