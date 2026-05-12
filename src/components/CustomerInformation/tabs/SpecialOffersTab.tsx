import React from 'react';
import type { SpecialOffers } from '../../../types/customer.types';

interface Props {
  data: SpecialOffers;
  disabled: boolean;
  onChange: (patch: Partial<SpecialOffers>) => void;
}

const OFFER_FIELDS: { key: keyof SpecialOffers; label: string; icon: string; desc: string }[] = [
  { key: 'canSendGreetings',              label: 'Can Send Greetings',              icon: '🎉', desc: 'Send birthday & anniversary greetings to this client'   },
  { key: 'canSendAssociateSpecialOffer',  label: 'Can Send Associate Special Offer', icon: '🤝', desc: 'Forward associate / partner promotional offers'          },
  { key: 'canSendOurSpecialOffers',       label: 'Can Send Our Special Offers',      icon: '🏷️', desc: 'Send institution\'s own product promotions'              },
  { key: 'statementOnline',              label: 'Statement Online',                 icon: '📄', desc: 'Deliver account statements via online portal / email'    },
  { key: 'mobileAlert',                  label: 'Mobile Alert',                     icon: '📱', desc: 'Push SMS / in-app alerts for account activity'           },
];

const SpecialOffersTab: React.FC<Props> = ({ data, disabled, onChange }) => (
  <div className="bk-panel">
    <div className="bk-panel__header">Special Offers &amp; Communication Preferences</div>
    <div className="bk-panel__body">
      <p className="bk-note" style={{ marginBottom: 18 }}>
        Configure which communications this client has consented to receive.
      </p>

      <div className="bk-offers-grid">
        {OFFER_FIELDS.map(({ key, label, icon, desc }) => (
          <label
            key={key}
            className={`bk-offer-card ${data[key] ? 'bk-offer-card--active' : ''} ${disabled ? 'bk-offer-card--disabled' : ''}`}
          >
            <div className="bk-offer-card__left">
              <span className="bk-offer-card__icon">{icon}</span>
              <div>
                <div className="bk-offer-card__label">{label}</div>
                <div className="bk-offer-card__desc">{desc}</div>
              </div>
            </div>
            <div className="bk-offer-card__toggle">
              <input
                type="checkbox"
                className="bk-toggle-input"
                checked={data[key] as boolean}
                disabled={disabled}
                onChange={e => onChange({ [key]: e.target.checked })}
              />
              <span className="bk-toggle-track">
                <span className="bk-toggle-thumb" />
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default SpecialOffersTab;
