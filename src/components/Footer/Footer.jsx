import React from 'react';
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
                            <a href="#" className={styles.linkItem}>LinkedIn</a>
                            <a href="#" className={styles.linkItem}>Twitter</a>
                            <a href="#" className={styles.linkItem}>Instagram</a>
                            <a href="#" className={styles.linkItem}>Dribbble</a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>© 2026 Layer1.Studio. All rights reserved.</p>
                    <div className={styles.legalLinks}>
                        <a href="#" className={styles.legalLink}>Privacy Policy</a>
                        <a href="#" className={styles.legalLink}>Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
