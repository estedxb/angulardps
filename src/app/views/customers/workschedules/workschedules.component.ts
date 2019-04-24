import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { Alert } from 'selenium-webdriver';
import { Location, LoginToken, DpsUser } from '../../../shared/models';
import { LocationsService } from '../../../shared/locations.service';

@Component({
  selector: 'app-workschedules',
  templateUrl: './workschedules.component.html',
  styleUrls: ['./../customers.component.css']
})
export class WorkschedulesComponent implements OnInit {
  public maindatas = [];
  public datas = {};
  public errorMsg;
  public SelectedLocationIndex = 0;
  public SelectedLocationEnableStatus = true;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private locationService: LocationsService) { }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    this.locationService.getLocationByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(locations => {
      this.maindatas = locations;
      console.log('Locations Forms Data : '); console.log(this.maindatas);
    }, error => this.errorMsg = error);
  }

  onUiSwitchChange($event, index) {
    this.SelectedLocationIndex = index;
    this.SelectedLocationEnableStatus = $event.target.value;
    alert('Work Schedule index : ' + this.SelectedLocationIndex + ', Enabled : ' + this.SelectedLocationEnableStatus);
  }

  onClickEdit(id) {
    alert('Edit Clicked :: ' + id);
    return true;
  }

  onClickDelete(id) {
    alert('Delete Clicked :: ' + id);
    return true;
  }
}
