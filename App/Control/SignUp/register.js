const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);
const boton = $('#boton');
const form = $('form');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nom = $('#nombre').value;
    const ape = $('#apellido').value;
    const mail = $('#email').value;
    const contra = $('#passInput').value;
    
    const formulario = new FormData();
    formulario.append('nombre', nom);
    formulario.append('apellido', ape);
    formulario.append('email', mail);
    formulario.append('contrasenia', contra);

    fetch('../BackEnd/register.php', {
        method: 'POST',
        body: formulario
    }).then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.errores) {
                alert(data.errores);
                console.log(data.errores);
            }
            if(data.exito){
                window.location.href = "../../SignIn/FrontEnd/index.html";
            }
        });
});