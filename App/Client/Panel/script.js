const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');
const loadingDiv = document.getElementById('loading');
const chatForm = document.getElementById('chatForm') || document.querySelector('form');
let isGeneratingResponse = false;

let conversationHistory = [
    {
        role: 'assistant',
        content: '¡Hola! Soy Maitre, el asistente virtual de Los 3 Tanos. Estoy aquí para ayudarte con cualquier consulta sobre nuestro restaurante, menú, reservas o servicios. ¿En qué puedo ayudarte hoy?'
    }
];

function markdownToHtml(text) {
    let html = '';
    let inCodeBlock = false;
    
    const lines = text.split('\n');
    
    for (let line of lines) {
        if (line.trim() === '```') {
            inCodeBlock = !inCodeBlock;
            html += inCodeBlock ? '<pre><code>' : '</code></pre>';
            continue;
        }
        
        if (inCodeBlock) {
            html += line + '\n';
            continue;
        }
        
        let processedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
            
        if (line.startsWith('### ')) {
            processedLine = '<h3>' + processedLine.substring(4) + '</h3>';
        } else if (line.startsWith('## ')) {
            processedLine = '<h2>' + processedLine.substring(3) + '</h2>';
        } else if (line.startsWith('# ')) {
            processedLine = '<h1>' + processedLine.substring(2) + '</h1>';
        } else if (line.trim().startsWith('* ')) {
            processedLine = '<li>' + processedLine.trim().substring(2) + '</li>';
        } else if (line.trim() !== '') {
            processedLine = processedLine || line;
        }
        
        html += processedLine + '\n';
    }
    
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    if (!/^<[hlu]/.test(html.trim())) {
        html = '<p>' + html + '</p>';
    }
    
    return html;
}

async function typeWriter(element, text, speed = 30) {
    element.classList.add('typewriter', 'typing');
    element.innerHTML = '';
    
    const chunks = [];
    let currentChunk = '';
    let inMarkdown = false;
    let markdownBuffer = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        currentChunk += char;
        
        if (char === ' ' || char === '\n' || i === text.length - 1) {
            if (inMarkdown) {
                markdownBuffer += currentChunk;
                if ((text[i-1] === '*' && text[i-2] === '*') || 
                    (text[i-1] === '`' && markdownBuffer.includes('`'))) {
                    inMarkdown = false;
                    chunks.push(markdownBuffer);
                    markdownBuffer = '';
                }
            } else if (currentChunk.includes('**') || currentChunk.includes('`')) {
                inMarkdown = true;
                markdownBuffer = currentChunk;
            } else {
                chunks.push(currentChunk);
            }
            currentChunk = '';
        }
    }
    
    if (markdownBuffer) chunks.push(markdownBuffer);
    if (currentChunk) chunks.push(currentChunk);
    
    let displayText = '';
    
    for (const chunk of chunks) {
        displayText += chunk;
        element.innerHTML = markdownToHtml(displayText);
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    element.classList.remove('typing');
}


async function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    chatMessages.appendChild(messageDiv);
    
    if (isUser) {
        messageDiv.textContent = message;
    } else {
        const textSpan = document.createElement('div');
        textSpan.className = 'typewriter';
        messageDiv.appendChild(textSpan);
        
        await typeWriter(textSpan, message);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setLoadingState(isLoading) {
    isGeneratingResponse = isLoading;
    userInput.disabled = isLoading;
    document.querySelector('.chatbot-send').disabled = isLoading;
    loadingDiv.style.display = isLoading ? 'block' : 'none';
}

async function sendQuery() {
    const query = userInput.value.trim();
    if (!query || isGeneratingResponse) return;

    addMessage(query, true);
    userInput.value = '';
    
    conversationHistory.push({ role: 'user', content: query });
    
    setLoadingState(true);

    const dataToSend = { messages: conversationHistory };

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
            await addMessage(`Lo siento, ha ocurrido un error: ${result.error}`);
            conversationHistory.pop();
        } else {
            conversationHistory.push({ role: 'assistant', content: result.response });
            await addMessage(result.response);
        }

    } catch (error) {
        console.error('Error de red o del servidor:', error);
        await addMessage('Lo siento, ha ocurrido un error de conexión con el servidor.');
        conversationHistory.pop();
    } finally {
        setLoadingState(false);
        userInput.focus();
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

if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendQuery();
    });
}

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendQuery();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeChatbot();
    }
})