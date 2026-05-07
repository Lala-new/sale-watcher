import React, { useState, useEffect } from 'react';
import './EditModal.css';

export default function EditModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', url: '', size: '', originalPrice: '', targetPrice: '', notes: '', imageUrl: '',
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        url: item.url || '',
        size: item.size || '',
        originalPrice: item.originalPrice || '',
        targetPrice: item.targetPrice || '',
        notes: item.notes || '',
        imageUrl: item.imageUrl || '',
      });
    }
  }, [item]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.url.trim()) return;
    onSave({
      ...item,
      name: form.name.trim() || item.name,
      url: form.url.trim(),
      size: form.size.trim(),
      originalPrice: parseFloat(form.originalPrice) || item.originalPrice || null,
      targetPrice: parseFloat(form.targetPrice) || null,
      notes: form.notes.trim(),
      imageUrl: form.imageUrl.trim() || item.imageUrl || null,
    });
    onClose();
  };

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit item</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="mfield full">
            <label>Product URL <span className="req">*</span></label>
            <input type="url" value={form.url} onChange={e => set('url', e.target.value)} />
          </div>

          <div className="mfield full">
            <label>Product name</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div className="mfield-row">
            <div className="mfield">
              <label>Size / variant</label>
              <input type="text" placeholder="e.g. US 10, M..." value={form.size} onChange={e => set('size', e.target.value)} />
            </div>
            <div className="mfield">
              <label>Current price ($)</label>
              <input type="number" step="0.01" min="0" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} />
            </div>
          </div>

          <div className="mfield-row">
            <div className="mfield">
              <label>Target price ($)</label>
              <input type="number" step="0.01" min="0" placeholder="Alert me when below..." value={form.targetPrice} onChange={e => set('targetPrice', e.target.value)} />
            </div>
            <div className="mfield">
              <label>Image URL <span className="opt">optional override</span></label>
              <input type="url" placeholder="https://..." value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} />
            </div>
          </div>

          <div className="mfield full">
            <label>Notes</label>
            <input type="text" placeholder="e.g. Birthday gift, wait for 30% off..." value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-save" onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}
