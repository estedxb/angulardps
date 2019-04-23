import { Component, OnInit,Output, Input, EventEmitter } from '@angular/core';
//import { CountriesList } from '../../shared/models';
import { CountriesService } from '../../shared/countries.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styles: ['']
})

export class CountriesComponent implements OnInit {

  @Input() public CountryFormData;
  @Output() public childEvent = new EventEmitter();

  public id = 'ddl_legalform' ;
  public currentlanguage = 'nl';
  public errorMsg;
  public datas: any = [];
  public selectedString:string;
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
  onChange($event) { 
    this.selectedIndex = $event.target.value; 
    console.log("countries selected="+this.value);
    console.log(this.value);
    
    // console.log( selected="+this.value.FormName);

    this.selectedString = this.value;

    this.childEvent.emit(this.value);    

    return this.value; }

  constructor(private countriesService: CountriesService) { }

  ngOnInit() {
    
    this.countriesService.getCountriesList().subscribe(countries =>{
      this.datas = countries;
      console.log('Countries Forms Data : '); console.log(this.datas); 
    } , error => this.errorMsg = error);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }
  }

}

// console.log(this.id); console.log($event.target.value);
// console.log('Country Selected Data ::'); console.log(this.value);
