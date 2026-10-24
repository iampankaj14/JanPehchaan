import { Request, Response, NextFunction } from 'express';
import { DbService } from '../services/db.service';
import { ValidationService } from '../services/validation.service';
import { DuplicateService } from '../services/duplicate.service';
import { VerificationSummary } from '../types';

export class VerificationController {
  static async verifyFamilyRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const familyId = String(req.params.familyId);
      const family = await DbService.getFamilyById(familyId);

      if (!family) {
        res.status(404).json({
          success: false,
          message: `Family with ID "${familyId}" not found.`
        });
        return;
      }

      const members = await DbService.getMembersByFamilyId(familyId);
      const allFamilies = await DbService.getFamilies();
      const existingFlags = await DbService.getReviewFlagsByFamilyId(familyId);

      // Get all members across all families for cross-record duplicate checks
      const allMembersLists = await Promise.all(
        allFamilies.map(f => DbService.getMembersByFamilyId(f.id))
      );
      const allMembers = allMembersLists.flat();

      // 1. Run Data Validation
      const validationIssues = ValidationService.validateFamilyRecord(family, members);

      // 2. Run Duplicate Record Detection
      const possibleDuplicates = DuplicateService.findPossibleDuplicates(
        family,
        members,
        allFamilies,
        allMembers
      );

      // 3. Persist flags into Review Queue if not already recorded
      let newFlagsCreated = 0;

      for (const issue of validationIssues) {
        const alreadyFlagged = existingFlags.some(
          f => f.reason === issue.reason && f.status === 'pending'
        );
        if (!alreadyFlagged) {
          await DbService.createReviewFlag({
            family_id: familyId,
            member_id: issue.memberId || null,
            flag_type: issue.type,
            severity: issue.severity,
            reason: issue.reason,
            status: 'pending'
          });
          newFlagsCreated++;
        }
      }

      for (const dup of possibleDuplicates) {
        const alreadyFlagged = existingFlags.some(
          f => f.flag_type === 'possible_duplicate' && f.reason === dup.reason && f.status === 'pending'
        );
        if (!alreadyFlagged) {
          await DbService.createReviewFlag({
            family_id: familyId,
            flag_type: 'possible_duplicate',
            severity: 'warning',
            reason: dup.reason,
            status: 'pending'
          });
          newFlagsCreated++;
        }
      }

      // Determine overall status
      const hasCritical = validationIssues.some(i => i.severity === 'critical');
      const hasIssues = validationIssues.length > 0 || possibleDuplicates.length > 0;
      const overallStatus = hasCritical
        ? 'Critical Inconsistency'
        : hasIssues
          ? 'Needs Review'
          : 'Valid';

      const summary: VerificationSummary = {
        family_id: familyId,
        overall_status: overallStatus,
        missing_fields: validationIssues.filter(i => i.type === 'missing_field').map(i => i.reason),
        inconsistencies: validationIssues.filter(i => i.type === 'inconsistent_data').map(i => i.reason),
        possible_duplicates: possibleDuplicates,
        flags_created: newFlagsCreated,
        disclaimer: 'Record checks flag possible discrepancies for human review; they do not automatically reject an application.'
      };

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }
}
