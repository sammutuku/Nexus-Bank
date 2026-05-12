/**
 * HubModuleLayout.tsx
 *
 * Wraps hub modules in the workspace:
 *  - Real custom components (e.g. CustomerInformation) → rendered directly,
 *    they manage their own internal sub-navigation.
 *  - Placeholder hub modules with children → split layout with a registry-driven
 *    left sub-nav (DATAENTRY / VIEW sections) and a right content area.
 *  - Standalone modules (no children) → rendered directly.
 */
import React, { useState } from 'react';
import { moduleRegistry, getModuleChildren } from '@modules/registry';
import { getModuleMeta } from '@modules/componentMapper';
import type { ModuleMeta } from '@modules/componentMapper';
import './HubModuleLayout.css';

interface HubModuleLayoutProps {
  hub: ModuleMeta;
}

/** True if the component is an auto-generated placeholder (not a real implementation). */
function isPlaceholder(meta: ModuleMeta): boolean {
  return (meta.component.displayName ?? '').startsWith('Module_');
}

const HubModuleLayout: React.FC<HubModuleLayoutProps> = ({ hub }) => {
  const [activeChildId, setActiveChildId] = useState<number | null>(null);

  // ── Real component: pass straight through ──────────────────────────────────
  if (!isPlaceholder(hub)) {
    const HubComponent = hub.component;
    return <HubComponent />;
  }

  const allModules = Object.values(moduleRegistry);
  const children = getModuleChildren(hub.id, allModules);

  // ── No children: just render the placeholder ───────────────────────────────
  if (children.length === 0) {
    const HubComponent = hub.component;
    return <HubComponent />;
  }

  // ── Hub with children: split sub-nav layout ────────────────────────────────
  const dChildren = children.filter(c => c.type === 'D');
  const vChildren = children.filter(c => c.type === 'V');

  const activeMeta = activeChildId ? getModuleMeta(activeChildId) : null;
  const ContentComponent = activeMeta?.component ?? hub.component;
  const activeLabel = activeMeta
    ? `${activeMeta.name.trim()} — Module ${activeMeta.id}`
    : `${hub.name.trim()} — Module ${hub.id}`;

  return (
    <div className="hub-layout">
      {/* ── Left sub-nav ── */}
      <nav className="hub-subnav">
        <div className="hub-subnav-header">
          <span className="hub-subnav-header-title">{hub.name.trim()}</span>
          <span className="hub-subnav-header-id">{hub.id}</span>
        </div>

        {dChildren.length > 0 && (
          <div className="hub-subnav-group">
            <div className="hub-subnav-section-label">Data Entry</div>
            {dChildren.map(c => (
              <button
                key={c.id}
                type="button"
                className={`hub-subnav-item ${activeChildId === c.id ? 'is-active' : ''}`}
                onClick={() => setActiveChildId(c.id)}
                title={`${c.name.trim()} · ID ${c.id}`}
              >
                <span className="hub-subnav-item-id">{c.id}</span>
                <span className="hub-subnav-item-name">{c.name.trim()}</span>
              </button>
            ))}
          </div>
        )}

        {vChildren.length > 0 && (
          <div className="hub-subnav-group">
            <div className="hub-subnav-section-label">View</div>
            {vChildren.map(c => (
              <button
                key={c.id}
                type="button"
                className={`hub-subnav-item ${activeChildId === c.id ? 'is-active' : ''}`}
                onClick={() => setActiveChildId(c.id)}
                title={`${c.name.trim()} · ID ${c.id}`}
              >
                <span className="hub-subnav-item-id">{c.id}</span>
                <span className="hub-subnav-item-name">{c.name.trim()}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── Right content area ── */}
      <div className="hub-content">
        {/* Module breadcrumb bar */}
        <div className="hub-content-bar">
          <span className="hub-content-bar-label">{activeLabel}</span>
          {activeChildId && (
            <button
              type="button"
              className="hub-content-bar-back"
              onClick={() => setActiveChildId(null)}
            >
              ← Back to {hub.name.trim()}
            </button>
          )}
        </div>

        {/* Active component */}
        <div className="hub-content-body">
          <ContentComponent />
        </div>
      </div>
    </div>
  );
};

export default HubModuleLayout;