async function checkSession() {
    try {
        const response = await fetch('../BackEnd/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();

        if (!data.logged_in) {
            // Si no hay sesión iniciada, redirigir al login
            window.location.href = '../../../Control/SignIn/FrontEnd/index.html';
            return false;
        }

        // Mostrar nombre del usuario en el modal
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `${data.user.nombre} ${data.user.apellido}`;
        }

        return true;
    } catch (error) {
        console.error('Error checking session:', error);
        return false;
    }
}

async function logout() {
    try {
        const response = await fetch('../../../Control/Panel/BackEnd/logout.php', {
            method: 'POST',
            credentials: 'same-origin'
        });
        const data = await response.json();

        if (data.success) {
            // Redirigir al login después de cerrar sesión
            window.location.href = '../../../Control/SignIn/FrontEnd/index.html';
        } else {
            console.error('Error al cerrar sesión:', data.message);
            alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
    }
}

// Verificar sesión al cargar la página
window.addEventListener('load', async () => {
    await checkSession();
});

// Manejar el menú desplegable
document.addEventListener('DOMContentLoaded', () => {
    const userDropdown = document.getElementById('userDropdown');
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.querySelector('.dropdown-content');
    const logoutBtn = document.getElementById('logoutBtn');

    // Abrir/cerrar menú desplegable al hacer clic en el ícono
    userIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('active');
    });

    // Cerrar menú desplegable al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target)) {
            dropdownContent.classList.remove('active');
        }
    });

    // Cerrar menú desplegable al hacer clic en el botón de cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Evitar que el clic cierre el menú
            await logout();
        });
    }
});

// Exportar las funciones para usarlas en otros archivos
export { checkSession, logout };
