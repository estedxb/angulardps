import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  DpsPerson, Person, SocialSecurityNumber, Gender, BankAccount, Renumeration, MedicalAttestation, Language, DpsPostion, _Position,
  ConstructionProfile, StudentAtWorkProfile, Documents, DriverProfilesItem, Address,
  EmailAddress, PhoneNumber, Statute, VcaCertification
} from '../../../shared/models';
import { PersonService } from 'src/app/shared/person.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { DataService } from 'src/app/shared/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-editperson',
  templateUrl: './editperson.component.html',
  styleUrls: ['./../person.component.css']
})
export class EditPersonComponent implements OnInit {

  @Input() public SocialSecurityId: string;
  public loginuserdetails: any = JSON.parse(localStorage.getItem('dpsuser'));

  editPersonForm: FormGroup;
  editPersonForm2: FormGroup;

  public dataDropDown;
  public dropDownMonth;
  public dataDropDownGender;
  public showFormIndex = 1;
  public validSSID;

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
  public dropDownYear: Array<string>;
  public dataDropDownStatute: string[];
  public dataDropDownFunctie: string[];
  public dateofBirth;
  public SelectedIndexFunctie = 0;
  public maindatas = [];
  public datas: DpsPostion;
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

  public calendarData: string;
  public countryString: string;
  public languageString:string;

  public message;
  public bbic:any;
  public bban:any;
  public iban:any;

  constructor(public http:HttpClient,private personsService: PersonService, private data: DataService,private spinner: NgxSpinnerService) { }

  setDummyStatute() {
  }

  setDropDownYear() {
  }
  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() {
    console.log('SocialSecurityId :: ' + this.SocialSecurityId);
    this.data.currentMessage.subscribe(message => this.message = message);

    this.onPageInit();
    this.loadDOBFromSSID();
    this.createObjectsForm1();

      /** spinner starts on init */
      this.spinner.show();
 
      // setTimeout(() => {
      //     /** spinner ends after 5 seconds */
      //     this.spinner.hide();
      // }, 15000);

  }

  changeMessage() {
    console.log(this.DpsPersonObject);
    if (this.DpsPersonObject !== null) {
      const newmessage: any = {
        page: 'edit',
        data: this.DpsPersonObject
      };
      this.data.changeMessage(newmessage);
    }

  }

  onPageInit() {
    this.setDummyStatute();
    this.setDropDownYear();

    // tslint:disable-next-line: max-line-length
    this.dataDropDown = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    // tslint:disable-next-line: max-line-length
    this.dropDownMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.dataDropDownGender = ['Man', 'Vrouw'];
    this.validSSID = true;

    this.editPersonForm = new FormGroup({
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

    this.editPersonForm2 = new FormGroup({
      functie: new FormControl('', [Validators.required]),
      statute: new FormControl('', [Validators.required]),
      netExpenseAllowance: new FormControl(''),
      grossHourlyWage: new FormControl('', [Validators.required]),
      countryOnetExpenseAllowancefBirth: new FormControl('', [Validators.required]),
      extra: new FormControl('', [Validators.required]),
    });

    this.editPersonForm.controls.socialSecurityNumber.setValue(this.SocialSecurityId);
    this.editPersonForm.controls.socialSecurityNumber.disable();

    this.setPersonVatNumber();

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

  createPersonObjects() {

    this.DpsPersonObject = new DpsPerson();
    this.PersonObject = new Person();

    this.SocialSecurityNumberObject = new SocialSecurityNumber();
    this.SocialSecurityNumberObject.number = this.SocialSecurityId;
    this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

    this.DpsPersonObject.customerVatNumber = this.loginuserdetails.customerVatNumber;
    this.DpsPersonObject.person = this.PersonObject;

  }

  getPersonbySSIDVatNumber() {

    if (this.validSSID === true) {

      const customerVatNumber = this.loginuserdetails.customerVatNumber;

      this.personsService.getPersonBySSIDVatnumber(this.SocialSecurityId, customerVatNumber).subscribe(res => {
        console.log('response=' + res);
        console.log(res);
        this.loadPersonData(res);
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Error occured=' + err.error.message);
            this.loadDOBFromSSID();
          } else {
            console.log('response code=' + err.status);
            console.log('response body=' + err.error);
          }
        }
      );
    } else {
      console.log('invalid SSN format');
      this.resetPeronData();
    }
  }

  loadDOBFromSSID() {

    const ssid: string = this.SocialSecurityId;
    const dobString: string = ssid.substring(0, 8);
    const stringData = dobString.split('.');

  }

  loadDOBData(dateOfBirth: string) {

    console.log('date of birth=' + dateOfBirth);

    const dobArrayData = dateOfBirth.split('-');
    const yearString: string = dobArrayData[0];
    const monthString: string = dobArrayData[1];
    const dayString: string = dobArrayData[2];

    this.monthString = monthString;
    this.dayString = dayString;
    this.yearString = yearString;

    this.calendarData = this.monthString + '/' + this.dayString + '/' + this.yearString;

    console.log('setting calendar data=' + this.calendarData);

  }

  soapCallFetchBBAN() {

    let parser = new DOMParser();
    let xmlString = '<?xml version="1.0" encoding="utf-8"?>'
                    +'<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'
                    +'<soap12:Body><getBelgianBBAN xmlns="http://tempuri.org/">'
                    +'<Value>BE46001664436336</Value>'
                    +'</getBelgianBBAN></soap12:Body></soap12:Envelope>'
    
    let doc = parser.parseFromString(xmlString,'text/xml');
    let headers = new HttpHeaders()
          .set('Access-Control-Allow-Origin','*')
          .set('Content-Type', 'application/soap+xml');
    
    this.http.post('http://www.ibanbic.be/IBANBIC.asmx?op=getBelgianBBAN',xmlString, { headers: headers}).subscribe(data => {
            console.log("data="+data);
            this.bban = data;
            this.soapCallGetBIC();
    });
      
    }
    
      // bic from bban
soapCallGetBIC()
{
  let parser = new DOMParser();
  let xmlString = '<?xml version="1.0" encoding="utf-8"?>'
                  +'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
                  +'<soap:Body><BBANtoBIC xmlns="http://tempuri.org/">'
                  +'<Value>string</Value></BBANtoBIC></soap:Body></soap:Envelope>'
    
  let headers = new HttpHeaders()
  .set('Access-Control-Allow-Origin','*')
  .set('Content-Type', 'application/soap+xml');
                  
  this.http.post('http://www.ibanbic.be/IBANBIC.asmx?op=getBelgianBBAN',xmlString, { headers: headers}).subscribe(data => {
          console.log("data="+data);
          this.bbic = data;
  });
    
  if(this.DpsPersonObject !== null) 
  {
          if (this.DpsPersonObject.person !== null) {
            this.DpsPersonObject.person.bankAccount = new BankAccount();
            this.DpsPersonObject.person.bankAccount.iban = this.iban;
            this.DpsPersonObject.person.bankAccount.bic = this.bbic;
            this.editPersonForm.controls['bic'].setValue(this.bbic);
          }
      this.changeMessage();    
  }

}  

  setIbanNumber(value: string) {
    this.soapCallFetchBBAN();
  }

  onChangeDropDownGender($event) {

    console.log('selected index=' + $event.target.value);
    console.log('selected value=' + this.dataDropDownGender[$event.target.value]);

    if (this.DpsPersonObject !== undefined && this.DpsPersonObject !== null) {
      if (this.DpsPersonObject.person !== undefined && this.DpsPersonObject.person !== null) {
        this.DpsPersonObject.person.gender = new Gender();
        this.DpsPersonObject.person.gender.genderId = $event.target.value;
        this.DpsPersonObject.person.gender.title = this.dataDropDownGender[$event.target.value];
      }
    }

    this.changeMessage();
  }

  resetPeronData() {

    this.editPersonForm.controls.placeOfBirth.setValue('');
    this.editPersonForm.controls.countryOfBirth.setValue('');
    this.editPersonForm.controls.nationality.setValue('');
    this.editPersonForm.controls.firstName.setValue('');
    this.editPersonForm.controls.lastName.setValue('');
    this.editPersonForm.controls.street.setValue('');
    this.editPersonForm.controls.streetNumber.setValue('');
    this.editPersonForm.controls.bus.setValue('');
    this.editPersonForm.controls.city.setValue('');
    this.editPersonForm.controls.postalCode.setValue('');
    this.editPersonForm.controls.country.setValue('');
    this.editPersonForm.controls.emailAddress.setValue('');
    // this.languageString = data.person.language.name;

    this.editPersonForm.controls.iban.setValue('');
    this.editPersonForm.controls.bic.setValue('');

    this.editPersonForm.controls.mobileNumber.setValue('');
    this.editPersonForm.controls.telephoneNumber.setValue('');
  }

  loadPersonData(response) {

    console.log(response.body);
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

      this.editPersonForm.controls.placeOfBirth.setValue(data.person.placeOfBirth);
      this.editPersonForm.controls.countryOfBirth.setValue(data.person.countryOfBirth);
      this.editPersonForm.controls.nationality.setValue(data.person.nationality);
      this.editPersonForm.controls.firstName.setValue(data.person.firstName);
      this.editPersonForm.controls.lastName.setValue(data.person.lastName);
    }

    if (data.person.address !== null) {
      this.editPersonForm.controls.street.setValue(data.person.address.street);
      this.editPersonForm.controls.streetNumber.setValue(data.person.address.streetNumber);
      this.editPersonForm.controls.bus.setValue(data.person.address.bus);
      this.editPersonForm.controls.city.setValue(data.person.address.city);
      this.editPersonForm.controls.postalCode.setValue(data.person.address.postalCode);
      this.editPersonForm.controls.country.setValue(data.person.address.country);
      this.editPersonForm.controls.emailAddress.setValue(data.person.email.emailAddress);
    }

    if (data.person.bankAccount !== null) {
      this.editPersonForm.controls.iban.setValue(data.person.bankAccount.iban);
      this.editPersonForm.controls.bic.setValue(data.person.bankAccount.bic);
    }

    if (data.person.mobile !== null) {
      this.editPersonForm.controls.mobileNumber.setValue(data.person.mobile.number);
    }

    if (data.person.phone !== null) {
      this.editPersonForm.controls.telephoneNumber.setValue(data.person.phone.number);
    }

    this.countryString = data.person.address.country;
    this.languageString = data.person.language.name;

    this.DpsPersonObject = data;

    this.changeMessage();

  }

  receiveDOBDate($event) {
    console.log('recevied date=');
    console.log($event);

    this.monthString = $event.monthString;
    this.dayString = $event.dayString;
    this.yearString = $event.yearString;

    let monthInNumber = -1;
    let counter = 0;

    console.log('monthString=' + this.monthString);

    this.dropDownMonth.forEach(element => {

      console.log('month=' + element);
      if (element === this.monthString) {
        monthInNumber = counter;
      }

      counter++;
    });

    this.DpsPersonObject.person.dateOfBirth = (monthInNumber + 1) + '/' + this.dayString + '/' + this.yearString;

    this.changeMessage();

  }

  onCountryReceive($event) {

    console.log('Received Country');
    console.log('country=' + $event.countryName);
    console.log('countryName=' + $event.countryCode);

    if (this.DpsPersonObject.person.address !== null) {
      this.DpsPersonObject.person.address.country = $event.countryName;
      this.DpsPersonObject.person.address.countryCode = $event.countryCode;
    }

    this.changeMessage();

  }

  onLanguageReceive($event) {

    console.log('Received Language');
    console.log('name=' + $event.name);
    console.log('short name=' + $event.shortName);

    if (this.DpsPersonObject.person.language === null) {
      this.DpsPersonObject.person.language = new Language();
      this.DpsPersonObject.person.language.name = $event.name;
      this.DpsPersonObject.person.language.shortName = $event.shortName;
    } else {
      this.DpsPersonObject.person.language.name = $event.name;
      this.DpsPersonObject.person.language.shortName = $event.shortName;
    }

    this.changeMessage();

  }

  setPersonVatNumber() {

    console.log('calling set person vat number method');

    this.createPersonObjects();
    this.getPersonbySSIDVatNumber();
    this.createObjectsForm1();

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

  updateMobileNumber(value:string){
    this.DpsPersonObject.person.mobile.number = value;
    this.changeMessage();
  }

  updatePostalCode(value:string){
    this.DpsPersonObject.person.address.postalCode = value;
    this.changeMessage();
  }

  updateCity(value:string){
    this.DpsPersonObject.person.address.city = value;
    this.changeMessage();
  }

  updateBus(value:string){
    this.DpsPersonObject.person.address.bus = value;
    this.changeMessage();
  }

  updateStreetNumber(value:string) {
    this.DpsPersonObject.person.address.streetNumber = value;
    this.changeMessage();
  }

  updateStreet(value:string) {
    this.DpsPersonObject.person.address.street = value;
    this.changeMessage();
  }

  updateFirstName(value:string) {
    this.DpsPersonObject.person.firstName = value;
    this.changeMessage();
  }

  updateLastName(value:string) {
    this.DpsPersonObject.person.lastName = value;
    this.changeMessage();
  }

  updateEmailAddress(value:string) {
    this.DpsPersonObject.person.email.emailAddress = value;
    this.changeMessage();
  }

  updateTelephoneNumber(value:string) {
    this.DpsPersonObject.person.phone.number = value;
    this.changeMessage();
  }

  updateNationality(value:string){
    this.DpsPersonObject.person.nationality = value;
    this.changeMessage();
  }

  updatePOB(value:string){
    this.DpsPersonObject.person.placeOfBirth = value;
    this.changeMessage();
  }

  updateCOB(value:string){
    this.DpsPersonObject.person.countryOfBirth = value;
    this.changeMessage();
  }

  updateIban(value:string){
    this.DpsPersonObject.person.bankAccount.iban = value;
    this.changeMessage();
  }

  updateBIC(value:string){
    this.DpsPersonObject.person.bankAccount.bic = value;
    this.changeMessage();
  }

  updatetravelMode(value:string){
    this.DpsPersonObject.person.travelMode = value;
    this.changeMessage();
  }

  createObjectsForm1() {

    console.log('create objects form1 called');

    this.DpsPersonObject = new DpsPerson();
    this.PersonObject = new Person();

    this.SocialSecurityNumberObject = new SocialSecurityNumber();
    this.SocialSecurityNumberObject.number = this.SocialSecurityId;
    this.PersonObject.socialSecurityNumber = this.SocialSecurityNumberObject;

    this.DpsPersonObject.customerVatNumber = this.loginuserdetails.customerVatNumber;
    this.DpsPersonObject.person = this.PersonObject;

    this.DpsPersonObject.person.socialSecurityNumber = this.PersonObject.socialSecurityNumber;
    this.DpsPersonObject.person.placeOfBirth = this.editPersonForm.get('placeOfBirth').value;
    this.DpsPersonObject.person.countryOfBirth = this.editPersonForm.get('countryOfBirth').value;
    this.DpsPersonObject.person.nationality = this.editPersonForm.get('nationality').value;

    this.DpsPersonObject.person.gender = new Gender();
    this.DpsPersonObject.person.gender.genderId = 0;
    this.DpsPersonObject.person.gender.title = 'Male';

    this.DpsPersonObject.person.firstName = this.editPersonForm.get('firstName').value;
    this.DpsPersonObject.person.lastName = this.editPersonForm.get('lastName').value;

    this.DpsPersonObject.person.address = new Address();
    this.DpsPersonObject.person.address.street = this.editPersonForm.get('street').value;
    this.DpsPersonObject.person.address.streetNumber = this.editPersonForm.get('streetNumber').value;
    this.DpsPersonObject.person.address.bus = this.editPersonForm.get('bus').value;
    this.DpsPersonObject.person.address.city = this.editPersonForm.get('city').value;
    this.DpsPersonObject.person.address.postalCode = this.editPersonForm.get('postalCode').value;
    this.DpsPersonObject.person.address.country = 'New country';
    this.DpsPersonObject.person.address.countryCode = 'NX';

    this.DpsPersonObject.person.email = new EmailAddress();
    this.DpsPersonObject.person.email.emailAddress = this.editPersonForm.get('emailAddress').value;

    this.DpsPersonObject.person.mobile = new PhoneNumber();
    this.DpsPersonObject.person.mobile.number = this.editPersonForm.get('mobileNumber').value;

    this.DpsPersonObject.person.phone = new PhoneNumber();
    this.DpsPersonObject.person.phone.number = this.editPersonForm.get('telephoneNumber').value;

    this.DpsPersonObject.person.dateOfBirth = this.monthString + '/' + this.dayString + '/' + this.yearString;

    this.DpsPersonObject.person.language = new Language();
    this.DpsPersonObject.person.language.name = '';
    this.DpsPersonObject.person.language.shortName = '';

    this.DpsPersonObject.person.bankAccount = new BankAccount();
    this.DpsPersonObject.person.bankAccount.iban = this.editPersonForm.get('iban').value;
    this.DpsPersonObject.person.bankAccount.bic = this.editPersonForm.get('bic').value;

    this.DpsPersonObject.person.travelMode = this.editPersonForm.get('travelMode').value;
    this.DpsPersonObject.person.status = '';

    this.DpsPersonObject.statute = new Statute();
    this.DpsPersonObject.statute.name = '';
    this.DpsPersonObject.statute.type = '';

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

    // this.DpsPersonObject.constructionProfile = new ConstructionProfile();
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

    this.DpsPersonObject.isEnabled = false;
    this.DpsPersonObject.isArchived = false;

    this.changeMessage();

  }

}
