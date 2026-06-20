# 🤖 Nexora AI - Chat Inteligente

Um assistente de IA conversacional moderno e responsivo com suporte a múltiplos idiomas (PT-BR e EN) e temas claro/escuro.

## 📋 Características

✅ **Chat em Tempo Real** - Conversa instantânea com IA  
✅ **Múltiplos Idiomas** - Suporte a Português (PT-BR) e Inglês (EN)  
✅ **Temas** - Modo claro e escuro  
✅ **Histórico** - Salva todas as conversas no banco de dados  
✅ **Responsivo** - Funciona em desktop e mobile  
✅ **Design Moderno** - Interface limpa e intuitiva  
✅ **Backend Robusto** - Node.js + Express + SQLite  
✅ **API REST** - Endpoints bem estruturados  

## 🚀 Instalação

### Pré-requisitos
- Node.js (v14+)
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/gs12233hh-web/Nexora-AI.git
cd Nexora-AI
```

2. **Instale as dependências**
```bash
npm install
```

3. **Crie a pasta de dados**
```bash
mkdir data
```

4. **Inicie o servidor**
```bash
npm start
```

5. **Abra no navegador**
```
http://localhost:5000
```

## 🛠️ Desenvolvimento

Para rodar em modo desenvolvimento com auto-reload:

```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
Nexora-AI/
├── server.js           # Backend principal
├── package.json        # Dependências
├── public/
│   ├── index.html      # Interface HTML
│   ├── style.css       # Estilos
│   └── script.js       # Lógica frontend
├── data/               # Banco de dados SQLite
└── README.md           # Este arquivo
```

## 🔌 API Endpoints

### POST `/api/chat`
Envia uma mensagem e recebe resposta da IA

**Request:**
```json
{
  "message": "Olá, como você está?"
}
```

**Response:**
```json
{
  "response": "Olá! 👋 Eu sou o Nexora AI. Como posso ajudá-lo?",
  "language": "pt"
}
```

### GET `/api/history`
Obtém o histórico de conversas (últimas 50)

**Response:**
```json
[
  {
    "id": 1,
    "user_message": "Olá",
    "bot_response": "Olá! 👋 Eu sou o Nexora AI...",
    "timestamp": "2024-06-20 10:30:00",
    "language": "pt"
  }
]
```

### DELETE `/api/history`
Limpa todo o histórico de conversas

## 🌐 Deploy

### Heroku

1. **Instale o Heroku CLI**
```bash
brew tap heroku/brew && brew install heroku
```

2. **Faça login**
```bash
heroku login
```

3. **Crie um app**
```bash
heroku create seu-app-name
```

4. **Deploy**
```bash
git push heroku main
```

### Vercel

1. **Instale Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

### GitHub Pages (Apenas Frontend)

1. Ative GitHub Pages nas configurações do repositório
2. Selecione a branch `main`
3. O site estará disponível em `https://gs12233hh-web.github.io/Nexora-AI`

## 🎨 Customização

### Alterar Cores
Edite as variáveis CSS em `public/style.css`:

```css
:root {
  --primary: #6366f1;      /* Cor principal */
  --secondary: #ec4899;    /* Cor secundária */
  --bg-dark: #0f172a;      /* Fundo escuro */
  --bg-light: #f8fafc;     /* Fundo claro */
}
```

### Adicionar Mais Respostas
Edite `server.js` e adicione palavras-chave e respostas:

```javascript
const responses = {
  pt: {
    greetings: ['oi', 'olá', 'hey'],
    // ...
  }
};
```

## 🤝 Contribuindo

Pull requests são bem-vindas! Para mudanças maiores, abra uma issue primeiro.

## 📝 Licença

MIT - Veja LICENSE.md

## 👤 Autor

Desenvolvido por **gs12233hh-web**

## 💬 Suporte

Tem dúvidas? Abra uma [issue](https://github.com/gs12233hh-web/Nexora-AI/issues) no GitHub!

---

**⭐ Se gostou, deixe uma estrela!**
