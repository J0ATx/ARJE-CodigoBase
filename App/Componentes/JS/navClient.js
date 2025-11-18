

class NavClient extends HTMLElement {
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
                height: 100%;
                background-color: #1F1F1F;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                position: relative;
                z-index: 1;
                border-right: 1px solid #efe7d217;
            }

            nav .logo {
                width: 75px;
                filter: drop-shadow(0 0 1px black);
            }

            nav .logo-container {
                position: relative;
                display: flex;
                height: 200px;
                align-items: center;
                justify-content: column;
                flex-direction: column;
                padding-top: 16px;
                padding-bottom: 16px;
                margin-bottom: 4px;
                margin-top: 4px;
                background-color: #191919;
                border-bottom: 1px solid #000000;
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
                color: #A4A4A4;
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
                color: #A4A4A4;
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
                color: #A4A4A4;
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


            nav .delete-accions {
                position:fixed;
                bottom: 0;
            }

            nav .user-avatar {
                width: 96px;
                height: 96px;
                border-radius: 50%;
                background-color: #0A0B0A;
                margin-top:16px;
                margin-bottom: 8px;
            }

            nav .user-info {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            .user-icon img{
                border-radius: 100%;
                border: 1px solid #767676c0;
                width: 96px;
                height: 96px;
                margin: 0;
                display: block;
                z-index: 999;
                aspect-ratio: 1/1;
                object-fit: cover;
            }

            nav .user-name {
                font-size: 1.5rem;
                font-weight: 600;
                color: #A4A4A4;
                margin-bottom: 3px;
                font-family: 'Poppins', sans-serif;
                line-height: 1.2;
                word-wrap: break-word;
                overflow-wrap: break-word;
                white-space: nowrap;
                text-overflow: ellipsis;
                max-width: 220px;
                overflow:hidden;
            }

            nav .user-role {
                font-size: 1rem;
                color: #7B7B7B;
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
                background-color: #303030;
            }
            .back-btn {
                position: absolute;
                top: 16px;
                left: 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: #EFE7D2;
                text-decoration: none;
                background: #ffffff14;
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(8px);
                box-shadow: 0 0 1px #fff;
                z-index: 200;
            }

            .back-btn:hover {
                background: #ffffff2d;
            }

            .back-btn svg {
                pointer-events: none;
            }
            @media (max-width: 767px) {
                .menu-toggle {
                    display: block !important;
                }
                .page {
                    grid-template-columns: 1fr;
                    grid-template-areas: "main";
                    position: relative;
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
                <a href="/Panel" class="back-btn" aria-label="Volver al panel">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
                <div class="user-avatar">
                    <div class="user-icon">
                    </div>
                </div>
                <div class="user-info">
                    <div id="userName" class="user-name">Cargando...</div>
                    <div id="userRol" class="user-role">Verificando sesión...</div>
                </div>
            </div>
            <ul>
            <li><a href="/MiUsuario" class="nav-link" data-page="miusuario"><img src="/App/Componentes/svg/InformacionCliente.svg" alt="Información">Información</a></li>
            <li><a href="/MisPedidos" class="nav-link" data-page="mispedidos"><img src="/App/Componentes/svg/PedidosCliente.svg" alt="Información">Mis pedidos</a></li>
            <li><a href="/MisReservas" class="nav-link" data-page="misreservas"><img src="/App/Componentes/svg/ReservasCliente.svg" alt="Información">Mis reservas</a></li>
            <li><a href="/Fidelizacion" class="nav-link" data-page="fidelizacion"><img src="/App/Componentes/svg/FidelizadoCliente.svg" alt="Información">Fidelizacion</a></li>
            
            <div class="delete-accions">
                <li class="nav-link" onclick="logout()"><a href="#"><img src="/App/Componentes/svg/LogoutCliente.svg" alt="Cerrar sesión">Cerrar sesión</a></li>
                <li class="nav-link" onclick="deleteAccount()"><a href="#"><img src="/App/Componentes/svg/EliminarCliente.svg" alt="Cerrar sesión">Eliminar cuenta</a></li>
            </div>
            </ul>
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

        if (normalizedPath.includes('miusuario')) return 'miusuario';
        if (normalizedPath.includes('mispedidos')) return 'mispedidos';
        if (normalizedPath.includes('misreservas')) return 'misreservas';
        if (normalizedPath.includes('fidelizacion')) return 'fidelizacion';
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

customElements.define('nav-client', NavClient);

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
