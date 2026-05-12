import React, { useState, useCallback } from 'react';
import { useModuleTab } from '@hooks/useModuleTab';

// ── Types & Constants ─────────────────────────────────────────────────────────
import type {
  CustomerRecord, AppMode, ModalType, ActiveTab,
  AddressRecord, NextOfKinRecord, IntroducerRecord,
  PersonalDetails, EmploymentDetails, SpecialOffers,
  ProfileChangeRecord,
} from '@types/customer.types';
import {
  INITIAL_CUSTOMER, SAMPLE_ACCOUNTS, SAMPLE_STATEMENT,
} from '@constants/customer.constants';

// ── Layout ────────────────────────────────────────────────────────────────────
import CustomerSidebar from './CustomerSidebar';
import CustomerHeader  from './CustomerHeader';
import AuditFooter     from './AuditFooter';
import ActionButtons   from '../ui/ActionButtons';

// ── Tabs ──────────────────────────────────────────────────────────────────────
import PersonalDetailsTab from './tabs/PersonalDetails';
import AddressTab         from './tabs/AddressTab';
import EmploymentTab      from './tabs/EmploymentTab';
import SpecialOffersTab   from './tabs/SpecialOffersTab';

// ── Modals ────────────────────────────────────────────────────────────────────
import AddressModal         from './modals/AddressModal';
import IntroducerModal      from './modals/IntroducerModal';
import NextOfKinModal       from './modals/NextOfKinModal';
import ProfileChangeModal   from './modals/ProfileChangeModal';
import ClientActivationModal from './modals/ClientActivationModal';
import ClientStatementModal from './modals/ClientStatementModal';
import SignaturePhotoModal  from './modals/SignaturePhotoModal';
import BankAccountsModal    from './modals/BankAccountsModal';

// ─────────────────────────────────────────────────────────────────────────────
const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'personal',      label: 'Personal'      },
  { id: 'address',       label: 'Address'       },
  { id: 'employment',    label: 'Employment'    },
  { id: 'specialOffers', label: 'Special Offers'},
];

const CustomerInformation: React.FC = () => {
  const { closeMe } = useModuleTab(1000);

  // ── Core state ──────────────────────────────────────────────────────────────
  const [customer,    setCustomer]    = useState<CustomerRecord>({ ...INITIAL_CUSTOMER });
  const [mode,        setMode]        = useState<AppMode>('add');
  const [activeTab,   setActiveTab]   = useState<ActiveTab>('personal');
  const [openModal,   setOpenModal]   = useState<ModalType>(null);
  const [activeSidebar, setActiveSidebar] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(true);

  // ── Auxiliary data ──────────────────────────────────────────────────────────
  const [kinList,     setKinList]     = useState<NextOfKinRecord[]>([]);
  const [introducer,  setIntroducer]  = useState<IntroducerRecord | undefined>(undefined);
  const [editAddress, setEditAddress] = useState<AddressRecord | undefined>(undefined);

  // ── Toast notifications ─────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const p = customer.personal;
    if (!p.firstName.trim())        { showToast('First Name is required',         'error'); return false; }
    if (!p.lastName.trim())         { showToast('Last Name is required',          'error'); return false; }
    if (!p.identificationNo.trim()) { showToast('Identification No is required',  'error'); return false; }
    if (!customer.clientType)       { showToast('Client Type is required',        'error'); return false; }
    return true;
  };

  // ── Customer patch helpers ──────────────────────────────────────────────────
  const patchCustomer = useCallback((patch: Partial<CustomerRecord>) =>
    setCustomer(c => ({ ...c, ...patch })), []);

  const patchPersonal = useCallback((patch: Partial<PersonalDetails>) =>
    setCustomer(c => ({
      ...c,
      personal: { ...c.personal, ...patch },
      clientName: patch.firstName !== undefined || patch.lastName !== undefined
        ? `${patch.firstName ?? c.personal.firstName} ${c.personal.middleName ? c.personal.middleName + ' ' : ''}${patch.lastName ?? c.personal.lastName}`.trim()
        : c.clientName,
    })), []);

  const patchEmployment = useCallback((patch: Partial<EmploymentDetails>) =>
    setCustomer(c => ({ ...c, employment: { ...c.employment, ...patch } })), []);

  const patchOffers = useCallback((patch: Partial<SpecialOffers>) =>
    setCustomer(c => ({ ...c, specialOffers: { ...c.specialOffers, ...patch } })), []);

  // ── Address helpers ─────────────────────────────────────────────────────────
  const handleSaveAddress = (addr: AddressRecord) => {
    setCustomer(c => {
      const exists = c.addresses.find(a => a.id === addr.id);
      const updated = exists
        ? c.addresses.map(a => a.id === addr.id ? addr : a)
        : [...c.addresses, { ...addr, id: addr.id || String(Date.now()) }];
      return { ...c, addresses: updated };
    });
    showToast('Address saved successfully');
  };

  const handleDeleteAddress = (id: string) => {
    setCustomer(c => ({ ...c, addresses: c.addresses.filter(a => a.id !== id) }));
    showToast('Address removed');
  };

  // ── Kin helpers ─────────────────────────────────────────────────────────────
  const handleSaveKin = (rec: NextOfKinRecord) => {
    setKinList(list => {
      const exists = list.find(k => k.id === rec.id);
      return exists ? list.map(k => k.id === rec.id ? rec : k) : [...list, rec];
    });
    showToast('Next of kin record saved');
  };

  const handleRemoveKin = (id: string) => setKinList(list => list.filter(k => k.id !== id));

  // ── CRUD actions ────────────────────────────────────────────────────────────
  const handleAdd = () => {
    setCustomer({ ...INITIAL_CUSTOMER });
    setKinList([]);
    setIntroducer(undefined);
    setMode('add');
    setActiveTab('personal');
    showToast('Ready to add new customer');
  };

  const handleEdit = () => {
    if (mode === 'view') setMode('edit');
  };

  const handleSave = () => {
    if (!validate()) return;
    const now = new Date().toLocaleDateString('en-GB');
    setCustomer(c => ({
      ...c,
      clientId:  c.clientId  || String(Math.floor(Math.random() * 90000) + 10000).padStart(8, '0'),
      createdOn: c.createdOn || now,
      modifiedOn: now,
      createdBy: c.createdBy || 'PRIME',
      status:    'Active',
      openDate:  c.openDate || now,
    }));
    setMode('view');
    showToast(`Customer ${customer.clientName || 'record'} saved successfully`);
  };

  const handleView  = () => setMode('view');
  const handleClose = () => { setMode('view'); showToast('Changes discarded'); };
  const handleCancel = () => {
    if (mode === 'add') handleAdd();
    else setMode('view');
  };

  const isDisabled = mode === 'view';

  return (
    <div className="bk-root">
      {/* ── App Title Bar ── */}
      <div className="bk-title-bar">
        <span className="bk-title-bar__icon">🏦</span>
        <span className="bk-title-bar__text">Customer Information — KYC Onboarding</span>
        <span className="bk-title-bar__close" onClick={closeMe} title="Close">✕</span>
      </div>

      <div className="bk-layout">
        {/* ── Collapsible sub menu ── */}
        <div
          className={`bk-sidebar-wrap${sidebarOpen ? '' : ' bk-sidebar-wrap--collapsed'}`}
        >
          <CustomerSidebar
            navId="kyc-subnav"
            onOpenModal={setOpenModal}
            activeSidebar={activeSidebar}
            setActiveSidebar={setActiveSidebar}
          />
          <button
            type="button"
            className="bk-shell-toggle bk-shell-toggle--between-main-and-sidebar"
            aria-expanded={sidebarOpen}
            aria-controls="kyc-subnav"
            title={sidebarOpen ? 'Hide sub menu' : 'Show sub menu'}
            onClick={() => setSidebarOpen(o => !o)}
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>

        {/* ── Main Content ── */}
        <main className="bk-main">
          {/* Header (Branch / Client fields) */}
          <CustomerHeader
            customer={customer}
            disabled={isDisabled}
            onChange={patchCustomer}
          />

          {/* Tabs */}
          <div className="bk-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`bk-tab ${activeTab === tab.id ? 'bk-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bk-tab-content">
            {activeTab === 'personal' && (
              <PersonalDetailsTab
                data={customer.personal}
                disabled={isDisabled}
                onChange={patchPersonal}
              />
            )}

            {activeTab === 'address' && (
              <AddressTab
                addresses={customer.addresses}
                disabled={isDisabled}
                onOpenAddressModal={addr => {
                  setEditAddress(addr);
                  setOpenModal('address');
                }}
              />
            )}

            {activeTab === 'employment' && (
              <EmploymentTab
                data={customer.employment}
                disabled={isDisabled}
                onChange={patchEmployment}
              />
            )}

            {activeTab === 'specialOffers' && (
              <SpecialOffersTab
                data={customer.specialOffers}
                disabled={isDisabled}
                onChange={patchOffers}
              />
            )}
          </div>

          {/* Mode indicator badge */}
          <div className="bk-mode-bar">
            <span className={`bk-mode-badge bk-mode-badge--${mode}`}>
              {mode === 'add'  && '✚ ADD MODE'}
              {mode === 'edit' && '✎ EDIT MODE'}
              {mode === 'view' && '👁 VIEW MODE'}
            </span>
            {customer.clientId && (
              <span className="bk-client-id-display">
                Client: <strong>{customer.clientId}</strong>
                {customer.clientName && ` — ${customer.clientName}`}
              </span>
            )}
          </div>

          {/* Audit footer */}
          <AuditFooter
            status={customer.status}
            openDate={customer.openDate}
            closedDate={customer.closedDate}
            createdBy={customer.createdBy}
            modifiedBy={customer.modifiedBy}
            supervisedBy={customer.supervisedBy}
            createdOn={customer.createdOn}
            modifiedOn={customer.modifiedOn}
            supervisedOn={customer.supervisedOn}
          />
        </main>

        {/* ── Collapsible action rail ── */}
        <div
          className={`bk-actions-wrap${actionsOpen ? '' : ' bk-actions-wrap--collapsed'}`}
        >
          <div className="bk-actions-wrap__inner">
            <ActionButtons
              mode={mode}
              onView={handleView}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onClose={handleClose}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
          <button
            type="button"
            className="bk-shell-toggle bk-shell-toggle--between-main-and-actions"
            aria-expanded={actionsOpen}
            title={actionsOpen ? 'Hide actions' : 'Show actions'}
            onClick={() => setActionsOpen(o => !o)}
          >
            {actionsOpen ? '»' : '«'}
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`bk-toast bk-toast--${toast.type}`}>
          {toast.type === 'success' ? '✔' : '✕'} {toast.msg}
        </div>
      )}

      {/* ═══════════════════ MODALS ═══════════════════════════════════════════ */}

      <AddressModal
        isOpen={openModal === 'address'}
        onClose={() => { setOpenModal(null); setEditAddress(undefined); }}
        onSave={handleSaveAddress}
        onDelete={handleDeleteAddress}
        initial={editAddress}
        clientName={customer.clientName}
      />

      <IntroducerModal
        isOpen={openModal === 'introducer'}
        onClose={() => setOpenModal(null)}
        onSave={setIntroducer}
        initial={introducer}
        clientName={customer.clientName}
      />

      <NextOfKinModal
        isOpen={openModal === 'nextOfKin'}
        onClose={() => setOpenModal(null)}
        onSave={handleSaveKin}
        onRemove={handleRemoveKin}
        kinList={kinList}
        clientName={customer.clientName}
      />

      <ProfileChangeModal
        isOpen={openModal === 'profileChange'}
        onClose={() => setOpenModal(null)}
        onSave={(rec: ProfileChangeRecord) => showToast('Profile change recorded')}
        initial={{
          clientName: customer.clientName,
          clientType: customer.clientType,
          title:      customer.personal.title,
          firstName:  customer.personal.firstName,
          middleName: customer.personal.middleName,
          lastName:   customer.personal.lastName,
          gender:     customer.personal.gender,
          age:        customer.personal.age,
        }}
        clientName={customer.clientName}
      />

      <ClientActivationModal
        isOpen={openModal === 'clientActivation'}
        onClose={() => setOpenModal(null)}
        onApprove={() => showToast('Client approved & activated')}
        accounts={SAMPLE_ACCOUNTS}
        clientName={customer.clientName}
      />

      <ClientStatementModal
        isOpen={openModal === 'clientStatement'}
        onClose={() => setOpenModal(null)}
        records={SAMPLE_STATEMENT}
        clientName={customer.clientName}
      />

      <SignaturePhotoModal
        isOpen={openModal === 'signaturePhoto'}
        onClose={() => setOpenModal(null)}
        clientName={customer.clientName}
        clientId={customer.clientId}
      />

      <BankAccountsModal
        isOpen={openModal === 'bankAccounts'}
        onClose={() => setOpenModal(null)}
        accounts={SAMPLE_ACCOUNTS}
        clientName={customer.clientName}
      />
    </div>
  );
};

export default CustomerInformation;