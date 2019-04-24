import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { Alert } from 'selenium-webdriver';
import { Location } from '../../../shared/models';
import { LocationsService } from '../../../shared/locations.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./../customers.component.css']
})
export class LocationsComponent implements OnInit {
  public maindatas = [];
  public datas = {};
  public errorMsg;
  public SelectedLocationIndex = 0;
  public SelectedLocationEnableStatus = true;

  constructor(private locationService: LocationsService) { }

  ngOnInit() { }

  onClickEdit(id) {
    alert('Edit Clicked :: ' + id);
    return true;
  }

  onClickDelete(id) {
    alert('Delete Clicked :: ' + id);
    return true;
  }

  onUiSwitchChange($event, index) {
    this.SelectedLocationIndex = index;
    this.SelectedLocationEnableStatus = $event.target.value;
    /*
    this.datas = this.maindatas
      .map(location => {
        if (location..toLowerCase().indexOf(value.toLowerCase()) > -1
          || location.CodeNumber.toString().indexOf(value.toLowerCase()) > -1
          || (location.CodeNumber.toString() + ' - ' + cust.Description.toLowerCase()).indexOf(value.toLowerCase()) > -1) { return cust; }
      });
      */
    alert('LocationId : ' + this.SelectedLocationIndex + ', Enabled : ' + this.SelectedLocationEnableStatus);
    /*
        this.selectedIndexCurrencyOtherAllowance = ;
        console.log(this.value);
    
        if(this.value === "€")
        {
          console.log("euro selected setting nominal to true");
          this.otherAllowances[i].nominal = true;
          this.changeObject();
        }
        else
        {
          console.log("% selected setting nominal to false");
          this.otherAllowances[i].nominal = false;
          this.changeObject();
        }
          return this.value;
          */

  }


  changeObject() {
    /*
     let jsonObject:any = {
        "lieuDaysAllowance": this.lieuDaysAllowanceObject,
        "sicknessInvoiced": this.sicknessInvoiced,
        "holidayInvoiced": this.holidayInvoiced,
        "mobilityAllowance": this.mobilityAllowanceObject,
        "shiftAllowance": this.shiftAllowance,
        "shiftAllowances": this.shiftAllowances,
        "otherAllowances": this.otherAllowances
     };
     this.childEvent.emit(jsonObject);
     
     console.log("object changed");
     console.log(jsonObject);
 
   */
  }

}
