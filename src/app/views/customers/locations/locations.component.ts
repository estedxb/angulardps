import { Component, OnInit, Input, Output ,EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./../customers.component.css']
})
export class LocationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onUiSwitchChange($event,i){

    this.selectedIndexCurrencyOtherAllowance = $event.target.value;
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
  }

  
  changeObject(){
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
  */
    this.childEvent.emit(jsonObject);
    
    console.log("object changed");
    console.log(jsonObject);

  }

}
