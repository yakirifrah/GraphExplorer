import { OpenAI } from 'openai';
import Neo4jConnection from "../config/neo4j";
import {Driver} from "neo4j-driver";

export class LlmQueryService {
  private openai: OpenAI;
private driver:Driver;
  constructor() {
    this.driver = Neo4jConnection.getDriver();
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }

  async processPrompt(prompt: string): Promise<{ query: string, result: any }> {
    const session = this.driver.session();

    const systemPrompt = `
You are a helpful assistant that translates natural language queries into Cypher queries 
for a Neo4j movie graph. The graph has Movies, Actors, Directors, and Genres.
Return only the Cypher query, nothing else.
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    });

    const cypherQuery = completion.choices[0].message.content?.trim();

    if (!cypherQuery || !cypherQuery.toLowerCase().startsWith('match')) {
      throw new Error('Invalid Cypher query response');
    }

    const result = await session.run(cypherQuery);

    return { query: cypherQuery, result };
  }
}
export default new LlmQueryService();
