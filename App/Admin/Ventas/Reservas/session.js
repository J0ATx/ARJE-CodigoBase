async function checkSession() {
    try {
        const response = await fetch('../BackEnd/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();

        if (!data.logged_in || !data.is_admin) {
            // Si no hay sesión iniciada o no es admin, redirigir al login
            window.location.href = '../../../../Control/SignIn/FrontEnd/index.html';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error checking session:', error);
        return false;
    }
}

// Verificar sesión al cargar la página
window.addEventListener('load', async () => {
    await checkSession();
});

// Exportar la función para usarla en otros archivos
export { checkSession };