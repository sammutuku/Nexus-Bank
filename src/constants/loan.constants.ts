// @constants/loan.constants.ts — PRIME CORE loan module default values
// Add INITIAL_LOAN to your existing customer.constants.ts or import from here.

import type { LoanRecord } from '@types/loan.types';

export const INITIAL_LOAN: LoanRecord = {
  // Header
  branchId:      '00',
  branchName:    'HEAD OFFICE',
  clientId:      '',
  clientName:    '',
  accountNumber: '',
  loanRefNo:     '',
  loanSeries:    '',
  fileNumber:    '',
  loanPurpose:   '',
  healthCode:    '',
  creditOfficer: '',
  loanType:      'Normal/Direct',

  // Current Status tab — all zeroes/empty
  currentStatus: {
    loanBalance:              0,
    loanAmount:               0,
    disbursedAmount:          0,
    disbursedDate:            '',
    unearnedInterest:         0,
    outstandingPrincipal:     0,
    overdueInterest:          0,
    outstandingInterest:      0,
    overduePrincipal:         0,
    overduePenaltyReceivable: 0,
    totalLoanAmount:          0,
    arrearDays:               0,
    lastRescheduledOn:        '',
    loanStatus:               'Normal',
  },

  // Loan Details tab
  loanDetails: {
    productId:             '',
    currencyId:            'UGX',
    sanctionAmount:        0,
    sanctionDate:          '',
    bookedAmount:          0,
    term:                  0,
    repaymentFrequency:    '',
    calculationMethod:     '',
    netCollateralValue:    0,
    interestRateType:      '',
    markUpRate:            0,
    interestRate:          0,
    installmentStartDate:  '',
    valueDate:             '',
    maturityDate:          '',
    installmentAmount:     0,
    graceDays:             0,
    gracePeriod:           0,
    accruedInterestUnpaid: 0,
  },

  // Audit
  status:       '',
  createdBy:    '',
  createdOn:    '',
  modifiedBy:   '',
  modifiedOn:   '',
  supervisedBy: '',
  supervisedOn: '',
  closedDate:   '',
};