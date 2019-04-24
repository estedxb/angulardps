import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { Alert } from 'selenium-webdriver';
import { Location, LoginToken, DpsUser } from '../../../shared/models';
import { LocationsService } from '../../../shared/locations.service';
import { AlertsService } from 'angular-alert-module';
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./../customers.component.css']
})
export class LocationsComponent implements OnInit {
  public maindatas = [];
  public data: Location;
  public errorMsg;
  public SelectedLocationIndex = 0;
  public SelectedLocationEnableStatus = true;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private locationService: LocationsService, private alerts: AlertsService) { }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    this.locationService.getLocationByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(locations => {
      this.maindatas = locations;
      console.log('Locations Forms Data : '); console.log(this.maindatas);
    }, error => this.errorMsg = error);

    this.alerts.setMessage('All the fields are required', 'error');
  }

  onClickEdit(i) {
    console.log('Edit Clicked Index :: ' + i);
    this.data = this.maindatas[i];
    return true;
  }

  onClickDelete(i) {
    console.log('Delete Clicked Index:: ' + i);
    this.data = this.maindatas[i];
    return true;
  }

  onStatusChange(event, i) {
    this.SelectedLocationIndex = i;
    this.SelectedLocationEnableStatus = event;
    alert('Location index : ' + this.SelectedLocationIndex + ', Enabled : ' + this.SelectedLocationEnableStatus);
    this.data = this.maindatas[i];
    console.log(this.data.id);
  }

}
