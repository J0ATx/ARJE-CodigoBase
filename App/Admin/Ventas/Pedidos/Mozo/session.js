async function loadSVGLogo() {
    try {
        const response = await fetch('/ARJE-CodigoBase/App/Recursos/logo.svg');
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
            window.location.href = '../../../../../Control/SignIn/FrontEnd/index.html';
            return false;
        }

        if (data.user.rol !== "Gerente-General" && data.user.rol !== "Mozo" && data.user.rol !== "Camarero") {
            window.location.href = '../../../../../Client/Panel/FrontEnd/index.html';
            return false;
        }

        // Actualizar información del usuario en el navbar
        updateUserInfo(data.user);

        showContent();
        return true;
    } catch (error) {
        console.error('Error checking session:', error);
        window.location.href = '../../../../../Control/SignIn/FrontEnd/index.html';
        return false;
    }
}

function updateUserInfo(user) {
    const userNameElements = document.querySelectorAll('#userName');
    const userRolElements = document.querySelectorAll('#userRol');

    const fullName = `${user.nombre} ${user.apellido}`;

    userNameElements.forEach(element => {
        if (element) {
            element.textContent = fullName;
        }
    });

    userRolElements.forEach(element => {
        if (element) {
            element.textContent = user.rol;
        }
    });
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

    // Para mozo, mostrar el contenido KDS
    const kdsContainer = document.querySelector('.kds-container');
    if (kdsContainer) {
        kdsContainer.style.display = 'block';
    }
}

window.addEventListener('load', async () => {
    await loadSVGLogo();
    await checkSession();
});
