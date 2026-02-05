import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';
import styles from './PortfolioPreview.module.css';

const PortfolioPreview = () => {
    const { data: allProjects, loading } = useContent('projects');

    // Show latest 2 projects
    const projects = allProjects.length > 0 ? allProjects.slice(0, 2) : [];

    if (loading && allProjects.length === 0) return null;

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
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className={styles.projectImage} />
                                ) : (
                                    <div className={styles.placeholderIcon}>
                                        <span className="material-symbols-outlined">image</span>
                                    </div>
                                )}
                                <div className={styles.overlay} />
                            </div>
                            <div className={styles.cardContent}>
                                <h4 className={styles.projectTitle}>{project.title}</h4>
                                <p className={styles.projectText}>{project.text}</p>
                                <div className={styles.tagGroup}>
                                    {(Array.isArray(project.tags) ? project.tags : []).map((tag, i) => (
                                        <span key={i} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <p className={styles.emptyMsg}>Add your first projects in the Admin Portal to see them here.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PortfolioPreview;
