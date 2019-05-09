import { FormGroup,FormControl,Validators,FormBuilder } from '@angular/forms';
import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { PersonService } from '../../../shared/person.service';
import { PositionsService } from '../../../shared/positions.service';
import { StatuteService } from '../../../shared/statute.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { CreatepositionComponent } from '../../customers/positions/createposition/createposition.component';

import {
  DpsPerson, Person, SocialSecurityNumber, Gender, BankAccount, Renumeration, MedicalAttestation, Language, DpsPostion, _Position,
  ConstructionProfile, StudentAtWorkProfile, Documents, DriverProfilesItem, Address, EmailAddress, PhoneNumber, Statute, VcaCertification
} from '../../../shared/models';
import { DataService } from 'src/app/shared/data.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-personposition',
  templateUrl: './personposition.component.html',
  styleUrls: ['./../person.component.css']
})

export class PersonPositionComponent implements OnInit {
  @Input() SocialSecurityId: string;
  public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));

  public PersonPositionForm: FormGroup;
  public dataDropDownStatute:Array<string>;
  public maindatas = [];
  public datas: DpsPostion;
  public dataDropDownFunctie: string[];
  public dpsPosition;
  public SelectedIndexFunctie = 0;
  public _position;
  public workstationDocument;

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
  public dataDropDownGender: string[];
  public dateofBirth;
  public selectedGenderIndex;

  public showFormIndex = 1;

  public id = 'dd_days';
  public currentlanguage = 'nl';
  public errorMsg;

  public dayString;
  public monthString;
  public yearString;

  public message:any;

  constructor(private personsService: PersonService,private data:DataService, private positionsService: PositionsService, private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar, private statuteService: StatuteService) {
    this.setDummyStatute();

    this.positionsService.getPositionsByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(positions => {
      this.maindatas = positions;
      this.FilterTheArchive();
      this.fillDataDropDown(this.maindatas);
      console.log('Positions Form Data : ', this.maindatas);
      this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));

    //SetInitialValue();
  }

  fillDataDropDown(maindatas) {

    this.dataDropDownFunctie = [];

    for (let i = 0; i < maindatas.length; i++) {
      let positionObject = maindatas[i].position.name;
      this.dataDropDownFunctie.push(positionObject);
    }
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
        console.log('The dialog was closed');
        this.datas = result;
        //this.maindatas = result;
        console.log('this.data ::', this.datas);

        if (this.datas !== null && this.datas !== undefined) {
          if (this.SelectedIndexFunctie > -1) {
            this.maindatas[this.SelectedIndexFunctie] = this.dataDropDownFunctie;
            this.FilterTheArchive();
            this.ShowMessage('Positions "' + this.datas.position.name + '" is updated successfully.', '');
          } else {
            console.log('this.data.id :: ', this.datas.id);
            if (parseInt('0' + this.datas.id, 0) > 0) {
              this.maindatas.push(this.datas);
              console.log(' new this.maindatas :: ', this.maindatas);
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

  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      console.log('Snackbar Action :: ' + Action);
    });
  }

  setDummyStatute() {
    this.dataDropDownStatute =
      [
        "Arbeider",
        "Bediende",
        "Jobstudent Arbeider",
        "Flexijob Arbeider",
        "Seizoensarbeider",
        "Gelegenheidsarbeider horeca",
        "Jobstudent Bediende",
        "Flexijob Bediende"
      ];

  }

  ngOnInit() {
    
    this.onPageInit();

    this.PersonPositionForm = new FormGroup({
      functie: new FormControl('', [Validators.required]),
      statute: new FormControl('', [Validators.required]),
      grossHourlyWage: new FormControl('', [Validators.required]),
      netExpenseAllowance: new FormControl('',[Validators.required]),
      extraRef: new FormControl('', [Validators.required]),
      countryOnetExpenseAllowancefBirth: new FormControl('', [Validators.required]),
      extra: new FormControl('', [Validators.required])
    });

    this.data.currentMessage.subscribe(message => this.message = message);
    this.createObjects();
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

    this.dpsPosition.customerVatNumber = this.loginuserdetails.customerVatNumber;
    this.dpsPosition.id = 0;
    this.dpsPosition.isArchived = false;
    this.dpsPosition.isEnabled = true;

    this.dpsPosition.position = this._position;
    this.openDialog();
  }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  onPageInit() {
  }

  // createObjectsForm() {

  //   this.DpsPersonObject = new DpsPerson();
  //   this.PersonObject = new Person();

  //   this.SocialSecurityNumberObject = new SocialSecurityNumber();
  //   this.SocialSecurityNumberObject.number = this.PersonPositionForm.get('socialSecurityNumber').value;
  //   this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

  //   this.DpsPersonObject.customerVatNumber = "123456789101";
  //   this.DpsPersonObject.person = this.PersonObject;

  //   this.DpsPersonObject.person.socialSecurityNumber = this.PersonObject.socialSecurityNumber;
  //   this.DpsPersonObject.person.placeOfBirth = this.PersonPositionForm.get('placeOfBirth').value;
  //   this.DpsPersonObject.person.countryOfBirth = this.PersonPositionForm.get('countryOfBirth').value;
  //   this.DpsPersonObject.person.nationality = this.PersonPositionForm.get('nationality').value;

  //   this.DpsPersonObject.person.gender = new Gender();
  //   this.DpsPersonObject.person.gender.genderId = 0;
  //   this.DpsPersonObject.person.gender.title = "Male";

  //   this.DpsPersonObject.person.firstName = this.AddPersonForm1.get('firstName').value;
  //   this.DpsPersonObject.person.lastName = this.AddPersonForm1.get('lastName').value;

  //   this.DpsPersonObject.person.address = new Address();
  //   this.DpsPersonObject.person.address.street = this.AddPersonForm1.get('street').value;
  //   this.DpsPersonObject.person.address.streetNumber = this.AddPersonForm1.get('streetNumber').value;
  //   this.DpsPersonObject.person.address.bus = this.AddPersonForm1.get('bus').value;
  //   this.DpsPersonObject.person.address.city = this.AddPersonForm1.get('city').value;
  //   this.DpsPersonObject.person.address.postalCode = this.AddPersonForm1.get('postalCode').value;
  //   this.DpsPersonObject.person.address.country = "New country";
  //   this.DpsPersonObject.person.address.countryCode = "NX";

  //   this.DpsPersonObject.person.email = new EmailAddress();
  //   this.DpsPersonObject.person.email.emailAddress = this.AddPersonForm1.get('emailAddress').value;

  //   this.DpsPersonObject.person.mobile = new PhoneNumber();
  //   this.DpsPersonObject.person.mobile.number = this.AddPersonForm1.get('mobileNumber').value;

  //   this.DpsPersonObject.person.phone = new PhoneNumber();
  //   this.DpsPersonObject.person.phone.number = this.AddPersonForm1.get('telephoneNumber').value;

  //   this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;

  //   this.DpsPersonObject.person.language = new Language();
  //   this.DpsPersonObject.person.language.name = "";
  //   this.DpsPersonObject.person.language.shortName = "";

  //   this.DpsPersonObject.person.bankAccount = new BankAccount();
  //   this.DpsPersonObject.person.bankAccount.iban = this.AddPersonForm1.get('iban').value;
  //   this.DpsPersonObject.person.bankAccount.bic = this.AddPersonForm1.get('bic').value;

  //   this.DpsPersonObject.person.travelMode = this.AddPersonForm1.get('travelMode').value;
  //   this.DpsPersonObject.person.status = "";

  //   this.DpsPersonObject.statute = new Statute();
  //   this.DpsPersonObject.statute.name = "";
  //   this.DpsPersonObject.statute.type = "";

  //   this.DpsPersonObject.customerPostionId = "";
  //   this.DpsPersonObject.renumeration = new Renumeration();
  //   this.DpsPersonObject.renumeration.costReimbursment = false;

  //   this.DpsPersonObject.addittionalInformation = "";
  //   this.DpsPersonObject.medicalAttestation = new MedicalAttestation();
  //   this.DpsPersonObject.medicalAttestation.location = "";
  //   this.DpsPersonObject.medicalAttestation.name = "";

  //   this.DpsPersonObject.vcaAttestation = new Documents();
  //   this.DpsPersonObject.vcaAttestation.location = "";
  //   this.DpsPersonObject.vcaAttestation.name = "";

  //   this.DpsPersonObject.constructionProfile = new ConstructionProfile();
  //   this.DpsPersonObject.constructionCards = [];

  //   this.DpsPersonObject.studentAtWorkProfile = new StudentAtWorkProfile();
  //   this.DpsPersonObject.studentAtWorkProfile.attestation = new Documents();
  //   this.DpsPersonObject.studentAtWorkProfile.attestation.location = "";
  //   this.DpsPersonObject.studentAtWorkProfile.attestation.name = "";
  //   this.DpsPersonObject.studentAtWorkProfile.attestationDate = "10/10/2019";
  //   this.DpsPersonObject.studentAtWorkProfile.contingent = 0;
  //   this.DpsPersonObject.studentAtWorkProfile.balance = 0;

  //   this.DpsPersonObject.driverProfiles = [];

  //   let driverProfilesObject: DriverProfilesItem = new DriverProfilesItem();
  //   driverProfilesObject.attestation = new Documents();
  //   driverProfilesObject.attestation.location = "";
  //   driverProfilesObject.attestation.name = "";

  //   this.DpsPersonObject.driverProfiles.push(driverProfilesObject);

  //   this.DpsPersonObject.otherDocuments = [];

  //   let otherDocumentsObject: Documents = new Documents();
  //   otherDocumentsObject.location = "";
  //   otherDocumentsObject.name = "";

  //   this.DpsPersonObject.otherDocuments.push(otherDocumentsObject);

  //   this.DpsPersonObject.isEnabled = false;
  //   this.DpsPersonObject.isArchived = false;

  // }

  createObjects() {

    console.log("message=");
    console.log(this.message);

  }

  postData() {

  }

}
