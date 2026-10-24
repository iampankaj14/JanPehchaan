import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  LayoutGrid,
  FileText,
  Users,
  Heart,
  ShieldAlert,
  CreditCard,
  Calendar,
  RotateCcw,
  Zap,
  ArrowRight,
  Bot,
  Settings2,
  Check
} from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-3.8-flash';

// System prompt to ground Pehchaan AI in Jan Pehchaan Citizen Portal context
const SYSTEM_INSTRUCTION = `You are Pehchaan AI, an intelligent, empathetic, and highly capable citizen assistant for Jan Pehchaan (जन पहचान) — India's Unified Citizen Digital Identity & Services Portal.
Your purpose is to help Indian citizens with:
1. Jan Pehchaan ID & Family ID (Aadhaar-seeded, digital family roster, e-KYC).
2. Government Certificates: Domicile, Income, Caste (OBC/SC/ST), Birth & Death, Bonafide.
3. Welfare & Direct Benefit Transfer (DBT) Schemes: PM-KISAN (₹6000/yr), Ayushman Bharat PM-JAY (₹5 Lakh health cover), PM Awas Yojana, Merit Scholarships, Old Age / Widow Pensions.
4. Document Wallet: Verified locker for DigiLocker certificates, marksheets, ration cards.
5. Appointments: Booking visits to Suvidha Kendras, Tehsil, Sub-Registrar offices.
6. Grievance Redressal: Lodging citizen complaints, tracking resolution in 7-15 days.

Tone and Personality:
- Friendly, respectful, helpful, and concise (ideal for quick chat readings).
- You can speak in fluent English, Hindi, or Hinglish based on the citizen's query.
- When answering, provide actionable steps (e.g. which tab to visit or documents needed).
- Keep replies within 2-4 sentences or short bullet points so it's easy to read and listen to via TTS.`;

export function PehchaanAIChatbot({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('pehchaan_ai_pos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // default fallback
      }
    }
    return { x: window.innerWidth - 84, y: window.innerHeight - 96 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: isHindi
        ? 'नमस्ते! मैं पहचान एआई हूँ, आपका नागरिक डिजिटल पहचान एवं सेवा सहायक। आज मैं आपकी पहचान प्रबंधन, प्रमाण पत्र सत्यापन या कल्याणकारी योजनाओं तक पहुँचने में कैसे सहायता कर सकता हूँ?'
        : 'Hello! I am Pehchaan AI, your Citizen Digital Identity & Services Intelligence Assistant. How can I help you manage your identity, verify certificates, or access welfare schemes today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState(() => {
    return localStorage.getItem('pehchaan_ai_voice') || '';
  });
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const thinkingRef = useRef(null);
  const inputRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis || null);

  // Quick Action Cards
  const quickCards = [
    {
      id: 'view_dashboard',
      title: 'View Dashboard',
      titleHi: 'डैशबोर्ड देखें',
      subtitle: 'OVERVIEW & INSIGHTS',
      subtitleHi: 'अवलोकन एवं विश्लेषण',
      icon: LayoutGrid,
      bgColor: '#EEF2FF',
      iconBg: '#E0E7FF',
      iconColor: '#4F46E5',
      action: () => {
        handleQuickCardClick(isHindi ? 'मेरी जनपहचान डिजिटल पहचान और खाते का सारांश दें।' : 'Give me an overview of my Jan Pehchaan digital identity and account summary.');
        if (onNavigateTab) onNavigateTab('overview');
      }
    },
    {
      id: 'apply_certificate',
      title: 'Apply Certificate',
      titleHi: 'प्रमाण पत्र आवेदन',
      subtitle: 'ISSUANCE & STATUS',
      subtitleHi: 'निर्गमन एवं स्थिति',
      icon: FileText,
      bgColor: '#ECFDF5',
      iconBg: '#D1FAE5',
      iconColor: '#059669',
      action: () => {
        handleQuickCardClick(isHindi ? 'मैं मूल निवास या आय प्रमाण पत्र हेतु ऑनलाइन कैसे आवेदन कर सकता हूँ?' : 'How can I apply for a Domicile or Income certificate online?');
        if (onNavigateTab) onNavigateTab('certificates');
      }
    },
    {
      id: 'family_members',
      title: 'Family Members',
      titleHi: 'परिवार के सदस्य',
      subtitle: 'ENROLL & MANAGE',
      subtitleHi: 'नामांकन एवं प्रबंधन',
      icon: Users,
      bgColor: '#FEFCE8',
      iconBg: '#FEF08A',
      iconColor: '#CA8A04',
      action: () => {
        handleQuickCardClick(isHindi ? 'मैं अपनी जनपहचान पारिवारिक आईडी में नया सदस्य कैसे जोड़ूँ?' : 'How do I add a new family member to my Jan Pehchaan Family ID?');
        if (onNavigateTab) onNavigateTab('families');
      }
    },
    {
      id: 'welfare_schemes',
      title: 'Welfare Schemes',
      titleHi: 'कल्याणकारी योजनाएं',
      subtitle: 'CHECK ELIGIBILITY',
      subtitleHi: 'पात्रता जांचें',
      icon: Heart,
      bgColor: '#FFF1F2',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48',
      action: () => {
        handleQuickCardClick(isHindi ? 'जनपहचान के तहत मैं किन कल्याणकारी योजनाओं के लिए पात्र हूँ?' : 'Which welfare schemes am I eligible for under Jan Pehchaan?');
        if (onNavigateTab) onNavigateTab('schemes');
      }
    },
    {
      id: 'track_grievances',
      title: 'Track Grievances',
      titleHi: 'शिकायत ट्रैक करें',
      subtitle: 'STATUS & REDRESSAL',
      subtitleHi: 'स्थिति एवं निवारण',
      icon: ShieldAlert,
      bgColor: '#F5F3FF',
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED',
      action: () => {
        handleQuickCardClick(isHindi ? 'मैं अपनी दर्ज शिकायत की निवारण स्थिति कैसे ट्रैक करूँ?' : 'How can I track the resolution status of my submitted grievance?');
        if (onNavigateTab) onNavigateTab('grievances');
      }
    },
    {
      id: 'doc_wallet',
      title: 'Document Wallet',
      titleHi: 'दस्तावेज़ वॉल्ट',
      subtitle: 'VERIFIED LOCKER',
      subtitleHi: 'सत्यापित लॉकर',
      icon: CreditCard,
      bgColor: '#EFF6FF',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
      action: () => {
        handleQuickCardClick(isHindi ? 'एन्क्रिप्टेड दस्तावेज़ वॉल्ट मेरे आधार व पैन की सुरक्षा कैसे करता है?' : 'How does the encrypted Document Wallet protect my Aadhaar & PAN?');
        if (onNavigateTab) onNavigateTab('wallet');
      }
    }
  ];

  // Horizontal Quick Chips
  const quickChips = [
    { label: '📊 View Dashboard', labelHi: '📊 डैशबोर्ड देखें', query: 'Show my identity credentials summary.', queryHi: 'मेरी पहचान क्रेडेंशियल्स का सारांश दिखाएं।' },
    { label: '📜 Apply Certificate', labelHi: '📜 प्रमाण पत्र आवेदन', query: 'How to apply for Domicile or Caste certificate?', queryHi: 'मूल निवास या जाति प्रमाण पत्र हेतु कैसे आवेदन करें?' },
    { label: '🌾 PM-KISAN Scheme', labelHi: '🌾 पीएम-किसान योजना', query: 'Tell me about PM-KISAN DBT ₹2,000 installment eligibility.', queryHi: 'मुझे पीएम-किसान डीबीटी ₹2,000 किस्त पात्रता के बारे में बताएं।' },
    { label: '👥 Add Family Member', labelHi: '👥 परिवार सदस्य जोड़ें', query: 'How to enroll a new infant or spouse in Family ID?', queryHi: 'परिवार आईडी में नए शिशु या जीवनसाथी को कैसे नामांकित करें?' },
    { label: '📑 Track Application', labelHi: '📑 आवेदन ट्रैक करें', query: 'How do I track my submitted application status?', queryHi: 'मैं अपने जमा किए गए आवेदन की स्थिति कैसे ट्रैक करूँ?' }
  ];

  // Auto-scroll chat to bottom or thinking element
  useEffect(() => {
    if (isOpen && !isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // When AI is thinking, smoothly scroll up so the user's question and thinking box are in clear view
  useEffect(() => {
    if (isLoading && thinkingRef.current) {
      thinkingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading]);

  // Keep input focused when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
    }
  }, [isOpen]);

  // Load and listen for speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
        const saved = localStorage.getItem('pehchaan_ai_voice');
        const match = saved && available.find((v) => (v.voiceURI || v.name) === saved);
        if (match) {
          setSelectedVoiceUri(match.voiceURI || match.name);
        } else if (!selectedVoiceUri) {
          const defaultVoice = available.find((v) =>
            v.lang.startsWith('hi') || (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female')))
          ) || available.find((v) => v.lang.startsWith('en')) || available[0];
          if (defaultVoice) {
            const uri = defaultVoice.voiceURI || defaultVoice.name;
            setSelectedVoiceUri(uri);
            localStorage.setItem('pehchaan_ai_voice', uri);
          }
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceUri]);

  // Listen for open-pehchaan-ai custom event from any portal button
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-pehchaan-ai', handleOpenChat);
    return () => window.removeEventListener('open-pehchaan-ai', handleOpenChat);
  }, []);

  // Keep floating button within viewport boundaries
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(Math.max(16, prev.x), window.innerWidth - 76),
        y: Math.min(Math.max(16, prev.y), window.innerHeight - 76)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Text-To-Speech (TTS) function
  const speakText = (text) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const cleanText = text
        .replace(/[*#_~`>]/g, '') // remove markdown symbols
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/[\u{1F600}-\u{1F6FF}]/gu, ''); // remove emojis for natural speech

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const allVoices = window.speechSynthesis.getVoices();
      const currentUri = selectedVoiceUri || localStorage.getItem('pehchaan_ai_voice');
      const chosenVoice = allVoices.find((v) => (v.voiceURI || v.name) === currentUri)
        || allVoices.find((v) => v.lang.startsWith('hi'))
        || allVoices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female')))
        || allVoices.find((v) => v.lang.startsWith('en'))
        || allVoices[0];

      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (err) => {
        console.warn('TTS playback error:', err);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
      setIsSpeaking(false);
    }
  };

  const handleSelectVoice = (voiceUri) => {
    setSelectedVoiceUri(voiceUri);
    localStorage.setItem('pehchaan_ai_voice', voiceUri);
    setVoiceSettingsOpen(false);

    // Speak a sample so the user immediately hears the chosen voice
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        const allVoices = window.speechSynthesis.getVoices();
        const chosen = allVoices.find((v) => (v.voiceURI || v.name) === voiceUri);
        const sampleText = chosen?.lang?.startsWith('hi')
          ? 'नमस्ते! पहचान एआई की यह आवाज़ चुनी गई है।'
          : 'Pehchaan AI voice selected successfully.';
        const utt = new SpeechSynthesisUtterance(sampleText);
        if (chosen) {
          utt.voice = chosen;
          utt.lang = chosen.lang;
        }
        utt.onstart = () => setIsSpeaking(true);
        utt.onend = () => setIsSpeaking(false);
        utt.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utt);
      } catch (err) {
        console.warn('Voice preview error:', err);
      }
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Draggable logic for the floating circle
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const clampedX = Math.min(Math.max(16, newX), window.innerWidth - 76);
    const clampedY = Math.min(Math.max(16, newY), window.innerHeight - 76);

    if (Math.abs(clampedX - position.x) > 4 || Math.abs(clampedY - position.y) > 4) {
      setHasMoved(true);
    }

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('pehchaan_ai_pos', JSON.stringify(position));
    }
  };

  // Touch handlers for mobile/tablets
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;

    const clampedX = Math.min(Math.max(16, newX), window.innerWidth - 76);
    const clampedY = Math.min(Math.max(16, newY), window.innerHeight - 76);

    if (Math.abs(clampedX - position.x) > 4 || Math.abs(clampedY - position.y) > 4) {
      setHasMoved(true);
    }

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('pehchaan_ai_pos', JSON.stringify(position));
    }
  };

  // Click on circle button
  const handleCircleClick = () => {
    if (!hasMoved) {
      setIsOpen((prev) => !prev);
    }
  };

  // Call Gemini API or smart domain fallback
  const callGeminiAI = async (userPrompt) => {
    if (!GEMINI_API_KEY) {
      return generateIntelligentFallback(userPrompt);
    }

    const formattedHistory = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: [
          ...formattedHistory.slice(-6),
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 350
        }
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Gemini API returned status ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return reply.trim();
      throw new Error('No candidate content received');
    } catch (err) {
      console.warn('Gemini primary endpoint error, applying intelligent portal knowledge fallback:', err);
      return generateIntelligentFallback(userPrompt);
    }
  };

  // Knowledge base fallback for high reliability
  const generateIntelligentFallback = (prompt) => {
    const p = prompt.toLowerCase();
    if (p.includes('certificate') || p.includes('domicile') || p.includes('caste') || p.includes('income')) {
      return "To apply for Domicile, Income, or Caste certificates, navigate to the 'Certificates' tab in the left sidebar. Fill your Aadhaar-linked e-form, upload any supporting documents, and receive digitally signed verified certificates within 3 to 7 working days.";
    }
    if (p.includes('family') || p.includes('member') || p.includes('enroll')) {
      return "You can enroll family members under the 'Family Members' tab. Click '+ Add Family Member', provide their Aadhaar number, relationship, and consent. Once verified, they will share your household entitlement for ration cards and welfare schemes.";
    }
    if (p.includes('scheme') || p.includes('pm-kisan') || p.includes('ayushman') || p.includes('welfare') || p.includes('scholarship')) {
      return "Jan Pehchaan's Scheme Matcher automatically analyzes your household profile. You are currently eligible for PM-KISAN DBT (₹6,000/yr), Ayushman Bharat Golden Card (₹5 Lakh cover), and Pre-Matric Scholarships. Check the 'Government Schemes' tab to claim benefits directly.";
    }
    if (p.includes('wallet') || p.includes('document') || p.includes('aadhaar')) {
      return "Your Document Wallet is 256-bit AES encrypted and securely connected with DigiLocker. It hosts your verified Aadhaar, PAN card, driving license, and issued certificates with instant QR verification.";
    }
    if (p.includes('grievance') || p.includes('complaint') || p.includes('problem')) {
      return "You can lodge complaints under the 'Grievances' tab. Your grievance is automatically routed to the concerned department officer with a guaranteed resolution window of 7 to 15 days.";
    }
    if (p.includes('appointment') || p.includes('visit') || p.includes('slot')) {
      return "Book official appointments under the 'Appointments' tab. Select your nearest Jan Seva Kendra or Tehsil office, choose an available date/time slot, and skip the physical queue.";
    }
    return `Thank you for your question. As your Jan Pehchaan AI assistant, I can help you apply for certificates, discover welfare schemes, manage family members, or track applications. Feel free to select any quick action or ask a specific query!`;
  };

  // Send message handler
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    // Keep input focus firmly locked
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    try {
      const aiReply = await callGeminiAI(query);
      const botMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
      speakText(aiReply);
    } catch (e) {
      const errorMsg = "I'm having trouble connecting right now. Please select one of the quick options or try again in a moment.";
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: errorMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakText(errorMsg);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    }
  };

  const handleQuickCardClick = (prompt) => {
    handleSendMessage(prompt);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <>
      {/* =========================================================
          1. MOVEABLE FLOATING CIRCLE BUTTON (FAB)
          User can drag anywhere on screen and tap to open
          ========================================================= */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCircleClick}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9998,
          cursor: isDragging ? 'grabbing' : 'pointer',
          userSelect: 'none',
          touchAction: 'none',
          transition: isDragging ? 'none' : 'box-shadow 0.2s ease, transform 0.15s ease'
        }}
        title="Pehchaan AI Assistant (Drag to move, click to chat)"
      >
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #0A84FF 100%)',
          boxShadow: isDragging
            ? '0 16px 36px rgba(37, 99, 235, 0.45)'
            : '0 8px 24px rgba(37, 99, 235, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #FFFFFF',
          position: 'relative',
          transform: isDragging ? 'scale(1.08)' : 'scale(1)'
        }}>
          {/* Glowing pulse ring animation */}
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
            opacity: 0.35,
            zIndex: -1,
            filter: 'blur(4px)'
          }} />

          {/* AI Eye / Emblem Icon matching reference */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* Eye / Emblem SVG matching Netra AI / Jan Pehchaan logo */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke="#2563EB"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="3.2" fill="#1E3A8A" />
              <circle cx="13" cy="11" r="1.1" fill="#FF9933" />
            </svg>
          </div>

          {/* Online green indicator badge */}
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#10B981',
            border: '2px solid #FFFFFF',
            boxShadow: '0 0 6px #10B981'
          }} />

          {/* Speaking Audio wave indicator */}
          {isSpeaking && (
            <div style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#EF4444',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Volume2 size={11} />
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          2. MINI SCREEN TYPE CHATBOT DIALOG
          Exact UI layout matching screenshot 1 & screenshot 2
          ========================================================= */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '390px',
          maxWidth: 'calc(100vw - 32px)',
          height: '640px',
          maxHeight: 'calc(100vh - 48px)',
          background: '#F8FAFD',
          borderRadius: '26px',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.22), 0 2px 10px rgba(15, 23, 42, 0.08)',
          border: '1px solid rgba(226, 232, 240, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9999,
          animation: 'fadeIn 0.22s ease-out'
        }}>
          {/* -------------------------------------------------------
              HEADER: Avatar, Title, Online Status, TTS, Close
              ------------------------------------------------------- */}
          <div style={{
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 60%, #F5F3FF 100%)',
            padding: '0.9rem 1.15rem',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            {/* Left AI Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E0E7FF'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    stroke="#2563EB"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3.2" fill="#1E3A8A" />
                  <circle cx="13" cy="11" r="1" fill="#FF9933" />
                </svg>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                    Pehchaan AI
                  </h3>
                  <Sparkles size={14} color="#2563EB" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16A34A', letterSpacing: '0.04em' }}>
                    ONLINE
                  </span>
                </div>
              </div>
            </div>

            {/* Right Controls: TTS Volume Toggle, Voice Selector & Close Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {/* Voice Selector Popover */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setVoiceSettingsOpen(!voiceSettingsOpen)}
                  style={{
                    background: voiceSettingsOpen ? '#2563EB' : '#FFFFFF',
                    color: voiceSettingsOpen ? '#FFFFFF' : '#475569',
                    border: '1px solid #E2E8F0',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={isHindi ? 'एआई आवाज़ चुनें (हिन्दी / अंग्रेज़ी)' : 'Choose AI Voice (Hindi / English)'}
                >
                  <Settings2 size={15} />
                </button>

                {/* Voice Selection Dropdown Menu */}
                {voiceSettingsOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '38px',
                    right: '-40px',
                    width: '270px',
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16)',
                    border: '1px solid #E2E8F0',
                    padding: '0.75rem',
                    zIndex: 10000,
                    animation: 'fadeIn 0.15s ease-out'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Volume2 size={14} color="#2563EB" />
                      <span>{isHindi ? 'पहचान आवाज़ चुनें' : 'Select Pehchaan Voice'}</span>
                    </div>

                    <div style={{ maxHeight: '190px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {voices.length === 0 ? (
                        <div style={{ fontSize: '0.72rem', color: '#64748B', padding: '0.5rem' }}>
                          {isHindi ? 'सिस्टम आवाजें लोड हो रही हैं...' : 'Loading system voices...'}
                        </div>
                      ) : (
                        voices
                          .filter((v) => v.lang.startsWith('en') || v.lang.startsWith('hi'))
                          .concat(voices.filter((v) => !v.lang.startsWith('en') && !v.lang.startsWith('hi')).slice(0, 4))
                          .map((v) => {
                            const uri = v.voiceURI || v.name;
                            const isSelected = selectedVoiceUri === uri;
                            return (
                              <button
                                key={uri}
                                type="button"
                                onClick={() => handleSelectVoice(uri)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  background: isSelected ? '#EFF6FF' : 'transparent',
                                  border: isSelected ? '1px solid #BFDBFE' : '1px solid #F1F5F9',
                                  borderRadius: '8px',
                                  padding: '0.4rem 0.55rem',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                <div style={{ maxWidth: '190px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  <div style={{ fontSize: '0.73rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#1E40AF' : '#1E293B' }}>
                                    {v.name}
                                  </div>
                                  <div style={{ fontSize: '0.62rem', color: '#64748B', marginTop: '0.1rem' }}>
                                    {v.lang} {v.lang.startsWith('hi') ? '• हिन्दी' : '• English'}
                                  </div>
                                </div>
                                {isSelected && <Check size={14} color="#2563EB" style={{ flexShrink: 0 }} />}
                              </button>
                            );
                          })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  }
                  setTtsEnabled(!ttsEnabled);
                }}
                style={{
                  background: ttsEnabled ? '#DBEAFE' : '#F1F5F9',
                  color: ttsEnabled ? '#2563EB' : '#94A3B8',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title={ttsEnabled ? (isHindi ? 'आवाज़ आउटपुट चालू (म्यूट करने हेतु क्लिक करें)' : 'Voice Output ON (Click to Mute)') : (isHindi ? 'आवाज़ आउटपुट बंद (सक्षम करने हेतु क्लिक करें)' : 'Voice Output OFF (Click to Enable)')}
              >
                {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                style={{
                  background: '#FFFFFF',
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title={isHindi ? 'चैट बंद करें' : 'Close Chat'}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------
              CHAT MESSAGES & CONTENT BODY
              ------------------------------------------------------- */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {/* Render Conversation Messages */}
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: isAi ? 'row' : 'row-reverse',
                    alignItems: 'flex-start',
                    gap: '0.55rem'
                  }}
                >
                  {/* Small Avatar next to AI bubble matching screenshot */}
                  {isAi && (
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '4px'
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                          stroke="#2563EB"
                          strokeWidth="2.2"
                        />
                        <circle cx="12" cy="12" r="3.2" fill="#1E3A8A" />
                      </svg>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div style={{
                    maxWidth: '82%',
                    background: isAi ? '#FFFFFF' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: isAi ? '#1E293B' : '#FFFFFF',
                    padding: '0.85rem 1rem',
                    borderRadius: isAi ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                    fontSize: '0.835rem',
                    lineHeight: 1.45,
                    boxShadow: isAi
                      ? '0 2px 8px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)'
                      : '0 4px 12px rgba(37, 99, 235, 0.25)',
                    border: isAi ? '1px solid #EDF2F7' : 'none',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}

                    <div style={{
                      fontSize: '0.625rem',
                      color: isAi ? '#94A3B8' : 'rgba(255,255,255,0.7)',
                      marginTop: '0.35rem',
                      textAlign: isAi ? 'left' : 'right'
                    }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div ref={thinkingRef} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={14} color="#2563EB" />
                </div>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '0.65rem 0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  border: '1px solid #E2E8F0'
                }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'पहचान एआई विचार कर रहा है' : 'Pehchaan AI is thinking'}
                  </span>
                  <span style={{ animation: 'pulse 1s infinite', color: '#2563EB', fontWeight: 800 }}>...</span>
                </div>
              </div>
            )}

            {/* ===================================================
                6 COLORFUL PASTEL ACTION CARDS (Screenshot 1)
                Only show at start when no ongoing conversation
                =================================================== */}
            {messages.length <= 1 && !isLoading && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.65rem',
                marginTop: '0.25rem'
              }}>
                {quickCards.map((card) => {
                  const IconComp = card.icon;
                  return (
                    <div
                      key={card.id}
                      onClick={card.action}
                      style={{
                        background: card.bgColor,
                        borderRadius: '16px',
                        padding: '0.85rem 0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '88px',
                        border: '1px solid rgba(0,0,0,0.03)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'all 0.16s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: card.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComp size={16} color={card.iconColor} />
                      </div>

                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                          {isHindi ? (card.titleHi || card.title) : card.title}
                        </div>
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: '0.15rem' }}>
                          {isHindi ? (card.subtitleHi || card.subtitle) : card.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* -------------------------------------------------------
              HORIZONTAL MINI CHIPS / OPTIONS (Screenshot 2)
              ------------------------------------------------------- */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto',
            padding: '0.45rem 0.85rem 0.2rem',
            background: 'transparent',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleSendMessage(isHindi ? (chip.queryHi || chip.query) : chip.query);
                  inputRef.current?.focus();
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2563EB';
                  e.currentTarget.style.color = '#2563EB';
                  e.currentTarget.style.background = '#EFF6FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                {isHindi ? (chip.labelHi || chip.label) : chip.label}
              </button>
            ))}
          </div>

          {/* -------------------------------------------------------
              BOTTOM INPUT AREA: Capsule Input with Send Button (Screenshot 2)
              ------------------------------------------------------- */}
          <div style={{
            padding: '0.65rem 0.85rem 0.85rem',
            background: '#FFFFFF',
            borderTop: '1px solid #F1F5F9'
          }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {/* Capsule Input Field matching screenshot 2 */}
              <div
                onClick={() => inputRef.current?.focus()}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  background: '#F1F5F9',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '9999px',
                  padding: '0.45rem 0.95rem',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={isHindi ? 'अपना संदेश टाइप करें...' : 'Type your message...'}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.825rem',
                    color: '#0F172A'
                  }}
                />

                {/* Clear input button if typed */}
                {inputQuery && (
                  <button
                    type="button"
                    onClick={() => setInputQuery('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '0.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Lightning Quick Action Icon matching screenshot 1 */}
                {!inputQuery && (
                  <div
                    onClick={() => handleSendMessage(isHindi ? 'मेरे लिए शीर्ष कल्याणकारी सेवाओं का सुझाव दें।' : 'Suggest top welfare services for me.')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title={isHindi ? 'त्वरित सुझाव' : 'Quick Suggestion'}
                  >
                    <Zap size={15} color="#EAB308" fill="#EAB308" />
                  </div>
                )}
              </div>

              {/* Circular Send Button matching screenshot 1 & 2 */}
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: inputQuery.trim() ? '#2563EB' : '#E2E8F0',
                  color: inputQuery.trim() ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputQuery.trim() ? 'pointer' : 'default',
                  boxShadow: inputQuery.trim() ? '0 3px 10px rgba(37, 99, 235, 0.3)' : 'none',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PehchaanAIChatbot;
