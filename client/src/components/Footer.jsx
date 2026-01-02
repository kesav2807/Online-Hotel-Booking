import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--glass-border)',
            padding: '4rem 1rem 2rem 1rem',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    {/* Brand Section */}
                    <div>
                        <div
                            onClick={() => navigate('/')}
                            style={{ cursor: 'pointer', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '-1px', marginBottom: '1rem', display: 'inline-block' }}
                        >
                            ZENITH<span style={{ color: 'var(--text-main)' }}>STAYS</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Experience the extraordinary. We curate the world's most unique and luxurious properties for travelers who seek more than just a place to sleep.
                        </p>
                        <div className="flex" style={{ gap: '1rem' }}>
                            <SocialIcon icon={<Facebook size={18} />} />
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Instagram size={18} />} />
                            <SocialIcon icon={<Linkedin size={18} />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <FooterLink label="Home" to="/" navigate={navigate} />
                            <FooterLink label="Browse Properties" to="/browse" navigate={navigate} />
                            <FooterLink label="About Us" to="/about" navigate={navigate} />
                            <FooterLink label="Support Control" to="/support" navigate={navigate} />
                            <FooterLink label="List Your Property" to="/owner/dashboard" navigate={navigate} />
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Contact Us</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li className="flex" style={{ gap: '0.75rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <MapPin size={18} color="var(--primary)" />
                                <span>123 Innovation Blvd, Tech City, TC 90210</span>
                            </li>
                            <li className="flex" style={{ gap: '0.75rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Phone size={18} color="var(--primary)" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex" style={{ gap: '0.75rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Mail size={18} color="var(--primary)" />
                                <span>hello@zenithstays.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        &copy; {new Date().getFullYear()} Zenith Stays Inc. All rights reserved.
                    </p>
                    <div className="flex" style={{ gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <span>Made with</span>
                        <Heart size={14} fill="#ef4444" color="#ef4444" />
                        <span>for travelers worldwide.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid var(--glass-border)'
    }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
    >
        {icon}
    </div>
);

const FooterLink = ({ label, to, navigate }) => (
    <li
        onClick={() => navigate(to)}
        style={{
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
        onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
    >
        {label}
    </li>
);

export default Footer;
