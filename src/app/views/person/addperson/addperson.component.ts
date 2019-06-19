import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PersonService } from '../../../shared/person.service';
import { PositionsService } from '../../../shared/positions.service';
import { StatuteService } from '../../../shared/statute.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { CreatepositionComponent } from '../../customers/positions/createposition/createposition.component';
import { LoggingService } from '../../../shared/logging.service';
import { LoginToken } from '../../../shared/models';

import {
  DpsPerson, Person, SocialSecurityNumber, Gender, BankAccount, Renumeration, MedicalAttestation, Language, DpsPostion, _Position,
  ConstructionProfile, StudentAtWorkProfile, Documents, DriverProfilesItem, Address, EmailAddress, PhoneNumber, Statute, VcaCertification
} from '../../../shared/models';

@Component({
  selector: 'app-addperson',
  templateUrl: './addperson.component.html',
  styleUrls: ['./addperson.component.css']
})

export class AddPersonComponent implements OnInit {
  public persondata: any;
  public HQFormValid: boolean;
  public CTFormValid: boolean;
  public AddPersonForm1: FormGroup;
  public AddPersonForm2: FormGroup;
  public addNewRow: boolean;
  public removeLastRemove: boolean;

  public recvdCountryString;
  public recvdNationalityString;
  public recvdCountryOfBirth;
  public recvdCountryCode;

  public selectedStatuteObject:any = {};

  public validSSID: boolean;

  public functieBox: FormArray;
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public languageString;

  public DpsPersonObject: DpsPerson;
  public PersonObject: Person;
  public SocialSecurityNumberObject: SocialSecurityNumber;
  public GenderObject: Gender;
  public BankAccountObject: BankAccount;
  public RenumerationObject: Renumeration;
  public MedicalAttestationObject: MedicalAttestation;
  public ConstructionProfileObject: ConstructionProfile;
  public studentsAtWorkProfileObject: StudentAtWorkProfile;
  public driverProfiles: DriverProfilesItem[];
  public driverProfilesObject: DriverProfilesItem;
  public otherDocumentsObject: Document;
  public attestation: Document;
  public constructionCardObject: Document;
  public constructionCardArray: Document[];
  public dataDropDown: string[];
  public dropDownMonth: string[];
  public dropDownYear: Array<string>;
  public dataDropDownStatute: string[];
  public dataDropDownFunctie: string[];
  public dataDropDownGender: string[];
  public dateofBirth;
  public SelectedIndexFunctie = 0;
  public maindatas = [];
  public statutes = [];
  public countStatutes: number;
  public datas: DpsPostion;
  public selectedGenderIndex;
  
  public selectedlanguageObject:any = {
    name: "Dutch",
    shortName: "nl"
  };


  public showFormIndex = 1;

  public id = 'dd_days';
  public currentlanguage = 'nl';
  public errorMsg;

  public dpsPosition;
  public _position;
  public workstationDocument;

  public dayString;
  public monthString;
  public yearString;

  public message;
  public bban: any = '';
  public bbic: any = '';
  public iban: any = '';


  /***** Drop Down functions and variables for calendar days  ********************************************/
  private _selectedValuedays: any; private _selectedIndexdays: any = 0; private _daysvalue: any;
  set selectedValue(value: any) { this._selectedValuedays = value; }
  get selectedValue(): any { return this._selectedValuedays; }
  set selectedIndex(value: number) { this._selectedIndexdays = value; this.value = this.dataDropDown[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndexdays; }
  set value(value: any) { this._daysvalue = value; }
  get value(): any { return this._daysvalue; }
  resetToInitValue() { this.value = this.selectedValue; }
  SetInitialValue() { if (this.selectedValue === undefined) { this.selectedValue = this.dataDropDown[this.selectedIndex]; } }

  /***** Drop Down functions and variables for calendar months  ********************************************/
  private _selectedValueMonth: any; private _selectedIndexMonth: any = 0; private _monthvalue: any;
  set selectedValueMonth(value: any) { this._selectedValueMonth = value; }
  get selectedValueMonth(): any { return this._selectedValueMonth; }
  set selectedIndexMonth(value: number) { this._selectedIndexMonth = value; this.value = this.dropDownMonth[this.selectedIndexMonth]; }
  get selectedIndexMonth(): number { return this._selectedIndexMonth; }
  set valueMonth(value: any) { this._selectedValueMonth = value; }
  get valueMonth(): any { return this._selectedValueMonth; }
  resetToInitValueMonth() { this.value = this.selectedValue; }
  SetInitialValueMonth() { if (this.selectedValueMonth === undefined) { this.selectedValueMonth = this.dropDownMonth[this.selectedIndexMonth]; } }

  /***** Drop Down functions and variables for calendar year  ********************************************/
  private _selectedValueYear: any; private _selectedIndexYear: any = 0; private _yearvalue: any;
  set selectedValueYear(value: any) { this._selectedValueYear = value; }
  get selectedValueYear(): any { return this._selectedValueYear; }
  set selectedIndexYear(value: number) { this._selectedIndexYear = value; this.value = this.dropDownYear[this.selectedIndexYear]; }
  get selectedIndexYear(): number { return this._selectedIndexYear; }
  set valueYear(value: any) { this._selectedValueYear = value; }
  get valueYear(): any { return this._selectedValueYear; }
  resetToInitValueYear() { this.value = this.selectedValue; }
  SetInitialValueYear() {
    if (this.selectedValueYear === undefined) { this.selectedValueYear = this.dropDownYear[this.selectedIndexYear]; }
  }

  /***** Drop Down functions and variables for calendar / Functie / statute  ********************************************/
  private _selectedValueFunctie: any; private _selectedIndexFunctie: any = 1; private _Functievalue: any;
  set selectedValueFunctie(value: any) { this._selectedIndexFunctie = value; }
  get selectedValueFunctie(): any { return this._selectedValueFunctie; }
  set selectedIndexFunctieBox(value: number) {
    this._selectedIndexFunctie = value; this.valueFunctie = this.dataDropDownFunctie[this.selectedIndexFunctieBox];
  }
  get selectedIndexFunctieBox(): number { return this._selectedIndexFunctie; }
  set valueFunctie(value: any) { this._Functievalue = value; }
  get valueFunctie(): any { return this._Functievalue; }
  SetInitialValueFunctie() {
    if (this.selectedValueFunctie === undefined) { this.selectedValueFunctie = this.dataDropDownFunctie[this.selectedIndexFunctieBox]; }
  }

  /***** Drop Down functions and variables for calendar / Functie / statute  ********************************************/

  // tslint:disable-next-line: member-ordering // tslint:disable-next-line: variable-name
  private _selectedValueGender: any; private _selectedIndexGender: any = 1; private _Gendervalue: any;
  set selectedValueGender(value: any) { this._selectedIndexGender = value; }
  get selectedValueGender(): any { return this._selectedValueGender; }
  set selectedIndexGenderBox(value: number) {
    this._selectedIndexGender = value; this.valueGender = this.dataDropDownGender[this.selectedIndexGenderBox];
  }
  get selectedIndexGenderBox(): number { return this._selectedIndexGender; }
  set valueGender(value: any) { this._Gendervalue = value; }
  get valueGender(): any { return this._Gendervalue; }
  SetInitialValueGender() {
    if (this.selectedValueGender === undefined) {
      this.selectedValueGender = this.dataDropDownGender[this.selectedIndexGenderBox];
    }
  }

  /***** Drop Down functions and variables for calendar / Functie / statute  ********************************************/

  constructor(
    public http: HttpClient, private personsService: PersonService,
    private positionsService: PositionsService, private logger: LoggingService,
    private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar, private statuteService: StatuteService) {

    this.logger.log('customerVatNumber=' + this.dpsLoginToken.customerVatNumber);

    this.positionsService.getPositionsByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(positions => {
      this.maindatas = positions;
      this.FilterTheArchive();
      this.fillDataDropDown(this.maindatas);
      this.logger.log('Positions Form Data : ', this.maindatas);
      this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));


    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;
      this.setDummyStatute(this.statutes);
      this.logger.log('data from getStatutues(): ');
      this.logger.log(data);
      this.countStatutes = data.length;
    }, error => this.errorMsg = error);


  }

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = this.dpsPosition;
      dialogConfig.ariaLabel = 'Arial Label Positions Dialog';

      const dialogRef = this.dialog.open(CreatepositionComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        this.logger.log('The dialog was closed');
        this.datas = result;
        // this.maindatas = result;
        this.logger.log('this.data ::', this.datas);

        if (this.datas !== null && this.datas !== undefined) {
          if (this.SelectedIndexFunctie > -1) {
            this.maindatas[this.SelectedIndexFunctie] = this.dataDropDownFunctie;
            this.FilterTheArchive();
            this.ShowMessage('Positions "' + this.datas.position.name + '" is updated successfully.', '');
          } else {
            this.logger.log('this.data.id :: ', this.datas.id);
            if (parseInt('0' + this.datas.id, 0) > 0) {
              this.maindatas.push(this.datas);
              this.logger.log(' new this.maindatas :: ', this.maindatas);
              this.FilterTheArchive();
              this.ShowMessage('Positions "' + this.datas.position.name + '" is added successfully.', '');
            }
          }
        }
      });
    } catch (e) { }
  }

  FilterTheArchive() {
    this.maindatas = this.maindatas.filter(d => d.isArchived === false);
  }

  ngOnInit() {

    this.setDropDownYear();

    this.dataDropDown = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    this.dropDownMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.dataDropDownGender = ['Man', 'Vrouw'];

    this.AddPersonForm1 = new FormGroup({
      socialSecurityNumber: new FormControl(''),
      dateOfBirth: new FormControl('', [Validators.required]),
      monthOfBirth: new FormControl('', [Validators.required]),
      placeOfBirth: new FormControl('', [Validators.required]),
      yearOfBirth: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      streetNumber: new FormControl('', [Validators.required]),
      bus: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      telephoneNumber: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required]),
      nationality: new FormControl('', [Validators.required]),
      birthPlace: new FormControl('', [Validators.required]),
      countryOfBirth: new FormControl('', [Validators.required]),
      iban: new FormControl('', [Validators.required]),
      bic: new FormControl('', [Validators.required]),
      travelMode: new FormControl('', [Validators.required])
    });

    this.AddPersonForm2 = new FormGroup({
      functie: new FormControl('', [Validators.required]),
      statute: new FormControl('', [Validators.required]),
      netExpenseAllowance: new FormControl(''),
      grossHourlyWage: new FormControl('', [Validators.required]),
      countryOnetExpenseAllowancefBirth: new FormControl('', [Validators.required]),
      extra: new FormControl('', [Validators.required]),
    });

    // this.createObjectsForm1();
    this.SetInitialValue();
    this.SetInitialValueMonth();
    this.SetInitialValueYear();
    this.SetInitialValueGender();

    // this.customSSIDValidator(this.AddPersonForm1.get('socialSecurityNumber').value);
    this.validSSID = false;

    this.positionsService.getPositionsByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(positions => {
      this.maindatas = positions;
      this.FilterTheArchive();
      this.dataDropDownFunctie = this.maindatas;
      this.fillDataDropDown(this.maindatas);
      this.logger.log('drop down functie');
      this.logger.log(this.dataDropDownFunctie);
      this.logger.log('Positions Form Data : ', this.maindatas);
      this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));

    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;
      this.setDummyStatute(this.statutes);
      this.logger.log('data from getStatutues(): ');
      this.logger.log(data);
      this.countStatutes = data.length;
    }, error => this.errorMsg = error);
  }

  fillDataDropDown(maindatas) {
    this.dataDropDownFunctie = [];
    for (let i = 0; i < maindatas.length; i++) {
      const positionObject = maindatas[i].position.name;
      this.dataDropDownFunctie.push(positionObject);
    }
  }

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      this.logger.log('Snackbar Action :: ' + Action);
    });
  }

  setDropDownYear() {
    this.dropDownYear = new Array<string>();
    for (let i = 1900; i <= 2019; i++) {
      this.dropDownYear.push('' + i);
    }
  }

  onChangeDropDownGender($event) {
    if (this.DpsPersonObject.person.gender !== undefined && this.DpsPersonObject.person.gender !== null) {
      this.DpsPersonObject.person.gender.title = $event.target.value;
    } else {
      this.DpsPersonObject.person.gender = new Gender();
      this.DpsPersonObject.person.gender.title = $event.target.value;
    }
    this.logger.log(this.DpsPersonObject);
  }

  changeDropDownDateArray(event) {

    const month: string = event;
    this.logger.log('selected month=' + month);

    this.dataDropDown = [];

    if (month === '1') {
      for (let i = 1; i <= 28; i++) {
        this.dataDropDown.push('' + i);
      }
    } else
      if (month === '11' || month === '0' || month === '4' || month === '6' ||
        month === '7' || month === '9' || month === '2') {
        for (let i = 1; i <= 31; i++) {
          this.dataDropDown.push('' + i);
        }
      } else {
        for (let i = 1; i <= 30; i++) {
          this.dataDropDown.push('' + i);
        }
      }
  }

  onChangeDropDownFunctie($event) {
    this.logger.log('selected functie=' + this.dataDropDownFunctie[$event.target.value]);
//    this.DpsPersonObject.customerPostionId = this.dataDropDownFunctie[$event.target.value];
    this.DpsPersonObject.customerPostionId = $event.target.value;
    this.logger.log(this.DpsPersonObject);
  }

  onChangeDropDownYear($event) {
    this.yearString = parseInt($event.target.value,10)+1900;
    this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;
  }

  onChangeDropDownMonth($event) {
    this.logger.log('selected month=' + $event.target.value);
    this.changeDropDownDateArray($event.target.value);
    this.monthString = $event.value;
    this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;
  }

  onChangeDropDownDate($event) {
    this.DpsPersonObject.person.dateOfBirth = $event.value;
    this.dayString = $event.value;

    this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;
  }

  switchNetExpense($event) {
    this.DpsPersonObject.renumeration.costReimbursment = $event;
    this.logger.log('event=' + $event);
  }

  customSSIDValidator(ssid: string) {
    this.validSSID = false;
    let validSPCharacters = false;

    if (ssid.length !== 15) {
      return false;
    }

    if (ssid[2] === '.' && ssid[5] === '.' && ssid[8] === '-' && ssid[12] === '.') {
      validSPCharacters = true;
    }

    const firstTwo: string = ssid.substr(0, 2);
    const firstTwoValid: boolean = this.checkDigits(firstTwo);

    const secondTwo: string = ssid.substr(3, 2);
    const secondTwoValid: boolean = this.checkDigits(secondTwo);

    const thirdTwo: string = ssid.substr(6, 2);
    const thirdTwoValid: boolean = this.checkDigits(thirdTwo);

    const nextThree: string = ssid.substr(9, 3);
    const nextThreeValid: boolean = this.checkDigits(nextThree);

    const lastTwo: string = ssid.substr(13);
    const lastTwoValid: boolean = this.checkDigits(lastTwo);

    if (validSPCharacters === true && firstTwoValid === true && secondTwoValid === true
      && thirdTwoValid === true && nextThreeValid === true && lastTwoValid === true) {
      this.validSSID = true;
    }

    return this.validSSID;
  }

  checkDigits(digitString: string) {

    let digitsValid = false;

    for (let index = 0; index < digitString.length; index++) {
      if (digitString[index] >= '0' && digitString[index] <= '9') {
        digitsValid = true;
      } else {
        digitsValid = false;
      }
    }

    return digitsValid;
  }

  setDummyStatute(data) {
    this.dataDropDownStatute = [];

    data.forEach(element => {
      
      // let obj = {
      //      "name":  element.name,
      //      "type": element.type
      // }

      this.dataDropDownStatute.push(element.name);
    });
  }


  setPersonVatNumber() {

    const ssid: number = this.AddPersonForm1.get('socialSecurityNumber').value;

    this.createPersonObjects();
    this.getPersonbySSIDVatNumber();
  }

  createPersonObjects() {

    this.DpsPersonObject = new DpsPerson();
    this.PersonObject = new Person();

    this.SocialSecurityNumberObject = new SocialSecurityNumber();
    this.SocialSecurityNumberObject.number = this.AddPersonForm1.get('socialSecurityNumber').value;
    this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

    this.DpsPersonObject.customerVatNumber = this.dpsLoginToken.customerVatNumber;
    this.DpsPersonObject.person = this.PersonObject;

  }

  getPersonbySSIDVatNumber() {

    if (this.validSSID === true) {
      const ssid: string = this.AddPersonForm1.get('socialSecurityNumber').value;
      const customerVatNumber = this.dpsLoginToken.customerVatNumber;
      this.logger.log('customerVatNumber=' + customerVatNumber);

      this.personsService.getPersonBySSIDVatnumber(ssid, customerVatNumber).subscribe(res => {
        this.loadPersonData(res);
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.logger.log('Error occured=' + err.error.message);
            this.loadDOBFromSSID();
          } else {
            this.logger.log('response code=' + err.status);
            this.logger.log('response body=' + err.error);
          }
        }
      );
    } else {
      this.logger.log('invalid SSN format');
      this.resetPeronData();
    }

  }

  loadDOBFromSSID() {

    const ssid: string = this.AddPersonForm1.get('socialSecurityNumber').value;
    const dobString: string = ssid.substring(0, 8);

    const stringData = dobString.split('.');
  }

  loadDOBData(dateOfBirth: string) {

    this.logger.log('date of birth=' + dateOfBirth);

    const dobArrayData = dateOfBirth.split('-');
    const yearString: string = dobArrayData[0];
    const monthString: string = dobArrayData[1];
    const dayString: string = dobArrayData[2];

    this._selectedIndexdays = parseInt(dayString, 10);
    this._selectedIndexMonth = parseInt(monthString, 10) - 1;
    this._selectedIndexYear = (parseInt(yearString, 10) - 1900);

    this.monthString = monthString;
    this.dayString = dayString;
    this.yearString = yearString;

    this.DpsPersonObject.person.dateOfBirth = monthString + '/' + dayString + '/' + yearString;

  }

  // // get bban from iban
  // soapCallGetBBAN() {

  //   var xmlHttp = new XMLHttpRequest();
  //   xmlHttp.open('POST','http://www.ibanbic.be/IBANBIC.asmx?op=getBelgianBBAN',true);

  //   //let sr = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><getBelgianBBAN xmlns="http://tempuri.org/"><Value>BE46001664436336</Value></getBelgianBBAN></soap:Body></soap:Envelope>';
  //   let sr = '<?xml version="1.0" encoding="utf-8"?>'
  //           +'<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'
  //           +'<soap12:Body><getBelgianBBAN xmlns="http://tempuri.org/">'
  //           +'<Value>BE46001664436336</Value></getBelgianBBAN>'
  //           +'</soap12:Body></soap12:Envelope>';
  //   let reponse:number = 0;

  //   xmlHttp.onreadystatechange = () => {
  //     if(xmlHttp.readyState == 4) {
  //        if(xmlHttp.status == 200){
  //          var xml = xmlHttp.responseXML;
  //          reponse = parseInt(xml.getElementsByTagName("return")[0].childNodes[0].nodeValue);
  //          this.logger.log("response="+reponse);
  //        }
  //     }
  //   }

  //   xmlHttp.setRequestHeader('Content-Type','text/xml');
  //   xmlHttp.responseType = 'document';
  //   xmlHttp.send(sr);

  // }

  soapCallFetchBBAN() {

    const parser = new DOMParser();
    const xmlString = '<?xml version="1.0" encoding="utf-8"?>'
      + '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'
      + '<soap12:Body><getBelgianBBAN xmlns="http://tempuri.org/">'
      + '<Value>BE46001664436336</Value>'
      + '</getBelgianBBAN></soap12:Body></soap12:Envelope>';

    const doc = parser.parseFromString(xmlString, 'text/xml');
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Content-Type', 'application/soap+xml');

    this.http.post('http://www.ibanbic.be/IBANBIC.asmx?op=getBelgianBBAN', xmlString, { headers }).subscribe(data => {
      this.logger.log('data=' + data);
      this.bban = data;
      this.soapCallGetBIC();
    });

  }

  // bic from bban
  soapCallGetBIC() {

    const parser = new DOMParser();
    const xmlString = '<?xml version="1.0" encoding="utf-8"?>'
      + '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
      + '<soap:Body><BBANtoBIC xmlns="http://tempuri.org/">'
      + '<Value>string</Value></BBANtoBIC></soap:Body></soap:Envelope>';

    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Content-Type', 'application/soap+xml');

    this.http.post('http://www.ibanbic.be/IBANBIC.asmx?op=getBelgianBBAN', xmlString, { headers }).subscribe(data => {
      this.logger.log('data=' + data);
      this.bbic = data;
    });

    if (this.DpsPersonObject !== null) {
      if (this.DpsPersonObject.person !== null) {
        this.DpsPersonObject.person.bankAccount = new BankAccount();
        this.DpsPersonObject.person.bankAccount.iban = this.iban;
        this.DpsPersonObject.person.bankAccount.bic = this.bbic;
        this.AddPersonForm1.controls.bic.setValue(this.bbic);
      }
    }
  }

  setIbanNumber(value: string) {
    this.iban = value;
    this.soapCallFetchBBAN();
  }

  resetPeronData() {

    this.AddPersonForm1.controls.placeOfBirth.setValue('');
    this.AddPersonForm1.controls.countryOfBirth.setValue('');
    this.AddPersonForm1.controls.nationality.setValue('');
    this.AddPersonForm1.controls.firstName.setValue('');
    this.AddPersonForm1.controls.lastName.setValue('');
    this.AddPersonForm1.controls.street.setValue('');
    this.AddPersonForm1.controls.streetNumber.setValue('');
    this.AddPersonForm1.controls.bus.setValue('');
    this.AddPersonForm1.controls.city.setValue('');
    this.AddPersonForm1.controls.postalCode.setValue('');
    this.AddPersonForm1.controls.country.setValue('');
    this.AddPersonForm1.controls.emailAddress.setValue('');
    // this.languageString = data.person.language.name;

    this.AddPersonForm1.controls.iban.setValue('');
    this.AddPersonForm1.controls.bic.setValue('');

    this.AddPersonForm1.controls.mobileNumber.setValue('');
    this.AddPersonForm1.controls.telephoneNumber.setValue('');
  }

  loadPersonData(response) {

    this.logger.log(response.body);
    const data = response.body;

    if (data.person !== null) {

      const stringData: string = data.person.dateOfBirth.toString();
      const dobArray = stringData.split('T');
      const dobString: string = dobArray[0];
      this.loadDOBData(dobString);

      const genderObject = new Gender();

      if (data.person.gender !== null) {
        genderObject.genderId = data.person.gender.genderId;
        genderObject.title = data.person.gender.title;

        this.selectedGenderIndex = genderObject.genderId;
      }

      this.AddPersonForm1.controls.placeOfBirth.setValue(data.person.placeOfBirth);
      this.AddPersonForm1.controls.countryOfBirth.setValue(data.person.countryOfBirth);
      this.AddPersonForm1.controls.nationality.setValue(data.person.nationality);
      this.AddPersonForm1.controls.firstName.setValue(data.person.firstName);
      this.AddPersonForm1.controls.lastName.setValue(data.person.lastName);
    }

    if (data.person.address !== null) {
      this.AddPersonForm1.controls.street.setValue(data.person.address.street);
      this.AddPersonForm1.controls.streetNumber.setValue(data.person.address.streetNumber);
      this.AddPersonForm1.controls.bus.setValue(data.person.address.bus);
      this.AddPersonForm1.controls.city.setValue(data.person.address.city);
      this.AddPersonForm1.controls.postalCode.setValue(data.person.address.postalCode);
      this.AddPersonForm1.controls.country.setValue(data.person.address.country);
      this.AddPersonForm1.controls.emailAddress.setValue(data.person.email.emailAddress);
    }

    if(data.person.language !== null && data.person.language !== undefined)
    {
      this.languageString = data.person.language.name;
    }

    if (data.person.bankAccount !== null) {
      this.AddPersonForm1.controls.iban.setValue(data.person.bankAccount.iban);
      this.AddPersonForm1.controls.bic.setValue(data.person.bankAccount.bic);
    }

    if (data.person.mobile !== null) {
      this.AddPersonForm1.controls.mobileNumber.setValue(data.person.mobile.number);
    }

    if (data.person.phone !== null) {
      this.AddPersonForm1.controls.telephoneNumber.setValue(data.person.phone.number);
    }

  }

  loadObjects(response: any) {

    this.DpsPersonObject = new DpsPerson();
    this.PersonObject = new Person();

    this.SocialSecurityNumberObject = new SocialSecurityNumber();
    this.SocialSecurityNumberObject.number = this.AddPersonForm1.get('socialSecurityNumber').value;
    this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

    this.DpsPersonObject.customerVatNumber = this.dpsLoginToken.customerVatNumber;
    this.DpsPersonObject.person = this.PersonObject;

    this.DpsPersonObject = new DpsPerson();
    this.DpsPersonObject.customerVatNumber = '';

    this.DpsPersonObject.person = new Person();
    this.DpsPersonObject.person.socialSecurityNumber = response.person.socialSecurityNumber;
    this.DpsPersonObject.person.dateOfBirth = response.person.dateOfBirth;
    this.DpsPersonObject.person.placeOfBirth = response.person.placeOfBirth;
    this.DpsPersonObject.person.countryOfBirth = response.person.countryOfBirth;
    this.DpsPersonObject.person.nationality = response.person.nationality;
    this.DpsPersonObject.person.gender = response.person.gender;
    this.DpsPersonObject.person.firstName = response.person.firstName;
    this.DpsPersonObject.person.lastName = response.person.lastName;

    this.DpsPersonObject.person.address = new Address();
    this.DpsPersonObject.person.address = response.person.address;

    this.DpsPersonObject.person.language = new Language();
    this.DpsPersonObject.person.language.name = response.person.language.name;
    this.DpsPersonObject.person.language.shortName = response.person.language.shortName.toLowerCase();

    this.selectedlanguageObject.name = response.person.language.name;
    this.selectedlanguageObject.shortName = response.person.language.shortName.toLowerCase();

    this.DpsPersonObject.person.email = new EmailAddress();
    this.DpsPersonObject.person.email = response.person.email;

    this.DpsPersonObject.person.mobile = new PhoneNumber();
    this.DpsPersonObject.person.mobile = response.person.mobile;

    this.DpsPersonObject.person.phone = new PhoneNumber();
    this.DpsPersonObject.person.phone = response.person.phone;

    this.DpsPersonObject.person.bankAccount = new BankAccount();
    this.DpsPersonObject.person.bankAccount = response.person.bankAccount;

    this.DpsPersonObject.person.travelMode = response.person.travelMode;
    this.DpsPersonObject.person.status = response.person.status;

    this.DpsPersonObject.customerPostionId = response.customerPostionId;

    this.DpsPersonObject.statute = new Statute();
    this.DpsPersonObject.statute = response.statute;

    this.DpsPersonObject.renumeration = new Renumeration();
    this.DpsPersonObject.renumeration = response.renumeration;

    this.DpsPersonObject.addittionalInformation = response.addittionalInformation;
    this.DpsPersonObject.medicalAttestation = new MedicalAttestation();
    this.DpsPersonObject.medicalAttestation = response.medicalAttestation;

    this.DpsPersonObject.vcaAttestation = new Documents();
    this.DpsPersonObject.vcaAttestation = response.vcaAttestation;

    // this.DpsPersonObject.constructionProfile = new ConstructionProfile();
    this.DpsPersonObject.constructionCards = response.constructionCards;

    this.DpsPersonObject.studentAtWorkProfile = new StudentAtWorkProfile();
    this.DpsPersonObject.studentAtWorkProfile = response.studentAtWorkProfile;

    this.DpsPersonObject.driverProfiles = response.driverProfiles;
    this.DpsPersonObject.otherDocuments = response.otherDocuments;

    this.DpsPersonObject.isEnabled = response.isEnabled;
    this.DpsPersonObject.isArchived = response.isArchived;

  }

  createObjectsForm1() {

    this.DpsPersonObject = new DpsPerson();
    this.PersonObject = new Person();

    this.SocialSecurityNumberObject = new SocialSecurityNumber();
    this.SocialSecurityNumberObject.number = this.AddPersonForm1.get('socialSecurityNumber').value;
    this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

    this.DpsPersonObject.customerVatNumber = this.dpsLoginToken.customerVatNumber;
    this.DpsPersonObject.person = this.PersonObject;

    this.DpsPersonObject.person.socialSecurityNumber = this.PersonObject.socialSecurityNumber;
    this.DpsPersonObject.person.placeOfBirth = this.AddPersonForm1.get('placeOfBirth').value;
    this.DpsPersonObject.person.countryOfBirth = this.recvdCountryOfBirth; 
    this.DpsPersonObject.person.nationality = this.recvdNationalityString;

    this.DpsPersonObject.person.gender = new Gender();
    this.DpsPersonObject.person.gender.genderId = 0;
    this.DpsPersonObject.person.gender.title = 'Male';

    this.DpsPersonObject.person.firstName = this.AddPersonForm1.get('firstName').value;
    this.DpsPersonObject.person.lastName = this.AddPersonForm1.get('lastName').value;

    this.DpsPersonObject.person.address = new Address();
    this.DpsPersonObject.person.address.street = this.AddPersonForm1.get('street').value;
    this.DpsPersonObject.person.address.streetNumber = this.AddPersonForm1.get('streetNumber').value;
    this.DpsPersonObject.person.address.bus = this.AddPersonForm1.get('bus').value;
    this.DpsPersonObject.person.address.city = this.AddPersonForm1.get('city').value;
    this.DpsPersonObject.person.address.postalCode = this.AddPersonForm1.get('postalCode').value;

    this.DpsPersonObject.person.address.country = this.recvdCountryString;
    this.DpsPersonObject.person.address.countryCode = this.recvdCountryCode;

    this.DpsPersonObject.person.email = new EmailAddress();
    this.DpsPersonObject.person.email.emailAddress = this.AddPersonForm1.get('emailAddress').value;

    this.DpsPersonObject.person.mobile = new PhoneNumber();
    this.DpsPersonObject.person.mobile.number = this.AddPersonForm1.get('mobileNumber').value;

    this.DpsPersonObject.person.phone = new PhoneNumber();
    this.DpsPersonObject.person.phone.number = this.AddPersonForm1.get('telephoneNumber').value;

    this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;

    this.DpsPersonObject.person.language = new Language();
    this.DpsPersonObject.person.language.name = '';
    this.DpsPersonObject.person.language.shortName = '';

    this.DpsPersonObject.person.bankAccount = new BankAccount();
    this.DpsPersonObject.person.bankAccount.iban = this.AddPersonForm1.get('iban').value;
    this.DpsPersonObject.person.bankAccount.bic = this.AddPersonForm1.get('bic').value;

    this.DpsPersonObject.person.travelMode = this.AddPersonForm1.get('travelMode').value;
    this.DpsPersonObject.person.status = '';

    this.DpsPersonObject.statute = new Statute();
    this.DpsPersonObject.statute.name = this.selectedStatuteObject.name;
    this.DpsPersonObject.statute.type = this.selectedStatuteObject.type;

    this.DpsPersonObject.person.language = new Language();
    this.DpsPersonObject.person.language.name = this.selectedlanguageObject.name;
    this.DpsPersonObject.person.language.shortName = this.selectedlanguageObject.shortName.toLowerCase();

    this.DpsPersonObject.customerPostionId = '';
    this.DpsPersonObject.renumeration = new Renumeration();
    this.DpsPersonObject.renumeration.costReimbursment = false;

    this.DpsPersonObject.addittionalInformation = '';
    this.DpsPersonObject.medicalAttestation = new MedicalAttestation();
    this.DpsPersonObject.medicalAttestation.location = '';
    this.DpsPersonObject.medicalAttestation.name = '';

    this.DpsPersonObject.vcaAttestation = new Documents();
    this.DpsPersonObject.vcaAttestation.location = '';
    this.DpsPersonObject.vcaAttestation.name = '';

    this.DpsPersonObject.constructionCards = [];

    this.DpsPersonObject.studentAtWorkProfile = new StudentAtWorkProfile();
    this.DpsPersonObject.studentAtWorkProfile.attestation = new Documents();
    this.DpsPersonObject.studentAtWorkProfile.attestation.location = '';
    this.DpsPersonObject.studentAtWorkProfile.attestation.name = '';
    this.DpsPersonObject.studentAtWorkProfile.attestationDate = '10/10/2019';
    this.DpsPersonObject.studentAtWorkProfile.contingent = 0;
    this.DpsPersonObject.studentAtWorkProfile.balance = 0;

    this.DpsPersonObject.driverProfiles = [];

    const driverProfilesObject: DriverProfilesItem = new DriverProfilesItem();
    driverProfilesObject.attestation = new Documents();
    driverProfilesObject.attestation.location = '';
    driverProfilesObject.attestation.name = '';

    this.DpsPersonObject.driverProfiles.push(driverProfilesObject);

    this.DpsPersonObject.otherDocuments = [];

    const otherDocumentsObject: Documents = new Documents();
    otherDocumentsObject.location = '';
    otherDocumentsObject.name = '';

    this.DpsPersonObject.otherDocuments.push(otherDocumentsObject);

    this.DpsPersonObject.isEnabled = true;
    this.DpsPersonObject.isArchived = false;

  }

  setObjectsForm2() {

  }

  changeMessage() {

    if (this.DpsPersonObject !== null) {
      // const newmessage: any = {
      //   page: 'edit',
      //   data: this.DpsPersonObject
      // };
      //this.data.changeMessage(newmessage);

    }
  }


  onCountryReceiveNationality($event) {

    this.logger.log("nationality received="+ $event.Country);

    if(this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
    if (this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person !== null) {
        this.DpsPersonObject.person.nationality = $event.Country;
        this.recvdNationalityString = $event.Country;
    }  

    this.changeMessage();

  }

  onCountryReceiveBirthPlace($event) {

    this.logger.log("onCountryReceiveBirthPlace received="+ $event.Country);

   if(this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
    if (this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person !== null) {
      this.DpsPersonObject.person.countryOfBirth = $event.Country;
      this.recvdCountryOfBirth = $event.Country;
  
    }

    this.changeMessage();

  }
  onChangeDropDownStatute($event) {

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined) {
      this.DpsPersonObject.statute = new Statute();
      this.DpsPersonObject.statute.name = this.dataDropDownStatute[$event.target.value];
      this.DpsPersonObject.statute.type = this.statutes[$event.target.value].type;

      this.selectedStatuteObject.name = this.dataDropDownStatute[$event.target.value];
      this.selectedStatuteObject.type = this.statutes[$event.target.value].type;
    }
    this.logger.log(this.DpsPersonObject);
  }

  onLanguageReceive($event) {

    this.selectedlanguageObject.name = $event.name;
    this.selectedlanguageObject.shortName = $event.shortName.toLowerCase();

    this.logger.log(this.selectedlanguageObject);

    if(this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
    if (this.DpsPersonObject.person !== null && this.DpsPersonObject.person !== undefined) {
      this.DpsPersonObject.person.language = new Language();
      this.DpsPersonObject.person.language.name = $event.name;
      this.DpsPersonObject.person.language.shortName = $event.shortName.toLowerCase();

    }
  }

  onCountryReceive($event) {

    this.logger.log("on Country Receive="+$event.Country);
    this.logger.log("on Country Receive="+$event['Alpha-2']);

    // this.logger.log(this.DpsPersonObject);

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined) {
      if (this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person !== null) {
        this.DpsPersonObject.person.address = new Address();
        if (this.DpsPersonObject.person.address !== null && this.DpsPersonObject.person.address !== undefined) {
          this.DpsPersonObject.person.address.country = $event.Country;
          this.DpsPersonObject.person.address.countryCode = $event['Alpha-2'];
          this.recvdCountryString = $event.Country;
          this.recvdCountryCode = $event['Alpha-2'];
          
          this.logger.log(this.DpsPersonObject);
        }
      }
    }

  }

  onStatuteReceive($event) {
    if (this.DpsPersonObject !== null) {
      this.DpsPersonObject.statute = new Statute();
      this.DpsPersonObject.statute.name = $event.value.name;
      this.DpsPersonObject.statute.type = $event.value.type;
    }
  }

  onHourlyWageReceive($event) {
    this.DpsPersonObject.renumeration.hourlyWage = parseInt($event, 10);
  }

  onNetExpensesReceive($event) {
    this.DpsPersonObject.renumeration.netCostReimbursment = parseInt($event, 10);
  }

  onChangeCostImbursement($event) {
    this.DpsPersonObject.renumeration.costReimbursment = $event;
  }

  changeKM($event) {
    this.DpsPersonObject.renumeration.transportationAllowance = $event;
  }

  addittionalInformation($event) {
    this.DpsPersonObject.addittionalInformation = $event;
  }

  onClickAdd() {

    this.dpsPosition = new DpsPostion();
    this._position = new _Position();
    this.workstationDocument = new Documents();

    this.workstationDocument.name = '';
    this.workstationDocument.location = '';

    this._position.costCenter = '';
    this._position.isStudentAllowed = false;
    this._position.name = '';
    this._position.taskDescription = '';
    this._position.workstationDocument = this.workstationDocument;

    this.dpsPosition.customerVatNumber = this.dpsLoginToken.customerVatNumber;
    this.dpsPosition.id = 0;
    this.dpsPosition.isArchived = false;
    this.dpsPosition.isEnabled = true;

    this.dpsPosition.position = this._position;
    this.openDialog();
  }

  onFormwardClick() {

    if (this.showFormIndex === 1) {
      this.showFormIndex = 2;
      this.createObjectsForm1();
    } else {
      if (this.showFormIndex === 2) {
        this.postPersonData();
        this.ShowMessage('Person fetched successfully.', '');
        this.showFormIndex = 3;
      }
    }
  }

  postPersonData() {
    this.personsService.createPerson(this.DpsPersonObject).subscribe(res => {
      this.logger.log('response=' + res);
      this.ShowMessage('Person record created successfully.', '');
      this.showFormIndex = 3;
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.logger.log('Error occured=' + err.error.message);
          this.showFormIndex = 4;
          // this.ShowMessage('Error occured='+err.error.message,'');
        } else {
          this.logger.log('response code=' + err.status);
          this.logger.log('response body=' + err.error);
          // this.ShowMessage('Error occured='+err.error,'');
        }
      }
    );
  }

  onBackwardClick() {
    this.showFormIndex = 1;
    this.ShowMessage('back', '');
  }

  isInvalid() {
    return false;
  }
}
