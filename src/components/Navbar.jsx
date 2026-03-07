/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                .nav-link { transition: all 0.2s; }
                .nav-link:hover { color: #ffffff !important; background: rgba(255,255,255,0.06) !important; }
                .logout-btn:hover { background: #dc2626 !important; transform: translateY(-1px); }
                .register-btn:hover { opacity: 0.88; transform: translateY(-1px); }
                .logo-text:hover { opacity: 0.85; }
                @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
                .mobile-menu { animation: slideDown 0.2s ease forwards; }

                /* MOBILE RESPONSIVE */
                .desktop-links { display: flex !important; }
                .hamburger-btn { display: none !important; }

                @media (max-width: 768px) {
                    .desktop-links { display: none !important; }
                    .hamburger-btn { display: flex !important; }
                    .nav-padding { padding: 0 16px !important; }
                }
            `}</style>

            <nav className="nav-padding" style={{
                ...styles.nav,
                background: scrolled
                    ? 'rgba(5,10,20,0.97)'
                    : 'rgba(5,10,20,0.85)',
                backdropFilter: 'blur(20px)',
                boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
                borderBottom: scrolled ? '1px solid #1e293b' : '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
            }}>

                {/* LOGO */}
                <Link to="/" className="logo-text" style={styles.logo}>
                    <span style={styles.logoIcon}>🏟️</span>
                    <span style={styles.logoText}>Buff</span>
                    <span style={styles.logoAccent}>TURF</span>
                </Link>

                {/* DESKTOP LINKS */}
                <div className="desktop-links" style={styles.desktopLinks}>

                    {/* NOT LOGGED IN */}
                    {!user && (
                        <>
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/turfs', label: 'Find Turfs' },
                            ].map(l => (
                                <Link key={l.to} to={l.to} className="nav-link" style={{
                                    ...styles.navLink,
                                    color: isActive(l.to) ? '#22c55e' : '#94a3b8',
                                    background: isActive(l.to) ? 'rgba(34,197,94,0.1)' : 'transparent',
                                }}>
                                    {l.label}
                                </Link>
                            ))}
                            <div style={styles.divider}/>
                            <Link to="/login" className="nav-link" style={styles.loginBtn}>
                                Login
                            </Link>
                            <Link to="/register" className="register-btn" style={styles.registerBtn}>
                                🚀 Register Free
                            </Link>
                        </>
                    )}

                    {/* USER */}
                    {user && user.role === 'USER' && (
                        <>
                            {[
                                { to: '/turfs', label: '🔍 Find Turf' },
                                { to: '/my-bookings', label: '📋 My Bookings' },
                            ].map(l => (
                                <Link key={l.to} to={l.to} className="nav-link" style={{
                                    ...styles.navLink,
                                    color: isActive(l.to) ? '#22c55e' : '#94a3b8',
                                    background: isActive(l.to) ? 'rgba(34,197,94,0.1)' : 'transparent',
                                    borderBottom: isActive(l.to) ? '2px solid #22c55e' : '2px solid transparent',
                                }}>
                                    {l.label}
                                </Link>
                            ))}
                            <div style={styles.divider}/>
                            <div style={styles.userBadge}>
                                <div style={styles.userAvatar}>
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                                <span style={styles.username}>{user.username}</span>
                            </div>
                            <button className="logout-btn" onClick={handleLogout} style={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    )}

                    {/* ADMIN */}
                    {user && user.role === 'ADMIN' && (
                        <>
                            {[
                                { to: '/admin/dashboard', label: '📊 Dashboard' },
                                { to: '/admin/turfs', label: '🏟️ Turfs' },
                            ].map(l => (
                                <Link key={l.to} to={l.to} className="nav-link" style={{
                                    ...styles.navLink,
                                    color: isActive(l.to) ? '#f59e0b' : '#94a3b8',
                                    background: isActive(l.to) ? 'rgba(245,158,11,0.1)' : 'transparent',
                                    borderBottom: isActive(l.to) ? '2px solid #f59e0b' : '2px solid transparent',
                                }}>
                                    {l.label}
                                </Link>
                            ))}
                            <div style={styles.divider}/>
                            <div style={styles.adminBadge}>
                                <span style={styles.crownIcon}>👑</span>
                                <span style={styles.adminName}>{user.username}</span>
                            </div>
                            <button className="logout-btn" onClick={handleLogout} style={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* MOBILE HAMBURGER */}
                <button
                    className="hamburger-btn"
                    style={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <div style={{
                        ...styles.hamburgerLine,
                        transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                        transition: 'all 0.3s',
                    }}/>
                    <div style={{
                        ...styles.hamburgerLine,
                        opacity: menuOpen ? 0 : 1,
                        transition: 'all 0.3s',
                    }}/>
                    <div style={{
                        ...styles.hamburgerLine,
                        transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                        transition: 'all 0.3s',
                    }}/>
                </button>
            </nav>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="mobile-menu" style={styles.mobileMenu}>
                    {!user && (
                        <>
                            <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>🏠 Home</Link>
                            <Link to="/turfs" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>🔍 Find Turfs</Link>
                            <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>🔑 Login</Link>
                            <Link to="/register" style={{...styles.mobileLink, color: '#22c55e'}} onClick={() => setMenuOpen(false)}>🚀 Register Free</Link>
                        </>
                    )}
                    {user && user.role === 'USER' && (
                        <>
                            <Link to="/turfs" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>🔍 Find Turf</Link>
                            <Link to="/my-bookings" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>📋 My Bookings</Link>
                            <div style={styles.mobileDivider}/>
                            <button style={styles.mobileLogout} onClick={handleLogout}>Logout</button>
                        </>
                    )}
                    {user && user.role === 'ADMIN' && (
                        <>
                            <Link to="/admin/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                            <Link to="/admin/turfs" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>🏟️ Manage Turfs</Link>
                            <div style={styles.mobileDivider}/>
                            <button style={styles.mobileLogout} onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}

const styles = {
    nav: {
        padding: '0 32px',
        height: '68px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        fontFamily: "'Barlow', sans-serif",
    },

    // LOGO
    logo: {
        display: 'flex', alignItems: 'center',
        gap: '6px', textDecoration: 'none',
    },
    logoIcon: { fontSize: '24px' },
    logoText: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff', fontSize: '26px',
        letterSpacing: '2px',
    },
    logoAccent: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#22c55e', fontSize: '26px',
        letterSpacing: '2px',
    },

    // DESKTOP
    desktopLinks: {
        display: 'flex', alignItems: 'center', gap: '4px',
    },
    navLink: {
        textDecoration: 'none', fontSize: '14px',
        fontWeight: '600', padding: '8px 14px',
        borderRadius: '8px', letterSpacing: '0.3px',
        borderBottom: '2px solid transparent',
    },
    divider: {
        width: '1px', height: '24px',
        background: 'rgba(255,255,255,0.1)',
        margin: '0 8px',
    },
    loginBtn: {
        color: '#94a3b8', textDecoration: 'none',
        fontSize: '14px', fontWeight: '600',
        padding: '8px 14px', borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.2s',
    },
    registerBtn: {
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#000', padding: '9px 18px',
        borderRadius: '8px', textDecoration: 'none',
        fontSize: '14px', fontWeight: '800',
        transition: 'all 0.2s',
        boxShadow: '0 4px 15px rgba(34,197,94,0.3)',
        letterSpacing: '0.3px',
    },

    // USER BADGE
    userBadge: {
        display: 'flex', alignItems: 'center',
        gap: '8px', padding: '6px 12px',
        background: 'rgba(34,197,94,0.1)',
        border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: '20px',
    },
    userAvatar: {
        width: '26px', height: '26px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#000', fontSize: '12px',
        fontWeight: '800', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    username: { color: '#22c55e', fontSize: '13px', fontWeight: '700' },

    // ADMIN BADGE
    adminBadge: {
        display: 'flex', alignItems: 'center',
        gap: '8px', padding: '6px 12px',
        background: 'rgba(245,158,11,0.1)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: '20px',
    },
    crownIcon: { fontSize: '16px' },
    adminName: { color: '#f59e0b', fontSize: '13px', fontWeight: '700' },

    // LOGOUT
    logoutBtn: {
        background: 'rgba(239,68,68,0.15)',
        color: '#ef4444',
        border: '1px solid rgba(239,68,68,0.2)',
        padding: '8px 16px', borderRadius: '8px',
        cursor: 'pointer', fontSize: '13px',
        fontWeight: '700', transition: 'all 0.2s',
        marginLeft: '4px',
    },

    // HAMBURGER
    hamburger: {
        flexDirection: 'column',
        gap: '5px', background: 'none',
        border: 'none', cursor: 'pointer',
        padding: '8px',
    },
    hamburgerLine: {
        width: '22px', height: '2px',
        background: '#ffffff', borderRadius: '2px',
    },

    // MOBILE MENU
    mobileMenu: {
        position: 'fixed', top: '68px', left: 0, right: 0,
        background: 'rgba(5,10,20,0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid #1e293b',
        padding: '16px', zIndex: 999,
        display: 'flex', flexDirection: 'column', gap: '4px',
    },
    mobileLink: {
        color: '#94a3b8', textDecoration: 'none',
        padding: '12px 16px', borderRadius: '8px',
        fontSize: '15px', fontWeight: '600',
        display: 'block',
        border: '1px solid transparent',
    },
    mobileDivider: {
        height: '1px', background: '#1e293b', margin: '8px 0',
    },
    mobileLogout: {
        background: 'rgba(239,68,68,0.15)',
        color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)',
        padding: '12px 16px', borderRadius: '8px',
        cursor: 'pointer', fontSize: '15px',
        fontWeight: '700', textAlign: 'left',
        width: '100%',
    },
};

export default Navbar;