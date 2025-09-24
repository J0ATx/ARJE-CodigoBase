const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);
const boton = $('#boton');
const form = $('form');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const mail = $('#email').value;
    const contrasenia = $('#passInput').value;
    
    const formulario = new FormData();
    formulario.append('email', mail);
    formulario.append('contrasenia', contrasenia);

    fetch('../BackEnd/login.php', {
        method: 'POST',
        body: formulario
    }).then(res => res.json())
        .then(data => {
            if(data.exito){
                window.location.href = '../../../Client/Panel/FrontEnd/index.html';
            }
            if(data.errores){
                $('.mensajes').textContent = data.errores;
            }
        });
});

boton.addEventListener('click', function(e) {
    form.dispatchEvent(new Event('submit'));
});