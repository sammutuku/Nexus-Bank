import React from 'react';
import { useTabs } from '@context/TabContext';
import { getModuleComponent } from '@modules/componentMapper';
import Dashboard from '../Dashboard';
import ModuleTabBar from './ModuleTabBar';
import './ModuleWorkspace.css';

const ModuleWorkspace: React.FC = () => {
  const { tabs, activeTabId } = useTabs();

  return (
    <div className="mw-root">
      {/* Tab bar — only shown when tabs are open */}
      <ModuleTabBar />

      {/* Panels — all mounted, only active visible */}
      <div className="mw-panels">

        {/* Dashboard panel */}
        <div className={`mw-panel ${activeTabId === null ? 'mw-panel--active' : ''}`}>
          <Dashboard />
        </div>

        {/* Module panels */}
        {tabs.map(tab => {
          const Component = getModuleComponent(tab.moduleId);
          const isActive = tab.moduleId === activeTabId;
          return (
            <div
              key={tab.moduleId}
              className={`mw-panel ${isActive ? 'mw-panel--active' : ''}`}
            >
              {Component ? (
                <Component />
              ) : (
                <div className="mw-placeholder">
                  <span>🔧</span>
                  <p>{tab.moduleName}</p>
                  <small>Module {tab.moduleId} — not yet implemented</small>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleWorkspace;