import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  MoreVertical,
  Download,
  Eye,
  GraduationCap,
  Globe,
  Users,
  AlertTriangle,
  Headphones,
  Check,
  Search,
  UploadCloud,
  FilePlus,
  ShieldCheck,
  Building2,
  Calendar,
  Award,
  Sparkles,
  QrCode,
  Printer,
  Lock
} from 'lucide-react';

export function CertificatesTab({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  // Filter and sort state
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, ISSUED, IN_PROGRESS, REJECTED
  const [sortBy, setSortBy] = useState('LATEST');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isCertTypeFixed, setIsCertTypeFixed] = useState(false);
  const [selectedCertForApply, setSelectedCertForApply] = useState('Birth Certificate');
  const [selectedCertForDetails, setSelectedCertForDetails] = useState(null);
  const [downloadCertData, setDownloadCertData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Application
  const [applicantName, setApplicantName] = useState(user?.name || 'Pankaj Kumar');
  const [applicantFather, setApplicantFather] = useState('Ramesh Kumar Sharma');
  const [purpose, setPurpose] = useState('Employment & Higher Education Admission');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Certificate Applications List matching reference image exactly
  const [applications, setApplications] = useState([
    {
      id: 'JC-2026-000124',
      num: 1,
      type: 'Domicile Certificate',
      typeHi: 'निवास प्रमाण पत्र (Domicile)',
      department: 'Revenue & District Administration',
      departmentHi: 'राजस्व एवं ज़िला प्रशासन',
      appliedOn: '18 Oct 2026',
      status: 'ISSUED',
      statusLabel: 'Issued',
      statusLabelHi: 'जारी',
      validTill: 'Permanent (Lifetime validity)',
      validTillHi: 'स्थायी (आजीवन वैधता)',
      certNumber: 'UP-DOM-2026-98124',
      officer: 'Sub-Divisional Magistrate (SDM), Noida',
      officerHi: 'उप-विभागीय मजिस्ट्रेट (एसडीएम), नोएडा',
      downloadUrl: '#',
      details: 'Domicile proof verified against Uttar Pradesh permanent resident registry.',
      detailsHi: 'उत्तर प्रदेश स्थायी निवासी रजिस्टर के आधार पर अधिवास प्रमाण पत्र सत्यापित।'
    },
    {
      id: 'JC-2026-000099',
      num: 2,
      type: 'Income Certificate',
      typeHi: 'आय प्रमाण पत्र (Income)',
      department: 'Revenue Department',
      departmentHi: 'राजस्व विभाग',
      appliedOn: '14 Oct 2026',
      status: 'IN_PROGRESS',
      statusLabel: 'In Progress',
      statusLabelHi: 'प्रगति पर',
      validTill: 'Under Verification',
      validTillHi: 'सत्यापनाधीन',
      certNumber: 'Pending Verification',
      officer: 'Tehsildar Desk, Gautam Buddha Nagar',
      officerHi: 'तहसीलदार पटल, गौतम बुद्ध नगर',
      downloadUrl: null,
      details: 'Annual household income ₹1,20,000 under field enquiry with local Patwari.',
      detailsHi: 'वार्षिक पारिवारिक आय ₹1,20,000 का स्थानीय लेखपाल/पटवारी द्वारा स्थलीय सत्यापन जारी।'
    },
    {
      id: 'JC-2026-000087',
      num: 3,
      type: 'Caste Certificate (OBC-NCL)',
      typeHi: 'जाति प्रमाण पत्र (OBC-NCL)',
      department: 'Backward Classes Welfare Department',
      departmentHi: 'पिछड़ा वर्ग कल्याण विभाग',
      appliedOn: '08 Oct 2026',
      status: 'ISSUED',
      statusLabel: 'Issued',
      statusLabelHi: 'जारी',
      validTill: 'Valid till 31 Mar 2027',
      validTillHi: 'वैधता 31 मार्च 2027 तक',
      certNumber: 'UP-OBC-2026-44109',
      officer: 'Competent Authority, Backward Classes Welfare',
      officerHi: 'सक्षम प्राधिकारी, पिछड़ा वर्ग कल्याण',
      downloadUrl: '#',
      details: 'Non-Creamy Layer quota status authenticated with Central & State OBC list.',
      detailsHi: 'नॉन-क्रीमी लेयर कोटा स्थिति केंद्रीय एवं राज्य ओबीसी सूची के साथ प्रमाणित।'
    },
    {
      id: 'JC-2026-000064',
      num: 4,
      type: 'Property Certificate',
      typeHi: 'संपत्ति प्रमाण पत्र',
      department: 'Sub-Registrar Land Records',
      departmentHi: 'उप-पंजीयक भू-अभिलेख',
      appliedOn: '02 Oct 2026',
      status: 'REJECTED',
      statusLabel: 'Rejected',
      statusLabelHi: 'अस्वीकृत',
      validTill: 'N/A',
      validTillHi: 'लागू नहीं',
      certNumber: 'N/A',
      officer: 'Sub-Registrar Officer',
      officerHi: 'उप-पंजीयक अधिकारी',
      downloadUrl: null,
      details: 'Previous municipal mutation deed was blurred. Re-upload with clear high-resolution scan.',
      detailsHi: 'पूर्व नगरपालिका दाखिल-खारिज प्रति अस्पष्ट थी। कृपया स्पष्ट स्कैन के साथ पुनः अपलोड करें।'
    }
  ]);

  // Counts
  const counts = useMemo(() => {
    return {
      total: applications.length,
      issued: applications.filter((a) => a.status === 'ISSUED').length,
      underVerification: applications.filter((a) => a.status === 'IN_PROGRESS').length,
      rejected: applications.filter((a) => a.status === 'REJECTED').length
    };
  }, [applications]);

  // Filtered and sorted applications
  const filteredApplications = useMemo(() => {
    const list = applications.filter((a) => {
      if (activeFilter === 'ISSUED') return a.status === 'ISSUED';
      if (activeFilter === 'IN_PROGRESS') return a.status === 'IN_PROGRESS';
      if (activeFilter === 'REJECTED') return a.status === 'REJECTED';
      return true;
    });

    const parseAppDate = (item) => {
      if (item.appliedOn && item.appliedOn.includes('Today')) return Date.now();
      const d = Date.parse(item.appliedOn);
      if (!isNaN(d)) return d;
      const numMatch = (item.id || '').match(/\d+$/);
      return numMatch ? parseInt(numMatch[0], 10) : (item.num || 0);
    };

    return [...list].sort((a, b) => {
      const dateA = parseAppDate(a);
      const dateB = parseAppDate(b);
      if (sortBy === 'OLDEST') {
        return dateA - dateB;
      }
      return dateB - dateA; // LATEST first
    });
  }, [applications, activeFilter, sortBy]);

  // Handle Apply Submission
  const handleApplySubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newId = `JC-2026-000${Math.floor(130 + Math.random() * 50)}`;
      const newEntry = {
        id: newId,
        num: applications.length + 1,
        type: selectedCertForApply,
        department: 'Revenue & Citizen Services Department',
        appliedOn: 'Today, 23 Oct 2026',
        status: 'IN_PROGRESS',
        statusLabel: 'In Progress',
        validTill: 'Under Verification',
        certNumber: 'Pending Verification',
        officer: 'Automated Redressal Queue Desk',
        downloadUrl: null,
        details: `Application for ${selectedCertForApply} submitted online by ${applicantName}.`
      };

      setApplications([newEntry, ...applications]);
      setApplyModalOpen(false);
      showToast(`Application ${newId} for ${selectedCertForApply} submitted successfully!`);
    }, 900);
  };

  const handleDownload = (cert) => {
    setDownloadCertData(cert);
    showToast(`Downloading official verified ${cert.type}...`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span style={{ color: '#10B981' }}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================
          1. PAGE HERO BANNER
          ========================================================= */}
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        padding: '1.25rem 2rem',
        overflow: 'hidden',
        minHeight: '135px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
        background: '#FFFFFF'
      }}>
        {/* Tricolor wave + India landmarks background image */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: 'url(/assets/digital_id_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right 46%',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Soft Left Gradient Overlay for high-contrast crisp text */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.91) 36%, rgba(255,255,255,0.45) 70%, rgba(255,255,255,0.12) 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Left Title & Breadcrumbs */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748B', marginBottom: '0.35rem' }}>
            <span
              onClick={() => onNavigateTab && onNavigateTab('overview')}
              style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
            >
              {isHindi ? 'होम' : 'Home'}
            </span>
            <ChevronRight size={13} color="#94A3B8" />
            <span style={{ color: '#0F172A', fontWeight: 600 }}>
              {isHindi ? 'प्रमाण पत्र' : 'Certificates'}
            </span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'आधिकारिक प्रमाण पत्र' : 'Certificates'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'सरकारी प्रमाण पत्रों हेतु आवेदन करें, स्थिति ट्रैक करें व सत्यापित प्रति डाउनलोड करें।' : 'Apply, track and download your government certificates.'}
          </p>
        </div>

        {/* Right Quote Card matching screenshot */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'right',
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: '14px',
          padding: '0.65rem 1.15rem',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.35 }}>
            {isHindi ? (
              <span>आपके दस्तावेज़<br />सशक्त नागरिक<br />मजबूत भारत</span>
            ) : (
              <span>&ldquo;Your Documents<br />Empower<br />A Stronger India&rdquo;</span>
            )}
          </div>
          <div style={{
            height: '3px',
            width: '52px',
            background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
            borderRadius: '9999px',
            marginTop: '0.35rem',
            marginLeft: 'auto'
          }} />
        </div>
      </div>

      {/* =========================================================
          2. TWO-COLUMN MAIN BODY
             Left/Center (72%): Status Row + Apply Cards + Applications Table + How It Works
             Right Sidebar (28%): Quick Actions + Important Info + Support
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN: STATS + APPLY SECTION + TABLE + WORKFLOW
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Row 1: Four Status Metric Cards matching screenshot */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {/* 1. Total Applications */}
            <div
              onClick={() => setActiveFilter('ALL')}
              style={{
                background: '#EFF6FF',
                border: activeFilter === 'ALL' ? '2px solid #2563EB' : '1px solid #DBEAFE',
                borderRadius: '14px',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                    {counts.total}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'कुल आवेदन' : 'Total Applications'}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>

            {/* 2. Issued */}
            <div
              onClick={() => setActiveFilter('ISSUED')}
              style={{
                background: '#F0FDF4',
                border: activeFilter === 'ISSUED' ? '2px solid #16A34A' : '1px solid #DCFCE7',
                borderRadius: '14px',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={18} color="#FFFFFF" strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                    {counts.issued}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'जारी किए गए' : 'Issued'}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>

            {/* 3. Under Verification */}
            <div
              onClick={() => setActiveFilter('IN_PROGRESS')}
              style={{
                background: '#FFFBEB',
                border: activeFilter === 'IN_PROGRESS' ? '2px solid #D97706' : '1px solid #FEF3C7',
                borderRadius: '14px',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#FEF3C7',
                  border: '1.5px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={18} color="#D97706" />
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                    {counts.underVerification}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'सत्यापनाधीन' : 'Under Verification'}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>

            {/* 4. Rejected */}
            <div
              onClick={() => setActiveFilter('REJECTED')}
              style={{
                background: '#FEF2F2',
                border: activeFilter === 'REJECTED' ? '2px solid #DC2626' : '1px solid #FEE2E2',
                borderRadius: '14px',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#F87171',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <X size={18} color="#FFFFFF" strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                    {counts.rejected}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'अस्वीकृत' : 'Rejected'}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>
          </div>

          {/* =======================================================
              ROW 2: HOW IT WORKS (Moved before Apply section)
              ======================================================= */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
          }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
              {isHindi ? 'यह कैसे काम करता है' : 'How It Works'}
            </h3>

            {/* 4 Step Horizontal Workflow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '150px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? 'प्रमाण पत्र चुनें' : 'Choose Certificate'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'अपनी आवश्यकतानुसार प्रमाण पत्र चुनें।' : 'Select the certificate you need.'}
                  </div>
                </div>
              </div>

              <span style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>→</span>

              {/* Step 2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '150px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? 'आवेदन जमा करें' : 'Submit Application'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'विवरण भरें और दस्तावेज़ संलग्न करें।' : 'Fill details and upload documents.'}
                  </div>
                </div>
              </div>

              <span style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>→</span>

              {/* Step 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '150px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#EA580C',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? 'विभागीय सत्यापन' : 'Department Verification'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'सक्षम प्राधिकारी द्वारा आवेदन की जांच की जाती है।' : 'Your application is reviewed by the department.'}
                  </div>
                </div>
              </div>

              <span style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>→</span>

              {/* Step 4 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '150px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#7E22CE',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  4
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? 'प्रमाण पत्र डाउनलोड करें' : 'Download Certificate'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'स्वीकृति सूचना पाएं और डिजिटल प्रति डाउनलोड करें।' : 'Get notified and download digitally.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =======================================================
              ROW 3: APPLY FOR A NEW CERTIFICATE (4 Cards Grid)
              ======================================================= */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem 1.35rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.15rem 0' }}>
              {isHindi ? 'नए प्रमाण पत्र के लिए आवेदन करें' : 'Apply for a New Certificate'}
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: '#64748B' }}>
              {isHindi ? 'ऑनलाइन आवेदन करने के लिए वांछित प्रमाण पत्र चुनें।' : 'Choose a certificate to apply for and submit your application online.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
              {/* Card 1: Birth Certificate */}
              <div style={{
                border: '1px solid #F1F5F9',
                background: '#F8FAFC',
                borderRadius: '12px',
                padding: '0.95rem 0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.65rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={18} color="#EF4444" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                      {isHindi ? 'जन्म प्रमाण पत्र' : 'Birth Certificate'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.3, marginTop: '0.15rem' }}>
                      {isHindi ? 'जन्म तिथि एवं स्थान का कानूनी प्रमाण' : 'Proof of date and place of birth'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCertForApply('Birth Certificate');
                    setIsCertTypeFixed(true);
                    setApplyModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #DBEAFE',
                    color: '#2563EB',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isHindi ? 'अभी आवेदन करें →' : 'Apply Now →'}
                </button>
              </div>

              {/* Card 2: Bonafide Certificate */}
              <div style={{
                border: '1px solid #F1F5F9',
                background: '#F8FAFC',
                borderRadius: '12px',
                padding: '0.95rem 0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.65rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#F3E8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <GraduationCap size={18} color="#7E22CE" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                      {isHindi ? 'बोनाफाइड प्रमाण पत्र' : 'Bonafide Certificate'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.3, marginTop: '0.15rem' }}>
                      {isHindi ? 'छात्रों हेतु (स्कूल/कॉलेज प्रमाण)' : 'For students (school/college)'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCertForApply('Bonafide Certificate');
                    setIsCertTypeFixed(true);
                    setApplyModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #DBEAFE',
                    color: '#2563EB',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isHindi ? 'अभी आवेदन करें →' : 'Apply Now →'}
                </button>
              </div>

              {/* Card 3: Nationality Certificate */}
              <div style={{
                border: '1px solid #F1F5F9',
                background: '#F8FAFC',
                borderRadius: '12px',
                padding: '0.95rem 0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.65rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Globe size={18} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                      {isHindi ? 'राष्ट्रीयता प्रमाण पत्र' : 'Nationality Certificate'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.3, marginTop: '0.15rem' }}>
                      {isHindi ? 'भारतीय नागरिकता का आधिकारिक प्रमाण' : 'Proof of Indian nationality'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCertForApply('Nationality Certificate');
                    setIsCertTypeFixed(true);
                    setApplyModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #DBEAFE',
                    color: '#2563EB',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isHindi ? 'अभी आवेदन करें →' : 'Apply Now →'}
                </button>
              </div>

              {/* Card 4: OBC-NCL Certificate */}
              <div style={{
                border: '1px solid #F1F5F9',
                background: '#F8FAFC',
                borderRadius: '12px',
                padding: '0.95rem 0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.65rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#FFF7ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Users size={18} color="#EA580C" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                      {isHindi ? 'ओबीसी-एनसीएल प्रमाण पत्र' : 'OBC-NCL Certificate'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.3, marginTop: '0.15rem' }}>
                      {isHindi ? 'अन्य पिछड़ा वर्ग (नॉन-क्रीमी लेयर) हेतु' : 'For OBC (Non-Creamy Layer)'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCertForApply('OBC-NCL Certificate');
                    setIsCertTypeFixed(true);
                    setApplyModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #DBEAFE',
                    color: '#2563EB',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isHindi ? 'अभी आवेदन करें →' : 'Apply Now →'}
                </button>
              </div>
            </div>
          </div>

          {/* =======================================================
              ROW 3: MY CERTIFICATE APPLICATIONS TABLE
              ======================================================= */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
            overflow: 'hidden'
          }}>
            {/* Table Header Controls */}
            <div style={{
              padding: '1.15rem 1.35rem',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'मेरे प्रमाण पत्र आवेदन' : 'My Certificate Applications'}
                </h3>

                {/* Filter Tabs matching screenshot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {[
                    { id: 'ALL', label: isHindi ? `सभी (${counts.total})` : `All (${counts.total})` },
                    { id: 'ISSUED', label: isHindi ? `जारी (${counts.issued})` : `Issued (${counts.issued})` },
                    { id: 'IN_PROGRESS', label: isHindi ? `प्रगति पर (${counts.underVerification})` : `In Progress (${counts.underVerification})` },
                    { id: 'REJECTED', label: isHindi ? `अस्वीकृत (${counts.rejected})` : `Rejected (${counts.rejected})` }
                  ].map((tab) => {
                    const isActive = activeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilter(tab.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          borderBottom: isActive ? '2.5px solid #2563EB' : '2.5px solid transparent',
                          padding: '0.35rem 0.2rem',
                          fontSize: '0.8rem',
                          fontWeight: isActive ? 800 : 600,
                          color: isActive ? '#2563EB' : '#64748B',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="LATEST">{isHindi ? 'नवीनतम पहले' : 'Latest First'}</option>
                  <option value="OLDEST">{isHindi ? 'पुरातन पहले' : 'Oldest First'}</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700, width: '40px' }}>#</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'आवेदन आईडी' : 'Application ID'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'प्रमाण पत्र प्रकार' : 'Certificate Type'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'आवेदन तिथि' : 'Applied On'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'स्थिति' : 'Status'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'कार्रवाई' : 'Action'}
                    </th>
                    <th style={{ padding: '0.85rem 0.5rem', width: '30px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((item, idx) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
                    >
                      <td style={{ padding: '0.95rem 1rem', color: '#64748B', fontWeight: 600 }}>
                        {idx + 1}
                      </td>

                      <td style={{ padding: '0.95rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                        {item.id}
                      </td>

                      <td style={{ padding: '0.95rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                        {isHindi ? (item.typeHi || item.type) : item.type}
                      </td>

                      <td style={{ padding: '0.95rem 1rem', color: '#64748B' }}>
                        {item.appliedOn}
                      </td>

                      <td style={{ padding: '0.95rem 1rem' }}>
                        {item.status === 'ISSUED' && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#DCFCE7',
                            color: '#15803D',
                            padding: '0.22rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            <Check size={12} strokeWidth={3} />
                            <span>{isHindi ? 'जारी' : 'Issued'}</span>
                          </div>
                        )}

                        {item.status === 'IN_PROGRESS' && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#FEF3C7',
                            color: '#D97706',
                            padding: '0.22rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            <Clock size={12} />
                            <span>{isHindi ? 'प्रगति पर' : 'In Progress'}</span>
                          </div>
                        )}

                        {item.status === 'REJECTED' && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            padding: '0.22rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            <X size={12} strokeWidth={3} />
                            <span>{isHindi ? 'अस्वीकृत' : 'Rejected'}</span>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '0.95rem 1rem' }}>
                        {item.status === 'ISSUED' ? (
                          <button
                            type="button"
                            onClick={() => handleDownload(item)}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              color: '#2563EB',
                              borderRadius: '8px',
                              padding: '0.38rem 0.85rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Download size={13} color="#2563EB" />
                            <span>{isHindi ? 'डाउनलोड' : 'Download'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedCertForDetails(item)}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              color: '#2563EB',
                              borderRadius: '8px',
                              padding: '0.38rem 0.85rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <FileText size={13} color="#2563EB" />
                            <span>{isHindi ? 'विवरण देखें' : 'View Details'}</span>
                          </button>
                        )}
                      </td>

                      <td style={{ padding: '0.95rem 0.5rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedCertForDetails(item)}
                          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.2rem' }}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>

        {/* =======================================================
            RIGHT COLUMN: QUICK ACTIONS + INFO + HELP
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. QUICK ACTIONS CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.95rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={18} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'त्वरित कार्रवाइयां' : 'Quick Actions'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Action 1 */}
              <div
                onClick={() => {
                  setIsCertTypeFixed(false);
                  setApplyModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FilePlus size={16} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'प्रमाण पत्र हेतु आवेदन करें' : 'Apply for a Certificate'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'चुनें और अपना आवेदन जमा करें' : 'Choose and submit your application'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>

              {/* Action 2 */}
              <div
                onClick={() => setSelectedCertForDetails(applications[1])}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Search size={16} color="#16A34A" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'आवेदन ट्रैक करें' : 'Track Application'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'वास्तविक समय स्थिति देखें' : 'Check real-time status'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>

              {/* Action 3 */}
              <div
                onClick={() => handleDownload(applications[0])}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Download size={16} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'जारी प्रमाण पत्र डाउनलोड करें' : 'Download Issued Certificate'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'सत्यापित प्रमाण पत्र तक पहुंचें' : 'Access your saved certificates'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>
            </div>
          </div>

          {/* 2. IMPORTANT INFORMATION CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <AlertTriangle size={17} color="#EF4444" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'महत्वपूर्ण जानकारी' : 'Important Information'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Check size={11} color="#15803D" strokeWidth={3} />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.35 }}>
                  {isHindi ? 'सभी प्रमाण पत्र डिजिटल रूप से हस्ताक्षरित हैं और मूल प्रति के समान मान्य हैं।' : 'All certificates are issued digitally and are valid as physical copies.'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Clock size={11} color="#D97706" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.35 }}>
                  {isHindi ? 'प्रसंस्करण समय विभाग के अनुसार भिन्न हो सकता है।' : 'Processing time may vary by department.'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <FileText size={11} color="#DC2626" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.35 }}>
                  {isHindi ? 'आवेदन करने से पूर्व अपने सहायक दस्तावेज़ तैयार रखें।' : 'Keep your documents ready before applying.'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFF7ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <ShieldCheck size={11} color="#EA580C" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.35 }}>
                  {isHindi ? 'स्थिति अपडेट की जानकारी एसएमएस और ईमेल द्वारा दी जाएगी।' : 'You will be notified via SMS and Email for status updates.'}
                </div>
              </div>
            </div>
          </div>

          {/* 3. NEED HELP WITH CERTIFICATES? */}
          <div style={{
            background: 'linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 100%)',
            borderRadius: '16px',
            border: '1px solid #DBEAFE',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Headphones size={18} color="#2563EB" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'प्रमाण पत्रों में सहायता चाहिए?' : 'Need Help with Certificates?'}
                </h4>
              </div>
            </div>

            <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35 }}>
              {isHindi ? 'आवेदन संबंधी सहायता के लिए हमारी सहायता टीम से संपर्क करें।' : 'Contact our support team for assistance with your application.'}
            </p>

            <button
              type="button"
              onClick={() => showToast(isHindi ? 'नागरिक प्रमाण पत्र सहायता पटल से जोड़ा जा रहा है...' : 'Connecting to citizen certificates desk...')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.5rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#2563EB',
                cursor: 'pointer'
              }}
            >
              <span>{isHindi ? 'सहायता केंद्र से संपर्क करें' : 'Contact Support'}</span>
              <span style={{ fontSize: '0.85rem' }}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          4. APPLY FOR CERTIFICATE MODAL
          ========================================================= */}
      {applyModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setApplyModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              padding: '1.5rem',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem', marginBottom: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Award size={19} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'सरकारी प्रमाण पत्र हेतु आवेदन' : 'Apply for Government Certificate'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {isHindi ? 'डिजिटल प्रमाण पत्र निवारण पटल • जन पहचान' : 'Digital Certificate Redressal Desk • Jan Pehchaan'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={19} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                    {isHindi ? 'प्रमाण पत्र प्रकार' : 'Certificate Type'}
                  </label>
                  {isCertTypeFixed && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: '#2563EB',
                      background: '#EFF6FF',
                      border: '1px solid #DBEAFE',
                      borderRadius: '9999px',
                      padding: '0.12rem 0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Lock size={10} />
                      {isHindi ? 'प्रमाण पत्र लॉक है' : 'Certificate Fixed'}
                    </span>
                  )}
                </div>

                {isCertTypeFixed ? (
                  <div style={{
                    width: '100%',
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} />
                    <span>{selectedCertForApply}</span>
                  </div>
                ) : (
                  <select
                    value={selectedCertForApply}
                    onChange={(e) => setSelectedCertForApply(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  >
                    <option value="Birth Certificate">{isHindi ? 'जन्म प्रमाण पत्र' : 'Birth Certificate'}</option>
                    <option value="Bonafide Certificate">{isHindi ? 'बोनाफाइड प्रमाण पत्र (छात्र/कॉलेज)' : 'Bonafide Certificate (Student/College)'}</option>
                    <option value="Nationality Certificate">{isHindi ? 'राष्ट्रीयता प्रमाण पत्र' : 'Nationality Certificate'}</option>
                    <option value="OBC-NCL Certificate">{isHindi ? 'ओबीसी-एनसीएल प्रमाण पत्र (नॉन-क्रीमी लेयर)' : 'OBC-NCL Certificate (Non-Creamy Layer)'}</option>
                    <option value="Domicile Certificate">{isHindi ? 'निवास प्रमाण पत्र' : 'Domicile Certificate'}</option>
                    <option value="Income Certificate">{isHindi ? 'आय प्रमाण पत्र' : 'Income Certificate'}</option>
                  </select>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'आवेदक का पूरा नाम' : 'Applicant Full Name'}
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'पिता / परिवार के मुखिया का नाम' : 'Father / Head of Household Name'}
                </label>
                <input
                  type="text"
                  value={applicantFather}
                  onChange={(e) => setApplicantFather(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'आवेदन का उद्देश्य' : 'Purpose of Application'}
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={isHindi ? 'उदा. कॉलेज प्रवेश, कल्याणकारी योजना डीबीटी, रोज़गार' : 'e.g. College Admission, Welfare Scheme DBT, Employment'}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: '10px',
                padding: '0.65rem 0.85rem',
                fontSize: '0.72rem',
                color: '#0369A1'
              }}>
                {isHindi ? '✓ आधार बायोमेट्रिक और पारिवारिक डेटा स्वचालित रूप से सत्यापित किया जाएगा।' : '✓ Aadhaar Biometrics and Family Unit records will be automatically cross-seeded.'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.5rem 1.15rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1.35rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {isSubmitting ? (isHindi ? 'जमा हो रहा है...' : 'Submitting...') : (isHindi ? 'आवेदन जमा करें →' : 'Submit Application →')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          5. OFFICIAL DIGITAL CERTIFICATE SLIP MODAL
          ========================================================= */}
      {downloadCertData && (
        <div
          className="modal-overlay"
          onClick={() => setDownloadCertData(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '620px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              padding: '1.75rem',
              position: 'relative'
            }}
          >
            {/* Certificate Formal Card View */}
            <div style={{
              border: '3px double #000080',
              borderRadius: '12px',
              padding: '1.5rem',
              background: '#FFFEFA',
              position: 'relative'
            }}>
              {/* Watermark Emblem */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.05,
                pointerEvents: 'none'
              }}>
                <img src="/assets/favicon.png" alt="Emblem" style={{ width: '220px', height: 'auto' }} />
              </div>

              {/* Certificate Header */}
              <div style={{ textAlign: 'center', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                <img src="/assets/favicon.png" alt="Emblem" style={{ height: '36px', width: 'auto', marginBottom: '0.35rem' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '0.02em' }}>
                  {isHindi ? 'उत्तर प्रदेश सरकार' : 'GOVERNMENT OF UTTAR PRADESH'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  {isHindi ? 'ज़िला प्रशासन • गौतम बुद्ध नगर' : 'District Administration • Gautam Buddha Nagar'}
                </div>
                <div style={{
                  display: 'inline-block',
                  background: '#DCFCE7',
                  color: '#15803D',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginTop: '0.45rem'
                }}>
                  {isHindi ? 'आधिकारिक डिजिटल हस्ताक्षरित प्रमाण पत्र' : 'OFFICIAL DIGITALLY SIGNED CERTIFICATE'}
                </div>
              </div>

              {/* Certificate Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>{isHindi ? 'प्रमाण पत्र शीर्षक:' : 'Certificate Title:'}</span>
                  <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>{isHindi ? (downloadCertData.typeHi || downloadCertData.type) : downloadCertData.type}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>{isHindi ? 'प्रमाण पत्र संख्या:' : 'Certificate Number:'}</span>
                  <strong style={{ color: '#2563EB' }}>{downloadCertData.certNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>{isHindi ? 'जारी किया गया:' : 'Issued To:'}</span>
                  <strong>{user?.name || 'Pankaj Kumar'} (S/o Ramesh Kumar Sharma)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>{isHindi ? 'अधिकार क्षेत्र / निवास:' : 'Domicile / Jurisdiction:'}</span>
                  <strong>{isHindi ? 'नोएडा, गौतम बुद्ध नगर, उत्तर प्रदेश' : 'Noida, Gautam Buddha Nagar, Uttar Pradesh'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>{isHindi ? 'वैधता:' : 'Validity:'}</span>
                  <strong style={{ color: '#16A34A' }}>{isHindi ? (downloadCertData.validTillHi || downloadCertData.validTill) : downloadCertData.validTill}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>{isHindi ? 'जारीकर्ता प्राधिकारी:' : 'Issuing Authority:'}</span>
                  <strong>{isHindi ? (downloadCertData.officerHi || downloadCertData.officer) : downloadCertData.officer}</strong>
                </div>
              </div>

              {/* Bottom Verification Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px dashed #CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    border: '1px dashed #0F172A',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    textAlign: 'center'
                  }}>
                    {isHindi ? <span>डिजिटल<br />क्यूआर सील</span> : <span>DIGITAL<br />QR SEAL</span>}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748B' }}>
                    {isHindi ? <span>जन पहचान वॉल्ट द्वारा<br />सत्यापन योग्य</span> : <span>Authenticity verifiable via<br />Jan Pehchaan Vault</span>}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: '#15803D', fontWeight: 800 }}>
                    {isHindi ? 'एसडीएम द्वारा डिजिटल रूप से हस्ताक्षरित' : 'Digitally Signed by SDM'}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#94A3B8' }}>
                    {isHindi ? 'तिथि:' : 'Date:'} {downloadCertData.appliedOn}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setDownloadCertData(null)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.5rem 1.15rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(isHindi ? 'आधिकारिक पीडीएफ प्रमाण पत्र डाउनलोड किया गया।' : 'Official PDF Certificate downloaded to local system.');
                  setDownloadCertData(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.35rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                }}
              >
                <Download size={14} />
                <span>{isHindi ? 'पीडीएफ प्रमाण पत्र सहेजें' : 'Save PDF Certificate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          6. VIEW DETAILS MODAL
          ========================================================= */}
      {selectedCertForDetails && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCertForDetails(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              padding: '1.5rem',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem', marginBottom: '1.15rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'प्रमाण पत्र विवरण' : 'Certificate Details'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {isHindi ? 'आईडी:' : 'ID:'} <strong style={{ color: '#0F172A' }}>{selectedCertForDetails.id}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCertForDetails(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={19} color="#64748B" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.825rem' }}>
              <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{isHindi ? 'प्रमाण पत्र प्रकार' : 'Certificate Type'}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginTop: '0.15rem' }}>
                  {isHindi ? (selectedCertForDetails.typeHi || selectedCertForDetails.type) : selectedCertForDetails.type}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.35rem' }}>
                  {isHindi ? (selectedCertForDetails.detailsHi || selectedCertForDetails.details) : selectedCertForDetails.details}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>{isHindi ? 'सक्षम प्राधिकारी:' : 'Governing Authority:'}</span>
                <strong>{isHindi ? (selectedCertForDetails.officerHi || selectedCertForDetails.officer) : selectedCertForDetails.officer}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>{isHindi ? 'आवेदन तिथि:' : 'Applied Date:'}</span>
                <strong>{selectedCertForDetails.appliedOn}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>{isHindi ? 'वर्तमान स्थिति:' : 'Current Status:'}</span>
                <strong style={{
                  color: selectedCertForDetails.status === 'ISSUED' ? '#16A34A' : selectedCertForDetails.status === 'IN_PROGRESS' ? '#D97706' : '#DC2626'
                }}>
                  {isHindi ? (selectedCertForDetails.statusLabelHi || selectedCertForDetails.statusLabel) : selectedCertForDetails.statusLabel}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setSelectedCertForDetails(null)}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificatesTab;
