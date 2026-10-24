import { Router, Response } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import familyRoutes from './family.routes';
import verificationRoutes from './verification.routes';
import schemeRoutes from './scheme.routes';
import applicationRoutes from './application.routes';
import dashboardRoutes from './dashboard.routes';
import reviewRoutes from './review.routes';
import { ApplicationService } from '../services/application.service';
import { DbService } from '../services/db.service';
import { authenticate, allowRoles, AuthenticatedRequest } from '../middleware/auth';

const apiRouter = Router();

// Base System & Health
apiRouter.use('/', healthRoutes);

// Authentication & Users (Login, Register, Session)
apiRouter.use('/auth', authRoutes);

// Citizen Family Records & Hierarchy
apiRouter.use('/families', familyRoutes);

// Record Quality Verification & Discrepancy Checks
apiRouter.use('/verification', verificationRoutes);

// Welfare Schemes Catalog & Smart Rule Matching
apiRouter.use('/schemes', schemeRoutes);

// Citizen Scheme Applications & Status Tracking
apiRouter.use('/applications', applicationRoutes);

// Dashboard Overview Statistics
apiRouter.use('/dashboard', dashboardRoutes);

// Frontline Staff Reviews & Resolution
apiRouter.use('/reviews', reviewRoutes);

// --- Version 2 Frontend Direct Aliases ---
// Duplicate Review Queue for Admin Tab
apiRouter.get('/duplicate-queue', authenticate, allowRoles('ADMIN', 'OFFICER'), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const duplicates = await ApplicationService.getDuplicateQueue();
    res.json({
      success: true,
      count: duplicates.length,
      applications: duplicates,
      data: duplicates
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Audit Logs for Admin Tab
apiRouter.get('/audit-logs', authenticate, allowRoles('ADMIN'), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await DbService.getChangeLogs();
    const formatted = logs.map(l => ({
      id: l.id,
      createdAt: l.changed_at,
      actor: { name: l.changed_by, role: 'ADMIN' },
      action: `${l.field_name}: ${l.old_value || 'None'} → ${l.new_value}`,
      recordId: l.entity_id
    }));
    res.json({
      success: true,
      logs: formatted,
      data: formatted
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default apiRouter;
