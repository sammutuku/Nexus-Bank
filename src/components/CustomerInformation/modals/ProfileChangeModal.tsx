import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { TITLES, GENDERS, MONTHS, YEARS, CHANGED_REASONS, CLIENT_TYPES } from '../../../constants/customer.constants';
import type { ProfileChangeRecord } from '../../../types/customer.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rec: ProfileChangeRecord) => void;
  initial?: Partial<ProfileChangeRecord>;
  clientName?: string;
}

const LW = 150;
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

const blank: ProfileChangeRecord = {
  clientName: '', clientType: '', title: 'Mr',
  firstName: '', middleName: '', lastName: '',
  gender: 'Male', dateOfBirth: '', age: '', ageAsOn: '',
  documentsReceived: '', receivedOn: '',
  changedReason: '', remarks: '',
};

const ProfileChangeModal: React.FC<Props> = ({ isOpen, onClose, onSave, initial, clientName }) => {
  const [form, setForm] = useState<ProfileChangeRecord>({ ...blank, ...initial });
  const [viewHistory, setViewHistory] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setForm({ ...blank, ...initial });
    setEditing(false);
  }, [isOpen, initial]);

  const set = (k: keyof ProfileChangeRecord) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const footer = (
    <div className="bk-modal-footer-btns">
      {!editing
        ? <button className="bk-btn bk-btn--edit" onClick={() => setEditing(true)}>✎ Edit</button>
        : <>
            <button className="bk-btn bk-btn--cancel" onClick={() => setEditing(false)}>✕ Cancel</button>
            <button className="bk-btn bk-btn--save" onClick={() => { onSave(form); setEditing(false); onClose(); }}>✔ Save</button>
          </>
      }
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title="Client Profile Change" subtitle={clientName}
      icon="🔄" size="md" footer={footer}
    >
      <div className="bk-modal-section-header">Client Profile Changing</div>

      <Row label="Client Name">
        <input className="bk-input" value={form.clientName} readOnly
          style={{ background: 'var(--bank-bg-alt)' }} />
      </Row>

      <Row label="Client Type">
        <select className="bk-select" value={form.clientType} disabled={!editing}
          onChange={e => set('clientType')(e.target.value)}>
          <option value="">--Select--</option>
          {CLIENT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </Row>

      <div className="bk-form-grid">
        <div>
          <Row label="Title">
            <select className="bk-select" value={form.title} disabled={!editing}
              onChange={e => set('title')(e.target.value)}>
              {TITLES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Row>
          <Row label="Middle Name">
            <input className="bk-input" value={form.middleName} disabled={!editing}
              onChange={e => set('middleName')(e.target.value)} />
          </Row>
          <Row label="Gender">
            <select className="bk-select" value={form.gender} disabled={!editing}
              onChange={e => set('gender')(e.target.value)}>
              {GENDERS.map(g => <option key={g}>{g}</option>)}
            </select>
          </Row>
          <Row label="Age">
            <input className="bk-input" value={form.age} readOnly
              style={{ background: 'var(--bank-bg-alt)' }} />
          </Row>
        </div>
        <div>
          <Row label="First Name">
            <input className="bk-input" value={form.firstName} disabled={!editing}
              onChange={e => set('firstName')(e.target.value)} />
          </Row>
          <Row label="Last Name">
            <input className="bk-input" value={form.lastName} disabled={!editing}
              onChange={e => set('lastName')(e.target.value)} />
          </Row>
          <Row label="Date of Birth">
            <div className="bk-date-group">
              <select className="bk-select" value={form.dateOfBirth} disabled={!editing}
                onChange={e => set('dateOfBirth')(e.target.value)} style={{ minWidth: 68 }}>
                <option value="">--Month--</option>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
              <select className="bk-select" disabled={!editing} style={{ minWidth: 75 }}>
                <option value="">--Year--</option>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </Row>
          <Row label="Age As On">
            <select className="bk-select" value={form.ageAsOn} disabled={!editing}
              onChange={e => set('ageAsOn')(e.target.value)}>
              <option value="">--Select--</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </Row>
        </div>
      </div>

      <Row label="Documents Received">
        <input className="bk-input" value={form.documentsReceived} disabled={!editing}
          onChange={e => set('documentsReceived')(e.target.value)} />
      </Row>

      <Row label="Received On">
        <select className="bk-select" value={form.receivedOn} disabled={!editing}
          onChange={e => set('receivedOn')(e.target.value)}>
          <option value="">--Select--</option>
          {MONTHS.map(m => <option key={m}>{m}</option>)}
        </select>
      </Row>

      <Row label="Changed Reason" required>
        <select className="bk-select" value={form.changedReason} disabled={!editing}
          onChange={e => set('changedReason')(e.target.value)}>
          <option value="">--Select--</option>
          {CHANGED_REASONS.map(r => <option key={r}>{r}</option>)}
        </select>
      </Row>

      <Row label="Remarks">
        <textarea className="bk-textarea" rows={3} value={form.remarks} disabled={!editing}
          onChange={e => set('remarks')(e.target.value)} />
      </Row>

      {/* History toggle */}
      <div style={{ marginTop: 12 }}>
        <button className="bk-btn bk-btn--view bk-btn--sm"
          onClick={() => setViewHistory(v => !v)}>
          {viewHistory ? '▲ Hide History' : '▼ History'}
        </button>
      </div>

      {viewHistory && (
        <div className="bk-kin-table-wrapper" style={{ marginTop: 8 }}>
          <table className="bk-data-table">
            <thead>
              <tr>
                <th>Changed On</th>
                <th>Changed By</th>
                <th>Reason</th>
                <th>Previous Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} className="bk-table-empty">No history records found</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default ProfileChangeModal;
