import { Component, OnInit, Input, EventEmitter, Output,ChangeDetectorRef,ChangeDetectionStrategy  } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyComponent implements OnInit {

  @Input() public currencyDataForm;
  @Input() public inputdisabled;
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

  refresh() {
    this.cdr.detectChanges();
  }

  onChange($event) {

    this._selectedIndex = $event.target.value;
    this.selectedIndex = $event.target.value;
    this.selectedString = this.value;
    this.childEvent.emit(this.value);

    return this.value;
  }

  constructor(private spinner: NgxUiLoaderService,private logger: LoggingService,private cdr: ChangeDetectorRef) {

  }

  ngOnChanges() {

    if(this.currencyDataForm !== undefined && this.currencyDataForm !== null)
    {

      if (this.oldcurrencyData !== this.currencyDataForm) {
        this.oldcurrencyData = this.currencyDataForm;
        this.loadInitialData();
      }  
    }

    if (this.inputdisabled !== this.olddisabled) {
      this.olddisabled = this.inputdisabled;  
    }

  }

  ngDoCheck() {

    if(this.currencyDataForm !== undefined && this.currencyDataForm !== null)
    {

      if (this.oldcurrencyData !== this.currencyDataForm) {
        this.oldcurrencyData = this.currencyDataForm;
        this.loadInitialData();
      }  
    }

    if (this.inputdisabled !== this.olddisabled) {
      this.olddisabled = this.inputdisabled;  
    }

  }

  loadInitialData() {

    this.datacurrencyDropDown = ['€', '%'];

    if (this.currencyDataForm !== undefined && this.currencyDataForm !== null) {
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

    if(this.currencyDataForm !== undefined && this.currencyDataForm !== null)
    {
      if (this.oldcurrencyData !== this.currencyDataForm) {
        this.oldcurrencyData = this.currencyDataForm;
        this.loadInitialData();
      }  
    }

  }

}
