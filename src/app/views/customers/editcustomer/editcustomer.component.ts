import { Component, OnInit } from '@angular/core';
import { Contact, DPSCustomer, Customer, InvoiceSettings, CreditCheck, Language, EmailAddress, PhoneNumber } from 'src/app/shared/models';


@Component({
  selector: 'app-editcustomer',
  templateUrl: './editcustomer.component.html',
  styleUrls: ['./../customers.component.css']
})
export class EditcustomerComponent implements OnInit {

  public HQdata:any;
  public CTdata:any;
  public GLdata:any;
  public STdata:any;
  public FPdata:any;

  constructor() { }

  ngOnInit() {
  }

  receiveHQdata($event) {

    this.HQdata = $event;
    console.log("received in editcustomer component");
    console.log(this.HQdata);

  }

  receiveCTdata($event) {

    this.CTdata = $event;
    console.log("updated in editcustomer component");
    console.log(this.HQdata);

  }

  receiveGeneralObject($event) {

    this.GLdata = $event;
    console.log("received in editcustomer component");
    console.log(this.HQdata);

  }

  receiveStatuteData($event) {

    this.STdata = $event;
    console.log("received in editcustomer component");
    console.log(this.HQdata);

  }

  receiveInvoiceData($event) {

    this.FPdata = $event;
    console.log("received in editcustomer component");
    console.log(this.HQdata);

  }

  editCustomerApi() {

    if(this.HQdata !== null && this.HQdata !== undefined)
    {

      if(this.CTdata !== null && this.CTdata !== undefined)
          this.HQdata.contact = this.CTdata;

      if(this.GLdata !== null && this.GLdata !== undefined)
      {
          this.HQdata.customer.vcaCertification = this.GLdata.vcaObject;
          this.HQdata.bulkContractsEnabled = this.GLdata.blk;      
      }

      if(this.STdata !== null && this.STdata !== undefined)
      {
          this.HQdata.statuteSettings = this.STdata;
      }

      if(this.FPdata !== null && this.FPdata !== undefined && this.FPdata !== "")
      {
        console.log("fp data=");
        console.log(this.FPdata);

        this.HQdata.invoiceSettings.lieuDaysAllowance = this.FPdata.lieuDaysAllowance;
        this.HQdata.invoiceSettings.sicknessInvoiced = this.FPdata.sicknessInvoiced;
        this.HQdata.invoiceSettings.holidayInvoiced = this.FPdata.holidayInvoiced;
        this.HQdata.invoiceSettings.mobilityAllowance = this.FPdata.mobilityAllowance;
        this.HQdata.invoiceSettings.shiftAllowance = this.FPdata.shiftAllowance;
        this.HQdata.invoiceSettings.shiftAllowances = this.FPdata.shiftAllowances;
        this.HQdata.invoiceSettings.otherAllowances = this.FPdata.otherAllowances;    

      }

      console.log("consolidated json object=");
      console.log(this.HQdata);

    }


    }
}
