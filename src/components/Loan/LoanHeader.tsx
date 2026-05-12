import React from 'react';
import SearchButton from '../shared/SearchModal/SearchButton';
import type { LoanRecord } from '@types/loan.types';

const LOAN_PURPOSES = [
  'Purchase Of Motor Cycle', 'Business Development', 'School Fees',
  'Agriculture', 'Medical', 'Housing', 'Asset Finance', 'Other',
];

const HEALTH_CODES  = ['Normal', 'Watch', 'Substandard', 'Doubtful', 'Loss'];
const LOAN_TYPES    = ['Normal/Direct', 'Group Loan', 'Overdraft', 'Micro Finance'];
const REPAY_METHODS = ['Transfer', 'Cash', 'Cheque', 'Standing Order'];

interface LoanHeaderProps {
  loan:     LoanRecord;
  disabled: boolean;
  onChange: (patch: Partial<LoanRecord>) => void;
}

const LoanHeader: React.FC<LoanHeaderProps> = ({ loan, disabled, onChange }) => (
  <header className="bk-header">
    <div className="bk-header__grid">

      {/* ── Row 1 left: Branch ID ── */}
      <div className="bk-header__row">
        <span className="bk-header__label">Branch ID</span>
        <span className="bk-header__value" style={{ width: 44 }}>{loan.branchId}</span>
        <input
          className="bk-header__input"
          value={loan.branchName}
          disabled={disabled}
          onChange={e => onChange({ branchName: e.target.value })}
        />
        <SearchButton
          entityType="branch"
          disabled={disabled}
          className="bk-header__search-btn"
          title="Search branch"
          onSelect={r => onChange({ branchId: r.branchId, branchName: r.branchName })}
        />
      </div>

      {/* ── Row 1 right: Client ID ── */}
      <div className="bk-header__row">
        <span className="bk-header__label" style={{ color: 'var(--bank-required)' }}>Client ID</span>
        <input
          className="bk-header__input"
          style={{ maxWidth: 120 }}
          value={loan.clientId}
          disabled={disabled}
          placeholder="Enter ID"
          onChange={e => onChange({ clientId: e.target.value })}
        />
        <input
          className="bk-header__input"
          value={loan.clientName}
          disabled
          placeholder="Client name"
          readOnly
        />
        <SearchButton
          entityType="client"
          disabled={disabled}
          className="bk-header__search-btn"
          title="Search client"
          onSelect={r => onChange({ clientId: r.clientId, clientName: r.name })}
        />
      </div>

      {/* ── Row 2 left: Account Number ── */}
      <div className="bk-header__row">
        <span className="bk-header__label" style={{ color: 'var(--bank-required)' }}>Account No.</span>
        <input
          className="bk-header__input"
          style={{ maxWidth: 140 }}
          value={loan.accountNumber}
          disabled={disabled}
          placeholder="Account number"
          onChange={e => onChange({ accountNumber: e.target.value })}
        />
        <input
          className="bk-header__input"
          value={loan.accountName ?? ''}
          disabled
          placeholder="Account name"
          readOnly
        />
        <SearchButton
          entityType="account"
          disabled={disabled}
          className="bk-header__search-btn"
          title="Search account"
          onSelect={r => onChange({ accountNumber: r.accountId })}
        />
      </div>

      {/* ── Row 2 right: Loan Series ── */}
      <div className="bk-header__row">
        <span className="bk-header__label" style={{ color: 'var(--bank-required)' }}>Loan Series</span>
        <input
          className="bk-header__input"
          value={loan.loanSeries}
          disabled={disabled}
          placeholder="Series"
          onChange={e => onChange({ loanSeries: e.target.value })}
        />
        <SearchButton
          entityType="loanSeries"
          disabled={disabled}
          className="bk-header__search-btn"
          title="Search loan series"
          onSelect={r => onChange({ loanSeries: r.seriesId })}
        />
      </div>

      {/* ── Row 3 left: Loan Ref No ── */}
      <div className="bk-header__row">
        <span className="bk-header__label">Loan Ref No.</span>
        <input
          className="bk-header__input"
          value={loan.loanRefNo}
          disabled={disabled}
          placeholder="Auto-generated on save"
          readOnly={!disabled ? false : true}
          onChange={e => onChange({ loanRefNo: e.target.value })}
        />
      </div>

      {/* ── Row 3 right: File Number ── */}
      <div className="bk-header__row">
        <span className="bk-header__label">File Number</span>
        <input
          className="bk-header__input"
          value={loan.fileNumber ?? ''}
          disabled={disabled}
          placeholder="File number"
          onChange={e => onChange({ fileNumber: e.target.value })}
        />
      </div>

    </div>

    {/* ── Loan detail strip (below the grid) ── */}
    <div className="bk-header-strip">

      <div className="bk-header__row">
        <span className="bk-header__label" style={{ color: 'var(--bank-required)' }}>Loan Purpose</span>
        <select
          className="bk-header__select"
          value={loan.loanPurpose}
          disabled={disabled}
          onChange={e => onChange({ loanPurpose: e.target.value })}
        >
          <option value="">--Select--</option>
          {LOAN_PURPOSES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="bk-header__row">
        <span className="bk-header__label">Health Code</span>
        <select
          className="bk-header__select"
          value={loan.healthCode ?? ''}
          disabled={disabled}
          onChange={e => onChange({ healthCode: e.target.value })}
        >
          <option value="">--Select--</option>
          {HEALTH_CODES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="bk-header__row">
        <span className="bk-header__label">Credit Officer</span>
        <input
          className="bk-header__input"
          value={loan.creditOfficer ?? ''}
          disabled={disabled}
          onChange={e => onChange({ creditOfficer: e.target.value })}
        />
      </div>

      <div className="bk-header__row">
        <span className="bk-header__label">Loan Type</span>
        <select
          className="bk-header__select"
          value={loan.loanType ?? ''}
          disabled={disabled}
          onChange={e => onChange({ loanType: e.target.value })}
        >
          <option value="">--Select--</option>
          {LOAN_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="bk-header__row">
        <span className="bk-header__label">Repay Method</span>
        <select
          className="bk-header__select"
          value={loan.repaymentMethod ?? ''}
          disabled={disabled}
          onChange={e => onChange({ repaymentMethod: e.target.value })}
        >
          <option value="">--Select--</option>
          {REPAY_METHODS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="bk-header__row">
        <span className="bk-header__label">Fund ID</span>
        <span className="bk-header__value" style={{ width: 44 }}>{loan.fundId ?? ''}</span>
        <input
          className="bk-header__input"
          value={loan.fundName ?? ''}
          disabled
          readOnly
          placeholder="Fund name"
        />
        <SearchButton
          entityType="fundId"
          disabled={disabled}
          className="bk-header__search-btn"
          title="Search fund"
          onSelect={r => onChange({ fundId: r.fundId, fundName: r.fundName })}
        />
      </div>

      <div className="bk-header__row">
        <span className="bk-header__label">Op. Account</span>
        <input
          className="bk-header__input"
          value={loan.operationalAccount ?? ''}
          disabled={disabled}
          placeholder="Operational account"
          onChange={e => onChange({ operationalAccount: e.target.value })}
        />
      </div>

    </div>
  </header>
);

export default LoanHeader;