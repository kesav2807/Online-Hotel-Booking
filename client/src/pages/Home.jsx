import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, Dog, Home as HomeIcon, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    const { user, socket } = useAuth();
    const [searchParams, setSearchParams] = useState({
        location: '',
        startDate: '',
        endDate: '',
        guests: '',
        pets: false,
        phone: ''
    });
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [broadcasting, setBroadcasting] = useState(false);

    const handleSearch = () => {
        if (!user) {
            alert('Please login to broadcast a search request');
            navigate('/login');
            return;
        }

        if (!searchParams.location || !searchParams.startDate || !searchParams.endDate || !searchParams.guests) {
            alert('Please fill in all search fields (Location, Check-in, Check-out, and Guests)');
            return;
        }

        // Automatic Switch: Use user's profile phone number if available
        if (user.phone) {
            if (window.confirm(`Broadcast search request using your registered number: ${user.phone}?`)) {
                handleBroadcast(user.phone);
            }
            // If they cancel, they might want to use a different number? 
            // For now, let's assume confirm = go, cancel = stay. 
            // Or better, if they cancel, show modal?
            // "request send manual typing is not to wortable" suggests they really want auto.
            // Let's just do it directly or with a simple confirm.
        } else {
            setShowPhoneModal(true);
        }
    };

    const handleBroadcast = async (phoneOverride = null) => {
        const phoneToUse = phoneOverride || searchParams.phone;

        if (!phoneToUse) {
            alert('Please enter your phone number');
            return;
        }

        setBroadcasting(true);
        try {
            // 1. Save to Database (Persistence)
            const { data: broadcast } = await axios.post('https://hotel-backend-uasi.onrender.com/api/broadcasts', {
                location: searchParams.location,
                checkInDate: searchParams.startDate,
                checkOutDate: searchParams.endDate,
                guests: parseInt(searchParams.guests),
                pets: searchParams.pets,
                phone: phoneToUse
            });

            // 2. Emit Socket Event (Real-time)
            if (socket) {
                socket.emit('broadcast_search', {
                    location: searchParams.location,
                    checkInDate: searchParams.startDate,
                    checkOutDate: searchParams.endDate,
                    guests: parseInt(searchParams.guests),
                    pets: searchParams.pets,
                    phone: phoneToUse,
                    broadcastId: broadcast._id,
                    userDetails: {
                        username: user.username,
                        id: user._id
                    }
                });
            }

            setShowPhoneModal(false);
            alert('🎉 Your request has been broadcast to all property owners in ' + searchParams.location + '! They will call you soon.');

            // Reset form
            setSearchParams({
                location: '',
                startDate: '',
                endDate: '',
                guests: '',
                phone: ''
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to broadcast request');
        } finally {
            setBroadcasting(false);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Premium Hero Section */}
            <section style={{
                position: 'relative',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 2rem',
                overflow: 'hidden',
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80) center/cover'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
                />

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '5.5rem', fontWeight: 900, marginBottom: '1.5rem', maxWidth: 1000, lineHeight: 1.1, color: 'white' }}
                >
                    Find Your <span style={{ color: 'var(--primary)', textShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}>Masterpiece</span> Stay
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.9)', marginBottom: '4rem', maxWidth: 800, fontWeight: 300 }}
                >
                    Exquisite rooms, private villas, and curated unique experiences for the discerning traveler.
                </motion.p>

                {/* Advanced Search Bar (Motor of the Project) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: 'spring', damping: 20 }}
                    className="glass-panel search-bar-grid"
                    style={{
                        maxWidth: 1200,
                        width: '100%',
                        padding: '1.25rem',
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.8fr auto',
                        gap: '0.5rem',
                        alignItems: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(30px)'
                    }}
                >
                    <div style={{ textAlign: 'left', padding: '0 1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '2px' }}>LOCATION</label>
                        <div className="flex gap-2">
                            <MapPin size={18} color="var(--primary)" />
                            <input
                                type="text"
                                placeholder="Where to?"
                                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1rem', width: '100%', fontWeight: 500 }}
                                value={searchParams.location}
                                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'left', padding: '0 1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '2px' }}>CHECK IN</label>
                        <div className="flex gap-2">
                            <Calendar size={18} color="var(--primary)" />
                            <input
                                type="date"
                                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1rem', width: '100%', fontWeight: 500 }}
                                onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'left', padding: '0 1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '2px' }}>CHECK OUT</label>
                        <div className="flex gap-2">
                            <Calendar size={18} color="var(--primary)" />
                            <input
                                type="date"
                                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1rem', width: '100%', fontWeight: 500 }}
                                onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'left', padding: '0 1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '2px' }}>GUESTS</label>
                        <div className="flex gap-2">
                            <Users size={18} color="var(--primary)" />
                            <input
                                type="number"
                                placeholder="Add"
                                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1rem', width: '100%', fontWeight: 500 }}
                                value={searchParams.guests}
                                onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'left', padding: '0 1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '2px' }}>PETS</label>
                        <div className="flex gap-2" style={{ cursor: 'pointer', alignItems: 'center' }} onClick={() => setSearchParams({ ...searchParams, pets: !searchParams.pets })}>
                            <Dog size={18} color={searchParams.pets ? "var(--primary)" : "white"} />
                            <span style={{ fontSize: '1rem', fontWeight: 500, color: searchParams.pets ? "var(--primary)" : "white" }}>
                                {searchParams.pets ? "Yes" : "No"}
                            </span>
                        </div>
                    </div>

                    <motion.button
                        className="btn btn-primary"
                        style={{ padding: '1rem 2rem', borderRadius: '16px', boxShadow: '0 10px 20px -5px var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}
                        onClick={handleSearch}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Search size={20} /> BROADCAST REQUEST
                    </motion.button>
                </motion.div>

                {/* Phone Number Modal */}
                <AnimatePresence>
                    {showPhoneModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 9999
                            }}
                            onClick={() => setShowPhoneModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="glass-panel"
                                style={{
                                    maxWidth: '500px',
                                    width: '90%',
                                    padding: '3rem',
                                    position: 'relative'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowPhoneModal(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white'
                                    }}
                                >
                                    <X size={20} />
                                </button>

                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem'
                                    }}>
                                        <Phone size={40} color="white" />
                                    </div>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>One Last Step!</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                                        Property owners will call you on this number
                                    </p>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                                        YOUR PHONE NUMBER
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                        value={searchParams.phone}
                                        onChange={(e) => setSearchParams({ ...searchParams, phone: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'white',
                                            fontSize: '1.1rem',
                                            textAlign: 'center'
                                        }}
                                        autoFocus
                                    />
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 800 }}
                                    onClick={handleBroadcast}
                                    disabled={broadcasting}
                                >
                                    {broadcasting ? 'Broadcasting...' : '📡 BROADCAST TO ALL OWNERS'}
                                </button>

                                <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    All property owners in <strong style={{ color: 'var(--primary)' }}>{searchParams.location}</strong> will receive your request
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Category Filter Section */}
            <section className="container" style={{ margin: '6rem auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Rooms', icon: <Users size={24} />, value: 'Room' },
                        { label: 'Entire Villa', icon: <HomeIcon size={24} />, value: 'Entire Villa' },
                        { label: 'Unique Stays', icon: <Star size={24} />, value: 'Unique Stay' }
                    ].map((cat, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(`/browse?category=${cat.value}`)}
                            style={{ textAlign: 'center', cursor: 'pointer', transition: '0.3s' }}
                            className="hover-primary"
                        >
                            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid var(--glass-border)' }}>
                                {cat.icon}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Section */}
            <section className="container" style={{ marginBottom: '8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <span style={{ color: 'var(--primary)', fontWeight: 600, letterSpacing: '2px', fontSize: '0.9rem' }}>TOP PICK</span>
                        <h2 style={{ fontSize: '2.5rem' }}>Experience Pure Luxury</h2>
                    </div>
                    <Link to="/browse" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Browse all destinations <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {[1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="glass-panel"
                            style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => navigate('/browse')}
                        >
                            <div style={{ height: 280, background: `url(https://images.unsplash.com/photo-${i === 1 ? '1512917774080-9991f1c4c750' : i === 2 ? '1582268611958-ebfd161ef9cf' : '1560448204-603b3fc33ddc'}?auto=format&fit=crop&w=800&q=80) center/cover` }}></div>
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>{i === 1 ? 'Room' : 'Entire Villa'}</span>
                                    <div className="flex" style={{ gap: '0.25rem', color: 'var(--accent)' }}><Star size={14} fill="var(--accent)" /> 5.0</div>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>{i === 1 ? 'Azure Horizon Retreat' : i === 2 ? 'Whispering Palms Villa' : 'The Glass Sanctuary'}</h3>
                                <div className="flex" style={{ gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}><MapPin size={16} /> Bali, Indonesia</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                                    <div><span style={{ fontSize: '1.5rem', fontWeight: 800 }}>${300 + i * 50}</span> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ night</span></div>
                                    <button className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>Reserve</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;

