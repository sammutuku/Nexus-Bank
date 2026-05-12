import React, { useState, useCallback } from 'react';
import { useModuleTab } from '../../hooks/useModuleTab';
import SearchButton from '../shared/SearchModal/SearchButton';
import ActionButtons from '../ui/ActionButtons';

type AppMode = 'view' | 'add' | 'edit';

interface DormantRecord {
  branchId: string; branchName: string;
  accountNumber: string; accountTitle: string;
  instructedBy: string; instructedByName: string;
  comments: string;
  // Additional Information (read-only)
  dormantDate: string;
  originalProductId: string; originalProductName: string;
  dormantDateDisplay: string; dormantBalance: string;
  lastCreditDate: string; lastCreditAmount: string;
  lastDebitDate: string;  lastDebitAmount: string;
  // Audit
  createdBy: string; createdOn: string;
  modifiedBy: string; modifiedOn: string;
  supervisedBy: string; supervisedOn: string;
}

const INITIAL: DormantRecord = {
  branchId: '01', branchName: 'FORT PORTAL BRANCH',
  accountNumber: '', accountTitle: '',
  instructedBy: '', instructedByName: '',
  comments: '',
  dormantDate: '', originalProductId: '', originalProductName: '',
  dormantDateDisplay: '', dormantBalance: '',
  lastCreditDate: '', lastCreditAmount: '',
  lastDebitDate: '',  lastDebitAmount: '',
  createdBy: '', createdOn: '',
  modifiedBy: '', modifiedOn: '',
  supervisedBy: '', supervisedOn: '',
};

const Field: React.FC<{ label: string; required?: boolean; wide?: boolean; children: React.ReactNode }> =
  ({ label, required, wide, children }) => (
    <div className={`am-field ${wide ? 'am-field--wide' : ''}`}>
      <label className={`am-label ${required ? 'am-label--req' : ''}`}>{label}</label>
      {children}
    </div>
  );

const ReadField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="am-field">
    <label className="am-label">{label}</label>
    <span className="am-readonly">{value || '\u00A0'}</span>
  </div>
);

const ActivateDormantAccount: React.FC = () => {
  const { closeMe } = useModuleTab(1410);
  const [rec, setRec] = useState<DormantRecord>({ ...INITIAL });
  const [mode, setMode] = useState<AppMode>('view');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const isDisabled = mode === 'view';
  const patch = useCallback((p: Partial<DormantRecord>) => setRec(r => ({ ...r, ...p })), []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd    = () => { setRec({ ...INITIAL }); setMode('add'); };
  const handleEdit   = () => { if (mode === 'view') setMode('edit'); };
  const handleView   = () => setMode('view');
  const handleClose  = () => { setMode('view'); showToast('Changes discarded'); };
  const handleCancel = () => mode === 'add' ? handleAdd() : setMode('view');
  const handleSave   = () => {
    if (!rec.accountNumber.trim()) { showToast('Account Number is required', 'error'); return; }
    setMode('view');
    showToast('Dormant account activated successfully');
  };

  return (
    <div className="ci-root">
      <div className="ci-title-bar">
        <span className="ci-title-bar__icon">🔓</span>
        <span className="ci-title-bar__text">Activate Dormant Account</span>
        <span className="ci-title-bar__close" onClick={closeMe} title="Close">✕</span>
      </div>

      <div className="ci-layout">
        <main className="ci-main">
          <div className="ci-tab-content">

            {/* ── Lookup ── */}
            <div className="ci-panel">
              <div className="ci-panel__body">
                <div className="am-lookup-grid">

                  <Field label="Branch ID" required>
                    <div className="am-input-group">
                      <input className="ci-input am-input-sm" value={rec.branchId}
                        disabled={isDisabled} onChange={e => patch({ branchId: e.target.value })} />
                      <input className="ci-input" value={rec.branchName}
                        disabled={isDisabled} onChange={e => patch({ branchName: e.target.value })} />
                      <SearchButton entityType="branch" disabled={isDisabled}
                        className="bk-header__search-btn"
                        onSelect={r => patch({ branchId: r.branchId, branchName: r.branchName })} />
                    </div>
                  </Field>

                  <Field label="Account Number" required>
                    <div className="am-input-group">
                      <input className="ci-input am-input-sm" value={rec.accountNumber}
                        disabled={isDisabled} onChange={e => patch({ accountNumber: e.target.value })} />
                      <input className="ci-input" value={rec.accountTitle} disabled
                        onChange={e => patch({ accountTitle: e.target.value })} />
                      <SearchButton entityType="account" disabled={isDisabled}
                        className="bk-header__search-btn"
                        onSelect={r => patch({ accountNumber: r.accountId, accountTitle: r.name })} />
                    </div>
                  </Field>

                </div>
              </div>
            </div>

            {/* ── Instruction details ── */}
            <div className="ci-panel">
              <div className="ci-panel__body">
                <div className="am-form-grid">

                  <Field label="Instructed By" required>
                    <div className="am-input-group">
                      <input className="ci-input am-input-sm" value={rec.instructedBy}
                        disabled={isDisabled} onChange={e => patch({ instructedBy: e.target.value })} />
                      <input className="ci-input" value={rec.instructedByName} disabled
                        onChange={e => patch({ instructedByName: e.target.value })} />
                      <SearchButton entityType="user" disabled={isDisabled}
                        className="bk-header__search-btn"
                        onSelect={r => patch({ instructedBy: r.userId, instructedByName: r.userName })} />
                    </div>
                  </Field>

                  <Field label="Comments" wide>
                    <textarea className="ci-textarea" rows={4}
                      value={rec.comments} disabled={isDisabled}
                      onChange={e => patch({ comments: e.target.value })} />
                  </Field>

                </div>
              </div>
            </div>

            {/* ── Additional Information (read-only) ── */}
            <div className="ci-panel">
              <div className="ci-panel__header">Additional Information</div>
              <div className="ci-panel__body">
                <div className="am-form-grid">
                  <ReadField label="Dormant Date"          value={rec.dormantDate} />
                  <div />
                  <ReadField label="Original Product ID"   value={rec.originalProductId} />
                  <ReadField label=""                       value={rec.originalProductName} />
                  <ReadField label="Dormant Date"          value={rec.dormantDateDisplay} />
                  <ReadField label="Balance"                value={rec.dormantBalance} />
                  <ReadField label="Last Credit Date"      value={rec.lastCreditDate} />
                  <ReadField label="Amount"                 value={rec.lastCreditAmount} />
                  <ReadField label="Last Debit Date"       value={rec.lastDebitDate} />
                  <ReadField label="Amount"                 value={rec.lastDebitAmount} />
                </div>
              </div>
            </div>

            {/* ── Audit ── */}
            <div className="ci-audit">
              <div className="ci-audit__header">Audit Information</div>
              <div className="ci-audit__grid">
                <div className="ci-audit__row">
                  <span className="ci-audit__label">Created By</span>
                  <span className="ci-audit__value">{rec.createdBy}</span>
                  <span className="ci-audit__label">Modified By</span>
                  <span className="ci-audit__value">{rec.modifiedBy}</span>
                  <span className="ci-audit__label">Supervised By</span>
                  <span className="ci-audit__value">{rec.supervisedBy}</span>
                </div>
                <div className="ci-audit__row">
                  <span className="ci-audit__label">Created On</span>
                  <span className="ci-audit__value">{rec.createdOn}</span>
                  <span className="ci-audit__label">Modified On</span>
                  <span className="ci-audit__value">{rec.modifiedOn}</span>
                  <span className="ci-audit__label">Supervised On</span>
                  <span className="ci-audit__value">{rec.supervisedOn}</span>
                </div>
              </div>
            </div>

          </div>
        </main>

        <ActionButtons mode={mode}
          onView={handleView} onAdd={handleAdd} onEdit={handleEdit}
          onClose={handleClose} onSave={handleSave} onCancel={handleCancel} />
      </div>

      {toast && (
        <div className={`ci-toast ci-toast--${toast.type}`}>
          {toast.type === 'success' ? '✔' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ActivateDormantAccount;