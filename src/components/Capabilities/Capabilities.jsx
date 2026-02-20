import React from 'react';
import styles from './Capabilities.module.css';

const Capabilities = () => {
    const services = [
        {
            icon: 'rocket_launch',
            title: 'Web & App Development',
            text: 'Custom web and mobile applications built for immediate market impact and long-term scale. We ship foundations in 30 days.',
            list: ['MVP to Market in 30 Days', 'High-Performance Web Apps', 'Bespoke iOS & Android Solutions']
        },
        {
            icon: 'insights',
            title: 'Data & Analytics Software',
            text: 'Transforming raw complexity into actionable strategy with custom dashboards and real-time analytics tools.',
            list: ['Real-time BI Dashboards', 'Predictive Data Engines', 'Custom Monitoring Tools']
        },
        {
            icon: 'layers',
            title: 'Software Architecture',
            text: 'The infrastructure that powers your ambition. Secure, distributed, and built to handle your highest-velocity days.',
            list: ['Infinite Cloud Scaling', 'Secure API Ecosystems', 'Zero-Downtime Architecture']
        }
    ];

    return (
        <section id="services" className={styles.capabilities}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <p className={styles.eyebrow}>What we do</p>
                    <h2 className={styles.sectionTitle}>Engineered for growth</h2>
                    <p className={styles.sectionSubtitle}>Specialized engineering for the things that usually fail.</p>
                </div>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.card}>
                            <span className={`material-symbols-outlined ${styles.cardIcon}`}>{service.icon}</span>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardText}>{service.text}</p>
                            <ul className={styles.features}>
                                {service.list.map((item, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <span className="material-symbols-outlined">check</span>
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
