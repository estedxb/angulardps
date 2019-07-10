import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoggingService } from '../../shared/logging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginToken } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-bulk-contract',
  templateUrl: './bulk-contract.component.html',
  styleUrls: ['./bulk-contract.component.css']
})
export class BulkContractComponent implements OnInit {
  public SelectedPage = 'BulkContract';
  public dpsLoginToken: LoginToken = new LoginToken();
  public vatNumber: string = '';

  public showFormIndex = 1;
  public startDate: string;
  public endDate: string;


  public blkForm: FormGroup;
  public loadSwitchperson: boolean;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private logger: LoggingService
  ) { }

  ngOnInit() {

    if (localStorage.getItem('dpsLoginToken') !== undefined &&
      localStorage.getItem('dpsLoginToken') !== '' &&
      localStorage.getItem('dpsLoginToken') !== null) {
      this.dpsLoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
      this.vatNumber = this.dpsLoginToken.customerVatNumber;
    } else {
      this.logger.log('localStorage.getItem("dpsLoginToken") not found.', this.dpsLoginToken);
      this.logger.log(this.constructor.name + ' - ' + 'Redirect... login');
      this.logger.log('Redirect Breaked 10');
      this.router.navigate(['./' + environment.B2C + environment.logInRedirectURL]);
    }

    this.blkForm = new FormGroup({
      functie: new FormControl('')
    });


  }

  receiveStartDate($event) {

  }

  receiveEndDate($event) {

  }

  onChangeI($event) {

  }

  onFormwardClick() {

  }
  onBackwardClick() {

  }

}
