import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText, CreditCard, Briefcase, ShieldCheck, Quote,
  Receipt as ReceiptIcon, UserCheck, ClipboardList,
  Download, Eye, Settings, Menu, X, Plus, ChevronRight,
  Trash2, Palette, Type, Globe, CheckCircle, Banknote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES_CONFIG } from './constants/templates';
import logo from './assets/logo.png';
import _ from 'lodash';

const TEMPLATE_LIST = [
  { id: 'invoice', name: 'Invoice', icon: CreditCard },
  { id: 'quote', name: 'Project Quote', icon: Quote },
  { id: 'letter', name: 'Letter', icon: FileText },
  { id: 'nda', name: 'NDA', icon: ShieldCheck },
  { id: 'receipt', name: 'Receipt', icon: ReceiptIcon },
  { id: 'service_letter', name: 'Service Letter', icon: UserCheck },
  { id: 'sow', name: 'Statement of Work', icon: ClipboardList },
  { id: 'appointment', name: 'Appointment', icon: Briefcase },
  { id: 'payslip', name: 'Payslip', icon: Banknote },
];

const ACCENT_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Green', value: '#10b981' },
  { name: 'Grey', value: '#64748b' },
  { name: 'Black', value: '#0f172a' },
];

function App() {
  const [activeId, setActiveId] = useState('invoice');
  const [data, setData] = useState(TEMPLATES_CONFIG.invoice.initialData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('editor');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [fontFamily, setFontFamily] = useState('Outfit');
  const [zoom, setZoom] = useState(0.65); // Default zoom at 65% for better visibility
  const [toast, setToast] = useState(null);
  const iframeRef = useRef(null);

  const config = TEMPLATES_CONFIG[activeId];

  useEffect(() => {
    setData(TEMPLATES_CONFIG[activeId].initialData);
  }, [activeId]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const calculateTotals = (currentData) => {
    if (!currentData.items || !Array.isArray(currentData.items)) return currentData;
    const subtotal = currentData.items.reduce((sum, item) => {
      const rawAmount = String(item.amount || '0');
      const isNegative = rawAmount.includes('-') || rawAmount.toLowerCase().includes('discount');
      const numericPart = parseFloat(rawAmount.replace(/[^0-9.]/g, '')) || 0;
      const amount = isNegative ? -numericPart : numericPart;
      return sum + amount;
    }, 0);
    const taxPercent = parseFloat(String(currentData.tax).replace(/[^0-9.]/g, '')) || 0;
    const taxAmount = (subtotal * taxPercent) / 100;
    const total = subtotal + taxAmount;
    const firstAmount = currentData.items[0]?.amount || '$';
    const symbol = firstAmount.match(/[^0-9.]/)?.[0] || '$';
    const newData = _.cloneDeep(currentData);
    newData.subtotal = `${symbol}${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    newData.total = `${symbol}${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    if (currentData.tax !== undefined) {
      newData.tax_amount = `${symbol}${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }
    return newData;
  };

  const handleFieldChange = (path, value) => {
    let newData = _.cloneDeep(data);
    _.set(newData, path, value);
    if (path.startsWith('items') || path === 'tax') {
      newData = calculateTotals(newData);
    }
    setData(newData);
  };

  const addListItem = (path, fieldConfig) => {
    let newData = _.cloneDeep(data);
    const list = _.get(newData, path, []);
    const newItem = {};
    fieldConfig.fields.forEach(f => newItem[f.id] = '');
    list.push(newItem);
    _.set(newData, path, list);
    newData = calculateTotals(newData);
    setData(newData);
    showToast(`Added ${fieldConfig.label.toLowerCase().slice(0, -2)}`);
  };

  const removeListItem = (path, index) => {
    let newData = _.cloneDeep(data);
    const list = _.get(newData, path, []);
    const listLength = list.length;
    list.splice(index, 1);
    _.set(newData, path, list);
    newData = calculateTotals(newData);
    setData(newData);
    showToast("Item removed");
  };

  const renderedHtml = useMemo(() => {
    let html = config.html;
    const brandingStyles = `
      :root { --primary: ${accentColor}; --font-main: '${fontFamily}', sans-serif; }
      @page { size: A4; margin: 0; }
      body { margin: 0; padding: 0; width: 210mm; min-height: 297mm; overflow-x: hidden; }
      .page { width: 210mm; min-height: 297mm; margin: 0; box-shadow: none; overflow: hidden; }
      .badge { background: var(--primary) !important; }
      .footer-accent { background: var(--primary) !important; }
    `;
    html = `<style>${config.css}\n${brandingStyles}</style>\n${html}`;
    html = html.replace(/src="[^"]*l1s-logo\.png"/g, `src="${logo}"`);

    const replaceStrings = (obj, prefix = '') => {
      for (const key in obj) {
        const value = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          replaceStrings(value, path);
        } else if (Array.isArray(value)) {
          const regex = new RegExp(`{{#each ${path}}}([\\s\\S]*?){{/each}}`, 'g');
          html = html.replace(regex, (_, inner) => {
            return value.map(item => {
              let itemHtml = inner;
              for (const itemKey in item) {
                itemHtml = itemHtml.replace(new RegExp(`{{${itemKey}}}`, 'g'), item[itemKey]);
              }
              return itemHtml;
            }).join('');
          });
        } else {
          html = html.replace(new RegExp(`{{${path}}}`, 'g'), value);
          html = html.replace(new RegExp(`{{{${path}}}}`, 'g'), value);
        }
      }
    };
    replaceStrings(data);
    html = html.replace(/{{[\s\S]*?}}/g, '');
    return html;
  }, [activeId, data, accentColor, fontFamily]);

  return (
    <div className="studio-container" style={{ '--accent-primary': accentColor, '--accent-glow': `${accentColor}80` }}>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', borderRadius: '16px', background: 'rgba(13, 17, 23, 0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
            <CheckCircle size={18} color="#10b981" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <aside className={`sidebar glass flex flex-col p-8 ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', overflow: 'hidden' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `linear-gradient(135deg, ${accentColor}, #000)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 10px 20px ${accentColor}40` }}>
            <span style={{ fontWeight: 900, color: 'white', fontSize: '20px' }}>L1</span>
          </div>
          {sidebarOpen && (
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>layer1.studio</h1>
              <p style={{ fontSize: '9px', fontWeight: 900, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Branding Studio</p>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {TEMPLATE_LIST.map((tmpl) => (
            <button key={tmpl.id} onClick={() => setActiveId(tmpl.id)} className={`nav-item ${activeId === tmpl.id ? 'active' : ''}`}>
              <tmpl.icon size={18} style={{ color: activeId === tmpl.id ? accentColor : undefined }} />
              {sidebarOpen && <span>{tmpl.name}</span>}
            </button>
          ))}
        </nav>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-ghost" style={{ marginTop: '24px', padding: '12px' }}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </aside>

      <main className="h-full flex flex-col" style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <header className="panel-header glass" style={{ flexShrink: 0, flexWrap: 'nowrap', overflowX: 'auto', gap: '24px' }}>
          <div className="flex items-center gap-4 shrink-0">
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-white)' }}>
              <button onClick={() => setViewMode('editor')} className={`btn-ghost ${viewMode === 'editor' ? 'active' : ''}`} style={{ background: viewMode === 'editor' ? accentColor : 'transparent', color: viewMode === 'editor' ? 'white' : undefined, border: 'none', padding: '8px 16px' }}>Editor</button>
              <button onClick={() => setViewMode('design')} className={`btn-ghost ${viewMode === 'design' ? 'active' : ''}`} style={{ background: viewMode === 'design' ? accentColor : 'transparent', color: viewMode === 'design' ? 'white' : undefined, border: 'none', padding: '8px 16px' }}>Design</button>
            </div>
          </div>

          <div className="flex items-center gap-6" style={{ marginLeft: 'auto' }}>
            <button onClick={() => iframeRef.current?.contentWindow?.print()} className="btn-primary shrink-0" style={{ padding: '10px 20px' }}>
              <Download size={16} /> <span style={{ fontSize: '12px' }}>Export PDF</span>
            </button>
          </div>
        </header>

        <div className="flex overflow-hidden" style={{ flex: 1 }}>
          <div className="editor-panel glass" style={{ width: sidebarOpen ? '440px' : '500px' }}>
            <div className="p-8" style={{ borderBottom: '1px solid var(--border-white)', background: 'rgba(255,255,255,0.01)' }}>
              <h2 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: accentColor }}>
                {viewMode === 'editor' ? 'Document Content' : 'Branding Settings'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                {viewMode === 'editor' ? `Configure details for your ${activeId}.` : 'Customize the visual identity of your studio.'}
              </p>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', paddingBottom: '120px' }}>
              {viewMode === 'editor' ? (
                config.fields.map(field => (
                  <div key={field.id} className="field-group">
                    <label className="field-label">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea className="input-field" value={_.get(data, field.id) || ''} onChange={(e) => handleFieldChange(field.id, e.target.value)} />
                    ) : field.type === 'list' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {_.get(data, field.id, []).map((item, idx) => (
                          <div key={idx} className="list-card">
                            <button className="btn-delete" onClick={() => removeListItem(field.id, idx)}><Trash2 size={14} /></button>
                            {field.fields.map(sub => (
                              <input key={sub.id} className="input-field" style={{ border: 'none', borderBottom: '1px solid var(--border-white)', borderRadius: 0, padding: '10px 0', marginBottom: '4px', background: 'transparent' }} placeholder={sub.label} value={item[sub.id]} onChange={(e) => {
                                const list = [...data[field.id]];
                                list[idx][sub.id] = e.target.value;
                                handleFieldChange(field.id, list);
                              }} />
                            ))}
                          </div>
                        ))}
                        <button className="btn-ghost w-full" style={{ borderStyle: 'dashed', borderWidth: '2px', padding: '12px' }} onClick={() => addListItem(field.id, field)}>+ Add Item</button>
                      </div>
                    ) : (
                      <input className="input-field" value={_.get(data, field.id) || ''} onChange={(e) => handleFieldChange(field.id, e.target.value)} />
                    )}
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  <div>
                    <label className="field-label">Accent Color</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {ACCENT_COLORS.map(c => (
                        <button key={c.value} onClick={() => setAccentColor(c.value)} style={{ height: '60px', borderRadius: '12px', background: c.value, border: accentColor === c.value ? '4px solid white' : 'none', cursor: 'pointer', transition: 'all 0.2s' }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Typography</label>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setFontFamily('Outfit')} className={`nav-item ${fontFamily === 'Outfit' ? 'active' : ''}`}>Outfit (Modern Sans)</button>
                      <button onClick={() => setFontFamily('Playfair Display')} className={`nav-item ${fontFamily === 'Playfair Display' ? 'active' : ''}`}>Playfair (Classic Serif)</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', padding: '80px', overflow: 'auto', backgroundColor: '#000' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
            <div style={{
              position: 'relative',
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'transform 0.1s ease-out',
              boxShadow: `0 80px 100px -20px rgba(0,0,0,0.8), 0 0 100px ${accentColor}10`,
              marginBottom: '200px', // Extra bottom spacing for scaled content
              width: '210mm',
              height: '297mm',
              flexShrink: 0
            }}>
              <iframe ref={iframeRef} className="bg-white" style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }} srcDoc={renderedHtml} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
