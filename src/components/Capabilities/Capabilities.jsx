import React from 'react';
import styles from './Capabilities.module.css';

const Capabilities = () => {
    const services = [
        {
            icon: 'language',
            title: 'Web & Mobile Systems',
            text: 'We build digital products that feel like software. Fast, responsive, and designed for high-performance interactions.',
            list: ['Custom SaaS Platforms', 'E-commerce Engines', 'Consumer & Enterprise Apps']
        },
        {
            icon: 'monitoring',
            title: 'Analytics & Dashboards',
            text: 'Data is only useful if it\'s readable. We build custom dashboards and internal tools that turn noise into strategy.',
            list: ['Custom Analytics Tools', 'Real-time Dashboards', 'Data Visualization Systems']
        },
        {
            icon: 'layers',
            title: 'Backend & Infrastructure',
            text: 'The invisible part that matters the most. Secure, distributed, and built to survive the internet\'s worst days.',
            list: ['API Architecture', 'Database Optimization', 'DevSecOps & Cloud Infra']
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
