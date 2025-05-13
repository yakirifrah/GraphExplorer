import express, {Router} from "express";
import RelationsController from "../controllers/relations.controllers";
const router: Router = express.Router();

router.get('/',  RelationsController.fetchRelations);
router.get('/by-node', RelationsController.fetchRelationsByNodeId);
export default router;
