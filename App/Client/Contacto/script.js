const horarios = document.getElementById('horarios');
const contactos = document.getElementById('contactos');

document.addEventListener('DOMContentLoaded', function () {
    fetch('../BackEnd/informacion.php', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        data.horarios.forEach(element => {
            horarios.appendChild(document.createElement('p')).textContent = `${element.empresa_dia}: ${element.empresa_hora}`;
        });
        contactos.appendChild(document.createElement('p')).textContent = `Dirección: ${data.info.empresa_ciudad} ${data.info.empresa_calle}`;
        contactos.appendChild(document.createElement('p')).textContent = `Whatsapp: ${data.info.empresa_whatsapp}`;
        contactos.appendChild(document.createElement('p')).textContent = `Facebook: ${data.info.empresa_facebook}`;
        contactos.appendChild(document.createElement('p')).textContent = `Instagram: ${data.info.empresa_instagram}`;
        data.telefonos.forEach(element => {
            horarios.appendChild(document.createElement('p')).textContent = `Teléfono: ${element.empresa_telefono}`;
        });
    });
});
