import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Define types
type ModelsResponse = {
  textModels: Array<{ id: string; name: string }>;
  imageModels: Array<{ id: string; name: string }>;
  searchModels: Array<{ id: string; name: string }>;
};

// Mock the fetch API
globalThis.fetch = vi.fn() as unknown as typeof fetch;

function mockModelsResponse(): ModelsResponse {
  return {
    textModels: [
      { id: 'openai', name: 'OpenAI GPT' },
      { id: 'mistral', name: 'Mistral' },
    ],
    imageModels: [
      { id: 'flux', name: 'Flux' },
      { id: 'turbo', name: 'Turbo' },
    ],
    searchModels: [
      { id: 'openai', name: 'OpenAI GPT' },
      { id: 'claude', name: 'Claude' },
    ],
  };
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the models API endpoint
    (globalThis.fetch as unknown as Mock).mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockModelsResponse()),
      ok: true,
    });
  });

  it('renders App component correctly', () => {
    render(<App />);
    expect(screen.getByText('🤖 Pollinations Mega Agent')).toBeInTheDocument();
    expect(screen.getByText('Powered by pollinations.ai')).toBeInTheDocument();
  });

  it('loads and displays welcome message', async () => {
    render(<App />);

    // Should show welcome message
    expect(screen.getByText('👋 Bem-vindo ao Mega Agent!')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Envie uma mensagem e deixe o agente decidir qual ferramenta usar/
      )
    ).toBeInTheDocument();
  });

  it('fetches and displays model options', async () => {
    render(<App />);

    // Wait for models to be fetched
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/agent/models');
    });
  });

  it('displays model selectors', () => {
    render(<App />);

    // Check for model selector labels
    expect(screen.getByText('💬 Modelo de Chat')).toBeInTheDocument();
    expect(screen.getByText('🎨 Modelo de Imagem')).toBeInTheDocument();
    expect(screen.getByText('🔍 Modelo de Pesquisa')).toBeInTheDocument();
  });

  it('displays example prompts', () => {
    render(<App />);

    expect(
      screen.getByText('"Gerar imagem de um gato astronauta"')
    ).toBeInTheDocument();
    expect(
      screen.getByText('"Pesquisar sobre inteligência artificial"')
    ).toBeInTheDocument();
    expect(
      screen.getByText('"Explique como funciona o React"')
    ).toBeInTheDocument();
  });
});
