import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Globe,
  Shield,
  Link as LinkIcon,
  Sliders,
  Trash2,
  ChevronRight,
  Edit2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Zap,
  ShieldCheck,
  X,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  Download,
  Smartphone,
  Laptop,
  Key,
  RefreshCw,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { INDIAN_STATES_DISTRICTS, STATES_LIST } from '../../utils/geoData';

export function SettingsTab({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const [toastMessage, setToastMessage] = useState(null);

  // Profile Information State
  const [profile, setProfile] = useState({
    name: user?.name || 'Pankaj Kumar',
    id: 'JP1234567890',
    mobile: '+91 98765 43210',
    email: 'pankajkumar@example.com',
    state: 'Uttar Pradesh',
    district: 'Gautam Buddha Nagar',
    language: 'English'
  });

  // Modal States
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [activeSettingsModal, setActiveSettingsModal] = useState(null);

  // Edit Form Fields
  const [editName, setEditName] = useState(profile.name);
  const [editMobile, setEditMobile] = useState(profile.mobile);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editState, setEditState] = useState(profile.state);
  const [editDistrict, setEditDistrict] = useState(profile.district);
  const [editLanguage, setEditLanguage] = useState(profile.language);

  // Password Fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Interactive Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorMethod, setTwoFactorMethod] = useState('SMS');
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Chrome on Windows 11', location: 'Noida, UP (This Device)', ip: '103.21.124.90', current: true },
    { id: 'sess-2', device: 'JanPehchaan Mobile App (Android 14)', location: 'Lucknow, UP', ip: '49.36.128.45', current: false, lastActive: '2 hours ago' }
  ]);

  // Interactive Notification Settings
  const [smsDbt, setSmsDbt] = useState(true);
  const [whatsappClaims, setWhatsappClaims] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [pushExpiry, setPushExpiry] = useState(true);
  const [notifFrequency, setNotifFrequency] = useState('INSTANT');

  // Interactive Language & Accessibility Settings
  const [portalLanguage, setPortalLanguage] = useState('English');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('Normal');
  const [screenReader, setScreenReader] = useState(false);

  // Interactive Privacy Settings
  const [maskAadhaar, setMaskAadhaar] = useState(true);
  const [autoSchemeEligibility, setAutoSchemeEligibility] = useState(true);
  const [digilockerAutoSync, setDigilockerAutoSync] = useState(true);
  const [revokedConsents, setRevokedConsents] = useState({ revenue: false, welfare: false, health: false });

  // Interactive Linked Accounts
  const [linkedAccounts, setLinkedAccounts] = useState({
    aadhaar: { number: 'XXXX-XXXX-4921', status: 'VERIFIED', linked: true },
    pan: { number: 'ABCDE1234F', status: 'VERIFIED', linked: true },
    ration: { number: 'RC-UP-772910', status: 'VERIFIED', linked: true },
    bank: { bankName: 'State Bank of India', accNumber: '•••• 8219', ifsc: 'SBIN0001234', dbtActive: true, linked: true },
    digilocker: { status: 'CONNECTED', linked: true }
  });

  // Interactive Preferences
  const [landingPage, setLandingPage] = useState('overview');
  const [preferredState, setPreferredState] = useState('Uttar Pradesh');
  const [numberFormat, setNumberFormat] = useState('LAKHS');
  const [compactView, setCompactView] = useState(false);

  // Freeze Account State
  const [freezeReason, setFreezeReason] = useState('Lost Mobile Device');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // 8 Settings Tiles matching screenshot
  const settingsOptions = [
    {
      id: 'profile',
      title: 'Profile & Personal Information',
      titleHi: 'प्रोफ़ाइल व व्यक्तिगत जानकारी',
      subtitle: 'View and update your personal details, contact information and profile photo.',
      subtitleHi: 'अपने व्यक्तिगत विवरण, संपर्क जानकारी और प्रोफ़ाइल फ़ोटो देखें व अपडेट करें।',
      icon: User,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      action: () => setEditProfileOpen(true)
    },
    {
      id: 'security',
      title: 'Security & Login',
      titleHi: 'सुरक्षा व लॉगिन',
      subtitle: 'Change password, manage 2-factor authentication and active devices.',
      subtitleHi: 'पासवर्ड बदलें, दो-चरणीय प्रमाणीकरण और सक्रिय डिवाइस प्रबंधित करें।',
      icon: Lock,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      action: () => setActiveSettingsModal('SECURITY')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      titleHi: 'सूचनाएँ व अलर्ट',
      subtitle: 'Choose what updates, alerts and reminders you want to receive.',
      subtitleHi: 'चुनें कि आप कौन से अपडेट, अलर्ट और अनुस्मारक प्राप्त करना चाहते हैं।',
      icon: Bell,
      iconColor: '#D97706',
      bgColor: '#FEF3C7',
      action: () => setActiveSettingsModal('NOTIFICATIONS')
    },
    {
      id: 'language',
      title: 'Language & Accessibility',
      titleHi: 'भाषा व सुगमता (एक्सेसिबिलिटी)',
      subtitle: 'Select your preferred language, regional preferences and accessibility options.',
      subtitleHi: 'अपनी पसंदीदा भाषा, क्षेत्रीय प्राथमिकताएं और सुगमता विकल्प चुनें।',
      icon: Globe,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      action: () => setActiveSettingsModal('LANGUAGE')
    },
    {
      id: 'privacy',
      title: 'Data & Privacy',
      titleHi: 'डेटा व गोपनीयता',
      subtitle: 'Manage your data, consent preferences and privacy settings.',
      subtitleHi: 'अपना डेटा, सहमति प्राथमिकताएं और गोपनीयता सेटिंग्स प्रबंधित करें।',
      icon: Shield,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      action: () => setActiveSettingsModal('PRIVACY')
    },
    {
      id: 'linked',
      title: 'Linked Accounts',
      titleHi: 'संबद्ध सरकारी खाते',
      subtitle: 'Manage linked accounts (e.g. mobile number, email, other government accounts).',
      subtitleHi: 'संबद्ध खाते प्रबंधित करें (जैसे मोबाइल नंबर, ईमेल, अन्य सरकारी आईडी)।',
      icon: LinkIcon,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      action: () => setActiveSettingsModal('LINKED')
    },
    {
      id: 'preferences',
      title: 'Preferences',
      titleHi: 'पोर्टल प्राथमिकताएं',
      subtitle: 'Set your preferred services, region and dashboard preferences.',
      subtitleHi: 'अपनी पसंदीदा सेवाएं, क्षेत्र और डैशबोर्ड प्राथमिकताएं निर्धारित करें।',
      icon: Sliders,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      action: () => setActiveSettingsModal('PREFERENCES')
    },
    {
      id: 'account',
      title: 'Account Management',
      titleHi: 'खाता प्रबंधन',
      subtitle: 'Download your data or request account deactivation.',
      subtitleHi: 'अपना डेटा डाउनलोड करें अथवा खाता सुरक्षा फ़्रीज़ का अनुरोध करें।',
      icon: Trash2,
      iconColor: '#DC2626',
      bgColor: '#FEE2E2',
      action: () => setActiveSettingsModal('ACCOUNT')
    }
  ];

  // Save Profile Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: editName,
      mobile: editMobile,
      email: editEmail,
      state: editState,
      district: editDistrict,
      language: editLanguage
    });
    setEditProfileOpen(false);
    showToast('Profile information updated successfully!');
  };

  // Change Password Handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters.');
      return;
    }
    setChangePasswordOpen(false);
    setOldPassword('');
    setNewPassword('');
    showToast('Account password changed securely!');
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

        {/* Soft Left Gradient Overlay */}
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
            <span style={{ color: '#0F172A', fontWeight: 600 }}>{isHindi ? 'सेटिंग्स' : 'Settings'}</span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'सेटिंग्स' : 'Settings'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'अपना खाता, गोपनीयता, सूचनाएं और प्राथमिकताएं प्रबंधित करें।' : 'Manage your account, privacy, notifications and preferences.'}
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
              <>&ldquo;आपकी सेटिंग्स<br />आपका नियंत्रण<br />सशक्त भारत&rdquo;</>
            ) : (
              <>&ldquo;Your Settings<br />Your Control<br />A Stronger India&rdquo;</>
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
          2. TWO COLUMN LAYOUT
             Left/Center (72%): 8 Wide Settings Tiles
             Right Sidebar (28%): Your Profile Card + Quick Actions + Security Safe Card
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN: 8 Settings Tiles
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {settingsOptions.map((opt) => {
            const IconComponent = opt.icon;

            return (
              <div
                key={opt.id}
                onClick={opt.action}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '1.1rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#2563EB';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: opt.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComponent size={20} color={opt.iconColor} />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A' }}>
                      {isHindi ? (opt.titleHi || opt.title) : opt.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                      {isHindi ? (opt.subtitleHi || opt.subtitle) : opt.subtitle}
                    </div>
                  </div>
                </div>

                <ChevronRight size={18} color="#94A3B8" />
              </div>
            );
          })}
        </div>

        {/* =======================================================
            RIGHT COLUMN: 3 WIDGETS
            1. Your Profile Card
            2. Quick Actions
            3. Your data is safe with us
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. YOUR PROFILE CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            {/* Header with Edit Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'आपकी प्रोफ़ाइल' : 'Your Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setEditProfileOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#2563EB',
                  cursor: 'pointer'
                }}
              >
                <Edit2 size={12} />
                <span>{isHindi ? 'संपादित करें' : 'Edit'}</span>
              </button>
            </div>

            {/* Avatar & Name & Verified Badge matching screenshot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.15rem' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src="/assets/pankaj_avatar.jpg"
                  alt="Profile"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #2563EB'
                  }}
                />
                <div style={{
                  display: 'none',
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  PK
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                  {profile.name}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  marginTop: '0.2rem'
                }}>
                  <Check size={11} strokeWidth={3} />
                  <span>{isHindi ? 'सत्यापित' : 'Verified'}</span>
                </div>
              </div>
            </div>

            {/* Profile Info Items matching screenshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.78rem' }}>
              {/* Jan Pehchaan ID */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                  <User size={14} />
                  <span>{isHindi ? 'जन पहचान आईडी' : 'Jan Pehchaan ID'}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
                  {profile.id}
                </span>
              </div>

              {/* Mobile Number */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                  <Phone size={14} />
                  <span>{isHindi ? 'मोबाइल नंबर' : 'Mobile Number'}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>
                  {profile.mobile}
                </span>
              </div>

              {/* Email Address */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                  <Mail size={14} />
                  <span>{isHindi ? 'ईमेल पता' : 'Email Address'}</span>
                </div>
                <span style={{ fontWeight: 600, color: '#0F172A', maxWidth: '145px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.email}
                </span>
              </div>

              {/* State */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                  <MapPin size={14} />
                  <span>{isHindi ? 'राज्य' : 'State'}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>
                  {profile.state}
                </span>
              </div>

              {/* District */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                  <MapPin size={14} />
                  <span>{isHindi ? 'ज़िला' : 'District'}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>
                  {profile.district}
                </span>
              </div>

              {/* Preferred Language */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                  <Globe size={14} />
                  <span>{isHindi ? 'पसंदीदा भाषा' : 'Preferred Language'}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>
                  {isHindi && profile.language === 'English' ? 'अंग्रेज़ी (English)' : profile.language}
                </span>
              </div>
            </div>
          </div>

          {/* 2. QUICK ACTIONS */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <Zap size={16} color="#EAB308" fill="#EAB308" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'त्वरित कार्रवाइयां' : 'Quick Actions'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[
                { label: isHindi ? 'पासवर्ड बदलें' : 'Change Password', icon: Lock, action: () => setChangePasswordOpen(true) },
                { label: isHindi ? 'प्रमाणीकरण प्रबंधित करें' : 'Manage Authentication', icon: ShieldCheck, action: () => showToast(isHindi ? 'द्वि-चरणीय आधार ओटीपी सुरक्षा सेटिंग्स खोली जा रही हैं...' : 'Opening Two-Factor Aadhaar OTP Security Settings...') },
                { label: isHindi ? 'अधिसूचना प्राथमिकताएं' : 'Notification Preferences', icon: Bell, action: () => setActiveSettingsModal('NOTIFICATIONS') },
                { label: isHindi ? 'ऐप प्राथमिकताएं रीसेट करें' : 'Reset App Preferences', icon: Sliders, action: () => showToast(isHindi ? 'ऐप प्राथमिकताएं मूल स्थिति में रीसेट की गईं।' : 'App preferences restored to default state.') }
              ].map((act, i) => {
                const IconComp = act.icon;

                return (
                  <div
                    key={i}
                    onClick={act.action}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.35rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComp size={14} color="#2563EB" />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0F172A' }}>
                        {act.label}
                      </span>
                    </div>
                    <ChevronRight size={14} color="#94A3B8" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. YOUR DATA IS SAFE WITH US */}
          <div
            onClick={() => setActiveSettingsModal('PRIVACY')}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.15rem 1.25rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} color="#FFFFFF" />
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                  {isHindi ? 'आपका डेटा हमारे पास पूर्ण सुरक्षित है' : 'Your data is safe with us'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.15rem' }}>
                  {isHindi ? 'आपकी जानकारी की सुरक्षा के लिए हम सरकारी सुरक्षा मानकों का पालन करते हैं।' : 'We follow government security standards to protect your information.'}
                </div>
              </div>
            </div>

            <ChevronRight size={16} color="#94A3B8" />
          </div>
        </div>
      </div>

      {/* =========================================================
          MODAL: EDIT PROFILE
          ========================================================= */}
      {editProfileOpen && (
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
            maxWidth: '520px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              background: '#2563EB',
              color: '#FFFFFF',
              padding: '1.15rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                {isHindi ? 'व्यक्तिगत प्रोफ़ाइल संपादित करें' : 'Edit Personal Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'पूरा नाम' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.825rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'मोबाइल नंबर' : 'Mobile Number'}
                </label>
                <input
                  type="text"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.825rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'ईमेल पता' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.825rem', outline: 'none' }}
                />
              </div>

              {/* State & District with SELECT MODE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'राज्य' : 'State'}
                  </label>
                  <select
                    value={editState}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const dList = INDIAN_STATES_DISTRICTS[newState] || [];
                      setEditState(newState);
                      setEditDistrict(dList[0] || '');
                    }}
                    style={{ width: '100%', border: '1.5px solid #2563EB', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.825rem', outline: 'none', background: '#FFFFFF', fontWeight: 600 }}
                  >
                    {STATES_LIST.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'ज़िला' : 'District'}
                  </label>
                  <select
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    style={{ width: '100%', border: '1.5px solid #2563EB', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.825rem', outline: 'none', background: '#FFFFFF', fontWeight: 600 }}
                  >
                    {(INDIAN_STATES_DISTRICTS[editState] || []).map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'पसंदीदा भाषा' : 'Preferred Language'}
                </label>
                <select
                  value={editLanguage}
                  onChange={(e) => setEditLanguage(e.target.value)}
                  style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.825rem', outline: 'none' }}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.5rem 1.35rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isHindi ? 'परिवर्तन सहेजें' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          INTERACTIVE SETTINGS MODAL (HANDLES ALL CATEGORIES)
          ========================================================= */}
      {activeSettingsModal && (
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
            borderRadius: '20px',
            maxWidth: activeSettingsModal === 'SECURITY' || activeSettingsModal === 'LINKED' || activeSettingsModal === 'PRIVACY' ? '580px' : '520px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeSettingsModal === 'SECURITY' && <Lock size={18} color="#93C5FD" />}
                  {activeSettingsModal === 'NOTIFICATIONS' && <Bell size={18} color="#FCD34D" />}
                  {activeSettingsModal === 'LANGUAGE' && <Globe size={18} color="#93C5FD" />}
                  {activeSettingsModal === 'PRIVACY' && <Shield size={18} color="#93C5FD" />}
                  {activeSettingsModal === 'LINKED' && <LinkIcon size={18} color="#93C5FD" />}
                  {activeSettingsModal === 'PREFERENCES' && <Sliders size={18} color="#93C5FD" />}
                  {activeSettingsModal === 'ACCOUNT' && <Trash2 size={18} color="#FCA5A5" />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                    {activeSettingsModal === 'SECURITY' && (isHindi ? 'सुरक्षा व लॉगिन' : 'Security & Login')}
                    {activeSettingsModal === 'NOTIFICATIONS' && (isHindi ? 'अधिसूचना प्राथमिकताएं' : 'Notification Preferences')}
                    {activeSettingsModal === 'LANGUAGE' && (isHindi ? 'भाषा व सुगमता' : 'Language & Accessibility')}
                    {activeSettingsModal === 'PRIVACY' && (isHindi ? 'डेटा व गोपनीयता नियंत्रण' : 'Data & Privacy Controls')}
                    {activeSettingsModal === 'LINKED' && (isHindi ? 'संबद्ध सरकारी खाते' : 'Linked Government Accounts')}
                    {activeSettingsModal === 'PREFERENCES' && (isHindi ? 'डैशबोर्ड प्राथमिकताएं' : 'Dashboard Preferences')}
                    {activeSettingsModal === 'ACCOUNT' && (isHindi ? 'खाता प्रबंधन' : 'Account Management')}
                  </h3>
                  <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '0.1rem' }}>
                    {activeSettingsModal === 'SECURITY' && (isHindi ? 'मल्टी-फैक्टर प्रमाणीकरण और पासवर्ड के साथ अपने नागरिक खाते को सुरक्षित रखें।' : 'Protect your citizen account with multi-factor authentication and passwords.')}
                    {activeSettingsModal === 'NOTIFICATIONS' && (isHindi ? 'नियंत्रित करें कि आपको कौन से अलर्ट, अनुस्मारक और भुगतान अपडेट प्राप्त हों।' : 'Control which alerts, reminders, and payment updates you receive.')}
                    {activeSettingsModal === 'LANGUAGE' && (isHindi ? 'क्षेत्रीय भाषा प्राथमिकताएं और उच्च-कंट्रास्ट सुगमता विकल्प चुनें।' : 'Set regional language preferences and high-contrast accessibility.')}
                    {activeSettingsModal === 'PRIVACY' && (isHindi ? 'आधार मास्किंग और स्वचालित योजना मूल्यांकन को नियंत्रित करें।' : 'Control Aadhaar masking and automated scheme evaluation.')}
                    {activeSettingsModal === 'LINKED' && (isHindi ? 'अपनी सत्यापित राष्ट्रीय पहचान और डीबीटी बैंक खाते का प्रबंधन करें।' : 'Manage your verified national identities and DBT bank account.')}
                    {activeSettingsModal === 'PREFERENCES' && (isHindi ? 'डिफ़ॉल्ट लैंडिंग पृष्ठ और वित्तीय संख्या प्रारूप अनुकूलित करें।' : 'Customize default landing pages and financial number notation.')}
                    {activeSettingsModal === 'ACCOUNT' && (isHindi ? 'अपना नागरिक डेटा संग्रह डाउनलोड करें अथवा खाता स्थिति प्रबंधित करें।' : 'Download your citizen archive or manage account status.')}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveSettingsModal(null)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* =======================================================
                  1. SECURITY & LOGIN SETTINGS
                  ======================================================= */}
              {activeSettingsModal === 'SECURITY' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Two-Factor Authentication Section */}
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Smartphone size={17} color="#2563EB" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                            {isHindi ? 'दो-चरणीय प्रमाणीकरण (2FA)' : 'Two-Factor Authentication (2FA)'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            {isHindi ? 'लॉगिन सत्यापन के दौरान ओटीपी कोड अनिवार्य करता है।' : 'Requires an OTP code during login verification.'}
                          </div>
                        </div>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '22px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={(e) => {
                            setTwoFactorEnabled(e.target.checked);
                            showToast(e.target.checked ? (isHindi ? 'दो-चरणीय प्रमाणीकरण सक्रिय किया गया!' : 'Two-Factor Authentication enabled!') : (isHindi ? '2FA निष्क्रिय (असुरक्षित)' : '2FA disabled (not recommended)'));
                          }}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: twoFactorEnabled ? '#2563EB' : '#CBD5E1',
                          borderRadius: '34px', transition: '.2s'
                        }}>
                          <span style={{
                            position: 'absolute', content: '""', height: '16px', width: '16px', left: twoFactorEnabled ? '22px' : '3px', bottom: '3px',
                            backgroundColor: 'white', borderRadius: '50%', transition: '.2s'
                          }} />
                        </span>
                      </label>
                    </div>

                    {twoFactorEnabled && (
                      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #CBD5E1' }}>
                        <button
                          type="button"
                          onClick={() => { setTwoFactorMethod('SMS'); showToast(isHindi ? '2FA विधि सेट: मोबाइल एसएमएस ओटीपी (+91 98765 43210)' : '2FA method set to SMS OTP (+91 98765 43210)'); }}
                          style={{
                            flex: 1, padding: '0.45rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px',
                            border: twoFactorMethod === 'SMS' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            background: twoFactorMethod === 'SMS' ? '#EFF6FF' : '#FFFFFF',
                            color: twoFactorMethod === 'SMS' ? '#2563EB' : '#475569', cursor: 'pointer'
                          }}
                        >
                          {isHindi ? '📱 मोबाइल एसएमएस (+91 •••• 43210)' : '📱 SMS on Mobile (+91 •••• 43210)'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setTwoFactorMethod('AUTHENTICATOR'); showToast(isHindi ? '2FA विधि सेट: ऑथेंटिकेटर ऐप (TOTP)' : '2FA method set to Authenticator App (TOTP)'); }}
                          style={{
                            flex: 1, padding: '0.45rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px',
                            border: twoFactorMethod === 'AUTHENTICATOR' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            background: twoFactorMethod === 'AUTHENTICATOR' ? '#EFF6FF' : '#FFFFFF',
                            color: twoFactorMethod === 'AUTHENTICATOR' ? '#2563EB' : '#475569', cursor: 'pointer'
                          }}
                        >
                          {isHindi ? '🔑 ऑथेंटिकेटर ऐप (TOTP)' : '🔑 Authenticator App (TOTP)'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Biometric Aadhaar Login Section */}
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={18} color="#2563EB" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                          {isHindi ? 'बायोमेट्रिक लॉगिन (आधार फिंगरप्रिंट / फेस)' : 'Biometric Login (Aadhaar Fingerprint / Face)'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {isHindi ? 'समर्थित उपकरणों पर त्वरित, पासवर्ड-मुक्त बायोमेट्रिक प्रमाणीकरण।' : 'Fast, password-less biometric authentication on supported devices.'}
                        </div>
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '22px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={biometricEnabled}
                        onChange={(e) => {
                          setBiometricEnabled(e.target.checked);
                          showToast(e.target.checked ? (isHindi ? 'आधार बायोमेट्रिक प्रमाणीकरण सक्रिय किया गया!' : 'Aadhaar Biometric authentication activated!') : (isHindi ? 'बायोमेट्रिक लॉगिन निष्क्रिय किया गया' : 'Biometric login disabled'));
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: biometricEnabled ? '#2563EB' : '#CBD5E1',
                        borderRadius: '34px', transition: '.2s'
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: '16px', width: '16px', left: biometricEnabled ? '22px' : '3px', bottom: '3px',
                          backgroundColor: 'white', borderRadius: '50%', transition: '.2s'
                        }} />
                      </span>
                    </label>
                  </div>

                  {/* Change Password Sub-form */}
                  <div style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Key size={15} color="#2563EB" />
                      <span>{isHindi ? 'खाता पासवर्ड बदलें' : 'Change Account Password'}</span>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                        {isHindi ? 'वर्तमान पासवर्ड' : 'Current Password'}
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder={isHindi ? 'वर्तमान पासवर्ड दर्ज करें' : 'Enter current password'}
                        style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.8rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                          {isHindi ? 'नया पासवर्ड' : 'New Password'}
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={isHindi ? 'न्यूनतम 6 अक्षर' : 'Min 6 characters'}
                          style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.8rem', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                          {isHindi ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={isHindi ? 'पासवर्ड पुनः दर्ज करें' : 'Re-enter password'}
                          style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.8rem', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.75rem', color: '#64748B' }}>
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={(e) => setShowPassword(e.target.checked)}
                          style={{ accentColor: '#2563EB' }}
                        />
                        <span>{isHindi ? 'पासवर्ड दिखाएं' : 'Show password'}</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          if (!newPassword || newPassword.length < 6) {
                            showToast(isHindi ? 'नया पासवर्ड न्यूनतम 6 अक्षरों का होना चाहिए।' : 'New password must be at least 6 characters.');
                            return;
                          }
                          if (newPassword !== confirmPassword) {
                            showToast(isHindi ? 'पासवर्ड मेल नहीं खाते। कृपया पुनः जांचें।' : 'Passwords do not match. Please recheck.');
                            return;
                          }
                          setOldPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          showToast(isHindi ? 'पासवर्ड सफलतापूर्वक अपडेट किया गया!' : 'Password updated securely!');
                        }}
                        style={{
                          background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px',
                          padding: '0.45rem 1rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                        }}
                      >
                        {isHindi ? 'पासवर्ड अपडेट करें' : 'Update Password'}
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions List */}
                  <div style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Laptop size={15} color="#2563EB" />
                        <span>{isHindi ? 'सक्रिय लॉग-इन सत्र (डिवाइस)' : 'Active Logged-in Sessions'}</span>
                      </div>
                      {activeSessions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSessions(prev => prev.filter(s => s.current));
                            showToast(isHindi ? 'अन्य सभी सक्रिय सत्र सफलतापूर्वक समाप्त किए गए।' : 'Revoked all other active sessions successfully.');
                          }}
                          style={{
                            background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px',
                            padding: '0.25rem 0.65rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
                          }}
                        >
                          {isHindi ? 'अन्य सभी सत्र समाप्त करें' : 'Revoke Other Sessions'}
                        </button>
                      )}
                    </div>

                    {activeSessions.map((sess) => (
                      <div key={sess.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>{sess.device}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{sess.location} • IP: {sess.ip}</div>
                        </div>
                        {sess.current ? (
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                            {isHindi ? 'वर्तमान सत्र' : 'Current Session'}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                            {isHindi && sess.lastActive === '2 hours ago' ? '2 घंटे पहले' : sess.lastActive}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =======================================================
                  2. NOTIFICATIONS PREFERENCES
                  ======================================================= */}
              {activeSettingsModal === 'NOTIFICATIONS' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '10px', padding: '0.75rem', fontSize: '0.75rem', color: '#92400E' }}>
                    {isHindi ? '💡 रीयल-टाइम सूचनाएं आपको प्रत्यक्ष लाभ अंतरण (DBT) सब्सिडी, प्रमाण पत्र प्रेषण और शिकायत सुनवाई के बारे में जागरूक रखती हैं।' : '💡 Real-time notifications keep you informed about Direct Benefit Transfer (DBT) subsidies, certificate dispatches, and grievance hearings.'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'डीबीटी भुगतान हेतु एसएमएस अलर्ट' : 'SMS Alerts for DBT Payments'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'कल्याणकारी धनराशि क्रेडिट होने पर +91 98765 43210 पर तुरंत एसएमएस भेजा जाता है।' : 'Instant SMS sent to +91 98765 43210 whenever welfare funds are credited.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsDbt}
                      onChange={(e) => { setSmsDbt(e.target.checked); showToast(`SMS DBT alerts ${e.target.checked ? 'enabled' : 'disabled'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'व्हाट्सएप स्थिति व क्यूआर प्रमाण पत्र प्रेषण' : 'WhatsApp Status & QR Certificate Dispatch'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'स्वीकृत डिजिटल प्रमाण पत्र और शिकायत अद्यतन व्हाट्सएप पर प्राप्त करें।' : 'Receive approved digital certificates and grievance updates on WhatsApp.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsappClaims}
                      onChange={(e) => { setWhatsappClaims(e.target.checked); showToast(`WhatsApp updates ${e.target.checked ? 'enabled' : 'disabled'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'ईमेल नीति व योजना घोषणाएँ' : 'Email Policy & Scheme Announcements'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'नई राज्य छात्रवृत्तियों और किसान सब्सिडी का मासिक सारांश।' : 'Monthly digest of new state scholarships and farmer subsidies.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailDigest}
                      onChange={(e) => { setEmailDigest(e.target.checked); showToast(`Email digest ${e.target.checked ? 'enabled' : 'disabled'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'दस्तावेज़ समाप्ति व नवीनीकरण अनुस्मारक' : 'Document Expiry & Renewal Reminders'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'ड्राइविंग लाइसेंस अथवा आय प्रमाण पत्र समाप्त होने से 30 दिन पूर्व चेतावनी अलर्ट।' : 'Alerts 30 days before driving licenses or income certificates expire.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushExpiry}
                      onChange={(e) => { setPushExpiry(e.target.checked); showToast(`Expiry reminders ${e.target.checked ? 'enabled' : 'disabled'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Frequency Selector */}
                  <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.45rem' }}>
                      {isHindi ? 'सूचना वितरण आवृत्ति:' : 'Delivery Timing Frequency:'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="notifFreq"
                          checked={notifFrequency === 'INSTANT'}
                          onChange={() => { setNotifFrequency('INSTANT'); showToast(isHindi ? 'सूचना वितरण: तुरंत पुश' : 'Notification delivery: Instant Push'); }}
                          style={{ accentColor: '#2563EB' }}
                        />
                        <span>{isHindi ? '⚡ तुरंत पुश (अनुशंसित)' : '⚡ Instant Push (Recommended)'}</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="notifFreq"
                          checked={notifFrequency === 'DAILY'}
                          onChange={() => { setNotifFrequency('DAILY'); showToast(isHindi ? 'सूचना वितरण: दैनिक रात्रि 8 बजे सारांश' : 'Notification delivery: Daily 8 PM Digest'); }}
                          style={{ accentColor: '#2563EB' }}
                        />
                        <span>{isHindi ? '🌙 दैनिक रात्रि 8 बजे सारांश' : '🌙 Daily 8 PM Digest'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* =======================================================
                  3. LANGUAGE & ACCESSIBILITY
                  ======================================================= */}
              {activeSettingsModal === 'LANGUAGE' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                      {isHindi ? 'प्राथमिक पोर्टल भाषा' : 'Primary Portal Language'}
                    </label>
                    <select
                      value={portalLanguage}
                      onChange={(e) => {
                        setPortalLanguage(e.target.value);
                        showToast(`Portal language preference updated to: ${e.target.value}`);
                      }}
                      style={{ width: '100%', border: '1.5px solid #2563EB', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.825rem', outline: 'none', background: '#FFFFFF', fontWeight: 600 }}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="Bengali">বাংলা (Bengali)</option>
                      <option value="Telugu">తెలుగు (Telugu)</option>
                      <option value="Marathi">मराठी (Marathi)</option>
                      <option value="Tamil">தமிழ் (Tamil)</option>
                      <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                      <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'उच्च कंट्रास्ट मोड' : 'High Contrast Mode'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'कम दृष्टि वाले नागरिकों के लिए कंट्रास्ट बॉर्डर और टेक्स्ट स्पष्टता बढ़ाता है।' : 'Increases contrast borders and text readability for low-vision citizens.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={(e) => { setHighContrast(e.target.checked); showToast(`High Contrast ${e.target.checked ? 'Enabled' : 'Disabled'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                      {isHindi ? 'प्रदर्शन फ़ॉन्ट आकार' : 'Display Font Size'}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      {['Normal', 'Large', 'Extra Large'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => { setFontSize(sz); showToast(`Font size set to ${sz}`); }}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            border: fontSize === sz ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            background: fontSize === sz ? '#EFF6FF' : '#FFFFFF',
                            color: fontSize === sz ? '#2563EB' : '#475569',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                        >
                          {sz === 'Normal' ? (isHindi ? 'सामान्य' : 'Normal') : sz === 'Large' ? (isHindi ? 'बड़ा' : 'Large') : (isHindi ? 'अति बड़ा' : 'Extra Large')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'स्क्रीन रीडर सहायता (ARIA Live)' : 'Screen Reader Assistance (ARIA Live)'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'फ़ॉर्म फ़ील्ड्स और तालिकाओं के लिए स्क्रीन रीडर घोषणाओं को अनुकूलित करता है।' : 'Optimizes screen reader announcements for form fields and tables.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={screenReader}
                      onChange={(e) => { setScreenReader(e.target.checked); showToast(`Screen reader mode ${e.target.checked ? 'Enabled' : 'Disabled'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              )}

              {/* =======================================================
                  4. DATA & PRIVACY CONTROLS
                  ======================================================= */}
              {activeSettingsModal === 'PRIVACY' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '0.85rem', fontSize: '0.75rem', color: '#1E40AF', lineHeight: 1.4 }}>
                    {isHindi ? (
                      <span>🛡️ <strong>सांविधिक गोपनीयता संरक्षण:</strong> आपकी बायोमेट्रिक्स, जनसांख्यिकीय पहचान और कल्याणकारी डेटा आधार अधिनियम 2016 की धारा 29 और डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 के तहत कड़े एन्क्रिप्शन से सुरक्षित हैं।</span>
                    ) : (
                      <span>🛡️ <strong>Statutory Privacy Protection:</strong> Your biometrics, demographic identity and welfare data are encrypted under Section 29 of the Aadhaar Act 2016 and Digital Personal Data Protection (DPDP) Act 2023.</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'पोर्टल में आधार संख्या मास्क करें' : 'Mask Aadhaar Number in Portal'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'गोपनीयता बनाए रखने हेतु केवल अंतिम 4 अंक (XXXX-XXXX-4921) प्रदर्शित करें।' : 'Only display last 4 digits (XXXX-XXXX-4921) to prevent shoulder surfing.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={maskAadhaar}
                      onChange={(e) => { setMaskAadhaar(e.target.checked); showToast(isHindi ? `आधार मास्किंग ${e.target.checked ? 'सक्रिय' : 'निष्क्रिय'}` : `Aadhaar masking ${e.target.checked ? 'Active' : 'Deactivated'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'कल्याणकारी योजनाओं हेतु स्वतः पात्रता मिलान' : 'Automatic Welfare Scheme Eligibility Matching'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'प्रणाली के एल्गोरिदम को केंद्र/राज्य योजनाओं के लिए आपके परिवार का मिलान करने की अनुमति दें।' : 'Allow system algorithm to match your household for central/state schemes.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoSchemeEligibility}
                      onChange={(e) => { setAutoSchemeEligibility(e.target.checked); showToast(isHindi ? `स्वतः योजना मिलान ${e.target.checked ? 'सक्रिय' : 'निष्क्रिय'}` : `Auto scheme matching ${e.target.checked ? 'Enabled' : 'Disabled'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'डिजीलॉकर निरंतर वॉल्ट सिंक्रोनाइज़ेशन' : 'DigiLocker Continuous Vault Synchronization'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'दस्तावेज़ वॉल्ट के प्रमाणपत्रों को सीधे डिजीलॉकर गेटवे से सत्यापित व अद्यतन रखें।' : 'Keep Document Wallet certificates verified directly with DigiLocker gateway.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={digilockerAutoSync}
                      onChange={(e) => { setDigilockerAutoSync(e.target.checked); showToast(isHindi ? `डिजीलॉकर सिंक ${e.target.checked ? 'सक्रिय' : 'रोका गया'}` : `DigiLocker sync ${e.target.checked ? 'Active' : 'Paused'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Departmental Consent History */}
                  <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                      {isHindi ? 'सक्रिय विभागीय डेटा साझाकरण सहमति' : 'Active Departmental Data Sharing Consents'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                        <div>
                          <strong>{isHindi ? 'राजस्व एवं ज़िला प्रशासन' : 'Revenue & District Administration'}</strong>
                          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                            {isHindi ? 'निवास व आय प्रमाण पत्र सत्यापन पहुंच' : 'Niwas and Aay Praman verification access'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setRevokedConsents(prev => ({ ...prev, revenue: !prev.revenue }));
                            showToast(revokedConsents.revenue ? (isHindi ? 'राजस्व विभाग की सहमति पुनः बहाल की गई' : 'Consent restored for Revenue Dept') : (isHindi ? 'राजस्व विभाग की पहुंच निरस्त की गई' : 'Consent revoked for Revenue Dept'));
                          }}
                          style={{
                            background: revokedConsents.revenue ? '#EFF6FF' : '#FEE2E2',
                            color: revokedConsents.revenue ? '#2563EB' : '#DC2626',
                            border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer'
                          }}
                        >
                          {revokedConsents.revenue ? (isHindi ? 'सहमति पुनः चालू करें' : 'Restore Consent') : (isHindi ? 'पहुंच निरस्त करें' : 'Revoke Access')}
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                        <div>
                          <strong>{isHindi ? 'समाज कल्याण एवं पेंशन' : 'Social Welfare & Pensions'}</strong>
                          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                            {isHindi ? 'जाति और वृद्धावस्था पेंशन दावा पात्रता' : 'Caste and elderly pension claim eligibility'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setRevokedConsents(prev => ({ ...prev, welfare: !prev.welfare }));
                            showToast(revokedConsents.welfare ? (isHindi ? 'कल्याण विभाग की सहमति पुनः बहाल की गई' : 'Consent restored for Welfare Dept') : (isHindi ? 'कल्याण विभाग की पहुंच निरस्त की गई' : 'Consent revoked for Welfare Dept'));
                          }}
                          style={{
                            background: revokedConsents.welfare ? '#EFF6FF' : '#FEE2E2',
                            color: revokedConsents.welfare ? '#2563EB' : '#DC2626',
                            border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer'
                          }}
                        >
                          {revokedConsents.welfare ? (isHindi ? 'सहमति पुनः चालू करें' : 'Restore Consent') : (isHindi ? 'पहुंच निरस्त करें' : 'Revoke Access')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =======================================================
                  5. LINKED GOVERNMENT ACCOUNTS
                  ======================================================= */}
              {activeSettingsModal === 'LINKED' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {isHindi ? 'सभी लिंक्ड खाते आधिकारिक राज्य एपीआई के माध्यम से सत्यापित हैं और एक-क्लिक में कागज़ रहित आवेदन की सुविधा देते हैं।' : 'All linked accounts are verified via official state APIs and allow one-click paperless application filling.'}
                  </div>

                  {/* Account 1: Aadhaar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={18} color="#2563EB" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                          {isHindi ? 'आधार कार्ड (UIDAI)' : 'Aadhaar Card (UIDAI)'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {linkedAccounts.aadhaar.number} • {isHindi ? 'सत्यापित नागरिक' : 'Verified Citizen'}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>
                      {isHindi ? '✓ लिंक्ड एवं सक्रिय' : '✓ Linked & Active'}
                    </span>
                  </div>

                  {/* Account 2: PAN */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={18} color="#16A34A" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                          {isHindi ? 'स्थाई खाता संख्या (PAN)' : 'Permanent Account Number (PAN)'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {linkedAccounts.pan.number} • {isHindi ? 'आयकर विभाग' : 'Income Tax Dept'}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>
                      {isHindi ? '✓ सत्यापित' : '✓ Verified'}
                    </span>
                  </div>

                  {/* Account 3: Ration Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={18} color="#EA580C" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                          {isHindi ? 'राज्य राशन कार्ड (NFSA)' : 'State Ration Card (NFSA)'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {linkedAccounts.ration.number} • {isHindi ? 'खाद्य एवं नागरिक आपूर्ति' : 'Food & Civil Supplies'}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>
                      {isHindi ? '✓ लिंक्ड' : '✓ Linked'}
                    </span>
                  </div>

                  {/* Account 4: Bank Account DBT */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={18} color="#2563EB" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                          {linkedAccounts.bank.bankName} ({isHindi ? 'डीबीटी अधिदेश' : 'DBT Mandate'})
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {isHindi ? 'खाता' : 'A/c'}: {linkedAccounts.bank.accNumber} • IFSC: {linkedAccounts.bank.ifsc}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>
                      {isHindi ? '✓ एनपीसीआई डीबीटी सक्रिय' : '✓ NPCI DBT Active'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast(isHindi ? 'नया खाता लिंक करने हेतु राष्ट्रीय सरकारी गेटवे खोला जा रहा है...' : 'Opening National Government Gateway to link new account...')}
                    style={{
                      background: '#FFFFFF', border: '1.5px dashed #2563EB', color: '#2563EB', borderRadius: '10px',
                      padding: '0.65rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem'
                    }}
                  >
                    <span>{isHindi ? '+ अतिरिक्त सरकारी पहचान लिंक करें (मतदाता पहचान पत्र / ड्राइविंग लाइसेंस)' : '+ Link Additional Government Identity (Voter ID / Driving License)'}</span>
                  </button>
                </div>
              )}

              {/* =======================================================
                  6. PREFERENCES
                  ======================================================= */}
              {activeSettingsModal === 'PREFERENCES' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                      {isHindi ? 'डिफ़ॉल्ट पोर्टल लैंडिंग टैब' : 'Default Portal Landing Tab'}
                    </label>
                    <select
                      value={landingPage}
                      onChange={(e) => { setLandingPage(e.target.value); showToast(isHindi ? `डिफ़ॉल्ट लैंडिंग टैब अपडेट हुआ: ${e.target.value}` : `Default landing tab updated to: ${e.target.value}`); }}
                      style={{ width: '100%', border: '1.5px solid #2563EB', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.825rem', outline: 'none', background: '#FFFFFF', fontWeight: 600 }}
                    >
                      <option value="overview">{isHindi ? 'होम (अवलोकन डैशबोर्ड)' : 'Home (Overview Dashboard)'}</option>
                      <option value="digital_id">{isHindi ? 'मेरा डिजिटल आईडी' : 'My Digital ID'}</option>
                      <option value="services">{isHindi ? 'नागरिक सेवा निर्देशिका' : 'Services Directory'}</option>
                      <option value="schemes">{isHindi ? 'सरकारी योजना मिलानकर्ता' : 'Government Schemes Matcher'}</option>
                      <option value="wallet">{isHindi ? 'दस्तावेज़ वॉल्ट' : 'Document Wallet'}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                      {isHindi ? 'योजना सूचनाओं के लिए पसंदीदा राज्य' : 'Preferred State for Scheme Announcements'}
                    </label>
                    <select
                      value={preferredState}
                      onChange={(e) => { setPreferredState(e.target.value); showToast(isHindi ? `राज्य नोटिस फ़िल्टर सेट: ${e.target.value}` : `State notice filter set to: ${e.target.value}`); }}
                      style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.55rem 0.85rem', fontSize: '0.825rem', outline: 'none', background: '#FFFFFF' }}
                    >
                      {STATES_LIST.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                      {isHindi ? 'मुद्रा एवं संख्या प्रणाली' : 'Currency & Numerical System'}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => { setNumberFormat('LAKHS'); showToast(isHindi ? 'संख्या प्रारूप भारतीय प्रणाली (₹ लाख / करोड़) पर सेट' : 'Number format set to Indian (₹ Lakhs / Crores)'); }}
                        style={{
                          padding: '0.55rem', borderRadius: '8px',
                          border: numberFormat === 'LAKHS' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                          background: numberFormat === 'LAKHS' ? '#EFF6FF' : '#FFFFFF',
                          color: numberFormat === 'LAKHS' ? '#2563EB' : '#475569',
                          fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                        }}
                      >
                        {isHindi ? '₹ लाख एवं करोड़ (भारतीय)' : '₹ Lakhs & Crores (Indian)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setNumberFormat('MILLIONS'); showToast(isHindi ? 'संख्या प्रारूप अंतर्राष्ट्रीय प्रणाली (₹ मिलियन / बिलियन) पर सेट' : 'Number format set to International (₹ Millions / Billions)'); }}
                        style={{
                          padding: '0.55rem', borderRadius: '8px',
                          border: numberFormat === 'MILLIONS' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                          background: numberFormat === 'MILLIONS' ? '#EFF6FF' : '#FFFFFF',
                          color: numberFormat === 'MILLIONS' ? '#2563EB' : '#475569',
                          fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                        }}
                      >
                        {isHindi ? '₹ मिलियन एवं बिलियन (अंतर्राष्ट्रीय)' : '₹ Millions & Billions (Intl)'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                        {isHindi ? 'सघन तालिका पंक्तियाँ (कॉम्पैक्ट व्यू)' : 'Compact Table Rows'}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? 'एक साथ अधिक आवेदन रिकॉर्ड देखने के लिए सघन तालिका लेआउट।' : 'Denser tables to view more application records at once.'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={compactView}
                      onChange={(e) => { setCompactView(e.target.checked); showToast(isHindi ? `सघन तालिका मोड ${e.target.checked ? 'सक्रिय' : 'निष्क्रिय'}` : `Compact view mode ${e.target.checked ? 'Enabled' : 'Disabled'}`); }}
                      style={{ accentColor: '#2563EB', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              )}

              {/* =======================================================
                  7. ACCOUNT MANAGEMENT
                  ======================================================= */}
              {activeSettingsModal === 'ACCOUNT' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  {/* Download Archive */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <Download size={18} color="#2563EB" />
                      <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>
                        {isHindi ? 'पूर्ण नागरिक डेटा संग्रह निर्यात करें' : 'Export Complete Citizen Data Archive'}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
                      {isHindi ? 'संरचित JSON प्रारूप में अपनी सभी पंजीकृत प्रोफ़ाइल विशेषताओं, पारिवारिक अभिलेखों, लिंक्ड प्रमाणपत्रों और ऑडिट विवरण की एक सत्यापित डिजिटल प्रति डाउनलोड करें।' : 'Download a verified digital copy of all your registered profile attributes, family records, linked certificates, and audit trails in structured JSON format.'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const exportData = {
                          portal: 'JanPehchaan - Citizen Life Event Registry',
                          timestamp: new Date().toISOString(),
                          citizen: profile,
                          linkedIdentities: linkedAccounts,
                          settings: { twoFactor: twoFactorEnabled, language: portalLanguage, format: numberFormat }
                        };
                        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `JanPehchaan_${profile.id}_archive.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        showToast(isHindi ? 'आधिकारिक नागरिक डेटा संग्रह डाउनलोड हुआ!' : 'Official citizen data archive downloaded!');
                      }}
                      style={{
                        background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px',
                        padding: '0.55rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', marginTop: '0.35rem'
                      }}
                    >
                      <Download size={14} />
                      <span>{isHindi ? 'डेटा संग्रह डाउनलोड करें (JSON)' : 'Download Archive (JSON)'}</span>
                    </button>
                  </div>

                  {/* Data Correction */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <Edit2 size={18} color="#059669" />
                      <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>
                        {isHindi ? 'रजिस्ट्री डेटा सुधार का अनुरोध करें' : 'Request Registry Data Correction'}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
                      {isHindi ? 'यदि राष्ट्रीय डेटाबेस में आपकी जन्मतिथि, नाम की वर्तनी, या पारिवारिक संबंध में कोई विसंगति है, तो सुधार याचिका दायर करें।' : 'If your date of birth, name spelling, or family relation has a discrepancy in the national database, file a rectification petition.'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        showToast(isHindi ? 'डेटा सुधार टोकन दर्ज हुआ! शिकायत निवारण डेस्क पर पुनः निर्देशित किया जा रहा है...' : 'Data correction ticket opened! Redirecting to Grievances desk...');
                        setActiveSettingsModal(null);
                        onNavigateTab && onNavigateTab('grievances');
                      }}
                      style={{
                        background: '#FFFFFF', color: '#059669', border: '1.5px solid #059669', borderRadius: '8px',
                        padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      {isHindi ? 'सुधार अनुरोध दर्ज करें →' : 'File Correction Request →'}
                    </button>
                  </div>

                  {/* Temporary Freeze */}
                  <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <AlertTriangle size={18} color="#DC2626" />
                      <strong style={{ fontSize: '0.875rem', color: '#991B1B' }}>
                        {isHindi ? 'अस्थाई खाता सुरक्षा फ्रीज' : 'Temporary Account Security Freeze'}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7F1D1D', lineHeight: 1.4 }}>
                      {isHindi ? 'यदि आपका मोबाइल उपकरण खो गया है या अनधिकृत पहचान पहुंच का संदेह है, तो लॉगिन और डीबीटी लेनदेन को अस्थाई रूप से लॉक करें।' : 'Temporarily lock logins and DBT transactions if you lost your phone or suspect unauthorized identity access.'}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7F1D1D', display: 'block', marginBottom: '0.25rem' }}>
                        {isHindi ? 'खाता फ्रीज करने का कारण:' : 'Reason for Freeze:'}
                      </label>
                      <select
                        value={freezeReason}
                        onChange={(e) => setFreezeReason(e.target.value)}
                        style={{ width: '100%', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '0.4rem', fontSize: '0.75rem', background: '#FFFFFF' }}
                      >
                        <option value="Lost Mobile Device">{isHindi ? 'पंजीकृत मोबाइल उपकरण / सिम खो गया' : 'Lost Registered Mobile Device / SIM'}</option>
                        <option value="Suspicious Activity">{isHindi ? 'अनधिकृत आधार उपयोग का संदेह' : 'Suspected Unauthorized Aadhaar Usage'}</option>
                        <option value="Personal Break">{isHindi ? 'व्यक्तिगत अस्थाई निष्क्रियता' : 'Personal Temporary Deactivation'}</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        showToast(isHindi ? `खाता अस्थाई रूप से फ्रीज कर दिया गया है (${freezeReason})। अनलॉकिंग पिन आपके ईमेल पर भेज दिया गया है।` : `Account temporarily frozen (${freezeReason}). An unlock PIN has been SMSed to your secondary email.`);
                        setActiveSettingsModal(null);
                      }}
                      style={{
                        background: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '8px',
                        padding: '0.55rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      {isHindi ? 'मेरा खाता तुरंत फ्रीज करें' : 'Freeze My Account Now'}
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Footer / Save & Done */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    showToast(isHindi ? 'सेटिंग्स सफलतापूर्वक सहेजी गईं!' : 'Settings saved successfully!');
                    setActiveSettingsModal(null);
                  }}
                  style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 1.5rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {isHindi ? 'सहेजें व बंद करें' : 'Save & Close'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsTab;
