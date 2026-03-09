import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const { login } = useAuth();
    const navigate = useNavigate();

    const slides = [
        { sport: 'Football', emoji: '⚽', color: '#60a5fa' },
        { sport: 'Cricket', emoji: '🏏', color: '#4ade80' },
        { sport: 'Basketball', emoji: '🏀', color: '#fb923c' },
        { sport: 'Tennis', emoji: '🎾', color: '#a3e635' },
        { sport: 'Badminton', emoji: '🏸', color: '#e879f9' },
    ];

    const bgImages = [
        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80',
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&q=80',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&q=80',
        'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1600&q=80',
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&q=80',
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % slides.length);
        }, 3000);
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => { clearInterval(timer); window.removeEventListener('resize', handleResize); };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await loginUser({ username, password });
            const data = response.data;
            login({ username: data.username, email: data.email, role: data.role }, data.token);
            if (data.role === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/');
        } catch (err) {
            setError('Invalid username or password!');
        } finally {
            setLoading(false);
        }
    };

    const current = slides[activeSlide];

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input { outline: none; }
                input:focus { border-color: ${current.color} !important; box-shadow: 0 0 0 3px ${current.color}22 !important; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
                .login-btn:hover { opacity: 0.88; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
                .register-btn:hover { background: ${current.color}11 !important; }
                .sport-dot { transition: all 0.3s; cursor: pointer; }
                .sport-dot:hover { transform: scale(1.3); }
                .bg-slide { transition: opacity 1s ease; }
                .form-wrap { animation: slideUp 0.6s ease forwards; }
                .sport-emoji-main { animation: pulse 2.5s ease-in-out infinite; display: inline-block; }
            `}</style>

            {/* BACKGROUND */}
            <div style={styles.bgContainer}>
                {bgImages.map((img, i) => (
                    <div key={i} className="bg-slide" style={{
                        ...styles.bgSlide,
                        backgroundImage: `url(${img})`,
                        opacity: i === activeSlide ? 1 : 0,
                    }}/>
                ))}
                <div style={{ ...styles.overlay, background: `linear-gradient(135deg, rgba(5,10,20,0.88) 0%, rgba(5,10,20,0.65) 50%, rgba(5,10,20,0.95) 100%)` }}/>
                <div style={{ ...styles.colorTint, background: current.color + '15', transition: 'background 0.8s ease' }}/>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ ...styles.content, flexDirection: isMobile ? 'column' : 'row', padding: isMobile ? '24px 16px' : '40px', gap: isMobile ? '24px' : '60px', alignItems: isMobile ? 'stretch' : 'center' }}>

                {/* LEFT — Branding (hidden on mobile, show mini version) */}
                {!isMobile ? (
                    <div style={styles.leftSide}>
                        <div style={styles.logo}>
                            <span style={styles.logoEmoji}>🏟️</span>
                            <span style={styles.logoText}>BuffTURF</span>
                        </div>
                        <div style={styles.heroSection}>
                            <div style={{ ...styles.emojiCircle, border: `3px solid ${current.color}55`, boxShadow: `0 0 80px ${current.color}33`, transition: 'all 0.6s ease' }}>
                                <span className="sport-emoji-main" style={{ fontSize: '90px' }}>{current.emoji}</span>
                            </div>
                            <h1 style={{ ...styles.heroTitle, color: current.color, transition: 'color 0.5s ease' }}>{current.sport}</h1>
                            <p style={styles.heroSub}>India's #1 Sports Turf Booking Platform</p>
                        </div>
                        <div style={styles.dotsRow}>
                            {slides.map((s, i) => (
                                <button key={i} className="sport-dot" onClick={() => setActiveSlide(i)} style={{ ...styles.dot, background: i === activeSlide ? s.color : 'rgba(255,255,255,0.2)', width: i === activeSlide ? '32px' : '10px', boxShadow: i === activeSlide ? `0 0 10px ${s.color}` : 'none' }}/>
                            ))}
                        </div>
                        <div style={styles.statsRow}>
                            {[{ val: '14+', label: 'Turfs' }, { val: '5', label: 'Sports' }, { val: '3', label: 'Cities' }, { val: '24/7', label: 'Booking' }].map((s, i) => (
                                <div key={i} style={styles.statItem}>
                                    <p style={{ ...styles.statVal, color: current.color }}>{s.val}</p>
                                    <p style={styles.statLabel}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* MOBILE TOP HEADER */
                    <div style={styles.mobileHeader}>
                        <div style={styles.logo}>
                            <span style={styles.logoEmoji}>🏟️</span>
                            <span style={styles.logoText}>BuffTURF</span>
                        </div>
                        <div style={styles.mobileEmoji}>
                            <span className="sport-emoji-main" style={{ fontSize: '48px' }}>{current.emoji}</span>
                            <span style={{ ...styles.mobileSportName, color: current.color }}>{current.sport}</span>
                        </div>
                    </div>
                )}

                {/* RIGHT — Login Form */}
                <div style={{ ...styles.rightSide, width: isMobile ? '100%' : '420px' }}>
                    <div className="form-wrap" style={styles.glassCard}>

                        <div style={{ ...styles.cardAccent, background: `linear-gradient(90deg, ${current.color}, ${current.color}44)`, transition: 'background 0.5s ease' }}/>

                        <div style={styles.cardHeader}>
                            <h2 style={styles.cardTitle}>Welcome Back 👋</h2>
                            <p style={styles.cardSub}>Sign in to book your turf</p>
                        </div>

                        {/* Sport pills */}
                        <div style={styles.pillsRow}>
                            {slides.map((s, i) => (
                                <button key={i} onClick={() => setActiveSlide(i)} style={{ ...styles.pill, background: i === activeSlide ? s.color + '22' : 'transparent', border: `1px solid ${i === activeSlide ? s.color + '66' : 'rgba(255,255,255,0.1)'}`, transform: i === activeSlide ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s' }}>
                                    {s.emoji}
                                </button>
                            ))}
                        </div>

                        {error && <div style={styles.errorBox}>❌ {error}</div>}

                        <form onSubmit={handleLogin}>
                            <div style={styles.field}>
                                <label style={styles.label}>Username</label>
                                <div style={{ ...styles.inputBox, borderColor: username ? current.color + '88' : 'rgba(255,255,255,0.1)' }}>
                                    <span style={styles.inputIcon}>👤</span>
                                    <input style={styles.input} type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} required/>
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Password</label>
                                <div style={{ ...styles.inputBox, borderColor: password ? current.color + '88' : 'rgba(255,255,255,0.1)' }}>
                                    <span style={styles.inputIcon}>🔒</span>
                                    <input style={styles.input} type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required/>
                                </div>
                            </div>

                            <button className="login-btn" type="submit" disabled={loading} style={{ ...styles.loginBtn, background: loading ? '#334155' : `linear-gradient(135deg, ${current.color} 0%, ${current.color}bb 100%)`, cursor: loading ? 'not-allowed' : 'pointer' }}>
                                {loading ? '⏳ Logging in...' : '🚀 Login to BuffTURF'}
                            </button>
                        </form>

                        <div style={styles.divider}>
                            <div style={styles.divLine}/>
                            <span style={styles.divText}>New here?</span>
                            <div style={styles.divLine}/>
                        </div>

                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <button className="register-btn" style={{ ...styles.registerBtn, border: `1.5px solid ${current.color}44`, color: current.color }}>
                                🏟️ Create Free Account
                            </button>
                        </Link>

                        <p style={styles.backHome}>
                            <Link to="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>← Back to Home</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', fontFamily: "'Barlow', sans-serif", position: 'relative', overflow: 'hidden' },
    bgContainer: { position: 'fixed', inset: 0, zIndex: 0 },
    bgSlide: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' },
    overlay: { position: 'absolute', inset: 0 },
    colorTint: { position: 'absolute', inset: 0 },
    content: { position: 'relative', zIndex: 1, display: 'flex', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' },

    // MOBILE HEADER
    mobileHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px' },
    mobileEmoji: { display: 'flex', alignItems: 'center', gap: '10px' },
    mobileSportName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '3px' },

    // LEFT
    leftSide: { flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' },
    logo: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoEmoji: { fontSize: '28px' },
    logoText: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '28px', letterSpacing: '4px' },
    heroSection: { textAlign: 'center' },
    emojiCircle: { width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' },
    heroTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', letterSpacing: '5px', margin: '0 0 8px 0' },
    heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: '15px', margin: 0 },
    dotsRow: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' },
    dot: { height: '10px', borderRadius: '5px', border: 'none', padding: 0 },
    statsRow: { display: 'flex', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' },
    statItem: { flex: 1, textAlign: 'center', padding: '16px 8px', borderRight: '1px solid rgba(255,255,255,0.08)' },
    statVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '2px', margin: '0 0 2px 0' },
    statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },

    // RIGHT
    rightSide: { flexShrink: 0 },
    glassCard: { background: 'rgba(5, 8, 18, 0.75)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' },
    cardAccent: { height: '4px', width: '100%' },
    cardHeader: { padding: '24px 24px 0 24px', marginBottom: '16px' },
    cardTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '32px', letterSpacing: '2px', margin: '0 0 4px 0' },
    cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 },
    pillsRow: { display: 'flex', gap: '8px', padding: '0 24px', marginBottom: '16px', flexWrap: 'wrap' },
    pill: { fontSize: '20px', padding: '7px 11px', borderRadius: '10px', cursor: 'pointer' },
    errorBox: { margin: '0 24px 16px 24px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', fontSize: '14px' },
    field: { padding: '0 24px', marginBottom: '14px' },
    label: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '7px' },
    inputBox: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0 14px' },
    inputIcon: { fontSize: '16px', marginRight: '10px', flexShrink: 0 },
    input: { flex: 1, padding: '14px 0', background: 'transparent', border: 'none', color: '#ffffff', fontSize: '15px', width: '100%' },
    loginBtn: { display: 'block', width: 'calc(100% - 48px)', margin: '8px 24px 0 24px', padding: '15px', border: 'none', borderRadius: '12px', color: '#000', fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px' },
    divider: { display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 24px 0 24px' },
    divLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' },
    divText: { color: 'rgba(255,255,255,0.3)', fontSize: '12px', whiteSpace: 'nowrap' },
    registerBtn: { display: 'block', width: 'calc(100% - 48px)', margin: '12px 24px 0 24px', padding: '13px', background: 'transparent', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
    backHome: { textAlign: 'center', padding: '14px 24px 22px 24px', margin: 0 },
};

export default Login;
