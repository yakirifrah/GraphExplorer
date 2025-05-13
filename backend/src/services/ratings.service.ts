import Neo4jConnection from '../config/neo4j';
import neo4j from "neo4j-driver";


class RatingsService {
  private driver;
  constructor() {
    this.driver = Neo4jConnection.getDriver();
  }
  async updateRatingAndVote(movieId: string, rating: number, votes: number) : Promise<any> {
    const session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (m) WHERE id(m) = $movieId SET m.rating = $rating, m.votes = $votes RETURN m',
        { movieId: neo4j.int(movieId), rating, votes }
      );
      const record = result.records[0];
      const node = record.get('m');
      return {
        id: node.identity.toString(),
        labels: node.labels,
        properties: node.properties
      }
    } catch (error) {
      console.error('Error updating rating and votes:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
}

export default new RatingsService();
