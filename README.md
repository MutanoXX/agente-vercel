# 🤖 Pollinations Mega Agent

Um agente inteligente que integra todas as funcionalidades do **pollinations.ai** com uma interface web moderna e interativa.

## ✨ Características

### 🎯 Agente Inteligente

- **Decisão Automática**: O agente analisa seu prompt e decide automaticamente qual ferramenta usar
- **Múltiplas Ferramentas**: Chat, geração de imagens, pesquisa web e modo híbrido
- **Streaming em Tempo Real**: Respostas aparecem conforme são geradas

### 🎨 Interface Moderna

- **Dark Theme**: Interface escura com detalhes brancos
- **Seleção de Modelos**: Escolha modelos diferentes para chat, imagem e pesquisa
- **Animações Suaves**: Efeitos visuais modernos e transições fluidas
- **Indicadores de Ferramentas**: Visualização decorada das ferramentas sendo usadas

### 🚀 Tecnologias

**Frontend**

- React 19 com TypeScript
- Vite para build rápido
- CSS moderno com variáveis e animações
- Hooks customizados para gerenciamento de estado

**Backend**

- Express com TypeScript
- Integração completa com pollinations.ai
- Sistema de decisão inteligente
- Suporte a Server-Sent Events (SSE) para streaming

**Deployment**

- Otimizado para Vercel
- Configuração serverless
- Build automático

## 🛠️ Instalação Local

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 🌐 Deploy no Vercel

1. Faça fork deste repositório
2. Conecte seu repositório ao Vercel
3. O Vercel detectará automaticamente as configurações
4. Deploy! 🚀

Ou use o Vercel CLI:

```bash
npm i -g vercel
vercel
```

## 📖 Como Usar

1. **Selecione os Modelos**: Use a barra lateral para escolher os modelos de IA
2. **Digite sua Mensagem**: Escreva o que você quer no campo de entrada
3. **Deixe o Agente Decidir**: O agente analisará e usará a ferramenta apropriada
4. **Veja os Resultados**: Respostas aparecem em tempo real com streaming

### Exemplos de Prompts

**Para Chat:**

- "Explique como funciona o React"
- "Me conte uma história sobre robôs"

**Para Geração de Imagens:**

- "Gerar imagem de um gato astronauta"
- "Criar imagem de uma cidade futurista"

**Para Pesquisa:**

- "Pesquisar sobre inteligência artificial"
- "Buscar informações sobre mudanças climáticas"

**Modo Híbrido:**

- "Pesquisar sobre dragões e gerar uma imagem"

## 🔧 Configuração

### Modelos Disponíveis

**Chat/Texto:**

- OpenAI GPT
- Mistral
- Llama
- Claude

**Imagens:**

- Flux
- Flux Pro
- Flux Realism
- Turbo

**Pesquisa:**

- OpenAI GPT
- Mistral
- Claude

## 📝 Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   ├── types.ts       # TypeScript types
│   │   ├── App.tsx        # Componente principal
│   │   └── styles.css     # Estilos globais
│   └── package.json
│
├── server/                 # Backend Express
│   ├── src/
│   │   ├── agent/         # Sistema do agente
│   │   │   ├── decision.ts    # Lógica de decisão
│   │   │   ├── pollinations.ts # API pollinations.ai
│   │   │   └── index.ts       # Agente principal
│   │   ├── routes/        # Rotas da API
│   │   ├── types.ts       # TypeScript types
│   │   ├── app.ts         # Configuração Express
│   │   └── server.ts      # Entry point
│   └── package.json
│
├── vercel.json            # Configuração Vercel
└── package.json           # Scripts principais
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

MIT

## 🙏 Créditos

- Powered by [pollinations.ai](https://pollinations.ai)
- Built with [Mentat](https://mentat.ai)
