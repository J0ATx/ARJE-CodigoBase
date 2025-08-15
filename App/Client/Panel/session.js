async function loadSVGLogo() {
    try {
        const response = await fetch('../../../Recursos/logo.svg');
        const svgText = await response.text();
        const logoContainer = document.getElementById('logo-container');
        if (logoContainer) {
            logoContainer.innerHTML = svgText;
            
            const svg = logoContainer.querySelector('svg');
            if (svg) {
                svg.setAttribute('fill', 'currentColor');
                svg.setAttribute('stroke', 'currentColor');
                svg.setAttribute('stroke-width', '1.5');
            }
        }
    } catch (error) {
        console.error('Error loading SVG logo:', error);
    }
}

async function checkSession() {
    try {
        const response = await fetch('../BackEnd/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();

        if (!data.logged_in) {
            window.location.href = '../../../Control/SignIn/FrontEnd/index.html';
            return false;
        }

        showContent();

        const userNameElement = document.getElementById('userName');
        const userRolElement = document.getElementById('userRol');
        const dashboardBtnElement = document.getElementById('dashboardBtn');
        if (userNameElement) {
            userNameElement.textContent = `${data.user.nombre} ${data.user.apellido}`;
            userRolElement.textContent = `${data.user.rol}`;
        }
        if(data.user.rol === "Gerente"){
            dashboardBtnElement.style.display = 'flex';
        }

        return true;
    } catch (error) {
        console.error('Error checking session:', error);
        window.location.href = '../../../Control/SignIn/FrontEnd/index.html';
        return false;
    }
}

function showContent() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('visible');
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

window.addEventListener('load', async () => {
    await loadSVGLogo();
    await checkSession();
});

document.addEventListener('DOMContentLoaded', () => {
    const userDropdown = document.getElementById('userDropdown');
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.querySelector('.dropdown-content');
    const logoutBtn = document.getElementById('logoutBtn');

    userIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target)) {
            dropdownContent.classList.remove('active');
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await logout();
        });
    }
});