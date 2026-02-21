import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import styles from './Portfolio.module.css';

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    React.useEffect(() => {
        document.title = "Software & App Development Portfolio | Layer1.Studio";
    }, []);

    const categories = ['All', 'Web Development', 'Mobile Apps', 'Analytics Tools', 'Dashboards', 'Branding'];

    const { data: dbProjects, loading } = useContent('projects');

    const defaultProjects = [
        {
            title: 'Ananta Collective',
            category: 'Web Development',
            text: 'Premium website and lead generation system for a London-based creative marketing agency.',
            tags: ['React', 'Framer Motion', 'Node.js'],
            image: `${import.meta.env.BASE_URL}assets/ananta_project.png`,
        },
        {
            title: 'Ambrosia — Cinnamon E-commerce',
            category: 'Web Development',
            text: 'End-to-end e-commerce store for a premium Ceylon cinnamon brand, with Stripe payments and real-time inventory.',
            tags: ['Next.js', 'Stripe', 'Tailwind'],
            image: `${import.meta.env.BASE_URL}assets/ambrosia_shop.png`,
        },
        {
            title: 'Ambrosia — Admin Panel',
            category: 'Dashboards',
            text: 'Internal operations dashboard for managing Ambrosia orders, products, customers, and revenue analytics.',
            tags: ['React', 'Node.js', 'Firebase'],
            image: `${import.meta.env.BASE_URL}assets/ambrosia_admin.png`,
        },
    ];

    // Fallback images for DB projects that don't have images set
    const fallbackImages = {
        ananta: `${import.meta.env.BASE_URL}assets/ananta_project.png`,
        ambrosia: `${import.meta.env.BASE_URL}assets/ambrosia_shop.png`,
        admin: `${import.meta.env.BASE_URL}assets/ambrosia_admin.png`,
    };

    const getFallbackImage = (title) => {
        const t = (title || '').toLowerCase();
        if (t.includes('admin')) return fallbackImages.admin;
        if (t.includes('ambrosia')) return fallbackImages.ambrosia;
        if (t.includes('ananta')) return fallbackImages.ananta;
        return null;
    };

    const rawProjects = dbProjects.length > 0 ? dbProjects : defaultProjects;
    const projects = rawProjects.map(p => ({
        ...p,
        image: p.image || getFallbackImage(p.title),
    }));
    const filteredProjects = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

    return (
        <div className={styles.portfolioPage}>
            <header className={styles.heroBanner}>
                <div className="container">
                    <p className={styles.eyebrow}>The Gallery</p>
                    <h1 className={styles.pageTitle}>
                        Digital foundations,<br />built to last.
                    </h1>
                    <p className={styles.pageSubtitle}>
                        We don't believe in vanity metrics. We believe in tools that work, systems that scale, and code that remains elegant under pressure.
                    </p>
                </div>
            </header>

            <div className={styles.filterBar}>
                <div className="container">
                    <div className={styles.filters}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
                                onClick={() => setActiveFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <section className={styles.projectsSection}>
                <div className="container">
                    <div className={styles.projectsGrid}>
                        {filteredProjects.map((project, index) => (
                            <div key={index} className={styles.projectCard}>
                                <div className={styles.imageWrapper}>
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className={styles.projectImage}
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x600?text=Project'; }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '240px', background: 'var(--navy-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)', fontSize: '2rem' }}>image</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.projectTags}>
                                        {project.tags && project.tags.map(tag => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <p className={styles.projectDescription}>{project.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Portfolio;
