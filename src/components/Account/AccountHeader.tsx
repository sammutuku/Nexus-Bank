import React from 'react';
import SearchButton from '../shared/SearchModal/SearchButton';

interface AccountHeaderRecord {
  branchId:      string;
  branchName:    string;
  clientId:      string;
  clientName:    string;
  productId:     string;
  productName:   string;
  accountNumber: string;
}

interface AccountHeaderProps {
  rec:      AccountHeaderRecord;
  disabled: boolean;
  onChange: (patch: Partial<AccountHeaderRecord>) => void;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ rec, disabled, onChange }) => (
  <header className="bk-header">
    <div className="bk-header__grid">

      {/* ── Row 1 left: Branch ID ── */}
      <div className="bk-header__row">
        <span className="bk-header__label">Branch ID</span>
        <span className="bk-header__value" style={{ width: 44, fontFamily: 'var(--font-mono)' }}>
          {rec.branchId}
        </span>
        <input
          className="bk-header__input"
          value={rec.branchName}
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
          value={rec.clientId}
          disabled={disabled}
          placeholder="Enter ID"
          onChange={e => onChange({ clientId: e.target.value })}
        />
        <input
          className="bk-header__input"
          value={rec.clientName}
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

      {/* ── Row 2 left: Product ID ── */}
      <div className="bk-header__row">
        <span className="bk-header__label" style={{ color: 'var(--bank-required)' }}>Product ID</span>
        <input
          className="bk-header__input"
          style={{ maxWidth: 100 }}
          value={rec.productId}
          disabled={disabled}
          placeholder="Code"
          onChange={e => onChange({ productId: e.target.value })}
        />
        <input
          className="bk-header__input"
          value={rec.productName}
          disabled
          placeholder="Product name"
          readOnly
        />
        <SearchButton
          entityType="product"
          disabled={disabled}
          className="bk-header__search-btn"
          title="Search product"
          onSelect={r => onChange({ productId: r.productId, productName: r.productName })}
        />
      </div>

      {/* ── Row 2 right: Account Number ── */}
      <div className="bk-header__row">
        <span className="bk-header__label" style={{ color: 'var(--bank-required)' }}>Acct No.</span>
        <input
          className="bk-header__input"
          value={rec.accountNumber}
          disabled={disabled}
          placeholder="Search or enter account number"
          onChange={e => onChange({ accountNumber: e.target.value })}
        />
        <SearchButton
          entityType="account"
          disabled={disabled}
          className="bk-header__search-btn"
          title="Search account"
          onSelect={r => onChange({ accountNumber: r.accountId })}
        />
      </div>

    </div>
  </header>
);

export default AccountHeader;
export type { AccountHeaderRecord };