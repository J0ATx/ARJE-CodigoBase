const subFavicon = document.getElementById('subir_favicon');
const subLogo = document.getElementById('subir_logo');
const nomEmpresa = document.getElementById('cambiar_nombre');
const misEmpresa = document.getElementById('cambiar_mision');
const visEmpresa = document.getElementById('cambiar_vision');
const whtsppEmpresa = document.getElementById('cambiar_whatsapp');
const instagramEmpresa = document.getElementById('cambiar_instagram');
const fcbkEmpresa = document.getElementById('cambiar_facebook');
const emailEmpresa = document.getElementById('cambiar_email');
const ubiEmpresa = document.getElementById('cambiar_ubicacion');
const horEmpresa = document.getElementById('cambiar_horario');
const addTel = document.getElementById('agregar_telefono');
const delTel = document.getElementById('quitar_telefono');
const addval = document.getElementById('agregar_valor');
const delval = document.getElementById('quitar_valor');

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
        document.getElementById('mensaje').textContent = 'Error al subir: ' + err;
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

// nomEmpresa.addEventListener('click', function (e) {
//     const nombre = document.getElementById('nombre').value;
//     if (!nombre) {
//         alert('Por favor, ingresa un nombre de empresa.');
//         return;
//     }

//     formdata = new FormData();
//     formdata.append('nombre', nombre);

//     fetch('../BackEnd/empresa.php', {
//         method: 'POST',
//         body: formdata
//     })
// });

function actualizarCampo(campo, valor){
    formdata = new FormData();
    formdata.append('campo', campo);
    formdata.append('valor', valor);

    fetch('../BackEnd/empresa.php', {
        method: 'POST',
        body: formdata
    })
    .then(res => res.text())
    .then(data => {})
    .then(err)
};

