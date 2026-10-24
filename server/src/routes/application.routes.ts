import { Router, Response } from 'express';
import { ApplicationService } from '../services/application.service';
import { authenticate, allowRoles, AuthenticatedRequest } from '../middleware/auth';
import { ApplicationStatus } from '../types';

const router = Router();

// List applications (Citizens see their own; Officers/Admins see all)
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const role = req.user?.role || 'CITIZEN';
    const applicantId = req.user?.id;
    const applications = await ApplicationService.getAll(role, applicantId);

    // Format matching Version 2 frontend expectations
    res.json({
      success: true,
      applications,
      data: applications
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Unable to fetch applications' });
  }
});

// Single application detail
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const app = await ApplicationService.getById(String(req.params.id));
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    if (req.user?.role === 'CITIZEN' && app.applicantId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied: You cannot view this application.' });
      return;
    }

    res.json({ success: true, data: app });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit new application
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { schemeId, householdId, notes } = req.body;
    if (!schemeId) {
      res.status(400).json({ success: false, message: 'Scheme ID is required' });
      return;
    }

    const newApp = await ApplicationService.create({
      applicantId: req.user!.id,
      applicantName: req.user!.name,
      applicantEmail: req.user!.email,
      schemeId,
      householdId,
      notes
    });

    res.status(201).json({
      success: true,
      message: newApp.duplicateFlag
        ? 'Application submitted and flagged for officer review.'
        : 'Application submitted successfully.',
      data: newApp
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to submit application' });
  }
});

// Review application (Officer & Admin only)
router.patch('/:id/review', authenticate, allowRoles('ADMIN', 'OFFICER'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, notes } = req.body;
    if (!status) {
      res.status(400).json({ success: false, message: 'Status is required' });
      return;
    }

    const reviewerName = req.user?.name || 'Authorized Officer';
    const updated = await ApplicationService.review(String(req.params.id), status as ApplicationStatus, notes, reviewerName);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.json({
      success: true,
      message: `Application status updated to ${status}. Notification dispatched.`,
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
