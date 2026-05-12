import React from 'react';
import type { AppMode } from '../../types/customer.types';

interface ActionButtonsProps {
  mode:      AppMode;
  onView:    () => void;
  onAdd:     () => void;
  onEdit:    () => void;
  onClose:   () => void;
  onSave:    () => void;
  onCancel:  () => void;
}

// ── Button definitions ────────────────────────────────────────────────────────
interface BtnDef {
  id:       string;
  label:    string;
  icon:     string;
  variant:  string;
  onClick:  () => void;
  disabled?: boolean;
  group?:   'nav' | 'primary' | 'secondary';
}

// ─────────────────────────────────────────────────────────────────────────────
const ActionButtons: React.FC<ActionButtonsProps> = ({
  mode, onView, onAdd, onEdit, onClose, onSave, onCancel,
}) => {
  const isView = mode === 'view';
  const isAdd  = mode === 'add';
  const isEdit = mode === 'edit';

  const primaryActions: BtnDef[] = [
    {
      id: 'view', label: 'View', icon: '⇒',
      variant: 'view',
      onClick: onView,
      disabled: isView,
    },
    {
      id: 'add', label: 'Add', icon: '+',
      variant: 'add',
      onClick: onAdd,
    },
    {
      id: 'edit', label: 'Edit', icon: '✎',
      variant: 'edit',
      onClick: onEdit,
      disabled: isAdd || isEdit,
    },
  ];

  const secondaryActions: BtnDef[] = [
    {
      id: 'save', label: 'Save', icon: '✔',
      variant: 'save',
      onClick: onSave,
      disabled: isView,
    },
    {
      id: 'close', label: 'Close', icon: '✕',
      variant: 'close',
      onClick: onClose,
    },
    {
      id: 'cancel', label: 'Cancel', icon: '↩',
      variant: 'cancel',
      onClick: onCancel,
    },
  ];

  const Btn: React.FC<BtnDef> = ({ label, icon, variant, onClick, disabled }) => (
    <button
      className={`bk-actions__btn bk-actions__btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      type="button"
    >
      <span className="bk-actions__btn-icon">{icon}</span>
      <span className="bk-actions__btn-label">{label}</span>
    </button>
  );

  return (
    <aside className="bk-actions" aria-label="Record actions">

      {/* ── Navigation ── */}
      <div className="bk-actions__nav">
        <button className="bk-actions__nav-btn" title="Previous record" type="button">◀</button>
        <button className="bk-actions__nav-btn" title="Next record"     type="button">▶</button>
      </div>

      {/* ── Primary (record lifecycle) ── */}
      <div className="bk-actions__group-label">Record</div>
      {primaryActions.map(btn => <Btn key={btn.id} {...btn} />)}

      <div className="bk-actions__divider" />

      {/* ── Secondary (form actions) ── */}
      <div className="bk-actions__group-label">Form</div>
      {secondaryActions.map(btn => <Btn key={btn.id} {...btn} />)}

    </aside>
  );
};

export default ActionButtons;