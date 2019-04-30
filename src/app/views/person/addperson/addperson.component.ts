import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { CustomersService } from 'src/app/shared/customers.service';
import { ContactpersonComponent } from '../../../contactperson/contactperson.component';

@Component({
  selector: 'app-addperson',
  templateUrl: './addperson.component.html',
  styleUrls: ['./addperson.component.css']
})
export class AddpersonComponent implements OnInit {
  public persondata: any;
  public HQFormValid: boolean;
  public CTFormValid: boolean;
  public AddPersonForm1: FormGroup;
  public AddPersonForm2: FormGroup;

  public showFormIndex = 1;
  constructor(private customerService: CustomersService) { }

  ngOnInit() {
 
    this.AddPersonForm1 = new FormGroup({      
        socialSecurityNumber: new FormControl('', [Validators.required]),
        dateOfBirth: new FormControl('', [Validators.required]),
        monthOfBirth: new FormControl('', [Validators.required]),
        yearOfBirth: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        streetNumber: new FormControl('', [Validators.required]),
        bus: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        postalCode: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        mobileNumber: new FormControl('', [Validators.required]),
        telephoneNumber: new FormControl('', [Validators.required]),
        emailAddress: new FormControl('', [Validators.required]),
        language: new FormControl('', [Validators.required]),
        nationality: new FormControl('', [Validators.required]),
        birthPlace: new FormControl('', [Validators.required]),
        countryOfBirth: new FormControl('', [Validators.required]),
        iban: new FormControl('', [Validators.required]),
        bic: new FormControl('', [Validators.required]),
        travelMode: new FormControl('', [Validators.required])
   });

   this.AddPersonForm2 = new FormGroup({
        txtFunctie: new FormControl('', [Validators.required]),
        statute: new FormControl('', [Validators.required]),
        birthPlace: new FormControl('', [Validators.required]),
        yearOfBirth: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        streetNumber: new FormControl('', [Validators.required]),
        bus: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        postalCode: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        mobileNumber: new FormControl('', [Validators.required]),
        telephoneNumber: new FormControl('', [Validators.required]),
        emailAddress: new FormControl('', [Validators.required]),
        language: new FormControl('', [Validators.required]),
        nationality: new FormControl('', [Validators.required]),
        grossHourlyWage: new FormControl('', [Validators.required]),
        countryOnetExpenseAllowancefBirth: new FormControl('', [Validators.required]),
        extra: new FormControl('', [Validators.required])   
    });
 
  }

  setPersonVatNumber() {

    let ssid:string = this.AddPersonForm1.get('socialSecurityNumber').value;
    console.log("ssid="+ssid);

  }

  getPersonByVatNumber() {

    //getPersonsByVatNumber: '/api/Person/ForCustomer',
    //getPersonBySSIDNVatNumber: '/api/Person/',
    //getPersonById:'/api/Person/',

    // this.customerService.getPersonsByVatNumber(this.persondata).subscribe(res =>{
    //   console.log("response="+res);
    // },
    //  (err:HttpErrorResponse) => {
    //    if(err.error instanceof Error)
    //    {
    //      console.log("Error occured="+err.error.message);
    //    }
    //    else {
    //      console.log("response code="+err.status);
    //      console.log("response body="+err.error);
    //    }
    //  }
    // );



  
  }


  //   receiveHQdata($event) {
  //   this.HQdata = $event;
  //   console.log('received in home component HQ data');
  //   console.log(this.HQdata);
  // }

  // receiveCTdata($event) {
  //   this.CTdata = $event;
  //   console.log('received in home component CT data');
  //   console.log(this.CTdata);
  // }

  onFormwardClick() {
    this.showFormIndex = 2;

    console.log('CTdata=' + this.CTdata);
    console.log(this.CTdata);

    if (this.HQdata !== undefined && this.HQdata !== null) {
      if (this.CTdata !== undefined && this.CTdata !== null) {
        this.HQdata.contact = this.CTdata;

        console.log('HQData=' + this.HQdata);
        console.log(this.HQdata);

        this.customerService.createCustomer(this.HQdata).subscribe(
          res => {
            console.log('response=' + res);
          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log('Error occured=' + err.error.message);
            } else {
              console.log('response code=' + err.status);
              console.log('response body=' + err.error);
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
