import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray,FormBuilder } from '@angular/forms';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { PersonService } from '../../../shared/person.service';
import { PositionsService } from '../../../shared/positions.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { ContactpersonComponent } from '../../../contactperson/contactperson.component';
import { CreatepositionComponent } from '../../customers/positions/createposition/createposition.component';

import { DpsPerson ,Person ,SocialSecurityNumber ,Gender ,BankAccount ,Renumeration ,MedicalAttestation,Language,
  ConstructionProfile, StudentAtWorkProfile , Documents ,DriverProfilesItem, Address, EmailAddress, PhoneNumber, Statute, VcaCertification } from '../../../shared/models';

  
@Component({
  selector: 'app-addperson',
  templateUrl: './addperson.component.html',
  styleUrls: ['./addperson.component.css']
})

export class AddpersonComponent implements OnInit {
  public persondata: any;
  public HQFormValid: boolean;
  public CTFormValid: boolean;
  public AddPersonForm1: FormGroup;
  public AddPersonForm2: FormGroup;
  public addNewRow: boolean;
  public removeLastRemove: boolean;

  public validSSID:boolean;

  public functieBox:FormArray;
  public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));

  public DpsPersonObject:DpsPerson;
  public PersonObject: Person;
  public SocialSecurityNumberObject:SocialSecurityNumber;
  public GenderObject: Gender;
  public BankAccountObject: BankAccount;
  public RenumerationObject: Renumeration;
  public MedicalAttestationObject: MedicalAttestation;
  public ConstructionProfileObject: ConstructionProfile;
  public studentsAtWorkProfileObject: StudentAtWorkProfile;
  public driverProfiles:DriverProfilesItem[];
  public driverProfilesObject: DriverProfilesItem;
  public otherDocumentsObject: Document;
  public attestation:Document;
  public constructionCardObject:Document;
  public constructionCardArray:Document[];
  public dataDropDown: string[];
  public dropDownMonth:string[];
  public dropDownYear:Array<string>;
  public dataDropDownStatute:string[];
  public dataDropDownFunctie:string[];
  public dateofBirth;
  public SelectedIndexFunctie = 0;
  public maindatas = [];
  public datas = [];

  public showFormIndex = 1;

  public id = 'dd_days';
  public currentlanguage = 'nl';
  public errorMsg;

  /***** Drop Down functions and variables for calendar days  ********************************************/
  
  private _selectedValuedays: any; private _selectedIndexdays: any = 0; private _daysvalue: any;
  private _selectedValueFunctie: any; private _selectedIndexFunctie: any = 0; private _Functievalue: any;

  set selectedValue(value: any) { this._selectedValuedays = value; }
  get selectedValue(): any { return this._selectedValuedays; }

  set selectedValueFunctie(value: any) { this._selectedIndexFunctie = value; }
  get selectedValueFunctie(): any { return this._selectedValueFunctie; }

  set selectedIndex(value: number) { this._selectedIndexdays = value; this.value = this.dataDropDown[this.selectedIndex]; }
  set selectedIndexFunctieBox(value: number) { this._selectedIndexFunctie = value; this.valueFunctie = this.dataDropDownFunctie[this.selectedIndex]; }

  get selectedIndex(): number { return this._selectedIndexdays; }
  get selectedIndexFunctieBox() : number { return this._selectedIndexFunctie }

  set value(value: any) { this._daysvalue = value; }
  get value(): any { return this._daysvalue; }

  set valueFunctie(value: any) { this._Functievalue = value; }
  get valueFunctie(): any { return this._Functievalue; }

  resetToInitValue() { this.value = this.selectedValue; }
  SetInitialValue() { if (this.selectedValue === undefined) {   this.selectedValue = this.dataDropDown[this.selectedIndex]; this.selectedValueFunctie = this.dataDropDownFunctie[this.selectedIndexFunctieBox]; }}
  
  /***** Drop Down functions and variables for calendar / Functie / statute  ********************************************/

  constructor(private personsService: PersonService,private positionsService: PositionsService, private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar) { 
    this.setDummyStatute();

    this.positionsService.getPositionsByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(positions => {
      this.maindatas = positions;
      this.FilterTheArchive();
      this.fillDataDropDown(this.maindatas);
      console.log('Positions Form Data : ', this.maindatas);
      this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));

  }

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = this.dataDropDownFunctie;
      dialogConfig.ariaLabel = 'Arial Label Positions Dialog';

      const dialogRef = this.dialog.open(CreatepositionComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.datas = result;
        console.log('this.data ::', this.dataDropDownFunctie);
        // if (this.SelectedIndexFunctie >-1){
        //     this.maindatas[this.SelectedIndexFunctie] = this.dataDropDownFunctie;
        //     this.FilterTheArchive();
        //     this.ShowMessage('Positions "' + this.datas.position.name + '" is updated successfully.', '');
        // } else {
        //   console.log('this.data.id :: ' , this.data.id);
        //   if(parseInt('0' + this.data.id,0 )>0){
        //     this.maindatas.push(this.data); 
        //     console.log(' new this.maindatas :: ', this.maindatas);
        //     this.FilterTheArchive();   
        //     this.ShowMessage('Positions "' + this.data.position.name + '" is added successfully.', '');              
        //   }
        // }
      });
    } catch (e) { }
  }

  FilterTheArchive() {
    this.maindatas = this.maindatas.filter(d => d.isArchived === false);
  }

  ngOnInit() {

    this.setDummyStatute();
    this.setDropDownYear();

    this.dataDropDown = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
    this.dropDownMonth = ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];
  

    this.AddPersonForm1 = new FormGroup({      
        socialSecurityNumber: new FormControl(''),
        dateOfBirth: new FormControl('', [Validators.required]),
        monthOfBirth: new FormControl('', [Validators.required]),
        placeofBirth: new FormControl('',[Validators.required]),
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
        birthPlace: new FormControl('', [Validators.required]),
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
        netExpenseAllowance: new FormControl(''),
        telephoneNumber: new FormControl('', [Validators.required]),
        emailAddress: new FormControl('', [Validators.required]),
        language: new FormControl('', [Validators.required]),
        nationality: new FormControl('', [Validators.required]),
        grossHourlyWage: new FormControl('', [Validators.required]),
        countryOnetExpenseAllowancefBirth: new FormControl('', [Validators.required]),
        extra: new FormControl('', [Validators.required]),           
    

    });

    this.createObjectsForm1();

    //this.customSSIDValidator(this.AddPersonForm1.get('socialSecurityNumber').value); 
    this.validSSID = false;

    this.positionsService.getPositionsByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(positions => {
      this.maindatas = positions;
      this.FilterTheArchive();
      this.dataDropDownFunctie = this.maindatas;
      this.fillDataDropDown(this.maindatas);
      console.log("drop down functie");
      console.log(this.dataDropDownFunctie);
      console.log('Positions Form Data : ', this.maindatas);
      this.ShowMessage('Positions fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));

  }

  fillDataDropDown(maindatas) {

    this.dataDropDownFunctie = [];
    console.log("main datas");
    console.log(maindatas);

    for(let i=0;i<maindatas.length;i++){
        let positionObject = maindatas[i].position.name;
        this.dataDropDownFunctie.push(positionObject);
    }

    console.log("positonObject=");
    console.log(this.dataDropDownFunctie);
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


  setDropDownYear() {

    this.dropDownYear = new Array<string>();

    for(let i:number=1900;i<=2019;i++)
      this.dropDownYear.push(""+i);

  }

  changeDropDownDateArray(event) {

    let month:string = event;
    console.log("selected month="+month);

    this.dataDropDown = [];

    if(month==="1")
    {
      for(let i:number=1;i<=28;i++)
        this.dataDropDown.push(""+i);
    }
    else
      if(month==="11"  || month==="0"  || month==="4" || month==="6" || month==="7" || month==="9" || month==="2")
      {
        for(let i:number=1;i<=31;i++)
            this.dataDropDown.push(""+i);
      }
      else
      {
          for(let i:number=1;i<=30;i++)
              this.dataDropDown.push(""+i);
      }
  }

  onChangeDropDownFunctie($event) {
     console.log("selected functie="+this.dataDropDownFunctie[$event.target.value]);     
     this.DpsPersonObject.customerPostionId = this.dataDropDownFunctie[$event.target.value];

     console.log(this.DpsPersonObject);
  }

  onChangeDropDownYear($event) {

  }

  onChangeDropDownMonth($event){    
    console.log("selected month="+$event.target.value);
    this.changeDropDownDateArray($event.target.value);
  }

  onChangeDropDownDate($event){
    this.dateofBirth  = $event;
  }

  customSSIDValidator(ssid:string) {

    this.validSSID = false;
    let validSPCharacters:boolean = false;
    
    if(ssid.length !== 15)
       return false;

    if(ssid[2]==='.' && ssid[5]==='.' && ssid[8]==='-' && ssid[12]==='.')
        validSPCharacters = true;

    let firstTwo:string = ssid.substr(0,2);
    let firstTwoValid: boolean = this.checkDigits(firstTwo);
    
    let secondTwo:string = ssid.substr(3,2);
    let secondTwoValid: boolean = this.checkDigits(secondTwo);
    
    let thirdTwo:string = ssid.substr(6,2);
    let thirdTwoValid: boolean = this.checkDigits(thirdTwo);

    let nextThree:string = ssid.substr(9,3);
    let nextThreeValid: boolean = this.checkDigits(nextThree);

    let lastTwo:string = ssid.substr(13);
    let lastTwoValid: boolean = this.checkDigits(lastTwo);

    if(validSPCharacters === true && firstTwoValid === true && secondTwoValid === true 
        && thirdTwoValid === true && nextThreeValid === true && lastTwoValid === true)
        {
          this.validSSID = true;
        }

    return this.validSSID;
  }

  checkDigits(digitString:string) {

    let digitsValid:boolean = false;

    for (let index = 0; index < digitString.length; index++) 
    {
      if(digitString[index]>='0' && digitString[index]<='9')
        digitsValid  = true;
      else
        digitsValid  = false;
    }
    
    return digitsValid;
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

  setPersonVatNumber() {

    let ssid:number = this.AddPersonForm1.get('socialSecurityNumber').value;

    this.createPersonObjects();
    this.getPersonbySSIDVatNumber();
  }

  createPersonObjects() {

    this.DpsPersonObject = new DpsPerson();
    this.PersonObject = new Person();

    this.SocialSecurityNumberObject = new SocialSecurityNumber();
    this.SocialSecurityNumberObject.number = this.AddPersonForm1.get('socialSecurityNumber').value;
    this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

    this.DpsPersonObject.customerVatNumber = this.loginuserdetails.customerVatNumber;
    this.DpsPersonObject.person = this.PersonObject;
    
    console.log("dps person object customer object=");
    console.log(this.DpsPersonObject);

  }

  getPersonbySSIDVatNumber() {
    
    if(this.validSSID === true)
    {
      let ssid:string = this.AddPersonForm1.get('socialSecurityNumber').value;
      let customerVatNumber = "123456789123";
      console.log("customerVatNumber="+customerVatNumber);
  
      this.personsService.getPersonBySSIDVatnumber(ssid,customerVatNumber).subscribe(res =>{
        console.log("response="+res);
        this.loadPersonData(res);

      },
       (err:HttpErrorResponse) => {
         if(err.error instanceof Error)
         {
           console.log("Error occured="+err.error.message);
         }
         else {
           console.log("response code="+err.status);
           console.log("response body="+err.error);
         }
       }
      );    
    }
    else {
      console.log("invalid SSN format");
    }
  }

  loadPersonData(response:any){

    // this.DpsPersonObject.person.dateOfBirth = response.person.dateOfBirth;
    // this.DpsPersonObject.person.placeOfBirth = response.person.placeOfBirth;
    // this.DpsPersonObject.person.countryOfBirth = response.person.countryOfBirth;
    // this.DpsPersonObject.person.nationality = response.person.nationality;
    // this.DpsPersonObject.person.gender = response.person.gender;
    // this.DpsPersonObject.person.firstName = response.person.firstName;
    // this.DpsPersonObject.person.lastName = response.person.lastName;
  
    this.AddPersonForm1.controls['socialSecurityNumber'].setValue(response.customerVatNumber);
    this.AddPersonForm1.controls['dataOfBirth'].setValue(response.person.dateOfBirth);
    this.AddPersonForm1.controls['countryOfBirth'].setValue(response.person.countryOfBirth);
    this.AddPersonForm1.controls['nationality'].setValue(response.person.nationality);

    this.loadObjects(response);

  }

  loadObjects(response:any) {

  this.DpsPersonObject = new DpsPerson();
  this.PersonObject = new Person();

  this.SocialSecurityNumberObject = new SocialSecurityNumber();
  this.SocialSecurityNumberObject.number = this.AddPersonForm1.get('socialSecurityNumber').value;
  this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

  this.DpsPersonObject.customerVatNumber = this.loginuserdetails.customerVatNumber;
  this.DpsPersonObject.person = this.PersonObject;

  this.DpsPersonObject = new DpsPerson();
  this.DpsPersonObject.customerVatNumber  = response.customerVatNumber;

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
  this.DpsPersonObject.person.language = response.person.language;

  this.DpsPersonObject.person.email = new EmailAddress();
  this.DpsPersonObject.person.email  = response.person.email;

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

  this.DpsPersonObject.constructionProfile = new ConstructionProfile();
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

  this.DpsPersonObject.customerVatNumber = this.loginuserdetails.customerVatNumber;
  this.DpsPersonObject.person = this.PersonObject;  

  this.DpsPersonObject.person.socialSecurityNumber = this.PersonObject.socialSecurityNumber
  this.DpsPersonObject.person.dateOfBirth =  this.AddPersonForm1.get('monthOfBirth').value +'/' + this.AddPersonForm1.get('dateOfBirth').value + '/' + this.AddPersonForm1.get('yearOfBirth').value;
  this.DpsPersonObject.person.placeOfBirth = this.AddPersonForm1.get('placeofBirth').value;
  this.DpsPersonObject.person.countryOfBirth = this.AddPersonForm1.get('countryOfBirth').value;
  this.DpsPersonObject.person.nationality = this.AddPersonForm1.get('nationality').value;
  this.DpsPersonObject.person.gender = this.AddPersonForm1.get('gender').value;
  this.DpsPersonObject.person.firstName = this.AddPersonForm1.get('firstName').value;
  this.DpsPersonObject.person.lastName = this.AddPersonForm1.get('lastName').value;
  
  this.DpsPersonObject.person.address = new Address();
  this.DpsPersonObject.person.address.street = this.AddPersonForm1.get('street').value;
  this.DpsPersonObject.person.address.streetNumber = this.AddPersonForm1.get('streetNumber').value;
  this.DpsPersonObject.person.address.bus = this.AddPersonForm1.get('bus').value;
  this.DpsPersonObject.person.address.city = this.AddPersonForm1.get('city').value;
  this.DpsPersonObject.person.address.postalCode = this.AddPersonForm1.get('postalCode').value;

  this.DpsPersonObject.person.email = new EmailAddress();
  this.DpsPersonObject.person.email.emailAddress  = this.AddPersonForm1.get('emailAddress').value;

  this.DpsPersonObject.person.mobile = new PhoneNumber();
  this.DpsPersonObject.person.mobile.number = this.AddPersonForm1.get('mobileNumber').value;

  this.DpsPersonObject.person.phone = new PhoneNumber();
  this.DpsPersonObject.person.phone.number = this.AddPersonForm1.get('telephoneNumber').value;

  this.DpsPersonObject.person.bankAccount = new BankAccount();
  this.DpsPersonObject.person.bankAccount.iban = this.AddPersonForm1.get('iban').value;
  this.DpsPersonObject.person.bankAccount.bic = this.AddPersonForm1.get('bic').value;

  this.DpsPersonObject.person.travelMode = this.AddPersonForm1.get('travelMode').value;
  this.DpsPersonObject.person.status = "";

  this.DpsPersonObject.customerPostionId = "";
  this.DpsPersonObject.renumeration = new Renumeration();
  
  this.DpsPersonObject.addittionalInformation = "";
  this.DpsPersonObject.medicalAttestation = new MedicalAttestation();
  this.DpsPersonObject.medicalAttestation.location = "";
  this.DpsPersonObject.medicalAttestation.name = "";

  this.DpsPersonObject.vcaAttestation = new Documents();
  this.DpsPersonObject.vcaAttestation.location = "";
  this.DpsPersonObject.vcaAttestation.name = "";

  this.DpsPersonObject.constructionProfile = new ConstructionProfile();
  this.DpsPersonObject.constructionCards = [];

  this.DpsPersonObject.studentAtWorkProfile = new StudentAtWorkProfile();
  this.DpsPersonObject.studentAtWorkProfile.attestation = new Documents();
  this.DpsPersonObject.studentAtWorkProfile.attestation.location = "";
  this.DpsPersonObject.studentAtWorkProfile.attestation.name = "";
  this.DpsPersonObject.studentAtWorkProfile.attestationDate = "";
  this.DpsPersonObject.studentAtWorkProfile.contingent = 0;
  this.DpsPersonObject.studentAtWorkProfile.balance = 0;

  this.DpsPersonObject.driverProfiles = [];

  let driverProfilesObject:DriverProfilesItem = new DriverProfilesItem();
  driverProfilesObject.attestation = new Documents();
  driverProfilesObject.attestation.location = "";
  driverProfilesObject.attestation.name = "";

  this.DpsPersonObject.driverProfiles.push(driverProfilesObject);

  this.DpsPersonObject.otherDocuments = [];
  
  let otherDocumentsObject:Documents = new Documents();
  otherDocumentsObject.location="";
  otherDocumentsObject.name = "";

  this.DpsPersonObject.otherDocuments.push(otherDocumentsObject);

  this.DpsPersonObject.isEnabled = false;
  this.DpsPersonObject.isArchived = false;

}

setObjectsForm2() {
 
}

onChangeDropDownStatute($event) {
  console.log("dropdown value="+$event.target.value);

  if(this.DpsPersonObject !== null){
    this.DpsPersonObject.statute = new Statute();
    this.DpsPersonObject.statute.name = this.dataDropDownStatute[$event.target.value];
    this.DpsPersonObject.statute.type = "";
  }
  console.log(this.DpsPersonObject);
}

onLanguageReceive($event) {

  console.log("language="+$event.name);
  console.log("language="+$event.shortName);

  if(this.DpsPersonObject !== null)
  {
    this.DpsPersonObject.person.language = new Language();
    this.DpsPersonObject.person.language.name = $event.name;
    this.DpsPersonObject.person.language.shortName = $event.shortName;  
  }
  console.log(this.DpsPersonObject);
}

onCountryReceive($event) {
  if(this.DpsPersonObject !== null){
    if(this.DpsPersonObject.person !== null){
      this.DpsPersonObject.person.address = new Address();
    if(this.DpsPersonObject.person.address !== null && this.DpsPersonObject.person.address !== undefined ){
        this.DpsPersonObject.person.address.country = $event.countryName;
        this.DpsPersonObject.person.address.countryCode = $event.countryCode;  
      }
    }
  }

  console.log(this.DpsPersonObject);
}

onStatuteReceive($event){
  if(this.DpsPersonObject !== null){
    this.DpsPersonObject.statute = new Statute();
    this.DpsPersonObject.statute.name = $event.value.name
    this.DpsPersonObject.statute.type = $event.value.type;  
  }
}

onHourlyWageReceive($event){
  console.log("bruo="+$event);
  this.DpsPersonObject.renumeration.hourlyWage = parseInt($event,10);;
}

onNetExpensesReceive($event){
  this.DpsPersonObject.renumeration.netCostReimbursment = parseInt($event,10);
}

onChangeCostImbursement($event) {
  this.DpsPersonObject.renumeration.costReimbursment = $event;
}

changeKM($event){
  this.DpsPersonObject.renumeration.transportationAllowance = $event;
}

addittionalInformation($event) {
  this.DpsPersonObject.addittionalInformation = $event;
}

openPositionModal() {
  this.openDialog();
}

  onFormwardClick() {

    if(this.showFormIndex === 1 )
    {
      this.showFormIndex = 2;
      this.createObjectsForm1();
    }
    else {
            if(this.showFormIndex === 2)
            {
                console.log("dps person object");
                console.log(this.DpsPersonObject);
                this.postPersonData();
            }
    }

  }

  postPersonData() {
    this.personsService.createPerson(this.DpsPersonObject).subscribe(res =>{
      console.log("response="+res);
    },
    (err:HttpErrorResponse) => {
      if(err.error instanceof Error)
      {
        console.log("Error occured="+err.error.message);
      }
      else {
        console.log("response code="+err.status);
        console.log("response body="+err.error);
      }
    }
    );                      
  }

  onBackwardClick() {
    this.showFormIndex = 1;
  }

  isInvalid() {
    return false;
  }
}
