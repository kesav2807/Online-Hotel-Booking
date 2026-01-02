import { motion } from 'framer-motion';
import { Camera, Video, Shield, Headphones, Star, Check } from 'lucide-react';

const About = () => {
    const services = [
        { title: 'Property Photography', desc: 'Professional high-res photography to make your property stand out.', icon: <Camera size={32} /> },
        { title: 'Videography Services', desc: 'Cinematic tours and drone footage of your unique stays.', icon: <Video size={32} /> },
        { title: '24/7 Priority Support', desc: 'Dedicated line for property owners and premium guests.', icon: <Headphones size={32} /> },
        { title: 'Security Verification', desc: 'Rigorous vetting of every property listed on Zenith.', icon: <Shield size={32} /> }
    ];

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            {/* Hero Section */}
            <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="about-hero-title"
                    style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
                >
                    Redefining the <span style={{ color: 'var(--primary)' }}>Travel Experience.</span>
                </motion.h1>
                <p style={{ maxWidth: 700, margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Zenith is a premium property platform focused on connecting travelers with the worlds most unique villas, homestays, and boutique experiences.
                </p>
            </section>

            {/* Stats */}
            <div className="about-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '8rem' }}>
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>10k+</div>
                    <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>CURATED STAYS</div>
                </div>
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>50k+</div>
                    <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>HAPPY GUESTS</div>
                </div>
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>4.9/5</div>
                    <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>USER RATING</div>
                </div>
            </div>

            {/* Services */}
            <section style={{ marginBottom: '8rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem' }}>Our Premium Services</h2>
                    <p style={{ color: 'var(--text-muted)' }}>We provide end-to-end support for property owners.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {services.map((s, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem' }}
                        >
                            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{s.icon}</div>
                            <h3 style={{ marginBottom: '1rem' }}>{s.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="glass-panel about-cta" style={{ padding: '5rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)', border: 'none' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'white' }}>Ready to Host?</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem' }}>
                    Join our exclusive community of property owners and start reaching premium travelers today.
                </p>
                <button className="btn btn-primary" style={{ background: 'white', color: 'var(--primary)', fontSize: '1.1rem', padding: '1rem 3rem' }}>
                    Get Started Now
                </button>
            </section>
        </div>
    );
};

export default About;
