import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function BookingConfirmation() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const booking = state?.booking;
    const receiptRef = useRef();

    if (!booking) {
        return (
            <div style={styles.page}>
                <Navbar />
                <div style={styles.center}>
                    <p style={{ color: '#ef4444', fontSize: '18px', marginBottom: '20px' }}>❌ No booking found!</p>
                    <button style={styles.greenBtn} onClick={() => navigate('/')}>Go Home</button>
                </div>
            </div>
        );
    }

    const sportColors = { Football: '#60a5fa', Cricket: '#4ade80', Basketball: '#fb923c', Badminton: '#e879f9', Tennis: '#a3e635' };
    const sportEmojis = { Football: '⚽', Cricket: '🏏', Basketball: '🏀', Badminton: '🏸', Tennis: '🎾' };
    const color = sportColors[booking.turf?.sportType] || '#22c55e';
    const emoji = sportEmojis[booking.turf?.sportType] || '🏟️';

    const formatTime = (time) => {
        if (!time) return '';
        const [h, m] = time.toString().split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return `${hour % 12 || 12}:${m || '00'} ${ampm}`;
    };

    const handleDownloadPDF = () => {
        const printContent = receiptRef.current;
        const originalBody = document.body.innerHTML;
        const printStyles = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #fff; font-family: 'Barlow', sans-serif; padding: 20px; }
                .receipt-wrapper { max-width: 600px; margin: 0 auto; background: #fff; }
                .receipt-top { background: #050a14; color: white; padding: 32px; text-align: center; border-radius: 12px 12px 0 0; }
                .receipt-logo { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 4px; color: ${color}; }
                .receipt-subtitle { color: rgba(255,255,255,0.5); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
                .receipt-check { width: 64px; height: 64px; background: ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 16px auto; font-size: 32px; }
                .receipt-paid { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 3px; color: ${color}; margin-top: 8px; }
                .receipt-body { background: #f8fafc; padding: 28px; }
                .receipt-section { background: white; border-radius: 10px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0; }
                .receipt-section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
                .receipt-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
                .receipt-row-label { color: #64748b; font-size: 13px; }
                .receipt-row-value { color: #1e293b; font-size: 13px; font-weight: 700; text-align: right; }
                .receipt-amount { font-size: 28px; font-weight: 800; color: ${color}; text-align: center; padding: 20px; background: white; border-radius: 10px; margin-bottom: 16px; border: 2px solid ${color}22; }
                .receipt-player { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
                .receipt-player-idx { background: ${color}22; color: ${color}; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
                .receipt-footer { background: #050a14; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
                .receipt-code { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 4px; color: ${color}; }
                .receipt-footer-note { color: rgba(255,255,255,0.3); font-size: 11px; margin-top: 8px; }
                .receipt-divider { border: none; border-top: 2px dashed #e2e8f0; margin: 16px 0; }
                .turf-hero { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
                .turf-emoji { font-size: 32px; background: ${color}18; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
                .turf-name { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; color: #1e293b; }
                .turf-loc { color: #64748b; font-size: 13px; margin-top: 2px; }
                .status-badge { display: inline-block; background: #22c55e22; color: #16a34a; border: 1px solid #22c55e44; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; }
                .payment-id { font-family: monospace; font-size: 12px; color: #94a3b8; word-break: break-all; }
            </style>
        `;

        const receiptHTML = `
            <!DOCTYPE html>
            <html>
            <head><title>BuffTURF Receipt - ${booking.bookingCode}</title>${printStyles}</head>
            <body>
                <div class="receipt-wrapper">
                    <div class="receipt-top">
                        <div class="receipt-logo">BUFF<span style="color:white">TURF</span></div>
                        <div class="receipt-subtitle">Official Booking Receipt</div>
                        <div class="receipt-check">✓</div>
                        <div class="receipt-paid">Payment Successful</div>
                        <div style="color:rgba(255,255,255,0.5); font-size:12px; margin-top:8px;">
                            ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div class="receipt-body">
                        <!-- Amount -->
                        <div class="receipt-amount">
                            ₹${booking.turf?.pricePerHour || 0}
                            <div style="font-size:13px; color:#64748b; font-weight:400; margin-top:4px;">Total Amount Paid</div>
                        </div>

                        <!-- Turf Details -->
                        <div class="receipt-section">
                            <div class="receipt-section-title">Turf Details</div>
                            <div class="turf-hero">
                                <div class="turf-emoji">${emoji}</div>
                                <div>
                                    <div class="turf-name">${booking.turf?.name || 'N/A'}</div>
                                    <div class="turf-loc">📍 ${booking.turf?.location || 'N/A'} &nbsp;•&nbsp; ${booking.turf?.sportType || ''}</div>
                                </div>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-row-label">📅 Booking Date</span>
                                <span class="receipt-row-value">${booking.bookingDate}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-row-label">⏰ Time Slot</span>
                                <span class="receipt-row-value">${booking.slot ? `${formatTime(booking.slot.startTime)} → ${formatTime(booking.slot.endTime)}` : 'N/A'}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-row-label">👤 Booked By</span>
                                <span class="receipt-row-value">${booking.user?.username || 'N/A'}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-row-label">👥 Total Players</span>
                                <span class="receipt-row-value">${booking.players?.length || 1}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-row-label">📌 Status</span>
                                <span class="status-badge">✅ CONFIRMED & PAID</span>
                            </div>
                        </div>

                        <!-- Payment Info -->
                        <div class="receipt-section">
                            <div class="receipt-section-title">Payment Details</div>
                            <div class="receipt-row">
                                <span class="receipt-row-label">💰 Amount</span>
                                <span class="receipt-row-value" style="color:${color}; font-size:18px;">₹${booking.turf?.pricePerHour || 0}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-row-label">💳 Payment Method</span>
                                <span class="receipt-row-value">Razorpay</span>
                            </div>
                            <div class="receipt-row">
                                <span class="receipt-row-label">🧾 Booking ID</span>
                                <span class="receipt-row-value" style="color:${color};">${booking.bookingCode}</span>
                            </div>
                            ${booking.paymentId ? `
                            <div class="receipt-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                                <span class="receipt-row-label">🔑 Payment ID</span>
                                <span class="payment-id">${booking.paymentId}</span>
                            </div>` : ''}
                        </div>

                        <!-- Players List -->
                        ${booking.players && booking.players.length > 0 ? `
                        <div class="receipt-section">
                            <div class="receipt-section-title">Players (${booking.players.length})</div>
                            ${booking.players.map((p, i) => `
                                <div class="receipt-player">
                                    <div class="receipt-player-idx">${i + 1}</div>
                                    <div style="flex:1; color:#1e293b; font-weight:700;">${p.name || 'N/A'}</div>
                                    <div style="color:#64748b; font-size:12px;">${p.gender || ''}</div>
                                    <div style="color:#94a3b8; font-size:12px; margin-left:8px;">${p.contact || ''}</div>
                                </div>
                            `).join('')}
                        </div>` : ''}

                        <!-- Instructions -->
                        <div class="receipt-section" style="border-left: 3px solid #f59e0b;">
                            <div class="receipt-section-title" style="color:#f59e0b;">📌 Important Instructions</div>
                            <div style="color:#64748b; font-size:13px; line-height:1.8;">
                                • Arrive 10 minutes before your slot time<br/>
                                • Show this receipt to the turf owner at entrance<br/>
                                • Carry a valid Government ID<br/>
                                • No refund after slot start time<br/>
                                • Contact support for any issues
                            </div>
                        </div>
                    </div>

                    <div class="receipt-footer">
                        <div style="color:rgba(255,255,255,0.4); font-size:11px; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Booking Reference</div>
                        <div class="receipt-code">${booking.bookingCode}</div>
                        <div class="receipt-footer-note">Thank you for choosing BuffTURF • buffturf-sports.vercel.app</div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                @keyframes popIn { from { opacity:0; transform:scale(0.95) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes checkPop { from { transform:scale(0) rotate(-180deg); } to { transform:scale(1) rotate(0deg); } }
                @keyframes shimmer { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
                .receipt-card { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
                .download-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px ${color}44 !important; }
                .action-btn:hover { transform: translateY(-2px); }
            `}</style>
            <Navbar />

            <div style={styles.body}>

                {/* Success Header */}
                <div style={styles.successHeader}>
                    <div style={{ ...styles.checkCircle, background: `linear-gradient(135deg, ${color}, ${color}bb)`, boxShadow: `0 0 40px ${color}44` }}>
                        ✓
                    </div>
                    <h1 style={styles.successTitle}>Payment Successful!</h1>
                    <p style={styles.successSub}>Your turf is booked! Show this receipt to the turf owner.</p>
                </div>

                {/* Receipt Card */}
                <div className="receipt-card" style={styles.receiptCard} ref={receiptRef}>

                    {/* Receipt Header */}
                    <div style={{ ...styles.receiptHeader, background: `linear-gradient(135deg, #080e1f, #0c1528)` }}>
                        <div style={styles.receiptHeaderLeft}>
                            <p style={{ ...styles.logoText, color }}>BUFF<span style={{ color: '#fff' }}>TURF</span></p>
                            <p style={styles.officialText}>Official Booking Receipt</p>
                        </div>
                        <div style={styles.receiptHeaderRight}>
                            <p style={styles.receiptIdLabel}>Receipt No.</p>
                            <p style={{ ...styles.receiptId, color }}>{booking.bookingCode}</p>
                            <span style={styles.paidBadge}>✅ PAID</span>
                        </div>
                    </div>

                    {/* Amount Banner */}
                    <div style={{ ...styles.amountBanner, background: color + '12', borderBottom: `1px solid ${color}22` }}>
                        <div>
                            <p style={styles.amountLabel}>Total Amount Paid</p>
                            <p style={{ ...styles.amountValue, color }}>₹{booking.turf?.pricePerHour || 0}</p>
                        </div>
                        <div style={styles.amountRight}>
                            <span style={{ fontSize: '48px' }}>{emoji}</span>
                        </div>
                    </div>

                    <div style={styles.receiptBody}>

                        {/* Turf Info */}
                        <div style={styles.section}>
                            <p style={styles.sectionTitle}>🏟️ Turf Details</p>
                            <div style={{ ...styles.turfHero, borderLeft: `3px solid ${color}` }}>
                                <div>
                                    <p style={{ ...styles.turfName, color }}>{booking.turf?.name || 'N/A'}</p>
                                    <p style={styles.turfMeta}>📍 {booking.turf?.location || 'N/A'} &nbsp;•&nbsp; {booking.turf?.sportType}</p>
                                </div>
                            </div>
                            <div style={styles.detailsGrid}>
                                {[
                                    { label: '📅 Booking Date', value: booking.bookingDate },
                                    { label: '⏰ Time Slot', value: booking.slot ? `${formatTime(booking.slot.startTime)} → ${formatTime(booking.slot.endTime)}` : 'N/A' },
                                    { label: '👤 Booked By', value: booking.user?.username || 'N/A' },
                                    { label: '👥 Total Players', value: booking.players?.length || 1 },
                                ].map((d, i) => (
                                    <div key={i} style={styles.detailRow}>
                                        <span style={styles.detailLabel}>{d.label}</span>
                                        <span style={styles.detailValue}>{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.divider} />

                        {/* Payment Info */}
                        <div style={styles.section}>
                            <p style={styles.sectionTitle}>💳 Payment Details</p>
                            <div style={styles.detailsGrid}>
                                {[
                                    { label: '💰 Amount Paid', value: `₹${booking.turf?.pricePerHour || 0}`, highlight: true },
                                    { label: '💳 Payment Via', value: booking.paymentId ? 'Razorpay' : 'Confirmed' },
                                    { label: '📌 Booking Status', value: '✅ CONFIRMED & PAID' },
                                    { label: '🕐 Booked On', value: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN') },
                                ].map((d, i) => (
                                    <div key={i} style={styles.detailRow}>
                                        <span style={styles.detailLabel}>{d.label}</span>
                                        <span style={{ ...styles.detailValue, color: d.highlight ? color : '#ffffff', fontSize: d.highlight ? '18px' : '14px' }}>{d.value}</span>
                                    </div>
                                ))}
                                {booking.paymentId && (
                                    <div style={{ ...styles.detailRow, flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                        <span style={styles.detailLabel}>🔑 Payment ID</span>
                                        <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all' }}>{booking.paymentId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={styles.divider} />

                        {/* Players List */}
                        {booking.players && booking.players.length > 0 && (
                            <div style={styles.section}>
                                <p style={styles.sectionTitle}>👥 Players ({booking.players.length})</p>
                                <div style={styles.playersList}>
                                    {/* Header */}
                                    <div style={{ ...styles.playerRow, background: '#0f172a', borderRadius: '8px 8px 0 0', padding: '8px 14px' }}>
                                        <span style={{ ...styles.playerIdx, background: 'transparent', color: '#475569', fontSize: '11px' }}>#</span>
                                        <span style={{ color: '#475569', fontSize: '11px', fontWeight: '700', flex: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</span>
                                        <span style={{ color: '#475569', fontSize: '11px', fontWeight: '700', width: '60px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gender</span>
                                        <span style={{ color: '#475569', fontSize: '11px', fontWeight: '700', width: '100px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact</span>
                                        <span style={{ color: '#475569', fontSize: '11px', fontWeight: '700', width: '120px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Govt ID</span>
                                    </div>
                                    {booking.players.map((p, i) => (
                                        <div key={i} style={{ ...styles.playerRow, background: i % 2 === 0 ? '#0a0f1e' : '#0f172a' }}>
                                            <span style={{ ...styles.playerIdx, background: color + '22', color }}>{i + 1}</span>
                                            <span style={{ color: '#ffffff', fontWeight: '700', flex: 1, fontSize: '13px' }}>{p.name || 'N/A'}</span>
                                            <span style={{ color: '#94a3b8', fontSize: '12px', width: '60px' }}>{p.gender || 'N/A'}</span>
                                            <span style={{ color: '#94a3b8', fontSize: '12px', width: '100px' }}>{p.contact || 'N/A'}</span>
                                            <span style={{ color: '#64748b', fontSize: '11px', fontFamily: 'monospace', width: '120px' }}>{p.governmentId || 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={styles.divider} />

                        {/* Instructions */}
                        <div style={{ ...styles.noteBox, borderLeft: `3px solid #f59e0b` }}>
                            <p style={styles.noteTitle}>📌 Important Instructions</p>
                            <p style={styles.noteText}>
                                • Arrive 10 minutes before your slot time<br />
                                • Show this receipt to the turf owner at entrance<br />
                                • Carry a valid Government ID<br />
                                • No refund after slot start time<br />
                                • Contact support for any issues
                            </p>
                        </div>
                    </div>

                    {/* Receipt Footer */}
                    <div style={styles.receiptFooter}>
                        <p style={styles.footerBrand}>BuffTURF • buffturf-sports.vercel.app</p>
                        <p style={styles.footerNote}>This is an official booking receipt. Keep it safe.</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={styles.actionRow}>
                    <button className="action-btn" style={styles.homeBtn} onClick={() => navigate('/')}>
                        🏠 Go Home
                    </button>
                    <button className="action-btn" style={styles.myBookingsBtn} onClick={() => navigate('/my-bookings')}>
                        📋 My Bookings
                    </button>
                    <button className="download-btn" style={{ ...styles.downloadBtn, background: color, boxShadow: `0 4px 20px ${color}33` }} onClick={handleDownloadPDF}>
                        ⬇ Download Receipt PDF
                    </button>
                </div>

            </div>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },
    center: { textAlign: 'center', padding: '80px' },
    greenBtn: { background: '#22c55e', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '800' },
    body: { maxWidth: '780px', margin: '0 auto', padding: '40px 24px 60px' },

    successHeader: { textAlign: 'center', marginBottom: '32px' },
    checkCircle: { width: '72px', height: '72px', borderRadius: '50%', color: '#fff', fontSize: '36px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', animation: 'checkPop 0.6s cubic-bezier(0.34,1.56,0.64,1)' },
    successTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '48px', letterSpacing: '2px', marginBottom: '8px' },
    successSub: { color: '#94a3b8', fontSize: '15px' },

    receiptCard: { background: '#111827', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e293b', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', marginBottom: '24px' },
    receiptHeader: { padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
    receiptHeaderLeft: {},
    logoText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '4px', margin: '0 0 4px 0' },
    officialText: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' },
    receiptHeaderRight: { textAlign: 'right' },
    receiptIdLabel: { color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
    receiptId: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '3px', margin: '0 0 6px 0' },
    paidBadge: { background: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e44', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' },

    amountBanner: { padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    amountLabel: { color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
    amountValue: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', letterSpacing: '2px', margin: 0, lineHeight: 1 },
    amountRight: { opacity: 0.5 },

    receiptBody: { padding: '24px 28px' },
    section: { marginBottom: '4px' },
    sectionTitle: { color: '#64748b', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' },

    turfHero: { background: '#0f172a', borderRadius: '10px', padding: '16px', marginBottom: '16px' },
    turfName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '1px', margin: '0 0 4px 0' },
    turfMeta: { color: '#64748b', fontSize: '13px' },

    detailsGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
    detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#0f172a', borderRadius: '8px' },
    detailLabel: { color: '#64748b', fontSize: '13px' },
    detailValue: { color: '#ffffff', fontSize: '14px', fontWeight: '700', textAlign: 'right' },

    divider: { height: '1px', background: '#1e293b', margin: '20px 0' },

    playersList: { borderRadius: '10px', overflow: 'hidden', border: '1px solid #1e293b' },
    playerRow: { display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 14px' },
    playerIdx: { width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 },

    noteBox: { background: '#0f172a', borderRadius: '10px', padding: '16px 20px' },
    noteTitle: { color: '#f59e0b', fontSize: '13px', fontWeight: '800', marginBottom: '8px' },
    noteText: { color: '#64748b', fontSize: '13px', lineHeight: 1.8 },

    receiptFooter: { background: '#080e1f', padding: '16px 28px', textAlign: 'center', borderTop: '1px solid #1e293b' },
    footerBrand: { color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px 0' },
    footerNote: { color: 'rgba(255,255,255,0.15)', fontSize: '11px', margin: 0 },

    actionRow: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
    homeBtn: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '13px 22px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s' },
    myBookingsBtn: { background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '13px 22px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s' },
    downloadBtn: { color: '#000', border: 'none', padding: '13px 28px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '800', transition: 'all 0.2s' },
};

export default BookingConfirmation;
