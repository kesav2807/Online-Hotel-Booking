import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, User, LogOut, Home, Search, Heart, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{
            position: 'fixed', top: '1rem', left: '1rem', right: '1rem',
            zIndex: 1000, borderRadius: 'var(--radius-full)', padding: '0.5rem 2rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '-1px' }}
                >
                    ZENITH<span style={{ color: 'var(--text-main)' }}>STAYS</span>
                </div>

                {/* Desktop Menu */}
                <div className="flex nav-desktop" style={{ gap: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', fontWeight: 500 }}>Home</span>
                        <span onClick={() => navigate('/browse')} style={{ cursor: 'pointer', fontWeight: 500 }}>Browse</span>
                        <span onClick={() => navigate('/about')} style={{ cursor: 'pointer', fontWeight: 500 }}>Services</span>
                        {user?.role === 'owner' && <span onClick={() => navigate('/owner/dashboard')} style={{ cursor: 'pointer', fontWeight: 500 }}>Dashboard</span>}
                        {user?.role === 'admin' && <span onClick={() => navigate('/admin')} style={{ cursor: 'pointer', fontWeight: 500 }}>Admin Panel</span>}
                    </div>

                    {user ? (
                        <div style={{ position: 'relative' }}>
                            <div
                                className="flex"
                                style={{ gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <img
                                    src={(!user.avatar || user.avatar.includes('placeholder')) ? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80' : user.avatar}
                                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                    alt="Avatar"
                                />
                                <span style={{ fontWeight: 600 }}>{user.username}</span>
                            </div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="glass-panel"
                                        style={{ position: 'absolute', top: '120%', right: 0, width: 200, padding: '1rem', border: '1px solid var(--glass-border)' }}
                                    >
                                        <div onClick={() => navigate('/profile')} style={{ padding: '0.5rem 0', cursor: 'pointer' }} className="flex gap-2"><User size={18} /> Profile</div>
                                        <div onClick={handleLogout} style={{ padding: '0.5rem 0', cursor: 'pointer', color: '#ff4444' }} className="flex gap-2"><LogOut size={18} /> Logout</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex" style={{ gap: '1rem' }}>
                            <button className="btn" onClick={() => navigate('/login')} style={{ fontWeight: 600 }}>Login</button>
                            <button className="btn btn-primary" onClick={() => navigate('/register')}>Join Now</button>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <Menu size={24} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="nav-mobile-menu glass-panel"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            borderTop: '1px solid var(--glass-border)'
                        }}
                    >
                        <span onClick={() => { navigate('/'); setIsOpen(false); }} style={{ cursor: 'pointer', fontWeight: 500, padding: '0.5rem 0' }}>Home</span>
                        <span onClick={() => { navigate('/browse'); setIsOpen(false); }} style={{ cursor: 'pointer', fontWeight: 500, padding: '0.5rem 0' }}>Browse</span>
                        <span onClick={() => { navigate('/about'); setIsOpen(false); }} style={{ cursor: 'pointer', fontWeight: 500, padding: '0.5rem 0' }}>Services</span>
                        {user?.role === 'owner' && <span onClick={() => { navigate('/owner/dashboard'); setIsOpen(false); }} style={{ cursor: 'pointer', fontWeight: 500, padding: '0.5rem 0' }}>Dashboard</span>}
                        {user?.role === 'admin' && <span onClick={() => { navigate('/admin'); setIsOpen(false); }} style={{ cursor: 'pointer', fontWeight: 500, padding: '0.5rem 0' }}>Admin Panel</span>}

                        {user ? (
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                <div className="flex gap-2" style={{ alignItems: 'center', marginBottom: '1rem' }}>
                                    <img src={(!user.avatar || user.avatar.includes('placeholder')) ? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80' : user.avatar} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} alt="me" />
                                    <span>{user.username}</span>
                                </div>
                                <div onClick={() => { navigate('/profile'); setIsOpen(false); }} style={{ padding: '0.5rem 0', cursor: 'pointer' }} className="flex gap-2"><User size={18} /> Profile</div>
                                <div onClick={() => { handleLogout(); setIsOpen(false); }} style={{ padding: '0.5rem 0', cursor: 'pointer', color: '#ff4444' }} className="flex gap-2"><LogOut size={18} /> Logout</div>
                            </div>
                        ) : (
                            <div className="flex" style={{ gap: '1rem', marginTop: '0.5rem' }}>
                                <button className="btn" onClick={() => { navigate('/login'); setIsOpen(false); }} style={{ flex: 1 }}>Login</button>
                                <button className="btn btn-primary" onClick={() => { navigate('/register'); setIsOpen(false); }} style={{ flex: 1 }}>Join</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
