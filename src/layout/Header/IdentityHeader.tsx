import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BarChart3, Bell, ChevronRight, X } from 'lucide-react';
import {
  loadModules,
  moduleRegistry,
  getModulesForMainMenu,
  REPORTS_MENU_ID,
  REPORT_SUB_MENUS,
} from '@modules/registry';
import type { PrimeModule } from '@modules/registry';
import './IdentityHeader.css';

/* ─── Types ─────────────────────────────────────────── */
interface LockState {
  activeId: string | null;
  activeName: string | null;
  masterModuleId: number | null;
}

export interface AppNotification {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  body?: string;
  timestamp: Date;
  read: boolean;
  action?: { label: string; onClick: () => void };
}

interface IdentityHeaderProps {
  activeLock: LockState;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  activeModuleLabel?: string | null;
  moduleId?: number | null;
  onModuleSelect?: (id: number) => void;
  onNew?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
  onSearch?: () => void;
  onClose?: () => void;
  notifications?: AppNotification[];
  onMarkAllRead?: () => void;
  onDismissNotification?: (id: string) => void;
}

/* ─── Helpers ───────────────────────────────────────── */
const TYPE_PILL = new Set(['D', 'V', 'R']);
function TypePill({ t }: { t: string }) {
  const k = TYPE_PILL.has(t) ? t : 'U';
  return <span className={`ab-type-pill ab-type-pill--${k}`}>{t}</span>;
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ─── Reports Flyout ────────────────────────────────── */
const ReportsFlyout = ({
  allModules,
  onSelect,
  onClose,
}: {
  allModules: PrimeModule[];
  onSelect: (id: number) => void;
  onClose: () => void;
}) => {
  const [openSubId, setOpenSubId] = useState<number | null>(null);

  const subMenusWithModules = useMemo(() =>
    REPORT_SUB_MENUS.filter(sub =>
      allModules.some(m => m.type === 'R' && m.mainModuleId === sub.id)
    ), [allModules]);

  return (
    <div className="ih-flyout ih-flyout--reports">
      <div className="ih-flyout-header">
        <BarChart3 size={13} />
        <span>Reports</span>
        <span className="ih-flyout-count">
          {allModules.filter(m => m.type === 'R').length}
        </span>
        <button type="button" className="ih-flyout-close" onClick={onClose}>
          <X size={13} />
        </button>
      </div>
      <div className="ih-flyout-scroll">
        {subMenusWithModules.map(sub => {
          const mods = getModulesForMainMenu(REPORTS_MENU_ID, allModules, sub.id);
          const isOpen = openSubId === sub.id;
          return (
            <div key={sub.id}>
              <button
                type="button"
                className={`ih-flyout-section ${isOpen ? 'is-open' : ''}`}
                onClick={() => setOpenSubId(p => p === sub.id ? null : sub.id)}
              >
                <span className="ih-flyout-section-label">{sub.label}</span>
                <span className="ih-flyout-badge">{mods.length}</span>
                <span className={`ih-flyout-chevron ${isOpen ? 'is-open' : ''}`}>
                  <ChevronRight size={10} />
                </span>
              </button>
              {isOpen && (
                <div className="ih-flyout-items">
                  {mods.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className="ih-flyout-item"
                      onClick={() => { onSelect(m.id); onClose(); }}
                    >
                      <span className="ih-flyout-item-id">{m.id}</span>
                      <span className="ih-flyout-item-name">{m.name}</span>
                      <TypePill t={m.type} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Notifications Panel ───────────────────────────── */
const NotificationsPanel = ({
  notifications,
  onMarkAllRead,
  onDismiss,
  onClose,
}: {
  notifications: AppNotification[];
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  onClose: () => void;
}) => {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="ih-flyout ih-flyout--notif">
      <div className="ih-flyout-header">
        <Bell size={13} />
        <span>Notifications</span>
        {unread > 0 && <span className="ih-flyout-count ih-flyout-count--danger">{unread}</span>}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {unread > 0 && (
            <button type="button" className="ih-notif-mark-all" onClick={onMarkAllRead}>
              Mark all read
            </button>
          )}
          <button type="button" className="ih-flyout-close" onClick={onClose}>
            <X size={13} />
          </button>
        </div>
      </div>
      <div className="ih-flyout-scroll">
        {notifications.length === 0 ? (
          <div className="ih-notif-empty">No notifications</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`ih-notif-item ih-notif-item--${n.type} ${n.read ? 'is-read' : ''}`}>
              <div className="ih-notif-dot" />
              <div className="ih-notif-body">
                <div className="ih-notif-title">{n.title}</div>
                {n.body && <div className="ih-notif-text">{n.body}</div>}
                <div className="ih-notif-meta">
                  <span className="ih-notif-time">{timeAgo(n.timestamp)}</span>
                  {n.action && (
                    <button type="button" className="ih-notif-action" onClick={n.action.onClick}>
                      {n.action.label} →
                    </button>
                  )}
                </div>
              </div>
              {onDismiss && (
                <button type="button" className="ih-notif-dismiss" onClick={() => onDismiss(n.id)}>
                  <X size={11} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ─── Main Component ────────────────────────────────── */
const IdentityHeader = ({
  activeLock,
  onToggleSidebar,
  isSidebarCollapsed,
  activeModuleLabel,
  moduleId,
  onModuleSelect,
  onNew,
  onEdit,
  onSave,
  onDelete,
  onPrint,
  onSearch,
  onClose,
  notifications = [],
  onMarkAllRead,
  onDismissNotification,
}: IdentityHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reportsOpen, setReportsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const reportsRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close flyouts on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (reportsRef.current && !reportsRef.current.contains(e.target as Node)) setReportsOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [modulesLoaded, setModulesLoaded] = useState(false);

  useEffect(() => {
    loadModules().then(() => setModulesLoaded(true));
  }, []);

  const allModules = useMemo(() => Object.values(moduleRegistry), [modulesLoaded]);
  const hasModule = moduleId != null;
  const isLocked = activeLock?.activeId !== null;
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  const handleAction = (fn?: () => void) => fn?.();

  return (
    <div className="identity-header">

      {/* ── Hamburger ── */}
      <button
        className="identity-hamburger"
        onClick={onToggleSidebar}
        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className={`hbg ${isSidebarCollapsed ? 'hbg--collapsed' : ''}`}>
          <span /><span /><span />
        </span>
      </button>

      {/* ── Left: identity ── */}
      <div className="identity-left">
        <div className={`identity-avatar ${isLocked ? 'is-locked' : ''}`}>
          {activeLock?.activeName ? activeLock.activeName.charAt(0).toUpperCase() : '—'}
        </div>
        <div className="identity-info">
          <span className="identity-name">
            {activeLock?.activeName ?? 'No record selected'}
          </span>
          <span className="identity-role">
            {activeLock?.activeId
              ? `ID: ${activeLock.activeId}`
              : activeModuleLabel ?? 'Select a module to begin'}
          </span>
        </div>
      </div>

      {/* ── Center: Reports + Action Buttons ── */}
      <div className="identity-center">

        {/* Reports */}
        <div className="ih-wrap" ref={reportsRef}>
          <button
            type="button"
            className={`ih-reports-btn ${reportsOpen ? 'is-active' : ''}`}
            onClick={() => { setReportsOpen(o => !o); setNotifOpen(false); }}
            title="Reports"
          >
            <BarChart3 size={14} />
            <span>Reports</span>
            <span className="ih-reports-count">
              {allModules.filter(m => m.type === 'R').length}
            </span>
          </button>
          {reportsOpen && (
            <ReportsFlyout
              allModules={allModules}
              onSelect={id => { onModuleSelect?.(id); }}
              onClose={() => setReportsOpen(false)}
            />
          )}
        </div>

        <div className="identity-divider" />

        {/* Action buttons */}
        <div className="ih-actions">
          <button className="ih-btn ih-btn--new" disabled={!hasModule} onClick={() => handleAction(onNew)} title="New">
            <span className="ih-btn-icon">＋</span><span className="ih-btn-label">New</span>
          </button>
          <button className="ih-btn ih-btn--edit" disabled={!hasModule} onClick={() => handleAction(onEdit)} title="Edit">
            <span className="ih-btn-icon">✎</span><span className="ih-btn-label">Edit</span>
          </button>
          <button className="ih-btn ih-btn--save" disabled={!hasModule} onClick={() => handleAction(onSave)} title="Save">
            <span className="ih-btn-icon">✔</span><span className="ih-btn-label">Save</span>
          </button>
          <button className="ih-btn ih-btn--delete" disabled={!hasModule} onClick={() => handleAction(onDelete)} title="Delete">
            <span className="ih-btn-icon">✕</span><span className="ih-btn-label">Delete</span>
          </button>
          <div className="ih-divider" />
          <button className="ih-btn ih-btn--print" disabled={!hasModule} onClick={() => handleAction(onPrint)} title="Print">
            <span className="ih-btn-icon">⎙</span><span className="ih-btn-label">Print</span>
          </button>
          <button className="ih-btn ih-btn--search" disabled={!hasModule} onClick={() => handleAction(onSearch)} title="Search">
            <span className="ih-btn-icon">⌕</span><span className="ih-btn-label">Search</span>
          </button>
          <div className="ih-divider" />
          <button className="ih-btn ih-btn--close" disabled={!hasModule} onClick={() => handleAction(onClose)} title="Close">
            <span className="ih-btn-icon">⊠</span><span className="ih-btn-label">Close</span>
          </button>
        </div>
      </div>

      {/* ── Right: lock status + notifications + clock ── */}
      <div className="identity-right">

        {/* Lock status */}
        <div className="identity-lock-status">
          {activeLock?.masterModuleId ? (
            <>
              <span className="identity-lock-label">LOCKED</span>
              <span className="identity-lock-value">{activeLock.masterModuleId}</span>
            </>
          ) : (
            <span className="identity-lock-label">NO LOCK</span>
          )}
        </div>

        {/* Notifications bell */}
        <div className="ih-wrap" ref={notifRef}>
          <button
            type="button"
            className={`ih-notif-btn ${notifOpen ? 'is-active' : ''}`}
            onClick={() => { setNotifOpen(o => !o); setReportsOpen(false); }}
            title="Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="ih-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <NotificationsPanel
              notifications={notifications}
              onMarkAllRead={onMarkAllRead}
              onDismiss={onDismissNotification}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        {/* Clock */}
        <div className="identity-clock">
          <span className="identity-time">{formatTime(currentTime)}</span>
          <span className="identity-date">{formatDate(currentTime)}</span>
        </div>

        <div className={`identity-status-dot ${isLocked ? 'is-active' : 'is-inactive'}`} />
      </div>
    </div>
  );
};

export default IdentityHeader;
export type { IdentityHeaderProps };