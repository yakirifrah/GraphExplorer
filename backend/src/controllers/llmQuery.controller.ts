import { Request, Response } from 'express';
import llmQueryService from "../services/llmQuery.service";

export class LlmQueryController {

  async handleNaturalLanguageQuery(req: Request, res: Response) {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    try {
      const { query, result } = await llmQueryService.processPrompt(prompt);
      return res.json({ query, result });
    } catch (err) {
      console.error(err);
     return res.status(500).json({ error: 'Failed to process query' });
    }
  }
}
export default new LlmQueryController();
