import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import styles from './Careers.module.css';

const Careers = () => {
    const { data: dbJobs, loading } = useContent('careers');
    const navigate = useNavigate();
    const [expandedJob, setExpandedJob] = useState(null);

    React.useEffect(() => {
        document.title = "Careers & Internships | Layer1.Studio";
    }, []);

    const defaultJobs = [
        {
            title: 'Senior Full-stack Developer',
            location: 'Remote',
            salary: '$140k – $180k',
            type: 'Full-time',
            hot: true,
            overview: "We're looking for an experienced full-stack engineer who can take ownership end-to-end — from system architecture to polished UI. You'll work closely with our core team on production client projects.",
            responsibilities: [
                'Architect and build scalable web and mobile applications (React, Node.js, Next.js)',
                'Lead code reviews and define engineering standards',
                'Collaborate directly with clients and the design team',
                'Ship production-ready features with clean, maintainable code',
            ],
            requirements: [
                '5+ years of full-stack development experience',
                'Strong proficiency in React, TypeScript, and Node.js',
                'Experience with databases (SQL and NoSQL)',
                'Excellent communication and ownership mindset',
            ],
        },
        {
            title: 'Senior UI/UX Designer',
            location: 'Hybrid / London',
            salary: '$110k – $150k',
            type: 'Full-time',
            hot: false,
            overview: "Design isn't just about looks here. We need a strategic thinker who can map complex user journeys, design elegant interfaces, and partner closely with our engineering team to ship them.",
            responsibilities: [
                'Own the end-to-end design process — discovery, wireframes, prototypes, final assets',
                'Build and maintain design systems in Figma',
                'Conduct user research and translate findings into actionable design decisions',
                'Partner with engineers to ensure high-fidelity implementation',
            ],
            requirements: [
                '4+ years of product design experience',
                'Expert-level Figma and design systems knowledge',
                'Strong portfolio demonstrating complex web and mobile interfaces',
                'Ability to communicate design rationale clearly to technical and non-technical stakeholders',
            ],
        },
    ];

    const jobs = (dbJobs.length > 0) ? dbJobs : (loading ? [] : defaultJobs);

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
                        A London & Colombo based studio where quality isn't a goal — it's the baseline.
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
                        {jobs.map((job, index) => (
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
                                            <span className={styles.dot}>·</span>
                                            <span>{job.salary}</span>
                                        </div>
                                    </div>
                                    <span className={`material-symbols-outlined ${styles.expandIcon} ${expandedJob === index ? styles.rotated : ''}`}>
                                        chevron_right
                                    </span>
                                </div>

                                {expandedJob === index && (
                                    <div className={styles.jobDetails}>
                                        {/* Overview */}
                                        <p className={styles.jobOverview}>
                                            {job.overview || job.description || 'Inquire for details.'}
                                        </p>

                                        {/* Responsibilities */}
                                        {job.responsibilities?.length > 0 && (
                                            <div className={styles.jobSection}>
                                                <h4 className={styles.jobSectionTitle}>What you'll do</h4>
                                                <ul className={styles.jobList2}>
                                                    {job.responsibilities.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Requirements */}
                                        {job.requirements?.length > 0 && (
                                            <div className={styles.jobSection}>
                                                <h4 className={styles.jobSectionTitle}>What we're looking for</h4>
                                                <ul className={styles.jobList2}>
                                                    {job.requirements.map((item, i) => (
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
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
