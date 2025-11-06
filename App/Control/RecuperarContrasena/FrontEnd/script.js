document.addEventListener('DOMContentLoaded', function () {
    const recuperarForm = document.getElementById('recuperarForm');
    const resetForm = document.getElementById('resetForm');

    if (recuperarForm) {
        initRecuperarForm();
    } else if (resetForm) {
        initResetForm();
    }
});

function initRecuperarForm() {
    const form = document.getElementById('recuperarForm');
    const emailInput = document.getElementById('email');
    const mensajes = document.getElementById('mensajes');

    form.addEventListener('submit', handleSubmit);
    emailInput.addEventListener('input', clearMessages);
    emailInput.addEventListener('blur', validateEmail);
}

function initResetForm() {
    const form = document.getElementById('resetForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const mensajes = document.getElementById('mensajes');

    validateTokenOnLoad();

    form.addEventListener('submit', handleResetSubmit);

    newPasswordInput.addEventListener('input', validatePasswordStrength);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    newPasswordInput.addEventListener('input', clearMessages);
    confirmPasswordInput.addEventListener('input', clearMessages);
}

async function handleSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();

    if (!validateEmailFormat(email)) {
        showMessage('Por favor, ingresa un email válido', 'error');
        return;
    }

    await solicitarRecuperacion(email);
}

async function solicitarRecuperacion(email) {
    try {
        setLoadingState(true);
        showMessage('Procesando solicitud...', 'info');

        const requestData = {
            email: email
        };

        const response = await fetch('../BackEnd/solicitar-recuperacion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (data.exito) {
            showMessage(data.mensaje || 'Recibirás un enlace de recuperación pronto.', 'info');

            document.getElementById('email').value = '';
            showMessage('Correo enviado correctamente.', 'success');

        } else {
            showMessage(data.mensaje || 'Ocurrió un error al procesar tu solicitud. Inténtalo nuevamente.', 'error');
        }

    } catch (error) {
        console.error('Error en solicitud de recuperación:', error);

        showMessage('Error de conexión. Verifica tu conexión a internet e inténtalo nuevamente.', 'error');

    } finally {
        setLoadingState(false);
    }
}

function validateEmail(event) {
    const email = event.target.value.trim();

    if (email && !validateEmailFormat(email)) {
        showMessage('El formato del email no es válido', 'error');
        return false;
    }

    if (email && validateEmailFormat(email)) {
        clearMessages();
        return true;
    }

    return true;
}

function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(mensaje, tipo = 'info') {
    const mensajesElement = document.getElementById('mensajes');

    mensajesElement.className = 'mensajes';

    if (tipo === 'success') {
        mensajesElement.classList.add('success');
    } else if (tipo === 'error') {
        mensajesElement.classList.add('error');
    } else if (tipo === 'info') {
        mensajesElement.classList.add('info');
    }

    mensajesElement.textContent = mensaje;

    if (tipo === 'error') {
        setTimeout(() => {
            clearMessages();
        }, 5000);
    }
}

function clearMessages() {
    const mensajesElement = document.getElementById('mensajes');
    mensajesElement.textContent = '';
    mensajesElement.className = 'mensajes';
}

function setLoadingState(loading) {
    const boton = document.getElementById('botonRecuperar');
    const btnText = boton.querySelector('.btn-text');
    const btnLoading = boton.querySelector('.btn-loading');

    if (loading) {
        boton.disabled = true;
        boton.classList.add('loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
    } else {
        boton.disabled = false;
        boton.classList.remove('loading');
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

async function validateTokenOnLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showMessage('Enlace inválido. No se encontró el token de recuperación.', 'error');
        disableResetForm();
        return;
    }

    try {
        showMessage('Validando enlace de recuperación...', 'info');

        const response = await fetch(`../BackEnd/validar-token.php?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.exito) {
            showMessage('Enlace válido. Puedes establecer tu nueva contraseña.', 'success');
        } else {
            showMessage(data.mensaje || 'El enlace de recuperación es inválido o ha expirado.', 'error');
            disableResetForm();
        }

    } catch (error) {
        console.error('Error validando token:', error);
        showMessage('Error al validar el enlace. Verifica tu conexión e inténtalo nuevamente.', 'error');
        disableResetForm();
    }
}

async function handleResetSubmit(event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!validatePasswordStrength(null, newPassword)) {
        return;
    }

    if (!validatePasswordMatch(null, confirmPassword)) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showMessage('Error: Token no encontrado en la URL.', 'error');
        return;
    }

    await restablecerContrasena(token, newPassword, confirmPassword);
}

async function restablecerContrasena(token, newPassword, confirmPassword) {
    try {
        setResetLoadingState(true);
        showMessage('Restableciendo contraseña...', 'info');

        const requestData = {
            token: token,
            nueva_contrasena: newPassword,
            confirmar_contrasena: confirmPassword
        };

        const response = await fetch('../BackEnd/restablecer-contrasena.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.exito) {
            showMessage(data.mensaje || 'Contraseña restablecida exitosamente.', 'success');

            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';

            setTimeout(() => {
                showMessage('Redirigiendo al inicio de sesión...', 'info');
                setTimeout(() => {
                    window.location.href = '/App/Control/SignIn/FrontEnd/index.html';
                }, 2000);
            }, 3000);

        } else {
            showMessage(data.mensaje || 'Error al restablecer la contraseña. Inténtalo nuevamente.', 'error');
        }

    } catch (error) {
        console.error('Error en restablecimiento de contraseña:', error);

        showMessage('Error de conexión. Verifica tu conexión a internet e inténtalo nuevamente.', 'error');

    } finally {
        setResetLoadingState(false);
    }
}

function validatePasswordStrength(event, password = null) {
    const passwordValue = password || (event ? event.target.value : document.getElementById('newPassword').value);

    if (!passwordValue) {
        return true;
    }

    const minLength = 8;
    const hasLetters = /[a-zA-Z]/.test(passwordValue);
    const hasNumbers = /\d/.test(passwordValue);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);

    if (passwordValue.length < minLength) {
        if (event) showMessage(`La contraseña debe tener al menos ${minLength} caracteres.`, 'error');
        return false;
    }

    if (!hasLetters) {
        if (event) showMessage('La contraseña debe contener al menos una letra.', 'error');
        return false;
    }

    if (!hasNumbers) {
        if (event) showMessage('La contraseña debe contener al menos un número.', 'error');
        return false;
    }

    if (!hasSpecialChars) {
        if (event) showMessage('La contraseña debe contener al menos un carácter especial (!@#$%^&*()_+-=[]{}|;:,.<>?).', 'error');
        return false;
    }

    if (event) {
        clearMessages();
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (confirmPassword) {
            validatePasswordMatch(null, confirmPassword);
        }
    }

    return true;
}

function validatePasswordMatch(event, confirmPassword = null) {
    const newPassword = document.getElementById('newPassword').value;
    const confirmValue = confirmPassword || (event ? event.target.value : document.getElementById('confirmPassword').value);

    if (!confirmValue || !newPassword) {
        return true;
    }

    if (newPassword !== confirmValue) {
        if (event) showMessage('Las contraseñas no coinciden.', 'error');
        return false;
    }

    if (event) clearMessages();
    return true;
}

function disableResetForm() {
    const form = document.getElementById('resetForm');
    const inputs = form.querySelectorAll('input, button');

    inputs.forEach(input => {
        input.disabled = true;
    });
}

function setResetLoadingState(loading) {
    const boton = document.getElementById('resetBtn');

    if (loading) {
        boton.disabled = true;
        boton.classList.add('loading');
        boton.textContent = 'Restableciendo...';
    } else {
        boton.disabled = false;
        boton.classList.remove('loading');
        boton.textContent = 'Restablecer contraseña';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.hidePass-icon');
    const eyeOpen = button.querySelector('.eye-open');
    const eyeClosed = button.querySelector('.eye-closed');

    if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
    } else {
        input.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
    }
}

function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('[Recuperar Contraseña]', message, data);
    }
}