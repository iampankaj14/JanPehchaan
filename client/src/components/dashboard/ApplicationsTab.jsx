import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Hourglass,
  X,
  ChevronRight,
  MoreVertical,
  Plus,
  Upload,
  Eye,
  RotateCcw,
  Info,
  Building2,
  AlertCircle,
  FileCheck,
  Check,
  Sprout,
  Heart,
  GraduationCap,
  Download,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export function ApplicationsTab({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  // Filter and sort state
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, IN_PROGRESS, APPROVED, PENDING_ACTION, REJECTED
  const [sortBy, setSortBy] = useState('RECENT'); // RECENT, OLDEST
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);
  const [selectedAppForTrack, setSelectedAppForTrack] = useState(null);
  const [uploadDocModalOpen, setUploadDocModalOpen] = useState(false);
  const [uploadingForApp, setUploadingForApp] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const fileInputRef = useRef(null);

  const openUploadModalFor = (app) => {
    setUploadingForApp(app);
    setUploadedFile(null);
    setUploadError('');
    setUploadDocModalOpen(true);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Applications list matching exact reference image
  const [applications, setApplications] = useState([
    {
      id: 'AB20241022001',
      title: 'PM-KISAN',
      subtitle: 'Direct income support to farmers',
      category: 'Agriculture',
      categoryBg: '#DCFCE7',
      categoryColor: '#16A34A',
      icon: Sprout,
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
      appliedOn: '22 Oct 2024',
      lastUpdated: '24 Oct 2024',
      status: 'APPROVED',
      statusLabel: 'Approved',
      benefit: '₹6,000 per year DBT income support',
      bankAccount: 'SBIN00049219827 (Direct Benefit Transfer)',
      steps: [
        { title: 'Application Submitted', date: '22 Oct 2024', completed: true },
        { title: 'Verification', date: '23 Oct 2024', completed: true },
        { title: 'Approved', date: '24 Oct 2024', completed: true }
      ],
      remarks: 'Land revenue documents and Aadhaar e-KYC verified by District Revenue Officer.'
    },
    {
      id: 'AB20241015002',
      title: 'Ayushman Bharat',
      subtitle: 'Health coverage for eligible families',
      category: 'Health',
      categoryBg: '#FEE2E2',
      categoryColor: '#DC2626',
      icon: Heart,
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
      appliedOn: '15 Oct 2024',
      lastUpdated: '20 Oct 2024',
      status: 'IN_PROGRESS',
      statusLabel: 'Under Review',
      benefit: '₹5,00,000 cashless annual medical assurance',
      bankAccount: 'Linked to Jan Pehchaan Health Vault',
      steps: [
        { title: 'Application Submitted', date: '15 Oct 2024', completed: true },
        { title: 'Verification', date: 'In Progress', active: true },
        { title: 'Final Review', date: null, pending: true },
        { title: 'Result', date: null, pending: true }
      ],
      remarks: 'SECC 2011 ration record under verification by State Health Authority desk.'
    },
    {
      id: 'AB20241012003',
      title: 'Scholarship Scheme',
      subtitle: 'Financial support for students',
      category: 'Education',
      categoryBg: '#EFF6FF',
      categoryColor: '#2563EB',
      icon: GraduationCap,
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE',
      appliedOn: '12 Oct 2024',
      lastUpdated: '14 Oct 2024',
      status: 'PENDING_ACTION',
      statusLabel: 'Pending Action',
      benefit: '₹25,000 Merit-cum-Means Education Grant',
      bankAccount: 'Student Account SBIN00049219827',
      steps: [
        { title: 'Application Submitted', date: '12 Oct 2024', completed: true },
        { title: 'Document Verification', date: 'Completed', completed: true },
        { title: 'Additional Documents', date: 'Required', actionRequired: true },
        { title: 'Final Review', date: null, pending: true }
      ],
      actionRequiredAlert: 'Please upload the required documents to continue your application.',
      remarks: 'Previous academic marksheet and current college fee receipt required.'
    }
  ]);

  // Status Counts
  const counts = useMemo(() => {
    return {
      total: applications.length,
      approved: applications.filter((a) => a.status === 'APPROVED').length,
      underReview: applications.filter((a) => a.status === 'IN_PROGRESS').length,
      pendingAction: applications.filter((a) => a.status === 'PENDING_ACTION').length,
      rejected: applications.filter((a) => a.status === 'REJECTED').length
    };
  }, [applications]);

  // Filtered and Sorted applications
  const filteredApplications = useMemo(() => {
    let list = applications.filter((app) => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'IN_PROGRESS') return app.status === 'IN_PROGRESS';
      if (activeFilter === 'APPROVED') return app.status === 'APPROVED';
      if (activeFilter === 'PENDING_ACTION') return app.status === 'PENDING_ACTION';
      if (activeFilter === 'REJECTED') return app.status === 'REJECTED';
      return true;
    });

    if (sortBy === 'RECENT') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'OLDEST') {
      list.sort((a, b) => a.id.localeCompare(b.id));
    }

    return list;
  }, [applications, activeFilter, sortBy]);

  // Handle Document Upload Submit
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      setUploadError('No document attached. Please upload a valid document (PNG, JPG, or PDF) before submitting.');
      return;
    }

    setUploadError('');
    setIsSubmittingDoc(true);
    setTimeout(() => {
      setIsSubmittingDoc(false);
      setUploadDocModalOpen(false);
      setUploadedFile(null);

      // Update the scholarship scheme status to In Progress
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === uploadingForApp?.id || app.status === 'PENDING_ACTION') {
            return {
              ...app,
              status: 'IN_PROGRESS',
              statusLabel: 'Under Review',
              actionRequiredAlert: null,
              lastUpdated: 'Just now',
              steps: [
                { title: 'Application Submitted', date: '12 Oct 2024', completed: true },
                { title: 'Document Verification', date: 'Completed', completed: true },
                { title: 'Additional Documents', date: 'Submitted', completed: true },
                { title: 'Final Review', date: 'In Progress', active: true }
              ]
            };
          }
          return app;
        })
      );

      showToast('Document uploaded successfully in verified format! Status changed to Under Review.');
    }, 1200);
  };

  const handleDownloadCertificate = (app) => {
    showToast(`Downloading official sanction certificate for ${app.title} (PDF)...`);
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
              {isHindi ? 'आवेदन' : 'Applications'}
            </span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'मेरे आवेदन' : 'My Applications'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'सरकारी योजनाओं व सेवाओं के अपने सभी आवेदनों की वास्तविक स्थिति एक जगह ट्रैक करें।' : 'Track and manage all your government service and scheme applications in one place.'}
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
              <span>पारदर्शी सेवाएँ<br />सशक्त नागरिक</span>
            ) : (
              <span>&ldquo;Transparent Services<br />Stronger Citizens&rdquo;</span>
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
          2. METRIC STAT CARDS ROW (5 Cards)
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1rem'
      }}>
        {/* 1. Total Applications */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <FileText size={20} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              {counts.total}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginTop: '0.15rem' }}>
              {isHindi ? 'कुल आवेदन' : 'Total Applications'}
            </div>
          </div>
        </div>

        {/* 2. Approved */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Check size={20} color="#16A34A" strokeWidth={3} />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              {counts.approved}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginTop: '0.15rem' }}>
              {isHindi ? 'स्वीकृत' : 'Approved'}
            </div>
          </div>
        </div>

        {/* 3. Under Review */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={20} color="#D97706" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              {counts.underReview}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginTop: '0.15rem' }}>
              {isHindi ? 'समीक्षाधीन' : 'Under Review'}
            </div>
          </div>
        </div>

        {/* 4. Pending Action */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#F3E8FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Hourglass size={19} color="#7E22CE" />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              {counts.pendingAction}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginTop: '0.15rem' }}>
              {isHindi ? 'कार्रवाई लंबित' : 'Pending Action'}
            </div>
          </div>
        </div>

        {/* 5. Rejected */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <X size={20} color="#DC2626" strokeWidth={3} />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              {counts.rejected}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginTop: '0.15rem' }}>
              {isHindi ? 'अस्वीकृत' : 'Rejected'}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. FILTER PILLS & SORT ROW
          ========================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        {/* Left Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: isHindi ? `सभी (${counts.total})` : `All (${counts.total})` },
            { id: 'IN_PROGRESS', label: isHindi ? `प्रक्रियाधीन (${counts.underReview})` : `In Progress (${counts.underReview})` },
            { id: 'APPROVED', label: isHindi ? `स्वीकृत (${counts.approved})` : `Approved (${counts.approved})` },
            { id: 'PENDING_ACTION', label: isHindi ? `कार्रवाई लंबित (${counts.pendingAction})` : `Pending Action (${counts.pendingAction})` },
            { id: 'REJECTED', label: isHindi ? `अस्वीकृत (${counts.rejected})` : `Rejected (${counts.rejected})` }
          ].map((pill) => {
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveFilter(pill.id)}
                style={{
                  background: isActive ? '#2563EB' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#334155',
                  border: isActive ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#CBD5E1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Right Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#0F172A',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="RECENT">Recent First</option>
            <option value="OLDEST">Oldest First</option>
          </select>
        </div>
      </div>

      {/* =========================================================
          4. MAIN TWO-COLUMN BODY
             Left/Center (72%): Application Cards List
             Right Sidebar (28%): + New App Button + Quick Actions + Important Info + Help
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN: APPLICATION CARDS
            ======================================================= */}
        <div id="applications-list-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {filteredApplications.length === 0 ? (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '3rem 2rem',
              textAlign: 'center'
            }}>
              <AlertCircle size={40} color="#94A3B8" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                No applications found
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                There are no applications matching the selected status filter.
              </p>
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Show All Applications
              </button>
            </div>
          ) : (
            filteredApplications.map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                    padding: '1.25rem 1.45rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.15rem'
                  }}
                >
                  {/* Top Details Header Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    {/* Left Icon + Title + Category */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: app.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={22} color={app.iconColor} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            color: '#0F172A',
                            margin: 0,
                            letterSpacing: '-0.01em'
                          }}>
                            {app.title}
                          </h3>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                          {app.subtitle}
                        </div>
                        <div style={{ marginTop: '0.35rem' }}>
                          <span style={{
                            background: app.categoryBg,
                            color: app.categoryColor,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.18rem 0.55rem',
                            borderRadius: '6px'
                          }}>
                            {app.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Columns: App ID, Applied On, Last Updated, Status Pill, More Dots */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'आवेदन आईडी' : 'Application ID'}</div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                          {app.id}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'आवेदन तिथि' : 'Applied On'}</div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>
                          {app.appliedOn}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>{isHindi ? 'अंतिम अपडेट' : 'Last Updated'}</div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>
                          {app.lastUpdated}
                        </div>
                      </div>

                      {/* Status Pill matching screenshot */}
                      <div>
                        {app.status === 'APPROVED' && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#DCFCE7',
                            border: '1px solid #BBF7D0',
                            color: '#15803D',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            <CheckCircle2 size={13} fill="#15803D" color="#FFFFFF" />
                            <span>{isHindi ? 'स्वीकृत' : 'Approved'}</span>
                          </div>
                        )}

                        {app.status === 'IN_PROGRESS' && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            color: '#D97706',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            <Clock size={13} color="#D97706" />
                            <span>{isHindi ? 'समीक्षाधीन' : 'Under Review'}</span>
                          </div>
                        )}

                        {app.status === 'PENDING_ACTION' && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#F3E8FF',
                            border: '1px solid #E9D5FF',
                            color: '#7E22CE',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            <Hourglass size={13} color="#7E22CE" />
                            <span>{isHindi ? 'कार्रवाई लंबित' : 'Pending Action'}</span>
                          </div>
                        )}
                      </div>

                      {/* Three dots menu */}
                      <button
                        type="button"
                        onClick={() => setSelectedAppForDetails(app)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Middle Row: Progress Stepper Bar & Action Buttons */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                    paddingTop: '0.4rem'
                  }}>
                    {/* Stepper Progress Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      minWidth: '280px',
                      position: 'relative'
                    }}>
                      {app.steps.map((step, idx) => {
                        const isLast = idx === app.steps.length - 1;
                        return (
                          <React.Fragment key={idx}>
                            {/* Step Node */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {step.completed ? (
                                  <div style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: '#16A34A',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 0 3px #DCFCE7'
                                  }}>
                                    <Check size={11} strokeWidth={3} />
                                  </div>
                                ) : step.active ? (
                                  <div style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: '#2563EB',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 0 3px #DBEAFE'
                                  }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFFFFF' }} />
                                  </div>
                                ) : step.actionRequired ? (
                                  <div style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: '#2563EB',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 0 3px #DBEAFE'
                                  }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFFFFF' }} />
                                  </div>
                                ) : (
                                  <div style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    border: '2px solid #CBD5E1',
                                    background: '#FFFFFF'
                                  }} />
                                )}
                              </div>

                              <div style={{ marginTop: '0.35rem' }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                                  {step.title}
                                </div>
                                {step.date && (
                                  <div style={{ fontSize: '0.66rem', color: step.active || step.actionRequired ? '#2563EB' : '#64748B', fontWeight: step.actionRequired ? 600 : 500 }}>
                                    {step.date}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Connecting Line between steps */}
                            {!isLast && (
                              <div style={{
                                flex: 1,
                                height: '2px',
                                background: step.completed ? '#16A34A' : '#E2E8F0',
                                margin: '0 0.5rem',
                                marginBottom: '1.25rem'
                              }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Action Buttons matching screenshot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedAppForDetails(app)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          color: '#334155',
                          borderRadius: '8px',
                          padding: '0.45rem 1rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F8FAFC';
                          e.currentTarget.style.borderColor = '#94A3B8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#CBD5E1';
                        }}
                      >
                        {isHindi ? 'विवरण देखें' : 'View Details'}
                      </button>

                      {app.status === 'APPROVED' && (
                        <button
                          type="button"
                          onClick={() => handleDownloadCertificate(app)}
                          style={{
                            background: '#2563EB',
                            border: 'none',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '0.45rem 1.05rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                        >
                          {isHindi ? 'प्रमाण पत्र डाउनलोड' : 'Download Certificate'}
                        </button>
                      )}

                      {app.status === 'IN_PROGRESS' && (
                        <button
                          type="button"
                          onClick={() => setSelectedAppForTrack(app)}
                          style={{
                            background: '#2563EB',
                            border: 'none',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '0.45rem 1.05rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                        >
                          {isHindi ? 'स्थिति ट्रैक करें' : 'Track Status'}
                        </button>
                      )}

                      {app.status === 'PENDING_ACTION' && (
                        <button
                          type="button"
                          onClick={() => openUploadModalFor(app)}
                          style={{
                            background: '#2563EB',
                            border: 'none',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '0.45rem 1.05rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                        >
                          {isHindi ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Required Alert Banner (Card 3 specific) */}
                  {app.actionRequiredAlert && (
                    <div style={{
                      background: '#FFF7ED',
                      border: '1px solid #FED7AA',
                      borderRadius: '10px',
                      padding: '0.65rem 0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#FFEDD5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <AlertCircle size={15} color="#EA580C" />
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#9A3412', lineHeight: 1.4 }}>
                        <strong style={{ fontWeight: 700, marginRight: '0.35rem' }}>Action Required</strong>
                        {app.actionRequiredAlert}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* =======================================================
            RIGHT COLUMN: NEW APPLICATION + QUICK ACTIONS + INFO + HELP
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. NEW APPLICATION BUTTON */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('schemes')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
          >
            <Plus size={17} strokeWidth={3} />
            <span>{isHindi ? 'नया आवेदन' : 'New Application'}</span>
            <span style={{ fontSize: '1rem', marginLeft: '0.2rem' }}>→</span>
          </button>

          {/* 2. QUICK ACTIONS (2x2 Grid) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.95rem 0' }}>
              {isHindi ? 'त्वरित क्रियाएँ' : 'Quick Actions'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* Tile 1: Continue Application */}
              <div
                onClick={() => {
                  const pending = applications.find((a) => a.status === 'PENDING_ACTION');
                  if (pending) {
                    openUploadModalFor(pending);
                  } else {
                    showToast(isHindi ? 'इस समय कोई अधूरा लंबित आवेदन नहीं है।' : 'No incomplete pending applications at this time.');
                  }
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '12px',
                  padding: '0.85rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#BFDBFE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#F1F5F9';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={16} color="#2563EB" />
                  </div>
                  <ChevronRight size={13} color="#94A3B8" />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginTop: '0.35rem' }}>
                  {isHindi ? 'आवेदन जारी रखें' : 'Continue Application'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.25 }}>
                  {isHindi ? 'लंबित आवेदन पूर्ण करें' : 'Complete pending applications'}
                </div>
              </div>

              {/* Tile 2: Upload Documents */}
              <div
                onClick={() => {
                  const pending = applications.find((a) => a.status === 'PENDING_ACTION') || applications[2] || applications[0];
                  openUploadModalFor(pending);
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '12px',
                  padding: '0.85rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#BFDBFE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#F1F5F9';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Upload size={16} color="#2563EB" />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginTop: '0.35rem' }}>
                  {isHindi ? 'दस्तावेज़ अपलोड करें' : 'Upload Documents'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.25 }}>
                  {isHindi ? 'अतिरिक्त दस्तावेज़ जमा करें' : 'Submit additional documents'}
                </div>
              </div>

              {/* Tile 3: Track Application */}
              <div
                onClick={() => setSelectedAppForTrack(applications[1])}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '12px',
                  padding: '0.85rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#BFDBFE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#F1F5F9';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Eye size={16} color="#2563EB" />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginTop: '0.35rem' }}>
                  {isHindi ? 'आवेदन ट्रैक करें' : 'Track Application'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.25 }}>
                  {isHindi ? 'रियल-टाइम स्थिति देखें' : 'Check real-time status'}
                </div>
              </div>

              {/* Tile 4: View All Applications */}
              <div
                onClick={() => {
                  setActiveFilter('ALL');
                  setSortBy('RECENT');
                  showToast(isHindi ? `सभी नागरिक आवेदन प्रदर्शित (कुल: ${applications.length})` : `Displaying all citizen applications (total: ${applications.length})`);
                  const target = document.getElementById('applications-list-section');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '12px',
                  padding: '0.85rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#BFDBFE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#F1F5F9';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <RotateCcw size={16} color="#2563EB" />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginTop: '0.35rem' }}>
                  {isHindi ? 'सभी आवेदन देखें' : 'View All Applications'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.25 }}>
                  {isHindi ? 'अपना पूरा इतिहास देखें' : 'See your full history'}
                </div>
              </div>
            </div>
          </div>

          {/* 3. IMPORTANT INFORMATION */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.95rem' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Info size={13} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'महत्वपूर्ण जानकारी' : 'Important Information'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Info Item 1 */}
              <div
                onClick={() => showToast(isHindi ? 'आधार और बैंक पासबुक स्पष्ट रूप से स्कैन की गई हो।' : 'Ensure Aadhaar & Bank passbook are clearly scanned.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '0.35rem 0.45rem',
                  borderRadius: '8px'
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
                    <FileCheck size={16} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'अपने दस्तावेज़ तैयार रखें' : 'Keep your documents ready'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'आधार, निवास प्रमाण, आय प्रमाण आदि।' : 'Aadhaar, address proof, income proof etc.'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>

              {/* Info Item 2 */}
              <div
                onClick={() => showToast(isHindi ? 'समीक्षा प्रगति के लिए एसएमएस अलर्ट भेजे जाते हैं।' : 'SMS alerts are automatically sent for review progress.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '0.35rem 0.45rem',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Building2 size={16} color="#D97706" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'आवेदन स्थिति की नियमित जांच करें' : 'Check application status regularly'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'आपको अपडेट के बारे में सूचित किया जाएगा।' : 'You will be notified about any updates.'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>

              {/* Info Item 3 */}
              <div
                onClick={() => {
                  setUploadingForApp(applications[2]);
                  setUploadDocModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '0.35rem 0.45rem',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#FFEDD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <AlertCircle size={16} color="#EA580C" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'कार्रवाई अनुरोधों का समय पर जवाब दें' : 'Respond to action requests'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'आवश्यक दस्तावेज़ समय पर अपलोड करें।' : 'Upload required documents on time.'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>
            </div>
          </div>

          {/* 4. NEED HELP WITH APPLICATIONS? CARD */}
          <div style={{
            background: 'linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 100%)',
            borderRadius: '16px',
            border: '1px solid #DBEAFE',
            padding: '1.25rem 1.35rem',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
              {/* Illustration Avatar */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#DBEAFE',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <rect width="100" height="100" fill="#DBEAFE" />
                  <path d="M15,100 C15,75 35,68 50,68 C65,68 85,75 85,100 Z" fill="#2563EB" />
                  <circle cx="50" cy="40" r="18" fill="#FED7AA" />
                  <path d="M35,32 C35,20 65,20 65,32 C65,38 60,42 50,42 C40,42 35,38 35,32 Z" fill="#1E293B" />
                  <rect x="55" y="70" width="22" height="28" rx="3" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="2" />
                </svg>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.15rem 0' }}>
                  {isHindi ? 'आवेदनों में सहायता चाहिए?' : 'Need Help with Applications?'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                  {isHindi ? 'हमारे एआई सहायक से चरण-दर-चरण मार्गदर्शन प्राप्त करें।' : 'Get step-by-step guidance from our AI Assistant or view detailed help guides.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast(isHindi ? 'जन पहचान एआई सहायक आपकी सहायता के लिए तैयार है!' : 'Jan Pehchaan AI Assistant is ready to help you!')}
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
              <span>{isHindi ? 'एआई सहायक से बात करें' : 'Chat with AI Assistant'}</span>
              <span style={{ fontSize: '0.85rem' }}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          5. VIEW DETAILS MODAL
          ========================================================= */}
      {selectedAppForDetails && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedAppForDetails(null)}
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
              position: 'relative'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: selectedAppForDetails.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <selectedAppForDetails.icon size={20} color={selectedAppForDetails.iconColor} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {selectedAppForDetails.title}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Application ID: <strong style={{ color: '#0F172A' }}>{selectedAppForDetails.id}</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppForDetails(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={19} color="#64748B" />
              </button>
            </div>

            {/* Content Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '0.95rem 1.15rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Entitlement Benefit</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D', marginTop: '0.2rem' }}>
                    {selectedAppForDetails.benefit}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Current Status</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                    {selectedAppForDetails.statusLabel}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Applied On</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>
                    {selectedAppForDetails.appliedOn}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Last Updated</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>
                    {selectedAppForDetails.lastUpdated}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Direct Benefit Account</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                  {selectedAppForDetails.bankAccount}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Verification Desk Notes</div>
                <div style={{
                  background: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.8rem',
                  color: '#166534',
                  marginTop: '0.35rem',
                  lineHeight: 1.4
                }}>
                  {selectedAppForDetails.remarks}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '1.5rem', paddingTop: '0.95rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setSelectedAppForDetails(null)}
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
                Close
              </button>

              {selectedAppForDetails.status === 'APPROVED' && (
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadCertificate(selectedAppForDetails);
                    setSelectedAppForDetails(null);
                  }}
                  style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Download Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          6. TRACK STATUS MODAL
          ========================================================= */}
      {selectedAppForTrack && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedAppForTrack(null)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Real-time Application Tracker
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {selectedAppForTrack.title} • ID: {selectedAppForTrack.id}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppForTrack(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={19} color="#64748B" />
              </button>
            </div>

            {/* Stepper Timeline Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
              {selectedAppForTrack.steps.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: s.completed ? '#16A34A' : s.active ? '#2563EB' : '#F1F5F9',
                    color: s.completed || s.active ? '#FFFFFF' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}>
                    {s.completed ? <Check size={14} strokeWidth={3} /> : idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: s.active ? '#2563EB' : '#64748B' }}>
                      {s.date || 'Pending previous step completion'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedAppForTrack(null)}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          7. UPLOAD DOCUMENTS MODAL
          ========================================================= */}
      {uploadDocModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setUploadDocModalOpen(false)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Upload size={18} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Upload Required Documents
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {uploadingForApp?.title || 'Scholarship Scheme'} (ID: {uploadingForApp?.id || 'AB20241012003'})
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadDocModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={19} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              {/* Real hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".png,.jpg,.jpeg,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedFile({
                      name: file.name,
                      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                      type: file.type || 'image/png'
                    });
                    setUploadError('');
                  }
                }}
              />

              {/* Upload Dropzone / Trigger */}
              <div
                style={{
                  border: uploadedFile ? '2px solid #10B981' : uploadError ? '2px dashed #EF4444' : '2px dashed #93C5FD',
                  borderRadius: '14px',
                  background: uploadedFile ? '#F0FDF4' : uploadError ? '#FEF2F2' : '#F8FAFC',
                  padding: '1.75rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                {uploadedFile ? (
                  <div>
                    <FileCheck size={36} color="#16A34A" style={{ margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#166534' }}>
                      {uploadedFile.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#15803D', marginTop: '0.25rem', fontWeight: 600 }}>
                      ✓ {uploadedFile.size} • Attached & ready to submit (PNG / Verified format)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.5rem', textDecoration: 'underline' }}>
                      Click to choose a different file
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} color={uploadError ? '#DC2626' : '#2563EB'} style={{ margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                      Click to browse & attach PNG, JPG or PDF document
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>
                      Supported formats: PNG, JPG, PDF (Max 5MB)
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (fileInputRef.current) fileInputRef.current.click();
                        }}
                        style={{
                          background: '#EFF6FF',
                          color: '#2563EB',
                          border: '1px solid #BFDBFE',
                          borderRadius: '8px',
                          padding: '0.35rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        📁 Choose File
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Quick Attach Button */}
              {!uploadedFile && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFile({
                        name: 'Scholarship_FeeReceipt_Marksheet.png',
                        size: '1.45 MB',
                        type: 'image/png'
                      });
                      setUploadError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563EB',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    + Attach Sample Document (PNG format)
                  </button>
                </div>
              )}

              {/* Inline warning/error directly above Submit button */}
              {uploadError && (
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#DC2626',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  lineHeight: 1.35
                }}>
                  <AlertCircle size={14} color="#DC2626" style={{ flexShrink: 0 }} />
                  <div>
                    <div>{uploadError}</div>
                    <div style={{ fontSize: '0.64rem', color: '#991B1B', fontWeight: 500, marginTop: '0.1rem' }}>
                      Please browse or drop a PNG, JPG, or PDF file into the upload box above.
                    </div>
                  </div>
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1.25rem' }}>
                Required: <strong>Previous final marksheet</strong> and <strong>Current college admission fee receipt</strong>.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setUploadDocModalOpen(false);
                    setUploadError('');
                  }}
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
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingDoc}
                  style={{
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
                  {isSubmittingDoc ? 'Uploading...' : 'Submit Documents'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationsTab;
