const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Banco de dados
const db = new sqlite3.Database('./data/nexora.db', (err) => {
  if (err) console.error('Erro ao conectar BD:', err);
  else console.log('✅ Conectado ao banco de dados');
});

// Criar tabelas se não existirem
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_message TEXT,
    bot_response TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    language TEXT DEFAULT 'pt'
  )`);
});

// Respostas do chatbot
const responses = {
  pt: {
    greetings: ['oi', 'olá', 'hey', 'opa', 'e aí'],
    farewell: ['tchau', 'até logo', 'adeus', 'falou'],
    help: ['ajuda', 'help', 'socorro', 'me ajuda'],
    thanks: ['obrigado', 'valeu', 'thanks', 'brigadão']
  },
  en: {
    greetings: ['hi', 'hello', 'hey', 'greetings'],
    farewell: ['bye', 'goodbye', 'see you', 'farewell'],
    help: ['help', 'assist', 'support'],
    thanks: ['thanks', 'thank you', 'appreciate']
  }
};

const botReplies = {
  pt: {
    greeting: 'Olá! 👋 Eu sou o Nexora AI. Como posso ajudá-lo?',
    farewell: 'Até logo! 👋 Volte sempre!',
    help: 'Estou aqui para ajudar! 🤖 Você pode me fazer perguntas sobre diversos tópicos.',
    thanks: 'De nada! 😊 Fico feliz em ajudar!',
    default: 'Entendi! Você disse: ',
    error: 'Desculpe, tive um problema. Tente novamente!'
  },
  en: {
    greeting: 'Hello! 👋 I\'m Nexora AI. How can I help you?',
    farewell: 'Goodbye! 👋 See you soon!',
    help: 'I\'m here to help! 🤖 You can ask me questions about various topics.',
    thanks: 'You\'re welcome! 😊 Happy to help!',
    default: 'I understood! You said: ',
    error: 'Sorry, I had an issue. Try again!'
  }
};

// Função para detectar idioma
function detectLanguage(message) {
  const ptPatterns = /[áàâãéèêíìîóòôõöúùûü]/i;
  return ptPatterns.test(message) ? 'pt' : 'en';
}

// Função para gerar resposta
function generateResponse(message, language = 'pt') {
  const msg = message.toLowerCase().trim();
  const reply = botReplies[language];
  const resp = responses[language];
  
  if (resp.greetings.some(g => msg.includes(g))) return reply.greeting;
  if (resp.farewell.some(f => msg.includes(f))) return reply.farewell;
  if (resp.help.some(h => msg.includes(h))) return reply.help;
  if (resp.thanks.some(t => msg.includes(t))) return reply.thanks;
  
  return reply.default + message;
}

// Rotas
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Mensagem vazia!' });
  }
  
  try {
    const language = detectLanguage(message);
    const botResponse = generateResponse(message, language);
    
    // Salvar no banco
    db.run(
      'INSERT INTO conversations (user_message, bot_response, language) VALUES (?, ?, ?)',
      [message, botResponse, language],
      (err) => {
        if (err) console.error('Erro ao salvar:', err);
      }
    );
    
    res.json({ response: botResponse, language });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Obter histórico
app.get('/api/history', (req, res) => {
  db.all('SELECT * FROM conversations ORDER BY timestamp DESC LIMIT 50', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
    res.json(rows);
  });
});

// Limpar histórico
app.delete('/api/history', (req, res) => {
  db.run('DELETE FROM conversations', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao limpar histórico' });
    }
    res.json({ message: 'Histórico limpo!' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
