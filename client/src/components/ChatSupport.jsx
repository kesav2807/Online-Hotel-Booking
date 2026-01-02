import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, PhoneCall, HelpCircle } from 'lucide-react';

const ChatSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm Zen, your AI Assistant for ZenithStays. How can I help you today?", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            text: userInput,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            let botResponse = "I'm analyzing your request... ";
            const input = newUserMessage.text.toLowerCase();

            if (input.includes('help') || input.includes('support')) {
                botResponse = "I'm here to help! Whether it's about property listings, child support helplines, or general platform usage, I can guide you. You can also call our emergency line at 1-800-ZENITH.";
            } else if (input.includes('price') || input.includes('cost')) {
                botResponse = "Prices vary across our premium stays. You can filter properties by budget in the 'Browse' section. Pro owner subscriptions are $29/month.";
            } else if (input.includes('child') || input.includes('safety')) {
                botResponse = "Safety is our priority. If you need immediate child support or protection services, please contact our dedicated safety team at safety@zenithstays.com or call our 24/7 hotline.";
            } else {
                botResponse = "That sounds interesting! I'll notify our support team to look into your query about: \"" + newUserMessage.text + "\". Is there anything else I can assist with?";
            }

            const newBotMessage = {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, newBotMessage]);
            setIsTyping(false);

            // Optional: visual notification instead of audio if audio was ever here
        }, 1500);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.div
                className="chat-toggle-btn"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    boxShadow: '0 10px 30px rgba(79, 70, 229, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2000,
                    border: 'none'
                }}
            >
                {isOpen ? <X color="white" size={30} /> : <MessageCircle color="white" size={30} />}

                {/* Notification Badge */}
                {!isOpen && (
                    <span style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '18px',
                        height: '18px',
                        background: '#ef4444',
                        borderRadius: '50%',
                        border: '3px solid #0f172a',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800
                    }}>1</span>
                )}
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="glass-panel chat-window"
                        style={{
                            position: 'fixed',
                            bottom: '6rem',
                            right: '2rem',
                            width: '380px',
                            height: '550px',
                            zIndex: 2001,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            borderRadius: '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            border: '1px solid var(--glass-border)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div className="flex gap-3">
                                <div style={{
                                    width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>Zen AI Support</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }} className="flex gap-1">
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                                        Online | Emergency Help Available
                                    </div>
                                </div>
                            </div>
                            <HelpCircle size={20} style={{ opacity: 0.7, cursor: 'pointer' }} />
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            style={{
                                flex: 1,
                                padding: '1.5rem',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                background: 'rgba(15, 23, 42, 0.4)'
                            }}
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }}
                                >
                                    <div style={{
                                        padding: '0.8rem 1.1rem',
                                        borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                                        background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.4',
                                        border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        {msg.text}
                                    </div>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                        {msg.time}
                                    </span>
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '0.8rem 1.1rem', borderRadius: '18px 18px 18px 2px', display: 'flex', gap: '4px' }}>
                                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }}></motion.span>
                                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }}></motion.span>
                                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }}></motion.span>
                                </div>
                            )}
                        </div>

                        {/* Emergency Contact Bar */}
                        <div style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderTop: '1px solid rgba(239, 68, 68, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer'
                        }}>
                            <PhoneCall size={16} color="#ef4444" />
                            <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>CHILD SUPPORT HELPLINE: 1-800-SAFE-PATH</span>
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={handleSend}
                            style={{
                                padding: '1.25rem',
                                background: 'rgba(15, 23, 42, 0.8)',
                                borderTop: '1px solid var(--glass-border)',
                                display: 'flex',
                                gap: '0.75rem'
                            }}
                        >
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type your message..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    padding: '0.75rem 1rem',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatSupport;
