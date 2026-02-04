import React from 'react';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
    return (
        <div className={styles.privacyPage}>
            <div className="container">
                <div className={styles.contentWrapper}>
                    <span className={styles.badge}>Security & Trust</span>
                    <h1 className={styles.title}>Privacy <span>Policy</span></h1>
                    <p className={styles.lastUpdated}>Last updated: February 2026</p>

                    <section className={styles.section}>
                        <h2>Overview</h2>
                        <p>
                            At Layer1.Studio, we take your privacy as seriously as we take our code. This policy explains what data we collect,
                            why we collect it, and how we protect it. We are committed to transparency and ensuring your digital footprint
                            remains secure within our systems.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Data Collection & Purpose</h2>
                        <p>We collect minimal data necessary to provide our services and manage our studio operations:</p>
                        <ul>
                            <li><strong>Inquiries</strong>: When you contact us for services, we collect your name, email, and project details to facilitate communication.</li>
                            <li><strong>Applications</strong>: When you apply for a role, we collect your contact information, resume, and professional details to evaluate your candidacy.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>Third-Party Sharing</h2>
                        <p>
                            We believe your data belongs to you. <strong>We do not share, sell, or trade your personal information with 3rd parties</strong>
                            for marketing or any other commercial purposes. Your data is used exclusively for the purpose it was provided.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Client Confidentiality</h2>
                        <p>
                            As a studio that builds core digital foundations, confidentiality is paramount. While we showcase selected work in
                            our portfolio, not all details of our client engagements are disclosed. We respect and enforce strict NDAs and
                            ensure that sensitive business logic or proprietary data is never made public.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Candidate Data Retention</h2>
                        <p>
                            To maintain a clean and respectful recruitment process, we enforce a strict data retention policy for job applications.
                            <strong>All candidate data is permanently deleted from our systems 6 months after the closing of the respective application process</strong>,
                            unless a candidate specifically requests earlier removal or is hired.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Security</h2>
                        <p>
                            We implement industry-standard security measures, including encryption and secure authentication, to protect all stored data.
                            Our infrastructure is designed to survive the test of time, and that includes our security protocols.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
