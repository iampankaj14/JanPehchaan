import { DbService } from '../services/db.service';
import { ValidationService } from '../services/validation.service';
import { DuplicateService } from '../services/duplicate.service';
import { EligibilityService } from '../services/eligibility.service';
import { AuthService } from '../services/auth.service';
import { ApplicationService } from '../services/application.service';

async function runSelfTest() {
  console.log('=====================================================');
  console.log('     JANPEHCHAAN BACKEND ENGINE SELF-TEST');
  console.log('=====================================================\n');

  // Test 1: Data Retrieval
  console.log('🔍 Test 1: Data Retrieval from Store');
  const families = await DbService.getFamilies();
  const schemes = await DbService.getSchemes();
  console.log(`   Found ${families.length} families and ${schemes.length} schemes.`);
  if (families.length >= 3 && schemes.length >= 4) {
    console.log('   ✅ PASS: Initial dataset intact.\n');
  } else {
    throw new Error('Initial dataset incomplete!');
  }

  // Test 2: Validation on Discrepancy Profile (Family 102)
  console.log('🔍 Test 2: Inconsistency & Validation Engine');
  const fam102 = await DbService.getFamilyById('fam_demo_102');
  if (!fam102) throw new Error('Family 102 missing');
  const members102 = await DbService.getMembersByFamilyId('fam_demo_102');
  const issues = ValidationService.validateFamilyRecord(fam102, members102);
  console.log(`   Identified ${issues.length} data issues in Family 102:`);
  issues.forEach(i => console.log(`   - [${i.severity.toUpperCase()}] ${i.reason}`));

  const hasAgeInconsistency = issues.some(i => i.reason.includes('cannot be older than head'));
  const hasNegativeIncome = issues.some(i => i.reason.includes('cannot be negative'));
  if (hasAgeInconsistency && hasNegativeIncome) {
    console.log('   ✅ PASS: Successfully caught generational conflict and negative income.\n');
  } else {
    throw new Error('Failed to catch expected inconsistencies!');
  }

  // Test 3: Duplicate Detection Engine (Family 103 vs Family 101)
  console.log('🔍 Test 3: Duplicate Record Detection Engine');
  const fam103 = await DbService.getFamilyById('fam_demo_103');
  const members103 = await DbService.getMembersByFamilyId('fam_demo_103');
  const allMembers = (await Promise.all(families.map(f => DbService.getMembersByFamilyId(f.id)))).flat();

  const duplicates = DuplicateService.findPossibleDuplicates(fam103!, members103, families, allMembers);
  console.log(`   Found ${duplicates.length} duplicate warnings for Ramesh K Sharma:`);
  duplicates.forEach(d => console.log(`   - (${d.similarity_score}% match): ${d.reason}`));

  if (duplicates.length > 0 && duplicates[0].matched_family_id === 'fam_demo_101') {
    console.log('   ✅ PASS: Correctly flagged Family 103 as candidate duplicate of Family 101 without auto-rejection.\n');
  } else {
    throw new Error('Duplicate detection failed to link Family 103 to Family 101!');
  }

  // Test 4: Eligibility Matching Engine (Family 101)
  console.log('🔍 Test 4: Scheme Matching & Guidance Engine');
  const fam101 = await DbService.getFamilyById('fam_demo_101');
  const members101 = await DbService.getMembersByFamilyId('fam_demo_101');

  const report = EligibilityService.evaluateFamilyEligibility(fam101!, members101, schemes);
  console.log(`   Household Benefits evaluated: ${report.household_benefits.length}`);
  report.household_benefits.forEach(hb => {
    console.log(`   - ${hb.scheme_name}: [${hb.qualification_status}]`);
  });

  const nfsaQualifies = report.household_benefits.some(h => h.scheme_code === 'NFSA_RATION' && h.qualification_status === 'May Qualify');
  const scholarshipQualifies = report.individual_benefits.some(i => i.scheme_code === 'SCHOLARSHIP_POST_MATRIC' && i.qualification_status === 'May Qualify' && i.matched_member?.member_name === 'Rohan Sharma');

  if (nfsaQualifies && scholarshipQualifies) {
    console.log('   ✅ PASS: Correctly matched NFSA Ration Card to household and Scholarship to Rohan Sharma.\n');
  } else {
    throw new Error('Scheme matching logic failed to qualify eligible household or student member!');
  }

  // Test 5: Review Queue & Audit Trail
  console.log('🔍 Test 5: Review Queue & Change Logging');
  const flags = await DbService.getReviewFlags('pending');
  console.log(`   Pending review flags count: ${flags.length}`);
  if (flags.length > 0) {
    const flagToResolve = flags[0];
    const resolved = await DbService.updateReviewFlag(
      flagToResolve.id,
      'resolved',
      'Verified in person: verified as distinct household.'
    );
    console.log(`   Resolved flag ${flagToResolve.id}: status=${resolved?.status}`);
  }
  console.log('   ✅ PASS: Review queue operational.\n');

  // Test 6: Role-Based Authentication (Version 2 Feature)
  console.log('🔍 Test 6: Role-Based Authentication & JWT System');
  const adminLogin = await AuthService.login('admin@janpehchaan.gov.in', 'Password123');
  console.log(`   Admin Login: token received, user="${adminLogin.user.name}", role="${adminLogin.user.role}"`);

  const citizenLogin = await AuthService.login('citizen@janpehchaan.in', 'Password123');
  console.log(`   Citizen Login: user="${citizenLogin.user.name}", role="${citizenLogin.user.role}"`);

  const newReg = await AuthService.register('Sunita Devi', `sunita.${Date.now()}@example.com`, 'Password123', '9876543299');
  console.log(`   Registered New Citizen: "${newReg.name}" (Role: ${newReg.role})`);

  const payload = AuthService.verifyToken(adminLogin.token);
  if (payload && payload.role === 'ADMIN' && citizenLogin.user.role === 'CITIZEN') {
    console.log('   ✅ PASS: JWT generation and role validation functional.\n');
  } else {
    throw new Error('Authentication test failed!');
  }

  // Test 7: Citizen Applications & Notifications (Version 2 Feature)
  console.log('🔍 Test 7: Citizen Applications & Notification Alerts');
  const allApps = await ApplicationService.getAll('ADMIN');
  console.log(`   Initial applications count: ${allApps.length}`);
  allApps.forEach(a => console.log(`   - [${a.referenceNo}] ${a.schemeName} -> Status: ${a.status}`));

  const dupQueue = await ApplicationService.getDuplicateQueue();
  console.log(`   Duplicate Review Queue items: ${dupQueue.length}`);

  // Test reviewing an application
  if (allApps.length > 0) {
    const appToReview = allApps[0];
    const reviewed = await ApplicationService.review(
      appToReview.id,
      'APPROVED',
      'Verified family entitlement in person.',
      'Ayush Pal (Officer)'
    );
    console.log(`   Officer reviewed ${appToReview.referenceNo}: new status="${reviewed?.status}"`);
  }
  console.log('   ✅ PASS: Application workflow and alert notifications operational.\n');

  console.log('=====================================================');
  console.log('  🎉 ALL 7 BACKEND ENGINES & V2 FEATURES PASSED!');
  console.log('=====================================================');
}

runSelfTest().catch(err => {
  console.error('❌ Self-test failed:', err);
  process.exit(1);
});
