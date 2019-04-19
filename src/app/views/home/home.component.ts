import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { CustomersService } from 'src/app/shared/customers.service';
import { ContactpersonComponent } from '../../contactperson/contactperson.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public HQdata:any;
  public CTdata:any;

  public showFormIndex = 1;
  constructor(private customerService:CustomersService) { }

  ngOnInit() {
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

    this.showFormIndex = 2;

    console.log("CTdata="+this.CTdata);
    console.log(this.CTdata);

   if(this.HQdata !== undefined && this.HQdata !== null)
     {
      if(this.CTdata !== undefined && this.CTdata !== null){

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

  onBackwardClick() {
    this.showFormIndex = 1;



  }

}
