import React, { useState } from 'react';
import { X, Shield, User, Lock, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../services/api';

export function AuthModal({ isOpen, onClose, onAuthSuccess, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setError('');
    setLoading(true);
    try {
      const res = await ApiService.login(demoEmail, demoPassword);
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message || (isHindi ? 'लॉगिन विफल रहा' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await ApiService.register(name, email, password, phone);
        // Login right after register
        const res = await ApiService.login(email, password);
        onAuthSuccess(res.user);
      } else {
        const res = await ApiService.login(email, password);
        onAuthSuccess(res.user);
      }
      onClose();
    } catch (err) {
      setError(err.message || (isHindi ? 'प्रमाणीकरण विफल रहा' : 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
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
              background: '#1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={18} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>
                {isRegister
                  ? (isHindi ? 'नागरिक खाता बनाएं' : 'Create Citizen Account')
                  : (isHindi ? 'जनपहचान प्रमाणीकरण' : 'JanPehchaan Authentication')}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                {isHindi ? 'सत्यापित अधिकारों और अभिलेखों तक सुरक्षित पहुँच' : 'Secure access to verified entitlements and records'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} color="#64748B" />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Quick Demo Logins Bar */}
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '10px',
            padding: '0.875rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E40AF', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              {isHindi ? '⚡ 1-क्लिक डेमो प्रोफ़ाइल (सीधा प्रवेश)' : '⚡ 1-Click Demo Profiles (Direct Access)'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('citizen@janpehchaan.in', 'Password123')}
                style={{
                  padding: '0.5rem 0.25rem',
                  borderRadius: '6px',
                  border: '1px solid #93C5FD',
                  background: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#1E3A8A',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? '👨‍👩‍👦 नागरिक' : '👨‍👩‍👦 Citizen'}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('officer@janpehchaan.gov.in', 'Password123')}
                style={{
                  padding: '0.5rem 0.25rem',
                  borderRadius: '6px',
                  border: '1px solid #93C5FD',
                  background: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#0A84FF',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? '👮 अधिकारी' : '👮 Officer'}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('admin@janpehchaan.gov.in', 'Password123')}
                style={{
                  padding: '0.5rem 0.25rem',
                  borderRadius: '6px',
                  border: '1px solid #93C5FD',
                  background: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? '🛡️ व्यवस्थापक' : '🛡️ Admin'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              fontSize: '0.8125rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label">{isHindi ? 'पूरा नाम' : 'Full Name'}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder={isHindi ? 'उदा. रमेश कुमार शर्मा' : 'e.g. Ramesh Kumar Sharma'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{isHindi ? 'मोबाइल नंबर' : 'Mobile Number'}</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">{isHindi ? 'ईमेल पता' : 'Email Address'}</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{isHindi ? 'पासवर्ड' : 'Password'}</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? (isHindi ? 'कृपया प्रतीक्षा करें...' : 'Please wait...') : isRegister ? (isHindi ? 'खाता पंजीकृत करें' : 'Register Account') : (isHindi ? 'साइन इन करें' : 'Sign In')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8125rem', color: '#64748B' }}>
            {isRegister ? (isHindi ? 'क्या पहले से खाता है?' : 'Already have an account?') : (isHindi ? 'क्या अभी तक खाता नहीं है?' : "Don't have an account yet?")}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#0A84FF',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}
            >
              {isRegister ? (isHindi ? 'यहाँ साइन इन करें' : 'Sign In here') : (isHindi ? 'नागरिक पंजीकरण करें' : 'Register Citizen')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
