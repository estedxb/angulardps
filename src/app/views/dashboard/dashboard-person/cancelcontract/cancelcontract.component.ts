import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DpsContract, ContractStatus } from 'src/app/shared/models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContractService } from 'src/app/shared/contract.service';
import { LoggingService } from 'src/app/shared/logging.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-cancelcontract',
  templateUrl: './cancelcontract.component.html',
  styleUrls: ['./cancelcontract.component.css']
})
export class CancelContractComponent implements OnInit {
  @Output() showmsg = new EventEmitter<object>();
  public currentContract: DpsContract;
  CancelContractForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CancelContractComponent>, @Inject(MAT_DIALOG_DATA) public contractData: DpsContract,
    private contractService: ContractService,
    // private spinner: NgxUiLoaderService,
    private logger: LoggingService
  ) {
    this.currentContract = contractData;
  }

  ngOnInit() {
    this.logger.log('Current Contract :: ', this.currentContract);

    this.CancelContractForm = new FormGroup({
      reasonForcancellation: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])
    });

  }
  onCancelContractClick() {
    this.currentContract.contract.cancelReason = this.CancelContractForm.get('reasonForcancellation').value;
    this.currentContract.contract.status = ContractStatus.Cancelled;
    this.logger.log('currentContract ::', this.currentContract);
    // if (this.ContractForm.valid) {
    if (this.currentContract.id !== undefined && this.currentContract.id !== null && this.currentContract.id !== 0) {
      this.logger.log('Update Contract');
      this.contractService.updateContract(this.currentContract).subscribe(res => {
        this.logger.log('  Contract Response :: ', res.body);
        this.currentContract = res.body;
        this.dialogRef.close(this.currentContract);
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
    }
  }

  onCloseCancelContract() {
    this.dialogRef.close(null);
  }

}
