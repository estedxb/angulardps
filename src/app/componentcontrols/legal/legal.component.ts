
import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
// import { LegalForm, Forms } from '../../shared/models';
import { LegalformService } from '../../shared/legalform.service';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styles: ['']
})
export class LegalComponent implements OnInit  {
  public id = 'ddl_legalform' ;
  public currentlanguage = 'nl';
  public errorMsg;
  public maindatas: any = [];
  private datas: any = [];
  public selectedString:string;

  @Input('legalFormData') public legalString;
  @Output() public childEvent = new EventEmitter();

  // tslint:disable-next-line: variable-name
  private _selectedValue: any ; private _selectedIndex: any = 0;  private _value: any ;

  set selectedValue(value: any) { this._selectedValue = value; }
  
  get selectedValue(): any { return this._selectedValue; }
  
  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.datas[this.selectedIndex]; }
  
  get selectedIndex(): number { return this._selectedIndex; }
  
  set value(value: any) { this._value = value; }
  
  get value(): any { return this._value; }
  
  resetToInitValue() { this.value = this.selectedValue; }

  SetInitialValue() { 

    console.log("legal data received="+this.legalString);

     if(this.legalString !== "")
     {
        this.selectedValue = this.legalString;
     }
     else
          this.selectedValue = this.datas[this.selectedIndex]; 

}
  
  onChange($event) { this.selectedIndex = $event.target.value; 

    console.log("legalform selected="+this.value);
    console.log(this.value);
    console.log("legalform selected="+this.value.FormName);

    this.selectedString = this.value.FormName;

    this.childEvent.emit(this.value.FormName);    

    return this.value; 
  }

  constructor(private legalformService: LegalformService) { }

  ngOnInit() {

    this.legalformService.getLegalForms().subscribe(legalforms => {
      this.maindatas = legalforms;
      this.datas = this.maindatas[this.currentlanguage];
      console.log('Legal Forms Data : '); console.log(this.datas); 
    }, error => this.errorMsg = error);

    console.log("legalFormData="+this.legalString);

    if (this.selectedValue === undefined) { this.SetInitialValue(); }
  }

}

// console.log(this.id); console.log($event.target.value);
// console.log('Legal Forms Selected Data ::'); console.log(this.value);

/*
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, Input, OnInit, forwardRef } from '@angular/core';

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
