class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <style>
        header {
    gap: 0.5vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5vw;
    padding-right: 1vw;
    padding-left: 0.5vw;
    background-color: #0A0B0A;
    width: fit-content;
    border-radius: 1vw;
    z-index: 999;
    position: relative;
    overflow: visible;
}
    
header .logo {
    max-width: 3vw;
    max-height: 3vw;
    z-index: 999;
}

header svg,
img {
    width: auto;
    height: 3vw;
    margin: 0;
    display: block;
    z-index: 999;
}

.user-dropdown {
    position: relative;
    display: inline-block;
}

.user-icon {
    cursor: pointer;
    margin-left: 6px;
}

.dropdown-content {
    position: absolute;
    top: 130%;
    left: 0;
    width: 200px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    display: none;
    z-index: 1000;
    border-radius: 8px;
    background-color: #e6e6e6;
}

.user-info {
    padding: 15px;
    
}

.user-info h3 {
    font-family: 'Poppins', sans-serif;
    font-weight: normal;
    color: #000000;
    margin: 0;
    font-size: 1.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}

.user-info h4 {
    font-family: 'Poppins', sans-serif;
    font-weight: normal;
    color: #444444;
    margin: 0;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}

.dropdown-btn {
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    color: rgb(0, 0, 0);
    border: none;
    font-family: 'Poppins', sans-serif;
    cursor: pointer;
    font-size: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.dropdown-btn:hover {
    background-color: #dddddd;
}

.dropdown-btn a{
    color: rgb(0, 0, 0);
    text-decoration: none;
    display: flex;
}

.dashboard-btn {
    display: none;
}

.dropdown-btn svg {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 10px;
}

.logout-btn {
    border-radius: 0 0 8px 8px;
}

.logout-btn:hover {
    background-color: #cf1212;
    color: white;
}

.logout-btn:hover svg {
    fill: #fff;
    color: #fff;
}

.dropdown-content.active {
    display: block;
}

.btn-header {
    font-family: 'Nesatho', sans-serif;
    color: #EFE7D2;
    z-index: 1;
    font-size: 1.2vw;
}
        </style>
      <header>
                <div class="user-dropdown" id="userDropdown">
                    <div class="user-icon" id="userIcon">
                        <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x=".101" y=".862" width="46" height="45.292" rx="22.646" fill="#181818"
                                fill-opacity=".5" />
                            <rect x=".601" y="1.362" width="45" height="44.292" rx="22.146" stroke="#767676"
                                stroke-opacity=".7" />
                            <path
                                d="M23 23.362q-2.337 0-4.002-1.714t-1.665-4.12 1.665-4.12T23 11.696t4.002 1.713 1.665 4.12-1.665 4.12T23 23.362M11.667 35.028v-4.083q0-1.24.62-2.279a4.2 4.2 0 0 1 1.646-1.586 20.7 20.7 0 0 1 4.463-1.695A19 19 0 0 1 23 24.82q2.337 0 4.604.565 2.267.566 4.463 1.695a4.2 4.2 0 0 1 1.647 1.586q.62 1.04.62 2.279v4.083zm2.833-2.916h17v-1.167q0-.4-.195-.73a1.4 1.4 0 0 0-.513-.51 18 18 0 0 0-3.86-1.476A16 16 0 0 0 23 27.737a16 16 0 0 0-3.931.492q-1.949.492-3.86 1.476a1.4 1.4 0 0 0-.514.51 1.4 1.4 0 0 0-.195.73zM23 20.445q1.17 0 2.001-.857a2.85 2.85 0 0 0 .832-2.06 2.85 2.85 0 0 0-.832-2.06q-.832-.856-2.001-.856t-2.001.856a2.85 2.85 0 0 0-.832 2.06q0 1.203.832 2.06.833.857 2.001.857"
                                fill="#A4A4A4" />
                        </svg>
                    </div>
                    <div class="dropdown-content">
                        <div class="user-info">
                            <h3 id="userName">Sin sesión</h3>
                            <h4 id="userRol">Sin sesión</h4>
                        </div>
                        <button class="dropdown-btn profile-btn" id="profileBtn">
                            <svg id='user-circle_24' width='24' height='24' viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                                <rect width='24' height='24' stroke='none' fill='#000000' opacity='0' />
                                <g transform="matrix(1 0 0 1 12 12)">
                                    <g style="">
                                        <g transform="matrix(1 0 0 1 0 0)">
                                            <path
                                                style="stroke: none; stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
                                                transform=" translate(-12, -12)" d="M 0 0 L 24 0 L 24 24 L 0 24 z"
                                                stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0 0)">
                                            <circle
                                                style="stroke: rgb(33,33,33); stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
                                                cx="0" cy="0" r="9" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0 -2)">
                                            <circle
                                                style="stroke: rgb(33,33,33); stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
                                                cx="0" cy="0" r="3" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0 5.43)">
                                            <path
                                                style="stroke: rgb(33,33,33); stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
                                                transform=" translate(-12, -17.43)"
                                                d="M 6.168 18.849 C 6.676237607775832 17.15745504037093 8.233752693994969 15.99947996713546 10.000000000000002 16 L 14 16 C 15.76863928839429 15.999389789459086 17.32772707883109 17.16036935171706 17.834 18.855"
                                                stroke-linecap="round" />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                            Mi usuario
                        </button>
                        <button class="dropdown-btn dashboard-btn" id="dashboardBtn">
                            <a href="../../../Admin/Gerente/Empresa/FrontEnd/index.html">
                                <svg id='Dashboard_Layout_24' width='24' height='24' viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                                    <rect width='24' height='24' stroke='none' fill='#000000' opacity='0' />
                                    <g transform="matrix(1 0 0 1 12 12)">
                                        <path
                                            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                            transform=" translate(-12, -12)"
                                            d="M 4 2 C 2.9069372 2 2 2.9069372 2 4 L 2 11 C 2 12.093063 2.9069372 13 4 13 L 9 13 C 10.093063 13 11 12.093063 11 11 L 11 4 C 11 2.9069372 10.093063 2 9 2 L 4 2 z M 15 2 C 13.906937 2 13 2.9069372 13 4 L 13 7 C 13 8.0930628 13.906937 9 15 9 L 20 9 C 21.093063 9 22 8.0930628 22 7 L 22 4 C 22 2.9069372 21.093063 2 20 2 L 15 2 z M 4 4 L 9 4 L 9 11 L 4 11 L 4 4 z M 15 4 L 20 4 L 20 7 L 15 7 L 15 4 z M 15 11 C 13.906937 11 13 11.906937 13 13 L 13 20 C 13 21.093063 13.906937 22 15 22 L 20 22 C 21.093063 22 22 21.093063 22 20 L 22 13 C 22 11.906937 21.093063 11 20 11 L 15 11 z M 15 13 L 20 13 L 20 20 L 15 20 L 15 13 z M 4 15 C 2.9069372 15 2 15.906937 2 17 L 2 20 C 2 21.093063 2.9069372 22 4 22 L 9 22 C 10.093063 22 11 21.093063 11 20 L 11 17 C 11 15.906937 10.093063 15 9 15 L 4 15 z M 4 17 L 9 17 L 9 20 L 4 20 L 4 17 z"
                                            stroke-linecap="round" />
                                    </g>
                                </svg>
                                Dashboard
                            </a>
                        </button>
                        <button class="dropdown-btn help-btn" id="helpBtn">
                            <svg id='Help_24' width='24' height='24' viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                                <rect width='24' height='24' stroke='none' fill='#000000' opacity='0' />
                                <g transform="matrix(0.83 0 0 0.83 12 12)">
                                    <path
                                        style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                        transform=" translate(-16, -16)"
                                        d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z M 16 10 C 13.800781 10 12 11.800781 12 14 L 14 14 C 14 12.882813 14.882813 12 16 12 C 17.117188 12 18 12.882813 18 14 C 18 14.765625 17.507813 15.445313 16.78125 15.6875 L 16.375 15.8125 C 15.558594 16.082031 15 16.863281 15 17.71875 L 15 19 L 17 19 L 17 17.71875 L 17.40625 17.59375 C 18.945313 17.082031 20 15.621094 20 14 C 20 11.800781 18.199219 10 16 10 Z M 15 20 L 15 22 L 17 22 L 17 20 Z"
                                        stroke-linecap="round" />
                                </g>
                            </svg>
                            Ayuda
                        </button>
                        <button class="dropdown-btn logout-btn" id="logoutBtn">
                            <svg id='Logout_Rounded_Left_24' width='24' height='24' viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                                <rect width='24' height='24' stroke='none' fill='#000000' opacity='0' />
                                <g transform="matrix(0.8 0 0 0.8 12 12)">
                                    <path
                                        style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill-rule: nonzero; opacity: 1;"
                                        transform=" translate(-14.49, -15)"
                                        d="M 15 3 C 12.445077 3 10.0833 3.8185753 8.1464844 5.1816406 C 7.694516983499322 5.499312192364347 7.585648707635651 6.123227883499321 7.9033203 6.5751953 C 8.220991892364347 7.027162716500678 8.844907583499321 7.136030992364349 9.296875 6.8183594 C 10.918059 5.6774247 12.870923 5 15 5 C 20.534534 5 25 9.4654664 25 15 C 25 20.534534 20.534534 25 15 25 C 12.870923 25 10.918059 24.322575 9.296875 23.181641 C 8.844907804413221 22.86396940763565 8.220992292364347 22.97283750441322 7.903320699999999 23.4248047 C 7.585649107635652 23.876771895586778 7.694517204413222 24.500687407635652 8.1464844 24.818359 C 10.0833 26.181425 12.445077 27 15 27 C 21.615466 27 27 21.615466 27 15 C 27 8.3845336 21.615466 3 15 3 z M 6.9804688 9.9902344 C 6.7206701476534 9.997975588778472 6.474090371827705 10.106554832127827 6.2929688 10.292969 L 2.3808594 14.205078 C 2.132518321721257 14.394520683571358 1.9869474488697152 14.689111906521271 1.987330693802456 15.001460549295155 C 1.9877139387351965 15.313809192069039 2.134007286128719 15.608042304023291 2.3828125 15.796875 L 6.2929688 19.707031 C 6.543786003039588 19.96826889121244 6.916234985168734 20.07350151917291 7.266675241169932 19.98214435131215 C 7.617115497171131 19.89078718345139 7.890787008886049 19.617115749150738 7.9821442758768875 19.26667551899203 C 8.073501542867726 18.91623528883332 7.968269020263018 18.54378627693672 7.7070312 18.292969 L 5.4140625 16 L 16 16 C 16.360635916577568 16.005100289545485 16.696081364571608 15.815624703830668 16.877887721486516 15.504127150285669 C 17.059694078401428 15.192629596740671 17.059694078401428 14.80737040325933 16.877887721486516 14.495872849714331 C 16.696081364571608 14.184375296169332 16.360635916577568 13.994899710454515 16 14 L 5.4140625 14 L 7.7070312 11.707031 C 8.002791491766063 11.419539571926101 8.091719747595327 10.979965021408564 7.930965494642052 10.600118287107804 C 7.770211241688777 10.220271552807047 7.392752249259285 9.978075910439886 6.9804688 9.9902344 z"
                                        stroke-linecap="round" />
                                </g>
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
                <a href="/ARJE-CodigoBase/App/Client/Panel/FrontEnd/index.html">
                <div class="logo">
                    <img src="/ARJE-CodigoBase/App/Recursos/logo.svg" alt="logo Los 3 Tanos">
                </div>
                </a>
                <span class="btn-header">PEDÍ AHORA</span>
            </header>
    `;
        async function logout() {
            try {
                const response = await fetch('/ARJE-CodigoBase/App/Control/Panel/BackEnd/logout.php', {
                    method: 'POST',
                    credentials: 'same-origin'
                });
                const data = await response.json();

                if (data.success) {
                    window.location.href = '/ARJE-CodigoBase/App/Control/SignIn/FrontEnd/index.html';
                } else {
                    console.error('Error al cerrar sesión:', data.message);
                    alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
            }
        }
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
    }
}

customElements.define('client-header', Header);