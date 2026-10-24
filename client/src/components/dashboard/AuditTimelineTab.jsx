import React, { useState } from 'react';
import { History, Shield, CheckCircle2, Clock, User, FileText, Filter } from 'lucide-react';

export function AuditTimelineTab({ auditLogs = [], currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const [filter, setFilter] = useState('ALL');

  const defaultLogs = [
    {
      id: 'AUD-901',
      action: 'ENTITLEMENT_CLAIM_APPROVED',
      actionHi: 'पात्रता दावा स्वीकृत',
      actor: 'Officer Suresh Verma (Verification Desk)',
      actorHi: 'अधिकारी सुरेश वर्मा (सत्यापन डेस्क)',
      target: 'PM-KISAN Claim (Sharma Family - FAM-101)',
      targetHi: 'पीएम-किसान दावा (शर्मा परिवार - FAM-101)',
      details: 'Automated land record & Aadhaar e-KYC cross-verification passed. 1st installment released.',
      detailsHi: 'स्वचालित भूमि रिकॉर्ड और आधार ई-केवाईसी सत्यापन सफल। पहली किस्त जारी की गई।',
      time: '10 mins ago',
      timeHi: '10 मिनट पहले',
      type: 'VERIFICATION',
      typeHi: 'सत्यापन'
    },
    {
      id: 'AUD-902',
      action: 'CANDIDATE_DUPLICATE_FLAGGED',
      actionHi: 'संभावित डुप्लिकेट चिह्नित',
      actor: 'System Deduplication Engine',
      actorHi: 'सिस्टम डुप्लिकेशन निवारण इंजन',
      target: 'Ramesh K Sharma (FAM-104) vs (FAM-101)',
      targetHi: 'रमेश के शर्मा (FAM-104) बनाम (FAM-101)',
      details: 'Fuzzy Levenshtein score 0.94 triggered review threshold (>= 0.85). Routed to Officer Queue.',
      detailsHi: 'फ़ज़ी लेवेनश्टाइन स्कोर 0.94 ने समीक्षा सीमा (>= 0.85) को सक्रिय किया। अधिकारी समीक्षा कतार में भेजा गया।',
      time: '42 mins ago',
      timeHi: '42 मिनट पहले',
      type: 'SECURITY',
      typeHi: 'सुरक्षा'
    },
    {
      id: 'AUD-903',
      action: 'FAMILY_ENROLMENT_COMPLETED',
      actionHi: 'परिवार नामांकन पूर्ण',
      actor: 'Citizen Self-Service Portal',
      actorHi: 'नागरिक स्व-सेवा पोर्टल',
      target: 'Sunita Devi Meena Household (FAM-102)',
      targetHi: 'सुनीता देवी मीना परिवार (FAM-102)',
      details: 'Enrolled with 3 verified family members. Linked to SECC Socio-Economic Database.',
      detailsHi: '3 सत्यापित परिवार सदस्यों के साथ नामांकित। एसईसीसी सामाजिक-आर्थिक डेटाबेस से लिंक किया गया।',
      time: '2 hours ago',
      timeHi: '2 घंटे पहले',
      type: 'ENROLMENT',
      typeHi: 'नामांकन'
    },
    {
      id: 'AUD-904',
      action: 'DATA_QUALITY_RULE_TRIGGERED',
      actionHi: 'डेटा गुणवत्ता नियम सक्रिय',
      actor: 'Validation Service (Kinship Graph)',
      actorHi: 'सत्यापन सेवा (पारिवारिक संबंध आरेख)',
      target: 'Verma Family (FAM-103)',
      targetHi: 'वर्मा परिवार (FAM-103)',
      details: 'Warning: Age discrepancy between head and first dependent checked. Verified with birth certificate.',
      detailsHi: 'चेतावनी: मुखिया और पहले आश्रित के बीच आयु विसंगति की जांच की गई। जन्म प्रमाण पत्र से सत्यापित।',
      time: 'Yesterday, 04:15 PM',
      timeHi: 'कल, 04:15 अपराह्न',
      type: 'SECURITY',
      typeHi: 'सुरक्षा'
    }
  ];

  const logsToDisplay = auditLogs.length > 0 ? auditLogs : defaultLogs;

  const filteredLogs = logsToDisplay.filter((l) => {
    if (filter === 'ALL') return true;
    return l.type === filter;
  });

  const filterTabs = [
    { key: 'ALL', label: isHindi ? 'सभी' : 'ALL' },
    { key: 'VERIFICATION', label: isHindi ? 'सत्यापन' : 'VERIFICATION' },
    { key: 'SECURITY', label: isHindi ? 'सुरक्षा' : 'SECURITY' },
    { key: 'ENROLMENT', label: isHindi ? 'नामांकन' : 'ENROLMENT' }
  ];

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0' }}>{isHindi ? 'ऑडिट व संचालन समयरेखा' : 'Audit & Operations Timeline'}</h2>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.875rem' }}>
            {isHindi ? 'छेड़छाड़-मुक्त कालानुक्रमिक गतिविधि बहीखाता, जो प्रत्येक नामांकन, अधिकारी समीक्षा और कल्याण दावे को ट्रैक करता है।' : 'Tamper-evident chronological activity ledger tracking every enrolment, officer override, and welfare claim.'}
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {filterTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`btn btn-sm ${filter === t.key ? 'btn-primary' : 'btn-outline'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
          {/* Vertical timeline line */}
          <div style={{
            position: 'absolute',
            left: '7px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            background: '#E2E8F0'
          }} />

          {filteredLogs.map((log, idx) => (
            <div key={log.id || idx} style={{ position: 'relative', marginBottom: '1.5rem' }}>
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute',
                left: '-1.5rem',
                top: '4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: log.type === 'SECURITY' ? '#EF4444' : log.type === 'VERIFICATION' ? '#10B981' : '#0A84FF',
                border: '3px solid #FFFFFF',
                boxShadow: '0 0 0 1px #CBD5E1'
              }} />

              {/* Event Content Box */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                      {isHindi ? (log.actionHi || log.action.replace(/_/g, ' ')) : log.action.replace(/_/g, ' ')}
                    </span>
                    <span className={`badge ${log.type === 'SECURITY' ? 'badge-error' : log.type === 'VERIFICATION' ? 'badge-success' : 'badge-azure'}`} style={{ fontSize: '0.65rem' }}>
                      {isHindi ? (log.typeHi || log.type) : log.type}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#64748B' }}>
                    <Clock size={12} />
                    <span>{isHindi ? (log.timeHi || log.time) : log.time}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E3A8A', marginBottom: '0.25rem' }}>
                  {isHindi ? (log.targetHi || log.target) : log.target}
                </div>

                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8125rem', color: '#475569' }}>
                  {isHindi ? (log.detailsHi || log.details) : log.details}
                </p>

                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                  {isHindi ? 'लॉगकर्ता: ' : 'Logged by: '}<strong>{isHindi ? (log.actorHi || log.actor) : log.actor}</strong> • {isHindi ? 'संदर्भ: ' : 'Reference: '}{log.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuditTimelineTab;
