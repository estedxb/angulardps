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
import { NgxSpinnerService } from 'ngx-spinner';

import {
  DpsPerson, Person, SocialSecurityNumber, Gender, BankAccount, Renumeration, MedicalAttestation, Language, DpsPostion, _Position,
  ConstructionProfile, StudentAtWorkProfile, Documents, DriverProfilesItem, Address, EmailAddress, PhoneNumber, Statute, VcaCertification
} from '../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-addperson',
  templateUrl: './addperson.component.html',
  styleUrls: ['./addperson.component.css']
})

export class AddPersonComponent implements OnInit {
  public SelectedPage = 'AddPerson';
  public persondata: any;
  public HQFormValid: boolean;
  public CTFormValid: boolean;
  public AddPersonForm1: FormGroup;
  public AddPersonForm2: FormGroup;
  public addNewRow: boolean;
  public removeLastRemove: boolean;

  public recordExists: boolean = false;

  public recvdCountryString;
  public recvdNationalityString;
  public recvdCountryOfBirth;
  public recvdCountryCode;

  public zichmetdata;
  public receiveZichmetdata;

  public selectedStatuteObject: any = {};

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
  public dataDropDownFunctieIds: number[];
  public dataDropDownGender: string[];
  public dateofBirth;
  public SelectedIndexFunctie = 0;
  public maindatas = [];
  public statutes = [];
  public countStatutes: number;
  public datas: DpsPostion;
  public selectedGenderIndex;
  public ssid: string;
  public totalString: string;
  public selectedPositionIndex: number = 0;
  public selectedStatuteIndex: number = 0;

  public netExpenseSwitch: boolean = false;
  public switchDistance: boolean = false;

  public dayIndex: number = 0;
  public monthIndex: number = 0;
  public yearIndex: number = 0;
  public buttonPressed: boolean = false;

  public extra: string = "";

  public selectedlanguageObject: any = {
    name: 'Dutch',
    shortName: 'nl'
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
  public positionChosen: string;
  public positionId: number;
  public message;
  public bban: any = '';
  public bbic: any = '';
  public iban: any = '';
  public errorMessage: string = "";

  public Id = '';
  public currentPage = '';
  public formValid = true;

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
  private _selectedValueFunctie: any; private _selectedIndexFunctie: any = 0; private _Functievalue: any;
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
  private _selectedValueGender: any; private _selectedIndexGender: any = 0; private _Gendervalue: any;
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

  // tslint:disable-next-line: member-ordering // tslint:disable-next-line: variable-name
  private _selectedValueStatute: any; private _selectedIndexStatute: any = 0; private _Statutevalue: any;
  set selectedValueStatute(value: any) { this._selectedIndexStatute = value; }
  get selectedValueStatute(): any { return this._selectedValueStatute; }
  set selectedIndexStatuteBox(value: number) {
    this._selectedIndexStatute = value; this.valueGender = this.dataDropDownGender[this.selectedIndexStatuteBox];
  }
  get selectedIndexStatuteBox(): number { return this._selectedIndexStatute; }
  set valueStatute(value: any) { this._Statutevalue = value; }
  get valueStatute(): any { return this._Statutevalue; }
  SetInitialValueStatue() {
    if (this.selectedValueStatute === undefined) {
      this.selectedValueStatute = this.dataDropDownStatute[this.selectedIndexStatuteBox];
    }
  }

  /***** Drop Down functions and variables for calendar / Functie / statute  ********************************************/

  constructor(
    public http: HttpClient, private personsService: PersonService,
    private positionsService: PositionsService, private logger: LoggingService,
    private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar,
    private statuteService: StatuteService,
    private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService
  ) {

    this.positionsService.getPositionsByVatNumber(this.dpsLoginToken.customerVatNumber).subscribe(positions => {
      this.maindatas = positions;
      this.FilterTheArchive();
      this.fillDataDropDown(this.maindatas);
      this.logger.log('Positions Form Data : ', this.maindatas);
      //this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));


    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;
      this.setDummyStatute(this.statutes);
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
            //
            //this.dataDropDownFunctie.push(result);
            this.maindatas.push(this.datas);
            this.fillDataDropDown(this.maindatas)
            this.FilterTheArchive();
            this.ShowMessage('posities "' + this.datas.position.name + '" is succesvol bijgewerkt.', '');
          } else {
            this.logger.log('this.data.id :: ', this.datas.id);
            if (parseInt('0' + this.datas.id, 0) > 0) {
              this.maindatas.push(this.datas);
              this.logger.log(' new this.maindatas :: ', this.maindatas);
              this.FilterTheArchive();
              this.ShowMessage('posities "' + this.datas.position.name + '" is bijgewerkt. succesvol toegevoegd.', '');
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
    this.dropDownMonth = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
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
      vastNumber: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required]),
      nationality: new FormControl('', [Validators.required]),
      birthPlace: new FormControl('', [Validators.required]),
      countryOfBirth: new FormControl('', [Validators.required]),
      iban: new FormControl('', [Validators.required]),
      bic: new FormControl('', [Validators.required]),
      travelMode: new FormControl('', [Validators.required])
    });

    this.positionChosen = '';
    this.positionId = 0;
    this.selectedPositionIndex = 0;

    this.AddPersonForm2 = new FormGroup({
      functie: new FormControl('', [Validators.required]),
      statute: new FormControl('', [Validators.required]),
      netExpenseAllowance: new FormControl(''),
      grossHourlyWage: new FormControl('', [Validators.required]),
      countryOnetExpenseAllowancefBirth: new FormControl('', [Validators.required]),
      extra: new FormControl('', [Validators.required]),
    });

    this.AddPersonForm2.get('netExpenseAllowance').disable();

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
      // this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));

    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;
      this.setDummyStatute(this.statutes);
      this.countStatutes = data.length;
    }, error => this.errorMsg = error);

    if (localStorage.getItem('dpsLoginToken') !== undefined &&
      localStorage.getItem('dpsLoginToken') !== '' &&
      localStorage.getItem('dpsLoginToken') !== null) {
      const sub = this.route.params.subscribe((params: any) => {
        this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
        this.Id = params.id;
        this.currentPage = params.page;
      });
    } else {
      this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    }

    this.AddPersonForm1.get('gender').disable();
    this.selectedGenderIndex = 0;
    this.enableALLFields();
  }

  fillDataDropDown(maindatas) {
    this.dataDropDownFunctie = [];
    this.dataDropDownFunctieIds = [];

    for (let i = 0; i < maindatas.length; i++) {
      let positionObject = maindatas[i].position.name;
      if (maindatas[i].position.name !== "") {
        this.dataDropDownFunctie.push(positionObject);
        this.dataDropDownFunctieIds.push(maindatas[i].position.id);
      }
    }
    this.selectedPositionIndex = 0;
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

    let currentYear = new Date();
    let year: number = currentYear.getFullYear();

    for (let i = 1900; i < year; i++) {
      this.dropDownYear.push('' + i);
    }
  }

  onChangeDropDownGender($event) {
    if (this.DpsPersonObject.person !== null && this.DpsPersonObject.person !== undefined)
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

  findIndex(position: string) {

    for (let i = 0; i < this.maindatas.length; i++) {
      if (this.maindatas[i].position.name !== undefined)
        if (position === this.maindatas[i].position.name) {
          //this.selectedPositionIndex = this.maindatas[i].id;
          this.DpsPersonObject.customerPostionId = '' + this.maindatas[i].id;
        }
    }

  }

  onChangeDropDownFunctie($event) {
    //    this.DpsPersonObject.customerPostionId = this.dataDropDownFunctie[$event.target.value];
    this.positionChosen = this.dataDropDownFunctie[$event.target.value];
    // this.positionId = this.dataDropDownFunctieIds[$event.target.value];
    this.positionId = $event.target.value;
    this.findIndex(this.dataDropDownFunctie[$event.target.value]);

    this.logger.log(this.DpsPersonObject);
    //this.updatePosition();
  }

  updatePosition() {

    this.DpsPersonObject = this.message.data;
    this.DpsPersonObject.customerPostionId = '' + this.positionId;

    this.changeMessage();

  }

  onChangeDropDownYear($event) {

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined) {
      if (this.DpsPersonObject.person !== null && this.DpsPersonObject.person !== undefined) {

        this.yearString = parseInt($event.target.value, 10) + 1900;
        this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;

      }
    }

  }

  onChangeDropDownMonth($event) {
    this.changeDropDownDateArray($event.target.value);
    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined) {
      if (this.DpsPersonObject.person !== null && this.DpsPersonObject.person !== undefined) {

        this.monthString = (parseInt($event.target.value, 10) + 1);
        this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;
      }
    }
  }

  onChangeDropDownDate($event) {

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined) {
      if (this.DpsPersonObject.person !== null && this.DpsPersonObject.person !== undefined) {
        this.dayString = $event.target.value;
        this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;
      }
    }

  }

  switchNetExpense($event) {

    if ($event === true)
      this.AddPersonForm2.get('netExpenseAllowance').enable();
    else
      this.AddPersonForm2.get('netExpenseAllowance').disable();

    this.netExpenseSwitch = $event;

    this.DpsPersonObject.renumeration.costReimbursment = $event;
    this.logger.log('event=' + $event);
  }

  stripDigits(ssid: string) {

    let digits: string = '';

    for (let i: number = 0; i < ssid.length; i++) {
      if (ssid.charAt(i) >= '0' && ssid.charAt(i) <= '9')
        digits += ssid.charAt(i);
    }
    return digits;
  }

  AutoFormatSSIDPress(event: any) {
    this.enableALLFields();
    let inputChar = event.key; //String.fromCharCode(event.key);
    this.logger.log('AutoFormatSSIDPress inputChar = ' + inputChar);
    let currentSSID = (<HTMLInputElement>event.target).value;
    this.logger.log('AutoFormatSSIDPress currentSSID = ' + currentSSID);
    const pattern = /[0-9]/;
    if (!pattern.test(inputChar) || currentSSID.length > 14) {
      // invalid character, prevent input

      this.logger.log('AutoFormatSSIDPress preventDefault');
      event.preventDefault();
    } else {
      let newSSID = currentSSID + inputChar;
      this.logger.log('AutoFormatSSIDPress newSSID before = ' + newSSID);

      if (newSSID.length === 2) {
        newSSID += '.';
      } else if (newSSID.length === 5) {
        newSSID += '.';
      } else if (newSSID.length === 8) {
        newSSID += '-';
      } else if (newSSID.length === 12) {
        newSSID += '.';
      }
      this.logger.log('AutoFormatSSIDPress newSSID after = ' + newSSID);
      this.AddPersonForm1.get('socialSecurityNumber').setValue(newSSID);
      event.preventDefault();
    }
  }

  AutoFormatSSIDUp(event: any) {
    let inputKey = event.key; //String.fromCharCode(event.key);
    this.logger.log('AutoFormatSSIDUp inputKey = ' + inputKey);
    let currentSSID = (<HTMLInputElement>event.target).value;
    this.logger.log('AutoFormatSSIDUp currentSSID before= ' + currentSSID);
    if (inputKey === 'Backspace' || inputKey === 'Delete') {
      let newSSID = '';
      for (var i = 0; i < currentSSID.length; i++) {
        if (currentSSID.charAt(i) !== '.' && currentSSID.charAt(i) !== '-') {
          newSSID += currentSSID.charAt(i);
        }
      }
      this.logger.log('AutoFormatSSIDUp newSSID before= ' + newSSID);
      newSSID = this.reFormatSSID(newSSID);
      this.logger.log('AutoFormatSSIDUp newSSID after= ' + newSSID);
      this.AddPersonForm1.get('socialSecurityNumber').setValue(newSSID);
    }
  }

  reFormatSSID(SSID) {
    if (SSID.length > 1) {
      SSID = this.insertCharAt(SSID, 2, '.');
      if (SSID.length > 4) {
        SSID = this.insertCharAt(SSID, 5, '.');
        if (SSID.length > 7) {
          SSID = this.insertCharAt(SSID, 8, '-');
          if (SSID.length > 11) {
            SSID = this.insertCharAt(SSID, 12, '.');
          }
        }
      }
    }
    this.logger.log('reFormatSSID SSID after = ) ' + SSID);
    return SSID;
  }
  insertCharAt(SSID: string, index: number, newchar: string) {
    if (index > 0)
      return SSID.substring(0, index) + newchar + SSID.substring(index, SSID.length);

    return newchar + SSID;
  };

  validatePersonSsid($event) {

    let ssid = $event;

    if (ssid.length === 1) {
      this.logger.log('ssid=' + ssid.length);
      if (this.checkDigits(ssid) === false) {
        this.AddPersonForm1.get('socialSecurityNumber').setValue('');
      }
    }

    if (ssid.length === 2) {

      if (this.checkDigits(ssid) === true) {
        this.totalString = ssid + '.';
        this.AddPersonForm1.get('socialSecurityNumber').setValue(this.totalString);
      }
      else {
        this.AddPersonForm1.get('socialSecurityNumber').setValue('');
      }
    }

    if (ssid.length === 5) {

      this.totalString = this.totalString + ssid.substring(3) + '.';
      this.AddPersonForm1.get('socialSecurityNumber').setValue(this.totalString);
      this.logger.log('total string=' + this.totalString);

    }

    if (ssid.length === 8) {
      this.logger.log('ssid=' + ssid);
      this.totalString = this.totalString + ssid.substring(6) + '-';
      this.AddPersonForm1.get('socialSecurityNumber').setValue(this.totalString);
      this.logger.log('total string=' + this.totalString);

    }

    if (ssid.length === 12) {
      this.logger.log('ssid=' + ssid);
      this.totalString = this.totalString + ssid.substring(9) + '.';
      this.AddPersonForm1.get('socialSecurityNumber').setValue(this.totalString);
      this.logger.log('total string=' + this.totalString);

    }

    if (this.totalString !== undefined && this.totalString !== null && this.totalString.length === 13) {
      this.logger.log('ssid=' + ssid);
      this.totalString = this.totalString + ssid.substring(13);
      this.AddPersonForm1.get('socialSecurityNumber').setValue(this.totalString);
      this.logger.log('total string=' + this.totalString);
    }


  }

  newCustomSSIDValidator(ssid: string) {

    this.validSSID = false;
    let validSPCharacters = false;

    if (ssid.length !== 15) {
      return false;
    }

    let digits: string = this.stripDigits(ssid);

    if (digits.length < 11)
      return false;

    let lastTwoDigits: number = parseInt(digits.substring(digits.length - 2), 10);
    let firstTwoDigits: number = parseInt(ssid.substring(0, 2));
    let secondTwoDigits: number = parseInt(ssid.substring(3, 5));
    let thirdTwoDigits: number = parseInt(ssid.substring(6, 8));
    let genderDigits: number = parseInt(ssid.substring(9, 12));
    let firstNineDigits: string = digits.substring(0, 9);
    let x: number = 0;
    let controlNumber: number = -1;

    if (secondTwoDigits < 1 || secondTwoDigits > 12) {
      //this.ShowMessage('Maand is ongeldig!','');
      return false;
    }

    if (thirdTwoDigits < 1 || thirdTwoDigits >= 32) {
      //this.ShowMessage('jaar is ongeldig!','');
      return false;
    }

    let currentYear: any = new Date();
    currentYear = currentYear.getFullYear();
    let currentYearTwoDigits = currentYear % 100;

    if (firstTwoDigits >= 0 && firstTwoDigits <= currentYearTwoDigits && currentYear >= 2000) {
      x = parseInt(('2' + firstNineDigits), 10);
      let newremainder: number = x % 97;
      controlNumber = 97 - newremainder;
      if (controlNumber === lastTwoDigits)
        this.validSSID = true;
      else {
        this.validSSID = false;
        //this.ShowMessage('Inzendingen zijn onjuist !','');

      }
    }
    else {
      x = parseInt(firstNineDigits, 10);
      let remainder: number = x % 97;
      controlNumber = 97 - remainder;

      if (controlNumber === lastTwoDigits)
        this.validSSID = true;
      else {
        this.validSSID = false;
        //this.ShowMessage('Inzendingen zijn onjuist !','');
      }

    }

    if (this.validSSID === true) {
      this.setCalendar(firstTwoDigits, secondTwoDigits, thirdTwoDigits);
      this.setGender(genderDigits);
    }

    return this.validSSID;

  }

  setGender(genderDigits: number) {

    if (genderDigits % 2 === 0) {
      this._selectedIndexGender = 1;
      this.selectedGenderIndex = 1;
    }
    else {
      this._selectedIndexGender = 0;
      this.selectedGenderIndex = 0;
    }

  }

  setCalendar(year: number, month: number, day: number) {

    let currentYear: any = new Date();
    currentYear = currentYear.getFullYear();
    let currentYearTwoDigits = currentYear % 100;

    this.AddPersonForm1.get('dateOfBirth').disable();
    this.AddPersonForm1.get('monthOfBirth').disable();
    this.AddPersonForm1.get('yearOfBirth').disable();

    if (day >= 1 && day <= 31) {
      for (let i = 0; i < this.dataDropDown.length; i++) {
        if (day.toString() === this.dataDropDown[i]) {
          this._selectedIndexdays = i;
          this.dayIndex = i;

        }
      }
    }

    if (month >= 1 && month <= 12) {
      // this.selectedIndexMonth = month - 1;
      this._selectedIndexMonth = month - 1;
      this.monthIndex = month - 1;
    }

    if (year >= 0 && year <= currentYearTwoDigits) {
      for (let i = 0; i < this.dropDownYear.length; i++) {
        if (this.dropDownYear[i] === (year + 2000).toString()) {
          // this.selectedIndexYear = i;
          // this._selectedIndexYear = i;
          this.yearIndex = i;
          this.yearString = '' + (year + 2000).toString();
        }
      }
    }
    else {

      this.yearString = '' + (year + 1900).toString();

      for (let i = 0; i < this.dropDownYear.length; i++) {
        if (this.dropDownYear[i] === (year + 1900).toString()) {
          // this.selectedIndexYear = i;
          // this._selectedIndexYear = i;
          this.yearIndex = i;
          this.yearString = '' + (year + 1900).toString();
        }
      }
    }

    this.monthString = (this.selectedIndexMonth + 1);
    this.dayString = this.dataDropDown[this._selectedIndexdays];

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject !== null && this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person !== null)
      this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;


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

    for (let index = 0; index < digitString.length; index++) {
      if (digitString[index] >= '0' && digitString[index] <= '9') {
      } else {
        return false;
      }
    }

    return true;
  }

  setDummyStatute(data) {
    this.dataDropDownStatute = [];

    data.forEach(element => {

      // let obj = {
      //      'name':  element.name,
      //      'type': element.type
      // }

      this.dataDropDownStatute.push(element.name);
    });
  }


  getCustomValidation(value) {
    return this.newCustomSSIDValidator(value);
  }

  setPersonVatNumber() {
    // const ssid: number = this.AddPersonForm1.get('socialSecurityNumber').value;
    this.logger.log('setPersonVatNumber');
    this.createPersonObjects();
    this.logger.log('setPersonVatNumber after createPersonObjects');
    this.getPersonbySSIDVatNumber();
  }

  createPersonObjects() {
    try {
      this.DpsPersonObject = new DpsPerson();
      this.PersonObject = new Person();

      this.SocialSecurityNumberObject = new SocialSecurityNumber();
      this.SocialSecurityNumberObject.number = this.AddPersonForm1.get('socialSecurityNumber').value;
      this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

      this.DpsPersonObject.customerVatNumber = this.dpsLoginToken.customerVatNumber;
      this.DpsPersonObject.person = this.PersonObject;
    } catch (e) {
      alert(e.message);
    }
  }

  getPersonbySSIDVatNumber() {
    this.logger.log('getPersonbySSIDVatNumber in');

    if (this.validSSID === true) {
      const ssid: string = this.AddPersonForm1.get('socialSecurityNumber').value;
      const customerVatNumber = this.dpsLoginToken.customerVatNumber;
      this.logger.log('customerVatNumber=' + customerVatNumber);
      this.logger.log('getPersonbySSIDVatNumber 1');
      this.personsService.getPersonBySSIDVatnumber(ssid, customerVatNumber).subscribe(res => {
        //this.logger.log('res=' + res);
        //this.loadPersonData(res);
        if (res.person.firstName === null || res.person.lastName === null || res.customerPostionId === null) {
          this.recordExists = false;
          this.enableALLFields();
          this.errorMessage = "";
        }
        else {
          this.recordExists = true;
          this.disableAllFields();
          this.ShowMessage('Persoon bestaat al!', '');
          this.errorMessage = "Persoon bestaat al!";
        }
      },
        (err: HttpErrorResponse) => {
          this.logger.log('getPersonbySSIDVatNumber error (' + err.status + ')', err);
          if (err.status === 204) {
            this.personsService.getPersonBySSIDBoemm(ssid).subscribe(res => {
              this.logger.log('res=' + res);
              this.formValid = true;
              this.recordExists = false;
              this.loadPersonData(res);
              this.enableALLFields();
            },
              (err: HttpErrorResponse) => {
                this.logger.log('Error occured=' + err.error.message);
                this.formValid = true;
                this.loadDOBFromSSID();
                this.enableALLFields();
                this.recordExists = false;
              }
            );
          }
          else {
            this.formValid = false;
            this.recordExists = false;
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

    this.logger.log("load dob data");

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
    this.AddPersonForm1.controls.vastNumber.setValue('');
  }

  setIndexPosition(position: number) {
    for (let i = 0; i < this.maindatas.length; i++)
      if (position === this.maindatas[i].id)
        this.selectedPositionIndex = i;
  }

  setIndexStatute(statuteData: any) {

    for (let k = 0; k < this.maindatas.length; k++)
      if (statuteData.name === this.statutes[k].name)
        this.selectedStatuteIndex = k;

  }

  loadPersonData(rdata) {

    const data = rdata;

    if (data !== null && data.person !== null) {

      this.setIndexPosition(parseInt(data.CustomerPostionId, 10));

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

    if (data.person.language !== null && data.person.language !== undefined) {
      this.languageString = data.person.language.name;
    }

    if (data.person.bankAccount !== null) {
      this.AddPersonForm1.controls.iban.setValue(data.person.bankAccount.iban);
      this.AddPersonForm1.controls.bic.setValue(data.person.bankAccount.bic);
    }

    if (data.statute !== null) {
      this.setIndexStatute(data.statute);
    }

    if (data.person.mobile !== null) {
      this.AddPersonForm1.controls.mobileNumber.setValue(data.person.mobile.number);
    }

    if (data.person.phone !== null) {
      this.AddPersonForm1.controls.vastNumber.setValue(data.person.phone.number);
    }


    // if(data.customerVatNumber !== null)
    //   this.AddPersonForm1.controls.vatNumber.setValue(data.customerVatNumber);


    if (data.person !== null) {
      this.zichmetdata = data.person.travelMode;
    }

  }

  loadObjects(response: any) {

    // this.DpsPersonObject = new DpsPerson();
    // this.PersonObject = new Person();

    // this.SocialSecurityNumberObject = new SocialSecurityNumber();
    // this.SocialSecurityNumberObject.number = this.AddPersonForm1.get('socialSecurityNumber').value;
    // this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

    // this.DpsPersonObject.customerVatNumber = this.dpsLoginToken.customerVatNumber;
    // this.DpsPersonObject.person = this.PersonObject;

    this.DpsPersonObject = new DpsPerson();

    // doubt here whether from token or from response
    // this.DpsPersonObject.customerVatNumber = this.dpsLoginToken.customerVatNumber;
    this.DpsPersonObject.customerVatNumber = response.customerVatNumber;

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

    this.DpsPersonObject.person.travelMode = this.receiveZichmetdata;
    this.zichmetdata = this.receiveZichmetdata;

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
    this.DpsPersonObject.person.phone.number = this.AddPersonForm1.get('vastNumber').value;

    this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;

    this.DpsPersonObject.person.language = new Language();
    this.DpsPersonObject.person.language.name = '';
    this.DpsPersonObject.person.language.shortName = '';

    this.DpsPersonObject.person.bankAccount = new BankAccount();
    this.DpsPersonObject.person.bankAccount.iban = this.AddPersonForm1.get('iban').value;
    this.DpsPersonObject.person.bankAccount.bic = this.AddPersonForm1.get('bic').value;

    this.DpsPersonObject.person.status = '';

    this.DpsPersonObject.statute = new Statute();
    this.DpsPersonObject.statute.name = this.statutes[this.selectedStatuteIndex].name;
    this.DpsPersonObject.statute.type = this.statutes[this.selectedStatuteIndex].type;
    this.DpsPersonObject.statute.brightStaffingID = this.statutes[this.selectedStatuteIndex].brightStaffingID;

    this.DpsPersonObject.person.language = new Language();
    this.DpsPersonObject.person.language.name = this.selectedlanguageObject.name;
    this.DpsPersonObject.person.language.shortName = this.selectedlanguageObject.shortName.toLowerCase();

    this.logger.log('selectedPositionIndex=' + this.selectedPositionIndex);
    this.findIndex(this.dataDropDownFunctie[this.selectedPositionIndex]);

    this.DpsPersonObject.renumeration = new Renumeration();
    this.DpsPersonObject.renumeration.costReimbursment = false;

    if (this.extra === "" && this.showFormIndex === 1)
      this.DpsPersonObject.addittionalInformation = "" + this.extra;

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


  receiveZichMet($event) {

    this.logger.log("received zich met data=" + $event.vehicleName);

    this.receiveZichmetdata = $event.vehicleName;
    this.zichmetdata = $event.vehicleName;

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
      if (this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person !== null) {
        this.DpsPersonObject.person.travelMode = $event.vehicleName;
      }

    this.changeMessage();

  }

  onCountryReceiveNationality($event) {

    this.recvdNationalityString = $event.Country;

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
      if (this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person !== null) {
        this.DpsPersonObject.person.nationality = $event.Country;
      }

    this.changeMessage();

  }

  onCountryReceiveBirthPlace($event) {

    this.recvdCountryOfBirth = $event.Country;

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
      if (this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person !== null) {
        this.DpsPersonObject.person.countryOfBirth = $event.Country;
      }

    this.changeMessage();

  }
  onChangeDropDownStatute($event) {

    this.selectedStatuteObject.name = this.dataDropDownStatute[$event.target.value];
    this.selectedStatuteObject.type = this.statutes[$event.target.value].type;
    this.selectedStatuteObject.brightStaffingID = this.statutes[$event.target.value].brightStaffingID;

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined) {
      this.DpsPersonObject.statute = new Statute();
      this.DpsPersonObject.statute.name = this.dataDropDownStatute[$event.target.value];
      this.DpsPersonObject.statute.type = this.statutes[$event.target.value].type;
      this.DpsPersonObject.statute.brightStaffingID = this.statutes[$event.target.value].brightStaffingID;
    }

  }

  onLanguageReceive($event) {

    this.selectedlanguageObject.name = $event.name;
    this.selectedlanguageObject.shortName = $event.shortName.toLowerCase();

    this.logger.log(this.selectedlanguageObject);

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined)
      if (this.DpsPersonObject.person !== null && this.DpsPersonObject.person !== undefined) {
        this.DpsPersonObject.person.language = new Language();
        this.DpsPersonObject.person.language.name = $event.name;
        this.DpsPersonObject.person.language.shortName = $event.shortName.toLowerCase();

      }
  }

  changeTelephoneNumber(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined)
      if (this.DpsPersonObject !== null && this.DpsPersonObject.person !== null && this.DpsPersonObject.person.phone !== null && this.DpsPersonObject.person.phone !== undefined)
        this.DpsPersonObject.person.phone.number = value;

    this.changeMessage();

  }

  updateMobileNumber(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person.mobile !== undefined)
      if (this.DpsPersonObject !== null && this.DpsPersonObject.person !== null && this.DpsPersonObject.person.mobile !== null)
        this.DpsPersonObject.person.mobile.number = value;

    this.changeMessage();
  }

  updatePostalCode(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person.mobile !== undefined)
      if (this.DpsPersonObject !== null && this.DpsPersonObject.person !== null && this.DpsPersonObject.person.address !== null)
        this.DpsPersonObject.person.address.postalCode = value;

    this.changeMessage();
  }

  updateCity(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person.mobile !== undefined)
      if (this.DpsPersonObject !== null && this.DpsPersonObject.person !== null && this.DpsPersonObject.person.address !== null)
        this.DpsPersonObject.person.address.city = value;

    this.changeMessage();
  }

  updateBus(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person.mobile !== undefined)
      if (this.DpsPersonObject !== null && this.DpsPersonObject.person !== null && this.DpsPersonObject.person.address !== null)
        this.DpsPersonObject.person.address.bus = value;

    this.changeMessage();
  }

  updateStreetNumber(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person.mobile !== undefined)
      if (this.DpsPersonObject !== null && this.DpsPersonObject.person !== null && this.DpsPersonObject.person.address !== null)
        this.DpsPersonObject.person.address.streetNumber = value;
    this.changeMessage();

  }

  updateStreet(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined)
      if (this.DpsPersonObject !== null && this.DpsPersonObject.person !== null && this.DpsPersonObject.person.address !== null)
        this.DpsPersonObject.person.address.street = value;

    this.changeMessage();
  }

  updateFirstName(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined)
      if (this.DpsPersonObject !== null && this.DpsPersonObject.person !== null)
        this.DpsPersonObject.person.firstName = value;

    this.changeMessage();
  }

  updateLastName(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined)
      if (this.DpsPersonObject !== null && this.DpsPersonObject.person !== null)
        this.DpsPersonObject.person.lastName = value;

    this.changeMessage();
  }

  updateEmailAddress(value: string) {

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject.person !== undefined)
      if (this.DpsPersonObject.person !== null && this.DpsPersonObject.person.email !== null && this.DpsPersonObject.person.email !== undefined)
        this.DpsPersonObject.person.email.emailAddress = value;

    this.changeMessage();
  }

  updateVatNumber(value: string) {

    if (this.DpsPersonObject !== null)
      this.DpsPersonObject.customerVatNumber = value;

    this.changeMessage();
  }

  onCountryReceive($event) {

    this.logger.log('on Country Receive=' + $event.Country);
    this.logger.log('on Country Receive=' + $event['Alpha-2']);

    this.recvdCountryString = $event.Country;
    this.recvdCountryCode = $event['Alpha-2'];

    if (this.DpsPersonObject !== null && this.DpsPersonObject !== undefined) {
      if (this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person !== null) {
        this.DpsPersonObject.person.address = new Address();
        if (this.DpsPersonObject.person.address !== null && this.DpsPersonObject.person.address !== undefined) {
          this.DpsPersonObject.person.address.country = $event.Country;
          this.DpsPersonObject.person.address.countryCode = $event['Alpha-2'];
        }
      }
    }

  }

  onStatuteReceive($event) {
    if (this.DpsPersonObject !== null) {
      this.DpsPersonObject.statute = new Statute();
      this.DpsPersonObject.statute.name = $event.value.name;
      this.DpsPersonObject.statute.type = $event.value.type;
      this.DpsPersonObject.statute.brightStaffingID = $event.value.brightStaffingID;
    }
  }

  onHourlyWageReceive($event) {
    this.DpsPersonObject.renumeration.hourlyWage = parseInt($event, 10);
  }

  onNetExpensesReceive($event) {

    if ($event === true)
      this.AddPersonForm2.get('netExpenseAllowance').disable();
    else
      this.AddPersonForm2.get('netExpenseAllowance').enable();

    this.DpsPersonObject.renumeration.netCostReimbursment = parseInt($event, 10);
  }

  onChangeCostImbursement($event) {
    this.DpsPersonObject.renumeration.costReimbursment = $event;
  }

  changeKM($event) {
    this.switchDistance = $event;
    this.DpsPersonObject.renumeration.transportationAllowance = $event;
  }

  addittionalInformation($event) {

    this.logger.log("extra=" + $event);

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject !== null)
      this.DpsPersonObject.addittionalInformation = $event;

    this.logger.log(this.DpsPersonObject);
  }

  enableALLFields() {

    this.logger.log("enabled all fields");

    this.AddPersonForm1.get('firstName').enable();
    this.AddPersonForm1.get('lastName').enable();
    this.AddPersonForm1.get('street').enable();
    this.AddPersonForm1.get('streetNumber').enable();
    this.AddPersonForm1.get('city').enable();
    this.AddPersonForm1.get('postalCode').enable();
    this.AddPersonForm1.get('mobileNumber').enable();
    this.AddPersonForm1.get('vastNumber').enable();
    this.AddPersonForm1.get('emailAddress').enable();
    this.AddPersonForm1.get('iban').enable();
    this.AddPersonForm1.get('bic').enable();
    this.AddPersonForm1.get('bus').enable();
    this.AddPersonForm1.get('placeOfBirth').enable();

  }

  disableAllFields() {
    this.AddPersonForm1.get('firstName').disable();
    this.AddPersonForm1.get('lastName').disable();
    this.AddPersonForm1.get('street').disable();
    this.AddPersonForm1.get('streetNumber').disable();
    this.AddPersonForm1.get('city').disable();
    this.AddPersonForm1.get('postalCode').disable();
    this.AddPersonForm1.get('mobileNumber').disable();
    this.AddPersonForm1.get('vastNumber').disable();
    this.AddPersonForm1.get('emailAddress').disable();
    this.AddPersonForm1.get('iban').disable();
    this.AddPersonForm1.get('bic').disable();
    this.AddPersonForm1.get('bus').disable();
    this.AddPersonForm1.get('placeOfBirth').disable();
  }

  checkValidation() {

    if (this.recordExists === true)
      return false;

    if (this.AddPersonForm1.get('socialSecurityNumber').valid === true &&
      this.AddPersonForm1.get('firstName').valid === true &&
      this.AddPersonForm1.get('lastName').valid === true &&
      this.AddPersonForm1.get('street').valid === true &&
      this.AddPersonForm1.get('streetNumber').valid === true &&
      this.AddPersonForm1.get('city').valid === true &&
      this.AddPersonForm1.get('postalCode').valid === true &&
      this.AddPersonForm1.get('mobileNumber').valid === true &&
      this.AddPersonForm1.get('vastNumber').valid === true &&
      this.AddPersonForm1.get('emailAddress').valid === true &&
      this.AddPersonForm1.get('iban').valid === true) {
      console.log('form valid');
      return true;
    }
    else {
      //this.errorMessage = "Inzendingen zijn onjuist !";
    }

    return false;
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

  setPositionIFEmpty() {

    this.DpsPersonObject.statute = new Statute();
    this.DpsPersonObject.statute.name = this.statutes[this.selectedStatuteIndex].name;
    this.DpsPersonObject.statute.type = this.statutes[this.selectedStatuteIndex].type;
    this.DpsPersonObject.statute.brightStaffingID = this.statutes[this.selectedStatuteIndex].brightStaffingID;

    if (this.extra !== "")
      this.DpsPersonObject.addittionalInformation = "" + this.extra;

    this.findIndex(this.dataDropDownFunctie[this.selectedPositionIndex]);

  }

  onFormwardClick() {
    document.getElementById('maincontent').scrollTo(0, 0);

    if (this.showFormIndex === 1) {

      this.buttonPressed = true;

      this.spinner.show();

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 5000);

      if (this.checkValidation())
        this.showFormIndex = 2;
      else
        this.ShowMessage('' + this.errorMessage, '');

      this.createObjectsForm1();
    }
    else {

      if (this.showFormIndex === 2) {

        this.buttonPressed = true;
        this.setPositionIFEmpty();

        if (this.maindatas.length === 0)
          this.ShowMessage('Maak alstublieft positie voor de persoon !', '');
        else
          this.postPersonData();
      }
    }
  }

  postPersonData() {

    this.ShowMessage('Persoonsrecord creëren ....', '');

    this.personsService.createPerson(this.DpsPersonObject).subscribe(res => {
      this.logger.log('response=' + res);
      this.ShowMessage('Persoonsrecord met succes gemaakt.', '');
      this.router.navigate(['/dashboard']);
      //this.showFormIndex = 3;
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.logger.log('Error occured=' + err.error.message);
          this.ShowMessage('Persoon maakt record mislukt.', '');
          //this.showFormIndex = 4;
          // this.ShowMessage('Error occured='+err.error.message,'');
        } else {

          if (err.status === 200) {
            this.router.navigate(['/dashboard']);
            this.ShowMessage('Persoonsrecord met succes gemaakt.', '');
          }
          else {
            this.logger.log('response code=' + err.status);
            this.logger.log('response body=' + err.error);
            this.ShowMessage('Persoon maakt record mislukt.', '');
          }
          // this.ShowMessage('Error occured='+err.error,'');
        }
      }
    );
  }

  onBackwardClick() {
    this.showFormIndex = 1;
    //let ssid:string = this.AddPersonForm1.get('socialSecurityNumber').value;
    //this.newCustomSSIDValidator(ssid);
    this.ShowMessage('terug', '');
  }

  isInvalid() {
    return false;
  }
}
