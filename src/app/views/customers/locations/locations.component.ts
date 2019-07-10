import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Location, LoginToken, DpsUser, Address } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationsService } from '../../../shared/locations.service';
import { CreatelocationComponent } from './createlocation/createlocation.component';
import { LoggingService } from '../../../shared/logging.service';
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./../customers.component.css']
})
export class LocationsComponent implements OnInit {
  @Input() CustomerVatNumber: string;
  public maindatas = [];
  public datas = [];
  public data: Location;
  public address: Address;
  public errorMsg;
  public SelectedIndex = -1;
  public SelectedEnableStatus = true;
  public durationInSeconds = 5;
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));

  constructor(
    private locationsService: LocationsService,
    private logger: LoggingService,
    private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
    this.logger.log('CustomerVatNumber ::', this.CustomerVatNumber);
    this.locationsService.getLocationByVatNumber(this.CustomerVatNumber).subscribe(locations => {
      this.maindatas = locations;
      this.FilterTheArchive();
      this.logger.log('Locations Forms Data : ', this.maindatas);
      // this.logger.ShowMessage('Locations is listed successfully.', '');
    }, error => this.logger.ShowMessage(error, 'error'));
  }

  FilterTheArchive() { this.datas = this.maindatas.filter(d => d.isArchived === false); }

  openDialog(): void {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '700px';
      dialogConfig.data = this.data;
      dialogConfig.ariaLabel = 'Arial Label Location Dialog';

      const dialogRef = this.dialog.open(CreatelocationComponent, dialogConfig);

      const sub = dialogRef.componentInstance.showmsg.subscribe(($event) => {
        this.logger.ShowMessage($event.MSG, $event.Action);
      });

      dialogRef.afterClosed().subscribe(result => {
        this.logger.log('The dialog was closed');
        this.onPageInit();
        /*
        this.data = result;
        this.logger.log('this.data ::', this.data);
        if (this.SelectedIndex > -1) {
          // maindatas Update location
          this.maindatas[this.SelectedIndex] = this.data;
          this.FilterTheArchive();
          this.logger.ShowMessage('Locations "' + this.data.name + '" is updated successfully.', '');
        } else {
          // maindatas Add location
          this.logger.log('this.data.id :: ', this.data.id);
          if (parseInt('0' + this.data.id, 0) > 0) {
            this.maindatas.push(this.data);
            this.logger.log('New Location Added Successfully :: ', this.maindatas);
            this.FilterTheArchive();
            this.logger.ShowMessage('Locations "' + this.data.name + '" is added successfully.', '');
          }
        }
        */
      });
    } catch (e) { }
  }

  onClickAdd() {
    this.SelectedIndex = -1;

    this.data = new Location();
    this.address = new Address();
    this.address.street = '';
    this.address.streetNumber = '';
    this.address.bus = '';
    this.address.city = '';
    this.address.country = 'Belgium';
    this.address.countryCode = 'nl';
    this.address.postalCode = '';

    this.data.id = 0;
    this.data.name = '';
    this.data.customerVatNumber = this.CustomerVatNumber;
    this.data.address = this.address;
    this.data.isArchived = false;
    this.data.isEnabled = true;
    this.openDialog();
  }

  onClickEdit(i) {
    this.SelectedIndex = i;
    this.logger.log('Edit Clicked Index :: ' + this.SelectedIndex);
    this.data = this.datas[this.SelectedIndex];
    this.openDialog();
    return true;
  }

  updateLocations() {
    this.locationsService.updateLocation(this.data).subscribe(res => {
      this.logger.log('response :: ', res); this.logger.log('Data ::', this.data);
      // this.datas[this.SelectedIndex] = this.data;
      // this.FilterTheArchive();
      this.onPageInit();
    },
      (err: HttpErrorResponse) => {
        this.logger.log('Error :: ', err);
        if (err.error instanceof Error) {
          this.logger.log('Error occured=' + err.error.message);
        } else {
          this.logger.log('response code=' + err.status, 'response body=' + err.error);
        }
      }
    );
  }

  onClickDelete(i) {
    this.SelectedIndex = i;
    this.logger.log('Delete Clicked Index:: ' + i);
    this.data = this.datas[i];
    this.data.isArchived = true;
    this.updateLocations();
    this.logger.ShowMessage('Locations "' + this.data.name + '" is deleted successfully.', '');
  }

  onStatusChange(event, i) {
    this.SelectedIndex = i;
    this.logger.log('Location index : ' + this.SelectedIndex + ', Enabled : ' + event);
    this.data = this.datas[i];
    this.data.isEnabled = event;
    this.updateLocations();
    let EnabledStatus = '';
    if (event) { EnabledStatus = 'enabled'; } else { EnabledStatus = 'disabled'; }
    this.logger.ShowMessage('Locations "' + this.data.name + '" is ' + EnabledStatus + ' successfully.', '');
  }
}
