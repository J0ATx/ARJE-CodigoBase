const btn = document.getElementById('btn');
const mensajesAlerta = document.querySelector('.mensajes-alerta');
const overlay = document.getElementById('reserva-overlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const btnCancelar = document.getElementById('cancelarReserva');
const btnConfirmar = document.getElementById('confirmarReserva');

// Establecer fecha mínima (2 días de antelación) al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fecha');
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    const minDate = twoDaysLater.toISOString().split('T')[0];
    fechaInput.setAttribute('min', minDate);

    // Manejar cambio de tipo de asignación
    const radioButtons = document.querySelectorAll('input[name="tipoAsignacion"]');
    const comentarioContainer = document.getElementById('comentarioContainer');
    const comentarioTextarea = document.getElementById('comentario');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'manual') {
                comentarioContainer.style.display = 'block';
                comentarioTextarea.required = true;
            } else {
                comentarioContainer.style.display = 'none';
                comentarioTextarea.required = false;
                comentarioTextarea.value = '';
            }
        });
    });
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    mensajesAlerta.innerHTML = '';

    const ubicacion = document.getElementById('lugar').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const cantidad = document.getElementById('cantidad').value;

    // Validar que la fecha sea al menos 2 días de antelación
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

    // Validar comentario si es asignación manual
    const tipoAsignacion = document.querySelector('input[name="tipoAsignacion"]:checked').value;
    const comentario = document.getElementById('comentario').value.trim();

    if (tipoAsignacion === 'manual' && !comentario) {
        let mensaje = document.createElement('div');
        mensaje.className = 'alert';
        mensaje.textContent = "Por favor, especifica tus preferencias para la asignación manual de mesa.";
        mensajesAlerta.appendChild(mensaje);
        return;
    }

    // Completar resumen en el modal
    document.getElementById('resumen-ubicacion').textContent = ubicacion;
    document.getElementById('resumen-fecha').textContent = fecha;
    document.getElementById('resumen-hora').textContent = hora;
    document.getElementById('resumen-cantidad').textContent = cantidad;

    // Mostrar información de asignación
    const asignacionInfo = document.getElementById('resumen-asignacion-info');
    const asignacionText = document.getElementById('resumen-asignacion');

    if (tipoAsignacion === 'automatica') {
        asignacionText.textContent = 'Automática - Te asignaremos la mejor mesa disponible';
        asignacionInfo.style.display = 'block';
    } else {
        asignacionText.textContent = 'Manual - Un gerente asignará la mesa según tus especificaciones';
        asignacionInfo.style.display = 'block';
    }

    // Mostrar modal
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
});

function ocultarModal() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
    // Ocultar información de asignación
    document.getElementById('resumen-asignacion-info').style.display = 'none';
}

modalCloseBtn.addEventListener('click', ocultarModal);
btnCancelar.addEventListener('click', ocultarModal);

btnConfirmar.addEventListener('click', () => {
    mensajesAlerta.innerHTML = '';
    // Mostrar modal
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    // Ocultar información de asignación
    document.getElementById('resumen-asignacion-info').style.display = 'none';
    const ubicacion = document.getElementById('lugar').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const cantidad = document.getElementById('cantidad').value;
    const tipoAsignacion = document.querySelector('input[name="tipoAsignacion"]:checked').value;
    const comentario = document.getElementById('comentario').value.trim();

    const datos = new FormData();
    datos.append('ubicacion', ubicacion);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('cantidad', cantidad);
    datos.append('tipoAsignacion', tipoAsignacion);
    if (tipoAsignacion === 'manual') {
        datos.append('comentario', comentario);
    }

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
                success.textContent = data.success || "Reserva creada exitosamente. Un gerente la confirmará pronto.";
                ocultarModal();
                document.getElementById('lugar').value = '';
                document.getElementById('fecha').value = '';
                document.getElementById('hora').value = '';
                document.getElementById('cantidad').value = '';
                document.getElementById('comentario').value = '';
                document.querySelector('input[name="tipoAsignacion"][value="automatica"]').checked = true;
                document.getElementById('comentarioContainer').style.display = 'none';
            }

            mensajesAlerta.appendChild(mensaje);
            mensajesAlerta.appendChild(success);
        })
});