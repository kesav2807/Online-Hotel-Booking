import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check, Shield, Zap, CreditCard, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            await axios.post('https://hotel-backend-uasi.onrender.com/api/users/subscribe');
            alert('Subscription Activated Successfully!');
            navigate('/owner/dashboard');
        } catch (err) {
            alert('Subscription failed');
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            name: 'Monthly Pro',
            price: '$29',
            features: [
                'List up to 10 properties',
                'Direct customer contact',
                'Real-time notifications',
                'Featured in search results',
                'Premium support'
            ],
            current: !user?.isSubscribed
        }
    ];

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Owner <span style={{ color: 'var(--primary)' }}>Subscription</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Only subscribed owners can list properties reachable by customers.</p>
            </div>

            <div style={{ maxWidth: 500, margin: '0 auto' }}>
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel"
                        style={{ padding: '3rem', border: '2px solid var(--primary)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem' }}>{plan.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 800 }}>{plan.price}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>/ month</span>
                                </div>
                            </div>
                            <Zap size={40} color="var(--primary)" fill="var(--primary)" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                            {plan.features.map((f, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#10b98122', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check size={14} color="#10b981" />
                                    </div>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem' }}>CHOOSE PAYMENT METHOD</label>
                            <div className="subscription-payment-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid var(--primary)', cursor: 'pointer' }}>
                                    <Smartphone size={20} style={{ marginBottom: 5 }} />
                                    <div style={{ fontSize: '0.7rem' }}>UPI</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center', cursor: 'pointer' }}>
                                    <CreditCard size={20} style={{ marginBottom: 5 }} />
                                    <div style={{ fontSize: '0.7rem' }}>Card</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center', cursor: 'pointer' }}>
                                    <Shield size={20} style={{ marginBottom: 5 }} />
                                    <div style={{ fontSize: '0.7rem' }}>Secure</div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.25rem' }}
                            onClick={handleSubscribe}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Subscribe & Activate Now'}
                        </button>
                        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-renews monthly. Cancel anytime.</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Subscription;

