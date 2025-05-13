import { Request, Response } from 'express';
import RelationsService from '../services/relations.service';

class RelationsController {
async fetchRelations(req: Request, res: Response) {
    try {
      const relations = await RelationsService.getAllRelations();
      res.status(200).json(relations);
    } catch (error) {
      console.error('Error fetching relations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  async fetchRelationsByNodeId(req: Request, res: Response) {
    const { nodeId } = req.query;
    try {
      const relations = await RelationsService.getRelationsByNodeId(nodeId as string);
      res.status(200).json(relations);
    } catch (error) {
      console.error('Error fetching relations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new RelationsController();
