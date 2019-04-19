import { Component, OnInit } from '@angular/core';
import { StatuteService } from '../../shared/statute.service';
// import * as All from '../../shared/models';

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
  public statutename ='';
  public statuteSelectedString:string;

  public countStatutes:number;
  public statuteSettings = [];

  StatuteSettingsObject: StatuteSetting;
  statuteObject:Statute;
  ParitairCommiteeObject: ParitairCommitee;
  mealVoucherSettingsObject: MealVoucherSettings;

 
  constructor(private statuteService: StatuteService) { }

  ngOnInit() {
    this.statuteService.getStatutes().subscribe(data => {
      this.statutes = data;
      this.isMealEnabled = new Array<number>(data.length);
      this,this.countStatutes = data.length;
      // this.isMealEnabled[2] = true;
      // tslint:disable-next-line: prefer-for-of
      this.createArrayData(data);

      for (let Cnt = 0; Cnt < data.length; Cnt++) {
        this.isMealEnabled[Cnt] = data[Cnt].mealstatus;
        // alert(this.isMealEnabled[Cnt] );

      }
    }, error => this.errorMsg = error);


  }

  onChange(event, ctrlid: number){
    try {
      this.isMealEnabled[ctrlid] = event; // alert('this.isMealEnabled[' + ctrlid + '] = ' + this.isMealEnabled[ctrlid]);
      this.createArrayData(this.statutes);
    } catch(ex){
      alert(ex.message);
    }
  }

  createArrayData(data:Statute[])
  {
    // name: string;
    // type?: string;
    // mealstatus?: boolean;
    // jointcommitee?: ParitairCommitee;

   
   // statute: Statute; paritairCommitee?: ParitairCommitee; coefficient?: number; mealVoucherSettings?: MealVoucherSettings;

  //  "bulkContractsEnabled": false,
  //  "statuteSettings": [
  //      {
  //          "statute": {
  //              "name": ""
  //          },
  //          "coefficient": 0,
  //          "paritairCommitee": {
  //              "name": "",
  //              "number": ""
  //          },
  //          "mealVoucherSettings": {
  //              "employerShare": 0,
  //              "minimumHours": 0,
  //              "totalWorth": 0
  //          }
  //      }
  //  ],

    console.log("create data called data lenght="+data.length);

     for(let i=0;i<data.length;i++)
     {
        // this.StatuteSettingsObject = new StatuteSetting();
        // this.statuteObject = new Statute();
        // this.statuteObject.BrightStaffingCommitteeId = data[i].BrightStaffingCommitteeId;
        // this.statuteObject.number = data[i].number;
        // this.statuteObject.name = data[i].name;
        // this.statuteObject.type = data[i].type;

        console.log(this.statuteObject);
     }

     console.log("statute object="+this.statuteObject);

  // ParitairCommiteeObject: ParitairCommitee;
  // mealVoucherSettingsObject: MealVoucherSettings;
 
  }


  receiveJTdata($event,i) {
   
    console.log("i="+i);
    this.statuteSelectedString = $event;
    this.createArrayData(this.statutes);
    this.replaceArray();
  }

  replaceArray()
  {
 }

}
