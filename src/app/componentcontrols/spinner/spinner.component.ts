import { Component, OnInit } from '@angular/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Spinner Button',
    spinnerSize: 18,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
  }

  constructor() { }

  ngOnInit() {

  }
  
  someFunc(): void {
    this.spinnerButtonOptions.active = true;
    setTimeout(() => {
      this.spinnerButtonOptions.active = false;
    }, 3500)
  }

  // someFunc2(): void {
  //   this.barButtonOptions.active = true;
  //   this.barButtonOptions.text = 'Saving Data...';
  //   setTimeout(() => {
  //     this.barButtonOptions.active = false;
  //     this.barButtonOptions.text = 'Progress Bar Button';
  //   }, 3500)
  // }

  // someFunc3(): void {
  //   this.fabSpinnerButtonOptions.active = true;
  //   this.fabSpinnerButtonOptions.text = 'Saving Data...';
  //   setTimeout(() => {
  //     this.fabSpinnerButtonOptions.active = false;
  //     this.fabSpinnerButtonOptions.text = 'Progress Bar Button';
  //   }, 3500)
  // }
}
