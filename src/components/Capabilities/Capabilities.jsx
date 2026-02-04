import React from 'react';
import styles from './Capabilities.module.css';

const Capabilities = () => {
    const services = [
        {
            icon: 'language',
            title: 'Web Systems',
            text: 'We build the kind of websites that feel like software. Fast, responsive, and impossible to ignore.',
            list: ['Custom SaaS Dashboards', 'E-commerce Engines', 'Interactive Experiences']
        },
        {
            icon: 'stay_primary_portrait',
            title: 'Mobile & Beyond',
            text: 'iOS, Android, or anything with a screen. We focus on the thumb-feel and the split-second interactions.',
            list: ['Consumer Apps', 'Enterprise Solutions', 'Offline-First Design']
        },
        {
            icon: 'layers',
            title: 'Backend & Infrastructure',
            text: 'The invisible part that matters the most. Secure, distributed, and ready for whatever the internet throws at it.',
            list: ['API Architecture', 'Database Optimization', 'DevSecOps & Security']
        }
    ];

    return (
        <section id="services" className={styles.capabilities}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>What we do best</h2>
                    <p className={styles.subtitle}>Specialized engineering for the things that usually fail.</p>
                </div>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                <span className="material-symbols-outlined">{service.icon}</span>
                            </div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardText}>{service.text}</p>
                            <ul className={styles.list}>
                                {service.list.map((item, i) => (
                                    <li key={i} className={styles.listItem}>
                                        <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Capabilities;
