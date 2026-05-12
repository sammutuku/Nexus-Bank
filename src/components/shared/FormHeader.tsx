import React from 'react';
import SearchButton from './SearchModal/SearchButton';

export interface HeaderField {
  id: string;
  label: string;
  value: string | number;
  type?: 'text' | 'select' | 'display' | 'readonly';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  searchable?: boolean;
  entityType?: string;
  width?: number | string;
  readOnly?: boolean;
  onSearchSelect?: (row: any) => void;
  onChange?: (value: string) => void;
}

interface FormHeaderProps {
  fields: HeaderField[];
}

const FormHeader: React.FC<FormHeaderProps> = ({ fields }) => (
  <header className="bk-header">
    <div className="bk-header__grid">
      {fields.map((field) => (
        <div key={field.id} className="bk-header__row">
          <span
            className={`bk-header__label ${field.required ? 'bk-header__label--required' : ''}`}
          >
            {field.label}
            {field.required && <span className="bk-text-required"> *</span>}
          </span>

          {field.type === 'display' && (
            <span className="bk-header__value" style={{ width: field.width || 'auto' }}>
              {field.value}
            </span>
          )}

          {field.type === 'readonly' && (
            <input
              className="bk-header__input"
              type="text"
              value={field.value}
              readOnly
              style={{
                background: 'var(--bank-bg-alt)',
                width: field.width || '100%',
              }}
            />
          )}

          {field.type === 'text' && (
            <>
              <input
                className="bk-header__input"
                type="text"
                value={field.value}
                placeholder={field.placeholder}
                disabled={field.disabled}
                onChange={(e) => field.onChange?.(e.target.value)}
                style={{ width: field.width || '100%' }}
              />
              {field.searchable && (
                <SearchButton
                  entityType={field.entityType || 'generic'}
                  disabled={field.disabled}
                  title={`Search ${field.label}`}
                  className="bk-header__search-btn"
                  onSelect={field.onSearchSelect}
                />
              )}
            </>
          )}

          {field.type === 'select' && (
            <select
              className="bk-header__select"
              value={field.value}
              disabled={field.disabled}
              onChange={(e) => field.onChange?.(e.target.value)}
              style={{ width: field.width || '100%' }}
            >
              <option value="">--Select--</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  </header>
);

export default FormHeader;
