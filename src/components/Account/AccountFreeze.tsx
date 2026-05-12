import React, { useState, useCallback } from 'react';
import { useModuleTab } from '@hooks/useModuleTab';
import SearchButton from '../shared/SearchModal/SearchButton';
import ActionButtons from '../ui/ActionButtons';

type AppMode = 'view' | 'add' | 'edit';

interface FreezeRecord {
  // Lookup
  branchId: string; branchName: string;
  accountNumber: string; accountTitle: string;
  referenceId: string;
  // Freeze details
  effectiveDate: string;
  amount: string;
  reason: string;
  // Additional Information (read-only)
  releasedReason: string;
  releasedDate: string;
  productId: string;
  loanBranchId: string;
  loanAccountNumber: string;
  clearBalance: string;
  currencyId: string;
  unclearBalance: string;
  availableBalance: string;
  drawingPower: string;
  totalBalance: string;
  minimumBalance: string;
  freezedAmount: string;
  // Audit
  createdBy: string; createdOn: string;
  modifiedBy: string; modifiedOn: string;
  supervisedBy: string; supervisedOn: string;
}

const INITIAL: FreezeRecord = {
  branchId: '01', branchName: 'FORT PORTAL BRANCH',
  accountNumber: '', accountTitle: '',
  referenceId: '',
  effectiveDate: '',
  amount: '',
  reason: '',
  releasedReason: '', releasedDate: '',
  productId: '', loanBranchId: '', loanAccountNumber: '',
  clearBalance: '', currencyId: '', unclearBalance: '',
  availableBalance: '', drawingPower: '', totalBalance: '',
  minimumBalance: '', freezedAmount: '',
  createdBy: '', createdOn: '',
  modifiedBy: '', modifiedOn: '',
  supervisedBy: '', supervisedOn: '',
};

// Reuse the same Field helper pattern from AccountMaintenance
const Field: React.FC<{
  label: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}> = ({ label, required, wide, children }) => (
  <div className={`am-field ${wide ? 'am-field--wide' : ''}`}>
    <label className={`am-label ${required ? 'am-label--req' : ''}`}>{label}</label>
    {children}
  </div>
);

const ReadField: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="am-field">
    <label className="am-label">{label}</label>
    <span className={`am-readonly${mono ? ' am-readonly--mono' : ''}`}>{value || '\u00A0'}</span>
  </div>
);

const AccountFreeze: React.FC = () => {
  const { closeMe } = useModuleTab(1360);
  const [rec, setRec] = useState<FreezeRecord>({ ...INITIAL });
  const [mode, setMode] = useState<AppMode>('view');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const isDisabled = mode === 'view';
  const patch = useCallback((p: Partial<FreezeRecord>) => setRec(r => ({ ...r, ...p })), []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = () => { setRec({ ...INITIAL }); setMode('add'); };
  const handleEdit = () => { if (mode === 'view') setMode('edit'); };
  const handleView = () => setMode('view');
  const handleClose = () => { setMode('view'); showToast('Changes discarded'); };
  const handleCancel = () => mode === 'add' ? handleAdd() : setMode('view');
  const handleSave = () => {
    if (!rec.accountNumber.trim()) { showToast('Account Number is required', 'error'); return; }
    if (!rec.effectiveDate)        { showToast('Effective Date is required', 'error'); return; }
    if (!rec.amount.trim())        { showToast('Amount is required', 'error'); return; }
    setMode('view');
    showToast('Freeze instruction saved successfully');
  };

  return (
    <div className="bk-root">
      {/* ── Title bar ── */}
      <div className="bk-title-bar">
        <span className="bk-title-bar__icon">🔒</span>
        <span className="bk-title-bar__text">Freeze</span>
        <span className="bk-title-bar__close" onClick={closeMe} title="Close">✕</span>
      </div>

      <div className="bk-layout">
        <main className="bk-main">
          <div className="bk-tab-content">

            {/* ── Lookup panel ── */}
            <div className="bk-panel">
              <div className="bk-panel__body">
                <div className="am-lookup-grid">

                  {/* Branch ID */}
                  <Field label="Branch ID" required>
                    <div className="am-input-group">
                      <input
                        className="bk-input am-input-sm"
                        value={rec.branchId}
                        disabled={isDisabled}
                        onChange={e => patch({ branchId: e.target.value })}
                      />
                      <input
                        className="bk-input"
                        value={rec.branchName}
                        disabled={isDisabled}
                        onChange={e => patch({ branchName: e.target.value })}
                      />
                      <SearchButton
                        entityType="branch"
                        disabled={isDisabled}
                        className="bk-header__search-btn"
                        onSelect={r => patch({ branchId: r.branchId, branchName: r.branchName })}
                      />
                    </div>
                  </Field>

                  {/* Account Number */}
                  <Field label="Account Number" required>
                    <div className="am-input-group">
                      <input
                        className="bk-input am-input-sm"
                        value={rec.accountNumber}
                        disabled={isDisabled}
                        placeholder=""
                        onChange={e => patch({ accountNumber: e.target.value })}
                      />
                      <input
                        className="bk-input"
                        value={rec.accountTitle}
                        disabled
                        placeholder=""
                        onChange={e => patch({ accountTitle: e.target.value })}
                      />
                      <SearchButton
                        entityType="account"
                        disabled={isDisabled}
                        className="bk-header__search-btn"
                        onSelect={r => patch({ accountNumber: r.accountId, accountTitle: r.name })}
                      />
                    </div>
                  </Field>

                  {/* Reference ID */}
                  <Field label="Reference ID">
                    <div className="am-input-group">
                      <input
                        className="bk-input"
                        value={rec.referenceId}
                        disabled={isDisabled}
                        onChange={e => patch({ referenceId: e.target.value })}
                      />
                      <SearchButton
                        entityType="account"
                        disabled={isDisabled}
                        className="bk-header__search-btn"
                        onSelect={r => patch({ referenceId: r.accountId })}
                      />
                    </div>
                  </Field>

                </div>
              </div>
            </div>

            {/* ── Freeze details ── */}
            <div className="bk-panel">
              <div className="bk-panel__body">
                <div className="am-form-grid">

                  <Field label="Effective Date" required>
                    <select
                      className="bk-select"
                      value={rec.effectiveDate}
                      disabled={isDisabled}
                      onChange={e => patch({ effectiveDate: e.target.value })}
                    >
                      <option value="">--Select--</option>
                      <option>Today</option>
                      <option>Future Date</option>
                    </select>
                  </Field>

                  <Field label="Amount" required>
                    <input
                      className="bk-input bk-input--money"
                      value={rec.amount}
                      disabled={isDisabled}
                      placeholder="0.00"
                      onChange={e => patch({ amount: e.target.value })}
                    />
                  </Field>

                  <Field label="Reason" wide>
                    <textarea
                      className="bk-textarea"
                      rows={3}
                      value={rec.reason}
                      disabled={isDisabled}
                      onChange={e => patch({ reason: e.target.value })}
                    />
                  </Field>

                </div>
              </div>
            </div>

            {/* ── Additional Information ── */}
            <div className="bk-panel">
              <div className="bk-panel__header">Additional Information</div>
              <div className="bk-panel__body">
                <div className="am-form-grid">
                  <ReadField label="Released Reason"     value={rec.releasedReason} />
                  <ReadField label="Released Date"       value={rec.releasedDate} />
                  <ReadField label="Product ID"          value={rec.productId} mono />
                  <div /> {/* spacer to keep grid aligned */}
                  <ReadField label="Loan Branch ID"      value={rec.loanBranchId} mono />
                  <ReadField label="Loan Account Number" value={rec.loanAccountNumber} mono />
                  <ReadField label="Clear Balance"       value={rec.clearBalance} mono />
                  <ReadField label="Currency ID"         value={rec.currencyId} mono />
                  <ReadField label="Unclear Balance"     value={rec.unclearBalance} mono />
                  <ReadField label="Available Balance"   value={rec.availableBalance} mono />
                  <ReadField label="Drawing Power"       value={rec.drawingPower} mono />
                  <ReadField label="Total Balance"       value={rec.totalBalance} mono />
                  <ReadField label="Freezed Amount"      value={rec.freezedAmount} mono />
                  <ReadField label="Minimum Balance"     value={rec.minimumBalance} mono />
                </div>
              </div>
            </div>

            {/* ── Audit footer ── */}
            <div className="bk-audit">
              <div className="bk-audit__header">Audit Information</div>
              <div className="bk-audit__grid">
                <div className="bk-audit__row">
                  <span className="bk-audit__label">Created By</span>
                  <span className="bk-audit__value">{rec.createdBy}</span>
                  <span className="bk-audit__label">Modified By</span>
                  <span className="bk-audit__value">{rec.modifiedBy}</span>
                  <span className="bk-audit__label">Supervised By</span>
                  <span className="bk-audit__value">{rec.supervisedBy}</span>
                </div>
                <div className="bk-audit__row">
                  <span className="bk-audit__label">Created On</span>
                  <span className="bk-audit__value">{rec.createdOn}</span>
                  <span className="bk-audit__label">Modified On</span>
                  <span className="bk-audit__value">{rec.modifiedOn}</span>
                  <span className="bk-audit__label">Supervised On</span>
                  <span className="bk-audit__value">{rec.supervisedOn}</span>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* ── Right action buttons ── */}
        <ActionButtons
          mode={mode}
          onView={handleView}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onClose={handleClose}
          onSave={handleSave}
          onCancel={handleCancel}
          extra={[
            { label: 'History', onClick: () => showToast('History view — not yet connected') },
            { label: 'Release', onClick: () => { showToast('Account released'); setMode('view'); } },
          ]}
        />
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`bk-toast bk-toast--${toast.type}`}>
          {toast.type === 'success' ? '✔' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AccountFreeze;
