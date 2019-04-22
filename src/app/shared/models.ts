export class DPSCustomer {
    customer: Customer;
    invoiceEmail?: EmailAddress;
    contractsEmail?: EmailAddress;
    bulkContractsEnabled: boolean;
    statuteSettings?: StatuteSetting[];
    invoiceSettings?: InvoiceSettings;
    contact: Contact;
    activateContactAsUser: boolean;
}

export class Customer {
    vatNumber: string;
    name: string;
    officialName?: string;
    legalForm: string;
    creditCheck: CreditCheck;
    address?: Address;
    phoneNumber?: PhoneNumber;
    email?: EmailAddress;
    vcaCertification?: VcaCertification;
    isBlocked: boolean;
}

export class EmailAddress { emailAddress: string; }

export class CreditCheck { creditcheck: boolean; creditLimit: number; dateChecked: String; creditCheckPending: boolean }

export class PhoneNumber { number: string; }

export class Address {
    street?: string; streetNumber?: string; bus?: string; city?: string; postalCode?: string; country?: string; countryCode?: string;
}

export class VcaCertification { cerified: boolean; }

export class ParitairCommitee { number: string; name: string; BrightStaffingCommitteeId?: string; type?: string; }

export class LieuDaysAllowance { enabled: boolean; payed: boolean; }

export class MobilityAllowance { enabled: boolean; amountPerKm?: number; }

export class ShiftAllowance { shiftName: string; timeSpan: string; amount: number; nominal?: boolean; }

export class OtherAllowance { codeId: string; amount: number; nominal?: boolean; }

export class MealVoucherSettings { totalWorth?: number; employerShare?: number; minimumHours?: number; }

export class StatuteSetting {
    statute: Statute; paritairCommitee?: ParitairCommitee; coefficient?: number; mealVoucherSettings?: MealVoucherSettings;
}

export class Contact {
    firstName: string;
    lastName?: string;
    postion?: string;
    email?: EmailAddress;
    mobile?: PhoneNumber;
    phoneNumber?: PhoneNumber;
    language?: Language;
}

export class InvoiceSettings {
    lieuDaysAllowance?: LieuDaysAllowance;
    sicknessInvoiced?: boolean;
    holidayInvoiced?: boolean;
    mobilityAllowance?: MobilityAllowance;
    shiftAllowance?: boolean;
    shiftAllowances?: ShiftAllowance[];
    otherAllowances?: OtherAllowance[];
}

export class CustomersList {
    item1: string;
    item2: string;
    item3?: string;
}
export interface WorkCodes {
    CodeNumber: number;
    Description: string;
    CodeType: string;
    ValueType?: string;
    IsDefaultForCodeType?: string;
    StatuteType?: string;
}

export class Statute {
    name: string;
    type?: string;
}

export class LegalForm {
    nl: Forms[];
    en: Forms[];
    fr: Forms[];
}

export class Forms { name: string; }

export class CountriesList {
    countryCode: string;
    countryName: string;
}

export class Language { name: string; shortName: string; }

export class User {
    userName: string;
    firstName: string;
    lastName: string;
    email: EmailAddress;
    mobile: PhoneNumber;
    phone: PhoneNumber;
}

export class DpsUser {
    customerVatNumber: string;
    user: User;
    userRole: string;
    isEnabled: boolean;
    isArchived: boolean;
}

/*
export class LegalForm {
    FormName: string;
}
*/
/*
export class Dutch {FormName: string;}
export class English {FormName: string;}
export class French {FormName: string;}
export class LegalForm {
    nl: Dutch[];
    en: English[];
    fr: French[];
}
*/