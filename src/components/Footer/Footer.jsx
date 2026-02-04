import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    <div className={styles.brandColumn}>
                        <div className={styles.logo}>
                            Layer1<span>.Studio</span>
                        </div>
                        <p className={styles.description}>
                            Building the foundations of the digital future from our studios in London and Colombo.
                        </p>
                        <div className={styles.linkList}>
                            <a href="mailto:hello@layer1.studio" className={styles.linkItem} style={{ color: '#fff', fontWeight: 600 }}>
                                hello@layer1.studio
                            </a>
                        </div>
                    </div>

                    <div>
                        <h5 className={styles.columnTitle}>Locations</h5>
                        <div className={styles.locationItem}>
                            <p className={styles.locationName}>London, UK</p>
                        </div>
                        <div className={styles.locationItem}>
                            <p className={styles.locationName}>Colombo, Sri Lanka</p>
                        </div>
                    </div>

                    <div>
                        <h5 className={styles.columnTitle}>Connect</h5>
                        <div className={styles.linkList}>
                            <a href="https://www.linkedin.com/company/layer1studio" target="_blank" rel="noopener noreferrer" className={styles.linkItem}>LinkedIn</a>
                            <a href="https://twitter.com/layer1studio" target="_blank" rel="noopener noreferrer" className={styles.linkItem}>Twitter</a>
                            <a href="https://instagram.com/layer1studio" target="_blank" rel="noopener noreferrer" className={styles.linkItem}>Instagram</a>
                            <a href="https://dribbble.com/layer1studio" target="_blank" rel="noopener noreferrer" className={styles.linkItem}>Dribbble</a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>© 2026 Layer1.Studio. All rights reserved.</p>
                    <div className={styles.legalLinks}>
                        <Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link>
                        <Link to="/contact" className={styles.legalLink}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
