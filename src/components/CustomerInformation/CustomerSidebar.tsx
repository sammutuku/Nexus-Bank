import React from 'react';
import type { ModalType } from '../../types/customer.types';

interface SidebarProps {
  onOpenModal:  (modal: ModalType) => void;
  activeSidebar: string;
  setActiveSidebar: (key: string) => void;
  /** For aria-controls / landmark labelling when the shell is collapsible */
  navId?: string;
}

const DATA_ENTRY_ITEMS: { key: ModalType; label: string }[] = [
  { key: 'address',         label: 'Address' },
  { key: 'introducer',      label: 'Introducer Details' },
  { key: 'signaturePhoto',  label: 'Capture Photo & Signature' },
  { key: 'bankAccounts',    label: 'Bank Accounts' },
  { key: 'nextOfKin',       label: 'Next Of Kin / Relation' },
  { key: 'profileChange',   label: 'Client Profile Change' },
  { key: null,              label: 'Demise Details' },
  { key: null,              label: 'Referral' },
  { key: null,              label: 'ESG Indicators' },
  { key: null,              label: 'User Role' },
  { key: 'clientActivation',label: 'Client Activation' },
];

const VIEW_ITEMS: { key: ModalType; label: string }[] = [
  { key: 'clientStatement', label: 'Client Statement' },
  { key: 'signaturePhoto',  label: 'Signature & Photograph' },
];

const CustomerSidebar: React.FC<SidebarProps> = ({ onOpenModal, activeSidebar, setActiveSidebar, navId }) => (
  <nav id={navId} className="bk-sidebar" aria-label="Customer module navigation">
    {/* DataEntry section */}
    <div className="bk-sidebar__section-header">DataEntry</div>
    {DATA_ENTRY_ITEMS.map(({ key, label }) => (
      <div
        key={label}
        className={`bk-sidebar__item ${activeSidebar === label ? 'bk-sidebar__item--active' : ''}`}
        onClick={() => {
          setActiveSidebar(label);
          if (key) onOpenModal(key);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' && key) onOpenModal(key); }}
      >
        {label}
      </div>
    ))}

    {/* View section */}
    <div className="bk-sidebar__section-header">View</div>
    {VIEW_ITEMS.map(({ key, label }) => (
      <div
        key={label}
        className={`bk-sidebar__item ${activeSidebar === label ? 'bk-sidebar__item--active' : ''}`}
        onClick={() => {
          setActiveSidebar(label);
          if (key) onOpenModal(key);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' && key) onOpenModal(key); }}
      >
        {label}
      </div>
    ))}

    <div className="bk-sidebar__footer">BANTU MENU</div>
  </nav>
);

export default CustomerSidebar;
