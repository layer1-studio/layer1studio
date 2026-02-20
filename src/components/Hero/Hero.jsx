import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero}>
            {/* Left — copy */}
            <div className={styles.heroContent}>
                <p className={styles.eyebrow}>High Velocity. Pure Engineering.</p>
                <h1 className={styles.title}>
                    Foundations for<br />
                    the <span className={styles.titleAccent}>future.</span>
                </h1>
                <p className={styles.subtitle}>
                    Production-grade software for founders and scale-ups. React, Node.js, and Next.js engineering teams based in London and Colombo.
                </p>
                <div className={styles.buttonGroup}>
                    <Link to="/contact" className={styles.primaryButton}>
                        Start a project
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
                    </Link>
                    <Link to="/portfolio" className={styles.secondaryButton}>
                        See our work
                    </Link>
                </div>
            </div>

            {/* Right — visual */}
            <div className={styles.heroRight}>
                <img
                    src={`${import.meta.env.BASE_URL}assets/philosophy_visual.png`}
                    alt="Engineering visualization"
                    className={styles.heroImage}
                />
                <div className={styles.heroImageOverlay} />
            </div>
        </section>
    );
};

export default Hero;
