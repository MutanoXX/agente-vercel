export interface Message {
  id: string;
  role: 'user' | 'assistant';
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

export interface ModelOption {
  id: string;
  name: string;
}

export interface StreamChunk {
  type: 'tool' | 'content' | 'image' | 'done' | 'error';
  data: any;
}
