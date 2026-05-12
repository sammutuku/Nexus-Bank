import React from 'react';
import type { LoanDetails } from '@types/loan.types';

interface LoanDetailsTabProps {
  data: LoanDetails;
  disabled: boolean;
  onChange: (patch: Partial<LoanDetails>) => void;
}

const LW = 180;

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
  value: string;
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
        value={value}
        disabled={disabled || readOnly}
        readOnly={readOnly}
        style={readOnly ? { background: 'var(--bank-bg-alt)', fontWeight: 600 } : {}}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </Row>
);

const LoanDetailsTab: React.FC<LoanDetailsTabProps> = ({ data, disabled, onChange }) => {
  const set = (k: keyof LoanDetails) => (v: string) => onChange({ [k]: v });

  return (
    <div className="bk-panel">
      <div className="bk-panel__header">Loan Details</div>
      <div className="bk-panel__body">
        <div className="bk-form-grid">
          {/* LEFT COLUMN */}
          <div>
            {/* Product ID */}
            <Row label="Product ID">
              <input
                className="bk-input"
                type="text"
                value={data.productId}
                disabled={disabled}
                onChange={(e) => set('productId')(e.target.value)}
              />
            </Row>

            {/* Currency ID */}
            <Row label="Currency ID">
              <select
                className="bk-select"
                value={data.currencyId}
                disabled={disabled}
                onChange={(e) => set('currencyId')(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="UGX">UGX - Ugandan Shilling</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </Row>

            {/* Sanction Amount */}
            <MoneyInput
              label="Sanction Amount"
              value={data.sanctionAmount}
              disabled={disabled}
              onChange={set('sanctionAmount')}
            />

            {/* Sanction Date */}
            <Row label="Sanction Date">
              <input
                className="bk-input"
                type="date"
                value={data.sanctionDate}
                disabled={disabled}
                onChange={(e) => set('sanctionDate')(e.target.value)}
              />
            </Row>

            {/* Booked Amount */}
            <MoneyInput
              label="Booked Amount"
              value={data.bookedAmount}
              disabled={disabled}
              onChange={set('bookedAmount')}
            />

            {/* Term (months) */}
            <Row label="Term (Months)">
              <input
                className="bk-input"
                type="number"
                min="0"
                value={data.term}
                disabled={disabled}
                onChange={(e) => set('term')(e.target.value)}
              />
            </Row>

            {/* Repayment Frequency */}
            <Row label="Repayment Frequency">
              <select
                className="bk-select"
                value={data.repaymentFrequency}
                disabled={disabled}
                onChange={(e) => set('repaymentFrequency')(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annual">Annual</option>
              </select>
            </Row>

            {/* Calculation Method */}
            <Row label="Calculation Method">
              <select
                className="bk-select"
                value={data.calculationMethod}
                disabled={disabled}
                onChange={(e) => set('calculationMethod')(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="Reducing">Reducing</option>
                <option value="Flat">Flat</option>
                <option value="Annuity">Annuity</option>
              </select>
            </Row>

            {/* Net Collateral Value */}
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
            {/* Interest Rate Type */}
            <Row label="Interest Rate Type">
              <select
                className="bk-select"
                value={data.interestRateType}
                disabled={disabled}
                onChange={(e) => set('interestRateType')(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="Absolute Rate">Absolute Rate</option>
                <option value="Floating Rate">Floating Rate</option>
                <option value="Tiered Rate">Tiered Rate</option>
              </select>
            </Row>

            {/* Mark Up Rate */}
            <Row label="Mark Up Rate (%)">
              <input
                className="bk-input"
                type="number"
                min="0"
                step="0.01"
                value={data.markUpRate}
                disabled={disabled}
                onChange={(e) => set('markUpRate')(e.target.value)}
              />
            </Row>

            {/* Interest Rate */}
            <Row label="Interest Rate (%)">
              <input
                className="bk-input"
                type="number"
                min="0"
                step="0.01"
                value={data.interestRate}
                disabled={disabled}
                onChange={(e) => set('interestRate')(e.target.value)}
              />
            </Row>

            {/* Installment Start Date */}
            <Row label="Installment Start Date">
              <input
                className="bk-input"
                type="date"
                value={data.installmentStartDate}
                disabled={disabled}
                onChange={(e) => set('installmentStartDate')(e.target.value)}
              />
            </Row>

            {/* Value Date */}
            <Row label="Value Date">
              <input
                className="bk-input"
                type="date"
                value={data.valueDate}
                disabled={disabled}
                onChange={(e) => set('valueDate')(e.target.value)}
              />
            </Row>

            {/* Maturity Date */}
            <Row label="Maturity Date">
              <input
                className="bk-input"
                type="date"
                value={data.maturityDate}
                disabled={disabled}
                onChange={(e) => set('maturityDate')(e.target.value)}
              />
            </Row>

            {/* Installment Amount */}
            <MoneyInput
              label="Installment Amount"
              value={data.installmentAmount}
              disabled={disabled}
              onChange={set('installmentAmount')}
              readOnly
            />

            {/* Accrued Interest Unpaid */}
            <MoneyInput
              label="Accrued Interest Unpaid"
              value={data.accruedInterestUnpaid}
              disabled={disabled}
              onChange={set('accruedInterestUnpaid')}
              readOnly
            />

            {/* Grace Days */}
            <Row label="Grace Days">
              <input
                className="bk-input"
                type="number"
                min="0"
                value={data.graceDays}
                disabled={disabled}
                onChange={(e) => set('graceDays')(e.target.value)}
              />
            </Row>

            {/* Grace Period */}
            <Row label="Grace Period (Months)">
              <input
                className="bk-input"
                type="number"
                min="0"
                value={data.gracePeriod}
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
