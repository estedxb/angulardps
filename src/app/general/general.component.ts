import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoggingService } from '../shared/logging.service';
import {
  DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck,
  PhoneNumber, Address, StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance,
  InvoiceSettings, Language, Contact
} from '../shared/models';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  vcaObject: VcaCertification;
  blkContracten: boolean;

  public loadVCA: boolean;
  public loadBlk: boolean;
  public changeVCA: boolean;
  public changeBLK: boolean;

  @Input() public GLFormData;
  @Output() public childEvent = new EventEmitter();

  constructor(private logger: LoggingService) {
    this.loadVCA = false;
    this.loadBlk = false;
    this.changeVCA = false;
    this.changeBLK = false;
  }

  ngDoCheck() {

    if (this.GLFormData !== undefined) {
      if (this.GLFormData.data !== null) {
        this.loadBlk = this.GLFormData.data.bulkContractsEnabled;
        this.blkContracten = this.loadBlk;
        if (this.GLFormData.data.customer !== null && this.GLFormData.page === "edit") {
          if(this.GLFormData.data.customer.vcaCertification !== null && this.GLFormData.data.customer.vcaCertification !== undefined)
              this.loadVCA = this.GLFormData.data.customer.vcaCertification.cerified;
          if (this.vcaObject !== undefined && this.vcaObject !== null)
            this.vcaObject.cerified = this.loadVCA;
        }
      }
    }

  }

  ngOnInit() {
    this.vcaObject = new VcaCertification();
    this.vcaObject.cerified = this.loadVCA;
    this.blkContracten = this.loadBlk;
    //this.emitData();
  }


  changeVca($event) {
    this.vcaObject = new VcaCertification();
    this.changeVCA = $event;
    this.vcaObject.cerified = $event;
    this.emitData();
  }

  changeBlk($event) {
    this.changeBLK = $event;
    this.blkContracten = $event;
    this.emitData();
  }

  emitData() {
    let obj: any = { "vcaObject": this.vcaObject, "blk": this.blkContracten };
    this.childEvent.emit(obj);
  }

}
