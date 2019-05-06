import { Component, OnInit, Inject } from '@angular/core';
import { Contract, DpsUser } from 'src/app/shared/models';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-createcontract',
  templateUrl: './createcontract.component.html',
  styleUrls: ['./createcontract.component.css']
})
export class CreatecontractComponent implements OnInit {
  ContractForm: FormGroup
  public currentContract: Contract;
  public maindatas = []; 
  public errorMsg;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;

  constructor( private formBuilder: FormBuilder,public dialogRef: MatDialogRef<CreatecontractComponent>, @Inject(MAT_DIALOG_DATA) public contractData: Contract) { 
    this.currentContract = contractData;
  }

  ngOnInit() {
    console.log('Current Contract :: ', this.currentContract);
    console.log('Current VatNumber : ' + this.VatNumber);
    this.ContractForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      position: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      // startDateDay: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      // startDateMonth: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      // startDateYear: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      // endDateDay: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')]),
      // endDateMonth: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]),
      // endDateYear: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')])     
    });    
    this.loadUserToEdit();
  }

  loadUserToEdit() {
    console.log('this.currentContract :: ', this.currentContract);
    if (this.currentContract !== null) {
      
        this.ContractForm.controls.firstname.setValue(this.currentContract.name);
        this.ContractForm.controls.lastname.setValue(this.currentContract.name);
        this.ContractForm.controls.position.setValue(this.currentContract.position);
        // this.ContractForm.controls.startDateDay.setValue(this.currentUser.userRole);
        // this.ContractForm.controls.startDateMonth.setValue(this.currentUser.user.mobile.number);
        // this.ContractForm.controls.startDateYear.setValue(this.currentUser.user.phone.number);
        this.ContractForm.controls.position.setValue(this.currentContract.position);
  }
}
}

    
