import React, { useState, useCallback } from 'react';
import { useModuleTab } from '../../hooks/useModuleTab';
import SearchButton from '../shared/SearchModal/SearchButton';
import ActionButtons from '../ui/ActionButtons';

type AppMode = 'view' | 'add' | 'edit';

const REMINDER_COLORS = ['--Select--', 'Red', 'Green', 'Blue', 'Yellow', 'Orange'];
const DATE_OPTIONS    = ['--Select--', 'Today', 'Tomorrow', 'Next Week', 'Custom'];

interface ReminderRecord {
  branchId: string; branchName: string;
  accountNumber: string; accountTitle: string;
  reminderId: string;
  reminder: string;
  reminderColor: string;
  fromDate: string;
  toDate: string;
  // Additional Information (read-only)
  clientId: string;
  address1: string; address2: string;
  cityArea: string; country: string;
  phone1: string;   phone2: string;
  mobile: string;   faxNo: string; emailId: string;
  // Audit
  createdBy: string; createdOn: string;
  modifiedBy: string; modifiedOn: string;
  supervisedBy: string; supervisedOn: string;
}

const INITIAL: ReminderRecord = {
  branchId: '01', branchName: 'FORT PORTAL BRANCH',
  accountNumber: '', accountTitle: '',
  reminderId: '',
  reminder: '',
  reminderColor: '',
  fromDate: '',
  toDate: '',
  clientId: '', address1: '', address2: '',
  cityArea: '', country: '', phone1: '', phone2: '',
  mobile: '', faxNo: '', emailId: '',
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

const AccountReminders: React.FC = () => {
  const { closeMe } = useModuleTab(1440);
  const [rec, setRec] = useState<ReminderRecord>({ ...INITIAL });
  const [mode, setMode] = useState<AppMode>('view');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const isDisabled = mode === 'view';
  const patch = useCallback((p: Partial<ReminderRecord>) => setRec(r => ({ ...r, ...p })), []);

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
    if (!rec.reminder.trim())      { showToast('Reminder text is required', 'error'); return; }
    setMode('view');
    showToast('Reminder saved successfully');
  };

  return (
    <div className="ci-root">
      <div className="ci-title-bar">
        <span className="ci-title-bar__icon">🔔</span>
        <span className="ci-title-bar__text">Reminders</span>
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

                  <Field label="Reminder ID">
                    <div className="am-input-group">
                      <input className="ci-input" value={rec.reminderId}
                        disabled={isDisabled} onChange={e => patch({ reminderId: e.target.value })} />
                      <SearchButton entityType="account" disabled={isDisabled}
                        className="bk-header__search-btn"
                        onSelect={r => patch({ reminderId: r.accountId })} />
                    </div>
                  </Field>

                </div>
              </div>
            </div>

            {/* ── Recommendation Details ── */}
            <div className="ci-panel">
              <div className="ci-panel__header">Recommendation Details</div>
              <div className="ci-panel__body">
                <div className="am-form-grid">

                  <Field label="Reminder" required wide>
                    <textarea className="ci-textarea" rows={4}
                      value={rec.reminder} disabled={isDisabled}
                      onChange={e => patch({ reminder: e.target.value })} />
                  </Field>

                  <Field label="Reminder Color" required>
                    <select className="ci-select" value={rec.reminderColor}
                      disabled={isDisabled} onChange={e => patch({ reminderColor: e.target.value })}>
                      {REMINDER_COLORS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>

                  <div /> {/* grid spacer */}

                  <Field label="From Date" required>
                    <select className="ci-select" value={rec.fromDate}
                      disabled={isDisabled} onChange={e => patch({ fromDate: e.target.value })}>
                      {DATE_OPTIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Field>

                  <Field label="To Date" required>
                    <select className="ci-select" value={rec.toDate}
                      disabled={isDisabled} onChange={e => patch({ toDate: e.target.value })}>
                      {DATE_OPTIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Field>

                </div>
              </div>
            </div>

            {/* ── Additional Information (read-only client data) ── */}
            <div className="ci-panel">
              <div className="ci-panel__header">Additional Information</div>
              <div className="ci-panel__body">
                <div className="am-form-grid">
                  <ReadField label="Client ID"  value={rec.clientId} />
                  <ReadField label="Address 1"  value={rec.address1} />
                  <ReadField label="Address 2"  value={rec.address2} />
                  <ReadField label="City/Area"  value={rec.cityArea} />
                  <ReadField label="Country"    value={rec.country} />
                  <ReadField label="Phone #1"   value={rec.phone1} />
                  <ReadField label="Phone #2"   value={rec.phone2} />
                  <ReadField label="Mobile"     value={rec.mobile} />
                  <ReadField label="Fax No"     value={rec.faxNo} />
                  <ReadField label="Email ID"   value={rec.emailId} />
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

export default AccountReminders;