import React from 'react';
import Sidebar from '../shared/Sidebar';
import type { ModalType } from '@types/loan.types';

interface LoanSidebarProps {
  onOpenModal: (modal: ModalType) => void;
  activeSidebar: string;
  setActiveSidebar: (key: string) => void;
  navId?: string;
}

const LOAN_SECTIONS = [
  {
    title: 'DataEntry',
    items: [
      { key: 'loanCollaterals' as ModalType, label: 'Loan Collaterals' },
      { key: 'writeoffRecovery' as ModalType, label: 'Writeoff Recovery' },
      { key: 'insurance' as ModalType, label: 'Insurance' },
      { key: 'guarantor' as ModalType, label: 'Guarantor' },
      { key: 'fsdDetailsLegal' as ModalType, label: 'FSD DETAILS AND LEGAL' },
      { key: 'releaseFreezeInstruction' as ModalType, label: 'Release Freeze Instruction' },
      { key: 'loanClosingOpening' as ModalType, label: 'Loan Closing/Opening' },
      { key: 'refinanceStatement' as ModalType, label: 'Refinance Statement' },
      { key: 'settlementQuotation' as ModalType, label: 'Settlement Quotation' },
    ],
  },
  {
    title: 'View',
    items: [
      { key: 'loanStatement' as ModalType, label: 'Loan Statement' },
      { key: 'repaymentSchedule' as ModalType, label: 'Repayment Schedule' },
    ],
  },
];

const LoanSidebar: React.FC<LoanSidebarProps> = ({
  onOpenModal,
  activeSidebar,
  setActiveSidebar,
  navId,
}) => (
  <Sidebar
    sections={LOAN_SECTIONS}
    onOpenModal={onOpenModal}
    activeSidebar={activeSidebar}
    setActiveSidebar={setActiveSidebar}
    navId={navId}
  />
);

export default LoanSidebar;
