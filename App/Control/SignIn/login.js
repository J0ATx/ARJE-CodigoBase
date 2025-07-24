const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);
const entrar = $('#boton');
entrar.addEventListener('click', function (e) {
    e.preventDefault();
    const mail = email.value;
    const contrasenia = passInput.value;
    formulario = new FormData();
    formulario.append('email', mail)
    formulario.append('contrasenia', contrasenia)
    fetch('../BackEnd/login.php', {
        method: 'POST',
        body: formulario
    }).then(res => res.json())
        .then(data => {
            if(data.exito){
                // Redirigir al panel de admin si es gerente, sino al panel normal
                if (data.es_gerente) {
                    location.href = '../../../Admin/Panel/FrontEnd/index.html';
                } else {
                    location.href = '../../../Client/Panel/FrontEnd/index.html';
                }
            }
            console.log(data);
        })
})