/*
export interface LegalForm {
    FormName: string;
}
*/
/*
export interface Dutch {FormName: string;}
export interface English {FormName: string;}
export interface French {FormName: string;}
export interface LegalForm {
    nl: Dutch[];
    en: English[];
    fr: French[];
}
*/

export interface Language { FormName: string; }
export interface LegalForm {
    nl: Language[];
    en: Language[];
    fr: Language[];
}

