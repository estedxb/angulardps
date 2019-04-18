import { Component, OnInit } from '@angular/core';
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
  
  CTdata:any;
  CTForm: FormGroup;

  contactsEmail:EmailAddress;
  phoneNumber: PhoneNumber;
  mobileNumber: PhoneNumber;
  language: Language;
  contact: Contact;

  constructor(private formBuilder:FormBuilder) {
          
  }

  ngOnInit() {

    this.CTForm = new FormGroup({
      firstname: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      alsCheck:new FormControl(),
      language:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      position:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      mobile:new FormControl('',Validators.required),
      telephone:new FormControl('',Validators.required),
      emailaddress:new FormControl('',[Validators.required,Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")])
    });

    this.checkValidations();  //check validations
  }

  checkValidations() {

   this.phoneNumber = new PhoneNumber();
   this.mobileNumber = new PhoneNumber();

   this.contactsEmail = new EmailAddress();
   this.language = new Language();
   this.contact = new Contact();

   this.phoneNumber.number = this.CTForm.get('telephone').value;
   this.mobileNumber.number = this.CTForm.get('mobile').value;
   this.contactsEmail.emailAddress = this.CTForm.get('emailaddress').value;

   this.language.name = this.CTForm.get('language').value;
   this.language.shortName = this.CTForm.get('language').value;

   this.contact.firstName = this.CTForm.get('firstname').value;
   this.contact.lastName = this.CTForm.get('lastname').value;
   this.contact.email = this.contactsEmail;
   this.contact.phoneNumber = this.phoneNumber;
   this.contact.mobile = this.mobileNumber;
   this.contact.postion = this.CTForm.get('position').value;
   this.contact.language = this.language;

   this.setJSONObject();

  }

  setJSONObject() {

   this.CTdata =  {
          "firstName": this.contact.firstName,
          "lastName": this.contact.lastName,
          "postion": this.contact.postion,
          "email": this.contact.email,
          "mobile": this.contact.mobile,
          "phoneNumber": this.contact.phoneNumber,
          "language": this.contact.language
   };

  }

  getJSONObject() {
    if(this.CTdata !== undefined && this.CTdata !== null)
        return this.CTdata;
  }

}