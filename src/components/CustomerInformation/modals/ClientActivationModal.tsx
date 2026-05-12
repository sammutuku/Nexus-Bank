import React from 'react';
import Modal from '../../ui/Modal';
import type { BankAccountRecord } from '../../../types/customer.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  accounts: BankAccountRecord[];
  clientName?: string;
}

const fmt = (n: number) => n.toFixed(4);

const ClientActivationModal: React.FC<Props> = ({ isOpen, onClose, onApprove, accounts, clientName }) => {
  const totalDeposits = accounts.reduce((s, a) => s + a.deposit, 0);
  const totalAdvances  = accounts.reduce((s, a) => s + a.advance, 0);

  const footer = (
    <div className="bk-modal-footer-btns">
      <button className="bk-btn bk-btn--cancel" onClick={onClose}>← Back</button>
      <button className="bk-btn bk-btn--save" onClick={() => { onApprove(); onClose(); }}>✔ Approve</button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title="Client Activation" subtitle={clientName}
      icon="✅" size="lg" footer={footer}
    >
      {/* Accounts table */}
      <div className="bk-kin-table-wrapper">
        <table className="bk-data-table">
          <thead>
            <tr>
              <th>Branch ID</th>
              <th>Account ID</th>
              <th>Deposit</th>
              <th>Advance</th>
              <th>Product ID</th>
              <th>Product Type</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0
              ? <tr><td colSpan={6} className="bk-table-empty">No accounts found</td></tr>
              : accounts.map((a, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bk-row--alt'}>
                    <td>{a.branchId}</td>
                    <td>{a.accountId}</td>
                    <td className="bk-cell--number">{fmt(a.deposit)}</td>
                    <td className="bk-cell--number">{fmt(a.advance)}</td>
                    <td><span className="bk-badge">{a.productId}</span></td>
                    <td>{a.productType}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      <div className="bk-pagination-bar">
        <span>Records: {accounts.length}</span>
      </div>

      {/* Consolidated values */}
      <div className="bk-panel" style={{ marginTop: 16 }}>
        <div className="bk-panel__header">Consolidated Values</div>
        <div className="bk-panel__body">
          <div className="bk-consolidated-grid">
            <div className="bk-consolidated-item">
              <span className="bk-consolidated-label">Total Deposits</span>
              <span className="bk-consolidated-value">
                {fmt(totalDeposits)}
                <span className="bk-consolidated-currency">UGX</span>
              </span>
            </div>
            <div className="bk-consolidated-item">
              <span className="bk-consolidated-label">Total Interest Payable</span>
              <span className="bk-consolidated-value">0.00 <span className="bk-consolidated-currency">UGX</span></span>
            </div>
            <div className="bk-consolidated-item">
              <span className="bk-consolidated-label">Total Advances</span>
              <span className="bk-consolidated-value">
                {fmt(totalAdvances)}
                <span className="bk-consolidated-currency">UGX</span>
              </span>
            </div>
            <div className="bk-consolidated-item">
              <span className="bk-consolidated-label">Total Interest Receivable</span>
              <span className="bk-consolidated-value">0.00 <span className="bk-consolidated-currency">UGX</span></span>
            </div>
            <div className="bk-consolidated-item">
              <span className="bk-consolidated-label">Total Non-Fund Advances</span>
              <span className="bk-consolidated-value">0.00 <span className="bk-consolidated-currency">UGX</span></span>
            </div>
            <div className="bk-consolidated-item">
              <span className="bk-consolidated-label">Net Funds Used</span>
              <span className="bk-consolidated-value">0.00 <span className="bk-consolidated-currency">UGX</span></span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ClientActivationModal;
