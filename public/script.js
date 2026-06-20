let currentLanguage = localStorage.getItem('language') || 'pt';
let isDarkMode = localStorage.getItem('theme') !== 'light';

const translations = {
  pt: {
    placeholder: 'Digite sua mensagem aqui...',
    clearBtn: '🗑️',
    themeBtn: '🌙',
    langBtn: 'EN',
    welcome: 'Bem-vindo ao Nexora AI! 👋',
    welcomeSub: 'Digite uma mensagem para começar a conversa',
    typing: 'Nexora está digitando...',
    error: 'Erro ao enviar mensagem. Tente novamente!',
    confirmClear: 'Tem certeza que deseja limpar o histórico?'
  },
  en: {
    placeholder: 'Type your message here...',
    clearBtn: '🗑️',
    themeBtn: '🌙',
    langBtn: 'PT',
    welcome: 'Welcome to Nexora AI! 👋',
    welcomeSub: 'Type a message to start the conversation',
    typing: 'Nexora is typing...',
    error: 'Error sending message. Try again!',
    confirmClear: 'Are you sure you want to clear the history?'
  }
};

// Inicializar
window.addEventListener('load', () => {
  applyTheme();
  updateUI();
  loadHistory();
});

// Enviar mensagem
async function sendMessage() {
  const input = document.getElementById('msgInput');
  const message = input.value.trim();

  if (!message) return;

  // Adicionar mensagem do usuário
  addMessage(message, 'user');
  input.value = '';
  input.focus();

  try {
    // Mostrar digitando
    addMessage(translations[currentLanguage].typing, 'bot', true);

    // Enviar para o servidor
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error('Erro na resposta');

    const data = await response.json();
    
    // Remover mensagem de digitação
    removeLastMessage();
    
    // Adicionar resposta do bot
    addMessage(data.response, 'bot');
  } catch (error) {
    console.error('Erro:', error);
    removeLastMessage();
    addMessage(translations[currentLanguage].error, 'bot');
  }
}

// Adicionar mensagem ao chat
function addMessage(text, sender, isTyping = false) {
  const chatBox = document.getElementById('chatBox');
  
  // Remover mensagem de boas-vindas
  const welcome = chatBox.querySelector('.welcome-message');
  if (welcome) welcome.remove();

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
  
  if (isTyping) messageDiv.classList.add('typing');
  
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Remover última mensagem
function removeLastMessage() {
  const chatBox = document.getElementById('chatBox');
  const messages = chatBox.querySelectorAll('.message');
  if (messages.length > 0) {
    messages[messages.length - 1].remove();
  }
}

// Carregar histórico
async function loadHistory() {
  try {
    const response = await fetch('/api/history');
    const data = await response.json();
    
    data.reverse().forEach(msg => {
      addMessage(msg.user_message, 'user');
      addMessage(msg.bot_response, 'bot');
    });
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
  }
}

// Limpar histórico
async function clearHistory() {
  if (!confirm(translations[currentLanguage].confirmClear)) return;
  
  try {
    await fetch('/api/history', { method: 'DELETE' });
    document.getElementById('chatBox').innerHTML = `
      <div class="welcome-message">
        <h2>${translations[currentLanguage].welcome}</h2>
        <p>${translations[currentLanguage].welcomeSub}</p>
      </div>
    `;
  } catch (error) {
    console.error('Erro ao limpar:', error);
  }
}

// Trocar idioma
function toggleLanguage() {
  currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
  localStorage.setItem('language', currentLanguage);
  updateUI();
}

// Trocar tema
function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  applyTheme();
}

// Aplicar tema
function applyTheme() {
  const body = document.body;
  const btn = document.getElementById('themeBtn');
  
  if (isDarkMode) {
    body.classList.remove('light-mode');
    btn.textContent = '🌙';
  } else {
    body.classList.add('light-mode');
    btn.textContent = '☀️';
  }
}

// Atualizar UI
function updateUI() {
  const t = translations[currentLanguage];
  document.getElementById('msgInput').placeholder = t.placeholder;
  document.getElementById('langBtn').textContent = t.langBtn;
  document.getElementById('themeBtn').textContent = isDarkMode ? '🌙' : '☀️';
}

// Escapar HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Enter para enviar
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
