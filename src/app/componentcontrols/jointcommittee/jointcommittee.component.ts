import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { ParitairCommitee } from '../../shared/models';
import { JointcommitteeService } from '../../shared/jointcommittee.service';
import { compileBaseDefFromMetadata } from '@angular/compiler';
// import { $ } from 'jquery';
import { LoggingService } from '../../shared/logging.service';

@Component({
  selector: 'app-jointcommittee',
  templateUrl: './jointcommittee.component.html',
  styles: ['']
})

export class JointcommitteeComponent implements OnInit {

  @Input() public JCFormData;
  @Input() public TypeWorker;
  @Output() public childEvent = new EventEmitter();

  public id = 'ddl_jointcommittee';
  public currentlanguage = 'nl';
  public errorMsg;
  public datas: any = [];
  public stringJCReceived: string;

  // tslint:disable-next-line: variable-name
  private _selectedValue: any; private _selectedIndex: any = 0; private _value: any;

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
    const obj: any = { selectedObject: this.value, arrayObject: this.datas };
    this.childEvent.emit(obj);
    // this.logger.log(this.value);
    return this.value;
  }

  constructor(private jointcommitteeService: JointcommitteeService, private logger: LoggingService) {
  }

  ngDoCheck() {
    if (this.JCFormData !== undefined) {
      this.loadDropDownData(this.JCFormData);
    }
  }

  filterDatas(datas) {

    this.logger.log('filtering the data from array');
    this.logger.log(datas.length);

    this.logger.log('current typeworker = ' + this.TypeWorker);

    this.datas = [];

    for (let counter = 0; counter < datas.length; counter += 1) {

      if (this.TypeWorker.toLowerCase() === datas[counter].type.toLowerCase()) {
        this.datas.push(datas[counter]);
      }
    }

    this.logger.log('filtered Array');
    this.logger.log(this.datas);

  }

  ngOnInit() {

    this.resetToInitValue();

    this.jointcommitteeService.getJointCommitees().
      subscribe(data => { this.filterDatas(data); },
        error => this.errorMsg = error);

    if (this.selectedValue === undefined) { this.SetInitialValue(); }

    this.loadDropDownData(this.stringJCReceived);
  }

  loadDropDownData(stringJCReceived) {
    for (let i = 0; i < this.datas.length; i++) {
      if (this.datas[i] === stringJCReceived) {
        this._selectedIndex = i;
      }
    }
  }

}
