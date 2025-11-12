const ROLE_PERMISSIONS = {
    'Gerente-General': {
        sections: ['estadisticas', 'promociones', 'pedidos', 'inventario', 
                   'reservas', 'mesas', 'cocina', 'productos', 'usuarios', 'empresa'],
        fullAccess: true
    },
    'Camarero': {
        sections: ['mesas', 'reservas', 'pedidos'],
        fullAccess: true
    },
    'Chef': {
        sections: ['productos', 'cocina'],
        fullAccess: false,
        readOnly: ['productos']
    },
    'Chef-Ejecutivo': {
        sections: ['productos', 'cocina', 'promociones', 'inventario'],
        fullAccess: true
    },
    'Gerente-Turno': {
        sections: ['reservas', 'mesas', 'productos', 'promociones', 'inventario'],
        fullAccess: true
    }
};

const NAVBAR_SECTIONS = {
    estadisticas: {
        id: 'estadisticas',
        label: 'Estadísticas',
        href: '/Informes',
        icon: '/App/Componentes/svg/Estadisticas.svg',
        dataPage: 'estadisticas'
    },
    promociones: {
        id: 'promociones',
        label: 'Promociones',
        href: '/Promociones',
        icon: '/App/Componentes/svg/Promociones.svg',
        dataPage: 'promociones'
    },
    pedidos: {
        id: 'pedidos',
        label: 'Pedidos',
        href: '/Pedidos',
        icon: '/App/Componentes/svg/Pedidos.svg',
        dataPage: 'pedidos'
    },
    inventario: {
        id: 'inventario',
        label: 'Inventario',
        href: '/Inventario',
        icon: '/App/Componentes/svg/Inventario.svg',
        dataPage: 'inventario'
    },
    reservas: {
        id: 'reservas',
        label: 'Reservas',
        href: '/ReservasAdmin',
        icon: '/App/Componentes/svg/Reservas.svg',
        dataPage: 'reservas'
    },
    mesas: {
        id: 'mesas',
        label: 'Mesas',
        href: '/Mesas',
        icon: '/App/Componentes/svg/Mesas.svg',
        dataPage: 'mesas'
    },
    cocina: {
        id: 'cocina',
        label: 'Cocina',
        href: '/Cocina',
        icon: '/App/Componentes/svg/Cocina.svg',
        dataPage: 'cocina'
    },
    productos: {
        id: 'productos',
        label: 'Platillos',
        href: '/Platillos',
        icon: '/App/Componentes/svg/Platillos.svg',
        dataPage: 'productos'
    },
    usuarios: {
        id: 'usuarios',
        label: 'Usuarios',
        href: '/Usuarios',
        icon: '/App/Componentes/svg/Usuarios.svg',
        dataPage: 'usuarios'
    },
    empresa: {
        id: 'empresa',
        label: 'Datos empresariales',
        href: '/Empresa',
        icon: '/App/Componentes/svg/Datos.svg',
        dataPage: 'empresa'
    }
};

function hasPermission(userRole, sectionId) {
    return ROLE_PERMISSIONS[userRole]?.sections.includes(sectionId) || false;
}

function buildMenuHTML(userRole) {
    const allowedSections = ROLE_PERMISSIONS[userRole]?.sections || [];
    
    if (allowedSections.length === 0) {
        return '';
    }
    
    let menuHTML = '';
    
    for (const [, section] of Object.entries(NAVBAR_SECTIONS)) {
        if (hasPermission(userRole, section.id)) {
            menuHTML += `
            <li>
                <a href="${section.href}" class="nav-link" data-page="${section.dataPage}">
                    <img src="${section.icon}" alt="${section.label}"> ${section.label}
                </a>
            </li>`;
        }
    }
    return menuHTML;
}

class NavAdmin extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        try {
            const response = await fetch('/App/Control/Session/checkSession.php', {
                method: 'GET',
                credentials: 'same-origin'
            });
            
            const data = await response.json();
            
            if (!data.logged_in) {
                window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
                return;
            }
            
            const userRole = data.user?.rol;
            
            if (!userRole) {
                window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
                return;
            }
            
            const menuHTML = buildMenuHTML(userRole);
            
            this.innerHTML = `
        <style>

            .menu-toggle {
                display: none;
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001 !important;
                background-color: #1c1c1c;
                border: none;
                border-radius: 8px;
                padding: 12px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }

            .menu-toggle:hover {
                background-color: #363636;
                transform: scale(1.05);
            }

            .menu-toggle span {
                display: block;
                width: 25px;
                height: 3px;
                background-color: #F5F5F5;
                margin: 5px 0;
                transition: all 0.3s ease;
                border-radius: 2px;
            }

            .menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }

            .menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -7px);
            }

            .nav-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .nav-overlay.active {
                display: block;
                opacity: 1;
            }

            nav {
                width: 300px;
                height: calc(100vh - 80px);
                background-color: #F5F5F5;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                position: relative;
                z-index: 1000;
            }

            nav .logo {
                width: 75px;
                filter: drop-shadow(0 0 1px black);
            }

            nav .logo-container {
                display: flex;
                height: 100px;
                align-items: center;
                justify-content: center;
                padding-top: 16px;
                padding-bottom: 16px;
                margin-bottom: 4px;
                margin-top: 4px;
                background-color: #F5F5F5;
            }

            nav .logo-container p {
                margin: 0;
                margin-left: 10px;
                font-size: 2.5rem;
                font-weight: 1000;
                color: #0A0B0A;
                line-height: 32px;
                font-family: 'Poppins', sans-serif;
            }
            nav .logo-container a {
                display:flex;
                text-decoration: none;
                justify-content: center;
                align-items: center;
            }

            nav hr {
                margin: 0;
                height: 1px;
                background-color:rgb(0, 0, 0);
            }

            nav ul {
                overflow-y: auto;
                list-style: none;
                padding: 0;
                margin: 0;
                flex: 1;
            }

            nav ul li {
                margin: 10px 0;
                margin-inline: 8px;
            }

            nav ul li a {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                color: #434343;
                font-weight: 600;
                text-decoration: none;
                border-radius: 6px;
                transition: background-color 0.3s;
                font-family: 'Poppins', sans-serif;
                font-size: 1rem;
            }

            nav ul li a img {
                width: 24px;
                height: 24px;
                margin-right: 10px;
                vertical-align: middle;
            }

            nav .dropdown {
                position: relative;
                display: block;
            }

            nav .dropdown-toggle {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                color: #434343;
                font-weight: 600;
                text-decoration: none;
                border-radius: 6px;
                transition: background-color 0.3s;
                font-family: 'Poppins', sans-serif;
                font-size: 1rem;
                background: none;
                border: none;
                width: 100%;
                cursor: pointer;
                text-align: left;
            }

            nav .dropdown-toggle::after {
                content: "▼";
                font-size: 0.8rem;
                margin-left: auto;
                transition: transform 0.3s;
            }

            nav .dropdown.active .dropdown-toggle::after {
                transform: rotate(180deg);
            }

            nav .dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                background-color: #F5F5F5;
                min-width: 200px;
                border-radius: 6px;
                box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                margin-top: 5px;
                border: 1px solid #E0E0E0;
            }

            nav .dropdown.active .dropdown-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            nav .dropdown-menu li {
                list-style: none;
            }

            nav .dropdown-menu a {
                display: block;
                padding: 10px 16px;
                color: #434343;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s;
                font-family: 'Poppins', sans-serif;
                font-size: 0.9rem;
                margin: 2px;
            }

            nav .dropdown-menu a:hover {
                background-color: #E8E8E8;
            }


            nav .user-section {
                position:fixed;
                bottom: 0;
                width: 300px;
                display: flex;
                align-items: center;
                padding: 16px;
                background-color: #F5F5F5;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #DDDDDD;
            }

            nav .user-avatar {
                width: 47px;
                height: 47px;
                border-radius: 50%;
                background-color: #0A0B0A;
                margin-right: 14px;
            }

            nav .user-info {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .user-icon img{
                border-radius: 100%;
                border: 1px solid #767676c0;
                width: 47px;
                height: 47px;
                margin: 0;
                display: block;
                z-index: 999;
                aspect-ratio: 1/1;
                object-fit: cover;
            }

            nav .user-name {
                font-size: 0.9rem;
                font-weight: 600;
                color: #000000;
                margin-bottom: 3px;
                font-family: 'Poppins', sans-serif;
                line-height: 1.2;
            }

            nav .user-role {
                font-size: 0.8rem;
                color: #444444;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                line-height: 1.2;
            }

            nav .logout-btn {
                border: none;
                font-size: 1.1rem;
                cursor: pointer;
                padding: 10px;
                border-radius: 50%;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #F5F5F5;
            }

            nav .logout-btn:hover {
                background-color:rgb(255, 122, 122);
            }
            nav .active-link{
                background-color: #C3C3C3;
            }

            @media (max-width: 767px) {
                .menu-toggle {
                    display: block !important;
                }

                nav {
                    position: fixed;
                    top: 0;
                    left: -300px;
                    height: 100vh;
                    width: 300px;
                    z-index: 1000;
                    transition: left 0.3s ease;
                    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
                }

                nav.active {
                    left: 0;
                }

                nav .user-section {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }
            }

            @media (max-width: 1199px) and (min-width: 768px) {
                nav {
                    width: 250px;
                }

                nav .user-section {
                    width: 250px;
                }

                nav .logo-container p {
                    font-size: 2rem;
                }

                nav ul li a {
                    font-size: 0.9rem;
                    padding: 10px 12px;
                }
            }

        </style>
        <button class="menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <div class="nav-overlay"></div>
        <nav>
            <div class="logo-container">
                <a href="/App/Client/Panel/FrontEnd/index.html">
                    <img src="/App/Recursos/logo.svg" alt="Logo de la empresa" class="logo" />
                    <p>Los 3<br>Tanos</p>
                </a>
            </div>
            <hr>
            <ul>
                ${menuHTML}
            </ul>

            <div class="user-section">
                <div class="user-avatar">
                    <div class="user-icon">
                    </div>
                </div>
                <div class="user-info">
                    <div id="userName" class="user-name">Cargando...</div>
                    <div id="userRol" class="user-role">Verificando sesión...</div>
                </div>
                <button class="logout-btn" onclick="logout()">
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
                </button>
            </div>  
        </nav>
        `;
            
            this.init();
            
        } catch (error) {
            window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
        }
    }
        init() {
            setTimeout(() => {
                this.updateActiveLink();
                this.addEventListeners();
                this.setupMobileMenu();
            }, 10);
        }

        setupMobileMenu() {
            const menuToggle = this.querySelector('.menu-toggle');
            const nav = this.querySelector('nav');
            const overlay = this.querySelector('.nav-overlay');
            const navLinks = this.querySelectorAll('.nav-link');

            if (!menuToggle || !nav || !overlay) {
                return;
            }

            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                nav.classList.toggle('active');
                overlay.classList.toggle('active');
                document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
            });

            overlay.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 767) {
                        menuToggle.classList.remove('active');
                        nav.classList.remove('active');
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 767) {
                    menuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        updateActiveLink() {
            const currentPath = window.location.pathname;
            const activePage = this.getCurrentPage(currentPath);
            const navLinks = this.querySelectorAll('.nav-link');

            navLinks.forEach(link => link.classList.remove('active-link'));

            navLinks.forEach(link => {
                if (link.getAttribute('data-page') === activePage) {
                    link.classList.add('active-link');
                }
            });
        }

        getCurrentPage(path) {
            const normalizedPath = path.toLowerCase();

            if (normalizedPath.includes('gerente/informes') || normalizedPath.includes('estadisticas')) return 'estadisticas';
            if (normalizedPath.includes('ventas/pedidos/mozo') || normalizedPath.includes('pedidos')) return 'pedidos';
            if (normalizedPath.includes('ventas/reservas') || normalizedPath.includes('reservas')) return 'reservas';
            if (normalizedPath.includes('ventas/promociones') || normalizedPath.includes('promociones')) return 'promociones';
            if (normalizedPath.includes('ventas/pedidos/cocina') || normalizedPath.includes('cocina')) return 'cocina';
            if (normalizedPath.includes('stock') || normalizedPath.includes('inventario')) return 'inventario';
            if (normalizedPath.includes('mesas')) return 'mesas';
            if (normalizedPath.includes('ventas/productos') || normalizedPath.includes('productos') || normalizedPath.includes('platillos')) return 'productos';
            if (normalizedPath.includes('gerente/usuarios') || normalizedPath.includes('usuarios')) return 'usuarios';
            if (normalizedPath.includes('gerente/empresa') || normalizedPath.includes('empresa')) return 'empresa';
        }

        addEventListeners() {
            const navLinks = this.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(() => this.updateActiveLink(), 100);
                });
            });
        }

        setActiveLink(linkName) {
            const navLinks = this.querySelectorAll('.nav-link');

            navLinks.forEach(link => {
                const linkText = link.textContent.trim();
                link.classList.toggle('active', linkText === linkName);
            });
        }

        getActiveLink() {
            const activeLink = this.querySelector('.nav-link.active');
            return activeLink ? activeLink.textContent.trim() : '';
        }
    }

customElements.define('nav-admin', NavAdmin);

function logout() {
    fetch('/App/Control/Panel/BackEnd/logout.php', {
        method: 'POST',
        credentials: 'same-origin'
    }).then(() => {
        window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
    }).catch(error => {
        window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
    });
}
