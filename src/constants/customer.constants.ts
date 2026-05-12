// ─────────────────────────────────────────────────────────────────────────────
// Customer Information – Constants & Initial State
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CustomerRecord, PersonalDetails, EmploymentDetails,
  SpecialOffers, IntroducerRecord, NextOfKinRecord, AddressRecord,
  ClientStatementRecord, BankAccountRecord,
} from '../types/customer.types';

// ─── Dropdown Options ─────────────────────────────────────────────────────────
export const TITLES         = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Rev', 'Hon'];
export const GENDERS        = ['Male', 'Female', 'Other'];
export const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
export const LITERACY_LEVELS  = ['Illiterate', 'Primary', 'Secondary', 'Tertiary', 'University'];
export const CLIENT_TYPES   = ['Individual Client', 'Corporate Client', 'Employee'];
export const CLIENT_CLASSES = ['Standard', 'Premium', 'Gold', 'Platinum'];
export const NATIONALITIES  = [
  'Ugandan','Kenyan','Tanzanian','Rwandan','Burundian','South Sudanese','Congolese','Ethiopian','Other',
];
export const IDENTIFICATION_TYPES = [
  'National ID','Passport','Driving License','Voter ID','Refugee ID','Birth Certificate',
];
export const DISABILITY_TYPES = [
  'Normal','Visual Impairment','Hearing Impairment','Physical Disability','Cognitive Disability',
];
export const ADDRESS_TYPES   = ['Residential Address','Business Address','Postal Address'];
export const RESIDENT_OPTIONS = ['Resident', 'Non-Resident'];
export const OCCUPATIONS = [
  'Civil Servant','Teacher','Doctor','Nurse','Engineer','Accountant',
  'Lawyer','Farmer','Trader','Business Owner','Student','Retired','Other',
];
export const DESIGNATIONS = [
  'Director','Manager','Supervisor','Officer','Accountant','Clerk','CEO','CFO','COO','Other',
];
export const RELATIONS = ['Sibling','Spouse','Parent','Child','Friend','Colleague','Other'];
export const CHANGED_REASONS = [
  'Name Change','Date of Birth Correction','Gender Correction','Document Update','Client Type Change','Other',
];

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DAYS   = Array.from({length:31}, (_,i) => String(i+1).padStart(2,'0'));
export const YEARS  = Array.from({length:100}, (_,i) => String(new Date().getFullYear() - i));

// ─── Initial / empty shapes ───────────────────────────────────────────────────
export const INITIAL_PERSONAL: PersonalDetails = {
  title: 'Ms', firstName: '', middleName: '', lastName: '',
  gender: 'Male', dobDay: '', dobMonth: '', dobYear: '',
  ageAsOn: '', age: '',
  nationality: 'Ugandan', resident: '',
  identificationType: 'National ID', identificationNo: '',
  issuedBy: '', identificationExpiryDate: '',
  tin: '', maritalStatus: '',
  numberOfHouseMembers: '', numberOfChildren: '', numberOfDependents: '',
  disabilityType: 'Normal', isDisabled: false,
  openedOn: '', literacyLevel: '',
  openedBy: '', openedByName: '',
};

export const INITIAL_EMPLOYMENT: EmploymentDetails = {
  employmentType: 'Salaried',
  occupation: '', designation: '',
  nameOfInstitution: '', workingSince: '',
  institutionDetails: '', workPermitNo: '',
  grossIncome: '', rentExpenses: '', familyIncome: '',
  otherExpenses: '', otherIncome: '',
  totalExpenses: '', totalIncome: '', netSavings: '',
};

export const INITIAL_SPECIAL_OFFERS: SpecialOffers = {
  canSendGreetings: false,
  canSendAssociateSpecialOffer: false,
  canSendOurSpecialOffers: false,
  statementOnline: false,
  mobileAlert: false,
};

export const INITIAL_CUSTOMER: CustomerRecord = {
  branchId: '00', branchName: 'HEAD OFFICE',
  clientId: '', clientType: 'Individual Client',
  clientClass: '', clientName: '',
  personal: INITIAL_PERSONAL,
  addresses: [],
  employment: INITIAL_EMPLOYMENT,
  specialOffers: INITIAL_SPECIAL_OFFERS,
  status: '', openDate: '', closedDate: '',
  createdBy: '', modifiedBy: '', supervisedBy: '',
  createdOn: '', modifiedOn: '', supervisedOn: '',
};




export const INITIAL_LOAN: CustomerRecord = {
  branchId: '00', branchName: 'HEAD OFFICE',
  clientId: '', clientType: 'Individual Client',
  clientClass: '', clientName: '',
  personal: INITIAL_PERSONAL,
  addresses: [],
  employment: INITIAL_EMPLOYMENT,
  specialOffers: INITIAL_SPECIAL_OFFERS,
  status: '', openDate: '', closedDate: '',
  createdBy: '', modifiedBy: '', supervisedBy: '',
  createdOn: '', modifiedOn: '', supervisedOn: '',
};

export const INITIAL_INTRODUCER: IntroducerRecord = {
  introducerCustomerId: '', introducerName: '',
  knowSince: '', remarks: '', baseBranchId: '00',
  address1: '', address2: '', cityArea: '',
  countryName: '', phone: '', faxNo: '',
  mobile: '', emailId: '', gender: '', relation: '',
};

export const INITIAL_KIN: NextOfKinRecord = {
  id: '', isExistingClient: false,
  clientId: '', titlePrefix: 'Ms', name: '',
  address: '', phone: '', mobile: '', emailId: '',
  gender: 'Male', dobDay: '', dobMonth: '', dobYear: '',
  ageAsOn: '', age: '', relation: 'Sibling', remarks: '',
};

export const INITIAL_ADDRESS: AddressRecord = {
  id: '', addressType: 'Residential Address',
  address1: '', address2: '', landmark: '',
  cityAreaId: '', cityAreaName: '',
  countryId: 'UG', countryName: 'Uganda',
  phone1: '', phone2: '', mobile: '',
  faxNo: '', emailId: '', zipCode: '',
  isCommunicationAddress: false,
  createdBy: '', createdOn: '',
};

// ─── Sample / demo data ───────────────────────────────────────────────────────
export const SAMPLE_ACCOUNTS: BankAccountRecord[] = [
  { branchId: '00', accountId: '100000000401', deposit: 0, advance: 0, productId: 'LSA', productType: 'Savings Bank' },
  { branchId: '00', accountId: '120000000401', deposit: 0, advance: 0, productId: 'SSA', productType: 'Savings Bank' },
];

export const SAMPLE_STATEMENT: ClientStatementRecord[] = [
  { accountName:'AZOORA DENIS', branchId:'00', accountId:'100000000401', productId:'LSA', productName:'LOAN SERVICING ACCOUNT',   clearBalance:0, drawingPower:50, openedDate:'23/Jul/2020' },
  { accountName:'AZOORA DENIS', branchId:'00', accountId:'120000000401', productId:'SSA', productName:'STAFF SAVINGS ACCOUNT',      clearBalance:0, drawingPower:0,  openedDate:'15/Sep/2016' },
];
