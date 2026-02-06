import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from './ApplyNow.module.css';

const ApplyNow = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        portfolio: '',
        resumeData: '' // Changed to data instead of URL
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Firestore limit check (1MB)
        if (file.size > 1024 * 1024) {
            setStatus('File too large. Please keep it under 1MB.');
            return;
        }

        setStatus('Processing resume...');

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFormData({ ...formData, resumeData: reader.result });
                setStatus('Resume processed successfully.');
            };
            reader.onerror = (error) => {
                console.error(error);
                setStatus('Processing failed.');
            };
        } catch (error) {
            console.error(error);
            setStatus('Processing failed.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.resumeData) {
            setStatus('Please upload your resume first.');
            return;
        }

        setSubmitting(true);
        setStatus('Submitting application...');

        try {
            await addDoc(collection(db, 'applications'), {
                ...formData,
                jobTitle: decodeURIComponent(jobId),
                date: new Date().toISOString()
            });
            setStatus('Application submitted successfully!');
            setTimeout(() => navigate('/careers'), 2000);
        } catch (error) {
            console.error(error);
            setStatus('Submission failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.applyPage}>
            <div className="container">
                <div className={styles.formCard}>
                    <header className={styles.header}>
                        <span className={styles.badge}>The next chapter</span>
                        <h1 className={`${styles.title} text-gradient`}>Applying for <span className="serif-human" style={{ color: 'var(--primary)' }}>{decodeURIComponent(jobId)}</span></h1>
                    </header>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.field}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Alexander Wright"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="alex@studio.com"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Phone Number (Optional)</label>
                            <input
                                type="tel"
                                placeholder="+44 7770 225546"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Portfolio / LinkedIn</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                required
                                value={formData.portfolio}
                                onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Your Resume (PDF / Word)</label>
                            <div className={styles.fileUpload}>
                                <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx" required />
                                <p>{formData.resumeData ? 'Ready to go' : 'Upload your resume'}</p>
                            </div>
                        </div>

                        {status && <p className={styles.status}>{status}</p>}

                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? 'Sending...' : 'Send it off'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyNow;
