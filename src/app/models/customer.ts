import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';

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
    contractEmail?: string
}
/*
export class DPSCustomer {
{
    customer: Customer;
    invoiceEmail: EmailAddress;
    contractsEmail: EmailAddress;
    bulkContractsEnabled: true;
    statuteSettings: [
      { 
        statute: { name: string };
        paritairCommitee: { number: string; name: string };
        coefficient: 0;
        mealVoucherSettings: {
            totalWorth: 0;
            employerShare: 0;
            minimumHours: 0
        }
      }
    ];
    invoiceSettings: {
      lieuDaysAllowance: {
 enabled: true;
 payed: true
      };
      sicknessInvoiced: true;
      holidayInvoiced: true;
      mobilityAllowance: {
 enabled: true;
 amountPerKm: 0
      };
      shiftAllowance: true;
      shiftAllowances: [
 {
   shiftName: string;
   timeSpan: string;
   amount: 0;
   nominal: true
 }
      ];
      otherAllowances: [
 {
   codeId: string;
   amount: 0;
   nominal: true
 }
      ]
    };
    contact: ConvertActionBindingResult;
  }

export class Customer {
    vatNumber: string;
    name: string;
    officialName?: string;
    legalForm?: string;
    creditCheck?: CreditCheck;
    address?: Address;
    phoneNumber?: PhoneNumber;
    email: EmailAddress;
    vcaCertification: Cerified;
  }
export class CreditCheck { creditcheck: boolean; creditLimit: number; dateChecked: Date; }
export class Cerified { cerified: true; }
export class Address {    street: string;    streetNumber: string;    bus: string;    city: string;    postalCode: string;    country: string;    countryCode: string; }
export class {
    firstName: string;
    lastName: string;
    postion: string;
    email: EmailAddress;
    mobile: PhoneNumber;
    phoneNumber: PhoneNumber;
    language: Language;
}

export class EmailAddress { emailAddress: string; }
export class PhoneNumber { number: string; }
export class Language { name: string; shortName: string }
*/