import React, { useState, useEffect } from 'react';
import styles from './Contact.module.css';
import emailjs from '@emailjs/browser';

const Contact = () => {
    useEffect(() => {
        document.title = "Contact for Software & Web Development Projects | Layer1.Studio";
    }, []);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        user_email: '',
        topic: '',
        message: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: 'info', message: 'Sending your inquiry...' });

        try {
            // 2. Send Emails via EmailJS
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const customerTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (serviceId && publicKey) {
                // Email to Customer (Auto-reply)
                if (customerTemplateId) {
                    await emailjs.send(
                        serviceId,
                        customerTemplateId,
                        {
                            from_name: `${formData.firstName} ${formData.lastName}`,
                            to_name: `${formData.firstName}`,
                            message: formData.message,
                            reply_to: "studio.layer1@gmail.com",
                            topic: formData.topic,
                            user_email: formData.user_email
                        },
                        publicKey
                    );
                }

                // Email to Studio (Admin Notification)
                if (adminTemplateId) {
                    await emailjs.send(
                        serviceId,
                        adminTemplateId,
                        {
                            customer_name: `${formData.firstName} ${formData.lastName}`,
                            customer_email: formData.user_email,
                            topic: formData.topic,
                            message: formData.message,
                            to_email: "studio.layer1@gmail.com"
                        },
                        publicKey
                    );
                }
            }

            setStatus({
                type: 'success',
                message: 'Thank you! Your message has been sent. We will get back to you shortly.'
            });
            setFormData({
                firstName: '',
                lastName: '',
                user_email: '',
                topic: '',
                message: ''
            });

        } catch (error) {
            console.error("Submission error:", error);
            setStatus({
                type: 'error',
                message: 'Something went wrong. Please try again or email us directly.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.contactPage}>
            {/* Page Banner */}
            <div className={styles.pageBanner}>
                <div className="container">
                    <p className={styles.eyebrow}>Let's Talk</p>
                    <h1 className={styles.title}>Shall we start?</h1>
                    <p className={styles.subtitle}>
                        Based in London and Colombo — but we work with partners all over the world.
                    </p>
                </div>
            </div>

            {/* Contact Body */}
            <div className={styles.contactBody}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.infoColumn}>
                            <div className={styles.studios}>
                                <h4 className={styles.studioName}>
                                    <span className="material-symbols-outlined">location_on</span>
                                    London, UK
                                </h4>
                                <h4 className={styles.studioName}>
                                    <span className="material-symbols-outlined">location_on</span>
                                    Colombo, Sri Lanka
                                </h4>
                            </div>

                            <div className={styles.contactLinks}>
                                <div className={styles.contactItem}>
                                    <div>
                                        <p className={styles.contactLabel}>Email</p>
                                        <a href="mailto:studio.layer1@gmail.com" className={styles.contactValue}>studio.layer1@gmail.com</a>
                                    </div>
                                </div>

                                <div className={styles.contactItem}>
                                    <div>
                                        <p className={styles.contactLabel}>Phone</p>
                                        <p className={styles.contactValue}>+44 7770 225546</p>
                                        <p className={styles.contactValue}>+94 7717 70570</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formColumn}>
                            <div className={styles.formCard}>
                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="E.g. Alexander"
                                                required
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="E.g. Wright"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.field}>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="user_email"
                                            value={formData.user_email}
                                            onChange={handleChange}
                                            placeholder="alex@studio.com"
                                            required
                                        />
                                    </div>

                                    <div className={styles.field}>
                                        <label>How can we help?</label>
                                        <select
                                            name="topic"
                                            value={formData.topic}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option disabled value="">Select a topic</option>
                                            <option>General Inquiry</option>
                                            <option>Pricing & Project Estimates</option>
                                            <option>High-Velocity Web & Mobile Development</option>
                                            <option>Analytics Engines & Dashboards</option>
                                            <option>AI & Automation Integration</option>
                                            <option>Product Strategy & Technical Audit</option>
                                        </select>
                                    </div>

                                    <div className={styles.field}>
                                        <label>What's on your mind?</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5"
                                            placeholder="Tell us about what you're building..."
                                            required
                                        />
                                    </div>

                                    {status.message && (
                                        <p className={`${styles.status} ${styles[status.type]}`}>
                                            {status.message}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send message'}
                                    </button>

                                    <p className={styles.privacyNote}>
                                        <span className="material-symbols-outlined">verified_user</span>
                                        Your information is safe with us.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

