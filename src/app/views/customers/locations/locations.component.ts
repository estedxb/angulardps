import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { Location, LoginToken, DpsUser, Address } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationsService } from '../../../shared/locations.service';
import { CreatelocationComponent } from './createlocation/createlocation.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./../customers.component.css']
})
export class LocationsComponent implements OnInit {
  public maindatas = [];
  public data: Location;
  public address: Address;
  public errorMsg;
  public SelectedLocationIndex = 0;
  public SelectedLocationEnableStatus = true;
  public durationInSeconds = 5;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private locationsService: LocationsService, private dialog: MatDialog, private snackBar: MatSnackBar) { }
  // , private alerts: AlertsService

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    this.locationsService.getLocationByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(locations => {
      this.maindatas = locations;
      console.log('Locations Forms Data : '); console.log(this.maindatas);
      this.ShowMessage('Locations fetched successfully.', '');
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
      dialogConfig.ariaLabel = 'Arial Label Location Dialog';

      const dialogRef = this.dialog.open(CreatelocationComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.data = result;
        console.log('this.data ::', this.data);
        if (this.SelectedLocationIndex >0){
          //maindatas Update location
          if(this.data.id==this.SelectedLocationIndex )
          { 
            this.maindatas[this.SelectedLocationIndex] = this.data;
            this.updateLocations();
          }  

        } else {
          //maindatas Add location
          if(this.data.id>0){
            this.maindatas.push(this.data); 
            this.updateLocations();         
          }
        }
      });
    } catch (e) { }
  }
 

  onClickAdd() {
    this.SelectedLocationIndex = 0;
    
    this.address = new Address();
    this.address.street = '';
    this.address.streetNumber = '';
    this.address.bus = '';
    this.address.city = '';
    this.address.country = 'Belgium';
    this.address.countryCode = 'nl';
    this.address.postalCode = '';

    this.data = new Location();
    this.data.id = 0;
    this.data.name = '';
    this.data.customerVatNumber = this.loginuserdetails.customerVatNumber ;
    this.data.address = this.address;
    this.data.isArchive = false;
    this.data.isEnabled = true;
    this.openDialog();
  }

  onClickEdit(i) {
    this.SelectedLocationIndex = i;
    console.log('Edit Clicked Index :: ' + i);
    this.data = this.maindatas[i];
    this.openDialog();
    return true;
  }

  updateLocations() {
    this.locationsService.updateLocation(this.data).subscribe(res => {
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
    this.updateLocations();
  }

  onStatusChange(event, i) {
    this.SelectedLocationIndex = i;
    console.log('Location index : ' + this.SelectedLocationIndex + ', Enabled : ' + event);
    this.data = this.maindatas[i];
    this.data.isEnabled = event;
    this.updateLocations();
  }
}
