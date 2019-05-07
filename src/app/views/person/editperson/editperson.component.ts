import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { DpsPerson ,Person ,SocialSecurityNumber ,Gender ,BankAccount ,Renumeration ,MedicalAttestation,Language,DpsPostion,_Position,
  ConstructionProfile, StudentAtWorkProfile , Documents ,DriverProfilesItem, Address, EmailAddress, PhoneNumber, Statute, VcaCertification } from '../../../shared/models';
import { PersonService } from 'src/app/shared/person.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-editperson',
  templateUrl: './editperson.component.html',
  styleUrls: ['./../person.component.css']
})
export class EditpersonComponent implements OnInit {

  editPersonForm:FormGroup;
  editPersonForm2: FormGroup;

  public dataDropDown;
  public dropDownMonth;
  public dataDropDownGender;
  public showFormIndex=1;
  public validSSID;

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
  public dropDownYear:Array<string>;
  public dataDropDownStatute:string[];
  public dataDropDownFunctie:string[];
  public dateofBirth;
  public SelectedIndexFunctie = 0;
  public maindatas = [];
  public datas:DpsPostion;
  public selectedGenderIndex;

  public id = 'dd_days';
  public currentlanguage = 'nl';
  public errorMsg;
  public dpsPosition;
  public _position;
  public workstationDocument;

  public dayString;
  public monthString;
  public yearString;

  constructor(private personsService: PersonService) { }

  setDummyStatute() {
  }

  setDropDownYear() {
  }

  ngOnInit() {
    this.setDummyStatute();
    this.setDropDownYear();

    this.dataDropDown = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
    this.dropDownMonth = ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];
    this.dataDropDownGender = ["Man","Vrouw"];
    this.validSSID = false;

    this.editPersonForm = new FormGroup({      
        socialSecurityNumber: new FormControl(''),
        dateOfBirth: new FormControl('', [Validators.required]),
        monthOfBirth: new FormControl('', [Validators.required]),
        placeOfBirth: new FormControl('',[Validators.required]),
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

   this.editPersonForm2 = new FormGroup({
        functie: new FormControl('', [Validators.required]),
        statute: new FormControl('', [Validators.required]),
        netExpenseAllowance: new FormControl(''),
        grossHourlyWage: new FormControl('', [Validators.required]),
        countryOnetExpenseAllowancefBirth: new FormControl('', [Validators.required]),
        extra: new FormControl('', [Validators.required]),
    });
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
  
  createPersonObjects() {

    this.DpsPersonObject = new DpsPerson();
    this.PersonObject = new Person();

    this.SocialSecurityNumberObject = new SocialSecurityNumber();
    this.SocialSecurityNumberObject.number = this.editPersonForm.get('socialSecurityNumber').value;
    this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

    //this.DpsPersonObject.customerVatNumber = this.loginuserdetails.customerVatNumber;
    this.DpsPersonObject.customerVatNumber = "123456789101";
    this.DpsPersonObject.person = this.PersonObject;
    
    // console.log("dps person object customer object=");
    // console.log(this.DpsPersonObject);

  }

  getPersonbySSIDVatNumber() {
    
    if(this.validSSID === true)
    {
      let ssid:string = this.editPersonForm.get('socialSecurityNumber').value;
      let customerVatNumber = "123456789101";
      console.log("customerVatNumber="+customerVatNumber);
  
      this.personsService.getPersonBySSIDVatnumber(ssid,customerVatNumber).subscribe(res =>{
        console.log("response="+res);
        console.log(res);
        this.loadPersonData(res);
      },
       (err:HttpErrorResponse) => {
         if(err.error instanceof Error)
         {
           console.log("Error occured="+err.error.message);
           this.loadDOBFromSSID();
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
      this.resetPeronData();
    }
  }

  loadDOBFromSSID() {

    let ssid:string = this.editPersonForm.get('socialSecurityNumber').value;
    let dobString:string = ssid.substring(0,8);

    let stringData = dobString.split('.');
    //let dobArray = stringData.split('T');
    //let dobString:string = dobArray[0];

    //this.loadDOBData(stringData);


  }

  loadDOBData(dateOfBirth:string) {

    console.log("date of birth="+dateOfBirth);

    let dobArrayData = dateOfBirth.split("-");
    let yearString:string = dobArrayData[0];
    let monthString:string = dobArrayData[1];
    let dayString:string = dobArrayData[2];

    this._selectedIndexdays = parseInt(dayString,10);
    this._selectedIndexMonth = parseInt(monthString,10) - 1;
    this._selectedIndexYear = (parseInt(yearString,10) - 1900);

    this.monthString = monthString;
    this.dayString = dayString;
    this.yearString =  yearString;

    this.DpsPersonObject.person.dateOfBirth =  monthString +'/' + dayString + '/' + yearString;
    
  }

  setIbanNumber(value:string){

    if(this.DpsPersonObject !== null)
    {
      if(this.DpsPersonObject.person !== null)
      {
        this.DpsPersonObject.person.bankAccount = new BankAccount();
        this.DpsPersonObject.person.bankAccount.iban = value;
        this.DpsPersonObject.person.bankAccount.bic = value.substring(2);
        this.editPersonForm.controls['bic'].setValue(value.substring(2));

      }
    }
  }

  resetPeronData(){

    this.editPersonForm.controls['placeOfBirth'].setValue("");
    this.editPersonForm.controls['countryOfBirth'].setValue("");
    this.editPersonForm.controls['nationality'].setValue("");
    this.editPersonForm.controls['firstName'].setValue("");
    this.editPersonForm.controls['lastName'].setValue("");
    this.editPersonForm.controls['street'].setValue("");
    this.editPersonForm.controls['streetNumber'].setValue("");
    this.editPersonForm.controls['bus'].setValue("");
    this.editPersonForm.controls['city'].setValue("");
    this.editPersonForm.controls['postalCode'].setValue("");
    this.editPersonForm.controls['country'].setValue("");    
    this.editPersonForm.controls['emailAddress'].setValue("");
    // this.languageString = data.person.language.name;

    this.editPersonForm.controls['iban'].setValue("");
    this.editPersonForm.controls['bic'].setValue("");

    this.editPersonForm.controls['mobileNumber'].setValue("");
    this.editPersonForm.controls['telephoneNumber'].setValue("");
  }

  loadPersonData(response){

    console.log(response.body);
    let data = response.body;

    if(data.person !== null){

      let stringData:string = data.person.dateOfBirth.toString();
      let dobArray = stringData.split('T');
      let dobString:string = dobArray[0];
      this.loadDOBData(dobString);

      let genderObject = new Gender();

      if(data.person.gender !== null){
            genderObject.genderId = data.person.gender.genderId;
            genderObject.title = data.person.gender.title;

            this.selectedGenderIndex = genderObject.genderId;
      }

      this.editPersonForm.controls['placeOfBirth'].setValue(data.person.placeOfBirth);    
      this.editPersonForm.controls['countryOfBirth'].setValue(data.person.countryOfBirth);
      this.editPersonForm.controls['nationality'].setValue(data.person.nationality);
      this.editPersonForm.controls['firstName'].setValue(data.person.firstName);
      this.editPersonForm.controls['lastName'].setValue(data.person.lastName);  
    }

    if(data.person.address !== null)
    {
      this.editPersonForm.controls['street'].setValue(data.person.address.street);
      this.editPersonForm.controls['streetNumber'].setValue(data.person.address.streetNumber);
      this.editPersonForm.controls['bus'].setValue(data.person.address.bus);
      this.editPersonForm.controls['city'].setValue(data.person.address.city);
      this.editPersonForm.controls['postalCode'].setValue(data.person.address.postalCode);
      this.editPersonForm.controls['country'].setValue(data.person.address.country);    
      this.editPersonForm.controls['emailAddress'].setValue(data.person.email.emailAddress);  
    }

    // this.languageString = data.person.language.name;

    if(data.person.bankAccount !== null) {
      this.editPersonForm.controls['iban'].setValue(data.person.bankAccount.iban);
      this.editPersonForm.controls['bic'].setValue(data.person.bankAccount.bic);  
    }

    if(data.person.mobile !== null) {
      this.editPersonForm.controls['mobileNumber'].setValue(data.person.mobile.number);
    }

    if(data.person.phone !== null){
      this.editPersonForm.controls['telephoneNumber'].setValue(data.person.phone.number);
    }

  }


  setPersonVatNumber() {

    let ssid:number = this.editPersonForm.get('socialSecurityNumber').value;

    this.createPersonObjects();
    this.getPersonbySSIDVatNumber();
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
}
