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

    this.logger.log("change vca called");
    this.logger.log($event);

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

    this.logger.log("before sending value=");
    this.logger.log(this.vcaObject);

    this.logger.log("blk contracten");
    this.logger.log(this.blkContracten);

    let obj: any = { "vcaObject": this.vcaObject, "blk": this.blkContracten };

    this.childEvent.emit(obj);

  }

}
