import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function BookingConfirmation() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const booking = state?.booking;
    const printRef = useRef();

    if (!booking) {
        return (
            <div style={styles.page}>
                <Navbar />
                <div style={styles.center}>
                    <p style={{color: '#ef4444', fontSize: '18px', marginBottom: '20px'}}>
                        ❌ No booking found!
                    </p>
                    <button style={styles.greenBtn} onClick={() => navigate('/')}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const downloadQR = () => {
        const link = document.createElement('a');
        link.download = `BuffTURF-${booking.bookingCode}.png`;
        link.href = booking.qrCode;
        link.click();
    };

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                @keyframes popIn { from { opacity:0; transform:scale(0.8) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes checkPop { from { transform:scale(0); } to { transform:scale(1); } }
                .confirmation-card { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
            `}</style>
            <Navbar />

            <div style={styles.body}>
                {/* Success Header */}
                <div style={styles.successHeader}>
                    <div style={styles.checkCircle}>✓</div>
                    <h1 style={styles.successTitle}>Booking Confirmed!</h1>
                    <p style={styles.successSub}>
                        Your turf is booked! Show the QR code at the entrance.
                    </p>
                </div>

                {/* Main Confirmation Card */}
                <div className="confirmation-card" style={styles.card} ref={printRef}>

                    {/* Card Header */}
                    <div style={styles.cardHeader}>
                        <div>
                            <p style={styles.cardHeaderLabel}>Booking ID</p>
                            <p style={styles.bookingCode}>{booking.bookingCode}</p>
                        </div>
                        <div style={{
                            ...styles.statusBadge,
                            background: booking.status === 'CONFIRMED' ? '#22c55e22' : '#ef444422',
                            color: booking.status === 'CONFIRMED' ? '#22c55e' : '#ef4444',
                            border: `1px solid ${booking.status === 'CONFIRMED' ? '#22c55e44' : '#ef444444'}`,
                        }}>
                            {booking.status === 'CONFIRMED' ? '✅ CONFIRMED' : booking.status}
                        </div>
                    </div>

                    <div style={styles.cardBody}>
                        {/* QR Code */}
                        <div style={styles.qrSection}>
                            <p style={styles.qrLabel}>📱 Scan at Entry</p>
                            {booking.qrCode ? (
                                <img
                                    src={booking.qrCode}
                                    alt="QR Code"
                                    style={styles.qrImg}
                                />
                            ) : (
                                <div style={styles.qrPlaceholder}>
                                    <p style={{color: '#64748b', fontSize: '14px'}}>QR Code</p>
                                    <p style={{color: '#22c55e', fontSize: '24px', fontWeight: '800'}}>
                                        {booking.bookingCode}
                                    </p>
                                </div>
                            )}
                            <button style={styles.downloadBtn} onClick={downloadQR}>
                                ⬇ Download QR
                            </button>
                        </div>

                        {/* Booking Details */}
                        <div style={styles.detailsSection}>
                            <h3 style={styles.detailsTitle}>Booking Details</h3>

                            <div style={styles.detailsList}>
                                {[
                                    { label: '🏟️ Turf', value: booking.turf?.name || 'N/A' },
                                    { label: '📍 Location', value: booking.turf?.location || 'N/A' },
                                    { label: '📅 Date', value: booking.bookingDate },
                                    { label: '⏰ Time', value: booking.slot ? `${booking.slot.startTime} – ${booking.slot.endTime}` : 'N/A' },
                                    { label: '👤 Booked By', value: booking.user?.username || 'N/A' },
                                    { label: '👥 Players', value: booking.players?.length || 1 },
                                    { label: '💰 Amount', value: `₹${booking.turf?.pricePerHour || 'N/A'}` },
                                ].map((d, i) => (
                                    <div key={i} style={styles.detailRow}>
                                        <span style={styles.detailLabel}>{d.label}</span>
                                        <span style={styles.detailValue}>{d.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Players List */}
                            {booking.players && booking.players.length > 0 && (
                                <div style={styles.playersList}>
                                    <h4 style={styles.playersTitle}>Players</h4>
                                    {booking.players.map((p, i) => (
                                        <div key={i} style={styles.playerRow}>
                                            <span style={styles.playerIdx}>{i + 1}</span>
                                            <span style={styles.playerName}>{p.name}</span>
                                            <span style={styles.playerGender}>{p.gender}</span>
                                            <span style={styles.playerContact}>{p.contact}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={styles.actionRow}>
                    <button style={styles.homeBtn} onClick={() => navigate('/')}>
                        🏠 Go Home
                    </button>
                    <button style={styles.bookingsBtn} onClick={() => navigate('/my-bookings')}>
                        📋 My Bookings
                    </button>
                    <button style={styles.bookMoreBtn} onClick={() => navigate('/turfs')}>
                        🔍 Book Another
                    </button>
                </div>

                {/* Important Note */}
                <div style={styles.noteBox}>
                    <p style={styles.noteTitle}>📌 Important Instructions</p>
                    <p style={styles.noteText}>
                        • Arrive 10 minutes before your slot time<br/>
                        • Show QR code at the turf entrance<br/>
                        • Carry a valid Government ID<br/>
                        • No refund after slot start time
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },
    center: { textAlign: 'center', padding: '80px' },
    greenBtn: {
        background: '#22c55e', color: '#000', border: 'none',
        padding: '12px 24px', borderRadius: '8px',
        cursor: 'pointer', fontSize: '15px', fontWeight: '800',
    },

    body: { maxWidth: '900px', margin: '0 auto', padding: '40px 32px' },

    successHeader: { textAlign: 'center', marginBottom: '32px' },
    checkCircle: {
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#fff', fontSize: '40px', fontWeight: '800',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px auto',
        boxShadow: '0 0 40px #22c55e44',
        animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
    },
    successTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff', fontSize: '48px',
        letterSpacing: '2px', marginBottom: '8px',
    },
    successSub: { color: '#94a3b8', fontSize: '16px' },

    card: {
        background: '#111827', borderRadius: '16px',
        border: '1px solid #1e293b', overflow: 'hidden',
        marginBottom: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    cardHeader: {
        background: '#0f172a', padding: '20px 28px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '1px solid #1e293b',
        flexWrap: 'wrap', gap: '12px',
    },
    cardHeaderLabel: { color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
    bookingCode: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#22c55e', fontSize: '28px', letterSpacing: '3px',
    },
    statusBadge: {
        padding: '8px 16px', borderRadius: '8px',
        fontSize: '13px', fontWeight: '800', letterSpacing: '1px',
    },
    cardBody: {
        display: 'flex', flexWrap: 'wrap',
        gap: '0',
    },
    qrSection: {
        padding: '28px', textAlign: 'center',
        borderRight: '1px solid #1e293b',
        minWidth: '220px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '12px',
    },
    qrLabel: { color: '#94a3b8', fontSize: '14px', fontWeight: '700', margin: 0 },
    qrImg: {
        width: '180px', height: '180px',
        borderRadius: '12px',
        border: '4px solid #22c55e44',
        background: '#fff', padding: '8px',
    },
    qrPlaceholder: {
        width: '180px', height: '180px',
        background: '#0f172a', borderRadius: '12px',
        border: '2px dashed #334155',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
    },
    downloadBtn: {
        background: '#22c55e', color: '#000',
        border: 'none', padding: '10px 20px',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '14px', fontWeight: '800', width: '100%',
    },
    detailsSection: { flex: 1, padding: '28px', minWidth: '260px' },
    detailsTitle: {
        color: '#ffffff', fontSize: '16px',
        fontWeight: '800', marginBottom: '16px',
        paddingBottom: '12px', borderBottom: '1px solid #1e293b',
    },
    detailsList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
    detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    detailLabel: { color: '#64748b', fontSize: '13px' },
    detailValue: { color: '#ffffff', fontSize: '14px', fontWeight: '700', textAlign: 'right' },
    playersList: {
        background: '#0f172a', borderRadius: '8px',
        padding: '14px', border: '1px solid #334155',
    },
    playersTitle: { color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
    playerRow: {
        display: 'flex', gap: '10px', alignItems: 'center',
        padding: '6px 0', borderBottom: '1px solid #1e293b',
        fontSize: '13px',
    },
    playerIdx: {
        background: '#22c55e22', color: '#22c55e',
        width: '22px', height: '22px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: '800', flexShrink: 0,
    },
    playerName: { color: '#ffffff', fontWeight: '700', flex: 1 },
    playerGender: { color: '#64748b', fontSize: '12px' },
    playerContact: { color: '#94a3b8', fontSize: '12px' },

    actionRow: {
        display: 'flex', gap: '12px',
        justifyContent: 'center', flexWrap: 'wrap',
        marginBottom: '24px',
    },
    homeBtn: {
        background: '#1e293b', color: '#ffffff',
        border: '1px solid #334155', padding: '12px 24px',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '14px', fontWeight: '700',
    },
    bookingsBtn: {
        background: '#1e293b', color: '#ffffff',
        border: '1px solid #334155', padding: '12px 24px',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '14px', fontWeight: '700',
    },
    bookMoreBtn: {
        background: '#22c55e', color: '#000',
        border: 'none', padding: '12px 24px',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '14px', fontWeight: '800',
    },

    noteBox: {
        background: '#111827', border: '1px solid #334155',
        borderRadius: '10px', padding: '20px 24px',
        borderLeft: '4px solid #f59e0b',
    },
    noteTitle: { color: '#f59e0b', fontSize: '14px', fontWeight: '800', marginBottom: '8px' },
    noteText: { color: '#94a3b8', fontSize: '13px', lineHeight: 1.8 },
};

export default BookingConfirmation;