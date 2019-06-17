import { Component, OnInit, Input,EventEmitter,Output } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  @Input() public currencyData;
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

    if(this.oldcurrencyData !== this.currencyData)
    {
      this.oldcurrencyData = this.currencyData; 
      this.loadInitialData();
    }
  }

  loadInitialData() {

    this.datacurrencyDropDown = ['€', '%'];

    this.logger.log("received on load="+this.currencyData);

    if (this.currencyData !== null && this.currencyData !== undefined) 
    {
      for (let i = 0; i < this.datacurrencyDropDown.length; i++) {
        if(this.currencyData === this.datacurrencyDropDown[i])
            this._selectedIndex = i;
      }
    }

  }

  ngOnInit() {
    this.datacurrencyDropDown = ['€', '%'];

    if (this.selectedValue === undefined) { this.SetInitialValue(); }

  }

}
