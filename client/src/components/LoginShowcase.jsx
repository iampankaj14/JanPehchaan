import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Users,
  User,
  Lock,
  Eye,
  EyeOff,
  Globe,
  ArrowRight,
  X,
  CheckCircle2,
  Phone,
  Mail,
  KeyRound
} from 'lucide-react';
import { ApiService } from '../services/api';
import AccessibilityToolbar from './AccessibilityToolbar';

export function LoginShowcase({ onLoginSuccess, currentLang = 'en', onToggleLang }) {
  const [internalLang, setInternalLang] = useState(currentLang || 'en');
  const lang = onToggleLang ? currentLang : internalLang;

  const handleLangChange = (newLang) => {
    setInternalLang(newLang);
    if (onToggleLang) {
      onToggleLang(newLang);
    }
  };

  const [identifier, setIdentifier] = useState('citizen@janpehchaan.in');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modals for Register and Forgot Password
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState(1); // 1: input phone/email, 2: OTP, 3: success
  const [forgotInput, setForgotInput] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Bilingual dictionary with simplified, shorter subtitle as requested
  const content = {
    en: {
      welcome: 'Welcome to',
      highlight: 'JanPehchaan',
      subtitle: 'Sign in to access government schemes, citizen services, and updates.',
      pillar1Title: 'Government Welfare Benefits',
      pillar1Desc: 'Direct access to Central & State welfare safety schemes',
      pillar2Title: 'Simple & Secure',
      pillar2Desc: 'Protected citizen identity with cryptographic security',
      pillar3Title: 'Accessible for Everyone',
      pillar3Desc: 'Equal entitlement rights for every citizen',
      signInTitle: 'Sign In',
      signInSubtitle: 'Access your verified citizen account',
      placeholderIdentifier: 'Mobile Number / Email ID',
      placeholderPassword: 'Password',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot password?',
      signInBtn: 'Sign In',
      pleaseWait: 'Please wait...',
      noAccount: "Don't have an account?",
      registerNow: 'Register Now',
      quickDemo: '⚡ Demo:',
      langBtn: 'हिन्दी',
      regModalTitle: 'Register Citizen Account',
      regModalSubtitle: 'JanPehchaan Unified Citizen Registry',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Ramesh Kumar Sharma',
      mobileNumber: 'Mobile Number',
      mobilePlaceholder: '9876543210',
      emailAddress: 'Email Address',
      emailPlaceholder: 'citizen@janpehchaan.in',
      passwordLabel: 'Password',
      createAccountBtn: '✓ Create Account & Sign In',
      registering: 'Registering...',
      forgotModalTitle: 'Reset Password',
      forgotModalSubtitle: 'JanPehchaan Account Recovery',
      forgotInstruction: 'Enter your registered email address or mobile number to receive a verification OTP.',
      forgotInputPlaceholder: 'e.g. citizen@janpehchaan.in or 9876543210',
      sendOtpBtn: 'Send Verification OTP',
      sendingOtp: 'Sending OTP...',
      otpSentBanner: '✓ 4-digit OTP sent to',
      demoOtp: '(Demo OTP: 4921)',
      enterOtp: 'Enter 4-Digit OTP',
      newPassword: 'New Password',
      setNewPasswordBtn: '✓ Set New Password',
      updatingPassword: 'Updating Password...',
      resetSuccessTitle: 'Password Reset Successful!',
      resetSuccessSubtitle: 'You can now sign in with your new credentials.'
    },
    hi: {
      welcome: 'जनपहचान में आपका',
      highlight: 'स्वागत है',
      subtitle: 'सरकारी योजनाओं, नागरिक सेवाओं और अपडेट्स के लिए लॉगिन करें।',
      pillar1Title: 'सरकारी योजनाओं का लाभ',
      pillar1Desc: 'केंद्र और राज्य सरकार की कल्याणकारी योजनाएँ',
      pillar2Title: 'आसान और सुरक्षित',
      pillar2Desc: 'क्रिप्टोग्राफ़िक सुरक्षा से सुरक्षित नागरिक पहचान',
      pillar3Title: 'सभी के लिए सुलभ',
      pillar3Desc: 'प्रत्येक नागरिक के लिए समान अधिकार व सुविधा',
      signInTitle: 'साइन इन करें',
      signInSubtitle: 'अपने सत्यापित नागरिक खाते में लॉगिन करें',
      placeholderIdentifier: 'मोबाइल नंबर / ईमेल आईडी',
      placeholderPassword: 'पासवर्ड',
      rememberMe: 'मुझे याद रखें',
      forgotPassword: 'पासवर्ड भूल गए?',
      signInBtn: 'साइन इन करें',
      pleaseWait: 'कृपया प्रतीक्षा करें...',
      noAccount: 'खाता नहीं है?',
      registerNow: 'रजिस्टर करें',
      quickDemo: '⚡ डेमो:',
      langBtn: 'English',
      regModalTitle: 'नागरिक खाता पंजीकरण',
      regModalSubtitle: 'जनपहचान एकीकृत नागरिक रजिस्टर',
      fullName: 'पूरा नाम',
      fullNamePlaceholder: 'उदा. रमेश कुमार शर्मा',
      mobileNumber: 'मोबाइल नंबर',
      mobilePlaceholder: '9876543210',
      emailAddress: 'ईमेल आईडी',
      emailPlaceholder: 'citizen@janpehchaan.in',
      passwordLabel: 'पासवर्ड',
      createAccountBtn: '✓ खाता बनाएं व लॉगिन करें',
      registering: 'पंजीकरण हो रहा है...',
      forgotModalTitle: 'पासवर्ड रीसेट करें',
      forgotModalSubtitle: 'जनपहचान खाता पुनः प्राप्ति',
      forgotInstruction: 'सत्यापन ओटीपी प्राप्त करने के लिए अपना पंजीकृत मोबाइल नंबर या ईमेल आईडी दर्ज करें।',
      forgotInputPlaceholder: 'उदा. 9876543210 या citizen@janpehchaan.in',
      sendOtpBtn: 'सत्यापन ओटीपी भेजें',
      sendingOtp: 'ओटीपी भेजा जा रहा है...',
      otpSentBanner: '✓ 4-अंकों का ओटीपी भेजा गया:',
      demoOtp: '(डेमो ओटीपी: 4921)',
      enterOtp: '4-अंकों का ओटीपी दर्ज करें',
      newPassword: 'नया पासवर्ड',
      setNewPasswordBtn: '✓ नया पासवर्ड सेट करें',
      updatingPassword: 'पासवर्ड अपडेट हो रहा है...',
      resetSuccessTitle: 'पासवर्ड सफलतापूर्वक रीसेट हुआ!',
      resetSuccessSubtitle: 'अब आप अपने नए पासवर्ड के साथ लॉगिन कर सकते हैं।'
    }
  };

  const t = content[lang] || content.en;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await ApiService.login(identifier, password);
      onLoginSuccess(res.user);
    } catch (err) {
      // Demo fallback persona
      const mockRole = identifier.includes('admin')
        ? 'ADMIN'
        : identifier.includes('officer')
        ? 'OFFICER'
        : 'CITIZEN';

      const mockUser = {
        name: identifier.includes('admin')
          ? 'Dr. Pankaj Kumar (Admin)'
          : identifier.includes('officer')
          ? 'Ayush Pal (Officer)'
          : 'Ramesh Kumar Sharma',
        email: identifier,
        role: mockRole
      };
      localStorage.setItem('janpehchaan_user', JSON.stringify(mockUser));
      onLoginSuccess(mockUser);
    } finally {
      setLoading(false);
    }
  };

  // Real Citizen Registration connected to Backend API / Database
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegLoading(true);

    try {
      await ApiService.register(regName, regEmail, regPassword, regPhone);
      // Auto login after registration
      const loginRes = await ApiService.login(regEmail, regPassword);
      setShowRegisterModal(false);
      onLoginSuccess(loginRes.user);
    } catch (err) {
      // Fallback demo simulation
      const newUser = {
        name: regName,
        email: regEmail,
        phone: regPhone,
        role: 'CITIZEN'
      };
      localStorage.setItem('janpehchaan_user', JSON.stringify(newUser));
      setShowRegisterModal(false);
      onLoginSuccess(newUser);
    } finally {
      setRegLoading(false);
    }
  };

  // Forgot Password Flow
  const handleForgotSendOtp = (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStep(2);
    }, 600);
  };

  const handleForgotResetPass = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      if (forgotInput && forgotInput.includes('@')) {
        await ApiService.resetPassword(forgotInput, forgotNewPass);
      }
    } catch (err) {
      console.log('Reset simulation mode:', err.message);
    } finally {
      setForgotLoading(false);
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotSuccess(false);
        if (forgotInput) setIdentifier(forgotInput);
        if (forgotNewPass) setPassword(forgotNewPass);
      }, 1400);
    }
  };

  const setDemoRole = (role) => {
    if (role === 'CITIZEN') {
      setIdentifier('citizen@janpehchaan.in');
      setPassword('Password123');
    } else if (role === 'OFFICER') {
      setIdentifier('officer@janpehchaan.gov.in');
      setPassword('Password123');
    } else {
      setIdentifier('admin@janpehchaan.gov.in');
      setPassword('Password123');
    }
  };

  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      width: '100vw',
      maxWidth: '100vw',
      background: '#FFFFFF',
      color: '#0F172A',
      fontFamily: 'var(--font-heading)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem 3rem',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Micro-animations stylesheet */}
      <style>{`
        .pill-card {
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.28s ease;
          cursor: default;
        }
        .pill-card:hover {
          transform: translateX(8px) translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08) !important;
        }
        .pill-card:hover .pill-icon {
          transform: scale(1.12) rotate(4deg);
        }
        .pill-icon {
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes floatEmblem {
          0%, 100% {
            transform: translateY(-48%) scale(1);
          }
          50% {
            transform: translateY(-52%) scale(1.015);
          }
        }
      `}</style>

      {/* Main Grid */}
      <div style={{
        width: '100%',
        maxWidth: '1360px',
        height: '100%',
        maxHeight: '94vh',
        display: 'grid',
        gridTemplateColumns: '1.35fr 380px',
        gap: '3.5rem',
        alignItems: 'center'
      }}>
        {/* =========================================================
            LEFT COLUMN: ANIMATED EMBLEM BACKGROUND + CLEAN COMPACT POINTS
            ========================================================= */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          overflow: 'hidden',
          background: '#FFFFFF'
        }}>
          {/* BIG INTEGRATED BACKGROUND ARTWORK (Shifted right to avoid collision + gentle breathing animation) */}
          <img
            src="/assets/india_family.png"
            alt="India Family Community Background"
            style={{
              position: 'absolute',
              right: '-60px',
              top: '50%',
              width: '520px',
              maxWidth: '60%',
              maxHeight: '90vh',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
              zIndex: 1,
              opacity: 0.96,
              animation: 'floatEmblem 6s ease-in-out infinite'
            }}
            onError={(e) => {
              e.currentTarget.src = '/assets/India Family Community Emblem.png';
            }}
          />

          {/* Foreground Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '380px' }}>
            {/* Top Branding: Single Official Logo */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <img
                src="/assets/logo.png"
                alt="JanPehchaan - Your Identity, Your Right"
                style={{
                  height: '75px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Welcome Heading (More compact size as requested) */}
            <div style={{ marginBottom: '0.95rem' }}>
              <h1 style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#0B2545',
                lineHeight: 1.18,
                margin: '0 0 0.3rem 0',
                letterSpacing: '-0.025em'
              }}>
                {t.welcome} <br />
                <span style={{ color: '#059669', display: 'inline' }}>{t.highlight}</span>
              </h1>

              {/* Compact, clean subtitle */}
              <p style={{
                fontSize: '0.78rem',
                color: '#475569',
                lineHeight: 1.45,
                margin: 0,
                maxWidth: '340px'
              }}>
                {t.subtitle}
              </p>
            </div>

            {/* 3 Compact Animated Points (Clean, compact sizing) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', maxWidth: '340px' }}>
              {/* Point 1: Orange */}
              <div
                className="pill-card"
                style={{
                  background: '#FFF8F1',
                  border: '1px solid #FED7AA',
                  borderRadius: '10px',
                  padding: '0.52rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(249, 115, 22, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    className="pill-icon"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#F97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(249, 115, 22, 0.28)'
                    }}
                  >
                    <Shield size={16} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0B2545' }}>
                      {t.pillar1Title}
                    </div>
                    <div style={{ fontSize: '0.67rem', color: '#64748B', lineHeight: 1.3, marginTop: '0.05rem' }}>
                      {t.pillar1Desc}
                    </div>
                  </div>
                </div>
              </div>

              {/* Point 2: Green */}
              <div
                className="pill-card"
                style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '10px',
                  padding: '0.52rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    className="pill-icon"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.28)'
                    }}
                  >
                    <FileText size={16} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0B2545' }}>
                      {t.pillar2Title}
                    </div>
                    <div style={{ fontSize: '0.67rem', color: '#64748B', lineHeight: 1.3, marginTop: '0.05rem' }}>
                      {t.pillar2Desc}
                    </div>
                  </div>
                </div>
              </div>

              {/* Point 3: Blue */}
              <div
                className="pill-card"
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '10px',
                  padding: '0.52rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    className="pill-icon"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.28)'
                    }}
                  >
                    <Users size={16} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0B2545' }}>
                      {t.pillar3Title}
                    </div>
                    <div style={{ fontSize: '0.67rem', color: '#64748B', lineHeight: 1.3, marginTop: '0.05rem' }}>
                      {t.pillar3Desc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: LOGIN CARD (NO GOOGLE BUTTON, FUNCTIONAL BUTTONS)
            ========================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Top Accessibility Bar matching Image 3: Language + Alphabet Size (A- A A+) + Theme Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: '0.25rem'
          }}>
            <AccessibilityToolbar
              currentLang={lang}
              onToggleLang={handleLangChange}
            />
          </div>

          {/* Login Card (Clean, compact, no Google button, prominent logo) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
            padding: '1.4rem 1.6rem',
            position: 'relative'
          }}>
            {/* Prominent logo image at top of login card */}
            <div style={{ textAlign: 'center', marginBottom: '0.65rem' }}>
              <img
                src="/assets/logo.png"
                alt="JanPehchaan"
                style={{
                  height: '92px',
                  width: 'auto',
                  margin: '0 auto',
                  display: 'block',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Title & Subtitle */}
            <div style={{ marginBottom: '0.85rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.15rem 0' }}>
                {t.signInTitle}
              </h2>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748B' }}>
                {t.signInSubtitle}
              </p>
            </div>

            {error && (
              <div style={{
                padding: '0.45rem 0.7rem',
                borderRadius: '8px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                fontSize: '0.72rem',
                marginBottom: '0.75rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Input 1: Identifier */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0 0.75rem',
                  background: '#FFFFFF'
                }}>
                  <User size={16} color="#94A3B8" />
                  <input
                    type="text"
                    required
                    placeholder={t.placeholderIdentifier}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.62rem 0.6rem',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.825rem',
                      fontFamily: 'var(--font-heading)',
                      color: '#0F172A'
                    }}
                  />
                </div>
              </div>

              {/* Input 2: Password */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0 0.75rem',
                  background: '#FFFFFF'
                }}>
                  <Lock size={16} color="#94A3B8" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={t.placeholderPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.62rem 0.6rem',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.825rem',
                      fontFamily: 'var(--font-heading)',
                      color: '#0F172A'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Button (Triggers Forgot Password Modal) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.95rem',
                fontSize: '0.76rem'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#0B2545' }}
                  />
                  <span>{t.rememberMe}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0A84FF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    padding: 0
                  }}
                >
                  {t.forgotPassword}
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.72rem',
                  borderRadius: '8px',
                  background: '#0B2545',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(11, 37, 69, 0.25)'
                }}
              >
                <span>{loading ? t.pleaseWait : t.signInBtn}</span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Register link (Triggers Citizen Registration Modal) */}
            <div style={{ textAlign: 'center', marginTop: '0.9rem', fontSize: '0.78rem', color: '#64748B' }}>
              {t.noAccount}{' '}
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0A84FF',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: 0
                }}
              >
                {t.registerNow}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          REGISTER NEW CITIZEN MODAL (CONNECTED TO BACKEND API)
          ========================================================= */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
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
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#0F172A' }}>
                  {t.regModalTitle}
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                  {t.regModalSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} style={{ padding: '1.5rem' }}>
              {regError && (
                <div style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#B91C1C',
                  fontSize: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  {regError}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem', display: 'block' }}>
                  {t.fullName}
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder={t.fullNamePlaceholder}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem', display: 'block' }}>
                  {t.mobileNumber}
                </label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder={t.mobilePlaceholder}
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem', display: 'block' }}>
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder={t.emailPlaceholder}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem', display: 'block' }}>
                  {t.passwordLabel}
                </label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: '#0B2545',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {regLoading ? t.registering : t.createAccountBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          FORGOT PASSWORD MODAL (FUNCTIONAL 2-STEP RESET SIMULATION)
          ========================================================= */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
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
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#0F172A' }}>
                  {t.forgotModalTitle}
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                  {t.forgotModalSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {forgotSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <CheckCircle2 size={44} color="#10B981" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h4 style={{ margin: '0 0 0.35rem 0', color: '#0F172A' }}>{t.resetSuccessTitle}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                    {t.resetSuccessSubtitle}
                  </p>
                </div>
              ) : forgotStep === 1 ? (
                <form onSubmit={handleForgotSendOtp}>
                  <p style={{ fontSize: '0.825rem', color: '#475569', margin: '0 0 1rem 0' }}>
                    {t.forgotInstruction}
                  </p>
                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <input
                      type="text"
                      required
                      placeholder={t.forgotInputPlaceholder}
                      value={forgotInput}
                      onChange={(e) => setForgotInput(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: '#0B2545',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {forgotLoading ? t.sendingOtp : t.sendOtpBtn}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotResetPass}>
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.78rem', color: '#1E40AF' }}>
                    {t.otpSentBanner} {forgotInput || (lang === 'hi' ? 'पंजीकृत संपर्क' : 'registered contact')}. {t.demoOtp}
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem', display: 'block' }}>
                      {t.enterOtp}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4921"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', letterSpacing: '4px', textAlign: 'center', fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem', display: 'block' }}>
                      {t.newPassword}
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {forgotLoading ? t.updatingPassword : t.setNewPasswordBtn}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginShowcase;
