import React, { useState, useCallback } from 'react';
import { useModuleTab } from '@hooks/useModuleTab';

import type {
  LoanRecord, AppMode, ModalType, ActiveTab,
  LoanCurrentStatus, LoanDetails,
} from '@types/loan.types';
import {
  INITIAL_LOAN,
} from '@constants/loan.constants';

import LoanSidebar from './LoanSidebar';
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
  const { closeMe } = useModuleTab(1000);

  // ── Core state ──────────────────────────────────────────────────────────────
  const [loan, setLoan] = useState<LoanRecord>({ ...INITIAL_LOAN });
  const [mode, setMode] = useState<AppMode>('view');
  const [activeTab, setActiveTab] = useState<ActiveTab>('currentStatus');
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [activeSidebar, setActiveSidebar] = useState('');

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

        {/* ── Collapsible sub-menu (collapsed by default) ── */}
        <div className={`bk-sidebar-wrap${sidebarOpen ? '' : ' bk-sidebar-wrap--collapsed'}`}>
          <LoanSidebar
            navId="loan-subnav"
            onOpenModal={setOpenModal}
            activeSidebar={activeSidebar}
            setActiveSidebar={setActiveSidebar}
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

        {/* ── Collapsible action rail (icon-only when collapsed) ── */}
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
