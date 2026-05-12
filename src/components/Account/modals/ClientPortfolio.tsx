import React, { useState } from 'react';

interface ClientPortfolioProps {
  branchId: string;
  accountNumber: string;
  clientName: string;
  onClose: () => void;
}

interface PortfolioRow {
  no: number;
  branchId: string;
  accountId: string;
  deposit: string;
  advance: string;
  nonFundAdvance: string;
}

const SAMPLE_ROWS: PortfolioRow[] = [
  { no: 1, branchId: '00', accountId: '120000005201', deposit: '238,964.55',    advance: '0.00',           nonFundAdvance: '0.00' },
  { no: 2, branchId: '00', accountId: '370000005201', deposit: '0.00',          advance: '0.00',           nonFundAdvance: '0.00' },
  { no: 3, branchId: '00', accountId: '370000005202', deposit: '0.00',          advance: '17,942,024.00',  nonFundAdvance: '0.00' },
  { no: 4, branchId: '00', accountId: '370000005203', deposit: '0.00',          advance: '68,995,979.00',  nonFundAdvance: '0.00' },
];

const CONSOLIDATED = {
  totalDeposits:          '238,964.55',
  totalInterestPayable:   '0.00',
  totalAdvances:          '86,938,003.00',
  totalInterestReceivable:'1,763,692.02',
  totalNonFundAdvances:   '0.00',
  netFundsUsed:           '-86,699,038.45',
};

const ClientPortfolio: React.FC<ClientPortfolioProps> = ({ branchId, accountNumber, clientName, onClose }) => {
  const [selected, setSelected] = useState<number | null>(0);

  const title = `Client Portfolio — ${branchId} : ${accountNumber} : ${clientName}`;

  return (
    <div className="bk-modal-overlay">
      <div className="bk-modal bk-modal--lg">

        {/* Header */}
        <div className="bk-modal__header">
          <div className="bk-modal__title">
            <span className="bk-modal__title-icon">💼</span>
            {title}
          </div>
          <button className="bk-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="bk-modal__body" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Accounts table */}
          <div style={{ border: '1px solid var(--bank-border)', borderRadius: 4, overflow: 'auto' }}>
            <table className="bk-data-table">
              <thead>
                <tr>
                  <th className="bk-th" style={{ width: 36 }}>#</th>
                  <th className="bk-th" style={{ width: 80 }}>Branch ID</th>
                  <th className="bk-th">Account ID</th>
                  <th className="bk-th" style={{ width: 140, textAlign: 'right' }}>Deposit</th>
                  <th className="bk-th" style={{ width: 160, textAlign: 'right' }}>Advance</th>
                  <th className="bk-th" style={{ width: 160, textAlign: 'right' }}>Non Fund Advance</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ROWS.map((row, i) => (
                  <tr
                    key={row.no}
                    className={selected === i ? 'bk-row--selected' : i % 2 === 1 ? 'bk-row--alt' : ''}
                    onClick={() => setSelected(i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="bk-td bk-cell--number">{row.no}</td>
                    <td className="bk-td" style={{ textAlign: 'center' }}>{row.branchId}</td>
                    <td className="bk-td" style={{ fontFamily: 'monospace', fontSize: 12 }}>{row.accountId}</td>
                    <td className="bk-td" style={{ textAlign: 'right', fontSize: 12 }}>
                      {row.deposit !== '0.00'
                        ? <span style={{ color: 'var(--bank-success, #059669)', fontWeight: 600 }}>{row.deposit}</span>
                        : <span style={{ color: 'var(--bank-text-muted)' }}>{row.deposit}</span>}
                    </td>
                    <td className="bk-td" style={{ textAlign: 'right', fontSize: 12 }}>
                      {row.advance !== '0.00'
                        ? <span style={{ color: 'var(--bank-danger, #C0392B)', fontWeight: 600 }}>{row.advance}</span>
                        : <span style={{ color: 'var(--bank-text-muted)' }}>{row.advance}</span>}
                    </td>
                    <td className="bk-td" style={{ textAlign: 'right', fontSize: 12, color: 'var(--bank-text-muted)' }}>
                      {row.nonFundAdvance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Consolidated Values */}
          <div style={{
            background: 'var(--bank-panel-header, #162B44)',
            borderRadius: '4px 4px 0 0',
            padding: '7px 12px',
            color: '#E2E8F0',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Consolidated Values
          </div>
          <div style={{
            border: '1px solid var(--bank-border)',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            padding: '12px 16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            rowGap: 10,
            columnGap: 32,
          }}>
            {([
              ['Total Deposits',         CONSOLIDATED.totalDeposits,          'UGX', 'success'],
              ['Total Interest Payable', CONSOLIDATED.totalInterestPayable,   'UGX', 'muted'],
              ['Total Advances',         CONSOLIDATED.totalAdvances,          'UGX', 'danger'],
              ['Total Interest Receivable', CONSOLIDATED.totalInterestReceivable, 'UGX', 'success'],
              ['Total Non-Fund Advances',CONSOLIDATED.totalNonFundAdvances,   'UGX', 'muted'],
              ['Net Funds Used',         CONSOLIDATED.netFundsUsed,           'UGX', 'danger'],
            ] as [string, string, string, string][]).map(([label, value, ccy, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--bank-text-2, #374151)', minWidth: 180 }}>{label}</span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: color === 'success'
                    ? 'var(--bank-success, #059669)'
                    : color === 'danger'
                    ? 'var(--bank-danger, #C0392B)'
                    : 'var(--bank-text-muted, #9CA3AF)',
                  minWidth: 120,
                  textAlign: 'right',
                }}>
                  {value}
                </span>
                <span style={{ fontSize: 11, color: 'var(--bank-text-muted)', width: 36 }}>{ccy}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="bk-modal__footer">
          <div className="bk-modal-footer-btns">
            <button className="bk-btn bk-btn--view" onClick={onClose}>← Back</button>
            <button className="bk-btn bk-btn--cancel" onClick={onClose}>✕ Cancel</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientPortfolio;
