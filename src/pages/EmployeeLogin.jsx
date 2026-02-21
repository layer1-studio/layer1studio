import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './EmployeeLogin.module.css';

const EmployeeLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Verify if this user exists in the 'employees' collection
            const q = query(collection(db, 'employees'), where('email', '==', email.toLowerCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Access denied. No employee record found for this email.');
                setLoading(false);
                return;
            }

            // Store the specific employee ID in session
            const empDoc = querySnapshot.docs[0];
            sessionStorage.setItem('employeeProfileId', empDoc.id);
            sessionStorage.setItem('employeeAuthorized', 'true');

            navigate('/portal/employee/dashboard');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Incorrect email or password. Please try again.');
            } else {
                setError('Login failed: ' + (err.message || 'Unknown error'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.icon}>
                        <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className={styles.logo}>Layer1<span>.Studio</span></div>
                    <p className={styles.tagline}>Employee Portal</p>
                </div>

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.field}>
                        <label>Employee Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.name@layer1.studio"
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
                        {loading ? 'Verifying...' : 'Sign In'}
                    </button>

                    <p className={styles.footerNote}>
                        Access your payslips, profile, and documents securely.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default EmployeeLogin;
