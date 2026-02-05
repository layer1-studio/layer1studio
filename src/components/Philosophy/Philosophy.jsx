import React from 'react';
import styles from './Philosophy.module.css';

const Philosophy = () => {
    return (
        <section id="philosophy" className={styles.philosophy}>
            <div className="container">
                <div className={styles.grid}>
                    <div>
                        <h2 className={styles.title}>Our Core Belief</h2>
                        <p className={styles.description}>
                            Layer 1 is the floor where everything starts. In code, it's the logic that survives the hype cycles. We're not here for the quick ship; we're here for the systems that still make sense ten years from now.
                        </p>

                        <div className={styles.featureList}>
                            <div className={styles.feature}>
                                <div className={styles.iconWrapper}>
                                    <span className="material-symbols-outlined">architecture</span>
                                </div>
                                <div>
                                    <h4 className={styles.featureTitle}>Build it right, once.</h4>
                                    <p className={styles.featureText}>We hate technical debt as much as you do. Our patterns are clean, intentional, and predictably solid.</p>
                                </div>
                            </div>

                            <div className={styles.feature}>
                                <div className={styles.iconWrapper}>
                                    <span className="material-symbols-outlined">bolt</span>
                                </div>
                                <div>
                                    <h4 className={styles.featureTitle}>Speed with context.</h4>
                                    <p className={styles.featureText}>Shipping fast is easy. Shipping right while moving fast takes discipline. We have the scars to prove we have both.</p>
                                </div>
                            </div>

                            <div className={styles.feature}>
                                <div className={styles.iconWrapper}>
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                <div>
                                    <h4 className={styles.featureTitle}>Growing pains, solved.</h4>
                                    <p className={styles.featureText}>Whether it's your first ten fans or a million global users, your infrastructure shouldn't be the thing that keeps you up at night.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.visualWrapper}>
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
