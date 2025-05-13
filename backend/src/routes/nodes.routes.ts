import express, {RequestHandler, Router} from "express";
import NodeController from "../controllers/nodes.controllers";
const router: Router = express.Router();

router.get('/',  NodeController.fetchNodes);
router.get('/:id', NodeController.getNodeById as RequestHandler);

export default router;
