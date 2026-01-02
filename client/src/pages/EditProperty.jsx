import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, MapPin, Home, Users, DollarSign, ArrowLeft, Plus, X, Dog, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/properties/${id}`);
                setFormData({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    location: data.location,
                    pricePerNight: data.pricePerNight,
                    maxGuests: data.maxGuests,
                    minGuests: data.minGuests || 1,
                    petsAllowed: data.petsAllowed,
                    images: data.images
                });
            } catch (err) {
                alert('Failed to fetch property details');
                navigate('/owner/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id, navigate]);

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
            setSaving(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, images: [...formData.images, reader.result] });
                setSaving(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`http://localhost:5000/api/properties/${id}`, formData);
            alert('Property updated successfully!');
            navigate('/owner/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update property');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ paddingTop: '10rem', textAlign: 'center' }}>Loading property details...</div>;

    return (
        <div style={{ paddingTop: '8rem' }} className="container">
            <button onClick={() => navigate('/owner/dashboard')} className="btn btn-secondary" style={{ marginBottom: '2rem', gap: '0.5rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="add-property-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                <div>
                    <h1 style={{ marginBottom: '1.5rem' }}>Edit <span style={{ color: 'var(--primary)' }}>Property</span></h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Update your listing details to keep them accurate.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PROPERTY TITLE</label>
                                <input
                                    type="text"
                                    className="glass-panel"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
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
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>MIN</label>
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
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>MAX</label>
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
                                    id="edit-pets"
                                    checked={formData.petsAllowed}
                                    onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.checked })}
                                />
                                <label htmlFor="edit-pets" className="flex gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem' }}><Dog size={16} color="var(--primary)" /> Pets allowed</label>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', gap: '0.5rem' }} disabled={saving}>
                                <Save size={18} /> {saving ? 'Saving...' : 'Update Property Details'}
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
                                style={{ height: 120, border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                className="flex flex-col gap-1 hover-primary"
                            >
                                <Plus size={24} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Upload File</span>
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
                    </div>

                    <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '2rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--accent)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Warning</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Updating critical property details may require re-approval from the admin team to ensure platform quality.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProperty;
