import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={`${styles.hero} hero-gradient`}>
            <div className="container">
                <div className={styles.heroContent}>
                    <span className={styles.badge}>Fast Velocity. Zero Debt.</span>
                    <h1 className={`${styles.title} text-gradient`}>
                        Ship at scale, <span className="serif-human">without</span> the debt.
                    </h1>
                    <p className={styles.subtitle}>
                        We build production-grade foundations for founders and teams that need to move fast. No compromises on logic, no debt in your code—just engineering that scales with your ambition.
                    </p>
                    <div className={styles.buttonGroup}>
                        <Link to="/contact" className={styles.primaryButton}>
                            Start Building Fast
                            <span className="material-symbols-outlined">chat_bubble</span>
                        </Link>
                        <Link to="/portfolio" className={styles.secondaryButton}>
                            The things we've built
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.glow} />
        </section>
    );
};

export default Hero;
