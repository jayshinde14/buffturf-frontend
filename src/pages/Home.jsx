// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import { searchTurfs } from '../services/api';

// function Home() {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [sportFilter, setSportFilter] = useState('');
//     const [featuredTurfs, setFeaturedTurfs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const navigate = useNavigate();

//     const slides = [
//         { sport: 'Cricket', tag: 'Book Cricket Turfs', emoji: '🏏', bg: 'linear-gradient(135deg, #1a3a1a 0%, #0d4a2d 50%, #1a5c1a 100%)', accent: '#4ade80' },
//         { sport: 'Football', tag: 'Reserve Football Pitches', emoji: '⚽', bg: 'linear-gradient(135deg, #1a1a3a 0%, #0d1a4a 50%, #1a2a5c 100%)', accent: '#60a5fa' },
//         { sport: 'Basketball', tag: 'Find Basketball Courts', emoji: '🏀', bg: 'linear-gradient(135deg, #3a1a00 0%, #4a2200 50%, #5c3000 100%)', accent: '#fb923c' },
//         { sport: 'Tennis', tag: 'Book Tennis Courts', emoji: '🎾', bg: 'linear-gradient(135deg, #1a3a00 0%, #2a4a00 50%, #3a5c00 100%)', accent: '#a3e635' },
//     ];

//     useEffect(() => {
//         loadFeaturedTurfs();
//         const interval = setInterval(() => {
//             setCurrentSlide(prev => (prev + 1) % slides.length);
//         }, 3000);
//         return () => clearInterval(interval);
//     }, []);

//     const loadFeaturedTurfs = async () => {
//         try {
//             const response = await searchTurfs('', '');
//             const data = Array.isArray(response.data) ? response.data : [];
//             setFeaturedTurfs(data.slice(0, 8));
//         } catch (err) {
//             console.error('Failed to load turfs');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = () => {
//         navigate(`/turfs?location=${searchQuery}&sportType=${sportFilter}`);
//     };

//     const sports = [
//         { name: 'Cricket', emoji: '🏏', color: '#4ade80', bg: '#052e16', tag: 'Book Cricket Turfs' },
//         { name: 'Football', emoji: '⚽', color: '#60a5fa', bg: '#0c1a3a', tag: 'Reserve Football Pitches' },
//         { name: 'Basketball', emoji: '🏀', color: '#fb923c', bg: '#3a1a00', tag: 'Find Basketball Courts' },
//         { name: 'Tennis', emoji: '🎾', color: '#a3e635', bg: '#1a3a00', tag: 'Book Tennis Courts' },
//         { name: 'Badminton', emoji: '🏸', color: '#e879f9', bg: '#2a0a3a', tag: 'Book Badminton Courts' },
//     ];

//     const getTurfColor = (sport) => {
//         const map = { Football: '#60a5fa', Cricket: '#4ade80', Basketball: '#fb923c', Badminton: '#e879f9', Tennis: '#a3e635' };
//         return map[sport] || '#94a3b8';
//     };

//     return (
//         <div style={styles.page}>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
//                 * { box-sizing: border-box; margin: 0; padding: 0; }
//                 body { background: #050a14; }
//                 .sport-card:hover { transform: translateY(-6px) scale(1.02); }
//                 .turf-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important; }
//                 .book-btn:hover { background: #16a34a !important; transform: scale(1.05); }
//                 .search-btn:hover { background: #16a34a !important; }
//                 .slide-dot { transition: all 0.3s; }
//             `}</style>

//             <Navbar />

//             {/* HERO SLIDER */}
//             <div style={{
//                 ...styles.hero,
//                 background: slides[currentSlide].bg,
//             }}>
//                 {/* Animated background pattern */}
//                 <div style={styles.heroBgPattern} />

//                 <div style={styles.heroInner}>
//                     {/* Left: Text */}
//                     <div style={styles.heroLeft}>
//                         <div style={{
//                             ...styles.heroAccentLine,
//                             backgroundColor: slides[currentSlide].accent
//                         }} />
//                         <p style={{ ...styles.heroSportTag, color: slides[currentSlide].accent }}>
//                             {slides[currentSlide].tag}
//                         </p>
//                         <h1 style={styles.heroTitle}>
//                             Your Game,<br />
//                             Your Ground.<br />
//                             <span style={{ color: slides[currentSlide].accent }}>
//                                 Book Top Turfs
//                             </span><br />
//                             Instantly.
//                         </h1>
//                         <p style={styles.heroSub}>
//                             Find and book premier Cricket, Football, Basketball,
//                             and Tennis courts in your city.
//                         </p>
//                         <button
//                             className="book-btn"
//                             style={{ ...styles.heroBtn, backgroundColor: slides[currentSlide].accent }}
//                             onClick={() => navigate('/turfs')}
//                         >
//                             Start Booking Now →
//                         </button>
//                     </div>

//                     {/* Right: Big Emoji */}
//                     <div style={styles.heroRight}>
//                         <div style={{
//                             ...styles.heroEmojiCircle,
//                             border: `3px solid ${slides[currentSlide].accent}44`,
//                             boxShadow: `0 0 60px ${slides[currentSlide].accent}22`,
//                         }}>
//                             <span style={styles.heroEmoji}>
//                                 {slides[currentSlide].emoji}
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Slide dots */}
//                 <div style={styles.slideDots}>
//                     {slides.map((_, i) => (
//                         <div
//                             key={i}
//                             className="slide-dot"
//                             onClick={() => setCurrentSlide(i)}
//                             style={{
//                                 ...styles.dot,
//                                 backgroundColor: i === currentSlide
//                                     ? slides[currentSlide].accent : '#334155',
//                                 width: i === currentSlide ? '24px' : '8px',
//                             }}
//                         />
//                     ))}
//                 </div>

//                 {/* Search Bar */}
//                 <div style={styles.heroSearch}>
//                     <input
//                         style={styles.heroSearchInput}
//                         type="text"
//                         placeholder="🔍  Enter Location or Sport..."
//                         value={searchQuery}
//                         onChange={e => setSearchQuery(e.target.value)}
//                         onKeyPress={e => e.key === 'Enter' && handleSearch()}
//                     />
//                     <button
//                         className="search-btn"
//                         style={styles.heroSearchBtn}
//                         onClick={handleSearch}
//                     >
//                         Search
//                     </button>
//                 </div>
//             </div>

//             {/* OUR SPORTS */}
//             <div style={styles.section}>
//                 <h2 style={styles.secTitle}>Our Sports</h2>
//                 <div style={styles.sportsRow}>
//                     {sports.map((s, i) => (
//                         <div
//                             key={i}
//                             className="sport-card"
//                             style={{
//                                 ...styles.sportCard,
//                                 backgroundColor: s.bg,
//                                 border: `2px solid ${s.color}33`,
//                             }}
//                             onClick={() => navigate(`/turfs?sportType=${s.name}`)}
//                         >
//                             <div style={{
//                                 ...styles.sportImgBox,
//                                 border: `2px solid ${s.color}44`,
//                                 backgroundColor: s.color + '11',
//                             }}>
//                                 <span style={styles.sportEmojiBig}>{s.emoji}</span>
//                             </div>
//                             <h3 style={{ ...styles.sportCardName, color: s.color }}>
//                                 {s.name.toUpperCase()}
//                             </h3>
//                             <button style={{
//                                 ...styles.sportBookBtn,
//                                 backgroundColor: s.color,
//                             }}>
//                                 Book Now
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* FEATURED VENUES */}
//             <div style={styles.featuredSection}>
//                 <div style={styles.featuredTitleRow}>
//                     <h2 style={styles.secTitle}>Featured Venues</h2>
//                     <button
//                         style={styles.seeAllBtn}
//                         onClick={() => navigate('/turfs')}
//                     >
//                         See all →
//                     </button>
//                 </div>

//                 {loading ? (
//                     <p style={styles.loadingText}>Loading venues...</p>
//                 ) : (
//                     <div style={styles.venuesGrid}>
//                         {featuredTurfs.map(turf => (
//                             <div
//                                 key={turf.id}
//                                 className="turf-card"
//                                 style={styles.venueCard}
//                                 onClick={() => navigate(`/turfs/${turf.id}`)}
//                             >
//                                 {/* Image area */}
//                                 <div style={{
//                                     ...styles.venueImg,
//                                     background: `linear-gradient(135deg, ${getTurfColor(turf.sportType)}22, #0f172a)`,
//                                 }}>
//                                     <span style={styles.venueEmoji}>
//                                         {turf.sportType === 'Football' ? '⚽' :
//                                          turf.sportType === 'Cricket' ? '🏏' :
//                                          turf.sportType === 'Basketball' ? '🏀' :
//                                          turf.sportType === 'Badminton' ? '🏸' :
//                                          turf.sportType === 'Tennis' ? '🎾' : '🏟️'}
//                                     </span>
//                                     <div style={{
//                                         ...styles.venueSportTag,
//                                         backgroundColor: getTurfColor(turf.sportType),
//                                     }}>
//                                         {turf.sportType}
//                                     </div>
//                                 </div>

//                                 {/* Info */}
//                                 <div style={styles.venueInfo}>
//                                     <h3 style={styles.venueName}>{turf.name}</h3>
//                                     <p style={styles.venueLocation}>
//                                         📍 {turf.location}
//                                     </p>
//                                     <p style={styles.venueAddress}>
//                                         {turf.address}
//                                     </p>
//                                     {turf.openTime && (
//                                         <p style={styles.venueTiming}>
//                                             🕐 {turf.openTime} - {turf.closeTime}
//                                         </p>
//                                     )}
//                                     <div style={styles.venueFooter}>
//                                         <span style={{
//                                             ...styles.venuePrice,
//                                             color: getTurfColor(turf.sportType)
//                                         }}>
//                                             ₹{turf.pricePerHour}/hr
//                                         </span>
//                                         <button
//                                             className="book-btn"
//                                             style={styles.venueBookBtn}
//                                             onClick={e => {
//                                                 e.stopPropagation();
//                                                 navigate(`/turfs/${turf.id}`);
//                                             }}
//                                         >
//                                             Book Now
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* WHY CHOOSE US */}
//             <div style={styles.whySection}>
//                 <h2 style={styles.secTitle}>Why Choose BuffTURF  ?</h2>
//                 <div style={styles.whyGrid}>
//                     {[
//                         { icon: '📅', title: 'Easy Booking', text: 'Book courts easily and amazing courts possible.' },
//                         { icon: '⚡', title: 'Real-Time Availability', text: 'Determines courts and ground real policies.' },
//                         { icon: '🏆', title: 'Best Venues', text: 'Best venues recommends to venues and hate sport.' },
//                         { icon: '⭐', title: 'Well Maintained', text: 'Use our Highly Maintained Turfs.' },
//                     ].map((w, i) => (
//                         <div key={i} style={styles.whyCard}>
//                             <span style={styles.whyIcon}>{w.icon}</span>
//                             <h3 style={styles.whyTitle}>{w.title}</h3>
//                             <p style={styles.whyText}>{w.text}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* FOOTER */}
//             <footer style={styles.footer}>
//                 <div style={styles.footerInner}>
//                     <div style={styles.footerBrand}>
//                         <h3 style={styles.footerLogo}>🏟️ BuffTURF</h3>
//                         <p style={styles.footerTagline}>
//                             India's #1 Sports Turf Booking Platform
//                         </p>
//                         <div style={styles.footerContact}>
//                             <p style={styles.footerContactItem}>📍 Solapur, Maharashtra</p>
//                             <p style={styles.footerContactItem}>📞 +91 7420927739</p>
//                             <p style={styles.footerContactItem}>✉️ buffturf@gmail.com</p>
//                         </div>
//                     </div>
//                     <div style={styles.footerLinks}>
//                         <h4 style={styles.footerLinksTitle}>Quick Links</h4>
//                         <p style={styles.footerLink} onClick={() => navigate('/')}>Home</p>
//                         <p style={styles.footerLink} onClick={() => navigate('/turfs')}>Find Turfs</p>
//                         <p style={styles.footerLink} onClick={() => navigate('/login')}>Login</p>
//                         <p style={styles.footerLink} onClick={() => navigate('/register')}>Register</p>
//                         <p style={styles.footerLink} onClick={() => navigate('/my-bookings')}>My Bookings</p>
//                     </div>
//                     <div style={styles.footerLinks}>
//                         <h4 style={styles.footerLinksTitle}>Sports</h4>
//                         {['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton'].map(s => (
//                             <p key={s} style={styles.footerLink}
//                                 onClick={() => navigate(`/turfs?sportType=${s}`)}>
//                                 {s}
//                             </p>
//                         ))}
//                     </div>
//                 </div>
//                 <div style={styles.footerBottom}>
//                     <p style={styles.footerCopy}>
//                         Copyright © 2026 — Made by Jay Shinde - BuffTURF Website
//                     </p>
//                 </div>
//             </footer>
//         </div>
//     );
// }

// const styles = {
//     page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },

//     // Hero
//     hero: {
//         minHeight: '92vh', position: 'relative',
//         display: 'flex', flexDirection: 'column',
//         justifyContent: 'center', overflow: 'hidden',
//         transition: 'background 0.8s ease',
//         paddingBottom: '80px',
//     },
//     heroBgPattern: {
//         position: 'absolute', inset: 0,
//         backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%)',
//         pointerEvents: 'none',
//     },
//     heroInner: {
//         display: 'flex', alignItems: 'center',
//         justifyContent: 'space-between',
//         maxWidth: '1200px', margin: '0 auto',
//         padding: '60px 40px 20px 40px',
//         width: '100%', gap: '40px', flexWrap: 'wrap',
//     },
//     heroLeft: { flex: 1, minWidth: '300px' },
//     heroAccentLine: {
//         width: '60px', height: '4px',
//         borderRadius: '2px', marginBottom: '16px',
//     },
//     heroSportTag: {
//         fontSize: '14px', fontWeight: '700',
//         letterSpacing: '3px', textTransform: 'uppercase',
//         marginBottom: '16px',
//     },
//     heroTitle: {
//         fontFamily: "'Bebas Neue', sans-serif",
//         fontSize: '72px', lineHeight: 1.05,
//         color: '#ffffff', marginBottom: '20px',
//         letterSpacing: '2px',
//     },
//     heroSub: {
//         color: '#94a3b8', fontSize: '16px',
//         lineHeight: 1.7, marginBottom: '32px',
//         maxWidth: '440px',
//     },
//     heroBtn: {
//         color: '#000000', border: 'none',
//         padding: '16px 32px', borderRadius: '6px',
//         fontSize: '15px', fontWeight: '800',
//         cursor: 'pointer', letterSpacing: '1px',
//         transition: 'all 0.2s',
//     },
//     heroRight: {
//         flex: 1, display: 'flex',
//         justifyContent: 'center', alignItems: 'center',
//         minWidth: '250px',
//     },
//     heroEmojiCircle: {
//         width: '280px', height: '280px',
//         borderRadius: '50%', display: 'flex',
//         alignItems: 'center', justifyContent: 'center',
//         backgroundColor: 'rgba(255,255,255,0.03)',
//         transition: 'all 0.8s ease',
//     },
//     heroEmoji: { fontSize: '140px', transition: 'all 0.5s' },
//     slideDots: {
//         position: 'absolute', bottom: '100px',
//         left: '50%', transform: 'translateX(-50%)',
//         display: 'flex', gap: '8px', alignItems: 'center',
//     },
//     dot: {
//         height: '8px', borderRadius: '4px',
//         cursor: 'pointer', transition: 'all 0.3s',
//     },
//     heroSearch: {
//         position: 'absolute', bottom: '32px',
//         left: '50%', transform: 'translateX(-50%)',
//         display: 'flex', gap: '0',
//         width: '90%', maxWidth: '600px',
//         boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
//     },
//     heroSearchInput: {
//         flex: 1, padding: '16px 20px',
//         border: 'none', borderRadius: '8px 0 0 8px',
//         backgroundColor: '#ffffff', color: '#0f172a',
//         fontSize: '15px', outline: 'none',
//     },
//     heroSearchBtn: {
//         padding: '16px 28px', backgroundColor: '#22c55e',
//         color: '#000', border: 'none',
//         borderRadius: '0 8px 8px 0',
//         fontSize: '15px', fontWeight: '800',
//         cursor: 'pointer', transition: 'all 0.2s',
//     },

//     // Sections
//     section: {
//         maxWidth: '1200px', margin: '0 auto',
//         padding: '60px 32px',
//     },
//     secTitle: {
//         fontFamily: "'Bebas Neue', sans-serif",
//         color: '#ffffff', fontSize: '40px',
//         letterSpacing: '2px', marginBottom: '32px',
//     },

//     // Sports
//     sportsRow: {
//         display: 'flex', gap: '16px', flexWrap: 'wrap',
//     },
//     sportCard: {
//         flex: '1', minWidth: '160px', maxWidth: '220px',
//         borderRadius: '12px', padding: '24px 16px',
//         textAlign: 'center', cursor: 'pointer',
//         transition: 'transform 0.2s ease',
//     },
//     sportImgBox: {
//         width: '100%', height: '120px',
//         borderRadius: '8px', display: 'flex',
//         alignItems: 'center', justifyContent: 'center',
//         marginBottom: '16px',
//     },
//     sportEmojiBig: { fontSize: '60px' },
//     sportCardName: {
//         fontFamily: "'Bebas Neue', sans-serif",
//         fontSize: '22px', letterSpacing: '2px',
//         marginBottom: '12px',
//     },
//     sportBookBtn: {
//         color: '#000', border: 'none',
//         padding: '8px 20px', borderRadius: '4px',
//         fontSize: '13px', fontWeight: '800',
//         cursor: 'pointer', letterSpacing: '1px',
//     },

//     // Featured
//     featuredSection: {
//         backgroundColor: '#0a0f1e',
//         padding: '60px 32px',
//     },
//     featuredTitleRow: {
//         display: 'flex', justifyContent: 'space-between',
//         alignItems: 'center', maxWidth: '1200px',
//         margin: '0 auto 32px auto',
//     },
//     seeAllBtn: {
//         backgroundColor: 'transparent', color: '#22c55e',
//         border: '1px solid #22c55e33', padding: '8px 20px',
//         borderRadius: '6px', cursor: 'pointer',
//         fontSize: '14px', fontWeight: '600',
//     },
//     venuesGrid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
//         gap: '20px', maxWidth: '1200px', margin: '0 auto',
//     },
//     venueCard: {
//         backgroundColor: '#111827', borderRadius: '12px',
//         overflow: 'hidden', cursor: 'pointer',
//         border: '1px solid #1e293b',
//         transition: 'all 0.3s ease',
//         boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
//     },
//     venueImg: {
//         height: '140px', display: 'flex',
//         alignItems: 'center', justifyContent: 'center',
//         position: 'relative',
//     },
//     venueEmoji: { fontSize: '64px' },
//     venueSportTag: {
//         position: 'absolute', top: '10px', left: '10px',
//         color: '#000', padding: '3px 10px',
//         borderRadius: '4px', fontSize: '11px', fontWeight: '800',
//         letterSpacing: '1px',
//     },
//     venueInfo: { padding: '16px' },
//     venueName: {
//         color: '#ffffff', fontSize: '16px',
//         fontWeight: '700', marginBottom: '6px',
//     },
//     venueLocation: {
//         color: '#94a3b8', fontSize: '13px', marginBottom: '3px',
//     },
//     venueAddress: {
//         color: '#64748b', fontSize: '12px', marginBottom: '3px',
//     },
//     venueTiming: {
//         color: '#64748b', fontSize: '12px', marginBottom: '12px',
//     },
//     venueFooter: {
//         display: 'flex', justifyContent: 'space-between',
//         alignItems: 'center', marginTop: '12px',
//     },
//     venuePrice: {
//         fontSize: '20px', fontWeight: '800',
//     },
//     venueBookBtn: {
//         backgroundColor: '#22c55e', color: '#000',
//         border: 'none', padding: '8px 16px',
//         borderRadius: '6px', cursor: 'pointer',
//         fontSize: '13px', fontWeight: '800',
//         transition: 'all 0.2s',
//     },
//     loadingText: {
//         color: '#94a3b8', textAlign: 'center',
//         padding: '40px', fontSize: '16px',
//     },

//     // Why
//     whySection: {
//         maxWidth: '1200px', margin: '0 auto',
//         padding: '60px 32px', textAlign: 'center',
//     },
//     whyGrid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
//         gap: '24px', marginTop: '32px',
//     },
//     whyCard: {
//         backgroundColor: '#111827', borderRadius: '12px',
//         padding: '32px 20px', border: '1px solid #1e293b',
//     },
//     whyIcon: { fontSize: '40px' },
//     whyTitle: {
//         color: '#ffffff', fontSize: '16px',
//         fontWeight: '700', margin: '12px 0 8px 0',
//     },
//     whyText: {
//         color: '#64748b', fontSize: '13px', lineHeight: 1.6,
//     },

//     // Footer
//     footer: {
//         backgroundColor: '#050a14',
//         borderTop: '1px solid #1e293b',
//         padding: '48px 32px 24px 32px',
//     },
//     footerInner: {
//         display: 'flex', gap: '48px',
//         maxWidth: '1200px', margin: '0 auto 32px auto',
//         flexWrap: 'wrap',
//     },
//     footerBrand: { flex: 2, minWidth: '220px' },
//     footerLogo: {
//         color: '#22c55e', fontSize: '24px',
//         fontFamily: "'Bebas Neue', sans-serif",
//         letterSpacing: '2px', marginBottom: '8px',
//     },
//     footerTagline: {
//         color: '#475569', fontSize: '13px', marginBottom: '16px',
//     },
//     footerContact: { marginTop: '12px' },
//     footerContactItem: {
//         color: '#64748b', fontSize: '13px', marginBottom: '6px',
//     },
//     footerLinks: { flex: 1, minWidth: '140px' },
//     footerLinksTitle: {
//         color: '#ffffff', fontSize: '14px',
//         fontWeight: '700', marginBottom: '16px',
//         letterSpacing: '1px', textTransform: 'uppercase',
//     },
//     footerLink: {
//         color: '#64748b', fontSize: '13px',
//         marginBottom: '10px', cursor: 'pointer',
//         transition: 'color 0.2s',
//     },
//     footerBottom: {
//         borderTop: '1px solid #1e293b',
//         paddingTop: '20px', textAlign: 'center',
//         maxWidth: '1200px', margin: '0 auto',
//     },
//     footerCopy: { color: '#334155', fontSize: '13px' },
// };

// export default Home;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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

                {/* Background images cycling */}
                <div style={styles.bgContainer}>
                    {slides.map((s, i) => (
                        <div key={i} style={{
                            ...styles.bgSlide,
                            backgroundImage: `url(${s.img})`,
                            opacity: i === currentSlide ? 1 : 0,
                            transition: 'opacity 1.2s ease',
                        }}/>
                    ))}
                    {/* Dark gradient overlay */}
                    <div style={styles.bgOverlay}/>
                    {/* Color tint */}
                    <div style={{
                        ...styles.bgTint,
                        background: current.color + '12',
                        transition: 'background 0.8s ease',
                    }}/>
                    {/* Bottom fade */}
                    <div style={styles.bgBottomFade}/>
                </div>

                {/* Hero Content */}
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

                            {/* Quick stats */}
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

                        {/* RIGHT — Emoji */}
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

                            {/* Sport name badge */}
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
                            {/* Glow bg */}
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
                            <h3 style={{
                                ...styles.sportName,
                                color: s.color,
                            }}>
                                {s.name}
                            </h3>
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
                                    style={{
                                        ...styles.venueCard,
                                        border: `1px solid ${color}22`,
                                    }}
                                    onClick={() => navigate(`/turfs/${turf.id}`)}
                                >
                                    {/* Card image */}
                                    <div style={{
                                        ...styles.venueImg,
                                        background: `linear-gradient(135deg, ${color}18 0%, #0a0f1a 100%)`,
                                        borderBottom: `2px solid ${color}22`,
                                    }}>
                                        <span style={{fontSize: '64px'}}>{getTurfEmoji(turf.sportType)}</span>
                                        <div style={{
                                            ...styles.venueSportBadge,
                                            background: color,
                                        }}>
                                            {turf.sportType}
                                        </div>
                                        <div style={styles.venuePriceBadge}>
                                            ₹{turf.pricePerHour}/hr
                                        </div>
                                    </div>

                                    {/* Card info */}
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
                        <div key={i} style={{
                            ...styles.whyCard,
                            border: `1px solid ${w.color}22`,
                        }}>
                            <div style={{
                                ...styles.whyIconBox,
                                background: w.color + '15',
                                border: `1px solid ${w.color}33`,
                            }}>
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
                        <button style={styles.ctaBtn} onClick={() => navigate('/turfs')}>
                            🏟️ Find Turfs Now
                        </button>
                        <button style={styles.ctaSecBtn} onClick={() => navigate('/register')}>
                            Register Free →
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== FOOTER ===== */}
            <footer style={styles.footer}>
                <div style={styles.footerInner}>
                    <div style={styles.footerBrand}>
                        <h3 style={styles.footerLogo}>🏟️ BuffTURF</h3>
                        <p style={styles.footerTagline}>India's #1 Sports Turf Booking Platform</p>
                        <div style={{marginTop: '16px'}}>
                            <p style={styles.footerContact}>📍 Solapur, Maharashtra</p>
                            <p style={styles.footerContact}>📞 +91 7420927739</p>
                            <p style={styles.footerContact}>✉️ buffturf@gmail.com</p>
                        </div>
                    </div>
                    <div style={styles.footerCol}>
                        <h4 style={styles.footerColTitle}>Quick Links</h4>
                        {[['Home','/'],['Find Turfs','/turfs'],['Login','/login'],['Register','/register'],['My Bookings','/my-bookings']].map(([label, path]) => (
                            <p key={label} className="footer-link" style={styles.footerLink} onClick={() => navigate(path)}>{label}</p>
                        ))}
                    </div>
                    <div style={styles.footerCol}>
                        <h4 style={styles.footerColTitle}>Sports</h4>
                        {['Cricket','Football','Basketball','Tennis','Badminton'].map(s => (
                            <p key={s} className="footer-link" style={styles.footerLink} onClick={() => navigate(`/turfs?sportType=${s}`)}>{s}</p>
                        ))}
                    </div>
                    <div style={styles.footerCol}>
                        <h4 style={styles.footerColTitle}>Cities</h4>
                        {['Solapur','Pune','Mumbai'].map(c => (
                            <p key={c} className="footer-link" style={styles.footerLink} onClick={() => navigate(`/turfs?location=${c}`)}>{c}</p>
                        ))}
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    <p style={styles.footerCopy}>Copyright © 2026 — Made by Jay Shinde — BuffTURF</p>
                </div>
            </footer>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },

    // HERO
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

    // SECTIONS
    section: { maxWidth: '1200px', margin: '0 auto', padding: '72px 32px' },
    secHeader: { marginBottom: '36px' },
    secTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '42px', letterSpacing: '2px', margin: '0 0 6px 0' },
    secSub: { color: '#64748b', fontSize: '15px', margin: 0 },

    // SPORTS GRID
    sportsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
    sportCard: { borderRadius: '16px', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
    sportEmojiBox: { width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' },
    sportName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '2px', margin: '0 0 14px 0' },
    sportBookBtn: { display: 'inline-block', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.5px' },

    // FEATURED
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

    // HOW IT WORKS
    howSection: { maxWidth: '1200px', margin: '0 auto', padding: '72px 32px', textAlign: 'center' },
    howGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '36px' },
    howCard: { background: '#111827', borderRadius: '16px', padding: '36px 24px', border: '1px solid #1e293b', position: 'relative' },
    howStep: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', color: '#1e293b', letterSpacing: '2px', marginBottom: '8px' },
    howTitle: { color: '#ffffff', fontSize: '18px', fontWeight: '800', marginBottom: '10px' },
    howText: { color: '#64748b', fontSize: '14px', lineHeight: 1.7 },

    // WHY
    whySection: { background: '#070d1a', padding: '72px 32px' },
    whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '36px auto 0 auto' },
    whyCard: { background: '#111827', borderRadius: '14px', padding: '28px', transition: 'all 0.2s' },
    whyIconBox: { width: '60px', height: '60px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
    whyTitle: { fontSize: '16px', fontWeight: '800', marginBottom: '8px' },
    whyText: { color: '#64748b', fontSize: '13px', lineHeight: 1.7, margin: 0 },

    // CTA
    ctaBanner: { position: 'relative', overflow: 'hidden', padding: '80px 32px', textAlign: 'center' },
    ctaBannerBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0c1a3a 0%, #052e16 50%, #0c1a3a 100%)' },
    ctaContent: { position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' },
    ctaTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '56px', letterSpacing: '2px', margin: '0 0 12px 0' },
    ctaSub: { color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' },
    ctaBtns: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' },
    ctaBtn: { background: '#22c55e', color: '#000', border: 'none', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' },
    ctaSecBtn: { background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },

    // FOOTER
    footer: { backgroundColor: '#050a14', borderTop: '1px solid #0f172a', padding: '60px 32px 24px 32px' },
    footerInner: { display: 'flex', gap: '48px', maxWidth: '1200px', margin: '0 auto 40px auto', flexWrap: 'wrap' },
    footerBrand: { flex: 2, minWidth: '220px' },
    footerLogo: { fontFamily: "'Bebas Neue', sans-serif", color: '#22c55e', fontSize: '28px', letterSpacing: '3px', marginBottom: '8px' },
    footerTagline: { color: '#475569', fontSize: '13px', marginBottom: '0' },
    footerContact: { color: '#64748b', fontSize: '13px', marginBottom: '6px' },
    footerCol: { flex: 1, minWidth: '130px' },
    footerColTitle: { color: '#ffffff', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' },
    footerLink: { color: '#64748b', fontSize: '13px', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.2s' },
    footerBottom: { borderTop: '1px solid #0f172a', paddingTop: '20px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' },
    footerCopy: { color: '#334155', fontSize: '13px' },
};

export default Home;