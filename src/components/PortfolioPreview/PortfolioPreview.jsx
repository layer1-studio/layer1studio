import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';
import styles from './PortfolioPreview.module.css';

const PortfolioPreview = () => {
    const { data: allProjects, loading } = useContent('projects');

    const projects = allProjects.length > 0 ? allProjects.slice(0, 3) : [];

    if (loading && allProjects.length === 0) return null;

    return (
        <section id="projects" className={styles.portfolioPreview}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <div className={styles.headerLeft}>
                        <p className={styles.eyebrow}>Selected work</p>
                        <h2 className={styles.sectionTitle}>Hand-picked work</h2>
                    </div>
                    <Link to="/portfolio" className={styles.viewAllLink}>
                        View all projects
                    </Link>
                </div>

                <div className={styles.grid}>
                    {projects.map((project, index) => (
                        <div key={index} className={styles.projectCard}>
                            <div className={styles.imageWrapper}>
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className={styles.projectImage} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'var(--navy-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>image</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.tags}>
                                    {(Array.isArray(project.tags) ? project.tags : []).map((tag, i) => (
                                        <span key={i} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                                <h4 className={styles.projectTitle}>{project.title}</h4>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', gridColumn: '1/-1' }}>
                            Add your first projects in the Admin Portal to see them here.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PortfolioPreview;
