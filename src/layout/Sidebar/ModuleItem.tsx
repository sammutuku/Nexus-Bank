import React from 'react';

interface ModuleItemProps {
  id: number;
  name: string;
  onClick: (id: number) => void;
}

const ModuleItem = ({ id, name, onClick }: ModuleItemProps) => {
  const handleClick = () => {
    if (typeof onClick !== 'function') {
      console.error(`[ModuleItem] onClick is not a function for module id=${id}. Received:`, onClick);
      return;
    }
    onClick(id);
  };

  return (
    <button className="module-item-btn" onClick={handleClick}>
      <span className="module-id-badge">{id}</span>
      <span className="module-name-text">{name}</span>
    </button>
  );
};

export default ModuleItem;
