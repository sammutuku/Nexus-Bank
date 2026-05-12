// src/components/shared/SearchModal/searchConfig.ts
// Central config for all searchable entities in the system.
// Add a new entry here to support a new search type anywhere in the app.

export type SearchEntityType =
  | 'branch'
  | 'account'
  | 'client'
  | 'product'
  | 'user'
  | 'role'
  | 'currency'
  | 'transaction'
  | 'workflow'
  | 'application'
  | 'siType';

export type FilterOperator = 'Like' | 'Equal' | 'Starts With' | 'Ends With';

export interface SearchFilter {
  key: string;
  label: string;
  operators: FilterOperator[];
}

export interface SearchColumn {
  key: string;
  label: string;
  width?: string;
  mono?: boolean;
}

export interface SearchEntityConfig {
  title: string;
  filters: SearchFilter[];
  columns: SearchColumn[];
  mockData: Record<string, string>[];
}

export const SEARCH_CONFIGS: Record<SearchEntityType, SearchEntityConfig> = {
  branch: {
    title: 'Branch',
    filters: [
      { key: 'branchName', label: 'Branch Name', operators: ['Like', 'Equal', 'Starts With'] },
      { key: 'branchId',   label: 'Branch ID',   operators: ['Like', 'Equal'] },
    ],
    columns: [
      { key: 'branchId',   label: 'OurBranchID', width: '120px', mono: true },
      { key: 'branchName', label: 'BranchName' },
    ],
    mockData: [
      { branchId: '00', branchName: 'HEAD OFFICE' },
      { branchId: '01', branchName: 'FORT PORTAL BRANCH' },
      { branchId: '02', branchName: 'BUNDIBUGYO BRANCH' },
      { branchId: '03', branchName: 'KASESE BRANCH' },
      { branchId: '04', branchName: 'HOIMA BRANCH' },
      { branchId: '05', branchName: 'MASINDI BRANCH' },
      { branchId: '06', branchName: 'KAGADI BRANCH' },
      { branchId: '07', branchName: 'BWERA BRANCH' },
      { branchId: '08', branchName: 'KYENJOJO BRANCH' },
      { branchId: '09', branchName: 'KAMWENGE BRANCH' },
      { branchId: '10', branchName: 'KYEGEGWA BRANCH' },
      { branchId: '11', branchName: 'RWIMI BRANCH' },
      { branchId: '12', branchName: 'ISHONGORORO BRANCH' },
      { branchId: '13', branchName: 'IGAYAZA BRANCH' },
    ],
  },

  account: {
    title: 'Account',
    filters: [
      { key: 'accountId',    label: 'Account ID',    operators: ['Like', 'Equal', 'Starts With'] },
      { key: 'name',         label: 'Name',          operators: ['Like', 'Equal', 'Starts With'] },
      { key: 'oldAccountId', label: 'Old Account ID',operators: ['Like', 'Equal'] },
    ],
    columns: [
      { key: 'accountId',    label: 'AccountID',    width: '140px', mono: true },
      { key: 'name',         label: 'Name' },
      { key: 'productId',    label: 'ProductID',    width: '80px' },
      { key: 'oldAccountId', label: 'OldAccountID', width: '120px', mono: true },
    ],
    mockData: [
      { accountId: '100000006801', name: 'BWAMBALE STEPHEN:-Kabarole',   productId: 'LSA', oldAccountId: '101102035086' },
      { accountId: '100100000101', name: 'FRANCIS KATO:-Kabale',         productId: 'LSA', oldAccountId: '' },
      { accountId: '100100000201', name: 'MEDRINE KABAYAGA:-Kabarole',   productId: 'LSA', oldAccountId: '' },
      { accountId: '100100000301', name: 'SHABAN AMANYIRE:-Kabarole',    productId: 'LSA', oldAccountId: '' },
      { accountId: '100100000401', name: 'RONALD ATUHAIRE:-Kabarole',    productId: 'LSA', oldAccountId: '' },
      { accountId: '100100000501', name: 'JOHNSOSN AHABWE:-Kabarole',    productId: 'LSA', oldAccountId: '' },
      { accountId: '100100000601', name: 'MOREEN KOBUSINGE:-Kabarole',   productId: 'LSA', oldAccountId: '' },
      { accountId: '100100000701', name: 'VOILET KANYIGINYA:-Kabarole',  productId: 'LSA', oldAccountId: '' },
      { accountId: '100100000801', name: 'KUSEMERERWA WILSON:-Kabarole', productId: 'LSA', oldAccountId: '' },
      { accountId: '100100000901', name: 'LUCY KANSIIME:-Kabarole',      productId: 'LSA', oldAccountId: '' },
    ],
  },

  client: {
    title: 'Client',
    filters: [
      { key: 'clientId', label: 'Client ID', operators: ['Like', 'Equal', 'Starts With'] },
      { key: 'name',     label: 'Name',      operators: ['Like', 'Equal', 'Starts With'] },
    ],
    columns: [
      { key: 'clientId', label: 'ClientID', width: '120px', mono: true },
      { key: 'name',     label: 'Full Name' },
      { key: 'type',     label: 'Type', width: '100px' },
    ],
    mockData: [
      { clientId: '120000005201', name: 'KATUSABE ANDREW',   type: 'Individual' },
      { clientId: '120000007601', name: 'MUMBERE ELIA',      type: 'Individual' },
      { clientId: '120000001101', name: 'ASIIMWE GRACE',     type: 'Individual' },
      { clientId: '120000003301', name: 'BATEGEKA ROBERT',   type: 'Corporate'  },
      { clientId: '120000004401', name: 'TUMWESIGYE JOAN',   type: 'Individual' },
    ],
  },

  product: {
    title: 'Product',
    filters: [
      { key: 'productId',   label: 'Product ID',   operators: ['Like', 'Equal'] },
      { key: 'productName', label: 'Product Name', operators: ['Like', 'Equal', 'Starts With'] },
    ],
    columns: [
      { key: 'productId',   label: 'ProductID',   width: '100px', mono: true },
      { key: 'productName', label: 'Product Name' },
      { key: 'category',    label: 'Category',    width: '120px' },
    ],
    mockData: [
      { productId: 'LSA',  productName: 'Local Savings Account',  category: 'Savings'  },
      { productId: 'LCA',  productName: 'Local Current Account',  category: 'Current'  },
      { productId: 'FCA',  productName: 'Foreign Currency Account',category: 'Foreign' },
      { productId: 'FD',   productName: 'Fixed Deposit',          category: 'Deposit'  },
      { productId: 'OD',   productName: 'Overdraft',              category: 'Loan'     },
    ],
  },

  currency: {
    title: 'Currency',
    filters: [
      { key: 'currencyId',   label: 'Currency ID',   operators: ['Like', 'Equal'] },
      { key: 'currencyName', label: 'Currency Name', operators: ['Like', 'Equal', 'Starts With'] },
    ],
    columns: [
      { key: 'currencyId',   label: 'CurrencyID', width: '100px', mono: true },
      { key: 'currencyName', label: 'Currency Name' },
      { key: 'symbol',       label: 'Symbol', width: '70px' },
    ],
    mockData: [
      { currencyId: 'UGX', currencyName: 'Uganda Shilling',  symbol: 'UGX' },
      { currencyId: 'USD', currencyName: 'US Dollar',        symbol: '$'   },
      { currencyId: 'EUR', currencyName: 'Euro',             symbol: '€'   },
      { currencyId: 'GBP', currencyName: 'British Pound',    symbol: '£'   },
      { currencyId: 'KES', currencyName: 'Kenya Shilling',   symbol: 'KES' },
    ],
  },

  user: {
    title: 'User',
    filters: [
      { key: 'userId',   label: 'User ID',   operators: ['Like', 'Equal'] },
      { key: 'userName', label: 'User Name', operators: ['Like', 'Equal', 'Starts With'] },
    ],
    columns: [
      { key: 'userId',   label: 'UserID',    width: '100px', mono: true },
      { key: 'userName', label: 'Full Name' },
      { key: 'role',     label: 'Role',      width: '120px' },
    ],
    mockData: [
      { userId: 'BANTU',  userName: 'System Administrator', role: 'Admin'  },
      { userId: 'KAO106', userName: 'Kasese Branch Officer', role: 'Teller' },
      { userId: 'MMO289', userName: 'Masindi Manager',       role: 'Manager'},
    ],
  },

  role: {
    title: 'Role',
    filters: [
      { key: 'roleId',   label: 'Role ID',   operators: ['Like', 'Equal'] },
      { key: 'roleName', label: 'Role Name', operators: ['Like', 'Equal', 'Starts With'] },
    ],
    columns: [
      { key: 'roleId',      label: 'RoleID',      width: '100px', mono: true },
      { key: 'roleName',    label: 'Role Name' },
      { key: 'permissions', label: 'Permissions', width: '100px' },
    ],
    mockData: [
      { roleId: 'ADM', roleName: 'Administrator',    permissions: 'Full'    },
      { roleId: 'MGR', roleName: 'Branch Manager',   permissions: 'High'    },
      { roleId: 'TLR', roleName: 'Teller',           permissions: 'Medium'  },
      { roleId: 'AUD', roleName: 'Auditor',          permissions: 'ReadOnly'},
    ],
  },

  transaction: {
    title: 'Transaction',
    filters: [
      { key: 'transactionId', label: 'Transaction ID', operators: ['Like', 'Equal'] },
      { key: 'narration',     label: 'Narration',      operators: ['Like', 'Starts With'] },
    ],
    columns: [
      { key: 'transactionId', label: 'Trx ID',    width: '100px', mono: true },
      { key: 'narration',     label: 'Narration' },
      { key: 'type',          label: 'Type',      width: '100px' },
    ],
    mockData: [
      { transactionId: 'TXN001', narration: 'Cash Deposit',    type: 'Credit' },
      { transactionId: 'TXN002', narration: 'Cash Withdrawal', type: 'Debit'  },
      { transactionId: 'TXN003', narration: 'Fund Transfer',   type: 'Both'   },
    ],
  },

  workflow: {
    title: 'Workflow',
    filters: [
      { key: 'workflowId',   label: 'Workflow ID',   operators: ['Like', 'Equal'] },
      { key: 'workflowName', label: 'Workflow Name', operators: ['Like', 'Equal', 'Starts With'] },
    ],
    columns: [
      { key: 'workflowId',   label: 'WorkflowID',   width: '120px', mono: true },
      { key: 'workflowName', label: 'Workflow Name' },
      { key: 'status',       label: 'Status',       width: '100px' },
    ],
    mockData: [
      { workflowId: 'WF001', workflowName: 'Loan Approval',      status: 'Active' },
      { workflowId: 'WF002', workflowName: 'Account Opening',    status: 'Active' },
      { workflowId: 'WF003', workflowName: 'Client KYC Review',  status: 'Active' },
    ],
  },

  application: {
    title: 'Application',
    filters: [
      { key: 'applicationId', label: 'Application ID', operators: ['Like', 'Equal'] },
      { key: 'applicantName', label: 'Applicant Name', operators: ['Like', 'Starts With'] },
    ],
    columns: [
      { key: 'applicationId', label: 'AppID',     width: '100px', mono: true },
      { key: 'applicantName', label: 'Applicant' },
      { key: 'type',          label: 'Type',      width: '120px' },
      { key: 'status',        label: 'Status',    width: '100px' },
    ],
    mockData: [
      { applicationId: 'APP001', applicantName: 'JOHN MUGISHA',  type: 'Loan',    status: 'Pending'  },
      { applicationId: 'APP002', applicantName: 'MARY NAKATO',   type: 'Account', status: 'Approved' },
      { applicationId: 'APP003', applicantName: 'PETER OKELLO',  type: 'Loan',    status: 'Review'   },
    ],
  },

  siType: {
    title: 'Standing Instruction Type',
    filters: [
      { key: 'siTypeId',   label: 'SI Type ID',   operators: ['Like', 'Equal'] },
      { key: 'siTypeName', label: 'Description',  operators: ['Like', 'Starts With'] },
    ],
    columns: [
      { key: 'siTypeId',   label: 'SI Type ID',  width: '100px', mono: true },
      { key: 'siTypeName', label: 'Description' },
      { key: 'transferType', label: 'Transfer Type', width: '120px' },
    ],
    mockData: [
      { siTypeId: 'SI001', siTypeName: 'Salary Transfer',       transferType: 'Internal' },
      { siTypeId: 'SI002', siTypeName: 'Loan Repayment',        transferType: 'Internal' },
      { siTypeId: 'SI003', siTypeName: 'Utility Payment',       transferType: 'External' },
      { siTypeId: 'SI004', siTypeName: 'School Fees Transfer',  transferType: 'Internal' },
    ],
  },
};