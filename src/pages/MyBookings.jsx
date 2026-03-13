import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyBookings, cancelBooking } from '../services/api';

const SPORT_CONFIG = {
    Football: { color: '#60a5fa', emoji: '⚽', image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80' },
    Cricket:  { color: '#4ade80', emoji: '🏏', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80' },
    Basketball: { color: '#fb923c', emoji: '🏀', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80' },
    Tennis:   { color: '#a3e635', emoji: '🎾', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80' },
    Badminton:{ color: '#e879f9', emoji: '🏸', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80' },
};
const DEFAULT_SPORT = { color: '#22c55e', emoji: '🏟️', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80' };

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const res = await getMyBookings();
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch { setBookings([]); }
        finally { setLoading(false); }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await cancelBooking(id);
            fetchBookings();
        } catch { alert('Failed to cancel!'); }
    };

    const getSport = (s) => SPORT_CONFIG[s] || DEFAULT_SPORT;

    const filtered = bookings.filter(b => {
        if (activeTab === 'all') return true;
        if (activeTab === 'confirmed') return b.status === 'CONFIRMED';
        if (activeTab === 'cancelled') return b.status === 'CANCELLED';
        return true;
    });

    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
    const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;
    const totalSpent = bookings.filter(b => b.status === 'CONFIRMED').reduce((s, b) => s + (b.turf?.pricePerHour || 0), 0);

    const formatTime = (t) => {
        if (!t) return '';
        const [h] = t.toString().split(':');
        const hour = parseInt(h);
        return `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
    };

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                .booking-card { transition: transform 0.2s, box-shadow 0.2s; }
                .booking-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.5) !important; }
                .tab-btn:hover { color: #ffffff; }
                .cancel-btn:hover { opacity: 0.85; }
                .book-now-btn:hover { opacity: 0.88; transform: translateY(-1px); }
                @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .booking-card { animation: fadeIn 0.4s ease forwards; }

                @media (max-width: 768px) {
                    .hero { padding: 64px 16px 32px !important; }
                    .hero-title { font-size: 38px !important; }
                    .hero-stats { flex-wrap: wrap !important; width: 100% !important; }
                    .hero-stat { flex: 1 1 45% !important; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 12px 16px !important; }
                    .hero-stat-val { font-size: 22px !important; }
                    .body-wrap { padding: 16px 16px 48px !important; }
                    .tabs-row { overflow-x: auto; -webkit-overflow-scrolling: touch; }
                    .tab-btn { padding: 12px 14px !important; font-size: 13px !important; white-space: nowrap; }
                    .card-content { padding: 16px !important; }
                    .card-top { flex-direction: column !important; gap: 8px !important; }
                    .card-top-right { text-align: left !important; }
                    .price-val { font-size: 24px !important; }
                    .details-grid { grid-template-columns: 1fr 1fr !important; }
                    .card-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
                    .card-btns { width: 100% !important; }
                    .card-btns button { flex: 1 !important; text-align: center !important; }
                    .card-img-strip { display: none !important; }
                    .card-img-strip-overlay { display: none !important; }
                    .players-grid { flex-direction: column !important; }
                    .player-chip { min-width: unset !important; width: 100% !important; }
                    .cta-box { padding: 20px !important; }
                }
                @media (max-width: 480px) {
                    .hero-title { font-size: 30px !important; }
                    .details-grid { grid-template-columns: 1fr !important; }
                    .sport-row { gap: 10px !important; }
                }
            `}</style>

            <Navbar />

            {/* HERO HEADER */}
            <div className="hero" style={styles.hero}>
                <div style={styles.heroBg}/>
                <div style={styles.heroOverlay}/>
                <div style={styles.heroContent}>
                    <p style={styles.heroBreadcrumb}>🏠 Home → My Bookings</p>
                    <h1 className="hero-title" style={styles.heroTitle}>My Bookings</h1>
                    <p style={styles.heroSub}>Track and manage all your turf reservations</p>

                    {!loading && bookings.length > 0 && (
                        <div className="hero-stats" style={styles.heroStats}>
                            {[
                                { val: bookings.length, label: 'Total', color: '#60a5fa' },
                                { val: confirmed, label: 'Confirmed', color: '#22c55e' },
                                { val: cancelled, label: 'Cancelled', color: '#ef4444' },
                                { val: `₹${totalSpent}`, label: 'Spent', color: '#f59e0b' },
                            ].map((s, i) => (
                                <div key={i} className="hero-stat" style={styles.heroStat}>
                                    <p className="hero-stat-val" style={{...styles.heroStatVal, color: s.color}}>{s.val}</p>
                                    <p style={styles.heroStatLabel}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="body-wrap" style={styles.body}>

                {/* TABS */}
                <div className="tabs-row" style={styles.tabsRow}>
                    {[
                        { id: 'all', label: `🏟️ All (${bookings.length})` },
                        { id: 'confirmed', label: `✅ Confirmed (${confirmed})` },
                        { id: 'cancelled', label: `❌ Cancelled (${cancelled})` },
                    ].map(t => (
                        <button
                            key={t.id}
                            className="tab-btn"
                            onClick={() => setActiveTab(t.id)}
                            style={{
                                ...styles.tabBtn,
                                color: activeTab === t.id ? '#22c55e' : '#64748b',
                                borderBottom: activeTab === t.id ? '2px solid #22c55e' : '2px solid transparent',
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* LOADING */}
                {loading && (
                    <div style={styles.centerBox}>
                        <p style={{fontSize: '48px', marginBottom: '16px'}}>⏳</p>
                        <p style={{color: '#94a3b8', fontSize: '18px'}}>Loading your bookings...</p>
                    </div>
                )}

                {/* EMPTY */}
                {!loading && bookings.length === 0 && (
                    <div style={styles.emptyBox}>
                        <p style={{fontSize: '72px', marginBottom: '16px'}}>📭</p>
                        <h3 style={styles.emptyTitle}>No bookings yet!</h3>
                        <p style={{color: '#64748b', fontSize: '15px', marginBottom: '28px'}}>
                            You haven't booked any turf yet. Start playing!
                        </p>
                        <button className="book-now-btn" style={styles.bookNowBtn} onClick={() => navigate('/turfs')}>
                            🏟️ Find & Book a Turf
                        </button>
                    </div>
                )}

                {/* BOOKINGS LIST */}
                {!loading && filtered.length > 0 && (
                    <div style={styles.list}>
                        {filtered.map((booking, idx) => {
                            const cfg = getSport(booking.turf?.sportType);
                            const isExpanded = expandedId === booking.id;
                            const isConfirmed = booking.status === 'CONFIRMED';
                            const isCancelled = booking.status === 'CANCELLED';

                            return (
                                <div
                                    key={booking.id}
                                    className="booking-card"
                                    style={{
                                        ...styles.card,
                                        borderLeft: `4px solid ${isConfirmed ? cfg.color : isCancelled ? '#ef4444' : '#64748b'}`,
                                        animationDelay: `${idx * 0.05}s`,
                                        opacity: isCancelled ? 0.7 : 1,
                                    }}
                                >
                                    {/* Card Image Strip - hidden on mobile via CSS */}
                                    <div className="card-img-strip" style={{
                                        ...styles.cardImgStrip,
                                        backgroundImage: `url(${cfg.image})`,
                                        opacity: isCancelled ? 0.4 : 0.6,
                                    }}/>
                                    <div className="card-img-strip-overlay" style={{
                                        ...styles.cardImgStripOverlay,
                                        background: `linear-gradient(90deg, #111827 0%, transparent 40%)`,
                                    }}/>

                                    {/* CARD MAIN CONTENT */}
                                    <div className="card-content" style={styles.cardContent}>

                                        {/* TOP ROW */}
                                        <div className="card-top" style={styles.cardTop}>
                                            <div style={styles.cardTopLeft}>
                                                <div className="sport-row" style={styles.sportRow}>
                                                    <div style={{...styles.sportEmoji, background: cfg.color + '22', border: `2px solid ${cfg.color}44`}}>
                                                        <span style={{fontSize: '28px'}}>{cfg.emoji}</span>
                                                    </div>
                                                    <div>
                                                        <div style={styles.sportTagRow}>
                                                            <span style={{...styles.sportTag, background: cfg.color, opacity: isCancelled ? 0.6 : 1}}>
                                                                {booking.turf?.sportType || 'Sport'}
                                                            </span>
                                                            <span style={{
                                                                ...styles.statusBadge,
                                                                background: isConfirmed ? '#22c55e22' : '#ef444422',
                                                                color: isConfirmed ? '#22c55e' : '#ef4444',
                                                                border: `1px solid ${isConfirmed ? '#22c55e44' : '#ef444444'}`,
                                                            }}>
                                                                {isConfirmed ? '✅ Confirmed' : '❌ Cancelled'}
                                                            </span>
                                                        </div>
                                                        <h3 style={styles.turfName}>{booking.turf?.name}</h3>
                                                        <p style={styles.bookingCode}>🎫 {booking.bookingCode}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card-top-right" style={styles.cardTopRight}>
                                                <p style={styles.priceLabel}>Amount</p>
                                                <p className="price-val" style={{...styles.priceVal, color: cfg.color}}>
                                                    ₹{booking.turf?.pricePerHour || 0}
                                                </p>
                                            </div>
                                        </div>

                                        {/* MIDDLE: Details Grid */}
                                        <div className="details-grid" style={styles.detailsGrid}>
                                            {[
                                                { icon: '📍', label: 'Location', val: booking.turf?.location },
                                                { icon: '📅', label: 'Date', val: booking.bookingDate },
                                                { icon: '⏰', label: 'Time', val: booking.slot ? `${formatTime(booking.slot.startTime)} – ${formatTime(booking.slot.endTime)}` : 'N/A' },
                                                { icon: '👥', label: 'Players', val: booking.players?.length || 1 },
                                            ].map((d, i) => (
                                                <div key={i} style={styles.detailBox}>
                                                    <p style={styles.detailLabel}>{d.icon} {d.label}</p>
                                                    <p style={{...styles.detailVal, color: i === 2 ? cfg.color : '#ffffff'}}>{d.val}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* BOTTOM ROW */}
                                        <div className="card-bottom" style={styles.cardBottom}>
                                            <div style={styles.cardBottomLeft}>
                                                {booking.qrCode && isConfirmed && (
                                                    <div style={styles.qrRow}>
                                                        <img src={booking.qrCode} alt="QR" style={styles.qrImg}/>
                                                        <div>
                                                            <p style={styles.qrLabel}>📱 Entry QR Code</p>
                                                            <p style={styles.qrSub}>Show this at turf entrance</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="card-btns" style={styles.cardBtns}>
                                                {booking.players?.length > 0 && (
                                                    <button
                                                        style={styles.expandBtn}
                                                        onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                                                    >
                                                        {isExpanded ? '▲ Hide Players' : `👥 ${booking.players.length} Players`}
                                                    </button>
                                                )}
                                                {isConfirmed && (
                                                    <button className="cancel-btn" style={styles.cancelBtn} onClick={() => handleCancel(booking.id)}>
                                                        ✕ Cancel
                                                    </button>
                                                )}
                                                {isCancelled && (
                                                    <button
                                                        className="book-now-btn"
                                                        style={{...styles.bookAgainBtn, background: cfg.color}}
                                                        onClick={() => navigate(`/turfs/${booking.turf?.id}`)}
                                                    >
                                                        🔄 Book Again
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* EXPANDED PLAYERS LIST */}
                                        {isExpanded && booking.players?.length > 0 && (
                                            <div style={styles.playersSection}>
                                                <p style={styles.playersSectionTitle}>👥 Players</p>
                                                <div className="players-grid" style={styles.playersGrid}>
                                                    {booking.players.map((p, i) => (
                                                        <div key={i} className="player-chip" style={styles.playerChip}>
                                                            <span style={{...styles.playerNum, background: cfg.color}}>{i + 1}</span>
                                                            <div>
                                                                <p style={styles.playerName}>{p.name}</p>
                                                                <p style={styles.playerDetail}>{p.gender} · {p.contact}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* No results for tab */}
                {!loading && bookings.length > 0 && filtered.length === 0 && (
                    <div style={styles.centerBox}>
                        <p style={{fontSize: '48px', marginBottom: '12px'}}>🔍</p>
                        <p style={{color: '#94a3b8', fontSize: '16px'}}>No {activeTab} bookings found!</p>
                    </div>
                )}

                {/* Book More CTA */}
                {!loading && bookings.length > 0 && (
                    <div className="cta-box" style={styles.ctaBox}>
                        <p style={styles.ctaText}>Want to play more? 🏆</p>
                        <button className="book-now-btn" style={styles.bookNowBtn} onClick={() => navigate('/turfs')}>
                            🏟️ Book Another Turf
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },
    hero: { position: 'relative', padding: '72px 32px 52px', overflow: 'hidden' },
    heroBg: { position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(3px) brightness(0.25)' },
    heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,10,20,0.6) 0%, rgba(5,10,20,0.97) 100%)' },
    heroContent: { position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' },
    heroBreadcrumb: { color: '#475569', fontSize: '13px', marginBottom: '12px' },
    heroTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '60px', letterSpacing: '3px', margin: '0 0 8px 0', textShadow: '0 4px 30px rgba(0,0,0,0.5)' },
    heroSub: { color: '#94a3b8', fontSize: '15px', marginBottom: '28px' },
    heroStats: { display: 'flex', gap: '0', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', width: 'fit-content' },
    heroStat: { padding: '14px 28px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.08)' },
    heroStatVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '30px', letterSpacing: '1px', margin: '0 0 2px 0' },
    heroStatLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },
    body: { maxWidth: '1100px', margin: '0 auto', padding: '28px 32px 60px' },
    tabsRow: { display: 'flex', borderBottom: '1px solid #1e293b', marginBottom: '28px', gap: '0' },
    tabBtn: { background: 'none', border: 'none', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s' },
    centerBox: { textAlign: 'center', padding: '60px' },
    emptyBox: { textAlign: 'center', padding: '80px 20px', background: '#111827', borderRadius: '16px', border: '1px solid #1e293b' },
    emptyTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '32px', letterSpacing: '2px', marginBottom: '8px' },
    bookNowBtn: { background: '#22c55e', color: '#000', border: 'none', padding: '14px 32px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '800', transition: 'all 0.2s', boxShadow: '0 4px 20px #22c55e44' },
    list: { display: 'flex', flexDirection: 'column', gap: '20px' },
    card: { background: '#111827', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e293b', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'relative' },
    cardImgStrip: { position: 'absolute', top: 0, right: 0, width: '35%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center' },
    cardImgStripOverlay: { position: 'absolute', top: 0, right: 0, width: '35%', height: '100%' },
    cardContent: { position: 'relative', zIndex: 1, padding: '24px 28px' },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
    cardTopLeft: { flex: 1 },
    sportRow: { display: 'flex', alignItems: 'flex-start', gap: '14px' },
    sportEmoji: { width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    sportTagRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' },
    sportTag: { color: '#000', padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' },
    statusBadge: { padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' },
    turfName: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '26px', letterSpacing: '1px', margin: '0 0 4px 0' },
    bookingCode: { color: '#22c55e', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', fontFamily: 'monospace' },
    cardTopRight: { textAlign: 'right' },
    priceLabel: { color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
    priceVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '1px', margin: 0 },
    detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px', background: '#0f172a', borderRadius: '10px', padding: '16px', border: '1px solid #1e293b' },
    detailBox: {},
    detailLabel: { color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' },
    detailVal: { fontSize: '14px', fontWeight: '700', margin: 0 },
    cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
    cardBottomLeft: {},
    qrRow: { display: 'flex', alignItems: 'center', gap: '12px' },
    qrImg: { width: '64px', height: '64px', background: '#ffffff', padding: '4px', borderRadius: '8px', border: '2px solid #22c55e44' },
    qrLabel: { color: '#ffffff', fontSize: '13px', fontWeight: '700', marginBottom: '2px' },
    qrSub: { color: '#64748b', fontSize: '11px' },
    cardBtns: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    expandBtn: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' },
    cancelBtn: { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s' },
    bookAgainBtn: { color: '#000', border: 'none', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '800', transition: 'all 0.2s' },
    playersSection: { marginTop: '16px', padding: '16px', background: '#0f172a', borderRadius: '10px', border: '1px solid #1e293b' },
    playersSectionTitle: { color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
    playersGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    playerChip: { display: 'flex', alignItems: 'center', gap: '10px', background: '#111827', borderRadius: '8px', padding: '10px 14px', border: '1px solid #1e293b', minWidth: '200px' },
    playerNum: { width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '12px', fontWeight: '800', flexShrink: 0 },
    playerName: { color: '#ffffff', fontSize: '13px', fontWeight: '700', margin: '0 0 2px 0' },
    playerDetail: { color: '#64748b', fontSize: '11px', margin: 0 },
    ctaBox: { marginTop: '40px', textAlign: 'center', padding: '32px', background: '#111827', borderRadius: '16px', border: '1px solid #1e293b' },
    ctaText: { color: '#94a3b8', fontSize: '16px', marginBottom: '16px' },
};

export default MyBookings;
