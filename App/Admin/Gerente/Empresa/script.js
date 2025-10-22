const subFavicon = document.getElementById('subir_favicon');
const subLogo = document.getElementById('subir_logo');
const cambiarInfo = document.getElementById('cambiar_informacion');
const cambiarUbicacion = document.getElementById('cambiar_ubicacion');
const addHorario = document.getElementById('agregar_horario');
const addTel = document.getElementById('agregar_telefono');

function cargarDatos() {
    fetch('../BackEnd/cargarDatos.php', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('info').innerHTML = '';
        document.getElementById('ubicacion').innerHTML = '';
        document.getElementById('horarios').innerHTML = '';
        document.getElementById('telefonos').innerHTML = '';

        for (const [clave, valor] of Object.entries(data.info)) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = clave;
            input.value = valor;
            document.getElementById('info').appendChild(input);
            document.getElementById('info').appendChild(document.createElement('br'));
        }
        for (const [clave, valor] of Object.entries(data.ubicacion)) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = clave;
            input.value = valor;
            document.getElementById('ubicacion').appendChild(input);
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
            const btnEditar = document.createElement('button');
            btnEditar.type = 'button';
            btnEditar.textContent = 'Editar';
            btnEditar.id = 'editar_horario';
            btnEditar.addEventListener('click', function() {
                const nuevoHorario = prompt('Ingrese el nuevo horario:', hora.value);
                if (nuevoHorario !== null && nuevoHorario.trim() !== '') {
                    formdata = new FormData();
                    formdata.append('dia', element.empresa_dia);
                    formdata.append('hora', nuevoHorario);
                    formdata.append('anterior_horario', element.empresa_hora);

                    fetch('../BackEnd/editHorario.php', {
                    method: 'POST',
                    body: formdata
                    })
                    .then(res => res.text())
                    .then(data => {
                        console.log(data);
                        cargarDatos();
                    });
                }
            });
            document.getElementById('horarios').appendChild(dia);
            document.getElementById('horarios').appendChild(hora);
            document.getElementById('horarios').appendChild(btnEditar);
            document.getElementById('horarios').appendChild(btnQuitar);
            document.getElementById('horarios').appendChild(document.createElement('br'));
        });

        data.telefonos.forEach(element => {
            const tel = document.createElement('input');
            tel.type = 'text';
            tel.name = 'telefonos[]';
            tel.id = element.empresa_telefono;
            tel.value = element.empresa_telefono;
            const btnQuitar = document.createElement('button');
            btnQuitar.type = 'button';
            btnQuitar.textContent = 'Quitar Telefono';
            btnQuitar.id = element.empresa_telefono;
            btnQuitar.addEventListener('click', function() {
                formdata = new FormData();
                formdata.append('telefono', element.empresa_telefono);

                fetch('../BackEnd/delTel.php', {
                method: 'POST',
                body: formdata
                })
                .then(res => res.text())
                .then(data => {
                    console.log(data);
                    cargarDatos();
                })
            });
            const btnEditar = document.createElement('button');
            btnEditar.type = 'button';
            btnEditar.textContent = 'Editar Telefono';
            btnEditar.id = element.empresa_telefono;
            btnEditar.addEventListener('click', function() {
                const nuevoTel = prompt('Ingrese el nuevo número de teléfono:', tel.value);
                if (nuevoTel !== null && nuevoTel.trim() !== '') {
                    formdata = new FormData();
                    formdata.append('nuevo_telefono', nuevoTel);
                    formdata.append('anterior_telefono', element.empresa_telefono);

                    fetch('../BackEnd/editTel.php', {
                    method: 'POST',
                    body: formdata
                    })
                    .then(res => res.text())
                    .then(data => {
                        console.log(data);
                        cargarDatos();
                    });
                }
            });
            document.getElementById('telefonos').appendChild(tel);
            document.getElementById('telefonos').appendChild(btnEditar);
            document.getElementById('telefonos').appendChild(btnQuitar);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    cargarDatos();
});

subFavicon.addEventListener('click', function (e) {
    const favicon = document.getElementById('favicon');
    const archivo = favicon.files[0];

    if (!archivo) {
        alert('Por favor, selecciona un archivo.');
        return;
    }

    const nomFavicon = archivo.name;
    const extFavicon = nomFavicon.split('.').pop().toLowerCase();

    if (extFavicon !== 'ico') {
        alert('Por favor, selecciona un archivo de imagen válido para el favicon (.ico).');
        return;
    }

    const archivoFavicon = new FormData();
    archivoFavicon.append('favicon', archivo); // clave 'favicon' debe coincidir con $_FILES['favicon']

    fetch('../BackEnd/archivo.php', {
        method: 'POST',
        body: archivoFavicon
    })
    .then(res => res.text()) // o res.json() si el PHP responde en JSON
    .then(data => {
        // document.getElementById('mensaje').textContent = "Favicon subido correctamente a " + data;
        console.log(data);
        document.getElementById('favicon_img').src = data; // Actualiza la vista previa del favicon
    })
    .catch(err => {
        console.log(err);
    });

    
});

subLogo.addEventListener('click', function (e) {
    const logo = document.getElementById('logo');
    const archivo = logo.files[0];

    if (!archivo) {
        alert('Por favor, selecciona un archivo.');
        return;
    }

    const nomLogo = archivo.name;
    const extLogo = nomLogo.split('.').pop().toLowerCase();

    if (extLogo !== 'svg') {
        alert('Por favor, selecciona un archivo de imagen válido para el logo (.svg).');
        return;
    }

    const archivoLogo = new FormData();
    archivoLogo.append('logo', archivo); // clave 'logo' debe coincidir con $_FILES['logo']

    fetch('../BackEnd/archivo.php', {
        method: 'POST',
        body: archivoLogo
    })
    .then(res => res.text()) // o res.json() si el PHP responde en JSON
    .then(data => {
        document.getElementById('logo_img').src = data;
    })
    .catch(err => {
        document.getElementById('mensaje').textContent = 'Error al subir: ' + err;
    });
});

cambiarInfo.addEventListener('click', function(e){
    e.preventDefault();
    formdata = new FormData();
    formdata.append('nombre', document.getElementById('empresa_nombre').value);
    formdata.append('mision', document.getElementById('empresa_mision').value);
    formdata.append('vision', document.getElementById('empresa_vision').value);
    formdata.append('valores', document.getElementById('empresa_valores').value);
    formdata.append('whatsapp', document.getElementById('empresa_whatsapp').value);
    formdata.append('instagram', document.getElementById('empresa_instagram').value);
    formdata.append('facebook', document.getElementById('empresa_facebook').value);

    fetch('../BackEnd/cambiarInfo.php', {
    method: 'POST',
    body: formdata
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);
        cargarDatos();
    })
});

cambiarUbicacion.addEventListener('click', function(e){
    e.preventDefault();
    formdata = new FormData();
    formdata.append('ciudad', document.getElementById('empresa_ciudad').value);
    formdata.append('calles', document.getElementById('empresa_calle').value);

    fetch('../BackEnd/cambiarUbicacion.php', {
    method: 'POST',
    body: formdata
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);
        cargarDatos();
    })
});

addHorario.addEventListener('click', function(e){
    e.preventDefault();
    formdata = new FormData();
    formdata.append('dia', document.getElementById('dia').value);
    formdata.append('hora', document.getElementById('hora').value);

    fetch('../BackEnd/addHorario.php', {
    method: 'POST',
    body: formdata
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);
        cargarDatos();
    })
});

addTel.addEventListener('click', function(e){
    e.preventDefault();
    formdata = new FormData();
    formdata.append('telefono', document.getElementById('tel').value);

    fetch('../BackEnd/addTel.php', {
    method: 'POST',
    body: formdata
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);
        cargarDatos();
    })
});