const btn = document.getElementById('btn');
const mensajesAlerta = document.querySelector('.mensajes-alerta');
const overlay = document.getElementById('reserva-overlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const btnCancelar = document.getElementById('cancelarReserva');
const btnConfirmar = document.getElementById('confirmarReserva');

document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fecha');
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    const minDate = twoDaysLater.toISOString().split('T')[0];
    fechaInput.setAttribute('min', minDate);
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    mensajesAlerta.innerHTML = '';

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const cantidad = document.getElementById('cantidad').value;
    const mesa_id = document.getElementById('mesa_id').value;

    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    twoDaysLater.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < twoDaysLater) {
        let mensaje = document.createElement('div');
        mensaje.className = 'alert';
        mensaje.textContent = "Las reservas deben realizarse con al menos 2 días de antelación.";
        mensajesAlerta.appendChild(mensaje);
        return;
    }

    document.getElementById('resumen-fecha').textContent = fecha;
    document.getElementById('resumen-hora').textContent = hora;
    document.getElementById('resumen-cantidad').textContent = cantidad;
    document.getElementById('resumen-mesa').textContent = mesa_id;

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
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const cantidad = document.getElementById('cantidad').value;
    const mesa_id = document.getElementById('mesa_id').value;

    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('cantidad', cantidad);
    datos.append('mesa_id', mesa_id);

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
                        mensaje.textContent = "La fecha debe ser mayor a la fecha actual (al menos 2 días de antelación).";
                        break;
                    case "advance_required":
                        mensaje.textContent = "Las reservas deben realizarse con al menos 2 días de antelación.";
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
                    case "invalid cantidad":
                        mensaje.textContent = "La cantidad debe ser un número entre 1 y 6.";
                        break;
                    case "not client":
                        mensaje.textContent = "Solo los usuarios pueden hacer reservas.";
                        break;
                    case "missing_table":
                        mensaje.textContent = "Por favor, ingresa el ID de la mesa.";
                        break;
                    case "invalid_table":
                        mensaje.textContent = "La mesa ingresada no existe en el sistema.";
                        break;
                    case "table_not_reservable":
                        mensaje.textContent = "La mesa seleccionada no está disponible para reservas.";
                        break;
                    case "table_unavailable":
                        mensaje.textContent = "La mesa seleccionada no está disponible en ese horario.";
                        break;
                    default:
                        mensaje.textContent = "Error: " + data.error;
                }
            } else {
                success.textContent = data.success || "Reserva creada exitosamente";
                ocultarModal();
                document.getElementById('fecha').value = '';
                document.getElementById('hora').value = '';
                document.getElementById('cantidad').value = '';
                document.getElementById('mesa_id').value = '';
            }

            mensajesAlerta.appendChild(mensaje);
            mensajesAlerta.appendChild(success);
        })
});