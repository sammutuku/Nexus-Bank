import React, { useState } from 'react';

const BLOCK_REASONS = ['--Select--', 'Legal Hold', 'Fraud Suspicion', 'Customer Request', 'Dormant', 'Court Order'];

interface BehindScene {
  previousStatus: string; date: string;
  reasonId: string; description: string;
  instructionGivenBy: string;
  createdBy: string; createdOn: string;
  supervisedBy: string; supervisedOn: string;
}

interface Props {
  clientName: string;
  accountId: string;
  onClose: () => void;
  onSave: () => void;
}

const AccountBlockUnblock: React.FC<Props> = ({ clientName, accountId, onClose, onSave }) => {
  const [reason, setReason]      = useState('');
  const [description, setDesc]   = useState('');
  const [instructedBy, setInst]  = useState('');
  const [toast, setToast]        = useState<string | null>(null);

  const behind: BehindScene = {
    previousStatus: '', date: '', reasonId: '',
    description: '', instructionGivenBy: '',
    createdBy: '', createdOn: '', supervisedBy: '', supervisedOn: '',
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSave = () => {
    if (!reason || reason === '--Select--') { showToast('Reason is required'); return; }
    if (!instructedBy.trim())              { showToast('Instruction Given By is required'); return; }
    showToast('Block/Unblock instruction saved');
    setTimeout(onSave, 800);
  };

  return (
    <div className="bk-modal-overlay">
      <div className="bk-modal bk-modal--md">

        <div className="bk-modal__header">
          <div className="bk-modal__title">
            <span className="bk-modal__title-icon">🔒</span>
            Blocking / Unblocking
            {accountId && <span className="bk-modal__subtitle"> — {accountId} : {clientName}</span>}
          </div>
          <button className="bk-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="bk-modal__body">

          {/* Main fields */}
          <div className="bk-panel">
            <div className="bk-panel__body">
              <div className="am-form-grid">

                <div className="am-field am-field--wide">
                  <label className="am-label am-label--req">Reason</label>
                  <select className="bk-select" value={reason} onChange={e => setReason(e.target.value)}>
                    {BLOCK_REASONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>

                <div className="am-field am-field--wide">
                  <label className="am-label">Description</label>
                  <input className="bk-input" value={description}
                    onChange={e => setDesc(e.target.value)} />
                </div>

                <div className="am-field am-field--wide">
                  <label className="am-label am-label--req">Instruction Given By</label>
                  <input className="bk-input" value={instructedBy}
                    onChange={e => setInst(e.target.value)} />
                </div>

              </div>
            </div>
          </div>

          {/* Behind The Scene — read-only audit trail */}
          <div className="bk-panel" style={{ marginTop: 10 }}>
            <div className="bk-panel__header">Behind The Scene</div>
            <div className="bk-panel__body">
              <div className="am-form-grid">
                {[
                  ['Previous Status',    behind.previousStatus],
                  ['Date',               behind.date],
                  ['Reason ID',          behind.reasonId],
                  ['Description',        behind.description],
                  ['Instruction Given By', behind.instructionGivenBy],
                  ['', ''],
                  ['Created By',         behind.createdBy],
                  ['Supervised By',      behind.supervisedBy],
                  ['Created On',         behind.createdOn],
                  ['Supervised On',      behind.supervisedOn],
                ].map(([label, value], i) =>
                  label ? (
                    <div key={i} className="am-field">
                      <label className="am-label">{label}</label>
                      <span className="am-readonly">{value || '\u00A0'}</span>
                    </div>
                  ) : <div key={i} />
                )}
              </div>
            </div>
          </div>

        </div>

        <div className="bk-modal__footer">
          <div className="bk-modal-footer-btns">
            <button className="bk-btn bk-btn--view bk-btn--sm"
              onClick={() => showToast('History — not yet connected')}>
              History
            </button>
            <button className="bk-btn bk-btn--save" onClick={handleSave}>✔ Save</button>
            <button className="bk-btn bk-btn--cancel" onClick={onClose}>✕ Cancel</button>
          </div>
        </div>

      </div>
      {toast && <div className="bk-toast bk-toast--success">✔ {toast}</div>}
    </div>
  );
};

export default AccountBlockUnblock;