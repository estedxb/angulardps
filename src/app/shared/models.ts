import { TimeSpan } from './TimeSpan';
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
export class CreditCheck { creditcheck: boolean; creditLimit: number; dateChecked: String; creditCheckPending: boolean; }
export class PhoneNumber { number: string; }

export class Address {
    street?: string; streetNumber?: string; bus?: string; city?: string; postalCode?: string; country?: string; countryCode?: string;
}

export class VcaCertification { cerified: boolean; }
export class ParitairCommitee { number: string; name: string; BrightStaffingCommitteeId?: string; type?: string; }
export class LieuDaysAllowance { enabled: boolean; payed: boolean; }
export class MobilityAllowance { enabled: boolean; amountPerKm?: number; }
export class ShiftAllowance { shiftName: string; timeSpan: string; amount: number; nominal?: boolean; }
export class OtherAllowance { codeId: number; amount: number; nominal?: boolean; }
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

export class CustomersList { item1: string; item2: string; item3?: string; }
export class WorkCodes {
    CodeNumber: number;
    Description: string;
    CodeType: string;
    ValueType?: string;
    IsDefaultForCodeType?: string;
    StatuteType?: string;
}

export class Statute { name: string; type?: string; }

export class LegalForm { nl: Forms[]; en: Forms[]; fr: Forms[]; }

export class Forms { name: string; }
export class CountriesList { countryCode: string; countryName: string; }

export class Language { name: string; shortName: string; }

export class User {
    userName: string; firstName: string; lastName: string; email: EmailAddress; mobile: PhoneNumber; phone: PhoneNumber; language: Language;
}

export class DpsUser {
    customerVatNumber: string; user: User; userRole: string; isEnabled: boolean; isArchived: boolean;
}

export class Location {
    id: number; customerVatNumber: string; name: string; address?: Address; isEnabled: boolean; isArchived: boolean;
}

export class DpsPostion {
    id: number; customerVatNumber: string; position: _Position; isEnabled: boolean; isArchived: boolean;
}
// tslint:disable-next-line: class-name
export class _Position {
    name: string; taskDescription: string; isStudentAllowed: boolean; costCenter: string; workstationDocument: Documents;
}

export class Login { userid: string; password: string; }
export class LoginToken { accessToken: string; dpsUser: DpsUser; }

export class DpsPerson {
    customerVatNumber: string;
    person: Person;
    customerPostionId: string;
    statute: Statute;
    renumeration: Renumeration;
    addittionalInformation: string;
    medicalAttestation: MedicalAttestation;
    vcaAttestation: Documents;
    constructionProfile: ConstructionProfile;
    constructionCards: Documents[];
    studentAtWorkProfile: StudentAtWorkProfile;
    driverProfiles: DriverProfilesItem[];
    otherDocuments: Documents[];
    isEnabled: boolean;
    isArchived: boolean;
}
export class Person {
    socialSecurityNumber: SocialSecurityNumber;
    dateOfBirth: string;
    placeOfBirth: string;
    countryOfBirth: string;
    nationality: string;
    gender: Gender;
    firstName: string;
    lastName: string;
    address: Address;
    language: Language;
    email: EmailAddress;
    mobile: PhoneNumber;
    phone: PhoneNumber;
    bankAccount: BankAccount;
    travelMode: string;
    status: string;
}

export class SocialSecurityNumber { number: string; }
export class Gender { genderId: number; title: string; }
export class BankAccount { bic: string; iban: string; }
export class Renumeration {
    hourlyWage: number; costReimbursment: boolean; netCostReimbursment: number; transportationAllowance: boolean;
}
export class MedicalAttestation { location: string; name: string; }
export class ConstructionProfile { constructionCards: Documents[]; }
export class StudentAtWorkProfile { attestation: Documents; attestationDate: string; contingent: number; balance: number; }
export class DriverProfilesItem { type: string; attestation: Documents; }
export class Documents { location: string; name: string; }


export class DpsWorkSchedule {
    id: number; customerVatNumber: string; name: string; workSchedule: WorkSchedule; isEnabled: boolean; isArchived: boolean;
}
export class WorkSchedule { workDays: WorkDays[]; }
export class WorkDays { dayOfWeek: number; workTimes: WorkTimes[]; breakTimes: BreakTimes[]; }
export class WorkTimes { startTime: string; endTime: string; title: string; }
export class BreakTimes { startTime: string; endTime: string; title: string; }

export class WorkScheduleRow { rowid: number; weekDayOf: WeekDayOf[]; }
export class WeekDayOf { dayOfWeek: number; workTimes: WorkTimes; }



export class DpsContract {
    id: number;
    customerVatNumber: string;
    personId: string;
    positionId: number;
    locationId: number;
    workScheduleId: number;
    parentContractId: number;
    contract: Contract;
    timeSheet: TimeSheet;
}
export class Contract {
    name: string;
    startDate: Date;
    endDate: Date;
    workSchedule: WorkSchedule;
    position: _Position;
    statute: Statute;
    status: string;
    cancelReason: string;
}

export class TimeSheet {
    dayValues: DayValue[];
    standAloneValues: StandAloneValue[];
    information: string;
    status: string;
}
export class DayValue {
    date: Date;
    values: Value[];
}
export class Value {
    code: Code;
    value: number;
    mandatory: boolean;
}
export class Code {
    codeNumber: number;
    description: string;
    codeType: string;
    valueType: string;
    isDefaultForCodeType: string;
    statuteType: string;
}
export class StandAloneValue {
    code: Code2;
    value: number;
    mandatory: boolean;
}

export class Code2 {
    codeNumber: number;
    description: string;
    codeType: string;
    valueType: string;
    isDefaultForCodeType: string;
    statuteType: string;
}

/*
export class Attestation1 { location: string; name: string; }
export class VcaAttestation1 { location: string; name: string; }
export class ConstructionCardsItem1 { location: string; name: string; }
export class OtherDocumentsItem1 { location: string; name: string; }
*/

// enum AlertType { error = 'error', message = 'message' }
