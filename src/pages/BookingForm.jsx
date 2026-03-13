import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
    const [players, setPlayers] = useState([]);
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

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const addPlayer = () => {
        if (players.length >= 9) { alert('Maximum 10 players allowed (including you)!'); return; }
        setPlayers([...players, { name: '', age: '', gender: '', contact: '', governmentId: '' }]);
    };

    const updatePlayer = (index, field, value) => {
        const updated = [...players];
        updated[index][field] = value;
        setPlayers(updated);
    };

    const removePlayer = (index) => setPlayers(players.filter((_, i) => i !== index));

    // ─── RAZORPAY PAYMENT ───────────────────────────────────────────
    const handlePayment = async () => {
        if (!form.fullName || !form.phone || !form.email || !form.gender || !form.govtId || !form.dob) {
            setError('Please fill all required fields!');
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
    // ────────────────────────────────────────────────────────────────

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
                <div className="summary-card" style={{...styles.summaryCard, borderTop: `4px solid ${color}`}}>
                    <div style={styles.summaryLeft}>
                        <p style={styles.summaryLabel}>Booking Summary</p>
                        <h2 style={{...styles.summaryTurf, color}}>{turf.name}</h2>
                        <p style={styles.summaryDetail}>📍 {turf.location}</p>
                        <p style={styles.summaryDetail}>📅 {date}</p>
                        <p style={styles.summaryDetail}>⏰ {formatTime(slot.startTime)} → {formatTime(slot.endTime)}</p>
                    </div>
                    <div className="summary-right" style={styles.summaryRight}>
                        <p style={styles.summaryPriceLabel}>Amount</p>
                        <p className="summary-price" style={{...styles.summaryPrice, color}}>₹{turf.pricePerHour}</p>
                        <p style={styles.summaryPriceSub}>for 1 hour</p>
                    </div>
                </div>

                <div className="form-grid" style={styles.formGrid}>

                    {/* Left: Main Booker Form */}
                    <div style={styles.formCard}>
                        <h2 style={styles.formTitle}>👤 Your Details</h2>
                        <p style={styles.formSub}>Fill in your information to confirm booking</p>

                        <div style={styles.fieldGrid}>
                            {[
                                { label: 'Full Name *', name: 'fullName', type: 'text', placeholder: 'Enter your full name' },
                                { label: 'Phone Number *', name: 'phone', type: 'tel', placeholder: '+91 99999 99999' },
                                { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'your@email.com' },
                                { label: 'Date of Birth *', name: 'dob', type: 'date', placeholder: '' },
                                { label: 'Government ID (Aadhar/PAN) *', name: 'govtId', type: 'text', placeholder: 'Enter ID number' },
                            ].map(f => (
                                <div key={f.name} className="field" style={styles.field}>
                                    <label style={styles.label}>{f.label}</label>
                                    <input
                                        style={styles.input}
                                        type={f.type}
                                        name={f.name}
                                        placeholder={f.placeholder}
                                        value={form[f.name]}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}

                            <div className="field" style={styles.field}>
                                <label style={styles.label}>Gender *</label>
                                <select style={styles.input} name="gender" value={form.gender} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
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
                            <button style={{...styles.addPlayerBtn, background: color}} onClick={addPlayer}>
                                + Add Friend
                            </button>
                        </div>

                        {players.length === 0 ? (
                            <div style={styles.noPlayers}>
                                <p style={{fontSize: '40px', marginBottom: '8px'}}>👥</p>
                                <p style={{color: '#94a3b8', fontSize: '14px'}}>No friends added yet</p>
                                <p style={{color: '#64748b', fontSize: '12px'}}>Click "Add Friend" to add teammates!</p>
                            </div>
                        ) : (
                            <div style={styles.playersList}>
                                {players.map((p, i) => (
                                    <div key={i} style={styles.playerCard}>
                                        <div style={styles.playerCardHeader}>
                                            <span style={{...styles.playerNum, background: color}}>P{i + 2}</span>
                                            <span style={{color: '#ffffff', fontSize: '14px', fontWeight: '700'}}>Player {i + 2}</span>
                                            <button style={styles.removeBtn} onClick={() => removePlayer(i)}>✕</button>
                                        </div>
                                        <div className="player-fields" style={styles.playerFields}>
                                            {[
                                                { ph: 'Full Name', field: 'name', type: 'text' },
                                                { ph: 'Age', field: 'age', type: 'number' },
                                                { ph: 'Contact', field: 'contact', type: 'tel' },
                                                { ph: 'Govt ID', field: 'governmentId', type: 'text' },
                                            ].map(f => (
                                                <input
                                                    key={f.field}
                                                    style={styles.playerInput}
                                                    type={f.type}
                                                    placeholder={f.ph}
                                                    value={p[f.field]}
                                                    onChange={e => updatePlayer(i, f.field, e.target.value)}
                                                />
                                            ))}
                                            <select
                                                style={styles.playerInput}
                                                value={p.gender}
                                                onChange={e => updatePlayer(i, 'gender', e.target.value)}
                                            >
                                                <option value="">Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
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
                    <span style={{fontSize: '20px'}}>🔒</span>
                    <div>
                        <p style={{color: '#ffffff', fontWeight: '700', margin: '0 0 2px 0', fontSize: '14px'}}>
                            Secure Payment via Razorpay
                        </p>
                        <p style={{color: '#64748b', margin: 0, fontSize: '12px'}}>
                            UPI • Cards • Net Banking • Wallets accepted
                        </p>
                    </div>
                    <span style={{marginLeft: 'auto', color, fontWeight: '800', fontSize: '18px'}}>₹{turf.pricePerHour}</span>
                </div>

                {/* Buttons */}
                <div className="confirm-row" style={styles.confirmRow}>
                    <button style={styles.cancelBtn} onClick={() => navigate(-1)}>← Go Back</button>
                    <button
                        style={{...styles.confirmBtn, background: color, opacity: loading ? 0.7 : 1}}
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
    fieldGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
    field: {},
    label: { color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', textTransform: 'uppercase' },
    input: { width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s' },
    playersTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    addPlayerBtn: { color: '#000', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap' },
    noPlayers: { textAlign: 'center', padding: '40px 20px', background: '#0f172a', borderRadius: '10px', border: '1px dashed #334155' },
    playersList: { display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' },
    playerCard: { background: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #334155' },
    playerCardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
    playerNum: { color: '#000', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 },
    removeBtn: { marginLeft: 'auto', background: '#1a0808', color: '#ef4444', border: '1px solid #ef444444', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' },
    playerFields: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
    playerInput: { padding: '8px 10px', background: '#111827', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '13px' },
    errorBox: { background: '#1a0808', border: '1px solid #ef444444', color: '#ef4444', padding: '14px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
    paymentNotice: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' },
    confirmRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' },
    cancelBtn: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '14px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' },
    confirmBtn: { color: '#000', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '800', transition: 'all 0.2s' },
};

export default BookingForm;
