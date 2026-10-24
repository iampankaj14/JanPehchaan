import React, { useState } from 'react';
import { X, UserPlus, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { ApiService } from '../../services/api';
import { INDIAN_STATES_DISTRICTS, STATES_LIST } from '../../utils/geoData';

export function AddFamilyModal({ isOpen, onClose, onFamilyCreated, currentLang = 'en' }) {
  const isHindi = currentLang === 'hi';

  const [headName, setHeadName] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Gautam Buddha Nagar');
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [landHoldingAcres, setLandHoldingAcres] = useState(1.5);
  const [category, setCategory] = useState('OBC');
  const [headAge, setHeadAge] = useState(45);
  const [headGender, setHeadGender] = useState('Male');
  const [phone, setPhone] = useState('9876543210');
  const [rationCardNumber, setRationCardNumber] = useState('RC-881920');

  // Additional members
  const [members, setMembers] = useState([
    { name: isHindi ? 'सुनीता देवी' : 'Sunita Devi', relation: 'Spouse', age: 42, gender: 'Female' },
    { name: isHindi ? 'अमित शर्मा' : 'Amit Sharma', relation: 'Son', age: 18, gender: 'Male' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddMember = () => {
    setMembers([...members, { name: '', relation: 'Daughter', age: 16, gender: 'Female' }]);
  };

  const handleUpdateMember = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kinship validation check
    if (Number(annualIncome) < 0) {
      setError(isHindi ? 'वार्षिक आय ऋणात्मक नहीं हो सकती।' : 'Annual income cannot be negative.');
      return;
    }

    for (const m of members) {
      if ((m.relation === 'Son' || m.relation === 'Daughter') && Number(headAge) - Number(m.age) < 15) {
        setError(
          isHindi
            ? `पीढ़ी अंतर त्रुटि: अभिभावक (${headName}, आयु ${headAge}) बच्चे (${m.name}, आयु ${m.age}) से कम से कम 15 वर्ष बड़े होने चाहिए।`
            : `Generational conflict: Parent (${headName}, age ${headAge}) cannot be less than 15 years older than child (${m.name}, age ${m.age}).`
        );
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        headName,
        district,
        state,
        annualIncome: Number(annualIncome),
        landHoldingAcres: Number(landHoldingAcres),
        category,
        rationCardNumber,
        members: [
          {
            name: headName,
            relation: 'HEAD',
            age: Number(headAge),
            gender: headGender,
            aadhaarLast4: phone.slice(-4) || '9911',
            occupation: isHindi ? 'किसान' : 'Farmer'
          },
          ...members.map((m) => ({
            name: m.name,
            relation: m.relation.toUpperCase(),
            age: Number(m.age),
            gender: m.gender,
            aadhaarLast4: '3821',
            occupation: isHindi ? 'विद्यार्थी / आश्रित' : 'Student / Dependent'
          }))
        ]
      };

      const res = await ApiService.createFamily(payload);
      onFamilyCreated(res.family || { id: 'FAM-' + Math.floor(100 + Math.random() * 900), ...payload });
      onClose();
    } catch (err) {
      setError(err.message || (isHindi ? 'पारिवारिक रिकॉर्ड बनाने में विफल।' : 'Failed to create family record.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8FAFC',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#0A84FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={18} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>
                {isHindi ? 'नया नागरिक परिवार नामांकित करें' : 'Enroll New Citizen Household'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                {isHindi ? 'जन पहचान एकीकृत परिवार रजिस्टर नामांकन' : 'JanPehchaan Unified Family Registry Enrolment'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              fontSize: '0.8125rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Head of Family Details */}
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E3A8A', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            {isHindi ? '१. परिवार के मुखिया का विवरण' : '1. Head of Household Information'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{isHindi ? 'मुखिया का पूरा नाम *' : 'Head Full Name *'}</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder={isHindi ? 'उदा. रमेश कुमार शर्मा' : 'e.g. Ramesh Kumar Sharma'}
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isHindi ? 'मोबाइल नंबर *' : 'Mobile Number *'}</label>
              <input
                type="tel"
                required
                className="form-input"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{isHindi ? 'आयु *' : 'Age *'}</label>
              <input
                type="number"
                required
                className="form-input"
                value={headAge}
                onChange={(e) => setHeadAge(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isHindi ? 'लिंग' : 'Gender'}</label>
              <select
                className="form-select"
                value={headGender}
                onChange={(e) => setHeadGender(e.target.value)}
              >
                <option value="Male">{isHindi ? 'पुरुष' : 'Male'}</option>
                <option value="Female">{isHindi ? 'महिला' : 'Female'}</option>
                <option value="Other">{isHindi ? 'अन्य' : 'Other'}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{isHindi ? 'राज्य *' : 'State *'}</label>
              <select
                className="form-select"
                value={state}
                onChange={(e) => {
                  const newState = e.target.value;
                  setState(newState);
                  const firstDistrict = INDIAN_STATES_DISTRICTS[newState]?.[0] || '';
                  setDistrict(firstDistrict);
                }}
              >
                {STATES_LIST.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{isHindi ? 'जिला (चयन करें) *' : 'District (Select Mode) *'}</label>
              <select
                className="form-select"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                {(INDIAN_STATES_DISTRICTS[state] || [district]).map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Socio-Economic Parameters */}
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E3A8A', margin: '1rem 0 0.75rem 0', textTransform: 'uppercase' }}>
            {isHindi ? '२. सामाजिक-आर्थिक मानदंड (कल्याण योजना डेटा)' : '2. Socio-Economic Criteria (Welfare Engine Data)'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{isHindi ? 'वार्षिक आय (₹)' : 'Annual Income (₹)'}</label>
              <input
                type="number"
                required
                className="form-input"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isHindi ? 'कृषि भूमि (एकड़)' : 'Land Holding (Acres)'}</label>
              <input
                type="number"
                step="0.1"
                required
                className="form-input"
                value={landHoldingAcres}
                onChange={(e) => setLandHoldingAcres(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isHindi ? 'सामाजिक श्रेणी' : 'Social Category'}</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="OBC">OBC (अन्य पिछड़ा वर्ग)</option>
                <option value="SC">SC (अनुसूचित जाति)</option>
                <option value="ST">ST (अनुसूचित जनजाति)</option>
                <option value="GENERAL">{isHindi ? 'सामान्य' : 'General'}</option>
                <option value="EWS">EWS (आर्थिक रूप से कमजोर)</option>
              </select>
            </div>
          </div>

          {/* Members List */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 0.5rem 0' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E3A8A', textTransform: 'uppercase' }}>
              {isHindi ? `३. पारिवारिक रिश्तेदार सदस्य (${members.length})` : `3. Family Kinship Members (${members.length})`}
            </span>
            <button
              type="button"
              onClick={handleAddMember}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              {isHindi ? '+ सदस्य जोड़ें' : '+ Add Member'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {members.map((m, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  required
                  placeholder={isHindi ? 'सदस्य का नाम' : 'Member Name'}
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                  value={m.name}
                  onChange={(e) => handleUpdateMember(idx, 'name', e.target.value)}
                />
                <select
                  className="form-select"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                  value={m.relation}
                  onChange={(e) => handleUpdateMember(idx, 'relation', e.target.value)}
                >
                  <option value="Spouse">{isHindi ? 'जीवनसाथी' : 'Spouse'}</option>
                  <option value="Son">{isHindi ? 'पुत्र' : 'Son'}</option>
                  <option value="Daughter">{isHindi ? 'पुत्री' : 'Daughter'}</option>
                  <option value="Father">{isHindi ? 'पिता' : 'Father'}</option>
                  <option value="Mother">{isHindi ? 'माता' : 'Mother'}</option>
                </select>
                <input
                  type="number"
                  placeholder={isHindi ? 'आयु' : 'Age'}
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                  value={m.age}
                  onChange={(e) => handleUpdateMember(idx, 'age', e.target.value)}
                />
                <select
                  className="form-select"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                  value={m.gender}
                  onChange={(e) => handleUpdateMember(idx, 'gender', e.target.value)}
                >
                  <option value="Female">{isHindi ? 'महिला' : 'Female'}</option>
                  <option value="Male">{isHindi ? 'पुरुष' : 'Male'}</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(idx)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-azure"
            style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
          >
            {loading
              ? (isHindi ? 'सत्यापन एवं नामांकन जारी...' : 'Validating & Enrolling...')
              : (isHindi ? '✓ जन पहचान में परिवार पंजीकृत करें' : '✓ Register Household in JanPehchaan')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFamilyModal;
