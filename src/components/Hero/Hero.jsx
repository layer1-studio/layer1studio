import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={`${styles.hero} hero-gradient`}>
            <div className="container">
                <div className={styles.heroContent}>
                    <span className={styles.badge}>Engineering with Heart & Logic</span>
                    <h1 className={`${styles.title} text-gradient`}>
                        Building code that holds its own.
                    </h1>
                    <p className={styles.subtitle}>
                        We're a collective of product thinkers and engineers who care more about how things work than how they're marketed. Minimalist apps, complex systems, one standard: excellence.
                    </p>
                    <div className={styles.buttonGroup}>
                        <Link to="/contact" className={styles.primaryButton}>
                            Tell us a story
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
