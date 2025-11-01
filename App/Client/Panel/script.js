const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');
const loadingDiv = document.getElementById('loading');

// Función para añadir un mensaje al chat
async function typeWriter(element, text, speed = 30) {
    let i = 0;
    element.classList.add('typewriter', 'typing');
    return new Promise(resolve => {
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
                resolve();
            }
        }
        type();
    });
}

async function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    chatMessages.appendChild(messageDiv);
    
    if (isUser) {
        messageDiv.textContent = message;
    } else {
        const textSpan = document.createElement('span');
        textSpan.className = 'typewriter';
        messageDiv.appendChild(textSpan);
        await typeWriter(textSpan, message);
    }
    
    // Hacer scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendQuery() {
    const query = userInput.value.trim();
    if (!query) return;

    // Añadir el mensaje del usuario al chat
    addMessage(query, true);

    // Limpiar el input
    userInput.value = '';

    // Mostrar indicador de carga
    loadingDiv.style.display = 'block';

    const dataToSend = { query: query };

    try {
        // Llamar al archivo PHP en el servidor
        const response = await fetch('../Backend/api_rag.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
        const result = await response.json();
        
        if (result.error) {
            addMessage(`Lo siento, ha ocurrido un error: ${result.error}`);
        } else {
            addMessage(result.response);
        }

    } catch (error) {
        console.error('Error de red o del servidor:', error);
        addMessage('Lo siento, ha ocurrido un error de conexión con el servidor.');
    } finally {
        loadingDiv.style.display = 'none';
    }
}

function openChatbot() {
    const chatbotBg = document.querySelector('.chatbot-bg');
    chatbotBg.style.display = 'block';
    chatbotBg.style.opacity = '1';
}

function closeChatbot() {
    const chatbotBg = document.querySelector('.chatbot-bg');
    chatbotBg.style.display = 'none';
    chatbotBg.style.opacity = '0';
}

// Evento para enviar mensaje con Enter
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendQuery();
    }
});