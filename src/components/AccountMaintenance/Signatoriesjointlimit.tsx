import React, { useState } from 'react';
import SearchButton from '../shared/SearchModal/SearchButton';

interface JointLimitRow {
  id: string; sigId: string; sigName: string;
  sigType: string; limit: string; signatoryCount: string;
}

interface Props {
  clientName: string;
  accountId: string;
  onClose: () => void;
}

const SIG_TYPES = ['Joint Account Holder', 'Authorized Signatory', 'Guarantor'];

const SignatoriesJointLimit: React.FC<Props> = ({ clientName, accountId, onClose }) => {
  const [sigId, setSigId]     = useState('');
  const [sigName, setSigName] = useState('');
  const [sigType, setSigType] = useState(SIG_TYPES[0]);
  const [limit, setLimit]     = useState('');
  const [sigCount, setSigCount] = useState('');
  const [rows, setRows]       = useState<JointLimitRow[]>([]);
  const [selectedId, setSelected] = useState<string | null>(null);
  const [toast, setToast]     = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleUpdate = () => {
    if (!sigId.trim()) { showToast('Signatory ID is required'); return; }
    setRows(prev => {
      const exists = prev.find(r => r.id === sigId);
      const row = { id: sigId, sigId, sigName, sigType, limit, signatoryCount: sigCount };
      return exists ? prev.map(r => r.id === sigId ? row : r) : [...prev, row];
    });
    showToast('Joint limit updated');
  };
  const handleRemove = () => {
    if (!selectedId) { showToast('Select a row first'); return; }
    setRows(prev => prev.filter(r => r.id !== selectedId));
    setSelected(null);
    showToast('Row removed');
  };
  const handleAlter = () => {
    const row = rows.find(r => r.id === selectedId);
    if (!row) { showToast('Select a row first'); return; }
    setSigId(row.sigId); setSigName(row.sigName);
    setSigType(row.sigType); setLimit(row.limit); setSigCount(row.signatoryCount);
  };
  const handleClear = () => { setSigId(''); setSigName(''); setLimit(''); setSigCount(''); setSelected(null); };

  return (
    <div className="ci-modal-overlay">
      <div className="ci-modal ci-modal--lg">

        <div className="ci-modal__header">
          <div className="ci-modal__title">
            <span className="ci-modal__title-icon">✍</span>
            Signatories Joint Limit
            {accountId && <span className="ci-modal__subtitle"> — {accountId} : {clientName}</span>}
          </div>
          <button className="ci-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="ci-modal__body">
          <div className="ci-panel">
            <div className="ci-panel__header">Joint Limit Configuration</div>
            <div className="ci-panel__body">
              <div className="am-form-grid">

                <div className="am-field am-field--wide">
                  <label className="am-label am-label--req">Signatory ID</label>
                  <div className="am-input-group">
                    <input className="ci-input am-input-sm" value={sigId}
                      onChange={e => setSigId(e.target.value)} />
                    <input className="ci-input" value={sigName}
                      onChange={e => setSigName(e.target.value)} placeholder="Name" />
                    <SearchButton entityType="client" className="bk-header__search-btn"
                      onSelect={r => { setSigId(r.clientId); setSigName(r.name); }} />
                  </div>
                </div>

                <div className="am-field">
                  <label className="am-label am-label--req">Signatory Type</label>
                  <select className="ci-select" value={sigType} onChange={e => setSigType(e.target.value)}>
                    {SIG_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="am-field">
                  <label className="am-label">Joint Limit Amount</label>
                  <input className="ci-input ci-input--money" value={limit}
                    onChange={e => setLimit(e.target.value)} placeholder="0.00" />
                </div>

                <div className="am-field">
                  <label className="am-label">Signatory Count</label>
                  <input className="ci-input" type="number" value={sigCount}
                    onChange={e => setSigCount(e.target.value)} placeholder="e.g. 2" />
                </div>

              </div>

              {/* Action row */}
              <div className="sit-txn-actions" style={{ marginTop: 10 }}>
                {[['New', handleClear], ['Alter', handleAlter], ['Remove', handleRemove],
                  ['Update', handleUpdate], ['Clear', handleClear]].map(([label, fn]: any) => (
                  <button key={label} className="ci-btn ci-btn--sm ci-btn--close" onClick={fn}>{label}</button>
                ))}
                <button className="ci-btn ci-btn--sm ci-btn--close" style={{ marginLeft: 'auto' }} onClick={onClose}>✕ Close</button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="ci-kin-table-wrapper" style={{ marginTop: 10 }}>
            <table className="ci-data-table">
              <thead>
                <tr>
                  <th className="ci-th">#</th>
                  <th className="ci-th">Signatory ID</th>
                  <th className="ci-th">Signatory Name</th>
                  <th className="ci-th">Type</th>
                  <th className="ci-th ci-cell--number">Joint Limit</th>
                  <th className="ci-th ci-cell--number">Count</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0
                  ? <tr><td colSpan={6} className="ci-table-empty">No joint limits configured</td></tr>
                  : rows.map((r, i) => (
                    <tr key={r.id}
                      className={`${i % 2 === 1 ? 'ci-row--alt' : ''} ${selectedId === r.id ? 'ci-row--selected' : ''}`}
                      onClick={() => setSelected(r.id)}>
                      <td className="ci-td ci-cell--number">{i + 1}</td>
                      <td className="ci-td ci-cell--mono">{r.sigId}</td>
                      <td className="ci-td">{r.sigName}</td>
                      <td className="ci-td">{r.sigType}</td>
                      <td className="ci-td ci-cell--number">{r.limit}</td>
                      <td className="ci-td ci-cell--number">{r.signatoryCount}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
      {toast && <div className="ci-toast ci-toast--success">✔ {toast}</div>}
    </div>
  );
};

export default SignatoriesJointLimit;