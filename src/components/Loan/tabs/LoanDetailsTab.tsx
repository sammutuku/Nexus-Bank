import React from 'react';
import type { LoanDetails } from '@types/loan.types';

interface LoanDetailsTabProps {
  data: LoanDetails;
  disabled: boolean;
  onChange: (patch: Partial<LoanDetails>) => void;
}

const LW = 180; // Label Width for consistent alignment

const Row: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, required, children }) => (
  <div className="bk-form-row">
    <label
      className={`bk-form-label ${required ? 'bk-form-label--required' : ''}`}
      style={{ width: LW, minWidth: LW }}
    >
      {label}
      {required && <span className="bk-text-required"> *</span>}
    </label>
    <div className="bk-form-control">{children}</div>
  </div>
);

const MoneyInput: React.FC<{
  label: string;
  value: string | number;
  disabled: boolean;
  onChange: (v: string) => void;
  readOnly?: boolean;
}> = ({ label, value, disabled, onChange, readOnly }) => (
  <Row label={label}>
    <div className="bk-input-money-wrapper">
      <span className="bk-input-money-prefix">UGX</span>
      <input
        className="bk-input bk-input--money"
        type="number"
        min="0"
        step="0.01"
        value={value || 0}
        disabled={disabled || readOnly}
        readOnly={readOnly}
        style={readOnly ? { background: 'var(--bank-bg-alt)', fontWeight: 600 } : {}}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </Row>
);

const LoanDetailsTab: React.FC<LoanDetailsTabProps> = ({ data, disabled, onChange }) => {
  const set = (k: keyof LoanDetails) => (v: string | number) => onChange({ [k]: v });

  return (
    <div className="bk-panel">
      <div className="bk-panel__header">Loan Details</div>
      <div className="bk-panel__body">
        <div className="bk-form-grid">
          {/* LEFT COLUMN */}
          <div>
            <Row label="Product ID">
              <input
                className="bk-input"
                type="text"
                value={data.productId || ''}
                disabled={disabled}
                placeholder="e.g., WASH"
                onChange={(e) => set('productId')(e.target.value)}
              />
            </Row>

            <Row label="Currency ID">
              <select
                className="bk-select"
                value={data.currencyId || ''}
                disabled={disabled}
                onChange={(e) => set('currencyId')(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="UGX">UGX - Ugandan Shilling</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </Row>

            <MoneyInput
              label="Sanction Amount"
              value={data.sanctionAmount}
              disabled={disabled}
              onChange={set('sanctionAmount')}
            />

            <Row label="Sanction Date">
              <input
                className="bk-input"
                type="date"
                value={data.sanctionDate || ''}
                disabled={disabled}
                onChange={(e) => set('sanctionDate')(e.target.value)}
              />
            </Row>

            <MoneyInput
              label="Booked Amount"
              value={data.bookedAmount}
              disabled={disabled}
              onChange={set('bookedAmount')}
            />

            <Row label="Term (Months)">
              <input
                className="bk-input"
                type="number"
                min="0"
                value={data.term || 0}
                disabled={disabled}
                onChange={(e) => set('term')(e.target.value)}
              />
            </Row>

            <Row label="Repayment Frequency">
              <select
                className="bk-select"
                value={data.repaymentFrequency || ''}
                disabled={disabled}
                onChange={(e) => set('repaymentFrequency')(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="Weekly">Weekly</option>
                <option value="Fortnightly">Fortnightly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </select>
            </Row>

            <Row label="Calculation Method">
              <select
                className="bk-select"
                value={data.calculationMethod || ''}
                disabled={disabled}
                onChange={(e) => set('calculationMethod')(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="Reducing">Reducing</option>
                <option value="Flat">Flat</option>
                <option value="Simple Interest">Simple Interest</option>
              </select>
            </Row>

            <MoneyInput
              label="Net Collateral Value"
              value={data.netCollateralValue}
              disabled={disabled}
              onChange={set('netCollateralValue')}
              readOnly
            />
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <Row label="Interest Rate Type">
              <select
                className="bk-select"
                value={data.interestRateType || ''}
                disabled={disabled}
                onChange={(e) => set('interestRateType')(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="Absolute Rate">Absolute Rate</option>
                <option value="Base Rate">Base Rate</option>
                <option value="Prime Rate">Prime Rate</option>
              </select>
            </Row>

            <Row label="Mark Up Rate (%)">
              <input
                className="bk-input"
                type="number"
                min="0"
                step="0.01"
                value={data.markUpRate || 0}
                disabled={disabled}
                onChange={(e) => set('markUpRate')(e.target.value)}
              />
            </Row>

            <Row label="Interest Rate (%)">
              <input
                className="bk-input"
                type="number"
                min="0"
                step="0.01"
                value={data.interestRate || 0}
                disabled={disabled}
                onChange={(e) => set('interestRate')(e.target.value)}
              />
            </Row>

            <Row label="Installment Start Date">
              <input
                className="bk-input"
                type="date"
                value={data.installmentStartDate || ''}
                disabled={disabled}
                onChange={(e) => set('installmentStartDate')(e.target.value)}
              />
            </Row>

            <Row label="Value Date">
              <input
                className="bk-input"
                type="date"
                value={data.valueDate || ''}
                disabled={disabled}
                onChange={(e) => set('valueDate')(e.target.value)}
              />
            </Row>

            <Row label="Maturity Date">
              <input
                className="bk-input"
                type="date"
                value={data.maturityDate || ''}
                disabled={disabled}
                onChange={(e) => set('maturityDate')(e.target.value)}
              />
            </Row>

            <MoneyInput
              label="Installment Amount"
              value={data.installmentAmount}
              disabled={disabled}
              onChange={set('installmentAmount')}
              readOnly
            />

            <MoneyInput
              label="Accrued Interest Unpaid"
              value={data.accruedInterestUnpaid}
              disabled={disabled}
              onChange={set('accruedInterestUnpaid')}
              readOnly
            />

            <Row label="Grace Days">
              <input
                className="bk-input"
                type="number"
                min="0"
                value={data.graceDays || 0}
                disabled={disabled}
                onChange={(e) => set('graceDays')(e.target.value)}
              />
            </Row>

            <Row label="Grace Period (Months)">
              <input
                className="bk-input"
                type="number"
                min="0"
                value={data.gracePeriod || 0}
                disabled={disabled}
                onChange={(e) => set('gracePeriod')(e.target.value)}
              />
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsTab;