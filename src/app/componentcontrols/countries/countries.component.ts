import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
// import { CountriesList } from '../../shared/models';
import { CountriesService } from '../../shared/countries.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styles: ['']
})

export class CountriesComponent implements OnInit {

  @Input() public CountryFormData;
  @Output() public childEvent = new EventEmitter();

  public oldCountryFormData;
  public id = 'ddl_legalform';
  public currentlanguage = 'nl';
  public errorMsg;
  public datas: any = [];
  public selectedString: string;
  // tslint:disable-next-line: variable-name
  private _selectedValue: any; private _selectedIndex: any = 0; private _value: any;

  set selectedValue(value: any) { this._selectedValue = value; }
  get selectedValue(): any { return this._selectedValue; }
  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.datas[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndex; }
  set value(value: any) { this._value = value; }
  get value(): any { return this._value; }
  resetToInitValue() { this.value = this.selectedValue; }

  SetInitialValue() {
    if (this.selectedValue === undefined) {
      this.selectedValue = this.datas[this._selectedIndex];
    }
  }
  onChange($event) {

    this.selectedIndex = $event.target.value;
    console.log('countries selected=' + this.value);
    console.log(this.value);

    // console.log( selected="+this.value.FormName);

    this.selectedString = this.value;

    this.childEvent.emit(this.value);

    return this.value;
  }

  constructor(private countriesService: CountriesService) { }

  ngOnInit() {

    this.countriesService.getCountriesList().subscribe(countries => {
      this.datas = countries;
      this.childEvent.emit(this.datas[0]);
      this.loadInitialData(this.datas);
      console.log('Countries Forms Data : '); console.log(this.datas);

    }, error => this.errorMsg = error);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }

  }

  ngDoCheck() {

    console.log(this.CountryFormData);

    if (this.CountryFormData != this.oldCountryFormData) {
      console.log("ngDoCheck countryForm data=" + this.CountryFormData);
      this.oldCountryFormData = this.CountryFormData;
      this.loadInitialData(this.datas);
    }

  }

  ngAfterViewInit() {

    if (this.CountryFormData != this.oldCountryFormData) {
      console.log("ngDoCheck countryForm data=" + this.CountryFormData);
      this.oldCountryFormData = this.CountryFormData;
      this.loadInitialData(this.datas);
    }
  }

  loadInitialData(datas: any) {

    console.log("countryString=" + this.CountryFormData);
    console.log(this.datas);

    if (datas.length !== 0) {
      console.log("datas new country string");

      for (var i = 0; i < this.datas.length; i++) {
        console.log("country=" + this.CountryFormData);
        if (this.datas[i].countryName === this.CountryFormData)
          this._selectedIndex = i;
      }

      console.log("selected index=" + this._selectedIndex);
    }
    else {
      console.log("null or undefined");
    }

  }

}
