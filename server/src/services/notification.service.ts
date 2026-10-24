import { Application } from '../types';

export class NotificationService {
  /**
   * Notifies an applicant about status changes (e.g. Approved, Flagged, Under Review).
   */
  static async notifyApplicationStatus(
    application: Application,
    newStatus: string,
    notes?: string
  ): Promise<{ sent: boolean; channel: string; summary: string }> {
    const recipientEmail = application.applicantEmail || 'applicant@example.com';
    const recipientPhone = application.applicantPhone || '+91 98765 43210';
    const reference = application.referenceNo;

    const emailSubject = `JanPehchaan Update: Application ${reference} is ${newStatus}`;
    const emailBody = `Dear ${application.applicantName},\nYour application for "${application.schemeName}" (Ref: ${reference}) status has been updated to: ${newStatus}.\n${notes ? `Reviewer remarks: ${notes}\n` : ''}Log in to JanPehchaan portal for details.`;

    console.log(`\n🔔 ==================== NOTIFICATION DISPATCH ====================`);
    console.log(`   Type: Application Status Update [${newStatus}]`);
    console.log(`   To: ${application.applicantName} <${recipientEmail}> | Phone: ${recipientPhone}`);
    console.log(`   Subject: ${emailSubject}`);
    console.log(`   Status: Simulated Email & SMS Successfully Delivered`);
    console.log(`===================================================================\n`);

    return {
      sent: true,
      channel: 'email+sms',
      summary: `Alert dispatched to ${recipientEmail}`
    };
  }
}
