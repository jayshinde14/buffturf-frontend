
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { searchTurfs, addTurf, updateTurf, deleteTurf, generateSlots } from '../services/api';

const SPORT_CONFIG = {
    Football:   { color: '#60a5fa', emoji: '⚽', image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80' },
    Cricket:    { color: '#4ade80', emoji: '🏏', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80' },
    Basketball: { color: '#fb923c', emoji: '🏀', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80' },
    Tennis:     { color: '#a3e635', emoji: '🎾', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80' },
    Badminton:  { color: '#e879f9', emoji: '🏸', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80' },
};
const DEFAULT_SPORT = { color: '#94a3b8', emoji: '🏟️', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80' };
const getSport = (s) => SPORT_CONFIG[s] || DEFAULT_SPORT;

function AdminTurfs() {
    const [turfs, setTurfs]               = useState([]);
    const [loading, setLoading]           = useState(true);
    const [showForm, setShowForm]         = useState(false);
    const [editingTurf, setEditingTurf]   = useState(null);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [selectedTurf, setSelectedTurf] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [generatedSlots, setGeneratedSlots] = useState([]);
    const [slotLoading, setSlotLoading]   = useState(false);
    const [filterSport, setFilterSport]   = useState('All');
    const [form, setForm] = useState({
        name: '', location: '', address: '',
        sportType: 'Football', pricePerHour: '',
        description: '', openTime: '06:00', closeTime: '23:00'
    });

    const today = new Date().toISOString().split('T')[0];

    const formatTime = (t) => {
        if (!t) return '';
        const [h] = t.toString().split(':');
        const hour = parseInt(h);
        return `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
    };

    useEffect(() => { fetchTurfs(); }, []);

    const fetchTurfs = async () => {
        setLoading(true);
        try {
            const res = await searchTurfs('', '');
            setTurfs(Array.isArray(res.data) ? res.data : []);
        } catch { setTurfs([]); }
        finally { setLoading(false); }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.location || !form.address || !form.pricePerHour) {
            alert('Please fill all required fields!'); return;
        }
        try {
            if (editingTurf) { await updateTurf(editingTurf.id, form); }
            else { await addTurf(form); }
            setShowForm(false); setEditingTurf(null); resetForm(); fetchTurfs();
        } catch { alert('Failed to save turf!'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this turf?')) return;
        try { await deleteTurf(id); fetchTurfs(); }
        catch { alert('Failed to delete!'); }
    };

    const handleEdit = (turf) => {
        setEditingTurf(turf);
        setForm({ name: turf.name, location: turf.location, address: turf.address,
            sportType: turf.sportType, pricePerHour: turf.pricePerHour,
            description: turf.description || '', openTime: turf.openTime || '06:00', closeTime: turf.closeTime || '23:00' });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => setForm({ name: '', location: '', address: '',
        sportType: 'Football', pricePerHour: '', description: '', openTime: '06:00', closeTime: '23:00' });

    const openSlotModal = (turf) => {
        setSelectedTurf(turf); setSelectedDate(today);
        setGeneratedSlots([]); setShowSlotModal(true);
    };

    const handleGenerateSlots = async () => {
        if (!selectedDate) { alert('Pick a date!'); return; }
        setSlotLoading(true);
        try {
            const res = await generateSlots(selectedTurf.id, selectedDate);
            setGeneratedSlots(Array.isArray(res.data) ? res.data : []);
        } catch { alert('Failed to generate slots!'); }
        finally { setSlotLoading(false); }
    };

    const filteredTurfs = filterSport === 'All' ? turfs : turfs.filter(t => t.sportType === filterSport);
    const sportCounts = ['Football','Cricket','Basketball','Badminton','Tennis'].reduce((acc, s) => {
        acc[s] = turfs.filter(t => t.sportType === s).length; return acc;
    }, {});

    return (
        <div style={styles.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input, select, textarea { outline: none; }
                input:focus, select:focus, textarea:focus { border-color: #22c55e !important; box-shadow: 0 0 0 3px #22c55e22 !important; }
                .turf-card { transition: transform 0.25s, box-shadow 0.25s; }
                .turf-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important; }
                .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
                .add-btn:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.4) !important; }
                .filter-pill:hover { opacity: 0.85; }
                @keyframes slideDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
                .form-card { animation: slideDown 0.3s ease forwards; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
                .turf-card { animation: fadeUp 0.4s ease forwards; }
                select option { background: #0f172a; color: #fff; }
                ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0f172a; }
                ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
            `}</style>

            <Navbar />

            {/* HERO HEADER */}
            <div style={styles.hero}>
                <div style={styles.heroBg}/>
                <div style={styles.heroOverlay}/>
                <div style={styles.heroContent}>
                    <div style={styles.heroLeft}>
                        <p style={styles.heroBreadcrumb}>👑 Admin → Manage Turfs</p>
                        <h1 style={styles.heroTitle}>Manage Turfs</h1>
                        <p style={styles.heroSub}>{turfs.length} turfs across all cities & sports</p>
                        {/* Quick sport stats */}
                        <div style={styles.heroStats}>
                            {Object.entries(sportCounts).map(([sport, count]) => {
                                const cfg = getSport(sport);
                                return (
                                    <div key={sport} style={styles.heroStat}>
                                        <span style={{fontSize: '20px'}}>{cfg.emoji}</span>
                                        <span style={{color: cfg.color, fontWeight: '800', fontSize: '16px'}}>{count}</span>
                                        <span style={{color: '#475569', fontSize: '11px'}}>{sport}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button
                        className="add-btn"
                        style={{
                            ...styles.addBtn,
                            background: showForm
                                ? 'rgba(239,68,68,0.15)'
                                : 'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: showForm ? '#ef4444' : '#000',
                            border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
                        }}
                        onClick={() => { setShowForm(!showForm); setEditingTurf(null); resetForm(); }}
                    >
                        {showForm ? '✕ Cancel' : '＋ Add New Turf'}
                    </button>
                </div>
            </div>

            <div style={styles.body}>

                {/* ADD/EDIT FORM */}
                {showForm && (
                    <div className="form-card" style={styles.formCard}>
                        <div style={styles.formCardHeader}>
                            <div style={{
                                ...styles.formAccent,
                                background: `linear-gradient(90deg, ${getSport(form.sportType).color}, transparent)`,
                            }}/>
                            <div style={styles.formHeaderContent}>
                                <span style={{fontSize: '32px'}}>{getSport(form.sportType).emoji}</span>
                                <div>
                                    <h2 style={styles.formTitle}>
                                        {editingTurf ? '✏️ Edit Turf' : '➕ Add New Turf'}
                                    </h2>
                                    <p style={styles.formSub}>Fill in all required fields marked with *</p>
                                </div>
                            </div>
                        </div>

                        <div style={styles.formGrid}>
                            {[
                                { label: 'Turf Name *', key: 'name', type: 'text', ph: 'e.g. Champion Arena', icon: '🏟️' },
                                { label: 'City / Location *', key: 'location', type: 'text', ph: 'e.g. Solapur', icon: '📍' },
                                { label: 'Full Address *', key: 'address', type: 'text', ph: 'e.g. Plot 17, Sports Lane...', icon: '🏠' },
                                { label: 'Price Per Hour (₹) *', key: 'pricePerHour', type: 'number', ph: 'e.g. 500', icon: '💰' },
                                { label: 'Open Time', key: 'openTime', type: 'time', ph: '', icon: '🌅' },
                                { label: 'Close Time', key: 'closeTime', type: 'time', ph: '', icon: '🌙' },
                            ].map(f => (
                                <div key={f.key} style={styles.field}>
                                    <label style={styles.label}>{f.icon} {f.label}</label>
                                    <input
                                        style={styles.input}
                                        type={f.type}
                                        placeholder={f.ph}
                                        value={form[f.key]}
                                        onChange={e => setForm({...form, [f.key]: e.target.value})}
                                    />
                                </div>
                            ))}

                            <div style={styles.field}>
                                <label style={styles.label}>🏅 Sport Type *</label>
                                <select style={styles.input} value={form.sportType}
                                    onChange={e => setForm({...form, sportType: e.target.value})}>
                                    {['Football','Cricket','Basketball','Badminton','Tennis'].map(s => (
                                        <option key={s} value={s}>{getSport(s).emoji} {s}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{...styles.field, gridColumn: '1 / -1'}}>
                                <label style={styles.label}>📝 Description</label>
                                <textarea
                                    style={{...styles.input, height: '80px', resize: 'vertical', lineHeight: '1.5'}}
                                    placeholder="Describe the turf facilities, surface type, amenities..."
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div style={styles.formBtns}>
                            <button style={styles.cancelBtn}
                                onClick={() => { setShowForm(false); setEditingTurf(null); resetForm(); }}>
                                Cancel
                            </button>
                            <button className="action-btn" style={styles.saveBtn} onClick={handleSubmit}>
                                {editingTurf ? '💾 Update Turf' : '✅ Add Turf'}
                            </button>
                        </div>
                    </div>
                )}

                {/* FILTER PILLS */}
                {!loading && turfs.length > 0 && (
                    <div style={styles.filterRow}>
                        <button className="filter-pill"
                            onClick={() => setFilterSport('All')}
                            style={{
                                ...styles.filterPill,
                                background: filterSport === 'All' ? '#22c55e' : 'rgba(255,255,255,0.06)',
                                color: filterSport === 'All' ? '#000' : '#94a3b8',
                                border: `1px solid ${filterSport === 'All' ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                            }}>
                            🏟️ All ({turfs.length})
                        </button>
                        {['Football','Cricket','Basketball','Badminton','Tennis'].map(s => {
                            const cfg = getSport(s);
                            const isActive = filterSport === s;
                            return (
                                <button key={s} className="filter-pill"
                                    onClick={() => setFilterSport(s)}
                                    style={{
                                        ...styles.filterPill,
                                        background: isActive ? cfg.color + '22' : 'rgba(255,255,255,0.06)',
                                        color: isActive ? cfg.color : '#94a3b8',
                                        border: `1px solid ${isActive ? cfg.color + '44' : 'rgba(255,255,255,0.1)'}`,
                                        boxShadow: isActive ? `0 4px 16px ${cfg.color}22` : 'none',
                                    }}>
                                    {cfg.emoji} {s} ({sportCounts[s]})
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* LOADING */}
                {loading && (
                    <div style={styles.centerBox}>
                        <p style={{fontSize: '48px', marginBottom: '16px'}}>⏳</p>
                        <p style={{color: '#94a3b8', fontSize: '18px'}}>Loading turfs...</p>
                    </div>
                )}

                {/* TURFS GRID */}
                {!loading && (
                    <div style={styles.grid}>
                        {filteredTurfs.map((turf, idx) => {
                            const cfg = getSport(turf.sportType);
                            return (
                                <div key={turf.id} className="turf-card"
                                    style={{
                                        ...styles.card,
                                        animationDelay: `${idx * 0.05}s`,
                                    }}>

                                    {/* CARD IMAGE with sport bg */}
                                    <div style={{
                                        ...styles.cardImg,
                                        backgroundImage: `url(${cfg.image})`,
                                    }}>
                                        <div style={{
                                            ...styles.cardImgOverlay,
                                            background: `linear-gradient(180deg, transparent 20%, #111827 100%)`,
                                        }}/>
                                        {/* Sport tag */}
                                        <div style={{...styles.sportTag, background: cfg.color}}>
                                            {cfg.emoji} {turf.sportType}
                                        </div>
                                        {/* ID badge */}
                                        <div style={styles.idBadge}>#{turf.id}</div>
                                        {/* Name overlay */}
                                        <div style={styles.cardNameOverlay}>
                                            <h3 style={styles.turfName}>{turf.name}</h3>
                                        </div>
                                        {/* Color accent line */}
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            height: '3px', background: cfg.color, opacity: 0.8,
                                        }}/>
                                    </div>

                                    {/* CARD BODY */}
                                    <div style={styles.cardBody}>
                                        <div style={styles.cardInfo}>
                                            {[
                                                { icon: '📍', val: turf.location },
                                                { icon: '🏠', val: turf.address },
                                                turf.openTime && { icon: '🕐', val: `${turf.openTime} – ${turf.closeTime}` },
                                            ].filter(Boolean).map((item, i) => (
                                                <p key={i} style={styles.infoRow}>
                                                    <span style={{flexShrink: 0}}>{item.icon}</span>
                                                    <span style={styles.infoVal}>{item.val}</span>
                                                </p>
                                            ))}
                                            {turf.description && (
                                                <p style={styles.descTxt}>{turf.description}</p>
                                            )}
                                        </div>

                                        {/* CARD FOOTER */}
                                        <div style={styles.cardFooter}>
                                            <div>
                                                <p style={styles.priceLabel}>Per Hour</p>
                                                <p style={{...styles.price, color: cfg.color}}>
                                                    ₹{turf.pricePerHour}
                                                </p>
                                            </div>
                                            <div style={styles.cardBtns}>
                                                <button className="action-btn" style={styles.editBtn}
                                                    onClick={() => handleEdit(turf)}>
                                                    ✏️ Edit
                                                </button>
                                                <button className="action-btn" style={styles.slotsBtn}
                                                    onClick={() => openSlotModal(turf)}>
                                                    📅 Slots
                                                </button>
                                                <button className="action-btn" style={styles.deleteBtn}
                                                    onClick={() => handleDelete(turf.id)}>
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && filteredTurfs.length === 0 && (
                    <div style={styles.emptyBox}>
                        <p style={{fontSize: '64px', marginBottom: '16px'}}>🏟️</p>
                        <h3 style={styles.emptyTitle}>No turfs found</h3>
                        <p style={{color: '#64748b', marginBottom: '24px'}}>
                            {filterSport !== 'All' ? `No ${filterSport} turfs yet` : 'Add your first turf!'}
                        </p>
                        <button style={styles.emptyBtn}
                            onClick={() => { setFilterSport('All'); setShowForm(true); window.scrollTo({top:0, behavior:'smooth'}); }}>
                            ＋ Add First Turf
                        </button>
                    </div>
                )}
            </div>

            {/* ══════════════ SLOT MODAL ══════════════ */}
            {showSlotModal && selectedTurf && (
                <div style={styles.modalOverlay} onClick={() => setShowSlotModal(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>

                        {/* Modal Header with sport image */}
                        <div style={{
                            ...styles.modalHero,
                            backgroundImage: `url(${getSport(selectedTurf.sportType).image})`,
                        }}>
                            <div style={styles.modalHeroOverlay}/>
                            <div style={styles.modalHeroContent}>
                                <div style={{
                                    ...styles.modalSportTag,
                                    background: getSport(selectedTurf.sportType).color,
                                }}>
                                    {getSport(selectedTurf.sportType).emoji} {selectedTurf.sportType}
                                </div>
                                <h2 style={styles.modalTitle}>📅 Manage Slots</h2>
                                <p style={styles.modalSub}>{selectedTurf.name} · {selectedTurf.location}</p>
                            </div>
                            <button style={styles.closeBtn} onClick={() => setShowSlotModal(false)}>✕</button>
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                height: '3px', background: getSport(selectedTurf.sportType).color,
                            }}/>
                        </div>

                        <div style={styles.modalBody}>
                            {/* DATE SELECTOR */}
                            <div style={styles.dateSectionLabel}>📆 Select Date</div>
                            <div style={styles.dateRow}>
                                {[0,1,2,3,4,5,6].map(offset => {
                                    const d = new Date();
                                    d.setDate(d.getDate() + offset);
                                    const dateStr = d.toISOString().split('T')[0];
                                    const isSelected = selectedDate === dateStr;
                                    const cfg = getSport(selectedTurf.sportType);
                                    const dayName = offset === 0 ? 'Today' : offset === 1 ? 'Tmrw' :
                                        d.toLocaleDateString('en', {weekday: 'short'});
                                    return (
                                        <button key={dateStr}
                                            onClick={() => { setSelectedDate(dateStr); setGeneratedSlots([]); }}
                                            style={{
                                                ...styles.dateChip,
                                                background: isSelected ? cfg.color : 'rgba(255,255,255,0.06)',
                                                color: isSelected ? '#000' : '#94a3b8',
                                                border: `1px solid ${isSelected ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                                                boxShadow: isSelected ? `0 4px 16px ${cfg.color}44` : 'none',
                                                transform: isSelected ? 'translateY(-2px)' : 'none',
                                            }}>
                                            <span style={{fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px'}}>{dayName}</span>
                                            <span style={{fontSize: '20px', fontWeight: '800'}}>{d.getDate()}</span>
                                            <span style={{fontSize: '10px', opacity: 0.7}}>
                                                {d.toLocaleDateString('en', {month: 'short'})}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* GENERATE ROW */}
                            <div style={styles.generateRow}>
                                <div>
                                    <p style={styles.generateTitle}>⚡ Generate Hourly Slots</p>
                                    <p style={styles.generateInfo}>
                                        6:00 AM → 11:00 PM for <strong style={{color: '#fff'}}>{selectedDate}</strong>
                                    </p>
                                </div>
                                <button
                                    className="action-btn"
                                    style={{
                                        ...styles.generateBtn,
                                        background: getSport(selectedTurf.sportType).color,
                                        opacity: slotLoading ? 0.7 : 1,
                                    }}
                                    onClick={handleGenerateSlots}
                                    disabled={slotLoading}
                                >
                                    {slotLoading ? '⏳ Generating...' : '⚡ Generate Slots'}
                                </button>
                            </div>

                            {/* SLOTS DISPLAY */}
                            {generatedSlots.length > 0 && (
                                <div style={styles.slotsBox}>
                                    <div style={styles.slotsBoxHeader}>
                                        <p style={styles.slotsBoxTitle}>
                                            ✅ {generatedSlots.length} slots for {selectedDate}
                                        </p>
                                        <div style={styles.slotLegend}>
                                            <span style={styles.legendItem}>🟢 Available</span>
                                            <span style={styles.legendItem}>🔴 Booked</span>
                                        </div>
                                    </div>

                                    {[
                                        { label: '🌅 Morning', filter: h => h < 12 },
                                        { label: '☀️ Afternoon & Evening', filter: h => h >= 12 },
                                    ].map(group => {
                                        const slots = generatedSlots.filter(s =>
                                            group.filter(parseInt(s.startTime?.split(':')[0]))
                                        );
                                        if (!slots.length) return null;
                                        return (
                                            <div key={group.label} style={styles.slotGroup}>
                                                <p style={styles.slotGroupLabel}>{group.label}</p>
                                                <div style={styles.slotsRow}>
                                                    {slots.map(slot => (
                                                        <div key={slot.id} style={{
                                                            ...styles.slotChip,
                                                            background: slot.isAvailable
                                                                ? 'rgba(34,197,94,0.1)'
                                                                : 'rgba(239,68,68,0.1)',
                                                            border: `1px solid ${slot.isAvailable ? '#22c55e44' : '#ef444444'}`,
                                                            color: slot.isAvailable ? '#22c55e' : '#ef4444',
                                                        }}>
                                                            <span>{formatTime(slot.startTime)}</span>
                                                            <span style={{fontSize: '9px'}}>
                                                                {slot.isAvailable ? '🟢' : '🔴'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#050a14', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" },

    // HERO
    hero: { position: 'relative', padding: '60px 32px 48px', overflow: 'hidden' },
    heroBg: {
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(3px) brightness(0.2)',
    },
    heroOverlay: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(5,10,20,0.5) 0%, rgba(5,10,20,0.96) 100%)',
    },
    heroContent: {
        position: 'relative', zIndex: 1,
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px',
    },
    heroLeft: {},
    heroBreadcrumb: { color: '#475569', fontSize: '13px', marginBottom: '8px' },
    heroTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff', fontSize: '56px',
        letterSpacing: '3px', margin: '0 0 6px 0',
        textShadow: '0 4px 30px rgba(0,0,0,0.5)',
    },
    heroSub: { color: '#64748b', fontSize: '14px', marginBottom: '20px' },
    heroStats: {
        display: 'flex', gap: '0',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        width: 'fit-content',
    },
    heroStat: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '10px 18px',
        gap: '2px', borderRight: '1px solid rgba(255,255,255,0.08)',
    },
    addBtn: {
        padding: '14px 28px', borderRadius: '12px',
        cursor: 'pointer', fontSize: '15px',
        fontWeight: '800', transition: 'all 0.2s',
        letterSpacing: '0.5px',
        boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
    },

    // BODY
    body: { maxWidth: '1200px', margin: '0 auto', padding: '28px 32px 60px' },

    // FORM
    formCard: {
        background: '#111827', borderRadius: '16px',
        overflow: 'hidden', border: '1px solid #1e293b',
        marginBottom: '28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    },
    formCardHeader: { position: 'relative' },
    formAccent: { height: '4px', width: '100%' },
    formHeaderContent: {
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '20px 24px 16px',
        borderBottom: '1px solid #1e293b',
    },
    formTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff', fontSize: '28px',
        letterSpacing: '1px', margin: '0 0 2px 0',
    },
    formSub: { color: '#64748b', fontSize: '12px', margin: 0 },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px', padding: '20px 24px',
    },
    field: {},
    label: {
        color: '#64748b', fontSize: '11px', fontWeight: '700',
        letterSpacing: '0.5px', display: 'block',
        marginBottom: '6px', textTransform: 'uppercase',
    },
    input: {
        width: '100%', padding: '11px 14px',
        background: '#0f172a', border: '1px solid #1e293b',
        borderRadius: '8px', color: '#ffffff',
        fontSize: '14px', transition: 'all 0.2s',
    },
    formBtns: {
        display: 'flex', gap: '12px',
        justifyContent: 'flex-end',
        padding: '16px 24px',
        borderTop: '1px solid #1e293b',
        background: '#0f172a',
    },
    cancelBtn: {
        background: 'transparent', color: '#64748b',
        border: '1px solid #1e293b', padding: '11px 24px',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '14px', fontWeight: '700',
    },
    saveBtn: {
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#000', border: 'none',
        padding: '11px 28px', borderRadius: '8px',
        cursor: 'pointer', fontSize: '14px',
        fontWeight: '800', transition: 'all 0.2s',
    },

    // FILTER
    filterRow: {
        display: 'flex', gap: '10px',
        flexWrap: 'wrap', marginBottom: '24px',
    },
    filterPill: {
        padding: '9px 18px', borderRadius: '20px',
        fontSize: '13px', fontWeight: '700',
        cursor: 'pointer', transition: 'all 0.2s',
        letterSpacing: '0.3px',
    },

    // GRID
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px',
    },
    card: {
        background: '#111827', borderRadius: '16px',
        overflow: 'hidden', border: '1px solid #1e293b',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    },
    cardImg: {
        height: '160px', position: 'relative',
        backgroundSize: 'cover', backgroundPosition: 'center',
    },
    cardImgOverlay: { position: 'absolute', inset: 0 },
    sportTag: {
        position: 'absolute', top: '12px', left: '12px',
        color: '#000', padding: '5px 12px',
        borderRadius: '6px', fontSize: '11px',
        fontWeight: '800', letterSpacing: '1px', zIndex: 1,
    },
    idBadge: {
        position: 'absolute', top: '12px', right: '12px',
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
        color: '#64748b', padding: '4px 10px',
        borderRadius: '6px', fontSize: '12px',
        fontWeight: '700', zIndex: 1,
        border: '1px solid rgba(255,255,255,0.08)',
    },
    cardNameOverlay: {
        position: 'absolute', bottom: '10px', left: '14px', right: '14px', zIndex: 1,
    },
    turfName: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff', fontSize: '24px',
        letterSpacing: '1px', margin: 0,
        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
    },
    cardBody: { padding: '16px 18px' },
    cardInfo: { marginBottom: '14px' },
    infoRow: {
        display: 'flex', alignItems: 'flex-start',
        gap: '8px', color: '#94a3b8',
        fontSize: '13px', marginBottom: '5px',
    },
    infoVal: { flex: 1, lineHeight: 1.4 },
    descTxt: {
        color: '#475569', fontSize: '12px',
        fontStyle: 'italic', lineHeight: 1.5,
        marginTop: '6px',
    },
    cardFooter: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', paddingTop: '12px',
        borderTop: '1px solid #1e293b',
    },
    priceLabel: { color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' },
    price: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '1px', margin: 0 },
    cardBtns: { display: 'flex', gap: '8px' },
    editBtn: {
        background: '#f59e0b18', color: '#f59e0b',
        border: '1px solid #f59e0b33', padding: '7px 14px',
        borderRadius: '6px', cursor: 'pointer',
        fontSize: '12px', fontWeight: '700', transition: 'all 0.2s',
    },
    slotsBtn: {
        background: '#3b82f618', color: '#60a5fa',
        border: '1px solid #3b82f633', padding: '7px 14px',
        borderRadius: '6px', cursor: 'pointer',
        fontSize: '12px', fontWeight: '700', transition: 'all 0.2s',
    },
    deleteBtn: {
        background: '#ef444418', color: '#ef4444',
        border: '1px solid #ef444433', padding: '7px 11px',
        borderRadius: '6px', cursor: 'pointer',
        fontSize: '13px', transition: 'all 0.2s',
    },

    centerBox: { textAlign: 'center', padding: '80px' },
    emptyBox: {
        textAlign: 'center', padding: '80px',
        background: '#111827', borderRadius: '16px',
        border: '1px solid #1e293b',
    },
    emptyTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff', fontSize: '32px',
        letterSpacing: '2px', marginBottom: '8px',
    },
    emptyBtn: {
        background: '#22c55e', color: '#000',
        border: 'none', padding: '13px 28px',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '14px', fontWeight: '800',
    },

    // MODAL
    modalOverlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 2000, padding: '20px',
    },
    modal: {
        background: '#111827', borderRadius: '20px',
        width: '100%', maxWidth: '680px',
        maxHeight: '90vh', overflowY: 'auto',
        border: '1px solid #1e293b',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
    },
    modalHero: {
        height: '140px', position: 'relative',
        backgroundSize: 'cover', backgroundPosition: 'center',
    },
    modalHeroOverlay: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(5,10,20,0.4) 0%, rgba(17,24,39,0.95) 100%)',
    },
    modalHeroContent: {
        position: 'absolute', bottom: '16px', left: '24px', zIndex: 1,
    },
    modalSportTag: {
        display: 'inline-block', color: '#000',
        padding: '4px 12px', borderRadius: '4px',
        fontSize: '11px', fontWeight: '800',
        letterSpacing: '1px', marginBottom: '6px',
    },
    modalTitle: {
        fontFamily: "'Bebas Neue', sans-serif",
        color: '#ffffff', fontSize: '30px',
        letterSpacing: '2px', margin: '0 0 2px 0',
    },
    modalSub: { color: '#64748b', fontSize: '13px', margin: 0 },
    closeBtn: {
        position: 'absolute', top: '14px', right: '14px',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
        color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)',
        width: '34px', height: '34px', borderRadius: '8px',
        cursor: 'pointer', fontSize: '14px', zIndex: 2,
    },
    modalBody: { padding: '24px' },

    dateSectionLabel: {
        color: '#64748b', fontSize: '11px', fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: '1px',
        marginBottom: '12px',
    },
    dateRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' },
    dateChip: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '10px 14px',
        borderRadius: '10px', cursor: 'pointer',
        gap: '1px', minWidth: '60px',
        transition: 'all 0.2s',
    },
    generateRow: {
        background: '#0f172a', borderRadius: '12px',
        padding: '16px 20px', marginBottom: '20px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
        border: '1px solid #1e293b',
    },
    generateTitle: { color: '#ffffff', fontSize: '14px', fontWeight: '800', marginBottom: '3px' },
    generateInfo: { color: '#64748b', fontSize: '13px', margin: 0 },
    generateBtn: {
        color: '#000', border: 'none',
        padding: '11px 22px', borderRadius: '8px',
        cursor: 'pointer', fontSize: '14px',
        fontWeight: '800', whiteSpace: 'nowrap',
        transition: 'all 0.2s',
    },
    slotsBox: {
        background: '#0f172a', borderRadius: '12px',
        padding: '18px', border: '1px solid #1e293b',
    },
    slotsBoxHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '16px',
        flexWrap: 'wrap', gap: '8px',
    },
    slotsBoxTitle: { color: '#22c55e', fontSize: '13px', fontWeight: '700', margin: 0 },
    slotLegend: { display: 'flex', gap: '16px' },
    legendItem: { color: '#64748b', fontSize: '12px' },
    slotGroup: { marginBottom: '14px' },
    slotGroupLabel: {
        color: '#64748b', fontSize: '11px', fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: '1px',
        marginBottom: '8px',
    },
    slotsRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    slotChip: {
        padding: '7px 12px', borderRadius: '8px',
        fontSize: '12px', fontWeight: '700',
        display: 'flex', alignItems: 'center', gap: '5px',
    },
};

export default AdminTurfs;