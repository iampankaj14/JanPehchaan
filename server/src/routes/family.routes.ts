import { Router } from 'express';
import { FamilyController } from '../controllers/family.controller';
import { validateBody } from '../middleware/validate';
import {
  createFamilySchema,
  updateFamilySchema,
  createMemberSchema,
  updateMemberSchema
} from '../validators/schemas';

const router = Router();

// Household routes
router.get('/', FamilyController.getAllFamilies);
router.get('/:id', FamilyController.getFamilyById);
router.post('/', validateBody(createFamilySchema), FamilyController.createFamily);
router.put('/:id', validateBody(updateFamilySchema), FamilyController.updateFamily);
router.delete('/:id', FamilyController.deleteFamily);

// Member routes
router.post('/:id/members', validateBody(createMemberSchema), FamilyController.addMember);
router.put('/members/:memberId', validateBody(updateMemberSchema), FamilyController.updateMember);
router.delete('/members/:memberId', FamilyController.deleteMember);

export default router;
