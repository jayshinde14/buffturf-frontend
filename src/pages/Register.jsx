import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ─── Validation helpers ──────────────────────────────────────────────────────
const validate = {
    username: (v) => {
        if (!v) return 'Username is required';
        if (v.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'Only letters, numbers, and underscore (_) allowed';
        return '';
    },
    email: (v) => {
        if (!v) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address';
        return '';
    },
    password: (v) => {
        if (!v) return 'Password is required';
        if (v.length < 6) return 'Password must be at least 6 characters';
        return '';
    },
    confirmPassword: (v, password) => {
        if (!v) return 'Please confirm your password';
        if (v !== password) return 'Passwords do not match';
        return '';
    },
};
// ─────────────────────────────────────────────────────────────────────────────

function Register() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const err = name === 'confirmPassword'
                ? validate.confirmPassword(value, name === 'password' ? value : form.password)
                : validate[name]?.(value) || '';
            setErrors(prev => ({ ...prev, [name]: err }));
        }
        // Re-validate confirmPassword when password changes
        if (name === 'password' && touched.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: validate.confirmPassword(form.confirmPassword, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const err = name === 'confirmPassword'
            ? validate.confirmPassword(value, form.password)
            : validate[name]?.(value) || '';
        setErrors(prev => ({ ...prev, [name]: err }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Touch all fields
        const allTouched = { username: true, email: true, password: true, confirmPassword: true };
        setTouched(allTouched);

        // Validate all
        const newErrors = {
            username: validate.username(form.username),
            email: validate.email(form.email),
            password: validate.password(form.password),
            confirmPassword: validate.confirmPassword(form.confirmPassword, form.password),
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(e => e)) return;

        setLoading(true);
        setServerError('');
        try {
            const res = await register({ username: form.username, email: form.email, password: form.password });
            authLogin(res.data);
            navigate('/turfs');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                .register-card { animation: fadeUp 0.4s ease; }
                @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
                @media (max-width: 480px) {
                    .register-card { padding: 28px 20px !important; margin: 16px !important; }
                }
            `}</style>

            <div className="register-card" style={styles.card}>
                {/* Logo */}
                <div style={styles.logoWrap}>
                    <span style={styles.logo}>BUFF</span>
                    <span style={styles.logoGreen}>TURF</span>
                </div>
                <p style={styles.tagline}>Create your account</p>

                {serverError && (
                    <div style={styles.serverError}>❌ {serverError}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Username */}
                    <div style={styles.field}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={{ ...styles.input, border: inputBorder('username') }}
                            type="text"
                            name="username"
                            placeholder="e.g. john_doe99"
                            value={form.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="username"
                        />
                        {touched.username && errors.username && (
                            <span style={styles.errMsg}>⚠ {errors.username}</span>
                        )}
                        {touched.username && !errors.username && (
                            <span style={styles.okMsg}>✓ Looks good!</span>
                        )}
                    </div>

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
                        {touched.email && !errors.email && (
                            <span style={styles.okMsg}>✓ Valid email</span>
                        )}
                    </div>

                    {/* Password */}
                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={{ ...styles.input, border: inputBorder('password') }}
                            type="password"
                            name="password"
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="new-password"
                        />
                        {touched.password && errors.password && (
                            <span style={styles.errMsg}>⚠ {errors.password}</span>
                        )}
                        {touched.password && !errors.password && (
                            <span style={styles.okMsg}>✓ Strong enough</span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div style={styles.field}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            style={{ ...styles.input, border: inputBorder('confirmPassword') }}
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="new-password"
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                            <span style={styles.errMsg}>⚠ {errors.confirmPassword}</span>
                        )}
                        {touched.confirmPassword && !errors.confirmPassword && (
                            <span style={styles.okMsg}>✓ Passwords match</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
                    </button>
                </form>

                <p style={styles.loginLink}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>Sign In</Link>
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
        maxWidth: '440px',
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
    okMsg: { display: 'block', color: '#22c55e', fontSize: '12px', marginTop: '5px', fontWeight: '600' },
    submitBtn: {
        width: '100%', padding: '14px', background: '#22c55e', color: '#000',
        border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '800',
        cursor: 'pointer', marginTop: '8px', transition: 'opacity 0.2s',
    },
    loginLink: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '20px', marginBottom: 0 },
    link: { color: '#22c55e', fontWeight: '700', textDecoration: 'none' },
};

export default Register;
