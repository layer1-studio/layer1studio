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
            title: 'Marketing Agency Website',
            category: 'Web Development',
            text: 'Premium landing page and lead generation system for a cutting-edge creative agency.',
            tags: ['React', 'Framer Motion'],
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY5_DOj58Gd86kyFqTh-UMlYh-Ucb65wd-sD-b96Inv833_ls5oCdaUJMbAxpqb60X8Px2eJXNKFr7i6BsyCXfWb5A3IWK9wWz7wYU0BWFTaP_fjSV9cnfcCM3nlxsqoJtpPGz8JP5UCnjJH5sGy_nYFeiO87DUpizoshaQ7T8TStniKD-jRQvU0XFSB5kyYUfzn_vflPT72nupuVZLVceUlAQtAzcVfTFlYT4DOpY97kbBO4dooSt0ln5qlY8dNQ3Vlvf4b3zdmeI'
        },
        {
            title: 'E-commerce Website',
            category: 'Web Development',
            text: 'Modern shopping experience with integrated payment gateways and real-time inventory.',
            tags: ['Next.js', 'Stripe'],
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgbZxfNBLuDsa2QV28yTaF9_B3Ya2cUh6RbaCJyuolqZhgP2bI28S8SnmxLbea9fJcpdkW57gTSrGcfaziwyLuYUIOeFfY4thy9nV6dOkhWjI9IzXqjtO6lw9Y8HMrvYAc9MoFgOlOwI5v0UKORF6p8m40k7rdG4d_88AsWNWvdZEScmM_1J5QoD7nqOMd4CB4qzgsc4mrtjm-y6N4i6mCEbnmTVpheZ-FDvNGQ67LZX6LypqPAVqjRyVi6b9rVIN8PgAxLD29QHiG'
        },
        {
            title: 'Admin Panel & Dashboard',
            category: 'Dashboards',
            text: 'Powerful internal tool for managing complex business operations and data analytics.',
            tags: ['React', 'Node.js'],
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCflepDypeli6J7rrskPHYWCaPnyVhzc-slMHXqrt2QM5mTB9V21AV9E7KaTTZHPncHYXIhtu5vBIDGuqSXIjEWFmig6hUUGli9TVVwpF8WQpHWBDer-OxWWsAEKdympaombGF_Q3HgencfCxqccCNgDmBEXS7GcpIXLDA4a-dseIJ8rGPgYYevXJQjxs-wADJ3lv8f5i7z0Aj4baEiCqdW7RDUcAV3MMybsKXnhY33ilp4ciLeD6Uequ_8XuNZLxYYiwrWOy3UxzXS'
        }
    ];

    const projects = dbProjects.length > 0 ? dbProjects : defaultProjects;
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
