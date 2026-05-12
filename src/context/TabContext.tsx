import React, { createContext, useContext, useState, useCallback } from 'react';

export interface TabEntry {
  moduleId: number;
  moduleName: string;
  moduleType: string;
}

interface TabContextValue {
  tabs: TabEntry[];
  activeTabId: number | null;
  openTab: (entry: TabEntry) => void;
  closeTab: (moduleId: number) => void;
  setActiveTab: (moduleId: number) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [tabs, setTabs] = useState<TabEntry[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);

  const openTab = useCallback((entry: TabEntry) => {
    setTabs(prev => {
      const exists = prev.find(t => t.moduleId === entry.moduleId);
      if (exists) return prev;
      return [...prev, entry];
    });
    setActiveTabId(entry.moduleId);
  }, []);

  const closeTab = useCallback((moduleId: number) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.moduleId === moduleId);
      const next = prev.filter(t => t.moduleId !== moduleId);

      setActiveTabId(current => {
        if (current !== moduleId) return current;
        if (next.length === 0) return null;
        // focus the tab to the left, or the first one
        const newIdx = Math.max(0, idx - 1);
        return next[newIdx]?.moduleId ?? null;
      });

      return next;
    });
  }, []);

  const setActiveTab = useCallback((moduleId: number) => {
    setActiveTabId(moduleId);
  }, []);

  return (
    <TabContext.Provider value={{ tabs, activeTabId, openTab, closeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabs = () => {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('useTabs must be used within TabProvider');
  return ctx;
};
