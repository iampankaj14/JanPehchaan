import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Globe,
  Bell,
  ChevronDown,
  ShieldCheck,
  User,
  LogOut,
  Smartphone,
  CheckCircle2,
  X,
  LayoutDashboard,
  CreditCard,
  Building2,
  Sparkles,
  FileText,
  Calendar,
  ShieldAlert,
  FolderLock,
  Award,
  Users,
  Headphones,
  Settings,
  ArrowRight,
  Zap,
  CornerDownLeft,
  Flame
} from 'lucide-react';
import AccessibilityToolbar from './AccessibilityToolbar';

// Unified Bilingual Search Knowledgebase (Pages, Schemes, Services, Quick Actions)
const SEARCH_DATABASE = [
  // --- TABS / MAIN PAGES ---
  {
    id: 'tab-overview',
    category: 'PAGE',
    categoryHi: 'मुख्य पृष्ठ',
    title: 'Dashboard Overview',
    titleHi: 'डैशबोर्ड अवलोकन (Overview)',
    subtitle: 'Main metrics, popular welfare schemes, category breakdown',
    subtitleHi: 'मुख्य आंकड़े, सक्रिय योजनाएँ व सेवा श्रेणियां',
    keywords: ['dashboard', 'home', 'overview', 'main', 'मुख्य', 'होम', 'डैशबोर्ड', 'शुरुआत', 'अवलोकन'],
    tab: 'overview',
    icon: LayoutDashboard,
    badgeBg: '#EFF6FF',
    iconColor: '#2563EB'
  },
  {
    id: 'tab-digital_id',
    category: 'PAGE',
    categoryHi: 'पहचान पत्र',
    title: 'Digital Citizen ID',
    titleHi: 'डिजिटल पहचान पत्र (Smart ID)',
    subtitle: 'Smart digital identity card, QR stamp & credentials',
    subtitleHi: 'स्मार्ट पहचान पत्र, क्यूआर प्रमाणीकरण, सरकारी क्रेडेंशियल',
    keywords: ['digital id', 'id card', 'smart card', 'pehchaan', 'पहचान', 'कार्ड', 'स्मार्ट कार्ड', 'पहचान पत्र', 'आईडी'],
    tab: 'digital_id',
    icon: CreditCard,
    badgeBg: '#F0FDF4',
    iconColor: '#16A34A'
  },
  {
    id: 'tab-services',
    category: 'PAGE',
    categoryHi: 'नागरिक सेवाएँ',
    title: 'Citizen Services (32+ Public Services)',
    titleHi: 'नागरिक सेवाएँ (32+ लोक सेवाएँ)',
    subtitle: 'Certificates, utility bills, revenue & welfare services',
    subtitleHi: 'आय, जाति, निवास प्रमाण पत्र, बिजली बिल, राजस्व सेवाएँ',
    keywords: ['services', 'service', 'seva', 'sewa', 'लोक सेवा', 'नागरिक सेवा', 'सेवाएं', 'सरकारी सेवा', 'सर्टिफिकेट'],
    tab: 'services',
    icon: Building2,
    badgeBg: '#FAF5FF',
    iconColor: '#9333EA'
  },
  {
    id: 'tab-schemes',
    category: 'PAGE',
    categoryHi: 'सरकारी योजनाएँ',
    title: 'Scheme Matcher & Welfare Benefits',
    titleHi: 'योजना पात्रता व आवेदन (Scheme Matcher)',
    subtitle: 'PM-Kisan, Ayushman Bharat, Awas Yojana & eligibility evaluation',
    subtitleHi: 'पीएम किसान, आयुष्मान भारत, आवास योजना, लाडली बहना व पात्रता जांच',
    keywords: ['schemes', 'scheme', 'yojana', 'yojna', 'welfare', 'subsidy', 'योजना', 'योजनाएं', 'सरकारी योजना', 'सब्सिडी', 'लाभ'],
    tab: 'schemes',
    icon: Sparkles,
    badgeBg: '#FFF7ED',
    iconColor: '#EA580C'
  },
  {
    id: 'tab-applications',
    category: 'PAGE',
    categoryHi: 'आवेदन स्थिति',
    title: 'Track Applications',
    titleHi: 'आवेदन ट्रैक करें (Application Status)',
    subtitle: 'Real-time status, verification pipeline & claim timeline',
    subtitleHi: 'प्रस्तुत आवेदनों की स्थिति, सत्यापन प्रगति व समयसीमा',
    keywords: ['applications', 'application', 'status', 'track', 'aavedan', 'आवेदन', 'ट्रैक', 'स्थिति', 'स्टेटस', 'दावा'],
    tab: 'applications',
    icon: FileText,
    badgeBg: '#EFF6FF',
    iconColor: '#0284C7'
  },
  {
    id: 'tab-appointments',
    category: 'PAGE',
    categoryHi: 'अपॉइंटमेंट',
    title: 'Appointment Booking',
    titleHi: 'अपॉइंटमेंट बुकिंग (Seva Kendra)',
    subtitle: 'Book visit slots at district collectorate or seva kendra',
    subtitleHi: 'ज़िला सेवा केंद्र या कलेक्ट्रेट हेतु अपॉइंटमेंट स्लॉट बुक करें',
    keywords: ['appointment', 'appointments', 'booking', 'slot', 'sewa kendra', 'अपॉइंटमेंट', 'बुकिंग', 'तारीख', 'समय', 'स्लॉट', 'सेवा केंद्र'],
    tab: 'appointments',
    icon: Calendar,
    badgeBg: '#FEF3C7',
    iconColor: '#D97706'
  },
  {
    id: 'tab-grievances',
    category: 'PAGE',
    categoryHi: 'शिकायत निवारण',
    title: 'Grievance Redressal (CPGRAMS)',
    titleHi: 'शिकायत निवारण (CPGRAMS पोर्टल)',
    subtitle: 'Lodge government grievances, track escalation & officer remarks',
    subtitleHi: 'सरकारी विभागों से संबंधित शिकायत दर्ज करें व समाधान ट्रैक करें',
    keywords: ['grievance', 'grievances', 'complaint', 'complaints', 'shikayat', 'शिकायत', 'निवारण', 'समस्या', 'शिकायतें', 'कम्प्लेंट'],
    tab: 'grievances',
    icon: ShieldAlert,
    badgeBg: '#FEE2E2',
    iconColor: '#DC2626'
  },
  {
    id: 'tab-wallet',
    category: 'PAGE',
    categoryHi: 'दस्तावेज़ वॉल्ट',
    title: 'Document Wallet (DigiLocker Vault)',
    titleHi: 'दस्तावेज़ वॉलेट (डिजिटल वॉल्ट)',
    subtitle: 'Aadhaar, PAN, Ration Card, verified digital documents',
    subtitleHi: 'आधार, पैन, राशन कार्ड, आय/जाति प्रमाण पत्र सुरक्षित वॉल्ट',
    keywords: ['wallet', 'document', 'documents', 'vault', 'aadhaar', 'pan', 'ration', 'दस्तावेज़', 'वॉलेट', 'कागजात', 'आधार', 'पैन', 'राशन कार्ड'],
    tab: 'wallet',
    icon: FolderLock,
    badgeBg: '#ECFDF5',
    iconColor: '#059669'
  },
  {
    id: 'tab-certificates',
    category: 'PAGE',
    categoryHi: 'प्रमाणपत्र',
    title: 'Certificates Management',
    titleHi: 'प्रमाणपत्र प्रबंधन (Certificates)',
    subtitle: 'Download signed caste, income, domicile certificates',
    subtitleHi: 'डिजिटल मुहर युक्त जाति, आय, निवास प्रमाण पत्र डाउनलोड करें',
    keywords: ['certificates', 'certificate', 'praman patra', 'download', 'प्रमाणपत्र', 'सर्टिफिकेट', 'आय प्रमाण', 'जाति प्रमाण', 'निवास प्रमाण'],
    tab: 'certificates',
    icon: Award,
    badgeBg: '#F5F3FF',
    iconColor: '#7C3AED'
  },
  {
    id: 'tab-families',
    category: 'PAGE',
    categoryHi: 'परिवार',
    title: 'Family Members & Household',
    titleHi: 'परिवार के सदस्य (Family Roster)',
    subtitle: 'Kinship registry, add new family member, update e-KYC',
    subtitleHi: 'पारिवारिक संबंध रजिस्टर, नया सदस्य जोड़ें व ई-केवाईसी अपडेट करें',
    keywords: ['family', 'families', 'members', 'household', 'parivar', 'sadasya', 'परिवार', 'सदस्य', 'कुटुंब', 'घर के लोग'],
    tab: 'families',
    icon: Users,
    badgeBg: '#FDF2F8',
    iconColor: '#DB2777'
  },
  {
    id: 'tab-support',
    category: 'PAGE',
    categoryHi: 'सहायता केंद्र',
    title: 'Support & Helpdesk',
    titleHi: 'सपोर्ट व सहायता (Helpdesk)',
    subtitle: 'FAQs, live support chat, helpline 1800-180-1947',
    subtitleHi: 'अक्सर पूछे जाने वाले सवाल, लाइव चैट, टोल फ्री हेल्पलाइन',
    keywords: ['support', 'help', 'helpdesk', 'faq', 'contact', 'sahayata', 'मदद', 'सहायता', 'सपोर्ट', 'हेल्पलाइन', 'सवाल', 'टोल फ्री'],
    tab: 'support',
    icon: Headphones,
    badgeBg: '#F0FDF4',
    iconColor: '#15803D'
  },
  {
    id: 'tab-settings',
    category: 'PAGE',
    categoryHi: 'सेटिंग्स',
    title: 'Portal Settings & Privacy',
    titleHi: 'पोर्टल सेटिंग्स व गोपनीयता',
    subtitle: 'Aadhaar masking, linked IDs, privacy consents, freeze account',
    subtitleHi: 'गोपनीयता सेटिंग्स, आधार मास्किंग, लिंक्ड पहचान, खाता सुरक्षा',
    keywords: ['settings', 'setting', 'privacy', 'profile', 'password', 'सेटिंग', 'सेटिंग्स', 'गोपनीयता', 'पासवर्ड', 'सुरक्षा'],
    tab: 'settings',
    icon: Settings,
    badgeBg: '#F1F5F9',
    iconColor: '#475569'
  },

  // --- WELFARE SCHEMES ---
  {
    id: 'sch-pmkisan',
    category: 'SCHEME',
    categoryHi: 'योजना',
    title: 'PM-KISAN Samman Nidhi',
    titleHi: 'पीएम-किसान सम्मान निधि योजना',
    subtitle: '₹6,000/year direct financial income support for farmers',
    subtitleHi: '₹6,000 प्रति वर्ष किसानों हेतु प्रत्यक्ष आर्थिक सहायता',
    keywords: ['pm kisan', 'pm-kisan', 'kisan', 'farmer', 'krishi', 'kheti', 'किसान', 'पीएम किसान', 'कृषि', 'खेती', 'सम्मान निधि', '6000'],
    tab: 'schemes',
    icon: Sparkles,
    badgeBg: '#DCFCE7',
    iconColor: '#16A34A'
  },
  {
    id: 'sch-ayushman',
    category: 'SCHEME',
    categoryHi: 'योजना',
    title: 'Ayushman Bharat PM-JAY',
    titleHi: 'आयुष्मान भारत (पीएम-जेएवाई)',
    subtitle: '₹5,00,000/year free cashless hospital healthcare coverage',
    subtitleHi: '₹5,00,000 प्रति वर्ष निःशुल्क कैशलेस अस्पताल उपचार',
    keywords: ['ayushman', 'pm-jay', 'pmjay', 'health', 'hospital', 'medical', 'आयुष्मान', 'इलाज', 'अस्पताल', 'स्वास्थ्य', 'दवा', 'बीमारी', '5 लाख'],
    tab: 'schemes',
    icon: Sparkles,
    badgeBg: '#FEE2E2',
    iconColor: '#DC2626'
  },
  {
    id: 'sch-pmawas',
    category: 'SCHEME',
    categoryHi: 'योजना',
    title: 'Pradhan Mantri Awas Yojana (PMAY)',
    titleHi: 'प्रधानमंत्री आवास योजना (पीएमएवाई)',
    subtitle: '₹1,20,000 financial grant for pucca house construction',
    subtitleHi: 'पक्का मकान निर्माण हेतु ₹1,20,000 की वित्तीय सहायता',
    keywords: ['awas', 'pmay', 'housing', 'house', 'makan', 'ghar', 'आवास', 'मकान', 'घर', 'पक्का घर', 'पीएम आवास', 'गरीब आवास'],
    tab: 'schemes',
    icon: Sparkles,
    badgeBg: '#FFEDD5',
    iconColor: '#EA580C'
  },
  {
    id: 'sch-ujjwala',
    category: 'SCHEME',
    categoryHi: 'योजना',
    title: 'Pradhan Mantri Ujjwala Yojana',
    titleHi: 'प्रधानमंत्री उज्ज्वला योजना',
    subtitle: 'Free LPG gas connection + ₹300 cylinder refill subsidy',
    subtitleHi: 'मुफ्त एलपीजी गैस कनेक्शन + ₹300 की सिलेंडर सब्सिडी',
    keywords: ['ujjwala', 'gas', 'cylinder', 'lpg', 'chulha', 'उज्ज्वला', 'गैस', 'सिलेंडर', 'एलपीजी', 'चूल्हा'],
    tab: 'schemes',
    icon: Sparkles,
    badgeBg: '#FEF3C7',
    iconColor: '#CA8A04'
  },
  {
    id: 'sch-ladli',
    category: 'SCHEME',
    categoryHi: 'योजना',
    title: 'Mukhyamantri Ladli Behna Yojana',
    titleHi: 'मुख्यमंत्री लाडली बहना योजना',
    subtitle: '₹1,250 monthly direct benefit transfer for eligible women',
    subtitleHi: 'पात्र महिलाओं हेतु ₹1,250 प्रतिमाह प्रत्यक्ष आर्थिक अंतरण',
    keywords: ['ladli behna', 'ladli', 'women', 'mahila', 'dbt', 'लाडली बहना', 'लाडली', 'महिला', 'बहना', '1250'],
    tab: 'schemes',
    icon: Sparkles,
    badgeBg: '#FCE7F3',
    iconColor: '#DB2777'
  },
  {
    id: 'sch-atalpension',
    category: 'SCHEME',
    categoryHi: 'योजना',
    title: 'Atal Pension Yojana (APY)',
    titleHi: 'अटल पेंशन योजना (एपीवाई)',
    subtitle: 'Guaranteed ₹1,000 to ₹5,000 monthly pension after 60',
    subtitleHi: '60 वर्ष की आयु उपरांत ₹1,000 से ₹5,000 मासिक सुनिश्चित पेंशन',
    keywords: ['atal pension', 'apy', 'pension', 'vriddha', 'old age', 'अटल पेंशन', 'पेंशन', 'बुढ़ापा पेंशन'],
    tab: 'schemes',
    icon: Sparkles,
    badgeBg: '#EDE9FE',
    iconColor: '#7C3AED'
  },

  // --- TOP SERVICES & CERTIFICATES ---
  {
    id: 'svc-income',
    category: 'SERVICE',
    categoryHi: 'सेवा',
    title: 'Income Certificate (Aay Praman)',
    titleHi: 'आय प्रमाण पत्र (Income Certificate)',
    subtitle: 'Official certified annual income for scholarships and schemes',
    subtitleHi: 'छात्रवृत्ति व कल्याणकारी योजनाओं हेतु वार्षिक आय का प्रमाण पत्र',
    keywords: ['income', 'aay', 'praman patra', 'salary', 'आय', 'आय प्रमाण', 'आय प्रमाणपत्र', 'इनकम'],
    tab: 'services',
    icon: Award,
    badgeBg: '#EFF6FF',
    iconColor: '#2563EB'
  },
  {
    id: 'svc-caste',
    category: 'SERVICE',
    categoryHi: 'सेवा',
    title: 'Caste Certificate (OBC / SC / ST)',
    titleHi: 'जाति प्रमाण पत्र (Caste Certificate)',
    subtitle: 'Verified caste category certificate for education and jobs',
    subtitleHi: 'ओबीसी, एससी, एसटी आरक्षण व छात्रवृत्ति हेतु जाति प्रमाण',
    keywords: ['caste', 'jati', 'obc', 'sc', 'st', 'जाति', 'जाति प्रमाण', 'जाति प्रमाणपत्र', 'आरक्षण'],
    tab: 'services',
    icon: Award,
    badgeBg: '#FDF2F8',
    iconColor: '#BE185D'
  },
  {
    id: 'svc-domicile',
    category: 'SERVICE',
    categoryHi: 'सेवा',
    title: 'Domicile Certificate (Niwas Praman)',
    titleHi: 'मूल निवास प्रमाण पत्र (Domicile Certificate)',
    subtitle: 'State permanent residency certificate for job admissions',
    subtitleHi: 'राज्य में स्थायी नागरिकता व निवास का सरकारी प्रमाण',
    keywords: ['domicile', 'residence', 'niwas', 'address', 'निवास', 'मूल निवास', 'निवास प्रमाण पत्र', 'डोमिसाइल'],
    tab: 'services',
    icon: Award,
    badgeBg: '#F0FDF4',
    iconColor: '#16A34A'
  },
  {
    id: 'svc-electricity',
    category: 'SERVICE',
    categoryHi: 'सेवा',
    title: 'Electricity Bill Payment & Power Services',
    titleHi: 'बिजली बिल भुगतान व नया मीटर कनेक्शन',
    subtitle: 'Pay monthly power utility bills or track new power line',
    subtitleHi: 'बिजली बिल देखें, भुगतान करें व नए कनेक्शन हेतु आवेदन करें',
    keywords: ['electricity', 'bijli', 'power', 'bill', 'meter', 'बिजली', 'बिजली बिल', 'विद्युत', 'मीटर', 'करंट'],
    tab: 'services',
    icon: Zap,
    badgeBg: '#FEF3C7',
    iconColor: '#D97706'
  },
  {
    id: 'svc-water',
    category: 'SERVICE',
    categoryHi: 'सेवा',
    title: 'Water Connection Application',
    titleHi: 'पेयजल कनेक्शन आवेदन',
    subtitle: 'Municipal tap water pipeline connection application',
    subtitleHi: 'नगर निगम / जलकल घरेलू पेयजल नल कनेक्शन आवेदन',
    keywords: ['water', 'paani', 'jal', 'tap', 'connection', 'पानी', 'जल', 'पेयजल', 'नल'],
    tab: 'services',
    icon: Building2,
    badgeBg: '#E0F2FE',
    iconColor: '#0284C7'
  },
  {
    id: 'svc-driving',
    category: 'SERVICE',
    categoryHi: 'सेवा',
    title: 'Driving License Services & Renewal',
    titleHi: 'ड्राइविंग लाइसेंस सेवाएँ व नवीनीकरण',
    subtitle: 'Learner license, permanent DL slot & renewal',
    subtitleHi: 'लर्निंग लाइसेंस, पक्का ड्राइविंग लाइसेंस व आरटीओ स्लॉट',
    keywords: ['driving license', 'dl', 'license', 'rto', 'sarathi', 'ड्राइविंग लाइसेंस', 'लाइसेंस', 'आरटीओ', 'गाड़ी चलाना'],
    tab: 'services',
    icon: Building2,
    badgeBg: '#EDE9FE',
    iconColor: '#7C3AED'
  },
  {
    id: 'svc-birth',
    category: 'SERVICE',
    categoryHi: 'सेवा',
    title: 'Birth Certificate Registration',
    titleHi: 'जन्म प्रमाण पत्र पंजीकरण',
    subtitle: 'Official registrar certified birth certificate',
    subtitleHi: 'नगर निकाय / ग्राम पंचायत आधिकारिक जन्म प्रमाण पत्र',
    keywords: ['birth', 'janm', 'certificate', 'baby', 'जन्म', 'जन्म प्रमाण पत्र', 'पैदाइश'],
    tab: 'services',
    icon: Award,
    badgeBg: '#FEF3C7',
    iconColor: '#B45309'
  },

  // --- QUICK ACTIONS ---
  {
    id: 'act-book-appointment',
    category: 'ACTION',
    categoryHi: 'त्वरित कार्य',
    title: 'Book a New Appointment Slot',
    titleHi: 'नया अपॉइंटमेंट स्लॉट बुक करें',
    subtitle: 'Schedule a visit at nearby Seva Kendra or Tehsil',
    subtitleHi: 'नज़दीकी सेवा केंद्र या तहसील हेतु समय स्लॉट बुक करें',
    keywords: ['book appointment', 'slot', 'sewa kendra', 'अपॉइंटमेंट बुक', 'तारीख बुक'],
    tab: 'appointments',
    icon: Calendar,
    badgeBg: '#FEF3C7',
    iconColor: '#D97706'
  },
  {
    id: 'act-file-grievance',
    category: 'ACTION',
    categoryHi: 'त्वरित कार्य',
    title: 'Register a New Grievance',
    titleHi: 'नई सरकारी शिकायत दर्ज करें',
    subtitle: 'Submit an official complaint with auto officer dispatch',
    subtitleHi: 'विभागीय समस्या हेतु शिकायत दर्ज करें व समाधान पाएं',
    keywords: ['register grievance', 'file complaint', 'शिकायत दर्ज', 'शिकायत करें'],
    tab: 'grievances',
    icon: ShieldAlert,
    badgeBg: '#FEE2E2',
    iconColor: '#DC2626'
  },
  {
    id: 'act-upload-doc',
    category: 'ACTION',
    categoryHi: 'त्वरित कार्य',
    title: 'Upload Document to Vault',
    titleHi: 'नया दस्तावेज़ वॉल्ट में अपलोड करें',
    subtitle: 'Store encrypted Aadhaar, PAN, marksheets in vault',
    subtitleHi: 'आधार, पैन, मार्कशीट सुरक्षित डिजिटल वॉल्ट में सहेजें',
    keywords: ['upload document', 'add doc', 'दस्तावेज़ अपलोड', 'कागजात जमा'],
    tab: 'wallet',
    icon: FolderLock,
    badgeBg: '#ECFDF5',
    iconColor: '#059669'
  },
  {
    id: 'act-add-member',
    category: 'ACTION',
    categoryHi: 'त्वरित कार्य',
    title: 'Add Family Member',
    titleHi: 'परिवार में नया सदस्य जोड़ें',
    subtitle: 'Enroll child, spouse or parent into JanPehchaan roster',
    subtitleHi: 'परिवार में नए सदस्य (बच्चा, पत्नी, माता-पिता) का नाम दर्ज करें',
    keywords: ['add family member', 'add member', 'नया सदस्य जोड़ें', 'परिवार में नाम जोड़ें'],
    tab: 'families',
    icon: Users,
    badgeBg: '#FDF2F8',
    iconColor: '#DB2777'
  }
];

export function Header({
  user,
  onLoginClick,
  onLogout,
  onRoleSwitch,
  onShowPortal,
  currentLang = 'en',
  onToggleLang,
  onSearch,
  onToast,
  onNavigateTab
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const isHindi = currentLang === 'hi';

  // Auto-close notifications, search dropdown, and profile dropdown on click outside, scroll, or Esc
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    const handleScrollOrKey = (event) => {
      if (event.type === 'keydown') {
        if (event.key === 'Escape') {
          setNotificationsOpen(false);
          setProfileDropdownOpen(false);
          setSearchOpen(false);
          searchInputRef.current?.blur();
        }
        return;
      }
      // On scroll, keep search open if focused, close others
      setNotificationsOpen(false);
      setProfileDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('scroll', handleScrollOrKey, { passive: true, capture: true });
    document.addEventListener('keydown', handleScrollOrKey);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleScrollOrKey, { capture: true });
      document.removeEventListener('keydown', handleScrollOrKey);
    };
  }, []);

  // Filter Search Results dynamically
  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];

    return SEARCH_DATABASE.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTitleHi = item.titleHi.toLowerCase().includes(q);
      const matchSub = item.subtitle.toLowerCase().includes(q);
      const matchSubHi = item.subtitleHi.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));
      return matchTitle || matchTitleHi || matchSub || matchSubHi || matchKeywords;
    }).slice(0, 8); // Top 8 most relevant matches
  }, [searchQuery]);

  // Reset selectedIndex when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Handle direct selection of a search result
  const handleSelectResult = (item) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.blur();

    if (onNavigateTab) {
      onNavigateTab(item.tab);
    }
    if (onSearch) {
      onSearch(item.title);
    }
    if (onToast) {
      onToast(isHindi ? `✓ "${item.titleHi}" पृष्ठ पर पहुँचाया गया` : `✓ Navigated to ${item.title}`);
    }
  };

  // Keyboard navigation for search dropdown
  const handleKeyDown = (e) => {
    if (!searchOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length ? (prev + 1) % filteredResults.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length ? (prev - 1 + filteredResults.length) % filteredResults.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
        handleSelectResult(filteredResults[selectedIndex]);
      } else {
        handleSearchSubmit(e);
      }
    }
  };

  // Handle Form Submission (Enter key or search click)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return;

    if (filteredResults.length > 0) {
      handleSelectResult(filteredResults[selectedIndex] || filteredResults[0]);
      return;
    }

    // Smart keyword fallback router
    let targetTab = 'services';
    if (q.includes('योजना') || q.includes('scheme') || q.includes('लाभ') || q.includes('किसान') || q.includes('आयुष्मान') || q.includes('आवास')) {
      targetTab = 'schemes';
    } else if (q.includes('शिकायत') || q.includes('grievance') || q.includes('complaint') || q.includes('समस्या')) {
      targetTab = 'grievances';
    } else if (q.includes('अपॉइंटमेंट') || q.includes('appointment') || q.includes('स्लॉट') || q.includes('तारीख')) {
      targetTab = 'appointments';
    } else if (q.includes('पहचान') || q.includes('id') || q.includes('कार्ड') || q.includes('card')) {
      targetTab = 'digital_id';
    } else if (q.includes('परिवार') || q.includes('family') || q.includes('सदस्य') || q.includes('member')) {
      targetTab = 'families';
    } else if (q.includes('दस्तावेज़') || q.includes('wallet') || q.includes('document') || q.includes('कागजात') || q.includes('आधार') || q.includes('पैन')) {
      targetTab = 'wallet';
    } else if (q.includes('प्रमाणपत्र') || q.includes('certificate') || q.includes('सर्टिफिकेट')) {
      targetTab = 'certificates';
    } else if (q.includes('आवेदन') || q.includes('application') || q.includes('स्टेटस') || q.includes('स्थिति') || q.includes('ट्रैक')) {
      targetTab = 'applications';
    } else if (q.includes('सपोर्ट') || q.includes('सहायता') || q.includes('help') || q.includes('support') || q.includes('मदद')) {
      targetTab = 'support';
    } else if (q.includes('सेटिंग') || q.includes('setting') || q.includes('पासवर्ड') || q.includes('सुरक्षा')) {
      targetTab = 'settings';
    }

    setSearchOpen(false);
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.blur();

    if (onNavigateTab) {
      onNavigateTab(targetTab);
    }
    if (onToast) {
      onToast(isHindi ? `"${searchQuery}" से संबंधित पृष्ठ पर पहुँचाया गया` : `Showing results for "${searchQuery}"`);
    }
  };

  const roleDisplay = user?.role === 'ADMIN'
    ? (isHindi ? 'प्रशासक' : 'Administrator')
    : user?.role === 'OFFICER'
    ? (isHindi ? 'सत्यापन अधिकारी' : 'Verification Officer')
    : (isHindi ? 'नागरिक' : 'Citizen');

  // Popular quick discovery items when search input is focused but empty
  const popularSearches = [
    { title: 'PM-KISAN Samman Nidhi', titleHi: 'पीएम-किसान सम्मान निधि', tab: 'schemes', icon: Sparkles, color: '#16A34A', bg: '#DCFCE7' },
    { title: 'Ayushman Bharat PM-JAY', titleHi: 'आयुष्मान भारत (5 लाख इलाज)', tab: 'schemes', icon: Sparkles, color: '#DC2626', bg: '#FEE2E2' },
    { title: 'Income / Caste Certificate', titleHi: 'आय व जाति प्रमाण पत्र', tab: 'services', icon: Award, color: '#2563EB', bg: '#EFF6FF' },
    { title: 'Digital Citizen ID', titleHi: 'डिजिटल पहचान पत्र (Smart ID)', tab: 'digital_id', icon: CreditCard, color: '#059669', bg: '#ECFDF5' },
    { title: 'File New Grievance', titleHi: 'नई सरकारी शिकायत दर्ज करें', tab: 'grievances', icon: ShieldAlert, color: '#DC2626', bg: '#FEE2E2' },
    { title: 'Book Seva Slot', titleHi: 'सेवा केंद्र अपॉइंटमेंट बुक करें', tab: 'appointments', icon: Calendar, color: '#D97706', bg: '#FEF3C7' }
  ];

  return (
    <header className="topbar">
      {/* 1. LEFT BRANDING: Official Unified Logo */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <img
          src="/assets/logo.png"
          alt="JanPehchaan - Your Identity, Your Right"
          style={{ height: '46px', width: 'auto', objectFit: 'contain', cursor: 'pointer' }}
          onClick={() => onNavigateTab && onNavigateTab('overview')}
        />
      </div>

      {/* 2. CENTER: Fully Interactive Instant Autocomplete Search Bar */}
      <div ref={searchContainerRef} style={{ flex: 1, maxWidth: '560px', margin: '0 2rem', position: 'relative' }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: searchOpen ? '#FFFFFF' : '#F8FAFC',
            border: searchOpen ? '1.5px solid #0A84FF' : '1px solid #CBD5E1',
            borderRadius: searchOpen && (searchQuery.trim() || true) ? '12px' : '12px',
            padding: '0.5rem 0.95rem',
            transition: 'all 0.2s ease',
            boxShadow: searchOpen ? '0 4px 16px rgba(10, 132, 255, 0.15)' : 'none'
          }}
        >
          <Search size={16} color={searchOpen ? '#0A84FF' : '#94A3B8'} style={{ flexShrink: 0 }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={isHindi ? 'योजना, सेवा, प्रमाण पत्र या शिकायत खोजें...' : 'Search schemes, services, certificates or grievances...'}
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#0F172A',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                if (searchInputRef.current) searchInputRef.current.focus();
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                color: '#94A3B8'
              }}
              title={isHindi ? 'साफ़ करें' : 'Clear search'}
            >
              <X size={15} />
            </button>
          )}
          <button
            type="submit"
            style={{
              background: '#0B2545',
              border: 'none',
              borderRadius: '6px',
              padding: '0.25rem 0.6rem',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span>{isHindi ? 'खोजें' : 'Search'}</span>
            <CornerDownLeft size={11} />
          </button>
        </form>

        {/* Live Search Autocomplete Popover Dropdown */}
        {searchOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 16px 36px rgba(15, 23, 42, 0.14)',
              zIndex: 9999,
              maxHeight: '430px',
              overflowY: 'auto',
              animation: 'modalEnter 0.16s ease-out'
            }}
          >
            {/* If user typed a query */}
            {searchQuery.trim() ? (
              filteredResults.length > 0 ? (
                <div style={{ padding: '0.5rem' }}>
                  <div style={{
                    padding: '0.35rem 0.65rem 0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #F1F5F9',
                    marginBottom: '0.35rem'
                  }}>
                    <span>{isHindi ? `मिलते-जुलते परिणाम (${filteredResults.length})` : `Matching Results (${filteredResults.length})`}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 500, color: '#94A3B8' }}>
                      {isHindi ? '↑↓ नेविगेट करें • Enter चुनें' : '↑↓ Navigate • Enter to select'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {filteredResults.map((item, idx) => {
                      const IconComp = item.icon || Sparkles;
                      const isSelected = idx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '10px',
                            background: isSelected ? '#F0F9FF' : 'transparent',
                            border: isSelected ? '1px solid #BAE6FD' : '1px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.12s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                            <div style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              background: item.badgeBg || '#EFF6FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <IconComp size={17} color={item.iconColor || '#2563EB'} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: isSelected ? '#0369A1' : '#0F172A',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {isHindi ? item.titleHi : item.title}
                              </div>
                              <div style={{
                                fontSize: '0.73rem',
                                color: '#64748B',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {isHindi ? item.subtitleHi : item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                            <span style={{
                              fontSize: '0.67rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '6px',
                              background: item.badgeBg || '#F1F5F9',
                              color: item.iconColor || '#475569'
                            }}>
                              {isHindi ? item.categoryHi : item.category}
                            </span>
                            <ArrowRight size={13} color={isSelected ? '#0284C7' : '#CBD5E1'} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* No direct results empty state */
                <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#FEF2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto'
                  }}>
                    <Search size={20} color="#DC2626" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.25rem' }}>
                    {isHindi ? `"${searchQuery}" के लिए कोई सीधा परिणाम नहीं मिला` : `No direct results found for "${searchQuery}"`}
                  </div>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                    {isHindi ? 'कृपया मुख्य सेवा सूची या कल्याणकारी योजनाओं में खोजें अथवा नीचे दिए गए त्वरित पृष्ठ चुनें:' : 'Explore the full services catalog or scheme matcher below:'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        if (onNavigateTab) onNavigateTab('services');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                      <Building2 size={13} color="#0A84FF" />
                      <span>{isHindi ? 'सभी 32 नागरिक सेवाएँ' : 'All 32 Services'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        if (onNavigateTab) onNavigateTab('schemes');
                      }}
                      className="btn btn-azure btn-sm"
                      style={{ fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                      <Sparkles size={13} />
                      <span>{isHindi ? 'सरकारी योजनाएँ देखें' : 'Welfare Schemes'}</span>
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* When search input is empty and focused: show popular recommendations */
              <div style={{ padding: '0.65rem 0.75rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#EA580C',
                  padding: '0.25rem 0.4rem 0.5rem',
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: '0.45rem'
                }}>
                  <Flame size={14} color="#EA580C" />
                  <span>{isHindi ? '🔥 लोकप्रिय खोजें व अनुशंसित पृष्ठ' : '🔥 Popular Searches & Recommended Pages'}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
                  {popularSearches.map((pop, idx) => {
                    const PopIcon = pop.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          if (onNavigateTab) onNavigateTab(pop.tab);
                          if (onToast) onToast(isHindi ? `"${pop.titleHi}" पृष्ठ पर पहुँचाया गया` : `Navigated to ${pop.title}`);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '8px',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#EFF6FF';
                          e.currentTarget.style.borderColor = '#BFDBFE';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F8FAFC';
                          e.currentTarget.style.borderColor = '#E2E8F0';
                        }}
                      >
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          background: pop.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <PopIcon size={14} color={pop.color} />
                        </div>
                        <div style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {isHindi ? pop.titleHi : pop.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. RIGHT CONTROLS: Accessibility Toolbar -> Bell -> Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', position: 'relative' }}>
        {/* Working Accessibility Toolbar: Language + Font Size (A- A A+) + Theme Toggle */}
        <AccessibilityToolbar
          currentLang={currentLang}
          onToggleLang={onToggleLang}
          onToast={onToast}
        />

        {/* Notification Bell with Red Badge Dot */}
        <div ref={notificationsRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
            title="Notifications"
          >
            <Bell size={18} color="#334155" />
            {/* Red dot badge */}
            <span style={{
              position: 'absolute',
              top: '7px',
              right: '7px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#EF4444',
              border: '2px solid #FFFFFF'
            }} />
          </button>

          {/* Notifications Dropdown Drawer */}
          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '300px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '0.85rem',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                  {isHindi ? 'सूचनाएं' : 'Notifications'}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#0A84FF', fontWeight: 600 }}>
                  {isHindi ? 'सभी पढ़े चिह्नित करें' : 'Mark all read'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>
                    {isHindi ? 'पीएम-किसान योजना पात्रता!' : 'PM-KISAN Scheme Matched!'}
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>
                    {isHindi ? 'आपका परिवार ₹6,000/वर्ष के लिए 100% पात्र है।' : 'Your household is 100% eligible for ₹6,000/yr.'}
                  </div>
                </div>
                <div style={{ padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>
                    {isHindi ? 'डुप्लिकेशन सत्यापन सफल' : 'Deduplication Verified'}
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>
                    {isHindi ? 'आधार क्रिप्टोग्राफ़िक जांच बिना किसी डुप्लीकेट के पूरी हुई।' : 'Aadhaar cryptographic check passed without duplicate.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Component with Avatar Photo */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              padding: '0.2rem 0.4rem',
              borderRadius: '10px',
              userSelect: 'none'
            }}
          >
            {/* User Avatar */}
            <img
              src="/assets/avatar_pankaj.jpg"
              alt="User Avatar"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #CBD5E1',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}
              onError={(e) => {
                e.currentTarget.src = '/assets/favicon.png';
              }}
            />

            {/* User Name & Role */}
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#0F172A',
                  lineHeight: 1.15
                }}>
                  {user?.name || 'Pankaj Kumar'}
                </span>
                <ChevronDown size={13} color="#64748B" />
              </div>
              <span style={{
                fontSize: '0.72rem',
                color: '#64748B',
                fontWeight: 500,
                marginTop: '0.05rem'
              }}>
                {roleDisplay}
              </span>
            </div>
          </div>

          {/* Profile Dropdown (Clean, Prototype Citizen Only) */}
          {profileDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '230px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
              padding: '0.75rem',
              zIndex: 100
            }}>
              <div style={{ padding: '0.25rem 0.35rem 0.5rem', borderBottom: '1px solid #F1F5F9', marginBottom: '0.45rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A' }}>
                  {user?.name || 'Pankaj Kumar'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                  {user?.email || 'citizen@janpehchaan.in'}
                </div>
              </div>

              {/* Verified Citizen Badge */}
              <div style={{
                margin: '0.35rem 0 0.55rem 0',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                padding: '0.5rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ShieldCheck size={16} color="#16A34A" />
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 800 }}>
                    {isHindi ? 'सत्यापित नागरिक प्रोफाइल' : 'Verified Citizen Profile'}
                  </div>
                  <div style={{ fontSize: '0.67rem', color: '#166534' }}>
                    {isHindi ? 'जनपहचान एकीकृत आईडी सक्रिय' : 'JanPehchaan Unified ID Active'}
                  </div>
                </div>
              </div>

              {/* Showcase Screen Link if present */}
              {onShowPortal && (
                <button
                  type="button"
                  onClick={() => { onShowPortal(); setProfileDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.45rem 0.6rem',
                    borderRadius: '6px',
                    background: 'transparent',
                    color: '#0A84FF',
                    border: 'none',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Smartphone size={13} color="#0A84FF" />
                  <span>{isHindi ? 'लॉगिन / शोकेस व्यू' : 'Login / Showcase View'}</span>
                </button>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={() => { onLogout && onLogout(); setProfileDropdownOpen(false); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '6px',
                  background: '#FEF2F2',
                  color: '#B91C1C',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '0.35rem'
                }}
              >
                <LogOut size={14} color="#B91C1C" />
                <span>{isHindi ? 'लॉग आउट' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
