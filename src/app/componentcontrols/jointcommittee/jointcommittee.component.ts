import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
//import { ParitairCommitee } from '../../shared/models';
import { JointcommitteeService } from '../../shared/jointcommittee.service';
import { compileBaseDefFromMetadata } from '@angular/compiler';
// import { $ } from 'jquery';

@Component({
  selector: 'app-jointcommittee',
  templateUrl: './jointcommittee.component.html',
  styles: ['']
})

export class JointcommitteeComponent implements OnInit {

  @Input() public JCFormData;
  @Output() public childEvent = new EventEmitter();

  public id = 'ddl_jointcommittee';
  public currentlanguage = 'nl';
  public errorMsg;
  public datas: any = [];
  public stringJCReceived:string;
  
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
    let obj:any = { "selectedObject": this.value, "arrayObject": this.datas};
    this.childEvent.emit(obj);
    console.log(this.value);
    return this.value; 
  }

  constructor(private jointcommitteeService: JointcommitteeService) { 
  }

  ngDoCheck() 
  {
    console.log("RECEIVED paritair commitee data");

    if(this.JCFormData !== undefined)
    {
        console.log("data=");
        console.log(this.datas);

        this.loadDropDownData(this.JCFormData);

    }
  }

  ngOnInit() {

    this.resetToInitValue();

    this.jointcommitteeService.getJointCommitees().
         subscribe(data => this.datas = data, 
            error => this.errorMsg = error);

    if (this.selectedValue === undefined) { this.SetInitialValue(); }

    this.loadDropDownData(this.stringJCReceived);
  }

  loadDropDownData(stringJCReceived) {
    console.log("received string="+stringJCReceived);
    
    for(let i=0;i<this.datas;i++)
    {
         if(this.datas[i] === stringJCReceived)
         {
           this._selectedIndex = i;
         }
    }
  }

}
