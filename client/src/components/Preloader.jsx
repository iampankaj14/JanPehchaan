import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export function Preloader({ onComplete, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
      videoRef.current.play().catch(() => {});
    }

    // Safety auto-dismiss at 1.5x speed (approx 2.8s)
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#FFFFFF',
      backgroundColor: '#FFFFFF',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {!videoError ? (
        <video
          ref={videoRef}
          src="/assets/splash.mp4"
          autoPlay
          muted
          playsInline
          onLoadedMetadata={handleVideoLoaded}
          onCanPlay={handleVideoLoaded}
          onPlaying={() => setIsPlaying(true)}
          onEnded={onComplete}
          onError={() => setVideoError(true)}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '850px',
            maxHeight: '85vh',
            objectFit: 'contain',
            background: '#FFFFFF',
            backgroundColor: '#FFFFFF',
            opacity: isPlaying ? 1 : 0,
            transition: 'opacity 0.12s ease-in'
          }}
        />
      ) : (
        /* Fallback if MP4 format isn't supported */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0F172A',
          textAlign: 'center'
        }}>
          <img
            src="/assets/logo.png"
            alt="JanPehchaan Logo"
            style={{ width: '130px', height: 'auto', marginBottom: '1rem', objectFit: 'contain', animation: 'pulse 1.5s infinite' }}
          />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#1E3A8A' }}>
            जनपहचान • JanPehchaan
          </h1>
          <p style={{ fontSize: '1rem', color: '#0A84FF', fontWeight: 600 }}>
            आपकी पहचान, आपका अधिकार।
          </p>
        </div>
      )}

      {/* Skip button at bottom right on white background */}
      <button
        onClick={onComplete}
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.5rem 1.15rem',
          borderRadius: '9999px',
          background: '#F8FAFC',
          border: '1px solid #CBD5E1',
          color: '#1E293B',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
          zIndex: 10
        }}
      >
        <span>{isHindi ? 'छोड़ें (Skip)' : 'Skip Intro'}</span>
        <ArrowRight size={13} color="#0A84FF" />
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.92; }
        }
      `}</style>
    </div>
  );
}

export default Preloader;
