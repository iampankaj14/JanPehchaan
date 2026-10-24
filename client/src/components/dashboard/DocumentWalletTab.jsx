import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Download,
  Eye,
  MoreVertical,
  UploadCloud,
  Folder,
  ShieldCheck,
  Calendar,
  Headphones,
  Check,
  Search,
  X,
  Printer,
  Share2,
  Trash2,
  ArrowRight,
  Car,
  CreditCard,
  Award,
  BookOpen,
  Sparkles,
  QrCode,
  Zap,
  HardDrive,
  Info
} from 'lucide-react';

export function DocumentWalletTab({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  // Filter tabs: 'ALL', 'IDENTITY', 'ADDRESS', 'CERTIFICATES', 'OTHER'
  const [activeTab, setActiveTab] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'VERIFIED' | 'PENDING' | 'UNVERIFIED'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('LATEST');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [viewDocModal, setViewDocModal] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [organizeModalOpen, setOrganizeModalOpen] = useState(false);
  const [auditLogsModalOpen, setAuditLogsModalOpen] = useState(false);
  const [validityModalOpen, setValidityModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('IDENTITY');
  const [activeMenuDocId, setActiveMenuDocId] = useState(null);

  // Real client-side text/PDF file download
  const handleDownloadDoc = (doc) => {
    const textContent = `=======================================================
GOVERNMENT OF INDIA / STATE REGISTRY
DIGILOCKER VERIFIED CITIZEN DOCUMENT
=======================================================
Document Name:       ${doc.name}
Document Number:     ${doc.code}
Category:            ${doc.category}
Issuing Authority:   ${doc.authority}
Issue Date:          ${doc.issuedOn}
Validity:            ${doc.expiresOn}
Status:              ${doc.status}
Cryptographic Hash:  SHA256:8F4B92C10A73DF20B9C6E41D
Issued To:           ${user?.name || 'Ramesh Kumar Sharma'}
Verification Link:   https://janpehchaan.gov.in/verify/${doc.id}
=======================================================
This digital copy is legally valid across India under the 
Information Technology Act, 2000 (Section 4 & 7).
=======================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.name.replace(/\s+/g, '_')}_Official_Verified.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Upload Form State
  const [uploadCategory, setUploadCategory] = useState('IDENTITY');
  const [uploadDocType, setUploadDocType] = useState('Voter ID Card');
  const [uploadAuthority, setUploadAuthority] = useState('Election Commission of India');
  const [uploadDocNumber, setUploadDocNumber] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Documents list matching the exact screenshot
  const [documents, setDocuments] = useState([
    {
      id: 'DOC-01',
      name: 'Aadhaar Card',
      nameHi: 'आधार कार्ड',
      code: 'XXXX-XXXX-1234',
      category: 'IDENTITY',
      issuedOn: '12 Jan 2020',
      authority: 'UIDAI',
      authorityHi: 'यूआईडीएआई (UIDAI)',
      status: 'VERIFIED',
      typeIcon: 'aadhaar',
      expiresOn: 'Lifetime Validity',
      expiresOnHi: 'आजीवन वैधता',
      fileSize: '1.2 MB',
      verifiedDate: '12 Jan 2020, 11:30 AM'
    },
    {
      id: 'DOC-02',
      name: 'PAN Card',
      nameHi: 'पैन कार्ड',
      code: 'ABCDE1234F',
      category: 'IDENTITY',
      issuedOn: '05 Mar 2021',
      authority: 'Income Tax Department',
      authorityHi: 'आयकर विभाग',
      status: 'VERIFIED',
      typeIcon: 'pan',
      expiresOn: '05 Mar 2031',
      expiresOnHi: '05 मार्च 2031',
      fileSize: '840 KB',
      verifiedDate: '05 Mar 2021, 03:15 PM'
    },
    {
      id: 'DOC-03',
      name: 'Driving License',
      nameHi: 'ड्राइविंग लाइसेंस',
      code: 'DL-1420112345678',
      category: 'ADDRESS',
      issuedOn: '18 Aug 2023',
      authority: 'Transport Department (UP)',
      authorityHi: 'परिवहन विभाग (उ.प्र.)',
      status: 'PENDING',
      typeIcon: 'license',
      expiresOn: '18 Aug 2033',
      expiresOnHi: '18 अगस्त 2033',
      fileSize: '1.4 MB',
      verifiedDate: 'Under Verification',
      verifiedDateHi: 'सत्यापन प्रक्रियाधीन'
    },
    {
      id: 'DOC-04',
      name: 'Domicile Certificate',
      nameHi: 'मूल निवास प्रमाण पत्र',
      code: 'UP-DOM-2026-00124',
      category: 'CERTIFICATES',
      issuedOn: '18 Oct 2026',
      authority: 'Revenue Department (UP)',
      authorityHi: 'राजस्व विभाग (उ.प्र.)',
      status: 'VERIFIED',
      typeIcon: 'certificate',
      expiresOn: 'Lifetime Validity',
      expiresOnHi: 'आजीवन वैधता',
      fileSize: '920 KB',
      verifiedDate: '18 Oct 2026, 04:45 PM'
    },
    {
      id: 'DOC-05',
      name: 'Income Certificate',
      nameHi: 'आय प्रमाण पत्र',
      code: 'UP-INC-2026-00099',
      category: 'CERTIFICATES',
      issuedOn: '14 Oct 2026',
      authority: 'Revenue Department (UP)',
      authorityHi: 'राजस्व विभाग (उ.प्र.)',
      status: 'VERIFIED',
      typeIcon: 'income',
      expiresOn: '31 Mar 2027',
      expiresOnHi: '31 मार्च 2027',
      fileSize: '760 KB',
      verifiedDate: '14 Oct 2026, 10:32 AM'
    },
    {
      id: 'DOC-06',
      name: 'Caste Certificate (OBC-NCL)',
      nameHi: 'जाति प्रमाण पत्र (ओबीसी-एनसीएल)',
      code: 'UP-OBC-2026-00087',
      category: 'CERTIFICATES',
      issuedOn: '08 Oct 2026',
      authority: 'Revenue Department (UP)',
      authorityHi: 'राजस्व विभाग (उ.प्र.)',
      status: 'VERIFIED',
      typeIcon: 'caste',
      expiresOn: '31 Mar 2027',
      expiresOnHi: '31 मार्च 2027',
      fileSize: '810 KB',
      verifiedDate: '08 Oct 2026, 09:40 AM'
    },
    {
      id: 'DOC-07',
      name: 'Ration Card',
      nameHi: 'राशन कार्ड',
      code: 'RC-UP-0918234',
      category: 'ADDRESS',
      issuedOn: '30 Jun 2018',
      authority: 'Food & Civil Supplies (UP)',
      authorityHi: 'खाद्य एवं नागरिक आपूर्ति (उ.प्र.)',
      status: 'PENDING',
      typeIcon: 'ration',
      expiresOn: '30 Jun 2028',
      expiresOnHi: '30 जून 2028',
      fileSize: '1.1 MB',
      verifiedDate: 'Under Field Review',
      verifiedDateHi: 'स्थलीय समीक्षाधीन'
    },
    {
      id: 'DOC-08',
      name: 'Voter ID Card',
      nameHi: 'मतदाता पहचान पत्र (वोटर आईडी)',
      code: 'EPIC-NV-882910',
      category: 'IDENTITY',
      issuedOn: '10 Feb 2019',
      authority: 'Election Commission of India',
      authorityHi: 'भारत निर्वाचन आयोग',
      status: 'UNVERIFIED',
      typeIcon: 'voter',
      expiresOn: 'Lifetime Validity',
      expiresOnHi: 'आजीवन वैधता',
      fileSize: '650 KB',
      verifiedDate: 'Pending Document Scan',
      verifiedDateHi: 'स्कैनिंग लंबित'
    }
  ]);

  // Dynamic counts for tabs and top KPIs
  const counts = useMemo(() => {
    return {
      total: documents.length,
      verified: documents.filter((d) => d.status === 'VERIFIED').length,
      pending: documents.filter((d) => d.status === 'PENDING').length,
      unverified: documents.filter((d) => d.status === 'UNVERIFIED').length,
      identity: documents.filter((d) => d.category === 'IDENTITY').length,
      address: documents.filter((d) => d.category === 'ADDRESS').length,
      certificates: documents.filter((d) => d.category === 'CERTIFICATES').length,
      other: documents.filter((d) => d.category === 'OTHER').length
    };
  }, [documents]);

  // Filtered and sorted documents
  const filteredDocuments = useMemo(() => {
    let list = [...documents];

    if (activeTab === 'IDENTITY') list = list.filter((d) => d.category === 'IDENTITY');
    else if (activeTab === 'ADDRESS') list = list.filter((d) => d.category === 'ADDRESS');
    else if (activeTab === 'CERTIFICATES') list = list.filter((d) => d.category === 'CERTIFICATES');
    else if (activeTab === 'OTHER') list = list.filter((d) => d.category === 'OTHER');

    // Status Filter (from top KPI cards)
    if (statusFilter !== 'ALL') {
      list = list.filter((d) => d.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.authority.toLowerCase().includes(q));
    }

    if (sortBy === 'LATEST') {
      // Natural order
    } else if (sortBy === 'NAME') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'STATUS') {
      list.sort((a, b) => a.status.localeCompare(b.status));
    }

    return list;
  }, [documents, activeTab, statusFilter, searchQuery, sortBy]);

  // Handle Select All Checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDocs(filteredDocuments.map((d) => d.id));
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter((dId) => dId !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'png', 'jpg', 'jpeg'].includes(ext)) {
      setUploadError(`Unsupported file format (.${ext}). Please upload a valid document in PDF, PNG, or JPG format.`);
      setUploadFileName('');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10 MB maximum limit. Please upload a smaller file.');
      setUploadFileName('');
      return;
    }

    setUploadError('');
    setUploadFileName(file.name);
  };

  // Handle Upload Submission
  const handleUploadSubmit = (e) => {
    e.preventDefault();

    if (!uploadFileName) {
      setUploadError('Please attach a valid document file (PDF, PNG, or JPG) before submitting.');
      return;
    }

    const ext = uploadFileName.split('.').pop().toLowerCase();
    if (!['pdf', 'png', 'jpg', 'jpeg'].includes(ext)) {
      setUploadError(`Unsupported file format (.${ext}). Only PDF, PNG, and JPG formats are accepted.`);
      return;
    }

    if (!uploadDocNumber.trim()) {
      setUploadError('Please enter the document identification number.');
      return;
    }

    setUploadError('');
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const newDoc = {
        id: `DOC-0${documents.length + 1}`,
        name: uploadDocType,
        code: uploadDocNumber.toUpperCase(),
        category: uploadCategory,
        issuedOn: '23 Oct 2026',
        authority: uploadAuthority,
        status: 'PENDING',
        typeIcon: 'certificate',
        expiresOn: '31 Dec 2030',
        fileSize: '1.1 MB',
        verifiedDate: 'Submitted for Verification'
      };

      setDocuments([newDoc, ...documents]);
      setUploadModalOpen(false);
      setUploadDocNumber('');
      setUploadFileName('');
      setUploadError('');
      showToast(`${uploadDocType} uploaded successfully and queued for digital verification!`);
    }, 900);
  };

  // Render document icon based on type
  const renderDocIcon = (typeIcon) => {
    switch (typeIcon) {
      case 'aadhaar':
        return (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1px solid #FDBA74',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '1.15rem' }}>🪪</span>
          </div>
        );
      case 'pan':
        return (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid #93C5FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CreditCard size={18} color="#2563EB" />
          </div>
        );
      case 'license':
        return (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            border: '1px solid #FCA5A5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Car size={18} color="#DC2626" />
          </div>
        );
      case 'certificate':
      case 'domicile':
        return (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            border: '1px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Award size={18} color="#16A34A" />
          </div>
        );
      case 'income':
        return (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FCD34D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            color: '#D97706',
            flexShrink: 0
          }}>
            ₹
          </div>
        );
      case 'caste':
        return (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
            border: '1px solid #D8B4FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck size={18} color="#9333EA" />
          </div>
        );
      default:
        return (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <FileText size={18} color="#475569" />
          </div>
        );
    }
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
          1. PAGE HERO BANNER (India Gate + Tricolor + Quote Box)
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
          {/* Breadcrumb matching screenshot: Home > Document Wallet */}
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
              {isHindi ? 'दस्तावेज़ वॉलेट' : 'Document Wallet'}
            </span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'दस्तावेज़ वॉलेट' : 'Document Wallet'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'अपने महत्वपूर्ण नागरिक दस्तावेज़ों को सुरक्षित रूप से संग्रहीत और प्रबंधित करें।' : 'Store and manage your important documents securely.'}
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
              <span>सुरक्षित दस्तावेज़<br />डिजीलॉकर प्रमाणित<br />सशक्त नागरिक</span>
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
          2. TOP 4 KPI CARDS (Matching Screenshot Row) - ACTIVE STATUS FILTERS
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem'
      }}>
        {/* KPI 1: Total Documents */}
        <div
          onClick={() => setStatusFilter('ALL')}
          style={{
            background: statusFilter === 'ALL' ? '#EFF6FF' : '#FFFFFF',
            borderRadius: '14px',
            border: statusFilter === 'ALL' ? '2px solid #2563EB' : '1px solid #E2E8F0',
            padding: '1rem 1.25rem',
            boxShadow: statusFilter === 'ALL' ? '0 4px 14px rgba(37, 99, 235, 0.15)' : '0 2px 8px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (statusFilter !== 'ALL') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#2563EB';
            }
          }}
          onMouseLeave={(e) => {
            if (statusFilter !== 'ALL') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} color="#2563EB" />
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {counts.total}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginTop: '0.2rem' }}>
                {isHindi ? 'कुल दस्तावेज़' : 'Total Documents'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {statusFilter === 'ALL' && (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563EB', background: '#DBEAFE', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                {isHindi ? 'सक्रिय' : 'ACTIVE'}
              </span>
            )}
            <ChevronRight size={18} color="#94A3B8" />
          </div>
        </div>

        {/* KPI 2: Verified Documents */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'VERIFIED' ? 'ALL' : 'VERIFIED')}
          style={{
            background: statusFilter === 'VERIFIED' ? '#F0FDF4' : '#FFFFFF',
            borderRadius: '14px',
            border: statusFilter === 'VERIFIED' ? '2px solid #16A34A' : '1px solid #E2E8F0',
            padding: '1rem 1.25rem',
            boxShadow: statusFilter === 'VERIFIED' ? '0 4px 14px rgba(22, 163, 74, 0.15)' : '0 2px 8px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (statusFilter !== 'VERIFIED') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#16A34A';
            }
          }}
          onMouseLeave={(e) => {
            if (statusFilter !== 'VERIFIED') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={20} color="#16A34A" />
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {counts.verified}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginTop: '0.2rem' }}>
                {isHindi ? 'सत्यापित दस्तावेज़' : 'Verified Documents'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {statusFilter === 'VERIFIED' && (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                {isHindi ? 'सक्रिय' : 'ACTIVE'}
              </span>
            )}
            <ChevronRight size={18} color="#94A3B8" />
          </div>
        </div>

        {/* KPI 3: Pending Verification */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'PENDING' ? 'ALL' : 'PENDING')}
          style={{
            background: statusFilter === 'PENDING' ? '#FFFBEB' : '#FFFFFF',
            borderRadius: '14px',
            border: statusFilter === 'PENDING' ? '2px solid #D97706' : '1px solid #E2E8F0',
            padding: '1rem 1.25rem',
            boxShadow: statusFilter === 'PENDING' ? '0 4px 14px rgba(217, 119, 6, 0.15)' : '0 2px 8px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (statusFilter !== 'PENDING') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#D97706';
            }
          }}
          onMouseLeave={(e) => {
            if (statusFilter !== 'PENDING') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={20} color="#D97706" />
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {counts.pending}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginTop: '0.2rem' }}>
                {isHindi ? 'लंबित सत्यापन' : 'Pending Verification'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {statusFilter === 'PENDING' && (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#B45309', background: '#FEF3C7', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                {isHindi ? 'सक्रिय' : 'ACTIVE'}
              </span>
            )}
            <ChevronRight size={18} color="#94A3B8" />
          </div>
        </div>

        {/* KPI 4: Unverified Documents */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'UNVERIFIED' ? 'ALL' : 'UNVERIFIED')}
          style={{
            background: statusFilter === 'UNVERIFIED' ? '#FEF2F2' : '#FFFFFF',
            borderRadius: '14px',
            border: statusFilter === 'UNVERIFIED' ? '2px solid #DC2626' : '1px solid #E2E8F0',
            padding: '1rem 1.25rem',
            boxShadow: statusFilter === 'UNVERIFIED' ? '0 4px 14px rgba(220, 38, 38, 0.15)' : '0 2px 8px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (statusFilter !== 'UNVERIFIED') {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#DC2626';
            }
          }}
          onMouseLeave={(e) => {
            if (statusFilter !== 'UNVERIFIED') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertCircle size={20} color="#DC2626" />
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {counts.unverified}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginTop: '0.2rem' }}>
                {isHindi ? 'असत्यापित दस्तावेज़' : 'Unverified Documents'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {statusFilter === 'UNVERIFIED' && (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#B91C1C', background: '#FEE2E2', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                {isHindi ? 'सक्रिय' : 'ACTIVE'}
              </span>
            )}
            <ChevronRight size={18} color="#94A3B8" />
          </div>
        </div>
      </div>

      {/* Status Filter Banner if active */}
      {statusFilter !== 'ALL' && (
        <div style={{
          background: statusFilter === 'VERIFIED' ? '#DCFCE7' : statusFilter === 'PENDING' ? '#FEF3C7' : '#FEE2E2',
          border: `1px solid ${statusFilter === 'VERIFIED' ? '#86EFAC' : statusFilter === 'PENDING' ? '#FDE68A' : '#FCA5A5'}`,
          borderRadius: '10px',
          padding: '0.55rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: statusFilter === 'VERIFIED' ? '#14532D' : statusFilter === 'PENDING' ? '#78350F' : '#7F1D1D'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>
              {isHindi
                ? `सक्रिय फ़िल्टर: ${statusFilter === 'VERIFIED' ? 'सत्यापित दस्तावेज़' : statusFilter === 'PENDING' ? 'लंबित सत्यापन' : 'असत्यापित दस्तावेज़'} प्रदर्शित (${filteredDocuments.length} आइटम)`
                : `Filter Active: Showing ${statusFilter === 'VERIFIED' ? 'Verified Documents' : statusFilter === 'PENDING' ? 'Pending Verification' : 'Unverified Documents'} (${filteredDocuments.length} items)`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            style={{
              background: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#0F172A',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {isHindi ? 'सभी दस्तावेज़ देखें ✕' : 'Show All Documents ✕'}
          </button>
        </div>
      )}

      {/* =========================================================
          3. MAIN TWO-COLUMN BODY
             Left/Center (72%): Filter Tabs + Document Table + Bottom 3 Cards
             Right Sidebar (28%): Storage + Quick Actions + Supported Docs + Need Help
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Main Card: Tabs + Table */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            overflow: 'hidden'
          }}>
            {/* Filter Tabs Bar + Sort Dropdown */}
            <div style={{
              padding: '0.75rem 1.25rem 0',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              {/* Category Filter Tabs */}
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {[
                  { id: 'ALL', label: isHindi ? `सभी दस्तावेज़ (${counts.total})` : `All Documents (${counts.total})` },
                  { id: 'IDENTITY', label: isHindi ? `पहचान प्रमाण (${counts.identity})` : `Identity Proofs (${counts.identity})` },
                  { id: 'ADDRESS', label: isHindi ? `पते के प्रमाण (${counts.address})` : `Address Proofs (${counts.address})` },
                  { id: 'CERTIFICATES', label: isHindi ? `प्रमाण पत्र (${counts.certificates})` : `Certificates (${counts.certificates})` },
                  { id: 'OTHER', label: isHindi ? `अन्य दस्तावेज़ (${counts.other})` : `Other Documents (${counts.other})` }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.65rem 0.15rem 0.75rem',
                        fontSize: '0.825rem',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#2563EB' : '#64748B',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'color 0.15s ease'
                      }}
                    >
                      {tab.label}
                      {isActive && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2.5px',
                          background: '#2563EB',
                          borderRadius: '2px 2px 0 0'
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Search, Filter & Sort Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
                {/* Search Input */}
                <div style={{ position: 'relative', width: '200px' }}>
                  <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isHindi ? 'दस्तावेज़ खोजें...' : 'Search documents...'}
                    style={{
                      width: '100%',
                      padding: '0.35rem 1.6rem 0.35rem 1.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.775rem',
                      color: '#0F172A',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '7px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Status Filter Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    color: statusFilter !== 'ALL' ? '#2563EB' : '#334155',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">{isHindi ? 'सभी स्थितियां' : 'All Statuses'}</option>
                  <option value="VERIFIED">{isHindi ? 'सत्यापित' : 'Verified'}</option>
                  <option value="PENDING">{isHindi ? 'लंबित' : 'Pending'}</option>
                  <option value="UNVERIFIED">{isHindi ? 'असत्यापित' : 'Unverified'}</option>
                </select>

                {/* Sort By Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    color: '#334155',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="LATEST">{isHindi ? 'क्रमबद्ध: नवीनतम' : 'Sort: Latest'}</option>
                  <option value="NAME">{isHindi ? 'क्रमबद्ध: नाम (अ-ह)' : 'Sort: Name (A-Z)'}</option>
                  <option value="STATUS">{isHindi ? 'क्रमबद्ध: स्थिति अनुसार' : 'Sort: By Status'}</option>
                </select>
              </div>
            </div>

            {/* Bulk Selection Notification Bar if any selected */}
            {selectedDocs.length > 0 && (
              <div style={{
                background: '#EFF6FF',
                borderBottom: '1px solid #BFDBFE',
                padding: '0.5rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.78rem',
                color: '#1E40AF',
                fontWeight: 600
              }}>
                <div>{selectedDocs.length} {isHindi ? 'दस्तावेज़ चयनित' : 'document(s) selected'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(isHindi ? `${selectedDocs.length} दस्तावेज़ों का ज़िप संग्रह डाउनलोड हो रहा है...` : `Downloading ZIP archive of ${selectedDocs.length} documents...`);
                      setSelectedDocs([]);
                    }}
                    style={{
                      background: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.28rem 0.75rem',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                  >
                    {isHindi ? 'चयनित डाउनलोड करें' : 'Download Selected'}
                  </button>

                  {/* Select All (only visible when not all documents are selected) */}
                  {selectedDocs.length < filteredDocuments.length && (
                    <button
                      type="button"
                      onClick={() => setSelectedDocs(filteredDocuments.map((d) => d.id))}
                      style={{
                        background: '#FFFFFF',
                        color: '#1D4ED8',
                        border: '1px solid #93C5FD',
                        borderRadius: '6px',
                        padding: '0.28rem 0.65rem',
                        cursor: 'pointer',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        boxShadow: '0 1px 2px rgba(37, 99, 235, 0.08)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F0F9FF';
                        e.currentTarget.style.borderColor = '#2563EB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#93C5FD';
                      }}
                    >
                      {isHindi ? 'सभी चुनें' : 'Select All'}
                    </button>
                  )}

                  {/* Deselect for 1 item, Deselect All for 2 or more items */}
                  <button
                    type="button"
                    onClick={() => setSelectedDocs([])}
                    style={{
                      background: '#FFFFFF',
                      color: '#DC2626',
                      border: '1px solid #FECACA',
                      borderRadius: '6px',
                      padding: '0.28rem 0.65rem',
                      cursor: 'pointer',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      boxShadow: '0 1px 2px rgba(220, 38, 38, 0.08)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FEE2E2';
                      e.currentTarget.style.borderColor = '#F87171';
                      e.currentTarget.style.color = '#B91C1C';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#FECACA';
                      e.currentTarget.style.color = '#DC2626';
                    }}
                  >
                    {selectedDocs.length === 1 ? (isHindi ? 'अचयनित करें' : 'Deselect') : (isHindi ? 'सभी अचयनित करें' : 'Deselect All')}
                  </button>
                </div>
              </div>
            )}

            {/* Documents Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>
                    <th style={{ padding: '0.75rem 1rem', width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={filteredDocuments.length > 0 && selectedDocs.length === filteredDocuments.length}
                        onChange={handleSelectAll}
                        style={{ cursor: 'pointer', accentColor: '#2563EB' }}
                      />
                    </th>
                    <th style={{ padding: '0.75rem 1rem' }}>{isHindi ? 'दस्तावेज़ का नाम' : 'Document Name'}</th>
                    <th style={{ padding: '0.75rem 1rem' }}>{isHindi ? 'जारी होने की तिथि' : 'Issued On'}</th>
                    <th style={{ padding: '0.75rem 1rem' }}>{isHindi ? 'जारीकर्ता प्राधिकरण' : 'Issuing Authority'}</th>
                    <th style={{ padding: '0.75rem 1rem' }}>{isHindi ? 'स्थिति' : 'Status'}</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{isHindi ? 'कार्रवाई' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📂</div>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                          {isHindi ? 'इस श्रेणी में कोई दस्तावेज़ नहीं मिला' : 'No documents found in this category'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                          {isHindi ? 'अपने पहचान प्रमाण, शैक्षणिक डिग्री या भूमि रिकॉर्ड अपलोड करें।' : 'Upload your identity proofs, educational degrees or land records.'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((doc) => {
                      const isSelected = selectedDocs.includes(doc.id);

                      return (
                        <tr
                          key={doc.id}
                          style={{
                            borderBottom: '1px solid #F1F5F9',
                            background: isSelected ? '#F0F9FF' : '#FFFFFF',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = '#FFFFFF';
                          }}
                        >
                          {/* Checkbox */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectOne(doc.id)}
                              style={{ cursor: 'pointer', accentColor: '#2563EB' }}
                            />
                          </td>

                          {/* Document Name + Code + Icon */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {renderDocIcon(doc.typeIcon)}
                              <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                                  {isHindi ? (doc.nameHi || doc.name) : doc.name}
                                </div>
                                <div style={{ fontSize: '0.725rem', color: '#64748B', fontFamily: 'monospace', letterSpacing: '0.02em', marginTop: '0.15rem' }}>
                                  {doc.code}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Issued On */}
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
                            {doc.issuedOn}
                          </td>

                          {/* Issuing Authority */}
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                            {isHindi ? (doc.authorityHi || doc.authority) : doc.authority}
                          </td>

                          {/* Status Pill Badge */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            {doc.status === 'VERIFIED' && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: '#DCFCE7',
                                color: '#15803D',
                                fontSize: '0.725rem',
                                fontWeight: 700,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '9999px'
                              }}>
                                <Check size={12} strokeWidth={3} />
                                <span>{isHindi ? 'सत्यापित' : 'Verified'}</span>
                              </span>
                            )}
                            {doc.status === 'PENDING' && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: '#FEF3C7',
                                color: '#B45309',
                                fontSize: '0.725rem',
                                fontWeight: 700,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '9999px'
                              }}>
                                <Clock size={12} strokeWidth={2.5} />
                                <span>{isHindi ? 'लंबित' : 'Pending'}</span>
                              </span>
                            )}
                            {doc.status === 'UNVERIFIED' && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: '#FEE2E2',
                                color: '#B91C1C',
                                fontSize: '0.725rem',
                                fontWeight: 700,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '9999px'
                              }}>
                                <AlertCircle size={12} strokeWidth={2.5} />
                                <span>{isHindi ? 'असत्यापित' : 'Unverified'}</span>
                              </span>
                            )}
                          </td>

                          {/* Action Buttons: View, Download, Options */}
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                              {/* View Button */}
                              <button
                                type="button"
                                onClick={() => setViewDocModal(doc)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  background: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  borderRadius: '6px',
                                  padding: '0.35rem 0.65rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: '#2563EB',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#EFF6FF';
                                  e.currentTarget.style.borderColor = '#93C5FD';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#FFFFFF';
                                  e.currentTarget.style.borderColor = '#CBD5E1';
                                }}
                              >
                                <Eye size={13} />
                                <span>{isHindi ? 'देखें' : 'View'}</span>
                              </button>

                              {/* Download Icon Button */}
                              <button
                                type="button"
                                onClick={() => handleDownloadDoc(doc)}
                                title={isHindi ? 'प्रमाणित दस्तावेज़ डाउनलोड करें' : 'Download Certified Document'}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  borderRadius: '6px',
                                  padding: '0.35rem 0.45rem',
                                  color: '#475569',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#F8FAFC';
                                  e.currentTarget.style.color = '#2563EB';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#FFFFFF';
                                  e.currentTarget.style.color = '#475569';
                                }}
                              >
                                <Download size={14} />
                              </button>

                              {/* 3-Dots Menu */}
                              <div style={{ position: 'relative' }}>
                                <button
                                  type="button"
                                  onClick={() => setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.35rem',
                                    color: '#64748B',
                                    cursor: 'pointer',
                                    borderRadius: '4px'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0F172A'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
                                >
                                  <MoreVertical size={16} />
                                </button>

                                {/* Dropdown menu */}
                                {activeMenuDocId === doc.id && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      right: 0,
                                      top: '100%',
                                      background: '#FFFFFF',
                                      border: '1px solid #E2E8F0',
                                      borderRadius: '8px',
                                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                                      padding: '0.35rem',
                                      zIndex: 20,
                                      minWidth: '150px',
                                      textAlign: 'left'
                                    }}
                                  >
                                    <div
                                      onClick={() => {
                                        setViewDocModal(doc);
                                        setActiveMenuDocId(null);
                                      }}
                                      style={{
                                        padding: '0.45rem 0.65rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#334155',
                                        cursor: 'pointer',
                                        borderRadius: '4px'
                                      }}
                                      onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                      {isHindi ? 'विवरण देखें' : 'View Details'}
                                    </div>
                                    <div
                                      onClick={() => {
                                        if (navigator.clipboard) {
                                          navigator.clipboard.writeText(`https://janpehchaan.gov.in/verify/${doc.id}?code=${doc.code}`);
                                        }
                                        showToast(isHindi ? `${doc.nameHi || doc.name} के लिए सत्यापन लिंक क्लिपबोर्ड पर कॉपी किया गया!` : `Verification link copied to clipboard for ${doc.name}!`);
                                        setActiveMenuDocId(null);
                                      }}
                                      style={{
                                        padding: '0.45rem 0.65rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#334155',
                                        cursor: 'pointer',
                                        borderRadius: '4px'
                                      }}
                                      onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                      {isHindi ? 'सत्यापन लिंक साझा करें' : 'Share Verification Link'}
                                    </div>
                                    <div
                                      onClick={() => {
                                        setDocuments(documents.map((d) => (d.id === doc.id ? { ...d, status: 'PENDING', verifiedDate: 'Re-verification in progress...', verifiedDateHi: 'पुनः सत्यापन जारी...' } : d)));
                                        showToast(isHindi ? `${doc.nameHi || doc.name} के लिए पुनः सत्यापन का अनुरोध किया गया।` : `Re-verification requested for ${doc.name}.`);
                                        setActiveMenuDocId(null);
                                      }}
                                      style={{
                                        padding: '0.45rem 0.65rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#2563EB',
                                        cursor: 'pointer',
                                        borderRadius: '4px'
                                      }}
                                      onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                      {isHindi ? 'ऑनलाइन पुनः सत्यापन' : 'Re-verify Online'}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* =======================================================
              BOTTOM ROW: 3 CARDS (Recent Activity, Expiring Soon, Verification Status)
              ======================================================= */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            {/* CARD 1: RECENT ACTIVITY */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.15rem 1.25rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Clock size={14} color="#2563EB" />
                  </div>
                  <h3 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'हालिया गतिविधियां' : 'Recent Activity'}
                  </h3>
                </div>
                <span
                  onClick={() => setAuditLogsModalOpen(true)}
                  style={{ fontSize: '0.725rem', fontWeight: 700, color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.15rem' }}
                >
                  {isHindi ? 'सभी देखें' : 'View All'} <ChevronRight size={13} />
                </span>
              </div>

              {/* Timeline Items matching screenshot */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Item 1: Income Certificate verified */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#DCFCE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Check size={12} color="#15803D" strokeWidth={3} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F172A' }}>
                        {isHindi ? 'आय प्रमाण पत्र सत्यापित हुआ' : 'Income Certificate verified'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.1rem' }}>
                        14 Oct 2026, 10:32 AM
                      </div>
                    </div>
                  </div>
                  <span style={{
                    background: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px'
                  }}>
                    {isHindi ? 'सत्यापित' : 'Verified'}
                  </span>
                </div>

                {/* Item 2: Driving License under verification */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#FEF3C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Clock size={12} color="#B45309" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F172A' }}>
                        {isHindi ? 'ड्राइविंग लाइसेंस सत्यापन प्रक्रियाधीन' : 'Driving License under verification'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.1rem' }}>
                        18 Aug 2023, 02:15 PM
                      </div>
                    </div>
                  </div>
                  <span style={{
                    background: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px'
                  }}>
                    {isHindi ? 'लंबित' : 'Pending'}
                  </span>
                </div>

                {/* Item 3: Aadhaar Card viewed */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Eye size={12} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'आधार कार्ड देखा गया' : 'Aadhaar Card viewed'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.1rem' }}>
                      12 Oct 2026, 11:21 AM
                    </div>
                  </div>
                </div>

                {/* Item 4: Document uploaded: Caste Certificate */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <UploadCloud size={12} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'दस्तावेज़ अपलोड किया गया: जाति प्रमाण पत्र' : 'Document uploaded: Caste Certificate'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.1rem' }}>
                      08 Oct 2026, 09:40 AM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: DOCUMENTS EXPIRING SOON */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.15rem 1.25rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Calendar size={14} color="#2563EB" />
                  </div>
                  <h3 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'जल्द समाप्त होने वाले दस्तावेज़' : 'Documents Expiring Soon'}
                  </h3>
                </div>
                <span
                  onClick={() => setValidityModalOpen(true)}
                  style={{ fontSize: '0.725rem', fontWeight: 700, color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.15rem' }}
                >
                  {isHindi ? 'सभी देखें' : 'View All'} <ChevronRight size={13} />
                </span>
              </div>

              {/* Items matching screenshot */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Item 1: Driving License */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: '#FEF2F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Car size={13} color="#DC2626" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F172A' }}>
                        {isHindi ? 'ड्राइविंग लाइसेंस' : 'Driving License'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                        {isHindi ? '18 अगस्त 2033 को समाप्त' : 'Expires on 18 Aug 2033'}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    background: '#EFF6FF',
                    color: '#2563EB',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px'
                  }}>
                    {isHindi ? '7 वर्ष शेष' : '7 years left'}
                  </span>
                </div>

                {/* Item 2: PAN Card */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <CreditCard size={13} color="#2563EB" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F172A' }}>
                        {isHindi ? 'पैन कार्ड' : 'PAN Card'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                        {isHindi ? '05 मार्च 2031 को समाप्त' : 'Expires on 05 Mar 2031'}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    background: '#EFF6FF',
                    color: '#2563EB',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px'
                  }}>
                    {isHindi ? '5 वर्ष शेष' : '5 years left'}
                  </span>
                </div>

                {/* Item 3: Passport */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: '#F0FDF4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <BookOpen size={13} color="#16A34A" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F172A' }}>
                        {isHindi ? 'पासपोर्ट' : 'Passport'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                        {isHindi ? '12 जनवरी 2030 को समाप्त' : 'Expires on 12 Jan 2030'}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    background: '#EFF6FF',
                    color: '#2563EB',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px'
                  }}>
                    {isHindi ? '4 वर्ष शेष' : '4 years left'}
                  </span>
                </div>

                {/* Item 4: Ration Card */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: '#FFFBEB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '0.8rem' }}>📋</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F172A' }}>
                        {isHindi ? 'राशन कार्ड' : 'Ration Card'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                        {isHindi ? '30 जून 2028 को समाप्त' : 'Expires on 30 Jun 2028'}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    background: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px'
                  }}>
                    {isHindi ? '2 वर्ष शेष' : '2 years left'}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 3: VERIFICATION STATUS (Donut Chart) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.15rem 1.25rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.95rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={14} color="#2563EB" />
                </div>
                <h3 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'सत्यापन स्थिति' : 'Verification Status'}
                </h3>
              </div>

              {/* Chart & Legend Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '0.75rem', marginTop: 'auto', marginBottom: 'auto' }}>
                {/* SVG Donut Chart */}
                <div style={{ position: 'relative', width: '92px', height: '92px', flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {/* Background track */}
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="3.6"
                    />
                    {/* Segment 1: Verified (5 of 8 = 62.5%) */}
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3.6"
                      strokeDasharray="62.5, 100"
                      strokeDashoffset="0"
                    />
                    {/* Segment 2: Pending (2 of 8 = 25%) */}
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3.6"
                      strokeDasharray="25, 100"
                      strokeDashoffset="-62.5"
                    />
                    {/* Segment 3: Unverified (1 of 8 = 12.5%) */}
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="3.6"
                      strokeDasharray="12.5, 100"
                      strokeDashoffset="-87.5"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                      {counts.total}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600 }}>
                      {isHindi ? 'कुल' : 'Total'}
                    </div>
                  </div>
                </div>

                {/* Legend matching screenshot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                      <span style={{ color: '#475569' }}>{isHindi ? 'सत्यापित' : 'Verified'}</span>
                    </div>
                    <strong style={{ color: '#0F172A' }}>{counts.verified}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                      <span style={{ color: '#475569' }}>{isHindi ? 'लंबित' : 'Pending'}</span>
                    </div>
                    <strong style={{ color: '#0F172A' }}>{counts.pending}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                      <span style={{ color: '#475569' }}>{isHindi ? 'असत्यापित' : 'Unverified'}</span>
                    </div>
                    <strong style={{ color: '#0F172A' }}>{counts.unverified}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94A3B8', display: 'inline-block' }} />
                      <span style={{ color: '#475569' }}>{isHindi ? 'समाप्त' : 'Expired'}</span>
                    </div>
                    <strong style={{ color: '#0F172A' }}>0</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            RIGHT COLUMN: 4 WIDGETS
            1. Storage Usage
            2. Quick Actions
            3. Supported Documents
            4. Need Help with Document Wallet?
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. STORAGE USAGE */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UploadCloud size={16} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'स्टोरेज उपयोग' : 'Storage Usage'}
              </h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '0.45rem' }}>
              <span style={{ color: '#334155', fontWeight: 600 }}>6.2 MB <span style={{ color: '#64748B', fontWeight: 400 }}>{isHindi ? '100 MB में से प्रयुक्त' : 'of 100 MB used'}</span></span>
              <span style={{ fontWeight: 800, color: '#2563EB' }}>6%</span>
            </div>

            {/* Storage Progress Bar */}
            <div style={{
              height: '7px',
              background: '#F1F5F9',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <div style={{
                height: '100%',
                width: '6%',
                background: 'linear-gradient(90deg, #10B981 0%, #2563EB 100%)',
                borderRadius: '9999px'
              }} />
            </div>

            {/* Upload Document Button */}
            <button
              type="button"
              onClick={() => setUploadModalOpen(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                background: '#FFFFFF',
                border: '1px solid #2563EB',
                borderRadius: '8px',
                padding: '0.55rem 0.85rem',
                fontSize: '0.825rem',
                fontWeight: 700,
                color: '#2563EB',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EFF6FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              <span>{isHindi ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 2. QUICK ACTIONS */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.95rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={16} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'त्वरित कार्रवाइयां' : 'Quick Actions'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Action 1: Upload Document */}
              <div
                onClick={() => setUploadModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UploadCloud size={16} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'अपने वॉलेट में नया दस्तावेज़ जोड़ें' : 'Add a new document to your wallet'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>

              {/* Action 2: Organize Documents */}
              <div
                onClick={() => setOrganizeModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Folder size={16} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'दस्तावेज़ व्यवस्थित करें' : 'Organize Documents'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'अपने दस्तावेज़ देखें और प्रबंधित करें' : 'View and manage your documents'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>
            </div>
          </div>

          {/* 3. SUPPORTED DOCUMENTS */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.95rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={16} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'समर्थित दस्तावेज़' : 'Supported Documents'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Category 1: Identity Proofs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#ECFDF5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CreditCard size={14} color="#059669" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0F172A', lineHeight: 1.3 }}>
                  <strong style={{ fontWeight: 700 }}>{isHindi ? 'पहचान प्रमाण' : 'Identity Proofs'}</strong>{' '}
                  <span style={{ color: '#64748B' }}>{isHindi ? '(आधार, पैन, वोटर आईडी)' : '(Aadhaar, PAN, Voter ID)'}</span>
                </div>
              </div>

              {/* Category 2: Address Proofs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#FEF2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Car size={14} color="#DC2626" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0F172A', lineHeight: 1.3 }}>
                  <strong style={{ fontWeight: 700 }}>{isHindi ? 'पते के प्रमाण' : 'Address Proofs'}</strong>{' '}
                  <span style={{ color: '#64748B' }}>{isHindi ? '(राशन कार्ड, ड्राइविंग लाइसेंस)' : '(Ration Card, Driving License)'}</span>
                </div>
              </div>

              {/* Category 3: Certificates */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#FFFBEB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={14} color="#D97706" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0F172A', lineHeight: 1.3 }}>
                  <strong style={{ fontWeight: 700 }}>{isHindi ? 'प्रमाण पत्र' : 'Certificates'}</strong>{' '}
                  <span style={{ color: '#64748B' }}>{isHindi ? '(मूल निवास, आय, जाति, जन्म)' : '(Domicile, Income, Caste, Birth)'}</span>
                </div>
              </div>

              {/* Category 4: Education Documents */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <BookOpen size={14} color="#2563EB" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0F172A', lineHeight: 1.3 }}>
                  <strong style={{ fontWeight: 700 }}>{isHindi ? 'शैक्षणिक दस्तावेज़' : 'Education Documents'}</strong>{' '}
                  <span style={{ color: '#64748B' }}>{isHindi ? '(10वीं, 12वीं, डिग्री)' : '(10th, 12th, Degree)'}</span>
                </div>
              </div>

              {/* Category 5: Other Documents */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#FAF5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Folder size={14} color="#9333EA" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0F172A', lineHeight: 1.3 }}>
                  <strong style={{ fontWeight: 700 }}>{isHindi ? 'अन्य दस्तावेज़' : 'Other Documents'}</strong>{' '}
                  <span style={{ color: '#64748B' }}>{isHindi ? '(पासपोर्ट, संपत्ति, आदि)' : '(Passport, Property, etc.)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. NEED HELP WITH DOCUMENT WALLET? */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.45rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Headphones size={16} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'दस्तावेज़ वॉलेट से सहायता चाहिए?' : 'Need Help with Document Wallet?'}
              </h3>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4, margin: '0 0 0.85rem 0' }}>
              {isHindi ? 'अपने दस्तावेज़ों को अपलोड करने, सत्यापित करने या एक्सेस करने में सहायता के लिए हमारी सहायता टीम से संपर्क करें।' : 'Contact our support team for assistance with uploading, verifying or accessing your documents.'}
            </p>

            <button
              type="button"
              onClick={() => {
                showToast(isHindi ? 'डिजिटल लॉकर एवं वॉलेट सहायता डेस्क से जोड़ा जा रहा है...' : 'Connecting to Digital Locker & Wallet Helpdesk...');
                if (onNavigateTab) onNavigateTab('support');
              }}
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
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EFF6FF';
                e.currentTarget.style.borderColor = '#93C5FD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
            >
              <span>{isHindi ? 'सहायता केंद्र से संपर्क करें' : 'Contact Support'}</span>
              <span style={{ fontSize: '0.85rem' }}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          MODAL 1: VIEW DOCUMENT PREVIEW
          ========================================================= */}
      {viewDocModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '680px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '1.15rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldCheck size={20} color="#60A5FA" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                    {isHindi ? (viewDocModal.nameHi || viewDocModal.name) : viewDocModal.name} {isHindi ? 'पूर्वावलोकन' : 'Preview'}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    {isHindi ? 'डिजीलॉकर सरकारी गेटवे द्वारा प्रमाणित' : 'Authenticated via DigiLocker Government Gateway'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewDocModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Document Digital Replica Box */}
            <div style={{ padding: '1.5rem', background: '#F8FAFC' }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
              }}>
                {/* Ashoka Chakra background watermark */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.06) 20%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }} />

                {/* Top Replica Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isHindi ? `भारत सरकार / ${viewDocModal.authorityHi || viewDocModal.authority}` : `Government of India / ${viewDocModal.authority}`}
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                      {isHindi ? (viewDocModal.nameHi || viewDocModal.name) : viewDocModal.name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      background: viewDocModal.status === 'VERIFIED' ? '#DCFCE7' : '#FEF3C7',
                      color: viewDocModal.status === 'VERIFIED' ? '#15803D' : '#B45309',
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <CheckCircle2 size={12} />
                      {viewDocModal.status === 'VERIFIED' ? (isHindi ? 'सत्यापित' : 'VERIFIED') : (isHindi ? 'लंबित' : 'PENDING')}
                    </span>
                  </div>
                </div>

                {/* Document Information Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>
                      {isHindi ? 'दस्तावेज़ संख्या / पहचान:' : 'Document Number / ID:'}
                    </span>
                    <strong style={{ color: '#0F172A', fontFamily: 'monospace', fontSize: '0.875rem' }}>{viewDocModal.code}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>
                      {isHindi ? 'जारीकर्ता नागरिक:' : 'Issued To:'}
                    </span>
                    <strong style={{ color: '#0F172A' }}>{user?.name || (isHindi ? 'रमेश कुमार शर्मा' : 'Ramesh Kumar Sharma')}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>
                      {isHindi ? 'जारी करने की तिथि:' : 'Issue Date:'}
                    </span>
                    <strong style={{ color: '#0F172A' }}>{viewDocModal.issuedOn}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>
                      {isHindi ? 'वैधता अवधि:' : 'Valid Until:'}
                    </span>
                    <strong style={{ color: '#0F172A' }}>
                      {isHindi ? (viewDocModal.expiresOnHi || viewDocModal.expiresOn) : viewDocModal.expiresOn}
                    </strong>
                  </div>
                </div>

                {/* QR and Verification Stamp Footer */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <QrCode size={28} color="#0F172A" />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      <div>{isHindi ? 'क्रिप्टोग्राफ़िक डिजिटल हस्ताक्षर सत्यापित' : 'Cryptographic Signature Verified'}</div>
                      <div style={{ color: '#16A34A', fontWeight: 700 }}>{isHindi ? 'SHA-256 प्रमाणित ✓' : 'SHA-256 Validated ✓'}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.725rem', color: '#64748B', textAlign: 'right' }}>
                    <div>{isHindi ? 'प्राधिकरण:' : 'Authority:'} <strong>{isHindi ? (viewDocModal.authorityHi || viewDocModal.authority) : viewDocModal.authority}</strong></div>
                    <div>{isHindi ? 'फ़ाइल आकार:' : 'File Size:'} <strong>{viewDocModal.fileSize}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ padding: '1rem 1.5rem', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={() => setViewDocModal(null)}
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
                {isHindi ? 'बंद करें' : 'Close'}
              </button>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.5rem 0.95rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={15} />
                  <span>{isHindi ? 'प्रिंट करें' : 'Print'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleDownloadDoc(viewDocModal);
                    setViewDocModal(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1.15rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={15} />
                  <span>{isHindi ? 'पीडीएफ डाउनलोड करें' : 'Download PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: UPLOAD DOCUMENT MODAL
          ========================================================= */}
      {uploadModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Header */}
            <div style={{
              background: '#2563EB',
              color: '#FFFFFF',
              padding: '1.15rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <UploadCloud size={20} color="#FFFFFF" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                    {isHindi ? 'नया दस्तावेज़ अपलोड करें' : 'Upload New Document'}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#BFDBFE' }}>
                    {isHindi ? 'सुरक्षित डिजीलॉकर एन्क्रिप्टेड क्लाउड स्टोरेज' : 'Secure DigiLocker encrypted cloud storage'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUploadSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Category Selection */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'दस्तावेज़ श्रेणी' : 'Document Category'}
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => {
                      setUploadCategory(e.target.value);
                      if (e.target.value === 'IDENTITY') {
                        setUploadDocType('Voter ID Card');
                        setUploadAuthority('Election Commission of India');
                      } else if (e.target.value === 'ADDRESS') {
                        setUploadDocType('Electricity / Utility Bill');
                        setUploadAuthority('Power Distribution Corp');
                      } else if (e.target.value === 'CERTIFICATES') {
                        setUploadDocType('Birth Certificate');
                        setUploadAuthority('Municipal Corporation');
                      } else {
                        setUploadDocType('Passport');
                        setUploadAuthority('Ministry of External Affairs');
                      }
                    }}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      fontSize: '0.825rem',
                      color: '#0F172A',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="IDENTITY">{isHindi ? 'पहचान प्रमाण' : 'Identity Proof'}</option>
                    <option value="ADDRESS">{isHindi ? 'पते का प्रमाण' : 'Address Proof'}</option>
                    <option value="CERTIFICATES">{isHindi ? 'प्रमाण पत्र' : 'Certificate'}</option>
                    <option value="OTHER">{isHindi ? 'अन्य आधिकारिक दस्तावेज़' : 'Other Official Document'}</option>
                  </select>
                </div>

                {/* Document Type */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'दस्तावेज़ का नाम / प्रकार' : 'Document Name / Type'}
                  </label>
                  <input
                    type="text"
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
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

                {/* Issuing Authority */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'जारीकर्ता प्राधिकरण' : 'Issuing Authority'}
                  </label>
                  <input
                    type="text"
                    value={uploadAuthority}
                    onChange={(e) => setUploadAuthority(e.target.value)}
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

                {/* Document ID / Number */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'दस्तावेज़ पहचान संख्या' : 'Document Identification Number'}
                  </label>
                  <input
                    type="text"
                    value={uploadDocNumber}
                    onChange={(e) => setUploadDocNumber(e.target.value)}
                    placeholder={isHindi ? 'उदा. EPIC-992144 या DL-092023...' : 'e.g. EPIC-992144 or DL-092023...'}
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

                {/* Drag and Drop Box */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'पीडीएफ / इमेज फ़ाइल चुनें (अधिकतम 10 MB)' : 'Select PDF / Image File (Max 10 MB)'}
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg"
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const ext = file.name.split('.').pop().toLowerCase();
                        if (!['pdf', 'png', 'jpg', 'jpeg'].includes(ext)) {
                          setUploadError(`Unsupported file format (.${ext}). Only PDF, PNG, and JPG formats are accepted.`);
                          setUploadFileName('');
                          return;
                        }
                        setUploadError('');
                        setUploadFileName(file.name);
                      }
                    }}
                    style={{
                      border: uploadError ? '2px dashed #FCA5A5' : '2px dashed #93C5FD',
                      borderRadius: '10px',
                      background: uploadError ? '#FEF2F2' : '#EFF6FF',
                      padding: '1.25rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <UploadCloud size={28} color={uploadError ? '#DC2626' : '#2563EB'} style={{ margin: '0 auto 0.4rem' }} />
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: uploadError ? '#DC2626' : '#1E40AF' }}>
                      {uploadFileName ? `${isHindi ? 'चयनित: ' : 'Selected: '}${uploadFileName}` : (isHindi ? 'फ़ाइल चुनने के लिए क्लिक करें या यहाँ खींचें' : 'Click to browse or drag file here')}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.2rem' }}>
                      {isHindi ? 'समर्थित: PDF, PNG, JPG (ई-हस्ताक्षरित दस्तावेज़ स्वतः सत्यापित होते हैं)' : 'Supports PDF, PNG, JPG (e-Signed docs automatically verified)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inline Error Message right before Save & Verify Document */}
              {uploadError && (
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  marginTop: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#DC2626',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}>
                  <AlertCircle size={15} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => {
                    setUploadError('');
                    setUploadModalOpen(false);
                  }}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.55rem 1.25rem',
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
                  disabled={isUploading}
                  style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 1.45rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {isUploading ? (isHindi ? 'अपलोड हो रहा है...' : 'Uploading...') : (isHindi ? 'दस्तावेज़ सहेजें व सत्यापित करें' : 'Save & Verify Document')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ORGANIZE DOCUMENTS VAULT
          ========================================================= */}
      {organizeModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '680px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  <Folder size={18} color="#60A5FA" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                    {isHindi ? 'दस्तावेज़ वॉल्ट व्यवस्थित करें' : 'Organize Document Vault'}
                  </h3>
                  <span style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34D399',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px'
                  }}>
                    {isHindi ? 'AES-256 सुरक्षित' : 'AES-256 SECURED'}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                  {isHindi ? 'फ़ोल्डर निर्देशिकाएं प्रबंधित करें और नागरिक पहचान दस्तावेज़ों को क्रमबद्ध करें।' : 'Manage folder directories and sort citizen identity documents.'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOrganizeModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
              {/* Action Ribbon */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                  {isHindi ? 'वॉल्ट फ़ोल्डर चुनें:' : 'SELECT VAULT FOLDER:'}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(isHindi ? 'वॉल्ट स्वतः वर्गीकृत किया गया! सभी दस्तावेज़ सरकारी मानकों के अनुरूप संरेखित।' : 'Vault auto-categorized! All documents aligned to government compliance standards.');
                    }}
                    style={{
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '6px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#2563EB',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <span>{isHindi ? '✨ 1-क्लिक स्वतः व्यवस्थित करें' : '✨ 1-Click Auto-Organize'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const name = window.prompt(isHindi ? 'नया कस्टम फ़ोल्डर नाम दर्ज करें:' : 'Enter new custom folder name:');
                      if (name && name.trim()) {
                        showToast(isHindi ? `एन्क्रिप्टेड वॉल्ट में कस्टम फ़ोल्डर "${name}" बनाया गया।` : `Custom folder "${name}" created in encrypted vault.`);
                      }
                    }}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? '+ नया फ़ोल्डर' : '+ New Folder'}
                  </button>
                </div>
              </div>

              {/* Folder Pills Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
                {[
                  { id: 'IDENTITY', label: isHindi ? 'पहचान प्रमाण' : 'Identity Proofs', icon: '🪪', count: documents.filter((d) => d.category === 'IDENTITY').length },
                  { id: 'ADDRESS', label: isHindi ? 'पते के प्रमाण' : 'Address Proofs', icon: '🏠', count: documents.filter((d) => d.category === 'ADDRESS').length },
                  { id: 'CERTIFICATES', label: isHindi ? 'प्रमाण पत्र' : 'Certificates', icon: '📜', count: documents.filter((d) => d.category === 'CERTIFICATES').length },
                  { id: 'OTHER', label: isHindi ? 'अन्य रिकॉर्ड' : 'Other Records', icon: '📂', count: documents.filter((d) => d.category === 'OTHER').length }
                ].map((folder) => {
                  const isFolderActive = selectedFolder === folder.id;
                  return (
                    <div
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      style={{
                        background: isFolderActive ? '#EFF6FF' : '#F8FAFC',
                        border: isFolderActive ? '2px solid #2563EB' : '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem' }}>{folder.icon}</span>
                        <span style={{
                          background: isFolderActive ? '#2563EB' : '#E2E8F0',
                          color: isFolderActive ? '#FFFFFF' : '#64748B',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.45rem',
                          borderRadius: '9999px'
                        }}>
                          {folder.count} {isHindi ? 'फ़ाइलें' : 'files'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: isFolderActive ? '#2563EB' : '#0F172A', marginTop: '0.2rem' }}>
                        {folder.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Documents inside Selected Folder */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
                  {isHindi
                    ? `वर्तमान निर्देशिका में दस्तावेज़ (${documents.filter((d) => d.category === selectedFolder).length} फ़ाइलें):`
                    : `DOCUMENTS IN CURRENT DIRECTORY (${documents.filter((d) => d.category === selectedFolder).length} FILES):`}
                </div>

                {documents.filter((d) => d.category === selectedFolder).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748B', fontSize: '0.8rem', background: '#F8FAFC', borderRadius: '10px' }}>
                    {isHindi ? 'वर्तमान में इस निर्देशिका में कोई दस्तावेज़ संग्रहीत नहीं है।' : 'No documents currently stored in this directory.'}
                  </div>
                ) : (
                  documents
                    .filter((d) => d.category === selectedFolder)
                    .map((doc) => (
                      <div
                        key={doc.id}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '10px',
                          padding: '0.75rem 0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          {renderDocIcon(doc.typeIcon)}
                          <div>
                            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>
                              {isHindi ? (doc.nameHi || doc.name) : doc.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                              {doc.code} • {isHindi ? (doc.authorityHi || doc.authority) : doc.authority} • {doc.fileSize}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select
                            defaultValue={doc.category}
                            onChange={(e) => {
                              const newCat = e.target.value;
                              setDocuments(documents.map((d) => (d.id === doc.id ? { ...d, category: newCat } : d)));
                              showToast(isHindi ? `"${doc.nameHi || doc.name}" को ${newCat} निर्देशिका में स्थानांतरित किया गया।` : `Moved "${doc.name}" to ${newCat} directory.`);
                            }}
                            style={{
                              background: '#F8FAFC',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              padding: '0.3rem 0.55rem',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: '#334155',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="IDENTITY">{isHindi ? 'स्थानांतरित करें: पहचान' : 'Move to: Identity'}</option>
                            <option value="ADDRESS">{isHindi ? 'स्थानांतरित करें: पता' : 'Move to: Address'}</option>
                            <option value="CERTIFICATES">{isHindi ? 'स्थानांतरित करें: प्रमाण पत्र' : 'Move to: Certificates'}</option>
                            <option value="OTHER">{isHindi ? 'स्थानांतरित करें: अन्य' : 'Move to: Other'}</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              setViewDocModal(doc);
                              setOrganizeModalOpen(false);
                            }}
                            style={{
                              background: '#2563EB',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.3rem 0.65rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {isHindi ? 'देखें' : 'View'}
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '0.85rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                {isHindi ? 'सभी दस्तावेज़ AES-256 क्लाउड कंटेनर में सुरक्षित हैं।' : 'All document files stored in AES-256 cloud container.'}
              </div>
              <button
                type="button"
                onClick={() => setOrganizeModalOpen(false)}
                style={{
                  background: '#2563EB',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.45rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'पूर्ण' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: FULL ACTIVITY AUDIT LOGS
          ========================================================= */}
      {auditLogsModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '750px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '85vh'
          }}>
            {/* Header */}
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Clock size={20} color="#60A5FA" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                    {isHindi ? 'दस्तावेज़ गतिविधि एवं ऑडिट लॉग' : 'Document Activity & Audit Logs'}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    {isHindi ? 'नागरिक दस्तावेज़ लेनदेन और सत्यापन का अपरिवर्तनीय कालानुक्रमिक रिकॉर्ड' : 'Immutable chronological record of citizen document transactions & verifications'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuditLogsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Logs Table */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 700, background: '#F8FAFC' }}>
                    <th style={{ padding: '0.65rem 0.75rem' }}>{isHindi ? 'समय / दिनांक' : 'Timestamp'}</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>{isHindi ? 'दस्तावेज़' : 'Document'}</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>{isHindi ? 'गतिविधि विवरण' : 'Activity Event'}</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>{isHindi ? 'प्राधिकरण / आईपी' : 'Authority / IP'}</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>{isHindi ? 'स्थिति' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: '14 Oct 2026, 10:32 AM', doc: 'Income Certificate', docHi: 'आय प्रमाण पत्र', event: 'Document Verified Online', eventHi: 'दस्तावेज़ ऑनलाइन सत्यापित हुआ', auth: 'Revenue Dept (UP)', authHi: 'राजस्व विभाग (उ.प्र.)', ip: '103.24.182.90', status: 'VERIFIED' },
                    { time: '12 Oct 2026, 11:21 AM', doc: 'Aadhaar Card', docHi: 'आधार कार्ड', event: 'DigiLocker QR Scan & View', eventHi: 'डिजीलॉकर क्यूआर स्कैन व देखा गया', auth: 'UIDAI Gateway', authHi: 'यूआईडीएआई गेटवे', ip: '157.34.201.12', status: 'VERIFIED' },
                    { time: '08 Oct 2026, 09:40 AM', doc: 'Caste Certificate', docHi: 'जाति प्रमाण पत्र', event: 'New File Upload & Submit', eventHi: 'नई फ़ाइल अपलोड व जमा की गई', auth: 'Citizen Portal', authHi: 'नागरिक पोर्टल', ip: '103.24.182.90', status: 'VERIFIED' },
                    { time: '18 Aug 2023, 02:15 PM', doc: 'Driving License', docHi: 'ड्राइविंग लाइसेंस', event: 'Queued for Field Verification', eventHi: 'स्थलीय सत्यापन हेतु कतारबद्ध', auth: 'Transport Dept', authHi: 'परिवहन विभाग', ip: '49.36.128.4', status: 'PENDING' },
                    { time: '05 Mar 2021, 03:15 PM', doc: 'PAN Card', docHi: 'पैन कार्ड', event: 'PAN-Aadhaar Link Confirmed', eventHi: 'पैन-आधार लिंक की पुष्टि हुई', auth: 'Income Tax Dept', authHi: 'आयकर विभाग', ip: '164.100.24.1', status: 'VERIFIED' },
                    { time: '12 Jan 2020, 11:30 AM', doc: 'Aadhaar Card', docHi: 'आधार कार्ड', event: 'Initial Aadhaar Authentication', eventHi: 'प्रारंभिक आधार प्रमाणीकरण', auth: 'UIDAI', authHi: 'यूआईडीएआई (UIDAI)', ip: '164.100.12.8', status: 'VERIFIED' }
                  ].map((log, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.75rem', color: '#64748B', whiteSpace: 'nowrap' }}>{log.time}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? log.docHi : log.doc}</td>
                      <td style={{ padding: '0.75rem', color: '#334155' }}>{isHindi ? log.eventHi : log.event}</td>
                      <td style={{ padding: '0.75rem', color: '#64748B' }}>
                        <div>{isHindi ? log.authHi : log.auth}</div>
                        <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#94A3B8' }}>{log.ip}</div>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <span style={{
                          background: log.status === 'VERIFIED' ? '#DCFCE7' : '#FEF3C7',
                          color: log.status === 'VERIFIED' ? '#15803D' : '#B45309',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px'
                        }}>
                          {log.status === 'VERIFIED' ? (isHindi ? 'सत्यापित' : 'VERIFIED') : (isHindi ? 'लंबित' : 'PENDING')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ padding: '0.85rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                {isHindi ? 'ऑडिट लॉग क्रिप्टोग्राफ़िक रूप से सीलबंद हैं और कानूनी रूप से मान्य हैं।' : 'Audit logs are cryptographically sealed and legally admissible.'}
              </div>
              <button
                type="button"
                onClick={() => setAuditLogsModalOpen(false)}
                style={{
                  background: '#0F172A',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.45rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'ऑडिट लॉग बंद करें' : 'Close Audit Logs'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: DOCUMENT VALIDITY & RENEWAL TRACKER
          ========================================================= */}
      {validityModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '750px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '85vh'
          }}>
            {/* Header */}
            <div style={{
              background: '#2563EB',
              color: '#FFFFFF',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Calendar size={20} color="#FFFFFF" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                    {isHindi ? 'दस्तावेज़ वैधता एवं नवीनीकरण प्रबंधन' : 'Document Validity & Renewal Management'}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#BFDBFE' }}>
                    {isHindi ? 'समाप्ति अवधि ट्रैक करें और आधिकारिक सरकारी नवीनीकरण प्रक्रिया शुरू करें' : 'Track expiration windows and initiate official government renewal processes'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValidityModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Documents Validity Table */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {documents.map((doc) => {
                  const isLifetime = doc.expiresOn.toLowerCase().includes('lifetime');

                  return (
                    <div
                      key={doc.id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {renderDocIcon(doc.typeIcon)}
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                            {isHindi ? (doc.nameHi || doc.name) : doc.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                            {doc.code} • {isHindi ? 'प्राधिकरण:' : 'Authority:'} {isHindi ? (doc.authorityHi || doc.authority) : doc.authority}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isLifetime ? '#16A34A' : '#0F172A' }}>
                            {isHindi ? (doc.expiresOnHi || doc.expiresOn) : doc.expiresOn}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: isLifetime ? '#16A34A' : '#2563EB', fontWeight: 600 }}>
                            {isLifetime ? (isHindi ? 'नवीनीकरण की आवश्यकता नहीं' : 'No renewal required') : (isHindi ? 'नवीनीकरण हेतु पात्र' : 'Renewal eligible')}
                          </div>
                        </div>

                        {isLifetime ? (
                          <span style={{
                            background: '#DCFCE7',
                            color: '#15803D',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px'
                          }}>
                            {isHindi ? 'आजीवन मान्य ✓' : 'Permanent Valid ✓'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              showToast(isHindi ? `${doc.nameHi || doc.name} के लिए नवीनीकरण आवेदन शुरू किया गया। जारीकर्ता पोर्टल पर रीडायरेक्ट किया जा रहा है...` : `Renewal application initiated for ${doc.name}. Redirecting to issuing portal...`);
                              setValidityModalOpen(false);
                            }}
                            style={{
                              background: '#2563EB',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.35rem 0.85rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                            }}
                          >
                            {isHindi ? 'नवीनीकरण हेतु आवेदन करें →' : 'Apply Renewal →'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '0.85rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                {isHindi ? 'समाप्ति से 30 दिन पहले एसएमएस द्वारा स्वतः नवीनीकरण अलर्ट भेजे जाते हैं।' : 'Auto-renewal alerts sent via SMS 30 days before expiration.'}
              </div>
              <button
                type="button"
                onClick={() => setValidityModalOpen(false)}
                style={{
                  background: '#2563EB',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.45rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'पूर्ण' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentWalletTab;
