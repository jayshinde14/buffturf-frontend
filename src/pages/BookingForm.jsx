import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ═══════════════════════════════════════════════════════════════════
//  VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function validateName(v) {
    const val = (v || '').trim();
    if (!val) return 'Full name is required';
    if (/[^a-zA-Z\s]/.test(val)) return 'Only letters allowed — no numbers or symbols';
    if (/\s{2,}/.test(val)) return 'No double spaces allowed';
    const words = val.split(' ').filter(w => w.length > 0);
    if (words.length < 2) return 'Enter first AND last name (e.g. Rahul Sharma)';
    if (words.some(w => w.length < 2)) return 'Each name part must be at least 2 letters';
    if (val.length > 50) return 'Name too long (max 50 characters)';
    return '';
}

function validatePhone(v) {
    const val = (v || '').trim();
    if (!val) return 'Phone number is required';
    if (!/^\d+$/.test(val)) return 'Only digits allowed — no spaces, dashes or symbols';
    if (val.length !== 10) return `Must be exactly 10 digits (you typed ${val.length})`;
    if (!/^[6-9]/.test(val)) return 'Must start with 6, 7, 8 or 9 (Indian mobile)';
    if (/^(.)\1+$/.test(val)) return 'Invalid number — all same digit not allowed';
    return '';
}

function validateEmail(v) {
    const val = (v || '').trim();
    if (!val) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return 'Enter a valid email (e.g. name@gmail.com)';
    return '';
}

function validateDOB(v) {
    if (!v) return 'Date of birth is required';
    const dob = new Date(v);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date('1955-01-01');
    if (dob < minDate) return 'Year must be 1955 or later';
    if (dob >= today) return 'Date of birth cannot be today or in the future';
    // Calculate exact age
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 5) return 'Must be at least 5 years old';
    if (age > 75) return 'Age cannot exceed 75 years';
    return '';
}

function validateGovtId(v) {
    const val = (v || '').trim().toUpperCase();
    if (!val) return 'Government ID is required';
    if (/[^A-Z0-9]/.test(val)) return 'Only letters and numbers — no spaces or symbols';
    if (val.length < 6) return 'Too short — minimum 6 characters';
    if (val.length > 20) return 'Too long — maximum 20 characters';
    // Aadhar: must be exactly 12 digits
    if (/^\d+$/.test(val) && val.length !== 12) return 'Aadhar must be exactly 12 digits';
    return '';
}

function validateGender(v) {
    return !v ? 'Please select gender' : '';
}

function validatePlayerAge(v) {
    const val = String(v || '').trim();
    if (!val) return 'Age is required';
    if (!/^\d+$/.test(val)) return 'Age must be a number';
    const n = parseInt(val, 10);
    if (n < 5) return 'Must be at least 5 years old';
    if (n > 75) return 'Must be 75 years or younger';
    return '';
}

// ═══════════════════════════════════════════════════════════════════

export default function BookingForm() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const turf = state?.turf;
    const slot = state?.slot;
    const date = state?.date;

    // ── Main booker form state ──────────────────────────────────────
    const [form, setForm] = useState({
        fullName: '', phone: '', email: '', gender: '', govtId: '', dob: ''
    });
    const [errors, setErrors]   = useState({});
    const [touched, setTouched] = useState({});

    // ── Players state ───────────────────────────────────────────────
    const [players, setPlayers]           = useState([]);
    const [pErrors, setPErrors]           = useState([]);
    const [pTouched, setPTouched]         = useState([]);

    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // ── Guard ───────────────────────────────────────────────────────
    if (!turf || !slot) {
        return (
            <div style={S.page}>
                <Navbar />
                <div style={S.center}>
                    <p style={{ color: '#ef4444', fontSize: '18px', marginBottom: '20px' }}>❌ No booking info found!</p>
                    <button style={S.backBtn} onClick={() => navigate('/turfs')}>Go to Turfs</button>
                </div>
            </div>
        );
    }

    // ── Helpers ─────────────────────────────────────────────────────
    const sportColor = { Football: '#60a5fa', Cricket: '#4ade80', Basketball: '#fb923c', Badminton: '#e879f9', Tennis: '#a3e635' };
    const color = sportColor[turf.sportType] || '#22c55e';

    const fmt = (t) => {
        if (!t) return '';
        const [h, m] = t.toString().split(':');
        const hr = parseInt(h);
        return `${hr % 12 || 12}:${m || '00'} ${hr >= 12 ? 'PM' : 'AM'}`;
    };

    // DOB limits: min 1955, max = today minus 5 years
    const dobMin = '1955-01-01';
    const dobMaxDate = new Date();
    dobMaxDate.setFullYear(dobMaxDate.getFullYear() - 5);
    const dobMax = dobMaxDate.toISOString().split('T')[0];

    // ── Main form handlers ──────────────────────────────────────────
    const FIELD_VALIDATORS = {
        fullName: validateName,
        phone:    validatePhone,
        email:    validateEmail,
        dob:      validateDOB,
        govtId:   validateGovtId,
        gender:   validateGender,
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        // Strip non-digits from phone while typing
        if (name === 'phone') value = value.replace(/\D/g, '').slice(0, 10);
        // Strip symbols from govtId while typing
        if (name === 'govtId') value = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
        setForm(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: FIELD_VALIDATORS[name](value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: FIELD_VALIDATORS[name](value) }));
    };

    // ── Player handlers ─────────────────────────────────────────────
    const PLAYER_VALIDATORS = {
        name:         validateName,
        age:          validatePlayerAge,
        contact:      validatePhone,
        governmentId: validateGovtId,
        gender:       validateGender,
    };

    const addPlayer = () => {
        if (players.length >= 9) { alert('Max 10 players (including you)!'); return; }
        setPlayers(prev  => [...prev,  { name: '', age: '', gender: '', contact: '', governmentId: '' }]);
        setPErrors(prev  => [...prev,  {}]);
        setPTouched(prev => [...prev,  {}]);
    };

    const updatePlayer = (i, field, raw) => {
        let value = raw;
        if (field === 'contact')      value = raw.replace(/\D/g, '').slice(0, 10);
        if (field === 'governmentId') value = raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
        const next = [...players];
        next[i] = { ...next[i], [field]: value };
        setPlayers(next);
        if (pTouched[i]?.[field]) {
            const ne = [...pErrors];
            ne[i] = { ...(ne[i] || {}), [field]: PLAYER_VALIDATORS[field]?.(value) || '' };
            setPErrors(ne);
        }
    };

    const blurPlayer = (i, field, value) => {
        const nt = [...pTouched]; nt[i] = { ...(nt[i] || {}), [field]: true }; setPTouched(nt);
        const ne = [...pErrors];  ne[i] = { ...(ne[i] || {}), [field]: PLAYER_VALIDATORS[field]?.(value) || '' }; setPErrors(ne);
    };

    const removePlayer = (i) => {
        setPlayers(prev  => prev.filter((_,x)  => x !== i));
        setPErrors(prev  => prev.filter((_,x)  => x !== i));
        setPTouched(prev => prev.filter((_,x)  => x !== i));
    };

    // ── Border colour helper ────────────────────────────────────────
    const bdr = (name) => {
        if (!touched[name]) return '1px solid #334155';
        return errors[name] ? '1px solid #ef4444' : `1px solid ${color}`;
    };
    const pbdr = (i, f) => {
        if (!pTouched[i]?.[f]) return '1px solid #334155';
        return pErrors[i]?.[f] ? '1px solid #ef4444' : `1px solid ${color}`;
    };

    // ── VALIDATE EVERYTHING & open Razorpay ─────────────────────────
    const handlePayment = async () => {
        setSubmitError('');

        // 1. Touch + validate all main fields
        const tAll = Object.fromEntries(Object.keys(FIELD_VALIDATORS).map(k => [k, true]));
        setTouched(tAll);
        const eAll = Object.fromEntries(
            Object.keys(FIELD_VALIDATORS).map(k => [k, FIELD_VALIDATORS[k](form[k] || '')])
        );
        setErrors(eAll);

        const mainHasErrors = Object.values(eAll).some(Boolean);
        if (mainHasErrors) {
            setSubmitError('❗ Fix the errors highlighted in red above before paying.');
            window.scrollTo({ top: 300, behavior: 'smooth' });
            return;
        }

        // 2. Touch + validate all player fields
        const pFields = ['name', 'age', 'contact', 'governmentId', 'gender'];
        const newPT = players.map(() => Object.fromEntries(pFields.map(f => [f, true])));
        setPTouched(newPT);
        const newPE = players.map(p =>
            Object.fromEntries(pFields.map(f => [f, PLAYER_VALIDATORS[f]?.(p[f] || '') || '']))
        );
        setPErrors(newPE);

        const playerHasErrors = newPE.some(e => Object.values(e).some(Boolean));
        if (playerHasErrors) {
            setSubmitError('❗ Fix the errors in player details before paying.');
            return;
        }

        // 3. All good — proceed to Razorpay
        setLoading(true);
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
                handler: async (response) => {
                    try {
                        const dobDate = new Date(form.dob);
                        const today   = new Date();
                        let age = today.getFullYear() - dobDate.getFullYear();
                        const m = today.getMonth() - dobDate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;

                        const verifyRes = await axios.post(
                            'https://buffturf-backend.onrender.com/api/payments/verify',
                            {
                                razorpayOrderId:   response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                turfId:      turf.id,
                                slotId:      slot.id,
                                bookingDate: date,
                                players: [
                                    {
                                        name:         form.fullName.trim(),
                                        age:          age,
                                        gender:       form.gender,
                                        contact:      form.phone,
                                        governmentId: form.govtId.trim().toUpperCase(),
                                    },
                                    ...players.map(p => ({
                                        name:         p.name.trim(),
                                        age:          parseInt(p.age) || 0,
                                        gender:       p.gender,
                                        contact:      p.contact,
                                        governmentId: p.governmentId.trim().toUpperCase(),
                                    }))
                                ]
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        navigate('/booking-confirmation', { state: { booking: verifyRes.data } });
                    } catch {
                        setSubmitError('Payment received but booking failed — please contact support.');
                        setLoading(false);
                    }
                },
                prefill: { name: form.fullName, email: form.email, contact: form.phone },
                theme:   { color },
                modal:   { ondismiss: () => { setSubmitError('Payment cancelled. Try again.'); setLoading(false); } }
            };
            new window.Razorpay(options).open();
        } catch {
            setSubmitError('Could not start payment. Please try again.');
            setLoading(false);
        }
    };

    // ── Tiny reusable error/ok labels ───────────────────────────────
    const ErrMsg = ({ msg }) => msg
        ? <span style={{ display:'block', color:'#ef4444', fontSize:'12px', marginTop:'5px', fontWeight:'600' }}>✕ {msg}</span>
        : null;
    const OkMsg = ({ show }) => show
        ? <span style={{ display:'block', color:'#22c55e', fontSize:'12px', marginTop:'5px', fontWeight:'600' }}>✓ Looks good</span>
        : null;
    const Hint = ({ text }) => (
        <span style={{ display:'block', color:'#475569', fontSize:'11px', marginTop:'4px' }}>{text}</span>
    );

    // ═══════════════════════════════════════════════════════════════
    //  RENDER
    // ═══════════════════════════════════════════════════════════════
    return (
        <div style={S.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input, select { outline: none; font-family: 'Barlow', sans-serif; transition: border-color .2s, box-shadow .2s; }
                input:focus, select:focus { border-color: ${color} !important; box-shadow: 0 0 0 3px ${color}25 !important; }
                input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(.6); cursor: pointer; }
                @media (max-width: 768px) {
                    .bwrap  { padding: 16px !important; }
                    .scard  { flex-direction: column !important; gap: 12px !important; padding: 18px !important; }
                    .sright { text-align: left !important; border-top: 1px solid #1e293b; padding-top: 12px; }
                    .sprice { font-size: 28px !important; }
                    .fgrid  { grid-template-columns: 1fr !important; gap: 16px !important; }
                    .ptrow  { flex-wrap: wrap !important; gap: 10px !important; }
                    .crow   { flex-direction: column !important; }
                    .crow button { width: 100% !important; }
                    .pnotice { flex-wrap: wrap !important; gap: 10px !important; }
                }
                @media (max-width: 480px) { .pfields { grid-template-columns: 1fr !important; } }
            `}</style>
            <Navbar />

            <div className="bwrap" style={S.body}>

                {/* ── Booking Summary ── */}
                <div className="scard" style={{ ...S.summaryCard, borderTop: `4px solid ${color}` }}>
                    <div>
                        <p style={S.sLabel}>Booking Summary</p>
                        <h2 style={{ ...S.sTurf, color }}>{turf.name}</h2>
                        <p style={S.sDet}>📍 {turf.location}</p>
                        <p style={S.sDet}>📅 {date}</p>
                        <p style={S.sDet}>⏰ {fmt(slot.startTime)} → {fmt(slot.endTime)}</p>
                    </div>
                    <div className="sright" style={S.sRight}>
                        <p style={S.sPriceLabel}>Amount</p>
                        <p className="sprice" style={{ ...S.sPrice, color }}>₹{turf.pricePerHour}</p>
                        <p style={{ color:'#64748b', fontSize:'12px', margin:0 }}>for 1 hour</p>
                    </div>
                </div>

                {/* ── Two-column form grid ── */}
                <div className="fgrid" style={S.formGrid}>

                    {/* ────── LEFT: Your Details ────── */}
                    <div style={S.card}>
                        <h2 style={S.cardTitle}>👤 Your Details</h2>
                        <p style={S.cardSub}>All fields required — enter accurate info</p>

                        {/* FULL NAME */}
                        <div style={S.field}>
                            <label style={S.label}>Full Name <span style={{color:'#ef4444'}}>*</span></label>
                            <input
                                style={{ ...S.input, border: bdr('fullName') }}
                                type="text" name="fullName"
                                placeholder="e.g. Rahul Sharma"
                                value={form.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={50}
                            />
                            <ErrMsg msg={touched.fullName && errors.fullName} />
                            <OkMsg show={touched.fullName && !errors.fullName && form.fullName} />
                            <Hint text="Letters & spaces only • First + last name required" />
                        </div>

                        {/* PHONE */}
                        <div style={S.field}>
                            <label style={S.label}>Mobile Number <span style={{color:'#ef4444'}}>*</span></label>
                            <div style={{ display:'flex' }}>
                                <span style={S.phoneFlag}>🇮🇳 +91</span>
                                <input
                                    style={{ ...S.input, borderRadius:'0 8px 8px 0', flex:1, border: bdr('phone') }}
                                    type="tel" name="phone"
                                    placeholder="10-digit mobile number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    maxLength={10}
                                    inputMode="numeric"
                                />
                            </div>
                            <ErrMsg msg={touched.phone && errors.phone} />
                            <OkMsg show={touched.phone && !errors.phone && form.phone} />
                            <Hint text="Starts with 6/7/8/9 • Exactly 10 digits • No spaces" />
                        </div>

                        {/* EMAIL */}
                        <div style={S.field}>
                            <label style={S.label}>Email Address <span style={{color:'#ef4444'}}>*</span></label>
                            <input
                                style={{ ...S.input, border: bdr('email') }}
                                type="email" name="email"
                                placeholder="e.g. rahul@gmail.com"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={80}
                            />
                            <ErrMsg msg={touched.email && errors.email} />
                            <OkMsg show={touched.email && !errors.email && form.email} />
                        </div>

                        {/* DATE OF BIRTH */}
                        <div style={S.field}>
                            <label style={S.label}>Date of Birth <span style={{color:'#ef4444'}}>*</span></label>
                            <input
                                style={{ ...S.input, border: bdr('dob') }}
                                type="date" name="dob"
                                min={dobMin}
                                max={dobMax}
                                value={form.dob}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrMsg msg={touched.dob && errors.dob} />
                            <OkMsg show={touched.dob && !errors.dob && form.dob} />
                            <Hint text="Age must be between 5 and 75 years • Year from 1955 onward" />
                        </div>

                        {/* GOVT ID */}
                        <div style={S.field}>
                            <label style={S.label}>Aadhar / PAN <span style={{color:'#ef4444'}}>*</span></label>
                            <input
                                style={{ ...S.input, border: bdr('govtId'), textTransform:'uppercase', letterSpacing:'1px' }}
                                type="text" name="govtId"
                                placeholder="12-digit Aadhar or PAN"
                                value={form.govtId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={20}
                            />
                            <ErrMsg msg={touched.govtId && errors.govtId} />
                            <OkMsg show={touched.govtId && !errors.govtId && form.govtId} />
                            <Hint text="Aadhar: 12 digits • PAN: e.g. ABCDE1234F • No spaces/symbols" />
                        </div>

                        {/* GENDER */}
                        <div style={S.field}>
                            <label style={S.label}>Gender <span style={{color:'#ef4444'}}>*</span></label>
                            <select
                                style={{ ...S.input, border: bdr('gender') }}
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <option value="">— Select Gender —</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <ErrMsg msg={touched.gender && errors.gender} />
                        </div>
                    </div>

                    {/* ────── RIGHT: Add Friends ────── */}
                    <div style={S.card}>
                        <div className="ptrow" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
                            <div>
                                <h2 style={S.cardTitle}>👥 Add Friends</h2>
                                <p style={S.cardSub}>{players.length}/9 friends added</p>
                            </div>
                            <button style={{ ...S.addBtn, background: color }} onClick={addPlayer}>+ Add Friend</button>
                        </div>

                        {players.length === 0 ? (
                            <div style={S.noPlayers}>
                                <p style={{ fontSize:'40px', margin:'0 0 8px' }}>👥</p>
                                <p style={{ color:'#94a3b8', fontSize:'14px', margin:'0 0 4px' }}>No friends added yet</p>
                                <p style={{ color:'#64748b', fontSize:'12px', margin:0 }}>Click "+ Add Friend" to add teammates!</p>
                            </div>
                        ) : (
                            <div style={{ display:'flex', flexDirection:'column', gap:'12px', maxHeight:'560px', overflowY:'auto' }}>
                                {players.map((p, i) => (
                                    <div key={i} style={S.playerCard}>
                                        {/* Player header */}
                                        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                                            <span style={{ ...S.pBadge, background: color }}>P{i+2}</span>
                                            <span style={{ color:'#fff', fontSize:'14px', fontWeight:'700' }}>Player {i+2}</span>
                                            <button style={S.removeBtn} onClick={() => removePlayer(i)}>✕ Remove</button>
                                        </div>

                                        {/* Player fields grid */}
                                        <div className="pfields" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>

                                            {/* Name */}
                                            <div style={{ display:'flex', flexDirection:'column' }}>
                                                <label style={S.pLabel}>Full Name *</label>
                                                <input
                                                    style={{ ...S.pInput, border: pbdr(i,'name') }}
                                                    type="text" placeholder="First Last"
                                                    value={p.name}
                                                    onChange={e => updatePlayer(i, 'name', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'name', e.target.value)}
                                                    maxLength={50}
                                                />
                                                {pTouched[i]?.name && pErrors[i]?.name &&
                                                    <span style={S.pErr}>✕ {pErrors[i].name}</span>}
                                            </div>

                                            {/* Age */}
                                            <div style={{ display:'flex', flexDirection:'column' }}>
                                                <label style={S.pLabel}>Age * (5–75)</label>
                                                <input
                                                    style={{ ...S.pInput, border: pbdr(i,'age') }}
                                                    type="number" placeholder="Age"
                                                    value={p.age} min={5} max={75}
                                                    onChange={e => updatePlayer(i, 'age', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'age', e.target.value)}
                                                />
                                                {pTouched[i]?.age && pErrors[i]?.age &&
                                                    <span style={S.pErr}>✕ {pErrors[i].age}</span>}
                                            </div>

                                            {/* Contact */}
                                            <div style={{ display:'flex', flexDirection:'column' }}>
                                                <label style={S.pLabel}>Mobile *</label>
                                                <input
                                                    style={{ ...S.pInput, border: pbdr(i,'contact') }}
                                                    type="tel" placeholder="10-digit number"
                                                    value={p.contact}
                                                    onChange={e => updatePlayer(i, 'contact', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'contact', e.target.value)}
                                                    maxLength={10} inputMode="numeric"
                                                />
                                                {pTouched[i]?.contact && pErrors[i]?.contact &&
                                                    <span style={S.pErr}>✕ {pErrors[i].contact}</span>}
                                            </div>

                                            {/* Govt ID */}
                                            <div style={{ display:'flex', flexDirection:'column' }}>
                                                <label style={S.pLabel}>Govt ID *</label>
                                                <input
                                                    style={{ ...S.pInput, border: pbdr(i,'governmentId'), textTransform:'uppercase' }}
                                                    type="text" placeholder="Aadhar / PAN"
                                                    value={p.governmentId}
                                                    onChange={e => updatePlayer(i, 'governmentId', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'governmentId', e.target.value)}
                                                    maxLength={20}
                                                />
                                                {pTouched[i]?.governmentId && pErrors[i]?.governmentId &&
                                                    <span style={S.pErr}>✕ {pErrors[i].governmentId}</span>}
                                            </div>

                                            {/* Gender — full width */}
                                            <div style={{ display:'flex', flexDirection:'column', gridColumn:'1 / -1' }}>
                                                <label style={S.pLabel}>Gender *</label>
                                                <select
                                                    style={{ ...S.pInput, border: pbdr(i,'gender') }}
                                                    value={p.gender}
                                                    onChange={e => updatePlayer(i, 'gender', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'gender', e.target.value)}
                                                >
                                                    <option value="">— Select —</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {pTouched[i]?.gender && pErrors[i]?.gender &&
                                                    <span style={S.pErr}>✕ {pErrors[i].gender}</span>}
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Error banner ── */}
                {submitError && (
                    <div style={S.errBanner}>{submitError}</div>
                )}

                {/* ── Secure payment notice ── */}
                <div className="pnotice" style={S.payNotice}>
                    <span style={{ fontSize:'20px' }}>🔒</span>
                    <div>
                        <p style={{ color:'#fff', fontWeight:'700', margin:'0 0 2px', fontSize:'14px' }}>Secure Payment via Razorpay</p>
                        <p style={{ color:'#64748b', margin:0, fontSize:'12px' }}>UPI • Cards • Net Banking • Wallets</p>
                    </div>
                    <span style={{ marginLeft:'auto', color, fontWeight:'800', fontSize:'18px' }}>₹{turf.pricePerHour}</span>
                </div>

                {/* ── Action buttons ── */}
                <div className="crow" style={{ display:'flex', justifyContent:'flex-end', gap:'12px', flexWrap:'wrap' }}>
                    <button style={S.cancelBtn} onClick={() => navigate(-1)}>← Go Back</button>
                    <button
                        style={{ ...S.payBtn, background: color, opacity: loading ? 0.7 : 1 }}
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? '⏳ Processing...' : `💳 Pay ₹${turf.pricePerHour} & Book`}
                    </button>
                </div>

            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════════
const S = {
    page:    { backgroundColor:'#050a14', minHeight:'100vh', fontFamily:"'Barlow', sans-serif" },
    center:  { textAlign:'center', padding:'80px' },
    backBtn: { background:'#22c55e', color:'#000', border:'none', padding:'12px 24px', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'800' },
    body:    { maxWidth:'1100px', margin:'0 auto', padding:'32px' },

    summaryCard:   { background:'#111827', borderRadius:'12px', padding:'24px 28px', marginBottom:'28px', border:'1px solid #1e293b', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' },
    sLabel:        { color:'#64748b', fontSize:'12px', textTransform:'uppercase', letterSpacing:'1px', margin:'0 0 6px' },
    sTurf:         { fontSize:'24px', fontWeight:'800', margin:'4px 0 8px', fontFamily:"'Bebas Neue', sans-serif", letterSpacing:'1px' },
    sDet:          { color:'#94a3b8', fontSize:'14px', margin:'2px 0' },
    sRight:        { textAlign:'right' },
    sPriceLabel:   { color:'#64748b', fontSize:'12px', textTransform:'uppercase', letterSpacing:'1px', margin:'0 0 4px' },
    sPrice:        { fontSize:'36px', fontWeight:'800', margin:'4px 0' },

    formGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px,1fr))', gap:'24px', marginBottom:'24px' },
    card:     { background:'#111827', borderRadius:'12px', padding:'24px', border:'1px solid #1e293b' },
    cardTitle:{ color:'#fff', fontSize:'18px', fontWeight:'800', margin:'0 0 4px' },
    cardSub:  { color:'#64748b', fontSize:'13px', margin:'0 0 20px' },

    field:     { marginBottom:'16px' },
    label:     { display:'block', color:'#94a3b8', fontSize:'12px', fontWeight:'700', letterSpacing:'.5px', marginBottom:'6px', textTransform:'uppercase' },
    input:     { width:'100%', padding:'12px 14px', background:'#0f172a', borderRadius:'8px', color:'#fff', fontSize:'14px' },
    phoneFlag: { background:'#1e293b', border:'1px solid #334155', borderRight:'none', borderRadius:'8px 0 0 8px', padding:'12px', color:'#94a3b8', fontSize:'13px', fontWeight:'600', display:'flex', alignItems:'center', whiteSpace:'nowrap' },

    addBtn:     { color:'#000', border:'none', padding:'10px 16px', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'800', whiteSpace:'nowrap' },
    noPlayers:  { textAlign:'center', padding:'40px 20px', background:'#0f172a', borderRadius:'10px', border:'1px dashed #334155' },
    playerCard: { background:'#0f172a', borderRadius:'10px', padding:'14px', border:'1px solid #334155' },
    pBadge:     { color:'#000', width:'24px', height:'24px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'800', flexShrink:0 },
    removeBtn:  { marginLeft:'auto', background:'#1a0808', color:'#ef4444', border:'1px solid #7f1d1d', borderRadius:'6px', padding:'4px 10px', cursor:'pointer', fontSize:'11px', fontWeight:'700' },
    pLabel:     { color:'#64748b', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'.4px', marginBottom:'4px' },
    pInput:     { padding:'9px 10px', background:'#111827', borderRadius:'6px', color:'#fff', fontSize:'13px', width:'100%', fontFamily:"'Barlow', sans-serif" },
    pErr:       { color:'#ef4444', fontSize:'10px', marginTop:'3px', fontWeight:'600' },

    errBanner: { background:'#1a0808', border:'1px solid #7f1d1d', color:'#ef4444', padding:'14px 20px', borderRadius:'8px', marginBottom:'20px', fontSize:'14px', fontWeight:'600' },
    payNotice: { background:'#0f172a', border:'1px solid #1e293b', borderRadius:'10px', padding:'16px 20px', display:'flex', alignItems:'center', gap:'14px', marginBottom:'20px' },
    cancelBtn: { background:'#1e293b', color:'#94a3b8', border:'1px solid #334155', padding:'14px 24px', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'700' },
    payBtn:    { color:'#000', border:'none', padding:'14px 32px', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'800', transition:'opacity .2s' },
};
