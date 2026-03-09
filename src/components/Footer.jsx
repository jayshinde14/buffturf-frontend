import React from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    const sports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton'];
    const cities = ['Solapur', 'Pune', 'Mumbai'];

    return (
        <footer style={styles.footer}>
            <style>{`
                .footer-link:hover { color: #22c55e !important; }
                .footer-social:hover { background: rgba(34,197,94,0.15) !important; border-color: #22c55e44 !important; transform: translateY(-2px); }
            `}</style>

            {/* Top Divider with glow */}
            <div style={styles.topGlow}/>

            <div style={styles.inner}>

                {/* ── BRAND COLUMN ── */}
                <div style={styles.brandCol}>
                    <div style={styles.logoRow}>
                        <span style={{fontSize: '28px'}}>🏟️</span>
                        <span style={styles.logoText}>Buff<span style={{color: '#22c55e'}}>TURF</span></span>
                    </div>
                    <p style={styles.brandDesc}>
                        India's premier sports turf booking platform. Book Cricket, Football, Basketball,
                        Tennis & Badminton courts instantly across Solapur, Pune & Mumbai.
                    </p>

                    {/* Contact */}
                    <div style={styles.contactList}>
                        {[
                            { icon: '📍', text: 'Solapur, Maharashtra, India' },
                            { icon: '📞', text: '+91 7420927739' },
                            { icon: '✉️', text: 'buffturf@gmail.com' },
                            { icon: '🕐', text: 'Support: 9 AM – 9 PM' },
                        ].map((c, i) => (
                            <div key={i} style={styles.contactRow}>
                                <span style={{fontSize: '14px', flexShrink: 0}}>{c.icon}</span>
                                <span style={styles.contactText}>{c.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Social */}
                    <div style={styles.socialRow}>
                        {[
                            { icon: '📘', label: 'Facebook' },
                            { icon: '📸', label: 'Instagram' },
                            { icon: '🐦', label: 'Twitter' },
                            { icon: '▶️', label: 'YouTube' },
                        ].map((s, i) => (
                            <div key={i} className="footer-social" style={styles.socialBtn} title={s.label}>
                                <span style={{fontSize: '16px'}}>{s.icon}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── QUICK LINKS ── */}
                <div style={styles.col}>
                    <h4 style={styles.colTitle}>Quick Links</h4>
                    {[
                        { label: '🏠 Home', path: '/' },
                        { label: '🔍 Find Turfs', path: '/turfs' },
                        { label: '📋 My Bookings', path: '/my-bookings' },
                        { label: '🔑 Login', path: '/login' },
                        { label: '🚀 Register', path: '/register' },
                    ].map((l, i) => (
                        <p key={i} className="footer-link" style={styles.link} onClick={() => navigate(l.path)}>
                            {l.label}
                        </p>
                    ))}
                </div>

                {/* ── SPORTS ── */}
                <div style={styles.col}>
                    <h4 style={styles.colTitle}>Sports</h4>
                    {sports.map((s, i) => {
                        const emojis = { Cricket: '🏏', Football: '⚽', Basketball: '🏀', Tennis: '🎾', Badminton: '🏸' };
                        return (
                            <p key={i} className="footer-link" style={styles.link} onClick={() => navigate(`/turfs?sportType=${s}`)}>
                                {emojis[s]} {s}
                            </p>
                        );
                    })}
                    <h4 style={{...styles.colTitle, marginTop: '24px'}}>Cities</h4>
                    {cities.map((c, i) => (
                        <p key={i} className="footer-link" style={styles.link} onClick={() => navigate(`/turfs?location=${c}`)}>
                            📍 {c}
                        </p>
                    ))}
                </div>

                {/* ── LEGAL ── */}
                <div style={styles.col}>
                    <h4 style={styles.colTitle}>Legal & Policies</h4>
                    {[
                        { label: '📄 About Us', path: '/about' },
                        { label: '🔒 Privacy Policy', path: '/privacy-policy' },
                        { label: '↩️ Refund Policy', path: '/refund-policy' },
                        { label: '📋 Terms & Conditions', path: '/terms' },
                        { label: '❌ Cancellation Policy', path: '/cancellation-policy' },
                        { label: '📞 Contact Us', path: '/contact' },
                    ].map((l, i) => (
                        <p key={i} className="footer-link" style={styles.link} onClick={() => navigate(l.path)}>
                            {l.label}
                        </p>
                    ))}

                    {/* Razorpay badge */}
                    <div style={styles.paymentBadge}>
                        <p style={styles.paymentLabel}>Secure Payments</p>
                        <div style={styles.paymentIcons}>
                            {['💳 Cards', '📱 UPI', '🏦 NetBanking'].map((p, i) => (
                                <span key={i} style={styles.paymentIcon}>{p}</span>
                            ))}
                        </div>
                        <p style={styles.razorpayText}>Powered by Razorpay 🔒</p>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div style={styles.bottomBar}>
                <div style={styles.bottomInner}>
                    <p style={styles.copyright}>
                        © {year} BuffTURF. All Rights Reserved. Made with ❤️ in India by Jay Shinde.
                    </p>
                    <div style={styles.bottomLinks}>
                        {[
                            { label: 'Privacy', path: '/privacy-policy' },
                            { label: 'Terms', path: '/terms' },
                            { label: 'Refund', path: '/refund-policy' },
                            { label: 'Contact', path: '/contact' },
                        ].map((l, i) => (
                            <span key={i}>
                                <span className="footer-link" style={styles.bottomLink} onClick={() => navigate(l.path)}>
                                    {l.label}
                                </span>
                                {i < 3 && <span style={{color: '#1e293b', margin: '0 8px'}}>•</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: { backgroundColor: '#050a14', fontFamily: "'Barlow', sans-serif", position: 'relative' },
    topGlow: { height: '1px', background: 'linear-gradient(90deg, transparent, #22c55e44, #60a5fa44, transparent)' },

    inner: { maxWidth: '1200px', margin: '0 auto', padding: '60px 32px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '48px', flexWrap: 'wrap' },

    brandCol: { minWidth: '220px' },
    logoRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
    logoText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '3px', color: '#ffffff' },
    brandDesc: { color: '#475569', fontSize: '13px', lineHeight: 1.8, marginBottom: '20px' },

    contactList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
    contactRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    contactText: { color: '#64748b', fontSize: '13px' },

    socialRow: { display: 'flex', gap: '10px' },
    socialBtn: { width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' },

    col: { minWidth: '130px' },
    colTitle: { color: '#ffffff', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #1e293b' },
    link: { color: '#64748b', fontSize: '13px', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.2s' },

    paymentBadge: { marginTop: '24px', background: '#0f172a', borderRadius: '10px', padding: '14px', border: '1px solid #1e293b' },
    paymentLabel: { color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
    paymentIcons: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' },
    paymentIcon: { background: '#1e293b', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
    razorpayText: { color: '#475569', fontSize: '11px' },

    bottomBar: { borderTop: '1px solid #0f172a' },
    bottomInner: { maxWidth: '1200px', margin: '0 auto', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
    copyright: { color: '#334155', fontSize: '12px' },
    bottomLinks: { display: 'flex', alignItems: 'center' },
    bottomLink: { color: '#334155', fontSize: '12px', cursor: 'pointer', transition: 'color 0.2s' },
};

export default Footer;
