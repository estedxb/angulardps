// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User, Language, EmailAddress, PhoneNumber, DpsUser, LoginToken } from '../../../../shared/models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UsersService } from 'src/app/shared/users.service';
import { element } from '@angular/core/src/render3';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./../../customers.component.css']
})
export class CreateuserComponent implements OnInit {
  public languageString;
  public languageShortName;
  // public loginuserdetails: DpsUser = JSON.parse(this.setDummyDpsUserData());
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;

  // @Input('parentData') public username: string;

  // @Input() public UserFormData: any;
  UserData: any;
  oldCurrentUser: any;
  UserForm: FormGroup;
  dpsUser: DpsUser;
  user: User;
  contactsEmail: EmailAddress;
  phoneNumber: PhoneNumber;
  mobileNumber: PhoneNumber;
  language: Language;

  constructor(
    private formBuilder: FormBuilder, private userService: UsersService,
    public dialogRef: MatDialogRef<CreateuserComponent>, @Inject(MAT_DIALOG_DATA) public currentUser: DpsUser) {
  }

  ngDoCheck() {

    console.log('CTFormData');
    console.log(this.currentUser);

    if (this.oldCurrentUser !== this.currentUser) {
      this.oldCurrentUser = this.currentUser;
      this.loadUserToEdit();

    }

  }


  ngOnInit() {
    console.log('Current User :: ', this.currentUser);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.UserForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      usertype: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      telephone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      language: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      emailaddress: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])

    });
    this.loadUserToEdit();
    this.createObjects();  // check validations
  }

  loadUserToEdit() {
    this.UserForm.controls.firstname.setValue(this.currentUser.user.firstName);
    this.UserForm.controls.lastname.setValue(this.currentUser.user.lastName);
    this.UserForm.controls.emailaddress.setValue(this.currentUser.user.email.emailAddress);
    this.UserForm.controls.usertype.setValue(this.currentUser.userRole);
    this.UserForm.controls.mobile.setValue(this.currentUser.user.mobile.number);
    this.UserForm.controls.telephone.setValue(this.currentUser.user.phone.number);
    this.languageString = 'English';
  }

  receiveMessageLanguage($event: { name: any; shortName: any; }) {
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

    this.language.name = this.languageString;
    this.language.shortName = this.languageShortName;

    this.user.language = this.language;

    // dpsuser object
    this.dpsUser.customerVatNumber = this.VatNumber;
    this.dpsUser.user = this.user;
    this.dpsUser.userRole = this.UserForm.get('usertype').value;
    this.dpsUser.isEnabled = true;
    this.dpsUser.isArchived = false;

    this.setJSONObject();

  }

  setJSONObject() {
    this.UserData = {
      customerVatNumber: this.dpsUser.customerVatNumber,
      user: this.dpsUser.user,
      userRole: this.dpsUser.userRole,
      isEnabled: this.dpsUser.isEnabled,
      isArchived: this.dpsUser.isArchived
    };

  }

  public updateData() {
    this.createObjects();
  }

  public getJSONObject() {
    if (this.UserData !== undefined && this.UserData !== null) {
      return this.UserData;
    }
  }

  onSaveUserClick() {

    this.updateData();

    console.log('UserData=' + this.UserData);
    console.log(this.UserData);
    if (this.UserData !== undefined && this.UserData !== null) {
      console.log(this.UserData);
      // check if username has value
      // if username has value ==> Update User
      // if username is null ==> Create User
      if (this.username !== undefined && this.username !== null) {
        // Update User
        this.userService.updateUser(this.UserData).subscribe(res => {
          console.log('response :: ');
          console.log(res);
        },
          (err: HttpErrorResponse) => {

            console.log('Error :: ');
            console.log(err);
            if (err.error instanceof Error) {
              console.log('Error occured=' + err.error.message);
            } else {
              console.log('response code=' + err.status);
              console.log('response body=' + err.error);
            }
          }
        );

      } else {
        // Create User
        this.userService.createUser(this.UserData).subscribe(res => {
          console.log('response :: ');
          console.log(res);
        },
          (err: HttpErrorResponse) => {

            console.log('Error :: ');
            console.log(err);
            if (err.error instanceof Error) {
              console.log('Error occured=' + err.error.message);
            } else {
              console.log('response code=' + err.status);
              console.log('response body=' + err.error);
            }
          }
        );
      }
    }
  }
}




