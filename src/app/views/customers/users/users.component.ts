import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { Alert } from 'selenium-webdriver';
import { Location, LoginToken, DpsUser } from '../../../shared/models';
import { UsersService } from '../../../shared/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./../customers.component.css']
})
export class UsersComponent implements OnInit {
  public maindatas = [];
  public datas = {};
  public errorMsg;
  public SelectedLocationIndex = 0;
  public SelectedLocationEnableStatus = true;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    console.log('loginuserdetails ::', this.loginuserdetails);
    // for Testing Only stars
    this.loginuserdetails.customerVatNumber = 'test1';
    // for Testing Only ends
    this.usersService.getUsersByVatNumber(this.loginuserdetails.customerVatNumber).subscribe(users => {
      this.maindatas = users;
      console.log('Users Form Data : '); console.log(this.maindatas);
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
