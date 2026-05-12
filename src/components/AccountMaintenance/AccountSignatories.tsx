import React, { useState } from 'react';
import { useModuleTab } from '../../hooks/useModuleTab';
import SearchButton from '../shared/SearchModal/SearchButton';

type SignatoryType = 'Joint Account Holder' | 'Authorized Signatory' | 'Guarantor';
interface SignatoryRow { id: string; name: string; type: SignatoryType; limit: string; }

const SIG_TYPES: SignatoryType[] = ['Joint Account Holder','Authorized Signatory','Guarantor'];

const AccountSignatories: React.FC = () => {
  const { closeMe } = useModuleTab(1320);
  const [signatoryId, setSignatoryId] = useState('');
  const [signatoryName, setSignatoryName] = useState('');
  const [signatoryType, setSignatoryType] = useState<SignatoryType>('Joint Account Holder');
  const [limit, setLimit] = useState('');
  const [rows, setRows] = useState<SignatoryRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [operatingMode, setOperatingMode] = useState('Self');
  const [operatingInstruction, setOperatingInstruction] = useState('');
  const [audit] = useState({ createdBy:'', modifiedBy:'', supervisedBy:'', createdOn:'', modifiedOn:'', supervisedOn:'' });
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'}|null>(null);
  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  };

  const handleNew   = () => { setSignatoryId(''); setSignatoryName(''); setLimit(''); setSelectedId(null); };
  const handleAlter = () => { if (!selectedId) { showToast('Select a signatory first','error'); return; } const r = rows.find(x=>x.id===selectedId); if(r){ setSignatoryId(r.id); setSignatoryName(r.name); setSignatoryType(r.type); setLimit(r.limit); } };
  const handleRemove= () => { if (!selectedId) { showToast('Select a signatory first','error'); return; } setRows(r => r.filter(x=>x.id!==selectedId)); setSelectedId(null); showToast('Signatory removed'); };
  const handleUpdate= () => { if (!signatoryId) { showToast('Signatory ID required','error'); return; } setRows(r => { const exists = r.find(x=>x.id===signatoryId); return exists ? r.map(x=>x.id===signatoryId?{id:signatoryId,name:signatoryName,type:signatoryType,limit}:x) : [...r,{id:signatoryId,name:signatoryName,type:signatoryType,limit}]; }); showToast('Signatory updated'); };
  const handleClear = () => handleNew();

  return (
    <div className="ci-modal-overlay" style={{ position:'relative', inset:'unset', background:'none', padding:0, display:'block' }}>
      <div className="ci-modal ci-modal--lg" style={{ maxHeight:'100%', animation:'none' }}>
        <div className="ci-modal__header">
          <div className="ci-modal__title">
            <span className="ci-modal__title-icon">✍</span>
            Signatories
          </div>
          <button className="ci-modal__close" onClick={closeMe}>✕</button>
        </div>
        <div className="ci-modal__body">
          {/* Input row */}
          <div className="ci-panel">
            <div className="ci-panel__header">Signatories</div>
            <div className="ci-panel__body">
              <div className="am-form-grid">
                <div className="ci-form-row">
                  <label className="ci-form-label ci-form-label--required">Signatory ID</label>
                  <div className="ci-form-control">
                    <div className="am-input-group">
                      <input className="ci-input am-input-sm" value={signatoryId} onChange={e => setSignatoryId(e.target.value)} />
                      <input className="ci-input" value={signatoryName} onChange={e => setSignatoryName(e.target.value)} placeholder="Name" />
                      <SearchButton entityType="client" onSelect={r => { setSignatoryId(r.clientId); setSignatoryName(r.name); }} />
                    </div>
                  </div>
                </div>
                <div className="ci-form-row">
                  <label className="ci-form-label ci-form-label--required">Signatory Type</label>
                  <div className="ci-form-control">
                    <select className="ci-select" value={signatoryType} onChange={e => setSignatoryType(e.target.value as SignatoryType)}>
                      {SIG_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="ci-form-row">
                  <label className="ci-form-label">Limit</label>
                  <div className="ci-form-control">
                    <input className="ci-input ci-input--money" value={limit} onChange={e => setLimit(e.target.value)} />
                  </div>
                </div>
              </div>
              {/* Action buttons */}
              <div className="sit-txn-actions" style={{ marginTop: 10 }}>
                {[['New',handleNew],['Alter',handleAlter],['Remove',handleRemove],['Update',handleUpdate],['Clear',handleClear]].map(([label, fn]: any) => (
                  <button key={label} className="ci-btn ci-btn--sm ci-btn--close" onClick={fn}>{label}</button>
                ))}
                <button className="ci-btn ci-btn--sm ci-btn--close" style={{ marginLeft: 'auto' }} onClick={() => closeMe()}>✕ Close</button>
              </div>
              {/* Right: Signature/Photo/Both */}
              <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:8 }}>
                {['Signature','Photo','Both'].map(b => (
                  <button key={b} className="ci-btn ci-btn--sm ci-btn--view" onClick={() => showToast(`${b} view`)}>{b}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="ci-kin-table-wrapper">
            <table className="ci-data-table">
              <thead>
                <tr>
                  <th className="ci-th">#</th>
                  <th className="ci-th">Signatory ID</th>
                  <th className="ci-th">Signatory Name</th>
                  <th className="ci-th">Signatory Type</th>
                  <th className="ci-th">Limit</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0
                  ? <tr><td colSpan={5} className="ci-table-empty">There Are No Items To Be Displayed</td></tr>
                  : rows.map((r, i) => (
                    <tr key={r.id}
                      className={`${i%2===1?'ci-row--alt':''} ${selectedId===r.id?'ci-row--selected':''}`}
                      onClick={() => setSelectedId(r.id)}>
                      <td className="ci-td ci-cell--number">{i+1}</td>
                      <td className="ci-td ci-cell--mono">{r.id}</td>
                      <td className="ci-td">{r.name}</td>
                      <td className="ci-td">{r.type}</td>
                      <td className="ci-td ci-cell--number">{r.limit}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* Additional Info */}
          <div className="ci-panel" style={{ marginTop: 12 }}>
            <div className="ci-panel__header">Additional Information</div>
            <div className="ci-panel__body">
              <div className="am-form-grid">
                <div className="ci-form-row">
                  <label className="ci-form-label">Operating Mode</label>
                  <div className="ci-form-control">
                    <input className="ci-input" value={operatingMode} onChange={e => setOperatingMode(e.target.value)} readOnly style={{ background: 'var(--bank-bg-alt)' }} />
                  </div>
                </div>
                <div className="ci-form-row am-field--wide">
                  <label className="ci-form-label">Operating Instruction</label>
                  <div className="ci-form-control">
                    <input className="ci-input" value={operatingInstruction} onChange={e => setOperatingInstruction(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="am-form-grid" style={{ marginTop: 8 }}>
                {Object.entries(audit).map(([k, v]) => (
                  <div key={k} className="ci-form-row">
                    <label className="ci-form-label">{k.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</label>
                    <div className="ci-form-control"><input className="ci-input" value={v} readOnly style={{ background: 'var(--bank-bg-alt)' }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast && <div className={`ci-toast ci-toast--${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};
export default AccountSignatories;
