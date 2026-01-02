import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(identifier, password);
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'owner') navigate('/owner/dashboard');
            else navigate('/');
        } catch (err) {
            console.error('Login Error:', err);
            const msg = err.response?.data?.message || 'Invalid username or password. Please try again.';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-grid">
            <div className="auth-panel-content" style={{ padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ maxWidth: 400, margin: '0 auto', width: '100%' }}
                >
                    <h1 style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Experience the peak of luxury travel properties.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="text"
                                placeholder="Username or Email ID"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Forgot Password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }} disabled={loading}>
                            {loading ? 'Authenticating...' : 'Login to Account'} <ArrowRight size={20} />
                        </button>
                    </form>

                    <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Register Now</Link>
                    </p>
                </motion.div>
            </div>

            <div className="auth-panel-visual" style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem',
                position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>Find Your Next <br /><span style={{ color: 'var(--accent)' }}>Unique Escape.</span></h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Access exclusive villas, rooms, and hidden gems worldwide.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
