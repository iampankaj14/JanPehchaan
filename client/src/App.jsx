import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Preloader from './components/Preloader';
import AuthModal from './components/AuthModal';
import LoginShowcase from './components/LoginShowcase';
import OverviewTab from './components/dashboard/OverviewTab';
import FamilyExplorerTab from './components/dashboard/FamilyExplorerTab';
import FamilyMembersTab from './components/dashboard/FamilyMembersTab';
import SchemeMatcherTab from './components/dashboard/SchemeMatcherTab';
import DuplicateReviewTab from './components/dashboard/DuplicateReviewTab';
import AuditTimelineTab from './components/dashboard/AuditTimelineTab';
import DigitalIdTab from './components/dashboard/DigitalIdTab';
import ApplicationsTab from './components/dashboard/ApplicationsTab';
import AppointmentsTab from './components/dashboard/AppointmentsTab';
import GrievancesTab from './components/dashboard/GrievancesTab';
import CertificatesTab from './components/dashboard/CertificatesTab';
import DocumentWalletTab from './components/dashboard/DocumentWalletTab';
import ServicesTab from './components/dashboard/ServicesTab';
import SupportHelpTab from './components/dashboard/SupportHelpTab';
import SettingsTab from './components/dashboard/SettingsTab';
import AddFamilyModal from './components/modals/AddFamilyModal';
import ApplySchemeModal from './components/modals/ApplySchemeModal';
import PehchaanAIChatbot from './components/PehchaanAIChatbot';
import { ApiService } from './services/api';

export function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [showLoginShowcase, setShowLoginShowcase] = useState(true);
  const [currentTab, setCurrentTab] = useState('overview');
  const mainContentRef = useRef(null);
  const [user, setUser] = useState(
    ApiService.getCurrentUser() || {
      name: 'Pankaj Kumar',
      email: 'citizen@janpehchaan.in',
      role: 'CITIZEN'
    }
  );
  const [currentLang, setCurrentLang] = useState('en');

  // Data states
  const [stats, setStats] = useState(null);
  const [families, setFamilies] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [addFamilyModalOpen, setAddFamilyModalOpen] = useState(false);
  const [applySchemeModalOpen, setApplySchemeModalOpen] = useState(false);
  const [schemeToApply, setSchemeToApply] = useState(null);
  const [targetFamilyIdForSchemes, setTargetFamilyIdForSchemes] = useState('FAM-101');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Initial Load from Backend API
  const refreshData = async () => {
    try {
      const [statsRes, familiesRes, dupRes, auditRes] = await Promise.allSettled([
        ApiService.getDashboardStats(),
        ApiService.getFamilies(),
        ApiService.getDuplicateQueue(),
        ApiService.getAuditLogs()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value.stats || statsRes.value);
      }

      if (familiesRes.status === 'fulfilled' && familiesRes.value) {
        setFamilies(familiesRes.value.families || familiesRes.value || []);
      } else {
        // Fallback demo families
        setFamilies([
          {
            id: 'FAM-101',
            headName: 'Ramesh Kumar Sharma',
            district: 'Jaipur',
            state: 'Rajasthan',
            village: 'Rampur',
            annualIncome: 120000,
            landHoldingAcres: 1.5,
            category: 'OBC',
            rationCardNumber: 'RC-772910',
            members: [
              { name: 'Ramesh Kumar Sharma', relation: 'HEAD', age: 48, gender: 'Male', aadhaarLast4: '4921', occupation: 'Small Farmer' },
              { name: 'Sunita Devi', relation: 'SPOUSE', age: 44, gender: 'Female', aadhaarLast4: '3819', occupation: 'Homemaker' },
              { name: 'Amit Sharma', relation: 'SON', age: 20, gender: 'Male', aadhaarLast4: '9921', occupation: 'College Student' },
              { name: 'Pooja Sharma', relation: 'DAUGHTER', age: 16, gender: 'Female', aadhaarLast4: '5510', occupation: 'High School Student' }
            ]
          },
          {
            id: 'FAM-102',
            headName: 'Kailash Chand Meena',
            district: 'Dausa',
            state: 'Rajasthan',
            village: 'Mandawar',
            annualIncome: 85000,
            landHoldingAcres: 0.8,
            category: 'ST',
            rationCardNumber: 'RC-992182',
            members: [
              { name: 'Kailash Chand Meena', relation: 'HEAD', age: 52, gender: 'Male', aadhaarLast4: '7721', occupation: 'Agricultural Labor' },
              { name: 'Geeta Devi Meena', relation: 'SPOUSE', age: 49, gender: 'Female', aadhaarLast4: '1102', occupation: 'Craftswoman' },
              { name: 'Rahul Meena', relation: 'SON', age: 22, gender: 'Male', aadhaarLast4: '4481', occupation: 'Apprentice' }
            ]
          },
          {
            id: 'FAM-103',
            headName: 'Vikram Singh Rathore',
            district: 'Alwar',
            state: 'Rajasthan',
            village: 'Kotputli',
            annualIncome: 240000,
            landHoldingAcres: 3.2,
            category: 'GENERAL',
            rationCardNumber: 'RC-441029',
            members: [
              { name: 'Vikram Singh Rathore', relation: 'HEAD', age: 55, gender: 'Male', aadhaarLast4: '8821', occupation: 'Dairy Farmer' },
              { name: 'Shashi Rathore', relation: 'SPOUSE', age: 50, gender: 'Female', aadhaarLast4: '9912', occupation: 'Teacher' }
            ]
          }
        ]);
      }

      if (dupRes.status === 'fulfilled' && dupRes.value) {
        setDuplicates(dupRes.value.queue || dupRes.value || []);
      }

      if (auditRes.status === 'fulfilled' && auditRes.value) {
        setAuditLogs(auditRes.value.logs || auditRes.value || []);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
  };

  // URL routing helper
  const navigateTo = (path, replace = false) => {
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    syncRouteFromUrl();
  };

  const syncRouteFromUrl = () => {
    const rawPath = window.location.pathname.toLowerCase().replace(/\/$/, '');

    if (rawPath.startsWith('/dashboard')) {
      const parts = rawPath.split('/');
      const tab = parts[2] || 'overview';
      setShowLoginShowcase(false);
      setShowPreloader(false);
      const validTabs = [
        'overview', 'digital_id', 'services', 'schemes', 'applications',
        'appointments', 'grievances', 'certificates',
        'families', 'wallet', 'support', 'settings', 'duplicates', 'audit'
      ];
      if (validTabs.includes(tab)) {
        setCurrentTab(tab);
      } else {
        setCurrentTab('overview');
      }
    } else {
      setShowLoginShowcase(true);
      if (window.location.pathname !== '/login' && window.location.pathname !== '' && window.location.pathname !== '/') {
        window.history.replaceState({}, '', '/login');
      }
    }
  };

  useEffect(() => {
    syncRouteFromUrl();
    const handlePopState = () => syncRouteFromUrl();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  // Persona quick switch handler
  const handleRoleSwitch = (newRole) => {
    let mockUser;
    if (newRole === 'ADMIN') {
      mockUser = { name: 'Dr. Pankaj Kumar (Admin)', email: 'admin@janpehchaan.gov.in', role: 'ADMIN' };
    } else if (newRole === 'OFFICER') {
      mockUser = { name: 'Suresh Verma (Verification Desk)', email: 'officer@janpehchaan.gov.in', role: 'OFFICER' };
    } else {
      mockUser = { name: 'Ramesh Kumar Sharma (Citizen)', email: 'citizen@janpehchaan.in', role: 'CITIZEN' };
    }
    setUser(mockUser);
    localStorage.setItem('janpehchaan_user', JSON.stringify(mockUser));
    showToast(`Switched persona to ${mockUser.name} (${newRole})`);
  };

  const handleSelectTab = (tab) => {
    setCurrentTab(tab);
    navigateTo(`/dashboard/${tab}`);
    // Immediately reset scroll to the very top so new page never starts scrolled
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Extra safety: reset scroll anytime currentTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentTab]);

  const handleLogout = () => {
    ApiService.logout();
    setUser(null);
    setShowLoginShowcase(true);
    navigateTo('/login');
    showToast('Signed out of session');
  };

  const handleFamilyCreated = (newFamily) => {
    setFamilies((prev) => [newFamily, ...prev]);
    showToast(`Household "${newFamily.headName}" successfully enrolled in JanPehchaan!`);
    handleSelectTab('families');
  };

  const handleSchemeApplied = (schemeData) => {
    showToast(`Welfare Claim for "${schemeData.schemeName}" submitted!`);
  };

  const handleSelectFamilyForSchemes = (familyId) => {
    setTargetFamilyIdForSchemes(familyId);
    handleSelectTab('schemes');
  };

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setShowLoginShowcase(false);
    navigateTo('/dashboard/overview');
    showToast(`स्वागत है, ${authenticatedUser.name}!`);
  };

  return (
    <>
      {/* 1. Splash Screen Video Animation */}
      {showPreloader && (
        <Preloader
          currentLang={currentLang}
          onComplete={() => {
            setShowPreloader(false);
            setShowLoginShowcase(true);
            window.history.replaceState({}, '', '/login');
          }}
        />
      )}

      {/* 2. Login & Showcase Dual View (Web + Phone) */}
      {!showPreloader && showLoginShowcase && (
        <LoginShowcase
          onLoginSuccess={handleLoginSuccess}
          currentLang={currentLang}
          onToggleLang={(lang) => {
            const next = typeof lang === 'string' ? lang : (currentLang === 'en' ? 'hi' : 'en');
            setCurrentLang(next);
            showToast(next === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है' : 'Language switched to English');
          }}
        />
      )}

      {/* 3. Mission Control Application Portal */}
      {!showPreloader && !showLoginShowcase && (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8FAFC' }}>
          {/* Topbar Header (Full width across top matching reference image 1) */}
          <Header
            user={user}
            onLoginClick={() => setAuthModalOpen(true)}
            onLogout={handleLogout}
            onRoleSwitch={handleRoleSwitch}
            onShowPortal={() => {
              setShowLoginShowcase(true);
              navigateTo('/login');
            }}
            currentLang={currentLang}
            onToggleLang={(lang) => {
              const next = typeof lang === 'string' ? lang : (currentLang === 'en' ? 'hi' : 'en');
              setCurrentLang(next);
              showToast(next === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है' : 'Language switched to English');
            }}
            onToast={showToast}
            onNavigateTab={handleSelectTab}
          />

          {/* Body Container: Sidebar on Left, Content on Right matching reference image 2 */}
          <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 61px)' }}>
            <Sidebar
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
              duplicateCount={duplicates.length || 1}
              currentLang={currentLang}
            />

            {/* Main Application Area */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              {/* Toast Notification Banner */}
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
                  zIndex: 1000,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  animation: 'modalEnter 0.2s ease-out'
                }}>
                  <span style={{ color: '#10B981' }}>✓</span>
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* Tab Content Page */}
              <main ref={mainContentRef} className="page-container" style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto', overflowX: 'hidden' }}>
                {currentTab === 'overview' && (
                  <OverviewTab
                    stats={stats}
                    user={user}
                    family={families[0]}
                    onNavigateTab={handleSelectTab}
                    onAddFamilyClick={() => setAddFamilyModalOpen(true)}
                    onApplyScheme={(data) => {
                      setSchemeToApply(data);
                      setApplySchemeModalOpen(true);
                    }}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'digital_id' && (
                  <DigitalIdTab
                    user={user}
                    family={families[0]}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'families' && (
                  <FamilyMembersTab
                    user={user}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'schemes' && (
                  <SchemeMatcherTab
                    families={families}
                    initialFamilyId={targetFamilyIdForSchemes}
                    onNavigateTab={handleSelectTab}
                    onApplyScheme={(data) => {
                      setSchemeToApply(data);
                      setApplySchemeModalOpen(true);
                    }}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'duplicates' && (
                  <DuplicateReviewTab
                    duplicates={duplicates}
                    onActionComplete={() => {
                      refreshData();
                      showToast(currentLang === 'hi' ? 'डुप्लिकेट रिकॉर्ड समीक्षा ऑडिट लॉग में दर्ज की गई।' : 'Deduplication record action recorded in audit log.');
                    }}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'audit' && (
                  <AuditTimelineTab
                    auditLogs={auditLogs}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'applications' && (
                  <ApplicationsTab
                    user={user}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'appointments' && (
                  <AppointmentsTab
                    user={user}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'grievances' && (
                  <GrievancesTab
                    user={user}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'certificates' && (
                  <CertificatesTab
                    user={user}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'wallet' && (
                  <DocumentWalletTab
                    user={user}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'services' && (
                  <ServicesTab
                    user={user}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'support' && (
                  <SupportHelpTab
                    user={user}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}

                {currentTab === 'settings' && (
                  <SettingsTab
                    user={user}
                    onNavigateTab={handleSelectTab}
                    currentLang={currentLang}
                  />
                )}
              </main>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          setShowLoginShowcase(false);
          navigateTo('/dashboard/overview');
          showToast(currentLang === 'hi' ? `स्वागत है, ${u.name}!` : `Welcome, ${u.name}!`);
        }}
        currentLang={currentLang}
      />

      <AddFamilyModal
        isOpen={addFamilyModalOpen}
        onClose={() => setAddFamilyModalOpen(false)}
        onFamilyCreated={handleFamilyCreated}
        currentLang={currentLang}
      />

      <ApplySchemeModal
        isOpen={applySchemeModalOpen}
        onClose={() => setApplySchemeModalOpen(false)}
        schemeData={schemeToApply}
        onApplied={handleSchemeApplied}
        currentLang={currentLang}
      />

      {/* Floating Draggable AI Chatbot matching Netra AI */}
      {!showPreloader && !showLoginShowcase && (
        <PehchaanAIChatbot
          user={user}
          onNavigateTab={handleSelectTab}
          currentLang={currentLang}
        />
      )}
    </>
  );
}

export default App;
