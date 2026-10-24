import React, { useState } from 'react';
import {
  LayoutGrid,
  FileText,
  Calendar,
  CreditCard,
  MessageSquareWarning,
  Award,
  FolderLock,
  Headphones,
  Settings,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Plus
} from 'lucide-react';

export function PortalModulesTab({ tab, user, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceSent, setGrievanceSent] = useState(false);

  // 1. SERVICES
  if (tab === 'services') {
    const services = [
      {
        title: 'Family Head Update',
        titleHi: 'परिवार मुखिया अद्यतन',
        desc: 'Request succession or change in household head record',
        descHi: 'परिवार रजिस्टर में मुखिया परिवर्तन अथवा उत्तराधिकार हेतु अनुरोध',
        dept: 'Revenue Dept',
        deptHi: 'राजस्व विभाग',
        fee: 'Free',
        feeHi: 'निःशुल्क',
        status: 'Online',
        statusHi: 'ऑनलाइन'
      },
      {
        title: 'Ration Card Category Review',
        titleHi: 'राशन कार्ड श्रेणी पुनरीक्षण',
        desc: 'Apply for Antyodaya (AAY) or BPL priority quota',
        descHi: 'अंत्योदय (एएवाई) अथवा बीपीएल प्राथमिकता कोटे हेतु आवेदन करें',
        dept: 'Food & Civil Supplies',
        deptHi: 'खाद्य एवं नागरिक आपूर्ति',
        fee: 'Free',
        feeHi: 'निःशुल्क',
        status: 'Online',
        statusHi: 'ऑनलाइन'
      },
      {
        title: 'Land Record Sync (Bhulekh)',
        titleHi: 'भूलेख भूमि रिकॉर्ड सिंक',
        desc: 'Link agricultural land parcel with JanPehchaan ID',
        descHi: 'कृषि भूमि गाटा संख्या को जनपहचान आईडी से लिंक करें',
        dept: 'Land Revenue',
        deptHi: 'भू-राजस्व',
        fee: 'Free',
        feeHi: 'निःशुल्क',
        status: 'Instant',
        statusHi: 'त्वरित'
      },
      {
        title: 'Disability Certificate Seeding',
        titleHi: 'दिव्यांग प्रमाण पत्र सीडिंग',
        desc: 'Add UDID certificate for special welfare quotas',
        descHi: 'विशेष कल्याणकारी लाभ हेतु यूडीआईडी प्रमाण पत्र जोड़ें',
        dept: 'Social Justice',
        deptHi: 'सामाजिक न्याय',
        fee: 'Free',
        feeHi: 'निःशुल्क',
        status: 'Online',
        statusHi: 'ऑनलाइन'
      },
      {
        title: 'Old Age Pension Enrolment',
        titleHi: 'वृद्धावस्था पेंशन नामांकन',
        desc: 'Automatic safety net pension for elders above 60',
        descHi: '60 वर्ष से अधिक आयु के वरिष्ठ नागरिकों हेतु सामाजिक सुरक्षा पेंशन',
        dept: 'Social Welfare',
        deptHi: 'समाज कल्याण',
        fee: 'Free',
        feeHi: 'निःशुल्क',
        status: 'Automated',
        statusHi: 'स्वचालित'
      },
      {
        title: 'Student Scholarship Verification',
        titleHi: 'छात्रवृत्ति सत्यापन',
        desc: 'Pre-matric and post-matric fee reimbursement',
        descHi: 'पूर्व-दशम एवं दशमोत्तर छात्रवृत्ति व शुल्क प्रतिपूर्ति',
        dept: 'Higher Education',
        deptHi: 'उच्च शिक्षा',
        fee: 'Free',
        feeHi: 'निःशुल्क',
        status: 'Active',
        statusHi: 'सक्रिय'
      },
    ];

    return (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            {isHindi ? 'सरकारी नागरिक सेवाएं' : 'Government Citizen Services'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
            {isHindi ? 'जनपहचान रजिस्टर से एकीकृत प्रत्यक्ष 1-क्लिक नागरिक सेवाएं' : 'Direct 1-click citizen services integrated with JanPehchaan registry'}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {services.map((s, idx) => (
            <div key={idx} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#EFF6FF', color: '#1D4ED8', borderRadius: '9999px', fontWeight: 700 }}>
                    {isHindi ? s.deptHi : s.dept}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>
                    ● {isHindi ? s.statusHi : s.status}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 0.35rem 0', color: '#0F172A', fontSize: '0.95rem' }}>
                  {isHindi ? s.titleHi : s.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                  {isHindi ? s.descHi : s.desc}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                onClick={() => alert(isHindi ? `"${s.titleHi}" के लिए सेवा अनुरोध दर्ज किया गया।` : `Service request for "${s.title}" initiated.`)}
              >
                <span>{isHindi ? 'सेवा हेतु आवेदन करें' : 'Apply Service'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. APPLICATIONS
  if (tab === 'applications') {
    const apps = [
      {
        id: 'APP-88210',
        title: 'PM-KISAN Samman Nidhi',
        titleHi: 'पीएम-किसान सम्मान निधि',
        date: '21 Oct 2026',
        dateHi: '21 अक्टू 2026',
        status: 'Approved',
        statusHi: 'स्वीकृत',
        amount: '₹6,000/yr',
        amountHi: '₹6,000/वर्ष'
      },
      {
        id: 'APP-77291',
        title: 'National Food Security (NFSA)',
        titleHi: 'राष्ट्रीय खाद्य सुरक्षा (एनएफएसए)',
        date: '18 Oct 2026',
        dateHi: '18 अक्टू 2026',
        status: 'Under Review',
        statusHi: 'समीक्षाधीन',
        amount: '35 kg Foodgrain',
        amountHi: '35 किग्रा खाद्यान्न'
      },
      {
        id: 'APP-66210',
        title: 'Ayushman Bharat PM-JAY',
        titleHi: 'आयुष्मान भारत पीएम-जेएवाई',
        date: '12 Oct 2026',
        dateHi: '12 अक्टू 2026',
        status: 'Active Card',
        statusHi: 'सक्रिय कार्ड',
        amount: '₹5,00,000 Cover',
        amountHi: '₹5,00,000 सुरक्षा'
      }
    ];

    return (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            {isHindi ? 'मेरे आवेदन व दावे' : 'My Applications & Claims'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
            {isHindi ? 'प्रस्तुत सभी कल्याणकारी योजना दावों की वास्तविक समय स्थिति ट्रैक करें' : 'Track the real-time status of all submitted welfare scheme claims'}
          </p>
        </div>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <tr>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>{isHindi ? 'आवेदन आईडी' : 'Application ID'}</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>{isHindi ? 'योजना का नाम' : 'Scheme Name'}</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>{isHindi ? 'जमा तिथि' : 'Submission Date'}</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>{isHindi ? 'पात्रता लाभ' : 'Entitlement Benefit'}</th>
                <th style={{ padding: '0.85rem 1.25rem', color: '#475569', fontWeight: 700 }}>{isHindi ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0A84FF' }}>{a.id}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#0F172A' }}>{isHindi ? a.titleHi : a.title}</td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#64748B' }}>{isHindi ? a.dateHi : a.date}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#10B981' }}>{isHindi ? a.amountHi : a.amount}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: a.status === 'Approved' || a.status === 'Active Card' ? '#DCFCE7' : '#FEF3C7',
                      color: a.status === 'Approved' || a.status === 'Active Card' ? '#166534' : '#92400E'
                    }}>
                      {isHindi ? a.statusHi : a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. APPOINTMENTS
  if (tab === 'appointments') {
    return (
      <div>
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
              {isHindi ? 'सेवा व सत्यापन नियुक्तियां' : 'Service & Verification Appointments'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
              {isHindi ? 'घर बैठे बायोमेट्रिक अथवा तहसील शिविर नियुक्तियों का समय निर्धारित करें' : 'Schedule doorstep biometric or tehsil camp appointments'}
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => alert(isHindi ? 'नया अपॉइंटमेंट बुकिंग कैलेंडर खोला गया।' : 'New appointment booking calendar opened.')}>
            <Plus size={14} />
            <span>{isHindi ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}</span>
          </button>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Clock size={40} color="#0A84FF" style={{ margin: '0 auto 0.75rem auto' }} />
          <h4 style={{ margin: '0 0 0.35rem 0', color: '#0F172A' }}>
            {isHindi ? 'अगला डोरस्टेप शिविर: 28 अक्टूबर 2026' : 'Next Doorstep Camp: 28 October 2026'}
          </h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.825rem', color: '#64748B' }}>
            {isHindi ? 'स्थान: रामपुर ग्राम पंचायत केंद्र, जयपुर ज़िला (समय: प्रातः 10:00 - दोपहर 1:00)' : 'Location: Rampur Gram Panchayat Kendra, Jaipur District (Slot: 10:00 AM - 1:00 PM)'}
          </p>
          <span style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700 }}>
            {isHindi ? 'टोकन # JP-CAMP-042 पुष्टीकृत' : 'Token # JP-CAMP-042 Confirmed'}
          </span>
        </div>
      </div>
    );
  }

  // 4. PAYMENTS (DBT)
  if (tab === 'payments') {
    return (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            {isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT) बहीखाता' : 'Direct Benefit Transfer (DBT) Ledger'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
            {isHindi ? 'सत्यापित आधार-लिंक बैंक खाते में सीधे जमा पारदर्शी कल्याणकारी धनराशि' : 'Transparent welfare funds deposited directly to verified Aadhaar-seeded bank account'}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>{isHindi ? 'कुल प्राप्त राशि (वित्त वर्ष 2026)' : 'TOTAL RECEIVED (FY 2026)'}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>₹18,000</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>{isHindi ? 'संबद्ध बैंक खाता' : 'LINKED BANK ACCOUNT'}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>SBI (A/C **4921)</div>
            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>{isHindi ? '✓ आधार एनपीसीआई से लिंक' : '✓ Aadhaar NPCI Seeded'}</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>{isHindi ? 'अगली संभावित किस्त' : 'NEXT EXPECTED DISBURSEMENT'}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A84FF', marginTop: '0.25rem' }}>₹2,000 (PM-KISAN)</div>
            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{isHindi ? '15 नवंबर 2026 को देय' : 'Due on 15 Nov 2026'}</div>
          </div>
        </div>
      </div>
    );
  }

  // 5. GRIEVANCES
  if (tab === 'grievances') {
    return (
      <div style={{ maxWidth: '700px' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            {isHindi ? 'जन शिकायत निवारण' : 'Public Grievance Redressal'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
            {isHindi ? 'कल्याणकारी लाभ न मिलने अथवा अभिलेख विसंगति से संबंधित शिकायत दर्ज करें' : 'Submit issues regarding missing welfare benefits or record discrepancies'}
          </p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          {grievanceSent ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <CheckCircle2 size={44} color="#10B981" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ margin: '0 0 0.25rem 0' }}>{isHindi ? 'शिकायत डॉकेट दर्ज हो गया!' : 'Grievance Docket Created!'}</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                {isHindi ? 'डॉकेट आईडी: ' : 'Docket ID: '}<strong>GRV-2026-9912</strong> {isHindi ? 'ज़िला सत्यापन अधिकारी को प्रेषित।' : 'assigned to District Verification Officer.'}
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setGrievanceSent(true); }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'अपनी शिकायत का विवरण दें' : 'Describe your concern'}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={isHindi ? 'उदा. भूमि अभिलेख में विसंगति के कारण पीएम-किसान लाभ मिलने में विलंब...' : 'e.g. Discrepancy in land area record causing delay in PM-KISAN entitlement...'}
                  value={grievanceText}
                  onChange={(e) => setGrievanceText(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ background: '#0B2545', color: '#FFFFFF' }}>
                {isHindi ? 'शिकायत दर्ज करें' : 'Submit Grievance'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 6. CERTIFICATES
  if (tab === 'certificates') {
    const certs = [
      {
        name: 'Unified JanPehchaan Family Certificate',
        nameHi: 'एकीकृत जनपहचान परिवार प्रमाण पत्र',
        id: 'CRT-JP-101',
        date: '15 Oct 2026',
        dateHi: '15 अक्टू 2026'
      },
      {
        name: 'Income Entitlement Certificate (BPL)',
        nameHi: 'आय पात्रता प्रमाण पत्र (बीपीएल)',
        id: 'CRT-INC-882',
        date: '01 Oct 2026',
        dateHi: '01 अक्टू 2026'
      },
      {
        name: 'Resident Domicile Certificate',
        nameHi: 'मूल निवास प्रमाण पत्र',
        id: 'CRT-DOM-331',
        date: '10 Sep 2026',
        dateHi: '10 सित 2026'
      }
    ];

    return (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            {isHindi ? 'सत्यापित डिजिटल प्रमाण पत्र' : 'Verified Digital Certificates'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
            {isHindi ? 'क्यूआर सत्यापन युक्त आधिकारिक डिजिटल हस्ताक्षरित सरकारी प्रमाण पत्र' : 'Official digitally signed government certificates with QR verification'}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {certs.map((c, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem' }}>
              <Award size={28} color="#0A84FF" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.925rem', color: '#0F172A' }}>
                {isHindi ? c.nameHi : c.name}
              </h4>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>
                {isHindi ? 'प्रमाण पत्र संख्या' : 'Certificate No'}: {c.id}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                {isHindi ? 'जारी तिथि' : 'Issued on'} {isHindi ? c.dateHi : c.date}
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                onClick={() => alert(isHindi ? `प्रमाण पत्र ${c.id} डाउनलोड किया गया।` : `Certificate ${c.id} downloaded.`)}
              >
                <Download size={13} />
                <span>{isHindi ? 'हस्ताक्षरित पीडीएफ डाउनलोड करें' : 'Download Signed PDF'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. DOCUMENT WALLET
  if (tab === 'wallet') {
    return (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            {isHindi ? 'डिजिलॉकर दस्तावेज़ वॉल्ट' : 'DigiLocker Document Wallet'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
            {isHindi ? 'यूआईडीएआई आधार वॉल्ट व राज्य अभिलेखों से सुरक्षित रूप से लिंक डिजिटल तिजोरी' : 'Encrypted document vault linked with UIDAI Aadhaar Vault & State Registries'}
          </p>
        </div>
        <div className="card" style={{ padding: '1.5rem', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FolderLock size={44} color="#2563EB" />
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#0F172A' }}>
                {isHindi ? 'सभी आवश्यक अभिलेख सिंक हो चुके हैं' : 'All Essential Records Synced'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                {isHindi ? '4 सत्यापित दस्तावेज़: आधार पहचान टोकन, एनएफएसए राशन कार्ड, भूमि खतौनी, मूल निवास प्रमाण पत्र।' : '4 Verified Documents: Aadhaar Identity Token, NFSA Ration Card, Land Title Khata, Domicile Certificate.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 8. SUPPORT & HELP
  if (tab === 'support') {
    return (
      <div style={{ maxWidth: '650px' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            {isHindi ? 'जनपहचान नागरिक सहायता व हेल्पडेस्क' : 'JanPehchaan Citizen Support & Helpdesk'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
            {isHindi ? '24x7 अधिकार मार्गदर्शन और तकनीकी सहायता हेल्पलाइन' : '24x7 Entitlement guidance & technical assistance hotline'}
          </p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <Headphones size={36} color="#0A84FF" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ margin: '0 0 0.25rem 0', color: '#0F172A' }}>
            {isHindi ? 'टोल-फ्री नागरिक हेल्पलाइन' : 'Toll-Free Citizen Helpline'}
          </h4>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A84FF', margin: '0.5rem 0' }}>1800-180-2026</div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
            {isHindi ? 'ईमेल सहायता: ' : 'Email Support: '}<strong>helpdesk@janpehchaan.gov.in</strong> • {isHindi ? 'हिंदी व अंग्रेज़ी में उपलब्ध' : 'Available in Hindi & English'}
          </p>
        </div>
      </div>
    );
  }

  // 9. SETTINGS
  return (
    <div style={{ maxWidth: '650px' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
          {isHindi ? 'पोर्टल व अधिसूचना सेटिंग्स' : 'Portal & Notification Settings'}
        </h2>
        <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748B' }}>
          {isHindi ? 'नागरिक प्राथमिकताएं और सुरक्षा सेटिंग्स प्रबंधित करें' : 'Manage citizen preferences and security settings'}
        </p>
      </div>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9rem' }}>
              {isHindi ? 'एसएमएस कल्याण अलर्ट' : 'SMS Welfare Alerts'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {isHindi ? 'नई सरकारी योजनाओं की पात्रता मिलने पर तुरंत एसएमएस प्राप्त करें' : 'Receive instant SMS when new government schemes match'}
            </div>
          </div>
          <input type="checkbox" defaultChecked style={{ accentColor: '#0B2545', transform: 'scale(1.2)' }} />
        </div>
        <div style={{ height: '1px', background: '#F1F5F9' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9rem' }}>
              {isHindi ? 'क्रिप्टोग्राफ़िक प्राइवेसी मोड' : 'Cryptographic Privacy Mode'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {isHindi ? 'सभी सार्वजनिक पटल पर आधार संख्या को सुरक्षित व गोपनीय रखें' : 'Mask Aadhaar numbers across all public desks'}
            </div>
          </div>
          <input type="checkbox" defaultChecked style={{ accentColor: '#0B2545', transform: 'scale(1.2)' }} />
        </div>
      </div>
    </div>
  );
}

export default PortalModulesTab;
