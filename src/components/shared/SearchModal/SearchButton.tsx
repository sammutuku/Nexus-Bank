import React, { useState } from 'react';
import SearchModal from './SearchModal';
import { SearchEntityType } from './searchConfig';

interface SearchButtonProps {
  entityType: SearchEntityType;
  onSelect: (row: Record<string, string>) => void;
  disabled?: boolean;
  title?: string;
  className?: string;
}

/**
 * Drop-in search trigger button.
 * Renders a 🔍 icon and manages the SearchModal lifecycle.
 *
 * Usage:
 *   <SearchButton
 *     entityType="branch"
 *     className="bk-header__search-btn"
 *     onSelect={row => onChange({ branchId: row.branchId, branchName: row.branchName })}
 *   />
 *
 * The className prop lets each module pass its own button style.
 * Falls back to "search-btn" (defined in index.css) if omitted.
 */
const SearchButton: React.FC<SearchButtonProps> = ({
  entityType,
  onSelect,
  disabled = false,
  title,
  className,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className ?? 'search-btn'}
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        title={title ?? `Search ${entityType}`}
      >
        🔍
      </button>

      <SearchModal
        isOpen={open}
        entityType={entityType}
        onSelect={row => { onSelect(row); setOpen(false); }}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default SearchButton;