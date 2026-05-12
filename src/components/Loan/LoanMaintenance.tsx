import React, { useState } from 'react';
import { useModuleTab } from '@hooks/useModuleTab';

const LoanMaintenance: React.FC = () => {
  const { closeMe } = useModuleTab(1000);

  const [activeInfoTab, setActiveInfoTab] = useState<'currentStatus' | 'loanDetails'>('currentStatus');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <div className="bk-root">
      {/* Title Bar */}
      <div className="bk-title-bar">
        <span className="bk-title-bar__icon">💰</span>
        <span className="bk-title-bar__text">Loan Maintenance</span>
        <span className="bk-title-bar__close" onClick={closeMe}>✕</span>
      </div>

      <div className="bk-layout">
        {/* Collapsible Left Sidebar */}
        <div className={`bk-sidebar-wrap${sidebarOpen ? '' : ' bk-sidebar-wrap--collapsed'}`}>
          <div className="bk-sidebar">
            <div className="bk-sidebar__item bk-sidebar__item--active">DataEntry</div>
            <div className="bk-sidebar__item">Loan Collaterals</div>
            <div className="bk-sidebar__item">Writeoff Recovery</div>
            <div className="bk-sidebar__item">Insurance</div>
            <div className="bk-sidebar__item">Guarantor</div>
            <div className="bk-sidebar__item">FSD DETAILS AND LEGAL</div>
            <div className="bk-sidebar__item">Release Freeze Instruction</div>
            <div className="bk-sidebar__item">Loan Closing/Opening</div>
            <div className="bk-sidebar__item">Refinance Statement</div>
            <div className="bk-sidebar__item">Settlement Quotation</div>
          </div>

          <button
            type="button"
            className="bk-shell-toggle bk-shell-toggle--between-main-and-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>

        {/* Main Area */}
        <main className="bk-main">
          {/* Top Form */}
          <div className="bk-form-section">
            <div className="bk-grid bk-grid-2">
              {/* Left Column */}
              <div>
                <div className="bk-field">
                  <label>Branch ID</label>
                  <input type="text" value="00" className="bk-input" />
                </div>
                <div className="bk-field">
                  <label>Account Number</label>
                  <input type="text" value="42000000701" className="bk-input" />
                </div>
                <div className="bk-field">
                  <label>Operational Account Number</label>
                  <input type="text" value="12000000701" className="bk-input" />
                </div>
                <div className="bk-field">
                  <label>Credit Officer</label>
                  <input type="text" value="LUCKY NICHOLAS" className="bk-input" />
                </div>
                <div className="bk-field">
                  <label>Fund ID</label>
                  <input type="text" value="07" className="bk-input" />
                </div>
                <div className="bk-field">
                  <label>Loan Type</label>
                  <input type="text" value="Normal/Direct" className="bk-input" />
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="bk-field">
                  <label>Client ID</label>
                  <input type="text" value="00000007" className="bk-input" />
                </div>
                <div className="bk-field">
                  <label>Loan Series</label>
                  <input type="text" value="1" className="bk-input" />
                </div>
                <div className="bk-field">
                  <label>Loan Purpose</label>
                  <select className="bk-input">
                    <option>Purchase Of Motor Cycle</option>
                  </select>
                </div>
                <div className="bk-field">
                  <label>Repayment Method</label>
                  <select className="bk-input">
                    <option>Transfer</option>
                  </select>
                </div>
                <div className="bk-field">
                  <label>Health Code</label>
                  <select className="bk-input">
                    <option>--Select--</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bk-section">
            <div className="bk-section-header">Additional Information</div>

            <div className="bk-tabs">
              <button className={`bk-tab ${activeInfoTab === 'currentStatus' ? 'bk-tab--active' : ''}`}
                onClick={() => setActiveInfoTab('currentStatus')}>
                Current Status
              </button>
              <button className={`bk-tab ${activeInfoTab === 'loanDetails' ? 'bk-tab--active' : ''}`}
                onClick={() => setActiveInfoTab('loanDetails')}>
                Loan Details
              </button>
            </div>

            <div className="bk-tab-content">
              {activeInfoTab === 'currentStatus' && <CurrentStatusTab />}
              {activeInfoTab === 'loanDetails' && <LoanDetailsTab />}
            </div>
          </div>

        </main>

        {/* Right Actions */}
        <div className={`bk-actions-wrap${actionsOpen ? '' : ' bk-actions-wrap--collapsed'}`}>
          <button className="bk-shell-toggle" onClick={() => setActionsOpen(!actionsOpen)}>
            {actionsOpen ? '»' : '«'}
          </button>
          <div className="bk-actions-wrap__inner">
            <button className="bk-action-btn">→ Account</button>
            <button className="bk-action-btn">→ Series</button>
            <button className="bk-action-btn">→ Ref No</button>
            <button className="bk-btn">View</button>
            <button className="bk-btn">Edit</button>
            <button className="bk-btn bk-btn--success">Save</button>
            <button className="bk-btn bk-btn--danger" onClick={closeMe}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CurrentStatusTab = () => (
  <div className="bk-grid bk-grid-2">
    {/* Add all Current Status fields here with proper alignment */}
  </div>
);

const LoanDetailsTab = () => (
  <div className="bk-grid bk-grid-2">
    {/* Add Loan Details fields */}
  </div>
);

export default LoanMaintenance;