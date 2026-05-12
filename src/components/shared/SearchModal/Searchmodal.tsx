import React, { useState, useEffect, useCallback } from 'react';
import { SEARCH_CONFIGS, SearchEntityType, FilterOperator } from './searchConfig';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  entityType: SearchEntityType;
  onSelect: (row: Record<string, string>) => void;
  onClose: () => void;
}

const PAGE_SIZE = 15;

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, entityType, onSelect, onClose }) => {
  const config = SEARCH_CONFIGS[entityType];

  // Safe init — guards against missing entityType in SEARCH_CONFIGS.
  // Passed as a function ref so React calls it once on mount, not on every render.
  const initFilters = (): { key: string; operator: FilterOperator; value: string }[] =>
    config
      ? config.filters.map(f => ({ key: f.key, operator: f.operators[0] as FilterOperator, value: '' }))
      : [];

  const [filters, setFilters] = useState(initFilters);
  const [results, setResults] = useState<Record<string, string>[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  // Reset when entity type changes or modal opens
  useEffect(() => {
    if (isOpen && config) {
      setFilters(config.filters.map(f => ({ key: f.key, operator: f.operators[0] as FilterOperator, value: '' })));
      setResults([]);
      setSearched(false);
      setSelectedIdx(null);
      setPage(1);
    }
  }, [isOpen, entityType]);

  const handleSearch = useCallback(() => {
    let data = [...config.mockData];
    filters.forEach(f => {
      if (!f.value.trim()) return;
      const val = f.value.toLowerCase();
      data = data.filter(row => {
        const cell = (row[f.key] ?? '').toLowerCase();
        if (f.operator === 'Equal')       return cell === val;
        if (f.operator === 'Starts With') return cell.startsWith(val);
        if (f.operator === 'Ends With')   return cell.endsWith(val);
        return cell.includes(val); // Like (default)
      });
    });
    setResults(data);
    setSearched(true);
    setSelectedIdx(null);
    setPage(1);
  }, [filters, config]);

  // Press Enter on any filter field triggers search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') onClose();
  };

  const handleOk = () => {
    if (selectedIdx !== null) {
      const pageStart = (page - 1) * PAGE_SIZE;
      onSelect(results[pageStart + selectedIdx]);
      onClose();
    }
  };

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!isOpen) return null;

  // Guard: entityType not registered in SEARCH_CONFIGS — fail gracefully
  if (!config) {
    console.warn(`[SearchModal] No config found for entityType: "${entityType}"`);
    return (
      <div className="sm-overlay" onClick={onClose}>
        <div className="sm-modal" style={{ maxWidth: 400, padding: 32, textAlign: 'center' }}>
          <p style={{ color: 'var(--bank-text-muted)', marginBottom: 16 }}>
            Search not configured for <strong>{entityType}</strong>
          </p>
          <button className="sm-btn sm-btn--cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sm-modal" onKeyDown={handleKeyDown}>
        {/* ── Header ── */}
        <div className="sm-header">
          <span className="sm-title">{config.title}</span>
          <button className="sm-header-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Filters ── */}
        <div className="sm-filters">
          {config.filters.map((f, i) => (
            <div key={f.key} className="sm-filter-row">
              <label className="sm-filter-label">{f.label}</label>
              <select
                className="sm-operator"
                value={filters[i]?.operator}
                onChange={e => setFilters(prev => prev.map((p, idx) =>
                  idx === i ? { ...p, operator: e.target.value as FilterOperator } : p
                ))}
              >
                {f.operators.map(op => <option key={op} value={op}>{op}</option>)}
              </select>
              <input
                className="sm-filter-input"
                type="text"
                value={filters[i]?.value ?? ''}
                onChange={e => setFilters(prev => prev.map((p, idx) =>
                  idx === i ? { ...p, value: e.target.value } : p
                ))}
                autoFocus={i === 0}
              />
            </div>
          ))}
          <div className="sm-filter-actions">
            <button className="sm-search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="sm-results-section">
          <div className="sm-results-label">Search Results</div>
          <div className="sm-table-wrap">
            <table className="sm-table">
              <thead>
                <tr>
                  <th className="sm-th sm-th--num">#</th>
                  {config.columns.map(col => (
                    <th key={col.key} className="sm-th" style={{ width: col.width }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageResults.length === 0 ? (
                  <tr>
                    <td
                      colSpan={config.columns.length + 1}
                      className="sm-empty"
                    >
                      {searched ? 'No records found.' : 'Enter criteria and click Search.'}
                    </td>
                  </tr>
                ) : (
                  pageResults.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`sm-row ${selectedIdx === idx ? 'sm-row--selected' : ''}`}
                      onClick={() => setSelectedIdx(idx)}
                      onDoubleClick={() => {
                        setSelectedIdx(idx);
                        const pageStart = (page - 1) * PAGE_SIZE;
                        onSelect(results[pageStart + idx]);
                        onClose();
                      }}
                    >
                      <td className="sm-td sm-td--num">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      {config.columns.map(col => (
                        <td
                          key={col.key}
                          className={`sm-td ${col.mono ? 'sm-td--mono' : ''}`}
                        >
                          {row[col.key] ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="sm-footer">
          <div className="sm-pagination">
            {searched && results.length > 0 && (
              <>
                <button
                  className="sm-page-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >◀</button>
                <span className="sm-page-info">
                  Page {page} / {totalPages} &nbsp;·&nbsp; {results.length} record{results.length !== 1 ? 's' : ''}
                </span>
                <button
                  className="sm-page-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >▶</button>
              </>
            )}
          </div>
          <div className="sm-footer-btns">
            <button
              className="sm-btn sm-btn--ok"
              onClick={handleOk}
              disabled={selectedIdx === null}
            >
              OK
            </button>
            <button className="sm-btn sm-btn--cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;