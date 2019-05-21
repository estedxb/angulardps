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
import { fbind } from 'q';

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

    console.log("load STFormData=");
    console.log(this.STFormData);

    if (this.STFormData.data.statuteSettings !== null && this.STFormData.page === "edit") {
      this.loadStatuteSettingsArray = this.STFormData.data.statuteSettings;
      this.createFormArray();
      if (this.loadStatuteSettingsArray !== null && this.loadStatuteSettingsArray !== undefined) {
        this.loadStatuteSettingsArray.forEach(element => {
          this.onloadData(element,counter);
          counter++;
        });
      }
    }
  }
   
   onloadData(arrayElement,counter){

    console.log("value received="+arrayElement.mealVoucherSettings.totalWorth);
    console.log("value received="+arrayElement.mealVoucherSettings.employerShare);
    console.log("value received="+arrayElement.mealVoucherSettings.minimumHours);

    console.log("MealBox");
    console.log(this.MealBox.length+" "+ counter);


    if(this.MealBox.length - 1 > counter)
    {
          let controlGroup = this.MealBox.at(counter) as FormGroup;
          console.log(this.MealBox.length+" "+ counter);
 
          (<FormGroup> this.MealBox.at(counter) as FormGroup).controls.Totalwaarde.setValue(arrayElement.mealVoucherSettings.totalWorth);
          (<FormGroup> this.MealBox.at(counter) as FormGroup).controls.Wergeversdeel.setValue(arrayElement.mealVoucherSettings.employerShare);
          (<FormGroup> this.MealBox.at(counter) as FormGroup).controls.minimumHours.setValue(arrayElement.mealVoucherSettings.minimumHours);
    }

    this.SForm.controls['CoefficientBox'].setValue(arrayElement.coefficient);

      if(this.STFormData !== null && this.STFormData.data !== undefined && this.STFormData.data.statuteSettings !== null )
      {
        if(this.STFormData.data.statuteSettings.paritairCommitee !== null && this.STFormData.data.statuteSettings.paritairCommitee !== undefined)
        {
          let name = this.STFormData.data.statuteSettings.paritairCommitee.name;
          let number = this.STFormData.data.statuteSettings.paritairCommitee.number;
          this.JCString = number + " - " + name;  
        }
      }

    }

createBoxes():FormGroup {

 let formG:FormGroup = this.fb.group({
  Totalwaarde: new FormControl(''),
  Wergeversdeel: new FormControl(''),
  minimumHours: new FormControl(''),  
});

return formG;

}

newArrayMealBox():FormArray {
  return this.SForm.get('arrayBox') as FormArray;
}

arrayMealBox():FormArray {
  return this.MealBox.get('arrayBox') as FormArray;
}


  ngOnInit() {
    this.SForm = new FormGroup({
      CoefficientBox: new FormControl('', [Validators.required, Validators.pattern('^[0-9]$')]),

      Totalwaarde: new FormControl(''),
      Wergeversdeel: new FormControl(''),
      minimumHours: new FormControl(''),

      arrayBox: this.fb.array([
        this.createBoxes()
      ]),

    });

    //this.MealBox.push(this.SForm.get('arrayBox') as FormArray);

    this.createCoefficientArray();

    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;
      console.log('data from getStatutues(): ');
      console.log(data);
      this.isMealEnabled = new Array<number>(data.length);
      this.countStatutes = data.length;

      this.createFormArray();

      if (this.statutes.length !== 0) {
        this.emitData();
      }

    }, error => this.errorMsg = error);


  }

  createFormArray() {
    let counter:number = 0;

    this.MealBox = this.fb.array([]);

    while(counter < this.statutes.length)
    {
      this.MealBox.push(this.SForm.get('arrayBox') as FormArray);
      counter++;
    }

  }

  createCoefficientArray() {

    for (let i: number = 0; i < this.countStatutes; i++) {
      this.coefficientArray[i] = 0;
    }

  }

  onChangeCoefficient(value: number, i: number) {
    this.coefficient = value;
    this.coefficientArray[i] = value;
    console.log("coefficient data=" + this.coefficient);
    this.replaceArrayCoefficient(value, i);
  }

  onMealChange(event, ctrlid: number) {
    try {
      this.isMealEnabled[ctrlid] = event; 
      // alert('this.isMealEnabled[' + ctrlid + '] = ' + this.isMealEnabled[ctrlid]);
      // this.createArrayData(this.statutes);
      console.log('onChange');
    } catch (ex) {
      alert(ex.message);
    }
  }

  createArrayData(data: Statute[]) {

    this.statuteSettings = [];

    for (let i = 0; i < data.length; i++) 
    {
      const dataObject = data[i];

      if(i != data.length - 1)
        this.MealBox.push(this.createBoxes());

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

    console.log('created array=')
    this.emitData();

    console.log(this.statuteSettings);
  }

  totalChange(value: number, i) {

    if(this.isMealEnabled[i]===true)
    {
      console.log("totalwaarde value and i:"+value+"  "+ i);
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
      console.log("WergeversdeelChange value and i:"+value+"  "+ i);
      this.wegervaalArray[i] = value;
      this.replaceArrayWergever(i); 
    }
  }

  minimumUrenChange(value: number, i) {
    if(this.isMealEnabled[i]===true)
    {
      console.log("minimumUrenChange value and i:"+value + " "+i);
      this.minimumurenArray[i] = value;
      this.replaceArrayMinimum(i);  
    }

  }

  receiveJTdata($event, i) {

    console.log('i=' + i);
    this.statuteSelectedString = $event.selectedObject;
    this.arrayParitairCommitee = $event.arrayObject;

    // console.log(this.arrayParitairCommitee);

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

    console.log("i="+i);

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) 
    {
      this.statuteSettings[i].mealVoucherSettings.totalWorth = parseInt(this.totalArray[i],10);
    } else {
      this.createArrayData(this.statutes);
    }
    this.emitData();

  }

  replaceArrayMinimum(i: number) {

    console.log("i="+i);


    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].mealVoucherSettings.minimumHours = parseInt(this.minimumurenArray[i],10);
    } else {
      this.createArrayData(this.statutes);
    }

    this.emitData();
  }


  replaceArrayCoefficient(value:number,i: number) {

    console.log('replacing statute array');
    console.log('item to replace=' + this.coefficientArray[i]);

    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
      this.statuteSettings[i].coefficient = value;
      console.log("value received=" + value);
    } else {
      this.createArrayData(this.statutes);
    }
    this.emitData();
    console.log(this.statuteSettings);
  }

  replaceArray(i: number) {
    if (this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0) {
          this.statuteSettings[i].paritairCommitee.BrightStaffingCommitteeId = this.statuteSelectedString.BrightStaffingCommitteeId;
          this.statuteSettings[i].paritairCommitee.name = this.statuteSelectedString.name;
          this.statuteSettings[i].paritairCommitee.type = this.statuteSelectedString.type;
          this.statuteSettings[i].paritairCommitee.number = this.statuteSelectedString.number;
    }
    this.emitData();
    console.log(this.statuteSettings);
  }

  emitData() {
    this.childEvent.emit(this.statuteSettings);
  }

}
