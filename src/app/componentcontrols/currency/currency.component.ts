import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  @Input() public currencyDataForm;
  @Input() public disabled;
  @Output() public childEvent = new EventEmitter();

  public currencyForm: FormGroup;

  public oldcurrencyData;
  public selectedString;
  public olddisabled;

  public datacurrencyDropDown;

  // tslint:disable-next-line: variable-name
  private _selectedValue: any; private _selectedIndex: any = 0; private _value: any;

  set selectedValue(value: any) { this._selectedValue = value; }
  get selectedValue(): any { return this._selectedValue; }
  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.datacurrencyDropDown[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndex; }
  set value(value: any) { this._value = value; }
  get value(): any { return this._value; }
  resetToInitValue() { this.value = this.selectedValue; }

  SetInitialValue() {
    if (this.selectedValue === undefined) {
      this._selectedIndex = 0;
      this.selectedValue = this.datacurrencyDropDown[this._selectedIndex];
    }
  }

  onChange($event) {

    this._selectedIndex = $event.target.value;
    this.selectedIndex = $event.target.value;
    this.selectedString = this.value;
    this.childEvent.emit(this.value);

    return this.value;
  }

  constructor(private spinner: NgxSpinnerService, private logger: LoggingService) {

  }

  ngDoCheck() {


    if (this.disabled !== this.olddisabled) {
      this.olddisabled = this.disabled;

      if (this.disabled === true)
        this.currencyForm.get('currency').enable();
      else
        this.currencyForm.get('currency').disable();

    }

    if (this.oldcurrencyData !== this.currencyDataForm) {
      this.oldcurrencyData = this.currencyDataForm;
      this.loadInitialData();
    }
  }

  loadInitialData() {

    this.datacurrencyDropDown = ['€', '%'];

    if (this.disabled === true)
      this.currencyForm.get('currency').enable();
    else
      this.currencyForm.get('currency').disable();

    if (this.currencyDataForm !== null && this.currencyDataForm !== undefined) {
      this.logger.log("currency =" + this.currencyDataForm);

      for (let i = 0; i < this.datacurrencyDropDown.length; i++) {
        if (this.currencyDataForm === this.datacurrencyDropDown[i])
          this._selectedIndex = i;
      }
    }

  }

  ngOnInit() {
    this.datacurrencyDropDown = ['€', '%'];

    this.childEvent.emit(this.datacurrencyDropDown[0]);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }

    this.currencyForm = new FormGroup({
      currency: new FormControl('')
    });

    if (this.disabled === true)
      this.currencyForm.get('currency').enable();
    else
      this.currencyForm.get('currency').disable();

  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.currencyDataForm
    }, 0);

  }

  ngAfterContentInit() {

    setTimeout(() => {
      this.currencyDataForm
    }, 0);

  }

}
