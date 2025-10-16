import fetch from 'node-fetch';

export class PollinationsAPI {
  private baseTextUrl = 'https://text.pollinations.ai';
  private baseImageUrl = 'https://image.pollinations.ai/prompt';

  async generateText(
    prompt: string,
    model: string = 'openai',
    stream: boolean = false
  ): Promise<Response | string> {
    const url = `${this.baseTextUrl}/${encodeURIComponent(prompt)}?model=${model}${stream ? '&stream=true' : ''}`;

    const response = await fetch(url);

    if (stream) {
      return response as any;
    }

    return await response.text();
  }

  generateImageUrl(
    prompt: string,
    model: string = 'flux',
    width: number = 1024,
    height: number = 1024,
    seed?: number
  ): string {
    let url = `${this.baseImageUrl}/${encodeURIComponent(prompt)}?model=${model}&width=${width}&height=${height}&nologo=true`;
    if (seed) {
      url += `&seed=${seed}`;
    }
    return url;
  }

  async searchWeb(query: string, model: string = 'openai'): Promise<string> {
    const searchPrompt = `Search the web and provide detailed information about: ${query}. Include relevant facts, recent developments, and sources if possible.`;
    return this.generateText(searchPrompt, model, false) as Promise<string>;
  }
}
