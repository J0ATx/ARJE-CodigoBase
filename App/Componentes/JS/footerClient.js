class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        fetch('/App/Client/Informacion/BackEnd/informacion.php', {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {
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
    font-size: clamp(0.5rem, 0rem + 2vw, 1rem);
    line-height: 1.5;
    text-wrap: pretty;
    text-align: center;
}
footer a {
    color: #EFE7D2;
    font-family: 'Poppins', sans-serif;
    text-decoration: underline;
    text-align: center;
}
footer p{
    max-width: 20vw;
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
                <a href="/Informacion">${data.info.empresa_nombre}</a>
                <a href="/Contacto">Contacto</a>
                <p>${data.info.empresa_ciudad}, ${data.info.empresa_calle}</p>
            </footer>
    `;
            });
    }
}

customElements.define('client-footer', Footer);
