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
  public statuteSelectedString: ParitairCommitee;
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

    for(let i=0;i<this.statutes.length;i++)
      this.arrayParitairCommitee.push(new ParitairCommitee());

      this.createStatuteSettingsArrayEmpty();

  }


  ngDoCheck() {
    this.createCoefficientArray();    

    this.loadArrayTemp();
    if (this.STFormData !== undefined) {
      if (this.STFormData != this.oldSFTFormData) {
        this.oldSFTFormData = this.STFormData;
        this.loadInitialData(this.statutes);
      }
    }
  }

  loadArrayTemp() {
    for(let i=0;i<8;i++)
      this.TempArray[i] = 0;
  }

  loadCoefficientArray(data) {

    for (let i: number = 0; i < data.length; i++) {
      this.coefficientArray[i] = data[i].coefficient;
    }
    
  }

  ngAfterViewInit() {

    if (this.STFormData !== undefined) {
      if (this.STFormData != this.oldSFTFormData) {
        this.oldSFTFormData = this.STFormData;
        this.loadInitialData(this.statutes);
      }
    }

  }

  loadInitialData(datas: any) {
    let counter:number = 0;

    this.fillTitles();

    if (this.STFormData.data.statuteSettings !== null && this.STFormData.page === "edit") {

      this.loadStatuteSettingsArray = this.STFormData.data.statuteSettings;
      this.loadCoefficientArray(this.STFormData.data.statuteSettings);

      if (this.loadStatuteSettingsArray !== null && this.loadStatuteSettingsArray !== undefined) {

        this.loadStatuteSettingsArray.forEach(element => {
          this.onloadData(element,counter);
          counter++;
        });

        this.logger.log("loaded array");
        this.logger.log(this.statuteSettings);    
        this.emitData();
      }
    }
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
        this.StatuteSettingsObject.paritairCommitee.BrightStaffingCommitteeId = this.arrayParitairCommitee[counter].BrightStaffingCommitteeId;
        this.StatuteSettingsObject.paritairCommitee.name = this.arrayParitairCommitee[counter].name;
        this.StatuteSettingsObject.paritairCommitee.number = this.arrayParitairCommitee[counter].number;
        this.StatuteSettingsObject.paritairCommitee.type = this.arrayParitairCommitee[counter].type;

        this.StatuteSettingsObject.statute = new Statute();
        this.StatuteSettingsObject.statute.name = this.statutes[counter].name;
        this.StatuteSettingsObject.statute.type  = this.statutes[counter].type;

        // this.logger.log(this.statutes[counter].name);
        // this.logger.log(this.statutes[counter].type);

        this.statuteSettings.push(this.StatuteSettingsObject);
  
    }

    // this.logger.log("created array");
    // this.logger.log(this.statuteArray);

    if(counter > this.statutes.length)
        this.emitData();

  }

  fillTitles() {
    
    for(let counter:number=0;counter<this.statutes.length;counter+=1)
    {
      this.titles[counter] = this.statutes[counter].name;
      this.TypeWorker[counter] = this.statutes[counter].type;
    }

    this.loadzeroArray();

  }
   
   onloadData(arrayElement,counter){

    this.totalArray[counter] = arrayElement.mealVoucherSettings.totalWorth;
    this.wegervaalArray[counter] = arrayElement.mealVoucherSettings.employerShare;
    this.minimumurenArray[counter] = arrayElement.mealVoucherSettings.minimumHours;
    this.coefficientArray[counter] = arrayElement.coefficient;

    let name = arrayElement.paritairCommitee.name;
    let number = arrayElement.paritairCommitee.number;
    this.JCString[counter] = number + " - " + name;

    this.logger.log("array Element");
    this.logger.log(arrayElement);

    // load statuteSettings data onto statuteSettings Array

    if(this.statuteSettings.length > 0)
    {
      this.StatuteSettingsObject = new StatuteSetting();

      this.StatuteSettingsObject.mealVoucherSettings = new MealVoucherSettings();
      this.StatuteSettingsObject.mealVoucherSettings.totalWorth = arrayElement.mealVoucherSettings.totalWorth;
      this.StatuteSettingsObject.mealVoucherSettings.employerShare = arrayElement.mealVoucherSettings.employerShare;
      this.StatuteSettingsObject.mealVoucherSettings.minimumHours = arrayElement.mealVoucherSettings.minimumHours;

      this.StatuteSettingsObject.coefficient = arrayElement.coefficient;
  
      this.StatuteSettingsObject.paritairCommitee = new ParitairCommitee();
      this.StatuteSettingsObject.paritairCommitee.BrightStaffingCommitteeId = arrayElement.paritairCommitee.BrightStaffingCommitteeId;
      this.StatuteSettingsObject.paritairCommitee.name = arrayElement.paritairCommitee.name;
      this.StatuteSettingsObject.paritairCommitee.number = arrayElement.paritairCommitee.number;
      this.StatuteSettingsObject.paritairCommitee.type = arrayElement.paritairCommitee.type;

      this.StatuteSettingsObject.statute = new Statute();
      this.StatuteSettingsObject.statute.name = this.statutes[counter].name
      this.StatuteSettingsObject.statute.type  = this.statutes[counter].type;

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

    this.createCoefficientArray();

    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;

      this.fillTitles();
      this.createCoefficientArray();
      this.setParitairCommitteArray();

      this.isMealEnabled = new Array<number>(data.length);
      this.countStatutes = data.length;

      if (this.statutes.length !== 0) {
        this.emitData();
      }      

    }, error => this.errorMsg = error);

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
      this.logger.log("event="+event);
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
    this.emitData();
  }
  

  // createArrayData(data: Statute[]) {

  //   this.statuteSettings = [];

  //   console.log("statute settings array");
  //   console.log(this.loadStatuteSettingsArray);

  //   for (let i = 0; i < data.length; i++)
  //   {

  //     const dataObject = data[i];

  //     this.statuteObject = new Statute();
  //     this.statuteObject.name = dataObject.name;
  //     this.statuteObject.type = dataObject.type;

  //     if(this.arrayParitairCommitee !== null && this.arrayParitairCommitee !== undefined && this.arrayParitairCommitee.length !== 0)
  //     {
  //       const dataPtObject = this.arrayParitairCommitee[i];
  
  //       this.paritarirCommiteeObject = new ParitairCommitee();
  //       this.paritarirCommiteeObject.BrightStaffingCommitteeId = dataPtObject.BrightStaffingCommitteeId;
  //       this.paritarirCommiteeObject.name = dataPtObject.name;
  //       this.paritarirCommiteeObject.number = dataPtObject.number;
  //       this.paritarirCommiteeObject.type = dataPtObject.type;
  
  //       this.mealVoucherSettingsObject = new MealVoucherSettings();
  
  //       if (this.isMealEnabled[i] === true) {
  //         this.mealVoucherSettingsObject.employerShare = parseInt(this.wegervaalArray[i],10);
  //         this.mealVoucherSettingsObject.minimumHours = parseInt(this.minimumurenArray[i],10);
  //         this.mealVoucherSettingsObject.totalWorth = parseInt(this.totalArray[i],10);
  //       } else {
  //         this.mealVoucherSettingsObject.employerShare = 0;
  //         this.mealVoucherSettingsObject.minimumHours = 0;
  //         this.mealVoucherSettingsObject.totalWorth = 0;
  //       }
  
  //       this.StatuteSettingsObject = new StatuteSetting();
  //       this.StatuteSettingsObject.statute = this.statuteObject;
  //       this.StatuteSettingsObject.paritairCommitee = this.paritarirCommiteeObject;
  //       this.StatuteSettingsObject.mealVoucherSettings = this.mealVoucherSettingsObject;
  //       this.StatuteSettingsObject.coefficient = parseInt(this.coefficientArray[i],10);
  
  //       this.statuteSettings.push(this.StatuteSettingsObject);
  //     }

  //   }

  //   this.emitData();

  // }

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

    this.logger.log("received object i="+i);
    this.logger.log($event);

    this.arrayParitairCommitee[i] = new ParitairCommitee();
    this.paritarirCommiteeObject = new ParitairCommitee();

    this.paritarirCommiteeObject.BrightStaffingCommitteeId = $event.selectedObject.BrightStaffingCommitteeId;
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
    this.emitData();

  }

  replaceArrayWergever(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.employerShare = parseInt(this.wegervaalArray[i],10);
    } else {
      this.createArrayData();
    }
    this.emitData();

  }

  replaceArrayTotal(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) 
    {
      this.statuteSettings[i].mealVoucherSettings.totalWorth = parseInt(this.totalArray[i],10);
    } else {
      this.createArrayData();
    }
    this.emitData();

  }

  replaceArrayMinimum(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.minimumHours = parseInt(this.minimumurenArray[i],10);
    } else {
      this.createArrayData();
    }

    this.emitData();
  }


  replaceArrayCoefficient(value:number,i: number) {


    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].coefficient = value;
    } else {
      this.createArrayData();
    }
    this.emitData();
  }

  replaceArray(i: number) {
    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
          this.statuteSettings[i].paritairCommitee.BrightStaffingCommitteeId = this.statuteSelectedString.BrightStaffingCommitteeId;
          this.statuteSettings[i].paritairCommitee.name = this.statuteSelectedString.name;
          this.statuteSettings[i].paritairCommitee.type = this.statuteSelectedString.type;
          this.statuteSettings[i].paritairCommitee.number = this.statuteSelectedString.number;
    }
    this.emitData();
  }

  emitData() {
    this.logger.log("Sending array");
    this.logger.log(this.statuteSettings);
    this.childEvent.emit(this.statuteSettings);
  }

}
