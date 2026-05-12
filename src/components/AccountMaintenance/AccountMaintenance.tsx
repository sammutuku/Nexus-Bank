import React, { useState, useCallback } from 'react';
import { useModuleTab } from '../../hooks/useModuleTab';
import type { AppMode } from '../../types/customer.types';
import SearchButton from '../shared/SearchModal/SearchButton';
import ActionButtons from '../ui/ActionButtons';

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

type SubModal = 'documents' | 'signatories' | 'sigJointLimits' | 'closing' |
  'blockUnblock' | 'migrateClient' | 'specialConditions' | 'accountNotes' | 'legal' |
  'statementView' | 'clientPortfolio' | null;

const SIDEBAR_ITEMS = {
  DataEntry: [
    { key: 'documents',        label: 'Documents' },
    { key: 'signatories',      label: 'Signatories' },
    { key: 'sigJointLimits',   label: 'Signatories Joint Limits' },
    { key: 'closing',          label: 'Closing' },
    { key: 'blockUnblock',     label: 'Blocking / Unblocking' },
    { key: 'migrateClient',    label: 'Migrate Client' },
    { key: 'specialConditions',label: 'Special Conditions' },
    { key: 'accountNotes',     label: 'Account Notes' },
    { key: 'legal',            label: 'Legal' },
  ],
  View: [
    { key: 'statementView',   label: 'Statement View' },
    { key: 'clientPortfolio', label: 'Client Portfolio' },
  ],
} as const;

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

const LW = 140;

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> =
  ({ label, required, children }) => (
    <div className="bk-form-row">
      <label
        className={`bk-form-label ${required ? 'bk-form-label--required' : ''}`}
        style={{ width: LW, minWidth: LW }}
      >
        {label}{required && <span className="bk-text-required"> *</span>}
      </label>
      <div className="bk-form-control">{children}</div>
    </div>
  );

const ReadField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bk-form-row">
    <label className="bk-form-label" style={{ width: LW, minWidth: LW }}>{label}</label>
    <div className="bk-form-control">
      <span className="am-readonly">{value}</span>
    </div>
  </div>
);

const AccountMaintenance: React.FC = () => {
  const { closeMe } = useModuleTab(1300);
  const [rec, setRec] = useState<AccountRecord>({ ...INITIAL });
  const [mode, setMode] = useState<AppMode>('view');
  const [subModal, setSubModal] = useState<SubModal>(null);
  const [activeSidebar, setActiveSidebar] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(true);
  const [specialConditions, setSpecialConditions] = useState<boolean[]>(
    () => new Array(SPECIAL_CONDITIONS.length).fill(false)
  );
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const isDisabled = mode === 'view';
  const patch = useCallback((p: Partial<AccountRecord>) => setRec(r => ({ ...r, ...p })), []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => { setMode('view'); showToast('Account record saved'); };
  const handleAdd  = () => { setRec({ ...INITIAL }); setMode('add'); };
  const handleEdit = () => { if (mode === 'view') setMode('edit'); };
  const handleView = () => setMode('view');
  const handleClose = () => { setMode('view'); showToast('Changes discarded'); };
  const handleCancel = () => (mode === 'add' ? handleAdd() : setMode('view'));

  const openSub = (key: string) => {
    setActiveSidebar(key);
    setSubModal(key as SubModal);
  };

  return (
    <div className="bk-root">
      <div className="bk-title-bar">
        <span className="bk-title-bar__icon">🏦</span>
        <span className="bk-title-bar__text">Account Maintenance — Account servicing</span>
        <span className="bk-title-bar__close" onClick={closeMe} title="Close" role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && closeMe()}>✕</span>
      </div>

      <div className="bk-layout">
        <div className={`bk-sidebar-wrap${sidebarOpen ? '' : ' bk-sidebar-wrap--collapsed'}`}>
          <nav id="am-subnav" className="bk-sidebar" aria-label="Account maintenance navigation">
            {(['DataEntry', 'View'] as const).map(section => (
              <React.Fragment key={section}>
                <div className="bk-sidebar__section-header">{section}</div>
                {SIDEBAR_ITEMS[section].map(item => (
                  <div
                    key={item.key}
                    className={`bk-sidebar__item ${activeSidebar === item.key ? 'bk-sidebar__item--active' : ''}`}
                    onClick={() => openSub(item.key)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter') openSub(item.key); }}
                  >
                    {item.label}
                  </div>
                ))}
              </React.Fragment>
            ))}
            <div className="bk-sidebar__footer">BANTU MENU</div>
          </nav>
          <button
            type="button"
            className="bk-shell-toggle bk-shell-toggle--between-main-and-sidebar"
            aria-expanded={sidebarOpen}
            aria-controls="am-subnav"
            title={sidebarOpen ? 'Hide sub menu' : 'Show sub menu'}
            onClick={() => setSidebarOpen(o => !o)}
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>

        <main className="bk-main">
          <header className="bk-header">
            <div className="bk-header__grid">
              <div className="bk-header__row">
                <span className="bk-header__label">Branch ID</span>
                <span className="bk-header__value" style={{ width: 50 }}>{rec.branchId}</span>
                <input
                  className="bk-header__input"
                  value={rec.branchName}
                  disabled={isDisabled}
                  onChange={e => patch({ branchName: e.target.value })}
                />
                <SearchButton
                  entityType="branch"
                  disabled={isDisabled}
                  title="Search branch"
                  className="bk-header__search-btn"
                  onSelect={r => patch({ branchId: r.branchId, branchName: r.branchName })}
                />
              </div>
              <div className="bk-header__row">
                <span className="bk-header__label bk-text-required">Client ID</span>
                <input
                  className="bk-header__input"
                  value={rec.clientId}
                  disabled={isDisabled}
                  onChange={e => patch({ clientId: e.target.value })}
                />
                <SearchButton
                  entityType="client"
                  disabled={isDisabled}
                  title="Lookup client"
                  className="bk-header__search-btn"
                  onSelect={r => patch({ clientId: r.clientId, clientName: r.name })}
                />
              </div>
              <div className="bk-header__row" style={{ gridColumn: '1 / -1' }}>
                <span className="bk-header__label">Client Name</span>
                <input
                  className="bk-header__input"
                  style={{ flex: 1 }}
                  value={rec.clientName}
                  disabled={isDisabled}
                  onChange={e => patch({ clientName: e.target.value })}
                />
              </div>
              <div className="bk-header__row">
                <span className="bk-header__label bk-text-required">Product</span>
                <input className="bk-header__input" style={{ width: 72 }} value={rec.productId} disabled={isDisabled}
                  onChange={e => patch({ productId: e.target.value })} />
                <input className="bk-header__input" value={rec.productName} disabled={isDisabled}
                  onChange={e => patch({ productName: e.target.value })} />
                <SearchButton
                  entityType="product"
                  disabled={isDisabled}
                  title="Search product"
                  className="bk-header__search-btn"
                  onSelect={r => patch({ productId: r.productId, productName: r.productName })}
                />
              </div>
              <div className="bk-header__row">
                <span className="bk-header__label bk-text-required">Account No.</span>
                <input
                  className="bk-header__input"
                  value={rec.accountNumber}
                  disabled={isDisabled}
                  onChange={e => patch({ accountNumber: e.target.value })}
                />
                <SearchButton
                  entityType="account"
                  disabled={isDisabled}
                  title="Search account"
                  className="bk-header__search-btn"
                  onSelect={r => patch({ accountNumber: r.accountId })}
                />
              </div>
            </div>
          </header>

          <div className="bk-tab-content">
            <div className="bk-panel">
              <div className="bk-panel__header">Account Details</div>
              <div className="bk-panel__body">
                <div className="bk-form-grid">
                  <div>
                    <Field label="Short Name">
                      <input className="bk-input" value={rec.shortName} disabled={isDisabled}
                        onChange={e => patch({ shortName: e.target.value })} />
                    </Field>
                    <Field label="Address 1" required>
                      <input className="bk-input" value={rec.address1} disabled={isDisabled}
                        onChange={e => patch({ address1: e.target.value })} />
                    </Field>
                    <Field label="Address 2">
                      <input className="bk-input" value={rec.address2} disabled={isDisabled}
                        onChange={e => patch({ address2: e.target.value })} />
                    </Field>
                    <Field label="City/Area">
                      <select className="bk-select" value={rec.cityArea} disabled={isDisabled}
                        onChange={e => patch({ cityArea: e.target.value })}>
                        <option value="">--Select--</option>
                        <option>Kampala</option><option>Fort Portal</option>
                        <option>Kasese</option><option>Hoima</option>
                      </select>
                    </Field>
                    <Field label="Phone #1">
                      <input className="bk-input" value={rec.phone1} disabled={isDisabled}
                        onChange={e => patch({ phone1: e.target.value })} />
                    </Field>
                    <Field label="Fax No">
                      <input className="bk-input" value={rec.faxNo} disabled={isDisabled}
                        onChange={e => patch({ faxNo: e.target.value })} />
                    </Field>
                  </div>
                  <div>
                    <Field label="Email ID">
                      <input className="bk-input" type="email" value={rec.emailId} disabled={isDisabled}
                        onChange={e => patch({ emailId: e.target.value })} />
                    </Field>
                    <Field label="Phone #2">
                      <input className="bk-input" value={rec.phone2} disabled={isDisabled}
                        onChange={e => patch({ phone2: e.target.value })} />
                    </Field>
                    <Field label="Mobile">
                      <input className="bk-input" value={rec.mobile} disabled={isDisabled}
                        onChange={e => patch({ mobile: e.target.value })} />
                    </Field>
                    <Field label="Contact Person">
                      <input className="bk-input" value={rec.contactPerson} disabled={isDisabled}
                        onChange={e => patch({ contactPerson: e.target.value })} />
                    </Field>
                    <Field label="Operating Instructions">
                      <input className="bk-input" value={rec.operatingInstructions} disabled={isDisabled}
                        onChange={e => patch({ operatingInstructions: e.target.value })} />
                    </Field>
                    <Field label="Account Officer">
                      <select className="bk-select" value={rec.accountOfficer} disabled={isDisabled}
                        onChange={e => patch({ accountOfficer: e.target.value })}>
                        <option value="">--Select--</option>
                        <option>BANTU</option><option>KAO106</option>
                      </select>
                    </Field>
                    <Field label="Operating Mode" required>
                      <select className="bk-select" value={rec.operatingMode} disabled={isDisabled}
                        onChange={e => patch({ operatingMode: e.target.value })}>
                        <option value="">--Select--</option>
                        <option>Self</option><option>Joint</option><option>Either</option>
                      </select>
                    </Field>
                    <Field label="Account Class" required>
                      <select className="bk-select" value={rec.accountClass} disabled={isDisabled}
                        onChange={e => patch({ accountClass: e.target.value })}>
                        <option value="">--Select--</option>
                        <option>Personal</option><option>Corporate</option><option>Group</option>
                      </select>
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            <div className="bk-panel">
              <div className="bk-panel__header">Balances &amp; limits</div>
              <div className="bk-panel__body">
                <div className="bk-form-grid">
                  <div>
                    <ReadField label="Unclear Balance"       value={rec.unclearBalance} />
                    <ReadField label="Currency ID"           value={rec.currencyId} />
                    <ReadField label="Un Supervised Credits" value={rec.unSupervisedCredits} />
                    <ReadField label="Total Balance"         value={rec.totalBalance} />
                    <ReadField label="Un Supervised Debits"  value={rec.unSupervisedDebits} />
                    <ReadField label="Minimum Balance"       value={rec.minimumBalance} />
                  </div>
                  <div>
                    <ReadField label="Freeze Amount"         value={rec.freezeAmount} />
                    <Field label="Open Date">
                      <input className="bk-input" value={rec.openDate} disabled={isDisabled}
                        onChange={e => patch({ openDate: e.target.value })} />
                    </Field>
                    <ReadField label="Drawing Power"         value={rec.drawingPower} />
                    <ReadField label="Deposit Balance"       value={rec.depositBalance} />
                  </div>
                </div>
              </div>
            </div>

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

          <div className="bk-mode-bar">
            <span className={`bk-mode-badge bk-mode-badge--${mode}`}>
              {mode === 'add'  && '✚ ADD MODE'}
              {mode === 'edit' && '✎ EDIT MODE'}
              {mode === 'view' && '👁 VIEW MODE'}
            </span>
            {rec.accountNumber && (
              <span className="bk-client-id-display">
                Account: <strong>{rec.accountNumber}</strong>
                {rec.clientName && ` — ${rec.clientName}`}
              </span>
            )}
          </div>
        </main>

        <div className={`bk-actions-wrap${actionsOpen ? '' : ' bk-actions-wrap--collapsed'}`}>
          <div className="bk-actions-wrap__inner">
            <div className="bk-record-nav">
              <div className="bk-record-nav__group">
                <button type="button" className="bk-record-nav__arrow" title="Previous client">◀</button>
                <span className="bk-record-nav__label">Client</span>
                <button type="button" className="bk-record-nav__arrow" title="Next client">▶</button>
              </div>
              <div className="bk-record-nav__group">
                <button type="button" className="bk-record-nav__arrow" title="Previous account">◀</button>
                <span className="bk-record-nav__label">Account</span>
                <button type="button" className="bk-record-nav__arrow" title="Next account">▶</button>
              </div>
            </div>
            <ActionButtons
              mode={mode}
              onView={handleView} onAdd={handleAdd} onEdit={handleEdit}
              onClose={handleClose} onSave={handleSave} onCancel={handleCancel}
            />
          </div>
          <button
            type="button"
            className="bk-shell-toggle bk-shell-toggle--between-main-and-actions"
            aria-expanded={actionsOpen}
            title={actionsOpen ? 'Hide actions' : 'Show actions'}
            onClick={() => setActionsOpen(o => !o)}
          >
            {actionsOpen ? '»' : '«'}
          </button>
        </div>
      </div>

      {subModal === 'specialConditions' && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--lg" role="dialog" aria-modal="true" aria-labelledby="am-sc-title">
            <div className="bk-modal__header">
              <div className="bk-modal__title" id="am-sc-title">
                <span className="bk-modal__title-icon">⚙</span>
                Special Conditions
              </div>
              <button type="button" className="bk-modal__close" onClick={() => setSubModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body" style={{ padding: 0 }}>
              <div className="bk-kin-table-wrapper" style={{ margin: 0, border: 'none', borderRadius: 0 }}>
                <table className="bk-data-table">
                  <thead>
                    <tr>
                      <th className="bk-th" style={{ width: 36 }}>#</th>
                      <th className="bk-th">Description</th>
                      <th className="bk-th" style={{ width: 80 }}>Value</th>
                      <th className="bk-th" style={{ width: 70 }}>Selected</th>
                      <th className="bk-th" style={{ width: 120 }}>Detail Values</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPECIAL_CONDITIONS.map((cond, i) => (
                      <tr key={cond} className={i % 2 === 1 ? 'bk-row--alt' : ''}>
                        <td className="bk-td bk-cell--number">{i + 1}</td>
                        <td className="bk-td">{cond}</td>
                        <td className="bk-td">
                          {['Apply Special Credit Interest Rate', 'Apply Special Debit Interest Rate',
                            'Apply Special Service Charges', 'Increase Drawing Power',
                            'Special Overdraft Accrual Rate', 'Reschedule Loan With Zero Interest (0)']
                            .includes(cond)
                            ? <span className="bk-text-sm" style={{ color: 'var(--bank-text-muted)' }}>
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
                            <input className="bk-input" style={{ width: '100%', height: 26, fontSize: 'var(--font-size-xs)' }} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bk-modal__footer">
              <div className="bk-modal-footer-btns">
                <button type="button" className="bk-btn bk-btn--save" onClick={() => { showToast('Special conditions saved'); setSubModal(null); }}>✔ Save</button>
                <button type="button" className="bk-btn bk-btn--cancel" onClick={() => setSubModal(null)}>✕ Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subModal === 'blockUnblock' && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--md" role="dialog" aria-modal="true">
            <div className="bk-modal__header">
              <div className="bk-modal__title">
                <span className="bk-modal__title-icon">🔒</span>
                Blocking / Unblocking
              </div>
              <button type="button" className="bk-modal__close" onClick={() => setSubModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body">
              <div className="bk-panel">
                <div className="bk-panel__body">
                  <div className="bk-form-row">
                    <label className="bk-form-label bk-form-label--required" style={{ width: LW, minWidth: LW }}>Reason</label>
                    <div className="bk-form-control">
                      <select className="bk-select"><option value="">--Select--</option>
                        <option>Legal Hold</option><option>Fraud Suspicion</option>
                        <option>Customer Request</option><option>Dormant</option></select>
                    </div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label" style={{ width: LW, minWidth: LW }}>Description</label>
                    <div className="bk-form-control"><input className="bk-input" /></div>
                  </div>
                  <div className="bk-form-row">
                    <label className="bk-form-label bk-form-label--required" style={{ width: LW, minWidth: LW }}>Instruction Given By</label>
                    <div className="bk-form-control"><input className="bk-input" /></div>
                  </div>
                </div>
              </div>
              <div className="bk-panel">
                <div className="bk-panel__header">Behind The Scene</div>
                <div className="bk-panel__body">
                  <div className="bk-form-grid">
                    <div>
                      <ReadField label="Previous Status" value="" />
                      <ReadField label="Date" value="" />
                      <ReadField label="Reason ID" value="" />
                    </div>
                    <div>
                      <ReadField label="Description" value="" />
                      <ReadField label="Instruction Given By" value="" />
                      <ReadField label="Created By" value="" />
                      <ReadField label="Supervised By" value="" />
                      <ReadField label="Created On" value="" />
                      <ReadField label="Supervised On" value="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bk-modal__footer">
              <div className="bk-modal-footer-btns">
                <button type="button" className="bk-btn bk-btn--save" onClick={() => { showToast('Block/Unblock instruction saved'); setSubModal(null); }}>✔ Save</button>
                <button type="button" className="bk-btn bk-btn--cancel" onClick={() => setSubModal(null)}>✕ Cancel</button>
                <button type="button" className="bk-btn bk-btn--view" onClick={() => showToast('History loaded')}>History</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subModal === 'migrateClient' && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--sm" role="dialog" aria-modal="true">
            <div className="bk-modal__header">
              <div className="bk-modal__title">
                <span className="bk-modal__title-icon">🔀</span>
                Migrate Client
              </div>
              <button type="button" className="bk-modal__close" onClick={() => setSubModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body">
              <div className="bk-form-row">
                <label className="bk-form-label bk-form-label--required" style={{ width: LW, minWidth: LW }}>To Branch ID</label>
                <div className="bk-form-control">
                  <select className="bk-select">
                    <option value="">--Select--</option>
                    <option>00 - HEAD OFFICE</option><option>01 - FORT PORTAL BRANCH</option>
                    <option>02 - BUNDIBUGYO BRANCH</option>
                  </select>
                </div>
              </div>
              <div className="bk-form-row">
                <label className="bk-form-label" style={{ width: LW, minWidth: LW }}>Remarks</label>
                <div className="bk-form-control"><input className="bk-input" /></div>
              </div>
            </div>
            <div className="bk-modal__footer">
              <div className="bk-modal-footer-btns">
                <button type="button" className="bk-btn bk-btn--save" onClick={() => { showToast('Client migration initiated'); setSubModal(null); }}>✔ Save</button>
                <button type="button" className="bk-btn bk-btn--cancel" onClick={() => setSubModal(null)}>✕ Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subModal === 'accountNotes' && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--md" role="dialog" aria-modal="true">
            <div className="bk-modal__header">
              <div className="bk-modal__title">
                <span className="bk-modal__title-icon">📝</span>
                Account Notes
              </div>
              <button type="button" className="bk-modal__close" onClick={() => setSubModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body">
              <textarea className="bk-textarea" rows={12} placeholder="Enter account notes here..." style={{ width: '100%' }} />
              <div className="bk-form-grid" style={{ marginTop: 12 }}>
                <div>
                  <ReadField label="Created By" value="" />
                  <ReadField label="Modified By" value="" />
                  <ReadField label="Supervised By" value="" />
                </div>
                <div>
                  <ReadField label="Created On" value="" />
                  <ReadField label="Modified On" value="" />
                  <ReadField label="Supervised On" value="" />
                </div>
              </div>
            </div>
            <div className="bk-modal__footer">
              <div className="bk-modal-footer-btns">
                <button type="button" className="bk-btn bk-btn--save" onClick={() => { showToast('Notes saved'); setSubModal(null); }}>✔ Save</button>
                <button type="button" className="bk-btn bk-btn--cancel" onClick={() => setSubModal(null)}>✕ Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subModal && !['specialConditions','blockUnblock','migrateClient','accountNotes'].includes(subModal) && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--md" role="dialog" aria-modal="true">
            <div className="bk-modal__header">
              <div className="bk-modal__title">
                {SIDEBAR_ITEMS.DataEntry.concat(SIDEBAR_ITEMS.View).find(i => i.key === subModal)?.label ?? subModal}
              </div>
              <button type="button" className="bk-modal__close" onClick={() => setSubModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body bk-empty-state" style={{ minHeight: 200 }}>
              <span className="bk-empty-state__icon">🔧</span>
              <p style={{ fontWeight: 600 }}>
                {SIDEBAR_ITEMS.DataEntry.concat(SIDEBAR_ITEMS.View).find(i => i.key === subModal)?.label}
              </p>
              <small className="bk-empty-state__text">Component not yet implemented</small>
            </div>
            <div className="bk-modal__footer">
              <button type="button" className="bk-btn bk-btn--close" onClick={() => setSubModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`bk-toast bk-toast--${toast.type}`}>
          {toast.type === 'success' ? '✔' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AccountMaintenance;
