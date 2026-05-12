import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { INITIAL_KIN, RELATIONS, TITLES, GENDERS, MONTHS } from '../../../constants/customer.constants';
import type { NextOfKinRecord, Gender, RelationType } from '../../../types/customer.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rec: NextOfKinRecord) => void;
  kinList: NextOfKinRecord[];
  clientName?: string;
  onRemove: (id: string) => void;
}

const LW = 120;
const Row: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({
  label, required, children,
}) => (
  <div className="bk-form-row">
    <label className={`bk-form-label ${required ? 'bk-form-label--required' : ''}`}
      style={{ width: LW, minWidth: LW }}>
      {label}{required && <span className="bk-text-required"> *</span>}
    </label>
    <div className="bk-form-control">{children}</div>
  </div>
);

const NextOfKinModal: React.FC<Props> = ({ isOpen, onClose, onSave, kinList, clientName, onRemove }) => {
  const [form, setForm] = useState<NextOfKinRecord>({ ...INITIAL_KIN, id: String(Date.now()) });
  const [editing, setEditing] = useState<string | null>(null);

  const set = (k: keyof NextOfKinRecord) => (v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const clearForm = () => {
    setForm({ ...INITIAL_KIN, id: String(Date.now()) });
    setEditing(null);
  };

  useEffect(() => { if (isOpen) clearForm(); }, [isOpen]);

  const handleAdd = () => {
    onSave(form);
    clearForm();
  };

  const handleAlter = (rec: NextOfKinRecord) => {
    setForm(rec);
    setEditing(rec.id);
  };

  const handleUpdate = () => {
    onSave(form);
    clearForm();
  };

  const footer = (
    <div className="bk-modal-footer-btns">
      <button className="bk-btn bk-btn--cancel" onClick={onClose}>Close</button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title="Next of Kin / Relation" subtitle={clientName}
      icon="👥" size="lg" footer={footer}
    >
      <div className="bk-modal-section-header">Client Relation</div>

      <Row label="Existing Client">
        <label className="bk-checkbox-wrapper">
          <input type="checkbox" className="bk-checkbox"
            checked={form.isExistingClient}
            onChange={e => set('isExistingClient')(e.target.checked)} />
          <span style={{ marginLeft: 6 }}>Is an existing client</span>
        </label>
      </Row>

      {form.isExistingClient && (
        <Row label="Client ID">
          <div className="bk-search-group">
            <input className="bk-input" value={form.clientId}
              onChange={e => set('clientId')(e.target.value)} />
            <button className="bk-header__search-btn" title="Lookup client">🔍</button>
          </div>
        </Row>
      )}

      <div className="bk-modal-section-header" style={{ marginTop: 8 }}>Personal Details</div>

      <Row label="Name" required>
        <div className="bk-search-group">
          <select className="bk-select" style={{ minWidth: 70 }} value={form.titlePrefix}
            onChange={e => set('titlePrefix')(e.target.value)}>
            {TITLES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input className="bk-input" value={form.name}
            onChange={e => set('name')(e.target.value)} placeholder="Full name" />
        </div>
      </Row>

      <Row label="Address">
        <input className="bk-input" value={form.address}
          onChange={e => set('address')(e.target.value)} />
      </Row>

      <div className="bk-form-grid">
        <div>
          <Row label="Phone">
            <input className="bk-input" type="tel" value={form.phone}
              onChange={e => set('phone')(e.target.value)} />
          </Row>
          <Row label="Email ID">
            <input className="bk-input" type="email" value={form.emailId}
              onChange={e => set('emailId')(e.target.value)} />
          </Row>
          <Row label="Gender">
            <select className="bk-select" value={form.gender}
              onChange={e => set('gender')(e.target.value as Gender)}>
              {GENDERS.map(g => <option key={g}>{g}</option>)}
            </select>
          </Row>
          <Row label="Age">
            <input className="bk-input" type="number" min="0" value={form.age}
              onChange={e => set('age')(e.target.value)} />
          </Row>
        </div>
        <div>
          <Row label="Mobile">
            <input className="bk-input" type="tel" value={form.mobile}
              onChange={e => set('mobile')(e.target.value)} />
          </Row>
          <Row label="Date of Birth">
            <div className="bk-date-group">
              <select className="bk-select" value={form.dobMonth}
                onChange={e => set('dobMonth')(e.target.value)} style={{ minWidth: 60 }}>
                <option value="">MM</option>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
              <input className="bk-input" type="number" min="1900" max="2099"
                value={form.dobYear} placeholder="YYYY"
                onChange={e => set('dobYear')(e.target.value)} style={{ width: 72 }} />
            </div>
          </Row>
          <Row label="Age As On">
            <select className="bk-select" value={form.ageAsOn}
              onChange={e => set('ageAsOn')(e.target.value)}>
              <option value="">--Select--</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </Row>
        </div>
      </div>

      <Row label="Relation" required>
        <select className="bk-select" value={form.relation}
          onChange={e => set('relation')(e.target.value as RelationType)}>
          {RELATIONS.map(r => <option key={r}>{r}</option>)}
        </select>
      </Row>

      <Row label="Remarks">
        <textarea className="bk-textarea" rows={2} value={form.remarks}
          onChange={e => set('remarks')(e.target.value)} />
      </Row>

      {/* Action row */}
      <div className="bk-kin-action-row">
        <button className="bk-btn bk-btn--add bk-btn--sm" onClick={clearForm}>New</button>
        {editing
          ? <button className="bk-btn bk-btn--save bk-btn--sm" onClick={handleUpdate}>Update</button>
          : <button className="bk-btn bk-btn--save bk-btn--sm" onClick={handleAdd}>Add</button>
        }
        <button className="bk-btn bk-btn--cancel bk-btn--sm" onClick={clearForm}>Clear</button>
      </div>

      {/* Kin list table */}
      <div className="bk-kin-table-wrapper">
        <table className="bk-data-table">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Relation</th>
              <th>Remarks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {kinList.length === 0
              ? <tr><td colSpan={5} className="bk-table-empty">There are no items to be displayed</td></tr>
              : kinList.map(k => (
                  <tr key={k.id} className={editing === k.id ? 'bk-row--selected' : ''}>
                    <td>{k.clientId || '—'}</td>
                    <td>{k.name}</td>
                    <td>{k.relation}</td>
                    <td>{k.remarks}</td>
                    <td>
                      <button className="bk-btn bk-btn--sm bk-btn--edit" onClick={() => handleAlter(k)}>✎</button>
                      <button className="bk-btn bk-btn--sm bk-btn--danger" onClick={() => onRemove(k.id)}>🗑</button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default NextOfKinModal;
