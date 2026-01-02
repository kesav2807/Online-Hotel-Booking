import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Briefcase, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'customer',
        phone: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-grid">
            <div className="auth-panel-content" style={{ padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ maxWidth: 450, margin: '0 auto', width: '100%' }}
                >
                    <h1 style={{ marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Join the exclusive community of luxury property stays.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Phone style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div
                                onClick={() => setFormData({ ...formData, role: 'customer' })}
                                style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', border: `2px solid ${formData.role === 'customer' ? 'var(--primary)' : 'var(--glass-border)'}`, cursor: 'pointer', textAlign: 'center', background: formData.role === 'customer' ? 'rgba(79, 70, 229, 0.1)' : 'transparent' }}
                            >
                                <div style={{ fontWeight: 600 }}>Customer</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>I want to stay</div>
                            </div>
                            <div
                                onClick={() => setFormData({ ...formData, role: 'owner' })}
                                style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', border: `2px solid ${formData.role === 'owner' ? 'var(--primary)' : 'var(--glass-border)'}`, cursor: 'pointer', textAlign: 'center', background: formData.role === 'owner' ? 'rgba(79, 70, 229, 0.1)' : 'transparent' }}
                            >
                                <div style={{ fontWeight: 600 }}>Property Owner</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>I want survived</div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                            Create Account <ArrowRight size={20} />
                        </button>
                    </form>

                    <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                    </p>
                </motion.div>
            </div>

            <div className="auth-panel-visual" style={{
                background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-dark) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem',
                borderLeft: '1px solid var(--glass-border)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 120, height: 120, background: 'var(--primary)', borderRadius: '30px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Briefcase size={60} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Host Your Property.</h2>
                    <p style={{ maxWidth: 400, color: 'var(--text-muted)', fontSize: '1.1rem' }}>Join thousands of owners who list their unique villas and rooms on Zenith.</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
