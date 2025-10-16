import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const toolIcons: Record<string, string> = {
  text: '💬',
  image: '🎨',
  search: '🔍',
  hybrid: '🔄',
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-header">
        <span className="message-role">
          {isUser ? '👤 Você' : '🤖 Mega Agent'}
        </span>
        {message.toolUsed && (
          <span className="tool-badge">
            {toolIcons[message.toolUsed]} {message.toolUsed}
          </span>
        )}
      </div>
      <div className="message-content">
        {message.content && (
          <div className="text-content">{message.content}</div>
        )}
        {message.imageUrl && (
          <div className="image-content">
            <img src={message.imageUrl} alt="Generated" loading="lazy" />
          </div>
        )}
      </div>
      <div className="message-time">
        {new Date(message.timestamp).toLocaleTimeString('pt-BR')}
      </div>
    </div>
  );
}
