import React from 'react';
import type { LoanCurrentStatus } from '@types/loan.types';

interface CurrentStatusTabProps {
  data: LoanCurrentStatus;
  disabled: boolean;
  onChange: (patch: Partial<LoanCurrentStatus>) => void;
}

const fmt = (v: string | number) => {
  const n = typeof v === 'string' ? parseFloat(v) || 0 : v;
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const DisplayVal: React.FC<{ value: string | number; negative?: boolean }> = ({ value, negative }) => (
  <div className={`bk-display-num ${negative ? 'bk-display-num--negative' : ''}`}>
    {negative ? `(${fmt(value)})` : fmt(value)}
  </div>
);

const CurrentStatusTab: React.FC<CurrentStatusTabProps> = ({ data, disabled, onChange }) => (
  <div className="bk-panel">
    <div className="bk-panel__header">Current Status</div>
    <div className="bk-panel__body">
      <div className="bk-form-2col">

        <div className="bk-form-row">
          <label className="bk-form-label">Loan Balance</label>
          <div className="bk-form-control"><DisplayVal value={data.loanBalance} negative /></div>
          <label className="bk-form-label">Loan Amount</label>
          <div className="bk-form-control"><DisplayVal value={data.loanAmount} /></div>
        </div>

        <div className="bk-form-row">
          <label className="bk-form-label">Disbursed Amount</label>
          <div className="bk-form-control"><DisplayVal value={data.disbursedAmount} /></div>
          <label className="bk-form-label">Disbursed Date (1st)</label>
          <div className="bk-form-control">
            <div className="bk-display-num">{data.disbursedDate || '—'}</div>
          </div>
        </div>

        <div className="bk-form-row">
          <label className="bk-form-label">Unearned Interest</label>
          <div className="bk-form-control"><DisplayVal value={data.unearnedInterest} /></div>
          <label className="bk-form-label">Outstanding Principal</label>
          <div className="bk-form-control"><DisplayVal value={data.outstandingPrincipal} /></div>
        </div>

        <div className="bk-form-row">
          <label className="bk-form-label">Overdue Interest</label>
          <div className="bk-form-control"><DisplayVal value={data.overdueInterest} /></div>
          <label className="bk-form-label">Outstanding Interest</label>
          <div className="bk-form-control"><DisplayVal value={data.outstandingInterest} /></div>
        </div>

        <div className="bk-form-row">
          <label className="bk-form-label">Overdue Principal</label>
          <div className="bk-form-control"><DisplayVal value={data.overduePrincipal} /></div>
          <label className="bk-form-label">Overdue Penalty Receivable</label>
          <div className="bk-form-control"><DisplayVal value={data.overduePenaltyReceivable} /></div>
        </div>

        <div className="bk-form-row">
          <label className="bk-form-label">Total Loan Amount</label>
          <div className="bk-form-control"><DisplayVal value={data.totalLoanAmount} /></div>
          <label className="bk-form-label">Arrear Days</label>
          <div className="bk-form-control">
            <div className="bk-display-num">{data.arrearDays ?? 0}</div>
          </div>
        </div>

        <div className="bk-form-row">
          <label className="bk-form-label">Last Rescheduled On</label>
          <div className="bk-form-control">
            <input className="bk-input" type="date" value={data.lastRescheduledOn || ''}
              disabled={disabled}
              onChange={e => onChange({ lastRescheduledOn: e.target.value })} />
          </div>
          <label className="bk-form-label">Loan Status</label>
          <div className="bk-form-control">
            <span className={`bk-badge ${data.loanStatus === 'Normal' ? 'bk-badge--success' : 'bk-badge--warning'}`}>
              {data.loanStatus}
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default CurrentStatusTab;