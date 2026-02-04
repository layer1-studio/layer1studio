import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
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
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/vault/internal/gate/secure/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid credentials. Access denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.logo}>Layer1<span>.Studio</span></div>
                    <p className={styles.tagline}>Internal Access Only</p>
                </div>

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.field}>
                        <label>Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@layer1.studio"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Security Key</label>
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
                        {loading ? 'Verifying...' : 'Authorize Access'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
