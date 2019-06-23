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
  public titles =[];
  public TypeWorker = [];
  public TempArray = [];

  public MealBox:FormArray;
  SForm: FormGroup;

  public countStatutes: number;
  public statuteSettings = [];

  StatuteSettingsObject: StatuteSetting;
  statuteObject: Statute;
  jointCommitee: ParitairCommitee;
  mealVoucherSettingsObject: MealVoucherSettings;
  paritarirCommiteeObject: ParitairCommitee;
  coefficient: number;
  newCounter: number = 0;
  lengthStatueSettings: number = 0;

  constructor(private statuteService: StatuteService, private fb:FormBuilder, private logger:LoggingService) {

  }

  setParitairCommitteArray() {

    this.logger.log("array Paritair committee");

    for(let i=0;i<this.statutes.length;i++)
      this.arrayParitairCommitee.push(new ParitairCommitee());

      this.createStatuteSettingsArrayEmpty();
      
      for(let j=0;j<this.statutes.length;j++)
      {
        this.isMealEnabled[j] = false;
      }

  }


  ngDoCheck() {
    this.createCoefficientArray();

      if (this.STFormData != this.oldSFTFormData) {
            this.oldSFTFormData = this.STFormData;
          if (this.STFormData !== undefined  && this.STFormData.data !== null && this.STFormData.page === "edit") {
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

    if (this.STFormData !== undefined  && this.STFormData.data !== null && this.STFormData.page === "edit") {
      if (this.STFormData != this.oldSFTFormData) {
        this.oldSFTFormData = this.STFormData;
        this.loadInitialData();
      }
    }

  }

  loadInitialData() {
    let counter:number = 0;

    this.fillTitles();

    if (this.STFormData.data.statuteSettings !== null && this.STFormData.page === "edit") 
    {
      this.loadStatuteSettingsArray = this.STFormData.data.statuteSettings;
      this.loadCoefficientArray(this.STFormData.data.statuteSettings);

      if (this.loadStatuteSettingsArray !== null && this.loadStatuteSettingsArray !== undefined) {

        this.countStatutes = this.statutes.length;
        // this.createStatuteSettingsArrayEmpty();
        this.copyArray(this.loadStatuteSettingsArray);
        this.loadStatuteSettingsArray.forEach(element => {
          this.onloadData(element,counter);
          counter++;
        });                
          if(counter > this.loadStatuteSettingsArray.length)
              this.emitData("load");
      }
    }
  }

  copyArray(array:any)
  {
    this.statuteSettings = array;
    let counter:number = 0;

    this.statuteSettings.forEach(element => {

      if(element.mealVoucherSettings.employerShare === 0 && element.mealVoucherSettings.totalWorth === 0 && element.mealVoucherSettings.minimumHours === 0)
            this.isMealEnabled[counter] = false;
      else
            this.isMealEnabled[counter] = true;

        counter += 1;
    });

    this.fillMealEnabled();

    this.emitData("load");
  }


  createStatuteSettingsArrayEmpty() {

    let counter:number = 0;
    this.lengthStatueSettings = this.statuteSettings.length;


      for(let counter =0; counter< this.statutes.length; counter+=1)
      {
          this.StatuteSettingsObject = new StatuteSetting();
          this.StatuteSettingsObject.mealVoucherSettings = new MealVoucherSettings();
  
          this.StatuteSettingsObject.mealVoucherSettings.totalWorth = 0
          this.StatuteSettingsObject.mealVoucherSettings.employerShare = 0
          this.StatuteSettingsObject.mealVoucherSettings.minimumHours = 0
          this.StatuteSettingsObject.coefficient = 0;
      
          this.StatuteSettingsObject.paritairCommitee = new ParitairCommitee();
          this.StatuteSettingsObject.paritairCommitee.brightStaffingId = this.arrayParitairCommitee[counter].BrightStaffingCommitteeId;
          this.StatuteSettingsObject.paritairCommitee.name = this.arrayParitairCommitee[counter].name;
          this.StatuteSettingsObject.paritairCommitee.number = this.arrayParitairCommitee[counter].number;
          this.StatuteSettingsObject.paritairCommitee.type = this.arrayParitairCommitee[counter].type;
  
          this.StatuteSettingsObject.statute = new Statute();
          this.StatuteSettingsObject.statute.name = this.statutes[counter].name;
          this.StatuteSettingsObject.statute.type  = this.statutes[counter].type;
          this.StatuteSettingsObject.statute.brightStaffingID = parseInt(this.statutes[counter].BrightStaffingID,10);
  
          this.statuteSettings.push(this.StatuteSettingsObject);
    
      }

      if(counter > this.statutes.length)
          this.emitData("create array empty paritaircommitee");
  }

  fillTitles() {
    
    for(let counter:number=0;counter<this.statutes.length;counter+=1)
    {
      this.titles[counter] = this.statutes[counter].name;
      this.TypeWorker[counter] = this.statutes[counter].type;
    }

    this.countStatutes = this.statutes.length;

    this.loadzeroArray();

  }
   
   onloadData(arrayElement,counter)
   {

      this.totalArray[counter] = arrayElement.mealVoucherSettings.totalWorth;
      this.wegervaalArray[counter] = arrayElement.mealVoucherSettings.employerShare;
      this.minimumurenArray[counter] = arrayElement.mealVoucherSettings.minimumHours;
      this.coefficientArray[counter] = arrayElement.coefficient;
  
      let name = arrayElement.paritairCommitee.name;
      let number = arrayElement.paritairCommitee.number;
      this.JCString[counter] = number + " - " + name;
  
      if(this.statuteSettings.length > 0)
      {
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

        if(this.statutes !== undefined && this.statutes !== null)
        {
          if(this.statutes[counter].name !== undefined && this.statutes[counter].type !== undefined && this.statutes[counter].BrightStaffingID !== undefined)
          {
            this.StatuteSettingsObject.statute.name = this.statutes[counter].name
            this.StatuteSettingsObject.statute.type  = this.statutes[counter].type;
            this.StatuteSettingsObject.statute.brightStaffingID  = parseInt(this.statutes[counter].BrightStaffingID,10);    
          }
        }
  
        this.statuteSettings[counter] = this.StatuteSettingsObject;
  
      }
  
}

createControls(Coefficient,TotalWorth,EmployerShare,MinimumHours) {
  
  return this.fb.group({
     CoefficientBox: new FormControl(Coefficient, [Validators.required, Validators.pattern('^[0-9]$')]),
     arrayBox: this.fb.array([
       this.createBox(TotalWorth,EmployerShare,MinimumHours)
     ]),
   });

 }

createBox(TotalWorth,EmployerShare,MinimumHours) {

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

addControls(Coefficient,TotalWorth,EmployerShare,MinimumHours) {

  if(this.statuteArray.length !== this.statutes.length)
      this.statuteArray.push(this.createControls(Coefficient,TotalWorth,EmployerShare,MinimumHours));

}

ngOnInit() {
    this.SForm = new FormGroup({
      statuteArray: this.fb.array([]),
      coefficientBox: new FormControl()
    });

    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;

      this.fillTitles();
      this.setParitairCommitteArray();

      // this.isMealEnabled = new Array<number>(data.length);

      // this.fillMealEnabled();
      this.countStatutes = data.length;

      this.logger.log("length of statutes="+this.statutes.length);
      this.logger.log(this.statutes);

      if (this.statutes.length !== 0) {
        this.emitData("ngOnit");
      }      

    }, error => this.errorMsg = error);

  }
  
  fillMealEnabled() {

    let counter:number = 0;

    this.statuteSettings.forEach(element => {

      if(element.mealVoucherSettings.employerShare === 0 && element.mealVoucherSettings.totalWorth === 0 && element.mealVoucherSettings.minimumHours === 0)
            this.isMealEnabled[counter] = false;
      else
            this.isMealEnabled[counter] = true;

        counter += 1;
    });

    this.logger.log("isMealEnabled is");
    this.logger.log(this.isMealEnabled);
  }

  createCoefficientArray() {

    for (let i: number = 0; i < this.countStatutes; i++) {
      this.coefficientArray[i] = 0;
    }

  }

  onChangeCoefficient(value: number, i: number) {
    this.coefficient = value;
    this.coefficientArray[i] = value;
    this.replaceArrayCoefficient(value, i);
  }

  onMealChange(event, ctrlid: number) {

    if(ctrlid >= 0 && ctrlid < 8)
    {
      this.isMealEnabled[ctrlid] = event;
      // this.logger.log("event="+event);
    }
  }

  loadzeroArray() {

    for(let i:number=0;i<this.statutes.length;i++)
    {
      this.totalArray.push(0);
      this.wegervaalArray.push(0);
      this.minimumurenArray.push(0);
    }
    
  }

  createArrayData() {
    this.emitData("createArray data");
  }
  
  totalChange(value: number, i) {

    if(this.isMealEnabled[i]===true)
    {
      this.totalArray[i] = value;    
      this.replaceArrayTotal(i);  
    }
  }

  changeTotalBox1(value:number, k: number) {
    this.MealBox[k].Totalwaarde = value;
    //this.changeObject();
  }


  WergeversdeelChange(value: number, i) {
    if(this.isMealEnabled[i]===true)
    {
      this.wegervaalArray[i] = value;
      this.replaceArrayWergever(i); 
    }
  }

  minimumUrenChange(value: number, i) {
    if(this.isMealEnabled[i]===true)
    {
      this.minimumurenArray[i] = value;
      this.replaceArrayMinimum(i);  
    }
  }

  receiveJTdata($event, i) {

    this.statuteSelectedString = $event.selectedObject;

    this.arrayParitairCommitee[i] = new ParitairCommitee();
    this.paritarirCommiteeObject = new ParitairCommitee();

    this.paritarirCommiteeObject.brightStaffingId = $event.selectedObject.BrightStaffingCommitteeId;
    this.paritarirCommiteeObject.name =  $event.selectedObject.name;
    this.paritarirCommiteeObject.number = $event.selectedObject.number;
    this.paritarirCommiteeObject.type = $event.selectedObject.type;

    this.arrayParitairCommitee[i] = this.paritarirCommiteeObject;

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) 
    {
      this.replaceArray(i);
    } else {

      this.createArrayData();
      this.replaceArray(i);
    }
    this.emitData("joint commitee");

  }

  replaceArrayWergever(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.employerShare = parseInt(this.wegervaalArray[i],10);
    } else {
      this.createArrayData();
    }
    this.emitData("replace array Wergever");

  }

  replaceArrayTotal(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) 
    {
      this.statuteSettings[i].mealVoucherSettings.totalWorth = parseInt(this.totalArray[i],10);
    } else {
      this.createArrayData();
    }
    this.emitData("replace array total");

  }

  replaceArrayMinimum(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.minimumHours = parseInt(this.minimumurenArray[i],10);
    } else {
      this.createArrayData();
    }

    this.emitData("replace array minimum");
  }


  replaceArrayCoefficient(value:number,i: number) {

  if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].coefficient = value;
    } else {
      this.createArrayData();
    }
    this.emitData("replace array coefficient");

  }

  replaceArray(i: number) {
    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
          this.statuteSettings[i].paritairCommitee.brightStaffingId = this.statuteSelectedString.BrightStaffingCommitteeId;
          this.statuteSettings[i].paritairCommitee.name = this.statuteSelectedString.name;
          this.statuteSettings[i].paritairCommitee.type = this.statuteSelectedString.type;
          this.statuteSettings[i].paritairCommitee.number = this.statuteSelectedString.number;
    }
    this.emitData("replace Array");
  }

  emitData(message:string) {
    // this.logger.log("called from ="+message);
    // this.logger.log(this.statuteSettings);
    this.childEvent.emit(this.statuteSettings);
  }

}
