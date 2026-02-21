import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { generatePayslipPDF } from '../utils/makePayslip';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
    const [employee, setEmployee] = useState(null);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const empProfileId = sessionStorage.getItem('employeeProfileId');

    useEffect(() => {
        if (!empProfileId) {
            navigate('/portal/employee/login');
            return;
        }

        const fetchDate = async () => {
            try {
                // 1. Fetch Profile
                const empDoc = await getDoc(doc(db, 'employees', empProfileId));
                if (empDoc.exists()) {
                    setEmployee({ id: empDoc.id, ...empDoc.data() });
                }

                // 2. Fetch Payslips
                const payslipsQuery = query(
                    collection(db, 'employees', empProfileId, 'payslips'),
                    orderBy('year', 'desc'),
                    orderBy('month', 'desc')
                );
                const querySnapshot = await getDocs(payslipsQuery);
                const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPayslips(docs);
            } catch (err) {
                console.error('Error fetching employee data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDate();
    }, [empProfileId, navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        sessionStorage.clear();
        navigate('/portal/employee/login');
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            currencyDisplay: 'symbol'
        }).format(val || 0).replace('LKR', 'Rs.');
    };

    const getMonthName = (month) => {
        return new Date(2026, month).toLocaleString('default', { month: 'long' });
    };

    const handleDownloadPayslip = async (slip) => {
        if (!employee) return;
        try {
            // Reconstruct the employee object needed by generatePayslipPDF
            // Note: slip contains netPay, totalEarnings, totalDeductions, etc.
            const empForPDF = {
                ...employee,
                netPay: slip.netPay,
                totalEarnings: slip.totalEarnings,
                totalDeductions: slip.totalDeductions
            };
            const payDayStr = 'Selected Period'; // Or derive specific pay day if tracked
            await generatePayslipPDF(empForPDF, slip.periodKey, payDayStr);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            alert('Failed to generate payslip PDF. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner}></div>
                <p>Securing your portal...</p>
            </div>
        );
    }

    if (!employee) {
        return <div className={styles.errorState}>Profile not found. Please contact HR.</div>;
    }

    return (
        <div className={styles.dashboard}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.profileSummary}>
                        <div className={styles.avatar}>{employee.name?.charAt(0)}</div>
                        <div>
                            <h1>Welcome, {employee.name.split(' ')[0]}</h1>
                            <p className={styles.role}>{employee.designation}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </header>

                <div className={styles.layout}>
                    {/* Sidebar / Profile Info */}
                    <aside className={styles.sidebar}>
                        <div className={styles.card}>
                            <h3>Personal Profile</h3>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <label>Employee ID</label>
                                    <p>{employee.employeeId}</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Email Address</label>
                                    <p>{employee.email}</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Contact Number</label>
                                    <p>{employee.contactNumber || 'N/A'}</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Base Salary</label>
                                    <p>{formatCurrency(employee.baseSalary)}</p>
                                </div>
                                {employee.cvLink && (
                                    <a href={employee.cvLink} target="_blank" rel="noopener noreferrer" className={styles.cvLink}>
                                        <span className="material-symbols-outlined">description</span>
                                        View CV / Drive Link
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h3>Bank Details</h3>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <label>Bank</label>
                                    <p>{employee.bankName || '-'}</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Account Number</label>
                                    <p>{employee.accountNumber || '-'}</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Sort Code</label>
                                    <p>{employee.sortCode || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content / History */}
                    <main className={styles.mainContent}>
                        <section className={styles.historySection}>
                            <div className={styles.sectionHeader}>
                                <h2>Payslip Archive</h2>
                                <span className={styles.badge}>{payslips.length} Records</span>
                            </div>

                            {payslips.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <span className="material-symbols-outlined">receipt_long</span>
                                    <p>Your payslips will appear here once they are processed.</p>
                                </div>
                            ) : (
                                <div className={styles.historyList}>
                                    {payslips.map(slip => (
                                        <div key={slip.id} className={styles.historyCard}>
                                            <div className={styles.slipInfo}>
                                                <div className={styles.dateInfo}>
                                                    <h4>{getMonthName(slip.month)} {slip.year}</h4>
                                                    <p>Period: {String(slip.month + 1).padStart(2, '0')}/{slip.year}</p>
                                                </div>
                                                <div className={styles.statusGroup}>
                                                    <span className={styles.statusBadge}>Sent</span>
                                                </div>
                                            </div>
                                            <div className={styles.slipPay}>
                                                <span className={styles.payLabel}>Net Amount</span>
                                                <span className={styles.amount}>{formatCurrency(slip.netPay)}</span>
                                            </div>
                                            <div className={styles.slipActions}>
                                                <button onClick={() => handleDownloadPayslip(slip)} className={styles.downloadBtn} title="Download PDF">
                                                    <span className="material-symbols-outlined">download</span>
                                                    Download PDF
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
