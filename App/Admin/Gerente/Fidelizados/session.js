function logout() {
    fetch('/App/Control/Panel/BackEnd/logout.php', {
        method: 'POST',
        credentials: 'same-origin'
    }).then(() => {
        window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
    }).catch(() => {
        window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
    });
}

async function checkSession() {
    try {
        const response = await fetch('/App/Control/Session/checkSession.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();
        if (!data.logged_in) {
            window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
            return false;
        } else {
            const userNameElements = document.querySelectorAll('#userName');
            const userRolElements = document.querySelectorAll('#userRol');
            const userIcon = document.querySelector('.user-icon');
            const fullName = `${data.user.nombre} ${data.user.apellido}`;
            userNameElements.forEach(element => { if (element) { element.textContent = fullName; } });
            userRolElements.forEach(element => { if (element) { element.textContent = data.user.rol; } });
            const resposnseAvatar = await fetch('/App/Control/Session/avatar.php', { method: 'GET', credentials: 'same-origin' });
            const avatar = await resposnseAvatar.json();
            if(userIcon){ userIcon.innerHTML += `<img src="/App/Recursos/avatars/${avatar.avatar}" id="avatar" class="logged" alt="Foto de perfíl">`; }
            return true;
        }
    } catch (error) {
        window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
        return false;
    }
}