import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import styles from './Careers.module.css';

const Careers = () => {
    const { data: dbJobs, loading } = useContent('careers');
    const navigate = useNavigate();
    const [expandedJob, setExpandedJob] = useState(null);

    const defaultJobs = [
        { title: 'Senior Full-stack Developer', location: 'Remote', salary: '$140k - $180k', type: 'Full-time', hot: true, description: "We're looking for someone who can handle everything from server architecture to CSS animations. You'll be the backbone of our product team." },
        { title: 'Senior UI/UX Designer', location: 'Hybrid / London', salary: '$110k - $150k', type: 'Full-time', hot: false, description: "Design isn't just about looks. We need a thinker who understands how users move through complex systems and can make that movement feel effortless." }
    ];

    // Show db jobs if they exist, otherwise show defaults (but only after loading is done)
    const jobs = (dbJobs.length > 0) ? dbJobs : (loading ? [] : defaultJobs);

    return (
        <div className={styles.careersPage}>
            <header className={styles.hero}>
                <div className="container">
                    <span className={styles.badge}>Join our mission</span>
                    <h1 className={styles.title}>
                        Help us build the <br /><span>digital foundations.</span>
                    </h1>
                    <p className={styles.subtitle}>
                        We are a collective of product thinkers and engineers crafting software that stands the test of time. Join a studio where quality isn't a goal - it's the baseline.
                    </p>
                </div>
            </header>

            <section className={styles.values}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.valueCard}>
                            <span className="material-symbols-outlined">terminal</span>
                            <h3>Engineering Focus</h3>
                            <p>We prioritize clean architecture and deep technical expertise. No shortcuts, just solid engineering.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className="material-symbols-outlined">auto_awesome</span>
                            <h3>Design-Led Craft</h3>
                            <p>Every pixel matters. We believe that beautiful software is more than skin deep - it's about the experience.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className="material-symbols-outlined">favorite</span>
                            <h3>People First</h3>
                            <p>Flexible work, meaningful ownership, and a supportive environment that values your growth.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.openRoles}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Open Opportunities</h2>
                    <div className={styles.jobList}>
                        {jobs.map((job, index) => (
                            <div
                                key={index}
                                className={`${styles.jobCard} ${expandedJob === index ? styles.expanded : ''}`}
                                onClick={() => setExpandedJob(expandedJob === index ? null : index)}
                            >
                                <div className={styles.jobMain}>
                                    <div className={styles.jobInfo}>
                                        <div className={styles.jobTitleRow}>
                                            <h3>{job.title}</h3>
                                            {job.hot && <span className={styles.hotTag}>Hot</span>}
                                        </div>
                                        <div className={styles.jobMeta}>
                                            <span>{job.location}</span> • <span>{job.type}</span> • <span>{job.salary}</span>
                                        </div>
                                    </div>
                                    <span className={`material-symbols-outlined ${styles.expandIcon}`}>
                                        {expandedJob === index ? 'expand_less' : 'expand_more'}
                                    </span>
                                </div>

                                {expandedJob === index && (
                                    <div className={styles.jobDetails} onClick={(e) => e.stopPropagation()}>
                                        <div className={styles.description}>
                                            <p>{job.description || "Inquire for details."}</p>
                                        </div>
                                        <button
                                            className={styles.applyBtn}
                                            onClick={() => navigate(`/apply/${encodeURIComponent(job.title)}`)}
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
