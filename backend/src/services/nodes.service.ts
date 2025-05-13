import Neo4jConnection from '../config/neo4j';
import neo4j from "neo4j-driver";


class NodesService {
  private driver;
  constructor() {
    this.driver = Neo4jConnection.getDriver();
  }
  async getAllNodes() : Promise<any[]> {
    const session = this.driver.session();
    try {
      const result = await session.run('MATCH (m) RETURN m LIMIT 50');
      return result.records.map(record => record.get('m'));
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  async getNodeById(id: string) : Promise<any> {
    const session = this.driver.session();
    try {
      const result = await session.run('MATCH (m) WHERE id(m) = $id RETURN m', { id: neo4j.int(id) });
      const record = result.records[0];
      const node = record.get('m');
      return {
        id: node.identity.toString(),
        labels: node.labels,
        properties: node.properties
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

}

export default new NodesService();
