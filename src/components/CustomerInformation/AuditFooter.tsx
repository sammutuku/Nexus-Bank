import React from 'react';

interface AuditFooterProps {
  status:      string;
  openDate:    string;
  closedDate:  string;
  createdBy:   string;
  modifiedBy:  string;
  supervisedBy:string;
  createdOn:   string;
  modifiedOn:  string;
  supervisedOn:string;
}

const AuditFooter: React.FC<AuditFooterProps> = ({
  status, openDate, closedDate,
  createdBy, modifiedBy, supervisedBy,
  createdOn, modifiedOn, supervisedOn,
}) => (
  <div className="bk-audit">
    <div className="bk-audit__header">Additional Information</div>
    <div className="bk-audit__grid">
      <div className="bk-audit__row">
        <span className="bk-audit__label">Status</span>
        <span className="bk-audit__value">{status}</span>
        <span className="bk-audit__label">Open Date</span>
        <span className="bk-audit__value">{openDate}</span>
        <span className="bk-audit__label">Closed Date</span>
        <span className="bk-audit__value">{closedDate}</span>
      </div>
      <div className="bk-audit__row">
        <span className="bk-audit__label">Created By</span>
        <span className="bk-audit__value">{createdBy}</span>
        <span className="bk-audit__label">Modified By</span>
        <span className="bk-audit__value">{modifiedBy}</span>
        <span className="bk-audit__label">Supervised By</span>
        <span className="bk-audit__value">{supervisedBy}</span>
      </div>
      <div className="bk-audit__row">
        <span className="bk-audit__label">Created On</span>
        <span className="bk-audit__value">{createdOn}</span>
        <span className="bk-audit__label">Modified On</span>
        <span className="bk-audit__value">{modifiedOn}</span>
        <span className="bk-audit__label">Supervised On</span>
        <span className="bk-audit__value">{supervisedOn}</span>
      </div>
    </div>
  </div>
);

export default AuditFooter;
