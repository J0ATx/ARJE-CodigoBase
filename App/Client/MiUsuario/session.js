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
        const response = await fetch('/ARJE-CodigoBase/App/Control/Session/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();
        if (!data.logged_in) {
            window.location.href = '../../../../Control/SignIn/FrontEnd/index.html';
            return false;
        } else {
            const res = await fetch('/ARJE-CodigoBase/App/Control/Session/avatar.php', {
                method: 'GET',
                credentials: 'same-origin'
            });
            const avatar = await res.json();
            document.getElementById('avatar').src = "/ARJE-CodigoBase/App/Recursos/avatars/" + avatar.avatar
            showContent();
        }
    } catch (error) {
        console.error('Error checking session:', error);
        window.location.href = '/ARJE-CodigoBase/App/Control/SignIn/FrontEnd/index.html';
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
