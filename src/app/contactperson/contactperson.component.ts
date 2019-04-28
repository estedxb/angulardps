import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck, 
  PhoneNumber, Address,StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance, 
  InvoiceSettings, Language, Contact } from '../shared/models';

@Component({
  selector: 'app-contactperson',
  templateUrl: './contactperson.component.html',
  styleUrls: ['./contactperson.component.css']
})

export class ContactpersonComponent implements OnInit {
  
  public languageString;
  public languageShortName;

  @Input() public CTFormData;
  @Output() public childEvent = new EventEmitter();

  public oldData:any = {};

  CTdata:any;
  CTForm: FormGroup;

  contactsEmail:EmailAddress;
  phoneNumber: PhoneNumber;
  mobileNumber: PhoneNumber;
  language: Language;  
  contact: Contact;
  alsCheck: boolean;

  constructor(private formBuilder:FormBuilder) {
          
  }

  
  ngDoCheck(){

    console.log("CTFormData");
    console.log(this.CTFormData);

    if(this.oldData !== this.CTFormData)
    {
      if(this.CTFormData !== undefined)
      {
        if(this.CTFormData.data !== "" && this.CTFormData.page==="edit")
        {
          this.oldData = this.CTFormData;
          this.loadEditDetails(this.CTFormData.data);

          this.createObjects();
          // this.CTdata =  {
          //   "contact": this.contact,
          //   "formValid": this.validity(),
          //   "activateContactAsUser":this.alsCheck
          // };
  
           //this.childEvent.emit(this.CTdata);
  
        }
      }
  
    }

  }

  ngOnInit() {

    this.CTForm = new FormGroup({
      firstname: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      alsCheck:new FormControl(),
      language:new FormControl(''),
      position:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      mobile:new FormControl('',[Validators.required]),//Validators.pattern("^/[0-9]{2}[\.\\- ]{0,1}[0-9]{2}[\.\\- ]{0,1}[0-9]{2}[\.\\- ]{0,1}[0-9]{3}[\.\\- ]{0,1}[0-9]{2}/$") 
      telephone:new FormControl(''),
      emailaddress:new FormControl('',[Validators.required,Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")])
    });

    this.alsCheck  = false;
    this.createObjects();  //check validations
  }

  receiveMessageLanguage($event) {

    this.languageString = $event.name;
    this.languageShortName = $event.shortName;

    this.createObjects();

  }

  createObjects() {

   this.phoneNumber = new PhoneNumber();
   this.mobileNumber = new PhoneNumber();

   this.contactsEmail = new EmailAddress();
   this.language = new Language();
   this.contact = new Contact();

   this.phoneNumber.number = this.CTForm.get('telephone').value;
   this.mobileNumber.number = this.CTForm.get('mobile').value;
   this.contactsEmail.emailAddress = this.CTForm.get('emailaddress').value;

   this.language.name = this.languageString;
   this.language.shortName = this.languageShortName;

   this.contact.firstName = this.CTForm.get('firstname').value;
   this.contact.lastName = this.CTForm.get('lastname').value;
   this.contact.email = this.contactsEmail;
   this.contact.phoneNumber = this.phoneNumber;
   this.contact.mobile = this.mobileNumber;
   this.contact.postion = this.CTForm.get('position').value;
   this.contact.language = this.language;

   console.log(this.language);

   this.setJSONObject();
  }

  loadEditDetails(contactPerson:any){

    console.log(contactPerson);

    this.CTForm.controls['firstname'].setValue(contactPerson.contact.firstName);
    this.CTForm.controls['lastname'].setValue(contactPerson.contact.lastName);
    this.CTForm.controls['emailaddress'].setValue(contactPerson.contact.email.emailAddress);
    this.CTForm.controls['position'].setValue(contactPerson.contact.postion);
    this.CTForm.controls['mobile'].setValue(contactPerson.contact.mobile.number);
    this.CTForm.controls['telephone'].setValue(contactPerson.contact.phoneNumber.number);
    
  }

  changeAls($event){    
    this.alsCheck = $event;    
  }

  setJSONObject() {
    
              // "firstName": this.contact.firstName,
          // "lastName": this.contact.lastName,
          // "postion": this.contact.postion,
          // "email": this.contact.email,
          // "mobile": this.contact.mobile,
          // "phoneNumber": this.contact.phoneNumber,
          // "language": this.contact.language,

   this.CTdata =  {

          "contact": this.contact,
          "formValid": this.validity(),
          "activateContactAsUser":this.alsCheck
   };

     this.childEvent.emit(this.CTdata);

  }

  validity() {

    this.checkValidations();

      if(this.CTForm.valid === true && !this.emptyData())
        return true;
       
        return false;
  }

  checkValidations() {

    console.log(this.CTForm.get('firstname').valid);
    console.log(this.CTForm.get('lastname').valid);
    console.log(this.CTForm.get('position').valid);
    console.log(this.CTForm.get('emailaddress').valid);
    console.log(this.CTForm.get('mobile').valid);

  }

  emptyData() {

    if(this.CTForm.get('firstname').value === "")
      return true;
    if(this.CTForm.get('lastname').value === "")
      return true;
    if(this.CTForm.get('position').value === "")
      return true;
    if(this.CTForm.get('emailaddress').value === "")
    return true;
    if(this.CTForm.get('mobile').value === "")
    return true;
    
    return false;

  }

  public updateData() {
    this.createObjects();
    //this.childEvent.emit(this.CTdata);
  }
  

  public getJSONObject() {
    if(this.CTdata !== undefined && this.CTdata !== null)
        return this.CTdata;
  }

}