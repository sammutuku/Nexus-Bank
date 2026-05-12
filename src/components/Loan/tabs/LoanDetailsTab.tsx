import React from 'react';
import type { LoanDetails } from '@types/loan.types';

interface LoanDetailsTabProps {
  data: LoanDetails;
  disabled: boolean;
  onChange: (patch: Partial<LoanDetails>) => void;
}

const LoanDetailsTab: React.FC<LoanDetailsTabProps> = ({ data, disabled, onChange }) => {
  const set = (k: keyof LoanDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ [k]: e.target.value });

  return (
    <div className="bk-panel">
      <div className="bk-panel__header">Loan Details</div>
      <div className="bk-panel__body">
        <div className="bk-form-2col">

          <div className="bk-form-row">
            <label className="bk-form-label">Product ID</label>
            <div className="bk-form-control">
              <input className="bk-input" value={data.productId || ''} disabled={disabled}
                placeholder="e.g., WASH" onChange={set('productId')} />
            </div>
            <label className="bk-form-label">Interest Rate Type</label>
            <div className="bk-form-control">
              <select className="bk-select" value={data.interestRateType || ''} disabled={disabled}
                onChange={set('interestRateType')}>
                <option value="">--Select--</option>
                <option>Absolute Rate</option>
                <option>Base Rate</option>
                <option>Prime Rate</option>
              </select>
            </div>
          </div>

          <div className="bk-form-row">
            <label className="bk-form-label">Currency ID</label>
            <div className="bk-form-control">
              <input className="bk-input" value={data.currencyId || ''} disabled={disabled}
                placeholder="e.g., UGX" onChange={set('currencyId')} />
            </div>
            <label className="bk-form-label">Mark Up Rate</label>
            <div className="bk-form-control">
              <div className="bk-input-pct">
                <input className="bk-input" type="number" min="0" step="0.01"
                  value={data.markUpRate || 0} disabled={disabled}
                  onChange={set('markUpRate')} />
                <span className="bk-input-pct__suffix">%</span>
              </div>
            </div>
          </div>

          <div className="bk-form-row">
            <label className="bk-form-label">Sanction Amount</label>
            <div className="bk-form-control">
              <div className="bk-input-ugx">
                <span className="bk-input-ugx__prefix">UGX</span>
                <input className="bk-input" type="number" min="0" step="0.01"
                  value={data.sanctionAmount || 0} disabled={disabled}
                  onChange={set('sanctionAmount')} />
              </div>
            </div>
            <label className="bk-form-label">Interest Rate</label>
            <div className="bk-form-control">
              <div className="bk-input-pct">
                <input className="bk-input" type="number" min="0" step="0.01"
                  value={data.interestRate || 0} disabled={disabled}
                  onChange={set('interestRate')} />
                <span className="bk-input-pct__suffix">%</span>
              </div>
            </div>
          </div>

          <div className="bk-form-row">
            <label className="bk-form-label">Sanction Date</label>
            <div className="bk-form-control">
              <input className="bk-input" type="date" value={data.sanctionDate || ''}
                disabled={disabled} onChange={set('sanctionDate')} />
            </div>
            <label className="bk-form-label">Installment Start Date</label>
            <div className="bk-form-control">
              <input className="bk-input" type="date" value={data.installmentStartDate || ''}
                disabled={disabled} onChange={set('installmentStartDate')} />
            </div>
          </div>

          <div className="bk-form-row">
            <label className="bk-form-label">Booked Amount</label>
            <div className="bk-form-control">
              <div className="bk-input-ugx">
                <span className="bk-input-ugx__prefix">UGX</span>
                <input className="bk-input" type="number" min="0" step="0.01"
                  value={data.bookedAmount || 0} disabled={disabled}
                  onChange={set('bookedAmount')} />
              </div>
            </div>
            <label className="bk-form-label">Value Date</label>
            <div className="bk-form-control">
              <input className="bk-input" type="date" value={data.valueDate || ''}
                disabled={disabled} onChange={set('valueDate')} />
            </div>
          </div>

          <div className="bk-form-row">
            <label className="bk-form-label">Term (Months)</label>
            <div className="bk-form-control">
              <input className="bk-input" type="number" min="0" value={data.term || 0}
                disabled={disabled} onChange={set('term')} />
            </div>
            <label className="bk-form-label">Maturity Date</label>
            <div className="bk-form-control">
              <input className="bk-input" type="date" value={data.maturityDate || ''}
                disabled={disabled} onChange={set('maturityDate')} />
            </div>
          </div>

          <div className="bk-form-row">
            <label className="bk-form-label">Repayment Frequency</label>
            <div className="bk-form-control">
              <select className="bk-select" value={data.repaymentFrequency || ''}
                disabled={disabled} onChange={set('repaymentFrequency')}>
                <option value="">--Select--</option>
                <option>Weekly</option><option>Fortnightly</option>
                <option>Monthly</option><option>Quarterly</option>
                <option>Bi-Annual</option><option>Annual</option>
              </select>
            </div>
            <label className="bk-form-label">Installment Amount</label>
            <div className="bk-form-control">
              <div className="bk-display-num">{data.installmentAmount || '0.00'}</div>
            </div>
          </div>

          <div className="bk-form-row">
            <label className="bk-form-label">Calculation Method</label>
            <div className="bk-form-control">
              <select className="bk-select" value={data.calculationMethod || ''}
                disabled={disabled} onChange={set('calculationMethod')}>
                <option value="">--Select--</option>
                <option>Flat</option>
                <option>Reducing</option>
                <option>Simple Interest</option>
              </select>
            </div>
            <label className="bk-form-label">Grace Days</label>
            <div className="bk-form-control">
              <input className="bk-input" type="number" min="0" value={data.graceDays || 0}
                disabled={disabled} onChange={set('graceDays')} />
            </div>
          </div>

          <div className="bk-form-row">
            <label className="bk-form-label">Net Collateral Value</label>
            <div className="bk-form-control">
              <div className="bk-input-ugx">
                <span className="bk-input-ugx__prefix">UGX</span>
                <input className="bk-input" type="number" min="0" step="0.01"
                  value={data.netCollateralValue || 0} disabled={disabled}
                  onChange={set('netCollateralValue')} />
              </div>
            </div>
            <label className="bk-form-label">Grace Period</label>
            <div className="bk-form-control">
              <input className="bk-input" type="number" min="0" value={data.gracePeriod || 0}
                disabled={disabled} onChange={set('gracePeriod')} />
            </div>
          </div>

          <div className="bk-form-row">
            <label className="bk-form-label">Accrued Interest Unpaid</label>
            <div className="bk-form-control">
              <div className="bk-display-num">{data.accruedInterestUnpaid || '0.00'}</div>
            </div>
            <div /><div />
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoanDetailsTab;