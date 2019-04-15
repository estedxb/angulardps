export interface ICustomer {
    vatNumber: string;
    customerName: string;
    officialName: string;
    checkCheck: boolean;
    creditLimt: number;
    legalForm: string;
    street?: string;
    streetNo?: number;
    bus?: string;
    place?: string;
    postal: number;
    country: string;
    telephone?: string;
    generalEmail?: string;
    billingEmail?: string;
    contractEmail?: string;
}

export interface DPSCustomer {
    customer: Customer;
    invoiceEmail?: EmailAddress;
    contractsEmail?: EmailAddress;
    bulkContractsEnabled: boolean;
    statuteSettings?: StatuteSetting[];
    invoiceSettings?: InvoiceSettings;
    contact: Contact;
}

export interface Customer { 
    vatNumber: string;
    name: string;
    officialName?: string;
    legalForm: string;
    creditCheck: CreditCheck;
    address?: Address;
    phoneNumber?: string;
    email?: EmailAddress;
    vcaCertification?: VcaCertification;
}

export interface EmailAddress { emailAddress: string; }

export interface CreditCheck { creditcheck: boolean; creditLimit: number; dateChecked: Date; }

export interface PhoneNumber { number: string; }

export interface Address { street?: string; streetNumber?: string; bus?: string; city?: string; postalCode?: string; country?: string; countryCode?: string; }

export interface VcaCertification { cerified: boolean; }

export interface Statute { name: string; }

export interface ParitairCommitee { number: string; name: string; }

export interface LieuDaysAllowance { enabled: boolean; payed: boolean; }

export interface MobilityAllowance { enabled: boolean; amountPerKm?: number; }

export interface ShiftAllowance { shiftName: string; timeSpan: string; amount: number; nominal?: boolean; }

export interface OtherAllowance { codeId: string; amount: number; nominal?: boolean; }

export interface Language { name: string; shortName: string; }

export interface MealVoucherSettings { totalWorth?: number; employerShare?: number; minimumHours?: number; }

export interface StatuteSetting { statute: Statute; paritairCommitee?: ParitairCommitee; coefficient?: number; mealVoucherSettings?: MealVoucherSettings; }

export interface Contact { 
    firstName: string; 
    lastName?: string; 
    postion?: string; 
    email?: EmailAddress; 
    mobile?: PhoneNumber; 
    phoneNumber?: PhoneNumber; 
    language?: Language;
}

export interface InvoiceSettings {
    lieuDaysAllowance?: LieuDaysAllowance;
    sicknessInvoiced?: boolean;
    holidayInvoiced?: boolean;
    mobilityAllowance?: MobilityAllowance;
    shiftAllowance?: boolean;
    shiftAllowances?: ShiftAllowance[];
    otherAllowances?: OtherAllowance[];
}