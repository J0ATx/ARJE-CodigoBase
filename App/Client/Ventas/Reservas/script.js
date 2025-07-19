const btn = document.getElementById('btn');
const mensajesAlerta = document.querySelector('.mensajes-alerta');



btn.addEventListener('click', () => {
    // Limpiar mensajes anteriores
    mensajesAlerta.innerHTML = '';

    const lugar = document.getElementById('lugar').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    const datos = new FormData();
    datos.append('lugar', lugar);
    datos.append('fecha', fecha);
    datos.append('hora', hora);

    fetch('../BackEnd/registrar.php', {
        method: 'POST',
        body: datos
    }).then(response => response.json())
    .then(data => {
        let mensaje = document.createElement('div');
        let success = document.createElement('div');
        mensaje.className = 'alert';
        success.className = 'success';
        if (data.error) {
            switch (data.error) {
                case "empty":
                    mensaje.textContent = "Por favor, complete todos los campos.";
                    break;
                case "date":
                    mensaje.textContent = "La fecha debe ser mayor o igual a la fecha actual.";
                    break;
                case "invalid date":
                    mensaje.textContent = "Formato de fecha inválido. Debe ser YYYY-MM-DD.";
                    break;
                case "invalid hour":
                    mensaje.textContent = "Formato de hora inválido. Debe ser HH:MM.";
                    break;
                default:
                    mensaje.textContent = "Error: " + data.error;
            }
        } else {
            success.textContent = data.success;
        }

        mensajesAlerta.appendChild(mensaje);
        mensajesAlerta.appendChild(success);
    }).catch(error => {
        console.error('Error:', error);
        const mensaje = document.createElement('div');
        mensaje.className = 'alert';
        mensaje.textContent = 'Error al procesar la solicitud.';
        mensajesAlerta.appendChild(mensaje);
        
    });
});