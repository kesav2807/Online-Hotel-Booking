import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, Shield, Save } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        avatar: ''
    });
    const [updating, setUpdating] = useState(false);
    const [avatarChanged, setAvatarChanged] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                phone: user.phone || '',
                avatar: user.avatar
            });
            setAvatarChanged(false);
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
                setAvatarChanged(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const updatePayload = {
                username: formData.username,
                phone: formData.phone
            };

            if (avatarChanged) {
                updatePayload.avatar = formData.avatar;
            }

            const { data } = await axios.put('https://hotel-backend-uasi.onrender.com/api/users/profile', updatePayload);

            // Sync with global auth state
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            if (data.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            }

            setAvatarChanged(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Update Error Object:', err);
            const serverMsg = err.response?.data?.details || err.response?.data?.message || err.message;
            alert(`Error: ${serverMsg}`);
        } finally {
            setUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h1 style={{ marginBottom: '2.5rem' }}>Account Settings</h1>

                <div className="auth-grid profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', minHeight: 'auto' }}>
                    <div>
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ position: 'relative', width: 150, height: 150, margin: '0 auto 1.5rem' }}>
                                <img
                                    src={(!formData.avatar || formData.avatar.includes('placeholder')) ? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80' : formData.avatar}
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)' }}
                                    alt="Avatar"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    style={{ position: 'absolute', bottom: 5, right: 5, background: 'var(--primary)', borderRadius: '50%', width: 40, height: 40, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                                >
                                    <Camera size={20} />
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <h3>{user.username}</h3>
                            <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>{user.role}</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}><User size={14} style={{ marginRight: 5 }} /> USERNAME</label>
                                <input
                                    type="text"
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}><Mail size={14} style={{ marginRight: 5 }} /> EMAIL</label>
                                <input
                                    type="email"
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid var(--glass-border)', cursor: 'not-allowed' }}
                                    value={formData.email}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}><Phone size={14} style={{ marginRight: 5 }} /> PHONE NUMBER</label>
                            <input
                                type="text"
                                className="glass-panel"
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '0.9rem' }} className="flex gap-3">
                            <Shield size={20} />
                            <div>
                                <strong>Security Protection</strong>
                                <p style={{ opacity: 0.8 }}>Your account is protected with role-based JWT authentication.</p>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', gap: '0.5rem' }} disabled={updating}>
                            <Save size={18} /> {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;

