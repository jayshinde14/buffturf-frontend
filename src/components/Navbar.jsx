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

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false); };
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                .nav-link { transition: all 0.2s; }
                .nav-link:hover { color: #ffffff !important; background: rgba(255,255,255,0.06) !important; }
                .logout-btn:hover { background: #dc2626 !important; transform: translateY(-1px); }
                .register-btn:hover { opacity: 0.88; transform: translateY(-1px); }
                .logo-text:hover { opacity: 0.85; }
                .m-link:hover { background: rgba(255,255,255,0.06) !important; color: #ffffff !important; }
                @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
                .mobile-menu { animation: slideDown 0.22s ease forwards; }

                /* Desktop = links visible, hamburger hidden */
                .desktop-links { display: flex !important; }
                .hamburger-btn  { display: none !important; }

                @media (max-width: 768px) {
                    .desktop-links { display: none !important; }
                    .hamburger-btn  { display: flex !important; }
                    .nav-inner      { padding: 0 16px !important; }
                }
            `}</style>

            <nav className="nav-inner" style={{
                ...S.nav,
                background: scrolled ? 'rgba(5,10,20,0.97)' : 'rgba(5,10,20,0.85)',
                backdropFilter: 'blur(20px)',
                boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
                borderBottom: scrolled ? '1px solid #1e293b' : '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
            }}>

                {/* LOGO */}
                <Link to="/" className="logo-text" style={S.logo}>
                    <span style={{ fontSize: '24px' }}>🏟️</span>
                    <span style={S.logoTxt}>Buff</span>
                    <span style={S.logoAccent}>TURF</span>
                </Link>

                {/* DESKTOP LINKS */}
                <div className="desktop-links" style={S.desktopLinks}>
                    {!user && (
                        <>
                            {[{ to: '/', label: 'Home' }, { to: '/turfs', label: 'Find Turfs' }].map(l => (
                                <Link key={l.to} to={l.to} className="nav-link" style={{ ...S.navLink, color: isActive(l.to) ? '#22c55e' : '#94a3b8', background: isActive(l.to) ? 'rgba(34,197,94,0.1)' : 'transparent' }}>{l.label}</Link>
                            ))}
                            <div style={S.divider}/>
                            <Link to="/login" className="nav-link" style={S.loginBtn}>Login</Link>
                            <Link to="/register" className="register-btn" style={S.registerBtn}>🚀 Register Free</Link>
                        </>
                    )}
                    {user && user.role === 'USER' && (
                        <>
                            {[{ to: '/turfs', label: '🔍 Find Turf' }, { to: '/my-bookings', label: '📋 My Bookings' }].map(l => (
                                <Link key={l.to} to={l.to} className="nav-link" style={{ ...S.navLink, color: isActive(l.to) ? '#22c55e' : '#94a3b8', background: isActive(l.to) ? 'rgba(34,197,94,0.1)' : 'transparent', borderBottom: isActive(l.to) ? '2px solid #22c55e' : '2px solid transparent' }}>{l.label}</Link>
                            ))}
                            <div style={S.divider}/>
                            <div style={S.userBadge}>
                                <div style={S.userAvatar}>{user.username?.charAt(0).toUpperCase()}</div>
                                <span style={S.username}>{user.username}</span>
                            </div>
                            <button className="logout-btn" onClick={handleLogout} style={S.logoutBtn}>Logout</button>
                        </>
                    )}
                    {user && user.role === 'ADMIN' && (
                        <>
                            {[{ to: '/admin/dashboard', label: '📊 Dashboard' }, { to: '/admin/turfs', label: '🏟️ Turfs' }].map(l => (
                                <Link key={l.to} to={l.to} className="nav-link" style={{ ...S.navLink, color: isActive(l.to) ? '#f59e0b' : '#94a3b8', background: isActive(l.to) ? 'rgba(245,158,11,0.1)' : 'transparent', borderBottom: isActive(l.to) ? '2px solid #f59e0b' : '2px solid transparent' }}>{l.label}</Link>
                            ))}
                            <div style={S.divider}/>
                            <div style={S.adminBadge}><span style={{ fontSize: '16px' }}>👑</span><span style={S.adminName}>{user.username}</span></div>
                            <button className="logout-btn" onClick={handleLogout} style={S.logoutBtn}>Logout</button>
                        </>
                    )}
                </div>

                {/* HAMBURGER */}
                <button className="hamburger-btn" aria-label="Toggle menu" style={S.hamburger} onClick={() => setMenuOpen(v => !v)}>
                    <div style={{ ...S.hLine, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', transition: 'all 0.28s' }}/>
                    <div style={{ ...S.hLine, opacity: menuOpen ? 0 : 1, transition: 'all 0.28s' }}/>
                    <div style={{ ...S.hLine, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', transition: 'all 0.28s' }}/>
                </button>
            </nav>

            {/* BACKDROP */}
            {menuOpen && <div style={S.backdrop} onClick={() => setMenuOpen(false)}/>}

            {/* MOBILE DRAWER */}
            {menuOpen && (
                <div className="mobile-menu" style={S.drawer}>

                    {/* Logged-in user row */}
                    {user && (
                        <div style={S.drawerUserRow}>
                            <div style={{ ...S.drawerAvatar, background: user.role === 'ADMIN' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
                                {user.role === 'ADMIN' ? '👑' : user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: '700', margin: '0 0 2px 0' }}>{user.username}</p>
                                <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{user.role === 'ADMIN' ? '🔶 Admin' : '🟢 Member'}</p>
                            </div>
                        </div>
                    )}

                    {!user && (
                        <>
                            <Link to="/" className="m-link" style={{ ...S.mLink, color: isActive('/') ? '#22c55e' : '#94a3b8' }} onClick={() => setMenuOpen(false)}>🏠 Home</Link>
                            <Link to="/turfs" className="m-link" style={{ ...S.mLink, color: isActive('/turfs') ? '#22c55e' : '#94a3b8' }} onClick={() => setMenuOpen(false)}>🔍 Find Turfs</Link>
                            <div style={S.mDivider}/>
                            <Link to="/login" className="m-link" style={S.mLink} onClick={() => setMenuOpen(false)}>🔑 Login</Link>
                            <Link to="/register" className="m-link" style={{ ...S.mLink, color: '#22c55e', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }} onClick={() => setMenuOpen(false)}>🚀 Register Free</Link>
                        </>
                    )}

                    {user && user.role === 'USER' && (
                        <>
                            <Link to="/turfs" className="m-link" style={{ ...S.mLink, color: isActive('/turfs') ? '#22c55e' : '#94a3b8', background: isActive('/turfs') ? 'rgba(34,197,94,0.07)' : 'transparent' }} onClick={() => setMenuOpen(false)}>🔍 Find Turf</Link>
                            <Link to="/my-bookings" className="m-link" style={{ ...S.mLink, color: isActive('/my-bookings') ? '#22c55e' : '#94a3b8', background: isActive('/my-bookings') ? 'rgba(34,197,94,0.07)' : 'transparent' }} onClick={() => setMenuOpen(false)}>📋 My Bookings</Link>
                            <div style={S.mDivider}/>
                            <button style={S.mLogout} onClick={handleLogout}>🚪 Logout</button>
                        </>
                    )}

                    {user && user.role === 'ADMIN' && (
                        <>
                            <Link to="/admin/dashboard" className="m-link" style={S.mLink} onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                            <Link to="/admin/turfs" className="m-link" style={S.mLink} onClick={() => setMenuOpen(false)}>🏟️ Manage Turfs</Link>
                            <div style={S.mDivider}/>
                            <button style={{ ...S.mLogout, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderColor: 'rgba(245,158,11,0.2)' }} onClick={handleLogout}>🚪 Logout</button>
                        </>
                    )}

                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #0f172a', textAlign: 'center' }}>
                        <p style={{ color: '#1e293b', fontSize: '11px' }}>BuffTURF © 2026 • Made with ❤️ in India</p>
                    </div>
                </div>
            )}
        </>
    );
}

const S = {
    nav: { padding: '0 32px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, fontFamily: "'Barlow', sans-serif" },
    logo: { display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' },
    logoTxt: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '26px', letterSpacing: '2px' },
    logoAccent: { fontFamily: "'Bebas Neue', sans-serif", color: '#22c55e', fontSize: '26px', letterSpacing: '2px' },
    desktopLinks: { display: 'flex', alignItems: 'center', gap: '4px' },
    navLink: { textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', letterSpacing: '0.3px', borderBottom: '2px solid transparent' },
    divider: { width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' },
    loginBtn: { color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' },
    registerBtn: { background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#000', padding: '9px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '800', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(34,197,94,0.3)', letterSpacing: '0.3px' },
    userBadge: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '20px' },
    userAvatar: { width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#000', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    username: { color: '#22c55e', fontSize: '13px', fontWeight: '700' },
    adminBadge: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '20px' },
    adminName: { color: '#f59e0b', fontSize: '13px', fontWeight: '700' },
    logoutBtn: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s', marginLeft: '4px' },
    hamburger: { flexDirection: 'column', gap: '5px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', padding: '10px' },
    hLine: { width: '20px', height: '2px', background: '#ffffff', borderRadius: '2px', display: 'block' },
    backdrop: { position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', zIndex: 997, backdropFilter: 'blur(2px)' },
    drawer: { position: 'fixed', top: '64px', left: 0, right: 0, background: 'rgba(5,10,20,0.99)', backdropFilter: 'blur(24px)', borderBottom: '1px solid #1e293b', padding: '12px 16px 16px', zIndex: 998, display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' },
    drawerUserRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '8px' },
    drawerAvatar: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '16px', fontWeight: '800', flexShrink: 0 },
    mLink: { color: '#94a3b8', textDecoration: 'none', padding: '13px 14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', display: 'block', border: '1px solid transparent', transition: 'all 0.2s' },
    mDivider: { height: '1px', background: '#1e293b', margin: '8px 0' },
    mLogout: { background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '13px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', textAlign: 'left', width: '100%' },
};

export default Navbar;
