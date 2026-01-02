import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Shield, UserX, UserCheck, Search, Mail, Phone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('https://hotel-backend-uasi.onrender.com/api/users');
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            await axios.put(`https://hotel-backend-uasi.onrender.com/api/users/${id}/status`, { status: newStatus });
            setUsers(users.map(u => u._id === id ? { ...u, accountStatus: newStatus } : u));
        } catch (err) {
            alert('Failed to update user status');
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            <div className="user-management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Platform <span style={{ color: 'var(--primary)' }}>Users</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Monitor and manage all customer and owner accounts.</p>
                </div>
                <div className="glass-panel flex search-bar-mobile" style={{ padding: '0.5rem 1rem', gap: '1rem', width: 350 }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-panel user-table-container" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '1.25rem' }}>User Info</th>
                            <th style={{ padding: '1.25rem' }}>Role</th>
                            <th style={{ padding: '1.25rem' }}>Subscription</th>
                            <th style={{ padding: '1.25rem' }}>Status</th>
                            <th style={{ padding: '1.25rem' }}>Joined</th>
                            <th style={{ padding: '1.25rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '4rem', textAlign: 'center' }}>Fetching user records...</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div className="flex gap-3">
                                        <img
                                            src={(!user.avatar || user.avatar.includes('placeholder')) ? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80' : user.avatar}
                                            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                                            alt=""
                                        />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{user.username}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.1)', color: 'white', textTransform: 'capitalize' }}>{user.role}</span>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    {user.role === 'owner' ? (
                                        user.isSubscribed ? <span style={{ color: '#10b981', fontSize: '0.85rem' }} className="flex gap-1"><Shield size={14} /> Active</span> : <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>None</span>
                                    ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: ' var(--radius-full)',
                                        background: user.accountStatus === 'active' ? '#10b98122' : '#ef444422',
                                        color: user.accountStatus === 'active' ? '#10b981' : '#ef4444',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        {user.accountStatus}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleToggleStatus(user._id, user.accountStatus)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: user.accountStatus === 'active' ? '#ef4444' : '#10b981',
                                                cursor: 'pointer',
                                                padding: '0.5rem'
                                            }}
                                            title={user.accountStatus === 'active' ? 'Suspend User' : 'Activate User'}
                                        >
                                            {user.accountStatus === 'active' ? <UserX size={20} /> : <UserCheck size={20} />}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;

