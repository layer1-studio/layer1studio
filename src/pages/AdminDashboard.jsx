import React, { useState } from 'react';
import { useContent } from '../hooks/useContent';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const { data: projects, addItem: addProject, deleteItem: deleteProject, updateItem: updateProject } = useContent('projects');
    const { data: careers, addItem: addCareer, deleteItem: deleteCareer, updateItem: updateCareer } = useContent('careers');
    const { data: applications, deleteItem: deleteApplication, updateItem: updateApplication } = useContent('applications');
    const navigate = useNavigate();

    // UI States
    const [showArchived, setShowArchived] = useState(false);
    const [expandedJobId, setExpandedJobId] = useState(null);
    const [appSearchQuery, setAppSearchQuery] = useState('');
    const [appStatusFilter, setAppStatusFilter] = useState('Active');
    const [editingProject, setEditingProject] = useState(null);
    const [editingCareer, setEditingCareer] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [newProject, setNewProject] = useState({ title: '', category: '', text: '', tags: '', image: '' });
    const [newCareer, setNewCareer] = useState({ title: '', location: '', salary: '', type: '', about: '', responsibilities: '', requirements: '', whatYoullGain: '' });
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const compressed = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressed);
                };
            };
        });
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handleImageUpload = async (e, isEdit = false) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadStatus('Compressing & processing image...');

        try {
            const compressedUrl = await compressImage(file);

            // Check final size (Firestore 1MB limit on entire doc, so let's aim for ~800KB for the image)
            const sizeInBytes = Math.ceil(((compressedUrl.length - 'data:image/jpeg;base64,'.length) * 3) / 4);
            if (sizeInBytes > 1000000) {
                setUploadStatus('Image still too large after compression. Try a smaller file.');
                return;
            }

            if (isEdit) {
                setEditingProject({ ...editingProject, image: compressedUrl });
            } else {
                setNewProject({ ...newProject, image: compressedUrl });
            }
            setUploadStatus('Image processed successfully!');
        } catch (error) {
            console.error("Processing failed:", error);
            setUploadStatus('Processing failed.');
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
        setNewCareer({ title: '', location: '', salary: '', type: '', about: '', responsibilities: '', requirements: '', whatYoullGain: '' });
    };

    const handleUpdateCareer = (e) => {
        e.preventDefault();
        updateCareer(editingCareer.id, editingCareer);
        setEditingCareer(null);
    };

    const handleUpdateStatus = (id, status) => {
        updateApplication(id, { status });
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
            app.jobTitle.toLowerCase().includes(appSearchQuery.toLowerCase());

        const statusMatch = appStatusFilter === 'All' ||
            (appStatusFilter === 'Active' && app.status !== 'Rejected') ||
            (app.status || 'New') === appStatusFilter;

        return matchesSearch && statusMatch;
    });

    return (
        <div className={styles.dashboard}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h1 className={styles.title}>Studio <span>Manager</span></h1>
                        <div className={styles.headerActions}>
                            <a
                                href="https://layer1-studio.github.io/l1s-branding-templates/"
                                target="_blank"
                                rel="noreferrer"
                                className={styles.secondaryBtn}
                            >
                                <span className="material-symbols-outlined">description</span>
                                Letterheads & Invoices
                            </a>
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                <span className="material-symbols-outlined">logout</span>
                                Logout
                            </button>
                        </div>
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
                                    <label className={styles.fieldLabel}>About the Role</label>
                                    <textarea placeholder="Brief overview of the role and your company context..." value={editingCareer.about || ''} onChange={e => setEditingCareer({ ...editingCareer, about: e.target.value })} />
                                    <label className={styles.fieldLabel}>Responsibilities (one per line)</label>
                                    <textarea placeholder="Identify potential clients\nConduct market research\nSupport outreach efforts..." value={editingCareer.responsibilities || ''} onChange={e => setEditingCareer({ ...editingCareer, responsibilities: e.target.value })} />
                                    <label className={styles.fieldLabel}>Requirements (one per line)</label>
                                    <textarea placeholder="Degree in Business or Marketing\nStrong communication skills..." value={editingCareer.requirements || ''} onChange={e => setEditingCareer({ ...editingCareer, requirements: e.target.value })} />
                                    <label className={styles.fieldLabel}>What You'll Gain (one per line)</label>
                                    <textarea placeholder="Hands-on experience in client acquisition\nExposure to business development strategy..." value={editingCareer.whatYoullGain || ''} onChange={e => setEditingCareer({ ...editingCareer, whatYoullGain: e.target.value })} />
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
                                    <label className={styles.fieldLabel}>About the Role</label>
                                    <textarea placeholder="Brief overview of the role and your company context..." value={newCareer.about} onChange={e => setNewCareer({ ...newCareer, about: e.target.value })} />
                                    <label className={styles.fieldLabel}>Responsibilities (one per line)</label>
                                    <textarea placeholder="Identify potential clients&#10;Conduct market research&#10;Support outreach efforts..." value={newCareer.responsibilities} onChange={e => setNewCareer({ ...newCareer, responsibilities: e.target.value })} />
                                    <label className={styles.fieldLabel}>Requirements (one per line)</label>
                                    <textarea placeholder="Degree in Business or Marketing&#10;Strong communication skills..." value={newCareer.requirements} onChange={e => setNewCareer({ ...newCareer, requirements: e.target.value })} />
                                    <label className={styles.fieldLabel}>What You'll Gain (one per line)</label>
                                    <textarea placeholder="Hands-on experience in client acquisition&#10;Exposure to business development strategy..." value={newCareer.whatYoullGain} onChange={e => setNewCareer({ ...newCareer, whatYoullGain: e.target.value })} />
                                    <button type="submit">Post Job</button>
                                </form>
                            )}

                            <div className={styles.list}>
                                <h3>Open Roles</h3>
                                {careers.map(c => (
                                    <div key={c.id} className={styles.jobItemContainer}>
                                        <div className={styles.item} onClick={() => setExpandedJobId(expandedJobId === c.id ? null : c.id)}>
                                            <div className={styles.itemInfo}>
                                                <h4>{c.title}</h4>
                                                <p>{c.location} • {c.type}</p>
                                            </div>
                                            <div className={styles.itemActions}>
                                                <button onClick={(e) => { e.stopPropagation(); setExpandedJobId(expandedJobId === c.id ? null : c.id); }} className={styles.viewBtn}>
                                                    <span className="material-symbols-outlined">
                                                        {expandedJobId === c.id ? 'expand_less' : 'expand_more'}
                                                    </span>
                                                </button>
                                                {confirmDeleteId === c.id ? (
                                                    <div className={styles.confirmGroup}>
                                                        <span className={styles.confirmLabel}>Really delete?</span>
                                                        <button onClick={(e) => { e.stopPropagation(); deleteCareer(c.id); }} className={styles.deleteBtn}>Delete</button>
                                                        <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} className={styles.cancelBtn}>Cancel</button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); setEditingCareer(c); }} className={styles.editBtn}>Edit</button>
                                                        <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(c.id); }} className={styles.deleteBtn}>Delete</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {expandedJobId === c.id && (
                                            <div className={styles.jobPreview}>
                                                {c.about && <><h5>About</h5><p className={styles.previewText}>{c.about}</p></>}
                                                {c.responsibilities && <><h5>Responsibilities</h5><p className={styles.previewText}>{c.responsibilities}</p></>}
                                                {c.requirements && <><h5>Requirements</h5><p className={styles.previewText}>{c.requirements}</p></>}
                                                {c.whatYoullGain && <><h5>What You'll Gain</h5><p className={styles.previewText}>{c.whatYoullGain}</p></>}
                                                {!c.about && c.description && <><h5>Description</h5><p className={styles.previewText}>{c.description}</p></>}
                                                {c.salary && <p className={styles.previewMeta}><strong>Salary:</strong> {c.salary}</p>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>Candidate Applications</h3>
                                <div className={styles.advancedFilters}>
                                    <div className={styles.searchWrapper}>
                                        <span className="material-symbols-outlined">search</span>
                                        <input
                                            type="text"
                                            placeholder="Search name or role..."
                                            value={appSearchQuery}
                                            onChange={(e) => setAppSearchQuery(e.target.value)}
                                            className={styles.searchInput}
                                        />
                                    </div>
                                    <div className={styles.statusFilterGroup}>
                                        <select
                                            value={appStatusFilter}
                                            onChange={(e) => setAppStatusFilter(e.target.value)}
                                            className={styles.statusFilterSelect}
                                        >
                                            <option value="Active">Active Only</option>
                                            <option value="All">All Applicants</option>
                                            <option value="New">New</option>
                                            <option value="Viewed">Viewed</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Rejected">Archived</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.list}>
                                {filteredApplications.length === 0 ? (
                                    <p className={styles.emptyMsg}>
                                        {showArchived ? 'No archived applications.' : 'No active applications yet.'}
                                    </p>
                                ) : (
                                    filteredApplications.map(app => (
                                        <div key={app.id} className={`${styles.appCard} ${styles[app.status?.toLowerCase() || 'new']}`}>
                                            <div className={styles.appHeader}>
                                                <div className={styles.appMainInfo}>
                                                    <h4>{app.name}</h4>
                                                    <span className={styles.roleTag}>{app.jobTitle}</span>
                                                </div>
                                                <div className={styles.statusBadge}>
                                                    <select
                                                        value={app.status || 'New'}
                                                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                                        className={styles.statusSelect}
                                                    >
                                                        <option value="New">New</option>
                                                        <option value="Viewed">Viewed</option>
                                                        <option value="Interview">Interview</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <p className={styles.appEmail}>{app.email}</p>
                                            <div className={styles.appLinks}>
                                                <a href={app.resumeData || app.resumeUrl} target="_blank" rel="noreferrer" download={app.resumeData ? `${app.name}_Resume` : undefined} className={styles.link}>
                                                    <span className="material-symbols-outlined">description</span> Resume
                                                </a>
                                                {app.portfolio && (
                                                    <a href={app.portfolio} target="_blank" rel="noreferrer" className={styles.link}>
                                                        <span className="material-symbols-outlined">link</span> Portfolio
                                                    </a>
                                                )}
                                            </div>
                                            <div className={styles.itemActions}>
                                                {confirmDeleteId === app.id ? (
                                                    <div className={styles.confirmGroup}>
                                                        <span className={styles.confirmLabel}>Permanent delete?</span>
                                                        <button onClick={() => deleteApplication(app.id)} className={styles.deleteBtn}>Yes, Delete</button>
                                                        <button onClick={() => setConfirmDeleteId(null)} className={styles.cancelBtn}>Cancel</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setConfirmDeleteId(app.id)} className={styles.deleteBtn}>Delete permanently</button>
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
