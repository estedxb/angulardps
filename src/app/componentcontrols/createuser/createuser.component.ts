// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {  User, Language, EmailAddress,PhoneNumber, DpsUser, LoginToken } from '../../shared/models';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { UserService } from 'src/app/shared/user.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit {
  
  public languageString;
  public languageShortName;
 // public VatNumber : string ='test1';
  //public username: string;

  public loginuserdetails : LoginToken = JSON.parse(this.setDummyDpsUserData());
  public VatNumber = this.loginuserdetails.dpsUser.customerVatNumber;
  //public username = this.loginuserdetails.dpsUser.user.userName;
  @Input('parentData') public username;

  setDummyDpsUserData(): string {
    return `{
      "accessToken": "Login-Access-Token",      
      "dpsUser": {     
        "customerVatNumber": "ABC123456",     
        "user": {     
          "userName": "admin",
          "firstName": "Balaji",     
          "lastName": "Subbiah",     
          "email": { "emailAddress": "balaji_sp@yahoo.com" },     
          "mobile": { "number": "+971505642721" },     
          "phone": { "number": "+971505642721" }     
        },     
        "userRole": "Admin",     
        "isEnabled": true,     
        "isArchived": false     
      }  
    }`;
  }

  @Input() public UserFormData;
  UserData:any;
  UserForm: FormGroup;
  dpsUser: DpsUser;
  user: User; 
  contactsEmail:EmailAddress;
  phoneNumber: PhoneNumber;
  mobileNumber: PhoneNumber;
  language: Language;

  constructor(private formBuilder:FormBuilder, private userService:UserService) {
    
  }

  ngOnInit() {
    console.log('Current username : ' + this.username);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.UserForm = new FormGroup({
      firstname: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),   
      usertype:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      mobile:new FormControl('',[Validators.required,Validators.pattern('^[0-9]+')]),
      telephone:new FormControl('',[Validators.required,Validators.pattern('^[0-9]+')]),
      language:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
      emailaddress:new FormControl('',[Validators.required,Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")])
    
    });
    this.createObjects();  //check validations
    this.loadUserToEdit(this.VatNumber);

  }

  loadUserToEdit(VatNumber: string) {  
    this.userService.getUsersByVatNumber(VatNumber).subscribe(response=> {       
        response.forEach((element) => {
          var object = element.user;
          if(object.userName ===this.username)
          {
            this.UserForm.controls['firstname'].setValue(object.firstName);
            this.UserForm.controls['lastname'].setValue(object.lastName);  
            this.UserForm.controls['usertype'].setValue(element.userRole);  
            this.UserForm.controls['usertype'].setValue(object.userName);  
            this.UserForm.controls['mobile'].setValue(object.mobile.number);  
            this.UserForm.controls['telephone'].setValue(object.phone.number);  
            this.UserForm.controls['emailaddress'].setValue(object.email.emailAddress);           
          }
        })
    });    
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
    this.user = new User();
    this.dpsUser = new DpsUser();
    // user object
    this.user.userName = this.UserForm.get('emailaddress').value;
    this.user.firstName = this.UserForm.get('firstname').value;
    this.user.lastName = this.UserForm.get('lastname').value;

    this.contactsEmail.emailAddress = this.UserForm.get('emailaddress').value; 
    this.phoneNumber.number = this.UserForm.get('telephone').value;
    this.mobileNumber.number = this.UserForm.get('mobile').value;

    this.user.email = this.contactsEmail;
    this.user.mobile = this.phoneNumber;
    this.user.phone = this.mobileNumber;
    
    // dpsuser object
    this.dpsUser.customerVatNumber =  this.UserForm.get('firstname').value;
    this.dpsUser.user = this.user;
    this.dpsUser.userRole = this.UserForm.get('usertype').value;
    this.dpsUser.isEnabled = true;
    this.dpsUser.isArchived = false;

   this.setJSONObject();

  }

  setJSONObject() {
   this.UserData =  {     
    "customerVatNumber": this.dpsUser.customerVatNumber,
    "user": this.dpsUser.user,
    "userRole": this.dpsUser.userRole,
    "isEnabled": this.dpsUser.isEnabled,
    "isArchived": this.dpsUser.isArchived                 
   };

  }

  public updateData() {
     this.createObjects();    
  }  

  public getJSONObject() {
    if(this.UserData !== undefined && this.UserData !== null)
        return this.UserData;
  }

  onSaveUserClick() {
    
    console.log("UserData="+this.UserData);
    console.log(this.UserData);
   if(this.UserData !== undefined && this.UserData !== null)
     {
      console.log(this.UserData); 
       //check if username has value 
       //if username has value ==> Update User
       //if username is null ==> Create User
       if(this.username!== undefined && this.UserData !== null)
       {
         // Update User
         this.userService.updateUser(this.UserData).subscribe(res =>{
          console.log("response :: " );
          console.log(res);
        },
         (err:HttpErrorResponse) => {
           
          console.log("Error :: " );
          console.log(err);
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
       else 
       {
         // Create User 
        this.userService.createUser(this.UserData).subscribe(res =>{
          console.log("response :: " );
          console.log(res);
        },
         (err:HttpErrorResponse) => {
           
          console.log("Error :: " );
          console.log(err);
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
  
      }

    }

  }




