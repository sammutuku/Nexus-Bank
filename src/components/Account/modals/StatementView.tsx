import React, { useState } from 'react';

interface StatementViewProps {
  branchId: string;
  accountNumber: string;
  clientName: string;
  onClose: () => void;
}

interface TxnRow {
  no: number;
  trxDate: string;
  valueDate: string;
  particulars: string;
  debit: string;
  credit: string;
  balance: string;
  op: string;
}

const PAGE_SIZE = 10;

const SAMPLE_ROWS: TxnRow[] = [
  { no:1,  trxDate: '',            valueDate: '',            particulars: 'Opening Balance 1 Jan 2026',                     debit: '',              credit: '',              balance: '(2.03)',         op: ''      },
  { no:2,  trxDate: '30/Jan/2026', valueDate: '30/Jan/2026', particulars: '2514-KATUSABE ANDREW',                            debit: '',              credit: '1,500,000.00',  balance: '1,499,997.97',  op: 'MIG'   },
  { no:3,  trxDate: '31/Jan/2026', valueDate: '31/Jan/2026', particulars: '2602-andrew Katusabe-Jan 2026 Staff Loan Recovery', debit: '4,738,438.00', credit: '',              balance: '6,238,435.97',  op: 'KA'    },
  { no:4,  trxDate: '31/Jan/2026', valueDate: '24/Apr/2026', particulars: '10929-andrew Katusabe-APR 2026 Staff Loan Recovery',debit: '4,738,438.29', credit: '',              balance: '10,976,874.26', op: 'KA'    },
  { no:5,  trxDate: '02/Feb/2026', valueDate: '02/Feb/2026', particulars: '2985-Interest Amount Repayment 370000005202',     debit: '250,960.00',    credit: '',              balance: '10,725,914.26', op: 'SY'    },
  { no:6,  trxDate: '02/Feb/2026', valueDate: '02/Feb/2026', particulars: '2985-Principal Amount Repayment 370000005202',    debit: '2,088,729.00',  credit: '',              balance: '8,637,185.26',  op: 'SY'    },
  { no:7,  trxDate: '02/Feb/2026', valueDate: '02/Feb/2026', particulars: '2986-Interest Amount Repayment 370000005203',     debit: '1,043,569.00',  credit: '',              balance: '7,593,616.26',  op: 'SY'    },
  { no:8,  trxDate: '02/Feb/2026', valueDate: '02/Feb/2026', particulars: '2986-Principal Amount Repayment 370000005203',    debit: '2,855,048.00',  credit: '',              balance: '4,738,568.26',  op: 'SY'    },
  { no:9,  trxDate: '28/Feb/2026', valueDate: '28/Feb/2026', particulars: '5863-andrew Katusabe-FEB 2026 Staff Loan Recovery', debit: '4,738,438.00', credit: '',             balance: '9,477,006.26',  op: 'KD'    },
  { no:10, trxDate: '02/Mar/2026', valueDate: '02/Mar/2026', particulars: '5912-Interest Amount Repayment 370000005202',     debit: '231,117.00',    credit: '',              balance: '9,245,889.26',  op: 'SY'    },
  { no:11, trxDate: '02/Mar/2026', valueDate: '02/Mar/2026', particulars: '5912-Principal Amount Repayment 370000005202',    debit: '2,108,572.00',  credit: '',              balance: '7,137,317.26',  op: 'SY'    },
  { no:12, trxDate: '02/Mar/2026', valueDate: '02/Mar/2026', particulars: '5913-Interest Amount Repayment 370000005203',     debit: '854,242.00',    credit: '',              balance: '6,283,075.26',  op: 'SY'    },
  { no:13, trxDate: '02/Mar/2026', valueDate: '02/Mar/2026', particulars: '5913-Principal Amount Repayment 370000005203',    debit: '1,544,636.97',  credit: '',              balance: '4,738,438.29',  op: 'SY'    },
  { no:14, trxDate: '02/Mar/2026', valueDate: '02/Mar/2026', particulars: '6016-andrew Katusabe-MAR 2026 Staff Loan Recovery', debit: '',            credit: '4,738,438.00',  balance: '9,476,876.29',  op: 'KA'    },
  { no:15, trxDate: '02/Mar/2026', valueDate: '02/Mar/2026', particulars: '6019-Principal Amount Repayment 370000005203',    debit: '1,499,738.03',  credit: '',              balance: '7,977,138.26',  op: 'SY'    },
  { no:16, trxDate: '31/Mar/2026', valueDate: '31/Mar/2026', particulars: '8731-Interest Amount Repayment 370000005202',     debit: '211,085.00',    credit: '',              balance: '7,766,053.26',  op: 'SY'    },
  { no:17, trxDate: '31/Mar/2026', valueDate: '31/Mar/2026', particulars: '8731-Principal Amount Repayment 370000005202',    debit: '2,128,603.00',  credit: '',              balance: '5,637,450.26',  op: 'SY'    },
  { no:18, trxDate: '02/Apr/2026', valueDate: '02/Apr/2026', particulars: '9165-Interest Amount Repayment 370000005203',     debit: '820,962.00',    credit: '',              balance: '4,816,488.26',  op: 'SY'    },
  { no:19, trxDate: '02/Apr/2026', valueDate: '02/Apr/2026', particulars: '9165-Principal Amount Repayment 370000005203',    debit: '78,049.97',     credit: '',              balance: '4,738,438.29',  op: 'SY'    },
  { no:20, trxDate: '24/Apr/2026', valueDate: '24/Apr/2026', particulars: '10932-Principal Amount Repayment 370000005203',   debit: '2,999,605.03',  credit: '',              balance: '1,738,833.26',  op: 'SY'    },
  { no:21, trxDate: '30/Apr/2026', valueDate: '30/Apr/2026', particulars: '11779-Interest Amount Repayment 370000005202',    debit: '190,864.00',    credit: '',              balance: '1,547,969.26',  op: 'SY'    },
];

const StatementView: React.FC<StatementViewProps> = ({ branchId, accountNumber, clientName, onClose }) => {
  const [stmtFor,   setStmtFor]   = useState('Date Range');
  const [fromDate,  setFromDate]  = useState('01/Jan/2026');
  const [toDate,    setToDate]    = useState('09/May/2026');
  const [page,      setPage]      = useState(1);
  const [goPage,    setGoPage]    = useState('1');

  const totalPages = Math.ceil(SAMPLE_ROWS.length / PAGE_SIZE);
  const pageRows   = SAMPLE_ROWS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleGo = () => {
    const n = parseInt(goPage, 10);
    if (!isNaN(n) && n >= 1 && n <= totalPages) setPage(n);
  };

  const title = `Statement View — ${branchId} : ${accountNumber} : ${clientName}`;

  return (
    <div className="bk-modal-overlay">
      <div className="bk-modal bk-modal--xl">

        {/* Header */}
        <div className="bk-modal__header">
          <div className="bk-modal__title">
            <span className="bk-modal__title-icon">📄</span>
            {title}
          </div>
          <button className="bk-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="bk-modal__body" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Filter row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label className="bk-form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Statement For</label>
              <select
                className="bk-select"
                style={{ width: 140 }}
                value={stmtFor}
                onChange={e => setStmtFor(e.target.value)}
              >
                <option>Date Range</option>
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>

            {stmtFor === 'Date Range' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <label className="bk-form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>From Date</label>
                  <input
                    className="bk-input"
                    style={{ width: 120 }}
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    placeholder="DD/Mon/YYYY"
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <label className="bk-form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>To Date</label>
                  <input
                    className="bk-input"
                    style={{ width: 120 }}
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    placeholder="DD/Mon/YYYY"
                  />
                </div>
              </>
            )}

            <button
              className="bk-btn bk-btn--view"
              style={{ marginLeft: 'auto' }}
              onClick={() => window.print()}
            >
              🖨 Print
            </button>
          </div>

          {/* Transaction table */}
          <div style={{ overflow: 'auto', flex: 1, border: '1px solid var(--bank-border)', borderRadius: 4 }}>
            <table className="bk-data-table" style={{ minWidth: 800 }}>
              <thead>
                <tr>
                  <th className="bk-th" style={{ width: 36 }}>#</th>
                  <th className="bk-th" style={{ width: 100 }}>Trx Date</th>
                  <th className="bk-th" style={{ width: 100 }}>Value Date</th>
                  <th className="bk-th">Particulars</th>
                  <th className="bk-th" style={{ width: 120, textAlign: 'right' }}>Debit</th>
                  <th className="bk-th" style={{ width: 120, textAlign: 'right' }}>Credit</th>
                  <th className="bk-th" style={{ width: 130, textAlign: 'right' }}>Balance</th>
                  <th className="bk-th" style={{ width: 46 }}>Op</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, i) => (
                  <tr key={row.no} className={i % 2 === 1 ? 'bk-row--alt' : ''}>
                    <td className="bk-td bk-cell--number">{row.no}</td>
                    <td className="bk-td" style={{ fontSize: 11 }}>{row.trxDate}</td>
                    <td className="bk-td" style={{ fontSize: 11 }}>{row.valueDate}</td>
                    <td className="bk-td" style={{ fontSize: 11 }}>{row.particulars}</td>
                    <td className="bk-td" style={{ textAlign: 'right', fontSize: 11, color: row.debit ? 'var(--bank-danger, #C0392B)' : undefined }}>
                      {row.debit}
                    </td>
                    <td className="bk-td" style={{ textAlign: 'right', fontSize: 11, color: row.credit ? 'var(--bank-success, #059669)' : undefined }}>
                      {row.credit}
                    </td>
                    <td className="bk-td" style={{ textAlign: 'right', fontSize: 11, fontWeight: 600 }}>{row.balance}</td>
                    <td className="bk-td" style={{ fontSize: 10, color: 'var(--bank-text-muted)' }}>{row.op}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12 }}>
            <span style={{ color: 'var(--bank-text-muted)' }}>Page {page} / {totalPages}</span>
            <button
              className="bk-btn bk-btn--sm bk-btn--view"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹‹
            </button>
            <input
              className="bk-input"
              style={{ width: 44, textAlign: 'center', padding: '2px 4px', fontSize: 12 }}
              value={goPage}
              onChange={e => setGoPage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGo()}
            />
            <button
              className="bk-btn bk-btn--sm bk-btn--view"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ››
            </button>
            <button className="bk-btn bk-btn--sm bk-btn--save" onClick={handleGo}>Go</button>
          </div>
        </div>

        {/* Footer */}
        <div className="bk-modal__footer">
          <div className="bk-modal-footer-btns">
            <button className="bk-btn bk-btn--cancel" onClick={onClose}>✕ Cancel</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatementView;
