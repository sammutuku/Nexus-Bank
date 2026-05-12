import React, { useState, useCallback } from 'react';
import { useModuleTab } from '@hooks/useModuleTab';
import ActionButtons from '../ui/ActionButtons';
import ModuleSidebar from '../shared/ModuleSidebar';
import AccountHeader from './AccountHeader';
import StatementView from './modals/StatementView';
import ClientPortfolio from './modals/ClientPortfolio';
import AccountNotes from './modals/AccountNotes';

type AppMode = 'view' | 'add' | 'edit';

interface AccountRecord {
  branchId: string; branchName: string;
  clientId: string; clientName: string;
  productId: string; productName: string;
  accountNumber: string;
  shortName: string; address1: string; address2: string;
  cityArea: string; country: string; phone1: string;
  faxNo: string; emailId: string; phone2: string;
  mobile: string; contactPerson: string;
  operatingInstructions: string; accountOfficer: string;
  operatingMode: string; accountClass: string;
  unclearBalance: string; unSupervisedCredits: string;
  unSupervisedDebits: string; freezeAmount: string;
  drawingPower: string; currencyId: string;
  totalBalance: string; minimumBalance: string;
  openDate: string; depositBalance: string;
  createdBy: string; createdOn: string;
  supervisedBy: string; supervisedOn: string;
}

const INITIAL: AccountRecord = {
  branchId: '00', branchName: 'HEAD OFFICE',
  clientId: '', clientName: '', productId: '', productName: '',
  accountNumber: '', shortName: '', address1: '', address2: '',
  cityArea: '', country: '', phone1: '', faxNo: '', emailId: '',
  phone2: '', mobile: '', contactPerson: '', operatingInstructions: '',
  accountOfficer: '', operatingMode: '', accountClass: '',
  unclearBalance: '', unSupervisedCredits: '', unSupervisedDebits: '',
  freezeAmount: '', drawingPower: '', currencyId: 'UGX',
  totalBalance: '', minimumBalance: '', openDate: '', depositBalance: '',
  createdBy: '', createdOn: '', supervisedBy: '', supervisedOn: '',
};

// SubModal is now just the module ID (number) of the selected child, or null
type SubModal = number | null;

// Sidebar items are now driven dynamically from the registry lock-parent tree.
// ModuleSidebar reads children of lockModuleId=1300 from moduleRegistry.
// The subModal key is the module ID as a number (e.g. 1305 = Account Notes).
// Known modals still rendered inline; unknowns fall through to the generic placeholder.

const SPECIAL_CONDITIONS = [
  'Reverse Written Off Recovery', 'Apply Special Credit Interest Rate',
  'Apply Special Debit Interest Rate', 'Do Not Charge The Customer With Service Charge',
  'Do Not Charge The Customer With Cheque Book Charges',
  'Do Not Charge The Customer With Stop Payment Charges',
  'Print Account Statement Only On Request', 'Set Account Opening Fee To 5000',
  'Reschedule Loan With Zero Interest (0)', 'Suspend Interest In This Account',
  'Special Overdraft Accrual Rate', 'Exempt Account From Debit Interest',
  'Exempt Account From Credit Interest', 'Apply Special Service Charges',
  'Increase Drawing Power', 'Stop Penalty Accrual', 'Stop Interest Accrual',
  'Loan Under Litigation', 'Mark Account For WriteOff',
  'Excempt Account Opening Charges', 'Force Loan Repayment On Installment Date',
  'Do Not Allow Any Credit Transactions', 'Do Not Allow Any Debit Transactions',
  'Account Should Never Go In Credit',
];

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; wide?: boolean }> =
  ({ label, required, children, wide }) => (
    <div className={`am-field ${wide ? 'am-field--wide' : ''}`}>
      <label className={`am-label ${required ? 'am-label--req' : ''}`}>{label}</label>
      {children}
    </div>
  );

const ReadField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="am-field">
    <label className="am-label">{label}</label>
    <span className="am-readonly">{value}</span>
  </div>
);

const AccountMaintenance: React.FC = () => {
  const { closeMe } = useModuleTab(1300);
  const [rec, setRec] = useState<AccountRecord>({ ...INITIAL });
  const [mode, setMode] = useState<AppMode>('view');
  const [subModal, setSubModal] = useState<SubModal>(null);
  const [subModalName, setSubModalName] = useState<string>('');
  const [activeSidebar, setActiveSidebar] = useState('');

  // ── Panel visibility — collapsed by default for maximum workspace ───────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  const [specialConditions, setSpecialConditions] = useState<boolean[]>(
    new Array(SPECIAL_CONDITIONS.length).fill(false)
  );
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const isDisabled = mode === 'view';
  const patch = useCallback((p: Partial<AccountRecord>) => setRec(r => ({ ...r, ...p })), []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave   = () => { setMode('view'); showToast('Account record saved'); };
  const handleAdd    = () => { setRec({ ...INITIAL }); setMode('add'); };
  const handleEdit   = () => { if (mode === 'view') setMode('edit'); };
  const handleView   = () => setMode('view');
  const handleClose  = () => { setMode('view'); showToast('Changes discarded'); };
  const handleCancel = () => (mode === 'add' ? handleAdd() : setMode('view'));

  const openSub = (moduleId: number, name: string) => {
    setActiveSidebar(String(moduleId));
    setSubModal(moduleId);
    setSubModalName(name);
  };

  return (
    <div className="bk-root">
      {/* Title bar */}
      <div className="bk-title-bar">
        <span className="bk-title-bar__icon">🏦</span>
        <span className="bk-title-bar__text">Account Maintenance</span>
        <span className="bk-title-bar__close" onClick={closeMe} title="Close">✕</span>
      </div>

      <div className="bk-layout">

        {/* ── Collapsible left sidebar (collapsed by default) ── */}
        <div className={`bk-sidebar-wrap${sidebarOpen ? '' : ' bk-sidebar-wrap--collapsed'}`}>
          <ModuleSidebar
            lockModuleId={1300}
            activeSidebar={activeSidebar}
            onSelect={openSub}
          />
          <button
            type="button"
            className="bk-shell-toggle bk-shell-toggle--between-main-and-sidebar"
            aria-expanded={sidebarOpen}
            title={sidebarOpen ? 'Hide sub menu' : 'Show sub menu'}
            onClick={() => setSidebarOpen(o => !o)}
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>

        {/* ── Main content ── */}
        <main className="bk-main">

          {/* ── Uniform header — matches CI-KYC Onboarding pattern ── */}
          <AccountHeader
            rec={rec}
            disabled={isDisabled}
            onChange={patch}
          />

          <div className="bk-tab-content">

            {/* Account Details */}
            <div className="bk-panel">
              <div className="bk-panel__header">Account Details</div>
              <div className="bk-panel__body">
                <div className="bk-form-2col">
                  <div className="bk-form-row">
                    <label className="bk-form-label">Short Name</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.shortName} disabled={isDisabled}
                        onChange={e => patch({ shortName: e.target.value })} />
                    </div>
                    <label className="bk-form-label bk-form-label--required">Address 1</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.address1} disabled={isDisabled}
                        onChange={e => patch({ address1: e.target.value })} />
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Address 2</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.address2} disabled={isDisabled}
                        onChange={e => patch({ address2: e.target.value })} />
                    </div>
                    <label className="bk-form-label">City/Area</label>
                    <div className="bk-form-control">
                      <select className="bk-select" value={rec.cityArea} disabled={isDisabled}
                        onChange={e => patch({ cityArea: e.target.value })}>
                        <option value="">--Select--</option>
                        <option>Kampala</option><option>Fort Portal</option>
                        <option>Kasese</option><option>Hoima</option>
                      </select>
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Phone #1</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.phone1} disabled={isDisabled}
                        onChange={e => patch({ phone1: e.target.value })} />
                    </div>
                    <label className="bk-form-label">Fax No</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.faxNo} disabled={isDisabled}
                        onChange={e => patch({ faxNo: e.target.value })} />
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Email ID</label>
                    <div className="bk-form-control">
                      <input className="bk-input" type="email" value={rec.emailId} disabled={isDisabled}
                        onChange={e => patch({ emailId: e.target.value })} />
                    </div>
                    <label className="bk-form-label">Phone #2</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.phone2} disabled={isDisabled}
                        onChange={e => patch({ phone2: e.target.value })} />
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Mobile</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.mobile} disabled={isDisabled}
                        onChange={e => patch({ mobile: e.target.value })} />
                    </div>
                    <label className="bk-form-label">Contact Person</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.contactPerson} disabled={isDisabled}
                        onChange={e => patch({ contactPerson: e.target.value })} />
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Operating Instructions</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.operatingInstructions} disabled={isDisabled}
                        onChange={e => patch({ operatingInstructions: e.target.value })} />
                    </div>
                    <label className="bk-form-label">Account Officer</label>
                    <div className="bk-form-control">
                      <select className="bk-select" value={rec.accountOfficer} disabled={isDisabled}
                        onChange={e => patch({ accountOfficer: e.target.value })}>
                        <option value="">--Select--</option>
                        <option>BANTU</option><option>KAO106</option>
                      </select>
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label bk-form-label--required">Operating Mode</label>
                    <div className="bk-form-control">
                      <select className="bk-select" value={rec.operatingMode} disabled={isDisabled}
                        onChange={e => patch({ operatingMode: e.target.value })}>
                        <option value="">--Select--</option>
                        <option>Self</option><option>Joint</option><option>Either</option>
                      </select>
                    </div>
                    <label className="bk-form-label bk-form-label--required">Account Class</label>
                    <div className="bk-form-control">
                      <select className="bk-select" value={rec.accountClass} disabled={isDisabled}
                        onChange={e => patch({ accountClass: e.target.value })}>
                        <option value="">--Select--</option>
                        <option>Personal</option><option>Corporate</option><option>Group</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bk-panel">
              <div className="bk-panel__header">Additional Information</div>
              <div className="bk-panel__body">
                <div className="bk-form-2col">
                  <div className="bk-form-row">
                    <label className="bk-form-label">Unclear Balance</label>
                    <div className="bk-form-control"><span className="am-readonly">{rec.unclearBalance}</span></div>
                    <label className="bk-form-label">Currency ID</label>
                    <div className="bk-form-control"><span className="am-readonly">{rec.currencyId}</span></div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Un Supervised Credits</label>
                    <div className="bk-form-control"><span className="am-readonly">{rec.unSupervisedCredits}</span></div>
                    <label className="bk-form-label">Total Balance</label>
                    <div className="bk-form-control"><span className="am-readonly">{rec.totalBalance}</span></div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Un Supervised Debits</label>
                    <div className="bk-form-control"><span className="am-readonly">{rec.unSupervisedDebits}</span></div>
                    <label className="bk-form-label">Minimum Balance</label>
                    <div className="bk-form-control"><span className="am-readonly">{rec.minimumBalance}</span></div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Freeze Amount</label>
                    <div className="bk-form-control"><span className="am-readonly">{rec.freezeAmount}</span></div>
                    <label className="bk-form-label">Open Date</label>
                    <div className="bk-form-control">
                      <input className="bk-input" value={rec.openDate} disabled={isDisabled}
                        onChange={e => patch({ openDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Drawing Power</label>
                    <div className="bk-form-control"><span className="am-readonly">{rec.drawingPower}</span></div>
                    <label className="bk-form-label">Deposit Balance</label>
                    <div className="bk-form-control"><span className="am-readonly">{rec.depositBalance}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit */}
            <div className="bk-audit">
              <div className="bk-audit__header">Audit Information</div>
              <div className="bk-audit__grid">
                <div className="bk-audit__row">
                  <span className="bk-audit__label">Created By</span>
                  <span className="bk-audit__value">{rec.createdBy}</span>
                  <span className="bk-audit__label">Created On</span>
                  <span className="bk-audit__value">{rec.createdOn}</span>
                  <span className="bk-audit__label">Supervised By</span>
                  <span className="bk-audit__value">{rec.supervisedBy}</span>
                  <span className="bk-audit__label">Supervised On</span>
                  <span className="bk-audit__value">{rec.supervisedOn}</span>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* ── Collapsible right action rail (icon-only when collapsed) ── */}
        <div className={`bk-actions-wrap${actionsOpen ? '' : ' bk-actions-wrap--collapsed'}`}>
          <button
            type="button"
            className="bk-shell-toggle bk-shell-toggle--between-main-and-actions"
            aria-expanded={actionsOpen}
            title={actionsOpen ? 'Collapse action panel' : 'Expand action panel'}
            onClick={() => setActionsOpen(o => !o)}
          >
            {actionsOpen ? '»' : '«'}
          </button>
          <div className="bk-actions-wrap__inner">
            {/* Record nav — Client / Account prev-next */}
            <div className="bk-record-nav">
              <div className="bk-record-nav__group">
                <button className="bk-record-nav__arrow" title="Previous client">◀</button>
                <span className="bk-record-nav__label">CLIENT</span>
                <button className="bk-record-nav__arrow" title="Next client">▶</button>
              </div>
              <div className="bk-record-nav__group">
                <button className="bk-record-nav__arrow" title="Previous account">◀</button>
                <span className="bk-record-nav__label">ACCOUNT</span>
                <button className="bk-record-nav__arrow" title="Next account">▶</button>
              </div>
            </div>
            <ActionButtons
              mode={mode}
              isCollapsed={!actionsOpen}
              onView={handleView}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onClose={handleClose}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>

      </div>

      {/* ════════════════════════ SUB-MODALS ════════════════════════════════════ */}

      {subModal === 2044 && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--md">
            <div className="bk-modal__header">
              <div className="bk-modal__title">
                <span className="bk-modal__title-icon">⚙</span>Special Conditions
              </div>
              <button className="bk-modal__close" onClick={() => setSubModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body" style={{ padding: 0 }}>
              <table className="bk-data-table">
                <thead>
                  <tr>
                    <th className="bk-th" style={{ width: 36 }}>#</th>
                    <th className="bk-th">Description</th>
                    <th className="bk-th" style={{ width: 80 }}>Value</th>
                    <th className="bk-th" style={{ width: 60 }}>Selected</th>
                    <th className="bk-th" style={{ width: 120 }}>Detail Values</th>
                  </tr>
                </thead>
                <tbody>
                  {SPECIAL_CONDITIONS.map((cond, i) => (
                    <tr key={i} className={i % 2 === 1 ? 'bk-row--alt' : ''}>
                      <td className="bk-td bk-cell--number">{i + 1}</td>
                      <td className="bk-td">{cond}</td>
                      <td className="bk-td">
                        {['Apply Special Credit Interest Rate', 'Apply Special Debit Interest Rate',
                          'Apply Special Service Charges', 'Increase Drawing Power',
                          'Special Overdraft Accrual Rate', 'Reschedule Loan With Zero Interest (0)']
                          .includes(cond)
                          ? <span style={{ fontSize: 11, color: 'var(--bank-text-muted)' }}>
                              {cond.includes('Interest Rate') || cond.includes('Accrual') ? 'Rate' : 'Amount'}
                            </span>
                          : null}
                      </td>
                      <td className="bk-td" style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className="bk-checkbox"
                          checked={specialConditions[i]}
                          onChange={e => {
                            const copy = [...specialConditions];
                            copy[i] = e.target.checked;
                            setSpecialConditions(copy);
                          }}
                        />
                      </td>
                      <td className="bk-td">
                        {specialConditions[i] && (
                          <input className="bk-input bk-btn--sm" style={{ width: '100%' }} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bk-modal__footer">
              <div className="bk-modal-footer-btns">
                <button className="bk-btn bk-btn--save"
                  onClick={() => { showToast('Special conditions saved'); setSubModal(null); }}>✔ Save</button>
                <button className="bk-btn bk-btn--cancel" onClick={() => setSubModal(null)}>✕ Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subModal === 1420 && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--md">
            <div className="bk-modal__header">
              <div className="bk-modal__title">
                <span className="bk-modal__title-icon">🔒</span>Blocking / Unblocking
              </div>
              <button className="bk-modal__close" onClick={() => setSubModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body">
              <div className="bk-panel">
                <div className="bk-panel__body">
                  <div className="bk-form-row">
                    <label className="bk-form-label bk-form-label--required">Reason</label>
                    <div className="bk-form-control">
                      <select className="bk-select">
                        <option value="">--Select--</option>
                        <option>Legal Hold</option><option>Fraud Suspicion</option>
                        <option>Customer Request</option><option>Dormant</option>
                      </select>
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label">Description</label>
                    <div className="bk-form-control"><input className="bk-input" /></div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label bk-form-label--required">Instruction Given By</label>
                    <div className="bk-form-control"><input className="bk-input" /></div>
                  </div>
                </div>
              </div>
              <div className="bk-panel">
                <div className="bk-panel__header">Behind The Scene</div>
                <div className="bk-panel__body">
                  <div className="am-form-grid">
                    <ReadField label="Previous Status" value="" />
                    <ReadField label="Date" value="" />
                    <ReadField label="Reason ID" value="" />
                    <ReadField label="Description" value="" />
                    <ReadField label="Instruction Given By" value="" />
                    <div />
                    <ReadField label="Created By" value="" />
                    <ReadField label="Supervised By" value="" />
                    <ReadField label="Created On" value="" />
                    <ReadField label="Supervised On" value="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bk-modal__footer">
              <div className="bk-modal-footer-btns">
                <button className="bk-btn bk-btn--save"
                  onClick={() => { showToast('Block/Unblock instruction saved'); setSubModal(null); }}>✔ Save</button>
                <button className="bk-btn bk-btn--cancel" onClick={() => setSubModal(null)}>✕ Cancel</button>
                <button className="bk-btn bk-btn--view"
                  onClick={() => showToast('History loaded')}>History</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subModal === 1430 && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--sm">
            <div className="bk-modal__header">
              <div className="bk-modal__title">
                <span className="bk-modal__title-icon">🔀</span>Migrate Client
              </div>
              <button className="bk-modal__close" onClick={() => setSubModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body">
              <div className="bk-form-row">
                <label className="bk-form-label bk-form-label--required">To Branch ID</label>
                <div className="bk-form-control">
                  <select className="bk-select">
                    <option value="">--Select--</option>
                    <option>00 - HEAD OFFICE</option>
                    <option>01 - FORT PORTAL BRANCH</option>
                    <option>02 - BUNDIBUGYO BRANCH</option>
                  </select>
                </div>
              </div>
              <div className="bk-form-row">
                <label className="bk-form-label">Remarks</label>
                <div className="bk-form-control"><input className="bk-input" /></div>
              </div>
            </div>
            <div className="bk-modal__footer">
              <div className="bk-modal-footer-btns">
                <button className="bk-btn bk-btn--save"
                  onClick={() => { showToast('Client migration initiated'); setSubModal(null); }}>✔ Save</button>
                <button className="bk-btn bk-btn--cancel" onClick={() => setSubModal(null)}>✕ Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subModal === 1305 && (
        <AccountNotes
          branchId={rec.branchId}
          accountNumber={rec.accountNumber}
          clientName={rec.clientName}
          onClose={() => setSubModal(null)}
          showToast={showToast}
        />
      )}

      {subModal === 1500 && (
        <StatementView
          branchId={rec.branchId}
          accountNumber={rec.accountNumber}
          clientName={rec.clientName}
          onClose={() => setSubModal(null)}
        />
      )}

      {subModal === 1525 && (
        <ClientPortfolio
          branchId={rec.branchId}
          accountNumber={rec.accountNumber}
          clientName={rec.clientName}
          onClose={() => setSubModal(null)}
        />
      )}

      {subModal !== null && ![2044, 1420, 1430, 1305, 1500, 1525].includes(subModal) && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--md">
            <div className="bk-modal__header">
              <div className="bk-modal__title">
                {subModalName || `Module ${subModal}`}
              </div>
              <button className="bk-modal__close" onClick={() => setSubModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 200, color: 'var(--bank-text-muted)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔧</div>
                <p style={{ fontWeight: 600 }}>
                  {SIDEBAR_ITEMS.DataEntry.concat(SIDEBAR_ITEMS.View)
                    .find(i => i.key === subModal)?.label}
                </p>
                <small>Component not yet implemented</small>
              </div>
            </div>
            <div className="bk-modal__footer">
              <button className="bk-btn bk-btn--close" onClick={() => setSubModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`bk-toast bk-toast--${toast.type}`}>
          {toast.type === 'success' ? '✔' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AccountMaintenance;