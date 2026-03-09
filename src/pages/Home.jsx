import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { searchTurfs } from '../services/api';

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredTurfs, setFeaturedTurfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            sport: 'Football', emoji: '⚽', color: '#60a5fa',
            tag: 'Reserve Football Pitches',
            headline: 'Dominate\nThe Field',
            img: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1800&q=80',
        },
        {
            sport: 'Cricket', emoji: '🏏', color: '#4ade80',
            tag: 'Book Cricket Turfs',
            headline: 'Play Like\nA Champion',
            img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1800&q=80',
        },
        {
            sport: 'Basketball', emoji: '🏀', color: '#fb923c',
            tag: 'Find Basketball Courts',
            headline: 'Rise &\nShine',
            img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1800&q=80',
        },
        {
            sport: 'Tennis', emoji: '🎾', color: '#a3e635',
            tag: 'Book Tennis Courts',
            headline: 'Serve &\nConquer',
            img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1800&q=80',
        },
        {
            sport: 'Badminton', emoji: '🏸', color: '#e879f9',
            tag: 'Book Badminton Courts',
            headline: 'Smash It\nToday',
            img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1800&q=80',
        },
    ];

    const sports = [
        { name: 'Cricket', emoji: '🏏', color: '#4ade80', bg: '#052e16' },
        { name: 'Football', emoji: '⚽', color: '#60a5fa', bg: '#0c1a3a' },
        { name: 'Basketball', emoji: '🏀', color: '#fb923c', bg: '#3a1200' },
        { name: 'Tennis', emoji: '🎾', color: '#a3e635', bg: '#1a3a00' },
        { name: 'Badminton', emoji: '🏸', color: '#e879f9', bg: '#2a0a3a' },
    ];

    const getTurfColor = (sport) => {
        const map = { Football: '#60a5fa', Cricket: '#4ade80', Basketball: '#fb923c', Badminton: '#e879f9', Tennis: '#a3e635' };
        return map[sport] || '#94a3b8';
    };

    const getTurfEmoji = (sport) => {
        const map = { Football: '⚽', Cricket: '🏏', Basketball: '🏀', Badminton: '🏸', Tennis: '🎾' };
        return map[sport] || '🏟️';
    };

    useEffect(() => {
        loadFeaturedTurfs();
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const loadFeaturedTurfs = async () => {
        try {
            const response = await searchTurfs('', '');
            const data = Array.isArray(response.data) ? response.data : [];
            setFeaturedTurfs(data.slice(0, 8));
        } catch (err) {
            console.error('Failed to load turfs');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        navigate(`/turfs?location=${searchQuery}`);
    };

    const current = slides[currentSlide];

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                .sport-card:hover { transform: translateY(-8px) scale(1.03) !important; }
                .turf-card:hover { transform: translateY(-6px) !important; box-shadow: 0 24px 48px rgba(0,0,0,0.6) !important; }
                .book-btn:hover { opacity: 0.85; transform: translateY(-2px); }
                .search-btn:hover { opacity: 0.88; }
                .footer-link:hover { color: #22c55e !important; }
                .see-all:hover { background: #22c55e22 !important; }
                @keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
                @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
                @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }
                @keyframes floatEmoji { 0%,100%{transform:translateY(0px) rotate(-5deg);} 50%{transform:translateY(-20px) rotate(5deg);} }
                .hero-emoji { animation: floatEmoji 3s ease-in-out infinite; display:inline-block; }
                .hero-text { animation: slideUp 0.7s ease forwards; }
                .hero-tag { animation: slideUp 0.5s ease forwards; }
            `}</style>

            <Navbar />

            {/* ===== HERO SECTION ===== */}
            <div style={styles.hero}>
                <div style={styles.bgContainer}>
                    {slides.map((s, i) => (
                        <div key={i} style={{
                            ...styles.bgSlide,
                            backgroundImage: `url(${s.img})`,
                            opacity: i === currentSlide ? 1 : 0,
                            transition: 'opacity 1.2s ease',
                        }}/>
                    ))}
                    <div style={styles.bgOverlay}/>
                    <div style={{
                        ...styles.bgTint,
                        background: current.color + '12',
                        transition: 'background 0.8s ease',
                    }}/>
                    <div style={styles.bgBottomFade}/>
                </div>

                <div style={styles.heroContent}>
                    <div style={styles.heroInner}>
                        {/* LEFT */}
                        <div style={styles.heroLeft}>
                            <div className="hero-tag" style={{
                                ...styles.sportTagPill,
                                background: current.color + '22',
                                border: `1px solid ${current.color}55`,
                                color: current.color,
                                transition: 'all 0.5s ease',
                            }}>
                                {current.emoji} {current.tag}
                            </div>

                            <h1 className="hero-text" style={styles.heroTitle}>
                                {current.headline.split('\n').map((line, i) => (
                                    <span key={i}>
                                        {i === 1
                                            ? <span style={{color: current.color, transition: 'color 0.5s'}}>{line}</span>
                                            : line}
                                        <br/>
                                    </span>
                                ))}
                                <span style={{color: '#ffffff'}}>Book Now.</span>
                            </h1>

                            <p style={styles.heroSub}>
                                Find and book premier Cricket, Football, Basketball,
                                Tennis & Badminton courts in your city. Instant confirmation!
                            </p>

                            <div style={styles.heroBtns}>
                                <button
                                    className="book-btn"
                                    style={{
                                        ...styles.heroBtn,
                                        background: `linear-gradient(135deg, ${current.color}, ${current.color}bb)`,
                                        transition: 'background 0.5s ease',
                                    }}
                                    onClick={() => navigate('/turfs')}
                                >
                                    🏟️ Browse All Turfs
                                </button>
                                <button
                                    style={styles.heroSecBtn}
                                    onClick={() => navigate('/register')}
                                >
                                    Register Free →
                                </button>
                            </div>

                            <div style={styles.heroStats}>
                                {[
                                    { val: '14+', label: 'Turfs' },
                                    { val: '5', label: 'Sports' },
                                    { val: '3', label: 'Cities' },
                                    { val: '24/7', label: 'Booking' },
                                ].map((s, i) => (
                                    <div key={i} style={styles.heroStat}>
                                        <p style={{...styles.heroStatVal, color: current.color}}>{s.val}</p>
                                        <p style={styles.heroStatLabel}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div style={styles.heroRight}>
                            <div style={{
                                ...styles.emojiCircle,
                                border: `3px solid ${current.color}44`,
                                boxShadow: `0 0 80px ${current.color}33, 0 0 160px ${current.color}11`,
                                transition: 'all 0.6s ease',
                            }}>
                                <span className="hero-emoji" style={{fontSize: '110px'}}>
                                    {current.emoji}
                                </span>
                            </div>
                            <div style={{
                                ...styles.sportNameBadge,
                                color: current.color,
                                borderColor: current.color + '44',
                                transition: 'all 0.5s ease',
                            }}>
                                {current.sport.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Slide dots */}
                    <div style={styles.slideDots}>
                        {slides.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                style={{
                                    ...styles.dot,
                                    background: i === currentSlide ? s.color : 'rgba(255,255,255,0.2)',
                                    width: i === currentSlide ? '32px' : '10px',
                                    boxShadow: i === currentSlide ? `0 0 10px ${s.color}` : 'none',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div style={styles.searchBarWrap}>
                    <div style={styles.searchBar}>
                        <span style={styles.searchBarIcon}>📍</span>
                        <input
                            style={styles.searchInput}
                            type="text"
                            placeholder="Search by city — Solapur, Pune, Mumbai..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            className="search-btn"
                            style={{
                                ...styles.searchBtn,
                                background: `linear-gradient(135deg, ${current.color}, ${current.color}bb)`,
                            }}
                            onClick={handleSearch}
                        >
                            🔍 Search Turfs
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== OUR SPORTS ===== */}
            <div style={styles.section}>
                <div style={styles.secHeader}>
                    <h2 style={styles.secTitle}>🏆 Our Sports</h2>
                    <p style={styles.secSub}>Choose your sport and find the best venues</p>
                </div>
                <div style={styles.sportsGrid}>
                    {sports.map((s, i) => (
                        <div
                            key={i}
                            className="sport-card"
                            style={{
                                ...styles.sportCard,
                                background: `linear-gradient(135deg, ${s.bg} 0%, #0a0f1a 100%)`,
                                border: `2px solid ${s.color}33`,
                                transition: 'all 0.3s ease',
                            }}
                            onClick={() => navigate(`/turfs?sportType=${s.name}`)}
                        >
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: `radial-gradient(circle at 50% 40%, ${s.color}08 0%, transparent 70%)`,
                                borderRadius: '16px',
                            }}/>
                            <div style={{
                                ...styles.sportEmojiBox,
                                border: `2px solid ${s.color}33`,
                                background: s.color + '11',
                                boxShadow: `0 0 30px ${s.color}11`,
                            }}>
                                <span style={{fontSize: '56px'}}>{s.emoji}</span>
                            </div>
                            <h3 style={{...styles.sportName, color: s.color}}>{s.name}</h3>
                            <div style={{
                                ...styles.sportBookBtn,
                                background: s.color + '22',
                                border: `1px solid ${s.color}44`,
                                color: s.color,
                            }}>
                                Book Now →
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== FEATURED VENUES ===== */}
            <div style={styles.featuredSection}>
                <div style={styles.featuredHeader}>
                    <div>
                        <h2 style={styles.secTitle}>🏟️ Featured Venues</h2>
                        <p style={styles.secSub}>Top-rated turfs near you</p>
                    </div>
                    <button
                        className="see-all"
                        style={styles.seeAllBtn}
                        onClick={() => navigate('/turfs')}
                    >
                        See All Turfs →
                    </button>
                </div>

                {loading ? (
                    <div style={styles.loadingBox}>
                        <p style={{fontSize: '48px', marginBottom: '12px'}}>⏳</p>
                        <p style={{color: '#94a3b8', fontSize: '16px'}}>Loading venues...</p>
                    </div>
                ) : (
                    <div style={styles.venuesGrid}>
                        {featuredTurfs.map(turf => {
                            const color = getTurfColor(turf.sportType);
                            return (
                                <div
                                    key={turf.id}
                                    className="turf-card"
                                    style={{...styles.venueCard, border: `1px solid ${color}22`}}
                                    onClick={() => navigate(`/turfs/${turf.id}`)}
                                >
                                    <div style={{
                                        ...styles.venueImg,
                                        background: `linear-gradient(135deg, ${color}18 0%, #0a0f1a 100%)`,
                                        borderBottom: `2px solid ${color}22`,
                                    }}>
                                        <span style={{fontSize: '64px'}}>{getTurfEmoji(turf.sportType)}</span>
                                        <div style={{...styles.venueSportBadge, background: color}}>{turf.sportType}</div>
                                        <div style={styles.venuePriceBadge}>₹{turf.pricePerHour}/hr</div>
                                    </div>
                                    <div style={styles.venueBody}>
                                        <h3 style={styles.venueName}>{turf.name}</h3>
                                        <p style={styles.venueLocation}>📍 {turf.location}</p>
                                        <p style={styles.venueAddress}>🏠 {turf.address}</p>
                                        {turf.openTime && (
                                            <p style={styles.venueTiming}>🕐 {turf.openTime} – {turf.closeTime}</p>
                                        )}
                                        <div style={styles.venueFooter}>
                                            <span style={{...styles.venuePrice, color}}>
                                                ₹{turf.pricePerHour}
                                                <span style={{color: '#64748b', fontSize: '12px', fontWeight: '400'}}>/hr</span>
                                            </span>
                                            <button
                                                className="book-btn"
                                                style={{...styles.venueBtn, background: color}}
                                                onClick={e => { e.stopPropagation(); navigate(`/turfs/${turf.id}`); }}
                                            >
                                                Book →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ===== HOW IT WORKS ===== */}
            <div style={styles.howSection}>
                <div style={styles.secHeader}>
                    <h2 style={styles.secTitle}>⚡ How It Works</h2>
                    <p style={styles.secSub}>Book your turf in 3 simple steps</p>
                </div>
                <div style={styles.howGrid}>
                    {[
                        { step: '01', icon: '🔍', title: 'Find Your Turf', text: 'Search by city or sport type to find the perfect venue near you.' },
                        { step: '02', icon: '📅', title: 'Pick Date & Slot', text: 'Select your preferred date and available time slot instantly.' },
                        { step: '03', icon: '✅', title: 'Confirm & Play', text: 'Book securely, get QR code confirmation and just show up!' },
                    ].map((h, i) => (
                        <div key={i} style={styles.howCard}>
                            <div style={styles.howStep}>{h.step}</div>
                            <span style={{fontSize: '48px', marginBottom: '16px', display: 'block'}}>{h.icon}</span>
                            <h3 style={styles.howTitle}>{h.title}</h3>
                            <p style={styles.howText}>{h.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== WHY CHOOSE US ===== */}
            <div style={styles.whySection}>
                <div style={styles.secHeader}>
                    <h2 style={styles.secTitle}>🏆 Why Choose BuffTURF?</h2>
                    <p style={styles.secSub}>The best platform for sports turf booking in India</p>
                </div>
                <div style={styles.whyGrid}>
                    {[
                        { icon: '📅', title: 'Easy Booking', text: 'Book courts in seconds with our simple and intuitive platform.', color: '#60a5fa' },
                        { icon: '⚡', title: 'Real-Time Slots', text: 'See live slot availability and book instantly without any confusion.', color: '#4ade80' },
                        { icon: '🏆', title: 'Premium Venues', text: 'All turfs are verified, well-maintained, and ready for play.', color: '#fb923c' },
                        { icon: '📱', title: 'QR Confirmation', text: 'Get a unique QR code for every booking — show up and play!', color: '#e879f9' },
                    ].map((w, i) => (
                        <div key={i} style={{...styles.whyCard, border: `1px solid ${w.color}22`}}>
                            <div style={{...styles.whyIconBox, background: w.color + '15', border: `1px solid ${w.color}33`}}>
                                <span style={{fontSize: '32px'}}>{w.icon}</span>
                            </div>
                            <h3 style={{...styles.whyTitle, color: w.color}}>{w.title}</h3>
                            <p style={styles.whyText}>{w.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== CTA BANNER ===== */}
            <div style={styles.ctaBanner}>
                <div style={styles.ctaBannerBg}/>
                <div style={styles.ctaContent}>
                    <h2 style={styles.ctaTitle}>Ready to Play? 🚀</h2>
                    <p style={styles.ctaSub}>Join thousands of sports enthusiasts booking turfs on BuffTURF every day!</p>
                    <div style={styles.ctaBtns}>
                        <button style={styles.ctaBtn} onClick={() => navigate('/turfs')}>🏟️ Find Turfs Now</button>
                        <button style={styles.ctaSecBtn} onClick={() => navigate('/register')}>Register Free →</button>
                    </div>
                </div>
            </div>

            {/* ===== NEW FOOTER ===== */}
            <Footer />

        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },

    hero: { position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' },
    bgContainer: { position: 'absolute', inset: 0, zIndex: 0 },
    bgSlide: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' },
    bgOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,10,20,0.92) 0%, rgba(5,10,20,0.7) 50%, rgba(5,10,20,0.88) 100%)' },
    bgTint: { position: 'absolute', inset: 0 },
    bgBottomFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to bottom, transparent, #050a14)' },

    heroContent: { position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    heroInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', padding: '80px 40px 40px 40px', width: '100%', gap: '40px', flexWrap: 'wrap' },
    heroLeft: { flex: 1, minWidth: '300px' },
    sportTagPill: { display: 'inline-block', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '800', letterSpacing: '1px', marginBottom: '20px', textTransform: 'uppercase' },
    heroTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '80px', lineHeight: 1.0, color: '#ffffff', marginBottom: '20px', letterSpacing: '2px', textShadow: '0 4px 30px rgba(0,0,0,0.5)' },
    heroSub: { color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px', maxWidth: '460px' },
    heroBtns: { display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' },
    heroBtn: { color: '#000', border: 'none', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.2s' },
    heroSecBtn: { background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s' },
    heroStats: { display: 'flex', gap: '0', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', width: 'fit-content' },
    heroStat: { textAlign: 'center', padding: '14px 20px', borderRight: '1px solid rgba(255,255,255,0.06)' },
    heroStatVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '2px', margin: '0 0 2px 0' },
    heroStatLabel: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },
    heroRight: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', minWidth: '250px' },
    emojiCircle: { width: '240px', height: '240px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' },
    sportNameBadge: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '5px', padding: '10px 24px', borderRadius: '8px', border: '1px solid', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' },
    slideDots: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', paddingBottom: '24px', position: 'relative', zIndex: 1 },
    dot: { height: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', padding: 0 },

    searchBarWrap: { position: 'relative', zIndex: 1, padding: '0 32px 48px 32px' },
    searchBar: { maxWidth: '700px', margin: '0 auto', display: 'flex', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
    searchBarIcon: { fontSize: '20px', padding: '0 16px', display: 'flex', alignItems: 'center', flexShrink: 0 },
    searchInput: { flex: 1, padding: '18px 0', background: 'transparent', border: 'none', color: '#ffffff', fontSize: '15px', outline: 'none' },
    searchBtn: { padding: '18px 28px', border: 'none', color: '#000', fontSize: '15px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' },

    section: { maxWidth: '1200px', margin: '0 auto', padding: '72px 32px' },
    secHeader: { marginBottom: '36px' },
    secTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '42px', letterSpacing: '2px', margin: '0 0 6px 0' },
    secSub: { color: '#64748b', fontSize: '15px', margin: 0 },

    sportsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
    sportCard: { borderRadius: '16px', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
    sportEmojiBox: { width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' },
    sportName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '2px', margin: '0 0 14px 0' },
    sportBookBtn: { display: 'inline-block', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.5px' },

    featuredSection: { background: '#070d1a', padding: '72px 32px' },
    featuredHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: '1200px', margin: '0 auto 36px auto', flexWrap: 'wrap', gap: '16px' },
    seeAllBtn: { background: 'transparent', color: '#22c55e', border: '1px solid #22c55e44', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s' },
    venuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' },
    venueCard: { backgroundColor: '#111827', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
    venueImg: { height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    venueSportBadge: { position: 'absolute', top: '12px', left: '12px', color: '#000', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', letterSpacing: '1px' },
    venuePriceBadge: { position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '700' },
    venueBody: { padding: '18px' },
    venueName: { color: '#ffffff', fontSize: '17px', fontWeight: '800', marginBottom: '8px', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' },
    venueLocation: { color: '#94a3b8', fontSize: '13px', marginBottom: '3px' },
    venueAddress: { color: '#64748b', fontSize: '12px', marginBottom: '3px' },
    venueTiming: { color: '#64748b', fontSize: '12px', marginBottom: '12px' },
    venueFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #1e293b' },
    venuePrice: { fontSize: '22px', fontWeight: '800' },
    venueBtn: { color: '#000', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '800', transition: 'all 0.2s' },
    loadingBox: { textAlign: 'center', padding: '60px', maxWidth: '1200px', margin: '0 auto' },

    howSection: { maxWidth: '1200px', margin: '0 auto', padding: '72px 32px', textAlign: 'center' },
    howGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '36px' },
    howCard: { background: '#111827', borderRadius: '16px', padding: '36px 24px', border: '1px solid #1e293b', position: 'relative' },
    howStep: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', color: '#1e293b', letterSpacing: '2px', marginBottom: '8px' },
    howTitle: { color: '#ffffff', fontSize: '18px', fontWeight: '800', marginBottom: '10px' },
    howText: { color: '#64748b', fontSize: '14px', lineHeight: 1.7 },

    whySection: { background: '#070d1a', padding: '72px 32px' },
    whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '36px auto 0 auto' },
    whyCard: { background: '#111827', borderRadius: '14px', padding: '28px', transition: 'all 0.2s' },
    whyIconBox: { width: '60px', height: '60px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
    whyTitle: { fontSize: '16px', fontWeight: '800', marginBottom: '8px' },
    whyText: { color: '#64748b', fontSize: '13px', lineHeight: 1.7, margin: 0 },

    ctaBanner: { position: 'relative', overflow: 'hidden', padding: '80px 32px', textAlign: 'center' },
    ctaBannerBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0c1a3a 0%, #052e16 50%, #0c1a3a 100%)' },
    ctaContent: { position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' },
    ctaTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '56px', letterSpacing: '2px', margin: '0 0 12px 0' },
    ctaSub: { color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' },
    ctaBtns: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' },
    ctaBtn: { background: '#22c55e', color: '#000', border: 'none', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' },
    ctaSecBtn: { background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
};

export default Home;
