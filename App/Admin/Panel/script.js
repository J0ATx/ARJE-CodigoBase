const subFavicon = document.getElementById('subir_favicon');
const subLogo = document.getElementById('subir_logo');

// El código no está optimizado, se hará en una próxima versión
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

    fetch('archivo.php', {
        method: 'POST',
        body: archivoFavicon
    })
    .then(res => res.text()) // o res.json() si el PHP responde en JSON
    .then(data => {
        // document.getElementById('mensaje').textContent = "Favicon subido correctamente a " + data;
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

    fetch('archivo.php', {
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