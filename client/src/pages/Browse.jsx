import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Users, Star, Calendar, Dog, Home as HomeIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Browse = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const locationState = useLocation();
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        location: '',
        category: '',
        guests: '',
        pets: false,
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(locationState.search);
        const loc = queryParams.get('location') || '';
        const cat = queryParams.get('category') || '';
        const gst = queryParams.get('guests') || '';
        const pts = queryParams.get('pets') === 'true';
        const start = queryParams.get('startDate') || '';
        const end = queryParams.get('endDate') || '';

        setFilters(prev => ({
            ...prev,
            location: loc,
            category: cat,
            guests: gst,
            pets: pts,
            startDate: start,
            endDate: end
        }));

        fetchProperties({
            location: loc,
            category: cat,
            guests: gst,
            pets: pts,
            startDate: start,
            endDate: end
        });
    }, [locationState.search]);

    const fetchProperties = async (searchFilters = filters) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchFilters.location) params.append('location', searchFilters.location);
            if (searchFilters.category) params.append('category', searchFilters.category);
            if (searchFilters.guests) params.append('guests', searchFilters.guests);
            if (searchFilters.pets) params.append('pets', 'true');
            if (searchFilters.startDate) params.append('startDate', searchFilters.startDate);
            if (searchFilters.endDate) params.append('endDate', searchFilters.endDate);

            const { data } = await axios.get(`http://localhost:5000/api/properties?${params.toString()}`);
            setProperties(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties();
    };

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            <div style={{ marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Find Your <span style={{ color: 'var(--primary)' }}>Extraordinary</span></h1>

                {/* Advanced Search Bar */}
                <form onSubmit={handleSearch} className="glass-panel search-bar-grid" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>LOCATION</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={16} style={{ position: 'absolute', top: '0.65rem', left: '0.75rem', color: 'var(--primary)' }} />
                            <input
                                type="text"
                                placeholder="City/Region"
                                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>START DATE</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={16} style={{ position: 'absolute', top: '0.65rem', left: '0.75rem', color: 'var(--primary)' }} />
                            <input
                                type="date"
                                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>EVENING DATE</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={16} style={{ position: 'absolute', top: '0.65rem', left: '0.75rem', color: 'var(--primary)' }} />
                            <input
                                type="date"
                                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>GUESTS & PETS</label>
                        <div style={{ position: 'relative', display: 'flex', gap: '0.25rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Users size={16} style={{ position: 'absolute', top: '0.65rem', left: '0.75rem', color: 'var(--primary)' }} />
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
                                    value={filters.guests}
                                    onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                                />
                            </div>
                            <div
                                onClick={() => setFilters({ ...filters, pets: !filters.pets })}
                                style={{
                                    padding: '0 0.5rem',
                                    background: filters.pets ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    border: '1px solid var(--glass-border)',
                                    transition: '0.3s'
                                }}
                                title="Pets Allowed"
                            >
                                <Dog size={18} color={filters.pets ? 'white' : 'var(--text-muted)'} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>STAY TYPE</label>
                        <select
                            style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="" style={{ background: '#1e293b' }}>All Unique Stays</option>
                            <option value="Room" style={{ background: '#1e293b' }}>Private Rooms</option>
                            <option value="Entire Villa" style={{ background: '#1e293b' }}>Entire Villas</option>
                            <option value="Unique Stay" style={{ background: '#1e293b' }}>Artistic Spaces</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', borderRadius: '12px' }}>
                        <Search size={22} />
                    </button>
                </form>
            </div>

            <div className="browse-property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '10rem' }}>Searching for the best stays...</div>
                ) : properties.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '10rem', color: 'var(--text-muted)' }}>
                        <HomeIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No properties match your criteria. Try adjusting your search filters.</p>
                    </div>
                ) : properties.map((prop, i) => (
                    <motion.div
                        key={prop._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel"
                        style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => navigate(`/property/${prop._id}`)}
                    >
                        <div style={{ position: 'relative' }}>
                            <img src={prop.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'} style={{ width: '100%', height: 260, objectFit: 'cover' }} alt="" />
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem 0.8rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                {prop.category}
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{prop.title}</h3>
                                <div className="flex" style={{ gap: '0.25rem', color: 'var(--accent)' }}><Star size={14} fill="var(--accent)" /> 4.9</div>
                            </div>
                            <div className="flex gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <MapPin size={16} /> {prop.location}
                            </div>
                            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                <div>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>${prop.pricePerNight}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / night</span>
                                </div>
                                <div className="flex gap-3" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <span className="flex gap-1"><Users size={16} /> {prop.maxGuests}</span>
                                    {prop.petsAllowed && <Dog size={16} color="var(--primary)" />}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Browse;
