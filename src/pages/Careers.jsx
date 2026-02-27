import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import styles from './Careers.module.css';

/* Helper: split a newline-delimited string into array of bullet items */
const toList = (str) =>
    str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];

const Careers = () => {
    const { data: dbJobs, loading } = useContent('careers');
    const navigate = useNavigate();
    const [expandedJob, setExpandedJob] = useState(null);

    React.useEffect(() => {
        document.title = "Careers & Internships | Layer1.Studio";
    }, []);

    const jobs = dbJobs;


    const toggleJob = (index) => {
        setExpandedJob(expandedJob === index ? null : index);
    };

    return (
        <div className={styles.careersPage}>
            {/* Full-bleed banner */}
            <header className={styles.heroBanner}>
                <div className={styles.bannerOverlay} />
                <img
                    src={`${import.meta.env.BASE_URL}assets/careers_visual.png`}
                    alt=""
                    className={styles.bannerImage}
                />
                <div className={styles.bannerContent}>
                    <p className={styles.eyebrow}>Join our mission</p>
                    <h1 className={styles.title}>
                        Software Engineering<br />Careers at Layer1.Studio
                    </h1>
                    <p className={styles.subtitle}>
                        A London &amp; Colombo based studio where quality isn't a goal — it's the baseline.
                    </p>
                </div>
            </header>

            {/* Values strip */}
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
                            <p>Every pixel matters. We believe that beautiful software is more than skin deep — it's about the experience.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className="material-symbols-outlined">favorite</span>
                            <h3>People First</h3>
                            <p>Flexible work, meaningful ownership, and a supportive environment that values your growth.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open roles */}
            <section className={styles.openRoles}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Open Opportunities</h2>
                    <div className={styles.jobList}>
                        {jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <div key={index} className={styles.jobCard}>
                                    <div
                                        className={styles.jobMain}
                                        onClick={() => toggleJob(index)}
                                        role="button"
                                        aria-expanded={expandedJob === index}
                                    >
                                        <div className={styles.jobInfo}>
                                            <div className={styles.jobTitleRow}>
                                                <h3>{job.title}</h3>
                                                {job.hot && <span className={styles.hotTag}>Hiring</span>}
                                            </div>
                                            <div className={styles.jobMeta}>
                                                <span>{job.location}</span>
                                                <span className={styles.dot}>·</span>
                                                <span>{job.type}</span>
                                                {job.salary && (
                                                    <>
                                                        <span className={styles.dot}>·</span>
                                                        <span>{job.salary}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`material-symbols-outlined ${styles.expandIcon} ${expandedJob === index ? styles.rotated : ''}`}>
                                            chevron_right
                                        </span>
                                    </div>

                                    {expandedJob === index && (
                                        <div className={styles.jobDetails}>
                                            {/* About Us */}
                                            {job.aboutUs && (
                                                <div className={styles.jobSection}>
                                                    <h4 className={styles.jobSectionTitle}>About Us</h4>
                                                    <p className={styles.jobOverview}>{job.aboutUs}</p>
                                                </div>
                                            )}

                                            {/* Role Overview */}
                                            {(job.about || job.description) && (
                                                <div className={styles.jobSection}>
                                                    <h4 className={styles.jobSectionTitle}>Role Overview</h4>
                                                    <p className={styles.jobOverview}>{job.about || job.description}</p>
                                                </div>
                                            )}

                                            {/* Responsibilities */}
                                            {job.responsibilities && toList(job.responsibilities).length > 0 && (
                                                <div className={styles.jobSection}>
                                                    <h4 className={styles.jobSectionTitle}>Key Responsibilities</h4>
                                                    <ul className={styles.jobBullets}>
                                                        {toList(job.responsibilities).map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Requirements */}
                                            {job.requirements && toList(job.requirements).length > 0 && (
                                                <div className={styles.jobSection}>
                                                    <h4 className={styles.jobSectionTitle}>Requirements</h4>
                                                    <ul className={styles.jobBullets}>
                                                        {toList(job.requirements).map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* What you'll gain */}
                                            {job.whatYoullGain && toList(job.whatYoullGain).length > 0 && (
                                                <div className={styles.jobSection}>
                                                    <h4 className={styles.jobSectionTitle}>What You'll Gain</h4>
                                                    <ul className={styles.jobBullets}>
                                                        {toList(job.whatYoullGain).map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <button
                                                className={styles.applyBtn}
                                                onClick={() => navigate(`/apply/${encodeURIComponent(job.title)}`)}
                                            >
                                                Apply for this role
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : !loading && (
                            <div className={styles.emptyState}>
                                <p>No open roles at the moment. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
