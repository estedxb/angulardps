import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Address, Location, DpsUser, LoginToken } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationsService } from 'src/app/shared/locations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { LoggingService } from '../../../../shared/logging.service';
@Component({
  selector: 'app-createlocation',
  templateUrl: './createlocation.component.html',
  styleUrls: ['./../../customers.component.css']
})
export class CreatelocationComponent implements OnInit {
  public currentLocation: Location;
  public countryString;
  public countryCode;
  public countryStringR;
  public countryCodeR;
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public VatNumber = this.dpsLoginToken.customerVatNumber;

  LocationForm: FormGroup;
  // location: Location;
  address: Address;
  @Output() public childEvent = new EventEmitter();
  @Output() showmsg = new EventEmitter<object>();

  constructor(
    private formBuilder: FormBuilder, private locationsService: LocationsService, private logger: LoggingService,
    public dialogRef: MatDialogRef<CreatelocationComponent>, @Inject(MAT_DIALOG_DATA) public locationdata: Location) {
    this.currentLocation = locationdata;
  }

  ngOnInit() {
    this.logger.log('Current Location :: ', this.currentLocation);
    this.logger.log('Current VatNumber : ' + this.VatNumber);
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
    if (this.currentLocation.id !== undefined || this.currentLocation.id !== 0) {
      this.LocationForm.controls.name.setValue(this.currentLocation.name + '');
      this.LocationForm.controls.street.setValue(this.currentLocation.address.street + '');
      this.LocationForm.controls.number.setValue(this.currentLocation.address.streetNumber + '');
      this.LocationForm.controls.bus.setValue(this.currentLocation.address.bus + '');
      this.LocationForm.controls.place.setValue(this.currentLocation.address.city + '');
      this.LocationForm.controls.postcode.setValue(this.currentLocation.address.postalCode + '');
      this.LocationForm.controls.country.setValue(this.currentLocation.address.country + '');
      this.countryString = this.currentLocation.address.country;
      this.createObjects();
    } else {
      this.currentLocation.id = 0;
    }
  }

  ShowMessage(msg, action) {
    this.showmsg.emit({ MSG: msg, Action: action });
  }

  receiveMessageCountry($event) {
    this.logger.log('recevied event');
    this.logger.log($event);
    if ($event.countryName !== undefined && $event.countryCode !== undefined) {
      this.countryStringR = $event.countryName;
      this.countryCodeR = $event.countryCode;
      this.logger.log('countryString=' + this.countryString);
      this.createObjects();
    }
  }

  updateData() { this.createObjects(); }

  createObjects() {
    this.currentLocation.name = this.LocationForm.get('name').value;
    this.currentLocation.address.street = this.LocationForm.get('street').value;
    this.currentLocation.address.streetNumber = this.LocationForm.get('number').value;
    this.currentLocation.address.bus = this.LocationForm.get('bus').value;
    this.currentLocation.address.city = this.LocationForm.get('place').value;
    this.currentLocation.address.postalCode = this.LocationForm.get('postcode').value;
    this.currentLocation.address.country = this.countryStringR;
    this.currentLocation.address.countryCode = this.countryCodeR;
    this.childEvent.emit(this.currentLocation);
  }

  public getJSONObject() {
    if (this.currentLocation !== undefined && this.currentLocation !== null) {
      return this.currentLocation;
    }
  }

  onSaveLocationClick() {
    this.createObjects();
    this.logger.log('data ::', this.currentLocation);
    if (this.LocationForm.valid) {
      if (this.currentLocation !== undefined && this.currentLocation !== null) {
        if (this.currentLocation.id !== 0 && this.currentLocation.id !== undefined && this.currentLocation.id !== null) {
          this.logger.log('Update Location');
          // Update Location
          this.locationsService.updateLocation(this.currentLocation).subscribe(res => {
            this.logger.log('Update Location Response :: ', res);
            this.dialogRef.close(this.currentLocation);
          },
            (err: HttpErrorResponse) => {
              this.logger.log('Error :: ');
              this.logger.log(err);
              if (err.error instanceof Error) {
                this.logger.log('Error occured=' + err.error.message);
              } else {
                this.logger.log('response code=' + err.status);
                this.logger.log('response body=' + err.error);
              }
            }
          );
          // this.dialogRef.close();
        } else {
          this.logger.log('Create Location');
          this.locationsService.createLocation(this.currentLocation).subscribe(res => {
            this.logger.log('  Location Response :: ', res.body);
            this.currentLocation.id = res.body;
            this.dialogRef.close(this.currentLocation);
          },
            (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
                this.logger.log('Error occured=' + err.error.message);
              } else {
                this.logger.log('response code=' + err.status);
                this.logger.log('response body=' + err.error);
              }
            }
          );
          // this.dialogRef.close();
        }
      }
    } else {
      this.logger.log('Form is Not Vaild');
    }
  }
}
