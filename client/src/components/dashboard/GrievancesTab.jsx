import React, { useState, useMemo } from 'react';
import {
  Search,
  MessageSquareWarning,
  FileEdit,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  MoreVertical,
  Droplets,
  Zap,
  Milestone,
  FileText,
  HeartHandshake,
  Landmark,
  Headphones,
  Upload,
  AlertTriangle,
  ArrowRight,
  Send,
  Eye,
  Check,
  ShieldAlert,
  Building2,
  Bell,
  Lock
} from 'lucide-react';

export function GrievancesTab({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  // Filter and search state
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, OPEN, IN_PROGRESS, RESOLVED
  const [trackQuery, setTrackQuery] = useState('');
  const [sortBy, setSortBy] = useState('LATEST');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedGrievanceForDetails, setSelectedGrievanceForDetails] = useState(null);
  const [trackModalGrievance, setTrackModalGrievance] = useState(null);

  // Form State for New Grievance
  const [newCategory, setNewCategory] = useState('Water & Sanitation');
  const [isCategoryFixed, setIsCategoryFixed] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('Sector 62, Noida');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Grievances list matching reference image exactly
  const [grievances, setGrievances] = useState([
    {
      id: 'JP-2026-00124',
      num: 1,
      subject: 'Water supply issue',
      subjectHi: 'पेयजल आपूर्ति की समस्या',
      subjectDesc: 'Low water supply in my area.',
      subjectDescHi: 'क्षेत्र में पिछले तीन दिनों से पानी का दबाव अत्यंत कम है।',
      department: 'Municipal Services',
      departmentHi: 'नगर निगम सेवाएं (जलकल विभाग)',
      submittedOn: '18 Oct 2026',
      submittedOnHi: '18 अक्टूबर 2026',
      status: 'OPEN',
      statusLabel: 'Open',
      statusLabelHi: 'लंबित',
      officer: 'Sunil Verma (Junior Engineer, Jal Board)',
      officerHi: 'सुनील वर्मा (कनिष्ठ अभियंता, जल बोर्ड)',
      slaDays: '3 days remaining',
      slaDaysHi: '3 दिन शेष',
      timeline: [
        { date: '18 Oct 2026, 09:30 AM', dateHi: '18 अक्टू 2026, 09:30 पूर्वाह्न', title: 'Grievance Registered', titleHi: 'शिकायत दर्ज की गई', done: true, desc: 'Complaint registered by citizen.', descHi: 'नागरिक द्वारा जन पहचान पोर्टल पर शिकायत दर्ज की गई।' },
        { date: '19 Oct 2026, 11:00 AM', dateHi: '19 अक्टू 2026, 11:00 पूर्वाह्न', title: 'Acknowledged', titleHi: 'स्वीकृत एवं अग्रेषित', done: true, desc: 'Assigned to Municipal Water Supply Desk.', descHi: 'नगर निगम जल आपूर्ति डेस्क को जांच हेतु सौंपी गई।' },
        { date: 'Pending', dateHi: 'प्रतीक्षित', title: 'Site Inspection & Action', titleHi: 'स्थलीय निरीक्षण व कार्रवाई', active: true, desc: 'Pipeline pressure test scheduled.', descHi: 'पाइपलाइन प्रेशर जांच व मरम्मत कार्य निर्धारित।' },
        { date: 'Pending', dateHi: 'प्रतीक्षित', title: 'Resolved', titleHi: 'समाधानित', pending: true, desc: 'Final resolution report.', descHi: 'अंतिम समाधान रिपोर्ट एवं नागरिक सत्यापन।' }
      ]
    },
    {
      id: 'JP-2026-00109',
      num: 2,
      subject: 'Streetlight not working',
      subjectHi: 'स्ट्रीट लाइट खराब होने की शिकायत',
      subjectDesc: 'Streetlight not working near Sector 62.',
      subjectDescHi: 'सेक्टर 62 मुख्य मार्ग पर 4 स्ट्रीट लाइटें बंद पड़ी हैं।',
      department: 'Public Works',
      departmentHi: 'लोक निर्माण विभाग (विद्युत शाखा)',
      submittedOn: '14 Oct 2026',
      submittedOnHi: '14 अक्टूबर 2026',
      status: 'IN_PROGRESS',
      statusLabel: 'In Progress',
      statusLabelHi: 'प्रगति पर',
      officer: 'Anil Kumar (PWD Electrical Wing)',
      officerHi: 'अनिल कुमार (पीडब्ल्यूडी विद्युत शाखा)',
      slaDays: '1 day remaining',
      slaDaysHi: '1 दिन शेष',
      timeline: [
        { date: '14 Oct 2026, 08:15 PM', dateHi: '14 अक्टू 2026, 08:15 अपराह्न', title: 'Grievance Registered', titleHi: 'शिकायत दर्ज की गई', done: true, desc: 'Complaint registered by citizen.', descHi: 'नागरिक द्वारा शिकायत दर्ज की गई।' },
        { date: '15 Oct 2026, 10:00 AM', dateHi: '15 अक्टू 2026, 10:00 पूर्वाह्न', title: 'Acknowledged', titleHi: 'स्वीकृत', done: true, desc: 'Assigned to Sector 62 Maintenance Wing.', descHi: 'सेक्टर 62 अनुरक्षण विंग को कार्य आवंटित।' },
        { date: '16 Oct 2026, 03:30 PM', dateHi: '16 अक्टू 2026, 03:30 अपराह्न', title: 'Technician Dispatched', titleHi: 'तकनीशियन रवाना', active: true, desc: 'New LED fitting fixture under replacement.', descHi: 'नए एलईडी बल्ब व वायरिंग बदलने का कार्य प्रगति पर।' },
        { date: 'Pending', dateHi: 'प्रतीक्षित', title: 'Resolved', titleHi: 'समाधानित', pending: true, desc: 'Night verification inspection.', descHi: 'रात्रिकालीन सत्यापन एवं नागरिक को संदेश।' }
      ]
    },
    {
      id: 'JP-2026-00087',
      num: 3,
      subject: 'Certificate delay',
      subjectHi: 'आय प्रमाण पत्र जारी होने में विलंब',
      subjectDesc: 'Income certificate pending for more than 2 weeks.',
      subjectDescHi: 'निर्धारित समय-सीमा से अधिक समय से आय प्रमाण पत्र लंबित है।',
      department: 'Citizen Services',
      departmentHi: 'नागरिक सेवाएं (राजस्व तहसील)',
      submittedOn: '08 Oct 2026',
      submittedOnHi: '08 अक्टूबर 2026',
      status: 'RESOLVED',
      statusLabel: 'Resolved',
      statusLabelHi: 'समाधानित',
      officer: 'Meera Saxena (Tehsildar Desk)',
      officerHi: 'मीरा सक्सेना (तहसीलदार डेस्क)',
      slaDays: 'Resolved in 4 days',
      slaDaysHi: '4 दिनों में समाधानित',
      timeline: [
        { date: '08 Oct 2026, 11:20 AM', dateHi: '08 अक्टू 2026, 11:20 पूर्वाह्न', title: 'Grievance Registered', titleHi: 'शिकायत दर्ज की गई', done: true, desc: 'Expedited application request logged.', descHi: 'त्वरित निस्तारण का अनुरोध दर्ज किया गया।' },
        { date: '09 Oct 2026, 02:00 PM', dateHi: '09 अक्टू 2026, 02:00 अपराह्न', title: 'Under Review', titleHi: 'सत्यापनाधीन', done: true, desc: 'Tehsil revenue clerk verified files.', descHi: 'तहसील राजस्व लिपिक द्वारा दस्तावेजों की जांच पूर्ण।' },
        { date: '12 Oct 2026, 04:45 PM', dateHi: '12 अक्टू 2026, 04:45 अपराह्न', title: 'Certificate Digitally Signed', titleHi: 'डिजिटल हस्ताक्षर पूर्ण', done: true, desc: 'Income certificate issued to citizen Document Wallet.', descHi: 'आय प्रमाण पत्र जारी कर दस्तावेज वॉलेट में जोड़ दिया गया।' },
        { date: '12 Oct 2026, 05:00 PM', dateHi: '12 अक्टू 2026, 05:00 अपराह्न', title: 'Resolved', titleHi: 'सफलतापूर्वक निस्तारित', done: true, desc: 'Grievance successfully resolved.', descHi: 'शिकायत का सफलतापूर्वक समाधान कर बंद किया गया।' }
      ]
    },
    {
      id: 'JP-2026-00064',
      num: 4,
      subject: 'Pension query',
      subjectHi: 'पेंशन डीबीटी स्थिति अद्यतन न होना',
      subjectDesc: 'Pension status not updated in portal.',
      subjectDescHi: 'वृद्धावस्था पेंशन की डीबीटी स्थिति पोर्टल पर प्रदर्शित नहीं हो रही।',
      department: 'Social Welfare',
      departmentHi: 'समाज कल्याण विभाग',
      submittedOn: '02 Oct 2026',
      submittedOnHi: '02 अक्टूबर 2026',
      status: 'RESOLVED',
      statusLabel: 'Resolved',
      statusLabelHi: 'समाधानित',
      officer: 'Rajendra Singh (District Social Welfare Officer)',
      officerHi: 'राजेंद्र सिंह (जिला समाज कल्याण अधिकारी)',
      slaDays: 'Resolved in 2 days',
      slaDaysHi: '2 दिनों में समाधानित',
      timeline: [
        { date: '02 Oct 2026, 10:00 AM', dateHi: '02 अक्टू 2026, 10:00 पूर्वाह्न', title: 'Grievance Registered', titleHi: 'शिकायत दर्ज की गई', done: true, desc: 'PFMS DBT record linkage query.', descHi: 'पीएफएमएस डीबीटी रिकॉर्ड लिंकेज संबंधित शिकायत।' },
        { date: '03 Oct 2026, 11:30 AM', dateHi: '03 अक्टू 2026, 11:30 पूर्वाह्न', title: 'Database Re-synchronized', titleHi: 'डेटाबेस सिंक्रनाइज़', done: true, desc: 'Aadhaar vault DBT mapper updated.', descHi: 'आधार एनपीसीआई मैपर को पुनः अद्यतन किया गया।' },
        { date: '04 Oct 2026, 01:15 PM', dateHi: '04 अक्टू 2026, 01:15 अपराह्न', title: 'Resolved', titleHi: 'समाधानित', done: true, desc: 'Pension status active and verified.', descHi: 'पेंशन स्थिति सक्रिय व सत्यापित कर दी गई।' }
      ]
    },
    {
      id: 'JP-2026-00051',
      num: 5,
      subject: 'Property tax correction',
      subjectHi: 'गृहकर रसीद में नाम सुधार',
      subjectDesc: 'Name correction in property tax record.',
      subjectDescHi: 'नगर निगम संपत्ति कर रिकॉर्ड में नाम की वर्तनी गलत है।',
      department: 'Revenue Department',
      departmentHi: 'राजस्व विभाग / नगर निगम',
      submittedOn: '28 Sep 2026',
      submittedOnHi: '28 सितंबर 2026',
      status: 'IN_PROGRESS',
      statusLabel: 'In Progress',
      statusLabelHi: 'प्रगति पर',
      officer: 'Kavita Joshi (Municipal Revenue Assessor)',
      officerHi: 'कविता जोशी (नगर निगम राजस्व कर निर्धारण अधिकारी)',
      slaDays: '2 days remaining',
      slaDaysHi: '2 दिन शेष',
      timeline: [
        { date: '28 Sep 2026, 04:10 PM', dateHi: '28 सितं 2026, 04:10 अपराह्न', title: 'Grievance Registered', titleHi: 'शिकायत दर्ज की गई', done: true, desc: 'Correction request submitted with registry copy.', descHi: 'रजिस्ट्री प्रति के साथ सुधार आवेदन जमा किया गया।' },
        { date: '30 Sep 2026, 12:00 PM', dateHi: '30 सितं 2026, 12:00 अपराह्न', title: 'Registry Cross-Checked', titleHi: 'अभिलेख सत्यापन', done: true, desc: 'Legal deed verified in sub-registrar archive.', descHi: 'उप-निबंधक कार्यालय में कानूनी विलेख का मिलान किया गया।' },
        { date: 'In Progress', dateHi: 'प्रगति पर', title: 'Ledger Name Update', titleHi: 'खाता नाम अद्यतन', active: true, desc: 'Municipal tax receipt re-issuance.', descHi: 'संशोधित नगर पालिका कर रसीद जारी करने की प्रक्रिया।' },
        { date: 'Pending', dateHi: 'प्रतीक्षित', title: 'Resolved', titleHi: 'समाधानित', pending: true, desc: 'Final corrected receipt.', descHi: 'अंतिम संशोधित रसीद नागरिक को उपलब्ध कराई जाएगी।' }
      ]
    }
  ]);

  // Counts
  const counts = useMemo(() => {
    return {
      total: 10, // matching screenshot tab All (10)
      open: grievances.filter((g) => g.status === 'OPEN').length,
      inProgress: grievances.filter((g) => g.status === 'IN_PROGRESS').length,
      resolved: grievances.filter((g) => g.status === 'RESOLVED').length
    };
  }, [grievances]);

  // Filtered grievances
  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      if (activeFilter === 'OPEN') return g.status === 'OPEN';
      if (activeFilter === 'IN_PROGRESS') return g.status === 'IN_PROGRESS';
      if (activeFilter === 'RESOLVED') return g.status === 'RESOLVED';
      return true;
    });
  }, [grievances, activeFilter]);

  // Handle Register New Grievance
  const handleRegisterGrievance = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      showToast('Please enter a grievance subject.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newId = `JP-2026-00${Math.floor(125 + Math.random() * 50)}`;
      const newEntry = {
        id: newId,
        num: grievances.length + 1,
        subject: newSubject,
        subjectDesc: newDescription || `${newCategory} complaint lodged at ${newLocation}.`,
        department:
          newCategory === 'Water & Sanitation'
            ? 'Municipal Services'
            : newCategory === 'Electricity & Streetlights'
            ? 'Public Works'
            : newCategory === 'Roads & Infrastructure'
            ? 'Public Works'
            : newCategory === 'Certificates & Documents'
            ? 'Citizen Services'
            : newCategory === 'Pension & Social Welfare'
            ? 'Social Welfare'
            : 'Revenue Department',
        submittedOn: 'Today, 23 Oct 2026',
        status: 'OPEN',
        statusLabel: 'Open',
        officer: 'Assigned to Central Redressal Officer Desk',
        slaDays: '7 days standard SLA',
        timeline: [
          { date: 'Today, 23 Oct 2026', title: 'Grievance Registered', done: true, desc: 'Registered successfully via Jan Pehchaan.' },
          { date: 'Pending', title: 'Department Acknowledgment', active: true, desc: 'Under automated queue dispatch.' },
          { date: 'Pending', title: 'Resolution Action', pending: true, desc: 'Field officer review.' },
          { date: 'Pending', title: 'Resolved', pending: true, desc: 'Confirmation SMS sent to citizen.' }
        ]
      };

      setGrievances([newEntry, ...grievances]);
      setRegisterModalOpen(false);
      setNewSubject('');
      setNewDescription('');
      showToast(`Grievance ${newId} registered successfully!`);
    }, 900);
  };

  // Handle Track Query
  const handleTrackGrievance = () => {
    const q = trackQuery.trim().toUpperCase();
    if (!q) {
      showToast('Please enter a Grievance ID (e.g. JP-2026-00124)');
      return;
    }
    const found = grievances.find((g) => g.id.toUpperCase().includes(q));
    if (found) {
      setTrackModalGrievance(found);
    } else {
      showToast(`No grievance found with reference "${trackQuery}". Showing latest.`);
      setTrackModalGrievance(grievances[0]);
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
            <span style={{ color: '#0F172A', fontWeight: 600 }}>
              {isHindi ? 'शिकायत निवारण' : 'Grievances'}
            </span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'जन शिकायत निवारण' : 'Grievances'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'अपनी शिकायत दर्ज करें। प्रगति की निगरानी करें। समय पर समाधान प्राप्त करें।' : 'Raise your concerns. Track progress. Get timely resolution.'}
          </p>
        </div>

        {/* Right Motto Quote Card matching screenshot */}
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
              <span>हर नागरिक के लिए<br />जवाबदेह व पारदर्शी<br />शासन व्यवस्था</span>
            ) : (
              <span>&ldquo;A Responsive<br />Government for<br />Every Citizen&rdquo;</span>
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
          2. TWO-COLUMN MAIN BODY
             Left/Center (72%): Quick Actions + Status Row + Grievances Table + How It Works
             Right Sidebar (28%): Track Grievance Box + Categories + Important Info + Support
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN: WORKFLOW + ACTION CARDS + STATS + TABLE
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* SECTION 1: HOW GRIEVANCE RESOLUTION WORKS (Moved to top) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
          }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
              {isHindi ? 'शिकायत निवारण प्रक्रिया कैसे काम करती है' : 'How Grievance Resolution Works'}
            </h3>

            {/* 4 Step Horizontal Workflow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '150px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? 'शिकायत दर्ज करें' : 'Submit Grievance'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'आवश्यक विवरण और सहायक दस्तावेज संलग्न करें।' : 'Provide details and supporting documents.'}
                  </div>
                </div>
              </div>

              <span style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>→</span>

              {/* Step 2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '150px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? 'विभागीय समीक्षा' : 'Department Review'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'शिकायत की जांच कर संबंधित विभाग को प्रेषित की जाती है।' : 'Your grievance is reviewed and assigned to the department.'}
                  </div>
                </div>
              </div>

              <span style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>→</span>

              {/* Step 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '150px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#EA580C',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? 'कार्रवाई व समाधान' : 'Action & Resolution'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'संबंधित विभाग जमीनी कार्रवाई कर समस्या का समाधान करता है।' : 'Department takes action and resolves the issue.'}
                  </div>
                </div>
              </div>

              <span style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>→</span>

              {/* Step 4 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '150px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#7E22CE',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  4
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? 'नागरिक को सूचना' : 'You Get Notified'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'डैशबोर्ड और एसएमएस पर समाधान की पुष्टि प्राप्त करें।' : 'Track status and receive updates on your dashboard.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 1: Two Large Action Cards matching screenshot */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Card 1: Register a Grievance */}
            <div
              onClick={() => {
                setIsCategoryFixed(false);
                setRegisterModalOpen(true);
              }}
              style={{
                background: '#F0F7FF',
                border: '1px solid #DBEAFE',
                borderRadius: '16px',
                padding: '1.15rem 1.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.04)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#93C5FD';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#DBEAFE';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.04)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileEdit size={22} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.15rem 0' }}>
                    {isHindi ? 'नई शिकायत दर्ज करें' : 'Register a Grievance'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35 }}>
                    {isHindi ? 'समस्या का पूरा विवरण व दस्तावेज देकर शिकायत दर्ज कराएं।' : 'Submit your complaint with details and supporting documents.'}
                  </div>
                </div>
              </div>

              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
                flexShrink: 0
              }}>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* Card 2: Track a Grievance */}
            <div
              onClick={() => {
                setTrackModalGrievance(grievances[0]);
              }}
              style={{
                background: '#F0FDF4',
                border: '1px solid #DCFCE7',
                borderRadius: '16px',
                padding: '1.15rem 1.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.04)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#86EFAC';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(22, 163, 74, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#DCFCE7';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(22, 163, 74, 0.04)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  border: '1px solid #BBF7D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Search size={22} color="#16A34A" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.15rem 0' }}>
                    {isHindi ? 'शिकायत ट्रैक करें' : 'Track a Grievance'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35 }}>
                    {isHindi ? 'अपनी शिकायत संदर्भ आईडी दर्ज करके वर्तमान स्थिति जानें।' : 'Enter your grievance reference ID to check current status.'}
                  </div>
                </div>
              </div>

              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A',
                flexShrink: 0
              }}>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* Row 2: Three Status Count Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {/* Open */}
            <div
              onClick={() => setActiveFilter('OPEN')}
              style={{
                background: '#FEF2F2',
                border: activeFilter === 'OPEN' ? '2px solid #EF4444' : '1px solid #FEE2E2',
                borderRadius: '14px',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #FECACA'
                }}>
                  <AlertCircle size={20} color="#EF4444" />
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                    {counts.open}
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                    {isHindi ? 'लंबित' : 'Open'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    {isHindi ? 'कार्रवाई की प्रतीक्षा' : 'Awaiting action'}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>

            {/* In Progress */}
            <div
              onClick={() => setActiveFilter('IN_PROGRESS')}
              style={{
                background: '#FFFBEB',
                border: activeFilter === 'IN_PROGRESS' ? '2px solid #D97706' : '1px solid #FEF3C7',
                borderRadius: '14px',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #FDE68A'
                }}>
                  <Clock size={20} color="#D97706" />
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                    {counts.inProgress}
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                    {isHindi ? 'प्रगति पर' : 'In Progress'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    {isHindi ? 'विभागीय समीक्षा जारी' : 'Being reviewed'}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>

            {/* Resolved */}
            <div
              onClick={() => setActiveFilter('RESOLVED')}
              style={{
                background: '#F0FDF4',
                border: activeFilter === 'RESOLVED' ? '2px solid #16A34A' : '1px solid #DCFCE7',
                borderRadius: '14px',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #BBF7D0'
                }}>
                  <Check size={20} color="#16A34A" strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                    5
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                    {isHindi ? 'समाधानित' : 'Resolved'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    {isHindi ? 'सफलतापूर्वक निस्तारित' : 'Successfully closed'}
                  </div>
                </div>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>
          </div>

          {/* =======================================================
              MY GRIEVANCES TABLE SECTION
              ======================================================= */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
            overflow: 'hidden'
          }}>
            {/* Table Header Controls */}
            <div style={{
              padding: '1.15rem 1.35rem',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'मेरी शिकायतें' : 'My Grievances'}
                </h3>

                {/* Filter Pills matching screenshot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {[
                    { id: 'ALL', label: isHindi ? `सभी (${counts.total})` : `All (${counts.total})` },
                    { id: 'OPEN', label: isHindi ? `लंबित (${counts.open})` : `Open (${counts.open})` },
                    { id: 'IN_PROGRESS', label: isHindi ? `प्रगति पर (${counts.inProgress})` : `In Progress (${counts.inProgress})` },
                    { id: 'RESOLVED', label: isHindi ? `समाधानित (5)` : `Resolved (5)` }
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
                          borderRadius: '8px',
                          padding: '0.35rem 0.8rem',
                          fontSize: '0.78rem',
                          fontWeight: isActive ? 700 : 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="LATEST">{isHindi ? 'नवीनतम पहले' : 'Latest First'}</option>
                  <option value="OLDEST">{isHindi ? 'पुरातन पहले' : 'Oldest First'}</option>
                </select>
              </div>
            </div>

            {/* Grievances Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700, width: '40px' }}>#</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'शिकायत संदर्भ आईडी' : 'Grievance ID'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'विषय व विवरण' : 'Subject'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'विभाग' : 'Department'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'दर्ज तिथि' : 'Submitted On'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'स्थिति' : 'Status'}
                    </th>
                    <th style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 700 }}>
                      {isHindi ? 'कार्रवाई' : 'Action'}
                    </th>
                    <th style={{ padding: '0.85rem 0.5rem', width: '30px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrievances.map((item, idx) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
                    >
                      <td style={{ padding: '0.95rem 1rem', color: '#64748B', fontWeight: 600 }}>
                        {idx + 1}
                      </td>

                      <td style={{ padding: '0.95rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                        {item.id}
                      </td>

                      <td style={{ padding: '0.95rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.825rem' }}>
                          {isHindi ? (item.subjectHi || item.subject) : item.subject}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.1rem' }}>
                          {isHindi ? (item.subjectDescHi || item.subjectDesc) : item.subjectDesc}
                        </div>
                      </td>

                      <td style={{ padding: '0.95rem 1rem', color: '#334155', fontWeight: 600 }}>
                        {isHindi ? (item.departmentHi || item.department) : item.department}
                      </td>

                      <td style={{ padding: '0.95rem 1rem', color: '#64748B' }}>
                        {isHindi ? (item.submittedOnHi || item.submittedOn) : item.submittedOn}
                      </td>

                      <td style={{ padding: '0.95rem 1rem' }}>
                        {item.status === 'OPEN' && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            padding: '0.22rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            <span style={{ fontSize: '0.75rem' }}>!</span>
                            <span>{isHindi ? 'लंबित' : 'Open'}</span>
                          </div>
                        )}

                        {item.status === 'IN_PROGRESS' && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#FEF3C7',
                            color: '#D97706',
                            padding: '0.22rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D97706' }} />
                            <span>{isHindi ? 'प्रगति पर' : 'In Progress'}</span>
                          </div>
                        )}

                        {item.status === 'RESOLVED' && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: '#DCFCE7',
                            color: '#15803D',
                            padding: '0.22rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            <Check size={12} strokeWidth={3} />
                            <span>{isHindi ? 'समाधानित' : 'Resolved'}</span>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '0.95rem 1rem' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedGrievanceForDetails(item)}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            color: '#334155',
                            borderRadius: '8px',
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
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
                          {isHindi ? 'विवरण देखें' : 'View Details'}
                        </button>
                      </td>

                      <td style={{ padding: '0.95rem 0.5rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedGrievanceForDetails(item)}
                          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.2rem' }}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>

        {/* =======================================================
            RIGHT COLUMN: TRACK + CATEGORIES + INFO + SUPPORT
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. TRACK YOUR GRIEVANCE CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem 1.35rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Search size={18} color="#2563EB" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'अपनी शिकायत ट्रैक करें' : 'Track Your Grievance'}
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.1rem' }}>
                  {isHindi ? 'शिकायत संदर्भ संख्या दर्ज करें' : 'Enter your grievance reference ID'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder={isHindi ? 'उदा. JP-2026-00124' : 'e.g. JP-2026-00124'}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.825rem',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={handleTrackGrievance}
                style={{
                  width: '100%',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.58rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
              >
                {isHindi ? 'स्थिति जांचें →' : 'Track Status →'}
              </button>
            </div>
          </div>

          {/* 2. GRIEVANCE CATEGORIES (2 Columns x 3 Rows) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'शिकायत श्रेणियां' : 'Grievance Categories'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryFixed(false);
                  setRegisterModalOpen(true);
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
                  gap: '0.15rem'
                }}
              >
                <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                <span style={{ fontSize: '0.85rem' }}>→</span>
              </button>
            </div>

            {/* 6 Category Tiles Grid matching screenshot */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              {/* Category 1: Water */}
              <div
                onClick={() => {
                  setNewCategory('Water & Sanitation');
                  setIsCategoryFixed(true);
                  setRegisterModalOpen(true);
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '10px',
                  padding: '0.65rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#BFDBFE'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F1F5F9'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Droplets size={14} color="#2563EB" />
                  </div>
                  <ChevronRight size={13} color="#94A3B8" />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                  {isHindi ? (
                    <span>जल एवं<br />स्वच्छता</span>
                  ) : (
                    <span>Water &amp;<br />Sanitation</span>
                  )}
                </div>
              </div>

              {/* Category 2: Electricity */}
              <div
                onClick={() => {
                  setNewCategory('Electricity & Streetlights');
                  setIsCategoryFixed(true);
                  setRegisterModalOpen(true);
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '10px',
                  padding: '0.65rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FED7AA'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F1F5F9'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: '#FFF7ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Zap size={14} color="#EA580C" />
                  </div>
                  <ChevronRight size={13} color="#94A3B8" />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                  {isHindi ? (
                    <span>विद्युत व<br />स्ट्रीट लाइट</span>
                  ) : (
                    <span>Electricity &amp;<br />Streetlights</span>
                  )}
                </div>
              </div>

              {/* Category 3: Roads */}
              <div
                onClick={() => {
                  setNewCategory('Roads & Infrastructure');
                  setIsCategoryFixed(true);
                  setRegisterModalOpen(true);
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '10px',
                  padding: '0.65rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E9D5FF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F1F5F9'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: '#F3E8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Milestone size={14} color="#7E22CE" />
                  </div>
                  <ChevronRight size={13} color="#94A3B8" />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                  {isHindi ? (
                    <span>सड़क एवं<br />अवसंरचना</span>
                  ) : (
                    <span>Roads &amp;<br />Infrastructure</span>
                  )}
                </div>
              </div>

              {/* Category 4: Certificates */}
              <div
                onClick={() => {
                  setNewCategory('Certificates & Documents');
                  setIsCategoryFixed(true);
                  setRegisterModalOpen(true);
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '10px',
                  padding: '0.65rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FECDD3'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F1F5F9'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: '#FFE4E6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={14} color="#E11D48" />
                  </div>
                  <ChevronRight size={13} color="#94A3B8" />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                  {isHindi ? (
                    <span>प्रमाण पत्र<br />व दस्तावेज</span>
                  ) : (
                    <span>Certificates<br />&amp; Documents</span>
                  )}
                </div>
              </div>

              {/* Category 5: Pension */}
              <div
                onClick={() => {
                  setNewCategory('Pension & Social Welfare');
                  setIsCategoryFixed(true);
                  setRegisterModalOpen(true);
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '10px',
                  padding: '0.65rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#BFDBFE'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F1F5F9'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <HeartHandshake size={14} color="#2563EB" />
                  </div>
                  <ChevronRight size={13} color="#94A3B8" />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                  {isHindi ? (
                    <span>पेंशन व<br />समाज कल्याण</span>
                  ) : (
                    <span>Pension &amp;<br />Social Welfare</span>
                  )}
                </div>
              </div>

              {/* Category 6: Property */}
              <div
                onClick={() => {
                  setNewCategory('Property & Land Records');
                  setIsCategoryFixed(true);
                  setRegisterModalOpen(true);
                }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  borderRadius: '10px',
                  padding: '0.65rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#BBF7D0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F1F5F9'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Landmark size={14} color="#16A34A" />
                  </div>
                  <ChevronRight size={13} color="#94A3B8" />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                  {isHindi ? (
                    <span>संपत्ति व<br />भू-अभिलेख</span>
                  ) : (
                    <span>Property &amp;<br />Land Records</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. IMPORTANT INFORMATION CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <AlertTriangle size={17} color="#EF4444" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'महत्वपूर्ण दिशा-निर्देश' : 'Important Information'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <AlertCircle size={13} color="#DC2626" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                    {isHindi ? 'यहां आपातकालीन मामले दर्ज न करें।' : 'Do not submit emergency matters here.'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.35 }}>
                    {isHindi ? 'त्वरित आपातकालीन मामलों के लिए संबंधित विभाग की हेल्पलाइन पर संपर्क करें।' : 'For urgent issues, contact the respective department directly.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <FileText size={12} color="#DC2626" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.35 }}>
                  {isHindi ? 'सटीक जानकारी और वैध दस्तावेज संलग्न करें।' : 'Provide accurate information and valid documents.'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFF7ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Bell size={12} color="#EA580C" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.35 }}>
                  {isHindi ? 'स्थिति में बदलाव की सूचना एसएमएस, ईमेल अथवा डैशबोर्ड पर मिलेगी।' : 'You will be notified about updates via SMS, email or on your dashboard.'}
                </div>
              </div>
            </div>
          </div>

          {/* 4. NEED HELP WITH GRIEVANCES? */}
          <div style={{
            background: 'linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 100%)',
            borderRadius: '16px',
            border: '1px solid #DBEAFE',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Headphones size={18} color="#2563EB" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? 'शिकायतों में सहायता चाहिए?' : 'Need Help with Grievances?'}
                </h4>
              </div>
            </div>

            <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35 }}>
              {isHindi ? 'अपनी शिकायत दर्ज करने अथवा स्टेटस जानने के लिए सहायता डेस्क से संपर्क करें।' : 'Contact our support team for assistance with your complaint.'}
            </p>

            <button
              type="button"
              onClick={() => showToast(isHindi ? 'जन पहचान शिकायत हेल्पलाइन: 1800-11-2026' : 'Jan Pehchaan grievance helpline: 1800-11-2026')}
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
                cursor: 'pointer'
              }}
            >
              <span>{isHindi ? 'सहायता केंद्र से संपर्क करें' : 'Contact Support'}</span>
              <span style={{ fontSize: '0.85rem' }}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          5. REGISTER GRIEVANCE MODAL
          ========================================================= */}
      {registerModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setRegisterModalOpen(false)}
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
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem', marginBottom: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileEdit size={19} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'नई शिकायत दर्ज करें' : 'Register a Grievance'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {isHindi ? 'उत्तर प्रदेश सरकार • जन पहचान निवारण पोर्टल' : 'Government of Uttar Pradesh • Jan Pehchaan Redressal Portal'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={19} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleRegisterGrievance} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                    {isHindi ? 'शिकायत की श्रेणी' : 'Grievance Category'}
                  </label>
                  {isCategoryFixed && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: '#2563EB',
                      background: '#EFF6FF',
                      border: '1px solid #DBEAFE',
                      borderRadius: '9999px',
                      padding: '0.12rem 0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Lock size={10} />
                      {isHindi ? 'श्रेणी लॉक है' : 'Category Fixed'}
                    </span>
                  )}
                </div>

                {isCategoryFixed ? (
                  <div style={{
                    width: '100%',
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} />
                    <span>{isHindi ? (
                      newCategory === 'Water & Sanitation' ? 'जल एवं स्वच्छता' :
                      newCategory === 'Electricity & Streetlights' ? 'विद्युत व स्ट्रीट लाइट' :
                      newCategory === 'Roads & Infrastructure' ? 'सड़क एवं अवसंरचना' :
                      newCategory === 'Certificates & Documents' ? 'प्रमाण पत्र व दस्तावेज' :
                      newCategory === 'Pension & Social Welfare' ? 'पेंशन व समाज कल्याण' :
                      'संपत्ति व भू-अभिलेख'
                    ) : newCategory}</span>
                  </div>
                ) : (
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  >
                    <option value="Water & Sanitation">{isHindi ? 'जल एवं स्वच्छता (Water & Sanitation)' : 'Water & Sanitation'}</option>
                    <option value="Electricity & Streetlights">{isHindi ? 'विद्युत व स्ट्रीट लाइट (Electricity & Streetlights)' : 'Electricity & Streetlights'}</option>
                    <option value="Roads & Infrastructure">{isHindi ? 'सड़क एवं अवसंरचना (Roads & Infrastructure)' : 'Roads & Infrastructure'}</option>
                    <option value="Certificates & Documents">{isHindi ? 'प्रमाण पत्र व दस्तावेज (Certificates & Documents)' : 'Certificates & Documents'}</option>
                    <option value="Pension & Social Welfare">{isHindi ? 'पेंशन व समाज कल्याण (Pension & Social Welfare)' : 'Pension & Social Welfare'}</option>
                    <option value="Property & Land Records">{isHindi ? 'संपत्ति व भू-अभिलेख (Property & Land Records)' : 'Property & Land Records'}</option>
                  </select>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'विषय / संक्षिप्त सारांश' : 'Subject / Summary'}
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder={isHindi ? 'उदा. सेक्टर 62 ब्लॉक बी में पानी का कम दबाव' : 'e.g. Low water pressure in Sector 62 block B'}
                  required
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'शिकायत का विस्तृत विवरण व लैंडमार्क' : 'Complaint Details & Landmark'}
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder={isHindi ? 'अधिकारियों द्वारा त्वरित स्थलीय जांच हेतु पूरा विवरण व निकटतम पहचान लिखें...' : 'Provide precise details to help the field officer investigate quickly...'}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem',
                    color: '#0F172A',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                  {isHindi ? 'स्थान / क्षेत्र / वार्ड' : 'Location / Area'}
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder={isHindi ? 'नोएडा सेक्टर / गांव / वार्ड' : 'Noida Sector / Village / Ward'}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.825rem',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: '10px',
                padding: '0.65rem 0.85rem',
                fontSize: '0.72rem',
                color: '#0369A1'
              }}>
                {isHindi
                  ? 'ℹ️ नागरिक चार्टर मानक समय (SLA): 7 कार्य दिवस। अपडेट आपके पंजीकृत मोबाइल पर भेजे जाएंगे।'
                  : 'ℹ️ Standard Citizen Charter SLA: 7 working days. Updates sent to registered mobile.'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
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
                  disabled={isSubmitting}
                  style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1.35rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {isSubmitting
                    ? (isHindi ? 'शिकायत दर्ज हो रही है...' : 'Registering...')
                    : (isHindi ? 'शिकायत दर्ज करें →' : 'Submit Grievance →')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          6. VIEW GRIEVANCE DETAILS & TIMELINE MODAL
          ========================================================= */}
      {(selectedGrievanceForDetails || trackModalGrievance) && (
        (() => {
          const item = selectedGrievanceForDetails || trackModalGrievance;
          const closeModal = () => {
            setSelectedGrievanceForDetails(null);
            setTrackModalGrievance(null);
          };

          return (
            <div
              className="modal-overlay"
              onClick={closeModal}
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
                  maxWidth: '580px',
                  width: '100%',
                  boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                  padding: '1.5rem',
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem', marginBottom: '1.15rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {isHindi ? 'शिकायत निवारण विवरण' : 'Grievance Details'}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                      ID: <strong style={{ color: '#0F172A' }}>{item.id}</strong> • {isHindi ? (item.departmentHi || item.department) : item.department}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                  >
                    <X size={19} color="#64748B" />
                  </button>
                </div>

                {/* Summary Info */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                    {isHindi ? (item.subjectHi || item.subject) : item.subject}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem' }}>
                    {isHindi ? (item.subjectDescHi || item.subjectDesc) : item.subjectDesc}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      {isHindi ? 'संबंधित अधिकारी: ' : 'Officer: '}<strong>{isHindi ? (item.officerHi || item.officer) : item.officer}</strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 600 }}>
                      {isHindi ? (item.slaDaysHi || item.slaDays) : item.slaDays}
                    </div>
                  </div>
                </div>

                {/* Real-time Timeline */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.65rem' }}>
                    {isHindi ? 'निवारण प्रगति समयरेखा' : 'Redressal Progress Timeline'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {item.timeline?.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: step.done ? '#16A34A' : step.active ? '#2563EB' : '#F1F5F9',
                          color: step.done || step.active ? '#FFFFFF' : '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {step.done ? <Check size={12} strokeWidth={3} /> : idx + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0F172A' }}>
                            {isHindi ? (step.titleHi || step.title) : step.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: step.active ? '#2563EB' : '#64748B' }}>
                            {isHindi ? (step.descHi || step.desc) : step.desc} • <span style={{ color: '#94A3B8' }}>{isHindi ? (step.dateHi || step.date) : step.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      background: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 1.25rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? 'पूर्ण (Done)' : 'Done'}
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}

export default GrievancesTab;
