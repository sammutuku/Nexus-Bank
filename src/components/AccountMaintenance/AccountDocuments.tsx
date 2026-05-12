import React, { useState } from 'react';
import SearchButton from '../shared/SearchModal/SearchButton';

const DOC_TYPES    = ['Original', 'Copy', 'Certified Copy'];
const DOC_CLASSES  = ['--Select--', 'KYC', 'Legal', 'Financial', 'Identity'];
const LOCATIONS    = ['--Select--', 'Head Office', 'Branch', 'Offsite Archive'];

interface DocRecord {
  documentId: string; documentTitle: string;
  documentType: string; documentClass: string;
  receivedBy: string; receivedDate: string;
  location: string; documentImage: string; remarks: string;
  // Audit
  createdBy: string; createdOn: string;
  modifiedBy: string; modifiedOn: string;
  supervisedBy: string; supervisedOn: string;
}

const INITIAL_DOC: DocRecord = {
  documentId: '', documentTitle: '',
  documentType: 'Original', documentClass: '',
  receivedBy: '', receivedDate: '',
  location: '', documentImage: '', remarks: '',
  createdBy: '', createdOn: '',
  modifiedBy: '', modifiedOn: '',
  supervisedBy: '', supervisedOn: '',
};

interface Props {
  clientName: string;
  accountId: string;
  onClose: () => void;
}

const AccountDocuments: React.FC<Props> = ({ clientName, accountId, onClose }) => {
  const [rec, setRec] = useState<DocRecord>({ ...INITIAL_DOC });
  const [toast, setToast] = useState<string | null>(null);

  const patch = (p: Partial<DocRecord>) => setRec(r => ({ ...r, ...p }));
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSave = () => {
    if (!rec.documentId.trim()) { showToast('Document ID is required'); return; }
    showToast('Document saved successfully');
  };

  return (
    <div className="ci-modal-overlay">
      <div className="ci-modal ci-modal--lg">

        <div className="ci-modal__header">
          <div className="ci-modal__title">
            <span className="ci-modal__title-icon">📄</span>
            Account Documents
            {accountId && <span className="ci-modal__subtitle"> — {accountId} : {clientName}</span>}
          </div>
          <button className="ci-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="ci-modal__body">
          <div className="ci-panel">
            <div className="ci-panel__header">Account Documents</div>
            <div className="ci-panel__body">
              <div className="am-form-grid">

                {/* Document ID + search */}
                <div className="am-field am-field--wide">
                  <label className="am-label am-label--req">Document ID</label>
                  <div className="am-input-group">
                    <input className="ci-input am-input-sm" value={rec.documentId}
                      onChange={e => patch({ documentId: e.target.value })} />
                    <input className="ci-input" value={rec.documentTitle}
                      onChange={e => patch({ documentTitle: e.target.value })}
                      placeholder="Document title" />
                    <SearchButton entityType="account" className="bk-header__search-btn"
                      onSelect={r => patch({ documentId: r.accountId, documentTitle: r.name })} />
                  </div>
                </div>

                {/* Document Type + Class */}
                <div className="am-field">
                  <label className="am-label am-label--req">Document Type</label>
                  <select className="ci-select" value={rec.documentType}
                    onChange={e => patch({ documentType: e.target.value })}>
                    {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="am-field">
                  <label className="am-label am-label--req">Document Class</label>
                  <select className="ci-select" value={rec.documentClass}
                    onChange={e => patch({ documentClass: e.target.value })}>
                    {DOC_CLASSES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Received By + Date */}
                <div className="am-field">
                  <label className="am-label am-label--req">Received By</label>
                  <input className="ci-input" value={rec.receivedBy}
                    onChange={e => patch({ receivedBy: e.target.value })} />
                </div>

                <div className="am-field">
                  <label className="am-label am-label--req">Received Date</label>
                  <select className="ci-select" value={rec.receivedDate}
                    onChange={e => patch({ receivedDate: e.target.value })}>
                    <option value="">--Select--</option>
                    <option>Today</option><option>Custom</option>
                  </select>
                </div>

                {/* Location */}
                <div className="am-field">
                  <label className="am-label">Location</label>
                  <select className="ci-select" value={rec.location}
                    onChange={e => patch({ location: e.target.value })}>
                    {LOCATIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Document Image */}
                <div className="am-field">
                  <label className="am-label">Document Image</label>
                  <div className="am-input-group">
                    <input className="ci-input" value={rec.documentImage} readOnly
                      placeholder="No file selected"
                      style={{ background: 'var(--bank-bg-alt)' }} />
                    <button className="ci-btn ci-btn--view ci-btn--sm"
                      onClick={() => showToast('File browse — connect to file input')}>
                      Browse
                    </button>
                  </div>
                </div>

                {/* Remarks */}
                <div className="am-field am-field--wide">
                  <label className="am-label">Remarks</label>
                  <input className="ci-input" value={rec.remarks}
                    onChange={e => patch({ remarks: e.target.value })} />
                </div>

              </div>
            </div>
          </div>

          {/* Audit */}
          <div className="ci-panel" style={{ marginTop: 10 }}>
            <div className="ci-panel__header">Additional Information</div>
            <div className="ci-panel__body">
              <div className="am-form-grid">
                {[
                  ['Created By', rec.createdBy], ['Modified By', rec.modifiedBy],   ['Supervised By', rec.supervisedBy],
                  ['Created On', rec.createdOn], ['Modified On', rec.modifiedOn],   ['Supervised On', rec.supervisedOn],
                ].map(([label, value]) => (
                  <div key={label} className="am-field">
                    <label className="am-label">{label}</label>
                    <span className="am-readonly">{value || '\u00A0'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ci-modal__footer">
          <div className="ci-modal-footer-btns">
            <button className="ci-btn ci-btn--view ci-btn--sm"
              onClick={() => showToast('Show Image — connect to image viewer')}>
              Show Image
            </button>
            <button className="ci-btn ci-btn--save" onClick={handleSave}>✔ Save</button>
            <button className="ci-btn ci-btn--cancel" onClick={onClose}>✕ Cancel</button>
          </div>
        </div>

      </div>
      {toast && <div className="ci-toast ci-toast--success">✔ {toast}</div>}
    </div>
  );
};

export default AccountDocuments;