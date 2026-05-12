import React, { useEffect, useRef } from 'react';
import './Dashboard.css';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  client: string;
  type: string;
  amount: string;
  time: string;
  status: 'success' | 'pending';
}

interface Alert {
  icon: string;
  color: 'warning' | 'danger' | 'info' | 'success';
  text: string;
  action: string;
}

interface StatCard {
  icon: string;
  label: string;
  value: string;
  sub: string;
  subColor: 'success' | 'warning' | 'secondary';
}

// ── Sample Data ───────────────────────────────────────────────────────────────
const STATS: StatCard[] = [
  { icon: '👥', label: 'Total clients',    value: '24,391', sub: '+142 this month',  subColor: 'success'   },
  { icon: '🏦', label: 'Active accounts',  value: '18,204', sub: '+87 this month',   subColor: 'success'   },
  { icon: '📋', label: 'Active loans',     value: '6,817',  sub: '312 overdue',      subColor: 'warning'   },
  { icon: '↔',  label: "Today's txns",     value: '1,053',  sub: 'UGX 4.2B volume',  subColor: 'secondary' },
];

const TRANSACTIONS: Transaction[] = [
  { id: 'TXN-9821', client: 'Nakato Grace',   type: 'Deposit',    amount: 'UGX 2,500,000', time: '09:14', status: 'success' },
  { id: 'TXN-9820', client: 'Okello James',   type: 'Withdrawal', amount: 'UGX 800,000',   time: '09:07', status: 'success' },
  { id: 'TXN-9819', client: 'Apio Florence',  type: 'Transfer',   amount: 'UGX 5,200,000', time: '08:55', status: 'success' },
  { id: 'TXN-9818', client: 'Mugisha Robert', type: 'Loan repay', amount: 'UGX 1,100,000', time: '08:41', status: 'success' },
  { id: 'TXN-9817', client: 'Tendo Sarah',    type: 'Deposit',    amount: 'UGX 3,000,000', time: '08:30', status: 'pending' },
];

const ALERTS: Alert[] = [
  { icon: '⏱', color: 'warning', text: '5 loan applications awaiting supervisor approval',  action: 'Review loans'    },
  { icon: '⚠', color: 'danger',  text: '2 client KYC records expired — action required',    action: 'Review KYC'     },
  { icon: '🔒', color: 'warning', text: '3 accounts flagged for dormancy review',            action: 'View accounts'  },
  { icon: '📊', color: 'info',    text: 'End-of-day nightly process scheduled for 22:00',   action: 'View schedule'  },
  { icon: '✔', color: 'success', text: 'Branch reconciliation completed successfully',       action: 'View report'    },
];

const MONTHLY_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const DEPOSITS       = [3.2, 4.1, 3.8, 5.0, 4.6, 4.2];
const WITHDRAWALS    = [2.1, 2.8, 2.5, 3.2, 3.0, 2.9];

const BRANCH_LABELS  = ['Kampala', 'Entebbe', 'Jinja', 'Gulu', 'Mbarara', 'Mbale'];
const BRANCH_DATA    = [842, 431, 378, 295, 260, 198];

// ── Mini bar chart (no lib) ───────────────────────────────────────────────────
const MiniBarChart: React.FC<{
  labels: string[];
  datasets: { label: string; data: number[]; color: string }[];
  unit?: string;
}> = ({ labels, datasets, unit = '' }) => {
  const allValues = datasets.flatMap(d => d.data);
  const max = Math.max(...allValues);

  return (
    <div className="db-chart">
      <div className="db-chart-bars">
        {labels.map((label, i) => (
          <div key={label} className="db-chart-group">
            {datasets.map(ds => (
              <div key={ds.label} className="db-chart-bar-wrap">
                <div
                  className="db-chart-bar"
                  style={{
                    height: `${(ds.data[i] / max) * 100}%`,
                    background: ds.color,
                  }}
                  title={`${ds.label}: ${ds.data[i]}${unit}`}
                />
              </div>
            ))}
            <span className="db-chart-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="db-root">

      {/* ── Top bar ── */}
      <div className="db-topbar">
        <div>
          <p className="db-topbar-date">Good morning — <strong>{today}</strong></p>
          <p className="db-topbar-sub">Head Office Branch &nbsp;·&nbsp; Session: SN-20250512</p>
        </div>
        <span className="db-status-badge">System Online</span>
      </div>

      {/* ── Stat cards ── */}
      <div className="db-stats">
        {STATS.map(s => (
          <div key={s.label} className="db-stat-card">
            <div className="db-stat-header">
              <span className="db-stat-icon">{s.icon}</span>
              <span className="db-stat-label">{s.label}</span>
            </div>
            <p className="db-stat-value">{s.value}</p>
            <p className={`db-stat-sub db-stat-sub--${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="db-charts">
        <div className="db-card">
          <p className="db-card-title">Monthly transactions</p>
          <p className="db-card-sub">Volume by month (UGX billion)</p>
          <div className="db-legend">
            <span className="db-legend-item"><span className="db-legend-dot" style={{ background: '#3B82F6' }} />Deposits</span>
            <span className="db-legend-item"><span className="db-legend-dot" style={{ background: '#F59E0B' }} />Withdrawals</span>
          </div>
          <MiniBarChart
            labels={MONTHLY_LABELS}
            datasets={[
              { label: 'Deposits',    data: DEPOSITS,    color: '#3B82F6' },
              { label: 'Withdrawals', data: WITHDRAWALS, color: '#F59E0B' },
            ]}
            unit="B"
          />
        </div>

        <div className="db-card">
          <p className="db-card-title">Branch performance</p>
          <p className="db-card-sub">Clients onboarded this quarter</p>
          <div className="db-legend">
            <span className="db-legend-item"><span className="db-legend-dot" style={{ background: '#10B981' }} />Clients</span>
          </div>
          <MiniBarChart
            labels={BRANCH_LABELS}
            datasets={[{ label: 'Clients', data: BRANCH_DATA, color: '#10B981' }]}
          />
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="db-bottom">

        {/* Recent transactions */}
        <div className="db-card">
          <div className="db-card-header">
            <p className="db-card-title">Recent transactions</p>
          </div>
          <div className="db-txn-list">
            {TRANSACTIONS.map(t => (
              <div key={t.id} className="db-txn-row">
                <div className="db-txn-info">
                  <p className="db-txn-client">{t.client}</p>
                  <p className="db-txn-meta">{t.id} · {t.type} · {t.time}</p>
                </div>
                <div className="db-txn-right">
                  <p className="db-txn-amount">{t.amount}</p>
                  <span className={`db-badge db-badge--${t.status}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="db-card">
          <div className="db-card-header">
            <p className="db-card-title">Alerts &amp; approvals</p>
            <span className="db-badge db-badge--danger">7 pending</span>
          </div>
          <div className="db-alert-list">
            {ALERTS.map((a, i) => (
              <div key={i} className="db-alert-row">
                <span className={`db-alert-icon db-alert-icon--${a.color}`}>{a.icon}</span>
                <div className="db-alert-body">
                  <p className="db-alert-text">{a.text}</p>
                  <button className="db-alert-btn">{a.action} →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;