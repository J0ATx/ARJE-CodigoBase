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
            if (data.errores) {
                $('.mensajes').textContent = data.errores;
            }
            if(data.exito){
                window.location.href = "../../../Client/Panel/FrontEnd/index.html";
            }
        });
});