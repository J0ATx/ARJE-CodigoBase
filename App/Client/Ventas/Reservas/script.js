const btn = document.getElementById('btn');
const mensajesAlerta = document.querySelector('.mensajes-alerta');
const overlay = document.getElementById('reserva-overlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const btnCancelar = document.getElementById('cancelarReserva');
const btnConfirmar = document.getElementById('confirmarReserva');
let horariosPorDia = {};
const duracionReservaHoras = 2;
function parseTimeToSeconds(t) {
    const p = t.split(':');
    return (parseInt(p[0], 10) * 3600) + (parseInt(p[1], 10) * 60);
}
function secondsToHHMM(s) {
    const ss = ((s % 86400) + 86400) % 86400;
    const h = String(Math.floor(ss / 3600)).padStart(2, '0');
    const m = String(Math.floor((ss % 3600) / 60)).padStart(2, '0');
    return `${h}:${m}`;
}
function obtenerDiaSemana(fechaStr) {
    const d = new Date(fechaStr + 'T00:00:00');
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[d.getDay()];
}
function actualizarRestriccionesHora() {
    const fecha = document.getElementById('fecha').value;
    const horaInput = document.getElementById('hora');
    const datalist = document.getElementById('horarios-validos');
    const guia = document.getElementById('horarios-disponibles');
    if (!fecha) return;
    const dia = obtenerDiaSemana(fecha);
    const ranges = horariosPorDia[dia] || [];
    if (!ranges.length) {
        horaInput.value = '';
        horaInput.disabled = true;
        if (datalist) datalist.innerHTML = '';
        if (guia) guia.innerHTML = '';
        let mensaje = document.createElement('p');
        mensaje.textContent = 'El restaurante no abre ese día.';
        guia.innerHTML = '';
        guia.appendChild(mensaje);
        return;
    }
    horaInput.disabled = false;
    let minStartSec = null;
    let maxEndSec = null;
    let hasWrap = false;
    let endsAtMidnight = false;
    ranges.forEach(r => {
        const partes = r.split('-');
        if (partes.length === 2) {
            const ini = partes[0].trim();
            const fin = partes[1].trim();
            const iniSec = parseTimeToSeconds(ini);
            let finSec = parseTimeToSeconds(fin);
            if (finSec === 0) { finSec = 86400; endsAtMidnight = true; }
            if (finSec <= iniSec) { finSec += 86400; hasWrap = true; }
            if (minStartSec === null || iniSec < minStartSec) minStartSec = iniSec;
            if (maxEndSec === null || finSec > maxEndSec) maxEndSec = finSec;
        }
    });
    if (minStartSec !== null) {
        horaInput.setAttribute('min', secondsToHHMM(minStartSec));
        if (ranges.length === 1 && !hasWrap && !endsAtMidnight && maxEndSec !== null && maxEndSec >= minStartSec) {
            horaInput.setAttribute('max', secondsToHHMM(maxEndSec));
        } else {
            horaInput.removeAttribute('max');
        }
        horaInput.setAttribute('step', '60');
    }

    const opciones = [];
    ranges.forEach(r => {
        const partes = r.split('-');
        if (partes.length !== 2) return;
        const ini = partes[0].trim();
        const fin = partes[1].trim();
        let iniSec = parseTimeToSeconds(ini);
        let finSec = parseTimeToSeconds(fin);
        if (finSec === 0) finSec = 86400;
        if (finSec <= iniSec) finSec += 86400;
        let t = iniSec;
        const limite = finSec - (duracionReservaHoras * 3600);
        while (t <= limite) {
            opciones.push(secondsToHHMM(t));
            t += 1800;
        }
    });
    if (datalist) {
        datalist.innerHTML = opciones.map(v => `<option value="${v}"></option>`).join('');
    }
    if (guia) {
        guia.innerHTML = ranges.map(r => `<span class="chip">${r.trim()}</span>`).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fecha');
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    const minDate = twoDaysLater.toISOString().split('T')[0];
    fechaInput.setAttribute('min', minDate);
    fetch('/App/Client/Contacto/BackEnd/informacion.php')
        .then(r => r.json())
        .then(data => {
            console.log(data)
            horariosPorDia = {};
            (data.horarios || []).forEach(h => {
                const dia = h.empresa_dia;
                const hora = h.empresa_hora;
                if (!horariosPorDia[dia]) horariosPorDia[dia] = [];
                horariosPorDia[dia].push(hora);
            });
            actualizarRestriccionesHora();
        });
    fechaInput.addEventListener('change', actualizarRestriccionesHora);
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    mensajesAlerta.innerHTML = '';

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const cantidad = document.getElementById('cantidad').value;
    const mesa_id = document.getElementById('mesa_id').value;
    const guia = document.getElementById('horarios-disponibles');
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

    const dia = obtenerDiaSemana(fecha);
    const ranges = horariosPorDia[dia] || [];
    if (!ranges.length) {
        let mensaje = document.createElement('p');
        mensaje.textContent = 'El restaurante no abre ese día.';
        guia.innerHTML = '';
        guia.appendChild(mensaje);
        return;
    }
    const inicio = parseTimeToSeconds(hora);
    const fin = inicio + (duracionReservaHoras * 3600);
    const valido = ranges.some(r => {
        const partes = r.split('-');
        if (partes.length !== 2) return false;
        const ri = parseTimeToSeconds(partes[0].trim());
        let rf = parseTimeToSeconds(partes[1].trim());
        if (rf === 0) rf = 86400;
        if (rf <= ri) rf += 86400;
        let checkFin = fin;
        if (checkFin <= ri) checkFin += 86400;
        return inicio >= ri && checkFin <= rf;
    });
    if (!valido) {
        let mensaje = document.createElement('p');
        mensaje.textContent = 'Selecciona una hora dentro del horario de apertura.';
        mensaje.className = 'alert';
        mensajesAlerta.innerHTML = '';
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
                        mensaje.textContent = "Formato de fecha inválido. Debe ser DD-MM-YYYY.";
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
                        mensaje.textContent = "No existe esa mesa.";
                        break;
                    case "table_not_reservable":
                        mensaje.textContent = "La mesa seleccionada no está disponible para reservas.";
                        break;
                    case "table_unavailable":
                        mensaje.textContent = "La mesa seleccionada no está disponible en ese horario.";
                        break;
                    case "table_not_available":
                        mensaje.textContent = "La mesa seleccionada no está disponible.";
                        break;
                    case "table_not_amount":
                        mensaje.textContent = "La mesa seleccionada no tiene suficiente capacidad.";
                        break;
                    case "closed_day":
                        mensaje.textContent = "El restaurante no abre ese día.";
                        break;
                    case "outside_open_hours":
                        mensaje.textContent = "Selecciona una hora dentro del horario de apertura.";
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
