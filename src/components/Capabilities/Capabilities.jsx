import React from 'react';
import styles from './Capabilities.module.css';

const Capabilities = () => {
    const services = [
        {
            icon: 'rocket_launch',
            title: 'High-Velocity Launchpads',
            text: 'Custom web and mobile applications built for immediate market impact and long-term scale. We ship foundations in 30 days.',
            list: ['MVP to Market in 30 Days', 'High-Performance Web Apps', 'Bespoke Mobile Solutions']
        },
        {
            icon: 'insights',
            title: 'Data Engines',
            text: 'Transforming raw complexity into actionable strategy with custom dashboards and real-time analytics tools.',
            list: ['Real-time BI Dashboards', 'Predictive Data Engines', 'Custom Monitoring Tools']
        },
        {
            icon: 'layers',
            title: 'Bulletproof Foundations',
            text: 'The infrastructure that powers your ambition. Secure, distributed, and built to survive the internet\'s worst days.',
            list: ['Infinite Cloud Scaling', 'Secure API Ecosystems', 'Zero-Downtime Architecture']
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
