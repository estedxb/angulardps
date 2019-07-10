import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoggingService } from '../../shared/logging.service';
import { vehicleService } from '../../shared/vehicle.service';

@Component({
  selector: 'app-vehicle-types',
  templateUrl: './vehicle-types.component.html',
  styleUrls: ['./vehicle-types.component.css']
})
export class VehicleTypesComponent implements OnInit {

  @Input() public vehicleFormData;
  @Output() public childEvent = new EventEmitter();

  public oldvehicleFormData;
  public id = 'ddl_legalform';
  public currentlanguage = 'nl';
  public errorMsg;
  public datas: any = [];
  public dropdownData: any = [];
  public selectedString: string;

  // tslint:disable-next-line: variable-name

  private _selectedValue: any; private _selectedIndex: any = 0; private _value: any;
  set selectedValue(value: any) { this._selectedValue = value; }
  get selectedValue(): any { return this._selectedValue; }
  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.dropdownData[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndex; }
  set value(value: any) { this._value = value; }
  get value(): any { return this._value; }
  resetToInitValue() { this.value = this.selectedValue; }

  SetInitialValue() {
    if (this.selectedValue === undefined) {
      this.selectedValue = this.dropdownData[this._selectedIndex];
    }
  }

  onChangeVehicle($event) {

    this._selectedIndex = $event.target.value;
    this.selectedIndex = $event.target.value;
    this.selectedString = this.value;

    this.childEvent.emit(this.value);

    return this.value;
  }

  constructor(
    private vehicleService: vehicleService,
    private logger: LoggingService
  ) { }

  ngOnInit() {

    this.vehicleService.getVehiclesNew().subscribe(newdata => {
      this.datas = newdata;
      this.dropdownData = this.datas;

      // setDefault country      
      this.setDefaultVehicle();

      // set load initial data
      this.loadInitialData();

    }, error => this.errorMsg = error);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }

  }

  setDefaultVehicle() {

    this.selectedIndex = 0;
    this.childEvent.emit(this.dropdownData[this.selectedIndex]);
  }

  ngDoCheck() {

    if (this.vehicleFormData !== this.oldvehicleFormData) {
      this.oldvehicleFormData = this.vehicleFormData;
      this.loadInitialData();
    }

  }

  ngAfterViewInit() {
    if (this.vehicleFormData !== this.oldvehicleFormData) {
      this.oldvehicleFormData = this.vehicleFormData;
      this.loadInitialData();
    }
  }

  loadInitialData() {
    if (this.datas.length !== 0) {
      for (let i = 0; i < this.datas.length; i++) {
        const str: string = this.datas[i].vehicleName;

        if (this.vehicleFormData === str) {
          this.selectedIndex = i;
          this.childEvent.emit(this.datas[i]);
        }
      }
    }
  }

}
