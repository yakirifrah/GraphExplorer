import neo4j, {Driver} from 'neo4j-driver';


const uri = process.env.NEO4J_URI as string;
const username = process.env.NEO4J_USERNAME as string;
const password = process.env.NEO4J_PASSWORD as string;
const database = process.env.NEO4J_DATABASE as string;

class Neo4jConnection {
  private static instance: Driver;

  private constructor() {}

  public static getDriver(): Driver {
    if (!this.instance) {
      this.instance = neo4j.driver(uri, neo4j.auth.basic(username, password));
    }
    return this.instance;
  }

  public static async closeDriver(): Promise<void> {
    if (this.instance) {
      await this.instance.close();
    }
  }
}

export default Neo4jConnection;
