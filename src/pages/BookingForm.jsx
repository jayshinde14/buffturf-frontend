import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ══════════════════════════════════════════════════════════════
//  VALIDATION RULES
// ══════════════════════════════════════════════════════════════

const validateName = (v) => {
    const val = v.trim();
    if (!val) return 'Full name is required';
    if (val.length < 4) return 'Name is too short';
    if (val.length > 50) return 'Name is too long (max 50 characters)';
    if (/[^a-zA-Z\s]/.test(val)) return 'Name must contain only letters — no numbers or symbols';
    if (/\s{2,}/.test(val)) return 'No double spaces allowed in name';
    const words = val.split(' ').filter(w => w.length > 0);
    if (words.length < 2) return 'Enter full name: first and last name (e.g. Rahul Sharma)';
    if (words.some(w => w.length < 2)) return 'Each part of the name must be at least 2 letters';
    return '';
};

const validatePhone = (v) => {
    const val = v.trim();
    if (!val) return 'Phone number is required';
    if (/[^0-9]/.test(val)) return 'Phone number must contain digits only — no spaces or symbols';
    if (val.length !== 10) return `Phone must be exactly 10 digits (you entered ${val.length})`;
    if (!/^[6-9]/.test(val)) return 'Invalid — Indian mobile numbers start with 6, 7, 8 or 9';
    if (/^(.)\1{9}$/.test(val)) return 'Invalid — repeated digits not allowed (e.g. 9999999999)';
    return '';
};

const validateEmail = (v) => {
    const val = v.trim();
    if (!val) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return 'Enter a valid email address (e.g. rahul@gmail.com)';
    return '';
};

const validateDOB = (v) => {
    if (!v) return 'Date of birth is required';
    const dob = new Date(v);
    const today = new Date();
    const year = dob.getFullYear();
    if (year < 1960) return 'Date of birth cannot be before the year 1960';
    if (dob >= today) return 'Date of birth cannot be today or in the future';
    const age = today.getFullYear() - year -
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    if (age < 5) return 'Player must be at least 5 years old to book';
    if (age > 80) return 'Please enter a valid date of birth';
    return '';
};

const validateGovtId = (v) => {
    const val = v.trim().toUpperCase();
    if (!val) return 'Government ID is required';
    if (/\s/.test(v.trim())) return 'Government ID must not contain spaces';
    if (/[^a-zA-Z0-9]/.test(val)) return 'Government ID must contain only letters and numbers — no symbols';
    if (val.length < 6) return 'Government ID is too short (minimum 6 characters)';
    if (val.length > 20) return 'Government ID is too long (maximum 20 characters)';
    if (/^\d+$/.test(val) && val.length !== 12) return 'Aadhar number must be exactly 12 digits';
    return '';
};

const validateGender = (v) => (!v ? 'Please select your gender' : '');

const validateAge = (v) => {
    if (!v && v !== 0) return 'Age is required';
    if (/[^0-9]/.test(String(v))) return 'Age must be a number';
    const n = parseInt(v, 10);
    if (n < 5) return 'Must be at least 5 years old';
    if (n > 80) return 'Please enter a valid age (max 80)';
    return '';
};

const VALIDATORS = {
    fullName: validateName,
    phone: validatePhone,
    email: validateEmail,
    dob: validateDOB,
    govtId: validateGovtId,
    gender: validateGender,
};

const validatePlayerField = (field, value) => {
    switch (field) {
        case 'name': {
            const e = validateName(value);
            if (e.includes('first and last')) return 'Enter first & last name (e.g. Amit Verma)';
            if (e.includes('only letters')) return 'Letters only — no numbers or symbols';
            return e;
        }
        case 'age': return validateAge(value);
        case 'contact': {
            const e = validatePhone(value);
            if (e.includes('exactly 10')) return `Must be 10 digits (${String(value).trim().length} entered)`;
            if (e.includes('start with')) return 'Must start with 6, 7, 8 or 9';
            return e;
        }
        case 'governmentId': {
            const e = validateGovtId(value);
            if (e.includes('too short')) return 'Min 6 characters required';
            return e;
        }
        case 'gender': return validateGender(value);
        default: return '';
    }
};

// ══════════════════════════════════════════════════════════════

function BookingForm() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const turf = state?.turf;
    const slot = state?.slot;
    const date = state?.date;

    const [form, setForm] = useState({ fullName: '', phone: '', email: '', gender: '', govtId: '', dob: '' });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [players, setPlayers] = useState([]);
    const [playerErrors, setPlayerErrors] = useState([]);
    const [playerTouched, setPlayerTouched] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!turf || !slot) {
        return (
            <div style={styles.page}><Navbar />
                <div style={styles.center}>
                    <p style={{ color: '#ef4444', fontSize: '18px', marginBottom: '20px' }}>No booking info found!</p>
                    <button style={styles.backBtn} onClick={() => navigate('/turfs')}>Go to Turfs</button>
                </div>
            </div>
        );
    }

    const getColor = (sport) => {
        const map = { Football: '#60a5fa', Cricket: '#4ade80', Basketball: '#fb923c', Badminton: '#e879f9', Tennis: '#a3e635' };
        return map[sport] || '#22c55e';
    };
    const color = getColor(turf.sportType);

    const formatTime = (time) => {
        if (!time) return '';
        const [h, m] = time.toString().split(':');
        const hour = parseInt(h);
        return `${hour % 12 || 12}:${m || '00'} ${hour >= 12 ? 'PM' : 'AM'}`;
    };

    // ── Main form handlers ─────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        const cleaned = name === 'phone' ? value.replace(/\D/g, '') : value;
        setForm(prev => ({ ...prev, [name]: cleaned }));
        if (touched[name]) {
            setFormErrors(prev => ({ ...prev, [name]: VALIDATORS[name]?.(cleaned) || '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFormErrors(prev => ({ ...prev, [name]: VALIDATORS[name]?.(value) || '' }));
    };

    // ── Player handlers ────────────────────────────────────────────────────────
    const addPlayer = () => {
        if (players.length >= 9) { alert('Maximum 10 players allowed (including you)!'); return; }
        setPlayers(p => [...p, { name: '', age: '', gender: '', contact: '', governmentId: '' }]);
        setPlayerErrors(p => [...p, {}]);
        setPlayerTouched(p => [...p, {}]);
    };

    const updatePlayer = (i, field, raw) => {
        const value = field === 'contact' ? raw.replace(/\D/g, '') : raw;
        const updated = [...players];
        updated[i] = { ...updated[i], [field]: value };
        setPlayers(updated);
        if (playerTouched[i]?.[field]) {
            const errs = [...playerErrors];
            errs[i] = { ...(errs[i] || {}), [field]: validatePlayerField(field, value) };
            setPlayerErrors(errs);
        }
    };

    const blurPlayer = (i, field, value) => {
        const t = [...playerTouched]; t[i] = { ...(t[i] || {}), [field]: true }; setPlayerTouched(t);
        const e = [...playerErrors]; e[i] = { ...(e[i] || {}), [field]: validatePlayerField(field, value) }; setPlayerErrors(e);
    };

    const removePlayer = (i) => {
        setPlayers(players.filter((_, idx) => idx !== i));
        setPlayerErrors(playerErrors.filter((_, idx) => idx !== i));
        setPlayerTouched(playerTouched.filter((_, idx) => idx !== i));
    };

    // ── Border helpers ─────────────────────────────────────────────────────────
    const border = (name) => {
        if (!touched[name]) return '1px solid #334155';
        return formErrors[name] ? '1px solid #ef4444' : `1px solid ${color}`;
    };
    const pBorder = (i, field) => {
        if (!playerTouched[i]?.[field]) return '1px solid #334155';
        return playerErrors[i]?.[field] ? '1px solid #ef4444' : `1px solid ${color}`;
    };

    // ── Payment ────────────────────────────────────────────────────────────────
    const handlePayment = async () => {
        const allTouched = Object.fromEntries(Object.keys(VALIDATORS).map(k => [k, true]));
        setTouched(allTouched);
        const newErrors = Object.fromEntries(Object.keys(VALIDATORS).map(k => [k, VALIDATORS[k](form[k] || '')]));
        setFormErrors(newErrors);

        if (Object.values(newErrors).some(e => e)) {
            setError('Please fix all highlighted errors in your details before proceeding to payment.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const pFields = ['name', 'age', 'contact', 'governmentId', 'gender'];
        const newPTouched = players.map(() => Object.fromEntries(pFields.map(f => [f, true])));
        setPlayerTouched(newPTouched);
        const newPErrors = players.map(p => Object.fromEntries(pFields.map(f => [f, validatePlayerField(f, p[f] || '')])));
        setPlayerErrors(newPErrors);

        if (newPErrors.some(errs => Object.values(errs).some(e => e))) {
            setError('Please fix all highlighted errors in player details before proceeding to payment.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const orderRes = await axios.post(
                'https://buffturf-backend.onrender.com/api/payments/create-order',
                { amount: turf.pricePerHour, turfId: turf.id, slotId: slot.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const { orderId, amount, currency, keyId } = orderRes.data;

            const options = {
                key: keyId, amount, currency,
                name: 'BuffTURF',
                description: `Booking: ${turf.name}`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            'https://buffturf-backend.onrender.com/api/payments/verify',
                            {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                turfId: turf.id, slotId: slot.id, bookingDate: date,
                                players: [
                                    {
                                        name: form.fullName.trim(),
                                        age: new Date().getFullYear() - new Date(form.dob).getFullYear(),
                                        gender: form.gender,
                                        contact: form.phone,
                                        governmentId: form.govtId.trim().toUpperCase(),
                                    },
                                    ...players.map(p => ({
                                        name: p.name.trim(),
                                        age: parseInt(p.age) || 0,
                                        gender: p.gender,
                                        contact: p.contact,
                                        governmentId: p.governmentId.trim().toUpperCase(),
                                    }))
                                ]
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        navigate('/booking-confirmation', { state: { booking: verifyRes.data } });
                    } catch {
                        setError('Payment verified but booking failed! Contact support.');
                        setLoading(false);
                    }
                },
                prefill: { name: form.fullName, email: form.email, contact: form.phone },
                theme: { color },
                modal: { ondismiss: () => { setError('Payment was cancelled. Please try again.'); setLoading(false); } }
            };
            new window.Razorpay(options).open();
        } catch {
            setError('Payment initialization failed! Please try again.');
            setLoading(false);
        }
    };

    // ── Inline feedback components ────────────────────────────────────────────
    const Err = ({ msg }) => msg ? (
        <span style={styles.errMsg}>✕ {msg}</span>
    ) : null;
    const Good = ({ show }) => show ? (
        <span style={styles.okMsg}>✓ Looks good</span>
    ) : null;

    const dobMin = '1960-01-01';
    const dobMax = new Date().toISOString().split('T')[0];

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input, select { outline: none; font-family: 'Barlow', sans-serif; }
                input:focus, select:focus { border-color: ${color} !important; box-shadow: 0 0 0 3px ${color}20; }
                input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
                @media (max-width: 768px) {
                    .body-wrap { padding: 16px !important; }
                    .summary-card { flex-direction: column !important; gap: 12px !important; padding: 18px !important; }
                    .summary-right { text-align: left !important; border-top: 1px solid #1e293b; padding-top: 12px; }
                    .summary-price { font-size: 28px !important; }
                    .form-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
                    .players-title-row { flex-wrap: wrap !important; gap: 10px !important; }
                    .confirm-row { flex-direction: column !important; }
                    .confirm-row button { width: 100% !important; }
                    .payment-notice { flex-wrap: wrap !important; gap: 10px !important; }
                }
                @media (max-width: 480px) {
                    .player-fields { grid-template-columns: 1fr !important; }
                }
            `}</style>
            <Navbar />

            <div className="body-wrap" style={styles.body}>

                {/* Summary */}
                <div className="summary-card" style={{ ...styles.summaryCard, borderTop: `4px solid ${color}` }}>
                    <div>
                        <p style={styles.summaryLabel}>Booking Summary</p>
                        <h2 style={{ ...styles.summaryTurf, color }}>{turf.name}</h2>
                        <p style={styles.summaryDetail}>📍 {turf.location}</p>
                        <p style={styles.summaryDetail}>📅 {date}</p>
                        <p style={styles.summaryDetail}>⏰ {formatTime(slot.startTime)} → {formatTime(slot.endTime)}</p>
                    </div>
                    <div className="summary-right" style={styles.summaryRight}>
                        <p style={styles.summaryPriceLabel}>Amount</p>
                        <p className="summary-price" style={{ ...styles.summaryPrice, color }}>₹{turf.pricePerHour}</p>
                        <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>for 1 hour</p>
                    </div>
                </div>

                <div className="form-grid" style={styles.formGrid}>

                    {/* ── Main Booker ── */}
                    <div style={styles.formCard}>
                        <h2 style={styles.formTitle}>👤 Your Details</h2>
                        <p style={styles.formSub}>All fields are required — please enter accurate information</p>

                        <div style={styles.fieldStack}>

                            {/* Full Name */}
                            <div>
                                <label style={styles.label}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    style={{ ...styles.input, border: border('fullName') }}
                                    type="text" name="fullName"
                                    placeholder="e.g. Rahul Sharma"
                                    value={form.fullName}
                                    onChange={handleChange} onBlur={handleBlur}
                                    maxLength={50}
                                />
                                <Err msg={touched.fullName && formErrors.fullName} />
                                <Good show={touched.fullName && !formErrors.fullName && form.fullName} />
                                <p style={styles.hint}>Letters and spaces only • First + last name required</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={styles.label}>Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ display: 'flex' }}>
                                    <span style={styles.phonePrefix}>🇮🇳 +91</span>
                                    <input
                                        style={{ ...styles.input, borderRadius: '0 8px 8px 0', flex: 1, border: border('phone') }}
                                        type="tel" name="phone"
                                        placeholder="10-digit mobile number"
                                        value={form.phone}
                                        onChange={handleChange} onBlur={handleBlur}
                                        maxLength={10} inputMode="numeric"
                                    />
                                </div>
                                <Err msg={touched.phone && formErrors.phone} />
                                <Good show={touched.phone && !formErrors.phone && form.phone} />
                                <p style={styles.hint}>Starts with 6-9 • Exactly 10 digits • Indian mobile only</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label style={styles.label}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    style={{ ...styles.input, border: border('email') }}
                                    type="email" name="email"
                                    placeholder="e.g. rahul@gmail.com"
                                    value={form.email}
                                    onChange={handleChange} onBlur={handleBlur}
                                    maxLength={80}
                                />
                                <Err msg={touched.email && formErrors.email} />
                                <Good show={touched.email && !formErrors.email && form.email} />
                            </div>

                            {/* DOB */}
                            <div>
                                <label style={styles.label}>Date of Birth <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    style={{ ...styles.input, border: border('dob') }}
                                    type="date" name="dob"
                                    min={dobMin} max={dobMax}
                                    value={form.dob}
                                    onChange={handleChange} onBlur={handleBlur}
                                />
                                <Err msg={touched.dob && formErrors.dob} />
                                <Good show={touched.dob && !formErrors.dob && form.dob} />
                                <p style={styles.hint}>From 1960 to today • Age must be 5–80 years</p>
                            </div>

                            {/* Govt ID */}
                            <div>
                                <label style={styles.label}>Aadhar / PAN Number <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    style={{ ...styles.input, border: border('govtId'), textTransform: 'uppercase', letterSpacing: '1px' }}
                                    type="text" name="govtId"
                                    placeholder="12-digit Aadhar or PAN number"
                                    value={form.govtId}
                                    onChange={handleChange} onBlur={handleBlur}
                                    maxLength={20}
                                />
                                <Err msg={touched.govtId && formErrors.govtId} />
                                <Good show={touched.govtId && !formErrors.govtId && form.govtId} />
                                <p style={styles.hint}>Aadhar: 12 digits • PAN: 10 alphanumeric • No spaces or symbols</p>
                            </div>

                            {/* Gender */}
                            <div>
                                <label style={styles.label}>Gender <span style={{ color: '#ef4444' }}>*</span></label>
                                <select
                                    style={{ ...styles.input, border: border('gender') }}
                                    name="gender" value={form.gender}
                                    onChange={handleChange} onBlur={handleBlur}
                                >
                                    <option value="">— Select Gender —</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <Err msg={touched.gender && formErrors.gender} />
                            </div>
                        </div>
                    </div>

                    {/* ── Players ── */}
                    <div style={styles.formCard}>
                        <div className="players-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <h2 style={styles.formTitle}>👥 Add Friends</h2>
                                <p style={styles.formSub}>{players.length}/9 friends added (max 10 total)</p>
                            </div>
                            <button style={{ ...styles.addPlayerBtn, background: color }} onClick={addPlayer}>
                                + Add Friend
                            </button>
                        </div>

                        {players.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#0f172a', borderRadius: '10px', border: '1px dashed #334155' }}>
                                <p style={{ fontSize: '40px', marginBottom: '8px' }}>👥</p>
                                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 4px' }}>No friends added yet</p>
                                <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Click "Add Friend" to add teammates!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
                                {players.map((p, i) => (
                                    <div key={i} style={{ background: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #334155' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                            <span style={{ background: color, color: '#000', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>P{i + 2}</span>
                                            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>Player {i + 2}</span>
                                            <button style={{ marginLeft: 'auto', background: '#1a0808', color: '#ef4444', border: '1px solid #7f1d1d', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }} onClick={() => removePlayer(i)}>✕ Remove</button>
                                        </div>

                                        <div className="player-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            {/* Name */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <label style={styles.pLabel}>Full Name *</label>
                                                <input style={{ ...styles.playerInput, border: pBorder(i, 'name') }}
                                                    type="text" placeholder="First Last"
                                                    value={p.name}
                                                    onChange={e => updatePlayer(i, 'name', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'name', e.target.value)} maxLength={50} />
                                                {playerTouched[i]?.name && playerErrors[i]?.name && <span style={styles.pErr}>✕ {playerErrors[i].name}</span>}
                                            </div>
                                            {/* Age */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <label style={styles.pLabel}>Age *</label>
                                                <input style={{ ...styles.playerInput, border: pBorder(i, 'age') }}
                                                    type="number" placeholder="Age (5–80)"
                                                    value={p.age} min={5} max={80}
                                                    onChange={e => updatePlayer(i, 'age', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'age', e.target.value)} />
                                                {playerTouched[i]?.age && playerErrors[i]?.age && <span style={styles.pErr}>✕ {playerErrors[i].age}</span>}
                                            </div>
                                            {/* Contact */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <label style={styles.pLabel}>Mobile *</label>
                                                <input style={{ ...styles.playerInput, border: pBorder(i, 'contact') }}
                                                    type="tel" placeholder="10-digit number"
                                                    value={p.contact}
                                                    onChange={e => updatePlayer(i, 'contact', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'contact', e.target.value)}
                                                    maxLength={10} inputMode="numeric" />
                                                {playerTouched[i]?.contact && playerErrors[i]?.contact && <span style={styles.pErr}>✕ {playerErrors[i].contact}</span>}
                                            </div>
                                            {/* Govt ID */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <label style={styles.pLabel}>Govt ID *</label>
                                                <input style={{ ...styles.playerInput, border: pBorder(i, 'governmentId'), textTransform: 'uppercase' }}
                                                    type="text" placeholder="Aadhar / PAN"
                                                    value={p.governmentId}
                                                    onChange={e => updatePlayer(i, 'governmentId', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'governmentId', e.target.value)} maxLength={20} />
                                                {playerTouched[i]?.governmentId && playerErrors[i]?.governmentId && <span style={styles.pErr}>✕ {playerErrors[i].governmentId}</span>}
                                            </div>
                                            {/* Gender */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                                                <label style={styles.pLabel}>Gender *</label>
                                                <select style={{ ...styles.playerInput, border: pBorder(i, 'gender') }}
                                                    value={p.gender}
                                                    onChange={e => updatePlayer(i, 'gender', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'gender', e.target.value)}>
                                                    <option value="">— Select —</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {playerTouched[i]?.gender && playerErrors[i]?.gender && <span style={styles.pErr}>✕ {playerErrors[i].gender}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Error banner */}
                {error && (
                    <div style={styles.errorBox}>
                        ❗ {error}
                    </div>
                )}

                {/* Payment notice */}
                <div className="payment-notice" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '20px' }}>🔒</span>
                    <div>
                        <p style={{ color: '#fff', fontWeight: '700', margin: '0 0 2px 0', fontSize: '14px' }}>Secure Payment via Razorpay</p>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>UPI • Cards • Net Banking • Wallets accepted</p>
                    </div>
                    <span style={{ marginLeft: 'auto', color, fontWeight: '800', fontSize: '18px' }}>₹{turf.pricePerHour}</span>
                </div>

                {/* Buttons */}
                <div className="confirm-row" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
                    <button style={styles.cancelBtn} onClick={() => navigate(-1)}>← Go Back</button>
                    <button
                        style={{ ...styles.confirmBtn, background: color, opacity: loading ? 0.7 : 1 }}
                        onClick={handlePayment} disabled={loading}
                    >
                        {loading ? '⏳ Processing...' : `💳 Pay ₹${turf.pricePerHour} & Book`}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },
    center: { textAlign: 'center', padding: '80px' },
    backBtn: { background: '#22c55e', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '800' },
    body: { maxWidth: '1100px', margin: '0 auto', padding: '32px' },
    summaryCard: { background: '#111827', borderRadius: '12px', padding: '24px 28px', marginBottom: '28px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
    summaryLabel: { color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px 0' },
    summaryTurf: { fontSize: '24px', fontWeight: '800', margin: '4px 0 8px 0', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' },
    summaryDetail: { color: '#94a3b8', fontSize: '14px', margin: '2px 0' },
    summaryRight: { textAlign: 'right' },
    summaryPriceLabel: { color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' },
    summaryPrice: { fontSize: '36px', fontWeight: '800', margin: '4px 0' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' },
    formCard: { background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1e293b' },
    formTitle: { color: '#ffffff', fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0' },
    formSub: { color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' },
    fieldStack: { display: 'flex', flexDirection: 'column', gap: '16px' },
    label: { display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' },
    input: { width: '100%', padding: '12px 14px', background: '#0f172a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', transition: 'border-color 0.2s, box-shadow 0.2s' },
    phonePrefix: { background: '#1e293b', border: '1px solid #334155', borderRight: 'none', borderRadius: '8px 0 0 8px', padding: '12px 12px', color: '#94a3b8', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' },
    errMsg: { display: 'block', color: '#ef4444', fontSize: '12px', marginTop: '5px', fontWeight: '600', lineHeight: '1.5' },
    okMsg: { display: 'block', color: '#22c55e', fontSize: '12px', marginTop: '5px', fontWeight: '600' },
    hint: { color: '#475569', fontSize: '11px', margin: '4px 0 0 0', lineHeight: '1.5' },
    addPlayerBtn: { color: '#000', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap' },
    pLabel: { color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' },
    playerInput: { padding: '9px 10px', background: '#111827', borderRadius: '6px', color: '#ffffff', fontSize: '13px', width: '100%', transition: 'border-color 0.2s', fontFamily: "'Barlow', sans-serif" },
    pErr: { color: '#ef4444', fontSize: '10px', marginTop: '3px', fontWeight: '600', lineHeight: '1.4' },
    errorBox: { background: '#1a0808', border: '1px solid #7f1d1d', color: '#ef4444', padding: '14px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '600' },
    cancelBtn: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '14px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' },
    confirmBtn: { color: '#000', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '800', transition: 'opacity 0.2s' },
};

export default BookingForm;
