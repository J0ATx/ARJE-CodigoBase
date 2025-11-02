/**
 * Script para manejar el menú desplegable de acciones en la tabla de reservas
 */

// Función para alternar la visibilidad del menú de opciones
function toggleMenu(btn) {
    // Ocultar otros menús abiertos
    document.querySelectorAll('.menu-opciones').forEach(menu => {
        if (menu !== btn.nextElementSibling) menu.style.display = 'none';
    });
    
    // Alternar visibilidad del menú actual
    const menu = btn.nextElementSibling;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// Cerrar menús al hacer clic fuera de ellos
document.addEventListener('click', function (e) {
    if (!e.target.closest('.acciones')) {
        document.querySelectorAll('.menu-opciones').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});
// Abrir modal de nueva reserva
function abrirModalNuevaReserva() {
    if (modalNuevaReserva) {
        modalNuevaReserva.style.display = 'flex';
        // Enfocar el primer campo
        document.getElementById('cliente_id').focus();
    }
}

// Cerrar modal de nueva reserva
function cerrarModalNuevaReserva() {
    if (modalNuevaReserva) {
        modalNuevaReserva.style.display = 'none';
        // Limpiar el formulario
        if (formNuevaReserva) {
            formNuevaReserva.reset();
        }
    }
}
// Agregar evento al botón de nueva reserva
document.addEventListener('DOMContentLoaded', function() {
    const btnNuevaReserva = document.getElementById('btnNuevaReserva');
    if (btnNuevaReserva) {
        btnNuevaReserva.addEventListener('click', abrirModalNuevaReserva);
    }
});
