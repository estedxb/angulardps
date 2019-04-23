import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { CustomersService } from 'src/app/shared/customers.service';
import { ContactpersonComponent } from '../../contactperson/contactperson.component';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Contact, DPSCustomer, Customer, InvoiceSettings, CreditCheck, Language, EmailAddress, PhoneNumber } from 'src/app/shared/models';

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
    this.HQFormValid =  true;
    this.CTFormValid = true;
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
    this.HQFormValid =  this.HQdata.formValid;
    console.log("received in home component HQ data");
    console.log(this.HQdata);
  }

  receiveCTdata($event){
    this.CTdata = $event;
    this.CTFormValid = this.CTdata.formValid;
    console.log("received in home component CT data");
    console.log(this.CTdata);
  }

  onFormwardClick() {

    if(this.showFormIndex === 1)
    {
    
      console.log("CTdata="+this.CTdata);
      console.log(this.CTdata);
      console.log("HQdata="+this.HQdata);
      console.log(this.HQdata);

      console.log("validity data="+this.HQdata.formValid);
  
     if(this.HQdata !== undefined && this.HQdata !== null && this.CTdata !== undefined && this.CTdata !== null)
       {
        // if(this.CTdata !== undefined && this.CTdata !== null)
        // {
           
          if(this.HQdata.formValid === true && this.CTdata.formValid === true)
          {
            this.showFormIndex = 2;
          
            delete this.HQdata.formValid;
            delete this.CTdata.formValid;

            this.HQdata.activateContactAsUser = this.CTdata.activateContactAsUser;
            this.HQdata.contact = this.CTdata.contact

              console.log("updated HQData="+this.HQdata);
              console.log(this.HQdata.contact);    
              console.log(this.CTdata.contact);    

  
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
          // }
                    
        }
      } 

      else {
        console.log("HQdata or CTdata is null or undefined !!")
      }


    }
    else if(this.showFormIndex === 2)
    {
      console.log("Complete data=");
      console.log(this.GLdata);
      console.log("HQdata");
      console.log(this.HQdata);
      console.log("this STdata");
      console.log(this.STdata);
      // "vcaObject": this.vcaObject, "blk": this.blkContracten
      
      if(this.GLdata !== null && this.GLdata !== undefined && this.GLdata !== "")
      {
        if(this.HQdata !== null && this.HQdata !== undefined && this.HQdata !== "")
        {
          this.HQdata.customer.vcaCertification = this.GLdata.vcaObject;
          this.HQdata.bulkContractsEnabled = this.GLdata.blk;
        }
        else 
        {
          this.HQdata = new DPSCustomer();
          this.HQdata.customer = new Customer();
          this.HQdata.customer.vatNumber = "23232323";
          this.HQdata.customer.name = "hello";
          this.HQdata.customer.officialName = "new name";
          this.HQdata.customer.legalForm = "legal";

          this.HQdata.customer.creditCheck = new CreditCheck();
          this.HQdata.customer.creditCheck.creditcheck = false;
          this.HQdata.customer.creditCheck.creditLimit = 1000;
          this.HQdata.customer.creditCheck.dataChecked = "02/19/2019";
          this.HQdata.customer.creditCheck.creditCheckPending = true;

          this.HQdata.customer.vcaCertification = { certified: false};          
          this.HQdata.bulkContractsEnabled = false;
        }

        console.log("updated hqdata");
        console.log(this.HQdata);
      }

      if(this.CTdata !== null && this.CTdata !== undefined)
      {
        console.log(this.CTdata.contact);
      }
      else
       {

        console.log("no contact data");
         this.HQdata.contact = new Contact();
         this.HQdata.contact.firstName = "blah";
         this.HQdata.contact.lastName = "ajsdf";
         this.HQdata.contact.postion = "asdfs";

         this.HQdata.contact.email = new EmailAddress();
         this.HQdata.contact.email.emailAddress = "asdfadsf@gmail.com";

         this.HQdata.contact.mobile  = new PhoneNumber();
         this.HQdata.contact.mobile.number = "+93434343434";

         this.HQdata.contact.phoneNumber  = new PhoneNumber();
         this.HQdata.contact.phoneNumber.number = "+93434343434";
         
         this.HQdata.contact.language = new Language();
         this.HQdata.contact.language.name = "asfd";
         this.HQdata.contact.language.shortName = "ad";

       }

      if(this.STdata !== null && this.STdata !== undefined)
      {
        this.HQdata.statuteSettings = this.STdata;
      }

      if(this.FPdata !== null && this.FPdata !== undefined && this.FPdata !== "")
      {
        console.log("fp data=");
        console.log(this.FPdata);

        // if(this.HQdata !== null)
        // {
        //   if(this.HQdata.invoiceSettings !== null && this.HQdata.invoiceSettings !== undefined)
        //     {
        //       this.HQdata.invoiceSettings.lieuDaysAllowance = this.FPdata.lieuDaysAllowance;
        //       this.HQdata.invoiceSettings.sicknessInvoiced = this.FPdata.sicknessInvoiced;
        //       this.HQdata.invoiceSettings.holidayInvoiced = this.FPdata.holidayInvoiced;
        //       this.HQdata.invoiceSettings.mobilityAllowance = this.FPdata.mobilityAllowance;
        //       this.HQdata.invoiceSettings.shiftAllowance = this.FPdata.shiftAllowance;
        //       this.HQdata.invoiceSettings.shiftAllowances = this.FPdata.shiftAllowances;
        //       this.HQdata.invoiceSettings.otherAllowances = this.FPdata.otherAllowances;    
        //     }
        //   else {
        //     this.HQdata.customer.vatNumber = "234343434";
        //     this.HQdata.invoiceSettings = new InvoiceSettings();
        //     this.HQdata.invoiceSettings.lieuDaysAllowance = this.FPdata.lieuDaysAllowance;
        //     this.HQdata.invoiceSettings.sicknessInvoiced = this.FPdata.sicknessInvoiced;
        //     this.HQdata.invoiceSettings.holidayInvoiced = this.FPdata.holidayInvoiced;
        //     this.HQdata.invoiceSettings.mobilityAllowance = this.FPdata.mobilityAllowance;
        //     this.HQdata.invoiceSettings.shiftAllowance = this.FPdata.shiftAllowance;
        //     this.HQdata.invoiceSettings.shiftAllowances = this.FPdata.shiftAllowances;
        //     this.HQdata.invoiceSettings.otherAllowances = this.FPdata.otherAllowances;              
        //   }
        // }

      }

      console.log(this.HQdata);

      this.updateData();
    }
  }

  updateData() {
    this.customerService.createCustomerUpdate(this.HQdata).subscribe(res =>{
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
