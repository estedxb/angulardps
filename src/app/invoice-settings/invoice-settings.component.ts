import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import {
  DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck,
  PhoneNumber, Address, StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance,
  InvoiceSettings, Language, Contact
} from '../shared/models';
import { TimeSpan } from '../shared/TimeSpan';
import { LoggingService } from '../shared/logging.service';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

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

  public counter: number = 0;
  public newcounter: number = 0;

  public oldFPFormData: any = {};

  // tslint:disable-next-line: variable-name

  public addNewRow: boolean;
  public removeLastRemove: boolean;

  lieuDaysAllowanceObject: LieuDaysAllowance;
  sicknessInvoiced: boolean;
  holidayInvoiced: boolean;
  compensatoryRest: boolean;
  ploegpremieSwitch: boolean;
  mobilitySwitch: boolean;
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
  currencyDataShift = [];
  currencyDataOther = [];
  shiftAllowanceCounter: number;
  otherAllowanceCounter: number;
  dataDropDown: string[];
  datacurrencyDropDown: string[];
  selectedIndexCurrency: boolean;

  public ISForm: FormGroup;

  public form: FormGroup;
  public Ploegpremiere: FormArray;

  public workCode: string[] = [];
  public workCodeArray: any = [];

  public formNew: FormGroup;
  public Andre: FormArray;

  public loadSwitchInhaalrust: boolean;
  public loadSwitchSickness: boolean;
  public loadSwitchHolidays: boolean;
  public loadSwitchMobility: boolean;
  public loadSwitchTeam: boolean;
  public loadSwitchOther: boolean;

  public tCoefficient: any = "1.20";
  public mCoefficient: any = "1.69";
  public echoValue: any = "1.69";
  public dimonaValue: any = "0.3510";

  public currencyShift: string = "";
  public currencyOther: string = "";

  constructor(
    private fb: FormBuilder,
    // private spinner: NgxUiLoaderService,
    private logger: LoggingService) { }

  /********************************************** DropDown  Inhaalrust drop down *************************/
  private _selectedValue: any; private _selectedIndex: any = 0; private _value: any;

  set selectedValue(value: any) { this._selectedValue = value; }
  get selectedValue(): any { return this._selectedValue; }
  set selectedIndex(value: number) { this._selectedIndex = value; this.value = this.dataDropDown[this.selectedIndex]; }
  get selectedIndex(): number { return this._selectedIndex; }
  set value(value: any) { this._value = value; }
  get value(): any { return this._value; }
  resetToInitValue() { this.value = this.selectedValue; }

  SetInitialValue() {
    if (this.selectedValue === undefined) {
      this._selectedIndex = 0;
      this.selectedValue = this.dataDropDown[this._selectedIndex];
    }
  }

//   Contract not valid: Dimona cost has to be at least 0.3300!
// Contract not valid: Dimona cost can only be 0.3510 at most!
// Contract not valid: Coefficient can only be 3.5 at most! 
// Contract not valid: Gross salary has to be at least 5!

  changeObject() {

    this.tCoefficient = parseFloat(this.ISForm.get('Verplaatsingen').value);
    this.mCoefficient = parseFloat(this.ISForm.get('Maalticheques').value);
    this.echoValue = parseFloat(this.ISForm.get('Echo').value);
    this.dimonaValue = parseFloat(this.ISForm.get('Dimona').value);

    // if(this.dimonaValue < environment.DimonaCostMinium || this.dimonaValue > environment.DimonaCostMaximum)
    // {
    // }
      

    if(this.ISForm.get('mobilebox').value === "")
      this.mobilityAllowanceObject.amountPerKm = 0;
    else     
      this.mobilityAllowanceObject.amountPerKm = parseFloat(this.ISForm.get('mobilebox').value);

    this.mobilityAllowanceObject.enabled = this.mobilitySwitch;

    let jsonObject: any = {
      'lieuDaysAllowance': this.lieuDaysAllowanceObject,
      'sicknessInvoiced': this.sicknessInvoiced,
      'holidayInvoiced': this.holidayInvoiced,
      'mobilityAllowance': this.mobilityAllowanceObject,
      'shiftAllowance': this.ploegpremieSwitch,
      'shiftAllowances': this.shiftAllowances,
      'otherAllowance': this.andreSwitch,
      'otherAllowances': this.otherAllowances,
      'transportCoefficient': this.tCoefficient,
      'mealvoucherCoefficient': this.mCoefficient,
      'ecoCoefficient': this.echoValue,
      'dimonaCost': this.dimonaValue
    };

    this.childEvent.emit(jsonObject);

  }

  onChangeDropDownCurrencyTeam($event, i) {

    // this.logger.log("change detected");

    if ($event === '€') {
      this.shiftAllowances[i].nominal = false;
      this.currencyDataShift[i] = '€';
      this.currencyShift = "€";
      this.changeObject();
    }
    else {
      this.shiftAllowances[i].nominal = true;
      this.currencyDataShift[i] = '%';
      this.currencyShift = "%";
      this.changeObject();
    }

  }

  onChangeDropDownCurrencyOther($event, i) {

    if ($event === '€') {
      this.otherAllowances[i].nominal = false;
      this.currencyDataOther[i] = '€';
      this.currencyOther = "€";
      this.changeObject();
    }
    else {
      this.otherAllowances[i].nominal = true;
      this.currencyDataOther[i] = '%';
      this.currencyOther = "%";
      this.changeObject();
    }

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

    //load Edit Page details
    if (this.FPFormData !== undefined && this.FPFormData !== null) {
      if (this.FPFormData.data !== null && this.FPFormData.data !== undefined) {
        if (this.oldFPFormData !== this.FPFormData) 
        {
          this.oldFPFormData = this.FPFormData;

          this.currencyDataOther = [];
          this.currencyDataShift = [];

          if (this.FPFormData.data.invoiceSettings !== null && this.FPFormData.data.invoiceSettings !== undefined) 
          {

            this.loadSwitchSickness = this.FPFormData.data.invoiceSettings.sicknessInvoiced;
            this.sicknessInvoiced = this.loadSwitchSickness;
            this.loadSwitchHolidays = this.FPFormData.data.invoiceSettings.holidayInvoiced;
            this.holidayInvoiced = this.loadSwitchHolidays;

            this.loadSwitchTeam = this.FPFormData.data.invoiceSettings.shiftAllowance;
            this.ploegpremieSwitch = this.FPFormData.data.invoiceSettings.shiftAllowance;
            this.loadSwitchOther = this.FPFormData.data.invoiceSettings.otherAllowance;
            this.andreSwitch = this.FPFormData.data.invoiceSettings.otherAllowance;

            this.ISForm.get('Verplaatsingen').setValue(this.FPFormData.data.invoiceSettings.transportCoefficient);
            this.ISForm.get('Dimona').setValue(this.FPFormData.data.invoiceSettings.dimonaCost);
            this.ISForm.get('Echo').setValue(this.FPFormData.data.invoiceSettings.ecoCoefficient);
            this.ISForm.get('Maalticheques').setValue(this.FPFormData.data.invoiceSettings.mealvoucherCoefficient);

            if (this.FPFormData.data.invoiceSettings.lieuDaysAllowance !== null && this.FPFormData.data.invoiceSettings.lieuDaysAllowance !== undefined) {
              if (this.FPFormData.data.invoiceSettings.lieuDaysAllowance.enabled !== null && this.FPFormData.data.invoiceSettings.mobilityAllowance.enabled !== undefined) {
                this.loadSwitchInhaalrust = this.FPFormData.data.invoiceSettings.lieuDaysAllowance.enabled;

                this.lieuDaysAllowanceObject.enabled = this.loadSwitchInhaalrust;
                this.lieuDaysAllowanceObject.payed = this.FPFormData.data.invoiceSettings.lieuDaysAllowance.payed;

                if (this.FPFormData.data.invoiceSettings.lieuDaysAllowance.enabled === true) {
                  this.ISForm.get('inhaalrust').enable();
                  this.SetInitialValue();

                  if (this.FPFormData.data.invoiceSettings.lieuDaysAllowance.payed === true) {
                    this._selectedIndex = 0;
                    this.selectedIndex = 0;
                  }
                  else {
                    this._selectedIndex = 1;
                    this.selectedIndex = 1;
                  }
                }
                else {
                  this.ISForm.get('inhaalrust').disable();
                }

              }
            }

            if (this.FPFormData.data.invoiceSettings.mobilityAllowance !== null && this.FPFormData.data.invoiceSettings.mobilityAllowance !== undefined) {
              if (this.FPFormData.data.invoiceSettings.mobilityAllowance.enabled !== null && this.FPFormData.data.invoiceSettings.mobilityAllowance.enabled !== undefined) {
                this.loadSwitchMobility = this.FPFormData.data.invoiceSettings.mobilityAllowance.enabled;
                this.mobilitySwitch = this.loadSwitchMobility;

                if (this.FPFormData.data.invoiceSettings.mobilityAllowance.enabled === true) {
                  this.ISForm.get('mobilebox').enable();
                  this.ISForm.controls.mobilebox.setValue(this.FPFormData.data.invoiceSettings.mobilityAllowance.amountPerKm);
                }
                else {
                  this.ISForm.get('mobilebox').disable();
                  this.ISForm.controls.mobilebox.setValue(this.FPFormData.data.invoiceSettings.mobilityAllowance.amountPerKm);
                }
              }
            }

            if (this.FPFormData.data.invoiceSettings.shiftAllowance === true) {
              this.ploegpremieSwitch = true;

              let nc = 0;
              for (let nc = 0; nc < this.shiftAllowances.length; nc++) {
                const formGroup = this.Ploegpremiere.controls[nc] as FormGroup;
                formGroup.controls['PloegprimeBox1'].enable();
                formGroup.controls['PloegprimeBox2'].enable();
              }
            }
            else {

              this.ploegpremieSwitch = false;

              let nc = 0;
              for (let nc = 0; nc < this.shiftAllowances.length; nc++) {
                const formGroup = this.Ploegpremiere.controls[nc] as FormGroup;
                formGroup.controls['PloegprimeBox1'].disable();
                formGroup.controls['PloegprimeBox2'].disable();
              }

            }

            if (this.FPFormData.data.invoiceSettings.shiftAllowances !== null && this.FPFormData.data.invoiceSettings.shiftAllowances !== undefined) {

              let lengthShiftAllowance = this.FPFormData.data.invoiceSettings.shiftAllowances.length;
              let counter: number = 0;

              this.FPFormData.data.invoiceSettings.shiftAllowances.forEach(element => {

                if (counter === 0) {
                  const formGroup = this.Ploegpremiere.controls[counter] as FormGroup;
                  formGroup.controls['PloegprimeBox1'].setValue(element.shiftName);
                  formGroup.controls['PloegprimeBox2'].setValue(element.amount);

                  if (this.ploegpremieSwitch === false) {
                    formGroup.controls['PloegprimeBox1'].disable();
                    formGroup.controls['PloegprimeBox2'].disable();
                  }
                  else {
                    formGroup.controls['PloegprimeBox1'].enable();
                    formGroup.controls['PloegprimeBox2'].enable();
                  }

                  if (this.FPFormData.data.invoiceSettings.shiftAllowances[0].nominal === false) {
                    this.currencyDataShift[0] = "€";
                    this.currencyShift = "€";
                  }
                  else {
                    this.currencyShift = "%";
                    this.currencyDataShift[0] = "%";
                  }

                  this.shiftAllowances[0].amount = parseInt(this.FPFormData.data.invoiceSettings.shiftAllowances[0].amount, 10);
                  this.shiftAllowances[0].shiftName = this.FPFormData.data.invoiceSettings.shiftAllowances[0].shiftName;
                  this.shiftAllowances[0].nominal = this.FPFormData.data.invoiceSettings.shiftAllowances[0].nominal;
                }
                else {
                  if (this.shiftAllowanceCounter < this.FPFormData.data.invoiceSettings.shiftAllowances.length) {

                    if (element.nominal === false) {
                      this.currencyDataShift[counter] = "€";
                      this.currencyShift = "€";
                    }
                    else {
                      this.currencyShift = "%";
                      this.currencyDataShift[counter] = "%";
                    }

                    this.addRows(element.shiftName, element.amount, element.nominal);
                    this.shiftAllowances[counter].nominal = element.nominal;

                    const formGroup = this.Ploegpremiere.controls[counter] as FormGroup;
                    formGroup.controls['PloegprimeBox1'].setValue(element.shiftName);
                    formGroup.controls['PloegprimeBox2'].setValue(element.amount);

                    if (this.ploegpremieSwitch === false) {
                      formGroup.controls['PloegprimeBox1'].disable();
                      formGroup.controls['PloegprimeBox2'].disable();
                    }
                    else {
                      formGroup.controls['PloegprimeBox1'].enable();
                      formGroup.controls['PloegprimeBox2'].enable();
                    }

                  }
                }
                counter += 1;
              });

              this.changeObject();
            }

            if (this.FPFormData.data.invoiceSettings.otherAllowance === true) {
              this.disableWorkCodes = false;

              let nc = 0;
              for (let nc = 0; nc < this.otherAllowances.length; nc++) {
                const formGroup = this.Andre.controls[nc] as FormGroup;
                formGroup.controls['AndreBox1'].enable();
                formGroup.controls['AndreBox2'].enable();
              }
            }
            else {
              this.disableWorkCodes = true;

              let nc = 0;
              for (let nc = 0; nc < this.otherAllowances.length; nc++) {
                const formGroup = this.Andre.controls[nc] as FormGroup;
                formGroup.controls['AndreBox1'].disable();
                formGroup.controls['AndreBox2'].disable();
              }
            }

            if (this.FPFormData.data.invoiceSettings.otherAllowances !== null && this.FPFormData.data.invoiceSettings.otherAllowances !== undefined) {
              let anothercounter = 0;
              let lengthOtherAllowance = this.FPFormData.data.invoiceSettings.otherAllowances.length;

              this.FPFormData.data.invoiceSettings.otherAllowances.forEach(element => {

                if (anothercounter < lengthOtherAllowance) {
                  if (anothercounter === 0) {
                    this.workCode[anothercounter] = element.codeId;
                    const formGroup = this.Andre.controls[anothercounter] as FormGroup;
                    formGroup.controls['AndreBox2'].setValue(element.amount);

                    this.otherAllowances[anothercounter].amount = parseInt(element.amount, 10);
                    this.otherAllowances[anothercounter].codeId = parseInt(element.codeId, 10);
                    this.otherAllowances[anothercounter].nominal = element.nominal;

                    if (this.FPFormData.data.invoiceSettings.otherAllowances[0].nominal === false) {
                      this.currencyOther = "€";
                      this.currencyDataOther[0] = "€";
                    }
                    else {
                      this.currencyOther = "%";
                      this.currencyDataOther[0] = "%";
                    }

                  }
                  else {
                    if (this.otherAllowanceCounter < lengthOtherAllowance) {
                      this.workCode[anothercounter] = element.codeId;
                      this.addAndreRows(element.codeId, element.amount, element.nominal);
                      this.otherAllowances[anothercounter].nominal = element.nominal;
                      this.andreSwitch = true;

                      const formGroup = this.Andre.controls[anothercounter] as FormGroup;
                      formGroup.controls['AndreBox2'].setValue(element.amount);

                      if (this.FPFormData.data.invoiceSettings.otherAllowances[anothercounter].nominal === false) {
                        this.currencyOther = "€";
                        this.currencyDataOther[anothercounter] = "€";
                      }
                      else {
                        this.currencyOther = "%";
                        this.currencyDataOther[anothercounter] = "%";
                      }
                    }
                  }
                  anothercounter += 1;
                }
              });
            }
            this.loadCurrencies();
          }
        }
      }
    }
    else {
      this.loadSwitchInhaalrust = false;
      this.loadSwitchSickness = false;
      this.loadSwitchHolidays = false;
      this.loadSwitchMobility = false;
      this.loadSwitchTeam = false;
      this.loadSwitchOther = false;
    }


  }

  loadCurrencies() {

    this.logger.log("load currencies");

    let counter = 0;
    this.currencyDataOther = [];
    this.currencyDataShift = [];

    if(this.FPFormData !== undefined && this.FPFormData !== null)
    if(this.FPFormData.data !== undefined && this.FPFormData.data !== null)
      if(this.FPFormData.data.invoiceSettings !== undefined && this.FPFormData.data.invoiceSettings !== null)
        if(this.FPFormData.data.invoiceSettings.otherAllowances !== undefined && this.FPFormData.data.invoiceSettings.otherAllowances!== null)
        this.FPFormData.data.invoiceSettings.otherAllowances.forEach((element) => {
          this.logger.log(element);
            if(element.nominal === true)
              this.currencyDataOther[counter] = "%";
            else
            this.currencyDataOther[counter] = "€";
            counter +=1;
        });

    counter = 0;

    if(this.FPFormData !== undefined && this.FPFormData !== null)
    if(this.FPFormData.data !== undefined && this.FPFormData.data !== null)
      if(this.FPFormData.data.invoiceSettings !== undefined && this.FPFormData.data.invoiceSettings !== null)
        if(this.FPFormData.data.invoiceSettings.shiftAllowances !== undefined && this.FPFormData.data.invoiceSettings.shiftAllowances!== null)
            this.FPFormData.data.invoiceSettings.shiftAllowances.forEach((element) => {
          if(element.nominal === true)
            this.currencyDataShift[counter] = "%";
          else
            this.currencyDataShift[counter] = "€";
            counter +=1;
        });

    this.logger.log(this.currencyDataOther);
    this.logger.log(this.currencyDataShift);

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

    this.currencyShift = "";
    this.currencyOther = "";

    this.shiftAllowances.push(this.shiftAllowanceObject);

    if (this.otherAllowances.length === 0)
      this.otherAllowances.push(this.otherAllowanceObject);

    this.dataDropDown = ['Betaald', 'Niet betaald'];
    this.datacurrencyDropDown = ['€', '%'];

    this.ISForm = new FormGroup({

      inhaalrust: new FormControl(''),
      mobilebox: new FormControl(''),
      currency: new FormControl(''),

      currency_other: new FormControl(''),

      PloegprimeBox1: new FormControl(''),
      PloegprimeBox2: new FormControl(''),
      PloegprimeBox3: new FormControl(''),


      Verplaatsingen: new FormControl(this.tCoefficient),
      Dimona: new FormControl(this.dimonaValue),
      Echo: new FormControl(this.echoValue),
      Maalticheques: new FormControl(this.mCoefficient),

      AndreBox1: new FormControl(''),
      AndreBox2: new FormControl(''),
      AndreBox3: new FormControl(''),

      arrayAndreBox: this.fb.array([
        this.createAndre('', '',false)
      ]),

      arrayBox: this.fb.array([
        this.createFirstServant()
      ])

    });

    this.ISForm.get('Verplaatsingen').setValue('1.20');
    this.ISForm.get('Dimona').setValue('0.3510');
    this.ISForm.get('Echo').setValue('1.69');
    this.ISForm.get('Maalticheques').setValue('1.69');

    // set Ploegpremiere to the form control containing contacts
    this.Ploegpremiere = this.ISForm.get('arrayBox') as FormArray;
    this.Andre = this.ISForm.get('arrayAndreBox') as FormArray;

    // this.Ploegpremiere.push(this.createServants('',''));

    this.ISForm.get('mobilebox').disable();
    this.ISForm.get('PloegprimeBox1').disable();
    this.ISForm.get('PloegprimeBox2').disable();
    this.ISForm.get('currency').disable();

    this.ISForm.get('AndreBox1').disable();
    this.ISForm.get('AndreBox2').disable();

    this.ISForm.get('inhaalrust').disable();

    this.disableWorkCodes = true;

    this.ploegpremieSwitch = false;
    this.andreSwitch = false;

    this.changeInitialStatus();

    if (this.selectedValue === undefined) { this.SetInitialValue(); }

    this.loadCurrencies();
  }

  changeInitialStatus() {

    this.disableWorkCodes = true;

    for (let counter = 0; counter < this.otherAllowances.length; counter++) {
      const formGroup = this.Andre.controls[counter] as FormGroup;
      formGroup.controls['AndreBox2'].disable();
    }


    for (let nc = 0; nc < this.shiftAllowances.length; nc++) {
      const formGroup = this.Ploegpremiere.controls[nc] as FormGroup;
      formGroup.controls['PloegprimeBox1'].disable();
      formGroup.controls['PloegprimeBox2'].disable();
    }

  }

  onTeamChange($event) {

    this.ploegpremieSwitch = $event;

    if ($event === true) {
      this.shiftAllowance = true;
      this.ISForm.get('PloegprimeBox1').enable();
      this.ISForm.get('PloegprimeBox2').enable();
      this.ISForm.get('currency').enable();

      for (let counter = 0; counter < this.shiftAllowances.length; counter++) {
        const formGroup = this.Ploegpremiere.controls[counter] as FormGroup;
        formGroup.controls['PloegprimeBox1'].enable();
        formGroup.controls['PloegprimeBox2'].enable();

      }


    }
    else {
      this.shiftAllowance = false;
      this.ISForm.get('PloegprimeBox1').disable();
      this.ISForm.get('PloegprimeBox2').disable();
      this.ISForm.get('currency').disable();

      for (let counter = 0; counter < this.shiftAllowances.length; counter++) {
        const formGroup = this.Ploegpremiere.controls[counter] as FormGroup;
        formGroup.controls['PloegprimeBox1'].disable();
        formGroup.controls['PloegprimeBox2'].disable();

      }

      //this.clearShiftAllowances();
    }

    this.changeObject();

  }

  transportCoefficientChange(value) {
    this.tCoefficient = parseFloat(value);
    this.changeObject();
  }

  mCoefficientChange(value) {
    this.mCoefficient = parseFloat(value);
    this.changeObject();
  }

  onEchoChange(value) {
    this.echoValue = parseFloat(value);
    this.changeObject();
  }

  onDimonaChange(value) {

    if(value > environment.DimonaCostMaximum || value < environment.DimonaCostMinium)
    {
      this.ISForm.get('Dimona').setValue(environment.DimonaCostMinium);
      this.dimonaValue = environment.DimonaCostMinium;
      this.changeObject();
    }
    else
    {
      this.dimonaValue = parseFloat(value);
      this.changeObject();  
    }

  }

  isInvalid() {

    // console.log('is invalid =');
    // console.log(this.ploegpremieSwitch);

    if (this.ploegpremieSwitch === true) {
      return false;
    }

    return true;
  }

  isInvalidOther() {

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
    this.shiftAllowances[j].amount = parseInt(value, 10);
    this.changeObject();
  }

  setPgABox1(value: number, k: number) {
    this.otherAllowances[k].codeId = value;
    this.changeObject();
  }

  setPgABox2(value, l: number) {
    this.otherAllowances[l].amount = parseInt(value, 10);
    this.changeObject();
  }

  receiveWorkCode($event, k: number) {

    // setting the value in the array
    if (this.andreSwitch === true) {
      this.otherAllowances[k].codeId = $event;
      this.changeObject();
    }

  }

  onChangeZ($event) {
    this.sicknessInvoiced = $event;
    this.changeObject();

  }
  onChangeF($event) {
    this.holidayInvoiced = $event;
    this.changeObject();
  }

  onChangeM($event) {

    // this.holidayInvoiced = $event;
    this.mobilitySwitch = $event;

    if ($event === true) {
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
      this.disableWorkCodes = false;
      this.ISForm.get('AndreBox2').enable();
      this.ISForm.get('currency_other').enable();
      for (let counter = 0; counter < this.otherAllowances.length; counter++) {
        const formGroup = this.Andre.controls[counter] as FormGroup;
        formGroup.controls['AndreBox2'].enable();
      }

    } else {
      this.ISForm.get('arrayAndreBox').disable();
      this.disableWorkCodes = true;
      this.ISForm.get('AndreBox2').disable();
      this.ISForm.get('currency_other').disable();

      for (let counter = 0; counter < this.otherAllowances.length; counter++) {
        const formGroup = this.Andre.controls[counter] as FormGroup;
        formGroup.controls['AndreBox2'].disable();
      }

      //this.clearOtherAllowances();
    }
    this.changeObject();

  }

  createAndre(value1, value2,nominal): FormGroup {
    this.addNewRow = false;
    this.removeLastRemove = true;

    return this.fb.group({
      AndreBox1: new FormControl(value1),
      AndreBox2: new FormControl(value2),
      currency_other: new FormControl(nominal),
    });

  }

  createFirstServant(): FormGroup {
    this.addNewRow = false;
    this.removeLastRemove = true;

    return this.fb.group({
      PloegprimeBox1: new FormControl(''),
      PloegprimeBox2: new FormControl(''),
      currency: new FormControl(''),
    });
  }

  createServants(value1, value2): FormGroup {
    this.addNewRow = false;
    this.removeLastRemove = false;

    return this.fb.group({
      PloegprimeBox1: new FormControl(value1),
      PloegprimeBox2: new FormControl(value2),
      currency: new FormControl(''),
    });

  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }

  get arrayBox() {
    return this.Ploegpremiere.get('arrayBox') as FormArray;
  }

  get arrayAndreBox() {
    return this.Andre.get('arrayAndreBox') as FormArray;
  }

  addAndreRows(value1, value2, nominal) {
    this.Andre.push(this.createAndre(value1, value2,nominal));
    this.otherAllowanceObject = new OtherAllowance();
    this.otherAllowanceObject.codeId = value1;
    this.otherAllowanceObject.amount = value2;
    this.otherAllowanceObject.nominal = nominal;
    this.otherAllowances.push(this.otherAllowanceObject);
    this.otherAllowanceCounter++;
    // this.changeObject();
  }

  searchAndRemove(element)
  {
    this.logger.log("search and remove called");
    this.logger.log(this.Andre.length);

    for(let i=0;i<this.Andre.length;i++)
    {
      const formGroup = this.Andre.controls[i] as FormGroup;
      let amount = formGroup.controls['AndreBox2'].value;
      let codeId = this.workCode[i];  
      let currency = this.currencyDataOther[i]==="%"?true:false;

      if(amount === element.amount && codeId === element.codeId && currency === element.nominal)
      {
        this.logger.log("removing at i="+i);
        this.logger.log("Object to be removed=");
        this.logger.log(this.Andre)
        this.Andre.removeAt(i);
        this.logger.log("Object to be removed=");
        this.logger.log(this.otherAllowances[i]);
        this.otherAllowances.splice(i, 1);
        this.logger.log("editing other allowances");
        this.logger.log(this.otherAllowances);
        //this.refreshTable();

      }
    }

  }

  refreshTable() 
  {
    this.logger.log("refreshing table");
    this.logger.log(this.Andre);

    for(let i=0;i<this.Andre.length;i++)
    {
      const formGroup = this.Andre.controls[i] as FormGroup;
      formGroup.controls['AndreBox1'].setValue(this.otherAllowances[i].codeId);
      formGroup.controls['AndreBox2'].setValue(this.otherAllowances[i].amount);
      this.currencyDataOther[i] = this.otherAllowances[i].nominal;
    }

  }

  removeAndreRows(index) {

    if (this.Andre.length != 1)
    {
      this.searchAndRemove(this.otherAllowances[index]);
      //this.Andre.removeAt(index);
    }
    this.changeObject();

  }

  addRows(value1, value2, nominal) {

    this.Ploegpremiere.push(this.createServants(value1, value2));
    this.shiftAllowanceObject = new ShiftAllowance();
    this.shiftAllowanceObject.shiftName = value1;
    this.shiftAllowanceObject.amount = value2;
    this.shiftAllowanceObject.timeSpan = "02:02:02";
    this.shiftAllowanceObject.nominal = nominal;
    this.shiftAllowances.push(this.shiftAllowanceObject);
    this.shiftAllowanceCounter++;
    // this.changeObject();
  }

  removeRows(index) {

    this.logger.log("the row to be removed ");
    this.logger.log(this.Ploegpremiere[0]);

    if (this.Ploegpremiere.length != 1)
      this.Ploegpremiere.removeAt(index);

    // remove from array shiftAllowances
    this.shiftAllowances.splice(index, 1);

    this.changeObject();
  }

  replaceRows(index) {

  }



}




