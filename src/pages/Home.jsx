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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    const slides = [
        { sport: 'Football', emoji: '⚽', color: '#60a5fa', tag: 'Reserve Football Pitches', headline: 'Dominate\nThe Field', img: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1800&q=80' },
        { sport: 'Cricket', emoji: '🏏', color: '#4ade80', tag: 'Book Cricket Turfs', headline: 'Play Like\nA Champion', img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1800&q=80' },
        { sport: 'Basketball', emoji: '🏀', color: '#fb923c', tag: 'Find Basketball Courts', headline: 'Rise &\nShine', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1800&q=80' },
        { sport: 'Tennis', emoji: '🎾', color: '#a3e635', tag: 'Book Tennis Courts', headline: 'Serve &\nConquer', img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1800&q=80' },
        { sport: 'Badminton', emoji: '🏸', color: '#e879f9', tag: 'Book Badminton Courts', headline: 'Smash It\nToday', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1800&q=80' },
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
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        loadFeaturedTurfs();
        const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 4000);
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

    const handleSearch = () => navigate(`/turfs?location=${searchQuery}`);
    const current = slides[currentSlide];

    return (
        <div style={{ backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input { outline: none; }
                .sport-card:hover { transform: translateY(-6px) scale(1.02) !important; }
                .turf-card:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important; }
                .book-btn:hover { opacity: 0.85; transform: translateY(-1px); }
                .search-btn:hover { opacity: 0.88; }
                .see-all:hover { background: #22c55e22 !important; }
                input::placeholder { color: #475569; }
                @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
                @keyframes floatEmoji { 0%,100%{transform:translateY(0px) rotate(-5deg);} 50%{transform:translateY(-18px) rotate(5deg);} }
                .hero-emoji { animation: floatEmoji 3s ease-in-out infinite; display:inline-block; }
                .hero-anim { animation: slideUp 0.6s ease forwards; }

                /* Hide emoji panel on tablet */
                @media (max-width: 900px) {
                    .hero-right { display: none !important; }
                }

                /* ══ MOBILE 768px ══ */
                @media (max-width: 768px) {
                    .hero-inner { padding: 78px 18px 18px !important; }
                    .hero-title  { font-size: 52px !important; letter-spacing: 1px !important; margin-bottom: 12px !important; }
                    .sport-tag-pill { font-size: 10px !important; padding: 5px 12px !important; margin-bottom: 10px !important; }
                    .hero-sub { font-size: 13px !important; margin-bottom: 18px !important; max-width: 100% !important; }
                    .hero-btns { gap: 8px !important; margin-bottom: 20px !important; }
                    .hero-btn-p { padding: 12px 16px !important; font-size: 13px !important; flex: 1 !important; }
                    .hero-btn-s { padding: 12px 12px !important; font-size: 12px !important; flex: 1 !important; }
                    .hero-stat  { padding: 10px 12px !important; }
                    .hero-stat-val { font-size: 19px !important; }
                    .hero-stat-lbl { font-size: 9px !important; }
                    .slide-dots { padding-bottom: 12px !important; }
                    /* Search */
                    .search-wrap { padding: 0 14px 26px !important; }
                    .search-icon { padding: 0 11px !important; font-size: 15px !important; }
                    .search-input { font-size: 13px !important; padding: 14px 0 !important; }
                    .search-btn { padding: 14px 14px !important; }
                    .search-btn-label { display: none !important; }
                    /* Sports */
                    .sec-wrap { padding: 42px 16px !important; }
                    .sec-title { font-size: 34px !important; }
                    .sec-header { margin-bottom: 20px !important; }
                    .sports-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 10px !important; }
                    .sport-card { padding: 16px 8px !important; border-radius: 12px !important; }
                    .sport-emoji-box { width: 56px !important; height: 56px !important; margin-bottom: 9px !important; }
                    .sport-emoji-icon { font-size: 28px !important; }
                    .sport-name { font-size: 14px !important; margin-bottom: 7px !important; }
                    .sport-book-btn { font-size: 10px !important; padding: 4px 8px !important; }
                    /* Featured */
                    .featured-wrap { padding: 42px 16px !important; }
                    .featured-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; margin-bottom: 18px !important; }
                    .venues-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
                    .venue-img { height: 100px !important; }
                    .venue-emoji { font-size: 36px !important; }
                    .venue-sport-badge { font-size: 8px !important; padding: 2px 6px !important; top: 7px !important; left: 7px !important; }
                    .venue-price-badge { font-size: 9px !important; padding: 2px 5px !important; top: 7px !important; right: 7px !important; }
                    .venue-body { padding: 9px !important; }
                    .venue-name { font-size: 12px !important; margin-bottom: 3px !important; }
                    .venue-location { font-size: 10px !important; }
                    .venue-address { display: none !important; }
                    .venue-timing { font-size: 9px !important; margin-bottom: 7px !important; }
                    .venue-price-val { font-size: 15px !important; }
                    .venue-book-btn { padding: 6px 9px !important; font-size: 10px !important; }
                    /* How it works */
                    .how-wrap { padding: 42px 16px !important; }
                    .how-grid { grid-template-columns: 1fr !important; gap: 10px !important; margin-top: 18px !important; }
                    .how-card { padding: 18px 16px !important; flex-direction: row !important; align-items: center !important; gap: 14px !important; text-align: left !important; }
                    .how-step { font-size: 34px !important; margin-bottom: 0 !important; min-width: 40px !important; }
                    .how-icon-span { font-size: 28px !important; margin-bottom: 0 !important; display: inline !important; }
                    .how-title { font-size: 15px !important; }
                    .how-text  { font-size: 12px !important; }
                    /* Why */
                    .why-wrap { padding: 42px 16px !important; }
                    .why-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; margin-top: 18px !important; }
                    .why-card { padding: 16px 12px !important; border-radius: 10px !important; }
                    .why-icon-box { width: 42px !important; height: 42px !important; border-radius: 9px !important; margin-bottom: 9px !important; }
                    .why-icon-span { font-size: 20px !important; }
                    .why-title { font-size: 13px !important; margin-bottom: 5px !important; }
                    .why-text { font-size: 11px !important; line-height: 1.5 !important; }
                    /* CTA */
                    .cta-wrap { padding: 50px 18px !important; }
                    .cta-title { font-size: 38px !important; }
                    .cta-sub { font-size: 13px !important; margin-bottom: 20px !important; }
                    .cta-btns { flex-direction: column !important; gap: 10px !important; align-items: stretch !important; }
                    .cta-btn-p, .cta-btn-s { padding: 14px !important; width: 100% !important; }
                }

                /* ══ SMALL 480px ══ */
                @media (max-width: 480px) {
                    .hero-title  { font-size: 42px !important; }
                    .venues-grid { grid-template-columns: 1fr !important; }
                    .venue-img   { height: 120px !important; }
                }
            `}</style>

            <Navbar />

            {/* ═══ HERO ═══ */}
            <div style={S.hero}>
                <div style={S.bgWrap}>
                    {slides.map((s, i) => (
                        <div key={i} style={{ ...S.bgSlide, backgroundImage: `url(${s.img})`, opacity: i === currentSlide ? 1 : 0, transition: 'opacity 1.2s ease' }}/>
                    ))}
                    <div style={S.bgOverlay}/>
                    <div style={{ ...S.bgTint, background: current.color + '12', transition: 'background 0.8s ease' }}/>
                    <div style={S.bgFade}/>
                </div>

                <div style={S.heroContent}>
                    <div className="hero-inner" style={S.heroInner}>
                        {/* LEFT */}
                        <div style={S.heroLeft}>
                            <div className="hero-anim sport-tag-pill" style={{ ...S.tagPill, background: current.color + '22', border: `1px solid ${current.color}55`, color: current.color, transition: 'all 0.5s' }}>
                                {current.emoji} {current.tag}
                            </div>

                            <h1 className="hero-anim hero-title" style={S.heroTitle}>
                                {current.headline.split('\n').map((line, i) => (
                                    <span key={i}>
                                        {i === 1 ? <span style={{ color: current.color, transition: 'color 0.5s' }}>{line}</span> : line}
                                        <br/>
                                    </span>
                                ))}
                                <span style={{ color: '#ffffff' }}>Book Now.</span>
                            </h1>

                            <p className="hero-sub" style={S.heroSub}>
                                Find and book premier Cricket, Football, Basketball, Tennis & Badminton courts in your city. Instant confirmation!
                            </p>

                            <div className="hero-btns" style={S.heroBtns}>
                                <button className="book-btn hero-btn-p" style={{ ...S.heroBtnP, background: `linear-gradient(135deg, ${current.color}, ${current.color}bb)`, transition: 'background 0.5s ease' }}
                                    onClick={() => navigate('/turfs')}>
                                    🏟️ Browse All Turfs
                                </button>
                                <button className="hero-btn-s" style={S.heroBtnS} onClick={() => navigate('/register')}>
                                    Register Free →
                                </button>
                            </div>

                            <div style={S.heroStats}>
                                {[{ val: '14+', label: 'Turfs' }, { val: '5', label: 'Sports' }, { val: '3', label: 'Cities' }, { val: '24/7', label: 'Booking' }].map((s, i) => (
                                    <div key={i} className="hero-stat" style={S.heroStat}>
                                        <p className="hero-stat-val" style={{ ...S.heroStatVal, color: current.color }}>{s.val}</p>
                                        <p className="hero-stat-lbl" style={S.heroStatLbl}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT — hidden on mobile via CSS */}
                        <div className="hero-right" style={S.heroRight}>
                            <div style={{ ...S.emojiCircle, border: `3px solid ${current.color}44`, boxShadow: `0 0 80px ${current.color}33, 0 0 160px ${current.color}11`, transition: 'all 0.6s ease' }}>
                                <span className="hero-emoji" style={{ fontSize: '110px' }}>{current.emoji}</span>
                            </div>
                            <div style={{ ...S.sportBadge, color: current.color, borderColor: current.color + '44', transition: 'all 0.5s ease' }}>
                                {current.sport.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="slide-dots" style={S.dots}>
                        {slides.map((s, i) => (
                            <button key={i} onClick={() => setCurrentSlide(i)} style={{ ...S.dot, background: i === currentSlide ? s.color : 'rgba(255,255,255,0.2)', width: i === currentSlide ? '28px' : '8px', boxShadow: i === currentSlide ? `0 0 8px ${s.color}` : 'none', transition: 'all 0.3s ease' }}/>
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="search-wrap" style={S.searchWrap}>
                    <div style={S.searchBar}>
                        <span className="search-icon" style={S.searchIcon}>📍</span>
                        <input className="search-input" style={S.searchInput} type="text"
                            placeholder={isMobile ? 'City — Solapur, Pune...' : 'Search by city — Solapur, Pune, Mumbai...'}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="search-btn" style={{ ...S.searchBtn, background: `linear-gradient(135deg, ${current.color}, ${current.color}bb)` }} onClick={handleSearch}>
                            🔍<span className="search-btn-label"> Search Turfs</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ OUR SPORTS ═══ */}
            <div className="sec-wrap" style={S.section}>
                <div className="sec-header" style={S.secHeader}>
                    <h2 className="sec-title" style={S.secTitle}>🏆 Our Sports</h2>
                    <p style={S.secSub}>Choose your sport and find the best venues</p>
                </div>
                <div className="sports-grid" style={S.sportsGrid}>
                    {sports.map((s, i) => (
                        <div key={i} className="sport-card" style={{ ...S.sportCard, background: `linear-gradient(135deg, ${s.bg} 0%, #0a0f1a 100%)`, border: `2px solid ${s.color}33`, transition: 'all 0.3s ease' }}
                            onClick={() => navigate(`/turfs?sportType=${s.name}`)}>
                            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 40%, ${s.color}08 0%, transparent 70%)`, borderRadius: 'inherit' }}/>
                            <div className="sport-emoji-box" style={{ ...S.sportEmojiBox, border: `2px solid ${s.color}33`, background: s.color + '11', boxShadow: `0 0 30px ${s.color}11` }}>
                                <span className="sport-emoji-icon" style={{ fontSize: '42px' }}>{s.emoji}</span>
                            </div>
                            <h3 className="sport-name" style={{ ...S.sportName, color: s.color }}>{s.name}</h3>
                            <div className="sport-book-btn" style={{ ...S.sportBookBtn, background: s.color + '22', border: `1px solid ${s.color}44`, color: s.color }}>Book Now →</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══ FEATURED VENUES ═══ */}
            <div className="featured-wrap" style={S.featuredWrap}>
                <div className="featured-header" style={S.featuredHeader}>
                    <div>
                        <h2 className="sec-title" style={S.secTitle}>🏟️ Featured Venues</h2>
                        <p style={S.secSub}>Top-rated turfs near you</p>
                    </div>
                    <button className="see-all" style={S.seeAllBtn} onClick={() => navigate('/turfs')}>See All Turfs →</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', maxWidth: '1200px', margin: '0 auto' }}>
                        <p style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</p>
                        <p style={{ color: '#94a3b8', fontSize: '15px' }}>Loading venues...</p>
                    </div>
                ) : (
                    <div className="venues-grid" style={S.venuesGrid}>
                        {featuredTurfs.map(turf => {
                            const color = getTurfColor(turf.sportType);
                            return (
                                <div key={turf.id} className="turf-card" style={{ ...S.venueCard, border: `1px solid ${color}22` }} onClick={() => navigate(`/turfs/${turf.id}`)}>
                                    <div className="venue-img" style={{ ...S.venueImg, background: `linear-gradient(135deg, ${color}18 0%, #0a0f1a 100%)`, borderBottom: `2px solid ${color}22` }}>
                                        <span className="venue-emoji" style={{ fontSize: '52px' }}>{getTurfEmoji(turf.sportType)}</span>
                                        <div className="venue-sport-badge" style={{ ...S.venueSportBadge, background: color }}>{turf.sportType}</div>
                                        <div className="venue-price-badge" style={S.venuePriceBadge}>₹{turf.pricePerHour}/hr</div>
                                    </div>
                                    <div className="venue-body" style={S.venueBody}>
                                        <h3 className="venue-name" style={S.venueName}>{turf.name}</h3>
                                        <p className="venue-location" style={S.venueLocation}>📍 {turf.location}</p>
                                        <p className="venue-address" style={S.venueAddress}>🏠 {turf.address}</p>
                                        {turf.openTime && <p className="venue-timing" style={S.venueTiming}>🕐 {turf.openTime} – {turf.closeTime}</p>}
                                        <div style={S.venueFooter}>
                                            <span className="venue-price-val" style={{ ...S.venuePrice, color }}>
                                                ₹{turf.pricePerHour}<span style={{ color: '#64748b', fontSize: '11px', fontWeight: '400' }}>/hr</span>
                                            </span>
                                            <button className="book-btn venue-book-btn" style={{ ...S.venueBtn, background: color }}
                                                onClick={e => { e.stopPropagation(); navigate(`/turfs/${turf.id}`); }}>
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

            {/* ═══ HOW IT WORKS ═══ */}
            <div className="how-wrap sec-wrap" style={{ ...S.section, textAlign: 'center' }}>
                <div className="sec-header" style={S.secHeader}>
                    <h2 className="sec-title" style={S.secTitle}>⚡ How It Works</h2>
                    <p style={S.secSub}>Book your turf in 3 simple steps</p>
                </div>
                <div className="how-grid" style={S.howGrid}>
                    {[
                        { step: '01', icon: '🔍', title: 'Find Your Turf', text: 'Search by city or sport type to find the perfect venue near you.' },
                        { step: '02', icon: '📅', title: 'Pick Date & Slot', text: 'Select your preferred date and available time slot instantly.' },
                        { step: '03', icon: '✅', title: 'Confirm & Play', text: 'Book securely, get QR code confirmation and just show up!' },
                    ].map((h, i) => (
                        <div key={i} className="how-card" style={S.howCard}>
                            <div className="how-step" style={S.howStep}>{h.step}</div>
                            <div>
                                <span className="how-icon-span" style={{ fontSize: '40px', marginBottom: '12px', display: 'block' }}>{h.icon}</span>
                                <h3 className="how-title" style={S.howTitle}>{h.title}</h3>
                                <p className="how-text" style={S.howText}>{h.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══ WHY CHOOSE US ═══ */}
            <div className="why-wrap" style={S.whyWrap}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="sec-header" style={S.secHeader}>
                        <h2 className="sec-title" style={S.secTitle}>🏆 Why Choose BuffTURF?</h2>
                        <p style={S.secSub}>The best platform for sports turf booking in India</p>
                    </div>
                    <div className="why-grid" style={S.whyGrid}>
                        {[
                            { icon: '📅', title: 'Easy Booking', text: 'Book courts in seconds with our simple and intuitive platform.', color: '#60a5fa' },
                            { icon: '⚡', title: 'Real-Time Slots', text: 'See live slot availability and book instantly without any confusion.', color: '#4ade80' },
                            { icon: '🏆', title: 'Premium Venues', text: 'All turfs are verified, well-maintained, and ready for play.', color: '#fb923c' },
                            { icon: '📱', title: 'QR Confirmation', text: 'Get a unique QR code for every booking — show up and play!', color: '#e879f9' },
                        ].map((w, i) => (
                            <div key={i} className="why-card" style={{ ...S.whyCard, border: `1px solid ${w.color}22` }}>
                                <div className="why-icon-box" style={{ ...S.whyIconBox, background: w.color + '15', border: `1px solid ${w.color}33` }}>
                                    <span className="why-icon-span" style={{ fontSize: '28px' }}>{w.icon}</span>
                                </div>
                                <h3 className="why-title" style={{ ...S.whyTitle, color: w.color }}>{w.title}</h3>
                                <p className="why-text" style={S.whyText}>{w.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ CTA ═══ */}
            <div className="cta-wrap" style={S.ctaWrap}>
                <div style={S.ctaBg}/>
                <div style={S.ctaContent}>
                    <h2 className="cta-title" style={S.ctaTitle}>Ready to Play? 🚀</h2>
                    <p className="cta-sub" style={S.ctaSub}>Join thousands of sports enthusiasts booking turfs on BuffTURF every day!</p>
                    <div className="cta-btns" style={S.ctaBtns}>
                        <button className="cta-btn-p" style={S.ctaBtnP} onClick={() => navigate('/turfs')}>🏟️ Find Turfs Now</button>
                        <button className="cta-btn-s" style={S.ctaBtnS} onClick={() => navigate('/register')}>Register Free →</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

const S = {
    hero: { position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' },
    bgWrap: { position: 'absolute', inset: 0, zIndex: 0 },
    bgSlide: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' },
    bgOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,10,20,0.92) 0%, rgba(5,10,20,0.7) 50%, rgba(5,10,20,0.88) 100%)' },
    bgTint: { position: 'absolute', inset: 0 },
    bgFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to bottom, transparent, #050a14)' },
    heroContent: { position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    heroInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', padding: '80px 40px 40px 40px', width: '100%', gap: '40px', flexWrap: 'wrap' },
    heroLeft: { flex: 1, minWidth: '280px' },
    tagPill: { display: 'inline-block', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '800', letterSpacing: '1px', marginBottom: '20px', textTransform: 'uppercase' },
    heroTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '80px', lineHeight: 1.0, color: '#ffffff', marginBottom: '20px', letterSpacing: '2px', textShadow: '0 4px 30px rgba(0,0,0,0.5)' },
    heroSub: { color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px', maxWidth: '460px' },
    heroBtns: { display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' },
    heroBtnP: { color: '#000', border: 'none', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.2s', whiteSpace: 'nowrap' },
    heroBtnS: { background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s', whiteSpace: 'nowrap' },
    heroStats: { display: 'flex', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', width: 'fit-content' },
    heroStat: { textAlign: 'center', padding: '14px 20px', borderRight: '1px solid rgba(255,255,255,0.06)' },
    heroStatVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '2px', margin: '0 0 2px 0' },
    heroStatLbl: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },
    heroRight: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', minWidth: '250px' },
    emojiCircle: { width: '240px', height: '240px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' },
    sportBadge: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '5px', padding: '10px 24px', borderRadius: '8px', border: '1px solid', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' },
    dots: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', paddingBottom: '24px', position: 'relative', zIndex: 1 },
    dot: { height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer', padding: 0 },
    searchWrap: { position: 'relative', zIndex: 1, padding: '0 32px 48px 32px' },
    searchBar: { maxWidth: '700px', margin: '0 auto', display: 'flex', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
    searchIcon: { fontSize: '20px', padding: '0 16px', display: 'flex', alignItems: 'center', flexShrink: 0 },
    searchInput: { flex: 1, padding: '18px 0', background: 'transparent', border: 'none', color: '#ffffff', fontSize: '15px', minWidth: 0 },
    searchBtn: { padding: '18px 24px', border: 'none', color: '#000', fontSize: '15px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' },
    section: { maxWidth: '1200px', margin: '0 auto', padding: '72px 32px' },
    secHeader: { marginBottom: '36px' },
    secTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '42px', letterSpacing: '2px', margin: '0 0 6px 0' },
    secSub: { color: '#64748b', fontSize: '15px', margin: 0 },
    sportsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
    sportCard: { borderRadius: '16px', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
    sportEmojiBox: { width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' },
    sportName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '2px', margin: '0 0 14px 0' },
    sportBookBtn: { display: 'inline-block', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.5px' },
    featuredWrap: { background: '#070d1a', padding: '72px 32px' },
    featuredHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: '1200px', margin: '0 auto 36px auto', flexWrap: 'wrap', gap: '16px' },
    seeAllBtn: { background: 'transparent', color: '#22c55e', border: '1px solid #22c55e44', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s', whiteSpace: 'nowrap' },
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
    howGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '36px' },
    howCard: { background: '#111827', borderRadius: '16px', padding: '36px 24px', border: '1px solid #1e293b', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
    howStep: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', color: '#1e293b', letterSpacing: '2px', marginBottom: '8px' },
    howTitle: { color: '#ffffff', fontSize: '18px', fontWeight: '800', marginBottom: '10px', margin: '0 0 8px 0' },
    howText: { color: '#64748b', fontSize: '14px', lineHeight: 1.7, margin: 0 },
    whyWrap: { background: '#070d1a', padding: '72px 32px' },
    whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginTop: '36px' },
    whyCard: { background: '#111827', borderRadius: '14px', padding: '28px', transition: 'all 0.2s' },
    whyIconBox: { width: '60px', height: '60px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
    whyTitle: { fontSize: '16px', fontWeight: '800', marginBottom: '8px' },
    whyText: { color: '#64748b', fontSize: '13px', lineHeight: 1.7, margin: 0 },
    ctaWrap: { position: 'relative', overflow: 'hidden', padding: '80px 32px', textAlign: 'center' },
    ctaBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0c1a3a 0%, #052e16 50%, #0c1a3a 100%)' },
    ctaContent: { position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' },
    ctaTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '56px', letterSpacing: '2px', margin: '0 0 12px 0' },
    ctaSub: { color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' },
    ctaBtns: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' },
    ctaBtnP: { background: '#22c55e', color: '#000', border: 'none', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' },
    ctaBtnS: { background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
};

export default Home;
