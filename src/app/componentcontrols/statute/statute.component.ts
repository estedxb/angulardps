import { Component, OnInit } from '@angular/core';
import { StatuteService } from '../../shared/statute.service';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck, 
  PhoneNumber, Address,StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance, 
  InvoiceSettings, Language, Contact } from '../../shared/models';

@Component({
  selector: 'app-statute',
  templateUrl: './statute.component.html',
  styleUrls: ['./statute.component.css']
})
export class StatuteComponent implements OnInit {
  public statutes = [];
  public errorMsg;
  public isMealEnabled = [];
  public coefficientArray = [];
  public totalArray = [];
  public wegervaalArray = [];
  public minimumurenArray = [];
  public statutename ='';
  public statuteSelectedString:ParitairCommitee;
  public arrayParitairCommitee: ParitairCommitee[];
  
  SForm:FormGroup;

  public countStatutes:number;
  public statuteSettings = [];

  StatuteSettingsObject: StatuteSetting;
  statuteObject:Statute;
  jointCommitee: ParitairCommitee;
  mealVoucherSettingsObject: MealVoucherSettings;
  paritarirCommiteeObject: ParitairCommitee;
  coefficient:number;
 
  constructor(private statuteService: StatuteService) {
    this.createCoefficientArray();

   }

  ngOnInit() {
    this.SForm = new FormGroup({
      CoefficientBox: new FormControl('',[Validators.required,Validators.pattern('^[0-9]$')]),
      Totalwaarde: new FormControl(''),
      Wergeversdeel: new FormControl(''),
      minimumHours: new FormControl('')
  });

     this.createCoefficientArray();

    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;
      console.log("data from getStatutues(): ")
      console.log(data);
      this.isMealEnabled = new Array<number>(data.length);
      this.countStatutes = data.length;
      // this.isMealEnabled[2] = true;
      // tslint:disable-next-line: prefer-for-of
      //this.createArrayData(data);

      // for (let Cnt = 0; Cnt < data.length; Cnt++) {
      //   this.isMealEnabled[Cnt] = data[Cnt].mealstatus;
      //   // alert(this.isMealEnabled[Cnt] );

      // }
    }, error => this.errorMsg = error);


  }

  createCoefficientArray(){
    for(let i=0;i<this.countStatutes;i++)
    {
        this.coefficientArray[i] = 0;
    }
  }

  onChangeCoefficient(value:number,i:number){
    this.coefficient = value;
    this.coefficientArray[i] = value;
    console.log(this.coefficient);
    this.replaceArrayCoefficient(i);
  }

  onMealChange(event, ctrlid: number){
    try {
      this.isMealEnabled[ctrlid] = event; // alert('this.isMealEnabled[' + ctrlid + '] = ' + this.isMealEnabled[ctrlid]);
      // this.createArrayData(this.statutes);
      console.log("onChange");
    } catch(ex){
      alert(ex.message);
    }
  }

  createArrayData(data:Statute[])
  {
    //this.createCoefficientArray();

    this.statuteSettings = [];

     for(let i=0;i<data.length;i++)
     {
      let dataObject = data[i];

      console.log("dataObject=");
      console.log(dataObject);
      
      this.statuteObject = new Statute();
      this.statuteObject.name = dataObject.name;
      this.statuteObject.type = dataObject.type;

      let dataPtObject = this.arrayParitairCommitee[i];

      this.paritarirCommiteeObject = new ParitairCommitee();
      this.paritarirCommiteeObject.BrightStaffingCommitteeId = dataPtObject.BrightStaffingCommitteeId;
      this.paritarirCommiteeObject.name = dataPtObject.name;
      this.paritarirCommiteeObject.number = dataPtObject.number;
      this.paritarirCommiteeObject.type = dataPtObject.type;      

      this.mealVoucherSettingsObject = new MealVoucherSettings();

      if(this.isMealEnabled[i] === true)
      {
        this.mealVoucherSettingsObject.employerShare = this.wegervaalArray[i];
        this.mealVoucherSettingsObject.minimumHours = this.minimumurenArray[i];
        this.mealVoucherSettingsObject.totalWorth = this.totalArray[i];
      }
      else
       {
        this.mealVoucherSettingsObject.employerShare = 0;
        this.mealVoucherSettingsObject.minimumHours = 0;
        this.mealVoucherSettingsObject.totalWorth = 0;
       }

        this.StatuteSettingsObject = new StatuteSetting();
        this.StatuteSettingsObject.statute = this.statuteObject;
        this.StatuteSettingsObject.paritairCommitee = this.paritarirCommiteeObject;
        this.StatuteSettingsObject.mealVoucherSettings = this.mealVoucherSettingsObject;      
        this.StatuteSettingsObject.coefficient = this.coefficientArray[i];

        this.statuteSettings.push(this.StatuteSettingsObject);
     }

     console.log("created array=")
     console.log(this.statuteSettings);
  }

  totalChange(value:number,i) {
    this.totalArray[i]= value;
    this.replaceArrayTotal(i);
  }

   WergeversdeelChange(value:number,i){
    this.wegervaalArray[i]= value;  
    this.replaceArrayWergever(i);
  }

   minimumUrenChange(value:number,i) {
    this.minimumurenArray[i]= value;  
    this.replaceArrayMinimum(i);
  }

  receiveJTdata($event,i) {
   
    console.log("i="+i);
    this.statuteSelectedString = $event.selectedObject;
    this.arrayParitairCommitee = $event.arrayObject;

    console.log(this.arrayParitairCommitee);    
    
    if(this.statuteSettings !== null && this.statuteSettings !== undefined && this.statuteSettings.length !== 0)
        this.replaceArray(i);
    else
    {
      this.createArrayData(this.statutes);
      this.replaceArray(i);
    }
 
  }

  replaceArrayWergever(i:number){

    if(this.statuteSettings !== null && this.statuteSettings !== undefined  && this.statuteSettings.length !== 0)
    {
          for(let k=0;k<this.statuteSettings.length;k++)
          {
            if(i===k)
            {
              this.statuteSettings[i].mealVoucherSettings.employerShare = this.wegervaalArray[i];
            }
          }
    }
    else {
      this.createArrayData(this.statutes);

    }
  }

  replaceArrayTotal(i:number) {

    if(this.statuteSettings !== null && this.statuteSettings !== undefined  && this.statuteSettings.length !== 0)
    {
          for(let k=0;k<this.statuteSettings.length;k++)
          {
            if(i===k)
            {
              this.statuteSettings[i].mealVoucherSettings.totalWorth = this.totalArray[i];
            }
          }
    }
    else {
      this.createArrayData(this.statutes);    
    }

  }

  replaceArrayMinimum(i:number) {

    if(this.statuteSettings !== null && this.statuteSettings !== undefined  && this.statuteSettings.length !== 0)
    {
          for(let k=0;k<this.statuteSettings.length;k++)
          {
            if(i===k)
            {
              this.statuteSettings[i].mealVoucherSettings.minimumHours = this.minimumurenArray[i];
            }
          }
    }
    else {
      this.createArrayData(this.statutes);    
    }
  }



  replaceArrayCoefficient(i:number){
    console.log("replacing statute array");
    console.log("item to replace="+this.coefficientArray[i]);
    if(this.statuteSettings !== null && this.statuteSettings !== undefined  && this.statuteSettings.length !== 0)
    {
          for(let k=0;k<this.statuteSettings.length;k++)
          {
            if(i===k)
            {
              this.statuteSettings[i].coefficient = this.coefficientArray[i];
            }
          }
    }
    else{
      this.createArrayData(this.statutes);    
    }
     console.log(this.statuteSettings)
  }

  replaceArray(i:number)
  {
    //this.createArrayData(this.statutes);

    if(this.statuteSettings !== null && this.statuteSettings !== undefined  && this.statuteSettings.length !== 0)
      {
            for(let k=0;k<this.statuteSettings.length;k++)
            {
              if(i===k)
              {
                this.statuteSettings[i].paritairCommitee.BrightStaffingCommitteeId = this.statuteSelectedString.BrightStaffingCommitteeId;
                this.statuteSettings[i].paritairCommitee.name = this.statuteSelectedString.name;
                this.statuteSettings[i].paritairCommitee.type = this.statuteSelectedString.type;
                this.statuteSettings[i].paritairCommitee.number = this.statuteSelectedString.number;
              }
            }
      }
      
      console.log(this.statuteSettings);
 }

}