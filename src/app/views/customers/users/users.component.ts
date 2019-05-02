import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { AlertsService } from 'angular-alert-module';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig } from '@angular/material';
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
  public language: Language;
  public errorMsg;
  public SelectedIndex = -1;
  public SelectedEnableStatus = true;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private usersService: UsersService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    this.usersService.getUsersByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(users => {
      this.maindatas = users;
      this.FilterTheArchive();
      console.log('Users Form Data : ', this.maindatas);
      this.ShowMessage('Users fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  FilterTheArchive() { this.maindatas = this.maindatas.filter(d => d.isArchived === false); }

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
      dialogConfig.ariaLabel = 'Arial Label Location Dialog';

      const dialogRef = this.dialog.open(CreateuserComponent, dialogConfig);
      const sub = dialogRef.componentInstance.showmsg.subscribe(($event) => { this.ShowMessage($event.MSG, $event.Action); });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data = result;
        console.log('this.data ::', this.data);
        if (this.SelectedIndex >= 0) {
          // maindatas Update User
          this.maindatas[this.SelectedIndex] = this.data;
          this.FilterTheArchive();
          this.ShowMessage('Users "' + this.data.user.firstName + ' ' + this.data.user.lastName + '" is updated successfully.', '');
        } else {
          // maindatas Add User
          console.log('this.data.user :: ', this.data.user);
          try {
            if (this.data.user !== null) {
              if (this.data.user.firstName !== undefined && this.data.user.firstName !== '' && this.data.user.firstName !== null) {
                this.maindatas.push(this.data);
                console.log('New User Added Successfully :: ', this.maindatas);
                this.FilterTheArchive();
                this.ShowMessage('Users "' + this.data.user.firstName + ' ' + this.data.user.lastName + '" is added successfully.', '');
              } else {
                console.log('New User Added Failed :: ', this.maindatas);
              }
            } else {
              console.log('New User Added Failed :: ', this.maindatas);
            }
          } catch (e) { }
        }
      });
    } catch (e) { }
  }


  onClickAdd() {
    this.SelectedIndex = -1;

    this.data = new DpsUser();
    this.user = new User();
    this.email = new EmailAddress();
    this.mobileNumber = new PhoneNumber();
    this.phoneNumber = new PhoneNumber();
    this.language = new Language();

    this.data.customerVatNumber = this.loginuserdetails.customerVatNumber;
    this.data.isEnabled = true;
    this.data.isArchived = false;
    this.data.userRole = '';

    this.email.emailAddress = '';
    this.mobileNumber.number = '';
    this.phoneNumber.number = '';

    this.language.name = 'Dutch';
    this.language.shortName = 'nl';

    this.user.userName = '';
    this.user.firstName = '';
    this.user.lastName = '';
    this.user.email = this.email;
    this.user.mobile = this.mobileNumber;
    this.user.phone = this.phoneNumber;
    this.user.language = this.language;
    this.data.user = this.user;

    this.openDialog();
  }

  onClickEdit(i) {
    this.SelectedIndex = i;
    console.log('Edit Clicked Index :: ' + this.SelectedIndex);
    this.data = this.maindatas[this.SelectedIndex];
    this.openDialog();
    return true;
  }

  updateUsers() {
    this.usersService.updateUser(this.data).subscribe(res => {
      console.log('response :: ', res, 'Data ::', this.data);
      this.maindatas[this.SelectedIndex] = this.data;
      this.FilterTheArchive();
    },
      (err: HttpErrorResponse) => {
        console.log('Error :: ', err);
        if (err.error instanceof Error) {
          console.log('Error occured=' + err.error.message);
        } else {
          console.log('response code=' + err.status, 'response body=' + err.error);
        }
      }
    );
  }

  onClickDelete(i) {
    console.log('Delete Clicked Index:: ' + i);
    this.data = this.maindatas[i];
    this.data.isArchived = true;
    this.updateUsers();
    this.ShowMessage('Locations "' + this.data.user.firstName + ' ' + this.data.user.lastName + '" is deleted successfully.', '');
  }

  onStatusChange(event, i) {
    this.SelectedIndex = i;
    console.log('Users index : ' + this.SelectedIndex + ', Enabled : ' + event);
    this.data = this.maindatas[i];
    this.data.isEnabled = event;
    this.updateUsers();
    let EnabledStatus = '';
    if (event) {
      EnabledStatus = 'enabled';
    } else {
      EnabledStatus = 'disabled';
    }
    this.ShowMessage('Locations "' + this.data.user.firstName + ' ' + this.data.user.lastName
      + '" is ' + EnabledStatus + ' successfully.', '');
  }

}
