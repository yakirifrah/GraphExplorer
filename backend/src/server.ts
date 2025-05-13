import app from './app'
import Neo4jConnection from "./config/neo4j";

const startServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    // Ensure Neo4j connection is established
   await Neo4jConnection.getDriver().getServerInfo({database: process.env.NEO4J_DATABASE});
  console.log(`Connected to Neo4j`);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error( error);
    await Neo4jConnection.closeDriver();
    process.exit(1);
  }
}
startServer();
