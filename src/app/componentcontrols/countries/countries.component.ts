import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
// import { CountriesList } from '../../shared/models';
import { CountriesService } from '../../shared/countries.service';
import { LoggingService } from '../../shared/logging.service';

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

    this._selectedIndex = $event.target.value;
    this.selectedIndex = $event.target.value;

    // this.logger.log("country selected="+this.value.Country);
    // this.logger.log(this.value);

    this.selectedString = this.value;

    this.childEvent.emit(this.value);

    return this.value;
  }

  constructor(
    private countriesService: CountriesService,
    private logger: LoggingService) { }

  ngOnInit() {

    this.countriesService.getCountriesList().subscribe(countries => {
      this.datas = countries;

      // setDefault country
      this.setDefaultCountry();

      // set load initial data
      this.loadInitialData(this.datas);

    }, error => this.errorMsg = error);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }

  }

  setDefaultCountry() {

    for (let it = 0; it < this.datas.length; it++) {
      if (this.datas[it].Country === "Belgium") {
        this._selectedIndex = it;
        this.childEvent.emit(this.datas[it]);
      }
    }

  }

  ngDoCheck() {

    if (this.CountryFormData !== this.oldCountryFormData) {
      this.oldCountryFormData = this.CountryFormData;
      this.loadInitialData(this.datas);
    }

  }

  ngAfterViewInit() {
    if (this.CountryFormData !== this.oldCountryFormData) {
      // this.logger.log('ngDoCheck countryForm data=' + this.CountryFormData);
      this.oldCountryFormData = this.CountryFormData;
      this.loadInitialData(this.datas);
    }
  }

  loadInitialData(datas: any) {
    if (datas.length !== 0) {

      for (let i = 0; i < this.datas.length; i++) {
        const str: string = this.datas[i].Country;
        const datString: Array<string> = str.split(" ");

        if (str !== undefined && str != null) {
          if (this.CountryFormData === str) {
            this._selectedIndex = i;
            this.childEvent.emit(this.datas[i]);
          }
        }
      }
    }
    else {
    }

  }

}
