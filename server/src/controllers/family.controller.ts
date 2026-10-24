import { Request, Response, NextFunction } from 'express';
import { DbService } from '../services/db.service';

export class FamilyController {
  static async getAllFamilies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = (req.query.search as string)?.toLowerCase().trim();
      let families = await DbService.getFamilies();

      if (search) {
        families = families.filter(f =>
          f.family_head_name.toLowerCase().includes(search) ||
          f.district.toLowerCase().includes(search) ||
          f.pincode.includes(search)
        );
      }

      // Populate member count and pending reviews count for list view
      const enriched = await Promise.all(
        families.map(async f => {
          const members = await DbService.getMembersByFamilyId(f.id);
          const flags = await DbService.getReviewFlagsByFamilyId(f.id);
          const pendingFlags = flags.filter(flag => flag.status === 'pending');

          return {
            ...f,
            member_count: members.length,
            pending_reviews_count: pendingFlags.length
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

  static async getFamilyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const family = await DbService.getFamilyById(id);

      if (!family) {
        res.status(404).json({
          success: false,
          message: `Family record with ID "${id}" was not found.`
        });
        return;
      }

      res.json({
        success: true,
        data: family
      });
    } catch (error) {
      next(error);
    }
  }

  static async createFamily(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newFamily = await DbService.createFamily(req.body);
      res.status(201).json({
        success: true,
        message: 'Family profile created successfully.',
        data: newFamily
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateFamily(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const author = (req.headers['x-reviewer-name'] as string) || 'Authorised Reviewer';
      const updated = await DbService.updateFamily(id, req.body, author);

      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Family with ID "${id}" was not found.`
        });
        return;
      }

      res.json({
        success: true,
        message: 'Family details updated and logged to audit trail.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteFamily(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await DbService.deleteFamily(id);
      res.json({
        success: true,
        message: 'Family record removed successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  // --- MEMBER HANDLERS ---
  static async addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const familyId = String(req.params.id);
      const family = await DbService.getFamilyById(familyId);

      if (!family) {
        res.status(404).json({
          success: false,
          message: `Cannot add member: Family "${familyId}" does not exist.`
        });
        return;
      }

      const member = await DbService.createMember(familyId, req.body);
      res.status(201).json({
        success: true,
        message: 'Family member registered successfully.',
        data: member
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = String(req.params.memberId);
      const author = (req.headers['x-reviewer-name'] as string) || 'Authorised Reviewer';
      const updated = await DbService.updateMember(memberId, req.body, author);

      if (!updated) {
        res.status(404).json({
          success: false,
          message: `Member with ID "${memberId}" was not found.`
        });
        return;
      }

      res.json({
        success: true,
        message: 'Member details updated and logged.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = String(req.params.memberId);
      await DbService.deleteMember(memberId);
      res.json({
        success: true,
        message: 'Family member removed successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}
