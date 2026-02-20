import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.heroContent}>
                    <p className={styles.eyebrow}>High Velocity. Pure Engineering.</p>
                    <h1 className={styles.title}>
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
        </section>
    );
};

export default Hero;
