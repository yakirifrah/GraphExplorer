import { Request, Response } from 'express';
import NodesService from '../services/nodes.service';

class NodeController {
   async fetchNodes(req: Request, res: Response) {
    try {
      const nodes = await NodesService.getAllNodes();
      res.status(200).json(nodes);
    } catch (error) {
      console.error('Error fetching nodes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  async getNodeById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const node = await NodesService.getNodeById(id);
      if (node.length === 0) {
        return res.status(404).json({ error: 'Node not found' });
      }
      res.status(200).json(node);
    } catch (error) {
      console.error('Error fetching node:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
export default new NodeController();
