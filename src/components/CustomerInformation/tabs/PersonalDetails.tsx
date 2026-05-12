import React from 'react';
import {
  TITLES, GENDERS, NATIONALITIES, IDENTIFICATION_TYPES,
  DISABILITY_TYPES, MARITAL_STATUSES, LITERACY_LEVELS,
  RESIDENT_OPTIONS, MONTHS, DAYS, YEARS,
} from '../../../constants/customer.constants';
import type { PersonalDetails } from '../../../types/customer.types';

interface Props {
  data: PersonalDetails;
  disabled: boolean;
  onChange: (patch: Partial<PersonalDetails>) => void;
}

const LW = 160; // label width px

const Row: React.FC<{
  label: string; required?: boolean; lw?: number;
  children: React.ReactNode;
}> = ({ label, required, lw = LW, children }) => (
  <div className="bk-form-row">
    <label
      className={`bk-form-label ${required ? 'bk-form-label--required' : ''}`}
      style={{ width: lw, minWidth: lw }}
    >
      {label}{required && <span className="bk-text-required"> *</span>}
    </label>
    <div className="bk-form-control">{children}</div>
  </div>
);

const PersonalDetailsTab: React.FC<Props> = ({ data, disabled, onChange }) => {
  const set = (k: keyof PersonalDetails) => (v: string | boolean) =>
    onChange({ [k]: v });

  return (
    <>
      {/* ── Personal Details panel ── */}
      <div className="bk-panel">
        <div className="bk-panel__header">Personal Details</div>
        <div className="bk-panel__body">
          <div className="bk-form-grid">

            {/* LEFT COL */}
            <div>
              {/* Title */}
              <Row label="Title" required lw={LW}>
                <select className="bk-select" value={data.title} disabled={disabled}
                  onChange={e => set('title')(e.target.value)}>
                  {TITLES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Row>

              {/* Middle Name */}
              <Row label="Middle Name" lw={LW}>
                <input className="bk-input" value={data.middleName} disabled={disabled}
                  onChange={e => set('middleName')(e.target.value)} />
              </Row>

              {/* Gender */}
              <Row label="Gender" required lw={LW}>
                <select className="bk-select" value={data.gender} disabled={disabled}
                  onChange={e => set('gender')(e.target.value)}>
                  <option value="">--Select--</option>
                  {GENDERS.map(g => <option key={g}>{g}</option>)}
                </select>
              </Row>

              {/* Age */}
              <Row label="Age" lw={LW}>
                <input className="bk-input" value={data.age} disabled readOnly
                  style={{ background: 'var(--bank-bg-alt)' }} />
              </Row>

              {/* Nationality */}
              <Row label="Nationality" lw={LW}>
                <select className="bk-select" value={data.nationality} disabled={disabled}
                  onChange={e => set('nationality')(e.target.value)}>
                  {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
                </select>
              </Row>

              {/* Identification Type */}
              <Row label="Identification Type" lw={LW}>
                <select className="bk-select" value={data.identificationType} disabled={disabled}
                  onChange={e => set('identificationType')(e.target.value)}>
                  {IDENTIFICATION_TYPES.map(i => <option key={i}>{i}</option>)}
                </select>
              </Row>

              {/* Issued By */}
              <Row label="Issued By" required lw={LW}>
                <input className="bk-input" value={data.issuedBy} disabled={disabled}
                  onChange={e => set('issuedBy')(e.target.value)} />
              </Row>

              {/* TIN */}
              <Row label="TIN" required lw={LW}>
                <input className="bk-input" value={data.tin} disabled={disabled}
                  onChange={e => set('tin')(e.target.value)} />
              </Row>

              {/* Number Of House Members */}
              <Row label="No. of House Members" lw={LW}>
                <input className="bk-input" type="number" min="0" value={data.numberOfHouseMembers}
                  disabled={disabled} onChange={e => set('numberOfHouseMembers')(e.target.value)} />
              </Row>

              {/* Number Of Dependents */}
              <Row label="No. of Dependents" lw={LW}>
                <input className="bk-input" type="number" min="0" value={data.numberOfDependents}
                  disabled={disabled} onChange={e => set('numberOfDependents')(e.target.value)} />
              </Row>

              {/* Is Disabled */}
              <Row label="Is Disabled" lw={LW}>
                <label className="bk-checkbox-wrapper">
                  <input type="checkbox" className="bk-checkbox"
                    checked={data.isDisabled} disabled={disabled}
                    onChange={e => set('isDisabled')(e.target.checked)} />
                </label>
              </Row>

              {/* Literacy Level */}
              <Row label="Literacy Level" lw={LW}>
                <select className="bk-select" value={data.literacyLevel} disabled={disabled}
                  onChange={e => set('literacyLevel')(e.target.value as PersonalDetails['literacyLevel'])}>
                  <option value="">--Select--</option>
                  {LITERACY_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </Row>

              {/* Opened By */}
              <Row label="Opened By" lw={LW}>
                <div className="bk-search-group">
                  <input className="bk-input" style={{ width: 80 }} value={data.openedBy}
                    disabled={disabled} onChange={e => set('openedBy')(e.target.value)} />
                  <input className="bk-input" value={data.openedByName} disabled
                    style={{ flex: 1, background: 'var(--bank-bg-alt)' }} />
                  <button className="bk-header__search-btn" title="Lookup officer">🔍</button>
                </div>
              </Row>
            </div>

            {/* RIGHT COL */}
            <div>
              {/* First Name */}
              <Row label="First Name" required lw={LW}>
                <input className="bk-input" value={data.firstName} disabled={disabled}
                  onChange={e => set('firstName')(e.target.value)} />
              </Row>

              {/* Last Name */}
              <Row label="Last Name" required lw={LW}>
                <input className="bk-input" value={data.lastName} disabled={disabled}
                  onChange={e => set('lastName')(e.target.value)} />
              </Row>

              {/* Date Of Birth */}
              <Row label="Date Of Birth" lw={LW}>
                <div className="bk-date-group">
                  <input type="checkbox" className="bk-checkbox" checked={!!data.dobDay} readOnly />
                  <select className="bk-select" value={data.dobDay} disabled={disabled}
                    onChange={e => set('dobDay')(e.target.value)} style={{ minWidth: 55 }}>
                    <option value="">DD</option>
                    {['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15',
                      '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
                      .map(d => <option key={d}>{d}</option>)}
                  </select>
                  <select className="bk-select" value={data.dobMonth} disabled={disabled}
                    onChange={e => set('dobMonth')(e.target.value)} style={{ minWidth: 62 }}>
                    <option value="">MMM</option>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select className="bk-select" value={data.dobYear} disabled={disabled}
                    onChange={e => set('dobYear')(e.target.value)} style={{ minWidth: 72 }}>
                    <option value="">YYYY</option>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </Row>

              {/* Age As On */}
              <Row label="Age As On" lw={LW}>
                <select className="bk-select" value={data.ageAsOn} disabled={disabled}
                  onChange={e => set('ageAsOn')(e.target.value)}>
                  <option value="">--Select--</option>
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </Row>

              {/* Resident */}
              <Row label="Resident" lw={LW}>
                <select className="bk-select" value={data.resident} disabled={disabled}
                  onChange={e => set('resident')(e.target.value)}>
                  <option value="">--Select--</option>
                  {RESIDENT_OPTIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </Row>

              {/* Identification No */}
              <Row label="Identification No" required lw={LW}>
                <input className="bk-input" value={data.identificationNo} disabled={disabled}
                  onChange={e => set('identificationNo')(e.target.value)} />
              </Row>

              {/* Identification Expiry Date */}
              <Row label="ID Expiry Date" lw={LW}>
                <select className="bk-select" value={data.identificationExpiryDate} disabled={disabled}
                  onChange={e => set('identificationExpiryDate')(e.target.value)}>
                  <option value="">--Select--</option>
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </Row>

              {/* Marital Status */}
              <Row label="Marital Status" lw={LW}>
                <select className="bk-select" value={data.maritalStatus} disabled={disabled}
                  onChange={e => set('maritalStatus')(e.target.value as PersonalDetails['maritalStatus'])}>
                  <option value="">--Select--</option>
                  {MARITAL_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Row>

              {/* Number Of Children */}
              <Row label="No. of Children" lw={LW}>
                <input className="bk-input" type="number" min="0" value={data.numberOfChildren}
                  disabled={disabled} onChange={e => set('numberOfChildren')(e.target.value)} />
              </Row>

              {/* Disability Type */}
              <Row label="Disability Type" lw={LW}>
                <select className="bk-select" value={data.disabilityType} disabled={disabled}
                  onChange={e => set('disabilityType')(e.target.value)}>
                  {DISABILITY_TYPES.map(d => <option key={d}>{d}</option>)}
                </select>
              </Row>

              {/* Opened On */}
              <Row label="Opened On" required lw={LW}>
                <select className="bk-select" value={data.openedOn} disabled={disabled}
                  onChange={e => set('openedOn')(e.target.value)}>
                  <option value="">--Select--</option>
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalDetailsTab;
