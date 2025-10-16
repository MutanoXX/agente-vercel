import { ToolDecision } from '../types';

export class AgentDecisionMaker {
  /**
   * Analyzes user prompt and decides which tool(s) to use
   */
  decideTools(prompt: string): ToolDecision {
    const lowerPrompt = prompt.toLowerCase();

    // Image generation keywords
    const imageKeywords = [
      'gerar imagem',
      'criar imagem',
      'desenhar',
      'ilustrar',
      'foto de',
      'imagem de',
      'picture of',
      'image of',
      'draw',
      'create image',
      'generate image',
      'visualize',
      'visualizar',
    ];

    // Search keywords
    const searchKeywords = [
      'pesquisar',
      'buscar',
      'procurar',
      'search',
      'find',
      'lookup',
      'what is',
      'o que é',
      'quem é',
      'who is',
      'latest',
      'recent',
      'notícias',
      'news',
    ];

    const hasImageIntent = imageKeywords.some((kw) => lowerPrompt.includes(kw));
    const hasSearchIntent = searchKeywords.some((kw) =>
      lowerPrompt.includes(kw)
    );

    // Hybrid: both image and text/search
    if (hasImageIntent && hasSearchIntent) {
      return {
        tool: 'hybrid',
        reasoning:
          'Detectei que você quer buscar informações E gerar uma imagem. Vou fazer ambos!',
        params: { generateImage: true, searchWeb: true },
      };
    }

    // Pure image generation
    if (hasImageIntent) {
      return {
        tool: 'image',
        reasoning:
          'Detectei que você quer gerar uma imagem. Vou usar o modelo de geração de imagens!',
        params: { extractImagePrompt: true },
      };
    }

    // Search/research
    if (hasSearchIntent) {
      return {
        tool: 'search',
        reasoning:
          'Detectei que você quer buscar informações. Vou pesquisar para você!',
        params: { searchMode: true },
      };
    }

    // Default: conversational text
    return {
      tool: 'text',
      reasoning: 'Vou responder sua pergunta usando o modelo de chat!',
      params: {},
    };
  }

  /**
   * Extracts image prompt from user message
   */
  extractImagePrompt(userPrompt: string): string {
    // Remove common prefixes
    const prefixes = [
      'gerar imagem de',
      'criar imagem de',
      'desenhar',
      'imagem de',
      'foto de',
      'generate image of',
      'create image of',
      'draw',
      'image of',
      'picture of',
    ];

    let cleaned = userPrompt.toLowerCase();
    for (const prefix of prefixes) {
      if (cleaned.startsWith(prefix)) {
        cleaned = cleaned.substring(prefix.length).trim();
        break;
      }
    }

    return cleaned || userPrompt;
  }
}
