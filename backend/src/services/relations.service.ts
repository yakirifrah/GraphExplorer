import Neo4jConnection from "../config/neo4j";
import neo4j from "neo4j-driver";

class RelationsService {
  private driver;
  constructor() {
    this.driver = Neo4jConnection.getDriver();
  }
  async getAllRelations(): Promise<any[]> {
    const session = this.driver.session();
    try {
      const result = await session.run('MATCH (a)-[r]->(b) RETURN a, r, b LIMIT 100');
      return result.records.map(record => {
        const from = record.get('a');
        const rel = record.get('r');
        const to = record.get('b');
        return {
          id: rel.identity.toString(),
          type: rel.type,
          properties: rel.properties,
          from: {
            id: from.identity.toString(),
            labels: from.labels,
            properties: from.properties
          },
          to: {
            id: to.identity.toString(),
            labels: to.labels,
            properties: to.properties
          }
        };
      });
    } catch (error) {
      console.error('Error fetching relations:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  async getRelationsByNodeId(id: string): Promise<any[]> {
    const session = this.driver.session();
    // (m:Movie)<-[r:RATED]-(u:User)
    try {
      const result = await session.run('MATCH (m)-[r]-(u) WHERE id(m) = $id RETURN m, r, u LIMIT 100', { id: neo4j.int(id)}  );
      return result.records.map(record => {
        const from = record.get('m');
        const rel = record.get('r');
        const to = record.get('u');
        return {
          id: rel.identity.toString(),
          type: rel.type,
          properties: rel.properties,
          from: {
            id: from.identity.toString(),
            labels: from.labels,
            properties: from.properties
          },
          to: {
            id: to.identity.toString(),
            labels: to.labels,
            properties: to.properties
          }
        };
      });
    } catch (error) {
      console.error('Error fetching relations:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
}
export default new RelationsService();
