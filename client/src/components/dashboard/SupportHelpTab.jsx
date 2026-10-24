import React, { useState } from 'react';
import {
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  Users,
  FolderLock,
  Phone,
  Mail,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
  Headphones,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Zap,
  Check,
  X,
  ShieldCheck,
  Clock
} from 'lucide-react';

export function SupportHelpTab({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // 0 open by default
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeGuideModal, setActiveGuideModal] = useState(null);
  const [quickGrievanceModal, setQuickGrievanceModal] = useState(false);
  const [trackGrievanceModal, setTrackGrievanceModal] = useState(false);
  const [grievanceSearchId, setGrievanceSearchId] = useState('');
  const [grievanceSearchResult, setGrievanceSearchResult] = useState(null);
  const [grievanceForm, setGrievanceForm] = useState({ category: 'Welfare Schemes', subject: '', description: '' });
  const [toastMessage, setToastMessage] = useState(null);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Namaste Pankaj! Welcome to Jan Pehchaan citizen helpdesk. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Popular Topics Pills
  const popularTopics = [
    { en: 'Apply for Certificate', hi: 'प्रमाण पत्र आवेदन' },
    { en: 'Track Application', hi: 'आवेदन ट्रैक करें' },
    { en: 'Add Family Member', hi: 'परिवार का सदस्य जोड़ें' },
    { en: 'Document Upload', hi: 'दस्तावेज़ अपलोड' }
  ];

  // Comprehensive Step-by-Step Interactive Guides
  const helpGuidesData = {
    certificate: {
      title: 'How to Apply for a State Certificate',
      titleHi: 'राज्य प्रमाण पत्र हेतु आवेदन कैसे करें',
      subtitle: 'Complete walkthrough for Domicile, Income, Caste & Birth Certificates',
      subtitleHi: 'मूल निवास, आय, जाति एवं जन्म प्रमाण पत्र की सम्पूर्ण मार्गदर्शिका',
      category: 'Certificates & Revenue',
      categoryHi: 'प्रमाण पत्र व राजस्व',
      readTime: '2 min read',
      readTimeHi: '2 मिनट पढ़ें',
      steps: [
        {
          num: 1,
          title: 'Open Certificates Section',
          titleHi: 'प्रमाण पत्र अनुभाग खोलें',
          desc: 'Select "Certificates" from the left navigation bar to access the state revenue issuance desk.',
          descHi: 'राज्य राजस्व निर्गमन डेस्क तक पहुँचने हेतु बाएँ नेविगेशन बार से "प्रमाण पत्र" चुनें।'
        },
        {
          num: 2,
          title: 'Click "+ Apply for Certificate"',
          titleHi: '"+ प्रमाण पत्र हेतु आवेदन" पर क्लिक करें',
          desc: 'Choose your desired certificate type (Income, Domicile, Caste, or Birth).',
          descHi: 'अपना वांछित प्रमाण पत्र प्रकार चुनें (आय, मूल निवास, जाति, या जन्म)।'
        },
        {
          num: 3,
          title: 'Verify Auto-filled Details',
          titleHi: 'स्वतः भरे विवरण की पुष्टि करें',
          desc: 'Your verified JanPehchaan citizen profile details are automatically populated without manual re-typing.',
          descHi: 'आपके सत्यापित जनपहचान प्रोफ़ाइल विवरण बिना दोबारा टाइप किए स्वतः भर जाते हैं।'
        },
        {
          num: 4,
          title: 'Attach Wallet Documents',
          titleHi: 'वॉल्ट दस्तावेज़ संलग्न करें',
          desc: 'Link supporting identity and address proofs stored securely in your Document Wallet.',
          descHi: 'अपने दस्तावेज़ वॉल्ट में सुरक्षित रूप से संग्रहीत पहचान और पते के प्रमाण लिंक करें।'
        },
        {
          num: 5,
          title: 'Submit & Track Application',
          titleHi: 'जमा करें व आवेदन ट्रैक करें',
          desc: 'You will receive an instant acknowledgement number (e.g. UP-DOM-2026-9810) for live status tracking.',
          descHi: 'आपको लाइव स्थिति ट्रैकिंग हेतु तत्काल पावती संख्या (उदा. UP-DOM-2026-9810) प्राप्त होगी।'
        }
      ],
      targetTab: 'certificates',
      targetLabel: 'Open Certificates Portal',
      targetLabelHi: 'प्रमाण पत्र पोर्टल खोलें'
    },
    family: {
      title: 'How to Add a Family Member',
      titleHi: 'परिवार का सदस्य कैसे जोड़ें',
      subtitle: 'Enrolling spouse, children or dependent parents into the unified household registry',
      subtitleHi: 'एकीकृत पारिवारिक रजिस्ट्री में पति/पत्नी, बच्चों या आश्रित माता-पिता का नामांकन',
      category: 'Family Registry',
      categoryHi: 'परिवार रजिस्ट्री',
      readTime: '3 min read',
      readTimeHi: '3 मिनट पढ़ें',
      steps: [
        {
          num: 1,
          title: 'Go to Family Members Tab',
          titleHi: 'परिवार सदस्य टैब पर जाएँ',
          desc: 'Click on "Family Members" in the left sidebar to view your household roster.',
          descHi: 'अपने परिवार का रोस्टर देखने हेतु बाएँ साइडबार में "परिवार सदस्य" पर क्लिक करें।'
        },
        {
          num: 2,
          title: 'Step 1: Enter Personal Details',
          titleHi: 'चरण 1: व्यक्तिगत विवरण दर्ज करें',
          desc: 'Provide Full Name, Date of Birth, Gender, Marital Status, and Mobile Number.',
          descHi: 'पूरा नाम, जन्म तिथि, लिंग, वैवाहिक स्थिति और मोबाइल नंबर प्रदान करें।'
        },
        {
          num: 3,
          title: 'Step 2: Provide Identity Proof',
          titleHi: 'चरण 2: पहचान प्रमाण प्रदान करें',
          desc: 'Select Aadhaar Card, Voter ID, or PAN and enter their official identity number.',
          descHi: 'आधार कार्ड, मतदाता पहचान पत्र, या पैन चुनें और उनकी आधिकारिक पहचान संख्या दर्ज करें।'
        },
        {
          num: 4,
          title: 'Step 3: Relationship & Residence',
          titleHi: 'चरण 3: संबंध व निवास',
          desc: 'Select kinship relation and confirm if they share your residential address or live at a different location.',
          descHi: 'पारिवारिक संबंध चुनें और पुष्टि करें कि वे आपका पता साझा करते हैं या अलग रहते हैं।'
        },
        {
          num: 5,
          title: 'Step 4: Review & Confirm',
          titleHi: 'चरण 4: समीक्षा व पुष्टि करें',
          desc: 'Review entered details and submit for instant algorithmic kinship deduplication.',
          descHi: 'दर्ज विवरण की समीक्षा करें और तत्काल एल्गोरिदम सत्यापन हेतु जमा करें।'
        }
      ],
      targetTab: 'families',
      targetLabel: 'Open Family Members',
      targetLabelHi: 'परिवार सदस्य खोलें'
    },
    document: {
      title: 'How to Upload & Organize Documents',
      titleHi: 'दस्तावेज़ अपलोड और व्यवस्थित कैसे करें',
      subtitle: 'Managing your cryptographic e-signed document vault',
      subtitleHi: 'अपने क्रिप्टोग्राफ़िक ई-हस्ताक्षरित दस्तावेज़ वॉल्ट का प्रबंधन',
      category: 'Document Wallet',
      categoryHi: 'दस्तावेज़ वॉल्ट',
      readTime: '2 min read',
      readTimeHi: '2 मिनट पढ़ें',
      steps: [
        {
          num: 1,
          title: 'Open Document Wallet',
          titleHi: 'दस्तावेज़ वॉल्ट खोलें',
          desc: 'Navigate to "Document Wallet" to access your secure citizen vault.',
          descHi: 'अपने सुरक्षित नागरिक वॉल्ट तक पहुँचने हेतु "दस्तावेज़ वॉल्ट" पर जाएँ।'
        },
        {
          num: 2,
          title: 'Click "Upload Document"',
          titleHi: '"दस्तावेज़ अपलोड करें" पर क्लिक करें',
          desc: 'Select the document category: Identity Proofs, Address Proofs, Certificates, or Other.',
          descHi: 'दस्तावेज़ श्रेणी चुनें: पहचान प्रमाण, पता प्रमाण, प्रमाण पत्र या अन्य।'
        },
        {
          num: 3,
          title: 'Attach PDF / Image File',
          titleHi: 'पीडीएफ / छवि फ़ाइल संलग्न करें',
          desc: 'Upload scanned copies up to 10 MB. Verified automatically via DigiLocker Government Gateway.',
          descHi: '10 एमबी तक की स्कैन प्रतियां अपलोड करें। डिजीलॉकर सरकारी गेटवे से स्वतः सत्यापित।'
        },
        {
          num: 4,
          title: 'Organize Folders',
          titleHi: 'फ़ोल्डर्स व्यवस्थित करें',
          desc: 'Use the "Organize Documents" feature to sort documents into dedicated encrypted directories.',
          descHi: 'दस्तावेजों को एन्क्रिप्टेड फ़ोल्डरों में छाँटने हेतु "दस्तावेज़ व्यवस्थित करें" सुविधा का उपयोग करें।'
        }
      ],
      targetTab: 'wallet',
      targetLabel: 'Open Document Wallet',
      targetLabelHi: 'दस्तावेज़ वॉल्ट खोलें'
    }
  };

  // Help Categories (4 Cards)
  const helpCategories = [
    {
      id: 'applications',
      title: 'Applications',
      titleHi: 'आवेदन',
      subtitle: 'Apply, track and update claims',
      subtitleHi: 'दावा आवेदन, ट्रैकिंग व अद्यतन',
      icon: FileText,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF'
    },
    {
      id: 'certificates',
      title: 'Certificates',
      titleHi: 'प्रमाण पत्र',
      subtitle: 'Eligibility, documents and process',
      subtitleHi: 'पात्रता, दस्तावेज़ एवं प्रक्रिया',
      icon: Award,
      iconColor: '#16A34A',
      bgColor: '#DCFCE7'
    },
    {
      id: 'family',
      title: 'Family Members',
      titleHi: 'परिवार सदस्य',
      subtitle: 'Add, update or enroll members',
      subtitleHi: 'सदस्यों को जोड़ें, सुधारें या नामांकित करें',
      icon: Users,
      iconColor: '#9333EA',
      bgColor: '#F3E8FF'
    },
    {
      id: 'documents',
      title: 'Documents',
      titleHi: 'दस्तावेज़ वॉल्ट',
      subtitle: 'Upload, verify and organize',
      subtitleHi: 'अपलोड, सत्यापन एवं व्यवस्थापन',
      icon: FolderLock,
      iconColor: '#EA580C',
      bgColor: '#FFEDD5'
    }
  ];

  // FAQs matching screenshot, categorized with full answers
  const faqs = [
    {
      category: 'certificates',
      question: 'How can I apply for a certificate?',
      questionHi: 'मैं प्रमाण पत्र के लिए आवेदन कैसे कर सकता हूँ?',
      answer:
        'To apply for any state certificate (Domicile, Income, Caste, Birth), go to the "Certificates" tab in the left sidebar, click the "+ Apply for Certificate" button, select your certificate type, verify pre-filled details from your Jan Pehchaan ID, attach supporting documents from your Document Wallet, and submit. The application is instantly routed to your district revenue office.',
      answerHi:
        'किसी भी राज्य प्रमाण पत्र (मूल निवास, आय, जाति, जन्म) के लिए आवेदन करने हेतु, बाएँ साइडबार में "प्रमाण पत्र" टैब पर जाएँ, "+ प्रमाण पत्र हेतु आवेदन" बटन पर क्लिक करें, अपने प्रमाण पत्र का प्रकार चुनें, अपनी जन पहचान आईडी से स्वतः भरे गए विवरणों की पुष्टि करें, अपने दस्तावेज़ वॉल्ट से आवश्यक दस्तावेज़ संलग्न करें और सबमिट करें। आवेदन सीधे आपके ज़िला राजस्व कार्यालय को अग्रेषित हो जाता है।'
    },
    {
      category: 'family',
      question: 'How do I add a family member?',
      questionHi: 'मैं परिवार का सदस्य कैसे जोड़ूँ?',
      answer:
        'Navigate to "Family Members" tab, fill in the step-by-step wizard (Personal Details, Identity Proof, Relationship with Head & Residence Address), and submit. If their Aadhaar is linked, instant digital verification is performed.',
      answerHi:
        '"परिवार सदस्य" टैब पर जाएँ, चरण-दर-चरण फ़ॉर्म (व्यक्तिगत विवरण, पहचान प्रमाण, मुखिया से संबंध और निवास का पता) भरें और सबमिट करें। यदि उनका आधार लिंक्ड है, तो तुरंत डिजिटल सत्यापन संपन्न हो जाता है।'
    },
    {
      category: 'applications',
      question: 'How can I track my application?',
      questionHi: 'मैं अपने आवेदन की स्थिति कैसे ट्रैक कर सकता हूँ?',
      answer:
        'Open the "Applications" tab to view real-time tracking of all submitted welfare scheme and certificate claims. You can see whether your claim is in progress, under field verification, or approved, along with the designated officer contact details.',
      answerHi:
        'अपने सभी प्रस्तुत कल्याणकारी योजनाओं और प्रमाण पत्र आवेदनों की रीयल-टाइम स्थिति देखने के लिए "आवेदन" टैब खोलें। आप देख सकते हैं कि आपका दावा प्रगति पर है, स्थलीय सत्यापन में है, या स्वीकृत हो चुका है, साथ ही नामित नोडल अधिकारी का संपर्क विवरण भी उपलब्ध रहता है।'
    },
    {
      category: 'documents',
      question: 'What documents are accepted?',
      questionHi: 'पोर्टल में कौन से दस्तावेज़ मान्य हैं?',
      answer:
        'We accept officially valid documents recognized by the Government of India, including Aadhaar Card, PAN Card, Voter ID (EPIC), Driving License, Passport, Ration Card, and State Birth Certificates. Uploaded documents in PDF, JPG, or PNG format up to 10 MB are cryptographically signed.',
      answerHi:
        'हम भारत सरकार द्वारा मान्यता प्राप्त आधिकारिक रूप से वैध दस्तावेज़ स्वीकार करते हैं, जिनमें आधार कार्ड, पैन कार्ड, मतदाता पहचान पत्र (EPIC), ड्राइविंग लाइसेंस, पासपोर्ट, राशन कार्ड और राज्य जन्म प्रमाण पत्र शामिल हैं। पीडीएफ, जेपीजी या पीएनजी प्रारूप में 10 एमबी तक अपलोड किए गए दस्तावेज़ क्रिप्टोग्राफ़िक रूप से सुरक्षित व हस्ताक्षरित होते हैं।'
    },
    {
      category: 'applications',
      question: 'What is the processing turnaround time for applications?',
      questionHi: 'आवेदनों के निस्तारण में कितना समय लगता है?',
      answer:
        'Under the Right to Public Services Act, Income and Domicile certificates are processed within 7 working days, Caste certificates within 15 working days, and welfare pension claims within 21 working days.',
      answerHi:
        'लोक सेवा गारंटी अधिनियम के तहत, आय और मूल निवास प्रमाण पत्र 7 कार्य दिवसों के भीतर, जाति प्रमाण पत्र 15 कार्य दिवसों के भीतर और कल्याणकारी पेंशन दावे 21 कार्य दिवसों के भीतर निस्तारित किए जाते हैं।'
    },
    {
      category: 'certificates',
      question: 'How do I download my approved certificate?',
      questionHi: 'मैं अपना स्वीकृत प्रमाण पत्र कैसे डाउनलोड करूँ?',
      answer:
        'Once approved, navigate to the "Certificates" tab. Approved certificates feature a direct "Download PDF" button with official QR codes and digital signatures valid across all government departments.',
      answerHi:
        'स्वीकृति के पश्चात, "प्रमाण पत्र" टैब पर जाएँ। स्वीकृत प्रमाण पत्रों पर आधिकारिक क्यूआर कोड और डिजिटल हस्ताक्षर सहित सीधा "पीडीएफ डाउनलोड करें" बटन उपलब्ध होता है, जो सभी सरकारी विभागों में पूर्णतः मान्य है।'
    },
    {
      category: 'family',
      question: 'Can I add a family member who lives at a different address?',
      questionHi: 'क्या मैं ऐसे सदस्य को जोड़ सकता हूँ जो अलग पते पर रहता है?',
      answer:
        'Yes! In the Family Members registration form under Step 3, simply uncheck "This family member lives at the same address as mine". You will then be prompted to provide their specific residential address, State, and District.',
      answerHi:
        'हाँ! परिवार सदस्य पंजीकरण फ़ॉर्म के चरण 3 में, "यह सदस्य मेरे साथ एक ही पते पर रहता है" चेकबॉक्स को अनचेक करें। इसके बाद आप उनका विशिष्ट आवासीय पता, राज्य और ज़िला दर्ज कर सकेंगे।'
    },
    {
      category: 'documents',
      question: 'How does Document Wallet ensure security?',
      questionHi: 'दस्तावेज़ वॉल्ट सुरक्षा कैसे सुनिश्चित करता है?',
      answer:
        'Every document uploaded to JanPehchaan Document Wallet is encrypted using AES-256 military-grade encryption and SHA-256 cryptographic hashes synced with National DigiLocker standards.',
      answerHi:
        'जनपहचान दस्तावेज़ वॉल्ट में अपलोड किया गया प्रत्येक दस्तावेज़ राष्ट्रीय डिजीलॉकर मानकों के साथ समन्वयित AES-256 सैन्य-ग्रेड एन्क्रिप्शन और SHA-256 क्रिप्टोग्राफ़िक हैश द्वारा सुरक्षित रहता है।'
    },
    {
      category: 'general',
      question: 'How can I update my profile details?',
      questionHi: 'मैं अपनी प्रोफ़ाइल जानकारी कैसे अपडेट करूँ?',
      answer:
        'Go to the "Settings" tab and select "Profile & Personal Information". You can update your contact phone number, email address, address details, and communication preferences.',
      answerHi:
        '"सेटिंग्स" टैब पर जाएँ और "प्रोफ़ाइल व व्यक्तिगत जानकारी" चुनें। आप अपना संपर्क फोन नंबर, ईमेल पता, पते का विवरण और संवाद प्राथमिकताएं अपडेट कर सकते हैं।'
    }
  ];

  // Filter FAQs based on category filter and search query
  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const qLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      f.question.toLowerCase().includes(qLower) ||
      (f.questionHi && f.questionHi.toLowerCase().includes(qLower)) ||
      f.answer.toLowerCase().includes(qLower) ||
      (f.answerHi && f.answerHi.toLowerCase().includes(qLower));
    return matchesCategory && matchesSearch;
  });

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { from: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: `Thank you for your question about "${userText}". An official Jan Pehchaan support executive will assist you shortly, or you can call our Toll Free helpline 1800-120-2323 for immediate assistance.`
        }
      ]);
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
            <span style={{ color: '#0F172A', fontWeight: 600 }}>{isHindi ? 'सहायता व समर्थन' : 'Support & Help'}</span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'सहायता व समर्थन' : 'Support & Help'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'प्रश्नों के उत्तर पाएं, समस्याओं का समाधान करें और मार्गदर्शन प्राप्त करें।' : 'Get answers, resolve issues and find guidance.'}
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
              <>&ldquo;आपकी समस्या<br />हमारा समाधान<br />सशक्त भारत&rdquo;</>
            ) : (
              <>&ldquo;Your Queries<br />Our Support<br />A Stronger India&rdquo;</>
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
             Left/Center (72%): Search Card + Help Categories + FAQs Accordion
             Right Sidebar (28%): Contact Support + Quick Actions + Help Guides
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* SEARCH FOR HELP CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.35rem 1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
                <Search size={18} color="#2563EB" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'सहायता खोजें' : 'Search for Help'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>
                  {isHindi ? 'सामान्य प्रश्नों के उत्तर, मार्गदर्शिकाएँ और सहायता जानकारी प्राप्त करें।' : 'Find answers to common questions, guides and support information.'}
                </div>
              </div>
            </div>

            {/* Input + Search Button */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '0.55rem 0.95rem'
              }}>
                <Search size={18} color="#94A3B8" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'सहायता खोजें (जैसे प्रमाण पत्र आवेदन, आवेदन ट्रैक करें, दस्तावेज़ अपलोड...)' : 'Search for help (e.g. apply certificate, track application, document upload...)'}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: '#0F172A',
                    background: 'transparent'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => showToast(isHindi ? `"${searchQuery || 'सभी मार्गदर्शिकाएँ'}" के लिए खोज रहे हैं...` : `Searching help library for "${searchQuery || 'all guides'}"...`)}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem 1.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
              >
                {isHindi ? 'खोजें' : 'Search'}
              </button>
            </div>

            {/* Popular Topics matching screenshot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                {isHindi ? 'लोकप्रिय विषय:' : 'Popular topics:'}
              </span>
              {popularTopics.map((topic, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchQuery(topic.en);
                    showToast(isHindi ? `एफएक्यू फ़िल्टर: ${topic.hi}` : `Filtering FAQs for: ${topic.en}`);
                  }}
                  style={{
                    background: '#EFF6FF',
                    color: '#2563EB',
                    border: '1px solid #BFDBFE',
                    borderRadius: '9999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#DBEAFE';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#EFF6FF';
                  }}
                >
                  {isHindi ? topic.hi : topic.en}
                </button>
              ))}
            </div>
          </div>

          {/* =======================================================
              HELP CATEGORIES (4 Horizontal Cards)
              ======================================================= */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <BookOpen size={16} color="#2563EB" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'सहायता श्रेणियाँ' : 'Help Categories'}
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem'
            }}>
              {helpCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isCatActive = selectedCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      const next = selectedCategory === cat.id ? 'ALL' : cat.id;
                      setSelectedCategory(next);
                      setOpenFaqIndex(0);
                      showToast(next === 'ALL' ? (isHindi ? 'सभी सहायता संसाधन दिखाए जा रहे हैं' : 'Showing all help resources') : (isHindi ? `सहायता संसाधन लोड किए गए: ${cat.titleHi || cat.title}` : `Loaded help resources for: ${cat.title}`));
                    }}
                    style={{
                      background: isCatActive ? '#EFF6FF' : '#FFFFFF',
                      borderRadius: '14px',
                      border: isCatActive ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      padding: '1.15rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      cursor: 'pointer',
                      boxShadow: isCatActive ? '0 4px 14px rgba(37, 99, 235, 0.12)' : '0 2px 6px rgba(15, 23, 42, 0.02)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCatActive) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = '#2563EB';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCatActive) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                      }
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: cat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={20} color={cat.iconColor} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: isCatActive ? '#2563EB' : '#0F172A' }}>
                          {isHindi ? (cat.titleHi || cat.title) : cat.title}
                        </div>
                        <ChevronRight size={15} color={isCatActive ? '#2563EB' : '#94A3B8'} />
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.2rem', lineHeight: 1.3 }}>
                        {isHindi ? (cat.subtitleHi || cat.subtitle) : cat.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DEDICATED CATEGORY QUICK HELP PANEL */}
          {selectedCategory !== 'ALL' && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #BFDBFE',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)',
              padding: '1.35rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedCategory === 'applications' && <FileText size={18} color="#2563EB" />}
                    {selectedCategory === 'certificates' && <Award size={18} color="#16A34A" />}
                    {selectedCategory === 'family' && <Users size={18} color="#9333EA" />}
                    {selectedCategory === 'documents' && <FolderLock size={18} color="#EA580C" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                      {isHindi ? (helpCategories.find((c) => c.id === selectedCategory)?.titleHi || helpCategories.find((c) => c.id === selectedCategory)?.title) : helpCategories.find((c) => c.id === selectedCategory)?.title} {isHindi ? 'सहायता एवं मार्गदर्शन' : 'Help & Guidance'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {selectedCategory === 'applications' && (isHindi ? 'रीयल-टाइम स्थिति ट्रैकिंग, प्रसंस्करण समयसीमा और दावों का समाधान।' : 'Real-time status tracking, processing timelines, and resolution for claims.')}
                      {selectedCategory === 'certificates' && (isHindi ? 'राजस्व और नागरिक प्रमाण पत्र आवेदन एवं डाउनलोड के आधिकारिक दिशानिर्देश।' : 'Official guidelines for applying and downloading revenue and civil certificates.')}
                      {selectedCategory === 'family' && (isHindi ? 'परिवार रोस्टर प्रबंधन, आश्रितों को जोड़ना और पते के सत्यापन नियम।' : 'Household roster management, adding dependents, and address verification rules.')}
                      {selectedCategory === 'documents' && (isHindi ? 'सुरक्षित क्रिप्टोग्राफ़िक संग्रहण, डिजीलॉकर लिंकिंग और प्रमाणित अपलोड।' : 'Secure cryptographic storage, DigiLocker linking, and certified uploads.')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <X size={14} />
                  <span>{isHindi ? 'फ़िल्टर हटाएं' : 'Clear Filter'}</span>
                </button>
              </div>

              {/* 3 Quick Resource Tiles for this Category */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                {selectedCategory === 'applications' && (
                  <>
                    <div
                      onClick={() => setTrackGrievanceModal(true)}
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer', transition: 'border-color 0.15s ease' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '0.25rem' }}>
                        {isHindi ? 'कोई भी आवेदन ट्रैक करें →' : 'Track Any Application →'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                        {isHindi ? 'वर्तमान स्थलीय निरीक्षण चरण देखने हेतु संदर्भ संख्या दर्ज करें।' : 'Enter your reference number to view current field inspection stage.'}
                      </div>
                    </div>
                    <div
                      onClick={() => showToast(isHindi ? 'लोक सेवा गारंटी अधिनियम: राजस्व दावे 7-15 दिनों में हल होते हैं।' : 'Right to Public Services Act: Revenue claims resolve in 7-15 days.')}
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                        {isHindi ? 'सेवा वितरण समयसीमा ⏱' : 'Service Delivery SLAs ⏱'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                        {isHindi ? 'आय (5 दिन), मूल निवास (7 दिन), जाति (10 दिन), पेंशन (21 दिन)।' : 'Income (5 days), Domicile (7 days), Caste (10 days), Pensions (21 days).'}
                      </div>
                    </div>
                    <div
                      onClick={() => onNavigateTab && onNavigateTab('applications')}
                      style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#2563EB', marginBottom: '0.25rem' }}>
                        {isHindi ? 'आवेदन टैब खोलें ↗' : 'Open Applications Tab ↗'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#1E40AF', lineHeight: 1.35 }}>
                        {isHindi ? 'अपने सभी चल रहे व स्वीकृत सरकारी कल्याण दावों को देखें।' : 'View all your ongoing and approved government welfare claims.'}
                      </div>
                    </div>
                  </>
                )}

                {selectedCategory === 'certificates' && (
                  <>
                    <div
                      onClick={() => setActiveGuideModal(helpGuidesData.certificate)}
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#16A34A', marginBottom: '0.25rem' }}>
                        {isHindi ? 'चरण-दर-चरण मार्गदर्शिका →' : 'Step-by-Step Guide →'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                        {isHindi ? 'बिना कागज़ी औपचारिकता के आवेदन भरना और जमा करना सीखें।' : 'Learn how to fill and submit your application with zero paperwork.'}
                      </div>
                    </div>
                    <div
                      onClick={() => showToast(isHindi ? 'जारी किए गए सभी प्रमाण पत्रों में सत्यापन योग्य 2D क्यूआर कोड और डिजिटल हस्ताक्षर होते हैं।' : 'All issued certificates carry verifiable 2D QR codes and state digital signatures.')}
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                        {isHindi ? 'क्यूआर सत्यापन वैधता 🛡' : 'QR Verification Validity 🛡'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                        {isHindi ? 'सभी सरकारी विभागों में मान्य आधिकारिक क्यूआर-युक्त डिजिटल प्रमाण पत्र।' : 'Official state QR-embedded digital certificates valid across all agencies.'}
                      </div>
                    </div>
                    <div
                      onClick={() => onNavigateTab && onNavigateTab('certificates')}
                      style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#16A34A', marginBottom: '0.25rem' }}>
                        {isHindi ? 'प्रमाण पत्र पोर्टल खोलें ↗' : 'Open Certificates Portal ↗'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#166534', lineHeight: 1.35 }}>
                        {isHindi ? 'मूल निवास, आय, जाति या जन्म प्रमाण पत्र हेतु अभी आवेदन करें।' : 'Apply for Domicile, Income, Caste, or Birth Certificate now.'}
                      </div>
                    </div>
                  </>
                )}

                {selectedCategory === 'family' && (
                  <>
                    <div
                      onClick={() => setActiveGuideModal(helpGuidesData.family)}
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#9333EA', marginBottom: '0.25rem' }}>
                        {isHindi ? 'सदस्य जोड़ने की विधि →' : 'Add Member Tutorial →'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                        {isHindi ? '4-चरणीय विज़ार्ड: व्यक्तिगत, पहचान प्रमाण, संबंध एवं पता।' : '4-Step wizard walkthrough: Personal, ID Proof, Relation & Address.'}
                      </div>
                    </div>
                    <div
                      onClick={() => showToast(isHindi ? 'परिवार पंजीकरण के चरण 3 में अलग आवासीय पता समर्थित है।' : 'Separate residence address is supported in Step 3 of family registration.')}
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                        {isHindi ? 'भिन्न पते के नियम 📍' : 'Different Address Rules 📍'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                        {isHindi ? 'नामांकित परिवार सदस्य अपना स्वतंत्र आवासीय पता भी रख सकते हैं।' : 'Enrolled family members can have their own independent residential address.'}
                      </div>
                    </div>
                    <div
                      onClick={() => onNavigateTab && onNavigateTab('families')}
                      style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#9333EA', marginBottom: '0.25rem' }}>
                        {isHindi ? 'परिवार रोस्टर खोलें ↗' : 'Open Family Roster ↗'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#6B21A8', lineHeight: 1.35 }}>
                        {isHindi ? 'सत्यापित पारिवारिक रोस्टर देखें और आश्रित सदस्य जोड़ें।' : 'View verified household roster and add dependent members.'}
                      </div>
                    </div>
                  </>
                )}

                {selectedCategory === 'documents' && (
                  <>
                    <div
                      onClick={() => setActiveGuideModal(helpGuidesData.document)}
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#EA580C', marginBottom: '0.25rem' }}>
                        {isHindi ? 'वॉल्ट मार्गदर्शिका →' : 'Wallet Guide →'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                        {isHindi ? 'अपने एन्क्रिप्टेड नागरिक दस्तावेज़ अपलोड, वर्गीकृत और व्यवस्थित करें।' : 'Upload, categorize and organize your encrypted citizen documents.'}
                      </div>
                    </div>
                    <div
                      onClick={() => showToast(isHindi ? 'डिजीलॉकर मानकों के साथ समन्वयित SHA-256 और AES-256 से एन्क्रिप्टेड।' : 'Encrypted with SHA-256 and AES-256 synced with DigiLocker standards.')}
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                        {isHindi ? 'डिजीलॉकर एकीकरण 🔒' : 'DigiLocker Integration 🔒'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35 }}>
                        {isHindi ? 'त्वरित सत्यापन हेतु राष्ट्रीय डिजीलॉकर रिपॉजिटरी से स्वतः सिंक।' : 'Automatic sync with national DigiLocker repository for instant verification.'}
                      </div>
                    </div>
                    <div
                      onClick={() => onNavigateTab && onNavigateTab('wallet')}
                      style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '12px', padding: '0.85rem', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#EA580C', marginBottom: '0.25rem' }}>
                        {isHindi ? 'दस्तावेज़ वॉल्ट खोलें ↗' : 'Open Document Wallet ↗'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#9A3412', lineHeight: 1.35 }}>
                        {isHindi ? 'अपने आधिकारिक प्रमाण पत्र, पहचान पत्र देखें और प्रतियां डाउनलोड करें।' : 'Access your official certificates, identity cards, and download copies.'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* =======================================================
              FAQS ACCORDION SECTION
              ======================================================= */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <HelpCircle size={16} color="#2563EB" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi
                  ? (selectedCategory === 'ALL'
                    ? 'अक्सर पूछे जाने वाले प्रश्न (FAQs)'
                    : `${helpCategories.find((c) => c.id === selectedCategory)?.titleHi || helpCategories.find((c) => c.id === selectedCategory)?.title} FAQs (${filteredFaqs.length})`)
                  : (selectedCategory === 'ALL'
                    ? 'Frequently Asked Questions (FAQs)'
                    : `${helpCategories.find((c) => c.id === selectedCategory)?.title} FAQs (${filteredFaqs.length})`)}
              </h3>
            </div>

            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
            }}>
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div
                    key={index}
                    style={{
                      borderBottom: index < filteredFaqs.length - 1 ? '1px solid #F1F5F9' : 'none'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: isOpen ? '#F8FAFC' : '#FFFFFF',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isOpen ? '#2563EB' : '#0F172A' }}>
                        {isHindi ? (faq.questionHi || faq.question) : faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={16} color="#2563EB" />
                      ) : (
                        <ChevronDown size={16} color="#94A3B8" />
                      )}
                    </button>

                    {isOpen && (
                      <div style={{
                        padding: '0 1.25rem 1.15rem',
                        background: '#F8FAFC',
                        fontSize: '0.8rem',
                        color: '#475569',
                        lineHeight: 1.55
                      }}>
                        {isHindi ? (faq.answerHi || faq.answer) : faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =======================================================
            RIGHT COLUMN: 3 WIDGETS
            1. Contact Support (Toll Free, Email, Live Chat)
            2. Quick Actions (Raise Grievance, Track Grievance)
            3. Help Guides
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. CONTACT SUPPORT */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Headphones size={16} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'सहायता केंद्र से संपर्क करें' : 'Contact Support'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              {/* Toll Free Helpline */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
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
                  <Phone size={15} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'टोल-फ्री हेल्पलाइन' : 'Toll Free Helpline'}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                    1800-120-2323
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                    {isHindi ? 'सोम - शुक्र, सुबह 9:00 - शाम 6:00' : 'Mon - Fri, 9:00 AM - 6:00 PM'}
                  </div>
                </div>
              </div>

              {/* Email Support */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
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
                  <Mail size={15} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'ईमेल समर्थन' : 'Email Support'}
                  </div>
                  <a
                    href="mailto:support@janpehchaan.in"
                    style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}
                  >
                    support@janpehchaan.in
                  </a>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                    {isHindi ? 'हम 24 घंटे के भीतर उत्तर देंगे' : "We'll respond within 24 hours"}
                  </div>
                </div>
              </div>

              {/* Live Chat */}
              <div
                onClick={() => setLiveChatOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  padding: '0.45rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: '#F8FAFC'
                }}
              >
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
                  <MessageSquare size={15} color="#2563EB" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? 'लाइव चैट' : 'Live Chat'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'हमारी सहायता टीम से सीधी बात करें' : 'Chat with our support team'}
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    marginTop: '0.25rem'
                  }}>
                    <span>{isHindi ? '● ऑनलाइन (सुबह 9:00 - शाम 6:00)' : '● Online (9:00 AM - 6:00 PM)'}</span>
                  </div>
                </div>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Raise a Grievance */}
              <div
                onClick={() => setQuickGrievanceModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '0.9rem' }}>📢</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'शिकायत दर्ज करें' : 'Raise a Grievance'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'समस्या या विलंब की शिकायत करें' : 'Report issue / complaint'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>

              {/* Track Grievance */}
              <div
                onClick={() => setTrackGrievanceModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Search size={15} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'शिकायत ट्रैक करें' : 'Track Grievance'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'स्थिति और समयसीमा जांचें' : 'Check status & timeline'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>
            </div>
          </div>

          {/* 3. HELP GUIDES */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <FileText size={16} color="#2563EB" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'सहायता मार्गदर्शिकाएँ' : 'Help Guides'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[
                { key: 'certificate', title: 'How to Apply for a Certificate', titleHi: 'प्रमाण पत्र हेतु आवेदन कैसे करें' },
                { key: 'family', title: 'How to Add a Family Member', titleHi: 'परिवार का सदस्य कैसे जोड़ें' },
                { key: 'document', title: 'How to Upload & Organize Documents', titleHi: 'दस्तावेज़ अपलोड और व्यवस्थित कैसे करें' }
              ].map((guide, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveGuideModal(helpGuidesData[guide.key])}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.55rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <BookOpen size={14} color="#2563EB" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0F172A' }}>
                      {isHindi ? guide.titleHi : guide.title}
                    </span>
                  </div>
                  <ChevronRight size={14} color="#94A3B8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          LIVE CHAT MODAL
          ========================================================= */}
      {liveChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid #CBD5E1',
          zIndex: 9999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '520px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: '#2563EB',
            color: '#FFFFFF',
            padding: '0.85rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Headphones size={18} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                  {isHindi ? 'नागरिक सहायता डेस्क' : 'Citizen Support Desk'}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#BFDBFE' }}>
                  {isHindi ? 'ऑनलाइन • औसत उत्तर समय 1 मिनट' : 'Online • Avg. reply 1 min'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLiveChatOpen(false)}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.25rem' }}
            >
              ×
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F8FAFC', minHeight: '260px' }}>
            {chatMessages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.from === 'user' ? '#2563EB' : '#FFFFFF',
                  color: m.from === 'user' ? '#FFFFFF' : '#0F172A',
                  padding: '0.55rem 0.85rem',
                  borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  fontSize: '0.78rem',
                  lineHeight: 1.4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  border: m.from === 'bot' ? '1px solid #E2E8F0' : 'none'
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} style={{ display: 'flex', padding: '0.75rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', gap: '0.5rem' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isHindi ? 'अपना संदेश टाइप करें...' : 'Type your message...'}
              style={{
                flex: 1,
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isHindi ? 'भेजें' : 'Send'}
            </button>
          </form>
        </div>
      )}

      {/* =========================================================
          MODAL 1: INTERACTIVE HELP GUIDE VIEWER
          ========================================================= */}
      {activeGuideModal && (
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
            maxWidth: '640px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ background: '#2563EB', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {isHindi ? (activeGuideModal.categoryHi || activeGuideModal.category) : activeGuideModal.category}
                  </span>
                  <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>• {isHindi ? (activeGuideModal.readTimeHi || activeGuideModal.readTime) : activeGuideModal.readTime}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  {isHindi ? (activeGuideModal.titleHi || activeGuideModal.title) : activeGuideModal.title}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '0.2rem' }}>
                  {isHindi ? (activeGuideModal.subtitleHi || activeGuideModal.subtitle) : activeGuideModal.subtitle}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Guide Steps Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#F8FAFC' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isHindi ? 'इन मानक चरणों का पालन करें:' : 'Follow These Standard Steps:'}
              </div>

              {activeGuideModal.steps.map((st) => (
                <div
                  key={st.num}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    padding: '1rem 1.15rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}>
                    {st.num}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                      {isHindi ? (st.titleHi || st.title) : st.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.25rem', lineHeight: 1.45 }}>
                      {isHindi ? (st.descHi || st.desc) : st.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.5rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.5rem 1.15rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'मार्गदर्शिका बंद करें' : 'Close Guide'}
              </button>

              {activeGuideModal.targetTab && (
                <button
                  type="button"
                  onClick={() => {
                    const target = activeGuideModal.targetTab;
                    setActiveGuideModal(null);
                    if (onNavigateTab) onNavigateTab(target);
                  }}
                  style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{isHindi ? (activeGuideModal.targetLabelHi || activeGuideModal.targetLabel) : activeGuideModal.targetLabel}</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: QUICK GRIEVANCE REGISTRATION
          ========================================================= */}
      {quickGrievanceModal && (
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
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '1.15rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                  {isHindi ? 'नागरिक शिकायत दर्ज करें' : 'Lodge Citizen Grievance'}
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {isHindi ? 'ज़िला निवारण प्रकोष्ठ को सीधा प्रेषण' : 'Direct escalation to District Redressal Cell'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickGrievanceModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!grievanceForm.subject.trim()) {
                  showToast(isHindi ? 'कृपया शिकायत का विषय दर्ज करें' : 'Please enter grievance subject');
                  return;
                }
                const ticket = 'GRV-2026-' + Math.floor(10000 + Math.random() * 90000);
                showToast(isHindi ? `शिकायत ${ticket} दर्ज! ज़िला अधिकारी को प्रेषित।` : `Grievance ${ticket} lodged! Assigned to District Officer.`);
                setQuickGrievanceModal(false);
                setGrievanceForm({ category: 'Welfare Schemes', subject: '', description: '' });
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'विभाग / सेवा श्रेणी' : 'Department / Service Category'}
                </label>
                <select
                  value={grievanceForm.category}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, category: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.825rem', outline: 'none' }}
                >
                  <option value="Welfare Schemes">{isHindi ? 'कल्याणकारी योजनाएं (पीएम-किसान, पेंशन)' : 'Welfare Schemes (PM-KISAN, Pensions)'}</option>
                  <option value="Certificate Issuance">{isHindi ? 'राजस्व व प्रमाण पत्र निर्गमन विलंब' : 'Revenue & Certificate Issuance Delay'}</option>
                  <option value="Identity & Family">{isHindi ? 'पहचान व परिवार रजिस्ट्री अद्यतन' : 'Identity & Family Registry Updation'}</option>
                  <option value="Document Wallet">{isHindi ? 'डिजिटल लॉकर व दस्तावेज़ सत्यापन' : 'Digital Locker & Document Verification'}</option>
                  <option value="Other">{isHindi ? 'अन्य सार्वजनिक नागरिक सेवा' : 'Other Citizen Public Service'}</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'शिकायत का विषय *' : 'Grievance Subject *'}
                </label>
                <input
                  type="text"
                  required
                  value={grievanceForm.subject}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, subject: e.target.value })}
                  placeholder={isHindi ? 'उदा. आय प्रमाण पत्र में 7 कार्य दिवसों से अधिक का विलंब' : 'e.g. Income certificate delay beyond 7 working days'}
                  style={{ width: '100%', padding: '0.55rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.825rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'विस्तृत विवरण *' : 'Detailed Description *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={grievanceForm.description}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                  placeholder={isHindi ? 'पूर्ण तथ्य, संबंधित आवेदन संदर्भ संख्या और अनुभव की गई विशिष्ट समस्या दर्ज करें...' : 'Provide complete facts, relevant application reference number, and specific issue faced...'}
                  style={{ width: '100%', padding: '0.55rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.825rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setQuickGrievanceModal(false)}
                  style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.5rem 1.15rem', fontSize: '0.8rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.5rem 1.35rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isHindi ? 'शिकायत दर्ज करें' : 'Submit Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: TRACK GRIEVANCE STATUS
          ========================================================= */}
      {trackGrievanceModal && (
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
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '1.15rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                  {isHindi ? 'शिकायत की स्थिति ट्रैक करें' : 'Track Grievance Status'}
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {isHindi ? 'लाइव चरण सत्यापन एवं नोडल अधिकारी अपडेट' : 'Live stage verification and nodal officer updates'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrackGrievanceModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={grievanceSearchId}
                  onChange={(e) => setGrievanceSearchId(e.target.value)}
                  placeholder={isHindi ? 'शिकायत आईडी दर्ज करें (उदा. GRV-2026-00412)' : 'Enter Grievance ID (e.g. GRV-2026-00412)'}
                  style={{ flex: 1, padding: '0.55rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.825rem', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const id = grievanceSearchId.trim() || 'GRV-2026-00412';
                    setGrievanceSearchResult({
                      ticketId: id,
                      subject: isHindi ? 'आय प्रमाण पत्र की स्वीकृति में विलंब' : 'Delay in Income Certificate approval',
                      department: isHindi ? 'राजस्व एवं जन सेवाएँ' : 'Revenue & Public Services',
                      lodgedDate: isHindi ? '21 अक्टूबर 2026' : '21 Oct 2026',
                      currentStage: isHindi ? 'अधिकारी समीक्षा एवं स्थलीय सत्यापन' : 'Officer Review & Field Verification',
                      nodalOfficer: isHindi ? 'श्री आर.के. मीणा (एसडीएम कार्यालय)' : 'Shri R.K. Meena (SDM Office)',
                      expectedResolution: isHindi ? '26 अक्टूबर 2026' : '26 Oct 2026'
                    });
                  }}
                  style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.55rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isHindi ? 'ट्रैक करें' : 'Track'}
                </button>
              </div>

              {/* Sample / Result Tracking Box */}
              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{isHindi ? 'टोकन संख्या:' : 'Ticket:'}</span>{' '}
                    <strong style={{ fontSize: '0.85rem', color: '#0F172A', fontFamily: 'monospace' }}>
                      {grievanceSearchResult?.ticketId || 'GRV-2026-00412'}
                    </strong>
                  </div>
                  <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {isHindi ? 'प्रगति पर' : 'IN PROGRESS'}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.45rem' }}>
                  {grievanceSearchResult?.subject || (isHindi ? 'आय प्रमाण पत्र की स्वीकृति में विलंब' : 'Delay in Income Certificate approval')}
                </div>

                {/* Progress Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <span>{isHindi ? 'चरण 1: शिकायत दर्ज एवं सत्यापित (21 अक्टूबर)' : 'Stage 1: Grievance Lodged & Verified (21 Oct)'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#2563EB', fontWeight: 700 }}>
                    <Clock size={15} color="#2563EB" />
                    <span>{isHindi ? 'चरण 2: नोडल अधिकारी को आवंटित (श्री आर.के. मीणा)' : 'Stage 2: Assigned to Nodal Officer (Shri R.K. Meena)'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                    <span style={{ width: '15px', height: '15px', borderRadius: '50%', border: '1.5px solid #CBD5E1', display: 'inline-block' }} />
                    <span>{isHindi ? 'चरण 3: स्थलीय सत्यापन एवं अंतिम निवारण' : 'Stage 3: Field Verification & Final Redressal'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setTrackGrievanceModal(false)}
                  style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 1.15rem', fontSize: '0.8rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupportHelpTab;
