import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export function AccessibilityToolbar({ currentLang = 'en', onToggleLang, onToast }) {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('janpehchaan_font_size') || 'md';
  });

  // Apply Root Font Size across the entire app
  useEffect(() => {
    const sizeMap = {
      sm: '14px',
      md: '16px',
      lg: '18px'
    };
    document.documentElement.style.fontSize = sizeMap[fontSize] || '16px';
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${fontSize}`);
    localStorage.setItem('janpehchaan_font_size', fontSize);
  }, [fontSize]);

  // Clean up any previously stored dark theme to ensure clean standard theme
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('dark-theme');
    localStorage.removeItem('janpehchaan_theme');
  }, []);

  const handleFontChange = (size) => {
    setFontSize(size);
    if (onToast) {
      const labels = {
        sm: currentLang === 'hi' ? 'अक्षर का आकार: छोटा (A-)' : 'Font size: Decreased (A-)',
        md: currentLang === 'hi' ? 'अक्षर का आकार: सामान्य (A)' : 'Font size: Standard (A)',
        lg: currentLang === 'hi' ? 'अक्षर का आकार: बड़ा (A+)' : 'Font size: Enlarged (A+)'
      };
      onToast(labels[size]);
    }
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.45rem',
      flexWrap: 'nowrap'
    }}>
      {/* 1. Language Toggle Pill: [ 🌐 English ⌵ | हिन्दी ] */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '9999px',
        padding: '0.2rem 0.6rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        fontSize: '0.74rem',
        fontWeight: 600
      }}>
        <button
          type="button"
          onClick={() => onToggleLang && onToggleLang('en')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'none',
            border: 'none',
            color: currentLang === 'en' ? '#2563EB' : '#64748B',
            fontWeight: currentLang === 'en' ? 700 : 500,
            cursor: 'pointer',
            padding: '0.15rem 0.2rem'
          }}
          title="Switch to English"
        >
          <Globe size={13} color={currentLang === 'en' ? '#2563EB' : '#64748B'} />
          <span>English</span>
          <ChevronDown size={11} color={currentLang === 'en' ? '#2563EB' : '#64748B'} />
        </button>

        <span style={{ color: '#CBD5E1', margin: '0 0.35rem', userSelect: 'none' }}>|</span>

        <button
          type="button"
          onClick={() => onToggleLang && onToggleLang('hi')}
          style={{
            background: 'none',
            border: 'none',
            color: currentLang === 'hi' ? '#2563EB' : '#64748B',
            fontWeight: currentLang === 'hi' ? 700 : 500,
            cursor: 'pointer',
            padding: '0.15rem 0.2rem',
            fontFamily: 'inherit'
          }}
          title="हिन्दी में बदलें"
        >
          हिन्दी
        </button>
      </div>

      {/* 2. Font / Alphabet Size Pill: [ A-  A  A+ ] */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '9999px',
        padding: '0.2rem 0.65rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <button
          type="button"
          onClick={() => handleFontChange('sm')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.72rem',
            fontWeight: fontSize === 'sm' ? 800 : 600,
            color: fontSize === 'sm' ? '#2563EB' : '#475569',
            cursor: 'pointer',
            padding: '0.15rem 0.2rem'
          }}
          title="Decrease Text Size (A-)"
        >
          A-
        </button>

        <button
          type="button"
          onClick={() => handleFontChange('md')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: fontSize === 'md' ? 800 : 600,
            color: fontSize === 'md' ? '#2563EB' : '#475569',
            cursor: 'pointer',
            padding: '0.15rem 0.2rem'
          }}
          title="Standard Text Size (A)"
        >
          A
        </button>

        <button
          type="button"
          onClick={() => handleFontChange('lg')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: fontSize === 'lg' ? 800 : 600,
            color: fontSize === 'lg' ? '#2563EB' : '#475569',
            cursor: 'pointer',
            padding: '0.15rem 0.2rem'
          }}
          title="Increase Text Size (A+)"
        >
          A+
        </button>
      </div>
    </div>
  );
}

export default AccessibilityToolbar;
