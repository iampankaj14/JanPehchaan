import { Router } from 'express';
import { SchemeController } from '../controllers/scheme.controller';

const router = Router();

// List all schemes
router.get('/', SchemeController.getAllSchemes);

// Evaluate family eligibility against scheme rules
router.post('/evaluate/:familyId', SchemeController.evaluateFamily);

export default router;
