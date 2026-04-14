// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { register } from '../services/api';
// import { useAuth } from '../context/AuthContext';

// // ─── Validation helpers ──────────────────────────────────────────────────────
// const validate = {
//     username: (v) => {
//         if (!v) return 'Username is required';
//         if (v.length < 3) return 'Username must be at least 3 characters';
//         if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'Only letters, numbers, and underscore (_) allowed';
//         return '';
//     },
//     email: (v) => {
//         if (!v) return 'Email is required';
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address';
//         return '';
//     },
//     password: (v) => {
//         if (!v) return 'Password is required';
//         if (v.length < 6) return 'Password must be at least 6 characters';
//         return '';
//     },
//     confirmPassword: (v, password) => {
//         if (!v) return 'Please confirm your password';
//         if (v !== password) return 'Passwords do not match';
//         return '';
//     },
// };
// // ─────────────────────────────────────────────────────────────────────────────

// function Register() {
//     const navigate = useNavigate();
//     const { login: authLogin } = useAuth();

//     const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
//     const [errors, setErrors] = useState({});
//     const [touched, setTouched] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [serverError, setServerError] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prev => ({ ...prev, [name]: value }));
//         if (touched[name]) {
//             const err = name === 'confirmPassword'
//                 ? validate.confirmPassword(value, name === 'password' ? value : form.password)
//                 : validate[name]?.(value) || '';
//             setErrors(prev => ({ ...prev, [name]: err }));
//         }
//         // Re-validate confirmPassword when password changes
//         if (name === 'password' && touched.confirmPassword) {
//             setErrors(prev => ({ ...prev, confirmPassword: validate.confirmPassword(form.confirmPassword, value) }));
//         }
//     };

//     const handleBlur = (e) => {
//         const { name, value } = e.target;
//         setTouched(prev => ({ ...prev, [name]: true }));
//         const err = name === 'confirmPassword'
//             ? validate.confirmPassword(value, form.password)
//             : validate[name]?.(value) || '';
//         setErrors(prev => ({ ...prev, [name]: err }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // Touch all fields
//         const allTouched = { username: true, email: true, password: true, confirmPassword: true };
//         setTouched(allTouched);

//         // Validate all
//         const newErrors = {
//             username: validate.username(form.username),
//             email: validate.email(form.email),
//             password: validate.password(form.password),
//             confirmPassword: validate.confirmPassword(form.confirmPassword, form.password),
//         };
//         setErrors(newErrors);

//         if (Object.values(newErrors).some(e => e)) return;

//         setLoading(true);
//         setServerError('');
//         try {
//             const res = await register({ username: form.username, email: form.email, password: form.password });
//             authLogin(res.data);
//             navigate('/turfs');
//         } catch (err) {
//             setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const inputBorder = (name) => {
//         if (!touched[name]) return '1px solid #334155';
//         return errors[name] ? '1px solid #ef4444' : '1px solid #22c55e';
//     };

//     return (
//         <div style={styles.page}>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&display=swap');
//                 * { box-sizing: border-box; }
//                 input { outline: none; transition: border-color 0.2s; }
//                 input:focus { border-color: #22c55e !important; }
//                 .register-card { animation: fadeUp 0.4s ease; }
//                 @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
//                 @media (max-width: 480px) {
//                     .register-card { padding: 28px 20px !important; margin: 16px !important; }
//                 }
//             `}</style>

//             <div className="register-card" style={styles.card}>
//                 {/* Logo */}
//                 <div style={styles.logoWrap}>
//                     <span style={styles.logo}>BUFF</span>
//                     <span style={styles.logoGreen}>TURF</span>
//                 </div>
//                 <p style={styles.tagline}>Create your account</p>

//                 {serverError && (
//                     <div style={styles.serverError}>❌ {serverError}</div>
//                 )}

//                 <form onSubmit={handleSubmit} noValidate>
//                     {/* Username */}
//                     <div style={styles.field}>
//                         <label style={styles.label}>Username</label>
//                         <input
//                             style={{ ...styles.input, border: inputBorder('username') }}
//                             type="text"
//                             name="username"
//                             placeholder="e.g. john_doe99"
//                             value={form.username}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             autoComplete="username"
//                         />
//                         {touched.username && errors.username && (
//                             <span style={styles.errMsg}>⚠ {errors.username}</span>
//                         )}
//                         {touched.username && !errors.username && (
//                             <span style={styles.okMsg}>✓ Looks good!</span>
//                         )}
//                     </div>

//                     {/* Email */}
//                     <div style={styles.field}>
//                         <label style={styles.label}>Email Address</label>
//                         <input
//                             style={{ ...styles.input, border: inputBorder('email') }}
//                             type="email"
//                             name="email"
//                             placeholder="you@example.com"
//                             value={form.email}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             autoComplete="email"
//                         />
//                         {touched.email && errors.email && (
//                             <span style={styles.errMsg}>⚠ {errors.email}</span>
//                         )}
//                         {touched.email && !errors.email && (
//                             <span style={styles.okMsg}>✓ Valid email</span>
//                         )}
//                     </div>

//                     {/* Password */}
//                     <div style={styles.field}>
//                         <label style={styles.label}>Password</label>
//                         <input
//                             style={{ ...styles.input, border: inputBorder('password') }}
//                             type="password"
//                             name="password"
//                             placeholder="Min. 6 characters"
//                             value={form.password}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             autoComplete="new-password"
//                         />
//                         {touched.password && errors.password && (
//                             <span style={styles.errMsg}>⚠ {errors.password}</span>
//                         )}
//                         {touched.password && !errors.password && (
//                             <span style={styles.okMsg}>✓ Strong enough</span>
//                         )}
//                     </div>

//                     {/* Confirm Password */}
//                     <div style={styles.field}>
//                         <label style={styles.label}>Confirm Password</label>
//                         <input
//                             style={{ ...styles.input, border: inputBorder('confirmPassword') }}
//                             type="password"
//                             name="confirmPassword"
//                             placeholder="Re-enter password"
//                             value={form.confirmPassword}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             autoComplete="new-password"
//                         />
//                         {touched.confirmPassword && errors.confirmPassword && (
//                             <span style={styles.errMsg}>⚠ {errors.confirmPassword}</span>
//                         )}
//                         {touched.confirmPassword && !errors.confirmPassword && (
//                             <span style={styles.okMsg}>✓ Passwords match</span>
//                         )}
//                     </div>

//                     <button
//                         type="submit"
//                         style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
//                         disabled={loading}
//                     >
//                         {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
//                     </button>
//                 </form>

//                 <p style={styles.loginLink}>
//                     Already have an account?{' '}
//                     <Link to="/login" style={styles.link}>Sign In</Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

// const styles = {
//     page: {
//         backgroundColor: '#050a14',
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontFamily: "'Barlow', sans-serif",
//         padding: '20px',
//     },
//     card: {
//         background: '#111827',
//         borderRadius: '16px',
//         padding: '40px 36px',
//         width: '100%',
//         maxWidth: '440px',
//         border: '1px solid #1e293b',
//         boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
//     },
//     logoWrap: { textAlign: 'center', marginBottom: '4px' },
//     logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#ffffff', letterSpacing: '2px' },
//     logoGreen: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#22c55e', letterSpacing: '2px' },
//     tagline: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '28px', marginTop: 0 },
//     serverError: {
//         background: '#1a0808', border: '1px solid #ef444444', color: '#ef4444',
//         padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px',
//     },
//     field: { marginBottom: '18px' },
//     label: {
//         display: 'block', color: '#94a3b8', fontSize: '12px',
//         fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
//     },
//     input: {
//         width: '100%', padding: '12px 14px', background: '#0f172a',
//         borderRadius: '8px', color: '#ffffff', fontSize: '14px',
//     },
//     errMsg: { display: 'block', color: '#ef4444', fontSize: '12px', marginTop: '5px', fontWeight: '600' },
//     okMsg: { display: 'block', color: '#22c55e', fontSize: '12px', marginTop: '5px', fontWeight: '600' },
//     submitBtn: {
//         width: '100%', padding: '14px', background: '#22c55e', color: '#000',
//         border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '800',
//         cursor: 'pointer', marginTop: '8px', transition: 'opacity 0.2s',
//     },
//     loginLink: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '20px', marginBottom: 0 },
//     link: { color: '#22c55e', fontWeight: '700', textDecoration: 'none' },
// };

// export default Register;
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', phoneNumber: '' });
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
        const timer = setInterval(() => setActiveSlide(prev => (prev + 1) % slides.length), 3000);
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => { clearInterval(timer); window.removeEventListener('resize', handleResize); };
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await registerUser(formData);
            const data = response.data;
            login({ username: data.username, email: data.email, role: data.role }, data.token);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed!');
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
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
                .register-btn:hover { opacity: 0.88; transform: translateY(-2px); }
                .login-link-btn:hover { background: ${current.color}11 !important; }
                .sport-dot { transition: all 0.3s; cursor: pointer; }
                .form-wrap { animation: slideUp 0.6s ease forwards; }
                .sport-emoji-main { animation: pulse 2.5s ease-in-out infinite; display: inline-block; }
            `}</style>

            <div style={styles.bgContainer}>
                {bgImages.map((img, i) => (
                    <div key={i} style={{ ...styles.bgSlide, backgroundImage: `url(${img})`, opacity: i === activeSlide ? 1 : 0, transition: 'opacity 1s ease' }}/>
                ))}
                <div style={{ ...styles.overlay, background: 'linear-gradient(135deg, rgba(5,10,20,0.88) 0%, rgba(5,10,20,0.65) 50%, rgba(5,10,20,0.95) 100%)' }}/>
                <div style={{ ...styles.colorTint, background: current.color + '15', transition: 'background 0.8s ease' }}/>
            </div>

            <div style={{ ...styles.content, flexDirection: isMobile ? 'column' : 'row', padding: isMobile ? '24px 16px' : '40px', gap: isMobile ? '20px' : '60px', alignItems: isMobile ? 'stretch' : 'center' }}>

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
                            <h1 style={{ ...styles.heroTitle, color: current.color }}>{current.sport}</h1>
                            <p style={styles.heroSub}>Join 1000+ players booking turfs daily!</p>
                        </div>
                        <div style={styles.dotsRow}>
                            {slides.map((s, i) => (
                                <button key={i} className="sport-dot" onClick={() => setActiveSlide(i)} style={{ ...styles.dot, background: i === activeSlide ? s.color : 'rgba(255,255,255,0.2)', width: i === activeSlide ? '32px' : '10px', boxShadow: i === activeSlide ? `0 0 10px ${s.color}` : 'none' }}/>
                            ))}
                        </div>
                        <div style={styles.benefitsBox}>
                            {[{ icon: '⚡', text: 'Instant slot booking' }, { icon: '📱', text: 'QR code entry pass' }, { icon: '🔒', text: 'Secure & easy payments' }, { icon: '🏟️', text: 'Access to 14+ turfs' }].map((b, i) => (
                                <div key={i} style={styles.benefitItem}>
                                    <span style={styles.benefitIcon}>{b.icon}</span>
                                    <span style={styles.benefitText}>{b.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={styles.mobileHeader}>
                        <div style={styles.logo}>
                            <span style={styles.logoEmoji}>🏟️</span>
                            <span style={styles.logoText}>BuffTURF</span>
                        </div>
                        <div style={styles.mobileEmoji}>
                            <span className="sport-emoji-main" style={{ fontSize: '40px' }}>{current.emoji}</span>
                            <span style={{ ...styles.mobileSportName, color: current.color }}>{current.sport}</span>
                        </div>
                    </div>
                )}

                <div style={{ ...styles.rightSide, width: isMobile ? '100%' : '420px' }}>
                    <div className="form-wrap" style={styles.glassCard}>

                        <div style={{ ...styles.cardAccent, background: `linear-gradient(90deg, ${current.color}, ${current.color}44)` }}/>

                        <div style={styles.cardHeader}>
                            <h2 style={styles.cardTitle}>Create Account 🏅</h2>
                            <p style={styles.cardSub}>Join BuffTURF for free today</p>
                        </div>

                        <div style={styles.pillsRow}>
                            {slides.map((s, i) => (
                                <button key={i} onClick={() => setActiveSlide(i)} style={{ ...styles.pill, background: i === activeSlide ? s.color + '22' : 'transparent', border: `1px solid ${i === activeSlide ? s.color + '66' : 'rgba(255,255,255,0.1)'}`, transform: i === activeSlide ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s' }}>
                                    {s.emoji}
                                </button>
                            ))}
                        </div>

                        {error && <div style={styles.errorBox}>❌ {error}</div>}

                        <form onSubmit={handleRegister}>
                            {[
                                { label: 'Username', name: 'username', type: 'text', icon: '👤', ph: 'Choose a username' },
                                { label: 'Email', name: 'email', type: 'email', icon: '✉️', ph: 'Enter your email' },
                                { label: 'Password', name: 'password', type: 'password', icon: '🔒', ph: 'Min 6 characters' },
                                { label: 'Phone Number', name: 'phoneNumber', type: 'tel', icon: '📞', ph: 'Enter phone number' },
                            ].map(f => (
                                <div key={f.name} style={styles.field}>
                                    <label style={styles.label}>{f.label}</label>
                                    <div style={{ ...styles.inputBox, borderColor: formData[f.name] ? current.color + '88' : 'rgba(255,255,255,0.1)' }}>
                                        <span style={styles.inputIcon}>{f.icon}</span>
                                        <input style={styles.input} type={f.type} name={f.name} placeholder={f.ph} value={formData[f.name]} onChange={handleChange} required={f.name !== 'phoneNumber'}/>
                                    </div>
                                </div>
                            ))}

                            <button className="register-btn" type="submit" disabled={loading} style={{ ...styles.submitBtn, background: loading ? '#334155' : `linear-gradient(135deg, ${current.color} 0%, ${current.color}bb 100%)`, cursor: loading ? 'not-allowed' : 'pointer' }}>
                                {loading ? '⏳ Creating account...' : '🏅 Create Free Account'}
                            </button>
                        </form>

                        <div style={styles.divider}>
                            <div style={styles.divLine}/>
                            <span style={styles.divText}>Already have an account?</span>
                            <div style={styles.divLine}/>
                        </div>

                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button className="login-link-btn" style={{ ...styles.loginLinkBtn, border: `1.5px solid ${current.color}44`, color: current.color }}>
                                🔑 Login to BuffTURF
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
    mobileHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    mobileEmoji: { display: 'flex', alignItems: 'center', gap: '8px' },
    mobileSportName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '3px' },
    leftSide: { flex: 1, display: 'flex', flexDirection: 'column', gap: '28px' },
    logo: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoEmoji: { fontSize: '28px' },
    logoText: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '28px', letterSpacing: '4px' },
    heroSection: { textAlign: 'center' },
    emojiCircle: { width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' },
    heroTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', letterSpacing: '5px', margin: '0 0 8px 0' },
    heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 },
    dotsRow: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' },
    dot: { height: '10px', borderRadius: '5px', border: 'none', padding: 0 },
    benefitsBox: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
    benefitItem: { display: 'flex', alignItems: 'center', gap: '12px' },
    benefitIcon: { fontSize: '20px', flexShrink: 0 },
    benefitText: { color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600' },
    rightSide: { flexShrink: 0 },
    glassCard: { background: 'rgba(5, 8, 18, 0.75)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' },
    cardAccent: { height: '4px', width: '100%' },
    cardHeader: { padding: '24px 24px 0 24px', marginBottom: '14px' },
    cardTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '30px', letterSpacing: '2px', margin: '0 0 4px 0' },
    cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 },
    pillsRow: { display: 'flex', gap: '8px', padding: '0 24px', marginBottom: '14px', flexWrap: 'wrap' },
    pill: { fontSize: '18px', padding: '7px 10px', borderRadius: '10px', cursor: 'pointer' },
    errorBox: { margin: '0 24px 14px 24px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' },
    field: { padding: '0 24px', marginBottom: '12px' },
    label: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' },
    inputBox: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0 14px' },
    inputIcon: { fontSize: '15px', marginRight: '10px', flexShrink: 0 },
    input: { flex: 1, padding: '12px 0', background: 'transparent', border: 'none', color: '#ffffff', fontSize: '14px', width: '100%' },
    submitBtn: { display: 'block', width: 'calc(100% - 48px)', margin: '8px 24px 0 24px', padding: '14px', border: 'none', borderRadius: '12px', color: '#000', fontSize: '15px', fontWeight: '800', letterSpacing: '0.5px' },
    divider: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px 0 24px' },
    divLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' },
    divText: { color: 'rgba(255,255,255,0.3)', fontSize: '12px', whiteSpace: 'nowrap' },
    loginLinkBtn: { display: 'block', width: 'calc(100% - 48px)', margin: '12px 24px 0 24px', padding: '12px', background: 'transparent', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
    backHome: { textAlign: 'center', padding: '14px 24px 20px 24px', margin: 0 },
};

export default Register;