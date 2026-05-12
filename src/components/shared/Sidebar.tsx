import React from 'react';

export type ModalType = string | null;

interface SidebarItem {
  key: ModalType;
  label: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  onOpenModal: (modal: ModalType) => void;
  activeSidebar: string;
  setActiveSidebar: (key: string) => void;
  navId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  onOpenModal,
  activeSidebar,
  setActiveSidebar,
  navId,
}) => (
  <nav id={navId} className="bk-sidebar" aria-label="Module navigation">
    {sections.map((section) => (
      <div key={section.title}>
        <div className="bk-sidebar__section-header">{section.title}</div>
        {section.items.map(({ key, label }) => (
          <div
            key={label}
            className={`bk-sidebar__item ${activeSidebar === label ? 'bk-sidebar__item--active' : ''}`}
            onClick={() => {
              setActiveSidebar(label);
              if (key) onOpenModal(key);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && key) onOpenModal(key);
            }}
          >
            {label}
          </div>
        ))}
      </div>
    ))}
    <div className="bk-sidebar__footer">BANTU MENU</div>
  </nav>
);

export default Sidebar;
