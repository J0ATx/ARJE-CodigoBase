const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    const lugar = document.getElementById('lugar').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    const datos = new FormData();
    datos.append('lugar', lugar);
    datos.append('fecha', fecha);
    datos.append('hora', hora);

    fetch('registrar.php', {
        method: 'POST',
        body: datos
    }).then(response => response.text())
    .then(data => {
        console.log(data);
    }).catch(error => {
        console.error('Error:', error);
    });
});