import React, { useState } from 'react';
import { GitMerge, Check, X, ShieldAlert, ArrowRight, UserCheck, AlertCircle, FileSearch } from 'lucide-react';
import { ApiService } from '../../services/api';

export function DuplicateReviewTab({ duplicates = [], onActionComplete, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const [activeList, setActiveList] = useState(
    duplicates.length > 0
      ? duplicates
      : [
          {
            id: 'DUP-201',
            score: 0.92,
            confidence: '92% Similarity (High)',
            confidenceHi: '92% समानता (उच्च)',
            recordA: {
              id: 'FAM-101',
              headName: 'Ramesh Kumar Sharma',
              fatherName: 'Gopal Sharma',
              dob: '1976-04-12',
              phone: '9876543210',
              address: 'Plot 12, Ward 4, Rampur, Jaipur',
              aadhaarLast4: '4921',
              annualIncome: 120000
            },
            recordB: {
              id: 'FAM-104',
              headName: 'Ramesh K Sharma',
              fatherName: 'Gopal Sharma',
              dob: '1976-04-12',
              phone: '9876543210',
              address: 'Plt 12, Wrd 4, Rampur, Jaipur',
              aadhaarLast4: '4921',
              annualIncome: 120000
            },
            matchingReasons: [
              'Identical Phone Number: 9876543210',
              'Levenshtein Name Similarity: 0.94 (Ramesh Kumar Sharma ≈ Ramesh K Sharma)',
              'Matching Father Name: Gopal Sharma',
              'Identical Date of Birth: 12 Apr 1976'
            ],
            matchingReasonsHi: [
              'समान मोबाइल नंबर: 9876543210',
              'लेवेनश्टाइन नाम समानता: 0.94 (Ramesh Kumar Sharma ≈ Ramesh K Sharma)',
              'पिता का नाम मेल खाता है: Gopal Sharma',
              'समान जन्म तिथि: 12 अप्रैल 1976'
            ]
          }
        ]
  );

  const [resolvingId, setResolvingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleResolve = async (duplicateId, resolutionType) => {
    setResolvingId(duplicateId);
    setSuccessMessage('');

    // Simulate resolution update
    setTimeout(() => {
      setActiveList((prev) => prev.filter((d) => d.id !== duplicateId));
      setResolvingId(null);
      setSuccessMessage(
        resolutionType === 'MERGE'
          ? (isHindi ? 'रिकॉर्ड मुख्य प्रोफ़ाइल में सफलतापूर्वक मर्ज कर दिया गया!' : 'Record successfully merged into Master Profile! Audit log updated.')
          : (isHindi ? 'सत्यापित विशिष्ट परिवार के रूप में चिह्नित।' : 'Marked as Verified Distinct Household. Flag cleared.')
      );
      if (onActionComplete) onActionComplete();
    }, 700);
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0' }}>{isHindi ? 'डुप्लीकेट समीक्षा कतार' : 'Deduplication Review Queue'}</h2>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.875rem' }}>
            {isHindi ? 'फ़ज़ी लेवेनश्टाइन मैचिंग वास्तविक नागरिकों को बहिष्करण से बचाते हुए डुप्लीकेट प्रविष्टियों को रोकती है।' : 'Fuzzy Levenshtein matching prevents duplicate enrolments while protecting genuine citizens from wrongful exclusion.'}
          </p>
        </div>
        <span className="badge badge-warning" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
          {isHindi ? `${activeList.length} समीक्षा लंबित` : `${activeList.length} Inconsistencies Pending`}
        </span>
      </div>

      {successMessage && (
        <div style={{
          padding: '0.875rem 1.25rem',
          borderRadius: '8px',
          background: '#DCFCE7',
          border: '1px solid #BBF7D0',
          color: '#15803D',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {activeList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <UserCheck size={48} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: '#0F172A' }}>
            {isHindi ? 'समीक्षा कतार साफ है — कोई लंबित डुप्लीकेट नहीं' : 'Queue Clean — Zero Pending Duplicates'}
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
            {isHindi ? 'सभी नागरिक और पारिवारिक रिकॉर्ड सत्यापित और निस्तारित किए जा चुके हैं।' : 'All citizen and household records have been resolved and cross-verified.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeList.map((item) => (
            <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
              {/* Queue Item Topbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-error">
                    <ShieldAlert size={13} />
                    {isHindi ? 'संभावित डुप्लीकेट फ्लैग' : 'Candidate Duplicate Flag'}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                    {isHindi ? 'कतार आईडी: ' : 'Queue ID: '}<strong>{item.id}</strong>
                  </span>
                </div>
                <div className="badge badge-warning" style={{ fontWeight: 700 }}>
                  {isHindi ? (item.confidenceHi || item.confidence) : item.confidence}
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Record A */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                      {isHindi ? 'मूल नामांकन' : 'Original Enrolment'}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>ID: {item.recordA.id}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.25rem' }}>
                    {item.recordA.headName}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
                    <div><strong>{isHindi ? 'पिता: ' : 'Father: '}</strong>{item.recordA.fatherName}</div>
                    <div><strong>{isHindi ? 'जन्म तिथि: ' : 'DOB: '}</strong>{item.recordA.dob}</div>
                    <div><strong>{isHindi ? 'मोबाइल: ' : 'Phone: '}</strong>{item.recordA.phone}</div>
                    <div><strong>{isHindi ? 'पता: ' : 'Address: '}</strong>{item.recordA.address}</div>
                    <div><strong>{isHindi ? 'आधार: ' : 'Aadhaar: '}</strong>XXXX-XXXX-{item.recordA.aadhaarLast4}</div>
                  </div>
                </div>

                {/* Record B */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                      {isHindi ? 'नया प्राप्त आवेदन' : 'New Incoming Submission'}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400E' }}>ID: {item.recordB.id}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#92400E', marginBottom: '0.25rem' }}>
                    {item.recordB.headName}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#78350F', lineHeight: 1.6 }}>
                    <div><strong>{isHindi ? 'पिता: ' : 'Father: '}</strong>{item.recordB.fatherName}</div>
                    <div><strong>{isHindi ? 'जन्म तिथि: ' : 'DOB: '}</strong>{item.recordB.dob}</div>
                    <div><strong>{isHindi ? 'मोबाइल: ' : 'Phone: '}</strong>{item.recordB.phone}</div>
                    <div><strong>{isHindi ? 'पता: ' : 'Address: '}</strong>{item.recordB.address}</div>
                    <div><strong>{isHindi ? 'आधार: ' : 'Aadhaar: '}</strong>XXXX-XXXX-{item.recordB.aadhaarLast4}</div>
                  </div>
                </div>
              </div>

              {/* Matching Reasoning Points */}
              <div style={{ background: '#F1F5F9', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isHindi ? 'एल्गोरिदम तुलना रिपोर्ट:' : 'Algorithmic Comparison Report:'}
                </div>
                {(isHindi ? (item.matchingReasonsHi || item.matchingReasons) : item.matchingReasons)?.map((r, rIdx) => (
                  <div key={rIdx} style={{ color: '#475569', marginBottom: '0.2rem' }}>
                    • {r}
                  </div>
                ))}
              </div>

              {/* Officer Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  disabled={resolvingId === item.id}
                  onClick={() => handleResolve(item.id, 'DISTINCT')}
                  className="btn btn-outline btn-sm"
                >
                  <X size={14} color="#64748B" />
                  <span>{isHindi ? 'विशिष्ट परिवार के रूप में चिह्नित करें' : 'Mark as Distinct Household'}</span>
                </button>

                <button
                  disabled={resolvingId === item.id}
                  onClick={() => alert(isHindi ? `वार्ड 4 के पंचायत सचिव को भौतिक सत्यापन भेजा गया।` : `Physical verification dispatched to Panchayat Secretary for Ward 4.`)}
                  className="btn btn-outline btn-sm"
                >
                  <FileSearch size={14} color="#0A84FF" />
                  <span>{isHindi ? 'स्थलीय सत्यापन का अनुरोध करें' : 'Request Field Verification'}</span>
                </button>

                <button
                  disabled={resolvingId === item.id}
                  onClick={() => handleResolve(item.id, 'MERGE')}
                  className="btn btn-azure btn-sm"
                >
                  <GitMerge size={14} />
                  <span>{resolvingId === item.id ? (isHindi ? 'मर्ज हो रहा है...' : 'Merging...') : (isHindi ? 'रिकॉर्ड मर्ज करें व प्रोफ़ाइल एकीकृत करें' : 'Merge Records & Unify Profile')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DuplicateReviewTab;
