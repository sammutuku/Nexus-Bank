import React, { useState } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
}

const SidebarSearch = ({ onSearch }: SearchProps) => {
  return (
    <div className="sidebar-search-container">
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Search ID or Name..." 
          onChange={(e) => onSearch(e.target.value)}
          className="sidebar-search-input"
        />
      </div>
    </div>
  );
};

export default SidebarSearch;