const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);
const entrar = $('#boton');
entrar.addEventListener('click', function (e) {
    e.preventDefault();
    const nom = nombre.value;
    const mail = email.value;
    const telef = telefono.value;
    const contra = passInput.value;
    formulario = new FormData();
    formulario.append('nombre', nom)
    formulario.append('email', mail)
    formulario.append('telefono', telef)
    formulario.append('contrasenia', contra)
    fetch('../BackEnd/register.php', {
        method: 'POST',
        body: formulario
    }).then(res => res.json())
        .then(data => {
            //location.href="Login.html";
            if (data.errores) {
                alert(data.errores);
            }
            if(data.exito){
                location.href="../../SignIn/FrontEnd/index.html";
            }
        })
})