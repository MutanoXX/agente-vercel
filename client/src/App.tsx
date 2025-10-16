import { useState, useEffect, useRef } from 'react';
import { AgentConfig, ModelOption } from './types';
import { useAgent } from './hooks/useAgent';
import { ModelSelector } from './components/ModelSelector';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ToolIndicator } from './components/ToolIndicator';

function App() {
  const [config, setConfig] = useState<AgentConfig>({
    textModel: 'openai',
    imageModel: 'flux',
    searchModel: 'openai',
  });

  const [models, setModels] = useState<{
    textModels: ModelOption[];
    imageModels: ModelOption[];
    searchModels: ModelOption[];
  }>({
    textModels: [],
    imageModels: [],
    searchModels: [],
  });

  const { messages, isLoading, currentTool, sendMessage, clearMessages } =
    useAgent();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch available models
    fetch('/api/agent/models')
      .then((res) => res.json())
      .then((data) => setModels(data))
      .catch((err) => console.error('Error fetching models:', err));
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (message: string) => {
    sendMessage(message, config);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 Pollinations Mega Agent</h1>
          <p>Powered by pollinations.ai</p>
        </div>
        <button className="clear-button" onClick={clearMessages}>
          🗑️ Limpar Chat
        </button>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <ModelSelector
            config={config}
            onChange={setConfig}
            textModels={models.textModels}
            imageModels={models.imageModels}
            searchModels={models.searchModels}
          />

          <div className="info-section">
            <h3>ℹ️ Sobre o Agente</h3>
            <p>
              Este mega agente usa IA para decidir automaticamente qual
              ferramenta usar:
            </p>
            <ul>
              <li>💬 Chat para conversas</li>
              <li>🎨 Geração de imagens</li>
              <li>🔍 Pesquisa na web</li>
              <li>🔄 Modo híbrido</li>
            </ul>
          </div>
        </aside>

        <main className="chat-container">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <h2>👋 Bem-vindo ao Mega Agent!</h2>
                <p>
                  Envie uma mensagem e deixe o agente decidir qual ferramenta
                  usar.
                </p>
                <div className="examples">
                  <h4>Exemplos:</h4>
                  <ul>
                    <li>"Gerar imagem de um gato astronauta"</li>
                    <li>"Pesquisar sobre inteligência artificial"</li>
                    <li>"Explique como funciona o React"</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {currentTool && <ToolIndicator tool={currentTool} />}

          <ChatInput onSend={handleSend} disabled={isLoading} />
        </main>
      </div>
    </div>
  );
}

export default App;
