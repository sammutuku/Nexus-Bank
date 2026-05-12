import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

// ── Types ─────────────────────────────────────────────────────────────────────
type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen:    boolean;
  onClose:   () => void;
  title:     string;
  subtitle?: string;
  icon?:     string;
  size?:     ModalSize;
  footer?:   React.ReactNode;
  children:  React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  size = 'md',
  footer,
  children,
}) => {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // ── Close on overlay click (but not on modal content click) ──
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modal = (
    <div
      className="bk-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleOverlayClick}
    >
      <div className={`bk-modal bk-modal--${size}`}>

        {/* ── Header ── */}
        <div className="bk-modal__header">
          <div>
            <div className="bk-modal__title">
              {icon && <span className="bk-modal__title-icon">{icon}</span>}
              {title}
            </div>
            {subtitle && (
              <div className="bk-modal__subtitle">{subtitle}</div>
            )}
          </div>
          <button
            className="bk-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="bk-modal__body">
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div className="bk-modal__footer">
            {footer}
          </div>
        )}

      </div>
    </div>
  );

  // 🔑 Portal — renders at document.body, completely outside the layout tree.
  // This is why modals were showing inline: without createPortal they render
  // inside .bk-root which has overflow:hidden and its own stacking context.
  return ReactDOM.createPortal(modal, document.body);
};

export default Modal;