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
        const userNameElement = document.getElementById('userName');
        const userRolElement = document.getElementById('userRol');
        const dashboardBtnElement = document.getElementById('dashboardBtn');
        const notLoggedCards = document.querySelectorAll('.notlogged');
        const loggedCards = document.querySelectorAll('.logged');
        const userIcon = document.querySelector('.user-icon');
        showContent();

        if (!data.logged_in) {
            if (userNameElement) {
                userNameElement.textContent = "Sin sesión";
                userRolElement.textContent = "Sin sesión";
            }
            userIcon.innerHTML += `<a href="/ARJE-CodigoBase/App/Control/SignIn/FrontEnd/index.html" class="notlogged">
                            <svg width="clamp(35px, 4vw, 50px)" height="clamp(35px, 4vw, 50px)" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x=".101" y=".862" width="46" height="45.292" rx="22.646" fill="#181818"
                                    fill-opacity=".5" />
                                <rect x=".601" y="1.362" width="45" height="44.292" rx="22.146" stroke="rgba(118, 118, 118, 0.5)"
                                    stroke-opacity=".7" />
                                <path
                                    d="M23 23.362q-2.337 0-4.002-1.714t-1.665-4.12 1.665-4.12T23 11.696t4.002 1.713 1.665 4.12-1.665 4.12T23 23.362M11.667 35.028v-4.083q0-1.24.62-2.279a4.2 4.2 0 0 1 1.646-1.586 20.7 20.7 0 0 1 4.463-1.695A19 19 0 0 1 23 24.82q2.337 0 4.604.565 2.267.566 4.463 1.695a4.2 4.2 0 0 1 1.647 1.586q.62 1.04.62 2.279v4.083zm2.833-2.916h17v-1.167q0-.4-.195-.73a1.4 1.4 0 0 0-.513-.51 18 18 0 0 0-3.86-1.476A16 16 0 0 0 23 27.737a16 16 0 0 0-3.931.492q-1.949.492-3.86 1.476a1.4 1.4 0 0 0-.514.51 1.4 1.4 0 0 0-.195.73zM23 20.445q1.17 0 2.001-.857a2.85 2.85 0 0 0 .832-2.06 2.85 2.85 0 0 0-.832-2.06q-.832-.856-2.001-.856t-2.001.856a2.85 2.85 0 0 0-.832 2.06q0 1.203.832 2.06.833.857 2.001.857"
                                    fill="rgba(118, 118, 118, 0.7)" />
                            </svg>
                        </a>`
            const cloneUserIcon = userIcon.cloneNode(true);
            userIcon.parentNode.replaceChild(cloneUserIcon, userIcon);
            loggedCards.forEach(card => {
                card.style.display = 'none';
            });
            return false;
        } else {
            const resposnseAvatar = await fetch('/ARJE-CodigoBase/App/Control/Session/avatar.php', {
                method: 'GET',
                credentials: 'same-origin'
            });
            const avatar = await resposnseAvatar.json();
            userIcon.innerHTML += `<img src="/ARJE-CodigoBase/App/Recursos/avatars/${avatar.avatar}" id="avatar" class="logged" alt="Foto de perfíl">`
            if (userNameElement) {
                userNameElement.textContent = `${data.user.nombre} ${data.user.apellido}`;
                userRolElement.textContent = `${data.user.rol}`;
            }
            if (data.user.rol === "Gerente-General") {
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
        window.location.href = '/ARJE-CodigoBase/App/Control/SignIn/FrontEnd/index.html';
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