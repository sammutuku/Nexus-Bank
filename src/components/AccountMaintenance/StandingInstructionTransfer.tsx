import React, { useState } from 'react';
import { useModuleTab } from '../../hooks/useModuleTab';
import SearchButton from '../shared/SearchModal/SearchButton';
import ActionButtons from '../ui/ActionButtons';

type AppMode = 'view' | 'add' | 'edit';

const SI_TYPES = ['--Select--','Salary Transfer','Loan Repayment','Utility Payment','School Fees Transfer'];
const EFFECTIVE_DATES = ['--Select--','Today','End of Month','Custom'];
const AMOUNT_IN_OPTS = ['--Select--','Fixed Amount','Percentage','Full Balance'];
const FREQUENCIES = ['--Select--','Daily','Weekly','Monthly','Quarterly','Annually'];
const CHARGE_RECOVERY = ['--Select--','Debit Source','Debit Beneficiary','None'];
const FIRST_EXEC_DATES = ['--Select--','Today','Next Working Day','End of Month','Custom'];

const StandingInstructionTransfer: React.FC = () => {
  const { closeMe } = useModuleTab(1905);
  const [mode, setMode] = useState<AppMode>('view');
  const [rec, setRec] = useState({
    // SI Details
    branchId: '01', branchName: 'FORT PORTAL BRANCH',
    siId: '', referenceNo: '',
    accountNumber: '', accountTitle: '',
    siType: '', effectiveDate: '',
    transferCurrencyId: '', transferCurrencyName: '',
    amountIn: '', amount: '',
    transferFrequency: '', noOfExecution: '',
    regularExecutionDay: '',
    firstExecutionDate: '', lastExecutionDate: '',
    chargeRecovery: '',
    // Beneficiary
    benBranchId: '', benBranchName: '',
    benAccountNumber: '', benAccountTitle: '',
    // Additional
    nextExecutionDate: '', siStatus: '',
    lastRunDate: '', lastRunStatus: '',
    noOfTimesFailed: '', stoppedReason: '',
    // Audit
    createdBy: '', createdOn: '',
    stoppedBy: '', stoppedOn: '',
    supervisedBy: '', supervisedOn: '',
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const isDisabled = mode === 'view';
  const patch = (p: any) => setRec(r => ({ ...r, ...p }));
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    if (!rec.siId)            { showToast('Standing Instruction ID is required', 'error'); return; }
    if (!rec.accountNumber)   { showToast('Account Number is required', 'error'); return; }
    if (!rec.siType)          { showToast('SI Type is required', 'error'); return; }
    if (!rec.transferFrequency){ showToast('Transfer Frequency is required', 'error'); return; }
    setMode('view');
    showToast('Standing Instruction Transfer saved');
  };

  return (
    <div className="ci-root">
      <div className="ci-title-bar">
        <span className="ci-title-bar__icon">↔</span>
        <span className="ci-title-bar__text">Standing Instruction Transfer</span>
        <span className="ci-title-bar__close" onClick={closeMe}>✕</span>
      </div>

      <div className="ci-layout">
        <main className="ci-main">
          <div className="ci-tab-content">

            {/* ── Standing Instruction Details ── */}
            <div className="ci-panel">
              <div className="ci-panel__header">Standing Instruction Details</div>
              <div className="ci-panel__body">

                {/* Branch ID row */}
                <div className="sit-row">
                  <label className="sit-label">Branch ID</label>
                  <input className="ci-input sit-input-sm" value={rec.branchId} disabled={isDisabled}
                    onChange={e => patch({ branchId: e.target.value })} />
                  <input className="ci-input sit-input-lg" value={rec.branchName} disabled={isDisabled}
                    onChange={e => patch({ branchName: e.target.value })} />
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                </div>

                {/* SI ID + Reference */}
                <div className="sit-row">
                  <label className="sit-label sit-label--req">Standing Instruction ID</label>
                  <input className="ci-input sit-input-lg" value={rec.siId} disabled={isDisabled}
                    onChange={e => patch({ siId: e.target.value })} />
                  <SearchButton entityType="siType" onSelect={r => patch({ siId: r.siTypeId })} disabled={isDisabled} />
                  <label className="sit-label-right">Reference #</label>
                  <input className="ci-input sit-input-lg" value={rec.referenceNo} disabled={isDisabled}
                    onChange={e => patch({ referenceNo: e.target.value })} />
                </div>

                {/* Account Number */}
                <div className="sit-row">
                  <label className="sit-label sit-label--req">Account Number</label>
                  <input className="ci-input sit-input-sm" value={rec.accountNumber} disabled={isDisabled}
                    onChange={e => patch({ accountNumber: e.target.value })} />
                  <input className="ci-input sit-input-lg" value={rec.accountTitle} disabled
                    onChange={e => patch({ accountTitle: e.target.value })} />
                  <SearchButton entityType="account"
                    onSelect={r => patch({ accountNumber: r.accountId, accountTitle: r.name })}
                    disabled={isDisabled} />
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                </div>

                {/* SI Type + Effective Date */}
                <div className="sit-row">
                  <label className="sit-label">SI Type</label>
                  <select className="ci-select sit-input-lg" value={rec.siType} disabled={isDisabled}
                    onChange={e => patch({ siType: e.target.value })}>
                    {SI_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div className="sit-spacer" />
                  <label className="sit-label-right sit-label--req">Effective Date</label>
                  <select className="ci-select sit-input-lg" value={rec.effectiveDate} disabled={isDisabled}
                    onChange={e => patch({ effectiveDate: e.target.value })}>
                    {EFFECTIVE_DATES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Transfer Currency ID */}
                <div className="sit-row">
                  <label className="sit-label">Transfer Currency ID</label>
                  <input className="ci-input sit-input-sm" value={rec.transferCurrencyId} disabled={isDisabled}
                    onChange={e => patch({ transferCurrencyId: e.target.value })} />
                  <input className="ci-input sit-input-lg" value={rec.transferCurrencyName} disabled
                    onChange={e => patch({ transferCurrencyName: e.target.value })} />
                  <SearchButton entityType="currency"
                    onSelect={r => patch({ transferCurrencyId: r.currencyId, transferCurrencyName: r.currencyName })}
                    disabled={isDisabled} />
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                </div>

                {/* Amount In + Amount */}
                <div className="sit-row">
                  <label className="sit-label sit-label--req">Amount In</label>
                  <select className="ci-select sit-input-lg" value={rec.amountIn} disabled={isDisabled}
                    onChange={e => patch({ amountIn: e.target.value })}>
                    {AMOUNT_IN_OPTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div className="sit-spacer" />
                  <label className="sit-label-right sit-label--req">Amount</label>
                  <input className="ci-input ci-input--money sit-input-lg" value={rec.amount} disabled={isDisabled}
                    onChange={e => patch({ amount: e.target.value })} />
                </div>

                {/* Transfer Frequency + No Of Execution */}
                <div className="sit-row">
                  <label className="sit-label sit-label--req">Transfer Frequency</label>
                  <select className="ci-select sit-input-lg" value={rec.transferFrequency} disabled={isDisabled}
                    onChange={e => patch({ transferFrequency: e.target.value })}>
                    {FREQUENCIES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div className="sit-spacer" />
                  <label className="sit-label-right">No Of Execution</label>
                  <input className="ci-input sit-input-lg" type="number" value={rec.noOfExecution} disabled={isDisabled}
                    onChange={e => patch({ noOfExecution: e.target.value })} />
                </div>

                {/* Regular Execution Day */}
                <div className="sit-row">
                  <label className="sit-label">Regular Execution Day</label>
                  <input className="ci-input sit-input-lg" value={rec.regularExecutionDay} disabled={isDisabled}
                    onChange={e => patch({ regularExecutionDay: e.target.value })} />
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                </div>

                {/* First + Last Execution Date */}
                <div className="sit-row">
                  <label className="sit-label sit-label--req">First Execution Date</label>
                  <select className="ci-select sit-input-lg" value={rec.firstExecutionDate} disabled={isDisabled}
                    onChange={e => patch({ firstExecutionDate: e.target.value })}>
                    {FIRST_EXEC_DATES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div className="sit-spacer" />
                  <label className="sit-label-right">Last Execution Date</label>
                  <input className="ci-input sit-input-lg" value={rec.lastExecutionDate} disabled={isDisabled}
                    onChange={e => patch({ lastExecutionDate: e.target.value })} />
                </div>

                {/* Charge Recovery */}
                <div className="sit-row">
                  <label className="sit-label sit-label--req">Charge Recovery</label>
                  <select className="ci-select sit-input-lg" value={rec.chargeRecovery} disabled={isDisabled}
                    onChange={e => patch({ chargeRecovery: e.target.value })}>
                    {CHARGE_RECOVERY.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                </div>
              </div>
            </div>

            {/* ── Beneficiary Account Details ── */}
            <div className="ci-panel">
              <div className="ci-panel__header">Beneficiary Account Details</div>
              <div className="ci-panel__body">
                <div className="sit-row">
                  <label className="sit-label sit-label--req">Branch ID</label>
                  <input className="ci-input sit-input-sm" value={rec.benBranchId} disabled={isDisabled}
                    onChange={e => patch({ benBranchId: e.target.value })} />
                  <input className="ci-input sit-input-lg" value={rec.benBranchName} disabled
                    onChange={e => patch({ benBranchName: e.target.value })} />
                  <SearchButton entityType="branch"
                    onSelect={r => patch({ benBranchId: r.branchId, benBranchName: r.branchName })}
                    disabled={isDisabled} />
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                </div>
                <div className="sit-row">
                  <label className="sit-label sit-label--req">Account Number</label>
                  <input className="ci-input sit-input-sm" value={rec.benAccountNumber} disabled={isDisabled}
                    onChange={e => patch({ benAccountNumber: e.target.value })} />
                  <input className="ci-input sit-input-lg" value={rec.benAccountTitle} disabled
                    onChange={e => patch({ benAccountTitle: e.target.value })} />
                  <SearchButton entityType="account"
                    onSelect={r => patch({ benAccountNumber: r.accountId, benAccountTitle: r.name })}
                    disabled={isDisabled} />
                  <div className="sit-spacer" />
                  <div className="sit-spacer" />
                </div>
              </div>
            </div>

            {/* ── Additional Information ── */}
            <div className="ci-panel">
              <div className="ci-panel__header">Additional Information</div>
              <div className="ci-panel__body">
                <div className="sit-additional-grid">
                  <div className="sit-row">
                    <label className="sit-label">Next Execution Date</label>
                    <input className="ci-input sit-input-lg" value={rec.nextExecutionDate} readOnly
                      style={{ background: 'var(--bank-bg-alt)' }} />
                    <div className="sit-spacer" />
                    <label className="sit-label-right">Standing Instruction Status</label>
                    <input className="ci-input sit-input-lg" value={rec.siStatus} readOnly
                      style={{ background: 'var(--bank-bg-alt)' }} />
                  </div>
                  <div className="sit-row">
                    <label className="sit-label">Last Run Date</label>
                    <input className="ci-input sit-input-lg" value={rec.lastRunDate} readOnly
                      style={{ background: 'var(--bank-bg-alt)' }} />
                    <div className="sit-spacer" />
                    <label className="sit-label-right">Last Run Status</label>
                    <input className="ci-input sit-input-lg" value={rec.lastRunStatus} readOnly
                      style={{ background: 'var(--bank-bg-alt)' }} />
                  </div>
                  <div className="sit-row">
                    <label className="sit-label">No Of Times Failed</label>
                    <input className="ci-input sit-input-lg" value={rec.noOfTimesFailed} readOnly
                      style={{ background: 'var(--bank-bg-alt)' }} />
                    <div className="sit-spacer" />
                    <div className="sit-spacer" />
                    <div className="sit-spacer" />
                  </div>
                  <div className="sit-row">
                    <label className="sit-label">Stopped Reason</label>
                    <input className="ci-input" value={rec.stoppedReason} readOnly
                      style={{ background: 'var(--bank-bg-alt)', flex: 1 }} />
                  </div>
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
                  <span className="ci-audit__label">Stopped By</span>
                  <span className="ci-audit__value">{rec.stoppedBy}</span>
                  <span className="ci-audit__label">Supervised By</span>
                  <span className="ci-audit__value">{rec.supervisedBy}</span>
                </div>
                <div className="ci-audit__row">
                  <span className="ci-audit__label">Created On</span>
                  <span className="ci-audit__value">{rec.createdOn}</span>
                  <span className="ci-audit__label">Stopped On</span>
                  <span className="ci-audit__value">{rec.stoppedOn}</span>
                  <span className="ci-audit__label">Supervised On</span>
                  <span className="ci-audit__value">{rec.supervisedOn}</span>
                </div>
              </div>
            </div>

          </div>
        </main>

        <ActionButtons mode={mode}
          onView={() => setMode('view')}
          onAdd={() => setMode('add')}
          onEdit={() => setMode('edit')}
          onClose={() => setMode('view')}
          onSave={handleSave}
          onCancel={() => setMode('view')}
          extra={[{ label: 'Stop', onClick: () => showToast('Standing instruction stopped') }]}
        />
      </div>

      {toast && <div className={`ci-toast ci-toast--${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};

export default StandingInstructionTransfer;
