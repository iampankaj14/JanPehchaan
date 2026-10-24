import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Clock,
  QrCode,
  Phone,
  MapPin,
  Users,
  UserPlus,
  Download,
  Fingerprint,
  Landmark,
  Search,
  Calendar,
  CreditCard,
  FileCheck,
  Check,
  ArrowRight,
  Shield,
  Sprout,
  Flame,
  Home,
  GraduationCap,
  FileText,
  Heart,
  Briefcase,
  Car,
  Zap,
  Building2,
  MessageSquareWarning,
  ChevronRight,
  MoreVertical,
  X,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

// Dedicated portal catalogs for each category in Home Page
const CATEGORY_PORTALS = {
  identity: {
    title: 'Identity & Documents Portal',
    subtitle: 'Unified Civil Identity & Digital Document Vault Gateway',
    icon: FileText,
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    badge: 'Official UIDAI & DigiLocker Gateway',
    services: [
      {
        name: 'Aadhaar Card Download & e-KYC',
        desc: 'Download password-protected masked e-Aadhaar or update mobile / biometric details.',
        dept: 'UIDAI (Govt. of India)',
        turnaround: 'Instant (OTP verified)',
        fee: 'Free',
        actionLabel: 'Launch Aadhaar Desk',
        actionType: 'navigate',
        targetTab: 'digital_id'
      },
      {
        name: 'Digital Ration Card Sync',
        desc: 'Check NFSA quota allocation, dealer allocation & family member entitlement ledger.',
        dept: 'Dept of Food & Public Distribution',
        turnaround: 'Instant Sync',
        fee: 'Free',
        actionLabel: 'View Ration Entitlement',
        actionType: 'toast',
        toastMsg: 'Ration quota synced: 35 Kg subsidized grains active for this month.'
      },
      {
        name: 'Income & Domicile Certificate Vault',
        desc: 'Fetch digitally signed Tahsil level domicile and annual income certificates.',
        dept: 'Revenue & District Administration',
        turnaround: 'Real-time pull',
        fee: 'Free',
        actionLabel: 'Open Certificates',
        actionType: 'navigate',
        targetTab: 'certificates'
      },
      {
        name: 'PAN Card Linking & Instant Verification',
        desc: 'Link PAN with Jan Pehchaan family ID and check Income Tax e-filing status.',
        dept: 'Income Tax Department (CBDT)',
        turnaround: 'Instant',
        fee: 'Free',
        actionLabel: 'Verify PAN Record',
        actionType: 'toast',
        toastMsg: 'PAN verification verified with NSDL database.'
      }
    ]
  },
  health: {
    title: 'Health & Welfare Portal',
    subtitle: 'Universal Health Coverage & Citizen Wellness Desk',
    icon: Heart,
    iconBg: '#FFF1F2',
    iconColor: '#E11D48',
    badge: 'National Health Authority (NHA)',
    services: [
      {
        name: 'Ayushman Card (PM-JAY Golden Card)',
        desc: 'Generate cashless ₹5 Lakh treatment card valid across 28,000+ empanelled hospitals.',
        dept: 'National Health Authority',
        turnaround: 'Instant Download',
        fee: 'Free',
        actionLabel: 'Apply / Download Card',
        actionType: 'apply_scheme',
        schemeData: {
          schemeId: 'SCHEME-PMJAY',
          schemeName: 'Ayushman Bharat (PM-JAY)',
          benefit: '₹5,00,000 / year Health Coverage'
        }
      },
      {
        name: 'Universal Immunization & CoWIN',
        desc: 'Digital child vaccine calendar, booster doses and QR verifiable health certificates.',
        dept: 'Ministry of Health & Family Welfare',
        turnaround: 'Immediate',
        fee: 'Free',
        actionLabel: 'Check Vaccine Ledger',
        actionType: 'toast',
        toastMsg: 'Vaccine records up to date. Downloaded WHO-compliant certificate.'
      },
      {
        name: 'Jan Aushadhi Generic Medicine Subsidy',
        desc: 'Locate nearest government medical store offering up to 90% discount on medicines.',
        dept: 'Pharmaceuticals & Medical Devices Bureau',
        turnaround: 'Live Locator',
        fee: 'Subsidized',
        actionLabel: 'Find Empanelled Center',
        actionType: 'toast',
        toastMsg: 'Found 4 Jan Aushadhi Kendras within 3 km radius.'
      }
    ]
  },
  education: {
    title: 'Education & Scholarship Portal',
    subtitle: 'Student Financial Aid, Admissions & Academic Vault',
    icon: GraduationCap,
    iconBg: '#FAF5FF',
    iconColor: '#9333EA',
    badge: 'Ministry of Education & Social Justice',
    services: [
      {
        name: 'National Scholarship Portal (NSP 2.0)',
        desc: 'Pre-matric and Post-matric merit & mean scholarships directly credited via DBT.',
        dept: 'Ministry of Education',
        turnaround: 'Direct Claim',
        fee: 'Free',
        actionLabel: 'Apply for Scholarship',
        actionType: 'apply_scheme',
        schemeData: {
          schemeId: 'SCHEME-NSP',
          schemeName: 'National Scholarship Portal (Pre & Post Matric)',
          benefit: '₹12,000 - ₹50,000 / year Academic Fee Reversal'
        }
      },
      {
        name: 'DigiLocker Academic Repository (NAD)',
        desc: 'Fetch original CBSE, State Board, and University marks certificates in PDF.',
        dept: 'National Academic Depository',
        turnaround: 'Instant Fetch',
        fee: 'Free',
        actionLabel: 'Open Certificates Tab',
        actionType: 'navigate',
        targetTab: 'certificates'
      },
      {
        name: 'PM e-VIDYA & SWAYAM Online Certifications',
        desc: 'Free accredited certificate courses with government recognized skill test credits.',
        dept: 'Ministry of Education',
        turnaround: 'Immediate Access',
        fee: 'Free',
        actionLabel: 'Browse Free Courses',
        actionType: 'toast',
        toastMsg: 'Enrolled in SWAYAM Digital Skills Track.'
      }
    ]
  },
  agriculture: {
    title: 'Agriculture & Farmer Welfare Portal',
    subtitle: 'Kisan DBT, Soil Health, Seeds & Crop Support',
    icon: Sprout,
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    badge: 'Ministry of Agriculture & Farmers Welfare',
    services: [
      {
        name: 'PM-KISAN Samman Nidhi Desk',
        desc: 'Check 16th installment DBT credit status, update Aadhaar e-KYC or submit land seed record.',
        dept: 'Dept of Agriculture',
        turnaround: 'Real-time Tracker',
        fee: 'Direct Benefit (₹6,000/yr)',
        actionLabel: 'Claim / Apply PM-KISAN',
        actionType: 'apply_scheme',
        schemeData: {
          schemeId: 'SCHEME-PMKISAN',
          schemeName: 'PM-KISAN Samman Nidhi',
          benefit: '₹6,000 / year direct cash support'
        }
      },
      {
        name: 'Soil Health Card & Crop Guidance',
        desc: 'View nutrient advisory report and customized fertilizer dosage recommendations for your plot.',
        dept: 'Soil Health Mission',
        turnaround: 'Instant PDF',
        fee: 'Free',
        actionLabel: 'Download Soil Card',
        actionType: 'toast',
        toastMsg: 'Soil Health Card (Plot #44/2) loaded: Nitrogen optimal, Zinc recommended.'
      },
      {
        name: 'PM Fasal Bima Yojana (Crop Insurance)',
        desc: 'Comprehensive crop insurance against weather hazards, drought and flood damages.',
        dept: 'Ministry of Agriculture',
        turnaround: '7-10 Days',
        fee: '1.5% Subsidized Premium',
        actionLabel: 'Apply Crop Insurance',
        actionType: 'toast',
        toastMsg: 'Kharif crop insurance claim token generated.'
      }
    ]
  },
  housing: {
    title: 'Housing & Urban Development Portal',
    subtitle: 'Affordable Housing, PMAY Subsidies & Property Records',
    icon: Home,
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    badge: 'Ministry of Housing and Urban Affairs (MoHUA)',
    services: [
      {
        name: 'Pradhan Mantri Awas Yojana (PMAY)',
        desc: 'Housing construction subsidy up to ₹2.5 Lakh for pucca house under Gramin & Urban tiers.',
        dept: 'MoHUA & Rural Development',
        turnaround: 'Verified Claim',
        fee: 'Up to ₹2.5 Lakh Grant',
        actionLabel: 'Apply for PMAY Grant',
        actionType: 'apply_scheme',
        schemeData: {
          schemeId: 'SCHEME-PMAY',
          schemeName: 'Pradhan Mantri Awas Yojana (PMAY)',
          benefit: '₹1,20,000 - ₹2,50,000 Construction Subsidy'
        }
      },
      {
        name: 'SVANidhi Street Vendor Micro-Credit',
        desc: 'Collateral-free working capital loan of ₹10,000 to ₹50,000 with 7% interest subsidy.',
        dept: 'MoHUA',
        turnaround: '48 Hours',
        fee: 'Low Interest',
        actionLabel: 'Check Eligibility',
        actionType: 'toast',
        toastMsg: 'SVANidhi Tier-1 eligibility confirmed: Pre-approved for ₹10,000 credit.'
      },
      {
        name: 'Digital Land Title & Mutation Status',
        desc: 'Search Bhulekh / e-Dharani land records and verified mutation status.',
        dept: 'Revenue & Land Records',
        turnaround: 'Instant',
        fee: 'Free',
        actionLabel: 'Inspect Land Records',
        actionType: 'toast',
        toastMsg: 'Survey No. 102/B authenticated with digital revenue stamp.'
      }
    ]
  },
  employment: {
    title: 'Employment & Skill Development Portal',
    subtitle: 'Worker Registrations, Job Matching & Apprenticeships',
    icon: Briefcase,
    iconBg: '#FAF5FF',
    iconColor: '#9333EA',
    badge: 'Ministry of Labour & Employment',
    services: [
      {
        name: 'e-Shram National Worker Card',
        desc: 'Universal Account Number (UAN) for unorganised workers with ₹2 Lakh accidental cover.',
        dept: 'Ministry of Labour & Employment',
        turnaround: 'Instant',
        fee: 'Free',
        actionLabel: 'Generate e-Shram Card',
        actionType: 'toast',
        toastMsg: 'e-Shram 12-digit UAN Card generated with ₹2 Lakh PM-SBY accidental cover.'
      },
      {
        name: 'National Career Service (NCS) Portal',
        desc: 'Browse verified government and private vacancies tailored to citizen educational qualification.',
        dept: 'NCS Directorate',
        turnaround: 'Active Postings',
        fee: 'Free',
        actionLabel: 'Explore Open Jobs',
        actionType: 'toast',
        toastMsg: '14 matching clerical & technical openings found in your district.'
      },
      {
        name: 'PMKVY Certified Skill Training Center',
        desc: 'Free vocational skilling courses in IT, solar installation, logistics and healthcare.',
        dept: 'Skill India Mission',
        turnaround: 'Cohort Enrollment',
        fee: 'Free with Stipend',
        actionLabel: 'Enroll in Skill Batch',
        actionType: 'toast',
        toastMsg: 'Skill training registration submitted for upcoming November batch.'
      }
    ]
  },
  transport: {
    title: 'Transport & Parivahan Portal',
    subtitle: 'Vehicle Registration, Driving Licences & FASTag Desk',
    icon: Car,
    iconBg: '#F0F9FF',
    iconColor: '#0284C7',
    badge: 'Ministry of Road Transport & Highways (MoRTH)',
    services: [
      {
        name: 'Parivahan Sarathi - Driving Licence Desk',
        desc: 'Apply for Learner Licence, renewal of driving licence, or change of residential address.',
        dept: 'State Transport Authority (MoRTH)',
        turnaround: 'Online Test / Slot',
        fee: 'Standard Govt Fee',
        actionLabel: 'Launch Sarathi Portal',
        actionType: 'toast',
        toastMsg: 'Driving Licence renewal application initiated. Slot available tomorrow.'
      },
      {
        name: 'Vahan Vehicle Registration & Fitness (RC)',
        desc: 'Digital RC download, ownership transfer NOC, and emission pollution (PUC) check.',
        dept: 'Vahan Citizen Portal',
        turnaround: 'Instant PDF',
        fee: 'Standard Fee',
        actionLabel: 'Verify Vehicle RC',
        actionType: 'toast',
        toastMsg: 'Vehicle RC #RJ-14-EA-9921 active & authenticated.'
      },
      {
        name: 'FASTag Balance & Toll Exemption Desk',
        desc: 'Recharge FASTag, check blacklist status and apply for local resident monthly toll pass.',
        dept: 'NHAI / IHMCL',
        turnaround: 'Instant Recharge',
        fee: 'Free Service',
        actionLabel: 'Check FASTag Status',
        actionType: 'toast',
        toastMsg: 'FASTag balance: ₹450.00 • Status: Active.'
      }
    ]
  },
  utilities: {
    title: 'Utilities & Citizen Bills Portal',
    subtitle: 'Electricity, Water, Gas & Rooftop Solar Desk',
    icon: Zap,
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
    badge: 'Unified Bharat BillPay (BBPS)',
    services: [
      {
        name: 'Bharat BillPay (BBPS) Electricity & Water Desk',
        desc: 'One-click consolidated bill payment for all state electricity distribution and water boards.',
        dept: 'NPCI Bharat BillPay',
        turnaround: 'Instant Receipt',
        fee: 'Zero Surcharge',
        actionLabel: 'View & Pay Bills',
        actionType: 'toast',
        toastMsg: 'Power Discom bill (Consumer #994821): Paid • Zero dues pending.'
      },
      {
        name: 'PM Surya Ghar: Muft Bijli Yojana',
        desc: 'Apply for up to ₹78,000 rooftop solar installation subsidy with 300 units free power.',
        dept: 'Ministry of New & Renewable Energy',
        turnaround: 'Survey in 3 Days',
        fee: 'Direct Subsidy',
        actionLabel: 'Apply Solar Rooftop Subsidy',
        actionType: 'toast',
        toastMsg: 'Rooftop Solar technical feasibility inspection request lodged.'
      },
      {
        name: 'Ujjwala LPG Cylinder Booking & Subsidy',
        desc: 'Book domestic LPG refill with direct ₹300 bank account subsidy transfer per cylinder.',
        dept: 'Ministry of Petroleum & Natural Gas',
        turnaround: 'Delivery in 24 Hrs',
        fee: 'Subsidized Refill',
        actionLabel: 'Apply / Book Cylinder',
        actionType: 'apply_scheme',
        schemeData: {
          schemeId: 'SCHEME-PMUY',
          schemeName: 'Pradhan Mantri Ujjwala Yojana (PMUY 2.0)',
          benefit: 'Free LPG Connection + First Cylinder & Stove Subsidy'
        }
      }
    ]
  },
  business: {
    title: 'Business & Enterprise Portal',
    subtitle: 'MSME Udyam, GST, Shop & Establishment Clearances',
    icon: Building2,
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    badge: 'Ministry of Micro, Small and Medium Enterprises',
    services: [
      {
        name: 'Udyam MSME Registration (Free Instant Certificate)',
        desc: 'Zero-cost paperless registration for Micro, Small and Medium enterprises with Aadhaar OTP.',
        dept: 'Ministry of MSME',
        turnaround: 'Instant Certificate',
        fee: 'Completely Free',
        actionLabel: 'Register Business / MSME',
        actionType: 'toast',
        toastMsg: 'Udyam Registration token generated. Verified with CBDT and GSTN.'
      },
      {
        name: 'Government e-Marketplace (GeM) Vendor Onboarding',
        desc: 'Sell goods and services directly to Central and State Government departments without middleman.',
        dept: 'Dept of Commerce',
        turnaround: 'Verified in 48h',
        fee: 'Free',
        actionLabel: 'Start Selling on GeM',
        actionType: 'toast',
        toastMsg: 'GeM Seller profile created under Jan Pehchaan Single Sign-On.'
      },
      {
        name: 'PM MUDRA Yojana Loan Desk',
        desc: 'Collateral-free business credit up to ₹10 Lakh under Shishu, Kishor and Tarun categories.',
        dept: 'Dept of Financial Services',
        turnaround: '5-7 Days Bank Review',
        fee: 'Low Interest',
        actionLabel: 'Apply MUDRA Loan',
        actionType: 'toast',
        toastMsg: 'MUDRA Loan application pre-screened with eligible state partner bank.'
      }
    ]
  },
  grievances: {
    title: 'Grievance Redressal Portal (CPGRAMS)',
    subtitle: 'Unified Public Grievances, Escalation & Status Tracking',
    icon: MessageSquareWarning,
    iconBg: '#FFF1F2',
    iconColor: '#E11D48',
    badge: 'DARPG (Prime Minister Office Desk)',
    services: [
      {
        name: 'Lodge New Grievance / Complaint',
        desc: 'File grievance against any government service, delay in welfare release or officer inaction.',
        dept: 'Central & State Grievance Cell',
        turnaround: 'Guaranteed 21-Day Resolution',
        fee: 'Free',
        actionLabel: 'Lodge Official Complaint',
        actionType: 'navigate',
        targetTab: 'grievances'
      },
      {
        name: 'Direct CM Helpline / Jan Seva Dispute Cell',
        desc: 'Urgent district level escalation for electricity, water, ration card and land dispute.',
        dept: 'District Magistrate Office',
        turnaround: '48 Hour Response',
        fee: 'Free',
        actionLabel: 'Dial 181 / Track Issue',
        actionType: 'navigate',
        targetTab: 'grievances'
      },
      {
        name: 'National Consumer Helpline (e-Daakhil)',
        desc: 'Online filing of consumer disputes against deficient services and unfair trade practices.',
        dept: 'Dept of Consumer Affairs',
        turnaround: 'Notice in 7 Days',
        fee: 'Nominal Stamp',
        actionLabel: 'Open Grievances Desk',
        actionType: 'navigate',
        targetTab: 'grievances'
      }
    ]
  }
};

const CATEGORY_PORTALS_HI = {
  identity: {
    title: 'पहचान व दस्तावेज़ पोर्टल',
    subtitle: 'एकीकृत नागरिक पहचान और डिजिटल दस्तावेज़ वॉल्ट गेटवे',
    badge: 'आधिकारिक UIDAI और डिजीलॉकर गेटवे'
  },
  health: {
    title: 'स्वास्थ्य व कल्याण पोर्टल',
    subtitle: 'सार्वभौमिक स्वास्थ्य सुरक्षा एवं नागरिक स्वास्थ्य सेवा केंद्र',
    badge: 'राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA)'
  },
  education: {
    title: 'शिक्षा व छात्रवृत्ति पोर्टल',
    subtitle: 'विद्यार्थी वित्तीय सहायता, प्रवेश एवं शैक्षणिक रिकॉर्ड वॉल्ट',
    badge: 'शिक्षा मंत्रालय एवं विश्वविद्यालय अनुदान आयोग'
  },
  agriculture: {
    title: 'कृषि व किसान कल्याण पोर्टल',
    subtitle: 'कृषि सब्सिडी, बीज सहायता और सीधे बैंक खाते में भुगतान गेटवे',
    badge: 'कृषि एवं किसान कल्याण मंत्रालय'
  },
  housing: {
    title: 'आवास व शहरी कार्य पोर्टल',
    subtitle: 'प्रधानमंत्री आवास योजना एवं किफायती आवास स्वीकृति',
    badge: 'आवासन और शहरी कार्य मंत्रालय'
  },
  employment: {
    title: 'रोजगार व कौशल विकास पोर्टल',
    subtitle: 'रोजगार अवसर, कौशल प्रशिक्षण एवं अप्रेंटिसशिप पोर्टल',
    badge: 'कौशल विकास एवं उद्यमिता मंत्रालय'
  },
  transport: {
    title: 'परिवहन व वाहन सेवा पोर्टल',
    subtitle: 'ड्राइविंग लाइसेंस, वाहन पंजीकरण (RC) व फिटनेस नवीनीकरण',
    badge: 'सड़क परिवहन एवं राजमार्ग मंत्रालय (वाहन/सारथी)'
  },
  utilities: {
    title: 'नागरिक सुविधा एवं बिल भुगतान',
    subtitle: 'बिजली बिल, जल संयोजन और रसोई गैस रिफिल सेवाएँ',
    badge: 'भारत बिलपे (BBPS) एकीकृत गेटवे'
  },
  business: {
    title: 'व्यापार, उद्योग एवं एमएसएमई पोर्टल',
    subtitle: 'उद्यम पंजीकरण, जीएसटी अनुपालन व व्यापार ऋण सुविधा',
    badge: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय'
  },
  grievances: {
    title: 'एकीकृत जन शिकायत निवारण पोर्टल',
    subtitle: 'ऑनलाइन जनसुनवाई, सीपीग्राम्स (CPGRAMS) व त्वरित निस्तारण',
    badge: 'प्रशासनिक सुधार एवं लोक शिकायत विभाग'
  }
};

export function OverviewTab({ stats, onNavigateTab, onAddFamilyClick, onApplyScheme, user, family, currentLang = 'en' }) {
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [portalToast, setPortalToast] = useState(null);

  const isHindi = currentLang === 'hi';

  const showPortalToast = (msg) => {
    setPortalToast(msg);
    setTimeout(() => setPortalToast(null), 3200);
  };

  const activeCategory = activeCategoryKey ? CATEGORY_PORTALS[activeCategoryKey] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification within Overview */}
      {portalToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10001,
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'modalEnter 0.2s ease-out'
        }}>
          <span style={{ color: '#10B981' }}>✓</span>
          <span>{portalToast}</span>
        </div>
      )}
      {/* =========================================================
          1. HERO BANNER: Welcome back, Pankaj!
          ========================================================= */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        padding: '1.75rem 2.25rem',
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        background: '#FFFFFF'
      }}>
        {/* Real India Gate & Rashtrapati Bhavan Panoramic Photo Layer */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: 'url(/assets/india_gate_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right 20% center',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Seamless Soft Gradient Overlay for Crystal Clear Readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.96) 38%, rgba(255, 255, 255, 0.72) 62%, rgba(255, 255, 255, 0.25) 85%, rgba(255, 255, 255, 0.1) 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Tricolor Bottom Accent Ribbon */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '320px',
          height: '5px',
          background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
          borderBottomLeftRadius: '20px',
          zIndex: 3
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          {/* Left Text & Value Badges */}
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 0.25rem 0',
              letterSpacing: '-0.025em'
            }}>
              {isHindi ? 'स्वागत है, ' : 'Welcome back, '}<span style={{ color: '#2563EB' }}>Pankaj!</span>
            </h1>
            <p style={{
              margin: '0 0 1.15rem 0',
              fontSize: '0.9rem',
              color: '#475569',
              fontWeight: 500
            }}>
              {isHindi ? 'सरकारी सेवाओं का आपका एकीकृत पोर्टल, सभी सेवाएँ एक ही जगह पर।' : 'Your gateway to government services, all in one place.'}
            </p>

            {/* 3 Value Pills with Glassmorphic Style */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              {/* Pill 1 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                borderRadius: '12px',
                padding: '0.45rem 0.85rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={15} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0F172A' }}>
                    {isHindi ? 'एक पहचान' : 'One Identity'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    {isHindi ? 'अनेक सेवाओं तक पहुंच' : 'Access multiple services'}
                  </div>
                </div>
              </div>

              {/* Pill 2 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                borderRadius: '12px',
                padding: '0.45rem 0.85rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={15} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0F172A' }}>
                    {isHindi ? 'सुरक्षित व सत्यापित' : 'Secure & Verified'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    {isHindi ? 'आपका डेटा पूर्णतः सुरक्षित' : 'Your data is protected'}
                  </div>
                </div>
              </div>

              {/* Pill 3 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                borderRadius: '12px',
                padding: '0.45rem 0.85rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={15} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0F172A' }}>
                    {isHindi ? 'त्वरित सेवाएँ' : 'Faster Services'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    {isHindi ? 'समय बचाएं, डिजिटल अपनाएं' : 'Save time, go digital'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Tagline Glass Card */}
          <div style={{
            textAlign: 'right',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '0.9rem 1.35rem',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
          }}>
            <div style={{
              fontSize: '0.925rem',
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.01em',
              lineHeight: 1.35
            }}>
              {isHindi ? (
                <span>&ldquo;सशक्त कल के लिए<br />डिजिटल भारत।&rdquo;</span>
              ) : (
                <span>&ldquo;Digital India for<br />a Stronger Tomorrow.&rdquo;</span>
              )}
            </div>
            <div style={{
              height: '3px',
              width: '60px',
              background: 'linear-gradient(90deg, #FF9933 0%, #138808 100%)',
              borderRadius: '9999px',
              marginTop: '0.45rem',
              marginLeft: 'auto'
            }} />
          </div>
        </div>
      </div>

      {/* =========================================================
          2. ROW 1: My Digital Identity (Left) + Quick Actions (Right)
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.08fr 1fr',
        gap: '1.25rem',
        alignItems: 'stretch'
      }}>
        {/* Card 1: My Digital Identity */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          padding: '1.35rem 1.5rem',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}>
          {/* Card Title Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {isHindi ? 'मेरी डिजिटल पहचान' : 'My Digital Identity'}
            </h3>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 0 }}>
              <MoreVertical size={16} />
            </button>
          </div>

          {/* Inside Identity Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '95px 1fr 115px', gap: '1.15rem', alignItems: 'center' }}>
            {/* User Photo */}
            <img
              src="/assets/avatar_pankaj.jpg"
              alt="Pankaj Kumar"
              style={{
                width: '95px',
                height: '110px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1.5px solid #CBD5E1',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
              onError={(e) => { e.currentTarget.src = '/assets/favicon.png'; }}
            />

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                  Pankaj Kumar
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  background: '#DCFCE7',
                  color: '#16A34A',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}>
                  <Check size={11} /> {isHindi ? 'सत्यापित' : 'Verified'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#475569' }}>
                <User size={13} color="#2563EB" />
                <span>{isHindi ? 'परिवार आईडी: ' : 'Family ID: '}<strong>FAM1234567890</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#475569' }}>
                <Phone size={13} color="#2563EB" />
                <span>{isHindi ? 'मोबाइल: ' : 'Mobile: '}+91 9876543210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#475569' }}>
                <MapPin size={13} color="#2563EB" />
                <span>{isHindi ? 'स्थान: नोएडा, उत्तर प्रदेश' : 'Location: Noida, Uttar Pradesh'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#475569' }}>
                <Users size={13} color="#2563EB" />
                <span>{isHindi ? 'परिवार के सदस्य: ' : 'Family Members: '}<strong>5</strong></span>
              </div>
            </div>

            {/* QR Code & Button */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: '#FFFFFF',
                padding: '0.4rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}>
                <QrCode size={64} color="#0F172A" />
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, margin: '0.25rem 0 0.45rem 0' }}>
                {isHindi ? 'पहचान साझा करने हेतु स्कैन करें' : 'Scan to share your ID'}
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('digital_id')}
                style={{
                  background: '#1D4ED8',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>{isHindi ? 'डिजिटल आईडी देखें' : 'View Digital ID'}</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>

          {/* Bottom Wave Ribbon Decoration */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '180px',
            height: '4px',
            background: 'linear-gradient(90deg, #FF9933 0%, #138808 100%)',
            borderBottomLeftRadius: '18px'
          }} />
        </div>

        {/* Card 2: Quick Actions */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          padding: '1.35rem 1.5rem',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {isHindi ? 'त्वरित कार्य' : 'Quick Actions'}
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('services')}
              style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
            >
              <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Quick Action Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '0.65rem' }}>
            {/* Action 1 */}
            <div
              onClick={onAddFamilyClick}
              style={{
                background: '#FFF7ED',
                border: '1px solid #FFEDD5',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.16s ease, box-shadow 0.16s ease'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#FFEDD5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.4rem auto'
              }}>
                <UserPlus size={16} color="#EA580C" />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                {isHindi ? 'परिवार सदस्य जोड़ें' : 'Add Family Member'}
              </div>
            </div>

            {/* Action 2 */}
            <div
              onClick={() => onNavigateTab('digital_id')}
              style={{
                background: '#EFF6FF',
                border: '1px solid #DBEAFE',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.4rem auto'
              }}>
                <Download size={16} color="#2563EB" />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                {isHindi ? 'डिजिटल आईडी डाउनलोड' : 'Download Digital ID'}
              </div>
            </div>

            {/* Action 3 */}
            <div
              onClick={() => showPortalToast(isHindi ? 'ई-केवाईसी सत्यापन सक्रिय है।' : 'e-KYC verification active.')}
              style={{
                background: '#F0FDF4',
                border: '1px solid #DCFCE7',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.4rem auto'
              }}>
                <Fingerprint size={16} color="#16A34A" />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                {isHindi ? 'ई-केवाईसी अपडेट' : 'Update e-KYC'}
              </div>
            </div>

            {/* Action 4 */}
            <div
              onClick={() => onNavigateTab('applications')}
              style={{
                background: '#FFF1F2',
                border: '1px solid #FFE4E6',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#FFE4E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.4rem auto'
              }}>
                <Search size={16} color="#E11D48" />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                {isHindi ? 'आवेदन ट्रैक करें' : 'Track Application'}
              </div>
            </div>

            {/* Action 5 */}
            <div
              onClick={() => onNavigateTab('appointments')}
              style={{
                background: '#FFFBEB',
                border: '1px solid #FEF3C7',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.4rem auto'
              }}>
                <Calendar size={16} color="#D97706" />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                {isHindi ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}
              </div>
            </div>

            {/* Action 6 */}
            <div
              onClick={() => onNavigateTab('wallet')}
              style={{
                background: '#F0F9FF',
                border: '1px solid #E0F2FE',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.4rem auto'
              }}>
                <CreditCard size={16} color="#0284C7" />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                {isHindi ? 'दस्तावेज़ वॉलेट' : 'Document Wallet'}
              </div>
            </div>

            {/* Action 7 */}
            <div
              onClick={() => onNavigateTab('certificates')}
              style={{
                background: '#ECFDF5',
                border: '1px solid #D1FAE5',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.4rem auto'
              }}>
                <FileCheck size={16} color="#059669" />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                {isHindi ? 'प्रमाण पत्र आवेदन' : 'Apply for Certificate'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. ROW 2: Continue Your Application (Left) + Upcoming Appointments (Right)
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.18fr 0.82fr',
        gap: '1.25rem',
        alignItems: 'stretch'
      }}>
        {/* Card 1: Continue Your Application */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          padding: '1.35rem 1.5rem',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {isHindi ? 'अपना आवेदन जारी रखें' : 'Continue Your Application'}
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('applications')}
              style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
            >
              <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Scheme Info Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #DBEAFE'
              }}>
                <FileText size={18} color="#2563EB" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
                  {isHindi ? 'आयुष्मान भारत आवेदन' : 'Ayushman Bharat Application'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  {isHindi ? 'संदर्भ सं.: ' : 'Reference No: '}<strong>AB20241022001</strong>
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: '#FFF7ED',
              border: '1px solid #FFEDD5',
              color: '#EA580C',
              fontSize: '0.74rem',
              fontWeight: 700
            }}>
              <Clock size={12} /> {isHindi ? 'सत्यापन प्रक्रियाधीन' : 'Verification in progress'}
            </span>
          </div>

          {/* Stepper Timeline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', margin: '0.5rem 0 1.25rem 0' }}>
            {/* Step Line */}
            <div style={{
              position: 'absolute',
              top: '11px',
              left: '20px',
              right: '20px',
              height: '2px',
              background: '#E2E8F0',
              zIndex: 1
            }} />
            <div style={{
              position: 'absolute',
              top: '11px',
              left: '20px',
              width: '33%',
              height: '2px',
              background: '#2563EB',
              zIndex: 2
            }} />

            {/* Step 1: Applied */}
            <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#16A34A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 0 0 4px #FFFFFF'
              }}>
                <Check size={12} />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', marginTop: '0.35rem' }}>
                {isHindi ? 'आवेदन किया' : 'Applied'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748B' }}>22 Oct 2026</div>
            </div>

            {/* Step 2: Verification */}
            <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 0 0 4px #DBEAFE'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB', marginTop: '0.35rem' }}>
                {isHindi ? 'सत्यापन' : 'Verification'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748B' }}>24 Oct 2026</div>
            </div>

            {/* Step 3: Approved */}
            <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 0 0 4px #FFFFFF'
              }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', marginTop: '0.35rem' }}>
                {isHindi ? 'स्वीकृत' : 'Approved'}
              </div>
            </div>

            {/* Step 4: Card Ready */}
            <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 0 0 4px #FFFFFF'
              }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', marginTop: '0.35rem' }}>
                {isHindi ? 'कार्ड तैयार' : 'Card Ready'}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => onNavigateTab('applications')}
              style={{
                border: '1px solid #BFDBFE',
                background: '#EFF6FF',
                color: '#1D4ED8',
                borderRadius: '8px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>{isHindi ? 'स्थिति ट्रैक करें' : 'Track Status'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Card 2: Upcoming Appointments */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          padding: '1.35rem 1.5rem',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {isHindi ? 'आगामी अपॉइंटमेंट्स' : 'Upcoming Appointments'}
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('appointments')}
              style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
            >
              <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* 2 Appointment Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Row 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.75rem',
              borderRadius: '12px',
              border: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563EB', lineHeight: 1 }}>24</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748B' }}>
                    {isHindi ? 'अक्तू' : 'OCT'}
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.825rem', color: '#0F172A' }}>
                    {isHindi ? 'जनसंवाद केंद्र, नोएडा' : 'Jansamvaad Kendra, Noida'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? '10:30 पूर्वाह्न - 11:00 पूर्वाह्न • दस्तावेज़ सत्यापन (e-KYC)' : '10:30 AM - 11:00 AM • Document Verification (e-KYC)'}
                  </div>
                </div>
              </div>

              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: '#DCFCE7',
                color: '#16A34A',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {isHindi ? 'पुष्टीकृत' : 'Confirmed'}
              </span>
            </div>

            {/* Row 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.75rem',
              borderRadius: '12px',
              border: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563EB', lineHeight: 1 }}>12</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748B' }}>
                    {isHindi ? 'नवं' : 'NOV'}
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.825rem', color: '#0F172A' }}>
                    {isHindi ? 'पासपोर्ट सेवा केंद्र' : 'Passport Seva Kendra'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? '11:00 पूर्वाह्न - 11:30 पूर्वाह्न • पासपोर्ट आवेदन' : '11:00 AM - 11:30 AM • Passport Application'}
                  </div>
                </div>
              </div>

              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: '#EFF6FF',
                border: '1px solid #DBEAFE',
                color: '#2563EB',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {isHindi ? 'निर्धारित' : 'Scheduled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          4. ROW 3: Popular Government Schemes (5 Cards Grid)
          ========================================================= */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        padding: '1.35rem 1.5rem',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {isHindi ? 'लोकप्रिय सरकारी योजनाएँ' : 'Popular Government Schemes'}
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('schemes')}
            style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
          >
            <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* 5 Scheme Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.85rem' }}>
          {/* Scheme 1: Ayushman Bharat */}
          <div style={{
            background: '#F0F7FF',
            border: '1px solid #DBEAFE',
            borderRadius: '14px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.65rem'
              }}>
                <Shield size={18} color="#2563EB" />
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                {isHindi ? 'आयुष्मान भारत' : 'Ayushman Bharat'}
              </h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>
                {isHindi ? 'आपके परिवार के लिए मुफ्त स्वास्थ्य उपचार' : 'Free healthcare for your family'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onApplyScheme) {
                  onApplyScheme({
                    schemeId: 'SCHEME-PMJAY',
                    schemeName: isHindi ? 'आयुष्मान भारत (PM-JAY)' : 'Ayushman Bharat (PM-JAY)',
                    beneficiaryName: user?.name || (isHindi ? 'रमेश कुमार शर्मा' : 'Ramesh Kumar Sharma'),
                    benefit: isHindi ? '₹5,00,000 / वर्ष मुफ्त स्वास्थ्य सुरक्षा' : '₹5,00,000 / year Free Healthcare Cover',
                    familyId: family?.id || 'FAM-2024-001'
                  });
                } else {
                  onNavigateTab('schemes');
                }
              }}
              style={{
                width: '100%',
                padding: '0.42rem 0',
                borderRadius: '8px',
                border: '1px solid #BFDBFE',
                background: '#FFFFFF',
                color: '#2563EB',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <span>{isHindi ? 'आवेदन करें' : 'Apply Now'}</span>
              <ArrowRight size={11} />
            </button>
          </div>

          {/* Scheme 2: PM-KISAN */}
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #DCFCE7',
            borderRadius: '14px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.65rem'
              }}>
                <Sprout size={18} color="#16A34A" />
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                {isHindi ? 'पीएम-किसान' : 'PM-KISAN'}
              </h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>
                {isHindi ? 'किसानों के लिए प्रत्यक्ष आय सहायता' : 'Direct income support to farmers'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onApplyScheme) {
                  onApplyScheme({
                    schemeId: 'SCHEME-PMKISAN',
                    schemeName: isHindi ? 'पीएम-किसान सम्मान निधि' : 'PM-KISAN Samman Nidhi',
                    beneficiaryName: user?.name || (isHindi ? 'रमेश कुमार शर्मा' : 'Ramesh Kumar Sharma'),
                    benefit: isHindi ? '₹6,000 / वर्ष प्रत्यक्ष आय सहायता' : '₹6,000 / year Direct Income Support',
                    familyId: family?.id || 'FAM-2024-001'
                  });
                } else {
                  onNavigateTab('schemes');
                }
              }}
              style={{
                width: '100%',
                padding: '0.42rem 0',
                borderRadius: '8px',
                border: '1px solid #BBF7D0',
                background: '#FFFFFF',
                color: '#16A34A',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <span>{isHindi ? 'आवेदन करें' : 'Apply Now'}</span>
              <ArrowRight size={11} />
            </button>
          </div>

          {/* Scheme 3: Ujjwala Yojana */}
          <div style={{
            background: '#FFF7ED',
            border: '1px solid #FFEDD5',
            borderRadius: '14px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#FFEDD5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.65rem'
              }}>
                <Flame size={18} color="#EA580C" />
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                {isHindi ? 'उज्ज्वला योजना' : 'Ujjwala Yojana'}
              </h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>
                {isHindi ? 'स्वस्थ घरों के लिए स्वच्छ रसोई गैस' : 'Clean cooking fuel for healthier homes'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onApplyScheme) {
                  onApplyScheme({
                    schemeId: 'SCHEME-PMUY',
                    schemeName: isHindi ? 'प्रधानमंत्री उज्ज्वला योजना (PMUY 2.0)' : 'Pradhan Mantri Ujjwala Yojana (PMUY 2.0)',
                    beneficiaryName: user?.name || (isHindi ? 'रमेश कुमार शर्मा' : 'Ramesh Kumar Sharma'),
                    benefit: isHindi ? 'मुफ्त एलपीजी कनेक्शन + पहला सिलेंडर सब्सिडी' : 'Free LPG Connection + First Cylinder & Stove Subsidy',
                    familyId: family?.id || 'FAM-2024-001'
                  });
                } else {
                  onNavigateTab('schemes');
                }
              }}
              style={{
                width: '100%',
                padding: '0.42rem 0',
                borderRadius: '8px',
                border: '1px solid #FED7AA',
                background: '#FFFFFF',
                color: '#EA580C',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <span>{isHindi ? 'आवेदन करें' : 'Apply Now'}</span>
              <ArrowRight size={11} />
            </button>
          </div>

          {/* Scheme 4: PM Awas Yojana */}
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #DBEAFE',
            borderRadius: '14px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.65rem'
              }}>
                <Home size={18} color="#2563EB" />
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                {isHindi ? 'पीएम आवास योजना' : 'PM Awas Yojana'}
              </h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>
                {isHindi ? 'सभी के लिए किफायती पक्का आवास' : 'Affordable housing for all'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onApplyScheme) {
                  onApplyScheme({
                    schemeId: 'SCHEME-PMAY',
                    schemeName: isHindi ? 'प्रधानमंत्री आवास योजना (PMAY)' : 'Pradhan Mantri Awas Yojana (PMAY)',
                    beneficiaryName: user?.name || (isHindi ? 'रमेश कुमार शर्मा' : 'Ramesh Kumar Sharma'),
                    benefit: isHindi ? '₹1,20,000 - ₹2,50,000 निर्माण सब्सिडी' : '₹1,20,000 - ₹2,50,000 Construction Subsidy',
                    familyId: family?.id || 'FAM-2024-001'
                  });
                } else {
                  onNavigateTab('schemes');
                }
              }}
              style={{
                width: '100%',
                padding: '0.42rem 0',
                borderRadius: '8px',
                border: '1px solid #BFDBFE',
                background: '#FFFFFF',
                color: '#2563EB',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <span>{isHindi ? 'आवेदन करें' : 'Apply Now'}</span>
              <ArrowRight size={11} />
            </button>
          </div>

          {/* Scheme 5: Scholarship Portal */}
          <div style={{
            background: '#FAF5FF',
            border: '1px solid #F3E8FF',
            borderRadius: '14px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.65rem'
              }}>
                <GraduationCap size={18} color="#9333EA" />
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                {isHindi ? 'छात्रवृत्ति पोर्टल' : 'Scholarship Portal'}
              </h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>
                {isHindi ? 'छात्रों के लिए शिक्षा वित्तीय सहायता' : 'Education support for students'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onApplyScheme) {
                  onApplyScheme({
                    schemeId: 'SCHEME-NSP',
                    schemeName: isHindi ? 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)' : 'National Scholarship Portal (Pre & Post Matric)',
                    beneficiaryName: user?.name || (isHindi ? 'रमेश कुमार शर्मा' : 'Ramesh Kumar Sharma'),
                    benefit: isHindi ? '₹12,000 - ₹50,000 / वर्ष छात्रवृत्ति सहायता' : '₹12,000 - ₹50,000 / year Academic Fee Reversal',
                    familyId: family?.id || 'FAM-2024-001'
                  });
                } else {
                  onNavigateTab('schemes');
                }
              }}
              style={{
                width: '100%',
                padding: '0.42rem 0',
                borderRadius: '8px',
                border: '1px solid #E9D5FF',
                background: '#FFFFFF',
                color: '#9333EA',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <span>{isHindi ? 'आवेदन करें' : 'Apply Now'}</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          5. ROW 4: Services by Category (10 Categories 5x2 Grid)
          ========================================================= */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        padding: '1.35rem 1.5rem',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {isHindi ? 'श्रेणी अनुसार सेवाएँ' : 'Services by Category'}
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
              {isHindi ? 'प्रत्यक्ष सेवा पोर्टल खोलने के लिए किसी भी श्रेणी पर क्लिक करें' : 'Click any category to open its direct service portal modal'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('services')}
            style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
          >
            <span>{isHindi ? 'संपूर्ण सेवा निर्देशिका देखें' : 'View Full Services Directory'}</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* 10 Colorful Categories (5x2 Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.85rem' }}>
          {/* Cat 1: Identity & Documents */}
          <div
            onClick={() => setActiveCategoryKey('identity')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'identity' ? '1px solid #2563EB' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'identity' ? '#EFF6FF' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#EFF6FF';
              e.currentTarget.style.borderColor = '#BFDBFE';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'identity') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={17} color="#2563EB" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'पहचान व दस्तावेज़' : 'Identity & Documents'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'आधार, पैन, प्रमाण पत्र' : 'Aadhaar, PAN, Certificates'}
              </div>
            </div>
          </div>

          {/* Cat 2: Health & Welfare */}
          <div
            onClick={() => setActiveCategoryKey('health')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'health' ? '1px solid #E11D48' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'health' ? '#FFF1F2' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFF1F2';
              e.currentTarget.style.borderColor = '#FECDD3';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'health') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={17} color="#E11D48" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'स्वास्थ्य व कल्याण' : 'Health & Welfare'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'आयुष्मान भारत, टीका' : 'Ayushman Bharat, Vaccine'}
              </div>
            </div>
          </div>

          {/* Cat 3: Education */}
          <div
            onClick={() => setActiveCategoryKey('education')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'education' ? '1px solid #9333EA' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'education' ? '#FAF5FF' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FAF5FF';
              e.currentTarget.style.borderColor = '#E9D5FF';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'education') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={17} color="#9333EA" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'शिक्षा व छात्रवृत्ति' : 'Education'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'छात्रवृत्ति, प्रवेश' : 'Scholarships, Admissions'}
              </div>
            </div>
          </div>

          {/* Cat 4: Agriculture */}
          <div
            onClick={() => setActiveCategoryKey('agriculture')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'agriculture' ? '1px solid #16A34A' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'agriculture' ? '#F0FDF4' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F0FDF4';
              e.currentTarget.style.borderColor = '#BBF7D0';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'agriculture') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sprout size={17} color="#16A34A" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'कृषि व किसान' : 'Agriculture'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'पीएम-किसान, मृदा कार्ड' : 'PM-KISAN, Soil Card'}
              </div>
            </div>
          </div>

          {/* Cat 5: Housing */}
          <div
            onClick={() => setActiveCategoryKey('housing')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'housing' ? '1px solid #EA580C' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'housing' ? '#FFF7ED' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFF7ED';
              e.currentTarget.style.borderColor = '#FED7AA';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'housing') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Home size={17} color="#EA580C" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'आवास योजना' : 'Housing'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'पीएम आवास योजना' : 'PM Awas Yojana'}
              </div>
            </div>
          </div>

          {/* Cat 6: Employment */}
          <div
            onClick={() => setActiveCategoryKey('employment')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'employment' ? '1px solid #9333EA' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'employment' ? '#FAF5FF' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FAF5FF';
              e.currentTarget.style.borderColor = '#E9D5FF';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'employment') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Briefcase size={17} color="#9333EA" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'रोजगार व कौशल' : 'Employment'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'नौकरियां, कौशल विकास' : 'Jobs, Skill Development'}
              </div>
            </div>
          </div>

          {/* Cat 7: Transport */}
          <div
            onClick={() => setActiveCategoryKey('transport')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'transport' ? '1px solid #0284C7' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'transport' ? '#F0F9FF' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F0F9FF';
              e.currentTarget.style.borderColor = '#BAE6FD';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'transport') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Car size={17} color="#0284C7" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'परिवहन व वाहन' : 'Transport'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'ड्राइविंग लाइसेंस, आरसी' : 'Driving License, RC'}
              </div>
            </div>
          </div>

          {/* Cat 8: Utilities */}
          <div
            onClick={() => setActiveCategoryKey('utilities')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'utilities' ? '1px solid #D97706' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'utilities' ? '#FFFBEB' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFFBEB';
              e.currentTarget.style.borderColor = '#FDE68A';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'utilities') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={17} color="#D97706" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'नागरिक सुविधाएँ' : 'Utilities'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'बिजली, पानी, गैस' : 'Electricity, Water, Gas'}
              </div>
            </div>
          </div>

          {/* Cat 9: Business */}
          <div
            onClick={() => setActiveCategoryKey('business')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'business' ? '1px solid #4F46E5' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'business' ? '#EEF2FF' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#EEF2FF';
              e.currentTarget.style.borderColor = '#C7D2FE';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'business') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={17} color="#4F46E5" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'व्यापार व उद्योग' : 'Business'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'पंजीकरण, एमएसएमई' : 'Registrations, MSME'}
              </div>
            </div>
          </div>

          {/* Cat 10: Grievances */}
          <div
            onClick={() => setActiveCategoryKey('grievances')}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: activeCategoryKey === 'grievances' ? '1px solid #E11D48' : '1px solid #F1F5F9',
              background: activeCategoryKey === 'grievances' ? '#FFF1F2' : '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.16s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFF1F2';
              e.currentTarget.style.borderColor = '#FECDD3';
            }}
            onMouseLeave={(e) => {
              if (activeCategoryKey !== 'grievances') {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#F1F5F9';
              }
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageSquareWarning size={17} color="#E11D48" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0F172A' }}>
                {isHindi ? 'शिकायत निवारण' : 'Grievances'}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#64748B' }}>
                {isHindi ? 'शिकायत दर्ज व ट्रैक करें' : 'Lodge & Track Issues'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          6. MODAL: Specific Category Service Portal Modal Dialog
          Keeps items sorted without navigating full screen!
          ========================================================= */}
      {activeCategoryKey && activeCategory && (
        <div
          className="modal-overlay"
          onClick={() => setActiveCategoryKey(null)}
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
            padding: '1.25rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              border: '1px solid #E2E8F0',
              padding: '1.5rem',
              position: 'relative'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: activeCategory.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {React.createElement(activeCategory.icon, { size: 22, color: activeCategory.iconColor })}
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {isHindi ? (CATEGORY_PORTALS_HI[activeCategoryKey]?.title || activeCategory.title) : activeCategory.title}
                    </h3>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: '#EFF6FF',
                      color: '#2563EB',
                      border: '1px solid #DBEAFE',
                      borderRadius: '9999px',
                      padding: '0.15rem 0.55rem'
                    }}>
                      {isHindi ? '🟢 सक्रिय सेवाएँ' : '🟢 Live Services'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.2rem' }}>
                    {isHindi ? (CATEGORY_PORTALS_HI[activeCategoryKey]?.subtitle || activeCategory.subtitle) : activeCategory.subtitle} • <span style={{ fontWeight: 600, color: '#475569' }}>{isHindi ? (CATEGORY_PORTALS_HI[activeCategoryKey]?.badge || activeCategory.badge) : activeCategory.badge}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCategoryKey(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Services List for this specific category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activeCategory.services.map((svc, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '1rem 1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                        {svc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem', lineHeight: 1.4 }}>
                        {svc.desc}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: '#F1F5F9',
                      color: '#475569',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      {isHindi ? (svc.fee === 'Free' ? 'निःशुल्क' : (svc.fee === 'Subsidized' ? 'सब्सिडी प्राप्त' : svc.fee)) : svc.fee}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px dashed #E2E8F0',
                    paddingTop: '0.65rem',
                    marginTop: '0.15rem'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                      {isHindi ? 'विभाग:' : 'Dept:'} <strong style={{ color: '#475569' }}>{svc.dept}</strong> • {isHindi ? 'निस्तारण अवधि:' : 'Turnaround:'} <strong style={{ color: '#2563EB' }}>{svc.turnaround}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (svc.actionType === 'apply_scheme') {
                          setActiveCategoryKey(null);
                          if (onApplyScheme) {
                            onApplyScheme({
                              schemeId: svc.schemeData.schemeId,
                              schemeName: svc.schemeData.schemeName,
                              beneficiaryName: user?.name || (isHindi ? 'रमेश कुमार शर्मा' : 'Ramesh Kumar Sharma'),
                              benefit: svc.schemeData.benefit,
                              familyId: family?.id || 'FAM-2024-001'
                            });
                          } else {
                            onNavigateTab('schemes');
                          }
                        } else if (svc.actionType === 'navigate') {
                          setActiveCategoryKey(null);
                          onNavigateTab(svc.targetTab);
                        } else {
                          showPortalToast(svc.toastMsg || `Connected to ${svc.name}`);
                        }
                      }}
                      style={{
                        background: '#2563EB',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.45rem 0.95rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                    >
                      <span>{isHindi ? 'पोर्टल खोलें' : svc.actionLabel}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '1.25rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                {isHindi ? 'जन पहचान एकीकृत नागरिक सेवा पोर्टल' : 'Jan Pehchaan Unified Citizen Service Gateway'}
              </div>
              <button
                type="button"
                onClick={() => setActiveCategoryKey(null)}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#475569',
                  borderRadius: '8px',
                  padding: '0.45rem 1.15rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OverviewTab;
