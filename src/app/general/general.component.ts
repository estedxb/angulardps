import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck, 
  PhoneNumber, Address,StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance, 
  InvoiceSettings, Language, Contact } from '../shared/models';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  vcaObject:VcaCertification;
  blkContracten: boolean;

  @Output() public childEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.vcaObject = new VcaCertification();
    this.blkContracten = false;
  }

  changeVca($event){

    this.vcaObject.cerified = $event;
    this.emitData();
  }

  changeBlk($event){
    this.blkContracten = $event;
    this.emitData();
  }

  emitData(){
    
    let obj:any = { "vcaObject": this.vcaObject, "blk": this.blkContracten};

    this.childEvent.emit(obj);

  }

}
