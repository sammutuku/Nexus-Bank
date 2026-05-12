import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { ADDRESS_TYPES, INITIAL_ADDRESS } from '../../../constants/customer.constants';
import type { AddressRecord, AddressType } from '../../../types/customer.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addr: AddressRecord) => void;
  onDelete?: (id: string) => void;
  initial?: AddressRecord;
  clientName?: string;
}

const LW = 140;
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

const AddressModal: React.FC<Props> = ({ isOpen, onClose, onSave, onDelete, initial, clientName }) => {
  const [form, setForm] = useState<AddressRecord>(initial ?? INITIAL_ADDRESS);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressRecord, string>>>({});

  useEffect(() => {
    setForm(initial ?? { ...INITIAL_ADDRESS, id: String(Date.now()) });
    setErrors({});
  }, [isOpen, initial]);

  const set = (k: keyof AddressRecord) => (v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.addressType) e.addressType = 'Required';
    if (!form.address1.trim()) e.address1 = 'Address line 1 is required';
    if (!form.countryId) e.countryId = 'Country is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
    onClose();
  };

  const footer = (
    <div className="bk-modal-footer-btns">
      {initial?.id && onDelete && (
        <button className="bk-btn bk-btn--danger" onClick={() => { onDelete(form.id); onClose(); }}>
          🗑 Delete
        </button>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button className="bk-btn bk-btn--cancel" onClick={onClose}>✕ Cancel</button>
        <button className="bk-btn bk-btn--save" onClick={handleSave}>✔ Save</button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title="Client Address" subtitle={clientName}
      icon="📍" size="md" footer={footer}
    >
      <Row label="Address Type" required>
        <select className="bk-select" value={form.addressType}
          onChange={e => set('addressType')(e.target.value as AddressType)}>
          {ADDRESS_TYPES.map(a => <option key={a}>{a}</option>)}
        </select>
        {errors.addressType && <div className="bk-text-required bk-text-sm">{errors.addressType}</div>}
      </Row>

      <Row label="Address #1" required>
        <input className="bk-input" value={form.address1}
          onChange={e => set('address1')(e.target.value)} />
        {errors.address1 && <div className="bk-text-required bk-text-sm">{errors.address1}</div>}
      </Row>

      <Row label="Address #2">
        <input className="bk-input" value={form.address2}
          onChange={e => set('address2')(e.target.value)} />
      </Row>

      <Row label="Land Mark">
        <input className="bk-input" value={form.landmark}
          onChange={e => set('landmark')(e.target.value)} />
      </Row>

      <Row label="City / Area" required>
        <div className="bk-search-group">
          <input className="bk-input" style={{ width: 60 }} value={form.cityAreaId}
            onChange={e => set('cityAreaId')(e.target.value)} placeholder="Code" />
          <input className="bk-input" value={form.cityAreaName}
            onChange={e => set('cityAreaName')(e.target.value)} placeholder="City / Area name" />
          <button className="bk-header__search-btn" title="Search city">🔍</button>
        </div>
      </Row>

      <Row label="Country" required>
        <div className="bk-search-group">
          <input className="bk-input" style={{ width: 60 }} value={form.countryId}
            onChange={e => set('countryId')(e.target.value)} placeholder="Code" />
          <input className="bk-input" value={form.countryName}
            onChange={e => set('countryName')(e.target.value)} placeholder="Country name" />
          <button className="bk-header__search-btn" title="Search country">🔍</button>
        </div>
        {errors.countryId && <div className="bk-text-required bk-text-sm">{errors.countryId}</div>}
      </Row>

      <div className="bk-form-grid" style={{ gap: 0 }}>
        <div>
          <Row label="Phone #1">
            <input className="bk-input" type="tel" value={form.phone1}
              onChange={e => set('phone1')(e.target.value)} />
          </Row>
          <Row label="Mobile" required>
            <input className="bk-input" type="tel" value={form.mobile}
              onChange={e => set('mobile')(e.target.value)} />
          </Row>
          <Row label="Email ID">
            <input className="bk-input" type="email" value={form.emailId}
              onChange={e => set('emailId')(e.target.value)} />
          </Row>
        </div>
        <div>
          <Row label="Phone #2">
            <input className="bk-input" type="tel" value={form.phone2}
              onChange={e => set('phone2')(e.target.value)} />
          </Row>
          <Row label="Fax No">
            <input className="bk-input" value={form.faxNo}
              onChange={e => set('faxNo')(e.target.value)} />
          </Row>
          <Row label="Zip Code">
            <input className="bk-input" value={form.zipCode}
              onChange={e => set('zipCode')(e.target.value)} />
          </Row>
        </div>
      </div>

      <Row label="Communication">
        <label className="bk-checkbox-wrapper">
          <input type="checkbox" className="bk-checkbox"
            checked={form.isCommunicationAddress}
            onChange={e => set('isCommunicationAddress')(e.target.checked)} />
          <span style={{ marginLeft: 6 }}>Use as communication address</span>
        </label>
      </Row>
    </Modal>
  );
};

export default AddressModal;
