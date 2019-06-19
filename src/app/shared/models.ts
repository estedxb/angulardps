import { TimeSpan } from './TimeSpan';
export class DPSCustomer {
    customer: Customer; invoiceEmail?: EmailAddress; contractsEmail?: EmailAddress; bulkContractsEnabled: boolean;
    statuteSettings?: StatuteSetting[]; invoiceSettings?: InvoiceSettings; contact: Contact; activateContactAsUser: boolean;
}
export class Customer {
    vatNumber: string; name: string; officialName?: string; legalForm: string; creditCheck: CreditCheck; address?: Address;
    phoneNumber?: PhoneNumber; email?: EmailAddress; vcaCertification?: VcaCertification; isBlocked: boolean;
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
    firstName: string; lastName?: string; postion?: string; email?: EmailAddress; mobile?: PhoneNumber;
    phoneNumber?: PhoneNumber; language?: Language;
}
export class InvoiceSettings {
    transportCoefficient: number; mealvoucherCoefficient: number; ecoCoefficient: number; dimonaCost: number;
    lieuDaysAllowance?: LieuDaysAllowance; sicknessInvoiced?: boolean; holidayInvoiced?: boolean; mobilityAllowance?: MobilityAllowance;
    otherAllowance?:boolean; shiftAllowance?: boolean; shiftAllowances?: ShiftAllowance[]; otherAllowances?: OtherAllowance[];
}
export class CustomersList { item1: string; item2: string; item3?: string; item4?: string; }
export class WorkCodes {
    CodeNumber: number; Description: string; CodeType: string; ValueType?: string; IsDefaultForCodeType?: string; StatuteType?: string;
}
export class Statute { name: string; type?: string; }
export class LegalForm { nl: Forms[]; en: Forms[]; fr: Forms[]; }
export class Forms { name: string; }
export class CountriesList { Country: string; 'Alpha-2': string; 'Alpha-3': string; }
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
export class LoginToken {
    accessToken: string; customerName: string; customerVatNumber: string; customerlogo: string;
    userName: string; userEmail: string; userRole: string; isLoggedIn: boolean;
}
// dpsUser: DpsUser;
export class DpsPerson {
    customerVatNumber: string; person: Person; customerPostionId: string; statute: Statute; renumeration: Renumeration;
    addittionalInformation: string; medicalAttestation: MedicalAttestation; vcaAttestation: Documents;
    constructionCards: Documents[]; studentAtWorkProfile: StudentAtWorkProfile;
    driverProfiles: DriverProfilesItem[]; otherDocuments: Documents[]; isEnabled: boolean; isArchived: boolean;
    brightStaffingId: number;
}

export class Person {
    socialSecurityNumber: SocialSecurityNumber; dateOfBirth: string; placeOfBirth: string; countryOfBirth: string; nationality: string;
    gender: Gender; firstName: string; lastName: string; address: Address; language: Language; email: EmailAddress; mobile: PhoneNumber;
    phone: PhoneNumber; bankAccount: BankAccount; travelMode: string; status: string;
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
    id: number; customerVatNumber: string; personId: string; positionId: number; locationId: number; workScheduleId: number;
    bsContractId: number; parentContractId: number; contract: Contract; timeSheet: TimeSheet;
}
export class Contract {
    name: string; startDate: string; endDate: string; workSchedule: WorkSchedule; position: _Position; statute: Statute;
    status: string; cancelReason: string; contractReason: string;
}
export class TimeSheet { dayValues: DayValue[]; standAloneValues: StandAloneValue[]; information: string; status: string; }
export class DayValue { date: Date; values: Value[]; }
export class Value { code: Code; value: number; mandatory: boolean; }
export class Code {
    codeNumber: number; description: string; codeType: string; valueType: string; isDefaultForCodeType: string; statuteType: string;
}
export class StandAloneValue { code: Code2; value: number; mandatory: boolean; }
export class Code2 {
    codeNumber: number; description: string; codeType: string; valueType: string; isDefaultForCodeType: string; statuteType: string;
}
export enum ContractStatus { Active = 'Active', Cancelled = 'Cancelled' }
export class Summaries {
    id: number; customerVatNumber: string; message: string; dateTime: string; actionTypeId: string;
    objectId: string; objectDomain: string; secondId: string; priority: number; isManual: boolean; isFinished: boolean;
}

export class SelectedContract { personContracts: DpsScheduleContract[]; contractId: number; personId: string; startDate: Date; endDate: Date; mode: string }

/*
export class DpsPersonsContracts { personsContracts: PersonsContracts[]; }
export class PersonsContracts {
    customerVatNumber: string; socialSecurityNumber: SocialSecurityNumber; firstName: string; lastName: string;
    customerPostionId: string; dpsContracts: DpsContract[];
}
*/

export class PersonDocuments { customerVatNumber: string; personId: string; fileName: string; fileType: string; file: File; }
export enum FileType {
    MedicalAttestation = 'MedicalAttestation', VcaAttestation = 'VcaAttestation',
    StudentAtWork = 'StudentAtWork', ConstructionCards = 'ConstructionCards',
    OtherDocuments = 'OtherDocuments', DriversLicense = 'DriversLicense'
}
export class DpsScheduleCall { customerVatNumber: string; startDate: string; endDate: string; }
export class DpsSchedule { startDate: string; endDate: string; customer: DpsScheduleCustomer; persons: DpsSchedulePerson[]; }
export class DpsScheduleCustomer { customerVatNumber: string; customerName: string; }
export class DpsSchedulePerson {
    personId: string; personName: string; positionName: string; personIsEnabled: boolean; personIsArchived: boolean;
    contracts: DpsScheduleContract[];
}
export class DpsScheduleContract {
    customerContractId: string; customerContractName: string; customerContractstatus: string;
    childContractId: number; parentContractId: number; workSchedule: WorkSchedule;
}
export class PrintContractPDF { contractId: string; fileUrl: string; }
export class ApproveContractSuccess { contractId: string; accessStatus: boolean; message: string; }
export class ApproveContract { customerVatNumber: string; contractId: string; }

// tslint:disable-next-line: variable-name
export class ContractReason { name: string; BrightStaffing_Contract_Reason_ID: string; }
