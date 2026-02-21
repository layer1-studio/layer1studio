import React, { useState, useMemo } from 'react';
import { useContent } from '../hooks/useContent';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
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

    React.useEffect(() => {
        const fetchSettings = async () => {
            const configDoc = await getDoc(doc(db, 'financeConfig', 'settings'));
            if (configDoc.exists()) {
                setSettings(configDoc.data());
            }
        };
        fetchSettings();
    }, []);

    // Employee form state
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [employeeForm, setEmployeeForm] = useState({
        name: '', email: '', designation: '', employeeId: '', baseSalary: '',
        bankName: '', accountNumber: '', sortCode: '', taxCode: ''
    });

    // Payroll state
    const [payrollMonth, setPayrollMonth] = useState(getCurrentPayPeriod().month);
    const [payrollYear, setPayrollYear] = useState(getCurrentPayPeriod().year);
    const [payrollEdits, setPayrollEdits] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Confirm delete
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const handleLogout = async () => {
        sessionStorage.removeItem('financeAuthorized');
        await signOut(auth);
        navigate('/');
    };

    // ─── Employee CRUD ───────────────────────────────────────────
    const resetEmployeeForm = () => {
        setEmployeeForm({ name: '', email: '', designation: '', employeeId: '', baseSalary: '', bankName: '', accountNumber: '', sortCode: '', taxCode: '' });
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
        return payrollEdits[`${empId}_${field}`];
    };

    const setEditedValue = (empId, field, value) => {
        setPayrollEdits(prev => ({ ...prev, [`${empId}_${field}`]: value }));
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
            await updatePayroll(existingPayroll.id, {
                status: 'authorized',
                authorizedAt: new Date().toISOString(),
                authorizedBy: auth.currentUser?.email || 'unknown',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const isPayDayOrAfter = () => {
        const now = new Date();
        return now.getDate() >= payDay &&
            now.getMonth() === payrollMonth &&
            now.getFullYear() === payrollYear;
    };

    // ─── History ─────────────────────────────────────────────────
    const sortedHistory = useMemo(() => {
        return [...payrollRecords].sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
        });
    }, [payrollRecords]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val || 0);
    };

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
                        <button className={`${styles.tabBtn} ${activeTab === 'employees' ? styles.active : ''}`}
                            onClick={() => setActiveTab('employees')}>
                            <span className="material-symbols-outlined">group</span>
                            Employees
                        </button>
                        <button className={`${styles.tabBtn} ${activeTab === 'payroll' ? styles.active : ''}`}
                            onClick={() => setActiveTab('payroll')}>
                            <span className="material-symbols-outlined">payments</span>
                            Payroll
                        </button>
                        <button className={`${styles.tabBtn} ${activeTab === 'history' ? styles.active : ''}`}
                            onClick={() => setActiveTab('history')}>
                            <span className="material-symbols-outlined">history</span>
                            History
                        </button>
                    </div>
                </header>

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
                                            <label>Base Monthly Salary (£)</label>
                                            <input type="number" step="0.01" value={employeeForm.baseSalary} onChange={e => setEmployeeForm({ ...employeeForm, baseSalary: e.target.value })} required />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Tax Code</label>
                                            <input value={employeeForm.taxCode} onChange={e => setEmployeeForm({ ...employeeForm, taxCode: e.target.value })} placeholder="1257L" />
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
                                                    <div className={styles.empAvatar}>{emp.name?.charAt(0)?.toUpperCase() || '?'}</div>
                                                    <div>
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
                                        <span className={`${styles.statusBadge} ${styles[existingPayroll.status]}`}>
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
                                                title={!isPayDayOrAfter() ? `Available on the ${PAY_DAY}th` : 'Send payslips'}
                                            >
                                                <span className="material-symbols-outlined">send</span>
                                                {isProcessing ? 'Processing...' : (isPayDayOrAfter() ? 'Authorize & Send Payslips' : `Available on ${payDay}th`)}
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
                            <h3 className={styles.sectionTitle}>Payroll History</h3>
                            {sortedHistory.length === 0 ? (
                                <p className={styles.emptyMsg}>No payroll records yet.</p>
                            ) : (
                                <div className={styles.historyList}>
                                    {sortedHistory.map(record => (
                                        <div key={record.id} className={styles.historyCard}>
                                            <div className={styles.historyInfo}>
                                                <h4>{getMonthName(record.month)} {record.year}</h4>
                                                <p>{record.employees?.length || 0} employees • Pay day: {record.payDay}th</p>
                                            </div>
                                            <div className={styles.historyRight}>
                                                <span className={styles.historyTotal}>{formatCurrency(record.totalPayroll)}</span>
                                                <span className={`${styles.statusBadge} ${styles[record.status]}`}>
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
            </div>
        </div>
    );
};

export default FinanceDashboard;
