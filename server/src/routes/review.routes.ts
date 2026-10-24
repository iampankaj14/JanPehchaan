import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { validateBody } from '../middleware/validate';
import { updateReviewFlagSchema } from '../validators/schemas';

const router = Router();

// Staff review queue
router.get('/', ReviewController.getReviewFlags);
router.patch('/:id', validateBody(updateReviewFlagSchema), ReviewController.resolveFlag);

// Audit logs
router.get('/logs', ReviewController.getAuditLogs);

// Reset demo dataset for fresh judging presentation
router.post('/reset-demo', ReviewController.resetDemoData);

export default router;
