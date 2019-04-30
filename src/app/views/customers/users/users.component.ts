import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import {
  MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef, MAT_DIALOG_DATA
} from '@angular/material';
import { LoginToken, DpsUser, User } from '../../../shared/models';
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
  public data;
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
      console.log('Users Form Data : '); console.log(this.maindatas);
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
    this.data = new User();
    this.openDialog();
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
    this.data.isArchive = true;
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
