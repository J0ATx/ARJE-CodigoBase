const userInput = document.getElementById('userInput');
const respuestaDiv = document.getElementById('respuesta');
const loadingDiv = document.getElementById('loading');

async function sendQuery() {
    const query = userInput.value.trim();
    if (!query) return;

    const extractedText = document.getElementById('output').textContent;
    loadingDiv.style.display = 'block';
    respuestaDiv.innerText = '';
    const dataToSend = { 
        query: query,
        context: extractedText
    };

    try {
        const response = await fetch('../Backend/api_rag.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        const result = await response.json();

        if (result.error) {
            respuestaDiv.innerText = `ERROR: ${result.error}`;
        } else {
            respuestaDiv.innerText = result.response;
        }

    } catch (error) {
        console.error('Error de red o del servidor:', error);
        respuestaDiv.innerText = 'Error de conexión con el servidor PHP.';
    } finally {
        loadingDiv.style.display = 'none';
    }
}