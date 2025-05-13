import express, {RequestHandler, Router} from "express";
import RatingsController from "../controllers/ratings.controller";
const router: Router = express.Router();

router.post('/:movieId', RatingsController.updateRatingByIDBM as RequestHandler);

export default router;
