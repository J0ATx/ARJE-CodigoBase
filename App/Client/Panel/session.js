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
        const userNameElement = document.getElementById('userName');
        const userRolElement = document.getElementById('userRol');
        const dashboardBtnElement = document.getElementById('dashboardBtn');
        const notLoggedCards = document.querySelectorAll('.notlogged');
        const loggedCards = document.querySelectorAll('.logged');
        showContent();

        if (!data.logged_in) {
            if (userNameElement) {
                userNameElement.textContent = "Sin sesión";
                userRolElement.textContent = "Sin sesión";
            }
            return false;
        } else {
            if (userNameElement) {
                userNameElement.textContent = `${data.user.nombre} ${data.user.apellido}`;
                userRolElement.textContent = `${data.user.rol}`;
            }
            if (data.user.rol === "Gerente") {
                dashboardBtnElement.style.display = 'flex';
            }
            notLoggedCards.forEach(card => {
                card.style.display = 'none';
            });
            loggedCards.forEach(card => {
                card.style.display = 'block';
            });

            return true;
        }
    } catch (error) {
        //window.location.href = '../../../Control/SignIn/FrontEnd/index.html';
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

window.addEventListener('load', async () => {
    await loadSVGLogo();
    await checkSession();
});