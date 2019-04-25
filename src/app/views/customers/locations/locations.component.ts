import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { Location, LoginToken, DpsUser } from '../../../shared/models';
import { LocationsService } from '../../../shared/locations.service';
//import { AlertsService } from 'angular-alert-module';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { CreatelocationComponent } from '../../../componentcontrols/createlocation/createlocation.component';
import { UpdateCustomerComponent } from '../update-customer/update-customer.component';
import { DPSSystemMessageComponent } from '../../../componentcontrols/dpssystem-message/dpssystem-message.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./../customers.component.css']
})
export class LocationsComponent implements OnInit {
  public maindatas = [];
  public data;
  public errorMsg;
  public SelectedLocationIndex = 0;
  public SelectedLocationEnableStatus = true;
  public durationInSeconds = 5;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private locationService: LocationsService, private dialog: MatDialog, private snackBar: MatSnackBar) { }//, private alerts: AlertsService

  openSnackBar() {
    this.ShowMessage('Test Message', 'Save')
  }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    this.locationService.getLocationByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(locations => {
      this.maindatas = locations;
      console.log('Locations Forms Data : '); console.log(this.maindatas);
      this.ShowMessage('Locations fetched successfully', 'error');
    }, error => this.ShowMessage(error, 'error'));
  }

  ShowMessage(MSG, Action) {
    //this.alerts.setMessage(msg, type);
    const sBar = this.snackBar.open(MSG, Action, {});
  }

  openDialog(): void {
    try {
      const dialogRef = this.dialog.open(CreatelocationComponent, { width: '800px', data: {} });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data = result;
        console.log('this.data ::', this.data);
      });
    } catch (e) { }
  }

  onClickAdd() {
    this.data = new Location();
    this.openDialog();
  }

  onClickEdit(i) {
    console.log('Edit Clicked Index :: ' + i);
    this.data = this.maindatas[i];
    this.openDialog();
    return true;
  }


  onClickDelete(i) {
    console.log('Delete Clicked Index:: ' + i);
    this.data = this.maindatas[i];
    this.data.isArchive = true;
    /*
    this.locationService.UpdateCustomerComponent(this.data).subscribe(locations => {
      this.maindatas = locations;
      console.log('Locations Forms Data : '); console.log(this.maindatas);
      this.ShowMessage('Locations fetched successfully', 'error');
    }, error => this.ShowMessage(error, 'error'));
    */
    // return true;
  }

  onStatusChange(event, i) {
    this.SelectedLocationIndex = i;
    this.SelectedLocationEnableStatus = event;
    alert('Location index : ' + this.SelectedLocationIndex + ', Enabled : ' + this.SelectedLocationEnableStatus);
    this.data = this.maindatas[i];
    console.log(this.data.id);
  }

}
