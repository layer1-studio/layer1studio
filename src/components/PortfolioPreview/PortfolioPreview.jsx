import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PortfolioPreview.module.css';

const PortfolioPreview = () => {
    const projects = [
        {
            title: 'OmniChannel CRM',
            text: 'Enterprise-grade customer management system for a Fortune 500 retailer.',
            tags: ['Node.js', 'Postgres'],
            image: '/layer1studio/assets/crm_project_viz.png'
        },
        {
            title: 'Vault FinTech',
            text: 'Next-generation mobile banking experience with real-time asset tracking.',
            tags: ['Flutter', 'Go'],
            image: '/layer1studio/assets/fintech_project_viz.png'
        }
    ];

    return (
        <section id="projects" className={styles.portfolioPreview}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.titleWrapper}>
                        <h2 className={styles.title}>Hand-picked work</h2>
                        <p className={styles.subtitle}>A few things we're proud of. We don't just build apps; we build tools people actually use.</p>
                    </div>
                    <Link to="/portfolio" className={styles.exploreButton}>
                        See how we did it
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {projects.map((project, index) => (
                        <div key={index} className={styles.projectCard}>
                            <div className={styles.imageWrapper}>
                                <img src={project.image} alt={project.title} className={styles.projectImage} />
                                <div className={styles.overlay} />
                            </div>
                            <div className={styles.cardContent}>
                                <h4 className={styles.projectTitle}>{project.title}</h4>
                                <p className={styles.projectText}>{project.text}</p>
                                <div className={styles.tagGroup}>
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PortfolioPreview;
