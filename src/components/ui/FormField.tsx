import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BaseProps {
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  labelWidth?: number;   // px
  className?: string;
}

interface InputProps extends BaseProps {
  type: 'text' | 'number' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suffix?: React.ReactNode; // e.g. search button
}

interface SelectProps extends BaseProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: string[] | { label: string; value: string }[];
  placeholder?: string;
}

interface CheckboxProps extends BaseProps {
  type: 'checkbox';
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface TextareaProps extends BaseProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

type FormFieldProps = InputProps | SelectProps | CheckboxProps | TextareaProps;

// ─── Component ────────────────────────────────────────────────────────────────
const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, required, disabled, error, labelWidth = 140, className = '' } = props;

  const labelStyle: React.CSSProperties = { width: labelWidth, minWidth: labelWidth };

  const renderControl = () => {
    if (props.type === 'checkbox') {
      return (
        <label className="ci-checkbox-wrapper">
          <input
            type="checkbox"
            className="ci-checkbox"
            checked={props.checked}
            disabled={disabled}
            onChange={e => props.onChange(e.target.checked)}
          />
          <span className="ci-checkbox-label">{label}</span>
        </label>
      );
    }

    if (props.type === 'select') {
      const opts = props.options;
      return (
        <select
          className="ci-select"
          value={props.value}
          disabled={disabled}
          onChange={e => props.onChange(e.target.value)}
        >
          <option value="">--Select--</option>
          {opts.map(o => {
            const val = typeof o === 'string' ? o : o.value;
            const lbl = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
      );
    }

    if (props.type === 'textarea') {
      return (
        <textarea
          className="ci-textarea"
          value={props.value}
          disabled={disabled}
          rows={props.rows ?? 3}
          placeholder={props.placeholder}
          onChange={e => props.onChange(e.target.value)}
        />
      );
    }

    // text / number / email
    return (
      <div className="ci-flex ci-gap-sm" style={{ flex: 1 }}>
        <input
          type={props.type}
          className="ci-input"
          value={props.value}
          disabled={disabled}
          placeholder={props.placeholder}
          onChange={e => props.onChange(e.target.value)}
        />
        {props.suffix}
      </div>
    );
  };

  // Checkbox has its own layout
  if (props.type === 'checkbox') {
    return (
      <div className={`ci-form-row ${className}`}>
        <span style={labelStyle} />
        {renderControl()}
        {error && <span className="ci-text-required ci-text-sm">{error}</span>}
      </div>
    );
  }

  return (
    <div className={`ci-form-row ${className}`}>
      <label
        className={`ci-form-label ${required ? 'ci-form-label--required' : ''}`}
        style={labelStyle}
      >
        {label}{required && <span className="ci-text-required"> *</span>}
      </label>
      <div className="ci-form-control">
        {renderControl()}
        {error && <div className="ci-text-required ci-text-sm" style={{ marginTop: 2 }}>{error}</div>}
      </div>
    </div>
  );
};

export default FormField;
