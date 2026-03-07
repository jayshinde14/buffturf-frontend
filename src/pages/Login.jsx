// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../services/api';
// import { useAuth } from '../context/AuthContext';

// function Login() {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [activeSlide, setActiveSlide] = useState(0);

//     const { login } = useAuth();
//     const navigate = useNavigate();

//     const slides = [
//         { sport: 'Cricket', emoji: '🏏', color: '#4ade80', bg: '#052e16', tagline: 'Book your cricket ground instantly' },
//         { sport: 'Football', emoji: '⚽', color: '#60a5fa', bg: '#0c1a3a', tagline: 'Find the perfect football turf' },
//         { sport: 'Basketball', emoji: '🏀', color: '#fb923c', bg: '#3a1200', tagline: 'Reserve your basketball court' },
//         { sport: 'Tennis', emoji: '🎾', color: '#a3e635', bg: '#1a3a00', tagline: 'Smash it on the tennis court' },
//         { sport: 'Badminton', emoji: '🏸', color: '#e879f9', bg: '#2a0a3a', tagline: 'Shuttle to victory on your court' },
//     ];

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setActiveSlide(prev => (prev + 1) % slides.length);
//         }, 2500);
//         return () => clearInterval(timer);
//     }, []);

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         try {
//             const response = await loginUser({ username, password });
//             const data = response.data;
//             login({ username: data.username, email: data.email, role: data.role }, data.token);
//             if (data.role === 'ADMIN') navigate('/admin/dashboard');
//             else navigate('/turfs');
//         } catch (err) {
//             setError('Invalid username or password!');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const current = slides[activeSlide];

//     return (
//         <div style={styles.page}>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
//                 * { box-sizing: border-box; }
//                 input { outline: none; }
//                 input:focus { border-color: ${current.color} !important; box-shadow: 0 0 0 3px ${current.color}22 !important; }
//                 .login-btn:hover { opacity: 0.88; transform: translateY(-1px); }
//                 .sport-dot:hover { transform: scale(1.3); }
//                 @keyframes floatUp { 0% { transform: translateY(0px) rotate(0deg); opacity: 0.6; } 50% { opacity: 1; } 100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }
//                 @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//                 @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
//                 .sport-emoji { animation: pulse 2s ease-in-out infinite; }
//                 .form-card { animation: fadeSlide 0.5s ease forwards; }
//             `}</style>

//             <div style={styles.container}>

//                 {/* LEFT PANEL */}
//                 <div style={{
//                     ...styles.leftPanel,
//                     background: `linear-gradient(135deg, ${current.bg} 0%, #050a14 100%)`,
//                     transition: 'background 0.8s ease',
//                 }}>
//                     {/* Floating emojis background */}
//                     <div style={styles.floatingBg}>
//                         {['⚽','🏏','🏀','🎾','🏸','⚽','🏏','🏀','🎾','🏸'].map((e, i) => (
//                             <span key={i} style={{
//                                 position: 'absolute',
//                                 fontSize: `${20 + (i % 3) * 10}px`,
//                                 left: `${(i * 10) % 90}%`,
//                                 bottom: '-50px',
//                                 opacity: 0.15,
//                                 animation: `floatUp ${6 + i}s linear ${i * 0.8}s infinite`,
//                             }}>{e}</span>
//                         ))}
//                     </div>

//                     {/* Logo */}
//                     <div style={styles.logoArea}>
//                         <span style={styles.logoIcon}>🏟️</span>
//                         <span style={styles.logoText}>BuffTURF</span>
//                     </div>

//                     {/* Main Sport Display */}
//                     <div style={styles.sportDisplay}>
//                         <div style={{
//                             ...styles.sportCircle,
//                             background: current.color + '18',
//                             border: `3px solid ${current.color}44`,
//                             boxShadow: `0 0 60px ${current.color}33`,
//                             transition: 'all 0.5s ease',
//                         }}>
//                             <span className="sport-emoji" style={{fontSize: '100px'}}>
//                                 {current.emoji}
//                             </span>
//                         </div>
//                         <h2 style={{
//                             ...styles.sportName,
//                             color: current.color,
//                             transition: 'color 0.5s ease',
//                         }}>
//                             {current.sport}
//                         </h2>
//                         <p style={styles.sportTagline}>{current.tagline}</p>
//                     </div>

//                     {/* Sport Dots */}
//                     <div style={styles.dotsRow}>
//                         {slides.map((s, i) => (
//                             <button
//                                 key={i}
//                                 className="sport-dot"
//                                 onClick={() => setActiveSlide(i)}
//                                 style={{
//                                     ...styles.dot,
//                                     background: i === activeSlide ? s.color : '#334155',
//                                     width: i === activeSlide ? '28px' : '10px',
//                                     transition: 'all 0.3s ease',
//                                 }}
//                             />
//                         ))}
//                     </div>

//                     {/* Stats */}
//                     <div style={styles.statsRow}>
//                         {[
//                             { val: '14+', label: 'Turfs' },
//                             { val: '5', label: 'Sports' },
//                             { val: '3', label: 'Cities' },
//                         ].map((s, i) => (
//                             <div key={i} style={styles.statBox}>
//                                 <p style={{...styles.statVal, color: current.color}}>{s.val}</p>
//                                 <p style={styles.statLabel}>{s.label}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* RIGHT PANEL - Login Form */}
//                 <div style={styles.rightPanel}>
//                     <div className="form-card" style={styles.formCard}>

//                         {/* Header */}
//                         <div style={styles.formHeader}>
//                             <h1 style={styles.formTitle}>Welcome Back! 👋</h1>
//                             <p style={styles.formSub}>Login to book your turf</p>
//                         </div>

//                         {/* Sport Pills */}
//                         <div style={styles.sportPills}>
//                             {slides.map((s, i) => (
//                                 <span key={i} style={{
//                                     ...styles.pill,
//                                     background: i === activeSlide ? s.color + '22' : 'transparent',
//                                     color: i === activeSlide ? s.color : '#475569',
//                                     border: `1px solid ${i === activeSlide ? s.color + '44' : '#1e293b'}`,
//                                     transition: 'all 0.3s',
//                                 }}>
//                                     {s.emoji}
//                                 </span>
//                             ))}
//                         </div>

//                         {/* Error */}
//                         {error && (
//                             <div style={styles.errorBox}>
//                                 ❌ {error}
//                             </div>
//                         )}

//                         {/* Form */}
//                         <form onSubmit={handleLogin} style={styles.form}>
//                             <div style={styles.field}>
//                                 <label style={styles.label}>Username</label>
//                                 <div style={{
//                                     ...styles.inputWrapper,
//                                     borderColor: username ? current.color + '66' : '#334155',
//                                 }}>
//                                     <span style={styles.inputIcon}>👤</span>
//                                     <input
//                                         style={styles.input}
//                                         type="text"
//                                         placeholder="Enter your username"
//                                         value={username}
//                                         onChange={e => setUsername(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <div style={styles.field}>
//                                 <label style={styles.label}>Password</label>
//                                 <div style={{
//                                     ...styles.inputWrapper,
//                                     borderColor: password ? current.color + '66' : '#334155',
//                                 }}>
//                                     <span style={styles.inputIcon}>🔒</span>
//                                     <input
//                                         style={styles.input}
//                                         type="password"
//                                         placeholder="Enter your password"
//                                         value={password}
//                                         onChange={e => setPassword(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <button
//                                 className="login-btn"
//                                 type="submit"
//                                 disabled={loading}
//                                 style={{
//                                     ...styles.loginBtn,
//                                     background: loading
//                                         ? '#334155'
//                                         : `linear-gradient(135deg, ${current.color}, ${current.color}bb)`,
//                                     transition: 'all 0.3s ease',
//                                     cursor: loading ? 'not-allowed' : 'pointer',
//                                 }}
//                             >
//                                 {loading ? '⏳ Logging in...' : `🚀 Login to BuffTURF`}
//                             </button>
//                         </form>

//                         {/* Divider */}
//                         <div style={styles.divider}>
//                             <div style={styles.dividerLine}/>
//                             <span style={styles.dividerText}>New to BuffTURF?</span>
//                             <div style={styles.dividerLine}/>
//                         </div>

//                         {/* Register Link */}
//                         <Link to="/register" style={{textDecoration: 'none'}}>
//                             <button style={{
//                                 ...styles.registerBtn,
//                                 border: `2px solid ${current.color}44`,
//                                 color: current.color,
//                                 transition: 'all 0.3s',
//                             }}>
//                                 🏟️ Create Free Account
//                             </button>
//                         </Link>

//                         {/* Back to home */}
//                         <p style={styles.backHome}>
//                             <Link to="/" style={{color: '#475569', fontSize: '13px', textDecoration: 'none'}}>
//                                 ← Back to Home
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// const styles = {
//     page: {
//         minHeight: '100vh',
//         backgroundColor: '#050a14',
//         fontFamily: "'Barlow', sans-serif",
//     },
//     container: {
//         display: 'flex',
//         minHeight: '100vh',
//     },

//     // LEFT
//     leftPanel: {
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '40px',
//         position: 'relative',
//         overflow: 'hidden',
//         minHeight: '100vh',
//     },
//     floatingBg: {
//         position: 'absolute',
//         inset: 0,
//         pointerEvents: 'none',
//         overflow: 'hidden',
//     },
//     logoArea: {
//         position: 'absolute',
//         top: '32px',
//         left: '32px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '10px',
//     },
//     logoIcon: { fontSize: '28px' },
//     logoText: {
//         fontFamily: "'Bebas Neue', sans-serif",
//         color: '#ffffff',
//         fontSize: '28px',
//         letterSpacing: '3px',
//     },
//     sportDisplay: {
//         textAlign: 'center',
//         marginBottom: '32px',
//         zIndex: 1,
//     },
//     sportCircle: {
//         width: '200px',
//         height: '200px',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         margin: '0 auto 24px auto',
//     },
//     sportName: {
//         fontFamily: "'Bebas Neue', sans-serif",
//         fontSize: '48px',
//         letterSpacing: '4px',
//         margin: '0 0 8px 0',
//     },
//     sportTagline: {
//         color: '#64748b',
//         fontSize: '15px',
//         margin: 0,
//     },
//     dotsRow: {
//         display: 'flex',
//         gap: '8px',
//         alignItems: 'center',
//         marginBottom: '40px',
//         zIndex: 1,
//     },
//     dot: {
//         height: '10px',
//         borderRadius: '5px',
//         border: 'none',
//         cursor: 'pointer',
//         padding: 0,
//     },
//     statsRow: {
//         display: 'flex',
//         gap: '32px',
//         zIndex: 1,
//     },
//     statBox: { textAlign: 'center' },
//     statVal: {
//         fontFamily: "'Bebas Neue', sans-serif",
//         fontSize: '32px',
//         letterSpacing: '2px',
//         margin: '0 0 2px 0',
//     },
//     statLabel: {
//         color: '#475569',
//         fontSize: '12px',
//         textTransform: 'uppercase',
//         letterSpacing: '1px',
//         margin: 0,
//     },

//     // RIGHT
//     rightPanel: {
//         width: '480px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '40px 32px',
//         background: '#0a0f1a',
//         borderLeft: '1px solid #1e293b',
//     },
//     formCard: {
//         width: '100%',
//         maxWidth: '400px',
//     },
//     formHeader: {
//         marginBottom: '24px',
//     },
//     formTitle: {
//         fontFamily: "'Bebas Neue', sans-serif",
//         color: '#ffffff',
//         fontSize: '36px',
//         letterSpacing: '2px',
//         margin: '0 0 6px 0',
//     },
//     formSub: {
//         color: '#64748b',
//         fontSize: '14px',
//         margin: 0,
//     },
//     sportPills: {
//         display: 'flex',
//         gap: '8px',
//         marginBottom: '24px',
//         flexWrap: 'wrap',
//     },
//     pill: {
//         padding: '6px 12px',
//         borderRadius: '20px',
//         fontSize: '18px',
//         cursor: 'default',
//     },
//     errorBox: {
//         background: '#1a0808',
//         border: '1px solid #ef444444',
//         color: '#ef4444',
//         padding: '12px 16px',
//         borderRadius: '8px',
//         marginBottom: '20px',
//         fontSize: '14px',
//     },
//     form: { marginBottom: '20px' },
//     field: { marginBottom: '18px' },
//     label: {
//         color: '#94a3b8',
//         fontSize: '12px',
//         fontWeight: '700',
//         textTransform: 'uppercase',
//         letterSpacing: '0.5px',
//         display: 'block',
//         marginBottom: '8px',
//     },
//     inputWrapper: {
//         display: 'flex',
//         alignItems: 'center',
//         background: '#111827',
//         border: '1.5px solid #334155',
//         borderRadius: '10px',
//         padding: '0 14px',
//         transition: 'border-color 0.2s',
//     },
//     inputIcon: { fontSize: '16px', marginRight: '10px', flexShrink: 0 },
//     input: {
//         flex: 1,
//         padding: '14px 0',
//         background: 'transparent',
//         border: 'none',
//         color: '#ffffff',
//         fontSize: '15px',
//     },
//     loginBtn: {
//         width: '100%',
//         padding: '15px',
//         border: 'none',
//         borderRadius: '10px',
//         color: '#000',
//         fontSize: '16px',
//         fontWeight: '800',
//         letterSpacing: '0.5px',
//         marginTop: '8px',
//     },
//     divider: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '12px',
//         marginBottom: '16px',
//     },
//     dividerLine: {
//         flex: 1,
//         height: '1px',
//         background: '#1e293b',
//     },
//     dividerText: {
//         color: '#475569',
//         fontSize: '13px',
//         whiteSpace: 'nowrap',
//     },
//     registerBtn: {
//         width: '100%',
//         padding: '13px',
//         background: 'transparent',
//         borderRadius: '10px',
//         fontSize: '15px',
//         fontWeight: '700',
//         cursor: 'pointer',
//         marginBottom: '20px',
//     },
//     backHome: {
//         textAlign: 'center',
//         margin: 0,
//     },
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    const { login } = useAuth();
    const navigate = useNavigate();

    const slides = [
        { sport: 'Football', emoji: '⚽', color: '#60a5fa' },
        { sport: 'Cricket', emoji: '🏏', color: '#4ade80' },
        { sport: 'Basketball', emoji: '🏀', color: '#fb923c' },
        { sport: 'Tennis', emoji: '🎾', color: '#a3e635' },
        { sport: 'Badminton', emoji: '🏸', color: '#e879f9' },
    ];

    // Unsplash sports turf images — free, no API key needed
   const bgImages = [
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80', // football field night
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&q=80', // 🏏 Cricket field
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&q=80', // basketball court
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1600&q=80', // tennis court
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&q=80', // 🏸 Badminton court
];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(timer);
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
            else navigate('/turfs');
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
                @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
                .login-btn:hover { opacity: 0.88; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
                .register-btn:hover { background: ${current.color}11 !important; }
                .sport-dot { transition: all 0.3s; cursor: pointer; }
                .sport-dot:hover { transform: scale(1.3); }
                .bg-slide { transition: opacity 1s ease; }
                .form-wrap { animation: slideUp 0.6s ease forwards; }
                .sport-emoji-main { animation: pulse 2.5s ease-in-out infinite; display: inline-block; }
            `}</style>

            {/* BACKGROUND IMAGES — cycling */}
            <div style={styles.bgContainer}>
                {bgImages.map((img, i) => (
                    <div
                        key={i}
                        className="bg-slide"
                        style={{
                            ...styles.bgSlide,
                            backgroundImage: `url(${img})`,
                            opacity: i === activeSlide ? 1 : 0,
                        }}
                    />
                ))}
                {/* Dark overlay */}
                <div style={{
                    ...styles.overlay,
                    background: `linear-gradient(135deg, rgba(5,10,20,0.85) 0%, rgba(5,10,20,0.6) 50%, rgba(5,10,20,0.92) 100%)`,
                }}/>
                {/* Sport color tint */}
                <div style={{
                    ...styles.colorTint,
                    background: current.color + '15',
                    transition: 'background 0.8s ease',
                }}/>
            </div>

            {/* MAIN CONTENT */}
            <div style={styles.content}>

                {/* LEFT — Branding */}
                <div style={styles.leftSide}>

                    {/* Logo */}
                    <div style={styles.logo}>
                        <span style={styles.logoEmoji}>🏟️</span>
                        <span style={styles.logoText}>BuffTURF</span>
                    </div>

                    {/* Big Sport Emoji */}
                    <div style={styles.heroSection}>
                        <div style={{
                            ...styles.emojiCircle,
                            border: `3px solid ${current.color}55`,
                            boxShadow: `0 0 80px ${current.color}33, 0 0 160px ${current.color}11`,
                            transition: 'all 0.6s ease',
                        }}>
                            <span className="sport-emoji-main" style={{fontSize: '90px'}}>
                                {current.emoji}
                            </span>
                        </div>

                        <h1 style={{
                            ...styles.heroTitle,
                            color: current.color,
                            transition: 'color 0.5s ease',
                        }}>
                            {current.sport}
                        </h1>
                        <p style={styles.heroSub}>
                            India's #1 Sports Turf Booking Platform
                        </p>
                    </div>

                    {/* Sport switcher dots */}
                    <div style={styles.dotsRow}>
                        {slides.map((s, i) => (
                            <button
                                key={i}
                                className="sport-dot"
                                onClick={() => setActiveSlide(i)}
                                style={{
                                    ...styles.dot,
                                    background: i === activeSlide ? s.color : 'rgba(255,255,255,0.2)',
                                    width: i === activeSlide ? '32px' : '10px',
                                    boxShadow: i === activeSlide ? `0 0 10px ${s.color}` : 'none',
                                }}
                            />
                        ))}
                    </div>

                    {/* Stats */}
                    <div style={styles.statsRow}>
                        {[
                            { val: '14+', label: 'Turfs' },
                            { val: '5', label: 'Sports' },
                            { val: '3', label: 'Cities' },
                            { val: '24/7', label: 'Booking' },
                        ].map((s, i) => (
                            <div key={i} style={styles.statItem}>
                                <p style={{...styles.statVal, color: current.color}}>{s.val}</p>
                                <p style={styles.statLabel}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT — Login Form */}
                <div style={styles.rightSide}>
                    <div className="form-wrap" style={styles.glassCard}>

                        {/* Card top accent */}
                        <div style={{
                            ...styles.cardAccent,
                            background: `linear-gradient(90deg, ${current.color}, ${current.color}44)`,
                            transition: 'background 0.5s ease',
                        }}/>

                        {/* Header */}
                        <div style={styles.cardHeader}>
                            <h2 style={styles.cardTitle}>Welcome Back 👋</h2>
                            <p style={styles.cardSub}>Sign in to book your turf</p>
                        </div>

                        {/* Sport pills */}
                        <div style={styles.pillsRow}>
                            {slides.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveSlide(i)}
                                    style={{
                                        ...styles.pill,
                                        background: i === activeSlide ? s.color + '22' : 'transparent',
                                        border: `1px solid ${i === activeSlide ? s.color + '66' : 'rgba(255,255,255,0.1)'}`,
                                        transform: i === activeSlide ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {s.emoji}
                                </button>
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={styles.errorBox}>
                                ❌ {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin}>
                            <div style={styles.field}>
                                <label style={styles.label}>Username</label>
                                <div style={{
                                    ...styles.inputBox,
                                    borderColor: username ? current.color + '88' : 'rgba(255,255,255,0.1)',
                                    transition: 'border-color 0.2s',
                                }}>
                                    <span style={styles.inputIcon}>👤</span>
                                    <input
                                        style={styles.input}
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Password</label>
                                <div style={{
                                    ...styles.inputBox,
                                    borderColor: password ? current.color + '88' : 'rgba(255,255,255,0.1)',
                                    transition: 'border-color 0.2s',
                                }}>
                                    <span style={styles.inputIcon}>🔒</span>
                                    <input
                                        style={styles.input}
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                className="login-btn"
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...styles.loginBtn,
                                    background: loading ? '#334155' : `linear-gradient(135deg, ${current.color} 0%, ${current.color}bb 100%)`,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {loading ? '⏳ Logging in...' : '🚀 Login to BuffTURF'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={styles.divider}>
                            <div style={styles.divLine}/>
                            <span style={styles.divText}>New here?</span>
                            <div style={styles.divLine}/>
                        </div>

                        {/* Register */}
                        <Link to="/register" style={{textDecoration: 'none'}}>
                            <button
                                className="register-btn"
                                style={{
                                    ...styles.registerBtn,
                                    border: `1.5px solid ${current.color}44`,
                                    color: current.color,
                                    transition: 'all 0.3s',
                                }}
                            >
                                🏟️ Create Free Account
                            </button>
                        </Link>

                        <p style={styles.backHome}>
                            <Link to="/" style={{color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none'}}>
                                ← Back to Home
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        fontFamily: "'Barlow', sans-serif",
        position: 'relative',
        overflow: 'hidden',
    },
    bgContainer: {
        position: 'fixed',
        inset: 0,
        zIndex: 0,
    },
    bgSlide: {
        position: 'absolute',
        inset: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    overlay: {
        position: 'absolute',
        inset: 0,
    },
    colorTint: {
        position: 'absolute',
        inset: 0,
    },
    content: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        padding: '40px',
        gap: '60px',
        maxWidth: '1200px',
        margin: '0 auto',
    },

    // LEFT
    leftSide: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    logoEmoji: { fontSize: '32px' },
    logoText: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff',
        fontSize: '32px',
        letterSpacing: '4px',
        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
    },
    heroSection: { textAlign: 'center' },
    emojiCircle: {
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto',
    },
    heroTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '56px',
        letterSpacing: '5px',
        margin: '0 0 8px 0',
        textShadow: '0 4px 30px rgba(0,0,0,0.5)',
    },
    heroSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '15px',
        margin: 0,
    },
    dotsRow: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        height: '10px',
        borderRadius: '5px',
        border: 'none',
        padding: 0,
    },
    statsRow: {
        display: 'flex',
        gap: '0',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    statItem: {
        flex: 1,
        textAlign: 'center',
        padding: '16px 8px',
        borderRight: '1px solid rgba(255,255,255,0.08)',
    },
    statVal: {
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '28px',
        letterSpacing: '2px',
        margin: '0 0 2px 0',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        margin: 0,
    },

    // RIGHT — Glass Card
    rightSide: {
        width: '420px',
        flexShrink: 0,
    },
    // glassCard: {
    //     background: 'rgba(10, 15, 30, 0.75)',
    //     backdropFilter: 'blur(30px)',
    //     borderRadius: '20px',
    //     border: '1px solid rgba(255,255,255,0.1)',
    //     overflow: 'hidden',
    //     boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
    // },
    glassCard: {
    background: 'rgba(5, 8, 18, 0.55)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.07)',
    overflow: 'hidden',
    boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
},
    cardAccent: {
        height: '4px',
        width: '100%',
    },
    cardHeader: {
        padding: '28px 28px 0 28px',
        marginBottom: '16px',
    },
    cardTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff',
        fontSize: '34px',
        letterSpacing: '2px',
        margin: '0 0 4px 0',
    },
    cardSub: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: '14px',
        margin: 0,
    },
    pillsRow: {
        display: 'flex',
        gap: '8px',
        padding: '0 28px',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    pill: {
        fontSize: '20px',
        padding: '8px 12px',
        borderRadius: '10px',
        cursor: 'pointer',
        background: 'transparent',
    },
    errorBox: {
        margin: '0 28px 16px 28px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#ef4444',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '14px',
    },
    field: {
        padding: '0 28px',
        marginBottom: '16px',
    },
    label: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        display: 'block',
        marginBottom: '8px',
    },
    inputBox: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.06)',
        border: '1.5px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '0 14px',
    },
    inputIcon: {
        fontSize: '16px',
        marginRight: '10px',
        flexShrink: 0,
    },
    input: {
        flex: 1,
        padding: '14px 0',
        background: 'transparent',
        border: 'none',
        color: '#ffffff',
        fontSize: '15px',
    },
    loginBtn: {
        display: 'block',
        width: 'calc(100% - 56px)',
        margin: '8px 28px 0 28px',
        padding: '15px',
        border: 'none',
        borderRadius: '12px',
        color: '#000',
        fontSize: '16px',
        fontWeight: '800',
        letterSpacing: '0.5px',
        transition: 'all 0.3s ease',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 28px 0 28px',
    },
    divLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
    },
    divText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: '12px',
        whiteSpace: 'nowrap',
    },
    registerBtn: {
        display: 'block',
        width: 'calc(100% - 56px)',
        margin: '12px 28px 0 28px',
        padding: '13px',
        background: 'transparent',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    backHome: {
        textAlign: 'center',
        padding: '16px 28px 24px 28px',
        margin: 0,
    },
};

export default Login;