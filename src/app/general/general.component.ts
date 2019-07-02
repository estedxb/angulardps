import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoggingService } from '../shared/logging.service';
import {
  DPSCustomer, Customer, EmailAddress, VcaCertification, CreditCheck,
  PhoneNumber, Address, StatuteSetting, Statute, ParitairCommitee, MealVoucherSettings,
  LieuDaysAllowance, MobilityAllowance, ShiftAllowance, OtherAllowance,
  InvoiceSettings, Language, Contact
} from '../shared/models';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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

  @Input() public GLFormData;
  @Output() public childEvent = new EventEmitter();

  constructor(
    // private spinner: NgxUiLoaderService,
    private logger: LoggingService
  ) {
    this.loadVCA = false;
    this.loadBlk = false;
  }

  ngDoCheck() {

    if (this.GLFormData !== undefined) {
      if (this.GLFormData.data !== null) {
        this.loadBlk = this.GLFormData.data.bulkContractsEnabled;
        if (this.GLFormData.data.customer !== null && this.GLFormData.page === "edit") {
          this.loadVCA = this.GLFormData.data.customer.vcaCertification.cerified;
        }
      }
    }

  }

  ngOnInit() {
    this.vcaObject = new VcaCertification();
    this.vcaObject.cerified = false;
    this.blkContracten = false;    

    this.emitData();
  }


  changeVca($event) {

    this.vcaObject.cerified = $event;
    this.emitData();
  }

  changeBlk($event) {
    this.blkContracten = $event;
    this.emitData();
  }

  emitData() {

    let obj: any = { "vcaObject": this.vcaObject, "blk": this.blkContracten };

    this.childEvent.emit(obj);

  }

}
