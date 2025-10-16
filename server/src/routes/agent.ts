import { Router, Request, Response } from 'express';
import { MegaAgent } from '../agent';
import { AgentConfig } from '../types';

const router = Router();

// Store agent instances per session (in production, use Redis or similar)
const agents = new Map<string, MegaAgent>();

function getOrCreateAgent(sessionId: string, config: AgentConfig): MegaAgent {
  if (!agents.has(sessionId)) {
    agents.set(sessionId, new MegaAgent(config));
  } else {
    agents.get(sessionId)!.updateConfig(config);
  }
  return agents.get(sessionId)!;
}

router.post('/chat', async (req: Request, res: Response) => {
  const { prompt, config, sessionId = 'default' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const agentConfig: AgentConfig = {
    textModel: config?.textModel || 'openai',
    imageModel: config?.imageModel || 'flux',
    searchModel: config?.searchModel || 'openai',
  };

  const agent = getOrCreateAgent(sessionId, agentConfig);

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    for await (const chunk of agent.processPrompt(prompt)) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.end();
  } catch (error) {
    res.write(
      `data: ${JSON.stringify({ type: 'error', data: { message: (error as Error).message } })}\n\n`
    );
    res.end();
  }
});

router.get('/models', (req: Request, res: Response) => {
  res.json({
    textModels: [
      { id: 'openai', name: 'OpenAI GPT' },
      { id: 'mistral', name: 'Mistral' },
      { id: 'llama', name: 'Llama' },
      { id: 'claude', name: 'Claude' },
    ],
    imageModels: [
      { id: 'flux', name: 'Flux' },
      { id: 'flux-pro', name: 'Flux Pro' },
      { id: 'flux-realism', name: 'Flux Realism' },
      { id: 'turbo', name: 'Turbo' },
    ],
    searchModels: [
      { id: 'openai', name: 'OpenAI GPT' },
      { id: 'mistral', name: 'Mistral' },
      { id: 'claude', name: 'Claude' },
    ],
  });
});

export default router;
