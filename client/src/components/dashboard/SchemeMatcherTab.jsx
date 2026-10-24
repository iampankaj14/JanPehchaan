import React, { useState, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  Sprout,
  Heart,
  GraduationCap,
  Home,
  Users2,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Target,
  Landmark,
  Building2,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  UserCheck,
  Users,
  Clock,
  Download
} from 'lucide-react';

export function SchemeMatcherTab({
  families = [],
  initialFamilyId,
  onApplyScheme,
  onNavigateTab,
  currentLang = 'en'
}) {
  const isHindi = currentLang === 'hi';
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState(null);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(initialFamilyId || families[0]?.id || 'FAM-101');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Categories definition matching reference image pills
  const categories = [
    { id: 'ALL', label: isHindi ? 'सभी योजनाएँ' : 'All Schemes', icon: LayoutGrid },
    { id: 'AGRICULTURE', label: isHindi ? 'कृषि' : 'Agriculture', icon: Sprout, color: '#16A34A' },
    { id: 'HEALTH', label: isHindi ? 'स्वास्थ्य' : 'Health', icon: Heart, color: '#EF4444' },
    { id: 'EDUCATION', label: isHindi ? 'शिक्षा' : 'Education', icon: GraduationCap, color: '#2563EB' },
    { id: 'HOUSING', label: isHindi ? 'आवास' : 'Housing', icon: Home, color: '#EA580C' },
    { id: 'WOMEN_CHILD', label: isHindi ? 'महिला व बाल विकास' : 'Women & Child', icon: Users2, color: '#E11D48' },
    { id: 'SOCIAL_SECURITY', label: isHindi ? 'सामाजिक सुरक्षा' : 'Social Security', icon: ShieldCheck, color: '#7E22CE' },
    { id: 'EMPLOYMENT', label: isHindi ? 'रोजगार' : 'Employment', icon: Briefcase, color: '#0D9488' }
  ];

  // All 6 core schemes matching reference image + employment schemes
  const allSchemes = [
    {
      id: 'SCH-01',
      title: 'PM-KISAN',
      titleHi: 'पीएम-किसान सम्मान निधि',
      fullName: 'Pradhan Mantri Kisan Samman Nidhi',
      fullNameHi: 'प्रधानमंत्री किसान सम्मान निधि योजना',
      image: '/assets/scheme_pm_kisan.jpg',
      category: 'AGRICULTURE',
      categoryLabel: 'Agriculture',
      categoryLabelHi: 'कृषि',
      categoryBg: '#EFF6FF',
      categoryColor: '#2563EB',
      benefitTag: '₹6,000 per year',
      benefitTagHi: '₹6,000 प्रति वर्ष',
      description: 'Direct income support to farmers for a better tomorrow.',
      descriptionHi: 'किसानों के सुनहरे भविष्य हेतु प्रत्यक्ष वार्षिक आय सहायता।',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      ministryHi: 'कृषि एवं किसान कल्याण मंत्रालय',
      floatingIcon: Sprout,
      floatingIconColor: '#16A34A',
      floatingIconBg: '#DCFCE7',
      popularRank: 1,
      popularSubtitle: 'Direct income support to farmers',
      popularSubtitleHi: 'किसानों हेतु प्रत्यक्ष आय सहायता',
      eligibility: [
        'Small and marginal farmer households with cultivable agricultural land up to 2.0 hectares.',
        'Aadhaar seeded bank account with Direct Benefit Transfer (DBT) enabled.',
        'No institutional landholders or serving/retired government officers.'
      ],
      eligibilityHi: [
        'छोटे और सीमांत किसान परिवार जिनके पास 2.0 हेक्टेयर तक की कृषि योग्य भूमि है।',
        'प्रत्यक्ष लाभ अंतरण (डीबीटी) सक्रिय आधार-लिंक्ड बैंक खाता।',
        'संस्थागत भूस्वामी अथवा सेवारत/सेवानिवृत्त सरकारी अधिकारी इसमें शामिल नहीं हैं।'
      ],
      documents: ['Aadhaar Card', 'Land Ownership Records (Khatauni / Khasra)', 'Active DBT Bank Passbook', 'Mobile Number'],
      documentsHi: ['आधार कार्ड', 'भूमि स्वामित्व अभिलेख (खतौनी / खसरा)', 'सक्रिय डीबीटी बैंक पासबुक', 'मोबाइल नंबर'],
      stats: '11.8+ Crore Farmers Benefited • ₹2.6+ Lakh Crore Disbursed',
      statsHi: '11.8+ करोड़ से अधिक किसान लाभान्वित • ₹2.6+ लाख करोड़ अंतरित'
    },
    {
      id: 'SCH-02',
      title: 'Ayushman Bharat',
      titleHi: 'आयुष्मान भारत (पीएम-जेएवाई)',
      fullName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
      fullNameHi: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (पीएम-जेएवाई)',
      image: '/assets/scheme_ayushman.jpg',
      category: 'HEALTH',
      categoryLabel: 'Health',
      categoryLabelHi: 'स्वास्थ्य',
      categoryBg: '#FEE2E2',
      categoryColor: '#DC2626',
      benefitTag: '₹5,00,000 coverage',
      benefitTagHi: '₹5,00,000 स्वास्थ्य कवर',
      description: 'Free healthcare coverage for eligible families up to ₹5 lakh.',
      descriptionHi: 'पात्र परिवारों के लिए प्रति वर्ष ₹5 लाख तक का निःशुल्क कैशलेस अस्पताल उपचार कवर।',
      ministry: 'Ministry of Health and Family Welfare (National Health Authority)',
      ministryHi: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय (राष्ट्रीय स्वास्थ्य प्राधिकरण)',
      floatingIcon: Heart,
      floatingIconColor: '#EF4444',
      floatingIconBg: '#FEE2E2',
      popularRank: 2,
      popularSubtitle: 'Free healthcare for families',
      popularSubtitleHi: 'परिवारों के लिए निःशुल्क स्वास्थ्य उपचार',
      eligibility: [
        'Households identified under SECC 2011 deprivation and occupational criteria.',
        'Valid NFSA state ration card holding families.',
        'All household members covered regardless of family size or senior age.'
      ],
      eligibilityHi: [
        'एसईसीसी 2011 वंचना एवं व्यावसायिक श्रेणी के अंतर्गत सूचीबद्ध निर्धन परिवार।',
        'राष्ट्रीय खाद्य सुरक्षा अधिनियम (एनएफएसए) राशन कार्ड धारक परिवार।',
        'परिवार के आकार या वरिष्ठ आयु सीमा के बिना सभी सदस्य पूर्णतः कवर।'
      ],
      documents: ['Aadhaar Card', 'Ration Card / Jan Pehchaan Family ID', 'Mobile Number linked to Aadhaar'],
      documentsHi: ['आधार कार्ड', 'राशन कार्ड / जन पहचान परिवार आईडी', 'आधार लिंक्ड मोबाइल नंबर'],
      stats: '55+ Crore Beneficiaries • 27,000+ Empaneled Hospitals',
      statsHi: '55+ करोड़ लाभार्थी • 27,000+ सूचीबद्ध अस्पताल'
    },
    {
      id: 'SCH-03',
      title: 'PM Awas Yojana',
      titleHi: 'प्रधानमंत्री आवास योजना',
      fullName: 'Pradhan Mantri Awas Yojana (PMAY - Gramin & Urban)',
      fullNameHi: 'प्रधानमंत्री आवास योजना (ग्रामीण एवं शहरी)',
      image: '/assets/scheme_pm_awas.jpg',
      category: 'HOUSING',
      categoryLabel: 'Housing',
      categoryLabelHi: 'आवास',
      categoryBg: '#FFEDD5',
      categoryColor: '#EA580C',
      benefitTag: 'Subsidy up to ₹2.5 lakh',
      benefitTagHi: '₹2.5 लाख तक अनुदान',
      description: 'Affordable housing support for eligible rural and urban families.',
      descriptionHi: 'ग्रामीण एवं शहरी क्षेत्रों के बेघर परिवारों को पक्के घर निर्माण हेतु वित्तीय सहायता।',
      ministry: 'Ministry of Housing and Urban Affairs & Rural Development',
      ministryHi: 'आवासन और शहरी कार्य मंत्रालय एवं ग्राम्य विकास मंत्रालय',
      floatingIcon: Home,
      floatingIconColor: '#EA580C',
      floatingIconBg: '#FFEDD5',
      popularRank: 3,
      popularSubtitle: 'Affordable housing support',
      popularSubtitleHi: 'पक्के मकान निर्माण हेतु सरकारी सहायता',
      eligibility: [
        'Family does not own a pukka / permanent concrete house anywhere in India.',
        'Economically Weaker Section (EWS) or Low Income Group (LIG) annual income norms.',
        'Financial assistance released directly to DBT bank account in geo-tagged stages.'
      ],
      eligibilityHi: [
        'भारत में कहीं भी परिवार के पास स्वयं का पक्का कंक्रीट मकान नहीं होना चाहिए।',
        'आर्थिक रूप से कमजोर वर्ग (ईडब्ल्यूएस) या निम्न आय वर्ग (एलआईजी) मानदंड।',
        'जियो-टैग्ड चरणों के अनुसार निर्माण राशि सीधे डीबीटी बैंक खाते में हस्तांतरित।'
      ],
      documents: ['Aadhaar Card', 'Income Certificate', 'Land / Site NOC Certificate', 'Bank Account Statement'],
      documentsHi: ['आधार कार्ड', 'आय प्रमाण पत्र', 'भूखंड अनापत्ति प्रमाण पत्र (एनओसी)', 'बैंक खाता विवरण'],
      stats: '3.5+ Crore Houses Sanctioned • Direct Geo-tagged DBT release',
      statsHi: '3.5+ करोड़ पक्के मकान स्वीकृत • सीधे बैंक खाते में किस्तें जारी'
    },
    {
      id: 'SCH-04',
      title: 'Scholarship Schemes',
      titleHi: 'राष्ट्रीय छात्रवृत्ति योजनाएँ',
      fullName: 'National Merit-cum-Means Pre & Post Matric Scholarships',
      fullNameHi: 'राष्ट्रीय मेधा-सह-साधन पूर्व एवं दशमोत्तर छात्रवृत्ति योजना',
      image: '/assets/scheme_scholarship.jpg',
      category: 'EDUCATION',
      categoryLabel: 'Education',
      categoryLabelHi: 'शिक्षा',
      categoryBg: '#EFF6FF',
      categoryColor: '#2563EB',
      benefitTag: 'Varies by scheme',
      benefitTagHi: 'कक्षा अनुसार छात्रवृत्ति',
      description: 'Financial support for school, college and higher education.',
      descriptionHi: 'स्कूली, महाविद्यालयीन एवं तकनीकी उच्च शिक्षा हेतु वित्तीय छात्रवृत्ति सहायता।',
      ministry: 'Ministry of Education & Department of Social Justice',
      ministryHi: 'शिक्षा मंत्रालय एवं सामाजिक न्याय विभाग',
      floatingIcon: GraduationCap,
      floatingIconColor: '#2563EB',
      floatingIconBg: '#EFF6FF',
      popularRank: 4,
      popularSubtitle: 'Support for students',
      popularSubtitleHi: 'विद्यार्थियों के शिक्षण शुल्क हेतु वित्तीय मदद',
      eligibility: [
        'Students actively enrolled in recognized schools, polytechnics, or universities.',
        'Annual household family income ceiling under ₹2,50,000.',
        'Minimum 50% aggregate marks in previous qualifying board examinations.'
      ],
      eligibilityHi: [
        'मान्यता प्राप्त विद्यालय, पॉलिटेक्निक अथवा विश्वविद्यालय में नियमित नामांकित विद्यार्थी।',
        'परिवार की वार्षिक सकल आय सीमा ₹2,50,000 से कम।',
        'पिछली उत्तीर्ण परीक्षा में न्यूनतम 50% प्राप्तांक आवश्यक।'
      ],
      documents: ['Student Aadhaar', 'Previous Marksheet', 'Bonafide Student Certificate', 'Income Certificate'],
      documentsHi: ['छात्र का आधार कार्ड', 'गत वर्ष की अंकतालिका', 'संस्थान प्रमाण पत्र (बोनाफाइड)', 'आय प्रमाण पत्र'],
      stats: '1.2+ Crore Students Awarded • Directly Credited to Student DBT',
      statsHi: '1.2+ करोड़ छात्र लाभान्वित • सीधे विद्यार्थी के बैंक खाते में जमा'
    },
    {
      id: 'SCH-05',
      title: 'PM Matru Vandana Yojana',
      titleHi: 'प्रधानमंत्री मातृ वंदना योजना',
      fullName: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
      fullNameHi: 'प्रधानमंत्री मातृ वंदना योजना (पीएमएमवीवाई)',
      image: '/assets/scheme_matru_vandana.jpg',
      category: 'WOMEN_CHILD',
      categoryLabel: 'Women & Child',
      categoryLabelHi: 'महिला व बाल विकास',
      categoryBg: '#FFE4E6',
      categoryColor: '#E11D48',
      benefitTag: '₹5,000 benefit',
      benefitTagHi: '₹5,000 प्रत्यक्ष लाभ',
      description: 'Financial support for pregnant and lactating women.',
      descriptionHi: 'गर्भवती महिलाओं और स्तनपान कराने वाली माताओं के स्वास्थ्य एवं पोषण हेतु नकद सहायता।',
      ministry: 'Ministry of Women and Child Development',
      ministryHi: 'महिला एवं बाल विकास मंत्रालय',
      floatingIcon: UserCheck,
      floatingIconColor: '#E11D48',
      floatingIconBg: '#FFE4E6',
      popularRank: 5,
      popularSubtitle: 'Maternal health cash incentive',
      popularSubtitleHi: 'मातृ स्वास्थ्य एवं पोषण नकद प्रोत्साहन',
      eligibility: [
        'Pregnant Women and Lactating Mothers (PW&LM) for first and second live child.',
        'Direct cash incentive deposited in 3 milestone-based health installments.',
        'Excludes regular permanent central and state government employees.'
      ],
      eligibilityHi: [
        'प्रथम एवं द्वितीय जीवित संतान हेतु गर्भवती एवं स्तनपान कराने वाली माताएं।',
        'स्वास्थ्य एवं टीकाकरण के 3 निर्धारित चरणों में प्रत्यक्ष नकद हस्तांतरण।',
        'नियमित केंद्रीय अथवा राज्य सरकार के स्थायी कर्मचारियों को छोड़कर।'
      ],
      documents: ['Mother Aadhaar Card', 'Mother & Child Protection (MCP) Card', 'Aadhaar Seeded Bank Passbook'],
      documentsHi: ['माता का आधार कार्ड', 'मातृ एवं शिशु सुरक्षा (एमसीपी) कार्ड', 'आधार लिंक्ड बैंक पासबुक'],
      stats: '3.4+ Crore Mothers Supported • Safe Hospital Delivery Promotion',
      statsHi: '3.4+ करोड़ माताओं को सहायता • सुरक्षित संस्थागत प्रसव प्रोत्साहन'
    },
    {
      id: 'SCH-06',
      title: 'Pension Schemes',
      titleHi: 'राष्ट्रीय सामाजिक सहायता पेंशन',
      fullName: 'National Social Assistance Programme (NSAP Old Age & Widow Pension)',
      fullNameHi: 'राष्ट्रीय सामाजिक सहायता कार्यक्रम (वृद्धावस्था, विधवा एवं दिव्यांग पेंशन)',
      image: '/assets/scheme_pension.jpg',
      category: 'SOCIAL_SECURITY',
      categoryLabel: 'Social Security',
      categoryLabelHi: 'सामाजिक सुरक्षा',
      categoryBg: '#F3E8FF',
      categoryColor: '#7E22CE',
      benefitTag: 'Monthly pension',
      benefitTagHi: 'नियमित मासिक पेंशन',
      description: 'Social security for senior citizens, widow or disability support.',
      descriptionHi: 'वरिष्ठ नागरिकों, निराश्रित विधवा महिलाओं एवं दिव्यांगजनों हेतु मासिक सामाजिक सुरक्षा।',
      ministry: 'Ministry of Rural Development & Social Welfare Department',
      ministryHi: 'ग्रामीण विकास मंत्रालय एवं समाज कल्याण विभाग',
      floatingIcon: Users,
      floatingIconColor: '#7E22CE',
      floatingIconBg: '#F3E8FF',
      popularRank: 6,
      popularSubtitle: 'Senior citizen monthly welfare',
      popularSubtitleHi: 'वरिष्ठ नागरिक एवं निराश्रित मासिक पेंशन',
      eligibility: [
        'Senior citizens aged 60 years or above belonging to below poverty line (BPL) families.',
        'Destitute widow pension for women aged 40-79 years.',
        'Divyangjan disability assistance for persons with 80% or severe physical impairment.'
      ],
      eligibilityHi: [
        'बीपीएल परिवारों के 60 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिक।',
        '40 से 79 वर्ष की आयु वर्ग की निराश्रित विधवा महिलाएं।',
        '80% या गंभीर दिव्यांगता से प्रभावित विशेष योग्यजन।'
      ],
      documents: ['Aadhaar Card', 'Age Proof / Voter ID', 'BPL Ration Card', 'Active Bank Passbook'],
      documentsHi: ['आधार कार्ड', 'आयु प्रमाण / मतदाता पहचान पत्र', 'बीपीएल राशन कार्ड', 'सक्रिय बैंक पासबुक'],
      stats: '3.2+ Crore Pensioners • Monthly Direct DBT Transfer',
      statsHi: '3.2+ करोड़ पेंशनभोगी • प्रतिमाह सीधे बैंक खाते में भुगतान'
    },
    {
      id: 'SCH-07',
      title: 'PM Kaushal Vikas Yojana',
      titleHi: 'प्रधानमंत्री कौशल विकास योजना',
      fullName: 'Pradhan Mantri Kaushal Vikas Yojana 4.0 (Skill India)',
      fullNameHi: 'प्रधानमंत्री कौशल विकास योजना 4.0 (स्किल इंडिया मिशन)',
      image: '/assets/scheme_scholarship.jpg',
      category: 'EMPLOYMENT',
      categoryLabel: 'Employment',
      categoryLabelHi: 'रोजगार',
      categoryBg: '#CCFBF1',
      categoryColor: '#0D9488',
      benefitTag: 'Free training & ₹8,000',
      benefitTagHi: 'निःशुल्क प्रशिक्षण व ₹8,000',
      description: 'Industry-relevant skill certifications and placement support for Indian youth.',
      descriptionHi: 'भारतीय युवाओं हेतु उद्योग-अनुरूप कौशल प्रमाणन एवं रोजगार सहायता।',
      ministry: 'Ministry of Skill Development and Entrepreneurship',
      ministryHi: 'कौशल विकास एवं उद्यमशीलता मंत्रालय',
      floatingIcon: Briefcase,
      floatingIconColor: '#0D9488',
      floatingIconBg: '#CCFBF1',
      popularRank: null,
      popularSubtitle: 'Skill training for youth',
      popularSubtitleHi: 'युवाओं हेतु व्यावसायिक कौशल प्रशिक्षण',
      eligibility: [
        'Indian youth aged 15-45 looking for industry-aligned certification and jobs.',
        'School/college dropouts or candidates seeking technical upskilling.'
      ],
      eligibilityHi: [
        '15 से 45 वर्ष के भारतीय युवा जो कौशल प्रशिक्षण एवं रोजगार के इच्छुक हैं।',
        'स्कूल/कॉलेज छोड़ चुके छात्र अथवा तकनीकी कौशल उन्नयन चाहने वाले अभ्यर्थी।'
      ],
      documents: ['Aadhaar Card', 'Educational Certificate', 'Bank Passbook'],
      documentsHi: ['आधार कार्ड', 'शैक्षणिक योग्यता प्रमाण पत्र', 'बैंक पासबुक'],
      stats: '1.4+ Crore Youth Trained • Nationwide NSDC Centers',
      statsHi: '1.4+ करोड़ युवा प्रशिक्षित • देशभर में एनएसडीसी केंद्र'
    },
    {
      id: 'SCH-08',
      title: 'MGNREGA',
      titleHi: 'मनरेगा (ग्रामीण रोजगार गारंटी)',
      fullName: 'Mahatma Gandhi National Rural Employment Guarantee Act',
      fullNameHi: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम',
      image: '/assets/scheme_pm_kisan.jpg',
      category: 'EMPLOYMENT',
      categoryLabel: 'Employment',
      categoryLabelHi: 'रोजगार',
      categoryBg: '#CCFBF1',
      categoryColor: '#0D9488',
      benefitTag: '100 days wage guarantee',
      benefitTagHi: '100 दिन मजदूरी गारंटी',
      description: 'Guaranteed 100 days of wage employment in rural areas per household.',
      descriptionHi: 'ग्रामीण परिवारों को प्रति वर्ष 100 दिनों के अकुशल शारीरिक श्रम रोजगार की कानूनी गारंटी।',
      ministry: 'Ministry of Rural Development',
      ministryHi: 'ग्रामीण विकास मंत्रालय',
      floatingIcon: Briefcase,
      floatingIconColor: '#0D9488',
      floatingIconBg: '#CCFBF1',
      popularRank: null,
      popularSubtitle: 'Guaranteed rural wage employment',
      popularSubtitleHi: 'ग्रामीण परिवारों को गारंटीकृत मजदूरी रोजगार',
      eligibility: [
        'Adult members of rural households willing to do unskilled manual work.',
        'Job card registered with local Gram Panchayat.'
      ],
      eligibilityHi: [
        'ग्रामीण क्षेत्रों के वयस्क नागरिक जो अकुशल शारीरिक श्रम करने के इच्छुक हैं।',
        'स्थानीय ग्राम पंचायत में पंजीकृत जॉब कार्ड धारक परिवार।'
      ],
      documents: ['Aadhaar Card', 'Jan Pehchaan Family ID', 'Gram Panchayat Job Card'],
      documentsHi: ['आधार कार्ड', 'जन पहचान परिवार आईडी', 'ग्राम पंचायत जॉब कार्ड'],
      stats: '14+ Crore Active Workers • Weekly Direct DBT Wages',
      statsHi: '14+ करोड़ सक्रिय श्रमिक • साप्ताहिक प्रत्यक्ष बैंक मजदूरी भुगतान'
    }
  ];

  // Popular schemes for right sidebar (top 4)
  const popularSchemes = [
    {
      rank: 1,
      id: 'SCH-01',
      title: 'PM-KISAN',
      titleHi: 'पीएम-किसान',
      subtitle: 'Direct income support to farmers',
      subtitleHi: 'किसानों हेतु प्रत्यक्ष आय सहायता',
      icon: Sprout,
      iconColor: '#16A34A',
      iconBg: '#DCFCE7'
    },
    {
      rank: 2,
      id: 'SCH-02',
      title: 'Ayushman Bharat',
      titleHi: 'आयुष्मान भारत',
      subtitle: 'Free healthcare for families',
      subtitleHi: 'परिवारों के लिए निःशुल्क उपचार',
      icon: ShieldCheck,
      iconColor: '#2563EB',
      iconBg: '#DBEAFE'
    },
    {
      rank: 3,
      id: 'SCH-03',
      title: 'PM Awas Yojana',
      titleHi: 'पीएम आवास योजना',
      subtitle: 'Affordable housing support',
      subtitleHi: 'पक्के मकान निर्माण सहायता',
      icon: Home,
      iconColor: '#EA580C',
      iconBg: '#FFEDD5'
    },
    {
      rank: 4,
      id: 'SCH-04',
      title: 'Scholarship Schemes',
      titleHi: 'छात्रवृत्ति योजनाएँ',
      subtitle: 'Support for students',
      subtitleHi: 'विद्यार्थियों के शिक्षण शुल्क हेतु',
      icon: GraduationCap,
      iconColor: '#7E22CE',
      iconBg: '#F3E8FF'
    }
  ];

  // Useful links for right sidebar matching screenshot
  const usefulLinks = [
    {
      title: 'PM India Official Website',
      titleHi: 'पीएम इंडिया आधिकारिक पोर्टल',
      url: 'www.pmindia.gov.in',
      link: 'https://www.pmindia.gov.in/en/',
      icon: Landmark,
      iconColor: '#D97706',
      iconBg: '#FEF3C7'
    },
    {
      title: 'State Government Portal',
      titleHi: 'राज्य सरकार आधिकारिक पोर्टल',
      url: 'www.up.gov.in',
      link: 'https://up.gov.in/',
      icon: Building2,
      iconColor: '#2563EB',
      iconBg: '#DBEAFE'
    },
    {
      title: 'National Scholarship Portal',
      titleHi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (एनएसपी)',
      url: 'scholarships.gov.in',
      link: 'https://scholarships.gov.in/',
      icon: GraduationCap,
      iconColor: '#0284C7',
      iconBg: '#E0F2FE'
    }
  ];

  // Filter schemes based on search text and active category
  const filteredSchemes = useMemo(() => {
    return allSchemes.filter((scheme) => {
      const matchesCategory =
        activeCategory === 'ALL' || scheme.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        scheme.title.toLowerCase().includes(query) ||
        (scheme.titleHi && scheme.titleHi.toLowerCase().includes(query)) ||
        scheme.fullName.toLowerCase().includes(query) ||
        (scheme.fullNameHi && scheme.fullNameHi.toLowerCase().includes(query)) ||
        scheme.description.toLowerCase().includes(query) ||
        (scheme.descriptionHi && scheme.descriptionHi.toLowerCase().includes(query)) ||
        scheme.categoryLabel.toLowerCase().includes(query) ||
        (scheme.categoryLabelHi && scheme.categoryLabelHi.toLowerCase().includes(query)) ||
        scheme.benefitTag.toLowerCase().includes(query) ||
        (scheme.benefitTagHi && scheme.benefitTagHi.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [allSchemes, activeCategory, searchQuery]);

  const handleApplyClick = (scheme) => {
    if (onApplyScheme) {
      onApplyScheme({
        familyId: selectedFamilyId,
        schemeId: scheme.id,
        schemeName: isHindi ? (scheme.titleHi || scheme.title) : scheme.title,
        beneficiaryName: isHindi ? 'पंकज कुमार' : 'Pankaj Kumar',
        benefit: isHindi ? (scheme.benefitTagHi || scheme.benefitTag) : scheme.benefitTag
      });
    } else {
      showToast(isHindi 
        ? `${scheme.titleHi || scheme.title} डीबीटी दावा आवेदन पर पुनर्निर्देशित किया जा रहा है...` 
        : `Redirecting to ${scheme.title} DBT claim application...`);
    }
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
            <span style={{ color: '#0F172A', fontWeight: 600 }}>{isHindi ? 'सरकारी योजनाएँ' : 'Government Schemes'}</span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'सरकारी योजनाएँ' : 'Government Schemes'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'आपके और आपके परिवार के लिए प्रमुख सरकारी योजनाओं की जानकारी लें और आवेदन करें।' : 'Discover and apply for key government schemes that support you and your family.'}
          </p>
        </div>

        {/* Right Motto Quote Card matching reference image */}
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
              <>&ldquo;जन-केंद्रित योजनाएँ<br />उज्ज्वल भारत का निर्माण&rdquo;</>
            ) : (
              <>&ldquo;People-Centric Schemes<br />for a Brighter India&rdquo;</>
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
          2. SEARCH INPUT BAR
          ========================================================= */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        padding: '0.5rem 0.65rem 0.5rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
      }}>
        <Search size={19} color="#64748B" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isHindi ? 'योजनाएँ खोजें (जैसे पीएम-किसान, आयुष्मान भारत, पीएम आवास...)' : 'Search for schemes (e.g., PM-KISAN, Ayushman Bharat, PM Awas...)'}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.88rem',
            color: '#0F172A',
            background: 'transparent',
            fontWeight: 500
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={() => showToast(searchQuery ? (isHindi ? `"${searchQuery}" के लिए खोज रहे हैं...` : `Searching for "${searchQuery}"...`) : (isHindi ? 'सभी योजनाएँ प्रदर्शित की जा रही हैं' : 'Showing all schemes'))}
          style={{
            background: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '0.55rem 1.45rem',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
        >
          {isHindi ? 'खोजें' : 'Search'}
        </button>
      </div>

      {/* =========================================================
          3. CATEGORY PILLS FILTER BAR
          ========================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        overflowX: 'auto',
        paddingBottom: '0.15rem',
        scrollbarWidth: 'none'
      }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: isActive ? '1px solid #2563EB' : '1px solid #E2E8F0',
                background: isActive ? '#2563EB' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#334155',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive
                  ? '0 2px 8px rgba(37, 99, 235, 0.2)'
                  : '0 1px 3px rgba(15, 23, 42, 0.03)',
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
              <Icon size={16} color={isActive ? '#FFFFFF' : cat.color || '#2563EB'} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          4. MAIN TWO-COLUMN BODY
             Left/Center (72%): Scheme Cards Grid (3 Columns)
             Right Sidebar (28%): Eligibility + Popular + Links
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN: SCHEMES GRID (3-COLUMNS)
            ======================================================= */}
        <div>
          {filteredSchemes.length === 0 ? (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '3rem 2rem',
              textAlign: 'center'
            }}>
              <AlertCircle size={40} color="#94A3B8" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                {isHindi ? 'कोई योजना नहीं मिली' : 'No schemes found'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                {isHindi ? `इस श्रेणी में "${searchQuery}" से मेल खाती कोई योजना उपलब्ध नहीं है।` : <>No schemes match &ldquo;{searchQuery}&rdquo; in this category.</>}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('ALL');
                }}
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
                {isHindi ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.15rem'
            }}>
              {filteredSchemes.map((scheme) => {
                const FloatingIcon = scheme.floatingIcon;
                return (
                  <div
                    key={scheme.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 24px rgba(15, 23, 42, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.03)';
                    }}
                  >
                    {/* Thumbnail Image with Floating Badge */}
                    <div style={{ position: 'relative', width: '100%', height: '136px', overflow: 'hidden', background: '#F1F5F9' }}>
                      <img
                        src={scheme.image}
                        alt={scheme.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      {/* Floating Circle Icon Badge matching screenshot */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2
                      }}>
                        <FloatingIcon size={16} color={scheme.floatingIconColor} />
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div style={{
                      padding: '1rem 1.15rem 1.15rem 1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1
                    }}>
                      <h3 style={{
                        fontSize: '1.025rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        margin: '0 0 0.35rem 0',
                        letterSpacing: '-0.01em'
                      }}>
                        {isHindi ? (scheme.titleHi || scheme.title) : scheme.title}
                      </h3>

                      <p style={{
                        fontSize: '0.78rem',
                        color: '#475569',
                        lineHeight: 1.45,
                        margin: '0 0 0.85rem 0',
                        minHeight: '36px'
                      }}>
                        {isHindi ? (scheme.descriptionHi || scheme.description) : scheme.description}
                      </p>

                      {/* Tags Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.95rem', flexWrap: 'wrap' }}>
                        {/* Category Tag */}
                        <span style={{
                          background: scheme.categoryBg,
                          color: scheme.categoryColor,
                          padding: '0.22rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}>
                          {isHindi ? (scheme.categoryLabelHi || scheme.categoryLabel) : scheme.categoryLabel}
                        </span>

                        {/* Benefit Tag */}
                        <span style={{
                          background: '#DCFCE7',
                          color: '#15803D',
                          padding: '0.22rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}>
                          {isHindi ? (scheme.benefitTagHi || scheme.benefitTag) : scheme.benefitTag}
                        </span>
                      </div>

                      {/* Action Buttons Row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: 'auto',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #F1F5F9'
                      }}>
                        <button
                          type="button"
                          onClick={() => setSelectedSchemeForModal(scheme)}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            background: '#FFFFFF',
                            border: '1px solid #DBEAFE',
                            color: '#2563EB',
                            borderRadius: '8px',
                            padding: '0.45rem 0.65rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#EFF6FF';
                            e.currentTarget.style.borderColor = '#93C5FD';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#DBEAFE';
                          }}
                        >
                          <span>{isHindi ? 'विवरण देखें' : 'View Details'}</span>
                          <span style={{ fontSize: '0.85rem' }}>→</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplyClick(scheme)}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            background: '#2563EB',
                            border: 'none',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '0.45rem 0.65rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                        >
                          <span>{isHindi ? 'आवेदन करें' : 'Apply Now'}</span>
                          <span style={{ fontSize: '0.85rem' }}>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =======================================================
            RIGHT COLUMN: ELIGIBILITY + POPULAR + USEFUL LINKS
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. CHECK YOUR ELIGIBILITY CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem 1.35rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.65rem' }}>
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
                <Target size={20} color="#EF4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.2rem 0' }}>
                  {isHindi ? 'अपनी पात्रता जांचें' : 'Check Your Eligibility'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                  {isHindi ? 'जानें कि आपकी प्रोफ़ाइल के अनुसार आप किन योजनाओं के लिए पात्र हैं।' : 'Find out which schemes you may be eligible for based on your profile.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEligibilityModal(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.58rem 1rem',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                transition: 'background 0.15s ease',
                marginTop: '0.65rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
            >
              <span>{isHindi ? 'पात्रता जांचें' : 'Check Eligibility Now'}</span>
              <span style={{ fontSize: '0.9rem' }}>→</span>
            </button>
          </div>

          {/* 2. POPULAR SCHEMES CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.35rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.95rem' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'लोकप्रिय योजनाएँ' : 'Popular Schemes'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('ALL');
                  setSearchQuery('');
                  showToast(isHindi ? 'सभी योजनाएँ प्रदर्शित' : 'Showing all schemes');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                <span style={{ fontSize: '0.85rem' }}>→</span>
              </button>
            </div>

            {/* List of 4 Popular Schemes matching screenshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {popularSchemes.map((item) => {
                const Icon = item.icon;
                const schemeMatch = allSchemes.find((s) => s.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => schemeMatch && setSelectedSchemeForModal(schemeMatch)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.65rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {/* Dark Blue Number Circle */}
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#1E3A8A',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.rank}
                      </div>

                      {/* Icon container */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: item.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={16} color={item.iconColor} />
                      </div>

                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                          {isHindi ? (item.titleHi || item.title) : item.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {isHindi ? (item.subtitleHi || item.subtitle) : item.subtitle}
                        </div>
                      </div>
                    </div>

                    <ChevronRight size={15} color="#94A3B8" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. USEFUL LINKS CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.35rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.95rem 0' }}>
              {isHindi ? 'उपयोगी लिंक्स' : 'Useful Links'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {usefulLinks.map((linkItem, idx) => {
                const Icon = linkItem.icon;
                return (
                  <a
                    key={idx}
                    href={linkItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.65rem',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: linkItem.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={16} color={linkItem.iconColor} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                          {isHindi ? (linkItem.titleHi || linkItem.title) : linkItem.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {linkItem.url}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB'
                    }}>
                      <ChevronRight size={13} color="#2563EB" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          5. SCHEME DETAILS MODAL
          ========================================================= */}
      {selectedSchemeForModal && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedSchemeForModal(null)}
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
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              position: 'relative'
            }}
          >
            {/* Header Banner */}
            <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
              <img
                src={selectedSchemeForModal.image}
                alt={selectedSchemeForModal.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%)'
              }} />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedSchemeForModal(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={17} color="#0F172A" />
              </button>

              {/* Title & Category over image */}
              <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                <span style={{
                  background: selectedSchemeForModal.categoryBg,
                  color: selectedSchemeForModal.categoryColor,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {isHindi ? (selectedSchemeForModal.categoryLabelHi || selectedSchemeForModal.categoryLabel) : selectedSchemeForModal.categoryLabel}
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', margin: '0.35rem 0 0 0' }}>
                  {isHindi ? (selectedSchemeForModal.titleHi || selectedSchemeForModal.title) : selectedSchemeForModal.title}
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#E2E8F0', marginTop: '0.15rem' }}>
                  {isHindi ? (selectedSchemeForModal.fullNameHi || selectedSchemeForModal.fullName) : selectedSchemeForModal.fullName}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Ministry and Benefit Overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                background: '#F8FAFC',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1px solid #E2E8F0'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{isHindi ? 'संबद्ध मंत्रालय' : 'Governing Ministry'}</div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                    {isHindi ? (selectedSchemeForModal.ministryHi || selectedSchemeForModal.ministry) : selectedSchemeForModal.ministry}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{isHindi ? 'पात्रता लाभ' : 'Entitlement Benefit'}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D', marginTop: '0.2rem' }}>
                    {isHindi ? (selectedSchemeForModal.benefitTagHi || selectedSchemeForModal.benefitTag) : selectedSchemeForModal.benefitTag}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
                  {isHindi ? 'योजना का अवलोकन' : 'Scheme Overview'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.825rem', color: '#475569', lineHeight: 1.5 }}>
                  {isHindi
                    ? `${selectedSchemeForModal.descriptionHi || selectedSchemeForModal.description} यह योजना प्रत्यक्ष वित्तीय सहायता एवं कल्याणकारी लाभ नागरिक के आधार वॉल्ट व डीबीटी से जुड़े बैंक खाते में सीधे उपलब्ध कराती है।`
                    : `${selectedSchemeForModal.description} Provides direct financial or welfare assistance directly seeded to citizen Aadhaar vault and DBT-linked bank accounts.`}
                </p>
              </div>

              {/* Key Eligibility Rules */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                  {isHindi ? 'पात्रता मापदंड' : 'Eligibility Criteria'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {((isHindi && selectedSchemeForModal.eligibilityHi) ? selectedSchemeForModal.eligibilityHi : selectedSchemeForModal.eligibility)?.map((rule, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                  {isHindi ? 'आवश्यक दस्तावेज़' : 'Required Documents'}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {((isHindi && selectedSchemeForModal.documentsHi) ? selectedSchemeForModal.documentsHi : selectedSchemeForModal.documents)?.map((doc, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#EFF6FF',
                        border: '1px solid #DBEAFE',
                        color: '#1E40AF',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <FileText size={12} color="#2563EB" />
                      <span>{doc}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Nationwide Impact Stats */}
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                fontSize: '0.78rem',
                color: '#065F46',
                fontWeight: 600
              }}>
                ✓ {isHindi ? (selectedSchemeForModal.statsHi || selectedSchemeForModal.stats) : selectedSchemeForModal.stats}
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setSelectedSchemeForModal(null)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.55rem 1.15rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const scheme = selectedSchemeForModal;
                    setSelectedSchemeForModal(null);
                    handleApplyClick(scheme);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 1.35rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <span>{isHindi ? 'योजना के लिए आवेदन करें' : 'Apply for Scheme'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          6. ELIGIBILITY EVALUATION MODAL (Entitlement Engine)
          ========================================================= */}
      {showEligibilityModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowEligibilityModal(false)}
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
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              position: 'relative',
              padding: '1.5rem'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Target size={20} color="#EF4444" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'पात्रता एवं अधिकार सत्यापन' : 'Entitlement & Eligibility Check'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {isHindi ? 'नागरिक अभिलेखों व परिवार रजिस्टर के आधार पर स्वचालित नियम मिलान' : 'Automated rule matching against citizen records & family registry'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEligibilityModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={19} color="#64748B" />
              </button>
            </div>

            {/* Household Banner */}
            <div style={{
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              borderRadius: '12px',
              padding: '0.85rem 1.15rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.15rem'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369A1' }}>
                  {isHindi ? 'पंकज कुमार का परिवार (5 सदस्य)' : 'Pankaj Kumar\'s Household (5 Members)'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0284C7' }}>
                  {isHindi ? 'ज़िला: गौतम बुद्ध नगर • भूमि: 1.5 एकड़ • वार्षिक आय: ₹1,20,000' : 'District: Gautam Buddha Nagar • Land: 1.5 Acres • Annual Income: ₹1,20,000'}
                </div>
              </div>
              <div style={{
                background: '#DCFCE7',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {isHindi ? '3 योजनाएं पात्र' : '3 Schemes Qualified'}
              </div>
            </div>

            {/* Qualified Schemes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                {isHindi ? 'डीबीटी दावे हेतु योग्य योजनाएं:' : 'Qualified Schemes Ready for DBT Claim:'}
              </div>

              {/* Scheme 1 */}
              <div style={{
                border: '1px solid #BBF7D0',
                background: '#F0FDF4',
                borderRadius: '12px',
                padding: '0.85rem 1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{isHindi ? 'पीएम-किसान' : 'PM-KISAN'}</span>
                    <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>{isHindi ? '100% मेल' : '100% Match'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEligibilityModal(false);
                      handleApplyClick(allSchemes[0]);
                    }}
                    style={{
                      background: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? '₹6,000 प्राप्त करें →' : 'Claim ₹6,000 →'}
                  </button>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.35rem' }}>
                  {isHindi ? 'शर्तें पूरी: भूमि जोत 1.5 एकड़ (सीमा ≤ 2.0 हेक्टेयर के अंदर) • गैर-वेतनभोगी किसान।' : 'Criteria met: Landholding 1.5 acres (within ≤ 2.0 ha threshold) • Non-salaried farmer.'}
                </div>
              </div>

              {/* Scheme 2 */}
              <div style={{
                border: '1px solid #BBF7D0',
                background: '#F0FDF4',
                borderRadius: '12px',
                padding: '0.85rem 1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{isHindi ? 'आयुष्मान भारत' : 'Ayushman Bharat'}</span>
                    <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>{isHindi ? '95% मेल' : '95% Match'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEligibilityModal(false);
                      handleApplyClick(allSchemes[1]);
                    }}
                    style={{
                      background: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? 'कार्ड प्राप्त करें →' : 'Claim Card →'}
                  </button>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.35rem' }}>
                  {isHindi ? 'शर्तें पूरी: परिवार एसईसीसी पंजीकृत राशन इकाई के अंतर्गत • ₹5 लाख निःशुल्क स्वास्थ्य सुरक्षा।' : 'Criteria met: Household falls under SECC registered ration unit • ₹5 Lakh free medical cover.'}
                </div>
              </div>

              {/* Scheme 3 */}
              <div style={{
                border: '1px solid #BBF7D0',
                background: '#F0FDF4',
                borderRadius: '12px',
                padding: '0.85rem 1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{isHindi ? 'छात्रवृत्ति योजनाएं' : 'Scholarship Schemes'}</span>
                    <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>{isHindi ? '100% मेल' : '100% Match'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEligibilityModal(false);
                      handleApplyClick(allSchemes[3]);
                    }}
                    style={{
                      background: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? 'आवेदन करें →' : 'Apply Now →'}
                  </button>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.35rem' }}>
                  {isHindi ? 'शर्तें पूरी: पूजा शर्मा (16 वर्ष) उच्चतर माध्यमिक में नामांकित • पारिवारिक आय ₹2.50 लाख से कम।' : 'Criteria met: Pooja Sharma (16 yrs) enrolled in Higher Secondary • Family income under ₹2.50 Lakh.'}
                </div>
              </div>

              {/* Ineligible scheme note */}
              <div style={{
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                opacity: 0.85
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} color="#94A3B8" />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>{isHindi ? 'पेंशन योजनाएं' : 'Pension Schemes'}</span>
                  <span style={{ fontSize: '0.72rem', background: '#F1F5F9', color: '#64748B', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>{isHindi ? 'अपात्र' : 'Ineligible'}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem' }}>
                  {isHindi ? 'कारण: वृद्धावस्था पेंशन हेतु लाभार्थी की न्यूनतम आयु 60+ वर्ष अनिवार्य (वर्तमान वरिष्ठतम सदस्य रमेश 48 वर्ष)।' : 'Reason: Old Age Pension requires beneficiary age 60+ (Current eldest member Ramesh is 48 yrs).'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowEligibilityModal(false)}
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
                {isHindi ? 'पूर्ण' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export both names for maximum compatibility
export const GovernmentSchemesTab = SchemeMatcherTab;
export default SchemeMatcherTab;
