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

  constructor(private countriesService: CountriesService, private logger: LoggingService) { }

  ngOnInit() {

    this.countriesService.getCountriesList().subscribe(countries => {
      this.datas = countries;
      this.childEvent.emit(this.datas[0]);
      // this.logger.log(countries);
      this.loadInitialData(this.datas);
      // this.logger.log('Countries Forms Data : '); this.logger.log(this.datas);

    }, error => this.errorMsg = error);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }

  }

  ngDoCheck() {
    // this.logger.log(this.CountryFormData);
    if (this.CountryFormData !== this.oldCountryFormData) {
      // this.logger.log('ngDoCheck countryForm data=' + this.CountryFormData);
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
    // this.logger.log('countryString=' + this.CountryFormData);
    // this.logger.log(this.datas);
    if (datas.length !== 0) {
      // this.logger.log('datas new country string');
      for (let i = 0; i < this.datas.length; i++) {
        const str:string = this.datas[i].Country;
        // this.logger.log("str="+str);
        const datString:Array<string> = str.split(" ");
        // this.logger.log('country=' + str.split(" ")[0].toLowerCase());
        if(str.split(" ")[0] !== undefined && str.split(" ")[0] !== null)
          if ( str.split(" ")[0].toLowerCase() === this.CountryFormData.toLowerCase()) {
            this._selectedIndex = i;
          }
      }
      // this.logger.log('selected index=' + this._selectedIndex);
    } else {
      // this.logger.log('null or undefined');
    }

  }

}
