import React, { useState } from 'react';
import { useModuleTab } from '../../hooks/useModuleTab';
import SearchButton from '../shared/SearchModal/SearchButton';
import ActionButtons from '../ui/ActionButtons';

type AppMode = 'view' | 'add' | 'edit';
type ClosingTab = 'closeDetails' | 'transactionDetails';

const TXN_TYPES = ['--Select--', 'Cash', 'Cheque', 'Transfer'];
const TILLS = ['--Select--', 'TILL-01', 'TILL-02', 'TILL-03'];
const SERVICES = ['--Select--', 'Counter', 'Online', 'ATM'];
const ACCOUNT_TYPES = ['--Select--', 'Savings', 'Current', 'Fixed Deposit'];

const AccountClosing: React.FC = () => {
  const { closeMe } = useModuleTab(1380);
  const [mode, setMode] = useState<AppMode>('view');
  const [activeTab, setActiveTab] = useState<ClosingTab>('closeDetails');
  const [rec, setRec] = useState({
    branchId: '00', branchName: 'HEAD OFFICE',
    clientId: '', productId: '', accountNumber: '', accountTitle: '',
    // Close details (read-only summary)
    unclearBalance: '', supervisedCredits: '', supervisedDebits: '',
    freezeAmount: '', drawingPower: '', createdOn: '', modifiedOn: '', supervisedOn: '',
    // Transaction
    transactionType: '', till: '', unpostedAmount: '', balanceAmount: '',
    typeOfService: '', referenceNo: '', accountType: '',
    accountId: '', chequeId: '', currencyId: '', payableAt: '',
    productId2: '', beneficiaryName: '', transactionId: '', narration: '',
    transactionAmount: '', exchangeRate: '', localAmount: '', forexGainLoss: '',
  });
  const [txnRows, setTxnRows] = useState<any[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const isDisabled = mode === 'view';
  const patch = (p: any) => setRec(r => ({ ...r, ...p }));
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="ci-root">
      <div className="ci-title-bar">
        <span className="ci-title-bar__icon">🔐</span>
        <span className="ci-title-bar__text">Account Closing</span>
        <span className="ci-title-bar__close" onClick={closeMe}>✕</span>
      </div>

      <div className="ci-layout">
        <main className="ci-main">
          {/* Tabs */}
          <div className="ci-tabs">
            {([['closeDetails','Close Details'],['transactionDetails','Transaction Details']] as [ClosingTab,string][]).map(([id, label]) => (
              <button key={id} className={`ci-tab ${activeTab === id ? 'ci-tab--active' : ''}`}
                onClick={() => setActiveTab(id)}>{label}</button>
            ))}
          </div>

          <div className="ci-tab-content">
            {/* Lookup */}
            <div className="ci-panel">
              <div className="ci-panel__body">
                <div className="am-form-grid">
                  <div className="ci-form-row">
                    <label className="ci-form-label ci-form-label--required">Branch ID</label>
                    <div className="ci-form-control">
                      <div className="am-input-group">
                        <input className="ci-input am-input-sm" value={rec.branchId} disabled={isDisabled} onChange={e => patch({ branchId: e.target.value })} />
                        <input className="ci-input" value={rec.branchName} disabled onChange={e => patch({ branchName: e.target.value })} />
                        <SearchButton entityType="branch" onSelect={r => patch({ branchId: r.branchId, branchName: r.branchName })} disabled={isDisabled} />
                      </div>
                    </div>
                  </div>
                  <div className="ci-form-row">
                    <label className="ci-form-label ci-form-label--required">Client ID</label>
                    <div className="ci-form-control">
                      <div className="am-input-group">
                        <input className="ci-input" value={rec.clientId} disabled={isDisabled} onChange={e => patch({ clientId: e.target.value })} />
                        <SearchButton entityType="client" onSelect={r => patch({ clientId: r.clientId })} disabled={isDisabled} />
                      </div>
                    </div>
                  </div>
                  <div className="ci-form-row">
                    <label className="ci-form-label ci-form-label--required">Product ID</label>
                    <div className="ci-form-control">
                      <div className="am-input-group">
                        <input className="ci-input" value={rec.productId} disabled={isDisabled} onChange={e => patch({ productId: e.target.value })} />
                        <SearchButton entityType="product" onSelect={r => patch({ productId: r.productId })} disabled={isDisabled} />
                      </div>
                    </div>
                  </div>
                  <div className="ci-form-row">
                    <label className="ci-form-label ci-form-label--required">Account Number</label>
                    <div className="ci-form-control">
                      <div className="am-input-group">
                        <input className="ci-input" value={rec.accountNumber} disabled={isDisabled} onChange={e => patch({ accountNumber: e.target.value })} />
                        <SearchButton entityType="account" onSelect={r => patch({ accountNumber: r.accountId, accountTitle: r.name })} disabled={isDisabled} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'closeDetails' && (
              <div className="ci-panel">
                <div className="ci-panel__header">Account Summary</div>
                <div className="ci-panel__body">
                  <div className="am-form-grid">
                    {[['Unclear Balance','unclearBalance'],['Supervised Credits','supervisedCredits'],
                      ['Supervised Debits','supervisedDebits'],['Freeze Amount','freezeAmount'],
                      ['Drawing Power','drawingPower'],['Created On','createdOn'],
                      ['Modified On','modifiedOn'],['Supervised On','supervisedOn']].map(([label, key]) => (
                      <div key={key} className="ci-form-row">
                        <label className="ci-form-label">{label}</label>
                        <div className="ci-form-control">
                          <input className="ci-input" value={(rec as any)[key]} readOnly style={{ background: 'var(--bank-bg-alt)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactionDetails' && (
              <div className="ci-panel">
                <div className="ci-panel__header">Transaction Information</div>
                <div className="ci-panel__body">
                  <div className="am-form-grid">
                    <div className="ci-form-row">
                      <label className="ci-form-label ci-form-label--required">Transaction Type</label>
                      <div className="ci-form-control">
                        <select className="ci-select" value={rec.transactionType} disabled={isDisabled} onChange={e => patch({ transactionType: e.target.value })}>
                          {TXN_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label">Unposted Amount</label>
                      <div className="ci-form-control"><input className="ci-input ci-input--money" value={rec.unpostedAmount} readOnly style={{ background: 'var(--bank-bg-alt)' }} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label ci-form-label--required">Till</label>
                      <div className="ci-form-control">
                        <select className="ci-select" value={rec.till} disabled={isDisabled} onChange={e => patch({ till: e.target.value })}>
                          {TILLS.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label">Balance Amount</label>
                      <div className="ci-form-control"><input className="ci-input ci-input--money" value={rec.balanceAmount} readOnly style={{ background: 'var(--bank-bg-alt)' }} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label">Type Of Service</label>
                      <div className="ci-form-control">
                        <select className="ci-select" value={rec.typeOfService} disabled={isDisabled} onChange={e => patch({ typeOfService: e.target.value })}>
                          {SERVICES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label">Reference No</label>
                      <div className="ci-form-control"><input className="ci-input" value={rec.referenceNo} disabled={isDisabled} onChange={e => patch({ referenceNo: e.target.value })} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label">Cheque ID</label>
                      <div className="ci-form-control"><input className="ci-input" value={rec.chequeId} disabled={isDisabled} onChange={e => patch({ chequeId: e.target.value })} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label">Currency ID</label>
                      <div className="ci-form-control"><input className="ci-input" value={rec.currencyId} disabled={isDisabled} onChange={e => patch({ currencyId: e.target.value })} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label ci-form-label--required">Beneficiary Name</label>
                      <div className="ci-form-control"><input className="ci-input" value={rec.beneficiaryName} disabled={isDisabled} onChange={e => patch({ beneficiaryName: e.target.value })} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label">Narration</label>
                      <div className="ci-form-control"><input className="ci-input" value={rec.narration} disabled={isDisabled} onChange={e => patch({ narration: e.target.value })} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label ci-form-label--required">Transaction Amount</label>
                      <div className="ci-form-control"><input className="ci-input ci-input--money" value={rec.transactionAmount} disabled={isDisabled} onChange={e => patch({ transactionAmount: e.target.value })} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label ci-form-label--required">Exchange Rate</label>
                      <div className="ci-form-control"><input className="ci-input ci-input--money" value={rec.exchangeRate} disabled={isDisabled} onChange={e => patch({ exchangeRate: e.target.value })} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label">Local Amount</label>
                      <div className="ci-form-control"><input className="ci-input ci-input--money" value={rec.localAmount} readOnly style={{ background: 'var(--bank-bg-alt)' }} /></div>
                    </div>
                    <div className="ci-form-row">
                      <label className="ci-form-label">Forex Gain/Loss</label>
                      <div className="ci-form-control"><input className="ci-input ci-input--money" value={rec.forexGainLoss} readOnly style={{ background: 'var(--bank-bg-alt)' }} /></div>
                    </div>
                  </div>
                  <div className="sit-txn-actions">
                    {['New','Alter','Remove','Update','Clear'].map(btn => (
                      <button key={btn} className="ci-btn ci-btn--sm ci-btn--close" onClick={() => showToast(`${btn} action`)}>{btn}</button>
                    ))}
                  </div>
                  <div className="ci-panel" style={{ marginTop: 10 }}>
                    <div className="ci-panel__header">Transaction Details</div>
                    <div className="ci-panel__body">
                      {txnRows.length === 0
                        ? <p className="ci-table-empty" style={{ color: 'var(--bank-error)', fontStyle: 'normal', fontWeight: 600 }}>This Account Is Not Active [No:130024]</p>
                        : <table className="ci-data-table"><thead><tr><th>Trx ID</th><th>Amount</th><th>Status</th></tr></thead><tbody>{txnRows.map((r,i) => <tr key={i}><td>{r.id}</td><td>{r.amount}</td><td>{r.status}</td></tr>)}</tbody></table>
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <ActionButtons mode={mode}
          onView={() => setMode('view')} onAdd={() => setMode('add')}
          onEdit={() => setMode('edit')} onClose={() => setMode('view')}
          onSave={() => { setMode('view'); showToast('Account closing processed'); }}
          onCancel={() => setMode('view')} />
      </div>
      {toast && <div className={`ci-toast ci-toast--${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};
export default AccountClosing;
