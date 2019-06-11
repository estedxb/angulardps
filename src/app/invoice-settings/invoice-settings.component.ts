import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import {
  DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck,
  PhoneNumber, Address, StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance,
  InvoiceSettings, Language, Contact
} from '../shared/models';
import { TimeSpan } from '../shared/TimeSpan';

@Component({
  selector: 'app-invoice-settings',
  templateUrl: './invoice-settings.component.html',
  styleUrls: ['./invoice-settings.component.css']
})
export class InvoiceSettingsComponent implements OnInit {

  @Input() addRow: string;
  @Input() public FPFormData;
  @Output() public childEvent = new EventEmitter();

  public id = 'ddl_jointcommittee';
  public currentlanguage = 'nl';
  public errorMsg;

  public counter:number =  0;

  // tslint:disable-next-line: variable-name
  private _selectedValueInhaalrust: any; private _selectedIndexInhaalrust: any = 0; private _Inhaalrustvalue: any;

  public disabled = 'true';
  public addNewRow: boolean;
  public removeLastRemove: boolean;

  lieuDaysAllowanceObject: LieuDaysAllowance;
  sicknessInvoiced: boolean;
  holidayInvoiced: boolean;
  compensatoryRest: boolean;
  ploegpremieSwitch: boolean;
  andreSwitch: boolean;
  public disableWorkCodes: boolean;

  payId: boolean;
  mobileBoxText: string;

  mobilityAllowanceObject: MobilityAllowance;
  shiftAllowance: boolean;
  shiftAllowanceObject: ShiftAllowance;
  otherAllowanceObject: OtherAllowance;
  shiftAllowances: ShiftAllowance[] = [];
  otherAllowances: OtherAllowance[] = [];
  shiftAllowanceCounter: number;
  otherAllowanceCounter: number;
  dataDropDown: string[];
  datacurrencyDropDown: string[];
  selectedIndexCurrency:boolean;

  public ISForm: FormGroup;

  public form: FormGroup;
  public Ploegpremiere: FormArray;

  public workCode:string[] = [];
  public workCodeArray:any = [];

  public formNew: FormGroup;
  public Andre: FormArray;

  public loadSwitchInhaalrust:boolean;
  public loadSwitchSickness:boolean;
  public loadSwitchHolidays:boolean;
  public loadSwitchMobility:boolean;
  public loadSwitchTeam:boolean;
  public loadSwitchOther:boolean;

  public currencyChoice:number = 0;
  public currencyNewChoice:number = 0;

  constructor(private fb: FormBuilder) { } 

  /***** Drop Down functions and variables for calendar days  ********************************************/
     private _selectedValuenominal: any; private _selectedIndexnominal: any = 0; private _nominalvalue: any;
     set selectedValueNominal(value: any) {  this._selectedValuenominal = value; }
     get selectedValueNominal(): any { return this._selectedValuenominal; }
     set selectedIndexNominal(value: number) { this._selectedIndexnominal = value; this.valueNominal = this.datacurrencyDropDown[this.selectedIndexNominal]; }
     get selectedIndexNominal(): number { return this._selectedIndexnominal; }
     set valueNominal(value: any) { this._nominalvalue = value; }
     get valueNominal(): any { return this._nominalvalue; }
     resetToInitValueNominal() { this.value = this.selectedValueNominal; }
     SetInitialValueNominal() { if (this.selectedValueNominal === undefined) {   this.selectedValueNominal = this.datacurrencyDropDown[this.selectedIndexNominal]; }}
  
  /********************************************** DropDown  Inhaalrust drop down *************************/
  set selectedValue(value: any) { this._selectedValueInhaalrust = value; }
  get selectedValue(): any { return this._selectedValueInhaalrust; }
  set selectedIndex(value: number) { this._selectedIndexInhaalrust = value; this.value = this.dataDropDown[this.selectedIndex]; }
  set selectedIndexCurrencyShiftAllowance(value: number) {
    this._selectedIndexInhaalrust = value; this.value = this.datacurrencyDropDown[this.selectedIndex];
  }
  set selectedIndexCurrencyOtherAllowance(value: number) {
    this._selectedIndexInhaalrust = value; this.value = this.datacurrencyDropDown[this.selectedIndex];
  }
  get selectedIndex(): number {
    return this._selectedIndexInhaalrust;
  }
  set value(value: any) { this._Inhaalrustvalue = value; }
  get value(): any { return this._Inhaalrustvalue; }
  resetToInitValue() { this.value = this.selectedValue; }
  SetInitialValue() { if (this.selectedValue === undefined) { this.selectedValue = this.dataDropDown[this.selectedIndex]; } }

  changeObject() {

    let jsonObject: any = {
      'lieuDaysAllowance': this.lieuDaysAllowanceObject,
      'sicknessInvoiced': this.sicknessInvoiced,
      'holidayInvoiced': this.holidayInvoiced,
      'mobilityAllowance': this.mobilityAllowanceObject,
      'shiftAllowance': this.shiftAllowance,
      'shiftAllowances': this.shiftAllowances,
      'otherAllowances': this.otherAllowances
    };

    this.childEvent.emit(jsonObject);

  }

  onChangeDropDownCurrencyTeam($event, i) {

    this.selectedIndexCurrencyShiftAllowance = $event.target.value;

    if (this.value === '€') {
      this.shiftAllowances[i].nominal = true;
      this.changeObject();
    }
    else {
      this.shiftAllowances[i].nominal = false;
      this.changeObject();
    }

    return this.value;
  }

  onChangeDropDownCurrencyOther($event, i) {

    this.selectedIndexCurrencyOtherAllowance = $event.target.value;

    if (this.value === '€') {
      this.otherAllowances[i].nominal = true;
      this.changeObject();
    }
    else {
      this.otherAllowances[i].nominal = false;
      this.changeObject();
    }

    return this.value;
  }

  onChangeDropDown($event) {
    this.selectedIndex = $event.target.value;

    if (this.value === 'Betaald')
      this.lieuDaysAllowanceObject.payed = true;
    else
      this.lieuDaysAllowanceObject.payed = false;

    this.changeObject();

    return this.value;
  }

  ngDoCheck() {

    // console.log("invoice-settings FPFormData received =");
    // console.log(this.FPFormData);

    this.loadSwitchInhaalrust = false;
    this.loadSwitchSickness = false;
    this.loadSwitchHolidays = false;
    this.loadSwitchMobility = false;
    this.loadSwitchTeam = false;
    this.loadSwitchOther = true;

    if(this.FPFormData !== undefined && this.FPFormData !== null)
    {
      if(this.FPFormData.data !== null && this.FPFormData.page==="edit")
      {
        if(this.FPFormData.data.invoiceSettings !== null && this.FPFormData.data.invoiceSettings !== undefined)
        {
          if(this.FPFormData.data.invoiceSettings.lieuDaysAllowance !== null && this.FPFormData.data.invoiceSettings.lieuDaysAllowance !== undefined)
          {

            if(this.FPFormData.data.invoiceSettings.lieuDaysAllowance.enabled !== null && this.FPFormData.data.invoiceSettings.mobilityAllowance.enabled !== undefined)
              this.loadSwitchInhaalrust = this.FPFormData.data.invoiceSettings.lieuDaysAllowance.enabled;

            if(this.FPFormData.data.invoiceSettings.mobilityAllowance.enabled !== null && this.FPFormData.data.invoiceSettings.mobilityAllowance.enabled !== undefined)
              this.loadSwitchMobility = this.FPFormData.data.invoiceSettings.mobilityAllowance.enabled;

            this.loadSwitchSickness = this.FPFormData.data.invoiceSettings.sicknessInvoiced;
            this.loadSwitchHolidays = this.FPFormData.data.invoiceSettings.holidayInvoiced;
            this.loadSwitchTeam = this.FPFormData.data.invoiceSettings.shiftAllowance;
            this.loadSwitchOther = true;

            if(this.loadSwitchMobility === true)
            {
              this.ISForm.get('mobilebox').enable();
              this.ISForm.controls.mobilebox.setValue(this.FPFormData.data.invoiceSettings.mobilityAllowance.amountPerKm);
            }
            else
            {
              this.ISForm.get('mobilebox').disable();
              this.ISForm.controls.mobilebox.setValue(this.FPFormData.data.invoiceSettings.mobilityAllowance.amountPerKm);
            }

            if(this.loadSwitchTeam === true)
            {
              this.ISForm.get('PloegprimeBox1').enable();
              this.ISForm.get('PloegprimeBox2').enable();
              this.ISForm.get('currency').enable();

              this.ploegpremieSwitch = true;

              let lengthShiftAllowance = this.FPFormData.data.invoiceSettings.shiftAllowances.length;
              this.ISForm.get('PloegprimeBox1').setValue(this.FPFormData.data.invoiceSettings.shiftAllowances[0].shiftName);
              this.ISForm.get('PloegprimeBox2').setValue(this.FPFormData.data.invoiceSettings.shiftAllowances[0].amount);

              if(this.FPFormData.data.invoiceSettings.shiftAllowances[0].nominal === true)
              {
                this._selectedIndexnominal = 0;
                this.currencyChoice = 0;
              }
              else {
                this._selectedIndexnominal = 1;
                this.currencyChoice = 1;
              }

            }

            if(this.loadSwitchOther === true)
            {

              this.ISForm.get('AndreBox1').enable();
              this.ISForm.get('AndreBox2').enable();
              this.ISForm.get('currency').enable();
              this.disableWorkCodes = false;

              let lengthOtherAllowance = this.FPFormData.data.invoiceSettings.otherAllowances.length;

              this.FPFormData.data.invoiceSettings.otherAllowances.forEach(element => {

                if(this.counter < lengthOtherAllowance)
                {
                  if(this.counter===0)
                  {
                    this.workCode[this.counter] = element.codeId;
                    const formGroup = this.Andre.controls[this.counter] as FormGroup;
                    formGroup.controls['AndreBox2'].setValue(element.amount);
                  }
                  else 
                  {
                    this.workCode[this.counter] = element.codeId;
                    this.addAndreRows(element.codeId,element.amount);
                    this.disabled = 'false';
                    this.andreSwitch = true;
                    const formGroup = this.Andre.controls[this.counter] as FormGroup;
                    formGroup.controls['AndreBox2'].setValue(element.amount);
                  }

                  this.counter += 1;  
                }
              });
            }
          }
          //this.changeObject();
        }     
      }
    }

  }

  ngOnInit() {

    this.lieuDaysAllowanceObject = new LieuDaysAllowance();
    this.mobilityAllowanceObject = new MobilityAllowance();

    this.lieuDaysAllowanceObject.enabled = false;
    this.lieuDaysAllowanceObject.payed = false;

    this.mobilityAllowanceObject.enabled = false;
    this.mobilityAllowanceObject.amountPerKm = 0;

    this.shiftAllowanceObject = new ShiftAllowance();
    this.otherAllowanceObject = new OtherAllowance();

    this.shiftAllowanceObject.timeSpan = "";

    this.shiftAllowances = [];

    this.shiftAllowanceCounter = 1;
    this.otherAllowanceCounter = 1;

    this.shiftAllowances.push(this.shiftAllowanceObject);

    if(this.otherAllowances.length === 0)
      this.otherAllowances.push(this.otherAllowanceObject);

    this.dataDropDown = ['betaald', 'niet betaald'];
    this.datacurrencyDropDown = ['€', '%'];

    this.ISForm = new FormGroup({

      inhaalrust: new FormControl(''),
      mobilebox: new FormControl(''),
      currency: new FormControl(''),

      PloegprimeBox1: new FormControl(''),
      PloegprimeBox2: new FormControl(''),
      PloegprimeBox3: new FormControl(''),

      arrayBox: this.fb.array([
        this.createFirstServant()
      ]),

      AndreBox1: new FormControl(''),
      AndreBox2: new FormControl(''),
      AndreBox3: new FormControl(''),
            
      arrayAndreBox: this.fb.array([
        this.createAndre('','')
      ])

    });

    // set Ploegpremiere to the form control containing contacts
    this.Ploegpremiere = this.ISForm.get('arrayBox') as FormArray;
    this.Andre = this.ISForm.get('arrayAndreBox') as FormArray;

    this.ISForm.get('mobilebox').disable();
    this.ISForm.get('PloegprimeBox1').disable();
    this.ISForm.get('PloegprimeBox2').disable();
    this.ISForm.get('PloegprimeBox3').disable();
    this.ISForm.get('inhaalrust').disable();

    this.ISForm.get('AndreBox1').disable();
    this.ISForm.get('AndreBox2').disable();
    this.ISForm.get('currency').disable();

    this.disabled = 'true';
    this.disableWorkCodes = true;

    this.ploegpremieSwitch = false;
    this.andreSwitch = false;

    this.changeObject();

    if (this.selectedValue === undefined) { this.SetInitialValue(); }

  }

  onTeamChange($event) {

    this.ploegpremieSwitch = $event;

    if ($event === true) {
      this.shiftAllowance = true;
      this.ISForm.get('PloegprimeBox1').enable();
      this.ISForm.get('PloegprimeBox2').enable();
      this.ISForm.get('PloegprimeBox3').enable();
      this.ISForm.get('currency').enable();
      this.disabled = 'false';
    }
    else {
      this.shiftAllowance = false;
      this.ISForm.get('PloegprimeBox1').disable();
      this.ISForm.get('PloegprimeBox2').disable();
      this.ISForm.get('PloegprimeBox3').disable();
      this.ISForm.get('currency').disable();
      this.disabled = 'true';
      this.clearShiftAllowances();
    }

      this.changeObject();

  }

  isInvalid() {

    // console.log('is invalid =');
    // console.log(this.ploegpremieSwitch);

    if (this.ploegpremieSwitch === true) {
      return false;
    }

    return true;
  }

  isInvalidOther() 
  {

    // console.log('is invalid andre =');
    // console.log(this.andreSwitch);

    if (this.andreSwitch === true) {
      return false;
    }

    return true;
  }

  clearOtherAllowances() {

    this.ISForm.controls['AndreBox1'].setValue('');
    this.ISForm.controls['AndreBox2'].setValue('');

    for (var j = 0; j < this.otherAllowances.length; j++) {
      this.otherAllowances[j].codeId = 0;
      this.otherAllowances[j].amount = 0;
      this.otherAllowances[j].nominal = true;
    }

  }

  clearShiftAllowances() {

    this.ISForm.controls['PloegprimeBox1'].setValue('');
    this.ISForm.controls['PloegprimeBox2'].setValue('');

    for (let i = 0; i < this.shiftAllowances.length; i++) {
      this.shiftAllowances[i].shiftName = '';
      this.shiftAllowances[i].amount = 0;
      this.shiftAllowances[i].timeSpan = "02:02:02";
      this.shiftAllowances[i].nominal = true;
    }

  }

  setPgBox1(value, i: number) {
    this.shiftAllowances[i].shiftName = value;
    this.changeObject();
  }

  setPgBox2(value, j: number) {
    this.shiftAllowances[j].amount = parseInt(value,10);
    this.changeObject();
  }

  setPgABox1(value:number, k: number) {
    this.otherAllowances[k].codeId = value;
    this.changeObject();
  }

  setPgABox2(value, l: number) {
    this.otherAllowances[l].amount = parseInt(value,10);
    this.changeObject();
  }

  receiveWorkCode($event, k: number) {
    // console.log('workcode received is=' + $event);

    // setting the value in the array
    if (this.andreSwitch === true) {
      this.otherAllowances[k].codeId = $event;
      this.changeObject();
    }
  }

  onChangeZ(event) {
    this.sicknessInvoiced = event;
    this.changeObject();

  }
  onChangeF(event) {
    this.holidayInvoiced = event;
    this.changeObject();
  }

  onChangeM(event) {
    this.holidayInvoiced = event;

    if (event === true) {
      this.ISForm.get('mobilebox').enable();
      this.mobilityAllowanceObject.enabled = true;
    } else {
      this.ISForm.get('mobilebox').disable();
      this.mobilityAllowanceObject.enabled = false;
    }

    this.changeObject();
  }

  onChangeI(event) {

    this.compensatoryRest = event;

    if (event === true) {
      this.ISForm.get('inhaalrust').enable();
      this.lieuDaysAllowanceObject.enabled = true;
    } else {
      this.ISForm.get('inhaalrust').disable();
      this.lieuDaysAllowanceObject.enabled = false;
    }

    this.changeObject();

  }

  setMobileBox(value: number) {
    // this.mobileBoxText = value;
    this.mobilityAllowanceObject.enabled = false;
    this.mobilityAllowanceObject.amountPerKm = value;
    this.changeObject();
  }

  setInhaalrust(value: boolean) {
    this.payId = value;

    this.lieuDaysAllowanceObject.enabled = true;
    this.lieuDaysAllowanceObject.payed = value;
    this.changeObject();
  }

  onMealM(event) {
    if (event === true) {
      this.ISForm.get('arrayBox').enable();
    } else {
      this.ISForm.get('arrayBox').disable();
    }
    this.changeObject();

  }

  onChangeA($event) {

    this.andreSwitch = $event;

    if ($event === true) {
      this.ISForm.get('arrayAndreBox').enable();
      // this.ISForm.get('AndreBox1').enable();
      this.disableWorkCodes = false;
      this.ISForm.get('AndreBox2').enable();
      this.ISForm.get('currency').enable();
      this.disabled = 'false';
    } else {
      this.ISForm.get('arrayAndreBox').disable();
      // this.ISForm.get('AndreBox1').disable();
      this.disableWorkCodes = true;
      this.ISForm.get('AndreBox2').disable();
      this.ISForm.get('currency').disable();
      this.disabled = 'true';
      this.clearOtherAllowances();
    }
    this.changeObject();

  }

  createAndre(value1,value2): FormGroup {
    this.addNewRow = false;
    this.removeLastRemove = true;

    return this.fb.group({
      AndreBox1: new FormControl(value1),
      AndreBox2: new FormControl(value2),
      currency: new FormControl(''),
    });

  }

  createFirstServant(): FormGroup {
    this.addNewRow = false;
    this.removeLastRemove = true;

    return this.fb.group({
      PloegprimeBox1: new FormControl(''),
      PloegprimeBox2: new FormControl(''),
      PloegprimeBox3: new FormControl(''),
    });
  }

  createServants(): FormGroup {
    this.addNewRow = false;
    this.removeLastRemove = false;

    return this.fb.group({
      PloegprimeBox1: new FormControl(''),
      PloegprimeBox2: new FormControl(''),
      PloegprimeBox3: new FormControl(''),
    });

  }

  get arrayAndreBox() {
    return this.Andre.get('arrayAndreBox') as FormArray;
  }

  addAndreRows(value1,value2) {
    this.Andre.push(this.createAndre(value1,value2));
    this.otherAllowanceObject = new OtherAllowance();
    this.otherAllowanceObject.codeId = value1;
    this.otherAllowanceObject.amount = value2;
    this.otherAllowances.push(this.otherAllowanceObject);
    this.otherAllowanceCounter++;
  }

  removeAndreRows(index) {
    if (this.Andre.length != 1)
      this.Andre.removeAt(index);
    this.otherAllowances.splice(index, 1);
    this.changeObject();
  }


  get arrayBox() {
    return this.Ploegpremiere.get('arrayBox') as FormArray;
  }

  addRows() {

    this.Ploegpremiere.push(this.createServants());
    this.shiftAllowanceObject = new ShiftAllowance();
    this.shiftAllowanceObject.timeSpan = "02:02:02";
    this.shiftAllowances.push(this.shiftAllowanceObject);
    this.shiftAllowanceCounter++;
  }

  removeRows(index) {
    if (this.Ploegpremiere.length != 1)
      this.Ploegpremiere.removeAt(index);

    // remove from array shiftAllowances
    this.shiftAllowances.splice(index, 1);

    this.changeObject();
  }

  replaceRows(index) {

  }



}




