import React, { useState } from 'react';
import {
  Home,
  IdCard,
  LayoutGrid,
  Sprout,
  FileText,
  Calendar,
  CreditCard,
  MessageSquareWarning,
  Award,
  Users,
  FolderLock,
  Headphones,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function Sidebar({ currentTab, onSelectTab, duplicateCount = 0, currentLang = 'en' }) {
  // Pure hover-based stretch: expanded only while cursor is hovering, collapses immediately on mouse leave
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Expanded if hovered or pinned
  const isExpanded = isHovered || isPinned;

  const isHindi = currentLang === 'hi';

  // Primary Navigation matching exact user reference image with English & Hindi
  const primaryNavItems = [
    { id: 'overview', label: isHindi ? 'मुख्य पृष्ठ' : 'Home', icon: Home },
    { id: 'digital_id', label: isHindi ? 'मेरी डिजिटल पहचान' : 'My Digital ID', icon: IdCard },
    { id: 'services', label: isHindi ? 'नागरिक सेवाएँ' : 'Services', icon: LayoutGrid },
    { id: 'schemes', label: isHindi ? 'सरकारी योजनाएँ' : 'Government Schemes', icon: Sprout },
    { id: 'applications', label: isHindi ? 'मेरे आवेदन' : 'Applications', icon: FileText },
    { id: 'appointments', label: isHindi ? 'अपॉइंटमेंट्स' : 'Appointments', icon: Calendar },
    { id: 'grievances', label: isHindi ? 'शिकायत निवारण' : 'Grievances', icon: MessageSquareWarning },
    { id: 'certificates', label: isHindi ? 'प्रमाण पत्र' : 'Certificates', icon: Award },
    { id: 'families', label: isHindi ? 'परिवार के सदस्य' : 'Family Members', icon: Users },
    { id: 'wallet', label: isHindi ? 'दस्तावेज़ वॉलेट' : 'Document Wallet', icon: FolderLock },
  ];

  // Secondary Bottom Navigation matching exact user reference image
  const secondaryNavItems = [
    { id: 'support', label: isHindi ? 'सहायता व संपर्क' : 'Support & Help', icon: Headphones },
    { id: 'settings', label: isHindi ? 'सेटिंग्स' : 'Settings', icon: Settings },
  ];

  return (
    <aside
      className="sidebar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: isExpanded ? '240px' : '68px',
        background: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 61px)',
        position: 'sticky',
        top: '61px',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: isExpanded ? '0.85rem 0.55rem 1rem 0.55rem' : '0.85rem 0 1rem 0',
        boxSizing: 'border-box',
        transition: 'width 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), padding 0.18s ease',
        zIndex: 30,
        scrollbarWidth: 'thin',
        scrollbarColor: '#E2E8F0 transparent'
      }}
    >
      {/* Primary List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, width: '100%' }}>
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={!isExpanded ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: !isExpanded ? 'center' : 'flex-start',
                width: !isExpanded ? '44px' : 'calc(100% - 0.5rem)',
                height: !isExpanded ? '44px' : 'auto',
                padding: !isExpanded ? '0' : '0.58rem 0.75rem',
                margin: !isExpanded ? '0.15rem auto' : '0.15rem 0.25rem',
                borderRadius: '10px',
                cursor: 'pointer',
                background: isActive ? '#EFF6FF' : 'transparent',
                color: isActive ? '#1D4ED8' : '#334155',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.84rem',
                gap: isExpanded ? '0.65rem' : '0',
                transition: 'background 0.15s ease, color 0.15s ease, padding 0.2s ease, width 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Icon Container with fixed width for rock-solid alignment */}
              <div style={{
                width: !isExpanded ? '44px' : '26px',
                height: !isExpanded ? '44px' : '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon
                  size={20}
                  className="nav-icon"
                  style={{
                    color: isActive ? '#1D4ED8' : '#2563EB',
                    transition: 'transform 0.15s ease, color 0.15s ease'
                  }}
                />
              </div>

              {/* Text Label: smoothly hides and removes from flex when collapsed */}
              {isExpanded && (
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '160px',
                    marginLeft: '0.2rem',
                    pointerEvents: 'auto'
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}

        {/* Divider Line */}
        <div style={{
          height: '1px',
          background: '#F1F5F9',
          margin: !isExpanded ? '0.45rem auto' : '0.65rem 0.5rem',
          width: !isExpanded ? '36px' : 'calc(100% - 1rem)',
          transition: 'margin 0.2s ease, width 0.2s ease'
        }} />

        {/* Secondary List (Support & Help, Settings) */}
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={!isExpanded ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: !isExpanded ? 'center' : 'flex-start',
                width: !isExpanded ? '44px' : 'calc(100% - 0.5rem)',
                height: !isExpanded ? '44px' : 'auto',
                padding: !isExpanded ? '0' : '0.58rem 0.75rem',
                margin: !isExpanded ? '0.15rem auto' : '0.15rem 0.25rem',
                borderRadius: '10px',
                cursor: 'pointer',
                background: isActive ? '#EFF6FF' : 'transparent',
                color: isActive ? '#1D4ED8' : '#334155',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.84rem',
                gap: isExpanded ? '0.65rem' : '0',
                transition: 'background 0.15s ease, color 0.15s ease, padding 0.2s ease, width 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{
                width: !isExpanded ? '44px' : '26px',
                height: !isExpanded ? '44px' : '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon
                  size={20}
                  className="nav-icon"
                  style={{
                    color: isActive ? '#1D4ED8' : '#2563EB',
                    transition: 'transform 0.15s ease, color 0.15s ease'
                  }}
                />
              </div>

              {isExpanded && (
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '160px',
                    marginLeft: '0.2rem',
                    pointerEvents: 'auto'
                  }}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Ask Pehchaan AI Assistant Mini Card */}
      {isExpanded && (
        <div
          onClick={() => window.dispatchEvent(new CustomEvent('open-pehchaan-ai'))}
          style={{
            margin: '0.4rem 0.65rem 0.5rem',
            padding: '0.65rem 0.75rem',
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
            borderRadius: '12px',
            border: '1px solid #C7D2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.08)',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          title={isHindi ? "पहचान AI चैटबॉट खोलें" : "Open Pehchaan AI Chatbot"}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#2563EB" strokeWidth="2.2" />
                <circle cx="12" cy="12" r="3.2" fill="#1E3A8A" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1E40AF', lineHeight: 1.1 }}>
                {isHindi ? 'मदद चाहिए?' : 'Need Help?'}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#4338CA', marginTop: '1px' }}>
                {isHindi ? 'पहचान AI से पूछें' : 'Ask Pehchaan AI'}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB' }}>
            {isHindi ? 'चैट करें →' : 'Chat →'}
          </span>
        </div>
      )}

      {/* Manual Pin / Toggle Mini Button at Bottom */}
      <div style={{
        paddingTop: '0.5rem',
        borderTop: '1px solid #F1F5F9',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          type="button"
          onClick={() => setIsPinned(!isPinned)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.4rem',
            color: isPinned ? '#2563EB' : '#94A3B8',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease'
          }}
          title={isPinned
            ? (isHindi ? 'साइडबार अनपिन करें' : 'Unpin Sidebar (Auto-collapse on mouse leave)')
            : (isHindi ? 'साइडबार हमेशा खुला रखें' : 'Pin Sidebar Open')}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
