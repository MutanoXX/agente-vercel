export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolUsed?: string;
  imageUrl?: string;
  timestamp: number;
}

export interface AgentConfig {
  textModel: string;
  imageModel: string;
  searchModel: string;
}

export interface ToolDecision {
  tool: 'text' | 'image' | 'search' | 'hybrid';
  reasoning: string;
  params: Record<string, boolean | string | number>;
}

export interface StreamChunk {
  type: 'tool' | 'content' | 'image' | 'done' | 'error';
  data: {
    tool?: string;
    reasoning?: string;
    content?: string;
    imageUrl?: string;
    prompt?: string;
    message?: string;
  };
}
