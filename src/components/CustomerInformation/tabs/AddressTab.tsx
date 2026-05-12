import React from 'react';
import type { AddressRecord } from '../../../types/customer.types';
import { ADDRESS_TYPES } from '../../../constants/customer.constants';

interface Props {
  addresses: AddressRecord[];
  disabled: boolean;
  onOpenAddressModal: (addr?: AddressRecord) => void;
}

const AddressTab: React.FC<Props> = ({ addresses, disabled, onOpenAddressModal }) => (
  <div className="bk-panel">
    <div className="bk-panel__header">Client Addresses</div>
    <div className="bk-panel__body">
      {addresses.length === 0 ? (
        <div className="bk-empty-state">
          <span className="bk-empty-state__icon">📍</span>
          <p className="bk-empty-state__text">No addresses on record.</p>
          {!disabled && (
            <button className="bk-btn bk-btn--add" onClick={() => onOpenAddressModal()}>
              + Add Address
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Address cards */}
          <div className="bk-address-grid">
            {addresses.map((addr, idx) => (
              <div key={addr.id || idx} className="bk-address-card">
                <div className="bk-address-card__badge">
                  {addr.addressType}
                  {addr.isCommunicationAddress && (
                    <span className="bk-address-card__comm-badge">✉ Comm.</span>
                  )}
                </div>
                <div className="bk-address-card__line">{addr.address1}</div>
                {addr.address2 && <div className="bk-address-card__line">{addr.address2}</div>}
                {addr.landmark && (
                  <div className="bk-address-card__sub">Landmark: {addr.landmark}</div>
                )}
                <div className="bk-address-card__line">
                  {addr.cityAreaName && `${addr.cityAreaName}, `}{addr.countryName}
                </div>
                {addr.mobile && (
                  <div className="bk-address-card__sub">📱 {addr.mobile}</div>
                )}
                {addr.phone1 && (
                  <div className="bk-address-card__sub">☎ {addr.phone1}</div>
                )}
                {addr.emailId && (
                  <div className="bk-address-card__sub">✉ {addr.emailId}</div>
                )}
                {!disabled && (
                  <div className="bk-address-card__actions">
                    <button
                      className="bk-btn bk-btn--sm bk-btn--edit"
                      onClick={() => onOpenAddressModal(addr)}
                    >
                      ✎ Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!disabled && (
            <div style={{ marginTop: 12 }}>
              <button className="bk-btn bk-btn--add" onClick={() => onOpenAddressModal()}>
                + Add Another Address
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);

export default AddressTab;
