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
