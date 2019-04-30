import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Address, Location, DpsUser } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationsService } from 'src/app/shared/locations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-createlocation',
  templateUrl: './createlocation.component.html',
  styleUrls: ['./../../customers.component.css']
})
export class CreatelocationComponent implements OnInit {
  public currentlocation: Location;
  public countryString;
  public countryCode;
  public countryStringR;
  public countryCodeR;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber; 
  LocationForm: FormGroup;
  location: Location;
  address: Address;
  @Output() public childEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private locationsService: LocationsService, public dialogRef: MatDialogRef<CreatelocationComponent>,@Inject(MAT_DIALOG_DATA) public locationdata: Location) { 
     this.currentlocation = locationdata;
  }

  ngOnInit() {
    console.log('Current Location :: ' , this.currentlocation);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.LocationForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]),
      street: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9,. ]+$')]),
      number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      bus: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      place: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      postcode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-z0-9]+$')]),
      country: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])
    });
    this.loadLocationToEdit();
  }
  
  loadLocationToEdit() {    
    if (this.currentlocation.id !== undefined || this.currentlocation.id!==0){
      this.LocationForm.controls.name.setValue(this.currentlocation.name + '');
      this.LocationForm.controls.street.setValue(this.currentlocation.address.street + '');
      this.LocationForm.controls.number.setValue(this.currentlocation.address.streetNumber + '');
      this.LocationForm.controls.bus.setValue(this.currentlocation.address.bus + '');
      this.LocationForm.controls.place.setValue(this.currentlocation.address.city + '');
      this.LocationForm.controls.postcode.setValue(this.currentlocation.address.postalCode + '');
      this.LocationForm.controls.country.setValue(this.currentlocation.address.country + '');
      this.countryString = this.currentlocation.address.country;
      this.createObjects();  
    }
    else{
      this.currentlocation.id = 0;
    }
  }

  receiveMessageCountry($event){
    console.log("recevied event");
    console.log($event);
    if($event.countryName !== undefined && $event.countryCode !== undefined)
    {
      this.countryStringR = $event.countryName;
      this.countryCodeR = $event.countryCode;
      console.log("countryString="+this.countryString);
      this.createObjects();  
    }
  }

  updateData()
  {
    this.createObjects();
  }

  createObjects() {  
    this.currentlocation.name = this.LocationForm.get('name').value;    
    this.currentlocation.isEnabled = true;
    this.currentlocation.isArchive = false;
    this.currentlocation.address.street = this.LocationForm.get('street').value;
    this.currentlocation.address.streetNumber = this.LocationForm.get('number').value;
    this.currentlocation.address.bus = this.LocationForm.get('bus').value;
    this.currentlocation.address.city = this.LocationForm.get('place').value;
    this.currentlocation.address.postalCode = this.LocationForm.get('postcode').value;
    this.currentlocation.address.country =  this.countryString;
    this.currentlocation.address.countryCode =  this.countryCode;
    this.childEvent.emit(this.currentlocation);
  }

  public getJSONObject() {
    if (this.currentlocation !== undefined && this.currentlocation !== null) {
      return this.currentlocation;
    }
  }

  onSaveLocationClick() {
    this.createObjects();
    console.log('data ::' , this.currentlocation);
    if (this.LocationForm.valid){
      if (this.currentlocation !== undefined && this.currentlocation !== null) { 
        if (this.currentlocation.id !== 0  && this.currentlocation.id !== undefined && this.currentlocation.id !== null) {
          console.log('Update Location');
          // Update Location
          this.locationsService.updateLocation(this.currentlocation).subscribe(res => {
            console.log('Update Location Response :: ', res);            
            this.dialogRef.close();
          },
            (err: HttpErrorResponse) => {
              console.log('Error :: ');
              console.log(err);
              if (err.error instanceof Error) {
                console.log('Error occured=' + err.error.message);
              } else {
                console.log('response code=' + err.status);
                console.log('response body=' + err.error);
              }
            }
          );
          //this.dialogRef.close();
        } else {
          console.log('Create Location');          
          this.locationsService.createLocation(this.currentlocation).subscribe(res => {
            console.log('Create Location Response :: ' , res);
            this.currentlocation.id = res;
            
            this.dialogRef.close();
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
          //this.dialogRef.close();
        }
      }
    } else {
        console.log('Form is Not Vaild');
    }
  }
}
