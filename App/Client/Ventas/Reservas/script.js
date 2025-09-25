const btn = document.getElementById('btn');
const mensajesAlerta = document.querySelector('.mensajes-alerta');
const overlay = document.getElementById('reserva-overlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const btnCancelar = document.getElementById('cancelarReserva');
const btnConfirmar = document.getElementById('confirmarReserva');



formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    mensajesAlerta.innerHTML = '';

    const ubicacion = document.getElementById('lugar').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const cantidad = document.getElementById('cantidad').value;

    // Completar resumen en el modal
    document.getElementById('resumen-ubicacion').textContent = ubicacion;
    document.getElementById('resumen-fecha').textContent = fecha;
    document.getElementById('resumen-hora').textContent = hora;
    document.getElementById('resumen-cantidad').textContent = cantidad;

    // Mostrar modal
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
});

function ocultarModal() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
}

modalCloseBtn.addEventListener('click', ocultarModal);
btnCancelar.addEventListener('click', ocultarModal);

btnConfirmar.addEventListener('click', () => {
    mensajesAlerta.innerHTML = '';
    // Mostrar modal
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    const ubicacion = document.getElementById('lugar').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const cantidad = document.getElementById('cantidad').value;

    const datos = new FormData();
    datos.append('ubicacion', ubicacion);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('cantidad', cantidad);

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
                    case "success":
                        success.textContent = "Reserva realizada exitosamente!";
                        break;
                    case "invalid date":
                        mensaje.textContent = "Formato de fecha inválido. Debe ser YYYY-MM-DD.";
                        break;
                    case "invalid hour":
                        mensaje.textContent = "Formato de hora inválido. Debe ser HH:MM.";
                        break;
                    case "invalid ubicacion":
                        mensaje.textContent = "Seleccione una ubicación válida (Interior o Exterior).";
                        break;
                    case "invalid cantidad":
                        mensaje.textContent = "La cantidad debe ser un número entre 1 y 6.";
                        break;
                    case "not client":
                        mensaje.textContent = "Solo los usuarios pueden hacer reservas.";
                        break;
                    case "no availability":
                        mensaje.textContent = "No hay disponibilidad en ese horario y ubicación. Intente con otra hora o día.";
                        break;
                    default:
                        mensaje.textContent = "Error: " + data.error;
                }
            } else {
                success.textContent = data.success;
                ocultarModal();
                document.getElementById('lugar').value = '';
                document.getElementById('fecha').value = '';
                document.getElementById('hora').value = '';
                document.getElementById('cantidad').value = '';
            }

            mensajesAlerta.appendChild(mensaje);
            mensajesAlerta.appendChild(success);
        })
});