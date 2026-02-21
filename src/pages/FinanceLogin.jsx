import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import styles from './FinanceLogin.module.css';

const FinanceLogin = () => {
    const [step, setStep] = useState(1); // 1 = email/password, 2 = passcode
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleStep1 = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Check if user has finance role
            const configDoc = await getDoc(doc(db, 'financeConfig', 'settings'));
            if (!configDoc.exists()) {
                setError('Finance module not configured. Contact admin.');
                setLoading(false);
                return;
            }
            const config = configDoc.data();
            const allowedEmails = config.allowedEmails || [];
            if (!allowedEmails.includes(email.toLowerCase())) {
                setError('Access denied. Not authorized for finance.');
                setLoading(false);
                return;
            }
            setStep(2);
        } catch (err) {
            console.error(err);
            setError('Invalid credentials. Access denied.');
        } finally {
            setLoading(false);
        }
    };

    const handleStep2 = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const configDoc = await getDoc(doc(db, 'financeConfig', 'settings'));
            const config = configDoc.data();
            if (passcode !== config.passcode) {
                setError('Invalid passcode. Try again.');
                setLoading(false);
                return;
            }
            // Store finance session
            sessionStorage.setItem('financeAuthorized', 'true');
            navigate('/vault/internal/gate/secure/finance/payroll');
        } catch (err) {
            console.error(err);
            setError('Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.icon}>
                        <span className="material-symbols-outlined">account_balance</span>
                    </div>
                    <div className={styles.logo}>Layer1<span>.Studio</span></div>
                    <p className={styles.tagline}>Finance Portal</p>
                </div>

                {step === 1 ? (
                    <form className={styles.form} onSubmit={handleStep1}>
                        <div className={styles.field}>
                            <label>Finance Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="finance@layer1.studio"
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <button type="submit" className={styles.loginBtn} disabled={loading}>
                            {loading ? 'Verifying...' : 'Continue'}
                        </button>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={handleStep2}>
                        <p className={styles.stepInfo}>Enter your 6-digit security passcode</p>
                        <div className={styles.passcodeWrapper}>
                            <input
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="• • • • • •"
                                maxLength={6}
                                className={styles.passcodeInput}
                                autoFocus
                                required
                            />
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <button type="submit" className={styles.loginBtn} disabled={loading || passcode.length !== 6}>
                            {loading ? 'Authorizing...' : 'Authorize Access'}
                        </button>
                        <button type="button" className={styles.backBtn} onClick={() => { setStep(1); setPasscode(''); setError(''); }}>
                            ← Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FinanceLogin;
