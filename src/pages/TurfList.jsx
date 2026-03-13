import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { searchTurfs } from '../services/api';

const SPORT_CONFIG = {
    Football: {
        color: '#60a5fa', bg: '#0c1a3a', emoji: '⚽',
        image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80',
    },
    Cricket: {
        color: '#4ade80', bg: '#052e16', emoji: '🏏',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    },
    Basketball: {
        color: '#fb923c', bg: '#3a1200', emoji: '🏀',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    },
    Tennis: {
        color: '#a3e635', bg: '#1a3a00', emoji: '🎾',
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
    },
    Badminton: {
        color: '#e879f9', bg: '#2a0a3a', emoji: '🏸',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    },
};

const DEFAULT_CONFIG = { color: '#94a3b8', bg: '#1e293b', emoji: '🏟️',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80' };

function TurfList() {
    const [turfs, setTurfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState('');
    const [sportType, setSportType] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(useLocation().search);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loc = queryParams.get('location') || '';
        const sport = queryParams.get('sportType') || '';
        setLocation(loc);
        setSportType(sport);
        setActiveFilter(sport || 'All');
        fetchTurfs(loc, sport);
    }, []);

    const fetchTurfs = async (loc, sport) => {
        setLoading(true);
        try {
            const res = await searchTurfs(loc, sport);
            setTurfs(Array.isArray(res.data) ? res.data : []);
        } catch { setTurfs([]); }
        finally { setLoading(false); }
    };

    const handleSearch = () => fetchTurfs(location, sportType);
    const handleSportFilter = (sport) => {
        setActiveFilter(sport);
        const s = sport === 'All' ? '' : sport;
        setSportType(s);
        fetchTurfs(location, s);
    };
    const handleClear = () => {
        setLocation(''); setSportType(''); setActiveFilter('All');
        fetchTurfs('', '');
    };

    const getSport = (s) => SPORT_CONFIG[s] || DEFAULT_CONFIG;

    const featuredTurf = turfs[0];
    const restTurfs = turfs.slice(1);
    const sportFilters = ['All', 'Football', 'Cricket', 'Basketball', 'Badminton', 'Tennis'];

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input { outline: none; }
                .turf-card { transition: transform 0.25s, box-shadow 0.25s; cursor: pointer; }
                .turf-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(0,0,0,0.6) !important; }
                .featured-card { transition: transform 0.25s; cursor: pointer; }
                .featured-card:hover { transform: scale(1.01); }
                .filter-pill:hover { opacity: 0.85; transform: translateY(-1px); }
                .book-btn:hover { opacity: 0.88; transform: translateY(-1px); }
                input::placeholder { color: #475569; }
                .search-wrap:focus-within { border-color: #22c55e !important; box-shadow: 0 0 0 3px #22c55e22; }

                @media (max-width: 768px) {
                    .hero-title { font-size: 38px !important; letter-spacing: 2px !important; }
                    .hero-header { padding: 70px 16px 36px !important; }
                    .big-search-row { flex-direction: column !important; gap: 10px !important; }
                    .big-search-wrap { min-width: unset !important; max-width: 100% !important; width: 100% !important; }
                    .big-search-btn { width: 100% !important; padding: 14px !important; justify-content: center !important; }
                    .pills-row { gap: 8px !important; }
                    .pill { padding: 8px 14px !important; font-size: 12px !important; }
                    .body-wrap { padding: 16px !important; }
                    .featured-content { flex-direction: column !important; padding: 24px 20px !important; gap: 16px !important; }
                    .featured-name { font-size: 32px !important; }
                    .featured-right { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; width: 100% !important; }
                    .featured-emoji-box { width: 80px !important; height: 80px !important; }
                    .featured-price { font-size: 32px !important; }
                    .grid { grid-template-columns: 1fr !important; gap: 16px !important; }
                    .results-bar { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
                }
                @media (max-width: 480px) {
                    .hero-title { font-size: 30px !important; }
                    .pill { padding: 7px 10px !important; font-size: 11px !important; }
                }
            `}</style>

            <Navbar />

            {/* HERO HEADER */}
            <div className="hero-header" style={styles.heroHeader}>
                <div style={styles.heroBg}/>
                <div style={styles.heroOverlay}/>
                <div style={styles.heroContent}>
                    <p style={styles.heroBreadcrumb}>🏠 Home → Find Turfs</p>
                    <h1 className="hero-title" style={styles.heroTitle}>Find Your Perfect Turf</h1>
                    <p style={styles.heroSub}>
                        {loading ? 'Loading turfs...' : `${turfs.length} turfs available across Solapur, Pune & Mumbai`}
                    </p>

                    {/* BIG SEARCH BAR */}
                    <div className="big-search-row" style={styles.bigSearchRow}>
                        <div className="search-wrap big-search-wrap" style={styles.bigSearchWrap}>
                            <span style={styles.bigSearchIcon}>📍</span>
                            <input
                                style={styles.bigSearchInput}
                                type="text"
                                placeholder={isMobile ? "City — Solapur, Pune..." : "Search by city — Solapur, Pune, Mumbai..."}
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                            />
                            {location && (
                                <button style={styles.clearX} onClick={handleClear}>✕</button>
                            )}
                        </div>
                        <button className="big-search-btn" style={styles.bigSearchBtn} onClick={handleSearch}>
                            🔍 Search
                        </button>
                    </div>

                    {/* SPORT FILTER PILLS */}
                    <div className="pills-row" style={styles.pillsRow}>
                        {sportFilters.map(s => {
                            const cfg = s === 'All' ? null : getSport(s);
                            const isActive = activeFilter === s;
                            return (
                                <button
                                    key={s}
                                    className="filter-pill pill"
                                    onClick={() => handleSportFilter(s)}
                                    style={{
                                        ...styles.pill,
                                        background: isActive
                                            ? (s === 'All' ? '#22c55e' : cfg.color)
                                            : 'rgba(255,255,255,0.08)',
                                        color: isActive ? '#000' : '#94a3b8',
                                        border: `1px solid ${isActive ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: isActive ? `0 4px 20px ${s === 'All' ? '#22c55e44' : cfg.color + '44'}` : 'none',
                                        transform: isActive ? 'translateY(-2px)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {s === 'All' ? '🏟️ All' : `${cfg.emoji} ${isMobile ? '' : s}`}{isMobile && s !== 'All' ? s : ''}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="body-wrap" style={styles.body}>

                {/* Results bar */}
                {!loading && turfs.length > 0 && (
                    <div className="results-bar" style={styles.resultsBar}>
                        <p style={styles.resultsTxt}>
                            <span style={{color: '#22c55e', fontWeight: '800'}}>{turfs.length} turfs</span>
                            {location ? ` in "${location}"` : ' available'}
                            {sportType ? ` · ${sportType}` : ' · All Sports'}
                        </p>
                        {(location || sportType) && (
                            <button style={styles.clearAllBtn} onClick={handleClear}>✕ Clear filters</button>
                        )}
                    </div>
                )}

                {/* LOADING */}
                {loading && (
                    <div style={styles.centerBox}>
                        <div style={{fontSize: '56px', marginBottom: '16px'}}>⏳</div>
                        <p style={{color: '#94a3b8', fontSize: '18px'}}>Finding best turfs for you...</p>
                    </div>
                )}

                {/* EMPTY */}
                {!loading && turfs.length === 0 && (
                    <div style={styles.emptyBox}>
                        <p style={{fontSize: '72px', marginBottom: '16px'}}>🏟️</p>
                        <h3 style={styles.emptyTitle}>No turfs found!</h3>
                        <p style={{color: '#64748b', marginBottom: '24px'}}>Try a different city or sport</p>
                        <button style={styles.emptyBtn} onClick={handleClear}>Show All Turfs</button>
                    </div>
                )}

                {/* MAGAZINE LAYOUT */}
                {!loading && turfs.length > 0 && (
                    <>
                        {/* FEATURED TURF */}
                        {featuredTurf && (
                            <div style={styles.featuredSection}>
                                <div style={styles.featuredLabel}>
                                    <span style={styles.featuredBadge}>⭐ FEATURED TURF</span>
                                </div>
                                <div
                                    className="featured-card"
                                    style={styles.featuredCard}
                                    onClick={() => navigate(`/turfs/${featuredTurf.id}`)}
                                >
                                    <div style={{
                                        ...styles.featuredImg,
                                        backgroundImage: `url(${getSport(featuredTurf.sportType).image})`,
                                    }}>
                                        <div style={{
                                            ...styles.featuredImgOverlay,
                                            background: `linear-gradient(135deg, ${getSport(featuredTurf.sportType).color}33 0%, rgba(5,10,20,0.85) 100%)`,
                                        }}/>
                                    </div>

                                    <div className="featured-content" style={styles.featuredContent}>
                                        <div style={styles.featuredLeft}>
                                            <div style={{
                                                ...styles.featuredSportTag,
                                                background: getSport(featuredTurf.sportType).color,
                                            }}>
                                                {getSport(featuredTurf.sportType).emoji} {featuredTurf.sportType}
                                            </div>
                                            <h2 className="featured-name" style={styles.featuredName}>{featuredTurf.name}</h2>
                                            <div style={styles.featuredMeta}>
                                                <span style={styles.metaItem}>📍 {featuredTurf.location}</span>
                                                <span style={styles.metaItem}>🏠 {featuredTurf.address}</span>
                                                {featuredTurf.openTime && (
                                                    <span style={styles.metaItem}>🕐 {featuredTurf.openTime} – {featuredTurf.closeTime}</span>
                                                )}
                                            </div>
                                            {featuredTurf.description && (
                                                <p style={styles.featuredDesc}>{featuredTurf.description}</p>
                                            )}
                                        </div>
                                        <div className="featured-right" style={styles.featuredRight}>
                                            <div className="featured-emoji-box" style={styles.featuredEmojiBox}>
                                                <span style={{fontSize: isMobile ? '48px' : '80px'}}>
                                                    {getSport(featuredTurf.sportType).emoji}
                                                </span>
                                            </div>
                                            <div style={styles.featuredPriceBox}>
                                                <p style={styles.featuredPriceLabel}>Starting from</p>
                                                <p className="featured-price" style={{
                                                    ...styles.featuredPrice,
                                                    color: getSport(featuredTurf.sportType).color,
                                                }}>
                                                    ₹{featuredTurf.pricePerHour}
                                                    <span style={{fontSize: '16px', fontWeight: '400', color: '#64748b'}}>/hr</span>
                                                </p>
                                                <button
                                                    className="book-btn"
                                                    style={{
                                                        ...styles.featuredBookBtn,
                                                        background: getSport(featuredTurf.sportType).color,
                                                    }}
                                                    onClick={e => { e.stopPropagation(); navigate(`/turfs/${featuredTurf.id}`); }}
                                                >
                                                    Book Now →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* REST TURFS GRID */}
                        {restTurfs.length > 0 && (
                            <>
                                <div style={styles.gridHeader}>
                                    <h2 style={styles.gridTitle}>🏟️ All Turfs</h2>
                                    <p style={styles.gridSub}>{restTurfs.length} more turfs available</p>
                                </div>
                                <div className="grid" style={styles.grid}>
                                    {restTurfs.map(turf => {
                                        const cfg = getSport(turf.sportType);
                                        return (
                                            <div
                                                key={turf.id}
                                                className="turf-card"
                                                style={styles.card}
                                                onClick={() => navigate(`/turfs/${turf.id}`)}
                                            >
                                                <div style={{
                                                    ...styles.cardImg,
                                                    backgroundImage: `url(${cfg.image})`,
                                                }}>
                                                    <div style={{
                                                        ...styles.cardImgOverlay,
                                                        background: `linear-gradient(180deg, transparent 40%, rgba(5,10,20,0.95) 100%)`,
                                                    }}/>
                                                    <div style={{...styles.cardSportTag, background: cfg.color}}>
                                                        {cfg.emoji} {turf.sportType}
                                                    </div>
                                                    <div style={styles.cardPriceBadge}>₹{turf.pricePerHour}/hr</div>
                                                    <div style={styles.cardNameOverlay}>
                                                        <h3 style={styles.cardName}>{turf.name}</h3>
                                                    </div>
                                                </div>

                                                <div style={styles.cardBody}>
                                                    <div style={styles.cardDetails}>
                                                        <p style={styles.cardDetail}><span>📍</span> {turf.location}</p>
                                                        <p style={styles.cardDetail}><span>🏠</span> {turf.address}</p>
                                                        {turf.openTime && (
                                                            <p style={styles.cardDetail}><span>🕐</span> {turf.openTime} – {turf.closeTime}</p>
                                                        )}
                                                    </div>
                                                    {turf.description && (
                                                        <p style={styles.cardDesc}>{turf.description}</p>
                                                    )}
                                                    <div style={styles.cardFooter}>
                                                        <div>
                                                            <p style={styles.priceLabel}>Price / hour</p>
                                                            <p style={{...styles.priceVal, color: cfg.color}}>₹{turf.pricePerHour}</p>
                                                        </div>
                                                        <button
                                                            className="book-btn"
                                                            style={{...styles.bookBtn, background: cfg.color}}
                                                            onClick={e => { e.stopPropagation(); navigate(`/turfs/${turf.id}`); }}
                                                        >
                                                            View & Book →
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{height: '3px', background: cfg.color, opacity: 0.6}}/>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },
    heroHeader: { position: 'relative', padding: '80px 32px 60px', overflow: 'hidden' },
    heroBg: {
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(3px) brightness(0.3)',
    },
    heroOverlay: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(5,10,20,0.7) 0%, rgba(5,10,20,0.95) 100%)',
    },
    heroContent: { position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
    heroBreadcrumb: { color: '#475569', fontSize: '13px', marginBottom: '12px' },
    heroTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff', fontSize: '64px',
        letterSpacing: '3px', margin: '0 0 12px 0',
        textShadow: '0 4px 30px rgba(0,0,0,0.5)',
    },
    heroSub: { color: '#94a3b8', fontSize: '16px', marginBottom: '32px' },
    bigSearchRow: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' },
    bigSearchWrap: {
        flex: 1, display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '14px', padding: '0 20px',
        minWidth: '300px', maxWidth: '600px', transition: 'all 0.2s',
    },
    bigSearchIcon: { fontSize: '18px', marginRight: '12px', flexShrink: 0 },
    bigSearchInput: { flex: 1, padding: '16px 0', background: 'transparent', border: 'none', color: '#ffffff', fontSize: '16px' },
    clearX: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '16px', cursor: 'pointer', padding: '4px 8px' },
    bigSearchBtn: {
        padding: '16px 32px', background: '#22c55e', color: '#000',
        border: 'none', borderRadius: '14px', fontSize: '16px',
        fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 20px #22c55e44',
    },
    pillsRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' },
    pill: { padding: '10px 20px', borderRadius: '25px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px' },
    body: { maxWidth: '1200px', margin: '0 auto', padding: '32px' },
    resultsBar: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '28px', padding: '14px 20px',
        background: '#111827', borderRadius: '10px', border: '1px solid #1e293b',
    },
    resultsTxt: { color: '#94a3b8', fontSize: '14px', margin: 0 },
    clearAllBtn: {
        background: 'transparent', color: '#64748b',
        border: '1px solid #334155', padding: '6px 14px',
        borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
    },
    centerBox: { textAlign: 'center', padding: '80px 20px' },
    emptyBox: { textAlign: 'center', padding: '80px 20px', background: '#111827', borderRadius: '16px', border: '1px solid #1e293b' },
    emptyTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '32px', letterSpacing: '2px', marginBottom: '8px' },
    emptyBtn: { background: '#22c55e', color: '#000', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '800' },
    featuredSection: { marginBottom: '40px' },
    featuredLabel: { marginBottom: '12px' },
    featuredBadge: { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', letterSpacing: '1px' },
    featuredCard: { borderRadius: '20px', overflow: 'hidden', border: '1px solid #1e293b', position: 'relative', background: '#111827', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
    featuredImg: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' },
    featuredImgOverlay: { position: 'absolute', inset: 0 },
    featuredContent: {
        position: 'relative', zIndex: 1,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '40px 48px',
        flexWrap: 'wrap', gap: '24px', minHeight: '260px',
    },
    featuredLeft: { flex: 1, minWidth: '260px' },
    featuredSportTag: { display: 'inline-block', color: '#000', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' },
    featuredName: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '52px', letterSpacing: '2px', margin: '0 0 16px 0', textShadow: '0 4px 20px rgba(0,0,0,0.5)', lineHeight: 1 },
    featuredMeta: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' },
    metaItem: { color: 'rgba(255,255,255,0.6)', fontSize: '13px' },
    featuredDesc: { color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontStyle: 'italic', lineHeight: 1.5, margin: 0, maxWidth: '400px' },
    featuredRight: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    featuredEmojiBox: { width: '120px', height: '120px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.1)' },
    featuredPriceBox: { textAlign: 'center' },
    featuredPriceLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
    featuredPrice: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', letterSpacing: '2px', margin: '0 0 12px 0' },
    featuredBookBtn: { color: '#000', border: 'none', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
    gridHeader: { marginBottom: '20px' },
    gridTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '32px', letterSpacing: '2px', margin: '0 0 4px 0' },
    gridSub: { color: '#64748b', fontSize: '14px', margin: 0 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
    card: { background: '#111827', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e293b', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
    cardImg: { height: '180px', position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center' },
    cardImgOverlay: { position: 'absolute', inset: 0 },
    cardSportTag: { position: 'absolute', top: '12px', left: '12px', color: '#000', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', zIndex: 1 },
    cardPriceBadge: { position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', color: '#ffffff', padding: '5px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', zIndex: 1, border: '1px solid rgba(255,255,255,0.1)' },
    cardNameOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px', zIndex: 1 },
    cardName: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '22px', letterSpacing: '1px', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.8)' },
    cardBody: { padding: '16px 18px' },
    cardDetails: { marginBottom: '10px' },
    cardDetail: { color: '#94a3b8', fontSize: '12px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' },
    cardDesc: { color: '#475569', fontSize: '12px', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '12px' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #1e293b' },
    priceLabel: { color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' },
    priceVal: { fontSize: '22px', fontWeight: '800', margin: 0 },
    bookBtn: { color: '#000', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap' },
};

export default TurfList;
