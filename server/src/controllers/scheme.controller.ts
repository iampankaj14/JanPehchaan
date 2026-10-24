import { Request, Response, NextFunction } from 'express';
import { DbService } from '../services/db.service';
import { EligibilityService } from '../services/eligibility.service';

export class SchemeController {
  static async getAllSchemes(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schemes = await DbService.getSchemes();
      res.json({
        success: true,
        data: schemes
      });
    } catch (error) {
      next(error);
    }
  }

  static async evaluateFamily(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const familyId = String(req.params.familyId);
      const family = await DbService.getFamilyById(familyId);

      if (!family) {
        res.status(404).json({
          success: false,
          message: `Family with ID "${familyId}" was not found.`
        });
        return;
      }

      const members = await DbService.getMembersByFamilyId(familyId);
      const schemes = await DbService.getSchemes();

      const report = EligibilityService.evaluateFamilyEligibility(family, members, schemes);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  }
}
