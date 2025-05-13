import express, {Express} from 'express';
import cors from 'cors';
import nodesRoutes from "./routes/nodes.routes";
import relationsRoutes from "./routes/relations.routes";
import ratingsRoutes from "./routes/ratings.routes";
import nlQueryRoutes from "./routes/nlQuery.routes";
const app: Express = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
})
// Define routes
app.use('/api/nodes', nodesRoutes);
app.use('/api/relations', relationsRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/nl-query', nlQueryRoutes);

export default app;
