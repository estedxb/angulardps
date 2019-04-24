import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { Alert } from 'selenium-webdriver';
import { Location, LoginToken, DpsUser, } from '../../../shared/models';
import { PositionsService } from '../../../shared/positions.service';
@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./../customers.component.css']
})
export class PositionsComponent implements OnInit {
  public maindatas = [];
  public datas = {};
  public errorMsg;
  public SelectedLocationIndex = 0;
  public SelectedLocationEnableStatus = true;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private positionsService: PositionsService) { }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    this.positionsService.getPositionsByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(positions => {
      this.maindatas = positions;
      console.log('Positions Form Data : '); console.log(this.maindatas);
    }, error => this.errorMsg = error);
  }

  onUiSwitchChange($event, index) {
    this.SelectedLocationIndex = index;
    this.SelectedLocationEnableStatus = $event.target.value;
    alert('Position index : ' + this.SelectedLocationIndex + ', Enabled : ' + this.SelectedLocationEnableStatus);
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
