const nombre = document.getElementById('nombre');
const mision = document.getElementById('mision');
const vision = document.getElementById('vision');
const valores = document.getElementById('valores');

document.addEventListener('DOMContentLoaded', function () {
    fetch('../BackEnd/informacion.php', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        nombre.textContent = data.info.empresa_nombre;
        mision.appendChild(document.createElement('p')).textContent = data.info.empresa_mision;
        vision.appendChild(document.createElement('p')).textContent = data.info.empresa_vision;
        valores.appendChild(document.createElement('p')).textContent = data.info.empresa_valores;
    });
});
