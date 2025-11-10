// Función que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Obtener el código de error de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const errorCode = urlParams.get('code'); 

    // 2. Definir los mensajes personalizados (puedes volver a incluir emojis aquí si lo deseas)
    let title = "Error General del Sistema";
    let message = "Ha ocurrido un error inesperado y desconocido.";
    let browserTitle = "Error General"; // Título más corto para la pestaña

    if (errorCode) {
        switch (errorCode) {
            case '404':
                title = "404: Página No Encontrada";
                message = "Lo sentimos, la página o recurso que intentas acceder no existe. Verifica la URL.";
                browserTitle = "Error 404";
                break;
            case '403':
                title = "403: Acceso Prohibido";
                message = "No tienes permiso para acceder a este recurso. Se denegó el acceso por seguridad.";
                browserTitle = "Error 403";
                break;
            case '500':
                title = "500: Error Interno del Servidor";
                message = "Algo salió mal en el servidor. Estamos trabajando para solucionarlo. Por favor, inténtalo más tarde.";
                browserTitle = "Error 500";
                break;
            default:
                title = `${errorCode}: Problema del Servidor`;
                message = `Se produjo un error con el código de estado ${errorCode}.`;
                browserTitle = `Error ${errorCode}`;
                break;
        }
    }

    // 3. Inyectar el contenido dinámico en el HTML
    const titleElement = document.getElementById('error-title');
    const messageElement = document.getElementById('error-message');
    const codeElement = document.getElementById('error-code');

    if (titleElement) {
        titleElement.textContent = title;
    }
    if (messageElement) {
        messageElement.textContent = message;
    }
    if (codeElement) {
        codeElement.textContent = errorCode || 'N/A';
    }

    // Actualizar el título de la pestaña del navegador
    document.title = browserTitle;
});