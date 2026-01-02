import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        // In a real app, call the backend to send reset email
    };

    return (
        <div className="container" style={{ paddingTop: '10rem', display: 'flex', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ maxWidth: 450, width: '100%', padding: '3rem' }}
            >
                {!sent ? (
                    <>
                        <h2 style={{ marginBottom: '1rem' }}>Reset Password</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Enter your email address and we'll send you a link to reset your password.</p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-muted)' }} size={20} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                                Send Reset Link <Send size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 60, height: 60, background: '#10b98122', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <CheckCircle size={32} color="#10b981" />
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>Email Sent</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.</p>
                        <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ width: '100%' }}>Return to Login</button>
                    </div>
                )}

                <button
                    onClick={() => navigate('/login')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', cursor: 'pointer' }}
                >
                    <ArrowLeft size={16} /> Back to Login
                </button>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
