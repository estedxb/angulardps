import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkCodesService } from '../../shared/workcodes.service';
import { FormGroup, Form, FormControl } from '@angular/forms';
import { WorkCodes } from '../../shared/models';

@Component({
  selector: 'app-workcodes',
  templateUrl: './workcodes.component.html',
  styleUrls: ['./workcodes.component.css']
})

export class WorkCodesComponent implements OnInit {
  public maindatas = [];
  public datas = [];
  public errorMsg;
  public show = false;
  HQForm: FormGroup;

  @Input() public disabled;
  @Input() public initialWorkCode;
  @Output() public childEvent = new EventEmitter();

  public oldInitialWorkCode = "";

  // tslint:disable-next-line: variable-name
  private _selectedValue: any; private _selectedIndex: any = 0; private _value: any;

  set selectedValue(value: any) { this._selectedValue = value; }
  get selectedValue(): any { return this._selectedValue; }
  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.datas[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndex; }
  set value(value: any) { this._value = value; }
  get value(): any { return this._value; }
  resetToInitValue() { this.value = this.selectedValue; }
  SetInitialValue() { if (this.selectedValue === undefined) { this.selectedValue = this.datas[this.selectedIndex]; } }
  onChange($event) { this.selectedIndex = $event.target.value; return this.value; }

  constructor(private workCodesService: WorkCodesService) { }

  oncustomerKeyup(value) {
    // this.datas = [];
    if (this.maindatas.length > 0) {
      this.datas = this.maindatas
        .map(cust => {
          if (cust.Description.toLowerCase().indexOf(value.toLowerCase()) > -1
            || cust.CodeNumber.toString().indexOf(value.toLowerCase()) > -1
            || (cust.CodeNumber.toString() + ' - ' + cust.Description.toLowerCase()).indexOf(value.toLowerCase()) > -1) { return cust; }
        });
    } else {
      this.datas = this.maindatas;
    }
  }

  filter(filterType) {
    this.datas = [];
    if (filterType !== 'reset') {
      if (this.maindatas.length > 0) {
        this.datas = this.maindatas
          .map(cust => {
            if (cust.CodeType.toLowerCase() === filterType) { return cust; }
          });
      } else {
        this.datas = this.maindatas;
      }
    } else {
      this.datas = this.maindatas;
    }
  }

  // ngOnChanges() {

    // if(this.disabled === true)
    //   this.HQForm.get('WorkCode').disable();
    //  else
    //   this.HQForm.get('WorkCode').enable(); 

  // }

  ngDoCheck() {

    console.log("initialWorkCode="+this.initialWorkCode);
    console.log("oldInitialWorkCode="+this.oldInitialWorkCode);

    if(this.disabled === true)
    {
      this.HQForm.get('WorkCode').disable();
      this.HQForm.controls['WorkCode'].setValue('');
    }
   else
   {
    this.HQForm.get('WorkCode').enable();
   }

   if(this.initialWorkCode !== this.oldInitialWorkCode)
   {
     this.oldInitialWorkCode = this.initialWorkCode;
     this.HQForm.controls['WorkCode'].setValue(this.initialWorkCode);
   }

  }

  ngOnInit() {

    this.HQForm = new FormGroup({
      WorkCode: new FormControl('')
    });

    if(this.disabled === true)
    {
      this.HQForm.get('WorkCode').disable();
      this.HQForm.controls['WorkCode'].setValue('');
    }
   else
   {
    this.HQForm.get('WorkCode').enable();
   }


    this.workCodesService.getWorkCodes().subscribe(data => {
      this.maindatas = data;
      this.datas = data;
      console.log('getworkcodes in workcodes.component ::');
      console.log(data);
    }, error => this.errorMsg = error);

    // this.HQForm.controls.WorkCode.setValue(this.initialWorkCode);
  }

  closeMe() { this.show = false; }

  setWorkCode(i) {
    this.value = this.datas[i];
    this.HQForm.controls.WorkCode.setValue(this.value.CodeNumber + ' - ' + this.value.Description);
    this.show = false;
    this.childEvent.emit(this.value.CodeNumber);
  }
}
