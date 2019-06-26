
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { LegalForm, Forms } from '../../shared/models';
import { LegalformService } from '../../shared/legalform.service';
import { LoggingService } from './../../shared/logging.service';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styles: ['']
})
export class LegalComponent implements OnInit {
  public id = 'ddl_legalform';
  public currentlanguage = 'nl';
  public errorMsg;
  public maindatas: any = [];
  public datas: any = [];
  public oldlegalFormData;
  public selectedString: string;

  @Input() public legalFormData;
  @Output() public childEvent = new EventEmitter();

  // tslint:disable-next-line: variable-name
  private _selectedValue: any; private _selectedIndex: any = 0; private _value: any;

  set selectedValue(value: any) { this._selectedValue = value; }

  get selectedValue(): any { return this._selectedValue; }

  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.datas[this.selectedIndex]; }

  get selectedIndex(): number { return this._selectedIndex; }

  set value(value: any) { this._value = value; }

  get value(): any { return this._value; }

  resetToInitValue() { this.value = this.selectedValue; }

  SetInitialValue() { this.selectedValue = this.datas[this.selectedIndex]; }

  ngDoCheck() {

    if (this.legalFormData !== this.oldlegalFormData) {
      this.oldlegalFormData = this.legalFormData;
      this.loadInitialData(this.datas);
    }

  }

  ngAfterViewInit() {

    if (this.legalFormData !== this.oldlegalFormData) {
      this.oldlegalFormData = this.legalFormData;
      this.loadInitialData(this.datas);
    }
  }

  loadInitialData(datas: any) {


    if (datas.length !== 0) {

      for (let i = 0; i < this.datas.length; i++) {
        if (this.datas[i].FormName === this.legalFormData) {
          this._selectedIndex = i;
        }
      }

    } else {
      this.logger.log('null or undefined');
    }

  }

  onChange($event) {
    this.selectedIndex = $event.target.value;

    this.selectedString = this.value.FormName;

    this.childEvent.emit(this.value.FormName);

    return this.value;
  }

  constructor(private legalformService: LegalformService, private logger: LoggingService) {
  }

  ngOnInit() {


    this.legalformService.getLegalForms().subscribe(legalforms => {
      this.maindatas = legalforms;
      this.datas = this.maindatas[this.currentlanguage];

      this.childEvent.emit(this.datas[0].FormName);

      this.loadInitialData(this.datas);
    }, error => this.errorMsg = error);

    if (this.selectedValue === undefined) { this.SetInitialValue(); }
  }

}

// this.logger.log(this.id); this.logger.log($event.target.value);
// this.logger.log('Legal Forms Selected Data ::'); this.logger.log(this.value);

/*
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { LoggingService } from '../../shared/logging.service';

export const COMPONENT_NAME_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ComponentNameComponent),
  multi: true
};

@Component({
  selector: 'selector-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css'],
  providers: [COMPONENT_NAME_VALUE_ACCESSOR]
})
export class ComponentNameComponent implements OnInit, ControlValueAccessor {

  private _value: any;

  set value(value: any) {
    this._value = value;
    this.notifyValueChange();
  }

  get value(): any {
    return this._value;
  }

  onChange: (value) => {};
  onTouched: () => {};

  constructor() { }

  notifyValueChange(): void {
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  ngOnInit(): void {

  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }
}
*/
