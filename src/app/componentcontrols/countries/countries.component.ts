import { Component, OnInit } from '@angular/core';
//import { CountriesList } from '../../shared/models';
import { CountriesService } from '../../shared/countries.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})

export class CountriesComponent implements OnInit {
  public id = 'ddl_legalform' ;
  public currentlanguage = 'nl';
  public errorMsg;
  public datas: any = [];
  // tslint:disable-next-line: variable-name
  private _selectedValue: any ; private _selectedIndex: any = 0;  private _value: any ;

  set selectedValue(value: any) { this._selectedValue = value; }
  get selectedValue(): any { return this._selectedValue; }
  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.datas[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndex; }
  set value(value: any) { this._value = value; }
  get value(): any { return this._value; }
  resetToInitValue() { this.value = this.selectedValue; }
  SetInitialValue() { if (this.selectedValue === undefined) { this.selectedValue = this.datas[this.selectedIndex]; } }
  onChange($event) { this.selectedIndex = $event.target.value; return this.value; }

  constructor(private countriesService: CountriesService) { }

  ngOnInit() {
    this.resetToInitValue();
    this.countriesService.getCountriesList().subscribe(data => this.datas = data , error => this.errorMsg = error);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }
  }

}

// console.log(this.id); console.log($event.target.value);
// console.log('Country Selected Data ::'); console.log(this.value);
