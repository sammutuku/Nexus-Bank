import React, { useState, useCallback } from 'react';
import { useModuleTab } from '@hooks/useModuleTab';

import type {
  LoanRecord, AppMode, ModalType, ActiveTab,
  LoanCurrentStatus, LoanDetails,
} from '@types/loan.types';
import { INITIAL_LOAN } from '@constants/loan.constants';

import ModuleSidebar from '../shared/ModuleSidebar';
import LoanHeader from './LoanHeader';
import AuditFooter from '../ui/AuditFooter';
import ActionButtons from '../ui/ActionButtons';

import CurrentStatusTab from './tabs/CurrentStatusTab';
import LoanDetailsTab from './tabs/LoanDetailsTab';

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'currentStatus', label: 'Current Status' },
  { id: 'loanDetails', label: 'Loan Details' },
];

const LoanMaintenance: React.FC = () => {
  const { closeMe } = useModuleTab(4300);

  // ── Core state ──────────────────────────────────────────────────────────────
  const [loan, setLoan] = useState<LoanRecord>({ ...INITIAL_LOAN });
  const [mode, setMode] = useState<AppMode>('view');
  const [activeTab, setActiveTab] = useState<ActiveTab>('currentStatus');
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [activeSidebar, setActiveSidebar] = useState('');
  const [subModalName, setSubModalName] = useState<string>('');

  // ── Panel visibility — collapsed by default for maximum workspace ───────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  // ── Toast ───────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    if (!loan.loanSeries) { showToast('Loan Series is required', 'error'); return false; }
    if (!loan.loanPurpose) { showToast('Loan Purpose is required', 'error'); return false; }
    if (!loan.accountNumber) { showToast('Account Number is required', 'error'); return false; }
    return true;
  };

  // ── Loan patch helpers ──────────────────────────────────────────────────────
  const patchLoan = useCallback((patch: Partial<LoanRecord>) =>
    setLoan(l => ({ ...l, ...patch })), []);

  const patchCurrentStatus = useCallback((patch: Partial<LoanCurrentStatus>) =>
    setLoan(l => ({ ...l, currentStatus: { ...l.currentStatus, ...patch } })), []);

  const patchLoanDetails = useCallback((patch: Partial<LoanDetails>) =>
    setLoan(l => ({ ...l, loanDetails: { ...l.loanDetails, ...patch } })), []);

  // ── CRUD actions ────────────────────────────────────────────────────────────
  const handleAdd = () => {
    setLoan({ ...INITIAL_LOAN });
    setMode('add');
    setActiveTab('currentStatus');
    showToast('Ready to add new loan record');
  };

  const handleEdit = () => { if (mode === 'view') setMode('edit'); };
  const handleSave = () => {
    if (!validate()) return;
    const now = new Date().toLocaleDateString('en-GB');
    setLoan(l => ({
      ...l,
      loanRefNo: l.loanRefNo || `LN${Date.now()}`,
      createdOn: l.createdOn || now,
      modifiedOn: now,
      createdBy: l.createdBy || 'SYSTEM',
    }));
    setMode('view');
    showToast('Loan record saved successfully');
  };

  const handleView = () => setMode('view');
  const handleClose = () => { setMode('view'); showToast('Changes discarded'); };
  const handleCancel = () => { if (mode === 'add') handleAdd(); else setMode('view'); };

  const isDisabled = mode === 'view';

  return (
    <div className="bk-root">
      {/* ── Title bar ── */}
      <div className="bk-title-bar">
        <span className="bk-title-bar__icon">💰</span>
        <span className="bk-title-bar__text">Loan Maintenance</span>
        <span className="bk-title-bar__close" onClick={closeMe} title="Close">✕</span>
      </div>

      <div className="bk-layout">

        {/* ── Collapsible sub-menu — driven by registry lock-parent tree ── */}
        <div className={`bk-sidebar-wrap${sidebarOpen ? '' : ' bk-sidebar-wrap--collapsed'}`}>
          <ModuleSidebar
            lockModuleId={4300}
            activeSidebar={activeSidebar}
            onSelect={(moduleId, name) => {
              setActiveSidebar(String(moduleId));
              setOpenModal(String(moduleId) as ModalType);
              setSubModalName(name);
            }}
          />
          <button
            type="button"
            className="bk-shell-toggle bk-shell-toggle--between-main-and-sidebar"
            aria-expanded={sidebarOpen}
            aria-controls="loan-subnav"
            title={sidebarOpen ? 'Hide sub menu' : 'Show sub menu'}
            onClick={() => setSidebarOpen(o => !o)}
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>

        {/* ── Main content ── */}
        <main className="bk-main">
          <LoanHeader
            loan={loan}
            disabled={isDisabled}
            onChange={patchLoan}
          />

          <div className="bk-section">
            <div className="bk-section-header">Additional Information</div>

            <div className="bk-tabs">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`bk-tab ${activeTab === tab.id ? 'bk-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bk-tab-content">
              {activeTab === 'currentStatus' && (
                <CurrentStatusTab
                  data={loan.currentStatus}
                  disabled={isDisabled}
                  onChange={patchCurrentStatus}
                />
              )}
              {activeTab === 'loanDetails' && (
                <LoanDetailsTab
                  data={loan.loanDetails}
                  disabled={isDisabled}
                  onChange={patchLoanDetails}
                />
              )}
            </div>
          </div>

          <div className="bk-mode-bar">
            <span className={`bk-mode-badge bk-mode-badge--${mode}`}>
              {mode === 'add' && '✚ ADD MODE'}
              {mode === 'edit' && '✎ EDIT MODE'}
              {mode === 'view' && '👁 VIEW MODE'}
            </span>
            {loan.loanRefNo && (
              <span className="bk-client-id-display">
                Loan Ref: <strong>{loan.loanRefNo}</strong>
                {loan.accountNumber && ` — Account: ${loan.accountNumber}`}
              </span>
            )}
          </div>

          <AuditFooter
            status={loan.status}
            openDate={loan.createdOn}
            closedDate={loan.closedDate}
            createdBy={loan.createdBy}
            modifiedBy={loan.modifiedBy}
            supervisedBy={loan.supervisedBy}
            createdOn={loan.createdOn}
            modifiedOn={loan.modifiedOn}
            supervisedOn={loan.supervisedOn}
          />
        </main>

        {/* ── Collapsible action rail ── */}
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
            {/* Record nav — Account / Series / Ref No (matches legacy) */}
            <div className="bk-record-nav">
              <div className="bk-record-nav__group">
                <button className="bk-record-nav__arrow" title="Previous account">◀</button>
                <span className="bk-record-nav__label">ACCOUNT</span>
                <button className="bk-record-nav__arrow" title="Next account">▶</button>
              </div>
              <div className="bk-record-nav__group">
                <button className="bk-record-nav__arrow" title="Previous series">◀</button>
                <span className="bk-record-nav__label">SERIES</span>
                <button className="bk-record-nav__arrow" title="Next series">▶</button>
              </div>
              <div className="bk-record-nav__group">
                <button className="bk-record-nav__arrow" title="Previous ref">◀</button>
                <span className="bk-record-nav__label">REF NO</span>
                <button className="bk-record-nav__arrow" title="Next ref">▶</button>
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

      {/* ── Generic placeholder modal for unimplemented sidebar modules ── */}
      {openModal && (
        <div className="bk-modal-overlay">
          <div className="bk-modal bk-modal--md">
            <div className="bk-modal__header">
              <div className="bk-modal__title">
                <span className="bk-modal__title-icon">🔧</span>
                {subModalName || `Module ${openModal}`}
              </div>
              <button className="bk-modal__close" onClick={() => setOpenModal(null)}>✕</button>
            </div>
            <div className="bk-modal__body" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200,
              color: 'var(--bank-text-muted)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔧</div>
                <p style={{ fontWeight: 600 }}>{subModalName}</p>
                <small>Component not yet implemented</small>
              </div>
            </div>
            <div className="bk-modal__footer">
              <button className="bk-btn bk-btn--close" onClick={() => setOpenModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`bk-toast bk-toast--${toast.type}`}>
          {toast.type === 'success' ? '✔' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default LoanMaintenance;