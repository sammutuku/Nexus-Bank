// @types/loan.types.ts — PRIME CORE loan module type definitions

export type AppMode = 'view' | 'add' | 'edit';
export type ActiveTab = 'currentStatus' | 'loanDetails';
export type ModalType = string | null;

// ── Loan Current Status ────────────────────────────────────────────────────
export interface LoanCurrentStatus {
  loanBalance:               number | string;
  loanAmount:                number | string;
  disbursedAmount:           number | string;
  disbursedDate:             string;           // "04/Mar/2026"
  unearnedInterest:          number | string;
  outstandingPrincipal:      number | string;
  overdueInterest:           number | string;
  outstandingInterest:       number | string;
  overduePrincipal:          number | string;
  overduePenaltyReceivable:  number | string;
  totalLoanAmount:           number | string;
  arrearDays:                number | string;
  lastRescheduledOn:         string;
  loanStatus:                string;           // "Normal" | "Overdue" | "Written Off"
}

// ── Loan Details ───────────────────────────────────────────────────────────
export interface LoanDetails {
  productId:             string;
  currencyId:            string;
  sanctionAmount:        number | string;
  sanctionDate:          string;
  bookedAmount:          number | string;
  term:                  number | string;      // months
  repaymentFrequency:    string;
  calculationMethod:     string;
  netCollateralValue:    number | string;
  interestRateType:      string;
  markUpRate:            number | string;
  interestRate:          number | string;
  installmentStartDate:  string;
  valueDate:             string;
  maturityDate:          string;
  installmentAmount:     number | string;      // computed / read-only
  graceDays:             number | string;
  gracePeriod:           number | string;
  accruedInterestUnpaid: number | string;      // read-only
}

// ── Loan Record (top-level) ────────────────────────────────────────────────
export interface LoanRecord {
  // Header identity fields
  branchId:       string;
  branchName:     string;
  clientId:       string;
  clientName:     string;
  accountNumber:  string;
  loanRefNo:      string;
  loanSeries:     string;
  fileNumber:     string;
  loanPurpose:    string;
  healthCode:     string;
  creditOfficer:  string;
  loanType:       string;    // "Normal/Direct" etc.

  // Tabs
  currentStatus:  LoanCurrentStatus;
  loanDetails:    LoanDetails;

  // Audit
  status:         string;
  createdBy:      string;
  createdOn:      string;
  modifiedBy:     string;
  modifiedOn:     string;
  supervisedBy:   string;
  supervisedOn:   string;
  closedDate:     string;
}