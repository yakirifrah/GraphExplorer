import { Request, Response } from 'express';
import {getIMDbRating} from '../services/idbm.service'
import RatingsService from "../services/ratings.service";
class RatingsController {
  async updateRatingByIDBM(req:Request, res:Response) {
    try {
      const { title } = req.body;
      const {movieId} = req.params;
      const { rating, votes } = await getIMDbRating(title);
      if (!rating || !votes) {
        return res.status(404).json({ error: 'Rating not found' });
      }
      const updatedRating = await RatingsService.updateRatingAndVote(movieId, rating, votes);
      res.status(200).json(updatedRating);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new RatingsController();
