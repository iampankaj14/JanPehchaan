import React, { useState } from 'react';
import {
  ChevronRight,
  CheckCircle2,
  Copy,
  Download,
  User,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2,
  Globe,
  Edit3,
  Smartphone,
  FileText,
  Landmark,
  Eye,
  Check,
  X,
  Printer,
  ShieldCheck,
  HeartHandshake,
  Award
} from 'lucide-react';

import { INDIAN_STATES_DISTRICTS, STATES_LIST } from '../../utils/geoData';

export function DigitalIdTab({ user, family, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  // Interactive state
  const [copiedField, setCopiedField] = useState(null);
  const [showFullIdModal, setShowFullIdModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: 'Pankaj Kumar',
    citizenId: 'JP-DEMO-10482',
    familyId: 'FAM-DEMO-12345',
    guardianName: 'Ramesh Kumar Sharma',
    dob: '30 Nov 2008 (Demo)',
    gender: 'Male',
    category: 'OBC (Non-Creamy)',
    state: 'Uttar Pradesh',
    district: 'Gautam Buddha Nagar (Noida)',
    address: 'Noida, Uttar Pradesh (Demo)',
    mobile: '+91 *******3210',
    email: 'pankajkumar@example.com',
    emergencyContact: '+91 *******4921 (Father)',
    language: 'English',
    familyCount: 5,
    issuedOn: '15 Jan 2024 (Demo)',
    lastUpdated: '12 Oct 2024 (Demo)'
  });

  // Edit Buffer
  const [editFormData, setEditFormData] = useState({
    name: 'Pankaj Kumar',
    guardianName: 'Ramesh Kumar Sharma',
    dobRaw: '2008-11-30',
    dob: '30 Nov 2008',
    gender: 'Male',
    category: 'OBC (Non-Creamy)',
    state: 'Uttar Pradesh',
    district: 'Gautam Buddha Nagar (Noida)',
    address: 'Noida, Uttar Pradesh',
    mobile: '+91 98765 43210',
    email: 'pankajkumar@example.com',
    language: 'English'
  });

  const formatDate = (raw) => {
    if (!raw) return '';
    const [y, m, d] = raw.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[parseInt(m, 10) - 1] || m;
    return `${d} ${month} ${y}`;
  };

  const handleOpenEdit = () => {
    setEditFormData({
      name: profileData.name,
      guardianName: profileData.guardianName,
      dobRaw: '2008-11-30',
      dob: profileData.dob,
      gender: profileData.gender,
      category: profileData.category,
      state: profileData.state,
      district: profileData.district,
      address: profileData.address,
      mobile: profileData.mobile.replace(/\*/g, '8'),
      email: profileData.email,
      language: profileData.language
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    if (editFormData.dobRaw && editFormData.dobRaw > today) {
      showToast('Date of Birth cannot be in the future. Please select a valid past date.');
      return;
    }
    setProfileData({
      ...profileData,
      name: editFormData.name,
      guardianName: editFormData.guardianName,
      dob: editFormData.dob,
      gender: editFormData.gender,
      category: editFormData.category,
      state: editFormData.state,
      district: editFormData.district,
      address: editFormData.address,
      mobile: editFormData.mobile,
      email: editFormData.email,
      language: editFormData.language,
      lastUpdated: '24 Oct 2026'
    });
    setShowEditModal(false);
    showToast('Personal details & Date of Birth updated successfully!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadPdf = () => {
    showToast('Downloading Official Jan Pehchaan Digital ID (PDF)...');
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
          1. PAGE HEADER WITH USER-ATTACHED BACKGROUND IMAGE
             (digital_id_bg.png: Tricolor wave + India Gate + Ashoka Chakra)
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
        {/* User Attached Background Photo */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: 'url(/assets/digital_id_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 46%',
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
          background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 32%, rgba(255,255,255,0.4) 65%, rgba(255,255,255,0.1) 100%)',
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
              {isHindi ? 'मेरी डिजिटल पहचान' : 'My Digital ID'}
            </span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.2rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'मेरी डिजिटल पहचान' : 'My Digital ID'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'अपने सत्यापित डिजिटल पहचान पत्र और नागरिक विवरण देखें व प्रबंधित करें।' : 'View and manage your verified identity details.'}
          </p>
        </div>

        {/* Right Motto Floating Card */}
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
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
            {isHindi ? (
              <span>एक पहचान<br />अनेक सेवाएँ<br />सशक्त भारत।</span>
            ) : (
              <span>One Identity<br />Many Services<br />A Better India.</span>
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
             Left Col (65%): Digital ID Card + (Personal & Contact Details)
             Right Col (35%): Identity Verification + Linked Records
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '1.15rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* -----------------------------------------------------
              A. OFFICIAL JAN PEHCHAAN DIGITAL IDENTITY CARD
              ----------------------------------------------------- */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
            position: 'relative',
            overflow: 'hidden',
            padding: '1.25rem 1.5rem'
          }}>
            {/* Subtle Ashoka Chakra Watermark in Background */}
            <svg
              width="180"
              height="180"
              viewBox="0 0 100 100"
              style={{
                position: 'absolute',
                right: '150px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.05,
                pointerEvents: 'none',
                zIndex: 0
              }}
            >
              <circle cx="50" cy="50" r="46" fill="none" stroke="#000080" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="8" fill="none" stroke="#000080" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="3" fill="#000080" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                  stroke="#000080"
                  strokeWidth="1.2"
                />
              ))}
            </svg>

            {/* Tricolor Ribbon Curves at Bottom Left */}
            <svg
              viewBox="0 0 280 90"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '280px',
                height: '65px',
                pointerEvents: 'none',
                zIndex: 0
              }}
            >
              <path d="M0,60 Q90,40 180,55 T280,45 L280,90 L0,90 Z" fill="rgba(255, 153, 51, 0.25)" />
              <path d="M0,70 Q100,50 190,65 T280,55 L280,90 L0,90 Z" fill="rgba(255, 255, 255, 0.7)" />
              <path d="M0,80 Q110,60 200,75 T280,65 L280,90 L0,90 Z" fill="rgba(19, 136, 8, 0.28)" />
            </svg>

            {/* Top Card Row: Emblem + Title & Verified Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2, paddingBottom: '0.85rem', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img
                  src="/assets/favicon.png"
                  alt="Jan Pehchaan Emblem"
                  style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
                />
                <h3 style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}>
                  {isHindi ? 'जन पहचान डिजिटल पहचान पत्र' : 'Jan Pehchaan Digital Identity Card'}
                </h3>
              </div>

              {/* Verified Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#DCFCE7',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                <CheckCircle2 size={13} fill="#15803D" color="#FFFFFF" />
                <span>{isHindi ? 'सत्यापित पहचान' : 'Verified Identity'}</span>
              </div>
            </div>

            {/* Card Body: Avatar + Details + QR Box */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '112px 1fr 136px',
              gap: '1.25rem',
              alignItems: 'center',
              padding: '0.95rem 0',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Column 1: Vector Illustrated Avatar */}
              <div style={{
                width: '112px',
                height: '118px',
                borderRadius: '14px',
                background: '#E0F2FE',
                border: '1px solid #BAE6FD',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}>
                <svg viewBox="0 0 120 125" width="100%" height="100%" style={{ display: 'block' }}>
                  <rect width="120" height="125" fill="#E0F2FE" />
                  <path d="M12,125 C12,95 35,85 60,85 C85,85 108,95 108,125 Z" fill="#1E3A8A" />
                  <path d="M48,85 L60,98 L72,85 Z" fill="#1D4ED8" opacity="0.6" />
                  <rect x="52" y="68" width="16" height="20" rx="3" fill="#FED7AA" />
                  <path d="M38,42 C38,26 82,26 82,42 C82,62 72,74 60,74 C48,74 38,62 38,42 Z" fill="#FED7AA" />
                  <circle cx="37" cy="48" r="6" fill="#FED7AA" />
                  <circle cx="83" cy="48" r="6" fill="#FED7AA" />
                  <circle cx="50" cy="46" r="2.8" fill="#0F172A" />
                  <circle cx="70" cy="46" r="2.8" fill="#0F172A" />
                  <path d="M46,40 Q50,38 54,40" stroke="#0F172A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  <path d="M66,40 Q70,38 74,40" stroke="#0F172A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  <path d="M54,56 Q60,63 66,56" stroke="#C2410C" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <path d="M36,38 C34,22 46,12 60,12 C74,12 85,20 84,36 C80,30 75,28 66,28 C56,28 48,32 44,36 C41,36 38,37 36,38 Z" fill="#0F172A" />
                  <path d="M36,36 C34,42 36,46 38,48 C37,42 37,39 36,36 Z" fill="#0F172A" />
                  <path d="M84,36 C86,42 84,46 82,48 C83,42 83,39 84,36 Z" fill="#0F172A" />
                </svg>
              </div>

              {/* Column 2: Core Citizen Credentials */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '0 0 0.25rem 0',
                  letterSpacing: '-0.02em'
                }}>
                  {profileData.name}
                </h2>

                {/* Citizen ID */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                  <User size={13} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#64748B', minWidth: '110px' }}>
                    {isHindi ? 'नागरिक आईडी:' : 'Citizen ID:'}
                  </span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{profileData.citizenId}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profileData.citizenId, isHindi ? 'नागरिक आईडी' : 'Citizen ID')}
                    style={{ background: 'none', border: 'none', padding: '0 0.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Copy Citizen ID"
                  >
                    {copiedField === 'Citizen ID' || copiedField === 'नागरिक आईडी' ? (
                      <Check size={12} color="#16A34A" />
                    ) : (
                      <Copy size={12} color="#2563EB" />
                    )}
                  </button>
                </div>

                {/* Family ID */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                  <Users size={13} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#64748B', minWidth: '110px' }}>
                    {isHindi ? 'परिवार आईडी:' : 'Family ID:'}
                  </span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{profileData.familyId}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profileData.familyId, isHindi ? 'परिवार आईडी' : 'Family ID')}
                    style={{ background: 'none', border: 'none', padding: '0 0.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Copy Family ID"
                  >
                    {copiedField === 'Family ID' || copiedField === 'परिवार आईडी' ? (
                      <Check size={12} color="#16A34A" />
                    ) : (
                      <Copy size={12} color="#2563EB" />
                    )}
                  </button>
                </div>

                {/* Date of Birth & Gender */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                  <Calendar size={13} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#64748B', minWidth: '110px' }}>
                    {isHindi ? 'जन्म तिथि:' : 'Date of Birth:'}
                  </span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{profileData.dob} • {isHindi ? (profileData.gender === 'Male' ? 'पुरुष' : profileData.gender) : profileData.gender}</span>
                </div>

                {/* Address */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                  <MapPin size={13} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#64748B', minWidth: '110px' }}>
                    {isHindi ? 'पता:' : 'Address:'}
                  </span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{profileData.address}</span>
                </div>

                {/* Registered Mobile & Family Members */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                  <Phone size={13} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#64748B', minWidth: '110px' }}>
                    {isHindi ? 'पंजीकृत मोबाइल:' : 'Registered Mobile:'}
                  </span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{profileData.mobile} ({profileData.familyCount} {isHindi ? 'सदस्य' : 'Members'})</span>
                </div>
              </div>

              {/* Column 3: Demo QR Box & Issue Timestamps */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  background: '#FFFFFF',
                  border: '1px dashed #CBD5E1',
                  borderRadius: '10px',
                  padding: '0.5rem 0.5rem 0.35rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <svg width="76" height="76" viewBox="0 0 100 100" style={{ display: 'block' }}>
                    <rect x="5" y="5" width="28" height="28" rx="3" fill="none" stroke="#0F172A" strokeWidth="4" />
                    <rect x="12" y="12" width="14" height="14" fill="#0F172A" />
                    <rect x="67" y="5" width="28" height="28" rx="3" fill="none" stroke="#0F172A" strokeWidth="4" />
                    <rect x="74" y="12" width="14" height="14" fill="#0F172A" />
                    <rect x="5" y="67" width="28" height="28" rx="3" fill="none" stroke="#0F172A" strokeWidth="4" />
                    <rect x="12" y="74" width="14" height="14" fill="#0F172A" />
                    <rect x="42" y="10" width="6" height="6" fill="#0F172A" />
                    <rect x="40" y="40" width="8" height="8" fill="#2563EB" />
                    <rect x="52" y="40" width="8" height="8" fill="#0F172A" />
                    <rect x="46" y="52" width="8" height="8" fill="#0F172A" />
                    <rect x="70" y="44" width="6" height="6" fill="#0F172A" />
                    <rect x="82" y="44" width="6" height="6" fill="#0F172A" />
                    <rect x="42" y="70" width="6" height="6" fill="#0F172A" />
                    <rect x="70" y="72" width="8" height="8" fill="#0F172A" />
                  </svg>
                  <div style={{ fontWeight: 700, fontSize: '0.68rem', color: '#334155', marginTop: '0.25rem' }}>
                    {isHindi ? 'डेमो क्यूआर' : 'Demo QR'}
                  </div>
                  <div style={{ fontSize: '0.58rem', color: '#94A3B8', lineHeight: 1.15 }}>
                    {isHindi ? 'सत्यापन हेतु' : 'Not for official<br />verification'}
                  </div>
                </div>

                <div style={{ marginTop: '0.45rem', fontSize: '0.65rem', color: '#64748B', lineHeight: 1.35, textAlign: 'center' }}>
                  <div>{isHindi ? 'जारी किया:' : 'Issued:'} <span style={{ color: '#334155', fontWeight: 600 }}>{profileData.issuedOn}</span></div>
                  <div>{isHindi ? 'अपडेट:' : 'Updated:'} <span style={{ color: '#334155', fontWeight: 600 }}>{profileData.lastUpdated}</span></div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', position: 'relative', zIndex: 2, paddingTop: '0.6rem', borderTop: '1px solid #F8FAFC' }}>
              <button
                type="button"
                onClick={() => setShowFullIdModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
              >
                <span>{isHindi ? 'पूर्ण पहचान पत्र देखें' : 'View Full ID'}</span>
                <ChevronRight size={13} />
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#FFFFFF',
                  color: '#2563EB',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
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
                <Download size={13} color="#2563EB" />
                <span>{isHindi ? 'कार्ड डाउनलोड (PDF)' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* -----------------------------------------------------
              B. SINGLE FULL-WIDTH TILE: Personal Details
              (Spacious, zero truncation, clean icons & typography)
              ----------------------------------------------------- */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.35rem 1.65rem',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} color="#2563EB" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                  {isHindi ? 'व्यक्तिगत विवरण' : 'Personal Details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleOpenEdit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  borderRadius: '8px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#2563EB',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
              >
                <Edit3 size={13} color="#2563EB" />
                <span>{isHindi ? 'विवरण बदलें' : 'Edit Details'}</span>
              </button>
            </div>

            {/* Spacious 3-Column Grid for All Details - Zero Truncation */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.2rem 1.5rem'
            }}>
              {/* Full Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0F7FF',
                  border: '1px solid #E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>Full Name</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {profileData.name}
                  </div>
                </div>
              </div>

              {/* Father / Guardian */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0F7FF',
                  border: '1px solid #E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Users size={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'पिता / परिवार के मुखिया' : 'Father / Head of Family'}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {profileData.guardianName}
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0F7FF',
                  border: '1px solid #E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Calendar size={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'जन्म तिथि' : 'Date of Birth'}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {profileData.dob}
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0F7FF',
                  border: '1px solid #E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'लिंग' : 'Gender'}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {isHindi ? (profileData.gender === 'Male' ? 'पुरुष' : 'महिला') : profileData.gender}
                  </div>
                </div>
              </div>

              {/* Domicile State */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0F7FF',
                  border: '1px solid #E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'मूल निवास राज्य' : 'State of Domicile'}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {profileData.state}
                  </div>
                </div>
              </div>

              {/* District */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0F7FF',
                  border: '1px solid #E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Building2 size={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'जिला' : 'District'}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {profileData.district}
                  </div>
                </div>
              </div>

              {/* Social Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0F7FF',
                  border: '1px solid #E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'सामाजिक श्रेणी / कोटा' : 'Social Category / Quota'}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {profileData.category}
                  </div>
                </div>
              </div>

              {/* Preferred Language */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0F7FF',
                  border: '1px solid #E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Globe size={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'पसंदीदा भाषा' : 'Preferred Language'}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {isHindi ? 'हिंदी' : profileData.language}
                  </div>
                </div>
              </div>

              {/* Registered Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F0F7FF',
                  border: '1px solid #E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'पंजीकृत ईमेल' : 'Registered Email'}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    {profileData.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            RIGHT COLUMN (Identity Verification + Linked Records)
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. Identity Verification Stepper Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.35rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'पहचान सत्यापन' : 'Identity Verification'}
              </h3>
              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>{isHindi ? 'विवरण देखें' : 'View Details'}</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Stepper Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '14px',
                bottom: '40px',
                left: '8px',
                width: '2px',
                background: '#E2E8F0',
                zIndex: 0
              }} />

              {/* Step 1 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Smartphone size={15} color="#16A34A" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'मोबाइल नंबर सत्यापित' : 'Mobile Number Verified'}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{isHindi ? 'आपका मोबाइल नंबर सत्यापित है।' : 'Your mobile number is verified.'}</div>
                  </div>
                </div>
                <div style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  {isHindi ? 'पूर्ण' : 'Completed'}
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={15} color="#16A34A" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'प्रोफ़ाइल विवरण पूर्ण' : 'Profile Details Completed'}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{isHindi ? 'आपका विवरण अद्यतन है।' : 'Your basic details are up to date.'}</div>
                  </div>
                </div>
                <div style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  {isHindi ? 'पूर्ण' : 'Completed'}
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: kycCompleted ? '#16A34A' : '#1E293B',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {kycCompleted ? <Check size={11} strokeWidth={3} /> : '3'}
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: kycCompleted ? '#DCFCE7' : '#FFEDD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={15} color={kycCompleted ? '#16A34A' : '#EA580C'} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'ई-केवाईसी सत्यापन' : 'e-KYC Verification'}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi
                        ? (kycCompleted ? 'आधार ई-केवाईसी सत्यापित।' : 'सभी सेवाओं के लिए ई-केवाईसी पूर्ण करें।')
                        : (kycCompleted ? 'Aadhaar e-KYC verified.' : 'Complete e-KYC to unlock all services.')}
                    </div>
                  </div>
                </div>
                <div style={{
                  background: kycCompleted ? '#DCFCE7' : '#FEF3C7',
                  color: kycCompleted ? '#15803D' : '#D97706',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  {isHindi ? (kycCompleted ? 'पूर्ण' : 'कार्रवाई आवश्यक') : (kycCompleted ? 'Completed' : 'Action Required')}
                </div>
              </div>

              {/* Complete Now Action Button */}
              {!kycCompleted && (
                <button
                  type="button"
                  onClick={() => setShowKycModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    width: '100%',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    border: '1.5px solid #2563EB',
                    color: '#2563EB',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '0.25rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
                >
                  <span>{isHindi ? 'अभी पूर्ण करें' : 'Complete Now'}</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>

          {/* 2. Linked Records Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.35rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.95rem' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'संबद्ध रिकॉर्ड' : 'Linked Records'}
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('families')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>{isHindi ? 'सभी प्रबंधित करें' : 'Manage All'}</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Detailed Linked Records List (5 Items matching left column height) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Item 1: Family Profile */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                background: '#F8FAFC',
                border: '1px solid #F1F5F9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Users size={17} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'पारिवारिक प्रोफ़ाइल (राशन यूनिट)' : 'Family Profile (Ration Unit)'}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{isHindi ? '5 सदस्य संबद्ध • मुखिया: रमेश कुमार' : '5 members linked • Head: Ramesh Kumar'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('families')}
                  style={{
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#2563EB',
                    padding: '0.28rem 0.7rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                >
                  {isHindi ? 'सदस्य देखें →' : 'View Members →'}
                </button>
              </div>

              {/* Item 2: Address Proof */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                background: '#F8FAFC',
                border: '1px solid #F1F5F9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={17} color="#16A34A" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'पता एवं निवास प्रमाण' : 'Address & Domicile Proof'}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{isHindi ? 'बिजली बिल एवं निवास प्रमाण पत्र (सत्यापित)' : 'Electricity Bill & Domicile on file (Verified)'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(isHindi ? 'निवास प्रमाण पत्र एवं बिजली बिल सत्यापित।' : 'Address proof: Domicile and Electricity Bill verified.')}
                  style={{
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#2563EB',
                    padding: '0.28rem 0.7rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                >
                  {isHindi ? 'दस्तावेज़ देखें →' : 'View Document →'}
                </button>
              </div>

              {/* Item 3: Aadhaar Vault Link */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                background: '#F8FAFC',
                border: '1px solid #F1F5F9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={17} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'आधार वॉल्ट लिंकेज' : 'Aadhaar Vault Link'}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{isHindi ? 'यूआईडीएआई बायोमेट्रिक लिंक • अंतिम 4: 4921' : 'UIDAI Biometric Seeded • Last 4: 4921'}</div>
                  </div>
                </div>
                <div style={{
                  background: '#DCFCE7',
                  border: '1px solid #BBF7D0',
                  color: '#15803D',
                  padding: '0.22rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}>
                  {isHindi ? 'सत्यापित ✓' : 'Verified ✓'}
                </div>
              </div>

              {/* Item 5: Caste & Income Certificate */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                background: '#F8FAFC',
                border: '1px solid #F1F5F9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Award size={17} color="#D97706" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'जाति एवं आय प्रमाण पत्र' : 'Caste & Income Certificate'}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{isHindi ? 'ओबीसी प्रमाण पत्र #UP-2024-88192 (वैध)' : 'OBC Certificate #UP-2024-88192 (Valid)'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(isHindi ? 'जाति प्रमाण पत्र 2027 तक वैध है।' : 'Caste certificate valid till 2027.')}
                  style={{
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#2563EB',
                    padding: '0.28rem 0.7rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                >
                  {isHindi ? 'दस्तावेज़ देखें →' : 'View Document →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. FULL-WIDTH BOTTOM SECTION: RECENT ACTIVITY
          ========================================================= */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '1.15rem 1.5rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.95rem' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            {isHindi ? 'हाल की गतिविधि' : 'Recent Activity'}
          </h3>
          <button
            type="button"
            onClick={() => setShowAuditModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563EB',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* 3 Activity Cards in a Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            background: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #F1F5F9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Eye size={16} color="#2563EB" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'प्रोफ़ाइल देखी गई' : 'Profile Viewed'}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{isHindi ? 'आपकी डिजिटल आईडी देखी गई' : 'Your digital ID was viewed'}</div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.1rem' }}>22 Oct 2024, 10:30 AM</div>
              </div>
            </div>
            <div style={{
              background: '#EFF6FF',
              color: '#2563EB',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}>
              {isHindi ? 'सूचना' : 'Info'}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            background: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #F1F5F9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={16} color="#16A34A" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'संपर्क सत्यापन' : 'Contact Verification'}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{isHindi ? 'मोबाइल नंबर सत्यापित किया गया' : 'Mobile number verified'}</div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.1rem' }}>20 Oct 2024, 04:15 PM</div>
              </div>
            </div>
            <div style={{
              background: '#DCFCE7',
              color: '#15803D',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}>
              {isHindi ? 'पूर्ण' : 'Completed'}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            background: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #F1F5F9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Download size={16} color="#2563EB" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{isHindi ? 'पहचान पत्र डाउनलोड' : 'ID Downloaded'}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{isHindi ? 'डिजिटल आईडी पीडीएफ डाउनलोड की गई' : 'Digital ID PDF downloaded'}</div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.1rem' }}>18 Oct 2024, 11:20 AM</div>
              </div>
            </div>
            <div style={{
              background: '#EFF6FF',
              color: '#2563EB',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: 600
            }}>
              {isHindi ? 'सूचना' : 'Info'}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          4. MODALS (View Full ID, Edit Profile, Complete e-KYC)
          ========================================================= */}
      {showFullIdModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '640px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'modalEnter 0.25s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.15rem 1.5rem',
              borderBottom: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Official Jan Pehchaan Digital ID Card
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                  Government of India • Unified Citizen Registry
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFullIdModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                borderRadius: '16px',
                border: '2px solid #0B2545',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
              }}>
                <div style={{ height: '6px', background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)' }} />

                <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <img src="/assets/favicon.png" alt="Emblem" style={{ height: '32px' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0B2545' }}>JAN PEHCHAAN DIGITAL ID</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748B' }}>Unified Citizen Entitlement Registry</div>
                    </div>
                  </div>
                  <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 700 }}>
                    VERIFIED CITIZEN
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '100px 1fr 100px', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: '100px',
                    height: '108px',
                    borderRadius: '12px',
                    background: '#E0F2FE',
                    border: '1px solid #BAE6FD',
                    overflow: 'hidden'
                  }}>
                    <svg viewBox="0 0 120 125" width="100%" height="100%">
                      <rect width="120" height="125" fill="#E0F2FE" />
                      <path d="M12,125 C12,95 35,85 60,85 C85,85 108,95 108,125 Z" fill="#1E3A8A" />
                      <path d="M38,42 C38,26 82,26 82,42 C82,62 72,74 60,74 C48,74 38,62 38,42 Z" fill="#FED7AA" />
                      <circle cx="50" cy="46" r="2.8" fill="#0F172A" />
                      <circle cx="70" cy="46" r="2.8" fill="#0F172A" />
                      <path d="M54,56 Q60,63 66,56" stroke="#C2410C" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                      <path d="M36,38 C34,22 46,12 60,12 C74,12 85,20 84,36 C80,30 75,28 66,28 C56,28 48,32 44,36 C41,36 38,37 36,38 Z" fill="#0F172A" />
                    </svg>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', fontSize: '0.78rem' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{profileData.name}</div>
                    <div><span style={{ color: '#64748B' }}>Citizen ID: </span><strong>{profileData.citizenId}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Family ID: </span><strong>{profileData.familyId}</strong></div>
                    <div><span style={{ color: '#64748B' }}>DOB / Gender: </span><strong>{profileData.dob} • {profileData.gender}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Address: </span><strong>{profileData.address}</strong></div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ background: '#FFFFFF', padding: '0.45rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                      <svg width="68" height="68" viewBox="0 0 100 100">
                        <rect x="5" y="5" width="28" height="28" fill="none" stroke="#0F172A" strokeWidth="4" />
                        <rect x="12" y="12" width="14" height="14" fill="#0F172A" />
                        <rect x="67" y="5" width="28" height="28" fill="none" stroke="#0F172A" strokeWidth="4" />
                        <rect x="74" y="12" width="14" height="14" fill="#0F172A" />
                        <rect x="5" y="67" width="28" height="28" fill="none" stroke="#0F172A" strokeWidth="4" />
                        <rect x="12" y="74" width="14" height="14" fill="#0F172A" />
                        <rect x="42" y="42" width="16" height="16" fill="#2563EB" />
                      </svg>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#64748B', marginTop: '0.25rem' }}>Scan to Verify</div>
                  </div>
                </div>

                <div style={{ background: '#F1F5F9', padding: '0.55rem 1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B' }}>
                  <span>✓ Aadhaar Seeded</span>
                  <span>✓ Direct Benefit Transfer Active</span>
                  <span>Government of India</span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.65rem',
              padding: '1.15rem 1.5rem',
              borderTop: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <Printer size={14} />
                <span>Print Card</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadPdf();
                  setShowFullIdModal(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 1.15rem',
                  borderRadius: '8px',
                  background: '#2563EB',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Details Modal with State, District Select Mode and Working DOB Picker */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '620px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.15rem 1.35rem',
              borderBottom: '1px solid #F1F5F9',
              background: '#2563EB',
              color: '#FFFFFF'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={18} color="#FFFFFF" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                  Edit Personal &amp; Identity Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ padding: '1.35rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Full Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.825rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Father / Head of Family</label>
                  <input
                    type="text"
                    value={editFormData.guardianName}
                    onChange={(e) => setEditFormData({ ...editFormData, guardianName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.825rem' }}
                    required
                  />
                </div>
              </div>

              {/* Working Date of Birth & Gender */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Date of Birth (Calendar Picker) <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      min="1900-01-01"
                      value={editFormData.dobRaw}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const today = new Date().toISOString().split('T')[0];
                        if (raw && raw > today) {
                          showToast('Date of Birth cannot be in the future. Restricted to past dates only.');
                          return;
                        }
                        setEditFormData({
                          ...editFormData,
                          dobRaw: raw,
                          dob: formatDate(raw)
                        });
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #2563EB',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        background: '#EFF6FF'
                      }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 600 }}>
                      Formatted: {editFormData.dob || 'Select date'}
                    </div>
                    <div style={{ fontSize: '0.675rem', color: '#64748B' }}>
                      (Future dates restricted)
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Gender</label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.825rem', background: '#FFFFFF' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Other / Transgender</option>
                  </select>
                </div>
              </div>

              {/* State & District with SELECT MODE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    State of Domicile (Select Mode)
                  </label>
                  <select
                    value={editFormData.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const districtOptions = INDIAN_STATES_DISTRICTS[newState] || [];
                      setEditFormData({
                        ...editFormData,
                        state: newState,
                        district: districtOptions[0] || ''
                      });
                    }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1.5px solid #2563EB', fontSize: '0.825rem', background: '#FFFFFF', fontWeight: 600 }}
                  >
                    {STATES_LIST.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    District (Select Mode)
                  </label>
                  <select
                    value={editFormData.district}
                    onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1.5px solid #2563EB', fontSize: '0.825rem', background: '#FFFFFF', fontWeight: 600 }}
                  >
                    {(INDIAN_STATES_DISTRICTS[editFormData.state] || []).map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mobile & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Mobile Number</label>
                  <input
                    type="text"
                    value={editFormData.mobile}
                    onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.825rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Email Address</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.825rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>Current Residential Address</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.825rem' }}
                  required
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.65rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid #F1F5F9'
              }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '0.5rem 0.95rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.5rem 1.35rem', borderRadius: '6px', border: 'none', background: '#2563EB', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Details Modal (Triggered by 'View Details') */}
      {showVerificationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '540px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.15rem 1.35rem',
              borderBottom: '1px solid #F1F5F9',
              background: '#0F172A',
              color: '#FFFFFF'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#10B981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                  Verification Audit Certificate
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem' }}>
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.85rem', borderRadius: '10px' }}>
                <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.9rem' }}>
                  ✓ 100% Cryptographically Authenticated
                </div>
                <div style={{ color: '#15803D', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                  Aadhaar Seeded &amp; UIDAI Central Identity Data Repository (CIDR) Verified
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div style={{ background: '#F8FAFC', padding: '0.65rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Biometric Match Score</div>
                  <strong style={{ color: '#0F172A' }}>99.82% (Positive)</strong>
                </div>
                <div style={{ background: '#F8FAFC', padding: '0.65rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>OTP Verification</div>
                  <strong style={{ color: '#0F172A' }}>+91 *******3210 (Success)</strong>
                </div>
                <div style={{ background: '#F8FAFC', padding: '0.65rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Digital Signature</div>
                  <strong style={{ color: '#0F172A' }}>SHA-256 with RSA-2048</strong>
                </div>
                <div style={{ background: '#F8FAFC', padding: '0.65rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Last Verified Date</div>
                  <strong style={{ color: '#0F172A' }}>22 Oct 2026, 11:20 AM</strong>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.65rem',
              padding: '1rem 1.35rem',
              borderTop: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <button
                type="button"
                onClick={() => {
                  showToast('Verification audit summary downloaded!');
                  setShowVerificationModal(false);
                }}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Download Certificate
              </button>
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#2563EB', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit & Operation Timeline Modal */}
      {showAuditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '640px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.15rem 1.35rem',
              borderBottom: '1px solid #F1F5F9',
              background: '#0F172A',
              color: '#FFFFFF'
            }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                  Digital ID Operations &amp; Audit Timeline
                </h3>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                  Immutable audit records for citizen ID #JP-DEMO-10482
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.35rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { time: '24 Oct 2026, 01:05 AM', title: 'Personal Details & DOB Updated', detail: 'Updated Date of Birth & district via citizen self-service portal', type: 'SUCCESS', icon: Edit3 },
                { time: '22 Oct 2026, 10:30 AM', title: 'Profile Viewed & Authenticated', detail: 'Identity token verified for scheme eligibility review', type: 'INFO', icon: Eye },
                { time: '20 Oct 2026, 04:15 PM', title: 'Contact OTP Verification', detail: 'Primary mobile number authenticated with 6-digit OTP', type: 'SUCCESS', icon: Phone },
                { time: '18 Oct 2026, 11:20 AM', title: 'Official Digital ID Downloaded', detail: 'Signed digital replica PDF downloaded by citizen', type: 'INFO', icon: Download },
                { time: '12 Oct 2026, 09:10 AM', title: 'Aadhaar Biometric e-KYC Seeded', detail: 'National UIDAI database sync completed', type: 'SUCCESS', icon: ShieldCheck }
              ].map((log, i) => {
                const IconComp = log.icon;

                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      background: '#F8FAFC',
                      padding: '0.75rem 0.95rem',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: log.type === 'SUCCESS' ? '#DCFCE7' : '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComp size={16} color={log.type === 'SUCCESS' ? '#16A34A' : '#2563EB'} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>{log.title}</div>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          background: log.type === 'SUCCESS' ? '#DCFCE7' : '#EFF6FF',
                          color: log.type === 'SUCCESS' ? '#15803D' : '#1D4ED8'
                        }}>
                          {log.type === 'SUCCESS' ? 'Completed' : 'Logged'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.15rem' }}>{log.detail}</div>
                      <div style={{ fontSize: '0.675rem', color: '#94A3B8', marginTop: '0.2rem' }}>{log.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.35rem',
              borderTop: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                All actions cryptographically hashed
              </span>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#0F172A', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* e-KYC Modal */}
      {showKycModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '460px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'modalEnter 0.25s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.15rem 1.35rem',
              borderBottom: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <ShieldCheck size={18} color="#2563EB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Aadhaar e-KYC Verification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKycModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                Enter the 6-digit OTP sent to your registered mobile number <strong>+91 *******3210</strong> to instantly verify your identity with UIDAI vault.
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Verification OTP (Demo Code: 492108)
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  defaultValue="492108"
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    border: '1.5px solid #2563EB',
                    fontSize: '1rem',
                    letterSpacing: '0.2em',
                    fontWeight: 700,
                    textAlign: 'center'
                  }}
                />
              </div>

              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.72rem', color: '#166534' }}>
                ✓ End-to-end cryptographic encryption with 2048-bit digital signature.
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.65rem',
              padding: '1.15rem 1.35rem',
              borderTop: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <button
                type="button"
                onClick={() => setShowKycModal(false)}
                style={{ padding: '0.5rem 0.95rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setKycCompleted(true);
                  setShowKycModal(false);
                  showToast('e-KYC verified successfully! All citizen entitlements unlocked.');
                }}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#16A34A', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Verify &amp; Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalIdTab;
