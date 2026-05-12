import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  loadModules,
  moduleRegistry,
  getNavMenusWithModules,
  getModulesForMainMenu,
  buildLockParentTree,
  REPORTS_MENU_ID ,
} from '@modules/registry';
import type { PrimeModule, MenuItem } from '@modules/registry';
import './GhostRail.css';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

interface GhostRailProps {
  onModuleSelect: (id: number) => void;
  hasOpenTab: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
}

interface NavContentProps {
  onModuleSelect: (id: number) => void;
  onClose?: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  navMenus: MenuItem[];
  allModules: PrimeModule[];
  openSectionId: number | null;
  setOpenSectionId: React.Dispatch<React.SetStateAction<number | null>>;
}

const TYPE_PILL = new Set(['D', 'V', 'R']);

function ModuleTypePill({ t }: { t: string }) {
  const k = TYPE_PILL.has(t) ? t : 'U';
  return <span className={`ghost-type-pill ghost-type-pill--${k}`}>{t}</span>;
}

function renderModuleBranch(
  m: PrimeModule,
  depth: number,
  childMap: Map<number, PrimeModule[]>,
  onSelect: (id: number) => void
): React.ReactNode {
  const d = Math.min(depth, 6);
  //const kids = childMap.get(m.id) ?? [];
  const L = m.lockModuleId ?? 0;
  const titleParts = [m.name, `ID ${m.id}`, `Type ${m.type}`];
  if (L && L !== m.id) titleParts.push(`Lock parent: ${L}`);
  return (
    <React.Fragment key={m.id}>
      <button
        type="button"
        className={`ghost-module-btn ghost-module-depth-${d}`}
        title={titleParts.join(' · ')}
        onClick={() => onSelect(m.id)}
      >
        <span className="ghost-module-id">{m.id}</span>
        <span className="ghost-module-name">{m.name}</span>
        <ModuleTypePill t={m.type} />
      </button>
    </React.Fragment>
  );
}

function ModuleMenuTree({ modules, onSelect }: { modules: PrimeModule[]; onSelect: (id: number) => void }) {
  const { primaryRoots, children } = buildLockParentTree(modules);
  return (
    <>
      {primaryRoots.map(m => renderModuleBranch(m, 0, children, onSelect))}
    </>
  );
}

const NavContent = ({
  onModuleSelect,
  onClose,
  isPinned,
  onTogglePin,
  navMenus,
  allModules,
  openSectionId,
  setOpenSectionId,
}: NavContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase().trim();
    return allModules.filter(m =>
      m.name.toLowerCase().includes(term) || m.id.toString().includes(term)
    );
  }, [allModules, searchTerm]);

  const handleSelect = (id: number) => {
    onModuleSelect(id);
    if (onClose) onClose();
    setSearchTerm('');
  };

  const toggleSection = (id: number) => {
    setOpenSectionId(prev => (prev === id ? null : id));
  };

  return (
    <>
      <div className="ghost-panel-header">
        <span className="ghost-panel-title">Navigation</span>
        <button
          type="button"
          className="ghost-pin-btn"
          onClick={onTogglePin}
          title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
        >
          {isPinned ? '✕ unpin' : '📌 pin'}
        </button>
      </div>

      <div className="ghost-search">
        <div className="ghost-search-inner">
          <SearchIcon />
          <input
            ref={inputRef}
            className="ghost-search-input"
            placeholder="Search modules…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          {searchTerm && (
            <button type="button" className="ghost-search-clear" onClick={() => setSearchTerm('')}>
              <XIcon />
            </button>
          )}
        </div>
      </div>

      <div className="ghost-scroll">
        {navMenus.length === 0 && (
          <div className="ghost-loading-hint">Loading modules…</div>
        )}

        {searchResults && (
          <>
            <div className="ghost-result-label">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </div>
            {searchResults.length === 0 && (
              <div className="ghost-loading-hint">No modules found</div>
            )}
            {searchResults.map(mod => {
              const L = mod.lockModuleId ?? 0;
              const sub = L && L !== mod.id ? ` · lock ${L}` : '';
              return (
                <button
                  key={mod.id}
                  type="button"
                  className="ghost-module-btn ghost-module-depth-0"
                  title={`${mod.name} (${mod.type})${sub}`}
                  onClick={() => handleSelect(mod.id)}
                >
                  <span className="ghost-module-id">{mod.id}</span>
                  <span className="ghost-module-name">{mod.name}</span>
                  <ModuleTypePill t={mod.type} />
                </button>
              );
            })}
          </>
        )}

        {!searchResults && navMenus.length > 0 && navMenus.map(menu => {
          if (menu.id === REPORTS_MENU_ID) return null; // Reports live in ActionBar
          const menuModules = getModulesForMainMenu(menu.id, allModules);
          if (menuModules.length === 0) return null;

          const isOpen = openSectionId === menu.id;

          return (
            <div className="ghost-section" key={menu.id}>
              <button
                type="button"
                className={`ghost-section-btn ${isOpen ? 'is-open' : ''}`}
                onClick={() => toggleSection(menu.id)}
              >
                <span className="ghost-section-icon">{menu.icon}</span>
                <span className="ghost-section-label">{menu.label}</span>
                <span className="ghost-chevron">
                  <ChevronRightIcon />
                </span>
              </button>

              <div className={`ghost-items ${isOpen ? 'is-open' : ''}`}>
                <ModuleMenuTree modules={menuModules} onSelect={handleSelect} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const GhostRail = ({ onModuleSelect, hasOpenTab, isPinned, onTogglePin }: GhostRailProps) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<number | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadModules().then(() => setLoaded(true));
  }, []);

  const allModules = useMemo(() => Object.values(moduleRegistry), [loaded]);

  const navMenus = useMemo(
    () => (loaded ? getNavMenusWithModules(allModules) : []),
    [loaded, allModules]
  );

  useEffect(() => {
    if (hasOpenTab && !isPinned) setPanelOpen(false);
  }, [hasOpenTab, isPinned]);

  const openPanel = useCallback(() => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    if (!isPinned) {
      hoverTimeout.current = setTimeout(() => setPanelOpen(true), 80);
    }
  }, [isPinned]);

  const closePanel = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    leaveTimeout.current = setTimeout(() => setPanelOpen(false), 180);
  }, []);

  const keepOpen = useCallback(() => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
  }, []);

  const focusRailMenu = useCallback((menuId: number) => {
    setOpenSectionId(menuId);
    if (!isPinned) setPanelOpen(true);
  }, [isPinned]);

  return (
    <>
      <aside
        className={`ghost-rail ${isPinned ? 'is-pinned' : ''}`}
        onMouseEnter={openPanel}
        onMouseLeave={closePanel}
      >
        <div className="rail-logo">
          <div className="rail-logo-box">B</div>
          <span className="rail-logo-name">PRIME CORE</span>
        </div>

        {!isPinned && (
          <div className="rail-icons">
            {navMenus.map(menu => (
              <button
                key={menu.id}
                type="button"
                className={`rail-icon-btn ${openSectionId === menu.id && panelOpen ? 'is-active' : ''}`}
                title={menu.label}
                onClick={() => focusRailMenu(menu.id)}
              >
                {menu.icon}
                <span className="rail-dot" />
              </button>
            ))}
          </div>
        )}

        {isPinned && (
          <div className="ghost-panel-inline">
            <NavContent
              onModuleSelect={onModuleSelect}
              isPinned={isPinned}
              onTogglePin={onTogglePin}
              navMenus={navMenus}
              allModules={allModules}
              openSectionId={openSectionId}
              setOpenSectionId={setOpenSectionId}
            />
          </div>
        )}
      </aside>

      {!isPinned && (
        <div
          className={`ghost-panel ${panelOpen ? 'is-open' : ''}`}
          onMouseEnter={keepOpen}
          onMouseLeave={closePanel}
        >
          <NavContent
            onModuleSelect={onModuleSelect}
            onClose={() => setPanelOpen(false)}
            isPinned={isPinned}
            onTogglePin={onTogglePin}
            navMenus={navMenus}
            allModules={allModules}
            openSectionId={openSectionId}
            setOpenSectionId={setOpenSectionId}
          />
        </div>
      )}
    </>
  );
};

export default GhostRail;