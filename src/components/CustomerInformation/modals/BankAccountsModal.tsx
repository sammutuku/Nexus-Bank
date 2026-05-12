import React from 'react';
import Modal from '../../ui/Modal';
import type { BankAccountRecord } from '../../../types/customer.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccountRecord[];
  clientName?: string;
}

const BankAccountsModal: React.FC<Props> = ({ isOpen, onClose, accounts, clientName }) => {
  const footer = (
    <div className="bk-modal-footer-btns">
      <button className="bk-btn bk-btn--cancel" onClick={onClose}>Close</button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title="Bank Accounts" subtitle={clientName}
      icon="🏦" size="lg" footer={footer}
    >
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
              ? <tr><td colSpan={6} className="bk-table-empty">No bank accounts on record</td></tr>
              : accounts.map((a, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bk-row--alt'}>
                    <td>{a.branchId}</td>
                    <td className="bk-cell--mono">{a.accountId}</td>
                    <td className="bk-cell--number">{a.deposit.toFixed(2)}</td>
                    <td className="bk-cell--number">{a.advance.toFixed(2)}</td>
                    <td><span className="bk-badge">{a.productId}</span></td>
                    <td>{a.productType}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
      <div className="bk-pagination-bar">
        <span>Records 1 to {accounts.length} of {accounts.length}</span>
      </div>
    </Modal>
  );
};

export default BankAccountsModal;
