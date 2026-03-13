import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ─── Validation helpers ──────────────────────────────────────────────────────
const isValidName = (v) => /^[a-zA-Z\s]{2,}$/.test(v.trim()) && v.trim().split(/\s+/).length >= 2;
const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v.trim());
const isValidGovtId = (v) => /^[a-zA-Z0-9]{6,20}$/.test(v.trim());
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const validateField = (name, value) => {
    switch (name) {
        case 'fullName':
            if (!value.trim()) return 'Full name is required';
            if (!/^[a-zA-Z\s]+$/.test(value)) return 'Only letters and spaces allowed';
            if (value.trim().split(/\s+/).length < 2) return 'Enter first and last name (e.g. Raj Kumar)';
            return '';
        case 'phone':
            if (!value.trim()) return 'Phone number is required';
            if (!/^\d+$/.test(value.trim())) return 'Phone must contain only digits';
            if (!isValidPhone(value)) return 'Enter a valid 10-digit Indian mobile number (starts with 6-9)';
            return '';
        case 'email':
            if (!value.trim()) return 'Email is required';
            if (!isValidEmail(value)) return 'Enter a valid email address';
            return '';
        case 'govtId':
            if (!value.trim()) return 'Government ID is required';
            if (!isValidGovtId(value)) return 'Enter a valid ID (6-20 alphanumeric characters, no spaces)';
            return '';
        case 'gender':
            if (!value) return 'Please select gender';
            return '';
        case 'dob':
            if (!value) return 'Date of birth is required';
            return '';
        default:
            return '';
    }
};

const validatePlayerField = (field, value) => {
    switch (field) {
        case 'name':
            if (!value.trim()) return 'Name required';
            if (!/^[a-zA-Z\s]+$/.test(value)) return 'Letters only';
            if (value.trim().split(/\s+/).length < 2) return 'First & last name';
            return '';
        case 'age':
            if (!value) return 'Age required';
            if (isNaN(value) || parseInt(value) < 5 || parseInt(value) > 80) return 'Enter valid age (5-80)';
            return '';
        case 'contact':
            if (!value.trim()) return 'Contact required';
            if (!isValidPhone(value)) return 'Valid 10-digit number';
            return '';
        case 'governmentId':
            if (!value.trim()) return 'Govt ID required';
            if (!isValidGovtId(value)) return 'Valid ID (6-20 chars)';
            return '';
        case 'gender':
            if (!value) return 'Select gender';
            return '';
        default:
            return '';
    }
};
// ─────────────────────────────────────────────────────────────────────────────

function BookingForm() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const turf = state?.turf;
    const slot = state?.slot;
    const date = state?.date;

    const [form, setForm] = useState({
        fullName: '', phone: '', email: '',
        gender: '', govtId: '', dob: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [players, setPlayers] = useState([]);
    const [playerErrors, setPlayerErrors] = useState([]);
    const [playerTouched, setPlayerTouched] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!turf || !slot) {
        return (
            <div style={styles.page}>
                <Navbar />
                <div style={styles.center}>
                    <p style={styles.errTxt}>❌ No booking info found!</p>
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
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return `${hour % 12 || 12}:${m || '00'} ${ampm}`;
    };

    // ─── Main form handlers ──────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    // ─── Player handlers ─────────────────────────────────────────────
    const addPlayer = () => {
        if (players.length >= 9) { alert('Maximum 10 players allowed (including you)!'); return; }
        setPlayers(prev => [...prev, { name: '', age: '', gender: '', contact: '', governmentId: '' }]);
        setPlayerErrors(prev => [...prev, {}]);
        setPlayerTouched(prev => [...prev, {}]);
    };

    const updatePlayer = (index, field, value) => {
        const updated = [...players];
        updated[index][field] = value;
        setPlayers(updated);
        if (playerTouched[index]?.[field]) {
            const updatedErrors = [...playerErrors];
            updatedErrors[index] = { ...(updatedErrors[index] || {}), [field]: validatePlayerField(field, value) };
            setPlayerErrors(updatedErrors);
        }
    };

    const blurPlayer = (index, field, value) => {
        const updatedTouched = [...playerTouched];
        updatedTouched[index] = { ...(updatedTouched[index] || {}), [field]: true };
        setPlayerTouched(updatedTouched);
        const updatedErrors = [...playerErrors];
        updatedErrors[index] = { ...(updatedErrors[index] || {}), [field]: validatePlayerField(field, value) };
        setPlayerErrors(updatedErrors);
    };

    const removePlayer = (index) => {
        setPlayers(players.filter((_, i) => i !== index));
        setPlayerErrors(playerErrors.filter((_, i) => i !== index));
        setPlayerTouched(playerTouched.filter((_, i) => i !== index));
    };

    // ─── Input border helper ──────────────────────────────────────────
    const inputBorder = (name) => {
        if (!touched[name]) return '1px solid #334155';
        return formErrors[name] ? '1px solid #ef4444' : `1px solid ${color}`;
    };

    const playerInputBorder = (index, field) => {
        if (!playerTouched[index]?.[field]) return '1px solid #334155';
        return playerErrors[index]?.[field] ? '1px solid #ef4444' : `1px solid ${color}`;
    };

    // ─── Submit / Payment ────────────────────────────────────────────
    const handlePayment = async () => {
        // Touch all main fields
        const allTouched = { fullName: true, phone: true, email: true, gender: true, govtId: true, dob: true };
        setTouched(allTouched);
        const newFormErrors = {};
        Object.keys(allTouched).forEach(k => { newFormErrors[k] = validateField(k, form[k]); });
        setFormErrors(newFormErrors);

        if (Object.values(newFormErrors).some(e => e)) {
            setError('Please fix the errors in your details before proceeding.');
            return;
        }

        // Touch and validate all player fields
        const playerFields = ['name', 'age', 'contact', 'governmentId', 'gender'];
        const newPlayerTouched = players.map(() => Object.fromEntries(playerFields.map(f => [f, true])));
        setPlayerTouched(newPlayerTouched);
        const newPlayerErrors = players.map(p =>
            Object.fromEntries(playerFields.map(f => [f, validatePlayerField(f, p[f])]))
        );
        setPlayerErrors(newPlayerErrors);

        if (newPlayerErrors.some(errs => Object.values(errs).some(e => e))) {
            setError('Please fix the errors in player details before proceeding.');
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
                key: keyId,
                amount: amount,
                currency: currency,
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
                                turfId: turf.id,
                                slotId: slot.id,
                                bookingDate: date,
                                players: [
                                    {
                                        name: form.fullName,
                                        age: new Date().getFullYear() - new Date(form.dob).getFullYear(),
                                        gender: form.gender,
                                        contact: form.phone,
                                        governmentId: form.govtId,
                                    },
                                    ...players.map(p => ({
                                        name: p.name,
                                        age: parseInt(p.age) || 0,
                                        gender: p.gender,
                                        contact: p.contact,
                                        governmentId: p.governmentId,
                                    }))
                                ]
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        navigate('/booking-confirmation', { state: { booking: verifyRes.data } });
                    } catch (err) {
                        setError('Payment verified but booking failed! Contact support.');
                        setLoading(false);
                    }
                },
                prefill: { name: form.fullName, email: form.email, contact: form.phone },
                theme: { color: color },
                modal: {
                    ondismiss: function () {
                        setError('Payment cancelled! Please try again.');
                        setLoading(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (err) {
            setError('Payment initialization failed! Please try again.');
            setLoading(false);
        }
    };

    // helper to show inline field error
    const FieldErr = ({ msg }) => msg ? <span style={styles.fieldErr}>⚠ {msg}</span> : null;

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input, select { outline: none; }
                input:focus, select:focus { border-color: ${color} !important; }
                .field:focus-within label { color: ${color}; }

                @media (max-width: 768px) {
                    .body-wrap { padding: 16px !important; }
                    .summary-card { flex-direction: column !important; gap: 12px !important; padding: 18px !important; }
                    .summary-right { text-align: left !important; border-top: 1px solid #1e293b; padding-top: 12px; }
                    .summary-price { font-size: 28px !important; }
                    .form-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
                    .players-title-row { flex-wrap: wrap !important; gap: 10px !important; }
                    .confirm-row { flex-direction: column !important; }
                    .confirm-row button { width: 100% !important; text-align: center !important; }
                    .payment-notice { flex-wrap: wrap !important; gap: 10px !important; }
                }
                @media (max-width: 480px) {
                    .player-fields { grid-template-columns: 1fr !important; }
                }
            `}</style>
            <Navbar />

            <div className="body-wrap" style={styles.body}>

                {/* Booking Summary Card */}
                <div className="summary-card" style={{ ...styles.summaryCard, borderTop: `4px solid ${color}` }}>
                    <div style={styles.summaryLeft}>
                        <p style={styles.summaryLabel}>Booking Summary</p>
                        <h2 style={{ ...styles.summaryTurf, color }}>{turf.name}</h2>
                        <p style={styles.summaryDetail}>📍 {turf.location}</p>
                        <p style={styles.summaryDetail}>📅 {date}</p>
                        <p style={styles.summaryDetail}>⏰ {formatTime(slot.startTime)} → {formatTime(slot.endTime)}</p>
                    </div>
                    <div className="summary-right" style={styles.summaryRight}>
                        <p style={styles.summaryPriceLabel}>Amount</p>
                        <p className="summary-price" style={{ ...styles.summaryPrice, color }}>₹{turf.pricePerHour}</p>
                        <p style={styles.summaryPriceSub}>for 1 hour</p>
                    </div>
                </div>

                <div className="form-grid" style={styles.formGrid}>

                    {/* Left: Main Booker Form */}
                    <div style={styles.formCard}>
                        <h2 style={styles.formTitle}>👤 Your Details</h2>
                        <p style={styles.formSub}>Fill in your information to confirm booking</p>

                        <div style={styles.fieldGrid}>
                            {/* Full Name */}
                            <div className="field" style={styles.field}>
                                <label style={styles.label}>Full Name *</label>
                                <input
                                    style={{ ...styles.input, border: inputBorder('fullName') }}
                                    type="text"
                                    name="fullName"
                                    placeholder="e.g. Raj Kumar"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <FieldErr msg={touched.fullName && formErrors.fullName} />
                            </div>

                            {/* Phone */}
                            <div className="field" style={styles.field}>
                                <label style={styles.label}>Phone Number *</label>
                                <input
                                    style={{ ...styles.input, border: inputBorder('phone') }}
                                    type="tel"
                                    name="phone"
                                    placeholder="10-digit mobile number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    maxLength={10}
                                />
                                <FieldErr msg={touched.phone && formErrors.phone} />
                            </div>

                            {/* Email */}
                            <div className="field" style={styles.field}>
                                <label style={styles.label}>Email Address *</label>
                                <input
                                    style={{ ...styles.input, border: inputBorder('email') }}
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <FieldErr msg={touched.email && formErrors.email} />
                            </div>

                            {/* DOB */}
                            <div className="field" style={styles.field}>
                                <label style={styles.label}>Date of Birth *</label>
                                <input
                                    style={{ ...styles.input, border: inputBorder('dob') }}
                                    type="date"
                                    name="dob"
                                    value={form.dob}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <FieldErr msg={touched.dob && formErrors.dob} />
                            </div>

                            {/* Govt ID */}
                            <div className="field" style={styles.field}>
                                <label style={styles.label}>Government ID (Aadhar/PAN) *</label>
                                <input
                                    style={{ ...styles.input, border: inputBorder('govtId') }}
                                    type="text"
                                    name="govtId"
                                    placeholder="Enter Aadhar or PAN number"
                                    value={form.govtId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <FieldErr msg={touched.govtId && formErrors.govtId} />
                            </div>

                            {/* Gender */}
                            <div className="field" style={styles.field}>
                                <label style={styles.label}>Gender *</label>
                                <select
                                    style={{ ...styles.input, border: inputBorder('gender') }}
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <FieldErr msg={touched.gender && formErrors.gender} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Players */}
                    <div style={styles.formCard}>
                        <div className="players-title-row" style={styles.playersTitleRow}>
                            <div>
                                <h2 style={styles.formTitle}>👥 Add Friends</h2>
                                <p style={styles.formSub}>{players.length}/9 friends added (max 10 total)</p>
                            </div>
                            <button style={{ ...styles.addPlayerBtn, background: color }} onClick={addPlayer}>
                                + Add Friend
                            </button>
                        </div>

                        {players.length === 0 ? (
                            <div style={styles.noPlayers}>
                                <p style={{ fontSize: '40px', marginBottom: '8px' }}>👥</p>
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>No friends added yet</p>
                                <p style={{ color: '#64748b', fontSize: '12px' }}>Click "Add Friend" to add teammates!</p>
                            </div>
                        ) : (
                            <div style={styles.playersList}>
                                {players.map((p, i) => (
                                    <div key={i} style={styles.playerCard}>
                                        <div style={styles.playerCardHeader}>
                                            <span style={{ ...styles.playerNum, background: color }}>P{i + 2}</span>
                                            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700' }}>Player {i + 2}</span>
                                            <button style={styles.removeBtn} onClick={() => removePlayer(i)}>✕</button>
                                        </div>
                                        <div className="player-fields" style={styles.playerFields}>
                                            {/* Name */}
                                            <div style={styles.playerFieldWrap}>
                                                <input
                                                    style={{ ...styles.playerInput, border: playerInputBorder(i, 'name') }}
                                                    type="text"
                                                    placeholder="Full Name"
                                                    value={p.name}
                                                    onChange={e => updatePlayer(i, 'name', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'name', e.target.value)}
                                                />
                                                <FieldErr msg={playerTouched[i]?.name && playerErrors[i]?.name} />
                                            </div>
                                            {/* Age */}
                                            <div style={styles.playerFieldWrap}>
                                                <input
                                                    style={{ ...styles.playerInput, border: playerInputBorder(i, 'age') }}
                                                    type="number"
                                                    placeholder="Age"
                                                    value={p.age}
                                                    onChange={e => updatePlayer(i, 'age', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'age', e.target.value)}
                                                    min={5} max={80}
                                                />
                                                <FieldErr msg={playerTouched[i]?.age && playerErrors[i]?.age} />
                                            </div>
                                            {/* Contact */}
                                            <div style={styles.playerFieldWrap}>
                                                <input
                                                    style={{ ...styles.playerInput, border: playerInputBorder(i, 'contact') }}
                                                    type="tel"
                                                    placeholder="Contact (10 digits)"
                                                    value={p.contact}
                                                    onChange={e => updatePlayer(i, 'contact', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'contact', e.target.value)}
                                                    maxLength={10}
                                                />
                                                <FieldErr msg={playerTouched[i]?.contact && playerErrors[i]?.contact} />
                                            </div>
                                            {/* Govt ID */}
                                            <div style={styles.playerFieldWrap}>
                                                <input
                                                    style={{ ...styles.playerInput, border: playerInputBorder(i, 'governmentId') }}
                                                    type="text"
                                                    placeholder="Govt ID"
                                                    value={p.governmentId}
                                                    onChange={e => updatePlayer(i, 'governmentId', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'governmentId', e.target.value)}
                                                />
                                                <FieldErr msg={playerTouched[i]?.governmentId && playerErrors[i]?.governmentId} />
                                            </div>
                                            {/* Gender */}
                                            <div style={styles.playerFieldWrap}>
                                                <select
                                                    style={{ ...styles.playerInput, border: playerInputBorder(i, 'gender') }}
                                                    value={p.gender}
                                                    onChange={e => updatePlayer(i, 'gender', e.target.value)}
                                                    onBlur={e => blurPlayer(i, 'gender', e.target.value)}
                                                >
                                                    <option value="">Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <FieldErr msg={playerTouched[i]?.gender && playerErrors[i]?.gender} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Error */}
                {error && <div style={styles.errorBox}>❌ {error}</div>}

                {/* Payment Notice */}
                <div className="payment-notice" style={styles.paymentNotice}>
                    <span style={{ fontSize: '20px' }}>🔒</span>
                    <div>
                        <p style={{ color: '#ffffff', fontWeight: '700', margin: '0 0 2px 0', fontSize: '14px' }}>
                            Secure Payment via Razorpay
                        </p>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>
                            UPI • Cards • Net Banking • Wallets accepted
                        </p>
                    </div>
                    <span style={{ marginLeft: 'auto', color, fontWeight: '800', fontSize: '18px' }}>₹{turf.pricePerHour}</span>
                </div>

                {/* Buttons */}
                <div className="confirm-row" style={styles.confirmRow}>
                    <button style={styles.cancelBtn} onClick={() => navigate(-1)}>← Go Back</button>
                    <button
                        style={{ ...styles.confirmBtn, background: color, opacity: loading ? 0.7 : 1 }}
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

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },
    center: { textAlign: 'center', padding: '80px' },
    errTxt: { color: '#ef4444', fontSize: '18px', marginBottom: '20px' },
    backBtn: { background: '#22c55e', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '800' },
    body: { maxWidth: '1100px', margin: '0 auto', padding: '32px' },
    summaryCard: { background: '#111827', borderRadius: '12px', padding: '24px 28px', marginBottom: '28px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
    summaryLeft: {},
    summaryLabel: { color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' },
    summaryTurf: { fontSize: '24px', fontWeight: '800', marginBottom: '8px', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' },
    summaryDetail: { color: '#94a3b8', fontSize: '14px', marginBottom: '4px' },
    summaryRight: { textAlign: 'right' },
    summaryPriceLabel: { color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
    summaryPrice: { fontSize: '36px', fontWeight: '800', margin: '0 0 4px 0' },
    summaryPriceSub: { color: '#64748b', fontSize: '12px' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' },
    formCard: { background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1e293b' },
    formTitle: { color: '#ffffff', fontSize: '18px', fontWeight: '800', marginBottom: '4px' },
    formSub: { color: '#64748b', fontSize: '13px', marginBottom: '20px' },
    fieldGrid: { display: 'flex', flexDirection: 'column', gap: '14px' },
    field: {},
    label: { color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', textTransform: 'uppercase' },
    input: { width: '100%', padding: '12px 14px', background: '#0f172a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s' },
    fieldErr: { display: 'block', color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: '600' },
    playersTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    addPlayerBtn: { color: '#000', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap' },
    noPlayers: { textAlign: 'center', padding: '40px 20px', background: '#0f172a', borderRadius: '10px', border: '1px dashed #334155' },
    playersList: { display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' },
    playerCard: { background: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #334155' },
    playerCardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
    playerNum: { color: '#000', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 },
    removeBtn: { marginLeft: 'auto', background: '#1a0808', color: '#ef4444', border: '1px solid #ef444444', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' },
    playerFields: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
    playerFieldWrap: { display: 'flex', flexDirection: 'column' },
    playerInput: { padding: '8px 10px', background: '#111827', borderRadius: '6px', color: '#ffffff', fontSize: '13px', width: '100%' },
    errorBox: { background: '#1a0808', border: '1px solid #ef444444', color: '#ef4444', padding: '14px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
    paymentNotice: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' },
    confirmRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' },
    cancelBtn: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '14px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' },
    confirmBtn: { color: '#000', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '800', transition: 'all 0.2s' },
};

export default BookingForm;
