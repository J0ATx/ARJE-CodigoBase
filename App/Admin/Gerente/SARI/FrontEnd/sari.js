import { getDocument, GlobalWorkerOptions } from '../../../../Control/Librerias/pdfjs/build/pdf.mjs';

GlobalWorkerOptions.workerSrc = '../../../../Control/Librerias/pdfjs/build/pdf.worker.mjs';

const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');
const loadingDiv = document.getElementById('loading');
const sendBtn = document.getElementById('sendBtn');
const pdfStatus = document.getElementById('pdfStatus');

const openPdfModalBtn = document.getElementById('openPdfModal');
const pdfModal = document.getElementById('pdfModal');
const closePdfModalBtn = document.getElementById('closePdfModal');
const extractPdfBtn = document.getElementById('extractPdfBtn');
const useContextBtn = document.getElementById('useContextBtn');
const clearContextBtn = document.getElementById('clearContextBtn');
const pdfFileInput = document.getElementById('pdf-file-input');
const pdfOutput = document.getElementById('output');

let isGeneratingResponse = false;
let pdfContextText = '';

const conversationHistory = [
  {
    role: 'assistant',
    content:
      'Hola, soy SARI (Sistema Asistente de Recomendaciones Internas). ¿En qué puedo ayudarte? Puedes adjuntar un PDF para que lo use como contexto de la conversación. Por defecto, utilizaré la información vista en la sección de estadísticas.'
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
    if (line.startsWith('### ')) processedLine = '<h3>' + processedLine.substring(4) + '</h3>';
    else if (line.startsWith('## ')) processedLine = '<h2>' + processedLine.substring(3) + '</h2>';
    else if (line.startsWith('# ')) processedLine = '<h1>' + processedLine.substring(2) + '</h1>';
    else if (line.trim().startsWith('* ')) processedLine = '<li>' + processedLine.trim().substring(2) + '</li>';
    else if (line.trim() !== '') processedLine = processedLine || line;
    html += processedLine + '\n';
  }
  html = html.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
  if (!/^<[hlu]/.test(html.trim())) html = '<p>' + html + '</p>';
  return html;
}

async function typeWriter(element, text, speed = 30) {
  element.classList.add('typewriter', 'typing');
  element.innerHTML = '';
  const chunks = [];
  let currentChunk = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    currentChunk += char;
    if (char === ' ' || char === '\n' || i === text.length - 1) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  let displayText = '';
  for (const chunk of chunks) {
    displayText += chunk;
    element.innerHTML = markdownToHtml(displayText);
    await new Promise((resolve) => setTimeout(resolve, speed));
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
  sendBtn.disabled = isLoading;
  loadingDiv.style.visibility = isLoading ? 'visible' : 'hidden';
}

async function sendQuery() {
  const query = userInput.value.trim();
  if (!query || isGeneratingResponse) return;
  conversationHistory.push({ role: 'user', content: query });
  await addMessage(query, true);
  userInput.value = '';
  setLoadingState(true);
  try {
    const response = await fetch('../BackEnd/api_rag.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory, context: pdfContextText })
    });
    const result = await response.json();
    if (result.error) {
      await addMessage(`Lo siento, ocurrió un error: ${result.error}`);
      conversationHistory.pop();
    } else {
      const answer = result.response;
      conversationHistory.push({ role: 'assistant', content: answer });
      await addMessage(answer);
    }
  } catch (error) {
    await addMessage('Lo siento, error de conexión con el servidor.');
    conversationHistory.pop();
  } finally {
    setLoadingState(false);
    userInput.focus();
  }
}

async function getFullText(pdfDocument) {
  let fullText = '';
  const numPages = pdfDocument.numPages;
  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    fullText += '\n\n--- INICIO PÁGINA ' + i + ' ---\n\n' + pageText;
  }
  return fullText;
}

async function extractText() {
  const file = pdfFileInput.files[0];
  pdfOutput.textContent = '';
  if (!file) {
    pdfOutput.textContent = 'Selecciona un archivo PDF.';
    return;
  }
  pdfOutput.textContent = 'Cargando y extrayendo texto...';
  const reader = new FileReader();
  reader.onload = async function (event) {
    const arrayBuffer = event.target.result;
    try {
      const pdfDocument = await getDocument({ data: arrayBuffer }).promise;
      const fullText = await getFullText(pdfDocument);
      pdfOutput.textContent = fullText;
    } catch (error) {
      pdfOutput.textContent = 'Error al procesar el PDF.';
    }
  };
  reader.readAsArrayBuffer(file);
}

function openPdfModal() {
  pdfModal.style.display = 'flex';
}
function closePdfModal() {
  pdfModal.style.display = 'none';
}

function updatePdfStatus() {
  if (pdfContextText && pdfContextText.trim().length > 0) {
    pdfStatus.textContent = 'PDF cargado';
    pdfStatus.classList.add('active');
  } else {
    pdfStatus.textContent = 'Sin PDF';
    pdfStatus.classList.remove('active');
  }
}

sendBtn.addEventListener('click', sendQuery);
userInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendQuery();
  }
});

openPdfModalBtn.addEventListener('click', openPdfModal);
closePdfModalBtn.addEventListener('click', closePdfModal);
extractPdfBtn.addEventListener('click', extractText);
useContextBtn.addEventListener('click', function () {
  pdfContextText = pdfOutput.textContent || '';
  updatePdfStatus();
  closePdfModal();
});
clearContextBtn.addEventListener('click', function () {
  pdfContextText = '';
  pdfOutput.textContent = '';
  updatePdfStatus();
});

// Inicializar conversación con primer mensaje
addMessage(conversationHistory[0].content, false);