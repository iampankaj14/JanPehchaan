import React, { useState, useEffect } from 'react';
import { X, FileCheck, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../../services/api';

export function ApplySchemeModal({ isOpen, onClose, schemeData, onApplied, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';

  const [bankAccount, setBankAccount] = useState('SBIN00049219827');
  const [remarks, setRemarks] = useState(
    isHindi ? 'लघु किसान / प्रत्यक्ष अधिकार श्रेणी के तहत आवेदन।' : 'Applying under small farmer / direct entitlement category.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isHindi) {
      setRemarks('लघु किसान / प्रत्यक्ष अधिकार श्रेणी के तहत आवेदन।');
    } else {
      setRemarks('Applying under small farmer / direct entitlement category.');
    }
  }, [isHindi]);

  if (!isOpen || !schemeData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        familyId: schemeData.familyId,
        schemeId: schemeData.schemeId,
        schemeName: schemeData.schemeName,
        beneficiaryName: schemeData.beneficiaryName,
        benefit: schemeData.benefit,
        bankAccount,
        remarks
      };

      await ApiService.submitApplication(payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onApplied(payload);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || (isHindi ? 'आवेदन जमा करने में विफल।' : 'Failed to submit application.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8FAFC',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileCheck size={18} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>
                {isHindi ? 'अधिकार दावा प्रस्तुत करें' : 'Submit Entitlement Claim'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                {isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT) सत्यापन' : 'Direct Benefit Transfer (DBT) Verification'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: '#0F172A' }}>
                {isHindi ? 'आवेदन सफलतापूर्वक जमा हो गया!' : 'Application Submitted Successfully!'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                {isHindi
                  ? 'दावा संदर्भ संख्या उत्पन्न हो गई। स्वचालित स्वीकृति हेतु सत्यापन अधिकारी को प्रेषित।'
                  : 'Claim reference generated. Sent to Verification Officer desk for automated release.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#B91C1C',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}

              {/* Scheme Summary Card */}
              <div style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>
                  {isHindi ? 'लक्षित योजना' : 'TARGET SCHEME'}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginTop: '0.15rem' }}>
                  {schemeData.schemeName}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, marginTop: '0.25rem' }}>
                  {isHindi ? 'लाभ:' : 'Benefit:'} {schemeData.benefit}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                  {isHindi ? 'परिवार आईडी:' : 'Household ID:'} <strong>{schemeData.familyId}</strong> • {isHindi ? 'लाभार्थी:' : 'Beneficiary:'} <strong>{schemeData.beneficiaryName}</strong>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isHindi ? 'आधार-लिंक बैंक खाता (DBT)' : 'Aadhaar-Linked Bank Account (DBT)'}
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="e.g. SBIN00012345678"
                />
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  {isHindi
                    ? '* डीबीटी राशि सीधे नागरिक के आधार-लिंक बैंक खाते में जमा की जाती है'
                    : '* DBT transfers are directly credited to citizen Aadhaar seeded account'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isHindi ? 'नागरिक घोषणा / विवरण' : 'Citizen Declaration / Notes'}
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-azure"
                  style={{ flex: 2 }}
                >
                  {submitting
                    ? (isHindi ? 'दावा प्रेषित हो रहा है...' : 'Submitting Claim...')
                    : (isHindi ? '✓ दावा सत्यापित व प्रेषित करें' : '✓ Confirm & Dispatch Claim')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplySchemeModal;
