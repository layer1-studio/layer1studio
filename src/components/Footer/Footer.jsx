import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/vault/internal/gate/secure');

    if (isAdminPath) return null;

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    <div className={styles.brand}>
                        <span className={styles.logo}>
                            Layer1<span>.Studio</span>
                        </span>
                        <p className={styles.tagline}>
                            Building the foundations of the digital future from our studios in London and Colombo.
                        </p>
                    </div>

                    <div>
                        <h5 className={styles.columnTitle}>Navigate</h5>
                        <div className={styles.footerLinks}>
                            <Link to="/services">Services</Link>
                            <Link to="/portfolio">Portfolio</Link>
                            <Link to="/careers">Careers</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <h5 className={styles.columnTitle}>Connect</h5>
                        <div className={styles.footerLinks}>
                            <a href="https://www.linkedin.com/company/layer1studio" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            <a href="https://twitter.com/layer1studio" target="_blank" rel="noopener noreferrer">Twitter</a>
                            <a href="https://instagram.com/layer1studio" target="_blank" rel="noopener noreferrer">Instagram</a>
                            <a href="https://dribbble.com/layer1studio" target="_blank" rel="noopener noreferrer">Dribbble</a>
                        </div>
                    </div>

                    <div>
                        <h5 className={styles.columnTitle}>Locations</h5>
                        <div className={styles.footerLinks}>
                            <span>London, UK</span>
                            <span>Colombo, Sri Lanka</span>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© 2026 Layer1.Studio. All rights reserved.</p>
                    <div className={styles.legalLinks}>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
