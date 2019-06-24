import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { LoggingService } from '../../shared/logging.service';
import { vehicleService } from '../../shared/vehicle.service';


@Component({
  selector: 'app-zichmet',
  templateUrl: './zichmet.component.html',
  styleUrls: ['./zichmet.component.css']
})

export class ZichmetComponent implements OnInit {

  @Input() public ZichmetFormData;
  @Output() public childEvent = new EventEmitter();

  public oldZichmetFormData;
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
  
  onChangeZich($event) {

    this._selectedIndex = $event.target.value;
    this.selectedIndex = $event.target.value;
    this.selectedString = this.value;

    this.childEvent.emit(this.value);

    return this.value;
  }

  constructor(private vehicleService: vehicleService, private logger: LoggingService) { }

  ngOnInit() {

    this.vehicleService.getVehicles().subscribe(newdata => {
      this.datas = newdata;
      this.dropdownData = this.datas;

      this.logger.log("datas");
      this.logger.log(this.datas);

      // setDefault country
      this.setDefaultVehicle();

      // set load initial data
      this.loadInitialData();

    }, error => this.errorMsg = error);
    if (this.selectedValue === undefined) { this.SetInitialValue(); }

  }

  setDefaultVehicle() {
    this.selectedIndex = 0;

    // for(let i=0;i<this.datas.length;i++)
    //     this.dropdownData.push(this.datas[i].vehicleName);
  }

  ngDoCheck() {

    if (this.ZichmetFormData !== this.oldZichmetFormData) {
      this.oldZichmetFormData = this.ZichmetFormData;
      this.loadInitialData();
    }

  }

  ngAfterViewInit() {
    if (this.ZichmetFormData !== this.oldZichmetFormData) {
      this.oldZichmetFormData = this.ZichmetFormData;
      this.loadInitialData();
    }
  }

  loadInitialData() {

    if (this.datas.length !== 0)    
    {
      for (let i = 0; i < this.datas.length; i++) 
      {
        const str:string = this.datas[i].vehicleName;

          if(this.ZichmetFormData === str)
          {
            this.selectedIndex = i;
            this.childEvent.emit(this.datas[i]);
          }
      }
    } 

  }

}
