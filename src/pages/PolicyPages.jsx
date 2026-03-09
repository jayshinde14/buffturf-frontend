// ─── PRIVACY POLICY ─────────────────────────────────────────────
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PolicyPage({ title, icon, color, sections }) {
    return (
        <div style={styles.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');`}</style>
            <Navbar />
            <div style={styles.hero}>
                <span style={{fontSize: '48px'}}>{icon}</span>
                <h1 style={{...styles.heroTitle, color}}>{title}</h1>
                <p style={styles.heroSub}>Last updated: March 2026 &nbsp;•&nbsp; BuffTURF, Solapur, Maharashtra</p>
            </div>
            <div style={styles.body}>
                {sections.map((s, i) => (
                    <div key={i} style={styles.section}>
                        <h2 style={{...styles.secTitle, borderLeft: `3px solid ${color}`}}>{s.title}</h2>
                        <div style={styles.secContent}>
                            {s.content.map((c, j) => (
                                <p key={j} style={styles.para}>{c}</p>
                            ))}
                        </div>
                    </div>
                ))}
                <div style={styles.contactBox}>
                    <p style={styles.contactText}>
                        📬 For any questions, contact us at <span style={{color: '#22c55e'}}>buffturf@gmail.com</span> or call <span style={{color: '#22c55e'}}>+91 7420927739</span>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export function PrivacyPolicy() {
    return <PolicyPage
        title="Privacy Policy"
        icon="🔒"
        color="#60a5fa"
        sections={[
            {
                title: "1. Information We Collect",
                content: [
                    "When you register on BuffTURF, we collect personal information including your name, email address, phone number, and government ID details provided during booking.",
                    "We also collect booking information such as turf preferences, selected time slots, payment transaction details, and booking history.",
                    "Technical data including IP address, browser type, device information, and usage patterns are collected automatically when you use our platform.",
                ]
            },
            {
                title: "2. How We Use Your Information",
                content: [
                    "Your information is used to process bookings, send booking confirmations, and provide customer support.",
                    "We use your contact details to send important booking updates, payment receipts, and service notifications.",
                    "Payment information is processed securely through Razorpay and is never stored on our servers.",
                    "We may use anonymized data to improve our platform, analyze usage patterns, and enhance user experience.",
                ]
            },
            {
                title: "3. Data Security",
                content: [
                    "BuffTURF uses industry-standard encryption (HTTPS/SSL) to protect all data transmitted between your browser and our servers.",
                    "All passwords are encrypted using BCrypt hashing and are never stored in plain text.",
                    "Payment processing is handled entirely by Razorpay, a PCI-DSS compliant payment gateway. We do not store card or UPI details.",
                    "We regularly review and update our security practices to protect your personal information.",
                ]
            },
            {
                title: "4. Data Sharing",
                content: [
                    "We do not sell, trade, or share your personal information with third parties except as required to provide our services.",
                    "Turf owners may receive your name and contact details to facilitate your booking.",
                    "We may share data with law enforcement agencies if required by law or to prevent fraud.",
                ]
            },
            {
                title: "5. Cookies",
                content: [
                    "BuffTURF uses cookies and local storage to maintain your login session and improve your browsing experience.",
                    "You can disable cookies in your browser settings, but this may affect certain features of the platform.",
                ]
            },
            {
                title: "6. Your Rights",
                content: [
                    "You have the right to access, update, or delete your personal information at any time by contacting us.",
                    "You can request a copy of all data we hold about you by emailing buffturf@gmail.com.",
                    "You may opt out of marketing communications at any time.",
                ]
            },
        ]}
    />;
}

export function RefundPolicy() {
    return <PolicyPage
        title="Refund Policy"
        icon="↩️"
        color="#4ade80"
        sections={[
            {
                title: "1. Refund Eligibility",
                content: [
                    "BuffTURF offers refunds under specific conditions as outlined in this policy. Please read carefully before making a booking.",
                    "Refund requests must be submitted through your account dashboard or by emailing buffturf@gmail.com with your booking ID.",
                ]
            },
            {
                title: "2. Full Refund (100%)",
                content: [
                    "You are eligible for a full refund if you cancel your booking more than 24 hours before the scheduled slot start time.",
                    "Full refunds are also issued if the turf is unavailable due to maintenance, weather, or other operational issues beyond your control.",
                    "Technical errors that result in double payments will be fully refunded within 5-7 business days.",
                ]
            },
            {
                title: "3. Partial Refund (50%)",
                content: [
                    "If you cancel between 12 to 24 hours before your scheduled slot, a 50% refund will be processed.",
                    "Partial refunds are credited back to the original payment method within 5-7 business days.",
                ]
            },
            {
                title: "4. No Refund",
                content: [
                    "No refund will be issued for cancellations made less than 12 hours before the scheduled slot start time.",
                    "No refund is applicable for no-shows (failing to arrive at the turf at the scheduled time).",
                    "Bookings that have already been used (slot has started) are not eligible for refunds.",
                ]
            },
            {
                title: "5. Refund Process",
                content: [
                    "Approved refunds are processed within 5-7 business days to the original payment method.",
                    "UPI and wallet refunds are typically processed within 1-3 business days.",
                    "Credit/debit card refunds may take 5-10 business days depending on your bank.",
                    "You will receive an email confirmation when your refund is initiated.",
                ]
            },
            {
                title: "6. How to Request a Refund",
                content: [
                    "Step 1: Log in to your BuffTURF account.",
                    "Step 2: Go to 'My Bookings' and find the booking you wish to cancel.",
                    "Step 3: Click 'Cancel Booking'. The refund will be automatically processed based on the time remaining.",
                    "For disputes or issues, email us at buffturf@gmail.com with subject 'Refund Request - [Booking ID]'.",
                ]
            },
        ]}
    />;
}

export function TermsAndConditions() {
    return <PolicyPage
        title="Terms & Conditions"
        icon="📋"
        color="#f59e0b"
        sections={[
            {
                title: "1. Acceptance of Terms",
                content: [
                    "By registering and using BuffTURF (buffturf-sports.vercel.app), you agree to be bound by these Terms and Conditions.",
                    "If you do not agree with any part of these terms, please do not use our platform.",
                    "We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.",
                ]
            },
            {
                title: "2. User Accounts",
                content: [
                    "You must be at least 18 years old to register and make bookings on BuffTURF.",
                    "You are responsible for maintaining the confidentiality of your account credentials.",
                    "You agree to provide accurate and truthful information during registration and booking.",
                    "BuffTURF reserves the right to suspend or terminate accounts that violate these terms.",
                ]
            },
            {
                title: "3. Booking Terms",
                content: [
                    "All bookings are subject to availability and are confirmed only after successful payment.",
                    "A booking confirmation receipt will be sent via email and displayed on screen after payment.",
                    "You must arrive at the turf at least 10 minutes before your scheduled slot.",
                    "Carry a valid government-issued ID for verification at the turf entrance.",
                    "BuffTURF acts as a booking platform and is not directly responsible for the quality of turf facilities.",
                ]
            },
            {
                title: "4. Payments",
                content: [
                    "All payments are processed securely through Razorpay, a RBI-authorized payment gateway.",
                    "Prices displayed are inclusive of all applicable taxes.",
                    "BuffTURF reserves the right to change pricing at any time. However, confirmed bookings will not be affected.",
                    "In case of payment failure, do not attempt multiple payments. Contact support at buffturf@gmail.com.",
                ]
            },
            {
                title: "5. Code of Conduct",
                content: [
                    "Users must behave respectfully at all turf facilities and follow the rules set by turf owners.",
                    "Any damage caused to the facility during your slot may result in additional charges.",
                    "Misuse of the platform, including fraudulent bookings, will result in immediate account termination.",
                ]
            },
            {
                title: "6. Limitation of Liability",
                content: [
                    "BuffTURF is not liable for any injuries, accidents, or losses that occur during your use of turf facilities.",
                    "We are not responsible for last-minute cancellations by turf owners, though we will assist in finding alternatives or processing refunds.",
                    "Maximum liability of BuffTURF shall not exceed the amount paid for the specific booking in question.",
                ]
            },
            {
                title: "7. Governing Law",
                content: [
                    "These terms are governed by the laws of India.",
                    "Any disputes shall be resolved in the courts of Solapur, Maharashtra, India.",
                    "For any legal concerns, contact us at buffturf@gmail.com.",
                ]
            },
        ]}
    />;
}

export function CancellationPolicy() {
    return <PolicyPage
        title="Cancellation Policy"
        icon="❌"
        color="#ef4444"
        sections={[
            {
                title: "1. Cancellation Window",
                content: [
                    "You can cancel your booking at any time before the slot start time through the 'My Bookings' section.",
                    "The refund amount depends on how early you cancel before the scheduled slot.",
                ]
            },
            {
                title: "2. Cancellation Timeline",
                content: [
                    "✅ More than 24 hours before slot: Full refund (100%)",
                    "⚠️ 12 to 24 hours before slot: 50% refund",
                    "❌ Less than 12 hours before slot: No refund",
                    "❌ After slot start time: No refund, No cancellation",
                ]
            },
            {
                title: "3. How to Cancel",
                content: [
                    "Login to your BuffTURF account and go to 'My Bookings'.",
                    "Find the booking you wish to cancel and click the 'Cancel Booking' button.",
                    "The cancellation will be processed immediately and the slot will be released for others.",
                    "Refund (if applicable) will be initiated within 24 hours.",
                ]
            },
            {
                title: "4. Cancellation by BuffTURF",
                content: [
                    "In rare cases, BuffTURF or the turf owner may cancel a booking due to maintenance, weather, or operational issues.",
                    "In such cases, a full 100% refund will be automatically processed within 24 hours.",
                    "You will be notified via email and phone about any cancellations from our side.",
                ]
            },
            {
                title: "5. Rescheduling",
                content: [
                    "BuffTURF currently does not support direct rescheduling. To reschedule, cancel your existing booking and create a new one.",
                    "Refund policies apply to the cancelled booking as per the cancellation timeline above.",
                    "We are working on adding a rescheduling feature. Stay tuned!",
                ]
            },
        ]}
    />;
}

export function ContactUs() {
    return (
        <div style={styles.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');`}</style>
            <Navbar />
            <div style={styles.hero}>
                <span style={{fontSize: '48px'}}>📞</span>
                <h1 style={{...styles.heroTitle, color: '#22c55e'}}>Contact Us</h1>
                <p style={styles.heroSub}>We're here to help! Reach out anytime.</p>
            </div>
            <div style={styles.body}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px'}}>
                    {[
                        { icon: '✉️', title: 'Email Us', value: 'buffturf@gmail.com', sub: 'We reply within 24 hours', color: '#60a5fa' },
                        { icon: '📞', title: 'Call Us', value: '+91 7420927739', sub: '9 AM – 9 PM, Mon-Sat', color: '#22c55e' },
                        { icon: '📍', title: 'Our Location', value: 'Solapur, Maharashtra', sub: 'India - 413001', color: '#fb923c' },
                        { icon: '⏰', title: 'Support Hours', value: '9 AM – 9 PM', sub: 'Monday to Saturday', color: '#e879f9' },
                    ].map((c, i) => (
                        <div key={i} style={{background: '#111827', borderRadius: '14px', padding: '28px', border: `1px solid ${c.color}22`, textAlign: 'center'}}>
                            <span style={{fontSize: '36px'}}>{c.icon}</span>
                            <h3 style={{color: c.color, fontSize: '16px', fontWeight: '800', margin: '12px 0 6px 0'}}>{c.title}</h3>
                            <p style={{color: '#ffffff', fontSize: '15px', fontWeight: '700', marginBottom: '4px'}}>{c.value}</p>
                            <p style={{color: '#64748b', fontSize: '13px'}}>{c.sub}</p>
                        </div>
                    ))}
                </div>

                <div style={{background: '#111827', borderRadius: '14px', padding: '32px', border: '1px solid #1e293b', borderLeft: '4px solid #22c55e'}}>
                    <h2 style={{fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '28px', letterSpacing: '2px', marginBottom: '8px'}}>For Booking Issues</h2>
                    <p style={{color: '#64748b', fontSize: '14px', lineHeight: 1.8, marginBottom: '16px'}}>
                        If you're facing issues with a booking, payment, or have a complaint, please email us at
                        <span style={{color: '#22c55e'}}> buffturf@gmail.com</span> with:
                    </p>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                        {['Your registered email address', 'Booking ID (e.g., BUFF-XXXXXXXX)', 'Description of the issue', 'Screenshots if applicable'].map((item, i) => (
                            <div key={i} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <span style={{color: '#22c55e', fontSize: '16px'}}>✅</span>
                                <span style={{color: '#94a3b8', fontSize: '14px'}}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },
    hero: { background: 'linear-gradient(135deg, #080e1f, #0c1528)', padding: '80px 32px', textAlign: 'center', borderBottom: '1px solid #1e293b' },
    heroTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', letterSpacing: '2px', margin: '12px 0 8px 0' },
    heroSub: { color: '#64748b', fontSize: '14px' },
    body: { maxWidth: '900px', margin: '0 auto', padding: '60px 32px' },
    section: { marginBottom: '36px' },
    secTitle: { color: '#ffffff', fontSize: '18px', fontWeight: '800', marginBottom: '16px', paddingLeft: '14px', paddingBottom: '8px' },
    secContent: { background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1e293b' },
    para: { color: '#94a3b8', fontSize: '14px', lineHeight: 1.9, marginBottom: '12px' },
    contactBox: { background: '#0f172a', borderRadius: '10px', padding: '20px', border: '1px solid #1e293b', textAlign: 'center', marginTop: '40px' },
    contactText: { color: '#64748b', fontSize: '14px' },
};
