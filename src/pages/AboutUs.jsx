import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutUs() {
    const navigate = useNavigate();

    const team = [
        { name: 'Jay Shinde', role: 'Founder & Developer', emoji: '👨‍💻', desc: 'Built BuffTURF from scratch with passion for sports and technology.' },
    ];

    const stats = [
        { val: '14+', label: 'Turfs Listed', icon: '🏟️', color: '#22c55e' },
        { val: '5', label: 'Sports', icon: '🏆', color: '#60a5fa' },
        { val: '3', label: 'Cities', icon: '📍', color: '#fb923c' },
        { val: '24/7', label: 'Booking', icon: '⚡', color: '#e879f9' },
    ];

    return (
        <div style={styles.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');`}</style>
            <Navbar />

            {/* Hero */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <p style={styles.heroTag}>🏟️ ABOUT US</p>
                    <h1 style={styles.heroTitle}>Built For <span style={{color: '#22c55e'}}>Sports</span> Lovers</h1>
                    <p style={styles.heroSub}>BuffTURF is India's premier sports turf booking platform, making it easy to find and book Cricket, Football, Basketball, Tennis & Badminton courts instantly.</p>
                </div>
            </div>

            <div style={styles.body}>

                {/* Stats */}
                <div style={styles.statsGrid}>
                    {stats.map((s, i) => (
                        <div key={i} style={{...styles.statCard, border: `1px solid ${s.color}22`}}>
                            <span style={{fontSize: '32px'}}>{s.icon}</span>
                            <p style={{...styles.statVal, color: s.color}}>{s.val}</p>
                            <p style={styles.statLabel}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Our Story */}
                <div style={styles.section}>
                    <h2 style={styles.secTitle}>📖 Our Story</h2>
                    <div style={styles.storyCard}>
                        <p style={styles.storyText}>
                            BuffTURF was born out of a simple frustration — finding and booking a sports turf in India was unnecessarily complicated.
                            Phone calls, advance payments with no confirmation, and no way to check real-time availability made the experience frustrating for players.
                        </p>
                        <p style={styles.storyText}>
                            We built BuffTURF to solve exactly this problem. Our platform lets you browse verified sports venues, check live slot availability,
                            book instantly with secure online payment, and get a digital receipt — all in under 2 minutes.
                        </p>
                        <p style={styles.storyText}>
                            Starting from Solapur, Maharashtra, we are expanding across Pune, Mumbai and beyond — bringing the joy of sports closer to everyone.
                        </p>
                    </div>
                </div>

                {/* Mission */}
                <div style={styles.missionGrid}>
                    {[
                        { icon: '🎯', title: 'Our Mission', text: 'To make sports accessible to everyone by simplifying turf discovery and booking across India.', color: '#22c55e' },
                        { icon: '👁️', title: 'Our Vision', text: 'To become India\'s #1 sports infrastructure platform connecting players with premium venues nationwide.', color: '#60a5fa' },
                        { icon: '💎', title: 'Our Values', text: 'Transparency, reliability, and a passion for sports drive everything we build at BuffTURF.', color: '#fb923c' },
                    ].map((m, i) => (
                        <div key={i} style={{...styles.missionCard, borderTop: `3px solid ${m.color}`}}>
                            <span style={{fontSize: '36px', marginBottom: '12px', display: 'block'}}>{m.icon}</span>
                            <h3 style={{...styles.missionTitle, color: m.color}}>{m.title}</h3>
                            <p style={styles.missionText}>{m.text}</p>
                        </div>
                    ))}
                </div>

                {/* What We Offer */}
                <div style={styles.section}>
                    <h2 style={styles.secTitle}>🏆 What We Offer</h2>
                    <div style={styles.offerGrid}>
                        {[
                            { icon: '📅', title: 'Instant Booking', text: 'Book any turf in seconds with real-time slot availability.' },
                            { icon: '💳', title: 'Secure Payments', text: 'Pay safely via UPI, Cards, Net Banking through Razorpay.' },
                            { icon: '🧾', title: 'Digital Receipt', text: 'Get a detailed PDF receipt for every booking instantly.' },
                            { icon: '❌', title: 'Easy Cancellation', text: 'Cancel bookings easily through your dashboard.' },
                            { icon: '👑', title: 'Admin Controls', text: 'Full admin panel for turf owners to manage bookings.' },
                            { icon: '📊', title: 'Earnings Tracking', text: 'Real-time revenue and booking analytics for owners.' },
                        ].map((o, i) => (
                            <div key={i} style={styles.offerCard}>
                                <span style={{fontSize: '28px', marginBottom: '10px', display: 'block'}}>{o.icon}</span>
                                <h4 style={styles.offerTitle}>{o.title}</h4>
                                <p style={styles.offerText}>{o.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div style={styles.ctaBox}>
                    <h2 style={styles.ctaTitle}>Ready to Play? 🚀</h2>
                    <p style={styles.ctaSub}>Join BuffTURF today and book your first turf in under 2 minutes!</p>
                    <button style={styles.ctaBtn} onClick={() => navigate('/turfs')}>🏟️ Find Turfs Now</button>
                </div>
            </div>

            <Footer />
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },
    hero: { background: 'linear-gradient(135deg, #080e1f, #0c1528)', padding: '80px 32px', textAlign: 'center', borderBottom: '1px solid #1e293b' },
    heroContent: { maxWidth: '700px', margin: '0 auto' },
    heroTag: { color: '#22c55e', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', marginBottom: '16px' },
    heroTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '64px', letterSpacing: '2px', marginBottom: '16px' },
    heroSub: { color: '#64748b', fontSize: '16px', lineHeight: 1.8 },
    body: { maxWidth: '1100px', margin: '0 auto', padding: '60px 32px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '60px' },
    statCard: { background: '#111827', borderRadius: '14px', padding: '28px', textAlign: 'center' },
    statVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', letterSpacing: '2px', margin: '8px 0 4px 0' },
    statLabel: { color: '#64748b', fontSize: '13px' },
    section: { marginBottom: '60px' },
    secTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '36px', letterSpacing: '2px', marginBottom: '24px' },
    storyCard: { background: '#111827', borderRadius: '14px', padding: '32px', border: '1px solid #1e293b', borderLeft: '4px solid #22c55e' },
    storyText: { color: '#94a3b8', fontSize: '15px', lineHeight: 1.9, marginBottom: '16px' },
    missionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '60px' },
    missionCard: { background: '#111827', borderRadius: '14px', padding: '28px', border: '1px solid #1e293b' },
    missionTitle: { fontSize: '18px', fontWeight: '800', marginBottom: '10px' },
    missionText: { color: '#64748b', fontSize: '14px', lineHeight: 1.7 },
    offerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
    offerCard: { background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1e293b' },
    offerTitle: { color: '#ffffff', fontSize: '15px', fontWeight: '800', marginBottom: '6px' },
    offerText: { color: '#64748b', fontSize: '13px', lineHeight: 1.7 },
    ctaBox: { background: 'linear-gradient(135deg, #052e16, #0c1a3a)', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #1e293b' },
    ctaTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '48px', letterSpacing: '2px', marginBottom: '12px' },
    ctaSub: { color: '#64748b', fontSize: '15px', marginBottom: '24px' },
    ctaBtn: { background: '#22c55e', color: '#000', border: 'none', padding: '16px 36px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: 'pointer' },
};

export default AboutUs;
