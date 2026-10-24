import { Request, Response, NextFunction } from 'express';
import { DbService } from '../services/db.service';

export class ReviewController {
  static async getReviewFlags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as string | undefined;
      const flags = await DbService.getReviewFlags(status);

      // Enrich with family head name and district
      const enriched = await Promise.all(
        flags.map(async flag => {
          const family = await DbService.getFamilyById(flag.family_id);
          return {
            ...flag,
            family_head_name: family?.family_head_name || 'Unknown',
            district: family?.district || 'Unknown',
            pincode: family?.pincode || 'Unknown'
          };
        })
      );

      res.json({
        success: true,
        data: enriched
      });
    } catch (error) {
      next(error);
    }
  }

  static async resolveFlag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const { status, reviewer_notes } = req.body;

      const updated = await DbService.updateReviewFlag(id, status, reviewer_notes);

      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Review flag with ID "${id}" was not found.`
        });
        return;
      }

      res.json({
        success: true,
        message: `Record review updated to status: ${status}.`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = req.query.entityId as string | undefined;
      const logs = await DbService.getChangeLogs(entityId);
      res.json({
        success: true,
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetDemoData(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      DbService.resetDemoStore();
      res.json({
        success: true,
        message: 'Demo dataset reset to initial state for live presentation.'
      });
    } catch (error) {
      next(error);
    }
  }
}
