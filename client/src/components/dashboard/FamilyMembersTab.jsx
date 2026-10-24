import React, { useState, useRef } from 'react';
import {
  User,
  Users,
  IdCard,
  CreditCard,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Info,
  Headphones,
  Fingerprint,
  FileText,
  ShieldCheck,
  Building2,
  AlertCircle,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Globe,
  Award,
  Trash2,
  Edit3
} from 'lucide-react';
import { INDIAN_STATES_DISTRICTS, STATES_LIST } from '../../utils/geoData';

export function FamilyMembersTab({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  // View mode: 'LIST' (viewing family unit roster) by default, or 'ADD' when clicking Add Member
  const [viewMode, setViewMode] = useState('LIST');
  const [activeStep, setActiveStep] = useState(1); // 1: Personal Details, 2: Identity, 3: Relationship, 4: Review

  // Form Fields matching screenshot
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailId, setEmailId] = useState('');
  const [identityProof, setIdentityProof] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [showIdNumber, setShowIdNumber] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [sameAddress, setSameAddress] = useState(true);

  // Address inputs if member lives at different address
  const [diffAddress, setDiffAddress] = useState({
    addressLine: '',
    state: 'Uttar Pradesh',
    district: 'Gautam Buddha Nagar',
    pincode: ''
  });

  const dobInputRef = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Initial Family Members Roster
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 'MEM-01',
      name: 'Ramesh Kumar Sharma',
      relation: 'Head of Family / Father',
      relationHi: 'परिवार के मुखिया / पिता',
      dob: '12 Jan 1976',
      gender: 'Male',
      genderHi: 'पुरुष',
      aadhaarLast4: '4921',
      status: 'VERIFIED',
      schemesCount: 3
    },
    {
      id: 'MEM-02',
      name: 'Sunita Sharma',
      relation: 'Mother',
      relationHi: 'माता',
      dob: '05 Mar 1979',
      gender: 'Female',
      genderHi: 'महिला',
      aadhaarLast4: '8812',
      status: 'VERIFIED',
      schemesCount: 2
    },
    {
      id: 'MEM-03',
      name: 'Pankaj Kumar',
      relation: 'Self (Applicant)',
      relationHi: 'स्वयं (आवेदक)',
      dob: '30 Nov 2008',
      gender: 'Male',
      genderHi: 'पुरुष',
      aadhaarLast4: '3210',
      status: 'VERIFIED',
      schemesCount: 4
    },
    {
      id: 'MEM-04',
      name: 'Pooja Sharma',
      relation: 'Daughter / Sister',
      relationHi: 'पुत्री / बहन',
      dob: '15 Aug 2010',
      gender: 'Female',
      genderHi: 'महिला',
      aadhaarLast4: '7741',
      status: 'VERIFIED',
      schemesCount: 1
    },
    {
      id: 'MEM-05',
      name: 'Amit Kumar',
      relation: 'Son / Brother',
      relationHi: 'पुत्र / भाई',
      dob: '22 May 2014',
      gender: 'Male',
      genderHi: 'पुरुष',
      aadhaarLast4: '1092',
      status: 'VERIFIED',
      schemesCount: 1
    }
  ]);

  // Stepper definition
  const steps = [
    { num: 1, title: isHindi ? 'व्यक्तिगत विवरण' : 'Personal Details', subtitle: isHindi ? 'बुनियादी जानकारी' : 'Basic information' },
    { num: 2, title: isHindi ? 'पहचान विवरण' : 'Identity Details', subtitle: isHindi ? 'दस्तावेज़ जानकारी' : 'Document information' },
    { num: 3, title: isHindi ? 'पारिवारिक संबंध' : 'Relationship', subtitle: isHindi ? 'संबंध व सहमति' : 'Relation and consent' },
    { num: 4, title: isHindi ? 'समीक्षा व सबमिट' : 'Review & Submit', subtitle: isHindi ? 'सत्यापित व सबमिट' : 'Verify and submit' }
  ];

  // Step 1 Validation -> proceed to Step 2
  const handleProceedToStep2 = () => {
    if (!fullName.trim()) {
      showToast('Please enter the family member full name.');
      return;
    }
    if (!dob.trim()) {
      showToast('Please select Date of Birth.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (dob > today) {
      showToast('Date of Birth cannot be in the future. Restricted to past dates only.');
      return;
    }
    if (!gender) {
      showToast('Please select gender.');
      return;
    }
    if (!maritalStatus) {
      showToast('Please select marital status (mandatory).');
      return;
    }
    if (!mobileNumber.trim()) {
      showToast('Please enter mobile number (mandatory).');
      return;
    }
    const cleanMobile = mobileNumber.trim().replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return;
    }
    setActiveStep(2);
    showToast('Personal details verified. Proceed to Step 2: Identity Proof.');
  };

  // Step 2 Validation -> proceed to Step 3
  const handleProceedToStep3 = () => {
    if (!idNumber.trim()) {
      showToast(`Please enter official ${identityProof} number.`);
      return;
    }
    setActiveStep(3);
    showToast('Identity details saved. Proceed to Step 3: Relationship & Address.');
  };

  // Step 3 Validation -> proceed to Step 4 (Review)
  const handleProceedToStep4 = () => {
    if (!relationship) {
      showToast('Please select relationship with family member.');
      return;
    }
    if (!sameAddress) {
      if (!diffAddress.addressLine.trim()) {
        showToast('Please enter member address line (mandatory since different address is chosen).');
        return;
      }
      if (!diffAddress.pincode.trim() || diffAddress.pincode.trim().length < 6) {
        showToast('Please enter a valid 6-digit Pincode for member address.');
        return;
      }
    }
    setActiveStep(4);
    showToast('Please review details before final submission.');
  };

  // Step 4: Final Submission
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newMember = {
        id: `MEM-0${familyMembers.length + 1}`,
        name: fullName,
        relation: relationship,
        dob: dob,
        gender: gender,
        aadhaarLast4: idNumber ? idNumber.slice(-4) : '9102',
        status: 'VERIFIED',
        schemesCount: 1
      };

      setFamilyMembers([...familyMembers, newMember]);
      showToast(`${fullName} enrolled into family unit successfully!`);
      // Reset form
      setFullName('');
      setDob('');
      setGender('');
      setMaritalStatus('');
      setMobileNumber('');
      setEmailId('');
      setIdNumber('');
      setRelationship('');
      setActiveStep(1);
      setViewMode('LIST');
    }, 800);
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
          {/* Breadcrumb matching screenshot: Home > Family Members > Add Family Member */}
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
            <span
              onClick={() => setViewMode(viewMode === 'ADD' ? 'LIST' : 'ADD')}
              style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
            >
              {isHindi ? 'परिवार के सदस्य' : 'Family Members'}
            </span>
            {viewMode === 'ADD' && (
              <>
                <ChevronRight size={13} color="#94A3B8" />
                <span style={{ color: '#0F172A', fontWeight: 600 }}>{isHindi ? 'परिवार सदस्य जोड़ें' : 'Add Family Member'}</span>
              </>
            )}
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {viewMode === 'ADD' ? (isHindi ? 'परिवार सदस्य जोड़ें' : 'Add Family Member') : (isHindi ? 'पारिवारिक सदस्य पंजिका' : 'Family Members Registry')}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {viewMode === 'ADD'
              ? (isHindi ? 'सरकारी सेवाओं और योजनाओं का लाभ लेने के लिए अपने परिवार के सदस्यों का विवरण जोड़ें।' : 'Add your family member details to access government services and benefits.')
              : (isHindi ? 'एकीकृत नागरिक परिवार प्रोफ़ाइल, राशन यूनिट लिंकेज और पारिवारिक रिकॉर्ड।' : 'Unified citizen household profile, ration unit linkages and generational records.')}
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
              <>&ldquo;आपके दस्तावेज़<br />सशक्त<br />समृद्ध भारत&rdquo;</>
            ) : (
              <>&ldquo;Your Documents<br />Empower<br />A Stronger India&rdquo;</>
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
          2. VIEW MODE TOGGLE HEADER (If in LIST mode, show ADD button)
          ========================================================= */}
      {viewMode === 'LIST' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '0.85rem 1.25rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0F172A' }}>
              {isHindi ? 'रमेश कुमार शर्मा का परिवार (5 संबद्ध सदस्य)' : "Ramesh Kumar Sharma's Household (5 Linked Members)"}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {isHindi ? 'पारिवारिक आईडी: ' : 'Family ID: '}<strong style={{ color: '#2563EB' }}>FAM-DEMO-12345</strong> • Noida, Gautam Buddha Nagar
            </div>
          </div>

          <button
            type="button"
            onClick={() => setViewMode('ADD')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.55rem 1.15rem',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
            }}
          >
            <Plus size={16} strokeWidth={3} />
            <span>{isHindi ? '+ परिवार सदस्य जोड़ें' : '+ Add Family Member'}</span>
          </button>
        </div>
      )}

      {/* =========================================================
          3. MAIN TWO-COLUMN BODY
             Left/Center (72%): Stepper + 3 Form Cards OR Members Roster
             Right Sidebar (28%): Important Info + Accepted Proofs + Help
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN: ADD MEMBER FORM (EXACT SCREENSHOT)
            ======================================================= */}
        {viewMode === 'ADD' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Horizontal Stepper matching screenshot */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
            }}>
              {steps.map((st, idx) => {
                const isActive = activeStep === st.num;
                const isCompleted = activeStep > st.num;
                const isLast = idx === steps.length - 1;

                return (
                  <React.Fragment key={st.num}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {/* Circle Number */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isActive ? '#2563EB' : isCompleted ? '#16A34A' : '#E2E8F0',
                        color: isActive || isCompleted ? '#FFFFFF' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.825rem',
                        flexShrink: 0
                      }}>
                        {isCompleted ? <Check size={16} strokeWidth={3} /> : st.num}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: isActive ? '#0F172A' : '#64748B' }}>
                          {st.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                          {st.subtitle}
                        </div>
                      </div>
                    </div>

                    {!isLast && (
                      <div style={{
                        flex: 1,
                        height: '1.5px',
                        background: isCompleted ? '#16A34A' : '#E2E8F0',
                        margin: '0 0.85rem'
                      }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* =======================================================
                STEP 1: PERSONAL DETAILS
                ======================================================= */}
            {activeStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '1.35rem 1.5rem',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
                }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.15rem' }}>
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
                  <User size={18} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'व्यक्तिगत विवरण' : 'Personal Details'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                    {isHindi ? 'अपने परिवार के सदस्य की मूलभूत जानकारी दर्ज करें।' : 'Enter the basic information of your family member.'}
                  </div>
                </div>
              </div>

              {/* 2-Column Fields Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.25rem' }}>
                {/* Full Name */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'पूरा नाम (सरकारी दस्तावेज के अनुसार)' : 'Full Name (as per official document)'}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isHindi ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
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

                {/* Date of Birth */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'जन्म तिथि' : 'Date of Birth'} <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={dobInputRef}
                      type="date"
                      value={dob}
                      min="1900-01-01"
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        const val = e.target.value;
                        const today = new Date().toISOString().split('T')[0];
                        if (val && val > today) {
                          showToast(isHindi ? 'जन्म तिथि भविष्य की नहीं हो सकती।' : 'Date of Birth cannot be in the future. Restricted to past dates only.');
                          return;
                        }
                        setDob(val);
                      }}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        padding: '0.55rem 2.25rem 0.55rem 0.85rem',
                        fontSize: '0.825rem',
                        color: '#0F172A',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => dobInputRef.current?.showPicker?.() || dobInputRef.current?.focus()}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Calendar size={16} />
                    </button>
                  </div>
                  {dob && (
                    <div style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 600, marginTop: '0.2rem' }}>
                      ✓ {isHindi ? 'चयनित जन्म तिथि:' : 'Selected DOB:'} {new Date(dob + 'T00:00:00').toLocaleDateString(isHindi ? 'hi-IN' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'लिंग' : 'Gender'} <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      fontSize: '0.825rem',
                      color: gender ? '#0F172A' : '#94A3B8',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">{isHindi ? 'लिंग चुनें' : 'Select gender'}</option>
                    <option value="Male">{isHindi ? 'पुरुष (Male)' : 'Male'}</option>
                    <option value="Female">{isHindi ? 'महिला (Female)' : 'Female'}</option>
                    <option value="Transgender">{isHindi ? 'अन्य / उभयलिंगी (Other / Transgender)' : 'Other / Transgender'}</option>
                  </select>
                </div>

                {/* Marital Status (Mandatory) */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'वैवाहिक स्थिति' : 'Marital Status'} <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      fontSize: '0.825rem',
                      color: maritalStatus ? '#0F172A' : '#94A3B8',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">{isHindi ? 'वैवाहिक स्थिति चुनें' : 'Select marital status'}</option>
                    <option value="Single">{isHindi ? 'अविवाहित (Single / Unmarried)' : 'Single / Unmarried'}</option>
                    <option value="Married">{isHindi ? 'विवाहित (Married)' : 'Married'}</option>
                    <option value="Widowed">{isHindi ? 'विधवा / विधुर (Widowed)' : 'Widowed'}</option>
                    <option value="Divorced">{isHindi ? 'तलाकशुदा (Divorced)' : 'Divorced'}</option>
                  </select>
                </div>

                {/* Mobile Number (Mandatory) */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'मोबाइल नंबर' : 'Mobile Number'} <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <div style={{
                      background: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <span>+91</span>
                      <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>▼</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder={isHindi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                      style={{
                        flex: 1,
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
                </div>

                {/* Email ID (Optional) */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'ईमेल आईडी' : 'Email ID'} <span style={{ color: '#64748B', fontWeight: 500 }}>({isHindi ? 'वैकल्पिक' : 'Optional'})</span>
                  </label>
                  <input
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder={isHindi ? 'ईमेल आईडी दर्ज करें' : 'Enter email ID'}
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
              </div>
            </div>

            {/* Step 1 Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setViewMode('LIST')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.55rem 1.45rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleProceedToStep2}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 1.75rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{isHindi ? 'पहचान प्रमाण पत्र पर आगे बढ़ें (चरण 2)' : 'Proceed to Identity Proof (Step 2)'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =======================================================
            STEP 2: IDENTITY DETAILS
            ======================================================= */}
        {activeStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.35rem 1.5rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.15rem' }}>
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
                  <CreditCard size={18} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'पहचान विवरण' : 'Identity Details'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                    {isHindi ? 'परिवार के सदस्य का मान्य पहचान प्रमाण पत्र विवरण प्रदान करें।' : 'Provide a valid identity proof of the family member.'}
                  </div>
                </div>
              </div>

              {/* 2-Column Fields Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.25rem' }}>
                {/* Select Identity Proof */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'पहचान प्रमाण पत्र चुनें' : 'Select Identity Proof'}
                  </label>
                  <select
                    value={identityProof}
                    onChange={(e) => setIdentityProof(e.target.value)}
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
                    <option value="Aadhaar Card">{isHindi ? 'आधार कार्ड (Aadhaar Card)' : 'Aadhaar Card'}</option>
                    <option value="Voter ID Card">{isHindi ? 'मतदाता पहचान पत्र (Voter ID Card)' : 'Voter ID Card'}</option>
                    <option value="PAN Card">{isHindi ? 'पैन कार्ड (PAN Card)' : 'PAN Card'}</option>
                    <option value="Passport">{isHindi ? 'पासपोर्ट (Passport)' : 'Passport'}</option>
                    <option value="Ration Card">{isHindi ? 'राशन कार्ड (Ration Card)' : 'Ration Card'}</option>
                    <option value="Birth Certificate">{isHindi ? 'जन्म प्रमाण पत्र (Birth Certificate)' : 'Birth Certificate'}</option>
                  </select>
                </div>

                {/* Aadhaar Number */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi
                      ? (identityProof === 'Aadhaar Card' ? 'आधार नंबर' : `${identityProof} नंबर`)
                      : (identityProof === 'Aadhaar Card' ? 'Aadhaar Number' : `${identityProof} Number`)}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showIdNumber ? 'text' : 'password'}
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder={isHindi
                        ? (identityProof === 'Aadhaar Card' ? '12 अंकों का आधार नंबर दर्ज करें' : `${identityProof} नंबर दर्ज करें`)
                        : (identityProof === 'Aadhaar Card' ? 'Enter 12-digit Aadhaar number' : `Enter ${identityProof} number`)}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        padding: '0.55rem 2.25rem 0.55rem 0.85rem',
                        fontSize: '0.825rem',
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowIdNumber(!showIdNumber)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {showIdNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.55rem 1.45rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <ArrowLeft size={16} />
                <span>{isHindi ? 'व्यक्तिगत विवरण पर वापस जाएं' : 'Back to Personal Details'}</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToStep3}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 1.75rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{isHindi ? 'पारिवारिक संबंध पर आगे बढ़ें (चरण 3)' : 'Proceed to Relationship (Step 3)'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =======================================================
            STEP 3: RELATIONSHIP WITH YOU
            ======================================================= */}
        {activeStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.35rem 1.5rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.15rem' }}>
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
                  <Users size={18} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'पारिवारिक संबंध' : 'Relationship with You'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                    {isHindi ? 'परिवार के सदस्य के साथ अपना संबंध चुनें।' : 'Select your relationship with the family member.'}
                  </div>
                </div>
              </div>

              {/* Relationship dropdown & Same Address Checkbox */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.25rem', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'पारिवारिक संबंध' : 'Relationship'}
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      fontSize: '0.825rem',
                      color: relationship ? '#0F172A' : '#94A3B8',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">{isHindi ? 'संबंध चुनें' : 'Select relationship'}</option>
                    <option value="Spouse">{isHindi ? 'पति / पत्नी (Spouse)' : 'Spouse (Wife / Husband)'}</option>
                    <option value="Son">{isHindi ? 'पुत्र (Son)' : 'Son'}</option>
                    <option value="Daughter">{isHindi ? 'पुत्री (Daughter)' : 'Daughter'}</option>
                    <option value="Father">{isHindi ? 'पिता (Father)' : 'Father'}</option>
                    <option value="Mother">{isHindi ? 'माता (Mother)' : 'Mother'}</option>
                    <option value="Brother">{isHindi ? 'भाई (Brother)' : 'Brother'}</option>
                    <option value="Sister">{isHindi ? 'बहन (Sister)' : 'Sister'}</option>
                    <option value="Grandfather">{isHindi ? 'दादा / नाना (Grandfather)' : 'Grandfather'}</option>
                    <option value="Grandmother">{isHindi ? 'दादी / नानी (Grandmother)' : 'Grandmother'}</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', paddingTop: '1.25rem' }}>
                  <input
                    type="checkbox"
                    id="sameAddrCheck"
                    checked={sameAddress}
                    onChange={(e) => setSameAddress(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#2563EB',
                      cursor: 'pointer',
                      marginTop: '2px'
                    }}
                  />
                  <div>
                    <label htmlFor="sameAddrCheck" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
                      {isHindi ? 'यह परिवार सदस्य मेरे साथ समान पते पर रहता/रहती है' : 'This family member lives at the same address as mine'}
                    </label>
                    <div style={{ fontSize: '0.7rem', color: sameAddress ? '#64748B' : '#DC2626', marginTop: '0.1rem', fontWeight: sameAddress ? 500 : 700 }}>
                      {sameAddress
                        ? (isHindi ? 'सत्यापित पारिवारिक गृह पता उपयोग किया जा रहा है।' : 'Using verified family household address.')
                        : (isHindi ? 'भिन्न निवास पता चुना गया है। कृपया नीचे पूरा पता भरें।' : 'Different residence address selected. Please enter full address details below.')}
                    </div>
                  </div>
                </div>
              </div>

              {/* DIFFERENT ADDRESS INPUT SECTION (TRIGGERED WHEN UNCHECKED) */}
              {!sameAddress && (
                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '1.5px dashed #CBD5E1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Building2 size={16} color="#2563EB" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                        {isHindi ? 'सदस्य का वर्तमान निवास पता' : 'Member Current Residence Address'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'दस्तावेज सत्यापन हेतु सटीक आवासीय पता दर्ज करें।' : 'Provide exact residential location for document verification.'}
                      </div>
                    </div>
                  </div>

                  {/* Address Line */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                      {isHindi ? 'पता / मकान संख्या / सड़क / ग्राम पंचायत' : 'Address Line / House No. / Street / Village'} <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={diffAddress.addressLine}
                      onChange={(e) => setDiffAddress({ ...diffAddress, addressLine: e.target.value })}
                      placeholder={isHindi ? 'मकान नंबर, भवन, गली या ग्राम पंचायत दर्ज करें' : 'Enter house no., building name, street, or gram panchayat'}
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

                  {/* State & District with SELECT MODE */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* State */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                        {isHindi ? 'राज्य' : 'State'} <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <select
                        value={diffAddress.state}
                        onChange={(e) => {
                          const newState = e.target.value;
                          const dList = INDIAN_STATES_DISTRICTS[newState] || [];
                          setDiffAddress({
                            ...diffAddress,
                            state: newState,
                            district: dList[0] || ''
                          });
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
                        {STATES_LIST.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    {/* District (Select Mode) */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                        {isHindi ? 'जिला (चयन मोड)' : 'District (Select Mode)'} <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <select
                        value={diffAddress.district}
                        onChange={(e) => setDiffAddress({ ...diffAddress, district: e.target.value })}
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
                        {(INDIAN_STATES_DISTRICTS[diffAddress.state] || []).map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pincode */}
                  <div style={{ maxWidth: '280px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                      {isHindi ? 'डाक पिनकोड' : 'Postal Pincode'} <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={diffAddress.pincode}
                      onChange={(e) => setDiffAddress({ ...diffAddress, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder={isHindi ? '6 अंकों का पिन (उदा. 201301)' : '6-digit PIN (e.g. 201301)'}
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
                </div>
              )}
            </div>

            {/* Step 3 Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.55rem 1.45rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <ArrowLeft size={16} />
                <span>{isHindi ? 'पहचान प्रमाण पत्र पर वापस जाएं' : 'Back to Identity Proof'}</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToStep4}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 1.75rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{isHindi ? 'समीक्षा व पुष्टि (चरण 4)' : 'Review & Confirm (Step 4)'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =======================================================
            STEP 4: REVIEW & CONFIRMATION
            ======================================================= */}
        {activeStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
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
                  <ShieldCheck size={20} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'परिवार सदस्य नामांकन विवरण की समीक्षा (चरण 4/4)' : 'Review Family Member Enrollment Details (Step 4 of 4)'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                    {isHindi ? 'जन पहचान परिवार इकाई में नामांकन पूरा करने से पहले नीचे दिए गए विवरण की जांच कर लें।' : 'Please review the details below before completing enrollment into your JanPehchaan Family Unit.'}
                  </div>
                </div>
              </div>

              {/* Summary Card Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.15rem',
                background: '#F8FAFC',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #E2E8F0'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isHindi ? 'पूरा नाम' : 'Full Name'}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>{fullName || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isHindi ? 'पारिवारिक संबंध' : 'Relationship'}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>{relationship || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isHindi ? 'जन्म तिथि व लिंग' : 'Date of Birth & Gender'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                    {dob || 'N/A'} • {gender || 'N/A'} ({maritalStatus || 'N/A'})
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isHindi ? 'पहचान प्रमाण पत्र' : 'Identity Proof'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                    {identityProof}: {idNumber ? (idNumber.length > 4 ? `•••• •••• ${idNumber.slice(-4)}` : idNumber) : (isHindi ? 'सत्यापित दस्तावेज' : 'Verified Document')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isHindi ? 'संपर्क विवरण' : 'Contact Details'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                    +91 {mobileNumber} {emailId ? `• ${emailId}` : ''}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isHindi ? 'निवास का पता' : 'Residential Address'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                    {sameAddress ? (isHindi ? 'नागरिक पारिवारिक पते के समान (नोएडा, उत्तर प्रदेश - 201301)' : 'Same as Citizen Household Address (Noida, Uttar Pradesh - 201301)') : `${diffAddress.addressLine}, ${diffAddress.district}, ${diffAddress.state} - ${diffAddress.pincode}`}
                  </div>
                </div>
              </div>

              {/* Declaration Alert */}
              <div style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: '#EFF6FF',
                border: '1px solid #DBEAFE',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}>
                <CheckCircle2 size={18} color="#2563EB" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: '#1E40AF', fontWeight: 600 }}>
                  {isHindi
                    ? 'मैं एतद्द्वारा सत्यापित एवं घोषित करता/करती हूँ कि इस परिवार के सदस्य के लिए दी गई जानकारी सत्य एवं सटीक है।'
                    : 'I hereby verify and declare that the information provided for this family member is genuine and accurate.'}
                </span>
              </div>
            </div>

            {/* Step 4 Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.55rem 1.45rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <ArrowLeft size={16} />
                <span>{isHindi ? 'संबंध विवरण पर वापस जाएं' : 'Back to Relationship Details'}</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                style={{
                  background: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 2rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.15s ease'
                }}
              >
                <Check size={18} strokeWidth={2.5} />
                <span>{isSubmitting
                  ? (isHindi ? 'नामांकन हो रहा है...' : 'Enrolling Family Member...')
                  : (isHindi ? 'पुष्टि करें व परिवार सदस्य नामांकित करें' : 'Submit & Enroll Family Member')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
        ) : (
          /* =======================================================
              ROSTER VIEW: CURRENT LINKED FAMILY MEMBERS
              ======================================================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    padding: '1.15rem 1.25rem',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: '#2563EB',
                        fontSize: '0.95rem'
                      }}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>
                          {isHindi ? (member.relationHi || member.relation) : member.relation}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      background: '#DCFCE7',
                      color: '#15803D',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px'
                    }}>
                      {isHindi ? 'आधार लिंक ✓' : 'Aadhaar Seeded ✓'}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.45rem',
                    fontSize: '0.75rem',
                    color: '#64748B',
                    background: '#F8FAFC',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px'
                  }}>
                    <div>{isHindi ? 'जन्म तिथि: ' : 'DOB: '}<strong style={{ color: '#0F172A' }}>{member.dob}</strong></div>
                    <div>{isHindi ? 'लिंग: ' : 'Gender: '}<strong style={{ color: '#0F172A' }}>{isHindi ? (member.genderHi || member.gender) : member.gender}</strong></div>
                    <div>{isHindi ? 'आधार: ' : 'Aadhaar: '}<strong style={{ color: '#0F172A' }}>**** **** {member.aadhaarLast4}</strong></div>
                    <div>{isHindi ? 'योजनाएं: ' : 'Schemes: '}<strong style={{ color: '#16A34A' }}>{member.schemesCount} {isHindi ? 'पात्र' : 'Eligible'}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =======================================================
            RIGHT COLUMN: IMPORTANT INFO + ACCEPTED PROOFS + HELP
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. IMPORTANT INFORMATION */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.95rem' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Info size={14} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'महत्वपूर्ण जानकारी' : 'Important Information'}
              </h3>
            </div>

            {/* 5 Bullet Items matching screenshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { en: 'You can add your family members to access government services and schemes.', hi: 'सरकारी सेवाओं और योजनाओं का लाभ उठाने के लिए आप अपने परिवार के सदस्यों को जोड़ सकते हैं।' },
                { en: 'Make sure the details match official documents.', hi: 'सुनिश्चित करें कि विवरण आधिकारिक दस्तावेजों से मेल खाते हों।' },
                { en: 'Aadhaar or other valid identity proof is required.', hi: 'आधार या अन्य मान्य पहचान प्रमाण आवश्यक है।' },
                { en: 'You can add spouse, children, parents or dependent family members.', hi: 'आप जीवनसाथी, बच्चे, माता-पिता या आश्रित परिवार के सदस्यों को जोड़ सकते हैं।' },
                { en: 'Added family members can be used for scheme applications, certificates and other services.', hi: 'जोड़े गए परिवार के सदस्यों का उपयोग योजना आवेदनों, प्रमाणपत्रों और अन्य सेवाओं के लिए किया जा सकता है।' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
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
                    {isHindi ? item.hi : item.en}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. ACCEPTED IDENTITY PROOFS */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.95rem' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={15} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'स्वीकृत पहचान प्रमाण' : 'Accepted Identity Proofs'}
              </h3>
            </div>

            {/* 6 Proof Items with colored icons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* 1. Aadhaar Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#FFF7ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Fingerprint size={16} color="#EA580C" />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>
                  {isHindi ? 'आधार कार्ड' : 'Aadhaar Card'}
                </span>
              </div>

              {/* 2. Voter ID Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={15} color="#16A34A" />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>
                  {isHindi ? 'मतदाता पहचान पत्र (वोटर आईडी)' : 'Voter ID Card'}
                </span>
              </div>

              {/* 3. PAN Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CreditCard size={15} color="#2563EB" />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>
                  {isHindi ? 'पैन कार्ड' : 'PAN Card'}
                </span>
              </div>

              {/* 4. Passport */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={15} color="#1E40AF" />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>
                  {isHindi ? 'पासपोर्ट' : 'Passport'}
                </span>
              </div>

              {/* 5. Ration Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={15} color="#D97706" />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>
                  {isHindi ? 'राशन कार्ड' : 'Ration Card'}
                </span>
              </div>

              {/* 6. Birth Certificate */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={15} color="#DC2626" />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>
                  {isHindi ? 'जन्म प्रमाण पत्र' : 'Birth Certificate'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. NEED HELP? CARD */}
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
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'सहायता चाहिए?' : 'Need Help?'}
              </h4>
            </div>

            <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35 }}>
              {isHindi ? 'यदि आपको परिवार के सदस्य को जोड़ने या उनके आधार को लिंक करने में कोई समस्या आती है, तो हमारे सहायता केंद्र से संपर्क करें।' : 'If you face any issue while adding a family member or linking their Aadhaar, contact our support desk.'}
            </p>

            <div style={{
              background: '#FFFFFF',
              border: '1px solid #DBEAFE',
              borderRadius: '8px',
              padding: '0.55rem 0.75rem',
              marginBottom: '0.85rem',
              fontSize: '0.72rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748B' }}>{isHindi ? 'टोल फ्री हेल्पलाइन:' : 'Toll Free Helpline:'}</span>
                <strong style={{ color: '#2563EB' }}>1800-180-6127</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748B' }}>{isHindi ? 'व्हाट्सएप डेस्क:' : 'WhatsApp Desk:'}</span>
                <strong style={{ color: '#16A34A' }}>+91 94500 00124</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast(isHindi ? 'परिवार रजिस्ट्री सहायता केंद्र से जोड़ा जा रहा है...' : 'Connecting to Family Registry Support Desk...');
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
    </div>
  );
}

export default FamilyMembersTab;
