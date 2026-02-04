import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './ApplyNow.module.css';

const ApplyNow = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        portfolio: '',
        resumeUrl: ''
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setStatus('Uploading resume...');
        const storageRef = ref(storage, `resumes/${Date.now()}_${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFormData({ ...formData, resumeUrl: url });
            setStatus('Resume uploaded successfully.');
        } catch (error) {
            console.error(error);
            setStatus('Upload failed.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.resumeUrl) {
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
                        <h1 className={styles.title}>Applying for <span>{decodeURIComponent(jobId)}</span></h1>
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
                                <p>{formData.resumeUrl ? 'Ready to go' : 'Upload your resume'}</p>
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
