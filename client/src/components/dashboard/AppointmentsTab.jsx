import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  CheckCircle2,
  X,
  CreditCard,
  FileText,
  Car,
  Home,
  ShieldCheck,
  ChevronLeft,
  Info,
  CalendarCheck,
  Building2,
  AlertCircle,
  FileCheck,
  Download,
  Share2,
  Printer,
  Sparkles,
  ArrowRight,
  Fingerprint
} from 'lucide-react';

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_HI = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export function AppointmentsTab({ user, onNavigateTab, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';
  const MONTH_NAMES = isHindi ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  // Base App Base Date (Current Year 2026)
  const initialYear = 2026;
  const initialMonth = 9; // October (0-indexed)
  const initialDay = 24;

  const formatYMD = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Noida, Uttar Pradesh');
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState(initialDay);
  const [filterDateStr, setFilterDateStr] = useState(formatYMD(initialYear, initialMonth, initialDay));
  const [toastMessage, setToastMessage] = useState(null);

  // Sync when top date picker changes
  const handleTopDateChange = (val) => {
    if (!val) {
      setFilterDateStr('');
      return;
    }
    // Restrict strictly to current year 2026 (from today 24 Oct to 31 Dec 2026)
    if (val < '2026-10-24') {
      showToast('Cannot select past dates. Earliest booking date is 24 Oct 2026.');
      val = '2026-10-24';
    } else if (val > '2026-12-31') {
      showToast('Appointments are available for current year 2026 only.');
      val = '2026-12-31';
    }

    setFilterDateStr(val);
    const parts = val.split('-');
    if (parts.length === 3) {
      const y = 2026; // Locked to current year
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      setCurrentYear(y);
      setCurrentMonthIndex(m);
      setSelectedDate(d);
      showToast(`Appointment date set to ${d} ${MONTH_NAMES[m]} ${y}`);
    }
  };

  // Calendar date selection
  const handleCalendarDateClick = (day) => {
    // Prevent past dates in current month (today is 24 Oct 2026)
    if (currentYear === 2026 && currentMonthIndex === 9 && day < 24) {
      showToast('Cannot select past dates. Earliest date is 24 Oct 2026.');
      return;
    }
    setSelectedDate(day);
    setFilterDateStr(formatYMD(currentYear, currentMonthIndex, day));
    showToast(`Selected ${day} ${MONTH_NAMES[currentMonthIndex]} ${currentYear} for appointments.`);
  };

  // Month navigation (strictly restricted to remaining months of 2026: Oct - Dec)
  const handlePrevMonth = () => {
    if (currentMonthIndex > 9) {
      const newMonth = currentMonthIndex - 1;
      setCurrentMonthIndex(newMonth);
      let newDay = selectedDate;
      const maxDays = new Date(currentYear, newMonth + 1, 0).getDate();
      if (newDay > maxDays) newDay = maxDays;
      if (newMonth === 9 && newDay < 24) newDay = 24;
      setSelectedDate(newDay);
      setFilterDateStr(formatYMD(currentYear, newMonth, newDay));
    } else {
      showToast('Cannot navigate to past months. Current month is October 2026.');
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < 11) {
      const newMonth = currentMonthIndex + 1;
      setCurrentMonthIndex(newMonth);
      const maxDays = new Date(currentYear, newMonth + 1, 0).getDate();
      let newDay = selectedDate;
      if (newDay > maxDays) newDay = maxDays;
      setSelectedDate(newDay);
      setFilterDateStr(formatYMD(currentYear, newMonth, newDay));
    } else {
      showToast('Appointments are available for current year 2026 only.');
    }
  };

  // Dynamic calendar calculations for any chosen month and year
  const calendarData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysInPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();

    const prevMonthDays = Array.from({ length: firstDayIndex }, (_, i) => {
      return daysInPrevMonth - firstDayIndex + 1 + i;
    });

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
    const nextMonthDaysCount = totalCells - (firstDayIndex + daysInMonth);
    const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

    return {
      prevMonthDays,
      currentMonthDays,
      nextMonthDays
    };
  }, [currentYear, currentMonthIndex]);

  // Booking Modal State
  const [bookingModalService, setBookingModalService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM - 11:00 AM');
  const [selectedCenter, setSelectedCenter] = useState('');
  const [bookingStep, setBookingStep] = useState(1); // 1: Slot, 2: Applicant Info, 3: Confirmed
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upcoming appointment state (initially null or updated after booking)
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // 5 Core Appointment Services matching reference image
  const services = [
    {
      id: 'aadhaar',
      title: 'Aadhaar Services',
      titleHi: 'आधार सेवाएँ',
      subServices: 'New Aadhaar, Update Details, Biometric Update',
      subServicesHi: 'नया आधार, विवरण अपडेट, बायोमेट्रिक नवीनीकरण',
      center: 'Aadhaar Seva Kendra',
      centerHi: 'आधार सेवा केंद्र',
      location: 'Noida Sector 18',
      locationHi: 'नोएडा सेक्टर 18',
      duration: '15-30 mins',
      durationHi: '15-30 मिनट',
      iconType: 'aadhaar',
      iconBg: '#FFF7ED',
      iconBorder: '#FED7AA',
      slots: ['09:30 AM', '10:30 AM', '11:45 AM', '02:15 PM', '04:00 PM']
    },
    {
      id: 'pan',
      title: 'PAN Card Services',
      titleHi: 'पैन कार्ड सेवाएँ',
      subServices: 'New PAN, Correction, Reprint',
      subServicesHi: 'नया पैन कार्ड, सुधार, पुनर्मुद्रण',
      center: 'UTIITSL / PAN Service Center',
      centerHi: 'यूटीआईआईटीएसएल / पैन सेवा केंद्र',
      location: 'Noida Sector 62',
      locationHi: 'नोएडा सेक्टर 62',
      duration: '20-30 mins',
      durationHi: '20-30 मिनट',
      iconType: 'pan',
      iconBg: '#EFF6FF',
      iconBorder: '#BFDBFE',
      slots: ['10:00 AM', '11:15 AM', '01:30 PM', '03:00 PM', '04:30 PM']
    },
    {
      id: 'passport',
      title: 'Passport Services',
      titleHi: 'पासपोर्ट सेवाएँ',
      subServices: 'New Passport, Renewal, Address Update',
      subServicesHi: 'नया पासपोर्ट, नवीनीकरण, पता परिवर्तन',
      center: 'Passport Seva Kendra',
      centerHi: 'पासपोर्ट सेवा केंद्र',
      location: 'Noida Sector 62',
      locationHi: 'नोएडा सेक्टर 62',
      duration: '30-45 mins',
      durationHi: '30-45 मिनट',
      iconType: 'passport',
      iconBg: '#EFF6FF',
      iconBorder: '#BFDBFE',
      slots: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:45 PM']
    },
    {
      id: 'dl',
      title: 'Driving Licence Services',
      titleHi: 'ड्राइविंग लाइसेंस सेवाएँ',
      subServices: 'New DL, Renewal, Address Change, Test Slot',
      subServicesHi: 'नया डीएल, नवीनीकरण, पता बदलाव, टेस्ट स्लॉट',
      center: 'RTO Office',
      centerHi: 'आरटीओ कार्यालय',
      location: 'Noida Sector 32',
      locationHi: 'नोएडा सेक्टर 32',
      duration: '30-45 mins',
      durationHi: '30-45 मिनट',
      iconType: 'dl',
      iconBg: '#E0F2FE',
      iconBorder: '#BAE6FD',
      slots: ['10:00 AM', '11:00 AM', '12:00 PM', '02:30 PM', '03:30 PM']
    },
    {
      id: 'property',
      title: 'Property Registration',
      titleHi: 'संपत्ति पंजीकरण',
      subServices: 'Document Registration, Stamp Duty Payment',
      subServicesHi: 'दस्तावेज़ रजिस्ट्री, स्टांप शुल्क भुगतान',
      center: 'Sub-Registrar Office',
      centerHi: 'उप-पंजीयक (सब-रजिस्ट्रार) कार्यालय',
      location: 'Noida Sector 33',
      locationHi: 'नोएडा सेक्टर 33',
      duration: '20-30 mins',
      durationHi: '20-30 मिनट',
      iconType: 'property',
      iconBg: '#FFF7ED',
      iconBorder: '#FED7AA',
      slots: ['11:00 AM', '12:15 PM', '02:00 PM', '03:15 PM', '04:15 PM']
    }
  ];

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        (s.titleHi && s.titleHi.toLowerCase().includes(q)) ||
        s.subServices.toLowerCase().includes(q) ||
        (s.subServicesHi && s.subServicesHi.toLowerCase().includes(q)) ||
        s.center.toLowerCase().includes(q) ||
        (s.centerHi && s.centerHi.toLowerCase().includes(q)) ||
        s.location.toLowerCase().includes(q) ||
        (s.locationHi && s.locationHi.toLowerCase().includes(q));

      return matchesQuery;
    });
  }, [services, searchQuery]);

  // Open booking modal
  const handleOpenBooking = (service) => {
    setBookingModalService(service);
    setSelectedCenter(isHindi ? `${service.centerHi || service.center}, ${service.locationHi || service.location}` : `${service.center}, ${service.location}`);
    setBookingStep(1);
  };

  // Complete booking
  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bookedData = {
        id: `APT-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceTitle: bookingModalService.title,
        center: selectedCenter,
        date: `${selectedDate} ${MONTH_NAMES[currentMonthIndex]} ${currentYear}`,
        time: selectedSlot,
        applicant: user?.name || 'Pankaj Kumar',
        tokenNo: `T-${Math.floor(10 + Math.random() * 90)}`
      };
      setUpcomingAppointment(bookedData);
      setBookingStep(3);
      showToast(`Appointment booked for ${selectedDate} ${MONTH_NAMES[currentMonthIndex]} ${currentYear}! Token: ${bookedData.tokenNo}`);
    }, 1000);
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
              {isHindi ? 'अपॉइंटमेंट्स' : 'Appointments'}
            </span>
          </div>

          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isHindi ? 'अपॉइंटमेंट बुक करें' : 'Book an Appointment'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            {isHindi ? 'सुगम और कतार-मुक्त सेवा हेतु सरकारी कार्यालयों में अपनी यात्रा निर्धारित करें।' : 'Schedule your visit to government offices for hassle-free service.'}
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
              <span>नागरिक सेवाएँ,<br />आपके और करीब</span>
            ) : (
              <span>&ldquo;Citizen Services,<br />Closer to You&rdquo;</span>
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
          2. SEARCH & LOCATION FILTERS BAR
          ========================================================= */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        padding: '0.5rem 0.65rem 0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        flexWrap: 'wrap'
      }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 2, minWidth: '240px' }}>
          <Search size={18} color="#64748B" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'सेवा केंद्र या सेवा खोजें (उदा. आधार, पासपोर्ट, ड्राइविंग लाइसेंस...)' : 'Search appointment services (e.g., Aadhaar, Passport, Driving Licence...)'}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#0F172A',
              fontWeight: 500
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />

        {/* Location Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flex: 1, minWidth: '180px' }}>
          <MapPin size={16} color="#2563EB" style={{ flexShrink: 0 }} />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="Noida, Uttar Pradesh">{isHindi ? 'नोएडा, उत्तर प्रदेश' : 'Noida, Uttar Pradesh'}</option>
            <option value="Greater Noida, Uttar Pradesh">{isHindi ? 'ग्रेटर नोएडा, उत्तर प्रदेश' : 'Greater Noida, Uttar Pradesh'}</option>
            <option value="Ghaziabad, Uttar Pradesh">{isHindi ? 'गाज़ियाबाद, उत्तर प्रदेश' : 'Ghaziabad, Uttar Pradesh'}</option>
            <option value="New Delhi, Central">{isHindi ? 'नई दिल्ली, सेंट्रल' : 'New Delhi, Central'}</option>
          </select>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />

        {/* Date Filter: Interactive Calendar Date Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: '150px' }}>
          <CalendarIcon size={16} color="#2563EB" style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isHindi ? 'प्रारंभिक तिथि' : 'Earliest Date'}
            </span>
            <input
              type="date"
              value={filterDateStr}
              onChange={(e) => handleTopDateChange(e.target.value)}
              min="2026-10-24"
              max="2026-12-31"
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.825rem',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                fontFamily: 'inherit',
                padding: 0
              }}
              title={isHindi ? 'शीघ्रतम अपॉइंटमेंट तिथि चुनें (24 अक्टूबर 2026 - 31 दिसंबर 2026)' : 'Click to choose earliest appointment date (24 Oct 2026 - 31 Dec 2026)'}
            />
          </div>
        </div>

        {/* Blue Search Button */}
        <button
          type="button"
          onClick={() => showToast(isHindi ? `${selectedLocation} के लिए अपॉइंटमेंट्स फ़िल्टर किए जा रहे हैं...` : `Filtering appointments for ${selectedLocation}...`)}
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
          3. MAIN TWO-COLUMN BODY
             Left/Center (72%): Available Appointment Services + How It Works
             Right Sidebar (28%): Next Appointment + Calendar + Important Info
          ========================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2.5fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* =======================================================
            LEFT COLUMN: HOW IT WORKS + AVAILABLE SERVICES LIST
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* SECTION 1: HOW IT WORKS (Moved to top) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
          }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
              {isHindi ? 'यह कैसे काम करता है' : 'How It Works'}
            </h3>

            {/* 4 Step Horizontal Process */}
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
                    {isHindi ? 'सेवा चुनें' : 'Select Service'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'अपनी आवश्यकता अनुसार सेवा चुनें।' : 'Choose the service you need.'}
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
                    {isHindi ? 'तारीख व समय चुनें' : 'Pick Date & Time'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'सुविधानुसार स्लॉट चुनें।' : 'Choose a convenient slot.'}
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
                    {isHindi ? 'विवरण भरें' : 'Fill Details'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'आवश्यक जानकारी प्रदान करें।' : 'Provide required information.'}
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
                    {isHindi ? 'पुष्टि प्राप्त करें' : 'Get Confirmation'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                    {isHindi ? 'अपॉइंटमेंट रसीद और विवरण पाएँ।' : 'Receive appointment details.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 0.85rem 0',
              letterSpacing: '-0.01em'
            }}>
              {isHindi ? 'उपलब्ध अपॉइंटमेंट सेवाएँ' : 'Available Appointment Services'}
            </h2>

            {/* List of 5 Service Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    padding: '1.05rem 1.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#93C5FD';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.02)';
                  }}
                >
                  {/* Left: Icon + Title + SubServices */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem', minWidth: '260px' }}>
                    {/* Custom Vector Icons matching screenshot */}
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: service.iconBg,
                      border: `1px solid ${service.iconBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {service.iconType === 'aadhaar' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Fingerprint size={22} color="#EA580C" />
                          <span style={{ fontSize: '0.45rem', fontWeight: 800, color: '#EA580C', lineHeight: 1 }}>AADHAAR</span>
                        </div>
                      )}
                      {service.iconType === 'pan' && (
                        <CreditCard size={22} color="#2563EB" />
                      )}
                      {service.iconType === 'passport' && (
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          background: '#1E3A8A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ShieldCheck size={16} color="#FFFFFF" />
                        </div>
                      )}
                      {service.iconType === 'dl' && (
                        <Car size={22} color="#0284C7" />
                      )}
                      {service.iconType === 'property' && (
                        <Home size={22} color="#EA580C" />
                      )}
                    </div>

                    <div>
                      <h3 style={{
                        fontSize: '0.98rem',
                        fontWeight: 800,
                        color: '#0F172A',
                        margin: '0 0 0.15rem 0'
                      }}>
                        {isHindi ? (service.titleHi || service.title) : service.title}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        {isHindi ? (service.subServicesHi || service.subServices) : service.subServices}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column 1: Center & Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: '180px' }}>
                    <MapPin size={15} color="#2563EB" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                        {isHindi ? (service.centerHi || service.center) : service.center}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {isHindi ? (service.locationHi || service.location) : service.location}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column 2: Duration */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '110px' }}>
                    <Clock size={15} color="#2563EB" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                      {isHindi ? (service.durationHi || service.duration) : service.duration}
                    </span>
                  </div>

                  {/* Right: Book Appointment Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(service)}
                      style={{
                        background: '#FFFFFF',
                        border: '1.5px solid #2563EB',
                        color: '#2563EB',
                        borderRadius: '8px',
                        padding: '0.48rem 1.05rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#EFF6FF';
                        e.currentTarget.style.borderColor = '#1D4ED8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#2563EB';
                      }}
                    >
                      <span>{isHindi ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}</span>
                      <span style={{ fontSize: '0.85rem' }}>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* =======================================================
            RIGHT COLUMN: NEXT APPOINTMENT + CALENDAR + IMPORTANT INFO
            ======================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* 1. YOUR NEXT APPOINTMENT CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CalendarIcon size={18} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'आपकी अगली अपॉइंटमेंट' : 'Your Next Appointment'}
              </h3>
            </div>

            {upcomingAppointment ? (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '0.85rem',
                marginBottom: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>
                    {upcomingAppointment.serviceTitle}
                  </div>
                  <span style={{ fontSize: '0.7rem', background: '#DCFCE7', color: '#15803D', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                    {isHindi ? `टोकन ${upcomingAppointment.tokenNo}` : `Token ${upcomingAppointment.tokenNo}`}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#334155', marginTop: '0.35rem' }}>
                  📅 {upcomingAppointment.date} • ⏰ {upcomingAppointment.time}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>
                  📍 {upcomingAppointment.center}
                </div>

                <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => showToast(isHindi ? 'अपॉइंटमेंट रसीद डाउनलोड की गई (PDF)' : 'Appointment slip downloaded (PDF).')}
                    style={{
                      flex: 1,
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      padding: '0.35rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? 'रसीद (PDF)' : 'Slip (PDF)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUpcomingAppointment(null);
                      showToast(isHindi ? 'अपॉइंटमेंट सफलतापूर्वक रद्द की गई।' : 'Appointment cancelled successfully.');
                    }}
                    style={{
                      background: '#FEE2E2',
                      border: 'none',
                      color: '#DC2626',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  {isHindi ? 'कोई आगामी अपॉइंटमेंट नहीं है' : 'No upcoming appointments'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                  {isHindi ? 'शुरुआत करने के लिए अपॉइंटमेंट बुक करें।' : 'Book an appointment to get started.'}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleOpenBooking(services[0])}
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
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
            >
              <span>{isHindi ? 'अपॉइंटमेंट बुक करें' : 'Book an Appointment'}</span>
              <span style={{ fontSize: '0.9rem' }}>→</span>
            </button>
          </div>

          {/* 2. APPOINTMENT CALENDAR CARD */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            {/* Header: Title + View All */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.95rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {isHindi ? 'अपॉइंटमेंट कैलेंडर' : 'Appointment Calendar'}
              </h3>
              <button
                type="button"
                onClick={() => showToast(isHindi ? 'कैलेंडर दृश्य सरकारी सेवा केंद्रों के साथ समन्वयित है।' : 'Calendar view synced with Government Seva Kendras.')}
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

            {/* Month & Year Header Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
              padding: '0 0.15rem'
            }}>
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={currentMonthIndex <= 9}
                title={currentMonthIndex <= 9 ? (isHindi ? 'पिछले माह में नहीं जा सकते' : 'Cannot navigate to past months') : (isHindi ? 'पिछला महीना' : 'Previous Month')}
                style={{
                  background: currentMonthIndex <= 9 ? '#F1F5F9' : '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentMonthIndex <= 9 ? 'not-allowed' : 'pointer',
                  opacity: currentMonthIndex <= 9 ? 0.4 : 1,
                  color: '#475569',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { if (currentMonthIndex > 9) e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseLeave={(e) => { if (currentMonthIndex > 9) e.currentTarget.style.background = '#F8FAFC'; }}
              >
                <ChevronLeft size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <select
                  value={currentMonthIndex}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    if (m < 9) {
                      showToast(isHindi ? 'पिछले माह नहीं चुन सकते।' : 'Cannot select past months.');
                      return;
                    }
                    setCurrentMonthIndex(m);
                    const maxDays = new Date(currentYear, m + 1, 0).getDate();
                    let newDay = selectedDate;
                    if (newDay > maxDays) newDay = maxDays;
                    if (m === 9 && newDay < 24) newDay = 24;
                    setSelectedDate(newDay);
                    setFilterDateStr(formatYMD(currentYear, m, newDay));
                  }}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '0.25rem 0.45rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {MONTH_NAMES.map((name, idx) => {
                    if (idx < 9) return null;
                    return (
                      <option key={name} value={idx}>
                        {name}
                      </option>
                    );
                  })}
                </select>

                {/* Year Display */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    userSelect: 'none'
                  }}
                >
                  2026
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={currentMonthIndex >= 11}
                title={currentMonthIndex >= 11 ? (isHindi ? 'अपॉइंटमेंट्स केवल वर्तमान वर्ष 2026 तक सीमित हैं' : 'Appointments are restricted to current year 2026') : (isHindi ? 'अगला महीना' : 'Next Month')}
                style={{
                  background: currentMonthIndex >= 11 ? '#F1F5F9' : '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentMonthIndex >= 11 ? 'not-allowed' : 'pointer',
                  opacity: currentMonthIndex >= 11 ? 0.4 : 1,
                  color: '#475569',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { if (currentMonthIndex < 11) e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseLeave={(e) => { if (currentMonthIndex < 11) e.currentTarget.style.background = '#F8FAFC'; }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Days of Week Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#64748B',
              marginBottom: '0.5rem'
            }}>
              <span>{isHindi ? 'रवि' : 'Sun'}</span>
              <span>{isHindi ? 'सोम' : 'Mon'}</span>
              <span>{isHindi ? 'मंगल' : 'Tue'}</span>
              <span>{isHindi ? 'बुध' : 'Wed'}</span>
              <span>{isHindi ? 'गुरु' : 'Thu'}</span>
              <span>{isHindi ? 'शुक्र' : 'Fri'}</span>
              <span>{isHindi ? 'शनि' : 'Sat'}</span>
            </div>

            {/* Dynamic Month Dates Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              rowGap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {/* Previous month grey days */}
              {calendarData.prevMonthDays.map((d, i) => (
                <span key={`prev-${i}`} style={{ color: '#CBD5E1', padding: '0.35rem' }}>
                  {d}
                </span>
              ))}

              {/* Current month selectable days */}
              {calendarData.currentMonthDays.map((day) => {
                const isPast = (currentYear === 2026 && currentMonthIndex === 9 && day < 24);
                const isToday = (currentYear === 2026 && currentMonthIndex === 9 && day === 24);
                const isSelected = day === selectedDate;

                if (isPast) {
                  return (
                    <button
                      key={`curr-${day}`}
                      type="button"
                      disabled={true}
                      title={isHindi ? `पिछली तारीख (${day} अक्टूबर 2026) बुक नहीं की जा सकती` : `Past date (${day} Oct 2026) cannot be booked`}
                      style={{
                        background: 'transparent',
                        color: '#CBD5E1',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        margin: '0 auto',
                        cursor: 'not-allowed',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        userSelect: 'none'
                      }}
                    >
                      {day}
                    </button>
                  );
                }

                return (
                  <button
                    key={`curr-${day}`}
                    type="button"
                    onClick={() => handleCalendarDateClick(day)}
                    title={isToday ? (isHindi ? `आज (${day} अक्टूबर 2026)` : `Today (${day} Oct 2026)`) : `${day} ${MONTH_NAMES[currentMonthIndex]} ${currentYear}`}
                    style={{
                      background: isSelected ? '#2563EB' : isToday ? '#EFF6FF' : 'transparent',
                      color: isSelected ? '#FFFFFF' : isToday ? '#1D4ED8' : '#0F172A',
                      border: isToday && !isSelected ? '1px solid #93C5FD' : 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      margin: '0 auto',
                      cursor: 'pointer',
                      fontWeight: isSelected || isToday ? 800 : 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? '0 2px 6px rgba(37, 99, 235, 0.35)' : 'none',
                      transition: 'all 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#EFF6FF';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = isToday ? '#EFF6FF' : 'transparent';
                    }}
                  >
                    {day}
                  </button>
                );
              })}

              {/* Next month grey days */}
              {calendarData.nextMonthDays.map((d, i) => (
                <span key={`next-${i}`} style={{ color: '#CBD5E1', padding: '0.35rem' }}>
                  {d}
                </span>
              ))}
            </div>

            {/* Information Status Footer */}
            <div style={{
              fontSize: '0.68rem',
              color: '#64748B',
              marginTop: '0.75rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              background: '#F8FAFC',
              padding: '0.4rem',
              borderRadius: '6px',
              border: '1px solid #F1F5F9'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
              <span>{isHindi ? 'बुकिंग अक्टूबर – दिसंबर 2026 के लिए खुली हैं (पिछली तारीखें बंद)' : 'Bookings open for Oct – Dec 2026 (Past dates locked)'}</span>
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
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.95rem 0' }}>
              {isHindi ? 'महत्वपूर्ण जानकारी' : 'Important Information'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Item 1 */}
              <div
                onClick={() => showToast(isHindi ? 'मूल दस्तावेज़ के साथ 1 सेट फ़ोटोकॉपी भी साथ लाएं।' : 'Carry original documents along with 1 set of photocopies.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
                    <FileText size={16} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'मूल दस्तावेज़ साथ लाएं' : 'Carry original documents'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'सेवा की आवश्यकतानुसार 1 सेट फ़ोटोकॉपी भी लाएं।' : 'As per service requirements.'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>

              {/* Item 2 */}
              <div
                onClick={() => showToast(isHindi ? 'डिजिटल टोकन जारी करने हेतु 10 मिनट पहले पहुंचें।' : 'Arrive 10 minutes early for digital token issuance.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
                    <Clock size={16} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'समय पर पहुंचें' : 'Reach on time'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'कम से कम 10 मिनट पहले पहुंचें।' : 'Arrive at least 10 minutes early.'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>

              {/* Item 3 */}
              <div
                onClick={() => showToast(isHindi ? '4 घंटे पहले तक निःशुल्क पुनर्निर्धारण उपलब्ध है।' : 'Free rescheduling available up to 4 hours prior.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#FFF7ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CalendarCheck size={16} color="#EA580C" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'पुनर्निर्धारित या रद्द करें' : 'Reschedule or cancel'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'यदि आप नहीं आ सकते तो पोर्टल से समय बदलें।' : "Use the portal if you can't make it."}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>

              {/* Item 4 */}
              <div
                onClick={() => showToast(isHindi ? 'फ़ोटो और आयु प्रमाण हेतु आवश्यकताओं की जांच करें।' : 'Check requirements checklist for photo and age proof.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
                    <FileCheck size={16} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {isHindi ? 'विशिष्ट दिशानिर्देश देखें' : 'Check service-specific guidelines'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {isHindi ? 'विभाग के अनुसार आवश्यकताएं भिन्न हो सकती हैं।' : 'Requirements may vary by department.'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          4. INTERACTIVE BOOKING MODAL
          ========================================================= */}
      {bookingModalService && (
        <div
          className="modal-overlay"
          onClick={() => setBookingModalService(null)}
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
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isHindi ? `${bookingModalService.titleHi || bookingModalService.title} बुक करें` : `Book ${bookingModalService.title}`}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                  {isHindi ? (bookingModalService.centerHi || bookingModalService.center) : bookingModalService.center} • {isHindi ? (bookingModalService.locationHi || bookingModalService.location) : bookingModalService.location}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalService(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={19} color="#64748B" />
              </button>
            </div>

            {/* Step 1: Select Date & Time Slot */}
            {bookingStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                    {isHindi ? 'अपॉइंटमेंट तिथि चुनें' : 'Select Appointment Date'}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#0F172A'
                  }}>
                    <CalendarIcon size={16} color="#2563EB" />
                    <span>{selectedDate} {MONTH_NAMES[currentMonthIndex]} {currentYear} {isHindi ? '(शीघ्रतम उपलब्ध)' : '(Earliest Available)'}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                    {isHindi ? `समय स्लॉट चुनें (${bookingModalService.durationHi || bookingModalService.duration})` : `Select Time Slot (${bookingModalService.duration})`}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
                    {bookingModalService.slots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            background: isSelected ? '#EFF6FF' : '#FFFFFF',
                            border: isSelected ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            color: isSelected ? '#2563EB' : '#334155',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer'
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{
                  background: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#0369A1'
                }}>
                  {isHindi ? 'ℹ️ इस केंद्र पर फ़ास्ट-ट्रैक बायोमेट्रिक सत्यापन बूथ उपलब्ध है।' : 'ℹ️ Fast-track biometric verification booth available at this center.'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setBookingModalService(null)}
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
                    type="button"
                    onClick={() => setBookingStep(2)}
                    style={{
                      background: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 1.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? 'आगे: आवेदक जानकारी →' : 'Next: Applicant Info →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Applicant Info */}
            {bookingStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{isHindi ? 'आवेदक' : 'Applicant'}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginTop: '0.15rem' }}>
                    {user?.name || 'Pankaj Kumar'} {isHindi ? '(आधार सत्यापित)' : '(Aadhaar Verified)'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#334155', marginTop: '0.2rem' }}>
                    {isHindi ? 'पंजीकृत मोबाइल: +91 *******3210' : 'Registered Mobile: +91 *******3210'}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    {isHindi ? 'यात्रा का उद्देश्य / उप-सेवा' : 'Purpose of Visit / Sub-Service'}
                  </label>
                  <input
                    type="text"
                    defaultValue={isHindi ? (bookingModalService.subServicesHi ? bookingModalService.subServicesHi.split(',')[0] : bookingModalService.subServices.split(',')[0]) : bookingModalService.subServices.split(',')[0]}
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

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
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
                    {isHindi ? 'पीछे' : 'Back'}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
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
                    {isSubmitting ? (isHindi ? 'पुष्टि हो रही है...' : 'Confirming...') : (isHindi ? 'अपॉइंटमेंट की पुष्टि करें →' : 'Confirm Appointment →')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation Slip */}
            {bookingStep === 3 && upcomingAppointment && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <CheckCircle2 size={32} color="#16A34A" />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                  {isHindi ? 'अपॉइंटमेंट की पुष्टि हो गई!' : 'Appointment Confirmed!'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1.25rem 0' }}>
                  {isHindi ? 'सरकारी पोर्टल में आपका अपॉइंटमेंट स्लॉट सुरक्षित कर लिया गया है।' : 'Your appointment slot has been reserved in the government portal.'}
                </p>

                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'left',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748B' }}>{isHindi ? 'टोकन संख्या:' : 'Token Number:'}</span>
                    <strong style={{ color: '#2563EB', fontSize: '0.9rem' }}>{upcomingAppointment.tokenNo}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748B' }}>{isHindi ? 'सेवा:' : 'Service:'}</span>
                    <strong>{upcomingAppointment.serviceTitle}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748B' }}>{isHindi ? 'तारीख व समय:' : 'Date & Time:'}</span>
                    <strong>{upcomingAppointment.date} {isHindi ? 'को' : 'at'} {upcomingAppointment.time}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>{isHindi ? 'स्थान / केंद्र:' : 'Location:'}</span>
                    <strong>{upcomingAppointment.center}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(isHindi ? 'अपॉइंटमेंट रसीद डाउनलोड की गई (PDF)' : 'Appointment slip downloaded (PDF).');
                      setBookingModalService(null);
                    }}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.5rem 1.15rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? 'रसीद डाउनलोड करें (PDF)' : 'Download Slip (PDF)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingModalService(null)}
                    style={{
                      background: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 1.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isHindi ? 'पूर्ण' : 'Done'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsTab;
