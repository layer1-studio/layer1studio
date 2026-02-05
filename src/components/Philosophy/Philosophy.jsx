import React from 'react';
import styles from './Philosophy.module.css';

const Philosophy = () => {
    return (
        <section id="philosophy" className={styles.philosophy}>
            <div className="container">
                <div className={styles.grid}>
                    <div>
                        <h2 className={styles.title}>Engineered for Growth</h2>
                        <p className={styles.description}>
                            Everyone promises speed. We promise speed without the crash. We build the technical foundations that allow you to pivot, scale, and thrive - without any friction slowing you down.
                        </p>

                        <div className={styles.featureList}>
                            <div className={styles.feature}>
                                <div className={styles.iconWrapper}>
                                    <span className="material-symbols-outlined">architecture</span>
                                </div>
                                <div>
                                    <h4 className={styles.featureTitle}>Precision Engineering</h4>
                                    <p className={styles.featureText}>We build right the first time. Our patterns are clean, intentional, and designed for unhindered velocity.</p>
                                </div>
                            </div>

                            <div className={styles.feature}>
                                <div className={styles.iconWrapper}>
                                    <span className="material-symbols-outlined">bolt</span>
                                </div>
                                <div>
                                    <h4 className={styles.featureTitle}>High-Velocity Logic</h4>
                                    <p className={styles.featureText}>Shipping fast is easy. Shipping correctly while moving fast takes discipline. We provide both.</p>
                                </div>
                            </div>

                            <div className={styles.feature}>
                                <div className={styles.iconWrapper}>
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                <div>
                                    <h4 className={styles.featureTitle}>Bulletproof Scaling</h4>
                                    <p className={styles.featureText}>Whether it's your first ten fans or a million global users, your infrastructure stays invisible and reliable.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.visualWrapper}>
                        <div className={styles.floatingBlurs}>
                            <div className={styles.blur1} />
                            <div className={styles.blur2} />
                        </div>
                        <div className={styles.glassVisualization}>
                            <img
                                src="/layer1studio/assets/philosophy_visual.png"
                                alt="Philosophy Visualization"
                                className={styles.vizLogo}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
