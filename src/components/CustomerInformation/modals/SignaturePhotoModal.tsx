import React, { useRef, useState } from 'react';
import Modal from '../../ui/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clientName?: string;
  clientId?: string;
}

interface ImageSlot {
  dataUrl: string | null;
  scannedBy: string;
  scannedOn: string;
  supervisedBy: string;
  supervisedOn: string;
}

const emptySlot = (): ImageSlot => ({
  dataUrl: null, scannedBy: '', scannedOn: '', supervisedBy: '', supervisedOn: '',
});

const SignaturePhotoModal: React.FC<Props> = ({ isOpen, onClose, clientName, clientId }) => {
  const [sig,   setSig]   = useState<ImageSlot>(emptySlot());
  const [photo, setPhoto] = useState<ImageSlot>(emptySlot());
  const sigRef   = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const loadFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<ImageSlot>>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setter(s => ({ ...s, dataUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const footer = (
    <div className="bk-modal-footer-btns">
      <button className="bk-btn bk-btn--view" onClick={() => window.print()}>🖨 Print</button>
      <button className="bk-btn bk-btn--cancel" onClick={onClose}>← Back</button>
    </div>
  );

  const SlotRow: React.FC<{
    title: string;
    slot: ImageSlot;
    setSlot: React.Dispatch<React.SetStateAction<ImageSlot>>;
    inputRef: React.RefObject<HTMLInputElement>;
  }> = ({ title, slot, setSlot, inputRef }) => (
    <div className="bk-sig-slot">
      <div className="bk-sig-slot__title">{title}</div>
      <div
        className="bk-sig-slot__canvas"
        onClick={() => inputRef.current?.click()}
        title={`Click to upload ${title.toLowerCase()}`}
      >
        {slot.dataUrl
          ? <img src={slot.dataUrl} alt={title} className="bk-sig-slot__img" />
          : <div className="bk-sig-slot__placeholder">
              <span className="bk-sig-slot__icon">{title === 'Signature' ? '✍' : '📷'}</span>
              <span>Click to upload {title}</span>
            </div>
        }
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => loadFile(e, setSlot)}
        />
      </div>
      <div className="bk-sig-meta">
        <div className="bk-form-row">
          <label className="bk-form-label" style={{ width: 110, minWidth: 110 }}>Scanned By</label>
          <input className="bk-input" value={slot.scannedBy}
            onChange={e => setSlot(s => ({ ...s, scannedBy: e.target.value }))} />
        </div>
        <div className="bk-form-row">
          <label className="bk-form-label" style={{ width: 110, minWidth: 110 }}>Scanned On</label>
          <input className="bk-input" type="date" value={slot.scannedOn}
            onChange={e => setSlot(s => ({ ...s, scannedOn: e.target.value }))} />
        </div>
        <div className="bk-form-row">
          <label className="bk-form-label" style={{ width: 110, minWidth: 110 }}>Supervised By</label>
          <input className="bk-input" value={slot.supervisedBy}
            onChange={e => setSlot(s => ({ ...s, supervisedBy: e.target.value }))} />
        </div>
        <div className="bk-form-row">
          <label className="bk-form-label" style={{ width: 110, minWidth: 110 }}>Supervised On</label>
          <input className="bk-input" type="date" value={slot.supervisedOn}
            onChange={e => setSlot(s => ({ ...s, supervisedOn: e.target.value }))} />
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title="Signature &amp; Photograph" subtitle={clientName}
      icon="📸" size="lg" footer={footer}
    >
      {(!sig.dataUrl && !photo.dataUrl) && (
        <div className="bk-sig-warning">
          ⚠ Signature / Photo is not available
        </div>
      )}

      <div className="bk-sig-grid">
        <SlotRow title="Signature" slot={sig} setSlot={setSig} inputRef={sigRef} />
        <SlotRow title="Photo"     slot={photo} setSlot={setPhoto} inputRef={photoRef} />
      </div>
    </Modal>
  );
};

export default SignaturePhotoModal;
