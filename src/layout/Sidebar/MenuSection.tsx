import React from 'react';
import ModuleItem from './ModuleItem';
import type { PrimeModule, MenuItem } from '@modules/registry';

interface MenuSectionProps {
  menu: MenuItem;                    // Pass full menu object
  modules: PrimeModule[];
  isExpanded: boolean;
  onToggle: () => void;
  onModuleClick: (id: number) => void;
  isCollapsed?: boolean;
}

const MenuSection = ({ 
  menu,
  modules, 
  isExpanded, 
  onToggle, 
  onModuleClick,
  isCollapsed = false 
}: MenuSectionProps) => {
  
  if (modules.length === 0) return null;

  return (
    <div className={`menu-section ${isExpanded ? 'is-open' : ''}`}>
      <button 
        className="menu-section-header" 
        onClick={onToggle}
        title={isCollapsed ? menu.label : undefined}
      >
        <span className="folder-icon">{menu.icon}</span>
        
        {!isCollapsed && (
          <>
            <span className="menu-title">{menu.label}</span>
            <span className="chevron">{isExpanded ? '−' : '+'}</span>
          </>
        )}
      </button>
      
      {isExpanded && !isCollapsed && (
        <div className="menu-section-content">
          {modules.map((mod) => (
            <ModuleItem 
              key={mod.id} 
              id={mod.id} 
              name={mod.name} 
              onClick={onModuleClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuSection;