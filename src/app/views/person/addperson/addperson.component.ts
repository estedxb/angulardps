import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray,FormBuilder } from '@angular/forms';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import {  PersonService } from '../../../shared/person.service';
import { ContactpersonComponent } from '../../../contactperson/contactperson.component';

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
  public dateofBirth;

  public showFormIndex = 1;

  public id = 'dd_days';
  public currentlanguage = 'nl';
  public errorMsg;

  private _selectedValuedays: any; private _selectedIndexdays: any = 0; private _daysvalue: any;
  set selectedValue(value: any) { this._selectedValuedays = value; }
  get selectedValue(): any { return this._selectedValuedays; }
  set selectedIndex(value: number) { this._selectedIndexdays = value; this.value = this.dataDropDown[this.selectedIndex]; }
  set selectedIndexCurrencyShiftAllowance(value: number) { this._selectedIndexdays = value; this.value = this.dataDropDown[this.selectedIndex];}
  set selectedIndexCurrencyOtherAllowance(value: number) { this._selectedIndexdays = value; this.value = this.dataDropDown[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndexdays; }
  set value(value: any) { this._daysvalue = value; }
  get value(): any { return this._daysvalue; }
  resetToInitValue() { this.value = this.selectedValue; }
  SetInitialValue() { if (this.selectedValue === undefined) { this.selectedValue = this.dataDropDown[this.selectedIndex]; } }

  constructor(private personsService: PersonService,private fb: FormBuilder) { }

  ngOnInit() {

    this.dataDropDown = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
    this.dropDownMonth = ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];


    this.AddPersonForm1 = new FormGroup({      
        socialSecurityNumber: new FormControl(''),
        dateOfBirth: new FormControl('', [Validators.required]),
        monthOfBirth: new FormControl('', [Validators.required]),
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
        txtFunctie: new FormControl('', [Validators.required]),
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
        telephoneNumber: new FormControl('', [Validators.required]),
        emailAddress: new FormControl('', [Validators.required]),
        language: new FormControl('', [Validators.required]),
        nationality: new FormControl('', [Validators.required]),
        grossHourlyWage: new FormControl('', [Validators.required]),
        countryOnetExpenseAllowancefBirth: new FormControl('', [Validators.required]),
        extra: new FormControl('', [Validators.required]),           
    
    });

    //this.customSSIDValidator(this.AddPersonForm1.get('socialSecurityNumber').value); 
    this.validSSID = false;
    this.setDropDownYear();

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

    this.DpsPersonObject.person.dateOfBirth = response.person.dateOfBirth;
    this.DpsPersonObject.person.placeOfBirth = response.person.placeOfBirth;
    this.DpsPersonObject.person.countryOfBirth = response.person.countryOfBirth;
    this.DpsPersonObject.person.nationality = response.person.nationality;
    this.DpsPersonObject.person.gender = response.person.gender;
    this.DpsPersonObject.person.firstName = response.person.firstName;
    this.DpsPersonObject.person.lastName = response.person.lastName;
  
    this.AddPersonForm1.controls['socialSecurityNumber'].setValue(response.customerVatNumber);
    this.AddPersonForm1.controls['dataOfBirth'].setValue(response.person.dateOfBirth);
    this.AddPersonForm1.controls['countryOfBirth'].setValue(response.person.countryOfBirth);
    this.AddPersonForm1.controls['nationality'].setValue(response.person.nationality);

  }

  createObjects(response:any) {

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

  onFormwardClick() {

    //&& this.AddPersonForm1.valid === true

    if(this.showFormIndex === 1 )
    {
      this.showFormIndex = 2;
    }
    else {

    }

  }

  onBackwardClick() {
    this.showFormIndex = 1;
  }

  isInvalid() {
    return false;
  }
}
