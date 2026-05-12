import React, { useRef, useEffect } from 'react';
import { useTabs } from '../../context/TabContext';
import './ModuleTabBar.css';

const TYPE_COLORS: Record<string, string> = {
  D: '#3b82f6', // data entry — blue
  R: '#8b5cf6', // report — purple
  V: '#0ea5e9', // view — sky
  B: '#f59e0b', // dashboard — amber
};

const ModuleTabBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabs();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    const el = scrollRef.current?.querySelector('.mtb-tab--active');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [activeTabId]);

  if (tabs.length === 0) return null;

  return (
    <div className="mtb-root">
      <div className="mtb-scroll" ref={scrollRef}>
        {tabs.map(tab => {
          const isActive = tab.moduleId === activeTabId;
          const color = TYPE_COLORS[tab.moduleType] ?? '#64748b';
          return (
            <div
              key={tab.moduleId}
              className={`mtb-tab ${isActive ? 'mtb-tab--active' : ''}`}
              style={{ '--tab-color': color } as React.CSSProperties}
              onClick={() => setActiveTab(tab.moduleId)}
            >
              <span className="mtb-tab-dot" />
              <span className="mtb-tab-id">{tab.moduleId}</span>
              <span className="mtb-tab-name">{tab.moduleName}</span>
              <button
                className="mtb-tab-close"
                onClick={e => { e.stopPropagation(); closeTab(tab.moduleId); }}
                title="Close tab"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleTabBar;
