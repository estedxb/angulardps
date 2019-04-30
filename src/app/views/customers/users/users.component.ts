import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import {
  MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef, MAT_DIALOG_DATA
} from '@angular/material';
import { LoginToken, DpsUser, User, EmailAddress, PhoneNumber, Language } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from '../../../shared/users.service';
import { CreateuserComponent } from './createuser/createuser.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./../customers.component.css']
})
export class UsersComponent implements OnInit {
  public maindatas = [];
  public data: DpsUser;
  public user: User;
  public email: EmailAddress;
  public mobileNumber: PhoneNumber;
  public phoneNumber: PhoneNumber;
  public errorMsg;
  public SelectedIndex = 0;
  public SelectedEnableStatus = true;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private usersService: UsersService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    // for Testing Only ends
    this.usersService.getUsersByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(users => {
      this.maindatas = users;
      console.log('Users Form Data : ', this.maindatas);
      this.ShowMessage('Users fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
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

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = this.data;
      dialogConfig.ariaLabel = 'Arial Label Users Dialog';

      const dialogRef = this.dialog.open(CreateuserComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data = result;
        console.log('this.data ::', this.data);
      });
    } catch (e) { }
  }

  onClickAdd() {

    this.email = new EmailAddress();
    this.email.emailAddress = '';

    this.mobileNumber = new PhoneNumber();
    this.mobileNumber.number = '';

    this.phoneNumber = new PhoneNumber();
    this.phoneNumber.number = '';

    this.user = new User();
    this.user.userName = '';
    this.user.firstName = '';
    this.user.lastName = '';
    this.user.email = this.email;
    this.mobileNumber = this.mobileNumber;
    this.phoneNumber = this.phoneNumber;
    this.addDefaultLaguage();

    this.data = new DpsUser();
    this.data.customerVatNumber = this.loginuserdetails.customerVatNumber;
    this.data.isEnabled = true;
    this.data.isArchived = false;
    this.data.userRole = '';
    this.data.user = this.user;
    this.openDialog();
  }

  addDefaultLaguage() {
    if (this.data.user.language === null) {
      this.data.user.language = new Language();
    }
    if (this.data.user.language.name === undefined || this.data.user.language.name === null
      || this.data.user.language.name === '') {
      this.data.user.language.name = 'Dutch';
      this.data.user.language.shortName = 'nl';
    }
  }

  onClickEdit(i) {
    console.log('Edit Clicked Index :: ' + i);
    this.data = this.maindatas[i];
    this.openDialog();
    return true;
  }

  updateUsers() {
    this.usersService.updateUser(this.data).subscribe(res => {
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

  onClickDelete(i) {
    console.log('Delete Clicked Index:: ' + i);
    this.data = this.maindatas[i];
    this.data.isArchived = true;
    this.updateUsers();
  }

  onStatusChange(event, i) {
    this.SelectedIndex = i;
    console.log('Users index : ' + this.SelectedIndex + ', Enabled : ' + event);
    this.data = this.maindatas[i];
    this.data.isEnabled = event;
    this.updateUsers();
  }
}
