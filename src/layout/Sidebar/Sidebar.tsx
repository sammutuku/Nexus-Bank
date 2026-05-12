import React, { useState, useEffect, useMemo } from 'react';
import SidebarSearch from './SidebarSearch';
import MenuSection from './MenuSection';
import { MainMenus, moduleRegistry, loadModules } from '@modules/registry';
import './Sidebar.css';

interface SidebarProps {
  onModuleSelect: (id: number) => void;
  isCollapsed: boolean;
}

const Sidebar = ({ onModuleSelect, isCollapsed }: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadModules().then(() => setLoaded(true));
  }, []);

  const allModules = useMemo(() => Object.values(moduleRegistry), [loaded]);

  const modulesToShow = useMemo(() => {
    if (!searchTerm.trim()) return allModules;
    const term = searchTerm.toLowerCase().trim();
    return allModules.filter(m =>
      m.name.toLowerCase().includes(term) || m.id.toString().includes(term)
    );
  }, [allModules, searchTerm]);

  if (!loaded) {
    return (
      <aside className={`prime-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-loading">Loading…</div>
      </aside>
    );
  }

  return (
    <aside className={`prime-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-branding">
        <div className="logo-box">B</div>
        {!isCollapsed && <span className="brand-name">PRIME CORE</span>}
      </div>

      {!isCollapsed && <SidebarSearch onSearch={setSearchTerm} />}

      <nav className="sidebar-scroll-area">
        {MainMenus.map(menu => (
          <MenuSection
            key={menu.id}
            menu={menu}
            modules={menu.id === 0 ? [] : modulesToShow.filter(m => m.mainModuleId === menu.id)}
            isExpanded={!isCollapsed && (expandedMenu === menu.id || searchTerm !== '')}
            onToggle={() => setExpandedMenu(expandedMenu === menu.id ? null : menu.id)}
            onModuleClick={onModuleSelect}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
