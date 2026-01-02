import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Home, MessageSquare, Phone, User, Check, X, Users, Calendar, MapPin, Dog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
    const { user, socket } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('broadcasts');
    const [properties, setProperties] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [broadcasts, setBroadcasts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propsRes, enqRes, broadcastRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/properties/my'),
                    axios.get('http://localhost:5000/api/enquiries/owner'),
                    axios.get('http://localhost:5000/api/broadcasts/owner')
                ]);
                setProperties(propsRes.data);
                setEnquiries(enqRes.data);
                setBroadcasts(broadcastRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Socket.IO Listener for Real-Time Broadcasts
        if (socket) {
            socket.on('new_broadcast_request', (payload) => {
                // Show toast/alert (optional, or just update UI)
                // alert(payload.message); 

                // Add new broadcast to state
                // Note: The payload.data matches our broadcast schema structure mostly, 
                // or we might need to conform it. The server sends:
                // { ...data, createdAt: date } -> data includes userDetails

                // We need to shape it to match the API response structure if possible
                // or just rely on re-fetching. For speed, let's prepend to state.
                const newBroadcast = {
                    ...payload.data,
                    _id: payload.data.broadcastId, // server sent broadcastId
                    customer: payload.data.userDetails, // server sent userDetails
                    status: 'open'
                };

                setBroadcasts(prev => [newBroadcast, ...prev]);
            });
        }

        return () => {
            if (socket) {
                socket.off('new_broadcast_request');
            }
        };
    }, [socket]);

    const handleUpdateEnquiry = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/enquiries/${id}`, { status });
            setEnquiries(enquiries.map(e => e._id === id ? { ...e, status } : e));
        } catch (err) {
            alert('Failed to update enquiry');
        }
    };

    const handleAcceptBroadcast = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/broadcasts/${id}/accept`);
            setBroadcasts(broadcasts.filter(b => b._id !== id));
            alert('✅ Request accepted! You can now call the customer.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to accept request');
        }
    };

    if (loading) return <div style={{ paddingTop: '10rem', textAlign: 'center' }}>Loading Dashboard...</div>;

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            {!user?.isSubscribed && (
                <div className="glass-panel dashboard-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--accent)', background: 'rgba(245, 158, 11, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="dashboard-card-content" style={{ flex: 1 }}>
                        <h3 style={{ color: 'var(--accent)' }}>Subscription Inactive</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Only subscribed owners have their properties visible to customers.</p>
                    </div>
                    <div className="dashboard-card-actions">
                        <button className="btn btn-primary mobile-full-width" style={{ background: 'var(--accent)' }} onClick={() => navigate('/owner/subscription')}>Activate Pro</button>
                    </div>
                </div>
            )}

            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Owner Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your property listings and customer enquiries.</p>
                </div>
                <button className="btn btn-primary mobile-full-width" style={{ gap: '0.5rem' }} onClick={() => navigate('/owner/add-property')}>
                    <Plus size={20} /> Add New Property
                </button>
            </div>

            <div className="dashboard-tabs" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div
                    onClick={() => setActiveTab('broadcasts')}
                    style={{ padding: '1rem 0', fontWeight: 600, cursor: 'pointer', borderBottom: activeTab === 'broadcasts' ? '2px solid var(--primary)' : 'none', color: activeTab === 'broadcasts' ? 'var(--primary)' : 'var(--text-muted)' }}
                    className="flex gap-2"
                ><MessageSquare size={20} /> Broadcast Requests ({broadcasts.length})</div>
                <div
                    onClick={() => setActiveTab('properties')}
                    style={{ padding: '1rem 0', fontWeight: 600, cursor: 'pointer', borderBottom: activeTab === 'properties' ? '2px solid var(--primary)' : 'none', color: activeTab === 'properties' ? 'var(--primary)' : 'var(--text-muted)' }}
                    className="flex gap-2"
                ><Home size={20} /> Properties ({properties.length})</div>
                <div
                    onClick={() => setActiveTab('enquiries')}
                    style={{ padding: '1rem 0', fontWeight: 600, cursor: 'pointer', borderBottom: activeTab === 'enquiries' ? '2px solid var(--primary)' : 'none', color: activeTab === 'enquiries' ? 'var(--primary)' : 'var(--text-muted)' }}
                    className="flex gap-2"
                ><MessageSquare size={20} /> Enquiries ({enquiries.length})</div>
            </div>

            {activeTab === 'broadcasts' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {broadcasts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            No broadcast requests yet. Customers will see your properties when they search for your location.
                        </div>
                    ) : broadcasts.map(broadcast => (
                        <motion.div
                            key={broadcast._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel dashboard-card"
                            style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--primary)' }}
                        >
                            <div className="flex dashboard-card-content" style={{ gap: '2rem', flex: 1 }}>
                                <img
                                    src={(!broadcast.customer?.avatar || broadcast.customer?.avatar?.includes('placeholder')) ? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80' : broadcast.customer.avatar}
                                    style={{ width: 80, height: 80, borderRadius: '16px', objectFit: 'cover' }}
                                    alt=""
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.4rem' }}>{broadcast.customer?.username}</h3>
                                        <span style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem', borderRadius: '6px', background: 'var(--primary)', color: 'white', fontWeight: 800, textTransform: 'uppercase' }}>NEW REQUEST</span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                        <div className="flex gap-2" style={{ color: 'white', fontSize: '1rem' }}>
                                            <MapPin size={20} color="var(--primary)" /> <strong>{broadcast.location}</strong>
                                        </div>
                                        <div className="flex gap-2" style={{ color: 'white', fontSize: '1rem' }}>
                                            <Users size={20} color="var(--primary)" /> <strong>{broadcast.guests} Guests</strong>
                                        </div>
                                        {broadcast.pets && (
                                            <div className="flex gap-2" style={{ color: 'white', fontSize: '1rem' }}>
                                                <Dog size={20} color="var(--primary)" /> <strong>Pets Allowed</strong>
                                            </div>
                                        )}
                                        <div className="flex gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <Calendar size={18} /> {new Date(broadcast.checkInDate).toLocaleDateString()} - {new Date(broadcast.checkOutDate).toLocaleDateString()}
                                        </div>
                                        <a href={`tel:${broadcast.phone}`} className="flex gap-2" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 800 }}>
                                            <Phone size={20} /> {broadcast.phone}
                                        </a>
                                    </div>

                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Requested {new Date(broadcast.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex dashboard-card-actions" style={{ gap: '1rem', marginLeft: '2rem' }}>
                                <button
                                    onClick={() => handleAcceptBroadcast(broadcast._id)}
                                    className="btn btn-primary"
                                    style={{ padding: '1rem 2rem', background: '#10b981', gap: '0.5rem', whiteSpace: 'nowrap', fontSize: '1rem', fontWeight: 800 }}
                                >
                                    <Phone size={20} /> ACCEPT & CALL
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : activeTab === 'properties' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {properties.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>You haven't listed any properties yet.</div>
                    ) : properties.map(prop => (
                        <motion.div key={prop._id} className="glass-panel" style={{ padding: '1rem' }}>
                            <img src={prop.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'} style={{ width: '100%', height: 180, borderRadius: 'var(--radius-md)', objectFit: 'cover', marginBottom: '1rem' }} alt="" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem' }}>{prop.title}</h3>
                                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: prop.approvalStatus === 'approved' ? '#10b98122' : '#f59e0b22', color: prop.approvalStatus === 'approved' ? '#10b981' : '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>{prop.approvalStatus}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{prop.location}</p>
                            <div className="flex" style={{ gap: '1rem' }}>
                                <button
                                    className="btn btn-secondary"
                                    style={{ flex: 1, padding: '0.5rem' }}
                                    onClick={() => navigate(`/owner/edit-property/${prop._id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    style={{ flex: 1, padding: '0.5rem', color: '#ff4444' }}
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to delete this property?')) {
                                            try {
                                                await axios.delete(`http://localhost:5000/api/properties/${prop._id}`);
                                                setProperties(properties.filter(p => p._id !== prop._id));
                                            } catch (err) {
                                                alert('Failed to delete property');
                                            }
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {enquiries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No enquiries received yet.</div>
                    ) : enquiries.map(enq => (
                        <motion.div
                            key={enq._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel dashboard-card"
                            style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: enq.status === 'accepted' ? '4px solid #10b981' : enq.status === 'rejected' ? '4px solid #ef4444' : '4px solid var(--primary)' }}
                        >
                            <div className="flex dashboard-card-content" style={{ gap: '1.5rem', flex: 1 }}>
                                <img
                                    src={(!enq.customer?.avatar || enq.customer?.avatar.includes('placeholder')) ? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80' : enq.customer.avatar}
                                    style={{ width: 70, height: 70, borderRadius: '12px', objectFit: 'cover' }}
                                    alt=""
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.2rem' }}>{enq.customer?.username}</h3>
                                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontWeight: 600 }}>{new Date(enq.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <a href={`tel:${enq.customer?.phone}`} className="flex gap-2" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <Phone size={16} /> {enq.customer?.phone || 'No phone provided'}
                                        </a>
                                        <span className="flex gap-2" style={{ color: 'white', fontSize: '0.9rem' }}>
                                            <Users size={16} color="var(--primary)" /> {enq.guests} Members
                                        </span>
                                        <span className="flex gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <Calendar size={16} /> {new Date(enq.checkInDate).toLocaleDateString()} - {new Date(enq.checkOutDate).toLocaleDateString()}
                                        </span>
                                        <span className="flex gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <Home size={16} /> {enq.property?.title}
                                        </span>
                                    </div>

                                    {enq.message && <p style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.9rem', fontStyle: 'italic', borderLeft: '2px solid var(--primary)' }}>"{enq.message}"</p>}
                                </div>
                            </div>

                            <div className="flex dashboard-card-actions" style={{ gap: '1rem', marginLeft: '2rem' }}>
                                {enq.status === 'pending' ? (
                                    <>
                                        <button onClick={() => handleUpdateEnquiry(enq._id, 'accepted')} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', background: '#10b981', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                                            <Check size={18} /> Accept
                                        </button>
                                        <button onClick={() => handleUpdateEnquiry(enq._id, 'rejected')} className="btn" style={{ padding: '0.6rem 1.2rem', background: '#ef444422', color: '#ef4444', gap: '0.5rem', whiteSpace: 'nowrap', border: '1px solid #ef4444' }}>
                                            <X size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'right', width: '100%' }}>
                                        <div style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            background: enq.status === 'accepted' ? '#10b98122' : '#ef444422',
                                            color: enq.status === 'accepted' ? '#10b981' : '#ef4444',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            fontSize: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            gap: '0.5rem'
                                        }}>
                                            {enq.status === 'accepted' ? <Check size={14} /> : <X size={14} />}
                                            {enq.status}
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Clear this request from your dashboard?')) {
                                                    try {
                                                        await axios.delete(`http://localhost:5000/api/enquiries/${enq._id}`);
                                                        setEnquiries(enquiries.filter(e => e._id !== enq._id));
                                                    } catch (err) {
                                                        alert('Failed to delete');
                                                    }
                                                }
                                            }}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.5rem', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Remove Record
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
