import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Home, CheckCircle, XCircle, BarChart, Shield, CreditCard, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        users: 0,
        properties: 0,
        pending: 0,
        activeSubscriptions: 0,
        totalRevenue: 0
    });
    const [pendingProperties, setPendingProperties] = useState([]);
    const [allProperties, setAllProperties] = useState([]);
    const [subscribedOwners, setSubscribedOwners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [propRes, userRes] = await Promise.all([
                    axios.get('https://hotel-backend-uasi.onrender.com/api/properties/admin/all'),
                    axios.get('https://hotel-backend-uasi.onrender.com/api/users')
                ]);

                const pending = propRes.data.filter(p => p.approvalStatus === 'pending');
                const subscribed = userRes.data.filter(u => u.role === 'owner' && u.isSubscribed);

                setPendingProperties(pending);
                setAllProperties(propRes.data);
                setSubscribedOwners(subscribed);

                setStats({
                    users: userRes.data.length,
                    properties: propRes.data.length,
                    pending: pending.length,
                    activeSubscriptions: subscribed.length,
                    totalRevenue: subscribed.length * 29 // $29 per subscription
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleApprove = async (id, status) => {
        try {
            await axios.put(`https://hotel-backend-uasi.onrender.com/api/properties/${id}/approve`, { status });
            setPendingProperties(pendingProperties.filter(p => p._id !== id));
            setAllProperties(allProperties.map(p => p._id === id ? { ...p, approvalStatus: status } : p));
            setStats(prev => ({ ...prev, pending: prev.pending - 1 }));
        } catch (err) {
            alert('Approval failed');
        }
    };

    const handleDeleteProperty = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this property? This action cannot be undone.')) return;
        try {
            await axios.delete(`https://hotel-backend-uasi.onrender.com/api/properties/${id}`);
            setAllProperties(allProperties.filter(p => p._id !== id));
            setPendingProperties(pendingProperties.filter(p => p._id !== id));
            setStats(prev => ({ ...prev, properties: prev.properties - 1 }));
            alert('Property deleted successfully');
        } catch (err) {
            alert('Delete failed');
        }
    };

    if (loading) return <div style={{ paddingTop: '10rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 className="flex gap-3"><Shield size={40} color="var(--primary)" /> Super Admin</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Platform control center and growth analytics.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
                        <Users size={18} /> Manage Users
                    </button>
                    <button className="btn btn-primary">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px' }}>
                            <BarChart size={20} color="var(--primary)" />
                        </div>
                        <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }} className="flex gap-1"><ArrowUpRight size={14} /> +12%</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.properties}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Listings</div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                            <Home size={20} color="var(--accent)" />
                        </div>
                        <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700 }}>Pending</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.pending}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Approvals Needed</div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                            <CreditCard size={20} color="#10b981" />
                        </div>
                        <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>{stats.activeSubscriptions} Active</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>${stats.totalRevenue}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Monthly Revenue</div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex justify-between" style={{ marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                            <Users size={20} color="#6366f1" />
                        </div>
                        <span style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: 700 }}>Global</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.users}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Registrations</div>
                </div>
            </div>

            {/* Tabbed Navigation */}
            <div className="dashboard-tabs" style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                {['overview', 'properties', 'subscriptions', 'analytics'].map(tab => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '1rem 0',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            color: activeTab === tab ? 'white' : 'var(--text-muted)',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none'
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="admin-overview-grid"
                        style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}
                    >
                        {/* Latest Approvals */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Recent Requests</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {pendingProperties.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>All caught up! No pending requests.</p>
                                ) : pendingProperties.slice(0, 5).map(prop => (
                                    <div key={prop._id} className="flex justify-between items-center" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                        <div className="flex gap-3">
                                            <img src={prop.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80'} style={{ width: 50, height: 50, borderRadius: '8px', objectFit: 'cover' }} alt="" />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{prop.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop.location} • {prop.owner?.username}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleApprove(prop._id, 'approved')} style={{ background: '#10b98122', border: 'none', color: '#10b981', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}><CheckCircle size={18} /></button>
                                            <button onClick={() => handleApprove(prop._id, 'rejected')} style={{ background: '#ef444422', border: 'none', color: '#ef4444', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}><XCircle size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Mini-List */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Platform Activity</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: '0.5rem' }}></div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem' }}>New property listed by <strong>Owner_{i}</strong></div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>2 hours ago</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'properties' && (
                    <motion.div
                        key="properties"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-panel"
                        style={{ padding: '2rem' }}
                    >
                        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                            <h3>Global Property Inventory</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing {allProperties.length} total listings</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {allProperties.map(prop => (
                                <div key={prop._id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={prop.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'}
                                            style={{ width: '100%', height: 160, objectFit: 'cover' }}
                                            alt=""
                                        />
                                        <div style={{
                                            position: 'absolute', top: 10, right: 10,
                                            padding: '0.25rem 0.6rem', borderRadius: '4px',
                                            fontSize: '0.7rem', fontWeight: 800,
                                            background: prop.approvalStatus === 'approved' ? '#10b981' : prop.approvalStatus === 'rejected' ? '#ef4444' : '#f59e0b',
                                            color: 'white'
                                        }}>
                                            {prop.approvalStatus.toUpperCase()}
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.25rem' }}>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prop.title}</h4>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                            Owned by: <span style={{ color: 'white' }}>{prop.owner?.username || 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>${prop.pricePerNight}<small style={{ fontWeight: 400, color: 'var(--text-muted)' }}>/night</small></span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/property/${prop._id}`)}
                                                    className="btn"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProperty(prop._id)}
                                                    className="btn"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'subscriptions' && (
                    <motion.div
                        key="subscriptions"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-panel"
                        style={{ padding: '2rem' }}
                    >
                        <h3 style={{ marginBottom: '2rem' }}>Current Premium Subscriptions</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        <th style={{ padding: '1rem' }}>OWNER</th>
                                        <th style={{ padding: '1rem' }}>PLAN</th>
                                        <th style={{ padding: '1rem' }}>STATUS</th>
                                        <th style={{ padding: '1rem' }}>MONTHLY REVENUE</th>
                                        <th style={{ padding: '1rem' }}>EXPIRY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscribedOwners.map(owner => (
                                        <tr key={owner._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div className="flex gap-2">
                                                    <img
                                                        src={(!owner.avatar || owner.avatar.includes('placeholder')) ? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80' : owner.avatar}
                                                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                                        alt=""
                                                    />
                                                    <span>{owner.username}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}><span style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>PRO OWNER</span></td>
                                            <td style={{ padding: '1rem' }}><span style={{ color: '#10b981' }}>● Active</span></td>
                                            <td style={{ padding: '1rem' }}>$29.00</td>
                                            <td style={{ padding: '1rem' }}>{new Date(new Date().getTime() + 2592000000).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'analytics' && (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-panel"
                        style={{ padding: '3rem' }}
                    >
                        <h3 style={{ marginBottom: '3rem' }}>Growth & Engagement Analytics</h3>

                        <div style={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: '2rem', borderBottom: '2px solid var(--glass-border)', paddingBottom: '1rem' }}>
                            {[40, 65, 30, 85, 55, 90, 75].map((h, i) => (
                                <div key={i} style={{ flex: 1, background: 'linear-gradient(to top, var(--primary), var(--secondary))', height: `${h}%`, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: 800 }}>{(h * 2.5).toFixed(0)}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <span>Monday</span>
                            <span>Tuesday</span>
                            <span>Wednesday</span>
                            <span>Thursday</span>
                            <span>Friday</span>
                            <span>Saturday</span>
                            <span>Sunday</span>
                        </div>

                        <div className="admin-analytics-grid" style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                            <div>
                                <h4 style={{ marginBottom: '1rem' }} className="flex gap-2"><TrendingUp size={18} color="var(--primary)" /> Visitor Insights</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Direct traffic increased by 22% this week after the SEO optimization. Mobile users account for 65% of total browsing volume.</p>
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '1rem' }} className="flex gap-2"><Calendar size={18} color="var(--accent)" /> Booking Seasonality</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enquiry volume is peaking for unique stays in Lapland and Santorini. Recommend increasing owner subscriptions for winter season.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

