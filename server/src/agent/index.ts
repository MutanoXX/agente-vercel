import { AgentConfig, StreamChunk } from '../types';
import { PollinationsAPI } from './pollinations';
import { AgentDecisionMaker } from './decision';

export class MegaAgent {
  private pollinations: PollinationsAPI;
  private decisionMaker: AgentDecisionMaker;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.pollinations = new PollinationsAPI();
    this.decisionMaker = new AgentDecisionMaker();
  }

  async *processPrompt(prompt: string): AsyncGenerator<StreamChunk> {
    try {
      // Step 1: Decide which tools to use
      const decision = this.decisionMaker.decideTools(prompt);

      // Step 2: Emit tool decision
      yield {
        type: 'tool',
        data: {
          tool: decision.tool,
          reasoning: decision.reasoning,
        },
      };

      // Step 3: Execute based on decision
      switch (decision.tool) {
        case 'text':
          yield* this.handleText(prompt);
          break;

        case 'image':
          yield* this.handleImage(prompt);
          break;

        case 'search':
          yield* this.handleSearch(prompt);
          break;

        case 'hybrid':
          yield* this.handleHybrid(prompt);
          break;
      }

      yield { type: 'done', data: {} };
    } catch (error) {
      yield {
        type: 'error',
        data: { message: (error as Error).message },
      };
    }
  }

  private async *handleText(prompt: string): AsyncGenerator<StreamChunk> {
    const response = await this.pollinations.generateText(
      prompt,
      this.config.textModel,
      true
    );

    if (!response || typeof response === 'string') {
      throw new Error('Expected streaming response');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              yield { type: 'content', data: { content } };
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  private async *handleImage(prompt: string): AsyncGenerator<StreamChunk> {
    const imagePrompt = this.decisionMaker.extractImagePrompt(prompt);

    yield {
      type: 'content',
      data: {
        content: `\n\n🎨 Gerando imagem: "${imagePrompt}"\n\n`,
      },
    };

    const imageUrl = this.pollinations.generateImageUrl(
      imagePrompt,
      this.config.imageModel,
      1024,
      1024
    );

    yield {
      type: 'image',
      data: { imageUrl, prompt: imagePrompt },
    };

    yield {
      type: 'content',
      data: {
        content: `\n✅ Imagem gerada com sucesso!\n`,
      },
    };
  }

  private async *handleSearch(prompt: string): AsyncGenerator<StreamChunk> {
    yield {
      type: 'content',
      data: {
        content: `\n\n🔍 Pesquisando informações...\n\n`,
      },
    };

    const response = await this.pollinations.generateText(
      `Search and provide detailed information: ${prompt}`,
      this.config.searchModel,
      true
    );

    if (!response || typeof response === 'string') {
      throw new Error('Expected streaming response');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              yield { type: 'content', data: { content } };
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  private async *handleHybrid(prompt: string): AsyncGenerator<StreamChunk> {
    // First search
    yield* this.handleSearch(prompt);

    // Then generate image if applicable
    const imagePrompt = this.decisionMaker.extractImagePrompt(prompt);
    if (imagePrompt !== prompt) {
      yield* this.handleImage(prompt);
    }
  }

  updateConfig(config: Partial<AgentConfig>) {
    this.config = { ...this.config, ...config };
  }
}
