import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronRight,
  FileText,
  User,
  Users,
  FolderLock,
  Calendar,
  GraduationCap,
  Heart,
  Sprout,
  Briefcase,
  Home as HomeIcon,
  Settings as SettingsIcon,
  CreditCard,
  Headphones,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
  LayoutGrid,
  Zap,
  Award,
  IdCard,
  Activity,
  FileCheck,
  ShieldCheck,
  X
} from 'lucide-react';

export function ServicesTab({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [catalogDisplayMode, setCatalogDisplayMode] = useState('CATEGORIES'); // 'CATEGORIES' or 'ALL_LIST'
  const [myServicesTab, setMyServicesTab] = useState('RECENT'); // 'RECENT' or 'FREQUENT'
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedServiceModal, setSelectedServiceModal] = useState(null);
  const [applyServiceModal, setApplyServiceModal] = useState(null);
  const [applyForm, setApplyForm] = useState({ remarks: '', consent: true });
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Category Pills matching screenshot
  const categories = [
    { id: 'ALL', label: isHindi ? 'सभी सेवाएँ' : 'All Services' },
    { id: 'IDENTITY', label: isHindi ? 'पहचान व दस्तावेज़' : 'Identity & Documents' },
    { id: 'EDUCATION', label: isHindi ? 'शिक्षा' : 'Education' },
    { id: 'HEALTH', label: isHindi ? 'स्वास्थ्य' : 'Health' },
    { id: 'WELFARE', label: isHindi ? 'सामाजिक कल्याण' : 'Social Welfare' },
    { id: 'AGRICULTURE', label: isHindi ? 'कृषि' : 'Agriculture' },
    { id: 'EMPLOYMENT', label: isHindi ? 'रोजगार' : 'Employment' },
    { id: 'HOUSING', label: isHindi ? 'आवास' : 'Housing' },
    { id: 'UTILITIES', label: isHindi ? 'सुविधाएँ व अन्य' : 'Utilities & Others' }
  ];

  // Comprehensive Catalog of All 32 Government Citizen Services
  const allIndividualServices = useMemo(() => [
    // Identity & Documents
    {
      id: 'SVC-ID-01',
      title: 'Domicile Certificate (Niwas Praman)',
      titleHi: 'मूल निवास प्रमाण पत्र (निवास प्रमाण)',
      category: 'IDENTITY',
      categoryName: 'Identity & Documents',
      categoryNameHi: 'पहचान व दस्तावेज़',
      dept: 'Department of Revenue (UP)',
      deptHi: 'राजस्व विभाग',
      time: '7 Working Days',
      timeHi: '7 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['domicile', 'residence', 'niwas', 'praman patra', 'address'],
      desc: 'Proof of permanent residence in the state for school, college admissions and government jobs.',
      descHi: 'स्कूल, कॉलेज प्रवेश और सरकारी नौकरियों हेतु राज्य में स्थायी निवास का आधिकारिक प्रमाण पत्र।'
    },
    {
      id: 'SVC-ID-02',
      title: 'Income Certificate (Aay Praman)',
      titleHi: 'आय प्रमाण पत्र (आय प्रमाण)',
      category: 'IDENTITY',
      categoryName: 'Identity & Documents',
      categoryNameHi: 'पहचान व दस्तावेज़',
      dept: 'Department of Revenue (UP)',
      deptHi: 'राजस्व विभाग',
      time: '5 Working Days',
      timeHi: '5 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['income', 'aay', 'praman patra', 'scholarship', 'salary', 'financial'],
      desc: 'Official certificate certifying annual household income from all verified revenue sources.',
      descHi: 'सभी सत्यापित राजस्व स्रोतों से परिवार की वार्षिक आय प्रमाणित करने वाला आधिकारिक प्रमाण पत्र।'
    },
    {
      id: 'SVC-ID-03',
      title: 'Caste Certificate (OBC/SC/ST)',
      titleHi: 'जाति प्रमाण पत्र (ओबीसी/एससी/एसटी)',
      category: 'IDENTITY',
      categoryName: 'Identity & Documents',
      categoryNameHi: 'पहचान व दस्तावेज़',
      dept: 'Department of Social Welfare',
      deptHi: 'समाज कल्याण विभाग',
      time: '10 Working Days',
      timeHi: '10 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['caste', 'jaati', 'obc', 'sc', 'st', 'reservation'],
      desc: 'Official reservation certificate for recognized scheduled castes, tribes, and backward classes.',
      descHi: 'अनुसूचित जाति, जनजाति एवं अन्य पिछड़ा वर्ग के आरक्षण लाभ हेतु आधिकारिक जाति प्रमाण पत्र।'
    },
    {
      id: 'SVC-ID-04',
      title: 'Birth & Death Registration',
      titleHi: 'जन्म एवं मृत्यु पंजीकरण',
      category: 'IDENTITY',
      categoryName: 'Identity & Documents',
      categoryNameHi: 'पहचान व दस्तावेज़',
      dept: 'Planning & Health Directorate',
      deptHi: 'स्वास्थ्य एवं परिवार कल्याण निदेशालय',
      time: '3 Working Days',
      timeHi: '3 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['birth', 'death', 'janam', 'mrityu', 'registration', 'vital'],
      desc: 'Digital registration and certificate issuance for institutional or domestic births and deaths.',
      descHi: 'संस्थागत या घरेलू जन्म और मृत्यु का डिजिटल पंजीकरण एवं प्रमाण पत्र निर्गमन।'
    },
    {
      id: 'SVC-ID-05',
      title: 'Digital ID Updates & e-KYC',
      titleHi: 'डिजिटल आईडी अपडेट एवं ई-केवाईसी',
      category: 'IDENTITY',
      categoryName: 'Identity & Documents',
      categoryNameHi: 'पहचान व दस्तावेज़',
      dept: 'Jan Pehchaan Digital Authority',
      deptHi: 'जन पहचान डिजिटल प्राधिकरण',
      time: 'Instant / 24 Hours',
      timeHi: 'त्वरित / 24 घंटे',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['digital id', 'ekyc', 'aadhaar', 'update', 'photo', 'profile'],
      desc: 'Update mobile number, address or photo in unified state citizen registry.',
      descHi: 'एकीकृत राज्य नागरिक डेटाबेस में मोबाइल नंबर, पता अथवा फोटो अद्यतन करें।'
    },

    // Education
    {
      id: 'SVC-EDU-01',
      title: 'Pre-Matric Scholarship',
      titleHi: 'पूर्व-दशम छात्रवृत्ति (कक्षा 1 से 10)',
      category: 'EDUCATION',
      categoryName: 'Education',
      categoryNameHi: 'शिक्षा',
      dept: 'Department of Basic Education',
      deptHi: 'बेसिक शिक्षा विभाग',
      time: '15 Working Days',
      timeHi: '15 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['scholarship', 'school', 'pre-matric', 'students', 'stipend', 'education'],
      desc: 'Financial assistance for school students from classes 1 to 10 from low-income families.',
      descHi: 'कम आय वर्ग के परिवारों के कक्षा 1 से 10 के स्कूली छात्र-छात्राओं हेतु वित्तीय सहायता।'
    },
    {
      id: 'SVC-EDU-02',
      title: 'Post-Matric Fee Reimbursement',
      titleHi: 'दशमोत्तर छात्रवृत्ति एवं शुल्क प्रतिपूर्ति',
      category: 'EDUCATION',
      categoryName: 'Education',
      categoryNameHi: 'शिक्षा',
      dept: 'Social Welfare & Higher Education',
      deptHi: 'समाज कल्याण एवं उच्च शिक्षा विभाग',
      time: '20 Working Days',
      timeHi: '20 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['post-matric', 'college', 'tuition fee', 'reimbursement', 'degree', 'fee'],
      desc: 'Reimbursement of tuition fees for students in colleges, universities and polytechnics.',
      descHi: 'कॉलेजों, विश्वविद्यालयों एवं पॉलिटेक्निक संस्थानों में अध्ययनरत छात्रों के शिक्षण शुल्क की प्रतिपूर्ति।'
    },
    {
      id: 'SVC-EDU-03',
      title: 'Merit Student Grant (Medhavi Chhatra)',
      titleHi: 'मेधावी छात्र प्रोत्साहन पुरस्कार',
      category: 'EDUCATION',
      categoryName: 'Education',
      categoryNameHi: 'शिक्षा',
      dept: 'Secondary Education Council',
      deptHi: 'माध्यमिक शिक्षा परिषद',
      time: '14 Working Days',
      timeHi: '14 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['merit', 'medhavi', 'laptop', 'topper', 'cash award', 'grant'],
      desc: 'Merit grant and laptop/tablet incentive for high-scoring board examination students.',
      descHi: 'बोर्ड परीक्षाओं में उत्कृष्ट अंक प्राप्त करने वाले मेधावी छात्र-छात्राओं को प्रोत्साहन राशि व उपकरण।'
    },
    {
      id: 'SVC-EDU-04',
      title: 'Hostel Admission Quota',
      titleHi: 'छात्रावास प्रवेश कोटा व रियायत',
      category: 'EDUCATION',
      categoryName: 'Education',
      categoryNameHi: 'शिक्षा',
      dept: 'Directorate of Backward Classes',
      deptHi: 'पिछड़ा वर्ग कल्याण निदेशालय',
      time: '7 Working Days',
      timeHi: '7 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['hostel', 'accommodation', 'room', 'student', 'mess'],
      desc: 'Subsidized hostel allotment and mess fee concession for students from rural districts.',
      descHi: 'ग्रामीण क्षेत्रों के अध्ययनरत विद्यार्थियों के लिए रियायती छात्रावास आवंटन और मेस शुल्क छूट।'
    },

    // Health
    {
      id: 'SVC-HLT-01',
      title: 'Ayushman Bharat PM-JAY Card',
      titleHi: 'आयुष्मान भारत पीएम-जेएवाई गोल्डन कार्ड',
      category: 'HEALTH',
      categoryName: 'Health',
      categoryNameHi: 'स्वास्थ्य',
      dept: 'National Health Authority & State Agency',
      deptHi: 'राष्ट्रीय स्वास्थ्य प्राधिकरण एवं राज्य स्वास्थ्य एजेंसी',
      time: '2 Working Days',
      timeHi: '2 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['ayushman', 'pm-jay', 'golden card', 'hospital', 'insurance', 'treatment', 'health'],
      desc: '₹5 Lakh per annum cashless secondary and tertiary hospitalization cover per family.',
      descHi: 'प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस द्वितीयक एवं तृतीयक अस्पताल उपचार कवर।'
    },
    {
      id: 'SVC-HLT-02',
      title: 'Government Hospital OPD Booking',
      titleHi: 'सरकारी अस्पताल ओपीडी टोकन बुकिंग',
      category: 'HEALTH',
      categoryName: 'Health',
      categoryNameHi: 'स्वास्थ्य',
      dept: 'Medical, Health & Family Welfare',
      deptHi: 'चिकित्सा, स्वास्थ्य एवं परिवार कल्याण विभाग',
      time: 'Instant Online Slip',
      timeHi: 'त्वरित ऑनलाइन पर्ची',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['opd', 'doctor', 'hospital', 'token', 'appointment', 'aiims', 'clinic'],
      desc: 'Avoid queues with online OPD registration and doctor consultation tokens.',
      descHi: 'कतारों से बचें - ऑनलाइन ओपीडी पंजीकरण एवं डॉक्टर परामर्श टोकन प्राप्त करें।'
    },
    {
      id: 'SVC-HLT-03',
      title: 'Mother & Child Care Grants (PMMVY)',
      titleHi: 'मातृ व शिशु कल्याण सहायता (पीएमएमवीवाई)',
      category: 'HEALTH',
      categoryName: 'Health',
      categoryNameHi: 'स्वास्थ्य',
      dept: 'Women & Child Development',
      deptHi: 'महिला एवं बाल विकास विभाग',
      time: '14 Working Days',
      timeHi: '14 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['mother', 'pregnancy', 'maternity', 'child', 'grant', 'nutrition'],
      desc: 'Maternity benefit cash incentives for pregnant and lactating mothers for first child.',
      descHi: 'गर्भवती और स्तनपान कराने वाली माताओं के पोषण एवं स्वास्थ्य सुधार हेतु प्रत्यक्ष नकद प्रोत्साहन।'
    },
    {
      id: 'SVC-HLT-04',
      title: 'Immunization Registry & Child Card',
      titleHi: 'बाल टीकाकरण पंजीयन एवं डिजिटल कार्ड',
      category: 'HEALTH',
      categoryName: 'Health',
      categoryNameHi: 'स्वास्थ्य',
      dept: 'National Health Mission',
      deptHi: 'राष्ट्रीय स्वास्थ्य मिशन',
      time: 'Instant Slip',
      timeHi: 'त्वरित डिजिटल पर्ची',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['vaccine', 'immunization', 'tika', 'polio', 'covid', 'child'],
      desc: 'Digital track record of all childhood vaccines and scheduled inoculation centers.',
      descHi: 'शिशु के संपूर्ण टीकाकरण का डिजिटल रिकॉर्ड एवं नजदीकी टीकाकरण केंद्र की जानकारी।'
    },

    // Social Welfare
    {
      id: 'SVC-WLF-01',
      title: 'Old Age Pension (Vridhavastha Pension)',
      titleHi: 'वृद्धावस्था पेंशन योजना',
      category: 'WELFARE',
      categoryName: 'Social Welfare',
      categoryNameHi: 'सामाजिक कल्याण',
      dept: 'Social Welfare Department',
      deptHi: 'समाज कल्याण विभाग',
      time: '21 Working Days',
      timeHi: '21 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['pension', 'old age', 'vridha', 'elderly', 'monthly stipend', 'welfare'],
      desc: '₹1,000 monthly DBT financial support for senior citizens aged 60+ below poverty line.',
      descHi: '60 वर्ष से अधिक आयु के वरिष्ठ नागरिकों हेतु ₹1,000 मासिक प्रत्यक्ष लाभ अंतरण (डीबीटी)।'
    },
    {
      id: 'SVC-WLF-02',
      title: 'Widow Pension Support (Nirashrit Mahila)',
      titleHi: 'निराश्रित महिला (विधवा) पेंशन सहायता',
      category: 'WELFARE',
      categoryName: 'Social Welfare',
      categoryNameHi: 'सामाजिक कल्याण',
      dept: 'Women & Child Development',
      deptHi: 'महिला एवं बाल विकास विभाग',
      time: '14 Working Days',
      timeHi: '14 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['widow', 'nirashrit', 'mahila', 'pension', 'destitute', 'welfare'],
      desc: 'Monthly allowance for destitute widowed women residing in rural and urban areas.',
      descHi: 'ग्रामीण एवं शहरी क्षेत्रों की निराश्रित विधवा महिलाओं के भरण-पोषण हेतु नियमित मासिक अनुदान।'
    },
    {
      id: 'SVC-WLF-03',
      title: 'Divyang Disability Allowance',
      titleHi: 'दिव्यांगजन पेंशन एवं सहायक उपकरण',
      category: 'WELFARE',
      categoryName: 'Social Welfare',
      categoryNameHi: 'सामाजिक कल्याण',
      dept: 'Empowerment of Persons with Disabilities',
      deptHi: 'दिव्यांगजन सशक्तिकरण विभाग',
      time: '14 Working Days',
      timeHi: '14 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['divyang', 'disability', 'handicapped', 'pension', 'udid'],
      desc: 'Financial allowance and assistive aids for persons with 40%+ benchmark disability.',
      descHi: '40% या अधिक दिव्यांगता वाले नागरिकों हेतु मासिक वित्तीय भत्ता एवं सहायक उपकरण अनुदान।'
    },
    {
      id: 'SVC-WLF-04',
      title: 'National Family Benefit Scheme (NFBS)',
      titleHi: 'राष्ट्रीय पारिवारिक लाभ योजना (एनएफबीएस)',
      category: 'WELFARE',
      categoryName: 'Social Welfare',
      categoryNameHi: 'सामाजिक कल्याण',
      dept: 'Social Welfare Directorate',
      deptHi: 'समाज कल्याण निदेशालय',
      time: '30 Working Days',
      timeHi: '30 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['nfbs', 'death compensation', 'breadwinner', 'lump sum', 'assistance'],
      desc: 'One-time ₹30,000 financial compensation on the demise of primary household breadwinner.',
      descHi: 'परिवार के मुख्य कमाऊ मुखिया की आकस्मिक मृत्यु पर ₹30,000 की एकमुश्त आर्थिक सहायता।'
    },

    // Agriculture
    {
      id: 'SVC-AGR-01',
      title: 'PM-KISAN DBT Verification',
      titleHi: 'पीएम-किसान डीबीटी सत्यापन एवं ई-केवाईसी',
      category: 'AGRICULTURE',
      categoryName: 'Agriculture',
      categoryNameHi: 'कृषि',
      dept: 'Department of Agriculture',
      deptHi: 'कृषि विभाग',
      time: 'Instant / 48 Hours',
      timeHi: 'त्वरित / 48 घंटे',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['pm kisan', 'farmer', 'kisan samman nidhi', 'dbt', 'land seeding', 'agriculture'],
      desc: 'Aadhaar e-KYC and land seeding status for ₹6,000 annual direct cash installments.',
      descHi: '₹6,000 वार्षिक किसान सम्मान निधि किस्तों हेतु आधार ई-केवाईसी एवं भूलेख सीडिंग सत्यापन।'
    },
    {
      id: 'SVC-AGR-02',
      title: 'Fasal Bima Claim (PMFBY)',
      titleHi: 'प्रधानमंत्री फसल बीमा दावा (पीएमएफबीवाई)',
      category: 'AGRICULTURE',
      categoryName: 'Agriculture',
      categoryNameHi: 'कृषि',
      dept: 'Agriculture & Insurance Authority',
      deptHi: 'कृषि एवं फसल बीमा प्राधिकरण',
      time: '15 Working Days',
      timeHi: '15 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['crop insurance', 'fasal bima', 'drought', 'flood', 'compensation'],
      desc: 'Loss assessment and insurance payout for crops damaged by weather, rain, or drought.',
      descHi: 'बेमौसम वर्षा, ओलावृष्टि अथवा सूखे से क्षतिग्रस्त फसलों के नुकसान का आकलन एवं मुआवजा भुगतान।'
    },
    {
      id: 'SVC-AGR-03',
      title: 'Kisan Credit Card Subsidy (KCC)',
      titleHi: 'किसान क्रेडिट कार्ड ब्याज अनुदान (केसीसी)',
      category: 'AGRICULTURE',
      categoryName: 'Agriculture',
      categoryNameHi: 'कृषि',
      dept: 'Institutional Finance & State Bank',
      deptHi: 'संस्थागत वित्त एवं राज्य बैंक परिषद',
      time: '10 Working Days',
      timeHi: '10 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['kcc', 'kisan credit', 'farm loan', 'low interest', 'fertilizer'],
      desc: 'Low-interest short-term agricultural credit up to ₹3 Lakh at 4% effective interest.',
      descHi: 'किसानों के लिए खाद, बीज व कृषि आवश्यकताओं हेतु ₹3 लाख तक का 4% रियायती अल्पावधि ऋण।'
    },
    {
      id: 'SVC-AGR-04',
      title: 'Soil Health Card Assessment',
      titleHi: 'मृदा स्वास्थ्य कार्ड एवं पोषक तत्व जांच',
      category: 'AGRICULTURE',
      categoryName: 'Agriculture',
      categoryNameHi: 'कृषि',
      dept: 'Soil Conservation & Testing Lab',
      deptHi: 'मृदा परीक्षण प्रयोगशाला एवं कृषि विज्ञान केंद्र',
      time: '7 Working Days',
      timeHi: '7 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['soil card', 'mridha', 'testing', 'fertilizer dose', 'krishi vigyan'],
      desc: 'Nutrient status assessment of agricultural farm soil with fertilizer guidance.',
      descHi: 'खेत की मिट्टी के पोषक तत्वों की वैज्ञानिक जांच एवं संतुलित उर्वरक उपयोग की सिफारिश।'
    },

    // Employment
    {
      id: 'SVC-EMP-01',
      title: 'State Rojgar Sangam Enrolment',
      titleHi: 'राज्य रोजगार संगम सेवायोजन पंजीकरण',
      category: 'EMPLOYMENT',
      categoryName: 'Employment',
      categoryNameHi: 'रोजगार',
      dept: 'Training & Employment Directorate',
      deptHi: 'प्रशिक्षण एवं सेवायोजन निदेशालय',
      time: 'Instant Registration',
      timeHi: 'त्वरित पंजीकरण',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['employment', 'rojgar', 'job seeker', 'placement', 'unemployed', 'jobs'],
      desc: 'Registration in state unemployment exchange for government and private job fairs.',
      descHi: 'राज्य रोजगार कार्यालय में पंजीकरण, रोजगार मेलों एवं कौशल प्लेसमेंट में भाग लेने हेतु।'
    },
    {
      id: 'SVC-EMP-02',
      title: 'PM Kaushal Vikas Yojana (PMKVY)',
      titleHi: 'प्रधानमंत्री कौशल विकास योजना (पीएमकेवीवाई)',
      category: 'EMPLOYMENT',
      categoryName: 'Employment',
      categoryNameHi: 'रोजगार',
      dept: 'Skill Development & Entrepreneurship',
      deptHi: 'कौशल विकास एवं उद्यमिता मिशन',
      time: '5 Working Days',
      timeHi: '5 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['skill', 'kaushal', 'training', 'certificate', 'free course'],
      desc: 'Free industry-relevant skill training courses with government certification and stipend.',
      descHi: 'उद्योग-उन्मुख निःशुल्क कौशल प्रशिक्षण पाठ्यक्रम, सरकारी प्रमाण पत्र एवं स्टाइपेंड सुविधा।'
    },
    {
      id: 'SVC-EMP-03',
      title: 'Youth Apprenticeship Mela (NATS)',
      titleHi: 'राष्ट्रीय शिक्षुता (अप्रेंटिसशिप) मेला',
      category: 'EMPLOYMENT',
      categoryName: 'Employment',
      categoryNameHi: 'रोजगार',
      dept: 'Technical Education Board',
      deptHi: 'प्राविधिक शिक्षा परिषद',
      time: '3 Working Days',
      timeHi: '3 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['apprenticeship', 'diploma', 'trainee', 'stipend', 'internship'],
      desc: 'Paid apprenticeship opportunities with public sector and corporate industry partners.',
      descHi: 'सार्वजनिक एवं निजी उपक्रमों में स्टाइपेंड-युक्त व्यावसायिक शिक्षुता (इंटर्नशिप) के अवसर।'
    },
    {
      id: 'SVC-EMP-04',
      title: 'MSME Self-Employment Loan (PMEGP)',
      titleHi: 'एमएसएमई स्वरोजगार ऋण अनुदान (पीएमईजीपी)',
      category: 'EMPLOYMENT',
      categoryName: 'Employment',
      categoryNameHi: 'रोजगार',
      dept: 'Khadi & Village Industries / MSME',
      deptHi: 'खादी एवं ग्रामोद्योग आयोग / सूक्ष्म एवं लघु उद्योग',
      time: '25 Working Days',
      timeHi: '25 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['msme', 'pmegp', 'business loan', 'subsidy', 'startup', 'loan'],
      desc: 'Credit-linked subsidy loan up to ₹50 Lakh with 15% to 35% margin money subsidy.',
      descHi: 'नया व्यवसाय स्थापित करने हेतु ₹50 लाख तक का बैंक ऋण, जिसमें 15% से 35% तक सरकारी सब्सिडी।'
    },

    // Housing
    {
      id: 'SVC-HOU-01',
      title: 'Pradhan Mantri Awas Yojana (PMAY-G)',
      titleHi: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
      category: 'HOUSING',
      categoryName: 'Housing',
      categoryNameHi: 'आवास',
      dept: 'Rural Development Department',
      deptHi: 'ग्राम्य विकास विभाग',
      time: '30 Working Days',
      timeHi: '30 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['awas', 'house', 'pmay', 'pucca makan', 'housing grant', 'home'],
      desc: '₹1.20 Lakh direct financial assistance in 3 installments to construct a pucca house.',
      descHi: 'कच्चे घरों में रहने वाले निर्धन परिवारों को पक्का मकान निर्माण हेतु ₹1.20 लाख की सीधी सहायता।'
    },
    {
      id: 'SVC-HOU-02',
      title: 'Urban Housing Interest Subsidy (PMAY-U)',
      titleHi: 'प्रधानमंत्री आवास योजना (शहरी ब्याज अनुदान)',
      category: 'HOUSING',
      categoryName: 'Housing',
      categoryNameHi: 'आवास',
      dept: 'Housing & Urban Development',
      deptHi: 'आवास एवं शहरी विकास विभाग',
      time: '20 Working Days',
      timeHi: '20 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['urban house', 'home loan', 'interest subsidy', 'clss', 'flat'],
      desc: 'Interest subvention on home loans for low and middle-income groups in urban areas.',
      descHi: 'शहरी क्षेत्रों में निम्न एवं मध्यम आय वर्ग के परिवारों के गृह ऋण पर ब्याज अनुदान सहायता।'
    },
    {
      id: 'SVC-HOU-03',
      title: 'Land Allotment Patta (Abadi)',
      titleHi: 'स्वामित्व योजना आबादी भूखंड स्वामित्व (घरौनी)',
      category: 'HOUSING',
      categoryName: 'Housing',
      categoryNameHi: 'आवास',
      dept: 'Revenue & Panchayati Raj',
      deptHi: 'राजस्व एवं पंचायती राज विभाग',
      time: '25 Working Days',
      timeHi: '25 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['land', 'patta', 'swamitva', 'registry', 'property card', 'plot'],
      desc: 'Ownership property card (Gharauni) under SVAMITVA scheme for inhabited village land.',
      descHi: 'ग्रामीण आबादी क्षेत्र में आवासीय संपत्तियों के आधिकारिक मालिकाना हक का डिजिटल प्रॉपर्टी कार्ड।'
    },
    {
      id: 'SVC-HOU-04',
      title: 'Sanitation Toilet Incentive (SBM-G)',
      titleHi: 'स्वच्छ भारत मिशन व्यक्तिगत शौचालय प्रोत्साहन',
      category: 'HOUSING',
      categoryName: 'Housing',
      categoryNameHi: 'आवास',
      dept: 'Drinking Water & Sanitation',
      deptHi: 'पेयजल एवं स्वच्छता विभाग',
      time: '14 Working Days',
      timeHi: '14 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['toilet', 'shauchalaya', 'swachh bharat', 'sanitation', 'incentive'],
      desc: '₹12,000 grant for constructing individual household latrines in rural areas.',
      descHi: 'ग्रामीण क्षेत्रों में व्यक्तिगत घरेलू शौचालय निर्माण हेतु ₹12,000 का प्रत्यक्ष प्रोत्साहन अनुदान।'
    },

    // Utilities & Other Services
    {
      id: 'SVC-UTL-01',
      title: 'Driving License Renewal & Duplicate',
      titleHi: 'ड्राइविंग लाइसेंस नवीनीकरण एवं प्रतिलिपि',
      category: 'UTILITIES',
      categoryName: 'Utilities & Others',
      categoryNameHi: 'सुविधाएँ व अन्य',
      dept: 'Transport Department (Sarathi)',
      deptHi: 'परिवहन विभाग (सारथी)',
      time: '7 Working Days',
      timeHi: '7 कार्य दिवस',
      fee: '₹200',
      feeHi: '₹200',
      isOnline: true,
      tags: ['driving license', 'dl', 'rto', 'sarathi', 'renewal', 'transport'],
      desc: 'Online application for DL renewal, address endorsement or duplicate smart card.',
      descHi: 'ड्राइविंग लाइसेंस के नवीनीकरण, पता परिवर्तन अथवा डुप्लिकेट स्मार्ट कार्ड हेतु ऑनलाइन आवेदन।'
    },
    {
      id: 'SVC-UTL-02',
      title: 'Electricity Meter Load Change',
      titleHi: 'विद्युत मीटर भार (लोड) वृद्धि / परिवर्तन',
      category: 'UTILITIES',
      categoryName: 'Utilities & Others',
      categoryNameHi: 'सुविधाएँ व अन्य',
      dept: 'State Power Distribution Corporation (UPPCL)',
      deptHi: 'राज्य विद्युत वितरण निगम लिमिटेड',
      time: '5 Working Days',
      timeHi: '5 कार्य दिवस',
      fee: '₹150',
      feeHi: '₹150',
      isOnline: true,
      tags: ['electricity', 'bijli', 'meter', 'load', 'uppcl', 'power'],
      desc: 'Increase or decrease sanctioned connected electrical load for residential connection.',
      descHi: 'घरेलू अथवा व्यावसायिक विद्युत कनेक्शन के स्वीकृत लोड में वृद्धि अथवा कमी हेतु आवेदन।'
    },
    {
      id: 'SVC-UTL-03',
      title: 'Municipal Water & Sewer Tax Payment',
      titleHi: 'नगर निगम जल एवं सीवर कर भुगतान',
      category: 'UTILITIES',
      categoryName: 'Utilities & Others',
      categoryNameHi: 'सुविधाएँ व अन्य',
      dept: 'Municipal Corporation / Jal Sansthan',
      deptHi: 'नगर निगम / जल संस्थान',
      time: 'Instant Receipt',
      timeHi: 'त्वरित ऑनलाइन रसीद',
      fee: 'As per bill',
      feeHi: 'बिल अनुसार',
      isOnline: true,
      tags: ['water tax', 'sewer', 'nagar nigam', 'jal board', 'utility'],
      desc: 'Online payment of urban local body water dues with instant printable receipt.',
      descHi: 'शहरी स्थानीय निकाय के जल एवं सीवर बिलों का ऑनलाइन भुगतान एवं मुद्रण योग्य रसीद।'
    },
    {
      id: 'SVC-UTL-04',
      title: 'Ration Card Member Addition / Deletion',
      titleHi: 'डिजिटल राशन कार्ड सदस्य जोड़ें / हटाएं',
      category: 'UTILITIES',
      categoryName: 'Utilities & Others',
      categoryNameHi: 'सुविधाएँ व अन्य',
      dept: 'Food & Civil Supplies (FCS-UP)',
      deptHi: 'खाद्य एवं रसद विभाग',
      time: '12 Working Days',
      timeHi: '12 कार्य दिवस',
      fee: 'Free',
      feeHi: 'निःशुल्क',
      isOnline: true,
      tags: ['ration card', 'khorak', 'unit addition', 'ration kota', 'fcs', 'food'],
      desc: 'Add newly married spouse or newborn infant child to family digital ration card.',
      descHi: 'पारिवारिक राशन कार्ड में नवविवाहिता अथवा नवजात शिशु का नाम जोड़ने या स्थानांतरित करने हेतु।'
    }
  ], []);

  // Popular Services (Row of 6) with reliable action handlers
  const popularServices = [
    {
      id: 'pop-1',
      title: isHindi ? 'प्रमाण पत्र आवेदन' : 'Apply for Certificate',
      icon: FileText,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      action: () => {
        showToast(isHindi ? 'प्रमाण पत्र निर्गमन पोर्टल खोला जा रहा है...' : 'Opening Certificate Issuance Portal...');
        if (onNavigateTab) onNavigateTab('certificates');
      }
    },
    {
      id: 'pop-2',
      title: isHindi ? 'प्रोफ़ाइल अपडेट' : 'Update Profile',
      icon: User,
      iconColor: '#16A34A',
      bgColor: '#DCFCE7',
      action: () => {
        showToast(isHindi ? 'नागरिक प्रोफ़ाइल व सेटिंग्स पर जा रहे हैं...' : 'Navigating to Citizen Profile & Settings...');
        if (onNavigateTab) onNavigateTab('settings');
      }
    },
    {
      id: 'pop-3',
      title: isHindi ? 'परिवार सदस्य जोड़ें' : 'Add Family Member',
      icon: Users,
      iconColor: '#EA580C',
      bgColor: '#FFEDD5',
      action: () => {
        showToast(isHindi ? 'परिवार सदस्य पंजीकरण खोला जा रहा है...' : 'Opening Family Member Registration...');
        if (onNavigateTab) onNavigateTab('families');
      }
    },
    {
      id: 'pop-4',
      title: isHindi ? 'दस्तावेज़ अपलोड' : 'Document Upload',
      icon: FolderLock,
      iconColor: '#9333EA',
      bgColor: '#F3E8FF',
      action: () => {
        showToast(isHindi ? 'सुरक्षित दस्तावेज़ वॉलेट खोला जा रहा है...' : 'Opening Encrypted Document Wallet...');
        if (onNavigateTab) onNavigateTab('wallet');
      }
    },
    {
      id: 'pop-5',
      title: isHindi ? 'आवेदन ट्रैक करें' : 'Track Application',
      icon: Search,
      iconColor: '#0284C7',
      bgColor: '#E0F2FE',
      action: () => {
        showToast(isHindi ? 'प्रस्तुत आवेदनों की स्थिति जांची जा रही है...' : 'Tracking Submitted Applications...');
        if (onNavigateTab) onNavigateTab('applications');
      }
    },
    {
      id: 'pop-6',
      title: isHindi ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment',
      icon: Calendar,
      iconColor: '#DC2626',
      bgColor: '#FEE2E2',
      action: () => {
        showToast(isHindi ? 'अपॉइंटमेंट बुकिंग प्रणाली खोली जा रही है...' : 'Opening Appointment Booking System...');
        if (onNavigateTab) onNavigateTab('appointments');
      }
    }
  ];

  // Recent Services used by citizen (Exact 5 items matching official screenshot)
  const recentServices = [
    {
      id: 'rec-1',
      title: 'Caste Certificate',
      titleHi: 'जाति प्रमाण पत्र',
      icon: FileText,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      statusText: 'Application Submitted • 12 Oct 2026',
      statusTextHi: 'आवेदन प्रस्तुत • 12 अक्टूबर 2026',
      statusType: 'PENDING'
    },
    {
      id: 'rec-2',
      title: 'Ration Card',
      titleHi: 'राशन कार्ड',
      icon: Users,
      iconColor: '#16A34A',
      bgColor: '#DCFCE7',
      statusText: '● Approved • 05 Oct 2026',
      statusTextHi: '● स्वीकृत • 05 अक्टूबर 2026',
      statusType: 'SUCCESS'
    },
    {
      id: 'rec-3',
      title: 'Ayushman Bharat Card',
      titleHi: 'आयुष्मान भारत कार्ड',
      icon: Heart,
      iconColor: '#EF4444',
      bgColor: '#FEE2E2',
      statusText: 'In Progress • 28 Sep 2026',
      statusTextHi: 'प्रगति पर • 28 सितंबर 2026',
      statusType: 'PENDING'
    },
    {
      id: 'rec-4',
      title: 'Voter ID',
      titleHi: 'मतदाता पहचान पत्र (वोटर आईडी)',
      icon: ShieldCheck,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      statusText: '● Application in Progress • 20 Sep 2026',
      statusTextHi: '● आवेदन प्रक्रियाधीन • 20 सितंबर 2026',
      statusType: 'PENDING'
    },
    {
      id: 'rec-5',
      title: 'Income Certificate',
      titleHi: 'आय प्रमाण पत्र',
      icon: FileCheck,
      iconColor: '#D97706',
      bgColor: '#FEF3C7',
      statusText: 'Draft Saved • 10 Sep 2026',
      statusTextHi: 'प्रारूप सहेजा गया • 10 सितंबर 2026',
      statusType: 'DRAFT'
    }
  ];

  // Frequently Used Citizen Services
  const frequentServices = [
    {
      id: 'frq-1',
      title: 'Income Certificate (Aay)',
      titleHi: 'आय प्रमाण पत्र (आय)',
      icon: FileText,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      statusText: 'Verified Revenue Record',
      statusTextHi: 'सत्यापित राजस्व रिकॉर्ड',
      statusType: 'SUCCESS'
    },
    {
      id: 'frq-2',
      title: 'Ration Card Member Addition',
      titleHi: 'राशन कार्ड सदस्य जोड़ें',
      icon: Users,
      iconColor: '#9333EA',
      bgColor: '#F3E8FF',
      statusText: 'NFSA Household Active',
      statusTextHi: 'एनएफएसए परिवार सक्रिय',
      statusType: 'SUCCESS'
    },
    {
      id: 'frq-3',
      title: 'PM-KISAN DBT Verification',
      titleHi: 'पीएम-किसान डीबीटी सत्यापन',
      icon: Sprout,
      iconColor: '#16A34A',
      bgColor: '#DCFCE7',
      statusText: '₹2,000 Installment Credited',
      statusTextHi: '₹2,000 किस्त जमा',
      statusType: 'SUCCESS'
    },
    {
      id: 'frq-4',
      title: 'Municipal Water Tax Payment',
      titleHi: 'नगर निगम जल कर भुगतान',
      icon: CheckCircle2,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      statusText: 'Annual Dues Cleared',
      statusTextHi: 'वार्षिक देय राशि चुकता',
      statusType: 'SUCCESS'
    }
  ];

  // All Services Categories (8 Large Grid Tiles)
  const allServiceCategories = useMemo(() => [
    {
      id: 'IDENTITY',
      title: 'Identity & Documents',
      titleHi: 'पहचान व दस्तावेज़',
      subtitle: 'Certificates, ID cards and profile services',
      subtitleHi: 'प्रमाण पत्र, पहचान पत्र एवं प्रोफ़ाइल सेवाएँ',
      icon: FileText,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      services: ['Domicile Certificate', 'Income Certificate', 'Caste Certificate', 'Birth & Death Registration', 'Digital ID Updates'],
      servicesHi: ['मूल निवास प्रमाण पत्र', 'आय प्रमाण पत्र', 'जाति प्रमाण पत्र', 'जन्म एवं मृत्यु पंजीकरण', 'डिजिटल आईडी अपडेट']
    },
    {
      id: 'EDUCATION',
      title: 'Education',
      titleHi: 'शिक्षा',
      subtitle: 'Scholarships and education services',
      subtitleHi: 'छात्रवृत्ति एवं शैक्षणिक सेवाएँ',
      icon: GraduationCap,
      iconColor: '#0284C7',
      bgColor: '#E0F2FE',
      services: ['Pre-Matric Scholarship', 'Post-Matric Fee Reimbursement', 'Merit Student Grant', 'Hostel Admission Quota'],
      servicesHi: ['पूर्व-दशम छात्रवृत्ति', 'दशमोत्तर शुल्क प्रतिपूर्ति', 'मेधावी छात्र प्रोत्साहन', 'छात्रावास प्रवेश कोटा']
    },
    {
      id: 'HEALTH',
      title: 'Health',
      titleHi: 'स्वास्थ्य',
      subtitle: 'Health cards and hospital services',
      subtitleHi: 'स्वास्थ्य कार्ड एवं अस्पताल सेवाएँ',
      icon: Heart,
      iconColor: '#EF4444',
      bgColor: '#FEE2E2',
      services: ['Ayushman Bharat PM-JAY Card', 'Government Hospital OPD Booking', 'Mother & Child Care Grants', 'Immunization Registry'],
      servicesHi: ['आयुष्मान भारत पीएम-जेएवाई कार्ड', 'सरकारी अस्पताल ओपीडी बुकिंग', 'मातृ व शिशु कल्याण सहायता', 'बाल टीकाकरण पंजीयन']
    },
    {
      id: 'WELFARE',
      title: 'Social Welfare',
      titleHi: 'सामाजिक कल्याण',
      subtitle: 'Pension schemes and welfare benefits',
      subtitleHi: 'पेंशन योजनाएं एवं कल्याणकारी लाभ',
      icon: Users,
      iconColor: '#9333EA',
      bgColor: '#F3E8FF',
      services: ['Old Age Pension', 'Widow Pension Support', 'Divyang Disability Allowance', 'National Family Benefit Scheme'],
      servicesHi: ['वृद्धावस्था पेंशन', 'विधवा पेंशन सहायता', 'दिव्यांग पेंशन व सहायक उपकरण', 'राष्ट्रीय पारिवारिक लाभ योजना']
    },
    {
      id: 'AGRICULTURE',
      title: 'Agriculture',
      titleHi: 'कृषि',
      subtitle: 'Farmer registration and crop services',
      subtitleHi: 'किसान पंजीकरण एवं फसल सेवाएँ',
      icon: Sprout,
      iconColor: '#16A34A',
      bgColor: '#DCFCE7',
      services: ['PM-KISAN DBT Verification', 'Fasal Bima Claim', 'Kisan Credit Card Subsidy', 'Soil Health Card Assessment'],
      servicesHi: ['पीएम-किसान डीबीटी सत्यापन', 'फसल बीमा दावा', 'किसान क्रेडिट कार्ड सब्सिडी', 'मृदा स्वास्थ्य कार्ड जांच']
    },
    {
      id: 'EMPLOYMENT',
      title: 'Employment',
      titleHi: 'रोजगार',
      subtitle: 'Job search and skill development',
      subtitleHi: 'रोजगार खोज एवं कौशल विकास',
      icon: Briefcase,
      iconColor: '#D97706',
      bgColor: '#FEF3C7',
      services: ['State Rojgar Sangam Enrolment', 'PM Kaushal Vikas Yojana', 'Youth Apprenticeship Mela', 'MSME Self-Employment Loan'],
      servicesHi: ['राज्य रोजगार संगम पंजीकरण', 'पीएम कौशल विकास योजना', 'शिक्षुता (अप्रेंटिसशिप) मेला', 'एमएसएमई स्वरोजगार ऋण']
    },
    {
      id: 'HOUSING',
      title: 'Housing',
      titleHi: 'आवास',
      subtitle: 'Housing schemes and applications',
      subtitleHi: 'आवास योजनाएं एवं आवेदन',
      icon: HomeIcon,
      iconColor: '#0D9488',
      bgColor: '#CCFBF1',
      services: ['Pradhan Mantri Awas Yojana (PMAY-G)', 'Urban Housing Subsidy', 'Land Allotment Patta', 'Sanitation Toilet Incentive'],
      servicesHi: ['प्रधानमंत्री आवास योजना (ग्रामीण)', 'शहरी आवास ब्याज सब्सिडी', 'आबादी भूखंड स्वामित्व (घरौनी)', 'शौचालय प्रोत्साहन अनुदान']
    },
    {
      id: 'UTILITIES',
      title: 'Utilities & Other Services',
      titleHi: 'सुविधाएँ व अन्य सेवाएँ',
      subtitle: 'Electricity, water, transport and more',
      subtitleHi: 'विद्युत, जल, परिवहन एवं अन्य नागरिक सेवाएँ',
      icon: SettingsIcon,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
      services: ['Driving License Renewal', 'Electricity Meter Load Change', 'Municipal Water Tax', 'Ration Card Member Addition'],
      servicesHi: ['ड्राइविंग लाइसेंस नवीनीकरण', 'विद्युत मीटर लोड परिवर्तन', 'नगर निगम जल कर', 'राशन कार्ड सदस्य जोड़ें']
    }
  ], []);

  // Filter service categories by search and pill
  const filteredCategories = useMemo(() => {
    let list = allServiceCategories;

    if (activeCategory !== 'ALL') {
      list = list.filter((c) => c.id === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.titleHi && c.titleHi.toLowerCase().includes(q)) ||
          c.subtitle.toLowerCase().includes(q) ||
          (c.subtitleHi && c.subtitleHi.toLowerCase().includes(q)) ||
          c.services.some((s) => s.toLowerCase().includes(q)) ||
          (c.servicesHi && c.servicesHi.some((s) => s.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [allServiceCategories, activeCategory, searchQuery]);

  // Real-time Search Results & Filtered Individual Services
  const filteredIndividualServices = useMemo(() => {
    let list = allIndividualServices;

    if (activeCategory !== 'ALL') {
      list = list.filter((s) => s.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.titleHi && s.titleHi.toLowerCase().includes(q)) ||
          s.dept.toLowerCase().includes(q) ||
          (s.deptHi && s.deptHi.toLowerCase().includes(q)) ||
          s.categoryName.toLowerCase().includes(q) ||
          (s.categoryNameHi && s.categoryNameHi.toLowerCase().includes(q)) ||
          s.desc.toLowerCase().includes(q) ||
          (s.descHi && s.descHi.toLowerCase().includes(q)) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allIndividualServices, activeCategory, searchQuery]);

  // Submit Application Handler
  const handleApplyServiceSubmit = (e) => {
    e.preventDefault();
    if (!applyServiceModal) return;
    setIsSubmittingApp(true);
    setTimeout(() => {
      setIsSubmittingApp(false);
      const svcName = isHindi ? (applyServiceModal.titleHi || applyServiceModal.title) : applyServiceModal.title;
      showToast(isHindi 
        ? `"${svcName}" के लिए आवेदन सफलतापूर्वक प्रस्तुत किया गया। संदर्भ आईडी: APP-2026-${Math.floor(1000 + Math.random() * 9000)}` 
        : `Application successfully submitted for "${applyServiceModal.title}". Reference ID: APP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setApplyServiceModal(null);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', width: '100%', maxWidth: '1440px', margin: '0 auto', boxSizing: 'border-box' }}>
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
        background: '#FFFFFF',
        width: '100%',
        boxSizing: 'border-box'
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
            <span style={{ color: '#0F172A', fontWeight: 600 }}>{isHindi ? 'सेवाएँ' : 'Services'}</span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'सरकारी सेवाएँ' : 'Services'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'नागरिक सरकारी सेवाएँ, सभी एक ही स्थान पर।' : 'Access government services, all in one place.'}
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
              <>&ldquo;आपकी सेवाएँ<br />आपकी पहचान<br />सशक्त भारत&rdquo;</>
            ) : (
              <>&ldquo;Your Services<br />Your Identity<br />A Stronger India&rdquo;</>
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
             Left/Center (72%): Search + Category Pills + Popular Services + All Services
             Right Sidebar (28%): My Services + Quick Actions + Need Help
          ========================================================= */}
      <div
        className="dashboard-two-column-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2.35fr) minmax(280px, 1fr)',
          gap: '1.25rem',
          alignItems: 'start',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* =======================================================
            LEFT COLUMN
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
          {/* Search Bar + Category Pills Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}>
            {/* Search Input Bar with Clear Button & Active Counter */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
              <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '0.55rem 0.95rem'
              }}>
                <Search size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'सेवा खोजें (जैसे प्रमाण पत्र आवेदन, पता अपडेट, राशन कार्ड...)' : 'Search for a service (e.g. apply for certificate, update address, ration card...)'}
                  style={{
                    width: '100%',
                    minWidth: 0,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: '#0F172A',
                    background: 'transparent'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: '#F1F5F9',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748B',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (searchQuery.trim()) {
                    showToast(isHindi ? `"${searchQuery}" के लिए ${filteredIndividualServices.length} सेवाएँ मिलीं` : `Found ${filteredIndividualServices.length} matching services for "${searchQuery}"`);
                  } else {
                    showToast(isHindi ? 'सभी विभागों की कुल 32 नागरिक सेवाएँ दिखाई जा रही हैं' : 'Displaying all 32 citizen services across all departments');
                  }
                }}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem 1.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  transition: 'background 0.15s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
              >
                {isHindi ? 'खोजें' : 'Search'}
              </button>
            </div>

            {/* Horizontal Category Pills matching screenshot */}
            <div
              className="services-pill-scroll"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                overflowX: 'auto',
                paddingBottom: '0.25rem',
                width: '100%',
                minWidth: 0,
                scrollbarWidth: 'thin'
              }}
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = cat.id === 'ALL'
                  ? allIndividualServices.length
                  : allIndividualServices.filter((s) => s.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      background: isActive ? '#2563EB' : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : '#475569',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#E2E8F0';
                        e.currentTarget.style.color = '#0F172A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#F1F5F9';
                        e.currentTarget.style.color = '#475569';
                      }
                    }}
                  >
                    <span>{cat.label}</span>
                    <span style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                      color: isActive ? '#FFFFFF' : '#64748B',
                      fontSize: '0.68rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '9999px',
                      fontWeight: 700
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =======================================================
              SEARCH RESULTS HIGHLIGHT (IF USER IS SEARCHING)
              ======================================================= */}
          {searchQuery.trim() && (
            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Search size={16} color="#2563EB" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E40AF' }}>
                    {isHindi 
                      ? `खोज परिणाम (“${searchQuery}” के लिए ${filteredIndividualServices.length} सेवाएँ मिलीं)`
                      : `Search Results (${filteredIndividualServices.length} services found for “${searchQuery}”)`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563EB',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  {isHindi ? 'खोज साफ़ करें ✕' : 'Clear Search ✕'}
                </button>
              </div>

              {filteredIndividualServices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#64748B', fontSize: '0.85rem' }}>
                  {isHindi 
                    ? `“${searchQuery}” से मेल खाती कोई सेवा नहीं मिली। कृपया अन्य शब्द खोजें या ऊपर दी गई श्रेणी चुनें।`
                    : `No services found matching “${searchQuery}”. Try another term or choose a category above.`}
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '0.75rem',
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box'
                }}>
                  {filteredIndividualServices.slice(0, 6).map((svc) => (
                    <div
                      key={svc.id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #DBEAFE',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                          {isHindi ? (svc.titleHi || svc.title) : svc.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                          {isHindi ? (svc.deptHi || svc.dept) : svc.dept} • <span style={{ color: '#16A34A', fontWeight: 600 }}>{isHindi ? (svc.timeHi || svc.time) : svc.time}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setApplyServiceModal(svc)}
                        style={{
                          background: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.35rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {isHindi ? 'अभी आवेदन करें →' : 'Apply Now →'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =======================================================
              POPULAR SERVICES SECTION (Row of 6 Cards)
              ======================================================= */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Star size={16} color="#EAB308" fill="#EAB308" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'लोकप्रिय सेवाएँ' : 'Popular Services'}
                </h3>
              </div>
            </div>

            {/* 6 Horizontal Popular Service Cards matching reference screenshot */}
            <div
              className="services-popular-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                gap: '0.75rem',
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              {popularServices.map((service) => {
                const IconComponent = service.icon;

                return (
                  <div
                    key={service.id}
                    onClick={service.action}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '0.85rem 0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '88px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                      transition: 'all 0.2s ease',
                      minWidth: 0,
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.02)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        background: service.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComponent size={17} color={service.iconColor} />
                      </div>
                      <ChevronRight size={13} color="#94A3B8" />
                    </div>

                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      lineHeight: 1.25,
                      marginTop: '0.5rem',
                      textAlign: 'left'
                    }}>
                      {service.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =======================================================
              ALL SERVICES SECTION (Category Tiles OR All 32 Services Grid)
              ======================================================= */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <LayoutGrid size={16} color="#2563EB" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'सभी सेवाएँ' : 'All Services'}
                </h3>
                <span style={{
                  background: '#EFF6FF',
                  color: '#2563EB',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px'
                }}>
                  {filteredIndividualServices.length} {isHindi ? 'उपलब्ध' : 'Available'}
                </span>
              </div>

              {/* View Toggle between Category Tiles & All 32 Individual Services */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F1F5F9', padding: '0.2rem', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCatalogDisplayMode('CATEGORIES')}
                  style={{
                    background: catalogDisplayMode === 'CATEGORIES' ? '#FFFFFF' : 'transparent',
                    color: catalogDisplayMode === 'CATEGORIES' ? '#2563EB' : '#64748B',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: catalogDisplayMode === 'CATEGORIES' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  {isHindi ? 'श्रेणी दृश्य (8)' : 'Category View (8)'}
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogDisplayMode('ALL_LIST')}
                  style={{
                    background: catalogDisplayMode === 'ALL_LIST' ? '#FFFFFF' : 'transparent',
                    color: catalogDisplayMode === 'ALL_LIST' ? '#2563EB' : '#64748B',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: catalogDisplayMode === 'ALL_LIST' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  {isHindi ? 'सभी 32 सेवाओं की सूची' : 'All 32 Services Catalog'}
                </button>
              </div>
            </div>

            {/* Display Mode 1: 8 Categories Grid */}
            {catalogDisplayMode === 'CATEGORIES' ? (
              <div
                className="services-categories-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '0.85rem',
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box'
                }}
              >
                {filteredCategories.map((cat) => {
                  const IconComponent = cat.icon;
                  const catServicesCount = allIndividualServices.filter((s) => s.category === cat.id).length;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedServiceModal(cat)}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        padding: '1.15rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                        transition: 'all 0.2s ease',
                        minWidth: 0,
                        boxSizing: 'border-box'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = '#2563EB';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.02)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: cat.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <IconComponent size={20} color={cat.iconColor} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A' }}>
                              {isHindi ? (cat.titleHi || cat.title) : cat.title}
                            </span>
                            <span style={{
                              background: '#F1F5F9',
                              color: '#64748B',
                              fontSize: '0.65rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '9999px',
                              fontWeight: 700
                            }}>
                              {catServicesCount || cat.services.length} {isHindi ? 'सेवाएँ' : 'services'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                            {isHindi ? (cat.subtitleHi || cat.subtitle) : cat.subtitle}
                          </div>
                        </div>
                      </div>

                      <ChevronRight size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Display Mode 2: Full Catalog of all 32 Individual Services with Details and Apply buttons */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.85rem',
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box'
              }}>
                {filteredIndividualServices.map((service) => (
                  <div
                    key={service.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '1rem 1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.65rem',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.02)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: '#2563EB',
                            background: '#EFF6FF',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginBottom: '0.3rem'
                          }}>
                            {isHindi ? (service.categoryNameHi || service.categoryName) : service.categoryName}
                          </span>
                          <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                            {isHindi ? (service.titleHi || service.title) : service.title}
                          </h4>
                        </div>

                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: '#16A34A',
                          background: '#DCFCE7',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          whiteSpace: 'nowrap'
                        }}>
                          {isHindi ? (service.feeHi || service.fee) : service.fee}
                        </span>
                      </div>

                      <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>
                        {isHindi ? (service.descHi || service.desc) : service.desc}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '0.55rem',
                      marginTop: '0.2rem'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        ⏳ <strong style={{ color: '#0F172A' }}>{isHindi ? (service.timeHi || service.time) : service.time}</strong> • {isHindi ? ((service.deptHi || service.dept).split('(')[0].trim()) : service.dept.split('(')[0].trim()}
                      </div>

                      <button
                        type="button"
                        onClick={() => setApplyServiceModal(service)}
                        style={{
                          background: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.35rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                      >
                        <span>{isHindi ? 'आवेदन करें' : 'Apply'}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =======================================================
            RIGHT COLUMN: 3 WIDGETS
            1. My Services (Recent / Frequently Used)
            2. Quick Actions
            3. Need Help?
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
          {/* 1. MY SERVICES */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Clock size={16} color="#2563EB" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'मेरी सेवाएँ' : 'My Services'}
                </h3>
              </div>
              <span
                onClick={() => onNavigateTab && onNavigateTab('applications')}
                style={{ fontSize: '0.725rem', fontWeight: 700, color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.15rem' }}
              >
                {isHindi ? 'सभी देखें' : 'View All'} <ChevronRight size={13} />
              </span>
            </div>

            {/* Sub-tabs: Recent vs Frequently Used */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '0.85rem' }}>
              <button
                type="button"
                onClick={() => setMyServicesTab('RECENT')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.45rem 0.65rem 0.55rem',
                  fontSize: '0.775rem',
                  fontWeight: myServicesTab === 'RECENT' ? 800 : 600,
                  color: myServicesTab === 'RECENT' ? '#2563EB' : '#64748B',
                  borderBottom: myServicesTab === 'RECENT' ? '2px solid #2563EB' : 'none',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'हालिया' : 'Recent'}
              </button>
              <button
                type="button"
                onClick={() => setMyServicesTab('FREQUENT')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.45rem 0.65rem 0.55rem',
                  fontSize: '0.775rem',
                  fontWeight: myServicesTab === 'FREQUENT' ? 800 : 600,
                  color: myServicesTab === 'FREQUENT' ? '#2563EB' : '#64748B',
                  borderBottom: myServicesTab === 'FREQUENT' ? '2px solid #2563EB' : 'none',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'अक्सर प्रयुक्त' : 'Frequently Used'}
              </button>
            </div>

            {/* List Items matching screenshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', minWidth: 0 }}>
              {(myServicesTab === 'RECENT' ? recentServices : frequentServices).map((service) => {
                const IconComponent = service.icon;

                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      showToast(isHindi ? `${service.titleHi || service.title} का विवरण खोला जा रहा है...` : `Opening details for ${service.title}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.35rem 0.25rem',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      minWidth: 0,
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: service.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComponent size={16} color={service.iconColor} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {isHindi ? (service.titleHi || service.title) : service.title}
                        </div>
                        <div style={{
                          fontSize: '0.68rem',
                          color: service.statusType === 'SUCCESS' ? '#16A34A' : '#64748B',
                          fontWeight: service.statusType === 'SUCCESS' ? 700 : 500,
                          marginTop: '0.1rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {isHindi ? (service.statusTextHi || service.statusText) : service.statusText}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. QUICK ACTIONS */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <Zap size={16} color="#EAB308" fill="#EAB308" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'त्वरित कार्रवाइयां' : 'Quick Actions'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', width: '100%', minWidth: 0 }}>
              {[
                { label: isHindi ? 'प्रमाण पत्र हेतु आवेदन' : 'Apply for a Certificate', icon: FileText, color: '#2563EB', action: () => onNavigateTab && onNavigateTab('certificates') },
                { label: isHindi ? 'आवेदन ट्रैक करें' : 'Track Application', icon: FileCheck, color: '#16A34A', action: () => onNavigateTab && onNavigateTab('applications') },
                { label: isHindi ? 'अपॉइंटमेंट बुक करें' : 'Book an Appointment', icon: Calendar, color: '#DC2626', action: () => onNavigateTab && onNavigateTab('appointments') },
                { label: isHindi ? 'भुगतान करें' : 'Make a Payment', icon: CreditCard, color: '#0284C7', action: () => onNavigateTab && onNavigateTab('payments') }
              ].map((item, idx) => {
                const IconComp = item.icon;

                return (
                  <div
                    key={idx}
                    onClick={item.action}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.45rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      minWidth: 0
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComp size={14} color={item.color} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. NEED HELP? */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.45rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Headphones size={16} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'सहायता चाहिए?' : 'Need Help?'}
              </h3>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4, margin: '0 0 0.85rem 0' }}>
              {isHindi ? 'अपनी सेवाओं और आवेदनों के लिए सहायता प्राप्त करें।' : 'Get support for your services and applications.'}
            </p>

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('support')}
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
              <span>{isHindi ? 'सहायता केंद्र पर जाएँ' : 'Visit Help Center'}</span>
              <span style={{ fontSize: '0.85rem' }}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          MODAL: SERVICE CATEGORY DETAILS
          ========================================================= */}
      {selectedServiceModal && (
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
                  {isHindi ? (selectedServiceModal.titleHi || selectedServiceModal.title) : selectedServiceModal.title}
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {isHindi ? (selectedServiceModal.subtitleHi || selectedServiceModal.subtitle) : selectedServiceModal.subtitle}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedServiceModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
                {isHindi ? 'इस विभाग में उपलब्ध सेवाएँ:' : 'AVAILABLE SERVICES IN THIS DEPARTMENT:'}
              </div>

              {(isHindi && selectedServiceModal.servicesHi ? selectedServiceModal.servicesHi : selectedServiceModal.services).map((svc, i) => (
                <div
                  key={i}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                      {svc}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 600 }}>
                      {isHindi ? '● ऑनलाइन सेवा • निःशुल्क' : '● Online Service • Free of Cost'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(isHindi ? `सेवा आवेदन प्रारंभ: ${svc}` : `Service application initiated for: ${svc}`);
                      setSelectedServiceModal(null);
                    }}
                    style={{
                      background: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? 'अभी आवेदन करें →' : 'Apply Now →'}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ padding: '0.85rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setSelectedServiceModal(null)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: APPLY FOR SERVICE DIALOG
          ========================================================= */}
      {applyServiceModal && (
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
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
              color: '#FFFFFF',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{
                  background: 'rgba(255,255,255,0.15)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '0.25rem'
                }}>
                  {isHindi ? (applyServiceModal.categoryNameHi || applyServiceModal.categoryName) : applyServiceModal.categoryName} • ID: {applyServiceModal.id}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                  {isHindi ? `${applyServiceModal.titleHi || applyServiceModal.title} हेतु आवेदन` : `Apply for ${applyServiceModal.title}`}
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                  {isHindi ? (applyServiceModal.deptHi || applyServiceModal.dept) : applyServiceModal.dept}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setApplyServiceModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplyServiceSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Pre-filled applicant details badge */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                fontSize: '0.78rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.45rem'
              }}>
                <div>{isHindi ? 'आवेदक:' : 'Applicant:'} <strong style={{ color: '#0F172A' }}>{user?.name || (isHindi ? 'पंकज कुमार' : 'Pankaj Kumar')}</strong></div>
                <div>{isHindi ? 'जन पहचान आईडी:' : 'Jan Pehchaan ID:'} <strong style={{ color: '#2563EB' }}>JP-2026-99214</strong></div>
                <div>{isHindi ? 'अनुमानित समय:' : 'Estimated Turnaround:'} <strong style={{ color: '#16A34A' }}>{isHindi ? (applyServiceModal.timeHi || applyServiceModal.time) : applyServiceModal.time}</strong></div>
                <div>{isHindi ? 'सरकारी शुल्क:' : 'Government Fee:'} <strong style={{ color: '#0F172A' }}>{isHindi ? (applyServiceModal.feeHi || applyServiceModal.fee) : applyServiceModal.fee}</strong></div>
              </div>

              {/* Description */}
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                {isHindi ? (applyServiceModal.descHi || applyServiceModal.desc) : applyServiceModal.desc}
              </p>

              {/* Remarks */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'आवेदक टिप्पणी / आवेदन का उद्देश्य' : 'Applicant Notes / Purpose of Application'}
                </label>
                <textarea
                  rows={3}
                  value={applyForm.remarks}
                  onChange={(e) => setApplyForm({ ...applyForm, remarks: e.target.value })}
                  placeholder={isHindi ? 'उल्लेख करें कि यह प्रमाण पत्र/सेवा किस उद्देश्य से आवश्यक है (जैसे कॉलेज प्रवेश, नौकरी आवेदन)...' : 'Mention why this certificate/service is required (e.g. college admission, job application)...'}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.8rem',
                    color: '#0F172A',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Consent Checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={applyForm.consent}
                  onChange={(e) => setApplyForm({ ...applyForm, consent: e.target.checked })}
                  style={{ marginTop: '2px', accentColor: '#2563EB', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.35 }}>
                  {isHindi 
                    ? `मैं ${(applyServiceModal.deptHi || applyServiceModal.dept)} द्वारा स्वचालित सत्यापन हेतु अपने सत्यापित आधार एवं दस्तावेज़ वॉलेट प्रमाण पत्रों को लिंक करने की सहमति देता/देती हूँ।`
                    : `I consent to linking my verified Aadhaar and Document Wallet certificates for automated verification by ${applyServiceModal.dept}.`}
                </span>
              </label>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setApplyServiceModal(null)}
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
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingApp || !applyForm.consent}
                  style={{
                    background: isSubmittingApp || !applyForm.consent ? '#94A3B8' : '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1.5rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: isSubmittingApp || !applyForm.consent ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {isSubmittingApp 
                    ? (isHindi ? 'आवेदन प्रस्तुत किया जा रहा है...' : 'Submitting Application...') 
                    : (isHindi ? 'पुष्टि करें व आवेदन प्रस्तुत करें →' : 'Confirm & Submit Application →')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesTab;
