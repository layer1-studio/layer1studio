import React, { useState } from 'react';
import { useContent } from '../hooks/useContent';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const { data: projects, addItem: addProject, deleteItem: deleteProject, updateItem: updateProject } = useContent('projects');
    const { data: careers, addItem: addCareer, deleteItem: deleteCareer, updateItem: updateCareer } = useContent('careers');
    const { data: applications, deleteItem: deleteApplication } = useContent('applications');
    const navigate = useNavigate();

    // UI States
    const [editingProject, setEditingProject] = useState(null);
    const [editingCareer, setEditingCareer] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [newProject, setNewProject] = useState({ title: '', category: '', text: '', tags: '', image: '' });
    const [newCareer, setNewCareer] = useState({ title: '', location: '', salary: '', type: '', description: '' });
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handleImageUpload = async (e, isEdit = false) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadStatus('Uploading image...');
        const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);

        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            if (isEdit) {
                setEditingProject({ ...editingProject, image: url });
            } else {
                setNewProject({ ...newProject, image: url });
            }
            setUploadStatus('Image uploaded successfully!');
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadStatus('Upload failed. Check Firebase config.');
        } finally {
            setUploading(false);
        }
    };

    const handleAddProject = (e) => {
        e.preventDefault();
        const p = { ...newProject, tags: typeof newProject.tags === 'string' ? newProject.tags.split(',').map(t => t.trim()) : newProject.tags };
        addProject(p);
        setNewProject({ title: '', category: '', text: '', tags: '', image: '' });
    };

    const handleUpdateProject = (e) => {
        e.preventDefault();
        const p = { ...editingProject, tags: typeof editingProject.tags === 'string' ? editingProject.tags.split(',').map(t => t.trim()) : editingProject.tags };
        updateProject(editingProject.id, p);
        setEditingProject(null);
    };

    const handleAddCareer = (e) => {
        e.preventDefault();
        addCareer(newCareer);
        setNewCareer({ title: '', location: '', salary: '', type: '', description: '' });
    };

    const handleUpdateCareer = (e) => {
        e.preventDefault();
        updateCareer(editingCareer.id, editingCareer);
        setEditingCareer(null);
    };

    return (
        <div className={styles.dashboard}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h1 className={styles.title}>Studio <span>Manager</span></h1>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            <span className="material-symbols-outlined">logout</span>
                            Logout
                        </button>
                    </div>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'projects' ? styles.active : ''}`}
                            onClick={() => { setActiveTab('projects'); setEditingProject(null); setConfirmDeleteId(null); }}
                        >
                            Projects
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'careers' ? styles.active : ''}`}
                            onClick={() => { setActiveTab('careers'); setEditingCareer(null); setConfirmDeleteId(null); }}
                        >
                            Careers
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'applications' ? styles.active : ''}`}
                            onClick={() => { setActiveTab('applications'); setConfirmDeleteId(null); }}
                        >
                            Applications
                        </button>
                    </div>
                </header>

                <main className={styles.content}>
                    {activeTab === 'projects' ? (
                        <div className={styles.section}>
                            {editingProject ? (
                                <form className={styles.form} onSubmit={handleUpdateProject}>
                                    <h3>Edit Project</h3>
                                    <div className={styles.formGrid}>
                                        <input placeholder="Title" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} required />
                                        <input placeholder="Category" value={editingProject.category} onChange={e => setEditingProject({ ...editingProject, category: e.target.value })} required />
                                        <div className={styles.fileInputWrapper}>
                                            <label className={styles.fileLabel}>
                                                <span className="material-symbols-outlined">upload</span>
                                                Change Image
                                                <input type="file" onChange={(e) => handleImageUpload(e, true)} accept="image/*" />
                                            </label>
                                        </div>
                                        <input placeholder="Tags (comma separated)" value={Array.isArray(editingProject.tags) ? editingProject.tags.join(', ') : editingProject.tags} onChange={e => setEditingProject({ ...editingProject, tags: e.target.value })} />
                                    </div>
                                    <textarea placeholder="Description" value={editingProject.text} onChange={e => setEditingProject({ ...editingProject, text: e.target.value })} required />
                                    <div className={styles.buttonGroup}>
                                        <button type="submit" className={styles.saveBtn}>Save Changes</button>
                                        <button type="button" onClick={() => setEditingProject(null)} className={styles.cancelBtn}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <form className={styles.form} onSubmit={handleAddProject}>
                                    <h3>Add New Project</h3>
                                    <div className={styles.formGrid}>
                                        <input placeholder="Title" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} required />
                                        <input placeholder="Category" value={newProject.category} onChange={e => setNewProject({ ...newProject, category: e.target.value })} required />
                                        <div className={styles.fileInputWrapper}>
                                            <label className={styles.fileLabel}>
                                                <span className="material-symbols-outlined">upload</span>
                                                {newProject.image ? 'Image Selected' : 'Upload Project Image'}
                                                <input type="file" onChange={handleImageUpload} accept="image/*" />
                                            </label>
                                            {uploadStatus && <p className={styles.uploadStatus}>{uploadStatus}</p>}
                                        </div>
                                        <input placeholder="Tags (comma separated)" value={newProject.tags} onChange={e => setNewProject({ ...newProject, tags: e.target.value })} />
                                    </div>
                                    <textarea placeholder="Description" value={newProject.text} onChange={e => setNewProject({ ...newProject, text: e.target.value })} required />
                                    <button type="submit">Publish Project</button>
                                </form>
                            )}

                            <div className={styles.list}>
                                <h3>Existing Projects</h3>
                                {projects.map(p => (
                                    <div key={p.id} className={styles.item}>
                                        <div className={styles.itemInfo}>
                                            <h4>{p.title}</h4>
                                            <p>{p.category}</p>
                                        </div>
                                        <div className={styles.itemActions}>
                                            {confirmDeleteId === p.id ? (
                                                <div className={styles.confirmGroup}>
                                                    <span className={styles.confirmLabel}>Are you sure?</span>
                                                    <button onClick={() => deleteProject(p.id)} className={styles.deleteBtn}>Yes, Delete</button>
                                                    <button onClick={() => setConfirmDeleteId(null)} className={styles.cancelBtn}>Cancel</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => setEditingProject(p)} className={styles.editBtn}>Edit</button>
                                                    <button onClick={() => setConfirmDeleteId(p.id)} className={styles.deleteBtn}>Delete</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : activeTab === 'careers' ? (
                        <div className={styles.section}>
                            {editingCareer ? (
                                <form className={styles.form} onSubmit={handleUpdateCareer}>
                                    <h3>Edit Role</h3>
                                    <div className={styles.formGrid}>
                                        <input placeholder="Job Title" value={editingCareer.title} onChange={e => setEditingCareer({ ...editingCareer, title: e.target.value })} required />
                                        <input placeholder="Location" value={editingCareer.location} onChange={e => setEditingCareer({ ...editingCareer, location: e.target.value })} required />
                                        <input placeholder="Salary Range" value={editingCareer.salary} onChange={e => setEditingCareer({ ...editingCareer, salary: e.target.value })} />
                                        <input placeholder="Type (Full-time/Contract)" value={editingCareer.type} onChange={e => setEditingCareer({ ...editingCareer, type: e.target.value })} required />
                                    </div>
                                    <textarea placeholder="Job Description" value={editingCareer.description} onChange={e => setEditingCareer({ ...editingCareer, description: e.target.value })} required />
                                    <div className={styles.buttonGroup}>
                                        <button type="submit" className={styles.saveBtn}>Save Changes</button>
                                        <button type="button" onClick={() => setEditingCareer(null)} className={styles.cancelBtn}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <form className={styles.form} onSubmit={handleAddCareer}>
                                    <h3>Add New Role</h3>
                                    <div className={styles.formGrid}>
                                        <input placeholder="Job Title" value={newCareer.title} onChange={e => setNewCareer({ ...newCareer, title: e.target.value })} required />
                                        <input placeholder="Location" value={newCareer.location} onChange={e => setNewCareer({ ...newCareer, location: e.target.value })} required />
                                        <input placeholder="Salary Range" value={newCareer.salary} onChange={e => setNewCareer({ ...newCareer, salary: e.target.value })} />
                                        <input placeholder="Type (Full-time/Contract)" value={newCareer.type} onChange={e => setNewCareer({ ...newCareer, type: e.target.value })} required />
                                    </div>
                                    <textarea placeholder="Job Description" value={newCareer.description} onChange={e => setNewCareer({ ...newCareer, description: e.target.value })} required />
                                    <button type="submit">Post Job</button>
                                </form>
                            )}

                            <div className={styles.list}>
                                <h3>Open Roles</h3>
                                {careers.map(c => (
                                    <div key={c.id} className={styles.item}>
                                        <div className={styles.itemInfo}>
                                            <h4>{c.title}</h4>
                                            <p>{c.location} • {c.type}</p>
                                        </div>
                                        <div className={styles.itemActions}>
                                            {confirmDeleteId === c.id ? (
                                                <div className={styles.confirmGroup}>
                                                    <span className={styles.confirmLabel}>Really delete?</span>
                                                    <button onClick={() => deleteCareer(c.id)} className={styles.deleteBtn}>Delete</button>
                                                    <button onClick={() => setConfirmDeleteId(null)} className={styles.cancelBtn}>Cancel</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => setEditingCareer(c)} className={styles.editBtn}>Edit</button>
                                                    <button onClick={() => setConfirmDeleteId(c.id)} className={styles.deleteBtn}>Delete</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.section}>
                            <div className={styles.list}>
                                <h3>Candidate Applications</h3>
                                {applications.length === 0 ? <p className={styles.emptyMsg}>No applications yet.</p> : (
                                    applications.map(app => (
                                        <div key={app.id} className={styles.appCard}>
                                            <div className={styles.appHeader}>
                                                <h4>{app.name}</h4>
                                                <span className={styles.roleTag}>{app.jobTitle}</span>
                                            </div>
                                            <p className={styles.appEmail}>{app.email}</p>
                                            <div className={styles.appLinks}>
                                                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className={styles.link}>
                                                    <span className="material-symbols-outlined">description</span> Resume
                                                </a>
                                                <a href={app.portfolio} target="_blank" rel="noreferrer" className={styles.link}>
                                                    <span className="material-symbols-outlined">link</span> Portfolio
                                                </a>
                                            </div>
                                            <div className={styles.itemActions}>
                                                {confirmDeleteId === app.id ? (
                                                    <div className={styles.confirmGroup}>
                                                        <button onClick={() => deleteApplication(app.id)} className={styles.deleteBtn}>Archive Now</button>
                                                        <button onClick={() => setConfirmDeleteId(null)} className={styles.cancelBtn}>No</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setConfirmDeleteId(app.id)} className={styles.deleteBtn}>Archive</button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
