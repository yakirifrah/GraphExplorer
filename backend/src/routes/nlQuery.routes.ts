import express, {RequestHandler, Router} from 'express';
import  LlmQueryController from '../controllers/llmQuery.controller';

const router: Router = express.Router();
// router.post('/', LlmQueryController.handleNaturalLanguageQuery);
export default router;
