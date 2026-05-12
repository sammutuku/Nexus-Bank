import React from 'react';
import { CLIENT_TYPES, CLIENT_CLASSES } from '@constants/customer.constants';
import type { CustomerRecord, ClientType } from '@types/customer.types';
import SearchButton from '../shared/SearchModal/SearchButton';

interface CustomerHeaderProps {
  customer: CustomerRecord;
  disabled: boolean;
  onChange: (patch: Partial<CustomerRecord>) => void;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ customer, disabled, onChange }) => (
  <header className="bk-header">
    <div className="bk-header__grid">
      {/* ── Row 1 left: Branch ID ── */}
      <div className="bk-header__row">
        <span className="bk-header__label">Branch ID</span>
        <span className="bk-header__value" style={{ width: 50 }}>{customer.branchId}</span>
        <span className="bk-header__value" style={{ flex: 1 }}>{customer.branchName}</span>
        <SearchButton
          entityType="branch"
          disabled={disabled}
          title="Search branch"
          className="bk-header__search-btn"
          onSelect={row => onChange({
            branchId:   row.branchId,
            branchName: row.branchName,
          })}
        />
      </div>

      {/* ── Row 1 right: Client Type ── */}
      <div className="bk-header__row">
        <span className="bk-header__label" style={{ color: 'var(--bank-required)' }}>Client Type</span>
        <select
          className="bk-header__select"
          value={customer.clientType}
          disabled={disabled}
          onChange={e => onChange({ clientType: e.target.value as ClientType })}
        >
          <option value="">--Select--</option>
          {CLIENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* ── Row 2 left: Client ID ── */}
      <div className="bk-header__row">
        <span className="bk-header__label" style={{ color: 'var(--bank-required)' }}>Client ID</span>
        <input
          className="bk-header__input"
          value={customer.clientId}
          disabled={disabled}
          placeholder="Search or enter ID"
          onChange={e => onChange({ clientId: e.target.value })}
        />
        <SearchButton
          entityType="client"
          disabled={disabled}
          title="Lookup client"
          className="bk-header__search-btn"
          onSelect={row => onChange({
            clientId:   row.clientId,
            clientName: row.name,
          })}
        />
      </div>

      {/* ── Row 2 right: Client Class ── */}
      <div className="bk-header__row">
        <span className="bk-header__label">Client Class</span>
        <select
          className="bk-header__select"
          value={customer.clientClass}
          disabled={disabled}
          onChange={e => onChange({ clientClass: e.target.value })}
        >
          <option value="">--Select--</option>
          {CLIENT_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Row 3 left: Client Name ── */}
      <div className="bk-header__row">
        <span className="bk-header__label" style={{ color: 'var(--bank-required)' }}>Client Name</span>
        <input
          className="bk-header__input"
          value={customer.clientName}
          disabled={disabled}
          placeholder="Auto-generated from personal details"
          readOnly
          onChange={e => onChange({ clientName: e.target.value })}
        />
      </div>

      {/* ── Row 3 right: empty ── */}
      <div />
    </div>
  </header>
);

export default CustomerHeader;