import React, { useState, useCallback } from 'react';
import GhostRail from './Sidebar/GhostRail';
import IdentityHeader from './Header/IdentityHeader';
import type { AppNotification } from './Header/IdentityHeader';
import ModuleWorkspace from '@components/Workspace/ModuleWorkspace';
import { useLock } from '@context/LockContext';
import { useTabs } from '@context/TabContext';
import { getModuleMeta } from '@modules/componentMapper';

interface MainLayoutProps {
  onLogout: () => void;
}

const MainLayout = ({ onLogout }: MainLayoutProps) => {
  const { lock } = useLock();
  const { openTab, activeTabId, tabs } = useTabs();
  const [isPinned, setIsPinned] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const isSidebarCollapsed = !isPinned;
  const hasOpenTab = tabs.length > 0;
  const activeTab = tabs.find(t => t.moduleId === activeTabId);
  const activeModuleLabel = activeTab
    ? `${activeTab.moduleId} · ${activeTab.moduleName}`
    : null;

  const handleModuleSelect = useCallback((id: number) => {
    const meta = getModuleMeta(id);
    if (!meta) return;
    openTab({
      moduleId: meta.id,
      moduleName: meta.name,
      moduleType: meta.type,
    });
  }, [openTab]);

  const togglePin = useCallback(() => setIsPinned(p => !p), []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleDismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <div className="prime-shell">
      <GhostRail
        onModuleSelect={handleModuleSelect}
        hasOpenTab={hasOpenTab}
        isPinned={isPinned}
        onTogglePin={togglePin}
      />

      <div className="prime-main-container">
        <header className="prime-header-group">
          <IdentityHeader
            activeLock={lock}
            onToggleSidebar={togglePin}
            isSidebarCollapsed={isSidebarCollapsed}
            activeModuleLabel={activeModuleLabel}
            moduleId={activeTab?.moduleId ?? null}
            onModuleSelect={handleModuleSelect}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onDismissNotification={handleDismissNotification}
          />
        </header>

        <main className="prime-workspace">
          <ModuleWorkspace />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;