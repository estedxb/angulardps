import { Component, OnInit, Input,EventEmitter,Output, ChangeDetectorRef } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  @Input() public currencyDataForm;
  @Output() public childEvent = new EventEmitter();

  public oldcurrencyData;
  public selectedString;

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

  constructor(private logger:LoggingService) { 

  }

  ngDoCheck() {

    if(this.oldcurrencyData !== this.currencyDataForm)
    {
      this.oldcurrencyData = this.currencyDataForm; 
      this.loadInitialData();
    }
  }

  loadInitialData() {

    this.datacurrencyDropDown = ['€', '%'];

    if (this.currencyDataForm !== null && this.currencyDataForm !== undefined) 
    {
      for (let i = 0; i < this.datacurrencyDropDown.length; i++) {
        if(this.currencyDataForm === this.datacurrencyDropDown[i])
            this._selectedIndex = i;
      }
    }

  }

  ngOnInit() {
    this.datacurrencyDropDown = ['€', '%'];

    this.childEvent.emit(this.datacurrencyDropDown[0]);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }
  }

  ngAfterViewInit() {

   setTimeout(() => {
    this.currencyDataForm
   },0); 

  }

  ngAfterContentInit() {

    setTimeout(() => {
      this.currencyDataForm
     },0); 
  
  }

}
