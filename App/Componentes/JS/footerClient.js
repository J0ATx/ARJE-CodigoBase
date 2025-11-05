class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <style>
        footer {
    grid-area: footer;
    border-radius: 1vw;
    border: 0.1vw solid rgb(46, 45, 43);
    padding: 1vw;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    color: #EFE7D2;
    height: 100%;
    font-size: 1vw;
}
footer a {
    color: #EFE7D2;
    font-family: 'Poppins', sans-serif;
    text-decoration: underline;
    font-size: clamp(1rem, 1vw, 1.5rem);
}

footer p {
    font-size: clamp(1rem, 1vw, 1.5rem);
}
footer a:visited {
    color: #EFE7D2;
    font-family: 'Poppins', sans-serif;
    text-decoration: underline;
}

footer a:hover,
footer a:active {
    color: #BCB6A7;
    font-family: 'Poppins', sans-serif;
    text-decoration: underline;
}
        </style>
            <footer>
                <a href="/ARJE-CodigoBase/Informacion">Los 3 Tanos Pizzería</a>
                <a href="/ARJE-CodigoBase/Contacto">Contacto</a>
                <p>Las Toscas M. Ferreira y Central</p>
            </footer>
    `;
    }
}

customElements.define('client-footer', Footer);
