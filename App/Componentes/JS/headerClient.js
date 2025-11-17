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
    border-radius: clamp(1vw, 1vw, 2vw);
    z-index: 999;
    position: relative;
    overflow: visible;
    box-shadow: 0 8px 16px -6px black;
    border: 1px solid rgba(239, 231, 210, 0.1);
}

a{
    text-decoration: none;
    }

header .logo {
    max-width: clamp(2rem, 3vw, 4rem);
    max-height: clamp(2rem, 3vw, 4rem);
    z-index: 999;
    transition: transform 0.3s ease;
}

header .logo:hover svg{
    opacity: 0.8;
}

/* Efecto de dibujo animado para el logo */
header .logo svg {
    fill-opacity: 1;
    stroke-dasharray: 300;
    stroke-dashoffset: 300;
    animation: drawLogo 3s ease-in-out infinite alternate;
    stroke: rgba(255, 255, 255, 0.5);
    stroke-width: 2;
}

@keyframes drawLogo {
    0% {
        stroke-dashoffset: 300;
        stroke-width: 2;
    }
    100% {
        stroke-dashoffset: 0;
        stroke-width: 0;
    }
}

header svg,
img {
    width: auto;
    height: clamp(2rem, 3vw, 4rem);
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

.user-icon { position: relative; }
.cart-btn { position: relative; }
.user-icon.has-notify::after,
.cart-btn.has-notify::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #D32F2F;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.3);
}

.user-icon img{
    border-radius: 100%;
    border: 1px solid #767676c0;
    width: auto;
    height: clamp(2rem, 3vw, 4rem);
    margin: 0;
    display: block;
    z-index: 999;
    aspect-ratio: 1/1;
    object-fit: cover;
}

.dropdown-content {
    position: absolute;
    top: 130%;
    left: 0;
    width: clamp(180px, 200px, 220px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    display: none;
    z-index: 1000;
    border-radius: 8px;
    background-color:rgb(27, 27, 27);
    border: 1px solid rgba(245, 245, 245, 0.1);
}

.user-info {
    padding: clamp(12px, 15px, 18px);
    
}

.user-info h3 {
    font-family: 'Poppins', sans-serif;
    font-weight: normal;
    color:rgb(224, 224, 224);
    margin: 0;
    font-size: clamp(1rem, 1.2rem, 1.4rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}

.user-info h4 {
    font-family: 'Poppins', sans-serif;
    font-weight: normal;
    color:rgb(155, 155, 155);
    margin: 0;
    font-size: clamp(0.9rem, 1rem, 1.1rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}

.dropdown-btn {
    width: 100%;
    padding: clamp(8px, 10px, 12px);
    display: flex;
    align-items: center;
    color: rgb(255, 255, 255);
    border: none;
    font-family: 'Poppins', sans-serif;
    cursor: pointer;
    font-size: clamp(0.9rem, 1rem, 1.1rem);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background-color:rgb(32, 32, 32);
}

.dropdown-btn:hover {
    background-color:rgb(20, 20, 20);
}

.dropdown-btn a{
    color: rgb(255, 255, 255);
    text-decoration: none;
    display: flex;
}

.dashboard-btn {
    display: none;
}

.dropdown-btn svg {
    width: clamp(1.2rem, 1.5rem, 1.8rem);
    height: clamp(1.2rem, 1.5rem, 1.8rem);
    margin-right: 10px;
    color: white;
    fill: white;
}

.logout-btn {
    border-radius: 0 0 8px 8px;
}

.cart-btn {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.cart-btn svg{
    fill: none !important;
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
    font-size: clamp(0.8rem, 1.2vw, 1.5rem);
}

.btn-header:hover {
    color: #EFE7D2;
    text-decoration: underline;
    text-decoration-color: #EFE7D2;
    text-decoration-thickness: 2px;
    text-decoration-style: solid;
    text-decoration-offset: 2px;
    text-decoration-color: #EFE7D2;
    text-decoration-thickness: 2px;
    text-decoration-style: solid;
    text-decoration-offset: 2px;
}
    .logged{
    display:none;
}
        </style>
        
      <header>
                <div class="user-dropdown" id="userDropdown">
                    <div class="user-icon" id="userIcon">
                    </div>
                    <div class="dropdown-content">
                        <div class="user-info">
                            <h3 id="userName">Sin sesión</h3>
                            <h4 id="userRol">Sin sesión</h4>
                        </div>
                        <a href='/App/Client/MiUsuario/Informacion/FrontEnd/index.html' class="dropdown-btn profile-btn" id="profileBtn">
                            <svg id='user-circle_24' width='24' height='24' viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                                <rect width='24' height='24' stroke='none' fill='white' opacity='0' />
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
                                                style="stroke: white; stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
                                                cx="0" cy="0" r="9" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0 -2)">
                                            <circle
                                                style="stroke: white; stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
                                                cx="0" cy="0" r="3" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0 5.43)">
                                            <path
                                                style="stroke: white; stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"
                                                transform=" translate(-12, -17.43)"
                                                d="M 6.168 18.849 C 6.676237607775832 17.15745504037093 8.233752693994969 15.99947996713546 10.000000000000002 16 L 14 16 C 15.76863928839429 15.999389789459086 17.32772707883109 17.16036935171706 17.834 18.855"
                                                stroke-linecap="round" />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                            Mi usuario
                        </a>

                        <a href='/App/Client/Ventas/TakeAway/FrontEnd/checkout.html' class="dropdown-btn cart-btn" id="cartBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                            Carrito
                        </a>

                        <button class="dropdown-btn dashboard-btn" id="dashboardBtn">
                            <a href="/App/Admin/Gerente/Empresa/FrontEnd/index.html">
                                <svg id='Dashboard_Layout_24' width='24' height='24' viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill="currentColor">
                                    <rect width='24' height='24' stroke='none' fill='white' opacity='0' />
                                    <g transform="matrix(1 0 0 1 12 12)">
                                        <path
                                            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: white; fill-rule: nonzero; opacity: 1;"
                                            transform=" translate(-12, -12)"
                                            d="M 4 2 C 2.9069372 2 2 2.9069372 2 4 L 2 11 C 2 12.093063 2.9069372 13 4 13 L 9 13 C 10.093063 13 11 12.093063 11 11 L 11 4 C 11 2.9069372 10.093063 2 9 2 L 4 2 z M 15 2 C 13.906937 2 13 2.9069372 13 4 L 13 7 C 13 8.0930628 13.906937 9 15 9 L 20 9 C 21.093063 9 22 8.0930628 22 7 L 22 4 C 22 2.9069372 21.093063 2 20 2 L 15 2 z M 4 4 L 9 4 L 9 11 L 4 11 L 4 4 z M 15 4 L 20 4 L 20 7 L 15 7 L 15 4 z M 15 11 C 13.906937 11 13 11.906937 13 13 L 13 20 C 13 21.093063 13.906937 22 15 22 L 20 22 C 21.093063 22 22 21.093063 22 20 L 22 13 C 22 11.906937 21.093063 11 20 11 L 15 11 z M 15 13 L 20 13 L 20 20 L 15 20 L 15 13 z M 4 15 C 2.9069372 15 2 15.906937 2 17 L 2 20 C 2 21.093063 2.9069372 22 4 22 L 9 22 C 10.093063 22 11 21.093063 11 20 L 11 17 C 11 15.906937 10.093063 15 9 15 L 4 15 z M 4 17 L 9 17 L 9 20 L 4 20 L 4 17 z"
                                            stroke-linecap="round" />
                                    </g>
                                </svg>
                                Dashboard
                            </a>
                        </button>
                        <button class="dropdown-btn help-btn" id="helpBtn">
                            <a href="/App/Client/Contacto/FrontEnd/index.html">
                            <svg id='Help_24' width='24' height='24' viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                                <rect width='24' height='24' stroke='none' fill='white' opacity='0' />
                                <g transform="matrix(0.83 0 0 0.83 12 12)">
                                    <path
                                        style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: white; fill-rule: nonzero; opacity: 1;"
                                        transform=" translate(-16, -16)"
                                        d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 16 6 C 21.535156 6 26 10.464844 26 16 C 26 21.535156 21.535156 26 16 26 C 10.464844 26 6 21.535156 6 16 C 6 10.464844 10.464844 6 16 6 Z M 16 10 C 13.800781 10 12 11.800781 12 14 L 14 14 C 14 12.882813 14.882813 12 16 12 C 17.117188 12 18 12.882813 18 14 C 18 14.765625 17.507813 15.445313 16.78125 15.6875 L 16.375 15.8125 C 15.558594 16.082031 15 16.863281 15 17.71875 L 15 19 L 17 19 L 17 17.71875 L 17.40625 17.59375 C 18.945313 17.082031 20 15.621094 20 14 C 20 11.800781 18.199219 10 16 10 Z M 15 20 L 15 22 L 17 22 L 17 20 Z"
                                        stroke-linecap="round" />
                                </g>
                            </svg>
                            Ayuda
                            </a>
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
                <a href="/App/Client/Panel/FrontEnd/index.html">
                <div class="logo">
                    <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42.9596 6C43.1437 6.55738 42.6528 7.42441 42.4073 7.91985L41.7937 8.72495L41.3641 9.34426C40.6835 10.2844 39.9879 11.2135 39.2777 12.1311L38.7255 12.8124C37.9837 13.7311 37.2058 14.6195 36.3936 15.4754L35.8413 16.0328C35.6164 16.2393 35.3914 16.4457 35.1663 16.6521C34.0618 17.7049 34.0618 17.7049 33.5708 17.7049L33.5095 17.5191V17.3333L33.4481 17.0856L33.3254 16.8379C32.7731 16.8998 32.4663 17.0856 32.1595 17.4572L31.6685 17.8907C30.878 18.5328 30.1202 19.2149 29.398 19.9344L28.6617 20.6157C27.9394 21.2921 27.2029 21.9529 26.4526 22.5974L26.3298 22.6594C26.168 22.7857 26.0044 22.9096 25.8389 23.031C25.5321 23.2787 25.2866 23.3406 24.9184 23.3406C23.998 23.4026 23.5071 23.898 22.9548 24.5792L22.832 24.7031L22.3411 25.2605L21.7888 25.8798L21.1138 26.623C19.8589 27.9199 18.6513 29.2626 17.4933 30.6485C16.1443 32.0562 14.8347 33.5018 13.566 34.9836C12.5842 36.0984 11.6023 37.1512 10.375 37.9563L9.39322 38.6995C8.8384 39.1621 8.21782 39.5378 7.55228 39.8142L7 40L7.36819 39.2568C7.47062 39.1331 7.5729 39.0092 7.67501 38.8852L8.10456 38.204L8.35002 37.8324L8.41138 37.7086L8.96366 36.8415L9.08639 36.6557C10.1292 35.0453 11.1724 33.4351 12.216 31.8251L12.8296 30.9581L13.0137 30.5865L13.5046 29.8434L13.6274 29.6576C13.8927 29.2443 14.1586 28.8314 14.4251 28.4189L14.5478 28.2332L14.7933 27.8616C15.2228 27.1803 15.5297 26.8087 16.3274 26.561C16.8797 26.3752 17.3092 26.1275 17.7388 25.7559L17.8615 25.6321L18.5365 24.827C19.2434 23.8577 20.0013 22.9274 20.807 22.0401C21.6849 20.9984 22.5241 19.9242 23.323 18.8197L23.4457 18.6958C24.4889 17.3333 25.7162 15.9089 27.4957 15.4754L27.9253 15.5373V16.1566L27.8639 16.4044L27.8026 16.5902C28.6617 16.5282 29.214 16.4044 29.8276 15.847L30.5026 15.2896C30.7691 15.0839 31.035 14.8774 31.3003 14.6703C32.276 13.9326 33.18 13.1032 34.0004 12.1931L34.3072 11.8834C34.6754 11.5738 35.1663 11.4499 35.6572 11.326C36.3322 11.2022 36.8232 10.9545 37.3141 10.5209L37.9277 10.0255L38.1118 9.83971L39.4005 8.78689C40.169 8.22464 40.926 7.64649 41.671 7.05282L42.4687 6.37158L42.9596 6Z" fill="white"/>
                        <path d="M46 15L45.7509 15.4938L45.6887 15.679L45.5642 15.8642L45.4396 15.9877C44.289 17.7173 43.1058 19.4255 41.8906 21.1111L41.766 21.2346C40.3284 22.9321 38.8545 24.5992 37.3453 26.2346L36.9717 26.4815L36.8472 26.6049L36.5981 26.7901C36.2868 26.9753 36.1 27.037 35.7264 26.9753L35.3528 26.6049C35.2283 26.4815 35.0415 26.4198 34.8547 26.4815C34.6057 26.4815 34.4811 26.6667 34.3566 26.8519L34.1075 27.037L33.983 27.1605L33.6717 27.4691L32.8 28.2099L31.9283 28.9506C31.4825 29.3305 31.0465 29.7216 30.6208 30.1235L30.1849 30.4938C28.8151 31.7284 28.8151 31.7284 27.8811 31.7901C27.3208 31.8519 27.0717 32.0988 26.6981 32.4691C26.4718 32.6974 26.2435 32.9238 26.0132 33.1481L25.5151 33.642C23.9275 35.1961 22.3706 36.7808 20.8453 38.3951L20.7208 38.5185C19.7256 39.6125 18.75 40.7238 17.7943 41.8519L17.3585 42.3457L16.6736 43.0247L16.5491 43.1481C16.3 43.3951 16.0509 43.5185 15.7396 43.7037C15.1749 44.0046 14.6145 44.3133 14.0585 44.6296L13.6849 44.8148L13.4981 44.9383L13.3113 45H13C14.3286 42.9702 15.6778 40.9536 17.0472 38.9506L17.1717 38.7654C17.7992 37.8841 18.4219 36.9993 19.0396 36.1111L19.1642 35.9877L19.2887 35.9259C19.5377 35.5967 19.7868 35.2675 20.0358 34.9383L20.1604 34.7531C20.534 34.321 20.8453 34.0741 21.4057 33.9506H22.0906L22.1528 33.8272L22.5264 33.3333L22.7132 33.0864L22.8377 33.0247L23.2736 32.4074L24.5189 30.9259C25.4619 29.8016 26.3959 28.6699 27.3208 27.5309L27.4453 27.4074C27.6334 27.1822 27.8202 26.9558 28.0057 26.7284L28.0679 26.6049C28.4415 26.1111 28.8151 25.8025 29.4377 25.6173L29.5623 25.5556L29.9981 25.4321L30.1226 25.3704H30.9321C31.1189 25.5556 31.1189 25.6173 31.1189 25.8642L31.1811 26.0494V26.2346L31.4302 26.1111L31.5547 25.9877L32.0528 25.5556C32.6174 25.0675 33.1576 24.5525 33.6717 24.0123L34.5434 23.2716C35.7409 22.1538 36.9447 21.0427 38.1547 19.9383L38.3415 19.8148L38.4038 19.7531L38.6528 19.5062C39.1509 18.9506 39.7113 18.9506 40.3962 18.8889C41.1434 18.8272 41.517 18.5802 42.0774 18.0247L42.3887 17.7778L43.5717 16.7901C43.9842 16.4373 44.3993 16.0875 44.817 15.7407L44.9415 15.6173L45.1283 15.4321C45.6264 15 45.6264 15 46 15Z" fill="#F30503"/>
                        <path d="M29 7.00081V7.12746L28.8135 7.31743L28.6269 7.38075L28.5026 7.50739L28.1917 7.76068L28.0052 7.88733L27.1969 8.52055C25.6848 9.75919 24.1294 10.942 22.5337 12.0666C21.8187 12.6296 21.0932 13.1785 20.3575 13.713C19.6114 14.2829 19.114 14.5362 18.1813 14.5362L18.1192 14.6628C17.7647 15.0436 17.4325 15.4454 17.1244 15.8659C16.7747 16.3493 16.4012 16.8143 16.0052 17.259L15.3834 17.9556C14.9202 18.4365 14.4843 18.9439 14.0777 19.4753L13.829 19.7286C13.5803 20.1085 13.2694 20.2985 12.8964 20.4252H12.772L12.7098 20.5518L12.4611 20.9317L12.399 21.0584L12.2746 21.2484L12.0259 21.565L11.9016 21.6916C11.0256 22.8324 10.1757 23.9936 9.35233 25.1743C8.89671 25.8649 8.41979 26.5407 7.92228 27.2007C7.08983 28.3537 6.23999 29.4937 5.37306 30.6201L5.2487 30.81L5 31C5.01308 30.4931 5.03381 29.9865 5.06218 29.4803C5.04634 28.0592 5.3438 26.6527 5.93264 25.3643C7.17617 21.7549 7.17617 21.7549 8.54404 20.7418C9.10363 20.2985 9.47668 19.7919 9.84974 19.222L10.4715 18.3988L10.5959 18.2089C11.0308 17.6176 11.466 17.0266 11.9016 16.4359C12.8342 15.1061 13.829 14.2829 15.3212 13.523C16.5026 12.8265 17.4352 11.8766 18.4301 10.8635C19.487 9.66035 20.6062 9.02713 22.1606 8.77384C22.5959 8.71052 23.0311 8.45723 23.4663 8.26726C25.189 7.41224 27.0838 6.97858 29 7.00081Z" fill="#02FC05"/>
                    </svg>
                </div>
                </a>
                <a href="/App/Client/Ventas/Menu/FrontEnd/index.html" class="btn-header">PEDÍ AHORA</a>
            </header>
    `;
        async function logout() {
            try {
                const response = await fetch('/App/Control/Panel/BackEnd/logout.php', {
                    method: 'POST',
                    credentials: 'same-origin'
                });
                const data = await response.json();

                if (data.success) {
                    window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
                } else {
                    console.error('Error al cerrar sesión:', data.message);
                    alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
            }
        }

        async function checkDashboardAccess() {
            try {
                const response = await fetch('/App/Control/Session/checkSession.php', {
                    method: 'GET',
                    credentials: 'same-origin'
                });
                const data = await response.json();

                if (data.logged_in && data.user && data.user.rol) {
                    const userRole = data.user.rol;
                    const dashboardBtn = document.querySelector('.dashboard-btn');
                    const dashboardLink = dashboardBtn.querySelector('a');

                    const roleDashboards = {
                        'Gerente-General': '/App/Admin/Gerente/Informes/FrontEnd/index.html',
                        'Camarero': '/App/Admin/Mesas/FrontEnd/index.html',
                        'Chef': '/App/Admin/Ventas/Pedidos/Cocina/FrontEnd/index.html',
                        'Chef-Ejecutivo': '/App/Admin/Ventas/Productos/FrontEnd/index.html',
                        'Gerente-Turno': '/App/Admin/Mesas/FrontEnd/index.html'
                    };

                    if (roleDashboards[userRole]) {
                        dashboardLink.href = roleDashboards[userRole];
                        dashboardBtn.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Error al verificar acceso al dashboard:', error);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const userDropdown = document.getElementById('userDropdown');
            const userIcon = document.getElementById('userIcon');
            const dropdownContent = document.querySelector('.dropdown-content');
            const logoutBtn = document.getElementById('logoutBtn');
            const cartBtn = document.getElementById('cartBtn');

            checkDashboardAccess();

            userIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownContent.classList.toggle('active');
                userIcon.classList.remove('has-notify');
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

            if (cartBtn) {
                cartBtn.addEventListener('click', () => {
                    cartBtn.classList.remove('has-notify');
                });
            }

            document.addEventListener('cart:changed', () => {
                if (userIcon) userIcon.classList.add('has-notify');
                if (cartBtn) cartBtn.classList.add('has-notify');
            });
        });
    }
}

customElements.define('client-header', Header);
