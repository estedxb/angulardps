import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StatuteService } from '../../shared/statute.service';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import {
  DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck,
  PhoneNumber, Address, StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance,
  InvoiceSettings, Language, Contact
} from '../../shared/models';
import { CountriesComponent } from '../countries/countries.component';
import { LoggingService } from 'src/app/shared/logging.service';
import { JointcommitteeService } from 'src/app/shared/jointcommittee.service';


@Component({
  selector: 'app-statute',
  templateUrl: './statute.component.html',
  styles: ['.row{margin-right:0px;margin-left:0px;} .row.panelheader{margin-right:-15px;margin-left:-15px;}']
})
export class StatuteComponent implements OnInit {

  @Input() public STFormData;
  @Output() public childEvent = new EventEmitter();

  public statutes = [];
  public errorMsg;
  public isMealEnabled = [];
  public coefficientArray = [];
  public totalArray = [];
  public wegervaalArray = [];
  public minimumurenArray = [];
  public statutename = '';
  public statuteSelectedString: any;
  public arrayParitairCommitee = [];
  public JCString = [];
  public loadStatuteSettingsArray = [];
  public newIndex;
  public i;
  public oldSFTFormData;
  public titles = [];
  public TypeWorker = [];
  public TempArray = [];

  public MealBox: FormArray;
  SForm: FormGroup;

  public countStatutes: number;
  public statuteSettings = [];
  public newArrayCoeff = [];
  public incrementer = 0;

  StatuteSettingsObject: StatuteSetting;
  statuteObject: Statute;
  jointCommitee: ParitairCommitee;
  mealVoucherSettingsObject: MealVoucherSettings;
  paritarirCommiteeObject: ParitairCommitee;
  coefficient: number;
  newCounter: number = 0;
  lengthStatueSettings: number = 0;
  public datas:any=[];

  constructor(
    private statuteService: StatuteService,
    private fb: FormBuilder,
    private logger: LoggingService,
    private jointcommitteeService: JointcommitteeService
  ) {     }

  setParitairCommitteArray() {

    for (let i = 0; i < this.statutes.length; i++)
      this.arrayParitairCommitee.push(new ParitairCommitee());

    this.createStatuteSettingsArrayEmpty();

    for (let j = 0; j < this.statutes.length; j++) {
      this.isMealEnabled[j] = false;
    }

  }

  // ngOnChanges() {

  //   this.createCoefficientArray();

  //   if(this.STFormData !== undefined && this.STFormData !== null)
  //   if (this.STFormData != this.oldSFTFormData) {
  //     //this.createStatuteSettingsArrayEmpty();
  //     this.oldSFTFormData = this.STFormData;
  //     if (this.STFormData !== undefined && this.STFormData.data !== null && this.STFormData.page === "edit") {
  //       this.loadInitialData();
  //     }
  //   }
  // }

  ngDoCheck() {
    this.createCoefficientArray();

    if (this.STFormData !== undefined && this.STFormData !== null)
      if (this.STFormData != this.oldSFTFormData) {
        //this.createStatuteSettingsArrayEmpty();
        this.oldSFTFormData = this.STFormData;
        if (this.STFormData !== undefined && this.STFormData.data !== null && this.STFormData.page === "edit") {
          this.loadInitialData();
        }
      }
  }

  loadCoefficientArray(data) {

    for (let i: number = 0; i < data.length; i++) {
      this.coefficientArray[i] = data[i].coefficient;
    }

  }

  ngAfterViewInit() {

    if (this.STFormData !== undefined && this.STFormData.data !== null && this.STFormData.page === "edit") {
      if (this.STFormData != this.oldSFTFormData) {
        this.oldSFTFormData = this.STFormData;
        this.loadInitialData();
      }
    }

  }

  loadInitialData() {
    let counter: number = 0;

    this.fillTitles();

    if (this.STFormData.data.statuteSettings !== null && this.STFormData.page === "edit") {

      this.loadStatuteSettingsArray = this.STFormData.data.statuteSettings;
      this.loadCoefficientArray(this.STFormData.data.statuteSettings);

      if (this.loadStatuteSettingsArray !== null && this.loadStatuteSettingsArray !== undefined) {

        this.countStatutes = this.statutes.length;

        this.copyArray(this.loadStatuteSettingsArray);
        this.loadStatuteSettingsArray.forEach(element => {
          this.onloadData(element, counter);
          counter++;
        });

        this.loadCoefficients();

      }
    }
  }


  loadCoefficients() {

    this.newArrayCoeff = [];

    for (let i = 0; i < this.loadStatuteSettingsArray.length; i++)
      this.newArrayCoeff[i] = this.loadStatuteSettingsArray[i].coefficient;

    this.emitData("load");
  }

  cloneArray() {

    let counter: number = 0;

    this.loadStatuteSettingsArray.forEach(element => {
      this.statuteSettings[counter].coefficient = element.coefficient;

      if (element.mealVoucherSettings.totalWorth === 0 && element.mealVoucherSettings.employerShare === 0 && element.mealVoucherSettings.minimumHours === 0)
        this.isMealEnabled[counter] = false;
      else
        this.isMealEnabled[counter] = true;

      this.statuteSettings[counter].mealVoucherSettings = new MealVoucherSettings();
      this.statuteSettings[counter].mealVoucherSettings.totalWorth = element.mealVoucherSettings.totalWorth;
      this.statuteSettings[counter].mealVoucherSettings.employerShare = element.mealVoucherSettings.employerShare;
      this.statuteSettings[counter].mealVoucherSettings.minimumHours = element.mealVoucherSettings.minimumHours;

      counter++;
    });

    this.loadCoefficients();

    this.emitData("cloneArray");

  }


  copyArray(array: any) {

    let counter: number = 0;

    this.statuteSettings.forEach(element => {

      if (element.mealVoucherSettings.employerShare === 0 && element.mealVoucherSettings.totalWorth === 0 && element.mealVoucherSettings.minimumHours === 0)
        this.isMealEnabled[counter] = false;
      else
        this.isMealEnabled[counter] = true;

      counter += 1;
    });

    this.emitData("load");
  }


  createStatuteSettingsArrayEmpty() {

    let counter: number = 0;
    this.lengthStatueSettings = this.statuteSettings.length;

    this.statuteSettings = [];

    for (let counter = 0; counter < this.statutes.length; counter += 1) 
    {
      this.StatuteSettingsObject = new StatuteSetting();
      this.StatuteSettingsObject.mealVoucherSettings = new MealVoucherSettings();

      this.StatuteSettingsObject.mealVoucherSettings.totalWorth = 0.0;
      this.StatuteSettingsObject.mealVoucherSettings.employerShare = 0.0;
      this.StatuteSettingsObject.mealVoucherSettings.minimumHours = 0.0;
      this.StatuteSettingsObject.coefficient = 3.5;

      this.StatuteSettingsObject.paritairCommitee = new ParitairCommitee();
      this.StatuteSettingsObject.paritairCommitee.brightStaffingId = this.arrayParitairCommitee[counter].BrightStaffingCommitteeId;
      this.StatuteSettingsObject.paritairCommitee.name = this.arrayParitairCommitee[counter].name;
      this.StatuteSettingsObject.paritairCommitee.number = this.arrayParitairCommitee[counter].number;
      this.StatuteSettingsObject.paritairCommitee.type = this.arrayParitairCommitee[counter].type;

      this.StatuteSettingsObject.statute = new Statute();
      this.StatuteSettingsObject.statute.name = this.statutes[counter].name;
      this.StatuteSettingsObject.statute.type = this.statutes[counter].type;
      this.StatuteSettingsObject.statute.brightStaffingID = parseInt(this.statutes[counter].BrightStaffingID, 10);

      this.statuteSettings.push(this.StatuteSettingsObject);

    }

    // if(counter > this.statutes.length)
    //     this.emitData("create array empty paritaircommitee");
  }

  fillTitles() {

    for (let counter: number = 0; counter < this.statutes.length; counter += 1) {
      this.titles[counter] = this.statutes[counter].name;
      this.TypeWorker[counter] = this.statutes[counter].type;
    }

    this.countStatutes = this.statutes.length;

    this.loadzeroArray();

  }

  onloadData(arrayElement, counter) {

    this.totalArray[counter] = arrayElement.mealVoucherSettings.totalWorth;
    this.wegervaalArray[counter] = arrayElement.mealVoucherSettings.employerShare;
    this.minimumurenArray[counter] = arrayElement.mealVoucherSettings.minimumHours;
    this.coefficientArray[counter] = arrayElement.coefficient;

    let name = arrayElement.paritairCommitee.name;
    let number = arrayElement.paritairCommitee.number;
    this.JCString[counter] = number + " - " + name;

    // if(arrayElement.mealVoucherSettings.employerShare === 0 && arrayElement.mealVoucherSettings.totalWorth === 0 && arrayElement.mealVoucherSettings.minimumHours === 0)
    //     this.logger.log("all zeroes at counter="+counter);
    // else
    //     this.logger.log("values at counter="+counter);

    if (arrayElement.mealVoucherSettings.employerShare === 0 && arrayElement.mealVoucherSettings.totalWorth === 0 && arrayElement.mealVoucherSettings.minimumHours === 0)
      this.isMealEnabled[counter] = false;
    else
      this.isMealEnabled[counter] = true;

    if (this.statuteSettings.length > 0) {
      this.StatuteSettingsObject = new StatuteSetting();

      this.StatuteSettingsObject.mealVoucherSettings = new MealVoucherSettings();
      this.StatuteSettingsObject.mealVoucherSettings.totalWorth = arrayElement.mealVoucherSettings.totalWorth;
      this.StatuteSettingsObject.mealVoucherSettings.employerShare = arrayElement.mealVoucherSettings.employerShare;
      this.StatuteSettingsObject.mealVoucherSettings.minimumHours = arrayElement.mealVoucherSettings.minimumHours;

      this.StatuteSettingsObject.coefficient = arrayElement.coefficient;

      this.StatuteSettingsObject.paritairCommitee = new ParitairCommitee();
      this.StatuteSettingsObject.paritairCommitee.brightStaffingId = arrayElement.paritairCommitee.BrightStaffingCommitteeId;
      this.StatuteSettingsObject.paritairCommitee.name = arrayElement.paritairCommitee.name;
      this.StatuteSettingsObject.paritairCommitee.number = arrayElement.paritairCommitee.number;
      this.StatuteSettingsObject.paritairCommitee.type = arrayElement.paritairCommitee.type;

      this.StatuteSettingsObject.statute = new Statute();

      if (this.statutes !== undefined && this.statutes.length > 0) {
        if (this.statutes[counter].name !== undefined && this.statutes[counter].type !== undefined && this.statutes[counter].BrightStaffingID !== undefined) {
          this.StatuteSettingsObject.statute.name = this.statutes[counter].name;
          this.StatuteSettingsObject.statute.type = this.statutes[counter].type;
          this.StatuteSettingsObject.statute.brightStaffingID = parseInt(this.statutes[counter].BrightStaffingID, 10);
        }
      }

      this.statuteSettings[counter] = this.StatuteSettingsObject;

    }
  }

  createControls(Coefficient, TotalWorth, EmployerShare, MinimumHours) {

    return this.fb.group({
      CoefficientBox: new FormControl(Coefficient, [Validators.required, Validators.pattern('^[0-9]$')]),
      arrayBox: this.fb.array([
        this.createBox(TotalWorth, EmployerShare, MinimumHours)
      ]),
    });

  }

  createBox(TotalWorth, EmployerShare, MinimumHours) {

    return this.fb.group({
      TotalWaarde: new FormControl(TotalWorth),
      Wergeversdeel: new FormControl(EmployerShare),
      minimumHours: new FormControl(MinimumHours)
    });

  }

  addArray() {
    //this.arrayBox.push(this.createBox());
  }

  get arrayBox() {

    return <FormArray>this.SForm.get('arrayBox') as FormArray;

    // return <FormArray>this.SForm.get('arrayBox') as FormArray;
  }

  get statuteArray() {
    return <FormArray>this.SForm.get('statuteArray') as FormArray;
  }

  addControls(Coefficient, TotalWorth, EmployerShare, MinimumHours) {

    if (this.statuteArray.length !== this.statutes.length)
      this.statuteArray.push(this.createControls(Coefficient, TotalWorth, EmployerShare, MinimumHours));

  }

  ngOnInit() {
    this.SForm = new FormGroup({
      statuteArray: this.fb.array([]),
      coefficientBox: new FormControl(),
      checkbox: new FormControl()
    });

    this.jointcommitteeService.getJointCommitees().
    subscribe(data => { 
      this.datas = data;
      this.onpageInit();
     },
      error => this.errorMsg = error);
  }
  onpageInit(){    
    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;

      this.fillTitles();
      this.setParitairCommitteArray();

      this.countStatutes = data.length;

      if (this.statutes.length !== 0) {
        this.emitData("ngOnit");
      }

    }, error => this.errorMsg = error);

    if (this.countStatutes > 0) {
      if (this.STFormData.data === null || this.STFormData.data === undefined)
        this.loadCoefficientsEmpty();
      else
        this.cloneArray();
    }
  }

  loadData() {

    if (this.STFormData !== undefined && this.STFormData !== null)
      if (this.STFormData != this.oldSFTFormData) {
        this.oldSFTFormData = this.STFormData;
        if (this.STFormData !== undefined && this.STFormData.data !== null && this.STFormData.page === "edit") {
          this.loadInitialData();
        }
      }

  }

  loadCoefficientsEmpty() {

    this.logger.log("load coefficients called");

    this.newArrayCoeff = [];

    for (let i = 0; i < this.countStatutes; i++)
      this.newArrayCoeff[i] = 3.5;


    this.emitData("load");
  }

  fillMealEnabled() {

    let counter: number = 0;

    this.statuteSettings.forEach(element => {

      if (element.mealVoucherSettings.employerShare === 0 && element.mealVoucherSettings.totalWorth === 0 && element.mealVoucherSettings.minimumHours === 0)
        this.isMealEnabled[counter] = false;
      else
        this.isMealEnabled[counter] = true;

      counter += 1;
    });

  }

  createCoefficientArray() {

    for (let i: number = 0; i < this.countStatutes; i++) {
      this.coefficientArray[i] = 3.5;
      this.newArrayCoeff[i] = 3.5;
    }

  }

  onChangeCoefficient(value: number, i: number) {
    this.coefficient = value;
    this.coefficientArray[i] = value;

    //Coefficient can only be 3.5 at most! 
    if (value > 3.5)
      this.replaceArrayCoefficient(3.5, i);
    else
      this.replaceArrayCoefficient(value, i);

  }

  onMealChange($event, ctrlid: number) {

    if (ctrlid >= 0 && ctrlid < this.countStatutes) {
      this.isMealEnabled[ctrlid] = $event;
      // this.logger.log("event="+event);
    }
  }

  loadzeroArray() {

    for (let i: number = 0; i < this.statutes.length; i++) {
      this.totalArray.push(0.0);
      this.wegervaalArray.push(0.0);
      this.minimumurenArray.push(0.0);
    }

  }

  createArrayData() {
    this.emitData("createArray data");
  }

  totalChange(value: number, i) {

    if (this.isMealEnabled[i] === true) {
      this.totalArray[i] = value;
      this.replaceArrayTotal(i);
    }
  }

  changeTotalBox1(value: number, k: number) {
    this.MealBox[k].Totalwaarde = value;
    //this.changeObject();
  }


  WergeversdeelChange(value: number, i) {
    if (this.isMealEnabled[i] === true) {
      this.wegervaalArray[i] = value;
      this.replaceArrayWergever(i);
    }
  }

  minimumUrenChange(value: number, i) {
    if (this.isMealEnabled[i] === true) {
      this.minimumurenArray[i] = value;
      this.replaceArrayMinimum(i);
    }
  }

  receiveJTdata($event, i) 
  {

    this.statuteSelectedString = $event.selectedObject;

    if($event.selectedObject !== null && $event.selectedObject !== undefined )
    {
      this.arrayParitairCommitee[i] = new ParitairCommitee();
      this.paritarirCommiteeObject = new ParitairCommitee();    
  
      this.paritarirCommiteeObject.brightStaffingId = $event.selectedObject.BrightStaffingCommitteeId;
      this.paritarirCommiteeObject.name = $event.selectedObject.name;
      this.paritarirCommiteeObject.number = $event.selectedObject.number;
      this.paritarirCommiteeObject.type = $event.selectedObject.type;
  
      this.arrayParitairCommitee[i] = this.paritarirCommiteeObject;
  
      if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) 
      {
        this.replaceArray(i);
      } 
      else {
        this.createArrayData();
        this.replaceArray(i);
      }
  
      this.emitData("JT");
    }

  }

  replaceArrayWergever(i: number) {

    this.logger.log("current statute settings");
    this.logger.log(this.statuteSettings);

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.employerShare = parseFloat(this.wegervaalArray[i]);
    }
    //else {
    //   this.createArrayData();
    // }
    
    this.emitData("replace array Wergever");

  }

  replaceArrayTotal(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.totalWorth = parseFloat(this.totalArray[i]);
    }
    // } else {
    //   this.createArrayData();
    // }
    this.emitData("replace array total");

  }

  replaceArrayMinimum(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.minimumHours = parseFloat(this.minimumurenArray[i]);
    }
    //else {
    //   this.createArrayData();
    // }

    this.emitData("replace array minimum");
  }


  replaceArrayCoefficient(value: number, i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].coefficient = value;
    }

    this.emitData("replace array coefficient");

  }

  replaceArray(i: number) {

    this.cloneArray();

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) 
    {
      this.statuteSettings[i].paritairCommitee.brightStaffingId = this.statuteSelectedString.BrightStaffingCommitteeId;
      this.statuteSettings[i].paritairCommitee.name = this.statuteSelectedString.name;
      this.statuteSettings[i].paritairCommitee.type = this.statuteSelectedString.type;
      this.statuteSettings[i].paritairCommitee.number = this.statuteSelectedString.number;
    }
    this.emitData("replace Array");
  }

  emitData(message: string) {
    this.childEvent.emit(this.statuteSettings);
  }

}
