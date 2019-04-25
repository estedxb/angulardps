import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Address, Language, Location, DpsUser, LoginToken } from '../../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationsService } from 'src/app/shared/locations.service';

@Component({
  selector: 'app-createlocation',
  templateUrl: './createlocation.component.html',
  styleUrls: ['./../../customers.component.css']
})
export class CreatelocationComponent implements OnInit {
  public languageString;
  public languageShortName;
  // public loginuserdetails: DpsUser = JSON.parse(this.setDummyDpsUserData());
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  @Input('parentData') public LocationId;

  @Input() public LocationFormData;
  LocationData: any;
  LocationForm: FormGroup;
  location: Location;
  address: Address;
  language: Language;

  constructor(private formBuilder: FormBuilder, private locationsService: LocationsService) { }

  ngOnInit() {
    console.log('Current LocationID : ' + this.LocationId);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.LocationForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      street: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]),
      number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      bus: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      place: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      postcode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-z0-9]+$')]),
      country: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])
    });
    this.createObjects();  // check validations
    this.loadLocationToEdit(this.VatNumber);
  }

  loadLocationToEdit(vatNumber: string) {
    this.locationsService.getLocationByVatNumber(vatNumber).subscribe(response => {
      response.forEach((element) => {
        if (element.id === this.LocationId) {
          this.LocationForm.controls.name.setValue(element.name);
          this.LocationForm.controls.street.setValue(element.address.street);
          this.LocationForm.controls.number.setValue(element.address.streetNumber);
          this.LocationForm.controls.bus.setValue(element.address.bus);
          this.LocationForm.controls.place.setValue(element.address.city);
          this.LocationForm.controls.postcode.setValue(element.address.postalCode);
          this.LocationForm.controls.country.setValue(element.address.country);
        }
      });
    });
  }

  receiveMessageLanguage($event) {
    this.languageString = $event.name;
    this.languageShortName = $event.shortName;
    this.createObjects();
  }

  createObjects() {
    this.location = new Location();
    this.address = new Address();
    this.language = new Language();
    // Address
    this.address.street = this.LocationForm.get('street').value;
    this.address.streetNumber = this.LocationForm.get('number').value;
    this.address.bus = this.LocationForm.get('bus').value;
    this.address.city = this.LocationForm.get('place').value;
    this.address.postalCode = this.LocationForm.get('postcode').value;
    this.address.country = this.LocationForm.get('country').value;
    // Location
    this.location.customerVatNumber = this.LocationForm.get('name').value;
    this.location.name = this.LocationForm.get('name').value;
    this.location.address = this.address;
    this.location.isEnabled = true;
    this.location.isArchived = false;
    this.setJSONObject();
  }

  setJSONObject() {
    this.LocationData = {
      id: this.LocationId,
      customerVatNumber: this.VatNumber,
      name: this.location.name,
      address: this.location.address,
      isEnabled: this.location.isEnabled,
      isArchived: this.location.isArchived,
    };
  }

  public updateData() {
    this.createObjects();
  }

  public getJSONObject() {
    if (this.LocationData !== undefined && this.LocationData !== null) {
      return this.LocationData;
    }
  }

  onSaveLocationClick() {

    this.updateData();

    console.log('LocationData=' + this.LocationData);
    console.log(this.LocationData);

    if (this.LocationData !== undefined && this.LocationData !== null) {
      // check if LocationId has value
      // if LocationId has value ==> Update Location
      // if LocationId is null ==> Create Location
      if (this.LocationId !== undefined && this.LocationId !== null) {
        // Update Location
        this.locationsService.updateLocation(this.LocationData).subscribe(res => {
          console.log('response :: ');
          console.log(res);
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
      } else {
        // Create Location
        this.locationsService.createLocation(this.LocationData).subscribe(res => {
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
}
