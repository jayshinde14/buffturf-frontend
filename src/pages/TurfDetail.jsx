import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getTurfById, getSlotsByTurfAndDate } from '../services/api';
import { useAuth } from '../context/AuthContext';

function TurfDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [turf, setTurf] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loadingTurf, setLoadingTurf] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchTurf();
        setSelectedDate(today);
    }, [id]);

    useEffect(() => {
        if (selectedDate) fetchSlots(selectedDate);
    }, [selectedDate]);

    const fetchTurf = async () => {
        try {
            const res = await getTurfById(id);
            setTurf(res.data);
        } catch (err) {
            console.error('Failed to load turf');
        } finally {
            setLoadingTurf(false);
        }
    };

    const fetchSlots = async (date) => {
        setLoadingSlots(true);
        setSelectedSlot(null);
        try {
            const res = await getSlotsByTurfAndDate(id, date);
            setSlots(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleBooking = () => {
        if (!user) { navigate('/login'); return; }
        if (!selectedSlot) { alert('Please select a time slot!'); return; }
        navigate('/booking', { state: { turf, slot: selectedSlot, date: selectedDate } });
    };

    const getColor = (sport) => {
        const map = { Football: '#60a5fa', Cricket: '#4ade80', Basketball: '#fb923c', Badminton: '#e879f9', Tennis: '#a3e635' };
        return map[sport] || '#22c55e';
    };

    const getEmoji = (sport) => {
        const map = { Football: '⚽', Cricket: '🏏', Basketball: '🏀', Badminton: '🏸', Tennis: '🎾' };
        return map[sport] || '🏟️';
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [h, m] = time.toString().split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${m || '00'} ${ampm}`;
    };

    if (loadingTurf) return (
        <div style={styles.page}><Navbar />
            <div style={styles.center}><p style={styles.loadingTxt}>⏳ Loading...</p></div>
        </div>
    );

    if (!turf) return (
        <div style={styles.page}><Navbar />
            <div style={styles.center}><p style={styles.loadingTxt}>❌ Turf not found!</p></div>
        </div>
    );

    const color = getColor(turf.sportType);
    const availableSlots = slots.filter(s => s.isAvailable);
    const bookedSlots = slots.filter(s => !s.isAvailable);

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                .slot-btn { transition: all 0.15s ease; }
                .slot-btn:hover { transform: scale(1.05); }
                .back-btn:hover { background: #1e293b !important; }
                .book-btn:hover { opacity: 0.88; transform: translateY(-1px); }

                @media (max-width: 768px) {
                    .banner-inner { padding: 20px 16px 16px !important; }
                    .banner-row { flex-direction: column !important; gap: 16px !important; align-items: flex-start !important; }
                    .emoji-box { width: 80px !important; height: 80px !important; }
                    .turf-name-h1 { font-size: 32px !important; }
                    .stats-bar { width: 100% !important; flex-wrap: wrap !important; gap: 0 !important; border-radius: 10px !important; }
                    .stat-box { padding: 10px 12px !important; flex: 1 1 45% !important; border-bottom: 1px solid #1e293b; }
                    .stat-val { font-size: 18px !important; }
                    .main-wrap { padding: 16px 16px 120px !important; }
                    .date-row { gap: 6px !important; }
                    .date-btn { min-width: 54px !important; padding: 10px 8px !important; }
                    .slots-grid { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)) !important; gap: 8px !important; }
                    .slots-title-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
                    .booking-bar { padding: 12px 16px !important; flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
                    .booking-bar-right { justify-content: space-between !important; }
                    .proceed-btn { width: 100% !important; padding: 14px !important; text-align: center !important; }
                    .info-row { flex-direction: column !important; gap: 6px !important; }
                }
                @media (max-width: 480px) {
                    .turf-name-h1 { font-size: 26px !important; }
                    .date-btn { min-width: 46px !important; padding: 8px 6px !important; }
                }
            `}</style>
            <Navbar />

            {/* BANNER */}
            <div style={{...styles.banner, background: `linear-gradient(135deg, ${color}15 0%, #050a14 70%)`}}>
                <div className="banner-inner" style={styles.bannerInner}>
                    <button className="back-btn" style={styles.backBtn} onClick={() => navigate('/turfs')}>
                        ← Back to Turfs
                    </button>
                    <div className="banner-row" style={styles.bannerRow}>
                        {/* Emoji Box */}
                        <div className="emoji-box" style={{...styles.emojiBox, border: `2px solid ${color}44`, background: color + '11'}}>
                            <span style={{fontSize: isMobile ? '48px' : '80px'}}>{getEmoji(turf.sportType)}</span>
                        </div>

                        {/* Info */}
                        <div style={styles.bannerInfo}>
                            <span style={{...styles.sportTag, background: color, color: '#000'}}>
                                {turf.sportType}
                            </span>
                            <h1 className="turf-name-h1" style={styles.turfName}>{turf.name}</h1>
                            <div className="info-row" style={styles.infoRow}>
                                <span style={styles.infoItem}>📍 {turf.location}</span>
                                <span style={styles.infoItem}>🏠 {turf.address}</span>
                                {turf.openTime && (
                                    <span style={styles.infoItem}>
                                        🕐 {formatTime(turf.openTime)} – {formatTime(turf.closeTime)}
                                    </span>
                                )}
                            </div>
                            {turf.description && (
                                <p style={styles.turfDesc}>{turf.description}</p>
                            )}

                            {/* Stats Bar */}
                            <div className="stats-bar" style={styles.statsBar}>
                                <div className="stat-box" style={styles.statBox}>
                                    <p className="stat-val" style={{...styles.statVal, color}}>₹{turf.pricePerHour}</p>
                                    <p style={styles.statLbl}>Per Hour</p>
                                </div>
                                <div style={styles.statDiv}/>
                                <div className="stat-box" style={styles.statBox}>
                                    <p className="stat-val" style={{...styles.statVal, color: '#22c55e'}}>{availableSlots.length}</p>
                                    <p style={styles.statLbl}>Available</p>
                                </div>
                                <div style={styles.statDiv}/>
                                <div className="stat-box" style={styles.statBox}>
                                    <p className="stat-val" style={{...styles.statVal, color: '#ef4444'}}>{bookedSlots.length}</p>
                                    <p style={styles.statLbl}>Booked</p>
                                </div>
                                <div style={styles.statDiv}/>
                                <div className="stat-box" style={styles.statBox}>
                                    <p className="stat-val" style={{...styles.statVal, color: '#f59e0b'}}>10</p>
                                    <p style={styles.statLbl}>Max Players</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN */}
            <div className="main-wrap" style={styles.main}>

                {/* Date Selector */}
                <div style={styles.dateSection}>
                    <h2 style={styles.secTitle}>📅 Choose Date</h2>
                    <div className="date-row" style={styles.dateRow}>
                        {[0,1,2,3,4,5,6].map(offset => {
                            const d = new Date();
                            d.setDate(d.getDate() + offset);
                            const dateStr = d.toISOString().split('T')[0];
                            const isSelected = selectedDate === dateStr;
                            const dayName = offset === 0 ? 'Today' :
                                            offset === 1 ? 'Tmrw' :
                                            d.toLocaleDateString('en', {weekday: 'short'});
                            const dayNum = d.getDate();
                            const month = d.toLocaleDateString('en', {month: 'short'});
                            return (
                                <button
                                    key={dateStr}
                                    className="date-btn"
                                    onClick={() => setSelectedDate(dateStr)}
                                    style={{
                                        ...styles.dateBtn,
                                        background: isSelected ? color : '#111827',
                                        border: `2px solid ${isSelected ? color : '#1e293b'}`,
                                        color: isSelected ? '#000' : '#94a3b8',
                                    }}
                                >
                                    <span style={{fontSize: '11px', fontWeight: '700', opacity: 0.8}}>{dayName}</span>
                                    <span style={{fontSize: '22px', fontWeight: '800'}}>{dayNum}</span>
                                    <span style={{fontSize: '11px', opacity: 0.7}}>{month}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Slots */}
                <div style={styles.slotsSection}>
                    <div className="slots-title-row" style={styles.slotsTitleRow}>
                        <h2 style={styles.secTitle}>⏰ Select Time Slot</h2>
                        <div style={styles.legend}>
                            <span style={styles.legendItem}><span style={{...styles.legendDot, background: '#22c55e'}}/>Available</span>
                            <span style={styles.legendItem}><span style={{...styles.legendDot, background: '#ef4444'}}/>Booked</span>
                            <span style={styles.legendItem}><span style={{...styles.legendDot, background: color}}/>Selected</span>
                        </div>
                    </div>

                    {loadingSlots ? (
                        <p style={styles.loadingTxt}>⏳ Loading slots...</p>
                    ) : slots.length === 0 ? (
                        <div style={styles.noSlots}>
                            <p style={{fontSize: '48px', marginBottom: '12px'}}>📅</p>
                            <p style={{color: '#ffffff', fontSize: '18px', fontWeight: '700', marginBottom: '8px'}}>No slots for this date</p>
                            <p style={{color: '#64748b', fontSize: '14px'}}>Try another date!</p>
                        </div>
                    ) : (
                        <div className="slots-grid" style={styles.slotsGrid}>
                            {slots.map(slot => {
                                const isSelected = selectedSlot?.id === slot.id;
                                const isBooked = !slot.isAvailable;
                                return (
                                    <button
                                        key={slot.id}
                                        className="slot-btn"
                                        disabled={isBooked}
                                        onClick={() => !isBooked && setSelectedSlot(isSelected ? null : slot)}
                                        style={{
                                            ...styles.slotBtn,
                                            background: isBooked ? '#1a0808' : isSelected ? color + '22' : '#111827',
                                            border: `2px solid ${isBooked ? '#ef444433' : isSelected ? color : '#1e293b'}`,
                                            cursor: isBooked ? 'not-allowed' : 'pointer',
                                            opacity: isBooked ? 0.5 : 1,
                                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                        }}
                                    >
                                        <p style={{...styles.slotTime, color: isBooked ? '#ef4444' : isSelected ? color : '#ffffff'}}>
                                            {formatTime(slot.startTime)}
                                        </p>
                                        <p style={{color: '#475569', fontSize: '11px', margin: '3px 0'}}>to</p>
                                        <p style={{...styles.slotTime, color: isBooked ? '#ef4444' : isSelected ? color : '#ffffff'}}>
                                            {formatTime(slot.endTime)}
                                        </p>
                                        <div style={{
                                            ...styles.slotStatusTag,
                                            background: isBooked ? '#ef444422' : isSelected ? color + '33' : '#22c55e22',
                                            color: isBooked ? '#ef4444' : isSelected ? color : '#22c55e',
                                        }}>
                                            {isBooked ? '🔴 Booked' : isSelected ? '✓ Selected' : '🟢 Free'}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sticky Booking Bar */}
                {selectedSlot && (
                    <div className="booking-bar" style={{...styles.bookingBar, borderTop: `3px solid ${color}`}}>
                        <div style={styles.bookingBarLeft}>
                            <p style={styles.bookingBarLabel}>📅 {selectedDate}</p>
                            <p style={{...styles.bookingBarSlot, color}}>
                                ⏰ {formatTime(selectedSlot.startTime)} → {formatTime(selectedSlot.endTime)}
                            </p>
                            <p style={styles.bookingBarTurf}>🏟️ {turf.name}</p>
                        </div>
                        <div className="booking-bar-right" style={styles.bookingBarRight}>
                            <div style={styles.bookingBarPrice}>
                                <p style={styles.bookingBarPriceLabel}>Total</p>
                                <p style={{...styles.bookingBarPriceVal, color}}>₹{turf.pricePerHour}</p>
                            </div>
                            <button
                                className="book-btn proceed-btn"
                                style={{...styles.proceedBtn, background: color}}
                                onClick={handleBooking}
                            >
                                {user ? 'Proceed to Book →' : '🔒 Login to Book'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },
    center: { textAlign: 'center', padding: '80px' },
    loadingTxt: { color: '#94a3b8', fontSize: '18px', textAlign: 'center', padding: '40px' },
    banner: { padding: '40px 32px 32px' },
    bannerInner: { maxWidth: '1100px', margin: '0 auto' },
    backBtn: { background: '#111827', color: '#94a3b8', border: '1px solid #1e293b', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginBottom: '24px', transition: 'all 0.2s' },
    bannerRow: { display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' },
    emojiBox: { width: '150px', height: '150px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    bannerInfo: { flex: 1, minWidth: '280px' },
    sportTag: { display: 'inline-block', padding: '4px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' },
    turfName: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '48px', letterSpacing: '2px', margin: '0 0 12px 0' },
    infoRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' },
    infoItem: { color: '#94a3b8', fontSize: '13px' },
    turfDesc: { color: '#64748b', fontSize: '13px', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.5 },
    statsBar: { display: 'flex', alignItems: 'center', background: '#111827', borderRadius: '10px', padding: '14px 20px', border: '1px solid #1e293b', width: 'fit-content', gap: '0' },
    statBox: { textAlign: 'center', padding: '0 16px' },
    statVal: { fontSize: '22px', fontWeight: '800', margin: '0 0 2px 0' },
    statLbl: { color: '#64748b', fontSize: '11px', margin: 0, whiteSpace: 'nowrap' },
    statDiv: { width: '1px', height: '36px', background: '#1e293b' },
    main: { maxWidth: '1100px', margin: '0 auto', padding: '24px 32px 120px 32px' },
    dateSection: { marginBottom: '32px' },
    secTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '26px', letterSpacing: '2px', marginBottom: '16px' },
    dateRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    dateBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', minWidth: '70px', transition: 'all 0.2s', gap: '2px' },
    slotsSection: { marginBottom: '32px' },
    slotsTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
    legend: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' },
    legendDot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
    slotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' },
    slotBtn: { borderRadius: '10px', padding: '14px 10px', textAlign: 'center', transition: 'all 0.15s' },
    slotTime: { fontSize: '15px', fontWeight: '800', margin: 0 },
    slotStatusTag: { marginTop: '8px', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' },
    noSlots: { textAlign: 'center', padding: '60px 20px', background: '#111827', borderRadius: '12px', border: '1px solid #1e293b' },
    bookingBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111827', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 -8px 32px rgba(0,0,0,0.6)', zIndex: 100 },
    bookingBarLeft: {},
    bookingBarLabel: { color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' },
    bookingBarSlot: { fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' },
    bookingBarTurf: { color: '#94a3b8', fontSize: '13px', margin: 0 },
    bookingBarRight: { display: 'flex', alignItems: 'center', gap: '20px' },
    bookingBarPrice: { textAlign: 'right' },
    bookingBarPriceLabel: { color: '#64748b', fontSize: '11px', margin: '0 0 2px 0', textTransform: 'uppercase' },
    bookingBarPriceVal: { fontSize: '28px', fontWeight: '800', margin: 0 },
    proceedBtn: { color: '#000', border: 'none', padding: '14px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' },
};

export default TurfDetail;
