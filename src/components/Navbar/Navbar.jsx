import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isAdminPath = location.pathname.startsWith('/vault/internal/gate/secure');

    if (isAdminPath) return null;

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`${styles.navbarContent} container`}>
                <Link to="/" className={styles.logo}>
                    Layer1<span>.Studio</span>
                </Link>

                <div className={styles.navLinks}>
                    <Link to="/services" className={`${styles.navItem} ${location.pathname === '/services' ? styles.activeNavItem : ''}`}>Services</Link>
                    <Link to="/portfolio" className={`${styles.navItem} ${location.pathname === '/portfolio' ? styles.activeNavItem : ''}`}>Portfolio</Link>
                    <Link to="/careers" className={`${styles.navItem} ${location.pathname === '/careers' ? styles.activeNavItem : ''}`}>Careers</Link>
                    <Link to="/contact" className={`${styles.navItem} ${location.pathname === '/contact' ? styles.activeNavItem : ''}`}>Contact</Link>

                    <Link to="/contact" className={styles.ctaButton}>
                        Book a Call
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </Link>
                </div>

                <button className={styles.menuButton}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
