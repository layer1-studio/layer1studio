import React, { useState, useMemo } from 'react';
import { useContent } from '../hooks/useContent';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp, getDoc, collection, addDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import styles from './FinanceDashboard.module.css';

const getCurrentPayPeriod = () => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
};

const getMonthName = (month) => {
    return new Date(2026, month).toLocaleString('default', { month: 'long' });
};

const FinanceDashboard = () => {
    const [activeTab, setActiveTab] = useState('employees');
    const { data: employees, addItem: addEmployee, deleteItem: deleteEmployee, updateItem: updateEmployee } = useContent('employees');
    const { data: payrollRecords, addItem: addPayroll, updateItem: updatePayroll } = useContent('payroll');
    const navigate = useNavigate();

    // Finance Config Settings
    const [settings, setSettings] = React.useState({ payDay: 22 });
    const payDay = settings.payDay;
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchSettings = async () => {
            const configDoc = await getDoc(doc(db, 'financeConfig', 'settings'));
            if (configDoc.exists()) {
                setSettings(configDoc.data());
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    // Employee form state
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [employeeForm, setEmployeeForm] = useState({
        name: '', email: '', designation: '', employeeId: '', baseSalary: '',
        bankName: '', accountNumber: '', sortCode: '', taxCode: '',
        contactNumber: '', cvLink: ''
    });

    // Detail view state
    const [viewingEmployee, setViewingEmployee] = useState(null);

    // Payroll state
    const [payrollMonth, setPayrollMonth] = useState(getCurrentPayPeriod().month);
    const [payrollYear, setPayrollYear] = useState(getCurrentPayPeriod().year);
    const [payrollEdits, setPayrollEdits] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Confirm delete
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // Manual Historical Entry state
    const [showManualForm, setShowManualForm] = useState(false);
    const [manualForm, setManualForm] = useState({
        empDocId: '',
        month: getCurrentPayPeriod().month,
        year: getCurrentPayPeriod().year,
        netPay: ''
    });

    // History Filters
    const [historyFilterMonth, setHistoryFilterMonth] = useState('all');
    const [historyFilterYear, setHistoryFilterYear] = useState(getCurrentPayPeriod().year.toString());
    const [historyFilterEmployee, setHistoryFilterEmployee] = useState('all');

    const handleLogout = async () => {
        sessionStorage.removeItem('financeAuthorized');
        await signOut(auth);
        navigate('/');
    };

    // ─── Employee CRUD ───────────────────────────────────────────
    const resetEmployeeForm = () => {
        setEmployeeForm({ name: '', email: '', designation: '', employeeId: '', baseSalary: '', bankName: '', accountNumber: '', sortCode: '', taxCode: '', contactNumber: '', cvLink: '' });
        setShowEmployeeForm(false);
        setEditingEmployee(null);
    };

    const handleSaveEmployee = async (e) => {
        e.preventDefault();
        const data = {
            ...employeeForm,
            baseSalary: parseFloat(employeeForm.baseSalary) || 0,
        };
        if (editingEmployee) {
            await updateEmployee(editingEmployee.id, data);
        } else {
            await addEmployee(data);
        }
        resetEmployeeForm();
    };

    const handleSaveManualEntry = async (e) => {
        e.preventDefault();
        if (!manualForm.empDocId || !manualForm.netPay) {
            alert('Please select an employee and enter an amount.');
            return;
        }

        setIsProcessing(true);
        try {
            const selectedEmployee = employees.find(emp => emp.id === manualForm.empDocId);
            const periodKey = `${manualForm.year}-${String(parseInt(manualForm.month) + 1).padStart(2, '0')}`;
            const amount = parseFloat(manualForm.netPay);

            // 1. Add to employee's payslips sub-collection
            const payslipRef = await addDoc(collection(db, 'employees', manualForm.empDocId, 'payslips'), {
                periodKey,
                month: parseInt(manualForm.month),
                year: parseInt(manualForm.year),
                netPay: amount,
                totalEarnings: amount,
                totalDeductions: 0,
                sentAt: serverTimestamp(),
                status: 'sent',
                manualEntry: true,
                payslipId: 'MAN-' + Date.now().toString().slice(-4)
            });

            // 2. Add/Update to global payroll history with UNIQUE ID
            const recordId = `${periodKey}_MANUAL_${selectedEmployee.employeeId}_${payslipRef.id.slice(-4)}`;

            await setDoc(doc(db, 'payroll', recordId), {
                periodKey,
                month: parseInt(manualForm.month),
                year: parseInt(manualForm.year),
                totalPayroll: amount,
                status: 'sent',
                type: 'manual_entry',
                employeeName: selectedEmployee.name,
                employeeId: selectedEmployee.id,
                employees: [{
                    name: selectedEmployee.name,
                    employeeId: selectedEmployee.id,
                    empCode: selectedEmployee.employeeId,
                    netPay: amount,
                    status: 'sent'
                }],
                authorizedAt: serverTimestamp(),
                payDay: settings.payDay
            });

            alert('✅ Historical record added successfully!');
            setShowManualForm(false);
            setManualForm({
                empDocId: '',
                month: getCurrentPayPeriod().month,
                year: getCurrentPayPeriod().year,
                netPay: ''
            });
        } catch (err) {
            console.error(err);
            alert('❌ Error adding record: ' + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const startEditEmployee = (emp) => {
        setEditingEmployee(emp);
        setEmployeeForm({
            name: emp.name || '',
            email: emp.email || '',
            designation: emp.designation || '',
            employeeId: emp.employeeId || '',
            baseSalary: emp.baseSalary?.toString() || '',
            bankName: emp.bankName || '',
            accountNumber: emp.accountNumber || '',
            sortCode: emp.sortCode || '',
            taxCode: emp.taxCode || '',
            contactNumber: emp.contactNumber || '',
            cvLink: emp.cvLink || '',
        });
        setShowEmployeeForm(true);
    };

    // ─── Payroll ─────────────────────────────────────────────────
    const payrollKey = `${payrollYear}-${String(payrollMonth + 1).padStart(2, '0')}`;
    const existingPayroll = payrollRecords.find(r => r.periodKey === payrollKey);

    const payrollEmployees = useMemo(() => {
        if (existingPayroll?.employees) return existingPayroll.employees;
        return employees.map(emp => ({
            employeeId: emp.id,
            name: emp.name,
            email: emp.email,
            designation: emp.designation,
            empCode: emp.employeeId,
            baseSalary: emp.baseSalary || 0,
            bonus: 0,
            overtime: 0,
            allowances: 0,
            taxDeduction: 0,
            pensionDeduction: 0,
            otherDeductions: 0,
            bankName: emp.bankName || '',
            accountNumber: emp.accountNumber || '',
            sortCode: emp.sortCode || '',
            taxCode: emp.taxCode || '',
        }));
    }, [employees, existingPayroll]);

    const getEditedValue = (empId, field) => {
        return payrollEdits[`${empId}_${field} `];
    };

    const setEditedValue = (empId, field, value) => {
        setPayrollEdits(prev => ({ ...prev, [`${empId}_${field} `]: value }));
    };

    const getVal = (emp, field) => {
        const edited = getEditedValue(emp.employeeId, field);
        return edited !== undefined ? parseFloat(edited) || 0 : (emp[field] || 0);
    };

    const calcTotalEarnings = (emp) => getVal(emp, 'baseSalary') + getVal(emp, 'bonus') + getVal(emp, 'overtime') + getVal(emp, 'allowances');
    const calcTotalDeductions = (emp) => getVal(emp, 'taxDeduction') + getVal(emp, 'pensionDeduction') + getVal(emp, 'otherDeductions');
    const calcNetPay = (emp) => calcTotalEarnings(emp) - calcTotalDeductions(emp);

    const handleApprovePayroll = async () => {
        setIsProcessing(true);
        try {
            const finalEmployees = payrollEmployees.map(emp => ({
                ...emp,
                baseSalary: getVal(emp, 'baseSalary'),
                bonus: getVal(emp, 'bonus'),
                overtime: getVal(emp, 'overtime'),
                allowances: getVal(emp, 'allowances'),
                taxDeduction: getVal(emp, 'taxDeduction'),
                pensionDeduction: getVal(emp, 'pensionDeduction'),
                otherDeductions: getVal(emp, 'otherDeductions'),
                totalEarnings: calcTotalEarnings(emp),
                totalDeductions: calcTotalDeductions(emp),
                netPay: calcNetPay(emp),
            }));

            const payrollData = {
                periodKey: payrollKey,
                month: payrollMonth,
                year: payrollYear,
                payDay: payDay,
                status: 'approved',
                approvedAt: new Date().toISOString(),
                approvedBy: auth.currentUser?.email || 'unknown',
                employees: finalEmployees,
                totalPayroll: finalEmployees.reduce((sum, e) => sum + e.netPay, 0),
            };

            if (existingPayroll) {
                await updatePayroll(existingPayroll.id, payrollData);
            } else {
                await addPayroll(payrollData);
            }
            setPayrollEdits({});
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAuthorize = async () => {
        if (!existingPayroll) return;
        setIsProcessing(true);
        try {
            const authorizedEmployees = existingPayroll.employees || [];
            if (authorizedEmployees.length === 0) {
                alert('No employees in this payroll run.');
                return;
            }

            const confirmSend = window.confirm(`Generate and email payslips to ${authorizedEmployees.length} employees now?`);
            if (!confirmSend) return;

            // Send Email via EmailJS Loop
            for (const emp of authorizedEmployees) {
                try {
                    console.log(`Sending Email to ${emp.name} (${emp.email})...`);
                    await emailjs.send(
                        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'dummy',
                        import.meta.env.VITE_EMAILJS_PAYSLIP_TEMPLATE_ID || 'dummy',
                        {
                            to_name: emp.name,
                            to_email: emp.email,
                            period_key: existingPayroll.periodKey,
                        },
                        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'dummy'
                    );

                    // Mark employee in run as sent
                    emp.status = 'sent';

                    // Add record directly to employee portal
                    const empId = emp.id || emp.employeeId || emp.empCode;
                    if (empId) {
                        await addDoc(collection(db, 'employees', empId, 'payslips'), {
                            periodKey: existingPayroll.periodKey,
                            month: existingPayroll.month,
                            year: existingPayroll.year,
                            netPay: emp.netPay,
                            totalEarnings: emp.totalEarnings || emp.netPay,
                            totalDeductions: emp.totalDeductions || 0,
                            sentAt: serverTimestamp(),
                            status: 'sent',
                            payrollId: existingPayroll.id
                        });
                    }
                    console.log(`Successfully sent payslip to ${emp.name}`);
                } catch (err) {
                    console.error(`Failed to email/process ${emp.name}:`, err);
                }
            }

            // Mark global run as sent
            await updatePayroll(existingPayroll.id, {
                status: 'sent',
                authorizedAt: new Date().toISOString(),
                authorizedBy: auth.currentUser?.email || 'unknown',
                sentAt: serverTimestamp(),
                employees: authorizedEmployees
            });
            alert('✅ All payslips generated and sent successfully!');
        } catch (err) {
            console.error('Error authorizing payroll:', err);
            alert('Failed to authorize payroll: ' + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const isPayDayOrAfter = () => {
        const now = new Date();
        const payDate = new Date(payrollYear, payrollMonth, payDay);
        // Authorization opens 3 days before pay day
        const authStartDate = new Date(payDate);
        authStartDate.setDate(payDate.getDate() - 3);

        now.setHours(0, 0, 0, 0);
        authStartDate.setHours(0, 0, 0, 0);

        return now >= authStartDate;
    };

    // ─── History ─────────────────────────────────────────────────
    const filteredHistory = useMemo(() => {
        // Flatten records into individual payment lines if needed, or filter as is
        let items = [];

        payrollRecords.forEach(record => {
            // Use forEach to build individual lines for each employee in a run
            if (record.employees && record.employees.length > 0) {
                record.employees.forEach(empPay => {
                    items.push({
                        ...record,
                        // Override individual info
                        displayId: `${record.id}_${empPay.employeeId || empPay.empCode}`,
                        employeeName: empPay.name,
                        employeeId: empPay.employeeId || empPay.empCode,
                        netPay: empPay.netPay,
                        status: empPay.status || record.status,
                        isBulkPart: record.type !== 'manual_entry'
                    });
                });
            } else if (record.type === 'manual_entry') {
                items.push({
                    ...record,
                    displayId: record.id,
                });
            }
        });

        // Apply filters
        return items.filter(item => {
            const matchMonth = historyFilterMonth === 'all' || item.month.toString() === historyFilterMonth;
            const matchYear = historyFilterYear === 'all' || item.year.toString() === historyFilterYear;
            const matchEmployee = historyFilterEmployee === 'all' || item.employeeId === historyFilterEmployee;
            return matchMonth && matchYear && matchEmployee;
        }).sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            if (a.month !== b.month) return b.month - a.month;
            return b.authorizedAt?.seconds - a.authorizedAt?.seconds;
        });
    }, [payrollRecords, historyFilterMonth, historyFilterYear, historyFilterEmployee]);

    const sortedHistory = filteredHistory; // For backward compatibility in logic if needed

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', currencyDisplay: 'symbol' }).format(val || 0).replace('LKR', 'Rs.');
    };

    if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;
    return (
        <div className={styles.dashboard}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h1 className={styles.title}>Finance <span>Portal</span></h1>
                        <div className={styles.headerActions}>
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                <span className="material-symbols-outlined">logout</span>
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className={styles.tabs}>
                        <button className={`${styles.tabBtn} ${activeTab === 'employees' ? styles.active : ''} `}
                            onClick={() => setActiveTab('employees')}>
                            <span className="material-symbols-outlined">group</span>
                            Employees
                        </button>
                        <button className={`${styles.tabBtn} ${activeTab === 'payroll' ? styles.active : ''} `}
                            onClick={() => setActiveTab('payroll')}>
                            <span className="material-symbols-outlined">payments</span>
                            Payroll
                        </button>
                        <button className={`${styles.tabBtn} ${activeTab === 'history' ? styles.active : ''} `}
                            onClick={() => setActiveTab('history')}>
                            <span className="material-symbols-outlined">history</span>
                            History
                        </button>
                    </div>
                </header >

                <main className={styles.content}>
                    {/* ─── EMPLOYEES TAB ───────────────────────────── */}
                    {activeTab === 'employees' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.searchGroup}>
                                    <h3>Employee Directory</h3>
                                    <div className={styles.searchBox}>
                                        <span className="material-symbols-outlined">search</span>
                                        <input
                                            type="text"
                                            placeholder="Search name or ID..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button className={styles.addBtn} onClick={() => { resetEmployeeForm(); setShowEmployeeForm(true); }}>
                                    <span className="material-symbols-outlined">person_add</span>
                                    Add Employee
                                </button>
                            </div>

                            {showEmployeeForm && (
                                <form className={styles.form} onSubmit={handleSaveEmployee}>
                                    <h3>{editingEmployee ? 'Edit Employee' : 'New Employee'}</h3>
                                    <div className={styles.formGrid}>
                                        <div className={styles.field}>
                                            <label>Full Name</label>
                                            <input value={employeeForm.name} onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })} required />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Email</label>
                                            <input type="email" value={employeeForm.email} onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })} required />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Designation</label>
                                            <input value={employeeForm.designation} onChange={e => setEmployeeForm({ ...employeeForm, designation: e.target.value })} required />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Employee ID</label>
                                            <input value={employeeForm.employeeId} onChange={e => setEmployeeForm({ ...employeeForm, employeeId: e.target.value })} placeholder="L1-EMP-001" required />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Base Monthly Salary (Rs.)</label>
                                            <input type="number" step="0.01" value={employeeForm.baseSalary} onChange={e => setEmployeeForm({ ...employeeForm, baseSalary: e.target.value })} required />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Tax Code</label>
                                            <input value={employeeForm.taxCode} onChange={e => setEmployeeForm({ ...employeeForm, taxCode: e.target.value })} placeholder="1257L" />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Contact Number</label>
                                            <input value={employeeForm.contactNumber} onChange={e => setEmployeeForm({ ...employeeForm, contactNumber: e.target.value })} placeholder="+94 ..." />
                                        </div>
                                        <div className={styles.field}>
                                            <label>CV Link (Drive Link)</label>
                                            <input value={employeeForm.cvLink} onChange={e => setEmployeeForm({ ...employeeForm, cvLink: e.target.value })} placeholder="Add drive link" />
                                        </div>
                                    </div>
                                    <h4 className={styles.subHeading}>Bank Details</h4>
                                    <div className={styles.formGrid}>
                                        <div className={styles.field}>
                                            <label>Bank Name</label>
                                            <input value={employeeForm.bankName} onChange={e => setEmployeeForm({ ...employeeForm, bankName: e.target.value })} />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Account Number</label>
                                            <input value={employeeForm.accountNumber} onChange={e => setEmployeeForm({ ...employeeForm, accountNumber: e.target.value })} />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Sort Code</label>
                                            <input value={employeeForm.sortCode} onChange={e => setEmployeeForm({ ...employeeForm, sortCode: e.target.value })} placeholder="00-00-00" />
                                        </div>
                                    </div>
                                    <div className={styles.buttonGroup}>
                                        <button type="submit" className={styles.saveBtn}>{editingEmployee ? 'Save Changes' : 'Add Employee'}</button>
                                        <button type="button" className={styles.cancelBtn} onClick={resetEmployeeForm}>Cancel</button>
                                    </div>
                                </form>
                            )}

                            <div className={styles.employeeList}>
                                {employees.filter(e =>
                                    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    e.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
                                ).length === 0 ? (
                                    <p className={styles.emptyMsg}>
                                        {searchTerm ? 'No employees found matching your search.' : 'No employees added yet. Start by adding your team members.'}
                                    </p>
                                ) : (
                                    employees
                                        .filter(e =>
                                            e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            e.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map(emp => (
                                            <div key={emp.id} className={styles.employeeCard}>
                                                <div className={styles.empInfo}>
                                                    <div className={styles.empAvatar} onClick={() => setViewingEmployee(emp)}>{emp.name?.charAt(0)?.toUpperCase() || '?'}</div>
                                                    <div onClick={() => setViewingEmployee(emp)} style={{ cursor: 'pointer' }}>
                                                        <h4>{emp.name}</h4>
                                                        <p className={styles.empDesignation}>{emp.designation}</p>
                                                        <p className={styles.empMeta}>{emp.email} • {emp.employeeId}</p>
                                                    </div>
                                                </div>
                                                <div className={styles.empSalary}>{formatCurrency(emp.baseSalary)}<span>/mo</span></div>
                                                <div className={styles.empActions}>
                                                    {confirmDeleteId === emp.id ? (
                                                        <div className={styles.confirmGroup}>
                                                            <span>Delete?</span>
                                                            <button onClick={() => { deleteEmployee(emp.id); setConfirmDeleteId(null); }} className={styles.deleteConfirmBtn}>Yes</button>
                                                            <button onClick={() => setConfirmDeleteId(null)} className={styles.cancelSmBtn}>No</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => setViewingEmployee(emp)} className={styles.viewBtn} title="View Details">
                                                                <span className="material-symbols-outlined">visibility</span>
                                                            </button>
                                                            <button onClick={() => startEditEmployee(emp)} className={styles.editBtn}>
                                                                <span className="material-symbols-outlined">edit</span>
                                                            </button>
                                                            <button onClick={() => setConfirmDeleteId(emp.id)} className={styles.deleteBtn}>
                                                                <span className="material-symbols-outlined">delete</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>

                            {/* ─── EMPLOYEE DETAIL MODAL ────────────────── */}
                            {viewingEmployee && (
                                <div className={styles.modalOverlay} onClick={() => setViewingEmployee(null)}>
                                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                                        <header className={styles.modalHeader}>
                                            <div className={styles.modalUser}>
                                                <div className={styles.modalAvatar}>{viewingEmployee.name?.charAt(0)?.toUpperCase()}</div>
                                                <div>
                                                    <h3>{viewingEmployee.name}</h3>
                                                    <p>{viewingEmployee.designation}</p>
                                                    <span className={styles.empIdBadge}>{viewingEmployee.employeeId}</span>
                                                </div>
                                            </div>
                                            <button className={styles.closeBtn} onClick={() => setViewingEmployee(null)}>
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        </header>

                                        <div className={styles.modalBody}>
                                            <div className={styles.infoGrid}>
                                                <div className={styles.infoGroup}>
                                                    <label>Email Address</label>
                                                    <p>{viewingEmployee.email}</p>
                                                </div>
                                                <div className={styles.infoGroup}>
                                                    <label>Contact Number</label>
                                                    <p>{viewingEmployee.contactNumber || 'Not specified'}</p>
                                                </div>
                                                <div className={styles.infoGroup}>
                                                    <label>Tax Code</label>
                                                    <p>{viewingEmployee.taxCode || 'N/A'}</p>
                                                </div>
                                                <div className={styles.infoGroup}>
                                                    <label>CV / Drive Link</label>
                                                    {viewingEmployee.cvLink ? (
                                                        <a href={viewingEmployee.cvLink} target="_blank" rel="noopener noreferrer" className={styles.cvLink}>
                                                            <span className="material-symbols-outlined">description</span>
                                                            View Document
                                                        </a>
                                                    ) : <p>None attached</p>}
                                                </div>
                                            </div>

                                            <div className={styles.bankSection}>
                                                <h4>Bank Details (Confidential)</h4>
                                                <div className={styles.bankGrid}>
                                                    <div><label>Bank</label><p>{viewingEmployee.bankName || '-'}</p></div>
                                                    <div><label>Account</label><p>{viewingEmployee.accountNumber || '-'}</p></div>
                                                    <div><label>Sort Code</label><p>{viewingEmployee.sortCode || '-'}</p></div>
                                                </div>
                                            </div>

                                            <div className={styles.historySection}>
                                                <h4>Payment History</h4>
                                                <div className={styles.modalHistoryList}>
                                                    {payrollRecords
                                                        .filter(p => p.employees?.some(e => e.employeeId === viewingEmployee.id))
                                                        .sort((a, b) => b.year - a.year || b.month - a.month)
                                                        .slice(0, 6)
                                                        .map(p => {
                                                            const record = p.employees.find(e => e.employeeId === viewingEmployee.id);
                                                            return (
                                                                <div key={p.id} className={styles.modalHistoryItem}>
                                                                    <div className={styles.histPeriod}>
                                                                        <strong>{getMonthName(p.month)} {p.year}</strong>
                                                                        <span className={`${styles.statusBadge} ${styles[p.status]} `}>{p.status}</span>
                                                                    </div>
                                                                    <div className={styles.histPay}>
                                                                        <span>Net Pay</span>
                                                                        <strong>{formatCurrency(record.netPay)}</strong>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    {payrollRecords.filter(p => p.employees?.some(e => e.employeeId === viewingEmployee.id)).length === 0 && (
                                                        <p className={styles.emptyMsg}>No payment history found yet.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─── PAYROLL TAB ──────────────────────────────── */}
                    {activeTab === 'payroll' && (
                        <div className={styles.section}>
                            <div className={styles.payrollHeader}>
                                <div className={styles.periodSelector}>
                                    <select value={payrollMonth} onChange={e => setPayrollMonth(parseInt(e.target.value))} className={styles.monthSelect}>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i} value={i}>{getMonthName(i)}</option>
                                        ))}
                                    </select>
                                    <select value={payrollYear} onChange={e => setPayrollYear(parseInt(e.target.value))} className={styles.yearSelect}>
                                        {[2025, 2026, 2027].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.payrollMeta}>
                                    <div className={styles.summaryStats}>
                                        <div className={styles.statItem}>
                                            <small>Headcount</small>
                                            <strong>{payrollEmployees.length}</strong>
                                        </div>
                                        <div className={styles.statSeparator} />
                                        <div className={styles.statItem}>
                                            <small>Total Payroll</small>
                                            <strong>{formatCurrency(payrollEmployees.reduce((sum, e) => sum + calcNetPay(e), 0))}</strong>
                                        </div>
                                    </div>
                                    <span className={styles.payDayBadge}>
                                        <span className="material-symbols-outlined">calendar_today</span>
                                        Pay Day: {payDay}th
                                    </span>
                                    {existingPayroll && (
                                        <span className={`${styles.statusBadge} ${styles[existingPayroll.status]} `}>
                                            {existingPayroll.status === 'approved' ? '✓ Approved' :
                                                existingPayroll.status === 'authorized' ? '🚀 Authorized' :
                                                    existingPayroll.status === 'sent' ? '📧 Sent' : 'Draft'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {payrollEmployees.length === 0 ? (
                                <div className={styles.emptyPayroll}>
                                    <span className="material-symbols-outlined">group_off</span>
                                    <p>No employees found. Add employees first.</p>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.tableWrapper}>
                                        <table className={styles.payrollTable}>
                                            <thead>
                                                <tr>
                                                    <th>Employee</th>
                                                    <th>Base Salary</th>
                                                    <th>Bonus</th>
                                                    <th>Overtime</th>
                                                    <th>Allowances</th>
                                                    <th>Tax</th>
                                                    <th>Pension</th>
                                                    <th>Other Ded.</th>
                                                    <th className={styles.totalCol}>Net Pay</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payrollEmployees.map(emp => {
                                                    const isLocked = existingPayroll?.status === 'authorized' || existingPayroll?.status === 'sent';
                                                    return (
                                                        <tr key={emp.employeeId}>
                                                            <td>
                                                                <div className={styles.cellEmp}>
                                                                    <strong>{emp.name}</strong>
                                                                    <small>{emp.designation}</small>
                                                                </div>
                                                            </td>
                                                            {['baseSalary', 'bonus', 'overtime', 'allowances', 'taxDeduction', 'pensionDeduction', 'otherDeductions'].map(field => (
                                                                <td key={field}>
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        className={styles.cellInput}
                                                                        value={getEditedValue(emp.employeeId, field) ?? emp[field] ?? 0}
                                                                        onChange={e => setEditedValue(emp.employeeId, field, e.target.value)}
                                                                        disabled={isLocked}
                                                                    />
                                                                </td>
                                                            ))}
                                                            <td className={styles.totalCol}>
                                                                <strong className={calcNetPay(emp) >= 0 ? styles.positive : styles.negative}>
                                                                    {formatCurrency(calcNetPay(emp))}
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td><strong>Total Payroll</strong></td>
                                                    <td colSpan="7"></td>
                                                    <td className={styles.totalCol}>
                                                        <strong className={styles.grandTotal}>
                                                            {formatCurrency(payrollEmployees.reduce((sum, e) => sum + calcNetPay(e), 0))}
                                                        </strong>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    <div className={styles.payrollActions}>
                                        {(!existingPayroll || existingPayroll.status === 'draft') && (
                                            <button
                                                onClick={handleApprovePayroll}
                                                className={styles.approveBtn}
                                                disabled={isProcessing}
                                            >
                                                <span className="material-symbols-outlined">check_circle</span>
                                                {isProcessing ? 'Saving...' : 'Approve Payroll'}
                                            </button>
                                        )}
                                        {existingPayroll?.status === 'approved' && (
                                            <button
                                                onClick={handleAuthorize}
                                                className={styles.authorizeBtn}
                                                disabled={!isPayDayOrAfter() || isProcessing}
                                                title={!isPayDayOrAfter() ? `Available from the ${Math.max(1, payDay - 3)}th` : 'Send payslips'}
                                            >
                                                <span className="material-symbols-outlined">send</span>
                                                {isProcessing ? 'Processing...' : (isPayDayOrAfter() ? 'Authorize & Send Payslips' : `Available from ${Math.max(1, payDay - 3)}th`)}
                                            </button>
                                        )}
                                        {existingPayroll?.status === 'authorized' && (
                                            <div className={styles.sentInfo}>
                                                <span className="material-symbols-outlined">check</span>
                                                Authorized on {new Date(existingPayroll.authorizedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                        {existingPayroll?.status === 'sent' && (
                                            <div className={styles.sentInfo}>
                                                <span className="material-symbols-outlined">mark_email_read</span>
                                                Payslips sent successfully
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ─── HISTORY TAB ──────────────────────────────── */}
                    {activeTab === 'history' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3 className={styles.sectionTitle}>Payroll History</h3>
                                <button
                                    className={styles.addBtn}
                                    style={{ background: '#f59e0b', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)' }}
                                    onClick={() => setShowManualForm(!showManualForm)}
                                >
                                    <span className="material-symbols-outlined">{showManualForm ? 'close' : 'history_edu'}</span>
                                    {showManualForm ? 'Cancel' : 'Add Historical Record'}
                                </button>
                            </div>

                            <div className={styles.filtersBar} style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '2rem',
                                background: '#f8fafc',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                flexWrap: 'wrap'
                            }}>
                                <div className={styles.filterField} style={{ flex: '1', minWidth: '150px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>FILTER EMPLOYEE</label>
                                    <select
                                        className={styles.monthSelect}
                                        value={historyFilterEmployee}
                                        onChange={e => setHistoryFilterEmployee(e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="all">All Employees</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.filterField} style={{ flex: '0.5', minWidth: '120px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>MONTH</label>
                                    <select
                                        className={styles.monthSelect}
                                        value={historyFilterMonth}
                                        onChange={e => setHistoryFilterMonth(e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="all">All Months</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i} value={i}>{getMonthName(i)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.filterField} style={{ flex: '0.5', minWidth: '100px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>YEAR</label>
                                    <select
                                        className={styles.yearSelect}
                                        value={historyFilterYear}
                                        onChange={e => setHistoryFilterYear(e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="all">All Years</option>
                                        {[2024, 2025, 2026].map(y => (
                                            <option key={y} value={y.toString()}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => { setHistoryFilterEmployee('all'); setHistoryFilterMonth('all'); setHistoryFilterYear('all'); }}
                                    style={{
                                        alignSelf: 'flex-end',
                                        padding: '0.6rem 1rem',
                                        fontSize: '0.85rem',
                                        background: '#fff',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: '#64748b'
                                    }}
                                >
                                    Reset
                                </button>
                            </div>

                            {showManualForm && (
                                <form className={styles.form} onSubmit={handleSaveManualEntry}>
                                    <h3 style={{ color: '#f59e0b' }}>New Historical Entry</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                                        Manually record a past transaction for an employee. This will appear in their personal portal.
                                    </p>
                                    <div className={styles.formGrid}>
                                        <div className={styles.field}>
                                            <label>Select Employee</label>
                                            <select
                                                className={styles.monthSelect}
                                                value={manualForm.empDocId}
                                                onChange={e => setManualForm({ ...manualForm, empDocId: e.target.value })}
                                                required
                                            >
                                                <option value="">-- Select Employee --</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.field}>
                                            <label>Month</label>
                                            <select
                                                className={styles.monthSelect}
                                                value={manualForm.month}
                                                onChange={e => setManualForm({ ...manualForm, month: e.target.value })}
                                            >
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i} value={i}>{getMonthName(i)}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.field}>
                                            <label>Year</label>
                                            <select
                                                className={styles.yearSelect}
                                                value={manualForm.year}
                                                onChange={e => setManualForm({ ...manualForm, year: e.target.value })}
                                            >
                                                {[2024, 2025, 2026].map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.field}>
                                            <label>Net Pay Amount (Rs.)</label>
                                            <input
                                                type="number"
                                                value={manualForm.netPay}
                                                onChange={e => setManualForm({ ...manualForm, netPay: e.target.value })}
                                                placeholder="e.g. 88000"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.buttonGroup}>
                                        <button type="submit" className={styles.saveBtn} style={{ background: '#f59e0b' }} disabled={isProcessing}>
                                            {isProcessing ? 'Processing...' : 'Save Record'}
                                        </button>
                                        <button type="button" className={styles.cancelBtn} onClick={() => setShowManualForm(false)}>Cancel</button>
                                    </div>
                                </form>
                            )}

                            {sortedHistory.length === 0 ? (
                                <p className={styles.emptyMsg}>No payroll records found for the selected filters.</p>
                            ) : (
                                <div className={styles.historyList}>
                                    {sortedHistory.map(record => (
                                        <div key={record.displayId} className={styles.historyCard}>
                                            <div className={styles.historyInfo}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <span className="material-symbols-outlined" style={{ color: record.type === 'manual_entry' ? '#f59e0b' : '#10b981' }}>
                                                        {record.type === 'manual_entry' ? 'history_edu' : 'receipt_long'}
                                                    </span>
                                                    <div>
                                                        <h4 style={{ margin: 0 }}>{record.employeeName}</h4>
                                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                                            {getMonthName(record.month)} {record.year} • {record.type === 'manual_entry' ? 'Manual Entry' : 'Payroll Run'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.historyRight} style={{ textAlign: 'right' }}>
                                                <span className={styles.historyTotal} style={{ display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>
                                                    {formatCurrency(record.netPay)}
                                                </span>
                                                <span className={`${styles.statusBadge} ${styles[record.status]} `} style={{ fontSize: '0.7rem' }}>
                                                    {record.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div >
        </div >
    );
};

export default FinanceDashboard;
