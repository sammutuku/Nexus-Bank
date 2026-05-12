import React from 'react';
import Modal from '../../ui/Modal';
import type { ClientStatementRecord } from '../../../types/customer.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  records: ClientStatementRecord[];
  clientName?: string;
}

const ClientStatementModal: React.FC<Props> = ({ isOpen, onClose, records, clientName }) => {
  const footer = (
    <div className="bk-modal-footer-btns">
      <button className="bk-btn bk-btn--view" onClick={() => window.print()}>🖨 Print</button>
      <button className="bk-btn bk-btn--cancel" onClick={onClose}>Close</button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title="Client Statement" subtitle={clientName}
      icon="📄" size="lg" footer={footer}
    >
      <div className="bk-kin-table-wrapper">
        <table className="bk-data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Account Name</th>
              <th>Branch ID</th>
              <th>Account ID</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Clear Balance</th>
              <th>Drawing Power</th>
              <th>Opened Date</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0
              ? <tr><td colSpan={9} className="bk-table-empty">No statement records found</td></tr>
              : records.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bk-row--alt'}>
                    <td>{i + 1}</td>
                    <td>{r.accountName}</td>
                    <td>{r.branchId}</td>
                    <td>{r.accountId}</td>
                    <td><span className="bk-badge">{r.productId}</span></td>
                    <td>{r.productName}</td>
                    <td className="bk-cell--number">{r.clearBalance.toFixed(2)}</td>
                    <td className="bk-cell--number">{r.drawingPower.toFixed(2)}</td>
                    <td>{r.openedDate}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
      <div className="bk-pagination-bar">
        <span>Page 1 / 1</span>
        <span>Records 1–{records.length} of {records.length}</span>
      </div>
    </Modal>
  );
};

export default ClientStatementModal;
