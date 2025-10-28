function cargarDatos() {
    fetch('../BackEnd/cargarInfo.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('informes').innerHTML = '';
        document.getElementById('informes').innerHTML = JSON.stringify(data);

        for (const [clave, valor] of Object.entries(data.ventasPorCliente)) {
            const info = document.createElement('p');
            info.value = valor;
        }
        
        data.horarios.forEach(element => {
            const dia = document.createElement('input');
            dia.type = 'text';
            dia.name = 'dias[]';
            dia.id = element.empresa_dia;
            dia.value = element.empresa_dia;
            const hora = document.createElement('input');
            hora.type = 'text';
            hora.name = 'horas[]';
            hora.id = element.empresa_hora;
            hora.value = element.empresa_hora;
            const btnQuitar = document.createElement('button');
            btnQuitar.type = 'button';
            btnQuitar.textContent = 'Quitar';
            btnQuitar.id = 'quitar_horario';
            btnQuitar.addEventListener('click', function() {
                formdata = new FormData();
                formdata.append('dia', element.empresa_dia);
                formdata.append('hora', element.empresa_hora);

                fetch('../BackEnd/delHorario.php', {
                method: 'POST',
                body: formdata
                })
                .then(res => res.text())
                .then(data => {
                    console.log(data);
                    cargarDatos();
                })
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    cargarDatos();
});
