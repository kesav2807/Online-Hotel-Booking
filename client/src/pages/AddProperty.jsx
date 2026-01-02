import { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, MapPin, Home, Users, DollarSign, ArrowLeft, Plus, X, Dog, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [imageInput, setImageInput] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Room',
        location: '',
        pricePerNight: '',
        maxGuests: '',
        minGuests: 1,
        petsAllowed: false,
        images: []
    });

    const addImageUrl = () => {
        if (imageInput.trim()) {
            setFormData({ ...formData, images: [...formData.images, imageInput] });
            setImageInput('');
        }
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            // Simulate upload delay
            setTimeout(() => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData({ ...formData, images: [...formData.images, reader.result] });
                    setLoading(false);
                };
                reader.readAsDataURL(file);
            }, 1000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.images.length === 0) {
            return alert('Please add at least one property image');
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/properties', formData);
            alert('Property listed and pending admin approval!');
            navigate('/owner/dashboard');
        } catch (err) {
            console.error('Property creation error:', err);
            const errorMsg = err.response?.data?.message ||
                (err.message === 'Network Error' ? 'Server connection failed. Check if backend is running and CORS is allowed.' : 'Failed to add property');
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            <button onClick={() => navigate('/owner/dashboard')} className="btn btn-secondary" style={{ marginBottom: '2rem', gap: '0.5rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="add-property-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                <div>
                    <h1 style={{ marginBottom: '1.5rem' }}>List New <span style={{ color: 'var(--primary)' }}>Property</span></h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Provide details about your unique stay to attract travelers.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PROPERTY TITLE</label>
                                <input
                                    type="text"
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                    placeholder="e.g. Modern Glass Villa on the Coast"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>DESCRIPTION</label>
                                <textarea
                                    rows="4"
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', resize: 'none' }}
                                    placeholder="Tell guests what makes your place special..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CATEGORY</label>
                                    <select
                                        className="glass-panel"
                                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Room" style={{ background: '#1e293b' }}>Room</option>
                                        <option value="Entire Villa" style={{ background: '#1e293b' }}>Entire Villa</option>
                                        <option value="Unique Stay" style={{ background: '#1e293b' }}>Unique Stay</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>LOCATION</label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={16} style={{ position: 'absolute', top: '0.85rem', left: '0.75rem', color: 'var(--text-muted)' }} />
                                        <input
                                            type="text"
                                            className="glass-panel"
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                            placeholder="City, Country"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PRICE PER NIGHT ($)</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign size={16} style={{ position: 'absolute', top: '0.85rem', left: '0.75rem', color: 'var(--text-muted)' }} />
                                        <input
                                            type="number"
                                            className="glass-panel"
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                            value={formData.pricePerNight}
                                            onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>MIN GUESTS</label>
                                        <input
                                            type="number"
                                            className="glass-panel"
                                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                            value={formData.minGuests}
                                            onChange={(e) => setFormData({ ...formData, minGuests: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>MAX GUESTS</label>
                                        <input
                                            type="number"
                                            className="glass-panel"
                                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                            value={formData.maxGuests}
                                            onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    id="add-pets"
                                    checked={formData.petsAllowed}
                                    onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.checked })}
                                />
                                <label htmlFor="add-pets" className="flex gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem' }}><Dog size={16} color="var(--primary)" /> Are pets allowed in this property?</label>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                                {loading ? 'Processing...' : 'Launch Property Listing'}
                            </button>
                        </div>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }} className="flex gap-2"><Camera size={20} color="var(--primary)" /> Property Visuals</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>ADD IMAGE URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="glass-panel"
                                    style={{ flex: 1, padding: '0.6rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                                    placeholder="https://..."
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                />
                                <button className="btn btn-secondary" onClick={addImageUrl} type="button">Add</button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                            />
                            <div
                                onClick={() => fileInputRef.current.click()}
                                style={{ height: 120, border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
                                className="flex flex-col gap-1 hover-primary"
                            >
                                <Plus size={24} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{loading ? 'Uploading...' : 'Upload File'}</span>
                            </div>

                            {formData.images.map((img, index) => (
                                <div key={index} style={{ height: 120, borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    <button
                                        onClick={() => removeImage(index)}
                                        style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', padding: '0.25rem', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: 'white', border: 'none', cursor: 'pointer' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showcase the best angles of your property. Max 10 images.</p>
                    </div>

                    <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Platform Guide</h3>
                        <ul style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem' }}>
                            <li>Properties must be approved by admin before going live.</li>
                            <li>Images should be high resolution for better conversion.</li>
                            <li>Direct enquiries will be sent to your dashboard and phone.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProperty;
