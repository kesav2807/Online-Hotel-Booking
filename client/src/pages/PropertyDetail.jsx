import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, Star, Shield, Coffee, Wifi, AirVent, Check, Dog, Home, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enquiryData, setEnquiryData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guests: 1,
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await axios.get(`https://hotel-backend-uasi.onrender.com/api/properties/${id}`);
                setProperty(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleEnquiry = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');

        setSending(true);
        try {
            await axios.post('https://hotel-backend-uasi.onrender.com/api/enquiries', {
                propertyId: id,
                ...enquiryData
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send enquiry');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div style={{ paddingTop: '10rem', textAlign: 'center' }}>Loading Property Details...</div>;
    if (!property) return <div style={{ paddingTop: '10rem', textAlign: 'center' }}>Property Not Found</div>;

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            <div className="property-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem', alignItems: 'start' }}>
                {/* Left Side: Content */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div className="flex gap-2">
                                <span style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{property.category}</span>
                                {property.petsAllowed && <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }} className="flex gap-1"><Dog size={14} /> Pets Allowed</span>}
                            </div>
                            <div className="flex" style={{ gap: '0.5rem', color: 'var(--accent)' }}><Star size={20} fill="var(--accent)" /> 4.9 (Direct Listing)</div>
                        </div>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{property.title}</h1>
                        <div className="flex gap-2" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                            <MapPin size={20} /> {property.location}
                        </div>
                    </motion.div>

                    {/* Image Gallery */}
                    <div className="property-gallery-grid" style={{ display: 'grid', gridTemplateColumns: property.images?.length > 1 ? '2fr 1fr' : '1fr', gap: '1rem', height: 450, marginBottom: '3rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        {property.images?.length > 1 && (
                            <div style={{ display: 'grid', gridTemplateRows: property.images?.length > 2 ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                                <img src={property.images[1] || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                {property.images?.length > 2 && <img src={property.images[2] || 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=600&q=80'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
                            </div>
                        )}
                    </div>

                    <div className="property-info-row" style={{ marginBottom: '3.5rem', display: 'flex', gap: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem' }}>
                        <div className="flex flex-col gap-1">
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>CAPACITY</span>
                            <span className="flex gap-2 font-bold"><Users size={18} color="var(--primary)" /> {property.maxGuests} Guests</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>TYPE</span>
                            <span className="flex gap-2 font-bold"><Home size={18} color="var(--primary)" /> {property.category}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>PETS</span>
                            <span className="flex gap-2 font-bold"><Dog size={18} color="var(--primary)" /> {property.petsAllowed ? 'Allowed' : 'Not Allowed'}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '3.5rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>About this space</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>{property.description}</p>
                    </div>

                    <div style={{ marginBottom: '3.5rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>What we offer</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                            <div className="flex gap-3"><Wifi size={24} color="var(--primary)" /> High-speed Wifi access</div>
                            <div className="flex gap-3"><Coffee size={24} color="var(--primary)" /> Morning breakfast spread</div>
                            <div className="flex gap-3"><AirVent size={24} color="var(--primary)" /> Climate control & AC</div>
                            <div className="flex gap-3"><Shield size={24} color="var(--primary)" /> Professional guest security</div>
                        </div>
                    </div>

                    {/* Owner Info */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <img
                            src={(!property.owner?.avatar || property.owner?.avatar.includes('placeholder')) ? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80' : property.owner.avatar}
                            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
                            alt=""
                        />
                        <div>
                            <h3 style={{ marginBottom: '0.25rem' }}>Hosted by {property.owner?.username}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verified Premium Host Since 2024</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Enquiry Form */}
                <aside className="glass-panel" style={{ padding: '2.5rem', position: 'sticky', top: '8rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800 }}>${property.pricePerNight}</span>
                        <span style={{ color: 'var(--text-muted)' }}> / night</span>
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '2rem 0' }}
                        >
                            <div style={{ width: 60, height: 60, background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <Check size={32} color="white" />
                            </div>
                            <h3>Interest Request Sent!</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{property.owner?.username} will verify availability and contact you.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CHECK-IN</label>
                                    <input
                                        type="date"
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                        value={enquiryData.checkInDate}
                                        onChange={(e) => setEnquiryData({ ...enquiryData, checkInDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CHECK-OUT</label>
                                    <input
                                        type="date"
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                        value={enquiryData.checkOutDate}
                                        onChange={(e) => setEnquiryData({ ...enquiryData, checkOutDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>GUESTS</label>
                                <div style={{ position: 'relative' }}>
                                    <Users size={16} style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', color: 'var(--primary)' }} />
                                    <input
                                        type="number"
                                        min={property.minGuests}
                                        max={property.maxGuests}
                                        placeholder="Number of guests"
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                        value={enquiryData.guests}
                                        onChange={(e) => setEnquiryData({ ...enquiryData, guests: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PERSONAL NOTE</label>
                                <textarea
                                    rows="4"
                                    placeholder="Tell the owner about your plans..."
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', resize: 'none' }}
                                    value={enquiryData.message}
                                    onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={sending}>
                                {sending ? 'Sending...' : 'Send Interest Request'}
                            </button>

                            <div className="flex gap-2 items-start" style={{ textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px' }}>
                                <Info size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                                <span>Requests are direct and transparent. The owner will review your profile before confirming.</span>
                            </div>
                        </form>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default PropertyDetail;

