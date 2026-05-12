// ─────────────────────────────────────────────────────────────────────────────
// Customer Information – Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

export type ClientType   = 'Individual Client' | 'Corporate Client' | 'Employee' | '';
export type Gender       = 'Male' | 'Female' | 'Other' | '';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated' | '';
export type LiteracyLevel = 'Illiterate' | 'Primary' | 'Secondary' | 'Tertiary' | 'University' | '';
export type AddressType  = 'Residential Address' | 'Business Address' | 'Postal Address';
export type EmploymentType = 'Salaried' | 'Self Employed';
export type RelationType = 'Sibling' | 'Spouse' | 'Parent' | 'Child' | 'Friend' | 'Colleague' | 'Other';
export type ActiveTab    = 'personal' | 'address' | 'employment' | 'specialOffers';
export type AppMode      = 'add' | 'edit' | 'view';

export type ModalType =
  | 'address'
  | 'introducer'
  | 'nextOfKin'
  | 'profileChange'
  | 'clientActivation'
  | 'clientStatement'
  | 'signaturePhoto'
  | 'bankAccounts'
  | null;

// ─── Personal Details ────────────────────────────────────────────────────────
export interface PersonalDetails {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  ageAsOn: string;
  age: string;
  nationality: string;
  resident: string;
  identificationType: string;
  identificationNo: string;
  issuedBy: string;
  identificationExpiryDate: string;
  tin: string;
  maritalStatus: MaritalStatus;
  numberOfHouseMembers: string;
  numberOfChildren: string;
  numberOfDependents: string;
  disabilityType: string;
  isDisabled: boolean;
  openedOn: string;
  literacyLevel: LiteracyLevel;
  openedBy: string;
  openedByName: string;
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface AddressRecord {
  id: string;
  addressType: AddressType;
  address1: string;
  address2: string;
  landmark: string;
  cityAreaId: string;
  cityAreaName: string;
  countryId: string;
  countryName: string;
  phone1: string;
  phone2: string;
  mobile: string;
  faxNo: string;
  emailId: string;
  zipCode: string;
  isCommunicationAddress: boolean;
  createdBy: string;
  createdOn: string;
}

// ─── Employment ───────────────────────────────────────────────────────────────
export interface EmploymentDetails {
  employmentType: EmploymentType;
  occupation: string;
  designation: string;
  nameOfInstitution: string;
  workingSince: string;
  institutionDetails: string;
  workPermitNo: string;
  grossIncome: string;
  rentExpenses: string;
  familyIncome: string;
  otherExpenses: string;
  otherIncome: string;
  totalExpenses: string;
  totalIncome: string;
  netSavings: string;
}

// ─── Special Offers ───────────────────────────────────────────────────────────
export interface SpecialOffers {
  canSendGreetings: boolean;
  canSendAssociateSpecialOffer: boolean;
  canSendOurSpecialOffers: boolean;
  statementOnline: boolean;
  mobileAlert: boolean;
}

// ─── Customer (top-level) ────────────────────────────────────────────────────
export interface CustomerRecord {
  branchId: string;
  branchName: string;
  clientId: string;
  clientType: ClientType;
  clientClass: string;
  clientName: string;
  personal: PersonalDetails;
  addresses: AddressRecord[];
  employment: EmploymentDetails;
  specialOffers: SpecialOffers;
  // Audit
  status: string;
  openDate: string;
  closedDate: string;
  createdBy: string;
  modifiedBy: string;
  supervisedBy: string;
  createdOn: string;
  modifiedOn: string;
  supervisedOn: string;
}

// ─── Next of Kin ─────────────────────────────────────────────────────────────
export interface NextOfKinRecord {
  id: string;
  isExistingClient: boolean;
  clientId: string;
  titlePrefix: string;
  name: string;
  address: string;
  phone: string;
  mobile: string;
  emailId: string;
  gender: Gender;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  ageAsOn: string;
  age: string;
  relation: RelationType;
  remarks: string;
}

// ─── Introducer ───────────────────────────────────────────────────────────────
export interface IntroducerRecord {
  introducerCustomerId: string;
  introducerName: string;
  knowSince: string;
  remarks: string;
  baseBranchId: string;
  address1: string;
  address2: string;
  cityArea: string;
  countryName: string;
  phone: string;
  faxNo: string;
  mobile: string;
  emailId: string;
  gender: string;
  relation: string;
}

// ─── Bank Account ─────────────────────────────────────────────────────────────
export interface BankAccountRecord {
  branchId: string;
  accountId: string;
  deposit: number;
  advance: number;
  productId: string;
  productType: string;
}

// ─── Client Statement ─────────────────────────────────────────────────────────
export interface ClientStatementRecord {
  accountName: string;
  branchId: string;
  accountId: string;
  productId: string;
  productName: string;
  clearBalance: number;
  drawingPower: number;
  openedDate: string;
}

// ─── Profile Change ───────────────────────────────────────────────────────────
export interface ProfileChangeRecord {
  clientName: string;
  clientType: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  age: string;
  ageAsOn: string;
  documentsReceived: string;
  receivedOn: string;
  changedReason: string;
  remarks: string;
}
