import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PortfolioPreview.module.css';

const PortfolioPreview = () => {
    const projects = [
        {
            title: 'OmniChannel CRM',
            text: 'Enterprise-grade customer management system for a Fortune 500 retailer.',
            tags: ['Node.js', 'Postgres'],
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4_cbDAndJwZVOFPkfnWrYBKzbaO4n4rCY-mJ7m0SkSToxDUZ6s-Vu4pSwlEmc7BtkU9Xq_F5lL8ghrqzYiS7FpsLl-4GM_eUfG2obKIkOQcmx2YeS_JnarSUoR7hcXFLysetVpUes4uW1bw1bIxLDOSut7RsOEBpcOl12GKrjo47XAFZ4KprT0CBAvsG-o2i7r-uACqfiN8LbMVX4UIh4IVwP29qFqpfDZ8u6Aqn_vNcE4-60hAZuLLUL6e_v6FO5EgdvWMNl3pcY'
        },
        {
            title: 'Vault FinTech',
            text: 'Next-generation mobile banking experience with real-time asset tracking.',
            tags: ['Flutter', 'Go'],
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6WiSTZ-crmpTbyxwY6Zi-1S04T36K_CZT5x56EPBVcfxeym20RVOopuMFEUrg59fzjkiLMKCznMiFEC1NFwkLl1iw7BDNF--WHn3P06zcSUtK5-jKIpEPCR-7gUgOgmC6ZSeq1PGfDF9su9QX9TN-rnx6myFFPA11HUrL03T1hlcz7c6YYl0rbEaBpXYvnb4gdU-QzY92h98GVdRE9xY3uWZ7Jo62ipsJr6hq-4ODZtD8M4QTC8pnS6M5HMbKR3AOE66KLrDjMNvr'
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
