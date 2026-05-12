import React, { useEffect } from 'react';
import { OCCUPATIONS, DESIGNATIONS, MONTHS, YEARS } from '../../../constants/customer.constants';
import type { EmploymentDetails, EmploymentType } from '../../../types/customer.types';

interface Props {
  data: EmploymentDetails;
  disabled: boolean;
  onChange: (patch: Partial<EmploymentDetails>) => void;
}

const LW = 150;

const Row: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({
  label, required, children,
}) => (
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

const MoneyInput: React.FC<{
  label: string; value: string; disabled: boolean;
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
        value={value}
        disabled={disabled || readOnly}
        readOnly={readOnly}
        style={readOnly ? { background: 'var(--bank-bg-alt)', fontWeight: 600 } : {}}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  </Row>
);

const EmploymentTab: React.FC<Props> = ({ data, disabled, onChange }) => {
  const set = (k: keyof EmploymentDetails) => (v: string) => onChange({ [k]: v });

  // Auto-calculate totals
  useEffect(() => {
    const gross    = parseFloat(data.grossIncome)   || 0;
    const family   = parseFloat(data.familyIncome)  || 0;
    const other    = parseFloat(data.otherIncome)   || 0;
    const rent     = parseFloat(data.rentExpenses)  || 0;
    const otherExp = parseFloat(data.otherExpenses) || 0;

    const totalIncome   = gross + family + other;
    const totalExpenses = rent + otherExp;
    const netSavings    = totalIncome - totalExpenses;

    onChange({
      totalIncome:   totalIncome   !== 0 ? String(totalIncome)   : '',
      totalExpenses: totalExpenses !== 0 ? String(totalExpenses) : '',
      netSavings:    netSavings    !== 0 ? String(netSavings)    : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data.grossIncome, data.familyIncome, data.otherIncome,
    data.rentExpenses, data.otherExpenses,
  ]);

  return (
    <div className="bk-panel">
      <div className="bk-panel__header">Employment Details</div>
      <div className="bk-panel__body">

        {/* Employment type toggle */}
        <div className="bk-employment-type-row">
          <label className="bk-radio-label">
            <input
              type="radio"
              className="bk-radio"
              name="empType"
              value="Salaried"
              checked={data.employmentType === 'Salaried'}
              disabled={disabled}
              onChange={() => onChange({ employmentType: 'Salaried' })}
            />
            <span>Salaried</span>
          </label>
          <label className="bk-radio-label">
            <input
              type="radio"
              className="bk-radio"
              name="empType"
              value="Self Employed"
              checked={data.employmentType === 'Self Employed'}
              disabled={disabled}
              onChange={() => onChange({ employmentType: 'Self Employed' })}
            />
            <span>Self Employed</span>
          </label>
        </div>

        <div className="bk-form-grid">
          {/* LEFT */}
          <div>
            <Row label="Occupation">
              <select className="bk-select" value={data.occupation} disabled={disabled}
                onChange={e => set('occupation')(e.target.value)}>
                <option value="">--Select--</option>
                {OCCUPATIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </Row>

            <Row label="Name of Institution">
              <input className="bk-input" value={data.nameOfInstitution} disabled={disabled}
                onChange={e => set('nameOfInstitution')(e.target.value)} />
            </Row>

            <Row label="Institution Details">
              <input className="bk-input" value={data.institutionDetails} disabled={disabled}
                onChange={e => set('institutionDetails')(e.target.value)} />
            </Row>

            <Row label="Work Permit No">
              <input className="bk-input" value={data.workPermitNo} disabled={disabled}
                onChange={e => set('workPermitNo')(e.target.value)} />
            </Row>

            <div className="bk-expenses-divider">
              <span className="bk-expenses-divider__label">Expenses (Monthly)</span>
            </div>

            <MoneyInput label="Rent Expenses"  value={data.rentExpenses}  disabled={disabled} onChange={set('rentExpenses')} />
            <MoneyInput label="Other Expenses" value={data.otherExpenses} disabled={disabled} onChange={set('otherExpenses')} />
            <MoneyInput label="Total Expenses" value={data.totalExpenses} disabled={disabled} onChange={set('totalExpenses')} readOnly />
          </div>

          {/* RIGHT */}
          <div>
            <Row label="Designation">
              <select className="bk-select" value={data.designation} disabled={disabled}
                onChange={e => set('designation')(e.target.value)}>
                <option value="">--Select--</option>
                {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Row>

            <Row label="Working Since">
              <div className="bk-date-group">
                <select className="bk-select" value={data.workingSince} disabled={disabled}
                  onChange={e => set('workingSince')(e.target.value)} style={{ minWidth: 68 }}>
                  <option value="">--Month--</option>
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
                <select className="bk-select" value={''} disabled={disabled} style={{ minWidth: 75 }}>
                  <option value="">--Year--</option>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </Row>

            <Row label="&nbsp;" />

            <Row label="&nbsp;" />

            <div className="bk-expenses-divider">
              <span className="bk-expenses-divider__label">Income (Monthly)</span>
            </div>

            <MoneyInput label="Gross Income"   value={data.grossIncome}   disabled={disabled} onChange={set('grossIncome')} />
            <MoneyInput label="Family Income"  value={data.familyIncome}  disabled={disabled} onChange={set('familyIncome')} />
            <MoneyInput label="Other Income"   value={data.otherIncome}   disabled={disabled} onChange={set('otherIncome')} />
            <MoneyInput label="Total Income"   value={data.totalIncome}   disabled={disabled} onChange={set('totalIncome')} readOnly />
            <MoneyInput label="Net Savings"    value={data.netSavings}    disabled={disabled} onChange={set('netSavings')} readOnly />
          </div>
        </div>

        <p className="bk-note">* All figures are monthly based</p>
      </div>
    </div>
  );
};

export default EmploymentTab;
