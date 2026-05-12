import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { INITIAL_INTRODUCER } from '../../../constants/customer.constants';
import type { IntroducerRecord } from '../../../types/customer.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rec: IntroducerRecord) => void;
  initial?: IntroducerRecord;
  clientName?: string;
}

const LW = 160;
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

const IntroducerModal: React.FC<Props> = ({ isOpen, onClose, onSave, initial, clientName }) => {
  const [form, setForm] = useState<IntroducerRecord>(initial ?? INITIAL_INTRODUCER);
  const set = (k: keyof IntroducerRecord) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    setForm(initial ?? INITIAL_INTRODUCER);
  }, [isOpen, initial]);

  const footer = (
    <div className="bk-modal-footer-btns">
      <button className="bk-btn bk-btn--cancel" onClick={onClose}>✕ Cancel</button>
      <button className="bk-btn bk-btn--save" onClick={() => { onSave(form); onClose(); }}>✔ Save</button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title="Introducer Details" subtitle={clientName}
      icon="🤝" size="md" footer={footer}
    >
      <div className="bk-modal-section-header">Client Introducer</div>

      <Row label="Introducer Customer ID">
        <div className="bk-search-group">
          <input className="bk-input" style={{ width: 120 }} value={form.introducerCustomerId}
            onChange={e => set('introducerCustomerId')(e.target.value)} />
          <input className="bk-input" value={form.introducerName} placeholder="Name"
            onChange={e => set('introducerName')(e.target.value)} />
          <button className="bk-header__search-btn" title="Lookup introducer">🔍</button>
        </div>
      </Row>

      <Row label="Know Since">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input className="bk-input" style={{ width: 80 }} type="number" min="0"
            value={form.knowSince}
            onChange={e => set('knowSince')(e.target.value)} />
          <span className="bk-note">(Months)</span>
        </div>
      </Row>

      <Row label="Remarks">
        <textarea className="bk-textarea" rows={3} value={form.remarks}
          onChange={e => set('remarks')(e.target.value)} />
      </Row>

      <div className="bk-modal-section-header" style={{ marginTop: 16 }}>Additional Information</div>

      <Row label="Base Branch ID">
        <input className="bk-input" value={form.baseBranchId} readOnly
          style={{ background: 'var(--bank-bg-alt)' }} />
      </Row>

      <div className="bk-form-grid">
        <div>
          <Row label="Address 1">
            <input className="bk-input" value={form.address1} onChange={e => set('address1')(e.target.value)} />
          </Row>
          <Row label="City / Area">
            <input className="bk-input" value={form.cityArea} onChange={e => set('cityArea')(e.target.value)} />
          </Row>
          <Row label="Phone">
            <input className="bk-input" type="tel" value={form.phone} onChange={e => set('phone')(e.target.value)} />
          </Row>
          <Row label="Mobile">
            <input className="bk-input" type="tel" value={form.mobile} onChange={e => set('mobile')(e.target.value)} />
          </Row>
          <Row label="Gender">
            <input className="bk-input" value={form.gender} onChange={e => set('gender')(e.target.value)} />
          </Row>
        </div>
        <div>
          <Row label="Address 2">
            <input className="bk-input" value={form.address2} onChange={e => set('address2')(e.target.value)} />
          </Row>
          <Row label="Country Name">
            <input className="bk-input" value={form.countryName} onChange={e => set('countryName')(e.target.value)} />
          </Row>
          <Row label="Fax No">
            <input className="bk-input" value={form.faxNo} onChange={e => set('faxNo')(e.target.value)} />
          </Row>
          <Row label="Email ID">
            <input className="bk-input" type="email" value={form.emailId} onChange={e => set('emailId')(e.target.value)} />
          </Row>
          <Row label="Relation">
            <input className="bk-input" value={form.relation} onChange={e => set('relation')(e.target.value)} />
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default IntroducerModal;
