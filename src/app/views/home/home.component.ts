import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { CustomersService } from 'src/app/shared/customers.service';
import { ContactpersonComponent } from '../../contactperson/contactperson.component';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public HQdata:any;
  public CTdata:any;
  public GLdata:any;
  public STdata:any;
  public FPdata:any;

  public HQFormValid:boolean;
  public CTFormValid:boolean;

  public showFormIndex = 2;
  constructor(private customerService:CustomersService) { }

  ngOnInit() {
  }

  receiveData($event,i){
    if(i==0)
      this.HQdata = $event;
    if(i==1)
      this.CTdata = $event;
    if(i==2)
      this.GLdata = $event;
    if(i===3)
      this.STdata = $event;
    if(i==4)
      this.FPdata = $event;
  }

  receiveGeneralObject($event) {
    console.log("received in home component GL data");
      this.GLdata = $event;
      console.log(this.GLdata);
  }

  receiveStatuteData($event) {
    console.log("received in home component ST data");
    this.STdata = $event;
    console.log(this.STdata);
  }

  receiveInvoiceData($event) {
    console.log("received in home component IS data");
    this.FPdata = $event;
    console.log(this.FPdata);
  }

  receiveHQdata($event) {
    this.HQdata = $event;
    console.log("received in home component HQ data");
    console.log(this.HQdata);
  }

  receiveCTdata($event){
    this.CTdata = $event;
    console.log("received in home component CT data");
    console.log(this.CTdata);
  }

  onFormwardClick() {

    if(this.showFormIndex === 1)
    {
      this.showFormIndex = 2;
    
      console.log("CTdata="+this.CTdata);
      console.log(this.CTdata);
  
     if(this.HQdata !== undefined && this.HQdata !== null)
       {
        if(this.CTdata !== undefined && this.CTdata !== null){
           
          if(this.HQdata.formValid === true && this.CTdata.formValid === true)
          {
            
            delete this.HQdata.formValid;
            delete this.CTdata.formValid;

            this.HQdata.contact = this.CTdata;

              console.log("HQData="+this.HQdata);
              console.log(this.HQdata);    
  
              this.customerService.createCustomer(this.HQdata).subscribe(res =>{
                console.log("response="+res);
              },
              (err:HttpErrorResponse) => {
                if(err.error instanceof Error)
                {
                  console.log("Error occured="+err.error.message);
                }
                else {
                  console.log("response code="+err.status);
                  console.log("response body="+err.error);
                }
              }
              );  
          }
                    
        }
      } 
    }
    else if(this.showFormIndex === 2)
    {
      console.log("Complete data=");
      console.log(this.GLdata);

      // "vcaObject": this.vcaObject, "blk": this.blkContracten
      
      if(this.GLdata !== null && this.GLdata !== undefined && this.GLdata !== "")
      {
        this.HQdata.vcaCertification = this.GLdata.vcaObject;
        this.HQdata.bulkContractsEnabled = this.GLdata.blk;  
      }
      else {

        this.HQdata.vcaCertification = { certified: false};
        this.HQdata.bulkContractsEnabled = false;
      }

      if(this.STdata !== null && this.STdata !== undefined && this.STdata !== "")
      {
        this.HQdata.statuteSettings = this.STdata;
      }

      if(this.FPdata !== null && this.FPdata !== undefined && this.FPdata !== "")
      {
          this.HQdata.invoiceSettings.lieuDaysAllowance = this.FPdata.lieuDaysAllowance;
          this.HQdata.invoiceSettings.sicknessInvoiced = this.FPdata.sicknessInvoiced;
          this.HQdata.invoiceSettings.holidayInvoiced = this.FPdata.holidayInvoiced;
          this.HQdata.invoiceSettings.mobilityAllowance = this.FPdata.mobilityAllowance;
          this.HQdata.invoiceSettings.shiftAllowance = this.FPdata.shiftAllowance;
          this.HQdata.invoiceSettings.shiftAllowances = this.FPdata.shiftAllowances;
          this.HQdata.invoiceSettings.otherAllowances = this.FPdata.otherAllowances;
      }

      console.log(this.HQdata);

      this.updateData();
    }
  }

  updateData() {
    this.customerService.createCustomer(this.HQdata).subscribe(res =>{
      console.log("response="+res);
    },
     (err:HttpErrorResponse) => {
       if(err.error instanceof Error)
       {
         console.log("Error occured="+err.error.message);
       }
       else {
         console.log("response code="+err.status);
         console.log("response body="+err.error);
       }
     }
    );  
  }

  onBackwardClick() {
    this.showFormIndex = 1;

  }

}
