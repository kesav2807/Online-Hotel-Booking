import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, Send, User, Bot, X, Check, ArrowRight } from 'lucide-react';

const Support = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! How can I assist you with Zenith Stays today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            let botResponse = "I'm sorry, I didn't quite catch that. Would you like to connect with a human agent?";
            if (input.toLowerCase().includes('property')) botResponse = "You can add a property from your Owner Dashboard once you have an active subscription.";
            if (input.toLowerCase().includes('subscription')) botResponse = "Owner subscriptions are $29/month and include professional photography support.";

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem', alignItems: 'start' }}>
                <div>
                    <h1 style={{ marginBottom: '1.5rem' }}>Zenith <span style={{ color: 'var(--primary)' }}>Support Hub</span></h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>Get instant help from our AI assistant or reach out to our global support team via WhatsApp or Email.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '4rem' }}>
                        <div className="glass-panel" style={{ padding: '2.5rem' }}>
                            <div style={{ width: 50, height: 50, background: '#25D366', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Phone size={24} color="white" />
                            </div>
                            <h3 style={{ marginBottom: '0.75rem' }}>WhatsApp Support</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Direct 1-on-1 chat with our support representatives for immediate resolution.</p>
                            <button className="btn btn-secondary" style={{ width: '100%', borderColor: '#25D366', color: '#25D366' }}>Chat on WhatsApp</button>
                        </div>

                        <div className="glass-panel" style={{ padding: '2.5rem' }}>
                            <div style={{ width: 50, height: 50, background: 'var(--primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Mail size={24} color="white" />
                            </div>
                            <h3 style={{ marginBottom: '0.75rem' }}>Email Tickets</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>For complex business or property hosting inquiries, open a support ticket.</p>
                            <button className="btn btn-secondary" style={{ width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}>Open Ticket</button>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Frequently Asked Questions</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                'How do I list my villa?',
                                'What are the photography service charges?',
                                'How do I track my earnings?',
                                'Are my payments secure?'
                            ].map((q, i) => (
                                <div key={i} className="flex justify-between items-center" style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                                    <span>{q}</span>
                                    <ArrowRight size={18} color="var(--primary)" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="glass-panel flex flex-col" style={{ height: 600, padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }} className="flex gap-3 items-center">
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={24} color="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700 }}>Zenith AI Assistant</div>
                            <div style={{ fontSize: '0.7rem', color: '#10b981' }} className="flex gap-1 items-center"><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></div> Online</div>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                fontSize: '0.9rem',
                                lineHeight: 1.4
                            }}>
                                {m.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                AI is typing...
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)' }} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Type your question..."
                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.75rem', color: 'white', outline: 'none' }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}><Send size={20} /></button>
                    </form>
                </aside>
            </div>
        </div>
    );
};

export default Support;
