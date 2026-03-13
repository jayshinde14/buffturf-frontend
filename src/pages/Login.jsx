import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ─── Validation helpers ──────────────────────────────────────────────────────
const validate = {
    email: (v) => {
        if (!v) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address';
        return '';
    },
    password: (v) => {
        if (!v) return 'Password is required';
        if (v.length < 1) return 'Password cannot be empty';
        return '';
    },
};
// ─────────────────────────────────────────────────────────────────────────────

function Login() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validate[name]?.(value) || '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validate[name]?.(value) || '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        const newErrors = {
            email: validate.email(form.email),
            password: validate.password(form.password),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(e => e)) return;

        setLoading(true);
        setServerError('');
        try {
            const res = await loginApi({ email: form.email, password: form.password });
            authLogin(res.data);
            navigate('/turfs');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputBorder = (name) => {
        if (!touched[name]) return '1px solid #334155';
        return errors[name] ? '1px solid #ef4444' : '1px solid #22c55e';
    };

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input { outline: none; transition: border-color 0.2s; }
                input:focus { border-color: #22c55e !important; }
                .login-card { animation: fadeUp 0.4s ease; }
                @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
                @media (max-width: 480px) {
                    .login-card { padding: 28px 20px !important; margin: 16px !important; }
                }
            `}</style>

            <div className="login-card" style={styles.card}>
                {/* Logo */}
                <div style={styles.logoWrap}>
                    <span style={styles.logo}>BUFF</span>
                    <span style={styles.logoGreen}>TURF</span>
                </div>
                <p style={styles.tagline}>Welcome back! Sign in to continue</p>

                {serverError && (
                    <div style={styles.serverError}>❌ {serverError}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div style={styles.field}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            style={{ ...styles.input, border: inputBorder('email') }}
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="email"
                        />
                        {touched.email && errors.email && (
                            <span style={styles.errMsg}>⚠ {errors.email}</span>
                        )}
                    </div>

                    {/* Password */}
                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={{ ...styles.input, border: inputBorder('password') }}
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="current-password"
                        />
                        {touched.password && errors.password && (
                            <span style={styles.errMsg}>⚠ {errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? '⏳ Signing In...' : '🔐 Sign In'}
                    </button>
                </form>

                <p style={styles.registerLink}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.link}>Create one</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        backgroundColor: '#050a14',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Barlow', sans-serif",
        padding: '20px',
    },
    card: {
        background: '#111827',
        borderRadius: '16px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #1e293b',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    },
    logoWrap: { textAlign: 'center', marginBottom: '4px' },
    logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#ffffff', letterSpacing: '2px' },
    logoGreen: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#22c55e', letterSpacing: '2px' },
    tagline: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '28px', marginTop: 0 },
    serverError: {
        background: '#1a0808', border: '1px solid #ef444444', color: '#ef4444',
        padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px',
    },
    field: { marginBottom: '18px' },
    label: {
        display: 'block', color: '#94a3b8', fontSize: '12px',
        fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
    },
    input: {
        width: '100%', padding: '12px 14px', background: '#0f172a',
        borderRadius: '8px', color: '#ffffff', fontSize: '14px',
    },
    errMsg: { display: 'block', color: '#ef4444', fontSize: '12px', marginTop: '5px', fontWeight: '600' },
    submitBtn: {
        width: '100%', padding: '14px', background: '#22c55e', color: '#000',
        border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '800',
        cursor: 'pointer', marginTop: '8px', transition: 'opacity 0.2s',
    },
    registerLink: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '20px', marginBottom: 0 },
    link: { color: '#22c55e', fontWeight: '700', textDecoration: 'none' },
};

export default Login;
