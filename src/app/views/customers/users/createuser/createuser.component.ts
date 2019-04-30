// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Output, Input, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User, Language, EmailAddress, PhoneNumber, DpsUser, LoginToken, DpsPerson } from '../../../../shared/models';
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
  public currentUser: DpsUser;
  public oldCurrentUser: any;
  public languageString;
  public languageStringNew;
  public languageShortName;
  public languageShortNameNew;
  public isNewUser = false;
  // public loginuserdetails: DpsUser = JSON.parse(this.setDummyDpsUserData());
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  @Output()
  showmsg = new EventEmitter<object>();

  UserForm: FormGroup;
  dpsUser: DpsUser;
  user: User;
  contactsEmail: EmailAddress;
  phoneNumber: PhoneNumber;
  mobileNumber: PhoneNumber;
  language: Language;

  constructor(
    private formBuilder: FormBuilder, private userService: UsersService,
    public dialogRef: MatDialogRef<CreateuserComponent>, @Inject(MAT_DIALOG_DATA) public userData: DpsUser) {
    this.currentUser = userData;
  }

  /*
  ngDoCheck() {
    console.log('ngDoCheck CreateuserComponent');
    console.log(this.currentUser);
    if (this.oldCurrentUser !== this.currentUser) {
      this.oldCurrentUser = this.currentUser;
      this.loadUserToEdit();
    }
  }
  */

  ngOnInit() {
    this.currentUser = this.userData;
    console.log('Current User :: ', this.currentUser);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.UserForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      usertype: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      telephone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      emailaddress: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])
    });

    this.loadUserToEdit();
    this.createObjects();  // check validations
  }

  loadUserToEdit() {
    try {
      console.log('this.currentUser.user :: ', this.currentUser.user);
      if (this.currentUser.user !== null) {
        this.UserForm.controls.firstname.setValue(this.currentUser.user.firstName);
        this.UserForm.controls.lastname.setValue(this.currentUser.user.lastName);
        this.UserForm.controls.emailaddress.setValue(this.currentUser.user.email.emailAddress);
        this.UserForm.controls.usertype.setValue(this.currentUser.userRole);
        this.UserForm.controls.mobile.setValue(this.currentUser.user.mobile.number);
        this.UserForm.controls.telephone.setValue(this.currentUser.user.phone.number);
        this.addDefaultLaguage();
        this.languageString = this.currentUser.user.language.name;
        this.languageShortName = this.currentUser.user.language.shortName;
      } else {
        this.isNewUser = true;
      }
    } catch (e) {
      alert(e.message);
    }
  }

  ShowMessage(msg, action) {
    this.showmsg.emit({ MSG: msg, Action: action });
  }

  addDefaultLaguage() {
    if (this.currentUser.user.language === null) {
      this.currentUser.user.language = new Language();
    }
    if (this.currentUser.user.language.name === undefined || this.currentUser.user.language.name === null
      || this.currentUser.user.language.name === '') {
      this.currentUser.user.language.name = 'Dutch';
      this.currentUser.user.language.shortName = 'nl';
    }
  }

  receiveMessageLanguage($event: { name: any; shortName: any; }) {
    this.languageStringNew = $event.name;
    this.languageShortNameNew = $event.shortName;

    this.createObjects();
  }

  createObjects() {
    console.log('createObjects :: ', this.UserForm);
    this.currentUser.user.userName = this.UserForm.get('emailaddress').value;
    this.currentUser.user.firstName = this.UserForm.get('firstname').value;
    this.currentUser.user.lastName = this.UserForm.get('lastname').value;
    this.currentUser.user.email.emailAddress = this.UserForm.get('emailaddress').value;
    this.currentUser.user.phone.number = this.UserForm.get('telephone').value;
    this.currentUser.user.mobile.number = this.UserForm.get('mobile').value;
    this.currentUser.user.language.name = this.languageStringNew;
    this.currentUser.user.language.shortName = this.languageShortNameNew;
    this.currentUser.userRole = this.UserForm.get('usertype').value;
  }

  public updateData() {
    this.createObjects();
  }

  public getJSONObject() {
    if (this.currentUser !== undefined && this.currentUser !== null) {
      return this.currentUser;
    }
  }

  onSaveUserClick() {
    this.createObjects();
    console.log('data ::', this.currentUser);
    if (this.UserForm.valid) {
      if (this.currentUser !== undefined && this.currentUser !== null) {
        if (this.isNewUser) {
          // 0 && this.currentUser.id !== undefined && this.currentUser.id !==
          console.log('Update User');
          // Update User
          this.userService.updateUser(this.currentUser).subscribe(res => {
            console.log('Update User Response :: ', res);
            this.dialogRef.close(this.currentUser);
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
          console.log('Create User');
          this.userService.createUser(this.currentUser).subscribe(res => {
            console.log('  User Response :: ', res.body);
            this.currentUser = res.body;
            this.dialogRef.close(this.currentUser);
          },
            (err: HttpErrorResponse) => {
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
    } else {
      console.log('Form is Not Vaild');
    }
  }
}




