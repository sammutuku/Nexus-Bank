import React, { useState } from 'react';

interface AccountNotesProps {
  branchId: string;
  accountNumber: string;
  clientName: string;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

interface NoteEntry {
  id: number;
  text: string;
  createdBy: string;
  createdOn: string;
  supervisedBy: string;
  supervisedOn: string;
}

const SAMPLE_NOTES: NoteEntry[] = [
  {
    id: 1,
    text: 'Client requested account details update. Address verified against National ID.',
    createdBy: 'KAO106',
    createdOn: '15/Sep/2016',
    supervisedBy: 'MIG',
    supervisedOn: '15/Sep/2016',
  },
  {
    id: 2,
    text: 'Dormancy review completed. Account reactivated following client visit to branch.',
    createdBy: 'KAO106',
    createdOn: '03/Feb/2024',
    supervisedBy: 'SYS',
    supervisedOn: '04/Feb/2024',
  },
];

const AccountNotes: React.FC<AccountNotesProps> = ({
  branchId, accountNumber, clientName, onClose, showToast,
}) => {
  const [notes, setNotes]         = useState<NoteEntry[]>(SAMPLE_NOTES);
  const [newText, setNewText]     = useState('');
  const [editId, setEditId]       = useState<number | null>(null);
  const [editText, setEditText]   = useState('');
  const [selected, setSelected]   = useState<number | null>(null);

  const title = `Account Notes — ${branchId} : ${accountNumber} : ${clientName}`;

  const handleSave = () => {
    if (!newText.trim()) { showToast('Note text cannot be empty', 'error'); return; }
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setNotes(prev => [...prev, {
      id: Date.now(),
      text: newText.trim(),
      createdBy: 'CURRENT USER',
      createdOn: now,
      supervisedBy: '',
      supervisedOn: '',
    }]);
    setNewText('');
    showToast('Note saved successfully');
  };

  const startEdit = (note: NoteEntry) => {
    setEditId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) { showToast('Note text cannot be empty', 'error'); return; }
    setNotes(prev => prev.map(n => n.id === editId ? { ...n, text: editText.trim() } : n));
    setEditId(null);
    setEditText('');
    showToast('Note updated');
  };

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selected === id) setSelected(null);
    showToast('Note deleted');
  };

  const selectedNote = notes.find(n => n.id === selected) ?? null;

  return (
    <div className="bk-modal-overlay">
      <div className="bk-modal bk-modal--lg">

        {/* Header */}
        <div className="bk-modal__header">
          <div className="bk-modal__title">
            <span className="bk-modal__title-icon">📝</span>
            {title}
          </div>
          <button className="bk-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="bk-modal__body" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Existing notes list */}
          {notes.length > 0 && (
            <div style={{ border: '1px solid var(--bank-border)', borderRadius: 4, overflow: 'auto', maxHeight: 220 }}>
              <table className="bk-data-table">
                <thead>
                  <tr>
                    <th className="bk-th" style={{ width: 36 }}>#</th>
                    <th className="bk-th">Note</th>
                    <th className="bk-th" style={{ width: 90 }}>Created By</th>
                    <th className="bk-th" style={{ width: 100 }}>Created On</th>
                    <th className="bk-th" style={{ width: 70 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note, i) => (
                    <tr
                      key={note.id}
                      className={selected === note.id ? 'bk-row--selected' : i % 2 === 1 ? 'bk-row--alt' : ''}
                      onClick={() => setSelected(note.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="bk-td bk-cell--number">{i + 1}</td>
                      <td className="bk-td" style={{ fontSize: 11 }}>
                        {editId === note.id
                          ? <input
                              className="bk-input"
                              style={{ width: '100%', fontSize: 11 }}
                              value={editText}
                              autoFocus
                              onChange={e => setEditText(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditId(null); }}
                            />
                          : note.text
                        }
                      </td>
                      <td className="bk-td" style={{ fontSize: 11 }}>{note.createdBy}</td>
                      <td className="bk-td" style={{ fontSize: 11 }}>{note.createdOn}</td>
                      <td className="bk-td">
                        <div style={{ display: 'flex', gap: 4 }}>
                          {editId === note.id
                            ? <>
                                <button
                                  className="bk-btn bk-btn--sm bk-btn--save"
                                  title="Save edit"
                                  onClick={e => { e.stopPropagation(); saveEdit(); }}
                                >✔</button>
                                <button
                                  className="bk-btn bk-btn--sm bk-btn--cancel"
                                  title="Cancel edit"
                                  onClick={e => { e.stopPropagation(); setEditId(null); }}
                                >✕</button>
                              </>
                            : <>
                                <button
                                  className="bk-btn bk-btn--sm bk-btn--view"
                                  title="Edit note"
                                  onClick={e => { e.stopPropagation(); startEdit(note); }}
                                >✎</button>
                                <button
                                  className="bk-btn bk-btn--sm bk-btn--close"
                                  title="Delete note"
                                  onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                                >🗑</button>
                              </>
                          }
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* New note entry */}
          <div className="bk-panel">
            <div className="bk-panel__header">Add New Note</div>
            <div className="bk-panel__body">
              <textarea
                className="bk-textarea"
                rows={4}
                placeholder="Enter account note here…"
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                value={newText}
                onChange={e => setNewText(e.target.value)}
              />
            </div>
          </div>

          {/* Audit trail for selected note */}
          {selectedNote && (
            <div className="bk-panel">
              <div className="bk-panel__header">Audit Information</div>
              <div className="bk-panel__body">
                <div className="bk-audit__grid">
                  <div className="bk-audit__row">
                    <span className="bk-audit__label">Created By</span>
                    <span className="bk-audit__value">{selectedNote.createdBy}</span>
                    <span className="bk-audit__label">Created On</span>
                    <span className="bk-audit__value">{selectedNote.createdOn}</span>
                    <span className="bk-audit__label">Supervised By</span>
                    <span className="bk-audit__value">{selectedNote.supervisedBy}</span>
                    <span className="bk-audit__label">Supervised On</span>
                    <span className="bk-audit__value">{selectedNote.supervisedOn}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bk-modal__footer">
          <div className="bk-modal-footer-btns">
            <button className="bk-btn bk-btn--save" onClick={handleSave}>✔ Save Note</button>
            <button className="bk-btn bk-btn--cancel" onClick={onClose}>✕ Cancel</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AccountNotes;
