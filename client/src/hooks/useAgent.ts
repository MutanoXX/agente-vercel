import { useState, useCallback } from 'react';
import { Message, AgentConfig, StreamChunk } from '../types';

export function useAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTool, setCurrentTool] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (prompt: string, config: AgentConfig) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: prompt,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setCurrentTool(null);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const response = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            config,
            sessionId: 'user-session',
          }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('No reader available');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: StreamChunk = JSON.parse(line.substring(6));

                switch (data.type) {
                  case 'tool':
                    setCurrentTool(data.data.reasoning || null);
                    setMessages((prev) => {
                      const updated = [...prev];
                      const lastMsg = updated[updated.length - 1];
                      lastMsg.toolUsed = data.data.tool;
                      return updated;
                    });
                    break;

                  case 'content':
                    setMessages((prev) => {
                      const updated = [...prev];
                      const lastMsg = updated[updated.length - 1];
                      lastMsg.content += data.data.content;
                      return updated;
                    });
                    break;

                  case 'image':
                    setMessages((prev) => {
                      const updated = [...prev];
                      const lastMsg = updated[updated.length - 1];
                      lastMsg.imageUrl = data.data.imageUrl;
                      return updated;
                    });
                    break;

                  case 'done':
                    setIsLoading(false);
                    setCurrentTool(null);
                    break;

                  case 'error':
                    console.error('Agent error:', data.data.message);
                    setMessages((prev) => {
                      const updated = [...prev];
                      const lastMsg = updated[updated.length - 1];
                      lastMsg.content += `\n\n❌ Erro: ${data.data.message}`;
                      return updated;
                    });
                    setIsLoading(false);
                    setCurrentTool(null);
                    break;
                }
              } catch (e) {
                console.error('Error parsing SSE:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          lastMsg.content = `❌ Erro ao conectar com o agente: ${(error as Error).message}`;
          return updated;
        });
        setIsLoading(false);
        setCurrentTool(null);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    currentTool,
    sendMessage,
    clearMessages,
  };
}
