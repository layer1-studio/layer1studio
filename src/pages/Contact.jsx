import React from 'react';
import styles from './Contact.module.css';

const Contact = () => {
    React.useEffect(() => {
        document.title = "Contact for Software & Web Development Projects | Layer1.Studio";
    }, []);

    return (
        <div className={styles.contactPage}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.infoColumn}>
                        <span className={styles.badge}>Let's Talk</span>
                        <h1 className={`${styles.title} text-gradient`}>Shall we start?</h1>
                        <p className={styles.description}>
                            Drop us a line. We're based in London and Colombo, but we work with partners all over the world. Whether it's a quick question or a massive project, we'd love to hear from you.
                        </p>

                        <div className={styles.visualWrapper}>
                            <img src={`${import.meta.env.BASE_URL}assets/contact_visual.png`} alt="Contact Visual" className={styles.heroVisual} />
                        </div>

                        <div className={styles.studios}>
                            <div className={styles.studioItem}>
                                <h4 className={styles.studioName}>
                                    <span className="material-symbols-outlined">location_on</span>
                                    London, UK
                                </h4>
                            </div>

                            <div className={styles.studioItem}>
                                <h4 className={styles.studioName}>
                                    <span className="material-symbols-outlined">location_on</span>
                                    Colombo, Sri Lanka
                                </h4>
                            </div>
                        </div>

                        <div className={styles.contactLinks}>
                            <div className={styles.contactItem}>
                                <div className={styles.iconBox}>
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <div>
                                    <p className={styles.contactLabel}>Email Inquiry</p>
                                    <a href="mailto:studio.layer1@gmail.com" className={styles.contactValue}>studio.layer1@gmail.com</a>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <div className={styles.iconBox}>
                                    <span className="material-symbols-outlined">call</span>
                                </div>
                                <div>
                                    <p className={styles.contactLabel}>Phone Support</p>
                                    <p className={styles.contactValue}>+44 7770 225546</p>
                                    <p className={styles.contactValue}>+94 7717 70570</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formColumn}>
                        <div className={styles.formCard}>
                            <form className={styles.form}>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label>First Name</label>
                                        <input type="text" placeholder="E.g. Alexander" />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Last Name</label>
                                        <input type="text" placeholder="E.g. Wright" />
                                    </div>
                                </div>

                                <div className={styles.field}>
                                    <label>Email</label>
                                    <input type="email" placeholder="alex@studio.com" />
                                </div>

                                <div className={styles.field}>
                                    <label>How can we help?</label>
                                    <select defaultValue="">
                                        <option disabled value="">How can we help?</option>
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
                                    <textarea rows="5" placeholder="Tell us about what you're building..."></textarea>
                                </div>

                                <button type="submit" className={styles.submitBtn}>
                                    Send message
                                </button>

                                <p className={styles.privacyNote}>
                                    <span className="material-symbols-outlined">verified_user</span>
                                    Your information is safe with us. We're engineers - we take security seriously.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
