import React, { useState } from 'react';
import { useModuleTab } from '@hooks/useModuleTab';
import SearchButton from '../shared/SearchModal/SearchButton';
import ActionButtons from '../ui/ActionButtons';

type AppMode = 'view' | 'add' | 'edit';

const SI_TRANSFER_TYPES = ['--Select--', 'Internal Transfer', 'External Transfer', 'RTGS', 'EFT'];
const FAILED_CHARGE_TYPES = ['--Select--', 'Flat Fee', 'Percentage', 'None'];

const StandingInstructionType: React.FC = () => {
  const { closeMe } = useModuleTab(1900);
  const [mode, setMode] = useState<AppMode>('view');
  const [rec, setRec] = useState({
    instructionTypeId: '', description: '', siTransferType: '',
    noOfRetries: '', retryAfterDays: '', failedChargeType: '',
    freezeAmountOnFailure: false,
    successfulTrxId: '', successfulTrxName: '', successfulNarration: '',
    failureTrxId: '', failureTrxName: '', failureNarration: '',
    createdBy: '', createdOn: '', modifiedBy: '', modifiedOn: '',
    supervisedBy: '', supervisedOn: '',
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const isDisabled = mode === 'view';
  const patch = (p: any) => setRec(r => ({ ...r, ...p }));
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bk-root">
      <div className="bk-title-bar">
        <span className="bk-title-bar__icon">📋</span>
        <span className="bk-title-bar__text">Standing Instruction Type</span>
        <span className="bk-title-bar__close" onClick={closeMe}>✕</span>
      </div>

      <div className="bk-layout">
        <main className="bk-main">
          <div className="bk-tab-content">

            {/* Header fields */}
            <div className="bk-panel">
              <div className="bk-panel__body">
                <div className="am-form-grid">
                  <div className="bk-form-row">
                    <label className="bk-form-label bk-form-label--required">Instruction Type ID</label>
                    <div className="bk-form-control">
                      <div className="am-input-group">
                        <input className="bk-input" value={rec.instructionTypeId} disabled={isDisabled}
                          onChange={e => patch({ instructionTypeId: e.target.value })} />
                        <SearchButton entityType="siType"
                          onSelect={r => patch({ instructionTypeId: r.siTypeId, description: r.siTypeName, siTransferType: r.transferType })}
                          disabled={isDisabled} />
                      </div>
                    </div>
                  </div>
                  <div className="bk-form-row am-field--wide">
                    <label className="bk-form-label">Description</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.description} disabled={isDisabled}
                        onChange={e => patch({ description: e.target.value })} />
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">SI Transfer Type</label>
                    <div className="bk-form-control">
                      <select className="bk-select" value={rec.siTransferType} disabled={isDisabled}
                        onChange={e => patch({ siTransferType: e.target.value })}>
                        {SI_TRANSFER_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bk-panel">
              <div className="bk-panel__header">Settings</div>
              <div className="bk-panel__body">
                <div className="am-form-grid">
                  <div className="bk-form-row">
                    <label className="bk-form-label">No Of Retries</label>
                    <div className="bk-form-control">
                      <input className="bk-input" type="number" value={rec.noOfRetries} disabled={isDisabled}
                        onChange={e => patch({ noOfRetries: e.target.value })} />
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Retry After Day(s)</label>
                    <div className="bk-form-control">
                      <input className="bk-input" type="number" value={rec.retryAfterDays} disabled={isDisabled}
                        onChange={e => patch({ retryAfterDays: e.target.value })} />
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Failed Charge Type</label>
                    <div className="bk-form-control">
                      <select className="bk-select" value={rec.failedChargeType} disabled={isDisabled}
                        onChange={e => patch({ failedChargeType: e.target.value })}>
                        {FAILED_CHARGE_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Freeze Amount On Failure</label>
                    <div className="bk-form-control">
                      <div className="bk-checkbox-wrapper">
                        <input type="checkbox" className="bk-checkbox"
                          checked={rec.freezeAmountOnFailure} disabled={isDisabled}
                          onChange={e => patch({ freezeAmountOnFailure: e.target.checked })} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bk-panel">
              <div className="bk-panel__header">Transaction Details</div>
              <div className="bk-panel__body">
                <div className="am-form-grid">
                  <div className="bk-form-row">
                    <label className="bk-form-label bk-form-label--required">Successful Trx. ID</label>
                    <div className="bk-form-control">
                      <div className="am-input-group">
                        <input className="bk-input am-input-sm" value={rec.successfulTrxId} disabled={isDisabled}
                          onChange={e => patch({ successfulTrxId: e.target.value })} />
                        <input className="bk-input" value={rec.successfulTrxName} disabled
                          onChange={e => patch({ successfulTrxName: e.target.value })} />
                        <SearchButton entityType="transaction"
                          onSelect={r => patch({ successfulTrxId: r.transactionId, successfulTrxName: r.narration })}
                          disabled={isDisabled} />
                      </div>
                    </div>
                  </div>
                  <div className="bk-form-row am-field--wide">
                    <label className="bk-form-label">Narration</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.successfulNarration} disabled={isDisabled}
                        onChange={e => patch({ successfulNarration: e.target.value })} />
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label bk-form-label--required">Failure Trx. ID</label>
                    <div className="bk-form-control">
                      <div className="am-input-group">
                        <input className="bk-input am-input-sm" value={rec.failureTrxId} disabled={isDisabled}
                          onChange={e => patch({ failureTrxId: e.target.value })} />
                        <input className="bk-input" value={rec.failureTrxName} disabled
                          onChange={e => patch({ failureTrxName: e.target.value })} />
                        <SearchButton entityType="transaction"
                          onSelect={r => patch({ failureTrxId: r.transactionId, failureTrxName: r.narration })}
                          disabled={isDisabled} />
                      </div>
                    </div>
                  </div>
                  <div className="bk-form-row am-field--wide">
                    <label className="bk-form-label">Narration</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.failureNarration} disabled={isDisabled}
                        onChange={e => patch({ failureNarration: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit */}
            <div className="bk-audit">
              <div className="bk-audit__header">Additional Information</div>
              <div className="bk-audit__grid">
                <div className="bk-audit__row">
                  {['createdBy','createdOn','modifiedBy','modifiedOn','supervisedBy','supervisedOn'].map(k => (
                    <React.Fragment key={k}>
                      <span className="bk-audit__label">{k.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</span>
                      <span className="bk-audit__value">{(rec as any)[k]}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <ActionButtons mode={mode}
          onView={() => setMode('view')} onAdd={() => { setRec({ instructionTypeId:'',description:'',siTransferType:'',noOfRetries:'',retryAfterDays:'',failedChargeType:'',freezeAmountOnFailure:false,successfulTrxId:'',successfulTrxName:'',successfulNarration:'',failureTrxId:'',failureTrxName:'',failureNarration:'',createdBy:'',createdOn:'',modifiedBy:'',modifiedOn:'',supervisedBy:'',supervisedOn:'' }); setMode('add'); }}
          onEdit={() => setMode('edit')} onClose={() => setMode('view')}
          onSave={() => { if (!rec.instructionTypeId) { showToast('Instruction Type ID is required','error'); return; } setMode('view'); showToast('SI Type saved'); }}
          onCancel={() => setMode('view')} />
      </div>
      {toast && <div className={`bk-toast bk-toast--${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};

export default StandingInstructionType;
