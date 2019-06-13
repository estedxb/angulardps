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
  public arrayParitairCommitee: ParitairCommitee[];
  public JCString;
  public loadStatuteSettingsArray = [];
  public newIndex;
  public i;
  public oldSFTFormData;
  public titles =[];
  public TypeWorker = [];

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

  constructor(private statuteService: StatuteService, private fb:FormBuilder) {
    this.createCoefficientArray();
  }


  ngDoCheck() {
    this.createCoefficientArray();    
    if (this.STFormData !== undefined) {
      if (this.STFormData != this.oldSFTFormData) {
        this.oldSFTFormData = this.STFormData;
        this.loadInitialData(this.statutes);
      }
    }
  }

  loadCoefficientArray(data) {

    // console.log("statuteSettings Array");
    // console.log(data);

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
      }
    }
  }

  fillTitles() {
    
    for(let counter:number=0;counter<this.statutes.length;counter+=1)
    {
      this.titles[counter] = this.statutes[counter].name;
      this.TypeWorker[counter] = this.statutes[counter].type;

      // this.addControls(arrayElement.coefficient,arrayElement.mealVoucherSettings.totalWorth,arrayElement.mealVoucherSettings.employerShare,arrayElement.mealVoucherSettings.minimumHours);
      this.addControls("0",0,0,0);
    }

    this.loadzeroArray();

  }
   
   onloadData(arrayElement,counter){

    //this.addControls(arrayElement.coefficient,arrayElement.mealVoucherSettings.totalWorth,arrayElement.mealVoucherSettings.employerShare,arrayElement.mealVoucherSettings.minimumHours);

      if(this.STFormData !== null && this.STFormData.data !== undefined && this.STFormData.data.statuteSettings !== null)
      {
        if(this.STFormData.data.statuteSettings.paritairCommitee !== null && this.STFormData.data.statuteSettings.paritairCommitee !== undefined)
        {
          let name = this.STFormData.data.statuteSettings.paritairCommitee.name;
          let number = this.STFormData.data.statuteSettings.paritairCommitee.number;
          this.JCString = number + " - " + name;
        }
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
    });

    this.createCoefficientArray();

    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;

      this.fillTitles();

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
    try {
      this.isMealEnabled[ctrlid] = event; 
      // alert('this.isMealEnabled[' + ctrlid + '] = ' + this.isMealEnabled[ctrlid]);
      // this.createArrayData(this.statutes);
    } catch (ex) {
      alert(ex.message);
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

  createArrayData(data: Statute[]) {

    this.statuteSettings = [];

    for (let i = 0; i < data.length; i++)
    {

      const dataObject = data[i];

      this.statuteObject = new Statute();
      this.statuteObject.name = dataObject.name;
      this.statuteObject.type = dataObject.type;

      if(this.arrayParitairCommitee !== null && this.arrayParitairCommitee !== undefined && this.arrayParitairCommitee.length !== 0)
      {
        const dataPtObject = this.arrayParitairCommitee[i];
  
        this.paritarirCommiteeObject = new ParitairCommitee();
        this.paritarirCommiteeObject.BrightStaffingCommitteeId = dataPtObject.BrightStaffingCommitteeId;
        this.paritarirCommiteeObject.name = dataPtObject.name;
        this.paritarirCommiteeObject.number = dataPtObject.number;
        this.paritarirCommiteeObject.type = dataPtObject.type;
  
        this.mealVoucherSettingsObject = new MealVoucherSettings();
  
        if (this.isMealEnabled[i] === true) {
          this.mealVoucherSettingsObject.employerShare = parseInt(this.wegervaalArray[i],10);
          this.mealVoucherSettingsObject.minimumHours = parseInt(this.minimumurenArray[i],10);
          this.mealVoucherSettingsObject.totalWorth = parseInt(this.totalArray[i],10);
        } else {
          this.mealVoucherSettingsObject.employerShare = 0;
          this.mealVoucherSettingsObject.minimumHours = 0;
          this.mealVoucherSettingsObject.totalWorth = 0;
        }
  
        this.StatuteSettingsObject = new StatuteSetting();
        this.StatuteSettingsObject.statute = this.statuteObject;
        this.StatuteSettingsObject.paritairCommitee = this.paritarirCommiteeObject;
        this.StatuteSettingsObject.mealVoucherSettings = this.mealVoucherSettingsObject;
        this.StatuteSettingsObject.coefficient = parseInt(this.coefficientArray[i],10);
  
        this.statuteSettings.push(this.StatuteSettingsObject);
      }

    }

    this.emitData();

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
    this.arrayParitairCommitee = $event.arrayObject;

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.replaceArray(i);
    } else {
      this.createArrayData(this.statutes);
      this.replaceArray(i);
    }
    this.emitData();

  }

  replaceArrayWergever(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.employerShare = parseInt(this.wegervaalArray[i],10);
    } else {
      this.createArrayData(this.statutes);
    }
    this.emitData();

  }

  replaceArrayTotal(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) 
    {
      this.statuteSettings[i].mealVoucherSettings.totalWorth = parseInt(this.totalArray[i],10);
    } else {
      this.createArrayData(this.statutes);
    }
    this.emitData();

  }

  replaceArrayMinimum(i: number) {

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.minimumHours = parseInt(this.minimumurenArray[i],10);
    } else {
      this.createArrayData(this.statutes);
    }

    this.emitData();
  }


  replaceArrayCoefficient(value:number,i: number) {


    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].coefficient = value;
    } else {
      this.createArrayData(this.statutes);
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
    this.childEvent.emit(this.statuteSettings);
  }

}
