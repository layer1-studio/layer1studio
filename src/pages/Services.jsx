import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';

const Services = () => {
    const processSteps = [
        { number: '01', title: 'Sense-making', text: 'We start by asking a lot of questions. We strip away the noise to find the core of what you\'re building.' },
        { number: '02', title: 'The Forge', text: 'Where logic meets craft. We write code that is clean enough to read and fast enough to fly.' },
        { number: '03', title: 'Momentum', text: 'Setting it live is just the beginning. We make sure the first 24 hours (and the next 2400) are seamless.' },
        { number: '04', title: 'The Horizon', text: 'We stay in your corner. As you grow, we\'re there to make sure the foundation holds firm.' }
    ];

    return (
        <div className={styles.servicesPage}>
            <section className={styles.heroSection}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <span className={styles.badge}>Our craft</span>
                        <h1 className={`${styles.title} text-gradient`}>
                            Foundations for the future.
                        </h1>
                        <p className={styles.subtitle}>
                            We don't do 'average'. We build complex, hard-working software for people who have big ideas and little time for bugs.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.methodology}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>How we work</h2>
                        <p className={styles.sectionSubtitle}>No magic, just a very disciplined process that gets things done.</p>
                    </div>

                    <div className={styles.processGrid}>
                        {processSteps.map((step, index) => (
                            <div key={index} className={styles.processStep}>
                                <div className={styles.stepHeader}>
                                    <div className={styles.numberCircle}>{step.number}</div>
                                    {index < processSteps.length - 1 && <div className={styles.dashedLine} />}
                                </div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepText}>{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className="container">
                    <div className={styles.ctaBox}>
                        <h2 className={styles.ctaTitle}>Let's build something real.</h2>
                        <p className={styles.ctaSubtitle}>
                            If you're tired of generic solutions, we should talk. We build the things that most people find too difficult.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link to="/contact" className={styles.primaryCta}>Say Hello</Link>
                            <Link to="/portfolio" className={styles.secondaryCta}>See our work</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
