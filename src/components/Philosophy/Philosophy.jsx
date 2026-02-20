import React from 'react';
import styles from './Philosophy.module.css';

const Philosophy = () => {
    return (
        <section id="philosophy" className={styles.philosophy}>
            <div className="container">
                <div className={styles.grid}>
                    <div>
                        <p className={styles.eyebrow}>Our philosophy</p>
                        <h2 className={styles.title}>Engineered for Growth</h2>
                        <p className={styles.description}>
                            Everyone promises speed. We promise speed without the crash. We build the technical foundations that allow you to pivot, scale, and thrive - without any friction slowing you down.
                        </p>

                        <div className={styles.featureList}>
                            <div className={styles.feature}>
                                <span className={`material-symbols-outlined ${styles.featureIcon}`}>architecture</span>
                                <div>
                                    <h4 className={styles.featureTitle}>Precision Engineering</h4>
                                    <p className={styles.featureText}>We build right the first time. Our patterns are clean, intentional, and designed for unhindered velocity.</p>
                                </div>
                            </div>

                            <div className={styles.feature}>
                                <span className={`material-symbols-outlined ${styles.featureIcon}`}>bolt</span>
                                <div>
                                    <h4 className={styles.featureTitle}>High-Velocity Logic</h4>
                                    <p className={styles.featureText}>Shipping fast is easy. Shipping correctly while moving fast takes discipline. We provide both.</p>
                                </div>
                            </div>

                            <div className={styles.feature}>
                                <span className={`material-symbols-outlined ${styles.featureIcon}`}>trending_up</span>
                                <div>
                                    <h4 className={styles.featureTitle}>Bulletproof Scaling</h4>
                                    <p className={styles.featureText}>Whether it's your first ten fans or a million global users, your infrastructure stays invisible and reliable.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.visualWrapper}>
                        <img
                            src={`${import.meta.env.BASE_URL}assets/philosophy_visual.png`}
                            alt="Philosophy Visualization"
                            className={styles.vizLogo}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
