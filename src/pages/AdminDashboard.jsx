
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getDashboardStats, getAllBookings, getAllUsers, adminCancelBooking, getEarnings } from '../services/api';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalTurfs: 0, totalBookings: 0, todayBookings: 0 });
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    const [earnings, setEarnings] = useState({
    totalRevenue: 0, todayRevenue: 0, monthRevenue: 0,
    confirmedBookings: 0, turfBreakdown: [], recentPayments: []
});
    const [searchBooking, setSearchBooking] = useState('');
    const [searchUser, setSearchUser] = useState('');

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {   
        setLoading(true);
        try {
            const [statsRes, bookingsRes, earningsRes] = await Promise.all([
    getDashboardStats(), getAllBookings(), getEarnings()
]);
setEarnings(earningsRes.data || {});
            setStats(statsRes.data || {});
            setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
        } catch (err) { console.error('Dashboard error:', err); }
        try {
            const usersRes = await getAllUsers();
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        } catch (err) { console.error('Users error:', err); }
        setLoading(false);
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try { await adminCancelBooking(id); loadAll(); }
        catch { alert('Failed to cancel!'); }
    };

    const filteredBookings = bookings.filter(b =>
        b.bookingCode?.toLowerCase().includes(searchBooking.toLowerCase()) ||
        b.user?.username?.toLowerCase().includes(searchBooking.toLowerCase()) ||
        b.turf?.name?.toLowerCase().includes(searchBooking.toLowerCase())
    );
    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchUser.toLowerCase())
    );

    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
    const revenue = bookings.filter(b => b.status === 'CONFIRMED').reduce((sum, b) => sum + (b.turf?.pricePerHour || 0), 0);

    const SPORT_DOTS = [
        { emoji: '⚽', color: '#60a5fa', sport: 'Football' },
        { emoji: '🏏', color: '#4ade80', sport: 'Cricket' },
        { emoji: '🏀', color: '#fb923c', sport: 'Basketball' },
        { emoji: '🎾', color: '#a3e635', sport: 'Tennis' },
        { emoji: '🏸', color: '#e879f9', sport: 'Badminton' },
    ];

    const FLOATING_SPORTS = [
        { emoji: '⚽', top: '10%',    left: '5%',  fontSize: '80px', opacity: 0.07, animation: 'float1 6s ease-in-out infinite' },
        { emoji: '🏏', top: '15%',    left: '20%', fontSize: '64px', opacity: 0.06, animation: 'float2 7s ease-in-out infinite' },
        { emoji: '🏀', top: '5%',     left: '40%', fontSize: '90px', opacity: 0.07, animation: 'float3 5s ease-in-out infinite' },
        { emoji: '🎾', top: '20%',    left: '60%', fontSize: '70px', opacity: 0.06, animation: 'float4 8s ease-in-out infinite' },
        { emoji: '🏸', top: '8%',     left: '80%', fontSize: '72px', opacity: 0.07, animation: 'float5 6.5s ease-in-out infinite' },
        { emoji: '⚽', bottom: '10%', left: '12%', fontSize: '56px', opacity: 0.05, animation: 'float3 7s ease-in-out infinite' },
        { emoji: '🏏', bottom: '5%',  left: '35%', fontSize: '78px', opacity: 0.06, animation: 'float1 5.5s ease-in-out infinite' },
        { emoji: '🏀', bottom: '15%', left: '55%', fontSize: '60px', opacity: 0.05, animation: 'float2 8s ease-in-out infinite' },
        { emoji: '🎾', bottom: '8%',  left: '72%', fontSize: '84px', opacity: 0.07, animation: 'float5 6s ease-in-out infinite' },
        { emoji: '🏸', bottom: '12%', left: '88%', fontSize: '66px', opacity: 0.05, animation: 'float4 7.5s ease-in-out infinite' },
        { emoji: '🏟️', top: '50%',   left: '50%', fontSize: '140px', opacity: 0.03, animation: 'float1 10s ease-in-out infinite', transform: 'translate(-50%,-50%)' },
    ];

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input { outline: none; }
                .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
                .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.4) !important; }
                .quick-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.4) !important; }
                .tab-btn:hover { color: #ffffff; }
                .refresh-btn:hover { background: rgba(255,255,255,0.1) !important; }
                @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(10px,-15px) rotate(5deg);} }
                @keyframes float2 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(-12px,-10px) rotate(-8deg);} }
                @keyframes float3 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(8px,12px) rotate(6deg);} }
                @keyframes float4 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(-8px,-18px) rotate(-5deg);} }
                @keyframes float5 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(14px,8px) rotate(10deg);} }
                @keyframes fadeUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
                .stat-card { animation: fadeUp 0.4s ease forwards; }
            `}</style>

            <Navbar />

            {/* ═══════════════ HERO HEADER ═══════════════ */}
            <div style={styles.hero}>

                {/* Floating sport emojis */}
                <div style={styles.sportsBg}>
                    {FLOATING_SPORTS.map((item, i) => (
                        <span key={i} style={{
                            position: 'absolute',
                            top: item.top, bottom: item.bottom,
                            left: item.left,
                            fontSize: item.fontSize,
                            opacity: item.opacity,
                            animation: item.animation,
                            transform: item.transform || 'none',
                            userSelect: 'none',
                            lineHeight: 1,
                            pointerEvents: 'none',
                        }}>
                            {item.emoji}
                        </span>
                    ))}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, transparent 50%, #050a14 100%)',
                    }}/>
                </div>

                {/* Grid lines */}
                <div style={styles.gridLines}/>

                {/* Content */}
                <div style={styles.heroContent}>
                    <div style={styles.heroLeft}>
                        <div style={styles.heroCrownRow}>
                            <span style={{fontSize: '18px'}}>👑</span>
                            <span style={styles.heroAdminLabel}>ADMIN PANEL</span>
                        </div>
                        <h1 style={styles.heroTitle}>Dashboard</h1>
                        <p style={styles.heroDate}>
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <div style={styles.sportDotsRow}>
                            {SPORT_DOTS.map((s, i) => (
                                <div key={i} style={{
                                    ...styles.sportDot,
                                    background: s.color + '15',
                                    border: `1px solid ${s.color}40`,
                                }}>
                                    <span style={{fontSize: '14px'}}>{s.emoji}</span>
                                    <span style={{color: s.color, fontSize: '11px', fontWeight: '700'}}>{s.sport}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles.heroRight}>
                        <div style={styles.heroStatsPills}>
                            {[
                                { val: stats.totalTurfs || 0,                          label: 'Turfs',    color: '#4ade80' },
                                { val: stats.totalUsers || users.length || 0,          label: 'Users',    color: '#60a5fa' },
                                { val: stats.totalBookings || bookings.length || 0,    label: 'Bookings', color: '#fb923c' },
                                { val: `₹${revenue}`,                                  label: 'Revenue',  color: '#f59e0b' },
                            ].map((s, i) => (
                                <div key={i} style={{
                                    ...styles.heroStatPill,
                                    background: s.color + '12',
                                    border: `1px solid ${s.color}30`,
                                }}>
                                    <p style={{...styles.heroStatVal, color: s.color}}>{s.val}</p>
                                    <p style={styles.heroStatLabel}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <button className="refresh-btn" style={styles.refreshBtn} onClick={loadAll}>
                            🔄 Refresh Data
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════ BODY ═══════════════ */}
            <div style={styles.body}>

                {/* TABS */}
                <div style={styles.tabRow}>
                    {[
                        { id: 'overview', label: '📊 Overview' },
                        { id: 'bookings', label: `📋 All Bookings (${bookings.length})` },
                        { id: 'users',    label: `👥 Users (${users.length})` },
{ id: 'earnings', label: `💰 Earnings` },
                    ].map(t => (
                        <button key={t.id} className="tab-btn"
                            onClick={() => setActiveTab(t.id)}
                            style={{
                                ...styles.tabBtn,
                                color: activeTab === t.id ? '#22c55e' : '#64748b',
                                borderBottom: activeTab === t.id ? '2px solid #22c55e' : '2px solid transparent',
                            }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={styles.loadingBox}>
                        <p style={{fontSize: '48px', marginBottom: '16px'}}>⏳</p>
                        <p style={{color: '#94a3b8', fontSize: '18px'}}>Loading dashboard data...</p>
                    </div>
                ) : (
                    <>
                        {/* ══════ OVERVIEW TAB ══════ */}
                        {activeTab === 'overview' && (
                            <>
                                {/* Stats Grid */}
                                <div style={styles.statsGrid}>
                                    {[
                                        { label: 'Total Users',      value: stats.totalUsers || users.length || 0, icon: '👥', color: '#60a5fa', bg: '#0c1a3a', change: 'Registered' },
                                        { label: 'Total Turfs',      value: stats.totalTurfs || 0,                 icon: '🏟️', color: '#4ade80', bg: '#052e16', change: 'Active turfs' },
                                        { label: 'Total Bookings',   value: stats.totalBookings || bookings.length, icon: '📋', color: '#fb923c', bg: '#3a1a00', change: 'All time' },
                                        { label: "Today's Bookings", value: stats.todayBookings || 0,              icon: '📅', color: '#e879f9', bg: '#2a0a3a', change: 'Today' },
                                        { label: 'Confirmed',        value: confirmedBookings,                     icon: '✅', color: '#22c55e', bg: '#052e16', change: 'Active' },
                                        { label: 'Cancelled',        value: cancelledBookings,                     icon: '❌', color: '#ef4444', bg: '#1a0808', change: 'Cancelled' },
                                        { label: 'Total Revenue',    value: `₹${revenue}`,                        icon: '💰', color: '#f59e0b', bg: '#2d1f00', change: 'Confirmed only' },
                                        { label: 'Avg per Booking',  value: confirmedBookings ? `₹${Math.round(revenue / confirmedBookings)}` : '₹0', icon: '📈', color: '#a3e635', bg: '#1a3a00', change: 'Per booking' },
                                    ].map((s, i) => (
                                        <div key={i} className="stat-card" style={{
                                            ...styles.statCard,
                                            background: s.bg,
                                            border: `1px solid ${s.color}22`,
                                            animationDelay: `${i * 0.05}s`,
                                        }}>
                                            <div style={styles.statTop}>
                                                <span style={styles.statIcon}>{s.icon}</span>
                                                <span style={{...styles.statChange, color: s.color + '99'}}>{s.change}</span>
                                            </div>
                                            <p style={{...styles.statVal, color: s.color}}>{s.value}</p>
                                            <p style={styles.statLabel}>{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Actions */}
                                <div style={styles.section}>
                                    <h2 style={styles.secTitle}>⚡ Quick Actions</h2>
                                    <div style={styles.quickGrid}>
                                        {[
                                            { label: 'Manage Turfs',  icon: '🏟️', color: '#22c55e', desc: 'Add, edit, delete turfs',        path: '/admin/turfs' },
                                            { label: 'All Bookings',  icon: '📋', color: '#60a5fa', desc: 'See all user bookings',           action: () => setActiveTab('bookings') },
                                            { label: 'View Users',    icon: '👥', color: '#f59e0b', desc: 'See all registered users',        action: () => setActiveTab('users') },
                                            { label: 'Generate Slots',icon: '📅', color: '#e879f9', desc: 'Create time slots for turfs',    path: '/admin/turfs' },
                                        ].map((q, i) => (
                                            <div key={i} className="quick-btn" style={{
                                                ...styles.quickCard,
                                                border: `1px solid ${q.color}30`,
                                                cursor: 'pointer', transition: 'all 0.2s',
                                            }}
                                                onClick={() => q.path ? navigate(q.path) : q.action?.()}>
                                                <div style={{
                                                    ...styles.quickIconBox,
                                                    background: q.color + '18',
                                                    border: `1px solid ${q.color}33`,
                                                }}>
                                                    <span style={{fontSize: '28px'}}>{q.icon}</span>
                                                </div>
                                                <div>
                                                    <p style={{...styles.quickLabel, color: q.color}}>{q.label}</p>
                                                    <p style={styles.quickDesc}>{q.desc}</p>
                                                </div>
                                                <span style={styles.quickArrow}>→</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Bookings */}
                                <div style={styles.section}>
                                    <div style={styles.secHeader}>
                                        <h2 style={styles.secTitle}>🕐 Recent Bookings</h2>
                                        <button style={styles.seeAllBtn} onClick={() => setActiveTab('bookings')}>
                                            See All →
                                        </button>
                                    </div>
                                    {bookings.length === 0 ? (
                                        <div style={styles.emptyBox}>
                                            <p style={{fontSize: '48px'}}>📋</p>
                                            <p style={{color: '#94a3b8'}}>No bookings yet!</p>
                                        </div>
                                    ) : (
                                        <div style={styles.tableWrap}>
                                            <table style={styles.table}>
                                                <thead>
                                                    <tr style={styles.thead}>
                                                        {['Booking ID','User','Turf','Date','Slot','Status','Action'].map(h => (
                                                            <th key={h} style={styles.th}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookings.slice(0, 5).map((b, i) => (
                                                        <tr key={b.id} style={{...styles.tr, background: i % 2 === 0 ? '#0a0f1e' : '#0f172a'}}>
                                                            <td style={{...styles.td, color: '#22c55e', fontWeight: '800', fontFamily: 'monospace', fontSize: '12px'}}>{b.bookingCode}</td>
                                                            <td style={{...styles.td, color: '#ffffff', fontWeight: '700'}}>{b.user?.username || 'N/A'}</td>
                                                            <td style={styles.td}>{b.turf?.name || 'N/A'}</td>
                                                            <td style={styles.td}>{b.bookingDate}</td>
                                                            <td style={{...styles.td, color: '#60a5fa', fontWeight: '700'}}>{b.slot ? `${b.slot.startTime} – ${b.slot.endTime}` : 'N/A'}</td>
                                                            <td style={styles.td}>
                                                                <span style={{
                                                                    ...styles.statusBadge,
                                                                    background: b.status === 'CONFIRMED' ? '#22c55e22' : '#ef444422',
                                                                    color: b.status === 'CONFIRMED' ? '#22c55e' : '#ef4444',
                                                                    border: `1px solid ${b.status === 'CONFIRMED' ? '#22c55e33' : '#ef444433'}`,
                                                                }}>
                                                                    {b.status === 'CONFIRMED' ? '✅' : '❌'} {b.status}
                                                                </span>
                                                            </td>
                                                            <td style={styles.td}>
                                                                {b.status === 'CONFIRMED' && (
                                                                    <button style={styles.cancelBtn} onClick={() => handleCancelBooking(b.id)}>✕ Cancel</button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ══════ BOOKINGS TAB ══════ */}
                        {activeTab === 'bookings' && (
                            <div>
                                <div style={styles.secHeader}>
                                    <h2 style={styles.secTitle}>📋 All Bookings</h2>
                                    <input
                                        style={styles.searchInput}
                                        placeholder="🔍 Search by code, user, turf..."
                                        value={searchBooking}
                                        onChange={e => setSearchBooking(e.target.value)}
                                    />
                                </div>

                                <div style={styles.miniStatsRow}>
                                    {[
                                        { label: 'Total',     value: bookings.length,    color: '#60a5fa' },
                                        { label: 'Confirmed', value: confirmedBookings,  color: '#22c55e' },
                                        { label: 'Cancelled', value: cancelledBookings,  color: '#ef4444' },
                                        { label: 'Revenue',   value: `₹${revenue}`,      color: '#f59e0b' },
                                    ].map((s, i) => (
                                        <div key={i} style={{...styles.miniStat, border: `1px solid ${s.color}30`}}>
                                            <p style={{...styles.miniStatVal, color: s.color}}>{s.value}</p>
                                            <p style={styles.miniStatLabel}>{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {filteredBookings.length === 0 ? (
                                    <div style={styles.emptyBox}>
                                        <p style={{fontSize: '48px'}}>📋</p>
                                        <p style={{color: '#94a3b8'}}>No bookings found!</p>
                                    </div>
                                ) : (
                                    <div style={styles.tableWrap}>
                                        <table style={styles.table}>
                                            <thead>
                                                <tr style={styles.thead}>
                                                    {['#','Booking ID','User','Turf','Date','Time Slot','Players','Amount','Status','Action'].map(h => (
                                                        <th key={h} style={styles.th}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredBookings.map((b, i) => (
                                                    <tr key={b.id} style={{...styles.tr, background: i % 2 === 0 ? '#0a0f1e' : '#0f172a'}}>
                                                        <td style={{...styles.td, color: '#475569'}}>{i + 1}</td>
                                                        <td style={{...styles.td, color: '#22c55e', fontWeight: '800', fontFamily: 'monospace', fontSize: '12px'}}>{b.bookingCode}</td>
                                                        <td style={{...styles.td, color: '#ffffff', fontWeight: '700'}}>{b.user?.username}</td>
                                                        <td style={styles.td}>
                                                            <p style={{color: '#94a3b8', margin: '0 0 2px 0', fontSize: '13px'}}>{b.turf?.name}</p>
                                                            <p style={{color: '#475569', margin: 0, fontSize: '11px'}}>{b.turf?.location}</p>
                                                        </td>
                                                        <td style={{...styles.td, color: '#94a3b8'}}>{b.bookingDate}</td>
                                                        <td style={{...styles.td, color: '#60a5fa', fontWeight: '700'}}>
                                                            {b.slot ? `${b.slot.startTime} – ${b.slot.endTime}` : 'N/A'}
                                                        </td>
                                                        <td style={{...styles.td, color: '#94a3b8', textAlign: 'center'}}>{b.players?.length || 1}</td>
                                                        <td style={{...styles.td, color: '#f59e0b', fontWeight: '700'}}>₹{b.turf?.pricePerHour || 0}</td>
                                                        <td style={styles.td}>
                                                            <span style={{
                                                                ...styles.statusBadge,
                                                                background: b.status === 'CONFIRMED' ? '#22c55e22' : '#ef444422',
                                                                color: b.status === 'CONFIRMED' ? '#22c55e' : '#ef4444',
                                                                border: `1px solid ${b.status === 'CONFIRMED' ? '#22c55e33' : '#ef444433'}`,
                                                            }}>
                                                                {b.status === 'CONFIRMED' ? '✅' : '❌'} {b.status}
                                                            </span>
                                                        </td>
                                                        <td style={styles.td}>
                                                            {b.status === 'CONFIRMED' && (
                                                                <button style={styles.cancelBtn} onClick={() => handleCancelBooking(b.id)}>✕ Cancel</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* ══════ EARNINGS TAB ══════ */}
{activeTab === 'earnings' && (
    <div>
        <h2 style={styles.secTitle}>💰 Earnings & Revenue</h2>
        <p style={{color: '#64748b', fontSize: '13px', marginBottom: '24px', marginTop: '4px'}}>
            Complete financial overview of BuffTURF
        </p>

        {/* Top Revenue Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px'}}>
            {[
                { label: 'Total Revenue',       value: `₹${earnings.totalRevenue || 0}`,   icon: '💰', color: '#f59e0b', bg: '#2d1f00', sub: 'All time confirmed' },
                { label: "Today's Revenue",     value: `₹${earnings.todayRevenue || 0}`,   icon: '📅', color: '#22c55e', bg: '#052e16', sub: 'Earned today' },
                { label: "This Month",          value: `₹${earnings.monthRevenue || 0}`,   icon: '📆', color: '#60a5fa', bg: '#0c1a3a', sub: new Date().toLocaleString('default', {month: 'long'}) },
                { label: 'Paid Bookings',       value: earnings.confirmedBookings || 0,    icon: '✅', color: '#4ade80', bg: '#052e16', sub: 'Confirmed bookings' },
            ].map((s, i) => (
                <div key={i} className="stat-card" style={{
                    background: s.bg, borderRadius: '14px',
                    padding: '20px', border: `1px solid ${s.color}22`,
                }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                        <span style={{fontSize: '28px'}}>{s.icon}</span>
                        <span style={{color: s.color + '99', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase'}}>{s.sub}</span>
                    </div>
                    <p style={{fontFamily: "'Bebas Neue'", fontSize: '38px', color: s.color, margin: '0 0 4px 0', letterSpacing: '1px'}}>{s.value}</p>
                    <p style={{color: '#64748b', fontSize: '13px', margin: 0}}>{s.label}</p>
                </div>
            ))}
        </div>

        {/* Per Turf Breakdown */}
        <div style={styles.section}>
            <h2 style={styles.secTitle}>🏟️ Revenue Per Turf</h2>
            <p style={{color: '#64748b', fontSize: '13px', marginBottom: '16px'}}>Earnings breakdown by each turf</p>

            {!earnings.turfBreakdown || earnings.turfBreakdown.length === 0 ? (
                <div style={styles.emptyBox}>
                    <p style={{fontSize: '48px'}}>💰</p>
                    <p style={{color: '#94a3b8'}}>No earnings data yet! Add turfs and get bookings!</p>
                </div>
            ) : (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px'}}>
                    {[...earnings.turfBreakdown]
                        .sort((a, b) => b.totalEarned - a.totalEarned)
                        .map((turf, i) => {
                            const sportColors = { Football: '#60a5fa', Cricket: '#4ade80', Basketball: '#fb923c', Badminton: '#e879f9', Tennis: '#a3e635' };
                            const color = sportColors[turf.sportType] || '#22c55e';
                            const sportEmojis = { Football: '⚽', Cricket: '🏏', Basketball: '🏀', Badminton: '🏸', Tennis: '🎾' };
                            const emoji = sportEmojis[turf.sportType] || '🏟️';
                            return (
                                <div key={i} style={{
                                    background: '#111827', borderRadius: '14px',
                                    overflow: 'hidden', border: `1px solid ${color}22`,
                                }}>
                                    <div style={{height: '3px', background: `linear-gradient(90deg, ${color}, transparent)`}}/>
                                    <div style={{padding: '20px'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px'}}>
                                            <span style={{
                                                fontSize: '24px', width: '44px', height: '44px',
                                                background: color + '18', borderRadius: '10px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: `1px solid ${color}33`, flexShrink: 0,
                                            }}>{emoji}</span>
                                            <div>
                                                <p style={{color: '#ffffff', fontWeight: '800', margin: '0 0 2px 0', fontSize: '15px'}}>{turf.turfName}</p>
                                                <p style={{color: '#64748b', fontSize: '12px', margin: 0}}>📍 {turf.location}</p>
                                            </div>
                                            {i === 0 && (
                                                <span style={{
                                                    marginLeft: 'auto', background: '#f59e0b22',
                                                    color: '#f59e0b', border: '1px solid #f59e0b33',
                                                    padding: '3px 8px', borderRadius: '6px',
                                                    fontSize: '10px', fontWeight: '800',
                                                }}>🏆 TOP</span>
                                            )}
                                        </div>
                                        <div style={{display: 'flex', background: '#0f172a', borderRadius: '10px', overflow: 'hidden'}}>
                                            {[
                                                { val: turf.bookingCount, label: 'Bookings', color: '#60a5fa' },
                                                { val: `₹${turf.pricePerHour}`, label: 'Per Hour', color: color },
                                                { val: `₹${turf.totalEarned}`, label: 'Total Earned', color: '#f59e0b' },
                                            ].map((s, j) => (
                                                <div key={j} style={{flex: 1, textAlign: 'center', padding: '12px 8px', borderRight: j < 2 ? '1px solid #1e293b' : 'none'}}>
                                                    <p style={{color: s.color, fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0'}}>{s.val}</p>
                                                    <p style={{color: '#64748b', fontSize: '10px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px'}}>{s.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>

        {/* Recent Payments Table */}
        <div style={styles.section}>
            <h2 style={styles.secTitle}>🧾 Recent Payments</h2>
            <p style={{color: '#64748b', fontSize: '13px', marginBottom: '16px'}}>Last 10 confirmed payments</p>

            {!earnings.recentPayments || earnings.recentPayments.length === 0 ? (
                <div style={styles.emptyBox}>
                    <p style={{fontSize: '48px'}}>🧾</p>
                    <p style={{color: '#94a3b8'}}>No payments yet!</p>
                </div>
            ) : (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                {['#', 'Booking ID', 'User', 'Turf', 'Date', 'Amount', 'Payment ID', 'Status'].map(h => (
                                    <th key={h} style={styles.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {earnings.recentPayments.map((b, i) => (
                                <tr key={b.id} style={{...styles.tr, background: i % 2 === 0 ? '#0a0f1e' : '#0f172a'}}>
                                    <td style={{...styles.td, color: '#475569'}}>{i + 1}</td>
                                    <td style={{...styles.td, color: '#22c55e', fontWeight: '800', fontFamily: 'monospace', fontSize: '12px'}}>{b.bookingCode}</td>
                                    <td style={{...styles.td, color: '#ffffff', fontWeight: '700'}}>{b.user?.username}</td>
                                    <td style={styles.td}>
                                        <p style={{color: '#94a3b8', margin: '0 0 2px 0', fontSize: '13px'}}>{b.turf?.name}</p>
                                        <p style={{color: '#475569', margin: 0, fontSize: '11px'}}>{b.turf?.location}</p>
                                    </td>
                                    <td style={{...styles.td, color: '#94a3b8'}}>{b.bookingDate}</td>
                                    <td style={{...styles.td, color: '#f59e0b', fontWeight: '800', fontSize: '15px'}}>₹{b.turf?.pricePerHour || 0}</td>
                                    <td style={{...styles.td, color: '#60a5fa', fontFamily: 'monospace', fontSize: '11px'}}>
                                        {b.paymentId ? b.paymentId.substring(0, 16) + '...' : 'N/A'}
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.statusBadge,
                                            background: '#22c55e22', color: '#22c55e',
                                            border: '1px solid #22c55e33',
                                        }}>✅ PAID</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
)}
                        {/* ══════ USERS TAB ══════ */}
                        {activeTab === 'users' && (
                            <div>
                                <div style={styles.secHeader}>
                                    <h2 style={styles.secTitle}>👥 All Users</h2>
                                    <input
                                        style={styles.searchInput}
                                        placeholder="🔍 Search by username or email..."
                                        value={searchUser}
                                        onChange={e => setSearchUser(e.target.value)}
                                    />
                                </div>

                                {filteredUsers.length === 0 ? (
                                    <div style={styles.emptyBox}>
                                        <p style={{fontSize: '48px'}}>👥</p>
                                        <p style={{color: '#94a3b8'}}>No users found!</p>
                                    </div>
                                ) : (
                                    <div style={styles.usersGrid}>
                                        {filteredUsers.map((u) => {
                                            const userBookings = bookings.filter(b => b.user?.username === u.username);
                                            const userRevenue  = userBookings.filter(b => b.status === 'CONFIRMED').reduce((sum, b) => sum + (b.turf?.pricePerHour || 0), 0);
                                            const isAdmin      = u.role === 'ADMIN';
                                            return (
                                                <div key={u.id} style={styles.userCard}>
                                                    {/* accent top */}
                                                    <div style={{
                                                        height: '3px',
                                                        background: isAdmin
                                                            ? 'linear-gradient(90deg,#f59e0b,transparent)'
                                                            : 'linear-gradient(90deg,#22c55e,transparent)',
                                                    }}/>
                                                    <div style={{padding: '16px'}}>
                                                        <div style={styles.userCardTop}>
                                                            <div style={{
                                                                ...styles.userAvatar,
                                                                background: isAdmin ? '#f59e0b22' : '#22c55e22',
                                                                border: `2px solid ${isAdmin ? '#f59e0b44' : '#22c55e44'}`,
                                                                color: isAdmin ? '#f59e0b' : '#22c55e',
                                                            }}>
                                                                {u.username?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div style={styles.userInfo}>
                                                                <p style={styles.userName}>{u.username}</p>
                                                                <p style={styles.userEmail}>{u.email || 'No email'}</p>
                                                            </div>
                                                            <span style={{
                                                                ...styles.roleBadge,
                                                                background: isAdmin ? '#f59e0b22' : '#22c55e22',
                                                                color: isAdmin ? '#f59e0b' : '#22c55e',
                                                                border: `1px solid ${isAdmin ? '#f59e0b33' : '#22c55e33'}`,
                                                            }}>
                                                                {isAdmin ? '👑 Admin' : '👤 User'}
                                                            </span>
                                                        </div>
                                                        <div style={styles.userStats}>
                                                            {[
                                                                { val: userBookings.length,                                         label: 'Bookings', color: '#60a5fa' },
                                                                { val: userBookings.filter(b => b.status==='CONFIRMED').length,     label: 'Active',   color: '#22c55e' },
                                                                { val: `₹${userRevenue}`,                                          label: 'Spent',    color: '#f59e0b' },
                                                            ].map((s, i) => (
                                                                <div key={i} style={styles.userStat}>
                                                                    <p style={{...styles.userStatVal, color: s.color}}>{s.val}</p>
                                                                    <p style={styles.userStatLabel}>{s.label}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },

    // HERO
    hero: {
        position: 'relative', padding: '52px 32px 44px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #080e1f 0%, #0c1528 50%, #070c1a 100%)',
        borderBottom: '1px solid #1e293b',
    },
    sportsBg: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' },
    gridLines: {
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
    },
    heroContent: {
        position: 'relative', zIndex: 1,
        maxWidth: '1300px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', flexWrap: 'wrap', gap: '28px',
    },
    heroLeft: {},
    heroCrownRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
    heroAdminLabel: {
        color: '#f59e0b', fontSize: '11px', fontWeight: '800',
        letterSpacing: '3px', background: '#f59e0b15',
        border: '1px solid #f59e0b30', padding: '3px 10px', borderRadius: '4px',
    },
    heroTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff', fontSize: '64px',
        letterSpacing: '4px', margin: '0 0 6px 0',
        textShadow: '0 4px 30px rgba(0,0,0,0.5)', lineHeight: 1,
    },
    heroDate: { color: '#475569', fontSize: '13px', marginBottom: '20px' },
    sportDotsRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    sportDot: {
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '5px 12px', borderRadius: '20px',
        backdropFilter: 'blur(10px)',
    },
    heroRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' },
    heroStatsPills: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' },
    heroStatPill: {
        padding: '12px 20px', borderRadius: '12px',
        textAlign: 'center', backdropFilter: 'blur(10px)', minWidth: '88px',
    },
    heroStatVal: {
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '28px', letterSpacing: '1px', margin: '0 0 2px 0',
    },
    heroStatLabel: {
        color: 'rgba(255,255,255,0.35)', fontSize: '10px',
        textTransform: 'uppercase', letterSpacing: '1px', margin: 0,
    },
    refreshBtn: {
        background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
        border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px',
        borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
        fontWeight: '700', backdropFilter: 'blur(10px)', transition: 'all 0.2s',
    },

    // BODY
    body: { maxWidth: '1300px', margin: '0 auto', padding: '0 32px 60px' },

    tabRow: { display: 'flex', borderBottom: '1px solid #1e293b', marginBottom: '28px', paddingTop: '24px' },
    tabBtn: { background: 'none', border: 'none', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s', whiteSpace: 'nowrap' },

    loadingBox: { textAlign: 'center', padding: '80px' },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' },
    statCard: { borderRadius: '14px', padding: '20px' },
    statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    statIcon: { fontSize: '28px' },
    statChange: { fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '38px', letterSpacing: '1px', margin: '0 0 4px 0' },
    statLabel: { color: '#64748b', fontSize: '13px', margin: 0 },

    section: { marginBottom: '32px' },
    secHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
    secTitle: { fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff', fontSize: '28px', letterSpacing: '2px', margin: 0 },
    seeAllBtn: { background: 'transparent', color: '#22c55e', border: '1px solid #22c55e33', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' },

    quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' },
    quickCard: {
        background: '#111827', borderRadius: '14px', padding: '20px',
        display: 'flex', alignItems: 'center', gap: '16px',
    },
    quickIconBox: { width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    quickLabel: { fontSize: '15px', fontWeight: '800', margin: '0 0 3px 0' },
    quickDesc: { color: '#64748b', fontSize: '12px', margin: 0 },
    quickArrow: { color: '#334155', fontSize: '20px', marginLeft: 'auto', flexShrink: 0 },

    tableWrap: { overflowX: 'auto', borderRadius: '12px', border: '1px solid #1e293b' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { background: '#0a0f1e' },
    th: { padding: '14px 16px', color: '#475569', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', whiteSpace: 'nowrap', borderBottom: '1px solid #1e293b' },
    tr: { borderBottom: '1px solid #1e293b' },
    td: { padding: '14px 16px', color: '#94a3b8', fontSize: '13px', verticalAlign: 'middle' },
    statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap' },
    cancelBtn: { background: '#ef444418', color: '#ef4444', border: '1px solid #ef444433', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },

    emptyBox: { textAlign: 'center', padding: '60px', background: '#111827', borderRadius: '12px', border: '1px solid #1e293b' },

    miniStatsRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' },
    miniStat: { background: '#111827', borderRadius: '10px', padding: '14px 24px', textAlign: 'center' },
    miniStatVal: { fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0' },
    miniStatLabel: { color: '#64748b', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' },
    searchInput: { padding: '10px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '14px', minWidth: '260px' },

    usersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
    userCard: { background: '#111827', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e293b' },
    userCardTop: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' },
    userAvatar: { width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', flexShrink: 0 },
    userInfo: { flex: 1 },
    userName: { color: '#ffffff', fontSize: '15px', fontWeight: '800', margin: '0 0 2px 0' },
    userEmail: { color: '#64748b', fontSize: '12px', margin: 0 },
    roleBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap' },
    userStats: { display: 'flex', background: '#0f172a', borderRadius: '8px', overflow: 'hidden' },
    userStat: { flex: 1, textAlign: 'center', padding: '10px 8px', borderRight: '1px solid #1e293b' },
    userStatVal: { color: '#ffffff', fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' },
    userStatLabel: { color: '#64748b', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' },
};

export default AdminDashboard;