/**
 * ModuleSidebar — dynamic sub-menu driven by the registry lock-parent tree.
 *
 * Usage:
 *   <ModuleSidebar
 *     lockModuleId={1300}
 *     activeSidebar={activeSidebar}
 *     onSelect={key => openSub(key)}
 *   />
 *
 * Children are read from moduleRegistry where lockModuleId === props.lockModuleId.
 * They are grouped by type: D (Data Entry) and V (View). Unknown types fall under "Other".
 */
import React, { useMemo } from 'react';
import { moduleRegistry } from '@modules/registry';
import type { PrimeModule } from '@modules/registry';

interface ModuleSidebarProps {
  /** The parent module ID whose children we display */
  lockModuleId: number;
  /** Currently active sidebar item key (module id as string) */
  activeSidebar: string;
  /** Called when an item is clicked */
  onSelect: (moduleId: number, name: string) => void;
  /** If true, render a compact icon-only view (future use) */
  collapsed?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  D: 'Data Entry',
  V: 'View',
  R: 'Reports',
};

const ModuleSidebar: React.FC<ModuleSidebarProps> = ({
  lockModuleId,
  activeSidebar,
  onSelect,
  collapsed = false,
}) => {
  const grouped = useMemo(() => {
    const all = Object.values(moduleRegistry) as PrimeModule[];

    // Children: lockModuleId === our parent, and id !== parent (not self)
    const children = all
      .filter(m => m.lockModuleId === lockModuleId && m.id !== lockModuleId)
      .sort((a, b) => a.id - b.id);

    // Group by type
    const groups: Record<string, PrimeModule[]> = {};
    for (const m of children) {
      const key = m.type in TYPE_LABELS ? m.type : 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    }

    // Return in preferred order
    return (['D', 'V', 'R', 'Other'] as const)
      .filter(k => groups[k]?.length)
      .map(k => ({ type: k, label: TYPE_LABELS[k] ?? k, items: groups[k] }));
  }, [lockModuleId]);

  if (grouped.length === 0) return null;

  return (
    <nav className="bk-sidebar">
      {grouped.map(group => (
        <React.Fragment key={group.type}>
          <div className="bk-sidebar__section-header">{group.label}</div>
          {group.items.map(m => (
            <div
              key={m.id}
              className={`bk-sidebar__item ${activeSidebar === String(m.id) ? 'bk-sidebar__item--active' : ''}`}
              onClick={() => onSelect(m.id, m.name)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') onSelect(m.id, m.name); }}
              title={`${m.name} (${m.id})`}
            >
              {m.name}
            </div>
          ))}
        </React.Fragment>
      ))}
      <div className="bk-sidebar__footer">MODULE {lockModuleId}</div>
    </nav>
  );
};

export default ModuleSidebar;