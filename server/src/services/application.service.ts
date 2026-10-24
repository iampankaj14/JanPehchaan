import { Application, ApplicationStatus } from '../types';
import { NotificationService } from './notification.service';
import { DbService } from './db.service';
import { randomUUID } from 'crypto';

const initialApplications: Application[] = [
  {
    id: 'app_demo_01',
    referenceNo: 'JP-2026-NFSA-8812',
    applicantId: 'user_citizen_03',
    applicantName: 'Ramesh Kumar Sharma',
    applicantEmail: 'citizen@janpehchaan.in',
    applicantPhone: '9876543212',
    schemeId: 'sch_nfsa_ration',
    schemeCode: 'NFSA_RATION',
    schemeName: 'National Food Security Card (Sample)',
    householdId: 'fam_demo_101',
    householdHeadName: 'Ramesh Kumar Sharma',
    notes: 'Subsidised food grains under BPL entitlement.',
    status: 'APPROVED',
    duplicateFlag: false,
    duplicateReason: null,
    created_at: '2026-10-21T11:00:00Z',
    updated_at: '2026-10-22T09:30:00Z'
  },
  {
    id: 'app_demo_02',
    referenceNo: 'JP-2026-SCHOL-4401',
    applicantId: 'user_citizen_03',
    applicantName: 'Rohan Sharma (Student)',
    applicantEmail: 'rohan.sharma@example.com',
    applicantPhone: '9876543213',
    schemeId: 'sch_post_matric_scholarship',
    schemeCode: 'SCHOLARSHIP_POST_MATRIC',
    schemeName: 'Post-Matric Higher Education Scholarship (Sample)',
    householdId: 'fam_demo_101',
    householdHeadName: 'Ramesh Kumar Sharma',
    notes: 'Enrolled in 2nd year B.Sc. College student allowance.',
    status: 'UNDER_REVIEW',
    duplicateFlag: false,
    duplicateReason: null,
    created_at: '2026-10-22T14:00:00Z',
    updated_at: '2026-10-22T14:00:00Z'
  },
  {
    id: 'app_demo_03',
    referenceNo: 'JP-2026-NFSA-9904',
    applicantId: 'user_candidate_04',
    applicantName: 'Ramesh K Sharma',
    applicantEmail: 'ramesh.k@example.com',
    applicantPhone: '9876543214',
    schemeId: 'sch_nfsa_ration',
    schemeCode: 'NFSA_RATION',
    schemeName: 'National Food Security Card (Sample)',
    householdId: 'fam_demo_103',
    householdHeadName: 'Ramesh K Sharma',
    notes: 'Household claims food subsidy.',
    status: 'FLAGGED_DUPLICATE',
    duplicateFlag: true,
    duplicateReason: 'Possible duplicate claim: Similar applicant name and locality to approved record JP-2026-NFSA-8812. Officer review required.',
    created_at: '2026-10-23T08:15:00Z',
    updated_at: '2026-10-23T08:15:00Z'
  }
];

let applicationsStore: Application[] = JSON.parse(JSON.stringify(initialApplications));

export class ApplicationService {
  static async getAll(userRole: string, applicantId?: string): Promise<Application[]> {
    if (userRole === 'CITIZEN' && applicantId) {
      return applicationsStore.filter(a => a.applicantId === applicantId);
    }
    // Staff & Admin see all applications
    return applicationsStore;
  }

  static async getById(id: string): Promise<Application | null> {
    return applicationsStore.find(a => a.id === id) || null;
  }

  static async create(data: {
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone?: string;
    schemeId: string;
    householdId?: string | null;
    notes?: string;
  }): Promise<Application> {
    const scheme = (await DbService.getSchemes()).find(s => s.id === data.schemeId);
    if (!scheme) throw new Error('Scheme not found');

    const household = data.householdId ? await DbService.getFamilyById(data.householdId) : null;

    // Duplicate check: Check if same scheme already submitted for this household
    const existing = applicationsStore.find(
      a => a.schemeId === data.schemeId &&
           a.householdId && data.householdId &&
           a.householdId === data.householdId &&
           a.status !== 'REJECTED'
    );

    const duplicateFlag = Boolean(existing);
    const referenceNo = `JP-${new Date().getFullYear()}-${scheme.code.slice(0, 5)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: Application = {
      id: `app_${randomUUID().slice(0, 8)}`,
      referenceNo,
      applicantId: data.applicantId,
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail,
      applicantPhone: data.applicantPhone,
      schemeId: scheme.id,
      schemeCode: scheme.code,
      schemeName: scheme.scheme_name,
      householdId: data.householdId || null,
      householdHeadName: household?.family_head_name || null,
      notes: data.notes || null,
      status: duplicateFlag ? 'FLAGGED_DUPLICATE' : 'SUBMITTED',
      duplicateFlag,
      duplicateReason: duplicateFlag ? `Matching application already active for this household (${existing?.referenceNo}). Review required.` : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    applicationsStore.unshift(newApp);

    // If duplicate flagged, also register in review flags
    if (duplicateFlag && data.householdId) {
      await DbService.createReviewFlag({
        family_id: data.householdId,
        flag_type: 'possible_duplicate',
        severity: 'warning',
        reason: `Application ${referenceNo} flagged as possible duplicate of active claim ${existing?.referenceNo}.`,
        status: 'pending'
      });
    }

    return newApp;
  }

  static async review(id: string, status: ApplicationStatus, notes: string, reviewerName: string): Promise<Application | null> {
    const app = applicationsStore.find(a => a.id === id);
    if (!app) return null;

    const previousStatus = app.status;
    app.status = status;
    app.updated_at = new Date().toISOString();
    if (notes) app.notes = notes;
    if (status !== 'FLAGGED_DUPLICATE') {
      app.duplicateFlag = false;
    }

    // Log to audit log
    await DbService.createChangeLog({
      entity_type: 'family',
      entity_id: app.householdId || app.id,
      field_name: `application_status_${app.referenceNo}`,
      old_value: previousStatus,
      new_value: status,
      changed_by: reviewerName
    });

    // Dispatch simulated notification
    await NotificationService.notifyApplicationStatus(app, status, notes);

    return app;
  }

  static async getDuplicateQueue(): Promise<Application[]> {
    return applicationsStore.filter(a => a.duplicateFlag || a.status === 'FLAGGED_DUPLICATE');
  }

  static getCount(): number {
    return applicationsStore.length;
  }

  static getFlaggedCount(): number {
    return applicationsStore.filter(a => a.duplicateFlag || a.status === 'FLAGGED_DUPLICATE').length;
  }

  static getPendingCount(): number {
    return applicationsStore.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'FLAGGED_DUPLICATE'].includes(a.status)).length;
  }
}
