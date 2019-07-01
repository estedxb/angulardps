// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Output, Input, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User, Language, EmailAddress, PhoneNumber, DpsUser, LoginToken, DpsPerson } from '../../../../shared/models';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UsersService } from 'src/app/shared/users.service';
import { element } from '@angular/core/src/render3';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoggingService } from '../../../../shared/logging.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public VatNumber = this.dpsLoginToken.customerVatNumber;
  @Output() showmsg = new EventEmitter<object>();

  UserForm: FormGroup;
  user: User;
  contactsEmail: EmailAddress;
  phoneNumber: PhoneNumber;
  mobileNumber: PhoneNumber;
  language: Language;

  constructor(
    private formBuilder: FormBuilder, private userService: UsersService,
    private logger: LoggingService,
    // private spinner: NgxUiLoaderService,
    public dialogRef: MatDialogRef<CreateuserComponent>, @Inject(MAT_DIALOG_DATA) public userData: DpsUser) {
    this.currentUser = userData;
  }

  /*
  ngDoCheck() {
    this.logger.log('ngDoCheck CreateuserComponent');
    this.logger.log(this.currentUser);
    if (this.oldCurrentUser !== this.currentUser) {
      this.oldCurrentUser = this.currentUser;
      this.loadUserToEdit();
    }
  }
  */

  ngOnInit() {
    this.logger.log('Current User :: ', this.currentUser);
    this.logger.log('Current VatNumber : ' + this.VatNumber);
    this.UserForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      usertype: new FormControl(''),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      telephone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      emailaddress: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])
    });
    this.loadUserToEdit();
  }

  loadUserToEdit() {
    this.logger.log('this.currentUser.user :: ', this.currentUser.user);
    if (this.currentUser.user !== null) {
      if (this.currentUser.user.firstName !== null && this.currentUser.user.firstName !== '') {
        this.UserForm.controls.firstname.setValue(this.currentUser.user.firstName);
        this.UserForm.controls.lastname.setValue(this.currentUser.user.lastName);
        this.UserForm.controls.emailaddress.setValue(this.currentUser.user.email.emailAddress);
        this.UserForm.controls.usertype.setValue(this.currentUser.userRole);
        this.UserForm.controls.mobile.setValue(this.currentUser.user.mobile.number);
        this.UserForm.controls.telephone.setValue(this.currentUser.user.phone.number);
        this.addDefaultLaguage();
        this.languageString = this.currentUser.user.language.name;
        this.languageShortName = this.currentUser.user.language.shortName;
        this.isNewUser = false;
      } else {
        this.isNewUser = true;
      }
    } else {
      this.isNewUser = true;
    }
    this.logger.log('isNewUser :: ' + this.isNewUser);
  }

  receiveMessageLanguage($event: { name: any; shortName: any; }) {
    this.languageStringNew = $event.name;
    this.languageShortNameNew = $event.shortName;

    this.createObjects();
  }

  ShowMessage(msg, action) { this.showmsg.emit({ MSG: msg, Action: action }); }

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

  public updateData() { this.createObjects(); }

  createObjects() {
    this.logger.log('createObjects :: ', this.UserForm);
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

  public getJSONObject() {
    if (this.currentUser !== undefined && this.currentUser !== null) {
      return this.currentUser;
    }
  }

  onSaveUserClick() {
    this.createObjects();
    this.logger.log('data ::', this.currentUser);
    if (this.UserForm.valid) {
      if (this.currentUser !== undefined && this.currentUser !== null) {
        if (!this.isNewUser) {
          this.logger.log('Update User');
          // Update User
          this.userService.updateUser(this.currentUser).subscribe(res => {
            this.logger.log('Update User Response :: ', res);
            this.dialogRef.close(this.currentUser);
          },
            (err: HttpErrorResponse) => {
              this.logger.log('Error :: ');
              this.logger.log(err);
              if (err.error instanceof Error) {
                this.logger.log('Error occured=' + err.error.message);
              } else {
                this.logger.log('response code=' + err.status);
                this.logger.log('response body=' + err.error);
              }
            }
          );
        } else {
          this.logger.log('Create User');
          this.userService.createUser(this.currentUser).subscribe(res => {
            this.logger.log('  User Response :: ', res.body);
            this.currentUser = res.body;
            this.dialogRef.close(this.currentUser);
          },
            (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
                this.logger.log('Error occured=' + err.error.message);
              } else {
                this.logger.log('response code=' + err.status);
                this.logger.log('response body=' + err.error);
              }
            }
          );
        }
      }
    } else {
      this.logger.log('Form is Not Vaild');
    }
  }
}




