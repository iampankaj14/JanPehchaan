import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';

const router = Router();

// Trigger record verification checks and duplicate detection
router.post('/check/:familyId', VerificationController.verifyFamilyRecord);

export default router;
