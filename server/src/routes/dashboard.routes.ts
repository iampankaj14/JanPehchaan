import { Router, Response } from 'express';
import { DbService } from '../services/db.service';
import { AuthService } from '../services/auth.service';
import { ApplicationService } from '../services/application.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Aggregate dashboard stats
router.get('/', authenticate, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const families = await DbService.getFamilies();
    const schemes = await DbService.getSchemes();

    const stats = {
      citizens: AuthService.getUsersCount(),
      households: families.length,
      schemes: schemes.length,
      applications: ApplicationService.getCount(),
      flagged: ApplicationService.getFlaggedCount(),
      pending: ApplicationService.getPendingCount()
    };

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to load dashboard statistics' });
  }
});

export default router;
