import React from 'react';
import styles from './TermsOfService.module.css';

const TermsOfService = () => {
    return (
        <div className={styles.termsPage}>
            <div className="container">
                <div className={styles.contentWrapper}>
                    <span className={styles.badge}>Legal Framework</span>
                    <h1 className={styles.title}>Terms of <span>Service</span></h1>
                    <p className={styles.lastUpdated}>Last updated: February 2026</p>

                    <section className={styles.section}>
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the Layer1.Studio website or services, you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services. These terms apply to all visitors,
                            users, and clients of the studio.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Services Provided</h2>
                        <p>
                            Layer1.Studio provides specialized engineering, product design, and digital infrastructure services.
                            The specific scope of work for any client engagement is governed by a separate Service Level Agreement (SLA)
                            or Statement of Work (SOW).
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Intellectual Property</h2>
                        <p>
                            All craftsmanship, including but not limited to code, designs, and architectural patterns developed by
                            Layer1.Studio, remains our intellectual property until full payment is received, upon which ownership
                            transfers as per the individual project contract. Our internal tools and proprietary frameworks always
                            remain the property of Layer1.Studio.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Limitation of Liability</h2>
                        <p>
                            While we strive for technical excellence ("engineering without bugs"), Layer1.Studio shall not be liable
                            for any indirect, incidental, or consequential damages resulting from the use or inability to use
                            the software we build, including data loss or business interruption.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Communication & Contact</h2>
                        <p>
                            For any inquiries regarding these terms, please reach out via our contact page. We prioritize direct,
                            human communication to solve any disputes or clarifications.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Governing Law</h2>
                        <p>
                            These terms are governed by and construed in accordance with the laws of the jurisdictions in which
                            we operate (London, UK and Colombo, Sri Lanka). Any disputes shall be subject to the exclusive
                            jurisdiction of the courts in these locations.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
