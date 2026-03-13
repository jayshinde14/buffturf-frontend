import React from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    const sports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton'];
    const cities = ['Solapur', 'Pune', 'Mumbai'];
    const sportEmojis = { Cricket: '🏏', Football: '⚽', Basketball: '🏀', Tennis: '🎾', Badminton: '🏸' };

    return (
        <footer style={S.footer}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                .footer-link:hover { color: #22c55e !important; }
                .footer-social:hover { background: rgba(34,197,94,0.15) !important; border-color: rgba(34,197,94,0.3) !important; transform: translateY(-2px); }

                /* ══ MOBILE 768px ══ */
                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 28px 20px !important;
                        padding: 36px 18px 28px !important;
                    }
                    .footer-brand {
                        grid-column: 1 / -1 !important;
                    }
                    .footer-col-title { margin-bottom: 12px !important; }
                    .footer-bottom-inner {
                        flex-direction: column !important;
                        gap: 8px !important;
                        padding: 14px 18px !important;
                        text-align: center !important;
                        align-items: center !important;
                    }
                    .bottom-links { justify-content: center !important; flex-wrap: wrap !important; }
                }

                /* ══ SMALL 480px ══ */
                @media (max-width: 480px) {
                    .footer-grid {
                        grid-template-columns: 1fr !important;
                        gap: 24px !important;
                    }
                    .footer-brand { grid-column: 1 !important; }
                }
            `}</style>

            {/* Top glow line */}
            <div style={S.topGlow}/>

            <div className="footer-grid" style={S.grid}>

                {/* ── BRAND ── */}
                <div className="footer-brand" style={S.brandCol}>
                    <div style={S.logoRow}>
                        <span style={{ fontSize: '28px' }}>🏟️</span>
                        <span style={S.logoText}>Buff<span style={{ color: '#22c55e' }}>TURF</span></span>
                    </div>
                    <p style={S.brandDesc}>
                        India's premier sports turf booking platform. Book Cricket, Football, Basketball,
                        Tennis & Badminton courts instantly across Solapur, Pune & Mumbai.
                    </p>

                    <div style={S.contactList}>
                        {[
                            { icon: '📍', text: 'Solapur, Maharashtra, India' },
                            { icon: '📞', text: '+91 7420927739' },
                            { icon: '✉️', text: 'buffturf@gmail.com' },
                            { icon: '🕐', text: 'Support: 9 AM – 9 PM' },
                        ].map((c, i) => (
                            <div key={i} style={S.contactRow}>
                                <span style={{ fontSize: '14px', flexShrink: 0 }}>{c.icon}</span>
                                <span style={S.contactText}>{c.text}</span>
                            </div>
                        ))}
                    </div>

                    <div style={S.socialRow}>
                        {[{ icon: '📘', label: 'Facebook' }, { icon: '📸', label: 'Instagram' }, { icon: '🐦', label: 'Twitter' }, { icon: '▶️', label: 'YouTube' }].map((s, i) => (
                            <div key={i} className="footer-social" style={S.socialBtn} title={s.label}>
                                <span style={{ fontSize: '16px' }}>{s.icon}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── QUICK LINKS ── */}
                <div style={S.col}>
                    <h4 className="footer-col-title" style={S.colTitle}>Quick Links</h4>
                    {[
                        { label: '🏠 Home', path: '/' },
                        { label: '🔍 Find Turfs', path: '/turfs' },
                        { label: '📋 My Bookings', path: '/my-bookings' },
                        { label: '🔑 Login', path: '/login' },
                        { label: '🚀 Register', path: '/register' },
                    ].map((l, i) => (
                        <p key={i} className="footer-link" style={S.link} onClick={() => navigate(l.path)}>{l.label}</p>
                    ))}
                </div>

                {/* ── SPORTS + CITIES ── */}
                <div style={S.col}>
                    <h4 className="footer-col-title" style={S.colTitle}>Sports</h4>
                    {sports.map((s, i) => (
                        <p key={i} className="footer-link" style={S.link} onClick={() => navigate(`/turfs?sportType=${s}`)}>
                            {sportEmojis[s]} {s}
                        </p>
                    ))}
                    <h4 className="footer-col-title" style={{ ...S.colTitle, marginTop: '20px' }}>Cities</h4>
                    {cities.map((c, i) => (
                        <p key={i} className="footer-link" style={S.link} onClick={() => navigate(`/turfs?location=${c}`)}>📍 {c}</p>
                    ))}
                </div>

                {/* ── LEGAL ── */}
                <div style={S.col}>
                    <h4 className="footer-col-title" style={S.colTitle}>Legal & Policies</h4>
                    {[
                        { label: '📄 About Us', path: '/about' },
                        { label: '🔒 Privacy Policy', path: '/privacy-policy' },
                        { label: '↩️ Refund Policy', path: '/refund-policy' },
                        { label: '📋 Terms & Conditions', path: '/terms' },
                        { label: '❌ Cancellation Policy', path: '/cancellation-policy' },
                        { label: '📞 Contact Us', path: '/contact' },
                    ].map((l, i) => (
                        <p key={i} className="footer-link" style={S.link} onClick={() => navigate(l.path)}>{l.label}</p>
                    ))}

                    <div style={S.payBadge}>
                        <p style={S.payLabel}>Secure Payments</p>
                        <div style={S.payIcons}>
                            {['💳 Cards', '📱 UPI', '🏦 NetBanking'].map((p, i) => (
                                <span key={i} style={S.payIcon}>{p}</span>
                            ))}
                        </div>
                        <p style={S.razorpayText}>Powered by Razorpay 🔒</p>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div style={S.bottomBar}>
                <div className="footer-bottom-inner" style={S.bottomInner}>
                    <p style={S.copyright}>© {year} BuffTURF. All Rights Reserved. Made with ❤️ in India by Jay Shinde.</p>
                    <div className="bottom-links" style={S.bottomLinks}>
                        {[{ label: 'Privacy', path: '/privacy-policy' }, { label: 'Terms', path: '/terms' }, { label: 'Refund', path: '/refund-policy' }, { label: 'Contact', path: '/contact' }].map((l, i) => (
                            <span key={i}>
                                <span className="footer-link" style={S.bottomLink} onClick={() => navigate(l.path)}>{l.label}</span>
                                {i < 3 && <span style={{ color: '#1e293b', margin: '0 8px' }}>•</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

const S = {
    footer: { backgroundColor: '#050a14', fontFamily: "'Barlow', sans-serif", position: 'relative' },
    topGlow: { height: '1px', background: 'linear-gradient(90deg, transparent, #22c55e44, #60a5fa44, transparent)' },
    grid: { maxWidth: '1200px', margin: '0 auto', padding: '60px 32px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '48px' },
    brandCol: { minWidth: 0 },
    logoRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' },
    logoText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '3px', color: '#ffffff' },
    brandDesc: { color: '#475569', fontSize: '13px', lineHeight: 1.8, marginBottom: '18px' },
    contactList: { display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '18px' },
    contactRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    contactText: { color: '#64748b', fontSize: '13px' },
    socialRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    socialBtn: { width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' },
    col: { minWidth: 0 },
    colTitle: { color: '#ffffff', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #1e293b' },
    link: { color: '#64748b', fontSize: '13px', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.2s' },
    payBadge: { marginTop: '20px', background: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #1e293b' },
    payLabel: { color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
    payIcons: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' },
    payIcon: { background: '#1e293b', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
    razorpayText: { color: '#475569', fontSize: '11px' },
    bottomBar: { borderTop: '1px solid #0f172a' },
    bottomInner: { maxWidth: '1200px', margin: '0 auto', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
    copyright: { color: '#334155', fontSize: '12px', margin: 0 },
    bottomLinks: { display: 'flex', alignItems: 'center' },
    bottomLink: { color: '#334155', fontSize: '12px', cursor: 'pointer', transition: 'color 0.2s' },
};

export default Footer;
