import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={`${styles.hero} hero-gradient`}>
            <div className="container">
                <div className={styles.heroContent}>
                    <span className={styles.badge}>High Velocity. Pure Engineering.</span>
                    <h1 className={`${styles.title} text-gradient`}>
                        Foundations for the future.
                    </h1>
                    <p className={styles.subtitle}>
                        We build production-grade foundations for founders and scale-ups. Custom software, web, and mobile app development (React, Node.js, Next.js) by a remote engineering team based in London and Colombo.
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
